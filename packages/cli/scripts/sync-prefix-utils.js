#!/usr/bin/env node

/**
 * Validates that single-word Tailwind utilities (relative, flex, hidden, etc.)
 * are checked BEFORE the npm package name regex in looksLikeTailwindClasses().
 *
 * This prevents the bug where className="relative" is misidentified as an npm
 * package name and fails to get the tw- prefix.
 *
 * The check applies to both:
 *   - src/utils/prefix-utils.ts (runtime code in the built CLI)
 *   - scripts/generate-registry.js (template code embedded in registry files)
 *
 * Run: node scripts/sync-prefix-utils.js --check
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const files = [
  { path: path.join(__dirname, '../src/utils/prefix-utils.ts'), label: 'prefix-utils.ts' },
  { path: path.join(__dirname, 'generate-registry.js'), label: 'generate-registry.js' },
]

let allPassed = true

for (const file of files) {
  const code = fs.readFileSync(file.path, 'utf8')
  const lines = code.split('\n')

  // Find the line with the early-return singleWordUtilities check (before npm regex)
  // Pattern: if (!str.includes(' ') && singleWordUtilities.test(str)) return true
  const earlyReturnLine = lines.findIndex(l =>
    l.includes('singleWordUtilities') && l.includes('return true') && l.includes('str.includes')
  )

  // Find the npm regex line
  // Pattern: if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(str)
  const npmRegexLine = lines.findIndex(l =>
    l.includes('[a-z][a-z0-9-]*$') && l.includes('.test(str)') && l.includes('return false')
  )

  if (earlyReturnLine === -1) {
    console.error(`❌ ${file.label}: Missing early singleWordUtilities check before npm regex`)
    console.error(`   Add: if (!str.includes(' ') && singleWordUtilities.test(str)) return true`)
    allPassed = false
    continue
  }

  if (npmRegexLine === -1) {
    // No npm regex found — might be fine
    console.log(`✓ ${file.label}: No npm regex found (OK)`)
    continue
  }

  if (earlyReturnLine < npmRegexLine) {
    console.log(`✓ ${file.label}: singleWordUtilities check (line ${earlyReturnLine + 1}) is before npm regex (line ${npmRegexLine + 1})`)
  } else {
    console.error(`❌ ${file.label}: singleWordUtilities check (line ${earlyReturnLine + 1}) must come BEFORE npm regex (line ${npmRegexLine + 1})`)
    allPassed = false
  }
}

if (allPassed) {
  console.log('\n✅ Prefix utils sync check passed')
  process.exit(0)
} else {
  console.error('\n❌ Prefix utils sync check failed')
  process.exit(1)
}
