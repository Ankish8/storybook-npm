import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PricingPlanCardsOneColumn } from "../pricing-plan-cards-one-column";
import { PricingPlanCardsTwoColumn } from "../pricing-plan-cards-two-column";

describe("PricingPlanCardsOneColumn", () => {
  it("renders children", () => {
    render(
      <PricingPlanCardsOneColumn>
        <div>Card A</div>
        <div>Card B</div>
      </PricingPlanCardsOneColumn>
    );
    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
  });

  it("exposes layout data attributes and one-column grid", () => {
    render(
      <PricingPlanCardsOneColumn>
        <div>only</div>
      </PricingPlanCardsOneColumn>
    );
    const grid = screen.getByTestId("pricing-plan-cards-grid");
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "one-column");
    expect(grid).toHaveClass("grid-cols-1");
  });

  it("merges className and forwards ref", () => {
    const ref = vi.fn();
    const { container } = render(
      <PricingPlanCardsOneColumn ref={ref} className="extra">
        <span>x</span>
      </PricingPlanCardsOneColumn>
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    expect(
      container.querySelector("[data-testid=\"pricing-plan-cards-grid\"]")
    ).toHaveClass("extra");
  });
});

describe("PricingPlanCardsTwoColumn", () => {
  it("renders children", () => {
    render(
      <PricingPlanCardsTwoColumn>
        <div>One</div>
        <div>Two</div>
      </PricingPlanCardsTwoColumn>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("exposes layout data attributes and two-column grid", () => {
    const { container } = render(
      <PricingPlanCardsTwoColumn>
        <div>a</div>
      </PricingPlanCardsTwoColumn>
    );
    const grid = screen.getByTestId("pricing-plan-cards-grid");
    expect(grid).toHaveAttribute("data-pricing-plans-layout", "two-column");
    expect(grid).toHaveClass("min-[480px]:grid-cols-2");
    expect(container.querySelector(".grid-cols-1")).toBeTruthy();
  });

  it("merges className and forwards ref", () => {
    const ref = vi.fn();
    const { container } = render(
      <PricingPlanCardsTwoColumn ref={ref} className="my-row">
        <span>y</span>
      </PricingPlanCardsTwoColumn>
    );
    expect(ref).toHaveBeenCalled();
    expect(
      container.querySelector("[data-testid=\"pricing-plan-cards-grid\"]")
    ).toHaveClass("my-row");
  });
});
