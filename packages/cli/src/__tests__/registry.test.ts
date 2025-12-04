import { describe, it, expect } from 'vitest'
import { getRegistry } from '../utils/registry.js'

describe('Registry', () => {
  describe('getRegistry', () => {
  it('returns all expected components', async () => {
    const registry = await getRegistry()
    const components = Object.keys(registry)

    expect(components).toContain('button')
    expect(components).toContain('badge')
    expect(components).toContain('tag')
    expect(components).toContain('table')
    expect(components).toContain('dropdown-menu')
  })

  it('each component has required fields', async () => {
    const registry = await getRegistry()

    for (const [name, component] of Object.entries(registry)) {
      // Check name matches key
      expect(component.name).toBe(name)

      // Check description exists
      expect(component.description).toBeTruthy()
      expect(typeof component.description).toBe('string')

      // Check dependencies
      expect(component.dependencies).toBeInstanceOf(Array)
      expect(component.dependencies.length).toBeGreaterThan(0)

      // Check files
      expect(component.files).toBeInstanceOf(Array)
      expect(component.files.length).toBeGreaterThan(0)

      // Check file structure
      for (const file of component.files) {
        expect(file.name).toMatch(/\.tsx$/)
        expect(file.content).toBeTruthy()
        expect(typeof file.content).toBe('string')
      }
    }
  })

  it('component content has valid structure', async () => {
    const registry = await getRegistry()

    for (const component of Object.values(registry)) {
      const content = component.files[0].content

      // Should have imports
      expect(content).toContain('import')

      // Should have exports
      expect(content).toContain('export')

      // Should import cn utility (transformed path)
      expect(content).toContain('../../lib/utils')

      // Should not have Tailwind v4 syntax
      expect(content).not.toContain('@theme')
      expect(content).not.toContain('@source')
    }
  })

  it('dependencies are valid packages', async () => {
    const registry = await getRegistry()
    const validDeps = [
      '@radix-ui/react-slot',
      '@radix-ui/react-dropdown-menu',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ]

    for (const component of Object.values(registry)) {
      for (const dep of component.dependencies) {
        expect(validDeps).toContain(dep)
      }
    }
  })

  it('does not include tailwindcss as dependency', async () => {
    const registry = await getRegistry()

    for (const component of Object.values(registry)) {
      expect(component.dependencies).not.toContain('tailwindcss')
      expect(component.dependencies).not.toContain('tailwindcss-animate')
    }
  })

  it('button component has correct dependencies', async () => {
    const registry = await getRegistry()
    const button = registry.button

    expect(button.dependencies).toContain('@radix-ui/react-slot')
    expect(button.dependencies).toContain('class-variance-authority')
    expect(button.dependencies).toContain('lucide-react')
  })

  it('dropdown-menu component has radix dependency', async () => {
    const registry = await getRegistry()
    const dropdown = registry['dropdown-menu']

    expect(dropdown.dependencies).toContain('@radix-ui/react-dropdown-menu')
  })

  it('prefix function works correctly', async () => {
    const registry = await getRegistry('tw-')

    for (const component of Object.values(registry)) {
      const content = component.files[0].content

      // Classes should be prefixed (this is a basic check)
      // The actual prefixing logic is tested separately
      expect(content).toBeTruthy()
    }
  })
  })

  describe('prefixTailwindClasses', () => {
    it('prefixes basic utility classes', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Check that basic classes are prefixed
      expect(content).toContain('tw-inline-flex')
      expect(content).toContain('tw-items-center')
      expect(content).toContain('tw-text-white')
    })

    it('prefixes classes with arbitrary values', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Check that arbitrary value classes are prefixed
      expect(content).toContain('tw-bg-[#343E55]')
    })

    it('prefixes variant classes correctly', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Check that hover: prefix is preserved and utility is prefixed
      expect(content).toContain('hover:tw-bg-[#343E55]/90')
    })

    it('preserves import paths without prefixing', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Import paths should not be prefixed
      expect(content).toContain('"@radix-ui/react-slot"')
      expect(content).toContain('"class-variance-authority"')
      expect(content).toContain('"lucide-react"')
      expect(content).toContain('"../../lib/utils"')

      // Should NOT have prefixed import paths
      expect(content).not.toContain('tw-@radix-ui')
      expect(content).not.toContain('tw-class-variance-authority')
    })

    it('handles focus-visible and other complex variants', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Check complex variant handling
      expect(content).toContain('focus-visible:tw-outline-none')
      expect(content).toContain('focus-visible:tw-ring-2')
    })

    it('handles disabled state classes', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Check disabled variant handling
      expect(content).toContain('disabled:tw-pointer-events-none')
      expect(content).toContain('disabled:tw-opacity-50')
    })

    it('handles arbitrary selector classes like [&_svg]', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Arbitrary selectors should have utility part prefixed
      expect(content).toContain('[&_svg]:tw-pointer-events-none')
      expect(content).toContain('[&_svg]:tw-size-4')
    })

    it('handles data attribute selectors', async () => {
      const registry = await getRegistry('tw-')
      const dropdown = registry['dropdown-menu']
      const content = dropdown.files[0].content

      // Data attribute classes should be handled (prefix is added before data-)
      expect(content).toContain('tw-data-[state=open]:animate-in')
      expect(content).toContain('tw-data-[disabled]:pointer-events-none')
    })

    it('returns unprefixed content when no prefix provided', async () => {
      const registry = await getRegistry('')
      const button = registry.button
      const content = button.files[0].content

      // Without prefix, classes should be normal
      expect(content).toContain('"inline-flex')
      expect(content).not.toContain('tw-inline-flex')
    })

    it('handles negative value classes', async () => {
      const registry = await getRegistry('tw-')
      const dropdown = registry['dropdown-menu']
      const content = dropdown.files[0].content

      // Negative values like -mx-1 should become -tw-mx-1
      expect(content).toContain('-tw-mx-1')
    })

    it('preserves simple string identifiers', async () => {
      const registry = await getRegistry('tw-')
      const table = registry.table
      const content = table.files[0].content

      // Simple identifiers like "Table" in displayName should not be prefixed
      expect(content).toContain('displayName = "Table"')
      expect(content).not.toContain('displayName = "tw-Table"')
    })

    it('does NOT prefix HTML attribute values like type="button"', async () => {
      const registry = await getRegistry('tw-')
      const toggle = registry.toggle
      const content = toggle.files[0].content

      // HTML type attributes should NOT be prefixed
      expect(content).toContain('type="button"')
      expect(content).not.toContain('type="tw-button"')
    })

    it('does NOT prefix role attribute values', async () => {
      const registry = await getRegistry('tw-')
      const toggle = registry.toggle
      const content = toggle.files[0].content

      // Role values should NOT be prefixed
      expect(content).toContain('role="switch"')
      expect(content).not.toContain('role="tw-switch"')
    })

    it('does NOT prefix cva variant key values like "default"', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // cva variant values like state: "default" should NOT be prefixed
      expect(content).toContain('variant: "default"')
      expect(content).not.toContain('variant: "tw-default"')
    })

    it('handles text-field component without syntax corruption', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // Verify syntax is valid - no tw- prefix in JavaScript syntax
      expect(content).not.toContain('tw-{')
      expect(content).not.toContain('tw-}')
      expect(content).not.toContain('tw-false')
      expect(content).not.toContain('tw-true')
      expect(content).not.toContain('tw-const')
      expect(content).not.toContain('tw-=>')

      // But Tailwind classes should be prefixed
      expect(content).toContain('tw-cursor-not-allowed')
      expect(content).toContain('tw-opacity-50')
    })

    it('preserves state values in cva defaultVariants', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // defaultVariants state value should NOT be prefixed
      expect(content).toContain('state: "default"')
      expect(content).not.toContain('state: "tw-default"')
    })

    it('does NOT prefix empty string values', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // Empty strings should remain empty
      expect(content).toContain('false: ""')
      expect(content).not.toMatch(/false:\s*"tw-"/)
    })

    it('prefixes error variant values in cva', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // Error variant CSS classes should be prefixed
      expect(content).toContain('error: "tw-border')
      expect(content).not.toContain('error: "border border-[#FF3B3B]')
    })

    it('prefixes default variant values in cva', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // Default variant CSS classes should be prefixed
      expect(content).toContain('default: "tw-border')
    })
  })
})
