import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * TextField container variants for when icons/prefix/suffix are present
 */
const textFieldContainerVariants = cva(
  "relative flex items-center rounded bg-semantic-bg-primary transition-all",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus-within:border-semantic-border-input-focus/50 focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus-within:border-semantic-error-primary/60 focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 bg-[var(--color-neutral-50)]",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  }
);

/**
 * TextField input variants (standalone without container)
 */
const textFieldInputVariants = cva(
  "w-full rounded bg-semantic-bg-primary text-semantic-text-primary outline-none transition-all file:border-0 file:bg-transparent file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
      size: {
        default: "h-[42px] px-4 py-2 text-base file:text-base",
        sm: "h-9 px-3 py-1.5 text-sm file:text-sm",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

/**
 * A comprehensive text field component with label, icons, validation states, and more.
 *
 * @example
 * ```tsx
 * <TextField label="Email" placeholder="Enter your email" required />
 * <TextField label="Username" error="Username is taken" />
 * <TextField label="Website" prefix="https://" suffix=".com" />
 * ```
 */
export interface TextFieldProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldInputVariants> {
  /** Size of the text field — `default` (42px) or `sm` (36px, compact) */
  size?: "default" | "sm";
  /** Label text displayed above the input */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Icon displayed on the left inside the input */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right inside the input */
  rightIcon?: React.ReactNode;
  /** Text prefix inside input (e.g., "https://") */
  prefix?: string;
  /** Text suffix inside input (e.g., ".com") */
  suffix?: string;
  /** Shows character count when maxLength is set */
  showCount?: boolean;
  /** Shows loading spinner inside input */
  loading?: boolean;
  /** Shows a clear (X) button when input has a value */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
  /** Additional class for the input container (includes prefix/suffix/icons) */
  inputContainerClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      inputContainerClassName,
      state,
      size,
      label,
      required,
      helperText,
      error,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      showCount,
      loading,
      clearable,
      onClear,
      maxLength,
      value,
      defaultValue,
      onChange,
      onWheel,
      disabled,
      id,
      type,
      ...props
    },
    ref
  ) => {
    // Internal ref for programmatic control (e.g., clearable)
    const internalRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Determine if we need the container wrapper (for icons/prefix/suffix)
    const hasAddons = leftIcon || rightIcon || prefix || suffix || loading || clearable;

    // Handle clear
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
        if (internalRef.current) {
          internalRef.current.value = "";
        }
      }
      onClear?.();
    };

    const showClearButton = clearable && String(currentValue).length > 0 && !disabled && !loading;

    // Character count
    const charCount = String(currentValue).length;

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Render the input element
    const inputElement = (
      <input
        ref={mergedRef}
        id={inputId}
        type={type}
        className={cn(
          hasAddons
            ? cn(
                "flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed",
                size === "sm" ? "text-sm" : "text-base"
              )
            : textFieldInputVariants({ state: derivedState, size, className }),
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        disabled={disabled || loading}
        maxLength={maxLength}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        onWheel={
          type === "number"
            ? (e) => {
                e.currentTarget.blur();
                onWheel?.(e);
              }
            : onWheel
        }
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
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

        {/* Input or Input Container */}
        {hasAddons ? (
          <div
            className={cn(
              textFieldContainerVariants({
                state: derivedState,
                disabled: disabled || loading,
              }),
              size === "sm" ? "h-9 px-3" : "h-[42px] px-4",
              inputContainerClassName
            )}
          >
            {prefix && (
              <span className="text-sm text-semantic-text-muted mr-2 select-none">
                {prefix}
              </span>
            )}
            {leftIcon && (
              <span className="mr-2 text-semantic-text-muted [&_svg]:size-4 flex-shrink-0">
                {leftIcon}
              </span>
            )}
            {inputElement}
            {loading && (
              <Loader2 className="animate-spin size-4 text-semantic-text-muted ml-2 flex-shrink-0" />
            )}
            {!loading && rightIcon && (
              <span className="ml-2 text-semantic-text-muted [&_svg]:size-4 flex-shrink-0">
                {rightIcon}
              </span>
            )}
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-semantic-text-muted hover:text-semantic-text-primary flex-shrink-0 cursor-pointer"
                aria-label="Clear input"
                tabIndex={-1}
              >
                <X className="size-4" />
              </button>
            )}
            {suffix && (
              <span className="text-sm text-semantic-text-muted ml-2 select-none">
                {suffix}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-semantic-text-muted">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
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
TextField.displayName = "TextField";

export { TextField, textFieldContainerVariants, textFieldInputVariants };
