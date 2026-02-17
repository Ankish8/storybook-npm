import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PricingToggle } from "../pricing-toggle";

const defaultTabs = [
  { label: "Team-Led Plans", value: "team" },
  { label: "Go-AI First", value: "ai" },
];

describe("PricingToggle", () => {
  it("renders all tabs", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
      />
    );
    expect(screen.getByText("Team-Led Plans")).toBeInTheDocument();
    expect(screen.getByText("Go-AI First")).toBeInTheDocument();
  });

  it("marks active tab with aria-selected", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
      />
    );
    expect(screen.getByText("Team-Led Plans").closest("button")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Go-AI First").closest("button")).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("applies active tab styles", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
      />
    );
    const activeBtn = screen.getByText("Team-Led Plans").closest("button");
    expect(activeBtn?.className).toContain("bg-semantic-brand");
    expect(activeBtn?.className).toContain("text-white");
    expect(activeBtn?.className).toContain("font-semibold");
  });

  it("applies inactive tab styles", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
      />
    );
    const inactiveBtn = screen.getByText("Go-AI First").closest("button");
    expect(inactiveBtn?.className).toContain("text-semantic-text-primary");
    expect(inactiveBtn?.className).toContain("font-normal");
  });

  it("calls onTabChange when a tab is clicked", () => {
    const onTabChange = vi.fn();
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={onTabChange}
      />
    );
    fireEvent.click(screen.getByText("Go-AI First"));
    expect(onTabChange).toHaveBeenCalledWith("ai");
  });

  it("does not render billing toggle when showBillingToggle is false", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        showBillingToggle={false}
      />
    );
    expect(screen.queryByText("Monthly")).not.toBeInTheDocument();
    expect(screen.queryByText("Yearly (Save 20%)")).not.toBeInTheDocument();
  });

  it("renders billing toggle when showBillingToggle is true", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        showBillingToggle
        billingPeriod="monthly"
        onBillingPeriodChange={() => {}}
      />
    );
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly (Save 20%)")).toBeInTheDocument();
  });

  it("applies active style to monthly label when billingPeriod is monthly", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        showBillingToggle
        billingPeriod="monthly"
        onBillingPeriodChange={() => {}}
      />
    );
    expect(screen.getByText("Monthly").className).toContain(
      "text-semantic-text-secondary"
    );
    expect(screen.getByText("Yearly (Save 20%)").className).toContain(
      "text-semantic-text-muted"
    );
  });

  it("applies active style to yearly label when billingPeriod is yearly", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        showBillingToggle
        billingPeriod="yearly"
        onBillingPeriodChange={() => {}}
      />
    );
    expect(screen.getByText("Monthly").className).toContain(
      "text-semantic-text-muted"
    );
    expect(screen.getByText("Yearly (Save 20%)").className).toContain(
      "text-semantic-text-secondary"
    );
  });

  it("supports custom billing labels", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        showBillingToggle
        billingPeriod="monthly"
        onBillingPeriodChange={() => {}}
        monthlyLabel="Pay Monthly"
        yearlyLabel="Pay Yearly"
      />
    );
    expect(screen.getByText("Pay Monthly")).toBeInTheDocument();
    expect(screen.getByText("Pay Yearly")).toBeInTheDocument();
  });

  it("forwards ref to the root element", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <PricingToggle
        ref={ref}
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("spreads additional props to root element", () => {
    render(
      <PricingToggle
        tabs={defaultTabs}
        activeTab="team"
        onTabChange={() => {}}
        data-testid="pricing-toggle"
      />
    );
    expect(screen.getByTestId("pricing-toggle")).toBeInTheDocument();
  });

  it("renders three or more tabs", () => {
    render(
      <PricingToggle
        tabs={[
          { label: "Starter", value: "starter" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise", value: "enterprise" },
        ]}
        activeTab="pro"
        onTabChange={() => {}}
      />
    );
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Pro").closest("button")).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
