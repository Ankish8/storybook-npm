import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WalletTopup } from "../wallet-topup";

describe("WalletTopup", () => {
  // ─── Rendering ───────────────────────────────────────────
  it("renders with default title and description", () => {
    render(<WalletTopup />);
    expect(screen.getByText("Instant wallet top-up")).toBeInTheDocument();
    expect(
      screen.getByText("Add funds to your account balance")
    ).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <WalletTopup title="Recharge Wallet" description="Top up your balance" />
    );
    expect(screen.getByText("Recharge Wallet")).toBeInTheDocument();
    expect(screen.getByText("Top up your balance")).toBeInTheDocument();
  });

  it("renders header icon when provided", () => {
    render(
      <WalletTopup icon={<span data-testid="header-icon">IC</span>} />
    );
    expect(screen.getByTestId("header-icon")).toBeInTheDocument();
  });

  it("renders preset amount options", () => {
    render(<WalletTopup amounts={[500, 1000, 5000, 10000]} />);
    expect(screen.getByText("₹500")).toBeInTheDocument();
    expect(screen.getByText("₹1,000")).toBeInTheDocument();
    expect(screen.getByText("₹5,000")).toBeInTheDocument();
    expect(screen.getByText("₹10,000")).toBeInTheDocument();
  });

  it("renders amount options with custom labels", () => {
    render(
      <WalletTopup
        amounts={[
          { value: 500, label: "Basic" },
          { value: 1000, label: "Standard" },
        ]}
      />
    );
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  it("renders custom amount input with label and placeholder", () => {
    render(<WalletTopup />);
    expect(screen.getByText("Custom Amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
  });

  it("renders voucher link by default", () => {
    render(<WalletTopup />);
    expect(
      screen.getByText("Have an offline code or voucher?")
    ).toBeInTheDocument();
  });

  it("hides voucher link when showVoucherLink is false", () => {
    render(<WalletTopup showVoucherLink={false} />);
    expect(
      screen.queryByText("Have an offline code or voucher?")
    ).not.toBeInTheDocument();
  });

  it("renders custom voucher link text", () => {
    render(<WalletTopup voucherLinkText="Apply promo code" />);
    expect(screen.getByText("Apply promo code")).toBeInTheDocument();
  });

  it("renders voucher icon when provided", () => {
    render(
      <WalletTopup
        voucherIcon={<span data-testid="voucher-icon">V</span>}
      />
    );
    expect(screen.getByTestId("voucher-icon")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    render(
      <WalletTopup amountSectionLabel="Choose Plan" customAmountLabel="Other" />
    );
    expect(screen.getByText("Choose Plan")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("renders with custom currency symbol", () => {
    render(<WalletTopup amounts={[100]} currencySymbol="$" />);
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  // ─── Amount Selection ────────────────────────────────────
  it("selects an amount when clicked", () => {
    const onAmountChange = vi.fn();
    render(
      <WalletTopup amounts={[500, 1000]} onAmountChange={onAmountChange} />
    );

    fireEvent.click(screen.getByText("₹500"));
    expect(onAmountChange).toHaveBeenCalledWith(500);
  });

  it("deselects amount when clicked again (uncontrolled)", () => {
    const onAmountChange = vi.fn();
    render(
      <WalletTopup
        amounts={[500, 1000]}
        defaultSelectedAmount={500}
        onAmountChange={onAmountChange}
      />
    );

    fireEvent.click(screen.getByText("₹500"));
    expect(onAmountChange).toHaveBeenCalledWith(null);
  });

  it("marks selected amount with aria-checked and primary text", () => {
    render(
      <WalletTopup amounts={[500, 1000]} defaultSelectedAmount={500} />
    );
    const selectedButton = screen.getByText("₹500").closest("button");
    expect(selectedButton).toHaveAttribute("aria-checked", "true");
  });

  it("marks unselected amounts as unchecked", () => {
    render(
      <WalletTopup amounts={[500, 1000]} defaultSelectedAmount={500} />
    );
    const unselectedButton = screen.getByText("₹1,000").closest("button");
    expect(unselectedButton).toHaveAttribute("aria-checked", "false");
  });

  // ─── Custom Amount ──────────────────────────────────────
  it("calls onCustomAmountChange when custom input changes", () => {
    const onCustomAmountChange = vi.fn();
    render(
      <WalletTopup onCustomAmountChange={onCustomAmountChange} />
    );

    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "750" } });
    expect(onCustomAmountChange).toHaveBeenCalledWith("750");
  });

  it("clears preset selection when custom amount is entered (uncontrolled)", () => {
    const onAmountChange = vi.fn();
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        onAmountChange={onAmountChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "999" } });
    // Should notify that preset is cleared
    expect(onAmountChange).toHaveBeenCalledWith(null);
  });

  // ─── Pay Button ─────────────────────────────────────────
  it("shows pay button with selected amount text", () => {
    render(
      <WalletTopup amounts={[500]} defaultSelectedAmount={500} />
    );
    expect(screen.getByText("Pay ₹500 now")).toBeInTheDocument();
  });

  it("shows fallback text when no amount is selected", () => {
    render(<WalletTopup amounts={[500, 1000]} />);
    expect(screen.getByText("Select an amount")).toBeInTheDocument();
  });

  it("shows custom CTA text when provided", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        ctaText="Confirm Payment"
      />
    );
    expect(screen.getByText("Confirm Payment")).toBeInTheDocument();
  });

  it("calls onPay with selected amount", () => {
    const onPay = vi.fn();
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        onPay={onPay}
      />
    );

    fireEvent.click(screen.getByText("Pay ₹500 now"));
    expect(onPay).toHaveBeenCalledWith(500);
  });

  it("disables pay button when no amount is selected", () => {
    render(<WalletTopup amounts={[500, 1000]} />);
    const button = screen.getByText("Select an amount");
    expect(button).toBeDisabled();
  });

  it("disables pay button when disabled prop is true", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        disabled={true}
      />
    );
    const button = screen.getByText("Pay ₹500 now");
    expect(button).toBeDisabled();
  });

  it("shows loading state on pay button", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        loading={true}
      />
    );
    // Loading button is disabled
    const button = screen.getByRole("button", { name: /pay ₹500 now/i });
    expect(button).toBeDisabled();
  });

  // ─── Voucher Link & Code Input ──────────────────────────
  it("calls onVoucherClick when voucher link is clicked", () => {
    const onVoucherClick = vi.fn();
    render(<WalletTopup onVoucherClick={onVoucherClick} />);

    fireEvent.click(
      screen.getByText("Have an offline code or voucher?")
    );
    expect(onVoucherClick).toHaveBeenCalledOnce();
  });

  it("shows voucher code input when voucher link is clicked", () => {
    render(<WalletTopup />);

    // Initially: voucher link visible, code input hidden
    expect(
      screen.getByText("Have an offline code or voucher?")
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("XXXX-XXXX-XXXX")).not.toBeInTheDocument();

    // Click voucher link
    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    // Now: voucher link hidden, code input visible
    expect(
      screen.queryByText("Have an offline code or voucher?")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Enter Offline Code")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX")).toBeInTheDocument();
  });

  it("shows Redeem voucher button in voucher mode", () => {
    render(<WalletTopup amounts={[500]} defaultSelectedAmount={500} />);

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    expect(screen.getByText("Redeem voucher")).toBeInTheDocument();
    // Pay button should be gone
    expect(screen.queryByText("Pay ₹500 now")).not.toBeInTheDocument();
  });

  it("returns to payment mode when Cancel is clicked", () => {
    render(<WalletTopup amounts={[500]} defaultSelectedAmount={500} />);

    // Enter voucher mode
    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    expect(screen.getByText("Redeem voucher")).toBeInTheDocument();

    // Click cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Back to payment mode
    expect(
      screen.getByText("Have an offline code or voucher?")
    ).toBeInTheDocument();
    expect(screen.getByText("Pay ₹500 now")).toBeInTheDocument();
    expect(screen.queryByText("Redeem voucher")).not.toBeInTheDocument();
  });

  it("clears voucher code when Cancel is clicked", () => {
    render(<WalletTopup />);

    // Enter voucher mode and type a code
    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");
    fireEvent.change(codeInput, { target: { value: "ABC-123" } });

    // Cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Re-open voucher mode — input should be empty
    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX")).toHaveValue("");
  });

  it("calls onVoucherCodeChange when code input changes", () => {
    const onVoucherCodeChange = vi.fn();
    render(<WalletTopup onVoucherCodeChange={onVoucherCodeChange} />);

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");
    fireEvent.change(codeInput, { target: { value: "CODE-1234" } });
    expect(onVoucherCodeChange).toHaveBeenCalledWith("CODE-1234");
  });

  it("calls onRedeem with voucher code when Redeem voucher is clicked", () => {
    const onRedeem = vi.fn();
    render(<WalletTopup onRedeem={onRedeem} />);

    // Enter voucher mode
    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    // Type a code
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");
    fireEvent.change(codeInput, { target: { value: "PROMO-2024" } });

    // Click redeem
    fireEvent.click(screen.getByText("Redeem voucher"));
    expect(onRedeem).toHaveBeenCalledWith("PROMO-2024");
  });

  it("disables Redeem voucher button when code is empty", () => {
    render(<WalletTopup />);

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    const redeemButton = screen.getByText("Redeem voucher");
    expect(redeemButton).toBeDisabled();
  });

  // ─── Voucher Code Validation ─────────────────────────────
  it("disables Redeem button when code does not match voucherCodePattern", () => {
    render(
      <WalletTopup
        voucherCodePattern={/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/}
      />
    );

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");

    // Invalid format
    fireEvent.change(codeInput, { target: { value: "abc" } });
    expect(screen.getByText("Redeem voucher")).toBeDisabled();
  });

  it("enables Redeem button when code matches voucherCodePattern", () => {
    render(
      <WalletTopup
        voucherCodePattern={/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/}
      />
    );

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");

    // Valid format
    fireEvent.change(codeInput, { target: { value: "ABCD-1234-EFGH" } });
    expect(screen.getByText("Redeem voucher")).not.toBeDisabled();
  });

  it("disables Redeem button when validateVoucherCode returns false", () => {
    const validator = (code: string) => code.length >= 10;
    render(<WalletTopup validateVoucherCode={validator} />);

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");

    fireEvent.change(codeInput, { target: { value: "short" } });
    expect(screen.getByText("Redeem voucher")).toBeDisabled();
  });

  it("enables Redeem button when validateVoucherCode returns true", () => {
    const validator = (code: string) => code.length >= 10;
    render(<WalletTopup validateVoucherCode={validator} />);

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");

    fireEvent.change(codeInput, { target: { value: "VALID-CODE-12" } });
    expect(screen.getByText("Redeem voucher")).not.toBeDisabled();
  });

  it("validateVoucherCode takes priority over voucherCodePattern", () => {
    // Pattern would pass, but function rejects
    const validator = () => false;
    render(
      <WalletTopup
        voucherCodePattern={/^.+$/}
        validateVoucherCode={validator}
      />
    );

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");

    fireEvent.change(codeInput, { target: { value: "anything" } });
    expect(screen.getByText("Redeem voucher")).toBeDisabled();
  });

  it("does not call onRedeem when code is invalid", () => {
    const onRedeem = vi.fn();
    render(
      <WalletTopup
        onRedeem={onRedeem}
        voucherCodePattern={/^[A-Z]{4}-[A-Z]{4}$/}
      />
    );

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));
    const codeInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX");
    fireEvent.change(codeInput, { target: { value: "bad" } });

    // Button is disabled so click shouldn't fire, but verify handler also guards
    fireEvent.click(screen.getByText("Redeem voucher"));
    expect(onRedeem).not.toHaveBeenCalled();
  });

  it("renders custom voucher code labels", () => {
    render(
      <WalletTopup
        voucherCodeLabel="Promo Code"
        voucherCancelText="Go back"
        voucherCodePlaceholder="Enter code"
        redeemText="Apply code"
      />
    );

    fireEvent.click(screen.getByText("Have an offline code or voucher?"));

    expect(screen.getByText("Promo Code")).toBeInTheDocument();
    expect(screen.getByText("Go back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();
    expect(screen.getByText("Apply code")).toBeInTheDocument();
  });

  // ─── Tax / Summary Section ─────────────────────────────
  it("shows summary section with static taxAmount", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        taxAmount={90}
      />
    );
    expect(screen.getByText("Recharge amount")).toBeInTheDocument();
    expect(screen.getByText("Taxes (GST)")).toBeInTheDocument();
    expect(screen.getByText("₹90")).toBeInTheDocument();
    // Amount appears in both the button and summary
    expect(screen.getAllByText("₹500")).toHaveLength(2);
  });

  it("shows summary section with taxCalculator", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        defaultSelectedAmount={1000}
        taxCalculator={(amount) => Math.round(amount * 0.18)}
      />
    );
    expect(screen.getByText("Recharge amount")).toBeInTheDocument();
    expect(screen.getByText("Taxes (GST)")).toBeInTheDocument();
    expect(screen.getByText("₹180")).toBeInTheDocument();
    // Amount appears in both the button and summary
    expect(screen.getAllByText("₹1,000")).toHaveLength(2);
  });

  it("taxCalculator takes priority over taxAmount", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        taxAmount={50}
        taxCalculator={() => 99}
      />
    );
    expect(screen.getByText("₹99")).toBeInTheDocument();
  });

  it("hides summary section when no tax props provided", () => {
    render(
      <WalletTopup amounts={[500]} defaultSelectedAmount={500} />
    );
    expect(screen.queryByText("Recharge amount")).not.toBeInTheDocument();
  });

  it("hides summary section when no amount selected", () => {
    render(
      <WalletTopup amounts={[500]} taxAmount={90} />
    );
    expect(screen.queryByText("Recharge amount")).not.toBeInTheDocument();
  });

  it("includes tax in pay button text", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        taxAmount={90}
      />
    );
    expect(screen.getByText("Pay ₹590 now")).toBeInTheDocument();
  });

  it("calls onPay with total including tax", () => {
    const onPay = vi.fn();
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        taxAmount={90}
        onPay={onPay}
      />
    );
    fireEvent.click(screen.getByText("Pay ₹590 now"));
    expect(onPay).toHaveBeenCalledWith(590);
  });

  it("renders custom tax and recharge labels", () => {
    render(
      <WalletTopup
        amounts={[500]}
        defaultSelectedAmount={500}
        taxAmount={90}
        taxLabel="VAT (20%)"
        rechargeAmountLabel="Subtotal"
      />
    );
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("VAT (20%)")).toBeInTheDocument();
  });

  // ─── Outstanding Amount ───────────────────────────────
  it("auto-prepends outstanding-only option when outstandingAmount is set", () => {
    render(
      <WalletTopup
        amounts={[1000, 5000]}
        outstandingAmount={10000}
      />
    );
    // Should have 3 options: outstanding-only + 2 amounts
    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);
  });

  it("shows outstanding breakdown in amount buttons", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000}
      />
    );
    // Outstanding-only option
    expect(screen.getByText("₹10,000")).toBeInTheDocument();
    // Outstanding + 1000 option
    expect(screen.getByText("₹11,000")).toBeInTheDocument();
    // Breakdown labels
    expect(screen.getAllByText(/Outstanding:/)).toHaveLength(2);
    expect(screen.getAllByText(/Top-up:/)).toHaveLength(2);
  });

  it("shows dash for topup in outstanding-only option", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000}
      />
    );
    const topupTexts = screen.getAllByText(/Top-up:/);
    expect(topupTexts[0].textContent).toContain("-");
  });

  it("includes outstanding in pay button total", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000}
        defaultSelectedAmount={1000}
      />
    );
    expect(screen.getByText("Pay ₹11,000 now")).toBeInTheDocument();
  });

  it("includes outstanding and tax in pay button total", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000}
        defaultSelectedAmount={1000}
        taxAmount={500}
      />
    );
    expect(screen.getByText("Pay ₹11,500 now")).toBeInTheDocument();
  });

  it("smart formats amounts with decimals only when needed", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000.5}
      />
    );
    // Outstanding amount with decimals
    expect(screen.getAllByText(/₹10,000.50/).length).toBeGreaterThan(0);
  });

  it("renders custom outstanding and topup labels", () => {
    render(
      <WalletTopup
        amounts={[1000]}
        outstandingAmount={10000}
        outstandingLabel="Due"
        topupLabel="Extra"
      />
    );
    expect(screen.getAllByText(/Due:/)).toHaveLength(2);
    expect(screen.getAllByText(/Extra:/)).toHaveLength(2);
  });

  // ─── Ref & className ───────────────────────────────────
  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<WalletTopup ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(
      <WalletTopup className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
