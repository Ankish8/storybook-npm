import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { KnowledgeBaseCard } from "./knowledge-base-card";
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
  { id: "1", name: "FAQ.pdf", status: "trained" },
  { id: "2", name: "Product_Catalog.csv", status: "training" },
  { id: "3", name: "Support_Docs.docx", status: "error" },
];

export const Overview: Story = {
  render: function Render() {
    const [files, setFiles] = useState<KnowledgeBaseFile[]>(SAMPLE_FILES);
    return (
      <div className="max-w-[500px]">
        <KnowledgeBaseCard
          files={files}
          onSaveFiles={(uploaded) => {
            const newFiles = uploaded.map((f, i) => ({
              id: `new-${Date.now()}-${i}`,
              name: f.name,
              status: "training" as const,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
          }}
          onDelete={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
    return (
      <div className="max-w-[500px]">
        <KnowledgeBaseCard
          files={files}
          onSaveFiles={(uploaded) => {
            const newFiles = uploaded.map((f, i) => ({
              id: `new-${Date.now()}-${i}`,
              name: f.name,
              status: "training" as const,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
          }}
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
