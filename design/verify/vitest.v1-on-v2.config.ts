/**
 * Runs the UNCHANGED v1 test suite against the v2 components.
 *
 * Every v1 test imports its component from "../<name>". This config rewrites those imports to
 * "../v2/<name>", so each v1 assertion (callbacks, refs, aria, DOM roles, prop pass-through,
 * defaults, controlled/uncontrolled behaviour) is replayed on v2. A failure here is a place where
 * swapping v1 for v2 would change behaviour for a consumer.
 *
 *   npx vitest run -c design/verify/vitest.v1-on-v2.config.ts
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const uiDir = path.join(root, "src/components/ui");

const v1OnV2 = {
  name: "v1-tests-import-v2",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (!importer) return null;
    const imp = importer.split("?")[0];
    if (path.dirname(imp) !== path.join(uiDir, "__tests__")) return null;
    const m = /^\.\.\/([a-z0-9-]+)$/.exec(source);
    if (!m) return null;
    const target = path.join(uiDir, "v2", `${m[1]}.tsx`);
    return fs.existsSync(target) ? target : null;
  },
};

export default defineConfig({
  root,
  plugins: [v1OnV2, react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/components/ui/__tests__/setup.ts"],
    include: ["src/components/ui/__tests__/*.test.{ts,tsx}"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { minThreads: 2, maxThreads: 4 } },
  },
  resolve: { alias: { "@": path.resolve(root, "src") } },
});
