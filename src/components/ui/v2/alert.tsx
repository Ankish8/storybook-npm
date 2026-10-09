import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import type { HTMLMotionProps, TargetAndTransition } from "motion/react";
import { cn } from "@/lib/utils";

// Arc's motion tokens: the text and icon swaps, the presence spring and the dismiss easing.
const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
const SPRING_SMOOTH = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0,
} as const;
const SPRING_SNAPPY = {
  type: "spring",
  visualDuration: 0.26,
  bounce: 0.12,
} as const;
const ICON_IN: TargetAndTransition = {
  opacity: 0,
  scale: 0.6,
  filter: "blur(2px)",
};
const SHOWN: TargetAndTransition = {
  opacity: 1,
  y: "0em",
  scale: 1,
  filter: "blur(0px)",
};

/** Outgoing copies are hidden from assistive tech while they fade, so the live region reads only the current text. */
function Swap(props: HTMLMotionProps<"span">) {
  const present = useIsPresent();
  return (
    <motion.span
      {...props}
      aria-hidden={present ? props["aria-hidden"] : true}
    />
  );
}

/** Arc's text swap: the new copy rises in through a soft blur while the old one lifts out. Reduced motion is a 120ms fade. */
function textSwap(reduced: boolean | null): HTMLMotionProps<"span"> {
  return {
    initial: reduced
      ? { opacity: 0 }
      : { opacity: 0, y: "0.3em", filter: "blur(4px)" },
    animate: SHOWN,
    exit: reduced
      ? { opacity: 0, transition: { duration: 0.12 } }
      : {
          opacity: 0,
          y: "-0.3em",
          filter: "blur(2px)",
          transition: { duration: 0.16, ease: [...EASE_STANDARD] },
        },
    transition: reduced
      ? { duration: 0.12 }
      : { duration: 0.24, ease: [...EASE_ENTER] },
  };
}

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
        inline: "p-4 shadow-[0_1px_2px_rgba(0,0,0,0.035)]",
        header: "rounded-none border-0 border-b-[1.2px] p-4",
        overlay:
          "max-w-[384px] overflow-hidden bg-semantic-bg-primary shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03),0_3px_3px_-1.5px_rgba(10,13,18,0.04)]",
      },
    },
    defaultVariants: { variant: "default", presentation: "inline" },
  }
);
const defaultIcons: Record<string, React.ReactNode> = {
  default: <Info className="size-[18px]" />,
  success: <CheckCircle2 className="size-[18px]" />,
  error: <XCircle className="size-[18px]" />,
  destructive: <XCircle className="size-[18px]" />,
  warning: <AlertTriangle className="size-[18px]" />,
  info: <Info className="size-[18px]" />,
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
    const reducedMotion = useReducedMotion();
    const shell = React.useRef<HTMLDivElement>(null);
    const setClip = (value: string) => {
      if (shell.current) shell.current.style.overflow = value;
    };
    // Without layout (jsdom, a display:none ancestor) there is no height to collapse and the spring from "auto" never
    // settles, so a closing alert would hang in the DOM. Remounting the presence boundary drops it at once, as v1 did.
    const [presenceKey, setPresenceKey] = React.useState(0);
    React.useLayoutEffect(() => {
      if (!isOpen && shell.current && shell.current.offsetHeight === 0) {
        setPresenceKey((key) => key + 1);
      }
    }, [isOpen]);

    const resolvedVariant = variant || "default";
    const resolvedIcon =
      icon === null || !showIcon
        ? null
        : (icon ?? defaultIcons[resolvedVariant]);
    // An 18px box nudged 1px down so it sits on the title's first line. A new tone morphs the glyph in place.
    const iconElement = resolvedIcon && (
      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-[18px] shrink-0 place-items-center",
          presentation !== "header" && presentation !== "overlay" && "mt-px",
          iconColors[resolvedVariant]
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <Swap
            key={resolvedVariant}
            initial={reducedMotion ? { opacity: 0 } : ICON_IN}
            animate={SHOWN}
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    ...ICON_IN,
                    transition: { duration: 0.16, ease: [...EASE_STANDARD] },
                  }
            }
            transition={reducedMotion ? { duration: 0.12 } : SPRING_SNAPPY}
            className="relative grid place-items-center [&>svg]:size-[18px]"
          >
            {resolvedIcon}
          </Swap>
        </AnimatePresence>
      </span>
    );
    const closeButton = closable && (
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close alert"
        // Arc's dismiss: a 28px target around a 16px icon, pulled in by 5px / 6px so it does not add height or push the
        // content; hover fills the surface, press scales to .96 (instantly) and springs back.
        className="-my-[5px] -mr-1.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--v2-text-muted,#707070)] [transition:transform_580ms_var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1)),background-color_160ms_cubic-bezier(0.22,1,0.36,1),color_160ms_cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] active:[transition-duration:120ms] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-ui [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
      >
        <X className="size-4" strokeWidth={1.75} />
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
      <AnimatePresence key={presenceKey} initial={false}>
        {isOpen && (
          // Arc splits presence from the box: this wrapper animates height and opacity, so the alert's own padding and
          // border never have to collapse (their spring tails would leave an invisible 34px strip behind). It clips
          // only while moving so the box's shadow and focus ring stay visible at rest.
          <motion.div
            key="alert"
            ref={shell}
            className="min-w-0"
            onAnimationStart={() => setClip("hidden")}
            onAnimationComplete={() => setClip("")}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            // Height follows a critically damped spring (never overshoots); opacity eases in over 240ms, out over 160ms.
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    height: 0,
                    transition: {
                      ...SPRING_SMOOTH,
                      opacity: { duration: 0.16, ease: [...EASE_STANDARD] },
                    },
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : {
                    ...SPRING_SMOOTH,
                    opacity: { duration: 0.24, ease: [...EASE_ENTER] },
                  }
            }
          >
            <div
              ref={ref}
              role="alert"
              aria-live="polite"
              data-presentation={presentation || "inline"}
              className={cn(
                "transition-colors duration-200",
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
                        <div className="w-full min-w-0 text-left [&>p]:mt-0">
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  const reducedMotion = useReducedMotion();
  return (
    <h5
      ref={ref}
      className={cn(
        "relative m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] text-[var(--v2-text-primary,#484848)]",
        className
      )}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <Swap
            key={String(children)}
            className="block"
            {...textSwap(reducedMotion)}
          >
            {children}
          </Swap>
        </AnimatePresence>
      ) : (
        children
      )}
    </h5>
  );
});
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const reducedMotion = useReducedMotion();
  return (
    <p
      ref={ref}
      className={cn(
        "relative m-0 mt-1 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]",
        className
      )}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <Swap
            key={String(children)}
            className="block"
            {...textSwap(reducedMotion)}
          >
            {children}
          </Swap>
        </AnimatePresence>
      ) : (
        children
      )}
    </p>
  );
});
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription, alertVariants };
