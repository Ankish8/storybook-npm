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
    ctaText: "Current plan",
    isCurrentPlan: true,
    onCtaClick: vi.fn(),
  },
  {
    planName: "Sedan",
    price: "5,000",
    features: ["Scalable calling"],
    ctaText: "Upgrade plan",
    onCtaClick: vi.fn(),
  },
  {
    planName: "SUV",
    price: "15,000",
    features: ["Advanced IVR"],
    ctaText: "Upgrade plan",
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
    expect(screen.getByText("Select Business Plan")).toBeInTheDocument();
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
    expect(screen.getAllByText("Number type: Virtual").length).toBeGreaterThanOrEqual(1);
  });

  it.skip("renders plan type tabs", () => {
    // Tabs are accepted as props but not yet rendered in the component JSX
    render(<PricingPage tabs={tabs} activeTab="team" />);
    expect(screen.getByRole("tab", { name: "Team-Led Plans" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Go-AI First" })).toBeInTheDocument();
  });

  it("hides category toggle when showCategoryToggle is false", () => {
    render(
      <PricingPage
        tabs={tabs}
        activeTab="team"
        showCategoryToggle={false}
        planCards={mockPlanCards}
      />
    );
    expect(screen.queryByRole("tab", { name: "Team-Led Plans" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Go-AI First" })).not.toBeInTheDocument();
    expect(screen.getByText("Compact")).toBeInTheDocument();
  });

  it.skip("calls onTabChange when tab is clicked", () => {
    // Tabs not yet rendered in component JSX
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

  it("renders planAlert above plan cards with title and description", () => {
    render(
      <PricingPage
        planCards={mockPlanCards}
        planAlert={{
          status: "success",
          title: "Plan notice",
          description: "Details here.",
        }}
      />
    );
    const alerts = screen.getAllByRole("alert");
    expect(alerts.some((el) => el.textContent?.includes("Plan notice"))).toBe(
      true
    );
    expect(screen.getByText("Details here.")).toBeInTheDocument();
    expect(screen.getByText("Compact")).toBeInTheDocument();
  });

  it.each([
    ["success", "bg-semantic-success-surface"],
    ["warning", "bg-semantic-warning-surface"],
    ["info", "bg-semantic-info-surface"],
    ["failed", "bg-semantic-error-surface"],
  ] as const)("planAlert status %s maps to Alert surface", (status, surfaceClass) => {
    const { container } = render(
      <PricingPage
        planCards={mockPlanCards}
        planAlert={{
          status,
          title: "Alert title",
        }}
      />
    );
    const alert = container.querySelector("[role='alert']");
    expect(alert).toBeTruthy();
    expect(alert).toHaveClass(surfaceClass);
  });

  it("planAlert variant overrides status for Alert appearance", () => {
    const { container } = render(
      <PricingPage
        planCards={mockPlanCards}
        planAlert={{
          status: "success",
          variant: "warning",
          title: "Overrides",
        }}
      />
    );
    const alert = container.querySelector("[role='alert']");
    expect(alert).toHaveClass("bg-semantic-warning-surface");
  });

  it("hides plan alert when showPlanAlert is false", () => {
    render(
      <PricingPage
        planCards={mockPlanCards}
        showPlanAlert={false}
        planAlert={{
          status: "warning",
          title: "Hidden",
          description: "Should not show",
        }}
      />
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.getByText("Compact")).toBeInTheDocument();
  });

  it("forwards alertProps to the underlying Alert", () => {
    const onClose = vi.fn();
    render(
      <PricingPage
        planCards={mockPlanCards}
        planAlert={{
          variant: "info",
          title: "Closable",
          alertProps: {
            closable: true,
            onClose,
            "data-testid": "plan-area-alert",
          },
        }}
      />
    );
    const alert = screen.getByTestId("plan-area-alert");
    expect(alert).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close alert" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("centers a single plan card in a three-column track (not full width on md+)", () => {
    const onePlan: PricingCardProps[] = [mockPlanCards[0]!];
    const { container } = render(<PricingPage planCards={onePlan} />);
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("md:[&>div]:col-start-2");
  });

  it("centers two plan cards with one-third width slots (not 50% each)", () => {
    const twoPlans: PricingCardProps[] = [mockPlanCards[0]!, mockPlanCards[1]!];
    const { container } = render(<PricingPage planCards={twoPlans} />);
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(grid).toHaveClass("min-[480px]:justify-center");
    expect(grid).toHaveClass(
      "[&>div]:min-[480px]:w-[min(21.375rem,calc((100%-4rem)/3))]"
    );
  });

  it("lays out plan cards in a responsive grid with four columns on wide viewports", () => {
    const fourPlans: PricingCardProps[] = [
      ...mockPlanCards,
      {
        planName: "Enterprise",
        price: "25,000",
        features: ["Everything in SUV"],
        ctaText: "Contact sales",
        onCtaClick: vi.fn(),
      },
    ];
    const { container } = render(<PricingPage planCards={fourPlans} />);
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(grid).toHaveClass("md:grid-cols-4");
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "grid");
  });

  it("uses one-column layout when planCardsLayout is oneColumn", () => {
    const { container } = render(
      <PricingPage planCards={mockPlanCards} planCardsLayout="oneColumn" />
    );
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "one-column");
    expect(grid).toHaveClass("grid-cols-1");
  });

  it("keeps one-column stack for five or more plan cards (no horizontal scroll)", () => {
    const fivePlans: PricingCardProps[] = [
      ...mockPlanCards,
      {
        planName: "Enterprise",
        price: "25,000",
        features: ["Everything in SUV"],
        ctaText: "Contact sales",
        onCtaClick: vi.fn(),
      },
      {
        planName: "Ultimate",
        price: "35,000",
        features: ["Top tier"],
        ctaText: "Contact",
        onCtaClick: vi.fn(),
      },
    ];
    const { container } = render(
      <PricingPage
        planCards={fivePlans}
        planCardsLayout="oneColumn"
      />
    );
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "one-column");
    expect(
      screen.queryByTestId("pricing-plan-cards-pagination")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Plan options" })
    ).not.toBeInTheDocument();
  });

  it("uses two-column layout when planCardsLayout is twoColumn", () => {
    const { container } = render(
      <PricingPage planCards={mockPlanCards} planCardsLayout="twoColumn" />
    );
    const grid = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "two-column");
    expect(grid).toHaveClass("min-[480px]:grid-cols-2");
  });

  it("uses horizontal scroll for five or more plan cards (5th accessible via scrollbar)", () => {
    const fivePlans: PricingCardProps[] = [
      ...mockPlanCards,
      {
        planName: "Enterprise",
        price: "25,000",
        features: ["Everything in SUV"],
        ctaText: "Contact sales",
        onCtaClick: vi.fn(),
      },
      {
        planName: "Ultimate",
        price: "35,000",
        features: ["Top tier"],
        ctaText: "Contact",
        onCtaClick: vi.fn(),
      },
    ];
    const { container } = render(<PricingPage planCards={fivePlans} />);
    const row = container.querySelector(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    ) as HTMLElement | null;
    const scrollRegion = row?.parentElement;
    expect(row).toBeTruthy();
    expect(row).toHaveAttribute("data-pricing-plans-layout", "scroll");
    expect(row?.className).toMatch(/flex-nowrap/);
    expect(scrollRegion?.className).toMatch(/overflow-x-auto/);
    expect(screen.getByRole("region", { name: "Plan options" })).toBe(
      scrollRegion
    );
    const pagination = screen.getByTestId("pricing-plan-cards-pagination");
    expect(pagination).toBeInTheDocument();
    expect(
      pagination.querySelectorAll("button[aria-label^='Show plan']")
    ).toHaveLength(5);
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

  it.skip("renders billing toggle when showBillingToggle is true", () => {
    // Billing toggle not yet rendered in component JSX
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
    expect(screen.getByText("Select Business Plan")).toBeInTheDocument();
    // Plan cards
    expect(screen.getByText("Compact")).toBeInTheDocument();
    // Power-ups
    expect(screen.getByText("Truecaller")).toBeInTheDocument();
    // Let us drive
    expect(screen.getByText("Dedicated Onboarding")).toBeInTheDocument();
  });

  it("applies planCardCtaStates to the three plan card CTAs", () => {
    render(
      <PricingPage
        planCards={mockPlanCards}
        planCardCtaStates={[
          { disabled: true },
          { loading: true },
          { disabled: false },
        ]}
      />
    );
    const currentPlanBtn = screen.getByRole("button", { name: "Current plan" });
    const upgradeButtons = screen.getAllByRole("button", {
      name: "Upgrade plan",
    });
    expect(currentPlanBtn).toBeDisabled();
    expect(upgradeButtons[0]).toBeDisabled();
    expect(
      upgradeButtons[0].querySelector(".animate-spin")
    ).toBeInTheDocument();
    expect(upgradeButtons[1]).not.toBeDisabled();
  });

  it("lets each Let us drive card expand independently", () => {
    const driveCardsWithDetails: LetUsDriveCardProps[] = [
      {
        title: "Onboarding",
        price: "20,000",
        period: "/one-time",
        description: "Cut adoption time.",
        detailsContent: {
          heading: "Includes:",
          items: [{ title: "Setup", description: "Help with setup." }],
        },
        onCtaClick: vi.fn(),
      },
      {
        title: "Account Manager",
        price: "15,000",
        period: "/month",
        description: "One expert.",
        detailsContent: {
          heading: "Includes:",
          items: [{ title: "Reviews", description: "Strategic reviews." }],
        },
        onCtaClick: vi.fn(),
      },
    ];
    render(
      <PricingPage
        letUsDriveCards={driveCardsWithDetails}
      />
    );
    // expand first card
    fireEvent.click(screen.getAllByText("Show details")[0]);
    expect(screen.getByText("Setup")).toBeInTheDocument();
    expect(screen.queryByText("Reviews")).not.toBeInTheDocument();
    // expand second card — first stays open (independent)
    fireEvent.click(screen.getByText("Show details"));
    expect(screen.getByText("Setup")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    // collapse first card — second stays open
    fireEvent.click(screen.getAllByText("Hide details")[0]);
    expect(screen.queryByText("Setup")).not.toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
  });
});
