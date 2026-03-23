import type { Meta, StoryObj } from "@storybook/react";
import { ReplyQuote } from "./reply-quote";

const meta: Meta<typeof ReplyQuote> = {
  title: "Components/Reply Quote",
  component: ReplyQuote,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A quoted message block with a blue left border, showing sender name and quoted text. Used in chat applications for reply-to previews.

\`\`\`bash
npx myoperator-ui add reply-quote
\`\`\`

## Import

\`\`\`tsx
import { ReplyQuote } from "@/components/ui/reply-quote"
\`\`\`

## Accessibility

When an \`onClick\` handler is provided, ReplyQuote becomes an interactive element:
- **Keyboard navigation**: receives \`role="button"\` and \`tabIndex={0}\`, so keyboard users can Tab to it.
- **Keyboard activation**: pressing **Enter** or **Space** triggers the click handler.
- **Focus indicator**: a visible focus ring appears on keyboard focus (\`focus-visible\`).
- **Screen readers**: an \`aria-label\` of \`"Quoted reply from {sender}: {message}"\` is set by default, and can be overridden via the \`aria-label\` prop.

When no \`onClick\` is provided, the component renders as a static quote with no interactive ARIA attributes.

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
      <td style="padding: 12px 16px;">Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F5F5F5</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Hover Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">EBEBEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EBEBEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Left Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2E90FA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2E90FA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Sender Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Message Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sender: {
      control: "text",
      description: "Name of the person being quoted",
    },
    message: {
      control: "text",
      description: "The quoted message text",
    },
    onClick: {
      action: "clicked",
      description: "Handler for clicking the quote (e.g., scroll to original message)",
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
    sender: "John Doe",
    message: "Hey, can you check the latest deployment?",
  },
};

export const WithClickHandler: Story = {
  name: "With Click Handler",
  args: {
    sender: "Jane Smith",
    message: "Sure, I will take a look at it now.",
  },
};

export const LongText: Story = {
  name: "Long Text",
  args: {
    sender: "A Very Long Sender Name That Should Be Truncated Automatically",
    message:
      "This is a very long quoted message that should be truncated with an ellipsis because it exceeds the available width of the reply quote component in the chat interface.",
  },
};

export const InChatContext: Story = {
  name: "In Chat Context",
  render: () => (
    <div className="flex flex-col gap-2 rounded-lg border border-semantic-border-layout p-4 bg-white">
      <ReplyQuote
        sender="Alice"
        message="Can we schedule a meeting tomorrow?"
        onClick={() => {}}
      />
      <div className="bg-semantic-primary-surface rounded-lg px-4 py-2">
        <p className="text-sm text-semantic-text-primary m-0">
          Sure, how about 2 PM?
        </p>
      </div>
    </div>
  ),
};
