import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Panel } from "../panel";

describe("Panel", () => {
  it("renders with title and children", () => {
    render(
      <Panel title="Details">
        <p className="m-0">Panel content</p>
      </Panel>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("renders with custom header replacing the default", () => {
    render(
      <Panel
        title="Should Not Appear"
        header={<div data-testid="custom-header">Custom Header</div>}
      >
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
    expect(screen.queryByText("Should Not Appear")).not.toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Panel title="Test" footer={<button>Save</button>}>
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Panel title="Closable" onClose={handleClose}>
        <p className="m-0">Body</p>
      </Panel>
    );
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides panel when open=false (w-0 class)", () => {
    const { container } = render(
      <Panel open={false} title="Hidden">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("w-0");
    expect(container.firstChild).toHaveClass("border-l-0");
  });

  it("shows panel when open=true with width class", () => {
    const { container } = render(
      <Panel open={true} title="Visible">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("w-[320px]");
    expect(container.firstChild).not.toHaveClass("w-0");
  });

  it.each([
    ["sm", "w-[280px]"],
    ["default", "w-[320px]"],
    ["lg", "w-[400px]"],
  ] as const)(
    "applies correct width class for size=%s",
    (size, expectedClass) => {
      const { container } = render(
        <Panel open={true} size={size} title="Sized">
          <p className="m-0">Body</p>
        </Panel>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    }
  );

  it("applies custom className", () => {
    const { container } = render(
      <Panel className="my-custom-class" title="Custom">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Panel ref={ref} title="Ref Test">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("ASIDE");
  });

  it("renders children in scrollable body", () => {
    const { container } = render(
      <Panel title="Scroll">
        <p className="m-0">Child content</p>
      </Panel>
    );
    const body = container.querySelector(".overflow-y-auto");
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent("Child content");
  });

  it("spreads data-testid and other props", () => {
    render(
      <Panel data-testid="my-panel" aria-label="Side panel" title="Props">
        <p className="m-0">Body</p>
      </Panel>
    );
    const panel = screen.getByTestId("my-panel");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("aria-label", "Side panel");
  });

  // --- Accessibility tests ---

  it("renders as aside element", () => {
    const { container } = render(
      <Panel title="A11y Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect((container.firstChild as HTMLElement).tagName).toBe("ASIDE");
  });

  it("has aria-label matching title", () => {
    const { container } = render(
      <Panel title="Contact Details">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Contact Details"
    );
  });

  it("has aria-hidden when closed", () => {
    const { container } = render(
      <Panel open={false} title="Hidden Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("does not have aria-hidden when open", () => {
    const { container } = render(
      <Panel open={true} title="Visible Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute("aria-hidden", "false");
  });

  it("calls onClose on Escape key", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Panel title="Escape Panel" onClose={handleClose}>
        <p className="m-0">Body</p>
      </Panel>
    );
    fireEvent.keyDown(container.firstChild as HTMLElement, {
      key: "Escape",
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("close button has aria-label", () => {
    render(
      <Panel title="Close Label" onClose={() => {}}>
        <p className="m-0">Body</p>
      </Panel>
    );
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("aria-label", "Close");
  });
});
