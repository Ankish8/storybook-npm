import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsActiveFiltersBar } from "../call-logs-active-filters-bar";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const chips = [
  { id: "duration", label: "Duration:", value: "Last 1 hour" },
  { id: "agent-rohit", value: "Rohit Sharma" },
];

describe("CallLogsActiveFiltersBar", () => {
  /* ── chips ── */

  it("renders a chip for each entry, including the bold label prefix", () => {
    render(<CallLogsActiveFiltersBar chips={chips} onRemoveChip={vi.fn()} />);
    expect(screen.getByText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("Last 1 hour")).toBeInTheDocument();
    expect(screen.getByText("Rohit Sharma")).toBeInTheDocument();
  });

  it("renders a chip's icon alongside its value", () => {
    render(
      <CallLogsActiveFiltersBar
        chips={[{ id: "ai-agent", value: "Eva", icon: <span data-testid="bot-icon" /> }]}
        onRemoveChip={vi.fn()}
      />
    );
    expect(screen.getByTestId("bot-icon")).toBeInTheDocument();
    expect(screen.getByText("Eva")).toBeInTheDocument();
  });

  it("does not render a tooltip trigger for a chip without tooltipItems", () => {
    render(<CallLogsActiveFiltersBar chips={chips} onRemoveChip={vi.fn()} />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows a tooltip listing every item when hovering a summarized chip", async () => {
    const user = userEvent.setup();
    render(
      <CallLogsActiveFiltersBar
        chips={[
          {
            id: "agents",
            label: "Agent:",
            value: "Akhil, Nivedithatha +2 more",
            tooltipItems: ["Akhil Yadav", "Nivedithatha N.", "Sumati Dixit", "Komal Rawat"],
          },
        ]}
        onRemoveChip={vi.fn()}
      />
    );

    await user.hover(screen.getByText("Akhil, Nivedithatha +2 more"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Akhil Yadav");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Nivedithatha N.");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Sumati Dixit");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Komal Rawat");
  });

  it("renders no chips without errors when chips is empty", () => {
    render(<CallLogsActiveFiltersBar chips={[]} onRemoveChip={vi.fn()} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("calls onRemoveChip with the chip's id when its × is clicked", () => {
    const onRemoveChip = vi.fn();
    render(<CallLogsActiveFiltersBar chips={chips} onRemoveChip={onRemoveChip} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Duration: Last 1 hour" })
    );

    expect(onRemoveChip).toHaveBeenCalledWith("duration");
    expect(onRemoveChip).toHaveBeenCalledTimes(1);
  });

  /* ── actions ── */

  it("renders no action buttons when onSaveAsPreset and onClearAll are omitted", () => {
    render(<CallLogsActiveFiltersBar chips={[]} onRemoveChip={vi.fn()} />);
    expect(screen.queryByText("Save as Preset")).not.toBeInTheDocument();
    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });

  it("calls onSaveAsPreset when Save as Preset is clicked", () => {
    const onSaveAsPreset = vi.fn();
    render(
      <CallLogsActiveFiltersBar
        chips={chips}
        onRemoveChip={vi.fn()}
        onSaveAsPreset={onSaveAsPreset}
      />
    );
    fireEvent.click(screen.getByText("Save as Preset"));
    expect(onSaveAsPreset).toHaveBeenCalledTimes(1);
  });

  it("calls onClearAll when Clear All is clicked", () => {
    const onClearAll = vi.fn();
    render(
      <CallLogsActiveFiltersBar
        chips={chips}
        onRemoveChip={vi.fn()}
        onClearAll={onClearAll}
      />
    );
    fireEvent.click(screen.getByText("Clear All"));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("applies destructive styling to Clear All", () => {
    render(
      <CallLogsActiveFiltersBar
        chips={chips}
        onRemoveChip={vi.fn()}
        onClearAll={vi.fn()}
      />
    );
    expect(screen.getByText("Clear All")).toHaveClass(
      "text-semantic-error-primary"
    );
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <CallLogsActiveFiltersBar
        chips={chips}
        onRemoveChip={vi.fn()}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CallLogsActiveFiltersBar chips={chips} onRemoveChip={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(
      <CallLogsActiveFiltersBar
        chips={chips}
        onRemoveChip={vi.fn()}
        data-testid="active-filters-bar"
      />
    );
    expect(screen.getByTestId("active-filters-bar")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    const { container } = render(
      <CallLogsActiveFiltersBar chips={chips} onRemoveChip={vi.fn()} />
    );
    assertNoBootstrapMarginBleed(container);
  });
});
