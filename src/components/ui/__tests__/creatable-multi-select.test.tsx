import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatableMultiSelect } from "../creatable-multi-select";

const OPTIONS = [
  { value: "Alpha", label: "Alpha" },
  { value: "Beta", label: "Beta" },
];

describe("CreatableMultiSelect", () => {
  it("renders with placeholder when no values", () => {
    render(<CreatableMultiSelect options={OPTIONS} placeholder="Pick items" />);
    expect(screen.getByText("Pick items")).toBeInTheDocument();
  });

  it("renders selected values as comma-separated summary when closed", () => {
    render(
      <CreatableMultiSelect options={OPTIONS} value={["Alpha", "Beta"]} />
    );
    expect(screen.getByText("Alpha, Beta")).toBeInTheDocument();
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
    await user.click(screen.getByRole("button"));
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
      <CreatableMultiSelect options={OPTIONS} helperText="Select at least one" />
    );
    expect(screen.getByText("Select at least one")).toBeInTheDocument();
  });

  it("shows dropdown hint, max selections, and Enter affordance when typing a custom value", async () => {
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
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "angry");
    expect(
      screen.getByText("Type to create a custom tone")
    ).toBeInTheDocument();
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    expect(screen.getByText("Enter ↵")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(["angry"]);
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
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "a@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "b");
    expect(onValid).toHaveBeenCalled();
  });
});
