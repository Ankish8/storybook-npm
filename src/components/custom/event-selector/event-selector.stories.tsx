import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { EventSelector } from './event-selector'
import type { EventItem, EventGroup, EventCategory } from './types'

// Sample data matching the screenshots
const sampleEvents: EventItem[] = [
  // In-Call Events
  {
    id: 'call-initiated',
    name: 'Call.Initiated',
    description: 'Triggered when the call reaches MyOperator and a new channel is created.',
    group: 'in-call-events',
  },
  {
    id: 'call-agent-ringing',
    name: 'Call.AgentRinging',
    description: 'Triggered when the system starts dialing the assigned agent(s).',
    group: 'in-call-events',
  },
  {
    id: 'call-agent-responded',
    name: 'Call.AgentResponded',
    description: 'Triggered when the call reaches MyOperator and a new channel is created.',
    group: 'in-call-events',
  },
  {
    id: 'call-ended',
    name: 'Call.Ended',
    description: 'Triggered when the call is terminated by either party.',
    group: 'in-call-events',
  },
  // After Call Events
  {
    id: 'call-summary',
    name: 'Call.Summary',
    description: 'Triggered after call has ended. Provides: call duration, recordings, timestamps, agent, caller, queue logic, call outcome.',
    group: 'after-call-event',
  },
  // Call Disposition Events
  {
    id: 'disposition-submitted',
    name: 'Disposition.Submitted',
    description: 'Triggered when an agent submits a disposition form after a call.',
    group: 'call-disposition-event',
  },
  // WhatsApp Events
  {
    id: 'whatsapp-message-received',
    name: 'WhatsApp.MessageReceived',
    description: 'Triggered when a new message is received on WhatsApp.',
    group: 'whatsapp-events',
  },
  {
    id: 'whatsapp-message-sent',
    name: 'WhatsApp.MessageSent',
    description: 'Triggered when a message is successfully sent via WhatsApp.',
    group: 'whatsapp-events',
  },
]

const sampleGroups: EventGroup[] = [
  {
    id: 'in-call-events',
    name: 'In-Call Events',
    description: 'Triggered during active calls',
  },
  {
    id: 'after-call-event',
    name: 'After Call Event',
    description: 'Triggered once per call after hangup.',
  },
  {
    id: 'call-disposition-event',
    name: 'Call Disposition Event',
    description: 'Triggered after agent submits disposition.',
  },
  {
    id: 'whatsapp-events',
    name: 'WhatsApp Events',
    description: 'Triggered in WhatsApp communication flow',
  },
]

// Categories without icons (default)
const sampleCategories: EventCategory[] = [
  {
    id: 'call-events',
    name: 'Call Events (Voice)',
    groups: ['in-call-events', 'after-call-event', 'call-disposition-event'],
  },
  {
    id: 'whatsapp-category',
    name: 'WhatsApp Events',
    groups: ['whatsapp-events'],
  },
]

// Categories with icons (optional)
const sampleCategoriesWithIcons: EventCategory[] = [
  {
    id: 'call-events',
    name: 'Call Events (Voice)',
    icon: <Phone className="h-5 w-5 text-[#343E55]" />,
    groups: ['in-call-events', 'after-call-event', 'call-disposition-event'],
  },
  {
    id: 'whatsapp-category',
    name: 'WhatsApp Events',
    icon: <MessageCircle className="h-5 w-5 text-[#25D366]" />,
    groups: ['whatsapp-events'],
  },
]

const meta: Meta<typeof EventSelector> = {
  title: 'Custom/Event Selector',
  component: EventSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Important Notice

> **This component is NOT available via CLI.**
>
> The EventSelector is a custom/domain-specific component and cannot be installed using \`npx myoperator-ui add\`. Import it directly from the npm package.

## Import

\`\`\`tsx
import { EventSelector } from "@myoperator/ui"
import type { EventItem, EventGroup, EventCategory } from "@myoperator/ui"
\`\`\`

## Overview

EventSelector is a specialized component for selecting webhook events. It features:
- Collapsible event groups with tri-state checkboxes
- Support for nested categories
- Selection count display at group and total level
- Controlled and uncontrolled modes

## Data Structures

### EventItem
\`\`\`typescript
interface EventItem {
  id: string           // Unique identifier
  name: string         // Display name (e.g., "Call.Initiated")
  description: string  // Description of the event
  group: string        // Group ID this event belongs to
}
\`\`\`

### EventGroup
\`\`\`typescript
interface EventGroup {
  id: string           // Unique identifier
  name: string         // Display name (e.g., "In-Call Events")
  description: string  // Description of the group
  icon?: ReactNode     // Optional icon
}
\`\`\`

### EventCategory (Optional)
\`\`\`typescript
interface EventCategory {
  id: string           // Unique identifier
  name: string         // Display name (e.g., "Call Events (Voice)")
  icon?: ReactNode     // Optional icon
  groups: string[]     // Array of group IDs
}
\`\`\`

## Usage Example

\`\`\`tsx
const [selected, setSelected] = useState<string[]>([])

<EventSelector
  events={events}
  groups={groups}
  categories={categories} // optional
  selectedEvents={selected}
  onSelectionChange={setSelected}
  title="Events"
  description="Select which events should trigger this webhook"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed at the top',
    },
    description: {
      control: 'text',
      description: 'Description displayed below the title',
    },
    emptyGroupMessage: {
      control: 'text',
      description: 'Message shown when a group has no events',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic uncontrolled example
export const Default: Story = {
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategories,
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
}

// With pre-selected events
export const WithDefaultSelection: Story = {
  name: 'With Default Selection',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategories,
    defaultSelectedEvents: ['call-initiated', 'call-ended', 'call-summary'],
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
}

// Controlled example
const ControlledExample = () => {
  const [selected, setSelected] = useState<string[]>(['call-initiated', 'call-ended'])

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          Selected Events: {selected.length > 0 ? selected.join(', ') : 'none'}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelected([])}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={() => setSelected(sampleEvents.map(e => e.id))}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Select All
          </button>
        </div>
      </div>
      <EventSelector
        events={sampleEvents}
        groups={sampleGroups}
        categories={sampleCategories}
        selectedEvents={selected}
        onSelectionChange={setSelected}
      />
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story: 'Use `selectedEvents` and `onSelectionChange` props for controlled state management.',
      },
    },
  },
}

// With categories
// Without categories - simpler flat structure
export const WithoutCategories: Story = {
  name: 'Without Categories (Flat)',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    // No categories prop - groups shown directly
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
  parameters: {
    docs: {
      description: {
        story: 'When categories are not provided, groups are displayed directly without the extra nesting level. Use this for simpler implementations.',
      },
    },
  },
}

// Empty state
export const EmptyGroup: Story = {
  name: 'With Empty Group',
  args: {
    events: sampleEvents.filter(e => e.group !== 'call-disposition-event'),
    groups: sampleGroups,
    categories: sampleCategories,
    emptyGroupMessage: 'No events configured for this category',
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
  parameters: {
    docs: {
      description: {
        story: 'When a group has no events, the `emptyGroupMessage` is displayed.',
      },
    },
  },
}

// Custom empty state with action button
const CustomEmptyStateExample = () => {
  const handleAddEvent = (groupId: string) => {
    alert(`Add event to group: ${groupId}`)
  }

  return (
    <EventSelector
      events={sampleEvents.filter(e => e.group !== 'call-disposition-event')}
      groups={sampleGroups}
      categories={sampleCategories}
      renderEmptyGroup={(group) => (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">No events in this group</span>
          <button
            onClick={() => handleAddEvent(group.id)}
            className="px-3 py-1 text-sm bg-[#343E55] text-white rounded hover:bg-[#343E55]/90"
          >
            + Add Event
          </button>
        </div>
      )}
    />
  )
}

export const CustomEmptyState: Story = {
  name: 'Custom Empty State',
  render: () => <CustomEmptyStateExample />,
  parameters: {
    docs: {
      description: {
        story: 'Use `renderEmptyGroup` to customize the empty state with actions like "Add Event" button.',
      },
    },
  },
}

// Partial selection (indeterminate state)
export const PartialSelection: Story = {
  name: 'Partial Selection (Indeterminate)',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategories,
    defaultSelectedEvents: ['call-initiated', 'call-ended'],
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
  parameters: {
    docs: {
      description: {
        story: 'When some (but not all) events in a group are selected, the group checkbox shows an indeterminate state.',
      },
    },
  },
}

// Full selection
export const FullSelection: Story = {
  name: 'Full Selection',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategories,
    defaultSelectedEvents: sampleEvents.map(e => e.id),
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
}

// Custom title and description
export const CustomLabels: Story = {
  name: 'Custom Labels',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategories,
    title: 'Webhook Events',
    description: 'Choose the events that will trigger notifications to your endpoint',
  },
}

// With category icons
export const WithIcons: Story = {
  name: 'With Category Icons',
  args: {
    events: sampleEvents,
    groups: sampleGroups,
    categories: sampleCategoriesWithIcons,
    title: 'Events',
    description: 'Select which events should trigger this webhook',
  },
  parameters: {
    docs: {
      description: {
        story: 'Categories can optionally have icons. Pass any React node as the `icon` property.',
      },
    },
  },
}

// Real-world usage example
const RealWorldExample = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [webhookUrl, setWebhookUrl] = useState('')

  const handleSave = () => {
    alert(`Webhook URL: ${webhookUrl}\nSelected Events: ${selected.join(', ')}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Webhook URL
        </label>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://your-server.com/webhook"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#343E55]"
        />
      </div>

      <EventSelector
        events={sampleEvents}
        groups={sampleGroups}
        categories={sampleCategories}
        selectedEvents={selected}
        onSelectionChange={setSelected}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => { setSelected([]); setWebhookUrl('') }}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={selected.length === 0 || !webhookUrl}
          className="px-4 py-2 text-sm bg-[#343E55] text-white rounded-md hover:bg-[#343E55]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Webhook
        </button>
      </div>
    </div>
  )
}

export const RealWorldUsage: Story = {
  name: 'Real World Usage',
  render: () => <RealWorldExample />,
  parameters: {
    docs: {
      description: {
        story: 'A complete example showing how EventSelector might be used in a webhook configuration form.',
      },
    },
  },
}
