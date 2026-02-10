#!/usr/bin/env node

/**
 * Sync component catalog into the myoperator-design skill's SKILL.md.
 *
 * Reads components.yaml (categories, descriptions, dependencies) and
 * COMPONENT_META (props, variants, examples) to generate a rich
 * "Component Catalog" section appended to SKILL.md.
 *
 * Usage:
 *   node scripts/sync-design-skill.js          # Dry run — preview catalog
 *   node scripts/sync-design-skill.js --write  # Update SKILL.md files
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { COMPONENT_META, NPM_ONLY_COMPONENTS } from './component-meta.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const COMPONENTS_YAML = path.resolve(__dirname, '../packages/cli/components.yaml')
const SKILL_MD_SOURCE = path.resolve(
  __dirname,
  '../.claude/plugins/myoperator-design/skills/myoperator-design/SKILL.md'
)

// Local cache path — resolved at runtime from ~/.claude
const HOME = process.env.HOME || process.env.USERPROFILE
const SKILL_MD_CACHE = path.resolve(
  HOME,
  '.claude/plugins/cache/myoperator-local/myoperator-design'
)

// GitHub distribution repo (if present alongside the main repo)
const SKILL_MD_DIST = path.resolve(
  __dirname,
  '../myoperator-plugins/plugins/myoperator-design/skills/myoperator-design/SKILL.md'
)

const MARKER = '<!-- AUTO-GENERATED: Component Catalog -->'

const shouldWrite = process.argv.includes('--write')

// ============================================================================
// YAML PARSER (minimal — no external dependency)
// ============================================================================

function parseComponentsYaml(content) {
  const categories = {}
  const components = {}

  let section = null // 'categories' | 'components'
  let currentCategory = null
  let currentComponent = null
  let currentList = null // track which list we're collecting
  let currentListField = null

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()

    // Skip comments and blank lines at top level
    if (line.match(/^\s*#/) || line.trim() === '') continue

    // Top-level sections
    if (line === 'categories:') { section = 'categories'; continue }
    if (line === 'components:') { section = 'components'; continue }

    if (section === 'categories') {
      // Category name (2-space indent)
      const catMatch = line.match(/^  (\w[\w-]*):\s*$/)
      if (catMatch) {
        currentCategory = catMatch[1]
        categories[currentCategory] = { description: '', components: [] }
        continue
      }
      // Category description
      const descMatch = line.match(/^\s+description:\s*"(.+)"/)
      if (descMatch && currentCategory) {
        categories[currentCategory].description = descMatch[1]
        continue
      }
      // Component list item
      const itemMatch = line.match(/^\s+-\s+(\S+)/)
      if (itemMatch && currentCategory) {
        categories[currentCategory].components.push(itemMatch[1])
        continue
      }
    }

    if (section === 'components') {
      // Component name (2-space indent, ends with colon)
      const compMatch = line.match(/^  ([\w][\w-]*):\s*$/)
      if (compMatch) {
        currentComponent = compMatch[1]
        components[currentComponent] = {
          description: '',
          category: '',
          dependencies: [],
          internalDependencies: [],
          isMultiFile: false,
        }
        currentList = null
        currentListField = null
        continue
      }

      if (!currentComponent) continue

      // Simple key-value fields
      const kvMatch = line.match(/^\s+(description|category|isMultiFile|directory|mainFile):\s*(.+)/)
      if (kvMatch) {
        const [, key, rawVal] = kvMatch
        let val = rawVal.replace(/^"(.*)"$/, '$1')
        if (key === 'isMultiFile') val = val === 'true'
        components[currentComponent][key] = val
        currentList = null
        currentListField = null
        continue
      }

      // List field header (dependencies:, internalDependencies:, files:)
      const listMatch = line.match(/^\s+(dependencies|internalDependencies|files):\s*$/)
      if (listMatch) {
        currentListField = listMatch[1]
        currentList = []
        if (!components[currentComponent][currentListField]) {
          components[currentComponent][currentListField] = []
        }
        continue
      }

      // List item
      const listItemMatch = line.match(/^\s+-\s+"?([^"]+)"?\s*$/)
      if (listItemMatch && currentListField) {
        const val = listItemMatch[1].trim()
        components[currentComponent][currentListField].push(val)
        continue
      }
    }
  }

  return { categories, components }
}

// ============================================================================
// CATALOG GENERATION
// ============================================================================

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function generateCatalog(categories, components) {
  const lines = []

  lines.push('## Component Catalog')
  lines.push('')
  lines.push(`> Auto-generated from \`components.yaml\` and component metadata. ${Object.keys(components).length} components across ${Object.keys(categories).length} categories.`)
  lines.push('')

  // Summary table
  lines.push('### Quick Reference')
  lines.push('')
  lines.push('| Component | Category | Install |')
  lines.push('|-----------|----------|---------|')
  for (const [catName, catData] of Object.entries(categories)) {
    for (const compName of catData.components) {
      const comp = components[compName]
      if (!comp) continue
      const displayName = COMPONENT_META[compName]?.name || toPascalCase(compName)
      lines.push(`| ${displayName} | ${catName} | \`npx myoperator-ui add ${compName}\` |`)
    }
  }
  lines.push('')

  // Per-category sections
  for (const [catName, catData] of Object.entries(categories)) {
    lines.push(`### ${catName.charAt(0).toUpperCase() + catName.slice(1)} — ${catData.description}`)
    lines.push('')

    for (const compName of catData.components) {
      const comp = components[compName]
      if (!comp) continue

      const meta = COMPONENT_META[compName]
      const displayName = meta?.name || toPascalCase(compName)
      const description = meta?.description || comp.description

      lines.push(`#### ${displayName}`)
      lines.push(`> ${description}`)
      lines.push('')
      lines.push(`**Install**: \`npx myoperator-ui add ${compName}\``)

      // Internal dependencies
      if (comp.internalDependencies?.length > 0) {
        lines.push(`**Requires**: ${comp.internalDependencies.map(d => `\`${d}\``).join(', ')} (auto-installed)`)
      }

      // Multi-file indicator
      if (comp.isMultiFile) {
        lines.push(`**Type**: Multi-file component`)
      }

      lines.push('')

      // Variants (from COMPONENT_META)
      if (meta?.variants?.length > 0) {
        for (const v of meta.variants) {
          lines.push(`**${v.name.charAt(0).toUpperCase() + v.name.slice(1)}s**: ${v.options.join(', ')}${v.defaultValue ? ` (default: ${v.defaultValue})` : ''}`)
        }
        lines.push('')
      }

      // Props table (from COMPONENT_META)
      if (meta?.props?.length > 0) {
        lines.push('| Prop | Type | Default | Description |')
        lines.push('|------|------|---------|-------------|')
        for (const p of meta.props) {
          const defaultVal = p.defaultValue || '\u2014'
          // Escape pipe characters in type strings
          const type = p.type.replace(/\|/g, '\\|')
          lines.push(`| ${p.name} | ${type} | ${defaultVal} | ${p.description} |`)
        }
        lines.push('')
      }

      // Examples (from COMPONENT_META)
      if (meta?.examples?.length > 0) {
        lines.push('**Examples**:')
        for (const ex of meta.examples) {
          lines.push(`- **${ex.title}**: ${ex.description}`)
          lines.push('```jsx')
          lines.push(ex.code)
          lines.push('```')
        }
        lines.push('')
      }

      lines.push('---')
      lines.push('')
    }
  }

  return lines.join('\n')
}

// ============================================================================
// SKILL.MD UPDATE
// ============================================================================

function updateSkillMd(filePath, catalog) {
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipped (file not found): ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const markerIndex = content.indexOf(MARKER)

  let newContent
  if (markerIndex !== -1) {
    // Replace everything after the marker
    newContent = content.slice(0, markerIndex) + MARKER + '\n\n' + catalog
  } else {
    // Append marker + catalog at the end
    newContent = content.trimEnd() + '\n\n' + MARKER + '\n\n' + catalog
  }

  fs.writeFileSync(filePath, newContent, 'utf-8')
  return true
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log('Syncing component catalog to myoperator-design SKILL.md...\n')
  console.log(`YAML source: ${COMPONENTS_YAML}`)
  console.log(`SKILL.md source: ${SKILL_MD_SOURCE}`)
  console.log(`Mode: ${shouldWrite ? 'WRITE' : 'DRY RUN (use --write to update)'}\n`)

  // Read and parse components.yaml
  if (!fs.existsSync(COMPONENTS_YAML)) {
    console.error('Could not find components.yaml at:', COMPONENTS_YAML)
    process.exit(1)
  }

  const yamlContent = fs.readFileSync(COMPONENTS_YAML, 'utf-8')
  const { categories, components } = parseComponentsYaml(yamlContent)

  const catCount = Object.keys(categories).length
  const compCount = Object.keys(components).length
  const metaCount = Object.keys(components).filter(n => COMPONENT_META[n]).length

  console.log(`Parsed ${compCount} components across ${catCount} categories`)
  console.log(`  ${metaCount} with rich metadata (props/variants/examples)`)
  console.log(`  ${compCount - metaCount} with basic metadata from YAML only\n`)

  // Generate catalog
  const catalog = generateCatalog(categories, components)

  if (!shouldWrite) {
    console.log('--- CATALOG PREVIEW ---\n')
    // Show first 80 lines
    const previewLines = catalog.split('\n').slice(0, 80)
    console.log(previewLines.join('\n'))
    if (catalog.split('\n').length > 80) {
      console.log(`\n... (${catalog.split('\n').length - 80} more lines)\n`)
    }
    console.log('--- END PREVIEW ---\n')
    console.log('Run with --write to update SKILL.md files:')
    console.log('  node scripts/sync-design-skill.js --write')
    return
  }

  // Write to source SKILL.md
  console.log('Updating SKILL.md files...')
  const sourceUpdated = updateSkillMd(SKILL_MD_SOURCE, catalog)
  if (sourceUpdated) {
    console.log(`  Updated: ${SKILL_MD_SOURCE}`)
  }

  // Write to GitHub distribution repo SKILL.md (if present)
  const distUpdated = updateSkillMd(SKILL_MD_DIST, catalog)
  if (distUpdated) {
    console.log(`  Updated dist: ${SKILL_MD_DIST}`)
  } else if (!fs.existsSync(SKILL_MD_DIST)) {
    console.log(`  Dist repo not found (OK): ${path.dirname(SKILL_MD_DIST)}`)
  }

  // Write to cache SKILL.md (find the version directory)
  if (fs.existsSync(SKILL_MD_CACHE)) {
    const versions = fs.readdirSync(SKILL_MD_CACHE).filter(d =>
      fs.statSync(path.join(SKILL_MD_CACHE, d)).isDirectory()
    )
    for (const version of versions) {
      const cachePath = path.join(
        SKILL_MD_CACHE,
        version,
        'skills/myoperator-design/SKILL.md'
      )
      const cacheUpdated = updateSkillMd(cachePath, catalog)
      if (cacheUpdated) {
        console.log(`  Updated cache: ${cachePath}`)
      }
    }
  } else {
    console.log(`  Cache directory not found (OK for CI): ${SKILL_MD_CACHE}`)
  }

  console.log(`\nDone! Catalog has ${catalog.split('\n').length} lines covering ${compCount} components.`)
}

main()
