#!/usr/bin/env node
/**
 * Regenerates packages/cli registry outputs after clone or install.
 * Registry *.ts files are gitignored — see root .gitignore — to avoid merge conflicts.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const script = path.join(root, 'packages', 'cli', 'scripts', 'generate-registry.js')

if (!fs.existsSync(script)) {
  process.exit(0)
}

const result = spawnSync(process.execPath, [script], {
  cwd: path.join(root, 'packages', 'cli'),
  stdio: 'inherit',
})
process.exit(result.status ?? 1)
