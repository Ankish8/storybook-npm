import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentOptionCard } from "../payment-option-card";
import type { PaymentOption } from "../types";

const mockOptions: PaymentOption[] = [
  {
    id: "net-banking",
    icon: <svg data-testid="icon-net-banking" />,
    title: "Net banking",
    description: "Pay securely through your bank",
  },
  {
    id: "debit-card",
    icon: <svg data-testid="icon-debit-card" />,
    title: "Debit Card",
    description: "All major debit cards",
  },
  {
    id: "upi",
    icon: <svg data-testid="icon-upi" />,
    title: "UPI",
    description: "Pay using UPI ID or QR",
  },
];

describe("PaymentOptionCard", () => {
  it("renders with default props", () => {
    render(<PaymentOptionCard options={mockOptions} />);
    expect(screen.getByText("Select payment method")).toBeInTheDocument();
    expect(
      screen.getByText("Preferred method with secure transactions")
    ).toBeInTheDocument();
    expect(screen.getByText("Proceed to pay")).toBeInTheDocument();
  });

  it("renders all payment options", () => {
    render(<PaymentOptionCard options={mockOptions} />);
    expect(screen.getByText("Net banking")).toBeInTheDocument();
    expect(screen.getByText("Debit Card")).toBeInTheDocument();
    expect(screen.getByText("UPI")).toBeInTheDocument();
    expect(
      screen.getByText("Pay securely through your bank")
    ).toBeInTheDocument();
    expect(screen.getByText("All major debit cards")).toBeInTheDocument();
    expect(screen.getByText("Pay using UPI ID or QR")).toBeInTheDocument();
  });

  it("renders icons for each option", () => {
    render(<PaymentOptionCard options={mockOptions} />);
    expect(screen.getByTestId("icon-net-banking")).toBeInTheDocument();
    expect(screen.getByTestId("icon-debit-card")).toBeInTheDocument();
    expect(screen.getByTestId("icon-upi")).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(
      <PaymentOptionCard
        options={mockOptions}
        title="Choose method"
        subtitle="Pick one"
      />
    );
    expect(screen.getByText("Choose method")).toBeInTheDocument();
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("renders custom CTA text", () => {
    render(
      <PaymentOptionCard options={mockOptions} ctaText="Pay Now" />
    );
    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });

  it("highlights default selected option", () => {
    const { container } = render(
      <PaymentOptionCard
        options={mockOptions}
        defaultSelectedOptionId="net-banking"
      />
    );
    const buttons = container.querySelectorAll("button[type='button']");
    // First option button (index 0 is close, but close only renders with onClose)
    const firstOption = buttons[0];
    expect(firstOption.className).toContain("border-[var(--semantic-brand)]");
  });

  it("calls onOptionSelect when an option is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <PaymentOptionCard
        options={mockOptions}
        onOptionSelect={handleSelect}
      />
    );
    await user.click(screen.getByText("UPI"));
    expect(handleSelect).toHaveBeenCalledWith("upi");
  });

  it("updates selection in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PaymentOptionCard options={mockOptions} />
    );
    await user.click(screen.getByText("Debit Card"));
    const optionButtons = container.querySelectorAll("button[type='button']");
    // Second option should now have the selected border
    expect(optionButtons[1].className).toContain(
      "border-[var(--semantic-brand)]"
    );
  });

  it("respects controlled selectedOptionId", () => {
    const { container } = render(
      <PaymentOptionCard
        options={mockOptions}
        selectedOptionId="upi"
      />
    );
    const optionButtons = container.querySelectorAll("button[type='button']");
    expect(optionButtons[2].className).toContain(
      "border-[var(--semantic-brand)]"
    );
  });

  it("calls onCtaClick when CTA button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <PaymentOptionCard options={mockOptions} onCtaClick={handleClick} />
    );
    await user.click(screen.getByText("Proceed to pay"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables CTA button when disabled prop is true", () => {
    render(<PaymentOptionCard options={mockOptions} disabled />);
    expect(
      screen.getByText("Proceed to pay").closest("button")
    ).toBeDisabled();
  });

  it("disables CTA button when loading is true", () => {
    render(<PaymentOptionCard options={mockOptions} loading />);
    expect(
      screen.getByText("Proceed to pay").closest("button")
    ).toBeDisabled();
  });

  it("renders close button when onClose is provided", () => {
    render(
      <PaymentOptionCard options={mockOptions} onClose={() => {}} />
    );
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(<PaymentOptionCard options={mockOptions} />);
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <PaymentOptionCard options={mockOptions} onClose={handleClose} />
    );
    await user.click(screen.getByLabelText("Close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PaymentOptionCard options={mockOptions} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<PaymentOptionCard options={mockOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
