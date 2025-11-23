import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ShadcnReactApp",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "styles.css"
          return assetInfo.name || ""
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
