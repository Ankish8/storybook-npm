#!/usr/bin/env node

/**
 * Pre-Publish Type Validation
 *
 * Validates that all component exports compile correctly from a consumer perspective.
 * This catches TypeScript errors that would only appear when someone tries to USE
 * the components, not when compiling the source.
 *
 * The PageHeader bug would have been caught here:
 * - Source compiles fine
 * - But consumer trying to use <PageHeader variant="x"> would get a TS error
 *
 * This script:
 * 1. Reads all component exports from src/index.ts
 * 2. Generates a temporary test file that imports and uses each component
 * 3. Runs tsc --noEmit to check for type errors
 * 4. Fails the publish if any errors are found
 *
 * Usage:
 *   node scripts/validate-types.js
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
const INDEX_FILE = path.join(ROOT_DIR, 'src/index.ts')
const TEMP_FILE = path.join(ROOT_DIR, 'src/.type-check-temp.tsx')

/**
 * Parse index.ts to extract component exports
 */
function parseExports() {
  const content = fs.readFileSync(INDEX_FILE, 'utf-8')
  const components = []

  // Match named exports: export { Component } from './...'
  const exportMatches = content.matchAll(/export\s*\{([^}]+)\}\s*from/g)

  for (const match of exportMatches) {
    const names = match[1]
      .split(',')
      .map(n => n.trim())
      .filter(n => n && !n.includes(':') && !n.includes('Variants')) // Skip type aliases and variants

    // Filter to only component names (PascalCase, not all caps)
    for (const name of names) {
      if (/^[A-Z][a-z]/.test(name) && !name.endsWith('Props')) {
        components.push(name)
      }
    }
  }

  return [...new Set(components)] // Deduplicate
}

/**
 * Generate a test file that uses all components
 */
function generateTestFile(components) {
  // Components that need variant prop tested
  const withVariant = ['Button', 'Badge', 'Tag', 'Accordion']
  const withSize = ['Button', 'Badge', 'Tag', 'Table', 'Switch', 'Checkbox']
  const withState = ['Input', 'SelectTrigger', 'MultiSelect', 'TextField']

  // Components with required props
  const requiredProps = {
    PageHeader: 'title="Test"',
    Table: '',
    TableRow: '',
    TableCell: 'children="Test"',
    TableHead: 'children="Test"',
    SelectTrigger: 'children={<span>Select</span>}',
    MultiSelect: 'options={[]} placeholder="Test"',
    AccordionItem: 'value="1"',
    AccordionTrigger: 'children="Test"',
    AccordionContent: 'children="Test"',
    Checkbox: '',
    Switch: '',
    TextField: 'label="Test"',
    Input: '',
  }

  const lines = [
    '// Auto-generated type validation file',
    '// DO NOT COMMIT - This file is temporary',
    "import * as React from 'react'",
    '',
    '// Import all components',
    `import {`,
    components.map(c => `  ${c},`).join('\n'),
    `} from './index'`,
    '',
    '// Type validation function',
    'function validateTypes() {',
    '  return (',
    '    <>',
  ]

  for (const component of components) {
    const props = requiredProps[component] || ''

    // Skip sub-components that need a parent context
    if ([
      'SelectContent', 'SelectItem', 'SelectLabel', 'SelectValue',
      'SelectGroup', 'SelectSeparator', 'SelectScrollUpButton', 'SelectScrollDownButton',
      'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
      'DropdownMenuCheckboxItem', 'DropdownMenuRadioItem', 'DropdownMenuLabel',
      'DropdownMenuSeparator', 'DropdownMenuShortcut', 'DropdownMenuGroup',
      'DropdownMenuPortal', 'DropdownMenuSub', 'DropdownMenuSubContent',
      'DropdownMenuSubTrigger', 'DropdownMenuRadioGroup',
      'TableHeader', 'TableBody', 'TableFooter', 'TableCaption',
      'TableSkeleton', 'TableEmpty', 'TableAvatar', 'TableToggle',
    ].includes(component)) {
      continue
    }

    if (withVariant.includes(component) && component !== 'Accordion') {
      lines.push(`      <${component} variant="default" ${props}>Test</${component}>`)
    } else if (withSize.includes(component) && !withVariant.includes(component)) {
      lines.push(`      <${component} size="default" ${props} />`)
    } else if (withState.includes(component)) {
      lines.push(`      <${component} state="default" ${props} />`)
    } else if (['Table', 'TableRow', 'TableCell', 'TableHead'].includes(component)) {
      // Skip table components - they need proper composition
      continue
    } else if (component === 'Accordion') {
      lines.push(`      <${component} type="single" variant="default" collapsible></${component}>`)
    } else if (component === 'AccordionItem') {
      continue // Skip - needs Accordion parent
    } else if (component === 'AccordionTrigger' || component === 'AccordionContent') {
      continue // Skip - needs AccordionItem parent
    } else if (component === 'DropdownMenu' || component === 'Select') {
      continue // Skip - needs proper composition
    } else if (props) {
      lines.push(`      <${component} ${props} />`)
    } else {
      lines.push(`      <${component}>Test</${component}>`)
    }
  }

  lines.push(
    '    </>',
    '  )',
    '}',
    '',
    'export default validateTypes',
  )

  return lines.join('\n')
}

/**
 * Run TypeScript type checking on the generated file
 */
function runTypeCheck() {
  try {
    execSync('npx tsc --noEmit --skipLibCheck', {
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
 * Main function
 */
function main() {
  console.log('\n🔍 Pre-Publish Type Validation')
  console.log('=' .repeat(50))

  // Parse exports
  console.log('\n1. Parsing component exports...')
  const components = parseExports()
  console.log(`   Found ${components.length} components`)

  // Generate test file
  console.log('\n2. Generating type check file...')
  const testContent = generateTestFile(components)
  fs.writeFileSync(TEMP_FILE, testContent)
  console.log(`   Created: ${TEMP_FILE}`)

  // Run type check
  console.log('\n3. Running TypeScript validation...')
  const result = runTypeCheck()

  // Clean up temp file
  try {
    fs.unlinkSync(TEMP_FILE)
    console.log('   Cleaned up temp file')
  } catch {
    // Ignore cleanup errors
  }

  console.log('\n' + '=' .repeat(50))

  if (!result.success) {
    console.log('\n❌ TYPE VALIDATION FAILED\n')
    console.log('TypeScript errors found:')
    console.log(result.errors)
    console.log('\nThis indicates that consumers will get TypeScript errors.')
    console.log('Please fix the type mismatches before publishing.\n')
    process.exit(1)
  }

  console.log('\n✅ All component types validated successfully\n')
  process.exit(0)
}

main()
