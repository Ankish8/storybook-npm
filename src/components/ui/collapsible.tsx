import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Collapsible root variants
 */
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

/**
 * Collapsible item variants
 */
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

/**
 * Collapsible trigger variants
 */
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

/**
 * Collapsible content variants
 */
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

// Types
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

// Contexts
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

/**
 * Root collapsible component that manages state
 */
export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleVariants> {
  /** Whether only one item can be open at a time ('single') or multiple ('multiple') */
  type?: CollapsibleType
  /** Controlled value - array of open item values */
  value?: string[]
  /** Default open items for uncontrolled usage */
  defaultValue?: string[]
  /** Callback when open items change */
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

/**
 * Individual collapsible item
 */
export interface CollapsibleItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleItemVariants> {
  /** Unique value for this item */
  value: string
  /** Whether this item is disabled */
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

/**
 * Trigger button that toggles the collapsible item
 */
export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof collapsibleTriggerVariants> {
  /** Whether to show the chevron icon */
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
        // In single mode, toggle current item (close if open, open if closed)
        newValue = isOpen ? [] : [value]
      } else {
        // In multiple mode, toggle the item in the array
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

/**
 * Content that is shown/hidden when the item is toggled
 */
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
        style={{ height: height !== undefined ? `${height}px` : undefined }}
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
}
