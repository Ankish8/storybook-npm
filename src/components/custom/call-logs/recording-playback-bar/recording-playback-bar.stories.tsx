import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { RecordingPlaybackBar } from "./recording-playback-bar";

/** Bordered, max-width container that mimics the bar sitting above a call-logs table. */
function RowContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 1180,
        width: "100%",
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

const meta: Meta<typeof RecordingPlaybackBar> = {
  title: "Custom/Call Logs/RecordingPlaybackBar",
  component: RecordingPlaybackBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A slim bar shown above a call-logs table while a call recording is playing — play/pause control, phone number with optional caller name, timestamp, and duration, and a dismiss action. Typically shown once the call detail sidebar is closed, so the recording's timestamp and elapsed duration stay visible even with the sidebar hidden.

### Installation

\`\`\`bash
npx myoperator-ui add recording-playback-bar
\`\`\`

### Import

\`\`\`tsx
import { RecordingPlaybackBar } from "@/components/custom/call-logs/recording-playback-bar"
\`\`\`

### Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Bar background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Play/pause button background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Inverted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-inverted</code></td>
      <td style="padding: 12px 16px;">Play/pause icon color</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Phone number text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Caller name, timestamp, and duration text; close icon</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">"|" separators before the timestamp and duration</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A2A6B1; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    phoneNumber: { control: "text" },
    callerName: { control: "text" },
    timestamp: { control: "text" },
    duration: { control: "text" },
    isPlaying: { control: "boolean" },
    onTogglePlay: { action: "togglePlay" },
    onClose: { action: "close" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Playing: Story = {
  args: {
    phoneNumber: "+91 98201 45632",
    callerName: "Priya Sharma",
    timestamp: "05:00 PM, 04 Aug",
    duration: "6m 48s",
    isPlaying: true,
    onTogglePlay: fn(),
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <RecordingPlaybackBar {...args} />
    </RowContainer>
  ),
};

export const Paused: Story = {
  args: {
    phoneNumber: "+91 98201 45632",
    callerName: "Priya Sharma",
    timestamp: "05:00 PM, 04 Aug",
    duration: "6m 48s",
    isPlaying: false,
    onTogglePlay: fn(),
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <RecordingPlaybackBar {...args} />
    </RowContainer>
  ),
};

export const WithoutCallerName: Story = {
  args: {
    phoneNumber: "+91 98201 45632",
    timestamp: "05:00 PM, 04 Aug",
    duration: "6m 48s",
    isPlaying: true,
    onTogglePlay: fn(),
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <RecordingPlaybackBar {...args} />
    </RowContainer>
  ),
};

export const WithoutTimestampOrDuration: Story = {
  args: {
    phoneNumber: "+91 98201 45632",
    callerName: "Priya Sharma",
    isPlaying: true,
    onTogglePlay: fn(),
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "Omitting `timestamp` and `duration` hides both — and their leading \"|\" separators.",
      },
    },
  },
  render: (args) => (
    <RowContainer>
      <RecordingPlaybackBar {...args} />
    </RowContainer>
  ),
};

export const NotDismissible: Story = {
  args: {
    phoneNumber: "+91 98201 45632",
    callerName: "Priya Sharma",
    timestamp: "05:00 PM, 04 Aug",
    duration: "6m 48s",
    isPlaying: true,
    onTogglePlay: fn(),
  },
  render: (args) => (
    <RowContainer>
      <RecordingPlaybackBar {...args} />
    </RowContainer>
  ),
};
