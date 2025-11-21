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
Tag component for displaying event labels and categories. Supports optional bold label prefixes and interactive states.

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
    interactive: {
      control: 'boolean',
      description: 'Make the tag clickable with hover/active states',
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
    interactive: false,
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

export const Interactive: Story = {
  name: 'Interactive',
  args: {
    children: 'Click me',
    variant: 'default',
    interactive: true,
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

export const InteractiveExamples: Story = {
  name: 'Interactive Examples',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Tag interactive onClick={() => alert('Tag 1 clicked')}>
          Click me
        </Tag>
        <Tag interactive variant="primary" onClick={() => alert('Tag 2 clicked')}>
          Primary Interactive
        </Tag>
        <Tag interactive variant="secondary" onClick={() => alert('Tag 3 clicked')}>
          Secondary Interactive
        </Tag>
      </div>
      <p className="text-xs text-gray-500">Click on the tags above to see the interaction</p>
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

export const WithLabelAndInteractive: Story = {
  name: 'With Label & Interactive',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag
        label="Event:"
        interactive
        onClick={() => alert('Event tag clicked')}
      >
        Start of call
      </Tag>
      <Tag
        interactive
        onClick={() => alert('After call clicked')}
      >
        After Call Event
      </Tag>
    </div>
  ),
}
