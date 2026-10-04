/**
 * Proves entry animations actually MOVE, not merely exist. `getAnimations()` also lists an animation whose keyframes are
 * identity (the motion-safe:animate-in bug: fade/zoom/slide values were reset, so the dialog "animated" at opacity 1).
 * This samples computed opacity and transform every frame while each overlay opens and fails unless opacity really
 * ramps from ~0 to 1 (and, where the entry scales or slides, the transform really changes).
 *
 *   node design/verify/motion-movement-probe.mjs [--url http://localhost:6008]
 */
import { capture } from "./capture.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REC = (sel) => `(() => { window.__rec = []; const t0 = performance.now(); const loop = () => { document.querySelectorAll(${JSON.stringify(sel)}).forEach((e) => { const s = getComputedStyle(e); window.__rec.push([+s.opacity, s.transform]); }); if (performance.now() - t0 < 1600) requestAnimationFrame(loop); }; loop(); return 1; })()`;
const DUMP = `(() => { const r = window.__rec; const op = r.map((x) => x[0]); return JSON.stringify({ frames: r.length, minOpacity: Math.min(...op), distinctOpacity: new Set(op).size, distinctTransforms: new Set(r.map((x) => x[1])).size }); })()`;

// moves: "fade" = opacity must ramp; "fade+transform" = the transform must change too.
const OVERLAYS = [
  { name: "dialog", story: "v2-components-dialog--default", sel: '[role="dialog"]', open: { clickText: "Open" }, moves: "fade+transform" },
  { name: "dropdown-menu", story: "v2-components-dropdown-menu--default", sel: '[role="menu"]', open: { click: '#storybook-root button[aria-haspopup="menu"]' }, moves: "fade+transform" },
  { name: "select", story: "v2-components-select--default", sel: '[role="listbox"]', open: { click: '#storybook-root button[role="combobox"]' }, moves: "fade" },
  { name: "date-range-picker", story: "v2-components-daterangepicker--empty", sel: '[role="dialog"]', open: { click: '#storybook-root button[aria-haspopup="dialog"]' }, moves: "fade+transform" },
  { name: "date-time-picker", story: "v2-components-datetimepicker--empty", sel: '[role="dialog"]', open: { click: '#storybook-root button[aria-label="Open calendar"]' }, moves: "fade+transform" },
];

const argv = process.argv.slice(2);
const base = argv.includes("--url") ? argv[argv.indexOf("--url") + 1] : "http://localhost:6008";
const out = fs.mkdtempSync(path.join(os.tmpdir(), "movement-"));
const scenarios = OVERLAYS.map((o) => ({ name: o.name, story: o.story, steps: [{ eval: REC(o.sel) }, o.open, { wait: 500 }, { eval: DUMP }] }));
await capture(scenarios, { base, out, label: "m" });

let failed = 0;
for (const o of OVERLAYS) {
  const d = JSON.parse(JSON.parse(fs.readFileSync(path.join(out, `${o.name}.m.json`), "utf8")).evals.slice(-1)[0]);
  const fades = d.frames > 0 && d.minOpacity < 0.5 && d.distinctOpacity >= 5;
  const moves = o.moves === "fade" || d.distinctTransforms >= 3;
  const ok = fades && moves;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${o.name.padEnd(18)} frames ${d.frames}, opacity from ${d.minOpacity} (${d.distinctOpacity} steps), transform steps ${d.distinctTransforms}`);
}
fs.rmSync(out, { recursive: true, force: true });
console.log(`\n${OVERLAYS.length - failed}/${OVERLAYS.length} overlays really animate`);
process.exit(failed ? 1 : 0);
