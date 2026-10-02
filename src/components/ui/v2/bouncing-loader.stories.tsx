import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BouncingLoader } from "./bouncing-loader";
import { BouncingLoader as V1 } from "../bouncing-loader";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof BouncingLoader> = {
  title: "V2/Components/BouncingLoader",
  component: BouncingLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { include: ["size", "spacing", "color", "aria-label"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "bouncing-loader",
          summary:
            "A three-dot loading indicator with configurable dot size, spacing and color.",
          changes: [
            [
              "Shape and motion",
              "Three bouncing dots",
              "Same v2 loading treatment",
            ],
            ["Namespace", "ui/bouncing-loader", "ui/v2/bouncing-loader"],
          ],
          tokens: [
            ["Dot color", "--semantic-text-placeholder", "A2A6B1", "#A2A6B1"],
          ],
          guidance:
            "Use one loader per loading region and give it a specific aria-label. Size and spacing accept pixel numbers or CSS lengths. Reduced motion shows static dots.",
        }),
      },
    },
  },
  args: {
    size: 8,
    spacing: 6,
    color: "var(--semantic-text-placeholder)",
    "aria-label": "Preparing a response",
  },
  argTypes: {
    size: { control: { type: "number", min: 2, max: 32 } },
    spacing: { control: { type: "number", min: 0, max: 24 } },
    color: { control: "text" },
    "aria-label": { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const LargerDots: Story = { args: { size: 12, spacing: 8 } };
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "Fixed dot diameters. Spacing and color apply to each sample."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-8">
      {[6, 8, 12, 16].map((size) => (
        <section key={size} className="space-y-3">
          <h3 className="m-0 text-sm font-semibold">{size}px</h3>
          <BouncingLoader {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["color"],
    "Placeholder, muted and primary semantic colors. Size and spacing stay editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-8">
      {["placeholder", "muted", "secondary"].map((color) => (
        <section key={color} className="space-y-3">
          <h3 className="m-0 text-sm font-semibold capitalize">{color}</h3>
          <BouncingLoader {...args} color={`var(--semantic-text-${color})`} />
        </section>
      ))}
    </div>
  ),
};
function LoadingExample(args: Parameters<typeof BouncingLoader>[0]) {
  const [loading, setLoading] = useState(true);
  return (
    <section className="w-[360px] max-w-full space-y-4">
      <h3 className="m-0 text-base font-semibold">Assistant response</h3>
      <div className="rounded-lg bg-semantic-bg-ui p-4">
        {loading ? (
          <BouncingLoader {...args} />
        ) : (
          <p className="m-0 text-sm">Your response is ready.</p>
        )}
      </div>
      <Button variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Finish response" : "Start response"}
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
          {version === "v1" ? <V1 {...args} /> : <BouncingLoader {...args} />}
        </section>
      ))}
    </div>
  ),
};
