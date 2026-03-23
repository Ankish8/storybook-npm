import { describe, it, expect } from 'vitest'
import { getRegistry } from '../utils/registry.js'
import { prefixTailwindClasses, prefixClassNameExpression } from '../utils/prefix-utils.js'

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

      // Should import cn utility if component uses cn() - some composing components don't need it
      const usesCn = content.includes('cn(')
      if (usesCn) {
        const hasCnImport = content.includes('../../lib/utils') || content.includes('../../../lib/utils')
        expect(hasCnImport).toBe(true)
      }

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
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'tailwindcss-animate',  // Required for animation classes (animate-in, animate-out, etc.)
    ]

    const getPackageName = (dep: string) => {
      // Remove version specifier: @radix-ui/react-slot@^1.2.4 -> @radix-ui/react-slot
      if (dep.startsWith('@')) {
        const match = dep.match(/^(@[^@]+\/[^@]+)(@|$)/)
        return match ? match[1] : dep
      }
      return dep.split(/[@^~]/)[0]
    }

    for (const component of Object.values(registry)) {
      for (const dep of component.dependencies) {
        const pkgName = getPackageName(dep)
        expect(validDeps).toContain(pkgName)
      }
    }
  })

  it('does not include tailwindcss as dependency', async () => {
    const registry = await getRegistry()

    for (const component of Object.values(registry)) {
      // tailwindcss itself should never be a dependency (it's a dev dependency in user's project)
      expect(component.dependencies).not.toContain('tailwindcss')
      // Note: tailwindcss-animate IS allowed as it's a runtime dependency for animation classes
    }
  })

  it('button component has correct dependencies', async () => {
    const registry = await getRegistry()
    const button = registry.button

    const getPackageName = (dep: string) => {
      // Remove version specifier: @radix-ui/react-slot@^1.2.4 -> @radix-ui/react-slot
      if (dep.startsWith('@')) {
        const match = dep.match(/^(@[^@]+\/[^@]+)(@|$)/)
        return match ? match[1] : dep
      }
      return dep.split(/[@^~]/)[0]
    }

    const depNames = button.dependencies.map(getPackageName)

    expect(depNames).toContain('@radix-ui/react-slot')
    expect(depNames).toContain('class-variance-authority')
    expect(depNames).toContain('lucide-react')
  })

  it('dropdown-menu component has radix dependency', async () => {
    const registry = await getRegistry()
    const dropdown = registry['dropdown-menu']

    const getPackageName = (dep: string) => {
      // Remove version specifier: @radix-ui/react-slot@^1.2.4 -> @radix-ui/react-slot
      if (dep.startsWith('@')) {
        const match = dep.match(/^(@[^@]+\/[^@]+)(@|$)/)
        return match ? match[1] : dep
      }
      return dep.split(/[@^~]/)[0]
    }

    const depNames = dropdown.dependencies.map(getPackageName)

    expect(depNames).toContain('@radix-ui/react-dropdown-menu')
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
      // Components now use CSS variables: tw-text-[var(--semantic-text-inverted,#FFFFFF)]
      expect(content).toContain('tw-text-[var(--semantic-text-inverted')
    })

    it('prefixes classes with semantic tokens', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Components now use CSS variables: tw-bg-[var(--semantic-primary,#343E55)]
      expect(content).toContain('tw-bg-[var(--semantic-primary')
    })

    it('prefixes variant classes correctly', async () => {
      const registry = await getRegistry('tw-')
      const button = registry.button
      const content = button.files[0].content

      // Components now use CSS variables: hover:tw-bg-[var(--semantic-primary-hover,#2F384D)]
      expect(content).toContain('hover:tw-bg-[var(--semantic-primary-hover')
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
      // Components now use CSS variables: data-[state=open]:tw-bg-[var(--semantic-bg-ui,#F5F5F5)]
      expect(content).toContain('data-[state=open]:tw-bg-[var(--semantic-bg-ui')

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
      expect(content).not.toContain('error: "border border-semantic-error-primary')
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
      expect(content).toContain('"tw-h-[42px] tw-px-4"')
      expect(content).not.toContain('"h-[42px] px-4"')
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

    it('prefixes arbitrary CSS properties like [appearance:textfield]', async () => {
      const registry = await getRegistry('tw-')
      const input = registry.input
      const content = input.files[0].content

      // [appearance:textfield] should become tw-[appearance:textfield]
      expect(content).toContain('tw-[appearance:textfield]')
      expect(content).not.toMatch(/(?<![w]-)\[appearance:textfield\]/)
    })

    it('prefixes pseudo-element selectors like [&::-webkit-*]', async () => {
      const registry = await getRegistry('tw-')
      const input = registry.input
      const content = input.files[0].content

      // [&::-webkit-outer-spin-button]:appearance-none → [&::-webkit-outer-spin-button]:tw-appearance-none
      expect(content).toContain('[&::-webkit-outer-spin-button]:tw-appearance-none')
      expect(content).toContain('[&::-webkit-inner-spin-button]:tw-appearance-none')

      // Should NOT have unprefixed utility after pseudo-element selector
      expect(content).not.toContain('[&::-webkit-outer-spin-button]:appearance-none')
      expect(content).not.toContain('[&::-webkit-inner-spin-button]:appearance-none')
    })

    it('prefixes number spinner classes in text-field component', async () => {
      const registry = await getRegistry('tw-')
      const textField = registry['text-field']
      const content = textField.files[0].content

      // text-field should also have prefixed spinner classes
      expect(content).toContain('tw-[appearance:textfield]')
      expect(content).toContain('[&::-webkit-outer-spin-button]:tw-appearance-none')
      expect(content).toContain('[&::-webkit-inner-spin-button]:tw-appearance-none')
    })

    it('prefixes ! important modifier correctly: !p-0 → !tw-p-0', async () => {
      const registry = await getRegistry('tw-')
      const talkToUs = registry['talk-to-us-modal']
      const content = talkToUs.files[0].content

      // ! important modifier should come BEFORE the prefix: !tw-p-0
      expect(content).toContain('!tw-p-0')
      expect(content).toContain('!tw-gap-0')
      // Should NOT have prefix before !: tw-!p-0 is invalid
      expect(content).not.toContain('tw-!p-0')
      expect(content).not.toContain('tw-!gap-0')
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
      expect(eventSelector.files.length).toBe(5)  // main, group, item, types, index
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
      expect(keyValueInput.files.length).toBe(4)  // main, row, types, index
      expect(keyValueInput.internalDependencies).toContain('button')
      expect(keyValueInput.internalDependencies).toContain('input')
    })

    it('transforms imports to sibling ui components correctly', async () => {
      const registry = await getRegistry()
      const eventSelector = registry['event-selector']

      // Find the event-item file which imports Checkbox
      const eventItem = eventSelector.files.find(f => f.name === 'event-item.tsx')
      expect(eventItem).toBeDefined()

      // Multi-file components are installed to src/components/ui/event-selector/
      // and import sibling UI components from src/components/ui/, so the path is ../checkbox
      expect(eventItem!.content).toContain('from "../checkbox"')
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

      // Should use ../../../lib/utils (going up from ui/event-selector/ to src/lib/)
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

  describe('className={...} JSX expression prefixing', () => {
    describe('prefixClassNameExpression', () => {
      it('prefixes bare string literals in ternary', () => {
        const expr = 'active ? "border-b-2 border-primary" : "text-muted-foreground"'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('"tw-border-b-2 tw-border-primary tw-border-solid"')
        expect(result).toContain('"tw-text-muted-foreground"')
      })

      it('prefixes template literal static parts', () => {
        const expr = '`flex items-center gap-3`'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('tw-flex tw-items-center tw-gap-3')
      })

      it('prefixes template literal static parts and expression strings', () => {
        const expr = '`flex items-center ${active ? "bg-primary" : "bg-gray-500"}`'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('tw-flex tw-items-center')
        expect(result).toContain('"tw-bg-primary"')
        expect(result).toContain('"tw-bg-gray-500"')
      })

      it('handles template literal with multiple expressions', () => {
        const expr = '`flex ${a ? "gap-2" : "gap-4"} border-b ${b ? "px-4" : ""}`'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('tw-flex')
        expect(result).toContain('"tw-gap-2"')
        expect(result).toContain('"tw-gap-4"')
        expect(result).toContain('tw-border-b')
        expect(result).toContain('"tw-px-4"')
      })

      it('skips already-prefixed strings (no double-prefixing)', () => {
        const expr = 'cn("tw-flex tw-items-center", active && "tw-bg-primary")'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).not.toContain('tw-tw-')
      })

      it('skips empty strings', () => {
        const expr = 'active ? "flex" : ""'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('"tw-flex"')
        expect(result).toContain('""')
        expect(result).not.toContain('"tw-"')
      })

      it('skips non-class values', () => {
        const expr = 'type === "button" ? "flex" : "hidden"'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('"button"')
        expect(result).toContain('"tw-flex"')
        expect(result).toContain('"tw-hidden"')
      })

      it('handles complex hover/focus variant classes', () => {
        const expr = '`flex ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`'
        const result = prefixClassNameExpression(expr, 'tw-')
        expect(result).toContain('tw-flex')
        expect(result).toContain('"tw-opacity-0 group-hover:tw-opacity-100"')
        expect(result).toContain('"tw-opacity-100"')
      })
    })

    describe('prefixTailwindClasses with className={...}', () => {
      it('prefixes className with ternary expression', () => {
        const input = '<div className={active ? "border-b-2 border-primary" : "text-muted"}></div>'
        const result = prefixTailwindClasses(input, 'tw-')
        expect(result).toContain('"tw-border-b-2 tw-border-primary tw-border-solid"')
        expect(result).toContain('"tw-text-muted"')
      })

      it('prefixes className with template literal', () => {
        const input = '<div className={`flex h-screen overflow-hidden`}></div>'
        const result = prefixTailwindClasses(input, 'tw-')
        expect(result).toContain('tw-flex tw-h-screen tw-overflow-hidden')
      })

      it('prefixes className with template literal and expressions', () => {
        const input = '<div className={`flex items-center ${i < 5 ? "border-b border-border" : ""}`}></div>'
        const result = prefixTailwindClasses(input, 'tw-')
        expect(result).toContain('tw-flex tw-items-center')
        expect(result).toContain('"tw-border-b tw-border-border tw-border-solid"')
      })

      it('does not double-prefix cn() args inside className expression', () => {
        const input = '<div className={cn("flex items-center", active && "bg-primary")}></div>'
        const result = prefixTailwindClasses(input, 'tw-')
        // cn() args are prefixed by pattern 2, then pattern 6 should NOT re-prefix
        expect(result).toContain('"tw-flex tw-items-center"')
        expect(result).not.toContain('tw-tw-')
      })

      it('does not affect className="..." static strings', () => {
        const input = '<div className="flex items-center"></div>'
        const result = prefixTailwindClasses(input, 'tw-')
        expect(result).toContain('className="tw-flex tw-items-center"')
      })
    })
  })

  describe('style={{}} property protection', () => {
    it('does not prefix CSS calc() values in style props', () => {
      const input = 'style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('width: "calc(100% - 1px)"')
      expect(result).toContain('height: "calc(100% - 1px)"')
      expect(result).not.toContain('tw-calc')
    })

    it('does not prefix overflow: "visible" in style props', () => {
      const input = 'style={{ overflow: "visible" }}'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('overflow: "visible"')
      expect(result).not.toContain('tw-visible')
    })

    it('does not prefix padding CSS values in style props', () => {
      const input = 'style={{ padding: "10px 14px 0 14px" }}'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('padding: "10px 14px 0 14px"')
    })

    it('does not prefix aspectRatio in style props', () => {
      const input = 'style={{ aspectRatio: "16/10" }}'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('aspectRatio: "16/10"')
    })

    it('does not prefix fontSize in style props', () => {
      const input = 'style={{ fontSize: "1.5rem" }}'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('fontSize: "1.5rem"')
    })

    it('still prefixes CVA variant values with conflicting key names', () => {
      // "outline" is both a CSS property and a CVA variant key — must still prefix the classes
      const input = 'outline: "border border-semantic-border-layout bg-transparent"'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('tw-border')
      expect(result).toContain('tw-bg-transparent')
    })
  })

  describe('border-solid auto-injection', () => {
    it('injects border-solid when border-width exists without border-style', () => {
      const input = 'className="border border-gray-200 p-4"'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('tw-border-solid')
    })

    it('injects border-solid for directional borders', () => {
      const input = 'className="border-t border-gray-200"'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).toContain('tw-border-solid')
    })

    it('does not inject border-solid when border-style already present', () => {
      const input = 'className="border border-dashed border-gray-200"'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).not.toContain('tw-border-solid')
      expect(result).toContain('tw-border-dashed')
    })

    it('does not inject border-solid when no border-width classes', () => {
      const input = 'className="flex items-center p-4"'
      const result = prefixTailwindClasses(input, 'tw-')
      expect(result).not.toContain('border-solid')
    })
  })
})
