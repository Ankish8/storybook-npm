import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { OtpInput } from "./otp-input";
import { docsPreamble } from "./story-helpers";

const meta: Meta<typeof OtpInput> = {
  title: "Custom/Login/OTP Input",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The OTP digit input used by the verification step — one box per digit, with typing, backspace, arrow-key navigation, and paste handled internally.

Controlled via \`value\` + \`onChange\`; \`onComplete\` fires once every box is filled.
${docsPreamble("OtpInput")}
`,
      },
    },
  },
  argTypes: {
    value: { control: "text" },
    length: { control: { type: "number", min: 4, max: 8 } },
    hasError: { control: "boolean" },
    disabled: { control: "boolean" },
    autoFocus: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
  args: { autoFocus: false },
};

export default meta;

type Story = StoryObj<typeof OtpInput>;

/** Interactive playground — typing writes back into `value`. */
export const Overview: Story = {
  args: { value: "", length: 4 },
  render: (args) => {
    const [value, setValue] = React.useState(args.value ?? "");
    React.useEffect(() => setValue(args.value ?? ""), [args.value]);
    return <OtpInput {...args} value={value} onChange={setValue} />;
  },
};

/** Empty, waiting for the first digit. */
export const Empty: Story = { args: { value: "" } };

/** Partially filled — the next empty box takes focus. */
export const PartiallyFilled: Story = { args: { value: "98" } };

/** Every box filled. */
export const Complete: Story = { args: { value: "9876" } };

/** Error styling on every box, used when the code is rejected. */
export const WithError: Story = { args: { value: "1234", hasError: true } };

/** Non-interactive, e.g. while the code is being verified. */
export const Disabled: Story = { args: { value: "12", disabled: true } };

/** Six digits instead of the default four. */
export const SixDigits: Story = { args: { value: "987", length: 6 } };

/** All lengths side by side. */
export const AllLengths: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[4, 5, 6].map((length) => (
        <div key={length} className="flex flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            {length} digits
          </p>
          <OtpInput length={length} value="98" autoFocus={false} />
        </div>
      ))}
    </div>
  ),
};

/** Every state side by side. */
export const AllStates: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          ["Empty", <OtpInput key="e" value="" autoFocus={false} />],
          ["Partially filled", <OtpInput key="p" value="98" autoFocus={false} />],
          ["Complete", <OtpInput key="c" value="9876" autoFocus={false} />],
          [
            "Error",
            <OtpInput key="err" value="1234" hasError autoFocus={false} />,
          ],
          ["Disabled", <OtpInput key="d" value="12" disabled autoFocus={false} />],
        ] as Array<[string, React.ReactNode]>
      ).map(([label, node]) => (
        <div key={label} className="flex flex-col gap-3">
          <p className="m-0 text-sm font-semibold text-semantic-text-secondary">
            {label}
          </p>
          {node}
        </div>
      ))}
    </div>
  ),
};
