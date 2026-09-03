#!/usr/bin/env node

/**
 * Pre-commit hook script to ensure all components have test files.
 *
 * This script checks that for every component file (*.tsx) in src/components/ui/,
 * there is a corresponding test file in src/components/ui/__tests__/
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

// Get all component files (exclude stories, tests, and index files)
const componentFiles = fs.readdirSync(COMPONENTS_DIR)
  .filter(file =>
    file.endsWith('.tsx') &&
    !file.includes('.stories.') &&
    !file.includes('.test.') &&
    file !== 'index.tsx'
  )

const missingTests = []
const missingStories = []

for (const file of componentFiles) {
  const componentName = file.replace('.tsx', '')

  // Check for test file
  const testFile = path.join(TESTS_DIR, `${componentName}.test.tsx`)
  if (!fs.existsSync(testFile)) {
    missingTests.push(componentName)
  }

  // Check for story file
  const storyFile = path.join(COMPONENTS_DIR, `${componentName}.stories.tsx`)
  if (!fs.existsSync(storyFile)) {
    missingStories.push(componentName)
  }
}

let hasErrors = false

if (missingTests.length > 0) {
  console.error('\n❌ Components missing test files:')
  missingTests.forEach(name => {
    console.error(`   - ${name}.tsx → missing ${name}.test.tsx`)
  })
  console.error(`\n   Create tests in: src/components/ui/__tests__/`)
  console.error(`   Or use: node scripts/create-component.js <name> to scaffold all files\n`)
  hasErrors = true
}

if (missingStories.length > 0) {
  console.error('\n⚠️  Components missing story files:')
  missingStories.forEach(name => {
    console.error(`   - ${name}.tsx → missing ${name}.stories.tsx`)
  })
  console.error(`\n   Create stories in: src/components/ui/`)
  console.error(`   Or use: node scripts/create-component.js <name> to scaffold all files\n`)
  // Stories are a warning, not blocking
}

if (hasErrors) {
  console.error('❌ Pre-commit check failed. All components must have test files.\n')
  process.exit(1)
}

console.log('✅ All components have required test files.')
process.exit(0)
