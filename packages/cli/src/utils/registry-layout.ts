// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: layout

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

export function getLayoutRegistry(prefix: string = ''): Registry {
  return {
    "accordion": {
      name: "accordion",
      description: "An expandable/collapsible accordion component with single or multiple mode support",
      category: "layout",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "accordion.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Accordion root variants
 */
const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered:
        "border border-semantic-border-layout rounded-lg divide-y divide-semantic-border-layout",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Accordion item variants
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Accordion trigger variants
 */
const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "py-3",
        bordered: "p-4 hover:bg-[var(--color-neutral-50)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Accordion content variants
 */
const accordionContentVariants = cva(
  "overflow-hidden transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "",
        bordered: "px-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Types
type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  onValueChange: (value: string[]) => void;
  variant: "default" | "bordered";
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
}

// Contexts
const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);
const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger/AccordionContent must be used within an AccordionItem"
    );
  }
  return context;
}

/**
 * Root accordion component that manages state
 */
export interface AccordionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  /** Whether only one item can be open at a time ('single') or multiple ('multiple') */
  type?: AccordionType;
  /** Controlled value - array of open item values */
  value?: string[];
  /** Default open items for uncontrolled usage */
  defaultValue?: string[];
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void;
}

const Accordion = React.forwardRef(
  (
    {
      className,
      variant = "default",
      type = "multiple",
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      children,
      ...props
    }: AccordionProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string[]) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const contextValue = React.useMemo(
      () => ({
        type,
        value: currentValue,
        onValueChange: handleValueChange,
        variant: variant || "default",
      }),
      [type, currentValue, handleValueChange, variant]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

/**
 * Individual accordion item
 */
export interface AccordionItemProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  /** Unique value for this item */
  value: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

const AccordionItem = React.forwardRef(
  ({ className, value, disabled, children, ...props }: AccordionItemProps, ref: React.Ref<HTMLDivElement>) => {
    const { value: openValues, variant } = useAccordionContext();
    const isOpen = openValues.includes(value);

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
      }),
      [value, isOpen, disabled]
    );

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(accordionItemVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

/**
 * Trigger button that toggles the accordion item
 */
export interface AccordionTriggerProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
  /** Whether to show the chevron icon */
  showChevron?: boolean;
}

const AccordionTrigger = React.forwardRef(({ className, showChevron = true, children, ...props }: AccordionTriggerProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    type,
    value: openValues,
    onValueChange,
    variant,
  } = useAccordionContext();
  const { value, isOpen, disabled } = useAccordionItemContext();

  const handleClick = () => {
    if (disabled) return;

    let newValue: string[];

    if (type === "single") {
      // In single mode, toggle current item (close if open, open if closed)
      newValue = isOpen ? [] : [value];
    } else {
      // In multiple mode, toggle the item in the array
      newValue = isOpen
        ? openValues.filter((v) => v !== value)
        : [...openValues, value];
    }

    onValueChange(newValue);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen}
      disabled={disabled}
      onClick={handleClick}
      className={cn(accordionTriggerVariants({ variant, className }))}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {showChevron && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-semantic-text-muted transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      )}
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * Content that is shown/hidden when the item is toggled
 */
export interface AccordionContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef(({ className, children, ...props }: AccordionContentProps, ref: React.Ref<HTMLDivElement>) => {
  const { variant } = useAccordionContext();
  const { isOpen } = useAccordionItemContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? contentHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      ref={ref}
      className={cn(accordionContentVariants({ variant, className }))}
      style={{ height: height !== undefined ? \`\${height}px\` : undefined }}
      aria-hidden={!isOpen}
      {...props}
    >
      <div ref={contentRef} className="pb-4">
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
};
`, prefix),
        },
      ],
    },
    "page-header": {
      name: "page-header",
      description: "A page header component with icon, title, description, and action buttons",
      category: "layout",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "page-header.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, MoreHorizontal, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

/**
 * PageHeader variants for layout styles.
 */
const pageHeaderVariants = cva(
  "flex flex-col sm:flex-row sm:items-center w-full bg-semantic-bg-primary",
  {
    variants: {},
    defaultVariants: {},
  }
);

/**
 * Page header component for displaying page titles with optional icons and actions.
 *
 * @example
 * \`\`\`tsx
 * // Simple header with icon
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 * />
 *
 * // Header with actions
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 *   actions={<Button>Add Webhook</Button>}
 * />
 *
 * // Header with back button
 * <PageHeader
 *   showBackButton
 *   onBackClick={() => navigate(-1)}
 *   title="Edit Webhook"
 *   description="Modify webhook settings"
 *   actions={<><Button variant="outline">Cancel</Button><Button>Save</Button></>}
 * />
 * \`\`\`
 */
export interface PageHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderVariants> {
  /** Page title (required) */
  title: string;
  /** Optional description/subtitle displayed below the title */
  description?: string;
  /** Icon displayed on the left side (hidden when showBackButton is true) */
  icon?: React.ReactNode;
  /** Shows back arrow button instead of icon */
  showBackButton?: boolean;
  /** Callback when back button is clicked */
  onBackClick?: () => void;
  /** Optional badge/tag displayed next to the title (e.g., status or type indicator) */
  badge?: React.ReactNode;
  /** Optional info icon displayed next to the title (e.g., tooltip trigger) */
  infoIcon?: React.ReactNode;
  /** Action buttons/elements rendered on the right side */
  actions?: React.ReactNode;
  /** Show bottom border (default: true) */
  showBorder?: boolean;
  /** Layout mode: 'horizontal' (single row), 'vertical' (stacked), 'responsive' (auto based on screen size, default) */
  layout?: "horizontal" | "vertical" | "responsive";
  /** Max actions to show on mobile before overflow (default: 2) */
  mobileOverflowLimit?: number;
}

const PageHeader = React.forwardRef(
  (
    {
      className,
      title,
      description,
      icon,
      showBackButton = false,
      onBackClick,
      badge,
      infoIcon,
      actions,
      showBorder = true,
      layout = "responsive",
      mobileOverflowLimit = 2,
      ...props
    }: PageHeaderProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // State for overflow expansion (moved to top level)
    const [isOverflowExpanded, setIsOverflowExpanded] = React.useState(false);

    // Determine what to show on the left: back button, icon, or nothing
    const renderLeftElement = () => {
      if (showBackButton) {
        return (
          <button
            type="button"
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-semantic-bg-ui transition-colors text-semantic-text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        );
      }
      if (icon) {
        return (
          <div className="flex items-center justify-center w-10 h-10 [&_svg]:w-6 [&_svg]:h-6 text-semantic-text-muted">
            {icon}
          </div>
        );
      }
      return null;
    };

    const leftElement = renderLeftElement();

    // Flatten children recursively to handle fragments
    const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === React.Fragment) {
          const fragmentProps = child.props as { children?: React.ReactNode };
          result.push(...flattenChildren(fragmentProps.children));
        } else if (child !== null && child !== undefined) {
          result.push(child);
        }
      });
      return result;
    };

    // Convert actions to array for overflow handling
    const actionsArray = flattenChildren(actions);
    const hasOverflow = actionsArray.length > mobileOverflowLimit;
    const visibleActions = hasOverflow
      ? actionsArray.slice(0, mobileOverflowLimit)
      : actionsArray;
    const overflowActions = hasOverflow
      ? actionsArray.slice(mobileOverflowLimit)
      : [];

    // Layout classes based on prop
    const layoutClasses = {
      horizontal: "flex-row items-center",
      vertical: "flex-col",
      responsive: "flex-col sm:flex-row sm:items-center",
    };

    const heightClasses = {
      horizontal: "h-[76px]",
      vertical: "min-h-[76px] py-4",
      responsive: "min-h-[76px] py-4 lg:py-0 lg:h-[76px]",
    };

    // Render actions for desktop (all inline)
    const renderDesktopActions = () => (
      <div className="hidden sm:flex items-center gap-2 ml-6">
        {actionsArray.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    );

    // Render expandable actions (for mobile and vertical layout)
    const renderExpandableActions = (additionalClasses?: string) => {
      // Calculate grid columns: equal width for visible actions, smaller for overflow button
      const hasOverflowBtn = overflowActions.length > 0;
      const gridCols = hasOverflowBtn
        ? \`repeat(\${visibleActions.length}, 1fr) auto\`
        : \`repeat(\${visibleActions.length}, 1fr)\`;

      return (
        <div className={cn("flex flex-col gap-2 w-full", additionalClasses)}>
          {/* Visible actions row - full width grid */}
          <div className="grid gap-2" style={{ gridTemplateColumns: gridCols }}>
            {visibleActions.map((action, index) => (
              <div key={index} className="[&>*]:w-full [&>*]:h-9">
                {action}
              </div>
            ))}
            {hasOverflowBtn && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsOverflowExpanded(!isOverflowExpanded)}
                aria-label={isOverflowExpanded ? "Show less" : "More actions"}
                aria-expanded={isOverflowExpanded}
              >
                {isOverflowExpanded ? (
                  <X className="w-4 h-4" />
                ) : (
                  <MoreHorizontal className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Expanded overflow actions - stacked full width */}
          {isOverflowExpanded && overflowActions.length > 0 && (
            <div className="flex flex-col gap-2">
              {overflowActions.map((action, index) => (
                <div key={index} className="[&>*]:w-full [&>*]:h-9">
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    // For horizontal layout, always show all actions inline
    const renderHorizontalActions = () => (
      <div className="flex items-center gap-2 ml-4">
        {actionsArray.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    );

    const renderActions = () => {
      if (!actions) return null;

      if (layout === "horizontal") {
        return renderHorizontalActions();
      }

      if (layout === "vertical") {
        return renderExpandableActions("mt-3");
      }

      // Responsive: render both, CSS handles visibility
      return (
        <>
          {renderDesktopActions()}
          <div className="sm:hidden mt-3 w-full">
            {renderExpandableActions()}
          </div>
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full bg-semantic-bg-primary px-4",
          layoutClasses[layout],
          heightClasses[layout],
          showBorder && "border-b border-semantic-border-layout",
          className
        )}
        {...props}
      >
        {/* Top Row: Icon/Back + Title + Description */}
        <div className="flex items-start sm:items-center flex-1 min-w-0">
          {/* Left Section: Icon or Back Button */}
          {leftElement && (
            <div className="flex-shrink-0 mr-4">{leftElement}</div>
          )}

          {/* Content Section: Title + Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="m-0 text-lg font-semibold text-semantic-text-primary truncate">
                {title}
              </h1>
              {badge && (
                <span className="flex-shrink-0">{badge}</span>
              )}
              {infoIcon && (
                <span className="flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4 text-semantic-text-muted">
                  {infoIcon}
                </span>
              )}
            </div>
            {description && (
              <p className="m-0 text-sm text-semantic-text-muted font-normal mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {renderActions()}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export { PageHeader, pageHeaderVariants };
`, prefix),
        },
      ],
    },
    "panel": {
      name: "panel",
      description: "A collapsible side panel layout with header, scrollable body, and optional footer",
      category: "layout",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button"
      ],
      files: [
        {
          name: "panel.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

import { Button } from "./button";

/**
 * Panel root variants
 */
const panelVariants = cva(
  "border-l border-semantic-border-layout bg-semantic-bg-primary flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0",
  {
    variants: {
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const panelWidths = {
  sm: "w-[280px]",
  default: "w-[320px]",
  lg: "w-[400px]",
} as const;

export interface PanelProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof panelVariants> {
  /** Whether the panel is open */
  open?: boolean;
  /** Panel title displayed in the header */
  title?: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
  /** Custom header content — replaces the default title + close button */
  header?: React.ReactNode;
}

/**
 * Panel is a collapsible side panel layout with a header, scrollable body,
 * and optional footer — used for detail views, settings, and edit forms.
 *
 * @example
 * \`\`\`tsx
 * <Panel open={isOpen} title="Contact Details" onClose={() => setIsOpen(false)}>
 *   <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
 *   <TextField label="Email" value="email@example.com" disabled size="sm" />
 * </Panel>
 * \`\`\`
 */
const Panel = React.forwardRef(
  (
    {
      open = true,
      title,
      onClose,
      footer,
      header,
      size,
      className,
      children,
      "aria-label": ariaLabel,
      onKeyDown,
      ...props
    }: PanelProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const resolvedSize = size ?? "default";
    const widthClass = panelWidths[resolvedSize];
    const innerRef = React.useRef<HTMLDivElement>(null);

    // Focus the inner container when the panel opens
    React.useEffect(() => {
      if (open) {
        innerRef.current?.focus();
      }
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
      // Forward to user-provided onKeyDown if any
      onKeyDown?.(e);
    };

    return (
      <aside
        ref={ref}
        className={cn(
          panelVariants({ size }),
          open ? widthClass : "w-0 border-l-0",
          className
        )}
        aria-label={ariaLabel ?? title}
        aria-hidden={!open}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          ref={innerRef}
          tabIndex={-1}
          className={cn(widthClass, "flex flex-col h-full outline-none")}
        >
          {/* Header */}
          {header ?? (
            <div className="flex items-center gap-3 px-4 h-14 border-b border-semantic-border-layout shrink-0">
              {title && (
                <span className="flex-1 text-base font-semibold text-semantic-text-primary truncate">
                  {title}
                </span>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="size-5" />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-3 px-4 py-3 shrink-0 border-t border-semantic-border-layout">
              {footer}
            </div>
          )}
        </div>
      </aside>
    );
  }
);
Panel.displayName = "Panel";

export { Panel, panelVariants };
`, prefix),
        },
      ],
    },
    "pagination": {
      name: "pagination",
      description: "A composable pagination component with page navigation, next/previous links, and ellipsis",
      category: "layout",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button"
      ],
      files: [
        {
          name: "pagination.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { buttonVariants, type ButtonProps } from "./button";

export interface PaginationProps extends React.ComponentProps<"nav"> {
  /** Additional CSS classes for the nav wrapper */
  className?: string;
}

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

export interface PaginationContentProps extends React.ComponentProps<"ul"> {
  /** Additional CSS classes for the list container */
  className?: string;
}

function PaginationContent({
  className,
  ...props
}: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps extends React.ComponentProps<"li"> {
  /** Additional CSS classes for the list item */
  className?: string;
}

function PaginationItem({ ...props }: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />;
}
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps
  extends Pick<ButtonProps, "size">,
    React.ComponentProps<"a"> {
  /** Highlights the link as the current page */
  isActive?: boolean;
  /** Size of the link (uses Button size variants) */
  size?: ButtonProps["size"];
  /** Additional CSS classes */
  className?: string;
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps extends PaginationLinkProps {
  /** Additional CSS classes */
  className?: string;
  /** Disables the previous button */
  disabled?: boolean;
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      aria-disabled={disabled}
      size="default"
      className={cn(
        "gap-1 px-2.5 sm:pl-2.5",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps extends PaginationLinkProps {
  /** Additional CSS classes */
  className?: string;
  /** Disables the next button */
  disabled?: boolean;
}

function PaginationNext({
  className,
  disabled,
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      aria-disabled={disabled}
      size="default"
      className={cn(
        "gap-1 px-2.5 sm:pr-2.5",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
  /** Additional CSS classes */
  className?: string;
}

function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export interface PaginationWidgetProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the user navigates to a new page */
  onPageChange: (page: number) => void;
  /** Number of pages shown on each side of current page (default: 1) */
  siblingCount?: number;
  /** Additional CSS classes */
  className?: string;
}

function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  if (totalPages <= 1) return [1];

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: (number | "ellipsis")[] = [1];

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  } else {
    // fill in pages between 1 and leftSibling if no ellipsis
    for (let p = 2; p < leftSibling; p++) pages.push(p);
  }

  pages.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let p = rightSibling + 1; p < totalPages; p++) pages.push(p);
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

function PaginationWidget({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationWidgetProps) {
  const pages = usePaginationRange(currentPage, totalPages, siblingCount);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={\`ellipsis-\${idx}\`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
PaginationWidget.displayName = "PaginationWidget";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationWidget,
};
`, prefix),
        },
      ],
    }
  }
}
