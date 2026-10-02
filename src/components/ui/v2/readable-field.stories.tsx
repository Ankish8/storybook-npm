import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { ReadableField } from "./readable-field";
import { ReadableField as V1 } from "../readable-field";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const headerAction = fn().mockName("headerAction.onClick");
const meta: Meta<typeof ReadableField> = {
  title: "V2/Components/ReadableField",
  component: ReadableField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["label", "value", "helperText", "secret", "onValueCopy"],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "readable-field",
          summary:
            "Read-only values with copy, secret masking and an optional header action.",
          changes: [
            ["Container", "42px high, 4px corners", "40px high, 8px corners"],
            ["Typography", "Inherited font", "Inter with 14px semibold label"],
            ["Helper", "14px", "12px"],
          ],
          tokens: [
            ["Surface", "--semantic-bg-ui", "F5F5F5", "#F5F5F5"],
            ["Label", "--semantic-text-secondary", "343E55", "#343E55"],
            ["Value", "--semantic-text-primary", "181D27", "#181D27"],
            ["Helper", "--semantic-text-muted", "717680", "#717680"],
          ],
          guidance:
            "Use secret to mask sensitive values. Copy always writes the original value and reports success through onValueCopy. Header actions can be disabled with an explanatory tooltip.",
        }),
      },
    },
  },
  args: {
    label: "Integration key",
    value: "example_key_123456789",
    helperText: "Example value for demonstration only",
    secret: false,
    onValueCopy: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    helperText: { control: "text" },
    secret: { control: "boolean" },
  },
  decorators: [
    (Story, context) => (
      <div
        className={
          context.parameters.widePreview
            ? "w-[960px] max-w-full"
            : "w-[420px] max-w-full"
        }
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Secret: Story = { args: { secret: true } };
export const BaseUrl: Story = {
  args: {
    label: "Base URL",
    value: "https://api.example.test/v3/voice",
    helperText: "Use this address for API requests",
  },
};
export const WithHeaderAction: Story = {
  args: {
    headerAction: { label: "Regenerate", onClick: () => headerAction() },
  },
};
export const DisabledHeaderAction: Story = {
  args: {
    headerAction: {
      label: "Regenerate",
      onClick: () => headerAction(),
      disabled: true,
      disabledTooltip: "Only administrators can regenerate this value",
    },
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["secret"],
    "Plain and secret displays. Label, value and helper apply to both; reveal and copy work independently."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {[false, true].map((secret) => (
        <section key={String(secret)} className="space-y-3">
          <h3 className="m-0 text-base font-semibold">
            {secret ? "Secret" : "Plain value"}
          </h3>
          <ReadableField {...args} secret={secret} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    [],
    "Copy shows success feedback. Secret values reveal on demand; the header action can be disabled."
  ),
  render: (args) => <ReadableField {...args} />,
};
function Credentials({
  onRegenerate,
  ...args
}: Parameters<typeof ReadableField>[0] & {
  onRegenerate: (value: string) => void;
}) {
  const [generation, setGeneration] = useState(1);
  const [copiedValue, setCopiedValue] = useState<string>();
  return (
    <section className="max-w-full space-y-4">
      <div>
        <h3 className="m-0 text-base font-semibold">Integration credentials</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Reveal, copy or regenerate the example key.
        </p>
      </div>
      <ReadableField
        {...args}
        headerAction={{
          label: "Regenerate",
          onClick: () => {
            setGeneration(generation + 1);
            onRegenerate(`example_key_generation_${generation + 1}`);
            setCopiedValue(undefined);
          },
        }}
        onValueCopy={(value) => {
          setCopiedValue(value);
          args.onValueCopy?.(value);
        }}
      />
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {copiedValue === args.value
          ? "Key copied."
          : `Generation ${generation}`}
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "Regenerate updates the live value Control; copy reports success. Edited values in Controls update the same example."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Credentials {...args} onRegenerate={(value) => updateArgs({ value })} />
    );
  },
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: { widePreview: true, layout: "padded" },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[720px] gap-6 grid-cols-2">
        {["v1", "v2"].map((version) => (
          <section
            key={version}
            className="min-w-0 space-y-3 rounded-lg border border-solid border-semantic-border-layout p-5"
          >
            <h3 className="m-0 text-base font-semibold">{version}</h3>
            {version === "v1" ? <V1 {...args} /> : <ReadableField {...args} />}
          </section>
        ))}
      </div>
    </div>
  ),
};
