import type { ComponentMetadata } from "../types/index.js";

// Component source code for copy/paste
export const componentSourceCode: Record<string, string> = {
  button: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#343E55] text-white hover:bg-[#343E55]/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#343E55] bg-transparent text-[#343E55] hover:bg-[#343E55] hover:text-white",
        secondary: "bg-[#343E55]/20 text-[#343E55] hover:bg-[#343E55]/30",
        ghost: "hover:bg-[#343E55]/10 hover:text-[#343E55]",
        link: "text-[#343E55] underline-offset-4 hover:underline",
      },
      size: {
        default: "py-2.5 px-4",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-6",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,

  badge: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        active: "bg-[#E5FFF5] text-[#00A651]",
        failed: "bg-[#FFECEC] text-[#FF3B3B]",
        disabled: "bg-[#F3F5F6] text-[#6B7280]",
        default: "bg-[#F3F5F6] text-[#333333]",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }), "gap-1")}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }`,

  tag: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center justify-center rounded text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#333333]",
        primary: "bg-[#343E55]/10 text-[#343E55]",
        secondary: "bg-[#E5E7EB] text-[#374151]",
        success: "bg-[#E5FFF5] text-[#00A651]",
        warning: "bg-[#FFF8E5] text-[#F59E0B]",
        error: "bg-[#FFECEC] text-[#FF3B3B]",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1.5",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[#E5E7EB] active:bg-[#D1D5DB]",
        false: "",
      },
      selected: {
        true: "ring-2 ring-[#343E55] ring-offset-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      selected: false,
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  label?: string
  interactive?: boolean
  selected?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, interactive, selected, label, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, interactive, selected, className }))}
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-selected={selected}
        {...props}
      >
        {label && <span className="font-semibold mr-1">{label}</span>}
        <span className="font-normal">{children}</span>
      </span>
    )
  }
)
Tag.displayName = "Tag"

export { Tag, tagVariants }`,

  input: `import * as React from "react"
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

export { Input, inputVariants }`,

  checkbox: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "inline-flex items-center justify-center rounded border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const iconSizeVariants = cva("", {
  variants: {
    size: {
      default: "h-3.5 w-3.5",
      sm: "h-3 w-3",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const labelSizeVariants = cva("", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type CheckedState = boolean | "indeterminate"

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof checkboxVariants> {
  checked?: CheckedState
  defaultChecked?: boolean
  onCheckedChange?: (checked: CheckedState) => void
  label?: string
  labelPosition?: "left" | "right"
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      size,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      label,
      labelPosition = "right",
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState<CheckedState>(defaultChecked)

    const isControlled = controlledChecked !== undefined
    const checkedState = isControlled ? controlledChecked : internalChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      const newValue = checkedState === true ? false : true
      if (!isControlled) {
        setInternalChecked(newValue)
      }
      onCheckedChange?.(newValue)
      onClick?.(e)
    }

    const isChecked = checkedState === true
    const isIndeterminate = checkedState === "indeterminate"

    const checkbox = (
      <button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          checkboxVariants({ size, className }),
          "cursor-pointer",
          isChecked || isIndeterminate
            ? "bg-[#343E55] border-[#343E55] text-white"
            : "bg-white border-[#E5E7EB] hover:border-[#9CA3AF]"
        )}
        {...props}
      >
        {isChecked && (
          <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
        {isIndeterminate && (
          <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
      </button>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {labelPosition === "left" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return checkbox
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }`,

  toggle: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const toggleThumbVariants = cva(
  "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
      checked: {
        true: "",
        false: "translate-x-0",
      },
    },
    compoundVariants: [
      { size: "default", checked: true, className: "translate-x-5" },
      { size: "sm", checked: true, className: "translate-x-4" },
      { size: "lg", checked: true, className: "translate-x-7" },
    ],
    defaultVariants: {
      size: "default",
      checked: false,
    },
  }
)

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  labelPosition?: "left" | "right"
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      size,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      label,
      labelPosition = "right",
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)

    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : internalChecked

    const handleClick = () => {
      if (disabled) return
      const newValue = !isChecked
      if (!isControlled) {
        setInternalChecked(newValue)
      }
      onCheckedChange?.(newValue)
    }

    const toggle = (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          toggleVariants({ size, className }),
          isChecked ? "bg-[#343E55]" : "bg-[#E5E7EB]"
        )}
        {...props}
      >
        <span
          className={cn(
            toggleThumbVariants({ size, checked: isChecked })
          )}
        />
      </button>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {labelPosition === "left" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {toggle}
          {labelPosition === "right" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return toggle
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }`,

  collapsible: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const collapsibleVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered: "border border-[#E5E7EB] rounded-lg divide-y divide-[#E5E7EB]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const collapsibleItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const collapsibleTriggerVariants = cva(
  "flex w-full items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "py-3",
        bordered: "p-4 hover:bg-[#F9FAFB]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const collapsibleContentVariants = cva(
  "overflow-hidden transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "",
        bordered: "px-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type CollapsibleType = "single" | "multiple"

interface CollapsibleContextValue {
  type: CollapsibleType
  value: string[]
  onValueChange: (value: string[]) => void
  variant: "default" | "bordered"
}

interface CollapsibleItemContextValue {
  value: string
  isOpen: boolean
  disabled?: boolean
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)
const CollapsibleItemContext = React.createContext<CollapsibleItemContextValue | null>(null)

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible")
  }
  return context
}

function useCollapsibleItemContext() {
  const context = React.useContext(CollapsibleItemContext)
  if (!context) {
    throw new Error("CollapsibleTrigger/CollapsibleContent must be used within a CollapsibleItem")
  }
  return context
}

export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleVariants> {
  type?: CollapsibleType
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      className,
      variant = "default",
      type = "multiple",
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (newValue: string[]) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    const contextValue = React.useMemo(
      () => ({
        type,
        value: currentValue,
        onValueChange: handleValueChange,
        variant: variant || "default",
      }),
      [type, currentValue, handleValueChange, variant]
    )

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(collapsibleVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

export interface CollapsibleItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleItemVariants> {
  value: string
  disabled?: boolean
}

const CollapsibleItem = React.forwardRef<HTMLDivElement, CollapsibleItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { value: openValues, variant } = useCollapsibleContext()
    const isOpen = openValues.includes(value)

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
      }),
      [value, isOpen, disabled]
    )

    return (
      <CollapsibleItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(collapsibleItemVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </CollapsibleItemContext.Provider>
    )
  }
)
CollapsibleItem.displayName = "CollapsibleItem"

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof collapsibleTriggerVariants> {
  showChevron?: boolean
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, showChevron = true, children, ...props }, ref) => {
    const { type, value: openValues, onValueChange, variant } = useCollapsibleContext()
    const { value, isOpen, disabled } = useCollapsibleItemContext()

    const handleClick = () => {
      if (disabled) return
      let newValue: string[]
      if (type === "single") {
        newValue = isOpen ? [] : [value]
      } else {
        newValue = isOpen
          ? openValues.filter((v) => v !== value)
          : [...openValues, value]
      }
      onValueChange(newValue)
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleClick}
        className={cn(collapsibleTriggerVariants({ variant, className }))}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {showChevron && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#6B7280] transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleContentVariants> {}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useCollapsibleContext()
    const { isOpen } = useCollapsibleItemContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number | undefined>(undefined)

    React.useEffect(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight
        setHeight(isOpen ? contentHeight : 0)
      }
    }, [isOpen, children])

    return (
      <div
        ref={ref}
        className={cn(collapsibleContentVariants({ variant, className }))}
        style={{ height: height !== undefined ? \`\${height}px\` : undefined }}
        aria-hidden={!isOpen}
        {...props}
      >
        <div ref={contentRef} className="pb-4">
          {children}
        </div>
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleVariants,
  collapsibleItemVariants,
  collapsibleTriggerVariants,
  collapsibleContentVariants,
}`,

  "text-field": `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

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

export interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldInputVariants> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  showCount?: boolean
  loading?: boolean
  wrapperClassName?: string
  labelClassName?: string
  inputContainerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    // Component implementation - see full source
    return null
  }
)
TextField.displayName = "TextField"

export { TextField, textFieldContainerVariants, textFieldInputVariants }`,

  select: `import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded bg-white px-4 py-2.5 text-sm text-[#333333] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB] [&>span]:line-clamp-1",
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

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, state, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ state, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-[#6B7280] opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded bg-white border border-[#E9E9E9] shadow-md",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-[#333333] outline-none hover:bg-[#F3F4F6] focus:bg-[#F3F4F6]",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-[#2BBBC9]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-4 py-1.5 text-xs font-medium text-[#6B7280]", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#E9E9E9]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  selectTriggerVariants,
}`,

  "select-field": `import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectFieldProps {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  searchable?: boolean
  searchPlaceholder?: string
  wrapperClassName?: string
  triggerClassName?: string
  labelClassName?: string
  id?: string
  name?: string
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (props, ref) => {
    // Component implementation - see full source
    return null
  }
)
SelectField.displayName = "SelectField"

export { SelectField }`,

  "multi-select": `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, X, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const multiSelectTriggerVariants = cva(
  "flex min-h-10 w-full items-center justify-between rounded bg-white px-4 py-2 text-sm text-[#333333] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
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

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps extends VariantProps<typeof multiSelectTriggerVariants> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  options: MultiSelectOption[]
  searchable?: boolean
  searchPlaceholder?: string
  maxSelections?: number
  wrapperClassName?: string
  triggerClassName?: string
  labelClassName?: string
  id?: string
  name?: string
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (props, ref) => {
    // Component implementation - see full source
    return null
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect, multiSelectTriggerVariants }`,
};

// Utility function source code
export const utilsSourceCode = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

// CSS styles
export const cssStyles = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

export const componentMetadata: Record<string, ComponentMetadata> = {
  button: {
    name: "Button",
    description:
      "A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        required: false,
        description: "The visual style of the button",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        required: false,
        description: "The size of the button",
        defaultValue: "default",
      },
      {
        name: "asChild",
        type: "boolean",
        required: false,
        description: "Render as child element using Radix Slot",
        defaultValue: "false",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the left side of the button text",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the right side of the button text",
      },
      {
        name: "loading",
        type: "boolean",
        required: false,
        description: "Shows loading spinner and disables button",
        defaultValue: "false",
      },
      {
        name: "loadingText",
        type: "string",
        required: false,
        description: "Text shown during loading state",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disables the button",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "variant",
        options: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg", "icon"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Button",
        code: '<Button>Click me</Button>',
        description: "Simple button with default styling",
      },
      {
        title: "Button Variants",
        code: `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`,
        description: "All available button variants",
      },
      {
        title: "Button with Icons",
        code: `import { Mail, ArrowRight } from "lucide-react"

<Button leftIcon={<Mail />}>Send Email</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>`,
        description: "Buttons with left or right icons",
      },
      {
        title: "Loading State",
        code: `<Button loading>Loading</Button>
<Button loading loadingText="Saving...">Save</Button>`,
        description: "Button with loading spinner",
      },
      {
        title: "Icon Only Button",
        code: `import { Plus } from "lucide-react"

<Button size="icon" aria-label="Add item">
  <Plus />
</Button>`,
        description: "Square icon-only button",
      },
    ],
  },

  badge: {
    name: "Badge",
    description:
      "A status badge component with active, failed, and disabled variants. Pill-shaped badges with different colors for different states.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "variant",
        type: '"active" | "failed" | "disabled" | "default"',
        required: false,
        description: "The visual style of the badge",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the badge",
        defaultValue: "default",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the left side of the badge text",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the right side of the badge text",
      },
    ],
    variants: [
      {
        name: "variant",
        options: ["active", "failed", "disabled", "default"],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Status Badges",
        code: `<Badge variant="active">Active</Badge>
<Badge variant="failed">Failed</Badge>
<Badge variant="disabled">Disabled</Badge>
<Badge variant="default">Default</Badge>`,
        description: "Badges for different status states",
      },
      {
        title: "Badge with Icons",
        code: `import { Check, X } from "lucide-react"

<Badge variant="active" leftIcon={<Check />}>Success</Badge>
<Badge variant="failed" leftIcon={<X />}>Error</Badge>`,
        description: "Badges with status icons",
      },
      {
        title: "Badge Sizes",
        code: `<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>`,
        description: "Different badge sizes",
      },
    ],
  },

  tag: {
    name: "Tag",
    description:
      "A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "variant",
        type: '"default" | "primary" | "secondary" | "success" | "warning" | "error"',
        required: false,
        description: "The visual style of the tag",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the tag",
        defaultValue: "default",
      },
      {
        name: "label",
        type: "string",
        required: false,
        description: "Bold label prefix displayed before the content",
      },
      {
        name: "interactive",
        type: "boolean",
        required: false,
        description: "Make the tag clickable with hover/active states",
        defaultValue: "false",
      },
      {
        name: "selected",
        type: "boolean",
        required: false,
        description: "Show selected state with ring outline",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "variant",
        options: ["default", "primary", "secondary", "success", "warning", "error"],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Tags",
        code: `<Tag>After Call Event</Tag>
<Tag variant="primary">Primary</Tag>
<Tag variant="success">Success</Tag>`,
        description: "Simple tag labels",
      },
      {
        title: "Tag with Label Prefix",
        code: `<Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
<Tag label="Category:">Marketing</Tag>`,
        description: "Tags with bold label prefix",
      },
      {
        title: "Interactive Tags",
        code: `<Tag interactive onClick={() => console.log('clicked')}>
  Clickable
</Tag>
<Tag interactive selected>Selected Tag</Tag>`,
        description: "Clickable and selectable tags",
      },
    ],
  },

  table: {
    name: "Table",
    description:
      "A composable table component with size variants, loading/empty states, sticky columns, and sorting support.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        required: false,
        description: "The row height of the table",
        defaultValue: "md",
      },
      {
        name: "withoutBorder",
        type: "boolean",
        required: false,
        description: "Remove outer border from the table",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "size",
        options: ["sm", "md", "lg"],
        defaultValue: "md",
      },
    ],
    examples: [
      {
        title: "Basic Table",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell><Badge variant="active">Active</Badge></TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        description: "Simple table with header and body",
      },
      {
        title: "Table with Loading State",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableSkeleton rows={5} columns={2} />
  </TableBody>
</Table>`,
        description: "Table showing loading skeleton",
      },
      {
        title: "Table with Empty State",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableEmpty colSpan={2}>No results found</TableEmpty>
  </TableBody>
</Table>`,
        description: "Table showing empty state message",
      },
      {
        title: "Table with Sticky Column",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead sticky>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Description</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell sticky>001</TableCell>
      <TableCell>Item Name</TableCell>
      <TableCell>Long description text...</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        description: "Table with sticky first column",
      },
    ],
  },

  "dropdown-menu": {
    name: "DropdownMenu",
    description:
      "A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.",
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "DropdownMenu",
        type: "Root component",
        required: true,
        description: "Wrapper component that manages dropdown state",
      },
      {
        name: "DropdownMenuTrigger",
        type: "Trigger component",
        required: true,
        description: "The button that opens the dropdown",
      },
      {
        name: "DropdownMenuContent",
        type: "Content component",
        required: true,
        description: "Container for menu items",
      },
      {
        name: "DropdownMenuItem",
        type: "Item component",
        required: false,
        description: "Individual menu item",
      },
      {
        name: "DropdownMenuCheckboxItem",
        type: "Checkbox item component",
        required: false,
        description: "Menu item with checkbox",
      },
      {
        name: "DropdownMenuRadioGroup",
        type: "Radio group component",
        required: false,
        description: "Group of radio menu items",
      },
      {
        name: "DropdownMenuSeparator",
        type: "Separator component",
        required: false,
        description: "Visual separator between items",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic Dropdown",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Simple dropdown with menu items",
      },
      {
        title: "Dropdown with Checkbox Items",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem checked={showStatus}>
      Show Status Bar
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={showPanel}>
      Show Panel
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Dropdown with checkable items",
      },
      {
        title: "Dropdown with Submenu",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>New File</DropdownMenuItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Email</DropdownMenuItem>
        <DropdownMenuItem>Slack</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Nested dropdown with submenu",
      },
    ],
  },

  input: {
    name: "Input",
    description:
      "A flexible input component for text entry with state variants. Supports default and error states.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "state",
        type: '"default" | "error"',
        required: false,
        description: "The visual state of the input",
        defaultValue: "default",
      },
      {
        name: "type",
        type: "string",
        required: false,
        description: "HTML input type (text, email, password, etc.)",
        defaultValue: "text",
      },
      {
        name: "placeholder",
        type: "string",
        required: false,
        description: "Placeholder text displayed when input is empty",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disables the input",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "state",
        options: ["default", "error"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Input",
        code: '<Input placeholder="Enter your email" />',
        description: "Simple input with placeholder",
      },
      {
        title: "Error State",
        code: '<Input state="error" placeholder="Invalid input" />',
        description: "Input showing error state",
      },
      {
        title: "Disabled Input",
        code: '<Input disabled placeholder="Disabled" />',
        description: "Disabled input field",
      },
    ],
  },

  "text-field": {
    name: "TextField",
    description:
      "A comprehensive text field component with label, icons, prefix/suffix, validation states, character count, and loading state.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "label",
        type: "string",
        required: false,
        description: "Label text displayed above the input",
      },
      {
        name: "required",
        type: "boolean",
        required: false,
        description: "Shows red asterisk next to label when true",
        defaultValue: "false",
      },
      {
        name: "helperText",
        type: "string",
        required: false,
        description: "Helper text displayed below the input",
      },
      {
        name: "error",
        type: "string",
        required: false,
        description: "Error message - shows error state with red styling",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the left inside the input",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the right inside the input",
      },
      {
        name: "prefix",
        type: "string",
        required: false,
        description: 'Text prefix inside input (e.g., "https://")',
      },
      {
        name: "suffix",
        type: "string",
        required: false,
        description: 'Text suffix inside input (e.g., ".com")',
      },
      {
        name: "showCount",
        type: "boolean",
        required: false,
        description: "Shows character count when maxLength is set",
        defaultValue: "false",
      },
      {
        name: "loading",
        type: "boolean",
        required: false,
        description: "Shows loading spinner inside input",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "state",
        options: ["default", "error"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic TextField",
        code: '<TextField label="Email" placeholder="Enter your email" required />',
        description: "Text field with label and required indicator",
      },
      {
        title: "TextField with Error",
        code: '<TextField label="Username" error="Username is already taken" />',
        description: "Text field showing error state",
      },
      {
        title: "TextField with Icons",
        code: `import { Mail, Eye } from "lucide-react"

<TextField
  label="Email"
  leftIcon={<Mail />}
  placeholder="Enter email"
/>`,
        description: "Text field with left icon",
      },
      {
        title: "TextField with Prefix/Suffix",
        code: '<TextField label="Website" prefix="https://" suffix=".com" placeholder="example" />',
        description: "Text field with URL prefix and suffix",
      },
    ],
  },

  select: {
    name: "Select",
    description:
      "A composable select dropdown built with Radix UI primitives. Includes SelectTrigger, SelectContent, SelectItem, and more sub-components.",
    dependencies: [
      "@radix-ui/react-select",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "Select",
        type: "Root component",
        required: true,
        description: "Wrapper component that manages select state",
      },
      {
        name: "SelectTrigger",
        type: "Trigger component",
        required: true,
        description: "The button that opens the select dropdown",
      },
      {
        name: "SelectContent",
        type: "Content component",
        required: true,
        description: "Container for select options",
      },
      {
        name: "SelectItem",
        type: "Item component",
        required: true,
        description: "Individual select option",
      },
      {
        name: "SelectValue",
        type: "Value component",
        required: false,
        description: "Displays the selected value in the trigger",
      },
      {
        name: "SelectGroup",
        type: "Group component",
        required: false,
        description: "Groups related options together",
      },
      {
        name: "SelectLabel",
        type: "Label component",
        required: false,
        description: "Label for a group of options",
      },
    ],
    variants: [
      {
        name: "state",
        options: ["default", "error"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Select",
        code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,
        description: "Simple select dropdown",
      },
      {
        title: "Grouped Select",
        code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="potato">Potato</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
        description: "Select with grouped options",
      },
    ],
  },

  "select-field": {
    name: "SelectField",
    description:
      "A form-ready select component with label, helper text, error handling, and grouped options support.",
    dependencies: [
      "@radix-ui/react-select",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "label",
        type: "string",
        required: false,
        description: "Label text displayed above the select",
      },
      {
        name: "required",
        type: "boolean",
        required: false,
        description: "Shows red asterisk next to label when true",
        defaultValue: "false",
      },
      {
        name: "options",
        type: "SelectOption[]",
        required: true,
        description: "Array of options with value, label, disabled, and group properties",
      },
      {
        name: "value",
        type: "string",
        required: false,
        description: "Currently selected value (controlled)",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when value changes",
      },
      {
        name: "error",
        type: "string",
        required: false,
        description: "Error message - shows error state with red styling",
      },
      {
        name: "helperText",
        type: "string",
        required: false,
        description: "Helper text displayed below the select",
      },
      {
        name: "searchable",
        type: "boolean",
        required: false,
        description: "Enable search/filter functionality",
        defaultValue: "false",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic SelectField",
        code: `<SelectField
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ]}
  required
/>`,
        description: "Select field with label and options",
      },
      {
        title: "SelectField with Groups",
        code: `<SelectField
  label="Authentication"
  options={[
    { value: 'none', label: 'None', group: 'Basic' },
    { value: 'basic', label: 'Basic Auth', group: 'Basic' },
    { value: 'oauth', label: 'OAuth 2.0', group: 'Advanced' },
    { value: 'jwt', label: 'JWT Token', group: 'Advanced' },
  ]}
/>`,
        description: "Select field with grouped options",
      },
    ],
  },

  "multi-select": {
    name: "MultiSelect",
    description:
      "A multi-select component with tags display, search functionality, and validation states. Supports maximum selection limits.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "label",
        type: "string",
        required: false,
        description: "Label text displayed above the select",
      },
      {
        name: "options",
        type: "MultiSelectOption[]",
        required: true,
        description: "Array of options with value, label, and disabled properties",
      },
      {
        name: "value",
        type: "string[]",
        required: false,
        description: "Currently selected values (controlled)",
      },
      {
        name: "onValueChange",
        type: "(value: string[]) => void",
        required: false,
        description: "Callback when values change",
      },
      {
        name: "searchable",
        type: "boolean",
        required: false,
        description: "Enable search/filter functionality",
        defaultValue: "false",
      },
      {
        name: "maxSelections",
        type: "number",
        required: false,
        description: "Maximum number of selections allowed",
      },
      {
        name: "error",
        type: "string",
        required: false,
        description: "Error message - shows error state with red styling",
      },
    ],
    variants: [
      {
        name: "state",
        options: ["default", "error"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic MultiSelect",
        code: `<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ]}
  onValueChange={(values) => console.log(values)}
/>`,
        description: "Multi-select with tag display",
      },
      {
        title: "Searchable MultiSelect",
        code: `<MultiSelect
  label="Technologies"
  searchable
  searchPlaceholder="Search technologies..."
  maxSelections={3}
  options={[
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
  ]}
/>`,
        description: "Searchable multi-select with max selections",
      },
    ],
  },

  checkbox: {
    name: "Checkbox",
    description:
      "A tri-state checkbox component with label support. Supports checked, unchecked, and indeterminate states.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the checkbox",
        defaultValue: "default",
      },
      {
        name: "checked",
        type: 'boolean | "indeterminate"',
        required: false,
        description: "Whether the checkbox is checked, unchecked, or indeterminate",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        required: false,
        description: "Default checked state for uncontrolled usage",
        defaultValue: "false",
      },
      {
        name: "onCheckedChange",
        type: "(checked: CheckedState) => void",
        required: false,
        description: "Callback when checked state changes",
      },
      {
        name: "label",
        type: "string",
        required: false,
        description: "Optional label text",
      },
      {
        name: "labelPosition",
        type: '"left" | "right"',
        required: false,
        description: "Position of the label relative to checkbox",
        defaultValue: "right",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disables the checkbox",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Checkbox",
        code: '<Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />',
        description: "Simple controlled checkbox",
      },
      {
        title: "Checkbox with Label",
        code: '<Checkbox label="Accept terms and conditions" />',
        description: "Checkbox with label on the right",
      },
      {
        title: "Indeterminate State",
        code: '<Checkbox checked="indeterminate" label="Select all" />',
        description: "Checkbox showing indeterminate state",
      },
      {
        title: "Checkbox Sizes",
        code: `<Checkbox size="sm" label="Small" />
<Checkbox size="default" label="Default" />
<Checkbox size="lg" label="Large" />`,
        description: "Different checkbox sizes",
      },
    ],
  },

  toggle: {
    name: "Toggle",
    description:
      "A toggle/switch component for boolean inputs with on/off states. Supports labels and multiple sizes.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the toggle",
        defaultValue: "default",
      },
      {
        name: "checked",
        type: "boolean",
        required: false,
        description: "Whether the toggle is on",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        required: false,
        description: "Default checked state for uncontrolled usage",
        defaultValue: "false",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        required: false,
        description: "Callback when checked state changes",
      },
      {
        name: "label",
        type: "string",
        required: false,
        description: "Optional label text",
      },
      {
        name: "labelPosition",
        type: '"left" | "right"',
        required: false,
        description: "Position of the label relative to toggle",
        defaultValue: "right",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disables the toggle",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Toggle",
        code: '<Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />',
        description: "Simple controlled toggle",
      },
      {
        title: "Toggle with Label",
        code: '<Toggle label="Enable notifications" />',
        description: "Toggle with label on the right",
      },
      {
        title: "Toggle Sizes",
        code: `<Toggle size="sm" label="Small" />
<Toggle size="default" label="Default" />
<Toggle size="lg" label="Large" />`,
        description: "Different toggle sizes",
      },
    ],
  },

  collapsible: {
    name: "Collapsible",
    description:
      "An expandable/collapsible section component with single or multiple mode support. Includes Collapsible, CollapsibleItem, CollapsibleTrigger, and CollapsibleContent sub-components.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        required: false,
        description: "Whether only one item can be open at a time or multiple",
        defaultValue: "multiple",
      },
      {
        name: "variant",
        type: '"default" | "bordered"',
        required: false,
        description: "Visual variant of the collapsible",
        defaultValue: "default",
      },
      {
        name: "value",
        type: "string[]",
        required: false,
        description: "Controlled value - array of open item values",
      },
      {
        name: "defaultValue",
        type: "string[]",
        required: false,
        description: "Default open items for uncontrolled usage",
      },
      {
        name: "onValueChange",
        type: "(value: string[]) => void",
        required: false,
        description: "Callback when open items change",
      },
    ],
    variants: [
      {
        name: "type",
        options: ["single", "multiple"],
        defaultValue: "multiple",
      },
      {
        name: "variant",
        options: ["default", "bordered"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Collapsible",
        code: `<Collapsible>
  <CollapsibleItem value="item-1">
    <CollapsibleTrigger>Section 1</CollapsibleTrigger>
    <CollapsibleContent>
      Content for section 1
    </CollapsibleContent>
  </CollapsibleItem>
  <CollapsibleItem value="item-2">
    <CollapsibleTrigger>Section 2</CollapsibleTrigger>
    <CollapsibleContent>
      Content for section 2
    </CollapsibleContent>
  </CollapsibleItem>
</Collapsible>`,
        description: "Basic collapsible with multiple sections",
      },
      {
        title: "Accordion (Single Mode)",
        code: `<Collapsible type="single" variant="bordered">
  <CollapsibleItem value="faq-1">
    <CollapsibleTrigger>What is myOperator UI?</CollapsibleTrigger>
    <CollapsibleContent>
      myOperator UI is a component library for React.
    </CollapsibleContent>
  </CollapsibleItem>
  <CollapsibleItem value="faq-2">
    <CollapsibleTrigger>How do I install it?</CollapsibleTrigger>
    <CollapsibleContent>
      Run npx myoperator-ui init to get started.
    </CollapsibleContent>
  </CollapsibleItem>
</Collapsible>`,
        description: "Accordion-style collapsible where only one item can be open",
      },
    ],
  },

  "event-selector": {
    name: "EventSelector",
    description:
      "A component for selecting webhook events with group and category organization. NOT available via CLI - import directly from npm package.",
    dependencies: [],
    props: [
      {
        name: "events",
        type: "EventItem[]",
        required: true,
        description: "Array of event items with id, name, description, and group",
      },
      {
        name: "groups",
        type: "EventGroup[]",
        required: true,
        description: "Array of event groups with id, name, and optional icon",
      },
      {
        name: "categories",
        type: "EventCategory[]",
        required: false,
        description: "Optional categories to organize groups",
      },
      {
        name: "selectedEvents",
        type: "string[]",
        required: false,
        description: "Currently selected event IDs (controlled)",
      },
      {
        name: "onSelectionChange",
        type: "(ids: string[]) => void",
        required: false,
        description: "Callback when selection changes",
      },
      {
        name: "title",
        type: "string",
        required: false,
        description: "Title displayed above the selector",
        defaultValue: "Events",
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Description text below the title",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic EventSelector",
        code: `import { EventSelector } from "myoperator-ui"

<EventSelector
  events={[
    { id: 'call.started', name: 'Call Started', group: 'calls' },
    { id: 'call.ended', name: 'Call Ended', group: 'calls' },
    { id: 'sms.received', name: 'SMS Received', group: 'sms' },
  ]}
  groups={[
    { id: 'calls', name: 'Call Events' },
    { id: 'sms', name: 'SMS Events' },
  ]}
  selectedEvents={selected}
  onSelectionChange={setSelected}
/>`,
        description: "Event selector with groups (NOT available via CLI)",
      },
    ],
  },

  "key-value-input": {
    name: "KeyValueInput",
    description:
      "A component for managing key-value pairs, perfect for HTTP headers or custom parameters. NOT available via CLI - import directly from npm package.",
    dependencies: ["lucide-react"],
    props: [
      {
        name: "title",
        type: "string",
        required: false,
        description: "Title displayed above the input",
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Description text below the title",
      },
      {
        name: "value",
        type: "KeyValuePair[]",
        required: false,
        description: "Current key-value pairs (controlled)",
      },
      {
        name: "onChange",
        type: "(pairs: KeyValuePair[]) => void",
        required: false,
        description: "Callback when pairs change",
      },
      {
        name: "maxItems",
        type: "number",
        required: false,
        description: "Maximum number of key-value pairs allowed",
        defaultValue: "10",
      },
      {
        name: "addButtonText",
        type: "string",
        required: false,
        description: "Text for the add button",
        defaultValue: "Add Header",
      },
      {
        name: "keyPlaceholder",
        type: "string",
        required: false,
        description: "Placeholder for key input",
        defaultValue: "Key",
      },
      {
        name: "valuePlaceholder",
        type: "string",
        required: false,
        description: "Placeholder for value input",
        defaultValue: "Value",
      },
    ],
    variants: [],
    examples: [
      {
        title: "HTTP Headers Input",
        code: `import { KeyValueInput } from "myoperator-ui"

<KeyValueInput
  title="HTTP Headers"
  description="Add custom headers for the webhook request"
  value={headers}
  onChange={setHeaders}
  maxItems={5}
/>`,
        description: "Key-value input for HTTP headers (NOT available via CLI)",
      },
    ],
  },
};

export function getComponentNames(): string[] {
  return Object.keys(componentMetadata);
}

export function getComponent(name: string): ComponentMetadata | undefined {
  return componentMetadata[name.toLowerCase()];
}
