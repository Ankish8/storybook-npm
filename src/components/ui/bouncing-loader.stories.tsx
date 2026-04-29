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
Three-dot bouncing typing indicator (chat-style). Styling uses Tailwind plus CSS variables for size, color, spacing, and animation timing.

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
    staggerDelay: {
      control: { type: "number", step: 0.01, min: 0 },
      description: "Delay between dots in seconds",
    },
    duration: {
      control: { type: "number", step: 0.05, min: 0.1 },
      description: "Bounce cycle length in seconds",
    },
    fullWidth: {
      control: "boolean",
      description: "Full-width row, centered (e.g. in a flex parent)",
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
    staggerDelay: 0.12,
    duration: 0.55,
    fullWidth: false,
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
    color: "var(--semantic-text-secondary)",
  },
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-64 rounded border border-semantic-border-layout p-4">
      <BouncingLoader fullWidth size={8} />
    </div>
  ),
};

export const Slower: Story = {
  args: {
    size: 8,
    duration: 0.9,
    staggerDelay: 0.18,
  },
};
