import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DateTimePicker,
  formatDateForDisplay,
  formatTimeForDisplay,
} from "../date-time-picker";

const mayTwelve = new Date(2026, 4, 12);

describe("DateTimePicker", () => {
  it("renders a formatted date and start time", () => {
    render(
      <DateTimePicker
        value={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 10:30 AM"
    );
  });

  it("renders the placeholder when no date is selected", () => {
    render(<DateTimePicker />);

    expect(screen.getByPlaceholderText("--/--/-- -- : --")).toBeInTheDocument();
  });

  it("renders a date-only variant", () => {
    render(
      <DateTimePicker
        variant="date-only"
        value={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Date")).toHaveValue("12/05/2026");
  });

  it("renders a time-only variant", () => {
    render(
      <DateTimePicker
        variant="time-only"
        showEndTime={false}
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    expect(screen.getByLabelText("Time")).toHaveValue("10:30 AM");
  });

  it("opens the calendar popover from the input trigger", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toHaveTextContent("May");
    expect(screen.getByLabelText("Year")).toHaveTextContent("2026");
    expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
    expect(screen.getByLabelText("End Time")).toBeInTheDocument();
  });

  it("shows only the calendar for the date-only variant", () => {
    render(
      <DateTimePicker
        variant="date-only"
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date"));

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toBeInTheDocument();
    expect(screen.queryByLabelText("Start Time")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("End Time")).not.toBeInTheDocument();
  });

  it("shows only the time fields for the time-only variant", () => {
    render(
      <DateTimePicker
        variant="time-only"
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Time"));

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
    expect(screen.getByLabelText("End Time")).toBeInTheDocument();
    expect(screen.queryByLabelText("Month")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Year")).not.toBeInTheDocument();
  });

  it("uses DateRangeModal trigger styling", () => {
    render(<DateTimePicker />);

    const trigger = screen.getByLabelText("Date and time").parentElement;

    expect(trigger).toHaveClass("h-10");
    expect(trigger).toHaveClass("rounded-lg");
    expect(trigger).toHaveClass("px-4");
    expect(trigger).toHaveClass("py-2.5");
    expect(trigger).toHaveClass("text-sm");
    expect(trigger).toHaveClass("border-semantic-border-input");
    expect(trigger).toHaveClass("text-semantic-text-placeholder");
  });

  it("selects a day and reports value changes", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.click(screen.getByLabelText("May 26, 2026"));

    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 4, 26),
      startTime: "10:30:00",
      endTime: "12:30:00",
    });
  });

  it("updates start and end time values", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.change(screen.getByLabelText("Start Time"), {
      target: { value: "11:45:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time"), {
      target: { value: "13:15:00" },
    });

    expect(handleValueChange).toHaveBeenCalledWith({
      date: mayTwelve,
      startTime: "11:45:00",
      endTime: "12:30:00",
    });
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: mayTwelve,
      startTime: "11:45:00",
      endTime: "13:15:00",
    });
  });

  it.each([
    ["sm", "sm:w-[280px]"],
    ["default", "sm:w-[336px]"],
    ["lg", "sm:w-[360px]"],
  ] as const)("renders responsive %s size", (size, expectedClass) => {
    render(<DateTimePicker size={size} data-testid="date-time-picker" />);

    expect(screen.getByTestId("date-time-picker")).toHaveClass("w-full");
    expect(screen.getByTestId("date-time-picker")).toHaveClass(expectedClass);
    expect(screen.getByTestId("date-time-picker")).toHaveClass("max-w-full");
  });

  it("applies error state styling to the trigger", () => {
    render(<DateTimePicker state="error" />);

    expect(screen.getByLabelText("Date and time").parentElement).toHaveClass(
      "border-semantic-error-primary"
    );
  });

  it("supports controlled open state", () => {
    const handleOpenChange = vi.fn();

    render(<DateTimePicker open={false} onOpenChange={handleOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Open calendar" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("disables dates before minDate", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        minDate={new Date(2026, 4, 12)}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));

    expect(screen.getByLabelText("May 11, 2026")).toBeDisabled();
    expect(screen.getByLabelText("May 12, 2026")).not.toBeDisabled();
  });

  it("hides clear action when showClear is false", () => {
    render(
      <DateTimePicker
        showClear={false}
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Clear date" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open calendar" })
    ).toBeInTheDocument();
  });

  it("allows typing a date into the input", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Date and time"), {
      target: { value: "15/06/2026" },
    });

    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 5, 15),
      startTime: "10:30:00",
      endTime: "12:30:00",
    });
  });

  it("allows typing date and start time into the input", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Date and time"), {
      target: { value: "15/06/2026 11:45 PM" },
    });

    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 5, 15),
      startTime: "23:45:00",
      endTime: "12:30:00",
    });
  });

  it("auto formats a continuously typed date", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    fireEvent.focus(input);
    fireEvent.change(input, {
      target: { value: "15062026" },
    });

    expect(input).toHaveValue("15/06/2026");
    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 5, 15),
      startTime: "10:30:00",
      endTime: "12:30:00",
    });
  });

  it("auto formats continuously typed date and time input", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    fireEvent.focus(input);
    fireEvent.change(input, {
      target: { value: "150620261145pm" },
    });

    expect(input).toHaveValue("15/06/2026 11:45 PM");
    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 5, 15),
      startTime: "23:45:00",
      endTime: "12:30:00",
    });
  });

  it("allows clearing and typing a full date-time character by character", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    await user.clear(input);
    await user.type(input, "121020261030pm");

    expect(input).toHaveValue("12/10/2026 10:30 PM");
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: new Date(2026, 9, 12),
      startTime: "22:30:00",
      endTime: "12:30:00",
    });
  });

  it("allows in-place edits to formatted date segments", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "22:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    fireEvent.focus(input);
    fireEvent.change(input, {
      target: { value: "1/05/2026 10:30 PM" },
    });

    expect(input).toHaveValue("1/05/2026 10:30 PM");
    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 4, 1),
      startTime: "22:30:00",
      endTime: "12:30:00",
    });
  });

  it("rejects invalid dates and unsupported alphabetic input", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    fireEvent.change(input, {
      target: { value: "ddf/fdds/sddd 10:30 AM" },
    });
    fireEvent.change(input, {
      target: { value: "31042026" },
    });

    expect(input).toHaveValue("12/05/2026 10:30 AM");
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("does not leave rejected continuous numeric input in the field", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time");

    await user.clear(input);
    await user.type(input, "2323222222");

    expect(input).toHaveValue("23/");
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: undefined,
      startTime: "10:30:00",
      endTime: "12:30:00",
    });
  });

  it("rejects invalid month, day, and time segments while typing", async () => {
    const user = userEvent.setup();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    const input = screen.getByLabelText("Date and time");

    await user.clear(input);
    await user.type(input, "1215");
    expect(input).toHaveValue("12/1");

    await user.clear(input);
    await user.type(input, "3104");
    expect(input).toHaveValue("31/0");

    await user.clear(input);
    await user.type(input, "1205202613");
    expect(input).toHaveValue("12/05/2026 1");

    await user.clear(input);
    await user.type(input, "1205202612");
    fireEvent.change(input, {
      target: { value: "12/05/2026 12:6" },
    });
    expect(input).toHaveValue("12/05/2026 12");
  });

  it("rejects pasted overlong invalid numeric input", async () => {
    const user = userEvent.setup();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    const input = screen.getByLabelText("Date and time");

    await user.clear(input);
    fireEvent.change(input, {
      target: { value: "120000666515151515151515215215151522" },
    });

    expect(input).toHaveValue("");
  });

  it("increments and decrements focused date and time segments with arrow keys", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByLabelText("Date and time") as HTMLInputElement;

    input.setSelectionRange(0, 2);
    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(input).toHaveValue("13/05/2026 10:30 AM");
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: new Date(2026, 4, 13),
      startTime: "10:30:00",
      endTime: "12:30:00",
    });

    input.setSelectionRange(14, 16);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(input).toHaveValue("13/05/2026 10:29 AM");
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: new Date(2026, 4, 13),
      startTime: "10:29:00",
      endTime: "12:30:00",
    });

    input.setSelectionRange(17, 19);
    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(input).toHaveValue("13/05/2026 10:29 PM");
    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: new Date(2026, 4, 13),
      startTime: "22:29:00",
      endTime: "12:30:00",
    });
  });

  it("navigates calendar months and years with dropdowns", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "5" },
    });
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toHaveValue("5");
    expect(screen.getByLabelText("Date and time")).toHaveValue("12/06/2026 10:30 AM");
    expect(screen.getByLabelText("June 12, 2026")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2027" },
    });
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Year")).toHaveValue("2027");
    expect(screen.getByLabelText("Date and time")).toHaveValue("12/06/2027 10:30 AM");
    expect(screen.getByLabelText("June 12, 2027")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("keeps the picker open when changing month and year", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "5" },
    });
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2027" },
    });
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
  });

  it("applies month and year changes to the calendar grid", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2027" },
    });

    expect(screen.getByLabelText("June 12, 2027")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("falls back to the first day when the target month cannot contain the selected date", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: new Date(2026, 0, 31),
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "1" },
    });

    expect(screen.getByLabelText("Date and time")).toHaveValue("01/02/2026 10:30 AM");
    expect(screen.getByLabelText("Month")).toHaveValue("1");
    expect(screen.getByLabelText("February 1, 2026")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("keeps the selected day in sync when navigating with arrow buttons", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
      />
    );

    fireEvent.click(screen.getByLabelText("Date and time"));
    fireEvent.click(screen.getByLabelText("Next month"));

    expect(screen.getByLabelText("Month")).toHaveValue("5");
    expect(screen.getByLabelText("Date and time")).toHaveValue("12/06/2026 10:30 AM");
    expect(screen.getByLabelText("June 12, 2026")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("closes the picker when clicking outside", async () => {
    render(
      <div>
        <DateTimePicker
          defaultValue={{
            date: mayTwelve,
            startTime: "10:30:00",
            endTime: "12:30:00",
          }}
        />
        <button type="button">Outside</button>
      </div>
    );

    const outsideButton = screen.getByText("Outside");

    fireEvent.click(screen.getByLabelText("Date and time"));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.mouseDown(outsideButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(
      <DateTimePicker className="custom-class" data-testid="date-time-picker" />
    );

    expect(screen.getByTestId("date-time-picker")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<DateTimePicker ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    render(
      <DateTimePicker data-testid="date-time-picker" aria-label="test label" />
    );

    expect(screen.getByTestId("date-time-picker")).toHaveAttribute(
      "aria-label",
      "test label"
    );
  });

  it("formats display helpers", () => {
    expect(formatTimeForDisplay("00:00:00")).toBe("12:00 AM");
    expect(formatTimeForDisplay("12:30:00")).toBe("12:30 PM");
    expect(formatDateForDisplay(mayTwelve, "23:05:00")).toBe(
      "12/05/2026 11:05 PM"
    );
  });
});
