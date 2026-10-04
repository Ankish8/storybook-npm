/**
 * Compares two recordings from v1-stories-replay.test.tsx (v1 vs the same stories rendered with v2).
 *   node design/verify/v1-v2-story-diff.mjs v1.json v2.json [--only button] [--verbose]
 * Reports, per story: render errors, play failures, console messages v2 adds, and DOM differences that
 * are not styling (tags, roles, aria-*, data-*, input types, disabled/checked/value/placeholder, text).
 */
import fs from "node:fs";
const [, , f1, f2, ...rest] = process.argv;
const opt = (k) => (rest.includes(`--${k}`) ? rest[rest.indexOf(`--${k}`) + 1] : undefined);
const verbose = rest.includes("--verbose");
const only = opt("only");
const A = JSON.parse(fs.readFileSync(f1, "utf8"));
const B = JSON.parse(fs.readFileSync(f2, "utf8"));

const flat = (node, path = "", out = []) => {
  if (typeof node === "string") { out.push({ path, text: node }); return out; }
  const [tag, attrs, ...kids] = node;
  const here = `${path}/${tag}`;
  out.push({ path: here, tag, attrs });
  let i = {};
  for (const k of kids) {
    const t = typeof k === "string" ? "#text" : k[0];
    i[t] = (i[t] || 0) + 1;
    flat(k, `${here}[${t}${i[t] > 1 ? i[t] : ""}]`.replace(`${here}[`, `${here}>[`).replace(/^/, ""), out);
  }
  return out;
};
const texts = (tree) => flat(tree).filter((x) => "text" in x).map((x) => x.text);
const elems = (tree) => flat(tree).filter((x) => x.tag);
const sig = (e) => {
  const a = e.attrs;
  const keep = Object.keys(a).filter((k) => k === "role" || k.startsWith("aria-") || k.startsWith("data-") || ["type", "href", "disabled", "checked", "value", "placeholder", "name", "tabindex", "readonly", "required", "target", "rel", "alt", "src", "maxlength", "min", "max", "step", "autocomplete", "inputmode", "download"].includes(k)).sort();
  return `${e.tag}|${keep.map((k) => `${k}=${a[k]}`).join(",")}`;
};
// style-only data-* (state names the new design added) are not behaviour
const IGNORE_DATA = /^data-(v2|slot|variant|size|orientation|side|align|motion|state-motion)/;

const waiverFile = new URL("./v1-v2-compat.waivers.json", import.meta.url);
const waivers = (fs.existsSync(waiverFile) ? JSON.parse(fs.readFileSync(waiverFile, "utf8")) : []).filter((w) => w.gate === "stories");
const isWaived = (component, issue) => waivers.some((w) => w.component === component && issue.includes(w.match));

const keepAttr = (k) => (k === "role" || k.startsWith("aria-") || k.startsWith("data-") || ["type", "href", "disabled", "checked", "value", "placeholder", "name", "tabindex", "readonly", "required", "target", "rel", "alt", "src", "maxlength", "min", "max", "step", "autocomplete", "inputmode", "download"].includes(k)) && !IGNORE_DATA.test(k);
const describeEl = (e) => `${e.tag}[${Object.keys(e.attrs).filter(keepAttr).sort().map((k) => `${k}=${e.attrs[k]}`).join(" ")}]`;
/** every v1 element must still exist in v2 with the same tag and AT LEAST the same attributes (extra attributes = additive = fine) */
function lostElements(t1, t2) {
  const pool = elems(t2).map((e) => ({ e, used: false }));
  const lost = [];
  for (const e1 of elems(t1)) {
    const need = Object.entries(e1.attrs).filter(([k]) => keepAttr(k));
    const hit = pool.find((p) => !p.used && p.e.tag === e1.tag && need.every(([k, v]) => p.e.attrs[k] === v));
    if (hit) hit.used = true; else lost.push(describeEl(e1));
  }
  return lost;
}
const rows = [];
const bag = (list) => { const m = new Map(); for (const x of list) m.set(x, (m.get(x) || 0) + 1); return m; };
for (const key of Object.keys(A)) {
  if (only && !key.startsWith(only + "::")) continue;
  const a = A[key], b = B[key];
  const comp = key.split("::")[0];
  const r = { key, issues: [], waived: [], additive: 0 };
  const add = (msg) => (isWaived(comp, msg) ? r.waived.push(msg) : r.issues.push(msg));
  if (!b) { add("missing in v2 recording"); rows.push(r); continue; }
  if (b.error && !a.error) add(`RENDER ERROR in v2: ${b.error}`);
  if ((b.play || "").startsWith("FAILED") && !(a.play || "").startsWith("FAILED")) add(`PLAY FAILED in v2: ${b.play}`);
  const ca = bag(a.console || []);
  for (const m of new Set((b.console || []).filter((m) => !ca.has(m)))) add(`CONSOLE (v2 only): ${m}`);
  if (a.dom && b.dom) {
    const lost = lostElements(a.dom.tree, b.dom.tree);
    if (lost.length) add(`LOST v1 element/attribute in v2: ${[...new Set(lost)].slice(0, 5).join("; ")}`);
    const ta = bag(texts(a.dom.tree)), tb = bag(texts(b.dom.tree));
    const tl = [...ta].filter(([t, n]) => (tb.get(t) || 0) < n).map(([t]) => t);
    if (tl.length) add(`LOST v1 text in v2: ${tl.slice(0, 5).map((t) => JSON.stringify(t.slice(0, 50))).join(", ")}`);
    const clean = (x) => x.replace(/(radix-)?(:r[0-9a-z]+:|«r[0-9a-z]+»|_r_[0-9a-z]+_)/g, "<gen>");
    const ia = a.dom.ids.map(clean).filter((x) => x !== "<gen>").sort().join(","), ib = b.dom.ids.map(clean).filter((x) => x !== "<gen>").sort().join(",");
    if (ia !== ib && a.dom.ids.map(clean).some((x) => x !== "<gen>" && !b.dom.ids.map(clean).includes(x))) add(`explicit id lost: v1 [${ia}] v2 [${ib}]`);
    r.additive = elems(b.dom.tree).length - elems(a.dom.tree).length;
  }
  rows.push(r);
}
const bad = rows.filter((r) => r.issues.length);
const byComp = {};
for (const r of bad) (byComp[r.key.split("::")[0]] ||= []).push(r);
for (const [c, list] of Object.entries(byComp)) {
  console.log(`\n${c}: ${list.length} stories with differences`);
  for (const r of list.slice(0, verbose ? 999 : 2)) { console.log(`  ${r.key.split("::")[1]}`); for (const i of r.issues) console.log(`    - ${i}`); }
}
const kinds = (p) => bad.filter((r) => r.issues.some((i) => i.startsWith(p))).length;
const nWaived = rows.filter((r) => r.waived.length).length;
console.log(`\n${rows.length} stories compared: ${bad.length} with breaking differences | render errors ${kinds("RENDER")} | play failures ${kinds("PLAY")} | new console output ${kinds("CONSOLE")} | lost elements ${kinds("LOST v1 element")} | lost text ${kinds("LOST v1 text")} | lost ids ${kinds("explicit")} | waived ${nWaived}`);
process.exit(bad.length ? 1 : 0);
