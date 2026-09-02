import * as React from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsViewTabs } from "./call-logs-view-tabs";
import type { CallLogsViewTabsProps } from "./types";

/** Bordered, max-width container that mimics the tab row sitting above a call-logs table. */
function RowContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 600,
        width: "100%",
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

/**
 * `activeTabId` is fully controlled — CallLogsViewTabs itself holds no internal state.
 * This demo wrapper keeps the active tab in local state so clicking a tab visibly
 * switches it in the canvas, while still forwarding every change to the incoming
 * `onTabChange` arg so Storybook's Actions panel logs it.
 */
function CallLogsViewTabsDemo(props: CallLogsViewTabsProps) {
  const { activeTabId, onTabChange, ...rest } = props;
  const [currentTabId, setCurrentTabId] = React.useState(activeTabId);

  React.useEffect(() => {
    setCurrentTabId(activeTabId);
  }, [activeTabId]);

  return (
    <CallLogsViewTabs
      {...rest}
      activeTabId={currentTabId}
      onTabChange={(id) => {
        setCurrentTabId(id);
        onTabChange(id);
      }}
    />
  );
}

const meta: Meta<typeof CallLogsViewTabs> = {
  title: "Custom/Call Logs/CallLogsViewTabs",
  component: CallLogsViewTabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The Call Logs page's view switcher — built-in views (e.g. "All") displayed alongside user-saved filter presets. Presets are marked \`removable\` and render a close (×) icon that fires \`onRemoveTab\` independently of the tab's own click handler. \`activeTabId\` is fully controlled: the component holds no internal state, so the parent decides which tab is active.

Only the first \`maxVisiblePresets\` (default 3) removable presets render inline — any further ones collapse into a "More (N)" dropdown, so the tab row doesn't grow unbounded as a user saves more presets. Non-removable built-in views are never counted against this limit and always render inline.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-view-tabs
\`\`\`

### Import

\`\`\`tsx
import { CallLogsViewTabs } from "@/components/custom/call-logs/call-logs-view-tabs"
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
      <td style="padding: 12px 16px;">Active tab background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Active tab label text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Inactive tab label text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px;">Inactive tab hover background</td>
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
    tabs: { control: "object" },
    activeTabId: { control: "text" },
    onTabChange: { action: "tabChange" },
    onRemoveTab: { action: "removeTab" },
    onCustomize: { action: "customize" },
    customizeLabel: { control: "text" },
  },
  args: {
    onTabChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    tabs: [
      { id: "all", label: "All" },
      { id: "preset-1", label: "Connected", removable: true },
      { id: "preset-2", label: "Missed", removable: true },
      { id: "preset-3", label: "AI Handled", removable: true },
    ],
    activeTabId: "all",
    onRemoveTab: fn(),
  },
  render: (args) => (
    <RowContainer>
      <CallLogsViewTabsDemo {...args} />
    </RowContainer>
  ),
};

export const ActiveSavedView: Story = {
  args: {
    tabs: [
      { id: "all", label: "All" },
      { id: "preset-1", label: "Connected", removable: true },
      { id: "preset-2", label: "Missed", removable: true },
      { id: "preset-3", label: "AI Handled", removable: true },
    ],
    activeTabId: "preset-1",
    onRemoveTab: fn(),
  },
  render: (args) => (
    <RowContainer>
      <CallLogsViewTabsDemo {...args} />
    </RowContainer>
  ),
};

export const OverflowDropdown: Story = {
  name: "Overflow (More dropdown)",
  parameters: {
    docs: {
      description: {
        story:
          'With more saved presets than `maxVisiblePresets` (default 3), the extras collapse into a "More (N)" dropdown instead of growing the tab row indefinitely. Each overflow tab can optionally show a `count`, and a "Customize tabs..." footer link renders when `onCustomize` is provided.',
      },
    },
  },
  args: {
    tabs: [
      { id: "all", label: "All" },
      { id: "preset-1", label: "Connected", removable: true },
      { id: "preset-2", label: "Missed", removable: true },
      { id: "preset-3", label: "AI Handled", removable: true },
      { id: "preset-4", label: "Voicemail", removable: true },
      { id: "preset-5", label: "Starred", removable: true, count: 2 },
      { id: "preset-6", label: "With Notes", removable: true, count: 4 },
      { id: "preset-7", label: "Transferred", removable: true, count: 13 },
      { id: "preset-8", label: "Recorded", removable: true, count: 13 },
      { id: "preset-9", label: "Abandoned", removable: true, count: 4 },
      { id: "preset-10", label: "Blocked", removable: true, count: 2 },
      { id: "preset-11", label: "Outgoing", removable: true, count: 3 },
    ],
    activeTabId: "all",
    onRemoveTab: fn(),
    onCustomize: fn(),
  },
  render: (args) => (
    <RowContainer>
      <CallLogsViewTabsDemo {...args} />
    </RowContainer>
  ),
};

export const NoRemovableTabs: Story = {
  args: {
    tabs: [
      { id: "all", label: "All" },
      { id: "active", label: "Active" },
      { id: "archived", label: "Archived" },
    ],
    activeTabId: "all",
  },
  render: (args) => (
    <RowContainer>
      <CallLogsViewTabsDemo {...args} />
    </RowContainer>
  ),
};

export const Empty: Story = {
  args: {
    tabs: [],
    activeTabId: "",
  },
  render: (args) => (
    <RowContainer>
      <CallLogsViewTabsDemo {...args} />
    </RowContainer>
  ),
};
