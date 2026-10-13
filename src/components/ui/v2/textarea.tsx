import * as React from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { CircleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Measures copy as it wraps or changes, so opening, replacement and closing all animate height. */
function FieldFeedback({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const content = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  const reduced = useReducedMotion() ?? false;
  React.useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const measure = () => setHeight(node.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);
  return (
    <motion.div
      data-field-feedback=""
      initial={false}
      animate={{
        height: active ? (height ?? "auto") : 0,
        opacity: active ? 1 : 0,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              // Arc: the row opens its height on a critically damped spring while the opacity follows in 160ms.
              height: { type: "spring", visualDuration: 0.4, bounce: 0 },
              opacity: { duration: 0.16 },
            }
      }
      className="min-w-0 overflow-hidden"
    >
      <div ref={content} className={className}>
        {children}
      </div>
    </motion.div>
  );
}

// Collapses runs of the space character (U+0020) so only a single space is allowed
// between segments. Newlines and other whitespace are unchanged.
// Inlined so the component is self-contained when distributed via the CLI.
const normalizeTextareaSpaces = (value: string): string =>
  String(value).replace(/ {2,}/g, " ");

const getNormalizedSelectionOffset = (
  value: string,
  selectionOffset: number | null
): number =>
  normalizeTextareaSpaces(value.slice(0, selectionOffset ?? value.length))
    .length;

// Default counter length: normalized text length (spaces count; duplicate spaces do not).
const countNonWhitespaceChars = (value: string): number =>
  normalizeTextareaSpaces(value).length;

/**
 * Textarea variants for different visual states
 */
const textareaVariants = cva(
  "w-full max-w-full rounded-lg bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-[var(--v2-text-secondary,#5E5E5E)] leading-[1.4] tracking-[-0.16px] outline-none transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] placeholder:text-[var(--v2-text-placeholder,#707070)] disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:opacity-60 disabled:shadow-none",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:border-semantic-primary focus:shadow-none aria-[invalid=true]:border-semantic-error-primary aria-[invalid=true]:hover:border-semantic-error-primary",
        error:
          "border border-solid border-semantic-error-primary focus:outline-none focus:shadow-none",
      },
      size: {
        default: "min-h-[110px] px-3 py-3 text-sm leading-[1.4]",
        sm: "px-3 py-2 text-xs leading-[1.4]",
        lg: "px-3 py-3 text-base leading-[1.4]",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

/**
 * A multi-line text input with label, error state, helper text, character counter, and resize control.
 * With `showCount` and `maxLength`, the counter uses normalized length (single spaces
 * between words count toward the limit) unless `displayCharCount` is set. Duplicate
 * spaces are collapsed on change and in the displayed value.
 *
 * @example
 * ```tsx
 * <Textarea label="Description" placeholder="Enter description" />
 * <Textarea label="Notes" error="Too short" showCount maxLength={500} />
 * <Textarea label="Notes" showCount maxLength={5000} enforceMaxLength={false} error={overflowMsg} />
 * <Textarea label="Message" error="Invalid characters not allowed." errorIcon />
 * <Textarea label="JSON" rows={8} resize="vertical" />
 * ```
 */
export interface TextareaProps
  extends
    Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  /** Size of the textarea — `default`, `sm` (compact), or `lg` */
  size?: "default" | "sm" | "lg";
  /** Label text displayed above the textarea */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Error message — shows error state with red styling */
  error?: string;
  /**
   * When true and `error` is set, shows a leading error icon with the message (field-level validation pattern).
   */
  errorIcon?: boolean;
  /** Shows character count when maxLength is set */
  showCount?: boolean;
  /**
   * When set, the counter shows this number instead of the default normalized length
   * (see `countNonWhitespaceChars` in this file).
   * Does not change native `maxLength` or stored value — display only.
   */
  displayCharCount?: number;
  /**
   * When true (default), `maxLength` is applied to the native textarea (hard limit).
   * When false, the limit is only used for `showCount` / styling — pair with `error` or parent validation for soft limits.
   */
  enforceMaxLength?: boolean;
  /** Controls CSS resize behavior. Defaults to "none" */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Opt into content-based height. Native rows and resize behavior are unchanged when false. */
  autoResize?: boolean;
  /** Minimum visible rows when autoResize is enabled. Defaults to rows. */
  minRows?: number;
  /** Maximum visible rows when autoResize is enabled. Overflow scrolls after this limit. */
  maxRows?: number;
  /** Additional class for the wrapper container */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      state,
      size,
      label,
      required,
      helperText,
      error,
      errorIcon = false,
      showCount,
      displayCharCount,
      enforceMaxLength = true,
      resize = "none",
      autoResize = false,
      minRows,
      maxRows,
      maxLength,
      rows = 4,
      value,
      defaultValue,
      onChange,
      onCompositionStart,
      onCompositionEnd,
      disabled,
      id,
      style,
      ...props
    }: TextareaProps,
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const pendingSelectionRef = React.useRef<
      [number, number, "forward" | "backward" | "none"] | null
    >(null);
    const composing = React.useRef(false);
    const changeSequence = React.useRef(0);
    const [compositionDraft, setCompositionDraft] = React.useState<
      string | null
    >(null);

    const setTextareaRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Internal state for character count in uncontrolled mode (normalized)
    const [internalValue, setInternalValue] = React.useState(() =>
      normalizeTextareaSpaces(String(defaultValue ?? ""))
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const currentValue =
      compositionDraft ??
      (isControlled
        ? normalizeTextareaSpaces(String(value ?? ""))
        : internalValue);

    const restoreSelection = React.useCallback(() => {
      const pendingSelection = pendingSelectionRef.current;
      const textarea = textareaRef.current;

      if (!pendingSelection || !textarea) return;

      pendingSelectionRef.current = null;
      textarea.setSelectionRange(...pendingSelection);
    }, []);

    React.useLayoutEffect(() => {
      restoreSelection();
    });

    React.useLayoutEffect(() => {
      const textarea = textareaRef.current;
      if (!autoResize || !textarea) return;

      const original = {
        height: textarea.style.height,
        minHeight: textarea.style.minHeight,
        maxHeight: textarea.style.maxHeight,
        overflowY: textarea.style.overflowY,
      };
      const originalMinHeightPriority =
        textarea.style.getPropertyPriority("min-height");
      const positiveRows = (candidate: number | undefined, fallback: number) =>
        candidate !== undefined && Number.isFinite(candidate)
          ? Math.max(1, Math.floor(candidate))
          : fallback;
      const minimumRows = positiveRows(minRows, positiveRows(rows, 4));
      const maximumRows = Math.max(
        minimumRows,
        positiveRows(maxRows, Infinity)
      );
      const measure = () => {
        const computed = window.getComputedStyle(textarea);
        const lineHeight =
          parseFloat(computed.lineHeight) ||
          (parseFloat(computed.fontSize) || 14) * 1.4;
        const padding =
          (parseFloat(computed.paddingTop) || 0) +
          (parseFloat(computed.paddingBottom) || 0);
        const border =
          (parseFloat(computed.borderTopWidth) || 0) +
          (parseFloat(computed.borderBottomWidth) || 0);
        const borderBox = computed.boxSizing === "border-box";
        const inset = borderBox ? padding + border : 0;
        const minimum = minimumRows * lineHeight + inset;
        const maximum = maximumRows * lineHeight + inset;
        const scrollTop = textarea.scrollTop;
        // Consumer Tailwind builds use !important; the opt-in row bound must
        // override the default min-h utility without changing native defaults.
        textarea.style.setProperty("min-height", `${minimum}px`, "important");
        textarea.style.maxHeight = Number.isFinite(maximum)
          ? `${maximum}px`
          : "none";
        // Collapse the native rows-based height before measuring, otherwise
        // an empty textarea cannot shrink below its original rows value.
        textarea.style.height = "0px";
        const content = textarea.scrollHeight + (borderBox ? border : -padding);
        textarea.style.height = `${Math.min(maximum, Math.max(minimum, content))}px`;
        textarea.style.overflowY = content > maximum ? "auto" : "hidden";
        textarea.scrollTop = scrollTop;
      };
      measure();
      let mounted = true;
      const fonts = document.fonts;
      fonts?.ready.then(() => {
        if (mounted) measure();
      });
      fonts?.addEventListener("loadingdone", measure);
      window.addEventListener("resize", measure);
      let previousWidth = textarea.getBoundingClientRect().width;
      const observer =
        typeof ResizeObserver === "undefined"
          ? undefined
          : new ResizeObserver(() => {
              const width = textarea.getBoundingClientRect().width;
              if (width !== previousWidth) {
                previousWidth = width;
                measure();
              }
            });
      observer?.observe(textarea);
      return () => {
        mounted = false;
        fonts?.removeEventListener("loadingdone", measure);
        window.removeEventListener("resize", measure);
        observer?.disconnect();
        Object.assign(textarea.style, original);
        textarea.style.setProperty(
          "min-height",
          original.minHeight,
          originalMinHeightPriority
        );
      };
    }, [
      autoResize,
      currentValue,
      minRows,
      maxRows,
      rows,
      size,
      style,
      className,
    ]);

    // Derive state from props
    const invalid =
      props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const derivedState = error || invalid ? "error" : (state ?? "default");

    // Handle change for both controlled and uncontrolled — collapse duplicate spaces
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeSequence.current += 1;
      const nextValue = e.target.value;
      if (composing.current || (e.nativeEvent as InputEvent).isComposing) {
        setCompositionDraft(nextValue);
        if (!isControlled) setInternalValue(nextValue);
        onChange?.(e);
        return;
      }
      setCompositionDraft(null);
      const normalized = normalizeTextareaSpaces(nextValue);

      if (normalized !== nextValue) {
        const nextSelection: [number, number, "forward" | "backward" | "none"] =
          [
            getNormalizedSelectionOffset(nextValue, e.target.selectionStart),
            getNormalizedSelectionOffset(nextValue, e.target.selectionEnd),
            e.target.selectionDirection ?? "none",
          ];
        pendingSelectionRef.current = nextSelection;
        e.target.setSelectionRange(...nextSelection);
        requestAnimationFrame(restoreSelection);
      }

      if (!isControlled) {
        setInternalValue(normalized);
      }
      if (!onChange) return;
      if (normalized === e.target.value) {
        onChange(e);
        return;
      }
      onChange({
        ...e,
        target: { ...e.target, value: normalized },
        currentTarget: { ...e.currentTarget, value: normalized },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    };

    const charCount =
      displayCharCount !== undefined
        ? displayCharCount
        : countNonWhitespaceChars(String(currentValue));

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Reveal the message row only when it appears after the field did, never on first render
    // (a page of fields with helper text must not unfold on load).
    const hasMessage = Boolean(error || helperText || (showCount && maxLength));
    const reducedMotion = useReducedMotion() ?? false;
    const countMotion = useAnimationControls();
    const previousCount = React.useRef(charCount);
    React.useEffect(() => {
      if (charCount !== previousCount.current) {
        previousCount.current = charCount;
        void countMotion.start({
          opacity: reducedMotion ? 1 : [0.65, 1],
          y: reducedMotion ? 0 : [2, 0],
          transition: { duration: reducedMotion ? 0 : 0.16 },
        });
      }
    }, [charCount, reducedMotion, countMotion]);
    const copyMotion = {
      initial: reducedMotion
        ? (false as const)
        : { opacity: 0, y: "0.35em", filter: "blur(4px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: {
        duration: reducedMotion ? 0 : 0.24,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    };

    // Resize class map
    const resizeClasses: Record<string, string> = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <div
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] flex flex-col",
          wrapperClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "mb-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-primary,#484848)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={setTextareaRef}
          id={textareaId}
          rows={rows}
          className={cn(
            textareaVariants({ state: derivedState, size }),
            className,
            derivedState === "error" &&
              !disabled &&
              "border-semantic-error-primary focus:shadow-none",
            resizeClasses[resize]
          )}
          disabled={disabled}
          style={style}
          required={required}
          maxLength={enforceMaxLength !== false ? maxLength : undefined}
          value={currentValue}
          onChange={handleChange}
          onCompositionStart={(event) => {
            composing.current = true;
            pendingSelectionRef.current = null;
            onCompositionStart?.(event);
          }}
          onCompositionEnd={(event) => {
            composing.current = false;
            onCompositionEnd?.(event);
            const textarea = event.currentTarget;
            const raw = textarea.value;
            const normalized = normalizeTextareaSpaces(raw);
            const sequence = changeSequence.current;
            const selection: [number, number, "forward" | "backward" | "none"] =
              [
                getNormalizedSelectionOffset(raw, textarea.selectionStart),
                getNormalizedSelectionOffset(raw, textarea.selectionEnd),
                textarea.selectionDirection ?? "none",
              ];
            setCompositionDraft(null);
            if (!isControlled) {
              setInternalValue(normalized);
            }
            if (raw === normalized) return;
            queueMicrotask(() => {
              if (
                !textarea.isConnected ||
                textareaRef.current !== textarea ||
                composing.current ||
                changeSequence.current !== sequence ||
                (textarea.value !== raw && textarea.value !== normalized)
              )
                return;
              // A controlled render may already normalize the visible draft; set the tracked raw value
              // before the native setter so React also delivers the committed value to the consumer.
              textarea.value = raw;
              Object.getOwnPropertyDescriptor(
                HTMLTextAreaElement.prototype,
                "value"
              )?.set?.call(textarea, normalized);
              textarea.setSelectionRange(...selection);
              textarea.dispatchEvent(
                new InputEvent("input", {
                  bubbles: true,
                  inputType: "insertCompositionText",
                  data: event.data,
                  isComposing: false,
                })
              );
            });
          }}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />

        {/* Helper text / Error message / Character count */}
        <FieldFeedback
          active={hasMessage}
          className={cn(
            "grid items-start pt-2",
            showCount && maxLength
              ? "grid-cols-[minmax(0,1fr)_auto] gap-x-2"
              : "grid-cols-[minmax(0,1fr)]"
          )}
        >
          {error ? (
            errorIcon ? (
              <div
                id={errorId}
                role="alert"
                className="flex min-h-0 min-w-0 items-center gap-1.5 overflow-hidden"
              >
                <CircleAlert
                  className="size-3.5 shrink-0 text-semantic-error-text"
                  aria-hidden
                />
                <motion.span
                  {...copyMotion}
                  key={error}
                  className="text-xs leading-[1.4] tracking-[-0.16px] text-semantic-error-text"
                >
                  {error}
                </motion.span>
              </div>
            ) : (
              <motion.span
                {...copyMotion}
                key={"error:" + error}
                id={errorId}
                aria-live="polite"
                className="min-h-0 overflow-hidden break-words text-xs leading-[1.4] tracking-[-0.16px] text-semantic-error-text"
              >
                {error}
              </motion.span>
            )
          ) : helperText ? (
            <motion.span
              {...copyMotion}
              key={"helper:" + helperText}
              id={helperId}
              className="min-h-0 overflow-hidden break-words text-xs leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-muted,#707070)]"
            >
              {helperText}
            </motion.span>
          ) : (
            <span className="min-h-0 overflow-hidden" />
          )}
          {showCount && maxLength && (
            <motion.span
              initial={false}
              animate={countMotion}
              className={cn(
                "min-h-0 overflow-hidden text-xs tabular-nums leading-[1.4] tracking-[-0.16px] transition-colors [transition-duration:160ms] motion-reduce:transition-none",
                charCount > maxLength
                  ? "text-semantic-error-text"
                  : "text-[var(--v2-text-muted,#707070)]"
              )}
            >
              {charCount}/{maxLength}
            </motion.span>
          )}
        </FieldFeedback>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
