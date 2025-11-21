import type { Meta, StoryObj } from '@storybook/react'
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

## Import

\`\`\`tsx
import { Badge } from "@/components/ui/badge"
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Active Background | \`#E5FFF5\` |
| Active Text | \`#00A651\` |
| Failed Background | \`#FFECEC\` |
| Failed Text | \`#FF3B3B\` |
| Disabled Background | \`#F3F5F6\` |
| Disabled Text | \`#6B7280\` |
| Border Radius | \`25px\` (full) |
| Padding | \`4px 12px\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['active', 'failed', 'disabled', 'default'],
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

export const StatusExamples: Story = {
  name: 'Status Examples',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 1:</span>
        <Badge variant="active">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 2:</span>
        <Badge variant="failed">Failed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 w-24">Webhook 3:</span>
        <Badge variant="disabled">Disabled</Badge>
      </div>
    </div>
  ),
}
