#!/usr/bin/env node

/**
 * Validates that the registry is complete and correct.
 * Run: node scripts/validate-registry.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/ui')
const REGISTRY_FILE = path.resolve(__dirname, '../src/utils/registry.ts')

async function validate() {
  console.log('Validating registry...\n')
  let errors = 0
  let warnings = 0

  // 1. Check components directory exists
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`)
    process.exit(1)
  }

  // 2. Get source component files
  const sourceFiles = fs.readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))

  console.log(`Found ${sourceFiles.length} source components\n`)

  // 3. Check registry file exists
  if (!fs.existsSync(REGISTRY_FILE)) {
    console.error(`❌ Registry file not found: ${REGISTRY_FILE}`)
    console.log('Run: npm run generate-registry')
    process.exit(1)
  }

  const registryContent = fs.readFileSync(REGISTRY_FILE, 'utf-8')

  // 4. Check all source components are in registry
  console.log('Checking component presence:')
  for (const file of sourceFiles) {
    const componentName = file.replace('.tsx', '')
    if (!registryContent.includes(`'${componentName}':`) && !registryContent.includes(`"${componentName}":`)) {
      console.error(`  ❌ ${componentName} - not in registry`)
      errors++
    } else {
      console.log(`  ✓ ${componentName}`)
    }
  }

  // 5. Validate source component files have correct structure
  console.log('\nValidating source component structure:')
  for (const file of sourceFiles) {
    const componentName = file.replace('.tsx', '')
    const filePath = path.join(COMPONENTS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const issues = []

    // Check content validity
    if (!content.includes('import')) {
      issues.push('no imports found')
    }
    if (!content.includes('export')) {
      issues.push('no exports found')
    }
    if (!content.includes('@/lib/utils')) {
      issues.push('missing @/lib/utils import')
    }

    // Check for Tailwind v4 syntax (should not be present for v3)
    if (content.includes('@theme') || content.includes('@source')) {
      issues.push('contains Tailwind v4 syntax')
    }

    if (issues.length > 0) {
      console.error(`  ❌ ${componentName}: ${issues.join(', ')}`)
      errors += issues.length
    } else {
      console.log(`  ✓ ${componentName}`)
    }
  }

  // 7. Summary
  console.log('\n' + '='.repeat(50))
  if (errors === 0 && warnings === 0) {
    console.log('✅ All validations passed!')
  } else {
    if (errors > 0) {
      console.log(`❌ ${errors} error(s) found`)
    }
    if (warnings > 0) {
      console.log(`⚠️  ${warnings} warning(s)`)
    }
  }
  console.log('='.repeat(50))

  process.exit(errors > 0 ? 1 : 0)
}

validate().catch(err => {
  console.error('Validation failed:', err)
  process.exit(1)
})
