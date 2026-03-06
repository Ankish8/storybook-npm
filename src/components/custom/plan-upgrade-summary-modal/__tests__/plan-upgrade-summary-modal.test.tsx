import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanUpgradeSummaryModal } from "../plan-upgrade-summary-modal";

describe("PlanUpgradeSummaryModal", () => {
  const setup = (
    props: Partial<React.ComponentProps<typeof PlanUpgradeSummaryModal>> = {}
  ) => {
    const onOpenChange = vi.fn();
    render(<PlanUpgradeSummaryModal open onOpenChange={onOpenChange} {...props} />);
    return { onOpenChange };
  };

  it("renders upgrade defaults with the warning summary state", () => {
    setup();

    expect(
      screen.getByText("Plan upgrade, SUV ₹ 15,000.00/month")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your request will be processed from the current billing cycle.")
    ).toBeInTheDocument();
    expect(screen.getByText("Payable Amount")).toBeInTheDocument();
    expect(
      screen.getByText("A payment of ₹ 59,437.44 is required to upgrade.")
    ).toBeInTheDocument();
    expect(screen.getByText("Difference in rental")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pay & Upgrade Plan" })).toBeInTheDocument();
  });

  it("renders downgrade defaults with the success summary state", () => {
    setup({ mode: "downgrade" });

    expect(
      screen.getByText("Plan downgrade, SUV ₹ 15,000.00/month")
    ).toBeInTheDocument();
    expect(screen.getByText("Adjustable Credit")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Downgrade Plan" })
    ).toBeInTheDocument();
    expect(screen.queryByText(/required to upgrade/i)).not.toBeInTheDocument();
  });

  it("renders custom rows, status and total value", () => {
    setup({
      status: {
        title: "Payable Amount",
        message: "A payment of ₹ 10,000.00 is required to continue.",
        tone: "warning",
      },
      rows: [
        { label: "Prepaid amount", value: "(₹ 1,000.00)" },
        { label: "Difference in rental", value: "₹ 9,000.00" },
      ],
      totalValue: "₹ 10,000.00",
    });

    expect(
      screen.getByText("A payment of ₹ 10,000.00 is required to continue.")
    ).toBeInTheDocument();
    expect(screen.getByText("(₹ 1,000.00)")).toBeInTheDocument();
    expect(screen.getByText("₹ 10,000.00")).toBeInTheDocument();
  });

  it("calls onPrimaryAction when the primary CTA is clicked", () => {
    const onPrimaryAction = vi.fn();
    setup({ onPrimaryAction });

    fireEvent.click(screen.getByRole("button", { name: "Pay & Upgrade Plan" }));

    expect(onPrimaryAction).toHaveBeenCalledOnce();
  });

  it("calls onCancel and closes when cancel is clicked", () => {
    const onCancel = vi.fn();
    const { onOpenChange } = setup({ onCancel });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onClose and closes when the close icon is clicked", () => {
    const onClose = vi.fn();
    const { onOpenChange } = setup({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close plan summary modal" }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies custom className and additional props", () => {
    setup({ className: "custom-modal-class", "data-testid": "summary-modal" });

    const modal = screen.getByTestId("summary-modal");
    expect(modal).toHaveClass("custom-modal-class");
    expect(modal).toHaveClass("bg-semantic-bg-primary");
  });

  it("forwards ref to the modal root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onOpenChange = vi.fn();

    render(<PlanUpgradeSummaryModal ref={ref} open onOpenChange={onOpenChange} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
