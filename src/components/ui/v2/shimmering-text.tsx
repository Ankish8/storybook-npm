import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  usePageInView,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { AnimationPlaybackControls, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export interface ShimmeringTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Arc's text-shimmer: a bell-shaped light band (2.2em either side of its centre) sweeps the line once per 1.8s, rests
// for a third of a pass, and goes round again. Arc's easing and duration tokens, in seconds.
const SWEEP_SECONDS = 1.8;
const BAND = 2.2;
const FALLOFF = [
  [-1, 0],
  [-0.5, 0.5],
  [-0.2, 0.9],
  [0, 1],
  [0.2, 0.9],
  [0.5, 0.5],
  [1, 0],
] as const;
const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
const SPRING_MORPH = {
  type: "spring",
  visualDuration: 0.42,
  bounce: 0.16,
} as const;
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

/** Paints the band at sweep position `t` (0 sits left of the text, 1 right of it) over a base that is `settle` of the way to the solid text colour. */
function shimmerImage(t: number, settle: number) {
  const base = `color-mix(in oklab, currentColor ${percent(settle)}, var(--ts-base))`;
  const stops = FALLOFF.map(
    ([offset, strength]) =>
      `color-mix(in oklab, var(--ts-highlight) ${percent(strength)}, ${base}) calc(${(t * 100).toFixed(2)}% + ${((2 * t - 1 + offset) * BAND).toFixed(3)}em)`
  );
  return `linear-gradient(90deg, ${base}, ${stops.join(", ")}, ${base})`;
}

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

const ShimmeringText = React.forwardRef<HTMLSpanElement, ShimmeringTextProps>(
  (
    {
      active = true,
      children = "Loading. Please wait",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const stage = React.useRef<HTMLSpanElement>(null);
    const prefersReduced = useReducedMotion();
    const hydrated = React.useSyncExternalStore(
      subscribeHydration,
      clientSnapshot,
      serverSnapshot
    );
    const reduced = Boolean(hydrated && prefersReduced);
    // Offscreen text stops sweeping. Without IntersectionObserver (old browsers, jsdom) it is treated as visible.
    const [inView, setInView] = React.useState(true);
    React.useEffect(() => {
      const node = stage.current;
      if (!node || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { rootMargin: "64px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, []);
    const pageVisible = usePageInView();
    const sweep = useMotionValue(0);
    const settle = useMotionValue(active ? 0 : 1);
    const backgroundImage = useTransform(() =>
      shimmerImage(sweep.get(), settle.get())
    );
    const running = active && !reduced && inView && pageVisible;
    const restWidth = React.useRef(0);
    const text =
      typeof children === "string" || typeof children === "number"
        ? String(children)
        : null;

    // Loop the sweep only while work is ongoing, visible, and motion is allowed. A paused band resumes where it stopped.
    React.useEffect(() => {
      if (reduced) sweep.jump(0);
      if (!running) return;
      let controls: AnimationPlaybackControls | undefined;
      const pass = (delay: number) => {
        if (sweep.get() >= 1) sweep.jump(0);
        controls = animate(sweep, 1, {
          duration: SWEEP_SECONDS * (1 - sweep.get()),
          delay,
          ease: "linear",
          onComplete: () => pass(SWEEP_SECONDS * 0.32),
        });
      };
      pass(sweep.get() > 0 ? 0 : 0.12);
      return () => controls?.stop();
    }, [running, reduced, sweep]);

    // Finishing lets a band in flight glide off while the base resolves to the solid text colour, so the text never hard cuts.
    React.useEffect(() => {
      if (active) {
        const dim = animate(settle, 0, {
          duration: reduced ? 0 : 0.24,
          ease: [...EASE_STANDARD],
        });
        return () => dim.stop();
      }
      const t = sweep.get();
      const glide =
        !reduced && t > 0 && t < 1
          ? animate(sweep, 1, {
              duration: Math.min(0.42, SWEEP_SECONDS * (1 - t) * 0.5),
              ease: [...EASE_ENTER],
            })
          : undefined;
      const solid = animate(settle, 1, {
        duration: reduced ? 0.12 : 0.36,
        ease: [...EASE_STANDARD],
      });
      return () => {
        glide?.stop();
        solid.stop();
      };
    }, [active, reduced, sweep, settle]);

    // A new label springs the line to its width instead of resizing in one frame, so text after it never jumps.
    React.useLayoutEffect(() => {
      const node = stage.current;
      if (!node || text === null) return;
      const sizing = Boolean(node.style.width);
      const current = node.getBoundingClientRect().width;
      node.style.width = "";
      const next = node.getBoundingClientRect().width;
      const from = sizing ? current : restWidth.current;
      restWidth.current = next;
      if (reduced || !from || Math.abs(from - next) < 0.5) {
        delete node.dataset.sizing;
        return;
      }
      node.dataset.sizing = "";
      const controls = animate(
        node,
        { width: [from, next] },
        {
          ...SPRING_MORPH,
          onComplete: () => {
            node.style.width = "";
            delete node.dataset.sizing;
          },
        }
      );
      return () => controls.stop();
    }, [text, reduced]);

    // Keep the resting width current when fonts load or the container resizes.
    React.useEffect(() => {
      const node = stage.current;
      if (!node || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => {
        if (!node.style.width)
          restWidth.current = node.getBoundingClientRect().width;
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const labelClass =
      "inline-block max-w-full bg-no-repeat [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] selection:[-webkit-text-fill-color:currentColor] group-data-[sizing]/ts:max-w-none group-data-[sizing]/ts:whitespace-nowrap forced-colors:!bg-none forced-colors:![-webkit-text-fill-color:currentColor] [@supports_not_(color:color-mix(in_oklab,red,blue))]:!bg-none [@supports_not_(color:color-mix(in_oklab,red,blue))]:![-webkit-text-fill-color:currentColor]";

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy={active}
        data-v2-shimmer={active || undefined}
        className={cn(
          "inline-block max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal leading-[19px] text-[var(--v2-text-secondary,#5E5E5E)]",
          className
        )}
        style={
          {
            // The band is the primary text colour over a base that leans toward muted; the settled text is the element's own colour.
            "--ts-highlight": "var(--v2-text-primary,#484848)",
            "--ts-base":
              "color-mix(in oklab, currentColor 12%, var(--v2-text-muted,#707070))",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <span ref={stage} className="group/ts relative inline-block max-w-full">
          {text === null ? (
            <motion.span className={labelClass} style={{ backgroundImage }}>
              {children}
            </motion.span>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <Swap
                key={text}
                className={labelClass}
                style={{ backgroundImage }}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: "0.3em", filter: "blur(4px)" }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, y: "0em", filter: "blur(0px)" }
                }
                exit={
                  reduced
                    ? { opacity: 0, transition: { duration: 0.12 } }
                    : {
                        opacity: 0,
                        y: "-0.24em",
                        filter: "blur(2px)",
                        transition: {
                          duration: 0.16,
                          ease: [...EASE_STANDARD],
                        },
                      }
                }
                transition={{
                  duration: reduced ? 0.12 : 0.24,
                  ease: [...EASE_ENTER],
                }}
              >
                {text}
              </Swap>
            </AnimatePresence>
          )}
        </span>
      </span>
    );
  }
);
ShimmeringText.displayName = "ShimmeringText";
export { ShimmeringText };
