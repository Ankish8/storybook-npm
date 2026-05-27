import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

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

    expect(screen.getByRole("button")).toHaveTextContent("05/12/2026 10:30 AM");
  });

  it("renders the placeholder when no date is selected", () => {
    render(<DateTimePicker />);

    expect(
      screen.getByRole("button", { name: /--\/--\/---- --:--/ })
    ).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: /05\/12\/2026/i }));

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.getByText("May 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
    expect(screen.getByLabelText("End Time")).toBeInTheDocument();
  });

  it("uses DateRangeModal trigger styling", () => {
    render(<DateTimePicker />);

    const trigger = screen.getByRole("button", {
      name: /--\/--\/---- --:--/,
    });

    expect(trigger).toHaveClass("rounded-md");
    expect(trigger).toHaveClass("px-3");
    expect(trigger).toHaveClass("py-2");
    expect(trigger).toHaveClass("border-semantic-border-input");
    expect(trigger).toHaveClass("text-semantic-text-muted");
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

    fireEvent.click(screen.getByRole("button", { name: /05\/12\/2026/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /05\/12\/2026/i }));
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
    ["sm", "max-w-[360px]"],
    ["default", "max-w-none"],
    ["lg", "max-w-[640px]"],
  ] as const)("renders %s size", (size, expectedClass) => {
    render(<DateTimePicker size={size} data-testid="date-time-picker" />);

    expect(screen.getByTestId("date-time-picker")).toHaveClass(expectedClass);
  });

  it("applies error state styling to the trigger", () => {
    render(<DateTimePicker state="error" />);

    expect(screen.getByRole("button")).toHaveClass(
      "border-semantic-error-primary"
    );
  });

  it("supports controlled open state", () => {
    const handleOpenChange = vi.fn();

    render(<DateTimePicker open={false} onOpenChange={handleOpenChange} />);

    fireEvent.click(
      screen.getByRole("button", { name: /--\/--\/---- --:--/ })
    );

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

    fireEvent.click(screen.getByRole("button", { name: /05\/12\/2026/i }));

    expect(
      screen.getByLabelText("May 11, 2026")
    ).toBeDisabled();
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

    expect(screen.getByRole("button").querySelectorAll("svg")).toHaveLength(1);
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
      "05/12/2026 11:05 PM"
    );
  });
});
