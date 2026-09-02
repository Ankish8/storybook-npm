# merlin — handoff CLI

Talks to Merlin's dev-handoff workspace so a Figma screen can be rebuilt here as a
**twin**: one self-contained HTML file, made from this repo's real components, that
Merlin renders beside the design behind its **Live** toggle.

`/build-screen` drives this. Use it directly for one-off work or for debugging.

First time on a machine: `npm run merlin -- login` and approve in the browser.

```bash
npm run merlin -- whoami
npm run merlin -- projects
npm run merlin -- screens <projectId>
npm run merlin -- import <projectId> "<figma url>" --wait
npm run merlin -- context <screenId> --out twins/<slug>/context
npm run merlin -- push <screenId> twins/<slug>/dist/index.html --label "…"
```

## Deployments

`--api dev` / `--api prod`, or `MERLIN_API_URL`. Default is prod.

| | |
|---|---|
| dev | `https://acrobatic-bass-678.convex.site` |
| prod | `https://basic-monitor-555.convex.site` |

Tokens are stored per origin in `~/.config/merlin-cli/credentials.json` (mode 0600),
so dev and prod logins coexist. Nothing token-related is ever written into the repo.

## Sign-in

### Browser (do this)

```bash
npm run merlin -- login
```

Opens Merlin, you click Approve, the CLI is connected. Nothing to copy. `/build-screen`
offers this automatically when it finds the machine unconnected.

OAuth 2.0 authorization-code with PKCE against a **public** client — no secret, because
a CLI cannot keep one. Redirect URIs are matched **exactly**, so only the registered
loopback ports work: `8976` and `8977`. If both are busy, free one; the CLI cannot pick
another.

### Setup key (no browser on this machine)

In Merlin: **Settings → Connections → Command line → Generate key**, then

```bash
npm run merlin -- login --key mrln_…
```

The key packs the deployment origin, the OAuth client and a refresh token, so one
paste configures everything — no `--api` flag, no client to register, no file to edit,
and a dev key cannot be aimed at production by accident. Generating the first key on a
deployment also registers the CLI's OAuth client there, which is what makes the browser
flow below work too.

It is **single use**: the CLI trades it for a rotating token pair immediately, and
presenting a spent key revokes its family (that is refresh-token reuse detection doing
its job). One key per machine; generate another for the next one. Revoke a machine from
the same screen.

### Operator provisioning (rarely needed)

The settings screen provisions the client on first key, so this is only for scripting a
deployment ahead of anyone using it:

```bash
npx convex run apiProvisioning:provisionPublicClient '{
  "name": "Merlin CLI",
  "redirectUris": [
    "http://127.0.0.1:8976/oauth/callback",
    "http://127.0.0.1:8977/oauth/callback",
    "http://localhost:8976/oauth/callback"
  ],
  "allowedScopes": ["handoff:read", "handoff:write", "workspaces:read"],
  "createdByEmail": "you@myoperator.co"
}'
```

## The API this speaks

All routes are `/v1/handoff/…` on the deployment origin, bearer-authenticated, with a
`{ data, request_id }` envelope. `npx convex run apiOAuth:devApproveConsent` on the
Merlin side approves a consent request without a browser, which is how the whole
surface can be exercised from a terminal.

| | |
|---|---|
| `GET /handoff/projects` | list |
| `POST /handoff/projects` | create |
| `GET /handoff/projects/:id/screens` | current version of each screen |
| `POST /handoff/imports` | start a Figma import (needs `Idempotency-Key`) |
| `GET /handoff/screens/:id` | poll target — `importing` / `ready` / `failed` |
| `GET /handoff/screens/:id/context` | copy, controls, components, annotations, transitions |
| `POST /handoff/screens/:id/twins` | reserve a build + signed PUT URL |
| `POST /handoff/twins/:id/complete` | verify the upload and make it Live |
| `GET /handoff/screens/:id/twins` | builds for this frame |

Trees, previews and twins are public R2 URLs and are fetched without a bearer.

## Twins

`scaffold <slug>` creates `twins/<slug>/` from `template/`. A twin declares **no
dependencies** — React, Vite and Tailwind resolve from the repo root, which is what
guarantees one copy of React — so there is nothing to install.

```bash
cd twins/<slug> && npx vite          # review
cd twins/<slug> && npx vite build    # → dist/index.html, one file
```

`twins/` is gitignored: the uploaded HTML is the artifact, the working copy is local.

## Offline

`fixtures/sample-context/` is a real context pack. It makes the whole twin path —
scaffold, dev server, single-file build — testable with no Merlin and no session:

```bash
npm run merlin -- scaffold demo
cp -R tools/merlin/fixtures/sample-context twins/demo/context
cd twins/demo && npx vite build
```
