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
  },}

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

// Function to prefix Tailwind classes within quoted strings
function prefixTailwindClasses(content: string, prefix: string): string {
  if (!prefix) return content

  // For Tailwind v3, use prefix as-is
  // Note: Tailwind v4 with Bootstrap uses no prefix (selective imports don't support prefix())
  const cleanPrefix = prefix

  // Process content within double-quoted strings that look like CSS classes
  return content.replace(/"([^"]+)"/g, (match, classString) => {
    // Skip import paths (start with @ or . or contain ::)
    if (classString.startsWith('@') || classString.startsWith('.') || classString.includes('::')) {
      return match
    }

    // Skip npm package names (lowercase letters, numbers, hyphens, and @ scopes)
    // These are typically import statements like "class-variance-authority", "lucide-react"
    if (/^(@[a-z0-9-]+\\/)?[a-z][a-z0-9-]*$/.test(classString)) {
      return match
    }

    // Skip simple identifiers (no spaces, hyphens, colons, or brackets - not Tailwind classes)
    if (!classString.includes(' ') && !classString.includes('-') && !classString.includes(':') && !classString.includes('[')) {
      return match
    }

    // Prefix each class
    const prefixedClasses = classString
      .split(' ')
      .map((cls: string) => {
        if (!cls) return cls

        // Handle variant prefixes like hover:, focus:, sm:, etc.
        const variantMatch = cls.match(/^([a-z-]+:)+/)
        if (variantMatch) {
          const variants = variantMatch[0]
          const utility = cls.slice(variants.length)
          // Prefix the utility part, keep variants as-is
          if (utility.startsWith('-')) {
            return \`\${variants}-\${cleanPrefix}\${utility.slice(1)}\`
          }
          return \`\${variants}\${cleanPrefix}\${utility}\`
        }

        // Handle negative values like -mt-4
        if (cls.startsWith('-')) {
          return \`-\${cleanPrefix}\${cls.slice(1)}\`
        }

        // Handle arbitrary selector values like [&_svg]:pointer-events-none
        if (cls.startsWith('[&')) {
          const closeBracket = cls.indexOf(']:')
          if (closeBracket !== -1) {
            const selector = cls.slice(0, closeBracket + 2)
            const utility = cls.slice(closeBracket + 2)
            return \`\${selector}\${cleanPrefix}\${utility}\`
          }
          return cls
        }

        // Regular class (including arbitrary values like bg-[#343E55])
        return \`\${cleanPrefix}\${cls}\`
      })
      .join(' ')

    return \`"\${prefixedClasses}"\`
  })
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
