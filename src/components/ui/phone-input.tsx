import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const phoneInputContainerVariants = cva(
  "flex items-center border h-[42px] border-solid rounded transition-all",
  {
    variants: {
      state: {
        default:
          "border-semantic-border-input focus-within:outline-none focus-within:border-semantic-border-input-focus focus-within:ring-1 focus-within:ring-semantic-border-input-focus/15",
        empty:
          "border-semantic-border-input focus-within:outline-none focus-within:border-semantic-border-input-focus focus-within:ring-1 focus-within:ring-semantic-border-input-focus/15",
        error:
          "border-semantic-error-primary focus-within:outline-none focus-within:border-semantic-error-primary focus-within:ring-1 focus-within:ring-semantic-error-primary/15",
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
 * <PhoneInput countryFlag="🇺🇸" countryCode="+1" />
 * <PhoneInput phoneMaxNumber={10} />
 * <PhoneInput state="empty" />
 * <PhoneInput validation="Enter a valid phone number" />
 * <PhoneInput onCountryClick={() => openCountryPicker()} />
 * ```
 */
export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof phoneInputContainerVariants> {
  /** Visual validation state of the phone input */
  state?: "default" | "empty" | "error";
  /** Validation message displayed below the input. Also applies error styling. */
  validation?: string;
  /** Country flag emoji (e.g., "🇮🇳", "🇺🇸"). Defaults to "🇮🇳" */
  countryFlag?: string;
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
      countryFlag = "🇮🇳",
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
          disabled && "opacity-60 bg-semantic-bg-ui cursor-not-allowed",
          wrapperClassName
        )}
      >
        <div
          className={cn(
            "flex h-full items-center gap-1.5 pl-3 pr-2 shrink-0",
            onCountryClick && "cursor-pointer"
          )}
          onClick={onCountryClick}
          data-testid="phone-input-country"
        >
          <span className="text-base">{countryFlag}</span>
          <span className="text-base text-semantic-text-secondary">
            {countryCode}
          </span>
          {showChevron && (
            <ChevronDown className="size-3 text-semantic-text-muted" />
          )}
        </div>
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
            "flex-1 h-full px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-placeholder outline-none bg-transparent disabled:cursor-not-allowed",
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
        <p id={validationId} className="m-0 text-sm text-semantic-error-primary">
          {validation}
        </p>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput, phoneInputContainerVariants };
