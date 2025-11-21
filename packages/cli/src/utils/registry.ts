export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  dependencies: string[]
  files: ComponentFile[]
}

export type Registry = Record<string, ComponentDefinition>

// Function to prefix Tailwind classes within quoted strings
function prefixTailwindClasses(content: string, prefix: string): string {
  if (!prefix) return content

  // For Tailwind v3, use prefix as-is
  // Note: Tailwind v4 with Bootstrap uses no prefix (selective imports don't support prefix())
  const cleanPrefix = prefix

  // Process content within double-quoted strings that look like CSS classes
  return content.replace(/"([^"]+)"/g, (match, classString) => {
    // Skip import paths (start with @ or . or contain ::)
    if (classString.startsWith('@') || classString.startsWith('.') || classString.includes('::')) {
      return match
    }

    // Skip npm package names (lowercase letters, numbers, hyphens, and @ scopes)
    // These are typically import statements like "class-variance-authority", "lucide-react"
    if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(classString)) {
      return match
    }

    // Skip simple identifiers (no spaces, hyphens, colons, or brackets - not Tailwind classes)
    if (!classString.includes(' ') && !classString.includes('-') && !classString.includes(':') && !classString.includes('[')) {
      return match
    }

    // Prefix each class
    const prefixedClasses = classString
      .split(' ')
      .map((cls: string) => {
        if (!cls) return cls

        // Handle variant prefixes like hover:, focus:, sm:, etc.
        const variantMatch = cls.match(/^([a-z-]+:)+/)
        if (variantMatch) {
          const variants = variantMatch[0]
          const utility = cls.slice(variants.length)
          // Prefix the utility part, keep variants as-is
          if (utility.startsWith('-')) {
            return `${variants}-${cleanPrefix}${utility.slice(1)}`
          }
          return `${variants}${cleanPrefix}${utility}`
        }

        // Handle negative values like -mt-4
        if (cls.startsWith('-')) {
          return `-${cleanPrefix}${cls.slice(1)}`
        }

        // Handle arbitrary selector values like [&_svg]:pointer-events-none
        if (cls.startsWith('[&')) {
          const closeBracket = cls.indexOf(']:')
          if (closeBracket !== -1) {
            const selector = cls.slice(0, closeBracket + 2)
            const utility = cls.slice(closeBracket + 2)
            return `${selector}${cleanPrefix}${utility}`
          }
          return cls
        }

        // Regular class (including arbitrary values like bg-[#343E55])
        return `${cleanPrefix}${cls}`
      })
      .join(' ')

    return `"${prefixedClasses}"`
  })
}

// In a real implementation, this would fetch from a remote URL
// For now, we'll embed the components directly
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  const buttonContent = prefixTailwindClasses(`import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e293b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#343E55] text-white border-0 hover:bg-[#343E55]/90",
        destructive:
          "bg-[#ef4444] text-white border-0 hover:bg-[#ef4444]/90",
        outline:
          "border border-[#343E55] bg-transparent text-[#343E55] hover:bg-[#343E55] hover:text-white",
        secondary:
          "bg-[#343E55]/20 text-[#343E55] border-0 hover:bg-[#343E55]/30",
        ghost: "border-0 hover:bg-[#343E55]/10 hover:text-[#343E55]",
        link: "text-[#343E55] border-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
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
`, prefix)

  return {
    button: {
      name: 'button',
      description: 'A customizable button component with variants, sizes, and icons',
      dependencies: [
        '@radix-ui/react-slot',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'lucide-react',
      ],
      files: [
        {
          name: 'button.tsx',
          content: buttonContent,
        },
      ],
    },
  }
}
