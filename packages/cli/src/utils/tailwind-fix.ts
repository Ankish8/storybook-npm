import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

// Required content path for custom components
const CUSTOM_COMPONENTS_PATH = './src/components/custom/**/*.{js,ts,jsx,tsx}'

/**
 * Ensures the Tailwind config includes the custom components path.
 * Returns true if a fix was applied, false if already correct or couldn't fix.
 */
export async function ensureCustomComponentsInTailwindConfig(cwd: string): Promise<boolean> {
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
    // No tailwind config found - can't fix
    return false
  }

  // Read and check tailwind config
  const tailwindConfig = await fs.readFile(tailwindConfigPath, 'utf-8')

  // Check if custom components path already exists
  if (tailwindConfig.includes('./src/components/custom/')) {
    // Already has the path
    return false
  }

  // Find the content array and add missing path
  const contentMatch = tailwindConfig.match(/content\s*:\s*\[([^\]]*)\]/s)

  if (!contentMatch) {
    // Can't parse content array
    return false
  }

  const existingContent = contentMatch[1]
  const existingPaths = existingContent
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  // Add custom components path after existing paths
  const newPaths = [...existingPaths.map((p) => p.replace(/["']/g, '')), CUSTOM_COMPONENTS_PATH]

  // Format the new content array
  const newContentArray = newPaths.map((p) => `    "${p}"`).join(',\n')

  const updatedConfig = tailwindConfig.replace(
    /content\s*:\s*\[([^\]]*)\]/s,
    `content: [\n${newContentArray},\n  ]`
  )

  await fs.writeFile(tailwindConfigPath, updatedConfig)

  console.log(chalk.green(`\n  ✓ Updated ${path.basename(tailwindConfigPath)} with custom components path`))

  return true
}
