import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DocMedia } from "./doc-media";

const SAMPLE_PDF_CONTENT = `%PDF-1.1
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 54 >>
stream
BT
/F1 18 Tf
24 92 Td
(Doc Media sample file) Tj
ET
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;

const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  csv: "text/csv;charset=utf-8",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf: "application/pdf",
  txt: "text/plain;charset=utf-8",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const EXTENSION_BY_FILE_TYPE: Record<string, string> = {
  CSV: "csv",
  DOC: "doc",
  DOCX: "docx",
  PDF: "pdf",
  XLS: "xls",
  XLSX: "xlsx",
};

function getFileExtension(filename?: string, fileType?: string) {
  if (filename?.includes(".")) {
    return filename.split(".").pop()?.toLowerCase() || "txt";
  }

  if (fileType) {
    return EXTENSION_BY_FILE_TYPE[fileType.toUpperCase()] || fileType.toLowerCase();
  }

  return "txt";
}

function getDownloadFilename(filename?: string, fileType?: string) {
  if (filename?.trim()) {
    return filename;
  }

  return `sample-document.${getFileExtension(undefined, fileType)}`;
}

function createSampleFileBlob(filename?: string, fileType?: string) {
  const extension = getFileExtension(filename, fileType);
  const mimeType = MIME_TYPE_BY_EXTENSION[extension] || "application/octet-stream";
  const downloadFilename = getDownloadFilename(filename, fileType);

  if (extension === "pdf") {
    return new Blob([SAMPLE_PDF_CONTENT], { type: mimeType });
  }

  const content = [
    `Sample file generated for ${downloadFilename}`,
    `File type: ${fileType || extension.toUpperCase()}`,
    "",
    "This file is used by the Doc Media Storybook preview.",
  ].join("\n");

  return new Blob([content], { type: mimeType });
}

function downloadSampleFile(filename?: string, fileType?: string) {
  const downloadFilename = getDownloadFilename(filename, fileType);
  const blob = createSampleFileBlob(downloadFilename, fileType);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = downloadFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

function DocMediaStory(args: React.ComponentProps<typeof DocMedia>) {
  const handleDownload = React.useCallback(() => {
    downloadSampleFile(args.filename, args.fileType);
  }, [args.fileType, args.filename]);

  return (
    <DocMedia
      {...args}
      onDownload={args.variant === "file" ? handleDownload : undefined}
    />
  );
}

const meta: Meta<typeof DocMedia> = {
  title: "Custom/Chat/Doc Media",
  component: DocMedia,
  render: (args) => <DocMediaStory {...args} />,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A document media component for displaying documents in chat messages. Supports three variants: **preview** and **download** (both show full image thumbnail with gradient overlay, filename, and metadata — consistent appearance for agent and customer messages), and **file** (icon-centered preview with filetype badge and download button for documents without thumbnails).

### Installation

\`\`\`bash
npx myoperator-ui add doc-media
\`\`\`

### Import

\`\`\`tsx
import { DocMedia } from "@/components/custom/doc-media"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| File icon bg (spreadsheet) | — | XLS/XLSX icon background | <span style="color:#dcfae6">■</span> \`#DCFAE6\` |
| File icon (spreadsheet) | — | XLS/XLSX icon color | <span style="color:#217346">■</span> \`#217346\` |
| File icon bg (generic) | \`--border/border-layout\` | Generic icon background | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
| File icon (generic) | — | Generic icon color | <span style="color:#535862">■</span> \`#535862\` |
| Surface | \`--semantic-bg-ui\` | File variant surface | <span style="color:#f5f5f5">■</span> \`#F5F5F5\` |
| Filename | \`--semantic-text-primary\` | Filename text | <span style="color:#181d27">■</span> \`#181D27\` |
| Border | \`--semantic-border-layout\` | File variant border | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
| Gradient overlay | — | Preview variant overlay | <span style="color:#1d222f">■</span> \`#1D222F\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380, background: "white" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DocMedia>;

export const PDFPreview: Story = {
  args: {
    variant: "preview",
    thumbnailUrl: "https://placehold.co/442x308/e2e8f0/64748b?text=PDF+Preview",
    filename: "Annual_Report_2025.pdf",
    fileType: "PDF",
    pageCount: 24,
    fileSize: "3.2 MB",
  },
};

export const ImageDownload: Story = {
  args: {
    variant: "download",
    thumbnailUrl: "https://placehold.co/442x308/e2e8f0/64748b?text=Document+Image",
    filename: "Invoice_Scan.pdf",
    fileType: "PDF",
    pageCount: 3,
    fileSize: "1.8 MB",
    caption: "Invoice scan",
  },
};

export const SpreadsheetFile: Story = {
  args: {
    variant: "file",
    filename: "Q4_Sales_Data.xlsx",
    fileType: "XLS",
  },
};

export const GenericFile: Story = {
  args: {
    variant: "file",
    filename: "Meeting_Notes.docx",
    fileType: "DOC",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-sm font-medium text-semantic-text-secondary mb-2">
          Preview variant (PDF)
        </p>
        <DocMedia
          variant="preview"
          thumbnailUrl="https://placehold.co/442x308/e2e8f0/64748b?text=PDF+Preview"
          filename="Annual_Report_2025.pdf"
          fileType="PDF"
          pageCount={24}
          fileSize="3.2 MB"
        />
      </div>
      <div>
        <p className="m-0 text-sm font-medium text-semantic-text-secondary mb-2">
          Download variant (Image)
        </p>
        <DocMedia
          variant="download"
          thumbnailUrl="https://placehold.co/442x308/e2e8f0/64748b?text=Document+Image"
          filename="Invoice_Scan.pdf"
          fileType="PDF"
          pageCount={3}
          fileSize="1.8 MB"
        />
      </div>
      <div>
        <p className="m-0 text-sm font-medium text-semantic-text-secondary mb-2">
          File variant (Spreadsheet)
        </p>
        <DocMedia
          variant="file"
          filename="Q4_Sales_Data.xlsx"
          fileType="XLS"
        />
      </div>
      <div>
        <p className="m-0 text-sm font-medium text-semantic-text-secondary mb-2">
          File variant (Generic)
        </p>
        <DocMedia
          variant="file"
          filename="Meeting_Notes.docx"
          fileType="DOC"
        />
      </div>
    </div>
  ),
};
