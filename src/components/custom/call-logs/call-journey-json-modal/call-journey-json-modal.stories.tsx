import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallJourneyJsonModal } from "./call-journey-json-modal";
import type { CallJourneyJsonModalProps } from "./types";
import { Button } from "../../../ui/button";

const SAMPLE_CALL_JOURNEY_LOG = {
  legLabel: "US-7 LEG TIMELINE",
  callUid: "UID-2026-0701-01",
  customer: "+1 (555) 019-3321 (David Miller)",
  timestamp: "7/6/2026, 3:45:30 PM",
  events: [
    {
      title: "Call Received Entry",
      meta: "(0s)",
      description: "Incoming call initialized from mobile network region gateway.",
    },
    {
      title: "Entered Call IVR Flow",
      meta: "(15s)",
      description: "Caller processed through tree node selector. Selection department: Billing.",
    },
    {
      title: "Voicebot Session Leg",
      meta: "102s talk-time",
      handlerId: "AI Handler ID: bot_sales_v2",
      description:
        "Engaging customer with structured conversational intelligence model. Action Resolution: hangup.",
    },
    { title: "Call Ended", meta: "(117s)", description: "Session terminated after successful resolution." },
  ],
};
const SAMPLE_JSON = JSON.stringify(SAMPLE_CALL_JOURNEY_LOG, null, 2);

/**
 * CallJourneyJsonModal is fully controlled (`open` / `onOpenChange`), so this
 * wrapper owns the open state locally and renders a trigger button —
 * mirroring how "View Detailed Logs" in CallDetailPanel would open it.
 */
function CallJourneyJsonModalDemo({ onOpenChange, ...props }: CallJourneyJsonModalProps) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        View Detailed Logs
      </Button>
      <CallJourneyJsonModal
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
      />
    </>
  );
}

const meta: Meta<typeof CallJourneyJsonModal> = {
  title: "Custom/Call Logs/CallJourneyJsonModal",
  component: CallJourneyJsonModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The dialog opened from CallDetailPanel's "View Detailed Logs" action — a read-only viewer for the raw JSON behind a call's detailed logs, with a copy-to-clipboard button. The parent owns what JSON is shown; this component only displays it.

### Installation

\`\`\`bash
npx myoperator-ui add call-journey-json-modal
\`\`\`

### Import

\`\`\`tsx
import { CallJourneyJsonModal } from "@/components/custom/call-logs/call-journey-json-modal"
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
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">JSON body background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">JSON body text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Copy button, default state</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">Copy button, after copying</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #17B26A; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    json: { control: "text" },
    onOpenChange: { action: "openChange" },
    onCopy: { action: "copy" },
  },
  args: {
    open: false,
    json: SAMPLE_JSON,
    onOpenChange: fn(),
    onCopy: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallJourneyJsonModalDemo {...args} />,
};

export const CustomTitle: Story = {
  args: {
    open: true,
    title: "Call Journey Log",
  },
};

export const ShortPayload: Story = {
  args: {
    open: true,
    json: JSON.stringify({ status: "success", code: 200 }, null, 2),
  },
};
