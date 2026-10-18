import * as React from "react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { animate } from "motion/react";
import { Badge, badgeVariants } from "../../v2/badge";
import {
  Badge as BadgeV1,
  badgeVariants as badgeVariantsV1,
} from "../../badge";

const variants = [
  "default",
  "primary",
  "active",
  "information",
  "warning",
  "failed",
  "disabled",
  "secondary",
  "outline",
  "destructive",
] as const;
const sizes = ["sm", "default", "lg"] as const;

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    animate: vi.fn(actual.animate),
  };
});

const matchMedia = window.matchMedia;
let reducedMotion = false;
const preferenceListeners = new Set<() => void>();

beforeEach(() => {
  reducedMotion = false;
  preferenceListeners.clear();
  vi.spyOn(window, "matchMedia").mockImplementation((query) => {
    if (query !== "(prefers-reduced-motion: reduce)") return matchMedia(query);
    return {
      matches: reducedMotion,
      media: query,
      onchange: null,
      addListener: (listener: () => void) => preferenceListeners.add(listener),
      removeListener: (listener: () => void) =>
        preferenceListeners.delete(listener),
      addEventListener: (_type: string, listener: () => void) =>
        preferenceListeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) =>
        preferenceListeners.delete(listener),
      dispatchEvent: () => false,
    } as MediaQueryList;
  });
  vi.mocked(animate).mockClear();
});

afterEach(() => vi.restoreAllMocks());

describe("Badge (v2)", () => {
  it.each(variants)(
    "preserves the v1 %s variant, label and icons with a motion label",
    (variant) => {
      const props = {
        variant,
        children: "Status",
        leftIcon: <i>✓</i>,
        rightIcon: <i>✓</i>,
      };
      const v1 = render(<BadgeV1 {...props} />).container.innerHTML;
      const v2 = render(<Badge {...props} />).container.innerHTML;
      const legacy = document.createElement("div");
      legacy.innerHTML = v1;
      const current = document.createElement("div");
      current.innerHTML = v2;
      expect(current.textContent).toBe(legacy.textContent);
      expect(current.firstElementChild?.tagName).toBe(
        legacy.firstElementChild?.tagName
      );
      expect(current.querySelectorAll("i")).toHaveLength(2);
      expect(current.querySelectorAll("[aria-hidden=true]")).toHaveLength(2);
      expect(badgeVariants({ variant })).toContain("font-medium");
      expect(badgeVariantsV1({ variant })).toBeTruthy();
    }
  );
  it.each([
    ["sm", "h-[22px]"],
    ["default", "h-[26px]"],
    ["lg", "h-[30px]"],
  ] as const)("uses the recorded %s height", (size, height) => {
    render(
      <Badge size={size} data-testid="badge">
        Status
      </Badge>
    );
    expect(screen.getByTestId("badge")).toHaveClass(height, "rounded-[25px]");
  });
  it("keeps the compact 1px border, medium label, and 5px content gap", () => {
    const cls = badgeVariants({ variant: "active" });
    expect(cls).toContain("border ");
    expect(cls).not.toContain("border-[0.4px]");
    expect(cls).toContain("font-medium");
    expect(cls).toContain("gap-[5px]");
    expect(cls).toContain("tracking-[-0.01em]");
    expect(cls).toContain("motion-reduce:transition-none");
  });
  it.each(variants)("stays quiet on hover for %s", (variant) => {
    const classes = badgeVariants({ variant });
    expect(classes).not.toMatch(/hover:|scale-|translate-|animate-/);
  });
  it("hides the outgoing label from assistive tech while a new one swaps in", () => {
    const { rerender } = render(<Badge data-testid="b">Pending</Badge>);
    rerender(<Badge data-testid="b">Done</Badge>);
    expect(screen.getByText("Done")).not.toHaveAttribute("aria-hidden");
    const old = screen.queryByText("Pending");
    if (old) expect(old).toHaveAttribute("aria-hidden", "true");
  });
  it("uses the semantic information border", () => {
    expect(badgeVariants({ variant: "information" })).toContain(
      "border-v2-semantic-info-border"
    );
  });
  it("uses status text tokens rather than the brighter action colors", () => {
    expect(badgeVariants({ variant: "active" })).toContain(
      "text-v2-semantic-success-text"
    );
    expect(badgeVariants({ variant: "failed" })).toContain(
      "text-v2-semantic-error-text"
    );
    expect(badgeVariants({ variant: "warning" })).toContain(
      "text-v2-semantic-warning-text"
    );
  });
  it.each(sizes)("allows height and gap overrides for %s", (size) => {
    render(
      <Badge size={size} className="h-9 gap-3" data-testid="badge">
        Status
      </Badge>
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("h-9", "gap-3");
    expect(badge).not.toHaveClass("gap-2");
  });
  it("forwards its ref and native attributes", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Badge ref={ref} aria-label="Current status">
        Active
      </Badge>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("aria-label", "Current status");
  });
  it("preserves native drag and animation event callbacks", () => {
    const onDrag = vi.fn();
    const onAnimationStart = vi.fn();
    render(
      <Badge
        data-testid="native-badge"
        draggable
        onDrag={onDrag}
        onAnimationStart={onAnimationStart}
      >
        Status
      </Badge>
    );
    const badge = screen.getByTestId("native-badge");
    fireEvent.drag(badge);
    fireEvent.animationStart(badge);
    expect(onDrag).toHaveBeenCalledOnce();
    expect(onDrag.mock.calls[0][0].type).toBe("drag");
    expect(onAnimationStart).toHaveBeenCalledOnce();
    expect(onAnimationStart.mock.calls[0][0].target).toBe(badge);
    expect(badge).toHaveAttribute("draggable", "true");
  });
  it("keeps custom style and keyboard callbacks on the native root", () => {
    const onKeyDown = vi.fn();
    render(
      <Badge
        data-testid="badge"
        style={{ gap: 12, width: 150 }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        Status
      </Badge>
    );
    const badge = screen.getByTestId("badge");
    fireEvent.keyDown(badge, { key: "Enter" });
    expect(onKeyDown.mock.calls[0][0].key).toBe("Enter");
    expect(badge).toHaveStyle({ gap: "12px", width: "150px" });
    expect(badge).toHaveAttribute("tabindex", "0");
  });
  it("keeps the Slot link and click behavior", () => {
    const onClick = vi.fn();
    render(
      <Badge asChild onClick={onClick}>
        <a href="#status">View status</a>
      </Badge>
    );
    screen.getByRole("link").click();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#status");
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("merges the child and badge refs through Slot", () => {
    const childRef = React.createRef<HTMLAnchorElement>();
    const badgeRef = vi.fn();
    const { unmount } = render(
      <Badge asChild ref={badgeRef} aria-label="View review status">
        <a href="#status" ref={childRef} className="child-class">
          View status
        </a>
      </Badge>
    );
    const link = screen.getByRole("link", { name: "View review status" });
    expect(childRef.current).toBe(link);
    expect(badgeRef).toHaveBeenLastCalledWith(link);
    expect(link).toHaveClass("child-class", "bg-v2-semantic-bg-ui");
    unmount();
    expect(childRef.current).toBeNull();
    expect(badgeRef).toHaveBeenLastCalledWith(null);
  });
  it("keeps passive badges out of the tab order while a slotted link remains keyboard operable", async () => {
    const onClick = vi.fn();
    render(
      <>
        <Badge>Ready</Badge>
        <Badge asChild onClick={onClick}>
          <a href="#status">View status</a>
        </Badge>
      </>
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("link")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByText("Ready").closest("div")).not.toHaveAttribute(
      "tabindex"
    );
  });
  it("keeps disabled as a visual status rather than silently blocking native events", () => {
    const onClick = vi.fn();
    render(
      <Badge variant="disabled" data-testid="badge" onClick={onClick}>
        Inactive
      </Badge>
    );
    fireEvent.click(screen.getByTestId("badge"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByTestId("badge")).not.toHaveAttribute("aria-disabled");
  });
  it("does not add a live region, but forwards an explicitly requested announcement", () => {
    const { rerender } = render(<Badge data-testid="badge">Ready</Badge>);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByTestId("badge")).not.toHaveAttribute("aria-live");
    rerender(
      <Badge data-testid="badge" role="status" aria-live="polite">
        Approved
      </Badge>
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
  it("renders arbitrary children without cloning or concealing their semantics", () => {
    render(
      <Badge>
        <strong>Review</strong>
        <a href="#details">Details</a>
      </Badge>
    );
    expect(screen.getByText("Review").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "#details"
    );
  });
  it("retains the DOM node when the same decorative icon re-renders", () => {
    const { rerender } = render(
      <Badge leftIcon={<i data-testid="icon" />}>Ready</Badge>
    );
    const icon = screen.getByTestId("icon");
    rerender(<Badge leftIcon={<i data-testid="icon" />}>Ready</Badge>);
    expect(screen.getByTestId("icon")).toBe(icon);
    expect(icon.closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
  it("replaces keyed icons without exposing the decorative copies", () => {
    const { rerender } = render(
      <Badge leftIcon={<i key="ready" data-testid="old-icon" />}>Ready</Badge>
    );
    rerender(
      <Badge leftIcon={<i key="approved" data-testid="new-icon" />}>
        Approved
      </Badge>
    );
    expect(
      screen.getByTestId("new-icon").closest("[aria-hidden]")
    ).toHaveAttribute("aria-hidden", "true");
    const old = screen.queryByTestId("old-icon");
    if (old)
      expect(old.closest("[aria-hidden]")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
  });
  it("settles immediately to one current label and icon under reduced motion", () => {
    reducedMotion = true;
    const { rerender } = render(
      <Badge
        leftIcon={<i key="old" data-testid="old-icon" />}
        data-testid="badge"
      >
        Ready
      </Badge>
    );
    rerender(
      <Badge
        leftIcon={<i key="new" data-testid="new-icon" />}
        data-testid="badge"
      >
        Approved
      </Badge>
    );
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.queryByTestId("old-icon")).toBeNull();
    expect(screen.getByTestId("badge")).toHaveTextContent("Approved");
    expect(animate).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("badge").querySelector("[style*=blur]")
    ).toBeNull();
  });
  it("settles an active transition when reduced motion is enabled without a page reload", () => {
    const { rerender } = render(<Badge data-testid="badge">Ready</Badge>);
    rerender(<Badge data-testid="badge">Approved</Badge>);
    act(() => {
      reducedMotion = true;
      preferenceListeners.forEach((listener) => listener());
    });
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.getByTestId("badge")).toHaveTextContent("Approved");
    expect(screen.getByTestId("badge").firstElementChild).toHaveStyle({
      width: "auto",
    });
    expect(
      screen.getByTestId("badge").querySelector("[style*=blur]")
    ).toBeNull();
  });
  it("springs the width only for a meaningful label change, then returns to intrinsic sizing", () => {
    let measuredWidth = 40;
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({
        width: measuredWidth,
        height: 12,
        top: 0,
        right: measuredWidth,
        bottom: 12,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
    const { rerender, unmount } = render(
      <Badge data-testid="badge">Ready</Badge>
    );
    expect(animate).not.toHaveBeenCalled();
    measuredWidth = 65;
    rerender(<Badge data-testid="badge">Approved</Badge>);
    expect(animate).toHaveBeenCalledOnce();
    const [value, target, options] = vi.mocked(animate).mock.calls[0];
    expect(target).toEqual([40, 65]);
    expect(options).toMatchObject({ type: "spring", bounce: 0 });
    // A parent re-render with the same content must not restart that transition.
    rerender(
      <Badge data-testid="badge" title="Current status">
        Approved
      </Badge>
    );
    expect(animate).toHaveBeenCalledOnce();
    act(() => {
      (options as { onComplete?: () => void }).onComplete?.();
    });
    expect(screen.getByTestId("badge").firstElementChild).toHaveStyle({
      width: "auto",
    });
    expect((value as { get(): unknown }).get()).toBe("auto");
    unmount();
    expect((value as { get(): unknown }).get()).toBe("auto");
    rect.mockRestore();
  });
  it("snaps passive size changes rather than treating them as a status update", () => {
    let measuredWidth = 40;
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({
        width: measuredWidth,
        height: 12,
        top: 0,
        right: measuredWidth,
        bottom: 12,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
    const { rerender } = render(<Badge>Ready</Badge>);
    measuredWidth = 60;
    rerender(<Badge size="lg">Ready</Badge>);
    expect(animate).not.toHaveBeenCalled();
    rect.mockRestore();
  });
  describe("dot", () => {
    it("renders nothing extra by default", () => {
      render(<Badge data-testid="badge">Active</Badge>);
      const badge = screen.getByTestId("badge");
      expect(badge.querySelector("[aria-hidden=true]")).toBeNull();
      expect(badge).toHaveTextContent("Active");
    });
    it("renders a decorative 7px dot that follows the variant's text colour", () => {
      render(
        <Badge variant="active" dot data-testid="badge">
          Online
        </Badge>
      );
      const badge = screen.getByTestId("badge");
      const dot = badge.querySelector("[aria-hidden=true]");
      expect(dot).toHaveAttribute("aria-hidden", "true");
      expect(dot).toHaveClass(
        "size-[7px]",
        "rounded-full",
        "bg-current",
        "shrink-0"
      );
      // currentColor resolves to the variant text colour, so the dot cannot drift from the label.
      expect(badge).toHaveClass("text-v2-semantic-success-text");
      expect(dot).toBeEmptyDOMElement();
      expect(badge).toContainElement(screen.getByText("Online"));
    });
    it("leads the label and sits before an icon", () => {
      render(
        <Badge dot leftIcon={<i data-testid="icon" />} data-testid="badge">
          Online
        </Badge>
      );
      const content = screen.getByTestId("icon").parentElement?.parentElement;
      const [first, second] = Array.from(content?.children ?? []);
      expect(first).toHaveAttribute("aria-hidden", "true");
      expect(second).toContainElement(screen.getByTestId("icon"));
    });
    it.each(variants)("does not leak dot onto the DOM for %s", (variant) => {
      render(
        <Badge variant={variant} dot data-testid="badge">
          Status
        </Badge>
      );
      expect(screen.getByTestId("badge")).not.toHaveAttribute("dot");
    });
    it("does not alter the label's accessible text", () => {
      render(<Badge dot>Online</Badge>);
      expect(screen.getByText("Online")).toHaveTextContent(/^Online$/);
    });
    it("is ignored with asChild because a slotted child cannot gain elements", () => {
      render(
        <Badge asChild dot>
          <a href="#status">View status</a>
        </Badge>
      );
      const link = screen.getByRole("link");
      expect(link.querySelector("span")).toBeNull();
      expect(link).not.toHaveAttribute("dot");
    });
  });
});
