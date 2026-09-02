import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateRangePicker } from "../date-range-picker";

// DateRangePicker renders no <p> elements (trigger + popover use span/div/button
// only), so the Bootstrap margin-bleed check below is trivially satisfied. It's
// kept as a regression guard, matching the convention in alert.test.tsx /
// reply-quote.test.tsx.
import { assertNoBootstrapMarginBleed } from "./utils/bootstrap-compat";

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
    expect(screen.getByRole("button", { name: "Date Range" })).toBeInTheDocument();
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

    fireEvent.mouseDown(
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

  it("renders weekday headers in uppercase", () => {
    render(<DateRangePicker defaultOpen />);

    expect(screen.getByText("SU")).toBeInTheDocument();
    expect(screen.getByText("MO")).toBeInTheDocument();
    expect(screen.queryByText("Su")).not.toBeInTheDocument();
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

    const dayInBand = screen.getByLabelText(dayLabelFor(new Date(2026, 7, 5)));
    expect(dayInBand.parentElement).toHaveClass("bg-semantic-info-surface");
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

    expect(screen.getByTestId("date-range-picker")).toHaveClass(
      "custom-class"
    );
    expect(screen.getByTestId("date-range-picker")).toHaveClass("relative");
  });

  it("forwards ref to the root div", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<DateRangePicker ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto the root element", () => {
    render(
      <DateRangePicker data-testid="date-range-picker" aria-label="test label" />
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

  it("has no Bootstrap margin bleed on <p> elements", () => {
    const { container } = render(<DateRangePicker />);

    assertNoBootstrapMarginBleed(container);
  });
});
