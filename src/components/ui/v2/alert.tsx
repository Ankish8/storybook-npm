import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm text-[var(--v2-text-secondary,#5E5E5E)]",
  {
    variants: {
      variant: {
        default: "bg-semantic-bg-primary border-semantic-border-layout",
        success:
          "bg-semantic-success-surface border-[var(--color-success-200)]",
        error: "bg-semantic-error-surface border-[var(--color-error-200)]",
        destructive:
          "bg-semantic-error-surface border-[var(--color-error-200)]",
        warning:
          "bg-semantic-warning-surface border-[var(--color-warning-200)]",
        info: "bg-semantic-info-surface border-[var(--color-info-200)]",
      },
      presentation: {
        inline: "p-4",
        header: "rounded-none border-0 border-b-[1.2px] p-4",
        overlay:
          "max-w-[384px] overflow-hidden bg-semantic-bg-primary shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03),0_3px_3px_-1.5px_rgba(10,13,18,0.04)]",
      },
    },
    defaultVariants: { variant: "default", presentation: "inline" },
  }
);
const defaultIcons: Record<string, React.ReactNode> = {
  default: <Info className="size-5" />,
  success: <CheckCircle2 className="size-5" />,
  error: <XCircle className="size-5" />,
  destructive: <XCircle className="size-5" />,
  warning: <AlertTriangle className="size-5" />,
  info: <Info className="size-5" />,
};
const iconColors = {
  default: "text-[var(--v2-text-primary,#484848)]",
  success: "text-semantic-success-primary",
  error: "text-semantic-error-primary",
  destructive: "text-semantic-error-primary",
  warning: "text-semantic-warning-primary",
  info: "text-semantic-info-primary",
};

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Custom icon. null hides the icon. */
  icon?: React.ReactNode | null;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
}

// Keep arbitrary content intact while allowing AlertTitle to occupy the overlay header.
function contentParts(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
      ? contentParts(child.props.children)
      : [child]
  );
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      presentation = "inline",
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
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    }, [isControlled, onClose]);
    if (!isOpen) return null;

    const resolvedVariant = variant || "default";
    const resolvedIcon =
      icon === null || !showIcon
        ? null
        : (icon ?? defaultIcons[resolvedVariant]);
    const iconElement = resolvedIcon && (
      <span
        className={cn("shrink-0 [&>svg]:size-5", iconColors[resolvedVariant])}
      >
        {resolvedIcon}
      </span>
    );
    const closeButton = closable && (
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close alert"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-[var(--v2-text-muted,#707070)] transition-colors hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
      >
        <X className="size-5" />
      </button>
    );
    const actions = (action || secondaryAction) && (
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {secondaryAction}
        {action}
      </div>
    );
    const parts = presentation === "overlay" ? contentParts(children) : [];
    const title = parts.filter(
      (child) => React.isValidElement(child) && child.type === AlertTitle
    );
    const body = parts.filter(
      (child) => !React.isValidElement(child) || child.type !== AlertTitle
    );

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        data-presentation={presentation || "inline"}
        className={cn(
          alertVariants({
            variant,
            presentation: presentation || "inline",
            className,
          })
        )}
        {...props}
      >
        {presentation === "overlay" ? (
          <>
            <div className="flex items-center gap-4 border-b-[0.4px] border-solid border-semantic-border-layout p-4">
              {iconElement}
              <div className="min-w-0 flex-1">{title}</div>
              {closeButton}
            </div>
            {(body.length > 0 || actions) && (
              <div className="flex flex-col items-end gap-3 p-4">
                {body.length > 0 && (
                  <div className="w-full min-w-0 text-justify [&>p]:mt-0">
                    {body}
                  </div>
                )}
                {actions}
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              "flex gap-3",
              presentation === "header" ? "items-center" : "items-start"
            )}
          >
            {iconElement}
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">{children}</div>
              {actions}
            </div>
            {closeButton}
          </div>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-medium leading-[normal] text-[var(--v2-text-primary,#484848)]",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "m-0 mt-1 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-[normal] text-[var(--v2-text-secondary,#5E5E5E)]",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription, alertVariants };
