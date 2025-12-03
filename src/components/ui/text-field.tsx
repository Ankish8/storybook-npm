import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * TextField container variants for when icons/prefix/suffix are present
 */
const textFieldContainerVariants = cva(
  "relative flex items-center rounded bg-white transition-all",
  {
    variants: {
      state: {
        default: "border border-[#E9E9E9] focus-within:border-[#2BBBC9]/50 focus-within:shadow-[0_0_0_1px_rgba(43,187,201,0.15)]",
        error: "border border-[#FF3B3B]/40 focus-within:border-[#FF3B3B]/60 focus-within:shadow-[0_0_0_1px_rgba(255,59,59,0.1)]",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 bg-[#F9FAFB]",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  }
)

/**
 * TextField input variants (standalone without container)
 */
const textFieldInputVariants = cva(
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
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldInputVariants> {
  /** Label text displayed above the input */
  label?: string
  /** Shows red asterisk next to label when true */
  required?: boolean
  /** Helper text displayed below the input */
  helperText?: string
  /** Error message - shows error state with red styling */
  error?: string
  /** Icon displayed on the left inside the input */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right inside the input */
  rightIcon?: React.ReactNode
  /** Text prefix inside input (e.g., "https://") */
  prefix?: string
  /** Text suffix inside input (e.g., ".com") */
  suffix?: string
  /** Shows character count when maxLength is set */
  showCount?: boolean
  /** Shows loading spinner inside input */
  loading?: boolean
  /** Additional class for the wrapper container */
  wrapperClassName?: string
  /** Additional class for the label */
  labelClassName?: string
  /** Additional class for the input container (includes prefix/suffix/icons) */
  inputContainerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      inputContainerClassName,
      state,
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
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Internal state for character count in uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')

    // Determine if controlled
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    // Derive state from props
    const derivedState = error ? 'error' : (state ?? 'default')

    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    // Determine if we need the container wrapper (for icons/prefix/suffix)
    const hasAddons = leftIcon || rightIcon || prefix || suffix || loading

    // Character count
    const charCount = String(currentValue).length

    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const inputId = id || generatedId
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined

    // Render the input element
    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          hasAddons
            ? "flex-1 bg-transparent border-0 outline-none focus:ring-0 px-0 h-full text-sm text-[#333333] placeholder:text-[#9CA3AF] disabled:cursor-not-allowed"
            : textFieldInputVariants({ state: derivedState, className })
        )}
        disabled={disabled || loading}
        maxLength={maxLength}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    )

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn("text-sm font-medium text-[#333333]", labelClassName)}
          >
            {label}
            {required && <span className="text-[#FF3B3B] ml-0.5">*</span>}
          </label>
        )}

        {/* Input or Input Container */}
        {hasAddons ? (
          <div
            className={cn(
              textFieldContainerVariants({ state: derivedState, disabled: disabled || loading }),
              "h-10 px-4",
              inputContainerClassName
            )}
          >
            {prefix && <span className="text-sm text-[#6B7280] mr-2 select-none">{prefix}</span>}
            {leftIcon && <span className="mr-2 text-[#6B7280] [&_svg]:size-4 flex-shrink-0">{leftIcon}</span>}
            {inputElement}
            {loading && <Loader2 className="animate-spin size-4 text-[#6B7280] ml-2 flex-shrink-0" />}
            {!loading && rightIcon && <span className="ml-2 text-[#6B7280] [&_svg]:size-4 flex-shrink-0">{rightIcon}</span>}
            {suffix && <span className="text-sm text-[#6B7280] ml-2 select-none">{suffix}</span>}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper text / Error message / Character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span id={errorId} className="text-xs text-[#FF3B3B]">
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-[#6B7280]">
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
                  charCount > maxLength ? "text-[#FF3B3B]" : "text-[#6B7280]"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)
TextField.displayName = "TextField"

export { TextField, textFieldContainerVariants, textFieldInputVariants }
