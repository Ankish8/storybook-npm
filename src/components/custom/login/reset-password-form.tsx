import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { AuthFormHeader } from "./form-parts";
import type { ResetPasswordFormProps } from "./types";
import { useControllableValue } from "./use-controllable-value";

/**
 * Final step of the recovery flow: set a new password.
 *
 * @example
 * ```tsx
 * <ResetPasswordForm
 *   password={password}
 *   onPasswordChange={setPassword}
 *   showPassword={visible}
 *   onTogglePassword={() => setVisible((v) => !v)}
 *   onSubmit={submitNewPassword}
 * />
 * ```
 */
const ResetPasswordForm = React.forwardRef<
  HTMLFormElement,
  ResetPasswordFormProps
>(
  (
    {
      className,
      title = "Reset Password",
      description = "Password must be of 6-20 alphanumeric characters.",
      password,
      onPasswordChange,
      passwordError,
      showPassword,
      onTogglePassword,
      passwordLabel = "New Password",
      passwordPlaceholder = "Enter new password",
      minLength = 6,
      maxLength = 20,
      onSubmit,
      onBack,
      loading = false,
      disabled,
      submitLabel = "Reset Password",
      ...props
    },
    ref
  ) => {
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

    const isSubmitDisabled = disabled ?? (loading || !passwordValue);

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
          <TextField
            label={passwordLabel}
            placeholder={passwordPlaceholder}
            type={isPasswordVisible ? "text" : "password"}
            value={passwordValue}
            minLength={minLength}
            maxLength={maxLength}
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
ResetPasswordForm.displayName = "ResetPasswordForm";

export { ResetPasswordForm };
