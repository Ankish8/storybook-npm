import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsSavePresetModal } from "./call-logs-save-preset-modal";
import type { CallLogsSavePresetModalProps } from "./types";
import { Button } from "../../../ui/button";
import { CallLogsViewTabs } from "../call-logs-view-tabs";
import type { CallLogsViewTab } from "../call-logs-view-tabs";

/**
 * CallLogsSavePresetModal is fully controlled (`open` / `onOpenChange`), so this
 * wrapper owns the open state locally and renders a trigger button — mirroring
 * how the "Save as New Preset" button in CallLogsFilterPanel would open it.
 */
function CallLogsSavePresetModalDemo({
  onOpenChange,
  onSave,
  ...props
}: CallLogsSavePresetModalProps) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Save as New Preset</Button>
      <CallLogsSavePresetModal
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        onSave={(name) => {
          setOpen(false);
          onSave(name);
        }}
      />
    </>
  );
}

const meta: Meta<typeof CallLogsSavePresetModal> = {
  title: "Custom/Call Logs/CallLogsSavePresetModal",
  component: CallLogsSavePresetModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The confirmation dialog shown when a user clicks "Save as New Preset" in the CallLogsFilterPanel. It captures a name for the current filter combination — the "Captures: N filters" bar reflects how many filters are currently active. Saving calls \`onSave(name)\`; the parent is responsible for adding the result as a new removable tab in CallLogsViewTabs.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-save-preset-modal
\`\`\`

### Import

\`\`\`tsx
import { CallLogsSavePresetModal } from "@/components/custom/call-logs/call-logs-save-preset-modal"
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
      <td style="padding: 12px 16px;">"Captures: N filters" info bar background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Description and info bar text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">"Name" field label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
    filterCount: { control: "number" },
    defaultName: { control: "text" },
    loading: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
  },
  args: {
    open: false,
    filterCount: 4,
    defaultName: "Incoming connected",
    onOpenChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Overview: Story = {
  render: (args) => <CallLogsSavePresetModalDemo {...args} />,
};

export const WithoutSuggestedName: Story = {
  args: {
    defaultName: "",
    filterCount: 2,
  },
  render: (args) => <CallLogsSavePresetModalDemo {...args} />,
};

export const SingleFilterCaptured: Story = {
  args: {
    filterCount: 1,
    defaultName: "Missed",
  },
  render: (args) => <CallLogsSavePresetModalDemo {...args} />,
};

export const Loading: Story = {
  args: {
    open: true,
    loading: true,
  },
};

/* ── Composition: end-to-end flow ── */

const BASE_TABS: CallLogsViewTab[] = [{ id: "all", label: "All" }];

/**
 * Demonstrates the full flow this modal is part of: clicking "Save as New
 * Preset" (standing in for the button in CallLogsFilterPanel's footer) opens
 * this modal; saving adds the preset as a new removable tab that appears
 * immediately in CallLogsViewTabs below the page title, and becomes active.
 */
function EndToEndFlowDemo() {
  const [tabs, setTabs] = React.useState<CallLogsViewTab[]>(BASE_TABS);
  const [activeTabId, setActiveTabId] = React.useState("all");
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h3 style={{ margin: 0, fontFamily: "sans-serif", fontSize: 20 }}>Call Logs</h3>
        <div style={{ marginTop: 12 }}>
          <CallLogsViewTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onRemoveTab={(id) => {
              setTabs((current) => current.filter((tab) => tab.id !== id));
              if (activeTabId === id) setActiveTabId("all");
            }}
          />
        </div>
      </div>
      <div>
        <Button onClick={() => setModalOpen(true)}>Save as New Preset</Button>
      </div>
      <CallLogsSavePresetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        filterCount={4}
        defaultName="Incoming connected"
        onSave={(name) => {
          const id = `preset-${tabs.length}`;
          setTabs((current) => [...current, { id, label: name, removable: true }]);
          setActiveTabId(id);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

export const EndToEndFlow: Story = {
  parameters: { layout: "padded" },
  render: () => <EndToEndFlowDemo />,
};
