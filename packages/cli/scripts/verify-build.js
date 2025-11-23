#!/usr/bin/env node

/**
 * Verifies the build output is correct and complete.
 * Run: node scripts/verify-build.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_DIR = path.resolve(__dirname, '../dist')
const MAX_BUNDLE_SIZE_KB = 100 // Alert if bundle exceeds this

async function verify() {
  console.log('Verifying build output...\n')
  let errors = 0

  // 1. Check dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist directory not found')
    console.log('Run: npm run build')
    process.exit(1)
  }

  // 2. Check required files exist
  console.log('Checking required files:')
  const requiredFiles = ['index.js', 'index.d.ts']

  for (const file of requiredFiles) {
    const filePath = path.join(DIST_DIR, file)
    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ ${file} - missing`)
      errors++
    } else {
      const stats = fs.statSync(filePath)
      const sizeKB = (stats.size / 1024).toFixed(1)
      console.log(`  ✓ ${file} (${sizeKB} KB)`)
    }
  }

  // 3. Check bundle size
  const indexJs = path.join(DIST_DIR, 'index.js')
  if (fs.existsSync(indexJs)) {
    const stats = fs.statSync(indexJs)
    const sizeKB = stats.size / 1024

    console.log(`\nBundle size: ${sizeKB.toFixed(1)} KB`)
    if (sizeKB > MAX_BUNDLE_SIZE_KB) {
      console.warn(`  ⚠️  Bundle exceeds ${MAX_BUNDLE_SIZE_KB} KB threshold`)
    } else {
      console.log(`  ✓ Within size limit`)
    }
  }

  // 4. Verify CLI can be imported (will run commander setup)
  console.log('\nVerifying CLI module:')
  try {
    // Just check file exists and has shebang - don't import as it runs commander
    const content = fs.readFileSync(indexJs, 'utf-8')
    if (content.includes('commander') && content.includes('program.parse')) {
      console.log('  ✓ CLI module has commander setup')
    } else {
      console.error('  ❌ CLI module missing commander setup')
      errors++
    }
  } catch (err) {
    console.error('  ❌ Failed to read module:', err.message)
    errors++
  }

  // 5. Verify registry is included in bundle
  console.log('\nVerifying registry in bundle:')
  try {
    const content = fs.readFileSync(indexJs, 'utf-8')

    // Check registry function exists
    if (content.includes('getRegistry') && content.includes('prefixTailwindClasses')) {
      console.log('  ✓ Registry functions included')
    } else {
      console.error('  ❌ Registry functions missing')
      errors++
    }

    // Check components are in bundle
    const expectedComponents = ['button', 'badge', 'tag', 'table', 'dropdown-menu']
    for (const comp of expectedComponents) {
      if (content.includes(`"${comp}":`) || content.includes(`'${comp}':`)) {
        console.log(`    - ${comp}`)
      } else {
        console.error(`  ❌ ${comp} missing from bundle`)
        errors++
      }
    }
  } catch (err) {
    console.error('  ❌ Failed to verify registry:', err.message)
    errors++
  }

  // 6. Check for shebang in entry point
  console.log('\nVerifying CLI entry:')
  if (fs.existsSync(indexJs)) {
    const content = fs.readFileSync(indexJs, 'utf-8')
    if (content.startsWith('#!/usr/bin/env node')) {
      console.log('  ✓ Has shebang')
    } else {
      console.error('  ❌ Missing shebang (#!/usr/bin/env node)')
      errors++
    }
  }

  // 7. Summary
  console.log('\n' + '='.repeat(50))
  if (errors === 0) {
    console.log('✅ Build verified successfully!')
  } else {
    console.log(`❌ ${errors} error(s) found`)
  }
  console.log('='.repeat(50))

  process.exit(errors > 0 ? 1 : 0)
}

verify().catch(err => {
  console.error('Verification failed:', err)
  process.exit(1)
})
