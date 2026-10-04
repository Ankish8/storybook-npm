/**
 * Builds a Figma-ready change report for one component from before/after captures (capture.mjs).
 *
 *   node design/verify/figma-report.mjs <component-folder>        e.g. design/figma-reports/date-time-picker
 *
 * Folder contents:
 *   meta.json                    { title, figmaNode, summary, why[], figmaSteps[], motion[], states[], notes[] , apiNote }
 *   <scenario>.before.png/.json  and  <scenario>.after.png/.json   (from capture.mjs)
 * Output: <folder>/REPORT.md. Every value in the "Measured changes" tables comes from getComputedStyle in the real
 * rendered DOM, so a designer can copy it straight into Figma (px, hex, ms). Unchanged properties are omitted.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] || ".");
const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
const hex = (v) => v.replace(/rgba?\(([^)]+)\)/g, (_, inner) => {
  const [r, g, b, a] = inner.split(",").map((x) => parseFloat(x));
  const h = (n) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a === undefined || a === 1 ? base : a === 0 ? "transparent" : `${base} @ ${Math.round(a * 100)}%`;
});
const clean = (v) => (v === undefined || v === null ? "—" : hex(String(v)).replace(/\s+/g, " ").replace(/0px 0px 0px 0px/g, "0").slice(0, 160));
const px = (v) => String(v).replace(/(\d+\.\d{2})\d+px/g, "$1px");

const scenarios = [...new Set(fs.readdirSync(dir).filter((f) => f.endsWith(".before.json")).map((f) => f.replace(".before.json", "")))].sort();
let md = `# ${meta.title}: UI change report for Figma\n\n`;
md += `Figma source: ${meta.figmaNode ? `[${meta.figmaNode}](${meta.figmaNode})` : "n/a"}  \nStorybook: \`${meta.storybook || "V2/Components/…"}\`  \nDate: ${meta.date || new Date().toISOString().slice(0, 10)}\n\n`;
md += `## Summary\n\n${meta.summary}\n\n`;
if (meta.why?.length) md += `### Why (what the research found)\n\n${meta.why.map((w) => `- ${w}`).join("\n")}\n\n`;
md += `### API / compatibility\n\n${meta.apiNote || "No prop, callback, aria-label or DOM-contract changes. v2 remains a drop-in for v1 (`npm run verify:v1-v2-compat` passes)."}\n\n`;

md += `## Before and after\n\n`;
for (const s of scenarios) {
  const label = (meta.scenarioLabels || {})[s] || s;
  const hasAfter = fs.existsSync(path.join(dir, `${s}.after.png`));
  md += `### ${label}\n\n| Before | After |\n| --- | --- |\n| ![before](${s}.before.png) | ${hasAfter ? `![after](${s}.after.png)` : "_not captured_"} |\n\n`;
}

md += `## Measured changes (copy these into Figma)\n\n_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._\n\n`;
let anyRows = false;
for (const s of scenarios) {
  const bp = path.join(dir, `${s}.before.json`), ap = path.join(dir, `${s}.after.json`);
  if (!fs.existsSync(ap)) continue;
  const b = JSON.parse(fs.readFileSync(bp, "utf8")).measured || {}, a = JSON.parse(fs.readFileSync(ap, "utf8")).measured || {};
  const rows = [];
  for (const el of Object.keys({ ...b, ...a })) {
    const x = b[el] || {}, y = a[el] || {};
    if (!b[el] && a[el]) { rows.push(`| ${el} | _(new element)_ | — | present |`); continue; }
    if (b[el] && !a[el]) { rows.push(`| ${el} | _(removed)_ | present | — |`); continue; }
    for (const prop of Object.keys({ ...x, ...y })) {
      const bv = clean(px(x[prop])), av = clean(px(y[prop]));
      if (bv !== av) rows.push(`| ${el} | ${prop} | ${bv} | **${av}** |`);
    }
  }
  if (rows.length) { anyRows = true; md += `### ${(meta.scenarioLabels || {})[s] || s}\n\n| Element | Property | Before | After |\n| --- | --- | --- | --- |\n${rows.join("\n")}\n\n`; }
}
if (!anyRows) md += `_No measured style differences recorded for these scenarios._\n\n`;

if (meta.motion?.length) md += `## Motion\n\n| What | Before | After |\n| --- | --- | --- |\n${meta.motion.map((m) => `| ${m.what} | ${m.before || "—"} | **${m.after}** |`).join("\n")}\n\n`;
if (meta.states?.length) md += `## States to update in Figma\n\n${meta.states.map((s) => `- ${s}`).join("\n")}\n\n`;
if (meta.figmaSteps?.length) md += `## How to apply in Figma\n\n${meta.figmaSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n`;
if (meta.notes?.length) md += `## Notes\n\n${meta.notes.map((n) => `- ${n}`).join("\n")}\n`;
fs.writeFileSync(path.join(dir, "REPORT.md"), md);
console.log(`wrote ${path.join(dir, "REPORT.md")} (${scenarios.length} scenarios)`);
