import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
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
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12122",
    },
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
            ["Typography", "Inherited font", "Inter with 14px medium label"],
            ["Helper", "14px", "12px"],
          ],
          tokens: [
            ["Surface", "--semantic-bg-ui", "F5F5F5", "#F5F5F5"],
            ["Label", "--v2-text-primary", "#484848", "#484848"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
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
          <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
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
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Integration credentials
        </h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
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
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
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
            <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
              {version}
            </h3>
            {version === "v1" ? <V1 {...args} /> : <ReadableField {...args} />}
          </section>
        ))}
      </div>
    </div>
  ),
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    secret: true,
    headerAction: { label: "Regenerate", onClick: fn() },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Reveals, copies and regenerates a secret field against the action spies and a fake clipboard. Open the Interactions panel to step through it.",
      },
    },
  },
  beforeEach: () => {
    // Chrome only writes the real clipboard from a focused document, so route
    // the write to a spy and put the browser's clipboard back afterwards.
    const writeText = fn().mockName("clipboard.writeText");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    return () => void Reflect.deleteProperty(navigator, "clipboard");
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const masked = "\u2022".repeat(20);

    await step("A secret stays masked until revealed", async () => {
      await expect(canvas.getByText(masked)).toBeVisible();
      await expect(canvas.queryByText(args.value)).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Show value" }));
      await expect(canvas.getByText(args.value)).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "Hide value" }));
      await expect(canvas.getByText(masked)).toBeVisible();
    });

    await step("Copy writes the real value while masked", async () => {
      const copy = canvas.getByRole("button", { name: "Copy to clipboard" });
      await userEvent.click(copy);
      await expect(
        await canvas.findByRole("button", { name: "Copied" })
      ).toBeVisible();
      await expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        args.value
      );
      await expect(args.onValueCopy).toHaveBeenCalledTimes(1);
      await expect(args.onValueCopy).toHaveBeenCalledWith(args.value);
    });

    await step("The header action calls its handler", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Regenerate" }));
      await expect(args.headerAction?.onClick).toHaveBeenCalledTimes(1);
    });
  },
};
