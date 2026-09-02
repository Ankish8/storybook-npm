import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogs } from "./call-logs";

/** Bordered, max-width container that mimics a single row sitting inside a real call-logs table. */
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

const meta: Meta<typeof CallLogs> = {
  title: "Custom/Call Logs/CallLogs",
  component: CallLogs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A single row within a call-logs table — checkbox, status avatar, phone number, caller name, who/what handled the call, call timing, and trailing actions (transfer/more-actions for live calls). Recording playback lives in \`CallDetailPanel\`, opened via this row's \`onClick\`/\`expandable\`.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs
\`\`\`

### Import

\`\`\`tsx
import { CallLogs } from "@/components/custom/call-logs/call-logs"
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
      <td style="padding: 12px 16px;">Success Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-surface</code></td>
      <td style="padding: 12px 16px;">Connected status avatar surface</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECFDF3; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-text</code></td>
      <td style="padding: 12px 16px;">Connected status icon/text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #067647; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-hover</code></td>
      <td style="padding: 12px 16px;">Ongoing call duration text + pulsing dot</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #079455; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">AI-handled avatar surface, bot pill background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-surface</code></td>
      <td style="padding: 12px 16px;">Missed avatar surface, missed handoff pill background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FEF3F2; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-text</code></td>
      <td style="padding: 12px 16px;">Missed handoff pill text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #B42318; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Neutral avatar surface, agent/campaign pill background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Phone number, time, primary pill text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Caller name, idle duration, secondary pill text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">"|" separators, "-" placeholder</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A2A6B1; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Transfer action</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Row bottom border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["connected", "missed", "ai-handled", "neutral"],
    },
    phoneNumber: { control: "text" },
    callerName: { control: "text" },
    isLive: { control: "boolean" },
    hasNote: { control: "boolean" },
    handledBy: { control: "object" },
    summary: { control: "text" },
    time: { control: "text" },
    duration: { control: "text" },
    isOngoing: { control: "boolean" },
    actions: { control: "object" },
    checked: { control: "boolean" },
    expandable: { control: "boolean" },
    onCheckedChange: { action: "checkedChange" },
    onClick: { action: "clicked" },
  },
  args: {
    checked: false,
    onCheckedChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    status: "connected",
    phoneNumber: "+91 98765 43210",
    callerName: "Priya Sharma",
    handledBy: {
      type: "bot-handoff",
      botName: "Eva",
      agentName: "Nivedithatha N.",
      department: "Customer support",
    },
    time: "05:00 PM",
    duration: "6m 48s",
    hasNote: true,
    expandable: true,
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const LiveConnecting: Story = {
  name: "Live: Connecting",
  args: {
    status: "connected",
    phoneNumber: "+91 98765 43210",
    callerName: "Priya Sharma",
    isLive: true,
    handledBy: { type: "connecting" },
    actions: { type: "none" },
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const LiveInProgress: Story = {
  name: "Live: In Progress",
  args: {
    status: "connected",
    phoneNumber: "+91 98765 43210",
    callerName: "Priya Sharma",
    isLive: true,
    handledBy: { type: "agent", agentName: "Komal R.", department: "Customer support" },
    time: "07:00 PM",
    duration: "2m 48s",
    isOngoing: true,
    actions: { type: "live", onTransfer: fn(), onSelectNotes: fn(), onSelectEndCall: fn() },
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const WhatColumnTooltip: Story = {
  name: "What column: Hover tooltip",
  parameters: {
    docs: {
      description: {
        story:
          'Hovering the What column shows who/what handled the call, auto-derived from `handledBy` + `status` — e.g. "Komal R. from Customer support", "AI Agent", or "Call missed from support". Pass `summary` to override it with custom copy (e.g. a notes preview).',
      },
    },
  },
  args: {
    status: "connected",
    phoneNumber: "+91 98765 43210",
    callerName: "Priya Sharma",
    handledBy: { type: "agent", agentName: "Komal R.", department: "Customer support" },
    time: "05:00 PM",
    duration: "6m 48s",
    expandable: true,
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const BotOnly: Story = {
  name: "Handled By: Bot",
  args: {
    status: "ai-handled",
    phoneNumber: "+91 98765 43210",
    callerName: "Rohit Mishra",
    handledBy: { type: "bot", botName: "Eva" },
    time: "05:00 PM",
    duration: "5m 48s",
    expandable: true,
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const MissedHandoff: Story = {
  name: "Handled By: Missed Handoff",
  args: {
    status: "missed",
    phoneNumber: "+91 90045 88123",
    handledBy: {
      type: "bot-handoff",
      botName: "Arina",
      department: "Customer Support",
      missed: true,
    },
    time: "05:00 PM",
    duration: "5m 48s",
    expandable: true,
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const Campaign: Story = {
  name: "Handled By: Campaign",
  args: {
    status: "neutral",
    phoneNumber: "+91 98765 43210",
    callerName: "Ananya Iyer",
    handledBy: { type: "campaign", campaignName: "Q3 Enterprise Campaign" },
    time: "05:00 PM",
    duration: "5m 48s",
    expandable: true,
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

export const NoHandler: Story = {
  name: "Handled By: None",
  args: {
    status: "missed",
    phoneNumber: "+91 98765 43210",
    callerName: "Ananya Iyer",
    handledBy: { type: "none" },
    time: "05:00 PM",
    duration: "5m 48s",
  },
  render: (args) => (
    <RowContainer>
      <CallLogs {...args} />
    </RowContainer>
  ),
};

/* ── Table Composition ── */

function CallLogsTable() {
  return (
    <RowContainer>
      <CallLogs
        status="connected"
        isLive
        phoneNumber="+91 98765 43210"
        callerName="Priya Sharma"
        handledBy={{ type: "agent", agentName: "Komal R.", department: "Customer support" }}
        time="07:00 PM"
        duration="2m 48s"
        isOngoing
        actions={{ type: "live", onTransfer: fn(), onSelectNotes: fn(), onSelectEndCall: fn() }}
      />
      <CallLogs
        status="ai-handled"
        phoneNumber="+91 98765 43210"
        callerName="Rohit Mishra"
        handledBy={{ type: "bot", botName: "Eva" }}
        time="05:00 PM"
        duration="5m 48s"
        expandable
      />
      <CallLogs
        status="connected"
        phoneNumber="+91 98765 43210"
        callerName="Priya Sharma"
        hasNote
        handledBy={{
          type: "bot-handoff",
          botName: "Eva",
          agentName: "Nivedithatha N.",
          department: "Customer support",
        }}
        time="05:00 PM"
        duration="6m 48s"
        expandable
      />
      <CallLogs
        status="missed"
        phoneNumber="+91 90045 88123"
        handledBy={{
          type: "bot-handoff",
          botName: "Arina",
          department: "Customer Support",
          missed: true,
        }}
        time="05:00 PM"
        duration="5m 48s"
        expandable
      />
      <CallLogs
        status="neutral"
        phoneNumber="+91 98765 43210"
        callerName="Ananya Iyer"
        handledBy={{ type: "campaign", campaignName: "Q3 Enterprise Campaign" }}
        time="05:00 PM"
        duration="5m 48s"
        expandable
      />
      <CallLogs
        status="missed"
        phoneNumber="+91 98765 43210"
        callerName="Ananya Iyer"
        handledBy={{ type: "none" }}
        time="05:00 PM"
        duration="5m 48s"
      />
    </RowContainer>
  );
}

export const TableComposition: Story = {
  render: () => <CallLogsTable />,
};
