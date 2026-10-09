import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberStepField } from "../../v2/number-step-field";

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

describe("NumberStepField hold to repeat and tiles", () => {
  function Harness({
    initial = 5,
    min = 0,
    max = 10,
    onChange,
  }: {
    initial?: number;
    min?: number;
    max?: number;
    onChange?: (n: number) => void;
  }) {
    const [value, setValue] = React.useState(initial);
    return (
      <NumberStepField
        value={value}
        onValueChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
        min={min}
        max={max}
        suffix="x"
        aria-label="Qty"
      />
    );
  }
  afterEach(() => vi.useRealTimers());

  it("repeats while held: first after 400ms, then every 60ms", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const up = screen.getByLabelText("Increase value");
    fireEvent.pointerDown(up, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(6);
    act(() => {
      vi.advanceTimersByTime(59);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenLastCalledWith(9);
  });

  it("does not step a second time when the click for a held press arrives", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const up = screen.getByLabelText("Increase value");
    fireEvent.pointerDown(up, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(520);
    });
    const callsWhileHeld = onChange.mock.calls.length;
    expect(callsWhileHeld).toBe(3);
    fireEvent.pointerUp(up);
    fireEvent.click(up);
    expect(onChange).toHaveBeenCalledTimes(callsWhileHeld);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(callsWhileHeld);
  });

  it("steps once for a short press (down, up, click) and never repeats", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const up = screen.getByLabelText("Increase value");
    fireEvent.pointerDown(up, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(120);
    });
    fireEvent.pointerUp(up);
    fireEvent.click(up);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(6);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the plain click path for keyboard activation and tests", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Increase value"));
    fireEvent.click(screen.getByLabelText("Decrease value"));
    expect(onChange.mock.calls).toEqual([[6], [5]]);
  });

  it("stops repeating when the pointer leaves", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const down = screen.getByLabelText("Decrease value");
    fireEvent.pointerDown(down, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(460);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    fireEvent.pointerLeave(down);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("stops at the bound without changing clamping", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness initial={8} max={10} onChange={onChange} />);
    fireEvent.pointerDown(screen.getByLabelText("Increase value"), {
      button: 0,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onChange.mock.calls).toEqual([[9], [10]]);
    expect(screen.getByLabelText("Qty")).toHaveValue(10);
  });

  it("ignores a secondary mouse button", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent(
      screen.getByLabelText("Increase value"),
      new MouseEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        button: 2,
      })
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stops repeating on unmount", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { unmount } = render(<Harness onChange={onChange} />);
    fireEvent.pointerDown(screen.getByLabelText("Increase value"), {
      button: 0,
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("makes each chevron a half-height tile with a gated neutral hover fill, and keeps both tabbable", () => {
    render(<Harness />);
    for (const name of ["Increase value", "Decrease value"]) {
      const tile = screen.getByLabelText(name);
      expect(tile).toHaveClass("flex-1", "w-full", "rounded");
      expect(tile.className).toContain(
        "enabled:[@media(hover:hover)]:hover:bg-semantic-bg-semantic-ui".replace(
          "semantic-bg-semantic-ui",
          "semantic-bg-ui"
        )
      );
      expect(tile).not.toHaveAttribute("tabindex");
    }
    const column = screen.getByLabelText("Increase value").parentElement!;
    expect(column).toHaveClass("h-full", "w-7", "flex-col");
  });

  it("marks a held stepper with data-pressed (pointer down cancels :active) and clears it on release", () => {
    render(<Harness />);
    const up = screen.getByLabelText("Increase value");
    expect(up).not.toHaveAttribute("data-pressed");
    fireEvent.pointerDown(up, { button: 0 });
    expect(up).toHaveAttribute("data-pressed");
    fireEvent.pointerUp(up);
    expect(up).not.toHaveAttribute("data-pressed");
    expect(up.className).toContain("[&:is(:active,[data-pressed])");
  });
});
