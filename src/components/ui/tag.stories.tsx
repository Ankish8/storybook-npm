import type { Meta, StoryObj } from '@storybook/react'
import { Tag, TagGroup } from './tag'

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
import { Tag, TagGroup } from "@/components/ui/tag"
\`\`\`

## Usage

\`\`\`tsx
// Simple tag
<Tag>After Call Event</Tag>

// Tag with label
<Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>

// TagGroup with overflow
<TagGroup
  tags={[
    { label: "In Call Event:", value: "Call Begin, Start Dialing" },
    { label: "Whatsapp Event:", value: "message.Delivered" },
    { value: "After Call Event" },
  ]}
  maxVisible={2}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
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
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="error">Error</Tag>
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
  parameters: {
    docs: {
      description: {
        story: 'Common usage pattern for displaying event labels with optional prefixes.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
        <Tag>After Call Event</Tag>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag label="Whatsapp Event:">message.Delivered</Tag>
        <Tag label="SMS Event:">message.Received</Tag>
      </div>
    </div>
  ),
}

export const TagGroupExample: Story = {
  name: 'TagGroup',
  parameters: {
    docs: {
      description: {
        story: 'Use TagGroup to display multiple tags with automatic overflow handling. Tags beyond `maxVisible` are hidden with a "+N more" indicator.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="text-sm font-medium mb-2">With overflow (8 tags, max 2 visible)</h4>
        <TagGroup
          tags={[
            { label: "In Call Event:", value: "Call Begin, Start Dialing Agent" },
            { label: "Whatsapp Event:", value: "message.Delivered" },
            { label: "Call Disposition:", value: "Answered, Voicemail" },
            { label: "After Call Event:", value: "Call ended" },
            { label: "SMS Event:", value: "message.Sent" },
            { label: "IVR Event:", value: "Menu selection" },
            { label: "Queue Event:", value: "Agent assigned" },
            { label: "Recording:", value: "Started, Stopped" },
          ]}
          maxVisible={2}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Without overflow (2 tags, max 2 visible)</h4>
        <TagGroup
          tags={[
            { label: "After Call Event:", value: "Call ended, Voicemail" },
            { label: "SMS Event:", value: "message.Received" },
          ]}
          maxVisible={2}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Single tag</h4>
        <TagGroup
          tags={[
            { label: "IVR Event:", value: "Menu selection, Input received" },
          ]}
          maxVisible={2}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Tags without labels</h4>
        <TagGroup
          tags={[
            { value: "After Call Event" },
            { value: "Voicemail" },
            { value: "Call Ended" },
            { value: "Recording" },
          ]}
          maxVisible={3}
        />
      </div>
    </div>
  ),
}

export const TagGroupMaxVisible: Story = {
  name: 'TagGroup Max Visible Options',
  parameters: {
    docs: {
      description: {
        story: 'Customize the number of visible tags using the `maxVisible` prop.',
      },
    },
  },
  render: () => {
    const tags = [
      { label: "Event 1:", value: "Value 1" },
      { label: "Event 2:", value: "Value 2" },
      { label: "Event 3:", value: "Value 3" },
      { label: "Event 4:", value: "Value 4" },
      { label: "Event 5:", value: "Value 5" },
    ]

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="text-sm font-medium mb-2">maxVisible=1</h4>
          <TagGroup tags={tags} maxVisible={1} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">maxVisible=2 (default)</h4>
          <TagGroup tags={tags} maxVisible={2} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">maxVisible=3</h4>
          <TagGroup tags={tags} maxVisible={3} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">maxVisible=5 (all visible)</h4>
          <TagGroup tags={tags} maxVisible={5} />
        </div>
      </div>
    )
  },
}
