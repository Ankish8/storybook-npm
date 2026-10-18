import * as React from "react";
import { describe, it, expect, vi } from "vitest";
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

  it("trims a single name and safely handles empty names", () => {
    expect(getInitials("  John  ")).toBe("JO");
    expect(getInitials(" \t ")).toBe("");
    expect(getInitials("")).toBe("");
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
    expect(container.firstChild).toHaveClass("bg-v2-semantic-info-surface");
    expect(container.firstChild).toHaveClass("text-v2-semantic-text-muted");
  });

  it("applies filled variant classes", () => {
    const { container } = render(<Avatar name="Test" variant="filled" />);
    expect(container.firstChild).toHaveClass("bg-v2-semantic-primary");
    expect(container.firstChild).toHaveClass("text-v2-semantic-text-inverted");
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
    expect(dot).toHaveClass("bg-v2-semantic-success-primary");
  });

  it("busy status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="busy" />);
    const dot = container.querySelector("[data-status='busy']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-v2-semantic-error-primary");
  });

  it("away status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="away" />);
    const dot = container.querySelector("[data-status='away']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-v2-semantic-warning-primary");
  });

  it("offline status has correct class", () => {
    const { container } = render(<Avatar name="Test" status="offline" />);
    const dot = container.querySelector("[data-status='offline']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-v2-semantic-text-muted");
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

  it("names an image-only avatar from its alt without exposing a duplicate image", () => {
    const { container } = render(
      <Avatar src="/photo.jpg" alt="Emma Collins" />
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(
      screen.getByRole("img", { name: "Emma Collins" })
    ).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("names initials-only and empty avatars", () => {
    const { rerender } = render(<Avatar initials="EC" />);
    expect(screen.getByRole("img", { name: "EC" })).toBeInTheDocument();
    rerender(<Avatar />);
    expect(screen.getByRole("img", { name: "Avatar" })).toBeInTheDocument();
  });

  it("keeps the v1 accessible name while describing presence and keeping its dot decorative", () => {
    const { container, rerender } = render(
      <Avatar name="Emma Collins" status="online" />
    );
    expect(
      screen.getByRole("img", { name: "Emma Collins" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Emma Collins" })).toHaveAttribute(
      "aria-description",
      "online"
    );
    expect(container.querySelector("[data-status=online]")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    rerender(<Avatar name="Emma Collins" status="busy" />);
    expect(
      screen.getByRole("img", { name: "Emma Collins" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Emma Collins" })).toHaveAttribute(
      "aria-description",
      "busy"
    );
    expect(container.querySelector("[data-status=busy]")).toBeInTheDocument();
    rerender(<Avatar name="Emma Collins" />);
    expect(
      screen.getByRole("img", { name: "Emma Collins" })
    ).toBeInTheDocument();
  });

  it("preserves explicit ARIA names and native handlers, styles and callback refs", () => {
    const click = vi.fn();
    const ref = vi.fn();
    render(
      <Avatar
        name="Emma Collins"
        status="online"
        aria-label="Team lead"
        title="Profile"
        tabIndex={0}
        onClick={click}
        style={{ width: 72, height: 72 }}
        className="size-[72px]"
        ref={ref}
      />
    );
    const avatar = screen.getByRole("img", { name: "Team lead" });
    fireEvent.click(avatar);
    expect(click).toHaveBeenCalledOnce();
    expect(ref).toHaveBeenCalledWith(avatar);
    expect(avatar).toHaveAttribute("title", "Profile");
    expect(avatar).toHaveAttribute("tabindex", "0");
    expect(avatar).toHaveStyle({ width: "72px", height: "72px" });
    expect(avatar).toHaveClass("size-[72px]");
    expect(avatar).not.toHaveClass("size-10");
  });

  it("preserves aria-labelledby and decorative aria-hidden use", () => {
    const { rerender } = render(
      <>
        <span id="person-name">Support lead</span>
        <Avatar name="Emma Collins" aria-labelledby="person-name" />
      </>
    );
    expect(
      screen.getByRole("img", { name: "Support lead" })
    ).toBeInTheDocument();
    rerender(<Avatar name="Emma Collins" aria-hidden="true" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
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
    expect(identity).toHaveClass("border-v2-semantic-border-layout");
    expect(identity).toHaveAttribute("aria-label", "Aditi Kumar");
    expect(identity).toHaveAttribute("aria-description", "busy");
    expect(identity).toHaveAttribute("title", "Support agent");
    expect(identity.querySelector("[data-status=busy]")).toBeInTheDocument();
    expect(screen.getByText("AK")).toBeInTheDocument();
  });
});

describe("v2 image fallback", () => {
  it("keeps initials available while a new image loads", () => {
    const { container } = render(
      <Avatar name="Emma Collins" src="/loading.jpg" />
    );
    expect(screen.getByText("EC")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("data-loading", "");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

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

  it("retries a previously failed URL after another URL, including when the other image never loaded", () => {
    const { container, rerender } = render(
      <Avatar name="Emma Collins" src="/first.jpg" />
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(<Avatar name="Emma Collins" src="/second.jpg" />);
    const secondImage = container.querySelector("img");
    expect(secondImage).toHaveAttribute("src", "/second.jpg");
    rerender(<Avatar name="Emma Collins" src="/first.jpg" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/first.jpg");
    expect(container.querySelector("img")).not.toBe(secondImage);
    fireEvent.load(container.querySelector("img")!);
    expect(screen.queryByText("EC")).not.toBeInTheDocument();
  });

  it("starts fresh when src is removed and restored", () => {
    const { container, rerender } = render(
      <Avatar initials="EC" src="/portrait.jpg" />
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(<Avatar initials="EC" />);
    expect(screen.getByText("EC")).toBeInTheDocument();
    rerender(<Avatar initials="EC" src="/portrait.jpg" />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/portrait.jpg"
    );
  });

  it("shows a cached decoded photo immediately without a loading placeholder", () => {
    const complete = vi
      .spyOn(HTMLImageElement.prototype, "complete", "get")
      .mockReturnValue(true);
    const naturalWidth = vi
      .spyOn(HTMLImageElement.prototype, "naturalWidth", "get")
      .mockReturnValue(349);
    try {
      const { container } = render(
        <Avatar name="Emma Collins" src="/cached.jpg" />
      );
      expect(container.querySelector("img")).not.toHaveAttribute(
        "data-loading"
      );
      expect(screen.queryByText("EC")).not.toBeInTheDocument();
    } finally {
      complete.mockRestore();
      naturalWidth.mockRestore();
    }
  });

  it("handles a cached failed image without waiting for another error event", () => {
    const complete = vi
      .spyOn(HTMLImageElement.prototype, "complete", "get")
      .mockReturnValue(true);
    const naturalWidth = vi
      .spyOn(HTMLImageElement.prototype, "naturalWidth", "get")
      .mockReturnValue(0);
    try {
      const { container } = render(
        <Avatar name="Emma Collins" src="/cached-error.jpg" />
      );
      expect(container.querySelector("img")).toBeNull();
      expect(screen.getByText("EC")).toBeInTheDocument();
    } finally {
      complete.mockRestore();
      naturalWidth.mockRestore();
    }
  });

  it("retains native load/error callbacks on the root", () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const { container, rerender } = render(
      <Avatar
        name="Emma Collins"
        src="/first.jpg"
        onLoad={onLoad}
        onError={onError}
      />
    );
    fireEvent.load(container.querySelector("img")!);
    expect(onLoad).toHaveBeenCalledOnce();
    rerender(
      <Avatar
        name="Emma Collins"
        src="/second.jpg"
        onLoad={onLoad}
        onError={onError}
      />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByText("EC")).toBeInTheDocument();
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
      "[&>*]:ring-v2-semantic-bg-primary",
      "[&>*:not(:first-child)]:-ms-1.5",
      "[&>*]:shadow-[0_0_0_3px_var(--v2-semantic-border-layout,var(--semantic-border-layout))]"
    );
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
  });
  it("retains the stack's per-avatar CSS metadata", () => {
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
    expect(
      screen.getByRole("img", { name: "2 more" })
    ).toHaveAccessibleDescription("Meera Iyer, Karan Mehta");
    expect(screen.getByRole("img", { name: "2 more" })).toHaveAttribute(
      "title",
      "Meera Iyer, Karan Mehta"
    );
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
    expect(screen.getByText("+3")).toHaveClass("size-12", "text-base");
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
        className="[&>*]:ring-v2-semantic-bg-ui"
        data-testid="g"
      >
        <Avatar name="Aditi Kumar" size="xl" />
      </AvatarGroup>
    );
    expect(screen.getByRole("img")).toHaveClass("size-16");
    expect(screen.getByTestId("g")).toHaveClass("[&>*]:ring-v2-semantic-bg-ui");
    expect(screen.getByTestId("g")).not.toHaveClass(
      "[&>*]:ring-v2-semantic-bg-primary"
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

  it("floors a fractional limit and updates overflow when people change", () => {
    const { rerender } = render(
      <AvatarGroup max={1.9}>
        <Avatar name="Emma Collins" />
        <Avatar name="Marcus Johnson" />
        <Avatar name="Ava Mitchell" />
      </AvatarGroup>
    );
    expect(
      screen.getByRole("img", { name: "2 more" })
    ).toHaveAccessibleDescription("Marcus Johnson, Ava Mitchell");
    expect(
      screen.queryByRole("img", { name: "Marcus Johnson" })
    ).not.toBeInTheDocument();
    rerender(
      <AvatarGroup max={1.9}>
        <Avatar name="Emma Collins" />
        <Avatar name="Marcus Johnson" />
      </AvatarGroup>
    );
    expect(
      screen.getByRole("img", { name: "1 more" })
    ).toHaveAccessibleDescription("Marcus Johnson");
    expect(screen.queryByText("+2")).not.toBeInTheDocument();
  });

  it("preserves child style overrides and native group attributes", () => {
    const click = vi.fn();
    render(
      <AvatarGroup
        max={1}
        size="lg"
        title="Assigned people"
        onClick={click}
        data-testid="team"
      >
        <Avatar
          name="Emma Collins"
          style={{ width: 80, height: 80, "--index": 4 } as React.CSSProperties}
        />
        <Avatar aria-label="Support backup" initials="MJ" />
      </AvatarGroup>
    );
    const person = screen.getByRole("img", { name: "Emma Collins" });
    expect(person.style.getPropertyValue("--index")).toBe("4");
    expect(person).toHaveStyle({ width: "80px", height: "80px" });
    expect(
      screen.getByRole("img", { name: "1 more" })
    ).toHaveAccessibleDescription("Support backup");
    fireEvent.click(screen.getByTestId("team"));
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByTestId("team")).toHaveAttribute(
      "title",
      "Assigned people"
    );
  });
});
