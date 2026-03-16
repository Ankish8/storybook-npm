import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { getRegistry } from '../utils/registry.js'
import type { Registry } from '../utils/registry-types.js'

// ============================================================================
// E2E Tests: Verify CLI-installed components are correct and buildable
//
// Two modes:
//   npm run test:e2e         → Full suite including Vite build (~15s)
//   npm run test:e2e:smoke   → Fast checks only, no npm install/build (~3s)
// ============================================================================

const PREFIX = 'tw-'
const IS_SMOKE = process.env.E2E_SMOKE === '1'

let tempDir: string
let componentsDir: string
let registry: Registry

// ============================================================================
// Project Scaffolding
// ============================================================================

async function createTempProject(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'myop-e2e-'))

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
      paths: { '@/*': ['./src/*'] },
    },
    include: ['src'],
  })

  await fs.writeFile(
    path.join(dir, 'vite.config.ts'),
    `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
`
  )

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

  await fs.writeFile(
    path.join(dir, 'postcss.config.js'),
    `export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
`
  )

  await fs.writeFile(
    path.join(dir, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>E2E</title></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
`
  )

  await fs.ensureDir(path.join(dir, 'src'))
  await fs.writeFile(
    path.join(dir, 'src', 'index.css'),
    '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
  )

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

  await fs.writeFile(
    path.join(dir, 'src', 'main.tsx'),
    `import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><div>E2E</div></React.StrictMode>)
`
  )

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

  await fs.ensureDir(path.join(dir, 'src', 'components', 'ui'))
  return dir
}

// ============================================================================
// Component Installer (simulates CLI `add`)
// ============================================================================

async function installComponent(
  componentName: string,
  reg: Registry,
  targetDir: string,
  installed: Set<string> = new Set()
): Promise<void> {
  if (installed.has(componentName)) return
  const component = reg[componentName]
  if (!component) throw new Error(`Component "${componentName}" not in registry`)

  if (component.internalDependencies) {
    for (const dep of component.internalDependencies) {
      await installComponent(dep, reg, targetDir, installed)
    }
  }

  const groupPrefix = component.group || ''
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
// Assertion Helpers — each returns structured violations for actionable errors
// ============================================================================

interface Violation {
  file: string
  line?: number
  message: string
  suggestion?: string
}

function formatViolations(violations: Violation[]): string {
  if (violations.length === 0) return ''
  const lines = violations.map((v) => {
    let msg = `\n  ✗ ${v.file}`
    if (v.line) msg += `:${v.line}`
    msg += `\n    ${v.message}`
    if (v.suggestion) msg += `\n    → Fix: ${v.suggestion}`
    return msg
  })
  return `\n${violations.length} violation(s) found:${lines.join('')}\n`
}

/** Returns true if the string looks like an unprefixed Tailwind utility class */
function isBareUtility(cls: string): boolean {
  const utilityPart = cls.replace(/^(?:(?:[a-z]+[-a-z]*|data-\[[^\]]*\]|\[[^\]]*\]):)*/, '')
  if (!utilityPart || utilityPart.startsWith('tw-')) return false

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

/** Find bare (unprefixed) Tailwind classes in className/cn/cva contexts */
function findBareClasses(content: string, fileName: string): Violation[] {
  const violations: Violation[] = []
  const classStringRegex = /(?:className\s*=\s*"|cn\("|cva\(\s*"|(?:default|primary|secondary|destructive|outline|ghost|link|dashed|sm|md|lg|xl|icon|error|warning|success|info):\s*")((?:[^"\\]|\\.)*)"/g

  let match
  while ((match = classStringRegex.exec(content)) !== null) {
    const classes = match[1].split(/\s+/).filter(Boolean)
    const lineNum = content.substring(0, match.index).split('\n').length
    for (const cls of classes) {
      if (isBareUtility(cls)) {
        violations.push({
          file: fileName,
          line: lineNum,
          message: `Bare utility "${cls}" missing "${PREFIX}" prefix`,
          suggestion: `Change "${cls}" to "${PREFIX}${cls}"`,
        })
      }
    }
  }

  return violations
}

/** Find @/ import aliases that should have been transformed to relative paths */
function findAliasImports(content: string, fileName: string): Violation[] {
  const violations: Violation[] = []
  const regex = /from\s+["'](@\/[^"']+)["']/g
  let m
  while ((m = regex.exec(content)) !== null) {
    const lineNum = content.substring(0, m.index).split('\n').length
    violations.push({
      file: fileName,
      line: lineNum,
      message: `Import alias "${m[1]}" not transformed to relative path`,
      suggestion: `Should be a relative import like "../../lib/utils"`,
    })
  }
  return violations
}

/** Find <p> elements missing margin reset (Bootstrap compat) */
function findBootstrapViolations(content: string, fileName: string): Violation[] {
  const violations: Violation[] = []
  const pTagRegex = /<p\b([^>]*)>/g
  let m
  while ((m = pTagRegex.exec(content)) !== null) {
    const attrs = m[1]
    const lineNum = content.substring(0, m.index).split('\n').length

    // Direct check on attributes
    if (attrs.includes('tw-m-0') || attrs.includes('tw-mb-0') || attrs.includes('tw-my-0')) {
      continue
    }

    // Check inside cn("...") calls
    const cnMatch = attrs.match(/className=\{cn\(\s*"([^"]*)"/)
    if (cnMatch) {
      const cnClasses = cnMatch[1]
      if (cnClasses.includes('tw-m-0') || cnClasses.includes('tw-mb-0') || cnClasses.includes('tw-my-0')) {
        continue
      }
      // cn() found but missing margin reset — violation
    } else if (attrs.includes('className=') && !attrs.includes('className="') && !attrs.includes("className='")) {
      // Dynamic className via variable/function we can't parse
      // Check if the variable is a CVA variant call — look for the <p>'s CVA definition
      const variantMatch = attrs.match(/className=\{([a-zA-Z]+)\(/)
      if (variantMatch) {
        const fnName = variantMatch[1]
        // Search for the CVA definition to see if it includes m-0
        const cvaRegex = new RegExp(`const\\s+${fnName}\\s*=\\s*cva\\(\\s*"([^"]*)"`)
        const cvaMatch = content.match(cvaRegex)
        if (cvaMatch && (cvaMatch[1].includes('tw-m-0') || cvaMatch[1].includes('tw-mb-0') || cvaMatch[1].includes('tw-my-0'))) {
          continue
        }
      }
      // Can't determine — skip to avoid false positives
      continue
    }

    violations.push({
      file: fileName,
      line: lineNum,
      message: `<p> element missing margin reset (tw-m-0 / tw-mb-0 / tw-my-0)`,
      suggestion: `Add "tw-m-0" to className to prevent Bootstrap's 16px margin bleed`,
    })
  }
  return violations
}

/** Find JS syntax corruption from overzealous prefixer */
function findCorruption(content: string, fileName: string): Violation[] {
  const violations: Violation[] = []
  const patterns: [RegExp, string][] = [
    [/tw-interface\b/, 'Prefixed TypeScript keyword "interface"'],
    [/tw-const\b/, 'Prefixed JS keyword "const"'],
    [/tw-function\b/, 'Prefixed JS keyword "function"'],
    [/tw-export\b/, 'Prefixed JS keyword "export"'],
    [/tw-import\b/, 'Prefixed JS keyword "import"'],
    [/tw-=>/, 'Prefixed arrow function "=>"'],
    [/tw-React\b/, 'Prefixed React namespace'],
    [/tw-true\b/, 'Prefixed boolean "true"'],
    [/tw-false\b/, 'Prefixed boolean "false"'],
    [/tw-null\b/, 'Prefixed "null"'],
    [/tw-undefined\b/, 'Prefixed "undefined"'],
    [/tw-return\b/, 'Prefixed "return"'],
    [/tw-\{/, 'Prefixed opening brace'],
    [/tw-\}/, 'Prefixed closing brace'],
    [/tw-\(/, 'Prefixed opening paren'],
    [/tw-typeof\b/, 'Prefixed "typeof"'],
    [/tw-extends\b/, 'Prefixed "extends"'],
  ]

  for (const [pattern, desc] of patterns) {
    let m
    const globalPattern = new RegExp(pattern.source, 'g')
    while ((m = globalPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, m.index).split('\n').length
      violations.push({
        file: fileName,
        line: lineNum,
        message: desc,
        suggestion: 'The tw- prefixer corrupted JavaScript syntax. Check prefix-utils.ts.',
      })
    }
  }
  return violations
}

/** Collect all .tsx/.ts files recursively from a directory */
async function collectFiles(dir: string): Promise<{ name: string; path: string }[]> {
  const results: { name: string; path: string }[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(fullPath)))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push({ name: path.relative(dir, fullPath), path: fullPath })
    }
  }
  return results
}

// ============================================================================
// TESTS
// ============================================================================

describe('CLI E2E: component installation', () => {
  beforeAll(async () => {
    tempDir = await createTempProject()
    componentsDir = path.join(tempDir, 'src', 'components', 'ui')
    registry = await getRegistry(PREFIX)
  }, 30_000)

  afterAll(async () => {
    if (tempDir) await fs.remove(tempDir)
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

    // Must NOT contain bare utility classes
    const violations = findBareClasses(content, 'button.tsx')
    expect(violations, formatViolations(violations)).toEqual([])
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
  it('bootstrap compat: all <p> have margin reset', async () => {
    // Install components known to have <p> elements
    await installComponent('alert', registry, componentsDir)
    await installComponent('empty-state', registry, componentsDir)

    const files = await collectFiles(componentsDir)
    const allViolations: Violation[] = []
    for (const file of files) {
      const content = await fs.readFile(file.path, 'utf-8')
      allViolations.push(...findBootstrapViolations(content, file.name))
    }

    expect(allViolations, formatViolations(allViolations)).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 5: No @/ import aliases remain
  // --------------------------------------------------------------------------
  it('import paths have no @/ aliases', async () => {
    await installComponent('button', registry, componentsDir)
    await installComponent('dialog', registry, componentsDir)

    const files = await collectFiles(componentsDir)
    const allViolations: Violation[] = []
    for (const file of files) {
      const content = await fs.readFile(file.path, 'utf-8')
      allViolations.push(...findAliasImports(content, file.name))
    }

    expect(allViolations, formatViolations(allViolations)).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 6: Installed file content matches registry output
  // --------------------------------------------------------------------------
  it('installed file content matches registry', async () => {
    await installComponent('input', registry, componentsDir)

    const inputPath = path.join(componentsDir, 'input.tsx')
    const diskContent = await fs.readFile(inputPath, 'utf-8')
    const registryContent = registry.input.files[0].content

    expect(diskContent).toBe(registryContent)
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 7: No JavaScript syntax corruption
  // --------------------------------------------------------------------------
  it('no JavaScript syntax corruption in installed files', async () => {
    const toInstall = ['button', 'input', 'badge', 'tag', 'switch', 'checkbox']
    for (const name of toInstall) {
      await installComponent(name, registry, componentsDir)
    }

    const files = await collectFiles(componentsDir)
    const allViolations: Violation[] = []
    for (const file of files) {
      const content = await fs.readFile(file.path, 'utf-8')
      allViolations.push(...findCorruption(content, file.name))
    }

    expect(allViolations, formatViolations(allViolations)).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 8: Animation classes require tailwindcss-animate dependency
  // --------------------------------------------------------------------------
  it('components with animations declare tailwindcss-animate dependency', async () => {
    const animationPatterns = [
      /tw-animate-in\b/, /tw-animate-out\b/,
      /tw-fade-in/, /tw-fade-out/,
      /tw-zoom-in/, /tw-zoom-out/,
      /tw-slide-in/, /tw-slide-out/,
      /tw-spin\b/, /tw-pulse\b/, /tw-bounce\b/,
    ]

    const violations: Violation[] = []

    for (const [name, component] of Object.entries(registry)) {
      const content = component.files.map((f) => f.content).join('\n')
      const hasAnimation = animationPatterns.some((p) => p.test(content))

      if (hasAnimation && !component.dependencies.includes('tailwindcss-animate')) {
        violations.push({
          file: name,
          message: `Uses animation classes but missing "tailwindcss-animate" in dependencies`,
          suggestion: `Add "tailwindcss-animate" to dependencies in components.yaml`,
        })
      }
    }

    expect(violations, formatViolations(violations)).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 9: Prefix coverage across ALL registry components (broad scan)
  // --------------------------------------------------------------------------
  it('all registry components have prefixed classes', async () => {
    const violations: Violation[] = []

    for (const [name, component] of Object.entries(registry)) {
      for (const file of component.files) {
        const fileViolations = findBareClasses(file.content, `${name}/${file.name}`)
        violations.push(...fileViolations)
      }
    }

    expect(
      violations,
      `Found ${violations.length} bare classes across registry.${formatViolations(violations.slice(0, 20))}` +
        (violations.length > 20 ? `\n  ... and ${violations.length - 20} more` : '')
    ).toEqual([])
  }, 30_000)

  // --------------------------------------------------------------------------
  // Test 10: No corruption across ALL registry components (broad scan)
  // --------------------------------------------------------------------------
  it('no syntax corruption across entire registry', async () => {
    const violations: Violation[] = []

    for (const [name, component] of Object.entries(registry)) {
      for (const file of component.files) {
        violations.push(...findCorruption(file.content, `${name}/${file.name}`))
      }
    }

    expect(violations, formatViolations(violations)).toEqual([])
  }, 30_000)

  // --------------------------------------------------------------------------
  // Test 11: z-index on overlay components uses z-[9999]
  // --------------------------------------------------------------------------
  it('overlay components use z-[9999] not z-50', async () => {
    const overlayComponents = ['dialog', 'dropdown-menu', 'tooltip', 'sheet']
    const violations: Violation[] = []

    for (const name of overlayComponents) {
      if (!registry[name]) continue
      const content = registry[name].files.map((f) => f.content).join('\n')

      // Check for z-50 which is too low (z-index: 50 is below host app's nav at 1000+)
      if (content.includes('tw-z-50')) {
        violations.push({
          file: name,
          message: `Uses "tw-z-50" (z-index: 50) — too low for MyOperator host app (nav is z-index: 1000+)`,
          suggestion: `Use "tw-z-[9999]" instead of "tw-z-50"`,
        })
      }
    }

    expect(violations, formatViolations(violations)).toEqual([])
  }, 15_000)

  // --------------------------------------------------------------------------
  // Test 12: Text content not corrupted by prefixer
  // --------------------------------------------------------------------------
  it('text content and string literals not prefixed', async () => {
    const violations: Violation[] = []

    // Patterns that indicate text content was incorrectly prefixed
    const textCorruptionPatterns = [
      /tw-[A-Z][a-z]+/, // tw- followed by capitalized word (e.g., "tw-Text-based")
      /tw-for\b/, /tw-and\b/, /tw-the\b/, /tw-with\b/, /tw-over\b/,
      /tw-from\b/, /tw-into\b/, /tw-that\b/, /tw-this\b/,
    ]

    for (const [name, component] of Object.entries(registry)) {
      for (const file of component.files) {
        for (const [pattern, ] of textCorruptionPatterns.entries()) {
          const match = file.content.match(textCorruptionPatterns[pattern])
          if (match) {
            const lineNum = file.content.substring(0, file.content.indexOf(match[0])).split('\n').length
            violations.push({
              file: `${name}/${file.name}`,
              line: lineNum,
              message: `Text content corrupted by prefixer: "${match[0]}"`,
              suggestion: 'The prefixer is modifying text/string content, not just Tailwind classes',
            })
          }
        }
      }
    }

    expect(violations, formatViolations(violations)).toEqual([])
  }, 30_000)

  // --------------------------------------------------------------------------
  // Test 13: Project builds successfully with Vite (SLOW — skipped in smoke)
  // --------------------------------------------------------------------------
  it.skipIf(IS_SMOKE)('project builds successfully with Vite', async () => {
    const toInstall = ['button', 'input', 'badge']
    for (const name of toInstall) {
      await installComponent(name, registry, componentsDir)
    }

    // Update main.tsx to import components
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

    execSync(
      'npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react --legacy-peer-deps',
      { cwd: tempDir, stdio: 'pipe', timeout: 60_000 }
    )

    // Vite build (can be slow on CI or constrained machines)
    const result = execSync('npx vite build', {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 120_000,
    })

    expect(result).toBeTruthy()
    expect(await fs.pathExists(path.join(tempDir, 'dist'))).toBe(true)
  }, 180_000)
}, 240_000)
