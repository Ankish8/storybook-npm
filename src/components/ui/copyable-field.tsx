import * as React from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyableFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Label text displayed above the field */
  label: string;
  /** Value to display and copy */
  value: string;
  /** Helper text displayed below the field */
  helperText?: string;
  /** When true, masks the value with dots and shows eye toggle */
  secret?: boolean;
  /** Header action (e.g., "Regenerate" link) */
  headerAction?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when value is copied */
  onValueCopy?: (value: string) => void;
  /** Additional class for the input container */
  inputClassName?: string;
}

/**
 * CopyableField displays a read-only value with copy-to-clipboard functionality.
 * Supports secret mode for sensitive data like API keys and passwords.
 *
 * @example
 * ```tsx
 * // Simple copyable field
 * <CopyableField
 *   label="Base URL"
 *   value="https://api.myoperator.co/v3/voice/gateway"
 * />
 *
 * // Secret field with regenerate action
 * <CopyableField
 *   label="Authentication"
 *   value="sk_live_abc123xyz"
 *   secret
 *   helperText="Used for client-side integrations."
 *   headerAction={{
 *     label: "Regenerate",
 *     onClick: () => console.log("Regenerate clicked"),
 *   }}
 * />
 * ```
 */
export const CopyableField = React.forwardRef<HTMLDivElement, CopyableFieldProps>(
  (
    {
      label,
      value,
      helperText,
      secret = false,
      headerAction,
      onValueCopy,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(!secret);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onValueCopy?.(value);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API may fail in insecure contexts
      }
    };

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    // Display masked or actual value
    const displayValue = secret && !isVisible ? "••••••••••••••••••••" : value;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        {/* Header Row: Label + Optional Action */}
        <div className="flex items-start justify-between">
          <label className="text-sm text-semantic-text-muted tracking-[0.035px]">
            {label}
          </label>
          {headerAction && (
            <button
              type="button"
              onClick={headerAction.onClick}
              className="text-sm font-semibold text-semantic-text-muted tracking-[0.014px] hover:text-semantic-text-primary transition-colors"
            >
              {headerAction.label}
            </button>
          )}
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "flex h-11 items-center justify-between rounded border border-semantic-border-layout bg-semantic-bg-ui pl-4 pr-2.5 py-2.5",
            inputClassName
          )}
        >
          {/* Value Display */}
          <span className="text-base text-[var(--color-primary-950)] tracking-[0.08px] truncate">
            {displayValue}
          </span>

          {/* Action Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Eye Toggle (only for secret mode) */}
            {secret && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                aria-label={isVisible ? "Hide value" : "Show value"}
              >
                {isVisible ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "transition-colors",
                copied
                  ? "text-semantic-success-primary"
                  : "text-semantic-text-muted hover:text-semantic-text-primary"
              )}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
            >
              {copied ? (
                <Check className="size-[18px]" />
              ) : (
                <Copy className="size-[18px]" />
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CopyableField.displayName = "CopyableField";
