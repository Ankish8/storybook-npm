/**
 * Builds design/figma-reports/README.md: one entry point listing every component whose UI changed, with a one-line
 * summary, whether it adds new Figma variants, and a link to its REPORT.md (before/after + measured values).
 *   node design/verify/figma-report-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../figma-reports");
const dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, "meta.json"))).map((d) => d.name).sort();
const first = (s) => { const t = (s || "").replace(/\s+/g, " "); const parts = t.split(/(?<=\.)\s/); let out = parts[0]; if (out.length < 70 && parts[1]) out += " " + parts[1]; return out.length > 260 ? out.slice(0, 257) + "..." : out; };
let md = `# v2 UI refresh: Figma change reports (2026-10-04)\n\n`;
md += `Every component below changed visually or interactively. Each folder has a \`REPORT.md\` with before/after screenshots, the **measured** style changes (px, hex, ms, taken from the rendered component) and numbered **Figma steps**.\n\n`;
md += `v2 stays a drop-in for v1: no existing prop, callback, aria-label or DOM contract changed (\`npm run verify:v1-v2-compat\`). Items marked **new variant** need a new Figma variant or property, not just a value edit.\n\n`;
md += `| Component | What changed | New in Figma | Report |\n| --- | --- | --- | --- |\n`;
for (const d of dirs) {
  const m = JSON.parse(fs.readFileSync(path.join(root, d, "meta.json"), "utf8"));
  const steps = (m.figmaSteps || []).join(" ").toLowerCase() + " " + (m.states || []).join(" ").toLowerCase();
  const isNew = /\bnew\b|add a boolean|add variant|new variant|new export|additive/.test(steps) ? "new variant / property" : "values only";
  md += `| ${m.title || d} | ${first(m.summary).replace(/\|/g, "\\|")} | ${isNew} | [${d}/REPORT.md](${d}/REPORT.md) |\n`;
}
md += `\n## Cross-cutting\n\n- **Entry animations now actually move.** \`motion-safe:animate-in\` used to cancel the fade/zoom/slide values next to it, so overlays appeared instantly. They now fade and scale (dialog 220ms 0.98 to 1 plus a 4px slide; popovers 200ms; month change 200ms). Figma prototypes should use: spring ease \`cubic-bezier(0.22, 1, 0.36, 1)\`, opacity 0 to 100, scale 98 to 100.\n- **Hover is gated for touch** (\`@media (hover:hover)\`): hover variants apply to pointer devices only.\n- **Focus ring** (one style everywhere): 2px solid #343E55, offset 1px outside the shape.\n- **Before baselines** of all 56 components: \`baseline-2026-10-04/\`.\n- **How these were produced:** \`design/verify/capture.mjs\` (screenshots + computed styles in headless Chrome with real input) and \`design/verify/figma-report.mjs\` (diff into REPORT.md).\n`;
fs.writeFileSync(path.join(root, "README.md"), md);
console.log(`wrote README.md with ${dirs.length} components`);
