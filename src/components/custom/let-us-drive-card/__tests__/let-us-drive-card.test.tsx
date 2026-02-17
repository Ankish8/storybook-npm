import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LetUsDriveCard } from "../let-us-drive-card";

const defaultProps = {
  title: "Account Manager",
  price: "15,000",
  period: "/month",
  description: "One expert who knows your business.",
};

describe("LetUsDriveCard", () => {
  it("renders correctly with required props", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.getByText("Account Manager")).toBeInTheDocument();
    expect(screen.getByText("₹15,000")).toBeInTheDocument();
    expect(screen.getByText("/month")).toBeInTheDocument();
    expect(
      screen.getByText("One expert who knows your business.")
    ).toBeInTheDocument();
  });

  it("renders billing badge when provided", () => {
    render(<LetUsDriveCard {...defaultProps} billingBadge="Annually" />);
    expect(screen.getByText("Annually")).toBeInTheDocument();
  });

  it("does not render billing badge when not provided", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.queryByText("Annually")).not.toBeInTheDocument();
  });

  it("renders 'Starts at' prefix when startsAt is true", () => {
    render(<LetUsDriveCard {...defaultProps} startsAt />);
    expect(screen.getByText("Starts at")).toBeInTheDocument();
  });

  it("does not render 'Starts at' prefix by default", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.queryByText("Starts at")).not.toBeInTheDocument();
  });

  it("renders strikethrough price and free label when freeLabel is provided", () => {
    render(
      <LetUsDriveCard {...defaultProps} price="20,000" freeLabel="FREE" />
    );
    const strikethroughEl = screen.getByText("₹20,000");
    expect(strikethroughEl).toHaveClass("line-through");
    expect(screen.getByText("FREE")).toBeInTheDocument();
    expect(screen.getByText("FREE")).toHaveClass(
      "text-semantic-success-primary"
    );
  });

  it("renders normal price when freeLabel is not provided", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    const priceEl = screen.getByText("₹15,000");
    expect(priceEl).not.toHaveClass("line-through");
    expect(priceEl).toHaveClass("text-semantic-text-primary");
  });

  it("renders 'Show details' link when onShowDetails is provided", () => {
    const handleDetails = vi.fn();
    render(<LetUsDriveCard {...defaultProps} onShowDetails={handleDetails} />);
    const link = screen.getByText("Show details");
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    expect(handleDetails).toHaveBeenCalledTimes(1);
  });

  it("does not render 'Show details' link when onShowDetails is not provided", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.queryByText("Show details")).not.toBeInTheDocument();
  });

  it("renders custom showDetailsLabel", () => {
    render(
      <LetUsDriveCard
        {...defaultProps}
        showDetailsLabel="View more"
        onShowDetails={() => {}}
      />
    );
    expect(screen.getByText("View more")).toBeInTheDocument();
  });

  it("renders CTA button with default text", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.getByText("Talk to us")).toBeInTheDocument();
  });

  it("renders CTA button with custom text", () => {
    render(<LetUsDriveCard {...defaultProps} ctaLabel="Get started" />);
    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  it("calls onCtaClick when CTA button is clicked", () => {
    const handleClick = vi.fn();
    render(<LetUsDriveCard {...defaultProps} onCtaClick={handleClick} />);
    fireEvent.click(screen.getByText("Talk to us"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <LetUsDriveCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<LetUsDriveCard {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    render(<LetUsDriveCard {...defaultProps} data-testid="drive-card" />);
    expect(screen.getByTestId("drive-card")).toBeInTheDocument();
  });

  it("does not render period when not provided", () => {
    render(
      <LetUsDriveCard
        title="Onboarding"
        price="20,000"
        description="Test description"
      />
    );
    expect(screen.queryByText("/month")).not.toBeInTheDocument();
  });
});
