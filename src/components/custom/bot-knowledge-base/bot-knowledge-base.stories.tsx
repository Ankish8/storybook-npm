import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotKnowledgeBase } from "./bot-knowledge-base";
import type { KnowledgeBaseFile } from "./types";

const meta: Meta<typeof BotKnowledgeBase> = {
  title: "Custom/AI Bot/Bot Config/BotKnowledgeBase",
  component: BotKnowledgeBase,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Knowledge base section for bot configuration. Displays uploaded files with status badges and action buttons.

**Install**
\`\`\`bash
npx myoperator-ui add bot-knowledge-base
\`\`\`

**Import**
\`\`\`tsx
import { BotKnowledgeBase } from "@/components/custom/bot-knowledge-base"
\`\`\`

### Design Tokens

| Token | Description | Preview |
|-------|-------------|---------|
| \`--semantic-text-primary\` | Section title | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-secondary\` | File name text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-secondary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-muted\` | Empty state text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-muted);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-border-layout\` | Section divider | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-border-layout);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-warning-primary\` | Training badge text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-warning-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-success-primary\` | Ready badge text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-success-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-error-primary\` | Failed badge text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-error-primary);border-radius:2px;vertical-align:middle" /> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_FILES: KnowledgeBaseFile[] = [
  { id: "1", name: "FAQ.pdf", status: "ready" },
  { id: "2", name: "Product_Catalog.csv", status: "training" },
  { id: "3", name: "Support_Docs.docx", status: "pending" },
];

const ALL_STATUS_FILES: KnowledgeBaseFile[] = [
  { id: "1", name: "Trained_Data.pdf", status: "ready" },
  { id: "2", name: "In_Progress.csv", status: "training" },
  { id: "3", name: "Queued_File.docx", status: "pending" },
  { id: "4", name: "Error_File.xlsx", status: "failed" },
];

export const Default: Story = {
  render: function Render() {
    const [files, setFiles] = useState<KnowledgeBaseFile[]>(SAMPLE_FILES);
    return (
      <div className="max-w-[500px]">
        <BotKnowledgeBase
          files={files}
          onAddFile={() => alert("Open file picker")}
          onDownloadFile={(id) => alert(`Download file: ${id}`)}
          onDeleteFile={(id) =>
            setFiles((prev) => prev.filter((f) => f.id !== id))
          }
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <BotKnowledgeBase
        files={[]}
        onAddFile={() => alert("Open file picker")}
      />
    </div>
  ),
};

export const WithAllStatuses: Story = {
  name: "With All Statuses",
  render: () => (
    <div className="max-w-[500px]">
      <BotKnowledgeBase
        files={ALL_STATUS_FILES}
        onDownloadFile={(id) => alert(`Download: ${id}`)}
        onDeleteFile={(id) => alert(`Delete: ${id}`)}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <BotKnowledgeBase
        files={ALL_STATUS_FILES}
        onAddFile={() => {}}
        onDownloadFile={() => {}}
        onDeleteFile={() => {}}
        disabled
      />
    </div>
  ),
};
