import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { getRegistry, type ComponentDefinition } from '../utils/registry.js'
import { readConfig, configExists, getTailwindPrefix } from '../utils/config.js'

interface AddOptions {
  yes: boolean
  overwrite: boolean
  path: string
}

export async function add(components: string[], options: AddOptions) {
  const cwd = process.cwd()

  // Check if project is initialized
  if (!(await configExists(cwd))) {
    console.log(chalk.red('\n  Error: Project not initialized.'))
    console.log(chalk.yellow('  Run `npx myoperator-ui init` first.\n'))
    process.exit(1)
  }

  // Get prefix from config
  const prefix = await getTailwindPrefix(cwd)
  
  // Show prefix info
  if (prefix) {
    console.log(chalk.blue(`\n  ℹ Applying Tailwind prefix: "${prefix}"\n`))
  }

  // Get available components with prefix applied
  const registry = await getRegistry(prefix)
  const availableComponents = Object.keys(registry)

  // If no components specified, show selection
  if (!components || components.length === 0) {
    const { selectedComponents } = await prompts({
      type: 'multiselect',
      name: 'selectedComponents',
      message: 'Which components would you like to add?',
      choices: availableComponents.map((name) => ({
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

  // Validate components
  const invalidComponents = components.filter((c) => !availableComponents.includes(c))
  if (invalidComponents.length > 0) {
    console.log(chalk.red(`\n  Error: Unknown components: ${invalidComponents.join(', ')}`))
    console.log(chalk.yellow(`  Available: ${availableComponents.join(', ')}\n`))
    process.exit(1)
  }

  // Get components directory
  const componentsDir = path.join(cwd, options.path)

  // Confirm installation
  if (!options.yes) {
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Add ${components.length} component(s) to ${options.path}?`,
      initial: true,
    })

    if (!confirm) {
      console.log(chalk.yellow('\n  Installation cancelled.\n'))
      process.exit(0)
    }
  }

  console.log('')
  const spinner = ora('Installing components...').start()

  try {
    const installed: string[] = []
    const dependencies: Set<string> = new Set()

    for (const componentName of components) {
      const component = registry[componentName]

      // Check for existing files
      for (const file of component.files) {
        const filePath = path.join(componentsDir, file.name)

        if (await fs.pathExists(filePath)) {
          if (!options.overwrite) {
            spinner.warn(`${file.name} already exists. Use --overwrite to replace.`)
            continue
          }
        }

        // Ensure directory exists
        await fs.ensureDir(path.dirname(filePath))

        // Write file
        await fs.writeFile(filePath, file.content)
        installed.push(file.name)
      }

      // Collect dependencies
      if (component.dependencies) {
        component.dependencies.forEach((dep) => dependencies.add(dep))
      }
    }

    spinner.succeed('Components installed successfully!')

    if (installed.length > 0) {
      console.log(chalk.green('\n  Installed files:'))
      installed.forEach((file) => {
        console.log(chalk.green(`    ✓ ${options.path}/${file}`))
      })
    }

    if (dependencies.size > 0) {
      console.log(chalk.yellow('\n  Required dependencies:'))
      console.log(chalk.cyan(`    npm install ${Array.from(dependencies).join(' ')}`))
    }

    console.log('')
  } catch (error) {
    spinner.fail('Failed to install components')
    console.error(error)
    process.exit(1)
  }
}
