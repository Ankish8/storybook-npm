import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Check, AlertTriangle, Info, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>
  ) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[9999999] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[480px]",
        className
      )}
      {...props}
    />
  )
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full min-w-0 flex-col items-stretch gap-1 overflow-hidden p-4 pr-12 rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-v2-semantic-text-primary shadow-[0_12px_32px_color-mix(in_srgb,var(--v2-shadow-color,var(--semantic-bg-inverted))_8%,transparent),0_2px_8px_color-mix(in_srgb,var(--v2-shadow-color,var(--semantic-bg-inverted))_4%,transparent)] transition-[transform,opacity] duration-200 [transition-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:transition-none data-[state=open]:motion-safe:animate-in data-[state=open]:motion-safe:fade-in-0 data-[state=open]:motion-safe:zoom-in-[0.98] data-[state=open]:motion-safe:slide-in-from-top-2 data-[state=open]:sm:motion-safe:slide-in-from-bottom-2 data-[state=open]:motion-safe:[animation-duration:240ms] data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=closed]:motion-safe:[animation-duration:160ms] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] data-[state=closed]:pointer-events-none data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:translate-y-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=end]:motion-safe:animate-out data-[swipe=end]:motion-safe:fade-out-0 data-[swipe=end]:data-[swipe-direction=right]:motion-safe:slide-out-to-right-full data-[swipe=end]:data-[swipe-direction=left]:motion-safe:slide-out-to-left-full data-[swipe=end]:data-[swipe-direction=up]:motion-safe:slide-out-to-top-full data-[swipe=end]:data-[swipe-direction=down]:motion-safe:slide-out-to-bottom-full data-[swipe=end]:motion-safe:[animation-duration:160ms] motion-reduce:data-[swipe=end]:animate-[v2-fade-out_100ms_ease-in]",
  {
    variants: {
      variant: {
        default: "default",
        success: "success",
        error: "error",
        warning: "warning",
        destructive: "destructive",
        info: "info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(
  (
    {
      className,
      variant,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
      VariantProps<typeof toastVariants>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>
  ) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        data-v2-toast-variant={variant ?? "default"}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>
  ) => (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 [@media(pointer:coarse)]:min-h-11 shrink-0 items-center justify-center rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-medium tracking-[0.06px] text-v2-semantic-text-secondary transition-[color,background-color,transform] duration-150 motion-reduce:transition-colors motion-safe:active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-v2-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>
  ) => (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        "absolute right-2 top-2 inline-flex size-8 [@media(pointer:coarse)]:size-11 shrink-0 items-center justify-center rounded-md p-0 text-v2-semantic-text-muted transition-[color,background-color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] active:[transition-duration:160ms,160ms,120ms] motion-reduce:transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-v2-semantic-bg-ui [@media(hover:hover)_and_(pointer:fine)]:hover:text-v2-semantic-text-primary motion-safe:active:scale-[0.96] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
        className
      )}
      aria-label="Dismiss notification"
      toast-close=""
      {...props}
    >
      <X className="size-4" strokeWidth={2} />
    </ToastPrimitives.Close>
  )
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>
  ) => (
    <ToastPrimitives.Title
      ref={ref}
      className={cn(
        "m-0 min-w-0 break-words text-sm font-medium leading-5 text-v2-semantic-text-primary",
        className
      )}
      {...props}
    />
  )
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>,
    ref: React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>
  ) => (
    <ToastPrimitives.Description
      ref={ref}
      className={cn(
        "m-0 min-w-0 break-words text-sm leading-5 text-v2-semantic-text-secondary",
        className
      )}
      {...props}
    />
  )
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
};

// ============================================================================
// Toast Hook & Toaster Component
// ============================================================================

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 2000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  /**
   * Duration in milliseconds before the toast is removed after dismissal.
   * Defaults to 2000ms (2 seconds).
   */
  duration?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration?: number) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(
    () => {
      toastTimeouts.delete(toastId);
      dispatch({
        type: "REMOVE_TOAST",
        toastId: toastId,
      });
    },
    duration !== undefined && Number.isFinite(duration) && duration >= 0
      ? duration
      : TOAST_REMOVE_DELAY
  );

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        const toastItem = state.toasts.find((t) => t.id === toastId);
        addToRemoveQueue(toastId, toastItem?.duration);
      } else {
        state.toasts.forEach((toastItem) => {
          addToRemoveQueue(toastItem.id, toastItem.duration);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInput = Omit<ToasterToast, "id">;

function toast({ ...props }: ToastInput) {
  const id = genId();

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  const openChange =
    (handler: ToastProps["onOpenChange"]) => (open: boolean) => {
      handler?.(open);
      if (!open) dismiss();
    };
  const update = (next: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: {
        ...next,
        id,
        ...(Object.prototype.hasOwnProperty.call(next, "onOpenChange")
          ? { onOpenChange: openChange(next.onOpenChange) }
          : {}),
      },
    });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: openChange(props.onOpenChange),
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Convenience methods for different variants
toast.success = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "success" });
toast.error = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "error" });
toast.warning = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "warning" });
toast.info = (props: Omit<ToastInput, "variant">) =>
  toast({ ...props, variant: "info" });
toast.dismiss = (toastId?: string) =>
  dispatch({ type: "DISMISS_TOAST", toastId });

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Variant icons mapping
const variantIcons = {
  default: null,
  success: Check,
  error: X,
  destructive: X,
  warning: AlertTriangle,
  info: Info,
};

/** An opt-in stack uses the existing toast store and Radix controls. */
export interface ToasterProps {
  /** Keep the existing list presentation unless explicitly enabled. */
  stack?: boolean;
  /** Number of layers visible while collapsed. All queued toasts fan out. */
  visibleToasts?: number;
  /** Keep expanded; hover or focus can also temporarily fan out the stack. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  providerProps?: Omit<React.ComponentProps<typeof ToastProvider>, "children">;
  viewportProps?: React.ComponentPropsWithoutRef<typeof ToastViewport>;
}

interface ManagedToastProps {
  item: ToasterToast;
  stack: boolean;
  expanded: boolean;
  paused: boolean;
  inactive: boolean;
  hidden: boolean;
  offset: number;
  scale: number;
  height?: number;
  order: number;
  duration: number;
  onMeasure: (id: string, height: number) => void;
  onDismiss: (id: string) => void;
  onDraggingChange: (dragging: boolean) => void;
  onHoverChange: (hovered: boolean) => void;
}

/** Radix keeps control of actions, Escape and swipe. Only the optional stack
 * owns its countdown so an explicit expansion or hidden tab can pause it. */
function ManagedToast({
  item,
  stack,
  expanded,
  paused,
  inactive,
  hidden,
  offset,
  scale,
  height,
  order,
  duration,
  onMeasure,
  onDismiss,
  onDraggingChange,
  onHoverChange,
}: ManagedToastProps) {
  const {
    id,
    title,
    description,
    action,
    variant,
    className,
    style,
    onOpenChange,
    onPause,
    onResume,
    onSwipeStart,
    onSwipeCancel,
    onSwipeEnd,
    ...props
  } = item;
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const remaining = React.useRef(duration);
  const wasPaused = React.useRef(false);
  const open = item.open !== false;
  const changeOpen = React.useCallback(
    (next: boolean) => {
      if (!next) onDismiss(id);
      onOpenChange?.(next);
    },
    [id, onDismiss, onOpenChange]
  );

  React.useEffect(() => {
    if (!stack || !content) return;
    const measure = () => onMeasure(id, content.offsetHeight + 2);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [content, id, onMeasure, stack]);

  React.useEffect(() => {
    remaining.current = duration;
  }, [duration]);

  React.useEffect(() => {
    if (!stack || !open || paused || !duration || duration === Infinity) return;
    const started = Date.now();
    const timer = window.setTimeout(() => changeOpen(false), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started)
      );
    };
  }, [changeOpen, duration, open, paused, stack]);

  React.useEffect(() => {
    if (!stack || !open) return;
    if (paused && !wasPaused.current) onPause?.();
    if (!paused && wasPaused.current) onResume?.();
    wasPaused.current = paused;
  }, [onPause, onResume, open, paused, stack]);

  const Icon = variant ? variantIcons[variant] : null;
  return (
    <Toast
      {...props}
      ref={(node) => {
        // A string-valued inert attribute also works with React 18.
        node?.toggleAttribute("inert", inactive || !open);
      }}
      variant={variant}
      data-v2-toast-id={id}
      data-v2-toast-stack={stack || undefined}
      data-v2-toast-hidden={inactive || undefined}
      data-v2-toast-expanded={stack ? expanded : undefined}
      aria-hidden={inactive || !open ? true : props["aria-hidden"]}
      duration={stack ? Infinity : item.duration}
      onOpenChange={changeOpen}
      onPause={stack ? undefined : onPause}
      onResume={stack ? undefined : onResume}
      onSwipeStart={(event) => {
        onSwipeStart?.(event);
        if (!event.defaultPrevented && stack) onDraggingChange(true);
      }}
      onSwipeCancel={(event) => {
        onSwipeCancel?.(event);
        if (stack) onDraggingChange(false);
      }}
      onSwipeEnd={(event) => {
        onSwipeEnd?.(event);
        if (stack) onDraggingChange(false);
      }}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);
        if (
          !event.defaultPrevented &&
          stack &&
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover)").matches
        )
          onHoverChange(true);
      }}
      onPointerMove={(event) => {
        props.onPointerMove?.(event);
        if (
          !event.defaultPrevented &&
          stack &&
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover)").matches
        )
          onHoverChange(true);
      }}
      onPointerCancel={(event) => {
        props.onPointerCancel?.(event);
        if (stack) onDraggingChange(false);
      }}
      className={cn(
        "max-w-full p-0 sm:w-[28rem]",
        variant ?? "default",
        stack &&
          "absolute left-4 right-4 top-4 w-auto origin-top transition-[translate,scale,height,opacity] duration-300 [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none data-[swipe=move]:transition-none sm:w-auto",
        inactive && "pointer-events-none",
        stack && !expanded && order > 0 && "bg-v2-semantic-bg-ui",
        className
      )}
      style={
        stack
          ? {
              translate: `0 ${offset}px`,
              scale: String(scale),
              height,
              zIndex: TOAST_LIMIT - order,
              opacity: hidden ? 0 : 1,
              ...style,
            }
          : style
      }
    >
      <div
        ref={setContent}
        className={cn(
          "flex w-full items-start gap-3 py-3.5 pl-4 pr-3.5",
          stack && !expanded && order > 0 && "invisible"
        )}
      >
        {Icon && (
          <span
            className={cn(
              "grid size-[30px] shrink-0 place-items-center rounded-full border border-solid",
              variant === "success" &&
                "border-v2-semantic-success-border/40 bg-v2-semantic-success-surface text-v2-semantic-success-primary",
              (variant === "error" || variant === "destructive") &&
                "border-v2-semantic-error-border/40 bg-v2-semantic-error-surface text-v2-semantic-error-primary",
              variant === "warning" &&
                "border-v2-semantic-warning-border/40 bg-v2-semantic-warning-surface text-v2-semantic-warning-primary",
              variant === "info" &&
                "border-v2-semantic-info-border/40 bg-v2-semantic-info-surface text-v2-semantic-info-primary"
            )}
            data-v2-toast-indicator={variant}
          >
            <Icon className="size-4" strokeWidth={2} aria-hidden />
          </span>
        )}
        <div className="grid min-w-0 flex-1 gap-0.5 pt-[5px]">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {action && <div className="mt-2 flex flex-wrap">{action}</div>}
        </div>
        <ToastClose className="static right-auto top-auto -mr-0.5 -mt-px" />
      </div>
    </Toast>
  );
}

/** Mount once. Existing toast(), useToast(), Provider and helper calls work
 * in either presentation; stack is deliberately disabled by default. */
function Toaster({
  stack = false,
  visibleToasts = 3,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  providerProps,
  viewportProps = {},
}: ToasterProps = {}) {
  const { toasts } = useToast();
  const [pinned, setPinned] = React.useState(defaultExpanded);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [focusExpanded, setFocusExpanded] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [pageHidden, setPageHidden] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const viewport = React.useRef<HTMLOListElement | null>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const handOffFocus = React.useRef(false);
  const focusedToastId = React.useRef<string | null>(null);
  const viewportId = React.useId();
  const openToasts = toasts.filter((item) => item.open !== false);
  const count = openToasts.length;
  const pinnedExpanded = expandedProp ?? pinned;
  const expanded =
    stack && count > 0 && (pinnedExpanded || hovered || focusExpanded);
  const paused =
    stack && (expanded || hovered || focused || dragging || pageHidden);
  const layers = Math.max(
    1,
    Math.min(TOAST_LIMIT, Math.floor(visibleToasts) || 3)
  );
  const frontHeight = heights[openToasts[0]?.id] ?? 88;
  const listHeight = expanded
    ? openToasts.reduce((sum, item) => sum + (heights[item.id] ?? 88) + 12, -12)
    : count > 0
      ? frontHeight + (Math.min(count, layers) - 1) * 12
      : 0;
  const hasToggle = stack && count > 1;
  const measure = React.useCallback((id: string, height: number) => {
    if (height <= 2) return;
    setHeights((current) =>
      current[id] === height ? current : { ...current, [id]: height }
    );
  }, []);
  const dismiss = React.useCallback((id: string) => {
    const node = viewport.current;
    const leaving = node?.querySelector<HTMLElement>(
      `[data-v2-toast-id="${id}"]`
    );
    if (
      node &&
      (document.activeElement === node ||
        leaving?.contains(document.activeElement))
    ) {
      handOffFocus.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (!stack) return;
    const hidden = () => setPageHidden(document.visibilityState === "hidden");
    const blur = () => setPageHidden(true);
    hidden();
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", hidden);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", hidden);
    };
  }, [stack]);

  React.useEffect(() => {
    const node = viewport.current;
    if (!stack || !node) return;
    // Radix portals the cards into the list. Native focus events cross that
    // DOM boundary, while React events follow the card's owner tree.
    const focus = (event: FocusEvent) => {
      if (event.defaultPrevented) return;
      if (!node.contains(event.relatedTarget as Node | null)) {
        returnFocus.current =
          event.relatedTarget instanceof HTMLElement
            ? event.relatedTarget
            : null;
      }
      const target = event.target as HTMLElement;
      const item = target.closest<HTMLElement>("[data-v2-toast-id]");
      if (item) focusedToastId.current = item.dataset.v2ToastId ?? null;
      else if (target.closest("[data-v2-toast-stack-control]"))
        focusedToastId.current = null;
      setFocused(true);
      setFocusExpanded(!target.closest("[data-v2-toast-stack-control]"));
    };
    const blur = (event: FocusEvent) => {
      if (!node.contains(event.relatedTarget as Node | null)) {
        setFocused(false);
        setFocusExpanded(false);
        focusedToastId.current = null;
      }
    };
    const leave = () => setHovered(false);
    node.addEventListener("pointerleave", leave);
    node.addEventListener("focusin", focus);
    node.addEventListener("focusout", blur);
    return () => {
      node.removeEventListener("pointerleave", leave);
      node.removeEventListener("focusin", focus);
      node.removeEventListener("focusout", blur);
    };
  }, [stack]);

  React.useEffect(() => {
    if (
      focusedToastId.current &&
      !toasts.some(
        (item) => item.id === focusedToastId.current && item.open !== false
      )
    ) {
      handOffFocus.current = true;
    }
    if (!handOffFocus.current) return;
    handOffFocus.current = false;
    const next = viewport.current?.querySelector<HTMLElement>(
      '[data-v2-toast-id][data-state="open"]:not([inert])'
    );
    if (next) next.focus();
    else if (returnFocus.current?.isConnected) returnFocus.current.focus();
  }, [toasts]);

  function changeExpanded(next: boolean) {
    if (expandedProp === undefined) setPinned(next);
    onExpandedChange?.(next);
  }
  const canHover = (event: React.PointerEvent) =>
    event.pointerType === "mouse" &&
    window.matchMedia("(hover: hover)").matches;
  const { className, style, children, ...viewportAttributes } = viewportProps;

  return (
    <ToastProvider {...providerProps}>
      {toasts.map((item, index) => {
        const rank = openToasts.findIndex(
          (openItem) => openItem.id === item.id
        );
        const order = rank < 0 ? index : rank;
        const y = expanded
          ? openToasts
              .slice(0, Math.max(0, rank))
              .reduce(
                (sum, previous) => sum + (heights[previous.id] ?? 88) + 12,
                0
              )
          : order * 12;
        return (
          <ManagedToast
            key={item.id}
            item={item}
            stack={stack}
            expanded={expanded}
            paused={paused}
            inactive={stack && (rank < 0 || (!expanded && order > 0))}
            hidden={stack && rank >= 0 && !expanded && order >= layers}
            offset={
              listHeight -
              (expanded ? (heights[item.id] ?? 88) : frontHeight) -
              y
            }
            scale={expanded ? 1 : 1 - Math.min(order, layers - 1) * 0.04}
            height={
              stack ? (expanded ? heights[item.id] : frontHeight) : undefined
            }
            order={order}
            duration={item.duration || (providerProps?.duration ?? 5000)}
            onMeasure={measure}
            onDismiss={dismiss}
            onDraggingChange={setDragging}
            onHoverChange={setHovered}
          />
        );
      })}
      <ToastViewport
        {...viewportAttributes}
        id={viewportProps.id ?? viewportId}
        ref={viewport}
        data-v2-toast-stack={stack || undefined}
        data-expanded={stack ? expanded : undefined}
        data-paused={stack ? paused : undefined}
        className={cn(
          stack &&
            "bottom-0 right-0 top-auto flex-col overflow-x-hidden overflow-y-auto overscroll-contain [--myoperator-toast-stack-control-space:36px] [@media(pointer:coarse)]:[--myoperator-toast-stack-control-space:52px] transition-[height] duration-300 [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none",
          className
        )}
        style={
          stack
            ? {
                height: hasToggle
                  ? `calc(${listHeight}px + 32px + var(--myoperator-toast-stack-control-space, 36px))`
                  : listHeight + 32,
                ...style,
              }
            : style
        }
        onPointerEnter={(event) => {
          viewportProps.onPointerEnter?.(event);
          if (!event.defaultPrevented && stack && canHover(event))
            setHovered(true);
        }}
        onPointerMove={(event) => {
          viewportProps.onPointerMove?.(event);
          if (!event.defaultPrevented && stack && canHover(event))
            setHovered(true);
        }}
        onPointerLeave={(event) => {
          viewportProps.onPointerLeave?.(event);
          if (!event.defaultPrevented) setHovered(false);
        }}
      >
        {children}
        {hasToggle && (
          <li
            className="absolute left-4 right-4 flex list-none justify-end"
            style={{ top: listHeight + 28 }}
            data-v2-toast-stack-control=""
          >
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={viewportProps.id ?? viewportId}
              aria-label={
                pinnedExpanded
                  ? "Collapse notifications"
                  : expanded
                    ? "Keep notifications expanded"
                    : "Expand notifications"
              }
              onClick={() => changeExpanded(!pinnedExpanded)}
              className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-3 py-1 text-xs text-v2-semantic-text-secondary shadow-sm transition-colors [@media(pointer:coarse)]:min-h-11 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-v2-semantic-bg-ui focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-v2-semantic-border-focus"
            >
              {count} notifications
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3 transition-transform duration-200 motion-reduce:transition-none",
                  expanded && "rotate-180"
                )}
              />
            </button>
          </li>
        )}
      </ToastViewport>
    </ToastProvider>
  );
}

export { useToast, toast, Toaster };

/**
 * Toast notification system using Radix UI primitives.
 *
 * @example
 * ```tsx
 * // In your App.tsx or layout
 * import { Toaster } from "@/components/ui/v2/toast"
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Trigger toasts from anywhere
 * import { toast } from "@/components/ui/v2/toast"
 *
 * // Simple message
 * toast({ title: "Event has been created" })
 *
 * // Success toast
 * toast.success({
 *   title: "Success!",
 *   description: "Your changes have been saved."
 * })
 *
 * // Error toast
 * toast.error({
 *   title: "Error",
 *   description: "Something went wrong. Please try again."
 * })
 *
 * // Warning toast
 * toast.warning({
 *   title: "Warning",
 *   description: "This action cannot be undone."
 * })
 *
 * // Info toast
 * toast.info({
 *   title: "Info",
 *   description: "You have 3 new notifications."
 * })
 *
 * // With action button
 * toast({
 *   title: "Event created",
 *   action: <ToastAction altText="Undo">Undo</ToastAction>
 * })
 *
 * // Dismiss all toasts
 * toast.dismiss()
 * ```
 */
