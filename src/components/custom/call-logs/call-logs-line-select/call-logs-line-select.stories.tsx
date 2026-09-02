import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { CallLogsLineSelect } from "./call-logs-line-select";
import type { MultiSelectOption } from "../../../ui/multi-select";

const lineOptions: MultiSelectOption[] = [
  { value: "line1", label: "+1 (555) 010-0001", caption: "Sales" },
  { value: "line2", label: "+1 (555) 010-0002", caption: "Support" },
  { value: "line3", label: "+1 (555) 010-0003", caption: "Billing" },
  { value: "line4", label: "+1 (555) 010-0004", caption: "Onboarding" },
];

const meta: Meta<typeof CallLogsLineSelect> = {
  title: "Custom/Call Logs/CallLogsLineSelect",
  component: CallLogsLineSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The Call Logs page's "Line (number dialled)" filter — a thin wrapper around the shared \`MultiSelect\` with the Call Logs defaults baked in: detailed rows (checkbox + phone number + department caption), a pinned "All lines" select-all row, search enabled, and a compact "N lines selected" trigger summary in place of a chip per selection — hover the summary to see the full list of selected numbers in a tooltip. Every \`MultiSelect\` prop can still be overridden.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-line-select
\`\`\`

### Import

\`\`\`tsx
import { CallLogsLineSelect } from "@/components/custom/call-logs/call-logs-line-select"
\`\`\`

### Design Tokens

Inherited unchanged from \`MultiSelect\` — see that component's docs for the full token table (trigger border, checkbox states, select-all divider, etc.).
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    options: lineOptions,
    onValueChange: fn(),
  },
  argTypes: {
    selectAllLabel: {
      control: "text",
      description: 'Label for the pinned select-all row. Defaults to "All lines".',
    },
    optionVariant: {
      control: "select",
      options: ["simple", "detailed"],
      description: 'Row style. Defaults to "detailed" (checkbox + phone number + caption).',
    },
    searchable: {
      control: "boolean",
      description: "Enables the search input. Defaults to true.",
    },
    placeholder: {
      control: "text",
      description: 'Trigger placeholder. Defaults to "Select lines".',
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSelection: Story = {
  args: {
    defaultValue: ["line1", "line3"],
  },
  parameters: {
    docs: {
      description: {
        story:
          'With one or more lines selected, the trigger shows a compact "N lines selected" summary instead of a chip per line. Hover the summary to reveal the full list of selected numbers in a tooltip.',
      },
    },
  },
};

export const CustomSelectAllLabel: Story = {
  name: "Custom select-all label",
  args: {
    selectAllLabel: "Every line",
  },
};

export const SimpleRows: Story = {
  name: "Simple rows (override)",
  args: {
    optionVariant: "simple",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `optionVariant="simple"` overrides the Call Logs default and drops the checkbox + caption for a checkmark-style row, matching plain `MultiSelect` usage elsewhere in the library.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ["line1"],
  },
};
