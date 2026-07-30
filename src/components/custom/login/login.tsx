import * as React from "react";

import { AuthLayout } from "./auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { OtpVerificationForm } from "./otp-verification-form";
import { ResetPasswordForm } from "./reset-password-form";
import type { LoginProps } from "./types";

/**
 * Full MyOperator authentication flow: the two-pane shell plus the step-specific
 * form selected by `step`.
 *
 * The component is fully controlled — it owns no field state, performs no network
 * calls, and never advances `step` on its own. The host decides what happens on
 * every callback.
 *
 * @example
 * ```tsx
 * <Login
 *   step="login"
 *   logoSrc="/myoperator.svg"
 *   illustration={<img src="/hero.png" alt="" className="w-full" />}
 *   mobileNumber={mobile}
 *   onMobileNumberChange={setMobile}
 *   password={password}
 *   onPasswordChange={setPassword}
 *   onSubmit={handleLogin}
 *   onForgotPassword={() => setStep("forgot-password")}
 * />
 * ```
 */
const Login = React.forwardRef<HTMLDivElement, LoginProps>(
  (
    {
      step = "login",
      title,
      description,
      submitLabel,
      onSubmit,
      onBack,
      formClassName,

      // Mobile number field
      mobileNumber,
      onMobileNumberChange,
      countryCode,
      countryIso,
      onCountryClick,
      mobileMaxLength,
      mobileError,

      // Password field
      password,
      onPasswordChange,
      passwordMinLength,
      passwordMaxLength,
      passwordError,
      showPassword,
      onTogglePassword,

      // Login-specific
      rememberMe,
      onRememberMeChange,
      showRememberMe,
      formError,
      attemptsLeft,
      onForgotPassword,
      onCreateAccount,
      showCreateAccount,

      // OTP-specific
      maskedDestination,
      validForMinutes,
      otp,
      otpLength,
      onOtpChange,
      onOtpComplete,
      autoFocusOtp,
      otpError,
      attemptsTotal,
      channel,
      onChannelSwitch,
      showChannelSwitch,
      resendIn,
      onResend,

      loading,
      disabled,
      ...layoutProps
    },
    ref
  ) => {
    let form: React.ReactNode;

    if (step === "forgot-password") {
      form = (
        <ForgotPasswordForm
          className={formClassName}
          title={title}
          description={description}
          submitLabel={submitLabel}
          mobileNumber={mobileNumber}
          onMobileNumberChange={onMobileNumberChange}
          countryCode={countryCode}
          countryIso={countryIso}
          onCountryClick={onCountryClick}
          mobileMaxLength={mobileMaxLength}
          mobileError={mobileError}
          onSubmit={onSubmit}
          onBack={onBack}
          loading={loading}
          disabled={disabled}
        />
      );
    } else if (step === "otp") {
      form = (
        <OtpVerificationForm
          className={formClassName}
          title={title}
          description={description}
          submitLabel={submitLabel}
          maskedDestination={maskedDestination}
          validForMinutes={validForMinutes}
          otp={otp}
          otpLength={otpLength}
          onOtpChange={onOtpChange}
          onOtpComplete={onOtpComplete}
          autoFocusOtp={autoFocusOtp}
          otpError={otpError}
          attemptsLeft={attemptsLeft}
          attemptsTotal={attemptsTotal}
          channel={channel}
          onChannelSwitch={onChannelSwitch}
          showChannelSwitch={showChannelSwitch}
          resendIn={resendIn}
          onResend={onResend}
          onSubmit={onSubmit}
          onBack={onBack}
          loading={loading}
          disabled={disabled}
        />
      );
    } else if (step === "reset-password") {
      form = (
        <ResetPasswordForm
          className={formClassName}
          title={title}
          description={description}
          submitLabel={submitLabel}
          password={password}
          onPasswordChange={onPasswordChange}
          passwordError={passwordError}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          onSubmit={onSubmit}
          onBack={onBack}
          loading={loading}
          disabled={disabled}
        />
      );
    } else {
      form = (
        <LoginForm
          className={formClassName}
          title={title}
          description={description}
          submitLabel={submitLabel}
          mobileNumber={mobileNumber}
          onMobileNumberChange={onMobileNumberChange}
          countryCode={countryCode}
          countryIso={countryIso}
          onCountryClick={onCountryClick}
          mobileMaxLength={mobileMaxLength}
          mobileError={mobileError}
          password={password}
          onPasswordChange={onPasswordChange}
          passwordMinLength={passwordMinLength}
          passwordMaxLength={passwordMaxLength}
          passwordError={passwordError}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          rememberMe={rememberMe}
          onRememberMeChange={onRememberMeChange}
          showRememberMe={showRememberMe}
          formError={formError}
          attemptsLeft={attemptsLeft}
          onSubmit={onSubmit}
          onForgotPassword={onForgotPassword}
          onCreateAccount={onCreateAccount}
          showCreateAccount={showCreateAccount}
          loading={loading}
          disabled={disabled}
        />
      );
    }

    return (
      <AuthLayout ref={ref} {...layoutProps}>
        {form}
      </AuthLayout>
    );
  }
);
Login.displayName = "Login";

export { Login };
