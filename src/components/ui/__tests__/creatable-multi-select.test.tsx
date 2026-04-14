import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatableMultiSelect } from "../creatable-multi-select";

const OPTIONS = [
  { value: "Alpha", label: "Alpha" },
  { value: "Beta", label: "Beta" },
];

describe("CreatableMultiSelect", () => {
  it("renders with placeholder when no values", () => {
    render(<CreatableMultiSelect options={OPTIONS} placeholder="Pick items" />);
    expect(screen.getByPlaceholderText("Pick items")).toBeInTheDocument();
  });

  it("renders selected values as chips", () => {
    render(
      <CreatableMultiSelect options={OPTIONS} value={["Alpha", "Beta"]} />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls onValueChange when removing a chip", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        value={["Alpha", "Beta"]}
        onValueChange={onChange}
      />
    );
    // Click the × button on the first chip
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith(["Beta"]);
  });

  it("renders without options (empty list)", () => {
    render(<CreatableMultiSelect placeholder="Pick items" />);
    expect(screen.getByPlaceholderText("Pick items")).toBeInTheDocument();
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
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "angry");
    expect(
      screen.getByText("Type to create a custom tone")
    ).toBeInTheDocument();
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    const enterBtn = screen.getByRole("button", { name: /add using enter key/i });
    expect(enterBtn).toBeInTheDocument();
    await user.click(enterBtn);
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
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "a@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "b");
    expect(onValid).toHaveBeenCalled();
  });
});
