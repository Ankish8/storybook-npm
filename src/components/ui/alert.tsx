import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Alert variants for different notification types.
 * Colors are hardcoded for Bootstrap compatibility.
 */
const alertVariants = cva(
  "relative w-full rounded border p-4 text-sm text-semantic-text-primary [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-semantic-bg-ui border-semantic-border-layout [&>svg]:text-semantic-text-primary",
        success:
          "bg-semantic-success-surface border-semantic-success-border [&>svg]:text-semantic-success-primary",
        error:
          "bg-semantic-error-surface border-semantic-error-border [&>svg]:text-semantic-error-primary",
        destructive:
          "bg-semantic-error-surface border-semantic-error-border [&>svg]:text-semantic-error-primary",
        warning:
          "bg-semantic-warning-surface border-semantic-warning-border [&>svg]:text-semantic-warning-primary",
        info: "bg-semantic-info-surface border-semantic-info-border [&>svg]:text-semantic-info-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Default icons for each alert variant
 */
const defaultIcons: Record<string, React.ReactNode> = {
  default: <Info className="size-5" />,
  success: <CheckCircle2 className="size-5" />,
  error: <XCircle className="size-5" />,
  destructive: <XCircle className="size-5" />,
  warning: <AlertTriangle className="size-5" />,
  info: <Info className="size-5" />,
};

/**
 * Dismissible alert banners for notifications, errors, warnings, and success messages.
 *
 * @example
 * ```tsx
 * // Simple alert
 * <Alert variant="success">
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 *
 * // With close button and actions
 * <Alert
 *   variant="error"
 *   closable
 *   onClose={() => console.log('closed')}
 *   action={<Button size="sm">Retry</Button>}
 * >
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 *
 * // Controlled visibility
 * const [open, setOpen] = useState(true)
 * <Alert open={open} onClose={() => setOpen(false)} closable>...</Alert>
 * ```
 */
export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Custom icon to display. Set to null to hide icon. */
  icon?: React.ReactNode | null;
  /** Whether to show the default variant icon (default: true) */
  showIcon?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Primary action element (e.g., button) */
  action?: React.ReactNode;
  /** Secondary action element */
  secondaryAction?: React.ReactNode;
  /** Controlled visibility state */
  open?: boolean;
  /** Initial visibility for uncontrolled mode (default: true) */
  defaultOpen?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      icon,
      showIcon = true,
      closable = false,
      onClose,
      action,
      secondaryAction,
      open: controlledOpen,
      defaultOpen = true,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleClose = React.useCallback(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onClose?.();
    }, [isControlled, onClose]);

    if (!isOpen) {
      return null;
    }

    const renderIcon = () => {
      if (icon === null || !showIcon) return null;
      if (icon) return icon;
      return defaultIcons[variant || "default"];
    };

    const hasActions = action || secondaryAction;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(alertVariants({ variant, className }))}
        {...props}
      >
        {renderIcon()}
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex-1">{children}</div>
          {(hasActions || closable) && (
            <div className="flex shrink-0 items-center gap-2">
              {secondaryAction}
              {action}
              {closable && (
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    "rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    variant === "default" && "focus:ring-semantic-text-primary",
                    variant === "success" &&
                      "focus:ring-semantic-success-primary",
                    (variant === "error" || variant === "destructive") &&
                      "focus:ring-semantic-error-primary",
                    variant === "warning" &&
                      "focus:ring-semantic-warning-primary",
                    variant === "info" && "focus:ring-semantic-info-primary"
                  )}
                  aria-label="Close alert"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

/**
 * Alert title component for the heading text.
 */
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

/**
 * Alert description component for the body text.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-1 text-sm", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
