import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DateTimePicker,
  type DateTimePickerValue,
  formatDateForDisplay,
  formatTimeForDisplay,
} from "../../v2/date-time-picker";

const mayTwelve = new Date(2026, 4, 12);

describe("DateTimePicker", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it("renders the selected date and both start and end times", () => {
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

    expect(
      screen.getByPlaceholderText("--/--/---- --:-- --")
    ).toBeInTheDocument();
  });

  it("keeps read-only input interaction closed without requesting a popup", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DateTimePicker readOnly onOpenChange={onOpenChange} />);

    const input = screen.getByLabelText("Date and time");
    await user.click(input);

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it.each(["readOnly", "disabled"] as const)(
    "reports the actual closed popup when controlled open is suppressed by %s",
    (mode) => {
      render(<DateTimePicker open {...{ [mode]: true }} />);

      expect(screen.getByLabelText("Date and time")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  );

  it("renders the date-only placeholder when no date is selected", () => {
    render(<DateTimePicker variant="date-only" />);

    expect(screen.getByPlaceholderText("--/--/----")).toBeInTheDocument();
  });

  it("renders the placeholder across date-only and date-time when an empty value object is passed", () => {
    const { unmount } = render(
      <DateTimePicker variant="date-time" value={{}} />
    );
    expect(
      screen.getByPlaceholderText("--/--/---- --:-- --")
    ).toBeInTheDocument();
    unmount();

    render(<DateTimePicker variant="date-only" value={{}} />);
    expect(screen.getByPlaceholderText("--/--/----")).toBeInTheDocument();
  });

  it("renders the placeholder with seconds when showSeconds is true and no value is selected", () => {
    render(<DateTimePicker variant="date-time" showSeconds value={{}} />);

    expect(
      screen.getByPlaceholderText("--/--/---- --:--:-- --")
    ).toBeInTheDocument();
  });

  it("renders date with empty-time segment mask in date-time variant when time is unset", () => {
    render(<DateTimePicker variant="date-time" value={{ date: mayTwelve }} />);

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 --:-- --"
    );
  });

  it("renders date with seconds empty-time mask when showSeconds is true and time is unset", () => {
    render(
      <DateTimePicker
        variant="date-time"
        showSeconds
        value={{ date: mayTwelve }}
      />
    );

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 --:--:-- --"
    );
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

  it("toggles the custom time column picker when clicking the time field", () => {
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

    const startTimeField = screen.getByLabelText("Start Time");
    expect(startTimeField).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Start Time hours")).not.toBeInTheDocument();

    fireEvent.click(startTimeField);

    expect(startTimeField).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByLabelText("Start Time hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Time minutes")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Time meridiem")).toBeInTheDocument();

    fireEvent.click(startTimeField);

    expect(startTimeField).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Start Time hours")).not.toBeInTheDocument();
  });

  it("only opens one time column picker at a time", () => {
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
    fireEvent.click(screen.getByLabelText("Start Time"));
    expect(screen.getByLabelText("Start Time hours")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("End Time"));
    expect(screen.queryByLabelText("Start Time hours")).not.toBeInTheDocument();
    expect(screen.getByLabelText("End Time hours")).toBeInTheDocument();
  });

  it("uses the recorded v2 input-family trigger styling", () => {
    render(<DateTimePicker />);

    const trigger = screen.getByLabelText("Date and time").parentElement;

    expect(trigger).toHaveClass("h-11");
    expect(trigger).toHaveClass("rounded-lg");
    expect(trigger).toHaveClass("px-4");
    expect(trigger).toHaveClass("py-2");
    expect(trigger).toHaveClass("text-sm");
    expect(trigger).toHaveClass("border-v2-semantic-border-input");
    expect(trigger).toHaveClass("text-[var(--v2-text-placeholder,#707070)]");
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

  it("updates start and end time values from the column picker", () => {
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

    fireEvent.click(screen.getByLabelText("Start Time"));
    fireEvent.click(
      within(screen.getByLabelText("Start Time hours")).getByText("11")
    );
    fireEvent.click(
      within(screen.getByLabelText("Start Time minutes")).getByText("45")
    );

    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: mayTwelve,
      startTime: "11:45:00",
      endTime: "12:30:00",
    });

    fireEvent.click(screen.getByLabelText("End Time"));
    fireEvent.click(
      within(screen.getByLabelText("End Time meridiem")).getByText("AM")
    );

    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: mayTwelve,
      startTime: "11:45:00",
      endTime: "00:30:00",
    });
  });

  it("auto-shows seconds when the selected value includes them", () => {
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:15",
          endTime: "12:30:45",
        }}
      />
    );

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 10:30:15 AM"
    );

    fireEvent.click(screen.getByLabelText("Date and time"));

    expect(screen.getByLabelText("Start Time")).toHaveTextContent(
      "10:30:15 AM"
    );
    expect(screen.getByLabelText("End Time")).toHaveTextContent("12:30:45 PM");

    fireEvent.click(screen.getByLabelText("Start Time"));
    expect(screen.getByLabelText("Start Time seconds")).toBeInTheDocument();
  });

  it("can hide seconds and normalizes time input changes to minute precision", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        showSeconds={false}
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:15",
          endTime: "12:30:45",
        }}
        onValueChange={handleValueChange}
      />
    );

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 10:30 AM"
    );

    fireEvent.click(screen.getByLabelText("Date and time"));

    expect(screen.getByLabelText("Start Time")).toHaveTextContent("10:30 AM");
    expect(screen.getByLabelText("End Time")).toHaveTextContent("12:30 PM");

    fireEvent.click(screen.getByLabelText("Start Time"));
    expect(
      screen.queryByLabelText("Start Time seconds")
    ).not.toBeInTheDocument();

    fireEvent.click(
      within(screen.getByLabelText("Start Time minutes")).getByText("45")
    );

    expect(handleValueChange).toHaveBeenLastCalledWith({
      date: mayTwelve,
      startTime: "10:45:00",
      endTime: "12:30:45",
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
      "border-v2-semantic-error-primary"
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

  it("allows typing date and start time with seconds into the input", () => {
    const handleValueChange = vi.fn();
    render(
      <DateTimePicker
        showSeconds
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleValueChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Date and time"), {
      target: { value: "15/06/2026 11:45:30 PM" },
    });

    expect(handleValueChange).toHaveBeenCalledWith({
      date: new Date(2026, 5, 15),
      startTime: "23:45:30",
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

    fireEvent.focus(input);
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
    fireEvent.click(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByLabelText("Jun", { selector: "button" }));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toHaveAttribute("data-value", "5");
    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/06/2026 10:30 AM"
    );
    expect(screen.getByLabelText("June 12, 2026")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.click(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByLabelText("2027", { selector: "button" }));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Year")).toHaveAttribute("data-value", "2027");
    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/06/2027 10:30 AM"
    );
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
    fireEvent.click(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByLabelText("Jun", { selector: "button" }));
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByLabelText("2027", { selector: "button" }));
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
    fireEvent.click(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByLabelText("Jun", { selector: "button" }));
    fireEvent.click(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByLabelText("2027", { selector: "button" }));

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
    fireEvent.click(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByLabelText("Feb", { selector: "button" }));

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "01/02/2026 10:30 AM"
    );
    expect(screen.getByLabelText("Month")).toHaveAttribute("data-value", "1");
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

    expect(screen.getByLabelText("Month")).toHaveAttribute("data-value", "5");
    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/06/2026 10:30 AM"
    );
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

  it("renders a label associated with the trigger", () => {
    render(<DateTimePicker id="event-date" label="Event date" />);

    const label = screen.getByText("Event date");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveClass(
      "font-medium",
      "text-[var(--v2-text-primary,#484848)]"
    );
    expect(label).toHaveAttribute("for", "event-date");
  });

  it("shows a required asterisk when required", () => {
    render(<DateTimePicker label="Event date" required />);

    const asterisk = screen.getByText("*");
    expect(asterisk).toHaveClass("text-v2-semantic-error-primary");
  });

  it("does not render a label when none is provided", () => {
    render(<DateTimePicker data-testid="no-label" />);

    expect(screen.getByTestId("no-label").querySelector("label")).toBeNull();
  });

  it("shows only the date until a time is explicitly selected", () => {
    render(<DateTimePicker defaultValue={{ date: mayTwelve }} />);

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 --:-- --"
    );
  });

  it("shows only the time until a date is explicitly selected", () => {
    render(<DateTimePicker defaultValue={{ startTime: "10:30:00" }} />);

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "--/--/---- 10:30 AM"
    );
  });

  it("clears date and both times, then hides the clear action", () => {
    const handleChange = vi.fn();

    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));

    expect(handleChange).toHaveBeenCalledWith({
      date: undefined,
      startTime: "",
      endTime: "",
    });
    expect(screen.getByLabelText("Date and time")).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: "Clear date" })
    ).not.toBeInTheDocument();
  });

  it("hides the clear action after clearing a controlled value", () => {
    function ControlledPicker() {
      const [value, setValue] = React.useState<DateTimePickerValue>({
        date: mayTwelve,
        startTime: "10:30:00",
        endTime: "12:30:00",
      });

      return <DateTimePicker value={value} onValueChange={setValue} />;
    }

    render(<ControlledPicker />);

    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));

    expect(screen.getByLabelText("Date and time")).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: "Clear date" })
    ).not.toBeInTheDocument();
  });

  it("clears every field from the time-only variant", () => {
    const handleChange = vi.fn();

    render(
      <DateTimePicker
        variant="time-only"
        defaultValue={{ date: mayTwelve, startTime: "10:30:00" }}
        onValueChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));

    expect(handleChange).toHaveBeenCalledWith({
      date: undefined,
      startTime: "",
      endTime: "",
    });
  });

  it("does not fabricate a time in the hidden form value", () => {
    const { container } = render(
      <DateTimePicker name="slot" defaultValue={{ date: mayTwelve }} />
    );

    expect(
      container.querySelector<HTMLInputElement>('input[name="slot"]')?.value
    ).toBe("2026-05-12");
  });

  it("clears a value that was picked from the calendar and typed into the input", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 8, 1));
    const user = userEvent.setup();

    render(<DateTimePicker />);

    const input = screen.getByLabelText("Date and time");
    await user.click(input);
    await user.click(screen.getByLabelText("September 12, 2026"));
    expect(input).toHaveValue("12/09/2026 --:-- --");

    await user.click(screen.getByRole("button", { name: "Clear date" }));

    expect(input).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: "Clear date" })
    ).not.toBeInTheDocument();
  });

  it("resets the time columns to 12:00 AM after clearing", async () => {
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

    await user.click(screen.getByLabelText("Date and time"));
    expect(screen.getByLabelText("Start Time")).toHaveTextContent("10:30 AM");

    await user.click(screen.getByRole("button", { name: "Clear date" }));

    expect(screen.getByLabelText("Start Time")).toHaveTextContent("12:00 AM");
    expect(screen.getByLabelText("End Time")).toHaveTextContent("12:00 AM");
  });

  it("clears typed text that never parsed into a value", async () => {
    const user = userEvent.setup();

    render(<DateTimePicker />);

    const input = screen.getByLabelText("Date and time");
    await user.click(input);
    await user.type(input, "12");
    expect(input).toHaveValue("12/");

    await user.click(screen.getByRole("button", { name: "Clear date" }));

    expect(input).toHaveValue("");
  });

  it("renders helper text below the picker and links it to the input", () => {
    render(<DateTimePicker helperText="Pick a slot in business hours" />);

    const helper = screen.getByText("Pick a slot in business hours");

    expect(helper).toHaveClass("text-[var(--v2-text-muted,#707070)]");
    expect(screen.getByLabelText("Date and time")).toHaveAttribute(
      "aria-describedby",
      helper.id
    );
    expect(screen.getByLabelText("Date and time")).not.toHaveAttribute(
      "aria-invalid"
    );
  });

  it("renders an error message, marks the field invalid and styles the trigger", () => {
    render(<DateTimePicker error="Select a date" />);

    const message = screen.getByRole("alert");
    const input = screen.getByLabelText("Date and time");

    expect(message).toHaveTextContent("Select a date");
    expect(message).toHaveClass("text-v2-semantic-error-text");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", message.id);
    expect(input.parentElement).toHaveClass("border-v2-semantic-error-primary");
  });

  it("prefers the error message over helper text", () => {
    render(<DateTimePicker helperText="Helper copy" error="Select a date" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Select a date");
    expect(screen.queryByText("Helper copy")).not.toBeInTheDocument();
  });

  it("formats display helpers", () => {
    expect(formatTimeForDisplay("00:00:00")).toBe("12:00 AM");
    expect(formatTimeForDisplay("00:00:05", true)).toBe("12:00:05 AM");
    expect(formatTimeForDisplay("12:30:00")).toBe("12:30 PM");
    expect(formatDateForDisplay(mayTwelve, "23:05:00")).toBe(
      "12/05/2026 11:05 PM"
    );
    expect(formatDateForDisplay(mayTwelve, "23:05:07", true)).toBe(
      "12/05/2026 11:05:07 PM"
    );
  });
});

// ---------------------------------------------------------------------------
// Calendar + time list refresh. jsdom has no layout, so geometry is asserted
// through classes and, for the centring maths, a stubbed layout.
// ---------------------------------------------------------------------------
describe("DateTimePicker calendar and time list refresh", () => {
  const may = (day: number) => new Date(2026, 4, day);
  const dayLabel = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const day = (date: Date) => screen.getByLabelText(dayLabel(date));
  const dialog = () => screen.getByRole("dialog", { hidden: true });
  // The last 7-column grid is the day grid (the first is the weekday header).
  const dayGrid = () =>
    Array.from(
      dialog().querySelectorAll<HTMLElement>(".grid-cols-7")
    ).pop() as HTMLElement;
  const classTokens = (element: Element) =>
    (element.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
  const defaultValue = {
    date: may(12),
    startTime: "10:30:00",
    endTime: "12:30:00",
  };
  const renderOpen = (
    props: Partial<React.ComponentProps<typeof DateTimePicker>> = {}
  ) =>
    render(
      <DateTimePicker defaultOpen defaultValue={defaultValue} {...props} />
    );
  const option = (list: string, label: string) =>
    within(screen.getByLabelText(list)).getByText(label);

  describe("calendar", () => {
    it("marks today with a 4px dot under the number (it follows the number colour) and no ring, keeping aria-current", () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(may(20));
      render(<DateTimePicker defaultOpen defaultValue={{ date: may(12) }} />);

      const today = day(may(20));
      expect(today).toHaveAttribute("aria-current", "date");
      expect(today.className).not.toContain("ring-");
      const dot = today.querySelector("span span");
      expect(dot).toHaveClass(
        "size-1",
        "rounded-full",
        "bg-current",
        "top-[calc(100%+4px)]"
      );
      // The selected day is filled by the disc layer (its number turns inverse) and shows no dot unless it is today.
      expect(day(may(12))).toHaveClass("text-v2-semantic-text-inverted");
      expect(day(may(12)).querySelector("span span")).toBeNull();
      const disc = dialog().querySelector(
        'span[aria-hidden="true"].bg-v2-semantic-primary'
      );
      expect(disc).toHaveStyle({ opacity: "1" });
    });

    it("glides the selected disc between days", () => {
      const { rerender } = render(
        <DateTimePicker defaultOpen value={{ date: may(12) }} />
      );
      const disc = () =>
        dialog().querySelector(
          'span[aria-hidden="true"].bg-v2-semantic-primary'
        ) as HTMLElement;
      const before = disc().style.transform;
      expect(disc().className).toContain("[--arc-morph:linear(");
      expect(disc().className).toContain(
        "[transition:transform_506ms_var(--arc-morph)"
      );
      rerender(<DateTimePicker defaultOpen value={{ date: may(13) }} />);
      expect(disc().style.transform).not.toBe(before);
    });

    it("sizes day cells as squares of the column width (Arc) with a 14px number and a .94 press", () => {
      renderOpen();

      expect(day(may(20))).toHaveClass(
        "aspect-square",
        "w-full",
        "text-sm",
        "enabled:active:scale-[0.94]",
        "motion-reduce:enabled:active:scale-100"
      );
    });

    it("gates every hover utility behind (hover: hover) so touch never sticks", () => {
      renderOpen();

      const ungated = Array.from(dialog().querySelectorAll("*")).flatMap(
        (element) =>
          classTokens(element).filter((token) => token.startsWith("hover:"))
      );

      expect(ungated).toEqual([]);
      expect(day(may(20))).toHaveClass(
        "[@media(hover:hover)]:hover:bg-v2-semantic-bg-hover"
      );
    });

    it("gates the clear and calendar icon buttons too, and keeps their labels", () => {
      renderOpen();

      for (const name of ["Clear date", "Open calendar"]) {
        const button = screen.getByLabelText(name);
        expect(
          classTokens(button).filter((token) => token.startsWith("hover:"))
        ).toEqual([]);
        expect(button).toHaveClass(
          "[@media(hover:hover)]:hover:bg-v2-semantic-bg-hover"
        );
      }
    });

    it("shows a keyboard focus ring on days, arrows and the month/year pills", () => {
      renderOpen();
      const ring = [
        "focus-visible:outline",
        "focus-visible:[outline-width:2px]",
        "focus-visible:outline-offset-1",
        "focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
      ];

      expect(day(may(20))).toHaveClass(...ring, "focus-visible:z-10");
      expect(screen.getByLabelText("Previous month")).toHaveClass(...ring);
      expect(screen.getByLabelText("Next month")).toHaveClass(...ring);
      expect(screen.getByLabelText("Month")).toHaveClass(...ring);
      expect(screen.getByLabelText("Year")).toHaveClass(...ring);
    });

    it("sizes the arrows like the range picker: 32px, 36px on small screens", () => {
      renderOpen();

      for (const name of ["Previous month", "Next month"]) {
        const button = screen.getByLabelText(name);
        expect(button).toHaveClass("size-8", "max-sm:size-9", "rounded-lg");
        expect(button.querySelector("svg")).toHaveClass("size-4");
      }
    });

    it("gives the month and year pills one height and a chevron that turns while open", () => {
      renderOpen();

      for (const name of ["Month", "Year"]) {
        const pill = screen.getByLabelText(name);
        expect(pill).toHaveClass("h-8", "rounded-lg");
        expect(pill.querySelector("svg")).toHaveClass(
          "transition-transform",
          "motion-reduce:transition-none"
        );
        expect(pill.querySelector("svg")).not.toHaveClass("rotate-180");
      }

      fireEvent.click(screen.getByLabelText("Month"));

      expect(screen.getByLabelText("Month")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
      expect(screen.getByLabelText("Month").querySelector("svg")).toHaveClass(
        "rotate-180"
      );
      expect(
        screen.getByLabelText("Year").querySelector("svg")
      ).not.toHaveClass("rotate-180");
    });

    it("renders two-letter weekday labels (Arc) without uppercase styling", () => {
      renderOpen();

      const label = screen.getByText("Su");
      expect(label).not.toHaveClass("uppercase");
      expect(label).toHaveClass("h-6", "text-xs", "font-medium");
      expect(label.parentElement).not.toBe(dayGrid());
    });

    it("announces month changes through the existing screen-reader heading", () => {
      renderOpen();

      const heading = document.getElementById(
        dialog().getAttribute("aria-labelledby") ?? ""
      );
      expect(heading).toHaveTextContent("May 2026");
      expect(heading).toHaveAttribute("aria-live", "polite");
      expect(heading).toHaveClass("sr-only");
    });
  });

  describe("month change motion", () => {
    it("does not animate the month when the popover opens", () => {
      renderOpen();

      expect(dayGrid().className).not.toContain("animate-in");
      expect(dayGrid().className).not.toContain("slide-in-from");
    });

    it("slides the new month in from the right on Next and from the left on Previous", () => {
      renderOpen();
      const first = dayGrid();

      fireEvent.click(screen.getByLabelText("Next month"));
      expect(dayGrid()).not.toBe(first);
      expect(dayGrid()).toHaveClass(
        "motion-safe:animate-in",
        "motion-safe:fade-in-0",
        "motion-safe:slide-in-from-right-2",
        "motion-safe:[animation-duration:200ms]",
        "motion-reduce:animate-[v2-fade-in_120ms_ease-out]"
      );

      fireEvent.click(screen.getByLabelText("Previous month"));
      expect(dayGrid()).toHaveClass("motion-safe:slide-in-from-left-2");
      expect(dayGrid()).not.toHaveClass("motion-safe:slide-in-from-right-2");
    });

    it("keeps the weekday header static while the day grid re-mounts", () => {
      renderOpen();
      const weekdayRow = screen.getByText("Su").parentElement as HTMLElement;

      fireEvent.click(screen.getByLabelText("Next month"));

      expect(weekdayRow.isConnected).toBe(true);
      expect(weekdayRow.className).not.toContain("animate-in");
    });

    it("does not animate on reopen even when the last direction is still remembered", () => {
      renderOpen();

      fireEvent.click(screen.getByLabelText("Next month"));
      fireEvent.click(screen.getByLabelText("Previous month"));
      expect(dayGrid()).toHaveClass("motion-safe:slide-in-from-left-2");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(
        screen.queryByRole("dialog", { hidden: true })
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByLabelText("Open calendar"));

      expect(dialog()).toBeInTheDocument();
      expect(dayGrid().className).not.toContain("animate-in");
      expect(dayGrid().className).not.toContain("slide-in-from");
    });
  });

  describe("time columns", () => {
    const openStartTime = () => {
      fireEvent.click(screen.getByLabelText("Start Time"));
    };

    it("keeps every list's roles, labels and headers", () => {
      renderOpen();
      openStartTime();

      for (const name of [
        "Start Time hours",
        "Start Time minutes",
        "Start Time meridiem",
      ]) {
        expect(screen.getByLabelText(name)).toHaveAttribute("role", "listbox");
      }
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByText("Minutes")).toBeInTheDocument();
      expect(screen.getByText("AM/PM")).toBeInTheDocument();
      expect(option("Start Time hours", "10")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("uses flat neutral 36px rows without unused time-list padding", () => {
      renderOpen();
      openStartTime();
      const list = screen.getByLabelText("Start Time hours");

      // No artificial empty space before the first or after the last time option.
      expect(list).toHaveClass(
        "py-0",
        "overflow-y-auto",
        "[scroll-snap-type:y_proximity]"
      );
      expect(list.className).not.toContain("mask-image");
      expect(list).toHaveStyle({ maxHeight: "168px" });

      const row = option("Start Time hours", "09");
      expect(row).toHaveClass("h-9", "[scroll-snap-align:center]");
      // A neutral fill marks selection without outlined adjacent cells.
      expect(option("Start Time hours", "10")).toHaveClass(
        "bg-v2-semantic-bg-hover",
        "border-0",
        "font-medium"
      );
    });

    it("centres the selected row when a list opens", () => {
      const scrollTops = new Map<Element, number>();
      const originals = [
        "scrollTop",
        "offsetTop",
        "offsetHeight",
        "clientHeight",
      ].map(
        (name) =>
          [
            name,
            Object.getOwnPropertyDescriptor(Element.prototype, name) ??
              Object.getOwnPropertyDescriptor(HTMLElement.prototype, name),
          ] as const
      );
      Object.defineProperty(Element.prototype, "scrollTop", {
        configurable: true,
        get() {
          return scrollTops.get(this) ?? 0;
        },
        set(value: number) {
          scrollTops.set(this, value);
        },
      });
      // 32px rows in a 168px list; the selected row sits 300px from the top.
      Object.defineProperty(HTMLElement.prototype, "offsetTop", {
        configurable: true,
        get: () => 300,
      });
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get: () => 32,
      });
      Object.defineProperty(Element.prototype, "clientHeight", {
        configurable: true,
        get: () => 168,
      });

      try {
        renderOpen();
        openStartTime();

        // 300 - (168 - 32) / 2: the selected row's centre meets the list's.
        expect(scrollTops.get(screen.getByLabelText("Start Time hours"))).toBe(
          232
        );
        expect(
          scrollTops.get(screen.getByLabelText("Start Time minutes"))
        ).toBe(232);
      } finally {
        for (const [name, descriptor] of originals) {
          if (descriptor) {
            const target =
              name === "scrollTop" || name === "clientHeight"
                ? Element.prototype
                : HTMLElement.prototype;
            Object.defineProperty(target, name, descriptor);
          } else {
            delete (Element.prototype as unknown as Record<string, unknown>)[
              name
            ];
            delete (
              HTMLElement.prototype as unknown as Record<string, unknown>
            )[name];
          }
        }
      }
    });

    it("moves the selection with ArrowDown/ArrowUp inside a focused column", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderOpen({ onValueChange });
      openStartTime();

      option("Start Time hours", "10").focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "11:30:00" })
      );
      expect(option("Start Time hours", "11")).toHaveAttribute(
        "aria-selected",
        "true"
      );
      // Focus follows the selection so the next arrow continues from there.
      expect(option("Start Time hours", "11")).toHaveFocus();

      await user.keyboard("{ArrowUp}{ArrowUp}");

      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "09:30:00" })
      );
      expect(option("Start Time hours", "09")).toHaveFocus();
    });

    it("jumps with Home and End and stops at the ends", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderOpen({ onValueChange });
      openStartTime();

      option("Start Time hours", "10").focus();
      await user.keyboard("{Home}");
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "01:30:00" })
      );

      await user.keyboard("{ArrowUp}");
      // Already the first row: no wrap, no extra change.
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(option("Start Time hours", "01")).toHaveFocus();

      await user.keyboard("{End}");
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "00:30:00" })
      );
      expect(option("Start Time hours", "12")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("steps minutes by the configured step and AM/PM between its two rows", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderOpen({ onValueChange });
      openStartTime();

      option("Start Time minutes", "30").focus();
      await user.keyboard("{ArrowDown}");
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "10:35:00" })
      );

      option("Start Time meridiem", "AM").focus();
      await user.keyboard("{ArrowDown}");
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ startTime: "22:35:00" })
      );
    });

    it("leaves modified arrow keys alone and prevents scrolling for plain ones", () => {
      const onValueChange = vi.fn();
      renderOpen({ onValueChange });
      openStartTime();
      const row = option("Start Time hours", "10");
      row.focus();

      expect(fireEvent.keyDown(row, { key: "ArrowDown", shiftKey: true })).toBe(
        true
      );
      expect(fireEvent.keyDown(row, { key: "ArrowDown", metaKey: true })).toBe(
        true
      );
      expect(onValueChange).not.toHaveBeenCalled();
      // false = preventDefault was called: the list/popover must not scroll.
      expect(fireEvent.keyDown(row, { key: "ArrowDown" })).toBe(false);
    });

    it("does not change how the date input handles ArrowUp/ArrowDown", () => {
      const onValueChange = vi.fn();
      renderOpen({ onValueChange });
      const input = screen.getByLabelText("Date and time") as HTMLInputElement;

      input.setSelectionRange(0, 2);
      fireEvent.keyDown(input, { key: "ArrowUp" });

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ date: may(13) })
      );
    });

    it("keeps Tab order: every row stays a tabbable option button", () => {
      renderOpen();
      openStartTime();

      for (const row of within(
        screen.getByLabelText("Start Time hours")
      ).getAllByRole("option", { hidden: true })) {
        expect(row.tagName).toBe("BUTTON");
        expect(row).not.toHaveAttribute("tabindex");
      }
    });
  });
});

describe("DateTimePicker keyboard grid", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  const may = (day: number) => new Date(2026, 4, day);
  const labelFor = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const day = (date: Date) => screen.getByLabelText(labelFor(date));
  const renderOpen = (
    props: Partial<React.ComponentProps<typeof DateTimePicker>> = {}
  ) => {
    const onValueChange = vi.fn();
    const view = render(
      <DateTimePicker
        defaultOpen
        value={{ date: may(12), startTime: "10:30:00", endTime: "" }}
        onValueChange={onValueChange}
        {...props}
      />
    );
    return { ...view, onValueChange };
  };

  it("exposes the month as a labelled grid with weekday headers, rows and gridcells", () => {
    renderOpen();
    const grid = screen.getByRole("grid", { hidden: true });

    expect(grid).toHaveAttribute("aria-label", "May 2026");
    expect(
      within(grid).getAllByRole("columnheader", { hidden: true })
    ).toHaveLength(7);
    // The weekday row plus six week rows.
    expect(within(grid).getAllByRole("row", { hidden: true })).toHaveLength(7);
    expect(
      within(grid).getAllByRole("gridcell", { hidden: true })
    ).toHaveLength(42);
  });

  it("has a single tab stop in the grid: the selected day", () => {
    renderOpen();
    const stops = screen
      .getAllByRole("button", { hidden: true })
      .filter(
        (button) => button.hasAttribute("data-date") && button.tabIndex === 0
      );

    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAttribute("aria-label", labelFor(may(12)));
  });

  it("moves focus with the arrow keys, Home and End without changing the value", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderOpen();
    day(may(12)).focus();

    await user.keyboard("{ArrowRight}");
    expect(day(may(13))).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(day(may(20))).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowUp}");
    expect(day(may(12))).toHaveFocus();
    // 12 May 2026 is a Tuesday: the Sunday-first week runs 10 to 16.
    await user.keyboard("{Home}");
    expect(day(may(10))).toHaveFocus();
    await user.keyboard("{End}");
    expect(day(may(16))).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("follows weekStartsOn for Home and End", async () => {
    const user = userEvent.setup();
    renderOpen({ weekStartsOn: 1 });
    day(may(12)).focus();

    await user.keyboard("{Home}");
    expect(day(may(11))).toHaveFocus();
    await user.keyboard("{End}");
    expect(day(may(17))).toHaveFocus();
  });

  it("pages the month when the keyboard leaves it, and PageUp/PageDown step a month (Shift a year)", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderOpen();
    day(may(31)).focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("grid", { hidden: true })).toHaveAttribute(
      "aria-label",
      "June 2026"
    );
    expect(day(new Date(2026, 5, 1))).toHaveFocus();

    await user.keyboard("{PageUp}");
    expect(day(may(1))).toHaveFocus();
    await user.keyboard("{Shift>}{PageDown}{/Shift}");
    expect(screen.getByRole("grid", { hidden: true })).toHaveAttribute(
      "aria-label",
      "May 2027"
    );
    expect(day(new Date(2027, 4, 1))).toHaveFocus();
    // Paging with the keyboard never moves the selection.
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not move onto a disabled day", async () => {
    const user = userEvent.setup();
    renderOpen({ minDate: may(10) });
    day(may(10)).focus();

    await user.keyboard("{ArrowLeft}");
    expect(day(may(10))).toHaveFocus();
  });

  it("chooses the focused day with Enter", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderOpen();
    day(may(12)).focus();

    await user.keyboard("{ArrowRight}{ArrowRight}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ date: may(14) })
    );
  });

  it("moves focus into the grid with Alt+ArrowDown from the typed field", async () => {
    const user = userEvent.setup();
    renderOpen();
    const input = screen.getByLabelText("Date and time");
    input.focus();

    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    await waitFor(() => expect(day(may(12))).toHaveFocus());
  });

  it("hands focus to the grid when the calendar button is used from the keyboard, without closing it", async () => {
    const user = userEvent.setup();
    renderOpen();
    const button = screen.getByLabelText("Open calendar");
    button.focus();

    await user.keyboard("{Enter}");
    await waitFor(() => expect(day(may(12))).toHaveFocus());
    expect(screen.getByLabelText("Date and time")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("still toggles with a pointer click on the calendar button", () => {
    renderOpen();
    expect(screen.getByLabelText("Date and time")).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.click(screen.getByLabelText("Open calendar"));
    expect(screen.getByLabelText("Date and time")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("returns focus to the calendar button on Escape", async () => {
    const user = userEvent.setup();
    renderOpen();
    const button = screen.getByLabelText("Open calendar");
    day(may(12)).focus();

    await user.keyboard("{Escape}");
    expect(button).toHaveFocus();
  });

  it("sends Shift+Tab from the first control back to the calendar button", async () => {
    const user = userEvent.setup();
    renderOpen();
    const button = screen.getByLabelText("Open calendar");
    screen.getByLabelText("Previous month").focus();

    await user.tab({ shift: true });
    expect(button).toHaveFocus();
  });
});

describe("DateTimePicker week start, locale and Today", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  const may = (day: number) => new Date(2026, 4, day);
  const renderOpen = (
    props: Partial<React.ComponentProps<typeof DateTimePicker>> = {}
  ) =>
    render(
      <DateTimePicker
        defaultOpen
        value={{ date: may(12), startTime: "10:30:00", endTime: "" }}
        {...props}
      />
    );

  it("starts the week on Monday when asked", () => {
    renderOpen({ weekStartsOn: 1 });
    const headers = screen
      .getAllByRole("columnheader", { hidden: true })
      .map((header) => header.textContent);

    expect(headers).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
    // 1 May 2026 is a Friday: the first row begins on Monday 27 April.
    expect(
      screen.getAllByRole("gridcell", { hidden: true })[0]
    ).toHaveTextContent("27");
  });

  it("uses the locale for month names and day labels", () => {
    renderOpen({ locale: "de-DE" });

    expect(screen.getByRole("grid", { hidden: true })).toHaveAttribute(
      "aria-label",
      "Mai 2026"
    );
    expect(screen.getByLabelText("12. Mai 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toHaveTextContent("Mai");
  });

  it("offers a Today link only when today's month is off screen, and it does not change the value", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 4, 20));
    const onValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultOpen
        value={{ date: new Date(2026, 11, 12), startTime: "", endTime: "" }}
        onValueChange={onValueChange}
      />
    );
    const link = screen.getByText("Today");
    const row = link.closest("[aria-hidden]") as HTMLElement;

    expect(screen.getByRole("grid", { hidden: true })).toHaveAttribute(
      "aria-label",
      "December 2026"
    );
    expect(row).toHaveAttribute("aria-hidden", "false");
    expect(link).toHaveAttribute("tabindex", "0");

    fireEvent.click(link);
    expect(screen.getByRole("grid", { hidden: true })).toHaveAttribute(
      "aria-label",
      "May 2026"
    );
    expect(row).toHaveAttribute("aria-hidden", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("DateTimePicker compact panel", () => {
  it("opens a 288px panel with 12px padding and 2px gaps, so day cells are 36px", () => {
    render(
      <DateTimePicker
        defaultOpen
        value={{ date: mayTwelve, startTime: "10:30:00", endTime: "" }}
      />
    );
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    // Falls back to 288px until floating-ui has measured the trigger.
    expect(panel.style.width).toContain("min(288px");
    const grid = screen.getByRole("grid", { hidden: true });
    expect(grid.parentElement).toHaveClass("p-3");
    const days = grid.querySelector('[role="rowgroup"]') as HTMLElement;
    expect(days).toHaveClass("grid-cols-7", "gap-0.5");
    expect(days).not.toHaveClass("gap-1");
  });

  it("keeps the selected disc one cell wide and stepped by the 2px gap", () => {
    render(
      <DateTimePicker
        defaultOpen
        value={{ date: mayTwelve, startTime: "10:30:00", endTime: "" }}
      />
    );
    const days = screen
      .getByRole("grid", { hidden: true })
      .querySelector('[role="rowgroup"]') as HTMLElement;
    const disc = days.firstElementChild as HTMLElement;
    expect(disc).toHaveClass("aspect-square", "w-[calc((100%-12px)/7)]");
    // May 12 2026 is the third row's Tuesday: column 2, row 2 (Sunday start, May 1 is a Friday).
    expect(disc.style.transform).toContain("(100% + 2px)");
    expect(disc.style.transform).not.toContain("4px");
  });
});

describe("DateTimePicker rolling time", () => {
  const open = (showSeconds = false) => {
    render(
      <DateTimePicker
        defaultOpen
        showSeconds={showSeconds}
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "",
        }}
      />
    );
    return screen.getByLabelText("Start Time");
  };
  const wheels = (field: HTMLElement) =>
    Array.from(field.querySelectorAll("[data-rolling-time] > span")).filter(
      (node) => node.querySelectorAll("span[style]").length === 10
    );
  const visibleDigit = (column: Element) =>
    Array.from(column.querySelectorAll<HTMLElement>("span[style]")).find(
      (node) =>
        node.style.visibility === "visible" && Number(node.style.opacity) > 0.9
    )?.textContent;

  it("keeps the time as text for assistive tech and draws wheels for the eye", () => {
    const field = open();
    expect(field).toHaveTextContent("10:30 AM");
    expect(within(field).getByText("10:30 AM")).toHaveClass("sr-only");
    const rolling = field.querySelector("[data-rolling-time]") as HTMLElement;
    expect(rolling).toHaveAttribute("aria-hidden", "true");
    expect(wheels(field)).toHaveLength(4);
    expect(wheels(field).map(visibleDigit)).toEqual(["1", "0", "3", "0"]);
    expect(rolling).toHaveTextContent(":");
    expect(rolling.lastElementChild).toHaveTextContent("AM");
  });

  it("draws a wheel for the seconds too", () => {
    const field = open(true);
    expect(wheels(field)).toHaveLength(6);
    expect(field).toHaveTextContent("10:30:00 AM");
  });

  it("turns the wheels when another hour is picked", async () => {
    const user = userEvent.setup();
    const field = open();
    await user.click(field);
    const hours = screen.getByLabelText("Start Time hours");
    await user.click(within(hours).getByRole("option", { name: "05" }));
    expect(within(field).getByText("05:30 AM")).toBeInTheDocument();
    await waitFor(
      () =>
        expect(wheels(field).map(visibleDigit)).toEqual(["0", "5", "3", "0"]),
      { timeout: 2000 }
    );
  });

  it("swaps AM for PM as a word", async () => {
    const user = userEvent.setup();
    const field = open();
    await user.click(field);
    const meridiem = screen.getByLabelText("Start Time meridiem");
    await user.click(within(meridiem).getByRole("option", { name: "PM" }));
    expect(within(field).getByText("10:30 PM")).toBeInTheDocument();
    await waitFor(
      () => {
        const rolling = field.querySelector(
          "[data-rolling-time]"
        ) as HTMLElement;
        expect(rolling.lastElementChild).toHaveTextContent("PM");
        expect(rolling.lastElementChild).not.toHaveTextContent("AM");
      },
      { timeout: 2000 }
    );
  });

  it("does not roll anything when the time is unchanged", () => {
    const field = open();
    const before = wheels(field).map(visibleDigit);
    expect(wheels(field).map(visibleDigit)).toEqual(before);
  });
});

describe("DateTimePicker issue-document regressions", () => {
  it("opens time-only columns directly and keeps selection, steps, Escape and form values working", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <DateTimePicker
        variant="time-only"
        name="reminder"
        showEndTime={false}
        minuteStep={15}
        defaultValue={{ startTime: "10:30:00" }}
        onValueChange={onValueChange}
      />
    );
    const trigger = screen.getByRole("button", { name: "Open time picker" });
    fireEvent.click(trigger);
    expect(
      screen.queryByRole("button", { name: "Start Time", exact: true })
    ).not.toBeInTheDocument();
    const hours = screen.getByLabelText("Start Time hours");
    const minutes = screen.getByLabelText("Start Time minutes");
    expect(
      within(minutes).getAllByRole("option", { hidden: true })
    ).toHaveLength(4);
    fireEvent.click(within(hours).getByText("11", { exact: true }));
    expect(onValueChange).toHaveBeenLastCalledWith({
      date: undefined,
      startTime: "11:30:00",
      endTime: "",
    });
    expect(container.querySelector('input[name="reminder"]')).toHaveValue(
      "11:30:00"
    );
    const fortyFive = within(minutes).getByText("45", { exact: true });
    fortyFive.focus();
    fireEvent.keyDown(fortyFive, { key: "Home" });
    expect(onValueChange).toHaveBeenLastCalledWith({
      date: undefined,
      startTime: "11:00:00",
      endTime: "",
    });
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("shows both time-only ranges directly without adding a second popup", () => {
    render(
      <DateTimePicker
        variant="time-only"
        showEndTime
        defaultOpen
        showSeconds
        defaultValue={{ startTime: "10:30:15", endTime: "12:30:45" }}
      />
    );
    expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(1);
    expect(screen.getByLabelText("Start Time seconds")).toBeInTheDocument();
    expect(screen.getByLabelText("End Time seconds")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "End Time", exact: true })
    ).not.toBeInTheDocument();
  });

  it("keeps an end-time selection when the existing typed start-time editor is used", () => {
    const onValueChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={{
          date: mayTwelve,
          startTime: "10:30:00",
          endTime: "12:30:00",
        }}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByLabelText("Date and time");
    expect(input).toHaveValue("12/05/2026 10:30 AM");
    expect(screen.getByLabelText("End Time: 12:30 PM")).toHaveTextContent(
      "– 12:30 PM"
    );
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "12/05/2026 11:45 AM" } });
    expect(onValueChange).toHaveBeenLastCalledWith({
      date: mayTwelve,
      startTime: "11:45:00",
      endTime: "12:30:00",
    });
    fireEvent.blur(input);
    expect(screen.getByLabelText("End Time: 12:30 PM")).toHaveTextContent(
      "– 12:30 PM"
    );
    expect(input).toHaveValue("12/05/2026 11:45 AM");
  });

  it("updates the visible end time from controlled props without changing the native serialization contract", () => {
    const { rerender, container } = render(
      <DateTimePicker
        name="call"
        value={{ date: mayTwelve, startTime: "10:30:00", endTime: "12:30:00" }}
      />
    );
    rerender(
      <DateTimePicker
        name="call"
        value={{ date: mayTwelve, startTime: "10:30:00", endTime: "13:45:00" }}
      />
    );
    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 10:30 AM"
    );
    expect(screen.getByLabelText("End Time: 01:45 PM")).toHaveTextContent(
      "– 01:45 PM"
    );
    expect(container.querySelector('input[name="call"]')).toHaveValue(
      "2026-05-12T10:30:00"
    );
    rerender(
      <DateTimePicker
        showEndTime={false}
        name="call"
        value={{ date: mayTwelve, startTime: "10:30:00", endTime: "13:45:00" }}
      />
    );
    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "12/05/2026 10:30 AM"
    );
    expect(
      screen.queryByLabelText("End Time: 01:45 PM")
    ).not.toBeInTheDocument();
  });
});
