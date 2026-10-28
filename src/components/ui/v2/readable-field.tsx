import * as React from "react";
import { Copy, Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadableFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
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
    /** When true, button is shown but non-interactive */
    disabled?: boolean;
    /** Tooltip text shown on hover when disabled */
    disabledTooltip?: string;
  };
  /** Callback when value is copied */
  onValueCopy?: (value: string) => void;
  /** Additional class for the input container */
  inputClassName?: string;
}

/**
 * ReadableField displays a read-only value with copy-to-clipboard functionality.
 * Supports secret mode for sensitive data like API keys and passwords.
 *
 * @example
 * ```tsx
 * // Simple readable field
 * <ReadableField
 *   label="Base URL"
 *   value="https://api.myoperator.co/v3/voice/gateway"
 * />
 *
 * // Secret field with regenerate action
 * <ReadableField
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
export const ReadableField = React.forwardRef(
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
    }: ReadableFieldProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [copyState, setCopyState] = React.useState<
      "idle" | "copied" | "failed"
    >("idle");
    const copied = copyState === "copied";
    const failed = copyState === "failed";
    const valueRef = React.useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = React.useState(!secret);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync visibility state when secret prop changes
    React.useEffect(() => {
      setIsVisible(!secret);
    }, [secret]);

    // Cleanup timeout on unmount to prevent memory leaks
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Leaves the value selected so Cmd/Ctrl+C still works when the Clipboard API refuses (insecure context,
    // denied permission). A masked secret is not selected: copying the dots would be misleading.
    const selectValue = () => {
      const node = valueRef.current;
      const selection = window.getSelection?.();
      if (!node || !selection || (secret && !isVisible)) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const handleCopy = async () => {
      let copiedOk = false;
      try {
        await navigator.clipboard.writeText(value);
        copiedOk = true;
      } catch {
        selectValue();
      }
      setCopyState(copiedOk ? "copied" : "failed");
      if (copiedOk) {
        try {
          onValueCopy?.(value);
        } catch {
          // as before, a throwing consumer callback never undoes the copied state
        }
      }

      // Clear existing timeout before setting new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopyState("idle"), 2000);
    };

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    // Display masked or actual value
    const displayValue = secret && !isVisible ? "••••••••••••••••••••" : value;

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-w-0 flex-col gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal",
          className
        )}
        {...props}
      >
        {/* Header Row: Label + Optional Action */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-primary,#484848)]">
            {label}
          </span>
          {headerAction &&
            (headerAction.disabled ? (
              <span className="relative inline-flex group/regen-action">
                <button
                  type="button"
                  disabled
                  className="text-sm font-medium leading-[1.4] text-[var(--v2-text-muted,#707070)] tracking-[0.014px] opacity-50 cursor-not-allowed rounded"
                >
                  {headerAction.label}
                </button>
                {headerAction.disabledTooltip && (
                  <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded bg-v2-semantic-primary px-2 py-1 text-xs text-v2-semantic-text-inverted opacity-0 transition-opacity group-hover/regen-action:opacity-100 z-10">
                    {headerAction.disabledTooltip}
                    <span className="absolute top-full right-2 border-4 border-solid border-transparent border-t-v2-semantic-primary" />
                  </span>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={headerAction.onClick}
                className="text-sm font-medium leading-[1.4] text-[var(--v2-text-muted,#707070)] tracking-[0.014px] hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] rounded transition-colors duration-150"
              >
                {headerAction.label}
              </button>
            ))}
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "flex h-11 min-w-0 items-center justify-between gap-3 rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-3",
            inputClassName
          )}
        >
          {/* Value Display */}
          <span
            ref={valueRef}
            className={cn(
              "text-sm font-normal leading-[1.4] text-[var(--v2-text-muted,#707070)] tracking-[-0.01em] truncate",
              !(secret && !isVisible) && "select-all"
            )}
          >
            {displayValue}
          </span>

          {/* Action Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Eye Toggle (only for secret mode) */}
            {secret && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="transition-[color,transform] [transition-duration:180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] active:[transition-duration:80ms] active:scale-[0.96] motion-reduce:active:scale-100 text-[var(--v2-text-muted,#707070)] hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] rounded"
                aria-label={isVisible ? "Hide value" : "Show value"}
              >
                {isVisible ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            )}

            {/* Copy Button: a fixed 18px box holding three stacked icons that cross-fade, so the
                button never changes size and no icon is mounted or unmounted. */}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "relative size-[18px] rounded transition-[color,transform] [transition-duration:180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] active:[transition-duration:80ms] active:scale-[0.96] motion-reduce:active:scale-100 focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
                copied
                  ? "text-v2-semantic-success-primary"
                  : failed
                    ? "text-v2-semantic-error-primary"
                    : "text-[var(--v2-text-muted,#707070)] hover:text-[var(--v2-text-primary,#484848)]"
              )}
              aria-label={
                copied ? "Copied" : failed ? "Copy failed" : "Copy to clipboard"
              }
            >
              <Copy
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 size-[18px] transition-[opacity,transform] [transition-duration:180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:[transition-property:opacity]",
                  copied || failed
                    ? "scale-[0.8] opacity-0 motion-reduce:scale-100"
                    : "scale-100 opacity-100"
                )}
              />
              <Check
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 size-[18px] transition-[opacity,transform] [transition-duration:180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:[transition-property:opacity]",
                  copied
                    ? "scale-100 opacity-100"
                    : "scale-[0.8] opacity-0 motion-reduce:scale-100"
                )}
              />
              <X
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 size-[18px] transition-[opacity,transform] [transition-duration:180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:[transition-property:opacity]",
                  failed
                    ? "scale-100 opacity-100"
                    : "scale-[0.8] opacity-0 motion-reduce:scale-100"
                )}
              />
            </button>
          </div>
        </div>

        {/* Always rendered so assistive tech sees the change in an existing live region. The button's
            aria-label already says the same, but label changes on a focused button are not reliably spoken. */}
        <span role="status" className="sr-only">
          {copied ? "Copied" : failed ? "Copy failed" : ""}
        </span>

        {/* Helper Text */}
        {helperText && (
          <p className="m-0 text-xs leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-muted,#707070)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ReadableField.displayName = "ReadableField";
