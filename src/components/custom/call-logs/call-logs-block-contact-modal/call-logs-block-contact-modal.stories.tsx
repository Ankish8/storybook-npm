import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsBlockContactModal } from "./call-logs-block-contact-modal";
import type { CallLogsBlockContactModalProps } from "./types";
import { Button } from "../../../ui/button";

function CallLogsBlockContactModalDemo({ onOpenChange, ...props }: CallLogsBlockContactModalProps) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <>
      <Button variant="outline" className="text-semantic-error-primary" onClick={() => setOpen(true)}>
        Block Caller
      </Button>
      <CallLogsBlockContactModal
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

const meta: Meta<typeof CallLogsBlockContactModal> = {
  title: "Custom/Call Logs/CallLogsBlockContactModal",
  component: CallLogsBlockContactModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The confirmation dialog opened from CallDetailPanel's "Block Caller" action. The number being blocked is always read-only; the contact name is optional and editable, and a reason is required before "Block & Close" is enabled.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-block-contact-modal
\`\`\`

### Import

\`\`\`tsx
import { CallLogsBlockContactModal } from "@/components/custom/call-logs/call-logs-block-contact-modal"
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
      <td style="padding: 12px 16px;">Read-only "Number to Block" field background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Required-field asterisks</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">"Block & Close" button background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
    defaultName: { control: "text" },
    reasonMaxLength: { control: "number" },
    loading: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    onBlock: { action: "block" },
    onCancel: { action: "cancel" },
  },
  args: {
    open: false,
    phoneNumber: "68484 44444",
    defaultName: "Khushboo Rawat",
    onOpenChange: fn(),
    onBlock: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallLogsBlockContactModalDemo {...args} />,
};

export const UnknownCaller: Story = {
  args: {
    defaultName: "",
  },
  render: (args) => <CallLogsBlockContactModalDemo {...args} />,
};

export const Loading: Story = {
  args: {
    open: true,
    loading: true,
  },
};
