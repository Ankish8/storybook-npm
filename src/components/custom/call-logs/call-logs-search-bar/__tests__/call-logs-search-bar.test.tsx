import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsSearchBar } from "../call-logs-search-bar";
import type { CallLogsSearchBarProps, CallLogsSearchBarSuggestion } from "../types";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const suggestions: CallLogsSearchBarSuggestion[] = [
  { value: "1", label: "+91 98765 43210" },
  { value: "2", label: "+91 98324 43210" },
];

function ControlledSearchBar(props: Partial<CallLogsSearchBarProps> = {}) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <CallLogsSearchBar
      suggestions={suggestions}
      onValueChange={setValue}
      {...props}
      value={props.value ?? value}
      onSelect={(s) => {
        setValue(s.label);
        props.onSelect?.(s);
      }}
    />
  );
}

describe("CallLogsSearchBar", () => {
  it("renders the placeholder when empty", () => {
    render(<CallLogsSearchBar value="" onValueChange={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Search caller, number, agents, departments...")
    ).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<CallLogsSearchBar value="" onValueChange={vi.fn()} placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders the current value", () => {
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("98");
  });

  it("calls onValueChange when typing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CallLogsSearchBar value="" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "9");
    expect(onValueChange).toHaveBeenCalledWith("9");
  });

  it("does not render a clear button when the value is empty", () => {
    render(<CallLogsSearchBar value="" onValueChange={vi.fn()} />);
    expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
  });

  it("renders a clear button once there is a value and calls onClear when clicked", () => {
    const onClear = vi.fn();
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} onClear={onClear} />);
    fireEvent.click(screen.getByLabelText("Clear input"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  /* ── suggestions dropdown ── */

  it("does not open the dropdown when the value is empty, even if focused", async () => {
    const user = userEvent.setup();
    render(<CallLogsSearchBar value="" onValueChange={vi.fn()} suggestions={suggestions} />);
    await user.click(screen.getByRole("textbox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the dropdown when focused with a non-empty value and matching suggestions", async () => {
    const user = userEvent.setup();
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={suggestions} />);
    await user.click(screen.getByRole("textbox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("does not open the dropdown when there are no suggestions", async () => {
    const user = userEvent.setup();
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={[]} />);
    await user.click(screen.getByRole("textbox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("bolds the substring of each suggestion that matches the typed query", async () => {
    const user = userEvent.setup();
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={suggestions} />);
    await user.click(screen.getByRole("textbox"));
    const option = screen.getAllByRole("option")[0];
    const bold = option.querySelector("span.font-semibold");
    expect(bold).toHaveTextContent("98");
  });

  it("calls onSelect with the clicked suggestion and closes the dropdown", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ControlledSearchBar value="98" onSelect={onSelect} />);
    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getAllByRole("option")[0]);
    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the dropdown on Escape", async () => {
    const user = userEvent.setup();
    render(<CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={suggestions} />);
    await user.click(screen.getByRole("textbox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the dropdown on blur", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={suggestions} />
        <button type="button">elsewhere</button>
      </div>
    );
    await user.click(screen.getByRole("textbox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the wrapper element", () => {
    // TextField silently drops its `className` prop whenever left/right icons or
    // `clearable` are active (see text-field.tsx), so this component applies
    // `className` to its own wrapper div instead of forwarding it into TextField.
    const { container } = render(
      <CallLogsSearchBar value="" onValueChange={vi.fn()} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("forwards ref to the input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<CallLogsSearchBar ref={ref} value="" onValueChange={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes additional input attributes through", () => {
    render(
      <CallLogsSearchBar
        value=""
        onValueChange={vi.fn()}
        data-testid="call-logs-search-bar"
      />
    );
    expect(screen.getByTestId("call-logs-search-bar")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CallLogsSearchBar value="98" onValueChange={vi.fn()} suggestions={suggestions} />
    );
    await user.click(screen.getByRole("textbox"));
    assertNoBootstrapMarginBleed(container);
  });
});
