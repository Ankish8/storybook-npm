import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsAddNoteModal } from "./call-logs-add-note-modal";
import type { CallLogsAddNoteModalProps } from "./types";
import { Button } from "../../../ui/button";

/**
 * CallLogsAddNoteModal is fully controlled (`open` / `onOpenChange`), so this
 * wrapper owns the open state locally and renders a trigger button — mirroring
 * how "Notes" in a call-logs row's "More actions" menu would open it.
 */
function CallLogsAddNoteModalDemo({
  onOpenChange,
  onSave,
  ...props
}: CallLogsAddNoteModalProps) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Notes</Button>
      <CallLogsAddNoteModal
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        onSave={(note) => {
          setOpen(false);
          onSave(note);
        }}
      />
    </>
  );
}

const meta: Meta<typeof CallLogsAddNoteModal> = {
  title: "Custom/Call Logs/CallLogsAddNoteModal",
  component: CallLogsAddNoteModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The dialog opened from a call-logs row's "More actions" menu ("Notes") to add a note for that call — a multi-line note field with a character counter and an Enter-to-save shortcut. Saving calls \`onSave(note)\`; the parent is responsible for attaching it to the row (e.g. as an entry in CallDetailPanel's Notes tab).

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-add-note-modal
\`\`\`

### Import

\`\`\`tsx
import { CallLogsAddNoteModal } from "@/components/custom/call-logs/call-logs-add-note-modal"
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
      <td style="padding: 12px 16px;">Border Input</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input</code></td>
      <td style="padding: 12px 16px;">Textarea border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #D5D7DA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">Textarea placeholder copy</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A2A6B1; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">"Press Enter to save" helper text and character counter</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">"Save Note" button background</td>
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
    defaultValue: { control: "text" },
    maxLength: { control: "number" },
    loading: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
  },
  args: {
    open: false,
    onOpenChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallLogsAddNoteModalDemo {...args} />,
};

export const WithExistingNote: Story = {
  args: {
    defaultValue: "Customer reported intermittent login failures since Monday.",
  },
  render: (args) => <CallLogsAddNoteModalDemo {...args} />,
};

export const Loading: Story = {
  args: {
    open: true,
    defaultValue: "Customer confirmed the issue would be resolved within 24 hours.",
    loading: true,
  },
};
