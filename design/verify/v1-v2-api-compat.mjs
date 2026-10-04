/**
 * v1 -> v2 drop-in compatibility check (type level).
 *
 * Question answered: "if a developer changes `from "@/components/ui/button"` to
 * `from "@/components/ui/v2/button"`, does their code still type-check?"
 *
 * For every component that exists in both v1 and v2 it compares EVERY export of the v1 module:
 *   MISSING_EXPORT    v1 exports a name that v2 does not.
 *   MISSING_PROP      a v1 prop (own or inherited, e.g. onClick, aria-*) is absent from the v2 props.
 *   TYPE_NARROWED     a v1 prop type is not assignable to the v2 prop type (v2 accepts less, or a callback
 *                     would now be invoked with a value the v1-typed handler cannot take).
 *   NEWLY_REQUIRED    a prop optional in v1 is required in v2.
 *   NOT_SUBSTITUTABLE the v2 value is not assignable to the v1 value's type (catch-all for call
 *                     signatures, static members, ref types).
 * Informational (never fails): WIDENED = v2 accepts more than v1; EXTRA = v2-only props/exports.
 *
 *   node design/verify/v1-v2-api-compat.mjs [--only button,input] [--json out.json] [--info]
 *
 * Exit code 1 when any breaking finding exists that is not listed in the waiver file
 * (design/verify/v1-v2-compat.waivers.json), so it can run as a gate.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = path.join(root, "src/components/ui");

const argv = process.argv.slice(2);
const opt = (k) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : undefined);
const only = (opt("only") || "").split(",").filter(Boolean);
const showInfo = argv.includes("--info");

const waiverPath = path.join(root, "design/verify/v1-v2-compat.waivers.json");
const waivers = fs.existsSync(waiverPath) ? JSON.parse(fs.readFileSync(waiverPath, "utf8")) : [];
const waived = (f) => waivers.some((w) => w.gate === "types" && w.component === f.component && w.export === f.export && (w.prop ?? "") === (f.prop ?? "") && w.kind === f.kind);

// ---- program ---------------------------------------------------------------------------------------------
const cfgPath = path.join(root, "tsconfig.app.json");
const cfg = ts.getParsedCommandLineOfConfigFile(cfgPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n")); } });
const names = fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx") && !f.includes(".stories.")).map((f) => f.replace(/\.tsx$/, "")).filter((n) => fs.existsSync(path.join(uiDir, "v2", `${n}.tsx`)));
const rootFiles = names.flatMap((n) => [path.join(uiDir, `${n}.tsx`), path.join(uiDir, "v2", `${n}.tsx`)]);
const options = { ...cfg.options, noEmit: true, incremental: false, composite: false, tsBuildInfoFile: undefined };
const program1 = ts.createProgram({ rootNames: rootFiles, options });
const probePath = path.join(uiDir, "__compat_probe__.ts");
const probeText = buildProbe(program1);
const host = ts.createCompilerHost(options);
const realGet = host.getSourceFile.bind(host);
host.getSourceFile = (f, lv, ...r) => (path.resolve(f) === probePath ? ts.createSourceFile(f, probeText.text, lv, true) : realGet(f, lv, ...r));
const realExists = host.fileExists.bind(host);
host.fileExists = (f) => path.resolve(f) === probePath || realExists(f);
const program = ts.createProgram({ rootNames: [...rootFiles, probePath], options, host, oldProgram: program1 });
const checker = program.getTypeChecker();
const probeSf = program.getSourceFile(probePath);
const probeTypes = new Map();
for (const st of probeSf.statements) if (ts.isTypeAliasDeclaration(st)) probeTypes.set(st.name.text, checker.getDeclaredTypeOfSymbol(checker.getSymbolAtLocation(st.name)));

/** Pre-pass: for generic type exports and callable value exports, write instantiations the main pass can read.
 *  `Foo<any>` makes v1's T and v2's T the same type; `Parameters<typeof X>[0]` resolves generics at their constraint. */
function buildProbe(prog) {
  const c = prog.getTypeChecker();
  const lines = [];
  const arity = (sym) => (sym.declarations || []).map((d) => d.typeParameters?.length || 0).reduce((a, b) => Math.max(a, b), 0);
  for (const n of names) {
    lines.push(`import type * as A_${n.replace(/-/g, "_")} from "./${n}";`, `import type * as B_${n.replace(/-/g, "_")} from "./v2/${n}";`);
    const sf = prog.getSourceFile(path.join(uiDir, `${n}.tsx`));
    const msym = sf && c.getSymbolAtLocation(sf);
    if (!msym) continue;
    const id = n.replace(/-/g, "_");
    for (const e of c.getExportsOfModule(msym)) {
      const real = e.flags & ts.SymbolFlags.Alias ? c.getAliasedSymbol(e) : e;
      const k = arity(real);
      if (real.flags & ts.SymbolFlags.Type && k) {
        const args = Array(k).fill("any").join(", ");
        lines.push(`export type G1_${id}__${e.name} = A_${id}.${e.name}<${args}>;`, `export type G2_${id}__${e.name} = B_${id}.${e.name}<${args}>;`);
      }
      if (real.flags & ts.SymbolFlags.Value && !(real.flags & ts.SymbolFlags.Type && k)) {
        const t = c.getTypeOfSymbolAtLocation(real, real.valueDeclaration || real.declarations?.[0] || sf);
        if (t.getCallSignatures().length) {
          lines.push(`export type P1_${id}__${e.name} = Parameters<typeof A_${id}.${e.name}>[0];`, `export type P2_${id}__${e.name} = Parameters<typeof B_${id}.${e.name}>[0];`);
          lines.push(`export type R1_${id}__${e.name} = ReturnType<typeof A_${id}.${e.name}>;`, `export type R2_${id}__${e.name} = ReturnType<typeof B_${id}.${e.name}>;`);
        }
      }
    }
  }
  return { text: lines.join("\n") + "\n" };
}

const assignable = (a, b) => checker.isTypeAssignableTo(a, b);
const strict = (t) => checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope).replace(/\s+/g, " ");
const short = (s, n = 160) => (s.length > n ? `${s.slice(0, n)}…` : s);

function exportsOf(file) {
  const sf = program.getSourceFile(file);
  const sym = sf && checker.getSymbolAtLocation(sf);
  const map = new Map();
  if (!sym) return map;
  for (const e of checker.getExportsOfModule(sym)) {
    const real = e.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(e) : e;
    map.set(e.name, { sym: e, real, file: sf });
  }
  return map;
}

const nodeFor = (s) => s.valueDeclaration || s.declarations?.[0];
const valueType = (s) => checker.getTypeOfSymbolAtLocation(s.real, nodeFor(s.real) || s.file);

/** Properties a consumer may pass: union members are all considered (a prop valid on any member). */
function propMap(type) {
  const out = new Map();
  const visit = (t) => {
    if (t.isUnion()) return t.types.forEach(visit);
    for (const p of checker.getPropertiesOfType(t)) {
      const decl = nodeFor(p);
      const ty = decl ? checker.getTypeOfSymbolAtLocation(p, decl) : checker.getTypeOfSymbol(p);
      const prev = out.get(p.name);
      out.set(p.name, { type: prev ? checker.getUnionType([prev.type, ty]) : ty, optional: (p.flags & ts.SymbolFlags.Optional) !== 0 && (prev ? prev.optional : true) });
    }
  };
  visit(type);
  return out;
}

const SKIP_STATIC = new Set(["$$typeof", "propTypes", "defaultProps", "displayName", "contextTypes", "length", "name", "arguments", "caller", "prototype", "call", "apply", "bind", "toString"]);

function diffObject(a, b, base, push) {
  const pa = propMap(a);
  const pb = propMap(b);
  for (const [name, p1] of pa) {
    const p2 = pb.get(name);
    if (!p2) { push({ ...base, kind: "MISSING_PROP", prop: name, detail: `v1: ${short(strict(p1.type))}` }); continue; }
    if (!assignable(p1.type, p2.type)) push({ ...base, kind: "TYPE_NARROWED", prop: name, detail: `v1: ${short(strict(p1.type))} | v2: ${short(strict(p2.type))}` });
    else if (!assignable(p2.type, p1.type)) push({ ...base, kind: "WIDENED", prop: name, info: true, detail: `v1: ${short(strict(p1.type))} | v2: ${short(strict(p2.type))}` });
    if (p1.optional && !p2.optional) push({ ...base, kind: "NEWLY_REQUIRED", prop: name, detail: `optional in v1, required in v2` });
  }
  for (const [name, p2] of pb) if (!pa.has(name) && !p2.optional) push({ ...base, kind: "NEWLY_REQUIRED", prop: name, detail: `v2 requires a prop v1 does not have: ${short(strict(p2.type))}` });
  for (const name of pb.keys()) if (!pa.has(name)) push({ ...base, kind: "EXTRA", prop: name, info: true, detail: "" });
}

function firstParam(type) {
  const sig = type.getCallSignatures()[0] || type.getConstructSignatures()[0];
  const p = sig?.getParameters()[0];
  if (!p) return undefined;
  return checker.getTypeOfSymbolAtLocation(p, nodeFor(p) || program.getSourceFiles()[0]);
}

const findings = [];
const summary = [];
for (const name of names) {
  if (only.length && !only.includes(name)) continue;
  const e1 = exportsOf(path.join(uiDir, `${name}.tsx`));
  const e2 = exportsOf(path.join(uiDir, "v2", `${name}.tsx`));
  const local = [];
  const push = (f) => local.push({ component: name, ...f });
  for (const [exp, s1] of e1) {
    const s2 = e2.get(exp);
    const base = { export: exp };
    if (!s2) { push({ ...base, kind: "MISSING_EXPORT", detail: "" }); continue; }
    // Type side (interfaces / type aliases)
    if (s1.real.flags & ts.SymbolFlags.Type && !(s1.real.flags & ts.SymbolFlags.Value && !(s1.real.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)))) {
      if (!(s2.real.flags & ts.SymbolFlags.Type)) { push({ ...base, kind: "MISSING_EXPORT", detail: "exported as a type in v1, not a type in v2" }); continue; }
      const id = name.replace(/-/g, "_");
      const t1 = probeTypes.get(`G1_${id}__${exp}`) || checker.getDeclaredTypeOfSymbol(s1.real);
      const t2 = probeTypes.get(`G2_${id}__${exp}`) || checker.getDeclaredTypeOfSymbol(s2.real);
      if (!assignable(t1, t2)) push({ ...base, kind: "NOT_SUBSTITUTABLE", detail: "v1 type is not assignable to the v2 type" });
      if (t1.isUnion() && t2.isUnion() === false && !assignable(t1, t2)) continue;
      if (t1.getProperties().length || t2.getProperties().length) diffObject(t1, t2, base, push);
      else if (!assignable(t2, t1)) push({ ...base, kind: "WIDENED", info: true, detail: `v1: ${short(strict(t1))} | v2: ${short(strict(t2))}` });
      continue;
    }
    // Value side
    if (!(s2.real.flags & ts.SymbolFlags.Value)) { push({ ...base, kind: "MISSING_EXPORT", detail: "value in v1, not a value in v2" }); continue; }
    const t1 = valueType(s1);
    const t2 = valueType(s2);
    const hasCall = t1.getCallSignatures().length || t1.getConstructSignatures().length;
    const id = name.replace(/-/g, "_");
    const isPlain = t1.flags & (ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BooleanLike | ts.TypeFlags.Null | ts.TypeFlags.Undefined) || checker.isArrayType(t1) || checker.isTupleType(t1);
    if (isPlain) {
      const w1 = checker.getBaseTypeOfLiteralType(t1);
      const w2 = checker.getBaseTypeOfLiteralType(t2);
      if (!assignable(w2, w1)) push({ ...base, kind: "NOT_SUBSTITUTABLE", detail: `v1: ${short(strict(w1), 70)} | v2: ${short(strict(w2), 70)}` });
      continue;
    }
    if (hasCall) {
      const a = probeTypes.get(`P1_${id}__${exp}`) || firstParam(t1);
      const b = probeTypes.get(`P2_${id}__${exp}`) || firstParam(t2);
      const flagged = local.length;
      if (a && b && !(a.flags & ts.TypeFlags.Undefined) ) diffObject(a, b, base, push);
      else if (a && !(a.flags & ts.TypeFlags.Undefined) && !b) push({ ...base, kind: "NOT_SUBSTITUTABLE", detail: "v1 takes a parameter, v2 does not" });
      for (const p of t1.getProperties()) {
        if (SKIP_STATIC.has(p.name) || typeof p.name !== "string" || p.name.startsWith("__@")) continue;
        if (!t2.getProperty(p.name)) push({ ...base, kind: "MISSING_PROP", prop: `static:${p.name}`, detail: "static member on the v1 component is missing on v2" });
      }
      const r1 = probeTypes.get(`R1_${id}__${exp}`);
      const r2 = probeTypes.get(`R2_${id}__${exp}`);
      if (r1 && r2 && !assignable(r2, r1)) {
        if (assignable(r1, r2)) push({ ...base, kind: "OUTPUT_WIDENED", info: true, detail: `returns a wider type than v1: ${short(strict(r2), 90)}` });
        else push({ ...base, kind: "OUTPUT_CHANGED", detail: `v1 returns ${short(strict(r1), 70)} | v2 returns ${short(strict(r2), 70)}` });
      }
    } else if (t1.getProperties().length) {
      for (const p of t1.getProperties()) {
        if (SKIP_STATIC.has(p.name) || p.name.startsWith("__@")) continue;
        const q = t2.getProperty(p.name);
        if (!q) push({ ...base, kind: "MISSING_PROP", prop: p.name, detail: "member of v1 value missing on v2" });
        else {
          const x = checker.getTypeOfSymbolAtLocation(p, nodeFor(p) || s1.file);
          const y = checker.getTypeOfSymbolAtLocation(q, nodeFor(q) || s2.file);
          if (!assignable(y, x)) push({ ...base, kind: "TYPE_NARROWED", prop: p.name, detail: `v1: ${short(strict(x))} | v2: ${short(strict(y))}` });
        }
      }
    }
    // Catch-all: the v2 value must be usable wherever the v1 value was.
    if (!assignable(t2, t1)) {
      const already = local.some((f) => f.export === exp && f.kind !== "EXTRA" && f.kind !== "WIDENED" ? true : f.export === exp && f.kind === "OUTPUT_WIDENED");
      if (!already) push({ ...base, kind: "NOT_SUBSTITUTABLE", detail: `typeof v2 not assignable to typeof v1: ${short(strict(t2), 90)}` });
    }
  }
  for (const exp of e2.keys()) if (!e1.has(exp)) local.push({ component: name, export: exp, kind: "EXTRA", info: true, detail: "" });
  findings.push(...local);
  summary.push({ name, exports: e1.size, breaking: local.filter((f) => !f.info && !waived({ component: name, ...f })).length, waived: local.filter((f) => !f.info && waived({ component: name, ...f })).length, info: local.filter((f) => f.info).length });
}

// ---- report ----------------------------------------------------------------------------------------------
const breaking = findings.filter((f) => !f.info && !waived(f));
const byComp = new Map();
for (const f of breaking) { (byComp.get(f.component) || byComp.set(f.component, []).get(f.component)).push(f); }
for (const [c, list] of byComp) {
  console.log(`\n${c}  (${list.length})`);
  for (const f of list) console.log(`  ${f.kind.padEnd(16)} ${f.export}${f.prop ? "." + f.prop : ""}  ${f.detail}`);
}
if (showInfo) {
  console.log("\n--- informational ---");
  for (const f of findings.filter((x) => x.info && x.kind !== "EXTRA")) console.log(`  ${f.component}: ${f.export}${f.prop ? "." + f.prop : ""} ${f.kind} ${f.detail}`);
}
const totalExports = summary.reduce((n, s) => n + s.exports, 0);
console.log(`\n${summary.length} components, ${totalExports} v1 exports compared: ${breaking.length} breaking, ${findings.filter((f) => !f.info && waived(f)).length} waived, ${findings.filter((f) => f.info).length} informational`);
if (opt("json")) fs.writeFileSync(opt("json"), JSON.stringify({ summary, findings }, null, 2));
process.exit(breaking.length ? 1 : 0);
