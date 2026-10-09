import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

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

const phoneInputContainerVariants = cva(
  "font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal flex items-center border h-11 border-solid rounded-lg bg-semantic-bg-primary transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms]",
  {
    variants: {
      state: {
        default:
          "border-semantic-border-input hover:border-semantic-primary focus-within:outline-none focus-within:shadow-none",
        empty:
          "border-semantic-border-input hover:border-semantic-primary focus-within:outline-none focus-within:shadow-none",
        error:
          "border-semantic-error-primary focus-within:outline-none focus-within:shadow-none",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * A phone number input with a country code prefix area.
 *
 * @example
 * ```tsx
 * <PhoneInput placeholder="Enter phone number" />
 * <PhoneInput countryIso="US" countryCode="+1" />
 * <PhoneInput phoneMaxNumber={10} />
 * <PhoneInput state="empty" />
 * <PhoneInput validation="Enter a valid phone number" />
 * <PhoneInput onCountryClick={() => openCountryPicker()} />
 * ```
 */
export interface PhoneInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof phoneInputContainerVariants> {
  /** Visual validation state of the phone input */
  state?: "default" | "empty" | "error";
  /** Validation message displayed below the input. Also applies error styling. */
  validation?: string;
  /** ISO 3166-1 alpha-2 country code used to render the SVG flag (e.g., "IN", "US"). Defaults to "IN" */
  countryIso?: string;
  /** Custom flag node rendered instead of the SVG flag (e.g., an emoji or custom icon) */
  countryFlag?: React.ReactNode;
  /** Country dial code (e.g., "+91", "+1"). Defaults to "+91" */
  countryCode?: string;
  /** Whether to show the chevron dropdown indicator. Defaults to true */
  showChevron?: boolean;
  /** Handler called when the country code area is clicked */
  onCountryClick?: () => void;
  /** Additional className for the outer wrapper */
  wrapperClassName?: string;
  /** Maximum number of digits allowed in the phone number */
  phoneMaxNumber?: number;
}

const PhoneInput = React.forwardRef(
  (
    {
      className,
      state,
      validation,
      countryIso = "IN",
      countryFlag,
      countryCode = "+91",
      showChevron = true,
      onCountryClick,
      wrapperClassName,
      disabled,
      inputMode = "numeric",
      pattern = "[0-9]*",
      onBeforeInput,
      onChange,
      onKeyDown,
      maxLength,
      phoneMaxNumber,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    }: PhoneInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const effectiveMaxLength = phoneMaxNumber ?? maxLength;
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const validationId = `${inputId}-validation`;
    const derivedState = validation ? "error" : (state ?? "default");
    const describedBy = [ariaDescribedBy, validation ? validationId : undefined]
      .filter(Boolean)
      .join(" ");
    const CountryArea = onCountryClick ? "button" : "div";

    // Reveal the message only when it appears after the field did, never on first render.
    const hasMessage = Boolean(validation);
    const reducedMotion = useReducedMotion() ?? false;
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1
      ) {
        return;
      }

      if (/\D/.test(event.key)) {
        event.preventDefault();
      }
    };

    const handleBeforeInput: NonNullable<
      React.DOMAttributes<HTMLInputElement>["onBeforeInput"]
    > = (event) => {
      onBeforeInput?.(event);
      if (event.defaultPrevented) return;

      const inputEvent = event.nativeEvent as InputEvent;
      if (inputEvent.data && /\D/.test(inputEvent.data)) {
        event.preventDefault();
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const digitsOnlyValue = event.currentTarget.value.replace(/\D/g, "");
      const sanitizedValue =
        effectiveMaxLength != null
          ? digitsOnlyValue.slice(0, effectiveMaxLength)
          : digitsOnlyValue;

      if (event.currentTarget.value !== sanitizedValue) {
        event.currentTarget.value = sanitizedValue;
      }

      onChange?.(event);
    };

    const phoneInput = (
      <div
        className={cn(
          phoneInputContainerVariants({
            state: derivedState,
          }),
          disabled &&
            "bg-semantic-bg-ui opacity-50 shadow-none hover:border-semantic-border-input focus-within:shadow-none cursor-not-allowed",
          wrapperClassName
        )}
      >
        <CountryArea
          {...(onCountryClick
            ? {
                type: "button" as const,
                disabled,
                "aria-label": `Select country (${countryIso} ${countryCode})`,
              }
            : {})}
          className={cn(
            "flex h-full items-center gap-1.5 pl-3 pr-3 shrink-0",
            // Arc's trigger sits 3px inside the shell and fills on hover (same quiet fill as a keyboard-focused row).
            onCountryClick &&
              "my-[3px] ml-[3px] h-[calc(100%-6px)] rounded-[10px] border-0 bg-transparent pl-[9px] text-left font-normal outline-none cursor-pointer transition-[background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] [@media(hover:hover)]:enabled:hover:bg-semantic-bg-ui active:enabled:bg-semantic-bg-ui focus-visible:bg-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:2px] focus-visible:-outline-offset-4 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
          )}
          onClick={onCountryClick}
          data-testid="phone-input-country"
        >
          {countryFlag ?? (
            <ReactCountryFlag
              svg
              countryCode={countryIso}
              className="!w-5 !h-[15px] object-cover shrink-0"
              title={countryIso}
              aria-label={countryIso}
            />
          )}
          <span className="text-sm font-medium tabular-nums tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)]">
            {countryCode}
          </span>
          {showChevron && (
            <ChevronDown className="ml-0.5 size-4 text-[var(--v2-text-muted,#707070)]" />
          )}
        </CountryArea>
        <div className="w-px h-[22px] bg-semantic-border-layout shrink-0" />
        <input
          type="tel"
          id={inputId}
          ref={ref}
          disabled={disabled}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={effectiveMaxLength}
          aria-invalid={ariaInvalid ?? derivedState === "error"}
          aria-describedby={describedBy || undefined}
          className={cn(
            "min-w-0 flex-1 h-full pl-3 pr-3 text-sm leading-[1.4] tabular-nums tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          onBeforeInput={handleBeforeInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );

    return (
      <div className="flex flex-col">
        {phoneInput}
        <FieldFeedback active={hasMessage} className="grid pt-2">
          {validation && (
            <motion.p
              {...copyMotion}
              key={validation}
              id={validationId}
              aria-live="polite"
              className="m-0 min-h-0 overflow-hidden break-words text-xs leading-[1.4] tracking-[-0.16px] text-semantic-error-text"
            >
              {validation}
            </motion.p>
          )}
        </FieldFeedback>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput, phoneInputContainerVariants };
