import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Callout variants — a colored notice box for drawing attention to a message.
 * Colors come from semantic status tokens so light/dark themes stay consistent.
 */
const calloutVariants = cva(
  "relative flex w-full gap-3 rounded-lg border border-solid p-4 text-semantic-text-primary",
  {
    variants: {
      variant: {
        info: "bg-semantic-info-surface border-semantic-info-border [&_[data-slot=icon]]:text-semantic-info-primary",
        success:
          "bg-semantic-success-surface border-semantic-success-border [&_[data-slot=icon]]:text-semantic-success-primary",
        warning:
          "bg-semantic-warning-surface border-semantic-warning-border [&_[data-slot=icon]]:text-semantic-warning-primary",
        error:
          "bg-semantic-error-surface border-semantic-error-border [&_[data-slot=icon]]:text-semantic-error-primary",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

/** Default icon shown for each variant when no custom icon is provided. */
const defaultIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

export interface CalloutProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  /** Bold heading shown above the message. */
  title?: string;
  /** Custom leading icon. Pass `null` to hide the icon entirely. */
  icon?: React.ReactNode | null;
  /** Show a close button that hides the callout when clicked. */
  dismissible?: boolean;
  /** Called after the user dismisses the callout. */
  onDismiss?: () => void;
}

/**
 * Callout — a lightweight status banner for tips, confirmations, and warnings.
 *
 * @example
 * ```tsx
 * <Callout variant="success" title="Saved">Your changes are live.</Callout>
 * <Callout variant="warning" dismissible>Heads up — this action is permanent.</Callout>
 * ```
 */
const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = "info",
      title,
      icon,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(true);

    if (!open) return null;

    const Icon = defaultIcons[variant ?? "info"];

    const handleDismiss = () => {
      setOpen(false);
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="note"
        className={cn(calloutVariants({ variant, className }))}
        {...props}
      >
        {icon !== null && (
          <span data-slot="icon" className="mt-0.5 shrink-0 [&_svg]:size-5">
            {icon ?? <Icon />}
          </span>
        )}

        <div className="flex-1">
          {title && (
            <p className="m-0 font-semibold leading-tight">{title}</p>
          )}
          {children && (
            <p className={cn("m-0 text-sm", title && "mt-1")}>{children}</p>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-semantic-text-primary"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { Callout, calloutVariants };
