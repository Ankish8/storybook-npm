import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const blockedNumberKeys = new Set(["e", "E"]);
const decimalSeparatorKeys = new Set([".", ","]);
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
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-[42px] w-full rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all file:border-0 file:bg-transparent file:text-base file:font-medium file:text-semantic-text-primary placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * A flexible input component for text entry with state variants.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input state="error" placeholder="Invalid input" />
 * <Input showCheckIcon placeholder="Enter amount" />
 * ```
 */
export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Shows a check icon on the right side when the input is focused */
  showCheckIcon?: boolean;
  /**
   * When `type="number"`, hide native stepper arrows (WebKit/Firefox).
   * Default `true` — matches existing app-wide number styling.
   * Set `false` to show native increment/decrement controls (e.g. delay fields).
   */
  hideNumberSpinners?: boolean;
  /**
   * When `type="number"`, prevent scientific notation characters (`e`/`E`).
   * Default `true` so amount-like fields cannot accept exponent values such as `2e22`.
   */
  preventNumberExponent?: boolean;
  /**
   * When `type="number"`, whether decimal separators (`.` / `,`) are allowed.
   * Default `true`. Set `false` for whole-number-only fields; uses `inputMode="numeric"` on supported agents.
   */
  decimal?: boolean;
  /**
   * Same as `decimal` for whole-number-only fields. If both are set, this wins.
   */
  allowDecimal?: boolean;
  /**
   * Prevents inserting a second consecutive space in text-like inputs while
   * preserving the user's current cursor position. Defaults to `true`.
   */
  preventConsecutiveSpaces?: boolean;
}

const Input = React.forwardRef(
  (
    {
      className,
      state,
      type,
      showCheckIcon,
      hideNumberSpinners = true,
      preventNumberExponent = true,
      decimal = true,
      allowDecimal,
      preventConsecutiveSpaces = true,
      onFocus,
      onBlur,
      onWheel,
      onKeyDown,
      onPaste,
      onBeforeInput,
      onChange,
      step,
      ...props
    }: InputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const decimalAllowed = allowDecimal ?? decimal;
    const shouldPreventNumberExponent =
      type === "number" && preventNumberExponent;
    const shouldBlockDecimals =
      type === "number" && !decimalAllowed;
    const shouldPreventConsecutiveSpaces =
      preventConsecutiveSpaces && shouldPreventConsecutiveSpacesForType(type);

    const inputEl = (
      <input
        type={type}
        className={cn(
          inputVariants({ state }),
          className,
          state === "error" &&
            "border-semantic-error-primary shadow-[0_0_0_1px_rgba(240,68,56,0.12)] focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
          showCheckIcon && "pr-9",
          type === "number" &&
            hideNumberSpinners &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        ref={ref}
        inputMode={
          type === "number"
            ? decimalAllowed
              ? "decimal"
              : "numeric"
            : undefined
        }
        step={
          type === "number" && !decimalAllowed ? (step ?? 1) : step
        }
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onWheel={
          type === "number"
            ? (e) => {
                e.currentTarget.blur();
                onWheel?.(e);
              }
            : onWheel
        }
        onKeyDown={(e) => {
          if (shouldPreventNumberExponent && blockedNumberKeys.has(e.key)) {
            e.preventDefault();
          }
          if (
            shouldBlockDecimals &&
            decimalSeparatorKeys.has(e.key)
          ) {
            e.preventDefault();
          }
          onKeyDown?.(e);
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (shouldPreventNumberExponent && /[eE]/.test(text)) {
            e.preventDefault();
          }
          if (shouldBlockDecimals && /[.,]/.test(text)) {
            e.preventDefault();
          }
          onPaste?.(e);
        }}
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
        onChange={(e) => {
          if (shouldPreventNumberExponent && /[eE]/.test(e.target.value)) {
            return;
          }
          if (shouldBlockDecimals && /[.,]/.test(e.target.value)) {
            return;
          }
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
          onChange?.(e);
        }}
        {...props}
      />
    );

    if (!showCheckIcon) return inputEl;

    return (
      <div className="relative w-full">
        {inputEl}
        {isFocused && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-semantic-brand pointer-events-none" />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
