import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateRangePicker } from "../../v2/date-range-picker";

// DateRangePicker renders no <p> elements (trigger + popover use span/div/button
// only), so the Bootstrap margin-bleed check below is trivially satisfied. It's
// kept as a regression guard, matching the convention in alert.test.tsx /
// reply-quote.test.tsx.
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

function dayLabelFor(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

describe("DateRangePicker", () => {
  it("renders the default placeholder when no value is set", () => {
    render(<DateRangePicker />);

    expect(
      screen.getByRole("button", { name: "Date Range" })
    ).toBeInTheDocument();
  });

  it("merges triggerLabelClassName onto the label span for responsive icon-only collapsing", () => {
    render(<DateRangePicker triggerLabelClassName="sr-only sm:not-sr-only" />);

    const label = screen.getByText("Date Range");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("sr-only", "sm:not-sr-only");
    // The label stays in the accessible name even while visually hidden via sr-only.
    expect(
      screen.getByRole("button", { name: "Date Range" })
    ).toBeInTheDocument();
  });

  it("renders the formatted range in the trigger when defaultValue is set", () => {
    render(
      <DateRangePicker
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: "3 Aug 2026 - 10 Aug 2026" })
    ).toBeInTheDocument();
  });

  it("opens the popover when the trigger is clicked", () => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
  });

  it("closes the popover when the trigger is clicked again", () => {
    render(<DateRangePicker />);

    const trigger = screen.getByRole("button", { name: "Date Range" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("closes the popover when Escape is pressed", () => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("closes the popover when clicking outside", () => {
    render(
      <div>
        <DateRangePicker />
        <button type="button">outside-target</button>
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "outside-target" })
    );
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("renders every default preset label when open", () => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("Last month")).toBeInTheDocument();
  });

  it('clicking the "Today" preset commits start = end = start-of-today and closes the popover', () => {
    const handleValueChange = vi.fn();
    render(<DateRangePicker onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    fireEvent.click(screen.getByText("Today"));

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    expect(handleValueChange).toHaveBeenCalledWith({
      start: startOfToday,
      end: startOfToday,
    });
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("renders two-letter weekday headers (Arc) rather than uppercase", () => {
    render(<DateRangePicker defaultOpen />);

    expect(screen.getByText("Su")).toBeInTheDocument();
    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.queryByText("SU")).not.toBeInTheDocument();
  });

  it("uses the info-surface token for the in-range highlight band", () => {
    render(
      <DateRangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
      />
    );

    // The band is a ::before on the cell wrapper (so week rows can cap both
    // ends without extra DOM), not a fill on the wrapper itself.
    const dayInBand = screen.getByLabelText(dayLabelFor(new Date(2026, 7, 5)));
    expect(dayInBand.parentElement).toHaveClass(
      "before:bg-semantic-info-surface"
    );
    expect(dayInBand.parentElement).not.toHaveClass("bg-semantic-info-surface");
  });

  it("shows the visible month and year as separate dropdown triggers", () => {
    render(
      <DateRangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
      />
    );

    expect(screen.getByText("August")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("jumps to the selected month via the month dropdown", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
      />
    );

    await user.click(screen.getByText("August"));
    await user.click(screen.getByText("March"));

    expect(screen.getByText("March")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("jumps to the selected year via the year dropdown", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
      />
    );

    await user.click(screen.getByText("2026"));
    await user.click(screen.getByText("2024"));

    expect(screen.getByText("August")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("hides the presets column when presets={[]}", () => {
    render(<DateRangePicker presets={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(screen.queryByText("Today")).not.toBeInTheDocument();
    expect(screen.queryByText("Yesterday")).not.toBeInTheDocument();
    // The calendar column still renders.
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("commits and closes as soon as the second day click completes the range", () => {
    const handleValueChange = vi.fn();
    render(<DateRangePicker onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const secondDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );

    // Click 1 — sets a pending draft start (end temporarily equals start);
    // nothing commits yet.
    fireEvent.click(screen.getByLabelText(dayLabelFor(firstDay)));
    expect(handleValueChange).not.toHaveBeenCalled();

    // Click 2 — completes the range and commits immediately, no separate
    // Apply step.
    fireEvent.click(screen.getByLabelText(dayLabelFor(secondDay)));

    expect(handleValueChange).toHaveBeenCalledWith({
      start: firstDay,
      end: secondDay,
    });
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("auto-swaps the range when the second click lands before the first", () => {
    const handleValueChange = vi.fn();
    render(<DateRangePicker onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const earlierDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const laterDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );

    // Click the later day first, then the earlier day — the committed range
    // should still come out start = earlier, end = later.
    fireEvent.click(screen.getByLabelText(dayLabelFor(laterDay)));
    fireEvent.click(screen.getByLabelText(dayLabelFor(earlierDay)));

    expect(handleValueChange).toHaveBeenCalledWith({
      start: earlierDay,
      end: laterDay,
    });
  });

  it("discards an incomplete manual selection and leaves the trigger unchanged when closed without completing the range", () => {
    const handleValueChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 10),
        }}
        onValueChange={handleValueChange}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "3 Aug 2026 - 10 Aug 2026",
    });
    fireEvent.click(trigger);

    // Start a new manual selection over the existing value, but never
    // complete it with a second click.
    fireEvent.click(screen.getByLabelText("August 15, 2026"));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "3 Aug 2026 - 10 Aug 2026" })
    ).toBeInTheDocument();
  });

  it("does not open the popover when disabled", () => {
    render(<DateRangePicker disabled />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("disables days before minDate and ignores clicks on them", () => {
    const handleValueChange = vi.fn();
    const today = new Date();
    const minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 5
    );

    render(
      <DateRangePicker minDate={minDate} onValueChange={handleValueChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const disabledDay = screen.getByLabelText(dayLabelFor(today));
    expect(disabledDay).toBeDisabled();

    fireEvent.click(disabledDay);

    // The click on a disabled day must not start a draft selection or
    // commit anything.
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("merges a custom className onto the root element", () => {
    render(
      <DateRangePicker
        className="custom-class"
        data-testid="date-range-picker"
      />
    );

    expect(screen.getByTestId("date-range-picker")).toHaveClass("custom-class");
    expect(screen.getByTestId("date-range-picker")).toHaveClass("relative");
  });

  it("forwards ref to the root div", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<DateRangePicker ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto the root element", () => {
    render(
      <DateRangePicker
        data-testid="date-range-picker"
        aria-label="test label"
      />
    );

    expect(screen.getByTestId("date-range-picker")).toHaveAttribute(
      "aria-label",
      "test label"
    );
  });

  it("applies error state styling to the trigger", () => {
    render(<DateRangePicker state="error" />);

    expect(screen.getByRole("button", { name: "Date Range" })).toHaveClass(
      "border-semantic-error-primary"
    );
  });

  it("clamps a preset range that starts before minDate", () => {
    const onValueChange = vi.fn();
    const minDate = new Date(2026, 8, 5);

    render(
      <DateRangePicker
        minDate={minDate}
        onValueChange={onValueChange}
        presets={[
          {
            label: "Spans minDate",
            getRange: () => ({
              start: new Date(2026, 8, 1),
              end: new Date(2026, 8, 10),
            }),
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    fireEvent.click(screen.getByText("Spans minDate"));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const committed = onValueChange.mock.calls[0][0];
    expect(committed.start).toEqual(minDate);
    expect(committed.end).toEqual(new Date(2026, 8, 10));
  });

  it("disables a preset whose whole range falls outside minDate/maxDate", () => {
    const onValueChange = vi.fn();

    render(
      <DateRangePicker
        minDate={new Date(2026, 8, 1)}
        onValueChange={onValueChange}
        presets={[
          {
            label: "All in the past",
            getRange: () => ({
              start: new Date(2025, 0, 1),
              end: new Date(2025, 0, 31),
            }),
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    const preset = screen.getByText("All in the past");

    expect(preset).toBeDisabled();
    fireEvent.click(preset);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("returns focus to the trigger after Escape closes the popover", () => {
    render(<DateRangePicker />);

    const trigger = screen.getByRole("button", { name: "Date Range" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveFocus();
  });

  it("omits years outside minDate/maxDate from the year dropdown", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        defaultValue={{
          start: new Date(2026, 7, 3),
          end: new Date(2026, 7, 5),
        }}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2027, 11, 31)}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "3 Aug 2026 - 5 Aug 2026" })
    );
    await user.click(screen.getByText("2026"));

    expect(screen.getByText("2027")).toBeInTheDocument();
    expect(screen.queryByText("2025")).not.toBeInTheDocument();
  });

  it("closes the month dropdown when the year dropdown opens", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 8, 3),
          end: new Date(2026, 8, 5),
        }}
      />
    );

    await user.click(screen.getByText("September"));
    expect(screen.getByText("January")).toBeInTheDocument();

    await user.click(screen.getByText("2026"));
    expect(screen.queryByText("January")).not.toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("does not render the clear button unless clearable is set", () => {
    render(
      <DateRangePicker
        defaultValue={{
          start: new Date(2026, 4, 26),
          end: new Date(2026, 5, 26),
        }}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Clear date range" })
    ).not.toBeInTheDocument();
  });

  it("hides the clear button while no range is selected", () => {
    render(<DateRangePicker clearable />);

    expect(
      screen.queryByRole("button", { name: "Clear date range" })
    ).not.toBeInTheDocument();
  });

  it("clears the range and fires onValueChange/onClear", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(
      <DateRangePicker
        clearable
        onClear={onClear}
        onValueChange={onValueChange}
        defaultValue={{
          start: new Date(2026, 4, 26),
          end: new Date(2026, 5, 26),
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Clear date range" }));

    expect(onValueChange).toHaveBeenCalledWith({
      start: undefined,
      end: undefined,
    });
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /Date Range/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear date range" })
    ).not.toBeInTheDocument();
  });

  it("does not open the calendar when the clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        clearable
        defaultValue={{
          start: new Date(2026, 4, 26),
          end: new Date(2026, 5, 26),
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Clear date range" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports a custom clear label", () => {
    render(
      <DateRangePicker
        clearable
        clearLabel="Reset dates"
        defaultValue={{
          start: new Date(2026, 4, 26),
          end: new Date(2026, 5, 26),
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: "Reset dates" })
    ).toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    const { container } = render(<DateRangePicker />);

    assertNoBootstrapMarginBleed(container);
  });
});

// ---------------------------------------------------------------------------
// Calendar refresh: continuous band, range preview, preset state, hover/focus
// and month motion. Fixed October 2026 dates (1 Oct is a Thursday) so nothing
// here depends on the day the suite runs.
// ---------------------------------------------------------------------------
describe("DateRangePicker calendar refresh", () => {
  const oct = (day: number) => new Date(2026, 9, day);
  const cell = (day: number) =>
    screen.getByLabelText(dayLabelFor(oct(day))).parentElement as HTMLElement;
  const circle = (day: number) => screen.getByLabelText(dayLabelFor(oct(day)));
  // The last 7-column grid in the dialog is the day grid (the first is the
  // static weekday header), whichever month is showing.
  const dayGrid = () =>
    Array.from(
      screen
        .getByRole("dialog", { hidden: true })
        .querySelectorAll<HTMLElement>(".grid-cols-7")
    ).pop() as HTMLElement;
  const classTokens = (element: Element) =>
    (element.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

  describe("range band", () => {
    const renderRange = () =>
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );

    it("caps the band at the range ends and at the first and last column of a week row", () => {
      renderRange();

      // Thu 1 = start (not a row end): left cap only.
      expect(cell(1)).toHaveClass("before:rounded-l-full");
      expect(cell(1)).not.toHaveClass("before:rounded-r-full");
      // Fri 2 is mid-row: a plain rectangle.
      expect(cell(2)).toHaveClass("before:bg-semantic-info-surface");
      expect(cell(2)).not.toHaveClass("before:rounded-l-full");
      expect(cell(2)).not.toHaveClass("before:rounded-r-full");
      // Sat 3 is the last column, so the row wraps here: right cap.
      expect(cell(3)).toHaveClass("before:rounded-r-full");
      expect(cell(3)).not.toHaveClass("before:rounded-l-full");
      // Sun 4 is the first column of the next row: left cap.
      expect(cell(4)).toHaveClass("before:rounded-l-full");
      expect(cell(4)).not.toHaveClass("before:rounded-r-full");
      // Wed 7 = end: right cap only.
      expect(cell(7)).toHaveClass("before:rounded-r-full");
      expect(cell(7)).not.toHaveClass("before:rounded-l-full");
    });

    it("starts and ends the band at the circle edge, not the cell edge, only at the range's own ends", () => {
      renderRange();

      expect(cell(1)).toHaveClass("before:left-[calc(50%-1.125rem)]");
      expect(cell(7)).toHaveClass("before:right-[calc(50%-1.125rem)]");
      // A row wrap is flush with the grid edge.
      expect(cell(4).className).not.toContain("before:left-[calc");
      expect(cell(3).className).not.toContain("before:right-[calc");
    });

    it("draws no band outside the range or for a single-day range", () => {
      renderRange();

      expect(cell(8).className).not.toContain("before:bg-");
      expect(cell(8).className).not.toContain("before:absolute");
    });

    it("keeps the selected edges as filled primary circles above the band", () => {
      renderRange();

      expect(circle(1)).toHaveClass("bg-semantic-primary", "relative", "z-[1]");
      expect(circle(7)).toHaveClass("bg-semantic-primary");
      expect(circle(1)).toHaveAttribute("aria-pressed", "true");
      expect(circle(4)).toHaveAttribute("aria-pressed", "false");
    });

    it("gives every row a 36px pitch at all breakpoints", () => {
      renderRange();

      expect(cell(1)).toHaveClass("h-9");
      expect(cell(1)).not.toHaveClass("sm:h-8");
    });
  });

  describe("range preview", () => {
    const renderPicker = (onValueChange = vi.fn()) =>
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
          onValueChange={onValueChange}
        />
      );
    const hasPreview = (element: HTMLElement) =>
      element.className.includes("before:border-dashed");

    it("shows nothing before the first click", () => {
      renderPicker();

      fireEvent.pointerEnter(circle(20));

      expect(hasPreview(cell(14))).toBe(false);
      expect(hasPreview(cell(20))).toBe(false);
    });

    it("previews start..hovered day with a lighter dashed band after the first click", () => {
      const onValueChange = vi.fn();
      renderPicker(onValueChange);

      fireEvent.click(circle(12));
      fireEvent.pointerEnter(circle(20));

      // Lighter fill + dashed edges, not the committed band.
      expect(cell(14)).toHaveClass(
        "before:bg-semantic-info-surface-subtle",
        "before:border-y",
        "before:border-dashed",
        "before:border-[color:var(--color-info-100)]"
      );
      expect(cell(14)).not.toHaveClass("before:bg-semantic-info-surface");
      // Same cap rules: both ends, plus the Sat/Sun week wrap.
      expect(cell(12)).toHaveClass("before:rounded-l-full");
      expect(cell(17)).toHaveClass("before:rounded-r-full");
      expect(cell(18)).toHaveClass("before:rounded-l-full");
      expect(cell(20)).toHaveClass("before:rounded-r-full");
      // Nothing past the hovered day.
      expect(hasPreview(cell(22))).toBe(false);
      // The hovered end is outlined, not filled; the anchor stays filled.
      expect(circle(20)).toHaveClass("ring-1", "ring-semantic-primary");
      expect(circle(20)).not.toHaveClass("bg-semantic-primary");
      expect(circle(12)).toHaveClass("bg-semantic-primary");
      // Purely visual: nothing selected, committed or announced by hovering.
      expect(circle(20)).toHaveAttribute("aria-pressed", "false");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("previews backwards when the hovered day is before the first click", () => {
      renderPicker();

      fireEvent.click(circle(20));
      fireEvent.pointerEnter(circle(12));

      expect(hasPreview(cell(15))).toBe(true);
      expect(cell(12)).toHaveClass("before:rounded-l-full");
      expect(cell(20)).toHaveClass("before:rounded-r-full");
      expect(circle(12)).toHaveClass("ring-1");
      expect(circle(20)).toHaveClass("bg-semantic-primary");
    });

    it("also previews from keyboard focus", () => {
      renderPicker();

      fireEvent.click(circle(12));
      fireEvent.focus(circle(16));

      expect(hasPreview(cell(14))).toBe(true);
      expect(circle(16)).toHaveClass("ring-1");
    });

    it("clears the preview when the pointer leaves the day grid", () => {
      renderPicker();

      fireEvent.click(circle(12));
      fireEvent.pointerEnter(circle(20));
      expect(hasPreview(cell(14))).toBe(true);

      fireEvent.pointerLeave(dayGrid());

      expect(hasPreview(cell(14))).toBe(false);
      expect(circle(20)).not.toHaveClass("ring-1");
    });

    it("ignores touch hovers, which are just the tap that will commit", () => {
      renderPicker();

      fireEvent.click(circle(12));
      // jsdom has no PointerEvent, so the init's pointerType would be dropped.
      const touchEnter = new Event("pointerover", { bubbles: true });
      Object.defineProperty(touchEnter, "pointerType", { value: "touch" });
      fireEvent(circle(20), touchEnter);

      expect(hasPreview(cell(14))).toBe(false);
    });

    it("still commits and closes on the second click, exactly as before", () => {
      const onValueChange = vi.fn();
      renderPicker(onValueChange);

      fireEvent.click(circle(12));
      fireEvent.pointerEnter(circle(20));
      fireEvent.click(circle(20));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith({
        start: oct(12),
        end: oct(20),
      });
      expect(
        screen.queryByRole("dialog", { hidden: true })
      ).not.toBeInTheDocument();
    });
  });

  describe("preset selected state", () => {
    const presets = [
      {
        label: "Launch week",
        getRange: () => ({ start: oct(1), end: oct(7) }),
      },
      {
        label: "Review week",
        getRange: () => ({ start: oct(15), end: oct(21) }),
      },
    ];

    it("marks the preset whose range equals the committed value", () => {
      render(
        <DateRangePicker
          defaultOpen
          presets={presets}
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );

      const selected = screen.getByText("Launch week");
      const other = screen.getByText("Review week");

      expect(selected).toHaveAttribute("aria-current", "true");
      expect(selected).toHaveClass(
        "bg-semantic-info-surface",
        "font-medium",
        "text-[var(--v2-text-primary,#484848)]"
      );
      expect(other).not.toHaveAttribute("aria-current");
      expect(other).not.toHaveClass("font-medium");
    });

    it("marks nothing when the value matches no preset or is empty", () => {
      const { rerender } = render(
        <DateRangePicker
          defaultOpen
          presets={presets}
          value={{ start: oct(2), end: oct(7) }}
        />
      );
      expect(
        screen
          .getAllByRole("button")
          .filter((b) => b.hasAttribute("aria-current")).length
      ).toBe(0);

      rerender(<DateRangePicker defaultOpen presets={presets} value={{}} />);
      expect(
        screen
          .getAllByRole("button")
          .filter((b) => b.hasAttribute("aria-current")).length
      ).toBe(0);
    });

    it("compares against the preset after it has been clamped to the allowed window", () => {
      render(
        <DateRangePicker
          defaultOpen
          presets={presets}
          minDate={oct(3)}
          defaultValue={{ start: oct(3), end: oct(7) }}
        />
      );

      expect(screen.getByText("Launch week")).toHaveAttribute(
        "aria-current",
        "true"
      );
    });

    it("marks the default preset that was just picked when the popover reopens", () => {
      render(<DateRangePicker />);

      fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
      fireEvent.click(screen.getByText("Last 7 days"));
      fireEvent.click(screen.getByRole("button", { name: /\d{4}/ }));

      expect(screen.getByText("Last 7 days")).toHaveAttribute(
        "aria-current",
        "true"
      );
      expect(screen.getByText("Today")).not.toHaveAttribute("aria-current");
    });
  });

  describe("hover, focus and sizing", () => {
    it("gates every hover utility behind (hover: hover) so touch never sticks", () => {
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );

      const ungated = Array.from(
        screen.getByRole("dialog", { hidden: true }).querySelectorAll("*")
      ).flatMap((element) =>
        classTokens(element).filter((token) => token.startsWith("hover:"))
      );

      expect(ungated).toEqual([]);
      expect(circle(20)).toHaveClass(
        "[@media(hover:hover)]:hover:bg-semantic-bg-hover"
      );
    });

    it("shows a visible keyboard focus ring on days, arrows, month/year pills and presets", () => {
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );
      const ring = [
        "focus-visible:outline",
        "focus-visible:[outline-width:2px]",
        "focus-visible:outline-offset-1",
        "focus-visible:outline-semantic-primary",
      ];
      const dialog = screen.getByRole("dialog", { hidden: true });

      expect(circle(20)).toHaveClass(...ring, "focus-visible:z-10");
      expect(screen.getByLabelText("Previous month")).toHaveClass(...ring);
      expect(screen.getByLabelText("Next month")).toHaveClass(...ring);
      expect(dialog.querySelector('[data-calendar-menu="month"]')).toHaveClass(
        ...ring
      );
      expect(dialog.querySelector('[data-calendar-menu="year"]')).toHaveClass(
        ...ring
      );
      expect(screen.getByText("Today")).toHaveClass(...ring);
    });

    it("sizes the arrows at 32px (36px on small screens) with a 16px icon", () => {
      render(<DateRangePicker defaultOpen />);

      for (const name of ["Previous month", "Next month"]) {
        const button = screen.getByLabelText(name);
        expect(button).toHaveClass("size-8", "max-sm:size-9", "rounded-lg");
        expect(button.querySelector("svg")).toHaveClass("size-4");
      }
    });

    it("gives the month and year pills one height and a chevron each", () => {
      render(<DateRangePicker defaultOpen />);
      const dialog = screen.getByRole("dialog", { hidden: true });

      for (const kind of ["month", "year"]) {
        const pill = dialog.querySelector(`[data-calendar-menu="${kind}"]`);
        expect(pill).toHaveClass("h-8", "rounded-lg");
        expect(pill?.querySelector("svg")).toBeInTheDocument();
      }
    });

    it("turns the pill chevron while its menu is open", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );
      const dialog = screen.getByRole("dialog", { hidden: true });
      const chevron = (kind: string) =>
        dialog.querySelector(`[data-calendar-menu="${kind}"] svg`);

      expect(chevron("month")).not.toHaveClass("rotate-180");
      expect(chevron("month")).toHaveClass(
        "transition-transform",
        "motion-reduce:transition-none"
      );

      await user.click(screen.getByText("October"));

      expect(chevron("month")).toHaveClass("rotate-180");
      expect(chevron("year")).not.toHaveClass("rotate-180");
    });

    it("announces month changes through the existing heading container", () => {
      render(<DateRangePicker defaultOpen />);
      const dialog = screen.getByRole("dialog", { hidden: true });
      const heading = document.getElementById(
        dialog.getAttribute("aria-labelledby") ?? ""
      );

      expect(heading).toHaveAttribute("aria-live", "polite");
      expect(heading).toContainElement(
        dialog.querySelector('[data-calendar-menu="month"]') as HTMLElement
      );
    });
  });

  describe("month change motion", () => {
    const motionClasses = ["motion-safe:animate-in", "motion-safe:fade-in-0"];
    const renderOpen = () =>
      render(
        <DateRangePicker
          defaultOpen
          defaultValue={{ start: oct(1), end: oct(7) }}
        />
      );

    it("does not animate the month when the popover opens", () => {
      renderOpen();

      for (const name of motionClasses) {
        expect(dayGrid()).not.toHaveClass(name);
      }
      expect(dayGrid().className).not.toContain("slide-in-from");
    });

    it("slides the new month in from the right on Next and from the left on Previous", () => {
      renderOpen();
      const first = dayGrid();

      fireEvent.click(screen.getByLabelText("Next month"));
      // keyed container: a fresh node, so the keyframes restart
      const afterNext = dayGrid();
      expect(afterNext).not.toBe(first);
      expect(afterNext).toHaveClass(
        ...motionClasses,
        "motion-safe:slide-in-from-right-2",
        "motion-safe:[animation-duration:200ms]",
        "motion-reduce:animate-[v2-fade-in_120ms_ease-out]"
      );

      fireEvent.click(screen.getByLabelText("Previous month"));
      fireEvent.click(screen.getByLabelText("Previous month"));
      const afterPrev = dayGrid();
      expect(afterPrev).toHaveClass("motion-safe:slide-in-from-left-2");
      expect(afterPrev).not.toHaveClass("motion-safe:slide-in-from-right-2");
    });

    it("keeps the weekday header static while the day grid re-mounts", () => {
      renderOpen();
      const weekdayRow = screen.getByText("Su").parentElement as HTMLElement;

      fireEvent.click(screen.getByLabelText("Next month"));

      expect(weekdayRow.isConnected).toBe(true);
      expect(weekdayRow).not.toBe(dayGrid());
      expect(weekdayRow).not.toHaveClass("motion-safe:animate-in");
    });

    it("does not animate on reopen even when the last direction is still remembered", () => {
      renderOpen();

      // Next then Previous lands back on October with a stale "prev" direction.
      fireEvent.click(screen.getByLabelText("Next month"));
      fireEvent.click(screen.getByLabelText("Previous month"));
      expect(dayGrid()).toHaveClass("motion-safe:slide-in-from-left-2");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(
        screen.queryByRole("dialog", { hidden: true })
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Oct 2026/ }));

      expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
      expect(dayGrid().className).not.toContain("animate-in");
      expect(dayGrid().className).not.toContain("slide-in-from");
    });

    it("does not animate the month reset that opening performs after navigating away", () => {
      renderOpen();

      fireEvent.click(screen.getByLabelText("Next month"));
      fireEvent.click(screen.getByLabelText("Next month"));
      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.click(screen.getByRole("button", { name: /Oct 2026/ }));

      // Opening jumps back to the committed month (October) ...
      expect(circle(7)).toBeInTheDocument();
      // ... without playing the slide.
      expect(dayGrid().className).not.toContain("animate-in");
    });
  });
});
