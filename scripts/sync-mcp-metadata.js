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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const MCP_METADATA_FILE = path.resolve(__dirname, '../packages/mcp/src/data/metadata.ts')

// Check for --write flag
const shouldWrite = process.argv.includes('--write')

// ============================================================================
// COMPONENT METADATA DEFINITIONS
// Add new components here with their metadata. The source code is auto-extracted.
// ============================================================================

const COMPONENT_META = {
  button: {
    name: 'Button',
    description: 'A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.',
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', required: false, description: 'The visual style of the button', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg" | "icon"', required: false, description: 'The size of the button', defaultValue: 'default' },
      { name: 'asChild', type: 'boolean', required: false, description: 'Render as child element using Radix Slot', defaultValue: 'false' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left side of the button text' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right side of the button text' },
      { name: 'loading', type: 'boolean', required: false, description: 'Shows loading spinner and disables button', defaultValue: 'false' },
      { name: 'loadingText', type: 'string', required: false, description: 'Text shown during loading state' },
    ],
    variants: [
      { name: 'variant', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg', 'icon'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Button', code: '<Button>Click me</Button>', description: 'Simple button with default styling' },
      { title: 'Button with Icons', code: 'import { Mail } from "lucide-react"\n\n<Button leftIcon={<Mail />}>Send Email</Button>', description: 'Buttons with left or right icons' },
      { title: 'Loading State', code: '<Button loading loadingText="Saving...">Save</Button>', description: 'Button with loading spinner' },
    ],
  },

  badge: {
    name: 'Badge',
    description: 'A status badge component with active, failed, and disabled variants. Pill-shaped badges with different colors for different states.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'variant', type: '"active" | "failed" | "disabled" | "default"', required: false, description: 'The visual style of the badge', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the badge', defaultValue: 'default' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left side' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right side' },
    ],
    variants: [
      { name: 'variant', options: ['active', 'failed', 'disabled', 'default'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Status Badges', code: '<Badge variant="active">Active</Badge>\n<Badge variant="failed">Failed</Badge>', description: 'Badges for different status states' },
    ],
  },

  tag: {
    name: 'Tag',
    description: 'A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'variant', type: '"default" | "primary" | "secondary" | "success" | "warning" | "error"', required: false, description: 'The visual style of the tag', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the tag', defaultValue: 'default' },
      { name: 'label', type: 'string', required: false, description: 'Bold label prefix displayed before the content' },
      { name: 'interactive', type: 'boolean', required: false, description: 'Make the tag clickable', defaultValue: 'false' },
      { name: 'selected', type: 'boolean', required: false, description: 'Show selected state', defaultValue: 'false' },
    ],
    variants: [
      { name: 'variant', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Tags', code: '<Tag>Category</Tag>\n<Tag variant="success">Success</Tag>', description: 'Simple tag labels' },
      { title: 'Tag with Label', code: '<Tag label="Status:">Active</Tag>', description: 'Tags with bold label prefix' },
    ],
  },

  table: {
    name: 'Table',
    description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'size', type: '"sm" | "md" | "lg"', required: false, description: 'The row height of the table', defaultValue: 'md' },
      { name: 'withoutBorder', type: 'boolean', required: false, description: 'Remove outer border from the table', defaultValue: 'false' },
    ],
    variants: [
      { name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    ],
    examples: [
      { title: 'Basic Table', code: '<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>John Doe</TableCell>\n      <TableCell><Badge variant="active">Active</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>', description: 'Simple table with header and body' },
    ],
  },

  'dropdown-menu': {
    name: 'DropdownMenu',
    description: 'A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.',
    dependencies: ['@radix-ui/react-dropdown-menu', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [],
    variants: [],
    examples: [
      { title: 'Basic Dropdown', code: '<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button variant="outline">Open Menu</Button>\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Profile</DropdownMenuItem>\n    <DropdownMenuItem>Settings</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Logout</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>', description: 'Simple dropdown with menu items' },
    ],
  },

  input: {
    name: 'Input',
    description: 'A flexible input component for text entry with state variants. Supports default and error states.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'state', type: '"default" | "error"', required: false, description: 'The visual state of the input', defaultValue: 'default' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Input', code: '<Input placeholder="Enter your email" />', description: 'Simple input with placeholder' },
    ],
  },

  'text-field': {
    name: 'TextField',
    description: 'A comprehensive text field component with label, icons, prefix/suffix, validation states, character count, and loading state.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the input' },
      { name: 'required', type: 'boolean', required: false, description: 'Shows red asterisk next to label', defaultValue: 'false' },
      { name: 'helperText', type: 'string', required: false, description: 'Helper text displayed below the input' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right' },
      { name: 'prefix', type: 'string', required: false, description: 'Text prefix inside input' },
      { name: 'suffix', type: 'string', required: false, description: 'Text suffix inside input' },
      { name: 'showCount', type: 'boolean', required: false, description: 'Shows character count when maxLength is set', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', required: false, description: 'Shows loading spinner', defaultValue: 'false' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic TextField', code: '<TextField label="Email" placeholder="Enter your email" required />', description: 'Text field with label and required indicator' },
      { title: 'TextField with Error', code: '<TextField label="Username" error="Username is already taken" />', description: 'Text field showing error state' },
    ],
  },

  select: {
    name: 'Select',
    description: 'A composable select dropdown built with Radix UI primitives. Includes SelectTrigger, SelectContent, SelectItem, and more sub-components.',
    dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Select', code: '<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="Select an option" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="option1">Option 1</SelectItem>\n    <SelectItem value="option2">Option 2</SelectItem>\n  </SelectContent>\n</Select>', description: 'Simple select dropdown' },
    ],
  },

  'select-field': {
    name: 'SelectField',
    description: 'A form-ready select component with label, helper text, error handling, and grouped options support.',
    dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the select' },
      { name: 'required', type: 'boolean', required: false, description: 'Shows red asterisk next to label', defaultValue: 'false' },
      { name: 'options', type: 'SelectOption[]', required: true, description: 'Array of options with value, label, disabled, and group properties' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
      { name: 'helperText', type: 'string', required: false, description: 'Helper text displayed below the select' },
      { name: 'searchable', type: 'boolean', required: false, description: 'Enable search/filter functionality', defaultValue: 'false' },
    ],
    variants: [],
    examples: [
      { title: 'Basic SelectField', code: '<SelectField\n  label="Country"\n  placeholder="Select a country"\n  options={[\n    { value: \'us\', label: \'United States\' },\n    { value: \'uk\', label: \'United Kingdom\' },\n  ]}\n  required\n/>', description: 'Select field with label and options' },
    ],
  },

  'multi-select': {
    name: 'MultiSelect',
    description: 'A multi-select component with tags display, search functionality, and validation states. Supports maximum selection limits.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the select' },
      { name: 'options', type: 'MultiSelectOption[]', required: true, description: 'Array of options with value, label, and disabled properties' },
      { name: 'value', type: 'string[]', required: false, description: 'Currently selected values (controlled)' },
      { name: 'onValueChange', type: '(value: string[]) => void', required: false, description: 'Callback when values change' },
      { name: 'searchable', type: 'boolean', required: false, description: 'Enable search/filter functionality', defaultValue: 'false' },
      { name: 'maxSelections', type: 'number', required: false, description: 'Maximum number of selections allowed' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic MultiSelect', code: '<MultiSelect\n  label="Skills"\n  placeholder="Select skills"\n  options={[\n    { value: \'react\', label: \'React\' },\n    { value: \'vue\', label: \'Vue\' },\n  ]}\n  onValueChange={(values) => console.log(values)}\n/>', description: 'Multi-select with tag display' },
    ],
  },

  checkbox: {
    name: 'Checkbox',
    description: 'A tri-state checkbox component with label support. Supports checked, unchecked, and indeterminate states.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the checkbox', defaultValue: 'default' },
      { name: 'checked', type: 'boolean | "indeterminate"', required: false, description: 'Whether the checkbox is checked' },
      { name: 'onCheckedChange', type: '(checked: CheckedState) => void', required: false, description: 'Callback when checked state changes' },
      { name: 'label', type: 'string', required: false, description: 'Optional label text' },
      { name: 'labelPosition', type: '"left" | "right"', required: false, description: 'Position of the label', defaultValue: 'right' },
    ],
    variants: [
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Checkbox', code: '<Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />', description: 'Simple controlled checkbox' },
      { title: 'Checkbox with Label', code: '<Checkbox label="Accept terms and conditions" />', description: 'Checkbox with label' },
    ],
  },

  toggle: {
    name: 'Toggle',
    description: 'A toggle/switch component for boolean inputs with on/off states. Supports labels and multiple sizes.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the toggle', defaultValue: 'default' },
      { name: 'checked', type: 'boolean', required: false, description: 'Whether the toggle is on' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: 'Callback when checked state changes' },
      { name: 'label', type: 'string', required: false, description: 'Optional label text' },
      { name: 'labelPosition', type: '"left" | "right"', required: false, description: 'Position of the label', defaultValue: 'right' },
    ],
    variants: [
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Toggle', code: '<Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />', description: 'Simple controlled toggle' },
      { title: 'Toggle with Label', code: '<Toggle label="Enable notifications" />', description: 'Toggle with label' },
    ],
  },

  collapsible: {
    name: 'Collapsible',
    description: 'An expandable/collapsible section component with single or multiple mode support.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'type', type: '"single" | "multiple"', required: false, description: 'Whether only one item can be open at a time', defaultValue: 'multiple' },
      { name: 'variant', type: '"default" | "bordered"', required: false, description: 'Visual variant of the collapsible', defaultValue: 'default' },
      { name: 'value', type: 'string[]', required: false, description: 'Controlled value - array of open item values' },
      { name: 'defaultValue', type: 'string[]', required: false, description: 'Default open items for uncontrolled usage' },
    ],
    variants: [
      { name: 'type', options: ['single', 'multiple'], defaultValue: 'multiple' },
      { name: 'variant', options: ['default', 'bordered'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Collapsible', code: '<Collapsible>\n  <CollapsibleItem value="item-1">\n    <CollapsibleTrigger>Section 1</CollapsibleTrigger>\n    <CollapsibleContent>Content for section 1</CollapsibleContent>\n  </CollapsibleItem>\n</Collapsible>', description: 'Basic collapsible with sections' },
    ],
  },
}

// Components that are NOT available via CLI (only via npm import)
const NPM_ONLY_COMPONENTS = ['event-selector', 'key-value-input']

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
    console.log(`  (Add them to COMPONENT_META in this script for better metadata)\n`)
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
