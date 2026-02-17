import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PricingPage } from "../pricing-page";
import type { PricingCardProps } from "../../pricing-card/types";
import type { PowerUpCardProps } from "../../power-up-card/types";
import type { LetUsDriveCardProps } from "../../let-us-drive-card/types";

const tabs = [
  { label: "Team-Led Plans", value: "team" },
  { label: "Go-AI First", value: "ai" },
];

const mockPlanCards: PricingCardProps[] = [
  {
    planName: "Compact",
    price: "2,5000",
    features: ["WhatsApp Campaigns"],
    onCtaClick: vi.fn(),
  },
  {
    planName: "Sedan",
    price: "5,000",
    features: ["Scalable calling"],
    onCtaClick: vi.fn(),
  },
];

const mockPowerUps: PowerUpCardProps[] = [
  {
    title: "Truecaller",
    price: "Starts @ \u20B930,000/month",
    description: "Leverage Truecaller Business.",
    onCtaClick: vi.fn(),
  },
];

const mockDriveCards: LetUsDriveCardProps[] = [
  {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "/one-time fee",
    description: "Cut adoption time.",
    onCtaClick: vi.fn(),
  },
];

describe("PricingPage", () => {
  it("renders with default title", () => {
    render(<PricingPage />);
    expect(screen.getByText("Select business plan")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(<PricingPage title="Choose your plan" />);
    expect(screen.getByText("Choose your plan")).toBeInTheDocument();
  });

  it("renders header actions", () => {
    render(
      <PricingPage
        headerActions={<button>Number type: Virtual</button>}
      />
    );
    expect(screen.getByText("Number type: Virtual")).toBeInTheDocument();
  });

  it("renders plan type tabs", () => {
    render(<PricingPage tabs={tabs} activeTab="team" />);
    expect(screen.getByRole("tab", { name: "Team-Led Plans" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Go-AI First" })).toBeInTheDocument();
  });

  it("calls onTabChange when tab is clicked", () => {
    const onTabChange = vi.fn();
    render(
      <PricingPage tabs={tabs} activeTab="team" onTabChange={onTabChange} />
    );
    fireEvent.click(screen.getByRole("tab", { name: "Go-AI First" }));
    expect(onTabChange).toHaveBeenCalledWith("ai");
  });

  it("renders plan cards", () => {
    render(<PricingPage planCards={mockPlanCards} />);
    expect(screen.getByText("Compact")).toBeInTheDocument();
    expect(screen.getByText("Sedan")).toBeInTheDocument();
  });

  it("renders power-up cards section", () => {
    render(<PricingPage powerUpCards={mockPowerUps} />);
    expect(screen.getByText("Power-ups and charges")).toBeInTheDocument();
    expect(screen.getByText("Truecaller")).toBeInTheDocument();
  });

  it("renders power-ups with custom title", () => {
    render(
      <PricingPage
        powerUpCards={mockPowerUps}
        powerUpsTitle="Add-ons"
      />
    );
    expect(screen.getByText("Add-ons")).toBeInTheDocument();
  });

  it("renders feature comparison link when callback provided", () => {
    const onClick = vi.fn();
    render(
      <PricingPage
        powerUpCards={mockPowerUps}
        onFeatureComparisonClick={onClick}
      />
    );
    const link = screen.getByText("See full feature comparison");
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it("hides feature comparison link when no callback", () => {
    render(<PricingPage powerUpCards={mockPowerUps} />);
    expect(
      screen.queryByText("See full feature comparison")
    ).not.toBeInTheDocument();
  });

  it("renders let-us-drive section", () => {
    render(<PricingPage letUsDriveCards={mockDriveCards} />);
    expect(
      screen.getByText("Let us drive — Full-service management")
    ).toBeInTheDocument();
    expect(screen.getByText("Dedicated Onboarding")).toBeInTheDocument();
  });

  it("renders let-us-drive with custom title", () => {
    render(
      <PricingPage
        letUsDriveCards={mockDriveCards}
        letUsDriveTitle="Managed services"
      />
    );
    expect(screen.getByText("Managed services")).toBeInTheDocument();
  });

  it("hides power-ups section when no cards", () => {
    render(<PricingPage powerUpCards={[]} />);
    expect(
      screen.queryByText("Power-ups and charges")
    ).not.toBeInTheDocument();
  });

  it("hides let-us-drive section when no cards", () => {
    render(<PricingPage letUsDriveCards={[]} />);
    expect(
      screen.queryByText("Let us drive — Full-service management")
    ).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PricingPage ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PricingPage className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("spreads additional props", () => {
    render(<PricingPage data-testid="pricing-page" />);
    expect(screen.getByTestId("pricing-page")).toBeInTheDocument();
  });

  it("renders billing toggle when showBillingToggle is true", () => {
    render(
      <PricingPage
        tabs={tabs}
        activeTab="team"
        showBillingToggle
        billingPeriod="monthly"
      />
    );
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly (Save 20%)")).toBeInTheDocument();
  });

  it("renders all sections together", () => {
    render(
      <PricingPage
        tabs={tabs}
        activeTab="team"
        showBillingToggle
        billingPeriod="monthly"
        planCards={mockPlanCards}
        powerUpCards={mockPowerUps}
        onFeatureComparisonClick={() => {}}
        letUsDriveCards={mockDriveCards}
      />
    );
    // Header
    expect(screen.getByText("Select business plan")).toBeInTheDocument();
    // Tabs
    expect(screen.getByRole("tab", { name: "Team-Led Plans" })).toBeInTheDocument();
    // Plan cards
    expect(screen.getByText("Compact")).toBeInTheDocument();
    // Power-ups
    expect(screen.getByText("Truecaller")).toBeInTheDocument();
    // Let us drive
    expect(screen.getByText("Dedicated Onboarding")).toBeInTheDocument();
  });
});
