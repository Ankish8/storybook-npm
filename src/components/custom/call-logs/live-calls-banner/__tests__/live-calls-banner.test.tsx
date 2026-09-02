import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LiveCallsBanner } from "../live-calls-banner";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

describe("LiveCallsBanner", () => {
  /* ── count text ── */

  it("renders plural 'live calls' text for count=2", () => {
    render(<LiveCallsBanner count={2} />);
    expect(screen.getByText("2 live calls")).toBeInTheDocument();
  });

  it("renders singular 'live call' text for count=1", () => {
    render(<LiveCallsBanner count={1} />);
    expect(screen.getByText("1 live call")).toBeInTheDocument();
  });

  /* ── toggle button ── */

  it("shows a 'Hide' button when onToggle is provided and expanded is true (default); clicking it calls onToggle", () => {
    const onToggle = vi.fn();
    render(<LiveCallsBanner count={2} onToggle={onToggle} />);
    const button = screen.getByRole("button", { name: "Hide" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows a 'Show' button when expanded is false and onToggle is provided", () => {
    const onToggle = vi.fn();
    render(<LiveCallsBanner count={2} expanded={false} onToggle={onToggle} />);
    expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument();
  });

  it("renders no toggle button when onToggle is omitted", () => {
    render(<LiveCallsBanner count={2} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  /* ── aria-expanded ── */

  it("reflects expanded=true via aria-expanded on the toggle button", () => {
    render(<LiveCallsBanner count={2} expanded onToggle={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Hide" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("reflects expanded=false via aria-expanded on the toggle button", () => {
    render(<LiveCallsBanner count={2} expanded={false} onToggle={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Show" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <LiveCallsBanner count={2} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LiveCallsBanner count={2} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<LiveCallsBanner count={2} data-testid="banner" />);
    expect(screen.getByTestId("banner")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // LiveCallsBanner currently renders no <p> tags (spans only), so this is
    // trivially satisfied — kept as a regression guard for future changes.
    const { container } = render(
      <LiveCallsBanner count={2} onToggle={vi.fn()} />
    );
    assertNoBootstrapMarginBleed(container);
  });
});
