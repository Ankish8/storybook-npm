// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: custom

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
    const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\/[a-z][a-z0-9-]*)?:)|((data|aria)-\[[^\]]+\]:))+/)
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
    'checkbox', 'radio', 'file', 'image', 'color', 'date', 'time', 'datetime-local',
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

  // Skip natural language sentences — strings with uppercase words, periods, or common sentence patterns
  // Tailwind classes are always lowercase (except arbitrary values in brackets)
  if (/[A-Z][a-z]{2,}/.test(str) && !str.includes('[')) return false
  // Skip strings ending with punctuation (sentences)
  if (/[.!?]$/.test(str.trim())) return false
  // Skip strings with common English words that aren't Tailwind utilities
  const sentenceWords = ['for', 'and', 'the', 'with', 'over', 'from', 'into', 'that', 'this', 'your', 'our']
  const tokens = str.split(/s+/)
  if (tokens.length >= 3 && tokens.some(w => sentenceWords.includes(w.toLowerCase()))) return false

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

  // Single word utilities — check BEFORE npm regex so "relative", "flex", etc. aren't misidentified
  const singleWordUtilities = /^(flex|grid|block|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky|isolate|isolation-auto|overflow-auto|overflow-hidden|overflow-clip|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overscroll-auto|overscroll-contain|overscroll-none|truncate|antialiased|subpixel-antialiased|italic|not-italic|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|sr-only|not-sr-only|resize|resize-none|resize-x|resize-y|snap-start|snap-end|snap-center|snap-align-none|snap-normal|snap-always|touch-auto|touch-none|touch-pan-x|touch-pan-left|touch-pan-right|touch-pan-y|touch-pan-up|touch-pan-down|touch-pinch-zoom|touch-manipulation|select-none|select-text|select-all|select-auto|will-change-auto|will-change-scroll|will-change-contents|will-change-transform|grow|grow-0|shrink|shrink-0|transform|transform-cpu|transform-gpu|transform-none|transition|transition-none|transition-all|transition-colors|transition-opacity|transition-shadow|transition-transform|animate-none|animate-spin|animate-ping|animate-pulse|animate-bounce)$/
  if (!str.includes(' ') && singleWordUtilities.test(str)) return true

  // Skip npm package names (but we already caught Tailwind utilities above)
  if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(' ')) return false

  // Check if any word looks like a Tailwind class
  const words = str.split(/\s+/)
  return words.some(cls => {
    if (!cls) return false

    // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
    // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
    if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return false

    // Single word utilities (reuse same regex for multi-word strings)
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
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\/[a-z][a-z0-9-]*)?:)|((data|aria|group|peer)(\/[a-z0-9-]+)?-?\[[^\]]+\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        let utility = cls.slice(variants.length)
        if (!utility) return cls

        // Handle ! important modifier: hover:!p-0 → hover:!tw-p-0
        const isImportant = utility.startsWith('!')
        if (isImportant) utility = utility.slice(1)

        // Prefix the utility part, keep variants as-is
        if (utility.startsWith('-')) {
          return `${variants}${isImportant ? '!' : ''}-${prefix}${utility.slice(1)}`
        }
        return `${variants}${isImportant ? '!' : ''}${prefix}${utility}`
      }

      // Handle ! important modifier: !p-0 → !tw-p-0
      if (cls.startsWith('!') && cls.length > 1) {
        const rest = cls.slice(1)
        if (rest.startsWith('-') && rest.length > 1) {
          return `!-${prefix}${rest.slice(1)}`
        }
        return `!${prefix}${rest}`
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
  const nonClassKeys = ['name', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy', 'description', 'title', 'content', 'header', 'footer', 'caption', 'summary', 'tooltip', 'errorMessage', 'successMessage', 'warningMessage', 'infoMessage', 'hint']

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

export function getCustomRegistry(prefix: string = ''): Registry {
  return {
    "event-selector": {
      name: "event-selector",
      description: "A component for selecting webhook events with groups, categories, and tri-state checkboxes",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "checkbox",
            "accordion"
      ],
      isMultiFile: true,
      directory: "event-selector",
      mainFile: "event-selector.tsx",
      files: [
        {
          name: "event-selector.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { EventGroupComponent } from "./event-group";
import type { EventSelectorProps, EventCategory, EventGroup } from "./types";

/**
 * EventSelector - A component for selecting webhook events
 *
 * Install via CLI:
 * \`\`\`bash
 * npx myoperator-ui add event-selector
 * \`\`\`
 *
 * Or import directly from npm:
 * \`\`\`tsx
 * import { EventSelector } from "@myoperator/ui"
 * \`\`\`
 *
 * @example
 * \`\`\`tsx
 * <EventSelector
 *   events={events}
 *   groups={groups}
 *   selectedEvents={selected}
 *   onSelectionChange={setSelected}
 * />
 * \`\`\`
 */
export const EventSelector = React.forwardRef<
  HTMLDivElement,
  EventSelectorProps
>(
  (
    {
      events,
      groups,
      categories,
      selectedEvents: controlledSelected,
      onSelectionChange,
      defaultSelectedEvents = [],
      title = "Events",
      description = "Select which events should trigger this webhook",
      emptyGroupMessage,
      renderEmptyGroup,
      className,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled state
    const [internalSelected, setInternalSelected] = React.useState<string[]>(
      defaultSelectedEvents
    );

    const isControlled = controlledSelected !== undefined;
    const selectedEvents = isControlled ? controlledSelected : internalSelected;

    const handleSelectionChange = React.useCallback(
      (newSelection: string[]) => {
        if (!isControlled) {
          setInternalSelected(newSelection);
        }
        onSelectionChange?.(newSelection);
      },
      [isControlled, onSelectionChange]
    );

    // Get events for a specific group
    const getEventsForGroup = (groupId: string) => {
      return events.filter((event) => event.group === groupId);
    };

    // Get groups for a specific category
    const getGroupsForCategory = (category: EventCategory): EventGroup[] => {
      return category.groups
        .map((groupId) => groups.find((g) => g.id === groupId))
        .filter((g): g is EventGroup => g !== undefined);
    };

    // Calculate total selected count
    const totalSelected = selectedEvents.length;

    // Render groups without categories
    const renderGroups = (groupsToRender: EventGroup[]) => {
      return groupsToRender.map((group) => (
        <EventGroupComponent
          key={group.id}
          group={group}
          events={getEventsForGroup(group.id)}
          selectedEvents={selectedEvents}
          onSelectionChange={handleSelectionChange}
          emptyGroupMessage={emptyGroupMessage}
          renderEmptyGroup={renderEmptyGroup}
        />
      ));
    };

    // Render categories with nested groups
    const renderCategories = () => {
      // Ensure categories is an array before using array methods
      if (
        !categories ||
        !Array.isArray(categories) ||
        categories.length === 0
      ) {
        return renderGroups(groups);
      }

      // Get groups that belong to categories
      const groupsInCategories = new Set(categories.flatMap((c) => c.groups));

      // Get orphan groups (not in any category)
      const orphanGroups = groups.filter((g) => !groupsInCategories.has(g.id));

      return (
        <>
          {categories.map((category) => {
            const categoryGroups = getGroupsForCategory(category);
            const categoryEventIds = categoryGroups.flatMap((g) =>
              getEventsForGroup(g.id).map((e) => e.id)
            );
            const selectedInCategory = categoryEventIds.filter((id) =>
              selectedEvents.includes(id)
            );

            return (
              <div
                key={category.id}
                className="border border-semantic-border-layout rounded-lg overflow-hidden"
              >
                {/* Category Header - no checkbox, just label */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-semantic-border-layout">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-semantic-bg-ui">
                        {category.icon}
                      </div>
                    )}
                    <span className="font-medium text-semantic-text-primary">
                      {category.name}
                    </span>
                  </div>
                  {selectedInCategory.length > 0 && (
                    <span className="text-sm text-semantic-text-muted">
                      {selectedInCategory.length} Selected
                    </span>
                  )}
                </div>
                {/* Category Groups */}
                <div className="divide-y divide-semantic-border-layout">
                  {renderGroups(categoryGroups)}
                </div>
              </div>
            );
          })}
          {/* Render orphan groups outside categories */}
          {orphanGroups.length > 0 && renderGroups(orphanGroups)}
        </>
      );
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
              {title}
            </h3>
            {description && (
              <p className="m-0 text-sm text-semantic-text-muted mt-1">
                {description}
              </p>
            )}
          </div>
          <span className="text-sm font-medium text-semantic-text-primary">
            {totalSelected} Selected
          </span>
        </div>

        {/* Groups */}
        <div className="border border-semantic-border-layout rounded-lg overflow-hidden divide-y divide-semantic-border-layout">
          {renderCategories()}
        </div>
      </div>
    );
  }
);
EventSelector.displayName = "EventSelector";
`, prefix),
        },
        {
          name: "event-group.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Checkbox, type CheckedState } from "../checkbox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import { EventItemComponent } from "./event-item";
import type { EventGroupComponentProps } from "./types";

/**
 * Event group with accordion section and group-level checkbox
 */
export const EventGroupComponent = React.forwardRef<
  HTMLDivElement,
  EventGroupComponentProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      group,
      events,
      selectedEvents,
      onSelectionChange,
      emptyGroupMessage = "No events available",
      renderEmptyGroup,
      defaultExpanded = false,
      className,
      ...props
    },
    ref
  ) => {
    // Calculate selection state for this group
    const groupEventIds = events.map((e) => e.id);
    const selectedInGroup = groupEventIds.filter((id) =>
      selectedEvents.includes(id)
    );
    const allSelected =
      groupEventIds.length > 0 &&
      selectedInGroup.length === groupEventIds.length;
    const someSelected =
      selectedInGroup.length > 0 &&
      selectedInGroup.length < groupEventIds.length;

    const checkboxState: CheckedState = allSelected
      ? true
      : someSelected
        ? "indeterminate"
        : false;

    const selectedCount = selectedInGroup.length;

    // Handle group checkbox click
    const handleGroupCheckbox = () => {
      if (allSelected) {
        // Deselect all events in this group
        onSelectionChange(
          selectedEvents.filter((id) => !groupEventIds.includes(id))
        );
      } else {
        // Select all events in this group
        const newSelection = [...selectedEvents];
        groupEventIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        onSelectionChange(newSelection);
      }
    };

    // Handle individual event selection
    const handleEventSelection = (eventId: string, selected: boolean) => {
      if (selected) {
        onSelectionChange([...selectedEvents, eventId]);
      } else {
        onSelectionChange(selectedEvents.filter((id) => id !== eventId));
      }
    };

    // Single event in group: render as flat item (no accordion)
    if (events.length === 1) {
      const event = events[0];
      const isSelected = selectedEvents.includes(event.id);

      return (
        <div ref={ref} className={cn("bg-white p-4", className)} {...props}>
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                handleEventSelection(event.id, checked === true)
              }
              aria-label={\`Select \${event.name}\`}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-semantic-text-primary">
                {event.name}
              </span>
              <p className="m-0 text-sm text-semantic-text-muted mt-0.5">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Multiple events: render as collapsible accordion
    return (
      <div ref={ref} className={cn("bg-white", className)} {...props}>
        <Accordion
          type="multiple"
          defaultValue={defaultExpanded ? [group.id] : []}
        >
          <AccordionItem value={group.id}>
            {/* Header row with checkbox OUTSIDE the trigger button to avoid nested buttons */}
            <div className="flex items-center gap-3 p-4 hover:bg-neutral-200">
              <Checkbox
                checked={checkboxState}
                onCheckedChange={handleGroupCheckbox}
                aria-label={\`Select all \${group.name}\`}
              />
              <AccordionTrigger
                showChevron={true}
                className="flex-1 p-0 hover:bg-transparent"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {group.icon && (
                        <span className="text-semantic-text-muted">
                          {group.icon}
                        </span>
                      )}
                      <span className="font-medium text-semantic-text-primary">
                        {group.name}
                      </span>
                    </div>
                    <span className="text-sm text-semantic-text-muted mt-0.5">
                      {group.description}
                    </span>
                  </div>
                  {selectedCount > 0 && (
                    <span className="text-sm text-semantic-text-muted whitespace-nowrap">
                      {selectedCount} Selected
                    </span>
                  )}
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="border-t border-semantic-border-layout">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventItemComponent
                      key={event.id}
                      event={event}
                      isSelected={selectedEvents.includes(event.id)}
                      onSelectionChange={(selected) =>
                        handleEventSelection(event.id, selected)
                      }
                    />
                  ))
                ) : renderEmptyGroup ? (
                  <div className="py-4 px-8">{renderEmptyGroup(group)}</div>
                ) : (
                  <div className="py-4 px-8 text-sm text-semantic-text-muted italic">
                    {emptyGroupMessage}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
EventGroupComponent.displayName = "EventGroupComponent";
`, prefix),
        },
        {
          name: "event-item.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Checkbox } from "../checkbox";
import type { EventItemComponentProps } from "./types";

/**
 * Individual event item with checkbox
 */
export const EventItemComponent = React.forwardRef<
  HTMLDivElement,
  EventItemComponentProps & React.HTMLAttributes<HTMLDivElement>
>(({ event, isSelected, onSelectionChange, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start gap-3 py-2 pl-8 pr-4 hover:bg-neutral-200",
        className
      )}
      {...props}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectionChange(checked === true)}
        aria-label={\`Select \${event.name}\`}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-semantic-text-primary">
          {event.name}
        </div>
        <div className="text-sm text-semantic-text-muted mt-0.5 leading-relaxed">
          {event.description}
        </div>
      </div>
    </div>
  );
});
EventItemComponent.displayName = "EventItemComponent";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Represents an individual event item
 */
export interface EventItem {
  /** Unique identifier for the event */
  id: string;
  /** Display name of the event (e.g., "Call.Initiated") */
  name: string;
  /** Description of when this event is triggered */
  description: string;
  /** Group ID this event belongs to */
  group: string;
}

/**
 * Represents a group of events
 */
export interface EventGroup {
  /** Unique identifier for the group */
  id: string;
  /** Display name of the group (e.g., "In-Call Events") */
  name: string;
  /** Description of the group */
  description: string;
  /** Optional icon to display next to the group name */
  icon?: React.ReactNode;
}

/**
 * Optional top-level category that can contain multiple groups
 */
export interface EventCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category (e.g., "Call Events (Voice)") */
  name: string;
  /** Optional icon to display next to the category name */
  icon?: React.ReactNode;
  /** Array of group IDs that belong to this category */
  groups: string[];
}

/**
 * Props for the EventSelector component
 */
export interface EventSelectorProps {
  // Data
  /** Array of event items */
  events: EventItem[];
  /** Array of event groups */
  groups: EventGroup[];
  /** Optional array of categories for top-level grouping */
  categories?: EventCategory[];

  // State (controlled mode)
  /** Array of selected event IDs (controlled) */
  selectedEvents?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;

  // State (uncontrolled mode)
  /** Default selected events for uncontrolled usage */
  defaultSelectedEvents?: string[];

  // Customization
  /** Title displayed at the top (default: "Events") */
  title?: string;
  /** Description displayed below the title */
  description?: string;
  /** Message shown when a group has no events */
  emptyGroupMessage?: string;
  /** Custom render function for empty group state (overrides emptyGroupMessage) */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode;

  // Styling
  /** Additional CSS classes for the root element */
  className?: string;
}

/**
 * Internal props for EventGroup component
 */
export interface EventGroupComponentProps {
  /** The group data */
  group: EventGroup;
  /** Events that belong to this group */
  events: EventItem[];
  /** Currently selected event IDs */
  selectedEvents: string[];
  /** Callback to update selected events */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Message shown when group has no events */
  emptyGroupMessage?: string;
  /** Custom render function for empty group state */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode;
  /** Whether the accordion should be expanded by default (default: false) */
  defaultExpanded?: boolean;
}

/**
 * Internal props for EventItem component
 */
export interface EventItemComponentProps {
  /** The event data */
  event: EventItem;
  /** Whether this event is selected */
  isSelected: boolean;
  /** Callback when selection changes */
  onSelectionChange: (selected: boolean) => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { EventSelector } from "./event-selector";
export type {
  EventSelectorProps,
  EventItem,
  EventGroup,
  EventCategory,
} from "./types";
`, prefix),
        }
      ],
    },
    "key-value-input": {
      name: "key-value-input",
      description: "A component for managing key-value pairs with validation and duplicate detection",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "input"
      ],
      isMultiFile: true,
      directory: "key-value-input",
      mainFile: "key-value-input.tsx",
      files: [
        {
          name: "key-value-input.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { KeyValueRow } from "./key-value-row";
import type { KeyValueInputProps, KeyValuePair } from "./types";

// Helper to generate unique IDs
const generateId = () =>
  \`kv-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;

/**
 * KeyValueInput - A component for managing key-value pairs
 *
 * Install via CLI:
 * \`\`\`bash
 * npx myoperator-ui add key-value-input
 * \`\`\`
 *
 * Or import directly from npm:
 * \`\`\`tsx
 * import { KeyValueInput } from "@myoperator/ui"
 * \`\`\`
 *
 * @example
 * \`\`\`tsx
 * <KeyValueInput
 *   title="HTTP Headers"
 *   description="Add custom headers for the webhook request"
 *   value={headers}
 *   onChange={setHeaders}
 * />
 * \`\`\`
 */
export const KeyValueInput = React.forwardRef<
  HTMLDivElement,
  KeyValueInputProps
>(
  (
    {
      title,
      description,
      addButtonText = "Add Header",
      maxItems = 10,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      keyLabel = "Key",
      valueLabel = "Value",
      keyRequired = true,
      valueRequired = true,
      value: controlledValue,
      onChange,
      defaultValue = [],
      className,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled state
    const [internalPairs, setInternalPairs] =
      React.useState<KeyValuePair[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const pairs = isControlled ? controlledValue : internalPairs;

    // Track which fields have been touched for validation
    const [touchedKeys, setTouchedKeys] = React.useState<Set<string>>(
      new Set()
    );
    const [touchedValues, setTouchedValues] = React.useState<Set<string>>(
      new Set()
    );

    const handlePairsChange = React.useCallback(
      (newPairs: KeyValuePair[]) => {
        if (!isControlled) {
          setInternalPairs(newPairs);
        }
        onChange?.(newPairs);
      },
      [isControlled, onChange]
    );

    // Check for duplicate keys (case-insensitive)
    const getDuplicateKeys = React.useCallback((): Set<string> => {
      const keyCount = new Map<string, number>();
      pairs.forEach((pair) => {
        if (pair.key.trim()) {
          const key = pair.key.toLowerCase();
          keyCount.set(key, (keyCount.get(key) || 0) + 1);
        }
      });
      const duplicates = new Set<string>();
      keyCount.forEach((count, key) => {
        if (count > 1) duplicates.add(key);
      });
      return duplicates;
    }, [pairs]);

    const duplicateKeys = getDuplicateKeys();

    // Add new row
    const handleAdd = () => {
      if (pairs.length >= maxItems) return;
      const newPair: KeyValuePair = {
        id: generateId(),
        key: "",
        value: "",
      };
      handlePairsChange([...pairs, newPair]);
    };

    // Update key
    const handleKeyChange = (id: string, key: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, key } : pair))
      );
      setTouchedKeys((prev) => new Set(prev).add(id));
    };

    // Update value
    const handleValueChange = (id: string, value: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, value } : pair))
      );
      setTouchedValues((prev) => new Set(prev).add(id));
    };

    // Delete row
    const handleDelete = (id: string) => {
      handlePairsChange(pairs.filter((pair) => pair.id !== id));
      setTouchedKeys((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setTouchedValues((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };

    const isAtLimit = pairs.length >= maxItems;
    const addButtonTitle = isAtLimit
      ? \`Maximum of \${maxItems} items allowed\`
      : undefined;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
            {title}
          </h3>
          {description && (
            <p className="m-0 text-sm text-semantic-text-muted mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Content Container with Background - only show when there are items */}
        {pairs.length > 0 && (
          <div className="bg-semantic-bg-ui rounded-lg p-4 mb-4">
            {/* Column Headers */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <span className="text-sm font-medium text-semantic-text-primary">
                  {keyLabel}
                  {keyRequired && (
                    <span className="text-semantic-error-primary ml-0.5">
                      *
                    </span>
                  )}
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-semantic-text-primary">
                  {valueLabel}
                  {valueRequired && (
                    <span className="text-semantic-error-primary ml-0.5">
                      *
                    </span>
                  )}
                </span>
              </div>
              {/* Spacer for delete button column */}
              <div className="w-8 flex-shrink-0" />
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {pairs.map((pair) => (
                <KeyValueRow
                  key={pair.id}
                  pair={pair}
                  isDuplicateKey={duplicateKeys.has(pair.key.toLowerCase())}
                  isKeyEmpty={touchedKeys.has(pair.id) && !pair.key.trim()}
                  isValueEmpty={
                    touchedValues.has(pair.id) && !pair.value.trim()
                  }
                  keyRequired={keyRequired}
                  valueRequired={valueRequired}
                  keyPlaceholder={keyPlaceholder}
                  valuePlaceholder={valuePlaceholder}
                  onKeyChange={handleKeyChange}
                  onValueChange={handleValueChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Button using dashed variant - outside the gray container */}
        <Button
          type="button"
          variant="dashed"
          onClick={handleAdd}
          disabled={isAtLimit}
          title={addButtonTitle}
          className="w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>

        {/* Limit indicator */}
        {isAtLimit && (
          <p className="m-0 text-xs text-semantic-text-muted mt-2 text-center">
            Maximum of {maxItems} items reached
          </p>
        )}
      </div>
    );
  }
);
KeyValueInput.displayName = "KeyValueInput";
`, prefix),
        },
        {
          name: "key-value-row.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Input } from "../input";
import { Button } from "../button";
import type { KeyValueRowProps } from "./types";

/**
 * Individual key-value pair row with inputs and delete button
 */
export const KeyValueRow = React.forwardRef<
  HTMLDivElement,
  KeyValueRowProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      pair,
      isDuplicateKey,
      isKeyEmpty,
      isValueEmpty,
      keyRequired = true,
      valueRequired = true,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      onKeyChange,
      onValueChange,
      onDelete,
      className,
      ...props
    },
    ref
  ) => {
    // Determine if inputs should show error state
    const keyHasError = isDuplicateKey || (keyRequired && isKeyEmpty);
    const valueHasError = valueRequired && isValueEmpty;

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        {/* Key Input */}
        <div className="flex-1">
          <Input
            value={pair.key}
            onChange={(e) => onKeyChange(pair.id, e.target.value)}
            placeholder={keyPlaceholder}
            state={keyHasError ? "error" : "default"}
            required={keyRequired}
            aria-label="Key"
          />
        </div>

        {/* Value Input */}
        <div className="flex-1">
          <Input
            value={pair.value}
            onChange={(e) => onValueChange(pair.id, e.target.value)}
            placeholder={valuePlaceholder}
            state={valueHasError ? "error" : "default"}
            required={valueRequired}
            aria-label="Value"
          />
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(pair.id)}
          className="text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface flex-shrink-0"
          aria-label="Delete row"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
KeyValueRow.displayName = "KeyValueRow";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`/**
 * Represents a single key-value pair
 */
export interface KeyValuePair {
  /** Unique identifier for the pair */
  id: string;
  /** The key (e.g., header name) */
  key: string;
  /** The value (e.g., header value) */
  value: string;
}

/**
 * Props for the KeyValueInput component
 */
export interface KeyValueInputProps {
  // Customization
  /** Title displayed at the top (e.g., "HTTP Headers") */
  title: string;
  /** Description displayed below the title */
  description?: string;
  /** Text for the add button (default: "Add Header") */
  addButtonText?: string;
  /** Maximum number of items allowed (default: 10) */
  maxItems?: number;
  /** Placeholder for key input */
  keyPlaceholder?: string;
  /** Placeholder for value input */
  valuePlaceholder?: string;
  /** Label for key column header (default: "Key") */
  keyLabel?: string;
  /** Label for value column header (default: "Value") */
  valueLabel?: string;

  // Validation
  /** Whether key field is required (default: true) */
  keyRequired?: boolean;
  /** Whether value field is required (default: true) */
  valueRequired?: boolean;

  // State (controlled mode)
  /** Array of key-value pairs (controlled) */
  value?: KeyValuePair[];
  /** Callback when pairs change */
  onChange?: (pairs: KeyValuePair[]) => void;

  // State (uncontrolled mode)
  /** Default key-value pairs for uncontrolled usage */
  defaultValue?: KeyValuePair[];

  // Styling
  /** Additional CSS classes for the root element */
  className?: string;
}

/**
 * Internal props for KeyValueRow component
 */
export interface KeyValueRowProps {
  /** The key-value pair data */
  pair: KeyValuePair;
  /** Whether the key is a duplicate */
  isDuplicateKey: boolean;
  /** Whether key is empty (for validation) */
  isKeyEmpty: boolean;
  /** Whether value is empty (for validation) */
  isValueEmpty: boolean;
  /** Whether key field is required */
  keyRequired?: boolean;
  /** Whether value field is required */
  valueRequired?: boolean;
  /** Placeholder for key input */
  keyPlaceholder?: string;
  /** Placeholder for value input */
  valuePlaceholder?: string;
  /** Callback when key changes */
  onKeyChange: (id: string, key: string) => void;
  /** Callback when value changes */
  onValueChange: (id: string, value: string) => void;
  /** Callback when row is deleted */
  onDelete: (id: string) => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { KeyValueInput } from "./key-value-input";
export type { KeyValueInputProps, KeyValuePair } from "./types";
`, prefix),
        }
      ],
    },
    "api-feature-card": {
      name: "api-feature-card",
      description: "A card component for displaying API features with icon, title, description, and action button",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button"
      ],
      isMultiFile: true,
      directory: "api-feature-card",
      mainFile: "api-feature-card.tsx",
      files: [
        {
          name: "api-feature-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Button } from "../button";
import { cn } from "../../../lib/utils";

export interface Capability {
  /** Unique identifier for the capability */
  id: string;
  /** Display text for the capability */
  label: string;
}

export interface ApiFeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** List of key capabilities */
  capabilities?: Capability[];
  /** Text for the action button */
  actionLabel?: string;
  /** Icon for the action button */
  actionIcon?: React.ReactNode;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Label for the capabilities section */
  capabilitiesLabel?: string;
}

/**
 * ApiFeatureCard displays an API feature with icon, title, description,
 * action button, and a list of key capabilities.
 *
 * @example
 * \`\`\`tsx
 * <ApiFeatureCard
 *   icon={<Phone className="h-5 w-5" />}
 *   title="Calling API"
 *   description="Manage real-time call flow, recordings, and intelligent routing."
 *   capabilities={[
 *     { id: "1", label: "Real-time Call Control" },
 *     { id: "2", label: "Live Call Events (Webhooks)" },
 *   ]}
 *   onAction={() => console.log("Manage clicked")}
 * />
 * \`\`\`
 */
export const ApiFeatureCard = React.forwardRef<
  HTMLDivElement,
  ApiFeatureCardProps
>(
  (
    {
      icon,
      title,
      description,
      capabilities = [],
      actionLabel = "Manage",
      actionIcon,
      onAction,
      capabilitiesLabel = "Key Capabilities",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-lg border border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--semantic-bg-primary,#FFFFFF)] p-6 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Icon Container */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--semantic-info-surface,#ECF1FB)]">
              <span className="text-[var(--semantic-info-primary,#4275D6)] [&_svg]:h-5 [&_svg]:w-5">
                {icon}
              </span>
            </div>

            {/* Title and Description */}
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-base font-semibold text-[var(--semantic-text-primary,#181D27)]">
                {title}
              </h3>
              <p className="m-0 text-sm text-[var(--semantic-text-muted,#717680)] tracking-[0.035px]">
                {description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="default"
            size="default"
            leftIcon={actionIcon}
            onClick={onAction}
            className="shrink-0"
          >
            {actionLabel}
          </Button>
        </div>

        {/* Capabilities Section */}
        {capabilities.length > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--color-neutral-50,#FAFAFA)] -mx-6 -mb-6 p-6">
            <span className="text-sm font-semibold uppercase tracking-[0.014px] text-[var(--color-neutral-400,#A4A7AE)]">
              {capabilitiesLabel}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {capabilities.map((capability) => (
                <div
                  key={capability.id}
                  className="flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-neutral-400,#A4A7AE)]" />
                  <span className="text-sm text-[var(--semantic-text-primary,#181D27)] tracking-[0.035px]">
                    {capability.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ApiFeatureCard.displayName = "ApiFeatureCard";
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ApiFeatureCard } from "./api-feature-card";
export type { ApiFeatureCardProps, Capability } from "./api-feature-card";
`, prefix),
        }
      ],
    },
    "endpoint-details": {
      name: "endpoint-details",
      description: "A component for displaying API endpoint details with copy-to-clipboard and secret field support",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "readable-field"
      ],
      isMultiFile: true,
      directory: "endpoint-details",
      mainFile: "endpoint-details.tsx",
      files: [
        {
          name: "endpoint-details.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ReadableField } from "../readable-field";

export interface EndpointDetailsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Variant determines field layout and visibility */
  variant?: "calling" | "whatsapp";
  /** Base URL for the API endpoint */
  baseUrl?: string;
  /** Company ID */
  companyId?: string;
  /** Authentication token (secret, masked by default in both variants) */
  authToken: string;
  /** Secret key (secret) - only shown in calling variant */
  secretKey?: string;
  /** API key (visible) - only shown in calling variant */
  apiKey?: string;
  /** Callback when a field value is copied */
  onValueCopy?: (field: string, value: string) => void;
  /** Callback when regenerate is clicked for a field */
  onRegenerate?: (field: "authToken" | "secretKey") => void;
  /** When false, regenerate buttons are hidden entirely */
  showRegenerate?: boolean;
  /** When false, regenerate buttons are visible but disabled */
  canRegenerate?: boolean;
  /** Tooltip text shown on hover when regenerate is disabled. Only used when canRegenerate is false */
  regenerateDisabledTooltip?: string;
  /** Callback when revoke access is clicked - only used in calling variant */
  onRevokeAccess?: () => void;
  /** Whether to show the revoke access section - only used in calling variant */
  showRevokeSection?: boolean;
  /** Custom revoke section title */
  revokeTitle?: string;
  /** Custom revoke section description */
  revokeDescription?: string;
}

/**
 * EndpointDetails displays API endpoint credentials with copy functionality.
 * Used for showing API keys, authentication tokens, and other sensitive credentials.
 *
 * Supports two variants:
 * - \`calling\` (default): Full version with all 5 fields + revoke section
 * - \`whatsapp\`: Simplified with 3 fields (baseUrl, companyId, authToken), no revoke
 *
 * @example
 * \`\`\`tsx
 * // Calling API (default)
 * <EndpointDetails
 *   variant="calling"
 *   baseUrl="https://api.myoperator.co/v3/voice/gateway"
 *   companyId="12"
 *   authToken="sk_live_abc123"
 *   secretKey="whsec_xyz789"
 *   apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
 *   onRegenerate={(field) => console.log(\`Regenerate \${field}\`)}
 *   onRevokeAccess={() => console.log("Revoke access")}
 * />
 *
 * // WhatsApp API
 * <EndpointDetails
 *   variant="whatsapp"
 *   baseUrl="https://api.myoperator.co/whatsapp"
 *   companyId="WA-12345"
 *   authToken="waba_token_abc123"
 *   onRegenerate={(field) => console.log(\`Regenerate \${field}\`)}
 * />
 * \`\`\`
 */
export const EndpointDetails = React.forwardRef<
  HTMLDivElement,
  EndpointDetailsProps
>(
  (
    {
      title = "Endpoint Details",
      variant = "calling",
      baseUrl,
      companyId,
      authToken,
      secretKey,
      apiKey,
      onValueCopy,
      onRegenerate,
      showRegenerate = true,
      canRegenerate = true,
      regenerateDisabledTooltip = "You are not allowed to regenerate this token",
      onRevokeAccess,
      showRevokeSection = true,
      revokeTitle = "Revoke API Access",
      revokeDescription = "Revoking access will immediately disable all integrations using these keys.",
      className,
      ...props
    },
    ref
  ) => {
    const isCalling = variant === "calling";

    const handleCopy = (field: string) => (value: string) => {
      onValueCopy?.(field, value);
    };

    const buildRegenerateAction = (field: "authToken" | "secretKey") => {
      if (!showRegenerate) return undefined;
      return {
        label: "Regenerate",
        onClick: () => onRegenerate?.(field),
        disabled: !canRegenerate,
        disabledTooltip: !canRegenerate ? regenerateDisabledTooltip : undefined,
      };
    };

    // Collect non-secret visible fields for the top rows
    const topFields: Array<{ label: string; value: string; field: string }> =
      [];
    if (baseUrl)
      topFields.push({ label: "Base URL", value: baseUrl, field: "baseUrl" });
    if (companyId)
      topFields.push({
        label: "Company ID",
        value: companyId,
        field: "companyId",
      });
    if (isCalling && apiKey)
      topFields.push({ label: "x-api-key", value: apiKey, field: "apiKey" });

    // Group fields into rows of 2
    const topRows: Array<typeof topFields> = [];
    for (let i = 0; i < topFields.length; i += 2) {
      topRows.push(topFields.slice(i, i + 2));
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-lg border border-semantic-border-layout p-6",
          className
        )}
        {...props}
      >
        {/* Title */}
        <div className="flex items-start gap-5">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            {title}
          </h2>
        </div>

        {/* Credentials Grid */}
        <div className="flex flex-col gap-[30px]">
          {/* Non-secret fields in rows of 2 */}
          {topRows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "grid gap-[25px]",
                row.length === 2 ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              {row.map((f) => (
                <ReadableField
                  key={f.field}
                  label={f.label}
                  value={f.value}
                  onValueCopy={handleCopy(f.field)}
                />
              ))}
            </div>
          ))}

          {/* Authentication field - different based on variant */}
          {isCalling ? (
            /* Calling variant: 2-col row with Authentication + Secret Key */
            <div className="grid grid-cols-2 gap-[25px]">
              <ReadableField
                label="Authentication"
                value={authToken}
                secret
                helperText="Used for client-side integrations."
                headerAction={buildRegenerateAction("authToken")}
                onValueCopy={handleCopy("authToken")}
              />
              {secretKey && (
                <ReadableField
                  label="Secret Key"
                  value={secretKey}
                  secret
                  helperText="Never share this key or expose it in client-side code."
                  headerAction={buildRegenerateAction("secretKey")}
                  onValueCopy={handleCopy("secretKey")}
                />
              )}
            </div>
          ) : (
            /* WhatsApp variant: full-width Authentication, secret with regenerate */
            <ReadableField
              label="Authentication"
              value={authToken}
              secret
              headerAction={buildRegenerateAction("authToken")}
              onValueCopy={handleCopy("authToken")}
            />
          )}

          {/* Revoke Section - only for calling variant */}
          {isCalling && showRevokeSection && (
            <div className="flex items-center justify-between border-t border-semantic-border-layout pt-6">
              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
                  {revokeTitle}
                </h3>
                <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
                  {revokeDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={onRevokeAccess}
                className="flex items-center gap-1 text-sm text-semantic-error-primary hover:text-semantic-error-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-error-primary transition-colors tracking-[0.035px] rounded"
              >
                <XCircle className="size-4" />
                <span>Revoke Access</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EndpointDetails.displayName = "EndpointDetails";
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { EndpointDetails } from "./endpoint-details";
export type { EndpointDetailsProps } from "./endpoint-details";
`, prefix),
        }
      ],
    },
    "alert-configuration": {
      name: "alert-configuration",
      description: "A configuration card for alert settings with inline editing modal",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "form-modal",
            "select"
      ],
      isMultiFile: true,
      directory: "alert-configuration",
      mainFile: "alert-configuration.tsx",
      files: [
        {
          name: "alert-configuration.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Button } from "../button";
import { Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface AlertConfigurationProps {
  /** Minimum balance threshold */
  minimumBalance: number;
  /** Minimum top-up amount */
  minimumTopup: number;
  /** Currency symbol (default: ₹) */
  currencySymbol?: string;
  /** Callback when edit button is clicked */
  onEdit?: () => void;
  /** Custom className for the container */
  className?: string;
}

/**
 * AlertConfiguration component displays current alert values for minimum balance and top-up.
 * Used in payment auto-pay setup to show notification thresholds.
 */
export const AlertConfiguration = React.forwardRef<
  HTMLDivElement,
  AlertConfigurationProps
>(
  (
    {
      minimumBalance,
      minimumTopup,
      currencySymbol = "₹",
      onEdit,
      className,
    },
    ref
  ) => {
    const formatCurrency = (amount: number) => {
      const formatted = amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return \`\${currencySymbol} \${formatted}\`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-semantic-border-layout bg-semantic-bg-primary",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0px]">
              Alert configurations
            </h3>
            <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
              Define when and how you receive balance notifications
            </p>
          </div>
          <Button
            variant="default"
            size="default"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={onEdit}
            className="shrink-0"
          >
            Edit alert values
          </Button>
        </div>

        {/* Alert Values Section with Top Border */}
        <div className="border-t border-semantic-border-layout px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            {/* Minimum Balance */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                  Minimum balance
                </span>
                <span
                  className={cn(
                    "text-sm tracking-[0.035px]",
                    minimumBalance < 0
                      ? "text-semantic-error-primary"
                      : "text-semantic-text-primary"
                  )}
                >
                  {minimumBalance < 0 ? "-" : ""}{formatCurrency(Math.abs(minimumBalance))}
                </span>
              </div>
              <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px] leading-relaxed">
                You'll be notified by email and SMS when your balance falls below this level.
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-14 bg-semantic-border-layout shrink-0" />

            {/* Minimum Top-up */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                  Minimum topup
                </span>
                <span className="text-sm text-semantic-text-link tracking-[0.035px]">
                  {formatCurrency(minimumTopup)}
                </span>
              </div>
              <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px] leading-relaxed">
                A suggested recharge amount to top up your balance when it falls below the minimum.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AlertConfiguration.displayName = "AlertConfiguration";
`, prefix),
        },
        {
          name: "alert-values-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { FormModal } from "../form-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export interface AlertValueOption {
  /** The numeric value */
  value: number;
  /** Display label (e.g. "₹ 250"). If omitted, formatted automatically from value + currencySymbol */
  label?: string;
}

export interface AlertValuesModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onOpenChange: (open: boolean) => void;
  /** Initial minimum balance value */
  initialMinimumBalance?: number;
  /** Initial minimum top-up value */
  initialMinimumTopup?: number;
  /** Currency symbol (default: ₹) */
  currencySymbol?: string;
  /** Options for the minimum balance dropdown */
  balanceOptions: AlertValueOption[];
  /** Options for the minimum topup dropdown */
  topupOptions: AlertValueOption[];
  /** Callback when values are saved */
  onSave?: (values: { minimumBalance: number; minimumTopup: number }) => void;
  /** Loading state for save button */
  loading?: boolean;
}

/**
 * AlertValuesModal component for editing alert configuration values.
 * Displays a form with inputs for minimum balance and minimum top-up.
 */
export const AlertValuesModal = React.forwardRef<
  HTMLDivElement,
  AlertValuesModalProps
>(
  (
    {
      open,
      onOpenChange,
      initialMinimumBalance = 0,
      initialMinimumTopup = 0,
      currencySymbol = "₹",
      balanceOptions,
      topupOptions,
      onSave,
      loading = false,
    },
    ref
  ) => {
    const [minimumBalance, setMinimumBalance] = React.useState(
      initialMinimumBalance.toString()
    );
    const [minimumTopup, setMinimumTopup] = React.useState(
      initialMinimumTopup.toString()
    );

    const formatOptionLabel = (option: AlertValueOption) =>
      option.label ?? \`\${currencySymbol} \${option.value}\`;

    // Update form values when initial values change
    React.useEffect(() => {
      setMinimumBalance(initialMinimumBalance.toString());
      setMinimumTopup(initialMinimumTopup.toString());
    }, [initialMinimumBalance, initialMinimumTopup, open]);

    const handleSave = () => {
      const balanceValue = parseFloat(minimumBalance) || 0;
      const topupValue = parseFloat(minimumTopup) || 0;

      onSave?.({
        minimumBalance: balanceValue,
        minimumTopup: topupValue,
      });
    };

    const handleCancel = () => {
      // Reset to initial values
      setMinimumBalance(initialMinimumBalance.toString());
      setMinimumTopup(initialMinimumTopup.toString());
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Alert values"
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        size="sm"
      >
        {/* Minimum Balance Select */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-semantic-text-secondary">
            Minimum balance
          </label>
          <Select value={minimumBalance} onValueChange={setMinimumBalance}>
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {balanceOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                >
                  {formatOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Top-up Select */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-semantic-text-secondary">
            Minimum topup
          </label>
          <Select value={minimumTopup} onValueChange={setMinimumTopup}>
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {topupOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                >
                  {formatOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormModal>
    );
  }
);

AlertValuesModal.displayName = "AlertValuesModal";
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { AlertConfiguration } from "./alert-configuration";
export type { AlertConfigurationProps } from "./alert-configuration";

export { AlertValuesModal } from "./alert-values-modal";
export type { AlertValuesModalProps, AlertValueOption } from "./alert-values-modal";
`, prefix),
        }
      ],
    },
    "auto-pay-setup": {
      name: "auto-pay-setup",
      description: "A setup wizard component for configuring automatic payments with payment method selection",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "accordion",
            "button"
      ],
      isMultiFile: true,
      directory: "auto-pay-setup",
      mainFile: "auto-pay-setup.tsx",
      files: [
        {
          name: "auto-pay-setup.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import type { AutoPaySetupProps } from "./types";

/**
 * AutoPaySetup provides a collapsible panel for setting up automatic payments.
 * It displays a description, an informational note callout, and a CTA button.
 *
 * @example
 * \`\`\`tsx
 * <AutoPaySetup
 *   icon={<RefreshCw className="size-5 text-semantic-primary" />}
 *   onCtaClick={() => console.log("Enable auto-pay")}
 * />
 * \`\`\`
 */
export const AutoPaySetup = React.forwardRef<HTMLDivElement, AutoPaySetupProps>(
  (
    {
      title = "Auto-pay setup",
      subtitle = "Hassle-free monthly billing",
      icon,
      bodyText = "Link your internet banking account or enroll your card for recurring payments on MyOperator, where your linked account/card is charged automatically for your subsequent bills and usages on MyOperator",
      noteText = "For card based subscriptions, your card would be charged minimum of \\u20B91 every month even if there are no usages to keep the subscription active, and \\u20B91 will be added as prepaid amount for your service. Initial deduction of \\u20B95 would be made for subscription, which will be auto-refunded.",
      noteLabel = "Note:",
      showCta = true,
      ctaText = "Enable Auto-Pay",
      ctaVariant = "default",
      onCtaClick,
      loading = false,
      disabled = false,
      defaultOpen = true,
      open,
      onOpenChange,
      className,
    },
    ref
  ) => {
    const isControlled = open !== undefined;

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          {...(isControlled
            ? {
                value: open ? ["auto-pay-setup"] : [],
                onValueChange: (val) => onOpenChange?.(val.length > 0),
              }
            : { defaultValue: defaultOpen ? ["auto-pay-setup"] : [] })}
        >
          <AccordionItem value="auto-pay-setup">
            <AccordionTrigger className="px-4 py-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex items-center justify-center size-10 rounded-[10px] bg-[var(--semantic-info-surface)] shrink-0">
                    {icon}
                  </div>
                )}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.01px]">
                    {title}
                  </span>
                  <span className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {subtitle}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-4 border-t border-semantic-border-layout pt-4">
                {/* Description */}
                {bodyText && (
                  <div className="m-0 text-sm font-normal text-semantic-text-primary leading-5 tracking-[0.035px]">
                    {bodyText}
                  </div>
                )}

                {/* Note callout */}
                {noteText && (
                  <div className="rounded bg-[var(--semantic-info-25,#f0f7ff)] border border-[#BEDBFF] px-4 py-3">
                    <p className="m-0 text-sm font-normal text-semantic-text-muted leading-5 tracking-[0.035px]">
                      {noteLabel && (
                        <span className="font-medium text-semantic-text-primary">
                          {noteLabel}{" "}
                        </span>
                      )}
                      {noteText}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                {showCta && (
                  <Button
                    variant={ctaVariant}
                    className="w-full"
                    onClick={onCtaClick}
                    loading={loading}
                    disabled={disabled}
                  >
                    {ctaText}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

AutoPaySetup.displayName = "AutoPaySetup";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Props for the AutoPaySetup component
 */
export interface AutoPaySetupProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Body
  /** Description content displayed below the header when expanded. Accepts a string or JSX (e.g. text with a link). */
  bodyText?: React.ReactNode;

  // Note callout
  /** Note/callout text displayed in a highlighted box */
  noteText?: string;
  /** Label prefix for the note (e.g., "Note:") */
  noteLabel?: string;

  // CTA
  /** Whether to show the CTA button (defaults to true) */
  showCta?: boolean;
  /** Text for the CTA button (defaults to "Enable Auto-Pay") */
  ctaText?: string;
  /** CTA button variant — use "outline" for the subscribed "Edit subscription" state */
  ctaVariant?: "default" | "outline";
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Whether the CTA button shows loading state */
  loading?: boolean;
  /** Whether the CTA button is disabled */
  disabled?: boolean;

  // Accordion
  /** Whether the accordion is open by default (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled open state — use with onOpenChange for exclusive accordion behavior */
  open?: boolean;
  /** Callback fired when the panel is toggled — receives new open state */
  onOpenChange?: (open: boolean) => void;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { AutoPaySetup } from "./auto-pay-setup";
export type { AutoPaySetupProps } from "./types";
`, prefix),
        }
      ],
    },
    "bank-details": {
      name: "bank-details",
      description: "A component for displaying bank account details with copy-to-clipboard functionality",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "accordion"
      ],
      isMultiFile: true,
      directory: "bank-details",
      mainFile: "bank-details.tsx",
      files: [
        {
          name: "bank-details.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import type { BankDetailsProps, BankDetailItem } from "./types";

/**
 * BankDetails displays bank account information inside a collapsible accordion
 * card. Each row shows a label-value pair, with optional copy-to-clipboard
 * support for individual values.
 *
 * @example
 * \`\`\`tsx
 * <BankDetails
 *   icon={<Landmark className="size-5 text-semantic-primary" />}
 *   items={[
 *     { label: "Account holder's name", value: "MyOperator" },
 *     { label: "Account Number", value: "2223330026552601", copyable: true },
 *     { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
 *     { label: "Bank Name", value: "AXIS BANK" },
 *   ]}
 * />
 * \`\`\`
 */
export const BankDetails = React.forwardRef<HTMLDivElement, BankDetailsProps>(
  (
    {
      title = "Bank details",
      subtitle = "Direct NEFT/RTGS transfer",
      icon,
      items,
      defaultOpen = true,
      open,
      onOpenChange,
      onCopy,
      className,
    },
    ref
  ) => {
    const isControlled = open !== undefined;

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          {...(isControlled
            ? {
                value: open ? ["bank-details"] : [],
                onValueChange: (val) => onOpenChange?.(val.length > 0),
              }
            : { defaultValue: defaultOpen ? ["bank-details"] : [] })}
        >
          <AccordionItem value="bank-details">
            <AccordionTrigger className="px-4 py-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex items-center justify-center size-10 rounded-[10px] bg-[var(--semantic-info-surface)] shrink-0">
                    {icon}
                  </div>
                )}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.01px]">
                    {title}
                  </span>
                  <span className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {subtitle}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="border-t border-semantic-border-layout pt-4">
                <div className="rounded-md border border-[var(--semantic-info-200,#e8f1fc)] bg-[var(--semantic-info-25,#f6f8fd)] p-3">
                  <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                      <BankDetailRow
                        key={index}
                        item={item}
                        onCopy={onCopy}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

BankDetails.displayName = "BankDetails";

/* ─── Internal row component ─── */

function BankDetailRow({
  item,
  onCopy,
}: {
  item: BankDetailItem;
  onCopy?: (item: BankDetailItem) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      onCopy?.(item);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in insecure contexts; silently ignore
    }
  };

  return (
    <div className="group flex items-center justify-between text-sm tracking-[0.035px]">
      <span className="text-semantic-text-muted">{item.label}</span>
      <div className="flex items-center">
        <span className="text-semantic-text-primary text-right">
          {item.value}
        </span>
        {item.copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center justify-center rounded p-0.5 transition-all duration-200 overflow-hidden",
              copied
                ? "w-5 ml-1.5 opacity-100 text-semantic-success-primary"
                : "w-0 opacity-0 group-hover:w-5 group-hover:ml-1.5 group-hover:opacity-100 text-semantic-text-muted hover:text-semantic-text-primary"
            )}
            aria-label={\`Copy \${item.label}\`}
          >
            {copied ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Copy className="size-3.5 shrink-0" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * A single row of bank detail information.
 */
export interface BankDetailItem {
  /** Label text displayed on the left (e.g., "Account Number") */
  label: string;
  /** Value text displayed on the right (e.g., "2223330026552601") */
  value: string;
  /** Whether to show a copy-to-clipboard button for this item's value */
  copyable?: boolean;
}

/**
 * Props for the BankDetails component
 */
export interface BankDetailsProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Data
  /** Array of bank detail items to display */
  items: BankDetailItem[];

  // Accordion
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;
  /** Controlled open state — use with onOpenChange for exclusive accordion behavior */
  open?: boolean;
  /** Callback fired when the panel is toggled — receives new open state */
  onOpenChange?: (open: boolean) => void;

  // Callbacks
  /** Callback fired when a value is copied to clipboard */
  onCopy?: (item: BankDetailItem) => void;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { BankDetails } from "./bank-details";
export type { BankDetailsProps, BankDetailItem } from "./types";
`, prefix),
        }
      ],
    },
    "date-range-modal": {
      name: "date-range-modal",
      description: "A modal for selecting a date range with start and end date pickers",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "dialog",
            "button",
            "input"
      ],
      isMultiFile: true,
      directory: "date-range-modal",
      mainFile: "index.tsx",
      files: [
        {
          name: "index.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { DateInput } from "./date-input";

export interface DateRangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Modal title. Defaults to "Select custom date" */
  title?: string;
  /** Called when the user confirms with both dates selected */
  onConfirm: (start: Date, end: Date) => void;
  /** Called when the user cancels */
  onCancel?: () => void;
  /** Confirm button label. Defaults to "Select custom date range" */
  confirmButtonText?: string;
  /** Cancel button label. Defaults to "Cancel" */
  cancelButtonText?: string;
  /** Disables confirm button and shows loading state */
  loading?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Preselected start date when modal opens (e.g. from URL when reopening custom date) */
  defaultStartDate?: Date;
  /** Preselected end date when modal opens (e.g. from URL when reopening custom date) */
  defaultEndDate?: Date;
}

function DateRangeModal({
  open,
  onOpenChange,
  title = "Select custom date",
  onConfirm,
  onCancel,
  confirmButtonText = "Select custom date range",
  cancelButtonText = "Cancel",
  loading = false,
  minDate,
  maxDate,
  defaultStartDate,
  defaultEndDate,
}: DateRangeModalProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(defaultEndDate);

  const canConfirm = !!startDate && !!endDate;

  function handleConfirm() {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
    }
  }

  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <hr className="border-semantic-border-layout -mx-6" />

        <div className="flex flex-col gap-4 py-2">
          <DateInput
            label="Start date"
            value={startDate}
            onChange={setStartDate}
            placeholder="MM/DD/YYYY"
            minDate={minDate}
            maxDate={maxDate}
          />
          <DateInput
            label="End date"
            value={endDate}
            onChange={setEndDate}
            placeholder="MM/DD/YYYY"
            minDate={startDate ?? minDate}
            maxDate={maxDate}
          />
        </div>

        <hr className="border-semantic-border-layout -mx-6" />

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
          >
            {loading ? "Loading..." : confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
DateRangeModal.displayName = "DateRangeModal";

export { DateRangeModal };
`, prefix),
        },
        {
          name: "calendar.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

const DAYS_OF_WEEK = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface CalendarProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date): boolean {
  const aD = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aD < bD;
}

function isAfterDay(a: Date, b: Date): boolean {
  const aD = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aD > bD;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function Calendar({ value, onChange, minDate, maxDate }: CalendarProps) {
  const today = new Date();
  const initial = value ?? today;

  const [viewYear, setViewYear] = React.useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initial.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  // Previous month fill days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const cells: { day: number; currentMonth: boolean; date: Date }[] = [];

  // Fill leading days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, currentMonth: false, date: new Date(prevYear, prevMonth, d) });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, date: new Date(viewYear, viewMonth, d) });
  }

  // Fill trailing days from next month
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    for (let d = 1; d <= 7 - remainder; d++) {
      cells.push({ day: d, currentMonth: false, date: new Date(nextYear, nextMonth, d) });
    }
  }

  return (
    <div className="select-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="text-sm font-semibold text-semantic-text-primary">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-semantic-text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map(({ day, currentMonth, date }, idx) => {
          const isToday = currentMonth && isSameDay(date, today);
          const isSelected = value ? isSameDay(date, value) : false;
          const isDisabled =
            (minDate && isBeforeDay(date, minDate)) ||
            (maxDate && isAfterDay(date, maxDate));

          return (
            <button
              key={idx}
              type="button"
              disabled={!!isDisabled}
              onClick={() => {
                if (!isDisabled) onChange(date);
              }}
              className={cn(
                "relative flex items-center justify-center size-8 mx-auto rounded-full text-xs transition-colors",
                isSelected
                  ? "bg-semantic-primary text-semantic-text-inverted font-semibold"
                  : currentMonth
                  ? "text-semantic-text-primary hover:bg-semantic-bg-hover"
                  : "text-semantic-text-muted hover:bg-semantic-bg-hover",
                isDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-semantic-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
`, prefix),
        },
        {
          name: "date-input.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Calendar } from "./calendar";

export interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return \`\${mm}/\${dd}/\${yyyy}\`;
}

function DateInput({
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  minDate,
  maxDate,
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="text-sm font-medium text-semantic-text-primary">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 py-2 rounded-md border text-sm transition-colors outline-none",
          "border-semantic-border-input bg-semantic-bg-primary text-semantic-text-primary",
          "hover:border-semantic-border-input-focus/50",
          open && "border-semantic-border-input-focus/50 shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
          !value && "text-semantic-text-muted"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon className="size-4 text-semantic-text-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary shadow-lg p-3">
          <Calendar
            value={value}
            onChange={(date) => {
              onChange(date);
              setOpen(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
}
DateInput.displayName = "DateInput";

export { DateInput };
`, prefix),
        }
      ],
    },
    "payment-summary": {
      name: "payment-summary",
      description: "A component for displaying payment summary with line items and total",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "tooltip"
      ],
      isMultiFile: true,
      directory: "payment-summary",
      mainFile: "payment-summary.tsx",
      files: [
        {
          name: "payment-summary.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Info, Wallet } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "../tooltip";

/**
 * Represents a single row in the payment summary.
 */
export interface PaymentSummaryItem {
  /** Label text displayed on the left */
  label: string;
  /** Value text displayed on the right */
  value: string;
  /** Color variant for the value text */
  valueColor?: "default" | "success" | "error";
  /** Tooltip text shown when hovering the info icon next to the label */
  tooltip?: string;
  /** Whether to render label in bold (semibold weight) */
  bold?: boolean;
  /** Font size for the value — "lg" renders at 18px semibold */
  valueSize?: "default" | "lg";
  /** Small 12px link-colored hint text shown below the label (e.g. remaining prepaid amount) */
  hint?: string;
}

/** Right-side wallet info displayed in the card header */
export interface PaymentSummaryHeaderInfo {
  /** Label text e.g. "Prepaid Wallet Amount:" */
  label: string;
  /** Value text e.g. "₹6,771.48" */
  value: string;
  /** Color variant for the value — defaults to "success" */
  valueColor?: "default" | "success" | "error";
}

/** A single row inside the breakdown card */
export interface BreakdownCardItem {
  label: string;
  value: string;
  /** Color variant for the label */
  labelColor?: "default" | "success" | "muted";
  /** Color variant for the value */
  valueColor?: "default" | "success" | "muted";
}

/** The light-blue bordered breakdown card shown below the subtotal */
export interface PaymentSummaryBreakdownCard {
  /** Top items separated by an inner border (e.g. Gross Charges, Prepaid Deduction) */
  topItems: BreakdownCardItem[];
  /** Bottom items (e.g. Amount Due Without GST, Applicable GST) */
  bottomItems?: BreakdownCardItem[];
}

export interface PaymentSummaryProps {
  /** Line items displayed in the top section */
  items?: PaymentSummaryItem[];
  /** Summary items displayed below the main sections (e.g. totals) */
  summaryItems?: PaymentSummaryItem[];
  /** Custom className for the outer container */
  className?: string;
  /** Card header title e.g. "Detailed Bill Breakdown" */
  title?: string;
  /** Right-side header wallet info badge */
  headerInfo?: PaymentSummaryHeaderInfo;
  /** Bold subtotal row shown after line items */
  subtotal?: { label: string; value: string };
  /** Light-blue bordered breakdown card shown below the subtotal */
  breakdownCard?: PaymentSummaryBreakdownCard;
  /** Credit limit row shown at the bottom, separated by a top border */
  creditLimit?: { value: string; tooltip?: string };
}

const valueColorMap: Record<string, string> = {
  default: "text-semantic-text-primary",
  success: "text-semantic-success-primary",
  error: "text-semantic-error-primary",
};

const breakdownColorMap: Record<string, string> = {
  default: "text-semantic-text-primary",
  success: "text-semantic-success-primary",
  muted: "text-semantic-text-muted",
};

const SummaryRow = ({ item }: { item: PaymentSummaryItem }) => (
  <div className={cn("flex justify-between w-full", item.hint ? "items-start" : "items-center")}>
    <div className={cn("flex gap-1.5", item.hint ? "items-start" : "items-center")}>
      {item.hint ? (
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "tracking-[0.035px]",
              item.bold
                ? "text-base font-semibold text-semantic-text-primary"
                : "text-sm text-semantic-text-muted"
            )}
          >
            {item.label}
          </span>
          <span className="text-sm text-semantic-text-link tracking-[0.06px]">
            {item.hint}
          </span>
        </div>
      ) : (
        <span
          className={cn(
            "tracking-[0.035px]",
            item.bold
              ? "text-base font-semibold text-semantic-text-primary"
              : "text-sm text-semantic-text-muted"
          )}
        >
          {item.label}
        </span>
      )}
      {item.tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full w-5 h-5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
              aria-label={\`Info about \${item.label}\`}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            {item.tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <span
      className={cn(
        "tracking-[0.035px]",
        item.valueSize === "lg" ? "text-lg font-semibold" : "text-sm",
        valueColorMap[item.valueColor ?? "default"]
      )}
    >
      {item.value}
    </span>
  </div>
);

const BreakdownCardRow = ({ item }: { item: BreakdownCardItem }) => (
  <div className="flex items-center justify-between w-full">
    <span
      className={cn(
        "text-sm tracking-[0.035px]",
        breakdownColorMap[item.labelColor ?? "default"]
      )}
    >
      {item.label}
    </span>
    <span
      className={cn(
        "text-sm tracking-[0.035px]",
        breakdownColorMap[item.valueColor ?? "default"]
      )}
    >
      {item.value}
    </span>
  </div>
);

/**
 * PaymentSummary displays a card with line-item rows, an optional breakdown card,
 * and a summary/totals section. Supports a rich header with wallet balance info,
 * a subtotal row, and a nested breakdown card for GST/prepaid deduction details.
 *
 * @example
 * \`\`\`tsx
 * <PaymentSummary
 *   title="Detailed Bill Breakdown"
 *   headerInfo={{ label: "Prepaid Wallet Amount:", value: "₹2,178.75" }}
 *   items={[
 *     { label: "Business Account Number (BAN)", value: "6LMVPG" },
 *     { label: "Pending Rental", value: "₹0.00" },
 *     { label: "Current Usage", value: "₹2,500.00" },
 *   ]}
 *   subtotal={{ label: "Total Charges", value: "₹2,500.00" }}
 *   breakdownCard={{
 *     topItems: [
 *       { label: "Gross Charges", value: "₹2,500.00" },
 *       { label: "(-) Prepaid Deduction", value: "₹2,178.75", labelColor: "success", valueColor: "success" },
 *     ],
 *     bottomItems: [
 *       { label: "Amount Due Without GST", value: "₹321.25" },
 *       { label: "(+) Applicable GST 18%", value: "₹57.83", labelColor: "muted", valueColor: "muted" },
 *     ],
 *   }}
 *   summaryItems={[
 *     { label: "Total amount due", value: "₹379.08", bold: true, valueSize: "lg", valueColor: "error" },
 *   ]}
 * />
 * \`\`\`
 */
export const PaymentSummary = React.forwardRef<HTMLDivElement, PaymentSummaryProps>(
  ({ items = [], summaryItems, className, title, headerInfo, subtotal, breakdownCard, creditLimit }, ref) => {
    const hasItemsBorder =
      items.length > 0 &&
      (!!subtotal || !!breakdownCard || (summaryItems && summaryItems.length > 0));

    return (
      <TooltipProvider delayDuration={100}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-5",
            className
          )}
        >
          <div className="flex flex-col gap-4">
            {/* Header: title + wallet info badge */}
            {(title || headerInfo) && (
              <div className="flex items-center justify-between border-b border-semantic-border-layout pb-4">
                {title && (
                  <span className="text-base font-semibold text-semantic-text-primary">
                    {title}
                  </span>
                )}
                {headerInfo && (
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-[18px] w-[18px] text-semantic-text-secondary" />
                    <span className="text-base text-semantic-text-secondary">
                      {headerInfo.label}
                    </span>
                    <span
                      className={cn(
                        "text-base font-semibold",
                        valueColorMap[headerInfo.valueColor ?? "success"]
                      )}
                    >
                      {headerInfo.value}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Line items */}
            {items.length > 0 && (
              <div
                className={cn(
                  "flex flex-col gap-5",
                  hasItemsBorder && "border-b border-semantic-border-layout pb-4"
                )}
              >
                {items.map((item, index) => (
                  <SummaryRow key={index} item={item} />
                ))}
              </div>
            )}

            {/* Subtotal row */}
            {subtotal && (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.035px]">
                  {subtotal.label}
                </span>
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.035px]">
                  {subtotal.value}
                </span>
              </div>
            )}

            {/* Breakdown card */}
            {breakdownCard && (
              <div className="rounded-lg border border-semantic-border-layout bg-semantic-info-surface px-4 py-4 flex flex-col gap-2.5">
                <div
                  className={cn(
                    "flex flex-col gap-2.5",
                    breakdownCard.bottomItems &&
                      breakdownCard.bottomItems.length > 0 &&
                      "border-b border-semantic-border-layout pb-2.5"
                  )}
                >
                  {breakdownCard.topItems.map((item, index) => (
                    <BreakdownCardRow key={index} item={item} />
                  ))}
                </div>
                {breakdownCard.bottomItems && breakdownCard.bottomItems.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {breakdownCard.bottomItems.map((item, index) => (
                      <BreakdownCardRow key={index} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary items (footer totals) */}
            {summaryItems && summaryItems.length > 0 && (
              <div className="flex flex-col gap-4">
                {summaryItems.map((item, index) => (
                  <SummaryRow key={index} item={item} />
                ))}
              </div>
            )}

            {/* Credit limit row */}
            {creditLimit && (
              <div className="flex items-center justify-between border-t border-semantic-border-layout pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                    Credit limit
                  </span>
                  {creditLimit.tooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full w-5 h-5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
                          aria-label="Info about Credit limit"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <TooltipArrow />
                        {creditLimit.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                  {creditLimit.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

PaymentSummary.displayName = "PaymentSummary";
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PaymentSummary } from "./payment-summary";
export type {
  PaymentSummaryProps,
  PaymentSummaryItem,
  PaymentSummaryHeaderInfo,
  BreakdownCardItem,
  PaymentSummaryBreakdownCard,
} from "./payment-summary";
`, prefix),
        }
      ],
    },
    "payment-option-card": {
      name: "payment-option-card",
      description: "A selectable payment method list with icons, titles, and descriptions. Includes a modal variant for overlay usage.",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "dialog"
      ],
      isMultiFile: true,
      directory: "payment-option-card",
      mainFile: "payment-option-card.tsx",
      files: [
        {
          name: "payment-option-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { X } from "lucide-react";
import type { PaymentOptionCardProps } from "./types";

/**
 * PaymentOptionCard displays a selectable list of payment methods with icons,
 * titles, and descriptions. One option can be highlighted as selected.
 *
 * @example
 * \`\`\`tsx
 * <PaymentOptionCard
 *   options={[
 *     { id: "net-banking", icon: <Globe className="size-5" />, title: "Net banking", description: "Pay securely through your bank" },
 *     { id: "upi", icon: <Smartphone className="size-5" />, title: "UPI", description: "Pay using UPI ID or QR" },
 *   ]}
 *   onOptionSelect={(id) => console.log(id)}
 *   onCtaClick={() => console.log("proceed")}
 * />
 * \`\`\`
 */
export const PaymentOptionCard = React.forwardRef<
  HTMLDivElement,
  PaymentOptionCardProps
>(
  (
    {
      title = "Select payment method",
      subtitle = "Preferred method with secure transactions",
      options,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionSelect,
      ctaText = "Proceed to pay",
      onCtaClick,
      onClose,
      loading = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = React.useState<
      string | undefined
    >(defaultSelectedOptionId);

    const isControlled = selectedOptionId !== undefined;
    const activeId = isControlled ? selectedOptionId : internalSelected;

    const handleSelect = (optionId: string) => {
      if (!isControlled) {
        setInternalSelected(optionId);
      }
      onOptionSelect?.(optionId);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg bg-background border-b border-[#e4e4e4] p-6",
          className
        )}
      >
        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        )}

        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-semantic-text-primary m-0">
              {title}
            </h3>
            <p className="text-sm text-semantic-text-muted tracking-[0.035px] m-0">
              {subtitle}
            </p>
          </div>

          {/* Options list */}
          <div className="flex flex-col gap-2.5">
            {options.map((option) => {
              const isSelected = activeId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full rounded-lg border p-3 text-left transition-colors cursor-pointer bg-transparent",
                    isSelected
                      ? "border-[var(--semantic-brand)]"
                      : "border-semantic-border-layout hover:border-[var(--semantic-brand-selected-hover)]"
                  )}
                >
                  <div className="flex items-center justify-center size-[34px] rounded-lg bg-[var(--color-info-25)] shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                      {option.title}
                    </span>
                    <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA button */}
          <Button
            variant="default"
            className="w-full"
            onClick={onCtaClick}
            loading={loading}
            disabled={disabled}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    );
  }
);

PaymentOptionCard.displayName = "PaymentOptionCard";
`, prefix),
        },
        {
          name: "payment-option-card-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../dialog";
import { PaymentOptionCard } from "./payment-option-card";
import type { PaymentOptionCardProps } from "./types";

export interface PaymentOptionCardModalProps
  extends Omit<PaymentOptionCardProps, "onClose"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * PaymentOptionCardModal wraps the PaymentOptionCard in a centered Dialog overlay.
 * Use this when you want to show payment method selection as a modal popup rather
 * than an inline card.
 *
 * @example
 * \`\`\`tsx
 * const [open, setOpen] = useState(false);
 *
 * <PaymentOptionCardModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   options={paymentOptions}
 *   onOptionSelect={(id) => console.log(id)}
 *   onCtaClick={() => { handlePayment(); setOpen(false); }}
 * />
 * \`\`\`
 */
export const PaymentOptionCardModal = React.forwardRef<
  HTMLDivElement,
  PaymentOptionCardModalProps
>(
  (
    {
      open,
      onOpenChange,
      title,
      subtitle,
      options,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionSelect,
      ctaText,
      onCtaClick,
      loading,
      disabled,
      className,
    },
    ref
  ) => {
    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="sm"
          hideCloseButton
          className="p-0 border-0 bg-transparent shadow-none"
        >
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            {title || "Select payment method"}
          </DialogTitle>
          <PaymentOptionCard
            title={title}
            subtitle={subtitle}
            options={options}
            selectedOptionId={selectedOptionId}
            defaultSelectedOptionId={defaultSelectedOptionId}
            onOptionSelect={onOptionSelect}
            ctaText={ctaText}
            onCtaClick={onCtaClick}
            onClose={handleClose}
            loading={loading}
            disabled={disabled}
            className={className}
          />
        </DialogContent>
      </Dialog>
    );
  }
);

PaymentOptionCardModal.displayName = "PaymentOptionCardModal";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * A single payment option entry.
 */
export interface PaymentOption {
  /** Unique identifier for this option */
  id: string;
  /** Icon rendered inside a rounded container (e.g. an SVG or Lucide icon) */
  icon: React.ReactNode;
  /** Primary label (e.g. "Net banking") */
  title: string;
  /** Secondary description (e.g. "Pay securely through your bank") */
  description: string;
}

/**
 * Props for the PaymentOptionCard component.
 */
export interface PaymentOptionCardProps {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** List of selectable payment options */
  options: PaymentOption[];
  /** Currently selected option id */
  selectedOptionId?: string;
  /** Default selected option id (uncontrolled mode) */
  defaultSelectedOptionId?: string;
  /** Callback fired when an option is selected */
  onOptionSelect?: (optionId: string) => void;
  /** CTA button text */
  ctaText?: string;
  /** Callback fired when CTA button is clicked */
  onCtaClick?: () => void;
  /** Callback fired when close button is clicked */
  onClose?: () => void;
  /** Whether the CTA button shows loading state */
  loading?: boolean;
  /** Whether the CTA button is disabled */
  disabled?: boolean;
  /** Additional className for the root element */
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PaymentOptionCard } from "./payment-option-card";
export { PaymentOptionCardModal } from "./payment-option-card-modal";
export type { PaymentOptionCardProps, PaymentOption } from "./types";
export type { PaymentOptionCardModalProps } from "./payment-option-card-modal";
`, prefix),
        }
      ],
    },
    "plan-detail-modal": {
      name: "plan-detail-modal",
      description: "A read-only modal displaying plan feature breakdown with free allowances and per-unit rates",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "@radix-ui/react-dialog"
      ],
      internalDependencies: [
            "dialog"
      ],
      isMultiFile: true,
      directory: "plan-detail-modal",
      mainFile: "plan-detail-modal.tsx",
      files: [
        {
          name: "plan-detail-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import type { PlanDetailModalProps, PlanFeature } from "./types";

const DEFAULT_FEATURES: PlanFeature[] = [
  { name: "WhatsApp Service", free: "0 Message(s)", rate: "₹ 0" },
  { name: "Incoming (Missed)", free: "0 Minute(s)", rate: "₹ 0" },
  { name: "WhatsApp Marketing", free: "0 Message(s)", rate: "₹ 0.86" },
  { name: "Fix did(s)", free: "0 DID(s)", rate: "₹ 200.00" },
  { name: "WhatsApp Utility", free: "0 Message(s)", rate: "₹ 0.13" },
  { name: "User(s)", free: "3 User(s)", rate: "₹ 150.00" },
  { name: "Pro license(s)", free: "3 License(s)", rate: "₹ 300.00" },
  { name: "WhatsApp Authentication", free: "0 Unit(s)", rate: "₹ 0.13" },
  { name: "Department(s)", free: "2 Department(s)", rate: "₹ 300.00" },
  { name: "Channel(s)", free: "1 Pair(s)", rate: "₹ 300.00" },
];

const PlanDetailModal = React.forwardRef<HTMLDivElement, PlanDetailModalProps>(
  (
    {
      open,
      onOpenChange,
      title = "Plan detail",
      features = DEFAULT_FEATURES,
      planPrice,
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="lg"
          hideCloseButton
          className="p-0 gap-0 overflow-hidden"
        >
          <div
            ref={ref}
            className={cn("flex flex-col", className)}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-semantic-border-layout">
              <DialogTitle className="text-lg font-semibold text-semantic-text-primary leading-none m-0">
                {title}
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="flex items-center justify-center size-6 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <DialogDescription asChild>
              <div className="flex flex-col gap-2.5 px-8 py-5 overflow-y-auto max-h-[70vh]">
                <p className="m-0 text-base font-semibold text-semantic-text-primary leading-none">
                  Features
                </p>
                <div className="w-full overflow-x-auto rounded border border-semantic-border-layout">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-semantic-bg-ui">
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[44%]">
                          Feature
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[28%]">
                          Free
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[28%]">
                          Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, index) => (
                        <tr
                          key={feature.name}
                          className={cn(
                            index % 2 === 0
                              ? "bg-semantic-bg-primary"
                              : "bg-semantic-bg-ui"
                          )}
                        >
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.name}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.free}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.rate}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogDescription>

            {/* Footer */}
            {planPrice && (
              <div className="flex items-center px-8 py-4 border-t border-semantic-border-layout">
                <p className="m-0 text-base text-semantic-text-primary">
                  <span className="font-semibold">Plan price </span>
                  <span className="font-normal">{planPrice}</span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanDetailModal.displayName = "PlanDetailModal";

export { PlanDetailModal };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * A single feature row in the plan detail table.
 */
export interface PlanFeature {
  /** Feature name (e.g., "WhatsApp Service") */
  name: string;
  /** Free allowance (e.g., "0 Message(s)") */
  free: string;
  /** Rate per unit (e.g., "₹ 0.86") */
  rate: string;
}

export interface PlanDetailModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal title */
  title?: string;
  /** List of features to display in the table */
  features?: PlanFeature[];
  /** Plan price label (e.g., "₹ 2,500.00/month") */
  planPrice?: string;
  /** Called when close button is clicked */
  onClose?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PlanDetailModal } from "./plan-detail-modal";
export type { PlanDetailModalProps, PlanFeature } from "./types";
`, prefix),
        }
      ],
    },
    "plan-upgrade-modal": {
      name: "plan-upgrade-modal",
      description: "A modal for selecting whether a plan upgrade is applied in the current or upcoming billing cycle",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "@radix-ui/react-dialog"
      ],
      internalDependencies: [
            "button",
            "dialog"
      ],
      isMultiFile: true,
      directory: "plan-upgrade-modal",
      mainFile: "plan-upgrade-modal.tsx",
      files: [
        {
          name: "plan-upgrade-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva } from "class-variance-authority";
import { CalendarDays, Clock3, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import type { BillingCycleOption, PlanUpgradeModalProps } from "./types";

const modalRootVariants = cva(
  "flex flex-col gap-6 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const billingCycleOptionVariants = cva(
  "flex w-full items-center gap-2.5 rounded-lg border bg-semantic-bg-primary p-3 text-left transition-colors",
  {
    variants: {
      selected: {
        true: "border-semantic-border-input-focus",
        false: "border-semantic-border-layout hover:border-semantic-border-input",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

const iconContainerVariants = cva(
  "flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-semantic-info-surface"
);

const defaultOptions: BillingCycleOption[] = [
  { id: "current-billing-cycle", label: "Current billing cycle", icon: "clock" },
  { id: "upcoming-billing-cycle", label: "Upcoming billing cycle", icon: "calendar" },
];

const renderOptionIcon = (icon: BillingCycleOption["icon"]) => {
  if (icon === "calendar") {
    return <CalendarDays className="size-5 text-semantic-text-secondary" aria-hidden="true" />;
  }
  if (icon === "clock" || icon === undefined) {
    return <Clock3 className="size-5 text-semantic-text-secondary" aria-hidden="true" />;
  }
  return icon;
};

const PlanUpgradeModal = React.forwardRef<HTMLDivElement, PlanUpgradeModalProps>(
  (
    {
      open,
      onOpenChange,
      title = "Plan upgrade, SUV ₹ 15,000.00/month",
      description = "Select how you want to apply your new plan.",
      options = defaultOptions,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionChange,
      nextLabel = "Next",
      onNext,
      loading = false,
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    const initialOptionId = defaultSelectedOptionId ?? options[0]?.id;
    const [internalSelectedOptionId, setInternalSelectedOptionId] = React.useState<
      string | undefined
    >(initialOptionId);
    const isControlled = selectedOptionId !== undefined;
    const activeOptionId = isControlled ? selectedOptionId : internalSelectedOptionId;

    React.useEffect(() => {
      if (!isControlled) {
        setInternalSelectedOptionId(initialOptionId);
      }
    }, [initialOptionId, isControlled]);

    const handleOptionSelect = (optionId: string) => {
      if (!isControlled) {
        setInternalSelectedOptionId(optionId);
      }
      onOptionChange?.(optionId);
    };

    const handleNext = () => {
      if (!activeOptionId) {
        return;
      }
      onNext?.(activeOptionId);
    };

    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="default"
          hideCloseButton
          className="w-full max-w-[480px] border-none bg-transparent p-0 shadow-none"
        >
          <div ref={ref} className={cn(modalRootVariants(), className)} {...props}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <DialogTitle className="m-0 text-lg font-semibold leading-normal text-semantic-text-primary">
                  {title}
                </DialogTitle>
                <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary"
                aria-label="Close plan upgrade modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {options.map((option) => {
                const isSelected = activeOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(billingCycleOptionVariants({ selected: isSelected }))}
                    aria-pressed={isSelected}
                  >
                    <span className={iconContainerVariants()}>{renderOptionIcon(option.icon)}</span>
                    <span className="text-sm leading-normal tracking-[0.035px] text-semantic-text-primary">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={handleNext}
                disabled={!activeOptionId}
                loading={loading}
                className="min-w-[95px]"
              >
                {nextLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanUpgradeModal.displayName = "PlanUpgradeModal";

export { PlanUpgradeModal, billingCycleOptionVariants };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export type BillingCycleOptionIcon = "clock" | "calendar" | React.ReactNode;

/**
 * A selectable billing cycle option shown inside PlanUpgradeModal.
 */
export interface BillingCycleOption {
  /** Unique identifier for the option */
  id: string;
  /** Option label text */
  label: string;
  /** Optional icon key or custom icon node */
  icon?: BillingCycleOptionIcon;
}

export interface PlanUpgradeModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title shown at the top of the modal */
  title?: string;
  /** Description shown below the title */
  description?: string;
  /** Options to select from */
  options?: BillingCycleOption[];
  /** Controlled selected option id */
  selectedOptionId?: string;
  /** Uncontrolled selected option id */
  defaultSelectedOptionId?: string;
  /** Called when an option is selected */
  onOptionChange?: (optionId: string) => void;
  /** Next button label */
  nextLabel?: string;
  /** Called when Next is clicked */
  onNext?: (selectedOptionId: string) => void;
  /** Shows loading spinner on the Next button and disables it */
  loading?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PlanUpgradeModal, billingCycleOptionVariants } from "./plan-upgrade-modal";
export type { BillingCycleOption, BillingCycleOptionIcon, PlanUpgradeModalProps } from "./types";
`, prefix),
        }
      ],
    },
    "plan-upgrade-summary-modal": {
      name: "plan-upgrade-summary-modal",
      description: "A billing summary modal for confirming plan upgrades and downgrades",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "@radix-ui/react-dialog"
      ],
      internalDependencies: [
            "button",
            "dialog"
      ],
      isMultiFile: true,
      directory: "plan-upgrade-summary-modal",
      mainFile: "plan-upgrade-summary-modal.tsx",
      files: [
        {
          name: "plan-upgrade-summary-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, CircleCheck, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import type {
  PlanUpgradeSummaryModalProps,
  PlanUpgradeSummaryMode,
  PlanUpgradeSummaryRow,
  PlanUpgradeSummaryStatus,
  PlanUpgradeSummaryTone,
} from "./types";

const modalRootVariants = cva(
  "flex flex-col gap-8 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const summaryPanelVariants = cva(
  "flex flex-col gap-5 rounded border border-semantic-border-layout bg-semantic-bg-ui p-4"
);

const statusTitleVariants = cva("m-0 text-sm font-semibold leading-5 tracking-[0.014px]", {
  variants: {
    tone: {
      warning: "text-semantic-warning-text",
      success: "text-semantic-success-text",
    },
  },
  defaultVariants: {
    tone: "warning",
  },
});

const statusMessageVariants = cva("m-0 text-xs leading-normal", {
  variants: {
    tone: {
      warning: "text-semantic-warning-text",
      success: "text-semantic-success-text",
    },
  },
  defaultVariants: {
    tone: "warning",
  },
});

const defaultRowsByMode: Record<PlanUpgradeSummaryMode, PlanUpgradeSummaryRow[]> = {
  upgrade: [
    { label: "Prepaid amount", value: "(₹ 47,229.20)" },
    { label: "Difference in rental", value: "₹ 150,000.00" },
    { label: "Total", value: "₹ 102,770.80" },
    { label: "Taxes", value: "₹ 18,498.74" },
  ],
  downgrade: [
    { label: "Prepaid amount", value: "(₹ 581.48)" },
    { label: "Difference in rental", value: "₹ -120,000.00" },
    { label: "Total", value: "₹ -120,581.48" },
    { label: "Taxes", value: "₹ 0.00" },
  ],
};

const defaultStatusByMode: Record<PlanUpgradeSummaryMode, PlanUpgradeSummaryStatus> = {
  upgrade: {
    title: "Payable Amount",
    message: "A payment of ₹ 59,437.44 is required to upgrade.",
    tone: "warning",
  },
  downgrade: {
    title: "Adjustable Credit",
    tone: "success",
  },
};

const defaultTitleByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "Plan upgrade, SUV ₹ 15,000.00/month",
  downgrade: "Plan downgrade, SUV ₹ 15,000.00/month",
};

const defaultPrimaryActionLabelByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "Pay & Upgrade Plan",
  downgrade: "Downgrade Plan",
};

const defaultTotalValueByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "₹ 59,437.44",
  downgrade: "₹ -120,581.48",
};

const defaultDescription =
  "Your request will be processed from the current billing cycle.";

const getStatusIcon = (tone: PlanUpgradeSummaryTone) => {
  if (tone === "success") {
    return <CircleCheck className="size-6 text-semantic-success-text" aria-hidden="true" />;
  }

  return <AlertCircle className="size-6 text-semantic-warning-text" aria-hidden="true" />;
};

const PlanUpgradeSummaryModal = React.forwardRef<
  HTMLDivElement,
  PlanUpgradeSummaryModalProps
>(
  (
    {
      open,
      onOpenChange,
      mode = "upgrade",
      title,
      description = defaultDescription,
      status,
      rows,
      totalLabel = "Total amount due",
      totalValue,
      cancelLabel = "Cancel",
      primaryActionLabel,
      onPrimaryAction,
      loading = false,
      disabled = false,
      onCancel,
      onClose,
      closeAriaLabel = "Close plan summary modal",
      className,
      ...props
    },
    ref
  ) => {
    const resolvedStatus = status ?? defaultStatusByMode[mode];
    const resolvedTone = resolvedStatus.tone ?? defaultStatusByMode[mode].tone ?? "warning";
    const resolvedRows = rows ?? defaultRowsByMode[mode];
    const resolvedTitle = title ?? defaultTitleByMode[mode];
    const resolvedTotalValue = totalValue ?? defaultTotalValueByMode[mode];
    const resolvedPrimaryActionLabel =
      primaryActionLabel ?? defaultPrimaryActionLabelByMode[mode];

    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="default"
          hideCloseButton
          className="w-full max-w-[660px] border-none bg-transparent p-0 shadow-none"
        >
          <div ref={ref} className={cn(modalRootVariants(), className)} {...props}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <DialogTitle className="m-0 text-lg font-semibold leading-normal text-semantic-text-primary">
                  {resolvedTitle}
                </DialogTitle>
                <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary"
                aria-label={closeAriaLabel}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className={summaryPanelVariants()}>
              <div className="flex items-start gap-4">
                <span className="shrink-0">{getStatusIcon(resolvedTone)}</span>
                <div className="flex flex-col gap-1">
                  <p className={statusTitleVariants({ tone: resolvedTone })}>
                    {resolvedStatus.title}
                  </p>
                  {resolvedStatus.message ? (
                    <p className={statusMessageVariants({ tone: resolvedTone })}>
                      {resolvedStatus.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {resolvedRows.map((row) => (
                  <div
                    key={\`\${row.label}-\${row.value}\`}
                    className="flex items-center justify-between gap-6"
                  >
                    <span className="text-sm tracking-[0.035px] text-semantic-text-secondary">
                      {row.label}
                    </span>
                    <span className="text-sm tracking-[0.035px] text-semantic-text-primary">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-semantic-border-layout pt-3">
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-secondary">
                  {totalLabel}
                </span>
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-primary">
                  {resolvedTotalValue}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <Button variant="outline" onClick={handleCancel}>
                {cancelLabel}
              </Button>
              <Button variant="primary" onClick={onPrimaryAction} loading={loading} disabled={disabled}>
                {resolvedPrimaryActionLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanUpgradeSummaryModal.displayName = "PlanUpgradeSummaryModal";

export { PlanUpgradeSummaryModal, modalRootVariants, summaryPanelVariants };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export type PlanUpgradeSummaryMode = "upgrade" | "downgrade";

export type PlanUpgradeSummaryTone = "warning" | "success";

export interface PlanUpgradeSummaryRow {
  /** Label shown on the left side of the summary row */
  label: string;
  /** Value shown on the right side of the summary row */
  value: string;
}

export interface PlanUpgradeSummaryStatus {
  /** Highlighted title shown at the top of the summary panel */
  title: string;
  /** Optional supporting message shown below the status title */
  message?: string;
  /** Visual tone used for the status title and icon */
  tone?: PlanUpgradeSummaryTone;
}

export interface PlanUpgradeSummaryModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Preset content mode for upgrade or downgrade flows */
  mode?: PlanUpgradeSummaryMode;
  /** Title shown at the top of the modal */
  title?: string;
  /** Supporting description below the title */
  description?: string;
  /** Status content shown inside the summary panel */
  status?: PlanUpgradeSummaryStatus;
  /** Summary rows shown above the total row */
  rows?: PlanUpgradeSummaryRow[];
  /** Label for the total row */
  totalLabel?: string;
  /** Value for the total row */
  totalValue?: string;
  /** Text for the cancel button */
  cancelLabel?: string;
  /** Text for the primary CTA button */
  primaryActionLabel?: string;
  /** Called when the primary CTA is clicked */
  onPrimaryAction?: () => void;
  /** Shows loading spinner on the primary CTA button */
  loading?: boolean;
  /** Disables the primary CTA button */
  disabled?: boolean;
  /** Called when the cancel button is clicked */
  onCancel?: () => void;
  /** Called when the close icon is clicked */
  onClose?: () => void;
  /** Accessible label for the close button */
  closeAriaLabel?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export {
  PlanUpgradeSummaryModal,
  modalRootVariants,
  summaryPanelVariants,
} from "./plan-upgrade-summary-modal";
export type {
  PlanUpgradeSummaryModalProps,
  PlanUpgradeSummaryMode,
  PlanUpgradeSummaryRow,
  PlanUpgradeSummaryStatus,
  PlanUpgradeSummaryTone,
} from "./types";
`, prefix),
        }
      ],
    },
    "let-us-drive-card": {
      name: "let-us-drive-card",
      description: "A managed service card with pricing, billing badge, 'Show details' link, and CTA for the full-service management section",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "button",
            "badge"
      ],
      isMultiFile: true,
      directory: "let-us-drive-card",
      mainFile: "let-us-drive-card.tsx",
      files: [
        {
          name: "let-us-drive-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Badge } from "../badge";
import type { LetUsDriveCardProps } from "./types";

/**
 * LetUsDriveCard displays a managed service offering with pricing, billing
 * frequency badge, and a CTA. Used in the "Let us drive — Full-service
 * management" section of the pricing page.
 *
 * Supports a "free/discount" state where the original price is shown with
 * strikethrough and a green label (e.g., "FREE") replaces it.
 *
 * @example
 * \`\`\`tsx
 * <LetUsDriveCard
 *   title="Account Manager"
 *   price="15,000"
 *   period="/month"
 *   billingBadge="Annually"
 *   description="One expert who knows your business. And moves it forward."
 *   onShowDetails={() => console.log("details")}
 *   onCtaClick={() => console.log("talk")}
 * />
 * \`\`\`
 */
const LetUsDriveCard = React.forwardRef<HTMLDivElement, LetUsDriveCardProps>(
  (
    {
      title,
      price,
      period,
      startsAt = false,
      billingBadge,
      description,
      freeLabel,
      showDetailsLabel = "Show details",
      ctaLabel = "Talk to us",
      onShowDetails,
      onCtaClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-[14px] border border-semantic-border-layout bg-card p-5",
          className
        )}
        {...props}
      >
        {/* Header: title + optional billing badge */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-semantic-text-primary m-0">
            {title}
          </h3>
          {billingBadge && (
            <Badge
              size="sm"
              className="bg-semantic-info-surface text-semantic-info-primary font-normal"
            >
              {billingBadge}
            </Badge>
          )}
        </div>

        {/* Price section */}
        <div className="flex flex-col gap-2.5">
          {startsAt && (
            <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
              Starts at
            </span>
          )}
          <div className="flex gap-1 items-end">
            {freeLabel ? (
              <span className="text-[28px] font-semibold leading-[36px]">
                <span className="line-through text-semantic-text-muted">
                  ₹{price}
                </span>{" "}
                <span className="text-semantic-success-primary">
                  {freeLabel}
                </span>
              </span>
            ) : (
              <span className="text-[28px] font-semibold leading-[36px] text-semantic-text-primary">
                ₹{price}
              </span>
            )}
            {period && (
              <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
                {period}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0">
            {description}
          </p>
        </div>

        {/* Actions: Show details link + CTA button */}
        <div className="flex flex-col gap-3 w-full">
          {onShowDetails && (
            <Button
              variant="link"
              className="text-semantic-text-link p-0 h-auto min-w-0 justify-start"
              onClick={onShowDetails}
            >
              {showDetailsLabel}
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    );
  }
);

LetUsDriveCard.displayName = "LetUsDriveCard";

export { LetUsDriveCard };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Props for the LetUsDriveCard component.
 */
export interface LetUsDriveCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Service title (e.g., "Dedicated Onboarding", "Account Manager") */
  title: string;
  /** Price amount as formatted string (e.g., "20,000", "15,000") */
  price: string;
  /** Billing period label (e.g., "/one-time fee", "/month") */
  period?: string;
  /** Show "Starts at" prefix above the price */
  startsAt?: boolean;
  /** Billing frequency badge text (e.g., "Annually", "Quarterly") */
  billingBadge?: string;
  /** Service description text */
  description: string;
  /** When provided, price is shown with strikethrough and this label (e.g., "FREE") is displayed in green */
  freeLabel?: string;
  /** Text for the details link (default: "Show details") */
  showDetailsLabel?: string;
  /** CTA button text (default: "Talk to us") */
  ctaLabel?: string;
  /** Callback when "Show details" link is clicked */
  onShowDetails?: () => void;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { LetUsDriveCard } from "./let-us-drive-card";
export type { LetUsDriveCardProps } from "./types";
`, prefix),
        }
      ],
    },
    "power-up-card": {
      name: "power-up-card",
      description: "An add-on service card with icon, title, pricing, description, and CTA button for the power-ups section",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "button"
      ],
      isMultiFile: true,
      directory: "power-up-card",
      mainFile: "power-up-card.tsx",
      files: [
        {
          name: "power-up-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import type { PowerUpCardProps } from "./types";

/**
 * PowerUpCard displays an add-on service with icon, pricing, description,
 * and a CTA button. Used in the "Power-ups and charges" section of
 * the pricing page.
 *
 * @example
 * \`\`\`tsx
 * <PowerUpCard
 *   icon={<PhoneCall className="size-6" />}
 *   title="Auto-Dialer"
 *   price="Starts @ ₹700/user/month"
 *   description="Available for SUV & Enterprise plans as an add-on per user."
 *   onCtaClick={() => console.log("clicked")}
 * />
 * \`\`\`
 */
const PowerUpCard = React.forwardRef<HTMLDivElement, PowerUpCardProps>(
  (
    {
      icon,
      title,
      price,
      description,
      ctaLabel = "Talk to us",
      onCtaClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-between gap-8 rounded-md border border-semantic-border-layout bg-card p-5",
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* Icon + title/price row */}
          <div className="flex gap-4 items-start">
            {icon && (
              <div className="flex items-center justify-center size-[47px] rounded bg-[var(--color-info-25)] shrink-0">
                {icon}
              </div>
            )}
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-base font-semibold text-semantic-text-primary m-0 leading-normal">
                {title}
              </h3>
              <p className="text-sm text-semantic-text-primary tracking-[0.035px] m-0 leading-normal">
                {price}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0 leading-normal">
            {description}
          </p>
        </div>

        {/* CTA */}
        <Button variant="outline" className="w-full" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
    );
  }
);

PowerUpCard.displayName = "PowerUpCard";

export { PowerUpCard };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Props for the PowerUpCard component.
 */
export interface PowerUpCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration displayed in the tinted container */
  icon?: React.ReactNode;
  /** Service title (e.g., "Truecaller business") */
  title: string;
  /** Pricing text (e.g., "Starts @ ₹30,000/month") */
  price: string;
  /** Description explaining the service value */
  description: string;
  /** CTA button label (default: "Talk to us") */
  ctaLabel?: string;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PowerUpCard } from "./power-up-card";
export type { PowerUpCardProps } from "./types";
`, prefix),
        }
      ],
    },
    "pricing-card": {
      name: "pricing-card",
      description: "A pricing tier card with plan name, pricing, feature checklist, CTA button, and optional popularity badge and addon footer",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "badge"
      ],
      isMultiFile: true,
      directory: "pricing-card",
      mainFile: "pricing-card.tsx",
      files: [
        {
          name: "pricing-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Badge } from "../badge";
import { CircleCheck, Info } from "lucide-react";
import type { PricingCardProps } from "./types";

/**
 * PricingCard displays a plan tier with pricing, features, and a CTA button.
 * Supports current-plan state (outlined button), popularity badge, and an
 * optional add-on footer.
 *
 * @example
 * \`\`\`tsx
 * <PricingCard
 *   planName="Compact"
 *   price="2,5000"
 *   planDetails="3 Users | 12 Month plan"
 *   description="For small teams that need a WhatsApp-first plan"
 *   headerBgColor="#d7eae9"
 *   features={["WhatsApp Campaigns", "Missed Call Tracking"]}
 *   onCtaClick={() => console.log("selected")}
 *   onFeatureDetails={() => console.log("details")}
 * />
 * \`\`\`
 */
const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      planName,
      price,
      period = "/Month",
      planDetails,
      planIcon,
      description,
      headerBgColor,
      features = [],
      isCurrentPlan = false,
      showPopularBadge = false,
      badgeText = "MOST POPULAR",
      ctaText,
      onCtaClick,
      onFeatureDetails,
      addon,
      usageDetails,
      infoText,
      className,
      ...props
    },
    ref
  ) => {
    const buttonText =
      ctaText || (isCurrentPlan ? "Current plan" : "Select plan");

    // Strip trailing decimal zeros: "500000000.000" → "500000000", "5,000.50" → "5,000.5"
    const cleanPrice = price.includes(".")
      ? price.replace(/0+$/, "").replace(/\\.$/, "")
      : price;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-t-xl rounded-b-lg border border-semantic-border-layout p-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-4 rounded-t-xl rounded-b-lg p-4"
          style={
            headerBgColor ? { backgroundColor: headerBgColor } : undefined
          }
        >
          {/* Plan name + badge */}
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-semantic-text-primary m-0">
              {planName}
            </h3>
            {showPopularBadge && (
              <Badge
                size="sm"
                className="bg-[#e3fdfe] text-[#119ba8] uppercase tracking-wider font-semibold"
              >
                {badgeText}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-end gap-1">
              <span className="text-4xl leading-[44px] text-semantic-text-primary">
                ₹{cleanPrice}
              </span>
              <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
                {period}
              </span>
            </div>
            {planDetails && (
              <p className="text-sm tracking-[0.035px] text-semantic-text-primary m-0">
                {planDetails}
              </p>
            )}
          </div>

          {/* Plan icon */}
          {planIcon && <div className="size-[30px]">{planIcon}</div>}

          {/* Description */}
          {description && (
            <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0">
              {description}
            </p>
          )}

          {/* Feature details link + CTA */}
          <div className="flex flex-col gap-3.5 w-full">
            {onFeatureDetails && (
              <div className="flex justify-center">
                <Button
                  variant="link"
                  className="text-semantic-text-link p-0 h-auto min-w-0"
                  onClick={onFeatureDetails}
                >
                  Feature details
                </Button>
              </div>
            )}
            <Button
              variant={isCurrentPlan ? "outline" : "default"}
              className="w-full"
              onClick={onCtaClick}
            >
              {buttonText}
            </Button>
          </div>

          {/* Info text */}
          {infoText && (
            <div className="flex items-start gap-1.5">
              <Info className="size-3.5 text-semantic-info-primary shrink-0 mt-0.5" />
              <p className="text-xs text-semantic-info-primary tracking-[0.035px] m-0">
                {infoText}
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px] uppercase m-0">
              Includes
            </p>
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => {
                const text =
                  typeof feature === "string" ? feature : feature.text;
                const isBold =
                  typeof feature !== "string" && feature.bold;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <CircleCheck className="size-[18px] text-semantic-text-secondary shrink-0 mt-0.5" />
                    <span
                      className={cn(
                        "text-sm text-semantic-text-secondary tracking-[0.035px]",
                        isBold && "font-semibold"
                      )}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Addon */}
        {addon && (
          <div className="flex items-center gap-2.5 rounded-md bg-[var(--color-info-25)] border border-[#f3f5f6] pl-4 py-2.5">
            {addon.icon && (
              <div className="size-5 shrink-0">{addon.icon}</div>
            )}
            <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
              {addon.text}
            </span>
          </div>
        )}

        {/* Usage Details */}
        {usageDetails && usageDetails.length > 0 && (
          <div className="flex flex-col gap-2.5 rounded-md bg-[var(--color-info-25)] border border-[#f3f5f6] px-4 py-2.5">
            {usageDetails.map((detail, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-semantic-primary shrink-0 mt-[7px]" />
                <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                  <strong>{detail.label}:</strong> {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
`, prefix),
        },
        {
          name: "plan-icons.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

interface PlanIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

const CompactCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 30 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="25.2" cy="14.72" rx="3.33" ry="3.03" fill="white" />
      <path
        d="M25.12 11.21c-1.95 0-3.5 1.56-3.5 3.5 0 1.95 1.55 3.5 3.5 3.5 1.94 0 3.5-1.55 3.5-3.5 0-1.94-1.56-3.5-3.5-3.5zm0 5.45c-1.09 0-2.02-.93-2.02-2.02s.93-2.02 2.02-2.02 2.02.93 2.02 2.02-.93 2.02-2.02 2.02z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <ellipse cx="4.09" cy="14.72" rx="3.33" ry="3.03" fill="white" />
      <path
        d="M4.26 11.21c-1.95 0-3.5 1.56-3.5 3.5 0 1.95 1.55 3.5 3.5 3.5 1.94 0 3.5-1.55 3.5-3.5 0-1.94-1.56-3.5-3.5-3.5zm0 5.45c-1.09 0-2.02-.93-2.02-2.02s.93-2.02 2.02-2.02 2.02.93 2.02 2.02-.93 2.02-2.02 2.02z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <path
        d="M28.85 12.38c-.08-.16-.31-.31-.39-.47-.16-.39-.16-1.09-.23-1.48-.31-1.17-1.17-2.02-2.02-2.72-1.64-1.25-3.66-2.57-5.45-3.74C18 2.11 15.85.78 12.35.63c-1.79-.08-4.51 0-6.23.23-.15 0-1.4.31-1.24.62 1.25.23.55.93.24 1.63-.31.62-1.09 2.49-1.64 2.8-.15 0-.23.08-.31 0-.23-.31.16-1.4.31-1.71.16-.47.86-1.4.93-1.79 0-.31 0-.7-.39-.62L2.62 4.75c-.62 1.17-.62 2.18-.78 3.42-.15 1.56-1.09 2.88-1.24 4.36 0 .16 0 .39 0 .54.08.31.23.31.47.08.54-1.17 1.71-2.02 3.11-2.02 1.4 0 3.5 1.56 3.5 3.5s-.08 1.86-.23 2.25l.85-.08h11.75c.78-.08 1.4-.47 1.56-1.24 0-1.79 1.56-3.35 3.5-3.35 1.95 0 3.5 1.56 3.5 3.5 0 1.95-.16.93 0 1.09 1.09-.54.86-2.57.23-3.35v-.08z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10.02 1.41c3.81-.23 8.56 1.4 11.44 3.89 2.88 2.49 1.79 1.64.16 1.79-3.58-.31-7.16-.62-10.74-.93-.86 0-2.65 0-3.27-.47-.62-.47-.54-1.87-.23-2.72.54-1.25 1.4-1.48 2.64-1.56z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
);
CompactCarIcon.displayName = "CompactCarIcon";

const SedanCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 31 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="24.98" cy="9.51" rx="2.19" ry="2.56" fill="white" />
      <path
        d="M24.8 7.16c-1.33 0-2.38 1.09-2.38 2.45 0 1.37 1.05 2.46 2.38 2.46 1.33 0 2.38-1.09 2.38-2.46 0-1.36-1.05-2.45-2.38-2.45zm0 3.82c-.74 0-1.38-.66-1.38-1.42 0-.76.64-1.42 1.38-1.42.74 0 1.38.66 1.38 1.42 0 .76-.64 1.42-1.38 1.42z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <ellipse cx="6.33" cy="9.51" rx="2.19" ry="2.56" fill="white" />
      <path
        d="M6.32 7.16c-1.32 0-2.38 1.09-2.38 2.45 0 1.37 1.06 2.46 2.38 2.46 1.33 0 2.39-1.09 2.39-2.46 0-1.36-1.06-2.45-2.39-2.45zm0 3.82c-.74 0-1.38-.66-1.38-1.42 0-.76.64-1.42 1.38-1.42.74 0 1.38.66 1.38 1.42 0 .76-.64 1.42-1.38 1.42z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <path
        d="M29.7 7.79l-.24.81c0 .08-.16.4-.23.49-.24.16-1.97.57-2.05.49.24-1.22-.47-2.6-1.57-3 -2.05-.81-4.09 1.05-3.54 3.24H8.99v-.81c0-.32-.39-1.05-.55-1.3C7.03 5.6 4.27 6.33 3.8 8.6c-.47 2.27 0 .49 0 .49l-2.28-.41C.81 8.27.49 7.14.73 6.33c.23-.81.39-.57.39-.73.08-.49-.16-1.62.16-2.03.31-.4 1.97-.4 2.44-.57 1.42-.4 2.76-1.22 4.17-1.62 2.91-.89 6.61-1.05 9.53 0 2.91 1.05 3.7 1.95 5.51 2.51 1.81.57 4.09.65 5.83 1.62 1.73.97.62 1.05.93 1.78v.57z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M13.48 1.38l.63 2.6 4.8.16c0-.32 0-.64.32-.89-1.58-1.38-3.78-1.78-5.83-1.87h.08z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M8.99 1.87s-.63.97-.63 1.05c0 .16.16.65.24.81l4.41.16-.39-2.51c-.87 0-1.81 0-2.68.16-.87.16-.87.16-.95.24v.09z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6.08 3.81h1.18l1.26-1.78c-.47.32-2.2.81-2.36 1.3-.16.49 0 .32 0 .49h-.08z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
);
SedanCarIcon.displayName = "SedanCarIcon";

const SuvCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 32 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="25.57" cy="11.14" rx="2.65" ry="2.78" fill="white" />
      <ellipse cx="9.12" cy="11.14" rx="2.89" ry="2.78" fill="white" />
      <path
        d="M25.32 8.18c-1.61 0-2.9 1.3-2.9 2.94 0 1.63 1.29 2.93 2.9 2.93 1.62 0 2.9-1.3 2.9-2.93 0-1.64-1.28-2.94-2.9-2.94zm0 4.57c-.9 0-1.68-.78-1.68-1.7 0-.91.78-1.69 1.68-1.69.9 0 1.68.78 1.68 1.7 0 .91-.78 1.69-1.68 1.69z"
        stroke="#2BBAC8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="9.14" cy="11.09" rx="1.4" ry="1.37" fill="white" />
      <path
        d="M8.96 8.18c-1.61 0-2.9 1.3-2.9 2.94 0 1.63 1.29 2.93 2.9 2.93 1.61 0 2.9-1.3 2.9-2.93 0-1.64-1.29-2.94-2.9-2.94zm0 4.57c-.9 0-1.68-.78-1.68-1.7 0-.91.78-1.69 1.68-1.69.9 0 1.68.78 1.68 1.7 0 .91-.78 1.69-1.68 1.69z"
        stroke="#2BBAC8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M30.6 10.78l-.26.99c-.3 1-.36.56-1.09.64.48-3.15-2.66-5.79-5.13-3.7-.43.37-1.18 1.52-1.18 2.1v1.5H12.06c.33-2.62-1.84-5.01-4.24-4.06-1.53.61-2.13 2.39-1.98 4.06-1.61-.14-3.18.68-3.39-1.7-.05-.6.07-1.21-.04-1.8-.65-.34-1.63.37-1.75-.77C.57 7.13.59 4.97.67 4.03c.03-.33.06-.79.43-.87.28-.06 1.83-.08 1.83.26v1.49l.29-.06c.67-1.75.59-3.97 2.76-4.15 3.76-.3 7.87.23 11.67.02 1.75.22 4.02 3.02 5.39 4.18 1.24.15 2.5.24 3.73.44.5.09 1.95.3 2.31.56.7.49.57 2.79.67 2.91.02.03.37.04.56.26.19.23.12.47.28.67v1.03z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14.32 1.53c.25 1.41.16 2.98.61 4.32h6.22l.1-.21c-.48-1.34-1.41-2.72-2.51-3.53-.15-.11-.86-.59-.98-.59h-3.44z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.71 1.53l-.19 4.32h4.33c-.17-1.3-.17-2.78-.38-4.06-.02-.12-.04-.2-.14-.26H9.71z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.58 5.84l.29-4.07-.09-.31c-1.1.07-2.89-.32-3.46.95-.23.51-.74 2.67-.74 3.2 0 .12.01.13.1.21h3.91v-.01z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
);
SuvCarIcon.displayName = "SuvCarIcon";

export { CompactCarIcon, SedanCarIcon, SuvCarIcon };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Add-on info displayed at the bottom of the pricing card.
 */
export interface PricingCardAddon {
  /** Icon rendered in the addon section */
  icon?: React.ReactNode;
  /** Addon description text */
  text: string;
}

/**
 * A single usage detail item (e.g., "Usage: Includes 2,000 AI conversations/month").
 */
export interface UsageDetail {
  /** Bold label (e.g., "Usage") */
  label: string;
  /** Value text (e.g., "Includes 2,000 AI conversations/month") */
  value: string;
}

/**
 * A feature can be a plain string or an object with bold styling.
 */
export type PricingCardFeature = string | { text: string; bold?: boolean };

/**
 * Props for the PricingCard component.
 */
export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name displayed in the header (e.g., "Compact", "Sedan", "SUV") */
  planName: string;
  /** Price amount as formatted string (e.g., "2,5000") */
  price: string;
  /** Billing period label (default: "/Month") */
  period?: string;
  /** Plan detail line (e.g., "3 Users | 12 Month plan") */
  planDetails?: React.ReactNode;
  /** Plan icon or illustration */
  planIcon?: React.ReactNode;
  /** Plan description text */
  description?: string;
  /** Background color for the header section */
  headerBgColor?: string;
  /** List of included features shown with checkmarks. Supports bold items via object form. */
  features?: PricingCardFeature[];
  /** Whether this is the currently active plan (shows outlined button) */
  isCurrentPlan?: boolean;
  /** Show a popularity badge next to the plan name */
  showPopularBadge?: boolean;
  /** Custom badge text (defaults to "MOST POPULAR") */
  badgeText?: string;
  /** Custom CTA button text (overrides default "Select plan" / "Current plan") */
  ctaText?: string;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Callback when "Feature details" link is clicked */
  onFeatureDetails?: () => void;
  /** Add-on info displayed at the bottom of the card */
  addon?: PricingCardAddon;
  /** Usage details displayed in a bulleted list at the bottom (e.g., AIO plan) */
  usageDetails?: UsageDetail[];
  /** Informational text shown below the CTA button (e.g., "Your package change will be effective from 23-03-2026") */
  infoText?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PricingCard } from "./pricing-card";
export { CompactCarIcon, SedanCarIcon, SuvCarIcon } from "./plan-icons";
export type {
  PricingCardProps,
  PricingCardAddon,
  PricingCardFeature,
  UsageDetail,
} from "./types";
`, prefix),
        }
      ],
    },
    "pricing-page": {
      name: "pricing-page",
      description: "A full pricing page layout composing plan-type tabs, billing toggle, pricing cards grid, power-ups section, and let-us-drive managed services section",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "page-header",
            "pricing-toggle",
            "pricing-card",
            "power-up-card",
            "let-us-drive-card"
      ],
      isMultiFile: true,
      directory: "pricing-page",
      mainFile: "pricing-page.tsx",
      files: [
        {
          name: "pricing-page.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../page-header";
import { Button } from "../button";
import { PricingToggle } from "../pricing-toggle/pricing-toggle";
import { PricingCard } from "../pricing-card/pricing-card";
import { PowerUpCard } from "../power-up-card/power-up-card";
import { LetUsDriveCard } from "../let-us-drive-card/let-us-drive-card";
import { ExternalLink } from "lucide-react";
import type { PricingPageProps } from "./types";

/**
 * PricingPage composes all plan-selection sub-components into a full
 * page layout: header, plan-type tabs with billing toggle, pricing
 * cards grid, power-ups section, and let-us-drive section.
 *
 * Supports controlled or uncontrolled tab / billing state.
 *
 * @example
 * \`\`\`tsx
 * <PricingPage
 *   tabs={[
 *     { label: "Team-Led Plans", value: "team" },
 *     { label: "Go-AI First", value: "ai" },
 *   ]}
 *   planCards={compactCard, sedanCard, suvCard}
 *   powerUpCards={[truecaller, tollFree, autoDialer]}
 *   letUsDriveCards={[onboarding, accountMgr, managed]}
 * />
 * \`\`\`
 */
const PricingPage = React.forwardRef<HTMLDivElement, PricingPageProps>(
  (
    {
      title = "Select business plan",
      headerActions,
      tabs = [],
      activeTab: controlledTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod: controlledBilling,
      onBillingPeriodChange,
      planCards = [],
      powerUpCards = [],
      powerUpsTitle = "Power-ups and charges",
      featureComparisonText = "See full feature comparison",
      onFeatureComparisonClick,
      letUsDriveCards = [],
      letUsDriveTitle = "Let us drive — Full-service management",
      className,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled mode
    const [internalTab, setInternalTab] = React.useState(
      tabs[0]?.value ?? ""
    );
    const [internalBilling, setInternalBilling] = React.useState<
      "monthly" | "yearly"
    >("monthly");

    const currentTab = controlledTab ?? internalTab;
    const currentBilling = controlledBilling ?? internalBilling;

    const handleTabChange = (value: string) => {
      if (!controlledTab) setInternalTab(value);
      onTabChange?.(value);
    };

    const handleBillingChange = (period: "monthly" | "yearly") => {
      if (!controlledBilling) setInternalBilling(period);
      onBillingPeriodChange?.(period);
    };

    const hasPowerUps = powerUpCards.length > 0;
    const hasLetUsDrive = letUsDriveCards.length > 0;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col bg-card", className)}
        {...props}
      >
        {/* ───── Header ───── */}
        <PageHeader
          title={title}
          actions={headerActions}
          layout="horizontal"
        />

        {/* ───── Plan Selection Area ───── */}
        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Tabs + billing toggle */}
          {tabs.length > 0 && (
            <PricingToggle
              tabs={tabs}
              activeTab={currentTab}
              onTabChange={handleTabChange}
              showBillingToggle={showBillingToggle}
              billingPeriod={currentBilling}
              onBillingPeriodChange={handleBillingChange}
            />
          )}

          {/* Plan cards grid */}
          {planCards.length > 0 && (
            <div
              className={cn(
                "grid gap-6 justify-center",
                planCards.length <= 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-[960px] mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {planCards.map((cardProps, index) => (
                <PricingCard key={index} {...cardProps} />
              ))}
            </div>
          )}
        </div>

        {/* ───── Power-ups Section ───── */}
        {hasPowerUps && (
          <div className="bg-semantic-bg-ui px-6 py-[60px]">
            <div className="flex flex-col gap-4">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
                  {powerUpsTitle}
                </h2>
                {onFeatureComparisonClick && (
                  <Button
                    variant="link"
                    className="text-semantic-text-link p-0 h-auto min-w-0 gap-1"
                    onClick={onFeatureComparisonClick}
                  >
                    {featureComparisonText}
                    <ExternalLink className="size-3.5" />
                  </Button>
                )}
              </div>

              {/* Power-up cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {powerUpCards.map((cardProps, index) => (
                  <PowerUpCard key={index} {...cardProps} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───── Let Us Drive Section ───── */}
        {hasLetUsDrive && (
          <div className="bg-card px-6 py-[60px]">
            <div className="flex flex-col gap-4">
              {/* Section header */}
              <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
                {letUsDriveTitle}
              </h2>

              {/* Service cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {letUsDriveCards.map((cardProps, index) => (
                  <LetUsDriveCard key={index} {...cardProps} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PricingPage.displayName = "PricingPage";

export { PricingPage };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";
import type { PricingCardProps } from "../pricing-card/types";
import type { PowerUpCardProps } from "../power-up-card/types";
import type { LetUsDriveCardProps } from "../let-us-drive-card/types";
import type { PricingToggleTab } from "../pricing-toggle/types";

export type { PricingToggleTab };

/**
 * Props for the PricingPage component.
 *
 * PricingPage is a layout compositor that orchestrates PricingToggle,
 * PricingCard, PowerUpCard, LetUsDriveCard, and PageHeader into
 * the full plan selection page.
 */
export interface PricingPageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /* ───── Header ───── */

  /** Page title (default: "Select business plan") */
  title?: string;
  /** Actions rendered on the right side of the header (e.g., number-type dropdown) */
  headerActions?: React.ReactNode;

  /* ───── Tabs & Billing ───── */

  /** Plan type tabs shown in the pill selector */
  tabs?: PricingToggleTab[];
  /** Currently active tab value (controlled). Falls back to first tab when unset. */
  activeTab?: string;
  /** Callback when the active tab changes */
  onTabChange?: (value: string) => void;
  /** Whether to show the monthly/yearly billing toggle */
  showBillingToggle?: boolean;
  /** Current billing period (controlled) */
  billingPeriod?: "monthly" | "yearly";
  /** Callback when the billing period changes */
  onBillingPeriodChange?: (period: "monthly" | "yearly") => void;

  /* ───── Plan Cards ───── */

  /** Array of plan card props to render in the main pricing grid */
  planCards?: PricingCardProps[];

  /* ───── Power-ups Section ───── */

  /** Array of power-up card props */
  powerUpCards?: PowerUpCardProps[];
  /** Power-ups section heading (default: "Power-ups and charges") */
  powerUpsTitle?: string;
  /** Feature comparison link text (default: "See full feature comparison") */
  featureComparisonText?: string;
  /** Callback when the feature comparison link is clicked */
  onFeatureComparisonClick?: () => void;

  /* ───── Let Us Drive Section ───── */

  /** Array of let-us-drive card props */
  letUsDriveCards?: LetUsDriveCardProps[];
  /** Let-us-drive section heading (default: "Let us drive — Full-service management") */
  letUsDriveTitle?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PricingPage } from "./pricing-page";
export type { PricingPageProps, PricingToggleTab } from "./types";
`, prefix),
        }
      ],
    },
    "pricing-toggle": {
      name: "pricing-toggle",
      description: "A plan type tab selector with billing period toggle for pricing pages. Pill-shaped tabs switch plan categories, and an optional switch toggles between monthly/yearly billing.",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "@radix-ui/react-switch@^1.2.6"
      ],
      internalDependencies: [
            "switch"
      ],
      isMultiFile: true,
      directory: "pricing-toggle",
      mainFile: "pricing-toggle.tsx",
      files: [
        {
          name: "pricing-toggle.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Switch } from "../switch";
import type { PricingToggleProps } from "./types";

/**
 * PricingToggle provides a plan type tab selector with an optional
 * billing period toggle. The pill-shaped tabs switch between plan
 * categories (e.g. "Team-Led Plans" vs "Go-AI First"), and the
 * billing toggle switches between monthly/yearly pricing.
 *
 * @example
 * \`\`\`tsx
 * <PricingToggle
 *   tabs={[
 *     { label: "Team-Led Plans", value: "team" },
 *     { label: "Go-AI First", value: "ai" },
 *   ]}
 *   activeTab="team"
 *   onTabChange={(value) => setActiveTab(value)}
 *   showBillingToggle
 *   billingPeriod="monthly"
 *   onBillingPeriodChange={(period) => setBillingPeriod(period)}
 * />
 * \`\`\`
 */
const PricingToggle = React.forwardRef<HTMLDivElement, PricingToggleProps>(
  (
    {
      tabs,
      activeTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod = "monthly",
      onBillingPeriodChange,
      monthlyLabel = "Monthly",
      yearlyLabel = "Yearly (Save 20%)",
      className,
      ...props
    },
    ref
  ) => {
    const isYearly = billingPeriod === "yearly";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        {/* Plan type tabs */}
        <div className="inline-flex items-start gap-1 rounded-full bg-semantic-bg-ui p-1">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "h-10 shrink-0 rounded-full px-4 py-1 text-base transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-brand focus-visible:ring-offset-2",
                  isActive
                    ? "bg-semantic-brand font-semibold text-white shadow-sm"
                    : "font-normal text-semantic-text-primary"
                )}
                onClick={() => onTabChange(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Billing period toggle */}
        {showBillingToggle && (
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-sm font-semibold tracking-[0.014px]",
                !isYearly
                  ? "text-semantic-text-secondary"
                  : "text-semantic-text-muted"
              )}
            >
              {monthlyLabel}
            </span>
            <Switch
              size="sm"
              checked={isYearly}
              onCheckedChange={(checked) =>
                onBillingPeriodChange?.(checked ? "yearly" : "monthly")
              }
            />
            <span
              className={cn(
                "text-sm font-semibold tracking-[0.014px]",
                isYearly
                  ? "text-semantic-text-secondary"
                  : "text-semantic-text-muted"
              )}
            >
              {yearlyLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PricingToggle.displayName = "PricingToggle";

export { PricingToggle };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`/** A single tab option in the plan tab selector */
export interface PricingToggleTab {
  /** Display label for the tab */
  label: string;
  /** Unique value identifier for the tab */
  value: string;
}

export interface PricingToggleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of tab options for the plan type selector */
  tabs: PricingToggleTab[];
  /** Currently active tab value (controlled) */
  activeTab: string;
  /** Callback when the active tab changes */
  onTabChange: (value: string) => void;
  /** Whether to show the billing period toggle below the tabs */
  showBillingToggle?: boolean;
  /** Current billing period — "monthly" or "yearly" (controlled) */
  billingPeriod?: "monthly" | "yearly";
  /** Callback when the billing period changes */
  onBillingPeriodChange?: (period: "monthly" | "yearly") => void;
  /** Left label for the billing toggle (default: "Monthly") */
  monthlyLabel?: string;
  /** Right label for the billing toggle (default: "Yearly (Save 20%)") */
  yearlyLabel?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { PricingToggle } from "./pricing-toggle";
export type { PricingToggleProps, PricingToggleTab } from "./types";
`, prefix),
        }
      ],
    },
    "talk-to-us-modal": {
      name: "talk-to-us-modal",
      description: "A modal dialog with icon, heading, description, and two action buttons prompting users to contact support. Triggered by PowerUpCard's Talk to us button.",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "@radix-ui/react-dialog"
      ],
      internalDependencies: [
            "button",
            "dialog"
      ],
      isMultiFile: true,
      directory: "talk-to-us-modal",
      mainFile: "talk-to-us-modal.tsx",
      files: [
        {
          name: "talk-to-us-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { MyOperatorChatIcon } from "./icon";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../dialog";
import type { TalkToUsModalProps } from "./types";

/**
 * TalkToUsModal is a dialog that prompts users to contact support.
 * Features a centered icon, heading, description, and two action buttons
 * (cancel + primary CTA).
 *
 * Used on the pricing page when a power-up or plan requires sales contact.
 * Typically triggered by the PowerUpCard's "Talk to us" button.
 *
 * @example
 * \`\`\`tsx
 * const [open, setOpen] = useState(false);
 *
 * <PowerUpCard onCtaClick={() => setOpen(true)} ... />
 * <TalkToUsModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   onPrimaryAction={() => window.open("mailto:support@myoperator.com")}
 * />
 * \`\`\`
 */
const TalkToUsModal: React.FC<TalkToUsModalProps> = ({
  open,
  onOpenChange,
  title = "Let's Talk!",
  description = "Please contact our team for more details. We're here to help you choose the right plan.",
  icon,
  primaryActionLabel = "Contact support",
  secondaryActionLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  className,
}) => {
  const handleSecondaryAction = () => {
    onSecondaryAction?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        hideCloseButton
        className={cn("!p-0 !gap-0", className)}
      >
        <div className="flex flex-col items-center gap-6 px-[60px] py-10 text-center">
          {/* Icon + Text section */}
          <div className="flex flex-col items-center gap-[18px]">
            {icon ?? <MyOperatorChatIcon />}
            <div className="flex flex-col gap-1">
              <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary">
                {title}
              </DialogTitle>
              <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSecondaryAction}>
              {secondaryActionLabel}
            </Button>
            <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TalkToUsModal.displayName = "TalkToUsModal";

export { TalkToUsModal };
`, prefix),
        },
        {
          name: "icon.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

interface BrandIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

/**
 * MyOperator branded chat icon — teal speech-bubble with white phone
 * on a light gray circle. Extracted from the Figma design system.
 *
 * Used in TalkToUsModal and available for any component that needs
 * the MyOperator contact/chat branding.
 */
const MyOperatorChatIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      width="61"
      height="61"
      viewBox="0 0 61 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="30.6" cy="30.6" r="30.6" fill="#F3F5F6" />
      <g transform="translate(14.1, 13.6)">
        <path
          d="M32.9562 21.4404C31.5008 27.6441 26.7424 32.5167 20.7061 33.9765L28.3074 33.932C28.4772 33.9415 28.6454 33.94 28.8121 33.9288H28.8168C30.9282 33.7825 32.6846 32.0523 32.8821 29.8466V29.8355C32.9038 29.5906 32.9084 29.3393 32.8883 29.0833L32.9562 21.4404Z"
          fill="#DBDBDB"
        />
        <path
          d="M0.0664 29.1656C0.0571 29.3405 0.0587 29.5138 0.0695 29.6856V29.6904C0.2114 31.8659 1.8907 33.6756 4.0314 33.8791H4.0422C4.28 33.9014 4.5238 33.9062 4.7723 33.8855L16.2646 33.9936C16.3433 33.9936 16.4205 34 16.4992 34C16.5363 34 16.5718 33.9968 16.6088 33.9968L16.9129 34L16.9098 33.9889C25.8323 33.7646 33 26.2458 33 16.9984C33 7.751 25.6116 0 16.4992 0C7.3868 0 0 7.611 0 17L0.0664 29.1656Z"
          fill="#2BBBC9"
        />
        <path
          d="M23.7962 20.8195C23.398 20.6143 21.444 19.6236 21.0797 19.4868C20.7155 19.3501 20.45 19.2817 20.1846 19.692C19.9191 20.1023 19.1582 21.0246 18.9251 21.2982C18.6936 21.5717 18.4605 21.6051 18.0639 21.4015C17.6672 21.1964 16.3862 20.7638 14.8674 19.3676C13.6852 18.2814 12.8872 16.9408 12.6557 16.5305C12.4242 16.1202 12.631 15.8992 12.8301 15.694C13.0092 15.5096 13.2283 15.2154 13.4274 14.9768C13.6265 14.7383 13.6929 14.5665 13.8241 14.293C13.9568 14.0195 13.8905 13.781 13.7917 13.5758C13.6929 13.3707 12.898 11.3542 12.5662 10.5336C12.2436 9.7353 11.9149 9.8434 11.671 9.8307C11.4395 9.818 11.174 9.8164 10.9086 9.8164C10.6431 9.8164 10.2125 9.9182 9.8482 10.3285C9.484 10.7388 8.4561 11.7295 8.4561 13.746C8.4561 15.7624 9.8806 17.7105 10.0797 17.984C10.2788 18.2576 12.8826 22.3939 16.8708 24.1702C17.8185 24.5916 18.5593 24.8445 19.1366 25.0337C20.0889 25.3454 20.9563 25.3009 21.6415 25.1959C22.4055 25.0782 23.9937 24.2052 24.3256 23.2494C24.6574 22.2921 24.6574 21.4715 24.5571 21.3013C24.4583 21.1312 24.1928 21.0278 23.7946 20.8227"
          fill="white"
        />
      </g>
    </svg>
  )
);
MyOperatorChatIcon.displayName = "MyOperatorChatIcon";

export { MyOperatorChatIcon };
export type { BrandIconProps };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Props for the TalkToUsModal component.
 */
export interface TalkToUsModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Heading text (default: "Let's Talk!") */
  title?: string;
  /** Description text below the heading */
  description?: string;
  /** Custom icon element. Defaults to a phone icon in a circular badge */
  icon?: React.ReactNode;
  /** Label for the primary action button (default: "Contact support") */
  primaryActionLabel?: string;
  /** Label for the secondary action button (default: "Cancel") */
  secondaryActionLabel?: string;
  /** Callback when primary action button is clicked */
  onPrimaryAction?: () => void;
  /** Callback when secondary action button is clicked (also closes the modal) */
  onSecondaryAction?: () => void;
  /** Additional className for the dialog content */
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { TalkToUsModal } from "./talk-to-us-modal";
export type { TalkToUsModalProps } from "./types";
export { MyOperatorChatIcon } from "./icon";
export type { BrandIconProps } from "./icon";
`, prefix),
        }
      ],
    },
    "bots": {
      name: "bots",
      description: "AI Bot management components — BotList page, BotCard, and CreateBotModal",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "dialog"
      ],
      isMultiFile: true,
      directory: "bots",
      mainFile: "bot-list.tsx",
      files: [
        {
          name: "bot-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { MessageSquare, Phone, MoreVertical, Pencil, Play, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../dropdown-menu";
import { Badge } from "../badge";
import type { BotCardProps, BotType } from "./types";

const BOT_TYPE_LABELS: Record<BotType, string> = {
  chatbot: "Chatbot",
  voicebot: "Voicebot",
};

export const BotCard = React.forwardRef<HTMLDivElement, BotCardProps>(
  ({ bot, onEdit, onPublish, onDelete, className }, ref) => {
    const isChatbot = bot.type === "chatbot";

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-semantic-bg-primary border border-semantic-border-layout rounded-[5px]",
          "shadow-[0px_4px_15.1px_0px_rgba(0,0,0,0.06)] p-5 flex flex-col",
          className
        )}
      >
        {/* Top row: icon + badge + menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center size-[38px] rounded-full bg-semantic-info-surface shrink-0">
            {isChatbot ? (
              <MessageSquare className="size-5 text-semantic-text-secondary" />
            ) : (
              <Phone className="size-5 text-semantic-text-secondary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {BOT_TYPE_LABELS[bot.type]}
            </Badge>

            {/* Three-dot dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
                  aria-label="More options"
                >
                  <MoreVertical className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer"
                  onClick={() => onEdit?.(bot.id)}
                >
                  <Pencil className="size-4 text-semantic-text-muted shrink-0" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer"
                  onClick={() => onPublish?.(bot.id)}
                >
                  <Play className="size-4 text-semantic-text-muted shrink-0" />
                  <span>Publish</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer text-semantic-error-primary focus:text-semantic-error-primary focus:bg-semantic-error-surface"
                  onClick={() => onDelete?.(bot.id)}
                >
                  <Trash2 className="size-4 shrink-0" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bot name */}
        <h3 className="m-0 text-base font-normal text-semantic-text-primary truncate mb-1">
          {bot.name}
        </h3>

        {/* Conversations count */}
        <p className="m-0 text-sm text-semantic-text-muted mb-4">
          {bot.conversationCount.toLocaleString()} Conversations
        </p>

        {/* Divider */}
        <div className="border-t border-semantic-border-layout mb-3 mt-auto" />

        {/* Last published */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px]">
            Last Published
          </span>
          {bot.lastPublishedBy && bot.lastPublishedDate ? (
            <p className="m-0 text-sm text-semantic-text-muted">
              {bot.lastPublishedBy} | {bot.lastPublishedDate}
            </p>
          ) : (
            <p className="m-0 text-sm text-semantic-text-muted">—</p>
          )}
        </div>
      </div>
    );
  }
);

BotCard.displayName = "BotCard";
`, prefix),
        },
        {
          name: "create-bot-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Phone, MessageSquare, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import type { CreateBotModalProps, BotType } from "./types";

interface BotTypeOption {
  id: BotType;
  label: string;
  description: string;
}

const BOT_TYPE_OPTIONS: BotTypeOption[] = [
  {
    id: "chatbot",
    label: "Chat bot",
    description: "Text-based routing for websites and WhatsApp.",
  },
  {
    id: "voicebot",
    label: "Voice bot",
    description: "Conversational spoken interactions over phone.",
  },
];

export const CreateBotModal = React.forwardRef<
  HTMLDivElement,
  CreateBotModalProps
>(({ open, onOpenChange, onSubmit, className }, ref) => {
  const [name, setName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<BotType>("chatbot");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim(), type: selectedType });
    setName("");
    setSelectedType("chatbot");
  };

  const handleClose = () => {
    setName("");
    setSelectedType("chatbot");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={ref} size="sm" className={cn("mx-4 sm:mx-auto", className)}>
        <DialogHeader>
          <DialogTitle>Create AI bot</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Name field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="bot-name"
              className="flex items-center gap-0.5 text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]"
            >
              Name
              <span className="text-xs text-semantic-error-primary">*</span>
            </label>
            <input
              id="bot-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter bot name"
              className={cn(
                "w-full h-10 px-4 py-2.5 text-sm rounded border",
                "border-semantic-border-input bg-semantic-bg-primary",
                "text-semantic-text-primary placeholder:text-semantic-text-muted",
                "outline-none hover:border-semantic-border-input-focus",
                "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
              )}
            />
          </div>

          {/* Bot type selection */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
              Select Bot Type
            </span>
            <div className="flex gap-3">
              {BOT_TYPE_OPTIONS.map(({ id, label, description }) => {
                const isSelected = selectedType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedType(id)}
                    className={cn(
                      "flex flex-col items-start gap-2.5 p-3 rounded-lg border text-left flex-1 h-[134px] justify-center",
                      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
                      isSelected
                        ? "bg-semantic-brand-surface border-semantic-brand shadow-sm"
                        : "bg-semantic-bg-primary border-semantic-border-layout hover:bg-semantic-bg-hover"
                    )}
                    aria-pressed={isSelected}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-[34px] rounded-lg",
                        isSelected
                          ? "bg-semantic-bg-primary"
                          : "bg-semantic-info-surface-subtle"
                      )}
                    >
                      {id === "chatbot" ? (
                        <MessageSquare className="size-5 text-semantic-text-secondary" />
                      ) : (
                        <Phone className="size-5 text-semantic-text-secondary" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="m-0 text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                        {label}
                      </p>
                      <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                        {description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Helper text */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded bg-semantic-bg-ui">
              <Info className="size-4 text-semantic-text-secondary shrink-0" />
              <p className="m-0 text-xs text-semantic-text-secondary">
                This setting cannot be changed once selected.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-4 justify-end mt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CreateBotModal.displayName = "CreateBotModal";
`, prefix),
        },
        {
          name: "bot-list.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { BotCard } from "./bot-card";
import { CreateBotModal } from "./create-bot-modal";
import type { BotListProps } from "./types";

export const BotList = React.forwardRef<HTMLDivElement, BotListProps>(
  (
    {
      bots = [],
      onCreateBot,
      onCreateBotSubmit,
      onBotEdit,
      onBotPublish,
      onBotDelete,
      onSearch,
      title = "AI Bot",
      subtitle = "Create & manage AI bots",
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    };

    return (
      <div ref={ref} className={cn("flex flex-col w-full", className)}>
        {/* Page header */}
        <div className="flex flex-col gap-4 pb-5 mb-6 border-b border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0.064px]">
              {title}
            </h1>
            <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
              {subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 h-10 px-2.5 border border-semantic-border-input rounded bg-semantic-bg-primary hover:border-semantic-border-input-focus focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] w-full sm:w-auto">
            <Search className="size-[14px] text-semantic-text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search bot..."
              className="text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none w-full sm:w-[180px]"
            />
          </div>
        </div>

        {/* Bot grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {/* Create new bot card */}
          <button
            type="button"
            onClick={() => {
              setCreateModalOpen(true);
              onCreateBot?.();
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-2.5 rounded-[5px]",
              "bg-semantic-info-surface-subtle border border-dashed border-[var(--color-primary-100)]",
              "cursor-pointer hover:bg-semantic-bg-hover transition-colors min-h-[207px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
            )}
          >
            <Plus className="size-4 text-semantic-text-secondary" />
            <span className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
              Create new bot
            </span>
          </button>

          {/* Bot cards */}
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onEdit={onBotEdit}
              onPublish={onBotPublish}
              onDelete={onBotDelete}
            />
          ))}
        </div>

        <CreateBotModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={(data) => {
            onCreateBotSubmit?.(data);
            setCreateModalOpen(false);
          }}
        />
      </div>
    );
  }
);

BotList.displayName = "BotList";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`export type BotType = "chatbot" | "voicebot";

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  conversationCount: number;
  lastPublishedBy?: string;
  lastPublishedDate?: string;
}

export interface BotCardProps {
  bot: Bot;
  /** Called when Edit action is selected */
  onEdit?: (botId: string) => void;
  /** Called when Publish action is selected */
  onPublish?: (botId: string) => void;
  /** Called when Delete action is selected */
  onDelete?: (botId: string) => void;
  className?: string;
}

export interface CreateBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { name: string; type: BotType }) => void;
  className?: string;
}

export interface BotListProps {
  bots?: Bot[];
  /** Called when the "Create new bot" card is clicked (modal opens) */
  onCreateBot?: () => void;
  /** Called when the Create Bot modal is submitted with the new bot data */
  onCreateBotSubmit?: (data: { name: string; type: BotType }) => void;
  onBotEdit?: (botId: string) => void;
  onBotPublish?: (botId: string) => void;
  onBotDelete?: (botId: string) => void;
  onSearch?: (query: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { BotCard } from "./bot-card";
export type { BotCardProps } from "./types";

export { CreateBotModal } from "./create-bot-modal";
export type { CreateBotModalProps } from "./types";

export { BotList } from "./bot-list";
export type { BotListProps, Bot, BotType } from "./types";
`, prefix),
        }
      ],
    },
    "file-upload-modal": {
      name: "file-upload-modal",
      description: "A reusable file upload modal with drag-and-drop, progress tracking, and error handling",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "dialog",
            "button"
      ],
      isMultiFile: true,
      directory: "file-upload-modal",
      mainFile: "file-upload-modal.tsx",
      files: [
        {
          name: "file-upload-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Download, Trash2, X, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../dialog";
import type {
  FileUploadModalProps,
  UploadItem,
  UploadStatus,
} from "./types";

const DEFAULT_ACCEPTED = ".doc,.docx,.pdf,.csv,.xls,.xlsx,.txt";
const DEFAULT_FORMAT_DESC =
  "Max file size 100 MB (Supported Format: .docs, .pdf, .csv, .xls, .xlxs, .txt)";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function useFakeProgress() {
  const intervalsRef = React.useRef<
    Record<string, ReturnType<typeof setInterval>>
  >({});

  const start = React.useCallback(
    (
      id: string,
      setItems: React.Dispatch<React.SetStateAction<UploadItem[]>>
    ) => {
      const interval = setInterval(() => {
        setItems((prev) => {
          let done = false;
          const updated = prev.map((item) => {
            if (item.id !== id || item.status !== "uploading") return item;
            const next = Math.min(item.progress + 15, 100);
            if (next === 100) done = true;
            return {
              ...item,
              progress: next,
              status: (next === 100 ? "done" : "uploading") as UploadStatus,
            };
          });
          if (done) {
            clearInterval(interval);
            delete intervalsRef.current[id];
          }
          return updated;
        });
      }, 500);
      intervalsRef.current[id] = interval;
    },
    []
  );

  const cancel = React.useCallback((id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  }, []);

  const cancelAll = React.useCallback(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
  }, []);

  return { start, cancel, cancelAll };
}

function getTimeRemaining(progress: number) {
  const steps = Math.ceil((100 - progress) / 15);
  const secs = steps * 3;
  return secs > 60
    ? \`\${Math.ceil(secs / 60)} minutes remaining\`
    : \`\${secs} seconds remaining\`;
}

const FileUploadModal = React.forwardRef<HTMLDivElement, FileUploadModalProps>(
  (
    {
      open,
      onOpenChange,
      onUpload,
      onSave,
      onCancel,
      onSampleDownload,
      sampleDownloadLabel = "Download sample file",
      showSampleDownload,
      acceptedFormats = DEFAULT_ACCEPTED,
      formatDescription = DEFAULT_FORMAT_DESC,
      maxFileSizeMB = 100,
      multiple = true,
      title = "File Upload",
      uploadButtonLabel = "Upload from device",
      dropDescription = "or drag and drop file here",
      saveLabel = "Save",
      cancelLabel = "Cancel",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const [items, setItems] = React.useState<UploadItem[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const fakeProgress = useFakeProgress();

    const shouldShowSampleDownload =
      showSampleDownload ?? !!onSampleDownload;

    const addFiles = React.useCallback(
      (fileList: FileList | null) => {
        if (!fileList) return;

        Array.from(fileList).forEach((file) => {
          if (file.size > maxFileSizeMB * 1024 * 1024) {
            const id = generateId();
            setItems((prev) => [
              ...prev,
              {
                id,
                file,
                progress: 0,
                status: "error",
                errorMessage: \`File exceeds \${maxFileSizeMB} MB limit\`,
              },
            ]);
            return;
          }

          const id = generateId();
          setItems((prev) => [
            ...prev,
            { id, file, progress: 0, status: "uploading" },
          ]);

          if (onUpload) {
            onUpload(file, {
              onProgress: (progress) => {
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          progress: Math.min(progress, 100),
                          status:
                            progress >= 100
                              ? ("done" as UploadStatus)
                              : ("uploading" as UploadStatus),
                        }
                      : item
                  )
                );
              },
              onError: (message) => {
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? { ...item, status: "error" as UploadStatus, errorMessage: message }
                      : item
                  )
                );
              },
            }).then(() => {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id && item.status === "uploading"
                    ? { ...item, progress: 100, status: "done" as UploadStatus }
                    : item
                )
              );
            }).catch((err) => {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id && item.status !== "error"
                    ? {
                        ...item,
                        status: "error" as UploadStatus,
                        errorMessage:
                          err instanceof Error
                            ? err.message
                            : "Upload failed",
                      }
                    : item
                )
              );
            });
          } else {
            fakeProgress.start(id, setItems);
          }
        });
      },
      [onUpload, maxFileSizeMB, fakeProgress]
    );

    const removeItem = (id: string) => {
      fakeProgress.cancel(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleClose = () => {
      fakeProgress.cancelAll();
      setItems([]);
      onCancel?.();
      onOpenChange(false);
    };

    const handleSave = () => {
      const completedFiles = items
        .filter((i) => i.status === "done")
        .map((i) => i.file);
      onSave?.(completedFiles);
      fakeProgress.cancelAll();
      setItems([]);
      onOpenChange(false);
    };

    const hasCompleted = items.some((i) => i.status === "done");
    const hasUploading = items.some((i) => i.status === "uploading");

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="default"
          hideCloseButton
          className={cn(
            "max-w-[min(660px,calc(100vw-2rem))] rounded-xl p-4 gap-0 sm:p-6",
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Upload files by clicking the button or dragging and dropping.
            </DialogDescription>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-semantic-text-primary"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 items-end w-full">
            {shouldShowSampleDownload && (
              <button
                type="button"
                onClick={onSampleDownload}
                className="flex items-center gap-1.5 text-sm font-semibold text-semantic-text-link hover:opacity-80 transition-opacity"
              >
                <Download className="size-3.5" />
                {sampleDownloadLabel}
              </button>
            )}

            {/* Drop zone */}
            <div
              className="w-full border border-dashed border-semantic-border-layout bg-semantic-bg-ui rounded p-4"
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-[42px] px-4 rounded border border-semantic-border-layout bg-semantic-bg-primary text-base font-semibold text-semantic-text-secondary shrink-0 hover:bg-semantic-bg-hover transition-colors w-full sm:w-auto"
                >
                  {uploadButtonLabel}
                </button>
                <div className="flex flex-col gap-1">
                  <p className="m-0 text-sm text-semantic-text-secondary tracking-[0.035px]">
                    {dropDescription}
                  </p>
                  <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                    {formatDescription}
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedFormats}
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Upload item list */}
            {items.length > 0 && (
              <div className="flex flex-col gap-2.5 w-full">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-semantic-bg-primary border border-semantic-border-layout rounded px-4 py-3 flex flex-col gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="m-0 text-sm text-semantic-text-primary tracking-[0.035px] truncate">
                          {item.status === "uploading"
                            ? "Uploading..."
                            : item.file.name}
                        </p>
                        {item.status === "uploading" && (
                          <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                            {item.progress}%&nbsp;&bull;&nbsp;
                            {getTimeRemaining(item.progress)}
                          </p>
                        )}
                        {item.status === "error" && (
                          <p className="m-0 text-xs text-semantic-error-primary tracking-[0.048px]">
                            {item.errorMessage ??
                              "Something went wrong, Upload Failed."}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={
                          item.status === "uploading"
                            ? "Cancel upload"
                            : "Remove file"
                        }
                        className={cn(
                          "shrink-0 mt-0.5 transition-colors",
                          item.status === "uploading"
                            ? "text-semantic-error-primary"
                            : "text-semantic-text-muted hover:text-semantic-error-primary"
                        )}
                      >
                        {item.status === "uploading" ? (
                          <XCircle className="size-5" />
                        ) : (
                          <Trash2 className="size-5" />
                        )}
                      </button>
                    </div>
                    {item.status === "uploading" && (
                      <div className="h-2 bg-semantic-bg-ui rounded-full overflow-hidden">
                        <div
                          className="h-full bg-semantic-success-primary rounded-full transition-all duration-300"
                          style={{ width: \`\${item.progress}%\` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 mt-4 sm:mt-6 sm:flex-row sm:justify-end sm:gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleClose}
            >
              {cancelLabel}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSave}
              disabled={!hasCompleted || hasUploading}
              loading={loading}
            >
              {saveLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

FileUploadModal.displayName = "FileUploadModal";

export { FileUploadModal };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
}

export interface UploadProgressHandlers {
  onProgress: (progress: number) => void;
  onError: (message: string) => void;
}

export interface FileUploadModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSave"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called for each file to handle the actual upload. If not provided, uses fake progress (demo mode). */
  onUpload?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSave?: (files: File[]) => void;
  onCancel?: () => void;
  onSampleDownload?: () => void;
  sampleDownloadLabel?: string;
  showSampleDownload?: boolean;
  acceptedFormats?: string;
  formatDescription?: string;
  maxFileSizeMB?: number;
  multiple?: boolean;
  title?: string;
  uploadButtonLabel?: string;
  dropDescription?: string;
  saveLabel?: string;
  cancelLabel?: string;
  /** Shows a loading spinner on the save button (e.g. while processing files server-side) */
  loading?: boolean;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { FileUploadModal } from "./file-upload-modal";
export type {
  FileUploadModalProps,
  UploadProgressHandlers,
  UploadItem,
  UploadStatus,
} from "./types";
`, prefix),
        }
      ],
    },
    "ivr-bot": {
      name: "ivr-bot",
      description: "IVR/Voicebot configuration page with Create Function modal (2-step wizard)",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "badge",
            "switch",
            "accordion",
            "dialog",
            "select",
            "creatable-select",
            "creatable-multi-select",
            "page-header",
            "tag",
            "file-upload-modal"
      ],
      isMultiFile: true,
      directory: "ivr-bot",
      mainFile: "ivr-bot-config.tsx",
      files: [
        {
          name: "ivr-bot-config.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Badge } from "../badge";
import { PageHeader } from "../page-header";
import { BotIdentityCard } from "./bot-identity-card";
import { BotBehaviorCard } from "./bot-behavior-card";
import { KnowledgeBaseCard } from "./knowledge-base-card";
import { FunctionsCard } from "./functions-card";
import { FrustrationHandoverCard } from "./frustration-handover-card";
import { AdvancedSettingsCard } from "./advanced-settings-card";
import { CreateFunctionModal } from "./create-function-modal";
import { FileUploadModal } from "../file-upload-modal";
import type {
  IvrBotConfigProps,
  IvrBotConfigData,
  CreateFunctionData,
} from "./types";
import { FallbackPromptsCard } from "./fallback-prompts-card";


// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA: IvrBotConfigData = {
  botName: "",
  primaryRole: "",
  tone: [],
  voice: "",
  language: "",
  systemPrompt: "",
  agentBusyPrompt: "",
  noExtensionPrompt: "",
  knowledgeBaseFiles: [],
  functions: [
    { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
    { id: "fn-2", name: "end_call()", isBuiltIn: true },
  ],
  frustrationHandoverEnabled: false,
  escalationDepartment: "",
  silenceTimeout: 15,
  callEndThreshold: 3,
  interruptionHandling: true,
};

// ─── Main IvrBotConfig ────────────────────────────────────────────────────────
export const IvrBotConfig = React.forwardRef<HTMLDivElement, IvrBotConfigProps>(
  (
    {
      botTitle = "IVR bot",
      botType = "Voicebot",
      lastUpdatedAt,
      initialData,
      onSaveAsDraft,
      onPublish,
      onSaveKnowledgeFiles,
      onUploadKnowledgeFile,
      onSampleFileDownload,
      onDownloadKnowledgeFile,
      onDeleteKnowledgeFile,
      onCreateFunction,
      onEditFunction,
      onDeleteFunction,
      onTestApi,
      functionsInfoTooltip,
      knowledgeBaseInfoTooltip,
      functionPromptMinLength,
      functionPromptMaxLength,
      functionEditData,
      systemPromptMaxLength,
      onBack,
      onPlayVoice,
      onPauseVoice,
      playingVoice,
      disabled,
      roleOptions,
      toneOptions,
      voiceOptions,
      languageOptions,
      sessionVariables,
      escalationDepartmentOptions,
      silenceTimeoutMin,
      silenceTimeoutMax,
      callEndThresholdMin,
      callEndThresholdMax,
      className,
    },
    ref
  ) => {
    const [data, setData] = React.useState<IvrBotConfigData>({
      ...DEFAULT_DATA,
      ...initialData,
    });
    const [createFnOpen, setCreateFnOpen] = React.useState(false);
    const [editFnOpen, setEditFnOpen] = React.useState(false);
    const [uploadOpen, setUploadOpen] = React.useState(false);

    const update = (patch: Partial<IvrBotConfigData>) =>
      setData((prev) => ({ ...prev, ...patch }));

    const handleCreateFunction = (fnData: CreateFunctionData) => {
      const newFn = { id: \`fn-\${Date.now()}\`, name: fnData.name };
      update({ functions: [...data.functions, newFn] });
      onCreateFunction?.(fnData);
    };

    const handleEditFunction = (id: string) => {
      onEditFunction?.(id);
      setEditFnOpen(true);
    };

    const handleEditFunctionSubmit = (fnData: CreateFunctionData) => {
      onCreateFunction?.(fnData);
      setEditFnOpen(false);
    };

    return (
      <div ref={ref} className={cn("flex flex-col min-h-screen bg-semantic-bg-primary", className)}>
        {/* Page header */}
        <PageHeader
          showBackButton
          onBackClick={onBack}
          title={botTitle}
          badge={
            <Badge variant="outline" className="text-xs font-normal">
              {botType}
            </Badge>
          }
          actions={
            <>
              {lastUpdatedAt && (
                <span className="hidden sm:inline text-sm text-semantic-text-muted mr-1">
                  Last updated at: {lastUpdatedAt}
                </span>
              )}
              <Button
                variant="outline"
                onClick={() => onSaveAsDraft?.(data)}
                disabled={disabled}
              >
                Save as Draft
              </Button>
              <Button
                variant="default"
                onClick={() => onPublish?.(data)}
                disabled={disabled}
              >
                Publish Bot
              </Button>
            </>
          }
        />

        {/* Body — two-column layout: left white, right gray panel */}
        <div className="flex flex-col lg:flex-row lg:flex-1 min-h-0">
          {/* Left column — white background */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[3] min-w-0 lg:max-w-[720px]">
            <BotIdentityCard
              data={data}
              onChange={update}
              onPlayVoice={onPlayVoice}
              onPauseVoice={onPauseVoice}
              playingVoice={playingVoice}
              roleOptions={roleOptions}
              toneOptions={toneOptions}
              voiceOptions={voiceOptions}
              languageOptions={languageOptions}
              disabled={disabled}
            />
            <BotBehaviorCard
              data={data}
              onChange={update}
              sessionVariables={sessionVariables}
              maxLength={systemPromptMaxLength}
              disabled={disabled}
            />
            <FallbackPromptsCard
              data={{
                agentBusyPrompt: data.agentBusyPrompt,
                noExtensionFoundPrompt: data.noExtensionPrompt,
              }}
              onChange={(patch) =>
                update({
                  ...(patch.agentBusyPrompt !== undefined && { agentBusyPrompt: patch.agentBusyPrompt }),
                  ...(patch.noExtensionFoundPrompt !== undefined && { noExtensionPrompt: patch.noExtensionFoundPrompt }),
                })
              }
              disabled={disabled}
            />
          </div>

          {/* Right column — gray panel extending full height */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[2] min-w-0 bg-semantic-bg-ui border-l border-semantic-border-layout">
            <KnowledgeBaseCard
              files={data.knowledgeBaseFiles}
              onAdd={() => setUploadOpen(true)}
              onDownload={onDownloadKnowledgeFile}
              infoTooltip={knowledgeBaseInfoTooltip}
              disabled={disabled}
              onDelete={(id) => {
                update({
                  knowledgeBaseFiles: data.knowledgeBaseFiles.filter(
                    (f) => f.id !== id
                  ),
                });
                onDeleteKnowledgeFile?.(id);
              }}
            />
            <FunctionsCard
              functions={data.functions}
              onAddFunction={() => setCreateFnOpen(true)}
              onEditFunction={handleEditFunction}
              infoTooltip={functionsInfoTooltip}
              disabled={disabled}
              onDeleteFunction={(id) => {
                update({
                  functions: data.functions.filter((f) => f.id !== id),
                });
                onDeleteFunction?.(id);
              }}
            />
            <FrustrationHandoverCard
              data={data}
              onChange={update}
              departmentOptions={escalationDepartmentOptions}
              disabled={disabled}
            />
            <AdvancedSettingsCard
              data={data}
              onChange={update}
              silenceTimeoutMin={silenceTimeoutMin}
              silenceTimeoutMax={silenceTimeoutMax}
              callEndThresholdMin={callEndThresholdMin}
              callEndThresholdMax={callEndThresholdMax}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Create Function Modal */}
        <CreateFunctionModal
          open={createFnOpen}
          onOpenChange={setCreateFnOpen}
          onSubmit={handleCreateFunction}
          onTestApi={onTestApi}
          promptMinLength={functionPromptMinLength}
          promptMaxLength={functionPromptMaxLength}
        />

        {/* Edit Function Modal */}
        <CreateFunctionModal
          open={editFnOpen}
          onOpenChange={setEditFnOpen}
          onSubmit={handleEditFunctionSubmit}
          onTestApi={onTestApi}
          initialData={functionEditData}
          isEditing
          promptMinLength={functionPromptMinLength}
          promptMaxLength={functionPromptMaxLength}
        />

        {/* File Upload Modal */}
        <FileUploadModal
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onUpload={onUploadKnowledgeFile}
          onSampleDownload={onSampleFileDownload}
          onSave={onSaveKnowledgeFiles}
        />
      </div>
    );
  }
);

IvrBotConfig.displayName = "IvrBotConfig";
`, prefix),
        },
        {
          name: "create-function-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Trash2, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import type {
  CreateFunctionModalProps,
  CreateFunctionData,
  CreateFunctionStep2Data,
  FunctionTabType,
  HttpMethod,
  KeyValuePair,
} from "./types";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const METHODS_WITH_BODY: HttpMethod[] = ["POST", "PUT", "PATCH"];
const FUNCTION_NAME_MAX = 30;
const BODY_MAX = 4000;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Shared input/textarea styles ──────────────────────────────────────────────
const inputCls = cn(
  "w-full h-[42px] px-4 text-base rounded border",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
);

const textareaCls = cn(
  "w-full px-4 py-2.5 text-base rounded border resize-none",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
);

// ── KeyValueTable ─────────────────────────────────────────────────────────────
function KeyValueTable({
  rows,
  onChange,
  label,
}: {
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
  label: string;
}) {
  const update = (id: string, patch: Partial<KeyValuePair>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const add = () =>
    onChange([...rows, { id: generateId(), key: "", value: "" }]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-semantic-text-muted">{label}</span>
      <div className="border border-semantic-border-layout rounded overflow-hidden">
        {/* Column headers — desktop only */}
        <div className="hidden sm:flex bg-semantic-bg-ui border-b border-semantic-border-layout">
          <div className="flex-1 px-3 py-2 text-xs font-semibold text-semantic-text-muted border-r border-semantic-border-layout">
            Key
          </div>
          <div className="flex-[2] px-3 py-2 text-xs font-semibold text-semantic-text-muted">
            Value
          </div>
          <div className="w-10 shrink-0" />
        </div>

        {/* Filled rows */}
        {rows.map((row) => (
          <div
            key={row.id}
            className="border-b border-semantic-border-layout last:border-b-0"
          >
            {/* Mobile: label + input pairs stacked */}
            <div className="flex sm:hidden flex-col">
              <div className="flex flex-col px-3 pt-2.5 pb-1 gap-0.5">
                <span className="text-[10px] font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Key
                </span>
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => update(row.id, { key: e.target.value })}
                  placeholder="Key"
                  className="w-full text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none"
                />
              </div>
              <div className="h-px bg-semantic-border-layout mx-3" />
              <div className="flex items-start gap-2 px-3 py-2.5">
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="text-[10px] font-semibold text-semantic-text-muted uppercase tracking-wide">
                    Value
                  </span>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => update(row.id, { value: e.target.value })}
                    placeholder="Type {{ to add variables"
                    className="w-full text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="mt-4 size-8 flex items-center justify-center text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface rounded transition-colors shrink-0"
                  aria-label="Delete row"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop: side-by-side */}
            <div className="hidden sm:flex">
              <input
                type="text"
                value={row.key}
                onChange={(e) => update(row.id, { key: e.target.value })}
                placeholder="Key"
                className="flex-1 px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary border-r border-semantic-border-layout outline-none focus:bg-semantic-bg-hover"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => update(row.id, { value: e.target.value })}
                placeholder="Type {{ to add variables"
                className="flex-[2] px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover"
              />
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="w-10 flex items-center justify-center text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors shrink-0"
                aria-label="Delete row"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add row — always visible */}
        <button
          type="button"
          onClick={add}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors"
        >
          <Plus className="size-3.5 shrink-0" />
          <span>Add row</span>
        </button>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export const CreateFunctionModal = React.forwardRef<
  HTMLDivElement,
  CreateFunctionModalProps
>(
  (
    {
      open,
      onOpenChange,
      onSubmit,
      onTestApi,
      initialData,
      isEditing = false,
      promptMinLength = 100,
      promptMaxLength = 5000,
      initialStep = 1,
      initialTab = "header",
      className,
    },
    ref
  ) => {
    const [step, setStep] = React.useState<1 | 2>(initialStep);

    const [name, setName] = React.useState(initialData?.name ?? "");
    const [prompt, setPrompt] = React.useState(initialData?.prompt ?? "");

    const [method, setMethod] = React.useState<HttpMethod>(initialData?.method ?? "GET");
    const [url, setUrl] = React.useState(initialData?.url ?? "");
    const [activeTab, setActiveTab] =
      React.useState<FunctionTabType>(initialTab);
    const [headers, setHeaders] = React.useState<KeyValuePair[]>(initialData?.headers ?? []);
    const [queryParams, setQueryParams] = React.useState<KeyValuePair[]>(initialData?.queryParams ?? []);
    const [body, setBody] = React.useState(initialData?.body ?? "");
    const [apiResponse, setApiResponse] = React.useState("");
    const [isTesting, setIsTesting] = React.useState(false);

    // Sync form state from initialData each time the modal opens
    React.useEffect(() => {
      if (open) {
        setStep(initialStep);
        setName(initialData?.name ?? "");
        setPrompt(initialData?.prompt ?? "");
        setMethod(initialData?.method ?? "GET");
        setUrl(initialData?.url ?? "");
        setActiveTab(initialTab);
        setHeaders(initialData?.headers ?? []);
        setQueryParams(initialData?.queryParams ?? []);
        setBody(initialData?.body ?? "");
        setApiResponse("");
      }
    // Re-run only when modal opens; intentionally exclude deep deps to avoid mid-session resets
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const reset = React.useCallback(() => {
      setStep(initialStep);
      setName(initialData?.name ?? "");
      setPrompt(initialData?.prompt ?? "");
      setMethod(initialData?.method ?? "GET");
      setUrl(initialData?.url ?? "");
      setActiveTab(initialTab);
      setHeaders(initialData?.headers ?? []);
      setQueryParams(initialData?.queryParams ?? []);
      setBody(initialData?.body ?? "");
      setApiResponse("");
    }, [initialData, initialStep, initialTab]);

    const handleClose = React.useCallback(() => {
      reset();
      onOpenChange(false);
    }, [reset, onOpenChange]);

    const supportsBody = METHODS_WITH_BODY.includes(method);

    // When switching to a method without body, reset to header tab if body was active
    React.useEffect(() => {
      if (!supportsBody && activeTab === "body") {
        setActiveTab("header");
      }
    }, [supportsBody, activeTab]);

    const handleNext = () => {
      if (name.trim() && prompt.trim().length >= promptMinLength) setStep(2);
    };

    const handleSubmit = () => {
      const data: CreateFunctionData = {
        name: name.trim(),
        prompt: prompt.trim(),
        method,
        url: url.trim(),
        headers,
        queryParams,
        body,
      };
      onSubmit?.(data);
      handleClose();
    };

    const handleTestApi = async () => {
      if (!onTestApi) return;
      setIsTesting(true);
      try {
        const step2: CreateFunctionStep2Data = {
          method,
          url,
          headers,
          queryParams,
          body,
        };
        const response = await onTestApi(step2);
        setApiResponse(response);
      } finally {
        setIsTesting(false);
      }
    };

    const isStep1Valid =
      name.trim().length > 0 && prompt.trim().length >= promptMinLength;

    const tabLabels: Record<FunctionTabType, string> = {
      header: \`Header (\${headers.length})\`,
      queryParams: \`Query params (\${queryParams.length})\`,
      body: "Body",
    };

    const visibleTabs: FunctionTabType[] = supportsBody
      ? ["header", "queryParams", "body"]
      : ["header", "queryParams"];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="lg"
          hideCloseButton
          className={cn(
            "flex flex-col gap-0 p-0 w-[calc(100vw-2rem)] sm:w-full",
            "max-h-[calc(100svh-2rem)] overflow-hidden",
            className
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout shrink-0 sm:px-6">
            <DialogTitle className="text-base font-semibold text-semantic-text-primary">
              {isEditing ? "Edit Function" : "Create Function"}
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="rounded p-1.5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 sm:px-6">
            {/* ─ Step 1 ─ */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fn-name"
                    className="text-sm font-semibold text-semantic-text-primary"
                  >
                    Function Name{" "}
                    <span className="text-semantic-error-primary">*</span>
                  </label>
                  <div className={cn("relative")}>
                    <input
                      id="fn-name"
                      type="text"
                      value={name}
                      maxLength={FUNCTION_NAME_MAX}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name of the function"
                      className={cn(inputCls, "pr-16")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs italic text-semantic-text-muted pointer-events-none">
                      {name.length}/{FUNCTION_NAME_MAX}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fn-prompt"
                    className="text-sm font-semibold text-semantic-text-primary"
                  >
                    Prompt{" "}
                    <span className="text-semantic-error-primary">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="fn-prompt"
                      value={prompt}
                      maxLength={promptMaxLength}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter the description of the function"
                      rows={5}
                      className={cn(textareaCls, "pb-7")}
                    />
                    <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted pointer-events-none">
                      {prompt.length}/{promptMaxLength}
                    </span>
                  </div>
                  {prompt.length > 0 && prompt.trim().length < promptMinLength && (
                    <p className="m-0 text-xs text-semantic-error-primary">
                      Minimum {promptMinLength} characters required
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ─ Step 2 ─ */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                {/* API URL — always a single combined row */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
                    API URL
                  </span>
                  <div
                    className={cn(
                      "flex h-[42px] rounded border border-semantic-border-input overflow-hidden bg-semantic-bg-primary",
                      "hover:border-semantic-border-input-focus",
                      "focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
                      "transition-shadow"
                    )}
                  >
                    {/* Method selector */}
                    <div className="relative shrink-0 border-r border-semantic-border-layout">
                      <select
                        value={method}
                        onChange={(e) =>
                          setMethod(e.target.value as HttpMethod)
                        }
                        className="h-full w-[80px] pl-3 pr-7 text-base text-semantic-text-primary bg-transparent outline-none cursor-pointer appearance-none sm:w-[100px]"
                        aria-label="HTTP method"
                      >
                        {HTTP_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-semantic-text-muted pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                    {/* URL input */}
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter URL or Type {{ to add variables"
                      className="flex-1 min-w-0 px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Tabs — scrollable, no visible scrollbar */}
                <div className="flex flex-col gap-4">
                  <div
                    className={cn(
                      "flex border-b border-semantic-border-layout",
                      "overflow-x-auto",
                      "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    )}
                  >
                    {visibleTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0",
                          activeTab === tab
                            ? "text-semantic-text-secondary border-b-2 border-semantic-text-secondary -mb-px"
                            : "text-semantic-text-muted hover:text-semantic-text-primary"
                        )}
                      >
                        {tabLabels[tab]}
                      </button>
                    ))}
                  </div>

                  {activeTab === "header" && (
                    <KeyValueTable
                      rows={headers}
                      onChange={setHeaders}
                      label="Header"
                    />
                  )}
                  {activeTab === "queryParams" && (
                    <KeyValueTable
                      rows={queryParams}
                      onChange={setQueryParams}
                      label="Query parameter"
                    />
                  )}
                  {activeTab === "body" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-semantic-text-muted">
                        Body
                      </span>
                      <div className={cn("relative")}>
                        <textarea
                          value={body}
                          maxLength={BODY_MAX}
                          onChange={(e) => setBody(e.target.value)}
                          placeholder="Enter request body (JSON, XML etc). Type {{ to add variables"
                          rows={6}
                          className={cn(textareaCls, "pb-7")}
                        />
                        <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted pointer-events-none">
                          {body.length}/{BODY_MAX}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Your API */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-semantic-text-muted tracking-[0.048px]">
                      Test Your API
                    </span>
                    <div className="border-t border-semantic-border-layout" />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestApi}
                    disabled={isTesting || !url.trim()}
                    className="w-full h-[42px] rounded text-sm font-semibold text-semantic-text-secondary bg-semantic-primary-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-semantic-primary-surface/80 sm:w-auto sm:px-6 sm:self-end sm:ml-auto flex items-center justify-center"
                  >
                    {isTesting ? "Testing..." : "Test API"}
                  </button>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-semantic-text-muted">
                      Response from API
                    </span>
                    <textarea
                      readOnly
                      value={apiResponse}
                      rows={4}
                      className="w-full px-3 py-2.5 text-base rounded border border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary resize-none outline-none"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-semantic-border-layout shrink-0 sm:px-6 sm:py-4">
            {step === 1 ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateFunctionModal.displayName = "CreateFunctionModal";
`, prefix),
        },
        {
          name: "bot-identity-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Info, PlayCircle, PauseCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { CreatableSelect } from "../creatable-select";
import { CreatableMultiSelect } from "../creatable-multi-select";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VoiceOption {
  value: string;
  label: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface ToneOption {
  value: string;
  label: string;
}

export interface BotIdentityData {
  botName: string;
  primaryRole: string;
  tone: string[];
  voice: string;
  language: string;
}

export interface BotIdentityCardProps {
  /** Current form data */
  data: Partial<BotIdentityData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<BotIdentityData>) => void;
  /** Available role options for the creatable select */
  roleOptions?: RoleOption[];
  /** Available tone preset options */
  toneOptions?: ToneOption[];
  /** Available voice options */
  voiceOptions?: VoiceOption[];
  /** Available language options */
  languageOptions?: LanguageOption[];
  /** Called when the play icon is clicked on a voice option. Receives the voice value. */
  onPlayVoice?: (voiceValue: string) => void;
  /** Called when the pause icon is clicked on a playing voice. */
  onPauseVoice?: (voiceValue: string) => void;
  /** The voice value currently being played. Controls play/pause icon state. */
  playingVoice?: string;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className for the card */
  className?: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function Field({
  label,
  required,
  helperText,
  children,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
        {required && (
          <span className="text-semantic-error-primary ml-0.5">*</span>
        )}
      </label>
      {children}
      {helperText && (
        <div className="flex items-center gap-1.5 text-xs text-semantic-text-muted">
          <Info className="size-3.5 shrink-0" />
          <p className="m-0">{helperText}</p>
        </div>
      )}
    </div>
  );
}

function StyledInput({
  placeholder,
  value,
  onChange,
  disabled,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full h-[42px] px-4 text-base rounded border",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
}

// ─── Default options ─────────────────────────────────────────────────────────

const DEFAULT_ROLE_OPTIONS: RoleOption[] = [
  { value: "customer-support", label: "Customer Support Agent" },
  { value: "sales", label: "Sales Representative" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing Enquiry Agent" },
  { value: "receptionist", label: "Receptionist" },
  { value: "lead-qualification", label: "Lead Qualification Agent" },
  { value: "appointment", label: "Appointment Scheduler Agent" },
  { value: "feedback", label: "Feedback Gatherer Agent" },
  { value: "info", label: "Information Gatherer Agent" },
];

const DEFAULT_TONE_OPTIONS: ToneOption[] = [
  { value: "Professional and highly concise", label: "Professional and highly concise" },
  { value: "Friendly and conversational", label: "Friendly and conversational" },
  { value: "Calm and reassuring", label: "Calm and reassuring" },
  { value: "Polite and formal", label: "Polite and formal" },
  { value: "Cheerful and engaging", label: "Cheerful and engaging" },
  { value: "Neutral and informative", label: "Neutral and informative" },
  { value: "Respectful and minimal", label: "Respectful and minimal" },
  { value: "Crisp and transactional", label: "Crisp and transactional" },
  { value: "Energetic and upbeat", label: "Energetic and upbeat" },
  { value: "Soft-spoken and comforting", label: "Soft-spoken and comforting" },
  { value: "Direct and efficient", label: "Direct and efficient" },
];

const DEFAULT_VOICE_OPTIONS: VoiceOption[] = [
  { value: "rhea-female", label: "Rhea - Female" },
  { value: "arjun-male", label: "Arjun - Male" },
  { value: "priya-female", label: "Priya - Female" },
  { value: "vikram-male", label: "Vikram - Male" },
  { value: "ananya-female", label: "Ananya - Female" },
];

const DEFAULT_LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en-in", label: "English (India)" },
  { value: "en-us", label: "English (US)" },
  { value: "hi-in", label: "Hindi" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const BotIdentityCard = React.forwardRef<HTMLDivElement, BotIdentityCardProps>(
  (
    {
      data,
      onChange,
      roleOptions = DEFAULT_ROLE_OPTIONS,
      toneOptions = DEFAULT_TONE_OPTIONS,
      voiceOptions = DEFAULT_VOICE_OPTIONS,
      languageOptions = DEFAULT_LANGUAGE_OPTIONS,
      onPlayVoice,
      onPauseVoice,
      playingVoice,
      disabled,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            Who The Bot Is
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-5">
            <Field
              label="Bot Name & Identity"
              helperText="This is the name the bot will use to refer to itself during conversations."
            >
              <StyledInput
                placeholder="e.g., Rhea from CaratLane"
                value={data.botName}
                onChange={(v) => onChange({ botName: v })}
                disabled={disabled}
              />
            </Field>

            <Field label="Primary Role">
              <CreatableSelect
                value={data.primaryRole || ""}
                onValueChange={(v) => onChange({ primaryRole: v })}
                options={roleOptions}
                placeholder="e.g., Customer Support Agent"
                creatableHint="Type to create a custom role"
                disabled={disabled}
              />
            </Field>

            <Field label="Tone">
              <CreatableMultiSelect
                value={Array.isArray(data.tone) ? data.tone : []}
                onValueChange={(v) => onChange({ tone: v })}
                options={toneOptions}
                placeholder="Enter or select tone"
                creatableHint="Type to create a custom tone"
                disabled={disabled}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="How It Sounds">
                <Select
                  value={data.voice || undefined}
                  onValueChange={(v) => {
                    onChange({ voice: v });
                    onPauseVoice?.(v);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice">
                      {data.voice && (
                        <span className="inline-flex items-center gap-2">
                          <PlayCircle className="size-5 shrink-0 text-semantic-text-muted" />
                          {voiceOptions.find((o) => o.value === data.voice)?.label ?? data.voice}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={
                              playingVoice === opt.value
                                ? \`Pause \${opt.label}\`
                                : \`Play \${opt.label}\`
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (playingVoice === opt.value) {
                                onPauseVoice?.(opt.value);
                              } else {
                                onPlayVoice?.(opt.value);
                              }
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center rounded-full hover:bg-semantic-bg-hover transition-colors"
                          >
                            {playingVoice === opt.value ? (
                              <PauseCircle className="size-5 shrink-0 text-semantic-primary" />
                            ) : (
                              <PlayCircle className="size-5 shrink-0 text-semantic-text-muted" />
                            )}
                          </button>
                          <span className="h-4 w-px bg-semantic-border-layout shrink-0" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="What Language It Speaks">
                <Select
                  value={data.language || undefined}
                  onValueChange={(v) => onChange({ language: v })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
BotIdentityCard.displayName = "BotIdentityCard";

export { BotIdentityCard };
`, prefix),
        },
        {
          name: "bot-behavior-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tagVariants } from "../tag";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotBehaviorData {
  systemPrompt: string;
}

export interface BotBehaviorCardProps {
  /** Current form data */
  data: Partial<BotBehaviorData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<BotBehaviorData>) => void;
  /** Session variables shown as insertable chips */
  sessionVariables?: string[];
  /** Maximum character length for the system prompt textarea (default: 25000) */
  maxLength?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className for the card */
  className?: string;
}

// ─── Default session variables ──────────────────────────────────────────────

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

// ─── Internal helpers ───────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
        <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
          {title}
        </h2>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

function StyledTextarea({
  placeholder,
  value,
  rows = 3,
  onChange,
  disabled,
  className,
}: {
  placeholder?: string;
  value?: string;
  rows?: number;
  onChange?: (v: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full px-4 py-2.5 text-base rounded border resize-none",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const BotBehaviorCard = React.forwardRef<HTMLDivElement, BotBehaviorCardProps>(
  (
    {
      data,
      onChange,
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      maxLength = 25000,
      disabled,
      className,
    },
    ref
  ) => {
    const prompt = data.systemPrompt ?? "";
    const MAX = maxLength;

    const insertVariable = (variable: string) => {
      onChange({ systemPrompt: prompt + variable });
    };

    return (
      <div ref={ref} className={className}>
        <SectionCard title="How It Behaves">
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm text-semantic-text-muted">
              Define workflows, conditions and handover logic (System prompt)
            </p>
            <div className="relative">
              <StyledTextarea
                value={prompt}
                rows={6}
                onChange={(v) => {
                  if (v.length <= MAX) onChange({ systemPrompt: v });
                }}
                placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
                disabled={disabled}
                className="pb-8"
              />
              <span className="absolute bottom-2.5 right-3 text-sm text-semantic-text-muted">
                {prompt.length}/{MAX}
              </span>
            </div>
            <p className="m-0 text-sm text-semantic-text-muted">
              Type [[ to enable dropdown or use the below chips to input variables.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-semantic-text-secondary">
                Session variables:
              </span>
              {sessionVariables.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVariable(v)}
                  disabled={disabled}
                  className={cn(tagVariants(), "gap-1.5 cursor-pointer hover:opacity-80 transition-opacity", disabled && "opacity-50 cursor-not-allowed")}
                >
                  <Plus className="size-3 shrink-0" />
                  {v}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }
);
BotBehaviorCard.displayName = "BotBehaviorCard";

export { BotBehaviorCard };
`, prefix),
        },
        {
          name: "knowledge-base-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Download, Trash2, Plus, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { BOT_KNOWLEDGE_STATUS } from "./types";
import type { KnowledgeBaseFile } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KnowledgeBaseCardProps {
  /** List of knowledge base files */
  files: KnowledgeBaseFile[];
  /** Called when user clicks the "+ Files" button */
  onAdd?: () => void;
  /** Called when user clicks the download button on a file */
  onDownload?: (id: string) => void;
  /** Called when user clicks the delete button on a file */
  onDelete?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Knowledge Base" title */
  infoTooltip?: string;
  /** Disables all interactive elements in the card (view mode) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Status config ──────────────────────────────────────────────────────────

type BadgeVariant = "default" | "active" | "destructive";
const STATUS_CONFIG: Record<BOT_KNOWLEDGE_STATUS, { label: string; variant: BadgeVariant }> = {
  [BOT_KNOWLEDGE_STATUS.PENDING]:    { label: "Pending",    variant: "default"      },
  [BOT_KNOWLEDGE_STATUS.READY]:      { label: "Ready",      variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.PROCESSING]: { label: "Processing", variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.FAILED]:     { label: "Failed",     variant: "destructive"  },
};

// ─── Component ──────────────────────────────────────────────────────────────

const KnowledgeBaseCard = React.forwardRef<HTMLDivElement, KnowledgeBaseCardProps>(
  (
    {
      files,
      onAdd,
      onDownload,
      onDelete,
      infoTooltip,
      disabled,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
            <div className="flex items-center gap-1.5">
              <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
                Knowledge Base
              </h2>
              {infoTooltip ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-semantic-text-muted shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>{infoTooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              )}
            </div>
            <button
              type="button"
              onClick={() => onAdd?.()}
              disabled={disabled}
              className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
            >
              <Plus className="size-3.5" />
              Files
            </button>
          </div>
          {/* File list */}
          <div className="px-4 sm:px-6">
            {files.length === 0 ? (
              <p className="m-0 text-sm text-semantic-text-muted text-center py-5">
                No files added yet. Click &ldquo;+ Files&rdquo; to upload.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-semantic-border-layout">
                {files.map((file) => {
                  const status = STATUS_CONFIG[file.status] ?? STATUS_CONFIG[BOT_KNOWLEDGE_STATUS.PENDING];
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-semantic-text-primary truncate">
                          File {file.name}
                        </span>
                        <Badge
                          variant={status.variant}
                          size="sm"
                          className="px-3 font-normal shrink-0 whitespace-nowrap"
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => onDownload?.(file.id)}
                          disabled={disabled}
                          className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
                          aria-label="Download file"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(file.id)}
                          disabled={disabled}
                          className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", disabled && "opacity-50 cursor-not-allowed")}
                          aria-label="Delete file"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    );
  }
);
KnowledgeBaseCard.displayName = "KnowledgeBaseCard";

export { KnowledgeBaseCard };
`, prefix),
        },
        {
          name: "functions-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import type { FunctionItem } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FunctionsCardProps {
  /** List of functions to display */
  functions: FunctionItem[];
  /** Called when user clicks the add function button */
  onAddFunction?: () => void;
  /** Called when user edits a custom (non-built-in) function */
  onEditFunction?: (id: string) => void;
  /** Called when user deletes a custom (non-built-in) function */
  onDeleteFunction?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Functions" title */
  infoTooltip?: string;
  /** Disables all interactive elements in the card (view mode) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

const FunctionsCard = React.forwardRef<HTMLDivElement, FunctionsCardProps>(
  ({ functions, onAddFunction, onEditFunction, onDeleteFunction, infoTooltip, disabled, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
          <div className="flex items-center gap-1.5">
            <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
              Functions
            </h2>
            {infoTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-semantic-text-muted shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            )}
          </div>
          <button
            type="button"
            onClick={onAddFunction}
            disabled={disabled}
            className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
          >
            <Plus className="size-3.5" />
            Functions
          </button>
        </div>
        {/* Function list */}
        <div className="px-4 py-4 sm:px-6">
          {functions.length === 0 ? (
            <p className="m-0 text-sm text-semantic-text-muted text-center py-2">
              No functions added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {functions.map((fn) => (
                <div
                  key={fn.id}
                  className="flex items-center justify-between px-4 py-3 rounded border border-semantic-border-layout bg-semantic-bg-primary"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {fn.tooltip ? (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-4 text-semantic-text-muted shrink-0 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{fn.tooltip}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Info className="size-4 text-semantic-text-muted shrink-0" />
                    )}
                    <span className="text-sm text-semantic-text-primary truncate">
                      {fn.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {fn.isBuiltIn ? (
                      <Badge size="sm" className="font-normal">
                        Built-in
                      </Badge>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditFunction?.(fn.id)}
                          disabled={disabled}
                          className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
                          aria-label={\`Edit \${fn.name}\`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteFunction?.(fn.id)}
                          disabled={disabled}
                          className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", disabled && "opacity-50 cursor-not-allowed")}
                          aria-label={\`Delete \${fn.name}\`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
FunctionsCard.displayName = "FunctionsCard";

export { FunctionsCard };
`, prefix),
        },
        {
          name: "frustration-handover-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Switch } from "../switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FrustrationHandoverData {
  frustrationHandoverEnabled: boolean;
  escalationDepartment: string;
}

export interface DepartmentOption {
  value: string;
  label: string;
}

const DEFAULT_DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "billing", label: "Billing" },
];

export interface FrustrationHandoverCardProps {
  /** Current form data */
  data: Partial<FrustrationHandoverData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<FrustrationHandoverData>) => void;
  /** Available escalation department options */
  departmentOptions?: DepartmentOption[];
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const FrustrationHandoverCard = React.forwardRef<HTMLDivElement, FrustrationHandoverCardProps>(
  ({ data, onChange, departmentOptions = DEFAULT_DEPARTMENT_OPTIONS, disabled, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="frustration">
            <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
                Frustration Handover
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6 pt-0 pb-2">
                <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
                  <span className="text-sm text-semantic-text-primary">
                    Enable frustration-based escalation
                  </span>
                  <Switch
                    checked={data.frustrationHandoverEnabled ?? false}
                    onCheckedChange={(v) =>
                      onChange({ frustrationHandoverEnabled: v })
                    }
                    disabled={disabled}
                  />
                </div>
                <div className="px-4 pb-2 sm:px-6">
                  <Field label="Escalation Department">
                    <Select
                      value={data.escalationDepartment || undefined}
                      onValueChange={(v) => onChange({ escalationDepartment: v })}
                      disabled={disabled || !data.frustrationHandoverEnabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
FrustrationHandoverCard.displayName = "FrustrationHandoverCard";

export { FrustrationHandoverCard };
`, prefix),
        },
        {
          name: "advanced-settings-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdvancedSettingsData {
  silenceTimeout: number;
  callEndThreshold: number;
  interruptionHandling: boolean;
}

export interface AdvancedSettingsCardProps {
  /** Current form data */
  data: Partial<AdvancedSettingsData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<AdvancedSettingsData>) => void;
  /** Min value for silence timeout spinner (default: 1) */
  silenceTimeoutMin?: number;
  /** Max value for silence timeout spinner (default: 60) */
  silenceTimeoutMax?: number;
  /** Min value for call end threshold spinner (default: 1) */
  callEndThresholdMin?: number;
  /** Max value for call end threshold spinner (default: 10) */
  callEndThresholdMax?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = 999,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex w-full items-center gap-2.5 px-4 py-2.5 border border-semantic-border-layout bg-semantic-bg-primary rounded", disabled && "opacity-50 cursor-not-allowed")}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 text-base text-semantic-text-primary bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center shrink-0 gap-0.5">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed"
          aria-label="Increase"
        >
          <ChevronUp className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed"
          aria-label="Decrease"
        >
          <ChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const AdvancedSettingsCard = React.forwardRef<HTMLDivElement, AdvancedSettingsCardProps>(
  (
    {
      data,
      onChange,
      silenceTimeoutMin = 1,
      silenceTimeoutMax = 60,
      callEndThresholdMin = 1,
      callEndThresholdMax = 10,
      disabled,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="advanced">
            <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="text-base font-semibold text-semantic-text-primary">
                Advanced Settings
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {/* Number fields section */}
                <div className="px-4 pt-4 pb-4 flex flex-col gap-5 border-b border-semantic-border-layout sm:px-6 sm:pt-5 sm:pb-6">
                  <Field label="Silence Timeout (seconds)">
                    <NumberSpinner
                      value={data.silenceTimeout ?? 15}
                      onChange={(v) => onChange({ silenceTimeout: v })}
                      min={silenceTimeoutMin}
                      max={silenceTimeoutMax}
                      disabled={disabled}
                    />
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Default: 15 seconds
                    </p>
                  </Field>

                  <Field label="Call End Threshold">
                    <NumberSpinner
                      value={data.callEndThreshold ?? 3}
                      onChange={(v) => onChange({ callEndThreshold: v })}
                      min={callEndThresholdMin}
                      max={callEndThresholdMax}
                      disabled={disabled}
                    />
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Drop call after n consecutive silences. Default: 3
                    </p>
                  </Field>
                </div>

                {/* Interruption Handling — separated by divider */}
                <div className="px-4 py-4 flex items-center gap-3 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-semantic-text-primary">
                      Interruption Handling
                    </span>
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Allow user to interrupt the bot mid-sentence
                    </p>
                  </div>
                  <Switch
                    checked={data.interruptionHandling ?? true}
                    onCheckedChange={(v) =>
                      onChange({ interruptionHandling: v })
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
AdvancedSettingsCard.displayName = "AdvancedSettingsCard";

export { AdvancedSettingsCard };
`, prefix),
        },
        {
          name: "fallback-prompts-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FallbackPromptsData {
  agentBusyPrompt: string;
  noExtensionFoundPrompt: string;
}

export interface FallbackPromptsCardProps {
  /** Current prompt text values */
  data: Partial<FallbackPromptsData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<FallbackPromptsData>) => void;
  /** Called when the Agent Busy Prompt textarea loses focus */
  onAgentBusyPromptBlur?: (value: string) => void;
  /** Called when the No Extension Found textarea loses focus */
  onNoExtensionFoundPromptBlur?: (value: string) => void;
  /** Maximum character length for each prompt field (default: 25000) */
  maxLength?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Opens the accordion by default (default: false) */
  defaultOpen?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function PromptField({
  label,
  value,
  placeholder,
  maxLength,
  disabled,
  onChange,
  onBlur,
  rows = 2,
}: {
  label: string;
  value: string;
  placeholder?: string;
  maxLength: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className={cn(
          "w-full resize-none rounded border border-semantic-border-layout bg-semantic-bg-primary px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted outline-none transition-all",
          "focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <p className="m-0 text-xs text-semantic-text-muted text-right">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const FallbackPromptsCard = React.forwardRef<
  HTMLDivElement,
  FallbackPromptsCardProps
>(
  (
    {
      data,
      onChange,
      onAgentBusyPromptBlur,
      onNoExtensionFoundPromptBlur,
      maxLength = 25000,
      disabled,
      defaultOpen = false,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion
          type="single"
          defaultValue={defaultOpen ? ["fallback"] : []}
        >
          <AccordionItem value="fallback">
            <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
                Fallback Prompts
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6 px-4 pt-4 sm:px-6 sm:pt-5">
                <PromptField
                  label="Agent Busy Prompt"
                  value={data.agentBusyPrompt ?? ""}
                  placeholder="Executives are busy at the moment, we will connect you soon."
                  maxLength={maxLength}
                  disabled={disabled}
                  onChange={(v) => onChange({ agentBusyPrompt: v })}
                  onBlur={onAgentBusyPromptBlur}
                  rows={2}
                />
                <PromptField
                  label="No Extension Found"
                  value={data.noExtensionFoundPrompt ?? ""}
                  placeholder="Sorry, the requested extension is currently unavailable. Let me help you directly."
                  maxLength={maxLength}
                  disabled={disabled}
                  onChange={(v) => onChange({ noExtensionFoundPrompt: v })}
                  onBlur={onNoExtensionFoundPromptBlur}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
FallbackPromptsCard.displayName = "FallbackPromptsCard";

export { FallbackPromptsCard };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import type { UploadProgressHandlers } from "../file-upload-modal";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type FunctionTabType = "header" | "queryParams" | "body";

export const BOT_KNOWLEDGE_STATUS = {
  PENDING: "pending",
  READY: "ready",
  PROCESSING: "processing",
  FAILED: "failed",
} as const;

export type BOT_KNOWLEDGE_STATUS = typeof BOT_KNOWLEDGE_STATUS[keyof typeof BOT_KNOWLEDGE_STATUS];

export type KnowledgeFileStatus = BOT_KNOWLEDGE_STATUS;

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface FunctionItem {
  id: string;
  name: string;
  isBuiltIn?: boolean;
  /** Hover text shown on the info icon for this function */
  tooltip?: string;
}

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  status: KnowledgeFileStatus;
}

export interface CreateFunctionStep1Data {
  name: string;
  prompt: string;
}

export interface CreateFunctionStep2Data {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  body: string;
}

export interface CreateFunctionData
  extends CreateFunctionStep1Data,
    CreateFunctionStep2Data {}

export interface CreateFunctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateFunctionData) => void;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  /** Pre-fills all fields — use when opening the modal to edit an existing function */
  initialData?: Partial<CreateFunctionData>;
  /** When true, changes the modal title to "Edit Function" */
  isEditing?: boolean;
  /** Minimum character length for the prompt field (default: 100) */
  promptMinLength?: number;
  /** Maximum character length for the prompt field (default: 5000) */
  promptMaxLength?: number;
  /** Storybook/testing: start at a specific step (1 or 2) */
  initialStep?: 1 | 2;
  /** Storybook/testing: start on a specific tab when initialStep=2 */
  initialTab?: FunctionTabType;
  className?: string;
}

export interface IvrBotConfigData {
  botName: string;
  primaryRole: string;
  tone: string[];
  voice: string;
  language: string;
  systemPrompt: string;
  agentBusyPrompt: string;
  noExtensionPrompt: string;
  knowledgeBaseFiles: KnowledgeBaseFile[];
  functions: FunctionItem[];
  frustrationHandoverEnabled: boolean;
  escalationDepartment: string;
  silenceTimeout: number;
  callEndThreshold: number;
  interruptionHandling: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface IvrBotConfigProps {
  botTitle?: string;
  botType?: string;
  /** When true, disables all fields in all card components (view mode) */
  disabled?: boolean;
  /** Optional "Last updated at HH:MM AM/PM" text shown in the page header */
  lastUpdatedAt?: string;
  initialData?: Partial<IvrBotConfigData>;
  onSaveAsDraft?: (data: IvrBotConfigData) => void;
  onPublish?: (data: IvrBotConfigData) => void;
  onSaveKnowledgeFiles?: (files: File[]) => void;
  /** Called for each file during upload with progress/error handlers. If omitted, uses fake progress. */
  onUploadKnowledgeFile?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSampleFileDownload?: () => void;
  onDownloadKnowledgeFile?: (fileId: string) => void;
  onDeleteKnowledgeFile?: (fileId: string) => void;
  onCreateFunction?: (data: CreateFunctionData) => void;
  /** Called when user edits a custom function. Receives the function id. */
  onEditFunction?: (id: string) => void;
  /** Called when user deletes a custom function */
  onDeleteFunction?: (id: string) => void;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  /** Hover text for the info icon in the Functions card header */
  functionsInfoTooltip?: string;
  /** Hover text for the info icon in the Knowledge Base card header */
  knowledgeBaseInfoTooltip?: string;
  /** Minimum character length for the function prompt (default: 100) */
  functionPromptMinLength?: number;
  /** Maximum character length for the function prompt (default: 5000) */
  functionPromptMaxLength?: number;
  /**
   * Pre-filled data shown when the edit function modal opens.
   * Pass when your app fetches full function data after onEditFunction fires.
   */
  functionEditData?: Partial<CreateFunctionData>;
  /** Max character length for the "How It Behaves" system prompt (default: 25000) */
  systemPromptMaxLength?: number;
  onBack?: () => void;
  /** Called when the play icon is clicked on a voice option */
  onPlayVoice?: (voiceValue: string) => void;
  /** Called when the pause icon is clicked on a playing voice */
  onPauseVoice?: (voiceValue: string) => void;
  /** The voice value currently being played */
  playingVoice?: string;
  /** Override available role options for BotIdentityCard */
  roleOptions?: SelectOption[];
  /** Override available tone options for BotIdentityCard */
  toneOptions?: SelectOption[];
  /** Override available voice options for BotIdentityCard */
  voiceOptions?: SelectOption[];
  /** Override available language options for BotIdentityCard */
  languageOptions?: SelectOption[];
  /** Override session variable chips for BotBehaviorCard */
  sessionVariables?: string[];
  /** Override escalation department options for FrustrationHandoverCard */
  escalationDepartmentOptions?: SelectOption[];
  /** Override silence timeout bounds */
  silenceTimeoutMin?: number;
  silenceTimeoutMax?: number;
  /** Override call end threshold bounds */
  callEndThresholdMin?: number;
  callEndThresholdMax?: number;
  className?: string;
}

// ─── File Upload Modal (re-exported from shared module) ─────────────────────

export type {
  UploadStatus,
  UploadItem,
  UploadProgressHandlers,
  FileUploadModalProps,
} from "../file-upload-modal";
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { BotIdentityCard } from "./bot-identity-card";
export { BotBehaviorCard } from "./bot-behavior-card";
export { KnowledgeBaseCard } from "./knowledge-base-card";
export { FunctionsCard } from "./functions-card";
export { FrustrationHandoverCard } from "./frustration-handover-card";
export { AdvancedSettingsCard } from "./advanced-settings-card";
export { FallbackPromptsCard } from "./fallback-prompts-card";
export type {
  FallbackPromptsData,
  FallbackPromptsCardProps,
} from "./fallback-prompts-card";
export { BOT_KNOWLEDGE_STATUS } from "./types";
export { CreateFunctionModal } from "./create-function-modal";
export { FileUploadModal } from "../file-upload-modal";
export { IvrBotConfig } from "./ivr-bot-config";

export type {
  FileUploadModalProps,
  UploadProgressHandlers,
  UploadItem,
  UploadStatus,
  CreateFunctionModalProps,
  IvrBotConfigProps,
  IvrBotConfigData,
  CreateFunctionData,
  CreateFunctionStep1Data,
  CreateFunctionStep2Data,
  FunctionItem,
  KnowledgeBaseFile,
  KnowledgeFileStatus,
  KeyValuePair,
  HttpMethod,
  FunctionTabType,
  SelectOption,
} from "./types";
`, prefix),
        }
      ],
    },
    "wallet-topup": {
      name: "wallet-topup",
      description: "A component for wallet top-up with amount selection and coupon support",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "accordion",
            "button",
            "input"
      ],
      isMultiFile: true,
      directory: "wallet-topup",
      mainFile: "wallet-topup.tsx",
      files: [
        {
          name: "wallet-topup.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Ticket } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import type { AmountOption, WalletTopupProps } from "./types";

/**
 * Normalize amount option to a consistent format
 */
function normalizeAmountOption(option: number | AmountOption): AmountOption {
  return typeof option === "number" ? { value: option } : option;
}

/**
 * Format currency amount with symbol
 */
function formatCurrency(amount: number, symbol: string = "₹"): string {
  const hasDecimals = amount % 1 !== 0;
  return \`\${symbol}\${amount.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}\`;
}

/**
 * WalletTopup provides a collapsible panel for wallet recharge with
 * preset amount selection, custom amount input, voucher link, and payment CTA.
 *
 * @example
 * \`\`\`tsx
 * <WalletTopup
 *   icon={<CreditCard className="size-5 text-semantic-primary" />}
 *   amounts={[500, 1000, 5000, 10000]}
 *   onPay={(amount) => console.log("Pay", amount)}
 * />
 * \`\`\`
 */
export const WalletTopup = React.forwardRef<HTMLDivElement, WalletTopupProps>(
  (
    {
      title = "Instant wallet top-up",
      description = "Add funds to your account balance",
      icon,
      amounts = [500, 1000, 5000, 10000],
      selectedAmount: controlledAmount,
      defaultSelectedAmount,
      onAmountChange,
      amountSectionLabel = "Select Amount",
      customAmount: controlledCustomAmount,
      onCustomAmountChange,
      customAmountPlaceholder = "Enter amount",
      customAmountLabel = "Custom Amount",
      currencySymbol = "₹",
      taxAmount: taxAmountProp,
      taxCalculator,
      taxLabel = "Taxes (GST)",
      taxes,
      rechargeAmountLabel = "Recharge amount",
      outstandingAmount,
      outstandingLabel = "Outstanding",
      topupLabel = "Top-up",
      showVoucherLink = true,
      voucherLinkText = "Have an offline code or voucher?",
      voucherIcon = <Ticket className="size-4" />,
      onVoucherClick,
      showVoucherInput: controlledShowVoucherInput,
      onShowVoucherInputChange,
      voucherCode: controlledVoucherCode,
      onVoucherCodeChange,
      voucherCodePlaceholder = "XXXX-XXXX-XXXX",
      voucherCodeLabel = "Enter Offline Code",
      voucherCancelText = "Cancel",
      voucherCodePattern,
      validateVoucherCode,
      redeemText = "Redeem voucher",
      onRedeem,
      ctaText,
      onPay,
      loading = false,
      disabled = false,
      defaultOpen = true,
      open,
      onOpenChange,
      className,
    },
    ref
  ) => {
    const isOpenControlled = open !== undefined;

    // Controlled/uncontrolled amount selection
    const isControlled = controlledAmount !== undefined;
    const [internalAmount, setInternalAmount] = React.useState<number | null>(
      defaultSelectedAmount ?? null
    );
    const selectedValue = isControlled ? controlledAmount : internalAmount;

    // Custom amount state
    const isCustomControlled = controlledCustomAmount !== undefined;
    const [internalCustom, setInternalCustom] = React.useState("");
    const customValue = isCustomControlled
      ? controlledCustomAmount
      : internalCustom;

    // Voucher input visibility (controlled/uncontrolled)
    const isVoucherInputControlled = controlledShowVoucherInput !== undefined;
    const [internalShowVoucherInput, setInternalShowVoucherInput] =
      React.useState(false);
    const showVoucherInput = isVoucherInputControlled
      ? controlledShowVoucherInput
      : internalShowVoucherInput;

    // Voucher code input state
    const isVoucherCodeControlled = controlledVoucherCode !== undefined;
    const [internalVoucherCode, setInternalVoucherCode] = React.useState("");
    const voucherCodeValue = isVoucherCodeControlled
      ? controlledVoucherCode
      : internalVoucherCode;

    const handleVoucherLinkClick = () => {
      if (!isVoucherInputControlled) {
        setInternalShowVoucherInput(true);
      }
      onShowVoucherInputChange?.(true);
      onVoucherClick?.();
    };

    const handleVoucherCancel = () => {
      if (!isVoucherInputControlled) {
        setInternalShowVoucherInput(false);
      }
      onShowVoucherInputChange?.(false);
      if (!isVoucherCodeControlled) {
        setInternalVoucherCode("");
      }
      onVoucherCodeChange?.("");
    };

    const handleVoucherCodeChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      if (!isVoucherCodeControlled) {
        setInternalVoucherCode(value);
      }
      onVoucherCodeChange?.(value);
    };

    const isVoucherCodeValid = React.useMemo(() => {
      if (!voucherCodeValue) return false;
      if (validateVoucherCode) return validateVoucherCode(voucherCodeValue);
      if (voucherCodePattern) return voucherCodePattern.test(voucherCodeValue);
      return true;
    }, [voucherCodeValue, validateVoucherCode, voucherCodePattern]);

    const handleRedeem = () => {
      if (isVoucherCodeValid) {
        onRedeem?.(voucherCodeValue);
      }
    };

    const normalizedAmounts = amounts.map(normalizeAmountOption);
    const displayAmounts =
      outstandingAmount && outstandingAmount > 0
        ? [{ value: 0 } as AmountOption, ...normalizedAmounts]
        : normalizedAmounts;

    const handleAmountSelect = (value: number) => {
      const newValue = selectedValue === value ? null : value;
      if (!isControlled) {
        setInternalAmount(newValue);
      }
      // Clear custom amount when preset is selected
      if (!isCustomControlled && newValue !== null) {
        setInternalCustom("");
      }
      onAmountChange?.(newValue);
    };

    const handleCustomAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      if (!isCustomControlled) {
        setInternalCustom(value);
      }
      // Clear preset selection when custom amount is entered
      if (value && !isControlled) {
        setInternalAmount(null);
      }
      if (value) {
        onAmountChange?.(null);
      }
      onCustomAmountChange?.(value);
    };

    // Determine the effective pay amount
    const baseSelection =
      selectedValue ?? (customValue ? Number(customValue) : null);

    // Effective recharge amount (includes outstanding if present)
    const effectiveRechargeAmount =
      baseSelection !== null
        ? outstandingAmount
          ? outstandingAmount + baseSelection
          : baseSelection
        : 0;

    // Tax computation — multi-line takes priority over legacy single-line props
    const hasTax =
      taxes !== undefined ||
      taxCalculator !== undefined ||
      taxAmountProp !== undefined;

    // Resolve each tax line's computed value (multi-line takes priority over legacy single-line)
    const resolvedTaxLines =
      effectiveRechargeAmount <= 0
        ? []
        : taxes
          ? taxes.map((line) => ({
              label: line.label,
              value: line.calculator
                ? line.calculator(effectiveRechargeAmount)
                : (line.amount ?? 0),
            }))
          : taxCalculator !== undefined || taxAmountProp !== undefined
            ? [
                {
                  label: taxLabel,
                  value: taxCalculator
                    ? taxCalculator(effectiveRechargeAmount)
                    : (taxAmountProp ?? 0),
                },
              ]
            : [];

    const computedTax = resolvedTaxLines.reduce((sum, l) => sum + l.value, 0);

    // Total payable (recharge + all taxes)
    const totalPayable = effectiveRechargeAmount + computedTax;

    const handlePay = () => {
      if (totalPayable > 0) {
        onPay?.(totalPayable);
      }
    };

    const buttonText =
      ctaText ||
      (totalPayable > 0
        ? \`Pay \${formatCurrency(totalPayable, currencySymbol)} now\`
        : "Select an amount");

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          {...(isOpenControlled
            ? {
                value: open ? ["wallet-topup"] : [],
                onValueChange: (val) => onOpenChange?.(val.length > 0),
              }
            : { defaultValue: defaultOpen ? ["wallet-topup"] : [] })}
        >
          <AccordionItem value="wallet-topup">
            <AccordionTrigger className="px-4 py-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex items-center justify-center size-10 rounded-[10px] bg-[var(--semantic-info-surface)] shrink-0">
                    {icon}
                  </div>
                )}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.01px]">
                    {title}
                  </span>
                  <span className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {description}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-6 border-t border-semantic-border-layout pt-4">
                {/* Amount Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {amountSectionLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {displayAmounts.map((option) => {
                      const isSelected = selectedValue === option.value;
                      const hasOutstanding =
                        outstandingAmount !== undefined &&
                        outstandingAmount > 0;
                      const totalForOption = hasOutstanding
                        ? outstandingAmount + option.value
                        : option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleAmountSelect(option.value)}
                          className={cn(
                            "flex px-4 rounded text-sm transition-all cursor-pointer",
                            hasOutstanding
                              ? "flex-col items-start gap-0.5 h-auto py-3"
                              : "items-center h-10 py-2.5",
                            isSelected
                              ? "border border-[var(--semantic-brand)] shadow-sm"
                              : "border border-semantic-border-input hover:border-semantic-text-muted"
                          )}
                        >
                          <span
                            className={cn(
                              isSelected
                                ? "text-semantic-primary"
                                : "text-semantic-text-primary",
                              hasOutstanding && "font-medium"
                            )}
                          >
                            {hasOutstanding
                              ? formatCurrency(
                                  totalForOption,
                                  currencySymbol
                                )
                              : option.label ||
                                formatCurrency(
                                  option.value,
                                  currencySymbol
                                )}
                          </span>
                          {hasOutstanding && (
                            <>
                              <span className="text-xs text-semantic-text-muted">
                                {outstandingLabel}:{" "}
                                {formatCurrency(
                                  outstandingAmount,
                                  currencySymbol
                                )}
                              </span>
                              <span className="text-xs text-semantic-text-muted">
                                {topupLabel}:{" "}
                                {option.value > 0
                                  ? formatCurrency(
                                      option.value,
                                      currencySymbol
                                    )
                                  : "-"}
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {customAmountLabel}
                  </label>
                  <Input
                    type="number"
                    placeholder={customAmountPlaceholder}
                    value={customValue}
                    onChange={handleCustomAmountChange}
                  />
                </div>

                {/* Recharge Summary */}
                {hasTax && effectiveRechargeAmount > 0 && (
                  <div className="flex flex-col gap-2 rounded-lg bg-semantic-info-surface-subtle border border-semantic-info-surface px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-semantic-text-primary">
                        {rechargeAmountLabel}
                      </span>
                      <span className="text-semantic-text-primary font-medium">
                        {formatCurrency(
                          effectiveRechargeAmount,
                          currencySymbol
                        )}
                      </span>
                    </div>
                    {resolvedTaxLines.map((line) => (
                      <div
                        key={line.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-semantic-text-muted">
                          {line.label}
                        </span>
                        <span className="text-semantic-text-muted">
                          {formatCurrency(line.value, currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Voucher Link or Voucher Code Input */}
                {showVoucherLink && !showVoucherInput && (
                  <button
                    type="button"
                    onClick={handleVoucherLinkClick}
                    className="flex items-center gap-2 text-sm text-semantic-text-link tracking-[0.035px] hover:underline w-fit"
                  >
                    {voucherIcon}
                    <span>{voucherLinkText}</span>
                  </button>
                )}

                {showVoucherInput && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                        {voucherCodeLabel}
                      </label>
                      <button
                        type="button"
                        onClick={handleVoucherCancel}
                        className="text-xs text-semantic-text-link tracking-[0.048px] hover:underline"
                      >
                        {voucherCancelText}
                      </button>
                    </div>
                    <Input
                      placeholder={voucherCodePlaceholder}
                      value={voucherCodeValue}
                      onChange={handleVoucherCodeChange}
                    />
                  </div>
                )}

                {/* CTA Button */}
                {showVoucherInput ? (
                  <Button
                    variant="default"
                    className="w-full bg-[var(--semantic-success-primary)] hover:bg-[var(--semantic-success-hover)]"
                    onClick={handleRedeem}
                    loading={loading}
                    disabled={disabled || !isVoucherCodeValid}
                  >
                    {redeemText}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handlePay}
                    loading={loading}
                    disabled={disabled || totalPayable <= 0}
                  >
                    {buttonText}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

WalletTopup.displayName = "WalletTopup";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

/**
 * Represents a preset amount option in the selector grid
 */
export interface AmountOption {
  /** The numeric value of the amount */
  value: number;
  /** Optional custom display label (defaults to formatted currency) */
  label?: string;
}

/**
 * A single tax line entry for the recharge summary
 */
export interface TaxLine {
  /** Display label for this tax (e.g. "CGST (9%)", "IGST (18%)") */
  label: string;
  /** Static tax amount */
  amount?: number;
  /** Dynamic calculator — receives the recharge amount and returns the tax */
  calculator?: (amount: number) => number;
}

/**
 * Props for the WalletTopup component
 */
export interface WalletTopupProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Description displayed below the title */
  description?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Amount selection
  /** Preset amount options to display in the grid */
  amounts?: number[] | AmountOption[];
  /** Currently selected amount (controlled) */
  selectedAmount?: number | null;
  /** Default selected amount (uncontrolled) */
  defaultSelectedAmount?: number;
  /** Callback when amount selection changes */
  onAmountChange?: (amount: number | null) => void;
  /** Label for the amount selection section */
  amountSectionLabel?: string;

  // Custom amount
  /** Custom amount input value (controlled) */
  customAmount?: string;
  /** Callback when custom amount input changes */
  onCustomAmountChange?: (value: string) => void;
  /** Placeholder text for custom amount input */
  customAmountPlaceholder?: string;
  /** Label for the custom amount field */
  customAmountLabel?: string;

  // Currency
  /** Currency symbol (default: "₹") */
  currencySymbol?: string;

  // Tax / Summary
  /** Static tax amount to display in the summary section (single-line, kept for backwards compat) */
  taxAmount?: number;
  /** Function to dynamically compute tax from the recharge amount (single-line, kept for backwards compat). Takes priority over taxAmount. */
  taxCalculator?: (amount: number) => number;
  /** Label for the single tax line (default: "Taxes (GST)") */
  taxLabel?: string;
  /**
   * Multiple tax lines for the summary (e.g. CGST + IGST).
   * When provided, takes priority over taxAmount/taxCalculator/taxLabel.
   * Each line can have a static amount or a dynamic calculator.
   */
  taxes?: TaxLine[];
  /** Label for the recharge amount line in the summary (default: "Recharge amount") */
  rechargeAmountLabel?: string;

  // Outstanding balance
  /** Outstanding balance. When set, auto-prepends an outstanding-only option and shows breakdowns in each amount button. */
  outstandingAmount?: number;
  /** Label for the outstanding breakdown in amount buttons (default: "Outstanding") */
  outstandingLabel?: string;
  /** Label for the topup breakdown in amount buttons (default: "Top-up") */
  topupLabel?: string;

  // Voucher link
  /** Whether to show the voucher/code link */
  showVoucherLink?: boolean;
  /** Custom text for the voucher link */
  voucherLinkText?: string;
  /** Icon for the voucher link */
  voucherIcon?: React.ReactNode;
  /** Callback when voucher link is clicked (also toggles inline code input) */
  onVoucherClick?: () => void;

  // Voucher input visibility
  /** Whether the voucher input is visible (controlled). When provided, the component won't toggle visibility internally. */
  showVoucherInput?: boolean;
  /** Callback when voucher input visibility changes (from link click or cancel) */
  onShowVoucherInputChange?: (show: boolean) => void;

  // Voucher code input
  /** Voucher code value (controlled) */
  voucherCode?: string;
  /** Callback when voucher code changes */
  onVoucherCodeChange?: (code: string) => void;
  /** Placeholder for voucher code input */
  voucherCodePlaceholder?: string;
  /** Label for voucher code input */
  voucherCodeLabel?: string;
  /** Text for cancel link in voucher mode */
  voucherCancelText?: string;
  /** Regex pattern the voucher code must match to enable redeem (e.g. /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/) */
  voucherCodePattern?: RegExp;
  /** Custom validator function — return true if code is valid. Takes priority over voucherCodePattern. */
  validateVoucherCode?: (code: string) => boolean;
  /** Text for the redeem button */
  redeemText?: string;
  /** Callback when redeem voucher is clicked */
  onRedeem?: (code: string) => void;

  // CTA
  /** Text for the pay button (defaults to "Pay {amount} now") */
  ctaText?: string;
  /** Callback when pay button is clicked */
  onPay?: (amount: number) => void;
  /** Whether the pay button shows loading state */
  loading?: boolean;
  /** Whether the pay button is disabled */
  disabled?: boolean;

  // Accordion
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;
  /** Controlled open state — use with onOpenChange for exclusive accordion behavior */
  open?: boolean;
  /** Callback fired when the panel is toggled — receives new open state */
  onOpenChange?: (open: boolean) => void;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { WalletTopup } from "./wallet-topup";
export type { WalletTopupProps, AmountOption } from "./types";
`, prefix),
        }
      ],
    }
  }
}
