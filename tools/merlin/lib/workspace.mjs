/*
 * The managed design-system workspace.
 *
 * WHY THIS EXISTS
 *   A twin is not self-contained. `template/vite.config.ts` aliases `@` to
 *   `../../src`, `template/tailwind.config.js` imports `../../tailwind.config.js`
 *   and globs `../../src/**`, and `template/src/styles.css` does
 *   `@import "../../../src/index.css"`. So a twin only builds when it sits
 *   EXACTLY two levels below a checkout of this repo, resolving react, vite and
 *   tailwind from that checkout's node_modules.
 *
 *   That is correct for a maintainer and impossible for a designer, who has no
 *   checkout and should not need one. This module gives them one they never see:
 *   a shallow clone at ~/.merlin/design-system, installed once.
 *
 * THE LADDER PUTS A REAL CHECKOUT FIRST, deliberately.
 *   A maintainer running `npm run merlin` inside the repo must act on THAT repo,
 *   not on a managed copy that is a fetch behind. So an explicit flag wins, then
 *   the environment, then a checkout found by walking up from the cwd, and only
 *   then the managed workspace. Put the managed directory earlier and a
 *   maintainer's twin silently builds against someone else's tree.
 *
 * NODE BUILTINS ONLY. This whole CLI is dependency-free and reachable from a
 * plugin directory that has no node_modules of its own; an npm import here would
 * make the bootstrap need a bootstrap.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

export const REPO_URL = "https://github.com/Ankish8/storybook-npm.git";
export const DEFAULT_REF = "main";

/**
 * vite 7 refuses to run below this, and the repo declares no `engines` field, so
 * nothing else states it. Worse, `lib/api.mjs` calls global `fetch`: on Node 16
 * the CLI dies with `fetch is not defined`, which is unactionable for a designer.
 * Checked BEFORE anything is written.
 */
export const MIN_NODE = [20, 19, 0];

/** Refuse before cloning rather than failing with ENOSPC halfway through npm. */
const MIN_FREE_BYTES = 1_024 * 1024 * 1024;

/** A lock older than this is assumed to belong to a crashed run, not a live one. */
const LOCK_STALE_MS = 30 * 60 * 1000;

export function merlinHome() {
  return process.env.MERLIN_HOME || path.join(os.homedir(), ".merlin");
}

export function managedWorkspace() {
  return path.join(merlinHome(), "design-system");
}

/**
 * Does this directory look like a checkout we can build a twin inside?
 *
 * Tests what the TWIN TEMPLATE actually reaches for — `../../src/index.css`,
 * `../../tailwind.config.js`, and a package.json whose node_modules it resolves
 * react and vite from — rather than an incidental marker like tools/merlin/.
 * The CLI can run from a plugin directory that the workspace knows nothing about,
 * so requiring the CLI to be present here would reject a perfectly good clone.
 */
export function isWorkspace(dir) {
  if (!dir) return false;
  return (
    fs.existsSync(path.join(dir, "src", "index.css")) &&
    fs.existsSync(path.join(dir, "tailwind.config.js")) &&
    fs.existsSync(path.join(dir, "package.json"))
  );
}

/** Walk up from `start` looking for a real checkout. */
function findCheckoutUpwards(start) {
  let dir = path.resolve(start);
  for (let i = 0; i < 12; i += 1) {
    if (isWorkspace(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Resolve the workspace, or null.
 *
 * Order is load-bearing — see the header. `explicit` and MERLIN_WORKSPACE are
 * NOT validated with `isWorkspace`: if someone names a directory outright and it
 * is wrong, saying so beats silently using a different one.
 */
export function resolveWorkspace({ explicit, cwd = process.cwd() } = {}) {
  if (typeof explicit === "string" && explicit) return path.resolve(explicit);
  if (process.env.MERLIN_WORKSPACE) return path.resolve(process.env.MERLIN_WORKSPACE);
  const checkout = findCheckoutUpwards(cwd);
  if (checkout) return checkout;
  const managed = managedWorkspace();
  return isWorkspace(managed) ? managed : null;
}

// ---- preflight ---------------------------------------------------------------

function nodeTooOld() {
  const parts = process.versions.node.split(".").map((n) => Number.parseInt(n, 10));
  for (let i = 0; i < MIN_NODE.length; i += 1) {
    const have = parts[i] ?? 0;
    if (have > MIN_NODE[i]) return false;
    if (have < MIN_NODE[i]) return true;
  }
  return false;
}

function hasGit() {
  const probe = spawnSync("git", ["--version"], { stdio: "ignore" });
  return probe.status === 0;
}

function freeBytes(dir) {
  // statfsSync landed in Node 18.15. Unknown is not "full" — skip the check
  // rather than refuse to set up on a runtime that cannot answer.
  try {
    let probe = dir;
    while (!fs.existsSync(probe)) {
      const parent = path.dirname(probe);
      if (parent === probe) return null;
      probe = parent;
    }
    const stats = fs.statfsSync(probe);
    return stats.bavail * stats.bsize;
  } catch {
    return null;
  }
}

/** Every reason we refuse, as a sentence naming the fix. Empty means go ahead. */
export function preflight({ home = merlinHome() } = {}) {
  const problems = [];
  if (nodeTooOld()) {
    problems.push(
      `Node ${MIN_NODE.join(".")} or newer is required (this is ${process.versions.node}). ` +
        `Install it from nodejs.org, or with \`brew install node\`.`,
    );
  }
  if (!hasGit()) {
    problems.push(
      "git is not installed. On macOS run `xcode-select --install`. " +
        "You can still run /audit-screen, which needs neither git nor a checkout.",
    );
  }
  const free = freeBytes(home);
  if (free !== null && free < MIN_FREE_BYTES) {
    problems.push(
      `Less than 1 GB free on the volume holding ${home} ` +
        `(${(free / 1e9).toFixed(1)} GB available). The design system needs about 500 MB.`,
    );
  }
  return problems;
}

// ---- lock --------------------------------------------------------------------

function lockPath() {
  return path.join(merlinHome(), ".workspace.lock");
}

function takeLock() {
  const file = lockPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    if (Date.now() - Number(raw.at ?? 0) < LOCK_STALE_MS) {
      throw new Error(
        `Another setup is already running (pid ${raw.pid}). Wait for it, ` +
          `or delete ${file} if that process is gone.`,
      );
    }
  } catch (error) {
    // A malformed or missing lock is not contention — only a fresh one is.
    if (error instanceof Error && error.message.startsWith("Another setup")) throw error;
  }
  fs.writeFileSync(file, JSON.stringify({ pid: process.pid, at: Date.now() }));
}

function releaseLock() {
  try {
    fs.unlinkSync(lockPath());
  } catch {
    /* releasing a lock that is already gone is not a failure */
  }
}

// ---- state -------------------------------------------------------------------

function statePath() {
  return path.join(merlinHome(), "workspace.json");
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(statePath(), "utf8"));
  } catch {
    return null;
  }
}

function writeState(patch) {
  const next = { schema: 1, ...(readState() ?? {}), ...patch };
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify(next, null, 2));
  return next;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.error) throw new Error(`${command} could not be started: ${result.error.message}`);
  return result;
}

function headCommit(dir) {
  const result = run("git", ["rev-parse", "--short", "HEAD"], dir);
  return result.status === 0 ? result.stdout.trim() : null;
}

/**
 * EVERY EXTERNAL PACKAGE THE TWIN TEMPLATE IMPORTS.
 *
 * Derived from `template/` rather than hand-picked, and that distinction is the
 * whole point: the first version of this check listed vite, react, react-dom and
 * tailwindcss, reported a complete install, and the twin then failed to build on
 * `vite-plugin-singlefile` — which was a devDependency on the branch the CLI came
 * from and absent on main. A smoke test that omits a template dependency reports
 * success for a workspace that cannot build anything.
 *
 * If you add an import to `template/`, add it here.
 */
const TEMPLATE_PACKAGES = [
  "vite",
  "@vitejs/plugin-react",
  "vite-plugin-singlefile",
  "react",
  "react-dom",
  "tailwindcss",
  "autoprefixer",
];

/**
 * Are the packages a twin's build actually needs resolvable from here?
 *
 * A half-finished `npm install` is the failure that otherwise surfaces at
 * Phase 5 as a baffling vite error with nothing pointing back at setup.
 */
export function installLooksComplete(dir) {
  try {
    const require_ = createRequire(path.join(dir, "package.json"));
    for (const pkg of TEMPLATE_PACKAGES) require_.resolve(pkg);
    return true;
  } catch {
    return false;
  }
}

/** What `--status` reports. Network-free and cheap. */
export function workspaceStatus({ cwd = process.cwd() } = {}) {
  const dir = resolveWorkspace({ cwd });
  const managed = managedWorkspace();
  if (!dir || !isWorkspace(dir)) {
    return { ok: false, reason: "no_workspace", managedPath: managed };
  }
  const state = readState();
  return {
    ok: true,
    path: dir,
    managed: path.resolve(dir) === path.resolve(managed),
    commit: headCommit(dir),
    ref: state?.ref ?? null,
    updatedAt: state?.updatedAt ?? null,
    installed: installLooksComplete(dir),
  };
}

// ---- bootstrap ---------------------------------------------------------------

/**
 * Create or update the managed workspace.
 *
 * `--ignore-scripts` skips `prepare: husky` (a git hook manager a designer will
 * never trigger) and `postinstall: ensure-cli-registry`, which shells into
 * packages/cli — 74 MB a twin never touches. esbuild resolves through optional
 * platform packages rather than an install script, so vite still works; the
 * smoke test below is what proves it rather than assuming it.
 *
 * A FAILED INSTALL KEEPS THE CLONE. Re-running then costs an install, not a
 * fetch of the whole repository again.
 */
export function ensureWorkspace({ ref = DEFAULT_REF, force = false, log = () => {} } = {}) {
  const problems = preflight();
  if (problems.length > 0) {
    const error = new Error(problems.join("\n"));
    error.code = "PREFLIGHT_FAILED";
    throw error;
  }

  const dir = managedWorkspace();
  takeLock();
  try {
    if (fs.existsSync(path.join(dir, ".git"))) {
      const dirty = run("git", ["status", "--porcelain", "--untracked-files=no"], dir);
      if (dirty.status === 0 && dirty.stdout.trim() && !force) {
        throw new Error(
          `${dir} has local changes to tracked files. Re-run with --force to discard them ` +
            `(twins/ is gitignored and is never touched).`,
        );
      }
      log(`Updating ${dir}…`);
      const fetched = run("git", ["fetch", "--depth", "1", "origin", ref], dir);
      if (fetched.status !== 0) throw new Error(`git fetch failed:\n${fetched.stderr.trim()}`);
      const reset = run("git", ["reset", "--hard", "FETCH_HEAD"], dir);
      if (reset.status !== 0) throw new Error(`git reset failed:\n${reset.stderr.trim()}`);
    } else {
      log(`Cloning the design system into ${dir}… (about 22 MB)`);
      fs.mkdirSync(path.dirname(dir), { recursive: true });
      const cloned = run("git", [
        "clone", "--depth", "1", "--branch", ref, "--single-branch", REPO_URL, dir,
      ]);
      if (cloned.status !== 0) {
        throw new Error(
          `git clone failed:\n${cloned.stderr.trim()}\n\n` +
            `If that is a network error, try again when you are online. If it is 403 or 404, ` +
            `the repository moved or your git credentials cannot read it.`,
        );
      }
    }

    if (!isWorkspace(dir)) {
      throw new Error(
        `${dir} was fetched but does not look like the design system ` +
          `(no src/index.css). Is "${ref}" the right branch?`,
      );
    }

    if (force || !installLooksComplete(dir)) {
      log("Installing dependencies… (a few minutes the first time)");
      const npm = run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], dir);
      if (npm.status !== 0 || !installLooksComplete(dir)) {
        // One retry: a partial install from an interrupted run is common and
        // repairs itself, and re-reporting without trying is a worse answer.
        log("The install did not complete. Retrying once…");
        const retry = run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], dir);
        if (retry.status !== 0 || !installLooksComplete(dir)) {
          const tail = (retry.stderr || npm.stderr || "").split("\n").slice(-40).join("\n");
          throw new Error(
            `npm install failed in ${dir}. The clone was kept, so re-running only retries ` +
              `the install.\n\n${tail}`,
          );
        }
      }
    }

    const commit = headCommit(dir);
    writeState({ ref, commit, path: dir, updatedAt: Date.now(), npmOk: true });
    return { path: dir, ref, commit };
  } finally {
    releaseLock();
  }
}
