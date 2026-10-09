import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/**
 * Arc opens a tooltip after 250ms (Radix's own default is 700ms) and lets the next one open without delay for
 * 300ms after the last closes (Radix's default skip window). A `delayDuration` passed here still wins.
 */
const TooltipProvider = ({
  delayDuration = 250,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);
TooltipProvider.displayName = "TooltipProvider";

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

const TooltipFieldContext =
  React.createContext<TooltipFieldContextValue | null>(null);

function useTooltipFieldContext() {
  const ctx = React.useContext(TooltipFieldContext);
  if (!ctx) {
    throw new Error("TooltipTrigger must be used within Tooltip");
  }
  return ctx;
}

const Tooltip = (props: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const {
    open: openProp,
    defaultOpen,
    onOpenChange: onOpenChangeProp,
    delayDuration: delayDurationProp,
  } = props;
  const tapMode = usePrefersTapTooltipInteraction();
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    () => defaultOpen ?? false
  );

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
    [isControlled, onOpenChangeProp, tapMode]
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
    [isControlled, openProp, onOpenChangeProp]
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
>(({ onPointerDown, onClick, className, ...props }, ref) => {
  const { tapMode, open, setOpen, isControlled, suppressFocusOpenRef } =
    useTooltipFieldContext();

  const onPointerDownForTap = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (tapMode) {
        suppressFocusOpenRef.current = true;
      }
      if (tapMode && open) {
        e.preventDefault();
      }
    },
    [tapMode, open, suppressFocusOpenRef]
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
    [tapMode, isControlled, open, setOpen, suppressFocusOpenRef]
  );

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      className={cn("cursor-pointer", className)}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented) {
          onPointerDownForTap(e);
        }
      }}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          onClickForTap(e);
        }
      }}
    />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

/**
 * Arc's tooltip. Opened through the delay it rises 3px from its trigger and grows from 0.97 over 160ms; Radix
 * emits `instant-open` for a tooltip that opens inside the skip-delay window (pointer moved straight from one
 * trigger to the next) and for keyboard focus, and that one only fades, over 120ms. Closing is a 120ms fade to 0.98.
 * The 1px `border-black/5` edge keeps the pale #ECF1FB surface from melting into a white page; `black/5` resolves
 * to a static colour, not a var(), so the alpha works.
 */
const TooltipContent = React.forwardRef(
  (
    {
      className,
      sideOffset = 8,
      collisionPadding = 12,
      ...props
    }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>>
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-[9999] pointer-events-none data-[state=delayed-open]:pointer-events-auto data-[state=instant-open]:pointer-events-auto rounded-md border border-solid border-black/5 bg-semantic-info-surface px-4 py-3 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-normal leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)] shadow-[0_6px_18px_rgba(0,0,0,0.065),0_1px_3px_rgba(0,0,0,0.035)] origin-[var(--radix-tooltip-content-transform-origin)] motion-safe:[animation-duration:160ms] data-[state=instant-open]:motion-safe:[animation-duration:120ms] data-[state=closed]:motion-safe:[animation-duration:120ms] [animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] data-[state=instant-open]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] motion-safe:animate-in motion-safe:fade-in-0 data-[state=delayed-open]:motion-safe:zoom-in-[0.97] data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-[3px] data-[state=delayed-open]:data-[side=left]:slide-in-from-right-[3px] data-[state=delayed-open]:data-[side=right]:slide-in-from-left-[3px] data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-[3px] max-w-[15rem] whitespace-normal",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>,
    ref: React.Ref<React.ElementRef<typeof TooltipPrimitive.Arrow>>
  ) => (
    <TooltipPrimitive.Arrow
      ref={ref}
      className={cn("fill-semantic-info-surface", className)}
      {...props}
    />
  )
);
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
