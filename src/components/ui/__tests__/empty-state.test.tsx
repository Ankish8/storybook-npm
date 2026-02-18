import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders title correctly", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState title="No results" description="Try adjusting your filters." />
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
    const iconWrapper = container.querySelector(
      ".bg-semantic-info-surface"
    );
    expect(iconWrapper).not.toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <EmptyState
        title="No results"
        actions={<button>Take action</button>}
      />
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
      <EmptyState title={<strong data-testid="title-node">Bold Title</strong>} />
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
});
