import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressIndicator } from "../../v2/progress-indicator";
describe("v2 ProgressIndicator", () => {
  it("exposes labelled progress and current value", () => {
    render(<ProgressIndicator value={30} aria-label="Import" />);
    expect(screen.getByRole("progressbar", { name: "Import" })).toHaveAttribute(
      "aria-valuenow",
      "30"
    );
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
  it("clamps out-of-range values", () => {
    const { rerender } = render(<ProgressIndicator value={110} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
    rerender(<ProgressIndicator value={-1} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });
  it("handles non-finite values", () => {
    render(<ProgressIndicator value={NaN} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });
  it("omits the determinate value while loading", () => {
    render(<ProgressIndicator indeterminate />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow"
    );
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });
  it("allows hidden visual labels while retaining accessible progress", () => {
    render(
      <ProgressIndicator value={50} labelPosition="none" variant="circle" />
    );
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });
  describe("indeterminate bar", () => {
    const renderBar = (props = {}) => {
      const view = render(
        <ProgressIndicator indeterminate aria-label="Syncing" {...props} />
      );
      const root = screen.getByRole("progressbar", { name: "Syncing" });
      const track = root.firstElementChild as HTMLElement;
      return {
        ...view,
        root,
        track,
        fill: track.firstElementChild as HTMLElement,
      };
    };
    it("stays an accessible progressbar without a value or visible percentage", () => {
      const { root } = renderBar();
      expect(root).not.toHaveAttribute("aria-valuenow");
      expect(root).toHaveAttribute("aria-valuemin", "0");
      expect(root).toHaveAttribute("aria-valuemax", "100");
      expect(root).toHaveAttribute("aria-label", "Syncing");
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });
    it("slides a 30% bar across the track for 1.5s, only when motion is allowed", () => {
      const { fill } = renderBar();
      expect(fill).toHaveStyle({ width: "30%" });
      expect(fill).toHaveClass(
        "motion-safe:[animation:myoperator-v2-progress-slide_1.5s_cubic-bezier(0.65,0,0.35,1)_infinite]"
      );
      // No pulse any more, and no ungated animation: reduced motion is left with the static partial fill.
      expect(fill).not.toHaveClass("animate-pulse");
      expect(fill.className).not.toMatch(/(^|\s)animate-/);
    });
    it("ships its own keyframes from -100% to 350% of the bar width", () => {
      const { track } = renderBar();
      const css = track.querySelector("style")?.textContent ?? "";
      expect(css).toContain("@keyframes myoperator-v2-progress-slide");
      expect(css).toContain("translateX(-100%)");
      expect(css).toContain("translateX(350%)");
    });
    it("keeps the track > fill structure: the keyframes never come before the bar", () => {
      const { root, track, fill } = renderBar();
      expect(root.children).toHaveLength(1);
      expect(track.firstElementChild).toBe(fill);
      expect(fill.tagName).toBe("DIV");
    });
    it("adds no animation or keyframes to a determinate bar", () => {
      const { track, fill } = renderBar({ indeterminate: false, value: 40 });
      expect(track.querySelector("style")).toBeNull();
      expect(fill).toHaveStyle({ width: "40%" });
      expect(fill.className).not.toMatch(
        /animate|myoperator-v2-progress-slide/
      );
    });
    it("leaves the circular indeterminate spinner alone", () => {
      const { container } = render(
        <ProgressIndicator variant="circle" indeterminate />
      );
      expect(container.querySelector("style")).toBeNull();
      expect(
        container.querySelector("circle.animate-spin")
      ).toBeInTheDocument();
    });
  });
  describe("percentage text", () => {
    it.each([
      ["bar", "right"],
      ["bar", "bottom"],
      ["circle", "right"],
      ["semi-circle", "right"],
    ] as const)(
      "uses tabular figures for the %s %s label",
      (variant, labelPosition) => {
        render(
          <ProgressIndicator
            value={37}
            variant={variant}
            labelPosition={labelPosition}
          />
        );
        expect(screen.getByText("37%")).toHaveClass("tabular-nums");
      }
    );
  });
});
