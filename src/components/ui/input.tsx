import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-10 w-full rounded bg-white px-4 py-2.5 text-sm text-[#181D27] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#181D27] placeholder:text-[#A2A6B1] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#FAFAFA]",
  {
    variants: {
      state: {
        default:
          "border border-[#E9EAEB] focus:outline-none focus:border-[#2BBCCA]/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-[#F04438]/40 focus:outline-none focus:border-[#F04438]/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
 * <Input state="success" placeholder="Valid input" />
 * ```
 */
export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
