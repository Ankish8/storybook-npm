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
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

export interface PaginationContentProps extends React.ComponentProps<"ul"> {
  /** Additional CSS classes for the list container */
  className?: string;
}

function PaginationContent({
  className,
  ...props
}: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
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
  extends Pick<ButtonProps, "size">,
    React.ComponentProps<"a"> {
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
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
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
      size="default"
      className={cn(
        "gap-1 px-2.5 sm:pl-2.5",
        disabled && "pointer-events-none opacity-50",
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
      size="default"
      className={cn(
        "gap-1 px-2.5 sm:pr-2.5",
        disabled && "pointer-events-none opacity-50",
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

function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
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

export interface PaginationWidgetProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the user navigates to a new page */
  onPageChange: (page: number) => void;
  /** Number of pages shown on each side of current page (default: 1) */
  siblingCount?: number;
  /** Additional CSS classes */
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

function PaginationWidget({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationWidgetProps) {
  const pages = usePaginationRange(currentPage, totalPages, siblingCount);

  return (
    <Pagination className={className}>
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
  PaginationWidget,
};
