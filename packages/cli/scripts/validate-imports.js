#!/usr/bin/env node

/**
 * Validates component imports and dependencies before publishing.
 *
 * Checks:
 * 1. No @/components imports in GENERATED registry files (must be transformed to relative paths)
 * 2. Components using animation classes have tailwindcss-animate dependency
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REGISTRY_DIR = path.resolve(__dirname, '../src/utils')
const UI_COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/ui')
const CUSTOM_COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/custom')
const CONFIG_FILE = path.resolve(__dirname, '../components.yaml')

// Animation classes that require tailwindcss-animate
const ANIMATION_PATTERNS = [
  'animate-in',
  'animate-out',
  'fade-in',
  'fade-out',
  'zoom-in',
  'zoom-out',
  'slide-in',
  'slide-out',
  'spin-in',
  'spin-out',
]

let hasErrors = false

function error(message) {
  console.error(`❌ ${message}`)
  hasErrors = true
}

function success(message) {
  console.log(`✓ ${message}`)
}

/**
 * Check for @/components imports in GENERATED registry files
 * These should have been transformed to relative paths by generate-registry.js
 *
 * Note: Ignores @/components in JSDoc comments (documentation examples)
 */
function validateRegistryImports() {
  console.log('\n🔍 Checking generated registry for @/components imports...\n')

  const registryFiles = fs.readdirSync(REGISTRY_DIR)
    .filter(f => f.startsWith('registry') && f.endsWith('.ts'))

  let issuesFound = 0

  for (const file of registryFiles) {
    const filePath = path.join(REGISTRY_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Remove JSDoc comments and code example blocks before checking
    // JSDoc examples like "import { X } from '@/components/ui/x'" are documentation, not actual imports
    const contentWithoutJsDoc = content
      .replace(/\/\*\*[\s\S]*?\*\//g, '')  // Remove JSDoc comments
      .replace(/\* ```[\s\S]*?```/g, '')   // Remove code blocks in comments

    // Check for actual @/components imports (from ... statements)
    const importMatches = contentWithoutJsDoc.match(/from\s+["']@\/components\/[^"']+["']/g)
    if (importMatches) {
      const uniqueMatches = [...new Set(importMatches)]
      error(`${file}: Found untransformed @/components imports`)
      uniqueMatches.forEach(match => {
        console.log(`      ${match} should use relative path`)
      })
      issuesFound++
    }
  }

  if (issuesFound === 0) {
    success(`Checked ${registryFiles.length} registry files - all imports correctly transformed`)
  } else {
    console.log(`\n   Fix: Update generate-registry.js to transform these imports`)
  }
}

/**
 * Check that components using animation classes have tailwindcss-animate dependency
 */
function validateAnimationDependencies() {
  console.log('\n🔍 Checking animation dependencies...\n')

  // Load components.yaml
  if (!fs.existsSync(CONFIG_FILE)) {
    error('components.yaml not found')
    return
  }

  const config = yaml.load(fs.readFileSync(CONFIG_FILE, 'utf-8'))
  const componentsWithAnimations = []
  const missingDependency = []

  // Check UI components
  if (fs.existsSync(UI_COMPONENTS_DIR)) {
    const uiFiles = fs.readdirSync(UI_COMPONENTS_DIR)
      .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))

    for (const file of uiFiles) {
      const componentName = file.replace('.tsx', '')
      const filePath = path.join(UI_COMPONENTS_DIR, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      // Check for animation classes
      const hasAnimations = ANIMATION_PATTERNS.some(pattern => content.includes(pattern))

      if (hasAnimations) {
        componentsWithAnimations.push(componentName)

        // Check if tailwindcss-animate is in dependencies
        const componentConfig = config.components?.[componentName]
        const deps = componentConfig?.dependencies || []

        if (!deps.includes('tailwindcss-animate')) {
          missingDependency.push(componentName)
          error(`${componentName}: Uses animation classes but missing "tailwindcss-animate" in components.yaml`)
        }
      }
    }
  }

  // Check custom components
  if (fs.existsSync(CUSTOM_COMPONENTS_DIR)) {
    const customDirs = fs.readdirSync(CUSTOM_COMPONENTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const componentDir of customDirs) {
      const dirPath = path.join(CUSTOM_COMPONENTS_DIR, componentDir)
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))

      let hasAnimations = false
      for (const file of files) {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf-8')
        if (ANIMATION_PATTERNS.some(pattern => content.includes(pattern))) {
          hasAnimations = true
          break
        }
      }

      if (hasAnimations) {
        componentsWithAnimations.push(componentDir)

        const componentConfig = config.components?.[componentDir]
        const deps = componentConfig?.dependencies || []

        if (!deps.includes('tailwindcss-animate')) {
          missingDependency.push(componentDir)
          error(`${componentDir}: Uses animation classes but missing "tailwindcss-animate" in components.yaml`)
        }
      }
    }
  }

  if (missingDependency.length === 0) {
    if (componentsWithAnimations.length > 0) {
      success(`${componentsWithAnimations.length} component(s) with animations have correct dependencies`)
    } else {
      success('No components using animation classes found')
    }
  }
}

/**
 * Main validation runner
 */
function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║           Component Import & Dependency Validator          ║')
  console.log('╚════════════════════════════════════════════════════════════╝')

  validateRegistryImports()
  validateAnimationDependencies()

  console.log('\n' + '═'.repeat(60))

  if (hasErrors) {
    console.log('\n❌ Validation FAILED - Please fix the issues above before publishing\n')
    process.exit(1)
  } else {
    console.log('\n✅ All validations passed!\n')
    process.exit(0)
  }
}

main()
