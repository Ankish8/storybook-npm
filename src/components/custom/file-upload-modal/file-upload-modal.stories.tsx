import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { FileUploadModal } from "./file-upload-modal";

const meta: Meta<typeof FileUploadModal> = {
  title: "Components/FileUploadModal",
  component: FileUploadModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A reusable file upload modal with drag-and-drop, progress tracking, and error handling.

Supports two modes:
- **Real upload**: Provide \`onUpload\` callback with progress/error handlers
- **Demo mode**: Omit \`onUpload\` for fake progress simulation

### Install

\`\`\`bash
npx myoperator-ui add file-upload-modal
\`\`\`

### Import

\`\`\`tsx
import { FileUploadModal } from "@/components/custom/file-upload-modal"
import type { FileUploadModalProps, UploadProgressHandlers } from "@/components/custom/file-upload-modal"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Surface | \`--semantic-bg-primary\` | Modal background | <span style="color:#FFFFFF">■</span> |
| Drop zone | \`--semantic-bg-ui\` | Drop area background | <span style="color:#F5F5F5">■</span> |
| Progress bar | \`--semantic-success-primary\` | Upload progress fill | <span style="color:#17B26A">■</span> |
| Error text | \`--semantic-error-primary\` | Error messages | <span style="color:#F04438">■</span> |
| Link | \`--semantic-text-link\` | Sample download link | <span style="color:#2BBCCA">■</span> |
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    title: { control: "text" },
    maxFileSizeMB: { control: "number" },
    multiple: { control: "boolean" },
    saving: { control: "boolean" },
  },
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalPreview(
  args: Partial<React.ComponentProps<typeof FileUploadModal>>
) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open File Upload
      </Button>
      <FileUploadModal
        {...args}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

/** Demo mode — fake progress, no real upload. */
export const Default: Story = {
  render: (args) => <ModalPreview {...args} />,
};

/** With sample file download link. */
export const WithSampleDownload: Story = {
  name: "With Sample Download",
  args: {
    onSampleDownload: fn(),
  },
  render: (args) => <ModalPreview {...args} />,
};

/** Simulates a real upload with progress callbacks. */
export const RealUpload: Story = {
  name: "Real Upload (Simulated)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open File Upload
        </Button>
        <FileUploadModal
          {...args}
          open={open}
          onOpenChange={setOpen}
          onUpload={async (_file, { onProgress }) => {
            for (let i = 0; i <= 100; i += 10) {
              await new Promise((r) => setTimeout(r, 300));
              onProgress(i);
            }
          }}
          onSave={(files) => {
            alert(`Saved ${files.length} file(s)`);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

/** Shows how upload errors are displayed. */
export const UploadError: Story = {
  name: "Upload Error",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open File Upload
        </Button>
        <FileUploadModal
          {...args}
          open={open}
          onOpenChange={setOpen}
          onUpload={async (_file, { onProgress, onError }) => {
            for (let i = 0; i <= 45; i += 15) {
              await new Promise((r) => setTimeout(r, 400));
              onProgress(i);
            }
            onError("Server error: file type not supported");
            throw new Error("Server error: file type not supported");
          }}
        />
      </div>
    );
  },
};
