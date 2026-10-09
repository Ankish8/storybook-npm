import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "./button";

export interface PaginationProps extends React.ComponentProps<"nav"> {
  /** Additional CSS classes for the nav wrapper */
  className?: string;
}

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full justify-center gap-3 p-2.5 font-[family-name:var(--font-v2,Inter,sans-serif)]",
        className
      )}
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

export interface PaginationContentProps extends React.ComponentProps<"ul"> {
  /** Additional CSS classes for the list container */
  className?: string;
}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => {
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const composedRef = React.useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  const useBrowserLayoutEffect =
    typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
  useBrowserLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="pagination-link"][data-active="true"]'
      );
      if (!active) {
        list.removeAttribute("data-page-indicator");
        return;
      }
      const rect = active.getBoundingClientRect();
      const bounds = list.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      list.style.setProperty(
        "--v2-page-x",
        `${rect.left - bounds.left + list.scrollLeft - list.clientLeft}px`
      );
      list.style.setProperty(
        "--v2-page-y",
        `${rect.top - bounds.top + list.scrollTop - list.clientTop}px`
      );
      list.style.setProperty("--v2-page-width", `${rect.width}px`);
      list.style.setProperty("--v2-page-height", `${rect.height}px`);
      list.setAttribute("data-page-indicator", "true");
    };
    const mutations = new MutationObserver(measure);
    mutations.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-active"],
    });
    const resize =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    resize?.observe(list);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <ul
      ref={composedRef}
      data-slot="pagination-content"
      className={cn(
        "relative isolate flex flex-row items-center gap-1 list-none m-0 p-0",
        "before:pointer-events-none before:absolute before:left-0 before:top-0 before:-z-10 before:h-[var(--v2-page-height,0px)] before:w-[var(--v2-page-width,0px)] before:translate-x-[var(--v2-page-x,0px)] before:translate-y-[var(--v2-page-y,0px)] before:rounded-lg before:border before:border-solid before:border-semantic-border-layout before:bg-semantic-bg-primary before:shadow-[0_1px_2px_rgba(0,0,0,0.035)] before:content-[''] before:opacity-0 data-[page-indicator=true]:before:opacity-100 before:transition-[transform,width,height] before:[transition-duration:800ms] before:[transition-timing-function:linear(0,0.0408,0.1369,0.2586,0.3863,0.5079,0.6169,0.7102,0.7872,0.8488,0.8966,0.9327,0.9591,0.9778,0.9906,0.9989,1.0038,1.0065,1.0076,1.0077,1.0071,1.0063,1.0053,1.0043,1.0034,1.0026,1.002,1.0014,1.001,1.0007,1.0004,1.0002,1)] motion-reduce:before:transition-none",
        // The mark travels on Arc's morph spring (stiffness 155, damping ratio 0.84), sampled as linear() over 800ms.
        "[&[data-page-indicator=true]_[data-active=true]]:border-transparent [&[data-page-indicator=true]_[data-active=true]]:bg-transparent [&[data-page-indicator=true]_[data-active=true]]:shadow-none",
        className
      )}
      {...props}
    />
  );
});
PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps extends React.ComponentProps<"li"> {
  /** Additional CSS classes for the list item */
  className?: string;
}

function PaginationItem({ ...props }: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />;
}
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps
  extends Pick<ButtonProps, "size">, React.ComponentProps<"a"> {
  /** Highlights the link as the current page */
  isActive?: boolean;
  /** Size of the link (uses Button size variants) */
  size?: ButtonProps["size"];
  /** Additional CSS classes */
  className?: string;
}

function PaginationLink({
  className,
  isActive,
  size = "icon-sm",
  onClick,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      onClick={(event) => {
        if (
          props["aria-disabled"] === true ||
          props["aria-disabled"] === "true"
        ) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        // Arc's page button: 12px tabular numerals at regular weight, colour and fill fade in 160ms, and only the
        // arrows press (0.96, see PaginationPrevious/Next). The ghost fill and text hover are re-declared behind
        // (hover: hover) so a tapped link does not stay tinted on touch screens.
        "tabular-nums text-xs font-normal active:scale-100 transition-[background-color,color,opacity,transform] [transition-duration:160ms,160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]",
        isActive
          ? "bg-semantic-bg-primary text-[var(--v2-text-primary,#484848)] shadow-[0_1px_2px_rgba(0,0,0,0.035)] [@media(hover:hover)]:hover:bg-semantic-bg-primary"
          : "text-[var(--v2-text-secondary,#5E5E5E)] hover:bg-transparent [@media(hover:hover)]:hover:bg-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)]",
        className
      )}
      {...props}
      tabIndex={
        props["aria-disabled"] === true || props["aria-disabled"] === "true"
          ? -1
          : props.tabIndex
      }
    />
  );
}
PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps extends PaginationLinkProps {
  /** Additional CSS classes */
  className?: string;
  /** Disables the previous button */
  disabled?: boolean;
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      aria-disabled={disabled}
      size="sm"
      className={cn(
        "gap-1 px-2.5 sm:pl-2.5 text-sm leading-5 tracking-[0.014px]",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "active:scale-[0.96] active:[transition-duration:160ms,160ms,160ms,100ms] active:[transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),ease-out]",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps extends PaginationLinkProps {
  /** Additional CSS classes */
  className?: string;
  /** Disables the next button */
  disabled?: boolean;
}

function PaginationNext({
  className,
  disabled,
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      aria-disabled={disabled}
      size="sm"
      className={cn(
        "gap-1 px-2.5 sm:pr-2.5 text-sm leading-5 tracking-[0.014px]",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "active:scale-[0.96] active:[transition-duration:160ms,160ms,160ms,100ms] active:[transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),ease-out]",
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
  /** Additional CSS classes */
  className?: string;
}

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export interface PaginationInfoProps extends React.ComponentProps<"p"> {
  /** Current page (1-based) */
  currentPage: number;
  /** Number of items shown per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Leading label before the range (default: "Showing") */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  label = "Showing",
  className,
  ...props
}: PaginationInfoProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <p
      data-slot="pagination-info"
      aria-live="polite"
      className={cn(
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm tabular-nums text-[var(--v2-text-muted,#707070)] whitespace-nowrap",
        className
      )}
      {...props}
    >
      {label}{" "}
      <span className="font-medium text-[var(--v2-text-primary,#484848)]">
        {startItem}–{endItem} of {totalItems}
      </span>
    </p>
  );
}
PaginationInfo.displayName = "PaginationInfo";

export interface PaginationWidgetProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the user navigates to a new page */
  onPageChange: (page: number) => void;
  /** Number of pages shown on each side of current page (default: 1) */
  siblingCount?: number;
  /** Total number of items — required to render the "Showing X-Y of Z" summary */
  totalItems?: number;
  /** Items per page — required to render the "Showing X-Y of Z" summary */
  pageSize?: number;
  /** Horizontal placement of the page controls (default: "center", or "end" when the summary is shown) */
  align?: "start" | "center" | "end";
  /** Additional CSS classes for the outer wrapper */
  className?: string;
}

function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  if (totalPages <= 1) return [1];

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: (number | "ellipsis")[] = [1];

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  } else {
    // fill in pages between 1 and leftSibling if no ellipsis
    for (let p = 2; p < leftSibling; p++) pages.push(p);
  }

  pages.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let p = rightSibling + 1; p < totalPages; p++) pages.push(p);
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

const paginationAlignClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const;

function PaginationWidget({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  totalItems,
  pageSize,
  align,
  className,
}: PaginationWidgetProps) {
  const pages = usePaginationRange(currentPage, totalPages, siblingCount);
  const showInfo = totalItems !== undefined && pageSize !== undefined;
  const resolvedAlign = align ?? (showInfo ? "end" : "center");

  const controls = (
    <Pagination
      className={cn(
        "mx-0 w-auto",
        paginationAlignClasses[resolvedAlign],
        !showInfo && "w-full",
        showInfo && "p-0",
        !showInfo && className
      )}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  if (!showInfo) return controls;

  return (
    <div
      data-slot="pagination-widget"
      className={cn(
        "flex w-full flex-col items-start gap-3 p-2.5 font-[family-name:var(--font-v2,Inter,sans-serif)] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <PaginationInfo
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
      />
      {controls}
    </div>
  );
}
PaginationWidget.displayName = "PaginationWidget";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInfo,
  PaginationWidget,
};
