import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ClearLocalChatData } from "./clear-local-chat-data";

const meta: Meta<typeof ClearLocalChatData> = {
  title: "Custom/Chat/Clear Local Chat Data",
  component: ClearLocalChatData,
  args: {
    title: "Clear Local Chat Data",
    description:
      "This will clear all local chat data stored in your browser. Don't worry—your messages will load again the next time you open the chat page.",
    buttonText: "Clear Data",
    onClearDataClick: fn(),
    loading: false,
  },
  argTypes: {
    title: {
      control: "text",
      description: "Section heading (`h2`).",
    },
    description: {
      control: "text",
      description: "Body copy under the title.",
    },
    buttonText: {
      control: "text",
      description: "Destructive button label.",
    },
    onClearDataClick: {
      description: "Fires when the destructive button is pressed.",
    },
    loading: {
      control: "boolean",
      description: "Passes through to `Button` `loading` (disables + spinner).",
    },
    className: {
      control: "text",
      description: "Merged onto the root wrapper.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Settings-style block for clearing browser-stored chat data. Uses **Typography** (\`title\` / \`large\` for the heading, \`body\` / \`medium\` + \`muted\` for the description) and **Button** \`destructive\`.

### Installation

\`\`\`bash
npx myoperator-ui add clear-local-chat-data
\`\`\`

### Import

\`\`\`tsx
import { ClearLocalChatData } from "@/components/custom/clear-local-chat-data"
\`\`\`

### Props & events

| Prop | Type | Notes |
|------|------|--------|
| \`title\` | \`string\` | Page/section heading |
| \`description\` | \`string\` | Explanatory paragraph |
| \`buttonText\` | \`string\` | CTA label |
| \`onClearDataClick\` | \`(e) => void\` | Destructive action |
| \`loading\` | \`boolean\` | Optional busy state |
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClearLocalChatData>;

export const Overview: Story = {
  decorators: [
    (Story) => (
      <div className="bg-semantic-bg-primary p-8">
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  decorators: Overview.decorators,
};
