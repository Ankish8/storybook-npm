import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField, type SelectOption } from "../select-field";

const defaultOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const groupedOptions: SelectOption[] = [
  { value: "a1", label: "A1", group: "Group A" },
  { value: "a2", label: "A2", group: "Group A" },
  { value: "b1", label: "B1", group: "Group B" },
];

describe("SelectField", () => {
  // Basic rendering
  it("renders correctly", () => {
    render(<SelectField options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(
      <SelectField options={defaultOptions} placeholder="Select an option" />
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  // Label tests
  it("renders label when provided", () => {
    render(<SelectField label="Test Label" options={defaultOptions} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders required indicator when required", () => {
    render(
      <SelectField label="Test Label" options={defaultOptions} required />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-semantic-error-primary");
  });

  it("does not render required indicator when not required", () => {
    render(<SelectField label="Test Label" options={defaultOptions} />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("associates label with select via htmlFor", () => {
    render(
      <SelectField
        label="Test Label"
        options={defaultOptions}
        id="test-select"
      />
    );
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-select");
  });

  // Helper text tests
  it("renders helper text when provided", () => {
    render(
      <SelectField options={defaultOptions} helperText="Helper text here" />
    );
    expect(screen.getByText("Helper text here")).toBeInTheDocument();
    expect(screen.getByText("Helper text here")).toHaveClass(
      "text-semantic-text-muted"
    );
  });

  // Error message tests
  it("shows error message when error prop is set", () => {
    render(
      <SelectField options={defaultOptions} error="This field is required" />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toHaveClass(
      "text-semantic-error-primary"
    );
  });

  it("error message takes precedence over helper text", () => {
    render(
      <SelectField options={defaultOptions} helperText="Helper" error="Error" />
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("applies error state styling when error is set", () => {
    render(<SelectField options={defaultOptions} error="Error" />);
    expect(screen.getByRole("combobox")).toHaveClass(
      "border-semantic-error-primary/40"
    );
  });

  it("sets aria-invalid when error is present", () => {
    render(<SelectField options={defaultOptions} error="Error" />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  // Disabled state tests
  it("is disabled when disabled prop is set", () => {
    render(<SelectField options={defaultOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  // Loading state tests
  it("is disabled when loading", () => {
    render(<SelectField options={defaultOptions} loading />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    const { container } = render(
      <SelectField options={defaultOptions} loading />
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  // Options rendering
  it("renders options when opened", async () => {
    const user = userEvent.setup();
    render(<SelectField options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  // Grouped options
  it("renders grouped options with labels", async () => {
    const user = userEvent.setup();
    render(<SelectField options={groupedOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
  });

  // Selection
  it("selects option on click", async () => {
    const user = userEvent.setup();
    render(<SelectField options={defaultOptions} placeholder="Select" />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 2"));

    expect(screen.getByRole("combobox")).toHaveTextContent("Option 2");
  });

  // Controlled mode
  it("works in controlled mode", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectField
        options={defaultOptions}
        value="option1"
        onValueChange={handleValueChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 2"));

    expect(handleValueChange).toHaveBeenCalledWith("option2");
  });

  // onSelect callback
  it("calls onSelect with full option object when selection changes", async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectField options={defaultOptions} onSelect={handleSelect} />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 2"));

    expect(handleSelect).toHaveBeenCalledWith({
      value: "option2",
      label: "Option 2",
    });
  });

  it("calls both onValueChange and onSelect when selection changes", async () => {
    const handleValueChange = vi.fn();
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectField
        options={defaultOptions}
        onValueChange={handleValueChange}
        onSelect={handleSelect}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 3"));

    expect(handleValueChange).toHaveBeenCalledWith("option3");
    expect(handleSelect).toHaveBeenCalledWith({
      value: "option3",
      label: "Option 3",
    });
  });

  // Uncontrolled mode
  it("works in uncontrolled mode with defaultValue", () => {
    render(<SelectField options={defaultOptions} defaultValue="option2" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Option 2");
  });

  // Searchable
  it("shows search input when searchable", async () => {
    const user = userEvent.setup();
    render(<SelectField options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("filters options when searching", async () => {
    const user = userEvent.setup();
    render(<SelectField options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Search..."), "Option 1");

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<SelectField options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Search..."), "xyz");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("uses custom search placeholder", async () => {
    const user = userEvent.setup();
    render(
      <SelectField
        options={defaultOptions}
        searchable
        searchPlaceholder="Type to search..."
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByPlaceholderText("Type to search...")
    ).toBeInTheDocument();
  });

  // Disabled items
  it("renders disabled options", async () => {
    const optionsWithDisabled: SelectOption[] = [
      { value: "enabled", label: "Enabled" },
      { value: "disabled", label: "Disabled", disabled: true },
    ];
    const user = userEvent.setup();

    render(<SelectField options={optionsWithDisabled} />);

    await user.click(screen.getByRole("combobox"));
    const disabledItem = screen.getByText("Disabled");
    expect(disabledItem.closest("[data-disabled]")).toBeInTheDocument();
  });

  // Custom classNames
  it("applies custom wrapperClassName", () => {
    const { container } = render(
      <SelectField options={defaultOptions} wrapperClassName="custom-wrapper" />
    );
    expect(container.firstChild).toHaveClass("custom-wrapper");
  });

  it("applies custom triggerClassName", () => {
    render(
      <SelectField options={defaultOptions} triggerClassName="custom-trigger" />
    );
    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
  });

  it("applies custom labelClassName", () => {
    render(
      <SelectField
        label="Test"
        options={defaultOptions}
        labelClassName="custom-label"
      />
    );
    expect(screen.getByText("Test")).toHaveClass("custom-label");
  });

  // Accessibility
  it("sets aria-describedby for helper text", () => {
    render(
      <SelectField options={defaultOptions} helperText="Helper" id="test" />
    );
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "test-helper"
    );
  });

  it("sets aria-describedby for error message", () => {
    render(<SelectField options={defaultOptions} error="Error" id="test" />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "test-error"
    );
  });
});
