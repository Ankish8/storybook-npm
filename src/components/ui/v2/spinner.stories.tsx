import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Spinner } from "./spinner";
import { Spinner as V1 } from "../spinner";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const variants = [
  "default",
  "secondary",
  "muted",
  "inverted",
  "current",
] as const;
const sizes = ["sm", "default", "lg", "xl"] as const;
const meta: Meta<typeof Spinner> = {
  title: "V2/Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { include: ["variant", "size", "aria-label"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "spinner",
          summary:
            "Animated loading indicators with four sizes and five color treatments.",
          changes: [
            ["Shape", "Track and quarter arc", "Same Figma loading shape"],
            ["Namespace", "ui/spinner", "ui/v2/spinner"],
          ],
          tokens: [
            ["Primary", "--semantic-primary", "343E55", "#343E55"],
            ["Muted", "--semantic-text-muted", "717680", "#717680"],
            ["Inverted", "--semantic-text-inverted", "FFFFFF", "#FFFFFF"],
          ],
          guidance:
            "Provide a specific aria-label such as Saving changes. Use current to inherit color inside a control. In reduced motion the arc remains visible without spinning.",
        }),
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    "aria-label": "Loading conversations",
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    "aria-label": { control: "text" },
  },
  decorators: [
    (Story, context) => (
      <div
        className={
          context.args.variant === "inverted"
            ? "rounded-lg bg-semantic-primary p-6 text-semantic-text-inverted"
            : "p-6"
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
export const Muted: Story = { args: { variant: "muted" } };
export const Inverted: Story = { args: { variant: "inverted" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "All palette variants. Size and accessible label update every sample."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-6">
      {variants.map((variant) => (
        <section
          key={variant}
          className={
            variant === "inverted"
              ? "space-y-3 rounded-lg bg-semantic-primary p-4 text-semantic-text-inverted"
              : "space-y-3 p-4"
          }
        >
          <h3 className="m-0 text-sm font-semibold capitalize">{variant}</h3>
          <Spinner {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "16, 24, 32 and 48px indicators. Palette and accessible label stay editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-8">
      {sizes.map((size) => (
        <section key={size} className="space-y-3">
          <h3 className="m-0 text-sm font-semibold">{size}</h3>
          <Spinner {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
function LoadingExample(args: Parameters<typeof Spinner>[0]) {
  const [loading, setLoading] = useState(true);
  return (
    <section className="w-[360px] max-w-full space-y-4">
      <h3 className="m-0 text-base font-semibold">Conversation list</h3>
      <div className="flex min-h-[96px] items-center gap-3 rounded-lg border border-solid border-semantic-border-layout p-4">
        {loading ? (
          <>
            <Spinner {...args} />
            <p className="m-0 text-sm">Fetching conversations…</p>
          </>
        ) : (
          <p className="m-0 text-sm">12 conversations loaded</p>
        )}
      </div>
      <Button variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Complete loading" : "Reload"}
      </Button>
    </section>
  );
}
export const Usage: Story = { render: (args) => <LoadingExample {...args} /> };
export const V1VsV2: Story = {
  name: "v1 vs v2",
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-6 md:grid-cols-2">
      {["v1", "v2"].map((version) => (
        <section
          key={version}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-base font-semibold">{version}</h3>
          {version === "v1" ? <V1 {...args} /> : <Spinner {...args} />}
        </section>
      ))}
    </div>
  ),
};
