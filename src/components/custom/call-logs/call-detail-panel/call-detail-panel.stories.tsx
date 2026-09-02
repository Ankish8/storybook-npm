import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallDetailPanel } from "./call-detail-panel";
import type { CallDetailLogEntry, CallDetailNote, CallDetailPanelProps } from "./types";

/** Fixed-width, fixed-height bordered container that mimics the slide-out drawer the panel is designed to live in. */
function PanelContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 530,
        height: 750,
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/**
 * CallDetailPanel is fully controlled (`activeTab`/`onTabChange` and
 * `noteDraft`/`onNoteDraftChange`) and holds no internal state of its own —
 * Storybook's `args` object is static, so switching tabs or typing a note
 * would have nothing to re-render against unless something owns the live
 * value. This wrapper holds that state locally and feeds the latest value
 * back down (while still forwarding to the `onTabChange`/`onNoteDraftChange`
 * passed in via args, so the Storybook Actions panel keeps logging every
 * change), so every story below is interactive in the canvas.
 */
function CallDetailPanelDemo({
  activeTab,
  onTabChange,
  noteDraft,
  onNoteDraftChange,
  isFavorite,
  onToggleFavorite,
  ...props
}: CallDetailPanelProps) {
  const [tab, setTab] = React.useState<CallDetailPanelProps["activeTab"]>(activeTab);
  const [draft, setDraft] = React.useState(noteDraft ?? "");
  const [favorite, setFavorite] = React.useState(isFavorite ?? false);

  return (
    <CallDetailPanel
      {...props}
      activeTab={tab}
      onTabChange={(next) => {
        setTab(next);
        onTabChange(next);
      }}
      noteDraft={draft}
      onNoteDraftChange={(value) => {
        setDraft(value);
        onNoteDraftChange?.(value);
      }}
      isFavorite={favorite}
      onToggleFavorite={() => {
        setFavorite((current) => !current);
        onToggleFavorite?.();
      }}
    />
  );
}

/* ── Shared fixtures ── */

const defaultNotes: CallDetailNote[] = [
  {
    author: "Priya Nair",
    timestamp: "Today, 05:08 PM",
    text: "Customer reported intermittent login failures since Monday.",
  },
];

const callLogEntries: CallDetailLogEntry[] = [
  { title: "AI Agent Welcome message played", timestamp: "10:24:02", duration: "0:18", isAi: true },
  { title: "Customer verified via OTP", timestamp: "10:24:32" },
  { title: "Transferred to Support", timestamp: "10:25:20", current: true },
  { title: "Call ended", timestamp: "10:28:32", duration: "3:12" },
];

const defaultSummary =
  "Priya confirmed she would complete the payment within 24 hours. No follow-up escalation is required.";

const meta: Meta<typeof CallDetailPanel> = {
  title: "Custom/Call Logs/CallDetailPanel",
  component: CallDetailPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
CallDetailPanel is a slide-out side panel launched from a call log row. It shows recording playback with a waveform, an AI-generated summary, and two fixed tabs — Notes and Call log (a detailed event timeline) — plus a footer with Callback / Edit Contact (or Add Contact) / Block Caller actions. The contact action swaps based on \`callerName\`: "Edit Contact" when a name is already saved for this caller, "Add Contact" when it isn't. The panel is fully controlled via \`activeTab\`/\`onTabChange\` and \`noteDraft\`/\`onNoteDraftChange\` and holds no internal state — drop it into a consumer-provided slide-out/drawer container, it fills the available width and height.

This is a different component from \`CallJourneyPanel\`, which is the full standalone timeline destination reached via the "View Detailed Logs" link inside the Call log tab.

### Installation

\`\`\`bash
npx myoperator-ui add call-detail-panel
\`\`\`

### Import

\`\`\`tsx
import { CallDetailPanel } from "@/components/custom/call-logs/call-detail-panel"
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
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Header/recording/summary/tabs/footer section dividers, timeline connector line between call-log entries</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Panel background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Play/pause button background, played waveform bars</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary-hover</code></td>
      <td style="padding: 12px 16px;">Waveform playhead bar (the single bar marking the current play position) — used in place of an opacity modifier on <code>--semantic-primary</code>, since semantic tokens are raw CSS custom properties rather than RGB triplets and can't take a Tailwind alpha suffix (e.g. <code>/50</code>)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2F384D; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Inverted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-inverted</code></td>
      <td style="padding: 12px 16px;">Play/pause icon color on the primary-colored button</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Warning Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-warning-primary</code></td>
      <td style="padding: 12px 16px;">Filled favorite star</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F79009; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">AI Call Summary card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Phone number heading, note text, call-log entry titles, elapsed time label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">UID line, "Recording" label, active tab label, AI summary body text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Note author/timestamp, close/download icons, inactive tab label, call-log timestamps and duration pill text, total time label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-primary</code></td>
      <td style="padding: 12px 16px;">Active tab underline</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">"View Detailed Logs" link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Brand</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px;">Current call-log entry's timeline dot</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">"Block Caller" button text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Neutral 300 <em>(raw)</em></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-neutral-300</code></td>
      <td style="padding: 12px 16px;">Unplayed waveform bars, non-current timeline dots — closest available approximation, not an exact hex match for the Figma design</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #D5D7DA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Neutral 100 <em>(raw)</em></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-neutral-100</code></td>
      <td style="padding: 12px 16px;">Call-log duration pill background — closest available approximation, not an exact hex match for the Figma design</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    waveform: { control: "object" },
    playedRatio: { control: { type: "number", min: 0, max: 1, step: 0.01 } },
    onToggleFavorite: { action: "toggleFavorite" },
    onClose: { action: "close" },
    onTogglePlay: { action: "togglePlay" },
    onDownload: { action: "download" },
    onTabChange: { action: "tabChange" },
    onNoteDraftChange: { action: "noteDraftChange" },
    onSaveNote: { action: "saveNote" },
    onViewDetailedLogs: { action: "viewDetailedLogs" },
    onCallback: { action: "callback" },
    onEditContact: { action: "editContact" },
    onAddContact: { action: "addContact" },
    onBlockCaller: { action: "blockCaller" },
  },
  args: {
    onToggleFavorite: fn(),
    onClose: fn(),
    onTogglePlay: fn(),
    onDownload: fn(),
    onTabChange: fn(),
    onNoteDraftChange: fn(),
    onSaveNote: fn(),
    onViewDetailedLogs: fn(),
    onCallback: fn(),
    onEditContact: fn(),
    onAddContact: fn(),
    onBlockCaller: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    phoneNumber: "+91 98765 43210",
    callerName: "Priya Sharma",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    aiSummary: defaultSummary,
    activeTab: "notes",
    notes: defaultNotes,
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
};

export const WithoutContactName: Story = {
  name: "Without a saved contact name",
  args: {
    phoneNumber: "+91 90045 88123",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    aiSummary: defaultSummary,
    activeTab: "notes",
    notes: defaultNotes,
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'No `callerName` provided (unknown caller) — the footer shows "Add Contact" instead of "Edit Contact".',
      },
    },
  },
};

export const CallLogTab: Story = {
  args: {
    phoneNumber: "+91 98765 43210",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    aiSummary: defaultSummary,
    activeTab: "call-log",
    logEntries: callLogEntries,
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The Call log tab showing the detailed event timeline — a mix of entries with and without a duration pill, with the current/active segment ("Transferred to Support") highlighted via its accent-colored dot.',
      },
    },
  },
};

export const WithoutSummary: Story = {
  args: {
    phoneNumber: "+91 98765 43210",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    activeTab: "notes",
    notes: defaultNotes,
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "No `aiSummary` provided — the AI Call Summary card correctly does not render at all, rather than rendering empty.",
      },
    },
  },
};

export const EmptyNotes: Story = {
  args: {
    phoneNumber: "+91 98765 43210",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    activeTab: "notes",
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "No prior notes — the Notes tab renders just the composer (textarea + Save Notes button) with no note list above it.",
      },
    },
  },
};

export const Favorited: Story = {
  args: {
    phoneNumber: "+91 98765 43210",
    callUid: "cn3.1785493923.4087398",
    elapsedTime: "1:01",
    totalTime: "3:12",
    isPlaying: true,
    playedRatio: 0.33,
    aiSummary: defaultSummary,
    activeTab: "notes",
    notes: defaultNotes,
    isFavorite: true,
  },
  render: (args) => (
    <PanelContainer>
      <CallDetailPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: "`isFavorite: true` — the star next to the phone number renders filled.",
      },
    },
  },
};
