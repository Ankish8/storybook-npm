import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'
import { execSync } from 'child_process'
import { DEFAULT_CONFIG, detectTailwindPrefix as detectTailwindPrefixUtil } from '../utils/config.js'

// Tailwind CSS v4 format - standalone (with Preflight)
const CSS_VARIABLES_V4 = `@import "tailwindcss";

@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(222.2 84% 4.9%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(222.2 47.4% 11.2%);
  --color-primary-foreground: hsl(210 40% 98%);
  --color-secondary: hsl(210 40% 96.1%);
  --color-secondary-foreground: hsl(222.2 47.4% 11.2%);
  --color-muted: hsl(210 40% 96.1%);
  --color-muted-foreground: hsl(215.4 16.3% 46.9%);
  --color-accent: hsl(210 40% 96.1%);
  --color-accent-foreground: hsl(222.2 47.4% 11.2%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(210 40% 98%);
  --color-border: hsl(214.3 31.8% 91.4%);
  --color-input: hsl(214.3 31.8% 91.4%);
  --color-ring: hsl(222.2 84% 4.9%);
  --radius: 0.5rem;
}

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
`

// Tailwind CSS v4 format for Bootstrap/other frameworks
// Uses selective imports (no Preflight) to avoid conflicts with Bootstrap
// Note: prefix() doesn't work with selective imports in Tailwind v4
const CSS_VARIABLES_V4_BOOTSTRAP = `/* myOperator UI - Tailwind CSS for Bootstrap projects */
/* Selective imports to avoid Preflight conflicts with Bootstrap */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

/* Tell Tailwind to scan component files for utility classes */
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "./lib/**/*.{js,ts,jsx,tsx}";

/* End myOperator UI imports */

`

// Tailwind CSS v3 format (legacy)
const CSS_VARIABLES_V3 = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset Bootstrap button styles for myOperator UI components */
@layer components {
  .inline-flex[class*="rounded"],
  button.bg-\\[\\#343E55\\],
  button.bg-\\[\\#E8EAED\\],
  button.bg-transparent {
    border: none;
    box-shadow: none;
  }
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

`

const getTailwindConfig = (prefix: string = 'tw-', hasBootstrap: boolean = false) => `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  prefix: "${prefix}",${hasBootstrap ? `
  important: true,  // Required to override Bootstrap styles` : ''}
  content: ["./src/components/ui/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`


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

  // Detect project configuration
  const packageJsonPath = path.join(cwd, 'package.json')
  let hasBootstrap = false
  let isESM = false

  let detectedTailwindVersion: 'v3' | 'v4' | null = null

  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    // Detect Bootstrap
    hasBootstrap = !!(packageJson.dependencies?.bootstrap || packageJson.devDependencies?.bootstrap)
    // Detect ESM
    isESM = packageJson.type === 'module'

    // Detect Tailwind version from installed packages
    const tailwindDep = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss
    if (tailwindDep) {
      // Check if it's v4 (starts with 4 or ^4)
      if (tailwindDep.match(/^[\^~]?4/)) {
        detectedTailwindVersion = 'v4'
      } else if (tailwindDep.match(/^[\^~]?3/)) {
        detectedTailwindVersion = 'v3'
      }
    }

    // Also check for @tailwindcss/postcss which indicates v4
    if (packageJson.dependencies?.['@tailwindcss/postcss'] || packageJson.devDependencies?.['@tailwindcss/postcss']) {
      detectedTailwindVersion = 'v4'
    }

    if (hasBootstrap) {
      console.log(chalk.blue('  ℹ Bootstrap detected - will configure Tailwind to avoid conflicts\n'))
    }

    if (detectedTailwindVersion) {
      console.log(chalk.blue(`  ℹ Tailwind CSS ${detectedTailwindVersion} detected\n`))
    }
  }

  // Auto-detect paths
  const detectGlobalCss = async () => {
    const cssOptions = [
      'src/App.scss',
      'src/index.css',
      'src/styles/globals.css',
      'src/styles/index.css',
      'src/app/globals.css',
      'app/globals.css',
      'styles/globals.css',
    ]
    for (const css of cssOptions) {
      if (await fs.pathExists(path.join(cwd, css))) {
        return css
      }
    }
    return 'src/App.scss'
  }

  const detectTailwindConfig = async () => {
    const configOptions = [
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.mjs',
      'tailwind.config.cjs',
    ]
    for (const config of configOptions) {
      if (await fs.pathExists(path.join(cwd, config))) {
        return config
      }
    }
    return 'tailwind.config.js'
  }

  const detectedCss = await detectGlobalCss()
  const detectedTailwindConfig = await detectTailwindConfig()
  const detectedPrefix = await detectTailwindPrefixUtil(detectedTailwindConfig, cwd)

  // Show prefix detection message
  if (detectedPrefix) {
    console.log(chalk.blue(`  ℹ Tailwind prefix "${detectedPrefix}" detected - components will use prefixed classes\n`))
  }

  // Get user preferences - only ask if not auto-detected
  let tailwindVersion = detectedTailwindVersion
  let userPrefix = detectedPrefix

  const questions: any[] = []

  if (!tailwindVersion) {
    questions.push({
      type: 'select',
      name: 'tailwindVersion',
      message: 'Which Tailwind CSS version are you using?',
      choices: [
        { title: 'Tailwind CSS v4 (latest)', value: 'v4' },
        { title: 'Tailwind CSS v3', value: 'v3' },
      ],
      initial: 0,
    })
  }

  // Always ask for prefix preference (even if detected)
  questions.push({
    type: 'text',
    name: 'prefix',
    message: detectedPrefix
      ? `Confirm Tailwind prefix (detected: "${detectedPrefix}"):`
      : 'Enter Tailwind CSS prefix (default: tw-):',
    initial: detectedPrefix || 'tw-',
    validate: (value: string) => {
      // Allow empty string or valid CSS identifier
      if (value === '' || /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(value)) {
        return true
      }
      return 'Prefix must be a valid CSS identifier (letters, numbers, hyphens, underscores)'
    }
  })

  if (questions.length > 0) {
    const response = await prompts(questions)
    if (!tailwindVersion) {
      tailwindVersion = response.tailwindVersion
    }
    userPrefix = response.prefix || ''
  }

  // Use detected/default paths
  const componentsPath = 'src/components/ui'
  const utilsPath = 'src/lib/utils.ts'
  const tailwindConfig = detectedTailwindConfig
  const globalCss = detectedCss

  const spinner = ora('Initializing project...').start()

  try {
    // Create config
    const config = {
      ...DEFAULT_CONFIG,
      tailwind: {
        ...DEFAULT_CONFIG.tailwind,
        config: tailwindConfig,
        css: globalCss,
        prefix: userPrefix,
      },
      aliases: {
        ...DEFAULT_CONFIG.aliases,
        ui: `@/${componentsPath.replace('src/', '')}`,
      },
    }

    await fs.writeJson(configPath, config, { spaces: 2 })

    // Create utils file or add cn function if missing
    const utilsFullPath = path.join(cwd, utilsPath)

    // Generate utils content based on prefix - configures tailwind-merge to understand prefixed classes
    const getCnUtilsContent = (prefix: string) => {
      if (prefix) {
        return `import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Configure tailwind-merge to understand the "${prefix}" prefix
const twMerge = extendTailwindMerge({
  prefix: "${prefix}",
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      }
      // No prefix - use standard twMerge
      return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
    }

    const cnUtilsContent = getCnUtilsContent(userPrefix)
    let utilsCreated = false
    let utilsUpdated = false

    if (!(await fs.pathExists(utilsFullPath))) {
      // File doesn't exist - create it with full content
      await fs.ensureDir(path.dirname(utilsFullPath))
      await fs.writeFile(utilsFullPath, cnUtilsContent)
      utilsCreated = true
    } else {
      // File exists - check if cn function is present
      const existingUtils = await fs.readFile(utilsFullPath, 'utf-8')
      if (!existingUtils.includes('export function cn') && !existingUtils.includes('export const cn')) {
        // cn function missing - need to add it with proper imports
        let updatedContent = existingUtils

        // Check and add missing imports at the top
        const hasClsxImport = existingUtils.includes('from "clsx"') || existingUtils.includes("from 'clsx'")
        const hasTwMergeImport = existingUtils.includes('from "tailwind-merge"') || existingUtils.includes("from 'tailwind-merge'")
        const hasExtendTwMerge = existingUtils.includes('extendTailwindMerge')

        let importsToAdd = ''
        if (!hasClsxImport) {
          importsToAdd += `import { type ClassValue, clsx } from "clsx"\n`
        }
        if (!hasTwMergeImport && !hasExtendTwMerge) {
          // Add the appropriate import based on prefix
          if (userPrefix) {
            importsToAdd += `import { extendTailwindMerge } from "tailwind-merge"\n`
          } else {
            importsToAdd += `import { twMerge } from "tailwind-merge"\n`
          }
        }

        // Add imports at the top if needed
        if (importsToAdd) {
          updatedContent = importsToAdd + updatedContent
        }

        // Add cn function at the end (with prefix configuration if needed)
        let cnFunction: string
        if (userPrefix) {
          cnFunction = `
// Configure tailwind-merge to understand the "${userPrefix}" prefix
const twMerge = extendTailwindMerge({
  prefix: "${userPrefix}",
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
        } else {
          cnFunction = `
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
        }
        updatedContent = updatedContent.trimEnd() + '\n' + cnFunction

        await fs.writeFile(utilsFullPath, updatedContent)
        utilsUpdated = true
      }
    }

    // Create components directory
    const componentsFullPath = path.join(cwd, componentsPath)
    await fs.ensureDir(componentsFullPath)

    // Create or update global CSS with CSS variables
    const globalCssPath = path.join(cwd, globalCss)
    // Use Bootstrap version when Bootstrap detected to avoid Preflight conflicts
    let cssContent: string
    if (tailwindVersion === 'v4') {
      cssContent = hasBootstrap ? CSS_VARIABLES_V4_BOOTSTRAP : CSS_VARIABLES_V4
    } else {
      cssContent = CSS_VARIABLES_V3
    }
    let cssUpdated = false
    if (!(await fs.pathExists(globalCssPath))) {
      await fs.ensureDir(path.dirname(globalCssPath))
      await fs.writeFile(globalCssPath, cssContent)
      cssUpdated = true
    } else {
      // Check if myOperator UI imports are already present
      const existingCss = await fs.readFile(globalCssPath, 'utf-8')
      if (!existingCss.includes('myOperator UI') && !existingCss.includes('--mo-background:')) {
        // Auto-update for v3, prompt for v4
        let updateCss = tailwindVersion === 'v3'

        if (!updateCss) {
          spinner.stop()
          const result = await prompts({
            type: 'confirm',
            name: 'updateCss',
            message: `${globalCss} exists. Add myOperator UI imports to the top?`,
            initial: true,
          })
          updateCss = result.updateCss
          spinner.start('Initializing project...')
        }

        if (updateCss) {
          // PREPEND to existing CSS instead of replacing
          if (hasBootstrap) {
            // For Bootstrap projects, prepend the imports
            await fs.writeFile(globalCssPath, cssContent + existingCss)
          } else {
            // For standalone projects, replace entirely
            await fs.writeFile(globalCssPath, cssContent)
          }
          cssUpdated = true
        }
      }
    }

    // Create or update tailwind.config.js with theme colors (only for v3)
    let tailwindUpdated = false
    if (tailwindVersion === 'v3' && tailwindConfig) {
      const tailwindConfigPath = path.join(cwd, tailwindConfig)
      if (!(await fs.pathExists(tailwindConfigPath))) {
        await fs.writeFile(tailwindConfigPath, getTailwindConfig(userPrefix, hasBootstrap))
        tailwindUpdated = true
      } else {
        // Check if tailwind config already has the theme colors
        const existingConfig = await fs.readFile(tailwindConfigPath, 'utf-8')
        if (!existingConfig.includes('hsl(var(--destructive))') && !existingConfig.includes('hsl(var(--ring))')) {
          // Auto-update for v3
          await fs.writeFile(tailwindConfigPath, getTailwindConfig(userPrefix, hasBootstrap))
          tailwindUpdated = true
        }
      }
    }

    // Create or update postcss.config.js
    const postcssConfigPath = path.join(cwd, 'postcss.config.js')
    // Use ESM or CommonJS syntax based on project type
    // v3 uses tailwindcss + autoprefixer, v4 uses @tailwindcss/postcss
    let postcssConfigContent: string
    if (tailwindVersion === 'v4') {
      postcssConfigContent = isESM
        ? `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
`
        : `module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
`
    } else {
      // Tailwind v3 uses the classic postcss plugins
      postcssConfigContent = isESM
        ? `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
        : `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
    }

    let postcssCreated = false
    if (!(await fs.pathExists(postcssConfigPath))) {
      await fs.writeFile(postcssConfigPath, postcssConfigContent)
      postcssCreated = true
    } else {
      // Check if user wants to update existing config
      spinner.stop()
      const { updatePostcss } = await prompts({
        type: 'confirm',
        name: 'updatePostcss',
        message: 'postcss.config.js exists. Update to use @tailwindcss/postcss?',
        initial: true,
      })
      spinner.start('Initializing project...')

      if (updatePostcss) {
        await fs.writeFile(postcssConfigPath, postcssConfigContent)
        postcssCreated = true
      }
    }

    // Install required dependencies automatically
    spinner.text = 'Installing dependencies...'
    const deps = tailwindVersion === 'v4'
      ? 'clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react'
      : 'clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react tailwindcss-animate tailwindcss@^3.4.0 autoprefixer'

    try {
      execSync(`npm install ${deps}`, { cwd, stdio: 'pipe' })
      console.log(chalk.green('\n  ✓ Installed dependencies'))
    } catch {
      // If npm install fails, we'll show manual instructions
      spinner.warn('Could not install dependencies automatically')
      console.log(chalk.yellow(`\n  Required dependencies:`))
      console.log(chalk.cyan(`    npm install ${deps}\n`))
    }

    spinner.succeed('Project initialized successfully!')

    console.log(chalk.green('\n  ✓ Created components.json'))
    if (userPrefix) {
      console.log(chalk.blue(`    ℹ Components will use prefix: "${userPrefix}"`))
    } else {
      console.log(chalk.blue(`    ℹ Components will use no prefix`))
    }
    if (utilsCreated) {
      console.log(chalk.green(`  ✓ Created ${utilsPath}`))
    } else if (utilsUpdated) {
      console.log(chalk.green(`  ✓ Added cn() function to ${utilsPath}`))
    } else {
      console.log(chalk.green(`  ✓ ${utilsPath} already has cn() function`))
    }
    console.log(chalk.green(`  ✓ Created ${componentsPath}`))
    if (cssUpdated) {
      console.log(chalk.green(`  ✓ Updated ${globalCss} with CSS variables`))
    }
    if (tailwindUpdated) {
      console.log(chalk.green(`  ✓ Updated ${tailwindConfig} with theme colors`))
    }
    if (postcssCreated) {
      console.log(chalk.green('  ✓ Created postcss.config.js'))
    }
    console.log('')

    console.log(chalk.bold('  Next steps:\n'))
    console.log('  1. Add your first component:')
    console.log(chalk.cyan('     npx myoperator-ui add button\n'))
    console.log('  2. Browse all components:')
    console.log(chalk.cyan('     https://myoperator-ui.vercel.app\n'))
  } catch (error) {
    spinner.fail('Failed to initialize project')
    console.error(error)
    process.exit(1)
  }
}
