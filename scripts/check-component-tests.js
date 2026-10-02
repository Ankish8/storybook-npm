#!/usr/bin/env node

/**
 * Pre-commit hook script to ensure all components have test files.
 *
 * This script checks that for every component file (*.tsx) in src/components/ui/,
 * there is a corresponding test file in src/components/ui/__tests__/
 *
 * v2 primitives live in src/components/ui/v2/ and are held to the same rule, with
 * their tests in src/components/ui/__tests__/v2/ (this script used to scan only the
 * flat ui/ folder, so v2 components would have escaped the check).
 *
 * Exit codes:
 *   0 - All components have tests
 *   1 - Some components are missing tests
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const TESTS_DIR = path.resolve(__dirname, '../src/components/ui/__tests__')

// Each target is a folder of components plus the folder its tests live in.
const TARGETS = [
  { label: '', dir: COMPONENTS_DIR, testsDir: TESTS_DIR },
  { label: 'v2/', dir: path.join(COMPONENTS_DIR, 'v2'), testsDir: path.join(TESTS_DIR, 'v2') },
]

const missingTests = []
const missingStories = []

for (const { label, dir, testsDir } of TARGETS) {
  if (!fs.existsSync(dir)) continue

  // Get all component files (exclude stories, tests, and index files)
  const componentFiles = fs.readdirSync(dir)
    .filter(file =>
      file.endsWith('.tsx') &&
      !file.includes('.stories.') &&
      !file.includes('.test.') &&
      file !== 'index.tsx'
    )

  for (const file of componentFiles) {
    const componentName = file.replace('.tsx', '')

    // Check for test file
    const testFile = path.join(testsDir, `${componentName}.test.tsx`)
    if (!fs.existsSync(testFile)) {
      missingTests.push({ name: `${label}${componentName}`, testsDir })
    }

    // Check for story file
    const storyFile = path.join(dir, `${componentName}.stories.tsx`)
    if (!fs.existsSync(storyFile)) {
      missingStories.push({ name: `${label}${componentName}`, dir })
    }
  }
}

let hasErrors = false

if (missingTests.length > 0) {
  console.error('\n❌ Components missing test files:')
  missingTests.forEach(({ name }) => {
    const base = name.split('/').pop()
    console.error(`   - ${name}.tsx → missing ${base}.test.tsx`)
  })
  console.error(`\n   Create tests in: src/components/ui/__tests__/ (v2: src/components/ui/__tests__/v2/)`)
  console.error(`   Or use: node scripts/create-component.js <name> to scaffold all files\n`)
  hasErrors = true
}

if (missingStories.length > 0) {
  console.error('\n⚠️  Components missing story files:')
  missingStories.forEach(({ name }) => {
    const base = name.split('/').pop()
    console.error(`   - ${name}.tsx → missing ${base}.stories.tsx`)
  })
  console.error(`\n   Create stories next to the component (src/components/ui/, v2: src/components/ui/v2/)`)
  console.error(`   Or use: node scripts/create-component.js <name> to scaffold all files\n`)
  // Stories are a warning, not blocking
}

if (hasErrors) {
  console.error('❌ Pre-commit check failed. All components must have test files.\n')
  process.exit(1)
}

console.log('✅ All components have required test files.')
process.exit(0)
