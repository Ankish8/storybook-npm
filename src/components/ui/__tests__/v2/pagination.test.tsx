import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInfo,
  PaginationWidget,
} from "../../v2/pagination";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

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
  it("measures the present active page immediately while an old active page exits", async () => {
    const bounds = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function () {
        const left =
          this.dataset.testid === "incoming"
            ? 100
            : this.dataset.testid === "outgoing"
              ? 180
              : 0;
        const width = this.tagName === "A" ? 36 : 300;
        return {
          x: left,
          y: 0,
          left,
          right: left + width,
          top: 0,
          bottom: 36,
          width,
          height: 36,
          toJSON: () => ({}),
        } as DOMRect;
      });
    const sample = (oldHidden: boolean, newHidden: boolean) => (
      <PaginationContent data-testid="indicator-list">
        <PaginationItem aria-hidden={oldHidden || undefined}>
          <PaginationLink data-testid="outgoing" href="#8" isActive>
            8
          </PaginationLink>
        </PaginationItem>
        <PaginationItem aria-hidden={newHidden || undefined}>
          <PaginationLink data-testid="incoming" href="#1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    );
    try {
      const { rerender } = render(sample(true, false));
      const list = screen.getByTestId("indicator-list");
      expect(list.style.getPropertyValue("--v2-page-x")).toBe("100px");
      rerender(sample(false, true));
      await waitFor(() =>
        expect(list.style.getPropertyValue("--v2-page-x")).toBe("180px")
      );
      rerender(sample(true, true));
      await waitFor(() =>
        expect(list).not.toHaveAttribute("data-page-indicator")
      );
    } finally {
      bounds.mockRestore();
    }
  });

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
    expect(link).toHaveClass("text-[var(--v2-text-secondary,#5E5E5E)]");
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
    expect(screen.getByLabelText("Go to next page")).toHaveClass("custom-next");
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

describe("PaginationInfo", () => {
  it("renders the item range and total", () => {
    render(<PaginationInfo currentPage={1} pageSize={15} totalItems={96} />);

    expect(screen.getByText("Showing")).toBeInTheDocument();
    expect(screen.getByText("1–15 of 96")).toBeInTheDocument();
  });

  it("computes the range for a middle page", () => {
    render(<PaginationInfo currentPage={3} pageSize={15} totalItems={96} />);

    expect(screen.getByText("31–45 of 96")).toBeInTheDocument();
  });

  it("clamps the end item on the last partial page", () => {
    render(<PaginationInfo currentPage={7} pageSize={15} totalItems={96} />);

    expect(screen.getByText("91–96 of 96")).toBeInTheDocument();
  });

  it("reports a zero range when there are no items", () => {
    render(<PaginationInfo currentPage={1} pageSize={15} totalItems={0} />);

    expect(screen.getByText("0–0 of 0")).toBeInTheDocument();
  });

  it("supports a custom label", () => {
    render(
      <PaginationInfo
        currentPage={1}
        pageSize={10}
        totalItems={48}
        label="Displaying"
      />
    );

    expect(screen.getByText("Displaying")).toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on its paragraph", () => {
    const { container } = render(
      <PaginationInfo currentPage={1} pageSize={15} totalItems={96} />
    );

    assertNoBootstrapMarginBleed(container);
  });

  it("merges custom className", () => {
    render(
      <PaginationInfo
        currentPage={1}
        pageSize={15}
        totalItems={96}
        className="custom-info"
        data-testid="info"
      />
    );

    const info = screen.getByTestId("info");
    expect(info).toHaveClass("custom-info");
    expect(info).toHaveClass("text-sm");
  });
});

describe("PaginationWidget item count", () => {
  it("renders the summary when totalItems and pageSize are given", () => {
    render(
      <PaginationWidget
        currentPage={1}
        totalPages={7}
        pageSize={15}
        totalItems={96}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText("1–15 of 96")).toBeInTheDocument();
  });

  it("omits the summary when totalItems is not given", () => {
    render(
      <PaginationWidget
        currentPage={1}
        totalPages={7}
        onPageChange={() => {}}
      />
    );

    expect(screen.queryByText("Showing")).not.toBeInTheDocument();
  });

  it("right-aligns the controls by default when the summary is shown", () => {
    render(
      <PaginationWidget
        currentPage={1}
        totalPages={7}
        pageSize={15}
        totalItems={96}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByRole("navigation")).toHaveClass("justify-end");
  });

  it("honours an explicit align override", () => {
    render(
      <PaginationWidget
        currentPage={1}
        totalPages={7}
        pageSize={15}
        totalItems={96}
        align="center"
        onPageChange={() => {}}
      />
    );

    expect(screen.getByRole("navigation")).toHaveClass("justify-center");
  });

  it("centers the controls when no summary is shown", () => {
    render(
      <PaginationWidget
        currentPage={1}
        totalPages={7}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByRole("navigation")).toHaveClass("justify-center");
  });
});

describe("Pagination polish", () => {
  it("keeps page numbers a stable 12px width and presses only the arrows, to 0.96", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">7</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const number = screen.getByText("7");
    expect(number).toHaveClass("tabular-nums", "text-xs", "font-normal");
    expect(number).toHaveClass("active:scale-100");
    expect(number).not.toHaveClass("active:scale-[0.96]");
    for (const arrow of [
      screen.getByLabelText("Go to previous page"),
      screen.getByLabelText("Go to next page"),
    ]) {
      expect(arrow).toHaveClass("tabular-nums", "active:scale-[0.96]");
      expect(arrow).not.toHaveClass("active:scale-[0.97]");
    }
  });

  it("dims disabled arrows to 40% with a not-allowed cursor and no press", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const arrow = screen.getByLabelText("Go to previous page");
    expect(arrow).toHaveClass("opacity-40", "cursor-not-allowed");
    expect(arrow).not.toHaveClass("active:scale-[0.96]");
  });

  it("gates the hover fill and text colour to hover-capable pointers", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link = screen.getByText("2");
    expect(link).toHaveClass(
      "[@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-semantic-primary-hover",
      "[@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:text-semantic-text-inverted"
    );
    expect(link).not.toHaveClass("hover:bg-semantic-bg-ui");
    expect(link).not.toHaveClass("hover:text-[var(--v2-text-primary,#484848)]");
  });

  it("uses tabular numerals in the summary", () => {
    render(<PaginationInfo currentPage={2} pageSize={10} totalItems={120} />);
    expect(screen.getByText(/Showing/)).toHaveClass("tabular-nums");
  });
});

it("blocks activation and tab focus for disabled previous and next links", () => {
  const click = vi.fn();
  render(
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled
            href="/previous"
            onClick={click}
            onAuxClick={click}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled href="/next" onClick={click} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
  const previous = screen.getByRole("link", { name: "Go to previous page" });
  const next = screen.getByRole("link", { name: "Go to next page" });
  expect(previous).toHaveAttribute("tabindex", "-1");
  expect(next).toHaveAttribute("tabindex", "-1");
  fireEvent.click(previous);
  expect(
    fireEvent(
      previous,
      new MouseEvent("auxclick", { bubbles: true, cancelable: true, button: 1 })
    )
  ).toBe(false);
  fireEvent.click(next);
  expect(click).not.toHaveBeenCalled();
});

it("moves the page highlight inside its own list when selection changes", async () => {
  const geometry = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function () {
      const element = this as HTMLElement;
      const x =
        element.dataset.slot === "pagination-link" &&
        element.textContent === "2"
          ? 140
          : 100;
      return {
        x,
        y: 20,
        left: x,
        top: 20,
        right: x + 32,
        bottom: 52,
        width: 32,
        height: 32,
        toJSON() {},
      };
    });
  try {
    const sample = (page: number) => (
      <PaginationContent data-testid="moving-pages">
        <PaginationItem>
          <PaginationLink isActive={page === 1}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={page === 2}>2</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    );
    const { rerender } = render(sample(1));
    const list = screen.getByTestId("moving-pages");
    expect(list.style.getPropertyValue("--v2-page-x")).toBe("0px");
    rerender(sample(2));
    await waitFor(() =>
      expect(list.style.getPropertyValue("--v2-page-x")).toBe("40px")
    );
    expect(list.style.getPropertyValue("--v2-page-width")).toBe("32px");
    expect(list).toHaveAttribute("data-page-indicator", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  } finally {
    geometry.mockRestore();
  }
});

describe("Sliding pagination window", () => {
  it("keeps the existing ellipsis range and callback behavior when unset", () => {
    const change = vi.fn();
    render(
      <PaginationWidget currentPage={8} totalPages={12} onPageChange={change} />
    );
    expect(screen.getAllByText("More pages")).toHaveLength(2);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      ["Previous", "1", "7", "8", "9", "12", "Next"]
    );
    fireEvent.click(screen.getByText("9"));
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith(9);
  });

  it("shifts a five-page range and fills the first and last boundaries", async () => {
    const change = vi.fn();
    const sample = (page: number) => (
      <PaginationWidget
        currentPage={page}
        totalPages={12}
        pageWindow={5}
        onPageChange={change}
      />
    );
    const { rerender } = render(sample(8));
    const visible = () =>
      screen
        .getAllByRole("link", { name: /^Page / })
        .map((link) => link.textContent);
    expect(visible()).toEqual(["6", "7", "8", "9", "10"]);
    const nine = screen.getByRole("link", { name: "Page 9" });
    nine.focus();
    fireEvent.click(nine);
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith(9);
    rerender(sample(9));
    expect(visible()).toEqual(["7", "8", "9", "10", "11"]);
    expect(screen.getByRole("link", { name: "Page 9" })).toBe(nine);
    expect(nine).toHaveFocus();
    rerender(sample(10));
    rerender(sample(12));
    expect(visible()).toEqual(["8", "9", "10", "11", "12"]);
    expect(screen.getByRole("link", { name: "Page 12" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("aria-disabled", "true");
    rerender(sample(1));
    expect(visible()).toEqual(["1", "2", "3", "4", "5"]);
    expect(
      screen.getByRole("link", { name: "Go to previous page" })
    ).toHaveAttribute("tabindex", "-1");
    await waitFor(() =>
      expect(
        document.querySelectorAll('[data-window-page][aria-hidden="true"]')
      ).toHaveLength(0)
    );
  });

  it("renders a bounded window for a million-page collection and passes callbacks once", () => {
    const change = vi.fn();
    render(
      <PaginationWidget
        currentPage={999998}
        totalPages={1000000}
        pageWindow={5}
        onPageChange={change}
      />
    );
    expect(screen.getAllByRole("link", { name: /^Page / })).toHaveLength(5);
    fireEvent.click(screen.getByRole("link", { name: "Go to next page" }));
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith(999999);
  });

  it("keeps native hrefs and user event handlers on enabled primitive links", () => {
    const click = vi.fn();
    render(
      <PaginationLink href="#contacts-page-2" onClick={click}>
        2
      </PaginationLink>
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "#contacts-page-2"
    );
    fireEvent.click(screen.getByRole("link"));
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.calls[0][0].defaultPrevented).toBe(false);
  });

  it("forwards the content ref and gates all transitions for reduced motion", () => {
    const ref = React.createRef<HTMLUListElement>();
    render(
      <PaginationContent ref={ref}>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    );
    expect(ref.current).toBe(screen.getByRole("list"));
    expect(ref.current).toHaveClass("motion-reduce:before:transition-none");
    expect(screen.getByRole("link")).toHaveClass(
      "motion-reduce:transition-none",
      "motion-reduce:active:transform-none"
    );
    expect(screen.getByRole("link").querySelector("svg")).toHaveClass(
      "rtl:rotate-180"
    );
  });
});
