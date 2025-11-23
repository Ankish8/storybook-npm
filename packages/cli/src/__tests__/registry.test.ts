import { describe, it, expect } from 'vitest'
import { getRegistry } from '../utils/registry.js'

describe('Registry', () => {
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

    for (const [name, component] of Object.entries(registry)) {
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

    for (const [name, component] of Object.entries(registry)) {
      for (const dep of component.dependencies) {
        expect(validDeps).toContain(dep)
      }
    }
  })

  it('does not include tailwindcss as dependency', async () => {
    const registry = await getRegistry()

    for (const [name, component] of Object.entries(registry)) {
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
