import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRangeModal } from "./index";
import { Button } from "../../ui/button";

const meta: Meta<typeof DateRangeModal> = {
  title: "Custom/DateRangeModal",
  component: DateRangeModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A modal for selecting a date range with start and end date pickers. Uses a custom calendar popover with no external date-picker dependencies.

\`\`\`bash
npx myoperator-ui add date-range-modal
\`\`\`

## Import

\`\`\`tsx
import { DateRangeModal } from "@/components/custom/date-range-modal"
\`\`\`

## Usage

\`\`\`tsx
const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>Select Date Range</Button>
<DateRangeModal
  open={open}
  onOpenChange={setOpen}
  onConfirm={(start, end) => {
    console.log("Selected:", start, end);
    setOpen(false);
  }}
  onCancel={() => setOpen(false)}
/>
\`\`\`

## Design Tokens

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
      <td style="padding: 12px 16px;">Selected Day</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Selected date circle background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 50%; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Input Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input</code></td>
      <td style="padding: 12px 16px;">Date input field border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Separator</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Horizontal divider lines</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo(props: Partial<React.ComponentProps<typeof DateRangeModal>>) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<{ start: Date; end: Date } | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Date Range Modal</Button>
      {selected && (
        <p className="text-sm text-semantic-text-muted">
          Selected: {selected.start.toLocaleDateString()} → {selected.end.toLocaleDateString()}
        </p>
      )}
      <DateRangeModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={(start, end) => {
          setSelected({ start, end });
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        {...props}
      />
    </div>
  );
}

export const Overview: Story = {
  render: () => <ModalDemo />,
};

export const WithDates: Story = {
  name: "With Pre-existing Context",
  parameters: {
    docs: {
      description: {
        story: "Click the button to open the date range modal.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <DateRangeModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={(start, end) => {
            console.log("Confirmed:", start, end);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  name: "Loading State",
  parameters: {
    docs: {
      description: {
        story: "The confirm button shows a loading state and is disabled during async operations. Click the button to open.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Modal (Loading)</Button>
        <DateRangeModal
          open={open}
          onOpenChange={setOpen}
          loading={true}
          onConfirm={() => {}}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const CustomTitle: Story = {
  name: "Custom Title & Button Text",
  render: () => (
    <ModalDemo
      title="Filter by date range"
      confirmButtonText="Apply filter"
      cancelButtonText="Dismiss"
    />
  ),
};
