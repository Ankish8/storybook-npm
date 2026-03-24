import type { Meta, StoryObj } from "@storybook/react";
import { SystemMessage } from "./system-message";

const meta: Meta<typeof SystemMessage> = {
  title: "Custom/Chat/System Message",
  component: SystemMessage,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A centered, muted text message for system/timeline events in chat interfaces. Supports **bold** markdown-style formatting — text wrapped in double asterisks becomes bold and styled with the link color.

\`\`\`bash
npx myoperator-ui add system-message
\`\`\`

## Import

\`\`\`tsx
import { SystemMessage } from "@/components/ui/system-message"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Muted Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Link Text (bold parts)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2E90FA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2E90FA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Font Size</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">13px</td>
      <td style="padding: 12px 16px;">--</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description:
        "The message text. Supports **bold** markdown syntax which renders as link-colored bold text.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    children: "Assigned to **Alex Smith** by **Admin**",
  },
};

export const AssignmentMessage: Story = {
  args: {
    children: "Assigned to **Alex Smith** by **Admin**",
  },
};

export const PlainText: Story = {
  args: {
    children: "Chat was closed",
  },
};

export const MultipleBold: Story = {
  args: {
    children:
      "**John Doe** transferred this chat from **Sales** to **Support**",
  },
};

export const InTimeline: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[400px]">
      <div className="flex justify-center">
        <span className="text-xs text-semantic-text-muted bg-semantic-bg-ui px-3 py-1 rounded-full">
          Today
        </span>
      </div>
      <SystemMessage>Chat started by **Customer**</SystemMessage>
      <div className="bg-semantic-bg-ui rounded-lg p-3 max-w-[80%]">
        <p className="m-0 text-sm">Hello, I need help with my order.</p>
      </div>
      <SystemMessage>Assigned to **Alex Smith** by **Admin**</SystemMessage>
      <div className="bg-semantic-primary-surface rounded-lg p-3 max-w-[80%] self-end">
        <p className="m-0 text-sm">
          Hi! I&apos;d be happy to help you with that.
        </p>
      </div>
      <SystemMessage>
        **Alex Smith** added a note
      </SystemMessage>
      <SystemMessage>Chat was closed</SystemMessage>
    </div>
  ),
};
