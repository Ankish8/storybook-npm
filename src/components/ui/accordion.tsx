import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Accordion root variants
 */
const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered:
        "border border-semantic-border-layout rounded-lg divide-y divide-semantic-border-layout",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Accordion item variants
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Accordion trigger variants
 */
const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "py-3",
        bordered: "p-4 hover:bg-[var(--color-neutral-50)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Accordion content variants
 */
const accordionContentVariants = cva(
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
);

// Types
type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  onValueChange: (value: string[]) => void;
  variant: "default" | "bordered";
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
}

// Contexts
const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);
const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger/AccordionContent must be used within an AccordionItem"
    );
  }
  return context;
}

/**
 * Root accordion component that manages state
 */
export interface AccordionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  /** Whether only one item can be open at a time ('single') or multiple ('multiple') */
  type?: AccordionType;
  /** Controlled value - array of open item values */
  value?: string[];
  /** Default open items for uncontrolled usage */
  defaultValue?: string[];
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string[]) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const contextValue = React.useMemo(
      () => ({
        type,
        value: currentValue,
        onValueChange: handleValueChange,
        variant: variant || "default",
      }),
      [type, currentValue, handleValueChange, variant]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

/**
 * Individual accordion item
 */
export interface AccordionItemProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  /** Unique value for this item */
  value: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { value: openValues, variant } = useAccordionContext();
    const isOpen = openValues.includes(value);

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
      }),
      [value, isOpen, disabled]
    );

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(accordionItemVariants({ variant, className }))}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

/**
 * Trigger button that toggles the accordion item
 */
export interface AccordionTriggerProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
  /** Whether to show the chevron icon */
  showChevron?: boolean;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, showChevron = true, children, ...props }, ref) => {
  const {
    type,
    value: openValues,
    onValueChange,
    variant,
  } = useAccordionContext();
  const { value, isOpen, disabled } = useAccordionItemContext();

  const handleClick = () => {
    if (disabled) return;

    let newValue: string[];

    if (type === "single") {
      // In single mode, toggle current item (close if open, open if closed)
      newValue = isOpen ? [] : [value];
    } else {
      // In multiple mode, toggle the item in the array
      newValue = isOpen
        ? openValues.filter((v) => v !== value)
        : [...openValues, value];
    }

    onValueChange(newValue);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen}
      disabled={disabled}
      onClick={handleClick}
      className={cn(accordionTriggerVariants({ variant, className }))}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {showChevron && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-semantic-text-muted transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      )}
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * Content that is shown/hidden when the item is toggled
 */
export interface AccordionContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { variant } = useAccordionContext();
  const { isOpen } = useAccordionItemContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? contentHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      ref={ref}
      className={cn(accordionContentVariants({ variant, className }))}
      style={{ height: height !== undefined ? `${height}px` : undefined }}
      aria-hidden={!isOpen}
      {...props}
    >
      <div ref={contentRef} className="pb-4">
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
};
