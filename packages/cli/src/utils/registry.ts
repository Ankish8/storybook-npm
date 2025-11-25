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
  return {
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
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
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
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
        ghost: "hover:bg-[#343E55]/10 hover:text-[#343E55]",
        link: "text-[#343E55] underline-offset-4 hover:underline",
      },
      size: {
        default: "py-2.5 px-4",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-6",
        icon: "p-2.5",
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
  "inline-flex items-center justify-center rounded text-sm transition-colors",
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

/**
 * Tag component for displaying event labels and categories.
 *
 * @example
 * \`\`\`tsx
 * <Tag>After Call Event</Tag>
 * <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
 * <Tag interactive onClick={() => console.log('clicked')}>Clickable</Tag>
 * \`\`\`
 */
export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Bold label prefix displayed before the content */
  label?: string
  /** Make the tag clickable with hover/active states */
  interactive?: boolean
  /** Show selected state with ring outline */
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
`, prefix),
        },
      ],
    }
  }
}
