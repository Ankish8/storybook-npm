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
  // Badge component content
  const badgeContent = prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors",
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
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
`, prefix)

  // Tag component content
  const tagContent = prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center justify-center rounded text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#333333]",
        primary: "bg-[#343E55]/10 text-[#343E55]",
        secondary: "bg-[#E5E7EB] text-[#374151]",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1.5",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[#E5E7EB] active:bg-[#D1D5DB]",
        false: "",
      },
      selected: {
        true: "ring-2 ring-[#343E55] ring-offset-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      selected: false,
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  label?: string
  interactive?: boolean
  selected?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, interactive, selected, label, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, interactive, selected, className }))}
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-selected={selected}
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

export { Tag, tagVariants }
`, prefix)

  // Table component content
  const tableContent = prefixTailwindClasses(`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

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
        "h-12 px-4 text-left align-middle font-medium text-[#6B7280] text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0",
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
  tableVariants,
}
`, prefix)

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
    badge: {
      name: 'badge',
      description: 'A status badge component with active, failed, and disabled variants',
      dependencies: [
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      files: [
        {
          name: 'badge.tsx',
          content: badgeContent,
        },
      ],
    },
    tag: {
      name: 'tag',
      description: 'A tag component for event labels with optional bold label prefix',
      dependencies: [
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      files: [
        {
          name: 'tag.tsx',
          content: tagContent,
        },
      ],
    },
    table: {
      name: 'table',
      description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support',
      dependencies: [
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      files: [
        {
          name: 'table.tsx',
          content: tableContent,
        },
      ],
    },
  }
}
