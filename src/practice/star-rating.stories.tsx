import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { StarRating } from "./star-rating";

const meta: Meta<typeof StarRating> = {
  title: "Practice/StarRating",
  component: StarRating,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A **practice** component — a click-to-rate star control with hover preview. Works controlled or uncontrolled.

> ℹ️ This lives in \`src/practice/\` and is **not** part of the published \`myoperator-ui\` library.

## Import

\`\`\`tsx
import { StarRating } from "@/practice/star-rating"
\`\`\`

## What to try in Storybook

- Hover the stars to preview, click to set — try it right in the **Overview**.
- Toggle **readOnly** to lock it, or change **size** and **max**.
- Open the **Actions** tab to watch \`onChange\` fire, or see the **Interactive** story for a live value.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0, max: 10 }, description: "Controlled value" },
    defaultValue: { control: { type: "number", min: 0, max: 10 }, description: "Initial value (uncontrolled)" },
    max: { control: { type: "number", min: 1, max: 10 }, description: "Number of stars" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"], description: "Star size" },
    readOnly: { control: "boolean", description: "Disable interaction" },
    onChange: { action: "changed", description: "Fires with the new rating" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    defaultValue: 3,
    max: 5,
    size: "md",
    readOnly: false,
  },
};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <StarRating defaultValue={3} size="sm" />
      <StarRating defaultValue={3} size="md" />
      <StarRating defaultValue={3} size="lg" />
    </div>
  ),
};

export const TenStars: Story = {
  args: { defaultValue: 7, max: 10, size: "sm" },
};

export const Interactive: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div className="flex flex-col items-center gap-3">
        <StarRating value={rating} onChange={setRating} size="lg" />
        <p className="m-0 text-sm text-semantic-text-muted">
          {rating > 0 ? `You rated ${rating} of 5` : "Click a star to rate"}
        </p>
      </div>
    );
  },
};
