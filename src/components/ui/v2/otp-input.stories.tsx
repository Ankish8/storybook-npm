import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { useState } from "react";
import { OtpInput, type OtpInputProps } from "./otp-input";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof OtpInput> = {
  title: "V2/Components/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "value",
        "length",
        "disabled",
        "error",
        "helperText",
        "onValueChange",
        "onComplete",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "otp-input",
          exportName: "OtpInput",
          hasV1: false,
          summary:
            "Digit-by-digit verification code entry with paste and keyboard navigation.",
          changes: [
            ["Cells", "—", "54 × 60px; 8px radius; 24px gap"],
            ["Typography", "—", "Inter 16px; supporting text 12px"],
            [
              "Interaction",
              "—",
              "Numeric entry, paste, focus advance and completion callback",
            ],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Focus", "--semantic-border-accent", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
          ],
          guidance:
            "Use four or six digits. Provide an accessible group label and feedback in helperText. Completion is an input event; validation remains the application's responsibility.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2000-11973",
    },
  },
  args: {
    value: "",
    length: 4,
    disabled: false,
    error: false,
    helperText: "Enter the code sent to your phone",
    onValueChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    value: { control: "text" },
    length: { control: "inline-radio", options: [4, 6] },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <OtpInput
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const FourDigits: Story = { args: { length: 4 } };
export const SixDigits: Story = { args: { length: 6 } };
export const Filled: Story = {
  args: { value: "1234", helperText: "Code entered" },
};
export const Error: Story = {
  args: {
    error: true,
    helperText: "That code has expired. Request another code.",
  },
};
export const Disabled: Story = { args: { value: "1234", disabled: true } };
function Sample(args: OtpInputProps) {
  const [value, setValue] = useState(args.value || "");
  return (
    <OtpInput
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange?.(next);
      }}
    />
  );
}
export const AllSizes: Story = {
  parameters: gallery(
    ["length"],
    "Both supported code lengths. Value and feedback controls apply to both; samples are independently editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {([4, 6] as const).map((length) => (
        <section key={length}>
          <h3 className="m-0 mb-2 text-base font-semibold">{length} digits</h3>
          <Sample key={length + String(args.value)} {...args} length={length} />
        </section>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["error", "disabled", "helperText"],
    "Default, error and disabled feedback. Length and value apply across the gallery."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {["Default", "Error", "Disabled"].map((state) => (
        <section key={state}>
          <h3 className="m-0 mb-2 text-base font-semibold">{state}</h3>
          <Sample
            key={state + args.value + args.length}
            {...args}
            disabled={state === "Disabled"}
            error={state === "Error"}
            helperText={
              state === "Error" ? "Code expired" : "Enter the verification code"
            }
          />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["error", "disabled", "helperText"],
      "Default, hover, focus, error and disabled cells. Hover and focus are displayed persistently while length and value remain editable; each sample is independent."
    ),
  },
  render: (args) => (
    <div className="w-[980px] max-w-full overflow-x-auto">
      <div
        className={
          args.length === 6
            ? "grid min-w-[1000px] grid-cols-2 gap-6"
            : "grid min-w-[720px] grid-cols-2 gap-6"
        }
      >
        {["Default", "Hover", "Focus", "Error", "Disabled"].map((state) => (
          <section
            key={state}
            data-otp-state={state}
            className={
              state === "Hover"
                ? "min-w-0 space-y-2 [&_input:enabled:not(:focus)]:border-[var(--color-primary-100)]"
                : state === "Focus"
                  ? "min-w-0 space-y-2 [&_input:first-child]:!border-semantic-border-accent [&_input:first-child]:!shadow-[0_0_4px_rgba(39,171,184,0.4)]"
                  : "min-w-0 space-y-2"
            }
          >
            <h3 className="m-0 text-base font-semibold">{state}</h3>
            <Sample
              key={state + args.value + args.length}
              {...args}
              disabled={state === "Disabled"}
              error={state === "Error"}
              helperText={
                state === "Error"
                  ? "Code expired"
                  : "Enter the verification code"
              }
            />
          </section>
        ))}
      </div>
    </div>
  ),
};
function Verification(args: OtpInputProps) {
  const value = args.value || "";
  const [submittedValue, setSubmittedValue] = useState<string>();
  return (
    <form
      className="max-w-full space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmittedValue(value);
      }}
    >
      <div>
        <h3 className="m-0 text-base font-semibold">Verify your phone</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Paste a code or enter one digit at a time.
        </p>
      </div>
      <OtpInput
        {...args}
        value={value}
        onValueChange={(next) => {
          setSubmittedValue(undefined);
          args.onValueChange?.(next);
        }}
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={args.disabled || value.length !== (args.length || 4)}
        >
          Verify code
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={args.disabled}
          onClick={() => {
            args.onValueChange?.("");
            setSubmittedValue(undefined);
          }}
        >
          Request new code
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {submittedValue === value && value.length === (args.length || 4)
          ? "Code submitted for verification."
          : "Waiting for your code."}
      </p>
    </form>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "Enter a complete code to enable Verify. Typing, pasting and Request new code stay synchronized with value Controls."
  ),
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <Verification
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
