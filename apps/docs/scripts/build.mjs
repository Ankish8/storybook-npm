import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(app, "../..");
for (const [args, cwd] of [
  [
    [
      path.join(repo, "node_modules/vite/bin/vite.js"),
      "build",
      "--config",
      path.join(app, "preview/vite.config.mjs"),
    ],
    repo,
  ],
  [[path.join(app, "scripts/check-preview-cascade.mjs")], repo],
  [
    [path.join(app, "node_modules/next/dist/bin/next"), "build", "--webpack"],
    app,
  ],
]) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_PREVIEW_ORIGIN: "" },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
