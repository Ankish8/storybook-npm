import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Accordion root variants
 */
const accordionVariants = cva(
  "w-full font-[family-name:var(--font-v2,Inter,sans-serif)]",
  {
    variants: {
      variant: {
        // Arc's list: a hairline above the first row, one under every row.
        default: "border-t border-solid border-semantic-border-layout",
        bordered:
          "border border-solid border-semantic-border-layout bg-semantic-bg-primary rounded-lg divide-y divide-semantic-border-layout",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Accordion item variants
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "border-b border-solid border-semantic-border-layout",
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
  "flex min-h-[50px] w-full items-center justify-between gap-5 py-2 text-left font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-primary,#484848)] transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-[var(--v2-text-muted,#707070)] [@media(hover:hover)]:enabled:hover:text-[var(--v2-text-secondary,#5E5E5E)] [@media(hover:hover)]:enabled:hover:[&_[data-accordion-chevron]]:text-[var(--v2-text-primary,#484848)]",
  {
    variants: {
      // The bordered frame keeps a 16px inset so labels never touch its edge; the plain list is edge to edge, as in Arc.
      variant: {
        default: "px-0",
        bordered: "px-4",
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
  // Height follows a critically damped spring (Arc "smooth": visualDuration 0.4, sampled over 700ms); the panel fades in
  // over 240ms and out over 160ms. Reduced motion snaps the height and keeps a short fade.
  "overflow-hidden text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] [overflow-wrap:anywhere] transition-[height,opacity] [transition-duration:700ms,240ms] [transition-timing-function:linear(0,0.0432,0.1402,0.2575,0.3764,0.4867,0.584,0.667,0.7361,0.7925,0.838,0.8743,0.9029,0.9254,0.9428,0.9564,0.9668,0.9748,0.9809,0.9856,0.9892,0.9918,0.9939,0.9954,0.9966,0.9974,0.9981,0.9986,1),cubic-bezier(0.16,1,0.3,1)] aria-hidden:[transition-duration:700ms,160ms] aria-hidden:[transition-timing-function:linear(0,0.0432,0.1402,0.2575,0.3764,0.4867,0.584,0.667,0.7361,0.7925,0.838,0.8743,0.9029,0.9254,0.9428,0.9564,0.9668,0.9748,0.9809,0.9856,0.9892,0.9918,0.9939,0.9954,0.9966,0.9974,0.9981,0.9986,1),cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-[opacity] motion-reduce:[transition-duration:150ms] motion-reduce:[transition-timing-function:ease-out] aria-hidden:opacity-0",
  {
    variants: {
      variant: {
        default: "px-0",
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
  rootRef: React.RefObject<HTMLDivElement | null>;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
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

const Accordion = React.forwardRef(
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
    }: AccordionProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
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
        rootRef,
        value: currentValue,
        onValueChange: handleValueChange,
        variant: variant || "default",
      }),
      [type, currentValue, handleValueChange, variant]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={composedRef}
          data-accordion-root=""
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

const AccordionItem = React.forwardRef(
  (
    { className, value, disabled, children, ...props }: AccordionItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { value: openValues, variant } = useAccordionContext();
    const isOpen = openValues.includes(value);
    const id = React.useId();
    const triggerId = `${id}-trigger`;
    const contentId = `${id}-content`;

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
        triggerId,
        contentId,
      }),
      [value, isOpen, disabled, triggerId, contentId]
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

const AccordionTrigger = React.forwardRef(
  (
    {
      className,
      showChevron = true,
      children,
      onClick,
      onKeyDown,
      ...props
    }: AccordionTriggerProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const {
      type,
      rootRef,
      value: openValues,
      onValueChange,
      variant,
    } = useAccordionContext();
    const { value, isOpen, disabled, triggerId, contentId } =
      useAccordionItemContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (disabled || event.defaultPrevented) return;

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
        id={triggerId}
        aria-controls={contentId}
        data-accordion-trigger=""
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
          )
            return;
          const triggers = Array.from(
            rootRef.current?.querySelectorAll<HTMLButtonElement>(
              "[data-accordion-trigger]:not(:disabled)"
            ) ?? []
          ).filter(
            (node) => node.closest("[data-accordion-root]") === rootRef.current
          );
          const current = triggers.indexOf(event.currentTarget);
          if (current < 0 || !triggers.length) return;
          event.preventDefault();
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? triggers.length - 1
                : (current +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    triggers.length) %
                  triggers.length;
          triggers[next]?.focus();
        }}
        className={cn(accordionTriggerVariants({ variant, className }))}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {showChevron && (
          <ChevronDown
            aria-hidden="true"
            data-accordion-chevron=""
            className={cn(
              // 17px, muted until the row is open; turns on Arc's "snappy" spring (sampled over 500ms).
              "size-[17px] shrink-0 text-[var(--v2-text-muted,#707070)] transition-[transform,color] [transition-duration:500ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isOpen && "rotate-180 text-[var(--v2-text-primary,#484848)]"
            )}
          />
        )}
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * Content that is shown/hidden when the item is toggled
 */
export interface AccordionContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef(
  (
    { className, children, ...props }: AccordionContentProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { variant } = useAccordionContext();
    const { isOpen, triggerId, contentId } = useAccordionItemContext();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState<number | undefined>(undefined);

    React.useEffect(() => {
      const content = contentRef.current;
      if (!content) return;
      content.parentElement?.toggleAttribute("inert", !isOpen);

      // Keep the measured height current when fonts, images or nested content
      // resize after opening. Retargeting the same transition avoids clipping.
      const measure = () => setHeight(isOpen ? content.scrollHeight : 0);
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(content);
      return () => observer.disconnect();
    }, [isOpen, children]);

    return (
      <div
        ref={ref}
        className={cn(accordionContentVariants({ variant, className }))}
        style={{ height: height !== undefined ? `${height}px` : undefined }}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        {...props}
      >
        <div
          ref={contentRef}
          className={cn(
            // The answer settles down 6px with a brief 2px focus pull (spring on open, 160ms on close); no travel or blur under reduced motion.
            "pb-5 pr-8 transition-[transform,filter] motion-reduce:translate-y-0 motion-reduce:[filter:none] motion-reduce:transition-none",
            isOpen
              ? "translate-y-0 [filter:none] [transition-duration:700ms,240ms] [transition-timing-function:linear(0,0.0432,0.1402,0.2575,0.3764,0.4867,0.584,0.667,0.7361,0.7925,0.838,0.8743,0.9029,0.9254,0.9428,0.9564,0.9668,0.9748,0.9809,0.9856,0.9892,0.9918,0.9939,0.9954,0.9966,0.9974,0.9981,0.9986,1),cubic-bezier(0.16,1,0.3,1)]"
              : "-translate-y-1.5 blur-[2px] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
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
