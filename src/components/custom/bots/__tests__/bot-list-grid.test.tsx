import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BotListGrid } from "../bot-list-grid";

describe("BotListGrid", () => {
  it("renders children", () => {
    render(
      <BotListGrid>
        <span data-testid="child">Child</span>
      </BotListGrid>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <BotListGrid>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </BotListGrid>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("applies grid layout classes", () => {
    const { container } = render(
      <BotListGrid>
        <div>Item</div>
      </BotListGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("w-full");
    expect(grid).toHaveClass("min-w-0");
    expect(grid).toHaveClass("max-w-full");
    expect(grid.className).toContain("grid-cols-");
    expect(grid.className).toContain("minmax");
  });

  it("applies custom className", () => {
    const { container } = render(
      <BotListGrid className="custom-grid">
        <div>Item</div>
      </BotListGrid>
    );
    expect(container.firstChild).toHaveClass("custom-grid");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BotListGrid ref={ref}>
        <div>Item</div>
      </BotListGrid>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
