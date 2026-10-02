import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { uiComponentFiles } from "./ui-files.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
test("finds namespace primitives while excluding stories, tests and barrels", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "v2-ui-scan-"));
  try {
    for (const file of ["button.tsx", "button.stories.tsx", "button.test.tsx", "index.tsx", "v2/input.tsx", "v2/input.stories.tsx", "__tests__/input.tsx", "v2/__fixtures__/example.tsx", "next/deep/field.tsx"] ) {
      const target = path.join(dir, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, "export const Example = () => null;");
    }
    assert.deepEqual(uiComponentFiles(dir), ["button.tsx", "next/deep/field.tsx", "v2/input.tsx"]);
  } finally { fs.rmSync(dir, { recursive: true }); }
});

test("API snapshot includes v2 without replacing the recorded baseline", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "v2-api-scan-"));
  const baseline = fs.readFileSync(path.join(root, ".api-snapshot.json"));
  try {
    const output = path.join(dir, "snapshot.json");
    execFileSync(process.execPath, [path.join(root, "scripts/generate-api-snapshot.js"), "--output", output], { cwd: root, stdio: "pipe" });
    const snapshot = JSON.parse(fs.readFileSync(output, "utf8"));
    const files = uiComponentFiles(path.join(root, "src/components/ui"));
    assert.deepEqual(Object.keys(snapshot.components).sort(), files.map(file => file.slice(0, -4)).sort());
    assert(snapshot.components["v2/button"].exports.includes("Button"));
    assert(snapshot.components["v2/file-upload"].exports.includes("FileUpload"));
    assert(snapshot.components.button.exports.includes("Button"));
    assert(fs.readFileSync(path.join(root, ".api-snapshot.json")).equals(baseline));
  } finally { fs.rmSync(dir, { recursive: true }); }
});
