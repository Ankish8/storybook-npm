#!/usr/bin/env node

/**
 * Breaking Change Detector
 *
 * Compares current component APIs against the stored snapshot to detect:
 * - Removed exports
 * - Removed props from interfaces
 * - Changed prop types (from optional to required)
 * - Removed variant options
 *
 * Run: node scripts/check-breaking-changes.js [--update]
 *
 * Options:
 *   --update    Update the snapshot after reviewing changes
 *   --component <name>  Check only a specific component
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const SNAPSHOT_FILE = path.resolve(__dirname, '../.api-snapshot.json')

// ANSI colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Extract interface props (simplified version for comparison)
 */
function extractInterfaceProps(content, interfaceName) {
  const interfaceRegex = new RegExp(
    `export\\s+interface\\s+${interfaceName}[^{]*\\{([^}]+)\\}`,
    's'
  )
  const match = content.match(interfaceRegex)
  if (!match) return null

  const body = match[1]
  const props = {}

  const propLines = body.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')
  })

  for (const line of propLines) {
    const propMatch = line.match(/^\s*(?:\/\*\*[^*]*\*\/\s*)?(\w+)(\?)?:\s*([^;]+)/)
    if (propMatch) {
      const [, name, optional, type] = propMatch
      props[name] = {
        type: type.trim(),
        optional: !!optional
      }
    }
  }

  return props
}

/**
 * Extract CVA variants
 */
function extractVariants(content, variantsName) {
  const cvaRegex = new RegExp(
    `const\\s+${variantsName}\\s*=\\s*cva\\([^,]+,\\s*\\{([^}]+variants:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\})`,
    's'
  )
  const match = content.match(cvaRegex)
  if (!match) return null

  const variants = {}
  const variantsBlock = match[2]
  const variantMatches = variantsBlock.matchAll(/(\w+):\s*\{([^}]+)\}/g)

  for (const variantMatch of variantMatches) {
    const [, variantName, options] = variantMatch
    const optionNames = []
    const optionMatches = options.matchAll(/(\w+|"[^"]+"):/g)
    for (const optMatch of optionMatches) {
      optionNames.push(optMatch[1].replace(/"/g, ''))
    }
    variants[variantName] = optionNames
  }

  return variants
}

/**
 * Extract exports
 */
function extractExports(content) {
  const exports = []

  const namedExportMatch = content.match(/export\s*\{([^}]+)\}/)
  if (namedExportMatch) {
    const names = namedExportMatch[1].split(',').map(n => n.trim()).filter(Boolean)
    exports.push(...names)
  }

  const directExports = content.matchAll(/export\s+(?:const|interface|type|function)\s+(\w+)/g)
  for (const match of directExports) {
    if (!exports.includes(match[1])) {
      exports.push(match[1])
    }
  }

  return exports.sort()
}

/**
 * Analyze current component
 */
function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  const analysis = {
    exports: extractExports(content),
    interfaces: {},
    variants: {}
  }

  const interfaceMatches = content.matchAll(/export\s+interface\s+(\w+)/g)
  for (const match of interfaceMatches) {
    const interfaceName = match[1]
    const props = extractInterfaceProps(content, interfaceName)
    if (props) {
      analysis.interfaces[interfaceName] = props
    }
  }

  const variantMatches = content.matchAll(/const\s+(\w+Variants)\s*=\s*cva/g)
  for (const match of variantMatches) {
    const variantsName = match[1]
    const variants = extractVariants(content, variantsName)
    if (variants) {
      analysis.variants[variantsName] = variants
    }
  }

  return analysis
}

/**
 * Compare two component analyses and find breaking changes
 */
function findBreakingChanges(componentName, oldAnalysis, newAnalysis) {
  const breaking = []
  const warnings = []
  const additions = []

  // Check removed exports
  for (const exp of oldAnalysis.exports) {
    if (!newAnalysis.exports.includes(exp)) {
      breaking.push({
        type: 'REMOVED_EXPORT',
        message: `Export "${exp}" was removed`
      })
    }
  }

  // Check new exports (not breaking, but notable)
  for (const exp of newAnalysis.exports) {
    if (!oldAnalysis.exports.includes(exp)) {
      additions.push({
        type: 'NEW_EXPORT',
        message: `New export "${exp}" added`
      })
    }
  }

  // Check interface changes
  for (const [interfaceName, oldProps] of Object.entries(oldAnalysis.interfaces)) {
    const newProps = newAnalysis.interfaces[interfaceName]

    if (!newProps) {
      breaking.push({
        type: 'REMOVED_INTERFACE',
        message: `Interface "${interfaceName}" was removed`
      })
      continue
    }

    // Check for removed props
    for (const [propName, oldProp] of Object.entries(oldProps)) {
      const newProp = newProps[propName]

      if (!newProp) {
        breaking.push({
          type: 'REMOVED_PROP',
          message: `Prop "${propName}" was removed from ${interfaceName}`
        })
      } else if (oldProp.optional && !newProp.optional) {
        breaking.push({
          type: 'PROP_NOW_REQUIRED',
          message: `Prop "${propName}" in ${interfaceName} changed from optional to required`
        })
      } else if (oldProp.type !== newProp.type) {
        warnings.push({
          type: 'PROP_TYPE_CHANGED',
          message: `Prop "${propName}" in ${interfaceName} type changed: "${oldProp.type}" → "${newProp.type}"`
        })
      }
    }

    // Check for new props (not breaking if optional)
    for (const [propName, newProp] of Object.entries(newProps)) {
      if (!oldProps[propName]) {
        if (newProp.optional) {
          additions.push({
            type: 'NEW_OPTIONAL_PROP',
            message: `New optional prop "${propName}" added to ${interfaceName}`
          })
        } else {
          breaking.push({
            type: 'NEW_REQUIRED_PROP',
            message: `New required prop "${propName}" added to ${interfaceName}`
          })
        }
      }
    }
  }

  // Check variant changes
  for (const [variantsName, oldVariants] of Object.entries(oldAnalysis.variants)) {
    const newVariants = newAnalysis.variants[variantsName]

    if (!newVariants) {
      breaking.push({
        type: 'REMOVED_VARIANTS',
        message: `Variants "${variantsName}" were removed`
      })
      continue
    }

    for (const [variantName, oldOptions] of Object.entries(oldVariants)) {
      const newOptions = newVariants[variantName]

      if (!newOptions) {
        breaking.push({
          type: 'REMOVED_VARIANT',
          message: `Variant "${variantName}" was removed from ${variantsName}`
        })
        continue
      }

      // Check for removed variant options
      for (const option of oldOptions) {
        if (!newOptions.includes(option)) {
          breaking.push({
            type: 'REMOVED_VARIANT_OPTION',
            message: `Variant option "${variantName}=${option}" was removed from ${variantsName}`
          })
        }
      }

      // Check for new variant options (not breaking)
      for (const option of newOptions) {
        if (!oldOptions.includes(option)) {
          additions.push({
            type: 'NEW_VARIANT_OPTION',
            message: `New variant option "${variantName}=${option}" added to ${variantsName}`
          })
        }
      }
    }
  }

  return { breaking, warnings, additions }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const shouldUpdate = args.includes('--update')
  const componentFilter = args.includes('--component')
    ? args[args.indexOf('--component') + 1]
    : null

  console.log('\n' + colors.bold + '🔍 Breaking Change Detector' + colors.reset + '\n')

  // Check if snapshot exists
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    log('yellow', '⚠️  No API snapshot found. Run "npm run api:snapshot" first.')
    log('cyan', '   This will create a baseline snapshot of all component APIs.\n')
    process.exit(0)
  }

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'))
  console.log(`Comparing against snapshot from: ${snapshot.generatedAt}\n`)

  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.'))

  let totalBreaking = 0
  let totalWarnings = 0
  let totalAdditions = 0
  const allChanges = {}

  for (const file of files) {
    const componentName = file.replace('.tsx', '')

    if (componentFilter && componentName !== componentFilter) {
      continue
    }

    const oldAnalysis = snapshot.components[componentName]

    if (!oldAnalysis) {
      log('green', `✨ NEW: ${componentName} (not in snapshot)`)
      totalAdditions++
      continue
    }

    const filePath = path.join(COMPONENTS_DIR, file)
    const newAnalysis = analyzeComponent(filePath)
    const changes = findBreakingChanges(componentName, oldAnalysis, newAnalysis)

    allChanges[componentName] = changes

    if (changes.breaking.length > 0 || changes.warnings.length > 0 || changes.additions.length > 0) {
      console.log(colors.bold + `\n📦 ${componentName}` + colors.reset)

      for (const change of changes.breaking) {
        log('red', `  ❌ BREAKING: ${change.message}`)
        totalBreaking++
      }

      for (const change of changes.warnings) {
        log('yellow', `  ⚠️  WARNING: ${change.message}`)
        totalWarnings++
      }

      for (const change of changes.additions) {
        log('green', `  ✅ ADDED: ${change.message}`)
        totalAdditions++
      }
    }
  }

  // Summary
  console.log('\n' + colors.bold + '═'.repeat(50) + colors.reset)
  console.log(colors.bold + 'Summary:' + colors.reset)

  if (totalBreaking > 0) {
    log('red', `  ❌ ${totalBreaking} breaking change(s)`)
  }
  if (totalWarnings > 0) {
    log('yellow', `  ⚠️  ${totalWarnings} warning(s)`)
  }
  if (totalAdditions > 0) {
    log('green', `  ✅ ${totalAdditions} addition(s)`)
  }
  if (totalBreaking === 0 && totalWarnings === 0 && totalAdditions === 0) {
    log('green', '  ✅ No API changes detected')
  }

  console.log(colors.bold + '═'.repeat(50) + colors.reset + '\n')

  // Exit with error if breaking changes found (for CI/pre-commit)
  if (totalBreaking > 0) {
    log('red', '🚨 Breaking changes detected!')
    log('yellow', '\nOptions:')
    log('cyan', '  1. Revert the breaking changes')
    log('cyan', '  2. If intentional, update snapshot: npm run api:snapshot')
    log('cyan', '  3. Document in CHANGELOG as breaking change\n')

    if (!shouldUpdate) {
      process.exit(1)
    }
  }

  if (shouldUpdate) {
    log('cyan', 'Updating API snapshot...')
    const { execSync } = await import('child_process')
    execSync('node scripts/generate-api-snapshot.js', { stdio: 'inherit' })
  }
}

main().catch(console.error)
