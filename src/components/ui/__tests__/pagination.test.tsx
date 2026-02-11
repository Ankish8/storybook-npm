import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../pagination";

describe("Pagination", () => {
  it("renders as nav with correct aria attributes", () => {
    render(
      <Pagination data-testid="pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const nav = screen.getByTestId("pagination");
    expect(nav.tagName).toBe("NAV");
    expect(nav).toHaveAttribute("role", "navigation");
    expect(nav).toHaveAttribute("aria-label", "pagination");
  });

  it("applies custom className to Pagination", () => {
    render(
      <Pagination data-testid="pagination" className="custom-class">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("pagination")).toHaveClass("custom-class");
  });
});

describe("PaginationContent", () => {
  it("renders as ul with flex layout", () => {
    render(
      <Pagination>
        <PaginationContent data-testid="content">
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const content = screen.getByTestId("content");
    expect(content.tagName).toBe("UL");
    expect(content).toHaveClass("flex", "flex-row", "items-center", "gap-1");
  });

  it("applies custom className to PaginationContent", () => {
    render(
      <Pagination>
        <PaginationContent data-testid="content" className="custom-gap">
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("content")).toHaveClass("custom-gap");
  });
});

describe("PaginationItem", () => {
  it("renders as li element", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-testid="item">
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("item").tagName).toBe("LI");
  });

  it("passes through additional props", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-testid="item" aria-label="Page 1">
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("item")).toHaveAttribute("aria-label", "Page 1");
  });
});

describe("PaginationLink", () => {
  it("renders as anchor with correct href", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="/page/1">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = screen.getByText("1");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/page/1");
  });

  it("applies ghost variant by default (not active)", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" data-testid="link">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = screen.getByTestId("link");
    // ghost variant classes from buttonVariants
    expect(link).toHaveClass("text-semantic-text-muted");
  });

  it("applies outline variant when isActive", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive data-testid="active-link">
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = screen.getByTestId("active-link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
    // outline variant classes from buttonVariants
    expect(link).toHaveClass("border");
  });

  it("does not set aria-current when not active", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" data-testid="link">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("link")).not.toHaveAttribute("aria-current");
  });

  it("applies custom className", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" className="custom-link" data-testid="link">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("link")).toHaveClass("custom-link");
  });
});

describe("PaginationPrevious", () => {
  it("renders with previous label and chevron", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = screen.getByLabelText("Go to previous page");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(screen.getByText("Previous")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="custom-prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByLabelText("Go to previous page")).toHaveClass(
      "custom-prev"
    );
  });
});

describe("PaginationNext", () => {
  it("renders with next label and chevron", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = screen.getByLabelText("Go to next page");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" className="custom-next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByLabelText("Go to next page")).toHaveClass(
      "custom-next"
    );
  });
});

describe("PaginationEllipsis", () => {
  it("renders with aria-hidden", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis data-testid="ellipsis" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = screen.getByTestId("ellipsis");
    expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  });

  it("renders sr-only text for accessibility", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText("More pages")).toHaveClass("sr-only");
  });

  it("applies custom className", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis
              data-testid="ellipsis"
              className="custom-ellipsis"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByTestId("ellipsis")).toHaveClass("custom-ellipsis");
  });
});

describe("Full Pagination composition", () => {
  it("renders a complete pagination with all sub-components", () => {
    render(
      <Pagination data-testid="full-pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByTestId("full-pagination")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});
