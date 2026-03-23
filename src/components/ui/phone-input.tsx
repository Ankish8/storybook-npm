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
      ...props
    }: PhoneInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div
        className={cn(
          "flex items-center border border-semantic-border-layout rounded-lg focus-within:border-semantic-border-focus transition-colors",
          disabled && "opacity-60",
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
          className={cn(
            "flex-1 h-10 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
