import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatableSelect } from "../creatable-select";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("CreatableSelect", () => {
  it("renders with placeholder text in closed state", () => {
    render(<CreatableSelect options={OPTIONS} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("shows selected value label in closed state", () => {
    render(<CreatableSelect options={OPTIONS} value="a" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("opens dropdown on click and shows options", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} placeholder="Pick one" />);
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls onValueChange when an option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    await user.click(screen.getByText("Alpha"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders without options (empty list)", () => {
    render(<CreatableSelect placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CreatableSelect options={OPTIONS} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("is disabled when disabled prop is set", () => {
    render(
      <CreatableSelect options={OPTIONS} disabled placeholder="Pick one" />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<CreatableSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sanitizes combobox input and notifies invalid vs valid input", async () => {
    const user = userEvent.setup();
    const onInvalid = vi.fn();
    const onValid = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        sanitizeInput={sanitize}
        onInvalidCharacters={onInvalid}
        onValidInput={onValid}
        maxLength={20}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    const input = screen.getByRole("combobox");
    await user.type(input, "x@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "y");
    expect(onValid).toHaveBeenCalled();
  });

  it("applies normalizeComboboxInput after sanitize without affecting invalid detection", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const normalize = (s: string) => s.replace(/ +/g, " ").replace(/^\s+/, "");
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        sanitizeInput={sanitize}
        normalizeComboboxInput={normalize}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(input, "a  b");
    expect(input.value).toBe("a b");
  });
});
