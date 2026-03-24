import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Textarea variants for different visual states
 */
const textareaVariants = cva(
  "w-full rounded bg-semantic-bg-primary text-semantic-text-primary outline-none transition-all placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
 *
 * @example
 * ```tsx
 * <Textarea label="Description" placeholder="Enter description" />
 * <Textarea label="Notes" error="Too short" showCount maxLength={500} />
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
  /** Shows character count when maxLength is set */
  showCount?: boolean;
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
      showCount,
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
    // Internal state for character count in uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ""
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Character count
    const charCount = String(currentValue).length;

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
          maxLength={maxLength}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-sm text-semantic-error-primary"
              >
                {error}
              </span>
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
