// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry

export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  group?: string
  mainFile?: string
}

export type Registry = Record<string, ComponentDefinition>

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
  // Skip injection when the only border-width classes are zero-width (border-0, border-t-0, etc.)
  // since those explicitly remove borders and don't need a style.
  const origClasses = classString.split(' ')
  const BORDER_ZERO_RE = /^border(-[trblxy])?-0$/
  const hasNonZeroBorderWidth = origClasses.some((c: string) => BORDER_WIDTH_RE.test(c) && !BORDER_ZERO_RE.test(c))
  const hasBorderStyle = origClasses.some((c: string) => BORDER_STYLE_RE.test(c))
  if (hasNonZeroBorderWidth && !hasBorderStyle) {
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

// In a real implementation, this would fetch from a remote URL
// For now, we'll embed the components directly
export async function getRegistry(prefix: string = ''): Promise<Registry> {
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
  xs: "size-2 border border-solid",
  sm: "size-2.5 border-[1.5px] border-solid",
  md: "size-3 border-2 border-solid",
  lg: "size-3.5 border-2 border-solid",
  xl: "size-4 border-2 border-solid",
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
          "flex items-center border border-solid border-semantic-border-layout rounded-lg focus-within:border-semantic-border-focus transition-colors",
          disabled && "opacity-60 bg-semantic-bg-ui cursor-not-allowed",
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
          "w-full bg-semantic-bg-ui border-l-[3px] border-solid border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors",
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
          "border border-solid border-[var(--color-neutral-300,#D5D7DA)] bg-semantic-bg-primary text-semantic-text-secondary hover:bg-semantic-primary-surface",
        secondary:
          "bg-semantic-primary-surface text-semantic-text-secondary hover:bg-semantic-bg-hover",
        ghost:
          "text-semantic-text-muted hover:bg-semantic-bg-ui hover:text-semantic-text-primary",
        link: "text-semantic-text-link underline-offset-4 hover:underline",
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
          "border border-solid border-semantic-border-layout bg-transparent text-semantic-text-primary",
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
import { Check } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-[42px] w-full rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all file:border-0 file:bg-transparent file:text-base file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
 * <Input showCheckIcon placeholder="Enter amount" />
 * \`\`\`
 */
export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Shows a check icon on the right side when the input is focused */
  showCheckIcon?: boolean;
}

const Input = React.forwardRef(
  ({ className, state, type, showCheckIcon, onFocus, onBlur, onWheel, ...props }: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const inputEl = (
      <input
        type={type}
        className={cn(
          inputVariants({ state, className }),
          showCheckIcon && "pr-9",
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onWheel={
          type === "number"
            ? (e) => {
                e.currentTarget.blur();
                onWheel?.(e);
              }
            : onWheel
        }
        {...props}
      />
    );

    if (!showCheckIcon) return inputEl;

    return (
      <div className="relative w-full">
        {inputEl}
        {isFocused && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-semantic-brand pointer-events-none" />
        )}
      </div>
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
  "flex h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)] [&>span]:line-clamp-1",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Value>>) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn("[&[data-placeholder]]:text-semantic-text-muted", className)}
    {...props}
  />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

export interface SelectTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef(({ className, state, children, ...props }: SelectTriggerProps, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>) => (
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

const SelectScrollUpButton = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>) => (
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

const SelectScrollDownButton = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>) => (
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

/**
 * Radix Select v2 wraps content in RemoveScroll which locks body scroll
 * via both CSS (overflow:hidden) and JS (preventDefault on wheel/touchmove).
 *
 * CSS fix: react-remove-scroll-bar uses \`body[data-scroll-locked]\` with
 * \`!important\`. We use a doubled attribute selector for higher specificity
 * so our override always wins regardless of style injection order.
 *
 * JS fix: react-remove-scroll checks \`event.cancelable\` before calling
 * \`preventDefault()\`. We override this property in a capture-phase listener
 * so the library skips the preventDefault call.
 */
function useUnlockBodyScroll() {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-select-scroll-fix", "");
    style.textContent =
      "body[data-scroll-locked][data-scroll-locked] { overflow: auto !important; margin-right: 0 !important; overscroll-behavior: auto !important; }";
    document.head.appendChild(style);

    const preventScrollLock = (e: Event) => {
      if (!document.body.hasAttribute("data-scroll-locked")) return;
      Object.defineProperty(e, "cancelable", {
        value: false,
        configurable: true,
      });
    };

    document.addEventListener("wheel", preventScrollLock, true);
    document.addEventListener("touchmove", preventScrollLock, true);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener("wheel", preventScrollLock, true);
      document.removeEventListener("touchmove", preventScrollLock, true);
    };
  }, []);
}

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>) => {
  useUnlockBodyScroll();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded bg-semantic-bg-primary border border-solid border-semantic-border-layout shadow-md",
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
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>) => (
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

const SelectItem = React.forwardRef(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-base text-semantic-text-primary outline-none",
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

const SelectSeparator = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>) => (
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
  "peer inline-flex items-center justify-center shrink-0 rounded border-2 border-solid transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-semantic-primary data-[state=checked]:border-semantic-primary data-[state=checked]:text-semantic-text-inverted data-[state=indeterminate]:bg-semantic-primary data-[state=indeterminate]:border-semantic-primary data-[state=indeterminate]:text-semantic-text-inverted data-[state=unchecked]:bg-semantic-bg-primary data-[state=unchecked]:border-semantic-border-input data-[state=unchecked]:hover:border-[var(--color-neutral-400)]",
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

const Checkbox = React.forwardRef(
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
    }: CheckboxProps,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
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
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-solid border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-semantic-primary data-[state=unchecked]:bg-semantic-bg-grey",
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

const Switch = React.forwardRef(
  (
    { className, size, label, labelPosition = "right", disabled, ...props }: SwitchProps,
    ref: React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>
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
import { Loader2, X } from "lucide-react";

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
          "border border-solid border-semantic-border-input focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus-within:border-semantic-error-primary focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
  "w-full rounded bg-semantic-bg-primary text-semantic-text-primary outline-none transition-all file:border-0 file:bg-transparent file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
      size: {
        default: "h-[42px] px-4 py-2 text-base file:text-base",
        sm: "h-9 px-3 py-1.5 text-sm file:text-sm",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
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
  /** Size of the text field — \`default\` (42px) or \`sm\` (36px, compact) */
  size?: "default" | "sm";
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
  /** Shows a clear (X) button when input has a value */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
  /** Additional class for the input container (includes prefix/suffix/icons) */
  inputContainerClassName?: string;
}

const TextField = React.forwardRef(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      inputContainerClassName,
      state,
      size,
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
      clearable,
      onClear,
      maxLength,
      value,
      defaultValue,
      onChange,
      onWheel,
      disabled,
      id,
      type,
      ...props
    }: TextFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    // Internal ref for programmatic control (e.g., clearable)
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref && typeof ref === "object") ref.current = node;
      },
      [ref]
    );

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
    const hasAddons = leftIcon || rightIcon || prefix || suffix || loading || clearable;

    // Handle clear
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
        if (internalRef.current) {
          internalRef.current.value = "";
        }
      }
      onClear?.();
    };

    const showClearButton = clearable && String(currentValue).length > 0 && !disabled && !loading;

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
        ref={mergedRef}
        id={inputId}
        type={type}
        className={cn(
          hasAddons
            ? cn(
                "flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed",
                size === "sm" ? "text-sm" : "text-base"
              )
            : textFieldInputVariants({ state: derivedState, size, className }),
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        disabled={disabled || loading}
        maxLength={maxLength}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        onWheel={
          type === "number"
            ? (e) => {
                e.currentTarget.blur();
                onWheel?.(e);
              }
            : onWheel
        }
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
              "text-sm font-medium text-semantic-text-muted",
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
              size === "sm" ? "h-9 px-3" : "h-[42px] px-4",
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
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-semantic-text-muted hover:text-semantic-text-primary flex-shrink-0 cursor-pointer"
                aria-label="Clear input"
                tabIndex={-1}
              >
                <X className="size-4" />
              </button>
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
                className="text-sm text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-sm text-semantic-text-muted">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-sm",
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
    "textarea": {
      name: "textarea",
      description: "A multi-line text input with label, error state, helper text, character counter, and resize control",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "textarea.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Textarea variants for different visual states
 */
const textareaVariants = cva(
  "w-full rounded bg-semantic-bg-primary text-semantic-text-primary outline-none transition-all placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
      size: {
        default: "px-4 py-2.5 text-base",
        sm: "px-3 py-2 text-sm",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

/**
 * A multi-line text input with label, error state, helper text, character counter, and resize control.
 *
 * @example
 * \`\`\`tsx
 * <Textarea label="Description" placeholder="Enter description" />
 * <Textarea label="Notes" error="Too short" showCount maxLength={500} />
 * <Textarea label="JSON" rows={8} resize="vertical" />
 * \`\`\`
 */
export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  /** Size of the textarea — \`default\` or \`sm\` (compact) */
  size?: "default" | "sm";
  /** Label text displayed above the textarea */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Error message — shows error state with red styling */
  error?: string;
  /** Shows character count when maxLength is set */
  showCount?: boolean;
  /** Controls CSS resize behavior. Defaults to "none" */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
}

const Textarea = React.forwardRef(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      state,
      size,
      label,
      required,
      helperText,
      error,
      showCount,
      resize = "none",
      maxLength,
      rows = 4,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    }: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
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
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Character count
    const charCount = String(currentValue).length;

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = \`\${textareaId}-helper\`;
    const errorId = \`\${textareaId}-error\`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Resize class map
    const resizeClasses: Record<string, string> = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            textareaVariants({ state: derivedState, size, className }),
            resizeClasses[resize]
          )}
          disabled={disabled}
          maxLength={maxLength}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-sm text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-sm text-semantic-text-muted">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-sm",
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
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
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
    /** When true, button is shown but non-interactive */
    disabled?: boolean;
    /** Tooltip text shown on hover when disabled */
    disabledTooltip?: string;
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
export const ReadableField = React.forwardRef(
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
    }: ReadableFieldProps,
    ref: React.Ref<HTMLDivElement>
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
            headerAction.disabled ? (
              <span className="relative group/regen-action">
                <button
                  type="button"
                  disabled
                  className="text-sm font-semibold text-semantic-text-muted tracking-[0.014px] opacity-50 cursor-not-allowed rounded"
                >
                  {headerAction.label}
                </button>
                {headerAction.disabledTooltip && (
                  <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded bg-semantic-primary px-2 py-1 text-xs text-semantic-text-inverted opacity-0 transition-opacity group-hover/regen-action:opacity-100 z-10">
                    {headerAction.disabledTooltip}
                    <span className="absolute top-full right-2 border-4 border-solid border-transparent border-t-semantic-primary" />
                  </span>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={headerAction.onClick}
                className="text-sm font-semibold text-semantic-text-muted tracking-[0.014px] hover:text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-text-primary rounded transition-colors"
              >
                {headerAction.label}
              </button>
            )
          )}
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "flex h-11 items-center justify-between rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui pl-4 pr-2.5 py-2.5",
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
import { Loader2, Search } from "lucide-react";

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
  /**
   * Intercept a value change before it commits. Return \`false\` to prevent
   * \`onValueChange\` from firing (only \`onSelect\` will fire). Useful for
   * "action" items like "Add custom date" that should open a modal instead
   * of committing a value. Requires controlled mode (\`value\` prop) to
   * visually revert the selection.
   */
  interceptValue?: (value: string) => boolean;
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
const SelectField = React.forwardRef(
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
      interceptValue,
      options,
      searchable,
      searchPlaceholder = "Search...",
      wrapperClassName,
      triggerClassName,
      labelClassName,
      id,
      name,
    }: SelectFieldProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    // Internal state for search
    const [searchQuery, setSearchQuery] = React.useState("");

    // Combined value change handler that also fires onSelect with full option object.
    // When interceptValue returns false, onValueChange is skipped (only onSelect fires).
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        const intercepted = interceptValue?.(newValue) === false;

        if (!intercepted) {
          onValueChange?.(newValue);
        }

        if (onSelect) {
          const option = options.find((o) => o.value === newValue);
          if (option) {
            onSelect(option);
          }
        }
      },
      [onValueChange, onSelect, interceptValue, options]
    );

    // Support re-selection: fire onSelect when clicking the already-selected
    // item. Radix only fires onValueChange for *new* values, so without this
    // clicking an action item like "Add custom date" a second time would be a
    // no-op.
    const handleItemClick = React.useCallback(
      (option: SelectOption) => {
        if (option.value === value) {
          handleValueChange(option.value);
        }
      },
      [value, handleValueChange]
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
              "text-sm font-medium text-semantic-text-muted",
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
              <div className="flex items-center gap-2 px-3 pb-1.5 border-b border-solid border-semantic-border-layout">
                <Search className="size-4 text-semantic-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-8 text-sm bg-transparent placeholder:text-semantic-text-muted focus:outline-none"
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
                onPointerUp={() => handleItemClick(option)}
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
                        onPointerUp={() => handleItemClick(option)}
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
  "flex min-h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
const MultiSelect = React.forwardRef(
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
    }: MultiSelectProps,
    ref: React.Ref<HTMLButtonElement>
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
    const listboxId = \`\${selectId}-listbox\`;
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
          aria-controls={listboxId}
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
            id={listboxId}
            className={cn(
              "absolute z-50 mt-1 w-full rounded bg-semantic-bg-primary border border-solid border-semantic-border-layout shadow-md",
              "top-full"
            )}
            role="listbox"
            aria-multiselectable="true"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-solid border-semantic-border-layout">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-solid border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
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
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-base text-semantic-text-primary outline-none",
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
              <div className="p-2 border-t border-solid border-semantic-border-layout text-xs text-semantic-text-muted">
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
    },
    "creatable-select": {
      name: "creatable-select",
      description: "A single-value select with type-to-search and type-to-create custom options",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "creatable-select.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Check } from "lucide-react"

import { cn } from "../../lib/utils"

const creatableSelectTriggerVariants = cva(
  "flex h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus-within:border-semantic-border-input-focus/50 focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus-within:border-semantic-error-primary/60 focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface CreatableSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CreatableSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof creatableSelectTriggerVariants> {
  /** Currently selected value */
  value?: string
  /** Callback when value changes (selection or creation) */
  onValueChange?: (value: string) => void
  /** Available options */
  options?: CreatableSelectOption[]
  /** Placeholder when no value selected */
  placeholder?: string
  /** Hint text shown above options when dropdown is open */
  creatableHint?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Max character length for the value (enforced when open and when creating) */
  maxLength?: number
}

const CreatableSelect = React.forwardRef(
  (
    {
      className,
      state,
      value,
      onValueChange,
      options = [],
      placeholder = "Select an option",
      creatableHint = "Type to create a custom option",
      disabled = false,
      maxLength,
      ...props
    }: CreatableSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [highlightIndex, setHighlightIndex] = React.useState(-1)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)
    const listboxId = React.useId()

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => containerRef.current!)

    const selectedLabel = React.useMemo(() => {
      const found = options.find((o) => o.value === value)
      return found ? found.label : value || ""
    }, [options, value])

    const filtered = React.useMemo(() => {
      if (!search.trim()) return options
      const q = search.toLowerCase()
      return options.filter((o) => o.label.toLowerCase().includes(q))
    }, [options, search])

    const isCustom =
      search.trim().length > 0 &&
      !options.some((o) => o.label.toLowerCase() === search.trim().toLowerCase())

    const handleOpen = () => {
      if (disabled) return
      setOpen(true)
      setSearch("")
      setHighlightIndex(-1)
      requestAnimationFrame(() => inputRef.current?.focus())
    }

    const handleSelect = React.useCallback(
      (val: string) => {
        onValueChange?.(val)
        setOpen(false)
        setSearch("")
      },
      [onValueChange]
    )

    const handleCreate = React.useCallback(() => {
      const trimmed = search.trim()
      if (trimmed) {
        const value = maxLength != null ? trimmed.slice(0, maxLength) : trimmed
        onValueChange?.(value)
        setOpen(false)
        setSearch("")
      }
    }, [search, onValueChange, maxLength])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          const opt = filtered[highlightIndex]
          if (!opt.disabled) handleSelect(opt.value)
        } else if (isCustom) {
          handleCreate()
        } else if (filtered.length === 1 && !filtered[0].disabled) {
          handleSelect(filtered[0].value)
        }
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlightIndex((prev) => {
          const next = prev + 1
          return next >= filtered.length ? 0 : next
        })
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightIndex((prev) => {
          const next = prev - 1
          return next < 0 ? filtered.length - 1 : next
        })
        return
      }
    }

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (highlightIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightIndex] as HTMLElement
        item?.scrollIntoView({ block: "nearest" })
      }
    }, [highlightIndex])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [open])

    // Reset highlight when filter changes
    React.useEffect(() => {
      setHighlightIndex(-1)
    }, [search])

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Trigger / Input */}
        {open ? (
          <div
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-text"
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                const v = e.target.value
                setSearch(maxLength != null ? v.slice(0, maxLength) : v)
              }}
              maxLength={maxLength}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-semantic-text-primary placeholder:text-semantic-text-muted"
              placeholder={selectedLabel || placeholder}
              aria-expanded="true"
              aria-haspopup="listbox"
              aria-controls={listboxId}
              role="combobox"
              aria-autocomplete="list"
            />
            <ChevronDown className="size-4 text-semantic-text-muted opacity-70 shrink-0 rotate-180 transition-transform" />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-pointer text-left"
            )}
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-controls={listboxId}
          >
            <span
              className={cn(
                "line-clamp-1",
                !selectedLabel && "text-semantic-text-muted"
              )}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="size-4 text-semantic-text-muted opacity-70 shrink-0" />
          </button>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-[9999] mt-1 w-full rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            {/* Creatable hint */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-solid border-semantic-border-layout">
              <span className="text-sm text-semantic-text-muted">
                {creatableHint}
              </span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui px-1.5 py-0.5 text-[10px] text-semantic-text-muted font-medium">
                Enter ↵
              </kbd>
            </div>

            {/* Options list */}
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              className="max-h-60 overflow-y-auto p-1"
            >
              {filtered.length === 0 && !isCustom && (
                <div className="px-4 py-2 text-sm text-semantic-text-muted">
                  No options found
                </div>
              )}
              {filtered.map((opt, i) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={cn(
                    "relative flex w-full items-center rounded-sm py-2 pl-4 pr-8 text-base text-semantic-text-primary outline-none cursor-pointer select-none",
                    "hover:bg-semantic-bg-ui",
                    highlightIndex === i && "bg-semantic-bg-ui",
                    opt.disabled &&
                      "pointer-events-none opacity-50 cursor-not-allowed"
                  )}
                >
                  {opt.label}
                  {opt.value === value && (
                    <span className="absolute right-2 flex size-4 items-center justify-center">
                      <Check className="size-4 text-semantic-brand" />
                    </span>
                  )}
                </button>
              ))}

              {/* Show custom creation option */}
              {isCustom && (
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={handleCreate}
                  onMouseEnter={() => setHighlightIndex(filtered.length)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm py-2 pl-4 pr-8 text-base outline-none cursor-pointer select-none",
                    "text-semantic-text-link hover:bg-semantic-bg-ui",
                    highlightIndex === filtered.length && "bg-semantic-bg-ui"
                  )}
                >
                  Create &ldquo;{search.trim()}&rdquo;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
CreatableSelect.displayName = "CreatableSelect"

export { CreatableSelect, creatableSelectTriggerVariants }
`, prefix),
        },
      ],
    },
    "creatable-multi-select": {
      name: "creatable-multi-select",
      description: "A multi-value select with chips, type-to-search, and type-to-create custom options",
      category: "form",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "creatable-multi-select.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown, ChevronRight, Plus, X, Info } from "lucide-react"

import { cn } from "../../lib/utils"

const creatableMultiSelectTriggerVariants = cva(
  "flex items-center gap-2 flex-wrap min-h-[42px] w-full px-4 py-2 rounded bg-semantic-bg-primary cursor-text transition-shadow",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input hover:border-semantic-border-input-focus",
        error:
          "border border-solid border-semantic-error-primary/40 hover:border-semantic-error-primary",
        focused:
          "border border-solid border-semantic-border-focus shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        "focused-error":
          "border border-solid border-semantic-error-primary/60 shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface CreatableMultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CreatableMultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Currently selected values */
  value?: string[]
  /** Callback when values change */
  onValueChange?: (values: string[]) => void
  /** Available preset options */
  options?: CreatableMultiSelectOption[]
  /** Placeholder when no values selected */
  placeholder?: string
  /** Whether the component is disabled */
  disabled?: boolean
  /** Error state */
  state?: "default" | "error"
  /** Hint text shown at top of dropdown when open */
  creatableHint?: string
  /** Helper text shown below the trigger */
  helperText?: string
  /** Max number of items that can be selected (default: unlimited) */
  maxItems?: number
  /** Max character length per item when typing/creating (default: unlimited) */
  maxLengthPerItem?: number
}

const CreatableMultiSelect = React.forwardRef(
  (
    {
      className,
      value = [],
      onValueChange,
      options = [],
      placeholder = "Enter or select",
      disabled = false,
      state = "default",
      creatableHint = "Type to create a custom option",
      helperText,
      maxItems,
      maxLengthPerItem,
      ...props
    }: CreatableMultiSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listboxId = React.useId()

    React.useImperativeHandle(ref, () => containerRef.current!)

    const addValue = React.useCallback(
      (val: string) => {
        const trimmed = val.trim()
        if (!trimmed || value.includes(trimmed)) return
        if (maxItems != null && value.length >= maxItems) return
        const toAdd =
          maxLengthPerItem != null
            ? trimmed.slice(0, maxLengthPerItem)
            : trimmed
        if (toAdd) {
          onValueChange?.([...value, toAdd])
          setInputValue("")
        }
      },
      [value, onValueChange, maxItems, maxLengthPerItem]
    )

    const removeValue = React.useCallback(
      (val: string) => {
        onValueChange?.(value.filter((v) => v !== val))
      },
      [value, onValueChange]
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (inputValue.trim()) addValue(inputValue)
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeValue(value[value.length - 1])
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setInputValue("")
      }
    }

    // Close on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
          setInputValue("")
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [])

    const availablePresets = options.filter(
      (o) => !value.includes(o.value) && !o.disabled
    )
    const filteredPresets = inputValue.trim()
      ? availablePresets.filter((o) =>
          o.label.toLowerCase().includes(inputValue.trim().toLowerCase())
        )
      : availablePresets
    const canAddCustom =
      Boolean(inputValue.trim()) && !value.includes(inputValue.trim())

    const triggerState = isOpen
      ? state === "error"
        ? "focused-error"
        : "focused"
      : state

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Trigger */}
        <div
          className={cn(
            creatableMultiSelectTriggerVariants({ state: triggerState }),
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => {
            if (disabled) return
            setIsOpen(true)
            inputRef.current?.focus()
          }}
        >
          {/* Selected chips */}
          {value.map((val) => {
            const optLabel =
              options.find((o) => o.value === val)?.label || val
            return (
              <span
                key={val}
                className="inline-flex items-center gap-2 bg-semantic-info-surface px-2 py-1 rounded text-sm text-semantic-text-primary whitespace-nowrap"
              >
                {optLabel}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    removeValue(val)
                  }}
                  className="shrink-0 flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                  aria-label={\`Remove \${optLabel}\`}
                >
                  <X className="size-2.5" />
                </button>
              </span>
            )
          })}

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value
              setInputValue(
                maxLengthPerItem != null ? v.slice(0, maxLengthPerItem) : v
              )
              if (!isOpen) setIsOpen(true)
            }}
            maxLength={maxLengthPerItem}
            onFocus={() => {
              if (!disabled) setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[100px] text-base bg-transparent outline-none text-semantic-text-primary placeholder:text-semantic-text-muted"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-haspopup="listbox"
          />

          {/* Chevron */}
          {isOpen ? (
            <ChevronRight className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
          ) : (
            <ChevronDown className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
          )}
        </div>

        {/* Dropdown panel */}
        {isOpen && (
          <div id={listboxId} role="listbox" className="absolute z-[9999] top-full mt-1 w-full bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            {/* Creatable hint — Enter key */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-solid border-semantic-border-layout">
              <span className="text-sm text-semantic-text-muted">
                {canAddCustom
                  ? \`Press enter to add "\${inputValue.trim()}"\`
                  : creatableHint}
              </span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui px-1.5 py-0.5 text-[10px] text-semantic-text-muted font-medium shrink-0">
                Enter ↵
              </kbd>
            </div>

            {/* Preset option chips */}
            {filteredPresets.length > 0 && (
              <div className="px-2.5 py-2 flex flex-wrap gap-1.5">
                {filteredPresets.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      addValue(option.value)
                    }}
                    className="inline-flex items-center gap-1.5 bg-semantic-bg-ui px-2.5 py-1.5 rounded text-sm text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors whitespace-nowrap"
                  >
                    <Plus className="size-3 shrink-0 text-semantic-text-muted" />
                    {option.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Helper row below trigger: when maxLengthPerItem show dynamic hint + counter (Figma); else optional static helperText */}
        {maxLengthPerItem != null ? (
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <div className="flex items-center gap-1.5 text-xs text-semantic-text-muted min-w-0">
              <Info className="size-3.5 shrink-0 text-semantic-text-muted" />
              <p className="m-0 truncate">
                {inputValue.trim()
                  ? \`Press Enter to add "\${inputValue.trim()}" ↵\`
                  : creatableHint}
              </p>
            </div>
            <span className="text-sm text-semantic-text-muted shrink-0">
              {inputValue.length}/{maxLengthPerItem}
            </span>
          </div>
        ) : (
          helperText &&
          !isOpen && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Info className="size-[18px] shrink-0 text-semantic-text-muted" />
              <p className="m-0 text-sm text-semantic-text-muted">
                {helperText}
              </p>
            </div>
          )
        )}
      </div>
    )
  }
)
CreatableMultiSelect.displayName = "CreatableMultiSelect"

export { CreatableMultiSelect, creatableMultiSelectTriggerVariants }
`, prefix),
        },
      ],
    },
    "table": {
      name: "table",
      description: "A composable table component with size variants, loading/empty states, sticky columns, and sorting support",
      category: "data",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "table.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Switch, type SwitchProps } from "./switch";

/**
 * Table size variants for row height.
 */
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    size: {
      sm: "[&_td]:py-2 [&_th]:py-2",
      md: "[&_td]:py-3 [&_th]:py-3",
      lg: "[&_td]:py-4 [&_th]:py-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Table component for displaying tabular data.
 *
 * @example
 * \`\`\`tsx
 * <Table size="md" withoutBorder>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Item 1</TableCell>
 *       <TableCell><Badge variant="active">Active</Badge></TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * \`\`\`
 */

export interface TableProps
  extends
    React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Remove outer border from the table */
  withoutBorder?: boolean;
  /** Allow cell content to wrap to multiple lines. By default, content is kept on a single line with horizontal scroll. */
  wrapContent?: boolean;
}

const Table = React.forwardRef(
  ({ className, size, withoutBorder, wrapContent, ...props }: TableProps, ref: React.Ref<HTMLTableElement>) => (
    <div
      className={cn(
        "relative w-full overflow-auto",
        !withoutBorder && "rounded-lg border border-solid border-semantic-border-layout"
      )}
    >
      <table
        ref={ref}
        className={cn(
          tableVariants({ size }),
          !wrapContent && "[&_th]:whitespace-nowrap [&_td]:whitespace-nowrap",
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.Ref<HTMLTableSectionElement>) => (
  <thead
    ref={ref}
    className={cn("bg-[var(--color-neutral-100)] [&_tr]:border-b [&_tr]:border-solid", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Show skeleton loading state instead of children */
  isLoading?: boolean;
  /** Number of skeleton rows to display when loading (default: 5) */
  loadingRows?: number;
  /** Number of skeleton columns to display when loading (default: 5) */
  loadingColumns?: number;
}

const TableBody = React.forwardRef(
  ({ className, isLoading, loadingRows = 5, loadingColumns = 5, children, ...props }: TableBodyProps, ref: React.Ref<HTMLTableSectionElement>) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    >
      {isLoading ? (
        <TableSkeleton rows={loadingRows} columns={loadingColumns} />
      ) : (
        children
      )}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.Ref<HTMLTableSectionElement>) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-solid bg-[var(--color-neutral-100)] font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row with a colored background */
  highlighted?: boolean;
}

const TableRow = React.forwardRef(
  ({ className, highlighted, ...props }: TableRowProps, ref: React.Ref<HTMLTableRowElement>) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-solid border-semantic-border-layout transition-colors",
        highlighted
          ? "bg-semantic-info-surface"
          : "hover:bg-[var(--color-neutral-50)]/50 data-[state=selected]:bg-semantic-bg-ui",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Make this column sticky on horizontal scroll */
  sticky?: boolean;
  /** Sort direction indicator */
  sortDirection?: "asc" | "desc" | null;
  /** Show info icon with tooltip */
  infoTooltip?: string;
}

const TableHead = React.forwardRef(
  (
    { className, sticky, sortDirection, infoTooltip, children, ...props }: TableHeadProps,
    ref: React.Ref<HTMLTableCellElement>
  ) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-semantic-text-muted text-sm [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-[var(--color-neutral-100)] z-10",
        sortDirection && "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortDirection && (
          <span className="text-[var(--color-neutral-400)]">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
        {infoTooltip && (
          <span
            className="text-[var(--color-neutral-400)] cursor-help"
            title={infoTooltip}
          >
            ⓘ
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Make this cell sticky on horizontal scroll */
  sticky?: boolean;
}

const TableCell = React.forwardRef(
  ({ className, sticky, ...props }: TableCellProps, ref: React.Ref<HTMLTableCellElement>) => (
    <td
      ref={ref}
      className={cn(
        "px-4 align-middle text-semantic-text-primary [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-semantic-bg-primary z-10",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>, ref: React.Ref<HTMLTableCaptionElement>) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-semantic-text-muted", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

/**
 * TableSkeleton - Loading state for table rows
 */
export interface TableSkeletonProps {
  /** Number of rows to show */
  rows?: number;
  /** Number of columns to show */
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <div
              className="h-4 bg-semantic-bg-grey rounded animate-pulse"
              style={{
                width: colIndex === 1 ? "80%" : colIndex === 2 ? "30%" : "60%",
              }}
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
TableSkeleton.displayName = "TableSkeleton";

/**
 * TableEmpty - Empty state message
 */
export interface TableEmptyProps {
  /** Number of columns to span */
  colSpan: number;
  /** Custom message or component */
  children?: React.ReactNode;
}

const TableEmpty = ({ colSpan, children }: TableEmptyProps) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="text-center py-8 text-semantic-text-muted"
    >
      {children || "No data available"}
    </TableCell>
  </TableRow>
);
TableEmpty.displayName = "TableEmpty";

/**
 * Avatar component for table cells
 */
export interface TableAvatarProps {
  /** Initials to display */
  initials: string;
  /** Background color */
  color?: string;
}

const TableAvatar = ({ initials, color = "#7C3AED" }: TableAvatarProps) => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
);
TableAvatar.displayName = "TableAvatar";

/**
 * Switch component optimized for table cells (previously TableToggle)
 */
export interface TableToggleProps extends Omit<SwitchProps, "size"> {
  /** Size of the switch - defaults to 'sm' for tables */
  size?: "sm" | "default";
}

const TableToggle = React.forwardRef(
  ({ size = "sm", ...props }: TableToggleProps, ref: React.Ref<HTMLButtonElement>) => (
    <Switch ref={ref} size={size} {...props} />
  )
);
TableToggle.displayName = "TableToggle";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSkeleton,
  TableEmpty,
  TableAvatar,
  TableToggle,
  tableVariants,
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
      "inline-flex items-center border-b border-solid border-semantic-border-layout w-full",
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
      "inline-flex items-center justify-center gap-2 whitespace-nowrap py-3 px-3 text-sm font-medium border-b-2 border-solid -mb-px cursor-pointer transition-colors",
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
    },
    "dialog": {
      name: "dialog",
      description: "A modal dialog component built on Radix UI Dialog with size variants and animations",
      category: "overlay",
      dependencies: [
            "@radix-ui/react-dialog@^1.1.15",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "dialog.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>, ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[9999] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-[9999] grid translate-x-[-50%] translate-y-[-50%] gap-4 border border-solid border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        default: "w-full max-w-lg",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface DialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Hide the default close button in the top-right corner */
  hideCloseButton?: boolean;
}

// Helper to check if children contain DialogDescription
const hasDialogDescription = (children: React.ReactNode): boolean => {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DialogDescription) {
        found = true;
      } else {
        const childProps = child.props as { children?: React.ReactNode };
        if (childProps.children) {
          if (hasDialogDescription(childProps.children)) {
            found = true;
          }
        }
      }
    }
  });
  return found;
};

const DialogContent = React.forwardRef(({ className, children, size, hideCloseButton = false, ...props }: DialogContentProps, ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>) => {
  const hasDescription = hasDialogDescription(children);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {/* Accessibility: Add hidden description if none provided */}
        {!hasDescription && (
          <DialogPrimitive.Description className="sr-only">
            Dialog content
          </DialogPrimitive.Description>
        )}
        {!hideCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>, ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>, ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
};
`, prefix),
        },
      ],
    },
    "dropdown-menu": {
      name: "dropdown-menu",
      description: "A dropdown menu component for displaying actions and options",
      category: "overlay",
      dependencies: [
            "@radix-ui/react-dropdown-menu@^2.1.16",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "dropdown-menu.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Trigger>>) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn("focus-visible:outline-none focus-visible:ring-0", className)}
    {...props}
  />
));
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>>) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm text-semantic-text-secondary outline-none focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[state=open]:bg-semantic-bg-ui",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-[9999] min-w-[8rem] overflow-hidden rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] min-w-[8rem] overflow-hidden rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(({ className, inset, children, description, suffix, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    /** Secondary text displayed below children */
    description?: string;
    /** Content displayed at the right edge of the item */
    suffix?: React.ReactNode;
  }, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm text-semantic-text-secondary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {description ? (
      <div className="flex flex-1 flex-col">
        <span>{children}</span>
        <span className="text-xs text-semantic-text-muted">{description}</span>
      </div>
    ) : (
      children
    )}
    {suffix && (
      <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-2">{suffix}</span>
    )}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, description, suffix, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    /** Secondary text displayed below children */
    description?: string;
    /** Content displayed at the right edge of the item */
    suffix?: React.ReactNode;
  }, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm text-semantic-text-secondary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-primary">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {description ? (
      <div className="flex flex-1 flex-col">
        <span>{children}</span>
        <span className="text-xs text-semantic-text-muted">{description}</span>
      </div>
    ) : (
      children
    )}
    {suffix && (
      <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-2">{suffix}</span>
    )}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef(({ className, children, description, suffix, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    /** Secondary text displayed below children */
    description?: string;
    /** Content displayed at the right edge of the item */
    suffix?: React.ReactNode;
  }, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>>) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm text-semantic-text-secondary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-primary">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {description ? (
      <div className="flex flex-1 flex-col">
        <span>{children}</span>
        <span className="text-xs text-semantic-text-muted">{description}</span>
      </div>
    ) : (
      children
    )}
    {suffix && (
      <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-2">{suffix}</span>
    )}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>, ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-semantic-border-layout", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
`, prefix),
        },
      ],
    },
    "tooltip": {
      name: "tooltip",
      description: "A popup that displays information related to an element when hovered or focused",
      category: "overlay",
      dependencies: [
            "@radix-ui/react-tooltip@^1.2.8",
            "clsx",
            "tailwind-merge",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "tooltip.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] overflow-hidden rounded-md bg-semantic-primary px-3 py-1.5 text-xs text-semantic-text-inverted shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-xs whitespace-normal",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>, ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Arrow>>) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-semantic-primary", className)}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
`, prefix),
        },
      ],
    },
    "delete-confirmation-modal": {
      name: "delete-confirmation-modal",
      description: "A confirmation modal requiring text input to confirm deletion",
      category: "overlay",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "dialog",
            "button",
            "input"
      ],
      files: [
        {
          name: "delete-confirmation-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

/**
 * Props for the DeleteConfirmationModal component
 */
export interface DeleteConfirmationModalProps {
  /** Controls modal visibility (controlled mode) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The name of the item being deleted (shown in title) */
  itemName?: string;
  /** Custom title (overrides default) */
  title?: React.ReactNode;
  /** Additional description text */
  description?: React.ReactNode;
  /** Text user must type to confirm (default: "DELETE") */
  confirmText?: string;
  /** Called when user confirms deletion */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for delete button */
  loading?: boolean;
  /** Text for delete button (default: "Delete") */
  deleteButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Additional className for the dialog content */
  className?: string;
}

/**
 * A confirmation modal that requires the user to type a specific text to confirm deletion.
 *
 * @example
 * \`\`\`tsx
 * // Controlled usage
 * <DeleteConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   itemName="webhook"
 *   onConfirm={handleDelete}
 * />
 *
 * // Uncontrolled with trigger
 * <DeleteConfirmationModal
 *   trigger={<Button variant="destructive">Delete</Button>}
 *   itemName="user"
 *   onConfirm={handleDelete}
 * />
 * \`\`\`
 */
const DeleteConfirmationModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      itemName = "item",
      title,
      description,
      confirmText = "DELETE",
      onConfirm,
      onCancel,
      loading = false,
      deleteButtonText = "Delete",
      cancelButtonText = "Cancel",
      trigger,
      className,
    }: DeleteConfirmationModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const isConfirmEnabled = inputValue === confirmText;

    // Reset input when modal closes
    React.useEffect(() => {
      if (!open) {
        setInputValue("");
      }
    }, [open]);

    const handleConfirm = () => {
      if (isConfirmEnabled) {
        onConfirm?.();
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
        setInputValue("");
      }
      onOpenChange?.(newOpen);
    };

    const defaultTitle = \`Are you sure you want to delete this \${itemName}?\`;

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent ref={ref} size="sm" className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title || defaultTitle}</DialogTitle>
            <DialogDescription className={description ? undefined : "sr-only"}>
              {description ||
                "Delete confirmation dialog - this action cannot be undone"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <label
              htmlFor="delete-confirmation-input"
              className="text-sm text-muted-foreground"
            >
              Enter "{confirmText}" in uppercase to confirm
            </label>
            <Input
              id="delete-confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              autoComplete="off"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelButtonText}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isConfirmEnabled || loading}
              loading={loading}
            >
              {deleteButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

export { DeleteConfirmationModal };
`, prefix),
        },
      ],
    },
    "confirmation-modal": {
      name: "confirmation-modal",
      description: "A simple confirmation modal for yes/no decisions",
      category: "overlay",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "dialog",
            "button"
      ],
      files: [
        {
          name: "confirmation-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";

/**
 * Props for the ConfirmationModal component
 */
export interface ConfirmationModalProps {
  /** Controls modal visibility (controlled mode) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Modal title */
  title: React.ReactNode;
  /** Modal description/message */
  description?: React.ReactNode;
  /** Visual style of confirm button */
  variant?: "default" | "destructive";
  /** Called when user confirms */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for confirm button */
  loading?: boolean;
  /** Text for confirm button (default: "Yes") */
  confirmButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Additional className for the dialog content */
  className?: string;
}

/**
 * A simple confirmation modal for yes/no decisions.
 *
 * @example
 * \`\`\`tsx
 * // Controlled usage
 * <ConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Disable Webhook"
 *   description="Are you sure you want to disable this webhook?"
 *   onConfirm={handleDisable}
 * />
 *
 * // Destructive variant
 * <ConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Archive Project"
 *   variant="destructive"
 *   confirmButtonText="Archive"
 *   onConfirm={handleArchive}
 * />
 * \`\`\`
 */
const ConfirmationModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      variant = "default",
      onConfirm,
      onCancel,
      loading = false,
      confirmButtonText = "Yes",
      cancelButtonText = "Cancel",
      trigger,
      className,
    }: ConfirmationModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const handleConfirm = () => {
      onConfirm?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent ref={ref} size="sm" className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className={description ? undefined : "sr-only"}>
              {description || "Confirmation dialog"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelButtonText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={loading}
              loading={loading}
            >
              {confirmButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
ConfirmationModal.displayName = "ConfirmationModal";

export { ConfirmationModal };
`, prefix),
        },
      ],
    },
    "form-modal": {
      name: "form-modal",
      description: "A reusable modal component for forms with consistent layout",
      category: "overlay",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "dialog",
            "button"
      ],
      files: [
        {
          name: "form-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

/**
 * Props for the FormModal component
 */
export interface FormModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal title */
  title: React.ReactNode;
  /** Optional modal description */
  description?: React.ReactNode;
  /** Form content (inputs, selects, etc.) */
  children: React.ReactNode;
  /** Called when user saves/submits the form */
  onSave?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for save button */
  loading?: boolean;
  /** Text for save button (default: "Save") */
  saveButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Disable the save button */
  disableSave?: boolean;
  /** Additional className for the dialog content */
  className?: string;
  /** Size of the dialog */
  size?: "sm" | "default" | "lg" | "xl" | "full";
}

/**
 * A reusable modal component for forms with inputs, selects, and other form controls.
 * Provides consistent layout and spacing for form-based dialogs.
 *
 * @example
 * Basic usage with form fields
 *
 * \`\`\`tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [name, setName] = useState('');
 *
 * <FormModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Edit Profile"
 *   description="Make changes to your profile here."
 *   onSave={handleSave}
 *   loading={loading}
 * >
 *   <div className="grid gap-2">
 *     <label htmlFor="name">Name</label>
 *     <Input id="name" value={name} onChange={e => setName(e.target.value)} />
 *   </div>
 * </FormModal>
 * \`\`\`
 */
const FormModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      onSave,
      onCancel,
      loading = false,
      saveButtonText = "Save",
      cancelButtonText = "Cancel",
      disableSave = false,
      className,
      size = "sm",
    }: FormModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const handleSave = () => {
      onSave?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} size={size} className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Form content with consistent spacing */}
          <div className="grid gap-4 py-4">{children}</div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelButtonText}
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={loading || disableSave}
              loading={loading}
            >
              {saveButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
FormModal.displayName = "FormModal";

export { FormModal };
`, prefix),
        },
      ],
    },
    "tag": {
      name: "tag",
      description: "A tag component for event labels with optional bold label prefix",
      category: "feedback",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "tag.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva("inline-flex items-center rounded text-sm", {
  variants: {
    variant: {
      default: "bg-semantic-bg-ui text-semantic-text-primary",
      primary: "bg-semantic-bg-ui text-semantic-text-primary",
      accent: "bg-semantic-primary-surface text-semantic-text-secondary",
      secondary: "bg-semantic-bg-grey text-[var(--color-neutral-700)]",
      success: "bg-semantic-success-surface text-semantic-success-primary",
      warning: "bg-semantic-warning-surface text-semantic-warning-primary",
      error: "bg-semantic-error-surface text-semantic-error-primary",
      destructive: "bg-semantic-error-surface text-semantic-error-primary",
    },
    size: {
      default: "px-2 py-1",
      sm: "px-1.5 py-0.5 text-xs",
      lg: "px-3 py-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/**
 * Tag component for displaying event labels and categories.
 *
 * @example
 * \`\`\`tsx
 * <Tag>After Call Event</Tag>
 * <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
 * \`\`\`
 */
export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Bold label prefix displayed before the content */
  label?: string;
}

const Tag = React.forwardRef(
  ({ className, variant, size, label, children, ...props }: TagProps, ref: React.Ref<HTMLSpanElement>) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {label && <span className="font-semibold mr-1">{label}</span>}
        <span className="font-normal inline-flex items-center gap-1">{children}</span>
      </span>
    );
  }
);
Tag.displayName = "Tag";

/**
 * TagGroup component for displaying multiple tags with overflow indicator.
 *
 * @example
 * \`\`\`tsx
 * <TagGroup
 *   tags={[
 *     { label: "In Call Event:", value: "Call Begin, Start Dialing" },
 *     { label: "Whatsapp Event:", value: "message.Delivered" },
 *     { value: "After Call Event" },
 *   ]}
 *   maxVisible={2}
 * />
 * \`\`\`
 */
export interface TagGroupProps {
  /** Array of tags to display */
  tags: Array<{ label?: string; value: string }>;
  /** Maximum number of tags to show before overflow (default: 2) */
  maxVisible?: number;
  /** Tag variant */
  variant?: TagProps["variant"];
  /** Tag size */
  size?: TagProps["size"];
  /** Additional className for the container */
  className?: string;
}

const TagGroup = ({
  tags,
  maxVisible = 2,
  variant,
  size,
  className,
}: TagGroupProps) => {
  const visibleTags = tags.slice(0, maxVisible);
  const overflowCount = tags.length - maxVisible;

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {visibleTags.map((tag, index) => {
        const isLastVisible =
          index === visibleTags.length - 1 && overflowCount > 0;

        if (isLastVisible) {
          return (
            <div key={index} className="flex items-center gap-2">
              <Tag label={tag.label} variant={variant} size={size}>
                {tag.value}
              </Tag>
              <Tag variant={variant} size={size}>
                +{overflowCount} more
              </Tag>
            </div>
          );
        }

        return (
          <Tag key={index} label={tag.label} variant={variant} size={size}>
            {tag.value}
          </Tag>
        );
      })}
    </div>
  );
};
TagGroup.displayName = "TagGroup";

export { Tag, TagGroup, tagVariants };
`, prefix),
        },
      ],
    },
    "alert": {
      name: "alert",
      description: "A dismissible alert component for notifications, errors, warnings, and success messages with icons, actions, and controlled visibility",
      category: "feedback",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: "alert.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Alert variants for different notification types.
 * Colors are hardcoded for Bootstrap compatibility.
 */
const alertVariants = cva(
  "relative w-full rounded border border-solid p-4 text-sm text-semantic-text-primary [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-semantic-bg-ui border-semantic-border-layout [&>svg]:text-semantic-text-primary",
        success:
          "bg-semantic-success-surface border-semantic-success-border [&>svg]:text-semantic-success-primary",
        error:
          "bg-semantic-error-surface border-semantic-error-border [&>svg]:text-semantic-error-primary",
        destructive:
          "bg-semantic-error-surface border-semantic-error-border [&>svg]:text-semantic-error-primary",
        warning:
          "bg-semantic-warning-surface border-semantic-warning-border [&>svg]:text-semantic-warning-primary",
        info: "bg-semantic-info-surface border-semantic-info-border [&>svg]:text-semantic-info-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Default icons for each alert variant
 */
const defaultIcons: Record<string, React.ReactNode> = {
  default: <Info className="size-5" />,
  success: <CheckCircle2 className="size-5" />,
  error: <XCircle className="size-5" />,
  destructive: <XCircle className="size-5" />,
  warning: <AlertTriangle className="size-5" />,
  info: <Info className="size-5" />,
};

/**
 * Dismissible alert banners for notifications, errors, warnings, and success messages.
 *
 * @example
 * \`\`\`tsx
 * // Simple alert
 * <Alert variant="success">
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 *
 * // With close button and actions
 * <Alert
 *   variant="error"
 *   closable
 *   onClose={() => console.log('closed')}
 *   action={<Button size="sm">Retry</Button>}
 * >
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 *
 * // Controlled visibility
 * const [open, setOpen] = useState(true)
 * <Alert open={open} onClose={() => setOpen(false)} closable>...</Alert>
 * \`\`\`
 */
export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Custom icon to display. Set to null to hide icon. */
  icon?: React.ReactNode | null;
  /** Whether to show the default variant icon (default: true) */
  showIcon?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Primary action element (e.g., button) */
  action?: React.ReactNode;
  /** Secondary action element */
  secondaryAction?: React.ReactNode;
  /** Controlled visibility state */
  open?: boolean;
  /** Initial visibility for uncontrolled mode (default: true) */
  defaultOpen?: boolean;
}

const Alert = React.forwardRef(
  (
    {
      className,
      variant = "default",
      icon,
      showIcon = true,
      closable = false,
      onClose,
      action,
      secondaryAction,
      open: controlledOpen,
      defaultOpen = true,
      children,
      ...props
    }: AlertProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleClose = React.useCallback(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onClose?.();
    }, [isControlled, onClose]);

    if (!isOpen) {
      return null;
    }

    const renderIcon = () => {
      if (icon === null || !showIcon) return null;
      if (icon) return icon;
      return defaultIcons[variant || "default"];
    };

    const hasActions = action || secondaryAction;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(alertVariants({ variant, className }))}
        {...props}
      >
        {renderIcon()}
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex-1">{children}</div>
          {(hasActions || closable) && (
            <div className="flex shrink-0 items-center gap-2">
              {secondaryAction}
              {action}
              {closable && (
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    "rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    variant === "default" && "focus:ring-semantic-text-primary",
                    variant === "success" &&
                      "focus:ring-semantic-success-primary",
                    (variant === "error" || variant === "destructive") &&
                      "focus:ring-semantic-error-primary",
                    variant === "warning" &&
                      "focus:ring-semantic-warning-primary",
                    variant === "info" && "focus:ring-semantic-info-primary"
                  )}
                  aria-label="Close alert"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

/**
 * Alert title component for the heading text.
 */
const AlertTitle = React.forwardRef(({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>, ref: React.Ref<HTMLHeadingElement>) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

/**
 * Alert description component for the body text.
 */
const AlertDescription = React.forwardRef(({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>, ref: React.Ref<HTMLParagraphElement>) => (
  <p ref={ref} className={cn("m-0 mt-1 text-sm", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
`, prefix),
        },
      ],
    },
    "toast": {
      name: "toast",
      description: "A toast notification component for displaying brief messages at screen corners, with auto-dismiss and stacking support",
      category: "feedback",
      dependencies: [
            "@radix-ui/react-toast@^1.2.15",
            "class-variance-authority",
            "lucide-react",
            "clsx",
            "tailwind-merge",
            "tailwindcss-animate"
      ],
      files: [
        {
          name: "toast.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[9999999] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[5px] border border-solid p-3 shadow-md transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default:
          "border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary",
        success:
          "border-transparent bg-semantic-success-surface text-semantic-text-primary",
        error:
          "border-transparent bg-semantic-error-surface text-semantic-text-primary",
        warning:
          "border-transparent bg-semantic-warning-surface text-semantic-text-primary",
        info: "border-transparent bg-semantic-info-surface text-semantic-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded border border-solid border-semantic-border-layout bg-transparent px-3 text-sm font-medium transition-colors hover:bg-semantic-bg-ui focus:outline-none focus:ring-2 focus:ring-semantic-info-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.success]:border-semantic-success-primary/30 group-[.success]:hover:border-semantic-success-primary/50 group-[.success]:hover:bg-semantic-success-primary/10",
      "group-[.error]:border-semantic-error-primary/30 group-[.error]:hover:border-semantic-error-primary/50 group-[.error]:hover:bg-semantic-error-primary/10",
      "group-[.warning]:border-semantic-warning-primary/30 group-[.warning]:hover:border-semantic-warning-primary/50 group-[.warning]:hover:bg-semantic-warning-primary/10",
      "group-[.info]:border-semantic-info-primary/30 group-[.info]:hover:border-semantic-info-primary/50 group-[.info]:hover:bg-semantic-info-primary/10",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "shrink-0 rounded p-0.5 text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus:outline-none focus:ring-2 focus:ring-semantic-border-focus",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold tracking-[0.014px]", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>, ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs tracking-[0.048px]", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
};

// ============================================================================
// Toast Hook & Toaster Component
// ============================================================================

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 2000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  /**
   * Duration in milliseconds before the toast is removed after dismissal.
   * Defaults to 2000ms (2 seconds).
   */
  duration?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration?: number) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, duration ?? TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        const toastItem = state.toasts.find((t) => t.id === toastId);
        addToRemoveQueue(toastId, toastItem?.duration);
      } else {
        state.toasts.forEach((toastItem) => {
          addToRemoveQueue(toastItem.id, toastItem.duration);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInput = Omit<ToasterToast, "id">;

function toast({ ...props }: ToastInput) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Convenience methods for different variants
toast.success = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "success" });
toast.error = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "error" });
toast.warning = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "warning" });
toast.info = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "info" });
toast.dismiss = (toastId?: string) =>
  dispatch({ type: "DISMISS_TOAST", toastId });

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Variant icons mapping
const variantIcons = {
  default: null,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Toaster component that renders toast notifications.
 * Place this component once at the root of your app.
 *
 * @example
 * \`\`\`tsx
 * // In your App.tsx or layout
 * import { Toaster } from "@/components/ui/toast"
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   )
 * }
 * \`\`\`
 */
function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const Icon = variant ? variantIcons[variant] : null;

        return (
          <Toast
            key={id}
            variant={variant}
            className={variant ?? undefined}
            {...props}
          >
            <div className="flex items-center gap-4">
              {Icon && (
                <Icon
                  className={cn(
                    "size-6 shrink-0",
                    variant === "success" && "text-semantic-success-primary",
                    variant === "error" && "text-semantic-error-primary",
                    variant === "warning" && "text-semantic-warning-primary",
                    variant === "info" && "text-semantic-info-primary"
                  )}
                />
              )}
              <div className="flex flex-col gap-0.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export { useToast, toast, Toaster };

/**
 * Toast notification system using Radix UI primitives.
 *
 * @example
 * \`\`\`tsx
 * // In your App.tsx or layout
 * import { Toaster } from "@/components/ui/toast"
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   )
 * }
 * \`\`\`
 *
 * @example
 * \`\`\`tsx
 * // Trigger toasts from anywhere
 * import { toast } from "@/components/ui/toast"
 *
 * // Simple message
 * toast({ title: "Event has been created" })
 *
 * // Success toast
 * toast.success({
 *   title: "Success!",
 *   description: "Your changes have been saved."
 * })
 *
 * // Error toast
 * toast.error({
 *   title: "Error",
 *   description: "Something went wrong. Please try again."
 * })
 *
 * // Warning toast
 * toast.warning({
 *   title: "Warning",
 *   description: "This action cannot be undone."
 * })
 *
 * // Info toast
 * toast.info({
 *   title: "Info",
 *   description: "You have 3 new notifications."
 * })
 *
 * // With action button
 * toast({
 *   title: "Event created",
 *   action: <ToastAction altText="Undo">Undo</ToastAction>
 * })
 *
 * // Dismiss all toasts
 * toast.dismiss()
 * \`\`\`
 */
`, prefix),
        },
      ],
    },
    "spinner": {
      name: "spinner",
      description: "A loading spinner component with customizable size and color variants for indicating progress",
      category: "feedback",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "spinner.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Spinner variants for loading indicators.
 * Uses semantic color tokens for consistent theming.
 */
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
    variant: {
      default: "text-semantic-primary",
      secondary: "text-semantic-text-secondary",
      muted: "text-semantic-text-muted",
      inverted: "text-white",
      current: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

/**
 * SVG stroke widths that decrease as size increases for visual balance.
 */
const strokeWidths: Record<string, number> = {
  sm: 3,
  default: 3,
  lg: 2.5,
  xl: 2,
};

/**
 * A loading spinner component with customizable size and color variants.
 * Uses a custom SVG circle with a visible track and animated arc.
 *
 * @example
 * \`\`\`tsx
 * <Spinner />
 * <Spinner size="sm" variant="muted" />
 * <Spinner size="lg" variant="current" />
 * <Spinner variant="inverted" aria-label="Saving changes" />
 * \`\`\`
 */
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for the spinner (default: "Loading") */
  "aria-label"?: string;
}

const Spinner = React.forwardRef(
  (
    {
      className,
      size = "default",
      variant,
      "aria-label": ariaLabel = "Loading",
      ...props
    }: SpinnerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const strokeWidth = strokeWidths[size || "default"] ?? 3;
    const radius = 10;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn("inline-flex shrink-0", className)}
        {...props}
      >
        <svg
          className={cn(spinnerVariants({ size, variant }))}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track circle */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            opacity="0.25"
          />
          {/* Active arc */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
`, prefix),
        },
      ],
    },
    "skeleton": {
      name: "skeleton",
      description: "A placeholder loading component with pulse animation for content loading states",
      category: "feedback",
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "skeleton.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Skeleton variants for content placeholders.
 * Uses semantic background tokens for consistent theming.
 */
const skeletonVariants = cva("animate-pulse", {
  variants: {
    variant: {
      default: "bg-semantic-bg-grey",
      subtle: "bg-semantic-bg-ui",
    },
    shape: {
      line: "h-4 w-full rounded",
      circle: "rounded-full",
      rectangle: "rounded",
    },
  },
  defaultVariants: {
    variant: "default",
    shape: "line",
  },
});

/**
 * A placeholder loading component with pulse animation for content loading states.
 * Use shape, width, and height props to match the content being loaded.
 *
 * @example
 * \`\`\`tsx
 * // Text line placeholder
 * <Skeleton />
 *
 * // Avatar placeholder
 * <Skeleton shape="circle" width={40} height={40} />
 *
 * // Image/card placeholder
 * <Skeleton shape="rectangle" width="100%" height={200} />
 *
 * // Subtle variant
 * <Skeleton variant="subtle" />
 * \`\`\`
 */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton (number for px, string for any CSS value) */
  width?: number | string;
  /** Height of the skeleton (number for px, string for any CSS value) */
  height?: number | string;
}

const Skeleton = React.forwardRef(
  ({ className, variant, shape, width, height, style, ...props }: SkeletonProps, ref: React.Ref<HTMLDivElement>) => {
    const dimensionStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined
        ? { width: typeof width === "number" ? \`\${width}px\` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? \`\${height}px\` : height }
        : {}),
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant, shape, className }))}
        style={dimensionStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
`, prefix),
        },
      ],
    },
    "empty-state": {
      name: "empty-state",
      description: "Centered empty state with icon, title, description, and optional action buttons",
      category: "feedback",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: "empty-state.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps {
  /** Icon element rendered inside the icon circle */
  icon?: React.ReactNode;
  /** Bold heading text */
  title: React.ReactNode;
  /** Optional subtitle / description text */
  description?: React.ReactNode;
  /** Optional action buttons rendered below the description */
  actions?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="bg-semantic-primary-surface rounded-[40px] size-[90px] flex items-center justify-center text-semantic-text-secondary">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          {title}
        </p>
        {description && (
          <p className="m-0 text-sm text-semantic-text-muted max-w-xs">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-4">{actions}</div>
      )}
    </div>
  );
}
EmptyState.displayName = "EmptyState";

export { EmptyState };
`, prefix),
        },
      ],
    },
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
        "border border-solid border-semantic-border-layout rounded-lg divide-y divide-semantic-border-layout",
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
          showBorder && "border-b border-solid border-semantic-border-layout",
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
  "border-l border-solid border-semantic-border-layout bg-semantic-bg-primary flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0",
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
            <div className="flex items-center gap-3 px-4 h-14 border-b border-solid border-semantic-border-layout shrink-0">
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
            <div className="flex gap-3 px-4 py-3 shrink-0 border-t border-solid border-semantic-border-layout">
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
    },
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
export const EventSelector = React.forwardRef(
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
    }: EventSelectorProps,
    ref: React.Ref<HTMLDivElement>
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
                className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden"
              >
                {/* Category Header - no checkbox, just label */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-solid border-semantic-border-layout">
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
        <div className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden divide-y divide-semantic-border-layout">
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
export const EventGroupComponent = React.forwardRef(
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
    }: EventGroupComponentProps & React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
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
              <div className="border-t border-solid border-semantic-border-layout">
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
export const EventItemComponent = React.forwardRef(({ event, isSelected, onSelectionChange, className, ...props }: EventItemComponentProps & React.HTMLAttributes<HTMLDivElement>, ref: React.Ref<HTMLDivElement>) => {
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
export const KeyValueInput = React.forwardRef(
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
    }: KeyValueInputProps,
    ref: React.Ref<HTMLDivElement>
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
export const KeyValueRow = React.forwardRef(
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
    }: KeyValueRowProps & React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
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
export const ApiFeatureCard = React.forwardRef(
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
    }: ApiFeatureCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-lg border border-solid border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--semantic-bg-primary,#FFFFFF)] p-6 overflow-hidden",
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
          <div className="flex flex-col gap-2.5 border-t border-solid border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--color-neutral-50,#FAFAFA)] -mx-6 -mb-6 p-6">
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
export const EndpointDetails = React.forwardRef(
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
    }: EndpointDetailsProps,
    ref: React.Ref<HTMLDivElement>
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
          "flex flex-col gap-6 rounded-lg border border-solid border-semantic-border-layout p-6",
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
            <div className="flex items-center justify-between border-t border-solid border-semantic-border-layout pt-6">
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
export const AlertConfiguration = React.forwardRef(
  (
    {
      minimumBalance,
      minimumTopup,
      currencySymbol = "₹",
      onEdit,
      className,
    }: AlertConfigurationProps,
    ref: React.Ref<HTMLDivElement>
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
          "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary",
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
        <div className="border-t border-solid border-semantic-border-layout px-4 py-4">
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
export const AlertValuesModal = React.forwardRef(
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
    }: AlertValuesModalProps,
    ref: React.Ref<HTMLDivElement>
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
export const AutoPaySetup = React.forwardRef(
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
    }: AutoPaySetupProps,
    ref: React.Ref<HTMLDivElement>
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
              <div className="flex flex-col gap-4 border-t border-solid border-semantic-border-layout pt-4">
                {/* Description */}
                {bodyText && (
                  <div className="m-0 text-sm font-normal text-semantic-text-primary leading-5 tracking-[0.035px]">
                    {bodyText}
                  </div>
                )}

                {/* Note callout */}
                {noteText && (
                  <div className="rounded bg-[var(--semantic-info-25,#f0f7ff)] border border-solid border-[#BEDBFF] px-4 py-3">
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
export const BankDetails = React.forwardRef(
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
    }: BankDetailsProps,
    ref: React.Ref<HTMLDivElement>
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
              <div className="border-t border-solid border-semantic-border-layout pt-4">
                <div className="rounded-md border border-solid border-[var(--semantic-info-200,#e8f1fc)] bg-[var(--semantic-info-25,#f6f8fd)] p-3">
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
          "flex items-center justify-between gap-2 w-full px-3 py-2 rounded-md border border-solid text-sm transition-colors outline-none",
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
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-lg p-3">
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
export const PaymentSummary = React.forwardRef(
  ({ items = [], summaryItems, className, title, headerInfo, subtotal, breakdownCard, creditLimit }: PaymentSummaryProps, ref: React.Ref<HTMLDivElement>) => {
    const hasItemsBorder =
      items.length > 0 &&
      (!!subtotal || !!breakdownCard || (summaryItems && summaryItems.length > 0));

    return (
      <TooltipProvider delayDuration={100}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-5",
            className
          )}
        >
          <div className="flex flex-col gap-4">
            {/* Header: title + wallet info badge */}
            {(title || headerInfo) && (
              <div className="flex items-center justify-between border-b border-solid border-semantic-border-layout pb-4">
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
                  hasItemsBorder && "border-b border-solid border-semantic-border-layout pb-4"
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
              <div className="rounded-lg border border-solid border-semantic-border-layout bg-semantic-info-surface px-4 py-4 flex flex-col gap-2.5">
                <div
                  className={cn(
                    "flex flex-col gap-2.5",
                    breakdownCard.bottomItems &&
                      breakdownCard.bottomItems.length > 0 &&
                      "border-b border-solid border-semantic-border-layout pb-2.5"
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
              <div className="flex items-center justify-between border-t border-solid border-semantic-border-layout pt-3">
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
export const PaymentOptionCard = React.forwardRef(
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
    }: PaymentOptionCardProps,
    ref: React.Ref<HTMLDivElement>
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
          "relative w-full rounded-lg bg-background border-b border-solid border-[#e4e4e4] p-6",
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
                    "flex items-center gap-2.5 w-full rounded-lg border border-solid p-3 text-left transition-colors cursor-pointer bg-transparent",
                    isSelected
                      ? "border-[var(--semantic-brand)] border-solid"
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
export const PaymentOptionCardModal = React.forwardRef(
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
    }: PaymentOptionCardModalProps,
    ref: React.Ref<HTMLDivElement>
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

const PlanDetailModal = React.forwardRef(
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
    }: PlanDetailModalProps,
    ref: React.Ref<HTMLDivElement>
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
            <div className="flex items-center justify-between px-8 py-4 border-b border-solid border-semantic-border-layout">
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
                <div className="w-full overflow-x-auto rounded border border-solid border-semantic-border-layout">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-semantic-bg-ui">
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout w-[44%]">
                          Feature
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout w-[28%]">
                          Free
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout w-[28%]">
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
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-solid border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.name}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-solid border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.free}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-solid border-semantic-border-layout">
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
              <div className="flex items-center px-8 py-4 border-t border-solid border-semantic-border-layout">
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
  "flex flex-col gap-6 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const billingCycleOptionVariants = cva(
  "flex w-full items-center gap-2.5 rounded-lg border border-solid bg-semantic-bg-primary p-3 text-left transition-colors",
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

const PlanUpgradeModal = React.forwardRef(
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
    }: PlanUpgradeModalProps,
    ref: React.Ref<HTMLDivElement>
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
  "flex flex-col gap-8 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const summaryPanelVariants = cva(
  "flex flex-col gap-5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui p-4"
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

const PlanUpgradeSummaryModal = React.forwardRef(
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
    }: PlanUpgradeSummaryModalProps,
    ref: React.Ref<HTMLDivElement>
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

              <div className="flex items-center justify-between gap-6 border-t border-solid border-semantic-border-layout pt-3">
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
import { CircleCheck } from "lucide-react";
import type { LetUsDriveCardProps } from "./types";

/**
 * LetUsDriveCard displays a managed service offering with pricing, billing
 * frequency badge, and a CTA. Used in the "Let us drive — Full-service
 * management" section of the pricing page.
 *
 * Supports expandable "Show details" / "Hide details" with an "Includes:"
 * checklist when detailsContent is provided. Supports controlled expanded
 * state (expanded / onExpandedChange) for accordion behavior on PricingPage.
 *
 * @example
 * \`\`\`tsx
 * <LetUsDriveCard
 *   title="Account Manager"
 *   price="15,000"
 *   period="/month"
 *   billingBadge="Annually"
 *   description="One expert who knows your business. And moves it forward."
 *   detailsContent={{ heading: "Includes:", items: [{ title: "Start Your Channels", description: "Get help setting up." }] }}
 *   onShowDetails={() => console.log("details")}
 *   onCtaClick={() => console.log("talk")}
 * />
 * \`\`\`
 */
const LetUsDriveCard = React.forwardRef(
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
      hideDetailsLabel = "Hide details",
      ctaLabel = "Talk to us",
      detailsContent,
      expanded: controlledExpanded,
      onExpandedChange,
      onShowDetails,
      onCtaClick,
      className,
      ...props
    }: LetUsDriveCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(false);
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : internalExpanded;

    const hasExpandableDetails = detailsContent && detailsContent.items.length > 0;
    const showDetailsLink = hasExpandableDetails || onShowDetails;

    const handleDetailsClick = () => {
      if (hasExpandableDetails) {
        const next = !expanded;
        if (!isControlled) setInternalExpanded(next);
        onExpandedChange?.(next);
        if (next) onShowDetails?.();
      } else {
        onShowDetails?.();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-0 flex-col gap-6 rounded-[14px] border border-solid border-semantic-border-layout bg-card p-5 shadow-sm",
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

        {/* Price section — min-height so "Includes:" starts at same vertical position across cards when details are expanded */}
        <div className="flex min-h-[7rem] flex-col gap-2.5">
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

        {/* Bottom section: flex-1 fills space so "Hide details" and button align across cards; flex column, button at bottom */}
        <div className="mt-auto flex min-h-0 flex-1 flex-col gap-3 w-full">
          {showDetailsLink && !(hasExpandableDetails && expanded) && (
            <>
              <div className="min-h-0 flex-1" aria-hidden />
              <Button
                variant="link"
                className="text-semantic-text-link p-0 h-auto min-w-0 justify-start shrink-0"
                onClick={handleDetailsClick}
              >
                {showDetailsLabel}
              </Button>
            </>
          )}
          {!showDetailsLink && <div className="min-h-0 flex-1" aria-hidden />}
          {hasExpandableDetails && expanded && (
            <>
              <div
                className="flex min-h-0 flex-1 flex-col gap-3 w-full border-t border-solid border-semantic-border-layout pt-4"
                data-testid="let-us-drive-details-block"
              >
                <p className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px] m-0">
                  {detailsContent.heading ?? "Includes:"}
                </p>
                <ul className="flex flex-col gap-3 list-none m-0 p-0" aria-label="Included features">
                  {detailsContent.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex w-4 shrink-0 items-start" aria-hidden>
                        <CircleCheck className="size-4 text-semantic-success-primary" />
                      </span>
                      <span className="min-w-0 flex-1 text-left text-sm text-semantic-text-secondary tracking-[0.035px] leading-[20px]">
                        <strong className="font-semibold text-semantic-text-primary">
                          {item.title}
                        </strong>
                        {" "}
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="link"
                className="text-semantic-text-link p-0 h-auto min-w-0 justify-start shrink-0"
                onClick={handleDetailsClick}
              >
                {hideDetailsLabel}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="min-h-[44px] w-full shrink-0 rounded-[4px]"
            onClick={onCtaClick}
          >
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
 * A single item in the expandable "Includes" details block (bold title + description).
 */
export interface LetUsDriveDetailsItem {
  /** Bold title (e.g., "Start Your Channels") */
  title: string;
  /** Description text (e.g., "Get help setting up your Call and WhatsApp channels.") */
  description: string;
}

/**
 * Content for the expandable "Show details" / "Hide details" section.
 * When provided, the card shows an "Includes:"-style block with checklist items.
 */
export interface LetUsDriveDetailsContent {
  /** Heading above the list (default: "Includes:") */
  heading?: string;
  /** Checklist items (title in bold, description in regular weight) */
  items: LetUsDriveDetailsItem[];
}

/**
 * Props for the LetUsDriveCard component. Modular and reusable across screens (e.g. managed services, add-on offerings, or any service card with pricing and expandable details).
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
  /** Text for the details link when collapsed (default: "Show details") */
  showDetailsLabel?: string;
  /** Text for the details link when expanded (default: "Hide details") */
  hideDetailsLabel?: string;
  /** CTA button text (default: "Talk to us") */
  ctaLabel?: string;
  /**
   * Expandable details content. When provided, the card shows "Show details" / "Hide details"
   * and an expandable "Includes:"-style block. Omit for link-only (onShowDetails callback only).
   */
  detailsContent?: LetUsDriveDetailsContent;
  /** Controlled expanded state for the details block (use with onExpandedChange) */
  expanded?: boolean;
  /** Callback when expanded state changes (for controlled mode / PricingPage accordion) */
  onExpandedChange?: (expanded: boolean) => void;
  /** Callback when "Show details" link is clicked (still fired when using detailsContent) */
  onShowDetails?: () => void;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { LetUsDriveCard } from "./let-us-drive-card";
export type {
  LetUsDriveCardProps,
  LetUsDriveDetailsContent,
  LetUsDriveDetailsItem,
} from "./types";
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
const PowerUpCard = React.forwardRef(
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
    }: PowerUpCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-between gap-8 rounded-md border border-solid border-semantic-border-layout bg-card p-5",
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
 * Props for the PowerUpCard component. Modular and reusable across screens (e.g. pricing page power-ups, add-ons, or any feature card with icon, price, description, and CTA).
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
const PricingCard = React.forwardRef(
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
      ctaLoading = false,
      ctaDisabled = false,
      onCtaClick,
      onFeatureDetails,
      addon,
      usageDetails,
      infoText,
      className,
      ...props
    }: PricingCardProps,
    ref: React.Ref<HTMLDivElement>
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
          "flex flex-col gap-6 rounded-t-xl rounded-b-lg border border-solid border-semantic-border-layout p-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-4 rounded-t-xl rounded-b-lg p-4"
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
              variant={isCurrentPlan ? "secondary" : "default"}
              className="w-full"
              onClick={onCtaClick}
              loading={ctaLoading}
              disabled={ctaDisabled || isCurrentPlan}
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

        {/* Bottom sections pushed to card bottom for grid alignment */}
        {(addon || (usageDetails && usageDetails.length > 0)) && (
          <div className="mt-auto flex flex-col gap-6">
            {/* Addon */}
            {addon && (
              <div className="flex items-center gap-2.5 rounded-md bg-[var(--color-info-25)] border border-solid border-[#f3f5f6] pl-4 py-2.5">
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
              <div className="flex flex-col gap-2.5 rounded-md bg-[var(--color-info-25)] border border-solid border-[#f3f5f6] px-4 py-2.5">
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

const CompactCarIcon = React.forwardRef(
  ({ className, ...props }: PlanIconProps, ref: React.Ref<SVGSVGElement>) => (
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

const SedanCarIcon = React.forwardRef(
  ({ className, ...props }: PlanIconProps, ref: React.Ref<SVGSVGElement>) => (
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

const SuvCarIcon = React.forwardRef(
  ({ className, ...props }: PlanIconProps, ref: React.Ref<SVGSVGElement>) => (
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
 * Reusable CTA state for a single plan card (loading/disabled).
 * Use on PricingCard via ctaLoading/ctaDisabled, or in arrays for
 * screens that render multiple plan cards (e.g. planCardCtaStates on PricingPage).
 */
export interface PlanCardCtaState {
  /** Show loading spinner on the CTA and make it non-interactive */
  loading?: boolean;
  /** Disable the CTA button (e.g. current plan or pending action) */
  disabled?: boolean;
}

/**
 * Props for the PricingCard component. Modular and reusable across screens (e.g. plan selection grid, comparison view, or any plan card with features and CTA).
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
  /** Show loading spinner on CTA button and make it non-interactive. Reusable on any screen that renders PricingCard. */
  ctaLoading?: boolean;
  /** Disable the CTA button (e.g. current plan or pending action). Reusable on any screen that renders PricingCard. */
  ctaDisabled?: boolean;
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
  PlanCardCtaState,
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
const PricingPage = React.forwardRef(
  (
    {
      title = "Select business plan",
      headerActions,
      tabs = [],
      showCategoryToggle = true,
      activeTab: controlledTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod: controlledBilling,
      onBillingPeriodChange,
      planCards = [],
      planCardCtaStates,
      powerUpCards = [],
      powerUpsTitle = "Power-ups and charges",
      featureComparisonText = "See full feature comparison",
      onFeatureComparisonClick,
      letUsDriveCards = [],
      letUsDriveTitle = "Let us drive — Full-service management",
      className,
      ...props
    }: PricingPageProps,
    ref: React.Ref<HTMLDivElement>
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
          {tabs.length > 0 && showCategoryToggle && (
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
              {planCards.map((cardProps, index) => {
                const ctaState = planCardCtaStates?.[index];
                const merged = { ...cardProps };
                if (ctaState) {
                  if (ctaState.loading !== undefined)
                    merged.ctaLoading = ctaState.loading;
                  if (ctaState.disabled !== undefined)
                    merged.ctaDisabled = ctaState.disabled;
                }
                return <PricingCard key={index} {...merged} />;
              })}
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

              {/* Service cards — items-start so expanding one card doesn't stretch others */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
import type { PlanCardCtaState, PricingCardProps } from "../pricing-card/types";
import type { PowerUpCardProps } from "../power-up-card/types";
import type { LetUsDriveCardProps } from "../let-us-drive-card/types";
import type { PricingToggleTab } from "../pricing-toggle/types";

export type { PricingToggleTab };


/**
 * Props for the PricingPage component.
 *
 * PricingPage is a layout compositor that orchestrates PricingToggle,
 * PricingCard, PowerUpCard, LetUsDriveCard, and PageHeader into
 * the full plan selection page. Modular and reusable across screens:
 * use the full page layout, or compose sections elsewhere with the same
 * sub-components (PricingCard, PowerUpCard, LetUsDriveCard, etc.).
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
  /** When false, the category toggle (e.g. Team-Led Plans / Go-AI First) is hidden. Default true. */
  showCategoryToggle?: boolean;
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
  /**
   * Optional CTA state per plan card (loading/disabled). Reusable across any screen that renders plan cards.
   * Index matches planCards: [0] = first card CTA, [1] = second, [2] = third.
   * Overrides ctaLoading/ctaDisabled on the card when provided.
   */
  planCardCtaStates?: PlanCardCtaState[];

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
export type { PlanCardCtaState } from "../pricing-card/types";
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
const PricingToggle = React.forwardRef(
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
    }: PricingToggleProps,
    ref: React.Ref<HTMLDivElement>
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
          content: prefixTailwindClasses(`/** A single tab option in the plan tab selector. Reusable for any tabbed plan/category selector. */
export interface PricingToggleTab {
  /** Display label for the tab */
  label: string;
  /** Unique value identifier for the tab */
  value: string;
}

/** Props for the PricingToggle component. Modular and reusable across screens (e.g. plan-type selector, billing toggle). */
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
  primaryActionLoading = false,
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
            <Button
              loading={primaryActionLoading}
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
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
const MyOperatorChatIcon = React.forwardRef(
  ({ className, ...props }: BrandIconProps, ref: React.Ref<SVGSVGElement>) => (
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
 * Props for the TalkToUsModal component. Modular and reusable across screens (e.g. triggered from PowerUpCard, pricing CTAs, or any "contact support" flow).
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
  /** Show loading spinner on the primary CTA and make it non-interactive. Reusable across screens. */
  primaryActionLoading?: boolean;
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
      description: "AI Bot management components — BotList, BotListHeader, BotListSearch, BotListCreateCard, BotListGrid, BotCard, CreateBotModal",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "badge",
            "button",
            "dialog",
            "dropdown-menu",
            "tooltip"
      ],
      isMultiFile: true,
      directory: "bots",
      mainFile: "bot-list.tsx",
      files: [
        {
          name: "bot-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { MessageSquare, Phone, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../dropdown-menu";
import type { Bot, BotCardProps, BotType } from "./types";

const DEFAULT_TYPE_LABELS: Record<BotType, string> = {
  chatbot: "Chatbot",
  voicebot: "Voicebot",
};

function getTypeLabel(
  bot: Bot,
  typeLabels?: Partial<Record<BotType, string>>
): string {
  if (bot.typeLabel) return bot.typeLabel;
  const custom = typeLabels?.[bot.type];
  if (custom) return custom;
  return DEFAULT_TYPE_LABELS[bot.type];
}

/**
 * Single card component for both Chatbot and Voicebot.
 * All displayed data (icon, badge, name, count, last published) comes from the \`bot\` prop.
 * Set bot.type to "chatbot" or "voicebot"; no separate card components needed.
 */
export const BotCard = React.forwardRef(
  ({ bot, typeLabels, onEdit, onDelete, className, ...props }: BotCardProps, ref: React.Ref<HTMLDivElement>) => {
    const typeLabel = getTypeLabel(bot, typeLabels);
    const isChatbot = bot.type === "chatbot";

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onEdit && !(e.target as HTMLElement).closest("[data-bot-card-action]")) {
        onEdit(bot.id);
      }
    };

    const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onEdit && !(e.target as HTMLElement).closest("[data-bot-card-action]")) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(bot.id);
        }
      }
    };

    return (
      <div
        ref={ref}
        role={onEdit ? "button" : undefined}
        tabIndex={onEdit ? 0 : undefined}
        aria-label={onEdit ? \`Edit \${bot.name}\` : undefined}
        onClick={onEdit ? handleCardClick : undefined}
        onKeyDown={onEdit ? handleCardKeyDown : undefined}
        className={cn(
          "relative bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-[5px] min-w-0 max-w-full overflow-hidden flex flex-col",
          "shadow-[0px_4px_15.1px_0px_rgba(0,0,0,0.06)] p-3 sm:p-4 md:p-5",
          "min-h-[180px] sm:min-h-[207px] h-full shrink-0",
          onEdit && "cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Top row: icon + badge + menu */}
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4 min-w-0">
          <div className="flex items-center justify-center size-8 sm:size-[38px] rounded-full bg-semantic-info-surface shrink-0">
            {isChatbot ? (
              <MessageSquare className="size-4 sm:size-5 text-semantic-text-secondary" />
            ) : (
              <Phone className="size-4 sm:size-5 text-semantic-text-secondary" />
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
            <Badge variant="outline" className="text-xs font-normal shrink-0">
              {typeLabel}
            </Badge>

            <span data-bot-card-action className="inline-flex" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-2 min-h-[44px] min-w-[44px] sm:p-1 sm:min-h-0 sm:min-w-0 rounded hover:bg-semantic-bg-hover text-semantic-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus flex items-center justify-center touch-manipulation"
                    aria-label="More options"
                  >
                    <MoreVertical className="size-4 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm"
                    onSelect={(e) => { e.preventDefault(); onEdit?.(bot.id); }}
                  >
                    <Pencil className="size-4 shrink-0" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-semantic-error-primary focus:bg-semantic-error-surface focus:text-semantic-error-primary"
                        onSelect={(e) => { e.preventDefault(); onDelete(bot.id); }}
                      >
                        <Trash2 className="size-4 shrink-0 text-semantic-error-primary" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>

        {/* Bot name */}
        <h3 className="m-0 text-sm sm:text-base font-normal text-semantic-text-primary line-clamp-1 mb-1 min-w-0">
          {bot.name}
        </h3>

        {/* Conversations count */}
        <p className="m-0 text-xs sm:text-sm text-semantic-text-muted mb-3 sm:mb-4">
          {bot.conversationCount.toLocaleString()} Conversations
        </p>

        {/* Divider */}
        <div className="border-t border-solid border-semantic-border-layout mb-2 sm:mb-3 mt-auto" />

        {/* Last published */}
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
          {bot.status === "draft" ? (
            <p className="m-0 text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px] flex items-center justify-start gap-5">
              Last Published
              <span className="text-xs font-normal text-semantic-error-primary flex items-center gap-1.5 shrink-0">
                <span className="size-1.5 rounded-full bg-semantic-error-primary shrink-0" aria-hidden />
                Unpublished changes
              </span>
            </p>
          ) : (
            <span className="text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px]">
              Last Published
            </span>
          )}
          {(bot.lastPublishedBy || bot.lastPublishedDate) ? (
            <p className="m-0 text-xs sm:text-sm text-semantic-text-muted line-clamp-1">
              {bot.lastPublishedBy
                ? \`\${bot.lastPublishedBy} | \${bot.lastPublishedDate ?? "—"}\`
                : bot.lastPublishedDate}
            </p>
          ) : bot.status !== "draft" ? (
            <p className="m-0 text-xs sm:text-sm text-semantic-text-muted">—</p>
          ) : null}
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { BOT_TYPE, type CreateBotModalProps, type BotType } from "./types";

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

function getFirstEnabledBotType(
  chatbotDisabled: boolean,
  voicebotDisabled: boolean
): BotType {
  if (!chatbotDisabled) return "chatbot";
  if (!voicebotDisabled) return "voicebot";
  return "chatbot";
}

function isBotTypeDisabled(
  type: BotType,
  chatbotDisabled: boolean,
  voicebotDisabled: boolean
): boolean {
  return (
    (type === "chatbot" && chatbotDisabled) ||
    (type === "voicebot" && voicebotDisabled)
  );
}

export const CreateBotModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      onSubmit,
      isLoading,
      chatbotDisabled = false,
      voicebotDisabled = false,
      chatbotDisabledTooltip,
      voicebotDisabledTooltip,
      className,
    }: CreateBotModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState("");
    const [selectedType, setSelectedType] = React.useState<BotType>("chatbot");

    const chatD = Boolean(chatbotDisabled);
    const voiceD = Boolean(voicebotDisabled);

    React.useEffect(() => {
      if (!open) {
        setName("");
        setSelectedType(getFirstEnabledBotType(chatD, voiceD));
        return;
      }
      setSelectedType((prev) => {
        if (!isBotTypeDisabled(prev, chatD, voiceD)) return prev;
        return getFirstEnabledBotType(chatD, voiceD);
      });
    }, [open, chatD, voiceD]);

    const selectedTypeBlocked = isBotTypeDisabled(selectedType, chatD, voiceD);

    const handleSubmit = () => {
      if (!name.trim() || selectedTypeBlocked) return;
      const typeValue =
        selectedType === "chatbot" ? BOT_TYPE.CHAT : BOT_TYPE.VOICE;
      onSubmit?.({ name: name.trim(), type: typeValue });
    };

    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="sm"
          className={cn(
            "mx-3 max-h-[90vh] overflow-y-auto w-[calc(100%-1.5rem)] sm:mx-auto sm:w-full",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle>Create AI bot</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 sm:gap-6">
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
                  "w-full h-10 px-4 py-2.5 text-sm rounded border border-solid",
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
              <TooltipProvider delayDuration={200}>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  {BOT_TYPE_OPTIONS.map(({ id, label, description }) => {
                    const optionDisabled = isBotTypeDisabled(id, chatD, voiceD);
                    const isSelected = selectedType === id && !optionDisabled;
                    const disabledTooltip =
                      id === "chatbot"
                        ? chatbotDisabledTooltip
                        : voicebotDisabledTooltip;
                    const showTooltip =
                      optionDisabled &&
                      disabledTooltip != null &&
                      disabledTooltip.trim() !== "";

                    const baseButtonClass = cn(
                      "flex flex-col items-start gap-2 sm:gap-2.5 p-3 rounded-lg border border-solid text-left flex-1 min-h-[100px] sm:h-[134px] justify-center min-w-0 w-full",
                      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
                      optionDisabled
                        ? "cursor-not-allowed opacity-50 pointer-events-none bg-semantic-bg-primary border-semantic-border-layout"
                        : isSelected
                          ? "bg-semantic-brand-surface border-semantic-brand shadow-sm"
                          : "bg-semantic-bg-primary border-semantic-border-layout hover:bg-semantic-bg-hover"
                    );

                    const button = (
                      <button
                        type="button"
                        disabled={optionDisabled}
                        onClick={() => {
                          if (!optionDisabled) setSelectedType(id);
                        }}
                        className={baseButtonClass}
                        aria-pressed={isSelected}
                        aria-disabled={optionDisabled}
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

                    if (showTooltip) {
                      return (
                        <Tooltip key={id}>
                          <TooltipTrigger asChild>
                            <span className="flex flex-1 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus">
                              {button}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="m-0">{disabledTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return (
                      <React.Fragment key={id}>
                        {button}
                      </React.Fragment>
                    );
                  })}
                </div>
              </TooltipProvider>

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
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4 justify-end mt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!name.trim() || isLoading || selectedTypeBlocked}
              loading={isLoading}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateBotModal.displayName = "CreateBotModal";
`, prefix),
        },
        {
          name: "create-bot-flow.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { BotListCreateCard } from "./bot-list-create-card";
import { BotListGrid } from "./bot-list-grid";
import { CreateBotModal } from "./create-bot-modal";
import type { CreateBotFlowProps } from "./types";

/**
 * Create bot flow: "Create new bot" card + Create Bot modal. No header (title/subtitle/search).
 * Use when you want the create-bot experience without the list header.
 */
export const CreateBotFlow = React.forwardRef(
  (
    {
      createCardLabel = "Create new bot",
      onSubmit,
      chatbotDisabled,
      voicebotDisabled,
      chatbotDisabledTooltip,
      voicebotDisabledTooltip,
      className,
      ...props
    }: CreateBotFlowProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border",
            className
          )}
          {...props}
        >
          <BotListGrid>
            <BotListCreateCard
              label={createCardLabel}
              onClick={() => setModalOpen(true)}
            />
          </BotListGrid>
        </div>
        <CreateBotModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          chatbotDisabled={chatbotDisabled}
          voicebotDisabled={voicebotDisabled}
          chatbotDisabledTooltip={chatbotDisabledTooltip}
          voicebotDisabledTooltip={voicebotDisabledTooltip}
          onSubmit={(data) => {
            onSubmit?.(data);
            setModalOpen(false);
          }}
        />
      </>
    );
  }
);

CreateBotFlow.displayName = "CreateBotFlow";
`, prefix),
        },
        {
          name: "edit-bot-flow.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { BotList } from "./bot-list";
import type { Bot, EditBotFlowProps } from "./types";

/**
 * Edit bot flow: bot list + config view when Edit is clicked.
 * Use when you want the "Edit Bot → Config" experience; parent supplies config via renderConfig.
 */
export function EditBotFlow({
  bots,
  title = "AI Bot",
  subtitle = "Create & manage AI bots",
  searchPlaceholder = "Search bot...",
  createCardLabel = "Create new bot",
  typeLabels,
  chatbotDisabled,
  voicebotDisabled,
  chatbotDisabledTooltip,
  voicebotDisabledTooltip,
  onBotDelete,
  onCreateBotSubmit,
  onSearch,
  renderConfig,
  instructionText,
  className,
}: EditBotFlowProps) {
  const [view, setView] = React.useState<"list" | "config">("list");
  const [editingBot, setEditingBot] = React.useState<Bot | null>(null);

  const handleEdit = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (bot) {
      setEditingBot(bot);
      setView("config");
    }
  };

  const handleBack = () => {
    setView("list");
    setEditingBot(null);
  };

  if (view === "config" && editingBot) {
    return <>{renderConfig(editingBot, handleBack)}</>;
  }

  return (
    <>
      {instructionText != null ? (
        <div className="flex flex-col gap-2 p-6 pb-0">{instructionText}</div>
      ) : null}
      <BotList
        bots={bots}
        title={title}
        subtitle={subtitle}
        searchPlaceholder={searchPlaceholder}
        createCardLabel={createCardLabel}
        typeLabels={typeLabels}
        chatbotDisabled={chatbotDisabled}
        voicebotDisabled={voicebotDisabled}
        chatbotDisabledTooltip={chatbotDisabledTooltip}
        voicebotDisabledTooltip={voicebotDisabledTooltip}
        onBotEdit={handleEdit}
        onBotDelete={onBotDelete}
        onCreateBotSubmit={onCreateBotSubmit}
        onSearch={onSearch}
        className={className}
      />
    </>
  );
}
`, prefix),
        },
        {
          name: "bot-list.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { BotCard } from "./bot-card";
import { BotListHeader } from "./bot-list-header";
import { BotListSearch } from "./bot-list-search";
import { BotListCreateCard } from "./bot-list-create-card";
import { BotListGrid } from "./bot-list-grid";
import { CreateBotModal } from "./create-bot-modal";
import type { BotListProps } from "./types";

export const BotList = React.forwardRef(
  (
    {
      bots = [],
      typeLabels,
      onCreateBot,
      onCreateBotSubmit,
      onBotEdit,
      onBotDelete,
      onSearch,
      title = "AI Bot",
      subtitle = "Create & manage AI bots",
      searchPlaceholder = "Search bot...",
      createCardLabel = "Create new bot",
      chatbotDisabled,
      voicebotDisabled,
      chatbotDisabledTooltip,
      voicebotDisabledTooltip,
      className,
      ...props
    }: BotListProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    };

    const handleCreateClick = () => {
      setCreateModalOpen(true);
      onCreateBot?.();
    };

    if (bots.length === 0) {
      return (
        <>
          <div
            ref={ref}
            className={cn(
              "flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border",
              className
            )}
            {...props}
          >
            <BotListGrid>
              <BotListCreateCard
                label={createCardLabel}
                onClick={handleCreateClick}
              />
            </BotListGrid>
          </div>
          <CreateBotModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            chatbotDisabled={chatbotDisabled}
            voicebotDisabled={voicebotDisabled}
            chatbotDisabledTooltip={chatbotDisabledTooltip}
            voicebotDisabledTooltip={voicebotDisabledTooltip}
            onSubmit={(data) => {
              onCreateBotSubmit?.(data);
              setCreateModalOpen(false);
            }}
          />
        </>
      );
    }

    return (
      <>
        <div
          ref={ref}
          className={cn("flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border", className)}
          {...props}
        >
          <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-solid border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 sm:mb-6 min-w-0">
            <BotListHeader title={title} subtitle={subtitle} />
            <BotListSearch
              value={searchQuery}
              onSearch={handleSearch}
              placeholder={searchPlaceholder}
            />
          </div>
          <BotListGrid>
            <BotListCreateCard label={createCardLabel} onClick={handleCreateClick} />
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                typeLabels={typeLabels}
                onEdit={onBotEdit}
                onDelete={onBotDelete}
              />
            ))}
          </BotListGrid>
        </div>
        <CreateBotModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          chatbotDisabled={chatbotDisabled}
          voicebotDisabled={voicebotDisabled}
          chatbotDisabledTooltip={chatbotDisabledTooltip}
          voicebotDisabledTooltip={voicebotDisabledTooltip}
          onSubmit={(data) => {
            onCreateBotSubmit?.(data);
            setCreateModalOpen(false);
          }}
        />
      </>
    );
  }
);

BotList.displayName = "BotList";
`, prefix),
        },
        {
          name: "bot-list-header.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import type { BotListHeaderProps } from "./types";

const botListHeaderVariants = cva("min-w-0", {
  variants: {
    variant: {
      default:
        "flex flex-col gap-1.5 shrink",
      withSearch:
        "flex flex-col gap-3 pb-4 mb-4 border-b border-solid border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 sm:mb-6 shrink",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const BotListHeader = React.forwardRef(
  (
    { title, subtitle, variant = "default", rightContent, className, ...props }: BotListHeaderProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const rootClassName = cn(botListHeaderVariants({ variant }), className);
    const titleBlock = (
      <>
        {title != null && (
          <h1 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0.064px] break-words sm:text-lg">
            {title}
          </h1>
        )}
        {subtitle != null && (
          <p className="m-0 text-xs sm:text-sm text-semantic-text-muted tracking-[0.035px] break-words">
            {subtitle}
          </p>
        )}
      </>
    );

    if (variant === "withSearch") {
      return (
        <div ref={ref} className={rootClassName} {...props}>
          <div className="flex flex-col gap-1.5 min-w-0 shrink">{titleBlock}</div>
          {rightContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={rootClassName} {...props}>
        {titleBlock}
      </div>
    );
  }
);

BotListHeader.displayName = "BotListHeader";

export { botListHeaderVariants };
`, prefix),
        },
        {
          name: "bot-list-search.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { BotListSearchProps } from "./types";

export const BotListSearch = React.forwardRef(
  (
    {
      value,
      placeholder = "Search bot...",
      onSearch,
      defaultValue,
      className,
      ...props
    }: BotListSearchProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const displayValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternalValue(next);
      onSearch?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 h-9 sm:h-10 px-2.5 sm:px-3 border border-solid border-semantic-border-input rounded bg-semantic-bg-primary min-w-0 shrink-0",
          "hover:border-semantic-border-input-focus focus-within:border-semantic-border-input-focus",
          "focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] w-full max-w-full sm:max-w-[180px] md:max-w-[220px] sm:shrink-0",
          className
        )}
        {...props}
      >
        <Search className="size-[14px] text-semantic-text-muted shrink-0" />
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none w-full min-w-0"
          aria-label={placeholder}
        />
      </div>
    );
  }
);

BotListSearch.displayName = "BotListSearch";
`, prefix),
        },
        {
          name: "bot-list-create-card.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { BotListCreateCardProps } from "./types";

export const BotListCreateCard = React.forwardRef(
  (
    {
      label = "Create new bot",
      onClick,
      className,
      ...props
    }: BotListCreateCardProps,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-2.5 rounded-[5px] min-h-[180px] sm:min-h-[207px] w-full min-w-0 max-w-full",
        "bg-semantic-info-surface-subtle",
        "group cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
        "self-stretch justify-self-stretch",
        className
      )}
      aria-label={label}
      {...props}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect
          x="0.5"
          y="0.5"
          style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
          rx="4.5"
          fill="none"
          strokeWidth="1"
          strokeDasharray="6 6"
          className="stroke-[#c0c3ca] group-hover:stroke-[#717680] transition-colors duration-150"
        />
      </svg>
      <Plus className="size-4 text-semantic-text-secondary shrink-0" />
      <span className="text-sm font-semibold leading-5 text-semantic-text-secondary text-center tracking-[0.014px]">
        {label}
      </span>
    </button>
  )
);

BotListCreateCard.displayName = "BotListCreateCard";
`, prefix),
        },
        {
          name: "bot-list-grid.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import type { BotListGridProps } from "./types";

export const BotListGrid = React.forwardRef(
  ({ children, className, ...props }: BotListGridProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        "grid w-full min-w-0 max-w-full content-start gap-3 sm:gap-5 md:gap-6",
        "grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]",
        "auto-rows-auto items-stretch",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

BotListGrid.displayName = "BotListGrid";
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import type * as React from "react";

export const BOT_TYPE = {
  CHAT: 1,
  VOICE: 2,
} as const;

export type BOT_TYPE = (typeof BOT_TYPE)[keyof typeof BOT_TYPE];

export type BotType = "chatbot" | "voicebot";

export type BotStatus = "draft" | "published";

/**
 * Single bot shape for both Chatbot and Voicebot.
 * Use the same BotCard for both; set type to "chatbot" or "voicebot" and pass all data via this prop.
 */
export interface Bot {
  id: string;
  name: string;
  /** "chatbot" | "voicebot" — determines icon and default badge label; all other data is from this object */
  type: BotType;
  conversationCount: number;
  lastPublishedBy?: string;
  lastPublishedDate?: string;
  /** Optional custom label for the type badge (overrides typeLabels and default "Chatbot"/"Voicebot") */
  typeLabel?: string;
  /** When "draft", card shows "Unpublished changes" with red indicator in the Last Published section */
  status?: BotStatus;
}

export interface BotCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Single bot object: pass chatbot or voicebot data here; card renders based on bot.type and bot fields */
  bot: Bot;
  /** Override labels for bot types (e.g. { chatbot: "Chat", voicebot: "Voice" }). Ignored if bot.typeLabel is set. */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when Edit action is selected */
  onEdit?: (botId: string) => void;
  /** Called when Delete action is selected */
  onDelete?: (botId: string) => void;
}

export interface CreateBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with name and BOT_TYPE (CHAT = 1, VOICE = 2) when user submits */
  onSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Shows loading spinner on Create button and disables it (e.g. while API call is in flight) */
  isLoading?: boolean;
  /** When true, Chat bot type cannot be selected */
  chatbotDisabled?: boolean;
  /** When true, Voice bot type cannot be selected */
  voicebotDisabled?: boolean;
  /**
   * Shown on hover/focus when Chat bot is disabled. Tooltip is not rendered when omitted or empty.
   */
  chatbotDisabledTooltip?: string;
  /**
   * Shown on hover/focus when Voice bot is disabled. Tooltip is not rendered when omitted or empty.
   */
  voicebotDisabledTooltip?: string;
  className?: string;
}

export interface BotListHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Page title */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Layout variant: default (title + subtitle only) or withSearch (row with optional right slot) */
  variant?: "default" | "withSearch";
  /** Right-side content when variant is "withSearch" (e.g. BotListSearch) */
  rightContent?: React.ReactNode;
}

export interface BotListSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled value (use with onSearch) */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Called when the search value changes */
  onSearch?: (query: string) => void;
  /** Uncontrolled: default value */
  defaultValue?: string;
}

export interface BotListCreateCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label for the create card (e.g. "Create new bot") */
  label?: string;
}

export interface BotListGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Props forwarded to CreateBotModal for bot-type gating (optional). */
export type CreateBotModalTypeOptionsProps = Pick<
  CreateBotModalProps,
  | "chatbotDisabled"
  | "voicebotDisabled"
  | "chatbotDisabledTooltip"
  | "voicebotDisabledTooltip"
>;

/** Props for CreateBotFlow: create card + Create Bot modal (no header). */
export interface CreateBotFlowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSubmit">,
    CreateBotModalTypeOptionsProps {
  /** Create new bot card label */
  createCardLabel?: string;
  /** Called when Create Bot modal is submitted with { name, type } */
  onSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
}

/** Props for EditBotFlow: bot list + config view when Edit is clicked. */
export interface EditBotFlowProps extends CreateBotModalTypeOptionsProps {
  /** Bots to show in the list (e.g. first 2 for demo) */
  bots: Bot[];
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Create new bot card label */
  createCardLabel?: string;
  /** Override type badge labels */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when Delete is selected on a bot */
  onBotDelete?: (botId: string) => void;
  /** Called when Create Bot modal is submitted */
  onCreateBotSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Renders the config view for the given bot; call onBack() to return to list */
  renderConfig: (bot: Bot, onBack: () => void) => React.ReactNode;
  /** Optional instruction text above the list (e.g. "Click the ⋮ menu...") */
  instructionText?: React.ReactNode;
  /** Root className for the list wrapper */
  className?: string;
}

export interface BotListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children">,
    CreateBotModalTypeOptionsProps {
  /** List of bots to display */
  bots?: Bot[];
  /** Override type badge labels for all cards (e.g. { chatbot: "Chat", voicebot: "Voice" }). Per-bot bot.typeLabel still wins. */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when the "Create new bot" card is clicked (modal opens) */
  onCreateBot?: () => void;
  /** Called when the Create Bot modal is submitted with the new bot data (type is BOT_TYPE: CHAT = 1, VOICE = 2) */
  onCreateBotSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Called when user selects Edit on a bot (card click or menu) */
  onBotEdit?: (botId: string) => void;
  /** Called when user selects Delete on a bot */
  onBotDelete?: (botId: string) => void;
  /** Called when the search query changes */
  onSearch?: (query: string) => void;
  /** Page title (default: "AI Bot") */
  title?: string;
  /** Page subtitle (default: "Create & manage AI bots") */
  subtitle?: string;
  /** Placeholder for the search input (default: "Search bot...") */
  searchPlaceholder?: string;
  /** Label for the create-new-bot card (default: "Create new bot") */
  createCardLabel?: string;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { BotCard } from "./bot-card";
export type { BotCardProps } from "./types";

export { CreateBotModal } from "./create-bot-modal";
export { CreateBotFlow } from "./create-bot-flow";
export { EditBotFlow } from "./edit-bot-flow";
export type {
  CreateBotModalProps,
  CreateBotModalTypeOptionsProps,
  CreateBotFlowProps,
  EditBotFlowProps,
} from "./types";

export { BotList } from "./bot-list";
export { BotListHeader } from "./bot-list-header";
export { BotListSearch } from "./bot-list-search";
export { BotListCreateCard } from "./bot-list-create-card";
export { BotListGrid } from "./bot-list-grid";
export { BOT_TYPE } from "./types";
export type {
  BotListProps,
  BotListHeaderProps,
  BotListSearchProps,
  BotListCreateCardProps,
  BotListGridProps,
  Bot,
  BotType,
  BotStatus,
} from "./types";
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

const FileUploadModal = React.forwardRef(
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
    }: FileUploadModalProps,
    ref: React.Ref<HTMLDivElement>
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
                  className="h-[42px] px-4 rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary text-base font-semibold text-semantic-text-secondary shrink-0 hover:bg-semantic-bg-hover transition-colors w-full sm:w-auto"
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
                    className="bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded px-4 py-3 flex flex-col gap-2"
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
    "attachment-preview": {
      name: "attachment-preview",
      description: "A file attachment preview for chat composers with image, video, audio, and document previews",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "attachment-preview",
      mainFile: "attachment-preview.tsx",
      files: [
        {
          name: "attachment-preview.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { X, Play, File } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { AttachmentPreviewProps } from "./types";

const AttachmentPreview = React.forwardRef(
  ({ className, file, onRemove, ...props }: AttachmentPreviewProps, ref: React.Ref<HTMLDivElement>) => {
    const url = React.useMemo(() => URL.createObjectURL(file), [file]);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    React.useEffect(() => {
      return () => URL.revokeObjectURL(url);
    }, [url]);

    return (
      <div
        ref={ref}
        className={cn("relative border-b border-solid border-semantic-border-layout", className)}
        {...props}
      >
        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
          className="absolute top-2 right-2 z-10 size-7 rounded-full bg-[#0a0d12]/60 flex items-center justify-center hover:bg-[#0a0d12]/80 transition-colors"
        >
          <X className="size-4 text-white" />
        </button>

        {isImage ? (
          <img
            src={url}
            alt={file.name}
            className="w-full object-cover max-h-[300px]"
          />
        ) : isVideo ? (
          <div
            className="relative bg-[#0a0d12]"
            style={{ aspectRatio: "16/10" }}
          >
            <video src={url} className="w-full h-full object-cover" />
            {/* Center play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Play className="size-7 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Bottom timeline gradient */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6 bg-gradient-to-t from-[#0a0d12]/70 to-transparent">
              <div className="flex items-center gap-2">
                <Play className="size-4 text-white" />
                <span className="text-[12px] text-white/60" aria-hidden="true">
                  &#9679;
                </span>
                <div className="flex-1 h-[3px] rounded-full bg-white/30" />
                <span className="text-[12px] text-white tabular-nums">
                  0:00
                </span>
              </div>
            </div>
          </div>
        ) : isAudio ? (
          <div className="bg-semantic-bg-ui px-4 py-6 flex items-center gap-3">
            <div className="size-10 rounded-full bg-semantic-primary flex items-center justify-center shrink-0">
              <Play className="size-5 text-white fill-white ml-0.5" />
            </div>
            <div className="flex-1 h-1 bg-semantic-border-layout rounded-full">
              <div className="w-0 h-full bg-semantic-primary rounded-full" />
            </div>
            <span className="text-[12px] text-semantic-text-muted tabular-nums shrink-0">
              0:00
            </span>
          </div>
        ) : (
          <div
            className="bg-semantic-bg-ui flex flex-col items-center justify-center"
            style={{ aspectRatio: "16/10" }}
          >
            <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
              <File className="size-8 text-semantic-text-muted" />
            </div>
            <p className="m-0 text-[14px] font-semibold text-semantic-text-primary truncate max-w-[80%] px-4">
              {file.name}
            </p>
            <p className="m-0 text-[12px] text-semantic-text-muted mt-1">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        )}
      </div>
    );
  }
);
AttachmentPreview.displayName = "AttachmentPreview";

export { AttachmentPreview };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export interface AttachmentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The file to preview */
  file: File;
  /** Called when the remove/close button is clicked */
  onRemove: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { AttachmentPreview } from "./attachment-preview";
export type { AttachmentPreviewProps } from "./types";
`, prefix),
        }
      ],
    },
    "audio-media": {
      name: "audio-media",
      description: "A waveform-based audio player with play/pause, speed control, and SVG waveform visualization",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "dropdown-menu"
      ],
      isMultiFile: true,
      directory: "audio-media",
      mainFile: "audio-media.tsx",
      files: [
        {
          name: "audio-media.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import type { AudioMediaProps } from "./types";

const DEFAULT_WAVEFORM = [
  4, 8, 14, 6, 20, 10, 4, 16, 7, 24, 5, 12, 18, 6, 10, 4, 14, 22, 7, 5, 16,
  10, 6, 19, 8, 4, 14, 7, 12, 5, 18, 9, 4, 14, 6, 10, 22, 5, 13, 7, 4, 16, 9,
  6, 19, 5, 12, 7, 6, 14, 10, 4, 17, 7, 12,
];

const DEFAULT_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const BAR_WIDTH = 2;
const BAR_GAP = 1.5;
const SVG_HEIGHT = 32;

const AudioMedia = React.forwardRef(
  (
    {
      className,
      duration,
      waveform = DEFAULT_WAVEFORM,
      playedBars = 0,
      barCount = 55,
      playedColor = "#27ABB8",
      unplayedColor = "#C0C3CA",
      speedOptions = DEFAULT_SPEED_OPTIONS,
      onPlayChange,
      onSpeedChange,
      ...props
    }: AudioMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [playing, setPlaying] = React.useState(false);
    const [speed, setSpeed] = React.useState(1);

    const svgWidth = barCount * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

    const handlePlayPause = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !playing;
      setPlaying(next);
      onPlayChange?.(next);
    };

    const handleSpeedChange = (value: string) => {
      const newSpeed = Number(value);
      setSpeed(newSpeed);
      onSpeedChange?.(newSpeed);
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ padding: "10px 14px 0 14px" }}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
            className="shrink-0 size-10 rounded-full bg-semantic-primary flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {playing ? (
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="14"
                  rx="1.2"
                  fill="white"
                />
                <rect
                  x="8"
                  y="0"
                  width="4"
                  height="14"
                  rx="1.2"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                style={{ marginLeft: 2 }}
                aria-hidden="true"
              >
                <path
                  d="M1 1.87v12.26a1 1 0 001.5.86l10.5-6.13a1 1 0 000-1.72L2.5 1.01A1 1 0 001 1.87z"
                  fill="white"
                />
              </svg>
            )}
          </button>

          {/* Waveform */}
          <div className="flex-1 min-w-0" style={{ height: SVG_HEIGHT }}>
            <svg
              viewBox={\`0 0 \${svgWidth} \${SVG_HEIGHT}\`}
              preserveAspectRatio="none"
              width="100%"
              height="100%"
              style={{ overflow: "visible" }}
              aria-hidden="true"
              data-testid="waveform-svg"
            >
              {waveform.slice(0, barCount).map((h, i) => (
                <rect
                  key={i}
                  x={i * (BAR_WIDTH + BAR_GAP)}
                  y={(SVG_HEIGHT - h) / 2}
                  width={BAR_WIDTH}
                  height={h}
                  rx={1.5}
                  fill={i < playedBars ? playedColor : unplayedColor}
                />
              ))}
            </svg>
            {duration && (
              <p className="m-0 text-[10px] text-semantic-text-muted leading-none mt-1">
                {duration}
              </p>
            )}
          </div>

          {/* Speed dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 min-w-[34px] h-[22px] px-2 flex items-center justify-center rounded-full bg-black/40 hover:opacity-80 transition-opacity"
              >
                <span className="text-[11px] font-semibold text-white leading-none">
                  {speed}x
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={String(speed)}
                onValueChange={handleSpeedChange}
              >
                {speedOptions.map((s) => (
                  <DropdownMenuRadioItem key={s} value={String(s)}>
                    {s === 1 ? "1x (Normal)" : \`\${s}x\`}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);
AudioMedia.displayName = "AudioMedia";

export { AudioMedia };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export interface AudioMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Audio duration text (e.g., "0:30", "2:15") */
  duration?: string;
  /** Array of bar heights for the waveform visualization. Defaults to a built-in pattern */
  waveform?: number[];
  /** Number of bars that are "played" (colored). Defaults to 0 */
  playedBars?: number;
  /** Total number of bars to render. Defaults to 55 */
  barCount?: number;
  /** Color for played bars. Defaults to "#27ABB8" (teal) */
  playedColor?: string;
  /** Color for unplayed bars. Defaults to "#C0C3CA" (gray) */
  unplayedColor?: string;
  /** Available speed options. Defaults to [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] */
  speedOptions?: number[];
  /** Callback when play state changes */
  onPlayChange?: (playing: boolean) => void;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { AudioMedia } from "./audio-media";
export type { AudioMediaProps } from "./types";
`, prefix),
        }
      ],
    },
    "carousel-media": {
      name: "carousel-media",
      description: "A horizontally scrollable card carousel with images, titles, and action buttons",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "carousel-media",
      mainFile: "carousel-media.tsx",
      files: [
        {
          name: "carousel-media.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Reply, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { CarouselMediaProps } from "./types";

const CarouselMedia = React.forwardRef(
  ({ className, cards, cardWidth = 260, imageHeight = 200, ...props }: CarouselMediaProps, ref: React.Ref<HTMLDivElement>) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(
      (cards?.length || 0) > 1
    );

    const updateScrollState = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(
        el.scrollLeft < el.scrollWidth - el.clientWidth - 5
      );
    }, []);

    const scroll =
      (dir: "left" | "right") => (e: React.MouseEvent) => {
        e.stopPropagation();
        const scrollAmount = cardWidth + 12;
        scrollRef.current?.scrollBy({
          left: dir === "right" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
        setTimeout(updateScrollState, 350);
      };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {cards?.map((card, i) => (
            <div
              key={i}
              className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
              style={{ width: cardWidth }}
            >
              <img
                src={card.url}
                alt={card.title}
                className="w-full object-cover"
                style={{ height: imageHeight }}
              />
              <div className="px-3 pt-2.5 pb-2">
                <p className="m-0 text-[14px] font-semibold text-semantic-text-primary line-clamp-2">
                  {card.title}
                </p>
              </div>
              {card.buttons?.map((btn, j) => (
                <button
                  key={j}
                  onClick={btn.onClick}
                  className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                  style={{ height: 40 }}
                >
                  {btn.icon === "reply" && <Reply className="size-4" />}
                  {btn.icon === "link" && <ExternalLink className="size-4" />}
                  {btn.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronLeft className="size-4 text-semantic-text-primary" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronRight className="size-4 text-semantic-text-primary" />
          </button>
        )}
      </div>
    );
  }
);

CarouselMedia.displayName = "CarouselMedia";

export { CarouselMedia };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export interface CarouselCardButton {
  /** Icon type to display before the label */
  icon?: "reply" | "link";
  /** Button text */
  label: string;
  /** Click handler */
  onClick?: () => void;
}

export interface CarouselCard {
  /** Image URL for the card */
  url: string;
  /** Card title text */
  title: string;
  /** Action buttons displayed below the title */
  buttons?: CarouselCardButton[];
}

export interface CarouselMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of cards to display */
  cards: CarouselCard[];
  /** Width of each card in pixels. Defaults to 260 */
  cardWidth?: number;
  /** Height of card images in pixels. Defaults to 200 */
  imageHeight?: number;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { CarouselMedia } from "./carousel-media";
export type {
  CarouselMediaProps,
  CarouselCard,
  CarouselCardButton,
} from "./types";
`, prefix),
        }
      ],
    },
    "chat-bubble": {
      name: "chat-bubble",
      description: "A chat message bubble with sender/receiver variants, delivery status, reply quote, and media slot",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "reply-quote"
      ],
      isMultiFile: true,
      directory: "chat-bubble",
      mainFile: "chat-bubble.tsx",
      files: [
        {
          name: "chat-bubble.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { ReplyQuote } from "../reply-quote";
import { Check, CheckCheck, CircleAlert } from "lucide-react";
import type { ChatBubbleProps, DeliveryStatus } from "./types";

const maxWidthMap = {
  text: "max-w-[65%]",
  media: "max-w-[380px] w-full",
  audio: "max-w-[340px] w-[340px]",
  carousel: "max-w-[466px] w-full",
};

function DeliveryFooter({
  status,
  timestamp,
  variant,
}: {
  status?: DeliveryStatus;
  timestamp: string;
  variant: "sender" | "receiver";
}) {
  return (
    <div
      className={cn(
        "flex items-center mt-1.5",
        variant === "sender" ? "justify-end gap-1.5" : "justify-start gap-1.5"
      )}
    >
      {variant === "sender" && status && (
        <>
          {status === "failed" ? (
            <>
              <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
              <span className="text-[12px] text-semantic-error-primary font-medium">
                Failed to send
              </span>
            </>
          ) : (
            <>
              {status === "sent" ? (
                <Check className="size-4 text-semantic-text-muted shrink-0" />
              ) : (
                <CheckCheck
                  className={cn(
                    "size-4 shrink-0",
                    status === "read"
                      ? "text-semantic-text-link"
                      : "text-semantic-text-muted"
                  )}
                />
              )}
              <span className="text-[12px] text-semantic-text-muted">
                {status === "sent"
                  ? "Sent"
                  : status === "delivered"
                    ? "Delivered"
                    : "Read"}
              </span>
            </>
          )}
          <span
            className="font-semibold text-semantic-text-muted"
            style={{ fontSize: 10 }}
          >
            &bull;
          </span>
        </>
      )}
      <span className="text-[12px] text-semantic-text-muted">{timestamp}</span>
    </div>
  );
}

/**
 * ChatBubble displays a single chat message with sender/receiver alignment,
 * optional sender name, reply quote, media slot, text content, delivery status,
 * and timestamp.
 *
 * @example
 * \`\`\`tsx
 * <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
 *   Hello, how can I help you?
 * </ChatBubble>
 *
 * <ChatBubble
 *   variant="sender"
 *   timestamp="2:15 PM"
 *   status="delivered"
 *   senderIndicator={<span className="text-[10px] font-medium">AS</span>}
 * >
 *   Message with agent initials indicator
 * </ChatBubble>
 * \`\`\`
 */
const ChatBubble = React.forwardRef(
  (
    {
      variant,
      timestamp,
      status,
      senderName,
      reply,
      onReplyClick,
      media,
      maxWidth = "text",
      senderIndicator,
      children,
      className,
      ...props
    }: ChatBubbleProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const hasMedia = !!media;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-1.5",
          variant === "sender" ? "justify-end" : "justify-start",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-col",
            maxWidthMap[maxWidth],
            variant === "sender" ? "items-end" : "items-start"
          )}
        >
          {senderName && (
            <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
              {senderName}
            </span>
          )}
          <div
            className={cn(
              "rounded overflow-hidden",
              !hasMedia && "px-3 pt-3 pb-1.5",
              variant === "sender"
                ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary"
                : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            )}
          >
            {/* Media area (full-bleed) */}
            {media}

            {/* Text + footer area */}
            <div className={hasMedia ? "px-3 pb-1.5 pt-2" : ""}>
              {reply && (
                <ReplyQuote
                  sender={reply.sender}
                  message={reply.message}
                  className="bg-white"
                  onClick={() => {
                    if (reply.messageId && onReplyClick) {
                      onReplyClick(reply.messageId);
                    }
                  }}
                />
              )}
              {children && (
                <p className="text-[14px] leading-5 m-0">{children}</p>
              )}
              <DeliveryFooter
                status={status}
                timestamp={timestamp}
                variant={variant}
              />
            </div>
          </div>
        </div>
        {variant === "sender" && senderIndicator && (
          <div className="self-end mb-1 shrink-0 size-7 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center">
            {senderIndicator}
          </div>
        )}
      </div>
    );
  }
);
ChatBubble.displayName = "ChatBubble";

export { ChatBubble };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export type DeliveryStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatBubbleReply {
  /** Name of the person being replied to */
  sender: string;
  /** The quoted message text */
  message: string;
  /** ID of the original message for scroll-to behavior */
  messageId?: string;
}

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether this is a sent (agent) or received (customer) message */
  variant: "sender" | "receiver";
  /** Message timestamp text (e.g., "2:15 PM") */
  timestamp: string;
  /** Delivery status — only shown for sender variant */
  status?: DeliveryStatus;
  /** Sender name displayed above the bubble */
  senderName?: string;
  /** Reply quote data */
  reply?: ChatBubbleReply;
  /** Callback when reply quote is clicked */
  onReplyClick?: (messageId: string) => void;
  /** Slot for media content (rendered full-bleed, no padding) */
  media?: React.ReactNode;
  /** Controls max-width of the bubble: "text" = 65%, "media" = 380px, "audio" = 340px, "carousel" = 466px */
  maxWidth?: "text" | "media" | "audio" | "carousel";
  /** Sender indicator rendered outside the bubble at bottom-right (e.g., agent avatar, bot icon) */
  senderIndicator?: React.ReactNode;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatBubble } from "./chat-bubble";
export type { ChatBubbleProps, ChatBubbleReply, DeliveryStatus } from "./types";
`, prefix),
        }
      ],
    },
    "chat-list-item": {
      name: "chat-list-item",
      description: "A chat list item showing contact name, message preview, timestamp, delivery status, and channel badge",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "chat-list-item",
      mainFile: "chat-list-item.tsx",
      files: [
        {
          name: "chat-list-item.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  Bot,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

/* ── Types ── */

export type MessageStatus = "sent" | "delivered" | "read";

export type MessageType = "text" | "document" | "image";

export interface ChatListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Contact or customer name (supports ReactNode for highlighted search matches) */
  name: React.ReactNode;
  /** Last message preview text (supports ReactNode for highlighted search matches) */
  message: React.ReactNode;
  /** Timestamp display string (e.g. "2:30 PM", "Yesterday") */
  timestamp: string;
  /**
   * Delivery status of the last outbound message.
   * Mutually exclusive with \`unreadCount\` — when set, no unread badge is shown.
   * - \`sent\`: single gray checkmark (message left the server)
   * - \`delivered\`: double gray checkmarks (reached the customer's device)
   * - \`read\`: double blue checkmarks (customer opened the message)
   */
  messageStatus?: MessageStatus;
  /**
   * Number of unread messages from the customer.
   * Only shown when \`messageStatus\` is not set (i.e., last message was inbound).
   */
  unreadCount?: number;
  /**
   * SLA timer label showing how long the customer has been waiting (e.g. "2h", "50m").
   * Displayed as a warning-colored tag next to the name.
   * Typically appears on unread/inbound conversations.
   */
  slaTimer?: string;
  /**
   * Type of the last message — controls the icon prefix before the message text.
   * - \`text\`: no icon (default)
   * - \`document\`: file icon
   * - \`image\`: image icon
   */
  messageType?: MessageType;
  /** Channel identifier (e.g. "MY01") */
  channel: string;
  /** Name of the assigned agent */
  agentName?: string;
  /** Whether the assigned agent's account has been deleted — renders in error color */
  isAgentDeleted?: boolean;
  /** Whether the conversation is handled by an AI/IVR bot — shows bot icon */
  isBot?: boolean;
  /** Whether this item is currently selected/active in the inbox */
  isSelected?: boolean;
  /** Callback when the chat item is clicked */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/* ── Sub-components ── */

function StatusIndicator({ status }: { status: MessageStatus }) {
  if (status === "sent") {
    return (
      <span aria-label="Sent">
        <Check className="size-4 text-semantic-text-placeholder shrink-0" aria-hidden="true" />
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span aria-label="Delivered">
        <CheckCheck className="size-4 text-semantic-text-placeholder shrink-0" aria-hidden="true" />
      </span>
    );
  }
  // read
  return (
    <span aria-label="Read">
      <CheckCheck className="size-4 text-[#47b5bc] shrink-0" aria-hidden="true" />
    </span>
  );
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      className="shrink-0 inline-flex items-center justify-center rounded-full bg-semantic-border-accent font-semibold text-white"
      style={{ width: 18, height: 18, fontSize: 10, lineHeight: 1 }}
      aria-label={\`\${count > 99 ? "99+" : count} unread messages\`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SlaTag({ timer }: { timer: string }) {
  return (
    <span
      className="flex items-center gap-2 h-5 px-[6px] py-[2px] rounded bg-semantic-warning-surface shrink-0"
      aria-label={\`SLA timer: \${timer}\`}
    >
      <Clock className="size-3 text-semantic-warning-text" aria-hidden="true" />
      <span className="text-[12px] text-semantic-warning-text">{timer}</span>
    </span>
  );
}

function MessageTypeIcon({ type }: { type: MessageType }) {
  if (type === "document") {
    return <FileText className="size-[14px] text-semantic-text-placeholder shrink-0" />;
  }
  if (type === "image") {
    return <ImageIcon className="size-[14px] text-semantic-text-placeholder shrink-0" />;
  }
  return null;
}

function ChannelPill({
  channel,
  agentName,
  isAgentDeleted,
  isBot,
}: {
  channel: string;
  agentName?: string;
  isAgentDeleted?: boolean;
  isBot?: boolean;
}) {
  const textColor = isAgentDeleted ? "text-semantic-error-text" : "text-semantic-text-primary";

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex items-center gap-[6px] px-2 py-1 rounded-[12px] border border-solid border-semantic-border-layout text-[12px]",
          textColor
        )}
      >
        {channel}
        {agentName && (
          <>
            <span>-</span>
            <span className="truncate">{agentName}</span>
          </>
        )}
        {isBot && <Bot className="size-[14px] text-semantic-text-primary" aria-hidden="true" />}
      </span>
    </div>
  );
}

/* ── Main Component ── */

/**
 * ChatListItem displays a conversation preview in an inbox-style list.
 *
 * Each item shows the contact name, last message preview, timestamp,
 * delivery status or unread count, optional SLA timer, and channel/agent info.
 *
 * @example
 * \`\`\`tsx
 * <ChatListItem
 *   name="Aditi Kumar"
 *   message="Have a look at this document"
 *   timestamp="2:30 PM"
 *   messageStatus="sent"
 *   messageType="document"
 *   channel="MY01"
 *   agentName="Alex Smith"
 *   onClick={() => setSelectedChat("1")}
 * />
 * \`\`\`
 */
const ChatListItem = React.forwardRef(
  (
    {
      name,
      message,
      timestamp,
      messageStatus,
      unreadCount,
      slaTimer,
      messageType = "text",
      channel,
      agentName,
      isAgentDeleted = false,
      isBot = false,
      isSelected = false,
      onClick,
      className,
      ...props
    }: ChatListItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const nameText = typeof name === "string" ? name : "";
    const messageText = typeof message === "string" ? message : "";
    const defaultAriaLabel = \`\${nameText}. \${messageText}. \${timestamp}\${unreadCount ? \`. \${unreadCount} unread\` : ""}\${slaTimer ? \`. SLA: \${slaTimer}\` : ""}\${messageStatus ? \`. \${messageStatus}\` : ""}\`;

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        aria-label={defaultAriaLabel}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          "flex items-start px-4 py-5 w-full transition-colors cursor-pointer",
          isSelected
            ? "bg-[var(--color-neutral-50)] border-l-4 border-solid border-l-semantic-border-accent border-b border-b-semantic-border-layout"
            : "bg-white hover:bg-[var(--color-neutral-50)] border-b border-solid border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Row 1: Name + SLA Timer + Status/Unread Badge */}
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-[14px] text-semantic-text-primary truncate">
                {name}
              </span>
              {slaTimer && <SlaTag timer={slaTimer} />}
            </div>
            {messageStatus ? (
              <StatusIndicator status={messageStatus} />
            ) : unreadCount ? (
              <UnreadBadge count={unreadCount} />
            ) : null}
          </div>

          {/* Row 2: Message Type Icon + Message Preview + Timestamp */}
          <div className="flex items-center gap-[6px]">
            <MessageTypeIcon type={messageType} />
            <p className="flex-1 text-[14px] text-semantic-text-muted truncate min-w-0 m-0">
              {message}
            </p>
            <span className="text-[12px] text-semantic-text-placeholder tracking-[0.06px] shrink-0">
              {timestamp}
            </span>
          </div>

          {/* Row 3: Channel + Agent Pill */}
          <ChannelPill
            channel={channel}
            agentName={agentName}
            isAgentDeleted={isAgentDeleted}
            isBot={isBot}
          />
        </div>
      </div>
    );
  }
);
ChatListItem.displayName = "ChatListItem";

export { ChatListItem };
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatListItem } from "./chat-list-item";
export type {
  ChatListItemProps,
  MessageStatus,
  MessageType,
} from "./chat-list-item";
`, prefix),
        }
      ],
    },
    "chat-timeline-divider": {
      name: "chat-timeline-divider",
      description: "A timeline divider for chat message lists — renders centered content between horizontal lines with date, unread, and system event variants",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "chat-timeline-divider",
      mainFile: "chat-timeline-divider.tsx",
      files: [
        {
          name: "chat-timeline-divider.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";

/* ── Types ── */

export type ChatTimelineDividerVariant = "default" | "unread" | "system";

export interface ChatTimelineDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Visual style of the divider.
   * - \`default\`: plain centered text between lines (e.g. "Today", "Yesterday")
   * - \`unread\`: bold text in a white pill with border (e.g. "3 unread messages")
   * - \`system\`: muted text in a white pill with border (e.g. "Assigned to Alex Smith")
   */
  variant?: ChatTimelineDividerVariant;
  /** Content to display — text or ReactNode for rich content (e.g. linked names) */
  children: React.ReactNode;
}

/* ── Variant styles ── */

const containerStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "",
  unread:
    "bg-white px-2.5 py-0.5 rounded-full border border-solid border-semantic-border-layout shadow-sm",
  system:
    "bg-white px-2.5 py-1 rounded-full border border-solid border-semantic-border-layout shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
};

const textStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "text-[13px] text-semantic-text-muted",
  unread: "text-[12px] font-semibold text-semantic-text-primary",
  system: "text-[13px] text-semantic-text-muted",
};

/* ── Component ── */

/**
 * ChatTimelineDivider renders a centered label between two horizontal lines
 * in a chat message timeline.
 *
 * Use it to separate messages by date, mark unread boundaries,
 * or display system/action events (assignments, resolutions, etc.).
 *
 * @example
 * \`\`\`tsx
 * // Date separator
 * <ChatTimelineDivider>Today</ChatTimelineDivider>
 *
 * // Unread count
 * <ChatTimelineDivider variant="unread">3 unread messages</ChatTimelineDivider>
 *
 * // System event with linked names
 * <ChatTimelineDivider variant="system">
 *   Assigned to <span className="text-semantic-text-link font-medium">Alex Smith</span>
 * </ChatTimelineDivider>
 * \`\`\`
 */
const ChatTimelineDivider = React.forwardRef<
  HTMLDivElement,
  ChatTimelineDividerProps
>(
  (
    { variant = "default", children, className, ...props },
    ref
  ) => {
    const showLines = true;

    return (
      <div
        ref={ref}
        role="separator"
        className={cn("flex items-center gap-4 my-2", className)}
        {...props}
      >
        {showLines && (
          <div className="flex-1 h-px bg-semantic-border-layout" />
        )}
        <div className={cn(containerStyles[variant])}>
          <span className={cn(textStyles[variant])}>{children}</span>
        </div>
        {showLines && (
          <div className="flex-1 h-px bg-semantic-border-layout" />
        )}
      </div>
    );
  }
);
ChatTimelineDivider.displayName = "ChatTimelineDivider";

export { ChatTimelineDivider };
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export {
  ChatTimelineDivider,
  type ChatTimelineDividerProps,
  type ChatTimelineDividerVariant,
} from "./chat-timeline-divider";
`, prefix),
        }
      ],
    },
    "chat-composer": {
      name: "chat-composer",
      description: "A message composition area with textarea, action slots, reply preview, attachment slot, and send button",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "reply-quote"
      ],
      isMultiFile: true,
      directory: "chat-composer",
      mainFile: "chat-composer.tsx",
      files: [
        {
          name: "chat-composer.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { ReplyQuote } from "../reply-quote";
import { X, ChevronDown } from "lucide-react";
import type { ChatComposerProps } from "./types";

/**
 * ChatComposer provides a message composition area with textarea, action buttons,
 * reply-to preview, attachment slot, and send button. Also supports an "expired"
 * state showing a template prompt instead of the full composer.
 *
 * The textarea auto-resizes as the user types, up to a maximum height.
 * Use the \`onKeyDown\` prop to handle keyboard events like Enter-to-send
 * or arrow-key navigation in autocomplete/canned-message menus.
 *
 * @example
 * \`\`\`tsx
 * <ChatComposer
 *   value={text}
 *   onChange={setText}
 *   onSend={handleSend}
 *   onKeyDown={(e) => {
 *     if (e.key === "Enter" && !e.shiftKey) {
 *       e.preventDefault();
 *       handleSend();
 *     }
 *   }}
 *   placeholder="Type a message"
 * />
 * \`\`\`
 */
const ChatComposer = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      onSend,
      placeholder = "Type a message",
      textareaId,
      textareaAriaLabel,
      disabled = false,
      onKeyDown,
      reply,
      onDismissReply,
      onReplyClick,
      attachment,
      leftActions,
      rightActions,
      sendLabel = "Send",
      showSendDropdown = false,
      expired = false,
      expiredMessage = "This chat has expired. Send a template to continue.",
      onTemplateClick,
      ...props
    }: ChatComposerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Focus textarea after reply dismiss
    const handleDismissReply = () => {
      onDismissReply?.();
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    };

    // Auto-resize textarea to fit content, capped by max-height CSS
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = \`\${textarea.scrollHeight}px\`;
    }, [value]);
    if (expired) {
      return (
        <div
          ref={ref}
          role="region"
          aria-label="Message composer"
          className={cn("shrink-0 bg-semantic-bg-ui p-4", className)}
          {...props}
        >
          <div
            role="status"
            className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.06)] px-4 py-4 flex items-center justify-center gap-4"
          >
            <span className="text-sm text-semantic-text-muted">
              {expiredMessage}
            </span>
            <Button onClick={onTemplateClick}>
              Select Template
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Message composer"
        className={cn("shrink-0 bg-semantic-bg-ui p-4", className)}
        {...props}
      >
        <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.06)] px-4 py-3">
          {/* Reply preview */}
          {reply && (
            <div className="flex items-center gap-2 mb-2">
              <ReplyQuote
                sender={reply.sender}
                message={reply.message}
                onClick={onReplyClick}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDismissReply}
                aria-label="Dismiss reply"
                className="shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Left actions slot */}
            {leftActions && (
              <div className="flex items-center gap-0.5 shrink-0">
                {leftActions}
              </div>
            )}

            {/* Input area */}
            <div className="flex-1 flex flex-col border border-solid border-semantic-border-layout rounded-lg bg-white overflow-hidden focus-within:border-semantic-border-focus transition-all">
              {attachment}
              <div className="flex items-end">
                <textarea
                  ref={textareaRef}
                  id={textareaId}
                  aria-label={textareaAriaLabel || placeholder}
                  placeholder={placeholder}
                  rows={1}
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={disabled}
                  className="flex-1 resize-none px-3 py-2.5 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent min-h-[40px] max-h-[120px]"
                />
                {rightActions && (
                  <div className="flex items-center px-2 py-2">
                    {rightActions}
                  </div>
                )}
              </div>
            </div>

            {/* Send button */}
            <Button
              className="shrink-0"
              onClick={onSend}
              disabled={disabled}
              aria-haspopup={showSendDropdown ? "true" : undefined}
              rightIcon={
                showSendDropdown ? (
                  <ChevronDown className="size-3.5" />
                ) : undefined
              }
            >
              {sendLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
ChatComposer.displayName = "ChatComposer";

export { ChatComposer };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export interface ChatComposerReply {
  /** Name of the person being replied to */
  sender: string;
  /** The quoted message text */
  message: string;
  /** ID of the original message */
  messageId?: string;
}

export interface ChatComposerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onKeyDown"> {
  /** Current message text value */
  value?: string;
  /** Called when message text changes */
  onChange?: (value: string) => void;
  /** Called when send button is clicked */
  onSend?: () => void;
  /** Textarea placeholder text. Defaults to "Type a message" */
  placeholder?: string;
  /** HTML id for the textarea — allows external label linking via htmlFor */
  textareaId?: string;
  /** aria-label for the textarea. Defaults to the placeholder value */
  textareaAriaLabel?: string;
  /** Whether the composer is disabled */
  disabled?: boolean;
  /**
   * Called on textarea keydown. Use for Enter-to-send, Escape to dismiss,
   * or arrow-key navigation in autocomplete/canned-message menus.
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Reply quote data — shows dismissible reply preview above textarea */
  reply?: ChatComposerReply;
  /** Called when the reply dismiss (X) button is clicked */
  onDismissReply?: () => void;
  /** Called when the reply quote is clicked (e.g., to scroll to original message) */
  onReplyClick?: () => void;
  /** Slot for attachment preview content (rendered above textarea) */
  attachment?: React.ReactNode;
  /** Slot for left action buttons (rendered to the left of textarea) */
  leftActions?: React.ReactNode;
  /** Slot for right action buttons (rendered inside textarea container, bottom-right) */
  rightActions?: React.ReactNode;
  /** Send button label. Accepts text or JSX (e.g. icon + text). Defaults to "Send" */
  sendLabel?: React.ReactNode;
  /** Whether to show the send dropdown chevron. Defaults to false */
  showSendDropdown?: boolean;
  /** Whether the chat is expired (shows template prompt instead of composer) */
  expired?: boolean;
  /** Message shown in expired state. Defaults to "This chat has expired. Send a template to continue." */
  expiredMessage?: string;
  /** Called when "Select Template" button is clicked in expired state */
  onTemplateClick?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatComposer } from "./chat-composer";
export type { ChatComposerProps, ChatComposerReply } from "./types";
`, prefix),
        }
      ],
    },
    "doc-media": {
      name: "doc-media",
      description: "A document media component with preview, download, and file variants for chat messages",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "doc-media",
      mainFile: "doc-media.tsx",
      files: [
        {
          name: "doc-media.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { cn } from "../../../lib/utils";
import { File, FileSpreadsheet, ArrowDownToLine } from "lucide-react";
import type { DocMediaProps } from "./types";

const DocMedia = React.forwardRef(
  (
    {
      className,
      variant = "preview",
      thumbnailUrl,
      filename,
      fileType,
      pageCount,
      fileSize,
      caption,
      onDownload,
      ...props
    }: DocMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (variant === "preview") {
      return (
        <div
          ref={ref}
          className={cn("relative rounded-t overflow-hidden", className)}
          {...props}
        >
          <img
            src={thumbnailUrl}
            alt={filename || "Document preview"}
            className="w-full object-cover"
            style={{ aspectRatio: "442/308" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#1d222f]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <p className="m-0 text-[14px] font-semibold text-white truncate">
              {filename || "Document"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <File className="size-3.5 text-white/80" />
              <span className="text-[12px] text-white/80">
                {[
                  fileType,
                  pageCount && \`\${pageCount} pages\`,
                  fileSize,
                ]
                  .filter(Boolean)
                  .join("  \\u00B7  ")}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "download") {
      return (
        <div
          ref={ref}
          className={cn("relative rounded-t overflow-hidden", className)}
          {...props}
        >
          <img
            src={thumbnailUrl}
            alt={caption || filename || "Document"}
            className="w-full object-cover"
            style={{ aspectRatio: "442/308" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#1d222f]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <p className="m-0 text-[14px] font-semibold text-white truncate">
              {filename || "Document"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <File className="size-3.5 text-white/80" />
              <span className="text-[12px] text-white/80">
                {[
                  fileType,
                  pageCount && \`\${pageCount} pages\`,
                  fileSize,
                ]
                  .filter(Boolean)
                  .join("  \\u00B7  ")}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // variant === "file"
    const isSpreadsheet = fileType === "XLS" || fileType === "XLSX";
    const accent = isSpreadsheet ? "#217346" : "#535862";
    const accentLight = isSpreadsheet ? "#dcfae6" : "#e9eaeb";
    const label = fileType || "FILE";

    return (
      <div
        ref={ref}
        className={cn(
          "mx-2.5 mt-2.5 rounded overflow-hidden border border-solid border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <div
          className="bg-semantic-bg-ui flex items-center justify-center w-full"
          style={{ padding: "36px 0" }}
        >
          <div className="flex flex-col items-center">
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 72, height: 72, backgroundColor: accentLight }}
            >
              <FileSpreadsheet
                style={{ width: 32, height: 32, color: accent }}
              />
            </div>
            <div
              className="mt-2.5 rounded-full px-3 py-0.5"
              style={{ backgroundColor: accent }}
            >
              <span className="text-[11px] font-bold text-white tracking-wide">
                {label}
              </span>
            </div>
          </div>
        </div>
        <div
          className="bg-muted flex items-center gap-2"
          style={{ padding: "12px 16px" }}
        >
          <span className="text-[14px] font-semibold text-semantic-text-primary truncate flex-1 tracking-[0.1px]">
            {filename || "File"}
          </span>
          <button
            type="button"
            onClick={onDownload}
            className="shrink-0 size-8 rounded-full flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
            aria-label="Download"
          >
            <ArrowDownToLine className="size-[18px] text-semantic-text-secondary" />
          </button>
        </div>
      </div>
    );
  }
);
DocMedia.displayName = "DocMedia";

export { DocMedia };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export type DocMediaVariant = "preview" | "download" | "file";

export interface DocMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display variant */
  variant?: DocMediaVariant;
  /** Thumbnail or preview image URL */
  thumbnailUrl?: string;
  /** Document filename */
  filename?: string;
  /** File type label (e.g., "PDF", "XLS", "XLSX", "DOC") */
  fileType?: string;
  /** Number of pages (for PDFs) */
  pageCount?: number;
  /** File size text (e.g., "2.4 MB") */
  fileSize?: string;
  /** Caption text */
  caption?: string;
  /** Handler for download button click (variant="file" only) */
  onDownload?: () => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { DocMedia } from "./doc-media";
export type { DocMediaProps, DocMediaVariant } from "./types";
`, prefix),
        }
      ],
    },
    "video-media": {
      name: "video-media",
      description: "A video player with thumbnail overlay, play/pause, seek bar, speed dropdown, volume, and fullscreen",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "dropdown-menu"
      ],
      isMultiFile: true,
      directory: "video-media",
      mainFile: "video-media.tsx",
      files: [
        {
          name: "video-media.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../dropdown-menu";
import type { VideoMediaProps } from "./types";

const DEFAULT_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const VideoMedia = React.forwardRef(
  (
    {
      className,
      thumbnailUrl,
      duration,
      speedOptions = DEFAULT_SPEED_OPTIONS,
      progress = 0,
      onPlayChange,
      onSpeedChange,
      onClick,
      ...props
    }: VideoMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(75);

    const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const nextPlaying = !playing;
      setPlaying(nextPlaying);
      onPlayChange?.(nextPlaying);
      onClick?.(e);
    };

    const handleSpeedChange = (value: string) => {
      const newSpeed = Number(value);
      setSpeed(newSpeed);
      onSpeedChange?.(newSpeed);
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.round(Math.min(100, Math.max(0, (x / rect.width) * 100)));
      setVolume(pct);
      if (muted && pct > 0) setMuted(false);
    };

    const effectiveVolume = muted ? 0 : volume;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-t overflow-hidden cursor-pointer group",
          className
        )}
        onClick={handleRootClick}
        {...props}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full object-cover"
          style={{ aspectRatio: "16/10" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12]/70 via-[#0a0d12]/10 to-transparent" />

        {/* Center play/pause */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            playing
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-100"
          )}
        >
          <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
            {playing ? (
              <Pause className="size-7 text-white fill-white" />
            ) : (
              <Play className="size-7 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-8">
          {/* Seek bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1 h-[3px] rounded-full bg-white/30">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                style={{ width: \`\${progress}%\` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow-md"
                style={{ left: \`\${progress}%\` }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white tabular-nums">
              {duration || "0:00"}
            </span>

            <div className="flex items-center gap-2.5">
              {/* Speed dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-full"
                  >
                    {speed}x
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[160px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={String(speed)}
                    onValueChange={handleSpeedChange}
                  >
                    {speedOptions.map((s) => (
                      <DropdownMenuRadioItem key={s} value={String(s)}>
                        {s === 1 ? "1x (Normal)" : \`\${s}x\`}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Volume */}
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:opacity-70 transition-opacity"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="size-4 text-white/50" />
                  ) : (
                    <Volume2 className="size-4 text-white" />
                  )}
                </button>
                <div
                  className="relative w-[60px] h-4 flex items-center cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div className="w-full h-[3px] rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: \`\${effectiveVolume}%\` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 size-2.5 rounded-full bg-white"
                    style={{
                      left: \`\${effectiveVolume}%\`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreen(!fullscreen);
                }}
                className="hover:opacity-70 transition-opacity"
              >
                {fullscreen ? (
                  <Minimize className="size-4 text-white" />
                ) : (
                  <Maximize className="size-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoMedia.displayName = "VideoMedia";

export { VideoMedia };
`, prefix),
        },
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import * as React from "react";

export interface VideoMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL for the video thumbnail image */
  thumbnailUrl: string;
  /** Video duration text (e.g., "2:30", "1:05:30") */
  duration?: string;
  /** Available speed options. Defaults to [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] */
  speedOptions?: number[];
  /** Initial progress percentage (0-100). Defaults to 0 */
  progress?: number;
  /** Callback when play state changes */
  onPlayChange?: (playing: boolean) => void;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { VideoMedia } from "./video-media";
export type { VideoMediaProps } from "./types";
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
            "file-upload-modal",
            "form-modal",
            "text-field",
            "textarea"
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
export const IvrBotConfig = React.forwardRef(
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
      knowledgeDownloadDisabled,
      knowledgeDeleteDisabled,
      onCreateFunction,
      onEditFunction,
      onDeleteFunction,
      functionEditDisabled,
      functionDeleteDisabled,
      onTestApi,
      functionsInfoTooltip,
      knowledgeBaseInfoTooltip,
      functionPromptMinLength,
      functionPromptMaxLength,
      functionEditData,
      systemPromptMaxLength,
      onSystemPromptBlur,
      onAgentBusyPromptBlur,
      onNoExtensionFoundPromptBlur,
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
      functionVariableGroups,
      onAddFunctionVariable,
      onEditFunctionVariable,
      escalationDepartmentOptions,
      advancedSettingsNumericBounds,
      silenceTimeoutMin,
      silenceTimeoutMax,
      callEndThresholdMin,
      callEndThresholdMax,
      onAdvancedSettingsChange,
      onSilenceTimeoutBlur,
      onCallEndThresholdBlur,
      className,
    }: IvrBotConfigProps,
    ref: React.Ref<HTMLDivElement>
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
              onSystemPromptBlur={onSystemPromptBlur}
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
              onAgentBusyPromptBlur={onAgentBusyPromptBlur}
              onNoExtensionFoundPromptBlur={onNoExtensionFoundPromptBlur}
              disabled={disabled}
            />
          </div>

          {/* Right column — gray panel extending full height */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[2] min-w-0 bg-semantic-bg-ui border-l border-solid border-semantic-border-layout">
            <KnowledgeBaseCard
              files={data.knowledgeBaseFiles}
              onAdd={() => setUploadOpen(true)}
              onDownload={onDownloadKnowledgeFile}
              onDelete={onDeleteKnowledgeFile ? (id) => {
                update({
                  knowledgeBaseFiles: data.knowledgeBaseFiles.filter(
                    (f) => f.id !== id
                  ),
                });
                onDeleteKnowledgeFile(id);
              } : undefined}
              infoTooltip={knowledgeBaseInfoTooltip}
              disabled={disabled}
              downloadDisabled={knowledgeDownloadDisabled}
              deleteDisabled={knowledgeDeleteDisabled}
            />
            <FunctionsCard
              functions={data.functions}
              onAddFunction={() => setCreateFnOpen(true)}
              onEditFunction={onEditFunction ? handleEditFunction : undefined}
              onDeleteFunction={onDeleteFunction ? (id) => {
                update({
                  functions: data.functions.filter((f) => f.id !== id),
                });
                onDeleteFunction(id);
              } : undefined}
              infoTooltip={functionsInfoTooltip}
              disabled={disabled}
              editDisabled={functionEditDisabled}
              deleteDisabled={functionDeleteDisabled}
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
              numericBounds={advancedSettingsNumericBounds}
              silenceTimeoutMin={silenceTimeoutMin}
              silenceTimeoutMax={silenceTimeoutMax}
              callEndThresholdMin={callEndThresholdMin}
              callEndThresholdMax={callEndThresholdMax}
              onAdvancedSettingsChange={onAdvancedSettingsChange}
              onSilenceTimeoutBlur={onSilenceTimeoutBlur}
              onCallEndThresholdBlur={onCallEndThresholdBlur}
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
          sessionVariables={sessionVariables}
          variableGroups={functionVariableGroups}
          onAddVariable={onAddFunctionVariable}
          onEditVariable={onEditFunctionVariable}
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
          sessionVariables={sessionVariables}
          variableGroups={functionVariableGroups}
          onAddVariable={onAddFunctionVariable}
          onEditVariable={onEditFunctionVariable}
          disabled={disabled}
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
          name: "create-function-validation.ts",
          content: prefixTailwindClasses(`import type { KeyValuePair } from "./types";

/** HTTP(S) URL prefix check — used for Create Function API URL field. */
export const URL_REGEX = /^https?:\\/\\//;

export const HEADER_KEY_REGEX = /^[!#$%&'*+\\-.^_\`|~0-9a-zA-Z]+$/;

/** Single message for invalid header keys (KeyValueTable + submit validation). */
export const HEADER_KEY_INVALID_MESSAGE =
  "Invalid header key. Use only alphanumeric and !#$%&'*+-.^_\`|~ characters.";

// Query parameter validation (aligned with apiIntegrationSchema.queryParams)
export const QUERY_PARAM_KEY_MAX = 512;
export const QUERY_PARAM_VALUE_MAX = 2048;
export const QUERY_PARAM_KEY_PATTERN = /^[a-zA-Z0-9_.\\-~]+$/;

export function validateQueryParamKey(key: string): string | undefined {
  if (!key.trim()) return "Query param key is required";
  if (key.length > QUERY_PARAM_KEY_MAX) return "key cannot exceed 512 characters.";
  if (!QUERY_PARAM_KEY_PATTERN.test(key)) return "Invalid query parameter key.";
  return undefined;
}

export function validateQueryParamValue(value: string): string | undefined {
  if (!value.trim()) return "Query param value is required";
  if (value.length > QUERY_PARAM_VALUE_MAX) return "value cannot exceed 2048 characters.";
  return undefined;
}

export function queryParamsHaveErrors(rows: KeyValuePair[]): boolean {
  return rows.some((row) => {
    const hasInput = row.key.trim() !== "" || row.value.trim() !== "";
    if (!hasInput) return false;
    return (
      validateQueryParamKey(row.key) !== undefined ||
      validateQueryParamValue(row.value) !== undefined
    );
  });
}

export const URL_REQUIRED_MESSAGE = "API URL is required";
export const URL_FORMAT_MESSAGE = "URL must start with http:// or https://";

/** On save: URL is required and must start with http:// or https:// */
export function getUrlSubmitValidationError(value: string): string {
  const t = value.trim();
  if (!t) return URL_REQUIRED_MESSAGE;
  if (!URL_REGEX.test(t)) return URL_FORMAT_MESSAGE;
  return "";
}

/** On blur while typing: empty clears; non-empty must match URL_REGEX. */
export function getUrlBlurValidationError(value: string): string {
  if (value.trim() && !URL_REGEX.test(value.trim())) return URL_FORMAT_MESSAGE;
  return "";
}

export const BODY_JSON_ERROR_MESSAGE = "Body must be valid JSON";

/** Empty body is valid; non-empty must parse as JSON. */
export function getBodyJsonValidationError(value: string): string {
  if (!value.trim()) return "";
  try {
    JSON.parse(value.trim());
    return "";
  } catch {
    return BODY_JSON_ERROR_MESSAGE;
  }
}

export type HeaderRowFieldErrors = { key?: string; value?: string };

/** When either key or value has text, both are required; key must match HEADER_KEY_REGEX. */
export function getHeaderRowSubmitErrors(row: KeyValuePair): HeaderRowFieldErrors {
  const hasInput = row.key.trim() !== "" || row.value.trim() !== "";
  if (!hasInput) return {};
  const errors: HeaderRowFieldErrors = {};
  if (!row.key.trim()) errors.key = "Header key is required";
  else if (!HEADER_KEY_REGEX.test(row.key)) {
    errors.key = HEADER_KEY_INVALID_MESSAGE;
  }
  if (!row.value.trim()) errors.value = "Header value is required";
  return errors;
}

export function headerRowsHaveSubmitErrors(rows: KeyValuePair[]): boolean {
  return rows.some((row) => {
    const e = getHeaderRowSubmitErrors(row);
    return Boolean(e.key || e.value);
  });
}
`, prefix),
        },
        {
          name: "create-function-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react";
import { Trash2, ChevronDown, X, Plus, Pencil, CircleAlert } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { FormModal } from "../form-modal";
import { TextField } from "../text-field";
import { Textarea } from "../textarea";
import type {
  CreateFunctionModalProps,
  CreateFunctionData,
  CreateFunctionStep2Data,
  FunctionTabType,
  HttpMethod,
  KeyValuePair,
  VariableGroup,
  VariableItem,
  VariableFormData,
} from "./types";
import {
  HEADER_KEY_INVALID_MESSAGE,
  HEADER_KEY_REGEX,
  QUERY_PARAM_KEY_MAX,
  QUERY_PARAM_VALUE_MAX,
  getBodyJsonValidationError,
  getHeaderRowSubmitErrors,
  getUrlBlurValidationError,
  getUrlSubmitValidationError,
  headerRowsHaveSubmitErrors,
  queryParamsHaveErrors,
  validateQueryParamKey,
  validateQueryParamValue,
} from "./create-function-validation";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const FUNCTION_NAME_MAX = 100;
const BODY_MAX = 4000;
const URL_MAX = 500;
const HEADER_KEY_MAX = 512;
const HEADER_VALUE_MAX = 2048;

const FUNCTION_NAME_REGEX = /^(?!_+$)(?=.*[a-zA-Z])[a-zA-Z][a-zA-Z0-9_]*$/;

/** Spaces → underscores so users can type natural phrases without invalid-name errors. */
function normalizeFunctionNameInput(value: string): string {
  return value.replace(/ /g, "_");
}
const VARIABLE_NAME_MAX = 30;
const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Variable trigger helpers ───────────────────────────────────────────────────

interface TriggerState {
  query: string;
  from: number;
  to: number;
}

/** Where to insert \`{{name}}\` after the user saves "Create new variable" */
type VarInsertContext =
  | { kind: "url"; from: number; to: number }
  | { kind: "body"; from: number; to: number }
  | { kind: "header"; rowId: string; from: number; to: number }
  | { kind: "query"; rowId: string; from: number; to: number };

function detectVarTrigger(value: string, cursor: number): TriggerState | null {
  const before = value.slice(0, cursor);
  const match = /\\{\\{([^}]*)$/.exec(before);
  if (!match) return null;
  return { query: match[1].toLowerCase(), from: match.index, to: cursor };
}

function insertVar(value: string, variable: string, from: number, to: number): string {
  return value.slice(0, from) + variable + value.slice(to);
}

function extractVarRefs(texts: string[]): string[] {
  const pattern = /\\{\\{[^}]+\\}\\}/g;
  const all = texts.flatMap((t) => t.match(pattern) ?? []);
  return Array.from(new Set(all));
}

/** True if a \`{{…}}\` token in the form matches this variable item (handles \`{{name}}\` vs \`{{function.name}}\` and legacy \`item.name\` with \`function.\` prefix). */
function placeholderMatchesVariableItem(placeholder: string, item: VariableItem): boolean {
  if (item.value && placeholder === item.value) return true;
  const asDisplayed = \`{{\${item.name}}}\`;
  const asFunction = \`{{function.\${item.name}}}\`;
  if (placeholder === asDisplayed || placeholder === asFunction) return true;

  const m = /^\\{\\{([^}]+)\\}\\}$/.exec(placeholder);
  if (!m) return false;
  const inner = m[1].trim();
  if (inner === item.name) return true;

  const bareName = item.name.startsWith("function.") ? item.name.slice("function.".length) : item.name;
  return inner === bareName || inner === \`function.\${bareName}\`;
}

/** Aliases for the inner text of \`{{…}}\` (e.g. \`function.foo\` ↔ \`foo\`). */
function placeholderInnerAliases(inner: string): string[] {
  const trimmed = inner.trim();
  if (!trimmed) return [];
  const out = new Set<string>([trimmed]);
  const bare = trimmed.startsWith("function.") ? trimmed.slice("function.".length) : trimmed;
  out.add(bare);
  if (!trimmed.startsWith("function.")) {
    out.add(\`function.\${bare}\`);
  }
  return Array.from(out);
}

/** Keys used to store Test API "required" for a function variable name from the form (bare id, no \`{{}}\`). */
function placeholderInnerAliasesForBareName(bareName: string): string[] {
  const trimmed = bareName.trim();
  if (!trimmed) return [];
  return placeholderInnerAliases(trimmed);
}

function buildFnVarRequiredMapFromGroups(groups?: VariableGroup[]): Record<string, boolean> {
  const seeded: Record<string, boolean> = {};
  for (const g of groups ?? []) {
    for (const item of g.items) {
      if (!item.required) continue;
      const n = item.name.trim();
      const bare = n.startsWith("function.") ? n.slice("function.".length) : n;
      for (const key of placeholderInnerAliasesForBareName(bare)) {
        seeded[key] = true;
      }
    }
  }
  return seeded;
}

/**
 * Whether a \`{{…}}\` placeholder is required for Test API.
 * \`localFnVarRequired\` merges Required from \`variableGroups\` (on open) plus Create/Edit variable saves
 * so validation works when the parent omits \`variableGroups\` or has not updated it yet after \`onAddVariable\`.
 */
function isPlaceholderRequiredInTest(
  placeholder: string,
  variableGroups?: VariableGroup[],
  localFnVarRequired?: Record<string, boolean>
): boolean {
  if (localFnVarRequired && Object.keys(localFnVarRequired).length > 0) {
    const m = /^\\{\\{([^}]+)\\}\\}$/.exec(placeholder.trim());
    if (m) {
      for (const alias of placeholderInnerAliases(m[1])) {
        if (Object.prototype.hasOwnProperty.call(localFnVarRequired, alias)) {
          return Boolean(localFnVarRequired[alias]);
        }
      }
    }
  }

  if (!variableGroups?.length) return false;
  for (const g of variableGroups) {
    for (const item of g.items) {
      if (placeholderMatchesVariableItem(placeholder, item)) {
        return Boolean(item.required);
      }
    }
  }
  return false;
}

/**
 * Rewrites \`{{function.oldRaw}}\` and \`{{oldRaw}}\` to the new name everywhere in a string.
 * Used when saving "Edit variable" so URL, body, headers, and query params stay in sync.
 */
function renameVariableRefsInString(
  text: string,
  oldRaw: string,
  newRaw: string
): string {
  const prev = oldRaw.trim();
  const next = newRaw.trim();
  if (!prev || prev === next) return text;
  const withFunction = text.split(\`{{function.\${prev}}}\`).join(\`{{function.\${next}}}\`);
  return withFunction.split(\`{{\${prev}}}\`).join(\`{{\${next}}}\`);
}

// ── Value segment parser — splits "text {{var}} text" into typed segments ─────

type ValueSegment =
  | { type: "text"; content: string }
  | { type: "var"; name: string; raw: string };

function parseValueSegments(value: string): ValueSegment[] {
  const segments: ValueSegment[] = [];
  const regex = /\\{\\{([^}]+)\\}\\}/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: value.slice(lastIndex, match.index) });
    }
    segments.push({ type: "var", name: match[1], raw: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < value.length) {
    segments.push({ type: "text", content: value.slice(lastIndex) });
  }
  return segments;
}

/** Mirror-div technique — returns { top, left } relative to the element's top-left corner. */
function getCaretPixelPos(
  el: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  const cs = window.getComputedStyle(el);
  const mirror = document.createElement("div");

  (
    [
      "boxSizing", "width", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant",
      "letterSpacing", "lineHeight", "textTransform", "wordSpacing", "tabSize",
    ] as (keyof CSSStyleDeclaration)[]
  ).forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mirror.style as any)[prop] = cs[prop];
  });

  mirror.style.whiteSpace = el.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
  mirror.style.wordWrap = el.tagName === "TEXTAREA" ? "break-word" : "normal";
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.overflow = "hidden";
  mirror.style.top = "0";
  mirror.style.left = "0";
  mirror.style.width = el.offsetWidth + "px";

  document.body.appendChild(mirror);
  mirror.appendChild(document.createTextNode(el.value.substring(0, position)));

  const marker = document.createElement("span");
  marker.textContent = "\\u200b";
  mirror.appendChild(marker);

  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();
  document.body.removeChild(mirror);

  const scrollTop = el instanceof HTMLTextAreaElement ? el.scrollTop : 0;
  return {
    top: markerRect.top - mirrorRect.top - scrollTop,
    left: markerRect.left - mirrorRect.left,
  };
}

// Uses same visual classes as DropdownMenuContent + DropdownMenuItem.
// Position is cursor-anchored via getCaretPixelPos.
// No search bar — typing after {{ already filters via filterQuery.
function VarPopup({
  variables,
  variableGroups,
  filterQuery = "",
  onSelect,
  onAddVariable,
  onEditVariable,
  style,
}: {
  variables: string[];
  variableGroups?: VariableGroup[];
  filterQuery?: string;
  onSelect: (v: string) => void;
  onAddVariable?: () => void;
  onEditVariable?: (variable: string) => void;
  style?: React.CSSProperties;
}) {
  const hasGroups = variableGroups && variableGroups.length > 0;

  if (!hasGroups && variables.length === 0) return null;

  // Flat mode — variables are already pre-filtered by VariableInput
  if (!hasGroups) {
    return (
      <div
        role="listbox"
        style={style}
        className="absolute z-[9999] min-w-[14rem] max-w-sm rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary py-1 text-semantic-text-primary shadow-md"
      >
        {/* Add new variable */}
        {onAddVariable && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onAddVariable(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
          >
            <Plus className="size-3.5 shrink-0" />
            Add new variable
          </button>
        )}

        {/* Variable list */}
        <div className="max-h-48 overflow-y-auto p-1">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(e) => { e.preventDefault(); onSelect(v); }}
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-semantic-bg-ui"
            >
              {v}
            </button>
          ))}
          {variables.length === 0 && (
            <p className="m-0 px-2 py-1.5 text-sm text-semantic-text-muted">No variables found</p>
          )}
        </div>
      </div>
    );
  }

  // Grouped mode — filter by the {{ trigger query
  const lowerQuery = filterQuery.toLowerCase();
  const filteredGroups = variableGroups.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery)
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div
      role="listbox"
      style={style}
      className="absolute z-[9999] min-w-[14rem] max-w-sm rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary py-1 text-semantic-text-primary shadow-md"
    >
      {/* Add new variable */}
      {onAddVariable && (
        <>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onAddVariable(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
          >
            <Plus className="size-3.5 shrink-0" />
            Add new variable
          </button>
          <div className="border-t border-solid border-semantic-border-layout" />
        </>
      )}

      {/* Grouped variable list */}
      <div className="max-h-48 overflow-y-auto p-1">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="m-0 px-2 pt-2 pb-1 text-sm font-medium text-semantic-text-muted">
              {group.label}
            </p>
            {group.items.map((item) => {
              const insertValue = item.value ?? \`{{\${item.name}}}\`;
              return (
                <div key={item.name} className="flex items-center rounded-sm transition-colors hover:bg-semantic-bg-ui">
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(insertValue); }}
                    className="relative flex flex-1 min-w-0 cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none"
                  >
                    {\`{{\${item.name}}}\`}
                  </button>
                  {item.editable && onEditVariable && (
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); onEditVariable(item.name); }}
                      className="shrink-0 p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                      aria-label={\`Edit \${item.name}\`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="m-0 px-2 py-1.5 text-sm text-semantic-text-muted">No variables found</p>
        )}
      </div>
    </div>
  );
}

// ── VariableFormModal — create/edit a variable ───────────────────────────────

function VariableFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: VariableItem;
  onSave: (data: VariableFormData) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [required, setRequired] = React.useState(false);
  const [nameError, setNameError] = React.useState("");

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setDescription(initialData?.description ?? "");
      setRequired(initialData?.required ?? false);
      setNameError("");
    }
  }, [open, initialData]);

  const validateName = (v: string) => {
    if (!v.trim()) return "";
    if (!VARIABLE_NAME_REGEX.test(v)) {
      return "Variable name should start with alphabet; Cannot have special characters except underscore (_)";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    setNameError(validateName(v));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(
        required
          ? "Value is required for this key"
          : "Variable name is required"
      );
      return;
    }
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }
    onSave({ name: name.trim(), description: description.trim() || undefined, required });
  };

  const hasInvalidFormat = Boolean(name.trim() && validateName(name));

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Create new variable" : "Edit variable"}
      saveButtonText={mode === "create" ? "Save" : "Save Changes"}
      disableSave={hasInvalidFormat}
      onSave={handleSave}
      size="default"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-semantic-text-muted">
            Variable name{" "}
            <span className="text-semantic-error-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g., customer_name"
              maxLength={VARIABLE_NAME_MAX}
              aria-invalid={Boolean(nameError)}
              className={cn(
                inputCls,
                "pr-16",
                nameError && "border-semantic-error-primary"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted pointer-events-none">
              {name.length}/{VARIABLE_NAME_MAX}
            </span>
          </div>
          {nameError ? (
            <p className="m-0 flex items-start gap-1.5 text-sm text-semantic-error-primary">
              <CircleAlert className="size-4 shrink-0 mt-0.5" aria-hidden />
              <span>{nameError}</span>
            </p>
          ) : (
            <span className="text-sm text-semantic-text-muted">
              Variable name should start with alphabet; Cannot have special characters except
              underscore (_)
            </span>
          )}
        </div>
        <TextField
          label="Description (optional)"
          placeholder="What this variable represents"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-semantic-text-muted">Required</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="variable-required"
                checked={required}
                onChange={() => setRequired(true)}
                className="size-4 accent-semantic-primary"
              />
              <span className="text-base text-semantic-text-primary">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="variable-required"
                checked={!required}
                onChange={() => setRequired(false)}
                className="size-4 accent-semantic-primary"
              />
              <span className="text-base text-semantic-text-primary">No</span>
            </label>
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ── VariableInput — input with {{ autocomplete + badge display ──────────────

function VariableInput({
  value,
  onChange,
  sessionVariables,
  variableGroups,
  onAddVariable,
  onEditVariable,
  placeholder,
  maxLength,
  className,
  inputRef: externalInputRef,
  disabled,
  ...inputProps
}: {
  value: string;
  onChange: (v: string) => void;
  sessionVariables: string[];
  variableGroups?: VariableGroup[];
  onAddVariable?: (range: { from: number; to: number }) => void;
  onEditVariable?: (variable: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  [k: string]: unknown;
}) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? internalRef;
  const displayRef = React.useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = React.useState<TriggerState | null>(null);
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const filtered = trigger
    ? sessionVariables.filter((v) => v.toLowerCase().includes(trigger.query))
    : [];

  // Parse value into text + variable segments
  const segments = React.useMemo(() => parseValueSegments(value), [value]);
  const hasVariables = segments.some((s) => s.type === "var");
  const showDisplay = !isEditing && value.length > 0 && hasVariables;

  // Check overflow in display mode
  React.useEffect(() => {
    if (showDisplay && displayRef.current && !isExpanded) {
      const el = displayRef.current;
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    } else {
      setIsOverflowing(false);
    }
  }, [showDisplay, value, isExpanded]);

  const updatePopupPos = (el: HTMLInputElement, cursor: number) => {
    const caret = getCaretPixelPos(el, cursor);
    const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
    const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
    setPopupStyle({ top: caret.top + lineHeight, left });
  };

  const clearTrigger = () => {
    setTrigger(null);
    setPopupStyle(undefined);
  };

  const handleSelect = (variable: string) => {
    if (!trigger) return;
    onChange(insertVar(value, variable, trigger.from, trigger.to));
    clearTrigger();
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        const pos = trigger.from + variable.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });
  };

  return (
    <div className="relative w-full">
      {/* Input — always in DOM, hidden when display mode is active */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(className, showDisplay && "opacity-0 pointer-events-none")}
        onChange={(e) => {
          onChange(e.target.value);
          const cursor = e.target.selectionStart ?? e.target.value.length;
          const t = detectVarTrigger(e.target.value, cursor);
          setTrigger(t);
          if (t) updatePopupPos(e.target, cursor);
          else setPopupStyle(undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearTrigger();
        }}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          clearTrigger();
          setIsEditing(false);
          setIsExpanded(false);
        }}
        {...inputProps}
      />

      {/* Display mode — variable badges + text + overflow */}
      {showDisplay && (
        <div
          className={cn(
            "absolute cursor-text",
            !isExpanded && "inset-0 flex items-center",
            isExpanded && "inset-x-0 top-0 z-10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (!disabled) inputRef.current?.focus();
          }}
        >
          <div
            ref={displayRef}
            className={cn(
              "flex items-center gap-1 px-2",
              !isExpanded && "flex-1 min-w-0 overflow-hidden",
              isExpanded && "flex-wrap bg-semantic-bg-primary border border-solid border-semantic-border-input rounded py-1.5 shadow-sm"
            )}
          >
            {segments.map((seg, i) =>
              seg.type === "text" ? (
                <span key={i} className="text-sm text-semantic-text-primary whitespace-pre shrink-0">{seg.content}</span>
              ) : (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 shrink-0 rounded px-1.5 py-0.5 text-sm bg-semantic-info-surface text-semantic-text-primary"
                >
                  {seg.name}
                  {onEditVariable && (
                    <button
                      type="button"
                      aria-label={\`Edit variable \${seg.name}\`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditVariable(seg.name);
                      }}
                      className="p-0.5 text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                    >
                      <Pencil className="size-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isOverflowing && !isExpanded && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="shrink-0 px-1 text-sm font-medium text-semantic-text-muted hover:text-semantic-text-primary"
            >
              ...
            </button>
          )}
        </div>
      )}

      {/* VarPopup */}
      <VarPopup
        variables={filtered}
        variableGroups={trigger ? variableGroups : undefined}
        filterQuery={trigger?.query ?? ""}
        onSelect={handleSelect}
        onAddVariable={
          onAddVariable && trigger
            ? () => onAddVariable({ from: trigger.from, to: trigger.to })
            : undefined
        }
        onEditVariable={onEditVariable}
        style={popupStyle}
      />
    </div>
  );
}

// ── Shared input/textarea styles ──────────────────────────────────────────────
const inputCls = cn(
  "w-full h-[42px] px-4 text-base rounded border border-solid",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

const textareaCls = cn(
  "w-full px-4 py-2.5 text-base rounded border border-solid resize-none",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

// ── KeyValueTable ─────────────────────────────────────────────────────────────
type RowErrors = { key?: string; value?: string };

function KeyValueTable({
  rows,
  onChange,
  label,
  getRowErrors,
  keyMaxLength,
  valueMaxLength,
  keyRegex,
  keyRegexError,
  sessionVariables = [],
  variableGroups,
  onAddVariable,
  onEditVariable,
  disabled = false,
}: {
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
  label: string;
  getRowErrors?: (row: KeyValuePair) => RowErrors;
  keyMaxLength?: number;
  valueMaxLength?: number;
  keyRegex?: RegExp;
  keyRegexError?: string;
  sessionVariables?: string[];
  variableGroups?: VariableGroup[];
  onAddVariable?: (ctx: { rowId: string; from: number; to: number }) => void;
  onEditVariable?: (variable: string) => void;
  disabled?: boolean;
}) {
  const update = (id: string, patch: Partial<KeyValuePair>) => {
    // Replace spaces with hyphens in key values
    if (patch.key !== undefined) {
      patch = { ...patch, key: patch.key.replace(/ /g, "-") };
    }
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const add = () =>
    onChange([...rows, { id: generateId(), key: "", value: "" }]);

  const getErrors = (row: KeyValuePair): RowErrors => {
    if (getRowErrors) return getRowErrors(row);
    // Inline validation from keyRegex prop when no getRowErrors provided
    const errors: RowErrors = {};
    if (keyRegex && row.key.trim() && !keyRegex.test(row.key)) {
      errors.key = keyRegexError ?? "Invalid key format";
    }
    return errors;
  };

  // Reusable delete row action — same placement and styling as KeyValueRow / knowledge-base-card
  const deleteRowButtonClass =
    "text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors shrink-0";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-semantic-text-muted">{label}</span>
      <div className="border border-solid border-semantic-border-layout rounded">
        {/* Column headers — desktop only; border-r on Key cell defines column boundary */}
        <div className="hidden sm:flex border-b border-solid border-semantic-border-layout rounded-t">
          <div className="flex-1 min-w-0 px-3 py-2 text-sm font-semibold text-semantic-text-muted border-r border-solid border-semantic-border-layout">
            Key
          </div>
          <div className="flex-[2] min-w-0 px-3 py-2 text-sm font-semibold text-semantic-text-muted">
            Value
          </div>
          <div className="w-10 shrink-0" aria-hidden="true" />
        </div>

        {/* Filled rows — same flex ratio (flex-1 / flex-2 / w-10) so middle border aligns with header */}
        {rows.map((row) => {
          const errors = getErrors(row);
          return (
            <div
              key={row.id}
              className="border-b border-solid border-semantic-border-layout last:border-b-0 flex items-center min-h-0"
            >
              {/* Key column — border-r on column (not input) so it aligns with header */}
              <div className="flex-1 flex flex-col min-w-0 sm:border-r sm:border-solid sm:border-semantic-border-layout">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-sm font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Key
                </span>
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => update(row.id, { key: e.target.value })}
                  placeholder="Key"
                  maxLength={keyMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.key && "text-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.key)}
                />
              </div>

              {/* Value column — uses VariableInput for {{ autocomplete */}
              <div className="flex-[2] flex flex-col min-w-0">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-sm font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Value
                </span>
                <VariableInput
                  value={row.value}
                  onChange={(v) => update(row.id, { value: v })}
                  sessionVariables={sessionVariables}
                  variableGroups={variableGroups}
                  onAddVariable={
                    onAddVariable
                      ? (range) => onAddVariable({ rowId: row.id, ...range })
                      : undefined
                  }
                  onEditVariable={onEditVariable}
                  placeholder="Type {{ to add variables"
                  maxLength={valueMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.value && "text-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.value)}
                />
              </div>

              {/* Action column — delete aligned with row (same as KeyValueRow / knowledge-base-card) */}
              <div className="w-10 sm:w-10 flex items-center justify-center shrink-0 self-stretch border-l border-solid border-semantic-border-layout sm:border-l-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(row.id)}
                  disabled={disabled}
                  className={cn("rounded-md", deleteRowButtonClass)}
                  aria-label="Delete row"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Add row — always visible */}
        <button
          type="button"
          onClick={add}
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-muted hover:bg-semantic-bg-ui transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="size-3.5 shrink-0" />
          <span>Add row</span>
        </button>
      </div>

      {/* Collected row errors — shown below the table */}
      {(() => {
        const allErrors = rows
          .map((row) => {
            const errs = getErrors(row);
            const msgs: string[] = [];
            if (errs.key) msgs.push(errs.key);
            if (errs.value) msgs.push(errs.value);
            return msgs;
          })
          .flat();
        if (allErrors.length === 0) return null;
        // Deduplicate
        const unique = Array.from(new Set(allErrors));
        return (
          <div className="flex flex-col gap-0.5">
            {unique.map((msg) => (
              <p key={msg} className="m-0 text-sm text-semantic-error-primary">{msg}</p>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export const CreateFunctionModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      onSubmit,
      onTestApi,
      initialData,
      isEditing = false,
      promptMinLength = 100,
      promptMaxLength = 1000,
      initialStep = 1,
      initialTab = "header",
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      variableGroups,
      onAddVariable,
      onEditVariable,
      disabled = false,
      className,
    }: CreateFunctionModalProps,
    ref: React.Ref<HTMLDivElement>
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
    const [step2SubmitAttempted, setStep2SubmitAttempted] = React.useState(false);
    const [nameError, setNameError] = React.useState("");
    const [urlError, setUrlError] = React.useState("");
    const [bodyError, setBodyError] = React.useState("");

    // Variable modal state
    const [varModalOpen, setVarModalOpen] = React.useState(false);
    const [varModalMode, setVarModalMode] = React.useState<"create" | "edit">("create");
    const [varModalInitialData, setVarModalInitialData] = React.useState<VariableItem | undefined>();
    /** Field + \`{{…\` range to replace with \`{{name}}\` after create saves */
    const [varInsertContext, setVarInsertContext] = React.useState<VarInsertContext | null>(null);

    /**
     * Required flags for function variables for Test API: seeded from \`variableGroups\` on open, then
     * updated when the user saves Create/Edit variable (covers missing/stale parent props).
     */
    const [localFnVarRequiredByBareName, setLocalFnVarRequiredByBareName] = React.useState<
      Record<string, boolean>
    >({});

    const openVariableCreateModal = React.useCallback(() => {
      setVarModalMode("create");
      setVarModalInitialData(undefined);
      setVarModalOpen(true);
    }, []);

    const handleVarModalOpenChange = React.useCallback((next: boolean) => {
      setVarModalOpen(next);
      if (!next) setVarInsertContext(null);
    }, []);

    const handleAddVariableFromHeader = React.useCallback(
      (ctx: { rowId: string; from: number; to: number }) => {
        setVarInsertContext({ kind: "header", ...ctx });
        openVariableCreateModal();
      },
      [openVariableCreateModal]
    );

    const handleAddVariableFromQuery = React.useCallback(
      (ctx: { rowId: string; from: number; to: number }) => {
        setVarInsertContext({ kind: "query", ...ctx });
        openVariableCreateModal();
      },
      [openVariableCreateModal]
    );

    const handleEditVariableClick = (variableName: string) => {
      setVarInsertContext(null);
      const rawName = variableName.startsWith("function.") ? variableName.slice(9) : variableName;
      const variable = variableGroups
        ?.flatMap((g) => g.items)
        .find((item) => item.name === rawName);
      setVarModalMode("edit");
      setVarModalInitialData(variable ?? { name: rawName, editable: true });
      setVarModalOpen(true);
    };

    const handleVariableSave = (data: VariableFormData) => {
      const trimmedName = data.name.trim();
      const insertToken = \`{{function.\${trimmedName}}}\`;

      if (varModalMode === "create" && varInsertContext) {
        const ctx = varInsertContext;
        if (ctx.kind === "url") {
          setUrl((u) => insertVar(u, insertToken, ctx.from, ctx.to));
        } else if (ctx.kind === "body") {
          setBody((b) => insertVar(b, insertToken, ctx.from, ctx.to));
        } else if (ctx.kind === "header") {
          setHeaders((rows) =>
            rows.map((r) =>
              r.id === ctx.rowId
                ? { ...r, value: insertVar(r.value, insertToken, ctx.from, ctx.to) }
                : r
            )
          );
        } else if (ctx.kind === "query") {
          setQueryParams((rows) =>
            rows.map((r) =>
              r.id === ctx.rowId
                ? { ...r, value: insertVar(r.value, insertToken, ctx.from, ctx.to) }
                : r
            )
          );
        }
        setVarInsertContext(null);
      }

      const requiredFlag = Boolean(data.required);

      const applyRequiredToLocalMap = (bareName: string, required: boolean) => {
        setLocalFnVarRequiredByBareName((prev) => {
          const next = { ...prev };
          for (const key of placeholderInnerAliasesForBareName(bareName)) {
            next[key] = required;
          }
          return next;
        });
      };

      if (varModalMode === "create") {
        onAddVariable?.(data);
        applyRequiredToLocalMap(trimmedName, requiredFlag);
      } else {
        const prevRaw = (varModalInitialData?.name ?? "").trim();
        if (prevRaw && prevRaw !== trimmedName) {
          setUrl((u) => renameVariableRefsInString(u, prevRaw, trimmedName));
          setBody((b) => renameVariableRefsInString(b, prevRaw, trimmedName));
          setHeaders((rows) =>
            rows.map((r) => ({
              ...r,
              value: renameVariableRefsInString(r.value, prevRaw, trimmedName),
            }))
          );
          setQueryParams((rows) =>
            rows.map((r) => ({
              ...r,
              value: renameVariableRefsInString(r.value, prevRaw, trimmedName),
            }))
          );
          setTestVarValues((prev) => {
            const next: Record<string, string> = {};
            for (const [k, v] of Object.entries(prev)) {
              next[renameVariableRefsInString(k, prevRaw, trimmedName)] = v;
            }
            return next;
          });
          setLocalFnVarRequiredByBareName((prev) => {
            const next = { ...prev };
            for (const key of placeholderInnerAliasesForBareName(prevRaw)) {
              delete next[key];
            }
            for (const key of placeholderInnerAliasesForBareName(trimmedName)) {
              next[key] = requiredFlag;
            }
            return next;
          });
        } else {
          applyRequiredToLocalMap(trimmedName, requiredFlag);
        }
        onEditVariable?.(prevRaw, data);
      }
      setVarModalOpen(false);
    };

    // Variable trigger state for URL and body
    const urlInputRef = React.useRef<HTMLInputElement>(null);
    const bodyTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [urlTrigger, setUrlTrigger] = React.useState<TriggerState | null>(null);
    const [bodyTrigger, setBodyTrigger] = React.useState<TriggerState | null>(null);
    const [urlPopupStyle, setUrlPopupStyle] = React.useState<React.CSSProperties | undefined>();
    const [bodyPopupStyle, setBodyPopupStyle] = React.useState<React.CSSProperties | undefined>();

    const filteredUrlVars = urlTrigger
      ? sessionVariables.filter((v) => v.toLowerCase().includes(urlTrigger.query))
      : [];
    const filteredBodyVars = bodyTrigger
      ? sessionVariables.filter((v) => v.toLowerCase().includes(bodyTrigger.query))
      : [];

    const handleAddVariableFromUrl = React.useCallback(() => {
      if (urlTrigger) {
        setVarInsertContext({
          kind: "url",
          from: urlTrigger.from,
          to: urlTrigger.to,
        });
      }
      openVariableCreateModal();
    }, [urlTrigger, openVariableCreateModal]);

    const handleAddVariableFromBody = React.useCallback(() => {
      if (bodyTrigger) {
        setVarInsertContext({
          kind: "body",
          from: bodyTrigger.from,
          to: bodyTrigger.to,
        });
      }
      openVariableCreateModal();
    }, [bodyTrigger, openVariableCreateModal]);

    const computePopupStyle = (
      el: HTMLTextAreaElement | HTMLInputElement,
      cursor: number
    ): React.CSSProperties => {
      const caret = getCaretPixelPos(el, cursor);
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
      const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
      return { top: caret.top + lineHeight, left };
    };

    // Test variable values — filled by user before clicking Test API
    const [testVarValues, setTestVarValues] = React.useState<Record<string, string>>({});
    /** Set when user clicks Test API — drives inline errors for empty required variable values only (not Submit). */
    const [testApiRequiredAttempted, setTestApiRequiredAttempted] = React.useState(false);

    // Unique {{variable}} refs found across url, body, headers, queryParams
    const testableVars = React.useMemo(
      () =>
        extractVarRefs([
          url,
          body,
          ...headers.map((h) => h.value),
          ...queryParams.map((q) => q.value),
        ]),
      [url, body, headers, queryParams]
    );

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
        setStep2SubmitAttempted(false);
        setTestApiRequiredAttempted(false);
        setNameError("");
        setUrlError("");
        setBodyError("");
        setUrlTrigger(null);
        setBodyTrigger(null);
        setUrlPopupStyle(undefined);
        setBodyPopupStyle(undefined);
        setTestVarValues({});
        setLocalFnVarRequiredByBareName(buildFnVarRequiredMapFromGroups(variableGroups));
        setVarInsertContext(null);
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
      setStep2SubmitAttempted(false);
      setTestApiRequiredAttempted(false);
      setNameError("");
      setUrlError("");
      setBodyError("");
      setUrlTrigger(null);
      setBodyTrigger(null);
      setUrlPopupStyle(undefined);
      setBodyPopupStyle(undefined);
      setTestVarValues({});
      setLocalFnVarRequiredByBareName(buildFnVarRequiredMapFromGroups(variableGroups));
      setVarInsertContext(null);
    }, [initialData, initialStep, initialTab, variableGroups]);

    const handleClose = React.useCallback(() => {
      reset();
      onOpenChange(false);
    }, [reset, onOpenChange]);

    // Body tab is always visible regardless of HTTP method

    const validateName = (value: string) => {
      if (value.trim() && !FUNCTION_NAME_REGEX.test(value.trim())) {
        setNameError("Must start with a letter and contain only letters, numbers, and underscores");
      } else {
        setNameError("");
      }
    };

    const validateUrl = (value: string) => {
      setUrlError(getUrlBlurValidationError(value));
    };

    const validateBody = (value: string) => {
      setBodyError(getBodyJsonValidationError(value));
    };

    const handleNext = () => {
      if (disabled || (name.trim() && prompt.trim().length >= promptMinLength)) setStep(2);
    };

    const handleSubmit = () => {
      if (step !== 2) return;

      setStep2SubmitAttempted(true);

      const urlErr = getUrlSubmitValidationError(url);
      setUrlError(urlErr);

      const bodyErr = getBodyJsonValidationError(body);
      setBodyError(bodyErr);

      if (queryParamsHaveErrors(queryParams)) return;
      if (urlErr || bodyErr) return;

      if (headerRowsHaveSubmitErrors(headers)) return;

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

    // Substitute {{variable}} references with user-provided test values before calling onTestApi
    const substituteVars = (text: string) =>
      text.replace(/\\{\\{[^}]+\\}\\}/g, (match) => testVarValues[match] ?? match);

    const handleTestApi = async () => {
      // Validate all test variable values are filled (always runs, regardless of onTestApi)
      const requiredTestVars = testableVars.filter((v) =>
        isPlaceholderRequiredInTest(v, variableGroups, localFnVarRequiredByBareName)
      );
      if (requiredTestVars.length > 0) {
        setTestApiRequiredAttempted(true);
        const hasEmpty = requiredTestVars.some((v) => !testVarValues[v]?.trim());
        if (hasEmpty) return;
      }

      if (!onTestApi) return;

      setIsTesting(true);
      try {
        const step2: CreateFunctionStep2Data = {
          method,
          url: substituteVars(url),
          headers: headers.map((h) => ({ ...h, value: substituteVars(h.value) })),
          queryParams: queryParams.map((q) => ({ ...q, value: substituteVars(q.value) })),
          body: substituteVars(body),
        };
        const response = await onTestApi(step2, { ...testVarValues });
        setApiResponse(response);
      } finally {
        setIsTesting(false);
      }
    };

    // URL variable insertion
    const handleUrlVarSelect = (variable: string) => {
      if (!urlTrigger) return;
      setUrl(insertVar(url, variable, urlTrigger.from, urlTrigger.to));
      setUrlTrigger(null);
      setUrlPopupStyle(undefined);
      requestAnimationFrame(() => {
        const el = urlInputRef.current;
        if (el) {
          const pos = urlTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
        }
      });
    };

    // Body variable insertion
    const handleBodyVarSelect = (variable: string) => {
      if (!bodyTrigger) return;
      setBody(insertVar(body, variable, bodyTrigger.from, bodyTrigger.to));
      setBodyTrigger(null);
      setBodyPopupStyle(undefined);
      requestAnimationFrame(() => {
        const el = bodyTextareaRef.current;
        if (el) {
          const pos = bodyTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
        }
      });
    };

    const isStep1Valid =
      name.trim().length > 0 &&
      FUNCTION_NAME_REGEX.test(name.trim()) &&
      prompt.trim().length >= promptMinLength;

    const tabLabels: Record<FunctionTabType, string> = {
      header: \`Header (\${headers.length})\`,
      queryParams: \`Query params (\${queryParams.length})\`,
      body: "Body",
    };

    const visibleTabs: FunctionTabType[] = ["header", "queryParams", "body"];

    return (
      <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="lg"
          hideCloseButton
          className={cn(
            "flex flex-col gap-0 p-0 w-[calc(100vw-2rem)] sm:w-full",
            "max-h-[calc(100vh-2rem)] overflow-hidden",
            className
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout shrink-0 sm:px-6">
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
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain px-4 py-5 sm:px-6">
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
                      disabled={disabled}
                      onChange={(e) => {
                        const normalized = normalizeFunctionNameInput(
                          e.target.value
                        );
                        setName(normalized);
                        if (nameError) validateName(normalized);
                      }}
                      onBlur={(e) =>
                        validateName(normalizeFunctionNameInput(e.target.value))
                      }
                      placeholder="Enter name of the function"
                      className={cn(inputCls, "pr-16")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted pointer-events-none">
                      {name.length}/{FUNCTION_NAME_MAX}
                    </span>
                  </div>
                  {nameError && (
                    <p className="m-0 text-sm text-semantic-error-primary">{nameError}</p>
                  )}
                </div>

                <Textarea
                  id="fn-prompt"
                  label="Prompt"
                  required
                  value={prompt}
                  maxLength={promptMaxLength}
                  showCount
                  disabled={disabled}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the description of the function"
                  rows={5}
                  labelClassName="font-semibold text-semantic-text-primary"
                  error={
                    prompt.length > 0 && prompt.trim().length < promptMinLength
                      ? \`Minimum \${promptMinLength} characters required\`
                      : undefined
                  }
                />
              </div>
            )}

            {/* ─ Step 2 ─ */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                {/* API URL — always a single combined row */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-semantic-text-muted tracking-[0.048px]">
                    API URL
                  </span>
                    <div
                    className={cn(
                      "flex h-[42px] rounded border border-solid overflow-visible bg-semantic-bg-primary",
                      "transition-shadow",
                      urlError
                        ? "border-semantic-error-primary focus-within:border-semantic-error-primary"
                        : "border-semantic-border-input focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                    )}
                  >
                    {/* Method selector */}
                    <div className="relative shrink-0 border-r border-solid border-semantic-border-layout">
                      <select
                        value={method}
                        disabled={disabled}
                        onChange={(e) =>
                          setMethod(e.target.value as HttpMethod)
                        }
                        className={cn(
                          "h-full w-[80px] pl-3 pr-7 text-base text-semantic-text-primary bg-transparent outline-none cursor-pointer appearance-none sm:w-[100px]",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
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
                    {/* URL input with {{ trigger */}
                    <div className="relative flex-1 min-w-0">
                      <input
                        ref={urlInputRef}
                        type="text"
                        value={url}
                        maxLength={URL_MAX}
                        disabled={disabled}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (urlError) validateUrl(e.target.value);
                          const cursor = e.target.selectionStart ?? e.target.value.length;
                          const t = detectVarTrigger(e.target.value, cursor);
                          setUrlTrigger(t);
                          if (t) setUrlPopupStyle(computePopupStyle(e.target, cursor));
                          else setUrlPopupStyle(undefined);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") { setUrlTrigger(null); setUrlPopupStyle(undefined); }
                        }}
                        onBlur={(e) => {
                          validateUrl(e.target.value);
                          setUrlTrigger(null);
                          setUrlPopupStyle(undefined);
                        }}
                        placeholder="Enter URL or Type {{ to add variables"
                        aria-invalid={Boolean(urlError)}
                        aria-describedby={urlError ? "fn-api-url-error" : undefined}
                        className={cn(
                          "h-full w-full px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
                      />
                      <VarPopup
                        variables={filteredUrlVars}
                        variableGroups={urlTrigger ? variableGroups : undefined}
                        filterQuery={urlTrigger?.query ?? ""}
                        onSelect={handleUrlVarSelect}
                        onAddVariable={onAddVariable ? handleAddVariableFromUrl : undefined}
                        onEditVariable={onEditVariable ? handleEditVariableClick : undefined}
                        style={urlPopupStyle}
                      />
                    </div>
                  </div>
                  {urlError && (
                    <p id="fn-api-url-error" className="m-0 text-sm text-semantic-error-primary">
                      {urlError}
                    </p>
                  )}
                </div>

                {/* Tabs — scrollable, no visible scrollbar */}
                <div className="flex flex-col gap-4">
                  <div
                    className={cn(
                      "flex border-b border-solid border-semantic-border-layout",
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
                            ? "text-semantic-text-secondary border-b-2 border-solid border-semantic-text-secondary -mb-px"
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
                      keyMaxLength={HEADER_KEY_MAX}
                      valueMaxLength={HEADER_VALUE_MAX}
                      keyRegex={HEADER_KEY_REGEX}
                      keyRegexError={HEADER_KEY_INVALID_MESSAGE}
                      getRowErrors={(row) => {
                        if (!step2SubmitAttempted) {
                          const errors: RowErrors = {};
                          if (row.key.trim() && !HEADER_KEY_REGEX.test(row.key)) {
                            errors.key = HEADER_KEY_INVALID_MESSAGE;
                          }
                          return errors;
                        }
                        return getHeaderRowSubmitErrors(row);
                      }}
                      sessionVariables={sessionVariables}
                      variableGroups={variableGroups}
                      onAddVariable={handleAddVariableFromHeader}
                      onEditVariable={handleEditVariableClick}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "queryParams" && (
                    <KeyValueTable
                      rows={queryParams}
                      onChange={setQueryParams}
                      label="Query parameter"
                      keyMaxLength={QUERY_PARAM_KEY_MAX}
                      valueMaxLength={QUERY_PARAM_VALUE_MAX}
                      getRowErrors={(row) => {
                        const hasInput = row.key.trim() !== "" || row.value.trim() !== "";
                        if (!hasInput && !step2SubmitAttempted) return {};
                        return {
                          key: validateQueryParamKey(row.key),
                          value: validateQueryParamValue(row.value),
                        };
                      }}
                      sessionVariables={sessionVariables}
                      variableGroups={variableGroups}
                      onAddVariable={handleAddVariableFromQuery}
                      onEditVariable={handleEditVariableClick}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "body" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-semantic-text-muted">
                        Body
                      </span>
                      <div className={cn("relative")}>
                        <textarea
                          ref={bodyTextareaRef}
                          value={body}
                          maxLength={BODY_MAX}
                          disabled={disabled}
                          aria-invalid={Boolean(bodyError)}
                          aria-describedby={bodyError ? "fn-body-error" : undefined}
                          onChange={(e) => {
                            setBody(e.target.value);
                            if (bodyError) validateBody(e.target.value);
                            const cursor = e.target.selectionStart ?? e.target.value.length;
                            const t = detectVarTrigger(e.target.value, cursor);
                            setBodyTrigger(t);
                            if (t) setBodyPopupStyle(computePopupStyle(e.target, cursor));
                            else setBodyPopupStyle(undefined);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") { setBodyTrigger(null); setBodyPopupStyle(undefined); }
                          }}
                          onBlur={(e) => {
                            validateBody(e.target.value);
                            setBodyTrigger(null);
                            setBodyPopupStyle(undefined);
                          }}
                          placeholder="Enter request body (JSON). Type {{ to add variables"
                          rows={6}
                          className={cn(textareaCls, "pb-7")}
                        />
                        <span className="absolute bottom-2 right-3 text-sm text-semantic-text-muted pointer-events-none">
                          {body.length}/{BODY_MAX}
                        </span>
                        <VarPopup
                          variables={filteredBodyVars}
                          variableGroups={bodyTrigger ? variableGroups : undefined}
                          filterQuery={bodyTrigger?.query ?? ""}
                          onSelect={handleBodyVarSelect}
                          onAddVariable={onAddVariable ? handleAddVariableFromBody : undefined}
                          onEditVariable={onEditVariable ? handleEditVariableClick : undefined}
                          style={bodyPopupStyle}
                        />
                      </div>
                      {bodyError && (
                        <p id="fn-body-error" className="m-0 text-sm text-semantic-error-primary">
                          {bodyError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Test Your API */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-semantic-text-muted tracking-[0.048px]">
                      Test Your API
                    </span>
                    <div className="border-t border-solid border-semantic-border-layout" />
                  </div>

                  {/* Variable test values — shown when URL/body/params contain {{variables}} */}
                  {testableVars.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-semantic-text-muted">
                        Variable values for testing
                      </span>
                      {testableVars.map((variable, varIndex) => {
                        const mustFill = isPlaceholderRequiredInTest(
                          variable,
                          variableGroups,
                          localFnVarRequiredByBareName
                        );
                        const isEmpty =
                          mustFill &&
                          testApiRequiredAttempted &&
                          !testVarValues[variable]?.trim();
                        const testVarErrId = \`fn-test-var-err-\${varIndex}\`;
                        return (
                        <div key={variable} className="flex flex-col gap-1">
                          <div className="flex items-start gap-3">
                            <span className="m-0 inline-flex shrink-0 items-center rounded-md bg-semantic-bg-ui px-2.5 py-1.5 text-sm font-mono text-semantic-text-secondary">
                              {variable}
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <input
                                type="text"
                                value={testVarValues[variable] ?? ""}
                                onChange={(e) =>
                                  setTestVarValues((prev) => ({
                                    ...prev,
                                    [variable]: e.target.value,
                                  }))
                                }
                                placeholder="Value"
                                className={cn(
                                  inputCls,
                                  "h-9 text-sm",
                                  isEmpty &&
                                    "border-semantic-error-primary focus:border-semantic-error-primary focus:shadow-none"
                                )}
                                aria-invalid={isEmpty}
                                aria-describedby={isEmpty ? testVarErrId : undefined}
                              />
                              {isEmpty && (
                                <p
                                  id={testVarErrId}
                                  className="m-0 flex items-center gap-1.5 text-xs text-semantic-error-primary"
                                >
                                  <span
                                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-semantic-error-primary text-[10px] font-bold leading-none text-semantic-text-inverted"
                                    aria-hidden
                                  >
                                    !
                                  </span>
                                  <span>Value is required for this key</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestApi}
                    disabled={isTesting || !url.trim()}
                    className="w-full h-[42px] rounded text-sm font-semibold text-semantic-text-secondary bg-semantic-primary-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-semantic-primary-surface/80 sm:w-auto sm:px-6 sm:self-end sm:ml-auto flex items-center justify-center"
                  >
                    {isTesting ? "Testing..." : "Test API"}
                  </button>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-semantic-text-muted">
                      Response from API
                    </span>
                    <textarea
                      readOnly
                      value={apiResponse}
                      rows={4}
                      className="w-full px-3 py-2.5 text-base rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary resize-none outline-none"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-solid border-semantic-border-layout shrink-0 sm:px-6 sm:py-4">
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
                  disabled={!disabled && !isStep1Valid}
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
                  type="button"
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Submit
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <VariableFormModal
        open={varModalOpen}
        onOpenChange={handleVarModalOpenChange}
        mode={varModalMode}
        initialData={varModalInitialData}
        onSave={handleVariableSave}
      />
      </>
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
  characterCount,
  children,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  /** e.g. { current: 0, max: 50 } to show "0/50" below right */
  characterCount?: { current: number; max: number };
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
      {(helperText || characterCount) && (
        <div className="flex items-center justify-between gap-2">
          {helperText ? (
            <div className="flex items-center gap-1.5 text-xs text-semantic-text-muted min-w-0">
              <Info className="size-3.5 shrink-0" />
              <p className="m-0">{helperText}</p>
            </div>
          ) : (
            <span />
          )}
          {characterCount != null && (
            <span className="text-sm text-semantic-text-muted shrink-0">
              {characterCount.current}/{characterCount.max}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const BOT_NAME_MAX_LENGTH = 50;
const PRIMARY_ROLE_MAX_LENGTH = 50;
const TONE_MAX_ITEMS = 5;
const TONE_MAX_LENGTH_PER_ITEM = 20;

function StyledInput({
  placeholder,
  value,
  onChange,
  disabled,
  maxLength,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange?.(maxLength != null ? v.slice(0, maxLength) : v);
      }}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={cn(
        "w-full h-[42px] px-4 text-base rounded border border-solid",
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

const BotIdentityCard = React.forwardRef(
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
    }: BotIdentityCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
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
              characterCount={{
                current: (data.botName ?? "").length,
                max: BOT_NAME_MAX_LENGTH,
              }}
            >
              <StyledInput
                placeholder="e.g., Rhea from CaratLane"
                value={data.botName}
                onChange={(v) => onChange({ botName: v })}
                disabled={disabled}
                maxLength={BOT_NAME_MAX_LENGTH}
              />
            </Field>

            <Field
              label="Primary Role"
              characterCount={{
                current: (data.primaryRole ?? "").length,
                max: PRIMARY_ROLE_MAX_LENGTH,
              }}
            >
              <CreatableSelect
                value={(data.primaryRole ?? "").slice(0, PRIMARY_ROLE_MAX_LENGTH)}
                onValueChange={(v) =>
                  onChange({ primaryRole: (v ?? "").slice(0, PRIMARY_ROLE_MAX_LENGTH) })
                }
                options={roleOptions}
                placeholder="e.g., Customer Support Agent"
                creatableHint="Type to create a custom role"
                disabled={disabled}
                maxLength={PRIMARY_ROLE_MAX_LENGTH}
              />
            </Field>

            <Field label="Tone">
              <CreatableMultiSelect
                value={(Array.isArray(data.tone) ? data.tone : []).slice(0, TONE_MAX_ITEMS)}
                onValueChange={(v) =>
                  onChange({ tone: (v ?? []).slice(0, TONE_MAX_ITEMS) })
                }
                options={toneOptions}
                placeholder="Enter or select tone"
                creatableHint='Press Enter to add "Conversational" ↵'
                disabled={disabled}
                maxItems={TONE_MAX_ITEMS}
                maxLengthPerItem={TONE_MAX_LENGTH_PER_ITEM}
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
import { Plus, Info } from "lucide-react";
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
  /**
   * Called when focus leaves the **entire** prompt section (textarea + session
   * variable chips). Clicking a chip or the instruction text does NOT trigger
   * this — only clicking outside the whole section does.
   *
   * Use this to persist the system prompt (e.g. fire an API call) once the
   * user is done editing, including any variables they just inserted.
   */
  onSystemPromptBlur?: (value: string) => void;
  /** Session variables shown as insertable chips and in the {{ autocomplete dropdown */
  sessionVariables?: string[];
  /** Maximum character length for the system prompt textarea (default: 5000, per Figma) */
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

// ─── Variable trigger helpers ─────────────────────────────────────────────────

interface TriggerState {
  query: string;
  from: number;
  to: number;
}

function detectVarTrigger(value: string, cursor: number): TriggerState | null {
  const before = value.slice(0, cursor);
  const match = /\\{\\{([^}]*)$/.exec(before);
  if (!match) return null;
  return { query: match[1].toLowerCase(), from: match.index, to: cursor };
}

function insertVar(value: string, variable: string, from: number, to: number): string {
  return value.slice(0, from) + variable + value.slice(to);
}

/**
 * Mirror-div technique: create an invisible clone of the element with identical
 * styles, fill it with text up to the cursor, place a zero-width marker span at
 * the end, and read the marker's position to get pixel-exact cursor coordinates.
 * Returns { top, left } relative to the element's own top-left corner.
 */
function getCaretPixelPos(
  el: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  const cs = window.getComputedStyle(el);
  const mirror = document.createElement("div");

  // Copy every style property that affects text layout
  (
    [
      "boxSizing", "width", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant",
      "letterSpacing", "lineHeight", "textTransform", "wordSpacing", "tabSize",
    ] as (keyof CSSStyleDeclaration)[]
  ).forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mirror.style as any)[prop] = cs[prop];
  });

  // textarea wraps; input does not
  mirror.style.whiteSpace = el.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
  mirror.style.wordWrap = el.tagName === "TEXTAREA" ? "break-word" : "normal";
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.overflow = "hidden";
  mirror.style.top = "0";
  mirror.style.left = "0";
  mirror.style.width = el.offsetWidth + "px";

  document.body.appendChild(mirror);
  mirror.appendChild(document.createTextNode(el.value.substring(0, position)));

  const marker = document.createElement("span");
  marker.textContent = "\\u200b"; // zero-width space
  mirror.appendChild(marker);

  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();
  document.body.removeChild(mirror);

  const scrollTop = el instanceof HTMLTextAreaElement ? el.scrollTop : 0;
  return {
    top: markerRect.top - mirrorRect.top - scrollTop,
    left: markerRect.left - mirrorRect.left,
  };
}

// Uses the same visual classes as DropdownMenuContent + DropdownMenuItem.
// Position is driven by cursor coordinates from getCaretPixelPos.
function VarPopup({
  variables,
  onSelect,
  style,
}: {
  variables: string[];
  onSelect: (v: string) => void;
  style?: React.CSSProperties;
}) {
  if (variables.length === 0) return null;
  return (
    <div
      role="listbox"
      style={style}
      className="absolute z-[9999] min-w-[8rem] max-w-xs overflow-hidden rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-md"
    >
      {variables.map((v) => (
        <button
          key={v}
          type="button"
          role="option"
          aria-selected={false}
          onMouseDown={(e) => {
            e.preventDefault(); // keep textarea focused so blur doesn't close popup first
            onSelect(v);
          }}
          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui"
        >
          {v}
        </button>
      ))}
    </div>
  );
}

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
        "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
        <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
          {title}
        </h2>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const BotBehaviorCard = React.forwardRef(
  (
    {
      data,
      onChange,
      onSystemPromptBlur,
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      maxLength = 5000,
      disabled,
      className,
    }: BotBehaviorCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const prompt = data.systemPrompt ?? "";
    const MAX = maxLength;
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    /** Tracks whether the section has been focused at least once (prevents firing blur on initial render). */
    const hasFocusedRef = React.useRef(false);

    const [varTrigger, setVarTrigger] = React.useState<TriggerState | null>(null);
    const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();

    const filteredVars = varTrigger
      ? sessionVariables.filter((v) =>
          v.toLowerCase().includes(varTrigger.query)
        )
      : [];

    /** Compute popup pixel position anchored to the cursor, clamped within the textarea. */
    const updatePopupPos = (el: HTMLTextAreaElement, cursor: number) => {
      const caret = getCaretPixelPos(el, cursor);
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
      const top = caret.top + lineHeight;
      // Clamp left so popup (max-w-xs = 320px) doesn't overflow the textarea width
      const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
      setPopupStyle({ top, left });
    };

    const clearTrigger = () => {
      setVarTrigger(null);
      setPopupStyle(undefined);
    };

    const insertVariable = (variable: string) => {
      onChange({ systemPrompt: prompt + variable });
    };

    const handleVarSelect = (variable: string) => {
      if (!varTrigger) return;
      const newVal = insertVar(prompt, variable, varTrigger.from, varTrigger.to);
      if (newVal.length <= MAX) onChange({ systemPrompt: newVal });
      clearTrigger();
      // Restore focus and place cursor after inserted variable
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          const pos = varTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
        }
      });
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (v.length <= MAX) {
        onChange({ systemPrompt: v });
        const trigger = detectVarTrigger(v, e.target.selectionStart);
        setVarTrigger(trigger);
        if (trigger) updatePopupPos(e.target, e.target.selectionStart);
        else setPopupStyle(undefined);
      }
    };

    const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape" && varTrigger) {
        e.preventDefault();
        clearTrigger();
      }
    };

    /**
     * Fires when focus enters the prompt section (textarea or any chip button).
     * We track this so the section-level blur only fires after the user has
     * actually interacted with the section.
     */
    const handleSectionFocus = () => {
      hasFocusedRef.current = true;
    };

    /**
     * Fires when focus leaves any element inside the prompt section.
     * We check \`relatedTarget\` — if the new focus target is still inside
     * this section, we do nothing. Only when focus moves fully outside
     * do we fire \`onSystemPromptBlur\` with the current prompt value.
     */
    const handleSectionBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      clearTrigger();
      if (!onSystemPromptBlur || !hasFocusedRef.current) return;
      const section = sectionRef.current;
      const next = e.relatedTarget as Node | null;
      // Focus moved to another element inside this section — ignore
      if (section && next && section.contains(next)) return;
      onSystemPromptBlur(prompt);
    };

    return (
      <div ref={ref} className={className}>
        <SectionCard title="How It Behaves">
          {/* onBlur is on this wrapper so clicking chips / instruction text
              does NOT fire the callback — only clicking outside fires it. */}
          <div
            ref={sectionRef}
            className="flex flex-col gap-3"
            onFocus={handleSectionFocus}
            onBlur={handleSectionBlur}
          >
            <p className="m-0 text-sm text-semantic-text-muted">
              Define workflows, conditions and handover logic (System prompt)
            </p>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                rows={6}
                onChange={handlePromptChange}
                onKeyDown={handlePromptKeyDown}
                placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
                disabled={disabled}
                className={cn(
                  "w-full px-4 py-2.5 text-base rounded border border-solid resize-none pb-10 pr-[4.5rem]",
                  "border-semantic-border-input bg-semantic-bg-primary",
                  "text-semantic-text-primary placeholder:text-semantic-text-muted",
                  "outline-none hover:border-semantic-border-input-focus",
                  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              />
              <span
                className="absolute bottom-3 right-4 text-sm text-semantic-text-muted pointer-events-none"
                aria-live="polite"
                aria-label={\`\${prompt.length} of \${MAX} characters\`}
              >
                {prompt.length}/{MAX}
              </span>
              <VarPopup variables={filteredVars} onSelect={handleVarSelect} style={popupStyle} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="m-0 flex items-center gap-1.5 text-sm text-semantic-text-muted">
                <Info className="size-4 shrink-0 text-semantic-text-muted" aria-hidden />
                Type {'{{'} to enable dropdown or use the below chips to input variables.
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
import type { KnowledgeBaseFile, KnowledgeFileStatus } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KnowledgeBaseCardProps {
  /** List of knowledge base files */
  files: KnowledgeBaseFile[];
  /** Called when user clicks the "+ Files" button */
  onAdd?: () => void;
  /**
   * Called when user clicks the download button on a file.
   * When omitted, the download button is **not rendered**.
   */
  onDownload?: (id: string) => void;
  /**
   * Called when user clicks the delete button on a file.
   * When omitted, the delete button is **not rendered**.
   */
  onDelete?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Knowledge Base" title */
  infoTooltip?: string;
  /** Disables the "+ Files" button and other form-level interactions (view mode) */
  disabled?: boolean;
  /** Independently disables the download button (e.g. user lacks download permission) */
  downloadDisabled?: boolean;
  /** Independently disables the delete button (e.g. user lacks delete permission) */
  deleteDisabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Status config ──────────────────────────────────────────────────────────

type BadgeVariant = "default" | "active" | "destructive";
const STATUS_CONFIG: Record<KnowledgeFileStatus, { label: string; variant: BadgeVariant }> = {
  [BOT_KNOWLEDGE_STATUS.PENDING]:    { label: "Pending",    variant: "default"      },
  [BOT_KNOWLEDGE_STATUS.READY]:      { label: "Ready",      variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.PROCESSING]: { label: "Processing", variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.FAILED]:     { label: "Failed",     variant: "destructive"  },
};

// ─── Component ──────────────────────────────────────────────────────────────

const KnowledgeBaseCard = React.forwardRef(
  (
    {
      files,
      onAdd,
      onDownload,
      onDelete,
      infoTooltip,
      disabled,
      downloadDisabled,
      deleteDisabled,
      className,
    }: KnowledgeBaseCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
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
                      {(onDownload || onDelete) && (
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {onDownload && (
                            <button
                              type="button"
                              onClick={() => onDownload(file.id)}
                              disabled={downloadDisabled}
                              className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", downloadDisabled && "opacity-50 cursor-not-allowed")}
                              aria-label="Download file"
                            >
                              <Download className="size-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(file.id)}
                              disabled={deleteDisabled}
                              className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", deleteDisabled && "opacity-50 cursor-not-allowed")}
                              aria-label="Delete file"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      )}
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
  /**
   * Called when user clicks the edit button on a custom function.
   * When omitted, the edit button is **not rendered**.
   */
  onEditFunction?: (id: string) => void;
  /**
   * Called when user clicks the delete button on a custom function.
   * When omitted, the delete button is **not rendered**.
   */
  onDeleteFunction?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Functions" title */
  infoTooltip?: string;
  /** Disables the "Add Functions" button and other form-level interactions (view mode) */
  disabled?: boolean;
  /** Independently disables the edit button (e.g. user lacks edit permission) */
  editDisabled?: boolean;
  /** Independently disables the delete button (e.g. user lacks delete permission) */
  deleteDisabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

const FunctionsCard = React.forwardRef(
  ({ functions, onAddFunction, onEditFunction, onDeleteFunction, infoTooltip, disabled, editDisabled, deleteDisabled, className }: FunctionsCardProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
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
                  className="flex items-center justify-between px-4 py-3 rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary"
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
                        {onEditFunction && (
                          <button
                            type="button"
                            onClick={() => onEditFunction(fn.id)}
                            disabled={editDisabled}
                            className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", editDisabled && "opacity-50 cursor-not-allowed")}
                            aria-label={\`Edit \${fn.name}\`}
                          >
                            <Pencil className="size-4" />
                          </button>
                        )}
                        {onDeleteFunction && (
                          <button
                            type="button"
                            onClick={() => onDeleteFunction(fn.id)}
                            disabled={deleteDisabled}
                            className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", deleteDisabled && "opacity-50 cursor-not-allowed")}
                            aria-label={\`Delete \${fn.name}\`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
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

const FrustrationHandoverCard = React.forwardRef(
  ({ data, onChange, departmentOptions = DEFAULT_DEPARTMENT_OPTIONS, disabled, className }: FrustrationHandoverCardProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="frustration">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
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
import {
  defaultAdvancedSettingsNumericBounds,
  type AdvancedSettingsNumericBounds,
} from "./advanced-settings-bounds";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdvancedSettingsData {
  silenceTimeout?: number;
  callEndThreshold?: number;
  interruptionHandling: boolean;
}

/** Payload when a numeric advanced field finishes a blur validation pass. */
export interface AdvancedSettingsNumericFieldBlurDetail {
  /** Value committed to form state (\`undefined\` if empty after blur). */
  value: number | undefined;
  /** \`false\` when the field shows a validation error after blur. */
  valid: boolean;
}

export interface AdvancedSettingsCardProps {
  /** Current form data */
  data: Partial<AdvancedSettingsData>;
  /** Callback when any field in this card changes */
  onChange: (patch: Partial<AdvancedSettingsData>) => void;
  /**
   * Shorthand min/max for both numeric fields. Overridden by explicit
   * \`silenceTimeoutMin\`, \`silenceTimeoutMax\`, \`callEndThresholdMin\`, or \`callEndThresholdMax\`
   * when those are passed.
   */
  numericBounds?: Partial<AdvancedSettingsNumericBounds>;
  /** Min value for silence timeout spinner */
  silenceTimeoutMin?: number;
  /** Max value for silence timeout spinner */
  silenceTimeoutMax?: number;
  /** Min value for call end threshold spinner */
  callEndThresholdMin?: number;
  /** Max value for call end threshold spinner */
  callEndThresholdMax?: number;
  /** When true, an empty value shows a validation error on blur (default: true) */
  silenceTimeoutRequired?: boolean;
  /** When true, an empty value shows a validation error on blur (default: true) */
  callEndThresholdRequired?: boolean;
  /** Fires after each successful \`onChange\` from this card (including stepper and switch). */
  onAdvancedSettingsChange?: (patch: Partial<AdvancedSettingsData>) => void;
  /** Fires when silence timeout input blurs after validation. */
  onSilenceTimeoutBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Fires when call end threshold input blurs after validation. */
  onCallEndThresholdBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function ValidatedNumberSpinner({
  id,
  value,
  onChange,
  min,
  max,
  required,
  disabled,
  onBlurCommit,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  required: boolean;
  disabled?: boolean;
  onBlurCommit?: (detail: AdvancedSettingsNumericFieldBlurDetail) => void;
}) {
  const [inputStr, setInputStr] = React.useState(() =>
    value === undefined ? "" : String(value)
  );
  const [error, setError] = React.useState<string | null>(null);
  const focusedRef = React.useRef(false);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (!focusedRef.current) {
        setInputStr(value === undefined ? "" : String(value));
        setError(null);
      }
    }
  }, [value]);

  const stepBase = (): number | null => {
    const t = inputStr.trim();
    if (t !== "") {
      const n = Number(t);
      if (Number.isFinite(n)) return n;
    }
    if (value !== undefined) return value;
    return null;
  };

  const canIncrement = (): boolean => {
    const b = stepBase();
    if (b === null) return true;
    return b < max;
  };

  const canDecrement = (): boolean => {
    const b = stepBase();
    if (b === null) return false;
    return b > min;
  };

  const applyStep = (delta: 1 | -1) => {
    let n = stepBase();
    if (n === null) {
      if (delta > 0) n = min - 1;
      else return;
    }
    const next = clamp(n + delta, min, max);
    setInputStr(String(next));
    setError(null);
    onChange(next);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    const trimmed = inputStr.trim();
    if (trimmed === "") {
      onChange(undefined);
      if (required) {
        setError("This field is required");
        onBlurCommit?.({ value: undefined, valid: false });
      } else {
        setError(null);
        onBlurCommit?.({ value: undefined, valid: true });
      }
      return;
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      setError("Enter a valid number");
      onBlurCommit?.({ value, valid: false });
      return;
    }
    if (num < min || num > max) {
      setError(\`Value must be between \${min} and \${max}\`);
      onBlurCommit?.({ value, valid: false });
      return;
    }
    setError(null);
    onChange(num);
    onBlurCommit?.({ value: num, valid: true });
  };

  const errorId = error ? \`\${id}-error\` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex w-full items-center gap-2.5 px-4 py-2.5 border border-solid bg-semantic-bg-primary rounded",
          error
            ? "border-semantic-error-primary"
            : "border-semantic-border-layout",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={inputStr}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onFocus={() => {
            focusedRef.current = true;
            setError(null);
          }}
          onBlur={handleBlur}
          onChange={(e) => setInputStr(e.target.value)}
          className="flex-1 min-w-0 text-base text-semantic-text-primary bg-transparent outline-none disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center shrink-0 gap-0.5">
          <button
            type="button"
            onClick={() => applyStep(1)}
            disabled={disabled || !canIncrement()}
            className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase"
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            onClick={() => applyStep(-1)}
            disabled={disabled || !canDecrement()}
            className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease"
          >
            <ChevronDown className="size-3" />
          </button>
        </div>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="m-0 text-xs text-semantic-error-primary"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function useCorrectOutOfRangeNumeric(
  raw: number | undefined,
  min: number,
  max: number,
  disabled: boolean | undefined,
  patchKey: "silenceTimeout" | "callEndThreshold",
  onChange: (patch: Partial<AdvancedSettingsData>) => void
) {
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    if (disabled || raw === undefined) return;
    if (raw < min || raw > max) {
      onChangeRef.current({
        [patchKey]: clamp(raw, min, max),
      } as Partial<AdvancedSettingsData>);
    }
  }, [raw, min, max, disabled, patchKey]);
}

// ─── Component ──────────────────────────────────────────────────────────────

const AdvancedSettingsCard = React.forwardRef(
  (
    {
      data,
      onChange,
      numericBounds,
      silenceTimeoutMin: silenceTimeoutMinProp,
      silenceTimeoutMax: silenceTimeoutMaxProp,
      callEndThresholdMin: callEndThresholdMinProp,
      callEndThresholdMax: callEndThresholdMaxProp,
      silenceTimeoutRequired = true,
      callEndThresholdRequired = true,
      onAdvancedSettingsChange,
      onSilenceTimeoutBlur,
      onCallEndThresholdBlur,
      disabled,
      className,
    }: AdvancedSettingsCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const silenceTimeoutMin =
      silenceTimeoutMinProp ??
      numericBounds?.silenceTimeoutMin ??
      defaultAdvancedSettingsNumericBounds.silenceTimeoutMin;
    const silenceTimeoutMax =
      silenceTimeoutMaxProp ??
      numericBounds?.silenceTimeoutMax ??
      defaultAdvancedSettingsNumericBounds.silenceTimeoutMax;
    const callEndThresholdMin =
      callEndThresholdMinProp ??
      numericBounds?.callEndThresholdMin ??
      defaultAdvancedSettingsNumericBounds.callEndThresholdMin;
    const callEndThresholdMax =
      callEndThresholdMaxProp ??
      numericBounds?.callEndThresholdMax ??
      defaultAdvancedSettingsNumericBounds.callEndThresholdMax;

    const emitPatch = React.useCallback(
      (patch: Partial<AdvancedSettingsData>) => {
        onChange(patch);
        onAdvancedSettingsChange?.(patch);
      },
      [onChange, onAdvancedSettingsChange]
    );

    useCorrectOutOfRangeNumeric(
      data.silenceTimeout,
      silenceTimeoutMin,
      silenceTimeoutMax,
      disabled,
      "silenceTimeout",
      emitPatch
    );
    useCorrectOutOfRangeNumeric(
      data.callEndThreshold,
      callEndThresholdMin,
      callEndThresholdMax,
      disabled,
      "callEndThreshold",
      emitPatch
    );

    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="advanced">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="text-base font-semibold text-semantic-text-primary">
                Advanced Settings
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {/* Number fields section */}
                <div className="px-4 pt-4 pb-4 flex flex-col gap-5 border-b border-solid border-semantic-border-layout sm:px-6 sm:pt-5 sm:pb-6">
                  <Field label="Silence Timeout (seconds)">
                    <ValidatedNumberSpinner
                      id="advanced-silence-timeout"
                      value={data.silenceTimeout}
                      onChange={(v) => emitPatch({ silenceTimeout: v })}
                      min={silenceTimeoutMin}
                      max={silenceTimeoutMax}
                      required={silenceTimeoutRequired}
                      disabled={disabled}
                      onBlurCommit={onSilenceTimeoutBlur}
                    />
                  </Field>

                  <Field label="Call End Threshold">
                    <ValidatedNumberSpinner
                      id="advanced-call-end-threshold"
                      value={data.callEndThreshold}
                      onChange={(v) => emitPatch({ callEndThreshold: v })}
                      min={callEndThresholdMin}
                      max={callEndThresholdMax}
                      required={callEndThresholdRequired}
                      disabled={disabled}
                      onBlurCommit={onCallEndThresholdBlur}
                    />
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Drop call after n consecutive silences.
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
                      emitPatch({ interruptionHandling: v })
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
          "w-full resize-none rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted outline-none transition-all",
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

const FallbackPromptsCard = React.forwardRef(
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
    }: FallbackPromptsCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion
          type="single"
          defaultValue={defaultOpen ? ["fallback"] : []}
        >
          <AccordionItem value="fallback">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
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
import type { AdvancedSettingsNumericBounds } from "./advanced-settings-bounds";
import type {
  AdvancedSettingsData,
  AdvancedSettingsNumericFieldBlurDetail,
} from "./advanced-settings-card";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type FunctionTabType = "header" | "queryParams" | "body";

export const BOT_KNOWLEDGE_STATUS = {
  PENDING: "pending",
  READY: "ready",
  PROCESSING: "processing",
  FAILED: "failed",
} as const;

export type KnowledgeFileStatus = typeof BOT_KNOWLEDGE_STATUS[keyof typeof BOT_KNOWLEDGE_STATUS];

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

/** A single variable shown in the {{ autocomplete popup */
export interface VariableItem {
  /** Display name (e.g., "Order_id") */
  name: string;
  /** Value inserted into the input. Defaults to \`{{name}}\` if omitted */
  value?: string;
  /** When true, an edit icon is shown next to this variable */
  editable?: boolean;
  /** Description of what this variable represents */
  description?: string;
  /** Whether this variable is required */
  required?: boolean;
}

/** Data shape for creating or editing a variable */
export interface VariableFormData {
  name: string;
  description?: string;
  required?: boolean;
}

/** A labelled group of variables in the autocomplete popup */
export interface VariableGroup {
  /** Group header text (e.g., "Function variables", "Session variables") */
  label: string;
  /** Variables in this group */
  items: VariableItem[];
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

/**
 * Test values for "Test Your API": keys are full placeholders as in the form
 * (e.g. \`"{{Caller number}}"\`), values are the strings the user entered.
 */
export type CreateFunctionTestValues = Record<string, string>;

export interface CreateFunctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateFunctionData) => void;
  onTestApi?: (
    step2: CreateFunctionStep2Data,
    testValues?: CreateFunctionTestValues
  ) => Promise<string>;
  /** Pre-fills all fields — use when opening the modal to edit an existing function */
  initialData?: Partial<CreateFunctionData>;
  /** When true, changes the modal title to "Edit Function" */
  isEditing?: boolean;
  /** Minimum character length for the prompt field (default: 100) */
  promptMinLength?: number;
  /** Maximum character length for the prompt field (default: 1000) */
  promptMaxLength?: number;
  /** Storybook/testing: start at a specific step (1 or 2) */
  initialStep?: 1 | 2;
  /** Storybook/testing: start on a specific tab when initialStep=2 */
  initialTab?: FunctionTabType;
  /** Session variables available for {{ autocomplete in URL, body, header values, and query param values */
  sessionVariables?: string[];
  /**
   * Grouped variables for the {{ autocomplete popup (overrides flat list display when provided).
   * Items with \`required: true\` are validated when the user clicks Test API (inline errors under each empty field).
   */
  variableGroups?: VariableGroup[];
  /**
   * Called when user saves a new variable from the autocomplete popup.
   * The modal replaces the open \`{{…\` fragment in the focused field with \`{{name}}\`.
   * When using \`variableGroups\`, merge the new item into the matching group in your state
   * so it appears in the dropdown on the next open.
   */
  onAddVariable?: (data: VariableFormData) => void;
  /**
   * Called when the user saves "Edit variable". The modal already renames
   * \`{{function.name}}\` / \`{{name}}\` across URL, body, headers, query params, and test values.
   * Update your \`variableGroups\` (and persist to your backend) using \`originalName\` → \`data.name\`.
   */
  onEditVariable?: (originalName: string, data: VariableFormData) => void;
  /** When true, all form fields are disabled (view mode) but Next is enabled so user can browse steps */
  disabled?: boolean;
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
  /** Undefined when the field was cleared; validate before save/publish. */
  silenceTimeout?: number;
  /** Undefined when the field was cleared; validate before save/publish. */
  callEndThreshold?: number;
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
  /** Called when user downloads a knowledge file. When omitted, download button is hidden. */
  onDownloadKnowledgeFile?: (fileId: string) => void;
  /** Called when user deletes a knowledge file. When omitted, delete button is hidden. */
  onDeleteKnowledgeFile?: (fileId: string) => void;
  /** Independently disables the knowledge file download button */
  knowledgeDownloadDisabled?: boolean;
  /** Independently disables the knowledge file delete button */
  knowledgeDeleteDisabled?: boolean;
  onCreateFunction?: (data: CreateFunctionData) => void;
  /** Called when user edits a custom function. When omitted, edit button is hidden. */
  onEditFunction?: (id: string) => void;
  /** Called when user deletes a custom function. When omitted, delete button is hidden. */
  onDeleteFunction?: (id: string) => void;
  /** Independently disables the function edit button */
  functionEditDisabled?: boolean;
  /** Independently disables the function delete button */
  functionDeleteDisabled?: boolean;
  onTestApi?: (
    step2: CreateFunctionStep2Data,
    testValues?: CreateFunctionTestValues
  ) => Promise<string>;
  /** Hover text for the info icon in the Functions card header */
  functionsInfoTooltip?: string;
  /** Hover text for the info icon in the Knowledge Base card header */
  knowledgeBaseInfoTooltip?: string;
  /** Minimum character length for the function prompt (default: 100) */
  functionPromptMinLength?: number;
  /** Maximum character length for the function prompt (default: 1000) */
  functionPromptMaxLength?: number;
  /**
   * Pre-filled data shown when the edit function modal opens.
   * Pass when your app fetches full function data after onEditFunction fires.
   */
  functionEditData?: Partial<CreateFunctionData>;
  /** Max character length for the "How It Behaves" system prompt (default: 5000, per Figma) */
  systemPromptMaxLength?: number;
  /**
   * Called when focus leaves the **entire** "How It Behaves" section
   * (textarea + session variable chips). Clicking a chip does NOT trigger
   * this — only clicking outside the whole section does.
   * Use this to persist the system prompt via an API call.
   */
  onSystemPromptBlur?: (value: string) => void;
  /** Called when the Agent Busy Prompt textarea loses focus */
  onAgentBusyPromptBlur?: (value: string) => void;
  /** Called when the No Extension Found textarea loses focus */
  onNoExtensionFoundPromptBlur?: (value: string) => void;
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
  /**
   * Function-scoped variables for Create / Edit Function modal (\`{{\` autocomplete; \`required\` applies to Test API validation only).
   * Pass the same groups your app persists; items with \`required: true\` block Test API until test values are filled for placeholders used in the request.
   */
  functionVariableGroups?: VariableGroup[];
  /** When set with \`functionVariableGroups\`, called after the user saves a new variable from the modal. */
  onAddFunctionVariable?: (data: VariableFormData) => void;
  /** When set with \`functionVariableGroups\`, called after the user saves an edited variable. */
  onEditFunctionVariable?: (originalName: string, data: VariableFormData) => void;
  /** Override escalation department options for FrustrationHandoverCard */
  escalationDepartmentOptions?: SelectOption[];
  /**
   * Shorthand min/max for Advanced Settings numeric fields. Individual
   * \`silenceTimeoutMin\` / \`silenceTimeoutMax\` / \`callEndThresholdMin\` / \`callEndThresholdMax\`
   * override corresponding entries when set.
   */
  advancedSettingsNumericBounds?: Partial<AdvancedSettingsNumericBounds>;
  /** Override silence timeout min (after \`advancedSettingsNumericBounds\`) */
  silenceTimeoutMin?: number;
  /** Override silence timeout max (after \`advancedSettingsNumericBounds\`) */
  silenceTimeoutMax?: number;
  /** Override call end threshold min (after \`advancedSettingsNumericBounds\`) */
  callEndThresholdMin?: number;
  /** Override call end threshold max (after \`advancedSettingsNumericBounds\`) */
  callEndThresholdMax?: number;
  /**
   * Fires when any Advanced Settings field changes (numeric commit, stepper, interruption toggle).
   */
  onAdvancedSettingsChange?: (patch: Partial<AdvancedSettingsData>) => void;
  /** Fires when silence timeout blurs after validation (see \`AdvancedSettingsNumericFieldBlurDetail\`). */
  onSilenceTimeoutBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Fires when call end threshold blurs after validation. */
  onCallEndThresholdBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  className?: string;
}

export type { AdvancedSettingsNumericBounds } from "./advanced-settings-bounds";
export type { AdvancedSettingsNumericFieldBlurDetail } from "./advanced-settings-card";

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
export {
  defaultAdvancedSettingsNumericBounds,
  type AdvancedSettingsNumericBounds,
  type DefaultAdvancedSettingsNumericBounds,
} from "./advanced-settings-bounds";
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
  CreateFunctionTestValues,
  CreateFunctionStep1Data,
  CreateFunctionStep2Data,
  FunctionItem,
  KnowledgeBaseFile,
  KnowledgeFileStatus,
  KeyValuePair,
  HttpMethod,
  FunctionTabType,
  SelectOption,
  VariableItem,
  VariableGroup,
  VariableFormData,
  AdvancedSettingsNumericBounds,
  AdvancedSettingsNumericFieldBlurDetail,
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
export const WalletTopup = React.forwardRef(
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
    }: WalletTopupProps,
    ref: React.Ref<HTMLDivElement>
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
              <div className="flex flex-col gap-6 border-t border-solid border-semantic-border-layout pt-4">
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
                              ? "border border-solid border-[var(--semantic-brand)] shadow-sm"
                              : "border border-solid border-semantic-border-input hover:border-semantic-text-muted"
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
                  <div className="flex flex-col gap-2 rounded-lg bg-semantic-info-surface-subtle border border-solid border-semantic-info-surface px-4 py-3">
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
    },
    "chat-types": {
      name: "chat-types",
      description: "Shared TypeScript interfaces for the chat template",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [],
      isMultiFile: true,
      directory: "chat-types",
      group: "chat",
      templateOnly: true,
      mainFile: "types.ts",
      files: [
        {
          name: "types.ts",
          content: prefixTailwindClasses(`export type Tab = "open" | "assigned" | "resolved"

export type TabDef = { id: Tab; label: string; count: number }

export type AssigneeItem = {
  id: string
  label: string
  type: "all" | "unassigned" | "bot" | "agent"
}

export type ChannelItem = {
  id: string
  name: string
  phone: string
  badge: string
}

export type ChatItem = {
  id: string
  tab: Tab
  name: string
  message: string
  timestamp: string
  messageStatus?: "sent" | "delivered" | "read"
  messageType?: "document" | "image" | "video" | "audio" | "text"
  channel: string
  agentName?: string
  unreadCount?: number
  slaTimer?: string
  isBot?: boolean
  isAgentDeleted?: boolean
  isWindowExpired?: boolean
  isFailed?: boolean
}

export type TemplateCategory = "all" | "marketing" | "utility" | "authentication"
export type TemplateType = "text" | "image" | "carousel"

export type TemplateCardDef = {
  cardIndex: number
  bodyVariables: string[]
  buttonVariables: string[]
}

export type TemplateDef = {
  id: string
  name: string
  category: "marketing" | "utility" | "authentication"
  type: TemplateType
  body: string
  footer?: string
  button?: string
  bodyVariables: string[]
  cards?: TemplateCardDef[]
  cardImages?: string[]
}

export type VarMap = Record<string, string>
export type CardVarMap = Record<number, { body: VarMap; button: VarMap }>

export type MediaPayload = {
  url: string
  thumbnailUrl?: string
  filename?: string
  fileType?: string
  fileSize?: string
  pageCount?: number
  duration?: string
  caption?: string
  images?: Array<{
    url: string
    title: string
    buttons?: Array<{ label: string; icon?: string }>
  }>
}

export type SentByType = "agent" | "bot" | "campaign" | "api"

export type ChatMessage = {
  id: string
  text: string
  time: string
  sender: "customer" | "agent"
  senderName?: string
  type?:
    | "text"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "docPreview"
    | "carousel"
    | "otherDoc"
    | "loading"
    | "system"
  status?: "sent" | "delivered" | "read" | "failed"
  replyTo?: { sender: string; text: string; messageId?: string }
  media?: MediaPayload
  error?: string
  sentBy?: { type: SentByType; name?: string }
}

export type Contact = {
  id: string
  name: string
  phone: string
  channel?: string
}

export type ContactDetails = {
  name: string
  phone: string
  email?: string
  source?: string
  marketingOptIn?: boolean
  tags?: string[]
  location?: string
  secondaryPhone?: string
  dob?: string
}

export type CannedMessage = {
  id: string
  shortcut: string
  body: string
}

export type ChatFilters = {
  assignees?: Set<string>
  channels?: Set<string>
}

export type TemplateSendPayload = {
  templateId: string
  variables: VarMap
  cardVariables?: CardVarMap
}

export type SendMessagePayload = {
  text: string
  attachment?: File
  replyToMessageId?: string
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export * from "./types"
`, prefix),
        }
      ],
    },
    "chat-transport": {
      name: "chat-transport",
      description: "ChatTransport interface and MockTransport with realistic fake data",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "chat-types"
      ],
      isMultiFile: true,
      directory: "chat-transport",
      group: "chat",
      templateOnly: true,
      mainFile: "mock-transport.ts",
      files: [
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import type {
  Tab,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  AssigneeItem,
  ChannelItem,
  TabDef,
  CannedMessage,
} from "../chat-types"

export interface ChatTransport {
  /** Fetch the list of tabs with counts */
  fetchTabs(): Promise<TabDef[]>

  /** Fetch assignees for filter panel */
  fetchAssignees(): Promise<AssigneeItem[]>

  /** Fetch channels */
  fetchChannels(): Promise<ChannelItem[]>

  /** Fetch chat list for a given tab, optionally filtered */
  fetchChats(params: { tab: Tab; search?: string; filters?: ChatFilters }): Promise<ChatItem[]>

  /** Fetch messages for a specific chat */
  fetchMessages(chatId: string): Promise<ChatMessage[]>

  /** Send a text/attachment message */
  sendMessage(chatId: string, payload: SendMessagePayload): Promise<ChatMessage>

  /** Send a template message */
  sendTemplate(chatId: string, payload: TemplateSendPayload): Promise<void>

  /** Assign a chat to an agent */
  assignChat(chatId: string, agentId: string): Promise<void>

  /** Resolve/close a chat */
  resolveChat(chatId: string): Promise<void>

  /** Fetch contacts for new chat panel */
  fetchContacts(query?: string): Promise<Contact[]>

  /** Create a new contact */
  createContact(contact: { name: string; phone: string; channel: string }): Promise<Contact>

  /** Fetch templates, optionally filtered by category */
  fetchTemplates(category?: TemplateCategory): Promise<TemplateDef[]>

  /** Fetch contact details for the details panel */
  fetchContactDetails(chatId: string): Promise<ContactDetails>

  /** Update contact details */
  updateContactDetails(chatId: string, data: Partial<ContactDetails>): Promise<void>

  /** Fetch canned/quick reply messages */
  fetchCannedMessages(): Promise<CannedMessage[]>

  /** Subscribe to new messages (real-time). Returns unsubscribe function. */
  onNewMessage?(callback: (chatId: string, message: ChatMessage) => void): () => void
}
`, prefix),
        },
        {
          name: "mock-transport.ts",
          content: prefixTailwindClasses(`import type {
  Tab,
  TabDef,
  AssigneeItem,
  ChannelItem,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  CannedMessage,
} from "../chat-types"
import type { ChatTransport } from "./types"

/* ── Mock Data ── */

const tabs: TabDef[] = [
  { id: "open", label: "Open", count: 10 },
  { id: "assigned", label: "Assigned", count: 2 },
  { id: "resolved", label: "Resolved", count: 5 },
]

const assignees: AssigneeItem[] = [
  { id: "all", label: "All", type: "all" },
  { id: "unassigned", label: "Unassigned", type: "unassigned" },
  { id: "ivr-voice-bot", label: "IVR voice bot", type: "bot" },
  { id: "whatsapp-bot", label: "WhatsApp bot", type: "bot" },
  { id: "support-bot", label: "Support bot", type: "bot" },
  { id: "alex-smith", label: "Alex Smith", type: "agent" },
  { id: "jane-doe", label: "Jane Doe", type: "agent" },
  { id: "sam-lee", label: "Sam Lee", type: "agent" },
  { id: "priya-sharma", label: "Priya Sharma", type: "agent" },
  { id: "rahul-verma", label: "Rahul Verma", type: "agent" },
  { id: "neha-gupta", label: "Neha Gupta", type: "agent" },
  { id: "vikram-singh", label: "Vikram Singh", type: "agent" },
  { id: "anita-desai", label: "Anita Desai", type: "agent" },
  { id: "mohit-kumar", label: "Mohit Kumar", type: "agent" },
  { id: "deepika-patel", label: "Deepika Patel", type: "agent" },
  { id: "arjun-reddy", label: "Arjun Reddy", type: "agent" },
  { id: "kavita-nair", label: "Kavita Nair", type: "agent" },
]

const channels: ChannelItem[] = [
  { id: "my01", name: "MyOperator Sales", phone: "+91 9212992129", badge: "MY01" },
  { id: "my02", name: "MyOperator", phone: "+91 8069200945", badge: "MY02" },
  { id: "my03", name: "MyOperator", phone: "+91 9319358395", badge: "MY03" },
  { id: "my04", name: "MyOperator Support", phone: "+91 9876543210", badge: "MY04" },
  { id: "my05", name: "MyOperator Billing", phone: "+91 8765432109", badge: "MY05" },
  { id: "my06", name: "Partner Channel", phone: "+91 7654321098", badge: "MY06" },
  { id: "my07", name: "Enterprise Sales", phone: "+91 6543210987", badge: "MY07" },
  { id: "my08", name: "APAC Support", phone: "+91 5432109876", badge: "MY08" },
]

const chatItems: ChatItem[] = [
  {
    id: "1",
    tab: "open",
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    messageStatus: "sent",
    messageType: "document",
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "2",
    tab: "open",
    name: "+91 98765 43210",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "read",
    channel: "MY01",
  },
  {
    id: "3",
    tab: "open",
    name: "Arsh Raj",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    channel: "MY01",
    isFailed: true,
  },
  {
    id: "4",
    tab: "open",
    name: "Nitin Rajput",
    message: "I am super excited",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
    agentName: "IVR voice bot",
    isBot: true,
  },
  {
    id: "5",
    tab: "open",
    name: "Sushmit",
    message: "Hi",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
  },
  {
    id: "6",
    tab: "open",
    name: "Rohit Gupta",
    message: "We get many food delivery orders. Can we...",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "50m",
    channel: "MY01",
    agentName: "Deleted User",
    isAgentDeleted: true,
  },
  {
    id: "7",
    tab: "open",
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 1,
    channel: "MY01",
    isWindowExpired: true,
  },
  {
    id: "8",
    tab: "assigned",
    name: "Priya Sharma",
    message: "When will my order be delivered?",
    timestamp: "1:15 PM",
    messageStatus: "sent",
    channel: "MY02",
    agentName: "Jane Doe",
  },
  {
    id: "9",
    tab: "assigned",
    name: "Vikram Singh",
    message: "Please share the invoice",
    timestamp: "12:40 PM",
    messageStatus: "delivered",
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "10",
    tab: "resolved",
    name: "Deepika Patel",
    message: "Thank you for your help!",
    timestamp: "Monday",
    messageStatus: "read",
    channel: "MY01",
    agentName: "Sam Lee",
  },
  {
    id: "11",
    tab: "resolved",
    name: "Mohit Kumar",
    message: "Issue resolved, thanks.",
    timestamp: "Sunday",
    messageStatus: "read",
    channel: "MY03",
    agentName: "Priya Sharma",
  },
  {
    id: "12",
    tab: "resolved",
    name: "Anita Desai",
    message: "Got it, will proceed.",
    timestamp: "Saturday",
    messageStatus: "read",
    channel: "MY02",
  },
]

const templateList: TemplateDef[] = [
  {
    id: "book-free-demo",
    name: "Book Free Demo",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! Book a free demo of our platform today and discover how MyOperator can transform your business.",
    bodyVariables: ["{{name}}"],
  },
  {
    id: "enterprise-plan",
    name: "Enterprise Plan",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! We have a special enterprise plan tailored for {{company}}. Get in touch today.",
    bodyVariables: ["{{name}}", "{{company}}"],
  },
  {
    id: "suv-plan",
    name: "SUV Plan",
    category: "utility",
    type: "image",
    body: "Hi {{name}}! Have a look at this document.",
    bodyVariables: ["{{name}}"],
    button: "Interested",
  },
  {
    id: "carousel",
    name: "Shopify Order Update",
    category: "marketing",
    type: "carousel",
    body: "Hi {{customer_name}}! Your order {{order_id}} has been confirmed.",
    footer: "MyOperator — Order Notifications",
    bodyVariables: ["{{customer_name}}", "{{order_id}}"],
    cardImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=200&fit=crop",
    ],
    cards: [
      {
        cardIndex: 1,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 2,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 3,
        bodyVariables: ["{{product_name}}", "{{quantity}}"],
        buttonVariables: [],
      },
    ],
  },
  {
    id: "option-5",
    name: "Option 5",
    category: "authentication",
    type: "text",
    body: "Your verification code is {{code}}. This code is valid for 10 minutes. Do not share it with anyone.",
    bodyVariables: ["{{code}}"],
  },
]

const chatMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", text: "Hi, I need help with my account settings", time: "2:15 PM", sender: "customer" },
    { id: "m1b", text: "Assigned to **Alex Smith** by **Alex Smith**", time: "", sender: "agent", type: "system" },
    {
      id: "m2",
      text: "Sure, I'd be happy to help!",
      time: "2:16 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "read",
      sentBy: { type: "agent", name: "Alex Smith" },
      replyTo: { sender: "Aditi Kumar", text: "Hi, I need help with my account settings", messageId: "m1" },
    },
    {
      id: "m3",
      text: "",
      time: "2:18 PM",
      sender: "customer",
      type: "image",
      media: {
        url: "https://picsum.photos/seed/chat1/683/546",
        caption: "Here is a screenshot of the issue I'm facing",
      },
    },
    { id: "m4", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    {
      id: "m5",
      text: "",
      time: "2:21 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "audio",
      media: { url: "#", duration: "1:35" },
    },
    {
      id: "m6",
      text: "",
      time: "2:23 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "video",
      media: {
        url: "https://picsum.photos/seed/vid1/683/400",
        thumbnailUrl: "https://picsum.photos/seed/vid1/683/400",
        duration: "3:45",
        caption: "WhatsApp API Setup Tutorial",
      },
    },
    {
      id: "m7",
      text: "Have a look at this document",
      time: "2:30 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "failed",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "docPreview",
      media: {
        url: "https://picsum.photos/seed/doc1/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc1/442/308",
        filename: "Introduction to Live Chat.pdf",
        fileType: "PDF",
        pageCount: 46,
        fileSize: "5MB",
      },
    },
    {
      id: "m8",
      text: "",
      time: "2:27 PM",
      sender: "customer",
      type: "document",
      media: {
        url: "https://picsum.photos/seed/doc2/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc2/442/308",
        filename: "Monthly_Report_Feb.pdf",
        fileType: "PDF",
        pageCount: 12,
        fileSize: "3.1MB",
      },
    },
    {
      id: "m9",
      text: "Have a look at this document",
      time: "2:28 PM",
      sender: "customer",
      type: "otherDoc",
      media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 46, fileSize: "2.3MB" },
    },
    {
      id: "m10",
      text: "Check out our latest products!",
      time: "2:29 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "campaign" },
      type: "carousel",
      media: {
        url: "#",
        images: [
          {
            url: "https://picsum.photos/seed/c1/300/240",
            title: "Product Catalog 2025",
            buttons: [
              { label: "View Details", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
          {
            url: "https://picsum.photos/seed/c2/300/240",
            title: "New Arrivals Collection",
            buttons: [{ label: "Shop Now", icon: "link" }],
          },
          {
            url: "https://picsum.photos/seed/c3/300/240",
            title: "Special Offers & Deals",
            buttons: [
              { label: "Learn More", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
        ],
      },
    },
    {
      id: "m11",
      text: "",
      time: "2:30 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "sent",
      sentBy: { type: "campaign" },
      type: "loading",
      error: "Template message could not be delivered. The message template has been rejected.",
    },
  ],
  "2": [
    { id: "m1", text: "Hello, I'd like to know about your enterprise plans", time: "2:10 PM", sender: "customer" },
    {
      id: "m2",
      text: "Welcome! I'll share our enterprise pricing details with you.",
      time: "2:15 PM",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Kavita Nair" },
    },
    { id: "m3", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    {
      id: "m4",
      text: "",
      time: "2:22 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Kavita Nair" },
      type: "audio",
      media: { url: "#", duration: "1:35" },
    },
    {
      id: "m5",
      text: "Authentication message sent",
      time: "2:29 PM",
      sender: "agent",
      status: "read",
      sentBy: { type: "api" },
    },
  ],
  "3": [
    { id: "m1", text: "Can you help me set up the API integration?", time: "1:45 PM", sender: "customer" },
    {
      id: "m2",
      text: "Of course! Here's a quick video tutorial.",
      time: "1:50 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "bot" },
    },
    {
      id: "m3",
      text: "",
      time: "1:52 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "bot" },
      type: "video",
      media: {
        url: "https://picsum.photos/seed/vid1/683/400",
        thumbnailUrl: "https://picsum.photos/seed/vid1/683/400",
        duration: "3:45",
        caption: "WhatsApp API Setup Tutorial",
      },
    },
    { id: "m4", text: "The WhatsApp Business API", time: "2:00 PM", sender: "customer" },
    {
      id: "m5",
      text: "Authentication message sent",
      time: "2:29 PM",
      sender: "agent",
      status: "failed",
      sentBy: { type: "api" },
    },
  ],
  "4": [
    { id: "m1", text: "I am super excited", time: "Yesterday", sender: "customer" },
    {
      id: "m2",
      text: "",
      time: "Yesterday",
      sender: "customer",
      type: "carousel",
      media: {
        url: "#",
        images: [
          {
            url: "https://picsum.photos/seed/c1/300/240",
            title: "Product Catalog 2025",
            buttons: [
              { label: "View Details", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
          {
            url: "https://picsum.photos/seed/c2/300/240",
            title: "New Arrivals Collection",
            buttons: [{ label: "Shop Now", icon: "link" }],
          },
          {
            url: "https://picsum.photos/seed/c3/300/240",
            title: "Special Offers & Deals",
            buttons: [
              { label: "Learn More", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
        ],
      },
    },
  ],
  "5": [
    { id: "m1", text: "Hi, can you share the proposal?", time: "Yesterday", sender: "customer" },
    {
      id: "m2",
      text: "Sure, here's the PDF.",
      time: "Yesterday",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Jane Doe" },
    },
    {
      id: "m3",
      text: "",
      time: "Yesterday",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Jane Doe" },
      type: "docPreview",
      media: {
        url: "https://picsum.photos/seed/doc1/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc1/442/308",
        filename: "Project_Proposal_2025.pdf",
        fileType: "PDF",
        pageCount: 46,
        fileSize: "5MB",
      },
    },
  ],
  "6": [
    {
      id: "m1",
      text: "We get many food delivery orders. Can we set up an automated response for those?",
      time: "Yesterday",
      sender: "customer",
    },
    {
      id: "m2",
      text: "Here's the order data from last quarter",
      time: "Yesterday",
      sender: "customer",
      type: "otherDoc",
      media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 12, fileSize: "2.3MB" },
    },
    {
      id: "m3",
      text: "",
      time: "Yesterday",
      sender: "agent",
      status: "sent",
      sentBy: { type: "campaign" },
      type: "loading",
      error: "Template message could not be delivered. The message template has been rejected.",
    },
  ],
  "7": [
    { id: "m1", text: "I am super excited!", time: "Saturday", sender: "customer" },
    {
      id: "m2",
      text: "Here's the report you requested!",
      time: "Saturday",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
    },
    {
      id: "m3",
      text: "",
      time: "Saturday",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "document",
      media: {
        url: "https://picsum.photos/seed/doc2/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc2/442/308",
        filename: "Monthly_Report_Feb.pdf",
        fileType: "PDF",
        pageCount: 12,
        fileSize: "3.1MB",
      },
    },
  ],
}

const contacts: Contact[] = [
  { id: "c1", name: "Aditi Kumar", phone: "+91 98765 43210", channel: "MY01" },
  { id: "c2", name: "Arsh Raj", phone: "+91 91234 56789", channel: "MY01" },
  { id: "c3", name: "Deepika Patel", phone: "+91 87654 32109", channel: "MY01" },
  { id: "c4", name: "Jane Doe", phone: "+91 76543 21098", channel: "MY02" },
  { id: "c5", name: "Kavita Nair", phone: "+91 65432 10987", channel: "MY03" },
  { id: "c6", name: "Mohit Kumar", phone: "+91 99887 76655", channel: "MY01" },
  { id: "c7", name: "Neha Gupta", phone: "+91 88776 65544", channel: "MY02" },
  { id: "c8", name: "Nitin Rajput", phone: "+91 77665 54433", channel: "MY01" },
  { id: "c9", name: "Priya Sharma", phone: "+91 66554 43322", channel: "MY03" },
  { id: "c10", name: "Rahul Verma", phone: "+91 55443 32211", channel: "MY01" },
  { id: "c11", name: "Rohit Gupta", phone: "+91 44332 21100", channel: "MY02" },
  { id: "c12", name: "Sam Lee", phone: "+91 93300 11122", channel: "MY01" },
  { id: "c13", name: "Sushmit", phone: "+91 92200 33344", channel: "MY03" },
  { id: "c14", name: "Sushant Arya", phone: "+91 91100 55566", channel: "MY01" },
  { id: "c15", name: "Vikram Singh", phone: "+91 90000 77788", channel: "MY02" },
]

const cannedMessages: CannedMessage[] = [
  { id: "1", shortcut: "Test", body: "Test" },
  { id: "2", shortcut: "Greeting", body: "Hi, how can I help you today?" },
]

/* ── Helper ── */

const delay = () => new Promise<void>((r) => setTimeout(r, 100))

let messageCounter = 1000

/* ── MockTransport ── */

export class MockTransport implements ChatTransport {
  async fetchTabs(): Promise<TabDef[]> {
    await delay()
    return [...tabs]
  }

  async fetchAssignees(): Promise<AssigneeItem[]> {
    await delay()
    return [...assignees]
  }

  async fetchChannels(): Promise<ChannelItem[]> {
    await delay()
    return [...channels]
  }

  async fetchChats(params: {
    tab: Tab
    search?: string
    filters?: ChatFilters
  }): Promise<ChatItem[]> {
    await delay()
    let items = chatItems.filter((c) => c.tab === params.tab)

    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter(
        (c) => c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q),
      )
    }

    if (params.filters?.assignees && params.filters.assignees.size > 0) {
      items = items.filter((c) => {
        if (!c.agentName) return params.filters!.assignees!.has("unassigned")
        return params.filters!.assignees!.has(
          c.agentName.toLowerCase().replace(/\\s+/g, "-"),
        )
      })
    }

    if (params.filters?.channels && params.filters.channels.size > 0) {
      items = items.filter((c) =>
        params.filters!.channels!.has(c.channel.toLowerCase()),
      )
    }

    return items
  }

  async fetchMessages(chatId: string): Promise<ChatMessage[]> {
    await delay()
    return [...(chatMessages[chatId] || [])]
  }

  async sendMessage(
    chatId: string,
    payload: SendMessagePayload,
  ): Promise<ChatMessage> {
    await delay()
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    const h12 = hours % 12 || 12
    const timeStr = \`\${h12}:\${minutes} \${ampm}\`

    const msg: ChatMessage = {
      id: \`m-sent-\${++messageCounter}\`,
      text: payload.text,
      time: timeStr,
      sender: "agent",
      senderName: "You",
      status: "sent",
      sentBy: { type: "agent", name: "You" },
    }

    if (payload.replyToMessageId) {
      const thread = chatMessages[chatId]
      const original = thread?.find((m) => m.id === payload.replyToMessageId)
      if (original) {
        msg.replyTo = {
          sender: original.senderName || (original.sender === "customer" ? "Customer" : "Agent"),
          text: original.text,
          messageId: original.id,
        }
      }
    }

    // Append to local mock data so subsequent fetchMessages includes it
    if (!chatMessages[chatId]) {
      chatMessages[chatId] = []
    }
    chatMessages[chatId].push(msg)

    return msg
  }

  async sendTemplate(
    _chatId: string,
    _payload: TemplateSendPayload,
  ): Promise<void> {
    await delay()
  }

  async assignChat(_chatId: string, _agentId: string): Promise<void> {
    await delay()
  }

  async resolveChat(_chatId: string): Promise<void> {
    await delay()
  }

  async fetchContacts(query?: string): Promise<Contact[]> {
    await delay()
    if (!query) return [...contacts]
    const q = query.toLowerCase()
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    )
  }

  async createContact(contact: {
    name: string
    phone: string
    channel: string
  }): Promise<Contact> {
    await delay()
    const newContact: Contact = {
      id: \`c-new-\${Date.now()}\`,
      name: contact.name,
      phone: contact.phone,
      channel: contact.channel,
    }
    contacts.push(newContact)
    return newContact
  }

  async fetchTemplates(category?: TemplateCategory): Promise<TemplateDef[]> {
    await delay()
    if (!category || category === "all") return [...templateList]
    return templateList.filter((t) => t.category === category)
  }

  async fetchContactDetails(chatId: string): Promise<ContactDetails> {
    await delay()
    const chat = chatItems.find((c) => c.id === chatId)
    const contact = contacts.find(
      (c) => c.name === chat?.name || c.phone === chat?.name,
    )
    return {
      name: contact?.name || chat?.name || "Unknown",
      phone: contact?.phone || "+91 00000 00000",
      email: "contact@example.com",
      source: "WhatsApp",
      marketingOptIn: true,
      tags: ["Customer"],
      location: "India",
    }
  }

  async updateContactDetails(
    _chatId: string,
    _data: Partial<ContactDetails>,
  ): Promise<void> {
    await delay()
  }

  async fetchCannedMessages(): Promise<CannedMessage[]> {
    await delay()
    return [...cannedMessages]
  }

  onNewMessage(
    _callback: (chatId: string, message: ChatMessage) => void,
  ): () => void {
    // No-op for mock — real transport would set up WebSocket/SSE
    return () => {}
  }
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { MockTransport } from "./mock-transport"
export type { ChatTransport } from "./types"
`, prefix),
        }
      ],
    },
    "chat-provider": {
      name: "chat-provider",
      description: "React context provider for chat state management with transport abstraction",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "chat-types",
            "chat-transport"
      ],
      isMultiFile: true,
      directory: "chat-provider",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-provider.tsx",
      files: [
        {
          name: "types.ts",
          content: prefixTailwindClasses(`import type {
  Tab,
  ChatItem,
  ChatMessage,
  AssigneeItem,
  ChannelItem,
  TabDef,
  Contact,
  TemplateDef,
  CannedMessage,
  ChatFilters,
} from "../chat-types"
import type { ChatTransport } from "../chat-transport/types"

export interface ChatContextValue {
  // Transport
  transport: ChatTransport

  // Data
  tabs: TabDef[]
  assignees: AssigneeItem[]
  channels: ChannelItem[]
  chats: ChatItem[]
  contacts: Contact[]
  templates: TemplateDef[]
  cannedMessages: CannedMessage[]

  // Chat list state
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  search: string
  setSearch: (query: string) => void
  selectedChatId: string | null
  selectChat: (chatId: string | null) => void

  // Messages for selected chat
  messages: ChatMessage[]
  isLoadingMessages: boolean

  // Filters
  appliedFilters: ChatFilters | null
  applyFilters: (filters: ChatFilters | null) => void

  // UI state toggles
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  showNewChat: boolean
  setShowNewChat: (show: boolean) => void
  showContactDetails: boolean
  setShowContactDetails: (show: boolean) => void
  showTemplateModal: boolean
  setShowTemplateModal: (show: boolean) => void
  showAddContact: boolean
  setShowAddContact: (show: boolean) => void

  // Actions
  sendMessage: (text: string, attachment?: File, replyToMessageId?: string) => Promise<void>
  sendTemplate: (templateId: string, variables: Record<string, string>, cardVariables?: Record<number, { body: Record<string, string>; button: Record<string, string> }>) => Promise<void>
  assignChat: (agentId: string) => Promise<void>
  resolveChat: () => Promise<void>
  createContact: (contact: { name: string; phone: string; channel: string }) => Promise<void>

  // Loading states
  isLoading: boolean
}
`, prefix),
        },
        {
          name: "chat-context.ts",
          content: prefixTailwindClasses(`import * as React from "react"
import type { ChatContextValue } from "./types"

export const ChatContext = React.createContext<ChatContextValue | null>(null)

export function useChatContext(): ChatContextValue {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a <ChatProvider>")
  }
  return context
}
`, prefix),
        },
        {
          name: "chat-provider.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import type {
  Tab,
  ChatItem,
  ChatMessage,
  AssigneeItem,
  ChannelItem,
  TabDef,
  Contact,
  TemplateDef,
  CannedMessage,
  ChatFilters,
  CardVarMap,
} from "../chat-types"
import type { ChatTransport } from "../chat-transport/types"
import { ChatContext } from "./chat-context"

export interface ChatProviderProps {
  transport: ChatTransport
  children: React.ReactNode
}

export function ChatProvider({ transport, children }: ChatProviderProps) {
  // ── Lookup data ──────────────────────────────────────────────
  const [tabs, setTabs] = React.useState<TabDef[]>([])
  const [assignees, setAssignees] = React.useState<AssigneeItem[]>([])
  const [channels, setChannels] = React.useState<ChannelItem[]>([])
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [templates, setTemplates] = React.useState<TemplateDef[]>([])
  const [cannedMessages, setCannedMessages] = React.useState<CannedMessage[]>(
    []
  )

  // ── Chat list state ──────────────────────────────────────────
  const [chats, setChats] = React.useState<ChatItem[]>([])
  const [activeTab, setActiveTab] = React.useState<Tab>("open")
  const [search, setSearch] = React.useState("")
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(
    null
  )

  // ── Messages for selected chat ───────────────────────────────
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false)

  // ── Filters ──────────────────────────────────────────────────
  const [appliedFilters, setAppliedFilters] =
    React.useState<ChatFilters | null>(null)

  // ── UI state toggles ────────────────────────────────────────
  const [showFilters, setShowFilters] = React.useState(false)
  const [showNewChat, setShowNewChat] = React.useState(false)
  const [showContactDetails, setShowContactDetails] = React.useState(false)
  const [showTemplateModal, setShowTemplateModal] = React.useState(false)
  const [showAddContact, setShowAddContact] = React.useState(false)

  // ── Loading ──────────────────────────────────────────────────
  const [isLoading, setIsLoading] = React.useState(true)

  // ── Load initial lookup data on mount ────────────────────────
  React.useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      setIsLoading(true)
      try {
        const [
          tabsData,
          assigneesData,
          channelsData,
          contactsData,
          templatesData,
          cannedData,
        ] = await Promise.all([
          transport.fetchTabs(),
          transport.fetchAssignees(),
          transport.fetchChannels(),
          transport.fetchContacts(),
          transport.fetchTemplates(),
          transport.fetchCannedMessages(),
        ])

        if (cancelled) return

        setTabs(tabsData)
        setAssignees(assigneesData)
        setChannels(channelsData)
        setContacts(contactsData)
        setTemplates(templatesData)
        setCannedMessages(cannedData)
      } catch (err) {
        console.error("[ChatProvider] Failed to load initial data:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadInitialData()
    return () => {
      cancelled = true
    }
  }, [transport])

  // ── Re-fetch chats when tab, search, or filters change ──────
  React.useEffect(() => {
    let cancelled = false

    async function loadChats() {
      try {
        const data = await transport.fetchChats({
          tab: activeTab,
          search: search || undefined,
          filters: appliedFilters ?? undefined,
        })
        if (!cancelled) setChats(data)
      } catch (err) {
        console.error("[ChatProvider] Failed to load chats:", err)
      }
    }

    loadChats()
    return () => {
      cancelled = true
    }
  }, [transport, activeTab, search, appliedFilters])

  // ── Fetch messages when selectedChatId changes ──────────────
  React.useEffect(() => {
    if (!selectedChatId) {
      setMessages([])
      return
    }

    let cancelled = false
    setIsLoadingMessages(true)

    async function loadMessages() {
      try {
        const data = await transport.fetchMessages(selectedChatId!)
        if (!cancelled) setMessages(data)
      } catch (err) {
        console.error("[ChatProvider] Failed to load messages:", err)
      } finally {
        if (!cancelled) setIsLoadingMessages(false)
      }
    }

    loadMessages()
    return () => {
      cancelled = true
    }
  }, [transport, selectedChatId])

  // ── Subscribe to real-time messages ─────────────────────────
  React.useEffect(() => {
    if (!transport.onNewMessage) return

    const unsubscribe = transport.onNewMessage((chatId, message) => {
      if (chatId === selectedChatId) {
        setMessages((prev) => [...prev, message])
      }
    })

    return unsubscribe
  }, [transport, selectedChatId])

  // ── Actions ─────────────────────────────────────────────────
  const selectChat = React.useCallback((chatId: string | null) => {
    setSelectedChatId(chatId)
  }, [])

  const applyFilters = React.useCallback(
    (filters: ChatFilters | null) => {
      setAppliedFilters(filters)
    },
    []
  )

  const sendMessage = React.useCallback(
    async (text: string, attachment?: File, replyToMessageId?: string) => {
      if (!selectedChatId) return

      const sent = await transport.sendMessage(selectedChatId, {
        text,
        attachment,
        replyToMessageId,
      })
      setMessages((prev) => [...prev, sent])
    },
    [transport, selectedChatId]
  )

  const sendTemplate = React.useCallback(
    async (
      templateId: string,
      variables: Record<string, string>,
      cardVariables?: Record<
        number,
        { body: Record<string, string>; button: Record<string, string> }
      >
    ) => {
      if (!selectedChatId) return

      await transport.sendTemplate(selectedChatId, {
        templateId,
        variables,
        cardVariables: cardVariables as CardVarMap | undefined,
      })
    },
    [transport, selectedChatId]
  )

  const assignChat = React.useCallback(
    async (agentId: string) => {
      if (!selectedChatId) return
      await transport.assignChat(selectedChatId, agentId)
    },
    [transport, selectedChatId]
  )

  const resolveChat = React.useCallback(async () => {
    if (!selectedChatId) return
    await transport.resolveChat(selectedChatId)
  }, [transport, selectedChatId])

  const createContact = React.useCallback(
    async (contact: { name: string; phone: string; channel: string }) => {
      await transport.createContact(contact)
    },
    [transport]
  )

  // ── Context value ───────────────────────────────────────────
  const value = React.useMemo(
    () => ({
      transport,
      tabs,
      assignees,
      channels,
      chats,
      contacts,
      templates,
      cannedMessages,
      activeTab,
      setActiveTab,
      search,
      setSearch,
      selectedChatId,
      selectChat,
      messages,
      isLoadingMessages,
      appliedFilters,
      applyFilters,
      showFilters,
      setShowFilters,
      showNewChat,
      setShowNewChat,
      showContactDetails,
      setShowContactDetails,
      showTemplateModal,
      setShowTemplateModal,
      showAddContact,
      setShowAddContact,
      sendMessage,
      sendTemplate,
      assignChat,
      resolveChat,
      createContact,
      isLoading,
    }),
    [
      transport,
      tabs,
      assignees,
      channels,
      chats,
      contacts,
      templates,
      cannedMessages,
      activeTab,
      search,
      selectedChatId,
      selectChat,
      messages,
      isLoadingMessages,
      appliedFilters,
      applyFilters,
      showFilters,
      showNewChat,
      showContactDetails,
      showTemplateModal,
      showAddContact,
      sendMessage,
      sendTemplate,
      assignChat,
      resolveChat,
      createContact,
      isLoading,
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatProvider } from "./chat-provider"
export { ChatContext, useChatContext } from "./chat-context"
export type { ChatContextValue } from "./types"
`, prefix),
        }
      ],
    },
    "chat-sidebar": {
      name: "chat-sidebar",
      description: "Chat inbox sidebar with search, tabs, and conversation list",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "text-field",
            "tabs",
            "badge",
            "chat-list-item"
      ],
      isMultiFile: true,
      directory: "chat-sidebar",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-sidebar.tsx",
      files: [
        {
          name: "chat-sidebar.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import { TextField } from "../../text-field"
import { Tabs, TabsList, TabsTrigger } from "../../tabs"
import { Badge } from "../../badge"
import { ChatListItem, type MessageType } from "../../chat-list-item"
import { useChatContext } from "../chat-provider"
import type { Tab } from "../chat-types"
import { Search, Plus, CircleAlert } from "lucide-react"

/* ── Custom Icons ── */

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-semantic-text-primary"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
)

/* ── Helpers ── */

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ── ChatSidebar ── */

export interface ChatSidebarProps {
  /** Swappable content — typically FilterPanel or NewChatPanel rendered by the parent */
  children?: React.ReactNode
  /** Ref forwarded to the chat area for focus management after selecting a chat */
  chatAreaRef?: React.RefObject<HTMLDivElement | null>
}

function ChatSidebar({ children, chatAreaRef }: ChatSidebarProps) {
  const {
    tabs,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    chats,
    selectedChatId,
    selectChat,
    showFilters,
    setShowFilters,
    showNewChat,
    setShowNewChat,
    appliedFilters,
    setShowContactDetails,
  } = useChatContext()

  const hasActiveFilters =
    (appliedFilters?.assignees != null && appliedFilters.assignees.size > 0) ||
    (appliedFilters?.channels != null && appliedFilters.channels.size > 0)

  const filteredChats = React.useMemo(() => {
    return chats.filter((c) => {
      if (c.tab !== activeTab) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [chats, activeTab, search])

  const openNewChat = React.useCallback(() => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }, [setShowFilters, setSearch, setShowNewChat])

  const openFilters = React.useCallback(() => {
    setShowFilters(true)
    setSearch("")
  }, [setShowFilters, setSearch])

  const handleSelectChat = React.useCallback(
    (chatId: string) => {
      selectChat(chatId)
      setShowContactDetails(false)
      requestAnimationFrame(() => chatAreaRef?.current?.focus())
    },
    [selectChat, setShowContactDetails, chatAreaRef]
  )

  // Determine if a swappable child panel is active
  const showSwappableContent = showNewChat || showFilters

  return (
    <nav
      aria-label="Inbox"
      className="flex flex-col w-[356px] h-full bg-white shrink-0 border-r border-solid border-semantic-border-layout"
    >
      {showSwappableContent && children ? (
        <div
          key={showNewChat ? "newchat" : "filters"}
          className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-3 fade-in duration-200"
        >
          {children}
        </div>
      ) : (
        <div
          key="inbox"
          className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 h-[72px] shrink-0">
            <h1 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
              Inbox
            </h1>
            <Button
              variant="outline"
              className="h-10"
              leftIcon={<Plus className="size-5" />}
              onClick={openNewChat}
            >
              New Chat
            </Button>
          </div>

          {/* Search + Filter button */}
          <div
            role="search"
            aria-label="Search conversations"
            className="flex gap-2 px-4 shrink-0"
          >
            <TextField
              placeholder="Search conversations"
              aria-label="Search conversations"
              leftIcon={<Search className="size-[18px]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              clearable
              onClear={() => setSearch("")}
              wrapperClassName="flex-1"
              size="default"
            />
            <Button
              variant="outline"
              size="icon-lg"
              onClick={openFilters}
              className={cn(
                "relative",
                hasActiveFilters &&
                  "border-semantic-primary text-semantic-primary"
              )}
            >
              <FilterIcon />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-semantic-border-accent animate-in zoom-in duration-200 ring-1 ring-semantic-border-layout" />
              )}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Tab)}
          >
            <TabsList fullWidth className="shrink-0 mt-1">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                  <Badge
                    variant={activeTab === tab.id ? "primary" : "default"}
                    size="sm"
                  >
                    {tab.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Chat List */}
          <div className="sr-only" aria-live="polite">
            {\`\${filteredChats.length} conversations\`}
          </div>
          <div
            key={activeTab}
            className="flex-1 overflow-y-auto animate-in fade-in duration-150 ease-out"
          >
            {filteredChats.map((chat) => (
              <div key={chat.id} className="relative">
                <ChatListItem
                  {...chat}
                  messageType={chat.messageType as MessageType}
                  message={
                    search
                      ? highlightMatch(chat.message, search)
                      : chat.message
                  }
                  messageStatus={
                    chat.isFailed ? undefined : chat.messageStatus
                  }
                  isSelected={selectedChatId === chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                />
                {chat.isFailed && (
                  <div className="absolute top-5 right-4">
                    <CircleAlert className="size-4 text-semantic-error-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

ChatSidebar.displayName = "ChatSidebar"

export { ChatSidebar }
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatSidebar } from "./chat-sidebar"
export type { ChatSidebarProps } from "./chat-sidebar"
`, prefix),
        }
      ],
    },
    "chat-filter-panel": {
      name: "chat-filter-panel",
      description: "Assignee and channel filter panel with checkbox groups",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "text-field",
            "checkbox",
            "dialog"
      ],
      isMultiFile: true,
      directory: "chat-filter-panel",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-filter-panel.tsx",
      files: [
        {
          name: "chat-filter-panel.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { Button } from "../../button"
import { TextField } from "../../text-field"
import { Checkbox } from "../../checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../dialog"
import { useChatContext } from "../chat-provider"
import {
  Search,
  ArrowLeft,
  Users,
  Radio,
  Bot,
} from "lucide-react"

export interface ChatFilterPanelProps {
  onClose: () => void
  onApply: (assignees: Set<string>, channels: Set<string>) => void
}

const COLLAPSED_COUNT = 4

export function ChatFilterPanel({ onClose, onApply }: ChatFilterPanelProps) {
  const { assignees, channels } = useChatContext()

  const [filterSearch, setFilterSearch] = React.useState("")
  const [showAllBots, setShowAllBots] = React.useState(false)
  const [showAllAgents, setShowAllAgents] = React.useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = React.useState(false)

  const initialAssignees = React.useRef(
    new Set(assignees.map((a) => a.id))
  )
  const initialChannels = React.useRef(
    new Set(channels.map((c) => c.id))
  )

  const [selectedAssignees, setSelectedAssignees] = React.useState<Set<string>>(
    () => new Set(assignees.map((a) => a.id))
  )
  const [selectedChannels, setSelectedChannels] = React.useState<Set<string>>(
    () => new Set(channels.map((c) => c.id))
  )

  const isDirty = () => {
    if (selectedAssignees.size !== initialAssignees.current.size) return true
    if (selectedChannels.size !== initialChannels.current.size) return true
    let dirty = false
    selectedAssignees.forEach((id) => {
      if (!initialAssignees.current.has(id)) dirty = true
    })
    if (dirty) return true
    selectedChannels.forEach((id) => {
      if (!initialChannels.current.has(id)) dirty = true
    })
    return dirty
  }

  const handleBack = () => {
    if (isDirty()) {
      setShowDiscardDialog(true)
    } else {
      onClose()
    }
  }

  const bots = assignees.filter((a) => a.type === "bot")
  const agents = assignees.filter((a) => a.type === "agent")
  const topLevel = assignees.filter(
    (a) => a.type === "all" || a.type === "unassigned"
  )

  const query = filterSearch.toLowerCase()
  const filteredBots = bots.filter((b) =>
    b.label.toLowerCase().includes(query)
  )
  const filteredAgents = agents.filter((a) =>
    a.label.toLowerCase().includes(query)
  )
  const filteredChannels = channels.filter(
    (c) =>
      c.name.toLowerCase().includes(query) || c.phone.includes(filterSearch)
  )

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header — matches NewChat pattern */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-solid border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">
            Filters
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm"
          onClick={() => {
            setSelectedAssignees(new Set())
            setSelectedChannels(new Set())
          }}
        >
          Reset
        </Button>
      </div>

      {/* Search row */}
      <div
        role="search"
        aria-label="Search filters"
        className="flex items-center gap-2 px-3 py-2.5 border-b border-solid border-semantic-border-layout shrink-0"
      >
        <TextField
          placeholder="Search filters..."
          aria-label="Search filters"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          clearable
          onClear={() => setFilterSearch("")}
        />
      </div>

      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* ── Assignment Section ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Assignment
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedAssignees.size}/{assignees.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedAssignees(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden">
            {topLevel.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-solid border-semantic-border-layout"
              >
                <Checkbox
                  size="sm"
                  checked={selectedAssignees.has(item.id)}
                  onCheckedChange={() => toggleAssignee(item.id)}
                />
                <span className="text-[14px] text-semantic-text-primary">
                  {item.label}
                </span>
              </label>
            ))}

            {filteredBots.length > 0 &&
              (() => {
                const isSearching = filterSearch.trim().length > 0
                const visibleBots =
                  isSearching || showAllBots
                    ? filteredBots
                    : filteredBots.slice(0, COLLAPSED_COUNT)
                const hiddenCount = filteredBots.length - COLLAPSED_COUNT
                return (
                  <>
                    <div className="px-3 py-2 bg-semantic-bg-ui border-b border-solid border-semantic-border-layout">
                      <span className="text-[13px] font-semibold text-semantic-text-secondary">
                        Bots ({bots.length})
                      </span>
                    </div>
                    {visibleBots.map((bot) => (
                      <label
                        key={bot.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-solid border-semantic-border-layout"
                      >
                        <Checkbox
                          size="sm"
                          checked={selectedAssignees.has(bot.id)}
                          onCheckedChange={() => toggleAssignee(bot.id)}
                        />
                        <span className="text-[14px] text-semantic-text-primary flex-1">
                          {bot.label}
                        </span>
                        <Bot className="size-4 text-semantic-text-muted" />
                      </label>
                    ))}
                    {!isSearching && hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllBots((p) => !p)}
                        className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left border-b border-solid border-semantic-border-layout"
                      >
                        {showAllBots
                          ? "Show less"
                          : \`Show more (+\${hiddenCount})\`}
                      </button>
                    )}
                  </>
                )
              })()}

            {filteredAgents.length > 0 &&
              (() => {
                const isSearching = filterSearch.trim().length > 0
                const visibleAgents =
                  isSearching || showAllAgents
                    ? filteredAgents
                    : filteredAgents.slice(0, COLLAPSED_COUNT)
                const hiddenCount = filteredAgents.length - COLLAPSED_COUNT
                return (
                  <>
                    <div className="px-3 py-2 bg-semantic-bg-ui border-b border-solid border-semantic-border-layout">
                      <span className="text-[13px] font-semibold text-semantic-text-secondary">
                        Agents ({agents.length})
                      </span>
                    </div>
                    {visibleAgents.map((agent, i) => (
                      <label
                        key={agent.id}
                        className={\`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors \${
                          i < visibleAgents.length - 1 ||
                          (!isSearching && hiddenCount > 0)
                            ? "border-b border-solid border-semantic-border-layout"
                            : ""
                        }\`}
                      >
                        <Checkbox
                          size="sm"
                          checked={selectedAssignees.has(agent.id)}
                          onCheckedChange={() => toggleAssignee(agent.id)}
                        />
                        <span className="text-[14px] text-semantic-text-primary">
                          {agent.label}
                        </span>
                      </label>
                    ))}
                    {!isSearching && hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllAgents((p) => !p)}
                        className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left"
                      >
                        {showAllAgents
                          ? "Show less"
                          : \`Show more (+\${hiddenCount})\`}
                      </button>
                    )}
                  </>
                )
              })()}
          </div>
        </div>

        {/* ── Channels Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Channels
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedChannels.size}/{channels.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedChannels(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden">
            {filteredChannels.map((ch, i) => (
              <label
                key={ch.id}
                className={\`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors \${
                  i < filteredChannels.length - 1
                    ? "border-b border-solid border-semantic-border-layout"
                    : ""
                }\`}
              >
                <Checkbox
                  size="sm"
                  checked={selectedChannels.has(ch.id)}
                  onCheckedChange={() => toggleChannel(ch.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-semantic-text-primary truncate">
                      {ch.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-semantic-text-muted bg-semantic-bg-hover px-1.5 py-0.5 rounded">
                      {ch.badge}
                    </span>
                  </div>
                  <span className="text-[13px] text-semantic-text-muted">
                    {ch.phone}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-solid border-semantic-border-layout px-4 py-3">
        <p className="m-0 text-[13px] text-semantic-text-muted mb-3 text-center">
          Maximum selections allowed per category: 50
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => onApply(selectedAssignees, selectedChannels)}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Discard unsaved filters confirmation */}
      {showDiscardDialog && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setShowDiscardDialog(false)
          }}
        >
          <DialogContent size="default" className="w-[400px] max-w-[90vw]">
            <DialogTitle>Discard filter changes?</DialogTitle>
            <DialogDescription>
              You have unsaved filter changes. Do you want to apply them or
              discard?
            </DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDiscardDialog(false)
                  onClose()
                }}
              >
                Discard
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowDiscardDialog(false)
                  onApply(selectedAssignees, selectedChannels)
                }}
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

ChatFilterPanel.displayName = "ChatFilterPanel"
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatFilterPanel } from "./chat-filter-panel"
export type { ChatFilterPanelProps } from "./chat-filter-panel"
`, prefix),
        }
      ],
    },
    "chat-new-panel": {
      name: "chat-new-panel",
      description: "New chat panel with contact search and add-contact modal",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "text-field",
            "dialog",
            "avatar",
            "dropdown-menu"
      ],
      isMultiFile: true,
      directory: "chat-new-panel",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-new-panel.tsx",
      files: [
        {
          name: "chat-new-panel.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import { TextField } from "../../text-field"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../dropdown-menu"
import { Avatar } from "../../avatar"
import { useChatContext } from "../chat-provider"
import { ArrowLeft, ChevronDown, Search, UserPlus } from "lucide-react"

/* ── Helpers ── */

/**
 * Highlights the first occurrence of \`query\` within \`text\` by wrapping it
 * in a <strong> tag. Returns the original text if no match is found.
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ── Component ── */

export interface ChatNewPanelProps {
  /** Called when the user clicks the back button */
  onBack: () => void
  /** Called when the user wants to open the "Add new contact" modal */
  onOpenAddContact: () => void
}

/**
 * Panel that displays a searchable contact list for starting a new chat.
 * Includes a header with back navigation and channel selector, a search bar
 * with an "Add new contact" button, and a scrollable contact list with
 * search-match highlighting.
 *
 * Data (contacts, channels) is read from \`useChatContext()\`.
 */
function ChatNewPanel({ onBack, onOpenAddContact }: ChatNewPanelProps) {
  const { contacts, channels } = useChatContext()
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedChannel, setSelectedChannel] = React.useState(channels[0])

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch)
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-solid border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">New Chat</span>
        </div>

        {/* Channel selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedChannel.badge}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            {channels.map((ch) => (
              <DropdownMenuItem
                key={ch.id}
                onSelect={() => setSelectedChannel(channels.find((c) => c.id === ch.id)!)}
                description={ch.phone}
                suffix={ch.badge}
                className={cn(selectedChannel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
              >
                {ch.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search row */}
      <div role="search" aria-label="Search contacts" className="flex items-center gap-2 px-3 py-2.5 border-b border-solid border-semantic-border-layout shrink-0">
        <TextField
          placeholder="Search contacts"
          aria-label="Search contacts"
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          size="default"
          clearable={!!contactSearch}
          onClear={() => setContactSearch("")}
        />
        <Button variant="outline" size="icon-lg" onClick={onOpenAddContact} className="shrink-0" aria-label="Add new contact">
          <UserPlus className="size-4" />
        </Button>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[13px] text-semantic-text-muted">
            No contacts found
          </div>
        ) : (
          filtered.map((contact, i) => (
            <button
              type="button"
              key={contact.id}
              className={cn(
                "flex items-center gap-3 px-3 py-3 hover:bg-semantic-bg-hover cursor-pointer transition-colors text-left w-full",
                i < filtered.length - 1 && "border-b border-solid border-semantic-border-layout"
              )}
            >
              <Avatar name={contact.name} size="sm" />
              {/* Info */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-semantic-text-primary leading-5 truncate">
                    {contactSearch ? highlightMatch(contact.name, contactSearch) : contact.name}
                  </span>
                  <span className="text-[12px] text-semantic-text-muted">
                    {contactSearch ? highlightMatch(contact.phone, contactSearch) : contact.phone}
                  </span>
                </div>
                {contact.channel && (
                  <span className="text-[12px] font-medium text-semantic-text-muted shrink-0 ml-2">
                    {contact.channel}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
ChatNewPanel.displayName = "ChatNewPanel"

export { ChatNewPanel }
`, prefix),
        },
        {
          name: "add-contact-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import { TextField } from "../../text-field"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../dropdown-menu"
import { useChatContext } from "../chat-provider"
import type { ChannelItem } from "../chat-types"
import { ChevronDown, X } from "lucide-react"

export interface AddNewContactModalProps {
  /** The default channel to pre-select */
  defaultChannel: ChannelItem
  /** Called when the modal should close */
  onClose: () => void
}

/**
 * Modal dialog for adding a new contact. Shows a channel selector,
 * phone number input with country code prefix, and a name field.
 * Calls \`createContact\` from ChatContext when "Start Conversation" is clicked.
 */
function AddNewContactModal({
  defaultChannel,
  onClose,
}: AddNewContactModalProps) {
  const { channels, createContact } = useChatContext()
  const [phone, setPhone] = React.useState("")
  const [name, setName] = React.useState("")
  const [channel, setChannel] = React.useState(defaultChannel)

  const handleStartConversation = async () => {
    if (!phone.trim()) return
    await createContact({ name: name.trim(), phone: phone.trim(), channel: channel.id })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent size="default" className="w-[480px] max-w-[90vw] p-0 gap-0" hideCloseButton>
        <DialogDescription className="sr-only">Add a new contact to start a conversation</DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <DialogTitle>Add New Contact</DialogTitle>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {channel.badge}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                {channels.map((ch) => (
                  <DropdownMenuItem
                    key={ch.id}
                    onSelect={() => setChannel(channels.find((c) => c.id === ch.id)!)}
                    description={ch.phone}
                    suffix={ch.badge}
                    className={cn(channel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
                  >
                    {ch.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-contact-phone" className="text-[14px] font-medium text-semantic-text-primary">
              Phone<span className="text-semantic-error-primary">*</span>
            </label>
            <div className="flex items-center border border-solid border-semantic-border-layout rounded focus-within:border-semantic-border-focus transition-colors">
              <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                <span className="text-[14px]">🇮🇳</span>
                <span className="text-[14px] text-semantic-text-secondary">+91</span>
              </div>
              <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
              <input
                id="add-contact-phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-required="true"
                className="flex-1 h-9 px-3 text-[14px] text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Save contact as */}
          <TextField
            label="Save contact as"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="sm"
          />

          {/* Start Conversation button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleStartConversation}>Start Conversation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
AddNewContactModal.displayName = "AddNewContactModal"

export { AddNewContactModal }
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatNewPanel } from "./chat-new-panel"
export { AddNewContactModal } from "./add-contact-modal"
export type { ChatNewPanelProps } from "./chat-new-panel"
export type { AddNewContactModalProps } from "./add-contact-modal"
`, prefix),
        }
      ],
    },
    "chat-message-list": {
      name: "chat-message-list",
      description: "Message list with all media renderers, delivery status, and reply functionality",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "tooltip",
            "spinner",
            "avatar",
            "tag",
            "dropdown-menu",
            "chat-timeline-divider",
            "doc-media"
      ],
      isMultiFile: true,
      directory: "chat-message-list",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-message-list.tsx",
      files: [
        {
          name: "message-renderers.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
  Bot,
  Megaphone,
  Code,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../dropdown-menu"
import { Spinner } from "../../spinner"
import type { MediaPayload, SentByType } from "../chat-types"

/* ── Constants ── */

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

/* ── Helper: getInitials ── */

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

/* ── SenderIndicatorBadge ── */

function SenderIndicatorBadge({ sentBy }: { sentBy: { type: SentByType; name?: string } }) {
  const iconClass = "size-3.5 text-semantic-text-muted"
  if (sentBy.type === "agent" && sentBy.name) {
    return <span className="text-[10px] font-medium text-semantic-text-secondary leading-none">{getInitials(sentBy.name)}</span>
  }
  if (sentBy.type === "bot") return <Bot className={iconClass} />
  if (sentBy.type === "campaign") return <Megaphone className={iconClass} />
  return <Code className={iconClass} />
}

/* ── ImageMedia ── */

function ImageMedia({ media }: { media: MediaPayload }) {
  return (
    <div className="relative">
      <img
        src={media.url}
        alt={media.caption || "Image"}
        className="w-full rounded-t object-cover max-h-[280px]"
      />
    </div>
  )
}

/* ── VideoMedia ── */

function VideoMedia({ media }: { media: MediaPayload }) {
  const [playing, setPlaying] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [speed, setSpeed] = React.useState(1)
  const [volume, setVolume] = React.useState(75)
  return (
    <div className="relative rounded-t overflow-hidden cursor-pointer group" onClick={() => setPlaying(!playing)}>
      <img
        src={media.thumbnailUrl || media.url}
        alt="Video thumbnail"
        className="w-full object-cover"
        style={{ aspectRatio: "16/10" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Center play/pause */}
      <div className={\`absolute inset-0 flex items-center justify-center transition-opacity \${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}\`}>
        <button type="button" aria-label={playing ? "Pause video" : "Play video"} className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors border-none cursor-pointer">
          {playing ? (
            <Pause className="size-7 text-white fill-white" />
          ) : (
            <Play className="size-7 text-white fill-white ml-0.5" />
          )}
        </button>
      </div>
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-8">
        {/* Seek bar */}
        <div className="flex items-center gap-2 mb-2">
          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={15}
            tabIndex={0}
            className="relative flex-1 h-[3px] rounded-full bg-white/30"
          >
            <div className="absolute left-0 top-0 h-full w-[15%] rounded-full bg-white" />
            <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow-md" style={{ left: "15%" }} />
          </div>
        </div>
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white tabular-nums">{media.duration || "0:00"}</span>
          <div className="flex items-center gap-2.5">
            {/* Speed dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={\`Playback speed \${speed}x\`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-full"
                >
                  {speed}x
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                  {SPEED_OPTIONS.map((s) => (
                    <DropdownMenuRadioItem key={s} value={String(s)}>
                      {s === 1 ? "1x (Normal)" : \`\${s}x\`}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Volume control */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button aria-label={muted || volume === 0 ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)} className="hover:opacity-70 transition-opacity">
                {muted || volume === 0 ? <VolumeX className="size-4 text-white/50" /> : <Volume2 className="size-4 text-white" />}
              </button>
              <div
                role="slider"
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={muted ? 0 : volume}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault(); e.stopPropagation(); setVolume(v => Math.min(100, v + 5)); setMuted(false)
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault(); e.stopPropagation(); setVolume(v => Math.max(0, v - 5)); setMuted(false)
                  }
                }}
                className="relative w-[60px] h-4 flex items-center cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
                  setVolume(Math.max(0, Math.min(100, pct)))
                  setMuted(false)
                }}
              >
                <div className="w-full h-[3px] rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white" style={{ width: \`\${muted ? 0 : volume}%\` }} />
                </div>
                <div
                  className="absolute top-1/2 size-2.5 rounded-full bg-white"
                  style={{ left: \`\${muted ? 0 : volume}%\`, transform: "translate(-50%, -50%)" }}
                />
              </div>
            </div>
            <button aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen) }} className="hover:opacity-70 transition-opacity">
              {fullscreen ? <Minimize className="size-4 text-white" /> : <Maximize className="size-4 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── AudioMedia ── */

function AudioMedia({ media: _media }: { media: MediaPayload }) {
  const [playing, setPlaying] = React.useState(false)
  const [speed, setSpeed] = React.useState(1)

  // Waveform bar heights (deterministic pseudo-random pattern)
  const waveform = [
    4, 8, 14, 6, 20, 10, 4, 16, 7, 24, 5, 12, 18, 6, 10, 4,
    14, 22, 7, 5, 16, 10, 6, 19, 8, 4, 14, 7, 12, 5, 18, 9,
    4, 14, 6, 10, 22, 5, 13, 7, 4, 16, 9, 6, 19, 5, 12, 7,
    6, 14, 10, 4, 17, 7, 12,
  ]
  const barCount = 55
  const playedBars = 11
  const barW = 2
  const gap = 1.5
  const svgW = barCount * (barW + gap) - gap
  const svgH = 32

  return (
    <div className="w-full" style={{ padding: "10px 14px 0 14px" }}>
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          aria-label={playing ? "Pause audio" : "Play audio"}
          onClick={(e) => { e.stopPropagation(); setPlaying(!playing) }}
          className="shrink-0 size-10 rounded-full bg-semantic-primary flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {playing ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <rect x="0" y="0" width="4" height="14" rx="1.2" fill="white" />
              <rect x="8" y="0" width="4" height="14" rx="1.2" fill="white" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: 2 }}>
              <path d="M1 1.87v12.26a1 1 0 001.5.86l10.5-6.13a1 1 0 000-1.72L2.5 1.01A1 1 0 001 1.87z" fill="white" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div className="flex-1 min-w-0" style={{ height: svgH }}>
          <svg
            aria-hidden="true"
            viewBox={\`0 0 \${svgW} \${svgH}\`}
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            {waveform.slice(0, barCount).map((h, i) => (
              <rect
                key={i}
                x={i * (barW + gap)}
                y={(svgH - h) / 2}
                width={barW}
                height={h}
                rx={1.5}
                fill={i < playedBars ? "var(--semantic-brand-hover, #1F858F)" : "var(--semantic-text-muted, #C0C3CA)"}
              />
            ))}
          </svg>
        </div>

        {/* Speed dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={\`Playback speed \${speed}x\`}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 min-w-[34px] h-[22px] px-2 flex items-center justify-center rounded-full bg-black/40 hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] font-semibold text-white leading-none">{speed}x</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
              {SPEED_OPTIONS.map((s) => (
                <DropdownMenuRadioItem key={s} value={String(s)}>
                  {s === 1 ? "1x (Normal)" : \`\${s}x\`}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* ── CarouselMedia ── */

function CarouselMedia({ media }: { media: MediaPayload }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState((media.images?.length || 0) > 1)
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }
  const scroll = (dir: "left" | "right") => (e: React.MouseEvent) => {
    e.stopPropagation()
    scrollRef.current?.scrollBy({ left: dir === "right" ? 272 : -272, behavior: "smooth" })
    setTimeout(updateScrollState, 350)
  }
  return (
    <div className="relative">
      {/* Scrollable card row */}
      <div ref={scrollRef} onScroll={updateScrollState} tabIndex={0} role="region" aria-label="Carousel" aria-roledescription="carousel" className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3" style={{ scrollbarWidth: "none" }}>
        {media.images?.map((img, i) => (
          <div key={i} className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]" style={{ width: 260 }}>
            {/* Card image */}
            <img
              src={img.url}
              alt={img.title}
              className="w-full object-cover"
              style={{ height: 200 }}
            />
            {/* Card title */}
            <div className="px-3 pt-2.5 pb-2">
              <p className="m-0 text-[14px] font-medium text-semantic-text-primary line-clamp-2">{img.title}</p>
            </div>
            {/* Card buttons */}
            {img.buttons?.map((btn, j) => (
              <button
                key={j}
                className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-normal text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors"
                style={{ height: 40 }}
              >
                {btn.icon === "reply" && <Reply className="size-3.5" />}
                {btn.icon === "link" && <ExternalLink className="size-3.5" />}
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Navigation arrows */}
      {canScrollLeft && (
        <button aria-label="Scroll carousel left" onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronLeft className="size-4 text-semantic-text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button aria-label="Scroll carousel right" onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronRight className="size-4 text-semantic-text-primary" />
        </button>
      )}
    </div>
  )
}

/* ── LoadingMedia ── */

function LoadingMedia({ error }: { error?: string }) {
  return (
    <div className="overflow-hidden">
      {/* White preview area */}
      <div className="bg-white flex items-center justify-center" style={{ aspectRatio: "442 / 308" }}>
        <Spinner size="xl" variant="muted" />
      </div>
      {/* Error banner */}
      {error && (
        <div className="border-t border-solid border-semantic-error-primary bg-semantic-error-surface px-4 py-3">
          <p className="m-0 text-[14px] leading-5 text-semantic-error-primary">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}

export {
  SPEED_OPTIONS,
  getInitials,
  SenderIndicatorBadge,
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  LoadingMedia,
}
`, prefix),
        },
        {
          name: "chat-message-list.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../tooltip"
import {
  Check,
  CheckCheck,
  CircleAlert,
  Reply,
  File,
  ArrowDown,
} from "lucide-react"
import { ChatTimelineDivider } from "../../chat-timeline-divider"
import { DocMedia } from "../../doc-media"
import { useChatContext } from "../chat-provider"
import type { ChatMessage } from "../chat-types"
import {
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  LoadingMedia,
  SenderIndicatorBadge,
} from "./message-renderers"

/* ── Types ── */

export interface ReplyToPayload {
  messageId: string
  sender: string
  text: string
}

export interface ChatMessageListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback when the user clicks the reply button on a message */
  onReplyTo?: (payload: ReplyToPayload) => void
}

/* ── Component ── */

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, onReplyTo, ...props }, ref) => {
    const { messages, selectedChatId, chats } = useChatContext()

    const selectedChat = React.useMemo(
      () => chats.find((c) => c.id === selectedChatId) ?? null,
      [chats, selectedChatId]
    )

    if (!selectedChat || !selectedChatId) return null

    return (
      <div
        ref={ref}
        className={cn("flex-1 relative", className)}
        {...props}
      >
        <div
          key={selectedChatId}
          className="absolute inset-0 overflow-y-auto bg-semantic-bg-ui px-6 py-4 animate-in fade-in duration-200 ease-out"
        >
          {/* Date Divider */}
          <ChatTimelineDivider className="my-4" aria-label="Today">
            Today
          </ChatTimelineDivider>

          {/* Messages */}
          <div className="flex flex-col gap-4">
            {messages.map((msg, msgIdx) => {
              // Show unread separator before the last N messages (based on chat's unreadCount)
              const unreadCount = selectedChat.unreadCount || 0
              const unreadStartIdx = messages.length - unreadCount
              const showUnreadSeparator =
                unreadCount > 0 && msgIdx === unreadStartIdx
              const hasMedia = msg.type && msg.type !== "text"
              const mediaCaption = msg.media?.caption
              const hasText = msg.text || mediaCaption
              const isDocWithMeta = msg.type === "otherDoc" && msg.media

              // Media types get different bubble widths
              const bubbleWidth =
                msg.type === "carousel"
                  ? "max-w-[466px] w-full"
                  : msg.type === "image" ||
                      msg.type === "video" ||
                      msg.type === "docPreview" ||
                      msg.type === "document" ||
                      msg.type === "otherDoc" ||
                      msg.type === "loading"
                    ? "max-w-[380px] w-full"
                    : msg.type === "audio"
                      ? "max-w-[340px] w-[340px]"
                      : "max-w-[65%]"

              // System messages (e.g., assignment actions)
              if (msg.type === "system") {
                return (
                  <React.Fragment key={msg.id}>
                    {showUnreadSeparator && (
                      <ChatTimelineDivider
                        variant="unread"
                        aria-label={\`\${unreadCount} unread message\${unreadCount > 1 ? "s" : ""}\`}
                      >
                        {unreadCount} unread message
                        {unreadCount > 1 ? "s" : ""}
                      </ChatTimelineDivider>
                    )}
                    <ChatTimelineDivider variant="system">
                      {msg.text
                        .split(/(\\*\\*[^*]+\\*\\*)/)
                        .map((part, i) =>
                          part.startsWith("**") ? (
                            <span
                              key={i}
                              className="text-semantic-text-link font-medium"
                            >
                              {part.slice(2, -2)}
                            </span>
                          ) : (
                            part
                          )
                        )}
                    </ChatTimelineDivider>
                  </React.Fragment>
                )
              }

              return (
                <React.Fragment key={msg.id}>
                  {showUnreadSeparator && (
                    <ChatTimelineDivider
                      variant="unread"
                      aria-label={\`\${unreadCount} unread message\${unreadCount > 1 ? "s" : ""}\`}
                    >
                      {unreadCount} unread message
                      {unreadCount > 1 ? "s" : ""}
                    </ChatTimelineDivider>
                  )}
                  <div
                    className={\`flex items-start gap-1.5 group/msg \${msg.sender === "agent" ? "justify-end" : "justify-start"}\`}
                  >
                    <div
                      id={\`msg-\${msg.id}\`}
                      className={\`flex flex-col \${bubbleWidth} \${
                        msg.sender === "agent" ? "items-end" : "items-start"
                      }\`}
                    >
                      {msg.senderName && (
                        <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
                          {msg.senderName}
                        </span>
                      )}
                      <div
                        className={\`rounded-lg overflow-hidden \${ hasMedia ? "" : "px-3 pt-3 pb-1.5" } \${ msg.type === "audio" || msg.type === "otherDoc" || msg.type === "carousel" || msg.type === "loading" ? "w-full" : "" } \${ msg.sender === "agent" ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary" : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" }\`}
                      >
                        {/* Carousel: body text goes ABOVE cards */}
                        {msg.type === "carousel" && hasText && (
                          <div className="px-3 pt-3">
                            <p className="text-[14px] leading-5 m-0">
                              {msg.text || mediaCaption}
                            </p>
                          </div>
                        )}

                        {/* Media area (full-bleed) */}
                        {msg.type === "image" && msg.media && (
                          <ImageMedia media={msg.media} />
                        )}
                        {msg.type === "video" && msg.media && (
                          <VideoMedia media={msg.media} />
                        )}
                        {msg.type === "audio" && msg.media && (
                          <AudioMedia media={msg.media} />
                        )}
                        {msg.type === "docPreview" && msg.media && (
                          <DocMedia
                            variant="preview"
                            thumbnailUrl={
                              msg.media.thumbnailUrl || msg.media.url
                            }
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                            pageCount={msg.media.pageCount}
                            fileSize={msg.media.fileSize}
                          />
                        )}
                        {msg.type === "document" && msg.media && (
                          <DocMedia
                            variant="download"
                            thumbnailUrl={
                              msg.media.thumbnailUrl || msg.media.url
                            }
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                            pageCount={msg.media.pageCount}
                            fileSize={msg.media.fileSize}
                          />
                        )}
                        {msg.type === "otherDoc" && msg.media && (
                          <DocMedia
                            variant="file"
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                          />
                        )}
                        {msg.type === "carousel" && msg.media && (
                          <CarouselMedia media={msg.media} />
                        )}
                        {msg.type === "loading" && (
                          <LoadingMedia error={msg.error} />
                        )}

                        {/* Text + footer area (with padding) */}
                        <div
                          className={
                            hasMedia
                              ? \`px-3 pb-1.5 \${msg.type === "audio" ? "pt-0" : msg.type === "otherDoc" ? "pt-3 mt-1" : "pt-2"}\`
                              : ""
                          }
                        >
                          {msg.replyTo && (
                            <ReplyQuoteButton replyTo={msg.replyTo} />
                          )}
                          {hasText && msg.type !== "carousel" && (
                            <p className="text-[14px] leading-5 m-0">
                              {msg.text || mediaCaption}
                            </p>
                          )}
                          {/* File metadata row for download-type docs */}
                          {isDocWithMeta && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <File className="size-3.5 text-semantic-text-muted" />
                              <span className="text-[13px] text-semantic-text-muted">
                                {[
                                  msg.media!.fileType,
                                  msg.media!.pageCount &&
                                    \`\${msg.media!.pageCount} pages\`,
                                  msg.media!.fileSize,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </div>
                          )}
                          {/* Delivery footer */}
                          <DeliveryFooter msg={msg} />
                        </div>
                      </div>
                    </div>
                    {/* Sender indicator for outbound messages */}
                    {msg.sender === "agent" && msg.sentBy && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="self-end mb-1 shrink-0 size-7 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center cursor-default">
                            <SenderIndicatorBadge sentBy={msg.sentBy} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="m-0">
                            {msg.sentBy.type === "agent"
                              ? msg.sentBy.name
                              : msg.sentBy.type === "bot"
                                ? (msg.sentBy.name || "Bot")
                                : msg.sentBy.type === "campaign"
                                  ? "Campaign"
                                  : "API"}
                          </p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {msg.sender === "customer" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              onReplyTo?.({
                                messageId: msg.id,
                                sender: selectedChat.name,
                                text:
                                  msg.text || msg.media?.caption || "",
                              })
                            }
                            className="opacity-0 group-hover/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover"
                          >
                            <Reply className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="m-0">Reply</p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Scroll to bottom button */}
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={
            (selectedChat.unreadCount || 0) > 0
              ? \`Scroll to bottom, \${selectedChat.unreadCount} unread messages\`
              : "Scroll to bottom"
          }
          className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-md bg-white"
        >
          <ArrowDown className="size-5" />
          {(selectedChat.unreadCount || 0) > 0 && (
            <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-5 rounded-full bg-semantic-border-accent text-white text-[11px] font-semibold">
              {selectedChat.unreadCount}
            </span>
          )}
        </Button>
        {/* New messages live region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {messages.length > 0
            ? \`\${messages[messages.length - 1].sender === "customer" ? selectedChat.name : "Agent"}: \${messages[messages.length - 1].text || "sent media"}\`
            : ""}
        </div>
      </div>
    )
  }
)
ChatMessageList.displayName = "ChatMessageList"

/* ── ReplyQuoteButton (private) ── */

function ReplyQuoteButton({
  replyTo,
}: {
  replyTo: NonNullable<ChatMessage["replyTo"]>
}) {
  return (
    <button
      type="button"
      className="w-full bg-white border-l-[3px] border-solid border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors text-left border-t-0 border-r-0 border-b-0"
      aria-label={\`Jump to quoted message from \${replyTo.sender}\`}
      onClick={() => {
        if (replyTo.messageId) {
          const prefersReducedMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
          ).matches
          const el = document.getElementById(\`msg-\${replyTo.messageId}\`)
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "center",
            })
            el.style.outline = "2px solid var(--semantic-border-accent)"
            el.style.outlineOffset = "2px"
            el.style.transition = "outline-color 0.3s ease-out"
            setTimeout(() => {
              el.style.outlineColor = "transparent"
              setTimeout(() => {
                el.style.outline = ""
                el.style.outlineOffset = ""
                el.style.transition = ""
              }, 300)
            }, 1700)
          }
        }
      }}
    >
      <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
        {replyTo.sender}
      </p>
      <p className="text-[14px] text-semantic-text-muted truncate m-0">
        {replyTo.text}
      </p>
    </button>
  )
}

/* ── DeliveryFooter (private) ── */

function DeliveryFooter({ msg }: { msg: ChatMessage }) {
  return (
    <div
      className={\`flex items-center mt-1.5 \${msg.type === "audio" ? "justify-between" : msg.sender === "agent" ? "justify-end gap-1.5" : "justify-start gap-1.5"}\`}
      style={msg.type === "audio" ? { paddingLeft: 0 } : undefined}
    >
      {/* Audio duration on the left */}
      {msg.type === "audio" && msg.media && (
        <span
          className="font-semibold text-semantic-text-muted tabular-nums"
          style={{ fontSize: 12, letterSpacing: 0.05 }}
        >
          {msg.media.duration || "0:00"}
        </span>
      )}
      {/* Delivery status + time */}
      <div className="flex items-center gap-1.5">
        {msg.sender === "agent" && msg.status && (
          <>
            {msg.status === "failed" ? (
              <span role="alert" className="inline-flex items-center gap-1.5">
                <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
                <span className="text-[13px] text-semantic-error-primary font-medium">
                  Failed
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="text-[13px] font-semibold text-semantic-text-link underline hover:no-underline"
                >
                  Retry
                </button>
              </span>
            ) : (
              <>
                {msg.status === "sent" ? (
                  <Check className="size-4 text-semantic-text-muted shrink-0" />
                ) : (
                  <CheckCheck
                    className={\`size-4 shrink-0 \${msg.status === "read" ? "text-semantic-text-link" : "text-semantic-text-muted"}\`}
                  />
                )}
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted"
                >
                  {msg.status === "sent"
                    ? "Sent"
                    : msg.status === "delivered"
                      ? "Delivered"
                      : "Read"}
                </span>
              </>
            )}
            <span
              className="font-semibold text-semantic-text-muted"
              style={{ fontSize: 10 }}
            >
              •
            </span>
          </>
        )}
        <span style={{ fontSize: 12 }} className="text-semantic-text-muted">
          {msg.time}
        </span>
      </div>
    </div>
  )
}

export { ChatMessageList }
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatMessageList } from "./chat-message-list"
export type { ChatMessageListProps, ReplyToPayload } from "./chat-message-list"
`, prefix),
        }
      ],
    },
    "chat-header": {
      name: "chat-header",
      description: "Chat window header with assignment dropdown and resolve button",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "badge",
            "tag",
            "avatar",
            "dropdown-menu",
            "tooltip"
      ],
      isMultiFile: true,
      directory: "chat-header",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-header.tsx",
      files: [
        {
          name: "assignment-dropdown.tsx",
          content: prefixTailwindClasses(`import { useState } from "react"
import { Search, ChevronDown, Bot, Users } from "lucide-react"
import { Button } from "../../button"
import { Avatar } from "../../avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../dropdown-menu"
import { useChatContext } from "../chat-provider"

export interface AssignmentDropdownProps {
  defaultAgent?: string
}

function AssignmentDropdown({ defaultAgent }: AssignmentDropdownProps) {
  const { assignees, assignChat } = useChatContext()

  // Resolve agent name to assignee id
  const resolvedDefault = defaultAgent
    ? assignees.find((a) => a.label === defaultAgent)?.id || "unassigned"
    : "unassigned"
  const [value, setValue] = useState(resolvedDefault)
  const [searchQuery, setSearchQuery] = useState("")

  const bots = assignees.filter((a) => a.type === "bot")
  const agents = assignees.filter((a) => a.type === "agent")

  const q = searchQuery.toLowerCase()
  const filteredBots = bots.filter((b) => b.label.toLowerCase().includes(q))
  const filteredAgents = agents.filter((a) =>
    a.label.toLowerCase().includes(q)
  )

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    assignChat(newValue)
  }

  return (
    <DropdownMenu onOpenChange={() => setSearchQuery("")}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="truncate">
            {value === "unassigned"
              ? "Unassigned"
              : assignees.find((a) => a.id === value)?.label || value}
          </span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 border-b border-solid border-semantic-border-layout"
          onClick={(e) => e.stopPropagation()}
        >
          <Search className="size-4 text-semantic-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search agents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 text-sm bg-transparent placeholder:text-semantic-text-muted focus:outline-none"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={handleValueChange}
          className="max-h-[240px] overflow-y-auto"
        >
          {/* Unassigned */}
          <DropdownMenuRadioItem
            value="unassigned"
            disabled={value !== "unassigned"}
          >
            Unassigned
          </DropdownMenuRadioItem>

          {/* Bots */}
          {filteredBots.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1.5">
                <Bot className="size-3.5" />
                Bots
              </DropdownMenuLabel>
              {filteredBots.map((bot) => (
                <DropdownMenuRadioItem key={bot.id} value={bot.id}>
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-semantic-bg-ui flex items-center justify-center shrink-0">
                      <Bot className="size-3 text-semantic-text-muted" />
                    </div>
                    {bot.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuGroup>
          )}

          {/* Agents */}
          {filteredAgents.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                Agents
              </DropdownMenuLabel>
              {filteredAgents.map((agent) => (
                <DropdownMenuRadioItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <Avatar name={agent.label} size="xs" />
                    {agent.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuGroup>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
AssignmentDropdown.displayName = "AssignmentDropdown"

export { AssignmentDropdown }
`, prefix),
        },
        {
          name: "resolve-button.tsx",
          content: prefixTailwindClasses(`import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import { useChatContext } from "../chat-provider"

function ResolveButton() {
  const { resolveChat } = useChatContext()
  const [resolved, setResolved] = useState(false)

  const handleClick = () => {
    setResolved((prev) => !prev)
    resolveChat()
  }

  return (
    <Button
      variant={resolved ? "success" : "default"}
      leftIcon={
        <Check
          className={cn(
            "size-[18px] transition-transform duration-200",
            resolved && "scale-110"
          )}
        />
      }
      onClick={handleClick}
      className="transition-all duration-200"
    >
      {resolved ? "Resolved" : "Resolve"}
    </Button>
  )
}
ResolveButton.displayName = "ResolveButton"

export { ResolveButton }
`, prefix),
        },
        {
          name: "chat-header.tsx",
          content: prefixTailwindClasses(`import { Clock } from "lucide-react"
import { Badge } from "../../badge"
import { Tag } from "../../tag"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "../../tooltip"
import { useChatContext } from "../chat-provider"
import { AssignmentDropdown } from "./assignment-dropdown"
import { ResolveButton } from "./resolve-button"

function ChatHeader() {
  const {
    chats,
    selectedChatId,
    channels,
    showContactDetails,
    setShowContactDetails,
  } = useChatContext()

  const selectedChat = chats.find((c) => c.id === selectedChatId)

  if (!selectedChat) return null

  return (
    <div className="flex items-center justify-between px-4 h-[72px] bg-white border-b border-solid border-semantic-border-layout shrink-0">
      <div className="flex items-center gap-3">
        <button
          aria-label={\`View contact details for \${selectedChat.name}\`}
          onClick={() => setShowContactDetails(!showContactDetails)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-border-focus focus-visible:outline-offset-2 rounded"
        >
          <span className="text-[18px] font-semibold text-semantic-text-primary">
            {selectedChat.name}
          </span>
        </button>
        {selectedChat.channel &&
          (() => {
            const ch = channels.find(
              (c) => c.badge === selectedChat.channel
            )
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" size="sm">
                    {selectedChat.channel}
                  </Badge>
                </TooltipTrigger>
                {ch && (
                  <TooltipContent side="bottom">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-white">
                        {ch.name}
                      </span>
                      <span className="text-[12px] text-semantic-text-muted">
                        {ch.phone}
                      </span>
                    </div>
                    <TooltipArrow />
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })()}
        {selectedChat.slaTimer && (
          <Tag variant="warning" size="sm">
            <Clock className="size-3 shrink-0" />
            {selectedChat.slaTimer}
          </Tag>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Assignment Dropdown */}
        <AssignmentDropdown defaultAgent={selectedChat.agentName} />
        {/* Resolve Button */}
        <ResolveButton />
      </div>
    </div>
  )
}
ChatHeader.displayName = "ChatHeader"

export { ChatHeader }
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatHeader } from "./chat-header"
export { AssignmentDropdown } from "./assignment-dropdown"
export { ResolveButton } from "./resolve-button"
`, prefix),
        }
      ],
    },
    "chat-input": {
      name: "chat-input",
      description: "Chat composer with canned messages, attachments, and keyboard navigation",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "tooltip",
            "dropdown-menu",
            "confirmation-modal",
            "chat-composer"
      ],
      isMultiFile: true,
      directory: "chat-input",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-input.tsx",
      files: [
        {
          name: "composer-attachment-preview.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { X, Play, File } from "lucide-react"
import { ConfirmationModal } from "../../confirmation-modal"

export interface ComposerAttachmentPreviewProps {
  /** The file to preview before sending */
  file: File
  /** Called when the user confirms removal of the attachment */
  onRemove: () => void
}

/**
 * ComposerAttachmentPreview shows a preview of an attached file (image, video,
 * audio, or document) inside the chat composer. Includes a remove button that
 * triggers a confirmation modal before actually discarding the attachment.
 */
function ComposerAttachmentPreview({ file, onRemove }: ComposerAttachmentPreviewProps) {
  const url = React.useMemo(() => URL.createObjectURL(file), [file])
  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")
  const [showConfirm, setShowConfirm] = React.useState(false)

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="relative border-b border-solid border-semantic-border-layout">
      <button
        aria-label="Remove attachment"
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <X className="size-4 text-white" />
      </button>
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Remove attachment?"
        description={\`"\${file.name}" will be removed from this message.\`}
        variant="destructive"
        confirmButtonText="Remove"
        onConfirm={() => {
          onRemove()
          setShowConfirm(false)
        }}
      />
      {isImage ? (
        <div className="h-[200px] bg-semantic-bg-ui">
          <img src={url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      ) : isVideo ? (
        <div className="relative bg-black h-[200px]">
          <video src={url} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="size-7 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      ) : isAudio ? (
        <div className="bg-semantic-bg-ui px-4 py-6 flex items-center gap-3 h-[80px]">
          <div className="size-10 rounded-full bg-semantic-primary flex items-center justify-center shrink-0">
            <Play className="size-5 text-white fill-white ml-0.5" />
          </div>
          <div className="flex-1 h-1 bg-semantic-border-layout rounded-full">
            <div className="w-0 h-full bg-semantic-primary rounded-full" />
          </div>
          <span className="text-[12px] text-semantic-text-muted tabular-nums shrink-0">0:00</span>
        </div>
      ) : (
        /* PDF / other document preview */
        <div className="bg-semantic-bg-ui flex flex-col items-center justify-center h-[200px]">
          <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
            <File className="size-8 text-semantic-text-muted" />
          </div>
          <p className="text-[14px] font-semibold text-semantic-text-primary truncate max-w-[80%] px-4 m-0">{file.name}</p>
          <p className="text-[12px] text-semantic-text-muted mt-1 m-0">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      )}
    </div>
  )
}

export { ComposerAttachmentPreview }
`, prefix),
        },
        {
          name: "canned-messages.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import type { CannedMessage } from "../chat-types"

export interface CannedMessagesDropdownProps {
  /** The search query (text after the "/" trigger) */
  query: string
  /** Index of the keyboard-highlighted item (-1 = none) */
  activeIndex: number
  /** Called when the user selects a canned message (click or Enter) */
  onSelect: (body: string) => void
  /** The list of canned messages to filter and display */
  cannedMessages: CannedMessage[]
}

/**
 * Highlights the first occurrence of \`query\` within \`text\` using a bold span.
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/**
 * CannedMessagesDropdown renders a floating list of canned message suggestions
 * above the chat composer. It filters messages by shortcut/body matching and
 * supports keyboard navigation (highlighted via \`activeIndex\`).
 *
 * Shown when the composer text starts with "/".
 */
function CannedMessagesDropdown({
  query,
  activeIndex,
  onSelect,
  cannedMessages,
}: CannedMessagesDropdownProps) {
  const filtered = React.useMemo(
    () =>
      cannedMessages.filter(
        (cm) =>
          cm.shortcut.toLowerCase().includes(query.toLowerCase()) ||
          cm.body.toLowerCase().includes(query.toLowerCase())
      ),
    [cannedMessages, query]
  )

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-solid border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out">
        <div className="px-4 py-3 text-[13px] text-semantic-text-muted text-center">
          No canned messages found
        </div>
      </div>
    )
  }

  return (
    <div
      id="canned-listbox"
      role="listbox"
      aria-label="Canned messages"
      className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-solid border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out"
    >
      {filtered.map((cm, i) => (
        <button
          type="button"
          role="option"
          id={\`canned-\${cm.id}\`}
          aria-selected={activeIndex === i}
          key={cm.id}
          className={\`px-4 py-3 hover:bg-semantic-bg-ui cursor-pointer transition-colors text-left w-full \${activeIndex === i ? "bg-semantic-bg-ui" : ""} \${i < filtered.length - 1 ? "border-b border-solid border-semantic-border-layout" : ""}\`}
          onClick={() => onSelect(cm.body)}
        >
          <p className="text-[13px] font-semibold text-semantic-text-primary m-0">
            {highlightMatch(cm.shortcut, query)}
          </p>
          <p className="text-[13px] text-semantic-text-muted truncate m-0 mt-0.5">
            {highlightMatch(cm.body, query)}
          </p>
        </button>
      ))}
    </div>
  )
}

export { CannedMessagesDropdown, highlightMatch }
`, prefix),
        },
        {
          name: "chat-input.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { Send, Paperclip, Smile, LayoutGrid, Image as LucideImage, Play, Music, FileText } from "lucide-react"
import { Button } from "../../button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../../dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../tooltip"
import { ChatComposer } from "../../chat-composer"
import { ComposerAttachmentPreview } from "./composer-attachment-preview"
import { CannedMessagesDropdown } from "./canned-messages"
import { useChatContext } from "../chat-provider"
import type { CannedMessage } from "../chat-types"

export interface ChatInputProps {
  /** Whether the chat is expired / resolved (shows template prompt) */
  expired?: boolean
  /** Message shown in the expired state */
  expiredMessage?: string
}

/**
 * ChatInput is the full message input area that wraps ChatComposer with:
 * - Canned message dropdown (triggered by typing "/")
 * - Attachment upload (image, video, audio, document) via dropdown
 * - Templates button
 * - Emoji button
 * - Reply-to bar with scroll-to-original
 * - Attachment preview before sending
 *
 * It manages its own local state for composerText, cannedIndex, attachment,
 * replyingTo, and the hidden file input ref.
 */
function ChatInput({ expired = false, expiredMessage }: ChatInputProps) {
  const { sendMessage, cannedMessages, setShowTemplateModal } = useChatContext()

  const [composerText, setComposerText] = React.useState("")
  const [cannedIndex, setCannedIndex] = React.useState(-1)
  const [composerAttachment, setComposerAttachment] = React.useState<File | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<{ messageId: string; sender: string; text: string } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  /** Filter canned messages based on the current "/" query */
  const cannedQuery = composerText.startsWith("/") ? composerText.slice(1).toLowerCase() : ""
  const filteredCanned = React.useMemo(
    () =>
      cannedMessages.filter(
        (cm: CannedMessage) =>
          cm.shortcut.toLowerCase().includes(cannedQuery) ||
          cm.body.toLowerCase().includes(cannedQuery)
      ),
    [cannedMessages, cannedQuery]
  )

  /** Handle keyboard events for canned messages and Enter-to-send */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (when not in canned menu)
    if (e.key === "Enter" && !e.shiftKey && !composerText.startsWith("/")) {
      e.preventDefault()
      if (composerText.trim()) {
        sendMessage(composerText.trim(), composerAttachment ?? undefined, replyingTo?.messageId)
        setComposerText("")
        setComposerAttachment(null)
        setReplyingTo(null)
      }
      return
    }
    // Canned message keyboard navigation
    if (composerText.startsWith("/")) {
      if (filteredCanned.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCannedIndex((prev) => (prev + 1) % filteredCanned.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setCannedIndex((prev) => (prev <= 0 ? filteredCanned.length - 1 : prev - 1))
      } else if (e.key === "Enter" && cannedIndex >= 0 && cannedIndex < filteredCanned.length) {
        e.preventDefault()
        setComposerText(filteredCanned[cannedIndex].body)
        setCannedIndex(-1)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setComposerText("")
        setCannedIndex(-1)
      }
    }
  }

  /** Handle send action */
  const handleSend = () => {
    if (composerText.trim()) {
      sendMessage(composerText.trim(), composerAttachment ?? undefined, replyingTo?.messageId)
    }
    setComposerText("")
    setComposerAttachment(null)
    setReplyingTo(null)
    setCannedIndex(-1)
  }

  /** Scroll to and highlight the original message being replied to */
  const handleReplyClick = () => {
    if (replyingTo) {
      const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      const el = document.getElementById(\`msg-\${replyingTo.messageId}\`)
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" })
        el.classList.add("ring-2", "ring-semantic-border-accent", "ring-offset-2")
        setTimeout(() => el.classList.remove("ring-2", "ring-semantic-border-accent", "ring-offset-2"), 2000)
      }
    }
  }

  const showCannedDropdown = composerText.startsWith("/") && !expired

  return (
    <div className="relative">
      {/* Canned message count live region */}
      <div className="sr-only" aria-live="polite">
        {composerText.startsWith("/")
          ? \`\${filteredCanned.length} canned message\${filteredCanned.length !== 1 ? "s" : ""} found\`
          : ""}
      </div>

      {/* Canned messages dropdown (above composer) */}
      {showCannedDropdown && (
        <CannedMessagesDropdown
          query={cannedQuery}
          activeIndex={cannedIndex}
          onSelect={(body) => {
            setComposerText(body)
            setCannedIndex(-1)
          }}
          cannedMessages={cannedMessages}
        />
      )}

      <ChatComposer
        sendLabel={<><Send className="size-4" />Send</>}
        expired={expired}
        expiredMessage={expiredMessage}
        onTemplateClick={() => setShowTemplateModal(true)}
        value={composerText}
        onChange={(val) => {
          setComposerText(val)
          setCannedIndex(-1)
        }}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        placeholder="Type '/' for canned message"
        reply={
          replyingTo
            ? {
                sender: replyingTo.sender,
                message: replyingTo.text,
                messageId: replyingTo.messageId,
              }
            : undefined
        }
        onDismissReply={() => setReplyingTo(null)}
        onReplyClick={handleReplyClick}
        attachment={
          composerAttachment ? (
            <ComposerAttachmentPreview
              file={composerAttachment}
              onRemove={() => setComposerAttachment(null)}
            />
          ) : undefined
        }
        leftActions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Paperclip className="size-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuLabel>Attach Media</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <LucideImage className="size-4" /> Image
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Play className="size-4" /> Video
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "audio/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Music className="size-4" /> Audio
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <FileText className="size-4" /> Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowTemplateModal(true)}>
                  <LayoutGrid className="size-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="m-0">Templates</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </>
        }
        rightActions={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Smile className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="m-0">Emoji</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        }
      />

      {/* Hidden file input for attachment uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setComposerAttachment(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
ChatInput.displayName = "ChatInput"

export { ChatInput }
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatInput } from "./chat-input"
export type { ChatInputProps } from "./chat-input"
export { ComposerAttachmentPreview } from "./composer-attachment-preview"
export type { ComposerAttachmentPreviewProps } from "./composer-attachment-preview"
export { CannedMessagesDropdown } from "./canned-messages"
export type { CannedMessagesDropdownProps } from "./canned-messages"
`, prefix),
        }
      ],
    },
    "chat-template-modal": {
      name: "chat-template-modal",
      description: "Template selection modal with variable mapping, media upload, and live preview",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "dialog",
            "select-field",
            "tabs",
            "text-field",
            "avatar",
            "spinner",
            "confirmation-modal"
      ],
      isMultiFile: true,
      directory: "chat-template-modal",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-template-modal.tsx",
      files: [
        {
          name: "template-helpers.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { CheckCheck } from "lucide-react"
import { Avatar } from "../../avatar"
import { TextField } from "../../text-field"

/* ── resolveVars ── */
export function resolveVars(
  text: string,
  vars: Record<string, string>,
): React.ReactNode {
  const parts = text.split(/(\\{\\{[^}]+\\}\\})/g)
  return parts.map((part, i) =>
    /^\\{\\{[^}]+\\}\\}$/.test(part) ? (
      <span key={i} className="text-semantic-text-link font-medium">
        {vars[part] || part}
      </span>
    ) : (
      part
    ),
  )
}

/* ── DeliveryRow ── */
export function DeliveryRow() {
  return (
    <div className="flex items-center justify-end gap-1.5 mt-1.5">
      <CheckCheck className="size-4 text-semantic-text-muted" />
      <span className="text-[12px] text-semantic-text-muted">Delivered</span>
      <span className="text-[10px] font-bold text-semantic-text-muted">
        &bull;
      </span>
      <span className="text-[12px] text-semantic-text-muted">2:30 PM</span>
      <Avatar initials="AS" size="xs" variant="filled" />
    </div>
  )
}

/* ── VarRow ── */
export function VarRow({
  varName,
  value,
  onChange,
}: {
  varName: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[13px] text-semantic-text-secondary w-[148px] shrink-0 truncate font-mono">
        {varName}
      </span>
      <TextField
        wrapperClassName="flex-1"
        placeholder="Enter value"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

/* ── VarSectionLabel ── */
export function VarSectionLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="m-0 text-[11px] font-semibold text-semantic-text-muted uppercase tracking-[0.4px] mt-4 mb-1">
      {children}
    </p>
  )
}
`, prefix),
        },
        {
          name: "template-preview.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import {
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
} from "lucide-react"
import type { TemplateDef, VarMap } from "../chat-types"
import { resolveVars, DeliveryRow } from "./template-helpers"

/* ── TemplatePreviewEmpty ── */
export function TemplatePreviewEmpty({
  illustrationSrc,
}: {
  illustrationSrc?: string
}) {
  return (
    <div className="flex flex-col items-center gap-5 pt-20 pb-8 px-6">
      {illustrationSrc ? (
        <img src={illustrationSrc} alt="" className="size-[140px]" />
      ) : (
        <div className="size-[140px] rounded-2xl bg-semantic-bg-ui flex items-center justify-center">
          <FileSpreadsheet className="size-16 text-semantic-text-muted" />
        </div>
      )}
      <p className="m-0 text-[18px] font-semibold text-semantic-text-primary">
        No template selected
      </p>
    </div>
  )
}

/* ── TemplateCarouselPreview ── */
export function TemplateCarouselPreview({
  template,
  varValues,
}: {
  template: TemplateDef
  varValues: VarMap
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(
    (template.cards?.length || 0) > 1,
  )

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  const scroll =
    (dir: "left" | "right") => (e: React.MouseEvent) => {
      e.stopPropagation()
      scrollRef.current?.scrollBy({
        left: dir === "right" ? 272 : -272,
        behavior: "smooth",
      })
      setTimeout(updateScrollState, 350)
    }

  return (
    <div className="bg-semantic-info-surface border border-solid border-semantic-border-layout rounded overflow-hidden w-full max-w-[360px]">
      {/* Body text */}
      <div className="px-3 pt-3">
        <p className="text-[14px] leading-5 text-semantic-text-primary m-0">
          {resolveVars(template.body, varValues)}
        </p>
      </div>

      {/* Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {(template.cards || []).map((card, i) => {
            const imgUrl = template.cardImages?.[i]
            return (
              <div
                key={card.cardIndex}
                className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
                style={{ width: 260 }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={\`Card \${card.cardIndex}\`}
                    className="w-full object-cover"
                    style={{ height: 200 }}
                  />
                ) : (
                  <div
                    className="w-full bg-semantic-bg-ui flex items-center justify-center"
                    style={{ height: 200 }}
                  >
                    <FileSpreadsheet className="size-10 text-semantic-text-muted" />
                  </div>
                )}
                <div className="px-3 pt-2.5 pb-2">
                  <p className="text-[14px] font-semibold text-semantic-text-primary m-0">
                    {card.bodyVariables.length > 0
                      ? resolveVars(card.bodyVariables[0], varValues)
                      : \`Card \${card.cardIndex}\`}
                  </p>
                  {card.bodyVariables.slice(1).map((v) => (
                    <p
                      key={v}
                      className="text-[13px] text-semantic-text-muted m-0 mt-0.5"
                    >
                      {resolveVars(v, varValues)}
                    </p>
                  ))}
                </div>
                {card.buttonVariables.map((v, j) => (
                  <button
                    key={j}
                    className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <ExternalLink className="size-4" />
                    {resolveVars(v, varValues) || "View details"}
                  </button>
                ))}
                {card.buttonVariables.length === 0 && (
                  <button
                    className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <Reply className="size-4" />
                    Interested
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {canScrollLeft && (
          <button
            aria-label="Scroll template preview left"
            onClick={scroll("left")}
            className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronLeft className="size-4 text-semantic-text-primary" />
          </button>
        )}
        {canScrollRight && (
          <button
            aria-label="Scroll template preview right"
            onClick={scroll("right")}
            className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronRight className="size-4 text-semantic-text-primary" />
          </button>
        )}
      </div>

      {/* Footer + delivery */}
      <div className="px-3 pb-2">
        {template.footer && (
          <p className="text-[12px] text-semantic-text-muted m-0 mb-1">
            {template.footer}
          </p>
        )}
        <DeliveryRow />
      </div>
    </div>
  )
}

/* ── TemplatePreviewBubble ── */
export function TemplatePreviewBubble({
  template,
  varValues,
}: {
  template: TemplateDef
  varValues: VarMap
}) {
  if (template.type === "text") {
    return (
      <div className="bg-semantic-info-surface rounded-lg px-3 pt-3 pb-2 max-w-[280px] w-full">
        <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">
          {resolveVars(template.body, varValues)}
        </p>
        {template.button && (
          <div className="border-t border-solid border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
            <Reply className="size-3.5" />
            {template.button}
          </div>
        )}
        <DeliveryRow />
      </div>
    )
  }

  if (template.type === "image") {
    return (
      <div className="bg-semantic-info-surface rounded-lg overflow-hidden max-w-[280px] w-full">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=560&h=320&fit=crop"
          alt="Template image"
          className="w-full h-[160px] object-cover"
        />
        <div className="px-3 pt-2.5 pb-2">
          <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">
            {resolveVars(template.body, varValues)}
          </p>
          {template.button && (
            <div className="border-t border-solid border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
              <Reply className="size-3.5" />
              {template.button}
            </div>
          )}
          <DeliveryRow />
        </div>
      </div>
    )
  }

  if (template.type === "carousel") {
    return (
      <TemplateCarouselPreview template={template} varValues={varValues} />
    )
  }

  return null
}
`, prefix),
        },
        {
          name: "variables-tab.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import type { TemplateDef, VarMap, CardVarMap } from "../chat-types"
import { VarRow, VarSectionLabel } from "./template-helpers"

export function VariablesTab({
  template,
  varValues,
  setVarValues,
  cardVarValues,
  setCardVarValues,
}: {
  template: TemplateDef
  varValues: VarMap
  setVarValues: React.Dispatch<React.SetStateAction<VarMap>>
  cardVarValues: CardVarMap
  setCardVarValues: React.Dispatch<React.SetStateAction<CardVarMap>>
}) {
  const hasNoVars =
    template.bodyVariables.length === 0 &&
    (template.cards ?? []).every(
      (c) => c.bodyVariables.length === 0 && c.buttonVariables.length === 0,
    )

  if (hasNoVars) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">
          No variables
        </p>
        <p className="m-0 text-[13px] text-semantic-text-muted">
          This template has no dynamic variables to fill in.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-3">
      {/* Top-level body variables */}
      {template.bodyVariables.length > 0 && (
        <>
          <VarSectionLabel>Body variables</VarSectionLabel>
          {template.bodyVariables.map((v) => (
            <VarRow
              key={v}
              varName={v}
              value={varValues[v] || ""}
              onChange={(e) =>
                setVarValues((p) => ({ ...p, [v]: e.target.value }))
              }
            />
          ))}
        </>
      )}

      {/* Per-card variables (carousel) */}
      {template.cards?.map((card) => (
        <div key={card.cardIndex}>
          <div className="flex items-center gap-3 mt-5 mb-1">
            <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">
              Card {card.cardIndex}
            </span>
            <div className="flex-1 h-px bg-semantic-border-layout" />
          </div>
          {card.bodyVariables.length > 0 && (
            <>
              <VarSectionLabel>Body variables</VarSectionLabel>
              {card.bodyVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.body?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: {
                          ...(p[card.cardIndex]?.body || {}),
                          [v]: e.target.value,
                        },
                        button: p[card.cardIndex]?.button || {},
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
          {card.buttonVariables.length > 0 && (
            <>
              <VarSectionLabel>Button variables</VarSectionLabel>
              {card.buttonVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.button?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: p[card.cardIndex]?.body || {},
                        button: {
                          ...(p[card.cardIndex]?.button || {}),
                          [v]: e.target.value,
                        },
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
`, prefix),
        },
        {
          name: "media-tab.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { Trash2, Upload } from "lucide-react"
import type { TemplateDef } from "../chat-types"
import { Button } from "../../button"

export function MediaTab({
  template,
  uploadedMedia,
  setUploadedMedia,
  onDeleteMedia,
}: {
  template: TemplateDef
  uploadedMedia: Record<number, File | null>
  setUploadedMedia: React.Dispatch<
    React.SetStateAction<Record<number, File | null>>
  >
  onDeleteMedia: (cardIndex: number) => void
}) {
  const cards = template.cards || [
    { cardIndex: 1, bodyVariables: [], buttonVariables: [] },
  ]

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {cards.map((card) => (
        <div key={card.cardIndex} className="mb-5">
          {template.type === "carousel" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">
                Card {card.cardIndex}
              </span>
              <div className="flex-1 h-px bg-semantic-border-layout" />
            </div>
          )}
          {uploadedMedia[card.cardIndex] ? (
            <div className="flex items-center gap-3 px-3 py-2.5 border border-solid border-semantic-border-layout rounded">
              <div className="size-10 shrink-0 rounded overflow-hidden bg-semantic-bg-ui flex items-center justify-center">
                <img
                  src={URL.createObjectURL(uploadedMedia[card.cardIndex]!)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-semibold text-semantic-text-primary truncate">
                  {uploadedMedia[card.cardIndex]!.name}
                </p>
                <p className="m-0 text-[12px] text-semantic-text-muted">
                  {(
                    uploadedMedia[card.cardIndex]!.size /
                    (1024 * 1024)
                  ).toFixed(1)}{" "}
                  MB size
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDeleteMedia(card.cardIndex)}
                className="shrink-0 hover:bg-semantic-error-surface text-semantic-error-primary"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 px-4 py-5 border border-dashed border-semantic-border-layout rounded cursor-pointer hover:bg-semantic-bg-hover transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                aria-label={\`Upload media for card \${card.cardIndex}\`}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file)
                    setUploadedMedia((p) => ({
                      ...p,
                      [card.cardIndex]: file,
                    }))
                }}
              />
              <div className="flex items-center gap-2 text-[14px] font-semibold text-semantic-text-primary">
                <Upload className="size-4" />
                Upload from device
              </div>
              <p className="m-0 text-[13px] text-semantic-text-muted">
                or drag and drop file here
              </p>
              <p className="m-0 text-[11px] text-semantic-text-muted">
                Supported file types: JPG/PNG with 5 MB size
              </p>
            </label>
          )}
        </div>
      ))}
    </div>
  )
}
`, prefix),
        },
        {
          name: "chat-template-modal.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { FileSpreadsheet, X, Send, Eye } from "lucide-react"
import type {
  TemplateDef,
  TemplateCategory,
  VarMap,
  CardVarMap,
} from "../chat-types"
import { useChatContext } from "../chat-provider"
import { Button } from "../../button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../dialog"
import { SelectField } from "../../select-field"
import { Tabs, TabsList, TabsTrigger } from "../../tabs"
import { ConfirmationModal } from "../../confirmation-modal"
import { TemplatePreviewEmpty, TemplatePreviewBubble } from "./template-preview"
import { VariablesTab } from "./variables-tab"
import { MediaTab } from "./media-tab"

const templateCategoryOptions: { id: TemplateCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "utility", label: "Utility" },
  { id: "authentication", label: "Authentication" },
]

export interface ChatTemplateModalProps {
  /** Optional illustration image source for the empty preview state */
  illustrationSrc?: string
  /** Optional callback when "Create new" template link is clicked */
  onCreateNew?: () => void
}

export function ChatTemplateModal({
  illustrationSrc,
  onCreateNew,
}: ChatTemplateModalProps) {
  const { templates, sendTemplate, setShowTemplateModal } = useChatContext()

  const [selectedCategory, setSelectedCategory] =
    React.useState<TemplateCategory>("all")
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<TemplateDef | null>(null)
  const [activeTab, setActiveTab] = React.useState<"variables" | "media">(
    "variables",
  )
  const [tabSlideDir, setTabSlideDir] = React.useState<"left" | "right">(
    "right",
  )
  const [varValues, setVarValues] = React.useState<VarMap>({})
  const [cardVarValues, setCardVarValues] = React.useState<CardVarMap>({})
  const [uploadedMedia, setUploadedMedia] = React.useState<
    Record<number, File | null>
  >({})
  const [mediaDeleteIndex, setMediaDeleteIndex] = React.useState<number | null>(
    null,
  )

  const handleSelectTemplate = (t: TemplateDef) => {
    setSelectedTemplate(t)
    setVarValues({})
    setCardVarValues({})
    setUploadedMedia({})
    setActiveTab("variables")
  }

  const handleClose = () => setShowTemplateModal(false)

  const handleSend = () => {
    if (selectedTemplate) {
      sendTemplate(selectedTemplate.id, varValues, cardVarValues)
    }
    handleClose()
  }

  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) handleClose()
        }}
      >
        <DialogContent
          size="xl"
          className="max-w-[1100px] h-[88vh] max-h-[800px] p-0 gap-0 flex flex-col"
          hideCloseButton
        >
          <DialogDescription className="sr-only">
            Select from pre-approved message templates
          </DialogDescription>

          {/* ── Header: title + close ── */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-solid border-semantic-border-layout shrink-0">
            <div>
              <DialogTitle>Select Template</DialogTitle>
              <p className="text-[13px] text-semantic-text-muted mt-0.5 m-0">
                Select from pre-approved message templates
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="size-[18px]" />
            </Button>
          </div>

          {/* ── Body: LEFT (selectors + variables) | RIGHT (preview) ── */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* ── Left column ── */}
            <div className="flex-[1.25] border-r border-solid border-semantic-border-layout flex flex-col min-h-0">
              {/* Selectors section */}
              <div className="px-5 pt-5 pb-4 border-b border-solid border-semantic-border-layout shrink-0">
                <div className="flex items-start gap-3">
                  {/* Category */}
                  <div className="w-[160px] shrink-0">
                    <SelectField
                      label="Category"
                      options={templateCategoryOptions.map((c) => ({
                        value: c.id,
                        label: c.label,
                      }))}
                      value={selectedCategory}
                      onValueChange={(v) => {
                        setSelectedCategory(v as TemplateCategory)
                        setSelectedTemplate(null)
                      }}
                    />
                  </div>

                  {/* Template selector */}
                  <div className="flex-1 min-w-0">
                    <SelectField
                      label="Template"
                      required
                      searchable
                      searchPlaceholder="Search templates..."
                      placeholder="Select a template"
                      options={templates
                        .filter(
                          (t) =>
                            selectedCategory === "all" ||
                            t.category === selectedCategory,
                        )
                        .map((t) => ({ value: t.id, label: t.name }))}
                      value={selectedTemplate?.id ?? ""}
                      onValueChange={(id) => {
                        const t = templates.find((tmpl) => tmpl.id === id)
                        if (t) handleSelectTemplate(t)
                      }}
                    />
                  </div>
                </div>
                <p className="m-0 text-[13px] text-semantic-text-muted mt-2">
                  Template not found?{" "}
                  <button
                    type="button"
                    className="text-semantic-text-link underline font-medium hover:text-semantic-text-link bg-transparent border-none p-0 cursor-pointer text-[13px]"
                    onClick={onCreateNew}
                  >
                    Create new
                  </button>
                </p>
              </div>

              {/* Variables / Media section */}
              {selectedTemplate ? (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => {
                      const tab = v as "variables" | "media"
                      setTabSlideDir(tab === "media" ? "right" : "left")
                      setActiveTab(tab)
                    }}
                  >
                    <TabsList className="shrink-0 px-5">
                      <TabsTrigger value="variables">
                        Template variables
                      </TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div
                    key={activeTab}
                    className={\`animate-in \${tabSlideDir === "right" ? "slide-in-from-right-3" : "slide-in-from-left-3"} fade-in duration-200 ease-out flex flex-col flex-1 min-h-0 overflow-hidden\`}
                  >
                    {activeTab === "variables" ? (
                      <VariablesTab
                        template={selectedTemplate}
                        varValues={varValues}
                        setVarValues={setVarValues}
                        cardVarValues={cardVarValues}
                        setCardVarValues={setCardVarValues}
                      />
                    ) : (
                      <MediaTab
                        template={selectedTemplate}
                        uploadedMedia={uploadedMedia}
                        setUploadedMedia={setUploadedMedia}
                        onDeleteMedia={(cardIndex) =>
                          setMediaDeleteIndex(cardIndex)
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="size-14 rounded-xl bg-semantic-bg-ui flex items-center justify-center">
                    <FileSpreadsheet className="size-7 text-semantic-text-muted" />
                  </div>
                  <div>
                    <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">
                      No template selected
                    </p>
                    <p className="m-0 text-[13px] text-semantic-text-muted mt-0.5">
                      Choose a template above to map variables
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column: preview + send button ── */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-5 pt-5 pb-3 shrink-0 border-b border-solid border-semantic-border-layout flex items-center gap-2">
                <Eye className="size-[14px] text-semantic-text-secondary" />
                <p className="m-0 text-[12px] font-semibold tracking-wide uppercase text-semantic-text-secondary">
                  Preview
                </p>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 bg-semantic-bg-ui">
                {selectedTemplate ? (
                  <div className="w-full flex flex-col items-end">
                    <TemplatePreviewBubble
                      template={selectedTemplate}
                      varValues={varValues}
                    />
                  </div>
                ) : (
                  <TemplatePreviewEmpty illustrationSrc={illustrationSrc} />
                )}
              </div>
              <div className="px-5 py-4 shrink-0 border-t-2 border-solid border-semantic-border-layout bg-white shadow-[0_-4px_12px_0_rgba(10,13,18,0.06)]">
                <Button
                  onClick={handleSend}
                  disabled={!selectedTemplate}
                  className="w-full gap-2"
                >
                  Send Template
                  <Send className="size-[16px]" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={mediaDeleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setMediaDeleteIndex(null)
        }}
        title="Remove uploaded media?"
        description="This media file will be removed from the template."
        variant="destructive"
        confirmButtonText="Remove"
        onConfirm={() => {
          if (mediaDeleteIndex !== null) {
            setUploadedMedia((p) => ({ ...p, [mediaDeleteIndex]: null }))
          }
          setMediaDeleteIndex(null)
        }}
      />
    </>
  )
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatTemplateModal } from "./chat-template-modal"
export type { ChatTemplateModalProps } from "./chat-template-modal"
`, prefix),
        }
      ],
    },
    "chat-contact-panel": {
      name: "chat-contact-panel",
      description: "Contact details slide-out panel with view and edit modes",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-provider",
            "button",
            "text-field",
            "switch",
            "tag",
            "dropdown-menu",
            "accordion",
            "confirmation-modal",
            "panel"
      ],
      isMultiFile: true,
      directory: "chat-contact-panel",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-contact-panel.tsx",
      files: [
        {
          name: "chat-contact-panel.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { Check, ChevronDown, Info, Pencil, User } from "lucide-react"
import { Button } from "../../button"
import { TextField } from "../../text-field"
import { Switch } from "../../switch"
import { Tag } from "../../tag"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../dropdown-menu"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../accordion"
import { ConfirmationModal } from "../../confirmation-modal"
import { Panel } from "../../panel"
import { useChatContext } from "../chat-provider"
import type { ContactDetails } from "../chat-types"

/* ── ChatContactPanel ── */

export interface ChatContactPanelProps {
  /** Contact name to display (derived from selected chat by parent) */
  name: string
}

export function ChatContactPanel({ name }: ChatContactPanelProps) {
  const {
    showContactDetails,
    setShowContactDetails,
    selectedChatId,
    transport,
  } = useChatContext()

  const [isEditing, setIsEditing] = React.useState(false)
  const [marketingOptIn, setMarketingOptIn] = React.useState(true)
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false)
  const [contactDetails, setContactDetails] =
    React.useState<ContactDetails | null>(null)

  // Fetch contact details when panel opens
  React.useEffect(() => {
    if (!showContactDetails || !selectedChatId) return

    let cancelled = false

    async function loadDetails() {
      try {
        const details = await transport.fetchContactDetails(selectedChatId!)
        if (!cancelled) {
          setContactDetails(details)
          setMarketingOptIn(details.marketingOptIn ?? true)
        }
      } catch {
        // silently ignore — panel shows placeholder data
      }
    }

    loadDetails()
    return () => {
      cancelled = true
    }
  }, [showContactDetails, selectedChatId, transport])

  // Reset editing state when panel closes
  React.useEffect(() => {
    if (!showContactDetails) {
      setIsEditing(false)
    }
  }, [showContactDetails])

  const handleClose = React.useCallback(() => {
    setIsEditing(false)
    setShowContactDetails(false)
  }, [setShowContactDetails])

  const displayName = contactDetails?.name ?? name
  const phone = contactDetails?.phone ?? "98765 43210"
  const email = contactDetails?.email ?? "email@example.com"
  const source = contactDetails?.source ?? "Chat"
  const tags = contactDetails?.tags ?? ["VIP Customer", "Enterprise"]
  const location = contactDetails?.location ?? "XYZ, place"
  const secondaryPhone = contactDetails?.secondaryPhone
  const dob = contactDetails?.dob

  const editFooter = (
    <>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => setShowDiscardConfirm(true)}
      >
        Cancel
      </Button>
      <Button
        className="flex-1"
        leftIcon={<Check className="size-4" />}
        onClick={() => setIsEditing(false)}
      >
        Save Details
      </Button>
    </>
  )

  return (
    <>
      <Panel
        open={showContactDetails}
        title={isEditing ? "Edit Details" : "Contact Details"}
        onClose={handleClose}
        footer={isEditing ? editFooter : undefined}
      >
        {isEditing ? (
          /* ── Edit View ── */
          <div key="edit" className="animate-in fade-in duration-200 ease-out">
            {/* Name field */}
            <div className="px-4 py-4 border-b border-solid border-semantic-border-layout">
              <TextField
                label="Name"
                required
                defaultValue={displayName}
                leftIcon={<User className="size-[18px]" />}
                size="sm"
                autoFocus
              />
            </div>

            <Accordion
              type="multiple"
              defaultValue={["basic", "custom"]}
              variant="bordered"
              className="rounded-none border-x-0"
            >
              {/* Basic Information */}
              <AccordionItem value="basic">
                <AccordionTrigger>
                  <span className="text-sm font-semibold text-semantic-text-primary">
                    Basic Information
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="edit-phone"
                        className="text-sm font-medium text-semantic-text-muted"
                      >
                        Phone
                        <span className="text-semantic-error-primary ml-0.5">
                          *
                        </span>
                      </label>
                      <div className="flex items-center border border-solid border-semantic-border-layout rounded bg-semantic-bg-ui opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                          <span className="text-sm">🇮🇳</span>
                          <span className="text-sm text-semantic-text-secondary">
                            +91
                          </span>
                        </div>
                        <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
                        <input
                          id="edit-phone"
                          type="tel"
                          defaultValue={phone}
                          disabled
                          aria-required="true"
                          className="flex-1 h-9 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent min-w-0"
                        />
                      </div>
                    </div>
                    <TextField
                      label="Email"
                      placeholder="Enter Email"
                      defaultValue={email !== "email@example.com" ? email : ""}
                      size="sm"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-semantic-text-muted">
                          Marketing Opt In
                        </span>
                        <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                      </div>
                      <Switch
                        checked={marketingOptIn}
                        onCheckedChange={setMarketingOptIn}
                      />
                    </div>
                    <TextField
                      label="Source"
                      value={source}
                      disabled
                      size="sm"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Custom Fields */}
              <AccordionItem value="custom">
                <AccordionTrigger>
                  <span className="text-sm font-semibold text-semantic-text-primary">
                    Custom Fields
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-semantic-text-muted">
                        Tags
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <div className="flex gap-1.5 flex-1 min-w-0">
                              {tags.map((tag) => (
                                <Tag key={tag} variant="default" size="sm">
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                            <ChevronDown className="size-4 shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[--radix-dropdown-menu-trigger-width]"
                        >
                          <DropdownMenuItem>VIP Customer</DropdownMenuItem>
                          <DropdownMenuItem>Enterprise</DropdownMenuItem>
                          <DropdownMenuItem>New Lead</DropdownMenuItem>
                          <DropdownMenuItem>Support</DropdownMenuItem>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {[
                      {
                        label: "Location",
                        placeholder: "Enter Location",
                        defaultValue: location,
                      },
                      {
                        label: "Secondary Phone",
                        placeholder: "XXXXX XXXXX",
                        defaultValue: secondaryPhone,
                      },
                      {
                        label: "DOB",
                        placeholder: "DD / MM / YYYY",
                        defaultValue: dob,
                      },
                    ].map(({ label, placeholder, defaultValue }) => (
                      <TextField
                        key={label}
                        label={label}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        size="sm"
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          /* ── View Mode (two-column layout) ── */
          <div key="view" className="animate-in fade-in duration-200 ease-out">
            {/* Name + Edit button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout">
              <span className="text-base font-semibold text-semantic-text-primary">
                {displayName}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </div>

            {/* Basic Information */}
            <div className="px-4 pt-3 pb-2 border-t border-solid border-semantic-border-layout">
              <span className="text-[13px] font-semibold text-semantic-text-primary">
                Basic Information
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Phone
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  🇮🇳 +91 {phone}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Email
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {email}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 flex items-center gap-1">
                  Marketing Opt In
                  <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                </span>
                <div className="flex-1">
                  <Switch
                    checked={marketingOptIn}
                    onCheckedChange={setMarketingOptIn}
                    size="sm"
                  />
                </div>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Source
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {source}
                </span>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="px-4 pt-3 pb-2 border-t border-solid border-semantic-border-layout">
              <span className="text-[13px] font-semibold text-semantic-text-primary">
                Custom Fields
              </span>
            </div>
            <div className="flex flex-col pb-2 border-b border-solid border-semantic-border-layout">
              <div className="flex items-start py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 pt-0.5">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {tags.map((tag) => (
                    <Tag key={tag} variant="default" size="sm">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Location
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {location}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Secondary Phone
                </span>
                <span
                  className={\`text-sm flex-1 \${secondaryPhone ? "text-semantic-text-primary" : "text-semantic-text-placeholder"}\`}
                >
                  {secondaryPhone || "XXXXX XXXXX"}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  DOB
                </span>
                <span
                  className={\`text-sm flex-1 \${dob ? "text-semantic-text-primary" : "text-semantic-text-placeholder"}\`}
                >
                  {dob || "DD / MM / YYYY"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Panel>
      <ConfirmationModal
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard changes?"
        description="Your unsaved edits will be lost."
        variant="destructive"
        confirmButtonText="Discard"
        onConfirm={() => {
          setIsEditing(false)
          setShowDiscardConfirm(false)
        }}
      />
    </>
  )
}
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`export { ChatContactPanel } from "./chat-contact-panel"
export type { ChatContactPanelProps } from "./chat-contact-panel"
`, prefix),
        }
      ],
    },
    "chat-template": {
      name: "chat-template",
      description: "Complete chat application template — install this to get the full chat UI",
      category: "custom",
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tailwindcss-animate"
      ],
      internalDependencies: [
            "chat-types",
            "chat-transport",
            "chat-provider",
            "chat-sidebar",
            "chat-filter-panel",
            "chat-new-panel",
            "chat-message-list",
            "chat-header",
            "chat-input",
            "chat-template-modal",
            "chat-contact-panel",
            "button",
            "tooltip"
      ],
      isMultiFile: true,
      directory: "chat-template",
      group: "chat",
      templateOnly: true,
      mainFile: "chat-app.tsx",
      files: [
        {
          name: "helpers.ts",
          content: prefixTailwindClasses(`import * as React from "react"

/**
 * Highlight a substring match within text.
 * Used for search result highlighting in chat list and contacts.
 */
export function highlightMatch(
  text: string,
  query: string
): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return React.createElement(
    React.Fragment,
    null,
    text.slice(0, idx),
    React.createElement(
      "strong",
      { className: "font-semibold text-semantic-text-primary" },
      text.slice(idx, idx + query.length)
    ),
    text.slice(idx + query.length)
  )
}

/**
 * Extract initials from a name string.
 * "Alex Smith" → "AS", "Jane" → "JA"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Replace \`{{variable}}\` placeholders in text with provided values.
 * Matched variables are rendered as highlighted spans.
 */
export function resolveVars(
  text: string,
  vars: Record<string, string>
): React.ReactNode {
  const parts = text.split(/(\\{\\{[^}]+\\}\\})/g)
  return parts.map((part, i) =>
    /^\\{\\{[^}]+\\}\\}$/.test(part)
      ? React.createElement(
          "span",
          { key: i, className: "text-semantic-text-link font-medium" },
          vars[part] || part
        )
      : part
  )
}
`, prefix),
        },
        {
          name: "chat-app.tsx",
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../button"
import {
  TooltipProvider,
} from "../../tooltip"
import { Plus, MessageSquare, Upload, User } from "lucide-react"
import { useChatContext } from "../chat-provider"
import { ChatSidebar } from "../chat-sidebar"
import { ChatFilterPanel } from "../chat-filter-panel"
import { ChatNewPanel } from "../chat-new-panel"
import { AddNewContactModal } from "../chat-new-panel"
import { ChatHeader } from "../chat-header"
import { ChatMessageList } from "../chat-message-list"
import { ChatInput } from "../chat-input"
import { ChatTemplateModal } from "../chat-template-modal"
import { ChatContactPanel } from "../chat-contact-panel"

/* ── ChatApp ── */

export interface ChatAppProps {
  /** Additional className for the outer container */
  className?: string
}

/**
 * The fully composed chat application.
 * Wrap with \`<ChatProvider transport={...}>\` to use.
 *
 * @example
 * \`\`\`tsx
 * import { ChatApp, ChatProvider, MockTransport } from "./components/custom/chat-template"
 *
 * <ChatProvider transport={new MockTransport()}>
 *   <ChatApp />
 * </ChatProvider>
 * \`\`\`
 */
export function ChatApp({ className }: ChatAppProps) {
  const {
    chats,
    selectedChatId,
    showFilters,
    setShowFilters,
    showNewChat,
    setShowNewChat,
    showAddContact,
    setShowAddContact,
    showTemplateModal,
    showContactDetails,
    setShowContactDetails,
    applyFilters,
    setSearch,
    channels,
  } = useChatContext()

  const chatAreaRef = React.useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const selectedChat = React.useMemo(
    () => chats.find((c) => c.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  )

  const openNewChat = React.useCallback(() => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }, [setShowFilters, setSearch, setShowNewChat])

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex h-screen bg-semantic-bg-ui", className)}>
        {/* ── Left Panel: Sidebar ── */}
        <ChatSidebar chatAreaRef={chatAreaRef}>
          {showNewChat ? (
            <ChatNewPanel
              onBack={() => setShowNewChat(false)}
              onOpenAddContact={() => setShowAddContact(true)}
            />
          ) : showFilters ? (
            <ChatFilterPanel
              onClose={() => {
                setShowFilters(false)
                setSearch("")
              }}
              onApply={(assigneeSet, channelSet) => {
                applyFilters({
                  assignees: assigneeSet.size > 0 ? assigneeSet : undefined,
                  channels: channelSet.size > 0 ? channelSet : undefined,
                })
                setShowFilters(false)
                setSearch("")
              }}
            />
          ) : null}
        </ChatSidebar>

        {/* ── Right Panel: Chat Window or Empty State ── */}
        {selectedChat ? (
          <main
            className="flex-[1_0_0] min-h-0 min-w-0 flex"
            ref={chatAreaRef}
            tabIndex={-1}
          >
            {/* Chat Window */}
            <div
              className="flex-1 flex flex-col min-w-0 relative"
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                if (
                  e.currentTarget === e.target ||
                  !e.currentTarget.contains(e.relatedTarget as Node)
                )
                  setIsDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                // The ChatInput handles the attachment internally via context or props
                // For drag-drop we'd need to integrate with ChatInput — for now this is a placeholder
              }}
            >
              <h2 className="sr-only m-0">{selectedChat.name} — Chat</h2>
              <div className="sr-only" aria-live="assertive">
                {isDragging
                  ? "Drop zone active. Release to attach file."
                  : ""}
              </div>

              {/* Chat Header */}
              <ChatHeader />

              {/* Messages Area */}
              <ChatMessageList />

              {/* Message Input */}
              <ChatInput
                expired={
                  selectedChat.isWindowExpired ||
                  selectedChat.tab === "resolved"
                }
                expiredMessage={
                  selectedChat.tab === "resolved"
                    ? "This chat is closed. Send a template to continue."
                    : "This chat has expired. Send a template to continue."
                }
              />

              {/* Drag & drop overlay */}
              {isDragging && (
                <div
                  role="region"
                  aria-label="Drop zone — drop file to attach"
                  className="absolute inset-0 z-50 bg-semantic-primary/5 backdrop-blur-[1px] flex items-center justify-center border-2 border-dashed border-semantic-primary rounded-lg animate-in fade-in duration-200 ease-out"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-10 text-semantic-primary" />
                    <span className="text-[16px] font-semibold text-semantic-primary">
                      Drop file to attach
                    </span>
                    <span className="text-[13px] text-semantic-text-muted">
                      Images, videos, documents
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details Panel */}
            <ChatContactPanel name={selectedChat.name} />

            {/* Right Action Sidebar */}
            <aside
              aria-label="Actions"
              className="w-[56px] bg-white border-l border-solid border-semantic-border-layout flex flex-col items-center py-2 gap-4 shrink-0"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Contact details"
                onClick={() => setShowContactDetails(!showContactDetails)}
                className={cn(
                  "transition-colors duration-200",
                  showContactDetails &&
                    "bg-semantic-bg-hover text-semantic-primary"
                )}
              >
                <User className="size-6" />
              </Button>
            </aside>
          </main>
        ) : (
          /* ── Empty State ── */
          <div className="flex-[1_0_0] min-h-0 min-w-0 bg-semantic-bg-ui shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex flex-col items-center justify-center p-4">
            {showNewChat ? (
              <div className="flex flex-col items-center gap-5 w-[300px] shrink-0">
                <div className="size-[100px] shrink-0 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-12 text-semantic-text-muted" />
                </div>
                <div className="flex flex-col items-center gap-[6px]">
                  <h2 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
                    Start New Conversation
                  </h2>
                  <p className="text-[16px] text-semantic-text-muted text-center m-0">
                    Select a contact or add new contact.
                  </p>
                </div>
                <Button
                  className="w-full h-12"
                  leftIcon={<Plus className="w-6 h-6" />}
                  onClick={() => setShowAddContact(true)}
                >
                  Add New Contact
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 w-[276px] shrink-0">
                <div className="size-[100px] shrink-0 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-12 text-semantic-text-muted" />
                </div>
                <div className="flex flex-col items-center gap-[6px]">
                  <h2 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
                    No conversation selected
                  </h2>
                  <p className="text-[16px] text-semantic-text-muted text-center m-0">
                    Select a chat from inbox or start new chat
                  </p>
                </div>
                <Button
                  className="w-full h-12"
                  leftIcon={<Plus className="w-6 h-6" />}
                  onClick={openNewChat}
                >
                  Start New Chat
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Modals ── */}
        {showAddContact && (
          <AddNewContactModal
            defaultChannel={channels[0]}
            onClose={() => setShowAddContact(false)}
          />
        )}
        {showTemplateModal && (
          <ChatTemplateModal />
        )}
      </div>
    </TooltipProvider>
  )
}

ChatApp.displayName = "ChatApp"
`, prefix),
        },
        {
          name: "index.ts",
          content: prefixTailwindClasses(`// ── Orchestrator ──
export { ChatApp } from "./chat-app"
export type { ChatAppProps } from "./chat-app"

// ── Helpers ──
export { highlightMatch, getInitials, resolveVars } from "./helpers"

// ── Re-exports for convenience ──
// Consumers can import everything from "chat-template" as a single entry point

// Foundation
export { ChatProvider, useChatContext } from "../chat-provider"
export type { ChatContextValue } from "../chat-provider/types"
export { MockTransport } from "../chat-transport"
export type { ChatTransport } from "../chat-transport/types"

// Types
export type {
  Tab,
  TabDef,
  AssigneeItem,
  ChannelItem,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  TemplateType,
  CannedMessage,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  VarMap,
  CardVarMap,
  MediaPayload,
  SentByType,
} from "../chat-types"

// UI Modules (for advanced customization)
export { ChatSidebar } from "../chat-sidebar"
export { ChatFilterPanel } from "../chat-filter-panel"
export { ChatNewPanel, AddNewContactModal } from "../chat-new-panel"
export { ChatMessageList } from "../chat-message-list"
export type { ReplyToPayload } from "../chat-message-list"
export { ChatHeader, AssignmentDropdown, ResolveButton } from "../chat-header"
export { ChatInput, ComposerAttachmentPreview } from "../chat-input"
export { ChatTemplateModal } from "../chat-template-modal"
export { ChatContactPanel } from "../chat-contact-panel"
`, prefix),
        }
      ],
    }
  }
}
