#!/usr/bin/env node

/**
 * Validates multi-file component configurations in components.yaml
 *
 * Ensures that:
 * 1. All isMultiFile components have required properties (directory, mainFile, files)
 * 2. All files listed exist in the source directory
 * 3. mainFile is included in the files array
 * 4. No isMultiFile component is missing required properties
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Validating multi-file component configurations...\n')

// Paths
const configPath = path.join(__dirname, '../components.yaml')
const customComponentsDir = path.join(__dirname, '../../../src/components/custom')

// Read and parse components.yaml
let config
try {
  const configContent = fs.readFileSync(configPath, 'utf8')
  config = yaml.load(configContent)
} catch (err) {
  console.error('❌ Could not read components.yaml:', err.message)
  process.exit(1)
}

let hasErrors = false
let warnings = []
let multiFileCount = 0
let validatedCount = 0

// Check each component
for (const [name, meta] of Object.entries(config.components)) {
  // Check if component claims to be multi-file
  if (meta.isMultiFile) {
    multiFileCount++
    const issues = []

    // Check required properties
    if (!meta.directory) {
      issues.push('Missing required property: directory')
      hasErrors = true
    }

    if (!meta.mainFile) {
      issues.push('Missing required property: mainFile')
      hasErrors = true
    }

    if (!meta.files || !Array.isArray(meta.files) || meta.files.length === 0) {
      issues.push('Missing or empty required property: files[]')
      hasErrors = true
    }

    // If all required properties exist, do further validation
    if (meta.directory && meta.mainFile && meta.files) {
      // Check mainFile is in files array
      if (!meta.files.includes(meta.mainFile)) {
        issues.push(`mainFile "${meta.mainFile}" is not in files array: [${meta.files.join(', ')}]`)
        hasErrors = true
      }

      // Check directory exists
      const dirPath = path.join(customComponentsDir, meta.directory)
      if (!fs.existsSync(dirPath)) {
        issues.push(`Directory does not exist: src/components/custom/${meta.directory}/`)
        hasErrors = true
      } else {
        // Check each file exists
        for (const file of meta.files) {
          const filePath = path.join(dirPath, file)
          if (!fs.existsSync(filePath)) {
            issues.push(`File does not exist: ${meta.directory}/${file}`)
            hasErrors = true
          }
        }
      }
    }

    // Report issues for this component
    if (issues.length > 0) {
      console.log(`❌ ${name}:`)
      issues.forEach(issue => console.log(`   - ${issue}`))
      console.log('')
    } else {
      validatedCount++
    }
  } else {
    // Check for components that look like they should be multi-file
    // (e.g., have directory or mainFile but not marked as isMultiFile)
    if (meta.directory || meta.mainFile) {
      warnings.push(`${name}: Has directory/mainFile but isMultiFile is not true`)
    }
  }
}

// Print results
console.log('─'.repeat(60))

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  warnings.forEach(w => console.log(`   ${w}`))
  console.log('')
}

if (hasErrors) {
  console.log(`\n❌ Validation failed!`)
  console.log(`   ${validatedCount}/${multiFileCount} multi-file components passed validation\n`)
  process.exit(1)
} else {
  console.log(`\n✅ All multi-file components validated successfully!`)
  console.log(`   Checked ${multiFileCount} multi-file component(s)\n`)
}
