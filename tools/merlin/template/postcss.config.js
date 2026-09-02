import path from "node:path";
import { fileURLToPath } from "node:url";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const dir = path.dirname(fileURLToPath(import.meta.url));

/*
 * The config path is resolved against THIS FILE, not the working directory.
 *
 * A bare "./tailwind.config.js" resolves against CWD, so running vite from the repo
 * root would silently load the ROOT config — whose content globs do not include this
 * twin — and every class in the build would be purged. The failure looks like broken
 * CSS, not like a misresolved path.
 */
export default {
  plugins: [tailwindcss(path.resolve(dir, "tailwind.config.js")), autoprefixer()],
};
