import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ApiFeatureCard } from "../api-feature-card";
import { Phone } from "lucide-react";

describe("ApiFeatureCard", () => {
  const defaultProps = {
    icon: <Phone data-testid="icon" />,
    title: "Calling API",
    description: "Manage real-time call flow and recordings.",
  };

  it("renders correctly with required props", () => {
    render(<ApiFeatureCard {...defaultProps} />);

    expect(screen.getByText("Calling API")).toBeInTheDocument();
    expect(
      screen.getByText("Manage real-time call flow and recordings.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders action button with default label", () => {
    render(<ApiFeatureCard {...defaultProps} />);

    expect(screen.getByRole("button", { name: /manage/i })).toBeInTheDocument();
  });

  it("renders action button with custom label", () => {
    render(<ApiFeatureCard {...defaultProps} actionLabel="Configure" />);

    expect(
      screen.getByRole("button", { name: /configure/i })
    ).toBeInTheDocument();
  });

  it("calls onAction when button is clicked", () => {
    const onAction = vi.fn();
    render(<ApiFeatureCard {...defaultProps} onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: /manage/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders capabilities when provided", () => {
    const capabilities = [
      { id: "1", label: "Real-time Call Control" },
      { id: "2", label: "Live Call Events (Webhooks)" },
      { id: "3", label: "IVR & Smart Routing" },
    ];

    render(<ApiFeatureCard {...defaultProps} capabilities={capabilities} />);

    expect(screen.getByText("Real-time Call Control")).toBeInTheDocument();
    expect(screen.getByText("Live Call Events (Webhooks)")).toBeInTheDocument();
    expect(screen.getByText("IVR & Smart Routing")).toBeInTheDocument();
  });

  it("renders capabilities section label", () => {
    const capabilities = [{ id: "1", label: "Feature" }];

    render(<ApiFeatureCard {...defaultProps} capabilities={capabilities} />);

    expect(screen.getByText("Key Capabilities")).toBeInTheDocument();
  });

  it("renders custom capabilities label", () => {
    const capabilities = [{ id: "1", label: "Feature" }];

    render(
      <ApiFeatureCard
        {...defaultProps}
        capabilities={capabilities}
        capabilitiesLabel="Main Features"
      />
    );

    expect(screen.getByText("Main Features")).toBeInTheDocument();
  });

  it("does not render capabilities section when empty", () => {
    render(<ApiFeatureCard {...defaultProps} capabilities={[]} />);

    expect(screen.queryByText("Key Capabilities")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ApiFeatureCard {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<ApiFeatureCard {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(<ApiFeatureCard {...defaultProps} data-testid="api-card" />);

    expect(screen.getByTestId("api-card")).toBeInTheDocument();
  });

  it("renders with action icon", () => {
    render(
      <ApiFeatureCard
        {...defaultProps}
        actionIcon={<Phone data-testid="action-icon" />}
      />
    );

    expect(screen.getByTestId("action-icon")).toBeInTheDocument();
  });

  it("has correct base styles", () => {
    const { container } = render(<ApiFeatureCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("flex");
    expect(card).toHaveClass("flex-col");
    expect(card).toHaveClass("gap-6");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("border-semantic-border-layout");
    expect(card).toHaveClass("bg-semantic-bg-primary");
    expect(card).toHaveClass("p-6");
  });

  it("renders icon container with correct styles", () => {
    render(<ApiFeatureCard {...defaultProps} />);

    const iconContainer =
      screen.getByTestId("icon").parentElement?.parentElement;
    expect(iconContainer).toHaveClass("h-11");
    expect(iconContainer).toHaveClass("w-11");
    expect(iconContainer).toHaveClass("rounded-[10px]");
    expect(iconContainer).toHaveClass("bg-semantic-info-surface");
  });

  it("renders bullet dots with gray color", () => {
    const capabilities = [{ id: "1", label: "Feature" }];
    const { container } = render(
      <ApiFeatureCard {...defaultProps} capabilities={capabilities} />
    );

    const dot = container.querySelector(".rounded-full");
    expect(dot).toHaveClass("bg-[var(--color-neutral-400)]");
  });
});
