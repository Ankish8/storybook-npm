import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BouncingLoader } from "./bouncing-loader";

const meta: Meta<typeof BouncingLoader> = {
  title: "Components/BouncingLoader",
  component: BouncingLoader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Three-dot typing indicator with the team-canonical wave animation. Animation timing is fixed; only size, color, and spacing are configurable per usage.

\`\`\`bash
npx myoperator-ui add bouncing-loader
\`\`\`

## Import

\`\`\`tsx
import { BouncingLoader } from "@/components/ui/bouncing-loader"
\`\`\`

## Design tokens

Default dot color falls back to \`--semantic-text-placeholder\` when \`color\` is not set.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "number",
      description: "Dot size in pixels (or pass a string for any CSS length)",
    },
    spacing: {
      control: "number",
      description: "Gap between dots in pixels (or a string length)",
    },
    color: {
      control: "text",
      description:
        "Dot fill (any CSS color or token, e.g. var(--semantic-text-placeholder))",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    size: 8,
    spacing: 6,
    color: "var(--semantic-text-placeholder)",
  },
};

export const InChatPill: Story = {
  name: "In chat pill",
  render: () => (
    <div
      className="inline-flex min-w-[2.75rem] items-center justify-center rounded-full bg-semantic-bg-ui px-3.5 py-2.5"
      data-slot="chat-typing"
    >
      <BouncingLoader
        size={8}
        spacing={6}
        color="var(--semantic-text-placeholder)"
      />
    </div>
  ),
};

export const LargerDots: Story = {
  name: "Larger dots",
  args: {
    size: 12,
    spacing: 8,
    color: "var(--semantic-text-placeholder)",
  },
};
