import * as React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
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

  it("repeats while held: first after 400ms, then sooner and sooner down to 40ms", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness initial={0} max={500} onChange={onChange} />);
    const up = screen.getByLabelText("Increase Qty");
    fireEvent.pointerDown(up, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(1);
    // The next repeat comes 150 * 0.86 = 129ms later, not 150.
    act(() => {
      vi.advanceTimersByTime(128);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    // Each gap is shorter than the last, and never below 40ms.
    const stamps: number[] = [];
    const record = () => stamps.push(Date.now());
    onChange.mockImplementation(record);
    for (let i = 0; i < 40; i++) {
      act(() => {
        vi.advanceTimersByTime(1);
      });
    }
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const gaps = stamps.slice(1).map((stamp, i) => stamp - stamps[i]);
    expect(gaps.length).toBeGreaterThan(10);
    expect(gaps[0]).toBeGreaterThan(gaps[gaps.length - 1]);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(40);
    expect(gaps[gaps.length - 1]).toBeLessThan(45);
  });

  it("does not step a second time when the click for a held press arrives", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const up = screen.getByLabelText("Increase Qty");
    fireEvent.pointerDown(up, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(560);
    });
    const callsWhileHeld = onChange.mock.calls.length;
    expect(callsWhileHeld).toBe(2);
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
    const up = screen.getByLabelText("Increase Qty");
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
    fireEvent.click(screen.getByLabelText("Increase Qty"));
    fireEvent.click(screen.getByLabelText("Decrease Qty"));
    expect(onChange.mock.calls).toEqual([[6], [5]]);
  });

  it("stops repeating when the pointer leaves", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const down = screen.getByLabelText("Decrease Qty");
    fireEvent.pointerDown(down, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(540);
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
    fireEvent.pointerDown(screen.getByLabelText("Increase Qty"), {
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
      screen.getByLabelText("Increase Qty"),
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
    fireEvent.pointerDown(screen.getByLabelText("Increase Qty"), {
      button: 0,
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("makes each chevron a half-height tile with a gated neutral hover fill, out of the Tab order", () => {
    render(<Harness />);
    for (const name of ["Increase Qty", "Decrease Qty"]) {
      const tile = screen.getByLabelText(name);
      expect(tile).toHaveClass("flex-1", "w-full", "rounded");
      expect(tile.className).toContain(
        "enabled:[@media(hover:hover)]:hover:bg-semantic-bg-semantic-ui".replace(
          "semantic-bg-semantic-ui",
          "semantic-bg-ui"
        )
      );
      // The input already answers the arrow and page keys, so the steppers are not Tab stops.
      expect(tile).toHaveAttribute("tabindex", "-1");
    }
    const column = screen.getByLabelText("Increase Qty").parentElement!;
    expect(column).toHaveClass("h-full", "w-7", "flex-col");
  });

  it("marks a held stepper with data-pressed (pointer down cancels :active) and clears it on release", () => {
    render(<Harness />);
    const up = screen.getByLabelText("Increase Qty");
    expect(up).not.toHaveAttribute("data-pressed");
    fireEvent.pointerDown(up, { button: 0 });
    expect(up).toHaveAttribute("data-pressed");
    fireEvent.pointerUp(up);
    expect(up).not.toHaveAttribute("data-pressed");
    expect(up.className).toContain("[&:is(:active,[data-pressed])");
  });
});

// An earlier suite restores every mock, which empties the shared matchMedia stub; put a
// desktop-like one back (hover-capable, fine pointer, motion allowed).
const installMatchMedia = (reducedMotion = false) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      query === "(hover: hover)" ||
      query === "(pointer: fine)" ||
      (reducedMotion && query === "(prefers-reduced-motion: reduce)"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as unknown as typeof window.matchMedia;
};

function Field({
  initial = 5,
  onChange,
  onBlur,
  ...rest
}: {
  initial?: number;
  onChange?: (n: number) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
} & Partial<React.ComponentProps<typeof NumberStepField>>) {
  const [value, setValue] = React.useState(initial);
  return (
    <NumberStepField
      aria-label="Hours"
      suffix="hours"
      min={0}
      max={23}
      {...rest}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      onBlur={onBlur}
    />
  );
}

const live = (container: HTMLElement) =>
  container.querySelector("[aria-live='polite']") as HTMLElement;

describe("NumberStepField typing", () => {
  beforeEach(() => installMatchMedia());

  it("applies a valid number at once, as before", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={1} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "12");
    expect(onChange).toHaveBeenLastCalledWith(12);
    expect(input).toHaveValue(12);
  });

  it("does not turn a cleared field into 0, or leave a leading zero behind", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={9} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    expect(input).toHaveValue(null);
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, "7");
    expect(input).toHaveValue(7);
    expect(input).toHaveDisplayValue("7");
    expect(onChange).toHaveBeenLastCalledWith(7);
  });

  it("puts the old value back when the field is left empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Field initial={9} onChange={onChange} />
        <button type="button">elsewhere</button>
      </>
    );
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(input).toHaveValue(9);
    expect(onChange).not.toHaveBeenCalled();
    expect(live(document.body)).toHaveTextContent("9 hours");
  });

  it("holds a number below the minimum while it is typed, so 25 can be typed above a minimum of 10", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={30} min={10} max={59} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "2");
    // 2 is below the minimum: shown as typed, not applied, not rewritten to 10.
    expect(input).toHaveDisplayValue("2");
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, "5");
    expect(input).toHaveDisplayValue("25");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(25);
  });

  it("clamps a held number to the limit when the field is left, and announces which limit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const { container } = render(
      <>
        <Field
          initial={30}
          min={10}
          max={59}
          onChange={onChange}
          onBlur={onBlur}
        />
        <button type="button">elsewhere</button>
      </>
    );
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "3");
    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(10);
    expect(input).toHaveValue(10);
    expect(live(container)).toHaveTextContent("10 hours, minimum");
    // The consumer's own blur handler runs after the draft has been applied.
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(
      onBlur.mock.invocationCallOrder[0]
    );
  });

  it("clamps a number above the maximum on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={4} max={23} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "99");
    // The 9 on its own was valid and applied; the second 9 made 99 and is held.
    expect(onChange.mock.calls).toEqual([[9]]);
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(23);
    expect(input).toHaveValue(23);
  });

  it("types a negative number when the minimum is below zero", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={0} min={-10} max={10} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "-5");
    expect(onChange).toHaveBeenLastCalledWith(-5);
    expect(input).toHaveValue(-5);
  });

  it("refuses a minus sign when nothing below zero is allowed", () => {
    render(<Field min={0} />);
    const input = screen.getByLabelText("Hours");
    expect(fireEvent.keyDown(input, { key: "-" })).toBe(false);
    expect(fireEvent.keyDown(input, { key: "+" })).toBe(false);
    const negative = render(<Field min={-5} />);
    expect(
      fireEvent.keyDown(negative.getAllByLabelText("Hours")[1], { key: "-" })
    ).toBe(true);
  });

  it("refuses a decimal point and asks the phone for a numeric keyboard", () => {
    render(<Field />);
    const input = screen.getByLabelText("Hours");
    expect(fireEvent.keyDown(input, { key: "." })).toBe(false);
    expect(input).toHaveAttribute("inputmode", "numeric");
  });

  it("puts everything back on Escape, including a number that was applied while typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={4} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "12");
    expect(onChange).toHaveBeenLastCalledWith(12);
    await user.keyboard("{Escape}");
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(input).toHaveValue(4);
  });

  it("applies a held draft before a stepper press steps from it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={30} min={10} max={59} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "3");
    await user.click(screen.getByLabelText("Increase Hours"));
    // 3 clamps to the minimum of 10, then the press steps to 11.
    expect(onChange.mock.calls).toEqual([[10], [11]]);
    expect(input).toHaveFocus();
  });

  it("hides the wheels while the text is edited and brings them back after", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field initial={4} />
        <button type="button">elsewhere</button>
      </>
    );
    const input = screen.getByLabelText("Hours");
    const wheels = () =>
      document.querySelector("[data-number-digits]") as HTMLElement;
    expect(wheels()).not.toHaveAttribute("data-editing");
    expect(input).toHaveClass("text-transparent");
    await user.clear(input);
    await user.type(input, "8");
    expect(wheels()).toHaveAttribute("data-editing");
    expect(wheels()).toHaveClass("opacity-0");
    expect(input).not.toHaveClass("text-transparent");
    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(wheels()).not.toHaveAttribute("data-editing");
    expect(input).toHaveClass("text-transparent");
  });
});

describe("NumberStepField keyboard", () => {
  beforeEach(() => installMatchMedia());

  it("steps with ArrowUp and ArrowDown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={5} onChange={onChange} />);
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{ArrowUp}{ArrowUp}{ArrowDown}");
    expect(onChange.mock.calls).toEqual([[6], [7], [6]]);
  });

  it("takes a large step with PageUp, PageDown and Shift+Arrow (ten steps unless largeStep says otherwise)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={5} max={100} onChange={onChange} />);
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{PageUp}");
    expect(onChange).toHaveBeenLastCalledWith(15);
    await user.keyboard("{PageDown}{PageDown}");
    expect(onChange).toHaveBeenLastCalledWith(0);
    await user.keyboard("{Shift>}{ArrowUp}{/Shift}");
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("honours largeStep and a step larger than one", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Field
        initial={20}
        max={100}
        step={5}
        largeStep={25}
        onChange={onChange}
      />
    );
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith(25);
    await user.keyboard("{PageUp}");
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it("moves an off-grid value to the next grid line first, as a browser's own stepper does", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={23} max={100} step={5} onChange={onChange} />);
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith(25);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(15);
  });

  it("jumps to the limits with Home and End, but leaves them to the caret while typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field initial={5} min={2} max={23} onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    input.focus();
    await user.keyboard("{End}");
    expect(onChange).toHaveBeenLastCalledWith(23);
    await user.keyboard("{Home}");
    expect(onChange).toHaveBeenLastCalledWith(2);
    onChange.mockClear();
    await user.clear(input);
    await user.type(input, "1");
    await user.keyboard("{Home}");
    expect(onChange).not.toHaveBeenCalledWith(2);
  });

  it("leaves an unbounded maximum alone on End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NumberStepField
        aria-label="Seats"
        value={5}
        onValueChange={onChange}
        suffix="seats"
      />
    );
    screen.getByLabelText("Seats").focus();
    await user.keyboard("{End}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("strains instead of stepping at a limit, and says which limit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Field initial={23} onChange={onChange} />);
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).not.toHaveBeenCalled();
    expect(live(container)).toHaveTextContent("23 hours, maximum");
    const wheels = document.querySelector(
      "[data-number-digits]"
    ) as HTMLElement;
    expect(wheels).toHaveClass("text-semantic-warning-text");
    await waitFor(
      () => expect(wheels).not.toHaveClass("text-semantic-warning-text"),
      { timeout: 1500 }
    );
  });

  it("announces a step", async () => {
    const user = userEvent.setup();
    const { container } = render(<Field initial={5} />);
    screen.getByLabelText("Hours").focus();
    await user.keyboard("{ArrowUp}");
    expect(live(container)).toHaveTextContent("6 hours");
  });

  it("ignores every key on a disabled field", async () => {
    const onChange = vi.fn();
    render(<Field initial={5} disabled onChange={onChange} />);
    const input = screen.getByLabelText("Hours");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "End" });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("NumberStepField semantics", () => {
  beforeEach(() => installMatchMedia());

  it("names the steppers after the field, unless told otherwise", () => {
    const { rerender } = render(<Field />);
    expect(screen.getByLabelText("Increase Hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease Hours")).toBeInTheDocument();
    rerender(
      <Field
        incrementAriaLabel="Step up hours"
        decrementAriaLabel="Step down"
      />
    );
    expect(screen.getByLabelText("Step up hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Step down")).toBeInTheDocument();
    rerender(<NumberStepField value={1} onValueChange={() => {}} suffix="x" />);
    expect(screen.getByLabelText("Increase value")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease value")).toBeInTheDocument();
  });

  it("takes the steppers out of the Tab order but keeps them as real buttons", () => {
    render(<Field />);
    for (const name of ["Increase Hours", "Decrease Hours"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("tabindex", "-1");
      expect(button).toHaveAttribute("type", "button");
    }
  });

  it("keeps the steppers disabled at the limits, as in v1", () => {
    const { unmount } = render(<Field initial={23} />);
    expect(screen.getByLabelText("Increase Hours")).toBeDisabled();
    expect(screen.getByLabelText("Decrease Hours")).toBeEnabled();
    unmount();
    render(<Field initial={0} />);
    expect(screen.getByLabelText("Decrease Hours")).toBeDisabled();
  });

  it("reads the value with its unit", () => {
    const { rerender } = render(<Field initial={3} />);
    expect(screen.getByLabelText("Hours")).toHaveAttribute(
      "aria-valuetext",
      "3 hours"
    );
    rerender(<Field initial={3} suffix={undefined} />);
    expect(screen.getByLabelText("Hours")).not.toHaveAttribute(
      "aria-valuetext"
    );
  });

  it("drops the suffix cell when there is no suffix", () => {
    render(<Field suffix={undefined} />);
    expect(screen.queryByText("hours")).not.toBeInTheDocument();
  });

  it("marks an error: red border and aria-invalid", () => {
    const { rerender } = render(<Field state="error" />);
    const input = screen.getByLabelText("Hours");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const shell = input.parentElement!.parentElement!;
    expect(shell).toHaveClass("border-semantic-error-primary");
    // The grey hover border must not replace the red one.
    expect(shell.className).not.toContain("group-hover");
    rerender(<Field />);
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(shell).toHaveClass("border-semantic-border-layout");
  });

  it("grows the field on a coarse pointer so each stepper tile is 24px", () => {
    render(<Field />);
    const shell = screen.getByLabelText("Hours").parentElement!.parentElement!;
    expect(shell).toHaveClass("h-11", "[@media(pointer:coarse)]:h-[50px]");
  });

  it("keeps the number's text in the input for forms and tests, under the wheels", () => {
    render(<Field initial={42} />);
    expect(screen.getByLabelText("Hours")).toHaveValue(42);
    const wheels = document.querySelector(
      "[data-number-digits]"
    ) as HTMLElement;
    expect(wheels).toHaveAttribute("aria-hidden", "true");
    expect(wheels).toHaveClass("pointer-events-none");
  });
});

describe("NumberStepField rolling digits", () => {
  beforeEach(() => installMatchMedia());

  const glyphsOf = (column: Element) =>
    Array.from(column.querySelectorAll<HTMLElement>("span[style]")).filter(
      (node) => /^\d$/.test(node.textContent ?? "")
    );
  const columns = () =>
    Array.from(document.querySelectorAll("[data-number-digits] > span > span"));
  const visibleDigit = (column: Element) =>
    glyphsOf(column).find(
      (node) =>
        node.style.visibility === "visible" && Number(node.style.opacity) > 0.9
    )?.textContent;

  it("draws one wheel of ten digits per place, showing the value", () => {
    render(<Field initial={42} />);
    const cols = columns();
    expect(cols).toHaveLength(2);
    for (const column of cols) expect(glyphsOf(column)).toHaveLength(10);
    expect(cols.map(visibleDigit)).toEqual(["4", "2"]);
  });

  it("shows the minus sign of a negative number as its own column", () => {
    render(<Field initial={-7} min={-10} />);
    const wheels = document.querySelector(
      "[data-number-digits]"
    ) as HTMLElement;
    expect(wheels).toHaveTextContent("-");
    expect(
      columns().filter((column) => glyphsOf(column).length === 10)
    ).toHaveLength(1);
  });

  it("turns the wheel to the new digit when the value changes", async () => {
    const user = userEvent.setup();
    render(<Field initial={5} />);
    expect(columns().map(visibleDigit)).toEqual(["5"]);
    await user.click(screen.getByLabelText("Increase Hours"));
    await waitFor(() => expect(columns().map(visibleDigit)).toEqual(["6"]), {
      timeout: 1500,
    });
  });

  it("wraps 9 to 0 by turning forward one place, not back through every digit", async () => {
    const user = userEvent.setup();
    render(<Field initial={9} max={99} />);
    const ones = columns()[0];
    const before = glyphsOf(ones).find((node) => node.textContent === "9")!;
    await user.click(screen.getByLabelText("Increase Hours"));
    // 9 leaves upward (negative y) while 0 arrives from below: one step, not nine.
    await waitFor(
      () => {
        const nine = glyphsOf(ones).find((node) => node.textContent === "9")!;
        expect(
          parseFloat(nine.style.transform.replace(/[^-\d.]/g, ""))
        ).toBeLessThan(0);
      },
      { timeout: 1500 }
    );
    expect(before).toBeDefined();
  });

  it("opens a new column when the number gains a digit", async () => {
    const user = userEvent.setup();
    render(<Field initial={9} max={99} />);
    expect(columns()).toHaveLength(1);
    await user.click(screen.getByLabelText("Increase Hours"));
    await waitFor(() => expect(columns()).toHaveLength(2), { timeout: 1500 });
  });

  it("follows typed text at once instead of rolling", async () => {
    const user = userEvent.setup();
    render(<Field initial={5} />);
    const input = screen.getByLabelText("Hours");
    await user.clear(input);
    await user.type(input, "8");
    // Hidden under the text, but already on the right digit (a jump, not a spin: it is
    // fully opaque on the first frame instead of fading through the digits between).
    await waitFor(() => expect(columns().map(visibleDigit)).toEqual(["8"]), {
      timeout: 200,
    });
  });

  it("jumps instead of spinning when motion is reduced", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Field initial={5} />);
    await user.click(screen.getByLabelText("Increase Hours"));
    await waitFor(() => expect(columns().map(visibleDigit)).toEqual(["6"]), {
      timeout: 200,
    });
  });
});
