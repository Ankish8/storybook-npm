import * as React from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
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

export type EmptyStateIllustration =
  | "no-results"
  | "offline"
  | "caught-up"
  | "not-found";

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "children"
> {
  /** Icon element rendered inside the icon circle */
  icon?: React.ReactNode;
  /** Optional decorative artwork. A supplied icon takes precedence. */
  illustration?: EmptyStateIllustration;
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

/** A new icon component crossfades in; re-rendering the same icon stays still. */
function iconKey(icon: React.ReactNode) {
  if (!React.isValidElement(icon)) return "icon";
  const type = icon.type as string | { displayName?: string; name?: string };
  return typeof type === "string"
    ? type
    : (type.displayName ?? type.name ?? "icon");
}

/** Original vector scenes use theme colors and settle once; nothing loops at rest. */
function Illustration({
  kind,
  small,
  reduce,
}: {
  kind: EmptyStateIllustration;
  small: boolean;
  reduce: boolean;
}) {
  const trace = {
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: {
      duration: reduce ? 0 : 0.38,
      delay: reduce ? 0 : 0.12,
      ease: [...EASE_ENTER],
    },
  } as const;

  return (
    <motion.svg
      data-slot="empty-state-illustration"
      data-illustration={kind}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 190"
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -3 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: [...EASE_ENTER] }}
      className={cn(
        "block h-auto max-w-full shrink-0 overflow-visible",
        small ? "w-56" : "w-72"
      )}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse
        cx="160"
        cy="168"
        rx="107"
        ry="10"
        className="fill-semantic-bg-ui"
      />
      <path
        d="M52 81h8m-4-4v8M260 51h6m-3-3v6"
        className="stroke-semantic-border-layout"
      />

      {kind === "no-results" && (
        <>
          <rect
            x="79"
            y="39"
            width="103"
            height="111"
            rx="12"
            transform="rotate(-9 79 39)"
            className="fill-semantic-bg-ui stroke-semantic-border-layout"
          />
          <rect
            x="109"
            y="28"
            width="103"
            height="124"
            rx="12"
            transform="rotate(7 109 28)"
            className="fill-semantic-bg-primary stroke-semantic-border-layout"
          />
          <rect
            x="88"
            y="47"
            width="116"
            height="112"
            rx="13"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path
            d="M106 69h56m-56 14h72m-72 14h42"
            className="stroke-semantic-border-layout"
          />
          <rect
            x="104"
            y="117"
            width="51"
            height="20"
            rx="6"
            className="fill-semantic-primary-surface"
          />
          <path d="M114 127h30" className="stroke-semantic-text-muted" />
          <circle
            cx="204"
            cy="114"
            r="28"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <circle
            cx="204"
            cy="114"
            r="20"
            className="fill-semantic-bg-ui stroke-semantic-border-layout"
          />
          <motion.path
            d="m224 135 20 22"
            strokeWidth="6"
            className="stroke-semantic-primary"
            {...trace}
          />
          <path d="M225 38h12m-6-6v12" className="stroke-semantic-text-muted" />
        </>
      )}

      {kind === "offline" && (
        <>
          <rect
            x="84"
            y="60"
            width="102"
            height="99"
            rx="13"
            transform="rotate(-7 84 60)"
            className="fill-semantic-bg-ui stroke-semantic-border-layout"
          />
          <rect
            x="99"
            y="62"
            width="107"
            height="98"
            rx="13"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path
            d="M116 87h55m-55 13h69m-69 13h39"
            className="stroke-semantic-border-layout"
          />
          <rect
            x="115"
            y="131"
            width="43"
            height="13"
            rx="5"
            className="fill-semantic-primary-surface"
          />
          <path
            d="M183 77h51a18 18 0 0 0 1-36 24 24 0 0 0-46-3 20 20 0 0 0-6 39Z"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path
            d="M212 87v14m0 35v13h-19"
            strokeDasharray="3 6"
            className="stroke-semantic-text-muted"
          />
          <circle
            cx="212"
            cy="118"
            r="12"
            className="fill-semantic-primary-surface stroke-semantic-border-layout"
          />
          <motion.path
            d="m208 122 8-8"
            className="stroke-semantic-text-secondary"
            {...trace}
          />
          <path
            d="M69 43h13m-7-6v12M248 139h7"
            className="stroke-semantic-border-layout"
          />
        </>
      )}

      {kind === "caught-up" && (
        <>
          <rect
            x="107"
            y="38"
            width="92"
            height="78"
            rx="10"
            transform="rotate(-7 107 38)"
            className="fill-semantic-bg-ui stroke-semantic-border-layout"
          />
          <rect
            x="113"
            y="42"
            width="94"
            height="78"
            rx="10"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path
            d="m117 49 43 29 43-29M130 95h46"
            className="stroke-semantic-border-layout"
          />
          <path
            d="m101 102-17 40v15a7 7 0 0 0 7 7h138a7 7 0 0 0 7-7v-15l-17-40Z"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path
            d="M85 142h44l9 11h43l9-11h45"
            className="fill-semantic-bg-ui stroke-semantic-text-secondary"
          />
          <circle
            cx="219"
            cy="71"
            r="24"
            className="fill-semantic-success-surface stroke-semantic-success-primary"
          />
          <motion.path
            d="m209 71 7 7 13-15"
            strokeWidth="2"
            className="stroke-semantic-success-primary"
            {...trace}
          />
          <path
            d="M75 88h9m-5-5v10M249 42l5-5m-1 17h7"
            className="stroke-semantic-border-layout"
          />
        </>
      )}

      {kind === "not-found" && (
        <>
          <path
            d="m84 62 50-15 51 17 50-15v99l-50 16-51-17-50 15Z"
            className="fill-semantic-bg-primary stroke-semantic-text-secondary"
          />
          <path d="m134 48 51 16v99l-51-16Z" className="fill-semantic-bg-ui" />
          <path
            d="M134 48v98m51-82v99"
            className="stroke-semantic-border-layout"
          />
          <path
            d="M104 132c20-27 34 14 55-10s40-9 55-28"
            strokeDasharray="3 6"
            className="stroke-semantic-text-muted"
          />
          <circle
            cx="104"
            cy="132"
            r="3"
            className="fill-semantic-text-secondary"
          />
          <path
            d="M202 35a24 24 0 0 0-24 24c0 18 24 37 24 37s24-19 24-37a24 24 0 0 0-24-24Z"
            className="fill-semantic-primary-surface stroke-semantic-text-secondary"
          />
          <motion.path
            d="M197 53a5 5 0 0 1 10 0c0 5-5 4-5 9m0 7h.01"
            className="stroke-semantic-text-secondary"
            {...trace}
          />
          <path
            d="M77 35h9m-5-4v8M255 120h7"
            className="stroke-semantic-border-layout"
          />
        </>
      )}
    </motion.svg>
  );
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      icon,
      illustration,
      title,
      description,
      actions,
      size = "default",
      className,
      ...props
    },
    ref
  ) {
    // Keep the established v2 sizes and custom slots when artwork is not requested.
    const small = size === "sm";
    const reducedMotion = useLiveReducedMotion() ?? false;
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
        {...props}
        ref={ref}
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
                        transition: {
                          duration: 0.16,
                          ease: [...EASE_STANDARD],
                        },
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
        {!icon &&
          illustration &&
          (reducedMotion ? (
            <Illustration kind={illustration} small={small} reduce />
          ) : (
            <AnimatePresence mode="wait">
              <Illustration
                key={illustration}
                kind={illustration}
                small={small}
                reduce={false}
              />
            </AnimatePresence>
          ))}
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
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
