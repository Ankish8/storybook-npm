import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import {
  DateRangePicker,
  type DateRangePreset,
  type DateRangeValue,
} from "./date-range-picker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A trigger + popover date range picker with a calendar and a left-hand presets column (Today / Yesterday / Last 7 days / Last 30 days / This month / Last month by default). Clicking a preset commits immediately; manually picking a range commits and closes the popover as soon as the second (end) day is clicked — there's no separate Apply/Cancel step. The month and year in the calendar header are independent dropdowns for jumping directly to a month/year instead of paging through with the arrows.

\`\`\`bash
npx myoperator-ui add date-range-picker
\`\`\`

## Import

\`\`\`tsx
import { DateRangePicker } from "@/components/ui/date-range-picker"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
  <thead>
    <tr style="background-color: var(--color-neutral-50); border-bottom: 2px solid var(--semantic-border-layout);">
      <th style="padding: 12px 16px; text-align: left;">Token</th>
      <th style="padding: 12px 16px; text-align: left;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left;">Usage</th>
      <th style="padding: 12px 16px; text-align: left;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Input Border</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-input</code></td>
      <td style="padding: 12px 16px;">Trigger border (default state)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-border-input); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Surface</td>
      <td style="padding: 12px 16px;"><code>--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Trigger and popover background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-bg-primary); border: 1px solid var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Input Border (Focus)</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-input-focus</code></td>
      <td style="padding: 12px 16px;">Trigger border while the popover is open</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-border-input-focus); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Error</td>
      <td style="padding: 12px 16px;"><code>--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Trigger border in <code>state="error"</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-error-primary); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code>--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Trigger value text, calendar day numbers, month/year dropdown labels, preset labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-text-primary); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code>--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Calendar icon, weekday header row, adjacent-month day numbers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-text-muted); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Text Placeholder</td>
      <td style="padding: 12px 16px;"><code>--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px;">Trigger text color when no range is selected yet</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-text-placeholder); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Text Inverted</td>
      <td style="padding: 12px 16px;"><code>--semantic-text-inverted</code></td>
      <td style="padding: 12px 16px;">Selected day number</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-text-inverted); border: 1px solid var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Popover border, presets-column divider, month/year dropdown button borders</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code>--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Selected day fill (range start/end), today indicator dot</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-primary); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code>--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Range-band highlight between the selected start and end day. This is the token that makes the connected band between start and end read as one continuous shape, rather than two disconnected selected days.</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-info-surface); border: 1px solid var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Border Secondary</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-secondary</code></td>
      <td style="padding: 12px 16px;">Popover scrollbar thumb color</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-border-secondary); border-radius: 6px;"></div></td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">Bg Hover</td>
      <td style="padding: 12px 16px;"><code>--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px;">Preset row hover, calendar nav button hover, day cell hover</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-bg-hover); border-radius: 6px;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "error"],
      description: "Validation state for the trigger",
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger and prevents opening the popover",
    },
    disablePastDates: {
      control: "boolean",
      description: "Disables all calendar days before today",
    },
    placeholder: {
      control: "text",
      description: "Trigger text shown when no range is selected",
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

export const WithoutPresets: Story = {
  name: "Without presets",
  args: {
    presets: [],
    defaultOpen: true,
    defaultValue: {
      start: new Date(2026, 7, 3),
      end: new Date(2026, 7, 5),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `presets={[]}` hides the left presets column entirely, leaving a calendar-only layout.',
      },
    },
  },
};

// Fixed reference "today" so the custom presets below resolve to
// deterministic ranges regardless of when the story is rendered.
const REFERENCE_DATE = new Date(2026, 7, 11);

const customPresets: DateRangePreset[] = [
  {
    label: "This week",
    getRange: () => {
      const start = new Date(REFERENCE_DATE);
      start.setDate(REFERENCE_DATE.getDate() - REFERENCE_DATE.getDay());
      return { start, end: REFERENCE_DATE };
    },
  },
  {
    label: "This quarter",
    getRange: () => {
      const quarterStartMonth = Math.floor(REFERENCE_DATE.getMonth() / 3) * 3;
      const start = new Date(
        REFERENCE_DATE.getFullYear(),
        quarterStartMonth,
        1
      );
      return { start, end: REFERENCE_DATE };
    },
  },
];

export const CustomPresets: Story = {
  args: {
    presets: customPresets,
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`presets` fully replaces the default list — pass any array shaped like `DateRangePreset[]` (`{ label, getRange }`, the same shape as the exported `DEFAULT_DATE_RANGE_PRESETS`) to swap in domain-specific ranges such as \"This week\" or \"This quarter\".",
      },
    },
  },
};

export const DisabledPastDates: Story = {
  name: "Disabled past dates",
  args: {
    disablePastDates: true,
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `disablePastDates`, every calendar day before today renders disabled and cannot be clicked.",
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
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-80 flex-col gap-3">
      <DateRangePicker
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
      />
      <p className="m-0 text-sm text-semantic-text-muted">
        {value.start && value.end
          ? `Selected: ${value.start.toDateString()} - ${value.end.toDateString()}`
          : "No range selected"}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled usage — both `value`/`onValueChange` and `open`/`onOpenChange` are driven by local state in this demo wrapper, rather than relying on the component's internal state.",
      },
    },
  },
};
