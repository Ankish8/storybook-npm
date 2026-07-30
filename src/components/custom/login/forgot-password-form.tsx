import * as React from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { PhoneInput } from "../../ui/phone-input";
import { AuthFieldLabel, AuthFormHeader } from "./form-parts";
import type { ForgotPasswordFormProps } from "./types";
import { useControllableValue } from "./use-controllable-value";

/**
 * Step that collects a mobile number to send a password-reset OTP to.
 *
 * @example
 * ```tsx
 * <ForgotPasswordForm
 *   mobileNumber={mobile}
 *   onMobileNumberChange={setMobile}
 *   mobileError="Please enter a valid mobile number."
 *   onSubmit={requestOtp}
 * />
 * ```
 */
const ForgotPasswordForm = React.forwardRef<
  HTMLFormElement,
  ForgotPasswordFormProps
>(
  (
    {
      className,
      title = "Forgot Password",
      description = "Enter mobile number to receive OTP",
      mobileNumber,
      onMobileNumberChange,
      countryCode = "+91",
      countryIso = "IN",
      onCountryClick,
      mobileMaxLength = 10,
      mobileError,
      onSubmit,
      onBack,
      loading = false,
      disabled,
      submitLabel = "Get OTP",
      ...props
    },
    ref
  ) => {
    const [mobileValue, setMobileValue] = useControllableValue(
      mobileNumber,
      "",
      onMobileNumberChange
    );

    const isSubmitDisabled = disabled ?? (loading || !mobileValue);

    return (
      <form
        ref={ref}
        noValidate
        className={cn("flex w-full flex-col gap-6", className)}
        onSubmit={onSubmit}
        {...props}
      >
        <AuthFormHeader
          title={title}
          description={description}
          onBack={onBack}
        />

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-0.5">
            <AuthFieldLabel htmlFor="forgot-password-mobile-number" required>
              Mobile Number
            </AuthFieldLabel>
            <PhoneInput
              id="forgot-password-mobile-number"
              placeholder="Enter mobile number"
              value={mobileValue}
              countryCode={countryCode}
              countryIso={countryIso}
              onCountryClick={onCountryClick}
              phoneMaxNumber={mobileMaxLength}
              state={mobileError ? "error" : "default"}
              validation={mobileError}
              disabled={loading}
              onChange={(event) => setMobileValue(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full disabled:bg-semantic-disabled-primary disabled:opacity-100"
            loading={loading}
            disabled={isSubmitDisabled}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    );
  }
);
ForgotPasswordForm.displayName = "ForgotPasswordForm";

export { ForgotPasswordForm };
