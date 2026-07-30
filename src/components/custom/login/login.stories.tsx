import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useArgs } from "storybook/preview-api";

import { Login } from "./login";
import { LoginForm } from "./login-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { OtpVerificationForm } from "./otp-verification-form";
import { ResetPasswordForm } from "./reset-password-form";
import { OtpInput } from "./otp-input";
import type { LoginProps, LoginStep, OtpChannel } from "./types";

/**
 * Writes every field change back into the story's args, so each state story is
 * typeable and the Controls panel stays in sync with what you type.
 *
 * `useArgs` is a Storybook preview hook, so it must be called directly in the
 * story function — wrapping it in a nested component throws
 * "preview hooks can only be called inside decorators and story functions".
 */
const renderStatefulLogin = (args: LoginProps) => {
  const [, updateArgs] = useArgs();
  return (
    <Login
      {...args}
      onMobileNumberChange={(mobileNumber) => updateArgs({ mobileNumber })}
      onPasswordChange={(password) => updateArgs({ password })}
      onOtpChange={(otp) => updateArgs({ otp })}
      onRememberMeChange={(rememberMe) => updateArgs({ rememberMe })}
      onTogglePassword={() => updateArgs({ showPassword: !args.showPassword })}
      onChannelSwitch={(channel) => updateArgs({ channel })}
      onSubmit={(event) => event.preventDefault()}
    />
  );
};

const meta: Meta<typeof Login> = {
  title: "Custom/Login",
  component: Login,
  tags: ["autodocs"],
  render: renderStatefulLogin,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: true, height: "760px" },
      description: {
        component: `
The complete MyOperator authentication flow — a two-pane shell (logo, form card, marketing panel) plus the step-specific form selected by \`step\`.

Covers four steps: **login**, **forgot-password**, **otp**, and **reset-password**, each with idle, filled, and error states.

The component is **fully controlled**: it owns no field state, performs no network calls, and never advances \`step\` on its own. Every interaction is surfaced as a callback.

### Installation

\`\`\`bash
npx myoperator-ui add login
\`\`\`

### Import

\`\`\`tsx
import { Login } from "@/components/custom/login"
// or the individual steps
import {
  AuthLayout,
  LoginForm,
  ForgotPasswordForm,
  OtpVerificationForm,
  ResetPasswordForm,
  OtpInput,
} from "@/components/custom/login"
\`\`\`

### Usage

\`\`\`tsx
const [step, setStep] = React.useState<LoginStep>("login")
const [mobile, setMobile] = React.useState("")
const [password, setPassword] = React.useState("")

<Login
  step={step}
  logoSrc="/myoperator.svg"
  illustration={<img src="/hero.png" alt="" className="w-full" />}
  mobileNumber={mobile}
  onMobileNumberChange={setMobile}
  password={password}
  onPasswordChange={setPassword}
  onSubmit={(e) => { e.preventDefault(); signIn() }}
  onForgotPassword={() => setStep("forgot-password")}
  onCreateAccount={() => navigate("/signup")}
/>
\`\`\`

### Marketing illustration

The right-hand panel ships with the Figma artwork built in — the MyOperator inbox on a laptop with the floating "Chat assigned to AI Agent" and "2.5 Billion Conversations Handled" cards. It is embedded as a palette-quantised data URI (~13 KB) because the CLI copies component files as UTF-8 text, so a binary \`.png\` in the component directory would never reach a consumer's project.

\`\`\`tsx
<Login />                                  // bundled artwork (default)
<Login illustrationSrc="https://cdn/hero.png" />  // your own, served from a CDN
<Login illustrationSrc={null} />           // text-only panel, no artwork
<Login illustration={<MyHero />} />        // replace the node entirely
<Login hideMarketingPanel />               // drop the whole right pane
\`\`\`

> **The logo is not bundled.** \`logoSrc\` (or \`logo\`) stays a prop, since the wordmark differs per brand and per environment.

### Design Tokens

<table>
  <thead>
    <tr><th>Token</th><th>CSS Variable</th><th>Usage</th><th>Preview</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>bg-semantic-bg-primary</code></td>
      <td><code>--semantic-bg-primary</code></td>
      <td>Page and form-card background</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#ffffff;border:1px solid #e9eaeb"></div></td>
    </tr>
    <tr>
      <td><code>bg-semantic-bg-canvas</code></td>
      <td><code>--semantic-bg-canvas</code></td>
      <td>Marketing panel surface (cool slate)</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#f1f5f9;border:1px solid #e9eaeb"></div></td>
    </tr>
    <tr>
      <td><code>bg-semantic-bg-ui</code></td>
      <td><code>--semantic-bg-ui</code></td>
      <td>Back-button hover surface (warm neutral)</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#f5f5f5;border:1px solid #e9eaeb"></div></td>
    </tr>
    <tr>
      <td><code>border-semantic-border-layout</code></td>
      <td><code>--semantic-border-layout</code></td>
      <td>Form-card border</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#e9eaeb"></div></td>
    </tr>
    <tr>
      <td><code>text-semantic-text-primary</code></td>
      <td><code>--semantic-text-primary</code></td>
      <td>Card heading, marketing headline</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#181d27"></div></td>
    </tr>
    <tr>
      <td><code>text-semantic-text-secondary</code></td>
      <td><code>--semantic-text-secondary</code></td>
      <td>Field labels, OTP digits</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#343e55"></div></td>
    </tr>
    <tr>
      <td><code>text-semantic-text-muted</code></td>
      <td><code>--semantic-text-muted</code></td>
      <td>Sub-headings, "Did not receive code?"</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#717680"></div></td>
    </tr>
    <tr>
      <td><code>text-semantic-text-placeholder</code></td>
      <td><code>--semantic-text-placeholder</code></td>
      <td>Input placeholders, empty OTP boxes</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#a2a6b1"></div></td>
    </tr>
    <tr>
      <td><code>text-semantic-text-link</code></td>
      <td><code>--semantic-text-link</code></td>
      <td>"Forgot Password?", "Resend OTP"</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#4275d6"></div></td>
    </tr>
    <tr>
      <td><code>bg-semantic-primary</code></td>
      <td><code>--semantic-primary</code></td>
      <td>Primary submit button</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#343e55"></div></td>
    </tr>
    <tr>
      <td><code>border-semantic-border-input-focus</code></td>
      <td><code>--semantic-border-input-focus</code></td>
      <td>Focused field / active OTP box</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#27abb8"></div></td>
    </tr>
    <tr>
      <td><code>semantic-error-primary</code></td>
      <td><code>--semantic-error-primary</code></td>
      <td>Validation borders, error text, required asterisk</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:#f04438"></div></td>
    </tr>
  </tbody>
</table>

### Typography

| Element | Size / Line height | Weight |
|---------|--------------------|--------|
| Card heading | 24px / 32px | 600 |
| Card sub-heading | 16px / normal | 400 |
| Marketing headline | 28px / 36px | 600 |
| Field label | 14px / 20px | 600 |
| Input text | 16px / normal | 400 |
| Error message | 12px / 18px | 400 |
`,
      },
    },
  },
  argTypes: {
    step: {
      control: "select",
      options: ["login", "forgot-password", "otp", "reset-password"],
      description: "Which step of the flow to render",
    },
    channel: {
      control: "inline-radio",
      options: ["sms", "call"],
      description: "Channel the OTP was delivered on",
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    showRememberMe: { control: "boolean" },
    showCreateAccount: { control: "boolean" },
    showChannelSwitch: { control: "boolean" },
    hideMarketingPanel: { control: "boolean" },
    illustrationSrc: {
      control: "text",
      description:
        "Marketing illustration URL. Defaults to the bundled MyOperator artwork; pass null to render none.",
    },
    otpLength: { control: { type: "number", min: 4, max: 8 } },
    resendIn: { control: { type: "number", min: 0, max: 60 } },
    passwordMinLength: {
      control: { type: "number", min: 0, max: 32 },
      description:
        "Minimum password characters required before the submit button enables. Defaults to 6; pass 0 to accept any non-empty password.",
    },
    passwordMaxLength: {
      control: { type: "number", min: 1, max: 64 },
      description:
        "Maximum password characters the field accepts. Defaults to 20.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Login>;

/**
 * The form card exactly as `AuthLayout` renders it. Kept in one place so the
 * card stories can't drift from the real screen — mirror any change here into
 * `auth-layout.tsx`.
 */
const AUTH_CARD_CLASS =
  "flex w-full max-w-[576px] flex-col items-center gap-6 rounded-3xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-6 py-6 shadow-[1px_1px_40px_0px_rgba(160,160,160,0.1)] sm:px-12";

/** The form column's background in `AuthLayout`, so cards sit on the right tint. */
const AUTH_PAGE_BG_CLASS = "bg-semantic-bg-subtle";

/**
 * Owns a field's value locally while seeding it from an arg.
 *
 * These composite stories render the forms directly rather than through
 * `Login`, so passing an arg straight to `mobileNumber`/`password`/`otp` puts
 * the field in controlled mode with no change handler — which makes it
 * read-only in the canvas. Holding the value in state instead keeps the field
 * typeable, and the effect re-seeds it whenever the Controls panel changes.
 */
function useSeededValue<T>(seed: T): [T, (next: T) => void] {
  const [value, setValue] = React.useState<T>(seed);
  React.useEffect(() => setValue(seed), [seed]);
  return [value, setValue];
}

/** Editable args for the composite `AllSteps` story. */
type AllStepsArgs = {
  mobileNumber: string;
  password: string;
  maskedDestination: string;
  otp: string;
  otpLength: number;
  resendIn: number;
  rememberMe: boolean;
};

/** Editable args for the composite `AllErrorStates` story. */
type AllErrorStatesArgs = {
  mobileNumber: string;
  password: string;
  mobileError: string;
  passwordError: string;
  formError: string;
  attemptsLeft: number;
  rememberMe: boolean;
};

/** Centres a single form card so step stories read as components, not full pages. */
const cardDecorator = (Story: React.ComponentType) => (
  <div
    className={`flex min-h-[560px] items-center justify-center p-8 ${AUTH_PAGE_BG_CLASS}`}
  >
    <div className={AUTH_CARD_CLASS}>
      <Story />
    </div>
  </div>
);

const MARKETING = {
  marketingTitle: "Continue managing conversations efficiently",
  marketingDescription:
    "Access a unified workspace for customer engagement and support.",
};

/** Interactive playground for the whole flow. */
export const Overview: Story = {
  args: {
    step: "login",
    mobileNumber: "",
    password: "",
    rememberMe: true,
    showRememberMe: true,
    showCreateAccount: true,
    maskedDestination: "* * * * * 43210",
    otp: "",
    otpLength: 4,
    channel: "sms",
    resendIn: 30,
    loading: false,
    ...MARKETING,
  },
};

/** The empty login step, exactly as it first renders. */
export const LoginStepDefault: Story = {
  name: "Login — Default",
  args: { step: "login", rememberMe: true, ...MARKETING },
};

/** Both fields populated, so the primary action is enabled. */
export const LoginStepFilled: Story = {
  name: "Login — Filled",
  args: {
    step: "login",
    mobileNumber: "9876543210",
    password: "supersecret",
    rememberMe: true,
    ...MARKETING,
  },
};

/**
 * A password below `passwordMinLength` keeps the Login button disabled. Type a
 * sixth character to see it enable — `passwordMaxLength` caps typing at 20.
 */
export const LoginStepPasswordLength: Story = {
  name: "Login — Password Length Rules",
  args: {
    step: "login",
    mobileNumber: "9876543210",
    password: "short",
    passwordMinLength: 6,
    passwordMaxLength: 20,
    rememberMe: true,
    ...MARKETING,
  },
};

/** Mobile number fails validation. */
export const LoginStepInvalidNumber: Story = {
  name: "Login — Invalid Number",
  args: {
    step: "login",
    mobileNumber: "98765432",
    mobileError: "Please enter a valid mobile number.",
    rememberMe: true,
    ...MARKETING,
  },
};

/** Password rejected by the server. */
export const LoginStepIncorrectPassword: Story = {
  name: "Login — Incorrect Password",
  args: {
    step: "login",
    mobileNumber: "98765 43210",
    password: "wrongpass",
    passwordError: "Incorrect password. Please try again.",
    rememberMe: true,
    ...MARKETING,
  },
};

/** Form-level failure with the remaining attempt count. */
export const LoginStepFailedAttempt: Story = {
  name: "Login — Failed Attempt",
  args: {
    step: "login",
    mobileNumber: "98765 43210",
    password: "wrongpass",
    formError:
      "Login attempt failed. Kindly re-check the details you have entered.",
    attemptsLeft: 4,
    rememberMe: true,
    ...MARKETING,
  },
};

/** Submitting — spinner on the primary action, fields locked. */
export const LoginStepLoading: Story = {
  name: "Login — Loading",
  args: {
    step: "login",
    mobileNumber: "9876543210",
    password: "supersecret",
    loading: true,
    ...MARKETING,
  },
};

/** Password recovery: collect the mobile number. */
export const ForgotPasswordStep: Story = {
  name: "Forgot Password — Filled",
  args: { step: "forgot-password", mobileNumber: "9876543210", ...MARKETING },
};

/** Recovery with an invalid mobile number. */
export const ForgotPasswordStepInvalid: Story = {
  name: "Forgot Password — Invalid Number",
  args: {
    step: "forgot-password",
    mobileNumber: "98765432",
    mobileError: "Please enter a valid mobile number.",
    ...MARKETING,
  },
};

/** Awaiting the code, resend still counting down. */
export const OtpStepDefault: Story = {
  name: "OTP — Default",
  args: {
    step: "otp",
    maskedDestination: "* * * * * 43210",
    otp: "",
    resendIn: 30,
    channel: "sms",
    ...MARKETING,
  },
};

/** All digits entered, ready to verify. */
export const OtpStepFilled: Story = {
  name: "OTP — Filled",
  args: {
    step: "otp",
    maskedDestination: "* * * * * 43210",
    otp: "9876",
    resendIn: 0,
    channel: "sms",
    ...MARKETING,
  },
};

/** Wrong code, with the attempt counter beside the message. */
export const OtpStepWrongCode: Story = {
  name: "OTP — Wrong Code",
  args: {
    step: "otp",
    maskedDestination: "* * * * * 43210",
    otp: "9876",
    otpError: "Incorrect OTP. Try again.",
    attemptsLeft: 5,
    attemptsTotal: 6,
    resendIn: 0,
    channel: "sms",
    ...MARKETING,
  },
};

/** OTP delivered by call, so the alternate action offers SMS instead. */
export const OtpStepViaCall: Story = {
  name: "OTP — Delivered by call",
  args: {
    step: "otp",
    maskedDestination: "* * * * * 43210",
    otp: "",
    channel: "call",
    resendIn: 30,
    ...MARKETING,
  },
};

/** A six-digit code. */
export const OtpStepSixDigits: Story = {
  name: "OTP — Six digits",
  args: {
    step: "otp",
    maskedDestination: "* * * * * 43210",
    otpLength: 6,
    otp: "987",
    resendIn: 0,
    ...MARKETING,
  },
};

/** Set a new password — empty, so the action is disabled. */
export const ResetPasswordStepDefault: Story = {
  name: "Reset Password — Default",
  args: { step: "reset-password", ...MARKETING },
};

/** New password entered and masked. */
export const ResetPasswordStepFilled: Story = {
  name: "Reset Password — Filled",
  args: { step: "reset-password", password: "newsecret1", ...MARKETING },
};

/** New password fails the length rule. */
export const ResetPasswordStepError: Story = {
  name: "Reset Password — Error",
  args: {
    step: "reset-password",
    password: "abc",
    passwordError: "Password must be of 6-20 alphanumeric characters.",
    ...MARKETING,
  },
};

/** Narrow viewports drop the marketing panel and centre the card. */
export const WithoutMarketingPanel: Story = {
  args: { step: "login", hideMarketingPanel: true, rememberMe: true },
};

/** The OTP digit input in isolation — typing, backspace, arrows, and paste. */
export const OtpInputStandalone: StoryObj = {
  name: "OtpInput — Standalone",
  render: () => {
    const [four, setFour] = React.useState("");
    const [six, setSix] = React.useState("9876");
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            4 digits — value: {four || "(empty)"}
          </p>
          <OtpInput value={four} onChange={setFour} autoFocus={false} />
        </div>
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            6 digits with error
          </p>
          <OtpInput
            length={6}
            value={six}
            onChange={setSix}
            hasError
            autoFocus={false}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            Disabled
          </p>
          <OtpInput value="12" disabled autoFocus={false} />
        </div>
      </div>
    );
  },
  parameters: { layout: "centered" },
};

/**
 * Renders the four steps side by side with each field editable in place. Args
 * seed the values; typing in a card updates only that card.
 */
const AllStepsDemo = ({
  mobileNumber,
  password,
  maskedDestination,
  otp,
  otpLength,
  resendIn,
  rememberMe,
}: AllStepsArgs) => {
  const [loginMobile, setLoginMobile] = useSeededValue(mobileNumber);
  const [loginPassword, setLoginPassword] = useSeededValue(password);
  const [remember, setRemember] = useSeededValue(rememberMe);
  const [forgotMobile, setForgotMobile] = useSeededValue(mobileNumber);
  const [otpValue, setOtpValue] = useSeededValue(otp);
  const [newPassword, setNewPassword] = useSeededValue(password);

  return (
    <div
      className={`grid justify-items-center gap-8 p-8 lg:grid-cols-2 ${AUTH_PAGE_BG_CLASS}`}
    >
      {(
        [
          [
            "login",
            <LoginForm
              key="login"
              mobileNumber={loginMobile}
              onMobileNumberChange={setLoginMobile}
              password={loginPassword}
              onPasswordChange={setLoginPassword}
              rememberMe={remember}
              onRememberMeChange={setRemember}
            />,
          ],
          [
            "forgot-password",
            <ForgotPasswordForm
              key="forgot"
              mobileNumber={forgotMobile}
              onMobileNumberChange={setForgotMobile}
            />,
          ],
          [
            "otp",
            <OtpVerificationForm
              key="otp"
              maskedDestination={maskedDestination}
              otp={otpValue}
              onOtpChange={setOtpValue}
              otpLength={otpLength}
              resendIn={resendIn}
            />,
          ],
          [
            "reset-password",
            <ResetPasswordForm
              key="reset"
              password={newPassword}
              onPasswordChange={setNewPassword}
            />,
          ],
        ] as Array<[LoginStep, React.ReactNode]>
      ).map(([step, form]) => (
        <div key={step} className={AUTH_CARD_CLASS}>
          {form}
        </div>
      ))}
    </div>
  );
};

/**
 * Every step's form side by side, without the page shell. Every value is an arg,
 * so the Controls panel can drive all four cards at once.
 */
export const AllSteps: StoryObj<AllStepsArgs> = {
  args: {
    mobileNumber: "9876543210",
    password: "newsecret1",
    maskedDestination: "* * * * * 43210",
    otp: "98",
    otpLength: 4,
    resendIn: 30,
    rememberMe: true,
  },
  argTypes: {
    mobileNumber: { control: "text" },
    password: { control: "text" },
    maskedDestination: { control: "text" },
    otp: { control: "text" },
    otpLength: { control: { type: "number", min: 4, max: 8 } },
    resendIn: { control: { type: "number", min: 0, max: 60 } },
    rememberMe: { control: "boolean" },
  },
  render: (args) => <AllStepsDemo {...args} />,
  parameters: { layout: "fullscreen" },
};

/**
 * The error-state login card with both fields editable in place, so the errors
 * can be inspected against values you type rather than only the seeded ones.
 */
const AllErrorStatesDemo = ({
  mobileNumber,
  password,
  ...rest
}: AllErrorStatesArgs) => {
  const [mobile, setMobile] = useSeededValue(mobileNumber);
  const [pass, setPass] = useSeededValue(password);
  const [remember, setRemember] = useSeededValue(rest.rememberMe);

  return (
    <LoginForm
      {...rest}
      mobileNumber={mobile}
      onMobileNumberChange={setMobile}
      password={pass}
      onPasswordChange={setPass}
      rememberMe={remember}
      onRememberMeChange={setRemember}
    />
  );
};

/**
 * The login step's error states together. Every message is an arg, so the
 * Controls panel can be used to try your own copy — clear a field to hide it.
 */
export const AllErrorStates: StoryObj<AllErrorStatesArgs> = {
  decorators: [cardDecorator],
  args: {
    mobileNumber: "98765432",
    password: "wrongpass",
    mobileError: "Please enter a valid mobile number.",
    passwordError: "Incorrect password. Please try again.",
    formError:
      "Login attempt failed. Kindly re-check the details you have entered.",
    attemptsLeft: 4,
    rememberMe: true,
  },
  argTypes: {
    mobileNumber: { control: "text" },
    password: { control: "text" },
    mobileError: { control: "text" },
    passwordError: { control: "text" },
    formError: { control: "text" },
    attemptsLeft: { control: { type: "number", min: 0, max: 10 } },
    rememberMe: { control: "boolean" },
  },
  render: (args) => <AllErrorStatesDemo {...args} />,
  parameters: { layout: "fullscreen" },
};

/**
 * The flow driven end to end with local state — the shape a host app wires up.
 * Nothing is validated against a server; submits just advance the step.
 */
export const InteractiveFlow: StoryObj = {
  render: () => {
    const [step, setStep] = React.useState<LoginStep>("login");
    const [mobileNumber, setMobileNumber] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(true);
    const [channel, setChannel] = React.useState<OtpChannel>("sms");

    const advance = (next: LoginStep) => (event: React.FormEvent) => {
      event.preventDefault();
      setStep(next);
    };

    return (
      <Login
        step={step}
        mobileNumber={mobileNumber}
        onMobileNumberChange={setMobileNumber}
        password={password}
        onPasswordChange={setPassword}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((value) => !value)}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        otp={otp}
        onOtpChange={setOtp}
        maskedDestination={`* * * * * ${mobileNumber.slice(-5) || "43210"}`}
        channel={channel}
        onChannelSwitch={setChannel}
        resendIn={0}
        onForgotPassword={() => setStep("forgot-password")}
        onBack={() => setStep("login")}
        onSubmit={
          step === "login"
            ? (event) => event.preventDefault()
            : step === "forgot-password"
              ? advance("otp")
              : step === "otp"
                ? advance("reset-password")
                : advance("login")
        }
        {...MARKETING}
      />
    );
  },
};
