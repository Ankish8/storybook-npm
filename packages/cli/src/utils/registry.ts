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
  mainFile?: string
}

export type Registry = Record<string, ComponentDefinition>

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

// In a real implementation, this would fetch from a remote URL
// For now, we'll embed the components directly
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  return {
    'button': {
      name: 'button',
      description: 'A customizable button component with variants, sizes, and icons',
      dependencies: [
            "@radix-ui/react-slot",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'button.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#343E55] text-white hover:bg-[#343E55]/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#343E55] bg-transparent text-[#343E55] hover:bg-[#343E55] hover:text-white",
        secondary:
          "bg-[#343E55]/20 text-[#343E55] hover:bg-[#343E55]/30",
        ghost: "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#333333]",
        link: "text-[#343E55] underline-offset-4 hover:underline",
        dashed:
          "border border-dashed border-[#D1D5DB] bg-transparent text-[#6B7280] hover:border-[#343E55] hover:text-[#343E55] hover:bg-[#F9FAFB]",
      },
      size: {
        default: "py-2.5 px-4 [&_svg]:size-4",
        sm: "py-2 px-3 text-xs [&_svg]:size-3.5",
        lg: "py-3 px-6 [&_svg]:size-5",
        icon: "h-8 w-8 rounded-md",
        "icon-sm": "h-7 w-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element using Radix Slot */
  asChild?: boolean
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode
  /** Shows loading spinner and disables button */
  loading?: boolean
  /** Text shown during loading state */
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
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
  }, ref) => {
    const Comp = asChild ? Slot : "button"

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
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`, prefix),
        },
      ],
    },
    'badge': {
      name: 'badge',
      description: 'A status badge component with active, failed, and disabled variants',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: 'badge.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Badge variants for status indicators.
 * Pill-shaped badges with different colors for different states.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        active: "bg-[#E5FFF5] text-[#00A651]",
        failed: "bg-[#FFECEC] text-[#FF3B3B]",
        disabled: "bg-[#F3F5F6] text-[#6B7280]",
        default: "bg-[#F3F5F6] text-[#333333]",
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
)

/**
 * Badge component for displaying status indicators.
 *
 * @example
 * \`\`\`tsx
 * <Badge variant="active">Active</Badge>
 * <Badge variant="failed">Failed</Badge>
 * <Badge variant="disabled">Disabled</Badge>
 * <Badge variant="active" leftIcon={<CheckIcon />}>Active</Badge>
 * \`\`\`
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon displayed on the left side of the badge text */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right side of the badge text */
  rightIcon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }), "gap-1")}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
`, prefix),
        },
      ],
    },
    'input': {
      name: 'input',
      description: 'A text input component with error and disabled states',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: 'input.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-10 w-full rounded bg-white px-4 py-2.5 text-sm text-[#333333] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#333333] placeholder:text-[#9CA3AF] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus:outline-none focus:border-[#2BBBC9]/50 focus:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus:outline-none focus:border-[#FF3B3B]/60 focus:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

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
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
`, prefix),
        },
      ],
    },
    'select': {
      name: 'select',
      description: 'A select dropdown component built on Radix UI Select',
      dependencies: [
            "@radix-ui/react-select",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'select.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * SelectTrigger variants matching TextField styling
 */
const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded bg-white px-4 py-2.5 text-sm text-[#333333] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB] [&>span]:line-clamp-1",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus:outline-none focus:border-[#2BBBC9]/50 focus:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus:outline-none focus:border-[#FF3B3B]/60 focus:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
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
      <ChevronDown className="size-4 text-[#6B7280] opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

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
    <ChevronUp className="size-4 text-[#6B7280]" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

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
    <ChevronDown className="size-4 text-[#6B7280]" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded bg-white border border-[#E9E9E9] shadow-md",
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
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-4 py-1.5 text-xs font-medium text-[#6B7280]", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-[#333333] outline-none",
      "hover:bg-[#F3F4F6] focus:bg-[#F3F4F6]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-[#2BBBC9]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#E9E9E9]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

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
}
`, prefix),
        },
      ],
    },
    'checkbox': {
      name: 'checkbox',
      description: 'A tri-state checkbox component with label support (checked, unchecked, indeterminate)',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'checkbox.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  "inline-flex items-center justify-center rounded border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
)

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
})

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
})

export type CheckedState = boolean | "indeterminate"

/**
 * A tri-state checkbox component with label support
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
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof checkboxVariants> {
  /** Whether the checkbox is checked, unchecked, or indeterminate */
  checked?: CheckedState
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: CheckedState) => void
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
  /** The label of the checkbox for accessibility */
  ariaLabel?: string
  /** The ID of an element describing the checkbox */
  ariaLabelledBy?: string
  /** If true, the checkbox automatically receives focus */
  autoFocus?: boolean
  /** Class name applied to the checkbox element */
  checkboxClassName?: string
  /** Class name applied to the label element */
  labelClassName?: string
  /** The name of the checkbox, used for form submission */
  name?: string
  /** The value submitted with the form when checked */
  value?: string
  /** If true, uses separate labels with htmlFor/id association instead of wrapping the input. Requires id prop. */
  separateLabel?: boolean
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      size,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      label,
      labelPosition = "right",
      ariaLabel,
      ariaLabelledBy,
      autoFocus,
      checkboxClassName,
      labelClassName,
      name,
      value,
      separateLabel = false,
      id,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState<CheckedState>(defaultChecked)
    const checkboxRef = React.useRef<HTMLButtonElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => checkboxRef.current!)

    // Handle autoFocus
    React.useEffect(() => {
      if (autoFocus && checkboxRef.current) {
        checkboxRef.current.focus()
      }
    }, [autoFocus])

    const isControlled = controlledChecked !== undefined
    const checkedState = isControlled ? controlledChecked : internalChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      // Cycle through states: unchecked -> checked -> unchecked
      // (indeterminate is typically set programmatically, not through user clicks)
      const newValue = checkedState === true ? false : true

      if (!isControlled) {
        setInternalChecked(newValue)
      }

      onCheckedChange?.(newValue)

      // Call external onClick if provided
      onClick?.(e)
    }

    const isChecked = checkedState === true
    const isIndeterminate = checkedState === "indeterminate"

    const checkbox = (
      <button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={checkboxRef}
        id={id}
        disabled={disabled}
        onClick={handleClick}
        data-name={name}
        data-value={value}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          isChecked || isIndeterminate
            ? "bg-[#343E55] border-[#343E55] text-white"
            : "bg-white border-[#E5E7EB] hover:border-[#9CA3AF]",
          className,
          checkboxClassName
        )}
        {...props}
      >
        {isChecked && (
          <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
        {isIndeterminate && (
          <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
      </button>
    )

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
                  "text-[#333333] cursor-pointer",
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
                  "text-[#333333] cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
          </div>
        )
      }

      // Default: wrapping label
      return (
        <label className={cn("inline-flex items-center gap-2 cursor-pointer", disabled && "cursor-not-allowed")}>
          {labelPosition === "left" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50", labelClassName)}>
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50", labelClassName)}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return checkbox
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
`, prefix),
        },
      ],
    },
    'toggle': {
      name: 'toggle',
      description: 'A toggle/switch component for boolean inputs with on/off states',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: 'toggle.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Toggle track variants (the outer container)
 */
const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
)

/**
 * Toggle thumb variants (the sliding circle)
 */
const toggleThumbVariants = cva(
  "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
      checked: {
        true: "",
        false: "translate-x-0",
      },
    },
    compoundVariants: [
      { size: "default", checked: true, className: "translate-x-5" },
      { size: "sm", checked: true, className: "translate-x-4" },
      { size: "lg", checked: true, className: "translate-x-7" },
    ],
    defaultVariants: {
      size: "default",
      checked: false,
    },
  }
)

/**
 * A toggle/switch component for boolean inputs with on/off states
 *
 * @example
 * \`\`\`tsx
 * <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Toggle size="sm" disabled />
 * <Toggle size="lg" checked label="Enable notifications" />
 * \`\`\`
 */
export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  /** Whether the toggle is checked/on */
  checked?: boolean
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      size,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      label,
      labelPosition = "right",
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)

    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : internalChecked

    const handleClick = () => {
      if (disabled) return

      const newValue = !isChecked

      if (!isControlled) {
        setInternalChecked(newValue)
      }

      onCheckedChange?.(newValue)
    }

    const toggle = (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          toggleVariants({ size, className }),
          isChecked ? "bg-[#343E55]" : "bg-[#E5E7EB]"
        )}
        {...props}
      >
        <span
          className={cn(
            toggleThumbVariants({ size, checked: isChecked })
          )}
        />
      </button>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {labelPosition === "left" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {toggle}
          {labelPosition === "right" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return toggle
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
`, prefix),
        },
      ],
    },
    'text-field': {
      name: 'text-field',
      description: 'A text field with label, helper text, icons, and validation states',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'text-field.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * TextField container variants for when icons/prefix/suffix are present
 */
const textFieldContainerVariants = cva(
  "relative flex items-center rounded bg-white transition-all",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus-within:border-[#2BBBC9]/50 focus-within:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus-within:border-[#FF3B3B]/60 focus-within:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 bg-[#F9FAFB]",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  }
)

/**
 * TextField input variants (standalone without container)
 */
const textFieldInputVariants = cva(
  "h-10 w-full rounded bg-white px-4 py-2.5 text-sm text-[#333333] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#333333] placeholder:text-[#9CA3AF] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus:outline-none focus:border-[#2BBBC9]/50 focus:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus:outline-none focus:border-[#FF3B3B]/60 focus:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

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
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldInputVariants> {
  /** Label text displayed above the input */
  label?: string
  /** Shows red asterisk next to label when true */
  required?: boolean
  /** Helper text displayed below the input */
  helperText?: string
  /** Error message - shows error state with red styling */
  error?: string
  /** Icon displayed on the left inside the input */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right inside the input */
  rightIcon?: React.ReactNode
  /** Text prefix inside input (e.g., "https://") */
  prefix?: string
  /** Text suffix inside input (e.g., ".com") */
  suffix?: string
  /** Shows character count when maxLength is set */
  showCount?: boolean
  /** Shows loading spinner inside input */
  loading?: boolean
  /** Additional class for the wrapper container */
  wrapperClassName?: string
  /** Additional class for the label */
  labelClassName?: string
  /** Additional class for the input container (includes prefix/suffix/icons) */
  inputContainerClassName?: string
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
      ...props
    },
    ref
  ) => {
    // Internal state for character count in uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')

    // Determine if controlled
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    // Derive state from props
    const derivedState = error ? 'error' : (state ?? 'default')

    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    // Determine if we need the container wrapper (for icons/prefix/suffix)
    const hasAddons = leftIcon || rightIcon || prefix || suffix || loading

    // Character count
    const charCount = String(currentValue).length

    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const inputId = id || generatedId
    const helperId = \`\${inputId}-helper\`
    const errorId = \`\${inputId}-error\`

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined

    // Render the input element
    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          hasAddons
            ? "flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full text-sm text-[#333333] placeholder:text-[#9CA3AF] disabled:cursor-not-allowed"
            : textFieldInputVariants({ state: derivedState, className })
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
    )

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn("text-sm font-medium text-[#333333]", labelClassName)}
          >
            {label}
            {required && <span className="text-[#FF3B3B] ml-0.5">*</span>}
          </label>
        )}

        {/* Input or Input Container */}
        {hasAddons ? (
          <div
            className={cn(
              textFieldContainerVariants({ state: derivedState, disabled: disabled || loading }),
              "h-10 px-4",
              inputContainerClassName
            )}
          >
            {prefix && <span className="text-sm text-[#6B7280] mr-2 select-none">{prefix}</span>}
            {leftIcon && <span className="mr-2 text-[#6B7280] [&_svg]:size-4 flex-shrink-0">{leftIcon}</span>}
            {inputElement}
            {loading && <Loader2 className="animate-spin size-4 text-[#6B7280] ml-2 flex-shrink-0" />}
            {!loading && rightIcon && <span className="ml-2 text-[#6B7280] [&_svg]:size-4 flex-shrink-0">{rightIcon}</span>}
            {suffix && <span className="text-sm text-[#6B7280] ml-2 select-none">{suffix}</span>}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span id={errorId} className="text-xs text-[#FF3B3B]">
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-[#6B7280]">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
                  charCount > maxLength ? "text-[#FF3B3B]" : "text-[#6B7280]"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)
TextField.displayName = "TextField"

export { TextField, textFieldContainerVariants, textFieldInputVariants }
`, prefix),
        },
      ],
    },
    'select-field': {
      name: 'select-field',
      description: 'A select field with label, helper text, and validation states',
      dependencies: [
            "@radix-ui/react-select",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'select-field.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface SelectOption {
  /** The value of the option */
  value: string
  /** The display label of the option */
  label: string
  /** Whether the option is disabled */
  disabled?: boolean
  /** Group name for grouping options */
  group?: string
}

export interface SelectFieldProps {
  /** Label text displayed above the select */
  label?: string
  /** Shows red asterisk next to label when true */
  required?: boolean
  /** Helper text displayed below the select */
  helperText?: string
  /** Error message - shows error state with red styling */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Loading state with spinner */
  loading?: boolean
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Currently selected value (controlled) */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Options to display */
  options: SelectOption[]
  /** Enable search/filter functionality */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Additional class for wrapper */
  wrapperClassName?: string
  /** Additional class for trigger */
  triggerClassName?: string
  /** Additional class for label */
  labelClassName?: string
  /** ID for the select */
  id?: string
  /** Name attribute for form submission */
  name?: string
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
    const [searchQuery, setSearchQuery] = React.useState("")

    // Derive state from props
    const derivedState = error ? "error" : "default"

    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const selectId = id || generatedId
    const helperId = \`\${selectId}-helper\`
    const errorId = \`\${selectId}-error\`

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {}
      const ungrouped: SelectOption[] = []

      options.forEach((option) => {
        // Filter by search query if searchable
        if (searchable && searchQuery) {
          if (!option.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return
          }
        }

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = []
          }
          groups[option.group].push(option)
        } else {
          ungrouped.push(option)
        }
      })

      return { groups, ungrouped }
    }, [options, searchable, searchQuery])

    const hasGroups = Object.keys(groupedOptions.groups).length > 0

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }

    // Reset search when dropdown closes
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setSearchQuery("")
      }
    }

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn("text-sm font-medium text-[#333333]", labelClassName)}
          >
            {label}
            {required && <span className="text-[#FF3B3B] ml-0.5">*</span>}
          </label>
        )}

        {/* Select */}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled || loading}
          name={name}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            state={derivedState}
            className={cn(
              loading && "pr-10",
              triggerClassName
            )}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin text-[#6B7280]" />
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
                  className="w-full h-8 px-3 text-sm border border-[#E9E9E9] rounded bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2BBBC9]/50"
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
              Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
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
              ))}

            {/* No results message */}
            {searchable &&
              searchQuery &&
              groupedOptions.ungrouped.length === 0 &&
              Object.keys(groupedOptions.groups).length === 0 && (
                <div className="py-6 text-center text-sm text-[#6B7280]">
                  No results found
                </div>
              )}
          </SelectContent>
        </Select>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span id={errorId} className="text-xs text-[#FF3B3B]">
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-[#6B7280]">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)
SelectField.displayName = "SelectField"

export { SelectField }
`, prefix),
        },
      ],
    },
    'multi-select': {
      name: 'multi-select',
      description: 'A multi-select dropdown component with search, badges, and async loading',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'multi-select.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, X, Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * MultiSelect trigger variants matching TextField styling
 */
const multiSelectTriggerVariants = cva(
  "flex min-h-10 w-full items-center justify-between rounded bg-white px-4 py-2 text-sm text-[#333333] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus:outline-none focus:border-[#2BBBC9]/50 focus:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus:outline-none focus:border-[#FF3B3B]/60 focus:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface MultiSelectOption {
  /** The value of the option */
  value: string
  /** The display label of the option */
  label: string
  /** Whether the option is disabled */
  disabled?: boolean
}

export interface MultiSelectProps extends VariantProps<typeof multiSelectTriggerVariants> {
  /** Label text displayed above the select */
  label?: string
  /** Shows red asterisk next to label when true */
  required?: boolean
  /** Helper text displayed below the select */
  helperText?: string
  /** Error message - shows error state with red styling */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Loading state with spinner */
  loading?: boolean
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Currently selected values (controlled) */
  value?: string[]
  /** Default values (uncontrolled) */
  defaultValue?: string[]
  /** Callback when values change */
  onValueChange?: (value: string[]) => void
  /** Options to display */
  options: MultiSelectOption[]
  /** Enable search/filter functionality */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Maximum selections allowed */
  maxSelections?: number
  /** Additional class for wrapper */
  wrapperClassName?: string
  /** Additional class for trigger */
  triggerClassName?: string
  /** Additional class for label */
  labelClassName?: string
  /** ID for the select */
  id?: string
  /** Name attribute for form submission */
  name?: string
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
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
    // Dropdown open state
    const [isOpen, setIsOpen] = React.useState(false)
    // Search query
    const [searchQuery, setSearchQuery] = React.useState("")

    // Container ref for click outside detection
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Determine if controlled
    const isControlled = value !== undefined
    const selectedValues = isControlled ? value : internalValue

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default")

    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const selectId = id || generatedId
    const helperId = \`\${selectId}-helper\`
    const errorId = \`\${selectId}-error\`

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined

    // Filter options by search query
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }, [options, searchable, searchQuery])

    // Get selected option labels
    const selectedLabels = React.useMemo(() => {
      return selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[]
    }, [selectedValues, options])

    // Handle toggle selection
    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : maxSelections && selectedValues.length >= maxSelections
        ? selectedValues
        : [...selectedValues, optionValue]

      if (!isControlled) {
        setInternalValue(newValues)
      }
      onValueChange?.(newValues)
    }

    // Handle remove tag
    const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation()
      const newValues = selectedValues.filter((v) => v !== valueToRemove)
      if (!isControlled) {
        setInternalValue(newValues)
      }
      onValueChange?.(newValues)
    }

    // Handle clear all
    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isControlled) {
        setInternalValue([])
      }
      onValueChange?.([])
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery("")
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        setSearchQuery("")
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isOpen) {
          e.preventDefault()
          setIsOpen(true)
        }
      }
    }

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1 relative", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn("text-sm font-medium text-[#333333]", labelClassName)}
          >
            {label}
            {required && <span className="text-[#FF3B3B] ml-0.5">*</span>}
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
              <span className="text-[#9CA3AF]">{placeholder}</span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={selectedValues[index]}
                  className="inline-flex items-center gap-1 bg-[#F3F4F6] text-[#333333] text-xs px-2 py-0.5 rounded"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeValue(selectedValues[index], e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        removeValue(selectedValues[index], e as unknown as React.MouseEvent)
                      }
                    }}
                    className="cursor-pointer hover:text-[#FF3B3B] focus:outline-none"
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
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    clearAll(e as unknown as React.MouseEvent)
                  }
                }}
                className="p-0.5 cursor-pointer hover:text-[#FF3B3B] focus:outline-none"
                aria-label="Clear all"
              >
                <X className="size-4 text-[#6B7280]" />
              </span>
            )}
            {loading ? (
              <Loader2 className="size-4 animate-spin text-[#6B7280]" />
            ) : (
              <ChevronDown
                className={cn(
                  "size-4 text-[#6B7280] transition-transform",
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
              "absolute z-50 mt-1 w-full rounded bg-white border border-[#E9E9E9] shadow-md",
              "top-full"
            )}
            role="listbox"
            aria-multiselectable="true"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-[#E9E9E9]">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-[#E9E9E9] rounded bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2BBBC9]/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#6B7280]">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  const isDisabled =
                    option.disabled ||
                    (!isSelected && maxSelections && selectedValues.length >= maxSelections)

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && toggleOption(option.value)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-[#333333] outline-none",
                        "hover:bg-[#F3F4F6] focus:bg-[#F3F4F6]",
                        isSelected && "bg-[#F3F4F6]",
                        isDisabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <span className="absolute right-2 flex size-4 items-center justify-center">
                        {isSelected && <Check className="size-4 text-[#2BBBC9]" />}
                      </span>
                      {option.label}
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer with count */}
            {maxSelections && (
              <div className="p-2 border-t border-[#E9E9E9] text-xs text-[#6B7280]">
                {selectedValues.length} / {maxSelections} selected
              </div>
            )}
          </div>
        )}

        {/* Hidden input for form submission */}
        {name && selectedValues.map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span id={errorId} className="text-xs text-[#FF3B3B]">
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-[#6B7280]">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect, multiSelectTriggerVariants }
`, prefix),
        },
      ],
    },
    'table': {
      name: 'table',
      description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: 'table.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Toggle, type ToggleProps } from "./toggle"

/**
 * Table size variants for row height.
 */
const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
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
  }
)

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
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Remove outer border from the table */
  withoutBorder?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, size, withoutBorder, ...props }, ref) => (
    <div className={cn(
      "relative w-full overflow-auto",
      !withoutBorder && "rounded-lg border border-[#E5E7EB]"
    )}>
      <table
        ref={ref}
        className={cn(tableVariants({ size, className }))}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-[#F9FAFB] [&_tr]:border-b", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-[#F9FAFB] font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row with a colored background */
  highlighted?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, highlighted, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-[#E5E7EB] transition-colors",
        highlighted
          ? "bg-[#EBF5FF]"
          : "hover:bg-[#F9FAFB]/50 data-[state=selected]:bg-[#F3F4F6]",
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Make this column sticky on horizontal scroll */
  sticky?: boolean
  /** Sort direction indicator */
  sortDirection?: 'asc' | 'desc' | null
  /** Show info icon with tooltip */
  infoTooltip?: string
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky, sortDirection, infoTooltip, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-[#6B7280] text-sm [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-[#F9FAFB] z-10",
        sortDirection && "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortDirection && (
          <span className="text-[#9CA3AF]">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
        {infoTooltip && (
          <span className="text-[#9CA3AF] cursor-help" title={infoTooltip}>
            ⓘ
          </span>
        )}
      </div>
    </th>
  )
)
TableHead.displayName = "TableHead"

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Make this cell sticky on horizontal scroll */
  sticky?: boolean
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, sticky, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 align-middle text-[#333333] [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-white z-10",
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-[#6B7280]", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

/**
 * TableSkeleton - Loading state for table rows
 */
export interface TableSkeletonProps {
  /** Number of rows to show */
  rows?: number
  /** Number of columns to show */
  columns?: number
}

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <div className="h-4 bg-[#E5E7EB] rounded animate-pulse"
                 style={{ width: colIndex === 1 ? '80%' : colIndex === 2 ? '30%' : '60%' }} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)
TableSkeleton.displayName = "TableSkeleton"

/**
 * TableEmpty - Empty state message
 */
export interface TableEmptyProps {
  /** Number of columns to span */
  colSpan: number
  /** Custom message or component */
  children?: React.ReactNode
}

const TableEmpty = ({ colSpan, children }: TableEmptyProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-8 text-[#6B7280]">
      {children || "No data available"}
    </TableCell>
  </TableRow>
)
TableEmpty.displayName = "TableEmpty"

/**
 * Avatar component for table cells
 */
export interface TableAvatarProps {
  /** Initials to display */
  initials: string
  /** Background color */
  color?: string
}

const TableAvatar = ({ initials, color = "#7C3AED" }: TableAvatarProps) => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
)
TableAvatar.displayName = "TableAvatar"

/**
 * Toggle component optimized for table cells
 */
export interface TableToggleProps extends Omit<ToggleProps, 'size'> {
  /** Size of the toggle - defaults to 'sm' for tables */
  size?: 'sm' | 'default'
}

const TableToggle = React.forwardRef<HTMLButtonElement, TableToggleProps>(
  ({ size = 'sm', ...props }, ref) => (
    <Toggle ref={ref} size={size} {...props} />
  )
)
TableToggle.displayName = "TableToggle"

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
}
`, prefix),
        },
      ],
    },
    'dropdown-menu': {
      name: 'dropdown-menu',
      description: 'A dropdown menu component for displaying actions and options',
      dependencies: [
            "@radix-ui/react-dropdown-menu",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'dropdown-menu.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#F3F4F6] data-[state=open]:bg-[#F3F4F6]",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#E5E7EB] bg-white p-1 text-[#333333] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#E5E7EB] bg-white p-1 text-[#333333] shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[#F3F4F6] focus:text-[#333333] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[#F3F4F6] focus:text-[#333333] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[#F3F4F6] focus:text-[#333333] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#E5E7EB]", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

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
}
`, prefix),
        },
      ],
    },
    'tag': {
      name: 'tag',
      description: 'A tag component for event labels with optional bold label prefix',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
      ],
      files: [
        {
          name: 'tag.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva(
  "inline-flex items-center rounded text-sm",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#333333]",
        primary: "bg-[#343E55]/10 text-[#343E55]",
        secondary: "bg-[#E5E7EB] text-[#374151]",
        success: "bg-[#E5FFF5] text-[#00A651]",
        warning: "bg-[#FFF8E5] text-[#F59E0B]",
        error: "bg-[#FFECEC] text-[#FF3B3B]",
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
  }
)

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
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Bold label prefix displayed before the content */
  label?: string
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, label, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {label && (
          <span className="font-semibold mr-1">{label}</span>
        )}
        <span className="font-normal">{children}</span>
      </span>
    )
  }
)
Tag.displayName = "Tag"

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
  tags: Array<{ label?: string; value: string }>
  /** Maximum number of tags to show before overflow (default: 2) */
  maxVisible?: number
  /** Tag variant */
  variant?: TagProps['variant']
  /** Tag size */
  size?: TagProps['size']
  /** Additional className for the container */
  className?: string
}

const TagGroup = ({
  tags,
  maxVisible = 2,
  variant,
  size,
  className,
}: TagGroupProps) => {
  const visibleTags = tags.slice(0, maxVisible)
  const overflowCount = tags.length - maxVisible

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {visibleTags.map((tag, index) => {
        const isLastVisible = index === visibleTags.length - 1 && overflowCount > 0

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
          )
        }

        return (
          <Tag key={index} label={tag.label} variant={variant} size={size}>
            {tag.value}
          </Tag>
        )
      })}
    </div>
  )
}
TagGroup.displayName = "TagGroup"

export { Tag, TagGroup, tagVariants }
`, prefix),
        },
      ],
    },
    'collapsible': {
      name: 'collapsible',
      description: 'An expandable/collapsible section component with single or multiple mode support',
      dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      files: [
        {
          name: 'collapsible.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Collapsible root variants
 */
const collapsibleVariants = cva("w-full", {
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
 * Collapsible item variants
 */
const collapsibleItemVariants = cva("", {
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
 * Collapsible trigger variants
 */
const collapsibleTriggerVariants = cva(
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
 * Collapsible content variants
 */
const collapsibleContentVariants = cva(
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
type CollapsibleType = "single" | "multiple"

interface CollapsibleContextValue {
  type: CollapsibleType
  value: string[]
  onValueChange: (value: string[]) => void
  variant: "default" | "bordered"
}

interface CollapsibleItemContextValue {
  value: string
  isOpen: boolean
  disabled?: boolean
}

// Contexts
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)
const CollapsibleItemContext = React.createContext<CollapsibleItemContextValue | null>(null)

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible")
  }
  return context
}

function useCollapsibleItemContext() {
  const context = React.useContext(CollapsibleItemContext)
  if (!context) {
    throw new Error("CollapsibleTrigger/CollapsibleContent must be used within a CollapsibleItem")
  }
  return context
}

/**
 * Root collapsible component that manages state
 */
export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleVariants> {
  /** Whether only one item can be open at a time ('single') or multiple ('multiple') */
  type?: CollapsibleType
  /** Controlled value - array of open item values */
  value?: string[]
  /** Default open items for uncontrolled usage */
  defaultValue?: string[]
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
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
      <CollapsibleContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(collapsibleVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

/**
 * Individual collapsible item
 */
export interface CollapsibleItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleItemVariants> {
  /** Unique value for this item */
  value: string
  /** Whether this item is disabled */
  disabled?: boolean
}

const CollapsibleItem = React.forwardRef<HTMLDivElement, CollapsibleItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { value: openValues, variant } = useCollapsibleContext()
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
      <CollapsibleItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(collapsibleItemVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </CollapsibleItemContext.Provider>
    )
  }
)
CollapsibleItem.displayName = "CollapsibleItem"

/**
 * Trigger button that toggles the collapsible item
 */
export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof collapsibleTriggerVariants> {
  /** Whether to show the chevron icon */
  showChevron?: boolean
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, showChevron = true, children, ...props }, ref) => {
    const { type, value: openValues, onValueChange, variant } = useCollapsibleContext()
    const { value, isOpen, disabled } = useCollapsibleItemContext()

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
        className={cn(collapsibleTriggerVariants({ variant, className }))}
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
CollapsibleTrigger.displayName = "CollapsibleTrigger"

/**
 * Content that is shown/hidden when the item is toggled
 */
export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleContentVariants> {}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useCollapsibleContext()
    const { isOpen } = useCollapsibleItemContext()
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
        className={cn(collapsibleContentVariants({ variant, className }))}
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
CollapsibleContent.displayName = "CollapsibleContent"

export {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleVariants,
  collapsibleItemVariants,
  collapsibleTriggerVariants,
  collapsibleContentVariants,
}
`, prefix),
        },
      ],
    },
    'event-selector': {
      name: 'event-selector',
      description: 'A component for selecting webhook events with groups, categories, and tri-state checkboxes',
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "checkbox",
            "collapsible"
      ],
      isMultiFile: true,
      directory: 'event-selector',
      mainFile: 'event-selector.tsx',
      files: [
        {
          name: 'event-selector.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { EventGroupComponent } from "./event-group"
import type { EventSelectorProps, EventCategory, EventGroup } from "./types"

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
export const EventSelector = React.forwardRef<HTMLDivElement, EventSelectorProps>(
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
    )

    const isControlled = controlledSelected !== undefined
    const selectedEvents = isControlled ? controlledSelected : internalSelected

    const handleSelectionChange = React.useCallback(
      (newSelection: string[]) => {
        if (!isControlled) {
          setInternalSelected(newSelection)
        }
        onSelectionChange?.(newSelection)
      },
      [isControlled, onSelectionChange]
    )

    // Get events for a specific group
    const getEventsForGroup = (groupId: string) => {
      return events.filter((event) => event.group === groupId)
    }

    // Get groups for a specific category
    const getGroupsForCategory = (category: EventCategory): EventGroup[] => {
      return category.groups
        .map((groupId) => groups.find((g) => g.id === groupId))
        .filter((g): g is EventGroup => g !== undefined)
    }

    // Calculate total selected count
    const totalSelected = selectedEvents.length

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
      ))
    }

    // Render categories with nested groups
    const renderCategories = () => {
      // Ensure categories is an array before using array methods
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return renderGroups(groups)
      }

      // Get groups that belong to categories
      const groupsInCategories = new Set(categories.flatMap((c) => c.groups))

      // Get orphan groups (not in any category)
      const orphanGroups = groups.filter((g) => !groupsInCategories.has(g.id))

      return (
        <>
          {categories.map((category) => {
            const categoryGroups = getGroupsForCategory(category)
            const categoryEventIds = categoryGroups.flatMap((g) =>
              getEventsForGroup(g.id).map((e) => e.id)
            )
            const selectedInCategory = categoryEventIds.filter((id) =>
              selectedEvents.includes(id)
            )

            return (
              <div
                key={category.id}
                className="border border-[#E5E7EB] rounded-lg overflow-hidden"
              >
                {/* Category Header - no checkbox, just label */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F3F4F6]">
                        {category.icon}
                      </div>
                    )}
                    <span className="font-medium text-[#333333]">
                      {category.name}
                    </span>
                  </div>
                  {selectedInCategory.length > 0 && (
                    <span className="text-sm text-[#6B7280]">
                      {selectedInCategory.length} Selected
                    </span>
                  )}
                </div>
                {/* Category Groups */}
                <div className="p-4 space-y-3 bg-[#F9FAFB]">
                  {renderGroups(categoryGroups)}
                </div>
              </div>
            )
          })}
          {/* Render orphan groups outside categories */}
          {orphanGroups.length > 0 && (
            <div className="space-y-3">{renderGroups(orphanGroups)}</div>
          )}
        </>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#333333]">{title}</h3>
            {description && (
              <p className="text-sm text-[#6B7280] mt-1">{description}</p>
            )}
          </div>
          <span className="text-sm font-medium text-[#333333]">
            {totalSelected} Selected
          </span>
        </div>

        {/* Groups */}
        <div className="space-y-3">{renderCategories()}</div>
      </div>
    )
  }
)
EventSelector.displayName = "EventSelector"
`, prefix),
        },
        {
          name: 'event-group.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { Checkbox, type CheckedState } from "../checkbox"
import {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../collapsible"
import { EventItemComponent } from "./event-item"
import type { EventGroupComponentProps } from "./types"

/**
 * Event group with collapsible section and group-level checkbox
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
      className,
      ...props
    },
    ref
  ) => {
    // Calculate selection state for this group
    const groupEventIds = events.map((e) => e.id)
    const selectedInGroup = groupEventIds.filter((id) =>
      selectedEvents.includes(id)
    )
    const allSelected = groupEventIds.length > 0 && selectedInGroup.length === groupEventIds.length
    const someSelected = selectedInGroup.length > 0 && selectedInGroup.length < groupEventIds.length

    const checkboxState: CheckedState = allSelected
      ? true
      : someSelected
      ? "indeterminate"
      : false

    const selectedCount = selectedInGroup.length

    // Handle group checkbox click
    const handleGroupCheckbox = () => {
      if (allSelected) {
        // Deselect all events in this group
        onSelectionChange(selectedEvents.filter((id) => !groupEventIds.includes(id)))
      } else {
        // Select all events in this group
        const newSelection = [...selectedEvents]
        groupEventIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        onSelectionChange(newSelection)
      }
    }

    // Handle individual event selection
    const handleEventSelection = (eventId: string, selected: boolean) => {
      if (selected) {
        onSelectionChange([...selectedEvents, eventId])
      } else {
        onSelectionChange(selectedEvents.filter((id) => id !== eventId))
      }
    }

    return (
      <div
        ref={ref}
        className={cn("bg-[#F9FAFB] rounded-lg", className)}
        {...props}
      >
        <Collapsible type="multiple">
          <CollapsibleItem value={group.id}>
            <CollapsibleTrigger
              showChevron={true}
              className="w-full p-4 hover:bg-[#F3F4F6] rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={checkboxState}
                  onCheckedChange={handleGroupCheckbox}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={\`Select all \${group.name}\`}
                />
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {group.icon && (
                      <span className="text-[#6B7280]">{group.icon}</span>
                    )}
                    <span className="font-medium text-[#333333]">
                      {group.name}
                    </span>
                  </div>
                  <span className="text-sm text-[#6B7280] mt-0.5">
                    {group.description}
                  </span>
                </div>
                {selectedCount > 0 && (
                  <span className="text-sm text-[#6B7280] whitespace-nowrap">
                    {selectedCount} Selected
                  </span>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-[#E5E7EB]">
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
                  <div className="py-4 px-8">
                    {renderEmptyGroup(group)}
                  </div>
                ) : (
                  <div className="py-4 px-8 text-sm text-[#6B7280] italic">
                    {emptyGroupMessage}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </CollapsibleItem>
        </Collapsible>
      </div>
    )
  }
)
EventGroupComponent.displayName = "EventGroupComponent"
`, prefix),
        },
        {
          name: 'event-item.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { Checkbox } from "../checkbox"
import type { EventItemComponentProps } from "./types"

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
        "flex items-start gap-3 py-2 pl-8 pr-4",
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
        <div className="text-sm font-medium text-[#333333]">{event.name}</div>
        <div className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">
          {event.description}
        </div>
      </div>
    </div>
  )
})
EventItemComponent.displayName = "EventItemComponent"
`, prefix),
        },
        {
          name: 'types.ts',
          content: prefixTailwindClasses(`import * as React from "react"

/**
 * Represents an individual event item
 */
export interface EventItem {
  /** Unique identifier for the event */
  id: string
  /** Display name of the event (e.g., "Call.Initiated") */
  name: string
  /** Description of when this event is triggered */
  description: string
  /** Group ID this event belongs to */
  group: string
}

/**
 * Represents a group of events
 */
export interface EventGroup {
  /** Unique identifier for the group */
  id: string
  /** Display name of the group (e.g., "In-Call Events") */
  name: string
  /** Description of the group */
  description: string
  /** Optional icon to display next to the group name */
  icon?: React.ReactNode
}

/**
 * Optional top-level category that can contain multiple groups
 */
export interface EventCategory {
  /** Unique identifier for the category */
  id: string
  /** Display name of the category (e.g., "Call Events (Voice)") */
  name: string
  /** Optional icon to display next to the category name */
  icon?: React.ReactNode
  /** Array of group IDs that belong to this category */
  groups: string[]
}

/**
 * Props for the EventSelector component
 */
export interface EventSelectorProps {
  // Data
  /** Array of event items */
  events: EventItem[]
  /** Array of event groups */
  groups: EventGroup[]
  /** Optional array of categories for top-level grouping */
  categories?: EventCategory[]

  // State (controlled mode)
  /** Array of selected event IDs (controlled) */
  selectedEvents?: string[]
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void

  // State (uncontrolled mode)
  /** Default selected events for uncontrolled usage */
  defaultSelectedEvents?: string[]

  // Customization
  /** Title displayed at the top (default: "Events") */
  title?: string
  /** Description displayed below the title */
  description?: string
  /** Message shown when a group has no events */
  emptyGroupMessage?: string
  /** Custom render function for empty group state (overrides emptyGroupMessage) */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode

  // Styling
  /** Additional CSS classes for the root element */
  className?: string
}

/**
 * Internal props for EventGroup component
 */
export interface EventGroupComponentProps {
  /** The group data */
  group: EventGroup
  /** Events that belong to this group */
  events: EventItem[]
  /** Currently selected event IDs */
  selectedEvents: string[]
  /** Callback to update selected events */
  onSelectionChange: (selectedIds: string[]) => void
  /** Message shown when group has no events */
  emptyGroupMessage?: string
  /** Custom render function for empty group state */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode
}

/**
 * Internal props for EventItem component
 */
export interface EventItemComponentProps {
  /** The event data */
  event: EventItem
  /** Whether this event is selected */
  isSelected: boolean
  /** Callback when selection changes */
  onSelectionChange: (selected: boolean) => void
}
`, prefix),
        }
      ],
    },
    'key-value-input': {
      name: 'key-value-input',
      description: 'A component for managing key-value pairs with validation and duplicate detection',
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
      directory: 'key-value-input',
      mainFile: 'key-value-input.tsx',
      files: [
        {
          name: 'key-value-input.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../button"
import { KeyValueRow } from "./key-value-row"
import type { KeyValueInputProps, KeyValuePair } from "./types"

// Helper to generate unique IDs
const generateId = () =>
  \`kv-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`

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
      React.useState<KeyValuePair[]>(defaultValue)

    const isControlled = controlledValue !== undefined
    const pairs = isControlled ? controlledValue : internalPairs

    // Track which keys have been touched for validation
    const [touchedKeys, setTouchedKeys] = React.useState<Set<string>>(new Set())

    const handlePairsChange = React.useCallback(
      (newPairs: KeyValuePair[]) => {
        if (!isControlled) {
          setInternalPairs(newPairs)
        }
        onChange?.(newPairs)
      },
      [isControlled, onChange]
    )

    // Check for duplicate keys (case-insensitive)
    const getDuplicateKeys = React.useCallback((): Set<string> => {
      const keyCount = new Map<string, number>()
      pairs.forEach((pair) => {
        if (pair.key.trim()) {
          const key = pair.key.toLowerCase()
          keyCount.set(key, (keyCount.get(key) || 0) + 1)
        }
      })
      const duplicates = new Set<string>()
      keyCount.forEach((count, key) => {
        if (count > 1) duplicates.add(key)
      })
      return duplicates
    }, [pairs])

    const duplicateKeys = getDuplicateKeys()

    // Add new row
    const handleAdd = () => {
      if (pairs.length >= maxItems) return
      const newPair: KeyValuePair = {
        id: generateId(),
        key: "",
        value: "",
      }
      handlePairsChange([...pairs, newPair])
    }

    // Update key
    const handleKeyChange = (id: string, key: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, key } : pair))
      )
      setTouchedKeys((prev) => new Set(prev).add(id))
    }

    // Update value
    const handleValueChange = (id: string, value: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, value } : pair))
      )
    }

    // Delete row
    const handleDelete = (id: string) => {
      handlePairsChange(pairs.filter((pair) => pair.id !== id))
      setTouchedKeys((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }

    const isAtLimit = pairs.length >= maxItems
    const addButtonTitle = isAtLimit
      ? \`Maximum of \${maxItems} items allowed\`
      : undefined

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-[#333333]">{title}</h3>
          {description && (
            <p className="text-sm text-[#6B7280] mt-1">{description}</p>
          )}
        </div>

        {/* Content Container with Background - only show when there are items */}
        {pairs.length > 0 && (
          <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
            {/* Column Headers */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {keyLabel}
                  <span className="text-[#FF3B3B] ml-0.5">*</span>
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {valueLabel}
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
          <p className="text-xs text-[#6B7280] mt-2 text-center">
            Maximum of {maxItems} items reached
          </p>
        )}
      </div>
    )
  }
)
KeyValueInput.displayName = "KeyValueInput"
`, prefix),
        },
        {
          name: 'key-value-row.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Input } from "../input"
import { Button } from "../button"
import type { KeyValueRowProps } from "./types"

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
    // Determine if key input should show error state
    const keyHasError = isDuplicateKey || isKeyEmpty

    // Determine error message
    const errorMessage = isDuplicateKey
      ? "Duplicate key"
      : isKeyEmpty
      ? "Key is required"
      : null

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
            aria-label="Key"
          />
          {errorMessage && (
            <span className="text-xs text-[#FF3B3B] mt-1 block">
              {errorMessage}
            </span>
          )}
        </div>

        {/* Value Input */}
        <div className="flex-1">
          <Input
            value={pair.value}
            onChange={(e) => onValueChange(pair.id, e.target.value)}
            placeholder={valuePlaceholder}
            aria-label="Value"
          />
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(pair.id)}
          className="text-gray-400 hover:text-[#EF4444] hover:bg-[#FEF2F2] flex-shrink-0"
          aria-label="Delete row"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
KeyValueRow.displayName = "KeyValueRow"
`, prefix),
        },
        {
          name: 'types.ts',
          content: prefixTailwindClasses(`import * as React from "react"

/**
 * Represents a single key-value pair
 */
export interface KeyValuePair {
  /** Unique identifier for the pair */
  id: string
  /** The key (e.g., header name) */
  key: string
  /** The value (e.g., header value) */
  value: string
}

/**
 * Props for the KeyValueInput component
 */
export interface KeyValueInputProps {
  // Customization
  /** Title displayed at the top (e.g., "HTTP Headers") */
  title: string
  /** Description displayed below the title */
  description?: string
  /** Text for the add button (default: "Add Header") */
  addButtonText?: string
  /** Maximum number of items allowed (default: 10) */
  maxItems?: number
  /** Placeholder for key input */
  keyPlaceholder?: string
  /** Placeholder for value input */
  valuePlaceholder?: string
  /** Label for key column header (default: "Key") */
  keyLabel?: string
  /** Label for value column header (default: "Value") */
  valueLabel?: string

  // State (controlled mode)
  /** Array of key-value pairs (controlled) */
  value?: KeyValuePair[]
  /** Callback when pairs change */
  onChange?: (pairs: KeyValuePair[]) => void

  // State (uncontrolled mode)
  /** Default key-value pairs for uncontrolled usage */
  defaultValue?: KeyValuePair[]

  // Styling
  /** Additional CSS classes for the root element */
  className?: string
}

/**
 * Internal props for KeyValueRow component
 */
export interface KeyValueRowProps {
  /** The key-value pair data */
  pair: KeyValuePair
  /** Whether the key is a duplicate */
  isDuplicateKey: boolean
  /** Whether key is empty (for validation) */
  isKeyEmpty: boolean
  /** Placeholder for key input */
  keyPlaceholder?: string
  /** Placeholder for value input */
  valuePlaceholder?: string
  /** Callback when key changes */
  onKeyChange: (id: string, key: string) => void
  /** Callback when value changes */
  onValueChange: (id: string, value: string) => void
  /** Callback when row is deleted */
  onDelete: (id: string) => void
}
`, prefix),
        }
      ],
    }
  }
}
