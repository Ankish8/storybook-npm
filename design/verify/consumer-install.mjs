import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "v2-consumer-"));
const names = fs.readdirSync(path.join(root,"src/components/ui/v2")).filter(file=>file.endsWith(".tsx")&&!file.includes(".stories.")).map(file=>file.slice(0,-4)).sort();
for (const [folder, prefix] of [["plain", ""], ["prefixed", "tw-"]]) {
  const dir = path.join(scratch, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "local-v2-consumer", version: "0.0.0" }));
  fs.writeFileSync(path.join(dir, "components.json"), JSON.stringify({
    style: "default",
    tailwind: { config: "tailwind.config.js", css: "src/App.scss", baseColor: "slate", cssVariables: true, prefix },
    aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui" },
  }));
  const output = execFileSync(process.execPath, [path.join(root, "packages/cli/dist/index.js"), "add", ...names.map(name => "v2-" + name), "button", "--yes", "--no-install", "--path", "src/components/ui"], { cwd: dir, encoding: "utf8" });
  fs.writeFileSync(path.join(dir, "install.log"), output);
  for (const name of names) {
    const actual = fs.readFileSync(path.join(dir, "src/components/ui/v2/" + name + ".tsx"), "utf8");
    const expected = fs.readFileSync(path.join(root, "src/components/ui/v2/" + name + ".tsx"), "utf8").replace('"@/lib/utils"', '"../../../lib/utils"');
    assert.equal(actual, expected, name + " source must be installed verbatim");
    assert(!/(^|[\s"'\x60:])-?tw-/.test(actual));
  }
  const v1 = fs.readFileSync(path.join(dir, "src/components/ui/button.tsx"), "utf8");
  if (prefix) {
    assert(v1.includes("tw-inline-flex"));
    assert(output.includes("once an unprefixed Tailwind pass"));
  } else {
    assert(!v1.includes("tw-inline-flex"));
    assert(!output.includes("once an unprefixed Tailwind pass"));
  }
  console.log(folder + ": " + names.length + " v2 files match source; v1 button and prefix warning correct");
}
console.log("Consumer projects: " + scratch);
