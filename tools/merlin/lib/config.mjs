import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/*
 * Where the CLI talks to, and where it keeps its tokens.
 *
 * Tokens live in the HOME directory, never in the repo: they survive clones and
 * worktrees, they cannot be committed by accident, and it is where every other
 * developer CLI puts them.
 */

export const DEV_API = "https://acrobatic-bass-678.convex.site";
export const PROD_API = "https://basic-monitor-555.convex.site";

/*
 * The OAuth client is registered PER DEPLOYMENT, so the id is per origin.
 *
 * Provisioned with `npx convex run apiProvisioning:provisionPublicClient` in the
 * Merlin repo — see this folder's README. `MERLIN_CLIENT_ID` overrides, which is how
 * a deployment that has not been added here yet can still be used.
 */
const CLIENT_IDS = {
  [DEV_API]: "client_odVjSkjhG1xAVRYNJJBRkrVl",
  [PROD_API]: "client_OVZfIT94lnzk8W-I93a11cIa",
};

export const SCOPES = "handoff:read handoff:write workspaces:read";

/**
 * Ports the loopback listener may use.
 *
 * Merlin matches redirect URIs by EXACT STRING (no RFC 8252 any-port rule), so these
 * must be exactly the ones registered on the client. Two, so a busy port is not a
 * dead end.
 */
export const CALLBACK_PORTS = [8976, 8977];
export const CALLBACK_PATH = "/oauth/callback";

/**
 * The deployment to use when nobody said.
 *
 * The FIRST deployment that has a client registered, rather than a hardcoded prod:
 * defaulting to an origin nobody can authenticate against makes the first run of
 * `/build-screen` fail for every developer, with an error about provisioning that
 * only the person holding the Convex deploy keys can act on. When prod is
 * provisioned this returns prod on its own, and nothing here needs editing.
 */
function defaultBaseUrl() {
  return [PROD_API, DEV_API].find((origin) => CLIENT_IDS[origin]) ?? PROD_API;
}

export function resolveBaseUrl(flagValue) {
  const raw = flagValue ?? process.env.MERLIN_API_URL ?? defaultBaseUrl();
  const alias = { dev: DEV_API, prod: PROD_API }[raw];
  return (alias ?? raw).replace(/\/$/, "");
}

export function clientIdFor(baseUrl) {
  const id = process.env.MERLIN_CLIENT_ID ?? CLIENT_IDS[baseUrl];
  if (!id) {
    // Name the deployment that DOES work — the reader is a developer trying to log
    // in, not the operator who can provision one.
    const alternative = [DEV_API, PROD_API].find((origin) => origin !== baseUrl && CLIENT_IDS[origin]);
    throw new Error(
      `No OAuth client is registered for ${baseUrl}.` +
        (alternative ? ` Use --api ${alternative === DEV_API ? "dev" : "prod"} for now.` : "") +
        ` To register one, run this in the Merlin repo:\n` +
        `  npx convex run apiProvisioning:provisionPublicClient '{"name":"Merlin CLI",` +
        `"redirectUris":["http://127.0.0.1:8976/oauth/callback","http://127.0.0.1:8977/oauth/callback"],` +
        `"allowedScopes":["handoff:read","handoff:write","workspaces:read"],"createdByEmail":"you@myoperator.co"}'\n` +
        `then put the returned clientId in tools/merlin/lib/config.mjs (or set MERLIN_CLIENT_ID).`,
    );
  }
  return id;
}

function credentialsPath() {
  const base = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  return path.join(base, "merlin-cli", "credentials.json");
}

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(credentialsPath(), "utf8"));
  } catch {
    return {};
  }
}

export function readCredentials(baseUrl) {
  return readStore()[baseUrl] ?? null;
}

export function writeCredentials(baseUrl, value) {
  const file = credentialsPath();
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const store = readStore();
  store[baseUrl] = value;
  // 0600 — this file holds a refresh token good for thirty days.
  fs.writeFileSync(file, `${JSON.stringify(store, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

export function clearCredentials(baseUrl) {
  const store = readStore();
  delete store[baseUrl];
  const file = credentialsPath();
  if (!fs.existsSync(file)) return;
  fs.writeFileSync(file, `${JSON.stringify(store, null, 2)}\n`, { mode: 0o600 });
}

export { credentialsPath };
