import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { FileUploadModal } from "./file-upload-modal";

const meta: Meta<typeof FileUploadModal> = {
  title: "Custom/FileUploadModal",
  component: FileUploadModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A reusable file upload modal with drag-and-drop, progress tracking, and error handling.

### Installation

\`\`\`bash
npx myoperator-ui add file-upload-modal
\`\`\`

### Import

\`\`\`tsx
import { FileUploadModal } from "@/components/custom/file-upload-modal"
import type { FileUploadModalProps, UploadProgressHandlers } from "@/components/custom/file-upload-modal"
\`\`\`

### Usage Modes

**1. Real upload (controlled progress):**
\`\`\`tsx
<FileUploadModal
  open={open}
  onOpenChange={setOpen}
  onUpload={async (file, { onProgress, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onerror = () => onError("Network error");

    return new Promise((resolve, reject) => {
      xhr.onload = () => xhr.status === 200 ? resolve() : reject(new Error("Upload failed"));
      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    });
  }}
  onSave={(files) => console.log("Saved:", files)}
/>
\`\`\`

**2. Demo mode (fake progress, no onUpload):**
\`\`\`tsx
<FileUploadModal open={open} onOpenChange={setOpen} />
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Surface | \`--semantic-bg-primary\` | Modal background | <span style="color:#FFFFFF">■</span> |
| Drop zone | \`--semantic-bg-ui\` | Drop area background | <span style="color:#F5F5F5">■</span> |
| Progress bar | \`--semantic-success-primary\` | Upload progress fill | <span style="color:#17B26A">■</span> |
| Error text | \`--semantic-error-primary\` | Error messages | <span style="color:#F04438">■</span> |
| Link | \`--semantic-text-link\` | Sample download link | <span style="color:#2BBCCA">■</span> |
| Border | \`--semantic-border-layout\` | Card and drop zone borders | <span style="color:#E9EAEB">■</span> |
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    onOpenChange: { table: { disable: true } },
    title: { control: "text" },
    acceptedFormats: { control: "text" },
    formatDescription: { control: "text" },
    maxFileSizeMB: { control: "number" },
    multiple: { control: "boolean" },
    uploadButtonLabel: { control: "text" },
    dropDescription: { control: "text" },
    saveLabel: { control: "text" },
    cancelLabel: { control: "text" },
    sampleDownloadLabel: { control: "text" },
    saving: { control: "boolean" },
  },
  args: {
    onSave: fn(),
    onCancel: fn(),
    onSampleDownload: fn(),
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
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/** Default demo mode with fake progress — no `onUpload` provided. */
export const Default: Story = {
  render: (args) => <ModalPreview {...args} />,
};

/** With sample file download link. */
export const WithSampleDownload: Story = {
  name: "With Sample Download",
  args: {
    onSampleDownload: fn(),
    sampleDownloadLabel: "Download sample file",
  },
  render: (args) => <ModalPreview {...args} />,
};

/** Simulates real upload with progress callbacks. */
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
            // Simulate a real upload with progress
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

/** Demonstrates upload error handling. */
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
            // Simulate progress then error
            for (let i = 0; i <= 45; i += 15) {
              await new Promise((r) => setTimeout(r, 400));
              onProgress(i);
            }
            onError("Server error: file type not supported");
            // Throw to also trigger catch path
            throw new Error("Server error: file type not supported");
          }}
        />
      </div>
    );
  },
};

/** Custom formats — images only. */
export const ImageUpload: Story = {
  name: "Image Upload",
  args: {
    title: "Upload Images",
    acceptedFormats: ".jpg,.jpeg,.png,.gif,.webp",
    formatDescription:
      "Supported: JPG, PNG, GIF, WebP. Max 10 MB.",
    maxFileSizeMB: 10,
    uploadButtonLabel: "Choose images",
    dropDescription: "or drag and drop images here",
  },
  render: (args) => <ModalPreview {...args} />,
};

/** Single file upload only. */
export const SingleFile: Story = {
  name: "Single File",
  args: {
    title: "Upload Document",
    multiple: false,
    formatDescription: "Upload one file at a time. Max 50 MB.",
    maxFileSizeMB: 50,
  },
  render: (args) => <ModalPreview {...args} />,
};
