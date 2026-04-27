import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DateInput } from "../date-input";

function rect({
  top,
  right,
  bottom,
  left,
}: {
  top: number;
  right: number;
  bottom: number;
  left: number;
}): DOMRect {
  const width = right - left;
  const height = bottom - top;

  return {
    x: left,
    y: top,
    top,
    right,
    bottom,
    left,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("DateInput", () => {
  it("renders the calendar in a floating body portal", async () => {
    const { container } = render(
      <DateInput label="Start date" onChange={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: "MM/DD/YYYY" }));

    await waitFor(() => {
      const calendar = screen.getByLabelText("Start date calendar");
      expect(container).not.toContainElement(calendar);
      expect(document.body).toContainElement(calendar);
      expect(calendar).toHaveAttribute("data-date-range-calendar");
      expect(calendar).toHaveStyle({ position: "fixed", width: "288px" });
      expect(calendar).toHaveAttribute("data-date-range-calendar-scroll");
      expect(calendar).toHaveClass("overflow-y-auto");
      expect(calendar.style.maxHeight).toContain(
        "--date-range-calendar-scroll-height"
      );
    });
  });

  it("mounts inside a dialog portal while Floating UI positions it", async () => {
    const portalContainer = document.createElement("div");
    const originalInnerWidth = window.innerWidth;
    document.body.appendChild(portalContainer);

    try {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 720,
      });

      portalContainer.getBoundingClientRect = vi.fn(() => {
        const calendar = portalContainer.querySelector(
          '[aria-label="End date calendar"]'
        ) as HTMLElement | null;

        return rect({
          top: 100,
          right: 600,
          bottom: calendar?.style.position ? 500 : 900,
          left: 100,
        });
      });

      render(
        <DateInput
          label="End date"
          onChange={vi.fn()}
          portalContainer={portalContainer}
        />
      );

      const trigger = screen.getByRole("button", { name: "MM/DD/YYYY" });
      trigger.getBoundingClientRect = vi.fn(() =>
        rect({ top: 360, right: 560, bottom: 400, left: 220 })
      );

      fireEvent.click(trigger);

      await waitFor(() => {
        const calendar = screen.getByLabelText("End date calendar");

        expect(calendar).toBeInTheDocument();
        expect(portalContainer).toContainElement(calendar);
        expect(calendar).toHaveStyle({ position: "absolute", width: "288px" });
        expect(calendar).toHaveClass("overflow-y-auto");
        expect(calendar.style.maxHeight).toContain(
          "--date-range-calendar-scroll-height"
        );
      });
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: originalInnerWidth,
      });
      portalContainer.remove();
    }
  });
});
