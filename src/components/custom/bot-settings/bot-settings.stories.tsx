import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotSettings } from "./bot-settings";

const meta: Meta<typeof BotSettings> = {
  title: "Custom/AI Bot/Bot Config/BotSettings",
  component: BotSettings,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Collapsible settings section for bot configuration. Contains a "Connect WhatsApp" subsection with a multi-phone-number tag input.

**Install**
\`\`\`bash
npx myoperator-ui add bot-settings
\`\`\`

**Import**
\`\`\`tsx
import { BotSettings } from "@/components/custom/bot-settings"
\`\`\`

### Design Tokens

| Token | Purpose | Preview |
|-------|---------|---------|
| \`--semantic-text-primary\` | Title & label text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-primary);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-muted\` | Chevron & info icon | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-muted);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-info-surface\` | Tag chip background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-info-surface);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-bg-primary\` | Section background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-bg-primary);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-border-layout\` | Borders & dividers | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-border-layout);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [phones, setPhones] = useState([
      "+91 9876543210",
      "+91 8765432109",
      "+91 7654321098",
    ]);
    return (
      <div className="max-w-[500px]">
        <BotSettings
          phoneNumbers={phones}
          onRemovePhoneNumber={(phone) =>
            setPhones((prev) => prev.filter((p) => p !== phone))
          }
          onOpenDropdown={() => alert("Dropdown opened")}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    return (
      <div className="max-w-[500px]">
        <BotSettings
          phoneNumbers={[]}
          onOpenDropdown={() => alert("Dropdown opened")}
        />
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: function Render() {
    return (
      <div className="max-w-[500px]">
        <BotSettings
          defaultOpen={false}
          phoneNumbers={["+91 9876543210"]}
        />
      </div>
    );
  },
};
