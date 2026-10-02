import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

import { cn } from "@/lib/utils";

const phoneInputContainerVariants = cva(
  "font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal flex items-center border h-12 border-solid rounded-lg bg-semantic-bg-primary transition-[border-color,box-shadow,background-color] duration-150",
  {
    variants: {
      state: {
        default:
          "border-semantic-border-input hover:border-[var(--color-primary-100,#C0C3CA)] focus-within:outline-none focus-within:border-semantic-border-accent focus-within:shadow-[0_0_4px_0_rgba(39,171,184,0.4)]",
        empty:
          "border-semantic-border-input hover:border-[var(--color-primary-100,#C0C3CA)] focus-within:outline-none focus-within:border-semantic-border-accent focus-within:shadow-[0_0_4px_0_rgba(39,171,184,0.4)]",
        error:
          "border-semantic-error-primary shadow-[0_0_4px_0_rgba(240,68,56,0.4)] focus-within:outline-none focus-within:border-semantic-error-primary focus-within:shadow-[0_0_4px_0_rgba(240,68,56,0.4)]",
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
            "bg-semantic-bg-ui border-semantic-border-layout shadow-none hover:border-semantic-border-layout focus-within:border-semantic-border-layout focus-within:shadow-none cursor-not-allowed",
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
            "flex h-full items-center gap-1.5 pl-2.5 pr-2 shrink-0",
            onCountryClick &&
              "border-0 bg-transparent text-left font-normal outline-none cursor-pointer disabled:cursor-not-allowed"
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
          <span className="text-base text-[var(--v2-text-secondary,#5E5E5E)]">
            {countryCode}
          </span>
          {showChevron && (
            <ChevronDown className="size-3 text-[var(--v2-text-muted,#707070)]" />
          )}
        </CountryArea>
        <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
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
            "min-w-0 flex-1 h-full pl-2 pr-4 text-base text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          onBeforeInput={handleBeforeInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );

    if (!validation) {
      return phoneInput;
    }

    return (
      <div className="flex flex-col gap-1.5">
        {phoneInput}
        <p id={validationId} className="m-0 text-xs text-semantic-error-text">
          {validation}
        </p>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput, phoneInputContainerVariants };
