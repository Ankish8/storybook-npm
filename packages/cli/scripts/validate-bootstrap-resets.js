#!/usr/bin/env node

/**
 * Validates that components using Bootstrap-affected HTML elements
 * have proper margin resets (m-0)
 *
 * Bootstrap applies default margins to: h1-h6, p, ul, ol, blockquote, pre, hr
 * These must have m-0 class to work correctly in Bootstrap projects.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// HTML elements that Bootstrap styles with default margins
const BOOTSTRAP_ELEMENTS = [
  { tag: '<h1', name: 'h1' },
  { tag: '<h2', name: 'h2' },
  { tag: '<h3', name: 'h3' },
  { tag: '<h4', name: 'h4' },
  { tag: '<h5', name: 'h5' },
  { tag: '<h6', name: 'h6' },
  { tag: '<p ', name: 'p' },
  { tag: '<p>', name: 'p' },
  { tag: '<ul', name: 'ul' },
  { tag: '<ol', name: 'ol' },
  { tag: '<blockquote', name: 'blockquote' },
  { tag: '<pre', name: 'pre' },
]

// Pattern to detect margin reset class (m-0, or prefixed like tw-m-0)
const RESET_PATTERN = /\bm-0\b/

console.log('🔍 Validating Bootstrap margin resets...\n')

const uiDir = path.join(__dirname, '../../../src/components/ui')
const customDir = path.join(__dirname, '../../../src/components/custom')

// Get .tsx files from a directory (non-recursive)
const getFilesFromDir = (dir) => {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.tsx'))
      .filter(f => !f.includes('.stories.'))
      .filter(f => !f.includes('.test.'))
      .map(f => path.join(dir, f))
  } catch {
    return []
  }
}

// Get .tsx files recursively from a directory
const getFilesRecursive = (dir) => {
  let results = []
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      if (item.isDirectory()) {
        results = results.concat(getFilesRecursive(fullPath))
      } else if (
        item.name.endsWith('.tsx') &&
        !item.name.includes('.stories.') &&
        !item.name.includes('.test.')
      ) {
        results.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
  return results
}

// Get all .tsx component files from both ui/ and custom/ directories
const uiFiles = getFilesFromDir(uiDir)
const customFiles = getFilesRecursive(customDir)
const files = [...uiFiles, ...customFiles]

if (files.length === 0) {
  console.error('❌ No component files found')
  process.exit(1)
}

let hasErrors = false
let checkedFiles = 0
let issuesFound = []

const srcDir = path.join(__dirname, '../../../src')

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  const relativePath = path.relative(srcDir, file)
  const lines = content.split('\n')

  checkedFiles++

  lines.forEach((line, index) => {
    BOOTSTRAP_ELEMENTS.forEach(({ tag, name }) => {
      // Check if line contains the element with a className
      if (line.includes(tag) && line.includes('className=')) {
        // Extract the className value
        const classNameMatch = line.match(/className=["'`]([^"'`]*)["'`]/)

        if (classNameMatch) {
          const classes = classNameMatch[1]

          // Check if m-0 is present (with or without prefix)
          if (!RESET_PATTERN.test(classes)) {
            hasErrors = true
            issuesFound.push({
              file: relativePath,
              line: index + 1,
              element: name,
              classes: classes.substring(0, 60) + (classes.length > 60 ? '...' : '')
            })
          }
        }
      }
    })
  })
})

// Print results
if (issuesFound.length > 0) {
  console.log('⚠️  Found elements without Bootstrap margin resets:\n')

  issuesFound.forEach(issue => {
    console.log(`   ${issue.file}:${issue.line}`)
    console.log(`   Element: <${issue.element}>`)
    console.log(`   Classes: "${issue.classes}"`)
    console.log(`   Fix: Add m-0 (or tw-m-0 if using prefix) to className`)
    console.log('')
  })

  console.log('─'.repeat(60))
  console.log(`\n❌ ${issuesFound.length} element(s) need Bootstrap margin resets`)
  console.log('\n📖 See COMPONENT_GUIDE.md section "Reset Bootstrap Default Margins"')
  console.log('   Add m-0 class to h1-h6, p, ul, ol, blockquote, pre elements\n')
  process.exit(1)
} else {
  console.log(`✅ Checked ${checkedFiles} components`)
  console.log('   All Bootstrap-affected elements have margin resets (m-0)\n')
}
