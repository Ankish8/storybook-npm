import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnreadSeparator } from "../unread-separator";

describe("UnreadSeparator", () => {
  it("renders with singular text for count=1", () => {
    render(<UnreadSeparator count={1} />);
    expect(screen.getByText("1 unread message")).toBeInTheDocument();
  });

  it("renders with plural text for count > 1", () => {
    render(<UnreadSeparator count={3} />);
    expect(screen.getByText("3 unread messages")).toBeInTheDocument();
  });

  it("custom label overrides default text", () => {
    render(<UnreadSeparator count={5} label="5 new messages" />);
    expect(screen.getByText("5 new messages")).toBeInTheDocument();
    expect(screen.queryByText("5 unread messages")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <UnreadSeparator count={2} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    // Should still have base classes
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<UnreadSeparator ref={ref} count={1} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("data-testid spreads correctly", () => {
    render(
      <UnreadSeparator count={2} data-testid="unread-separator" />
    );
    expect(screen.getByTestId("unread-separator")).toBeInTheDocument();
  });
});
