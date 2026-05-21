import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CreatableMultiSelect,
  type CreatableMultiSelectOption,
} from "../creatable-multi-select";

function ControlledCreatableMultiSelect({
  initialValue = [] as string[],
  onValueChange,
  ...props
}: React.ComponentProps<typeof CreatableMultiSelect> & {
  initialValue?: string[];
}) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <CreatableMultiSelect
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

const OPTIONS = [
  { value: "Alpha", label: "Alpha" },
  { value: "Beta", label: "Beta" },
];

describe("CreatableMultiSelect", () => {
  it("renders with placeholder when no values", () => {
    render(<CreatableMultiSelect options={OPTIONS} placeholder="Pick items" />);
    expect(screen.getByText("Pick items")).toBeInTheDocument();
  });

  it("renders selected values as removable chips when closed", () => {
    render(
      <CreatableMultiSelect options={OPTIONS} value={["Alpha", "Beta"]} />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Alpha" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Beta" })
    ).toBeInTheDocument();
  });

  it("calls onValueChange when removing last item with Backspace on empty input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        value={["Alpha", "Beta"]}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenCalledWith(["Alpha"]);
  });

  it("renders without options (empty list)", () => {
    render(<CreatableMultiSelect placeholder="Pick items" />);
    expect(screen.getByText("Pick items")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CreatableMultiSelect options={OPTIONS} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<CreatableMultiSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders helper text when provided", () => {
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        helperText="Select at least one"
      />
    );
    expect(screen.getByText("Select at least one")).toBeInTheDocument();
  });

  it("shows max-selections when presets match and the Create row plus Enter affordance when typing a non-matching value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        placeholder="Pick items"
        createHintText="Type to create a custom tone"
        maxItems={5}
        maxLengthPerItem={20}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    await user.type(input, "angry");
    expect(
      screen.getByText("Type to create a custom tone")
    ).toBeInTheDocument();
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    expect(screen.getByText("Enter ↵")).toBeInTheDocument();
    expect(screen.getByText("Create “angry”")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(["angry"]);
  });

  it("keeps long preset option values when maxLength and sanitizeInput are set and hides them from the dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      { value: "Friendly", label: "Friendly" },
      {
        value: "Soft-spoken and comforting",
        label: "Soft-spoken and comforting",
      },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        maxLengthPerItem={20}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: /Soft-spoken/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /Soft-spoken/i }));
    expect(onChange).toHaveBeenCalledWith(["Soft-spoken and comforting"]);
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: /Soft-spoken/i })
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("Soft-spoken and comforting")).toBeInTheDocument();
  });

  it("hides presets when a legacy truncated value is already selected", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      {
        value: "Soft-spoken and comforting",
        label: "Soft-spoken and comforting",
      },
    ];
    render(
      <CreatableMultiSelect
        options={options}
        value={["Soft-spoken and comf"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        maxLengthPerItem={20}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.queryByRole("option", { name: /Soft-spoken/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Soft-spoken and comforting")).toBeInTheDocument();
  });

  it("hides presets when a legacy sanitized value is already selected", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options = [
      { value: "Friendly", label: "Friendly" },
      { value: "Soft-spoken", label: "Soft-spoken" },
    ];
    render(
      <CreatableMultiSelect
        options={options}
        value={["Softspoken"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.queryByRole("option", { name: /Soft-spoken/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Soft-spoken")).toBeInTheDocument();
  });

  it("shows preset again after removing a sanitized legacy selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      { value: "Soft-spoken", label: "Soft-spoken" },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        initialValue={["Softspoken"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        onValueChange={onChange}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Remove Soft-spoken" })
    );
    expect(onChange).toHaveBeenCalledWith([]);
    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Soft-spoken/i })
      ).toBeInTheDocument();
    });
  });

  it("keeps dropdown open while selecting and closes when maxItems is reached", async () => {
    const user = userEvent.setup();
    const options: CreatableMultiSelectOption[] = [
      { value: "Alpha", label: "Alpha" },
      { value: "Beta", label: "Beta" },
      { value: "Gamma", label: "Gamma" },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        maxItems={2}
        placeholder="Pick items"
      />
    );
    await user.click(screen.getByRole("combobox", { expanded: false }));
    expect(screen.getByRole("combobox", { expanded: true })).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: /Alpha/i }));
    await waitFor(() => {
      expect(screen.getByRole("combobox", { expanded: true })).toBeInTheDocument();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: /Alpha/i })
      ).not.toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Beta/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("option", { name: /Beta/i }));
    await waitFor(() => {
      expect(screen.getByRole("combobox", { expanded: false })).toBeInTheDocument();
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("keeps dropdown panel visible when all presets are selected but below maxItems", async () => {
    const user = userEvent.setup();
    render(
      <ControlledCreatableMultiSelect
        options={OPTIONS}
        maxItems={5}
        createHintText="Type to create a custom tone"
        placeholder="Pick items"
      />
    );
    await user.click(screen.getByRole("combobox", { expanded: false }));
    await user.click(screen.getByRole("option", { name: /Alpha/i }));
    await user.click(screen.getByRole("option", { name: /Beta/i }));

    await waitFor(() => {
      expect(screen.getByRole("combobox", { expanded: true })).toBeInTheDocument();
      expect(
        screen.getByText("Type to create a custom tone")
      ).toBeInTheDocument();
      expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    });
  });

  it("sanitizes typed input and notifies invalid vs valid input", async () => {
    const user = userEvent.setup();
    const onInvalid = vi.fn();
    const onValid = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        placeholder="Pick items"
        sanitizeInput={sanitize}
        onInvalidCharacters={onInvalid}
        onValidInput={onValid}
        maxLengthPerItem={20}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    await user.type(input, "a@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "b");
    expect(onValid).toHaveBeenCalled();
  });
});
