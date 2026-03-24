import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

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
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
}

const Input = React.forwardRef(
  ({ className, state, type, showCheckIcon, onFocus, onBlur, onWheel, ...props }: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const inputEl = (
      <input
        type={type}
        className={cn(
          inputVariants({ state, className }),
          showCheckIcon && "pr-9",
          type === "number" &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        ref={ref}
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
