import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { BulkSelectionToolbar } from "./bulk-selection-toolbar";

/** Bordered, max-width container that mimics the toolbar sitting above a call-logs table. */
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

const meta: Meta<typeof BulkSelectionToolbar> = {
  title: "Custom/Call Logs/BulkSelectionToolbar",
  component: BulkSelectionToolbar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A toolbar that appears above a table when rows are selected — surfacing the selection count, any bulk actions available for that selection, and a close control to clear the selection.

### Installation

\`\`\`bash
npx myoperator-ui add bulk-selection-toolbar
\`\`\`

### Import

\`\`\`tsx
import { BulkSelectionToolbar } from "@/components/custom/call-logs/bulk-selection-toolbar"
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
      <td style="padding: 12px 16px;">Toolbar background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">"{n} selected" count text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Bulk action labels (e.g. "Download Recordings")</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Close (clear selection) icon</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    selectedCount: { control: "number" },
    actions: { control: "object" },
    onClose: { action: "close" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    selectedCount: 16,
    actions: [{ label: "Download Recordings", onClick: fn() }],
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <BulkSelectionToolbar {...args} />
    </RowContainer>
  ),
};

export const NoActions: Story = {
  args: {
    selectedCount: 3,
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <BulkSelectionToolbar {...args} />
    </RowContainer>
  ),
};

export const MultipleActions: Story = {
  args: {
    selectedCount: 8,
    actions: [
      { label: "Download Recordings", onClick: fn() },
      { label: "Export CSV", onClick: fn() },
    ],
    onClose: fn(),
  },
  render: (args) => (
    <RowContainer>
      <BulkSelectionToolbar {...args} />
    </RowContainer>
  ),
};

export const NotDismissible: Story = {
  args: {
    selectedCount: 5,
    actions: [{ label: "Download Recordings", onClick: fn() }],
  },
  render: (args) => (
    <RowContainer>
      <BulkSelectionToolbar {...args} />
    </RowContainer>
  ),
};
