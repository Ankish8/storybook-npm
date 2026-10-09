import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(app, "../..");
const children = [];
let exiting = false;
function stop(code = 0) {
  if (exiting) return;
  exiting = true;
  for (const child of children) child.kill("SIGTERM");
  process.exitCode = code;
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop());
function run(command, args, cwd, env = {}) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!exiting) stop(code ?? 1);
  });
}
run(
  process.execPath,
  [
    path.join(repo, "node_modules/vite/bin/vite.js"),
    "--config",
    path.join(app, "preview/vite.config.mjs"),
    "--port",
    "6011",
    "--strictPort",
  ],
  repo
);
run(
  process.execPath,
  [
    path.join(app, "node_modules/next/dist/bin/next"),
    "dev",
    "--webpack",
    "-p",
    "6009",
  ],
  app,
  { NEXT_PUBLIC_PREVIEW_ORIGIN: "http://localhost:6011" }
);
