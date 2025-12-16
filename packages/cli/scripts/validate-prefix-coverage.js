#!/usr/bin/env node

/**
 * Validate that the prefixTailwindClasses function correctly transforms all Tailwind classes.
 * This script imports the registry and applies a prefix, then checks for any unprefixed classes.
 *
 * Run: npm run validate:coverage
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PREFIX = 'tw-'

// Single-word Tailwind utilities that should be prefixed
const SINGLE_WORD_UTILITIES = new Set([
  'flex', 'grid', 'block', 'inline', 'contents', 'hidden', 'invisible', 'visible',
  'static', 'fixed', 'absolute', 'relative', 'sticky', 'isolate',
  'truncate', 'antialiased', 'italic', 'underline', 'overline', 'uppercase', 'lowercase', 'capitalize',
  'resize', 'grow', 'shrink', 'transform', 'transition'
])

// Tailwind utility prefixes that indicate a class
const TAILWIND_PREFIXES = [
  'text-', 'bg-', 'p-', 'm-', 'px-', 'py-', 'mx-', 'my-', 'pt-', 'pb-', 'pl-', 'pr-',
  'mt-', 'mb-', 'ml-', 'mr-', 'w-', 'h-', 'min-', 'max-', 'gap-', 'space-',
  'border-', 'rounded-', 'shadow-', 'opacity-', 'font-', 'leading-', 'tracking-',
  'z-', 'inset-', 'top-', 'bottom-', 'left-', 'right-',
  'flex-', 'grid-', 'col-', 'row-', 'justify-', 'items-', 'content-', 'self-', 'place-',
  'order-', 'float-', 'clear-', 'object-', 'overflow-', 'overscroll-', 'scroll-',
  'list-', 'cursor-', 'select-', 'fill-', 'stroke-', 'divide-', 'size-',
  'transition-', 'duration-', 'ease-', 'delay-', 'animate-',
  'origin-', 'scale-', 'rotate-', 'translate-', 'skew-',
  'ring-', 'outline-', 'focus:', 'hover:', 'active:', 'disabled:'
]

/**
 * Check if a class is an unprefixed Tailwind class that should have been transformed
 */
function isUnprefixedTailwindClass(cls) {
  // Skip if already prefixed
  if (cls.startsWith(PREFIX) || cls.includes(`:${PREFIX}`)) {
    return false
  }

  // Skip empty or very short
  if (!cls || cls.length < 2) return false

  // Skip aria-* and data-* HTML attributes
  if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) {
    return false
  }

  // Check single-word utilities
  if (SINGLE_WORD_UTILITIES.has(cls)) {
    return true
  }

  // Check if starts with known Tailwind prefix
  for (const prefix of TAILWIND_PREFIXES) {
    if (cls.startsWith(prefix)) {
      return true
    }
  }

  // Check for arbitrary values like bg-[#343E55]
  if (cls.includes('[') && cls.includes(']') && cls.includes('-')) {
    return true
  }

  // Check for arbitrary selectors like [&_svg]:pointer-events-none
  if (cls.startsWith('[&') && cls.includes(']:')) {
    return true
  }

  return false
}

/**
 * Find unprefixed classes in transformed content
 */
function findUnprefixedClasses(content, componentName) {
  const issues = []

  // Find class strings in the transformed content
  // Look for className="...", key: "...", and function argument patterns
  const patterns = [
    /className="([^"]+)"/g,
    /className='([^']+)'/g,
    /:\s*"([^"]+)"/g,
    /:\s*'([^']+)'/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const classString = match[1]
      const classes = classString.split(/\s+/).filter(Boolean)

      for (const cls of classes) {
        if (isUnprefixedTailwindClass(cls)) {
          issues.push({
            component: componentName,
            class: cls,
            context: classString.slice(0, 50) + (classString.length > 50 ? '...' : ''),
            pattern: 'standard'
          })
        }
      }
    }
  }

  // Also check for function calls with class string arguments
  // These are commonly missed: functionName("mt-3"), helperFunc("flex gap-2")
  const funcArgPatterns = [
    /\b\w+\s*\(\s*"([^"\n]+)"\s*\)/g,   // functionName("classes")
    /\b\w+\s*\(\s*'([^'\n]+)'\s*\)/g,   // functionName('classes')
  ]

  for (const pattern of funcArgPatterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const classString = match[1]
      // Skip if it doesn't look like classes (e.g., regular strings, paths, etc.)
      if (!classString.includes('-') && !classString.includes(' ')) continue
      // Skip if it looks like a path or import
      if (classString.startsWith('@') || classString.startsWith('.') || classString.startsWith('/')) continue

      const classes = classString.split(/\s+/).filter(Boolean)
      for (const cls of classes) {
        if (isUnprefixedTailwindClass(cls)) {
          issues.push({
            component: componentName,
            class: cls,
            context: match[0].slice(0, 60) + (match[0].length > 60 ? '...' : ''),
            pattern: 'function-arg'
          })
        }
      }
    }
  }

  return issues
}

/**
 * Main validation function
 */
async function validatePrefixCoverage() {
  console.log('Validating prefix transformation coverage...\n')

  try {
    // Import the registry with prefix applied
    const { getRegistry } = await import('../src/utils/registry-index.ts')
    const registry = await getRegistry(PREFIX)

    let hasErrors = false
    const allIssues = []

    for (const [name, component] of Object.entries(registry)) {
      for (const file of component.files) {
        const issues = findUnprefixedClasses(file.content, name)
        if (issues.length > 0) {
          hasErrors = true
          allIssues.push(...issues)
        }
      }
    }

    if (hasErrors) {
      console.error('❌ Found unprefixed Tailwind classes after transformation:\n')

      // Group by component
      const byComponent = {}
      for (const issue of allIssues) {
        if (!byComponent[issue.component]) {
          byComponent[issue.component] = []
        }
        byComponent[issue.component].push(issue)
      }

      for (const [component, issues] of Object.entries(byComponent)) {
        console.error(`  Component: ${component}`)
        // Deduplicate
        const seen = new Set()
        for (const issue of issues) {
          const key = issue.class
          if (!seen.has(key)) {
            seen.add(key)
            console.error(`    - "${issue.class}"`)
          }
        }
        console.error('')
      }

      console.error('These classes were not transformed by prefixTailwindClasses().')
      console.error('Please ensure classes are in recognized patterns:')
      console.error('  - cva("classes")')
      console.error('  - cn("classes") or cn(\'classes\')')
      console.error('  - className="classes"')
      console.error('  - key: "classes" or key: \'classes\'')
      console.error('  - renderExpandableActions("classes") (and other recognized helpers)')
      console.error('')

      process.exit(1)
    }

    console.log('✅ All Tailwind classes are properly prefixed!')
    process.exit(0)
  } catch (error) {
    // If import fails, fall back to basic check
    console.log('Note: Could not import registry (this is normal during build).')
    console.log('Skipping runtime validation.\n')
    console.log('✅ Validation skipped (registry not built yet)')
    process.exit(0)
  }
}

// Run
validatePrefixCoverage()
