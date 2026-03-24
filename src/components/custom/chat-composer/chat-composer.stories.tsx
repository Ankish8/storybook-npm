import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { ChatComposer } from "./chat-composer";
import { Button } from "../../ui/button";
import { Paperclip, LayoutGrid, Smile } from "lucide-react";

const meta: Meta<typeof ChatComposer> = {
  title: "Custom/Chat/Chat Composer",
  component: ChatComposer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A message composition area with textarea, action buttons, reply-to preview, attachment slot, and send button. Supports an "expired" state showing a template prompt instead of the full composer.

### Installation

\`\`\`bash
npx myoperator-ui add chat-composer
\`\`\`

### Import

\`\`\`tsx
import { ChatComposer } from "@/components/custom/chat-composer"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Background | \`--semantic-bg-ui\` | Composer outer bg | <span style="color:#f5f5f5">&#9632;</span> \`#F5F5F5\` |
| Card bg | — | Inner card bg | <span style="color:#ffffff">&#9632;</span> \`#FFFFFF\` |
| Text primary | \`--semantic-text-primary\` | Textarea text | <span style="color:#181d27">&#9632;</span> \`#181D27\` |
| Text muted | \`--semantic-text-muted\` | Placeholder, expired message | <span style="color:#717680">&#9632;</span> \`#717680\` |
| Border | \`--semantic-border-layout\` | Textarea border | <span style="color:#e9eaeb">&#9632;</span> \`#E9EAEB\` |
| Focus border | \`--semantic-border-focus\` | Textarea focus ring | <span style="color:#2bbcca">&#9632;</span> \`#2BBCCA\` |
| Primary | \`--semantic-primary\` | Send button bg | <span style="color:#343e55">&#9632;</span> \`#343E55\` |
| onKeyDown | — | Textarea keyboard event | — |

### Keyboard

The \`onKeyDown\` prop exposes the textarea's keyboard events, enabling:
- **Enter to send**: \`e.key === "Enter" && !e.shiftKey\`
- **Shift+Enter**: New line (default textarea behavior)
- **Escape**: Dismiss canned messages or reply preview
- **Arrow keys**: Navigate autocomplete/canned-message menus

### Auto Resize

The textarea automatically grows as the user types, up to \`max-h-[120px]\` (approximately 5 lines). It shrinks back when content is removed.

### Accessibility

- The textarea supports configurable \`id\` (via \`textareaId\`) and \`aria-label\` (via \`textareaAriaLabel\`). When no custom aria-label is provided, the \`placeholder\` value is used.
- The \`onKeyDown\` prop exposes keyboard events for Enter-to-send and Escape handling.
- Dismissing a reply automatically returns focus to the textarea.
- The expired state bar is announced to screen readers via \`role="status"\`.
- The root element has \`role="region"\` with a default \`aria-label="Message composer"\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSend: fn(),
    onChange: fn(),
    onDismissReply: fn(),
    onReplyClick: fn(),
    onTemplateClick: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, background: "#f5f5f5", borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatComposer>;

/* ── Default ── */

export const Default: Story = {
  args: {
    placeholder: "Type a message",
  },
};

/* ── With Reply ── */

export const WithReply: Story = {
  name: "With Reply Preview",
  args: {
    reply: {
      sender: "Aditi Kumar",
      message: "Have a look at this document, it has all the details.",
    },
    placeholder: "Type a message",
  },
};

/* ── With Attachment ── */

export const WithAttachment: Story = {
  name: "With Attachment Preview",
  args: {
    placeholder: "Type a message",
    attachment: (
      <div className="flex items-center gap-2 px-3 py-2 border-b border-semantic-border-layout">
        <div className="w-10 h-10 rounded bg-semantic-bg-ui flex items-center justify-center text-xs text-semantic-text-muted">
          IMG
        </div>
        <span className="text-sm text-semantic-text-secondary">
          screenshot.png
        </span>
      </div>
    ),
  },
};

/* ── With Actions ── */

export const WithActions: Story = {
  name: "With Action Buttons",
  args: {
    placeholder: "Type '/' for canned message",
    leftActions: (
      <>
        <Button variant="ghost" size="icon-sm">
          <Paperclip className="size-[18px]" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <LayoutGrid className="size-[18px]" />
        </Button>
      </>
    ),
    rightActions: (
      <Button variant="ghost" size="icon-sm">
        <Smile className="size-[18px]" />
      </Button>
    ),
  },
};

/* ── Expired State ── */

export const ExpiredState: Story = {
  args: {
    expired: true,
  },
};

/* ── Disabled ── */

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Cannot type here",
  },
};

/* ── Full Example ── */

function FullExampleComposer() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState<{
    sender: string;
    message: string;
  } | null>({ sender: "Aditi Kumar", message: "Have a look at this document" });

  return (
    <ChatComposer
      value={text}
      onChange={setText}
      onSend={() => {
        setText("");
        setReply(null);
      }}
      placeholder="Type '/' for canned message"
      reply={reply ?? undefined}
      onDismissReply={() => setReply(null)}
      onReplyClick={() => {}}
      leftActions={
        <>
          <Button variant="ghost" size="icon-sm">
            <Paperclip className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <LayoutGrid className="size-[18px]" />
          </Button>
        </>
      }
      rightActions={
        <Button variant="ghost" size="icon-sm">
          <Smile className="size-[18px]" />
        </Button>
      }
      attachment={
        <div className="flex items-center gap-2 px-3 py-2 border-b border-semantic-border-layout">
          <div className="w-10 h-10 rounded bg-semantic-bg-ui flex items-center justify-center text-xs text-semantic-text-muted">
            IMG
          </div>
          <span className="text-sm text-semantic-text-secondary">
            photo.jpg
          </span>
        </div>
      }
    />
  );
}

export const FullExample: Story = {
  render: () => <FullExampleComposer />,
};

/* ── Enter to Send ── */

function EnterToSendComposer() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  return (
    <div>
      {sent.length > 0 && (
        <div className="px-4 pb-2 flex flex-col gap-1">
          {sent.map((msg, i) => (
            <div key={i} className="text-sm text-semantic-text-muted bg-semantic-bg-ui rounded px-3 py-1.5">
              Sent: {msg}
            </div>
          ))}
        </div>
      )}
      <ChatComposer
        value={text}
        onChange={setText}
        onSend={() => {
          if (text.trim()) {
            setSent((prev) => [...prev, text.trim()]);
            setText("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) {
              setSent((prev) => [...prev, text.trim()]);
              setText("");
            }
          }
        }}
        placeholder="Press Enter to send, Shift+Enter for new line"
      />
    </div>
  );
}

export const WithEnterToSend: Story = {
  name: "Enter to Send",
  render: () => <EnterToSendComposer />,
  parameters: {
    docs: {
      description: {
        story: "Use the `onKeyDown` prop to implement Enter-to-send. Shift+Enter inserts a new line instead.",
      },
    },
  },
};

/* ── Auto Resize ── */

function AutoResizeComposer() {
  const [text, setText] = useState("");

  return (
    <ChatComposer
      value={text}
      onChange={setText}
      placeholder="Type multiple lines — textarea grows automatically (up to 120px max height)"
      leftActions={
        <>
          <Button variant="ghost" size="icon-sm">
            <Paperclip className="size-[18px]" />
          </Button>
        </>
      }
      rightActions={
        <Button variant="ghost" size="icon-sm">
          <Smile className="size-[18px]" />
        </Button>
      }
    />
  );
}

export const AutoResize: Story = {
  render: () => <AutoResizeComposer />,
  parameters: {
    docs: {
      description: {
        story: "The textarea automatically grows as you type, up to a maximum height of 120px. It shrinks back when content is removed.",
      },
    },
  },
};

/* ── With Send Dropdown ── */

export const WithSendDropdown: Story = {
  args: {
    placeholder: "Type a message",
    showSendDropdown: true,
    sendLabel: "Send",
  },
  parameters: {
    docs: {
      description: {
        story: "The send button can show a dropdown chevron using `showSendDropdown`. Use this when the send action has multiple options (e.g., send now, schedule).",
      },
    },
  },
};
