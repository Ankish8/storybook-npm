import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../../../");

describe("Bootstrap compatibility guard", () => {
  it("passes the repository-wide paragraph margin reset scan", () => {
    const result = spawnSync(process.execPath, ["scripts/check-bootstrap-compat.js"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    const combinedOutput = [result.stdout, result.stderr].filter(Boolean).join("\n");

    expect(result.status, combinedOutput || "Bootstrap compatibility script failed").toBe(0);
  });
});
