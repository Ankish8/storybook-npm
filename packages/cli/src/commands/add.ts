import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { getRegistry } from '../utils/registry.js'
import { configExists, getTailwindPrefix } from '../utils/config.js'

interface AddOptions {
  all: boolean
  category?: string
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

  // If --all flag is used, add all components
  if (options.all) {
    components = availableComponents
    console.log(chalk.blue(`  Adding all ${components.length} components...\n`))
  }

  // If --category flag is used, add all components from that category
  if (options.category) {
    const validCategories = ['core', 'form', 'data', 'overlay', 'feedback', 'layout', 'custom']
    const categoryLower = options.category.toLowerCase()

    if (!validCategories.includes(categoryLower)) {
      console.log(chalk.red(`\n  Error: Unknown category: ${options.category}`))
      console.log(chalk.yellow(`  Available categories: ${validCategories.join(', ')}\n`))
      process.exit(1)
    }

    components = availableComponents.filter((name) => registry[name].category === categoryLower)

    if (components.length === 0) {
      console.log(chalk.yellow(`\n  No components found in category: ${categoryLower}\n`))
      process.exit(0)
    }

    console.log(chalk.blue(`  Adding all ${components.length} ${categoryLower} components...\n`))
  }

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

  // Normalize component names (convert PascalCase/camelCase to kebab-case)
  const normalizeComponentName = (name: string): string => {
    return name
      .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase -> kebab-case
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')  // XMLParser -> XML-Parser
      .toLowerCase()
  }

  // Map user input to available components
  components = components.map((c) => {
    const normalized = normalizeComponentName(c)
    // Check if normalized version exists
    if (availableComponents.includes(normalized)) {
      return normalized
    }
    // Check case-insensitive match
    const match = availableComponents.find(
      (available) => available.toLowerCase() === c.toLowerCase()
    )
    return match || c
  })

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
    const installed: { path: string; basePath: string }[] = []
    const dependencies: Set<string> = new Set()
    const installedComponents: Set<string> = new Set()

    // Helper function to install a single component
    const installComponent = async (componentName: string) => {
      // Skip if already installed in this session
      if (installedComponents.has(componentName)) {
        return
      }

      const component = registry[componentName]
      if (!component) {
        spinner.warn(`Component ${componentName} not found in registry`)
        return
      }

      // First, install internal dependencies (for multi-file components)
      if (component.internalDependencies && component.internalDependencies.length > 0) {
        spinner.text = `Installing dependencies for ${componentName}...`
        for (const depName of component.internalDependencies) {
          await installComponent(depName)
        }
      }

      spinner.text = `Installing ${componentName}...`

      // Determine base directory based on category
      const isCustomComponent = component.category === 'custom'
      const baseDir = isCustomComponent 
        ? path.join(cwd, 'src/components/custom')
        : componentsDir

      // Determine target directory
      const targetDir = component.isMultiFile
        ? path.join(baseDir, component.directory!)
        : baseDir

      // Check for existing files
      for (const file of component.files) {
        const filePath = path.join(targetDir, file.name)

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

        // Track installed file path relative to components dir
        const basePath = isCustomComponent ? 'src/components/custom' : options.path
        const relativePath = component.isMultiFile
          ? `${component.directory}/${file.name}`
          : file.name
        installed.push({ path: relativePath, basePath })
      }

      // Collect npm dependencies
      if (component.dependencies) {
        component.dependencies.forEach((dep) => dependencies.add(dep))
      }

      installedComponents.add(componentName)
    }

    // Install all requested components
    for (const componentName of components) {
      await installComponent(componentName)
    }

    spinner.succeed('Components installed successfully!')

    if (installed.length > 0) {
      console.log(chalk.green('\n  Installed files:'))
      installed.forEach((file) => {
        console.log(chalk.green(`    ✓ ${file.basePath}/${file.path}`))
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
