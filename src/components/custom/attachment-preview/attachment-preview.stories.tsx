import type { Meta, StoryObj } from "@storybook/react";
import { AttachmentPreview } from "./attachment-preview";


/**
 * Helper to create a mock File with realistic size.
 * In Storybook, File objects are mocked — preview images may not render.
 * The component works with real File objects in production.
 */
const createMockFile = (
  name: string,
  type: string,
  size: number = 1024 * 100
): File => {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
};

const meta: Meta<typeof AttachmentPreview> = {
  title: "Custom/Chat/Attachment Preview",
  component: AttachmentPreview,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A preview component for file attachments in a chat composer. Displays different previews based on file type (image, video, audio, document) with a close/remove button overlay.

### Installation

\`\`\`bash
npx myoperator-ui add attachment-preview
\`\`\`

### Import

\`\`\`tsx
import { AttachmentPreview } from "@/components/custom/attachment-preview"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Border | \`--semantic-border-layout\` | Bottom border | <span style="color:#E9EAEB">&#9632;</span> \`#E9EAEB\` |
| Audio bg | \`--semantic-bg-ui\` | Audio/document background | <span style="color:#F5F5F5">&#9632;</span> \`#F5F5F5\` |
| Play button | \`--semantic-primary\` | Audio play circle | <span style="color:#343E55">&#9632;</span> \`#343E55\` |
| File icon | \`--semantic-text-muted\` | Document icon color | <span style="color:#717680">&#9632;</span> \`#717680\` |
| File name | \`--semantic-text-primary\` | Document filename | <span style="color:#181D27">&#9632;</span> \`#181D27\` |
| File size | \`--semantic-text-muted\` | Document size text | <span style="color:#717680">&#9632;</span> \`#717680\` |

> **Note:** In Storybook, File objects are mocked so preview images/videos may not render. The component works with real File objects in production.
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onRemove: () => console.log("onRemove"),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AttachmentPreview>;

export const ImagePreview: Story = {
  name: "Image Preview",
  args: {
    file: createMockFile("vacation-photo.jpg", "image/jpeg", 1024 * 1024 * 2),
  },
};

export const VideoPreview: Story = {
  name: "Video Preview",
  args: {
    file: createMockFile("meeting-recording.mp4", "video/mp4", 1024 * 1024 * 15),
  },
};

export const AudioPreview: Story = {
  name: "Audio Preview",
  args: {
    file: createMockFile("voice-note.mp3", "audio/mpeg", 1024 * 1024 * 1),
  },
};

export const DocumentPreview: Story = {
  name: "Document Preview",
  args: {
    file: createMockFile("quarterly-report.pdf", "application/pdf", 1024 * 1024 * 3),
  },
};
