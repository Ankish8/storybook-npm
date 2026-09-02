import * as React from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles } from "lucide-react";
import { fn } from "storybook/test";

import { CallLogsActiveFiltersBar } from "./call-logs-active-filters-bar";
import type { CallLogsActiveFilterChip } from "./types";

/** Bordered, max-width container that mimics the bar sitting below the Call Logs top bar. */
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

const SAMPLE_CHIPS: CallLogsActiveFilterChip[] = [
  { id: "duration", label: "Duration:", value: "Last 1 hour" },
  {
    id: "agents",
    label: "Agent:",
    value: "Akhil, Nivedithatha +2 more",
    tooltipItems: ["Akhil Yadav", "Nivedithatha N.", "Sumati Dixit", "Komal Rawat"],
  },
  { id: "call-direction", label: "Call:", value: "Incoming, Outgoing" },
  { id: "ai-agent-eva", value: "Eva", icon: <Sparkles className="size-3" /> },
];

const meta: Meta<typeof CallLogsActiveFiltersBar> = {
  title: "Custom/Call Logs/CallLogsActiveFiltersBar",
  component: CallLogsActiveFiltersBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Sits below the Call Logs top bar (view tabs, line select, date range, more filters) once one or more filters are applied — one removable chip per active filter, plus "Save as Preset" and "Clear All" actions. Like \`LiveCallsBanner\` and \`BulkSelectionToolbar\`, it doesn't hide itself when there's nothing to show — render it only when \`chips.length > 0\`.

A chip for a multi-value filter should summarize as a single chip (e.g. "Akhil, Nivedithatha +2 more") rather than one chip per value — pass the full list via \`tooltipItems\` and hovering the chip reveals every value in a tooltip.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-active-filters-bar
\`\`\`

### Import

\`\`\`tsx
import { CallLogsActiveFiltersBar } from "@/components/custom/call-logs/call-logs-active-filters-bar"
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
      <td style="padding: 12px 16px;">Bottom border separating the bar from the table</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Default chip background (via <code>Tag</code>)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Chip label/value text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">"Save as Preset" action</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">"Clear All" action</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code> / <code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-inverted</code></td>
      <td style="padding: 12px 16px;">Tooltip background / text on a summarized multi-value chip (via <code>tooltipItems</code>)</td>
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
    chips: { control: "object" },
    onRemoveChip: { action: "removeChip" },
    onSaveAsPreset: { action: "saveAsPreset" },
    onClearAll: { action: "clearAll" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    chips: SAMPLE_CHIPS,
    onRemoveChip: fn(),
    onSaveAsPreset: fn(),
    onClearAll: fn(),
  },
  render: (args) => (
    <RowContainer>
      <CallLogsActiveFiltersBar {...args} />
    </RowContainer>
  ),
};

export const SingleFilter: Story = {
  name: "Single filter",
  args: {
    chips: [{ id: "duration", label: "Duration:", value: "Last 1 hour" }],
    onRemoveChip: fn(),
    onSaveAsPreset: fn(),
    onClearAll: fn(),
  },
  render: (args) => (
    <RowContainer>
      <CallLogsActiveFiltersBar {...args} />
    </RowContainer>
  ),
};

export const SummarizedMultiValueChip: Story = {
  name: "Summarized multi-value chip",
  args: {
    chips: [
      {
        id: "agents",
        label: "Agent:",
        value: "Akhil, Nivedithatha +2 more",
        tooltipItems: ["Akhil Yadav", "Nivedithatha N.", "Sumati Dixit", "Komal Rawat"],
      },
    ],
    onRemoveChip: fn(),
    onSaveAsPreset: fn(),
    onClearAll: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A filter with more selections than fit inline (e.g. 4 selected agents) summarizes as a single chip — the first couple of values plus a “+N more” count — with the full list passed via `tooltipItems`. Hover the chip to see every value.",
      },
    },
  },
  render: (args) => (
    <RowContainer>
      <CallLogsActiveFiltersBar {...args} />
    </RowContainer>
  ),
};

export const WithoutSaveAsPreset: Story = {
  name: "Without Save as Preset",
  args: {
    chips: SAMPLE_CHIPS,
    onRemoveChip: fn(),
    onClearAll: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Omitting `onSaveAsPreset` hides that action — useful once the current combination is already an active saved preset.',
      },
    },
  },
  render: (args) => (
    <RowContainer>
      <CallLogsActiveFiltersBar {...args} />
    </RowContainer>
  ),
};

/* ── Interactive demo ── */

function InteractiveDemo() {
  const [chips, setChips] = React.useState(SAMPLE_CHIPS);

  if (chips.length === 0) {
    return <p className="m-0 text-sm text-semantic-text-muted">All filters cleared.</p>;
  }

  return (
    <CallLogsActiveFiltersBar
      chips={chips}
      onRemoveChip={(id) => setChips((prev) => prev.filter((chip) => chip.id !== id))}
      onSaveAsPreset={fn()}
      onClearAll={() => setChips([])}
    />
  );
}

export const Interactive: Story = {
  render: () => (
    <RowContainer>
      <InteractiveDemo />
    </RowContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Removing a chip or clicking \"Clear All\" updates local state — demonstrating that `CallLogsActiveFiltersBar` is a controlled, presentation-only component: the consumer owns the filter state and derives `chips` from it.",
      },
    },
  },
};
