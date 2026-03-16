import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { KnowledgeBaseCard } from "./knowledge-base-card";
import { BOT_KNOWLEDGE_STATUS } from "./types";
import type { KnowledgeBaseFile } from "./types";

const meta: Meta<typeof KnowledgeBaseCard> = {
  title: "Custom/AI Bot/Knowledge Base Card",
  component: KnowledgeBaseCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `The Knowledge Base card for managing file uploads used to train the bot. Includes file list with status badges, download/delete actions, and a file upload modal with drag-and-drop.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { KnowledgeBaseCard } from "@/components/custom/ivr-bot/knowledge-base-card"
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_FILES: KnowledgeBaseFile[] = [
  { id: "1", name: "FAQ.pdf",              status: BOT_KNOWLEDGE_STATUS.READY      },
  { id: "2", name: "Product_Catalog.csv",  status: BOT_KNOWLEDGE_STATUS.PROCESSING },
  { id: "3", name: "Support_Docs.docx",    status: BOT_KNOWLEDGE_STATUS.FAILED     },
  { id: "4", name: "Training_Data.xlsx",   status: BOT_KNOWLEDGE_STATUS.PENDING    },
];

export const Overview: Story = {
  render: function Render() {
    const [files, setFiles] = useState<KnowledgeBaseFile[]>(SAMPLE_FILES);
    return (
      <div className="max-w-[500px]">
        <KnowledgeBaseCard
          files={files}
          onAdd={() => alert("Open file upload modal")}
          onDownload={(id) => alert(`Download file: ${id}`)}
          onDelete={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    return (
      <div className="max-w-[500px]">
        <KnowledgeBaseCard
          files={[]}
          onAdd={() => alert("Open file upload modal")}
        />
      </div>
    );
  },
};

/** All interactive elements are disabled in view mode. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <KnowledgeBaseCard
        files={SAMPLE_FILES}
        disabled
      />
    </div>
  ),
};
