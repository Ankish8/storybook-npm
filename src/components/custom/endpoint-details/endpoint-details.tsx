import * as React from "react";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyableField } from "@/components/ui/copyable-field";

export interface EndpointCredential {
  /** Unique identifier */
  id: string;
  /** Field label */
  label: string;
  /** Field value */
  value: string;
  /** Helper text below the field */
  helperText?: string;
  /** Whether this is a secret field (masked with eye toggle) */
  secret?: boolean;
  /** Whether to show regenerate action */
  showRegenerate?: boolean;
}

export interface EndpointDetailsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Base URL for the API endpoint */
  baseUrl: string;
  /** Company ID */
  companyId: string;
  /** Authentication token (secret) */
  authToken: string;
  /** Secret key (secret) */
  secretKey: string;
  /** API key (visible) */
  apiKey: string;
  /** Callback when a field value is copied */
  onValueCopy?: (field: string, value: string) => void;
  /** Callback when regenerate is clicked for a field */
  onRegenerate?: (field: "authToken" | "secretKey") => void;
  /** Callback when revoke access is clicked */
  onRevokeAccess?: () => void;
  /** Whether to show the revoke access section */
  showRevokeSection?: boolean;
  /** Custom revoke section title */
  revokeTitle?: string;
  /** Custom revoke section description */
  revokeDescription?: string;
}

/**
 * EndpointDetails displays API endpoint credentials with copy functionality.
 * Used for showing API keys, authentication tokens, and other sensitive credentials.
 *
 * @example
 * ```tsx
 * <EndpointDetails
 *   baseUrl="https://api.myoperator.co/v3/voice/gateway"
 *   companyId="12"
 *   authToken="sk_live_abc123"
 *   secretKey="whsec_xyz789"
 *   apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
 *   onRegenerate={(field) => console.log(`Regenerate ${field}`)}
 *   onRevokeAccess={() => console.log("Revoke access")}
 * />
 * ```
 */
export const EndpointDetails = React.forwardRef<
  HTMLDivElement,
  EndpointDetailsProps
>(
  (
    {
      title = "Endpoint Details",
      baseUrl,
      companyId,
      authToken,
      secretKey,
      apiKey,
      onValueCopy,
      onRegenerate,
      onRevokeAccess,
      showRevokeSection = true,
      revokeTitle = "Revoke API Access",
      revokeDescription = "Revoking access will immediately disable all integrations using these keys.",
      className,
      ...props
    },
    ref
  ) => {
    const handleCopy = (field: string) => (value: string) => {
      onValueCopy?.(field, value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-lg border border-semantic-border-layout p-6",
          className
        )}
        {...props}
      >
        {/* Title */}
        <div className="flex items-start gap-5">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            {title}
          </h2>
        </div>

        {/* Credentials Grid */}
        <div className="flex flex-col gap-[30px]">
          {/* Row 1: Base URL + Company ID */}
          <div className="grid grid-cols-2 gap-[25px]">
            <CopyableField
              label="Base URL"
              value={baseUrl}
              onValueCopy={handleCopy("baseUrl")}
            />
            <CopyableField
              label="Company ID"
              value={companyId}
              onValueCopy={handleCopy("companyId")}
            />
          </div>

          {/* Row 2: Authentication + Secret Key */}
          <div className="grid grid-cols-2 gap-[25px]">
            <CopyableField
              label="Authentication"
              value={authToken}
              secret
              helperText="Used for client-side integrations."
              headerAction={{
                label: "Regenerate",
                onClick: () => onRegenerate?.("authToken"),
              }}
              onValueCopy={handleCopy("authToken")}
            />
            <CopyableField
              label="Secret Key"
              value={secretKey}
              secret
              helperText="Never share this key or expose it in client-side code."
              headerAction={{
                label: "Regenerate",
                onClick: () => onRegenerate?.("secretKey"),
              }}
              onValueCopy={handleCopy("secretKey")}
            />
          </div>

          {/* Row 3: x-api-key (full width) */}
          <CopyableField
            label="x-api-key"
            value={apiKey}
            onValueCopy={handleCopy("apiKey")}
          />

          {/* Revoke Section */}
          {showRevokeSection && (
            <div className="flex items-center justify-between border-t border-semantic-border-layout pt-6">
              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
                  {revokeTitle}
                </h3>
                <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
                  {revokeDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={onRevokeAccess}
                className="flex items-center gap-1 text-sm text-semantic-error-primary hover:text-semantic-error-hover transition-colors tracking-[0.035px]"
              >
                <XCircle className="size-4" />
                <span>Revoke Access</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EndpointDetails.displayName = "EndpointDetails";
