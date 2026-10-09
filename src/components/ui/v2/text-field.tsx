import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Measures copy as it wraps or changes, so opening, replacement and closing all animate height. */
function FieldFeedback({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const content = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  const reduced = useReducedMotion() ?? false;
  React.useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const measure = () => setHeight(node.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);
  return (
    <motion.div
      data-field-feedback=""
      initial={false}
      animate={{
        height: active ? (height ?? "auto") : 0,
        opacity: active ? 1 : 0,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              // Arc: the row opens its height on a critically damped spring while the opacity follows in 160ms.
              height: { type: "spring", visualDuration: 0.4, bounce: 0 },
              opacity: { duration: 0.16 },
            }
      }
      className="min-w-0 overflow-hidden"
    >
      <div ref={content} className={className}>
        {children}
      </div>
    </motion.div>
  );
}

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
  "relative flex items-center rounded-lg bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input hover:border-semantic-primary focus-within:shadow-none",
        empty:
          "border border-solid border-semantic-border-input hover:border-semantic-primary focus-within:shadow-none",
        error:
          "border border-solid border-semantic-error-primary focus-within:shadow-none",
      },
      disabled: {
        true: "cursor-not-allowed bg-semantic-bg-ui shadow-none hover:border-semantic-border-input",
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
  "w-full rounded-lg bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-[var(--v2-text-secondary,#5E5E5E)] leading-[1.4] tracking-[-0.01em] outline-none transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] file:border-0 file:bg-transparent file:font-medium file:text-[var(--v2-text-primary,#484848)] placeholder:text-[var(--v2-text-placeholder,#707070)] disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input enabled:hover:border-semantic-primary focus:outline-none focus:shadow-none",
        empty:
          "border border-solid border-semantic-border-input enabled:hover:border-semantic-primary focus:outline-none focus:shadow-none",
        error:
          "border border-solid border-semantic-error-primary focus:outline-none focus:shadow-none",
      },
      size: {
        default: "h-11 px-3 py-0 text-sm leading-[1.4] file:text-sm",
        sm: "h-9 px-3 py-0 text-xs leading-[1.4] file:text-xs",
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
  /** Size of the text field — `default` (44px) or `sm` (36px, compact) */
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
        // Restore the caret synchronously: assigning `value` above parks it at
        // 0, and the next keystroke can land before any animation frame runs,
        // which reorders what the user typed. The deferred pass is kept for
        // browsers that reset the caret again after React re-renders, but it
        // must no-op once the value has moved on — a frame that fires mid-typing
        // would otherwise drag the caret back to a stale position.
        input.setSelectionRange(nextCursor, nextCursor);
        window.requestAnimationFrame(() => {
          if (input.value !== collapsedValue) return;
          input.setSelectionRange(nextCursor, nextCursor);
        });
      }

      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Determine if we need the container wrapper (for icons/prefix/suffix)
    const hasAddons =
      leftIcon || rightIcon || prefix || suffix || loading || clearable;

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

    const showClearButton =
      clearable && String(currentValue).length > 0 && !disabled && !loading;

    // Character count
    const charCount = String(currentValue).length;

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Reveal the message row only when it appears after the field did, never on first render
    // (a page of fields with helper text must not unfold on load).
    const hasMessage = Boolean(error || helperText || (showCount && maxLength));
    const reducedMotion = useReducedMotion() ?? false;
    const copyMotion = {
      initial: reducedMotion
        ? (false as const)
        : { opacity: 0, y: "0.35em", filter: "blur(4px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: {
        duration: reducedMotion ? 0 : 0.24,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    };

    // Render the input element
    const inputElement = (
      <input
        ref={mergedRef}
        id={inputId}
        type={type}
        className={cn(
          hasAddons
            ? cn(
                "min-w-0 flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] disabled:cursor-not-allowed",
                size === "sm"
                  ? "font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs leading-[1.4]"
                  : "text-sm leading-[1.4]"
              )
            : cn(
                textFieldInputVariants({ state: derivedState, size }),
                className,
                derivedState === "error" &&
                  !disabled &&
                  !loading &&
                  "border-semantic-error-primary focus:shadow-none"
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
          if (
            nativeEvent.inputType !== "insertText" ||
            nativeEvent.data !== " "
          ) {
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
            // Blocking the insertion is enough — nothing moved, so the caret is
            // already where it belongs. Re-setting it from a later animation
            // frame, with an offset captured before this keystroke, drags the
            // caret backwards and reorders what follows.
            e.preventDefault();
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
      <div
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] flex flex-col",
          wrapperClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "mb-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-primary,#484848)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-text ml-0.5">*</span>
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
              size === "sm" ? "h-9 px-3" : "h-11 px-3",
              disabled && "opacity-50",
              inputContainerClassName,
              derivedState === "error" &&
                !disabled &&
                !loading &&
                "border-semantic-error-primary focus-within:shadow-none"
            )}
          >
            {prefix && (
              <span className="text-sm text-[var(--v2-text-muted,#707070)] mr-2 select-none">
                {prefix}
              </span>
            )}
            {leftIcon && (
              <span className="mr-2 text-[var(--v2-text-muted,#707070)] [&_svg]:size-4 flex-shrink-0">
                {leftIcon}
              </span>
            )}
            {inputElement}
            {loading && (
              <Loader2 className="animate-spin motion-reduce:[animation-duration:2s] size-4 text-[var(--v2-text-muted,#707070)] ml-2 flex-shrink-0" />
            )}
            {!loading && rightIcon && (
              <span className="ml-2 text-[var(--v2-text-muted,#707070)] [&_svg]:size-4 flex-shrink-0">
                {rightIcon}
              </span>
            )}
            {/* Stays mounted so it can fade out as well as in. While hidden it drops its
                aria-label (so it is not offered as "Clear input"), is not focusable or
                clickable (visibility + pointer-events + tabindex -1), and its -ml-6 cancels its own
                24px slot so the input is exactly as wide as when no button is rendered. */}
            {clearable && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "relative grid size-6 flex-shrink-0 cursor-pointer place-items-center rounded text-[var(--v2-text-muted,#707070)] [@media(hover:hover)]:hover:bg-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] [transition-property:color,background-color,opacity,transform,filter,margin-left,visibility] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-property:color,background-color,opacity,visibility]",
                  showClearButton
                    ? "visible ml-2 scale-100 opacity-100 blur-0 active:scale-[0.96] motion-reduce:active:scale-100"
                    : "pointer-events-none invisible -ml-6 scale-[0.8] opacity-0 blur-[2px] motion-reduce:scale-100 motion-reduce:blur-0"
                )}
                aria-label={showClearButton ? "Clear input" : undefined}
                tabIndex={showClearButton ? 0 : -1}
              >
                <X className="size-4" />
              </button>
            )}
            {suffix && (
              <span className="text-sm text-[var(--v2-text-muted,#707070)] ml-2 select-none">
                {suffix}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper text / Error message / Character count */}
        <FieldFeedback
          active={hasMessage}
          className={cn(
            "grid items-start pt-2",
            showCount && maxLength
              ? "grid-cols-[minmax(0,1fr)_auto] gap-x-2"
              : "grid-cols-[minmax(0,1fr)]"
          )}
        >
          {error ? (
            <motion.span
              {...copyMotion}
              key={"error:" + error}
              id={errorId}
              aria-live="polite"
              className="min-h-0 overflow-hidden break-words font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs leading-[1.4] tracking-[-0.16px] text-semantic-error-text"
            >
              {error}
            </motion.span>
          ) : helperText ? (
            <motion.span
              {...copyMotion}
              key={"helper:" + helperText}
              id={helperId}
              className="min-h-0 overflow-hidden break-words font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-muted,#707070)]"
            >
              {helperText}
            </motion.span>
          ) : (
            <span className="min-h-0 overflow-hidden" />
          )}
          {showCount && maxLength && (
            <span
              className={cn(
                "min-h-0 overflow-hidden font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs leading-[1.4] tracking-[-0.16px]",
                charCount > maxLength
                  ? "text-semantic-error-text"
                  : "text-[var(--v2-text-muted,#707070)]"
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </FieldFeedback>
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField, textFieldContainerVariants, textFieldInputVariants };
