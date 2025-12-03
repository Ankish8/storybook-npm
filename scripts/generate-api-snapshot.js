#!/usr/bin/env node

/**
 * API Snapshot Generator
 *
 * Extracts and stores the public API (props, types, exports) from component files.
 * Used to detect breaking changes before publishing.
 *
 * Run: node scripts/generate-api-snapshot.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const SNAPSHOT_FILE = path.resolve(__dirname, '../.api-snapshot.json')

/**
 * Extract interface/type properties from TypeScript content
 */
function extractInterfaceProps(content, interfaceName) {
  // Match interface declaration
  const interfaceRegex = new RegExp(
    `export\\s+interface\\s+${interfaceName}[^{]*\\{([^}]+)\\}`,
    's'
  )
  const match = content.match(interfaceRegex)

  if (!match) return null

  const body = match[1]
  const props = {}

  // Extract each property line
  const propLines = body.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')
  })

  for (const line of propLines) {
    // Match: propName?: Type or propName: Type
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
 * Extract CVA variants from component
 */
function extractVariants(content, variantsName) {
  // Find the cva() call
  const cvaRegex = new RegExp(
    `const\\s+${variantsName}\\s*=\\s*cva\\([^,]+,\\s*\\{([^}]+variants:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\})`,
    's'
  )
  const match = content.match(cvaRegex)

  if (!match) return null

  const variants = {}
  const variantsBlock = match[2]

  // Extract variant names and their options
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
 * Extract all exports from a component file
 */
function extractExports(content) {
  const exports = []

  // Named exports: export { X, Y, Z }
  const namedExportMatch = content.match(/export\s*\{([^}]+)\}/)
  if (namedExportMatch) {
    const names = namedExportMatch[1].split(',').map(n => n.trim()).filter(Boolean)
    exports.push(...names)
  }

  // Direct exports: export const X, export interface X, export type X
  const directExports = content.matchAll(/export\s+(?:const|interface|type|function)\s+(\w+)/g)
  for (const match of directExports) {
    if (!exports.includes(match[1])) {
      exports.push(match[1])
    }
  }

  return exports.sort()
}

/**
 * Analyze a single component file
 */
function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath, '.tsx')

  const analysis = {
    exports: extractExports(content),
    interfaces: {},
    variants: {}
  }

  // Find all interface definitions
  const interfaceMatches = content.matchAll(/export\s+interface\s+(\w+)/g)
  for (const match of interfaceMatches) {
    const interfaceName = match[1]
    const props = extractInterfaceProps(content, interfaceName)
    if (props) {
      analysis.interfaces[interfaceName] = props
    }
  }

  // Find all variant definitions
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
 * Generate snapshot for all components
 */
function generateSnapshot() {
  console.log('Generating API snapshot...\n')

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Error: Components directory not found: ${COMPONENTS_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.'))

  const snapshot = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    components: {}
  }

  for (const file of files) {
    const componentName = file.replace('.tsx', '')
    const filePath = path.join(COMPONENTS_DIR, file)

    console.log(`  Analyzing: ${componentName}`)
    snapshot.components[componentName] = analyzeComponent(filePath)
  }

  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2))

  console.log(`\n✓ Snapshot saved to: ${SNAPSHOT_FILE}`)
  console.log(`  Components: ${Object.keys(snapshot.components).join(', ')}`)

  return snapshot
}

// Run if called directly
generateSnapshot()
