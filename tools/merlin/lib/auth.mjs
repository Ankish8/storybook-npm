import crypto from "node:crypto";
import http from "node:http";
import { spawn } from "node:child_process";
import readline from "node:readline";
import {
  CALLBACK_PATH,
  CALLBACK_PORTS,
  SCOPES,
  clientIdFor,
  readCredentials,
  writeCredentials,
} from "./config.mjs";

/*
 * OAuth 2.0 authorization code + PKCE, against Merlin's existing API platform.
 *
 * Public client: there is no secret, because a CLI cannot keep one. What proves the
 * exchange belongs to the process that started it is the code VERIFIER, which never
 * leaves this machine.
 *
 * Every endpoint Merlin owns is touched only in this file, so a change on that side
 * is one file here.
 */

/** base64url(SHA-256(verifier)) — matches Merlin's own `sha256`, which is base64url. */
function challengeFor(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(command, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref();
    return true;
  } catch {
    return false;
  }
}

const DONE_PAGE = (message) =>
  `<!doctype html><meta charset="utf-8"><title>Merlin CLI</title>` +
  `<body style="font:15px/1.5 system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;color:#161a20">` +
  `<div style="text-align:center"><p style="font-size:17px;font-weight:600">${message}</p>` +
  `<p style="color:#6b7280">You can close this tab and return to your terminal.</p></div>`;

/** Bind the first registered port that is free. */
async function listenOnRegisteredPort(handler) {
  for (const port of CALLBACK_PORTS) {
    const server = http.createServer(handler);
    const ok = await new Promise((resolve) => {
      server.once("error", () => resolve(false));
      server.listen(port, "127.0.0.1", () => resolve(true));
    });
    if (ok) return { server, port };
  }
  throw new Error(
    `Ports ${CALLBACK_PORTS.join(" and ")} are both in use. Merlin matches redirect URIs exactly, ` +
      `so the CLI cannot fall back to another port — free one of them and retry.`,
  );
}

export async function loginInteractive(baseUrl, { timeoutMs = 300_000 } = {}) {
  const clientId = clientIdFor(baseUrl);
  const verifier = crypto.randomBytes(48).toString("base64url");
  const state = crypto.randomBytes(16).toString("base64url");

  let resolveCode;
  let rejectCode;
  const codePromise = new Promise((resolve, reject) => {
    resolveCode = resolve;
    rejectCode = reject;
  });

  const { server, port } = await listenOnRegisteredPort((request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (url.pathname !== CALLBACK_PATH) {
      response.writeHead(404).end();
      return;
    }
    const error = url.searchParams.get("error");
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    if (error) {
      response.end(DONE_PAGE(`Authorization failed: ${error}`));
      rejectCode(new Error(`Authorization failed: ${error}`));
      return;
    }
    // The state nonce is what binds this redirect to the request we started.
    if (!code || returnedState !== state) {
      response.end(DONE_PAGE("That response did not match this request."));
      rejectCode(new Error("The authorization response did not match this request."));
      return;
    }
    response.end(DONE_PAGE("Merlin CLI is connected."));
    resolveCode(code);
  });

  const redirectUri = `http://127.0.0.1:${port}${CALLBACK_PATH}`;
  const authorizeUrl = new URL(`${baseUrl}/oauth/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", SCOPES);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", challengeFor(verifier));
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  process.stderr.write(`Opening Merlin to approve access:\n  ${authorizeUrl}\n`);
  openBrowser(authorizeUrl.toString());

  const timer = setTimeout(() => rejectCode(new Error("Timed out waiting for authorization.")), timeoutMs);
  let code;
  try {
    code = await codePromise;
  } finally {
    clearTimeout(timer);
    server.close();
  }

  const tokens = await exchange(baseUrl, {
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });
  store(baseUrl, tokens, "oauth");
  return tokens;
}

/**
 * Unpack a setup key from Merlin → Settings → Connections.
 *
 * The key carries the deployment origin and the client id alongside the secret, so one
 * paste configures everything: no client to register, no config file to edit, and a
 * dev key cannot silently be aimed at production.
 */
export function unpackKey(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed.startsWith("mrln_")) {
    throw new Error("That does not look like a Merlin setup key (they start with `mrln_`).");
  }
  let payload;
  try {
    const base64 = trimmed.slice(5).replace(/-/g, "+").replace(/_/g, "/");
    payload = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  } catch {
    throw new Error("That key is damaged — copy it again from Merlin, or generate a new one.");
  }
  if (!payload?.o || !payload?.c || !payload?.r) {
    throw new Error("That key is missing part of its contents — generate a new one in Merlin.");
  }
  return { origin: String(payload.o).replace(/\/$/, ""), clientId: String(payload.c), refreshToken: String(payload.r) };
}

/**
 * Sign in with a setup key.
 *
 * The key IS a refresh token, so this trades it for a working pair immediately — which
 * also proves the key before we tell the user they are connected, rather than storing
 * something that fails on their first real command. It is single use by design: the
 * exchange rotates it, and presenting a spent key revokes its family.
 */
export async function loginWithKey(rawKey) {
  let value = rawKey;
  if (!value) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
    value = await new Promise((resolve) =>
      rl.question("Paste the setup key from Merlin → Settings → Connections: ", resolve),
    );
    rl.close();
  }
  const { origin, clientId, refreshToken } = unpackKey(value);
  let tokens;
  try {
    tokens = await exchange(origin, { grant_type: "refresh_token", client_id: clientId, refresh_token: refreshToken });
  } catch (error) {
    throw new Error(
      `${error.message}. A key works once — if this one has already been used on another machine, ` +
        `generate a new one in Merlin → Settings → Connections.`,
    );
  }
  store(origin, tokens, "key");
  return { ...tokens, origin };
}

async function exchange(baseUrl, body) {
  const response = await fetch(`${baseUrl}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    throw new Error(`Token exchange failed: ${payload.error ?? response.status}`);
  }
  return payload;
}

function store(baseUrl, tokens, obtainedVia) {
  writeCredentials(baseUrl, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
    scope: tokens.scope,
    obtainedVia,
  });
}

/**
 * A usable access token, refreshed if it is about to expire.
 *
 * Refresh tokens ROTATE and reuse revokes the whole family, so the new one is written
 * before it is used for anything.
 */
export async function accessToken(baseUrl, { force = false } = {}) {
  const saved = readCredentials(baseUrl);
  if (!saved) return null;
  const expiringSoon = saved.expiresAt - 60_000 < Date.now();
  if (!force && !expiringSoon) return saved.accessToken;
  if (!saved.refreshToken) return force ? null : saved.accessToken;
  try {
    const tokens = await exchange(baseUrl, {
      grant_type: "refresh_token",
      client_id: clientIdFor(baseUrl),
      refresh_token: saved.refreshToken,
    });
    store(baseUrl, tokens, saved.obtainedVia ?? "oauth");
    return tokens.access_token;
  } catch {
    return null;
  }
}
