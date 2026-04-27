import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DateRangeModal } from "../index";

describe("DateRangeModal", () => {
  it("mounts the floating calendar inside the dialog content for modal scroll locking", async () => {
    render(<DateRangeModal open onOpenChange={vi.fn()} onConfirm={vi.fn()} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("overflow-visible");

    const dateTriggers = screen.getAllByRole("button", {
      name: "MM/DD/YYYY",
    });
    fireEvent.click(dateTriggers[1]);

    await waitFor(() => {
      const calendar = screen.getByLabelText("End date calendar");
      expect(dialog).toContainElement(calendar);
      expect(calendar).toHaveClass("overflow-y-auto");
      expect(calendar).toHaveStyle({ position: "absolute", width: "288px" });
    });
  });
});
