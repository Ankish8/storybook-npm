"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "./button";

export type ActionButtonState = "idle" | "pending" | "success";

export interface ActionButtonProps extends Omit<
  ButtonProps,
  | "children"
  | "onClick"
  | "loading"
  | "loadingText"
  | "asChild"
  | "leftIcon"
  | "rightIcon"
  | "size"
> {
  /** Idle label and stable accessible name. */
  label: string;
  /** Return the real promise; success appears only after it resolves. */
  onAction: () => void | Promise<unknown>;
  pendingLabel?: string;
  successLabel?: string;
  /** Announced after a rejection. Use onActionError for visible error UI. */
  errorLabel?: string;
  /** Success display time. Zero keeps success until the next action. */
  resetAfterMs?: number;
  onActionError?: (error: unknown) => void;
  /** Notification for logging and surrounding UI; state is owned by this component. */
  onStateChange?: (state: ActionButtonState) => void;
  /** Text sizes match Button. Icon-only actions belong to Button. */
  size?: "sm" | "default" | "lg";
}

const easing = [0.22, 1, 0.36, 1] as const;
// Arc motion tokens: "morph" carries width and layout changes that follow new
// content, "snappy" the small icon swaps.
const widthSpring = {
  type: "spring",
  visualDuration: 0.42,
  bounce: 0.16,
} as const;
const iconSpring = {
  type: "spring",
  visualDuration: 0.26,
  bounce: 0.12,
} as const;
const enter = [0.16, 1, 0.3, 1] as const;
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Glyph = { key: string; text: string };
function glyphs(text: string, generation: number) {
  return Array.from(text, (char, index) => ({
    key: `${generation}-${index}`,
    text: char,
  }));
}

function ActionLabel({ text, reduced }: { text: string; reduced: boolean }) {
  const [previous, setPrevious] = React.useState(() => ({
    text,
    generation: 0,
    glyphs: glyphs(text, 0),
  }));
  let letters = previous.glyphs;
  if (previous.text !== text) {
    const next = Array.from(text);
    let prefix = 0;
    let suffix = 0;
    while (
      prefix < Math.min(letters.length, next.length) &&
      letters[prefix].text === next[prefix]
    )
      prefix++;
    while (
      suffix < Math.min(letters.length, next.length) - prefix &&
      letters[letters.length - 1 - suffix].text ===
        next[next.length - 1 - suffix]
    )
      suffix++;
    // Keep meaningful shared runs ("Sav" in Save/Saving/Saved), not lone letters.
    if (prefix < 2) prefix = 0;
    if (suffix < 2) suffix = 0;
    const generation = previous.generation + 1;
    const added: Glyph[] = next
      .slice(prefix, next.length - suffix)
      .map((char, index) => ({ key: `${generation}-${index}`, text: char }));
    letters = [
      ...letters.slice(0, prefix),
      ...added,
      ...(suffix ? letters.slice(-suffix) : []),
    ];
    setPrevious({ text, generation, glyphs: letters });
  }

  const row = React.useRef<HTMLSpanElement>(null);
  const width = useMotionValue<number | "auto">("auto");
  const lastText = React.useRef(text);
  const animateUntil = React.useRef(0);
  useIsomorphicLayoutEffect(() => {
    if (lastText.current !== text) {
      animateUntil.current = performance.now() + 700;
      lastText.current = text;
    }
  }, [text]);
  React.useEffect(() => {
    const node = row.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    let measured = false;
    let animation: ReturnType<typeof animate> | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width;
      animation?.stop();
      if (
        !measured ||
        !next ||
        reduced ||
        performance.now() > animateUntil.current
      ) {
        width.jump(next || "auto");
      } else {
        animation = animate(width, next, widthSpring);
      }
      measured = next > 0;
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.stop();
    };
  }, [reduced, width]);

  return (
    <motion.span
      data-action-label=""
      className="inline-flex min-w-0 [clip-path:inset(-0.6em_-0.3em_-0.6em_-0.3em)]"
      style={{ width }}
    >
      <span
        ref={row}
        className="relative inline-flex w-max shrink-0 whitespace-pre"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {letters.map((letter, index) => (
            <motion.span
              key={letter.key}
              data-action-glyph=""
              className="inline-block"
              layout={reduced ? false : "position"}
              layoutDependency={text}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 5, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -4,
                      filter: "blur(2px)",
                      transition: { duration: 0.16, ease: easing },
                    }
              }
              transition={
                reduced
                  ? { duration: 0.12 }
                  : {
                      duration: 0.24,
                      ease: enter,
                      delay: Math.min(index * 0.016, 0.1),
                      layout: widthSpring,
                    }
              }
            >
              {letter.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </motion.span>
  );
}

function ActionIcon({
  state,
  reduced,
}: {
  state: ActionButtonState;
  reduced: boolean;
}) {
  const arrow = state === "idle";
  return (
    <span
      className="grid size-[17px] shrink-0 place-items-center"
      data-action-icon={state}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={state}
          className="col-start-1 row-start-1 grid size-[17px] place-items-center"
          initial={
            reduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  x: arrow ? -6 : 0,
                  scale: arrow ? 1 : 0.6,
                  filter: "blur(2px)",
                }
          }
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0,
                  x: arrow ? 8 : 0,
                  scale: arrow ? 1 : 0.6,
                  filter: "blur(2px)",
                  transition: { duration: 0.16, ease: easing },
                }
          }
          transition={
            reduced
              ? { duration: 0.12 }
              : {
                  ...iconSpring,
                  opacity: { duration: 0.16, ease: enter },
                  filter: { duration: 0.16, ease: enter },
                }
          }
        >
          {state === "pending" ? (
            <span
              data-action-spinner=""
              className="size-4 rounded-full border-[1.5px] border-solid border-current border-r-transparent animate-spin [animation-duration:700ms] motion-reduce:[animation-duration:2s]"
            />
          ) : state === "success" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <motion.path
                d="M4 12l5 5L20 6"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: reduced ? 0 : 0.24,
                    ease: enter,
                    delay: reduced ? 0 : 0.05,
                  },
                  opacity: { duration: 0.05, delay: reduced ? 0 : 0.05 },
                }}
              />
            </svg>
          ) : (
            <ArrowRight />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Additive v2 action control. v1 Button remains unchanged; no automatic migration. */
const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      label,
      onAction,
      pendingLabel = "Saving",
      successLabel = "Saved",
      errorLabel = "Action failed. Please try again.",
      resetAfterMs = 2400,
      onActionError,
      onStateChange,
      variant = "primary",
      size = "default",
      type = "button",
      disabled = false,
      className,
      onClickCapture,
      onPointerDownCapture,
      onKeyDownCapture,
      ...props
    },
    ref
  ) => {
    const [state, setState] = React.useState<ActionButtonState>("idle");
    const [failed, setFailed] = React.useState(false);
    const inFlight = React.useRef(false);
    const mounted = React.useRef(false);
    const runId = React.useRef(0);
    const stateChange = React.useRef(onStateChange);
    const pending = state === "pending";
    const unavailable =
      disabled ||
      pending ||
      props["aria-disabled"] === true ||
      props["aria-disabled"] === "true";
    const reduced = useReducedMotion() ?? false;
    const text = pending
      ? pendingLabel
      : state === "success"
        ? successLabel
        : label;
    useIsomorphicLayoutEffect(() => {
      stateChange.current = onStateChange;
    }, [onStateChange]);
    React.useEffect(() => {
      const invalidateRun = () => {
        runId.current++;
      };
      mounted.current = true;
      return () => {
        mounted.current = false;
        invalidateRun();
      };
    }, []);
    React.useEffect(() => {
      if (
        state !== "success" ||
        !Number.isFinite(resetAfterMs) ||
        resetAfterMs <= 0
      )
        return;
      const timer = setTimeout(() => {
        setState("idle");
        stateChange.current?.("idle");
      }, resetAfterMs);
      return () => clearTimeout(timer);
    }, [state, resetAfterMs]);

    const block = (event: React.SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const measurePress = (node: HTMLButtonElement) => {
      const width = node.offsetWidth;
      node.style.setProperty(
        "--v2-button-press",
        width > 220 ? "0.985" : width > 0 && width <= 48 ? "0.96" : "0.97"
      );
    };
    async function run(event: React.MouseEvent<HTMLButtonElement>) {
      if (unavailable || inFlight.current) {
        block(event);
        return;
      }
      if (event.defaultPrevented) return;
      inFlight.current = true;
      const id = ++runId.current;
      setFailed(false);
      setState("pending");
      stateChange.current?.("pending");
      try {
        await onAction();
      } catch (error) {
        if (!mounted.current || id !== runId.current) return;
        inFlight.current = false;
        setState("idle");
        setFailed(true);
        stateChange.current?.("idle");
        onActionError?.(error);
        return;
      }
      if (!mounted.current || id !== runId.current) return;
      inFlight.current = false;
      setState("success");
      stateChange.current?.("success");
    }

    return (
      <>
        <button
          {...props}
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            buttonVariants({ variant, size }),
            // Arc: the label row hugs 20px content with a 17px icon, default
            // padding is 20px, hover only lifts a shadow (no opacity change) and
            // a disabled button dims to .7 while a pending one stays at full opacity.
            "overflow-hidden [&_svg]:size-[17px]",
            size === "default" && "px-5",
            "[@media(hover:hover)_and_(pointer:fine)]:[&:hover:not(:active):not([aria-disabled=true])]:opacity-100 [&:active:not([aria-disabled=true])]:opacity-100 disabled:opacity-[0.7] [&[aria-disabled=true]:not([aria-busy=true])]:opacity-[0.7]",
            className
          )}
          data-state={state}
          aria-label={props["aria-label"] ?? label}
          aria-busy={pending || props["aria-busy"] || undefined}
          aria-disabled={unavailable || undefined}
          onClick={run}
          onClickCapture={(event) => {
            if (unavailable || inFlight.current) block(event);
            else onClickCapture?.(event);
          }}
          onPointerDownCapture={(event) => {
            if (unavailable) block(event);
            else {
              measurePress(event.currentTarget);
              onPointerDownCapture?.(event);
            }
          }}
          onKeyDownCapture={(event) => {
            if (unavailable && (event.key === "Enter" || event.key === " "))
              block(event);
            else {
              if (event.key === "Enter" || event.key === " ")
                measurePress(event.currentTarget);
              onKeyDownCapture?.(event);
            }
          }}
        >
          <span
            aria-hidden="true"
            className="inline-flex min-h-5 items-center justify-center gap-2 whitespace-nowrap"
          >
            <ActionLabel text={text} reduced={reduced} />
            <ActionIcon state={state} reduced={reduced} />
          </span>
        </button>
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {pending
            ? pendingLabel
            : state === "success"
              ? successLabel
              : failed
                ? errorLabel
                : ""}
        </span>
      </>
    );
  }
);
ActionButton.displayName = "ActionButton";
export { ActionButton };
