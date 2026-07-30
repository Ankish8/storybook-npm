import * as React from "react";
import { MessageSquare, Phone } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { AuthFormHeader, AuthFormMessage } from "./form-parts";
import { OtpInput } from "./otp-input";
import type { OtpChannel, OtpVerificationFormProps } from "./types";
import { useControllableValue } from "./use-controllable-value";

/**
 * OTP verification step, including the alternate-delivery-channel button and
 * the resend countdown.
 *
 * @example
 * ```tsx
 * <OtpVerificationForm
 *   maskedDestination="* * * * * 43210"
 *   otp={otp}
 *   onOtpChange={setOtp}
 *   otpError="Incorrect OTP. Try again."
 *   attemptsLeft={5}
 *   attemptsTotal={6}
 *   resendIn={30}
 * />
 * ```
 */
const OtpVerificationForm = React.forwardRef<
  HTMLFormElement,
  OtpVerificationFormProps
>(
  (
    {
      className,
      title = "OTP Verification",
      description,
      maskedDestination,
      validForMinutes = 10,
      otp,
      otpLength = 4,
      onOtpChange,
      onOtpComplete,
      autoFocusOtp = true,
      otpError,
      attemptsLeft,
      attemptsTotal,
      channel = "sms",
      onChannelSwitch,
      showChannelSwitch = true,
      resendIn = 0,
      onResend,
      onSubmit,
      onBack,
      loading = false,
      disabled,
      submitLabel = "Verify OTP",
      ...props
    },
    ref
  ) => {
    const [otpValue, setOtpValue] = useControllableValue(otp, "", onOtpChange);

    const isSubmitDisabled =
      disabled ?? (loading || otpValue.length < otpLength);

    const resolvedDescription =
      description ??
      `Enter the ${otpLength}-digit code sent to ${
        maskedDestination ?? "your mobile number"
      }. Valid for ${validForMinutes} minutes.`;

    // The button offers whichever channel the OTP was NOT delivered on.
    const alternateChannel: OtpChannel = channel === "call" ? "sms" : "call";
    const canResend = resendIn <= 0;

    return (
      <form
        ref={ref}
        noValidate
        className={cn("flex w-full flex-col gap-8", className)}
        onSubmit={onSubmit}
        {...props}
      >
        <AuthFormHeader
          title={title}
          description={resolvedDescription}
          onBack={onBack}
        />

        <div className="flex w-full flex-col items-center gap-3">
          <OtpInput
            value={otpValue}
            length={otpLength}
            hasError={Boolean(otpError)}
            disabled={loading}
            autoFocus={autoFocusOtp}
            onChange={setOtpValue}
            onComplete={onOtpComplete}
          />
          {otpError ? (
            <AuthFormMessage
              className="w-auto items-center justify-center"
              trailing={
                attemptsLeft != null
                  ? `${attemptsLeft}${
                      attemptsTotal != null ? ` of ${attemptsTotal}` : ""
                    } attempts left`
                  : undefined
              }
            >
              {otpError}
            </AuthFormMessage>
          ) : null}
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <Button
            type="submit"
            className="h-12 w-full disabled:bg-semantic-disabled-primary disabled:opacity-100"
            loading={loading}
            disabled={isSubmitDisabled}
          >
            {submitLabel}
          </Button>

          {showChannelSwitch ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full"
              disabled={loading}
              rightIcon={
                alternateChannel === "call" ? (
                  <Phone className="h-[18px] w-[18px]" />
                ) : (
                  <MessageSquare className="h-[18px] w-[18px]" />
                )
              }
              onClick={() => onChannelSwitch?.(alternateChannel)}
            >
              {alternateChannel === "call" ? "OTP via call" : "OTP via message"}
            </Button>
          ) : null}

          <div className="flex items-center justify-center gap-1">
            <p className="m-0 text-sm text-semantic-text-muted">
              Did not receive code?
            </p>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto min-w-0 p-0 text-sm"
              disabled={!canResend || loading}
              onClick={onResend}
            >
              Resend OTP
              {canResend ? null : (
                <span className="ml-1 font-normal">in {resendIn}s</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    );
  }
);
OtpVerificationForm.displayName = "OtpVerificationForm";

export { OtpVerificationForm };
