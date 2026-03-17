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

  it("does not render 'Show details' link when onShowDetails and detailsContent are not provided", () => {
    render(<LetUsDriveCard {...defaultProps} />);
    expect(screen.queryByText("Show details")).not.toBeInTheDocument();
  });

  it("renders 'Show details' link and expandable Includes when detailsContent is provided", () => {
    const detailsContent = {
      heading: "Includes:",
      items: [
        { title: "Item A", description: "Description A." },
        { title: "Item B", description: "Description B." },
      ],
    };
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={detailsContent}
        onCtaClick={vi.fn()}
      />
    );
    expect(screen.getByText("Show details")).toBeInTheDocument();
    expect(screen.queryByText("Includes:")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Show details"));
    expect(screen.getByText("Hide details")).toBeInTheDocument();
    expect(screen.getByText("Includes:")).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Description A.")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
  });

  it("calls onExpandedChange when toggling details with detailsContent", () => {
    const onExpandedChange = vi.fn();
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "X", description: "Y" }],
        }}
        onExpandedChange={onExpandedChange}
        onCtaClick={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Show details"));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText("Hide details"));
    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });

  it("shows Hide details and content when expanded is true (controlled)", () => {
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "Bold", description: "Regular text." }],
        }}
        expanded
        onCtaClick={vi.fn()}
      />
    );
    expect(screen.getByText("Hide details")).toBeInTheDocument();
    expect(screen.getByText("Includes:")).toBeInTheDocument();
    expect(screen.getByText("Bold")).toBeInTheDocument();
    expect(screen.getByText("Regular text.")).toBeInTheDocument();
  });

  it("uses custom hideDetailsLabel when expanded", () => {
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "A", description: "B" }],
        }}
        hideDetailsLabel="Collapse"
        expanded
        onCtaClick={vi.fn()}
      />
    );
    expect(screen.getByText("Collapse")).toBeInTheDocument();
  });

  it("renders expanded details with border above Includes heading", () => {
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "X", description: "Y" }],
        }}
        expanded
        onCtaClick={vi.fn()}
      />
    );
    const block = screen.getByTestId("let-us-drive-details-block");
    expect(block).toBeInTheDocument();
    expect(block).toHaveClass("border-t");
    expect(block).toHaveClass("border-semantic-border-layout");
  });

  it("renders Hide details link below the bullet points when expanded", () => {
    const { container } = render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "First", description: "Desc" }],
        }}
        expanded
        onCtaClick={vi.fn()}
      />
    );
    const block = screen.getByTestId("let-us-drive-details-block");
    const hideDetailsLink = screen.getByText("Hide details");
    expect(block).toBeInTheDocument();
    expect(hideDetailsLink).toBeInTheDocument();
    const actionsSection = block.parentElement;
    expect(actionsSection).toBeTruthy();
    const siblings = Array.from(actionsSection?.children ?? []);
    const blockIndex = siblings.indexOf(block);
    const linkButton = hideDetailsLink.closest("button");
    const linkIndex = linkButton
      ? siblings.indexOf(linkButton)
      : -1;
    expect(blockIndex).toBeGreaterThanOrEqual(0);
    expect(linkIndex).toBeGreaterThan(blockIndex);
  });

  it("renders green checkmark icons in details list when expanded", () => {
    const { container } = render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [
            { title: "A", description: "B" },
            { title: "C", description: "D" },
          ],
        }}
        expanded
        onCtaClick={vi.fn()}
      />
    );
    const list = container.querySelector("ul[aria-label='Included features']");
    expect(list).toBeInTheDocument();
    const checkIcons = list?.querySelectorAll(".text-semantic-success-primary");
    expect(checkIcons?.length).toBe(2);
  });

  it("does not show Show details link when expanded (only Hide details below list)", () => {
    render(
      <LetUsDriveCard
        {...defaultProps}
        detailsContent={{
          heading: "Includes:",
          items: [{ title: "A", description: "B" }],
        }}
        expanded
        onCtaClick={vi.fn()}
      />
    );
    expect(screen.queryByText("Show details")).not.toBeInTheDocument();
    expect(screen.getByText("Hide details")).toBeInTheDocument();
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
