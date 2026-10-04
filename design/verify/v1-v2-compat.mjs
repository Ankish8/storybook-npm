/**
 * One command: "can a developer swap v1 for v2 without breaking anything?"
 *   npm run verify:v1-v2-compat
 *
 * 1. types     every v1 export/prop exists in v2 and accepts the same types   (v1-v2-api-compat.mjs)
 * 2. v1 tests  the unchanged v1 unit tests, run against v2                      (v1-on-v2.mjs)
 * 3. stories   all v1 stories rendered with v1 and with v2, DOM diffed           (v1-stories-replay + v1-v2-story-diff)
 * 4. props     no declared v1 prop is silently ignored (declared but never read) by v2   (v1-v2-dead-props.mjs)
 * Exceptions live in v1-v2-compat.waivers.json, each with a reason.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const here = (f) => path.join(root, "design/verify", f);
const sh = (cmd, args, env = {}) => spawnSync(cmd, args, { cwd: root, env: { ...process.env, TZ: "UTC", ...env }, encoding: "utf8", maxBuffer: 1 << 28 });
const tail = (r, n = 4) => (r.stdout + r.stderr).trim().split("\n").slice(-n).join("\n");
const results = [];
const gate = (name, r) => { results.push({ name, ok: r.status === 0 }); console.log(`\n${r.status === 0 ? "PASS" : "FAIL"}  ${name}\n${(r.stdout + r.stderr).trim().split("\n").filter((l) => !r.status || l.trim()).slice(r.status === 0 ? -3 : -40).join("\n")}`); };

gate("1. types: every v1 export and prop is accepted by v2", sh("node", [here("v1-v2-api-compat.mjs")]));
gate("2. v1 unit tests replayed on v2", sh("node", [here("v1-on-v2.mjs")]));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stories-"));
const rec = (v2, out) => sh("npx", ["vitest", "run", "-c", "design/verify/vitest.v1-stories.config.ts"], { REPLAY_V2: v2 ? "1" : "0", REPLAY_OUT: out });
const r1 = rec(false, path.join(tmp, "v1.json"));
const r2 = rec(true, path.join(tmp, "v2.json"));
if (r1.status !== 0 || r2.status !== 0) gate("3. stories: replay did not complete", { status: 1, stdout: tail(r1) + "\n" + tail(r2), stderr: "" });
else gate("3. every v1 story rendered with v2: no errors, no lost attributes/elements/text", sh("node", [here("v1-v2-story-diff.mjs"), path.join(tmp, "v1.json"), path.join(tmp, "v2.json")]));
fs.rmSync(tmp, { recursive: true, force: true });
gate("4. props: no v1 prop is accepted and then ignored by v2", sh("node", [here("v1-v2-dead-props.mjs")]));

const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length ? "NOT COMPATIBLE" : "COMPATIBLE"}: ${results.length - failed.length}/${results.length} gates passed`);
process.exit(failed.length ? 1 : 0);
