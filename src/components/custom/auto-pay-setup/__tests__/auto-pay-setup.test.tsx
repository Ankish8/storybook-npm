import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AutoPaySetup } from "../auto-pay-setup";

describe("AutoPaySetup", () => {
  it("renders with default props", () => {
    render(<AutoPaySetup />);
    expect(screen.getByText("Auto-pay setup")).toBeInTheDocument();
    expect(
      screen.getByText("Hassle-free monthly billing")
    ).toBeInTheDocument();
    expect(screen.getByText("Enable Auto-Pay")).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(
      <AutoPaySetup title="Custom Title" subtitle="Custom Subtitle" />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Subtitle")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <AutoPaySetup
        icon={<svg data-testid="test-icon" />}
      />
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is not provided", () => {
    const { container } = render(<AutoPaySetup />);
    const iconContainer = container.querySelector(".size-10");
    expect(iconContainer).not.toBeInTheDocument();
  });

  it("renders body text", () => {
    render(<AutoPaySetup bodyText="Custom body text" />);
    expect(screen.getByText("Custom body text")).toBeInTheDocument();
  });

  it("does not render body text when empty", () => {
    render(<AutoPaySetup bodyText="" />);
    // The default body text should not appear when bodyText is empty
    expect(
      screen.queryByText(
        /Link your internet banking account/
      )
    ).not.toBeInTheDocument();
  });

  it("renders note callout with label and text", () => {
    render(
      <AutoPaySetup noteLabel="Warning:" noteText="This is a warning" />
    );
    expect(screen.getByText("Warning:")).toBeInTheDocument();
    expect(screen.getByText("This is a warning")).toBeInTheDocument();
  });

  it("renders note callout without label", () => {
    render(<AutoPaySetup noteLabel="" noteText="Just a note" />);
    expect(screen.getByText("Just a note")).toBeInTheDocument();
  });

  it("does not render note callout when noteText is empty", () => {
    const { container } = render(<AutoPaySetup noteText="" />);
    const noteBox = container.querySelector(".rounded.bg-\\[var\\(--semantic-info-25");
    expect(noteBox).not.toBeInTheDocument();
  });

  it("renders custom CTA text", () => {
    render(<AutoPaySetup ctaText="Set Up Now" />);
    expect(screen.getByText("Set Up Now")).toBeInTheDocument();
  });

  it("calls onCtaClick when button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<AutoPaySetup onCtaClick={handleClick} />);
    await user.click(screen.getByText("Enable Auto-Pay"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled prop is true", () => {
    render(<AutoPaySetup disabled />);
    expect(screen.getByText("Enable Auto-Pay").closest("button")).toBeDisabled();
  });

  it("disables button when loading is true", () => {
    render(<AutoPaySetup loading />);
    const ctaButton = screen.getByText("Enable Auto-Pay").closest("button");
    expect(ctaButton).toBeDisabled();
  });

  it("starts expanded by default", () => {
    render(<AutoPaySetup />);
    const trigger = screen.getByRole("button", {
      name: /auto-pay setup/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("starts collapsed when defaultOpen is false", () => {
    render(<AutoPaySetup defaultOpen={false} />);
    const trigger = screen.getByRole("button", {
      name: /auto-pay setup/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles content on trigger click", async () => {
    const user = userEvent.setup();
    render(<AutoPaySetup />);
    const trigger = screen.getByRole("button", {
      name: /auto-pay setup/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders outline CTA when ctaVariant is outline", () => {
    render(
      <AutoPaySetup ctaText="Edit subscription" ctaVariant="outline" />
    );
    const ctaButton = screen.getByText("Edit subscription").closest("button");
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton?.className).not.toContain("bg-semantic-primary ");
  });

  it("applies custom className", () => {
    const { container } = render(<AutoPaySetup className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<AutoPaySetup ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
