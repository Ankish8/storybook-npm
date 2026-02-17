import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PowerUpCard } from "../power-up-card";

describe("PowerUpCard", () => {
  const defaultProps = {
    title: "Auto-Dialer",
    price: "Starts @ ₹700/user/month",
    description: "Available for SUV & Enterprise plans as an add-on per user.",
  };

  it("renders title, price, and description", () => {
    render(<PowerUpCard {...defaultProps} />);
    expect(screen.getByText("Auto-Dialer")).toBeInTheDocument();
    expect(screen.getByText("Starts @ ₹700/user/month")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Available for SUV & Enterprise plans as an add-on per user."
      )
    ).toBeInTheDocument();
  });

  it("renders default CTA label", () => {
    render(<PowerUpCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Talk to us" })
    ).toBeInTheDocument();
  });

  it("renders custom CTA label", () => {
    render(<PowerUpCard {...defaultProps} ctaLabel="Contact sales" />);
    expect(
      screen.getByRole("button", { name: "Contact sales" })
    ).toBeInTheDocument();
  });

  it("calls onCtaClick when button is clicked", () => {
    const handleClick = vi.fn();
    render(<PowerUpCard {...defaultProps} onCtaClick={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Talk to us" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("renders icon when provided", () => {
    render(
      <PowerUpCard
        {...defaultProps}
        icon={<svg data-testid="test-icon" />}
      />
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is not provided", () => {
    const { container } = render(<PowerUpCard {...defaultProps} />);
    expect(
      container.querySelector(".bg-\\[var\\(--color-info-25\\)\\]")
    ).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PowerUpCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PowerUpCard {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("spreads additional props", () => {
    render(<PowerUpCard {...defaultProps} data-testid="power-up" />);
    expect(screen.getByTestId("power-up")).toBeInTheDocument();
  });

  it("has correct base classes on the root element", () => {
    const { container } = render(<PowerUpCard {...defaultProps} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass(
      "flex",
      "flex-col",
      "justify-between",
      "gap-8",
      "rounded-md",
      "border",
      "border-semantic-border-layout",
      "bg-card",
      "p-5"
    );
  });
});
