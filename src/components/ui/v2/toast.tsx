import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Check, AlertTriangle, Info } from "lucide-react";

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
        "fixed top-0 z-[9999999] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[448px]",
        className
      )}
      {...props}
    />
  )
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full flex-col items-stretch overflow-hidden rounded-lg border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)] transition-[transform,opacity] duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none " +
    // Open: rise 16px from 0.96 on a spring (ζ 0.84, about 480ms) with a separate 240ms fade, as Arc's toast does.
    // Close: sink 8px to 0.97 and fade over 180ms; a swipe throws it sideways instead (no scale, no sink).
    "data-[state=open]:motion-safe:[animation-name:enter,v2-fade-in] data-[state=open]:motion-safe:[animation-duration:500ms,240ms] data-[state=open]:motion-safe:[animation-timing-function:linear(0.0000_0%,0.0270_4%,0.0940_8%,0.1839_12%,0.2842_16%,0.3864_20%,0.4846_24%,0.5753_28%,0.6564_32%,0.7271_36%,0.7874_40%,0.8378_44%,0.8792_48%,0.9125_52%,0.9388_56%,0.9592_60%,0.9747_64%,0.9862_68%,0.9944_72%,1.0001_76%,1.0038_80%,1.0061_84%,1.0073_88%,1.0077_92%,1.0076_96%,1_100%),var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] data-[state=closed]:motion-safe:[animation-duration:180ms] data-[state=closed]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] motion-reduce:data-[swipe=end]:animate-[v2-fade-out_100ms_ease-in] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[swipe=end]:motion-safe:animate-out data-[state=open]:motion-safe:zoom-in-[0.96] data-[state=closed]:motion-safe:zoom-out-[0.97] data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:slide-out-to-top-2 data-[state=closed]:sm:motion-safe:slide-out-to-bottom-2 data-[state=closed]:data-[swipe=end]:motion-safe:[--tw-exit-scale:1] data-[state=closed]:data-[swipe=end]:motion-safe:[--tw-exit-translate-y:0px] data-[swipe=end]:motion-safe:slide-out-to-right-full data-[state=open]:motion-safe:slide-in-from-top-4 data-[state=open]:sm:motion-safe:slide-in-from-bottom-4",
  {
    variants: {
      variant: {
        default:
          "border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)]",
        success:
          "border-[var(--color-success-200)] bg-semantic-success-surface text-semantic-success-text",
        error:
          "border-[var(--color-error-200)] bg-semantic-error-surface text-semantic-error-text",
        warning:
          "border-[var(--color-warning-200)] bg-semantic-warning-surface text-semantic-warning-text",
        destructive:
          "border-[var(--color-error-200)] bg-semantic-error-surface text-semantic-error-text",
        info: "border-[var(--color-info-200)] bg-semantic-info-surface text-semantic-info-text",
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
        "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-medium tracking-[0.06px] text-[var(--v2-text-secondary,#5E5E5E)] shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)] transition-[color,background-color,transform] duration-150 motion-reduce:transition-colors motion-safe:active:scale-[0.98] [@media(hover:hover)]:hover:bg-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary disabled:pointer-events-none disabled:opacity-50",
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
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md p-0 text-[var(--v2-text-muted,#707070)] transition-[color,background-color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] active:[transition-duration:160ms,160ms,120ms] motion-reduce:transition-colors [@media(hover:hover)]:hover:bg-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] motion-safe:active:scale-[0.96] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary",
        className
      )}
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
        "m-0 text-sm font-medium leading-[1.4] text-[var(--v2-text-primary,#484848)]",
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
        "m-0 text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)] group-data-[v2-toast-variant=success]:text-semantic-success-text group-data-[v2-toast-variant=error]:text-semantic-error-text group-data-[v2-toast-variant=destructive]:text-semantic-error-text group-data-[v2-toast-variant=warning]:text-semantic-warning-text group-data-[v2-toast-variant=info]:text-semantic-info-text",
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

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, duration ?? TOAST_REMOVE_DELAY);

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

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
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

/**
 * Toaster component that renders toast notifications.
 * Place this component once at the root of your app.
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
 */
function Toaster() {
  const { toasts } = useToast();

  return (
    // Arc: auto-dismiss after 4.5s, and a swipe past 80px throws the toast away.
    <ToastProvider duration={4500} swipeThreshold={80}>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const Icon = variant ? variantIcons[variant] : null;

        return (
          <Toast
            key={id}
            variant={variant}
            className={cn("sm:w-[26rem] max-w-full", variant ?? "default")}
            {...props}
          >
            {/* Arc's layout: 30px status chip, copy column, 32px dismiss, 16/14px padding, 12px gap. */}
            <div className="flex w-full items-start gap-3 py-3.5 pl-4 pr-3.5">
              {Icon && (
                <span className="grid size-[30px] shrink-0 place-items-center rounded-full border border-solid border-[color-mix(in_oklab,currentColor_24%,transparent)] bg-[color-mix(in_oklab,currentColor_10%,transparent)]">
                  <Icon className="size-4" strokeWidth={2.25} aria-hidden />
                </span>
              )}
              <div className="grid min-w-0 flex-1 gap-0.5 pt-[5px]">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {action && <div className="mt-2 flex">{action}</div>}
              </div>
              <ToastClose
                aria-label="Dismiss notification"
                className="-mr-0.5 -mt-px"
              />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
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
