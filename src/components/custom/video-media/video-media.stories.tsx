import type { Meta, StoryObj } from "@storybook/react";
import { VideoMedia } from "./video-media";

const meta: Meta<typeof VideoMedia> = {
  title: "Custom/Chat/Video Media",
  component: VideoMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A video player overlay with thumbnail, play/pause controls, seek bar, speed dropdown, volume slider, and fullscreen toggle. Designed for chat message bubbles to display video content.

### Installation

\`\`\`bash
npx myoperator-ui add video-media
\`\`\`

### Import

\`\`\`tsx
import { VideoMedia } from "@/components/custom/video-media"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Gradient overlay | \`#0a0d12\` | Dark overlay on video thumbnail | <span style="color:#0a0d12">&#9632;</span> \`#0A0D12\` |
| Controls text | — | White text/icons on overlay | <span style="color:#ffffff">&#9632;</span> \`#FFFFFF\` |
| Play button bg | — | Semi-transparent black | <span style="color:#000000">&#9632;</span> \`black/40\` |
| Seek bar track | — | White at 30% opacity | <span style="color:#ffffff4d">&#9632;</span> \`white/30\` |
| Seek bar fill | — | Solid white | <span style="color:#ffffff">&#9632;</span> \`#FFFFFF\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VideoMedia>;

export const Overview: Story = {
  args: {
    thumbnailUrl:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=375&fit=crop",
    duration: "2:30",
    progress: 15,
  },
};

export const WithDuration: Story = {
  name: "With Duration",
  args: {
    thumbnailUrl:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=375&fit=crop",
    duration: "1:05:30",
    progress: 42,
  },
};

export const CustomSpeedOptions: Story = {
  name: "Custom Speed Options",
  args: {
    thumbnailUrl:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=375&fit=crop",
    duration: "5:12",
    speedOptions: [0.5, 1, 1.5, 2],
    progress: 60,
  },
};
