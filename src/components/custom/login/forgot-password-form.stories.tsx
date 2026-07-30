import type { Meta, StoryObj } from "@storybook/react";

import { ForgotPasswordForm } from "./forgot-password-form";
import type { ForgotPasswordFormProps } from "./types";
import { cardDecorator, docsPreamble, useSeededValue } from "./story-helpers";

const meta: Meta<typeof ForgotPasswordForm> = {
  title: "Custom/Login/Forgot Password",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
  decorators: [cardDecorator],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The "enter your mobile number to receive an OTP" step. Collects a single field and hands off to your OTP request.

The back affordance renders only when \`onBack\` is supplied.
${docsPreamble("ForgotPasswordForm")}
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
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    submitLabel: { control: "text" },
  },
  render: (args: ForgotPasswordFormProps) => {
    const [mobileNumber, setMobileNumber] = useSeededValue(args.mobileNumber);
    return (
      <ForgotPasswordForm
        {...args}
        mobileNumber={mobileNumber}
        onMobileNumberChange={setMobileNumber}
        onSubmit={(event) => event.preventDefault()}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ForgotPasswordForm>;

/** Interactive playground. */
export const Overview: Story = { args: { mobileNumber: "" } };

/** Empty, exactly as it first renders. */
export const Default: Story = {};

/** A valid number entered, so "Get OTP" is enabled. */
export const Filled: Story = { args: { mobileNumber: "9876543210" } };

/** Number fails validation. */
export const InvalidNumber: Story = {
  args: {
    mobileNumber: "98765432",
    mobileError: "Please enter a valid mobile number.",
  },
};

/** Requesting the OTP. */
export const Loading: Story = {
  args: { mobileNumber: "9876543210", loading: true },
};

/** With the back affordance, as rendered inside the full flow. */
export const WithBackButton: Story = {
  args: { mobileNumber: "9876543210", onBack: () => {} },
};

/** Every state side by side. */
export const AllStates: StoryObj = {
  decorators: [],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid justify-items-center gap-8 bg-semantic-bg-subtle p-8 lg:grid-cols-2">
      {(
        [
          ["Default", {}],
          ["Filled", { mobileNumber: "9876543210" }],
          [
            "Invalid number",
            {
              mobileNumber: "98765432",
              mobileError: "Please enter a valid mobile number.",
            },
          ],
          ["Loading", { mobileNumber: "9876543210", loading: true }],
        ] as Array<[string, ForgotPasswordFormProps]>
      ).map(([label, props]) => (
        <div key={label} className="flex w-full max-w-[576px] flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            {label}
          </p>
          <div className="flex w-full flex-col items-center gap-6 rounded-3xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-6 py-6 shadow-[1px_1px_40px_0px_rgba(160,160,160,0.1)] sm:px-12">
            <ForgotPasswordForm {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};
