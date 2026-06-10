import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

const consecutiveSpaceInputTypes = new Set([
  "email",
  "password",
  "search",
  "tel",
  "text",
  "url",
]);

function shouldPreventConsecutiveSpacesForType(
  type: React.HTMLInputTypeAttribute | undefined
): boolean {
  return type == null || consecutiveSpaceInputTypes.has(type);
}

function collapseConsecutiveSpaces(value: string): string {
  return value.replace(/ {2,}/g, " ");
}

function getCollapsedCursorPosition(value: string, cursorPosition: number) {
  return collapseConsecutiveSpaces(value.slice(0, cursorPosition)).length;
}

/**
 * TextField container variants for when icons/prefix/suffix are present
 */
const textFieldContainerVariants = cva(
  "relative flex items-center rounded bg-semantic-bg-primary transition-all",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        empty:
          "border border-solid border-semantic-border-input focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus-within:border-semantic-error-primary focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
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
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        empty:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
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
  /** Visual state of the text field */
  state?: "default" | "empty" | "error";
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
  /**
   * Prevents inserting a second consecutive space in text-like inputs while
   * preserving the user's current cursor position. Defaults to `true`.
   */
  preventConsecutiveSpaces?: boolean;
}

const TextField = React.forwardRef(
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
      onBeforeInput,
      onWheel,
      disabled,
      id,
      type,
      preventConsecutiveSpaces = true,
      ...props
    }: TextFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    // Internal ref for programmatic control (e.g., clearable)
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref && typeof ref === "object") ref.current = node;
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
    const shouldPreventConsecutiveSpaces =
      preventConsecutiveSpaces && shouldPreventConsecutiveSpacesForType(type);

    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (shouldPreventConsecutiveSpaces && e.target.value.includes("  ")) {
        const input = e.currentTarget;
        const rawValue = input.value;
        const rawCursor = input.selectionStart ?? rawValue.length;
        const collapsedValue = collapseConsecutiveSpaces(rawValue);
        const nextCursor = Math.min(
          getCollapsedCursorPosition(rawValue, rawCursor),
          collapsedValue.length
        );

        input.value = collapsedValue;
        window.requestAnimationFrame(() => {
          input.setSelectionRange(nextCursor, nextCursor);
        });
      }

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
            : cn(
                textFieldInputVariants({ state: derivedState, size }),
                className,
                derivedState === "error" &&
                  "border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]"
              ),
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        disabled={disabled || loading}
        maxLength={maxLength}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onBeforeInput={(e) => {
          onBeforeInput?.(e);
          if (!shouldPreventConsecutiveSpaces || e.defaultPrevented) {
            return;
          }

          const nativeEvent = e.nativeEvent as InputEvent;
          if (nativeEvent.inputType !== "insertText" || nativeEvent.data !== " ") {
            return;
          }

          const input = e.currentTarget;
          const selectionStart = input.selectionStart ?? input.value.length;
          const selectionEnd = input.selectionEnd ?? selectionStart;
          const nextValue =
            input.value.slice(0, selectionStart) +
            nativeEvent.data +
            input.value.slice(selectionEnd);

          if (nextValue.includes("  ")) {
            e.preventDefault();
            input.setSelectionRange(selectionStart, selectionStart);
            window.requestAnimationFrame(() => {
              input.setSelectionRange(selectionStart, selectionStart);
            });
          }
        }}
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
              "text-sm font-semibold text-semantic-text-secondary",
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
              inputContainerClassName,
              derivedState === "error" &&
                "border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus-within:border-semantic-error-primary focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]"
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
TextField.displayName = "TextField";

export { TextField, textFieldContainerVariants, textFieldInputVariants };
