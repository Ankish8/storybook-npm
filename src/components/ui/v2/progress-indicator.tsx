import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Measured completion from 0 to 100. Non-finite values fall back to 0. */
  value?: number;
  variant?: "bar" | "circle" | "semi-circle";
  labelPosition?: "right" | "bottom" | "none";
  /** Use when the amount of completed work is unknown. */
  indeterminate?: boolean;
}

// Self-contained loading keyframes keep installed copies independent of a theme plugin.
const SLIDE_KEYFRAMES =
  "@keyframes myoperator-v2-progress-slide{from{transform:translateX(-100%)}to{transform:translateX(350%)}}";
const SWEEP_KEYFRAMES =
  "@keyframes myoperator-v2-progress-sweep{from{stroke-dashoffset:30}to{stroke-dashoffset:-100}}";
const ROTATE_KEYFRAMES =
  "@keyframes myoperator-v2-progress-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";
const normalize = (value: number) =>
  Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
// Rounding must not display completion before either the measured value or fill reaches 100.
const visibleValue = (value: number) =>
  value >= 100 ? 100 : Math.min(99, Math.round(value));

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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-valuetext": ariaValueText,
      ...props
    },
    ref
  ) => {
    const percentage = normalize(value);
    const [reducedMotion, setReducedMotion] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [pageVisible, setPageVisible] = React.useState(true);
    const [inView, setInView] = React.useState(true);
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLDivElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              rootRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      const updateVisibility = () =>
        setPageVisible(document.visibilityState !== "hidden");
      updateVisibility();
      const motionQuery = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      );
      const updateMotion = () =>
        setReducedMotion(Boolean(motionQuery?.matches));
      updateMotion();
      if (motionQuery?.addEventListener)
        motionQuery.addEventListener("change", updateMotion);
      else motionQuery?.addListener(updateMotion);
      document.addEventListener("visibilitychange", updateVisibility);
      const node = rootRef.current;
      const observer =
        node && typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(([entry]) => {
              if (entry) setInView(entry.isIntersecting);
            })
          : null;
      if (node) observer?.observe(node);
      return () => {
        document.removeEventListener("visibilitychange", updateVisibility);
        observer?.disconnect();
        if (motionQuery?.removeEventListener)
          motionQuery.removeEventListener("change", updateMotion);
        else motionQuery?.removeListener(updateMotion);
      };
    }, []);

    const canAnimate = !reducedMotion && pageVisible && inView;
    // One finite interpolation drives the visible fill and count. ARIA exposes the measured value immediately.
    const progress = useMotionValue(percentage);
    const [animatedPercentage, setAnimatedPercentage] =
      React.useState(percentage);
    useMotionValueEvent(progress, "change", (next) => {
      setAnimatedPercentage(normalize(next));
    });
    React.useEffect(() => {
      if (!canAnimate || indeterminate || progress.get() === percentage) {
        progress.jump(percentage);
        return;
      }
      const controls = animate(progress, percentage, {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => progress.jump(percentage),
      });
      return () => controls.stop();
    }, [percentage, indeterminate, canAnimate, progress]);

    const displayedPercentage = canAnimate ? animatedPercentage : percentage;
    const complete = !indeterminate && percentage === 100;
    const visuallyComplete = complete && displayedPercentage >= 100;
    const circle = variant !== "bar";
    const semi = variant === "semi-circle";
    const radius = 24.43256;
    const fillStroke = visuallyComplete
      ? "var(--v2-semantic-success-primary,var(--semantic-success-primary))"
      : "var(--v2-semantic-info-primary,var(--semantic-info-primary))";
    const animationPlayState = canAnimate ? "running" : "paused";

    return (
      <div
        ref={setRootRef}
        role="progressbar"
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Progress")}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : percentage}
        aria-valuetext={
          ariaValueText ?? (indeterminate ? undefined : `${percentage}%`)
        }
        data-state={
          indeterminate
            ? "indeterminate"
            : complete
              ? "complete"
              : percentage === 0
                ? "idle"
                : "loading"
        }
        className={cn(
          "font-[family-name:var(--font-v2)] text-v2-semantic-text-secondary",
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
                    stroke="var(--v2-semantic-border-layout,var(--semantic-border-layout))"
                    strokeWidth="5.13488"
                  />
                  <path
                    d={`M ${27 - radius} 27 A ${radius} ${radius} 0 0 1 ${27 + radius} 27`}
                    pathLength="100"
                    fill="none"
                    stroke={fillStroke}
                    strokeWidth="5.13488"
                    strokeDasharray={indeterminate ? "30 100" : 100}
                    strokeDashoffset={
                      indeterminate ? -35 : 100 - displayedPercentage
                    }
                    className={cn(
                      indeterminate &&
                        "motion-safe:[animation-name:myoperator-v2-progress-sweep] motion-safe:[animation-duration:1.5s] motion-safe:[animation-timing-function:cubic-bezier(0.65,0,0.35,1)] motion-safe:[animation-iteration-count:infinite]"
                    )}
                    style={indeterminate ? { animationPlayState } : undefined}
                  />
                </>
              ) : (
                <g transform="rotate(-90 27 27)">
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    fill="none"
                    stroke="var(--v2-semantic-border-layout,var(--semantic-border-layout))"
                    strokeWidth="5.13488"
                  />
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    pathLength="100"
                    fill="none"
                    stroke={fillStroke}
                    strokeWidth="5.13488"
                    strokeDasharray={100}
                    strokeDashoffset={
                      indeterminate ? 75 : 100 - displayedPercentage
                    }
                    className={cn(
                      indeterminate &&
                        "origin-center motion-safe:[animation-name:myoperator-v2-progress-rotate] motion-safe:[animation-duration:1.5s] motion-safe:[animation-timing-function:linear] motion-safe:[animation-iteration-count:infinite]"
                    )}
                    style={
                      indeterminate
                        ? { animationDuration: "1.5s", animationPlayState }
                        : undefined
                    }
                  />
                </g>
              )}
            </svg>
            {indeterminate && (
              <style>{semi ? SWEEP_KEYFRAMES : ROTATE_KEYFRAMES}</style>
            )}
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute text-xs font-medium tabular-nums tracking-[0.06px]",
                  semi && "bottom-0"
                )}
              >
                {visibleValue(displayedPercentage)}%
              </span>
            )}
          </>
        ) : (
          <>
            <div
              className={cn(
                "relative h-[7px] w-full min-w-0 overflow-hidden rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-ui",
                labelPosition === "bottom" ? "shrink-0" : "flex-1"
              )}
            >
              <div
                data-complete={visuallyComplete || undefined}
                className={cn(
                  "block h-full rounded-[inherit] bg-v2-semantic-info-primary [transition-property:background-color] [transition-duration:180ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] data-[complete]:bg-v2-semantic-success-primary motion-reduce:transition-none",
                  indeterminate ? "w-[30%]" : "w-full",
                  indeterminate &&
                    "motion-safe:[animation-name:myoperator-v2-progress-slide] motion-safe:[animation-duration:1.5s] motion-safe:[animation-timing-function:cubic-bezier(0.65,0,0.35,1)] motion-safe:[animation-iteration-count:infinite]"
                )}
                style={
                  indeterminate
                    ? {
                        width: "30%",
                        animationPlayState,
                        transition: canAnimate ? undefined : "none",
                      }
                    : {
                        transform: `translateX(${displayedPercentage - 100}%)`,
                        transition: canAnimate ? undefined : "none",
                      }
                }
              />
              {indeterminate && <style>{SLIDE_KEYFRAMES}</style>}
            </div>
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center gap-1 text-v2-semantic-text-muted"
              >
                <span className="grid size-3.5 place-items-center text-v2-semantic-success-primary">
                  {visuallyComplete &&
                    (canAnimate ? (
                      <motion.span
                        initial={
                          canAnimate ? { opacity: 0, scale: 0.8 } : false
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: canAnimate ? 0.18 : 0,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="grid place-items-center"
                      >
                        <Check className="size-3.5" strokeWidth={1.75} />
                      </motion.span>
                    ) : (
                      <Check className="size-3.5" strokeWidth={1.75} />
                    ))}
                </span>
                <span className="inline-grid justify-items-end tabular-nums before:invisible before:h-0 before:overflow-hidden before:content-['100%']">
                  {visibleValue(displayedPercentage)}%
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
