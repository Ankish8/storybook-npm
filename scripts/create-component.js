#!/usr/bin/env node

/**
 * Component Generator Script
 *
 * Creates a new component with all required files:
 * - Component file (.tsx)
 * - Test file (.test.tsx)
 * - Story file (.stories.tsx)
 * - Updates COMPONENT_META in generate-registry.js
 *
 * Usage: node scripts/create-component.js <component-name> [description]
 * Example: node scripts/create-component.js avatar "A circular avatar component for displaying user images"
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui')
const TESTS_DIR = path.resolve(__dirname, '../src/components/ui/__tests__')
const REGISTRY_SCRIPT = path.resolve(__dirname, '../packages/cli/scripts/generate-registry.js')

// Parse arguments
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/create-component.js <component-name> [description]')
  console.error('Example: node scripts/create-component.js avatar "A circular avatar component"')
  process.exit(1)
}

const componentName = args[0].toLowerCase()
const description = args[1] || `A ${componentName} component`

// Validate component name
if (!/^[a-z][a-z0-9-]*$/.test(componentName)) {
  console.error('Error: Component name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens')
  process.exit(1)
}

// Convert to different cases
const pascalCase = componentName
  .split('-')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')
const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1)

// Check if component already exists
const componentFile = path.join(COMPONENTS_DIR, `${componentName}.tsx`)
if (fs.existsSync(componentFile)) {
  console.error(`Error: Component "${componentName}" already exists at ${componentFile}`)
  process.exit(1)
}

// Generate component file
const componentTemplate = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * ${pascalCase} variants
 */
const ${camelCase}Variants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#333333]",
        primary: "bg-[#343E55] text-white",
        secondary: "bg-[#E5E7EB] text-[#374151]",
      },
      size: {
        default: "px-3 py-1.5",
        sm: "px-2 py-1 text-sm",
        lg: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * ${description}
 *
 * @example
 * \`\`\`tsx
 * <${pascalCase} variant="default">Content</${pascalCase}>
 * <${pascalCase} variant="primary" size="lg">Large Primary</${pascalCase}>
 * \`\`\`
 */
export interface ${pascalCase}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${camelCase}Variants> {}

const ${pascalCase} = React.forwardRef<HTMLDivElement, ${pascalCase}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${camelCase}Variants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
${pascalCase}.displayName = "${pascalCase}"

export { ${pascalCase}, ${camelCase}Variants }
`

// Generate test file
const testTemplate = `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${pascalCase} } from '../${componentName}'

describe('${pascalCase}', () => {
  it('renders children correctly', () => {
    render(<${pascalCase}>Test Content</${pascalCase}>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<${pascalCase} data-testid="${componentName}">Default</${pascalCase}>)
    const element = screen.getByTestId('${componentName}')
    expect(element).toHaveClass('bg-[#F3F4F6]')
    expect(element).toHaveClass('text-[#333333]')
  })

  it.each([
    ['default', 'bg-[#F3F4F6]', 'text-[#333333]'],
    ['primary', 'bg-[#343E55]', 'text-white'],
    ['secondary', 'bg-[#E5E7EB]', 'text-[#374151]'],
  ] as const)('renders %s variant', (variant, bgClass, textClass) => {
    render(<${pascalCase} variant={variant} data-testid="${componentName}">Test</${pascalCase}>)
    const element = screen.getByTestId('${componentName}')
    expect(element).toHaveClass(bgClass)
    expect(element).toHaveClass(textClass)
  })

  it.each([
    ['default', 'px-3', 'py-1.5'],
    ['sm', 'px-2', 'py-1'],
    ['lg', 'px-4', 'py-2'],
  ] as const)('renders %s size', (size, paddingX, paddingY) => {
    render(<${pascalCase} size={size} data-testid="${componentName}">Test</${pascalCase}>)
    const element = screen.getByTestId('${componentName}')
    expect(element).toHaveClass(paddingX)
    expect(element).toHaveClass(paddingY)
  })

  it('applies custom className', () => {
    render(<${pascalCase} className="custom-class" data-testid="${componentName}">Test</${pascalCase}>)
    expect(screen.getByTestId('${componentName}')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${pascalCase} ref={ref}>Test</${pascalCase}>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('spreads additional props', () => {
    render(<${pascalCase} data-testid="${componentName}" aria-label="test label">Test</${pascalCase}>)
    expect(screen.getByTestId('${componentName}')).toHaveAttribute('aria-label', 'test label')
  })

  // Type compatibility tests - TypeScript will catch mismatches between CVA and props
  describe('Type Compatibility', () => {
    it('variant prop is correctly typed from CVA', () => {
      // This test ensures CVA variant keys match props interface
      // If CVA defines variant but props doesn't include it, TypeScript will error
      render(<${pascalCase} variant="default">Type Check</${pascalCase}>)
      expect(screen.getByText('Type Check')).toBeInTheDocument()
    })

    it('size prop is correctly typed from CVA', () => {
      // This test ensures CVA size keys match props interface
      render(<${pascalCase} size="default">Type Check</${pascalCase}>)
      expect(screen.getByText('Type Check')).toBeInTheDocument()
    })

    it('accepts combined variant and size props', () => {
      render(<${pascalCase} variant="primary" size="lg">Combined</${pascalCase}>)
      expect(screen.getByText('Combined')).toBeInTheDocument()
    })
  })
})
`

// Generate story file
const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react'
import { ${pascalCase} } from './${componentName}'

const meta: Meta<typeof ${pascalCase}> = {
  title: 'Components/${pascalCase}',
  component: ${pascalCase},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the component',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '${pascalCase}',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary ${pascalCase}',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary ${pascalCase}',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small ${pascalCase}',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large ${pascalCase}',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <${pascalCase} variant="default">Default</${pascalCase}>
        <${pascalCase} variant="primary">Primary</${pascalCase}>
        <${pascalCase} variant="secondary">Secondary</${pascalCase}>
      </div>
      <div className="flex gap-2 items-center">
        <${pascalCase} size="sm">Small</${pascalCase}>
        <${pascalCase} size="default">Default</${pascalCase}>
        <${pascalCase} size="lg">Large</${pascalCase}>
      </div>
    </div>
  ),
}
`

// Generate component metadata for registry
const metaEntry = `  '${componentName}': {
    description: '${description}',
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },`

console.log(`\nCreating component: ${pascalCase}`)
console.log('=' .repeat(50))

// Create component file
fs.writeFileSync(componentFile, componentTemplate)
console.log(`✓ Created: src/components/ui/${componentName}.tsx`)

// Create test file
const testFile = path.join(TESTS_DIR, `${componentName}.test.tsx`)
fs.writeFileSync(testFile, testTemplate)
console.log(`✓ Created: src/components/ui/__tests__/${componentName}.test.tsx`)

// Create story file
const storyFile = path.join(COMPONENTS_DIR, `${componentName}.stories.tsx`)
fs.writeFileSync(storyFile, storyTemplate)
console.log(`✓ Created: src/components/ui/${componentName}.stories.tsx`)

// Update generate-registry.js with new component metadata
try {
  let registryScript = fs.readFileSync(REGISTRY_SCRIPT, 'utf-8')

  // Find the COMPONENT_META object and add the new entry
  const metaEndMatch = registryScript.match(/('dropdown-menu':\s*\{[^}]+\},?\s*)\}/)
  if (metaEndMatch) {
    const insertPosition = registryScript.indexOf(metaEndMatch[1]) + metaEndMatch[1].length
    registryScript =
      registryScript.slice(0, insertPosition) +
      '\n' + metaEntry +
      registryScript.slice(insertPosition)

    fs.writeFileSync(REGISTRY_SCRIPT, registryScript)
    console.log(`✓ Updated: packages/cli/scripts/generate-registry.js`)
  } else {
    console.log(`⚠ Could not auto-update generate-registry.js. Please add manually:`)
    console.log(metaEntry)
  }
} catch (error) {
  console.log(`⚠ Could not update generate-registry.js: ${error.message}`)
  console.log(`  Please add this entry to COMPONENT_META manually:`)
  console.log(metaEntry)
}

console.log('\n' + '=' .repeat(50))
console.log('Next steps:')
console.log('1. Customize the component in src/components/ui/${componentName}.tsx')
console.log('2. Update tests to match your component behavior')
console.log('3. Update stories with relevant examples')
console.log('4. Run: cd packages/cli && npm run generate-registry')
console.log('5. Run: npm test (to verify tests pass)')
console.log('')
