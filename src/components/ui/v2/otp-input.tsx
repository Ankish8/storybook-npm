import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: 4 | 6;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoFocus?: boolean;
  name?: string;
}
const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      onComplete,
      length = 4,
      disabled = false,
      error = false,
      helperText,
      autoFocus = false,
      name,
      className,
      "aria-label": ariaLabel = "Verification code",
      ...props
    },
    ref
  ) => {
    const normalize = (text: string) =>
      text.replace(/\D/g, "").slice(0, length);
    const [local, setLocal] = React.useState(() => normalize(defaultValue));
    const code = normalize(value ?? local);
    const inputs = React.useRef<Array<HTMLInputElement | null>>([]);
    const id = React.useId();
    // Shake once when error turns on after the first render (never for an error that is already showing on load).
    const [hadError, setHadError] = React.useState(error);
    const [shake, setShake] = React.useState(false);
    if (error !== hadError) {
      setHadError(error);
      setShake(error);
    }
    const focus = (index: number) =>
      inputs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
    const change = (next: string) => {
      const normalized = normalize(next);
      if (value === undefined) setLocal(normalized);
      if (normalized !== code) {
        onValueChange?.(normalized);
        if (normalized.length === length) onComplete?.(normalized);
      }
    };
    const insert = (text: string, index: number) => {
      const digits = normalize(text);
      if (!digits) return;
      const at = Math.min(index, code.length);
      change(code.slice(0, at) + digits + code.slice(at + digits.length));
      focus(at + digits.length);
    };
    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex max-w-full flex-col items-center bg-v2-semantic-bg-primary p-5 font-[family-name:var(--font-v2,Inter,sans-serif)]",
          code.length === length && !error ? "gap-2.5" : "gap-4",
          className
        )}
        {...props}
      >
        {/* v2-otp-shake: +-4px, 3 cycles, 300ms (keyframes live in src/index.css next to v2-fade-in). Only the
            slot row moves, so the helper text below stays readable. */}
        <div
          className={cn(
            "flex max-w-full gap-2 sm:gap-6",
            shake && "motion-safe:animate-[v2-otp-shake_300ms_ease-in-out]"
          )}
        >
          {Array.from({ length }, (_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              value={code[index] || ""}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={error || undefined}
              aria-describedby={helperText ? id + "-helper" : undefined}
              data-filled={code[index] ? "true" : "false"}
              className={cn(
                // Padding-free cells can shrink for six digits without clipping the glyph.
                // Keep the font size stable; colour provides the subtle arrival transition.
                // The explicit caret colour remains visible while an empty cell has transparent text.
                "box-border h-[60px] w-[54px] min-w-0 rounded-lg border border-solid bg-v2-semantic-bg-primary px-0 py-2.5 text-center font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal leading-[18px] text-[var(--v2-text-secondary,#5E5E5E)] caret-[var(--v2-semantic-border-focus,var(--semantic-primary))] outline-none focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-2 [transition-property:border-color,background-color,color] [transition-duration:160ms,160ms,180ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] data-[filled=false]:text-transparent placeholder:text-[var(--v2-text-placeholder,#707070)] disabled:cursor-not-allowed disabled:bg-v2-semantic-bg-ui disabled:opacity-50",
                error
                  ? "border-v2-semantic-error-primary focus:shadow-none"
                  : "border-v2-semantic-border-input enabled:hover:[&:not(:focus)]:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] focus:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] focus:shadow-none"
              )}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "");
                if (digits) insert(digits, index);
                else change(code.slice(0, index) + code.slice(index + 1));
              }}
              onPaste={(event) => {
                event.preventDefault();
                insert(event.clipboardData.getData("text"), index);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  focus(index + (event.key === "ArrowLeft" ? -1 : 1));
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  focus(event.key === "Home" ? 0 : length - 1);
                } else if (event.key === "Backspace") {
                  event.preventDefault();
                  const at = code[index] ? index : index - 1;
                  if (at >= 0) {
                    change(code.slice(0, at) + code.slice(at + 1));
                    focus(at);
                  }
                } else if (event.key === "Delete") {
                  event.preventDefault();
                  change(code.slice(0, index) + code.slice(index + 1));
                }
              }}
            />
          ))}
        </div>
        {helperText && (
          <p
            id={id + "-helper"}
            className={cn(
              "m-0 text-xs leading-[1.4] tracking-[-0.16px]",
              error
                ? "text-v2-semantic-error-text"
                : "text-[var(--v2-text-muted,#707070)]"
            )}
          >
            {helperText}
          </p>
        )}
        {name && (
          <input type="hidden" name={name} value={code} disabled={disabled} />
        )}
      </div>
    );
  }
);
OtpInput.displayName = "OtpInput";
export { OtpInput };
