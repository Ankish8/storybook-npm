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

  it("renders system variant with Figma action feedback styling", () => {
    render(
      <ChatTimelineDivider variant="system">
        Assigned to Alex Smith
      </ChatTimelineDivider>
    );
    const text = screen.getByText("Assigned to Alex Smith");
    expect(text.className).toContain("text-semantic-text-secondary");
    expect(text.className).toContain("text-[12px]");
    expect(text.className).toContain("leading-4");
    expect(text.parentElement?.className).toContain("min-h-5");
    expect(text.parentElement?.className).toContain("rounded");
    expect(text.parentElement?.className).toContain("bg-semantic-bg-primary");
    expect(text.parentElement?.className).toContain("shadow-sm");
  });

  it("wraps and centre-aligns system events on mobile/tablet, truncating on desktop", () => {
    render(
      <ChatTimelineDivider variant="system">
        Assigned to Alex Smith
      </ChatTimelineDivider>
    );
    const text = screen.getByText("Assigned to Alex Smith");
    // Mobile/tablet base: wrap + centre
    expect(text.className).toContain("whitespace-normal");
    expect(text.className).toContain("break-words");
    expect(text.className).toContain("text-center");
    // Desktop (lg+) reverts to single-line truncation
    expect(text.className).toContain("lg:truncate");
    // 20px side padding on mobile/tablet, compact pill at lg+
    expect(text.parentElement?.className).toContain("px-5");
    expect(text.parentElement?.className).toContain("lg:px-1.5");
    // Pill must be allowed to shrink below content width so lg:truncate can clip
    expect(text.parentElement?.className).toContain("min-w-0");
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
        Assigned to <span data-testid="link">Alex Smith</span>
      </ChatTimelineDivider>
    );
    expect(screen.getByTestId("link")).toHaveTextContent("Alex Smith");
  });

  it("applies Figma emphasis style to **segments** in string children", () => {
    render(
      <ChatTimelineDivider variant="system">
        Assigned to **Alex Smith** by **Admin**
      </ChatTimelineDivider>
    );
    expect(screen.getByRole("separator")).toHaveTextContent(
      "Assigned to Alex Smith by Admin"
    );
    const alex = screen.getByText("Alex Smith");
    const admin = screen.getByText("Admin");
    expect(alex.className).toContain("text-semantic-text-secondary");
    expect(alex.className).toContain("font-semibold");
    expect(alex.className).toContain("tracking-[0.06px]");
    expect(admin.className).toContain("text-semantic-text-secondary");
    expect(admin.className).toContain("font-semibold");
    expect(admin.className).toContain("tracking-[0.06px]");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<ChatTimelineDivider ref={ref}>Today</ChatTimelineDivider>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    render(
      <ChatTimelineDivider className="custom-class">Today</ChatTimelineDivider>
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
