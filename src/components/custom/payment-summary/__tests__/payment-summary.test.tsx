import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentSummary } from "../payment-summary";
import type { PaymentSummaryItem } from "../payment-summary";

const sampleItems: PaymentSummaryItem[] = [
  { label: "Pending Rental", value: "₹0.00" },
  { label: "Current Usage Charges", value: "₹163.98" },
  { label: "Prepaid Wallet Amount", value: "₹78,682.92", valueColor: "success" },
];

const sampleSummaryItems: PaymentSummaryItem[] = [
  {
    label: "Total amount due",
    value: "-₹78,518.94",
    valueColor: "error",
    valueSize: "lg",
    bold: true,
    tooltip: "Sum of all charges",
  },
  {
    label: "Credit limit",
    value: "₹10,000.00",
    tooltip: "Your current credit limit",
  },
];

describe("PaymentSummary", () => {
  it("renders all line items", () => {
    render(<PaymentSummary items={sampleItems} />);
    expect(screen.getByText("Pending Rental")).toBeInTheDocument();
    expect(screen.getByText("₹0.00")).toBeInTheDocument();
    expect(screen.getByText("Current Usage Charges")).toBeInTheDocument();
    expect(screen.getByText("₹163.98")).toBeInTheDocument();
    expect(screen.getByText("Prepaid Wallet Amount")).toBeInTheDocument();
    expect(screen.getByText("₹78,682.92")).toBeInTheDocument();
  });

  it("renders summary items below the divider", () => {
    render(
      <PaymentSummary items={sampleItems} summaryItems={sampleSummaryItems} />
    );
    expect(screen.getByText("Total amount due")).toBeInTheDocument();
    expect(screen.getByText("-₹78,518.94")).toBeInTheDocument();
    expect(screen.getByText("Credit limit")).toBeInTheDocument();
    expect(screen.getByText("₹10,000.00")).toBeInTheDocument();
  });

  it("applies success color to value", () => {
    render(<PaymentSummary items={sampleItems} />);
    const walletValue = screen.getByText("₹78,682.92");
    expect(walletValue).toHaveClass("text-semantic-success-primary");
  });

  it("applies error color to value", () => {
    render(
      <PaymentSummary items={sampleItems} summaryItems={sampleSummaryItems} />
    );
    const totalValue = screen.getByText("-₹78,518.94");
    expect(totalValue).toHaveClass("text-semantic-error-primary");
  });

  it("applies default color to value when no valueColor specified", () => {
    render(<PaymentSummary items={sampleItems} />);
    const pendingValue = screen.getByText("₹0.00");
    expect(pendingValue).toHaveClass("text-semantic-text-primary");
  });

  it("renders bold label with semibold weight and primary color", () => {
    render(
      <PaymentSummary items={[]} summaryItems={sampleSummaryItems} />
    );
    const totalLabel = screen.getByText("Total amount due");
    expect(totalLabel).toHaveClass("font-semibold");
    expect(totalLabel).toHaveClass("text-semantic-text-primary");
  });

  it("renders non-bold label with muted color", () => {
    render(<PaymentSummary items={sampleItems} />);
    const label = screen.getByText("Pending Rental");
    expect(label).toHaveClass("text-semantic-text-muted");
  });

  it("renders large value size with lg classes", () => {
    render(
      <PaymentSummary items={[]} summaryItems={sampleSummaryItems} />
    );
    const totalValue = screen.getByText("-₹78,518.94");
    expect(totalValue).toHaveClass("text-lg");
    expect(totalValue).toHaveClass("font-semibold");
  });

  it("renders default value size with sm class", () => {
    render(<PaymentSummary items={sampleItems} />);
    const value = screen.getByText("₹0.00");
    expect(value).toHaveClass("text-sm");
  });

  it("renders info icon for items with tooltip", () => {
    render(
      <PaymentSummary items={[]} summaryItems={sampleSummaryItems} />
    );
    expect(
      screen.getByLabelText("Info about Total amount due")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Info about Credit limit")
    ).toBeInTheDocument();
  });

  it("does not render info icon for items without tooltip", () => {
    render(<PaymentSummary items={sampleItems} />);
    expect(
      screen.queryByLabelText("Info about Pending Rental")
    ).not.toBeInTheDocument();
  });

  it("renders divider border when both items and summaryItems exist", () => {
    const { container } = render(
      <PaymentSummary items={sampleItems} summaryItems={sampleSummaryItems} />
    );
    const lineItemsSection = container.querySelector(
      ".border-b.border-semantic-border-layout"
    );
    expect(lineItemsSection).toBeInTheDocument();
  });

  it("does not render divider when summaryItems is absent", () => {
    const { container } = render(
      <PaymentSummary items={sampleItems} />
    );
    const lineItemsSection = container.querySelector(
      ".border-b.border-semantic-border-layout"
    );
    expect(lineItemsSection).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PaymentSummary items={sampleItems} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<PaymentSummary ref={ref} items={sampleItems} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders empty state when no items provided", () => {
    const { container } = render(<PaymentSummary items={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
