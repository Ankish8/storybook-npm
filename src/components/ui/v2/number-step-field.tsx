import * as React from "react";
import { cva } from "class-variance-authority";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

const numberStepFieldVariants = cva(
  "group flex min-w-0 w-full flex-1 font-[family-name:var(--font-v2,Inter,sans-serif)]",
  {
    variants: {
      layout: {
        default: "",
      },
    },
    defaultVariants: {
      layout: "default",
    },
  }
);

/**
 * Holding a stepper: the first repeat comes after 400ms, then each one follows a little sooner
 * (150ms, shrinking by 14% a step) until it reaches 40ms, and it stops on release, leave or a bound.
 */
const REPEAT_DELAY_MS = 400;
const REPEAT_START_MS = 150;
const REPEAT_FASTEST_MS = 40;
const REPEAT_EASE = 0.86;

/** How long a press against a limit tints the value, and how close together pushes count as one effort. */
const STRAIN_MS = 420;
const PUSH_WINDOW_MS = 700;
const PUSH_GAIN = 0.22;
const PUSH_CAP = 4;
/** The value strains this fast (px/s) toward the limit, then springs home. */
const BUMP_VELOCITY = 130;

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/** The wheel turns on a quick spring with a little life; a column opening or closing does not overshoot. */
const WHEEL_SPRING = {
  type: "spring",
  visualDuration: 0.32,
  bounce: 0.12,
} as const;
const SLOT_SPRING = {
  type: "spring",
  visualDuration: 0.38,
  bounce: 0,
} as const;
const KICK_SPRING = { type: "spring", stiffness: 171, damping: 26 } as const;

type Direction = 1 | -1;
type Source = "button" | "key" | "hold" | "type";

function parseDraft(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) ? n : null;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Off-grid values move to the next grid line in the direction of travel (as a browser's own stepper does), then whole steps. */
function stepFrom(from: number, steps: number, step: number, base: number) {
  const index = (from - base) / step;
  const whole = steps > 0 ? Math.floor(index + 1e-9) : Math.ceil(index - 1e-9);
  return Math.round(base + (whole + steps) * step);
}

function prefersReducedMotionNow(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")?.matches === true
  );
}

/** One digit on a wheel. Its distance from the wheel's position sets where it sits and how clear it is. */
function Glyph({
  position,
  digit,
}: {
  position: MotionValue<number>;
  digit: number;
}) {
  // Every style reads the wheel directly: a chained transform can lag a frame and leave the wheel blank on a jump.
  const offset = (current: number) =>
    ((((digit - current) % 10) + 15) % 10) - 5;
  const y = useTransform(position, (current) => `${offset(current) * 1.05}em`);
  const opacity = useTransform(position, (current) =>
    Math.max(0, 1 - Math.abs(offset(current)) ** 1.5 * 1.1)
  );
  const visibility = useTransform(position, (current) =>
    Math.abs(offset(current)) >= 1 ? "hidden" : "visible"
  );
  const filter = useTransform(position, (current) => {
    const distance = Math.abs(offset(current));
    return distance < 0.02 || distance >= 1
      ? "none"
      : `blur(${(distance * 3).toFixed(2)}px)`;
  });
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      style={{ y, opacity, filter, visibility }}
    >
      {digit}
    </motion.span>
  );
}

/**
 * An odometer wheel. It turns the way the whole number moved, wraps 9 to 0, and retargets mid-spin when
 * steps arrive quickly. A change of more than half a turn takes the short way round.
 */
function Wheel({
  digit,
  direction,
  instant,
}: {
  digit: number;
  direction: Direction;
  instant: boolean;
}) {
  const reduced = useReducedMotion();
  const position = useMotionValue(digit);
  const wheel = React.useRef({ digit, target: digit });
  React.useLayoutEffect(() => {
    const state = wheel.current;
    if (state.digit === digit) return;
    let delta =
      direction > 0
        ? (digit - state.digit + 10) % 10
        : -((state.digit - digit + 10) % 10);
    if (Math.abs(delta) > 5) delta -= Math.sign(delta) * 10;
    state.target += delta;
    state.digit = digit;
    if (instant || reduced) position.jump(state.target);
    else animate(position, state.target, WHEEL_SPRING);
  }, [digit, direction, instant, position, reduced]);
  return (
    <>
      {/* Sizes the column: tabular digits are all as wide as a 0. */}
      <span className="invisible">0</span>
      {DIGITS.map((item) => (
        <Glyph key={item} position={position} digit={item} />
      ))}
    </>
  );
}

/* A column opens its width while it rises in the direction of change, and closes on a critically damped
   spring so it never passes zero. Scale and opacity ride the same spring as the width. */
const slot: Variants = {
  enter: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * 0.3}em`,
    filter: "blur(3px)",
  }),
  center: {
    width: "auto",
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
    transition: {
      width: SLOT_SPRING,
      scale: SLOT_SPRING,
      opacity: SLOT_SPRING,
      y: WHEEL_SPRING,
      filter: { duration: 0.3 },
    },
  },
  exit: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * -0.3}em`,
    filter: "blur(2px)",
    transition: {
      width: SLOT_SPRING,
      scale: SLOT_SPRING,
      y: { duration: 0.14 },
      opacity: { duration: 0.08 },
      filter: { duration: 0.08 },
    },
  }),
};
const resting = (opacity: number) => ({
  width: "auto",
  scale: 1,
  opacity,
  y: 0,
  filter: "none",
});
/** Reduced motion keeps a short fade and no travel. */
const still: Variants = {
  enter: resting(0),
  center: { ...resting(1), transition: { duration: 0.08 } },
  exit: { width: 0, opacity: 0, transition: { duration: 0 } },
};
/** While typing (or when the overlay is hidden) columns follow at once. */
const cut: Variants = {
  enter: resting(1),
  center: { ...resting(1), transition: { duration: 0 } },
  exit: { width: 0, opacity: 0, transition: { duration: 0 } },
};

type Part = { key: string } & ({ digit: number } | { text: string });

/** Columns keyed by place value, so 9 to 10 keeps the ones column the ones column. */
function partsOf(value: number): Part[] {
  if (!Number.isSafeInteger(value)) return [{ key: "n", text: String(value) }];
  const text = String(Math.abs(value));
  const digits: Part[] = [...text].map((char, index) => ({
    key: `i${text.length - 1 - index}`,
    digit: Number(char),
  }));
  return value < 0 ? [{ key: "m", text: "-" }, ...digits] : digits;
}

/** The number as odometer wheels. Presentational: the input underneath is the real field. */
function RollingNumber({
  value,
  instant,
}: {
  value: number;
  instant: boolean;
}) {
  const reduced = useReducedMotion();
  const [trail, setTrail] = React.useState<{
    value: number;
    direction: Direction;
  }>({ value, direction: 1 });
  if (trail.value !== value) {
    setTrail({ value, direction: value > trail.value ? 1 : -1 });
  }
  const direction: Direction =
    trail.value === value ? trail.direction : value > trail.value ? 1 : -1;
  const variants = instant ? cut : reduced ? still : slot;
  return (
    <AnimatePresence initial={false} custom={direction}>
      {partsOf(value).map((part) => (
        <motion.span
          key={part.key}
          className="relative inline-flex justify-center [font-variant-numeric:tabular-nums]"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {"digit" in part ? (
            <Wheel digit={part.digit} direction={direction} instant={instant} />
          ) : (
            part.text
          )}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

export interface NumberStepFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children" | "onBlur"
> {
  value: number;
  /**
   * Called with every new value: a step, a held repeat, or a typed number that is valid and within
   * `min`/`max`. A typed number outside the limits (or no number yet) is held as a draft and applied,
   * clamped, when the field loses focus or Enter is pressed; Escape puts the old value back.
   */
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** How far PageUp, PageDown and Shift with an arrow move. Defaults to ten steps. */
  largeStep?: number;
  /** Trailing label inside the field (e.g. `hour`, `minutes`). Omit for a bare number. */
  suffix?: string;
  /** `error` turns the border red and marks the input `aria-invalid`. */
  state?: "default" | "error";
  disabled?: boolean;
  "aria-label"?: string;
  /** Defaults to "Increase <aria-label>", or "Increase value" without one. */
  incrementAriaLabel?: string;
  /** Defaults to "Decrease <aria-label>", or "Decrease value" without one. */
  decrementAriaLabel?: string;
  /** Called when the number input loses focus (e.g. validation), after any typed draft has been applied. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const STEP_BUTTON_CLASSNAME = cn(
  "flex w-full flex-1 items-center justify-center rounded-none border-0 bg-transparent p-0 text-[var(--v2-text-muted,#707070)] [transition-property:color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-hover enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--v2-text-primary,#484848)] enabled:[&:is(:active,[data-pressed]):not(:disabled)]:bg-semantic-border-layout enabled:[&:is(:active,[data-pressed]):not(:disabled)]:text-[var(--v2-text-primary,#484848)] enabled:[&:is(:active,[data-pressed]):not(:disabled)]:[transition-duration:60ms] enabled:[&:is(:active,[data-pressed]):not(:disabled)]:[transition-timing-function:linear] [&_svg]:transition-transform [&_svg]:[transition-duration:580ms] [&_svg]:[transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] [&:is(:active,[data-pressed]):not(:disabled)_svg]:scale-[0.82] [&:is(:active,[data-pressed]):not(:disabled)_svg]:[transition-duration:90ms] [&:is(:active,[data-pressed]):not(:disabled)_svg]:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.12s] motion-reduce:[&_svg]:transition-none motion-reduce:[&:is(:active,[data-pressed]):not(:disabled)_svg]:scale-100 disabled:cursor-not-allowed disabled:opacity-[0.35]"
);

const NumberStepField = React.forwardRef<HTMLDivElement, NumberStepFieldProps>(
  (
    {
      className,
      value,
      onValueChange,
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      step: stepProp = 1,
      largeStep,
      suffix,
      state = "default",
      disabled,
      "aria-label": ariaLabel,
      incrementAriaLabel,
      decrementAriaLabel,
      onBlur,
      ...props
    },
    ref
  ) => {
    const reduced = useReducedMotion();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const upIconRef = React.useRef<HTMLSpanElement>(null);
    const downIconRef = React.useRef<HTMLSpanElement>(null);

    // Whole steps from a grid that starts at the minimum, like a browser's own number input.
    const step = Math.max(1, Math.round(stepProp));
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    const base = Number.isFinite(lo) ? lo : 0;
    const largeSteps = Math.max(1, Math.round((largeStep ?? step * 10) / step));
    const spoken = (n: number) => (suffix ? `${n} ${suffix}` : `${n}`);

    /**
     * What the person has typed while the field is being edited, or null when it is not. Typing keeps its
     * own text so a half-typed number ("-", or "2" on the way to "25" above a minimum of 10) is never
     * rewritten under the caret.
     */
    const [draft, setDraft] = React.useState<string | null>(null);
    const editStart = React.useRef(value);
    const editing = draft !== null;
    const [announcement, setAnnouncement] = React.useState("");
    const [strained, setStrained] = React.useState(false);
    const bumpY = useMotionValue(0);

    // The timers and the strain read the latest props through a ref, so a controlled parent that re-renders
    // between ticks is respected (and a hold stops at the bounds like a single click would).
    const latest = React.useRef({ value, onValueChange });
    const live = React.useRef<
      (direction: Direction, steps: number, source: Source) => boolean
    >(() => false);
    React.useEffect(() => {
      latest.current = { value, onValueChange };
    });

    const delayTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const strainTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    );
    // True once a hold has produced repeats: the click that follows the release must not step again.
    // `releasedAt` lets a stale flag (a hold that left the button, so no click came) expire instead of
    // swallowing a later keyboard click.
    const heldRepeat = React.useRef(false);
    // The press handler cancels the pointer's default, which also stops the browser from setting :active,
    // so a held stepper is marked with data-pressed instead (Arc shows the same pressed fill and sunk glyph).
    const [pressed, setPressed] = React.useState<1 | -1 | null>(null);
    const releasedAt = React.useRef(0);
    const effort = React.useRef({ edge: 0, count: 0, at: 0 });

    const stopRepeat = React.useCallback(() => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }, []);
    React.useEffect(
      () => () => {
        stopRepeat();
        if (strainTimer.current) clearTimeout(strainTimer.current);
      },
      [stopRepeat]
    );

    const emit = (next: number) => {
      latest.current.value = next;
      latest.current.onValueChange(next);
    };

    /**
     * A press against a limit. The value tints and strains toward the limit and springs home, a little
     * further with each push in a row (capped, like overscroll); the refused chevron shakes once. Reduced
     * motion keeps only the tint.
     */
    const strain = (edge: Direction, source: Source) => {
      const now = performance.now();
      const push = effort.current;
      push.count =
        push.edge === edge && now - push.at < PUSH_WINDOW_MS
          ? push.count + 1
          : 1;
      push.edge = edge;
      push.at = now;
      setStrained(true);
      if (strainTimer.current) clearTimeout(strainTimer.current);
      strainTimer.current = setTimeout(() => setStrained(false), STRAIN_MS);
      if (reduced || prefersReducedMotionNow()) return;
      animate(bumpY, 0, {
        ...KICK_SPRING,
        velocity:
          -edge *
          BUMP_VELOCITY *
          (1 + Math.min(push.count - 1, PUSH_CAP) * PUSH_GAIN),
      });
      const icon = (edge > 0 ? upIconRef : downIconRef).current;
      if (icon && source !== "type") {
        animate(icon, { x: [0, -2.5, 2.5, -1.5, 1, 0] }, { duration: 0.32 });
      }
    };

    /** One step (or `steps`) from the latest value. Returns whether the value moved. */
    const nudge = (direction: Direction, steps: number, source: Source) => {
      const from = latest.current.value;
      const target = stepFrom(from, direction * steps, step, base);
      const next = clamp(target, lo, hi);
      if (next !== from) emit(next);
      if (target !== next) {
        strain(direction, source);
        setAnnouncement(
          `${spoken(next)}, ${direction > 0 ? "maximum" : "minimum"}`
        );
      } else if (next !== from) {
        setAnnouncement(spoken(next));
      }
      return next !== from;
    };
    React.useEffect(() => {
      live.current = nudge;
    });

    /** Applies what was typed: clamped to the limits, or dropped (the old value stays) if it is not a number. */
    const commitDraft = () => {
      if (draft === null) return;
      setDraft(null);
      const typed = parseDraft(draft);
      if (typed === null) {
        setAnnouncement(spoken(latest.current.value));
        return;
      }
      const next = clamp(typed, lo, hi);
      if (next !== typed) {
        const edge: Direction = typed > next ? 1 : -1;
        strain(edge, "type");
        setAnnouncement(`${spoken(next)}, ${edge > 0 ? "maximum" : "minimum"}`);
      }
      if (next !== latest.current.value) emit(next);
    };

    const revertDraft = () => {
      if (draft === null) return;
      setDraft(null);
      if (latest.current.value !== editStart.current) emit(editStart.current);
    };

    const handleChange = (raw: string) => {
      if (draft === null) editStart.current = latest.current.value;
      setDraft(raw);
      const typed = parseDraft(raw);
      // A number that is already valid applies at once, so the parent never lags the text. Anything
      // else (out of range, empty, a lone minus) is held until the field is left.
      if (
        typed !== null &&
        typed >= lo &&
        typed <= hi &&
        typed !== latest.current.value
      ) {
        emit(typed);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      // A minus only makes sense when the field can go below zero; a plus never does.
      if ((e.key === "-" && lo >= 0) || e.key === "+") {
        e.preventDefault();
        return;
      }
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "PageUp":
        case "PageDown": {
          e.preventDefault();
          const direction: Direction =
            e.key === "ArrowUp" || e.key === "PageUp" ? 1 : -1;
          const large = e.shiftKey || e.key.startsWith("Page");
          commitDraft();
          nudge(direction, large ? largeSteps : 1, "key");
          break;
        }
        case "Home":
        case "End": {
          // While a draft is open these move the caret, as in any text field.
          if (editing) break;
          const target = e.key === "Home" ? lo : hi;
          if (
            !Number.isFinite(target) ||
            Math.abs(target) >= Number.MAX_SAFE_INTEGER
          ) {
            break;
          }
          e.preventDefault();
          if (target !== latest.current.value) {
            emit(target);
            setAnnouncement(
              `${spoken(target)}, ${e.key === "Home" ? "minimum" : "maximum"}`
            );
          }
          break;
        }
        case "Enter":
          commitDraft();
          break;
        case "Escape":
          if (editing) {
            e.preventDefault();
            revertDraft();
          }
          break;
      }
    };

    const startRepeat = (direction: Direction) => {
      stopRepeat();
      heldRepeat.current = false;
      releasedAt.current = 0;
      let count = 0;
      const tick = () => {
        if (!live.current(direction, 1, "hold")) {
          // Held into a limit: it has strained once, and now the hold ends.
          stopRepeat();
          return;
        }
        heldRepeat.current = true;
        count += 1;
        delayTimer.current = setTimeout(
          tick,
          Math.max(REPEAT_FASTEST_MS, REPEAT_START_MS * REPEAT_EASE ** count)
        );
      };
      delayTimer.current = setTimeout(tick, REPEAT_DELAY_MS);
    };

    const endRepeat = () => {
      setPressed(null);
      stopRepeat();
      if (heldRepeat.current && releasedAt.current === 0) {
        releasedAt.current = Date.now();
      }
    };

    /** Click path: keyboard activation, tests and short presses. A press that already repeated is not stepped again. */
    const handleStepClick = (direction: Direction) => () => {
      if (heldRepeat.current) {
        const fresh =
          releasedAt.current === 0 || Date.now() - releasedAt.current < 600;
        heldRepeat.current = false;
        releasedAt.current = 0;
        if (fresh) return;
      }
      commitDraft();
      nudge(direction, 1, "button");
    };

    /** Keeps focus on the input (not the button) so stepping after typing does not drop focus; also focuses the field when only the steppers are used so blur handlers run on leave. */
    const handleStepperPointerDown =
      (direction: Direction) => (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        inputRef.current?.focus();
        if ((e.button ?? 0) === 0) {
          // An open draft is applied before the step, so the step starts from what the person typed.
          commitDraft();
          setPressed(direction);
          startRepeat(direction);
        }
      };

    const atMax = value >= hi;
    const atMin = value <= lo;
    const increaseLabel =
      incrementAriaLabel ??
      (ariaLabel ? `Increase ${ariaLabel}` : "Increase value");
    const decreaseLabel =
      decrementAriaLabel ??
      (ariaLabel ? `Decrease ${ariaLabel}` : "Decrease value");

    return (
      <div
        ref={ref}
        className={cn(
          numberStepFieldVariants({ layout: "default" }),
          className
        )}
        {...props}
      >
        <div
          data-strain={strained ? "" : undefined}
          className={cn(
            // 44px, or 50px on a coarse pointer so each half-height stepper tile (shell minus 2px border, halved) is 24px.
            "flex h-11 min-w-0 flex-1 items-center rounded-lg border border-solid overflow-hidden transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] [@media(pointer:coarse)]:h-[50px]",
            state === "error"
              ? "border-semantic-error-primary"
              : "border-semantic-border-layout",
            // Arc: hover steps the hairline up to the input border, focus to the strong one; a disabled shell dims to 50%.
            disabled
              ? "bg-semantic-bg-ui opacity-50"
              : state !== "error" &&
                  "group-hover:[&:not(:focus-within)]:border-semantic-border-input group-focus-within:shadow-none"
          )}
        >
          <div className="relative h-full min-w-0 flex-1">
            <Input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              decimal={false}
              value={draft ?? value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                commitDraft();
                onBlur?.(e);
              }}
              disabled={disabled}
              aria-label={ariaLabel}
              aria-invalid={state === "error" || undefined}
              aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
              hideNumberSpinners
              className={cn(
                "rounded-none border-0 h-full min-w-0 w-full bg-semantic-bg-primary px-3 py-2.5 leading-[normal] [font-variant-numeric:tabular-nums] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none shadow-none disabled:opacity-100",
                // The wheels draw the number while nobody is typing; the caret stays so a click still lands.
                !editing &&
                  "text-transparent caret-[var(--v2-text-secondary,#5E5E5E)]"
              )}
            />
            <span
              aria-hidden="true"
              data-number-digits=""
              data-editing={editing ? "" : undefined}
              className={cn(
                "pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm leading-[1.4] tracking-[-0.01em] transition-[opacity,color] [transition-duration:80ms] motion-reduce:transition-none",
                editing && "opacity-0",
                strained
                  ? "text-semantic-warning-text"
                  : "text-[var(--v2-text-secondary,#5E5E5E)]"
              )}
            >
              <motion.span className="inline-flex" style={{ y: bumpY }}>
                <RollingNumber value={value} instant={editing} />
              </motion.span>
            </span>
          </div>
          {/* Two flush half-height targets share a neutral control rail. Hover fills the
              available half without introducing detached rounded plates. Keyboard stepping
              stays on the input, and coarse pointers retain 24px-high targets. */}
          <div className="flex h-full w-8 shrink-0 flex-col border-l border-solid border-semantic-border-layout bg-semantic-bg-ui">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMax}
              onPointerDown={handleStepperPointerDown(1)}
              onPointerUp={endRepeat}
              onPointerLeave={endRepeat}
              onPointerCancel={endRepeat}
              onClick={handleStepClick(1)}
              data-pressed={pressed === 1 ? "" : undefined}
              aria-label={increaseLabel}
              className={STEP_BUTTON_CLASSNAME}
            >
              <span ref={upIconRef} className="flex">
                <ChevronUp className="size-3" />
              </span>
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMin}
              onPointerDown={handleStepperPointerDown(-1)}
              onPointerUp={endRepeat}
              onPointerLeave={endRepeat}
              onPointerCancel={endRepeat}
              onClick={handleStepClick(-1)}
              data-pressed={pressed === -1 ? "" : undefined}
              aria-label={decreaseLabel}
              className={STEP_BUTTON_CLASSNAME}
            >
              <span ref={downIconRef} className="flex">
                <ChevronDown className="size-3" />
              </span>
            </button>
          </div>
          {suffix && (
            <span
              className="inline-flex h-full items-center px-4 shrink-0 bg-semantic-bg-ui text-sm leading-[normal] text-[var(--v2-text-muted,#707070)]"
              aria-hidden
            >
              {suffix}
            </span>
          )}
        </div>
        {/* Says what a step, a limit or a clamp did; stepping from a button moves no focus. */}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </span>
      </div>
    );
  }
);
NumberStepField.displayName = "NumberStepField";

export { NumberStepField, numberStepFieldVariants };
