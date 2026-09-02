import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsCustomizeTabsModal } from "./call-logs-customize-tabs-modal";
import type { CallLogsCustomizeTabsModalProps, CallLogsCustomizeTabsView } from "./types";
import { Button } from "../../../ui/button";

const SAMPLE_VIEWS: CallLogsCustomizeTabsView[] = [
  { id: "all", label: "All", count: 23, pinned: true, isDefault: true },
  { id: "missed-by-agent", label: "Missed by Agent", count: 5, pinned: true },
  { id: "connected", label: "Connected", count: 12, pinned: true },
  { id: "ai-handled", label: "AI Handled", count: 20, pinned: true },
  { id: "voicemail", label: "Voicemail", count: 2, pinned: true },
  { id: "incoming", label: "Incoming", count: 20, pinned: false },
  { id: "outgoing", label: "Outgoing", count: 1, pinned: false },
  { id: "starred", label: "Starred", count: 2, pinned: false },
  { id: "with-notes", label: "With Notes", count: 4, pinned: false },
  { id: "recorded", label: "Recorded", count: 12, pinned: false },
];

/**
 * CallLogsCustomizeTabsModal is fully controlled, so this wrapper owns the
 * open state and the views list locally — mirroring how "Customize tabs..."
 * in CallLogsViewTabs' "More" dropdown would open and drive it.
 */
function CallLogsCustomizeTabsModalDemo({
  onOpenChange,
  onViewsChange,
  views: initialViews,
  ...props
}: CallLogsCustomizeTabsModalProps) {
  const [open, setOpen] = React.useState(props.open);
  const [views, setViews] = React.useState(initialViews);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Customize tabs...
      </Button>
      <CallLogsCustomizeTabsModal
        {...props}
        open={open}
        views={views}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        onViewsChange={(next) => {
          setViews(next);
          onViewsChange(next);
        }}
        onDone={() => setOpen(false)}
      />
    </>
  );
}

const meta: Meta<typeof CallLogsCustomizeTabsModal> = {
  title: "Custom/Call Logs/CallLogsCustomizeTabsModal",
  component: CallLogsCustomizeTabsModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The dialog opened from CallLogsViewTabs' "Customize tabs..." footer link. Lists every view split into two sections — pinned (shown inline as tabs, reorderable) and available (only in the "More" dropdown) — and lets the user reorder pinned views or move a view between the two sections. Fully controlled: every change is reported via \`onViewsChange\` with the complete updated array.

Pinning is capped at \`maxPinnedPresets\` (default 4) non-default views, so the tab header never grows unbounded. Pinning one more than the cap automatically unpins the longest-pinned non-default view (FIFO) to make room — see the "Pin cap (FIFO eviction)" story.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-customize-tabs-modal
\`\`\`

### Import

\`\`\`tsx
import { CallLogsCustomizeTabsModal } from "@/components/custom/call-logs/call-logs-customize-tabs-modal"
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
      <td style="padding: 12px 16px;">Column header and row dividers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Section labels, counts, column headers, "Always shown"</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Pin / Unpin / "New View" actions</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">"-" Order placeholder for non-reorderable rows</td>
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
    views: { control: "object" },
    onOpenChange: { action: "openChange" },
    onViewsChange: { action: "viewsChange" },
    onAddNewView: { action: "addNewView" },
    onDone: { action: "done" },
  },
  args: {
    open: false,
    views: SAMPLE_VIEWS,
    onOpenChange: fn(),
    onViewsChange: fn(),
    onAddNewView: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallLogsCustomizeTabsModalDemo {...args} />,
};

export const AllAvailable: Story = {
  name: "Only default pinned",
  args: {
    open: true,
    views: SAMPLE_VIEWS.map((view) => (view.isDefault ? view : { ...view, pinned: false })),
  },
};

export const NothingAvailable: Story = {
  name: "Everything pinned",
  args: {
    open: true,
    views: SAMPLE_VIEWS.map((view) => ({ ...view, pinned: true })),
  },
};

export const PinCapEviction: Story = {
  name: "Pin cap (FIFO eviction)",
  parameters: {
    docs: {
      description: {
        story:
          'SAMPLE_VIEWS is already at the default cap of 4 pinned non-default views ("Missed by Agent", "Connected", "AI Handled", "Voicemail"). Click "Pin" on any available view (e.g. "Incoming") — "Missed by Agent", the longest-pinned one, is automatically unpinned to make room.',
      },
    },
  },
  args: {
    open: true,
  },
  render: (args) => <CallLogsCustomizeTabsModalDemo {...args} />,
};
