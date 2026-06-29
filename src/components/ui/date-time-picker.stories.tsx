import type { Meta, StoryObj } from "@storybook/react";

import { DateTimePicker } from "./date-time-picker";

const sampleValue = {
  date: new Date(2026, 4, 12),
  startTime: "10:30:00",
  endTime: "12:30:00",
};

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A date and time picker input with a calendar popover and start/end time fields. Times are selected through a custom column picker (Hours / Minutes / Seconds / AM-PM) so the control renders consistently across browsers and follows the design tokens.

\`\`\`bash
npx myoperator-ui add date-time-picker
\`\`\`

## Import

\`\`\`tsx
import { DateTimePicker } from "@/components/ui/date-time-picker"
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
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code>--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Selected calendar day</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-primary); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Input Border</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-input</code></td>
      <td style="padding: 12px 16px;">Trigger and time input borders</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-border-input); border-radius: 6px;"></div></td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">Surface</td>
      <td style="padding: 12px 16px;"><code>--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Input and popover surface</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: var(--semantic-bg-primary); border: 1px solid var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the trigger",
    },
    required: {
      control: "boolean",
      description: "Shows a red asterisk next to the label",
    },
    variant: {
      control: "select",
      options: ["date-time", "date-only", "time-only"],
      description: "Controls whether the picker shows date, time, or both",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Width and trigger height of the picker",
    },
    state: {
      control: "select",
      options: ["default", "error"],
      description: "Validation state for the trigger",
    },
    showEndTime: {
      control: "boolean",
      description: "Show or hide the end time field",
    },
    showSeconds: {
      control: "boolean",
      description:
        "Force seconds on or off. When omitted, seconds appear automatically when a selected time includes non-zero seconds.",
    },
    minuteStep: {
      control: { type: "number", min: 1, max: 30 },
      description:
        "Step between selectable minutes in the time column picker (default 5).",
    },
    secondStep: {
      control: { type: "number", min: 1, max: 30 },
      description:
        "Step between selectable seconds in the time column picker (default 5).",
    },
    showClear: {
      control: "boolean",
      description: "Show or hide the clear action when a value is selected",
    },
    closeOnSelect: {
      control: "boolean",
      description: "Close the popover after selecting a calendar day",
    },
    disablePastDates: {
      control: "boolean",
      description: "Disable dates before today",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    defaultValue: sampleValue,
  },
};

export const Empty: Story = {
  args: {},
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A field-style label rendered above the trigger, matching the label style used by `Input` and `SelectField`. Pass `required` to show the red asterisk.",
      },
    },
  },
  args: {
    label: "Event date",
    required: true,
    defaultValue: sampleValue,
  },
};

export const WithOptionalLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A label without the required asterisk — the optional-field case. Same label style as `Input` and `SelectField`, just no `required`.",
      },
    },
  },
  args: {
    label: "Event date",
    defaultValue: sampleValue,
  },
};

export const Error: Story = {
  args: {
    defaultValue: sampleValue,
    state: "error",
  },
};

export const DateOnly: Story = {
  args: {
    defaultValue: sampleValue,
    variant: "date-only",
  },
};

export const TimeOnly: Story = {
  args: {
    defaultValue: sampleValue,
    variant: "time-only",
    showEndTime: false,
  },
};

export const StartTimeOnly: Story = {
  args: {
    defaultValue: sampleValue,
    showEndTime: false,
  },
};

export const WithSeconds: Story = {
  args: {
    defaultValue: {
      date: new Date(2026, 4, 12),
      startTime: "10:30:15",
      endTime: "12:30:45",
    },
  },
};

export const WithoutSeconds: Story = {
  args: {
    defaultValue: {
      date: new Date(2026, 4, 12),
      startTime: "10:30:15",
      endTime: "12:30:45",
    },
    showSeconds: false,
  },
};

export const OpenByDefault: Story = {
  args: {
    defaultValue: sampleValue,
    defaultOpen: true,
  },
};

export const TimeColumnPicker: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click a time field to reveal the Hours / Minutes / Seconds / AM-PM columns. The selected value in each column is highlighted and scrolled into view.",
      },
    },
  },
  args: {
    defaultValue: {
      date: new Date(2026, 4, 18),
      startTime: "10:30:30",
      endTime: "12:30:30",
    },
    showSeconds: true,
    defaultOpen: true,
  },
};

export const CustomTimeSteps: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `minuteStep` and `secondStep` to control the granularity of the time columns. Here minutes step by 15.",
      },
    },
  },
  args: {
    defaultValue: sampleValue,
    minuteStep: 15,
    defaultOpen: true,
  },
};

export const WithDateBounds: Story = {
  args: {
    defaultValue: sampleValue,
    minDate: new Date(2026, 4, 10),
    maxDate: new Date(2026, 4, 20),
  },
};

export const Responsive: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "The trigger fills its container (`w-full`) and the popover follows the trigger width, clamped to a 280–360px design range and capped to the viewport so it never overflows on mobile or over-stretches inside a wide form field. Resize the preview to see it adapt.",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div className="w-full max-w-[640px] rounded-lg border border-dashed border-semantic-border-layout p-4">
        <p className="m-0 mb-2 text-sm text-semantic-text-muted">
          Full-width form field (popover clamps to 360px)
        </p>
        <DateTimePicker defaultValue={sampleValue} className="sm:w-full" />
      </div>
      <div className="w-[240px] rounded-lg border border-dashed border-semantic-border-layout p-4">
        <p className="m-0 mb-2 text-sm text-semantic-text-muted">
          Narrow container (240px)
        </p>
        <DateTimePicker defaultValue={sampleValue} className="sm:w-full" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex flex-col gap-4">
      <DateTimePicker size="sm" defaultValue={sampleValue} />
      <DateTimePicker size="default" defaultValue={sampleValue} />
      <DateTimePicker size="lg" defaultValue={sampleValue} />
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-col gap-4">
      <DateTimePicker defaultValue={sampleValue} variant="date-time" />
      <DateTimePicker defaultValue={sampleValue} variant="date-only" />
      <DateTimePicker
        defaultValue={sampleValue}
        variant="time-only"
        showEndTime={false}
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DateTimePicker defaultValue={sampleValue} />
      <DateTimePicker defaultValue={sampleValue} state="error" />
      <DateTimePicker defaultValue={sampleValue} disabled />
    </div>
  ),
};
