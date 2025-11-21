import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'

const DEFAULT_CONFIG = {
  $schema: 'https://myoperator.com/schema.json',
  style: 'default',
  tailwind: {
    config: 'tailwind.config.js',
    css: 'src/index.css',
    baseColor: 'slate',
    cssVariables: true,
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
    ui: '@/components/ui',
  },
}

export async function init() {
  console.log(chalk.bold('\n  Welcome to myOperator UI!\n'))

  const cwd = process.cwd()
  const configPath = path.join(cwd, 'components.json')

  // Check if config already exists
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Overwrite?',
      initial: false,
    })

    if (!overwrite) {
      console.log(chalk.yellow('  Initialization cancelled.\n'))
      process.exit(0)
    }
  }

  // Get user preferences
  const response = await prompts([
    {
      type: 'text',
      name: 'componentsPath',
      message: 'Where would you like to install components?',
      initial: 'src/components/ui',
    },
    {
      type: 'text',
      name: 'utilsPath',
      message: 'Where is your utils file?',
      initial: 'src/lib/utils.ts',
    },
    {
      type: 'text',
      name: 'tailwindConfig',
      message: 'Where is your tailwind.config.js?',
      initial: 'tailwind.config.js',
    },
    {
      type: 'text',
      name: 'globalCss',
      message: 'Where is your global CSS file?',
      initial: 'src/index.css',
    },
  ])

  const spinner = ora('Initializing project...').start()

  try {
    // Create config
    const config = {
      ...DEFAULT_CONFIG,
      tailwind: {
        ...DEFAULT_CONFIG.tailwind,
        config: response.tailwindConfig,
        css: response.globalCss,
      },
      aliases: {
        ...DEFAULT_CONFIG.aliases,
        ui: `@/${response.componentsPath.replace('src/', '')}`,
      },
    }

    await fs.writeJson(configPath, config, { spaces: 2 })

    // Create utils file if it doesn't exist
    const utilsPath = path.join(cwd, response.utilsPath)
    if (!(await fs.pathExists(utilsPath))) {
      await fs.ensureDir(path.dirname(utilsPath))
      await fs.writeFile(
        utilsPath,
        `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      )
    }

    // Create components directory
    const componentsPath = path.join(cwd, response.componentsPath)
    await fs.ensureDir(componentsPath)

    spinner.succeed('Project initialized successfully!')

    console.log(chalk.green('\n  ✓ Created components.json'))
    console.log(chalk.green(`  ✓ Created ${response.utilsPath}`))
    console.log(chalk.green(`  ✓ Created ${response.componentsPath}\n`))

    console.log(chalk.bold('  Next steps:\n'))
    console.log('  1. Install dependencies:')
    console.log(chalk.cyan('     npm install clsx tailwind-merge class-variance-authority\n'))
    console.log('  2. Add your first component:')
    console.log(chalk.cyan('     npx myoperator-ui add button\n'))
  } catch (error) {
    spinner.fail('Failed to initialize project')
    console.error(error)
    process.exit(1)
  }
}
