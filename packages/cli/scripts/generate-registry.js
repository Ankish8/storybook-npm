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
const CUSTOM_COMPONENTS_DIR = path.resolve(
  __dirname,
  '../../../src/components/custom'
)
const OUTPUT_DIR = path.resolve(__dirname, '../src/utils')

// For backwards compatibility, also generate the combined registry.ts
const LEGACY_OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'registry.ts')

// Single source of truth: read prefix arrays from prefix-utils.ts
const PREFIX_UTILS_PATH = path.resolve(
  __dirname,
  '../src/utils/prefix-utils.ts'
)
const prefixUtilsSource = fs.readFileSync(PREFIX_UTILS_PATH, 'utf-8')

const prefixArrayMatch = prefixUtilsSource.match(
  /const tailwindUtilityPrefixes = (\[[\s\S]*?\])/
)
if (!prefixArrayMatch) {
  console.error(
    'Error: Could not extract tailwindUtilityPrefixes from prefix-utils.ts'
  )
  process.exit(1)
}
const TAILWIND_UTILITY_PREFIXES_LITERAL = prefixArrayMatch[1]

const singleWordMatch = prefixUtilsSource.match(
  /const singleWordUtilities\s*=\s*(\/\^.*?\$\/)/
)
if (!singleWordMatch) {
  console.error(
    'Error: Could not extract singleWordUtilities from prefix-utils.ts'
  )
  process.exit(1)
}
const SINGLE_WORD_UTILITIES_LITERAL = singleWordMatch[1]

/**
 * Extract a function body from TypeScript source by name.
 * Properly handles strings, template literals, and comments to track brace depth.
 */
function extractFunctionFromSource(source, funcName) {
  const funcRegex = new RegExp(`(?:export )?function ${funcName}\\b`)
  const match = funcRegex.exec(source)
  if (!match) {
    console.warn(
      `Warning: Could not find function ${funcName} in prefix-utils.ts`
    )
    return ''
  }

  let depth = 0
  let i = match.index
  while (i < source.length) {
    if (source[i] === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++
      continue
    }
    if (source[i] === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/'))
        i++
      i += 2
      continue
    }
    // Handle regex literals: /pattern/flags
    // A '/' is a regex start when preceded by certain tokens (not a division operator)
    if (source[i] === '/' && source[i + 1] !== '/' && source[i + 1] !== '*') {
      // Look back to determine if this is a regex or division
      let j = i - 1
      while (j >= 0 && /\s/.test(source[j])) j--
      const prevChar = j >= 0 ? source[j] : ''
      // After these chars/keywords, '/' starts a regex (not division)
      if (
        '=([!&|?:,;{}>~^%*/+-'.includes(prevChar) ||
        prevChar === '' ||
        source.slice(Math.max(0, j - 5), j + 1).match(/\breturn$/)
      ) {
        i++ // skip opening /
        while (i < source.length && source[i] !== '/') {
          if (source[i] === '\\') i++ // skip escaped char
          if (source[i] === '[') {
            // character class
            i++
            while (i < source.length && source[i] !== ']') {
              if (source[i] === '\\') i++
              i++
            }
          }
          i++
        }
        i++ // skip closing /
        while (i < source.length && /[gimsuy]/.test(source[i])) i++ // skip flags
        continue
      }
    }
    if (source[i] === "'" || source[i] === '"') {
      const quote = source[i]
      i++
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (source[i] === '`') {
      i++
      let tmplDepth = 0
      while (i < source.length) {
        if (source[i] === '\\') {
          i += 2
          continue
        }
        if (source[i] === '`' && tmplDepth === 0) {
          i++
          break
        }
        if (source[i] === '$' && source[i + 1] === '{') {
          tmplDepth++
          i += 2
          continue
        }
        if (source[i] === '}' && tmplDepth > 0) {
          tmplDepth--
          i++
          continue
        }
        i++
      }
      continue
    }
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) {
        i++
        break
      }
    }
    i++
  }

  let code = source.slice(match.index, i)
  code = code.replace(/^export /, '')
  return code
}

// Extract Pattern 6 block and helper functions from prefix-utils.ts
const pattern6Match = prefixUtilsSource.match(
  /\/\/ PATTERN-6-START\r?\n([\s\S]*?)\r?\n\s*\/\/ PATTERN-6-END/
)
const PATTERN_6_CODE = pattern6Match ? pattern6Match[1].trimEnd() : ''

const HELPER_FUNCTIONS = [
  'isAlreadyPrefixed',
  'prefixStaticTemplatePart',
  'prefixStringLiteralsInExpr',
  'prefixClassNameExpression',
]
  .map((name) => extractFunctionFromSource(prefixUtilsSource, name))
  .filter(Boolean)
  .join('\n\n')

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
async function readMultiFileComponent(componentName, meta, allComponents) {
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

    // Transform @/lib/utils import for multi-file components
    // Without group: installed to src/components/ui/{component}/ → ../../../lib/
    // With group:    installed to src/components/ui/{group}/{component}/ → ../../../../lib/
    const utilsDepth = meta.group
      ? '../../../../lib/utils'
      : '../../../lib/utils'
    content = content.replace(
      /import\s*{\s*cn\s*}\s*from\s*["']@\/lib\/utils["']/g,
      `import { cn } from "${utilsDepth}"`
    )

    // Transform @/components/ui/... imports to relative paths
    // Without group: from ui/component-name/ to ui/ is ../
    // With group:    from ui/group/component-name/ to ui/ is ../../
    const uiSiblingPrefix = meta.group ? '../..' : '..'
    content = content.replace(
      /from\s*["']@\/components\/ui\/([^"']+)["']/g,
      `from "${uiSiblingPrefix}/$1"`
    )

    // Transform relative imports from source location (../../ui/) to target location
    // Source: src/components/custom/component-name/ uses ../../ui/X
    // Without group: target src/components/ui/component-name/ uses ../X
    // With group:    target src/components/ui/group/component-name/ uses ../../X
    content = content.replace(
      /from\s*["']\.\.\/\.\.\/ui\/([^"']+)["']/g,
      `from "${uiSiblingPrefix}/$1"`
    )

    // For grouped components, also transform relative lib/utils paths
    // Source custom components use ../../../lib/utils (3 levels: custom/component/ → src/)
    // Grouped target uses ../../../../lib/utils (4 levels: ui/group/component/ → src/)
    if (meta.group) {
      content = content.replace(
        /from\s*["']\.\.\/\.\.\/\.\.\/lib\/utils["']/g,
        `from "../../../../lib/utils"`
      )

      // Transform sibling custom component imports for grouped components
      // Source: ../sibling-component (works in custom/ where all are at same level)
      // Target: must check if sibling is in the SAME group or not
      //   Same group: ../sibling (correct, both under ui/group/)
      //   Different/no group: ../../sibling (need to go up out of group/ first)
      const sameGroupDirs = new Set()
      if (allComponents) {
        for (const [, compMeta] of Object.entries(allComponents)) {
          if (
            compMeta.group === meta.group &&
            compMeta.isMultiFile &&
            compMeta.directory
          ) {
            sameGroupDirs.add(compMeta.directory)
          }
        }
      }

      content = content.replace(
        /from\s*["']\.\.\/([^."'/][^"']*)["']/g,
        (match, importPath) => {
          // Extract the top-level directory from the import path (e.g. "chat-list-item" from "../chat-list-item")
          const topDir = importPath.split('/')[0]
          if (sameGroupDirs.has(topDir)) {
            // Same group — keep as ../
            return match
          }
          // Different group — needs ../../
          return `from "../../${importPath}"`
        }
      )
    }

    componentFiles.push({
      name: fileName,
      content,
    })
  }

  const result = {
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
  if (meta.group) {
    result.group = meta.group
  }
  if (meta.templateOnly) {
    result.templateOnly = true
  }
  return result
}

/**
 * Read all components in parallel
 */
async function readAllComponents(config) {
  const readPromises = Object.entries(config.components).map(
    async ([name, meta]) => {
      if (meta.isMultiFile) {
        return readMultiFileComponent(name, meta, config.components)
      }
      return readSingleFileComponent(name, meta)
    }
  )

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
      console.warn(
        `  Warning: Unknown category "${comp.category}" for component "${comp.name}"`
      )
    }
  }

  return grouped
}

/**
 * Escape content for template literals
 */
function escapeForTemplate(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

/**
 * Generate the prefix utils code that gets embedded in each registry file
 */
function getPrefixUtilsCode() {
  let code = `/**
 * Semantic token to fallback color mapping
 * Ensures components work even without semantic tokens defined in user's Tailwind config
 */
const SEMANTIC_FALLBACKS: Record<string, string> = {
  // Primary UI Colors
  'semantic-primary': '#343E55',
  'semantic-primary-hover': '#2F384D',
  'semantic-primary-selected': '#777E8D',
  'semantic-primary-selected-hover': '#5D6577',
  'semantic-primary-highlighted': '#252C3C',
  'semantic-primary-surface': '#EBECEE',
  // Brand Colors
  'semantic-brand': '#2BBCCA',
  'semantic-brand-hover': '#1F858F',
  'semantic-brand-selected': '#71D2DB',
  'semantic-brand-selected-hover': '#27ABB8',
  'semantic-brand-highlighted': '#27ABB8',
  'semantic-brand-surface': '#EAF8FA',
  // Background Colors
  'semantic-bg-primary': '#FFFFFF',
  'semantic-bg-secondary': '#0C0F12',
  'semantic-bg-ui': '#F5F5F5',
  'semantic-bg-grey': '#E9EAEB',
  'semantic-bg-grey-hover': '#A4A7AE',
  'semantic-bg-inverted': '#000000',
  'semantic-bg-hover': '#D5D7DA',
  // Text Colors
  'semantic-text-primary': '#181D27',
  'semantic-text-secondary': '#343E55',
  'semantic-text-placeholder': '#A2A6B1',
  'semantic-text-link': '#4275D6',
  'semantic-text-inverted': '#FFFFFF',
  'semantic-text-muted': '#717680',
  // Border Colors
  'semantic-border-primary': '#343E55',
  'semantic-border-secondary': '#777E8D',
  'semantic-border-accent': '#27ABB8',
  'semantic-border-layout': '#E9EAEB',
  'semantic-border-input': '#E9EAEB',
  'semantic-border-input-focus': '#2BBCCA',
  'semantic-border-focus': '#2BBCCA',
  // Disabled State
  'semantic-disabled-primary': '#A2A6B1',
  'semantic-disabled-secondary': '#EBECEE',
  'semantic-disabled-text': '#717680',
  'semantic-disabled-border': '#D5D7DA',
  // Error State
  'semantic-error-primary': '#F04438',
  'semantic-error-surface': '#FEF3F2',
  'semantic-error-text': '#B42318',
  'semantic-error-border': '#FDA29B',
  'semantic-error-hover': '#D92D20',
  // Warning State
  'semantic-warning-primary': '#F79009',
  'semantic-warning-surface': '#FFFAEB',
  'semantic-warning-text': '#B54708',
  'semantic-warning-border': '#FEC84B',
  'semantic-warning-hover': '#DC6803',
  // Success State
  'semantic-success-primary': '#17B26A',
  'semantic-success-surface': '#ECFDF3',
  'semantic-success-text': '#067647',
  'semantic-success-border': '#75E0A7',
  'semantic-success-hover': '#079455',
  // Info State
  'semantic-info-primary': '#4275D6',
  'semantic-info-surface': '#ECF1FB',
  'semantic-info-text': '#2F5398',
  'semantic-info-border': '#A8C0EC',
  'semantic-info-hover': '#3C6AC3',
}

/**
 * Transform a single semantic class to CSS variable syntax with fallback
 */
function transformSemanticClass(cls: string): string {
  const match = cls.match(/^(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-(semantic-[a-z-]+)$/)
  if (match) {
    const [, utilityPrefix, token] = match
    const fallback = SEMANTIC_FALLBACKS[token]
    if (fallback) {
      return \`\${utilityPrefix}-[var(--\${token},\${fallback})]\`
    }
  }
  return cls
}

/**
 * Transform semantic classes in a class string to use CSS variable fallbacks
 */
function transformSemanticClasses(classString: string): string {
  return classString.split(' ').map((cls: string) => {
    if (!cls) return cls
    // Handle variant prefixes (hover:, focus:, etc.)
    const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\\/[a-z][a-z0-9-]*)?:)|((data|aria)-\\[[^\\]]+\\]:))+/)
    if (variantMatch) {
      const variants = variantMatch[0]
      const utility = cls.slice(variants.length)
      return variants + transformSemanticClass(utility)
    }
    return transformSemanticClass(cls)
  }).join(' ')
}

/**
 * Transform semantic classes throughout component content
 */
function transformSemanticClassesInContent(content: string): string {
  const hasSemanticClasses = (str: string): boolean => {
    return /\\b(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-semantic-/.test(str)
  }

  // Handle cva() base classes
  content = content.replace(
    /\\bcva\\s*\\(\\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!hasSemanticClasses(baseClasses)) return match
      return match.replace(\`"\${baseClasses}"\`, \`"\${transformSemanticClasses(baseClasses)}"\`)
    }
  )

  // Handle cn() function calls
  let result = ''
  let lastIndex = 0
  const cnRegex = /\\bcn\\s*\\(/g
  let cnMatch
  while ((cnMatch = cnRegex.exec(content)) !== null) {
    // Skip nested cn() calls that fall inside an already-processed outer cn()
    if (cnMatch.index < lastIndex) continue

    result += content.slice(lastIndex, cnMatch.index)
    let depth = 1
    let i = cnMatch.index + cnMatch[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++
      else if (content[i] === ')') depth--
      i++
    }
    const args = content.slice(cnMatch.index + cnMatch[0].length, i - 1)
    let transformedArgs = args.replace(/"([^"]*)"/g, (m: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return m
      return \`"\${transformSemanticClasses(classes)}"\`
    })
    transformedArgs = transformedArgs.replace(/'([^']*)'/g, (m: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return m
      return \`'\${transformSemanticClasses(classes)}'\`
    })
    result += \`cn(\${transformedArgs})\`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // Handle className="..." attributes
  content = content.replace(
    /className\\s*=\\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return match
      return \`className="\${transformSemanticClasses(classes)}"\`
    }
  )

  // Handle variant values in cva config objects
  content = content.replace(
    /(\\w+|"[^"]+"):\\s*"([^"\\n]+)"/g,
    (match: string, key: string, value: string) => {
      if (!hasSemanticClasses(value)) return match
      return \`\${key}: "\${transformSemanticClasses(value)}"\`
    }
  )
  content = content.replace(
    /(\\w+|'[^']+'):\\s*'([^'\\n]+)'/g,
    (match: string, key: string, value: string) => {
      if (!hasSemanticClasses(value)) return match
      return \`\${key}: '\${transformSemanticClasses(value)}'\`
    }
  )

  return content
}

// Helper to check if a string looks like Tailwind CSS classes
function looksLikeTailwindClasses(str: string): boolean {
  // Skip empty strings
  if (!str || !str.trim()) return false

  // Skip strings with non-ASCII characters (currency symbols, unicode, etc.)
  // Tailwind classes are always ASCII — ₹, €, £, ¥ etc. are display text, not classes
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(str)) return false

  // Skip obvious non-class values (common prop values)
  const nonClassValues = [
    'button', 'submit', 'reset', 'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'checkbox', 'radio', 'file', 'image', 'color', 'date', 'time', 'datetime-local',
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

  // Skip natural language sentences — strings with uppercase words, periods, or common sentence patterns
  // Tailwind classes are always lowercase (except arbitrary values in brackets)
  if (/[A-Z][a-z]{2,}/.test(str) && !str.includes('[')) return false
  // Skip strings ending with punctuation (sentences)
  if (/[.!?]$/.test(str.trim())) return false
  // Skip strings with common English words that aren't Tailwind utilities
  const sentenceWords = ['for', 'and', 'the', 'with', 'over', 'from', 'into', 'that', 'this', 'your', 'our']
  const tokens = str.split(/\s+/)
  if (tokens.length >= 3 && tokens.some(w => sentenceWords.includes(w.toLowerCase()))) return false

  // Skip displayName values (PascalCase component names)
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return false

  // Skip strings that look like paths or imports
  // Allow :: inside arbitrary selectors like [&::-webkit-inner-spin-button]
  if (str.startsWith('@') || str.startsWith('.') || str.startsWith('/') || (str.includes('::') && !str.includes('[&'))) return false

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  const tailwindUtilityPrefixes = ${TAILWIND_UTILITY_PREFIXES_LITERAL}

  // Check if it looks like a Tailwind utility (prefix-value pattern) before npm check
  if (str.includes('-') && !str.includes(' ')) {
    const prefix = str.split('-')[0]
    if (tailwindUtilityPrefixes.includes(prefix)) {
      return true  // This is a Tailwind class, not npm package
    }
  }

  // Single word utilities — check BEFORE npm regex so "relative", "flex", etc. aren't misidentified
  const singleWordUtilities = ${SINGLE_WORD_UTILITIES_LITERAL}
  if (!str.includes(' ') && singleWordUtilities.test(str)) return true

  // Skip npm package names (but we already caught Tailwind utilities above)
  if (/^(@[a-z0-9-]+\\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(' ')) return false

  // Check if any word looks like a Tailwind class
  const words = str.split(/\\s+/)
  return words.some(cls => {
    if (!cls) return false

    // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
    // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
    if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return false

    // Single word utilities (reuse same regex for multi-word strings)
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

// Regex to detect border-WIDTH classes (border, border-2, border-t, border-b-4, border-[3px], etc.)
const BORDER_WIDTH_RE = /^border(-[trblxy])?(-[0248]|-\\[.+\\])?$/
// Regex to detect border-STYLE classes
const BORDER_STYLE_RE = /^border-(solid|dashed|dotted|double|hidden|none)$/

// Helper to prefix a single class string
function prefixClassString(classString: string, prefix: string): string {
  const prefixed = classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
      // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
      if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return cls

      // Handle arbitrary variants/selectors like [@media(...)]:min-h-full
      // or [&_[data-icon]]:text-red. This must run before the normal variant
      // regex so the prefix stays on the utility, not on the bracketed variant.
      if (cls.startsWith('[')) {
        // Find the matching closing bracket by tracking depth
        let depth = 0
        let closeBracket = -1
        for (let i = 0; i < cls.length; i++) {
          if (cls[i] === '[') depth++
          else if (cls[i] === ']') {
            depth--
            if (depth === 0 && cls[i + 1] === ':') {
              closeBracket = i
              break
            }
          }
        }
        if (closeBracket !== -1) {
          const variant = cls.slice(0, closeBracket + 2) // Include ]:
          let utility = cls.slice(closeBracket + 2)
          if (!utility) return cls

          // Handle ! important modifier: [@media(...)]:!p-0 → [@media(...)]:!tw-p-0
          const isImportant = utility.startsWith('!')
          if (isImportant) utility = utility.slice(1)

          if (utility.startsWith('-')) {
            return \`\${variant}\${isImportant ? '!' : ''}-\${prefix}\${utility.slice(1)}\`
          }
          return \`\${variant}\${isImportant ? '!' : ''}\${prefix}\${utility}\`
        }
      }

      // Handle variant prefixes like hover:, focus:, sm:, min-[640px]:,
      // data-[state=open]:, aria-[checked]:, group-[.selector]:, peer-[.selector]:, etc.
      // Pattern breakdown:
      // - Simple variants: hover:, focus:, sm:, lg:, dark:, etc.
      // - Arbitrary value variants: min-[640px]:, max-[900px]:, supports-[display:grid]:
      // - Data/aria variants: data-[state=open]:, aria-[checked]:
      // - Group/peer variants: group-[.toaster]:, peer-[.active]:, group/name-[.class]:
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\\/[a-z][a-z0-9-]*)?:)|([a-z][a-z0-9-]*(\\/[a-z0-9-]+)?-\\[[^\\]]+\\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        let utility = cls.slice(variants.length)
        if (!utility) return cls

        // Handle ! important modifier: hover:!p-0 → hover:!tw-p-0
        const isImportant = utility.startsWith('!')
        if (isImportant) utility = utility.slice(1)

        // Prefix the utility part, keep variants as-is
        if (utility.startsWith('-')) {
          return \`\${variants}\${isImportant ? '!' : ''}-\${prefix}\${utility.slice(1)}\`
        }
        return \`\${variants}\${isImportant ? '!' : ''}\${prefix}\${utility}\`
      }

      // Handle ! important modifier: !p-0 → !tw-p-0
      if (cls.startsWith('!') && cls.length > 1) {
        const rest = cls.slice(1)
        if (rest.startsWith('-') && rest.length > 1) {
          return \`!-\${prefix}\${rest.slice(1)}\`
        }
        return \`!\${prefix}\${rest}\`
      }

      // Handle negative values like -mt-4
      if (cls.startsWith('-') && cls.length > 1) {
        return \`-\${prefix}\${cls.slice(1)}\`
      }

      // Regular class (including arbitrary values like bg-[#343E55])
      return \`\${prefix}\${cls}\`
    })

  // Auto-inject border-solid when border-width classes are present without an explicit border-style.
  // Without Tailwind Preflight, the host app may not set border-style: solid on *, so
  // border-width alone (e.g. tw-border) would render nothing. Adding tw-border-solid makes
  // the border visible regardless of the host CSS environment.
  // Skip injection when the only border-width classes are zero-width (border-0, border-t-0, etc.)
  // since those explicitly remove borders and don't need a style.
  const origClasses = classString.split(' ')
  const BORDER_ZERO_RE = /^border(-[trblxy])?-0$/
  const hasNonZeroBorderWidth = origClasses.some((c: string) => BORDER_WIDTH_RE.test(c) && !BORDER_ZERO_RE.test(c))
  const hasBorderStyle = origClasses.some((c: string) => BORDER_STYLE_RE.test(c))
  if (hasNonZeroBorderWidth && !hasBorderStyle) {
    prefixed.push(\`\${prefix}border-solid\`)
  }

  return prefixed.join(' ')
}

// Context-aware Tailwind class prefixing
function prefixTailwindClasses(content: string, prefix: string): string {
  // Always transform semantic classes to CSS variable syntax with fallbacks
  // This ensures backward compatibility regardless of prefix
  content = transformSemanticClassesInContent(content)

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
    // Skip nested cn() calls that fall inside an already-processed outer cn()
    if (cnMatch.index < lastIndex) continue

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

  // 4. Handle variant values in cva config objects / classname lookup maps
  // Pattern: key: "class string" or key: 'class string' within variants/defaultVariants
  // objects, but also classname-lookup maps like \`{ xs: "size-2 border" }\` that
  // components use for variant-to-class mapping outside of cva().

  // Skip keys that are definitely not class values (HTML attributes + CSS style properties)
  // IMPORTANT: Only include camelCase CSS properties that CANNOT be CVA variant names.
  // Ambiguous simple keys (position, display, visibility, etc.) are guarded via
  // \`cssKeywordValues\` below instead, because they overlap with common CVA variants.
  const nonClassKeys = [
    // HTML attributes
    'name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy',
    // Library/API option values, not class values
    'placement', 'strategy', 'floatingStrategy',
    // CSS style properties (camelCase — safe because they can't be CVA variant keys)
    'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'letterSpacing',
    'backgroundColor', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius',
    'zIndex', 'overflow', 'overflowX', 'overflowY', 'userSelect',
    'transitionDuration', 'transitionProperty',
    'boxShadow', 'textShadow', 'outlineOffset',
    'rowGap', 'columnGap', 'gridTemplateColumns', 'gridTemplateRows',
    'flexBasis', 'flexGrow', 'flexShrink', 'flexDirection', 'flexWrap',
    'alignItems', 'alignSelf', 'justifyContent', 'justifyItems',
    'textAlign', 'textDecoration', 'textTransform', 'whiteSpace', 'wordBreak', 'wordSpacing',
    'aspectRatio', 'scrollbarWidth', 'scrollBehavior',
    'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'strokeWidth', 'strokeDasharray', 'strokeDashoffset',
  ]

  // CSS style-object entries whose keys collide with common CVA variant names
  // (so they can't go in \`nonClassKeys\`) but whose values are reserved CSS
  // keywords, not Tailwind classes. When we see one of these pairs, the context
  // is unambiguously a React.CSSProperties entry, and prefixing would produce
  // invalid values like \`position: "tw-absolute"\` that TypeScript rejects.
  //
  // Only values that happen to also be single-word Tailwind utilities need
  // guarding (that's what creates the ambiguity in the first place).
  const cssKeywordValues: Record<string, string[]> = {
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky', 'inherit', 'initial', 'unset', 'revert'],
    display: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'inline-table', 'table-row', 'table-cell', 'table-caption', 'contents', 'flow-root', 'list-item', 'none', 'inherit', 'initial', 'unset'],
    visibility: ['visible', 'hidden', 'collapse', 'inherit', 'initial', 'unset'],
  }

  function isCSSStyleObjectEntry(key: string, value: string): boolean {
    const keywords = cssKeywordValues[key]
    if (!keywords) return false
    return keywords.includes(value.trim())
  }

  // Handle double-quoted values
  content = content.replace(
    /(\\w+|"[^"]+"):\\s*"([^"\\n]+)"/g,
    (match: string, key: string, value: string) => {
      const cleanKey = key.replace(/"/g, '')
      if (nonClassKeys.includes(cleanKey)) return match
      // Guard against CSS style-object entries (e.g. position: "absolute",
      // display: "flex", visibility: "hidden") that would otherwise be treated
      // as Tailwind single-word utilities.
      if (isCSSStyleObjectEntry(cleanKey, value)) return match
      if (!looksLikeTailwindClasses(value)) return match
      const prefixed = prefixClassString(value, prefix)
      return \`\${key}: "\${prefixed}"\`
    }
  )

  // Handle single-quoted values
  content = content.replace(
    /(\\w+|'[^']+'):\\s*'([^'\\n]+)'/g,
    (match: string, key: string, value: string) => {
      const cleanKey = key.replace(/'/g, '')
      if (nonClassKeys.includes(cleanKey)) return match
      if (isCSSStyleObjectEntry(cleanKey, value)) return match
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

  // Inject Pattern 6 (className={...} expression handling) from prefix-utils.ts
  // Use function replacement to prevent $ pattern interpretation in String.replace
  // IMPORTANT: Target the LAST 'return content\n}' (in prefixTailwindClasses),
  // NOT the first one (in transformSemanticClassesInContent)
  if (PATTERN_6_CODE) {
    // Use a unique anchor from the end of Pattern 5 to avoid matching the wrong function
    const anchor = `  )\n\n  return content\n}`
    const anchorIndex = code.lastIndexOf(anchor)
    if (anchorIndex !== -1) {
      const insertPos = anchorIndex + '  )\n\n'.length
      code =
        code.slice(0, insertPos) +
        PATTERN_6_CODE +
        '\n\n  return content\n}' +
        code.slice(anchorIndex + anchor.length)
    }
  }

  // Append helper functions extracted from prefix-utils.ts
  if (HELPER_FUNCTIONS) {
    code += '\n\n' + HELPER_FUNCTIONS
  }

  return code
}

/**
 * Generate a category registry file
 */
function generateCategoryFile(category, components) {
  const componentEntries = components
    .map((comp) => {
      const deps = JSON.stringify(comp.dependencies, null, 6).replace(
        /\n/g,
        '\n      '
      )

      if (comp.isMultiFile) {
        const internalDeps = JSON.stringify(
          comp.internalDependencies || [],
          null,
          6
        ).replace(/\n/g, '\n      ')
        const filesArray = comp.files
          .map((file) => {
            const escapedContent = escapeForTemplate(file.content)
            return `        {
          name: ${JSON.stringify(file.name)},
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        }`
          })
          .join(',\n')

        const groupLine = comp.group
          ? `\n      group: ${JSON.stringify(comp.group)},`
          : ''
        const templateOnlyLine = comp.templateOnly
          ? `\n      templateOnly: true,`
          : ''
        return `    ${JSON.stringify(comp.name)}: {
      name: ${JSON.stringify(comp.name)},
      description: ${JSON.stringify(comp.description)},
      category: ${JSON.stringify(comp.category)},
      dependencies: ${deps},
      internalDependencies: ${internalDeps},
      isMultiFile: true,
      directory: ${JSON.stringify(comp.directory)},${groupLine}${templateOnlyLine}
      mainFile: ${JSON.stringify(comp.mainFile)},
      files: [
${filesArray}
      ],
    }`
      }

      const escapedContent = escapeForTemplate(comp.content)
      const internalDeps =
        comp.internalDependencies && comp.internalDependencies.length > 0
          ? JSON.stringify(comp.internalDependencies, null, 6).replace(
              /\n/g,
              '\n      '
            )
          : null

      return `    ${JSON.stringify(comp.name)}: {
      name: ${JSON.stringify(comp.name)},
      description: ${JSON.stringify(comp.description)},
      category: ${JSON.stringify(comp.category)},
      dependencies: ${deps},${
        internalDeps
          ? `
      internalDependencies: ${internalDeps},`
          : ''
      }
      files: [
        {
          name: ${JSON.stringify(comp.fileName)},
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        },
      ],
    }`
    })
    .join(',\n')

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
  category: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  group?: string
  mainFile?: string
  templateOnly?: boolean
}

export type Registry = Record<string, ComponentDefinition>

export interface ComponentMeta {
  name: string
  description: string
  dependencies: string[]
  category: string
  internalDependencies?: string[]
  group?: string
}
`
}

/**
 * Generate the index file with metadata and lazy loading
 */
function generateIndexFile(config, components) {
  const categories = Object.keys(config.categories)

  // Generate metadata object
  const metaEntries = components
    .map((comp) => {
      const internalDeps = comp.internalDependencies
        ? JSON.stringify(comp.internalDependencies)
        : '[]'

      return `  ${JSON.stringify(comp.name)}: {
    name: ${JSON.stringify(comp.name)},
    description: ${JSON.stringify(comp.description)},
    dependencies: ${JSON.stringify(comp.dependencies)},
    category: ${JSON.stringify(comp.category)},
    internalDependencies: ${internalDeps},
  }`
    })
    .join(',\n')

  // Generate category imports
  const categoryImports = categories
    .map(
      (cat) =>
        `import { get${capitalize(cat)}Registry } from './registry-${cat}'`
    )
    .join('\n')

  // Generate category getter switch
  const categoryGetters = categories
    .map(
      (cat) => `    case '${cat}': return get${capitalize(cat)}Registry(prefix)`
    )
    .join('\n')

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
  const componentEntries = components
    .map((comp) => {
      const deps = JSON.stringify(comp.dependencies, null, 6).replace(
        /\n/g,
        '\n      '
      )

      if (comp.isMultiFile) {
        const internalDeps = JSON.stringify(
          comp.internalDependencies || [],
          null,
          6
        ).replace(/\n/g, '\n      ')
        const filesArray = comp.files
          .map((file) => {
            const escapedContent = escapeForTemplate(file.content)
            return `        {
          name: ${JSON.stringify(file.name)},
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        }`
          })
          .join(',\n')

        const groupLine = comp.group
          ? `\n      group: ${JSON.stringify(comp.group)},`
          : ''
        const templateOnlyLine = comp.templateOnly
          ? `\n      templateOnly: true,`
          : ''
        return `    ${JSON.stringify(comp.name)}: {
      name: ${JSON.stringify(comp.name)},
      description: ${JSON.stringify(comp.description)},
      category: ${JSON.stringify(comp.category)},
      dependencies: ${deps},
      internalDependencies: ${internalDeps},
      isMultiFile: true,
      directory: ${JSON.stringify(comp.directory)},${groupLine}${templateOnlyLine}
      mainFile: ${JSON.stringify(comp.mainFile)},
      files: [
${filesArray}
      ],
    }`
      }

      const escapedContent = escapeForTemplate(comp.content)
      const internalDeps =
        comp.internalDependencies && comp.internalDependencies.length > 0
          ? JSON.stringify(comp.internalDependencies, null, 6).replace(
              /\n/g,
              '\n      '
            )
          : null

      return `    ${JSON.stringify(comp.name)}: {
      name: ${JSON.stringify(comp.name)},
      description: ${JSON.stringify(comp.description)},
      category: ${JSON.stringify(comp.category)},
      dependencies: ${deps},${
        internalDeps
          ? `
      internalDependencies: ${internalDeps},`
          : ''
      }
      files: [
        {
          name: ${JSON.stringify(comp.fileName)},
          content: prefixTailwindClasses(\`${escapedContent}\`, prefix),
        },
      ],
    }`
    })
    .join(',\n')

  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry

export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  category: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  group?: string
  mainFile?: string
  templateOnly?: boolean
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
  console.log(
    `\nLoaded ${Object.keys(config.components).length} component definitions`
  )
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
  const categoryWrites = Object.entries(grouped).map(
    ([category, categoryComponents]) => {
      if (categoryComponents.length === 0) {
        console.log(`  Skipping empty category: ${category}`)
        return Promise.resolve()
      }

      const content = generateCategoryFile(category, categoryComponents)
      const filePath = path.join(OUTPUT_DIR, `registry-${category}.ts`)
      fs.writeFileSync(filePath, content)
      console.log(
        `✓ Generated: registry-${category}.ts (${categoryComponents.length} components)`
      )
      return Promise.resolve()
    }
  )

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
  console.log(
    `   Categories: ${Object.keys(grouped).filter((c) => grouped[c].length > 0).length}`
  )
}

// Run
main().catch(console.error)
