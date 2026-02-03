import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { getRegistry } from '../utils/registry.js'
import { configExists, getTailwindPrefix } from '../utils/config.js'
import { ensureCustomComponentsInTailwindConfig } from '../utils/tailwind-fix.js'

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

  // Get available components with prefix applied
  const registry = await getRegistry(prefix)
  const availableComponents = Object.keys(registry)

  console.log(chalk.blue(`  Scanning for ${availableComponents.length} components...\n`))

  const toAdd: string[] = []
  const toUpdate: string[] = []
  const upToDate: string[] = []

  // Check each component
  for (const componentName of availableComponents) {
    const component = registry[componentName]
    const isCustomComponent = component.category === 'custom'
    const baseDir = isCustomComponent
      ? path.join(cwd, 'src/components/custom')
      : path.join(cwd, options.path)

    const targetDir = component.isMultiFile
      ? path.join(baseDir, component.directory!)
      : baseDir

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

  // Summary
  console.log(chalk.cyan('  Summary:'))
  console.log(chalk.green(`    New components to add: ${toAdd.length}`))
  console.log(chalk.yellow(`    Components to update: ${toUpdate.length}`))
  console.log(chalk.gray(`    Already up to date: ${upToDate.length}`))
  console.log('')

  if (toAdd.length === 0 && toUpdate.length === 0) {
    console.log(chalk.green('  ✓ All components are up to date!\n'))
    return
  }

  // Show what will change
  if (toAdd.length > 0) {
    console.log(chalk.green('  Will add:'))
    toAdd.forEach((c) => console.log(chalk.green(`    + ${c}`)))
    console.log('')
  }

  if (toUpdate.length > 0) {
    console.log(chalk.yellow('  Will update:'))
    toUpdate.forEach((c) => console.log(chalk.yellow(`    ~ ${c}`)))
    console.log('')
  }

  // Confirm
  if (!options.yes) {
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Proceed with ${toAdd.length} additions and ${toUpdate.length} updates?`,
      initial: true,
    })

    if (!confirm) {
      console.log(chalk.yellow('\n  Sync cancelled.\n'))
      process.exit(0)
    }
  }

  const spinner = ora('Syncing components...').start()

  try {
    const installed: { path: string; basePath: string; action: 'added' | 'updated' }[] = []
    const dependencies: Set<string> = new Set()
    const processedComponents: Set<string> = new Set()

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
            const depIsCustom = depComponent.category === 'custom'
            const depBaseDir = depIsCustom
              ? path.join(cwd, 'src/components/custom')
              : path.join(cwd, options.path)
            const depTargetDir = depComponent.isMultiFile
              ? path.join(depBaseDir, depComponent.directory!)
              : depBaseDir
            const depMainFile = depComponent.isMultiFile ? depComponent.mainFile : depComponent.files[0]?.name
            if (depMainFile) {
              const depExists = await fs.pathExists(path.join(depTargetDir, depMainFile))
              if (!depExists) {
                await installComponent(depName, 'added')
              }
            }
          }
        }
      }

      spinner.text = `${action === 'added' ? 'Adding' : 'Updating'} ${componentName}...`

      const isCustomComponent = component.category === 'custom'
      const baseDir = isCustomComponent
        ? path.join(cwd, 'src/components/custom')
        : path.join(cwd, options.path)

      const targetDir = component.isMultiFile
        ? path.join(baseDir, component.directory!)
        : baseDir

      for (const file of component.files) {
        const filePath = path.join(targetDir, file.name)
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, file.content)

        const basePath = isCustomComponent ? 'src/components/custom' : options.path
        const relativePath = component.isMultiFile
          ? `${component.directory}/${file.name}`
          : file.name
        installed.push({ path: relativePath, basePath, action })
      }

      if (component.dependencies) {
        component.dependencies.forEach((dep) => dependencies.add(dep))
      }

      processedComponents.add(componentName)
    }

    // Install new components
    for (const componentName of toAdd) {
      await installComponent(componentName, 'added')
    }

    // Update existing components
    for (const componentName of toUpdate) {
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

    // Automatically fix Tailwind config when custom components are installed
    const hasCustomComponents = installed.some((file) => file.basePath.includes('custom'))
    if (hasCustomComponents) {
      await ensureCustomComponentsInTailwindConfig(cwd)
    }

    console.log('')
  } catch (error) {
    spinner.fail('Sync failed')
    console.error(error)
    process.exit(1)
  }
}
