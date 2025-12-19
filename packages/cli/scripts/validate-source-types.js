#!/usr/bin/env node

/**
 * Source Component Type Validation
 *
 * Runs TypeScript type checking ONLY on the source UI components
 * (excludes stories, tests, and other files that aren't published).
 *
 * This catches TypeScript errors in the actual component code that
 * would cause issues for consumers.
 *
 * Usage:
 *   node scripts/validate-source-types.js
 *
 * Exit codes:
 *   0 - All types valid
 *   1 - Type errors found
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '../../..')
const TEMP_TSCONFIG = path.join(ROOT_DIR, 'tsconfig.source-check.json')

/**
 * Create a temporary tsconfig that only includes source components
 */
function createTempTsconfig() {
  const config = {
    extends: './tsconfig.app.json',
    compilerOptions: {
      noEmit: true,
      skipLibCheck: true,
    },
    include: [
      'src/components/ui/**/*.tsx',
      'src/components/custom/**/*.tsx',
      'src/lib/**/*.ts',
    ],
    exclude: [
      'src/**/*.stories.tsx',
      'src/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/__tests__/**',
    ],
  }

  fs.writeFileSync(TEMP_TSCONFIG, JSON.stringify(config, null, 2))
  return TEMP_TSCONFIG
}

/**
 * Run TypeScript type checking with the temp config
 */
function runTypeCheck() {
  try {
    execSync(`npx tsc --project ${TEMP_TSCONFIG}`, {
      cwd: ROOT_DIR,
      stdio: 'pipe',
    })
    return { success: true, errors: '' }
  } catch (error) {
    return {
      success: false,
      errors: error.stdout?.toString() || error.stderr?.toString() || error.message,
    }
  }
}

/**
 * Clean up temp files
 */
function cleanup() {
  try {
    fs.unlinkSync(TEMP_TSCONFIG)
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Main function
 */
function main() {
  console.log('\n🔍 Source Component Type Validation')
  console.log('=' .repeat(50))

  // Create temp tsconfig
  console.log('\n1. Creating targeted tsconfig...')
  createTempTsconfig()
  console.log('   Checking: src/components/ui/*.tsx')
  console.log('   Excluding: *.stories.tsx, *.test.tsx, __tests__/')

  // Run type check
  console.log('\n2. Running TypeScript validation...')
  const result = runTypeCheck()

  // Clean up
  cleanup()
  console.log('   Cleaned up temp config')

  console.log('\n' + '=' .repeat(50))

  if (!result.success) {
    console.log('\n❌ SOURCE TYPE VALIDATION FAILED\n')
    console.log('TypeScript errors found in source components:')
    console.log(result.errors)
    console.log('\nPlease fix these errors before publishing.\n')
    process.exit(1)
  }

  console.log('\n✅ All source component types validated successfully\n')
  process.exit(0)
}

main()
