#!/usr/bin/env node

/**
 * Smart Test Runner — only tests components with uncommitted changes.
 *
 * Usage:
 *   node scripts/smart-test.js              # Test only changed components
 *   node scripts/smart-test.js --all        # Force test everything
 *
 * How it works:
 *   1. Uses `git diff` to find changed component/test files
 *   2. Maps changed files to their component test
 *   3. Only runs tests for affected components
 *   4. No cache file needed — works on any fresh clone
 */

import { existsSync, readdirSync, statSync } from 'fs'
import { execSync } from 'child_process'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const UI_DIR = join(ROOT, 'src/components/ui')
const UI_TESTS = join(UI_DIR, '__tests__')
const CUSTOM_DIR = join(ROOT, 'src/components/custom')

const forceAll = process.argv.includes('--all')

// Get changed files from git (uncommitted + staged + untracked)
function getChangedFiles() {
  try {
    const diff = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim()
    const staged = execSync('git diff --name-only --cached', { cwd: ROOT, encoding: 'utf-8' }).trim()
    const untracked = execSync('git ls-files --others --exclude-standard', { cwd: ROOT, encoding: 'utf-8' }).trim()
    const all = [diff, staged, untracked].filter(Boolean).join('\n')
    return [...new Set(all.split('\n').filter(Boolean))]
  } catch {
    return []
  }
}

// Map a changed file path to its component name
function fileToComponent(filePath) {
  // UI component: src/components/ui/button.tsx or src/components/ui/__tests__/button.test.tsx
  const uiMatch = filePath.match(/^src\/components\/ui\/(?:__tests__\/)?([^/.]+?)(?:\.test)?\.tsx$/)
  if (uiMatch) return uiMatch[1]

  // Custom component: src/components/custom/wallet-topup/**
  const customMatch = filePath.match(/^src\/components\/custom\/([^/]+)\//)
  if (customMatch) return customMatch[1]

  // Shared test utils changed — test everything
  if (filePath.includes('__tests__/utils/')) return '__ALL__'

  return null
}

// Find test path for a component
function findTestPath(name) {
  // UI test
  const uiTest = join(UI_TESTS, `${name}.test.tsx`)
  if (existsSync(uiTest)) return uiTest

  // Custom test
  const customTestDir = join(CUSTOM_DIR, name, '__tests__')
  if (existsSync(customTestDir)) {
    const testFiles = readdirSync(customTestDir).filter(f => f.endsWith('.test.tsx'))
    if (testFiles.length > 0) return join(customTestDir, testFiles[0])
  }

  return null
}

// Collect all component test paths (for --all mode)
function getAllTestPaths() {
  const tests = []

  if (existsSync(UI_DIR)) {
    for (const file of readdirSync(UI_DIR)) {
      if (!file.endsWith('.tsx') || file.includes('.stories.')) continue
      const name = basename(file, '.tsx')
      const testPath = join(UI_TESTS, `${name}.test.tsx`)
      if (existsSync(testPath)) tests.push({ name, testPath })
    }
  }

  if (existsSync(CUSTOM_DIR)) {
    for (const dir of readdirSync(CUSTOM_DIR)) {
      const dirPath = join(CUSTOM_DIR, dir)
      if (!statSync(dirPath).isDirectory()) continue
      const testDir = join(dirPath, '__tests__')
      if (!existsSync(testDir)) continue
      const testFiles = readdirSync(testDir).filter(f => f.endsWith('.test.tsx'))
      if (testFiles.length > 0) tests.push({ name: dir, testPath: join(testDir, testFiles[0]) })
    }
  }

  return tests
}

// Determine what to test
let toTest = []

if (forceAll) {
  toTest = getAllTestPaths()
} else {
  const changedFiles = getChangedFiles()
  const changedComponents = new Set()

  for (const file of changedFiles) {
    const comp = fileToComponent(file)
    if (comp === '__ALL__') {
      toTest = getAllTestPaths()
      break
    }
    if (comp) changedComponents.add(comp)
  }

  if (toTest.length === 0) {
    for (const name of changedComponents) {
      const testPath = findTestPath(name)
      if (testPath) {
        toTest.push({ name, testPath })
      } else {
        console.log(`  ⚠ ${name} — no test file found`)
      }
    }
  }
}

const allTests = getAllTestPaths()

console.log(`\n🧪 Smart Test Runner`)
console.log(`═══════════════════════════════════════`)
console.log(`  Total components: ${allTests.length}`)
console.log(`  Unchanged (skip): ${allTests.length - toTest.length}`)
console.log(`  Need testing:     ${toTest.length}`)
console.log(`═══════════════════════════════════════\n`)

if (toTest.length === 0) {
  console.log('✅ No component changes detected — nothing to test.\n')
  process.exit(0)
}

console.log(`🔬 Testing: ${toTest.map(c => c.name).join(', ')}\n`)

// Run each test individually
const vitestBin = process.platform === 'win32'
  ? 'node_modules\\.bin\\vitest'
  : 'node_modules/.bin/vitest'
let passed = 0
let failed = 0
const failures = []

for (const comp of toTest) {
  try {
    execSync(`${vitestBin} run ${comp.testPath} --reporter=dot`, {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 60_000,
    })
    passed++
    process.stdout.write(`  ✓ ${comp.name}\n`)
  } catch {
    failed++
    failures.push(comp.name)
    process.stdout.write(`  ✗ ${comp.name}\n`)
  }
}

console.log(`\n═══════════════════════════════════════`)
console.log(`  Passed: ${passed}  |  Failed: ${failed}  |  Skipped: ${allTests.length - toTest.length}`)
console.log(`═══════════════════════════════════════`)

if (failed > 0) {
  console.log(`\n❌ Failed: ${failures.join(', ')}`)
  console.log(`   Re-run with: npx vitest run <path> to see details`)
  process.exit(1)
} else {
  console.log(`\n✅ All tests passed.`)
}
