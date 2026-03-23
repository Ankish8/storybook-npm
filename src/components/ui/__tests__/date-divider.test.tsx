import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateDivider } from "../date-divider";

describe("DateDivider", () => {
  it("renders children text correctly", () => {
    render(<DateDivider>Today</DateDivider>);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <DateDivider className="custom-class">Today</DateDivider>
    );
    expect(container.firstChild).toHaveClass("custom-class");
    // Should also retain default classes
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<DateDivider ref={ref}>Today</DateDivider>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads data-testid correctly", () => {
    render(<DateDivider data-testid="date-sep">March 20, 2026</DateDivider>);
    const element = screen.getByTestId("date-sep");
    expect(element).toBeInTheDocument();
    expect(screen.getByText("March 20, 2026")).toBeInTheDocument();
  });

  it("has horizontal lines on both sides", () => {
    const { container } = render(<DateDivider>Today</DateDivider>);
    const root = container.firstChild as HTMLElement;
    const children = root.children;

    // Should have 3 children: line, text, line
    expect(children).toHaveLength(3);

    // First child - left line
    const leftLine = children[0] as HTMLElement;
    expect(leftLine.tagName).toBe("DIV");
    expect(leftLine).toHaveClass("flex-1");
    expect(leftLine).toHaveClass("h-px");
    expect(leftLine).toHaveClass("bg-semantic-border-layout");

    // Second child - text span
    const textSpan = children[1] as HTMLElement;
    expect(textSpan.tagName).toBe("SPAN");
    expect(textSpan).toHaveClass("text-xs");
    expect(textSpan).toHaveClass("text-semantic-text-muted");
    expect(textSpan.textContent).toBe("Today");

    // Third child - right line
    const rightLine = children[2] as HTMLElement;
    expect(rightLine.tagName).toBe("DIV");
    expect(rightLine).toHaveClass("flex-1");
    expect(rightLine).toHaveClass("h-px");
    expect(rightLine).toHaveClass("bg-semantic-border-layout");
  });

  it("renders with complex children", () => {
    render(
      <DateDivider>
        <strong>Today</strong>
      </DateDivider>
    );
    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});
