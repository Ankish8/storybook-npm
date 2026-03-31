import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { fn } from "storybook/test";
import { ChatProvider, useChatContext } from "../chat-provider";
import { MockTransport } from "../chat-transport";
import { ChatTemplateModal } from "./chat-template-modal";
import { Button } from "../../ui/button";

/* ── Wrapper with button trigger (open/close) ── */
function TemplateModalWithTrigger() {
  const { selectChat, showTemplateModal, setShowTemplateModal } =
    useChatContext();

  const handleOpen = () => {
    selectChat("1");
    setShowTemplateModal(true);
  };

  return (
    <>
      <Button onClick={handleOpen}>Select Template</Button>
      {showTemplateModal && <ChatTemplateModal />}
    </>
  );
}

/* ── Wrapper that auto-opens the template modal ── */
function TemplateModalWrapper() {
  const { selectChat, setShowTemplateModal } = useChatContext();
  useEffect(() => {
    selectChat("1");
    setShowTemplateModal(true);
  }, [selectChat, setShowTemplateModal]);
  return <ChatTemplateModal />;
}

const transport = new MockTransport();

const meta: Meta<typeof ChatTemplateModal> = {
  title: "Custom/Chat/Chat Template Modal",
  component: ChatTemplateModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A full-featured template selection modal for sending pre-approved WhatsApp template messages. Features a two-column layout with template selectors + variable mapping on the left, and a live preview on the right.

### Installation

\`\`\`bash
npx myoperator-ui add chat-template
\`\`\`

### Import

\`\`\`tsx
import { ChatTemplateModal } from "@/components/custom/chat-template-modal"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onCreateNew: fn(),
  },
  argTypes: {
    illustrationSrc: {
      control: "text",
      description:
        "URL of a custom illustration image shown in the empty preview state (right panel) when no template is selected.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    onCreateNew: {
      control: false,
      description:
        'Callback fired when the user clicks the **"Create new"** link below the template selector. Use this to navigate to your template creation flow.',
      table: {
        type: { summary: "() => void" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
  decorators: [
    (Story) => (
      <ChatProvider transport={transport}>
        <Story />
      </ChatProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatTemplateModal>;

/**
 * Click the **Select Template** button to open the modal.
 * Close it with the × button in the top-right corner.
 */
export const Docs: Story = {
  name: "Docs",
  render: () => <TemplateModalWithTrigger />,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story: `
Click **Select Template** to open the modal. Dismiss it with the × close button.

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Background | — | Modal bg | <span style="color:#ffffff">&#9632;</span> \`white\` |
| Panel bg | \`--semantic-bg-ui\` | Preview area bg | <span style="color:#f5f5f5">&#9632;</span> \`#F5F5F5\` |
| Text primary | \`--semantic-text-primary\` | Title, template text | <span style="color:#181d27">&#9632;</span> \`#181D27\` |
| Text muted | \`--semantic-text-muted\` | Subtitle, empty state text | <span style="color:#717680">&#9632;</span> \`#717680\` |
| Text secondary | \`--semantic-text-secondary\` | "PREVIEW" label | <span style="color:#535862">&#9632;</span> \`#535862\` |
| Text link | \`--semantic-text-link\` | "Create new" link, variable highlights | <span style="color:#47b5bc">&#9632;</span> \`#47B5BC\` |
| Border | \`--semantic-border-layout\` | Section dividers | <span style="color:#e9eaeb">&#9632;</span> \`#E9EAEB\` |
| Info surface | \`--semantic-info-surface\` | Preview bubble bg | <span style="color:#eff8ff">&#9632;</span> \`info-surface\` |
| Error surface | \`--semantic-error-surface\` | Delete hover bg | <span style="color:#fef3f2">&#9632;</span> \`#FEF3F2\` |
| Error primary | \`--semantic-error-primary\` | Delete icon color | <span style="color:#f04438">&#9632;</span> \`#F04438\` |

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`illustrationSrc\` | \`string\` | No | Custom illustration for empty preview state |
| \`onCreateNew\` | \`() => void\` | No | Callback when "Create new" link is clicked |

### Layout

- **Left column** (wider): Category dropdown, searchable Template dropdown, "Template not found? Create new" link, Variables/Media tabs with tab animations
- **Right column**: "PREVIEW" header with eye icon, live bubble preview (text/image/carousel), "Send Template" button with shadow footer

### Template Types

| Type | Preview |
|------|---------|
| Text | Simple text bubble with optional reply button |
| Image | Image + text bubble |
| Carousel | Scrollable cards with images, body text, and action buttons |

### Variable Mapping

- **Variables tab**: Input fields for each \`{{variable}}\` in the template body. Carousel templates show per-card sections.
- **Media tab**: Drag-drop upload zones for each carousel card image (JPG/PNG, 5MB max). Shows thumbnail + filename + delete button when uploaded.

### Context Dependency

Reads \`templates\`, \`sendTemplate\`, \`setShowTemplateModal\` from \`useChatContext()\`.
        `,
      },
    },
  },
};

/* ── Empty State (auto-open, hidden from docs page) ── */

export const DefaultEmpty: Story = {
  name: "Empty State",
  render: () => <TemplateModalWrapper />,
  parameters: {
    docs: {
      disable: true,
    },
  },
};
