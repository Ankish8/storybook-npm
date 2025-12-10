#!/usr/bin/env node

/**
 * CVA Props Validator
 *
 * Validates that CVA (Class Variance Authority) variant definitions align with
 * component prop destructuring. Catches bugs like:
 * - Empty `variants: {}` but component destructures `variant`
 * - CVA defines `variant` but component doesn't destructure it
 *
 * This prevents TypeScript consumer-side errors where props don't match types.
 *
 * Usage:
 *   node scripts/validate-cva-props.js        # Validate all components
 *   node scripts/validate-cva-props.js button # Validate specific component
 *
 * Exit codes:
 *   0 - All components valid
 *   1 - Validation errors found
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')

// Known CVA variant keys to check
const CVA_VARIANT_KEYS = ['variant', 'size', 'state']

/**
 * Extract CVA variant keys from file content
 * Looks for patterns like: variants: { variant: { ... }, size: { ... } }
 */
function extractCvaVariantKeys(content, fileName) {
  const variantKeys = new Set()

  // Find the start of variants: {
  const variantsStart = content.indexOf('variants:')
  if (variantsStart === -1) {
    return variantKeys
  }

  // Find the opening brace after "variants:"
  const braceStart = content.indexOf('{', variantsStart)
  if (braceStart === -1) {
    return variantKeys
  }

  // Extract the variants block by counting braces
  let braceCount = 1
  let pos = braceStart + 1
  let variantsBlock = ''

  while (pos < content.length && braceCount > 0) {
    const char = content[pos]
    if (char === '{') braceCount++
    if (char === '}') braceCount--
    if (braceCount > 0) variantsBlock += char
    pos++
  }

  // Check for empty variants block (just whitespace)
  if (variantsBlock.trim() === '') {
    return variantKeys // Empty variants
  }

  // Find each variant key definition at the top level of variants block
  // We need to find keys followed by : { at depth 0
  for (const key of CVA_VARIANT_KEYS) {
    // Match pattern: variant: { or size: { at the start of a line or after comma/whitespace
    const keyPattern = new RegExp(`(?:^|[,\\s])${key}\\s*:\\s*\\{`, 'm')
    if (keyPattern.test(variantsBlock)) {
      variantKeys.add(key)
    }
  }

  return variantKeys
}

/**
 * Extract destructured props from forwardRef component
 * Looks for patterns like: ({ className, variant, size, ...props }, ref)
 */
function extractDestructuredProps(content) {
  const destructuredProps = new Set()

  // Match forwardRef destructuring pattern
  // Pattern: forwardRef<...>(({ prop1, prop2, ...props }, ref) =>
  const forwardRefMatch = content.match(
    /forwardRef[^(]*\(\s*\(\s*\{\s*([^}]+)\s*\}\s*,\s*ref\s*\)/s
  )

  if (!forwardRefMatch) {
    // Try alternative pattern without forwardRef (regular function component)
    const funcMatch = content.match(
      /function\s+\w+\s*\(\s*\{\s*([^}]+)\s*\}/s
    )
    if (!funcMatch) {
      return destructuredProps
    }
    const propsString = funcMatch[1]
    return parsePropsString(propsString)
  }

  const propsString = forwardRefMatch[1]
  return parsePropsString(propsString)
}

/**
 * Parse props string to extract individual prop names
 */
function parsePropsString(propsString) {
  const props = new Set()

  // Split by comma and clean up
  const parts = propsString.split(',').map(p => p.trim())

  for (const part of parts) {
    // Skip spread operator
    if (part.startsWith('...')) continue

    // Handle renamed props: originalName: newName
    const colonIndex = part.indexOf(':')
    if (colonIndex > 0) {
      props.add(part.substring(0, colonIndex).trim())
    } else {
      // Handle default values: propName = defaultValue
      const equalsIndex = part.indexOf('=')
      if (equalsIndex > 0) {
        props.add(part.substring(0, equalsIndex).trim())
      } else {
        props.add(part.trim())
      }
    }
  }

  return props
}

/**
 * Check if component uses CVA (has cva import and usage)
 */
function usesCva(content) {
  return content.includes('from "class-variance-authority"') ||
         content.includes("from 'class-variance-authority'")
}

/**
 * Validate a single component file
 */
function validateComponent(filePath) {
  const fileName = path.basename(filePath)
  const componentName = fileName.replace('.tsx', '')
  const content = fs.readFileSync(filePath, 'utf-8')

  const errors = []
  const warnings = []

  // Skip if component doesn't use CVA
  if (!usesCva(content)) {
    return { componentName, errors, warnings, skipped: true }
  }

  const cvaKeys = extractCvaVariantKeys(content, fileName)
  const destructuredProps = extractDestructuredProps(content)

  // Filter to only CVA-related props
  const cvaRelatedDestructured = new Set(
    [...destructuredProps].filter(p => CVA_VARIANT_KEYS.includes(p))
  )

  // Check 1: CVA has variant key but component doesn't destructure it
  for (const key of cvaKeys) {
    if (!cvaRelatedDestructured.has(key)) {
      warnings.push(
        `CVA defines '${key}' but component doesn't destructure it. ` +
        `This may be intentional if using default variant only.`
      )
    }
  }

  // Check 2: Component destructures variant key but CVA doesn't define it
  // THIS IS THE CRITICAL BUG WE'RE CATCHING
  for (const prop of cvaRelatedDestructured) {
    if (!cvaKeys.has(prop)) {
      errors.push(
        `Component destructures '${prop}' but CVA doesn't define it in variants. ` +
        `This will cause TypeScript errors for consumers trying to use <${componentName} ${prop}="...">. ` +
        `Either add '${prop}' to CVA variants or remove it from props destructuring.`
      )
    }
  }

  return { componentName, errors, warnings, skipped: false }
}

/**
 * Main validation function
 */
function main() {
  const args = process.argv.slice(2)
  const specificComponent = args[0]

  console.log('\n🔍 CVA Props Validator')
  console.log('=' .repeat(50))

  // Get component files
  let files = fs.readdirSync(COMPONENTS_DIR)
    .filter(f =>
      f.endsWith('.tsx') &&
      !f.includes('.stories.') &&
      !f.includes('.test.') &&
      f !== 'index.tsx'
    )

  // Filter to specific component if provided
  if (specificComponent) {
    const targetFile = `${specificComponent}.tsx`
    if (!files.includes(targetFile)) {
      console.error(`\n❌ Component not found: ${specificComponent}`)
      process.exit(1)
    }
    files = [targetFile]
  }

  let hasErrors = false
  let totalValidated = 0
  let totalSkipped = 0

  for (const file of files) {
    const filePath = path.join(COMPONENTS_DIR, file)
    const result = validateComponent(filePath)

    if (result.skipped) {
      totalSkipped++
      continue
    }

    totalValidated++

    if (result.errors.length > 0) {
      hasErrors = true
      console.log(`\n❌ ${result.componentName}`)
      result.errors.forEach(err => {
        console.log(`   ERROR: ${err}`)
      })
    }

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  ${result.componentName}`)
      result.warnings.forEach(warn => {
        console.log(`   WARNING: ${warn}`)
      })
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`✓ ${result.componentName}`)
    }
  }

  console.log('\n' + '=' .repeat(50))
  console.log(`Validated: ${totalValidated} components`)
  console.log(`Skipped (no CVA): ${totalSkipped} files`)

  if (hasErrors) {
    console.log('\n❌ VALIDATION FAILED')
    console.log('   Fix the errors above before committing.')
    console.log('   These errors will cause TypeScript failures for consumers.\n')
    process.exit(1)
  }

  console.log('\n✅ All components passed CVA props validation\n')
  process.exit(0)
}

main()
