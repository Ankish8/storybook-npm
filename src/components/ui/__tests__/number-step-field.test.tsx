import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberStepField } from "../number-step-field";

describe("NumberStepField", () => {
  it("renders suffix and value", () => {
    render(
      <NumberStepField
        value={3}
        onValueChange={() => {}}
        suffix="hour"
        aria-label="Hours"
      />
    );
    expect(screen.getByText("hour")).toBeInTheDocument();
    expect(screen.getByLabelText("Hours")).toHaveValue(3);
  });

  it("calls onValueChange when value changes", () => {
    const onValueChange = vi.fn();
    render(
      <NumberStepField
        value={1}
        onValueChange={onValueChange}
        suffix="hour"
        min={0}
        max={23}
        aria-label="Hours"
      />
    );
    const input = screen.getByLabelText("Hours");
    fireEvent.change(input, { target: { value: "5" } });
    expect(onValueChange).toHaveBeenCalledWith(5);
  });

  it("calls onBlur when the number input loses focus", () => {
    const onBlur = vi.fn();
    render(
      <NumberStepField
        value={1}
        onValueChange={() => {}}
        onBlur={onBlur}
        suffix="hour"
        aria-label="Hours"
      />
    );
    fireEvent.blur(screen.getByLabelText("Hours"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("increment button increases value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberStepField
        value={2}
        onValueChange={onValueChange}
        suffix="hour"
        min={0}
        max={23}
        aria-label="Hours"
        incrementAriaLabel="Step up hours"
      />
    );
    await user.click(screen.getByRole("button", { name: /step up hours/i }));
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("focuses the number input when a stepper is used so blur can fire when leaving the field", async () => {
    const user = userEvent.setup();
    render(
      <NumberStepField
        value={2}
        onValueChange={() => {}}
        suffix="hour"
        min={0}
        max={23}
        aria-label="Hours"
        incrementAriaLabel="Step up hours"
      />
    );
    const input = screen.getByLabelText("Hours");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByRole("button", { name: /step up hours/i }));
    expect(input).toHaveFocus();
  });

  it("decrement button decreases value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberStepField
        value={2}
        onValueChange={onValueChange}
        suffix="hour"
        min={0}
        max={23}
        aria-label="Hours"
        decrementAriaLabel="Step down hours"
      />
    );
    await user.click(screen.getByRole("button", { name: /step down hours/i }));
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it("disables increment at max", () => {
    render(
      <NumberStepField
        value={23}
        onValueChange={() => {}}
        suffix="hour"
        min={0}
        max={23}
        aria-label="Hours"
        incrementAriaLabel="Up"
      />
    );
    expect(screen.getByRole("button", { name: /up/i })).toBeDisabled();
  });

  it("disables decrement at min", () => {
    render(
      <NumberStepField
        value={0}
        onValueChange={() => {}}
        suffix="minutes"
        min={0}
        max={59}
        aria-label="Minutes"
        decrementAriaLabel="Down"
      />
    );
    expect(screen.getByRole("button", { name: /down/i })).toBeDisabled();
  });

  it("disables input when disabled", () => {
    render(
      <NumberStepField
        value={0}
        onValueChange={() => {}}
        suffix="minutes"
        disabled
        aria-label="Minutes"
      />
    );
    expect(screen.getByLabelText("Minutes")).toBeDisabled();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <NumberStepField
        value={0}
        onValueChange={() => {}}
        suffix="hour"
        className="my-step-field"
        aria-label="Hours"
      />
    );
    expect(container.firstChild).toHaveClass("my-step-field");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <NumberStepField
        ref={ref}
        value={0}
        onValueChange={() => {}}
        suffix="hour"
        aria-label="Hours"
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
