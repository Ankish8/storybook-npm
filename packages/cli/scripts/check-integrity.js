#!/usr/bin/env node

/**
 * Component Integrity Checker
 *
 * Ensures that only intended components are modified during updates.
 * Creates snapshots of component hashes and detects unintended changes.
 *
 * Usage:
 *   node scripts/check-integrity.js snapshot     # Create snapshot of current state
 *   node scripts/check-integrity.js verify       # Verify against snapshot
 *   node scripts/check-integrity.js verify button badge  # Verify, expecting button & badge to change
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/ui')
const SNAPSHOT_FILE = path.resolve(__dirname, '../.component-snapshot.json')

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return crypto.createHash('md5').update(content).digest('hex')
}

function getComponentFiles() {
  return fs.readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))
}

function createSnapshot() {
  console.log('Creating component snapshot...\n')

  const files = getComponentFiles()
  const snapshot = {
    timestamp: new Date().toISOString(),
    components: {}
  }

  for (const file of files) {
    const filePath = path.join(COMPONENTS_DIR, file)
    const componentName = file.replace('.tsx', '')
    snapshot.components[componentName] = {
      file,
      hash: getFileHash(filePath),
      size: fs.statSync(filePath).size
    }
    console.log(`  ✓ ${componentName}: ${snapshot.components[componentName].hash.slice(0, 8)}...`)
  }

  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2))
  console.log(`\nSnapshot saved to: ${SNAPSHOT_FILE}`)
  console.log(`Total components: ${files.length}`)
}

function verifyIntegrity(expectedChanges = []) {
  console.log('Verifying component integrity...\n')

  if (!fs.existsSync(SNAPSHOT_FILE)) {
    console.error('❌ No snapshot found. Run: node scripts/check-integrity.js snapshot')
    process.exit(1)
  }

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'))
  const files = getComponentFiles()

  const results = {
    unchanged: [],
    changed: [],
    added: [],
    removed: [],
    expectedChanges: expectedChanges.map(c => c.toLowerCase())
  }

  // Check existing components
  for (const file of files) {
    const filePath = path.join(COMPONENTS_DIR, file)
    const componentName = file.replace('.tsx', '')
    const currentHash = getFileHash(filePath)

    if (!snapshot.components[componentName]) {
      results.added.push(componentName)
    } else if (snapshot.components[componentName].hash !== currentHash) {
      results.changed.push(componentName)
    } else {
      results.unchanged.push(componentName)
    }
  }

  // Check for removed components
  for (const componentName of Object.keys(snapshot.components)) {
    const file = snapshot.components[componentName].file
    const filePath = path.join(COMPONENTS_DIR, file)
    if (!fs.existsSync(filePath)) {
      results.removed.push(componentName)
    }
  }

  // Display results
  console.log('Component Status:')
  console.log('─'.repeat(50))

  for (const name of results.unchanged) {
    console.log(`  ✓ ${name} - unchanged`)
  }

  for (const name of results.changed) {
    const isExpected = results.expectedChanges.includes(name.toLowerCase())
    if (isExpected) {
      console.log(`  ✓ ${name} - changed (expected)`)
    } else {
      console.log(`  ⚠️  ${name} - CHANGED (unexpected!)`)
    }
  }

  for (const name of results.added) {
    console.log(`  + ${name} - added`)
  }

  for (const name of results.removed) {
    console.log(`  - ${name} - removed`)
  }

  // Check for unexpected changes
  const unexpectedChanges = results.changed.filter(
    name => !results.expectedChanges.includes(name.toLowerCase())
  )

  // Check for expected changes that didn't happen
  const missingChanges = results.expectedChanges.filter(
    name => !results.changed.map(c => c.toLowerCase()).includes(name)
  )

  console.log('\n' + '═'.repeat(50))

  if (unexpectedChanges.length > 0) {
    console.log(`\n❌ INTEGRITY CHECK FAILED`)
    console.log(`   Unexpected changes detected in: ${unexpectedChanges.join(', ')}`)
    console.log(`\n   If these changes were intentional, run:`)
    console.log(`   node scripts/check-integrity.js snapshot`)
    process.exit(1)
  }

  if (missingChanges.length > 0 && expectedChanges.length > 0) {
    console.log(`\n⚠️  Expected changes not found in: ${missingChanges.join(', ')}`)
  }

  console.log(`\n✅ INTEGRITY CHECK PASSED`)
  console.log(`   Unchanged: ${results.unchanged.length}`)
  console.log(`   Changed (expected): ${results.changed.length}`)
  console.log(`   Added: ${results.added.length}`)
  console.log(`   Removed: ${results.removed.length}`)

  // Update snapshot if there were expected changes
  if (results.changed.length > 0 || results.added.length > 0 || results.removed.length > 0) {
    console.log(`\n   Run 'node scripts/check-integrity.js snapshot' to update baseline`)
  }
}

function showDiff(componentName) {
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    console.error('❌ No snapshot found.')
    process.exit(1)
  }

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'))
  const file = `${componentName}.tsx`
  const filePath = path.join(COMPONENTS_DIR, file)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Component not found: ${componentName}`)
    process.exit(1)
  }

  const currentHash = getFileHash(filePath)
  const snapshotData = snapshot.components[componentName]

  if (!snapshotData) {
    console.log(`${componentName}: New component (not in snapshot)`)
    return
  }

  if (snapshotData.hash === currentHash) {
    console.log(`${componentName}: No changes`)
  } else {
    console.log(`${componentName}: Changed`)
    console.log(`  Previous hash: ${snapshotData.hash}`)
    console.log(`  Current hash:  ${currentHash}`)
  }
}

// CLI
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'snapshot':
    createSnapshot()
    break
  case 'verify':
    const expectedChanges = args.slice(1)
    verifyIntegrity(expectedChanges)
    break
  case 'diff':
    if (args[1]) {
      showDiff(args[1])
    } else {
      console.error('Usage: node scripts/check-integrity.js diff <component-name>')
    }
    break
  default:
    console.log(`
Component Integrity Checker

Usage:
  node scripts/check-integrity.js snapshot              Create baseline snapshot
  node scripts/check-integrity.js verify                Check for any changes
  node scripts/check-integrity.js verify button         Verify, expect only 'button' to change
  node scripts/check-integrity.js verify button badge   Verify, expect 'button' and 'badge' to change
  node scripts/check-integrity.js diff <component>      Show change status for a component

Examples:
  # Before making changes
  node scripts/check-integrity.js snapshot

  # After editing button.tsx
  node scripts/check-integrity.js verify button

  # If other components changed unexpectedly, the check will FAIL
`)
}
