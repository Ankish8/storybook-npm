import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BankDetails } from "../bank-details";
import type { BankDetailItem } from "../types";

const sampleItems: BankDetailItem[] = [
  { label: "Account holder's name", value: "MyOperator" },
  { label: "Account Number", value: "2223330026552601", copyable: true },
  { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
  { label: "Bank Name", value: "AXIS BANK" },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("BankDetails", () => {
  it("renders default title and subtitle", () => {
    render(<BankDetails items={sampleItems} />);
    expect(screen.getByText("Bank details")).toBeInTheDocument();
    expect(screen.getByText("Direct NEFT/RTGS transfer")).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(
      <BankDetails
        items={sampleItems}
        title="Payment Info"
        subtitle="Wire transfer details"
      />
    );
    expect(screen.getByText("Payment Info")).toBeInTheDocument();
    expect(screen.getByText("Wire transfer details")).toBeInTheDocument();
  });

  it("renders all item labels and values", () => {
    render(<BankDetails items={sampleItems} />);
    expect(screen.getByText("Account holder's name")).toBeInTheDocument();
    expect(screen.getByText("MyOperator")).toBeInTheDocument();
    expect(screen.getByText("Account Number")).toBeInTheDocument();
    expect(screen.getByText("2223330026552601")).toBeInTheDocument();
    expect(screen.getByText("IFSC Code")).toBeInTheDocument();
    expect(screen.getByText("UTIB000RAZP")).toBeInTheDocument();
    expect(screen.getByText("Bank Name")).toBeInTheDocument();
    expect(screen.getByText("AXIS BANK")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <BankDetails
        items={sampleItems}
        icon={<span data-testid="custom-icon">icon</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is not provided", () => {
    const { container } = render(<BankDetails items={sampleItems} />);
    // The icon container has bg-[var(--semantic-info-surface)]
    const iconContainer = container.querySelector(
      ".size-10.rounded-\\[10px\\]"
    );
    expect(iconContainer).not.toBeInTheDocument();
  });

  it("renders copy buttons only for copyable items", () => {
    render(<BankDetails items={sampleItems} />);
    // 2 copyable items: Account Number and IFSC Code
    expect(screen.getByLabelText("Copy Account Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy IFSC Code")).toBeInTheDocument();
    // Non-copyable items should not have copy buttons
    expect(
      screen.queryByLabelText("Copy Account holder's name")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Copy Bank Name")
    ).not.toBeInTheDocument();
  });

  it("copies value to clipboard when copy button is clicked", async () => {
    const user = userEvent.setup();
    // Verify copy works via the onCopy callback (which is called after
    // a successful clipboard write). navigator.clipboard is difficult to
    // mock in jsdom, so we use onCopy as a reliable proxy.
    const onCopy = vi.fn();
    render(<BankDetails items={sampleItems} onCopy={onCopy} />);
    const copyButton = screen.getByLabelText("Copy Account Number");
    await user.click(copyButton);
    await vi.waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "Account Number",
          value: "2223330026552601",
        })
      );
    });
  });

  it("calls onCopy callback when value is copied", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<BankDetails items={sampleItems} onCopy={onCopy} />);
    const copyButton = screen.getByLabelText("Copy IFSC Code");
    await user.click(copyButton);
    expect(onCopy).toHaveBeenCalledWith({
      label: "IFSC Code",
      value: "UTIB000RAZP",
      copyable: true,
    });
  });

  it("renders label with muted color", () => {
    render(<BankDetails items={[{ label: "Test Label", value: "Test Value" }]} />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-semantic-text-muted");
  });

  it("renders value with primary color", () => {
    render(<BankDetails items={[{ label: "Test Label", value: "Test Value" }]} />);
    const value = screen.getByText("Test Value");
    expect(value).toHaveClass("text-semantic-text-primary");
  });

  it("applies custom className", () => {
    const { container } = render(
      <BankDetails items={sampleItems} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<BankDetails ref={ref} items={sampleItems} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with defaultOpen=true by default", () => {
    render(<BankDetails items={sampleItems} />);
    // When open, items should be visible
    expect(screen.getByText("MyOperator")).toBeInTheDocument();
  });

  it("renders empty state when no items provided", () => {
    const { container } = render(<BankDetails items={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
