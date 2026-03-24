import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatTimelineDivider } from "../chat-timeline-divider";
import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";

describe("ChatTimelineDivider", () => {
  it("renders children text", () => {
    render(<ChatTimelineDivider>Today</ChatTimelineDivider>);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("has role=separator", () => {
    render(<ChatTimelineDivider>Today</ChatTimelineDivider>);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders default variant with plain text styling", () => {
    render(<ChatTimelineDivider>Yesterday</ChatTimelineDivider>);
    const text = screen.getByText("Yesterday");
    expect(text.className).toContain("text-semantic-text-muted");
  });

  it("renders unread variant with bold styling", () => {
    render(
      <ChatTimelineDivider variant="unread">
        3 unread messages
      </ChatTimelineDivider>
    );
    const text = screen.getByText("3 unread messages");
    expect(text.className).toContain("font-semibold");
    expect(text.className).toContain("text-semantic-text-primary");
  });

  it("renders system variant with muted styling and container", () => {
    render(
      <ChatTimelineDivider variant="system">
        Assigned to Alex Smith
      </ChatTimelineDivider>
    );
    const text = screen.getByText("Assigned to Alex Smith");
    expect(text.className).toContain("text-semantic-text-muted");
    // container has border
    expect(text.parentElement?.className).toContain("border");
    expect(text.parentElement?.className).toContain("rounded-full");
  });

  it("renders horizontal lines on both sides", () => {
    const { container } = render(
      <ChatTimelineDivider>Today</ChatTimelineDivider>
    );
    const lines = container.querySelectorAll(".bg-semantic-border-layout");
    expect(lines.length).toBe(2);
  });

  it("supports ReactNode children", () => {
    render(
      <ChatTimelineDivider variant="system">
        Assigned to{" "}
        <span data-testid="link">Alex Smith</span>
      </ChatTimelineDivider>
    );
    expect(screen.getByTestId("link")).toHaveTextContent("Alex Smith");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <ChatTimelineDivider ref={ref}>Today</ChatTimelineDivider>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    render(
      <ChatTimelineDivider className="custom-class">
        Today
      </ChatTimelineDivider>
    );
    expect(screen.getByRole("separator").className).toContain("custom-class");
  });

  it("passes through additional HTML attributes", () => {
    render(
      <ChatTimelineDivider data-testid="divider" aria-label="Date separator">
        Today
      </ChatTimelineDivider>
    );
    expect(screen.getByTestId("divider")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-label",
      "Date separator"
    );
  });

  it("has no Bootstrap margin bleed", () => {
    const { container } = render(
      <ChatTimelineDivider>Today</ChatTimelineDivider>
    );
    assertNoBootstrapMarginBleed(container);
  });
});
