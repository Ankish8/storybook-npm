import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Switch, type SwitchProps } from "./switch";

/**
 * Table size variants for row height.
 */
const tableVariants = cva(
  "w-full caption-bottom font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm text-[var(--v2-text-secondary,#5E5E5E)]",
  {
    variants: {
      size: {
        sm: "[&_td]:py-1.5 [&_th]:py-2 [&_tbody_tr]:h-12",
        md: "[&_td]:py-2 [&_th]:py-3 [&_tbody_tr]:h-[54px]",
        lg: "[&_td]:py-3 [&_th]:py-4 [&_tbody_tr]:h-[60px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

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
  /**
   * Keep the column headers visible while the rows scroll vertically. The table frame is the scroll
   * area, so it needs a height limit: set `--v2-table-max-height` (for example
   * `[--v2-table-max-height:320px]`) on any ancestor, or a max-height on its direct parent.
   * Without a limit the frame never scrolls and the header simply does not stick.
   */
  stickyHeader?: boolean;
}

// Collapsed borders do not travel with a stuck cell, so the header divider is drawn as an inset
// shadow on each header cell and the row border is removed. z-20 keeps the header above sticky
// body cells (z-10) when both scroll.
const stickyHeaderClasses =
  "[&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-20 [&>thead>tr>th]:bg-semantic-primary-surface [&>thead>tr>th]:shadow-[inset_0_-1px_0_0_var(--semantic-border-layout,#E9EAEB)] [&>thead>tr]:border-b-0";

const Table = React.forwardRef(
  (
    {
      className,
      size,
      withoutBorder,
      wrapContent,
      stickyHeader,
      ...props
    }: TableProps,
    ref: React.Ref<HTMLTableElement>
  ) => (
    <div
      className={cn(
        "relative w-full overflow-auto",
        // A custom property reaches the frame through any wrapper; `inherit` covers a max-height on the direct parent.
        stickyHeader && "max-h-[var(--v2-table-max-height,inherit)]",
        !withoutBorder &&
          "rounded-lg border border-solid border-semantic-border-layout"
      )}
    >
      <table
        ref={ref}
        className={cn(
          tableVariants({ size }),
          !wrapContent && "[&_th]:whitespace-nowrap [&_td]:whitespace-nowrap",
          stickyHeader && stickyHeaderClasses,
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef(
  (
    { className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>,
    ref: React.Ref<HTMLTableSectionElement>
  ) => (
    <thead
      ref={ref}
      className={cn(
        "bg-semantic-primary-surface [&_tr]:border-b [&_tr]:border-solid",
        className
      )}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Show skeleton loading state instead of children */
  isLoading?: boolean;
  /** Number of skeleton rows to display when loading (default: 5) */
  loadingRows?: number;
  /** Number of skeleton columns to display when loading (default: 5) */
  loadingColumns?: number;
}

const TableBody = React.forwardRef(
  (
    {
      className,
      isLoading,
      loadingRows = 5,
      loadingColumns = 5,
      children,
      ...props
    }: TableBodyProps,
    ref: React.Ref<HTMLTableSectionElement>
  ) => (
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

const TableFooter = React.forwardRef(
  (
    { className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>,
    ref: React.Ref<HTMLTableSectionElement>
  ) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-solid bg-semantic-primary-surface font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row with a colored background */
  highlighted?: boolean;
}

const TableRow = React.forwardRef(
  (
    { className, highlighted, ...props }: TableRowProps,
    ref: React.Ref<HTMLTableRowElement>
  ) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-solid border-semantic-border-layout transition-colors focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary",
        // Hover is gated so it never sticks after a tap. A selected row keeps its own tint under
        // the pointer, so selection and hover stay distinguishable (#ECF1FB vs #F5F5F5).
        highlighted
          ? "bg-semantic-info-surface"
          : "[@media(hover:hover)]:hover:bg-semantic-bg-ui data-[state=selected]:bg-semantic-info-surface data-[state=selected]:[@media(hover:hover)]:hover:bg-semantic-info-surface",
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
  /**
   * Mark the column as sortable even while it has no active sort: shows a faint chevrons glyph, a pointer cursor
   * and `aria-sort="none"`. Off by default so `sortDirection={null}` renders exactly like v1 (nothing).
   */
  sortable?: boolean;
  /** Show info icon with tooltip */
  infoTooltip?: string;
}

// Inline icons (lucide "chevrons-up-down" and "arrow-up" paths) keep Table free of an icon dependency.
const SORT_ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const TableHead = React.forwardRef(
  (
    {
      className,
      sticky,
      sortDirection,
      sortable,
      infoTooltip,
      children,
      "aria-sort": ariaSort,
      ...props
    }: TableHeadProps,
    ref: React.Ref<HTMLTableCellElement>
  ) => (
    <th
      ref={ref}
      // A host-supplied aria-sort wins, but an explicit undefined (a common conditional) falls back to the
      // derived value. `sortable` (opt-in) is what marks a column sortable-but-unsorted; null alone is v1's "no sort".
      aria-sort={
        ariaSort ??
        (sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : sortable
              ? "none"
              : undefined)
      }
      className={cn(
        "group/head h-[60px] px-6 text-left align-middle font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium uppercase tracking-[0.014px] text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-2 focus-visible:outline-semantic-primary [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-semantic-primary-surface z-10",
        (sortDirection || sortable) && "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortDirection && (
          // v1 renders the arrow as text and its tests query it, so the glyph stays in the DOM (hidden);
          // the visible 12px arrow turns over in 150ms and aria-sort carries the state for assistive tech.
          <span
            aria-hidden="true"
            className="relative inline-flex size-3 shrink-0 items-center justify-center text-[var(--v2-text-primary,#484848)]"
          >
            <span className="sr-only">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
            <svg
              {...SORT_ICON_PROPS}
              className={cn(
                "size-3 transition-transform [transition-duration:150ms] [transition-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none",
                sortDirection === "desc" && "rotate-180"
              )}
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </span>
        )}
        {sortable && !sortDirection && (
          <svg
            {...SORT_ICON_PROPS}
            className="size-3 shrink-0 text-[var(--v2-text-muted,#707070)] opacity-40 transition-opacity [transition-duration:150ms] [@media(hover:hover)]:group-hover/head:opacity-100"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
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
  (
    { className, sticky, ...props }: TableCellProps,
    ref: React.Ref<HTMLTableCellElement>
  ) => (
    <td
      ref={ref}
      className={cn(
        "px-6 align-middle font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm text-[var(--v2-text-secondary,#5E5E5E)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-2 focus-visible:outline-semantic-primary [&:has([role=checkbox])]:pr-0",
        sticky && "sticky left-0 bg-semantic-bg-primary z-10",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(
  (
    { className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>,
    ref: React.Ref<HTMLTableCaptionElement>
  ) => (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm text-[var(--v2-text-muted,#707070)]",
        className
      )}
      {...props}
    />
  )
);
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

// Each row starts its pulse 60ms after the one above, so loading reads as a soft top-to-bottom wave.
// Pulse stays (v1 pins the animate-pulse class). The delay goes through a custom property because a
// host stylesheet that marks utilities !important would beat an inline animation-delay.
const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <div
              className="h-4 bg-semantic-bg-grey rounded animate-pulse motion-reduce:animate-none [animation-delay:var(--v2-skeleton-delay,0ms)]"
              style={
                {
                  width:
                    colIndex === 1 ? "80%" : colIndex === 2 ? "30%" : "60%",
                  "--v2-skeleton-delay": `${rowIndex * 60}ms`,
                } as React.CSSProperties
              }
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
      className="text-center py-8 text-[var(--v2-text-muted,#707070)]"
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
    className="w-7 h-7 rounded-full flex items-center justify-center text-semantic-text-inverted text-xs font-medium"
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
  (
    { size = "sm", ...props }: TableToggleProps,
    ref: React.Ref<HTMLButtonElement>
  ) => <Switch ref={ref} size={size} {...props} />
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
