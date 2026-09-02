import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallJourneyPanel } from "./call-journey-panel";
import type { CallJourneyEvent } from "./types";

/** Fixed-width, fixed-height bordered container that mimics the slide-out drawer the panel is designed to live in. */
function PanelContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 460,
        height: 832,
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

const fullEvents: CallJourneyEvent[] = [
  {
    title: "Call Received Entry",
    meta: "(0s)",
    description:
      "Incoming call initialized from mobile network region gateway.",
  },
  {
    title: "Entered Call IVR Flow",
    meta: "(15s)",
    description:
      "Caller processed through tree node selector. Selection department: Billing.",
  },
  {
    title: "Voicebot Session Leg",
    meta: "102s talk-time",
    description:
      "Engaging customer with structured conversational intelligence model. Action Resolution: hangup.",
    variant: "highlighted",
    handlerId: "AI Handler ID: bot_sales_v2",
  },
  {
    title: "Call Ended",
    meta: "(117s)",
    description: "Session terminated after successful resolution.",
  },
];

const meta: Meta<typeof CallJourneyPanel> = {
  title: "Custom/Call Logs/CallJourneyPanel",
  component: CallJourneyPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A slide-out side panel showing the full event timeline for a single call — leg label, close button, title, call UID, customer/timestamp summary bar, and an ordered list of timeline events (with an optional highlighted variant for AI/bot-handled Participants). Drop it into a fixed-width slide-out/drawer container — the panel itself fills the available width and height.

### Installation

\`\`\`bash
npx myoperator-ui add call-journey-panel
\`\`\`

### Import

\`\`\`tsx
import { CallJourneyPanel } from "@/components/custom/call-logs/call-journey-panel"
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
      <td style="padding: 12px 16px;">Panel outer border, header/summary dividers, timeline connector line</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Panel background, highlighted event card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Leg label text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px;">Close button hover surface</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Close icon, call UID, event meta/description, customer/timestamp labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Panel title, event title, timestamp value</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Customer/timestamp summary bar background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Timeline event dot, customer value text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-border</code></td>
      <td style="padding: 12px 16px;">Highlighted (AI-handled) event card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A8C0EC; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Highlighted event handler ID text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

**Note on Info Border**: the Figma design uses a teal accent border on the highlighted/AI-handled event card. No exact semantic token matches that teal, so \`--semantic-info-border\` was used instead — a deliberate deviation that ties the AI-handled card to the same info/blue family already used elsewhere in the Call Logs feature (e.g. the AI-handled avatar surface in \`CallLogs\`).
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    legLabel: { control: "text" },
    title: { control: "text" },
    callUid: { control: "text" },
    customerLabel: { control: "text" },
    customerValue: { control: "text" },
    timestamp: { control: "text" },
    events: { control: "object" },
    onClose: { action: "close" },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    legLabel: "US-7 LEG TIMELINE",
    callUid: "UID-2026-0701-01",
    customerValue: "+1 (555) 019-3321 (David Miller)",
    timestamp: "7/6/2026, 3:45:30 PM",
    events: fullEvents,
  },
  render: (args) => (
    <PanelContainer>
      <CallJourneyPanel {...args} />
    </PanelContainer>
  ),
};

export const NoHighlightedEvents: Story = {
  args: {
    legLabel: "US-7 LEG TIMELINE",
    callUid: "UID-2026-0701-01",
    customerValue: "+1 (555) 019-3321 (David Miller)",
    timestamp: "7/6/2026, 3:45:30 PM",
    events: fullEvents.map(
      ({ variant: _variant, handlerId: _handlerId, ...event }) => event
    ),
  },
  render: (args) => (
    <PanelContainer>
      <CallJourneyPanel {...args} />
    </PanelContainer>
  ),
};

export const SingleEvent: Story = {
  args: {
    legLabel: "US-7 LEG TIMELINE",
    callUid: "UID-2026-0701-01",
    customerValue: "+1 (555) 019-3321 (David Miller)",
    timestamp: "7/6/2026, 3:45:30 PM",
    events: [
      {
        title: "Call Received Entry",
        meta: "(0s)",
        description:
          "Incoming call initialized from mobile network region gateway.",
      },
    ],
  },
  render: (args) => (
    <PanelContainer>
      <CallJourneyPanel {...args} />
    </PanelContainer>
  ),
};

export const CustomTitle: Story = {
  args: {
    legLabel: "US-7 LEG TIMELINE",
    title: "Escalation Trace",
    callUid: "UID-2026-0701-01",
    customerValue: "+1 (555) 019-3321 (David Miller)",
    timestamp: "7/6/2026, 3:45:30 PM",
    events: fullEvents,
  },
  render: (args) => (
    <PanelContainer>
      <CallJourneyPanel {...args} />
    </PanelContainer>
  ),
};
