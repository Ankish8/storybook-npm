import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { DocMedia } from "./doc-media";

const meta: Meta<typeof DocMedia> = {
  title: "Custom/Chat/Doc Media",
  component: DocMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A document media component for displaying documents in chat messages. Supports three variants: **preview** (full image thumbnail with gradient overlay showing filename and metadata), **download** (simple image thumbnail), and **file** (icon-centered preview with filetype badge and download button).

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
    thumbnailUrl: "https://placehold.co/380x240/e2e8f0/64748b?text=Document+Image",
    caption: "Invoice scan",
    filename: "invoice_scan.jpg",
  },
};

export const SpreadsheetFile: Story = {
  args: {
    variant: "file",
    filename: "Q4_Sales_Data.xlsx",
    fileType: "XLS",
    onDownload: fn(),
  },
};

export const GenericFile: Story = {
  args: {
    variant: "file",
    filename: "Meeting_Notes.docx",
    fileType: "DOC",
    onDownload: fn(),
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
          thumbnailUrl="https://placehold.co/380x240/e2e8f0/64748b?text=Document+Image"
          caption="Invoice scan"
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
