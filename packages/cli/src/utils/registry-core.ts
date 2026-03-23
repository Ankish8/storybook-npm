// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: core

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
    // Skip nested cn() calls that fall inside an already-processed outer cn()
    if (cnMatch.index < lastIndex) continue

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
  const singleWordUtilities = /^(flex|inline-flex|grid|inline-grid|block|inline-block|inline-table|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky|isolate|isolation-auto|overflow-auto|overflow-hidden|overflow-clip|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overscroll-auto|overscroll-contain|overscroll-none|truncate|antialiased|subpixel-antialiased|italic|not-italic|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|sr-only|not-sr-only|resize|resize-none|resize-x|resize-y|snap-start|snap-end|snap-center|snap-align-none|snap-normal|snap-always|touch-auto|touch-none|touch-pan-x|touch-pan-left|touch-pan-right|touch-pan-y|touch-pan-up|touch-pan-down|touch-pinch-zoom|touch-manipulation|select-none|select-text|select-all|select-auto|will-change-auto|will-change-scroll|will-change-contents|will-change-transform|grow|grow-0|shrink|shrink-0|transform|transform-cpu|transform-gpu|transform-none|transition|transition-none|transition-all|transition-colors|transition-opacity|transition-shadow|transition-transform|animate-none|animate-spin|animate-ping|animate-pulse|animate-bounce)$/
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

// Regex to detect border-WIDTH classes (border, border-2, border-t, border-b-4, border-[3px], etc.)
const BORDER_WIDTH_RE = /^border(-[trblxy])?(-[0248]|-\[.+\])?$/
// Regex to detect border-STYLE classes
const BORDER_STYLE_RE = /^border-(solid|dashed|dotted|double|hidden|none)$/

// Helper to prefix a single class string
function prefixClassString(classString: string, prefix: string): string {
  const prefixed = classString
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

  // Auto-inject border-solid when border-width classes are present without an explicit border-style.
  // Without Tailwind Preflight, the host app may not set border-style: solid on *, so
  // border-width alone (e.g. tw-border) would render nothing. Adding tw-border-solid makes
  // the border visible regardless of the host CSS environment.
  const origClasses = classString.split(' ')
  const hasBorderWidth = origClasses.some((c: string) => BORDER_WIDTH_RE.test(c))
  const hasBorderStyle = origClasses.some((c: string) => BORDER_STYLE_RE.test(c))
  if (hasBorderWidth && !hasBorderStyle) {
    prefixed.push(`${prefix}border-solid`)
  }

  return prefixed.join(' ')
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
    // Skip nested cn() calls that fall inside an already-processed outer cn()
    if (cnMatch.index < lastIndex) continue

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

  // Skip keys that are definitely not class values (HTML attributes + CSS style properties)
  // IMPORTANT: Only include camelCase CSS properties that CANNOT be CVA variant names.
  // Do NOT add simple words like: border, outline, color, flex, fill, stroke, display,
  // position, background, top, left, right, bottom, gap, transform, transition, animation,
  // cursor, opacity, visibility — these overlap with common CVA variant keys.
  const nonClassKeys = [
    // HTML attributes
    'name', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy', 'description', 'title', 'content', 'header', 'footer', 'caption', 'summary', 'tooltip', 'errorMessage', 'successMessage', 'warningMessage', 'infoMessage', 'hint',
    // CSS style properties (camelCase — safe because they can't be CVA variant keys)
    'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'letterSpacing',
    'backgroundColor', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius',
    'zIndex', 'overflow', 'overflowX', 'overflowY', 'userSelect',
    'transitionDuration', 'transitionProperty',
    'boxShadow', 'textShadow', 'outlineOffset',
    'rowGap', 'columnGap', 'gridTemplateColumns', 'gridTemplateRows',
    'flexBasis', 'flexGrow', 'flexShrink', 'flexDirection', 'flexWrap',
    'alignItems', 'alignSelf', 'justifyContent', 'justifyItems',
    'textAlign', 'textDecoration', 'textTransform', 'whiteSpace', 'wordBreak', 'wordSpacing',
    'aspectRatio', 'scrollbarWidth', 'scrollBehavior',
    'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'strokeWidth', 'strokeDasharray', 'strokeDashoffset',
  ]

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

  // 6. Handle className={...} JSX expression bindings
  // Covers template literals, ternaries, and any other expression patterns
  // e.g., className={`flex ${active ? "bg-primary" : "bg-gray"}`}
  // e.g., className={active ? "border-b-2" : "text-muted"}
  {
    let jsxResult = ''
    let jsxLastIndex = 0
    const jsxRegex = /className\s*=\s*\{/g
    let jsxMatch

    while ((jsxMatch = jsxRegex.exec(content)) !== null) {
      if (jsxMatch.index < jsxLastIndex) continue

      jsxResult += content.slice(jsxLastIndex, jsxMatch.index)

      // Find the matching closing } by tracking brace depth
      const bracePos = jsxMatch.index + jsxMatch[0].length - 1
      let depth = 1
      let pos = bracePos + 1

      while (pos < content.length && depth > 0) {
        const ch = content[pos]
        if (ch === '{') { depth++; pos++; continue }
        if (ch === '}') { depth--; if (depth === 0) { pos++; break } pos++; continue }
        if (ch === '"') {
          pos++
          while (pos < content.length && content[pos] !== '"') { if (content[pos] === '\\') pos++; pos++ }
          pos++; continue
        }
        if (ch === "'") {
          pos++
          while (pos < content.length && content[pos] !== "'") { if (content[pos] === '\\') pos++; pos++ }
          pos++; continue
        }
        if (ch === '`') {
          pos++
          let tDepth = 0
          while (pos < content.length) {
            if (content[pos] === '\\') { pos += 2; continue }
            if (content[pos] === '`' && tDepth === 0) { pos++; break }
            if (content[pos] === '$' && content[pos + 1] === '{') { tDepth++; pos += 2; continue }
            if (content[pos] === '}' && tDepth > 0) { tDepth--; pos++; continue }
            pos++
          }
          continue
        }
        pos++
      }

      // Extract expression between { and }
      const expr = content.slice(bracePos + 1, pos - 1)

      // Skip expressions already handled by earlier patterns (cn, cva, etc.)
      const exprTrimmed = expr.trimStart()
      if (/^(cn|cva)\s*\(/.test(exprTrimmed)) {
        jsxResult += content.slice(jsxMatch.index, pos)
        jsxLastIndex = pos
        continue
      }

      // Prefix the expression using the className expression handler
      const prefixedExpr = prefixClassNameExpression(expr, prefix)

      jsxResult += jsxMatch[0] + prefixedExpr + '}'
      jsxLastIndex = pos
    }
    jsxResult += content.slice(jsxLastIndex)
    content = jsxResult
  }

  return content
}

function isAlreadyPrefixed(classString: string, prefix: string): boolean {
  if (!classString.trim()) return false
  return classString.trim().split(/\s+/).every(c => {
    // Strip variant prefixes (hover:, focus:, etc.) to get the utility part
    const lastColon = c.lastIndexOf(':')
    const utility = lastColon >= 0 ? c.slice(lastColon + 1) : c
    return utility.startsWith(prefix) || utility.startsWith(`-${prefix}`) ||
           utility.startsWith(`!${prefix}`) || utility.startsWith(`!-${prefix}`)
  })
}

function prefixStaticTemplatePart(text: string, prefix: string): string {
  const trimmed = text.trim()
  if (!trimmed || !looksLikeTailwindClasses(trimmed)) return text
  const leading = text.match(/^(\s*)/)?.[1] || ''
  const trailing = text.match(/(\s*)$/)?.[1] || ''
  return leading + prefixClassString(trimmed, prefix) + trailing
}

function prefixStringLiteralsInExpr(code: string, prefix: string): string {
  let result = code.replace(/"([^"]*)"/g, (m: string, classes: string) => {
    if (!classes.trim() || !looksLikeTailwindClasses(classes) || isAlreadyPrefixed(classes, prefix)) return m
    return `"${prefixClassString(classes, prefix)}"`
  })
  result = result.replace(/'([^']*)'/g, (m: string, classes: string) => {
    if (!classes.trim() || !looksLikeTailwindClasses(classes) || isAlreadyPrefixed(classes, prefix)) return m
    return `'${prefixClassString(classes, prefix)}'`
  })
  return result
}

function prefixClassNameExpression(expr: string, prefix: string): string {
  let result = ''
  let i = 0

  while (i < expr.length) {
    if (expr[i] === '`') {
      // Template literal — process static parts and string literals in expressions
      result += '`'
      i++ // past opening backtick
      let staticText = ''

      while (i < expr.length && expr[i] !== '`') {
        if (expr[i] === '\\') {
          staticText += expr[i] + (expr[i + 1] || '')
          i += 2
          continue
        }
        if (expr[i] === '$' && i + 1 < expr.length && expr[i + 1] === '{') {
          // Flush and prefix the static text accumulated so far
          if (staticText) {
            result += prefixStaticTemplatePart(staticText, prefix)
            staticText = ''
          }
          // Collect the expression content inside ${...}
          result += '${'
          i += 2 // past ${
          let exprDepth = 1
          let exprContent = ''
          while (i < expr.length && exprDepth > 0) {
            // Skip strings inside the expression to avoid brace-counting issues
            if (expr[i] === '"') {
              exprContent += expr[i]; i++
              while (i < expr.length && expr[i] !== '"') {
                if (expr[i] === '\\') { exprContent += expr[i]; i++ }
                exprContent += expr[i]; i++
              }
              if (i < expr.length) { exprContent += expr[i]; i++ }
              continue
            }
            if (expr[i] === "'") {
              exprContent += expr[i]; i++
              while (i < expr.length && expr[i] !== "'") {
                if (expr[i] === '\\') { exprContent += expr[i]; i++ }
                exprContent += expr[i]; i++
              }
              if (i < expr.length) { exprContent += expr[i]; i++ }
              continue
            }
            if (expr[i] === '`') {
              // Nested template literal — skip as-is
              exprContent += expr[i]; i++
              let nestedDepth = 0
              while (i < expr.length) {
                if (expr[i] === '\\') { exprContent += expr[i]; i++; if (i < expr.length) { exprContent += expr[i]; i++ }; continue }
                if (expr[i] === '`' && nestedDepth === 0) { exprContent += expr[i]; i++; break }
                if (expr[i] === '$' && i + 1 < expr.length && expr[i + 1] === '{') { nestedDepth++; exprContent += '${'; i += 2; continue }
                if (expr[i] === '}' && nestedDepth > 0) { nestedDepth-- }
                exprContent += expr[i]; i++
              }
              continue
            }
            if (expr[i] === '{') exprDepth++
            else if (expr[i] === '}') { exprDepth--; if (exprDepth === 0) { i++; break } }
            exprContent += expr[i]
            i++
          }
          // Prefix string literals within the expression
          result += prefixStringLiteralsInExpr(exprContent, prefix) + '}'
          continue
        }
        staticText += expr[i]
        i++
      }
      // Flush remaining static text
      if (staticText) {
        result += prefixStaticTemplatePart(staticText, prefix)
      }
      if (i < expr.length && expr[i] === '`') {
        result += '`'
        i++ // past closing backtick
      }
    } else if (expr[i] === '"' || expr[i] === "'") {
      // Bare string literal — prefix if it looks like Tailwind classes
      const quote = expr[i]
      const strStart = i
      i++ // past opening quote
      let str = ''
      while (i < expr.length && expr[i] !== quote) {
        if (expr[i] === '\\') { str += expr[i] + (expr[i + 1] || ''); i += 2; continue }
        str += expr[i]
        i++
      }
      if (i < expr.length) i++ // past closing quote

      if (str.trim() && looksLikeTailwindClasses(str) && !isAlreadyPrefixed(str, prefix)) {
        result += quote + prefixClassString(str, prefix) + quote
      } else {
        result += expr.slice(strStart, i)
      }
    } else {
      result += expr[i]
      i++
    }
  }

  return result
}

export function getCoreRegistry(prefix: string = ''): Registry {
  return {
    "avatar": {
      name: "avatar",
      description: "A versatile avatar component displaying user initials or images with size variants and optional online status indicator",
      category: "core",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "avatar.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Extracts initials from a name string.
 * For two+ words, takes first letter of first and last word.
 * For single words, takes first two characters.
 *
 * @example
 * getInitials("Ankish Sachdeva") // "AS"
 * getInitials("John") // "JO"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        soft: "bg-semantic-bg-grey text-semantic-text-muted",
        filled: "bg-semantic-primary text-semantic-text-inverted",
      },
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const statusDotSizeMap = {
  xs: "size-2 border",
  sm: "size-2.5 border-[1.5px]",
  md: "size-3 border-2",
  lg: "size-3.5 border-2",
  xl: "size-4 border-2",
} as const;

const statusColorMap = {
  online: "bg-semantic-success-primary",
  offline: "bg-semantic-bg-grey",
  busy: "bg-semantic-error-primary",
  away: "bg-semantic-warning-primary",
} as const;

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Name used to auto-generate initials and aria-label */
  name?: string;
  /** Image URL — renders an <img> instead of initials */
  src?: string;
  /** Alt text for the image (defaults to name) */
  alt?: string;
  /** Override auto-generated initials (e.g., "AS") */
  initials?: string;
  /** Status indicator dot shown at bottom-right */
  status?: "online" | "offline" | "busy" | "away";
}

/**
 * Avatar component for displaying user identity via image or initials.
 *
 * @example
 * \`\`\`tsx
 * <Avatar name="Ankish Sachdeva" />
 * <Avatar name="John Doe" size="lg" variant="filled" />
 * <Avatar src="/photo.jpg" alt="Profile" status="online" />
 * <Avatar initials="AS" size="xs" />
 * \`\`\`
 */
const Avatar = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      name,
      src,
      alt,
      initials,
      status,
      children,
      ...props
    }: AvatarProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const resolvedSize = size ?? "md";
    const displayInitials = initials ?? (name ? getInitials(name) : undefined);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, className }))}
        aria-label={name}
        role="img"
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? name ?? "Avatar"}
            className="size-full object-cover"
          />
        ) : children ? (
          children
        ) : displayInitials ? (
          <span aria-hidden="true">{displayInitials}</span>
        ) : null}

        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-background",
              statusDotSizeMap[resolvedSize],
              statusColorMap[status]
            )}
            data-status={status}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants, getInitials };
`, prefix),
        },
      ],
    },
    "date-divider": {
      name: "date-divider",
      description: "A horizontal line with centered date text for separating chat messages by date",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "date-divider.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * DateDivider component for separating chat messages by date.
 * Renders a horizontal line with centered date text.
 *
 * @example
 * \`\`\`tsx
 * <DateDivider>Today</DateDivider>
 * <DateDivider>March 20, 2026</DateDivider>
 * \`\`\`
 */
export interface DateDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The date text to display. Can be a string like "Today", "March 20, 2026", etc. */
  children: React.ReactNode;
}

const DateDivider = React.forwardRef(
  ({ className, children, ...props }: DateDividerProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 my-4", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-semantic-border-layout" />
      <span className="text-xs text-semantic-text-muted shrink-0">
        {children}
      </span>
      <div className="flex-1 h-px bg-semantic-border-layout" />
    </div>
  )
);
DateDivider.displayName = "DateDivider";

export { DateDivider };
`, prefix),
        },
      ],
    },
    "image-media": {
      name: "image-media",
      description: "An image display component for chat messages with rounded corners and configurable max height",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "image-media.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * ImageMedia component for displaying images in chat messages.
 *
 * @example
 * \`\`\`tsx
 * <ImageMedia src="https://example.com/photo.jpg" />
 * <ImageMedia src="https://example.com/photo.jpg" alt="A sunset" />
 * <ImageMedia src="https://example.com/photo.jpg" maxHeight={400} />
 * <ImageMedia src="https://example.com/photo.jpg" maxHeight="50vh" />
 * \`\`\`
 */
export interface ImageMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** Maximum height of the image. Defaults to 280px */
  maxHeight?: number | string;
}

const ImageMedia = React.forwardRef(
  ({ className, src, alt = "Image", maxHeight = 280, ...props }: ImageMediaProps, ref: React.Ref<HTMLDivElement>) => {
    const maxHeightStyle =
      typeof maxHeight === "number" ? \`\${maxHeight}px\` : maxHeight;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-t object-cover"
          style={{ maxHeight: maxHeightStyle }}
        />
      </div>
    );
  }
);
ImageMedia.displayName = "ImageMedia";

export { ImageMedia };
`, prefix),
        },
      ],
    },
    "phone-input": {
      name: "phone-input",
      description: "A phone number input with country code prefix, flag emoji, and optional country selector",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "phone-input.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * A phone number input with a country code prefix area.
 *
 * @example
 * \`\`\`tsx
 * <PhoneInput placeholder="Enter phone number" />
 * <PhoneInput countryFlag="🇺🇸" countryCode="+1" />
 * <PhoneInput onCountryClick={() => openCountryPicker()} />
 * \`\`\`
 */
export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Country flag emoji (e.g., "🇮🇳", "🇺🇸"). Defaults to "🇮🇳" */
  countryFlag?: string;
  /** Country dial code (e.g., "+91", "+1"). Defaults to "+91" */
  countryCode?: string;
  /** Whether to show the chevron dropdown indicator. Defaults to true */
  showChevron?: boolean;
  /** Handler called when the country code area is clicked */
  onCountryClick?: () => void;
  /** Additional className for the outer wrapper */
  wrapperClassName?: string;
}

const PhoneInput = React.forwardRef(
  (
    {
      className,
      countryFlag = "🇮🇳",
      countryCode = "+91",
      showChevron = true,
      onCountryClick,
      wrapperClassName,
      disabled,
      ...props
    }: PhoneInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div
        className={cn(
          "flex items-center border border-semantic-border-layout rounded-lg focus-within:border-semantic-border-focus transition-colors",
          disabled && "opacity-60",
          wrapperClassName
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 pl-3 pr-2 h-10 shrink-0",
            onCountryClick && "cursor-pointer"
          )}
          onClick={onCountryClick}
          data-testid="phone-input-country"
        >
          <span className="text-sm">{countryFlag}</span>
          <span className="text-sm text-semantic-text-secondary">
            {countryCode}
          </span>
          {showChevron && (
            <ChevronDown className="size-3 text-semantic-text-muted" />
          )}
        </div>
        <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
        <input
          type="tel"
          ref={ref}
          disabled={disabled}
          className={cn(
            "flex-1 h-10 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
`, prefix),
        },
      ],
    },
    "reply-quote": {
      name: "reply-quote",
      description: "A quoted message block with blue left border showing sender name and quoted text for reply previews",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "reply-quote.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * ReplyQuote component for displaying a quoted message with a brand-accented left border.
 * Used in chat applications for reply-to previews.
 *
 * When an \`onClick\` handler is provided, the component becomes interactive:
 * it receives \`role="button"\`, \`tabIndex={0}\`, and keyboard support (Enter/Space).
 * A focus ring is shown when focused via keyboard.
 *
 * @example
 * \`\`\`tsx
 * <ReplyQuote sender="John Doe" message="Hello, how are you?" />
 * <ReplyQuote sender="Jane" message="Check this out!" onClick={() => scrollToMessage()} />
 * \`\`\`
 */
export interface ReplyQuoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Name of the person being quoted */
  sender: string;
  /** The quoted message text */
  message: string;
}

const ReplyQuote = React.forwardRef(
  ({ className, sender, message, onClick, onKeyDown, role, tabIndex, "aria-label": ariaLabel, ...props }: ReplyQuoteProps, ref: React.Ref<HTMLDivElement>) => {
    const isInteractive = !!onClick;

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          if (e.key === " ") {
            e.preventDefault();
          }
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
        onKeyDown?.(e);
      },
      [onClick, onKeyDown]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-semantic-bg-ui border-l-[3px] border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors",
          isInteractive && "focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-1 focus-visible:outline-none",
          className
        )}
        role={role ?? (isInteractive ? "button" : undefined)}
        tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        aria-label={ariaLabel ?? \`Quoted reply from \${sender}: \${message}\`}
        {...props}
      >
        <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
          {sender}
        </p>
        <p className="text-[14px] text-semantic-text-muted truncate m-0">
          {message}
        </p>
      </div>
    );
  }
);
ReplyQuote.displayName = "ReplyQuote";

export { ReplyQuote };
`, prefix),
        },
      ],
    },
    "system-message": {
      name: "system-message",
      description: "A centered system message for chat timelines with bold markdown support",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "system-message.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * SystemMessage component for displaying centered, muted system/timeline
 * events in a chat interface. Supports **bold** markdown-style formatting
 * which renders as link-colored bold text.
 *
 * @example
 * \`\`\`tsx
 * <SystemMessage>Assigned to **Alex Smith** by **Admin**</SystemMessage>
 * <SystemMessage>Chat was closed</SystemMessage>
 * \`\`\`
 */
export interface SystemMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The message text. Supports **bold** markdown syntax which renders as link-colored bold text. */
  children: string;
}

const SystemMessage = React.forwardRef(
  ({ className, children, ...props }: SystemMessageProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn("flex justify-center my-1", className)}
      {...props}
    >
      <span className="text-[13px] text-semantic-text-muted">
        {children.split(/(\\*\\*[^*]+\\*\\*)/).map((part, i) =>
          part.startsWith("**") ? (
            <span key={i} className="text-semantic-text-link font-medium">
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
        )}
      </span>
    </div>
  )
);
SystemMessage.displayName = "SystemMessage";

export { SystemMessage };
`, prefix),
        },
      ],
    },
    "unread-separator": {
      name: "unread-separator",
      description: "A horizontal divider with unread message count label for chat message lists",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "unread-separator.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * UnreadSeparator component for displaying a horizontal divider with an unread message count.
 * Used in chat message lists to indicate where unread messages begin.
 *
 * @example
 * \`\`\`tsx
 * <UnreadSeparator count={3} />
 * <UnreadSeparator count={1} />
 * <UnreadSeparator count={5} label="5 new messages" />
 * \`\`\`
 */
export interface UnreadSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of unread messages */
  count: number;
  /** Custom label. Defaults to "{count} unread message(s)" */
  label?: string;
}

const UnreadSeparator = React.forwardRef(
  ({ className, count, label, ...props }: UnreadSeparatorProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 my-2", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-semantic-border-layout" />
      <span className="text-xs text-semantic-text-muted bg-semantic-bg-ui px-2 shrink-0">
        {label ?? \`\${count} unread message\${count !== 1 ? "s" : ""}\`}
      </span>
      <div className="flex-1 h-px bg-semantic-border-layout" />
    </div>
  )
);
UnreadSeparator.displayName = "UnreadSeparator";

export { UnreadSeparator };
`, prefix),
        },
      ],
    },
    "button": {
      name: "button",
      description: "A customizable button component with variants, sizes, and icons",
      category: "core",
      dependencies: [
            "@radix-ui/react-slot@^1.2.4",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "button.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-semantic-primary text-semantic-text-inverted hover:bg-semantic-primary-hover",
        primary:
          "bg-semantic-primary text-semantic-text-inverted hover:bg-semantic-primary-hover",
        destructive:
          "bg-semantic-error-primary text-semantic-text-inverted hover:bg-semantic-error-hover",
        success:
          "bg-semantic-success-primary text-semantic-text-inverted hover:bg-semantic-success-hover",
        outline:
          "border border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-secondary hover:bg-semantic-primary-surface",
        secondary:
          "bg-semantic-primary-surface text-semantic-text-secondary hover:bg-semantic-bg-hover",
        ghost:
          "text-semantic-text-muted hover:bg-semantic-bg-ui hover:text-semantic-text-primary",
        link: "text-semantic-text-secondary underline-offset-4 hover:underline",
        dashed:
          "border border-dashed border-semantic-bg-hover bg-transparent text-semantic-text-muted hover:border-semantic-border-primary hover:text-semantic-text-secondary hover:bg-[var(--color-neutral-50)]",
      },
      size: {
        default: "min-w-20 py-2.5 px-4 [&_svg]:size-4",
        sm: "min-w-16 py-2 px-3 text-xs [&_svg]:size-3.5",
        lg: "min-w-24 py-3 px-6 [&_svg]:size-5",
        icon: "h-8 w-8 rounded-md",
        "icon-sm": "h-7 w-7 rounded-md",
        "icon-lg": "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component for user interactions.
 *
 * @example
 * \`\`\`tsx
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 * \`\`\`
 */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element using Radix Slot */
  asChild?: boolean;
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Text shown during loading state */
  loadingText?: string;
}

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`, prefix),
        },
      ],
    },
    "badge": {
      name: "badge",
      description: "A status badge component with active, failed, disabled, outline, secondary, and destructive variants",
      category: "core",
      dependencies: [
            "@radix-ui/react-slot@^1.2.4",
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "badge.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Badge variants for status indicators.
 * Pill-shaped badges with different colors for different states.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        // Status-based variants (existing)
        active: "bg-semantic-success-surface text-semantic-success-primary",
        failed: "bg-semantic-error-surface text-semantic-error-primary",
        disabled: "bg-semantic-bg-ui text-semantic-text-muted",
        default: "bg-semantic-bg-ui text-semantic-text-primary",
        primary: "bg-semantic-bg-ui text-semantic-text-primary",
        // shadcn-style variants (new)
        secondary: "bg-semantic-bg-ui text-semantic-text-primary",
        outline:
          "border border-semantic-border-layout bg-transparent text-semantic-text-primary",
        destructive: "bg-semantic-error-surface text-semantic-error-primary",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Badge component for displaying status indicators.
 *
 * @example
 * \`\`\`tsx
 * <Badge variant="active">Active</Badge>
 * <Badge variant="failed">Failed</Badge>
 * <Badge variant="disabled">Disabled</Badge>
 * <Badge variant="default">Default</Badge>
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="active" leftIcon={<CheckIcon />}>Active</Badge>
 * <Badge asChild><a href="/status">View Status</a></Badge>
 * \`\`\`
 */
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon displayed on the left side of the badge text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the badge text */
  rightIcon?: React.ReactNode;
  /** Render as child element using Radix Slot */
  asChild?: boolean;
}

const Badge = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      ...props
    }: BadgeProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const Comp = asChild ? Slot : "div";

    // When using asChild, we can't wrap the child with extra elements
    // The child must receive the className and ref directly
    if (asChild) {
      return (
        <Comp
          className={cn(badgeVariants({ variant, size, className }), "gap-1")}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(badgeVariants({ variant, size, className }), "gap-1")}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </Comp>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
`, prefix),
        },
      ],
    },
    "contact-list-item": {
      name: "contact-list-item",
      description: "Contact list item with avatar, name, subtitle, and trailing content",
      category: "core",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "avatar"
      ],
      files: [
        {
          name: "contact-list-item.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";

import { Avatar } from "./avatar";

export interface ContactListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Contact name — displayed as primary text and used for Avatar initials */
  name: string;
  /** Secondary text below the name (e.g., phone number, email) */
  subtitle?: string;
  /** Content rendered at the right edge (e.g., channel badge, status text) */
  trailing?: React.ReactNode;
  /** Avatar image source — shows image instead of initials when provided */
  avatarSrc?: string;
  /** Whether this item is currently selected/active */
  isSelected?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ContactListItem displays a contact entry with avatar, name, optional subtitle,
 * and trailing content — used in contact directories, user lists, and search results.
 *
 * @example
 * \`\`\`tsx
 * <ContactListItem
 *   name="Aditi Kumar"
 *   subtitle="+91 98765 43210"
 *   trailing="MY01"
 *   onClick={() => selectContact("1")}
 * />
 * \`\`\`
 */
const ContactListItem = React.forwardRef(
  (
    {
      name,
      subtitle,
      trailing,
      avatarSrc,
      isSelected = false,
      onClick,
      className,
      ...props
    }: ContactListItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors",
          isSelected
            ? "bg-semantic-bg-ui"
            : "hover:bg-semantic-bg-hover",
          className
        )}
        {...props}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />

        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-semantic-text-primary leading-5 truncate">
              {name}
            </span>
            {subtitle && (
              <span className="text-xs text-semantic-text-muted">
                {subtitle}
              </span>
            )}
          </div>
          {trailing && (
            <span className="text-xs font-medium text-semantic-text-muted shrink-0 ml-2">
              {trailing}
            </span>
          )}
        </div>
      </div>
    );
  }
);
ContactListItem.displayName = "ContactListItem";

export { ContactListItem };
`, prefix),
        },
      ],
    },
    "typography": {
      name: "typography",
      description: "A semantic typography component with kind, variant, color, alignment, and truncation support",
      category: "core",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "typography.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type Kind = "display" | "headline" | "title" | "label" | "body";
export type Variant = "large" | "medium" | "small";
export type Color =
  | "primary"
  | "secondary"
  | "muted"
  | "placeholder"
  | "link"
  | "inverted"
  | "error"
  | "success";
export type Align = "left" | "center" | "right";

type Key = \`\${Kind}-\${Variant}\`;

// =============================================================================
// MAPPINGS
// =============================================================================

/**
 * Maps kind-variant combinations to semantic HTML tags
 */
const mapTagName: { [key in Key]: keyof React.JSX.IntrinsicElements } = {
  "display-large": "h4",
  "display-medium": "h4",
  "display-small": "h4",
  "headline-large": "h1",
  "headline-medium": "h2",
  "headline-small": "h3",
  "title-large": "h5",
  "title-medium": "h5",
  "title-small": "h5",
  "label-large": "label",
  "label-medium": "label",
  "label-small": "label",
  "body-large": "span",
  "body-medium": "span",
  "body-small": "span",
};

/**
 * Maps kind-variant combinations to Tailwind typography classes
 */
const mapClassName: { [key in Key]: string } = {
  "display-large": "text-[57px] leading-[64px] font-normal",
  "display-medium": "text-[45px] leading-[52px] font-normal",
  "display-small": "text-[36px] leading-[44px] font-normal",
  "headline-large": "text-[32px] leading-[40px] font-semibold",
  "headline-medium": "text-[28px] leading-[36px] font-semibold",
  "headline-small": "text-[24px] leading-[32px] font-semibold",
  "title-large": "text-lg leading-[22px] font-semibold",
  "title-medium": "text-base leading-5 font-semibold",
  "title-small": "text-sm leading-[18px] font-semibold",
  "label-large": "text-sm leading-5 font-semibold",
  "label-medium": "text-xs leading-4 font-semibold",
  "label-small": "text-[10px] leading-[14px] font-semibold",
  "body-large": "text-base leading-5 font-normal",
  "body-medium": "text-sm leading-[18px] font-normal",
  "body-small": "text-xs leading-4 font-normal",
};

/**
 * Maps color variants to Tailwind text color classes
 */
const mapColorClassName: { [key in Color]: string } = {
  primary: "text-semantic-text-primary",
  secondary: "text-semantic-text-secondary",
  muted: "text-semantic-text-muted",
  placeholder: "tw-text-semantic-text-placeholder",
  link: "text-semantic-text-link",
  inverted: "text-semantic-text-inverted",
  error: "text-semantic-error-primary",
  success: "text-semantic-success-primary",
};

/**
 * Maps alignment to Tailwind text alignment classes
 */
const mapAlignClassName: { [key in Align]: string } = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Typography component props
 */
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Text content */
  children: React.ReactNode;
  /** Typography kind - determines base styling and semantic tag */
  kind?: Kind;
  /** Size variant */
  variant?: Variant;
  /** Text color */
  color?: Color;
  /** Text alignment */
  align?: Align;
  /** Enable text truncation with ellipsis */
  truncate?: boolean;
  /** Override the default HTML tag */
  tag?: keyof React.JSX.IntrinsicElements;
  /** For label elements - associates with form input */
  htmlFor?: string;
}

/**
 * A semantic typography component for consistent text styling.
 *
 * @example
 * \`\`\`tsx
 * // Basic usage
 * <Typography kind="headline" variant="large">Page Title</Typography>
 *
 * // With color
 * <Typography kind="body" color="muted">Helper text</Typography>
 *
 * // Form label
 * <Typography kind="label" variant="medium" htmlFor="email">Email</Typography>
 *
 * // Truncated text
 * <Typography truncate>Very long text that will be truncated...</Typography>
 * \`\`\`
 */
const Typography = React.forwardRef(
  (
    {
      children,
      kind = "body",
      variant = "medium",
      color,
      align,
      truncate = false,
      className,
      tag,
      htmlFor,
      ...props
    }: TypographyProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const key: Key = \`\${kind}-\${variant}\`;
    const Tag = (tag || mapTagName[key]) as React.ElementType;

    const classes = cn(
      "m-0", // Reset margin
      mapClassName[key],
      color && mapColorClassName[color],
      align && mapAlignClassName[align],
      truncate && "truncate",
      className
    );

    const tagName = tag || mapTagName[key];

    return (
      <Tag
        ref={ref}
        className={classes}
        htmlFor={tagName === "label" ? htmlFor : undefined}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Typography.displayName = "Typography";

export {
  Typography,
  mapTagName,
  mapClassName,
  mapColorClassName,
  mapAlignClassName,
};
`, prefix),
        },
      ],
    },
    "tabs": {
      name: "tabs",
      description: "A flexible tabs component with underline-style active indicator, supporting badges/counts, equal-width and auto-width layouts",
      category: "core",
      dependencies: [
            "@radix-ui/react-tabs",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "tabs.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

/**
 * A flexible tabs component with underline-style active indicator.
 *
 * @example
 * \`\`\`tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * \`\`\`
 */
const Tabs = TabsPrimitive.Root

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** When true, tabs stretch to fill the full width equally */
  fullWidth?: boolean
}

const TabsList = React.forwardRef(({ className, fullWidth, ...props }: TabsListProps, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center border-b border-semantic-border-layout w-full",
      fullWidth && "[&>*]:flex-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap py-3 px-3 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors",
      "text-semantic-text-muted border-transparent hover:text-semantic-text-secondary",
      "data-[state=active]:text-semantic-text-primary data-[state=active]:border-semantic-primary",
      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
`, prefix),
        },
      ],
    }
  }
}
