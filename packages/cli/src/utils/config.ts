import fs from 'fs-extra'
import path from 'path'

export interface ComponentConfig {
  $schema: string
  style: string
  tailwind: {
    config: string
    css: string
    baseColor: string
    cssVariables: boolean
    prefix?: string
  }
  aliases: {
    components: string
    utils: string
    ui: string
  }
}

export const DEFAULT_CONFIG: ComponentConfig = {
  $schema: 'https://myoperator.com/schema.json',
  style: 'default',
  tailwind: {
    config: 'tailwind.config.js',
    css: 'src/App.scss',
    baseColor: 'slate',
    cssVariables: true,
    prefix: 'tw-',
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
    ui: '@/components/ui',
  },
}

/**
 * Get the configuration file path
 */
export function getConfigPath(cwd: string = process.cwd()): string {
  return path.join(cwd, 'components.json')
}

/**
 * Check if configuration file exists
 */
export async function configExists(cwd: string = process.cwd()): Promise<boolean> {
  return await fs.pathExists(getConfigPath(cwd))
}

/**
 * Read configuration from components.json
 */
export async function readConfig(cwd: string = process.cwd()): Promise<ComponentConfig | null> {
  const configPath = getConfigPath(cwd)
  
  if (!(await fs.pathExists(configPath))) {
    return null
  }
  
  try {
    return await fs.readJson(configPath)
  } catch (error) {
    console.error('Error reading components.json:', error)
    return null
  }
}

/**
 * Write configuration to components.json
 */
export async function writeConfig(config: ComponentConfig, cwd: string = process.cwd()): Promise<void> {
  const configPath = getConfigPath(cwd)
  await fs.writeJson(configPath, config, { spaces: 2 })
}

/**
 * Get the Tailwind prefix from configuration
 */
export async function getTailwindPrefix(cwd: string = process.cwd()): Promise<string> {
  const config = await readConfig(cwd)
  return config?.tailwind?.prefix || ''
}

/**
 * Detect Tailwind prefix from existing tailwind config file
 */
export async function detectTailwindPrefix(configFile: string, cwd: string = process.cwd()): Promise<string> {
  const configPath = path.join(cwd, configFile)
  if (await fs.pathExists(configPath)) {
    const content = await fs.readFile(configPath, 'utf-8')
    // Look for prefix: "tw-" or prefix: 'tw-'
    const prefixMatch = content.match(/prefix:\s*['"]([^'"]+)['"]/)
    if (prefixMatch) {
      return prefixMatch[1]
    }
  }
  return ''
}

/**
 * Transform CSS classes by adding the specified prefix
 */
export function applyTailwindPrefix(content: string, prefix: string): string {
  if (!prefix) {
    return content
  }
  
  // Regular expressions to match Tailwind classes
  const tailwindClassRegex = /className\s*=\s*["'`]([^"'`]*?)["'`]/g
  const cnFunctionRegex = /cn\s*\(\s*([^)]*)\s*\)/g
  
  return content
    .replace(tailwindClassRegex, (match, classes) => {
      const prefixedClasses = transformClasses(classes, prefix)
      return match.replace(classes, prefixedClasses)
    })
    .replace(cnFunctionRegex, (match, args) => {
      // Handle cn() function calls - more complex parsing needed
      const transformedArgs = args.replace(/["'`]([^"'`]*?)["'`]/g, (argMatch: string, classString: string) => {
        const prefixedClasses = transformClasses(classString, prefix)
        return argMatch.replace(classString, prefixedClasses)
      })
      return match.replace(args, transformedArgs)
    })
}

/**
 * Transform individual CSS classes by adding prefix
 */
function transformClasses(classes: string, prefix: string): string {
  // Split classes and filter out empty ones
  const classArray = classes.split(/\s+/).filter(cls => cls.length > 0)
  
  return classArray.map(cls => {
    // Skip classes that already have the prefix
    if (cls.startsWith(prefix)) {
      return cls
    }
    
    // Skip non-Tailwind classes (those that contain colons but aren't Tailwind utilities)
    // This is a simple heuristic - we could make it more sophisticated
    if (shouldSkipClass(cls)) {
      return cls
    }
    
    // Add prefix to Tailwind classes
    return prefix + cls
  }).join(' ')
}

/**
 * Determine if a class should be skipped (not a Tailwind class)
 */
function shouldSkipClass(cls: string): boolean {
  // Skip empty classes
  if (!cls) return true

  // Skip classes that start with CSS custom properties
  if (cls.startsWith('--')) return true

  // Skip classes that are obviously not Tailwind (contain dots but not in bracket notation)
  if (cls.includes('.') && !cls.includes('[') && !cls.includes(']')) return true

  // Skip classes that look like CSS modules or other naming conventions
  if (/^[A-Z]/.test(cls) && cls.includes('_')) return true

  return false
}

/**
 * Generate the correct utils.ts content based on whether a prefix is configured.
 * When a prefix is set, tailwind-merge needs extendTailwindMerge to understand prefixed classes.
 */
export function getUtilsContent(prefix: string): string {
  if (prefix) {
    return `import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge, twMerge as mergeUnprefixed } from "tailwind-merge"

// Merge v1 prefixed classes and v2 plain classes independently.
const twMerge = extendTailwindMerge({
  prefix: ${JSON.stringify(prefix)},
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(mergeUnprefixed(clsx(inputs)))
}
`;
  }
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
}

/** Append cn() without colliding with imports in an existing utility module. */
export function getUtilsAddition(prefix: string): string {
  return `import { type ClassValue as MyOperatorClassValue, clsx as myOperatorClsx } from "clsx"
import { twMerge as myOperatorMergeUnprefixed${prefix ? ", extendTailwindMerge as myOperatorExtendTailwindMerge" : ""} } from "tailwind-merge"
${prefix ? `\nconst myOperatorMergePrefixed = myOperatorExtendTailwindMerge({ prefix: ${JSON.stringify(prefix)} })\n` : ""}
export function cn(...inputs: MyOperatorClassValue[]) {
  return ${prefix ? "myOperatorMergePrefixed(myOperatorMergeUnprefixed(myOperatorClsx(inputs)))" : "myOperatorMergeUnprefixed(myOperatorClsx(inputs))"}
}
`;
}

/** Upgrade the CLI's known cn() templates without replacing consumer helpers. */
export function upgradeUtilsContent(content: string, prefix: string): string {
  if (!prefix || content.includes("twMerge(mergeUnprefixed(clsx(inputs)))"))
    return content;

  // Only change the standard generated function. Custom cn() implementations
  // and unrelated exports remain owned by the consumer.
  const generatedCn =
    /export function cn\(\.\.\.inputs: ClassValue\[\]\)\s*\{\s*return twMerge\(clsx\(inputs\)\)\s*;?\s*\}/;
  if (!generatedCn.test(content)) return content;

  const prefixConfigured =
    /const twMerge\s*=\s*extendTailwindMerge\(\s*\{\s*prefix:\s*(["'])(.*?)\1\s*,?\s*\}\s*\)/;
  const configured = content.match(prefixConfigured);
  if (configured && configured[2] !== prefix) return content;

  const mergeImport =
    /import\s*\{\s*(twMerge|extendTailwindMerge)\s*\}\s*from\s*(["'])tailwind-merge\2\s*;?/;
  const match = content.match(mergeImport);
  if (!match || (match[1] === "extendTailwindMerge" && !configured))
    return content;

  if (!configured) {
    // Keep the original unprefixed twMerge binding for application helpers.
    return content
      .replace(mergeImport, 'import { twMerge, extendTailwindMerge } from "tailwind-merge"\n')
      .replace(generatedCn, `const myOperatorMergePrefixed = extendTailwindMerge({ prefix: ${JSON.stringify(prefix)} })\n\nexport function cn(...inputs: ClassValue[]) {\n  return myOperatorMergePrefixed(twMerge(clsx(inputs)))\n}`);
  }
  return content
    .replace(mergeImport, 'import { extendTailwindMerge, twMerge as mergeUnprefixed } from "tailwind-merge"\n')
    .replace(generatedCn, "export function cn(...inputs: ClassValue[]) {\n  return twMerge(mergeUnprefixed(clsx(inputs)))\n}");
}

/**
 * Ensure src/lib/utils.ts has a prefix-aware cn() when a Tailwind prefix is configured.
 * Returns { fixed, existed } so callers can report what happened.
 */
export async function ensureUtilsPrefixConfig(
  cwd: string = process.cwd()
): Promise<{ fixed: boolean; existed: boolean }> {
  const config = await readConfig(cwd);
  const prefix = config?.tailwind?.prefix || "";

  // Nothing to fix if no prefix is configured
  if (!prefix) {
    return { fixed: false, existed: true };
  }

  const utilsPath = path.join(cwd, "src/lib/utils.ts");
  const existed = await fs.pathExists(utilsPath);

  if (!existed) {
    // File doesn't exist — create it with prefix-aware content
    await fs.ensureDir(path.dirname(utilsPath));
    await fs.writeFile(utilsPath, getUtilsContent(prefix));
    return { fixed: true, existed: false };
  }

  const content = await fs.readFile(utilsPath, "utf-8");

  const updated = upgradeUtilsContent(content, prefix);
  if (updated !== content) {
    await fs.writeFile(utilsPath, updated);
    return { fixed: true, existed: true };
  }

  // cn doesn't exist at all — not our concern here (init handles adding cn)
  return { fixed: false, existed: true };
}
