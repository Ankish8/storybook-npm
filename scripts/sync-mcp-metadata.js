#!/usr/bin/env node

/**
 * Sync component metadata from source components to MCP server.
 * This ensures the MCP server has the latest component information.
 *
 * Usage:
 *   node scripts/sync-mcp-metadata.js          # Check what would be synced
 *   node scripts/sync-mcp-metadata.js --write  # Actually update the metadata file
 *
 * This script:
 * 1. Reads all component files from src/components/ui/
 * 2. Extracts complete source code for each component
 * 3. Uses predefined metadata (props, variants, examples) for known components
 * 4. Auto-generates basic metadata for new/unknown components
 * 5. Writes the updated metadata.ts file to packages/mcp/src/data/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { COMPONENT_META, NPM_ONLY_COMPONENTS } from './component-meta.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const MCP_METADATA_FILE = path.resolve(__dirname, '../packages/mcp/src/data/metadata.ts')

// Check for --write flag
const shouldWrite = process.argv.includes('--write')

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function escapeForTemplate(str) {
  // Escape backticks and ${} for template literals
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function getComponentsFromSource() {
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.'))
  return files.map(file => file.replace('.tsx', ''))
}

function readComponentSource(componentName) {
  const filePath = path.join(COMPONENTS_DIR, `${componentName}.tsx`)
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8')
  }
  return null
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function generateDefaultMetadata(componentName, sourceCode) {
  // Auto-generate basic metadata for components without explicit definitions
  const pascalName = toPascalCase(componentName)

  // Try to detect dependencies from imports
  const dependencies = ['class-variance-authority', 'clsx', 'tailwind-merge']
  if (sourceCode.includes('@radix-ui/react-')) {
    const radixMatch = sourceCode.match(/@radix-ui\/react-[\w-]+/g)
    if (radixMatch) {
      dependencies.unshift(...new Set(radixMatch))
    }
  }
  if (sourceCode.includes('lucide-react')) {
    dependencies.push('lucide-react')
  }

  return {
    name: pascalName,
    description: `A ${componentName.replace(/-/g, ' ')} component.`,
    dependencies,
    props: [],
    variants: [],
    examples: [
      {
        title: `Basic ${pascalName}`,
        code: `<${pascalName}>Content</${pascalName}>`,
        description: `Simple ${componentName.replace(/-/g, ' ')} usage`
      }
    ]
  }
}

// ============================================================================
// MAIN SYNC FUNCTION
// ============================================================================

function syncMetadata() {
  console.log('🔄 Syncing component metadata to MCP server...\n')
  console.log(`Source directory: ${COMPONENTS_DIR}`)
  console.log(`Target file: ${MCP_METADATA_FILE}`)
  console.log(`Mode: ${shouldWrite ? 'WRITE' : 'DRY RUN (use --write to update)'}\n`)

  // Get components from source
  const sourceComponents = getComponentsFromSource()
  console.log(`Found ${sourceComponents.length} components in source:`)
  console.log(`  ${sourceComponents.join(', ')}\n`)

  // Check which components have metadata defined
  const componentsWithMeta = sourceComponents.filter(name => COMPONENT_META[name])
  const componentsMissingMeta = sourceComponents.filter(name => !COMPONENT_META[name] && !NPM_ONLY_COMPONENTS.includes(name))

  if (componentsMissingMeta.length > 0) {
    console.log(`⚠️  ${componentsMissingMeta.length} new components will use auto-generated metadata:`)
    console.log(`  ${componentsMissingMeta.join(', ')}`)
    console.log(`  (Add them to COMPONENT_META in scripts/component-meta.js for better metadata)\n`)
  }

  // Build componentSourceCode entries
  const sourceCodeEntries = []
  const metadataEntries = []
  const processedComponents = []

  for (const name of sourceComponents) {
    if (NPM_ONLY_COMPONENTS.includes(name)) {
      console.log(`⏭️  Skipping ${name} (npm-only component)`)
      continue
    }

    const source = readComponentSource(name)
    if (!source) {
      console.log(`❌ Could not read source for ${name}`)
      continue
    }

    // Get metadata (predefined or auto-generated)
    const meta = COMPONENT_META[name] || generateDefaultMetadata(name, source)

    sourceCodeEntries.push(`  "${name}": \`${escapeForTemplate(source)}\``)
    metadataEntries.push(`  "${name}": ${JSON.stringify(meta, null, 4).replace(/\n/g, '\n  ')}`)
    processedComponents.push(name)
  }

  console.log(`\n✅ Processed ${processedComponents.length} components`)

  if (!shouldWrite) {
    console.log('\n--- DRY RUN ---')
    console.log('Run with --write flag to update the metadata file:')
    console.log('  node scripts/sync-mcp-metadata.js --write')
    return { processedComponents, written: false }
  }

  // Generate the file content
  const content = `import type { ComponentMetadata } from "../types/index.js";

// ============================================================================
// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by: node scripts/sync-mcp-metadata.js --write
// Last updated: ${new Date().toISOString()}
// ============================================================================

// Component source code for copy/paste
export const componentSourceCode: Record<string, string> = {
${sourceCodeEntries.join(',\n\n')}
};

// Utility function source code
export const utilsSourceCode = \`import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}\`;

// CSS styles
export const cssStyles = \`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}\`;

// Component metadata
export const componentMetadata: Record<string, ComponentMetadata> = {
${metadataEntries.join(',\n\n')}
};

export function getComponentNames(): string[] {
  return Object.keys(componentMetadata);
}

export function getComponent(name: string): ComponentMetadata | undefined {
  return componentMetadata[name.toLowerCase()];
}
`

  // Write the file
  fs.writeFileSync(MCP_METADATA_FILE, content, 'utf-8')

  console.log(`\n✅ Updated ${MCP_METADATA_FILE}`)
  console.log(`   - ${sourceCodeEntries.length} components with source code`)
  console.log(`   - ${metadataEntries.length} components with metadata`)
  console.log('\n📦 Remember to rebuild and publish the MCP package:')
  console.log('   cd packages/mcp && npm run build && npm publish')

  return { processedComponents, written: true }
}

// Run sync
syncMetadata()
