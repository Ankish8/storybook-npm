import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// Development helper: change only string literals from the verified panel diff.
// The current library implementation remains the behavioral source of truth.
const root = process.cwd();
const name = process.argv[2];
const ui = path.join(root, "src/components/ui");
const file = path.join(ui, "v2", `${name}.tsx`);
const panel = "/Users/ankish/.codex/worktrees/92e4/ai-bot-frontend";
const unprefix = (value) => value
  .replace(/tw-/g, "")
  .replace(/font-v2/g, "font-[family-name:var(--font-v2,Inter,sans-serif)]")
  .replace(/(bg|text|border|ring|fill|stroke)-\[var\(--(semantic-[\w-]+),[^\]]+\)\]/g, "$1-$2");
const diff = execFileSync("git", ["-C", panel, "diff", "--", `myop-web-react/src/components/ui/${name}.tsx`], {encoding: "utf8"});
const strings = (source) => {
  const sf = ts.createSourceFile("source.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const values = [];
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) values.push(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return values;
};
let source = unprefix(fs.readFileSync(file, "utf8"));
const replacements = [];
const unmatched = [];
for (const hunk of diff.split(/^@@.*@@.*$/m).slice(1)) {
  const before = strings(hunk.split("\n").filter(l=>l.startsWith("-")).map(l=>l.slice(1)).join("\n"));
  const after = strings(hunk.split("\n").filter(l=>l.startsWith("+")).map(l=>l.slice(1)).join("\n"));
  if (before.length !== after.length) { unmatched.push({before, after}); continue; }
  for(let i=0;i<before.length;i++) {
    if(!before[i].includes("tw-")) continue;
    const old = unprefix(before[i]);
    const next = unprefix(after[i]);
    if(source.includes(old)) { source = source.replaceAll(old, next); replacements.push([old,next]); }
    else unmatched.push({before:old, after:next});
  }
}
fs.writeFileSync(file,source);
const testFile = path.join(ui, "__tests__", `${name}.test.tsx`);
if(fs.existsSync(testFile)) {
  let test = fs.readFileSync(testFile,"utf8");
  // Tests retain all current behavioral cases. Visual assertions are reviewed separately.
  test = test.replace(/from (["'])\.\.\/(.*?)\1/g, (_, q, p)=>`from ${q}../../${fs.existsSync(path.join(ui,'v2',p+'.tsx'))?'v2/':''}${p}${q}`)
    .replace(/from (["'])\.\/(.*?)\1/g, (_, q, p)=>`from ${q}../${p}${q}`);
  for(const [old,next] of replacements) test=test.replaceAll(old,next);
  fs.writeFileSync(path.join(ui,"__tests__/v2",`${name}.test.tsx`),test);
}
fs.writeFileSync(path.join(root,"design/verify",`${name}-port.json`),JSON.stringify({name,replacements,unmatched},null,2));
console.log(JSON.stringify({name, replacements:replacements.length,unmatched},null,2));
