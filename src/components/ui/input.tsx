import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Input variants for different visual states
 */
const inputVariants = cva(
  "h-10 w-full rounded bg-white px-4 py-2.5 text-sm text-[#333333] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#333333] placeholder:text-[#9CA3AF] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus:outline-none focus:border-[#2BBBC9]/50 focus:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus:outline-none focus:border-[#FF3B3B]/60 focus:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

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
  extends Omit<React.ComponentProps<"input">, "size">,
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
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
