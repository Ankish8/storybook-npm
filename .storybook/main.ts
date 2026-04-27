import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../src/docs/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "storybook-addon-pseudo-states",
    "storybook-design-token",
    "@storybook/addon-designs"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {},
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };
    config.css = {
      ...config.css,
      postcss: {
        plugins: [
          tailwindcss(path.resolve(__dirname, "tailwind.config.storybook.js")),
          autoprefixer(),
        ],
      },
    };
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(Array.isArray(config.optimizeDeps.include) ? config.optimizeDeps.include : []),
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "lucide-react",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ];
    // Force esbuild (used by Storybook's CSF pre-transform) to use the automatic
    // JSX runtime so story files don't need an explicit `import React from "react"`.
    // Without this, top-level JSX in argTypes.mapping throws "React is not defined"
    // at module load because esbuild defaults to the classic React.createElement
    // transform and does not inject a React import.
    config.esbuild = {
      ...config.esbuild,
      jsx: "automatic",
    };
    return config;
  },
};
export default config;