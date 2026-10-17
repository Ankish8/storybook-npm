import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Switch, type SwitchProps } from "./switch";
import { Avatar } from "./avatar";

/**
 * Table size variants for row height.
 */
const tableVariants = cva(
  "w-full caption-bottom font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,var(--semantic-text-primary))]",
  {
    variants: {
      size: {
        sm: "[&_td]:py-1.5 [&_th]:py-2 [&_tbody_tr]:h-12",
        md: "[&_td]:py-2 [&_th]:py-3 [&_tbody_tr]:h-[52px]",
        lg: "[&_td]:py-3 [&_th]:py-4 [&_tbody_tr]:h-[60px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type TableSortDirection = "asc" | "desc";

export interface TableSort<Key extends string = string> {
  key: Key;
  direction: TableSortDirection;
}

export type TableSortValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export interface TableSortColumn<Row> {
  /** Use the underlying value, rather than a formatted cell label. */
  value: (row: Row) => TableSortValue;
  /** Override the default numeric / natural text comparison for this column. */
  compare?: (left: Row, right: Row) => number;
}

// Defers inference to the column keys without requiring TypeScript 5.4's global NoInfer.
type TableNoInfer<Value> = [Value][Value extends unknown ? 0 : never];

export interface UseTableSortOptions<Row, Key extends string> {
  columns: Record<Key, TableSortColumn<Row>>;
  /** Set to null for a controlled table in its original order. */
  sort?: TableSort<TableNoInfer<Key>> | null;
  defaultSort?: TableSort<TableNoInfer<Key>> | null;
  onSortChange?: (sort: TableSort<TableNoInfer<Key>> | null) => void;
}

const tableCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function comparableTableValue(value: TableSortValue) {
  return value instanceof Date ? value.getTime() : value;
}

function isEmptyTableValue(value: ReturnType<typeof comparableTableValue>) {
  return (
    value == null ||
    value === "" ||
    (typeof value === "number" && Number.isNaN(value))
  );
}

/**
 * Optional sorting for a composed Table. Input records are never mutated; ties
 * retain their input order, and clearing the sort restores that order.
 */
function useTableSort<Row, Key extends string>(
  data: readonly Row[],
  {
    columns,
    sort: controlledSort,
    defaultSort,
    onSortChange,
  }: UseTableSortOptions<Row, Key>
) {
  const [internalSort, setInternalSort] = React.useState<TableSort<Key> | null>(
    defaultSort ?? null
  );
  const sort = controlledSort === undefined ? internalSort : controlledSort;
  const rows = React.useMemo(() => {
    if (!sort || !columns[sort.key]) return [...data];
    const column = columns[sort.key];
    return data
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        let comparison: number;
        if (column.compare) {
          comparison = column.compare(left.row, right.row);
        } else {
          const a = comparableTableValue(column.value(left.row));
          const b = comparableTableValue(column.value(right.row));
          const aEmpty = isEmptyTableValue(a);
          const bEmpty = isEmptyTableValue(b);
          // Empty values stay at the end in either direction.
          if (aEmpty || bEmpty) {
            return aEmpty === bEmpty
              ? left.index - right.index
              : aEmpty
                ? 1
                : -1;
          }
          comparison =
            typeof a === "number" && typeof b === "number"
              ? a === b
                ? 0
                : a < b
                  ? -1
                  : 1
              : typeof a === "boolean" && typeof b === "boolean"
                ? Number(a) - Number(b)
                : tableCollator.compare(String(a), String(b));
        }
        if (Number.isNaN(comparison)) comparison = 0;
        return (
          (sort.direction === "asc" ? comparison : -comparison) ||
          left.index - right.index
        );
      })
      .map(({ row }) => row);
  }, [columns, data, sort]);

  const setSort = React.useCallback(
    (next: TableSort<Key> | null) => {
      if (controlledSort === undefined) setInternalSort(next);
      onSortChange?.(next);
    },
    [controlledSort, onSortChange]
  );
  const sortBy = React.useCallback(
    (key: Key, direction?: TableSortDirection | null) => {
      const nextDirection =
        direction === undefined
          ? sort?.key !== key
            ? "asc"
            : sort.direction === "asc"
              ? "desc"
              : null
          : direction;
      setSort(nextDirection ? { key, direction: nextDirection } : null);
    },
    [setSort, sort]
  );
  const resetSort = React.useCallback(() => setSort(null), [setSort]);
  const getSortDirection = (key: Key) =>
    sort?.key === key ? sort.direction : null;

  return { rows, sort, sortBy, resetSort, getSortDirection };
}

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
  "[&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-20 [&>thead>tr>th]:bg-semantic-primary-surface [&>thead>tr>th]:shadow-[inset_0_-1px_0_0_var(--semantic-border-layout)] [&>thead>tr]:border-b-0";

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
        "relative w-full min-w-0 max-w-full overflow-auto",
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
        "bg-semantic-primary-surface [&_tr]:border-b [&_tr]:border-solid [&_tr]:border-semantic-border-layout",
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
  /** Animate existing keyed rows when their order changes. Off by default. */
  animateRows?: boolean;
}

const TableBody = React.forwardRef(
  (
    {
      className,
      isLoading,
      loadingRows = 5,
      loadingColumns = 5,
      animateRows = false,
      children,
      "aria-busy": ariaBusy,
      ...props
    }: TableBodyProps,
    ref: React.ForwardedRef<HTMLTableSectionElement>
  ) => {
    const bodyRef = React.useRef<HTMLTableSectionElement | null>(null);
    const previousPositions = React.useRef(
      new Map<HTMLTableRowElement, number>()
    );
    const setRef = React.useCallback(
      (node: HTMLTableSectionElement | null) => {
        bodyRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLTableSectionElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              bodyRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useLayoutEffect(() => {
      const body = bodyRef.current;
      if (!body) return;
      const top = body.getBoundingClientRect().top;
      const nextPositions = new Map<HTMLTableRowElement, number>();
      const animations: Animation[] = [];
      const reducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;
      Array.from(body.rows).forEach((row) => {
        const position = row.getBoundingClientRect().top - top;
        nextPositions.set(row, position);
        const previous = previousPositions.current.get(row);
        if (
          !animateRows ||
          isLoading ||
          reducedMotion ||
          previous === undefined ||
          !row.animate
        )
          return;
        // Keep motion local and short even when a row moves across a large table.
        const delta = Math.max(-80, Math.min(80, previous - position));
        if (Math.abs(delta) < 1) return;
        const baseTransform = window.getComputedStyle(row).transform || "none";
        animations.push(
          row.animate(
            [
              {
                transform: `translateY(${delta}px) ${baseTransform === "none" ? "" : baseTransform}`,
              },
              { transform: baseTransform },
            ],
            { duration: 240, easing: "cubic-bezier(0.22,1,0.36,1)" }
          )
        );
      });
      previousPositions.current = nextPositions;
      // Runs before the next layout measurement and on unmount; rapid sorts never stack transforms.
      return () => animations.forEach((animation) => animation.cancel());
    }, [animateRows, children, isLoading]);

    return (
      <tbody
        ref={setRef}
        aria-busy={ariaBusy ?? (isLoading || undefined)}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      >
        {isLoading ? (
          <TableSkeleton rows={loadingRows} columns={loadingColumns} />
        ) : (
          children
        )}
      </tbody>
    );
  }
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
        "border-t border-solid border-semantic-border-layout bg-semantic-primary-surface font-medium [&>tr]:last:border-b-0",
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
  ) => {
    return (
      <tr
        ref={ref}
        data-highlighted={highlighted || undefined}
        className={cn(
          "group/table-row border-b border-solid border-semantic-border-layout transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary",
          // Hover is gated so it never sticks after a tap. A selected row keeps its own tint under
          // the pointer, so selection and hover stay distinguishable (#ECF1FB vs #F5F5F5).
          highlighted
            ? "bg-semantic-info-surface"
            : "[@media(hover:hover)]:hover:bg-semantic-bg-ui data-[state=selected]:bg-semantic-info-surface data-[state=selected]:[@media(hover:hover)]:hover:bg-semantic-info-surface",
          className
        )}
        {...props}
      />
    );
  }
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
  /** Opt in to a native sort button. Cycles ascending → descending → unsorted. */
  onSortChange?: (direction: TableSortDirection | null) => void;
  /** Disable the built-in sort button without affecting other column content. */
  sortDisabled?: boolean;
  /** Accessible name for a sort button when the header content needs a shorter label. */
  sortLabel?: string;
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
      onSortChange,
      sortDisabled = false,
      sortLabel,
      infoTooltip,
      children,
      scope,
      onClick,
      onKeyDown,
      "aria-sort": ariaSort,
      ...props
    }: TableHeadProps,
    ref: React.Ref<HTMLTableCellElement>
  ) => {
    const descriptionId = React.useId();
    const canSort = sortable || !!onSortChange;
    const nextDirection =
      sortDirection === "asc"
        ? "desc"
        : sortDirection === "desc"
          ? null
          : "asc";
    const indicator = (sortDirection || canSort) && (
      <span
        aria-hidden="true"
        className="relative inline-flex size-4 shrink-0 items-center justify-center text-[var(--v2-text-primary,var(--semantic-text-primary))]"
      >
        {sortDirection && (
          <span className="sr-only">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
        <svg
          {...SORT_ICON_PROPS}
          strokeWidth={1.75}
          className={cn(
            "size-4 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
            sortDirection
              ? "scale-100 opacity-100"
              : "text-semantic-text-muted opacity-40 group-focus-within/head:opacity-100 [@media(hover:hover)]:group-hover/head:opacity-70",
            sortDirection === "desc" && "rotate-180"
          )}
        >
          {sortDirection ? (
            <>
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </>
          ) : (
            <>
              <path d="m8 9 4-4 4 4" />
              <path d="m8 15 4 4 4-4" />
            </>
          )}
        </svg>
      </span>
    );

    return (
      <th
        ref={ref}
        scope={scope ?? (onSortChange ? "col" : undefined)}
        // Host attributes retain priority. Null by itself keeps v1's indicator-free header.
        aria-sort={
          ariaSort ??
          (sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : canSort
                ? "none"
                : undefined)
        }
        className={cn(
          "group/head h-11 px-4 text-left align-middle font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium tracking-[-0.01em] text-[var(--v2-text-muted,var(--semantic-text-muted))] transition-colors duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-2 focus-visible:outline-semantic-primary [&:has([role=checkbox])]:pr-0",
          sticky && "sticky left-0 bg-semantic-primary-surface z-10",
          sortDirection &&
            "text-[var(--v2-text-primary,var(--semantic-text-primary))]",
          (sortDirection || canSort) &&
            !sortDisabled &&
            "cursor-pointer select-none",
          className
        )}
        onClick={(event) => {
          // Calling the host first makes preventDefault a reliable sorting veto.
          onClick?.(event);
          if (event.defaultPrevented || sortDisabled || !onSortChange) return;
          const button = event.currentTarget.querySelector(
            "[data-table-sort-button]"
          );
          if (button?.contains(event.target as Node))
            onSortChange(nextDirection);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            !onSortChange ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
          )
            return;
          const target = event.target as HTMLElement;
          if (!target.matches("[data-table-sort-button]")) return;
          const row = event.currentTarget.closest("tr");
          const buttons = Array.from(
            row?.querySelectorAll<HTMLButtonElement>(
              "[data-table-sort-button]:not(:disabled)"
            ) ?? []
          );
          const index = buttons.indexOf(target as HTMLButtonElement);
          const rtl = row && window.getComputedStyle(row).direction === "rtl";
          const nextIndex =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? buttons.length - 1
                : event.key === "ArrowRight"
                  ? index + (rtl ? -1 : 1)
                  : event.key === "ArrowLeft"
                    ? index + (rtl ? 1 : -1)
                    : -1;
          const next = buttons[nextIndex];
          if (next) {
            event.preventDefault();
            next.focus();
          }
        }}
        {...props}
      >
        <div className="flex items-center gap-1.5">
          {onSortChange ? (
            <>
              <button
                type="button"
                data-table-sort-button=""
                disabled={sortDisabled}
                aria-label={sortLabel}
                aria-describedby={descriptionId}
                className="m-0 relative -my-1 inline-flex min-h-7 min-w-0 items-center gap-1.5 rounded-sm bg-transparent p-0 text-left [font:inherit] text-inherit before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-border-focus disabled:cursor-not-allowed disabled:opacity-50"
              >
                {children}
                {indicator}
              </button>
              <span id={descriptionId} hidden>
                {sortDirection === "asc"
                  ? "Sorted ascending."
                  : sortDirection === "desc"
                    ? "Sorted descending."
                    : "Not sorted."}{" "}
                {nextDirection === null
                  ? "Activate to restore the original order."
                  : nextDirection === "asc"
                    ? "Activate to sort ascending."
                    : "Activate to sort descending."}
              </span>
            </>
          ) : (
            <>
              {children}
              {indicator}
            </>
          )}
          {infoTooltip && (
            <span
              className="text-semantic-text-muted cursor-help"
              title={infoTooltip}
            >
              ⓘ
            </span>
          )}
        </div>
      </th>
    );
  }
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
        "px-4 align-middle font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,var(--semantic-text-primary))] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-2 focus-visible:outline-semantic-primary [&:has([role=checkbox])]:pr-0",
        sticky &&
          "sticky left-0 bg-semantic-bg-primary z-10 [@media(hover:hover)]:group-hover/table-row:bg-semantic-bg-ui group-data-[state=selected]/table-row:bg-semantic-info-surface group-data-[highlighted=true]/table-row:bg-semantic-info-surface",
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
        "mt-4 text-sm text-[var(--v2-text-muted,var(--semantic-text-muted))]",
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
      className="h-[120px] text-center py-8 text-[var(--v2-text-muted,var(--semantic-text-muted))]"
    >
      {children ?? "No data available"}
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

const TableAvatar = ({ initials, color }: TableAvatarProps) => (
  <Avatar
    initials={initials}
    size="sm"
    variant={color ? "filled" : "soft"}
    className={cn(
      "size-7",
      color &&
        "bg-[var(--table-avatar-color)] border-[color:var(--table-avatar-color)]"
    )}
    style={
      color
        ? ({ "--table-avatar-color": color } as React.CSSProperties)
        : undefined
    }
  />
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
  useTableSort,
};
