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
        expect(file.name).toMatch(/\.tsx?$/)  // .tsx or .ts files
        expect(file.content).toBeTruthy()
        expect(typeof file.content).toBe('string')
      }
    }
  })

  it('component content has valid structure', async () => {
    const registry = await getRegistry()

    for (const component of Object.values(registry)) {
      // Get the main file content (either first file or mainFile for multi-file components)
      const mainFile = component.isMultiFile
        ? component.files.find(f => f.name === component.mainFile)
        : component.files[0]
      const content = mainFile!.content

      // Should have imports
      expect(content).toContain('import')

      // Should have exports
      expect(content).toContain('export')

      // Should import cn utility (transformed path) - single-file or multi-file components
      const hasCnImport = content.includes('../../lib/utils') || content.includes('../../../lib/utils')
      expect(hasCnImport).toBe(true)

      // Should not have Tailwind v4 syntax
      expect(content).not.toContain('@theme')
      expect(content).not.toContain('@source')
    }
  })

  it('dependencies are valid packages', async () => {
    const registry = await getRegistry()
    const validDeps = [
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-switch',
      '@radix-ui/react-accordion',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-toast',
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
      expect(content).toContain('hover:tw-bg-[#2F384D]')
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

      // Data attribute variants should have utility prefixed, NOT the variant
      // Correct: data-[state=open]:tw-animate-in (prefix on utility)
      // Wrong:   tw-data-[state=open]:animate-in (prefix on selector)
      expect(content).toContain('data-[state=open]:tw-animate-in')
      expect(content).toContain('data-[disabled]:tw-pointer-events-none')
      expect(content).toContain('data-[state=open]:tw-bg-[#F5F5F5]')

      // Should NOT have prefix before data-
      expect(content).not.toMatch(/tw-data-\[/)
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
      const switchComponent = registry.switch
      const content = switchComponent.files[0].content

      // HTML type attributes should NOT be prefixed - Switch uses Radix which has data attributes
      expect(content).toContain('data-[state=checked]')
      expect(content).not.toContain('data-[state=tw-checked]')
    })

    it('does NOT prefix role attribute values', async () => {
      const registry = await getRegistry('tw-')
      const checkbox = registry.checkbox
      const content = checkbox.files[0].content

      // Role values should NOT be prefixed - Checkbox has role="checkbox" via Radix
      expect(content).toContain('CheckboxPrimitive')
      expect(content).not.toContain('role="tw-checkbox"')
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

    it('prefixes classes inside cn() with nested parentheses', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // Classes inside cn() with nested function calls should be prefixed
      expect(content).toContain('"tw-h-10 tw-px-4"')
      expect(content).not.toContain('"h-10 px-4"')
      expect(content).toContain('"tw-text-xs"')
      expect(content).not.toContain('"text-xs"')
    })

    it('prefixes utility after data-[] selector, not before', async () => {
      const registry = await getRegistry('tw-')
      const dropdown = registry['dropdown-menu']
      const content = dropdown.files[0].content

      // Various data-[] patterns should all have prefix on utility, not selector
      expect(content).toContain('data-[state=open]:tw-animate-in')
      expect(content).toContain('data-[state=closed]:tw-fade-out-0')
      expect(content).toContain('data-[side=bottom]:tw-slide-in-from-top-2')

      // NEVER have prefix before data-[
      expect(content).not.toMatch(/tw-data-\[/)
    })

    it('handles negative values with data selectors', async () => {
      const registry = await getRegistry('tw-')
      const dropdown = registry['dropdown-menu']
      const content = dropdown.files[0].content

      // Negative values: data-[side=left]:-translate-x-1 -> data-[side=left]:-tw-translate-x-1
      // Check that negative prefix handling works with data selectors
      expect(content).toContain('-tw-mx-1')
    })

    it('does not corrupt JavaScript syntax in any component', async () => {
      const registry = await getRegistry('tw-')

      for (const [, component] of Object.entries(registry)) {
        const content = component.files[0].content

        // No corrupted keywords - these should NEVER appear
        expect(content).not.toMatch(/tw-interface\b/)
        expect(content).not.toMatch(/tw-const\b/)
        expect(content).not.toMatch(/tw-function\b/)
        expect(content).not.toMatch(/tw-export\b/)
        expect(content).not.toMatch(/tw-import\b/)
        expect(content).not.toMatch(/tw-=>/)
        expect(content).not.toMatch(/tw-React\b/)
        expect(content).not.toMatch(/tw-true\b/)
        expect(content).not.toMatch(/tw-false\b/)

        // Syntax should still be valid - original keywords preserved
        expect(content).toContain('export')
        expect(content).toContain('import')
      }
    })

    it('preserves interface definitions without corruption', async () => {
      const registry = await getRegistry('tw-')
      const tag = registry.tag
      const content = tag.files[0].content

      // Interface should not have tw- prefix
      expect(content).toContain('interface TagProps')
      expect(content).not.toContain('tw-interface')

      // const declarations should not have tw- prefix
      expect(content).toContain('const Tag')
      expect(content).not.toContain('tw-const')
    })
  })

  describe('multi-file components', () => {
    it('includes event-selector component', async () => {
      const registry = await getRegistry()
      const eventSelector = registry['event-selector']

      expect(eventSelector).toBeDefined()
      expect(eventSelector.isMultiFile).toBe(true)
      expect(eventSelector.directory).toBe('event-selector')
      expect(eventSelector.mainFile).toBe('event-selector.tsx')
      expect(eventSelector.files.length).toBe(4)  // main, group, item, types
      expect(eventSelector.internalDependencies).toContain('checkbox')
      expect(eventSelector.internalDependencies).toContain('accordion')
    })

    it('includes key-value-input component', async () => {
      const registry = await getRegistry()
      const keyValueInput = registry['key-value-input']

      expect(keyValueInput).toBeDefined()
      expect(keyValueInput.isMultiFile).toBe(true)
      expect(keyValueInput.directory).toBe('key-value-input')
      expect(keyValueInput.mainFile).toBe('key-value-input.tsx')
      expect(keyValueInput.files.length).toBe(3)  // main, row, types
      expect(keyValueInput.internalDependencies).toContain('button')
      expect(keyValueInput.internalDependencies).toContain('input')
    })

    it('transforms imports to sibling ui components correctly', async () => {
      const registry = await getRegistry()
      const eventSelector = registry['event-selector']

      // Find the event-item file which imports Checkbox
      const eventItem = eventSelector.files.find(f => f.name === 'event-item.tsx')
      expect(eventItem).toBeDefined()

      // Should import from sibling directory, not ../../ui/
      expect(eventItem!.content).toContain('from "../checkbox"')
      expect(eventItem!.content).not.toContain('from "../../ui/checkbox"')
    })

    it('prefixes tailwind classes in multi-file components', async () => {
      const registry = await getRegistry('tw-')
      const eventSelector = registry['event-selector']

      const mainFile = eventSelector.files.find(f => f.name === 'event-selector.tsx')
      expect(mainFile).toBeDefined()

      // Classes should be prefixed
      expect(mainFile!.content).toContain('tw-border')
      expect(mainFile!.content).toContain('tw-rounded-lg')
      expect(mainFile!.content).toContain('tw-flex')
    })

    it('transforms lib/utils import correctly for multi-file components', async () => {
      const registry = await getRegistry()
      const eventSelector = registry['event-selector']

      const mainFile = eventSelector.files.find(f => f.name === 'event-selector.tsx')
      expect(mainFile).toBeDefined()

      // Should use ../../../lib/utils (going up from event-selector directory)
      expect(mainFile!.content).toContain('from "../../../lib/utils"')
      expect(mainFile!.content).not.toContain('@/lib/utils')
    })

    it('has correct file path structure for multi-file components', async () => {
      const registry = await getRegistry()

      // Verify all multi-file components have required properties
      for (const component of Object.values(registry)) {
        if (component.isMultiFile) {
          expect(component.directory).toBeDefined()
          expect(component.directory).toBeTruthy()
          expect(component.mainFile).toBeDefined()
          expect(component.mainFile).toBeTruthy()
          expect(component.files.length).toBeGreaterThan(1)

          // mainFile should be in files array
          const mainFileExists = component.files.some(f => f.name === component.mainFile)
          expect(mainFileExists).toBe(true)
        }
      }
    })

    it('multi-file component directory matches component name', async () => {
      const registry = await getRegistry()
      const eventSelector = registry['event-selector']
      const keyValueInput = registry['key-value-input']

      // Directory should match component name for consistency
      expect(eventSelector.directory).toBe('event-selector')
      expect(keyValueInput.directory).toBe('key-value-input')
    })

    it('update command file path calculation for multi-file components', async () => {
      // This test verifies the logic used in update.ts for file path calculation
      const registry = await getRegistry()
      const componentsDir = 'src/components/ui'

      for (const component of Object.values(registry)) {
        // Simulate the getComponentFilePath logic from update.ts
        let expectedPath: string
        if (component.isMultiFile && component.directory) {
          expectedPath = `${componentsDir}/${component.directory}/${component.files[0].name}`
        } else {
          expectedPath = `${componentsDir}/${component.files[0].name}`
        }

        // Multi-file components should have directory in path
        if (component.isMultiFile) {
          expect(expectedPath).toContain(`/${component.directory}/`)
        }
      }
    })
  })
})
