#!/usr/bin/env node

/**
 * Emit public/catalog.json — the machine-readable component catalog that the
 * deployed Storybook serves alongside index.json and manifests/components.json.
 *
 * CONSUMER: Merlin's handoff workspace syncs this file (convex/handoffStorybook.ts
 * in the Merlin repo). The shape below is Merlin's `DsCatalogFile` contract
 * (convex/handoffCatalog.ts) — THIS SCRIPT CONFORMS TO THAT TYPE, not the other
 * way around. Fields per component:
 *
 *   slug, name, category, description, installCommand, dependencies,
 *   templateOnly, variants[{name, options[], defaultValue?}],
 *   a11yGuidelines[], sourceCode (ui primitives only, null for custom),
 *   sourcePath ("src/components/ui/button.tsx" — the cross-file JOIN KEY:
 *   Merlin matches it against index.json componentPath/importPath stems)
 *
 * SOURCES OF TRUTH
 *   packages/cli/components.yaml            slugs, categories, descriptions,
 *                                           dependencies, templateOnly, layout
 *   src/components/** (TS AST)              CVA variant axes — the RUNTIME truth;
 *                                           argTypes and component-meta.js were
 *                                           both measured stale against source
 *   packages/mcp/src/data/accessibility.ts  a11y guidelines (esbuild-transformed)
 *   package.json                            version stamp
 *
 * Wired into `npm run build-storybook` so every deploy refreshes the catalog.
 * The Vite builder copies public/ into storybook-static automatically.
 *
 * Usage:
 *   node scripts/emit-catalog.js           # write public/catalog.json
 *   node scripts/emit-catalog.js --check   # exit 1 if the committed file is stale
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import ts from 'typescript'
import { COMPONENT_META } from './component-meta.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const COMPONENTS_YAML = path.join(ROOT, 'packages/cli/components.yaml')
const ACCESSIBILITY_TS = path.join(ROOT, 'packages/mcp/src/data/accessibility.ts')
const OUT_FILE = path.join(ROOT, 'public/catalog.json')

const checkMode = process.argv.includes('--check')

// ============================================================================
// components.yaml parser (same minimal approach as sync-design-skill.js, plus
// the templateOnly/group keys that script does not need)
// ============================================================================

function parseComponentsYaml(content) {
  const components = {}
  let section = null
  let current = null
  let currentListField = null

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()
    if (line.match(/^\s*#/) || line.trim() === '') continue
    if (line === 'categories:') { section = 'categories'; continue }
    if (line === 'components:') { section = 'components'; continue }
    if (section !== 'components') continue

    const compMatch = line.match(/^  ([\w][\w-]*):\s*$/)
    if (compMatch) {
      current = compMatch[1]
      components[current] = {
        description: '',
        category: '',
        dependencies: [],
        internalDependencies: [],
        files: [],
        isMultiFile: false,
        templateOnly: false,
      }
      currentListField = null
      continue
    }
    if (!current) continue

    const kvMatch = line.match(/^\s+(description|category|isMultiFile|templateOnly|group|directory|mainFile):\s*(.+)/)
    if (kvMatch) {
      const [, key, rawVal] = kvMatch
      let val = rawVal.replace(/^"(.*)"$/, '$1')
      if (key === 'isMultiFile' || key === 'templateOnly') val = val === 'true'
      components[current][key] = val
      currentListField = null
      continue
    }
    const listMatch = line.match(/^\s+(dependencies|internalDependencies|files):\s*$/)
    if (listMatch) {
      currentListField = listMatch[1]
      continue
    }
    const listItemMatch = line.match(/^\s+-\s+"?([^"]+)"?\s*$/)
    if (listItemMatch && currentListField) {
      components[current][currentListField].push(listItemMatch[1].trim())
    }
  }
  return components
}

// ============================================================================
// CVA variant extraction — TypeScript AST, not regex. Tailwind classes contain
// parens and brackets ("h-[calc(100%-4px)]"), which sink any bracket-counting
// scanner; the AST does not care.
// ============================================================================

function extractCvaFromSource(source, slug) {
  const sourceFile = ts.createSourceFile('c.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  /** @type {Array<{declName: string, variants: Array<{name: string, options: string[]}>, defaults: Record<string, string>}>} */
  const calls = []

  const propName = (nameNode) =>
    ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) ? nameNode.text : null

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === 'cva'
    ) {
      const declName = ts.isIdentifier(node.name) ? node.name.text : ''
      const config = node.initializer.arguments[1]
      if (config && ts.isObjectLiteralExpression(config)) {
        const variants = []
        const defaults = {}
        for (const prop of config.properties) {
          if (!ts.isPropertyAssignment(prop)) continue
          const key = propName(prop.name)
          if (key === 'variants' && ts.isObjectLiteralExpression(prop.initializer)) {
            for (const axis of prop.initializer.properties) {
              if (!ts.isPropertyAssignment(axis)) continue
              const axisName = propName(axis.name)
              if (!axisName || !ts.isObjectLiteralExpression(axis.initializer)) continue
              const options = axis.initializer.properties
                .map((option) => (ts.isPropertyAssignment(option) ? propName(option.name) : null))
                .filter(Boolean)
              if (options.length > 0) variants.push({ name: axisName, options })
            }
          }
          if (key === 'defaultVariants' && ts.isObjectLiteralExpression(prop.initializer)) {
            for (const def of prop.initializer.properties) {
              if (!ts.isPropertyAssignment(def)) continue
              const defName = propName(def.name)
              const value = def.initializer
              if (defName && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))) {
                defaults[defName] = value.text
              }
            }
          }
        }
        if (variants.length > 0) calls.push({ declName, variants, defaults })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  if (calls.length === 0) return []
  // The component's own axes live in `<camelSlug>Variants` (buttonVariants,
  // accordionVariants); other cva() calls style sub-parts (accordion has four).
  const wanted = (slug.replace(/-/g, '') + 'variants').toLowerCase()
  const chosen = calls.find((call) => call.declName.toLowerCase() === wanted) ?? calls[0]
  return chosen.variants.map((axis) => ({
    name: axis.name,
    options: axis.options,
    ...(chosen.defaults[axis.name] !== undefined ? { defaultValue: chosen.defaults[axis.name] } : {}),
  }))
}

// ============================================================================
// Accessibility guidelines — the TS module transformed by esbuild and imported,
// then flattened to strings. Keys that name no catalog slug (the stale
// "toggle"/"collapsible" aliases) are simply not consumed.
// ============================================================================

async function loadAccessibility() {
  try {
    const esbuild = await import('esbuild')
    const source = fs.readFileSync(ACCESSIBILITY_TS, 'utf8')
    const { code } = esbuild.transformSync(source, { loader: 'ts', format: 'esm' })
    const tempFile = path.join(os.tmpdir(), `mo-accessibility-${Date.now()}.mjs`)
    fs.writeFileSync(tempFile, code)
    try {
      const mod = await import(`file://${tempFile}`)
      return mod.accessibilityGuidelines ?? {}
    } finally {
      fs.unlinkSync(tempFile)
    }
  } catch (error) {
    console.warn(`⚠ accessibility guidelines unavailable: ${error.message}`)
    return {}
  }
}

function flattenA11y(entry) {
  if (!entry) return []
  const lines = []
  for (const group of entry.guidelines ?? []) {
    for (const item of group.items ?? []) lines.push(item)
  }
  for (const attr of entry.ariaAttributes ?? []) {
    if (attr.attribute && attr.usage) lines.push(`${attr.attribute}: ${attr.usage}`)
  }
  for (const key of entry.keyboardSupport ?? []) {
    if (key.key && key.action) lines.push(`${key.key}: ${key.action}`)
  }
  return lines.slice(0, 24)
}

// ============================================================================
// Source path resolution — sourcePath is the JOIN KEY, so it must name the file
// the component's stories point at. ui: src/components/ui/<slug>.tsx. custom:
// the main file inside its directory.
// ============================================================================

function resolveSourcePath(slug, meta, warnings) {
  if (meta.category !== 'custom') {
    const rel = `src/components/ui/${slug}.tsx`
    if (fs.existsSync(path.join(ROOT, rel))) return rel
    warnings.push(`${slug}: expected ${rel} does not exist`)
    return rel
  }
  const dir = meta.directory || slug
  const base = `src/components/custom/${dir}`
  const dirLeaf = dir.split('/').pop()
  const candidates = []
  // The stories file names the component file Storybook indexes this component
  // under — its .tsx sibling is the join key Merlin matches, so it outranks
  // yaml's mainFile (which is often index.ts, a stem no story ever carries).
  const absBase = path.join(ROOT, base)
  if (fs.existsSync(absBase)) {
    for (const file of fs.readdirSync(absBase)) {
      if (file.endsWith('.stories.tsx')) candidates.push(file.replace('.stories.tsx', '.tsx'))
    }
  }
  candidates.push(`${dirLeaf}.tsx`, `${slug}.tsx`)
  if (meta.mainFile) candidates.push(meta.mainFile)
  candidates.push('index.tsx')
  for (const file of meta.files ?? []) if (file.endsWith('.tsx')) candidates.push(file)
  for (const candidate of candidates) {
    const rel = `${base}/${candidate}`
    if (fs.existsSync(path.join(ROOT, rel))) return rel
  }
  warnings.push(`${slug}: no main file found under ${base}`)
  return `${base}/${dirLeaf}.tsx`
}

function toPascalCase(slug) {
  return slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

// ============================================================================

async function main() {
  const warnings = []
  const yaml = parseComponentsYaml(fs.readFileSync(COMPONENTS_YAML, 'utf8'))
  const a11y = await loadAccessibility()
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version

  const components = []
  for (const [slug, meta] of Object.entries(yaml)) {
    const sourcePath = resolveSourcePath(slug, meta, warnings)
    const absSource = path.join(ROOT, sourcePath)
    const sourceText = fs.existsSync(absSource) ? fs.readFileSync(absSource, 'utf8') : null

    components.push({
      slug,
      name: COMPONENT_META[slug]?.name || toPascalCase(slug),
      category: meta.category || 'custom',
      description: meta.description || '',
      installCommand: `npx myoperator-ui add ${slug}`,
      dependencies: meta.dependencies ?? [],
      templateOnly: meta.templateOnly === true,
      variants: sourceText ? extractCvaFromSource(sourceText, slug) : [],
      a11yGuidelines: flattenA11y(a11y[slug]),
      // Full source for ui primitives only: custom compositions are multi-file
      // and land in consumer repos via the CLI, not via copy-paste.
      sourceCode: meta.category !== 'custom' && sourceText ? sourceText : null,
      sourcePath,
    })
  }

  const payload = {
    version,
    generatedAt: new Date().toISOString(),
    components,
  }
  const json = JSON.stringify(payload, null, 2) + '\n'

  if (checkMode) {
    const existing = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, 'utf8') : ''
    // generatedAt differs on every run; compare everything else.
    const strip = (text) => text.replace(/"generatedAt": "[^"]*"/, '"generatedAt": ""')
    if (strip(existing) !== strip(json)) {
      console.error('✗ public/catalog.json is stale — run: node scripts/emit-catalog.js')
      process.exit(1)
    }
    console.log('✓ public/catalog.json is current')
    return
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, json)

  const withVariants = components.filter((component) => component.variants.length > 0).length
  const withA11y = components.filter((component) => component.a11yGuidelines.length > 0).length
  const withSource = components.filter((component) => component.sourceCode !== null).length
  console.log(
    `✓ public/catalog.json — ${components.length} components ` +
      `(${withVariants} with CVA variants, ${withA11y} with a11y notes, ${withSource} with source), ` +
      `${(json.length / 1024).toFixed(0)} KB`,
  )
  for (const warning of warnings) console.warn(`  ⚠ ${warning}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
