import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

// Keep Radix's 700ms delay, 300ms skip window and hoverable-content controls.
const TooltipProvider = TooltipPrimitive.Provider;

function usePrefersTapTooltipInteraction() {
  const [tapMode, setTapMode] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: none)").matches;
  });

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(hover: none)");
    const sync = () => setTapMode(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return tapMode;
}

type TooltipFieldContextValue = {
  tapMode: boolean;
  open: boolean;
  setOpen: (next: boolean) => void;
  suppressPrimitiveChangeRef: React.MutableRefObject<boolean>;
  suppressTouchFocusOpenRef: React.MutableRefObject<boolean>;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const TooltipFieldContext =
  React.createContext<TooltipFieldContextValue | null>(null);

function useTooltipFieldContext() {
  const context = React.useContext(TooltipFieldContext);
  if (!context) throw new Error("TooltipTrigger must be used within Tooltip");
  return context;
}

const Tooltip = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const tapMode = usePrefersTapTooltipInteraction();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const suppressPrimitiveChangeRef = React.useRef(false);
  const suppressTouchFocusOpenRef = React.useRef(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, openProp, onOpenChange]
  );

  return (
    <TooltipFieldContext.Provider
      value={{
        tapMode,
        open,
        setOpen,
        suppressPrimitiveChangeRef,
        suppressTouchFocusOpenRef,
        triggerRef,
      }}
    >
      <TooltipPrimitive.Root
        {...props}
        open={open}
        onOpenChange={(next) => {
          if (suppressPrimitiveChangeRef.current) return;
          // Touch compatibility mouse events focus the trigger after pointerup,
          // before click. The click owns this toggle, including controlled roots.
          if (next && suppressTouchFocusOpenRef.current) return;
          setOpen(next);
        }}
      />
    </TooltipFieldContext.Provider>
  );
};
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(
  (
    { onPointerDown, onPointerCancel, onClick, onBlur, className, ...props },
    ref
  ) => {
    const {
      tapMode,
      open,
      setOpen,
      suppressPrimitiveChangeRef,
      suppressTouchFocusOpenRef,
      triggerRef,
    } = useTooltipFieldContext();
    const touchPointerRef = React.useRef(false);

    // Radix closes on pointerdown/click. Ignore that change during a tap, while
    // leaving the native event intact for links, forms and host event handlers.
    const suppressPrimitiveChange = () => {
      suppressPrimitiveChangeRef.current = true;
      queueMicrotask(() => {
        suppressPrimitiveChangeRef.current = false;
      });
    };

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

    return (
      <TooltipPrimitive.Trigger
        {...props}
        ref={composedRef}
        className={cn("cursor-pointer", className)}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (event.defaultPrevented) return;
          touchPointerRef.current = tapMode || event.pointerType === "touch";
          if (touchPointerRef.current) {
            suppressTouchFocusOpenRef.current = true;
            suppressPrimitiveChange();
          }
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          touchPointerRef.current = false;
          suppressTouchFocusOpenRef.current = false;
        }}
        onClick={(event) => {
          onClick?.(event);
          const isTap = tapMode || touchPointerRef.current;
          touchPointerRef.current = false;
          suppressTouchFocusOpenRef.current = false;
          if (event.defaultPrevented || !isTap) return;
          suppressPrimitiveChange();
          setOpen(!open);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          touchPointerRef.current = false;
          suppressTouchFocusOpenRef.current = false;
        }}
      />
    );
  }
);
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {
  /** A neutral dark surface by default, or a light surface for dark contexts. */
  variant?: "default" | "light";
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      variant = "default",
      sideOffset = 4,
      forceMount,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const { triggerRef } = useTooltipFieldContext();
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLDivElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              contentRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
      },
      [ref]
    );

    return (
      <TooltipPrimitive.Portal forceMount={forceMount}>
        <TooltipPrimitive.Content
          {...props}
          ref={composedRef}
          forceMount={forceMount}
          sideOffset={sideOffset}
          data-variant={variant}
          className={cn(
            "z-[9999] pointer-events-none data-[state=delayed-open]:pointer-events-auto data-[state=instant-open]:pointer-events-auto max-w-[15rem] whitespace-normal break-words rounded-md border border-solid px-3 py-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-5 shadow-md origin-[var(--radix-tooltip-content-transform-origin)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:[animation-duration:160ms] motion-safe:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=instant-open]:motion-safe:[animation-duration:120ms] data-[state=delayed-open]:motion-safe:zoom-in-[0.98] data-[state=delayed-open]:data-[side=bottom]:motion-safe:slide-in-from-top-[3px] data-[state=delayed-open]:data-[side=left]:motion-safe:slide-in-from-right-[3px] data-[state=delayed-open]:data-[side=right]:motion-safe:slide-in-from-left-[3px] data-[state=delayed-open]:data-[side=top]:motion-safe:slide-in-from-bottom-[3px] data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=closed]:motion-safe:[animation-duration:100ms] motion-reduce:animate-none motion-reduce:transform-none",
            variant === "light"
              ? "border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary [--tooltip-arrow-fill:var(--semantic-bg-primary)]"
              : "border-semantic-bg-secondary bg-semantic-bg-secondary text-semantic-text-inverted [--tooltip-arrow-fill:var(--semantic-bg-secondary)]",
            className
          )}
          onEscapeKeyDown={(event) => {
            onEscapeKeyDown?.(event);
            if (event.defaultPrevented) return;
            // Ordinary tooltips leave focus on their trigger. Restore it only
            // when a caller's existing composition moved focus into the bubble.
            if (
              contentRef.current?.contains(
                contentRef.current.ownerDocument.activeElement
              )
            ) {
              triggerRef.current?.focus({ preventScroll: true });
            }
          }}
        />
      </TooltipPrimitive.Portal>
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    aria-hidden="true"
    {...props}
    ref={ref}
    className={cn(
      "fill-[var(--tooltip-arrow-fill,var(--semantic-bg-secondary))]",
      className
    )}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
