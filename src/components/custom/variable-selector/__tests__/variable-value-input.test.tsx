import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariableValueInput } from "../variable-value-input";

const defaultSections = [
  { label: "Function variables", variables: [{ id: "1", name: "Order_id" }] },
];

describe("VariableValueInput", () => {
  it("renders placeholder when value is empty", () => {
    render(
      <VariableValueInput
        value=""
        onChange={() => {}}
        placeholder="Type {{ to add"
        variableSections={defaultSections}
      />
    );
    expect(screen.getByPlaceholderText("Type {{ to add")).toBeInTheDocument();
  });

  it("renders text value", () => {
    render(
      <VariableValueInput value="hello" onChange={() => {}} variableSections={defaultSections} />
    );
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders variable as chip", () => {
    render(
      <VariableValueInput
        value="{{Order_id}}"
        onChange={() => {}}
        variableSections={defaultSections}
      />
    );
    expect(screen.getByText("{{Order_id}}")).toBeInTheDocument();
  });

  it("calls onChange when value would change via selector (integration)", () => {
    const onChange = vi.fn();
    render(
      <VariableValueInput
        value=""
        onChange={onChange}
        variableSections={defaultSections}
      />
    );
    const input = screen.getByRole("textbox", { name: /type \{\{/i });
    fireEvent.change(input, { target: { value: "{{" } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: /Order_id/ }));
    expect(onChange).toHaveBeenCalledWith("{{Order_id}}");
  });

  it("opens listbox when typing {{ as two separate keystrokes (controlled)", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <VariableValueInput
        value=""
        onChange={onChange}
        variableSections={defaultSections}
      />
    );
    const input = screen.getByRole("textbox", { name: /type \{\{/i });
    fireEvent.change(input, { target: { value: "{" } });
    expect(onChange).toHaveBeenLastCalledWith("{");
    rerender(
      <VariableValueInput
        value="{"
        onChange={onChange}
        variableSections={defaultSections}
      />
    );
    fireEvent.change(input, { target: { value: "{" } });
    expect(onChange).toHaveBeenLastCalledWith("{{");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("calls onAddNewVariable and closes listbox when Add new variable is clicked", () => {
    const onAddNewVariable = vi.fn();
    render(
      <VariableValueInput
        value=""
        onChange={() => {}}
        variableSections={defaultSections}
        onAddNewVariable={onAddNewVariable}
      />
    );
    const input = screen.getByRole("textbox", { name: /type \{\{/i });
    fireEvent.change(input, { target: { value: "{{" } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add new variable/i }));
    expect(onAddNewVariable).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("{{");
  });

  it("shows overflow button when variables exceed maxVisibleChips", () => {
    render(
      <VariableValueInput
        value="{{a}} {{b}} {{c}} {{d}}"
        onChange={() => {}}
        variableSections={defaultSections}
        maxVisibleChips={2}
      />
    );
    expect(
      screen.getByRole("button", {
        name: /2 more variables — show all/i,
      })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <VariableValueInput
        value=""
        onChange={() => {}}
        variableSections={defaultSections}
        className="custom-input"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("custom-input");
  });

  it("on backspace with empty pending tail removes one character from value", () => {
    const onChange = vi.fn();
    render(
      <VariableValueInput
        value="hello"
        onChange={onChange}
        variableSections={defaultSections}
      />
    );
    const input = screen.getByRole("textbox", { name: /type \{\{/i });
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("hell");
  });

  it("on backspace with empty pending removes whole trailing variable token", () => {
    const onChange = vi.fn();
    render(
      <VariableValueInput
        value="text {{Order_id}}"
        onChange={onChange}
        variableSections={defaultSections}
      />
    );
    const input = screen.getByRole("textbox", { name: /type \{\{/i });
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("text ");
  });
});
