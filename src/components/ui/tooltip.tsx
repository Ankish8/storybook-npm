import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

/** True when the primary input cannot hover (touch / most phones & tablets). Desktop hover stays false. */
function usePrefersTapTooltipInteraction() {
  const [tapMode, setTapMode] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return false;
    }
    return window.matchMedia("(hover: none)").matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setTapMode(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return tapMode;
}

type TooltipFieldContextValue = {
  tapMode: boolean;
  open: boolean;
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
  isControlled: boolean;
  /** True after pointerdown on touch; Radix may fire onOpenChange(true) from focus before click — ignore that open. */
  suppressFocusOpenRef: React.MutableRefObject<boolean>;
};

const TooltipFieldContext = React.createContext<TooltipFieldContextValue | null>(null);

function useTooltipFieldContext() {
  const ctx = React.useContext(TooltipFieldContext);
  if (!ctx) {
    throw new Error("TooltipTrigger must be used within Tooltip");
  }
  return ctx;
}

function composeEventHandlers<E extends React.SyntheticEvent>(
  original: React.EventHandler<E> | undefined,
  next: React.EventHandler<E> | undefined,
) {
  return (event: E) => {
    original?.(event);
    if (!event.defaultPrevented) {
      next?.(event);
    }
  };
}

const Tooltip = (props: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const { open: openProp, defaultOpen, onOpenChange: onOpenChangeProp, delayDuration: delayDurationProp } = props;
  const tapMode = usePrefersTapTooltipInteraction();
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(() => defaultOpen ?? false);

  const suppressFocusOpenRef = React.useRef(false);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        if (tapMode && next === true && suppressFocusOpenRef.current) {
          return;
        }
        setUncontrolledOpen(next);
      }
      onOpenChangeProp?.(next);
    },
    [isControlled, onOpenChangeProp, tapMode],
  );

  const openSnapshot = isControlled ? openProp! : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      if (isControlled) {
        const value = typeof next === "function" ? next(openProp!) : next;
        onOpenChangeProp?.(value);
      } else {
        setUncontrolledOpen(next);
      }
    },
    [isControlled, openProp, onOpenChangeProp],
  );

  const rootProps: React.ComponentProps<typeof TooltipPrimitive.Root> = (() => {
    if (isControlled) {
      return props;
    }
    if (tapMode) {
      return {
        ...props,
        defaultOpen: undefined,
        open: uncontrolledOpen,
        onOpenChange: handleOpenChange,
        delayDuration: delayDurationProp ?? 0,
      };
    }
    return {
      ...props,
      onOpenChange: handleOpenChange,
    };
  })();

  const contextValue: TooltipFieldContextValue = {
    tapMode,
    open: openSnapshot,
    setOpen,
    isControlled,
    suppressFocusOpenRef,
  };

  return (
    <TooltipFieldContext.Provider value={contextValue}>
      <TooltipPrimitive.Root {...rootProps} />
    </TooltipFieldContext.Provider>
  );
};
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onPointerDown, onClick, ...props }, ref) => {
  const { tapMode, open, setOpen, isControlled, suppressFocusOpenRef } = useTooltipFieldContext();

  const onPointerDownForTap = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (tapMode) {
        suppressFocusOpenRef.current = true;
      }
      if (tapMode && open) {
        e.preventDefault();
      }
    },
    [tapMode, open, suppressFocusOpenRef],
  );

  const onClickForTap = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!tapMode) {
        return;
      }
      e.preventDefault();
      if (isControlled) {
        setOpen(!open);
      } else {
        setOpen((o) => !o);
      }
      suppressFocusOpenRef.current = false;
    },
    [tapMode, isControlled, open, setOpen, suppressFocusOpenRef],
  );

  /* Event-handler-only ref writes; rule misfires on composeEventHandlers + useCallback. */
  /* eslint-disable react-hooks/refs -- suppressFocusOpenRef */
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      onPointerDown={composeEventHandlers(onPointerDown, onPointerDownForTap)}
      onClick={composeEventHandlers(onClick, onClickForTap)}
    />
  );
  /* eslint-enable react-hooks/refs */
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] overflow-hidden rounded-md bg-semantic-primary px-3 py-1.5 text-xs text-semantic-text-inverted shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-xs whitespace-normal",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>, ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Arrow>>) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-semantic-primary", className)}
    {...props}
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
