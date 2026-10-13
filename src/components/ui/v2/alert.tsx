import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  usePresence,
} from "motion/react";
import type { HTMLMotionProps, TargetAndTransition } from "motion/react";
import { cn } from "@/lib/utils";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const reducedMotionServerSnapshot = () => true;
function reducedMotionSnapshot() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.(reducedMotionQuery)?.matches)
  );
}
function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia?.(reducedMotionQuery);
  if (!media) return () => {};
  if (media.addEventListener) {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }
  media.addListener(listener);
  return () => media.removeListener(listener);
}
function useLiveReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot
  );
}

// Small copy and icon transitions keep an in-flow notice calm when its status changes.
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

/** popLayout needs a DOM ref, and outgoing copy must not be announced twice. */
const Swap = React.forwardRef<HTMLSpanElement, HTMLMotionProps<"span">>(
  function Swap(props, ref) {
    const present = useIsPresent();
    return (
      <motion.span
        {...props}
        ref={ref}
        aria-hidden={present ? props["aria-hidden"] : true}
      />
    );
  }
);

/** Reduced motion retains a short fade without travel or blur. */
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

/** Animate changed copy heights, while viewport reflow and reduced motion follow the content immediately. */
function ContentFrame({
  children,
  className,
  reducedMotion,
}: {
  children: React.ReactNode;
  className?: string;
  reducedMotion: boolean | null;
}) {
  const frame = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const height = useMotionValue<number | "auto">("auto");

  React.useEffect(() => {
    const node = content.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    let previous = { height: node.offsetHeight, width: node.offsetWidth };
    let stop: (() => void) | undefined;
    const settle = () => {
      height.set("auto");
      if (frame.current) frame.current.style.overflow = "";
    };
    const observer = new ResizeObserver(() => {
      const next = { height: node.offsetHeight, width: node.offsetWidth };
      const from = height.get();
      stop?.();
      if (
        reducedMotion ||
        previous.width !== next.width ||
        previous.height === 0 ||
        previous.height === next.height
      ) {
        settle();
      } else {
        if (frame.current) frame.current.style.overflow = "hidden";
        const controls = animate(
          height,
          [typeof from === "number" ? from : previous.height, next.height],
          { ...SPRING_SMOOTH, onComplete: settle }
        );
        stop = () => controls.stop();
      }
      previous = next;
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop?.();
    };
  }, [height, reducedMotion]);

  return (
    <motion.div ref={frame} className={className} style={{ height }}>
      <div ref={content} className="relative min-w-0">
        {children}
      </div>
    </motion.div>
  );
}

/** Retained exit pixels cannot announce, receive focus, or invoke an outgoing action. */
function AlertPresence({
  children,
  reducedMotion,
}: {
  children: React.ReactNode;
  reducedMotion: boolean | null;
}) {
  const [present, safeToRemove] = usePresence();
  const shell = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const node = shell.current;
    if (!node) return;
    // An empty attribute also works in React 18, where inert is not a boolean DOM prop.
    node.toggleAttribute("inert", !present);
    // There is nothing to collapse in a hidden ancestor or an environment without layout.
    if (!present && node.offsetHeight === 0) safeToRemove?.();
  }, [present, safeToRemove]);

  const blockOutgoing = (event: React.SyntheticEvent) => {
    if (!present) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <motion.div
      ref={shell}
      className={cn("min-w-0", !present && "pointer-events-none")}
      aria-hidden={present ? undefined : true}
      onClickCapture={blockOutgoing}
      onKeyDownCapture={blockOutgoing}
      onAnimationStart={() => {
        if (shell.current && !reducedMotion)
          shell.current.style.overflow = "hidden";
      }}
      onAnimationComplete={() => {
        if (!present) {
          safeToRemove?.();
          return;
        }
        if (shell.current) shell.current.style.overflow = "";
      }}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
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
      {children}
    </motion.div>
  );
}

const alertVariants = cva(
  "relative w-full rounded-lg border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
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
  default: "text-[var(--v2-text-primary,var(--semantic-text-primary))]",
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
  /** Keep inert exit pixels briefly. Defaults to v1's immediate dismissal. */
  animateExit?: boolean;
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
      animateExit = false,
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
    const reducedMotion = useLiveReducedMotion();

    const resolvedVariant = variant || "default";
    const resolvedIcon =
      icon === null || !showIcon ? null : icon || defaultIcons[resolvedVariant];
    // Keep the icon aligned with the first line as copy wraps.
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
        className="-my-[5px] -mr-1.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--v2-text-muted,var(--semantic-text-muted))] [transition:transform_580ms_var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1)),background-color_160ms_cubic-bezier(0.22,1,0.36,1),color_160ms_cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] active:[transition-duration:120ms] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-ui [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--v2-text-primary,var(--semantic-text-primary))] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
      >
        <X className="size-4" strokeWidth={1.75} />
      </button>
    );
    const actions = (action || secondaryAction) && (
      <div className="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2">
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

    const notice = isOpen && (
      <AlertPresence key="alert" reducedMotion={reducedMotion}>
        <div
          ref={ref}
          role="alert"
          aria-live="polite"
          data-presentation={presentation || "inline"}
          className={cn(
            "transition-colors duration-200 motion-reduce:transition-none",
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
                <ContentFrame
                  className="min-w-0 flex-1 [overflow-wrap:anywhere]"
                  reducedMotion={reducedMotion}
                >
                  {title}
                </ContentFrame>
                {closeButton}
              </div>
              {(body.length > 0 || actions) && (
                <div className="flex flex-col items-end gap-3 p-4">
                  {body.length > 0 && (
                    <ContentFrame
                      className="w-full min-w-0 text-left [overflow-wrap:anywhere] [&>div>p]:mt-0"
                      reducedMotion={reducedMotion}
                    >
                      {body}
                    </ContentFrame>
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
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <ContentFrame
                  className="min-w-0 flex-1 basis-[12rem] [overflow-wrap:anywhere]"
                  reducedMotion={reducedMotion}
                >
                  {children}
                </ContentFrame>
                {actions}
              </div>
              {closeButton}
            </div>
          )}
        </div>
      </AlertPresence>
    );
    return animateExit ? (
      <AnimatePresence initial={false}>{notice}</AnimatePresence>
    ) : (
      notice
    );
  }
);
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  const reducedMotion = useLiveReducedMotion();
  return (
    <h5
      ref={ref}
      className={cn(
        "relative m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] text-[var(--v2-text-primary,var(--semantic-text-primary))]",
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
  const reducedMotion = useLiveReducedMotion();
  return (
    <p
      ref={ref}
      className={cn(
        "relative m-0 mt-1 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-[1.4] text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
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
