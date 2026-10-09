import * as React from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import type { HTMLMotionProps, TargetAndTransition } from "motion/react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icon element rendered inside the icon circle */
  icon?: React.ReactNode;
  /** Bold heading text */
  title: React.ReactNode;
  /** Optional subtitle / description text */
  description?: React.ReactNode;
  /** Optional action buttons rendered below the description */
  actions?: React.ReactNode;
  /**
   * "default" is the full empty view. "sm" is Arc's empty state: a 48px icon tile (its icon is sized to 24px), 16px
   * title, 14px description capped at 18rem and clamp(32px, 8vw, 48px) of vertical padding.
   */
  size?: "default" | "sm";
  /** Additional CSS classes for the root container */
  className?: string;
}

const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
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

/** Outgoing copies are hidden from assistive tech while they fade. */
function Swap(props: HTMLMotionProps<"span">) {
  const present = useIsPresent();
  return (
    <motion.span
      {...props}
      aria-hidden={present ? props["aria-hidden"] : true}
    />
  );
}

/** A new icon component crossfades in; re-rendering the same icon stays still. */
function iconKey(icon: React.ReactNode) {
  if (!React.isValidElement(icon)) return "icon";
  const type = icon.type as string | { displayName?: string; name?: string };
  return typeof type === "string"
    ? type
    : (type.displayName ?? type.name ?? "icon");
}

function EmptyState({
  icon,
  title,
  description,
  actions,
  size = "default",
  className,
}: EmptyStateProps) {
  // The default classes are kept as whole literals so the default output is byte-for-byte unchanged.
  const small = size === "sm";
  const reducedMotion = useReducedMotion();
  const textKey = (node: React.ReactNode) =>
    typeof node === "string" || typeof node === "number"
      ? String(node)
      : undefined;
  // Arc's text swap: the new copy rises in through a soft blur while the old one lifts out.
  const swap: HTMLMotionProps<"span"> = {
    initial: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: "0.3em", filter: "blur(4px)" },
    animate: SHOWN,
    exit: reducedMotion
      ? { opacity: 0, transition: { duration: 0.12 } }
      : {
          opacity: 0,
          y: "-0.3em",
          filter: "blur(2px)",
          transition: { duration: 0.16, ease: [...EASE_STANDARD] },
        },
    transition: reducedMotion
      ? { duration: 0.12 }
      : { duration: 0.24, ease: [...EASE_ENTER] },
  };
  return (
    <div
      data-slot="empty-state"
      className={cn(
        small
          ? "flex flex-col items-center justify-center gap-5 px-5 py-[clamp(2rem,8vw,3rem)] font-[family-name:var(--font-v2,Inter,sans-serif)]"
          : "flex flex-col items-center justify-center gap-5 p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]",
        className
      )}
    >
      {icon && (
        // Arc's icon tile settles in once (480ms, scale .92 -> 1); later icon changes crossfade in place.
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.48, ease: [...EASE_ENTER] }}
          className={
            small
              ? "bg-semantic-bg-ui border border-solid border-semantic-border-layout rounded-[60px] size-12 relative grid place-items-center text-[var(--v2-text-secondary,#5E5E5E)] [&>span>svg]:size-6"
              : "bg-semantic-bg-ui border border-solid border-semantic-border-layout rounded-[60px] size-[90px] relative grid place-items-center text-[var(--v2-text-secondary,#5E5E5E)]"
          }
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <Swap
              key={iconKey(icon)}
              className="relative grid place-items-center"
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
              transition={
                reducedMotion
                  ? { duration: 0.12 }
                  : { type: "spring", visualDuration: 0.26, bounce: 0.12 }
              }
            >
              {icon}
            </Swap>
          </AnimatePresence>
        </motion.div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col items-center gap-2 text-center",
          small ? "max-w-[400px]" : "max-w-[400px]"
        )}
      >
        <p
          className={
            small
              ? "relative m-0 text-base leading-[1.1] tracking-[-0.03em] font-medium text-[var(--v2-text-primary,#484848)]"
              : "relative m-0 text-2xl leading-8 font-medium text-[var(--v2-text-primary,#484848)]"
          }
        >
          {textKey(title) !== undefined ? (
            <AnimatePresence mode="popLayout" initial={false}>
              <Swap
                key={textKey(title)}
                className="block [text-wrap:balance]"
                {...swap}
              >
                {title}
              </Swap>
            </AnimatePresence>
          ) : (
            title
          )}
        </p>
        {description && (
          <p
            className={
              small
                ? "relative m-0 max-w-[18rem] text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]"
                : "relative m-0 text-base leading-6 text-[var(--v2-text-secondary,#5E5E5E)]"
            }
          >
            {textKey(description) !== undefined ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <Swap
                  key={textKey(description)}
                  className="block [text-wrap:balance]"
                  {...swap}
                >
                  {description}
                </Swap>
              </AnimatePresence>
            ) : (
              description
            )}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
EmptyState.displayName = "EmptyState";

export { EmptyState };
