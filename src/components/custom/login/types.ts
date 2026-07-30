import * as React from "react";

/** The step of the authentication flow currently being displayed. */
export type LoginStep =
  | "login"
  | "forgot-password"
  | "otp"
  | "reset-password";

/** Delivery channel used to send the OTP. */
export type OtpChannel = "sms" | "call";

/**
 * Shared props for the two-pane authentication shell (logo, form card, marketing panel).
 */
export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL for the product logo shown at the top-left */
  logoSrc?: string;
  /** Alt text for the logo image. Defaults to "MyOperator" */
  logoAlt?: string;
  /** Custom node rendered instead of the logo image */
  logo?: React.ReactNode;
  /** Illustration rendered in the marketing panel (image element, SVG, or any node). Overrides `illustrationSrc`. */
  illustration?: React.ReactNode;
  /**
   * Source URL for the marketing illustration. Defaults to the bundled MyOperator
   * artwork; pass your own URL to serve it from a CDN, or `null` to render none.
   */
  illustrationSrc?: string | null;
  /** Alt text for the illustration. Defaults to "" so it is treated as decorative. */
  illustrationAlt?: string;
  /** Headline shown under the illustration */
  marketingTitle?: string;
  /** Supporting copy shown under the headline */
  marketingDescription?: string;
  /** Hides the right-hand marketing panel when true. Defaults to false */
  hideMarketingPanel?: boolean;
  /** The form card content */
  children?: React.ReactNode;
  /** Additional class for the form card */
  cardClassName?: string;
  /** Additional class for the marketing panel */
  marketingPanelClassName?: string;
}

/**
 * Props for the OTP digit input.
 */
export interface OtpInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** Current OTP value. Controlled. */
  value?: string;
  /** Number of digit boxes. Defaults to 4 */
  length?: number;
  /** Fired with the full OTP string whenever a digit changes */
  onChange?: (value: string) => void;
  /** Fired once the OTP reaches `length` digits */
  onComplete?: (value: string) => void;
  /** Shows error styling on every box when true */
  hasError?: boolean;
  /** Disables all boxes */
  disabled?: boolean;
  /** Focuses the first empty box on mount. Defaults to true */
  autoFocus?: boolean;
  /** Accessible label for the OTP group. Defaults to "One-time password" */
  ariaLabel?: string;
}

/**
 * Props for the mobile-number + password login step.
 */
export interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {
  /** Card heading. Defaults to "Login" */
  title?: string;
  /** Card sub-heading. Defaults to "Enter the details below to continue" */
  description?: string;
  /** Mobile number value. Controlled. */
  mobileNumber?: string;
  /** Fired when the mobile number changes */
  onMobileNumberChange?: (value: string) => void;
  /** Country dial code shown in the phone input. Defaults to "+91" */
  countryCode?: string;
  /** ISO 3166-1 alpha-2 country code for the flag. Defaults to "IN" */
  countryIso?: string;
  /** Fired when the country code area is clicked */
  onCountryClick?: () => void;
  /** Maximum digits allowed in the mobile number. Defaults to 10 */
  mobileMaxLength?: number;
  /** Validation message shown under the mobile number field */
  mobileError?: string;
  /** Password value. Controlled. */
  password?: string;
  /** Fired when the password changes */
  onPasswordChange?: (value: string) => void;
  /**
   * Minimum password characters required before the submit button enables.
   * Defaults to 6. Pass 0 to accept any non-empty password.
   */
  passwordMinLength?: number;
  /** Maximum password characters the field accepts. Defaults to 20 */
  passwordMaxLength?: number;
  /** Validation message shown under the password field */
  passwordError?: string;
  /** Whether the password is rendered in plain text */
  showPassword?: boolean;
  /** Fired when the password visibility toggle is clicked */
  onTogglePassword?: () => void;
  /** Whether "Remember me" is checked */
  rememberMe?: boolean;
  /** Fired when "Remember me" is toggled */
  onRememberMeChange?: (checked: boolean) => void;
  /** Hides the "Remember me" checkbox when false. Defaults to true */
  showRememberMe?: boolean;
  /** Form-level error, e.g. "Login attempt failed…" */
  formError?: React.ReactNode;
  /** Number of login attempts remaining. Appended to `formError` when set. */
  attemptsLeft?: number;
  /** Fired when the login button is pressed (or the form is submitted) */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Fired when "Forgot Password?" is pressed */
  onForgotPassword?: () => void;
  /** Fired when "Create an Account" is pressed */
  onCreateAccount?: () => void;
  /** Hides the "Create an Account" button when false. Defaults to true */
  showCreateAccount?: boolean;
  /** Shows a spinner and disables the submit button */
  loading?: boolean;
  /** Disables the submit button regardless of field contents */
  disabled?: boolean;
  /** Label for the submit button. Defaults to "Login" */
  submitLabel?: string;
}

/**
 * Props for the "enter your mobile number to receive an OTP" step.
 */
export interface ForgotPasswordFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  /** Card heading. Defaults to "Forgot Password" */
  title?: string;
  /** Card sub-heading. Defaults to "Enter mobile number to receive OTP" */
  description?: string;
  /** Mobile number value. Controlled. */
  mobileNumber?: string;
  /** Fired when the mobile number changes */
  onMobileNumberChange?: (value: string) => void;
  /** Country dial code. Defaults to "+91" */
  countryCode?: string;
  /** ISO 3166-1 alpha-2 country code for the flag. Defaults to "IN" */
  countryIso?: string;
  /** Fired when the country code area is clicked */
  onCountryClick?: () => void;
  /** Maximum digits allowed. Defaults to 10 */
  mobileMaxLength?: number;
  /** Validation message shown under the field */
  mobileError?: string;
  /** Fired when "Get OTP" is pressed (or the form is submitted) */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Fired when the back affordance is pressed. Hidden when omitted. */
  onBack?: () => void;
  /** Shows a spinner and disables the submit button */
  loading?: boolean;
  /** Disables the submit button regardless of field contents */
  disabled?: boolean;
  /** Label for the submit button. Defaults to "Get OTP" */
  submitLabel?: string;
}

/**
 * Props for the OTP verification step.
 */
export interface OtpVerificationFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onChange"> {
  /** Card heading. Defaults to "OTP Verification" */
  title?: string;
  /** Full sub-heading. Overrides the generated "Enter the N-digit code sent to …" copy. */
  description?: string;
  /** Masked destination shown in the generated description, e.g. "* * * * * 43210" */
  maskedDestination?: string;
  /** Validity window in minutes shown in the generated description. Defaults to 10 */
  validForMinutes?: number;
  /** OTP value. Controlled. */
  otp?: string;
  /** Number of OTP digits. Defaults to 4 */
  otpLength?: number;
  /** Fired when the OTP changes */
  onOtpChange?: (value: string) => void;
  /** Fired once every digit is filled */
  onOtpComplete?: (value: string) => void;
  /**
   * Focuses the first empty OTP box on mount. Defaults to true. Focusing never
   * scrolls the page, but set this to false to leave focus where the user put it.
   */
  autoFocusOtp?: boolean;
  /** Validation message shown under the OTP boxes */
  otpError?: string;
  /** Number of verification attempts remaining, rendered beside `otpError` */
  attemptsLeft?: number;
  /** Total verification attempts allowed, rendered beside `otpError` */
  attemptsTotal?: number;
  /** Channel the OTP was delivered on. Controls the alternate-channel button. Defaults to "sms" */
  channel?: OtpChannel;
  /** Fired when the alternate-channel button is pressed */
  onChannelSwitch?: (channel: OtpChannel) => void;
  /** Hides the alternate-channel button when false. Defaults to true */
  showChannelSwitch?: boolean;
  /** Seconds remaining before "Resend OTP" becomes actionable. 0 enables it. */
  resendIn?: number;
  /** Fired when "Resend OTP" is pressed */
  onResend?: () => void;
  /** Fired when "Verify OTP" is pressed (or the form is submitted) */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Fired when the back affordance is pressed. Hidden when omitted. */
  onBack?: () => void;
  /** Shows a spinner and disables the submit button */
  loading?: boolean;
  /** Disables the submit button regardless of OTP contents */
  disabled?: boolean;
  /** Label for the submit button. Defaults to "Verify OTP" */
  submitLabel?: string;
}

/**
 * Props for the set-a-new-password step.
 */
export interface ResetPasswordFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  /** Card heading. Defaults to "Reset Password" */
  title?: string;
  /** Card sub-heading. Defaults to "Password must be of 6-20 alphanumeric characters." */
  description?: string;
  /** Password value. Controlled. */
  password?: string;
  /** Fired when the password changes */
  onPasswordChange?: (value: string) => void;
  /** Validation message shown under the field */
  passwordError?: string;
  /** Whether the password is rendered in plain text */
  showPassword?: boolean;
  /** Fired when the visibility toggle is clicked */
  onTogglePassword?: () => void;
  /** Label for the password field. Defaults to "New Password" */
  passwordLabel?: string;
  /** Placeholder for the password field. Defaults to "Enter new password" */
  passwordPlaceholder?: string;
  /** Minimum password length enforced on the input. Defaults to 6 */
  minLength?: number;
  /** Maximum password length enforced on the input. Defaults to 20 */
  maxLength?: number;
  /** Fired when "Reset Password" is pressed (or the form is submitted) */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Fired when the back affordance is pressed. Hidden when omitted. */
  onBack?: () => void;
  /** Shows a spinner and disables the submit button */
  loading?: boolean;
  /** Disables the submit button regardless of field contents */
  disabled?: boolean;
  /** Label for the submit button. Defaults to "Reset Password" */
  submitLabel?: string;
}

/**
 * Props for the full authentication flow. Combines the layout shell with the
 * step-specific form selected by `step`.
 */
export interface LoginProps
  extends Omit<AuthLayoutProps, "children" | "onSubmit">,
    Pick<
      LoginFormProps,
      | "mobileNumber"
      | "onMobileNumberChange"
      | "countryCode"
      | "countryIso"
      | "onCountryClick"
      | "mobileMaxLength"
      | "mobileError"
      | "password"
      | "onPasswordChange"
      | "passwordMinLength"
      | "passwordMaxLength"
      | "passwordError"
      | "showPassword"
      | "onTogglePassword"
      | "rememberMe"
      | "onRememberMeChange"
      | "showRememberMe"
      | "formError"
      | "attemptsLeft"
      | "onForgotPassword"
      | "onCreateAccount"
      | "showCreateAccount"
      | "loading"
      | "disabled"
    >,
    Pick<
      OtpVerificationFormProps,
      | "maskedDestination"
      | "validForMinutes"
      | "otp"
      | "otpLength"
      | "onOtpChange"
      | "onOtpComplete"
      | "autoFocusOtp"
      | "otpError"
      | "attemptsTotal"
      | "channel"
      | "onChannelSwitch"
      | "showChannelSwitch"
      | "resendIn"
      | "onResend"
    > {
  /** Which step of the flow to render. Defaults to "login" */
  step?: LoginStep;
  /** Heading override for the active step */
  title?: string;
  /** Sub-heading override for the active step */
  description?: string;
  /** Submit-button label override for the active step */
  submitLabel?: string;
  /** Fired when the active step's primary action is submitted */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Fired when the back affordance is pressed on a non-login step */
  onBack?: () => void;
  /** Additional class for the active step's form element */
  formClassName?: string;
}
