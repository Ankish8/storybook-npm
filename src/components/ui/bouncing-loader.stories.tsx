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
    type: {
      control: { type: "select" },
      options: ["default", "staggered"],
      description:
        "staggered: 0.5s bounce, delays 0.1/0.3/0.6s, 20px dots + 12px gap + neutral-800 (overridable)",
    },
    frame: {
      control: { type: "select" },
      options: ["none", "pill"],
      description: "pill: white rounded padding around the row (e.g. on dark background)",
    },
    size: {
      control: "number",
      description: "Dot size in pixels (or pass a string for any CSS length)",
    },
    spacing: {
      control: "number",
      description: "Gap between dots in pixels (or a string length)",
    },
    effect: {
      control: { type: "select" },
      options: ["wave", "bounce", "dots-bounce", "tailwind-bounce"],
      description:
        "dots-bounce: Tailwind animate-bounce + stagger (alias: tailwind-bounce)",
    },
    colorDark: {
      control: "text",
      description: "Dot color when an ancestor has .dark (pair with color for light theme)",
    },
    staggerDelay: {
      control: { type: "number", step: 0.01, min: 0 },
      description:
        "Index × delay. Omit: duration÷3 (wave), 0.2s (dots-bounce), or 0.12s (bounce)",
    },
    duration: {
      control: { type: "number", step: 0.05, min: 0.1 },
      description: "Full loop length per dot (seconds)",
    },
    bounce: {
      control: { type: "number", step: 1, min: 0 },
      description: "Vertical travel in pixels (or a string for any CSS length)",
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
    effect: "wave",
    duration: 0.6,
    bounce: 4,
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
    color: "var(--semantic-text-placeholder)",
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
    effect: "wave",
    duration: 0.9,
  },
};

export const ContinuousBounce: Story = {
  name: "Continuous bounce (not wave)",
  args: {
    size: 8,
    effect: "bounce",
    duration: 0.55,
    bounce: 4,
  },
};

export const DotsBounce: Story = {
  name: "Dots bounce (Tailwind animate-bounce)",
  args: {
    size: 12,
    spacing: 8,
    color: "var(--semantic-text-placeholder)",
    effect: "dots-bounce",
    duration: 1,
  },
};

export const ContinuousBounceWithWave: Story = {
  name: "Continuous bounce (with wave)",
  args: {
    size: 8,
    spacing: 6,
    color: "var(--semantic-text-placeholder)",
    effect: "wave",
    duration: 0.55,
    bounce: 4,
  },
};
