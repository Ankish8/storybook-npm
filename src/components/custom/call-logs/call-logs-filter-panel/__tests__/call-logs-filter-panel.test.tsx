import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsFilterPanel } from "../call-logs-filter-panel";
import { CALL_STATUS_OPTIONS, CALL_DIRECTION_OPTIONS, DURATION_OPTIONS } from "../types";
import type { CallLogsFilterPanelProps, CallLogsFilterValue } from "../types";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const baseValue: CallLogsFilterValue = {
  callStatus: [],
  callDirection: [],
  source: "all",
  duration: "all",
  line: [],
  campaign: [],
  aiHandling: [],
  transferStatus: [],
  callMarkers: { notes: false, starred: false },
  agents: [],
  departments: [],
  aiAgent: [],
  transferredTo: [],
};

const lineOptions = [
  { value: "all", label: "All Numbers" },
  { value: "8000", label: "8000 (Support)" },
];

const campaignOptions = [
  { value: "q3-enterprise", label: "Q3 Enterprise" },
];

const aiAgentOptions = [
  { value: "all", label: "All AI Agents" },
  { value: "aria", label: "Aria" },
  { value: "leo", label: "Leo" },
];

const transferredToOptions = [
  { value: "anyone", label: "Anyone" },
  { value: "sales-team", label: "Sales team" },
];

const agentOptions = [
  { value: "rohit", label: "Rohit Sharma" },
  { value: "priya", label: "Priya Verma" },
];

const departmentOptions = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
];

function renderPanel(overrides: Partial<CallLogsFilterPanelProps> = {}) {
  const onValueChange = vi.fn();
  const utils = render(
    <CallLogsFilterPanel
      resultCount={20}
      value={baseValue}
      onValueChange={onValueChange}
      lineOptions={lineOptions}
      campaignOptions={campaignOptions}
      aiAgentOptions={aiAgentOptions}
      transferredToOptions={transferredToOptions}
      agentOptions={agentOptions}
      departmentOptions={departmentOptions}
      {...overrides}
    />
  );
  return { ...utils, onValueChange };
}

describe("CallLogsFilterPanel", () => {
  /* ── header ── */

  it("renders the result count in the header", () => {
    renderPanel({ resultCount: 20 });
    expect(screen.getByText("20 calls")).toBeInTheDocument();
  });

  it("groups the result count next to the Filters title, separate from the close button", () => {
    renderPanel({ resultCount: 20 });
    const titleGroup = screen.getByText("20 calls").parentElement;
    expect(titleGroup).toHaveTextContent("Filters");
    expect(titleGroup?.querySelector("button")).not.toBeInTheDocument();
  });

  it("renders the Filters title", () => {
    renderPanel();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  /* ── Duration pill group ── */

  it("renders every Duration pill option", () => {
    renderPanel();
    DURATION_OPTIONS.forEach((option) => {
      expect(
        screen.getByRole("button", { name: option.label })
      ).toBeInTheDocument();
    });
  });

  it("calls onValueChange with the updated duration when a non-selected pill is clicked", () => {
    const { onValueChange } = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Custom" }));
    expect(onValueChange).toHaveBeenCalledWith({
      ...baseValue,
      duration: "custom",
    });
  });

  it("marks the currently-selected pill with the selected-state class", () => {
    renderPanel();
    // baseValue.duration is "all" -> the "All duration" pill is selected.
    expect(screen.getByRole("button", { name: "All duration" })).toHaveClass(
      "border-semantic-border-accent"
    );
    // A non-selected pill in the same group must not have that class.
    expect(screen.getByRole("button", { name: "Custom" })).not.toHaveClass(
      "border-semantic-border-accent"
    );
  });

  /* ── Call Status (MultiSelect) ── */

  it("calls onValueChange with the updated callStatus when a Call Status option is selected", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderPanel();

    await user.click(screen.getByRole("combobox", { name: "Call Status" }));
    await user.click(screen.getByRole("option", { name: "Connected" }));

    expect(onValueChange).toHaveBeenCalledWith({
      ...baseValue,
      callStatus: ["connected"],
    });
  });

  it("renders every Call Status option, including All calls and Voicemail", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("combobox", { name: "Call Status" }));
    CALL_STATUS_OPTIONS.forEach((option) => {
      expect(screen.getByRole("option", { name: option.label })).toBeInTheDocument();
    });
  });

  it("renders every Call Direction option, including All", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("combobox", { name: "Call Direction" }));
    CALL_DIRECTION_OPTIONS.forEach((option) => {
      expect(screen.getByRole("option", { name: option.label })).toBeInTheDocument();
    });
  });

  /* ── call markers ── */

  it("toggles a call marker checkbox, leaving all other fields unchanged", () => {
    const { onValueChange } = renderPanel();
    fireEvent.click(screen.getByRole("checkbox", { name: "Notes" }));
    expect(onValueChange).toHaveBeenCalledWith({
      ...baseValue,
      callMarkers: { ...baseValue.callMarkers, notes: true },
    });
  });

  it("does not render a Voicemail call marker", () => {
    renderPanel();
    expect(screen.queryByRole("checkbox", { name: "Voicemail" })).not.toBeInTheDocument();
  });

  /* ── MultiSelect (Phone Number dialled) ── */

  it("calls onValueChange with the updated line when a Phone Number option is selected", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderPanel();

    await user.click(screen.getByRole("combobox", { name: "Phone Number (dialled)" }));
    await user.click(screen.getByRole("option", { name: "8000 (Support)" }));

    expect(onValueChange).toHaveBeenCalledWith({ ...baseValue, line: ["8000"] });
  });

  it("renders every Phone Number option, including All Numbers", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("combobox", { name: "Phone Number (dialled)" }));
    lineOptions.forEach((option) => {
      expect(screen.getByRole("option", { name: option.label })).toBeInTheDocument();
    });
  });

  /* ── MultiSelect (AI Agent / Transferred to) ── */

  it("calls onValueChange with the updated aiAgent when an AI Agent option is selected", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderPanel();

    await user.click(screen.getByRole("combobox", { name: "AI Agent" }));
    await user.click(screen.getByRole("option", { name: "Aria" }));

    expect(onValueChange).toHaveBeenCalledWith({ ...baseValue, aiAgent: ["aria"] });
  });

  it("calls onValueChange with the updated transferredTo when a Transferred to option is selected", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderPanel();

    await user.click(screen.getByRole("combobox", { name: "Transferred to" }));
    await user.click(screen.getByRole("option", { name: "Sales team" }));

    expect(onValueChange).toHaveBeenCalledWith({ ...baseValue, transferredTo: ["sales-team"] });
  });

  /* ── footer actions ── */

  it("calls onReset when Reset is clicked", () => {
    const onReset = vi.fn();
    renderPanel({ onReset });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("calls onSaveAsPreset when Save as New Preset is clicked", () => {
    const onSaveAsPreset = vi.fn();
    renderPanel({ onSaveAsPreset });
    fireEvent.click(screen.getByRole("button", { name: "Save as New Preset" }));
    expect(onSaveAsPreset).toHaveBeenCalledTimes(1);
  });

  it("calls onApply when Apply Filter is clicked", () => {
    const onApply = vi.fn();
    renderPanel({ onApply });
    fireEvent.click(screen.getByRole("button", { name: "Apply Filter" }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the header close button is clicked", () => {
    const onClose = vi.fn();
    renderPanel({ onClose });
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = renderPanel({ className: "custom-class" });
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <CallLogsFilterPanel
        ref={ref}
        resultCount={20}
        value={baseValue}
        onValueChange={vi.fn()}
        lineOptions={lineOptions}
        campaignOptions={campaignOptions}
        aiAgentOptions={aiAgentOptions}
        transferredToOptions={transferredToOptions}
        agentOptions={agentOptions}
        departmentOptions={departmentOptions}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    renderPanel({ "data-testid": "filter-panel" } as Partial<CallLogsFilterPanelProps>);
    expect(screen.getByTestId("filter-panel")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // CallLogsFilterPanel currently renders no <p> tags (spans only), so this
    // is trivially satisfied — kept as a regression guard for future changes.
    const { container } = renderPanel();
    assertNoBootstrapMarginBleed(container);
  });
});
