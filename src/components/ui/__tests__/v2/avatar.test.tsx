import * as React from "react";
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar, AvatarGroup, getInitials } from "../../v2/avatar";

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
    const { container } = render(<Avatar src="/photo.jpg" alt="User Photo" />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("src", "/photo.jpg");
    expect(img).toHaveAttribute("alt", "User Photo");
  });

  it("alt defaults to name when alt not provided", () => {
    const { container } = render(<Avatar src="/photo.jpg" name="John Doe" />);
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
    expect(container.firstChild).toHaveClass("bg-semantic-info-surface");
    expect(container.firstChild).toHaveClass(
      "text-[var(--v2-text-muted,#707070)]"
    );
  });

  it("applies filled variant classes", () => {
    const { container } = render(<Avatar name="Test" variant="filled" />);
    expect(container.firstChild).toHaveClass("bg-semantic-primary");
    expect(container.firstChild).toHaveClass("text-semantic-text-inverted");
  });

  // --- Size classes ---

  it.each([
    ["xs", "size-6", "text-[10px]"],
    ["sm", "size-7", "text-[10px]"],
    ["md", "size-9", "text-xs"],
    ["lg", "size-12", "text-sm"],
    ["xl", "size-[88px]", "text-[22px]"],
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
    expect(container.firstChild).toHaveClass("size-9");
    expect(container.firstChild).toHaveClass("text-xs");
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
    expect(root).toHaveClass("font-medium");
    expect(root).toHaveClass("select-none");
    expect(root).toHaveClass("shrink-0");
    expect(root).not.toHaveClass("overflow-hidden");
  });
});

describe("v2 outline", () => {
  it("preserves initials, native identity attributes and status in outline", () => {
    render(
      <Avatar
        variant="outline"
        size="sm"
        name="Aditi Kumar"
        status="busy"
        title="Support agent"
        data-testid="identity"
      />
    );
    const identity = screen.getByTestId("identity");
    expect(identity).toHaveClass("border-semantic-border-layout");
    expect(identity).toHaveAttribute("aria-label", "Aditi Kumar");
    expect(identity).toHaveAttribute("title", "Support agent");
    expect(identity.querySelector("[data-status=busy]")).toBeInTheDocument();
    expect(screen.getByText("AK")).toBeInTheDocument();
  });
});

describe("v2 image fallback", () => {
  it("shows initials instead of a broken image when the image fails to load", () => {
    const { container } = render(
      <Avatar name="Aditi Kumar" src="/missing.png" />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    // Same output as an avatar that never had a src.
    expect(screen.getByText("AK")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Aditi Kumar"
    );
  });
  it("falls back to custom children, then explicit initials, like the no-src path", () => {
    const { container, rerender } = render(
      <Avatar src="/missing.png" initials="ZZ">
        <span data-testid="icon" />
      </Avatar>
    );
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.queryByText("ZZ")).not.toBeInTheDocument();
    rerender(<Avatar src="/missing.png" initials="ZZ" />);
    expect(screen.getByText("ZZ")).toBeInTheDocument();
  });
  it("renders an empty avatar, not a broken image, when there is nothing to fall back to", () => {
    const { container } = render(<Avatar src="/missing.png" />);
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
  it("keeps showing a working image, including after it loads", () => {
    const { container } = render(<Avatar name="Aditi Kumar" src="/ok.png" />);
    const img = container.querySelector("img")!;
    fireEvent.load(img);
    expect(container.querySelector("img")).toBe(img);
    expect(screen.queryByText("AK")).not.toBeInTheDocument();
  });
  it("tries again when src changes after a failure", () => {
    const { container, rerender } = render(
      <Avatar name="Aditi Kumar" src="/missing.png" />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    rerender(<Avatar name="Aditi Kumar" src="/other.png" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/other.png");
  });
  it("keeps the status dot when the image falls back", () => {
    const { container } = render(
      <Avatar name="Aditi Kumar" src="/missing.png" status="online" />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("[data-status=online]")).toBeInTheDocument();
  });
});

describe("v2 AvatarGroup", () => {
  const people = ["Aditi Kumar", "Ravi Shah", "Meera Iyer", "Karan Mehta"];
  const group = (props: React.ComponentProps<typeof AvatarGroup> = {}) =>
    render(
      <AvatarGroup aria-label="Assigned to" {...props}>
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    );

  it("overlaps every size by 6px, as Arc does", () => {
    for (const size of ["xs", "sm", "md", "xl"] as const) {
      const { container, unmount } = render(
        <AvatarGroup size={size}>
          <Avatar>AK</Avatar>
          <Avatar>MI</Avatar>
        </AvatarGroup>
      );
      const group = container.firstElementChild as HTMLElement;
      expect(group).toHaveClass("[&>*:not(:first-child)]:-ms-1.5");
      unmount();
    }
  });

  it("overlaps avatars with a 2px surface ring and a hairline outside it", () => {
    group();
    const root = screen.getByRole("group", { name: "Assigned to" });
    expect(root).toHaveClass(
      "inline-flex",
      "[&>*]:ring-2",
      "[&>*]:ring-semantic-bg-primary",
      "[&>*:not(:first-child)]:-ms-1.5",
      "[&>*]:shadow-[0_0_0_3px_var(--semantic-border-layout)]"
    );
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
  });
  it("gives each avatar its place in the stack for the hover fan", () => {
    group({ max: 3 });
    const faces = screen.getAllByRole("img");
    expect(faces.map((f) => f.style.getPropertyValue("--index"))).toEqual([
      "0",
      "1",
      "2",
      "3",
    ]);
    expect(faces[0].style.getPropertyValue("--count")).toBe("4");
  });
  it("collapses the rest into a +N tile when max is lower than the count", () => {
    group({ max: 2 });
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(
      screen.getByRole("img", { name: "Aditi Kumar" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Meera Iyer" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "2 more" })).toBeInTheDocument();
  });
  it("shows everything with no tile when max covers the count", () => {
    group({ max: 4 });
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
  });
  it("can collapse every avatar and ignores invalid max values", () => {
    const { unmount } = group({ max: 0 });
    expect(screen.getByText("+4")).toBeInTheDocument();
    unmount();
    group({ max: Number.NaN });
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });
  it("sizes the +N tile like the avatars beside it", () => {
    const { unmount } = group({ max: 1, size: "lg" });
    expect(screen.getByText("+3")).toHaveClass("size-12", "text-sm");
    // The group size also reaches children that did not set their own.
    expect(screen.getByRole("img", { name: "Aditi Kumar" })).toHaveClass(
      "size-12"
    );
    unmount();
    render(
      <AvatarGroup max={1}>
        <Avatar name="Aditi Kumar" size="xs" />
        <Avatar name="Ravi Shah" size="xs" />
      </AvatarGroup>
    );
    // No group size: the tile follows the first avatar.
    expect(screen.getByText("+1")).toHaveClass("size-6", "text-[10px]");
  });
  it("lets a child keep its own size and a consumer recolour the ring", () => {
    render(
      <AvatarGroup
        size="md"
        className="[&>*]:ring-semantic-bg-ui"
        data-testid="g"
      >
        <Avatar name="Aditi Kumar" size="xl" />
      </AvatarGroup>
    );
    expect(screen.getByRole("img")).toHaveClass("size-[88px]");
    expect(screen.getByTestId("g")).toHaveClass("[&>*]:ring-semantic-bg-ui");
    expect(screen.getByTestId("g")).not.toHaveClass(
      "[&>*]:ring-semantic-bg-primary"
    );
  });
  it("forwards its ref and ignores empty children", () => {
    const ref = { current: null };
    render(
      <AvatarGroup ref={ref}>
        {null}
        <Avatar name="Aditi Kumar" />
        {false}
      </AvatarGroup>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});
