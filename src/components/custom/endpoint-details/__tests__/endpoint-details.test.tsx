import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EndpointDetails } from "../endpoint-details";

describe("EndpointDetails", () => {
  const defaultProps = {
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_abc123xyz",
    secretKey: "whsec_def456uvw",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  };

  it("renders correctly with required props", () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(screen.getByText("Endpoint Details")).toBeInTheDocument();
    expect(screen.getByText("Base URL")).toBeInTheDocument();
    expect(screen.getByText("Company ID")).toBeInTheDocument();
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Secret Key")).toBeInTheDocument();
    expect(screen.getByText("x-api-key")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<EndpointDetails {...defaultProps} title="API Credentials" />);

    expect(screen.getByText("API Credentials")).toBeInTheDocument();
  });

  it("displays base URL and company ID values", () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(
      screen.getByText("https://api.myoperator.co/v3/voice/gateway")
    ).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("displays API key value", () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(
      screen.getByText("tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO")
    ).toBeInTheDocument();
  });

  it("masks secret fields by default", () => {
    render(<EndpointDetails {...defaultProps} />);

    // Should show masked values for auth token and secret key
    const maskedValues = screen.getAllByText("••••••••••••••••••••");
    expect(maskedValues).toHaveLength(2);
  });

  it("renders regenerate buttons for secret fields", () => {
    render(<EndpointDetails {...defaultProps} />);

    const regenerateButtons = screen.getAllByText("Regenerate");
    expect(regenerateButtons).toHaveLength(2);
  });

  it("calls onRegenerate when regenerate is clicked", () => {
    const onRegenerate = vi.fn();
    render(<EndpointDetails {...defaultProps} onRegenerate={onRegenerate} />);

    const regenerateButtons = screen.getAllByText("Regenerate");
    fireEvent.click(regenerateButtons[0]);

    expect(onRegenerate).toHaveBeenCalledWith("authToken");
  });

  it("calls onRegenerate with secretKey when second regenerate is clicked", () => {
    const onRegenerate = vi.fn();
    render(<EndpointDetails {...defaultProps} onRegenerate={onRegenerate} />);

    const regenerateButtons = screen.getAllByText("Regenerate");
    fireEvent.click(regenerateButtons[1]);

    expect(onRegenerate).toHaveBeenCalledWith("secretKey");
  });

  it("renders revoke section by default", () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(screen.getByText("Revoke API Access")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Revoking access will immediately disable all integrations using these keys."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Revoke Access")).toBeInTheDocument();
  });

  it("hides revoke section when showRevokeSection is false", () => {
    render(<EndpointDetails {...defaultProps} showRevokeSection={false} />);

    expect(screen.queryByText("Revoke API Access")).not.toBeInTheDocument();
    expect(screen.queryByText("Revoke Access")).not.toBeInTheDocument();
  });

  it("calls onRevokeAccess when revoke button is clicked", () => {
    const onRevokeAccess = vi.fn();
    render(<EndpointDetails {...defaultProps} onRevokeAccess={onRevokeAccess} />);

    fireEvent.click(screen.getByText("Revoke Access"));

    expect(onRevokeAccess).toHaveBeenCalledTimes(1);
  });

  it("renders custom revoke title and description", () => {
    render(
      <EndpointDetails
        {...defaultProps}
        revokeTitle="Delete API Keys"
        revokeDescription="This action cannot be undone."
      />
    );

    expect(screen.getByText("Delete API Keys")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("renders helper text for secret fields", () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(
      screen.getByText("Used for client-side integrations.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Never share this key or expose it in client-side code.")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <EndpointDetails {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<EndpointDetails {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(<EndpointDetails {...defaultProps} data-testid="endpoint-details" />);

    expect(screen.getByTestId("endpoint-details")).toBeInTheDocument();
  });

  it("has correct container styles", () => {
    const { container } = render(<EndpointDetails {...defaultProps} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("flex");
    expect(card).toHaveClass("flex-col");
    expect(card).toHaveClass("gap-6");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("border-semantic-border-layout");
    expect(card).toHaveClass("p-6");
  });
});
