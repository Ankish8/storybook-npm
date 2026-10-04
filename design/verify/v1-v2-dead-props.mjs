/**
 * Finds props that are declared in a component's own props interface but never read in the source.
 * A declared-but-unread prop is accepted by TypeScript and then silently ignored.
 *   node design/verify/v1-v2-dead-props.mjs [--only name]
 * Prints, per component, props that v2 never reads (and whether v1 reads them). Props that are only
 * forwarded through `...rest` to the DOM are still read by name when they are destructured; a prop that
 * is declared but not destructured/used is reported as "unread" for manual triage.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const ts = createRequire(import.meta.url)("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = path.join(root, "src/components/ui");
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : undefined;

function analyse(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declared = new Map(); // name -> interface
  const declNodes = new Set();
  const refs = new Map();
  const visitDecl = (node) => {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && /Props$|Options$|Config$/.test(node.name.text)) {
      const members = ts.isInterfaceDeclaration(node) ? node.members : ts.isTypeLiteralNode(node.type) ? node.type.members : [];
      for (const m of members) if (ts.isPropertySignature(m) && m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) { declared.set(m.name.text, node.name.text); declNodes.add(m.name); }
    }
    ts.forEachChild(node, visitDecl);
  };
  const visitRefs = (node) => {
    if (ts.isIdentifier(node) && !declNodes.has(node)) refs.set(node.text, (refs.get(node.text) || 0) + 1);
    if (ts.isStringLiteral(node) && node.parent && ts.isElementAccessExpression(node.parent)) refs.set(node.text, (refs.get(node.text) || 0) + 1);
    if (ts.isStringLiteral(node) && node.parent && ts.isPropertyAssignment(node.parent)) refs.set(node.text, (refs.get(node.text) || 0) + 1);
    ts.forEachChild(node, visitRefs);
  };
  visitDecl(sf); visitRefs(sf);
  return { declared, refs };
}

let total = 0, flagged = 0;
for (const f of fs.readdirSync(uiDir).filter((x) => x.endsWith(".tsx") && !x.includes(".stories."))) {
  const n = f.replace(/\.tsx$/, "");
  if (only && n !== only) continue;
  const v2p = path.join(uiDir, "v2", f);
  if (!fs.existsSync(v2p)) continue;
  const a1 = analyse(path.join(uiDir, f)), a2 = analyse(v2p);
  const rows = [];
  for (const [name, iface] of a1.declared) {
    total++;
    const r1 = a1.refs.get(name) || 0, r2 = a2.refs.get(name) || 0;
    const d2 = a2.declared.has(name);
    if (!d2) rows.push(`  NOT DECLARED in v2: ${iface}.${name}`);
    else if (r2 === 0) rows.push(`  UNREAD in v2:       ${iface}.${name}${r1 === 0 ? "   (also unread in v1: forwarded via rest or inherited use)" : "   <-- v1 reads it"}`);
    else if (r1 > 0 && r2 < Math.max(1, Math.floor(r1 / 3))) rows.push(`  FEWER READS:        ${iface}.${name}  v1 ${r1} refs vs v2 ${r2}`);
  }
  if (rows.length) { flagged += rows.length; console.log(`\n${n}`); rows.forEach((r) => console.log(r)); }
}
console.log(`\n${total} declared v1 props scanned, ${flagged} flagged for triage`);
process.exit(flagged ? 1 : 0);
