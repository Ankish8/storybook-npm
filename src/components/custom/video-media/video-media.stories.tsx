import type { Meta, StoryObj } from "@storybook/react";
import { VideoMedia } from "./video-media";

const sampleVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const samplePoster =
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=375&fit=crop";

const meta: Meta<typeof VideoMedia> = {
  title: "Custom/Chat/Video Media",
  component: VideoMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A native video renderer for chat media. It accepts either a direct video URL or a media payload, resolves safe poster thumbnails, and keeps the video constrained inside message bubbles.

### Installation

\`\`\`bash
npx myoperator-ui add video-media
\`\`\`

### Import

\`\`\`tsx
import { VideoMedia } from "@/components/custom/video-media"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Video surface | \`--semantic-text-primary\` | Letterbox/background behind videos |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VideoMedia>;

export const Overview: Story = {
  args: {
    url: sampleVideo,
    poster: samplePoster,
    fileType: "video/mp4",
  },
};

export const MediaPayload: Story = {
  args: {
    media: {
      url: sampleVideo,
      thumbnailUrl: samplePoster,
      fileType: "video/mp4",
    },
  },
};

export const CustomHeight: Story = {
  args: {
    url: sampleVideo,
    poster: samplePoster,
    wrapperStyle: { height: 220 },
  },
};

export const WithoutPoster: Story = {
  args: {
    url: sampleVideo,
    fileType: "video/mp4",
  },
};
