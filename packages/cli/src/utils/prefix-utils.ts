/**
 * Tailwind CSS Class Prefixing Utilities
 *
 * These functions handle context-aware prefixing of Tailwind CSS classes.
 * They are used both at build-time (generate-registry.js) and runtime (registry files).
 *
 * CRITICAL: Do not modify these functions without running all tests.
 * The prefix system must handle many edge cases including:
 * - Variant prefixes (hover:, focus:, sm:, data-[state=open]:)
 * - Negative values (-mt-4)
 * - Arbitrary values (bg-[#343E55])
 * - Arbitrary selectors ([&_svg]:pointer-events-none)
 * - Non-class values that should NOT be prefixed
 * - Semantic token fallbacks for backward compatibility
 */

/**
 * Semantic token to fallback color mapping
 * These ensure components work even if the user doesn't have semantic tokens defined
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
 * e.g., "bg-semantic-primary" → "bg-[var(--semantic-primary,#343E55)]"
 */
function transformSemanticClass(cls: string): string {
  // Match patterns like bg-semantic-*, text-semantic-*, border-semantic-*, ring-semantic-*, etc.
  const semanticMatch = cls.match(/^(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-(semantic-[a-z-]+)$/)

  if (semanticMatch) {
    const [, utilityPrefix, semanticToken] = semanticMatch
    const fallback = SEMANTIC_FALLBACKS[semanticToken]

    if (fallback) {
      return `${utilityPrefix}-[var(--${semanticToken},${fallback})]`
    }
  }

  return cls
}

/**
 * Transform semantic classes in a class string to use CSS variable fallbacks
 * This ensures backward compatibility with projects that don't have semantic tokens defined
 */
export function transformSemanticClasses(classString: string): string {
  return classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Handle variant prefixes (hover:, focus:, etc.)
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\/[a-z][a-z0-9-]*)?:)|((data|aria)-\[[^\]]+\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        const utility = cls.slice(variants.length)
        const transformed = transformSemanticClass(utility)
        return variants + transformed
      }

      return transformSemanticClass(cls)
    })
    .join(' ')
}

/**
 * Transform semantic classes throughout component content
 * Handles cva(), cn(), className="", and variant object values
 */
function transformSemanticClassesInContent(content: string): string {
  // Helper to check if string contains semantic classes worth transforming
  const hasSemanticClasses = (str: string): boolean => {
    return /\b(bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent|shadow|decoration)-semantic-/.test(str)
  }

  // 1. Handle cva() base classes
  content = content.replace(
    /\bcva\s*\(\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!hasSemanticClasses(baseClasses)) return match
      const transformed = transformSemanticClasses(baseClasses)
      return match.replace(`"${baseClasses}"`, `"${transformed}"`)
    }
  )

  // 2. Handle cn() function calls
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

    // Transform semantic classes in both double and single quoted strings
    let transformedArgs = args.replace(
      /"([^"]*)"/g,
      (m: string, classes: string) => {
        if (!hasSemanticClasses(classes)) return m
        return `"${transformSemanticClasses(classes)}"`
      }
    )
    transformedArgs = transformedArgs.replace(
      /'([^']*)'/g,
      (m: string, classes: string) => {
        if (!hasSemanticClasses(classes)) return m
        return `'${transformSemanticClasses(classes)}'`
      }
    )

    result += `cn(${transformedArgs})`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // 3. Handle className="..." direct attributes
  content = content.replace(
    /className\s*=\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!hasSemanticClasses(classes)) return match
      return `className="${transformSemanticClasses(classes)}"`
    }
  )

  // 4. Handle variant values in cva config objects (double-quoted)
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      if (!hasSemanticClasses(value)) return match
      return `${key}: "${transformSemanticClasses(value)}"`
    }
  )

  // Handle single-quoted variant values
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
export function looksLikeTailwindClasses(str: string): boolean {
  // Skip empty strings
  if (!str || !str.trim()) return false

  // Skip strings with non-ASCII characters (currency symbols, unicode, etc.)
  // Tailwind classes are always ASCII — ₹, €, £, ¥ etc. are display text, not classes
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(str)) return false

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
  const tokens = str.split(/\s+/)
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

  // Single word utilities that are valid Tailwind classes — check BEFORE npm regex
  // so that words like "relative", "flex", "hidden" aren't misidentified as npm packages
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

    // Single word utilities (reuse the same regex for multi-word strings)
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

// Regex to detect border-WIDTH classes (not color, not style)
// Matches: border, border-0, border-2, border-4, border-8, border-[1.5px],
//          border-t, border-b, border-l, border-r, border-x, border-y,
//          border-t-2, border-b-[3px], etc.
const BORDER_WIDTH_RE = /^border(-[trblxy])?(-[0248]|-\[.+\])?$/
// Regex to detect border-STYLE classes
const BORDER_STYLE_RE = /^border-(solid|dashed|dotted|double|hidden|none)$/

// Helper to prefix a single class string
export function prefixClassString(classString: string, prefix: string): string {
  const prefixed = classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
      // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
      if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return cls

      // Handle variant prefixes like hover:, focus:, sm:, data-[state=open]:, aria-[checked]:, etc.
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*(\/[a-z][a-z0-9-]*)?:)|((data|aria)-\[[^\]]+\]:))+/)
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

      // Handle arbitrary selector values like [&_svg]:pointer-events-none
      if (cls.startsWith('[&')) {
        const closeBracket = cls.indexOf(']:')
        if (closeBracket !== -1) {
          const selector = cls.slice(0, closeBracket + 2)
          const utility = cls.slice(closeBracket + 2)
          if (!utility) return cls
          return `${selector}${prefix}${utility}`
        }
        return cls
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
  const hasNonZeroBorderWidth = origClasses.some(c => BORDER_WIDTH_RE.test(c) && !BORDER_ZERO_RE.test(c))
  const hasBorderStyle = origClasses.some(c => BORDER_STYLE_RE.test(c))
  if (hasNonZeroBorderWidth && !hasBorderStyle) {
    prefixed.push(`${prefix}border-solid`)
  }

  return prefixed.join(' ')
}

// Context-aware Tailwind class prefixing
export function prefixTailwindClasses(content: string, prefix: string): string {
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

  // 4. Handle variant values in cva config objects / classname lookup maps
  // Pattern: key: "class string" or key: 'class string' within variants/defaultVariants objects,
  // but also classname-lookup maps like `{ xs: "size-2 border" }` that components use for
  // variant-to-class mapping outside of cva().
  // Handles both unquoted keys (default:) and quoted keys ("icon-sm":).
  // IMPORTANT: [^"\n]+ prevents matching across newlines to avoid greedy captures.

  // Skip keys that are definitely not class values (HTML attributes + CSS style properties)
  // IMPORTANT: Only include camelCase CSS properties that CANNOT be CVA variant names.
  // Do NOT add simple words like: border, outline, color, flex, fill, stroke, display,
  // position, background, top, left, right, bottom, gap, transform, transition, animation,
  // cursor, opacity, visibility — these overlap with common CVA variant keys.
  // For those ambiguous keys, we use `cssKeywordValues` below to detect CSS-only values.
  const nonClassKeys = [
    // HTML attributes
    'name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy',
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

  // CSS style-object entries whose keys collide with common CVA variant names
  // (so they can't go in `nonClassKeys`) but whose values are reserved CSS
  // keywords, not Tailwind classes. When we see one of these pairs, the context
  // is unambiguously a React.CSSProperties entry, and prefixing would produce
  // invalid values like `position: "tw-absolute"` that TypeScript rejects.
  //
  // Only values that happen to also be single-word Tailwind utilities need
  // guarding (that's what creates the ambiguity in the first place).
  const cssKeywordValues: Record<string, string[]> = {
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky', 'inherit', 'initial', 'unset', 'revert'],
    display: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'inline-table', 'table-row', 'table-cell', 'table-caption', 'contents', 'flow-root', 'list-item', 'none', 'inherit', 'initial', 'unset'],
    visibility: ['visible', 'hidden', 'collapse', 'inherit', 'initial', 'unset'],
  }

  function isCSSStyleObjectEntry(key: string, value: string): boolean {
    const keywords = cssKeywordValues[key]
    if (!keywords) return false
    return keywords.includes(value.trim())
  }

  // Handle double-quoted values
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/"/g, '')

      if (nonClassKeys.includes(cleanKey)) return match

      // Guard against CSS style-object entries (e.g. position: "absolute",
      // display: "flex", visibility: "hidden") that would otherwise be treated
      // as Tailwind single-word utilities.
      if (isCSSStyleObjectEntry(cleanKey, value)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

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

      if (nonClassKeys.includes(cleanKey)) return match

      // Same CSS style-object guard for single-quoted values
      if (isCSSStyleObjectEntry(cleanKey, value)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: '${prefixed}'`
    }
  )

  // 5. Handle function calls with class string arguments
  // Recognizes patterns like: functionName("mt-3") or helperFunc("flex gap-2")
  // where the string argument looks like Tailwind classes
  // Be conservative: only transform if the string clearly looks like CSS classes

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
      if (classes.includes(`${prefix}`)) return match
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
      if (classes.includes(`${prefix}`)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `${funcName}('${prefixed}'`
    }
  )

  // PATTERN-6-START
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
  // PATTERN-6-END

  return content
}

// Helper: Check if all classes in a string already have the prefix (to avoid double-prefixing)
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

// Helper: Prefix a static part of a template literal (preserving whitespace)
function prefixStaticTemplatePart(text: string, prefix: string): string {
  const trimmed = text.trim()
  if (!trimmed || !looksLikeTailwindClasses(trimmed)) return text
  const leading = text.match(/^(\s*)/)?.[1] || ''
  const trailing = text.match(/(\s*)$/)?.[1] || ''
  return leading + prefixClassString(trimmed, prefix) + trailing
}

// Helper: Prefix string literals ("..." and '...') in a code expression
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

/**
 * Prefix class strings within a className={...} JSX expression.
 * Handles template literals (static parts + expressions), ternaries, and bare string literals.
 */
export function prefixClassNameExpression(expr: string, prefix: string): string {
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
