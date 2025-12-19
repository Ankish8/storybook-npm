#!/usr/bin/env node

/**
 * This script generates the registry files from components.yaml and source files.
 * It creates:
 *   - registry-index.ts      (metadata only, for lazy loading)
 *   - registry-{category}.ts (one per category, with full component code)
 *
 * Run: npm run generate-registry
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const CONFIG_FILE = path.resolve(__dirname, '../components.yaml')
const UI_COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/ui')
const CUSTOM_COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/custom')
const OUTPUT_DIR = path.resolve(__dirname, '../src/utils')

// For backwards compatibility, also generate the combined registry.ts
const LEGACY_OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'registry.ts')

/**
 * Load and parse components.yaml
 */
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`Error: Config file not found: ${CONFIG_FILE}`)
    process.exit(1)
  }

  const content = fs.readFileSync(CONFIG_FILE, 'utf-8')
  return yaml.load(content)
}

/**
 * Read a single-file component
 */
async function readSingleFileComponent(componentName, meta) {
  const filePath = path.join(UI_COMPONENTS_DIR, `${componentName}.tsx`)

  if (!fs.existsSync(filePath)) {
    console.warn(`  Warning: Component file not found: ${filePath}`)
    return null
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  // Transform @/lib/utils import to relative path
  content = content.replace(
    /import\s*{\s*cn\s*}\s*from\s*["']@\/lib\/utils["']/g,
    'import { cn } from "../../lib/utils"'
  )

  return {
    name: componentName,
    fileName: `${componentName}.tsx`,
    content,
    description: meta.description,
    dependencies: meta.dependencies || [],
    internalDependencies: meta.internalDependencies || [],
    category: meta.category,
  }
}

/**
 * Read a multi-file component
 */
async function readMultiFileComponent(componentName, meta) {
  const componentDir = path.join(CUSTOM_COMPONENTS_DIR, meta.directory)

  if (!fs.existsSync(componentDir)) {
    console.warn(`  Warning: Component directory not found: ${componentDir}`)
    return null
  }

  const componentFiles = []
  for (const fileName of meta.files) {
    const filePath = path.join(componentDir, fileName)
    if (!fs.existsSync(filePath)) {
      console.warn(`    Warning: File not found: ${filePath}`)
      continue
    }

    let content = fs.readFileSync(filePath, 'utf-8')

    // Transform @/lib/utils import (goes up to component dir, then to lib)
    content = content.replace(
      /import\s*{\s*cn\s*}\s*from\s*["']@\/lib\/utils["']/g,
      'import { cn } from "../../../lib/utils"'
    )

    // Transform relative imports to sibling ui components
    content = content.replace(
      /from\s*["']\.\.\/\.\.\/ui\/([^"']+)["']/g,
      'from "../$1"'
    )

    componentFiles.push({
      name: fileName,
      content,
    })
  }

  return {
    name: componentName,
    description: meta.description,
    dependencies: meta.dependencies || [],
    internalDependencies: meta.internalDependencies || [],
    isMultiFile: true,
    directory: meta.directory,
    mainFile: meta.mainFile,
    files: componentFiles,
    category: meta.category,
  }
}

/**
 * Read all components in parallel
 */
async function readAllComponents(config) {
  const readPromises = Object.entries(config.components).map(async ([name, meta]) => {
    if (meta.isMultiFile) {
      return readMultiFileComponent(name, meta)
    }
    return readSingleFileComponent(name, meta)
  })

  const results = await Promise.all(readPromises)
  return results.filter(Boolean) // Remove nulls
}

/**
 * Group components by category
 */
function groupByCategory(components, categories) {
  const grouped = {}

  // Initialize all categories
  for (const category of Object.keys(categories)) {
    grouped[category] = []
  }

  // Group components
  for (const comp of components) {
    if (grouped[comp.category]) {
      grouped[comp.category].push(comp)
    } else {
      console.warn(`  Warning: Unknown category "${comp.category}" for component "${comp.name}"`)
    }
  }

  return grouped
}

/**
 * Escape content for template literals
 */
function escapeForTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/**
 * Generate the prefix utils code that gets embedded in each registry file
 */
function getPrefixUtilsCode() {
  return `// Helper to check if a string looks like Tailwind CSS classes
function looksLikeTailwindClasses(str: string): boolean {
  // Skip empty strings
  if (!str || !str.trim()) return false

  // Skip obvious non-class values (common prop values)
  const nonClassValues = [
    'button', 'submit', 'reset', 'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'checkbox', 'radio', 'file', 'hidden', 'image', 'color', 'date', 'time', 'datetime-local',
    'default', 'error', 'warning', 'success', 'info', 'primary', 'secondary', 'tertiary',
    'destructive', 'outline', 'ghost', 'link', 'dashed', 'solid', 'none',
    'open', 'closed', 'true', 'false', 'null', 'undefined',
    'single', 'multiple', 'listbox', 'combobox', 'menu', 'menuitem', 'option', 'switch',
    'small', 'medium', 'large', 'sm', 'md', 'lg', 'xl', '2xl',
    'top', 'bottom', 'left', 'right', 'center', 'start', 'end',
    'horizontal', 'vertical', 'both', 'auto',
    'asc', 'desc', 'ascending', 'descending',
  ]
  if (nonClassValues.includes(str.toLowerCase())) return false

  // Skip displayName values (PascalCase component names)
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return false

  // Skip strings that look like paths or imports
  if (str.startsWith('@') || str.startsWith('.') || str.startsWith('/') || str.includes('::')) return false

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  const tailwindUtilityPrefixes = ['text', 'bg', 'p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr', 'w', 'h', 'min', 'max', 'gap', 'space', 'border', 'rounded', 'shadow', 'opacity', 'font', 'leading', 'tracking', 'z', 'inset', 'top', 'bottom', 'left', 'right', 'flex', 'grid', 'col', 'row', 'justify', 'items', 'content', 'self', 'place', 'order', 'float', 'clear', 'object', 'overflow', 'overscroll', 'scroll', 'list', 'appearance', 'cursor', 'pointer', 'resize', 'select', 'fill', 'stroke', 'table', 'caption', 'transition', 'duration', 'ease', 'delay', 'animate', 'transform', 'origin', 'scale', 'rotate', 'translate', 'skew', 'accent', 'caret', 'outline', 'ring', 'blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia', 'backdrop', 'divide', 'sr', 'not', 'snap', 'touch', 'will', 'aspect', 'container', 'columns', 'break', 'box', 'isolation', 'mix', 'filter', 'drop', 'size']

  // Check if it looks like a Tailwind utility (prefix-value pattern) before npm check
  if (str.includes('-') && !str.includes(' ')) {
    const prefix = str.split('-')[0]
    if (tailwindUtilityPrefixes.includes(prefix)) {
      return true  // This is a Tailwind class, not npm package
    }
  }

  // Skip npm package names (but we already caught Tailwind utilities above)
  if (/^(@[a-z0-9-]+\\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(' ')) return false

  // Check if any word looks like a Tailwind class
  const words = str.split(/\\s+/)
  return words.some(cls => {
    if (!cls) return false

    // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
    // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
    if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return false

    // Single word utilities that are valid Tailwind classes
    const singleWordUtilities = /^(flex|grid|block|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky|isolate|isolation-auto|overflow-auto|overflow-hidden|overflow-clip|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overscroll-auto|overscroll-contain|overscroll-none|truncate|antialiased|subpixel-antialiased|italic|not-italic|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|sr-only|not-sr-only|resize|resize-none|resize-x|resize-y|snap-start|snap-end|snap-center|snap-align-none|snap-normal|snap-always|touch-auto|touch-none|touch-pan-x|touch-pan-left|touch-pan-right|touch-pan-y|touch-pan-up|touch-pan-down|touch-pinch-zoom|touch-manipulation|select-none|select-text|select-all|select-auto|will-change-auto|will-change-scroll|will-change-contents|will-change-transform|grow|grow-0|shrink|shrink-0|transform|transform-cpu|transform-gpu|transform-none|transition|transition-none|transition-all|transition-colors|transition-opacity|transition-shadow|transition-transform|animate-none|animate-spin|animate-ping|animate-pulse|animate-bounce)$/
    if (singleWordUtilities.test(cls)) return true

    // Classes with hyphens are likely Tailwind (bg-*, text-*, p-*, m-*, etc.)
    if (cls.includes('-')) return true

    // Classes with arbitrary values like bg-[#343E55]
    if (cls.includes('[') && cls.includes(']')) return true

    // Classes with variant prefixes like hover:, focus:, sm:
    if (cls.includes(':')) return true

    return false
  })
}

// Helper to prefix a single class string
function prefixClassString(classString: string, prefix: string): string {
  return classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
      // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
      if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return cls

      // Handle variant prefixes like hover:, focus:, sm:, data-[state=open]:, aria-[checked]:, etc.
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*:)|((data|aria)-\\[[^\\]]+\\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        const utility = cls.slice(variants.length)
        if (!utility) return cls
        // Prefix the utility part, keep variants as-is
        if (utility.startsWith('-')) {
          return \`\${variants}-\${prefix}\${utility.slice(1)}\`
        }
        return \`\${variants}\${prefix}\${utility}\`
      }

      // Handle negative values like -mt-4
      if (cls.startsWith('-') && cls.length > 1) {
        return \`-\${prefix}\${cls.slice(1)}\`
      }

      // Handle arbitrary selector values like [&_svg]:pointer-events-none
      if (cls.startsWith('[&')) {
        const closeBracket = cls.indexOf(']:')
        if (closeBracket !== -1) {
          const selector = cls.slice(0, closeBracket + 2)
          const utility = cls.slice(closeBracket + 2)
          if (!utility) return cls
          return \`\${selector}\${prefix}\${utility}\`
        }
        return cls
      }

      // Regular class (including arbitrary values like bg-[#343E55])
      return \`\${prefix}\${cls}\`
    })
    .join(' ')
}

// Context-aware Tailwind class prefixing
function prefixTailwindClasses(content: string, prefix: string): string {
  if (!prefix) return content

  // 1. Handle cva() base classes: cva("base classes here", ...)
  content = content.replace(
    /\\bcva\\s*\\(\\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!looksLikeTailwindClasses(baseClasses)) return match
      const prefixed = prefixClassString(baseClasses, prefix)
      return match.replace(\`"\${baseClasses}"\`, \`"\${prefixed}"\`)
    }
  )

  // 2. Handle cn() function calls with nested parentheses support
  // Process cn() calls by finding them and properly matching closing parens
  let result = ''
  let lastIndex = 0
  const cnRegex = /\\bcn\\s*\\(/g
  let cnMatch

  while ((cnMatch = cnRegex.exec(content)) !== null) {
    // Add everything before this cn(
    result += content.slice(lastIndex, cnMatch.index)

    // Find matching closing paren
    let depth = 1
    let i = cnMatch.index + cnMatch[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++
      else if (content[i] === ')') depth--
      i++
    }

    const args = content.slice(cnMatch.index + cnMatch[0].length, i - 1)

    // Prefix class strings within the cn() arguments (both double and single quotes)
    let prefixedArgs = args.replace(
      /"([^"]*)"/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return \`"\${prefixed}"\`
      }
    )
    // Also handle single-quoted strings
    prefixedArgs = prefixedArgs.replace(
      /'([^']*)'/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return \`'\${prefixed}'\`
      }
    )

    result += \`cn(\${prefixedArgs})\`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // 3. Handle className="..." direct attributes
  content = content.replace(
    /className\\s*=\\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      const prefixed = prefixClassString(classes, prefix)
      return \`className="\${prefixed}"\`
    }
  )

  // 4. Handle variant values in cva config objects
  // Pattern: key: "class string" or key: 'class string' within variants/defaultVariants objects
  // Handles both unquoted keys (default:) and quoted keys ("icon-sm":)
  // But be careful not to match non-class string values
  // IMPORTANT: [^"\\n]+ prevents matching across newlines to avoid greedy captures

  // Skip keys that are definitely not class values
  const nonClassKeys = ['name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy']

  // Handle double-quoted values
  content = content.replace(
    /(\\w+|"[^"]+"):\\s*"([^"\\n]+)"/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/"/g, '')

      if (nonClassKeys.includes(cleanKey)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return \`\${key}: "\${prefixed}"\`
    }
  )

  // Handle single-quoted values
  content = content.replace(
    /(\\w+|'[^']+'):\\s*'([^'\\n]+)'/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/'/g, '')

      if (nonClassKeys.includes(cleanKey)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return \`\${key}: '\${prefixed}'\`
    }
  )

  // 5. Handle function calls with class string arguments
  // Recognizes patterns like: functionName("mt-3") or helperFunc("flex gap-2")
  // where the string argument looks like Tailwind classes

  // Function names that commonly receive class strings
  const classArgFunctions = [
    'renderExpandableActions',
    'getClassName',
    'getClasses',
    'classNames',
    'mergeClasses',
    'combineClasses',
  ]

  // Handle double-quoted function arguments
  const funcArgRegex = new RegExp(
    \`\\\\b(\${classArgFunctions.join('|')})\\\\s*\\\\(\\\\s*"([^"\\\\n]*)"\`,
    'g'
  )
  content = content.replace(
    funcArgRegex,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return \`\${funcName}("\${prefixed}"\`
    }
  )

  // Handle single-quoted function arguments
  const funcArgRegexSingle = new RegExp(
    \`\\\\b(\${classArgFunctions.join('|')})\\\\s*\\\\(\\\\s*'([^'\\\\n]*)'\`,
    'g'
  )
  content = content.replace(
    funcArgRegexSingle,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return \`\${funcName}('\${prefixed}'\`
    }
  )

  return content
}`
}

/**
 * Generate a category registry file
 */
function generateCategoryFile(category, components) {
  const componentEntries = components.map(comp => {
    const deps = JSON.stringify(comp.dependencies, null, 6).replace(/\n/g, '\n      ')

    if (comp.isMultiFile) {
      const internalDeps = JSON.stringify(comp.internalDependencies || [], null, 6).replace(/\n/g, '\n      ')
      const filesArray = comp.files.map(file => {
        const escapedContent = escapeForTemplate(file.content)
        return `        {
          name: '${file.name}',
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        }`
      }).join(',\n')

      return `    '${comp.name}': {
      name: '${comp.name}',
      description: '${comp.description}',
      dependencies: ${deps},
      internalDependencies: ${internalDeps},
      isMultiFile: true,
      directory: '${comp.directory}',
      mainFile: '${comp.mainFile}',
      files: [
${filesArray}
      ],
    }`
    }

    const escapedContent = escapeForTemplate(comp.content)
    const internalDeps = comp.internalDependencies && comp.internalDependencies.length > 0
      ? JSON.stringify(comp.internalDependencies, null, 6).replace(/\n/g, '\n      ')
      : null

    return `    '${comp.name}': {
      name: '${comp.name}',
      description: '${comp.description}',
      dependencies: ${deps},${internalDeps ? `
      internalDependencies: ${internalDeps},` : ''}
      files: [
        {
          name: '${comp.fileName}',
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        },
      ],
    }`
  }).join(',\n')

  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: ${category}

import type { Registry } from './registry-types'

${getPrefixUtilsCode()}

export function get${capitalize(category)}Registry(prefix: string = ''): Registry {
  return {
${componentEntries}
  }
}
`
}

/**
 * Generate the types file
 */
function generateTypesFile() {
  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry

export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  mainFile?: string
}

export type Registry = Record<string, ComponentDefinition>

export interface ComponentMeta {
  name: string
  description: string
  dependencies: string[]
  category: string
  internalDependencies?: string[]
}
`
}

/**
 * Generate the index file with metadata and lazy loading
 */
function generateIndexFile(config, components) {
  const categories = Object.keys(config.categories)

  // Generate metadata object
  const metaEntries = components.map(comp => {
    const internalDeps = comp.internalDependencies
      ? JSON.stringify(comp.internalDependencies)
      : '[]'

    return `  '${comp.name}': {
    name: '${comp.name}',
    description: '${comp.description}',
    dependencies: ${JSON.stringify(comp.dependencies)},
    category: '${comp.category}',
    internalDependencies: ${internalDeps},
  }`
  }).join(',\n')

  // Generate category imports
  const categoryImports = categories.map(cat =>
    `import { get${capitalize(cat)}Registry } from './registry-${cat}'`
  ).join('\n')

  // Generate category getter switch
  const categoryGetters = categories.map(cat =>
    `    case '${cat}': return get${capitalize(cat)}Registry(prefix)`
  ).join('\n')

  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
//
// This file provides lazy-loading access to component registries.
// Components are split by category for optimal loading performance.

import type { Registry, ComponentDefinition, ComponentMeta } from './registry-types'

${categoryImports}

// Component metadata (loaded immediately - small footprint)
export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
${metaEntries}
}

// Available categories
export const CATEGORIES = ${JSON.stringify(categories)} as const
export type Category = typeof CATEGORIES[number]

/**
 * Get metadata for all components (fast, no source code loaded)
 */
export function getComponentList(): ComponentMeta[] {
  return Object.values(COMPONENT_METADATA)
}

/**
 * Get metadata for a specific component
 */
export function getComponentMeta(name: string): ComponentMeta | undefined {
  return COMPONENT_METADATA[name]
}

/**
 * Get all components in a specific category
 */
export function getCategoryRegistry(category: Category, prefix: string = ''): Registry {
  switch (category) {
${categoryGetters}
    default:
      throw new Error(\`Unknown category: \${category}\`)
  }
}

/**
 * Get a single component by name (lazy loads only the needed category)
 */
export async function getComponent(name: string, prefix: string = ''): Promise<ComponentDefinition | undefined> {
  const meta = COMPONENT_METADATA[name]
  if (!meta) return undefined

  const categoryRegistry = getCategoryRegistry(meta.category as Category, prefix)
  return categoryRegistry[name]
}

/**
 * Get the full registry (all components) - for backwards compatibility
 * Note: This loads ALL categories into memory. Prefer getComponent() for better performance.
 */
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  const allComponents: Registry = {}

  for (const category of CATEGORIES) {
    const categoryRegistry = getCategoryRegistry(category, prefix)
    Object.assign(allComponents, categoryRegistry)
  }

  return allComponents
}

// Re-export types
export type { Registry, ComponentDefinition, ComponentMeta, ComponentFile } from './registry-types'
`
}

/**
 * Generate legacy combined registry.ts for backwards compatibility
 */
function generateLegacyRegistryFile(components) {
  const componentEntries = components.map(comp => {
    const deps = JSON.stringify(comp.dependencies, null, 6).replace(/\n/g, '\n      ')

    if (comp.isMultiFile) {
      const internalDeps = JSON.stringify(comp.internalDependencies || [], null, 6).replace(/\n/g, '\n      ')
      const filesArray = comp.files.map(file => {
        const escapedContent = escapeForTemplate(file.content)
        return `        {
          name: '${file.name}',
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        }`
      }).join(',\n')

      return `    '${comp.name}': {
      name: '${comp.name}',
      description: '${comp.description}',
      dependencies: ${deps},
      internalDependencies: ${internalDeps},
      isMultiFile: true,
      directory: '${comp.directory}',
      mainFile: '${comp.mainFile}',
      files: [
${filesArray}
      ],
    }`
    }

    const escapedContent = escapeForTemplate(comp.content)
    const internalDeps = comp.internalDependencies && comp.internalDependencies.length > 0
      ? JSON.stringify(comp.internalDependencies, null, 6).replace(/\n/g, '\n      ')
      : null

    return `    '${comp.name}': {
      name: '${comp.name}',
      description: '${comp.description}',
      dependencies: ${deps},${internalDeps ? `
      internalDependencies: ${internalDeps},` : ''}
      files: [
        {
          name: '${comp.fileName}',
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        },
      ],
    }`
  }).join(',\n')

  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry

export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  mainFile?: string
}

export type Registry = Record<string, ComponentDefinition>

${getPrefixUtilsCode()}

// In a real implementation, this would fetch from a remote URL
// For now, we'll embed the components directly
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  return {
${componentEntries}
  }
}
`
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Main function
 */
async function main() {
  console.log('Generating registry from components.yaml...')
  console.log(`Config file: ${CONFIG_FILE}`)
  console.log(`UI Components: ${UI_COMPONENTS_DIR}`)
  console.log(`Custom Components: ${CUSTOM_COMPONENTS_DIR}`)
  console.log(`Output directory: ${OUTPUT_DIR}`)

  // Load configuration
  const config = loadConfig()
  console.log(`\nLoaded ${Object.keys(config.components).length} component definitions`)
  console.log(`Categories: ${Object.keys(config.categories).join(', ')}`)

  // Read all components in parallel
  console.log('\nReading component files...')
  const components = await readAllComponents(config)
  console.log(`Read ${components.length} components successfully`)

  // Group by category
  const grouped = groupByCategory(components, config.categories)

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Generate types file
  const typesContent = generateTypesFile()
  const typesFile = path.join(OUTPUT_DIR, 'registry-types.ts')
  fs.writeFileSync(typesFile, typesContent)
  console.log(`✓ Generated: registry-types.ts`)

  // Generate category files in parallel
  const categoryWrites = Object.entries(grouped).map(([category, categoryComponents]) => {
    if (categoryComponents.length === 0) {
      console.log(`  Skipping empty category: ${category}`)
      return Promise.resolve()
    }

    const content = generateCategoryFile(category, categoryComponents)
    const filePath = path.join(OUTPUT_DIR, `registry-${category}.ts`)
    fs.writeFileSync(filePath, content)
    console.log(`✓ Generated: registry-${category}.ts (${categoryComponents.length} components)`)
    return Promise.resolve()
  })

  await Promise.all(categoryWrites)

  // Generate index file
  const indexContent = generateIndexFile(config, components)
  const indexFile = path.join(OUTPUT_DIR, 'registry-index.ts')
  fs.writeFileSync(indexFile, indexContent)
  console.log(`✓ Generated: registry-index.ts`)

  // Generate legacy combined registry for backwards compatibility
  const legacyContent = generateLegacyRegistryFile(components)
  fs.writeFileSync(LEGACY_OUTPUT_FILE, legacyContent)
  console.log(`✓ Generated: registry.ts (legacy, for backwards compatibility)`)

  console.log('\n✅ Registry generation complete!')
  console.log(`   Total components: ${components.length}`)
  console.log(`   Categories: ${Object.keys(grouped).filter(c => grouped[c].length > 0).length}`)
}

// Run
main().catch(console.error)
