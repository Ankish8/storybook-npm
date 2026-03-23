import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContactListItem } from "../contact-list-item";

describe("ContactListItem", () => {
  it("renders correctly with required props (name)", () => {
    render(<ContactListItem name="Aditi Kumar" />);
    expect(screen.getByText("Aditi Kumar")).toBeInTheDocument();
  });

  it("displays subtitle when provided", () => {
    render(
      <ContactListItem name="Aditi Kumar" subtitle="+91 98765 43210" />
    );
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
  });

  it("displays trailing content when provided", () => {
    render(<ContactListItem name="Aditi Kumar" trailing="MY01" />);
    expect(screen.getByText("MY01")).toBeInTheDocument();
  });

  it("shows Avatar with correct name prop", () => {
    render(<ContactListItem name="Aditi Kumar" />);
    // Avatar renders initials "AK" from name "Aditi Kumar"
    expect(screen.getByText("AK")).toBeInTheDocument();
    // Avatar has aria-label matching the name
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Aditi Kumar"
    );
  });

  it("shows Avatar with avatarSrc when provided", () => {
    render(
      <ContactListItem name="Aditi Kumar" avatarSrc="/photo.jpg" />
    );
    const img = screen.getByAltText("Aditi Kumar");
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/photo.jpg");
  });

  it("applies selected state classes when isSelected=true", () => {
    const { container } = render(
      <ContactListItem name="Aditi Kumar" isSelected={true} />
    );
    expect(container.firstChild).toHaveClass("bg-semantic-bg-ui");
    expect(container.firstChild).not.toHaveClass("hover:bg-semantic-bg-hover");
  });

  it("applies hover classes when isSelected=false (default)", () => {
    const { container } = render(
      <ContactListItem name="Aditi Kumar" />
    );
    expect(container.firstChild).toHaveClass("hover:bg-semantic-bg-hover");
    expect(container.firstChild).not.toHaveClass("bg-semantic-bg-ui");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ContactListItem name="Aditi Kumar" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    // Should still have base classes
    expect(container.firstChild).toHaveClass("flex", "items-center", "gap-3");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<ContactListItem ref={ref} name="Aditi Kumar" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props (data-testid)", () => {
    render(
      <ContactListItem name="Aditi Kumar" data-testid="contact-item" />
    );
    expect(screen.getByTestId("contact-item")).toBeInTheDocument();
  });

  it("onClick fires when clicked", () => {
    const handleClick = vi.fn();
    render(<ContactListItem name="Aditi Kumar" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("onClick fires on Enter key press", () => {
    const handleClick = vi.fn();
    render(<ContactListItem name="Aditi Kumar" onClick={handleClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("onClick fires on Space key press", () => {
    const handleClick = vi.fn();
    render(<ContactListItem name="Aditi Kumar" onClick={handleClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not render subtitle span when subtitle is not provided", () => {
    const { container } = render(<ContactListItem name="Aditi Kumar" />);
    const spans = container.querySelectorAll("span");
    // Should only have: name span + avatar initials span (aria-hidden)
    const subtitleSpan = Array.from(spans).find(
      (span) =>
        span.classList.contains("text-xs") &&
        span.classList.contains("text-semantic-text-muted") &&
        !span.classList.contains("font-medium")
    );
    expect(subtitleSpan).toBeUndefined();
  });

  it("does not render trailing span when trailing is not provided", () => {
    const { container } = render(<ContactListItem name="Aditi Kumar" />);
    const spans = container.querySelectorAll("span");
    const trailingSpan = Array.from(spans).find(
      (span) =>
        span.classList.contains("shrink-0") &&
        span.classList.contains("ml-2")
    );
    expect(trailingSpan).toBeUndefined();
  });

  it("has correct role='button' and tabIndex=0", () => {
    render(<ContactListItem name="Aditi Kumar" />);
    const element = screen.getByRole("button");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("tabindex", "0");
  });
});
