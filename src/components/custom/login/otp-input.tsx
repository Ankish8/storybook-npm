import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import type { OtpInputProps } from "./types";
import { useControllableValue } from "./use-controllable-value";

const otpBoxVariants = cva(
  "h-[60px] w-[48px] rounded border border-solid bg-semantic-bg-primary text-center text-base text-semantic-text-secondary transition-all outline-none placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed disabled:opacity-50 sm:w-[54px]",
  {
    variants: {
      hasError: {
        true: "border-semantic-error-primary focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]",
        false:
          "border-semantic-border-input focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

const DIGIT_ONLY = /\D/g;

/**
 * A fixed-length one-time-password input rendered as individual digit boxes.
 *
 * Typing advances focus, `Backspace` on an empty box steps back, arrow keys move
 * between boxes, and pasting a code distributes it across the boxes.
 *
 * @example
 * ```tsx
 * <OtpInput value={otp} onChange={setOtp} onComplete={verify} />
 * <OtpInput length={6} hasError value={otp} onChange={setOtp} />
 * ```
 */
const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      className,
      value,
      length = 4,
      onChange,
      onComplete,
      hasError = false,
      disabled = false,
      autoFocus = true,
      ariaLabel = "One-time password",
      ...props
    },
    ref
  ) => {
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
    const [otpValue, setOtpValue] = useControllableValue(value, "", onChange);
    const digits = React.useMemo(() => {
      const sanitized = otpValue.replace(DIGIT_ONLY, "").slice(0, length);
      return Array.from({ length }, (_, index) => sanitized[index] ?? "");
    }, [otpValue, length]);

    React.useEffect(() => {
      if (!autoFocus || disabled) return;
      const firstEmpty = digits.findIndex((digit) => digit === "");
      const target = firstEmpty === -1 ? length - 1 : firstEmpty;
      // `preventScroll` keeps the mount-time autofocus from yanking the viewport
      // down to the OTP boxes — otherwise any page that renders this below the
      // fold (a Storybook docs page, a long form) jumps on load.
      inputsRef.current[target]?.focus({ preventScroll: true });
      // Only run on mount — re-focusing on every change would fight the user.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const focusBox = (index: number) => {
      const clamped = Math.max(0, Math.min(length - 1, index));
      inputsRef.current[clamped]?.focus({ preventScroll: true });
      inputsRef.current[clamped]?.select();
    };

    const emit = (next: string) => {
      setOtpValue(next);
      if (next.length === length) {
        onComplete?.(next);
      }
    };

    const writeAt = (index: number, chunk: string) => {
      const next = [...digits];
      for (let offset = 0; offset < chunk.length; offset += 1) {
        const target = index + offset;
        if (target >= length) break;
        next[target] = chunk[offset];
      }
      emit(next.join("").replace(/\s/g, ""));
      focusBox(index + chunk.length);
    };

    const handleChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const chunk = event.target.value.replace(DIGIT_ONLY, "");
      if (!chunk) {
        // Nothing to clear (e.g. a rejected non-numeric keystroke) — stay quiet
        // rather than emitting a no-op change.
        if (!digits[index]) return;
        const next = [...digits];
        next[index] = "";
        emit(next.join(""));
        return;
      }
      writeAt(index, chunk);
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const next = [...digits];
        if (next[index]) {
          next[index] = "";
          emit(next.join(""));
          return;
        }
        if (index > 0) {
          next[index - 1] = "";
          emit(next.join(""));
          focusBox(index - 1);
        }
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusBox(index - 1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusBox(index + 1);
      }
    };

    const handlePaste = (
      index: number,
      event: React.ClipboardEvent<HTMLInputElement>
    ) => {
      const pasted = event.clipboardData
        .getData("text")
        .replace(DIGIT_ONLY, "")
        .slice(0, length - index);
      if (!pasted) return;
      event.preventDefault();
      writeAt(index, pasted);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex items-center justify-center gap-3 sm:gap-4",
          className
        )}
        {...props}
      >
        {digits.map((digit, index) => (
          <input
            // Boxes are positional and fixed in count, so the index is a stable key.
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            value={digit}
            placeholder="—"
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={hasError || undefined}
            className={otpBoxVariants({ hasError })}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
    );
  }
);
OtpInput.displayName = "OtpInput";

export { OtpInput, otpBoxVariants };
