import * as React from "react";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReadableField } from "@/components/ui/readable-field";

export interface EndpointDetailsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Variant determines field layout and visibility */
  variant?: "calling" | "whatsapp";
  /** Base URL for the API endpoint */
  baseUrl?: string;
  /** Company ID */
  companyId?: string;
  /** Authentication token (secret, masked by default in both variants) */
  authToken: string;
  /** Secret key (secret) - only shown in calling variant */
  secretKey?: string;
  /** API key (visible) - only shown in calling variant */
  apiKey?: string;
  /** Callback when a field value is copied */
  onValueCopy?: (field: string, value: string) => void;
  /** Callback when regenerate is clicked for a field */
  onRegenerate?: (field: "authToken" | "secretKey") => void;
  /** Callback when revoke access is clicked - only used in calling variant */
  onRevokeAccess?: () => void;
  /** Whether to show the revoke access section - only used in calling variant */
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
 * Supports two variants:
 * - `calling` (default): Full version with all 5 fields + revoke section
 * - `whatsapp`: Simplified with 3 fields (baseUrl, companyId, authToken), no revoke
 *
 * @example
 * ```tsx
 * // Calling API (default)
 * <EndpointDetails
 *   variant="calling"
 *   baseUrl="https://api.myoperator.co/v3/voice/gateway"
 *   companyId="12"
 *   authToken="sk_live_abc123"
 *   secretKey="whsec_xyz789"
 *   apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
 *   onRegenerate={(field) => console.log(`Regenerate ${field}`)}
 *   onRevokeAccess={() => console.log("Revoke access")}
 * />
 *
 * // WhatsApp API
 * <EndpointDetails
 *   variant="whatsapp"
 *   baseUrl="https://api.myoperator.co/whatsapp"
 *   companyId="WA-12345"
 *   authToken="waba_token_abc123"
 *   onRegenerate={(field) => console.log(`Regenerate ${field}`)}
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
      variant = "calling",
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
    const isCalling = variant === "calling";

    const handleCopy = (field: string) => (value: string) => {
      onValueCopy?.(field, value);
    };

    // Collect non-secret visible fields for the top rows
    const topFields: Array<{ label: string; value: string; field: string }> =
      [];
    if (baseUrl)
      topFields.push({ label: "Base URL", value: baseUrl, field: "baseUrl" });
    if (companyId)
      topFields.push({
        label: "Company ID",
        value: companyId,
        field: "companyId",
      });
    if (isCalling && apiKey)
      topFields.push({ label: "x-api-key", value: apiKey, field: "apiKey" });

    // Group fields into rows of 2
    const topRows: Array<typeof topFields> = [];
    for (let i = 0; i < topFields.length; i += 2) {
      topRows.push(topFields.slice(i, i + 2));
    }

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
          {/* Non-secret fields in rows of 2 */}
          {topRows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "grid gap-[25px]",
                row.length === 2 ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              {row.map((f) => (
                <ReadableField
                  key={f.field}
                  label={f.label}
                  value={f.value}
                  onValueCopy={handleCopy(f.field)}
                />
              ))}
            </div>
          ))}

          {/* Authentication field - different based on variant */}
          {isCalling ? (
            /* Calling variant: 2-col row with Authentication + Secret Key */
            <div className="grid grid-cols-2 gap-[25px]">
              <ReadableField
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
              {secretKey && (
                <ReadableField
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
              )}
            </div>
          ) : (
            /* WhatsApp variant: full-width Authentication, secret with regenerate */
            <ReadableField
              label="Authentication"
              value={authToken}
              secret
              headerAction={{
                label: "Regenerate",
                onClick: () => onRegenerate?.("authToken"),
              }}
              onValueCopy={handleCopy("authToken")}
            />
          )}

          {/* Revoke Section - only for calling variant */}
          {isCalling && showRevokeSection && (
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
                className="flex items-center gap-1 text-sm text-semantic-error-primary hover:text-semantic-error-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-error-primary transition-colors tracking-[0.035px] rounded"
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
