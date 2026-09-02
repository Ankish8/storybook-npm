import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveWorkspace } from "./workspace.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
export const TEMPLATE_DIR = path.join(here, "..", "template");

/*
 * WHERE A TWIN LANDS IS RESOLVED, NOT COMPUTED FROM THIS FILE'S LOCATION.
 *
 * This used to be `path.resolve(here, "..", "..", "..")`, which lands on the repo
 * root from tools/merlin/lib/ — and on the PLUGIN root from a plugin's bin/lib/,
 * where there is no src/ to build against. The twin template hardwires `../../src`,
 * so the directory a twin is created in is not a detail: it IS the build.
 *
 * `resolveWorkspace` prefers a real checkout found by walking up from the cwd, so a
 * maintainer inside the repo is unaffected, and falls back to the managed
 * ~/.merlin/design-system for everyone else.
 */
export function workspaceRoot() {
  const dir = resolveWorkspace();
  if (!dir) {
    const error = new Error(
      "No design-system workspace. Run `merlin workspace` to set one up, " +
        "or run this from inside a checkout of the design system.",
    );
    error.code = "NO_WORKSPACE";
    throw error;
  }
  return dir;
}

export function twinsDir() {
  return path.join(workspaceRoot(), "twins");
}

export function slugify(value) {
  return (
    String(value ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "screen"
  );
}

/** A slug that is not already taken, so two builds never share a directory. */
export function availableSlug(base) {
  const twins = twinsDir();
  const slug = slugify(base);
  if (!fs.existsSync(path.join(twins, slug))) return slug;
  for (let n = 2; n < 100; n += 1) {
    if (!fs.existsSync(path.join(twins, `${slug}-${n}`))) return `${slug}-${n}`;
  }
  throw new Error(`Too many twins named ${slug}. Delete some under twins/.`);
}

function copyTree(from, to, replacements) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(source, target, replacements);
      continue;
    }
    let content = fs.readFileSync(source, "utf8");
    for (const [token, value] of Object.entries(replacements)) {
      content = content.split(token).join(value);
    }
    fs.writeFileSync(target, content);
  }
}

/**
 * Create `twins/<slug>/` from the template.
 *
 * Deliberately does NOT npm install: a twin declares no dependencies and resolves
 * react, vite and tailwind from the repo root, which is what guarantees ONE copy of
 * React. Installing here is how a twin gets a second one and every hook throws.
 */
export function scaffoldTwin(slug, { title } = {}) {
  const dir = path.join(twinsDir(), slug);
  if (fs.existsSync(dir)) throw new Error(`twins/${slug} already exists.`);
  copyTree(TEMPLATE_DIR, dir, { __SLUG__: slug, __TITLE__: title ?? slug });
  return dir;
}
