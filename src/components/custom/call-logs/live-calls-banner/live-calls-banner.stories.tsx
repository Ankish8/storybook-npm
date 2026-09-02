import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { LiveCallsBanner } from "./live-calls-banner";

const meta: Meta<typeof LiveCallsBanner> = {
  title: "Custom/Call Logs/LiveCallsBanner",
  component: LiveCallsBanner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A banner that sits above a call-logs table to surface how many calls are currently live, with an optional Hide/Show toggle to collapse or expand the live calls in the table below.

### Installation

\`\`\`bash
npx myoperator-ui add live-calls-banner
\`\`\`

### Import

\`\`\`tsx
import { LiveCallsBanner } from "@/components/custom/call-logs/live-calls-banner"
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
      <td style="padding: 12px 16px;">Banner top border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Banner background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-hover</code></td>
      <td style="padding: 12px 16px;">Pulsing live indicator dot</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #079455; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-text</code></td>
      <td style="padding: 12px 16px;">"N live calls" label text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #067647; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Hide/Show toggle</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: { control: "number" },
    expanded: { control: "boolean" },
    onToggle: { action: "toggled" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    count: 2,
    expanded: true,
    onToggle: fn(),
  },
};

export const Collapsed: Story = {
  args: {
    count: 2,
    expanded: false,
    onToggle: fn(),
  },
};

export const WithoutToggle: Story = {
  args: {
    count: 3,
  },
};

export const SingleCall: Story = {
  args: {
    count: 1,
  },
};
