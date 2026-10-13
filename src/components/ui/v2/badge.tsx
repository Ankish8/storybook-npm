"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

/** Quiet status pills. Only a change of label, icon, or dot triggers content motion. */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-[5px] box-border overflow-clip rounded-[25px] border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-medium leading-none tracking-[-0.01em] transition-[border-color,background-color,color] duration-200 ease-out motion-reduce:transition-none whitespace-nowrap",
  {
    variants: {
      variant: {
        active:
          "bg-semantic-success-surface border-semantic-success-border text-semantic-success-text",
        information:
          "bg-semantic-info-surface border-semantic-info-border text-semantic-info-text",
        warning:
          "bg-semantic-warning-surface border-semantic-warning-border text-semantic-warning-text",
        failed:
          "bg-semantic-error-surface border-semantic-error-border text-semantic-error-text",
        disabled:
          "border-0 bg-semantic-bg-ui text-[var(--v2-text-muted,var(--semantic-text-muted))]",
        default:
          "bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
        primary:
          "bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
        secondary:
          "bg-semantic-brand-surface border-semantic-border-accent text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
        outline:
          "border-semantic-border-layout bg-transparent text-[var(--v2-text-secondary,var(--semantic-text-secondary))]",
        destructive:
          "bg-semantic-error-surface border-semantic-error-border text-semantic-error-text",
      },
      size: {
        default: "h-[26px] px-[10px]",
        sm: "h-[22px] gap-1 px-2 text-[11px] leading-none",
        lg: "h-[30px] px-4 text-sm leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function reducedMotionSnapshot() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  );
}

function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  media?.addEventListener("change", listener);
  return () => media?.removeEventListener("change", listener);
}

const reducedMotionServerSnapshot = () => true;

/** popLayout needs the DOM ref in React 18; outgoing copies never remain accessible. */
const Swap = React.forwardRef<HTMLSpanElement, HTMLMotionProps<"span">>(
  (props, ref) => {
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
Swap.displayName = "BadgeSwap";

/** Fresh instances of the same icon stay still. A key also supports custom glyph states. */
function iconKey(icon: React.ReactNode): string {
  if (!React.isValidElement(icon)) return String(icon ?? "");
  const type = icon.type as string | { displayName?: string; name?: string };
  const name =
    typeof type === "string" ? type : (type.displayName ?? type.name ?? "icon");
  return name + ":" + (icon.key ?? "");
}

interface ContentState {
  label: string | null;
  left: string;
  right: string;
  dot: boolean;
  width: number;
}

function BadgeContent({
  children,
  leftIcon,
  rightIcon,
  dot,
}: Pick<BadgeProps, "children" | "leftIcon" | "rightIcon" | "dot">) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot
  );
  const shellRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef<ContentState | null>(null);
  const animation = React.useRef<ReturnType<typeof animate> | null>(null);
  const width = useMotionValue<number | "auto">("auto");
  const label =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : null;
  const left = iconKey(leftIcon);
  const right = iconKey(rightIcon);
  const settle = React.useCallback(() => {
    animation.current?.stop();
    animation.current = null;
    width.jump("auto");
    // Release the pixel width synchronously, including between Motion's scheduled DOM renders.
    if (shellRef.current) shellRef.current.style.width = "auto";
  }, [width]);

  // Width is intrinsic at rest. Measure after a committed content change, never during render.
  // The content stays unscaled; only its shell width follows the changed label or glyph.
  useBrowserLayoutEffect(() => {
    const next = contentRef.current?.getBoundingClientRect().width ?? 0;
    const last = previous.current;
    const changed =
      last !== null &&
      (last.label !== label ||
        last.left !== left ||
        last.right !== right ||
        last.dot !== Boolean(dot));
    previous.current = { label, left, right, dot: Boolean(dot), width: next };

    if (reducedMotion || !last || next <= 0 || last.width <= 0) {
      settle();
      return;
    }
    // A render with unchanged content must not interrupt an in-flight state transition.
    if (!changed && next === last.width) return;

    const current = width.get();
    animation.current?.stop();
    animation.current = null;
    if (!changed || next === last.width) {
      settle();
      return;
    }
    const from = typeof current === "number" ? current : last.width;
    width.jump(from);
    if (shellRef.current) shellRef.current.style.width = String(from) + "px";
    animation.current = animate(width, [from, next], {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0,
      onComplete: settle,
    });
  });

  // Fonts, hidden parents, and other passive reflows snap to their intrinsic width.
  React.useEffect(() => {
    const node = contentRef.current;
    const observer =
      node && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            const next = node.getBoundingClientRect().width;
            if (previous.current && next !== previous.current.width) {
              previous.current.width = next;
              settle();
            }
          })
        : undefined;
    if (node) observer?.observe(node);
    return () => {
      observer?.disconnect();
      settle();
    };
  }, [settle]);

  const icon = (node: React.ReactNode, key: string) =>
    node ? (
      reducedMotion ? (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 [&_svg]:size-3"
        >
          {node}
        </span>
      ) : (
        <Swap
          key={key}
          aria-hidden="true"
          className="inline-flex shrink-0 [&_svg]:size-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          {node}
        </Swap>
      )
    ) : null;

  return (
    <motion.span
      ref={shellRef}
      className="inline-flex min-w-0 shrink-0 [gap:inherit]"
      style={{ width }}
    >
      <span
        ref={contentRef}
        className="relative inline-flex w-max items-center [gap:inherit]"
      >
        {dot && (
          <span
            aria-hidden="true"
            className="size-[7px] shrink-0 rounded-full bg-current"
          />
        )}
        {reducedMotion ? (
          icon(leftIcon, left)
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {icon(leftIcon, left)}
          </AnimatePresence>
        )}
        {label === null || reducedMotion ? (
          children
        ) : (
          <span className="relative inline-flex">
            <AnimatePresence mode="popLayout" initial={false}>
              <Swap
                key={label}
                className="inline-block"
                initial={{ opacity: 0, y: "0.2em", filter: "blur(2px)" }}
                animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                exit={{ opacity: 0, y: "-0.2em", filter: "blur(2px)" }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </Swap>
            </AnimatePresence>
          </span>
        )}
        {reducedMotion ? (
          icon(rightIcon, right)
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {icon(rightIcon, right)}
          </AnimatePresence>
        )}
      </span>
    </motion.span>
  );
}

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Decorative icon before the label. Use a different component or key to transition it. */
  leftIcon?: React.ReactNode;
  /** Decorative icon after the label. Use a different component or key to transition it. */
  rightIcon?: React.ReactNode;
  /** Decorative 7px dot. Ignored with asChild, which cannot insert extra elements. */
  dot?: boolean;
  /** Apply badge styles, native attributes, events, and refs directly to one child. */
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      dot = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(badgeVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    // A plain root preserves the native drag/animation events expected by v1 consumers.
    return (
      <div className={classes} ref={ref} {...props}>
        <BadgeContent leftIcon={leftIcon} rightIcon={rightIcon} dot={dot}>
          {children}
        </BadgeContent>
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
