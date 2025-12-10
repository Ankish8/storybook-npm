import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { getRegistry } from '../utils/registry.js'
import { configExists, getTailwindPrefix } from '../utils/config.js'

interface UpdateOptions {
  yes: boolean
  dryRun: boolean
  all: boolean
  path: string
  backup: boolean
}

/**
 * Normalize content for comparison - removes trailing whitespace and normalizes line endings
 */
function normalizeContent(content: string): string {
  return content
    .split('\n')
    .map(line => line.trimEnd()) // Remove trailing whitespace from each line
    .join('\n')
    .replace(/\r\n/g, '\n') // Normalize line endings
    .trimEnd() // Remove trailing newlines
}

/**
 * Check if two contents are meaningfully different (ignoring whitespace)
 */
function hasRealChanges(oldContent: string, newContent: string): boolean {
  return normalizeContent(oldContent) !== normalizeContent(newContent)
}

/**
 * Simple diff function to show changes between two strings
 */
function generateDiff(oldContent: string, newContent: string, filename: string): string {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')

  if (!hasRealChanges(oldContent, newContent)) {
    return chalk.gray(`  ${filename}: No changes`)
  }

  const changes: string[] = []
  changes.push(chalk.cyan(`\n  --- ${filename} (current)`))
  changes.push(chalk.cyan(`  +++ ${filename} (new)\n`))

  // Simple line-by-line comparison
  const maxLines = Math.max(oldLines.length, newLines.length)
  let hasChanges = false
  let contextBuffer: string[] = []
  let inChange = false

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]

    if (oldLine !== newLine) {
      hasChanges = true
      // Print context buffer (lines before change)
      if (contextBuffer.length > 0 && !inChange) {
        const startContext = Math.max(0, contextBuffer.length - 2)
        for (let j = startContext; j < contextBuffer.length; j++) {
          changes.push(chalk.gray(`  ${i - contextBuffer.length + j + 1}: ${contextBuffer[j]}`))
        }
      }
      inChange = true
      contextBuffer = []

      if (oldLine !== undefined) {
        changes.push(chalk.red(`  - ${i + 1}: ${oldLine}`))
      }
      if (newLine !== undefined) {
        changes.push(chalk.green(`  + ${i + 1}: ${newLine}`))
      }
    } else {
      if (inChange) {
        // Show 1 line of context after change
        changes.push(chalk.gray(`  ${i + 1}: ${oldLine}`))
        inChange = false
      }
      contextBuffer.push(oldLine || '')
      if (contextBuffer.length > 3) {
        contextBuffer.shift()
      }
    }
  }

  if (!hasChanges) {
    return chalk.gray(`  ${filename}: No changes`)
  }

  return changes.join('\n')
}

export async function update(components: string[], options: UpdateOptions) {
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
    console.log(chalk.blue(`\n  ℹ Using Tailwind prefix: "${prefix}"\n`))
  }

  // Get available components with prefix applied
  const registry = await getRegistry(prefix)
  const availableComponents = Object.keys(registry)

  // Get components directory
  const componentsDir = path.join(cwd, options.path)

  // If --all flag, update all installed components
  if (options.all) {
    const installedComponents: string[] = []
    for (const name of availableComponents) {
      const component = registry[name]
      const filePath = path.join(componentsDir, component.files[0].name)
      if (await fs.pathExists(filePath)) {
        installedComponents.push(name)
      }
    }

    if (installedComponents.length === 0) {
      console.log(chalk.yellow('\n  No installed components found to update.\n'))
      process.exit(0)
    }

    components = installedComponents
    console.log(chalk.blue(`  Found ${installedComponents.length} installed component(s)\n`))
  }

  // If no components specified and not --all, show selection of installed components
  if (!components || components.length === 0) {
    const installedComponents: string[] = []
    for (const name of availableComponents) {
      const component = registry[name]
      const filePath = path.join(componentsDir, component.files[0].name)
      if (await fs.pathExists(filePath)) {
        installedComponents.push(name)
      }
    }

    if (installedComponents.length === 0) {
      console.log(chalk.yellow('\n  No installed components found to update.\n'))
      process.exit(0)
    }

    const { selectedComponents } = await prompts({
      type: 'multiselect',
      name: 'selectedComponents',
      message: 'Which components would you like to update?',
      choices: installedComponents.map((name) => ({
        title: name,
        value: name,
        description: registry[name].description,
      })),
      min: 1,
    })

    if (!selectedComponents || selectedComponents.length === 0) {
      console.log(chalk.yellow('\n  No components selected.\n'))
      process.exit(0)
    }

    components = selectedComponents
  }

  // Validate components exist in registry
  const invalidComponents = components.filter((c) => !availableComponents.includes(c))
  if (invalidComponents.length > 0) {
    console.log(chalk.red(`\n  Error: Unknown components: ${invalidComponents.join(', ')}`))
    console.log(chalk.yellow(`  Available: ${availableComponents.join(', ')}\n`))
    process.exit(1)
  }

  // Check which components are actually installed
  const notInstalled: string[] = []
  const toUpdate: string[] = []

  for (const name of components) {
    const component = registry[name]
    const filePath = path.join(componentsDir, component.files[0].name)
    if (await fs.pathExists(filePath)) {
      toUpdate.push(name)
    } else {
      notInstalled.push(name)
    }
  }

  if (notInstalled.length > 0) {
    console.log(chalk.yellow(`\n  Components not installed (use 'add' instead): ${notInstalled.join(', ')}`))
  }

  if (toUpdate.length === 0) {
    console.log(chalk.yellow('\n  No installed components to update.\n'))
    process.exit(0)
  }

  // Show diff for each component
  console.log(chalk.bold('\n  Changes to be applied:\n'))

  const changesInfo: { name: string; file: string; oldContent: string; newContent: string; hasChanges: boolean }[] = []

  for (const componentName of toUpdate) {
    const component = registry[componentName]

    for (const file of component.files) {
      const filePath = path.join(componentsDir, file.name)
      const oldContent = await fs.readFile(filePath, 'utf-8')
      const newContent = file.content

      const hasChanges = hasRealChanges(oldContent, newContent)
      changesInfo.push({ name: componentName, file: file.name, oldContent, newContent, hasChanges })

      const diff = generateDiff(oldContent, newContent, file.name)
      console.log(diff)
    }
  }

  const componentsWithChanges = changesInfo.filter(c => c.hasChanges)

  if (componentsWithChanges.length === 0) {
    console.log(chalk.green('\n  ✓ All components are already up to date!\n'))
    process.exit(0)
  }

  console.log(chalk.bold(`\n  ${componentsWithChanges.length} file(s) will be updated.\n`))

  // Dry run - just show what would change
  if (options.dryRun) {
    console.log(chalk.blue('  Dry run complete. No files were modified.\n'))
    process.exit(0)
  }

  // Confirm update
  if (!options.yes) {
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Update ${componentsWithChanges.length} file(s)?`,
      initial: true,
    })

    if (!confirm) {
      console.log(chalk.yellow('\n  Update cancelled.\n'))
      process.exit(0)
    }
  }

  const spinner = ora('Updating components...').start()

  try {
    const updated: string[] = []
    const backedUp: string[] = []

    for (const change of componentsWithChanges) {
      const filePath = path.join(componentsDir, change.file)

      // Create backup if requested
      if (options.backup) {
        const backupPath = `${filePath}.backup.${Date.now()}`
        await fs.copy(filePath, backupPath)
        backedUp.push(change.file)
      }

      // Write new content
      await fs.writeFile(filePath, change.newContent)
      updated.push(change.file)
    }

    spinner.succeed('Components updated successfully!')

    if (backedUp.length > 0) {
      console.log(chalk.blue('\n  Backed up files:'))
      backedUp.forEach((file) => {
        console.log(chalk.blue(`    📁 ${options.path}/${file}.backup.*`))
      })
    }

    if (updated.length > 0) {
      console.log(chalk.green('\n  Updated files:'))
      updated.forEach((file) => {
        console.log(chalk.green(`    ✓ ${options.path}/${file}`))
      })
    }

    console.log('')
  } catch (error) {
    spinner.fail('Failed to update components')
    console.error(error)
    process.exit(1)
  }
}
