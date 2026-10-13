/**
 * Replays the unchanged v1 unit tests against the v2 components (vitest.v1-on-v2.config.ts) and sorts every
 * failure into: STYLE (asserts a v1 utility class / inline style - the redesign changed these on purpose),
 * PRE-EXISTING (also fails on v1 itself), WAIVED (listed with a reason in v1-v2-compat.waivers.json), or
 * BEHAVIOUR (anything else: a callback, role, aria attribute, id, text, ref or DOM contract that changed).
 * Exit 1 when any BEHAVIOUR failure remains.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isStyleAssertion } from "./style-assertion.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "v1onv2-"));
const run = (args, out) => { try { execFileSync("npx", ["vitest", "run", ...args, "--reporter=json", `--outputFile=${out}`], { cwd: root, stdio: "pipe", maxBuffer: 1 << 28 }); } catch { /* failures are reported in the JSON */ } return JSON.parse(fs.readFileSync(out, "utf8")); };
const failures = (r) => { const m = new Map(); for (const f of r.testResults) for (const a of f.assertionResults) if (a.status === "failed") m.set(`${path.basename(f.name).replace(/\.test\.tsx?$/, "")} :: ${a.fullName.replace(/^.*? > /, "").replace(/ > /g, " ")}`.replace(/\s+/g, " "), a.failureMessages.join("\n")); return m; };

const native = failures(run(["src/components/ui/__tests__/", "--exclude", "src/components/ui/__tests__/v2/**"], path.join(tmp, "native.json")));
const replay = run(["-c", "design/verify/vitest.v1-on-v2.config.ts"], path.join(tmp, "replay.json"));
const onV2 = failures(replay);
const total = replay.numTotalTests;
const waivers = JSON.parse(fs.readFileSync(path.join(root, "design/verify/v1-v2-compat.waivers.json"), "utf8")).filter((w) => w.gate === "v1-tests");
const buckets = { style: [], pre: [], waived: [], behaviour: [] };
for (const [name, msg] of onV2) {
  const key = [...native.keys()].find((k) => k.endsWith(name.split(" :: ")[1]?.slice(-60) ?? "") && k.startsWith(name.split(" :: ")[0]));
  if (key) buckets.pre.push(name);
  else if (waivers.some((w) => name.replace(/\s+/g, " ").includes(w.test.replace(/\s+/g, " ").split(" :: ")[1]) && name.startsWith(w.test.split(" :: ")[0]))) buckets.waived.push(name);
  else if (isStyleAssertion(name, msg)) buckets.style.push(name);
  else buckets.behaviour.push(`${name}\n      ${msg.split("\n").slice(0, 2).join(" ").slice(0, 220)}`);
}
console.log(`v1 unit tests replayed on v2: ${total} assertions, ${total - onV2.size} pass`);
console.log(`  style assertions (expected, redesign): ${buckets.style.length}`);
console.log(`  already failing on v1 itself:          ${buckets.pre.length}${buckets.pre.length ? "  -> " + buckets.pre.join("; ") : ""}`);
console.log(`  waived with reason:                    ${buckets.waived.length}`);
console.log(`  BEHAVIOUR failures:                    ${buckets.behaviour.length}`);
for (const b of buckets.behaviour) console.log(`    ${b}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(buckets.behaviour.length ? 1 : 0);
