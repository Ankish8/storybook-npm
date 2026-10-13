import { afterEach, describe, expect, it } from "vitest";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import ts from "typescript";
import {
  DEFAULT_CONFIG,
  ensureUtilsPrefixConfig,
  getUtilsAddition,
  getUtilsContent,
  upgradeUtilsContent,
} from "../utils/config.js";

const directories: string[] = [];
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((directory) => fs.remove(directory))
  );
});
const oldPrefixed = `import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
const twMerge = extendTailwindMerge({ prefix: "tw-" })
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export const applicationHelper = () => "preserved"
`;
async function project(content?: string, prefix = "tw-") {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "myop-cn-"));
  directories.push(directory);
  await fs.writeJson(path.join(directory, "components.json"), {
    ...DEFAULT_CONFIG,
    tailwind: { ...DEFAULT_CONFIG.tailwind, prefix },
  });
  const file = path.join(directory, "src/lib/utils.ts");
  if (content !== undefined) await fs.outputFile(file, content);
  return { directory, file };
}
function syntaxErrors(content: string) {
  return ts
    .transpileModule(content, {
      reportDiagnostics: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
      },
    })
    .diagnostics?.filter(
      (item) => item.category === ts.DiagnosticCategory.Error
    );
}
describe("cn migration for mixed v1 and v2 consumers", () => {
  it("creates a mixed-prefix helper when none exists", async () => {
    const { directory, file } = await project();
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: true,
      existed: false,
    });
    expect(syntaxErrors(await fs.readFile(file, "utf8"))).toEqual([]);
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: false,
      existed: true,
    });
  });
  it("upgrades the old prefixed template and preserves application exports", async () => {
    const { directory, file } = await project(oldPrefixed);
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: true,
      existed: true,
    });
    const result = await fs.readFile(file, "utf8");
    expect(result).toContain(
      'export const applicationHelper = () => "preserved"'
    );
    expect(result).toContain("twMerge(mergeUnprefixed(clsx(inputs)))");
    expect(syntaxErrors(result)).toEqual([]);
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: false,
      existed: true,
    });
  });
  it("upgrades the plain template when a legacy prefix is configured", () => {
    const result = upgradeUtilsContent(getUtilsContent(""), "tw-");
    expect(result).toContain('prefix: "tw-"');
    expect(result).toContain("myOperatorMergePrefixed(twMerge(clsx(inputs)))");
    expect(syntaxErrors(result)).toEqual([]);
  });
  it("preserves a custom cn implementation and its helper exports", async () => {
    const custom =
      'export const cn = (...inputs: string[]) => customMerge(inputs)\nexport const customMerge = (inputs: string[]) => inputs.join(" ")\n';
    const { directory, file } = await project(custom);
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: false,
      existed: true,
    });
    expect(await fs.readFile(file, "utf8")).toBe(custom);
  });
  it("preserves custom merge configuration", () => {
    const custom = oldPrefixed.replace(
      '{ prefix: "tw-" }',
      '{ prefix: "tw-", extend: { classGroups: {} } }'
    );
    expect(upgradeUtilsContent(custom, "tw-")).toBe(custom);
    expect(upgradeUtilsContent(oldPrefixed, "other-")).toBe(oldPrefixed);
  });
  it("leaves plain-only projects unchanged", async () => {
    const content = getUtilsContent("");
    const { directory, file } = await project(content, "");
    expect(await ensureUtilsPrefixConfig(directory)).toEqual({
      fixed: false,
      existed: true,
    });
    expect(await fs.readFile(file, "utf8")).toBe(content);
  });
  it.each(["", "tw-"])(
    "appends a valid helper beside existing imports (%s)",
    (prefix) => {
      const content =
        'import { clsx, type ClassValue } from "clsx"\nimport { twMerge, extendTailwindMerge } from "tailwind-merge"\nexport const existing = (value: ClassValue) => twMerge(clsx(value))\n' +
        getUtilsAddition(prefix);
      expect(syntaxErrors(content)).toEqual([]);
      expect(content).toContain("export const existing");
    }
  );
});
