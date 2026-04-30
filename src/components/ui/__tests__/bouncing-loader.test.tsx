import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BouncingLoader } from "../bouncing-loader";

function getDots(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(".bouncing-loader__dot")
  );
}

describe("BouncingLoader", () => {
  it("renders three aria-hidden dots", () => {
    const { container } = render(<BouncingLoader />);
    const dots = getDots(container);

    expect(dots).toHaveLength(3);
    dots.forEach((dot) => {
      expect(dot).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("applies the wave animation with staggered per-dot delay", () => {
    const { container } = render(<BouncingLoader />);
    const root = container.firstElementChild as HTMLElement;
    const dots = getDots(container);

    expect(root).toHaveClass("inline-flex");
    expect(
      dots.map((dot) => dot.style.getPropertyValue("--bouncing-loader-delay"))
    ).toEqual(["0s", "0.2s", "0.4s"]);
    dots.forEach((dot) => {
      expect(dot).toHaveClass("animate-bouncing-typing-wave");
    });
  });

  it("supports custom size, spacing, color, and className", () => {
    const { container } = render(
      <BouncingLoader
        className="custom-loader"
        size={10}
        spacing={4}
        color="var(--semantic-text-muted)"
      />
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass("custom-loader");
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe("10px");
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "4px"
    );
    expect(root.style.getPropertyValue("--bouncing-loader-color")).toBe(
      "var(--semantic-text-muted)"
    );
  });

  it("forwards refs", () => {
    const ref = { current: null };
    render(<BouncingLoader ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("exposes a polite live status to screen readers by default", () => {
    const { container } = render(<BouncingLoader />);
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute("role", "status");
    expect(root).toHaveAttribute("aria-live", "polite");
    expect(root).toHaveAttribute("aria-label", "Loading");
  });

  it("lets consumers override the default aria-label", () => {
    const { container } = render(<BouncingLoader aria-label="Sending message" />);
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute("aria-label", "Sending message");
  });
});
