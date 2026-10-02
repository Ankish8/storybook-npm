import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressIndicator } from "../../v2/progress-indicator";
describe("v2 ProgressIndicator", () => {
  it("exposes labelled progress and current value", () => {
    render(<ProgressIndicator value={30} aria-label="Import" />);
    expect(screen.getByRole("progressbar", { name: "Import" })).toHaveAttribute(
      "aria-valuenow",
      "30"
    );
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
  it("clamps out-of-range values", () => {
    const { rerender } = render(<ProgressIndicator value={110} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
    rerender(<ProgressIndicator value={-1} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });
  it("handles non-finite values", () => {
    render(<ProgressIndicator value={NaN} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });
  it("omits the determinate value while loading", () => {
    render(<ProgressIndicator indeterminate />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow"
    );
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });
  it("allows hidden visual labels while retaining accessible progress", () => {
    render(
      <ProgressIndicator value={50} labelPosition="none" variant="circle" />
    );
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });
});
