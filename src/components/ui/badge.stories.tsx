import type { Meta, StoryObj } from '@storybook/react'
import { Check, X, AlertCircle, Clock } from 'lucide-react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Badge component for displaying status indicators. Pill-shaped badges with different colors for different states.

\`\`\`bash
npx myoperator-ui add badge
\`\`\`

## Import

\`\`\`tsx
import { Badge } from "@/components/ui/badge"
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
      <td style="padding: 12px 16px;">Active Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-surface</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">ECFDF3</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECFDF3; border-radius: 6px; border: 1px solid #75E0A7;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Active Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">17B26A</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #17B26A; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Failed Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-surface</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">FEF3F2</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FEF3F2; border-radius: 6px; border: 1px solid #FDA29B;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Failed Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Disabled Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F5F5F5</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Disabled Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Radius</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--radius-full</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">25px (full)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">4px 12px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Badge Text (default)</td>
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Badge Text (sm)</td>
      <td style="padding: 12px 16px;">Label/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['active', 'failed', 'disabled', 'default', 'primary', 'secondary', 'outline', 'destructive'],
      description: 'The visual style of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the badge',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
    },
    leftIcon: {
      control: false,
      description: 'Icon displayed on the left side',
    },
    rightIcon: {
      control: false,
      description: 'Icon displayed on the right side',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: 'Active',
    variant: 'active',
    size: 'default',
  },
}

export const Active: Story = {
  args: {
    children: 'Active',
    variant: 'active',
  },
}

export const Failed: Story = {
  args: {
    children: 'Failed',
    variant: 'failed',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'disabled',
  },
}

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
}

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="active">Active</Badge>
      <Badge variant="failed">Failed</Badge>
      <Badge variant="disabled">Disabled</Badge>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="active" size="sm">Small</Badge>
      <Badge variant="active" size="default">Default</Badge>
      <Badge variant="active" size="lg">Large</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="active" leftIcon={<Check />}>Active</Badge>
      <Badge variant="failed" leftIcon={<X />}>Failed</Badge>
      <Badge variant="disabled" leftIcon={<Clock />}>Pending</Badge>
      <Badge variant="default" leftIcon={<AlertCircle />}>Info</Badge>
    </div>
  ),
}

export const WithRightIcon: Story = {
  name: 'With Right Icon',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="active" rightIcon={<Check />}>Verified</Badge>
      <Badge variant="failed" rightIcon={<X />}>Rejected</Badge>
    </div>
  ),
}

export const StatusExamples: Story = {
  name: 'Status Examples',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 1:</span>
        <Badge variant="active" leftIcon={<Check />}>Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 2:</span>
        <Badge variant="failed" leftIcon={<X />}>Failed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 3:</span>
        <Badge variant="disabled" leftIcon={<Clock />}>Disabled</Badge>
      </div>
    </div>
  ),
}
