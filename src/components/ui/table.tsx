import * as React from "react"
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

/**
 * Table component for displaying tabular data.
 *
 * @example
 * ```tsx
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
 * ```
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
