import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[9999999] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default:
          "border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary",
        success:
          "border-semantic-success-border bg-semantic-success-surface text-semantic-success-hover",
        error:
          "border-semantic-error-border bg-semantic-error-surface text-semantic-error-hover",
        warning:
          "border-semantic-warning-border bg-semantic-warning-surface text-semantic-warning-hover",
        info: "border-semantic-info-border bg-semantic-info-surface text-semantic-info-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded border border-semantic-border-layout bg-transparent px-3 text-sm font-medium transition-colors hover:bg-semantic-bg-ui focus:outline-none focus:ring-2 focus:ring-semantic-info-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.success]:border-semantic-success-primary/30 group-[.success]:hover:border-semantic-success-primary/50 group-[.success]:hover:bg-semantic-success-primary/10",
      "group-[.error]:border-semantic-error-primary/30 group-[.error]:hover:border-semantic-error-primary/50 group-[.error]:hover:bg-semantic-error-primary/10",
      "group-[.warning]:border-semantic-warning-primary/30 group-[.warning]:hover:border-semantic-warning-primary/50 group-[.warning]:hover:bg-semantic-warning-primary/10",
      "group-[.info]:border-semantic-info-primary/30 group-[.info]:hover:border-semantic-info-primary/50 group-[.info]:hover:bg-semantic-info-primary/10",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-semantic-text-muted opacity-0 transition-opacity hover:text-semantic-text-primary focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      "group-[.success]:text-semantic-success-hover group-[.success]:hover:text-semantic-success-hover",
      "group-[.error]:text-semantic-error-hover group-[.error]:hover:text-semantic-error-hover",
      "group-[.warning]:text-semantic-warning-hover group-[.warning]:hover:text-semantic-warning-hover",
      "group-[.info]:text-semantic-info-hover group-[.info]:hover:text-semantic-info-hover",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
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
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
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

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

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
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
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
 * import { Toaster } from "@/components/ui/toast"
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
            className={variant ?? undefined}
            {...props}
          >
            <div className="flex gap-3">
              {Icon && (
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    variant === "success" && "text-semantic-success-primary",
                    variant === "error" && "text-semantic-error-primary",
                    variant === "warning" && "text-semantic-warning-primary",
                    variant === "info" && "text-semantic-info-primary"
                  )}
                />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
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
 * import { Toaster } from "@/components/ui/toast"
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
 * import { toast } from "@/components/ui/toast"
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
