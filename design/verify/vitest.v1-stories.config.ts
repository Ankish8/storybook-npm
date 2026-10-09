/**
 * Config for v1-stories-replay.test.tsx.
 *   REPLAY_V2=1  redirects the imports inside v1 stories ("./button") to the v2 component ("./v2/button")
 *   REPLAY_OUT   where to write the recording
 *   npx vitest run -c design/verify/vitest.v1-stories.config.ts
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const uiDir = path.join(root, "src/components/ui");
const merged: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, "design/verify/merged-components.json"), "utf8"));
const toV2 = process.env.REPLAY_V2 === "1";

const redirect = {
  name: "v1-stories-import-v2",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (!toV2 || !importer) return null;
    const imp = importer.split("?")[0];
    if (path.dirname(imp) !== uiDir || !imp.endsWith(".stories.tsx")) return null;
    const m = /^\.\/([a-z0-9-]+)$/.exec(source);
    if (!m) return null;
    // A v1 component folded into another v2 component resolves to the file that now owns it. A mapped target
    // that does not exist is an error: falling through would run the v1 test or story against v1 itself.
    const owner = merged[m[1]] ?? m[1];
    const target = path.join(uiDir, "v2", `${owner}.tsx`);
    if (merged[m[1]] && !fs.existsSync(target)) throw new Error(`${m[1]} is merged into v2/${owner}.tsx, which does not exist`);
    return fs.existsSync(target) ? target : null;
  },
};

export default defineConfig({
  root,
  plugins: [redirect, react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/components/ui/__tests__/setup.ts"],
    include: ["design/verify/v1-stories-replay.test.tsx"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { minThreads: 1, maxThreads: 1 } },
    testTimeout: 30000,
  },
  resolve: { alias: { "@": path.resolve(root, "src") } },
});
