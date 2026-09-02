import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // `viteSingleFile` inlines every chunk and stylesheet into index.html, which is
  // what Merlin stores and what the Live view iframes. One file, no asset host.
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  resolve: {
    // Straight into the design system's source, exactly like tests/onboard —
    // unprefixed Tailwind, the same components Storybook renders. The `tw-` prefix
    // belongs to CLI-installed copies and must never be mixed in here.
    alias: { "@": path.resolve(__dirname, "../../src") },
    // Belt and braces: a twin has no dependencies of its own and resolves React from
    // the repo root, but a stray install here would otherwise give it a second copy
    // and every hook would throw.
    dedupe: ["react", "react-dom"],
  },
  server: { port: 5199, host: "127.0.0.1" },
  build: { cssCodeSplit: false },
});
