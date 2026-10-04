import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "../../v2/empty-state";

describe("EmptyState", () => {
  it("renders title correctly", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters."
      />
    );
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    const { queryByText } = render(<EmptyState title="No results" />);
    expect(queryByText("Try adjusting your filters.")).not.toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <EmptyState
        title="No results"
        icon={<span data-testid="icon">icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is omitted", () => {
    const { container } = render(<EmptyState title="No results" />);
    const iconWrapper = container.querySelector(".bg-semantic-info-surface");
    expect(iconWrapper).not.toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <EmptyState title="No results" actions={<button>Take action</button>} />
    );
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeInTheDocument();
  });

  it("does not render actions container when actions is omitted", () => {
    const { queryByRole } = render(<EmptyState title="No results" />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className to root container", () => {
    const { container } = render(
      <EmptyState title="No results" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("sets data-slot attribute on root element", () => {
    const { container } = render(<EmptyState title="No results" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "empty-state");
  });

  it("renders ReactNode as title", () => {
    render(
      <EmptyState
        title={<strong data-testid="title-node">Bold Title</strong>}
      />
    );
    expect(screen.getByTestId("title-node")).toBeInTheDocument();
  });

  it("renders ReactNode as description", () => {
    render(
      <EmptyState
        title="Title"
        description={<em data-testid="desc-node">Italic desc</em>}
      />
    );
    expect(screen.getByTestId("desc-node")).toBeInTheDocument();
  });

  it("does not constrain description width with max-w-xs", () => {
    render(
      <EmptyState title="No results" description="Long description text" />
    );
    expect(screen.getByText("Long description text")).not.toHaveClass(
      "max-w-xs"
    );
  });
});

describe("EmptyState size", () => {
  const DEFAULT_ROOT =
    "flex flex-col items-center justify-center gap-5 p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]";

  it("leaves the default output unchanged", () => {
    const { container: omitted } = render(
      <EmptyState icon={<svg />} title="Nothing" description="Details" />
    );
    const { container: explicit } = render(
      <EmptyState
        size="default"
        icon={<svg />}
        title="Nothing"
        description="Details"
      />
    );
    expect(omitted.innerHTML).toBe(explicit.innerHTML);
    expect((omitted.firstChild as HTMLElement).className).toBe(DEFAULT_ROOT);
    expect(omitted.querySelector("p")).toHaveClass("text-2xl", "leading-8");
    expect(omitted.querySelector("svg")?.parentElement).toHaveClass(
      "size-[90px]"
    );
  });

  it("renders a compact layout for sm", () => {
    const { container } = render(
      <EmptyState
        size="sm"
        icon={<svg />}
        title="Nothing"
        description="Details"
      />
    );
    expect(container.firstChild).toHaveClass("gap-4", "p-4");
    expect(container.firstChild).not.toHaveClass("p-6");
    const tile = container.querySelector("svg")?.parentElement as HTMLElement;
    expect(tile).toHaveClass("size-12", "[&>svg]:size-6");
    expect(tile).not.toHaveClass("size-[90px]");
    expect(screen.getByText("Nothing")).toHaveClass("text-base", "leading-6");
    expect(screen.getByText("Details")).toHaveClass("text-sm", "leading-5");
  });

  it("keeps a custom className on both sizes", () => {
    const { container } = render(
      <EmptyState size="sm" title="Nothing" className="custom" />
    );
    expect(container.firstChild).toHaveClass("custom", "p-4");
  });
});
