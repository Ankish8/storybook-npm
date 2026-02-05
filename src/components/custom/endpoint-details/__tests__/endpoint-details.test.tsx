import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EndpointDetails } from "../endpoint-details";

describe("EndpointDetails", () => {
  // Default props for calling variant (requires secretKey and apiKey)
  const callingProps = {
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_abc123xyz",
    secretKey: "whsec_def456uvw",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  };

  // Minimal props for whatsapp variant
  const whatsappProps = {
    baseUrl: "https://api.myoperator.co/whatsapp",
    companyId: "WA-12345",
    authToken: "waba_token_abc123",
  };

  describe("calling variant (default)", () => {
    it("renders correctly with required props", () => {
      render(<EndpointDetails {...callingProps} />);

      expect(screen.getByText("Endpoint Details")).toBeInTheDocument();
      expect(screen.getByText("Base URL")).toBeInTheDocument();
      expect(screen.getByText("Company ID")).toBeInTheDocument();
      expect(screen.getByText("Authentication")).toBeInTheDocument();
      expect(screen.getByText("Secret Key")).toBeInTheDocument();
      expect(screen.getByText("x-api-key")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(<EndpointDetails {...callingProps} title="API Credentials" />);

      expect(screen.getByText("API Credentials")).toBeInTheDocument();
    });

    it("displays base URL and company ID values", () => {
      render(<EndpointDetails {...callingProps} />);

      expect(
        screen.getByText("https://api.myoperator.co/v3/voice/gateway")
      ).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("displays API key value", () => {
      render(<EndpointDetails {...callingProps} />);

      expect(
        screen.getByText("tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO")
      ).toBeInTheDocument();
    });

    it("masks secret fields by default", () => {
      render(<EndpointDetails {...callingProps} />);

      // Should show masked values for auth token and secret key
      const maskedValues = screen.getAllByText("••••••••••••••••••••");
      expect(maskedValues).toHaveLength(2);
    });

    it("renders regenerate buttons for secret fields", () => {
      render(<EndpointDetails {...callingProps} />);

      const regenerateButtons = screen.getAllByText("Regenerate");
      expect(regenerateButtons).toHaveLength(2);
    });

    it("calls onRegenerate when regenerate is clicked", () => {
      const onRegenerate = vi.fn();
      render(<EndpointDetails {...callingProps} onRegenerate={onRegenerate} />);

      const regenerateButtons = screen.getAllByText("Regenerate");
      fireEvent.click(regenerateButtons[0]);

      expect(onRegenerate).toHaveBeenCalledWith("authToken");
    });

    it("calls onRegenerate with secretKey when second regenerate is clicked", () => {
      const onRegenerate = vi.fn();
      render(<EndpointDetails {...callingProps} onRegenerate={onRegenerate} />);

      const regenerateButtons = screen.getAllByText("Regenerate");
      fireEvent.click(regenerateButtons[1]);

      expect(onRegenerate).toHaveBeenCalledWith("secretKey");
    });

    it("renders revoke section by default", () => {
      render(<EndpointDetails {...callingProps} />);

      expect(screen.getByText("Revoke API Access")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Revoking access will immediately disable all integrations using these keys."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Revoke Access")).toBeInTheDocument();
    });

    it("hides revoke section when showRevokeSection is false", () => {
      render(<EndpointDetails {...callingProps} showRevokeSection={false} />);

      expect(screen.queryByText("Revoke API Access")).not.toBeInTheDocument();
      expect(screen.queryByText("Revoke Access")).not.toBeInTheDocument();
    });

    it("calls onRevokeAccess when revoke button is clicked", () => {
      const onRevokeAccess = vi.fn();
      render(<EndpointDetails {...callingProps} onRevokeAccess={onRevokeAccess} />);

      fireEvent.click(screen.getByText("Revoke Access"));

      expect(onRevokeAccess).toHaveBeenCalledTimes(1);
    });

    it("renders custom revoke title and description", () => {
      render(
        <EndpointDetails
          {...callingProps}
          revokeTitle="Delete API Keys"
          revokeDescription="This action cannot be undone."
        />
      );

      expect(screen.getByText("Delete API Keys")).toBeInTheDocument();
      expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    });

    it("renders helper text for secret fields", () => {
      render(<EndpointDetails {...callingProps} />);

      expect(
        screen.getByText("Used for client-side integrations.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Never share this key or expose it in client-side code.")
      ).toBeInTheDocument();
    });

    it("works without secretKey", () => {
      const { secretKey, ...propsWithoutSecretKey } = callingProps;
      render(<EndpointDetails {...propsWithoutSecretKey} />);

      expect(screen.queryByText("Secret Key")).not.toBeInTheDocument();
      // Only one regenerate button (for authToken)
      const regenerateButtons = screen.getAllByText("Regenerate");
      expect(regenerateButtons).toHaveLength(1);
    });

    it("works without apiKey", () => {
      const { apiKey, ...propsWithoutApiKey } = callingProps;
      render(<EndpointDetails {...propsWithoutApiKey} />);

      expect(screen.queryByText("x-api-key")).not.toBeInTheDocument();
    });

    it("works without companyId", () => {
      const { companyId, ...propsWithoutCompanyId } = callingProps;
      render(<EndpointDetails {...propsWithoutCompanyId} />);

      expect(screen.queryByText("Company ID")).not.toBeInTheDocument();
      expect(screen.getByText("Base URL")).toBeInTheDocument();
    });

    it("works without baseUrl — companyId and apiKey appear in first row", () => {
      const { baseUrl, ...propsWithoutBaseUrl } = callingProps;
      render(<EndpointDetails {...propsWithoutBaseUrl} />);

      expect(screen.queryByText("Base URL")).not.toBeInTheDocument();
      expect(screen.getByText("Company ID")).toBeInTheDocument();
      expect(screen.getByText("x-api-key")).toBeInTheDocument();
      expect(screen.getByText("Authentication")).toBeInTheDocument();
    });
  });

  describe("whatsapp variant", () => {
    it("renders only 3 fields", () => {
      render(<EndpointDetails variant="whatsapp" {...whatsappProps} />);

      expect(screen.getByText("Endpoint Details")).toBeInTheDocument();
      expect(screen.getByText("Base URL")).toBeInTheDocument();
      expect(screen.getByText("Company ID")).toBeInTheDocument();
      expect(screen.getByText("Authentication")).toBeInTheDocument();

      // Should NOT show secretKey, apiKey, or revoke section
      expect(screen.queryByText("Secret Key")).not.toBeInTheDocument();
      expect(screen.queryByText("x-api-key")).not.toBeInTheDocument();
      expect(screen.queryByText("Revoke API Access")).not.toBeInTheDocument();
    });

    it("displays authentication token as visible (not masked)", () => {
      render(<EndpointDetails variant="whatsapp" {...whatsappProps} />);

      // Auth token should be visible, not masked
      expect(screen.getByText("waba_token_abc123")).toBeInTheDocument();
      // Should not have masked values
      expect(screen.queryByText("••••••••••••••••••••")).not.toBeInTheDocument();
    });

    it("does not show regenerate button for authentication", () => {
      render(<EndpointDetails variant="whatsapp" {...whatsappProps} />);

      expect(screen.queryByText("Regenerate")).not.toBeInTheDocument();
    });

    it("does not show revoke section even with showRevokeSection true", () => {
      render(
        <EndpointDetails
          variant="whatsapp"
          {...whatsappProps}
          showRevokeSection={true}
        />
      );

      expect(screen.queryByText("Revoke API Access")).not.toBeInTheDocument();
      expect(screen.queryByText("Revoke Access")).not.toBeInTheDocument();
    });

    it("does not show helper text for authentication", () => {
      render(<EndpointDetails variant="whatsapp" {...whatsappProps} />);

      expect(
        screen.queryByText("Used for client-side integrations.")
      ).not.toBeInTheDocument();
    });

    it("ignores secretKey and apiKey props if provided", () => {
      render(
        <EndpointDetails
          variant="whatsapp"
          {...whatsappProps}
          secretKey="should-be-ignored"
          apiKey="should-be-ignored"
        />
      );

      expect(screen.queryByText("Secret Key")).not.toBeInTheDocument();
      expect(screen.queryByText("x-api-key")).not.toBeInTheDocument();
      expect(screen.queryByText("should-be-ignored")).not.toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(
        <EndpointDetails
          variant="whatsapp"
          {...whatsappProps}
          title="WhatsApp API"
        />
      );

      expect(screen.getByText("WhatsApp API")).toBeInTheDocument();
    });
  });

  describe("common behavior", () => {
    it("applies custom className", () => {
      const { container } = render(
        <EndpointDetails {...callingProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = vi.fn();
      render(<EndpointDetails {...callingProps} ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional props to root element", () => {
      render(<EndpointDetails {...callingProps} data-testid="endpoint-details" />);

      expect(screen.getByTestId("endpoint-details")).toBeInTheDocument();
    });

    it("has correct container styles", () => {
      const { container } = render(<EndpointDetails {...callingProps} />);
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
});
