import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Tag component for displaying event labels and categories. Supports optional bold label prefixes.

## Import

\`\`\`tsx
import { Tag } from "@/components/ui/tag"
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Background | \`#F3F4F6\` |
| Text Color | \`#333333\` |
| Border Radius | \`4px\` |
| Padding | \`4px 8px\` |
| Font Size | \`14px\` |
| Label Font Weight | \`600\` (semibold) |
| Content Font Weight | \`400\` (normal) |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'The visual style of the tag',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the tag',
    },
    label: {
      control: 'text',
      description: 'Bold label prefix displayed before the content',
    },
    children: {
      control: 'text',
      description: 'The content of the tag',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: 'After Call Event',
    variant: 'default',
    size: 'default',
  },
}

export const WithLabel: Story = {
  name: 'With Label',
  args: {
    label: 'In Call Event:',
    children: 'Start of call, Bridge, Call ended',
    variant: 'default',
  },
}

export const SimpleTag: Story = {
  name: 'Simple Tag',
  args: {
    children: 'After Call Event',
    variant: 'default',
  },
}

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="secondary">Secondary</Tag>
    </div>
  ),
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Tag size="sm">Small</Tag>
      <Tag size="default">Default</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
}

export const EventTags: Story = {
  name: 'Event Tags',
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
        <Tag>After Call Event</Tag>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
        <Tag>After Call Event</Tag>
      </div>
    </div>
  ),
}

export const WebhookEventsExample: Story = {
  name: 'Webhook Events Example',
  render: () => (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border">
      <div className="text-sm text-gray-500 font-medium">Events</div>
      <div className="flex flex-wrap gap-2">
        <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
        <Tag>After Call Event</Tag>
      </div>
    </div>
  ),
}
