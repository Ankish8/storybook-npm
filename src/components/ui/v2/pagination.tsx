"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
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
      const active = Array.from(
        list.querySelectorAll<HTMLElement>(
          '[data-slot="pagination-link"][data-active="true"]'
        )
      ).find((link) => !link.closest('[aria-hidden="true"], [inert]'));
      if (!active) {
        list.removeAttribute("data-page-indicator");
        return;
      }
      const rect = active.getBoundingClientRect();
      const bounds = list.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      list.style.setProperty(
        "--v2-page-x",
        `${active.parentElement?.hasAttribute("data-window-page") ? active.parentElement.offsetLeft + active.offsetLeft : rect.left - bounds.left + list.scrollLeft - list.clientLeft}px`
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
      attributeFilter: ["data-active", "aria-hidden", "inert"],
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
        "before:pointer-events-none before:absolute before:left-0 before:top-0 before:-z-10 before:h-[var(--v2-page-height,0px)] before:w-[var(--v2-page-width,0px)] before:translate-x-[var(--v2-page-x,0px)] before:translate-y-[var(--v2-page-y,0px)] before:rounded-lg before:border before:border-solid before:border-semantic-primary before:bg-semantic-primary before:shadow-[0_1px_2px_rgba(0,0,0,0.035)] before:content-[''] before:opacity-0 data-[page-indicator=true]:before:opacity-100 before:transition-[transform,width,height] before:[transition-duration:800ms] before:[transition-timing-function:linear(0,0.0408,0.1369,0.2586,0.3863,0.5079,0.6169,0.7102,0.7872,0.8488,0.8966,0.9327,0.9591,0.9778,0.9906,0.9989,1.0038,1.0065,1.0076,1.0077,1.0071,1.0063,1.0053,1.0043,1.0034,1.0026,1.002,1.0014,1.001,1.0007,1.0004,1.0002,1)] motion-reduce:before:transition-none",
        // The mark travels on Arc's morph spring (stiffness 155, damping ratio 0.84), sampled as linear() over 800ms.
        "[&[data-page-indicator=true]_[data-active=true]]:border-transparent [&[data-page-indicator=true]_[data-active=true]]:bg-transparent [&[data-page-indicator=true]_[data-active=true]]:shadow-none [@media(hover:hover)_and_(pointer:fine)]:[&[data-page-indicator=true]_[data-active=true]:hover:not([aria-disabled=true])]:bg-semantic-primary-hover",
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
  onAuxClick,
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
      onAuxClick={(event) => {
        if (
          props["aria-disabled"] === true ||
          props["aria-disabled"] === "true"
        ) {
          event.preventDefault();
          return;
        }
        onAuxClick?.(event);
      }}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        // The selected page and enabled hover use contrasting semantic fills. Hover stays
        // behind fine-pointer media queries so touch never keeps a hovered tint. Only
        // arrows press (0.96); the traveling indicator and window spring remain unchanged.
        "tabular-nums text-xs font-normal active:scale-100 transition-[background-color,color,opacity,transform] [transition-duration:160ms,160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]",
        "motion-reduce:transition-none motion-reduce:active:transform-none",
        isActive
          ? "bg-semantic-primary text-semantic-text-inverted shadow-[0_1px_2px_rgba(0,0,0,0.035)]"
          : "text-[var(--v2-text-secondary,#5E5E5E)]",
        "[@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-semantic-primary-hover [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:text-semantic-text-inverted",
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
      <ChevronLeftIcon className="rtl:rotate-180" aria-hidden="true" />
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
      <ChevronRightIcon className="rtl:rotate-180" aria-hidden="true" />
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
  /** Opt in to a sliding, continuous window of 3–9 pages. Unset keeps the v1 ellipsis range. */
  pageWindow?: number;
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

// Stable page keys let existing numbers travel horizontally as the window moves.
// The outgoing links leave the accessibility tree and tab order immediately.
const WindowPage = React.forwardRef<
  HTMLLIElement,
  {
    page: number;
    currentPage: number;
    shift: number;
    reduced: boolean;
    onPageChange: (page: number) => void;
  }
>(({ page, currentPage, shift, reduced, onPageChange }, ref) => {
  const present = useIsPresent();
  return (
    <motion.li
      ref={ref}
      data-slot="pagination-item"
      data-window-page=""
      aria-hidden={present ? undefined : true}
      className="relative shrink-0"
      layout={reduced ? false : "position"}
      custom={shift}
      variants={{
        enter: (direction: number) => ({
          opacity: 0,
          x: direction > 0 ? 40 : -40,
        }),
        center: { opacity: 1, x: 0 },
        exit: (direction: number) => ({
          opacity: 0,
          x: direction > 0 ? -40 : 40,
        }),
      }}
      initial={reduced ? false : "enter"}
      animate="center"
      exit={reduced ? { opacity: 0 } : "exit"}
      transition={
        reduced
          ? { duration: 0 }
          : {
              layout: { type: "spring", stiffness: 240, damping: 30 },
              x: { type: "spring", stiffness: 240, damping: 30 },
              opacity: { duration: 0.16 },
            }
      }
    >
      <PaginationLink
        href="#"
        aria-label={"Page " + page}
        isActive={page === currentPage}
        tabIndex={present ? undefined : -1}
        onClick={(event) => {
          event.preventDefault();
          if (present) onPageChange(page);
        }}
      >
        {page}
      </PaginationLink>
    </motion.li>
  );
});
WindowPage.displayName = "WindowPage";

function PaginationWindow({
  currentPage,
  totalPages,
  pageWindow,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  pageWindow: number;
  onPageChange: (page: number) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const count = Number.isFinite(totalPages)
    ? Math.max(0, Math.floor(totalPages))
    : 0;
  const current = Math.max(1, Math.min(count, Math.floor(currentPage) || 1));
  const size = Number.isFinite(pageWindow)
    ? Math.max(3, Math.min(9, Math.floor(pageWindow)))
    : 5;
  const start = Math.max(
    1,
    Math.min(count - size + 1, current - Math.floor(size / 2))
  );
  const [previousStart, setPreviousStart] = React.useState(start);
  const [shift, setShift] = React.useState(0);
  if (start !== previousStart) {
    setShift(start - previousStart);
    setPreviousStart(start);
  }
  // Track direction from the inherited DOM rather than requiring a new v1 prop.
  const listRef = React.useRef<HTMLUListElement>(null);
  const [rtl, setRtl] = React.useState(false);
  React.useEffect(() => {
    if (listRef.current)
      setRtl(getComputedStyle(listRef.current).direction === "rtl");
  }, [start]);
  const pages = Array.from(
    { length: Math.min(count, size) },
    (_, index) => start + index
  );
  return (
    <PaginationContent
      ref={listRef}
      className="shrink-0"
      data-page-window="true"
    >
      <PaginationItem>
        <PaginationPrevious
          href="#"
          disabled={count === 0 || current <= 1}
          onClick={(event) => {
            event.preventDefault();
            if (current > 1) onPageChange(current - 1);
          }}
        />
      </PaginationItem>
      <AnimatePresence
        initial={false}
        mode="popLayout"
        custom={rtl ? -shift : shift}
      >
        {pages.map((page) => (
          <WindowPage
            key={page}
            page={page}
            currentPage={current}
            shift={rtl ? -shift : shift}
            reduced={reduced}
            onPageChange={onPageChange}
          />
        ))}
      </AnimatePresence>
      <PaginationItem>
        <PaginationNext
          href="#"
          disabled={count === 0 || current >= count}
          onClick={(event) => {
            event.preventDefault();
            if (current < count) onPageChange(current + 1);
          }}
        />
      </PaginationItem>
    </PaginationContent>
  );
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
  pageWindow,
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
        pageWindow !== undefined &&
          "max-w-full justify-start overflow-x-auto [&>ul]:mx-auto",
        !showInfo && className
      )}
    >
      {pageWindow !== undefined ? (
        <PaginationWindow
          currentPage={currentPage}
          totalPages={totalPages}
          pageWindow={pageWindow}
          onPageChange={onPageChange}
        />
      ) : (
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
      )}
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
