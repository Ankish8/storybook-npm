import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
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
