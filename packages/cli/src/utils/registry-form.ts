// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: form

import type { Registry } from './registry-types'

/**
 * Semantic token to fallback color mapping
 * Ensures components work even without semantic tokens defined in user's Tailwind config
 */
const SEMANTIC_FALLBACKS: Record<string, string> = {
  // Primary UI Colors
  'semantic-primary': '#343E55',
  'semantic-primary-hover': '#2F384D',
  'semantic-primary-selected': '#777E8D',
  'semantic-primary-selected-hover': '#5D6577',
  'semantic-primary-highlighted': '#252C3C',
  'semantic-primary-surface': '#EBECEE',
  // Brand Colors
  'semantic-brand': '#2BBCCA',
  'semantic-brand-hover': '#1F858F',
  'semantic-brand-selected': '#71D2DB',
  'semantic-brand-selected-hover': '#27ABB8',
  'semantic-brand-highlighted': '#27ABB8',
  'semantic-brand-surface': '#EAF8FA',
  // Background Colors
  'semantic-bg-primary': '#FFFFFF',
  'semantic-bg-secondary': '#0C0F12',
  'semantic-bg-ui': '#F5F5F5',
  'semantic-bg-grey': '#E9EAEB',
  'semantic-bg-grey-hover': '#A4A7AE',
  'semantic-bg-inverted': '#000000',
  'semantic-bg-hover': '#D5D7DA',
  // Text Colors
  'semantic-text-primary': '#181D27',
  'semantic-text-secondary': '#343E55',
  'semantic-text-placeholder': '#A2A6B1',
  'semantic-text-link': '#4275D6',
  'semantic-text-inverted': '#FFFFFF',
  'semantic-text-muted': '#717680',
  // Border Colors
  'semantic-border-primary': '#343E55',
  'semantic-border-secondary': '#777E8D',
  'semantic-border-accent': '#27ABB8',
  'semantic-border-layout': '#E9EAEB',
  'semantic-border-input': '#E9EAEB',
  'semantic-border-input-focus': '#2BBCCA',
  // Disabled State
  'semantic-disabled-primary': '#A2A6B1',
  'semantic-disabled-secondary': '#EBECEE',
  'semantic-disabled-text': '#717680',
  'semantic-disabled-border': '#D5D7DA',
  // Error State
  'semantic-error-primary': '#F04438',
  'semantic-error-surface': '#FEF3F2',
  'semantic-error-text': '#B42318',
  'semantic-error-border': '#FDA29B',
  'semantic-error-hover': '#D92D20',
  // Warning State
  'semantic-warning-primary': '#F79009',
  'semantic-warning-surface': '#FFFAEB',
  'semantic-warning-text': '#B54708',
  'semantic-warning-border': '#FEC84B',
  'semantic-warning-hover': '#DC6803',
  // Success State
  'semantic-success-primary': '#17B26A',
  'semantic-success-surface': '#ECFDF3',
  'semantic-success-text': '#067647',
  'semantic-success-border': '#75E0A7',
  'semantic-success-hover': '#079455',
  // Info State
  'semantic-info-primary': '#4275D6',
  'semantic-info-surface': '#ECF1FB',
  'semantic-info-text': '#2F5398',
  'semantic-info-border': '#A8C0EC',
  'semantic-info-hover': '#3C6AC3',
}

/**
 * Transform a single semantic class to CSS variable syntax with fallback
 */
function transformSemanticClass(cls: string): string {
  const match = cls.match(/^(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-(semantic-[a-z-]+)$/)
  if (match) {
    const [, utilityPrefix, token] = match
    const fallback = SEMANTIC_FALLBACKS[token]
    if (fallback) {
      return `${utilityPrefix}-[var(--${token},${fallback})]`
    }
  }
  return cls
}

/**
 * Transform semantic classes in a class string to use CSS variable fallbacks
 */
function transformSemanticClasses(classString: string): string {
  return classString.split(' ').map((cls: string) => {
    if (!cls) return cls
    // Handle variant prefixes (hover:, focus:, etc.)
    const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*:)|((data|aria)-\[[^\]]+\]:))+/)
    if (variantMatch) {
      const variants = variantMatch[0]
      const utility = cls.slice(variants.length)
      return variants + transformSemanticClass(utility)
    }
    return transformSemanticClass(cls)
  }).join(' ')
}

/**
 * Transform semantic classes throughout component content
 */
function transformSemanticClassesInContent(content: string): string {
  const hasSemanticClasses = (str: string): boolean => {
    return /\b(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-semantic-/.test(str)
  }

  // Handle cva() base classes
  content = content.replace(
    /\bcva\s*\(\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!hasSemanticClasses(baseClasses)) return match
      return match.replace(`"${baseClasses}"`, `"${transformSemanticClasses(baseClasses)}"`)
    }
  )

  // Handle cn() function calls
  let result = ''
  let lastIndex = 0
  const cnRegex = /\bcn\s*\(/g
  let cnMatch
  while ((cnMatch = cnRegex.exec(content)) !== null) {
    result += content.slice(lastIndex, cnMatch.index)
    let depth = 1
    let i = cnMatch.index + cnMatch[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++
      else if (content[i] === ')') depth--
      i++
    }
    const args = content.slice(cnMatch.index + cnMatch[0].length, i - 1)
    let transformedArgs = args.replace(/"([^"]*)"/g, (m: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return m
      return `"${transformSemanticClasses(classes)}"`
    })
    transformedArgs = transformedArgs.replace(/'([^']*)'/g, (m: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return m
      return `'${transformSemanticClasses(classes)}'`
    })
    result += `cn(${transformedArgs})`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // Handle className="..." attributes
  content = content.replace(
    /className\s*=\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return match
      return `className="${transformSemanticClasses(classes)}"`
    }
  )

  // Handle variant values in cva config objects
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      if (!hasSemanticClasses(value)) return match
      return `${key}: "${transformSemanticClasses(value)}"`
    }
  )
  content = content.replace(
    /(\w+|'[^']+'):\s*'([^'\n]+)'/g,
    (match: string, key: string, value: string) => {
      if (!hasSemanticClasses(value)) return match
      return `${key}: '${transformSemanticClasses(value)}'`
    }
  )

  return content
}

// Helper to check if a string looks like Tailwind CSS classes
function looksLikeTailwindClasses(str: string): boolean {
  // Skip empty strings
  if (!str || !str.trim()) return false

  // Skip obvious non-class values (common prop values)
  const nonClassValues = [
    'button', 'submit', 'reset', 'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'checkbox', 'radio', 'file', 'hidden', 'image', 'color', 'date', 'time', 'datetime-local',
    'default', 'error', 'warning', 'success', 'info', 'primary', 'secondary', 'tertiary',
    'destructive', 'outline', 'ghost', 'link', 'dashed', 'solid', 'none',
    'open', 'closed', 'true', 'false', 'null', 'undefined',
    'single', 'multiple', 'listbox', 'combobox', 'menu', 'menuitem', 'option', 'switch',
    'small', 'medium', 'large', 'sm', 'md', 'lg', 'xl', '2xl',
    'top', 'bottom', 'left', 'right', 'center', 'start', 'end',
    'horizontal', 'vertical', 'both', 'auto',
    'asc', 'desc', 'ascending', 'descending',
  ]
  if (nonClassValues.includes(str.toLowerCase())) return false

  // Skip displayName values (PascalCase component names)
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return false

  // Skip strings that look like paths or imports
  // Allow :: inside arbitrary selectors like [&::-webkit-inner-spin-button]
  if (str.startsWith('@') || str.startsWith('.') || str.startsWith('/') || (str.includes('::') && !str.includes('[&'))) return false

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  const tailwindUtilityPrefixes = ['text', 'bg', 'p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr', 'w', 'h', 'min', 'max', 'gap', 'space', 'border', 'rounded', 'shadow', 'opacity', 'font', 'leading', 'tracking', 'z', 'inset', 'top', 'bottom', 'left', 'right', 'flex', 'grid', 'col', 'row', 'justify', 'items', 'content', 'self', 'place', 'order', 'float', 'clear', 'object', 'overflow', 'overscroll', 'scroll', 'list', 'appearance', 'cursor', 'pointer', 'resize', 'select', 'fill', 'stroke', 'table', 'caption', 'transition', 'duration', 'ease', 'delay', 'animate', 'transform', 'origin', 'scale', 'rotate', 'translate', 'skew', 'accent', 'caret', 'outline', 'ring', 'blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia', 'backdrop', 'divide', 'sr', 'not', 'snap', 'touch', 'will', 'aspect', 'container', 'columns', 'break', 'box', 'isolation', 'mix', 'filter', 'drop', 'size', 'shrink', 'grow', 'basis', 'whitespace', 'decoration', 'indent']

  // Check if it looks like a Tailwind utility (prefix-value pattern) before npm check
  if (str.includes('-') && !str.includes(' ')) {
    const prefix = str.split('-')[0]
    if (tailwindUtilityPrefixes.includes(prefix)) {
      return true  // This is a Tailwind class, not npm package
    }
  }

  // Skip npm package names (but we already caught Tailwind utilities above)
  if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(' ')) return false

  // Check if any word looks like a Tailwind class
  const words = str.split(/\s+/)
  return words.some(cls => {
    if (!cls) return false

    // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
    // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
    if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return false

    // Single word utilities that are valid Tailwind classes
    const singleWordUtilities = /^(flex|grid|block|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky|isolate|isolation-auto|overflow-auto|overflow-hidden|overflow-clip|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overscroll-auto|overscroll-contain|overscroll-none|truncate|antialiased|subpixel-antialiased|italic|not-italic|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|sr-only|not-sr-only|resize|resize-none|resize-x|resize-y|snap-start|snap-end|snap-center|snap-align-none|snap-normal|snap-always|touch-auto|touch-none|touch-pan-x|touch-pan-left|touch-pan-right|touch-pan-y|touch-pan-up|touch-pan-down|touch-pinch-zoom|touch-manipulation|select-none|select-text|select-all|select-auto|will-change-auto|will-change-scroll|will-change-contents|will-change-transform|grow|grow-0|shrink|shrink-0|transform|transform-cpu|transform-gpu|transform-none|transition|transition-none|transition-all|transition-colors|transition-opacity|transition-shadow|transition-transform|animate-none|animate-spin|animate-ping|animate-pulse|animate-bounce)$/
    if (singleWordUtilities.test(cls)) return true

    // Classes with hyphens are likely Tailwind (bg-*, text-*, p-*, m-*, etc.)
    if (cls.includes('-')) return true

    // Classes with arbitrary values like bg-[#343E55]
    if (cls.includes('[') && cls.includes(']')) return true

    // Classes with variant prefixes like hover:, focus:, sm:
    if (cls.includes(':')) return true

    return false
  })
}

// Helper to prefix a single class string
function prefixClassString(classString: string, prefix: string): string {
  return classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
      // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
      if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return cls

      // Handle arbitrary selector values like [&_svg]:pointer-events-none or [&_[data-icon]]:text-red
      // MUST be checked BEFORE variant match to handle nested brackets properly
      if (cls.startsWith('[&') || cls.startsWith('[&_')) {
        // Find the matching closing bracket by tracking depth
        let depth = 0
        let closeBracket = -1
        for (let i = 0; i < cls.length; i++) {
          if (cls[i] === '[') depth++
          else if (cls[i] === ']') {
            depth--
            if (depth === 0 && cls[i + 1] === ':') {
              closeBracket = i
              break
            }
          }
        }
        if (closeBracket !== -1) {
          const selector = cls.slice(0, closeBracket + 2) // Include ]:
          const utility = cls.slice(closeBracket + 2)
          if (!utility) return cls
          // Handle negative utilities
          if (utility.startsWith('-')) {
            return `${selector}-${prefix}${utility.slice(1)}`
          }
          return `${selector}${prefix}${utility}`
        }
        return cls
      }

      // Handle variant prefixes like hover:, focus:, sm:, data-[state=open]:, aria-[checked]:,
      // group-[.selector]:, peer-[.selector]:, etc.
      // Pattern breakdown:
      // - Simple variants: hover:, focus:, sm:, lg:, dark:, etc.
      // - Data/aria variants: data-[state=open]:, aria-[checked]:
      // - Group/peer variants: group-[.toaster]:, peer-[.active]:, group/name-[.class]:
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*:)|((data|aria|group|peer)(\/[a-z0-9-]+)?-?\[[^\]]+\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        const utility = cls.slice(variants.length)
        if (!utility) return cls
        // Prefix the utility part, keep variants as-is
        if (utility.startsWith('-')) {
          return `${variants}-${prefix}${utility.slice(1)}`
        }
        return `${variants}${prefix}${utility}`
      }

      // Handle negative values like -mt-4
      if (cls.startsWith('-') && cls.length > 1) {
        return `-${prefix}${cls.slice(1)}`
      }

      // Regular class (including arbitrary values like bg-[#343E55])
      return `${prefix}${cls}`
    })
    .join(' ')
}

// Context-aware Tailwind class prefixing
function prefixTailwindClasses(content: string, prefix: string): string {
  // Always transform semantic classes to CSS variable syntax with fallbacks
  // This ensures backward compatibility regardless of prefix
  content = transformSemanticClassesInContent(content)

  if (!prefix) return content

  // 1. Handle cva() base classes: cva("base classes here", ...)
  content = content.replace(
    /\bcva\s*\(\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!looksLikeTailwindClasses(baseClasses)) return match
      const prefixed = prefixClassString(baseClasses, prefix)
      return match.replace(`"${baseClasses}"`, `"${prefixed}"`)
    }
  )

  // 2. Handle cn() function calls with nested parentheses support
  // Process cn() calls by finding them and properly matching closing parens
  let result = ''
  let lastIndex = 0
  const cnRegex = /\bcn\s*\(/g
  let cnMatch

  while ((cnMatch = cnRegex.exec(content)) !== null) {
    // Add everything before this cn(
    result += content.slice(lastIndex, cnMatch.index)

    // Find matching closing paren
    let depth = 1
    let i = cnMatch.index + cnMatch[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++
      else if (content[i] === ')') depth--
      i++
    }

    const args = content.slice(cnMatch.index + cnMatch[0].length, i - 1)

    // Prefix class strings within the cn() arguments (both double and single quotes)
    let prefixedArgs = args.replace(
      /"([^"]*)"/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return `"${prefixed}"`
      }
    )
    // Also handle single-quoted strings
    prefixedArgs = prefixedArgs.replace(
      /'([^']*)'/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return `'${prefixed}'`
      }
    )

    result += `cn(${prefixedArgs})`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // 3. Handle className="..." direct attributes
  content = content.replace(
    /className\s*=\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `className="${prefixed}"`
    }
  )

  // 4. Handle variant values in cva config objects
  // Pattern: key: "class string" or key: 'class string' within variants/defaultVariants objects
  // Handles both unquoted keys (default:) and quoted keys ("icon-sm":)
  // But be careful not to match non-class string values
  // IMPORTANT: [^"\n]+ prevents matching across newlines to avoid greedy captures

  // Skip keys that are definitely not class values (only when value is ambiguous)
  const nonClassKeys = ['name', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy']

  // Helper to check if value has obvious Tailwind patterns (should always be prefixed)
  function hasObviousTailwindPatterns(value: string): boolean {
    // Check for variant prefixes that clearly indicate Tailwind classes
    return /(?:^|\s)(hover|focus|active|disabled|group|peer|data-|aria-|sm:|md:|lg:|xl:|2xl:|dark:)/.test(value) ||
           // Group/peer with selectors
           /group-\[|peer-\[/.test(value) ||
           // Arbitrary selectors
           /\[&/.test(value)
  }

  // Handle double-quoted values
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/"/g, '')

      // First check if value looks like Tailwind classes at all
      if (!looksLikeTailwindClasses(value)) return match

      // If the value has obvious Tailwind patterns, always prefix (override blocklist)
      // This handles cases like title: "group-[.toast]:font-semibold" in Sonner
      if (!hasObviousTailwindPatterns(value) && nonClassKeys.includes(cleanKey)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: "${prefixed}"`
    }
  )

  // Handle single-quoted values
  content = content.replace(
    /(\w+|'[^']+'):\s*'([^'\n]+)'/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/'/g, '')

      // First check if value looks like Tailwind classes at all
      if (!looksLikeTailwindClasses(value)) return match

      // If the value has obvious Tailwind patterns, always prefix (override blocklist)
      if (!hasObviousTailwindPatterns(value) && nonClassKeys.includes(cleanKey)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: '${prefixed}'`
    }
  )

  // 5. Handle function calls with class string arguments
  // Recognizes patterns like: functionName("mt-3") or helperFunc("flex gap-2")
  // where the string argument looks like Tailwind classes

  // Function names that commonly receive class strings
  const classArgFunctions = [
    'renderExpandableActions',
    'getClassName',
    'getClasses',
    'classNames',
    'mergeClasses',
    'combineClasses',
  ]

  // Handle double-quoted function arguments
  const funcArgRegex = new RegExp(
    `\\b(${classArgFunctions.join('|')})\\s*\\(\\s*"([^"\\n]*)"`,
    'g'
  )
  content = content.replace(
    funcArgRegex,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `${funcName}("${prefixed}"`
    }
  )

  // Handle single-quoted function arguments
  const funcArgRegexSingle = new RegExp(
    `\\b(${classArgFunctions.join('|')})\\s*\\(\\s*'([^'\\n]*)'`,
    'g'
  )
  content = content.replace(
    funcArgRegexSingle,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `${funcName}('${prefixed}'`
    }
  )

  return content
}

export function getFormRegistry(prefix: string = ''): Registry {
  return {
    "input": {
      name: "input",
      description: "A text input component with error and disabled states",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "input.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-10 w-full rounded bg-semantic-bg-primary px-4 py-2.5 text-sm text-semantic-text-primary transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * A flexible input component for text entry with state variants.
 *
 * @example
 * \`\`\`tsx
 * <Input placeholder="Enter your email" />
 * <Input state="error" placeholder="Invalid input" />
 * <Input state="success" placeholder="Valid input" />
 * \`\`\`
 */
export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ state, className }),
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
`, prefix),
        },
      ],
    },
    "select": {
      name: "select",
      description: "A select dropdown component built on Radix UI Select",
      category: "form",
      dependencies: [
            "@radix-ui/react-select@^2.2.6",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "select.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * SelectTrigger variants matching TextField styling
 */
const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2.5 text-sm text-semantic-text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)] [&>span]:line-clamp-1",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, state, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ state, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-semantic-text-muted opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="size-4 text-semantic-text-muted" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="size-4 text-semantic-text-muted" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded bg-semantic-bg-primary border border-semantic-border-layout shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-4 py-1.5 text-xs font-medium text-semantic-text-muted",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-semantic-text-primary outline-none",
      "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-semantic-brand" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-semantic-border-layout", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
};
`, prefix),
        },
      ],
    },
    "checkbox": {
      name: "checkbox",
      description: "A tri-state checkbox component with label support (checked, unchecked, indeterminate). Built on Radix UI Checkbox.",
      category: "form",
      dependencies: [
            "@radix-ui/react-checkbox@^1.3.3",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "checkbox.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  "peer inline-flex items-center justify-center shrink-0 rounded border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-semantic-primary data-[state=checked]:border-semantic-primary data-[state=checked]:text-semantic-text-inverted data-[state=indeterminate]:bg-semantic-primary data-[state=indeterminate]:border-semantic-primary data-[state=indeterminate]:text-semantic-text-inverted data-[state=unchecked]:bg-semantic-bg-primary data-[state=unchecked]:border-semantic-border-input data-[state=unchecked]:hover:border-[var(--color-neutral-400)]",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Icon size variants based on checkbox size
 */
const iconSizeVariants = cva("", {
  variants: {
    size: {
      default: "h-3.5 w-3.5",
      sm: "h-3 w-3",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Label text size variants
 */
const labelSizeVariants = cva("", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type CheckedState = boolean | "indeterminate";

/**
 * A tri-state checkbox component with label support. Built on Radix UI Checkbox primitive.
 *
 * @example
 * \`\`\`tsx
 * <Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Checkbox size="sm" disabled />
 * <Checkbox checked="indeterminate" label="Select all" />
 * <Checkbox label="Accept terms" labelPosition="right" />
 * <Checkbox id="terms" label="Accept terms" separateLabel />
 * \`\`\`
 */
export interface CheckboxProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "onChange"
    >,
    VariantProps<typeof checkboxVariants> {
  /** Optional label text */
  label?: string;
  /** Position of the label */
  labelPosition?: "left" | "right";
  /** Class name applied to the checkbox element */
  checkboxClassName?: string;
  /** Class name applied to the label element */
  labelClassName?: string;
  /** If true, uses separate labels with htmlFor/id association instead of wrapping the input. Requires id prop. */
  separateLabel?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      size,
      label,
      labelPosition = "right",
      checkboxClassName,
      labelClassName,
      separateLabel = false,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          className,
          checkboxClassName
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          {props.checked === "indeterminate" ? (
            <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          ) : (
            <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (label) {
      // separateLabel mode: use htmlFor/id association instead of wrapping
      if (separateLabel && id) {
        return (
          <div className="inline-flex items-center gap-2">
            {labelPosition === "left" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "text-semantic-text-primary cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {checkbox}
            {labelPosition === "right" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "text-semantic-text-primary cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
          </div>
        );
      }

      // Default: wrapping label
      return (
        <label
          className={cn(
            "inline-flex items-center gap-2 cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
        >
          {labelPosition === "left" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "text-semantic-text-primary",
                disabled && "opacity-50",
                labelClassName
              )}
            >
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "text-semantic-text-primary",
                disabled && "opacity-50",
                labelClassName
              )}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    return checkbox;
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
`, prefix),
        },
      ],
    },
    "switch": {
      name: "switch",
      description: "A switch/toggle component for boolean inputs with on/off states. Built on Radix UI Switch.",
      category: "form",
      dependencies: [
            "@radix-ui/react-switch@^1.2.6",
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "switch.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Switch track variants (the outer container)
 */
const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-semantic-primary data-[state=unchecked]:bg-semantic-bg-grey",
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Switch thumb variants (the sliding circle)
 */
const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5",
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Label text size variants
 */
const labelSizeVariants = cva("", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * A switch/toggle component for boolean inputs with on/off states
 *
 * @example
 * \`\`\`tsx
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Switch size="sm" disabled />
 * <Switch size="lg" checked label="Enable notifications" />
 * \`\`\`
 */
export interface SwitchProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
      "onChange"
    >,
    VariantProps<typeof switchVariants> {
  /** Optional label text */
  label?: string;
  /** Position of the label */
  labelPosition?: "left" | "right";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    { className, size, label, labelPosition = "right", disabled, ...props },
    ref
  ) => {
    const switchElement = (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ size, className }))}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
      </SwitchPrimitives.Root>
    );

    if (label) {
      return (
        <label
          className={cn(
            "inline-flex items-center gap-2 cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
        >
          {labelPosition === "left" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "text-semantic-text-primary",
                disabled && "opacity-50"
              )}
            >
              {label}
            </span>
          )}
          {switchElement}
          {labelPosition === "right" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "text-semantic-text-primary",
                disabled && "opacity-50"
              )}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    return switchElement;
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants };
`, prefix),
        },
      ],
    },
    "text-field": {
      name: "text-field",
      description: "A text field with label, helper text, icons, and validation states",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "text-field.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * TextField container variants for when icons/prefix/suffix are present
 */
const textFieldContainerVariants = cva(
  "relative flex items-center rounded bg-semantic-bg-primary transition-all",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus-within:border-semantic-border-input-focus/50 focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus-within:border-semantic-error-primary/60 focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 bg-[var(--color-neutral-50)]",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  }
);

/**
 * TextField input variants (standalone without container)
 */
const textFieldInputVariants = cva(
  "h-10 w-full rounded bg-semantic-bg-primary px-4 py-2.5 text-sm text-semantic-text-primary transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * A comprehensive text field component with label, icons, validation states, and more.
 *
 * @example
 * \`\`\`tsx
 * <TextField label="Email" placeholder="Enter your email" required />
 * <TextField label="Username" error="Username is taken" />
 * <TextField label="Website" prefix="https://" suffix=".com" />
 * \`\`\`
 */
export interface TextFieldProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldInputVariants> {
  /** Label text displayed above the input */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Icon displayed on the left inside the input */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right inside the input */
  rightIcon?: React.ReactNode;
  /** Text prefix inside input (e.g., "https://") */
  prefix?: string;
  /** Text suffix inside input (e.g., ".com") */
  suffix?: string;
  /** Shows character count when maxLength is set */
  showCount?: boolean;
  /** Shows loading spinner inside input */
  loading?: boolean;
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
  /** Additional class for the input container (includes prefix/suffix/icons) */
  inputContainerClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      inputContainerClassName,
      state,
      label,
      required,
      helperText,
      error,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      showCount,
      loading,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      type,
      ...props
    },
    ref
  ) => {
    // Internal state for character count in uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ""
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Determine if we need the container wrapper (for icons/prefix/suffix)
    const hasAddons = leftIcon || rightIcon || prefix || suffix || loading;

    // Character count
    const charCount = String(currentValue).length;

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = \`\${inputId}-helper\`;
    const errorId = \`\${inputId}-error\`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Render the input element
    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          hasAddons
            ? "flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full text-sm text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed"
            : textFieldInputVariants({ state: derivedState, className }),
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        disabled={disabled || loading}
        maxLength={maxLength}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-normal text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Input or Input Container */}
        {hasAddons ? (
          <div
            className={cn(
              textFieldContainerVariants({
                state: derivedState,
                disabled: disabled || loading,
              }),
              "h-10 px-4",
              inputContainerClassName
            )}
          >
            {prefix && (
              <span className="text-sm text-semantic-text-muted mr-2 select-none">
                {prefix}
              </span>
            )}
            {leftIcon && (
              <span className="mr-2 text-semantic-text-muted [&_svg]:size-4 flex-shrink-0">
                {leftIcon}
              </span>
            )}
            {inputElement}
            {loading && (
              <Loader2 className="animate-spin size-4 text-semantic-text-muted ml-2 flex-shrink-0" />
            )}
            {!loading && rightIcon && (
              <span className="ml-2 text-semantic-text-muted [&_svg]:size-4 flex-shrink-0">
                {rightIcon}
              </span>
            )}
            {suffix && (
              <span className="text-sm text-semantic-text-muted ml-2 select-none">
                {suffix}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-semantic-text-muted">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
                  charCount > maxLength
                    ? "text-semantic-error-primary"
                    : "text-semantic-text-muted"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField, textFieldContainerVariants, textFieldInputVariants };
`, prefix),
        },
      ],
    },
    "readable-field": {
      name: "readable-field",
      description: "A read-only field with copy-to-clipboard functionality. Supports secret mode for sensitive data like API keys.",
      category: "form",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "readable-field.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ReadableFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Label text displayed above the field */
  label: string;
  /** Value to display and copy */
  value: string;
  /** Helper text displayed below the field */
  helperText?: string;
  /** When true, masks the value with dots and shows eye toggle */
  secret?: boolean;
  /** Header action (e.g., "Regenerate" link) */
  headerAction?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when value is copied */
  onValueCopy?: (value: string) => void;
  /** Additional class for the input container */
  inputClassName?: string;
}

/**
 * ReadableField displays a read-only value with copy-to-clipboard functionality.
 * Supports secret mode for sensitive data like API keys and passwords.
 *
 * @example
 * \`\`\`tsx
 * // Simple readable field
 * <ReadableField
 *   label="Base URL"
 *   value="https://api.myoperator.co/v3/voice/gateway"
 * />
 *
 * // Secret field with regenerate action
 * <ReadableField
 *   label="Authentication"
 *   value="sk_live_abc123xyz"
 *   secret
 *   helperText="Used for client-side integrations."
 *   headerAction={{
 *     label: "Regenerate",
 *     onClick: () => console.log("Regenerate clicked"),
 *   }}
 * />
 * \`\`\`
 */
export const ReadableField = React.forwardRef<HTMLDivElement, ReadableFieldProps>(
  (
    {
      label,
      value,
      helperText,
      secret = false,
      headerAction,
      onValueCopy,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(!secret);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync visibility state when secret prop changes
    React.useEffect(() => {
      setIsVisible(!secret);
    }, [secret]);

    // Cleanup timeout on unmount to prevent memory leaks
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onValueCopy?.(value);

        // Clear existing timeout before setting new one
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API may fail in insecure contexts
      }
    };

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    // Display masked or actual value
    const displayValue = secret && !isVisible ? "••••••••••••••••••••" : value;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        {/* Header Row: Label + Optional Action */}
        <div className="flex items-start justify-between">
          <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
            {label}
          </span>
          {headerAction && (
            <button
              type="button"
              onClick={headerAction.onClick}
              className="text-sm font-semibold text-semantic-text-muted tracking-[0.014px] hover:text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-text-primary rounded transition-colors"
            >
              {headerAction.label}
            </button>
          )}
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "flex h-11 items-center justify-between rounded border border-semantic-border-layout bg-semantic-bg-ui pl-4 pr-2.5 py-2.5",
            inputClassName
          )}
        >
          {/* Value Display */}
          <span className="text-base text-semantic-text-primary tracking-[0.08px] truncate">
            {displayValue}
          </span>

          {/* Action Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Eye Toggle (only for secret mode) */}
            {secret && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="text-semantic-text-muted hover:text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-text-primary rounded transition-colors"
                aria-label={isVisible ? "Hide value" : "Show value"}
              >
                {isVisible ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-text-primary",
                copied
                  ? "text-semantic-success-primary"
                  : "text-semantic-text-muted hover:text-semantic-text-primary"
              )}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
            >
              {copied ? (
                <Check className="size-[18px]" />
              ) : (
                <Copy className="size-[18px]" />
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ReadableField.displayName = "ReadableField";
`, prefix),
        },
      ],
    },
    "select-field": {
      name: "select-field",
      description: "A select field with label, helper text, and validation states",
      category: "form",
      dependencies: [
            "@radix-ui/react-select@^2.2.6",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "select-field.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface SelectOption {
  /** The value of the option */
  value: string;
  /** The display label of the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Group name for grouping options */
  group?: string;
}

export interface SelectFieldProps {
  /** Label text displayed above the select */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Callback when an option is selected, provides the full option object */
  onSelect?: (option: SelectOption) => void;
  /** Options to display */
  options: SelectOption[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
}

/**
 * A comprehensive select field component with label, icons, validation states, and more.
 *
 * @example
 * \`\`\`tsx
 * <SelectField
 *   label="Authentication"
 *   placeholder="Select authentication method"
 *   options={[
 *     { value: 'none', label: 'None' },
 *     { value: 'basic', label: 'Basic Auth' },
 *     { value: 'bearer', label: 'Bearer Token' },
 *   ]}
 *   required
 * />
 * \`\`\`
 */
const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      placeholder = "Select an option",
      value,
      defaultValue,
      onValueChange,
      onSelect,
      options,
      searchable,
      searchPlaceholder = "Search...",
      wrapperClassName,
      triggerClassName,
      labelClassName,
      id,
      name,
    },
    ref
  ) => {
    // Internal state for search
    const [searchQuery, setSearchQuery] = React.useState("");

    // Combined value change handler that also fires onSelect with full option object
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        onValueChange?.(newValue);
        if (onSelect) {
          const option = options.find((o) => o.value === newValue);
          if (option) {
            onSelect(option);
          }
        }
      },
      [onValueChange, onSelect, options]
    );

    // Derive state from props
    const derivedState = error ? "error" : "default";

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = \`\${selectId}-helper\`;
    const errorId = \`\${selectId}-error\`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {};
      const ungrouped: SelectOption[] = [];

      options.forEach((option) => {
        // Filter by search query if searchable
        if (searchable && searchQuery) {
          if (!option.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
          }
        }

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(option);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options, searchable, searchQuery]);

    const hasGroups = Object.keys(groupedOptions.groups).length > 0;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    // Reset search when dropdown closes
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setSearchQuery("");
      }
    };

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-xs font-normal text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Select */}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={disabled || loading}
          name={name}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            state={derivedState}
            className={cn(loading && "pr-10", triggerClassName)}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin text-semantic-text-muted" />
            )}
          </SelectTrigger>
          <SelectContent>
            {/* Search input */}
            {searchable && (
              <div className="px-2 pb-2">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-8 px-3 text-sm border border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
                  // Prevent closing dropdown when clicking input
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Ungrouped options */}
            {groupedOptions.ungrouped.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* Grouped options */}
            {hasGroups &&
              Object.entries(groupedOptions.groups).map(
                ([groupName, groupOptions]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel>{groupName}</SelectLabel>
                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                              >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              )}

            {/* No results message */}
            {searchable &&
              searchQuery &&
              groupedOptions.ungrouped.length === 0 &&
              Object.keys(groupedOptions.groups).length === 0 && (
                <div className="py-6 text-center text-sm text-semantic-text-muted">
                  No results found
                </div>
              )}
          </SelectContent>
        </Select>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-semantic-text-muted">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
`, prefix),
        },
      ],
    },
    "multi-select": {
      name: "multi-select",
      description: "A multi-select dropdown component with search, badges, and async loading",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "multi-select.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X, Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * MultiSelect trigger variants matching TextField styling
 */
const multiSelectTriggerVariants = cva(
  "flex min-h-10 w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-sm text-semantic-text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface MultiSelectOption {
  /** The value of the option */
  value: string;
  /** The display label of the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface MultiSelectProps extends VariantProps<
  typeof multiSelectTriggerVariants
> {
  /** Label text displayed above the select */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Currently selected values (controlled) */
  value?: string[];
  /** Default values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when values change */
  onValueChange?: (value: string[]) => void;
  /** Options to display */
  options: MultiSelectOption[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Maximum selections allowed */
  maxSelections?: number;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
}

/**
 * A multi-select component with tags, search, and validation states.
 *
 * @example
 * \`\`\`tsx
 * <MultiSelect
 *   label="Skills"
 *   placeholder="Select skills"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *     { value: 'angular', label: 'Angular' },
 *   ]}
 *   onValueChange={(values) => console.log(values)}
 * />
 * \`\`\`
 */
const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      placeholder = "Select options",
      value,
      defaultValue = [],
      onValueChange,
      options,
      searchable,
      searchPlaceholder = "Search...",
      maxSelections,
      wrapperClassName,
      triggerClassName,
      labelClassName,
      state,
      id,
      name,
    },
    ref
  ) => {
    // Internal state for selected values (uncontrolled mode)
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);
    // Dropdown open state
    const [isOpen, setIsOpen] = React.useState(false);
    // Search query
    const [searchQuery, setSearchQuery] = React.useState("");

    // Container ref for click outside detection
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Determine if controlled
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = \`\${selectId}-helper\`;
    const errorId = \`\${selectId}-error\`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Filter options by search query
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchable, searchQuery]);

    // Get selected option labels
    const selectedLabels = React.useMemo(() => {
      return selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
    }, [selectedValues, options]);

    // Handle toggle selection
    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : maxSelections && selectedValues.length >= maxSelections
          ? selectedValues
          : [...selectedValues, optionValue];

      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    // Handle remove tag
    const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    // Handle clear all
    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) {
        setInternalValue([]);
      }
      onValueChange?.([]);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1 relative", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-xs font-normal text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Trigger */}
        <button
          ref={ref}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          disabled={disabled || loading}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            multiSelectTriggerVariants({ state: derivedState }),
            "text-left gap-2",
            triggerClassName
          )}
        >
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-semantic-text-placeholder">
                {placeholder}
              </span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={selectedValues[index]}
                  className="inline-flex items-center gap-1 bg-semantic-bg-ui text-semantic-text-primary text-xs px-2 py-0.5 rounded"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeValue(selectedValues[index], e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeValue(
                          selectedValues[index],
                          e as unknown as React.MouseEvent
                        );
                      }
                    }}
                    className="cursor-pointer hover:text-semantic-error-primary focus:outline-none"
                    aria-label={\`Remove \${label}\`}
                  >
                    <X className="size-3" />
                  </span>
                </span>
              ))
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    clearAll(e as unknown as React.MouseEvent);
                  }
                }}
                className="p-0.5 cursor-pointer hover:text-semantic-error-primary focus:outline-none"
                aria-label="Clear all"
              >
                <X className="size-4 text-semantic-text-muted" />
              </span>
            )}
            {loading ? (
              <Loader2 className="size-4 animate-spin text-semantic-text-muted" />
            ) : (
              <ChevronDown
                className={cn(
                  "size-4 text-semantic-text-muted transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full rounded bg-semantic-bg-primary border border-semantic-border-layout shadow-md",
              "top-full"
            )}
            role="listbox"
            aria-multiselectable="true"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-semantic-border-layout">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-semantic-text-muted">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isDisabled =
                    option.disabled ||
                    (!isSelected &&
                      maxSelections !== undefined &&
                      maxSelections > 0 &&
                      selectedValues.length >= maxSelections);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && toggleOption(option.value)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-semantic-text-primary outline-none",
                        "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
                        isSelected && "bg-semantic-bg-ui",
                        isDisabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <span className="absolute right-2 flex size-4 items-center justify-center">
                        {isSelected && (
                          <Check className="size-4 text-semantic-brand" />
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with count */}
            {maxSelections && (
              <div className="p-2 border-t border-semantic-border-layout text-xs text-semantic-text-muted">
                {selectedValues.length} / {maxSelections} selected
              </div>
            )}
          </div>
        )}

        {/* Hidden input for form submission */}
        {name &&
          selectedValues.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-semantic-text-muted">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect, multiSelectTriggerVariants };
`, prefix),
        },
      ],
    }
  }
}
