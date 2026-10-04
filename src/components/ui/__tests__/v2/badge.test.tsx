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
const withoutClasses = (html: string) => html.replace(/ class="[^"]*"/g, "");

describe("Badge (v2)", () => {
  it.each(variants)("preserves the v1 %s variant and markup", (variant) => {
    const props = {
      variant,
      children: "Status",
      leftIcon: <i>✓</i>,
      rightIcon: <i>✓</i>,
    };
    const v1 = render(<BadgeV1 {...props} />).container.innerHTML;
    const v2 = render(<Badge {...props} />).container.innerHTML;
    expect(withoutClasses(v2)).toBe(withoutClasses(v1));
    expect(badgeVariants({ variant })).toContain("font-normal");
    expect(badgeVariantsV1({ variant })).toBeTruthy();
  });
  it.each([
    ["sm", "h-5"],
    ["default", "h-6"],
    ["lg", "h-[30px]"],
  ] as const)("uses the recorded %s height", (size, height) => {
    render(
      <Badge size={size} data-testid="badge">
        Status
      </Badge>
    );
    expect(screen.getByTestId("badge")).toHaveClass(height, "rounded-[25px]");
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
      expect(badge.querySelector("span")).toBeNull();
      expect(badge.children).toHaveLength(0);
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
      expect(screen.getByText("Online")).toBe(badge);
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
