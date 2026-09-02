import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CallLogsCustomizeTabsModal } from "../call-logs-customize-tabs-modal";
import type { CallLogsCustomizeTabsView } from "../types";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const BASE_VIEWS: CallLogsCustomizeTabsView[] = [
  { id: "all", label: "All", count: 23, pinned: true, isDefault: true },
  { id: "missed-by-agent", label: "Missed by Agent", count: 5, pinned: true },
  { id: "connected", label: "Connected", count: 12, pinned: true },
  { id: "incoming", label: "Incoming", count: 20, pinned: false },
  { id: "outgoing", label: "Outgoing", count: 1, pinned: false },
];

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsCustomizeTabsModal>> = {}) {
  const onOpenChange = vi.fn();
  const onViewsChange = vi.fn();
  const utils = render(
    <CallLogsCustomizeTabsModal
      open={true}
      onOpenChange={onOpenChange}
      views={BASE_VIEWS}
      onViewsChange={onViewsChange}
      {...overrides}
    />
  );
  return { ...utils, onOpenChange, onViewsChange };
}

describe("CallLogsCustomizeTabsModal", () => {
  it("renders the title and description", () => {
    renderModal();
    expect(screen.getByText("Customize Tabs")).toBeInTheDocument();
    expect(
      screen.getByText("Choose which views appear as tabs and arrange their order.")
    ).toBeInTheDocument();
  });

  it("renders both section labels and every view's label and count", () => {
    renderModal();
    expect(screen.getByText("PINNED — SHOWN AS TABS")).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE — IN "MORE"')).toBeInTheDocument();
    expect(screen.getByText("Missed by Agent")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Incoming")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  /* ── default view ── */

  it("renders the default view with '-' order and 'Always shown' placement, with no interactive controls", () => {
    renderModal();
    expect(screen.queryByRole("button", { name: "Move All up" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move All down" })).not.toBeInTheDocument();
    expect(screen.getByText("Always shown")).toBeInTheDocument();
  });

  /* ── pinned rows ── */

  it("disables 'up' for the first reorderable pinned view and enables it otherwise", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Move Missed by Agent up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Connected up" })).not.toBeDisabled();
  });

  it("disables 'down' for the last pinned view and enables it otherwise", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Move Connected down" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Missed by Agent down" })).not.toBeDisabled();
  });

  it("swaps a pinned view up and reports the full updated array", () => {
    const { onViewsChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Move Connected up" }));
    expect(onViewsChange).toHaveBeenCalledWith([
      BASE_VIEWS[0],
      BASE_VIEWS[2],
      BASE_VIEWS[1],
      BASE_VIEWS[3],
      BASE_VIEWS[4],
    ]);
  });

  it("swaps a pinned view down and reports the full updated array", () => {
    const { onViewsChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Move Missed by Agent down" }));
    expect(onViewsChange).toHaveBeenCalledWith([
      BASE_VIEWS[0],
      BASE_VIEWS[2],
      BASE_VIEWS[1],
      BASE_VIEWS[3],
      BASE_VIEWS[4],
    ]);
  });

  it("never lets a pinned view swap past the default view", () => {
    const { onViewsChange } = renderModal();
    // "Missed by Agent" up-button is disabled, but clicking a disabled button fires no click.
    fireEvent.click(screen.getByRole("button", { name: "Move Missed by Agent up" }));
    expect(onViewsChange).not.toHaveBeenCalled();
  });

  /* ── pin / unpin ── */

  it("unpins a pinned view, moving it to the end of the available list", () => {
    const { onViewsChange } = renderModal();
    const unpinButtons = screen.getAllByRole("button", { name: "Unpin" });
    fireEvent.click(unpinButtons[0]); // "Missed by Agent"
    expect(onViewsChange).toHaveBeenCalledWith([
      BASE_VIEWS[0],
      BASE_VIEWS[2],
      BASE_VIEWS[3],
      BASE_VIEWS[4],
      { ...BASE_VIEWS[1], pinned: false },
    ]);
  });

  it("pins an available view, moving it to the end of the pinned list", () => {
    const { onViewsChange } = renderModal();
    const pinButtons = screen.getAllByRole("button", { name: "Pin" });
    fireEvent.click(pinButtons[0]); // "Incoming"
    expect(onViewsChange).toHaveBeenCalledWith([
      BASE_VIEWS[0],
      BASE_VIEWS[1],
      BASE_VIEWS[2],
      { ...BASE_VIEWS[3], pinned: true },
      BASE_VIEWS[4],
    ]);
  });

  it("does not render a Pin/Unpin action for the default view", () => {
    renderModal();
    // Only the two non-default pinned views ("Unpin") plus two available ("Pin") — never one tied to "All".
    expect(screen.getAllByRole("button", { name: "Unpin" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Pin" })).toHaveLength(2);
  });

  /* ── max pinned presets (FIFO eviction) ── */

  const FULLY_PINNED_VIEWS: CallLogsCustomizeTabsView[] = [
    { id: "all", label: "All", pinned: true, isDefault: true },
    { id: "preset-1", label: "Preset 1", pinned: true },
    { id: "preset-2", label: "Preset 2", pinned: true },
    { id: "preset-3", label: "Preset 3", pinned: true },
    { id: "preset-4", label: "Preset 4", pinned: true },
    { id: "preset-5", label: "Preset 5", pinned: false },
  ];

  it("evicts the longest-pinned non-default view (FIFO) when pinning a 5th (default cap)", () => {
    const { onViewsChange } = renderModal({ views: FULLY_PINNED_VIEWS });
    fireEvent.click(screen.getByRole("button", { name: "Pin" })); // "Preset 5" is the only available view
    expect(onViewsChange).toHaveBeenCalledWith([
      FULLY_PINNED_VIEWS[0],
      FULLY_PINNED_VIEWS[2],
      FULLY_PINNED_VIEWS[3],
      FULLY_PINNED_VIEWS[4],
      { ...FULLY_PINNED_VIEWS[5], pinned: true },
      { ...FULLY_PINNED_VIEWS[1], pinned: false },
    ]);
  });

  it("does not evict anything when pinning while still under a custom maxPinnedPresets", () => {
    const twoOfThree: CallLogsCustomizeTabsView[] = [
      { id: "all", label: "All", pinned: true, isDefault: true },
      { id: "preset-1", label: "Preset 1", pinned: true },
      { id: "preset-2", label: "Preset 2", pinned: false },
    ];
    const { onViewsChange } = renderModal({ views: twoOfThree, maxPinnedPresets: 2 });
    fireEvent.click(screen.getByRole("button", { name: "Pin" }));
    expect(onViewsChange).toHaveBeenCalledWith([
      twoOfThree[0],
      twoOfThree[1],
      { ...twoOfThree[2], pinned: true },
    ]);
  });

  it("respects a custom maxPinnedPresets when evicting", () => {
    const atCustomCap: CallLogsCustomizeTabsView[] = [
      { id: "all", label: "All", pinned: true, isDefault: true },
      { id: "preset-1", label: "Preset 1", pinned: true },
      { id: "preset-2", label: "Preset 2", pinned: true },
      { id: "preset-3", label: "Preset 3", pinned: false },
    ];
    const { onViewsChange } = renderModal({ views: atCustomCap, maxPinnedPresets: 2 });
    fireEvent.click(screen.getByRole("button", { name: "Pin" }));
    expect(onViewsChange).toHaveBeenCalledWith([
      atCustomCap[0],
      atCustomCap[2],
      { ...atCustomCap[3], pinned: true },
      { ...atCustomCap[1], pinned: false },
    ]);
  });

  /* ── footer actions ── */

  it("calls onAddNewView when New View is clicked", () => {
    const onAddNewView = vi.fn();
    renderModal({ onAddNewView });
    fireEvent.click(screen.getByText("New View"));
    expect(onAddNewView).toHaveBeenCalledTimes(1);
  });

  it("calls onDone when Done is clicked", () => {
    const onDone = vi.fn();
    renderModal({ onDone });
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) when the close (X) button is clicked", () => {
    const { onOpenChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  /* ── misc ── */

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Customize Tabs")).not.toBeInTheDocument();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    renderModal();
    assertNoBootstrapMarginBleed(screen.getByRole("dialog"));
  });
});
