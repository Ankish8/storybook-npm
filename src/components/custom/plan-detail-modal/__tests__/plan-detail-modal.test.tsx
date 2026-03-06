import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanDetailModal } from "../plan-detail-modal";
import type { PlanFeature } from "../types";

describe("PlanDetailModal", () => {
  const setup = (props: Partial<React.ComponentProps<typeof PlanDetailModal>> = {}) => {
    const onOpenChange = vi.fn();
    render(<PlanDetailModal open onOpenChange={onOpenChange} {...props} />);
    return { onOpenChange };
  };

  it("renders title and default features when open", () => {
    setup();

    expect(screen.getByText("Plan detail")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Service")).toBeInTheDocument();
    expect(screen.getByText("Channel(s)")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    setup();

    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Rate")).toBeInTheDocument();
  });

  it("renders custom features", () => {
    const features: PlanFeature[] = [
      { name: "Custom Feature", free: "5 Units", rate: "₹ 10.00" },
      { name: "Another Feature", free: "0 Items", rate: "₹ 0" },
    ];
    setup({ features });

    expect(screen.getByText("Custom Feature")).toBeInTheDocument();
    expect(screen.getByText("5 Units")).toBeInTheDocument();
    expect(screen.getByText("₹ 10.00")).toBeInTheDocument();
    expect(screen.getByText("Another Feature")).toBeInTheDocument();
  });

  it("renders plan price in footer when provided", () => {
    setup({ planPrice: "₹ 2,500.00/month" });

    expect(screen.getByText("₹ 2,500.00/month")).toBeInTheDocument();
    expect(screen.getByText("Plan price")).toBeInTheDocument();
  });

  it("does not render footer when planPrice is not provided", () => {
    setup();

    expect(screen.queryByText("Plan price")).not.toBeInTheDocument();
  });

  it("renders custom title", () => {
    setup({ title: "My Custom Plan" });

    expect(screen.getByText("My Custom Plan")).toBeInTheDocument();
  });

  it("calls onOpenChange when close button is clicked", () => {
    const { onOpenChange } = setup();

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onClose callback when close button is clicked", () => {
    const onClose = vi.fn();
    setup({ onClose });

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("forwards ref to the inner div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PlanDetailModal open onOpenChange={vi.fn()} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <PlanDetailModal
        open
        onOpenChange={vi.fn()}
        className="custom-class"
        data-testid="plan-modal-inner"
      />
    );

    const inner = screen.getByTestId("plan-modal-inner");
    expect(inner).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    setup({ "data-testid": "plan-detail-modal", "aria-label": "Plan detail" } as Partial<React.ComponentProps<typeof PlanDetailModal>>);

    const el = screen.getByTestId("plan-detail-modal");
    expect(el).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const onOpenChange = vi.fn();
    render(<PlanDetailModal open={false} onOpenChange={onOpenChange} />);

    expect(screen.queryByText("Plan detail")).not.toBeInTheDocument();
  });
});
