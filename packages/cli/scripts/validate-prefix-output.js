#!/usr/bin/env node

/**
 * This script validates the generated registry output to catch
 * any corruption in the prefix transformation.
 *
 * Run: node scripts/validate-prefix-output.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REGISTRY_FILE = path.resolve(__dirname, '../src/utils/registry.ts')

// Patterns that indicate corruption - these should NEVER appear in output
const CORRUPTION_PATTERNS = [
  { pattern: /tw-interface\b/, desc: 'tw- before interface keyword' },
  { pattern: /tw-const\b/, desc: 'tw- before const keyword' },
  { pattern: /tw-function\b/, desc: 'tw- before function keyword' },
  { pattern: /tw-export\b/, desc: 'tw- before export keyword' },
  { pattern: /tw-import\b/, desc: 'tw- before import keyword' },
  { pattern: /tw-type\b/, desc: 'tw- before type keyword' },
  { pattern: /tw-class\b(?!\s*=)/, desc: 'tw- before class keyword' },
  { pattern: /tw-extends\b/, desc: 'tw- before extends keyword' },
  { pattern: /tw-return\b/, desc: 'tw- before return keyword' },
  { pattern: /tw-=>/, desc: 'tw- before arrow function' },
  { pattern: /tw-\{(?!\s*["'`])/, desc: 'tw- before opening brace (not in string)' },
  { pattern: /tw-true\b/, desc: 'tw- before true keyword' },
  { pattern: /tw-false\b/, desc: 'tw- before false keyword' },
  { pattern: /tw-null\b/, desc: 'tw- before null keyword' },
  { pattern: /tw-undefined\b/, desc: 'tw- before undefined keyword' },
  { pattern: /tw-React\b/, desc: 'tw- before React' },
  { pattern: /tw-forwardRef\b/, desc: 'tw- before forwardRef' },
  { pattern: /tw-useState\b/, desc: 'tw- before useState' },
  { pattern: /tw-useEffect\b/, desc: 'tw- before useEffect' },
  { pattern: /tw-useRef\b/, desc: 'tw- before useRef' },
  { pattern: /""tw-/, desc: 'tw- after empty string (syntax corruption)' },
]

// Pattern to detect misplaced data-attribute prefix
const MISPLACED_DATA_PREFIX = /tw-data-\[[^\]]+\]:/g
const MISPLACED_ARIA_PREFIX = /tw-aria-\[[^\]]+\]:/g

function validateRegistry() {
  console.log('Validating prefix transformation output...')

  if (!fs.existsSync(REGISTRY_FILE)) {
    console.error('Error: Registry file not found:', REGISTRY_FILE)
    console.error('Run `npm run generate-registry` first.')
    process.exit(1)
  }

  const content = fs.readFileSync(REGISTRY_FILE, 'utf-8')
  const issues = []

  // Check for corruption patterns
  for (const { pattern, desc } of CORRUPTION_PATTERNS) {
    const matches = content.match(new RegExp(pattern, 'g'))
    if (matches) {
      issues.push({
        type: 'CORRUPTION',
        desc,
        count: matches.length,
        examples: matches.slice(0, 3),
      })
    }
  }

  // Check for misplaced data-attribute prefix
  const dataMatches = content.match(MISPLACED_DATA_PREFIX)
  if (dataMatches) {
    issues.push({
      type: 'MISPLACED_PREFIX',
      desc: 'tw- prefix on data-[] selector instead of utility class',
      count: dataMatches.length,
      examples: dataMatches.slice(0, 5),
      fix: 'Should be data-[...]:tw-<utility> not tw-data-[...]:utility',
    })
  }

  // Check for misplaced aria-attribute prefix
  const ariaMatches = content.match(MISPLACED_ARIA_PREFIX)
  if (ariaMatches) {
    issues.push({
      type: 'MISPLACED_PREFIX',
      desc: 'tw- prefix on aria-[] selector instead of utility class',
      count: ariaMatches.length,
      examples: ariaMatches.slice(0, 5),
      fix: 'Should be aria-[...]:tw-<utility> not tw-aria-[...]:utility',
    })
  }

  // Report results
  if (issues.length > 0) {
    console.error('\n❌ Validation FAILED! Found prefix transformation issues:\n')

    for (const issue of issues) {
      console.error(`  [${issue.type}] ${issue.desc}`)
      console.error(`    Found: ${issue.count} occurrence(s)`)
      if (issue.examples) {
        console.error(`    Examples: ${issue.examples.join(', ')}`)
      }
      if (issue.fix) {
        console.error(`    Fix: ${issue.fix}`)
      }
      console.error('')
    }

    console.error('Please fix the prefix transformation logic in generate-registry.js')
    process.exit(1)
  }

  console.log('✅ Validation passed! No corruption or misplaced prefixes detected.\n')
}

validateRegistry()
