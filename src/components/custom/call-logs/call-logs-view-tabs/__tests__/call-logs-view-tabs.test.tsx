import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsViewTabs } from "../call-logs-view-tabs";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const baseTabs = [
  { id: "all", label: "All" },
  { id: "connected", label: "Connected", removable: true },
  { id: "missed", label: "Missed", removable: true },
];

const manyPresetTabs = [
  { id: "all", label: "All" },
  { id: "preset-1", label: "Connected", removable: true },
  { id: "preset-2", label: "Missed", removable: true },
  { id: "preset-3", label: "AI Handled", removable: true },
  { id: "preset-4", label: "Voicemail", removable: true },
  { id: "preset-5", label: "Starred", removable: true },
];

describe("CallLogsViewTabs", () => {
  it("renders every tab's label", () => {
    render(
      <CallLogsViewTabs tabs={baseTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Missed")).toBeInTheDocument();
  });

  /* ── active state ── */

  it("applies the active-state class to the tab matching activeTabId", () => {
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="connected"
        onTabChange={vi.fn()}
      />
    );
    expect(screen.getByText("Connected")).toHaveClass(
      "bg-semantic-info-surface",
      "text-semantic-text-secondary"
    );
    expect(screen.getByText("All")).toHaveClass("text-semantic-text-muted");
    expect(screen.getByText("All")).not.toHaveClass("bg-semantic-info-surface");
  });

  /* ── tab selection ── */

  it("calls onTabChange with the tab's id when an inactive tab is clicked", () => {
    const onTabChange = vi.fn();
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={onTabChange}
      />
    );
    fireEvent.click(screen.getByText("Connected"));
    expect(onTabChange).toHaveBeenCalledWith("connected");
  });

  /* ── removable tabs ── */

  it("renders a remove control only for removable tabs", () => {
    render(
      <CallLogsViewTabs tabs={baseTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Remove Connected view" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Missed view" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Remove All view" })
    ).not.toBeInTheDocument();
  });

  it("keeps the remove control hidden by default, revealed only on tab hover/focus", () => {
    render(
      <CallLogsViewTabs tabs={baseTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    const removeControl = screen.getByRole("button", {
      name: "Remove Connected view",
    });
    expect(removeControl).toHaveClass("hidden");
    expect(removeControl).toHaveClass("group-hover:flex");
    expect(removeControl).toHaveClass("group-focus-within:flex");

    const tab = screen.getByText("Connected").closest("button");
    expect(tab).toHaveClass("group");
  });

  it("calls onRemoveTab (not onTabChange) when the remove control is clicked", () => {
    const onTabChange = vi.fn();
    const onRemoveTab = vi.fn();
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={onTabChange}
        onRemoveTab={onRemoveTab}
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Connected view" })
    );
    expect(onRemoveTab).toHaveBeenCalledWith("connected");
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it("triggers onRemoveTab when Enter is pressed on the focused remove control", () => {
    const onTabChange = vi.fn();
    const onRemoveTab = vi.fn();
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={onTabChange}
        onRemoveTab={onRemoveTab}
      />
    );
    fireEvent.keyDown(
      screen.getByRole("button", { name: "Remove Connected view" }),
      { key: "Enter" }
    );
    expect(onRemoveTab).toHaveBeenCalledWith("connected");
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it("triggers onRemoveTab when Space is pressed on the focused remove control", () => {
    const onRemoveTab = vi.fn();
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        onRemoveTab={onRemoveTab}
      />
    );
    fireEvent.keyDown(
      screen.getByRole("button", { name: "Remove Missed view" }),
      { key: " " }
    );
    expect(onRemoveTab).toHaveBeenCalledWith("missed");
  });

  /* ── empty state ── */

  it("renders correctly with an empty tabs array", () => {
    const { container } = render(
      <CallLogsViewTabs tabs={[]} activeTabId="" onTabChange={vi.fn()} />
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        ref={ref}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(
      <CallLogsViewTabs
        tabs={baseTabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        data-testid="view-tabs"
      />
    );
    expect(screen.getByTestId("view-tabs")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // CallLogsViewTabs currently renders no <p> tags, so this is trivially
    // satisfied — kept as a regression guard for future changes.
    const { container } = render(
      <CallLogsViewTabs tabs={baseTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    assertNoBootstrapMarginBleed(container);
  });

  /* ── overflow "More (N)" dropdown ── */

  it("does not render a More dropdown when removable tabs are within the limit", () => {
    render(<CallLogsViewTabs tabs={baseTabs} activeTabId="all" onTabChange={vi.fn()} />);
    expect(screen.queryByText(/^More \(/)).not.toBeInTheDocument();
  });

  it("shows only the first maxVisiblePresets removable tabs inline, collapsing the rest into More (N)", () => {
    render(
      <CallLogsViewTabs tabs={manyPresetTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    // "All" (non-removable) + first 3 presets render inline
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Missed")).toBeInTheDocument();
    expect(screen.getByText("AI Handled")).toBeInTheDocument();
    // The remaining 2 presets are not rendered inline
    expect(screen.queryByText("Voicemail")).not.toBeInTheDocument();
    expect(screen.queryByText("Starred")).not.toBeInTheDocument();
    expect(screen.getByText("More (2)")).toBeInTheDocument();
  });

  it("respects a custom maxVisiblePresets", () => {
    render(
      <CallLogsViewTabs
        tabs={manyPresetTabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        maxVisiblePresets={1}
      />
    );
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.queryByText("Missed")).not.toBeInTheDocument();
    expect(screen.getByText("More (4)")).toBeInTheDocument();
  });

  it("never counts non-removable built-in views against the visible-preset limit", () => {
    const tabs = [
      { id: "all", label: "All" },
      { id: "active", label: "Active" },
      { id: "archived", label: "Archived" },
      ...manyPresetTabs.filter((t) => t.removable),
    ];
    render(<CallLogsViewTabs tabs={tabs} activeTabId="all" onTabChange={vi.fn()} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
    expect(screen.getByText("More (2)")).toBeInTheDocument();
  });

  it("opens the dropdown and lists overflow tab labels on click", async () => {
    const user = userEvent.setup();
    render(
      <CallLogsViewTabs tabs={manyPresetTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    await user.click(screen.getByText("More (2)"));
    expect(screen.getByRole("menuitem", { name: /Voicemail/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Starred/ })).toBeInTheDocument();
  });

  it("calls onTabChange when an overflow tab is selected from the dropdown", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <CallLogsViewTabs tabs={manyPresetTabs} activeTabId="all" onTabChange={onTabChange} />
    );
    await user.click(screen.getByText("More (2)"));
    await user.click(screen.getByRole("menuitem", { name: /Voicemail/ }));
    expect(onTabChange).toHaveBeenCalledWith("preset-4");
  });

  it("calls onRemoveTab (not onTabChange) when an overflow item's remove control is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    const onRemoveTab = vi.fn();
    render(
      <CallLogsViewTabs
        tabs={manyPresetTabs}
        activeTabId="all"
        onTabChange={onTabChange}
        onRemoveTab={onRemoveTab}
      />
    );
    await user.click(screen.getByText("More (2)"));
    await user.click(screen.getByRole("button", { name: "Remove Voicemail view" }));
    expect(onRemoveTab).toHaveBeenCalledWith("preset-4");
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it("styles the More trigger as active when the active tab is inside the overflow set", () => {
    render(
      <CallLogsViewTabs tabs={manyPresetTabs} activeTabId="preset-4" onTabChange={vi.fn()} />
    );
    expect(screen.getByText("More (2)").closest("button")).toHaveClass(
      "bg-semantic-info-surface",
      "text-semantic-text-secondary"
    );
  });

  /* ── overflow item count ── */

  it("shows a tab's count in the overflow dropdown when provided", async () => {
    const user = userEvent.setup();
    const tabsWithCounts = manyPresetTabs.map((tab) =>
      tab.id === "preset-4" ? { ...tab, count: 4 } : tab
    );
    render(
      <CallLogsViewTabs tabs={tabsWithCounts} activeTabId="all" onTabChange={vi.fn()} />
    );
    await user.click(screen.getByText("More (2)"));
    expect(screen.getByRole("menuitem", { name: /Voicemail/ })).toHaveTextContent("4");
  });

  it("does not show a count in the overflow dropdown when omitted", async () => {
    const user = userEvent.setup();
    render(
      <CallLogsViewTabs tabs={manyPresetTabs} activeTabId="all" onTabChange={vi.fn()} />
    );
    await user.click(screen.getByText("More (2)"));
    expect(screen.getByRole("menuitem", { name: /Voicemail/ })).toHaveTextContent("Voicemail");
  });

  /* ── reorderable dropdown ── */

  const reorderTabs = [
    { id: "all", label: "All" },
    { id: "sys", label: "System", removable: true, isDefault: true },
    { id: "a", label: "Alpha", removable: true },
    { id: "b", label: "Beta", removable: true },
  ];

  async function openReorderable() {
    const user = userEvent.setup();
    const props = {
      onTabChange: vi.fn(),
      onRemoveTab: vi.fn(),
      onReorderTabs: vi.fn(),
      onAddNew: vi.fn(),
    };
    render(
      <CallLogsViewTabs
        tabs={reorderTabs}
        activeTabId="all"
        maxVisiblePresets={1}
        {...props}
      />
    );
    await user.click(screen.getByText("More (2)"));
    return { user, ...props };
  }

  const orderOf = (mock: ReturnType<typeof vi.fn>) =>
    mock.mock.calls[0][0].map((tab: { id: string }) => tab.id);

  it("lists movable views, locking defaults and allowing custom ones to be removed", async () => {
    await openReorderable();
    expect(screen.getByRole("menuitem", { name: /System/ })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /^All/ })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /cannot be removed/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove System view" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Alpha view" })).toBeInTheDocument();
    expect(screen.getByText(/The top/)).toHaveTextContent("The top 1 show as tabs.");
  });

  it("reorders by dragging the handle, without selecting a view", async () => {
    const { onReorderTabs, onTabChange } = await openReorderable();
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn() };
    const handle = screen.getByTestId("drag-handle-b");
    fireEvent.click(handle);
    fireEvent.dragStart(handle, { dataTransfer });
    fireEvent.drop(screen.getByRole("menuitem", { name: /System/ }), { dataTransfer });
    expect(orderOf(onReorderTabs)).toEqual(["all", "b", "sys", "a"]);
    expect(onTabChange).not.toHaveBeenCalled();
  });

  // jsdom rects are all zero, so a negative clientY is above the list.
  it.each([
    [-50, "b", ["all", "b", "sys", "a"]],
    [50, "a", ["all", "sys", "b", "a"]],
  ])("moves to the list end when dropped outside it (y=%s)", async (clientY, id, order) => {
    const { onReorderTabs } = await openReorderable();
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn() };
    fireEvent.dragStart(screen.getByTestId(`drag-handle-${id}`), { dataTransfer });
    for (const type of ["dragover", "drop"]) {
      fireEvent(
        document.body,
        new MouseEvent(type, { clientY, bubbles: true, cancelable: true })
      );
    }
    expect(orderOf(onReorderTabs)).toEqual(order);
  });

  it("shows a drop line on the side the dragged view will land", async () => {
    await openReorderable();
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn() };
    const handle = screen.getByTestId("drag-handle-a");
    const above = screen.getByRole("menuitem", { name: /System/ });
    const below = screen.getByRole("menuitem", { name: /Beta/ });
    fireEvent.dragStart(handle, { dataTransfer });
    fireEvent.dragOver(above, { dataTransfer });
    expect(above).toHaveClass("border-t-semantic-primary");
    fireEvent.dragOver(below, { dataTransfer });
    expect(below).toHaveClass("border-b-semantic-primary");
    expect(above).not.toHaveClass("border-t-semantic-primary");
    fireEvent.dragEnd(handle);
    expect(below).not.toHaveClass("border-b-semantic-primary");
  });

  it("makes only the handle draggable", async () => {
    await openReorderable();
    expect(screen.getByTestId("drag-handle-a")).toHaveAttribute("draggable", "true");
    expect(screen.getByRole("menuitem", { name: /Alpha/ })).not.toHaveAttribute("draggable");
  });

  it("reorders with Alt+ArrowDown", async () => {
    const { onReorderTabs } = await openReorderable();
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /Alpha/ }), {
      key: "ArrowDown",
      altKey: true,
    });
    expect(orderOf(onReorderTabs)).toEqual(["all", "sys", "b", "a"]);
  });

  it("calls onAddNew and closes the menu", async () => {
    const { user, onAddNew } = await openReorderable();
    await user.click(screen.getByRole("menuitem", { name: "Add new" }));
    expect(onAddNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu on Done", async () => {
    const { user } = await openReorderable();
    await user.click(screen.getByRole("menuitem", { name: "Done" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
