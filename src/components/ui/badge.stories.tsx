import type { Meta, StoryObj } from '@storybook/react'
import { Check, X, AlertCircle, Clock } from 'lucide-react'
import { Badge } from './badge'

// Map variant to appropriate icon
const variantIcons = {
  active: <Check />,
  failed: <X />,
  disabled: <Clock />,
  default: <AlertCircle />,
}

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

// Custom args type with showIcon booleans
type BadgeStoryArgs = {
  children: string
  variant: 'active' | 'failed' | 'disabled' | 'default'
  size: 'sm' | 'default' | 'lg'
  showLeftIcon: boolean
  showRightIcon: boolean
}

export const Overview: Story = {
  argTypes: {
    showLeftIcon: {
      control: 'boolean',
      description: 'Show icon on the left side',
    },
    showRightIcon: {
      control: 'boolean',
      description: 'Show icon on the right side',
    },
  },
  args: {
    children: 'Active',
    variant: 'active',
    size: 'default',
    showLeftIcon: false,
    showRightIcon: false,
  } as BadgeStoryArgs,
  render: ({ showLeftIcon, showRightIcon, variant, ...args }: BadgeStoryArgs) => (
    <Badge
      {...args}
      variant={variant}
      leftIcon={showLeftIcon ? variantIcons[variant || 'default'] : undefined}
      rightIcon={showRightIcon ? variantIcons[variant || 'default'] : undefined}
    />
  ),
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
