import type { Meta, StoryObj } from "@storybook/react";
import { Rocket } from "lucide-react";

import { Callout } from "./callout";

const meta: Meta<typeof Callout> = {
  title: "Practice/Callout",
  component: Callout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A **practice** component — a colored notice box for tips, confirmations, and warnings.

> ℹ️ This lives in \`src/practice/\` and is **not** part of the published \`myoperator-ui\` library.
> It exists purely to practice building components and stories in Storybook.

## Import

\`\`\`tsx
import { Callout } from "@/practice/callout"
\`\`\`

## What to try in Storybook

- Switch the **variant** control to see the four status colors and auto-selected icons.
- Toggle **dismissible** and click the ✕ to hide it.
- Edit **title** and the body **children** text live.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "Status color and default icon",
    },
    title: {
      control: "text",
      description: "Bold heading above the message",
    },
    children: {
      control: "text",
      description: "Body message",
    },
    dismissible: {
      control: "boolean",
      description: "Show a close button",
    },
    icon: {
      control: false,
      description: "Custom icon (pass null to hide)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    variant: "info",
    title: "Did you know?",
    children: "You can edit these controls in the panel below to see the component react.",
    dismissible: false,
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Just so you know",
    children: "Messages are synced across all your devices automatically.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "All set!",
    children: "Your integration was connected successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Double-check this",
    children: "Changing the number will re-verify your WhatsApp account.",
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    variant: "error",
    title: "Something went wrong",
    children: "We couldn't reach the server. Please try again in a moment.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Callout variant="info" title="Info">Neutral information for the user.</Callout>
      <Callout variant="success" title="Success">The operation completed without issues.</Callout>
      <Callout variant="warning" title="Warning">Proceed carefully — this has side effects.</Callout>
      <Callout variant="error" title="Error">The request failed and was not saved.</Callout>
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    variant: "warning",
    title: "You can close me",
    children: "Click the ✕ on the right to dismiss this callout.",
    dismissible: true,
  },
};

export const TitleOnly: Story = {
  args: {
    variant: "success",
    title: "Saved automatically",
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    title: "New feature",
    children: "Bot follow-ups are now available in your dashboard.",
    icon: <Rocket />,
  },
};
