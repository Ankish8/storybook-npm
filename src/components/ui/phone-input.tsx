import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A phone number input with a country code prefix area.
 *
 * @example
 * ```tsx
 * <PhoneInput placeholder="Enter phone number" />
 * <PhoneInput countryFlag="🇺🇸" countryCode="+1" />
 * <PhoneInput phoneMaxNumber={10} />
 * <PhoneInput onCountryClick={() => openCountryPicker()} />
 * ```
 */
export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
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
      ...props
    }: PhoneInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const effectiveMaxLength = phoneMaxNumber ?? maxLength;

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

    const handleBeforeInput = (
      event: React.FormEvent<HTMLInputElement>
    ) => {
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

    return (
      <div
        className={cn(
          "flex items-center border border-solid border-semantic-border-input rounded focus-within:outline-none focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] transition-all",
          disabled && "opacity-60 bg-semantic-bg-ui cursor-not-allowed",
          wrapperClassName
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 pl-3 pr-2 h-10 shrink-0",
            onCountryClick && "cursor-pointer"
          )}
          onClick={onCountryClick}
          data-testid="phone-input-country"
        >
          <span className="text-sm">{countryFlag}</span>
          <span className="text-sm text-semantic-text-secondary">
            {countryCode}
          </span>
          {showChevron && (
            <ChevronDown className="size-3 text-semantic-text-muted" />
          )}
        </div>
        <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
        <input
          type="tel"
          ref={ref}
          disabled={disabled}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={effectiveMaxLength}
          className={cn(
            "flex-1 h-10 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          onBeforeInput={handleBeforeInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
