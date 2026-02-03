import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import { configExists, getTailwindPrefix } from '../utils/config.js'
import { ensureCustomComponentsInTailwindConfig } from '../utils/tailwind-fix.js'

export async function fix() {
  const cwd = process.cwd()

  console.log(chalk.bold('\n  myOperator UI - Fix Configuration\n'))

  // Check if project is initialized
  if (!(await configExists(cwd))) {
    console.log(chalk.red('  Error: Project not initialized.'))
    console.log(chalk.yellow('  Run `npx myoperator-ui init` first.\n'))
    process.exit(1)
  }

  const spinner = ora('Checking configuration...').start()

  let fixesApplied = 0

  try {
    // Get current Tailwind prefix from config
    const prefix = await getTailwindPrefix(cwd)

    // Detect tailwind.config.js location
    const tailwindConfigOptions = [
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.mjs',
      'tailwind.config.cjs',
    ]

    let tailwindConfigPath: string | null = null
    for (const configFile of tailwindConfigOptions) {
      const fullPath = path.join(cwd, configFile)
      if (await fs.pathExists(fullPath)) {
        tailwindConfigPath = fullPath
        break
      }
    }

    if (!tailwindConfigPath) {
      spinner.warn('No tailwind.config found - skipping Tailwind config check')
    } else {
      spinner.text = 'Checking Tailwind content paths...'

      // Use shared utility to fix custom components path
      const customPathFixed = await ensureCustomComponentsInTailwindConfig(cwd)
      if (customPathFixed) {
        fixesApplied++
      }

      // Check for semantic colors in Tailwind config
      const tailwindConfig = await fs.readFile(tailwindConfigPath, 'utf-8')
      if (!tailwindConfig.includes('semantic-text-primary')) {
        console.log(chalk.yellow('\n  ⚠️  Tailwind config missing semantic color tokens'))
        console.log(chalk.white('  Run `npx myoperator-ui init` to regenerate with full color set'))
      }
    }

    // Check theme CSS file
    const themeFilePath = path.join(cwd, 'src/lib/myoperator-ui-theme.css')
    if (!(await fs.pathExists(themeFilePath))) {
      console.log(chalk.yellow('\n  ⚠️  Theme file missing: src/lib/myoperator-ui-theme.css'))
      console.log(chalk.white('  Run `npx myoperator-ui init` to create it'))
    } else {
      const themeContent = await fs.readFile(themeFilePath, 'utf-8')
      if (!themeContent.includes('--semantic-info-surface')) {
        console.log(chalk.yellow('\n  ⚠️  Theme file outdated - missing semantic variables'))
        console.log(chalk.white('  Run `npx myoperator-ui init` to update it'))
      }
    }

    if (fixesApplied > 0) {
      spinner.succeed(`Applied ${fixesApplied} fix(es)!`)
    } else {
      spinner.succeed('Configuration looks good!')
    }

    // Show prefix info
    if (prefix) {
      console.log(chalk.blue(`\n  ℹ Tailwind prefix: "${prefix}"`))
    }

    console.log('')
  } catch (error) {
    spinner.fail('Fix check failed')
    console.error(error)
    process.exit(1)
  }
}
