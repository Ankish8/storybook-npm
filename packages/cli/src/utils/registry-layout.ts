// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: layout

import type { Registry } from './registry-types'

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
  if (str.startsWith('@') || str.startsWith('.') || str.startsWith('/') || str.includes('::')) return false

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  const tailwindUtilityPrefixes = ['text', 'bg', 'p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr', 'w', 'h', 'min', 'max', 'gap', 'space', 'border', 'rounded', 'shadow', 'opacity', 'font', 'leading', 'tracking', 'z', 'inset', 'top', 'bottom', 'left', 'right', 'flex', 'grid', 'col', 'row', 'justify', 'items', 'content', 'self', 'place', 'order', 'float', 'clear', 'object', 'overflow', 'overscroll', 'scroll', 'list', 'appearance', 'cursor', 'pointer', 'resize', 'select', 'fill', 'stroke', 'table', 'caption', 'transition', 'duration', 'ease', 'delay', 'animate', 'transform', 'origin', 'scale', 'rotate', 'translate', 'skew', 'accent', 'caret', 'outline', 'ring', 'blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia', 'backdrop', 'divide', 'sr', 'not', 'snap', 'touch', 'will', 'aspect', 'container', 'columns', 'break', 'box', 'isolation', 'mix', 'filter', 'drop', 'size']

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

      // Handle variant prefixes like hover:, focus:, sm:, data-[state=open]:, aria-[checked]:, etc.
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*:)|((data|aria)-\[[^\]]+\]:))+/)
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
    .join(' ')
}

// Context-aware Tailwind class prefixing
function prefixTailwindClasses(content: string, prefix: string): string {
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

    // Prefix class strings within the cn() arguments
    const prefixedArgs = args.replace(
      /"([^"]*)"/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return `"${prefixed}"`
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
  // Pattern: key: "class string" within variants/defaultVariants objects
  // Handles both unquoted keys (default:) and quoted keys ("icon-sm":)
  // But be careful not to match non-class string values
  // IMPORTANT: [^"\n]+ prevents matching across newlines to avoid greedy captures
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/"/g, '')

      // Skip keys that are definitely not class values
      const nonClassKeys = ['name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy']
      if (nonClassKeys.includes(cleanKey)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: "${prefixed}"`
    }
  )

  return content
}

export function getLayoutRegistry(prefix: string = ''): Registry {
  return {
    'accordion': {
      name: 'accordion',
      description: 'An expandable/collapsible accordion component with single or multiple mode support',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'accordion.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Accordion root variants
 */
const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered: "border border-[#E5E7EB] rounded-lg divide-y divide-[#E5E7EB]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

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
})

/**
 * Accordion trigger variants
 */
const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "py-3",
        bordered: "p-4 hover:bg-[#F9FAFB]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

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
)

// Types
type AccordionType = "single" | "multiple"

interface AccordionContextValue {
  type: AccordionType
  value: string[]
  onValueChange: (value: string[]) => void
  variant: "default" | "bordered"
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
  disabled?: boolean
}

// Contexts
const AccordionContext = React.createContext<AccordionContextValue | null>(null)
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion")
  }
  return context
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error("AccordionTrigger/AccordionContent must be used within an AccordionItem")
  }
  return context
}

/**
 * Root accordion component that manages state
 */
export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  /** Whether only one item can be open at a time ('single') or multiple ('multiple') */
  type?: AccordionType
  /** Controlled value - array of open item values */
  value?: string[]
  /** Default open items for uncontrolled usage */
  defaultValue?: string[]
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (newValue: string[]) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    const contextValue = React.useMemo(
      () => ({
        type,
        value: currentValue,
        onValueChange: handleValueChange,
        variant: variant || "default",
      }),
      [type, currentValue, handleValueChange, variant]
    )

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
    )
  }
)
Accordion.displayName = "Accordion"

/**
 * Individual accordion item
 */
export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  /** Unique value for this item */
  value: string
  /** Whether this item is disabled */
  disabled?: boolean
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { value: openValues, variant } = useAccordionContext()
    const isOpen = openValues.includes(value)

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
      }),
      [value, isOpen, disabled]
    )

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
    )
  }
)
AccordionItem.displayName = "AccordionItem"

/**
 * Trigger button that toggles the accordion item
 */
export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
  /** Whether to show the chevron icon */
  showChevron?: boolean
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, showChevron = true, children, ...props }, ref) => {
    const { type, value: openValues, onValueChange, variant } = useAccordionContext()
    const { value, isOpen, disabled } = useAccordionItemContext()

    const handleClick = () => {
      if (disabled) return

      let newValue: string[]

      if (type === "single") {
        // In single mode, toggle current item (close if open, open if closed)
        newValue = isOpen ? [] : [value]
      } else {
        // In multiple mode, toggle the item in the array
        newValue = isOpen
          ? openValues.filter((v) => v !== value)
          : [...openValues, value]
      }

      onValueChange(newValue)
    }

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
              "h-4 w-4 shrink-0 text-[#6B7280] transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

/**
 * Content that is shown/hidden when the item is toggled
 */
export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useAccordionContext()
    const { isOpen } = useAccordionItemContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number | undefined>(undefined)

    React.useEffect(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight
        setHeight(isOpen ? contentHeight : 0)
      }
    }, [isOpen, children])

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
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
}
`, prefix),
        },
      ],
    }
  }
}
