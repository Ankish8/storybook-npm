import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsFilterPanel } from "./call-logs-filter-panel";
import type { CallLogsFilterPanelProps, CallLogsFilterValue } from "./types";
import type { MultiSelectOption } from "../../../ui/multi-select";

/** Fixed-width, fixed-height bordered container that mimics the slide-out drawer the panel is designed to live in. */
function PanelContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 606,
        height: 900,
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/**
 * CallLogsFilterPanel is fully controlled (`value` / `onValueChange`) and holds no
 * internal state of its own — Storybook's `args` object is static, so clicking a
 * pill or checkbox would have nothing to re-render against unless something owns
 * the live value. This wrapper holds that state locally and feeds the latest value
 * back down (while still forwarding to the `onValueChange` passed in via args, so
 * the Storybook Actions panel keeps logging every change), so every story below is
 * interactive in the canvas.
 */
function CallLogsFilterPanelDemo({
  value,
  onValueChange,
  ...props
}: CallLogsFilterPanelProps) {
  const [filterValue, setFilterValue] = React.useState<CallLogsFilterValue>(value);

  return (
    <CallLogsFilterPanel
      {...props}
      value={filterValue}
      onValueChange={(next) => {
        setFilterValue(next);
        onValueChange(next);
      }}
    />
  );
}

/* ── Shared option lists ── */

const lineOptions: MultiSelectOption[] = [
  { value: "all", label: "All Numbers" },
  { value: "1800-200-1234", label: "1800-200-1234" },
  { value: "1800-200-4323", label: "1800-200-4323" },
  { value: "1800-300-4567", label: "1800-300-4567" },
  { value: "1800-300-4367", label: "1800-300-4367" },
  { value: "+91-22-4890-2211", label: "+91 22 4890 2211" },
  { value: "+91-80-4567-8901", label: "+91 80 4567 8901" },
];

const campaignOptions: MultiSelectOption[] = [
  { value: "all", label: "All" },
  { value: "click-to-call", label: "Click-to-Call" },
  { value: "peer-to-peer", label: "Campaign · Peer-to-peer" },
  { value: "broadcasting", label: "Campaign · Broadcasting" },
];

const aiAgentOptions: MultiSelectOption[] = [
  { value: "all", label: "All AI Agents" },
  { value: "aria", label: "Aria" },
  { value: "nova", label: "Nova" },
  { value: "athena", label: "Athena" },
];

const transferredToOptions: MultiSelectOption[] = [
  { value: "anyone", label: "Anyone" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "customer-success", label: "Customer Success" },
];

const agentOptions: MultiSelectOption[] = [
  { value: "all", label: "All Agents" },
  { value: "priya", label: "Priya Nair" },
  { value: "rohit", label: "Rohit Sharma" },
  { value: "aisha", label: "Aisha Khan" },
];

const departmentOptions: MultiSelectOption[] = [
  { value: "all", label: "All Department" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "customer-success", label: "Customer Success" },
];

/* ── Shared filter values ── */

const emptyFilterValue: CallLogsFilterValue = {
  callStatus: [],
  callDirection: [],
  source: "all",
  duration: "all",
  line: [],
  campaign: [],
  aiHandling: [],
  transferStatus: [],
  callMarkers: { notes: false, starred: false },
  agents: [],
  departments: [],
  aiAgent: [],
  transferredTo: [],
};

const filledFilterValue: CallLogsFilterValue = {
  callStatus: ["connected", "missed"],
  callDirection: ["incoming", "outgoing"],
  source: "all",
  duration: "all",
  line: ["1800-200-1234"],
  campaign: ["click-to-call"],
  aiHandling: ["self-served"],
  transferStatus: ["missed-on-transfer"],
  callMarkers: { notes: true, starred: false },
  agents: ["rohit"],
  departments: ["sales", "customer-success"],
  aiAgent: ["aria", "nova"],
  transferredTo: ["sales", "support"],
};

const meta: Meta<typeof CallLogsFilterPanel> = {
  title: "Custom/Call Logs/CallLogsFilterPanel",
  component: CallLogsFilterPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A slide-out "Filters" drawer for the Call Logs page: a sticky header (title, result count, close button), a scrollable body with Call Type (Call Status / Call Direction multi-selects, Source select, Duration pill group), Call Properties (Phone Number / Campaign Name / AI Handling / Transfer Status multi-selects, Call Markers checkboxes), and People & Routing (Agent / Department / AI Agent / Transferred to multi-selects), and a sticky footer with Reset / Save as New Preset / Apply Filter actions. Every multi-select uses detailed (checkbox) rows. The panel is fully controlled via \`value\`/\`onValueChange\` and holds no internal state — drop it into a consumer-provided slide-out/drawer container, it fills the available width and height.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-filter-panel
\`\`\`

### Import

\`\`\`tsx
import { CallLogsFilterPanel } from "@/components/custom/call-logs/call-logs-filter-panel"
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
      <td style="padding: 12px 16px;">Bg Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Panel background, unselected pill background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Header/footer dividers, section-label rule, unselected pill border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">"Filters" title, selected pill text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Result count, section labels (Call Type, Call Properties, People & Routing), close icon</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Field group labels (Call Status, Duration, Call Markers), unselected pill text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px;">Close button hover surface</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Brand Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand-surface</code></td>
      <td style="padding: 12px 16px;">Selected Duration pill background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EAF8FA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Accent</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-accent</code></td>
      <td style="padding: 12px 16px;">Selected pill border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #27ABB8; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Selected chip background on every multi-select field (inherited from MultiSelect)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

**Note on selected-pill styling**: unlike some sibling Call Logs components (e.g. \`CallJourneyPanel\`'s highlighted event card, which falls back to \`--semantic-info-border\` because no token matches its teal exactly), the selected pill state here (\`--semantic-brand-surface\` background + \`--semantic-border-accent\` border) is an *exact* match for the Figma design's teal accent color — no approximation was needed.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    resultCount: { control: "number" },
    value: { control: "object" },
    lineOptions: { control: "object" },
    campaignOptions: { control: "object" },
    aiAgentOptions: { control: "object" },
    transferredToOptions: { control: "object" },
    agentOptions: { control: "object" },
    departmentOptions: { control: "object" },
    onClose: { action: "close" },
    onReset: { action: "reset" },
    onSaveAsPreset: { action: "saveAsPreset" },
    onApply: { action: "apply" },
    onValueChange: { action: "valueChange" },
  },
  args: {
    lineOptions,
    campaignOptions,
    aiAgentOptions,
    transferredToOptions,
    agentOptions,
    departmentOptions,
    onClose: fn(),
    onReset: fn(),
    onSaveAsPreset: fn(),
    onApply: fn(),
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    resultCount: 20,
    value: filledFilterValue,
  },
  render: (args) => (
    <PanelContainer>
      <CallLogsFilterPanelDemo {...args} />
    </PanelContainer>
  ),
};

export const EmptyState: Story = {
  args: {
    resultCount: 482,
    value: emptyFilterValue,
  },
  render: (args) => (
    <PanelContainer>
      <CallLogsFilterPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Every filter reset to its neutral default (\"all\" / empty) — the state of the panel before the user has applied any filters.",
      },
    },
  },
};

export const DurationSelected: Story = {
  args: {
    resultCount: 34,
    value: { ...filledFilterValue, duration: "custom" },
  },
  render: (args) => (
    <PanelContainer>
      <CallLogsFilterPanelDemo {...args} />
    </PanelContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The \"Custom\" duration pill selected instead of \"All duration\", demonstrating the selected-pill styling on a non-default choice.",
      },
    },
  },
};
