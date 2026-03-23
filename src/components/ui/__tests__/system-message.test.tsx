import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SystemMessage } from "../system-message";

describe("SystemMessage", () => {
  it("renders plain text correctly", () => {
    render(<SystemMessage>Chat was closed</SystemMessage>);
    expect(screen.getByText("Chat was closed")).toBeInTheDocument();
  });

  it("renders **bold** parts with correct styling", () => {
    const { container } = render(
      <SystemMessage>Assigned to **Alex Smith**</SystemMessage>
    );
    const boldSpan = screen.getByText("Alex Smith");
    expect(boldSpan.tagName).toBe("SPAN");
    expect(boldSpan).toHaveClass("font-medium");
    expect(boldSpan).toHaveClass("text-semantic-text-link");
    // The plain text part should also be present
    expect(container.textContent).toBe("Assigned to Alex Smith");
  });

  it("renders multiple **bold** segments in one message", () => {
    render(
      <SystemMessage>
        Assigned to **Alex Smith** by **Admin**
      </SystemMessage>
    );
    const alexSpan = screen.getByText("Alex Smith");
    const adminSpan = screen.getByText("Admin");
    expect(alexSpan).toHaveClass("font-medium");
    expect(alexSpan).toHaveClass("text-semantic-text-link");
    expect(adminSpan).toHaveClass("font-medium");
    expect(adminSpan).toHaveClass("text-semantic-text-link");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SystemMessage className="custom-class">Test</SystemMessage>
    );
    expect(container.firstChild).toHaveClass("custom-class");
    // Should still have base classes
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("justify-center");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<SystemMessage ref={ref}>Test</SystemMessage>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads data-testid correctly", () => {
    render(
      <SystemMessage data-testid="system-msg">Hello</SystemMessage>
    );
    const el = screen.getByTestId("system-msg");
    expect(el).toBeInTheDocument();
    expect(el.textContent).toBe("Hello");
  });
});
