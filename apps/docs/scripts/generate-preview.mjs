#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { build, createServer } from "vite";
const configFile = fileURLToPath(
  new URL("../preview/vite.config.mjs", import.meta.url)
);
if (process.argv.includes("--dev")) {
  const server = await createServer({ configFile });
  await server.listen();
  server.printUrls();
} else await build({ configFile });
