import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CallLogsLineSelect } from "../call-logs-line-select";
import type { MultiSelectOption } from "../../../../ui/multi-select";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const lineOptions: MultiSelectOption[] = [
  { value: "line1", label: "+1 (555) 010-0001", caption: "Sales" },
  { value: "line2", label: "+1 (555) 010-0002", caption: "Support" },
  { value: "line3", label: "+1 (555) 010-0003", caption: "Billing" },
];

describe("CallLogsLineSelect", () => {
  it("renders the combobox trigger", () => {
    render(<CallLogsLineSelect options={lineOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("defaults the placeholder to 'Select lines'", () => {
    render(<CallLogsLineSelect options={lineOptions} />);
    expect(screen.getByText("Select lines")).toBeInTheDocument();
  });

  it("defaults to detailed rows (checkbox + label + secondary text)", async () => {
    const user = userEvent.setup();
    render(<CallLogsLineSelect options={lineOptions} />);

    await user.click(screen.getByRole("combobox"));

    const row = screen.getByRole("option", { name: /\+1 \(555\) 010-0001/ });
    expect(row).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("defaults to a searchable dropdown", async () => {
    const user = userEvent.setup();
    render(<CallLogsLineSelect options={lineOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByPlaceholderText("Search lines...")).toBeInTheDocument();
  });

  it("pins an 'All lines' select-all row by default", async () => {
    const user = userEvent.setup();
    render(<CallLogsLineSelect options={lineOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: "All lines" })
    ).toBeInTheDocument();
  });

  it("selecting 'All lines' selects every option", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CallLogsLineSelect
        options={lineOptions}
        value={[]}
        onValueChange={handleValueChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "All lines" }));

    expect(handleValueChange).toHaveBeenCalledWith(["line1", "line2", "line3"]);
  });

  it("overrides the select-all label when provided", async () => {
    const user = userEvent.setup();
    render(<CallLogsLineSelect options={lineOptions} selectAllLabel="Every line" />);

    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: "Every line" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "All lines" })
    ).not.toBeInTheDocument();
  });

  it("defaults to a compact 'N lines selected' trigger summary", () => {
    render(
      <CallLogsLineSelect
        options={lineOptions}
        value={["line1", "line2"]}
      />
    );

    expect(screen.getByText("2 lines selected")).toBeInTheDocument();
    expect(screen.queryByText("+1 (555) 010-0001")).not.toBeInTheDocument();
  });

  it("uses singular phrasing for a single selected line", () => {
    render(<CallLogsLineSelect options={lineOptions} value={["line1"]} />);

    expect(screen.getByText("1 line selected")).toBeInTheDocument();
  });

  it("reveals the selected numbers in a tooltip on hover, one per line", async () => {
    const user = userEvent.setup();
    render(
      <CallLogsLineSelect
        options={lineOptions}
        value={["line1", "line2"]}
      />
    );

    await user.hover(screen.getByText("2 lines selected"));

    // Each selected number renders as its own element (own line), not a
    // single comma-joined string.
    const line1Matches = await screen.findAllByText("+1 (555) 010-0001");
    const line2Matches = await screen.findAllByText("+1 (555) 010-0002");
    expect(line1Matches.length).toBeGreaterThan(0);
    expect(line2Matches.length).toBeGreaterThan(0);
    expect(
      screen.queryByText("+1 (555) 010-0001, +1 (555) 010-0002")
    ).not.toBeInTheDocument();
  });

  it("overrides the trigger summary when summaryLabel is provided", () => {
    render(
      <CallLogsLineSelect
        options={lineOptions}
        value={["line1"]}
        summaryLabel={(count) => `${count} custom`}
      />
    );

    expect(screen.getByText("1 custom")).toBeInTheDocument();
  });

  it("overrides optionVariant when provided", async () => {
    const user = userEvent.setup();
    render(<CallLogsLineSelect options={lineOptions} optionVariant="simple" />);

    await user.click(screen.getByRole("combobox"));
    // Simple rows render a checkmark slot, not a checkbox, and drop the
    // secondary "caption" text.
    expect(screen.queryByText("Sales")).not.toBeInTheDocument();
  });

  it("overrides placeholder when provided", () => {
    render(<CallLogsLineSelect options={lineOptions} placeholder="Choose a line" />);
    expect(screen.getByText("Choose a line")).toBeInTheDocument();
  });

  it("merges a custom triggerClassName", () => {
    render(
      <CallLogsLineSelect options={lineOptions} triggerClassName="custom-trigger" />
    );
    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
  });

  it("forwards ref to the trigger button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<CallLogsLineSelect options={lineOptions} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("combobox"));
  });

  it("spreads additional props (e.g. disabled) through to MultiSelect", () => {
    render(<CallLogsLineSelect options={lineOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    const { container } = render(<CallLogsLineSelect options={lineOptions} />);
    assertNoBootstrapMarginBleed(container);
  });
});
