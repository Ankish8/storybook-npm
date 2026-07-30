import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { PhoneInput } from "../../ui/phone-input";
import { TextField } from "../../ui/text-field";
import {
  AuthFieldLabel,
  AuthFormHeader,
  AuthFormMessage,
} from "./form-parts";
import type { LoginFormProps } from "./types";
import { useControllableValue } from "./use-controllable-value";

/**
 * Mobile number + password login step.
 *
 * @example
 * ```tsx
 * <LoginForm
 *   mobileNumber={mobile}
 *   onMobileNumberChange={setMobile}
 *   password={password}
 *   onPasswordChange={setPassword}
 *   onSubmit={handleLogin}
 * />
 * ```
 */
const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  (
    {
      className,
      title = "Login",
      description = "Enter the details below to continue",
      mobileNumber,
      onMobileNumberChange,
      countryCode = "+91",
      countryIso = "IN",
      onCountryClick,
      mobileMaxLength = 10,
      mobileError,
      password,
      onPasswordChange,
      passwordMinLength = 6,
      passwordMaxLength = 20,
      passwordError,
      showPassword,
      onTogglePassword,
      rememberMe,
      onRememberMeChange,
      showRememberMe = true,
      formError,
      attemptsLeft,
      onSubmit,
      onForgotPassword,
      onCreateAccount,
      showCreateAccount = true,
      loading = false,
      disabled,
      submitLabel = "Login",
      ...props
    },
    ref
  ) => {
    const [mobileValue, setMobileValue] = useControllableValue(
      mobileNumber,
      "",
      onMobileNumberChange
    );
    const [passwordValue, setPasswordValue] = useControllableValue(
      password,
      "",
      onPasswordChange
    );

    const [isPasswordVisible, setPasswordVisible] = useControllableValue(
      showPassword,
      false,
      onTogglePassword
    );
    const [isRemembered, setRemembered] = useControllableValue(
      rememberMe,
      false,
      onRememberMeChange
    );

    // `passwordMinLength` is enforced here rather than left to the browser: the
    // form is `noValidate`, so the input's `minLength` attribute never blocks a
    // submit on its own.
    const isSubmitDisabled =
      disabled ??
      (loading ||
        !mobileValue ||
        !passwordValue ||
        passwordValue.length < passwordMinLength);

    return (
      <form
        ref={ref}
        noValidate
        className={cn("flex w-full flex-col gap-6", className)}
        onSubmit={onSubmit}
        {...props}
      >
        <AuthFormHeader title={title} description={description} />

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-0.5">
            <AuthFieldLabel htmlFor="login-mobile-number" required>
              Mobile Number
            </AuthFieldLabel>
            <PhoneInput
              id="login-mobile-number"
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

          <div className="flex w-full flex-col gap-1.5">
            <TextField
              label="Password"
              placeholder="Enter password"
              type={isPasswordVisible ? "text" : "password"}
              value={passwordValue}
              minLength={passwordMinLength}
              maxLength={passwordMaxLength}
              state={passwordError ? "error" : "default"}
              error={passwordError}
              disabled={loading}
              onChange={(event) => setPasswordValue(event.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!isPasswordVisible)}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  className="flex items-center text-semantic-text-muted transition-colors hover:text-semantic-text-primary"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              }
            />
            {/* Part of the design, so it always renders — `onForgotPassword` is
                optional notification, not a precondition for showing it. */}
            <Button
              type="button"
              variant="link"
              size="sm"
              disabled={loading}
              className="ml-auto h-auto min-w-0 p-0 text-sm font-semibold leading-5 tracking-[0.014px]"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </Button>
          </div>

          {showRememberMe ? (
            <Checkbox
              label="Remember me"
              checked={isRemembered}
              disabled={loading}
              checkboxClassName="size-3.5 rounded border [&_svg]:size-2 [&_svg]:stroke-[2.5]"
              labelClassName="text-xs font-normal text-semantic-text-primary"
              onCheckedChange={(checked) => setRemembered(checked === true)}
            />
          ) : null}

          {formError ? (
            <AuthFormMessage
              trailing={
                attemptsLeft != null
                  ? `${attemptsLeft} more attempts left.`
                  : undefined
              }
            >
              {formError}
            </AuthFormMessage>
          ) : null}

          <div className="flex w-full flex-col gap-4">
            <Button
              type="submit"
              className="h-12 w-full disabled:bg-semantic-disabled-primary disabled:opacity-100"
              loading={loading}
              disabled={isSubmitDisabled}
            >
              {submitLabel}
            </Button>
            {showCreateAccount ? (
              <Button
                type="button"
                variant="outline"
                // Figma's border/border-outline is #C0C3CA — darker than the
                // outline variant's default border-semantic-border-layout.
                className="h-12 w-full border-[var(--color-primary-100)]"
                disabled={loading}
                onClick={onCreateAccount}
              >
                Create an Account
              </Button>
            ) : null}
          </div>
        </div>
      </form>
    );
  }
);
LoginForm.displayName = "LoginForm";

export { LoginForm };
