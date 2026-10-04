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
    const target = path.join(uiDir, "v2", `${m[1]}.tsx`);
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
