import crypto from "node:crypto";
import { accessToken } from "./auth.mjs";

/*
 * The HTTP layer. Every Merlin request goes through `call`, so bearer handling,
 * token refresh and error decoding exist exactly once.
 */

export class AuthRequired extends Error {
  constructor(message = "Not logged in. Run: npm run merlin -- login") {
    super(message);
    this.name = "AuthRequired";
  }
}

export class ApiError extends Error {
  constructor(status, code, message, requestId) {
    super(message || `${code} (HTTP ${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

async function decode(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

/**
 * One Merlin API call.
 *
 * A 401 means the token is dead, so it is refreshed and the call retried ONCE — the
 * platform's access tokens live an hour, and a long build session will cross that.
 * More than one retry would just be a slow way to fail.
 */
export async function call(baseUrl, method, path, { body, idempotent = false, retry = true } = {}) {
  const token = await accessToken(baseUrl);
  if (!token) throw new AuthRequired();

  const headers = { authorization: `Bearer ${token}` };
  if (body !== undefined) headers["content-type"] = "application/json";
  // Cost-bearing routes require it; the platform rejects the request without one.
  if (idempotent) headers["idempotency-key"] = crypto.randomUUID();

  const response = await fetch(`${baseUrl}/v1${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && retry) {
    const refreshed = await accessToken(baseUrl, { force: true });
    if (refreshed) return await call(baseUrl, method, path, { body, idempotent, retry: false });
    throw new AuthRequired("Your Merlin session expired. Run: npm run merlin -- login");
  }
  if (response.status === 429) {
    const after = response.headers.get("retry-after");
    throw new ApiError(429, "rate_limit_exceeded", `Rate limited${after ? `; retry in ${after}s` : ""}.`);
  }
  if (response.status === 204) return null;

  const payload = await decode(response);
  if (!response.ok) {
    const error = payload?.error ?? {};
    throw new ApiError(response.status, error.code ?? "http_error", error.message ?? payload.raw, error.request_id);
  }
  return payload.data;
}

/** Public R2 objects — trees, previews, twins. No bearer: they are unauthenticated by design. */
export async function fetchPublic(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${url} (HTTP ${response.status})`);
  return response;
}
