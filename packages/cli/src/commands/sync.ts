import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { getRegistry } from '../utils/registry.js'
import { configExists, getTailwindPrefix, ensureUtilsPrefixConfig } from '../utils/config.js'
import { MYOPERATOR_THEME_CSS, getTailwindConfig } from './init.js'

interface SyncOptions {
  yes: boolean
  path: string
}

export async function sync(options: SyncOptions) {
  const cwd = process.cwd()

  // Check if project is initialized
  if (!(await configExists(cwd))) {
    console.log(chalk.red('\n  Error: Project not initialized.'))
    console.log(chalk.yellow('  Run `npx myoperator-ui init` first.\n'))
    process.exit(1)
  }

  // Get prefix from config
  const prefix = await getTailwindPrefix(cwd)

  if (prefix) {
    console.log(chalk.blue(`\n  ℹ Applying Tailwind prefix: "${prefix}"\n`))
  }

  // Get available components with prefix applied (exclude template-only components)
  const registry = await getRegistry(prefix)
  const availableComponents = Object.keys(registry).filter(
    (name) => !registry[name].templateOnly
  )

  console.log(chalk.blue(`  Scanning for ${availableComponents.length} components...\n`))

  const toAdd: string[] = []
  const toUpdate: string[] = []
  const upToDate: string[] = []

  // Check each component
  for (const componentName of availableComponents) {
    const component = registry[componentName]
    const componentsDir = path.join(cwd, options.path)

    const groupPrefix = component.group || ''
    const targetDir = component.isMultiFile
      ? path.join(componentsDir, groupPrefix, component.directory!)
      : path.join(componentsDir, groupPrefix)

    // Check if main file exists
    const mainFileName = component.isMultiFile ? component.mainFile : component.files[0]?.name
    if (!mainFileName) continue

    const mainFilePath = path.join(targetDir, mainFileName)
    const exists = await fs.pathExists(mainFilePath)

    if (!exists) {
      toAdd.push(componentName)
    } else {
      // Normalize content for comparison: trim lines, normalize line endings
      const normalizeForComparison = (content: string) =>
        content
          .replace(/\r\n/g, '\n') // Normalize line endings
          .split('\n')
          .map((line) => line.trimEnd()) // Remove trailing whitespace from each line
          .join('\n')
          .trim() // Remove leading/trailing whitespace

      // Check ALL files for multi-file components, not just main file
      let needsUpdate = false
      for (const registryFile of component.files) {
        const filePath = path.join(targetDir, registryFile.name)
        const fileExists = await fs.pathExists(filePath)

        if (!fileExists) {
          // Missing file = needs update
          needsUpdate = true
          break
        }

        const existingContent = await fs.readFile(filePath, 'utf-8')
        const existingNormalized = normalizeForComparison(existingContent)
        const registryNormalized = normalizeForComparison(registryFile.content)

        if (existingNormalized !== registryNormalized) {
          needsUpdate = true
          break
        }
      }

      if (needsUpdate) {
        toUpdate.push(componentName)
      } else {
        upToDate.push(componentName)
      }
    }
  }

  // Orphan detection: find files/dirs in the components dir not owned by the current registry
  const knownFileNames = new Set<string>() // single-file filenames, e.g. "button.tsx"
  const knownDirNames = new Set<string>()  // multi-file directory names, e.g. "bank-details"
  const knownGroupDirs = new Set<string>() // group directory names, e.g. "ai-bot"
  for (const name of availableComponents) {
    const comp = registry[name]
    if (comp.group) {
      knownGroupDirs.add(comp.group)
    }
    if (comp.isMultiFile && comp.directory) {
      // If grouped, the top-level dir is the group, not the component dir
      if (!comp.group) {
        knownDirNames.add(comp.directory)
      }
    } else {
      const fn = comp.files[0]?.name
      if (fn) knownFileNames.add(fn)
    }
  }

  type OrphanEntry = {
    displayPath: string
    fullPath: string
    isDir: boolean
  }

  const orphaned: OrphanEntry[] = []
  const orphanScanDir = path.join(cwd, options.path)

  if (await fs.pathExists(orphanScanDir)) {
    const entries = await fs.readdir(orphanScanDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory() && !knownDirNames.has(entry.name) && !knownGroupDirs.has(entry.name)) {
        orphaned.push({
          displayPath: `${options.path}/${entry.name}/`,
          fullPath: path.join(orphanScanDir, entry.name),
          isDir: true,
        })
      } else if (entry.isFile() && entry.name.endsWith('.tsx') && !knownFileNames.has(entry.name)) {
        orphaned.push({
          displayPath: `${options.path}/${entry.name}`,
          fullPath: path.join(orphanScanDir, entry.name),
          isDir: false,
        })
      }
    }
  }

  // Summary
  console.log(chalk.cyan('  Summary:'))
  console.log(chalk.green(`    New components to add: ${toAdd.length}`))
  console.log(chalk.yellow(`    Components to update: ${toUpdate.length}`))
  console.log(chalk.gray(`    Already up to date: ${upToDate.length}`))
  if (orphaned.length > 0) {
    console.log(chalk.red(`    Not in current registry: ${orphaned.length}`))
  }
  console.log('')

  // Check utils.ts prefix configuration (before early return so it always runs)
  if (prefix) {
    const utilsResult = await ensureUtilsPrefixConfig(cwd)
    if (utilsResult.fixed) {
      if (utilsResult.existed) {
        console.log(chalk.green('  ✓ Fixed src/lib/utils.ts — cn() is now prefix-aware\n'))
      } else {
        console.log(chalk.green('  ✓ Created src/lib/utils.ts with prefix-aware cn()\n'))
      }
    }
  }

  // Check if tailwind.config.js needs new color tokens injected
  // Extract all semantic tokens from the template and inject any missing ones
  const tailwindConfigCandidates = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'tailwind.config.cjs']
  for (const candidate of tailwindConfigCandidates) {
    const configPath = path.join(cwd, candidate)
    if (await fs.pathExists(configPath)) {
      let configContent = await fs.readFile(configPath, 'utf-8')

      // Extract ordered list of all semantic color tokens from the template
      const templateConfig = getTailwindConfig('', false)
      const templateTokens: Array<{ key: string; value: string }> = []
      for (const m of templateConfig.matchAll(/"(semantic-[^"]+)":\s*"([^"]+)"/g)) {
        templateTokens.push({ key: m[1], value: m[2] })
      }

      // Find which tokens are missing from the consumer config
      const missingTokens = templateTokens.filter((t) => !configContent.includes(`"${t.key}"`))

      if (missingTokens.length > 0) {
        for (const token of missingTokens) {
          // Find the nearest preceding template token that exists in consumer config
          const idx = templateTokens.indexOf(token)
          let insertAfterKey: string | null = null
          for (let i = idx - 1; i >= 0; i--) {
            if (configContent.includes(`"${templateTokens[i].key}"`)) {
              insertAfterKey = templateTokens[i].key
              break
            }
          }
          if (insertAfterKey) {
            // Insert the new token on the line after its nearest existing neighbour
            configContent = configContent.replace(
              new RegExp(`("${insertAfterKey}":[^\\n]*)`),
              `$1\n        "${token.key}": "${token.value}",`
            )
          }
        }
        await fs.writeFile(configPath, configContent)
        console.log(chalk.green(`  ✓ Updated ${candidate} (${missingTokens.length} new color token${missingTokens.length === 1 ? '' : 's'} added)\n`))
      } else {
        console.log(chalk.gray(`  ✓ ${candidate} color tokens up to date\n`))
      }
      break
    }
  }

  // Check if theme file needs updating — detect any missing CSS variables
  const themeFilePath = path.join(cwd, 'src/lib/myoperator-ui-theme.css')
  if (await fs.pathExists(themeFilePath)) {
    const existingTheme = await fs.readFile(themeFilePath, 'utf-8')
    const extractVars = (css: string) => new Set(
      [...css.matchAll(/--[\w-]+\s*:/g)].map((m) => m[0].replace(/\s*:$/, ''))
    )
    const templateVars = extractVars(MYOPERATOR_THEME_CSS)
    const existingVars = extractVars(existingTheme)
    const missingVars = [...templateVars].filter((v) => !existingVars.has(v))
    if (missingVars.length > 0) {
      await fs.writeFile(themeFilePath, MYOPERATOR_THEME_CSS)
      console.log(chalk.green(`  ✓ Updated src/lib/myoperator-ui-theme.css (${missingVars.length} new token${missingVars.length === 1 ? '' : 's'} added)\n`))
    } else {
      console.log(chalk.gray(`  ✓ src/lib/myoperator-ui-theme.css tokens up to date\n`))
    }
  }

  if (toAdd.length === 0 && toUpdate.length === 0 && orphaned.length === 0) {
    console.log(chalk.green('  ✓ All components are up to date!\n'))
    return
  }

  // Let user pick which components to add/update
  let selectedToAdd = toAdd
  let selectedToUpdate = toUpdate

  // Storybook group mapping for custom components
  const CUSTOM_GROUPS: Record<string, string> = {
    'attachment-preview': 'Chat',
    'audio-media': 'Chat',
    'carousel-media': 'Chat',
    'chat-bubble': 'Chat',
    'chat-composer': 'Chat',
    'contact-list-item': 'Chat',
    'date-divider': 'Chat',
    'doc-media': 'Chat',
    'image-media': 'Chat',
    'reply-quote': 'Chat',
    'system-message': 'Chat',
    'unread-separator': 'Chat',
    'video-media': 'Chat',
    'event-selector': 'Webhook',
    'key-value-input': 'Webhook',
    'api-feature-card': 'Webhook',
    'endpoint-details': 'Webhook',
    'alert-configuration': 'Webhook',
    'auto-pay-setup': 'Plan & Payment',
    'bank-details': 'Plan & Payment',
    'date-range-modal': 'Plan & Payment',
    'payment-option-card': 'Plan & Payment',
    'plan-upgrade-modal': 'Plan & Payment',
    'plan-upgrade-summary-modal': 'Plan & Payment',
    'payment-summary': 'Plan & Payment',
    'let-us-drive-card': 'Plan & Payment',
    'power-up-card': 'Plan & Payment',
    'pricing-card': 'Plan & Payment',
    'pricing-page': 'Plan & Payment',
    'pricing-toggle': 'Plan & Payment',
    'talk-to-us-modal': 'Plan & Payment',
    'wallet-topup': 'Plan & Payment',
    'file-upload-modal': 'Plan & Payment',
    'plan-detail-modal': 'Plan & Payment',
    'bots': 'AI Bot',
    'ivr-bot': 'AI Bot',
  }

  if (!options.yes && toAdd.length > 0) {
    // Split into generic components and grouped (folder) components
    const uiToAdd = toAdd.filter((c) => !CUSTOM_GROUPS[c])
    const customToAdd = toAdd.filter((c) => !!CUSTOM_GROUPS[c])

    const picked: string[] = []

    // 1. UI Components prompt
    if (uiToAdd.length > 0) {
      console.log(chalk.cyan.bold('  ── Components ──\n'))
      const { selected } = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Select new components to add',
        choices: uiToAdd.map((c) => ({
          title: c,
          value: c,
          selected: false,
        })),
      })
      if (!selected) {
        console.log(chalk.yellow('\n  Sync cancelled.\n'))
        process.exit(0)
      }
      picked.push(...selected)
    }

    // 2. Custom Components prompt (folder-level selection like Storybook sidebar)
    if (customToAdd.length > 0) {
      // Group custom components by their Storybook folder
      const grouped = new Map<string, string[]>()
      for (const c of customToAdd) {
        const group = CUSTOM_GROUPS[c] || 'Other'
        if (!grouped.has(group)) grouped.set(group, [])
        grouped.get(group)!.push(c)
      }

      // Sort groups alphabetically
      const sortedGroups = [...grouped.keys()].sort()

      console.log(chalk.cyan.bold('\n  ── Custom ──\n'))
      const { selected } = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Select custom component folders to add',
        choices: sortedGroups.map((group) => {
          const components = grouped.get(group)!
          const count = components.length
          return {
            title: group,
            value: group,
            selected: false,
            description: `${count} component${count === 1 ? '' : 's'}`,
          }
        }),
      })
      if (!selected) {
        console.log(chalk.yellow('\n  Sync cancelled.\n'))
        process.exit(0)
      }
      // Expand selected folders into their component lists
      for (const group of selected as string[]) {
        picked.push(...grouped.get(group)!)
      }
    }

    selectedToAdd = picked
  }

  if (!options.yes && toUpdate.length > 0) {
    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Select components to update',
      choices: toUpdate.map((c) => {
        const comp = registry[c]
        const fileCount = comp.isMultiFile ? ` (${comp.files.length} files)` : ''
        return { title: `${c}${fileCount}`, value: c, selected: true }
      }),
    })
    if (!selected) {
      console.log(chalk.yellow('\n  Sync cancelled.\n'))
      process.exit(0)
    }
    selectedToUpdate = selected
  }

  if (selectedToAdd.length === 0 && selectedToUpdate.length === 0 && orphaned.length === 0) {
    console.log(chalk.green('\n  ✓ Nothing selected to sync.\n'))
    return
  }

  // Confirm final selection
  if (!options.yes && (selectedToAdd.length > 0 || selectedToUpdate.length > 0)) {
    if (selectedToAdd.length > 0) {
      console.log(chalk.green('\n  Will add:'))
      selectedToAdd.forEach((c: string) => {
        const comp = registry[c]
        const fileCount = comp.isMultiFile ? ` (${comp.files.length} files)` : ''
        console.log(chalk.green(`    + ${c}${fileCount}`))
      })
    }
    if (selectedToUpdate.length > 0) {
      console.log(chalk.yellow('\n  Will update:'))
      selectedToUpdate.forEach((c: string) => {
        const comp = registry[c]
        const fileCount = comp.isMultiFile ? ` (${comp.files.length} files)` : ''
        console.log(chalk.yellow(`    ~ ${c}${fileCount}`))
      })
    }
    console.log('')

    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Proceed with ${selectedToAdd.length} additions and ${selectedToUpdate.length} updates?`,
      initial: true,
    })

    if (!confirm) {
      console.log(chalk.yellow('\n  Sync cancelled.\n'))
      process.exit(0)
    }
  }

  if (selectedToAdd.length > 0 || selectedToUpdate.length > 0) {
    const spinner = ora('Syncing components...').start()

    try {
      const installed: { path: string; basePath: string; action: 'added' | 'updated' }[] = []
      const dependencies: Set<string> = new Set()
      const processedComponents: Set<string> = new Set()
      const componentsDir = path.join(cwd, options.path)

      // Helper function to install a single component
      const installComponent = async (componentName: string, action: 'added' | 'updated') => {
        if (processedComponents.has(componentName)) return

        const component = registry[componentName]
        if (!component) return

        // First, install internal dependencies
        if (component.internalDependencies && component.internalDependencies.length > 0) {
          for (const depName of component.internalDependencies) {
            // Only install dependency if it doesn't exist
            const depComponent = registry[depName]
            if (depComponent) {
              const depGroupPrefix = depComponent.group || ''
              const depTargetDir = depComponent.isMultiFile
                ? path.join(componentsDir, depGroupPrefix, depComponent.directory!)
                : path.join(componentsDir, depGroupPrefix)
              const depMainFile = depComponent.isMultiFile ? depComponent.mainFile : depComponent.files[0]?.name
              if (depMainFile) {
                const depExists = await fs.pathExists(path.join(depTargetDir, depMainFile))
                if (!depExists) {
                  await installComponent(depName, 'added')
                } else if (toUpdate.includes(depName) && !processedComponents.has(depName)) {
                  await installComponent(depName, 'updated')
                }
              }
            }
          }
        }

        spinner.text = `${action === 'added' ? 'Adding' : 'Updating'} ${componentName}...`

        const compGroupPrefix = component.group || ''
        const targetDir = component.isMultiFile
          ? path.join(componentsDir, compGroupPrefix, component.directory!)
          : path.join(componentsDir, compGroupPrefix)

        for (const file of component.files) {
          const filePath = path.join(targetDir, file.name)
          await fs.ensureDir(path.dirname(filePath))
          await fs.writeFile(filePath, file.content)

          const groupPart = component.group ? `${component.group}/` : ''
          const relativePath = component.isMultiFile
            ? `${groupPart}${component.directory}/${file.name}`
            : `${groupPart}${file.name}`
          installed.push({ path: relativePath, basePath: options.path, action })
        }

        if (component.dependencies) {
          component.dependencies.forEach((dep) => dependencies.add(dep))
        }

        processedComponents.add(componentName)
      }

      // Install new components
      for (const componentName of selectedToAdd) {
        await installComponent(componentName, 'added')
      }

      // Update existing components
      for (const componentName of selectedToUpdate) {
        await installComponent(componentName, 'updated')
      }

      spinner.succeed('Sync complete!')

      // Show results
      const added = installed.filter((f) => f.action === 'added')
      const updated = installed.filter((f) => f.action === 'updated')

      if (added.length > 0) {
        console.log(chalk.green('\n  Added:'))
        added.forEach((file) => {
          console.log(chalk.green(`    + ${file.basePath}/${file.path}`))
        })
      }

      if (updated.length > 0) {
        console.log(chalk.yellow('\n  Updated:'))
        updated.forEach((file) => {
          console.log(chalk.yellow(`    ~ ${file.basePath}/${file.path}`))
        })
      }

      if (dependencies.size > 0) {
        console.log(chalk.yellow('\n  Required dependencies:'))
        console.log(chalk.cyan(`    npm install ${Array.from(dependencies).join(' ')}`))
      }

      console.log('')
    } catch (error) {
      spinner.fail('Sync failed')
      console.error(error)
      process.exit(1)
    }
  }

  // Orphan handling: warn about unrecognized files and offer to remove them
  const ignorePath = path.join(cwd, '.myoperator-ui-ignore')
  let ignoredPaths: string[] = []
  if (await fs.pathExists(ignorePath)) {
    const raw = await fs.readFile(ignorePath, 'utf-8')
    ignoredPaths = raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  }

  const visibleOrphans = orphaned.filter((o) => !ignoredPaths.includes(o.displayPath))

  if (visibleOrphans.length > 0) {
    console.log(chalk.yellow('\n  ⚠  The following were not found in the current myOperator UI registry.'))
    console.log(chalk.gray('     They may be outdated components or your own custom files — review before deleting.\n'))
    visibleOrphans.forEach((o) => console.log(chalk.gray(`       ${o.isDir ? '📁' : '📄'} ${o.displayPath}`)))
    console.log('')

    if (options.yes) {
      console.log(chalk.gray('  Run sync without --yes to interactively choose which to remove.\n'))
    } else {
      const kept: OrphanEntry[] = []

      for (const item of visibleOrphans) {
        const icon = item.isDir ? '📁' : '📄'
        const { action } = await prompts({
          type: 'select',
          name: 'action',
          message: `${icon}  ${item.displayPath}`,
          choices: [
            { title: 'Keep  — leave it alone', value: 'keep' },
            { title: 'Delete — permanently remove it', value: 'delete' },
            { title: 'Ignore — keep and never ask again', value: 'ignore' },
          ],
        })

        if (action === 'delete') {
          await fs.remove(item.fullPath)
          console.log(chalk.red(`  ✕ Deleted ${item.displayPath}`))
        } else if (action === 'ignore') {
          kept.push(item)
          const header = ignoredPaths.length === 0
            ? '# myOperator UI — paths to skip in orphan detection (one per line)\n'
            : ''
          await fs.appendFile(ignorePath, header + item.displayPath + '\n')
          ignoredPaths.push(item.displayPath)
          console.log(chalk.green(`  ✓ ${item.displayPath} added to .myoperator-ui-ignore`))
        } else {
          // 'keep' or prompt dismissed
          kept.push(item)
          console.log(chalk.gray(`  · Kept ${item.displayPath}`))
        }
      }

      console.log('')
    }
  }
}
