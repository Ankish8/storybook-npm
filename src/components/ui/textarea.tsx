import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Collapses runs of the space character (U+0020) so only a single space is allowed
// between segments. Newlines and other whitespace are unchanged.
// Inlined so the component is self-contained when distributed via the CLI.
const normalizeTextareaSpaces = (value: string): string =>
  String(value).replace(/ {2,}/g, " ");

// Default counter length: normalized text length (spaces count; duplicate spaces do not).
const countNonWhitespaceChars = (value: string): number =>
  normalizeTextareaSpaces(value).length;

/**
 * Textarea variants for different visual states
 */
const textareaVariants = cva(
  "w-full rounded bg-semantic-bg-primary text-semantic-text-primary outline-none transition-all placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
      },
      size: {
        default: "px-4 py-2.5 text-base",
        sm: "px-3 py-2 text-sm",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

/**
 * A multi-line text input with label, error state, helper text, character counter, and resize control.
 * With `showCount` and `maxLength`, the counter uses normalized length (single spaces
 * between words count toward the limit) unless `displayCharCount` is set. Duplicate
 * spaces are collapsed on change and in the displayed value.
 *
 * @example
 * ```tsx
 * <Textarea label="Description" placeholder="Enter description" />
 * <Textarea label="Notes" error="Too short" showCount maxLength={500} />
 * <Textarea label="Notes" showCount maxLength={5000} enforceMaxLength={false} error={overflowMsg} />
 * <Textarea label="Message" error="Invalid characters not allowed." errorIcon />
 * <Textarea label="JSON" rows={8} resize="vertical" />
 * ```
 */
export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  /** Size of the textarea — `default` or `sm` (compact) */
  size?: "default" | "sm";
  /** Label text displayed above the textarea */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Error message — shows error state with red styling */
  error?: string;
  /**
   * When true and `error` is set, shows a leading error icon with the message (field-level validation pattern).
   */
  errorIcon?: boolean;
  /** Shows character count when maxLength is set */
  showCount?: boolean;
  /**
   * When set, the counter shows this number instead of the default normalized length
   * (see `countNonWhitespaceChars` in this file).
   * Does not change native `maxLength` or stored value — display only.
   */
  displayCharCount?: number;
  /**
   * When true (default), `maxLength` is applied to the native textarea (hard limit).
   * When false, the limit is only used for `showCount` / styling — pair with `error` or parent validation for soft limits.
   */
  enforceMaxLength?: boolean;
  /** Controls CSS resize behavior. Defaults to "none" */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
}

const Textarea = React.forwardRef(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      state,
      size,
      label,
      required,
      helperText,
      error,
      errorIcon = false,
      showCount,
      displayCharCount,
      enforceMaxLength = true,
      resize = "none",
      maxLength,
      rows = 4,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    }: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    // Internal state for character count in uncontrolled mode (normalized)
    const [internalValue, setInternalValue] = React.useState(() =>
      normalizeTextareaSpaces(String(defaultValue ?? ""))
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const currentValue = isControlled
      ? normalizeTextareaSpaces(String(value ?? ""))
      : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Handle change for both controlled and uncontrolled — collapse duplicate spaces
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const normalized = normalizeTextareaSpaces(e.target.value);
      if (!isControlled) {
        setInternalValue(normalized);
      }
      if (!onChange) return;
      if (normalized === e.target.value) {
        onChange(e);
        return;
      }
      onChange({
        ...e,
        target: { ...e.target, value: normalized },
        currentTarget: { ...e.currentTarget, value: normalized },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    };

    const charCount =
      displayCharCount !== undefined
        ? displayCharCount
        : countNonWhitespaceChars(String(currentValue));

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Resize class map
    const resizeClasses: Record<string, string> = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            textareaVariants({ state: derivedState, size, className }),
            resizeClasses[resize]
          )}
          disabled={disabled}
          required={required}
          maxLength={
            enforceMaxLength !== false ? maxLength : undefined
          }
          value={currentValue}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              errorIcon ? (
                <div
                  id={errorId}
                  role="alert"
                  className="flex items-center gap-1.5 min-w-0"
                >
                  <CircleAlert
                    className="size-3.5 shrink-0 text-semantic-error-primary"
                    aria-hidden
                  />
                  <span className="text-sm text-semantic-error-primary">
                    {error}
                  </span>
                </div>
              ) : (
                <span
                  id={errorId}
                  className="text-sm text-semantic-error-primary"
                >
                  {error}
                </span>
              )
            ) : helperText ? (
              <span id={helperId} className="text-sm text-semantic-text-muted">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-sm",
                  charCount > maxLength
                    ? "text-semantic-error-primary"
                    : "text-semantic-text-muted"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
