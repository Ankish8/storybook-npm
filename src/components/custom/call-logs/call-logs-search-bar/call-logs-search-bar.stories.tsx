import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CallLogsSearchBar } from "./call-logs-search-bar";
import type { CallLogsSearchBarProps, CallLogsSearchBarSuggestion } from "./types";

const SAMPLE_NUMBERS: CallLogsSearchBarSuggestion[] = [
  { value: "1", label: "+91 98765 43210" },
  { value: "2", label: "+91 98324 43210" },
  { value: "3", label: "+91 98201 45632" },
  { value: "4", label: "+91 98045 88123" },
  { value: "5", label: "+91 98765 43210" },
];

/**
 * CallLogsSearchBar is fully controlled (`value`/`onValueChange`) and holds no
 * internal state of its own beyond focus tracking, so this wrapper holds the
 * live query in local state (filtering the sample suggestions as you type)
 * while still forwarding every change to the `onValueChange` passed via args,
 * keeping the Storybook Actions panel in sync.
 */
function CallLogsSearchBarDemo({ value, onValueChange, ...props }: CallLogsSearchBarProps) {
  const [query, setQuery] = React.useState(value);

  return (
    <CallLogsSearchBar
      {...props}
      value={query}
      onValueChange={(next) => {
        setQuery(next);
        onValueChange(next);
      }}
      suggestions={SAMPLE_NUMBERS.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )}
      onSelect={(s) => setQuery(s.label)}
      onClear={() => setQuery("")}
    />
  );
}

const meta: Meta<typeof CallLogsSearchBar> = {
  title: "Custom/Call Logs/CallLogsSearchBar",
  component: CallLogsSearchBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The Call Logs page header search: a text input with a leading search icon and a clear button, plus a live-suggestions dropdown that opens while the input is focused and has a non-empty value. The substring in each suggestion matching the typed query is bolded. Selecting a suggestion commits its label as the value, closes the dropdown, and blurs the input — matching the design's three states (empty placeholder, focused with open suggestions, and a committed value with the dropdown closed).

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-search-bar
\`\`\`

### Import

\`\`\`tsx
import { CallLogsSearchBar } from "@/components/custom/call-logs/call-logs-search-bar"
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
      <td style="padding: 12px 16px;">Input and dropdown background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Input border (unfocused/committed), dropdown border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Input Focus</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input-focus</code></td>
      <td style="padding: 12px 16px;">Input border while focused/typing (design's teal accent)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">Empty-state placeholder text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A2A6B1; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Suggestion text and the bolded matched substring</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Search and clear icons</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bg UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Suggestion row hover background</td>
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
    value: { control: "text" },
    onValueChange: { action: "valueChange" },
    onSelect: { action: "select" },
    onClear: { action: "clear" },
  },
  args: {
    onValueChange: fn(),
    onSelect: fn(),
    onClear: fn(),
  },
  render: (args) => (
    <div style={{ width: 423 }}>
      <CallLogsSearchBarDemo {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    value: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state — just the search icon and placeholder, no clear button or dropdown.",
      },
    },
  },
};

export const Typing: Story = {
  args: {
    value: "98",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Focused with a non-empty value: the border switches to the focus accent, a clear button appears, and the suggestions dropdown opens with the matched "98" bolded in each result. Click into the input to see the focus state.',
      },
    },
  },
};

export const Filled: Story = {
  args: {
    value: "+91 98765 43210",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A committed value after selecting a suggestion (or once the input blurs) — clear button visible, dropdown closed, border back to the unfocused layout color.",
      },
    },
  },
};

export const NoSuggestions: Story = {
  args: {
    value: "zzz",
  },
  parameters: {
    docs: {
      description: {
        story: "When no suggestion matches the typed query, the dropdown simply doesn't open.",
      },
    },
  },
};
