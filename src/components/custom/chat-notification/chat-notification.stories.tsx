import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ChatNotification } from "./chat-notification";

const meta: Meta<typeof ChatNotification> = {
  title: "Custom/Chat/Chat Notification",
  component: ChatNotification,
  args: {
    type: "warning",
    message:
      "WhatsApp chat notifications are blocked. Click here to enable them.",
    actionText: "Enable",
    onActionClick: fn(),
    closable: false,
    onDismiss: fn(),
  },
  argTypes: {
    type: {
      control: "select",
      options: ["warning", "error"],
      description:
        "`warning` → `Alert` warning surface (e.g. blocked notifications). `error` → error surface (e.g. low balance).",
    },
    message: {
      control: "text",
      description: "Primary line shown before the optional action link.",
    },
    actionText: {
      control: "text",
      description:
        "Trailing `Button` (`link` variant) label. Omit for message-only banner.",
    },
    onActionClick: {
      description: "Click handler for the link action (`Button`, `type=\"button\"`).",
    },
    closable: {
      control: "boolean",
      description: "When true, shows the Alert dismiss control (see `onDismiss`).",
    },
    onDismiss: {
      description:
        "Called when the dismiss control is used. Only relevant when `closable` is true.",
    },
    open: {
      control: "boolean",
      description: "Controlled visibility (forwarded to underlying `Alert`).",
    },
    defaultOpen: {
      control: "boolean",
      description: "Uncontrolled initial open state (forwarded to `Alert`).",
    },
    className: {
      control: "text",
      description: "Merged onto the root `Alert` container.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Chat nudge banner for the top of the chat area. Built from **Alert** (warning / error), **Typography** (body / medium), and **Button** (link).

### Installation

\`\`\`bash
npx myoperator-ui add chat-notification
\`\`\`

### Import

\`\`\`tsx
import { ChatNotification } from "@/components/custom/chat-notification"
\`\`\`

### Props & events

| Prop | Type | Notes |
|------|------|--------|
| \`type\` | \`"warning" \\| "error"\` | Chooses Alert variant / text tone |
| \`message\` | \`string\` | Main copy |
| \`actionText\` | \`string\` (optional) | Link label; omit for text-only |
| \`onActionClick\` | \`(e) => void\` (optional) | Link button click |
| \`closable\` | \`boolean\` | Alert dismiss UI |
| \`onDismiss\` | \`() => void\` (optional) | After dismiss click |
| \`open\` / \`defaultOpen\` | \`boolean\` | Optional visibility control |

Uses **semantic** tokens from \`Alert\`: \`bg-semantic-warning-surface\` / \`bg-semantic-error-surface\`, etc.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatNotification>;

export const Overview: Story = {
  decorators: [
    (Story) => (
      <div className="bg-semantic-bg-primary p-6">
        <Story />
      </div>
    ),
  ],
};

export const WhatsAppBlocked: Story = {
  name: "Warning · Notifications blocked",
  args: {
    type: "warning",
    message:
      "WhatsApp chat notifications are blocked. Click here to enable them.",
    actionText: "Enable",
  },
  decorators: Overview.decorators,
};

export const LowBalance: Story = {
  name: "Error · Low balance",
  args: {
    type: "error",
    message:
      "Your balance is low. Please add funds to continue using the service.",
    actionText: "Recharge Now",
  },
  decorators: Overview.decorators,
};

export const MessageOnly: Story = {
  name: "No action link",
  args: {
    type: "warning",
    message: "Notifications are paused until you return to this tab.",
    actionText: undefined,
  },
  decorators: Overview.decorators,
};

export const Dismissible: Story = {
  args: {
    type: "warning",
    message: "This nudge can be dismissed.",
    actionText: "Details",
    closable: true,
  },
  decorators: Overview.decorators,
};

export const AllTypes: Story = {
  name: "All types",
  render: (args) => (
    <div className="space-y-3 bg-semantic-bg-primary p-6">
      <ChatNotification
        {...args}
        type="warning"
        message="WhatsApp chat notifications are blocked. Click here to enable them."
        actionText="Enable"
        onActionClick={args.onActionClick}
      />
      <ChatNotification
        {...args}
        type="error"
        message="Your balance is low. Please add funds to continue using the service."
        actionText="Recharge Now"
        onActionClick={args.onActionClick}
      />
    </div>
  ),
};
