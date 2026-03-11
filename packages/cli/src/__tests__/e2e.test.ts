import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { getRegistry } from '../utils/registry.js'

// ============================================================================
// E2E Tests: Verify CLI-installed components are correct and buildable
// ============================================================================

const PREFIX = 'tw-'
let tempDir: string
let componentsDir: string

/**
 * Creates a minimal React + Tailwind v3 + Bootstrap project in a temp directory.
 * This simulates a consumer project that runs `npx myoperator-ui init && npx myoperator-ui add`.
 */
async function createTempProject(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'myop-e2e-'))

  // package.json — minimal React project with Tailwind v3
  await fs.writeJson(path.join(dir, 'package.json'), {
    name: 'e2e-test-project',
    private: true,
    type: 'module',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.2.0',
      typescript: '^5.3.0',
      vite: '^5.0.0',
      tailwindcss: '^3.4.0',
      autoprefixer: '^10.4.0',
      'tailwindcss-animate': '^1.0.7',
    },
  })

  // tsconfig.json
  await fs.writeJson(path.join(dir, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['src'],
  })

  // vite.config.ts
  await fs.writeFile(
    path.join(dir, 'vite.config.ts'),
    `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`
  )

  // tailwind.config.js
  await fs.writeFile(
    path.join(dir, 'tailwind.config.js'),
    `/** @type {import('tailwindcss').Config} */
export default {
  prefix: "${PREFIX}",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require("tailwindcss-animate")],
}
`
  )

  // postcss.config.js
  await fs.writeFile(
    path.join(dir, 'postcss.config.js'),
    `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  )

  // index.html
  await fs.writeFile(
    path.join(dir, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>E2E</title></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
`
  )

  // src/index.css
  await fs.ensureDir(path.join(dir, 'src'))
  await fs.writeFile(
    path.join(dir, 'src', 'index.css'),
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`
  )

  // src/lib/utils.ts — prefix-aware cn()
  await fs.ensureDir(path.join(dir, 'src', 'lib'))
  await fs.writeFile(
    path.join(dir, 'src', 'lib', 'utils.ts'),
    `import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({ prefix: "${PREFIX}" })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  )

  // src/main.tsx — minimal entry
  await fs.writeFile(
    path.join(dir, 'src', 'main.tsx'),
    `import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><div>E2E</div></React.StrictMode>)
`
  )

  // components.json (what `init` creates)
  await fs.writeJson(path.join(dir, 'components.json'), {
    $schema: 'https://myoperator.com/schema.json',
    style: 'default',
    tailwind: {
      config: 'tailwind.config.js',
      css: 'src/index.css',
      baseColor: 'slate',
      cssVariables: true,
      prefix: PREFIX,
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
    },
  })

  // Create components/ui directory
  await fs.ensureDir(path.join(dir, 'src', 'components', 'ui'))

  return dir
}

/**
 * Simulate the CLI `add` command: get prefixed registry content and write files.
 */
async function installComponent(
  componentName: string,
  registry: Awaited<ReturnType<typeof getRegistry>>,
  targetDir: string,
  installed: Set<string> = new Set()
): Promise<void> {
  if (installed.has(componentName)) return
  const component = registry[componentName]
  if (!component) throw new Error(`Component ${componentName} not in registry`)

  // Install internal dependencies first
  if (component.internalDependencies) {
    for (const dep of component.internalDependencies) {
      await installComponent(dep, registry, targetDir, installed)
    }
  }

  const groupPrefix = (component as Record<string, unknown>).group as string || ''
  const dir = component.isMultiFile
    ? path.join(targetDir, groupPrefix, component.directory!)
    : path.join(targetDir, groupPrefix)

  for (const file of component.files) {
    const filePath = path.join(dir, file.name)
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, file.content)
  }

  installed.add(componentName)
}

// ============================================================================
// Known Tailwind utility prefixes — a class is "bare" if it matches one of
// these patterns WITHOUT a tw- prefix.
// ============================================================================

/** Returns true if the string looks like an unprefixed Tailwind utility class */
function isBareUtility(cls: string): boolean {
  // Strip variant prefixes like hover:, focus:, data-[...]:, [&_svg]:, etc.
  const utilityPart = cls.replace(/^(?:(?:[a-z]+[-a-z]*|data-\[[^\]]*\]|\[[^\]]*\]):)*/, '')
  if (!utilityPart || utilityPart.startsWith('tw-')) return false

  // Common Tailwind utility prefixes
  const prefixes = [
    'bg-', 'text-', 'border-', 'rounded', 'flex', 'grid', 'inline-flex',
    'items-', 'justify-', 'gap-', 'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-',
    'm-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-', 'w-', 'h-', 'min-w-', 'min-h-',
    'max-w-', 'max-h-', 'size-', 'font-', 'leading-', 'tracking-',
    'opacity-', 'shadow', 'ring-', 'outline-', 'cursor-', 'pointer-events-',
    'transition', 'duration-', 'ease-', 'animate-', 'transform',
    'translate-', 'rotate-', 'scale-', 'skew-',
    'overflow-', 'z-', 'absolute', 'relative', 'fixed', 'sticky',
    'top-', 'bottom-', 'left-', 'right-', 'inset-',
    'block', 'inline', 'hidden', 'visible', 'invisible',
    'whitespace-', 'truncate', 'break-', 'underline', 'line-clamp-',
    'shrink', 'grow', 'basis-', 'self-', 'place-',
    'space-x-', 'space-y-', 'divide-',
    'aspect-', 'object-', 'fill-', 'stroke-',
  ]

  return prefixes.some((p) => utilityPart.startsWith(p) || utilityPart === p.replace(/-$/, ''))
}

/**
 * Scan file content for bare (unprefixed) Tailwind classes inside className/cn/cva contexts.
 * Returns array of found bare classes (empty = all prefixed correctly).
 */
function findBareClasses(content: string): string[] {
  const bare: string[] = []

  // Extract class strings from className="...", cn("..."), cva("..."), and key: "..." patterns
  const classStringRegex = /(?:className\s*=\s*"|cn\("|cva\(\s*"|(?:default|primary|secondary|destructive|outline|ghost|link|dashed|sm|md|lg|xl|icon|error|warning|success|info):\s*")((?:[^"\\]|\\.)*)"/g

  let match
  while ((match = classStringRegex.exec(content)) !== null) {
    const classes = match[1].split(/\s+/).filter(Boolean)
    for (const cls of classes) {
      if (isBareUtility(cls)) {
        bare.push(cls)
      }
    }
  }

  return bare
}

/**
 * Verify no @/ import aliases remain (CLI should transform them to relative paths).
 */
function findAliasImports(content: string): string[] {
  const matches: string[] = []
  const regex = /from\s+["'](@\/[^"']+)["']/g
  let m
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[1])
  }
  return matches
}

// ============================================================================
// TESTS
// ============================================================================

describe('CLI E2E: component installation', () => {
  let registry: Awaited<ReturnType<typeof getRegistry>>

  beforeAll(async () => {
    tempDir = await createTempProject()
    componentsDir = path.join(tempDir, 'src', 'components', 'ui')
    registry = await getRegistry(PREFIX)
  }, 30_000)

  afterAll(async () => {
    if (tempDir) {
      await fs.remove(tempDir)
    }
  })

  // --------------------------------------------------------------------------
  // Test 1: Single-file component has tw- prefixed classes
  // --------------------------------------------------------------------------
  it('single-file component installs with tw- prefix', async () => {
    await installComponent('button', registry, componentsDir)

    const buttonPath = path.join(componentsDir, 'button.tsx')
    expect(await fs.pathExists(buttonPath)).toBe(true)

    const content = await fs.readFile(buttonPath, 'utf-8')

    // Must contain prefixed classes
    expect(content).toContain('tw-inline-flex')
    expect(content).toContain('tw-items-center')
    expect(content).toContain('tw-rounded')

    // Must NOT contain bare utility classes in class contexts
    const bare = findBareClasses(content)
    expect(bare).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 2: Multi-file component installs all files
  // --------------------------------------------------------------------------
  it('multi-file component installs all files', async () => {
    await installComponent('key-value-input', registry, componentsDir)

    const kvDir = path.join(componentsDir, 'key-value-input')
    expect(await fs.pathExists(kvDir)).toBe(true)

    const component = registry['key-value-input']
    for (const file of component.files) {
      const filePath = path.join(kvDir, file.name)
      expect(await fs.pathExists(filePath)).toBe(true)
    }

    // Verify main file has prefixed classes
    const mainFile = component.files.find((f) => f.name === component.mainFile)!
    const mainContent = await fs.readFile(path.join(kvDir, mainFile.name), 'utf-8')
    expect(mainContent).toContain('tw-')
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 3: Internal dependencies auto-install
  // --------------------------------------------------------------------------
  it('internal dependencies auto-install', async () => {
    const installed = new Set<string>()
    await installComponent('delete-confirmation-modal', registry, componentsDir, installed)

    // delete-confirmation-modal depends on dialog, button, input
    expect(installed.has('dialog')).toBe(true)
    expect(installed.has('button')).toBe(true)
    expect(installed.has('input')).toBe(true)
    expect(installed.has('delete-confirmation-modal')).toBe(true)

    // Verify all dependency files exist
    expect(await fs.pathExists(path.join(componentsDir, 'dialog.tsx'))).toBe(true)
    expect(await fs.pathExists(path.join(componentsDir, 'button.tsx'))).toBe(true)
    expect(await fs.pathExists(path.join(componentsDir, 'input.tsx'))).toBe(true)
    expect(await fs.pathExists(path.join(componentsDir, 'delete-confirmation-modal.tsx'))).toBe(true)
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 4: Bootstrap compat — all <p> elements have tw-m-0
  // --------------------------------------------------------------------------
  it('bootstrap compat: all <p> have tw-m-0', async () => {
    // Install a few components that are likely to have <p> elements
    await installComponent('alert', registry, componentsDir)
    await installComponent('badge', registry, componentsDir)

    // Scan all installed .tsx files
    const files = await fs.readdir(componentsDir)
    const tsxFiles = files.filter((f) => f.endsWith('.tsx'))

    const violations: string[] = []
    for (const file of tsxFiles) {
      const filePath = path.join(componentsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')

      // Find <p elements that don't have tw-m-0 or tw-mb-0 or tw-my-0
      // Match <p followed by className or > (simple JSX <p> tags)
      const pTagRegex = /<p\b([^>]*)>/g
      let m
      while ((m = pTagRegex.exec(content)) !== null) {
        const attrs = m[1]
        if (
          !attrs.includes('tw-m-0') &&
          !attrs.includes('tw-mb-0') &&
          !attrs.includes('tw-my-0')
        ) {
          // Check if m-0 is applied through a CVA variant (className={...variants(...)})
          // If className uses a variable/function, we can't easily check — skip
          if (attrs.includes('className=') && !attrs.includes('className="') && !attrs.includes("className='")) {
            continue // dynamic className, skip
          }
          violations.push(`${file}: <p${attrs}>`)
        }
      }
    }

    expect(violations).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 5: No @/ import aliases remain in installed files
  // --------------------------------------------------------------------------
  it('import paths have no @/ aliases', async () => {
    await installComponent('button', registry, componentsDir)
    await installComponent('dialog', registry, componentsDir)

    const files = await fs.readdir(componentsDir)
    const tsxFiles = files.filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))

    const violations: { file: string; imports: string[] }[] = []
    for (const file of tsxFiles) {
      const content = await fs.readFile(path.join(componentsDir, file), 'utf-8')
      const aliased = findAliasImports(content)
      if (aliased.length > 0) {
        violations.push({ file, imports: aliased })
      }
    }

    expect(violations).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 6: Installed component content matches registry output exactly
  // --------------------------------------------------------------------------
  it('installed file content matches registry', async () => {
    await installComponent('input', registry, componentsDir)

    const inputPath = path.join(componentsDir, 'input.tsx')
    const diskContent = await fs.readFile(inputPath, 'utf-8')
    const registryContent = registry.input.files[0].content

    expect(diskContent).toBe(registryContent)
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 7: No JavaScript syntax corruption from prefixer
  // --------------------------------------------------------------------------
  it('no JavaScript syntax corruption in installed files', async () => {
    // Install several components to check breadth
    const toInstall = ['button', 'input', 'badge', 'tag', 'switch', 'checkbox']
    for (const name of toInstall) {
      await installComponent(name, registry, componentsDir)
    }

    const files = await fs.readdir(componentsDir)
    const tsxFiles = files.filter((f) => f.endsWith('.tsx'))

    const corruptionPatterns = [
      /tw-interface\b/,
      /tw-const\b/,
      /tw-function\b/,
      /tw-export\b/,
      /tw-import\b/,
      /tw-=>/,
      /tw-React\b/,
      /tw-true\b/,
      /tw-false\b/,
      /tw-\{/,
      /tw-\}/,
    ]

    for (const file of tsxFiles) {
      const content = await fs.readFile(path.join(componentsDir, file), 'utf-8')
      for (const pattern of corruptionPatterns) {
        expect(content).not.toMatch(pattern)
      }
    }
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 8: Project builds successfully with Vite
  // --------------------------------------------------------------------------
  it('project builds successfully with Vite', async () => {
    // Install a handful of components
    const toInstall = ['button', 'input', 'badge']
    for (const name of toInstall) {
      await installComponent(name, registry, componentsDir)
    }

    // Update main.tsx to import a component (to verify imports resolve)
    await fs.writeFile(
      path.join(tempDir, 'src', 'main.tsx'),
      `import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from './components/ui/button'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Button>Click me</Button></React.StrictMode>
)
`
    )

    // npm install
    execSync('npm install --legacy-peer-deps', {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 90_000,
    })

    // Install component peer dependencies
    execSync(
      'npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react --legacy-peer-deps',
      { cwd: tempDir, stdio: 'pipe', timeout: 60_000 }
    )

    // Vite build (TypeScript check is done by Vite)
    const result = execSync('npx vite build', {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 60_000,
    })

    // Build should succeed (no throw = exit code 0)
    expect(result).toBeTruthy()
    expect(await fs.pathExists(path.join(tempDir, 'dist'))).toBe(true)
  }, 120_000)
}, 180_000)
