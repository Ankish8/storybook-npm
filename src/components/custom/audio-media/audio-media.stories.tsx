import type { Meta, StoryObj } from "@storybook/react";
import { AudioMedia } from "./audio-media";

const meta: Meta<typeof AudioMedia> = {
  title: "Custom/Chat/Audio Media",
  component: AudioMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A waveform-based audio player with play/pause button, SVG waveform visualization with played/unplayed sections, and a speed dropdown. Designed for use in chat bubbles.

### Installation

\`\`\`bash
npx myoperator-ui add audio-media
\`\`\`

### Import

\`\`\`tsx
import { AudioMedia } from "@/components/custom/audio-media"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Play button bg | \`--semantic-primary\` | Play/pause circle | <span style="color:#343e55">&#9632;</span> \`#343E55\` |
| Played bar | — | Played waveform bars | <span style="color:#27ABB8">&#9632;</span> \`#27ABB8\` |
| Unplayed bar | — | Unplayed waveform bars | <span style="color:#C0C3CA">&#9632;</span> \`#C0C3CA\` |
| Speed pill bg | — | Speed button background | \`bg-black/40\` |
| Duration text | \`--semantic-text-muted\` | Duration label | <span style="color:#717680">&#9632;</span> \`#717680\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 340,
          background: "#E7F8EE",
          borderRadius: 12,
          padding: "4px 0 10px 0",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AudioMedia>;

export const Overview: Story = {
  args: {
    playedBars: 11,
    duration: "0:30",
  },
};

export const PartiallyPlayed: Story = {
  args: {
    playedBars: 20,
    duration: "1:15",
  },
};

export const CustomWaveform: Story = {
  args: {
    waveform: [
      24, 18, 6, 20, 10, 4, 16, 28, 7, 12, 5, 22, 14, 8, 20, 6, 10, 4, 18,
      26, 7, 5, 16, 10, 6, 24, 8, 4, 14, 7, 12, 5, 22, 9, 4, 18, 6, 10, 26,
      5, 13, 7, 4, 20, 9, 6, 24, 5, 12, 7, 6, 18, 10, 4, 17,
    ],
    playedBars: 30,
    duration: "2:45",
  },
};

export const WithDuration: Story = {
  args: {
    duration: "3:22",
    playedBars: 0,
  },
};
