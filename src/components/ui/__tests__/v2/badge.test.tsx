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
});
