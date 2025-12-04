#!/usr/bin/env node

/**
 * This script generates the registry.ts file from the source component files.
 * It ensures the CLI always has the latest component code from the main package.
 *
 * Run: node scripts/generate-registry.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to the source components (relative to this script)
const COMPONENTS_DIR = path.resolve(__dirname, '../../../src/components/ui')
const OUTPUT_FILE = path.resolve(__dirname, '../src/utils/registry.ts')

// Component metadata - dependencies and descriptions
const COMPONENT_META = {
  button: {
    description: 'A customizable button component with variants, sizes, and icons',
    dependencies: [
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
  },
  badge: {
    description: 'A status badge component with active, failed, and disabled variants',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  tag: {
    description: 'A tag component for event labels with optional bold label prefix',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  table: {
    description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  'dropdown-menu': {
    description: 'A dropdown menu component for displaying actions and options',
    dependencies: [
      '@radix-ui/react-dropdown-menu',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
  },

  'toggle': {
    description: 'A toggle/switch component for boolean inputs with on/off states',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  'checkbox': {
    description: 'A tri-state checkbox component with label support (checked, unchecked, indeterminate)',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
  },
  'collapsible': {
    description: 'An expandable/collapsible section component with single or multiple mode support',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
  },
}

function generateRegistry() {
  console.log('Generating registry from source components...')
  console.log(`Source directory: ${COMPONENTS_DIR}`)

  // Check if components directory exists
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Error: Components directory not found: ${COMPONENTS_DIR}`)
    process.exit(1)
  }

  // Get all component files (exclude stories and test files)
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.'))

  console.log(`Found ${files.length} component files:`, files)

  // Read component contents
  const components = {}
  for (const file of files) {
    const componentName = file.replace('.tsx', '')
    const filePath = path.join(COMPONENTS_DIR, file)
    let content = fs.readFileSync(filePath, 'utf-8')

    // Transform @/lib/utils import to relative path for installed components
    content = content.replace(
      /import\s*{\s*cn\s*}\s*from\s*["']@\/lib\/utils["']/g,
      'import { cn } from "../../lib/utils"'
    )

    // Get metadata or use defaults
    const meta = COMPONENT_META[componentName] || {
      description: `${componentName} component`,
      dependencies: ['clsx', 'tailwind-merge'],
    }

    components[componentName] = {
      name: componentName,
      fileName: file,
      content,
      ...meta,
    }
  }

  // Generate the registry.ts file
  const registryContent = generateRegistryFile(components)

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write the registry file
  fs.writeFileSync(OUTPUT_FILE, registryContent)
  console.log(`✓ Registry generated: ${OUTPUT_FILE}`)
  console.log(`  Components: ${Object.keys(components).join(', ')}`)
}

function generateRegistryFile(components) {
  // Escape backticks and ${} in component content for template literals
  const escapeForTemplate = (str) => {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  }

  const componentEntries = Object.entries(components).map(([name, comp]) => {
    const escapedContent = escapeForTemplate(comp.content)
    const deps = JSON.stringify(comp.dependencies, null, 6).replace(/\n/g, '\n      ')

    return `    '${name}': {
      name: '${name}',
      description: '${comp.description}',
      dependencies: ${deps},
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
}

export type Registry = Record<string, ComponentDefinition>

// Helper to check if a string looks like Tailwind CSS classes
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

  // Skip npm package names
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

      // Handle variant prefixes like hover:, focus:, sm:, etc.
      const variantMatch = cls.match(/^([a-z][a-z0-9]*(-[a-z0-9]+)*:)+/)
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

  // 2. Handle cn() function calls: cn("classes", "more classes", ...)
  content = content.replace(
    /\\bcn\\s*\\(([^)]+)\\)/g,
    (match: string, args: string) => {
      const prefixedArgs = args.replace(
        /"([^"]*)"/g,
        (m: string, classes: string) => {
          if (!looksLikeTailwindClasses(classes)) return m
          const prefixed = prefixClassString(classes, prefix)
          return \`"\${prefixed}"\`
        }
      )
      return \`cn(\${prefixedArgs})\`
    }
  )

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
  // Pattern: key: "class string" within variants/defaultVariants objects
  // But be careful not to match non-class string values
  content = content.replace(
    /(\\w+):\\s*"([^"]+)"/g,
    (match: string, key: string, value: string) => {
      // Skip keys that are definitely not class values
      const nonClassKeys = ['name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy']
      if (nonClassKeys.includes(key)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return \`\${key}: "\${prefixed}"\`
    }
  )

  return content
}

// In a real implementation, this would fetch from a remote URL
// For now, we'll embed the components directly
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  return {
${componentEntries}
  }
}
`
}

// Run the generator
generateRegistry()
