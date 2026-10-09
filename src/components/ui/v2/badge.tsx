import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

// Arc's badge answers a pointer by tinting its border (32%) and fill (10%) with the badge's own colour. currentColor
// is the variant's text colour here, so every variant tints in its own hue. Touch and pen never hover.
const HOVER_TINT =
  "[@media(hover:hover)_and_(pointer:fine)]:hover:[border-color:color-mix(in_oklab,currentColor_32%,var(--semantic-border-layout))] [@media(hover:hover)_and_(pointer:fine)]:hover:[background-color:color-mix(in_oklab,currentColor_10%,var(--semantic-bg-primary))]";

/**
 * Badge variants for status indicators.
 * Pill-shaped badges with different colors for different states. Metrics follow Arc: 1px border, 12px/500 label
 * with -0.01em tracking, 5px gap, and colour, border and fill easing over 240ms.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-[5px] box-border overflow-clip rounded-[25px] border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-medium leading-none tracking-[-0.01em] [transition-property:border-color,background-color,color] [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:120ms] whitespace-nowrap",
  {
    variants: {
      variant: {
        // Status-based variants (existing)
        active: `bg-semantic-success-surface border-[var(--color-success-200)] text-semantic-success-text ${HOVER_TINT}`,
        information: `bg-semantic-info-surface border-[var(--color-black)] text-semantic-info-text ${HOVER_TINT}`,
        warning: `bg-semantic-warning-surface border-[var(--color-warning-200)] text-semantic-warning-text ${HOVER_TINT}`,
        failed: `bg-semantic-error-surface border-[var(--color-error-200)] text-semantic-error-text ${HOVER_TINT}`,
        disabled:
          "border-0 bg-semantic-bg-ui text-[var(--v2-text-muted,#707070)]",
        default: `bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,#5E5E5E)] ${HOVER_TINT}`,
        primary: `bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,#5E5E5E)] ${HOVER_TINT}`,
        // shadcn-style variants (new)
        secondary: `bg-semantic-brand-surface border-semantic-border-accent text-[var(--v2-text-secondary,#5E5E5E)] ${HOVER_TINT}`,
        outline: `border border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)] ${HOVER_TINT}`,
        destructive: `bg-semantic-error-surface border-[var(--color-error-200)] text-semantic-error-text ${HOVER_TINT}`,
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

/** Outgoing copies are hidden from assistive tech while they fade, so only the current text is read. */
function Swap(props: HTMLMotionProps<"span">) {
  const present = useIsPresent();
  return (
    <motion.span
      {...props}
      aria-hidden={present ? props["aria-hidden"] : true}
    />
  );
}

/**
 * Badge component for displaying status indicators.
 *
 * @example
 * ```tsx
 * <Badge variant="active">Active</Badge>
 * <Badge variant="information">Coming Soon</Badge>
 * <Badge variant="warning">Warning</Badge>
 * <Badge variant="failed">Failed</Badge>
 * <Badge variant="disabled">Disabled</Badge>
 * <Badge variant="default">Default</Badge>
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="active" leftIcon={<CheckIcon />}>Active</Badge>
 * <Badge variant="active" dot>Online</Badge>
 * <Badge asChild><a href="/status">View Status</a></Badge>
 * ```
 */
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon displayed on the left side of the badge text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the badge text */
  rightIcon?: React.ReactNode;
  /** Leading 7px status dot in the variant's text colour. Not rendered with `asChild`, which cannot add elements. */
  dot?: boolean;
  /** Render as child element using Radix Slot */
  asChild?: boolean;
}

const Badge = React.forwardRef(
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
    }: BadgeProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const Comp = asChild ? Slot : "div";
    const reducedMotion = useReducedMotion();

    // When using asChild, we can't wrap the child with extra elements
    // The child must receive the className and ref directly
    if (asChild) {
      return (
        <Comp
          className={cn(badgeVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <motion.div
        layout={reducedMotion ? false : "size"}
        layoutDependency={
          typeof children === "string" || typeof children === "number"
            ? String(children)
            : undefined
        }
        // Arc's "morph" spring: the pill follows its content when the label or an icon changes.
        transition={{ type: "spring", visualDuration: 0.42, bounce: 0.16 }}
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {/* currentColor keeps the dot in step with the variant's text colour (and the disabled/outline greys). */}
        {dot && (
          <span
            aria-hidden="true"
            className="size-[7px] shrink-0 rounded-full bg-current"
          />
        )}
        {leftIcon && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 [&_svg]:size-3"
          >
            {leftIcon}
          </span>
        )}
        {typeof children === "string" || typeof children === "number" ? (
          // A new label rises in through a soft blur while the old one lifts out (Arc's text swap). Reduced
          // motion keeps a plain 120ms fade.
          <AnimatePresence mode="popLayout" initial={false}>
            <Swap
              layout={reducedMotion ? false : "position"}
              key={String(children)}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: "0.3em", filter: "blur(4px)" }
              }
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: "0em", filter: "blur(0px)" }
              }
              exit={
                reducedMotion
                  ? { opacity: 0, transition: { duration: 0.12 } }
                  : {
                      opacity: 0,
                      y: "-0.3em",
                      filter: "blur(2px)",
                      transition: {
                        duration: 0.16,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
              }
              transition={{
                duration: reducedMotion ? 0.12 : 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative inline-block"
            >
              {children}
            </Swap>
          </AnimatePresence>
        ) : (
          children
        )}
        {rightIcon && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 [&_svg]:size-3"
          >
            {rightIcon}
          </span>
        )}
      </motion.div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
