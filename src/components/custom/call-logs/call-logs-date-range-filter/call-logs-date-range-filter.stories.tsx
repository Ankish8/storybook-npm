import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { CallLogsDateRangeFilter } from "./call-logs-date-range-filter";
import type { DateRangeValue } from "../../../ui/date-range-picker";

const meta: Meta<typeof CallLogsDateRangeFilter> = {
  title: "Custom/Call Logs/CallLogsDateRangeFilter",
  component: CallLogsDateRangeFilter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Call Logs page's "Date Range" filter — a thin wrapper around the shared \`DateRangePicker\` (trigger + popover calendar with Today / Yesterday / Last 7 days / Last 30 days / This month / Last month presets; picking a range commits immediately, no separate Apply/Cancel step). The one Call Logs-specific default: future dates are blocked, since call history can't exist for a date that hasn't happened yet. Set \`allowFutureDates\` to lift that restriction.

### Installation

\`\`\`bash
npx myoperator-ui add call-logs-date-range-filter
\`\`\`

### Import

\`\`\`tsx
import { CallLogsDateRangeFilter } from "@/components/custom/call-logs/call-logs-date-range-filter"
\`\`\`

### Design Tokens

Inherited unchanged from \`DateRangePicker\` — see that component's docs for the full token table (trigger border, popover surface, selected-range fill, etc.).
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    allowFutureDates: {
      control: "boolean",
      description:
        "Whether future dates can be selected. Defaults to false — call history can't exist for a date that hasn't happened yet.",
    },
    state: {
      control: "select",
      options: ["default", "error"],
      description: "Validation state for the trigger",
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

export const WithDefaultRange: Story = {
  args: {
    defaultValue: {
      start: new Date(2026, 7, 3),
      end: new Date(2026, 7, 5),
    },
  },
};

export const AllowFutureDates: Story = {
  name: "Allow future dates",
  args: {
    allowFutureDates: true,
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `allowFutureDates`, the calendar no longer blocks dates after today — useful for a scheduled-calls view rather than call history.",
      },
    },
  },
};

export const ErrorState: Story = {
  name: "Error state",
  args: {
    state: "error",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: {
      start: new Date(2026, 7, 3),
      end: new Date(2026, 7, 5),
    },
  },
};

function ControlledDemo() {
  const [value, setValue] = React.useState<DateRangeValue>({
    start: new Date(2026, 7, 3),
    end: new Date(2026, 7, 5),
  });

  return (
    <div className="flex w-80 flex-col gap-3">
      <CallLogsDateRangeFilter value={value} onValueChange={setValue} />
      <span className="text-sm text-semantic-text-muted">
        {value.start && value.end
          ? `Selected: ${value.start.toDateString()} - ${value.end.toDateString()}`
          : "No range selected"}
      </span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
