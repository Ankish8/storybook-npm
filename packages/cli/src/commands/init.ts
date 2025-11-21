import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'

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

const getTailwindConfig = (prefix: string, scopeToComponents: boolean = false) => `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  ${prefix ? `prefix: "${prefix}",` : ''}
  content: [
    ${scopeToComponents
      ? `"./src/components/ui/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",`
      : `"./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",`}
  ],
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

const DEFAULT_CONFIG = {
  $schema: 'https://myoperator.com/schema.json',
  style: 'default',
  tailwind: {
    config: 'tailwind.config.js',
    css: 'src/index.css',
    baseColor: 'slate',
    cssVariables: true,
    prefix: '',
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

  // Detect project configuration
  const packageJsonPath = path.join(cwd, 'package.json')
  let hasBootstrap = false
  let isESM = false

  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    // Detect Bootstrap
    hasBootstrap = !!(packageJson.dependencies?.bootstrap || packageJson.devDependencies?.bootstrap)
    // Detect ESM
    isESM = packageJson.type === 'module'

    if (hasBootstrap) {
      console.log(chalk.blue('  ℹ Bootstrap detected - will configure Tailwind to avoid conflicts\n'))
    }
  }

  // Get user preferences
  const response = await prompts([
    {
      type: 'select',
      name: 'tailwindVersion',
      message: 'Which Tailwind CSS version are you using?',
      choices: [
        { title: 'Tailwind CSS v4 (latest)', value: 'v4' },
        { title: 'Tailwind CSS v3', value: 'v3' },
      ],
      initial: 0,
    },
    {
      // Skip prefix prompt for Bootstrap + v4 since prefix() doesn't work with selective imports
      type: (prev, values) => (hasBootstrap && values.tailwindVersion === 'v4') ? null : 'confirm',
      name: 'usePrefix',
      message: 'Use a prefix for Tailwind classes? (recommended if using Bootstrap/other CSS frameworks)',
      initial: hasBootstrap,
    },
    {
      type: (prev, values) => {
        // Skip if Bootstrap + v4 (can't use prefix with selective imports)
        if (hasBootstrap && values.tailwindVersion === 'v4') return null
        return prev ? 'text' : null
      },
      name: 'prefix',
      message: 'Enter prefix for Tailwind classes:',
      initial: 'tw',
    },
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
      type: (prev, values) => values.tailwindVersion === 'v3' ? 'text' : null,
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
    {
      // Only show for Bootstrap + v3 projects (v4 uses @source directive in CSS)
      type: (prev, values) => (hasBootstrap && values.tailwindVersion === 'v3') ? 'confirm' : null,
      name: 'scopeTailwind',
      message: 'Scope Tailwind to only components/ui? (recommended for Bootstrap projects)',
      initial: true,
    },
  ])

  const spinner = ora('Initializing project...').start()

  try {
    // Determine prefix
    const prefix = response.usePrefix ? response.prefix : ''

    // Create config
    const config = {
      ...DEFAULT_CONFIG,
      tailwind: {
        ...DEFAULT_CONFIG.tailwind,
        config: response.tailwindConfig || 'tailwind.config.js',
        css: response.globalCss,
        prefix,
      },
      aliases: {
        ...DEFAULT_CONFIG.aliases,
        ui: `@/${response.componentsPath.replace('src/', '')}`,
      },
    }

    await fs.writeJson(configPath, config, { spaces: 2 })

    // Create utils file or add cn function if missing
    const utilsPath = path.join(cwd, response.utilsPath)
    const cnUtilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
    let utilsCreated = false
    let utilsUpdated = false

    if (!(await fs.pathExists(utilsPath))) {
      // File doesn't exist - create it with full content
      await fs.ensureDir(path.dirname(utilsPath))
      await fs.writeFile(utilsPath, cnUtilsContent)
      utilsCreated = true
    } else {
      // File exists - check if cn function is present
      const existingUtils = await fs.readFile(utilsPath, 'utf-8')
      if (!existingUtils.includes('export function cn') && !existingUtils.includes('export const cn')) {
        // cn function missing - need to add it with proper imports
        let updatedContent = existingUtils

        // Check and add missing imports at the top
        const hasClsxImport = existingUtils.includes('from "clsx"') || existingUtils.includes("from 'clsx'")
        const hasTwMergeImport = existingUtils.includes('from "tailwind-merge"') || existingUtils.includes("from 'tailwind-merge'")

        let importsToAdd = ''
        if (!hasClsxImport) {
          importsToAdd += `import { type ClassValue, clsx } from "clsx"\n`
        }
        if (!hasTwMergeImport) {
          importsToAdd += `import { twMerge } from "tailwind-merge"\n`
        }

        // Add imports at the top if needed
        if (importsToAdd) {
          updatedContent = importsToAdd + updatedContent
        }

        // Add cn function at the end
        const cnFunction = `
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
        updatedContent = updatedContent.trimEnd() + '\n' + cnFunction

        await fs.writeFile(utilsPath, updatedContent)
        utilsUpdated = true
      }
    }

    // Create components directory
    const componentsPath = path.join(cwd, response.componentsPath)
    await fs.ensureDir(componentsPath)

    // Create or update global CSS with CSS variables
    const globalCssPath = path.join(cwd, response.globalCss)
    // Use Bootstrap version when Bootstrap detected to avoid Preflight conflicts
    let cssContent: string
    if (response.tailwindVersion === 'v4') {
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
        let updateCss = response.tailwindVersion === 'v3'

        if (!updateCss) {
          spinner.stop()
          const result = await prompts({
            type: 'confirm',
            name: 'updateCss',
            message: `${response.globalCss} exists. Add myOperator UI imports to the top?`,
            initial: true,
          })
          updateCss = result.updateCss
          spinner.start('Initializing project...')
        }

        if (updateCss) {
          // PREPEND to existing CSS instead of replacing
          if (hasBootstrap || prefix) {
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
    const scopeTailwind = response.scopeTailwind || false
    if (response.tailwindVersion === 'v3' && response.tailwindConfig) {
      const tailwindConfigPath = path.join(cwd, response.tailwindConfig)
      if (!(await fs.pathExists(tailwindConfigPath))) {
        await fs.writeFile(tailwindConfigPath, getTailwindConfig(prefix, scopeTailwind))
        tailwindUpdated = true
      } else {
        // Check if tailwind config already has the theme colors
        const existingConfig = await fs.readFile(tailwindConfigPath, 'utf-8')
        if (!existingConfig.includes('hsl(var(--destructive))') && !existingConfig.includes('hsl(var(--ring))')) {
          // Auto-update for v3
          await fs.writeFile(tailwindConfigPath, getTailwindConfig(prefix, scopeTailwind))
          tailwindUpdated = true
        }
      }
    }

    // Create or update postcss.config.js with new @tailwindcss/postcss plugin
    const postcssConfigPath = path.join(cwd, 'postcss.config.js')
    // Use ESM or CommonJS syntax based on project type
    const postcssConfigContent = isESM
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

    spinner.succeed('Project initialized successfully!')

    console.log(chalk.green('\n  ✓ Created components.json'))
    if (utilsCreated) {
      console.log(chalk.green(`  ✓ Created ${response.utilsPath}`))
    } else if (utilsUpdated) {
      console.log(chalk.green(`  ✓ Added cn() function to ${response.utilsPath}`))
    } else {
      console.log(chalk.green(`  ✓ ${response.utilsPath} already has cn() function`))
    }
    console.log(chalk.green(`  ✓ Created ${response.componentsPath}`))
    if (cssUpdated) {
      console.log(chalk.green(`  ✓ Updated ${response.globalCss} with CSS variables`))
    }
    if (tailwindUpdated) {
      console.log(chalk.green(`  ✓ Updated ${response.tailwindConfig} with theme colors`))
      if (scopeTailwind) {
        console.log(chalk.blue(`    ℹ Tailwind scoped to components/ui only (Bootstrap can be used elsewhere)`))
      }
    }
    if (postcssCreated) {
      console.log(chalk.green('  ✓ Created postcss.config.js'))
    }
    console.log('')

    console.log(chalk.bold('  Next steps:\n'))
    console.log('  1. Install core dependencies:')
    if (response.tailwindVersion === 'v4') {
      console.log(chalk.cyan('     npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react\n'))
    } else {
      console.log(chalk.cyan('     npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react tailwindcss-animate\n'))
    }
    if (response.tailwindVersion === 'v4') {
      console.log('  2. Add your first component:')
      console.log(chalk.cyan('     npx myoperator-ui add button\n'))
    } else {
      console.log('  2. Install PostCSS plugin (if not already installed):')
      console.log(chalk.cyan('     npm install -D @tailwindcss/postcss\n'))
      console.log('  3. Add your first component:')
      console.log(chalk.cyan('     npx myoperator-ui add button\n'))
    }
  } catch (error) {
    spinner.fail('Failed to initialize project')
    console.error(error)
    process.exit(1)
  }
}
