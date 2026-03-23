import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, getInitials } from "../avatar";

describe("getInitials", () => {
  it("returns first and last initials for two-word names", () => {
    expect(getInitials("Ankish Sachdeva")).toBe("AS");
  });

  it("returns first two characters for single-word names", () => {
    expect(getInitials("John")).toBe("JO");
  });

  it("returns first and last initials for multi-word names", () => {
    expect(getInitials("John Michael Doe")).toBe("JD");
  });

  it("handles extra spaces gracefully", () => {
    expect(getInitials("  John  Doe  ")).toBe("JD");
  });
});

describe("Avatar", () => {
  // --- Basic rendering ---

  it("renders initials from name prop", () => {
    render(<Avatar name="Ankish Sachdeva" />);
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("renders custom initials from initials prop", () => {
    render(<Avatar initials="ZZ" />);
    expect(screen.getByText("ZZ")).toBeInTheDocument();
  });

  it("renders an img element when src is provided", () => {
    const { container } = render(<Avatar src="/photo.jpg" alt="Profile" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/photo.jpg");
  });

  it("renders children when provided (custom content)", () => {
    render(
      <Avatar>
        <span data-testid="custom">Custom</span>
      </Avatar>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("renders nothing inside when no name/initials/src/children", () => {
    const { container } = render(<Avatar />);
    const root = container.firstChild as HTMLElement;
    // Only the root div with no child elements (no span, no img)
    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("span")).toBeNull();
  });

  // --- Initials override ---

  it("initials prop overrides name-generated initials", () => {
    render(<Avatar name="Ankish Sachdeva" initials="XY" />);
    expect(screen.getByText("XY")).toBeInTheDocument();
    expect(screen.queryByText("AS")).not.toBeInTheDocument();
  });

  // --- Image rendering ---

  it("img has correct src and alt attributes", () => {
    const { container } = render(
      <Avatar src="/photo.jpg" alt="User Photo" />
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("src", "/photo.jpg");
    expect(img).toHaveAttribute("alt", "User Photo");
  });

  it("alt defaults to name when alt not provided", () => {
    const { container } = render(
      <Avatar src="/photo.jpg" name="John Doe" />
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "John Doe");
  });

  it('alt defaults to "Avatar" when neither alt nor name provided', () => {
    const { container } = render(<Avatar src="/photo.jpg" />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "Avatar");
  });

  // --- Variant classes ---

  it("applies soft (default) variant classes", () => {
    const { container } = render(<Avatar name="Test" />);
    expect(container.firstChild).toHaveClass("bg-semantic-bg-grey");
    expect(container.firstChild).toHaveClass("text-semantic-text-muted");
  });

  it("applies filled variant classes", () => {
    const { container } = render(<Avatar name="Test" variant="filled" />);
    expect(container.firstChild).toHaveClass("bg-semantic-primary");
    expect(container.firstChild).toHaveClass("text-semantic-text-inverted");
  });

  // --- Size classes ---

  it.each([
    ["xs", "size-6", "text-[10px]"],
    ["sm", "size-8", "text-xs"],
    ["md", "size-10", "text-sm"],
    ["lg", "size-12", "text-base"],
    ["xl", "size-16", "text-lg"],
  ] as const)(
    "renders %s size with correct classes",
    (size, sizeClass, textClass) => {
      const { container } = render(<Avatar name="Test" size={size} />);
      expect(container.firstChild).toHaveClass(sizeClass);
      expect(container.firstChild).toHaveClass(textClass);
    }
  );

  it("defaults to md size", () => {
    const { container } = render(<Avatar name="Test" />);
    expect(container.firstChild).toHaveClass("size-10");
    expect(container.firstChild).toHaveClass("text-sm");
  });

  // --- Status indicator ---

  it("renders status dot when status prop is provided", () => {
    const { container } = render(<Avatar name="Test" status="online" />);
    const dot = container.querySelector("[data-status]");
    expect(dot).toBeInTheDocument();
  });

  it("online status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="online" />);
    const dot = container.querySelector("[data-status='online']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-semantic-success-primary");
  });

  it("busy status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="busy" />);
    const dot = container.querySelector("[data-status='busy']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-semantic-error-primary");
  });

  it("away status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="away" />);
    const dot = container.querySelector("[data-status='away']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-semantic-warning-primary");
  });

  it("offline status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="offline" />);
    const dot = container.querySelector("[data-status='offline']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-semantic-bg-grey");
  });

  it("does not render status dot when status not provided", () => {
    const { container } = render(<Avatar name="Test" />);
    const dot = container.querySelector("[data-status]");
    expect(dot).not.toBeInTheDocument();
  });

  it("sets data-status attribute on the dot", () => {
    const { container } = render(<Avatar name="Test" status="online" />);
    const dot = container.querySelector("[data-status]");
    expect(dot).toHaveAttribute("data-status", "online");
  });

  // --- Custom className ---

  it("merges custom className", () => {
    const { container } = render(
      <Avatar name="Test" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    // Still has base classes
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  // --- Ref forwarding ---

  it("forwards ref to the root div", () => {
    const ref = { current: null };
    render(<Avatar name="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // --- Additional props ---

  it("spreads data-testid", () => {
    render(<Avatar name="Test" data-testid="my-avatar" />);
    expect(screen.getByTestId("my-avatar")).toBeInTheDocument();
  });

  it("aria-label defaults to name", () => {
    const { container } = render(<Avatar name="Jane Doe" />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Jane Doe");
  });

  it('has role="img"', () => {
    render(<Avatar name="Test" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  // --- Base classes ---

  it("always has base CVA classes", () => {
    const { container } = render(<Avatar name="Test" />);
    const root = container.firstChild;
    expect(root).toHaveClass("relative");
    expect(root).toHaveClass("inline-flex");
    expect(root).toHaveClass("items-center");
    expect(root).toHaveClass("justify-center");
    expect(root).toHaveClass("rounded-full");
    expect(root).toHaveClass("font-semibold");
    expect(root).toHaveClass("select-none");
    expect(root).toHaveClass("shrink-0");
    expect(root).toHaveClass("overflow-hidden");
  });
});
