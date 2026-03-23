import type { Meta, StoryObj } from "@storybook/react";
import { DateDivider } from "./date-divider";

const meta: Meta<typeof DateDivider> = {
  title: "Components/Date Divider",
  component: DateDivider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A horizontal line with centered date text, used in chat timelines to visually separate messages by date.

\`\`\`bash
npx myoperator-ui add date-divider
\`\`\`

## Import

\`\`\`tsx
import { DateDivider } from "@/components/ui/date-divider"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Line Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Date Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Date Text</td>
      <td style="padding: 12px 16px;">Label/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The date text to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    children: "Today",
  },
};

export const Today: Story = {
  args: {
    children: "Today",
  },
};

export const FullDate: Story = {
  name: "Full Date",
  args: {
    children: "March 20, 2026",
  },
};

export const InTimeline: Story = {
  name: "In Timeline",
  render: () => (
    <div className="flex flex-col gap-2 max-w-md mx-auto">
      <div className="rounded-lg bg-semantic-bg-ui p-3">
        <p className="m-0 text-sm text-semantic-text-primary">
          Hey, how are you?
        </p>
        <p className="m-0 text-[10px] text-semantic-text-muted mt-1">
          10:30 AM
        </p>
      </div>

      <div className="rounded-lg bg-semantic-bg-ui p-3 self-end">
        <p className="m-0 text-sm text-semantic-text-primary">
          I&apos;m good, thanks! How about you?
        </p>
        <p className="m-0 text-[10px] text-semantic-text-muted mt-1">
          10:32 AM
        </p>
      </div>

      <DateDivider>Yesterday</DateDivider>

      <div className="rounded-lg bg-semantic-bg-ui p-3">
        <p className="m-0 text-sm text-semantic-text-primary">
          Can we schedule a meeting?
        </p>
        <p className="m-0 text-[10px] text-semantic-text-muted mt-1">
          3:15 PM
        </p>
      </div>

      <DateDivider>March 19, 2026</DateDivider>

      <div className="rounded-lg bg-semantic-bg-ui p-3 self-end">
        <p className="m-0 text-sm text-semantic-text-primary">
          Sure, let me check my calendar.
        </p>
        <p className="m-0 text-[10px] text-semantic-text-muted mt-1">
          9:00 AM
        </p>
      </div>
    </div>
  ),
};
