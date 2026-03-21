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

/** View mode — Add button disabled, download enabled, delete disabled. */
export const ViewMode: Story = {
  name: "View Mode (disabled)",
  render: () => (
    <div className="max-w-[500px]">
      <KnowledgeBaseCard
        files={SAMPLE_FILES}
        onDownload={(id) => alert(`Download: ${id}`)}
        onDelete={() => {}}
        disabled
        deleteDisabled
      />
    </div>
  ),
};

/** Download only — user can download files but has no delete permission. */
export const DownloadOnly: Story = {
  name: "Download Only (no delete)",
  render: () => (
    <div className="max-w-[500px]">
      <KnowledgeBaseCard
        files={SAMPLE_FILES}
        onDownload={(id) => alert(`Download: ${id}`)}
        // onDelete omitted → delete button hidden
      />
    </div>
  ),
};

/** Delete only — user can delete files but has no download permission. */
export const DeleteOnly: Story = {
  name: "Delete Only (no download)",
  render: function Render() {
    const [files, setFiles] = useState<KnowledgeBaseFile[]>(SAMPLE_FILES);
    return (
      <div className="max-w-[500px]">
        <KnowledgeBaseCard
          files={files}
          // onDownload omitted → download button hidden
          onDelete={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

/** No actions — read-only list with no download or delete buttons. */
export const NoActions: Story = {
  name: "No Actions (read-only list)",
  render: () => (
    <div className="max-w-[500px]">
      <KnowledgeBaseCard
        files={SAMPLE_FILES}
        // both onDownload and onDelete omitted → no action buttons
      />
    </div>
  ),
};
