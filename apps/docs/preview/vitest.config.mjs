import { defineConfig } from "vitest/config";
import preview from "./vite.config.mjs";
import { fileURLToPath } from "node:url";
export default defineConfig({
  ...preview,
  test: {
    environment: "jsdom",
    include: ["apps/docs/preview/src/*.test.tsx"],
    passWithNoTests: false,
    root: fileURLToPath(new URL("../../..", import.meta.url)),
  },
});
