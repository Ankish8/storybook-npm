import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "bar" | "circle" | "semi-circle";
  labelPosition?: "right" | "bottom" | "none";
  indeterminate?: boolean;
}
// Self-contained keyframes (same approach as BouncingLoader): consumers get the slide without a theme change or the
// tailwindcss-animate plugin. The bar is 30% wide, so -100% -> 350% of its own width travels from fully off the left
// edge to fully off the right edge of the track. Applied only under motion-safe below.
const SLIDE_KEYFRAMES =
  "@keyframes myoperator-v2-progress-slide{from{transform:translateX(-100%)}to{transform:translateX(350%)}}";

const ProgressIndicator = React.forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(
  (
    {
      value = 0,
      variant = "bar",
      labelPosition = "right",
      indeterminate = false,
      className,
      "aria-label": ariaLabel = "Progress",
      ...props
    },
    ref
  ) => {
    const percentage = Math.max(
      0,
      Math.min(100, Number.isFinite(value) ? value : 0)
    );
    const reducedMotion = useReducedMotion();
    // Arc: one critically damped spring (0.4s visual duration, no bounce) drives the fill and the counted label.
    const progress = useMotionValue(percentage);
    const [animatedPercentage, setAnimatedPercentage] =
      React.useState(percentage);
    useMotionValueEvent(progress, "change", (next) => {
      setAnimatedPercentage(Math.max(0, Math.min(100, next)));
    });
    React.useEffect(() => {
      if (reducedMotion) {
        progress.jump(percentage);
        return;
      }
      const controls = animate(progress, percentage, {
        type: "spring",
        visualDuration: 0.4,
        bounce: 0,
      });
      return () => controls.stop();
    }, [percentage, reducedMotion, progress]);
    // Completion lands as the fill arrives: the fill turns to the success colour and a check settles in by the count.
    const complete = percentage >= 100;
    // The visible count and fill share a single spring; semantic progress exposes the real value immediately.
    const displayedPercentage = reducedMotion ? percentage : animatedPercentage;
    const circle = variant !== "bar";
    const semi = variant === "semi-circle";
    const radius = 24.43256;
    const circumference = 2 * Math.PI * radius;
    const length = semi ? circumference / 2 : circumference;
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : percentage}
        aria-valuetext={
          indeterminate ? undefined : `${Math.round(percentage)}%`
        }
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)]",
          circle
            ? "relative inline-flex w-[54px] items-center justify-center text-xs leading-[15px]"
            : "flex w-[320px] max-w-full items-center gap-3 text-sm leading-[1.4]",
          !circle && labelPosition === "bottom" && "flex-col items-end gap-2",
          !circle && labelPosition === "right" && !indeterminate && "min-h-5",
          className
        )}
        {...props}
      >
        {circle ? (
          <>
            <svg
              aria-hidden="true"
              viewBox={semi ? "0 0 54 27" : "0 0 54 54"}
              className={cn(
                "block w-[54px] shrink-0",
                semi ? "h-[27px]" : "h-[54px]"
              )}
            >
              {semi ? (
                <>
                  <path
                    d={`M ${27 - radius} 27 A ${radius} ${radius} 0 0 1 ${27 + radius} 27`}
                    fill="none"
                    stroke="var(--semantic-border-layout,#E9EAEB)"
                    strokeWidth="5.13488"
                  />
                  <path
                    d={`M ${27 - radius} 27 A ${radius} ${radius} 0 0 1 ${27 + radius} 27`}
                    fill="none"
                    stroke="var(--semantic-info-primary,#4275D6)"
                    strokeWidth="5.13488"
                    strokeDasharray={length}
                    strokeDashoffset={length * (1 - displayedPercentage / 100)}
                  />
                </>
              ) : (
                <g transform="rotate(-90 27 27)">
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    fill="none"
                    stroke="var(--semantic-border-layout,#E9EAEB)"
                    strokeWidth="5.13488"
                  />
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    fill="none"
                    stroke="var(--semantic-info-primary,#4275D6)"
                    strokeWidth="5.13488"
                    strokeDasharray={length}
                    strokeDashoffset={length * (1 - displayedPercentage / 100)}
                    className={cn(
                      indeterminate &&
                        "origin-center animate-spin motion-reduce:[animation-duration:2s]"
                    )}
                  />
                </g>
              )}
            </svg>
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute text-xs font-medium tabular-nums tracking-[0.06px]",
                  semi && "bottom-0"
                )}
              >
                {Math.round(displayedPercentage)}%
              </span>
            )}
          </>
        ) : (
          <>
            <div
              // Arc's track: 7px tall inside a 1px border. The fill slides in from the left instead of scaling, so
              // its rounded end keeps its shape at every value.
              className={cn(
                "relative h-[7px] w-full min-w-0 overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-ui",
                labelPosition === "bottom" ? "shrink-0" : "flex-1"
              )}
            >
              <div
                data-complete={complete || undefined}
                className={cn(
                  "block h-full w-full rounded-[inherit] bg-semantic-info-primary [transition:background-color_240ms_cubic-bezier(0.22,1,0.36,1)] data-[complete]:bg-semantic-success-primary data-[complete]:[transition-delay:200ms] motion-reduce:transition-none",
                  // Reduced motion keeps the static 30% fill: no movement and no pulse.
                  indeterminate &&
                    "motion-safe:[animation:myoperator-v2-progress-slide_1.5s_cubic-bezier(0.65,0,0.35,1)_infinite]"
                )}
                style={
                  indeterminate
                    ? { width: "30%" }
                    : { transform: `translateX(${displayedPercentage - 100}%)` }
                }
              />
              {indeterminate && <style>{SLIDE_KEYFRAMES}</style>}
            </div>
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center gap-1 text-[var(--v2-text-muted,#707070)]"
              >
                {complete && (
                  <motion.span
                    initial={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.6, filter: "blur(2px)" }
                    }
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={
                      reducedMotion
                        ? { duration: 0.12 }
                        : {
                            type: "spring",
                            visualDuration: 0.26,
                            bounce: 0.12,
                            delay: 0.24,
                          }
                    }
                    className="grid place-items-center text-semantic-success-primary"
                  >
                    <Check className="size-3.5" strokeWidth={1.75} />
                  </motion.span>
                )}
                {/* A hidden "100%" row reserves the widest count, so the check never shifts as the number gains a digit. */}
                <span className="inline-grid justify-items-end tabular-nums before:invisible before:h-0 before:overflow-hidden before:content-['100%']">
                  {Math.round(displayedPercentage)}%
                </span>
              </span>
            )}
          </>
        )}
      </div>
    );
  }
);
ProgressIndicator.displayName = "ProgressIndicator";
export { ProgressIndicator };
