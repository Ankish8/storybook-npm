import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Accordion root variants
 */
const accordionVariants = cva(
  "min-w-0 w-full font-[family-name:var(--font-v2,Inter,sans-serif)]",
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
  "flex min-h-[50px] w-full items-center justify-between gap-5 py-2 text-left font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-primary,var(--semantic-text-primary))] transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:[transition-duration:0ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-[var(--v2-text-muted,var(--semantic-text-muted))] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:text-[var(--v2-text-secondary,var(--semantic-text-secondary))] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:[&_[data-accordion-chevron]]:text-[var(--v2-text-primary,var(--semantic-text-primary))]",
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
  // Visibility waits for the finite collapse; closed panels start hidden even before hydration.
  "overflow-hidden text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,var(--semantic-text-secondary))] [overflow-wrap:anywhere] transition-[height,opacity,visibility] [transition-duration:280ms,180ms,0ms] [transition-delay:0ms,0ms,0ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] aria-hidden:invisible aria-hidden:opacity-0 aria-hidden:pointer-events-none aria-hidden:[transition-duration:220ms,120ms,0ms] aria-hidden:[transition-delay:0ms,0ms,220ms] motion-reduce:transition-none motion-reduce:[transition-duration:0ms] motion-reduce:[transition-delay:0ms] motion-reduce:aria-hidden:[transition-duration:0ms] motion-reduce:aria-hidden:[transition-delay:0ms]",
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
  setTriggerId: (id: string | undefined) => void;
  setContentId: (id: string | undefined) => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

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
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLDivElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              rootRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
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

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { value: openValues, variant } = useAccordionContext();
    const isOpen = openValues.includes(value);
    const id = React.useId();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const [customTriggerId, setTriggerId] = React.useState<string>();
    const [customContentId, setContentId] = React.useState<string>();
    const triggerId = customTriggerId ?? `${id}-trigger`;
    const contentId = customContentId ?? `${id}-content`;

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        disabled,
        triggerId,
        contentId,
        setTriggerId,
        setContentId,
        triggerRef,
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

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(
  (
    {
      className,
      showChevron = true,
      children,
      onClick,
      onKeyDown,
      id,
      disabled: triggerDisabled,
      ...props
    },
    ref
  ) => {
    const {
      type,
      rootRef,
      value: openValues,
      onValueChange,
      variant,
    } = useAccordionContext();
    const {
      value,
      isOpen,
      disabled,
      triggerId,
      contentId,
      setTriggerId,
      triggerRef,
    } = useAccordionItemContext();
    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLButtonElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              triggerRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
      },
      [ref, triggerRef]
    );

    useIsomorphicLayoutEffect(() => {
      setTriggerId(id);
      return () => setTriggerId(undefined);
    }, [id, setTriggerId]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (disabled || triggerDisabled || event.defaultPrevented) return;

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
        ref={composedRef}
        type="button"
        id={id ?? triggerId}
        aria-controls={contentId}
        data-accordion-trigger=""
        data-state={isOpen ? "open" : "closed"}
        aria-expanded={isOpen}
        disabled={disabled || triggerDisabled}
        onClick={handleClick}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
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
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          {children}
        </span>
        {showChevron && (
          <ChevronDown
            aria-hidden="true"
            data-accordion-chevron=""
            className={cn(
              "size-[17px] shrink-0 text-[var(--v2-text-muted,var(--semantic-text-muted))] transition-[transform,color] [transition-duration:240ms,160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:[transition-duration:0ms]",
              isOpen &&
                "rotate-180 text-[var(--v2-text-primary,var(--semantic-text-primary))]"
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

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, id, style, ...props }, ref) => {
  const { variant } = useAccordionContext();
  const { isOpen, triggerId, contentId, setContentId, triggerRef } =
    useAccordionItemContext();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const composedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof ref === "function") {
        const cleanup = (
          ref as (node: HTMLDivElement | null) => void | (() => void)
        )(node);
        if (typeof cleanup === "function") {
          return () => {
            panelRef.current = null;
            cleanup();
          };
        }
      } else if (ref) ref.current = node;
    },
    [ref]
  );
  const [height, setHeight] = React.useState<number | undefined>(
    isOpen ? undefined : 0
  );

  useIsomorphicLayoutEffect(() => {
    setContentId(id);
    return () => setContentId(undefined);
  }, [id, setContentId]);

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    // A controlled collapse may happen while a field is focused. Return focus
    // before making the panel inert so keyboard users keep their place.
    if (!isOpen && panel.contains(panel.ownerDocument.activeElement)) {
      triggerRef.current?.focus();
    }
    panel.toggleAttribute("inert", !isOpen);

    // Keep the measured height current when fonts, images or nested content
    // resize after opening. Retargeting the same transition avoids clipping.
    const measure = () => setHeight(isOpen ? content.scrollHeight : 0);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [isOpen, children, triggerRef]);

  return (
    <div
      ref={composedRef}
      className={cn(accordionContentVariants({ variant, className }))}
      style={{
        height: height !== undefined ? `${height}px` : undefined,
        ...style,
      }}
      id={id ?? contentId}
      data-accordion-content=""
      data-state={isOpen ? "open" : "closed"}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!isOpen}
      {...props}
    >
      <div
        ref={contentRef}
        className={cn(
          "min-w-0 pb-5 pr-8 transition-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none motion-reduce:[transition-duration:0ms]",
          isOpen
            ? "translate-y-0 [transition-duration:240ms]"
            : "-translate-y-[3px] [transition-duration:150ms]"
        )}
      >
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
