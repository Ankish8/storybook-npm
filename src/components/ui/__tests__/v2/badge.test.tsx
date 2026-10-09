import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("follows Arc's metrics: 1px border, 500 weight, 5px gap, 240ms colour easing", () => {
    const cls = badgeVariants({ variant: "active" });
    expect(cls).toContain("border ");
    expect(cls).not.toContain("border-[0.4px]");
    expect(cls).toContain("font-medium");
    expect(cls).toContain("gap-[5px]");
    expect(cls).toContain("tracking-[-0.01em]");
    expect(cls).toContain("[transition-duration:240ms]");
  });
  it("tints its own border and fill on hover-capable pointers, but not when disabled", () => {
    expect(badgeVariants({ variant: "failed" })).toContain(
      "[@media(hover:hover)_and_(pointer:fine)]:hover:[border-color:color-mix(in_oklab,currentColor_32%,var(--semantic-border-layout))]"
    );
    expect(badgeVariants({ variant: "disabled" })).not.toContain("hover:");
  });
  it("hides the outgoing label from assistive tech while a new one swaps in", () => {
    const { rerender } = render(<Badge data-testid="b">Pending</Badge>);
    rerender(<Badge data-testid="b">Done</Badge>);
    expect(screen.getByText("Done")).not.toHaveAttribute("aria-hidden");
    const old = screen.queryByText("Pending");
    if (old) expect(old).toHaveAttribute("aria-hidden", "true");
  });
  it("uses the exact v2 black Info border", () => {
    expect(badgeVariants({ variant: "information" })).toContain(
      "border-[var(--color-black)]"
    );
  });
  it("uses status text tokens rather than the brighter action colors", () => {
    expect(badgeVariants({ variant: "active" })).toContain(
      "text-semantic-success-text"
    );
    expect(badgeVariants({ variant: "failed" })).toContain(
      "text-semantic-error-text"
    );
    expect(badgeVariants({ variant: "warning" })).toContain(
      "text-semantic-warning-text"
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
      const dot = badge.querySelector("span");
      expect(dot).toHaveAttribute("aria-hidden", "true");
      expect(dot).toHaveClass(
        "size-[7px]",
        "rounded-full",
        "bg-current",
        "shrink-0"
      );
      // currentColor resolves to the variant text colour, so the dot cannot drift from the label.
      expect(badge).toHaveClass("text-semantic-success-text");
      expect(dot).toBeEmptyDOMElement();
      expect(badge).toContainElement(screen.getByText("Online"));
    });
    it("leads the label and sits before an icon", () => {
      render(
        <Badge dot leftIcon={<i data-testid="icon" />} data-testid="badge">
          Online
        </Badge>
      );
      const [first, second] = Array.from(screen.getByTestId("badge").children);
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
