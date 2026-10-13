import * as React from "react";
import type { OtpInputProps } from "../../../../src/components/custom/login/types";
import { OtpInput as CurrentOtpInput } from "../../../../src/components/ui/v2/otp-input";

/** Documentation-only adapter: the legacy Login OTP and v2 OTP have different APIs. */
export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    { onChange, hasError, ariaLabel, length = 4, autoFocus = true, ...props },
    ref
  ) => (
    <CurrentOtpInput
      {...props}
      ref={ref}
      length={length === 6 ? 6 : 4}
      onValueChange={onChange}
      error={hasError}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
    />
  )
);
OtpInput.displayName = "LegacyOtpComparisonAdapter";
