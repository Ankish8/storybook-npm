import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsEditContactModal } from "./call-logs-edit-contact-modal";
import type { CallLogsEditContactModalProps } from "./types";
import { Button } from "../../../ui/button";

function CallLogsEditContactModalDemo({ onOpenChange, ...props }: CallLogsEditContactModalProps) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit Contact
      </Button>
      <CallLogsEditContactModal
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

const meta: Meta<typeof CallLogsEditContactModal> = {
  title: "Custom/Call Logs/CallLogsEditContactModal",
  component: CallLogsEditContactModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The dialog opened from CallDetailPanel's "Edit Contact" action — updates the name, phone number, and email of the contact associated with a call.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-edit-contact-modal
\`\`\`

### Import

\`\`\`tsx
import { CallLogsEditContactModal } from "@/components/custom/call-logs/call-logs-edit-contact-modal"
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
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Field labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">"Phone Number" required asterisk</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">"Save" button background</td>
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
    defaultName: { control: "text" },
    defaultPhoneNumber: { control: "text" },
    defaultEmail: { control: "text" },
    loading: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
  },
  args: {
    open: false,
    defaultName: "Khushboo Rawat",
    defaultPhoneNumber: "68484 44444",
    defaultEmail: "khushboo123@gmail.com",
    onOpenChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallLogsEditContactModalDemo {...args} />,
};

export const EmptyContact: Story = {
  args: {
    defaultName: "",
    defaultPhoneNumber: "",
    defaultEmail: "",
  },
  render: (args) => <CallLogsEditContactModalDemo {...args} />,
};

export const Loading: Story = {
  args: {
    open: true,
    loading: true,
  },
};
