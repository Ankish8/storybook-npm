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

      // Should import cn utility
      expect(content).toContain('@/lib/utils')

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

      // Data attribute classes should be handled
      expect(content).toContain('data-[state=open]:tw-animate-in')
      expect(content).toContain('data-[disabled]:tw-pointer-events-none')
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
  })
})
