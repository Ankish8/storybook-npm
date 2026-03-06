import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanUpgradeModal } from "../plan-upgrade-modal";

describe("PlanUpgradeModal", () => {
  const setup = (props: Partial<React.ComponentProps<typeof PlanUpgradeModal>> = {}) => {
    const onOpenChange = vi.fn();
    render(<PlanUpgradeModal open onOpenChange={onOpenChange} {...props} />);
    return { onOpenChange };
  };

  it("renders title, description, options and next button", () => {
    setup();

    expect(
      screen.getByText("Plan upgrade, SUV ₹ 15,000.00/month")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select how you want to apply your new plan.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Current billing cycle" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upcoming billing cycle" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("selects first option by default and applies selected classes", () => {
    setup();

    const selected = screen.getByRole("button", { name: "Current billing cycle" });
    expect(selected).toHaveClass("border-semantic-border-input-focus");
    expect(selected).toHaveAttribute("aria-pressed", "true");
  });

  it("supports uncontrolled option selection", () => {
    setup();

    const current = screen.getByRole("button", { name: "Current billing cycle" });
    const upcoming = screen.getByRole("button", { name: "Upcoming billing cycle" });

    fireEvent.click(upcoming);

    expect(upcoming).toHaveClass("border-semantic-border-input-focus");
    expect(upcoming).toHaveAttribute("aria-pressed", "true");
    expect(current).toHaveAttribute("aria-pressed", "false");
  });

  it("supports controlled selection", () => {
    setup({ selectedOptionId: "upcoming-billing-cycle" });

    expect(
      screen.getByRole("button", { name: "Upcoming billing cycle" })
    ).toHaveClass("border-semantic-border-input-focus");
  });

  it("calls onOptionChange when an option is selected", () => {
    const onOptionChange = vi.fn();
    setup({ onOptionChange });

    fireEvent.click(screen.getByRole("button", { name: "Upcoming billing cycle" }));

    expect(onOptionChange).toHaveBeenCalledWith("upcoming-billing-cycle");
  });

  it("calls onNext with currently selected option id", () => {
    const onNext = vi.fn();
    setup({ onNext, selectedOptionId: "upcoming-billing-cycle" });

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(onNext).toHaveBeenCalledWith("upcoming-billing-cycle");
  });

  it("calls onClose and onOpenChange when close icon is clicked", () => {
    const onClose = vi.fn();
    const { onOpenChange } = setup({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close plan upgrade modal" }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies custom className and additional props", () => {
    setup({ className: "custom-modal-class", "data-testid": "upgrade-modal" });

    const modal = screen.getByTestId("upgrade-modal");
    expect(modal).toHaveClass("custom-modal-class");
  });

  it("forwards ref to the modal root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onOpenChange = vi.fn();

    render(<PlanUpgradeModal ref={ref} open onOpenChange={onOpenChange} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
