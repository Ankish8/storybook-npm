import baseConfig from "../../tailwind.config.js";

/*
 * The design system's own theme, with content globs that reach BOTH this twin and
 * the components it imports from `src/`. Miss the second and every DS class is
 * purged — the twin renders as unstyled HTML.
 */
export default {
  ...baseConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../src/components/**/*.{js,ts,jsx,tsx}",
    "../../src/lib/**/*.{js,ts,jsx,tsx}",
  ],
};
