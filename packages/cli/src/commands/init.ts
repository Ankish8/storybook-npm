import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import ora from 'ora'

// Tailwind CSS v4 format
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

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
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

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

    // Create or update global CSS with CSS variables
    const globalCssPath = path.join(cwd, response.globalCss)
    const cssContent = response.tailwindVersion === 'v4' ? CSS_VARIABLES_V4 : CSS_VARIABLES_V3
    let cssUpdated = false
    if (!(await fs.pathExists(globalCssPath))) {
      await fs.ensureDir(path.dirname(globalCssPath))
      await fs.writeFile(globalCssPath, cssContent)
      cssUpdated = true
    } else {
      // Check if CSS variables are already present
      const existingCss = await fs.readFile(globalCssPath, 'utf-8')
      if (!existingCss.includes('--background:') && !existingCss.includes('--destructive:')) {
        spinner.stop()
        const { updateCss } = await prompts({
          type: 'confirm',
          name: 'updateCss',
          message: `${response.globalCss} exists. Add myOperator UI CSS variables?`,
          initial: true,
        })
        spinner.start('Initializing project...')

        if (updateCss) {
          await fs.writeFile(globalCssPath, cssContent)
          cssUpdated = true
        }
      }
    }

    // Create or update tailwind.config.js with theme colors (only for v3)
    let tailwindUpdated = false
    if (response.tailwindVersion === 'v3' && response.tailwindConfig) {
      const tailwindConfigPath = path.join(cwd, response.tailwindConfig)
      if (!(await fs.pathExists(tailwindConfigPath))) {
        await fs.writeFile(tailwindConfigPath, TAILWIND_CONFIG)
        tailwindUpdated = true
      } else {
        // Check if tailwind config already has the theme colors
        const existingConfig = await fs.readFile(tailwindConfigPath, 'utf-8')
        if (!existingConfig.includes('hsl(var(--destructive))') && !existingConfig.includes('hsl(var(--ring))')) {
          spinner.stop()
          const { updateTailwind } = await prompts({
            type: 'confirm',
            name: 'updateTailwind',
            message: `${response.tailwindConfig} exists. Update with myOperator UI theme colors?`,
            initial: true,
          })
          spinner.start('Initializing project...')

          if (updateTailwind) {
            await fs.writeFile(tailwindConfigPath, TAILWIND_CONFIG)
            tailwindUpdated = true
          }
        }
      }
    }

    // Create or update postcss.config.js with new @tailwindcss/postcss plugin
    const postcssConfigPath = path.join(cwd, 'postcss.config.js')
    const postcssConfigContent = `module.exports = {
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
    console.log(chalk.green(`  ✓ Created ${response.utilsPath}`))
    console.log(chalk.green(`  ✓ Created ${response.componentsPath}`))
    if (cssUpdated) {
      console.log(chalk.green(`  ✓ Updated ${response.globalCss} with CSS variables`))
    }
    if (tailwindUpdated) {
      console.log(chalk.green(`  ✓ Updated ${response.tailwindConfig} with theme colors`))
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
