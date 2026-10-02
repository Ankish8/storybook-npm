import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

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
        "fixed top-0 z-[9999999] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  )
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full flex-col items-stretch overflow-hidden rounded-lg border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03),0_3px_3px_-1.5px_rgba(10,13,18,0.04)] transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default:
          "border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary",
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
        "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-semibold tracking-[0.06px] text-semantic-text-secondary shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)] transition-colors hover:bg-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary disabled:pointer-events-none disabled:opacity-50",
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
        "inline-flex size-6 shrink-0 items-center justify-center rounded-md p-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus:outline-none focus:ring-2 focus:ring-semantic-border-focus",
        className
      )}
      toast-close=""
      {...props}
    >
      <X className="h-3 w-3" />
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
        "m-0 text-base font-medium text-semantic-text-primary",
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
        "m-0 text-xs tracking-[0.048px] text-semantic-text-muted group-data-[v2-toast-variant=success]:text-semantic-success-text group-data-[v2-toast-variant=error]:text-semantic-error-text group-data-[v2-toast-variant=destructive]:text-semantic-error-text group-data-[v2-toast-variant=warning]:text-semantic-warning-text group-data-[v2-toast-variant=info]:text-semantic-info-text",
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
  success: CheckCircle2,
  error: XCircle,
  destructive: XCircle,
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
    <ToastProvider>
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
            className={cn("sm:w-[384px] max-w-full", variant ?? "default")}
            {...props}
          >
            <div
              className={cn(
                "flex w-full items-center gap-4 p-4",
                (description || action) &&
                  "border-b-[0.4px] border-solid border-inherit"
              )}
            >
              {Icon && <Icon className="size-5 shrink-0" />}
              <div className="min-w-0 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
              </div>
              <ToastClose aria-label="Dismiss notification" />
            </div>
            {(description || action) && (
              <div className="flex w-full items-center gap-3 px-4 py-3">
                {description && (
                  <ToastDescription className="min-w-0 flex-1">
                    {description}
                  </ToastDescription>
                )}
                {action}
              </div>
            )}
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
