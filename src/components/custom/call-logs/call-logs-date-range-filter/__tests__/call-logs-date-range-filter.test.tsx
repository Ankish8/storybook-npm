import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { CallLogsDateRangeFilter } from "../call-logs-date-range-filter";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function dayLabelFor(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

describe("CallLogsDateRangeFilter", () => {
  it("renders the default placeholder", () => {
    render(<CallLogsDateRangeFilter />);
    expect(
      screen.getByRole("button", { name: "Date Range" })
    ).toBeInTheDocument();
  });

  it("disables tomorrow by default (future dates blocked)", () => {
    render(<CallLogsDateRangeFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    expect(screen.getByLabelText(dayLabelFor(tomorrow))).toBeDisabled();
  });

  it("does not disable today by default", () => {
    render(<CallLogsDateRangeFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    expect(screen.getByLabelText(dayLabelFor(today))).not.toBeDisabled();
  });

  it("lifts the future-date restriction when allowFutureDates is true", () => {
    render(<CallLogsDateRangeFilter allowFutureDates />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    expect(screen.getByLabelText(dayLabelFor(tomorrow))).not.toBeDisabled();
  });

  it("still applies disablePastDates alongside the future-date default", () => {
    render(<CallLogsDateRangeFilter disablePastDates />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );

    expect(screen.getByLabelText(dayLabelFor(yesterday))).toBeDisabled();
  });

  it("commits a selected range via preset", () => {
    const handleValueChange = vi.fn();
    render(<CallLogsDateRangeFilter onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    fireEvent.click(screen.getByText("Today"));

    expect(handleValueChange).toHaveBeenCalledWith({
      start: startOfToday,
      end: startOfToday,
    });
  });

  it("renders every default preset label when open", () => {
    render(<CallLogsDateRangeFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CallLogsDateRangeFilter ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges a custom className onto the root element", () => {
    render(
      <CallLogsDateRangeFilter
        className="custom-class"
        data-testid="call-logs-date-range-filter"
      />
    );

    expect(
      screen.getByTestId("call-logs-date-range-filter")
    ).toHaveClass("custom-class");
  });

  it("does not open the popover when disabled", () => {
    render(<CallLogsDateRangeFilter disabled />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    const { container } = render(<CallLogsDateRangeFilter />);
    assertNoBootstrapMarginBleed(container);
  });
});
