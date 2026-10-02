#!/usr/bin/env node
/**
 * Dead-class detector for UNPREFIXED v2 components.
 *
 * Builds real Tailwind (repo-root config, prefix "", important: true) over the given
 * file(s) and reports every class token that produced NO css rule. A "dead" class is
 * one the author wrote but the consumer's Tailwind never generates - the failure mode
 * that made `tw-[appearance:textfield]` silently dead in v1.
 *
 * Usage (run from the storybook-npm-v2 repo root):
 *   node design/verify/dead-classes.mjs src/components/ui/v2/button.tsx
 *   node design/verify/dead-classes.mjs <scratch-consumer>/src/components/ui/v2/button.tsx
 *
 * Exit code 1 when any token is dead. Tokens are taken from string literals inside
 * cva(...), cn(...) and className="..." only, and object KEYS ("icon-sm": ...) are
 * skipped, so prose and variant names don't produce false positives. It can still
 * miss classes built by string concatenation - keep class strings literal.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const files = process.argv.slice(2).map((f) => path.resolve(f));
if (files.length === 0) {
  console.error("usage: node design/verify/dead-classes.mjs <file.tsx> [more files]");
  process.exit(2);
}

const require = createRequire(import.meta.url);
const escapeClassName = require(path.join(root, "node_modules/tailwindcss/lib/util/escapeClassName")).default;

// 1) build css exactly like an unprefixed consumer would
const dir = mkdtempSync(path.join(tmpdir(), "dead-classes-"));
const configPath = path.join(dir, "tailwind.config.mjs");
writeFileSync(
  configPath,
  `import base from ${JSON.stringify(pathToFileURL(path.join(root, "tailwind.config.js")).href)};\n` +
    `export default { ...base, prefix: "", important: true, content: ${JSON.stringify(files)} };\n`
);
writeFileSync(path.join(dir, "in.css"), "@tailwind utilities;\n");
const outPath = path.join(dir, "out.css");
execFileSync(
  path.join(root, "node_modules/.bin/tailwindcss"),
  ["-c", configPath, "-i", path.join(dir, "in.css"), "-o", outPath],
  { stdio: "pipe" }
);
const css = readFileSync(outPath, "utf8");

// 2) collect class tokens from the places classes actually live
function callBodies(src, name) {
  const bodies = [];
  const re = new RegExp(`\\b${name}\\s*\\(`, "g");
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < src.length && depth > 0) {
      if (src[i] === "(") depth++;
      else if (src[i] === ")") depth--;
      i++;
    }
    bodies.push(src.slice(m.index + m[0].length, i - 1));
  }
  return bodies;
}

const SINGLE_WORD = new Set([
  "flex", "grid", "block", "inline", "hidden", "relative", "absolute", "fixed", "sticky", "static",
  "truncate", "underline", "uppercase", "lowercase", "capitalize", "italic", "border", "rounded",
  "shadow", "outline", "transition", "ring", "container", "grow", "shrink", "invisible", "visible",
]);

/**
 * String literals in a code chunk, scanned sequentially so quotes pair correctly.
 * Object KEYS ("icon-sm": ...) are skipped - they sit after "{" or "," and before ":" -
 * while ternary branches (cond ? "a" : "b") are kept.
 */
function stringLiterals(chunk) {
  const out = [];
  const re = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m;
  while ((m = re.exec(chunk))) {
    const before = chunk.slice(0, m.index).trimEnd().slice(-1);
    const after = chunk.slice(re.lastIndex).trimStart().slice(0, 1);
    const isKey = after === ":" && (before === "{" || before === "," || before === "");
    if (!isKey) out.push(m[2]);
  }
  return out;
}

function tokensOf(src) {
  const literals = [];
  // CVA defaults select variant names; their strings are not CSS classes.
  const cvaChunks = callBodies(src, "cva").map((body) =>
    body.replace(/\bdefaultVariants\s*:\s*\{[^}]*\}/g, "")
  );
  const chunks = [...cvaChunks, ...callBodies(src, "cn")];
  for (const m of src.matchAll(/className\s*=\s*"([^"\n]+)"/g)) literals.push(m[1]);
  for (const chunk of chunks) literals.push(...stringLiterals(chunk));
  return literals
    .flatMap((s) => s.split(/\s+/))
    .filter(Boolean)
    .filter((t) => !/^[@./]/.test(t))
    .filter((t) => /[-:[\]]/.test(t) || SINGLE_WORD.has(t));
}

let totalTokens = 0;
let dead = [];
for (const file of files) {
  const tokens = [...new Set(tokensOf(readFileSync(file, "utf8")))];
  totalTokens += tokens.length;
  for (const token of tokens) {
    if (!css.includes("." + escapeClassName(token))) dead.push({ file: path.relative(root, file), token });
  }
}

console.log(`files: ${files.length} | class tokens checked: ${totalTokens} | css bytes: ${css.length}`);
if (dead.length === 0) {
  console.log("dead classes: 0");
} else {
  console.log(`dead classes: ${dead.length}`);
  for (const d of dead) console.log(`  DEAD  ${d.token}   (${d.file})`);
  process.exit(1);
}
