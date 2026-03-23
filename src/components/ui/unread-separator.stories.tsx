import type { Meta, StoryObj } from "@storybook/react";
import { UnreadSeparator } from "./unread-separator";

const meta: Meta<typeof UnreadSeparator> = {
  title: "Components/Unread Separator",
  component: UnreadSeparator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A horizontal divider with a centered unread message count label. Used in chat message lists to visually separate read messages from unread ones.

\`\`\`bash
npx myoperator-ui add unread-separator
\`\`\`

## Import

\`\`\`tsx
import { UnreadSeparator } from "@/components/ui/unread-separator"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Divider Line</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Horizontal line on both sides of the label</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Muted text color for the unread count label</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Background behind label text to create visual break over the line</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: "number",
      description: "Number of unread messages",
    },
    label: {
      control: "text",
      description:
        'Custom label text. Defaults to "{count} unread message(s)"',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    count: 3,
  },
};

export const SingleMessage: Story = {
  name: "Single Message",
  args: {
    count: 1,
  },
};

export const MultipleMessages: Story = {
  name: "Multiple Messages",
  args: {
    count: 12,
  },
};

export const CustomLabel: Story = {
  name: "Custom Label",
  args: {
    count: 5,
    label: "5 new messages since you left",
  },
};
