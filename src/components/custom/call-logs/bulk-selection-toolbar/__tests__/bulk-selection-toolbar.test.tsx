import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BulkSelectionToolbar } from "../bulk-selection-toolbar";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

describe("BulkSelectionToolbar", () => {
  it("renders the selection count", () => {
    render(<BulkSelectionToolbar selectedCount={16} />);
    expect(screen.getByText("16 selected")).toBeInTheDocument();
  });

  /* ── actions ── */

  it("renders each action's label when actions is provided", () => {
    render(
      <BulkSelectionToolbar
        selectedCount={2}
        actions={[
          { label: "Download Recordings", onClick: vi.fn() },
          { label: "Delete", onClick: vi.fn() },
        ]}
      />
    );
    expect(screen.getByText("Download Recordings")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls the clicked action's onClick and not another action's", () => {
    const onDownload = vi.fn();
    const onDelete = vi.fn();
    render(
      <BulkSelectionToolbar
        selectedCount={2}
        actions={[
          { label: "Download Recordings", onClick: onDownload },
          { label: "Delete", onClick: onDelete },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDownload).not.toHaveBeenCalled();
  });

  it("renders with an empty actions array by default without errors", () => {
    const { container } = render(<BulkSelectionToolbar selectedCount={0} />);
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  /* ── onClose ── */

  it("renders no close button when onClose is omitted", () => {
    render(<BulkSelectionToolbar selectedCount={3} />);
    expect(
      screen.queryByRole("button", { name: "Clear selection" })
    ).not.toBeInTheDocument();
  });

  it("renders a close button when onClose is provided and calls it on click", () => {
    const onClose = vi.fn();
    render(<BulkSelectionToolbar selectedCount={3} onClose={onClose} />);
    const closeButton = screen.getByRole("button", { name: "Clear selection" });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <BulkSelectionToolbar selectedCount={1} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BulkSelectionToolbar selectedCount={1} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<BulkSelectionToolbar selectedCount={1} data-testid="toolbar" />);
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // BulkSelectionToolbar currently renders no <p> tags (span/button only),
    // so this is trivially satisfied — kept as a regression guard for future changes.
    const { container } = render(<BulkSelectionToolbar selectedCount={1} />);
    assertNoBootstrapMarginBleed(container);
  });
});
