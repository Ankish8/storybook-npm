#!/usr/bin/env node
/*
 * merlin — the CLI half of the Live-twin workflow.
 *
 * `/build-screen` drives this; it never calls Merlin's HTTP API itself. Everything
 * that knows about the API lives here, so the command file stays a workflow and the
 * protocol has one home.
 *
 * Exit codes: 0 ok · 1 failed · 2 authentication needed (the command branches on 2).
 */

import fs from "node:fs";
import path from "node:path";
import { ApiError, AuthRequired, call, fetchPublic } from "./lib/api.mjs";
import { accessToken, loginInteractive, loginWithKey } from "./lib/auth.mjs";
import { clearCredentials, credentialsPath, readCredentials, resolveBaseUrl } from "./lib/config.mjs";
import { availableSlug, scaffoldTwin, slugify } from "./lib/scaffold.mjs";
import { ensureWorkspace, workspaceStatus } from "./lib/workspace.mjs";
import { summarizeTree } from "./lib/tree-summary.mjs";

const USAGE = `merlin — Merlin handoff from the design system repo

  login [--key <key>]          Connect this machine. A key comes from Merlin →
                               Settings → Connections; without one, opens a browser.
  logout                       Forget the stored tokens for this deployment
  whoami                       Check the session (exit 2 when not logged in)

  projects                     List handoff projects
  projects create <name>       Create one
  screens <projectId>          List a project's screens
  import <projectId> <figmaUrl> [--node <id>] [--wait]
  status <screenId>            One screen, including import status

  workspace [--status] [--force]    Set up (or report) the local design-system copy
                               that a twin is built inside. Exit 2 when absent.

  context <screenId> --out <dir>    Download context.json, tree.json, preview.png
  scaffold <slug> [--title <t>]     Create twins/<slug>/ from the template
  tree-summary <tree.json> [--depth 4] [--max-lines 400]
  push <screenId> <file.html> [--label <text>]

  --api <url|dev|prod>         Override the deployment (or set MERLIN_API_URL)
  --json                       Machine-readable output
`;

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    const name = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      flags[name] = true;
      continue;
    }
    flags[name] = next;
    i += 1;
  }
  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const baseUrl = resolveBaseUrl(typeof flags.api === "string" ? flags.api : undefined);
const asJson = flags.json === true;

function out(human, data) {
  if (asJson) console.log(JSON.stringify(data ?? {}, null, 2));
  else if (human) console.log(human);
}

function note(message) {
  // Progress goes to stderr so `--json` output stays pipeable.
  process.stderr.write(`${message}\n`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * What to tell someone whose Figma account is not connected.
 *
 * Names the ONE place it is fixed. Importing is the only thing that needs it —
 * everything else here works without it — so this is a warning, never a refusal to run.
 */
function figmaHint(status) {
  const where = status?.app_url ? `${status.app_url}/ → Settings → Connections → Figma` : "Merlin → Settings → Connections → Figma";
  return `Figma is not connected for this account. Importing a screen needs it — connect at ${where}. Everything else (existing screens, context, publishing builds) works without it.`;
}

async function main() {
  const command = positional[0];
  switch (command) {
    case "login": {
      /*
       * A KEY is the primary path: it needs no browser, no registered client and no
       * config, because Merlin's settings screen packs the origin and client into it.
       * `--key` with no value prompts.
       */
      if (flags.key !== undefined || flags.token !== undefined) {
        const result = await loginWithKey(typeof flags.key === "string" ? flags.key : undefined);
        out(`Connected to ${result.origin}.`, { ok: true, baseUrl: result.origin, obtainedVia: "key" });
        return 0;
      }
      const tokens = await loginInteractive(baseUrl);
      out(`Connected to ${baseUrl}.`, { ok: true, baseUrl, obtainedVia: "oauth" });
      return tokens ? 0 : 1;
    }
    case "logout": {
      clearCredentials(baseUrl);
      out(`Forgot the session for ${baseUrl}.`, { ok: true, baseUrl });
      return 0;
    }
    case "whoami": {
      const saved = readCredentials(baseUrl);
      if (!saved) {
        out(`Not logged in to ${baseUrl}. Run: npm run merlin -- login`, { ok: false, reason: "not_logged_in", baseUrl });
        return 2;
      }
      // One call that both proves the token still works and reports whether Figma is
      // connected — which only IMPORT needs, but which is far cheaper to learn now
      // than three steps into a build.
      const status = await call(baseUrl, "GET", "/handoff/status");
      const lines = [`Logged in to ${baseUrl} as ${status.user_email ?? "you"} (workspace ${status.workspace}).`];
      if (status.figma_connected) {
        lines.push(`Figma connected${status.figma_handle ? ` as ${status.figma_handle}` : ""}.`);
      } else {
        lines.push(figmaHint(status));
      }
      lines.push(`Tokens: ${credentialsPath()}`);
      out(lines.join("\n"), {
        ok: true,
        baseUrl,
        workspace: status.workspace,
        userEmail: status.user_email,
        figmaConnected: status.figma_connected,
        appUrl: status.app_url,
        expiresAt: saved.expiresAt,
        tokenSource: saved.obtainedVia,
      });
      return 0;
    }

    case "projects": {
      if (positional[1] === "create") {
        const name = positional.slice(2).join(" ").trim();
        if (!name) throw new Error("Usage: projects create <name>");
        const project = await call(baseUrl, "POST", "/handoff/projects", { body: { name } });
        out(`Created ${project.name} (${project.id})`, project);
        return 0;
      }
      const data = await call(baseUrl, "GET", "/handoff/projects");
      out(
        data.projects.map((p) => `${p.id}  ${p.name}  (${p.screen_count} screens)`).join("\n") || "No projects yet.",
        data,
      );
      return 0;
    }

    case "screens": {
      const projectId = positional[1];
      if (!projectId) throw new Error("Usage: screens <projectId>");
      const data = await call(baseUrl, "GET", `/handoff/projects/${encodeURIComponent(projectId)}/screens`);
      out(
        data.screens
          .map((s) => `${s.id}  ${s.frame_name || "(importing)"}  ${s.width}×${s.height}  ${s.status}${s.twin ? "  [has build]" : ""}`)
          .join("\n") || "No screens yet.",
        data,
      );
      return 0;
    }

    case "import": {
      const [, projectId, figmaUrl] = positional;
      if (!projectId || !figmaUrl) throw new Error("Usage: import <projectId> <figmaUrl> [--node <id>] [--wait]");
      /*
       * Check Figma BEFORE spending an idempotency key on a request that cannot
       * succeed. The server refuses this too (409 no_figma_connection); saying it here
       * costs a cheap GET and lets the message name where to go.
       */
      const preflight = await call(baseUrl, "GET", "/handoff/status");
      if (!preflight.figma_connected) {
        out(figmaHint(preflight), { ok: false, code: "no_figma_connection", appUrl: preflight.app_url });
        if (!asJson) process.stderr.write(`${figmaHint(preflight)}\n`);
        return 1;
      }
      const started = await call(baseUrl, "POST", "/handoff/imports", {
        body: { project_id: projectId, figma_url: figmaUrl, node_id: typeof flags.node === "string" ? flags.node : undefined },
        idempotent: true,
      });
      const screenId = started.screen_id;
      if (flags.wait !== true) {
        out(`Import started: ${screenId}`, { screenId, status: "importing" });
        return 0;
      }
      /*
       * Poll. Merlin has no push channel for handoff imports, so status on the screen
       * row is the only signal — the same thing the app's own grid subscribes to.
       */
      const timeoutMs = (Number(flags.timeout) || 300) * 1000;
      const startedAt = Date.now();
      for (;;) {
        const screen = await call(baseUrl, "GET", `/handoff/screens/${encodeURIComponent(screenId)}`);
        if (screen.status === "ready") {
          out(`Imported ${screen.frame_name} (${screen.width}×${screen.height})`, { screenId, status: "ready", screen });
          return 0;
        }
        if (screen.status === "failed") {
          const message = screen.error?.message ?? "Import failed";
          out(`Import failed: ${message}`, { screenId, status: "failed", errorMessage: message });
          return 1;
        }
        if (Date.now() - startedAt > timeoutMs) {
          out(`Still importing after ${Math.round(timeoutMs / 1000)}s.`, { screenId, status: "importing", timedOut: true });
          return 1;
        }
        note(`  importing… ${Math.round((Date.now() - startedAt) / 1000)}s`);
        await sleep(3000);
      }
    }

    case "status": {
      const screenId = positional[1];
      if (!screenId) throw new Error("Usage: status <screenId>");
      const screen = await call(baseUrl, "GET", `/handoff/screens/${encodeURIComponent(screenId)}`);
      out(`${screen.frame_name || "(importing)"}  ${screen.status}`, screen);
      return 0;
    }

    case "context": {
      const screenId = positional[1];
      const dir = typeof flags.out === "string" ? flags.out : null;
      if (!screenId || !dir) throw new Error("Usage: context <screenId> --out <dir>");
      const data = await call(baseUrl, "GET", `/handoff/screens/${encodeURIComponent(screenId)}/context`);
      fs.mkdirSync(dir, { recursive: true });

      const written = [];
      // The pack itself minus the blobs; the two big ones are fetched separately so
      // a reader can look at the brief without loading 300 KB of geometry.
      const { tree_url: treeUrl, preview_url: previewUrl, ...rest } = data;
      fs.writeFileSync(path.join(dir, "context.json"), `${JSON.stringify(rest, null, 2)}\n`);
      written.push("context.json");

      if (treeUrl) {
        // Public R2, no bearer — trees are unauthenticated by design.
        const response = await fetchPublic(treeUrl);
        fs.writeFileSync(path.join(dir, "tree.json"), Buffer.from(await response.arrayBuffer()));
        written.push("tree.json");
      }
      if (previewUrl) {
        const response = await fetchPublic(previewUrl);
        fs.writeFileSync(path.join(dir, "preview.png"), Buffer.from(await response.arrayBuffer()));
        written.push("preview.png");
      }
      out(`Wrote ${written.join(", ")} to ${dir}`, {
        ok: true,
        out: dir,
        files: written,
        screen: { id: data.screen.id, frameName: data.screen.frame_name, width: data.screen.width, height: data.screen.height, rev: data.screen.rev },
      });
      return 0;
    }

    /*
     * The twin template compiles against `../../src`, so building one needs a
     * checkout. A maintainer has that already; a designer does not, and this is
     * how they get one without ever being told about a repository.
     *
     * `--status` exits 2 for "no workspace", matching this CLI's convention that
     * 2 means "setup needed" — which is what /build-screen branches on, exactly
     * as it already does for `whoami`.
     */
    case "workspace": {
      if (flags.status === true) {
        const status = workspaceStatus();
        if (!status.ok) {
          out(
            `No design-system workspace yet. Run \`merlin workspace\` to create one at ${status.managedPath}.`,
            status,
          );
          return 2;
        }
        const where = status.managed ? "managed" : "your checkout";
        out(
          `Workspace: ${status.path} (${where}, ${status.commit ?? "unknown commit"})` +
            (status.installed ? "" : "\n  Dependencies are missing — run `merlin workspace`."),
          status,
        );
        return 0;
      }
      const result = ensureWorkspace({
        force: flags.force === true,
        ref: typeof flags.ref === "string" ? flags.ref : undefined,
        log: (message) => note(message),
      });
      out(`Ready: ${result.path} (${result.commit})`, { ok: true, ...result });
      return 0;
    }

    case "scaffold": {
      const slug = availableSlug(positional[1] ?? "screen");
      const dir = scaffoldTwin(slug, { title: typeof flags.title === "string" ? flags.title : slug });
      out(`Created ${path.relative(process.cwd(), dir)}`, { ok: true, slug, dir });
      return 0;
    }

    case "tree-summary": {
      const file = positional[1];
      if (!file) throw new Error("Usage: tree-summary <tree.json> [--depth 4]");
      const payload = JSON.parse(fs.readFileSync(file, "utf8"));
      const root = payload?.tree?.root ?? payload?.root;
      if (!root) throw new Error("That file does not look like a Merlin tree blob.");
      console.log(
        summarizeTree(root, {
          depth: Number(flags.depth) || 4,
          maxLines: Number(flags["max-lines"]) || 400,
        }),
      );
      return 0;
    }

    case "push": {
      const [, screenId, file] = positional;
      if (!screenId || !file) throw new Error("Usage: push <screenId> <file.html> [--label <text>]");
      const bytes = fs.statSync(file).size;
      const MAX = 10 * 1024 * 1024;
      if (bytes > MAX) throw new Error(`${file} is ${(bytes / 1048576).toFixed(1)} MB; the limit is 10 MB.`);
      if (bytes > 5 * 1024 * 1024) note(`  warning: ${(bytes / 1048576).toFixed(1)} MB is large for a single page.`);

      const created = await call(baseUrl, "POST", `/handoff/screens/${encodeURIComponent(screenId)}/twins`, {
        body: { size_bytes: bytes, label: typeof flags.label === "string" ? flags.label : undefined },
      });
      // Presigned PUT: no bearer here, and the content type must match what the
      // server will verify after the upload.
      const upload = await fetch(created.upload.url, {
        method: "PUT",
        headers: created.upload.headers,
        body: fs.readFileSync(file),
      });
      if (!upload.ok) throw new Error(`Upload failed (HTTP ${upload.status}).`);
      const twin = await call(baseUrl, "POST", `/handoff/twins/${encodeURIComponent(created.twin_id)}/complete`);
      out(`Live: ${twin.url}`, { ok: true, twinId: twin.id, url: twin.url, sizeBytes: twin.size_bytes });
      return 0;
    }

    default:
      process.stderr.write(USAGE);
      return command ? 1 : 0;
  }
}

try {
  process.exit(await main());
} catch (error) {
  if (error instanceof AuthRequired) {
    out(error.message, { ok: false, reason: "not_logged_in", baseUrl });
    process.exit(2);
  }
  const detail = error instanceof ApiError && error.requestId ? ` (request ${error.requestId})` : "";
  // In --json mode the machine-readable envelope goes to stdout and the sentence to
  // stderr; otherwise the sentence alone, on stderr where errors belong. `out` used to
  // run in both branches, which printed every failure twice.
  if (asJson) out(null, { ok: false, error: error.message, code: error.code });
  process.stderr.write(`Error: ${error.message}${detail}\n`);
  process.exit(1);
}
