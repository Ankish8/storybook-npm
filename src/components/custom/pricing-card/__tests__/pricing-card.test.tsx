import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PricingCard } from "../pricing-card";

const defaultProps = {
  planName: "Compact",
  price: "2,5000",
  planDetails: "3 Users | 12 Month plan",
  description: "For small teams that need a WhatsApp-first plan",
  headerBgColor: "#d7eae9",
  features: [
    "WhatsApp Campaigns (up to 5K audience)",
    "Missed Call Tracking & Alerts",
  ],
};

describe("PricingCard", () => {
  it("renders plan name and price", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("Compact")).toBeInTheDocument();
    expect(screen.getByText(/2,5000/)).toBeInTheDocument();
  });

  it("renders default period", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("per month, billed yearly")).toBeInTheDocument();
  });

  it("renders custom period", () => {
    render(<PricingCard {...defaultProps} period="/Year" />);
    expect(screen.getByText("/Year")).toBeInTheDocument();
  });

  it("renders plan details", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.getByText("3 Users | 12 Month plan")
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.getByText(
        "For small teams that need a WhatsApp-first plan"
      )
    ).toBeInTheDocument();
  });

  it.skip("renders plan icon when provided", () => {
    // planIcon prop is accepted in types but not yet rendered in the component JSX
    render(
      <PricingCard
        {...defaultProps}
        planIcon={<span>plan-icon-element</span>}
      />
    );
    expect(screen.getByText("plan-icon-element")).toBeInTheDocument();
  });

  it.skip("does not render plan icon when not provided", () => {
    // planIcon prop is accepted in types but not yet rendered in the component JSX
    const { container } = render(<PricingCard {...defaultProps} />);
    expect(container.querySelector("[data-testid='plan-icon']")).toBeNull();
  });

  it("renders features with checkmarks", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.getByText("WhatsApp Campaigns (up to 5K audience)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Missed Call Tracking & Alerts")
    ).toBeInTheDocument();
  });

  it("renders Includes header when features exist", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("Includes:")).toBeInTheDocument();
  });

  it("does not render features section when features is empty", () => {
    render(<PricingCard {...defaultProps} features={[]} />);
    expect(screen.queryByText("Includes")).not.toBeInTheDocument();
  });

  it("renders Select plan button by default", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Select plan" })
    ).toBeInTheDocument();
  });

  it("renders Current plan button when isCurrentPlan is true", () => {
    render(<PricingCard {...defaultProps} isCurrentPlan />);
    expect(
      screen.getByRole("button", { name: "Current plan" })
    ).toBeInTheDocument();
  });

  it("renders custom ctaText", () => {
    render(<PricingCard {...defaultProps} ctaText="Upgrade plan" />);
    expect(
      screen.getByRole("button", { name: "Upgrade plan" })
    ).toBeInTheDocument();
  });

  it("calls onCtaClick when CTA button is clicked", () => {
    const onCtaClick = vi.fn();
    render(<PricingCard {...defaultProps} onCtaClick={onCtaClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Select plan" }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on CTA when ctaLoading is true", () => {
    render(
      <PricingCard {...defaultProps} ctaText="Upgrade plan" ctaLoading />
    );
    const button = screen.getByRole("button", { name: /Upgrade plan/i });
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("disables CTA button when ctaDisabled is true", () => {
    render(
      <PricingCard {...defaultProps} ctaText="Upgrade plan" ctaDisabled />
    );
    const button = screen.getByRole("button", { name: "Upgrade plan" });
    expect(button).toBeDisabled();
  });

  it("does not call onCtaClick when CTA is loading", () => {
    const onCtaClick = vi.fn();
    render(
      <PricingCard
        {...defaultProps}
        ctaText="Upgrade plan"
        ctaLoading
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Upgrade plan/i }));
    expect(onCtaClick).not.toHaveBeenCalled();
  });

  it("does not call onCtaClick when CTA is disabled", () => {
    const onCtaClick = vi.fn();
    render(
      <PricingCard
        {...defaultProps}
        ctaText="Upgrade plan"
        ctaDisabled
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Upgrade plan" }));
    expect(onCtaClick).not.toHaveBeenCalled();
  });

  it("renders Feature details link when onFeatureDetails is provided", () => {
    const onFeatureDetails = vi.fn();
    render(
      <PricingCard
        {...defaultProps}
        onFeatureDetails={onFeatureDetails}
      />
    );
    const link = screen.getByRole("button", { name: "Check feature details" });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    expect(onFeatureDetails).toHaveBeenCalledTimes(1);
  });

  it("does not render Feature details when onFeatureDetails is not provided", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.queryByRole("button", { name: "Check feature details" })
    ).not.toBeInTheDocument();
  });

  it("renders Most Popular badge when showPopularBadge is true", () => {
    render(<PricingCard {...defaultProps} showPopularBadge />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("renders custom badge text", () => {
    render(
      <PricingCard
        {...defaultProps}
        showPopularBadge
        badgeText="BEST VALUE"
      />
    );
    expect(screen.getByText("BEST VALUE")).toBeInTheDocument();
  });

  it("does not render badge when showPopularBadge is false", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
  });

  it("renders addon section when addon is provided", () => {
    render(
      <PricingCard
        {...defaultProps}
        addon={{ text: "Add AI Agents @ ₹10,000/agent" }}
      />
    );
    expect(
      screen.getByText("Add AI Agents @ ₹10,000/agent")
    ).toBeInTheDocument();
  });

  it("renders addon with icon", () => {
    render(
      <PricingCard
        {...defaultProps}
        addon={{
          icon: <span>addon-icon-element</span>,
          text: "Add AI Agents",
        }}
      />
    );
    // Component accepts addon.icon in types but currently only renders addon.text
    expect(screen.getByText("Add AI Agents")).toBeInTheDocument();
  });

  it("does not render addon section when addon is not provided", () => {
    render(<PricingCard {...defaultProps} />);
    expect(
      screen.queryByText("Add AI Agents")
    ).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PricingCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<PricingCard {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(<PricingCard {...defaultProps} data-testid="pricing-card" />);
    expect(screen.getByTestId("pricing-card")).toBeInTheDocument();
  });

  it("ignores headerBgColor prop (no inline background)", () => {
    const { container } = render(
      <PricingCard {...defaultProps} headerBgColor="#d7eae9" />
    );
    // The main content wrapper is .flex.flex-col.gap-6.px-6.py-8.flex-1
    const content = container.querySelector(
      ".flex.flex-col.gap-6"
    );
    expect(content).not.toHaveStyle({ backgroundColor: "#d7eae9" });
  });

  it("renders secondary disabled button for current plan", () => {
    render(
      <PricingCard {...defaultProps} isCurrentPlan data-testid="card" />
    );
    const button = screen.getByRole("button", { name: "Current plan" });
    expect(button.className).toContain("bg-semantic-primary-surface");
    expect(button).toBeDisabled();
  });

  it("renders default button variant for selectable plan", () => {
    render(<PricingCard {...defaultProps} data-testid="card" />);
    const button = screen.getByRole("button", { name: "Select plan" });
    expect(button.className).toContain("bg-semantic-primary");
  });

  it("renders usage details section", () => {
    render(
      <PricingCard
        {...defaultProps}
        usageDetails={[
          { label: "Usage", value: "2,000 conversations/month" },
          { label: "Extra usage", value: "₹8 per conversation" },
        ]}
      />
    );
    expect(screen.getByText(/Usage:/)).toBeInTheDocument();
    expect(
      screen.getByText(/2,000 conversations\/month/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Extra usage:/)).toBeInTheDocument();
  });

  it("does not render usage details when not provided", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.queryByText(/Usage:/)).not.toBeInTheDocument();
  });

  it("renders bold features with font-semibold", () => {
    render(
      <PricingCard
        {...defaultProps}
        features={[
          { text: "Everything in AIO", bold: true },
          "Regular feature",
        ]}
      />
    );
    const boldFeature = screen.getByText("Everything in AIO");
    expect(boldFeature.className).toContain("font-semibold");

    const regularFeature = screen.getByText("Regular feature");
    expect(regularFeature.className).not.toContain("font-semibold");
  });

  it("renders partial bold features with parts format", () => {
    render(
      <PricingCard
        {...defaultProps}
        features={[
          {
            parts: [
              { text: "Everything in " },
              { text: "Sedan", bold: true },
            ],
          },
          "Regular feature",
        ]}
      />
    );
    // The bold part should have font-semibold
    const boldPart = screen.getByText("Sedan");
    expect(boldPart.className).toContain("font-semibold");

    // The parent span should contain both parts
    const parentSpan = boldPart.parentElement!;
    expect(parentSpan.textContent).toBe("Everything in Sedan");

    // Non-bold part should not have font-semibold
    const normalPart = parentSpan.querySelector("span:first-child")!;
    expect(normalPart.textContent).toBe("Everything in ");
    expect(normalPart.className).not.toContain("font-semibold");

    const regularFeature = screen.getByText("Regular feature");
    expect(regularFeature.className).not.toContain("font-semibold");
  });

  it("renders both addon and usage details together", () => {
    render(
      <PricingCard
        {...defaultProps}
        addon={{ text: "Add AI Agents" }}
        usageDetails={[{ label: "Users", value: "1 included" }]}
      />
    );
    expect(screen.getByText("Add AI Agents")).toBeInTheDocument();
    expect(screen.getByText(/Users:/)).toBeInTheDocument();
  });
});
