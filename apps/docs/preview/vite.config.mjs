import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import rootTailwind from "../../../tailwind.config.js";
import pseudoStates from "./pseudo-states.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(here, "../../..");
// Next/Fumadocs uses Tailwind 4; canonical stories must keep the root Tailwind 3 compiler.
const requireRoot = createRequire(path.join(repository, "package.json"));
const tailwindcss = requireRoot("tailwindcss");
const autoprefixer = requireRoot("autoprefixer");
// The example demos are found with import.meta.glob. Vite only watches files the glob already matched, so a new
// example (or a whole new component folder) would be missing until the dev server restarted. Watch the folder and
// reload the example runtime whenever a demo is added or removed.
const examplesDirectory = path.resolve(here, "../examples");
const watchExamples = {
  name: "docs-watch-examples",
  configureServer(server) {
    server.watcher.add(examplesDirectory);
    const refresh = (file) => {
      if (!file.startsWith(examplesDirectory)) return;
      const runtime = server.moduleGraph.getModulesByFile(
        path.join(here, "src/example.tsx")
      );
      runtime?.forEach((module) => server.moduleGraph.invalidateModule(module));
      server.ws.send({ type: "full-reload" });
    };
    server.watcher.on("add", refresh);
    server.watcher.on("unlink", refresh);
  },
};

export default defineConfig({
  root: here,
  base: "/preview/",
  plugins: [react(), watchExamples],
  resolve: {
    alias: [
      {
        find: /^storybook\/preview-api$/,
        replacement: path.join(here, "src/preview-api.tsx"),
      },
      {
        find: /^storybook\/test$/,
        replacement: path.join(here, "src/storybook-test.ts"),
      },
      { find: "@", replacement: path.join(repository, "src") },
      {
        find: "react",
        replacement: path.dirname(requireRoot.resolve("react/package.json")),
      },
      {
        find: "react-dom",
        replacement: path.dirname(
          requireRoot.resolve("react-dom/package.json")
        ),
      },
    ],
    dedupe: ["react", "react-dom"],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          ...rootTailwind,
          // Like Storybook, previews load Bootstrap for the v1 comparison.
          // Its !important utilities must not hide v2 spinners or tint borders.
          important: true,
          content: [
            path.join(repository, "src/**/*.{js,ts,jsx,tsx}"),
            path.join(here, "**/*.{html,js,ts,jsx,tsx}"),
            // The docs' example demos: real consumer code that the iframe renders and the page shows.
            path.join(here, "../examples/**/*.{ts,tsx}"),
          ],
        }),
        autoprefixer(),
        pseudoStates(),
      ],
    },
  },
  server: {
    host: "127.0.0.1",
    port: 6011,
    strictPort: true,
    fs: { allow: [repository] },
  },
  preview: { host: "127.0.0.1", port: 6011, strictPort: true },
  build: {
    outDir: path.resolve(here, "../public/preview"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      // Two entries: the story runner (index) and the single-example page (example).
      input: {
        index: path.join(here, "index.html"),
        example: path.join(here, "example.html"),
      },
    },
  },
});
