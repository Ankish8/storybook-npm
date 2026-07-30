import type { Meta, StoryObj } from "@storybook/react";

import { LoginForm } from "./login-form";
import type { LoginFormProps } from "./types";
import { cardDecorator, docsPreamble, useSeededValue } from "./story-helpers";

const meta: Meta<typeof LoginForm> = {
  title: "Custom/Login/Login Form",
  component: LoginForm,
  tags: ["autodocs"],
  decorators: [cardDecorator],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The mobile-number + password step, without the two-pane shell. Use this directly when the surrounding page is already yours.

Fully controlled — it owns no field state and performs no network calls. \`passwordMinLength\` gates the submit button because the form is \`noValidate\`, so the input's own \`minLength\` never blocks a submit.
${docsPreamble("LoginForm")}
`,
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    mobileNumber: { control: "text" },
    countryCode: { control: "text" },
    mobileMaxLength: { control: { type: "number", min: 4, max: 15 } },
    mobileError: { control: "text" },
    password: { control: "text" },
    passwordMinLength: { control: { type: "number", min: 0, max: 32 } },
    passwordMaxLength: { control: { type: "number", min: 1, max: 64 } },
    passwordError: { control: "text" },
    formError: { control: "text" },
    attemptsLeft: { control: { type: "number", min: 0, max: 10 } },
    rememberMe: { control: "boolean" },
    showRememberMe: { control: "boolean" },
    showCreateAccount: { control: "boolean" },
    loading: { control: "boolean" },
    submitLabel: { control: "text" },
  },
  // Keeps the fields typeable while args still seed them.
  render: (args: LoginFormProps) => {
    const [mobileNumber, setMobileNumber] = useSeededValue(args.mobileNumber);
    const [password, setPassword] = useSeededValue(args.password);
    const [rememberMe, setRememberMe] = useSeededValue(args.rememberMe);
    return (
      <LoginForm
        {...args}
        mobileNumber={mobileNumber}
        onMobileNumberChange={setMobileNumber}
        password={password}
        onPasswordChange={setPassword}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        onSubmit={(event) => event.preventDefault()}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

/** Interactive playground. */
export const Overview: Story = {
  args: { mobileNumber: "", password: "", rememberMe: true },
};

/** Empty, exactly as it first renders. */
export const Default: Story = { args: { rememberMe: true } };

/** Both fields populated, so the primary action is enabled. */
export const Filled: Story = {
  args: { mobileNumber: "9876543210", password: "supersecret", rememberMe: true },
};

/** Mobile number fails validation. */
export const InvalidNumber: Story = {
  args: {
    mobileNumber: "98765432",
    mobileError: "Please enter a valid mobile number.",
    rememberMe: true,
  },
};

/** Password rejected by the server. */
export const IncorrectPassword: Story = {
  args: {
    mobileNumber: "9876543210",
    password: "wrongpass",
    passwordError: "Incorrect password. Please try again.",
    rememberMe: true,
  },
};

/** Form-level failure with the remaining-attempts counter. */
export const FailedAttempt: Story = {
  args: {
    mobileNumber: "9876543210",
    password: "wrongpass",
    formError:
      "Login attempt failed. Kindly re-check the details you have entered.",
    attemptsLeft: 4,
    rememberMe: true,
  },
};

/**
 * A password below `passwordMinLength` keeps the submit button disabled. Type a
 * sixth character to see it enable.
 */
export const PasswordLengthRules: Story = {
  args: {
    mobileNumber: "9876543210",
    password: "short",
    passwordMinLength: 6,
    passwordMaxLength: 20,
    rememberMe: true,
  },
};

/** Submitting — spinner on the button, fields locked. */
export const Loading: Story = {
  args: {
    mobileNumber: "9876543210",
    password: "supersecret",
    loading: true,
    rememberMe: true,
  },
};

/** Without the "Remember me" checkbox and the secondary account action. */
export const Minimal: Story = {
  args: {
    mobileNumber: "9876543210",
    password: "supersecret",
    showRememberMe: false,
    showCreateAccount: false,
  },
};

/** Every state side by side. */
export const AllStates: StoryObj = {
  decorators: [],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid justify-items-center gap-8 bg-semantic-bg-subtle p-8 lg:grid-cols-2">
      {(
        [
          ["Default", { rememberMe: true }],
          [
            "Filled",
            { mobileNumber: "9876543210", password: "supersecret", rememberMe: true },
          ],
          [
            "Invalid number",
            {
              mobileNumber: "98765432",
              mobileError: "Please enter a valid mobile number.",
            },
          ],
          [
            "Failed attempt",
            {
              mobileNumber: "9876543210",
              password: "wrongpass",
              formError: "Login attempt failed. Kindly re-check the details.",
              attemptsLeft: 4,
            },
          ],
        ] as Array<[string, LoginFormProps]>
      ).map(([label, props]) => (
        <div key={label} className="flex w-full max-w-[576px] flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            {label}
          </p>
          <div className="flex w-full flex-col items-center gap-6 rounded-3xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-6 py-6 shadow-[1px_1px_40px_0px_rgba(160,160,160,0.1)] sm:px-12">
            <LoginForm {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};
