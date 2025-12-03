import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
} from './collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An expandable/collapsible section component with single or multiple mode support.

## Import

\`\`\`tsx
import {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@myoperator/ui"
\`\`\`

## Usage

\`\`\`tsx
<Collapsible type="multiple" defaultValue={['item-1']}>
  <CollapsibleItem value="item-1">
    <CollapsibleTrigger>Section Title</CollapsibleTrigger>
    <CollapsibleContent>Content here...</CollapsibleContent>
  </CollapsibleItem>
</Collapsible>
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Border Color | \`#E5E7EB\` |
| Hover Background | \`#F9FAFB\` |
| Icon Color | \`#6B7280\` |
| Focus Ring | \`#343E55\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether only one item can be open (single/accordion) or multiple items can be open at once',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered'],
      description: 'Visual style variant',
    },
    defaultValue: {
      control: 'object',
      description: 'Default open items (array of item values)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>What is myOperator UI?</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              myOperator UI is a collection of beautifully designed, accessible React
              components built with Tailwind CSS.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>How do I install it?</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              You can install components using the CLI: npx myoperator-ui add button
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Is it customizable?</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              Yes! All components are fully customizable using Tailwind CSS classes
              and CSS variables.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}

export const SingleMode: Story = {
  name: 'Single Mode (Accordion)',
  render: () => (
    <div className="w-[400px]">
      <Collapsible type="single" defaultValue={['item-1']}>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Section One</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section one. Only one section can be open at a time.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>Section Two</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section two. Opening this will close section one.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Section Three</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section three.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'In single mode (accordion), only one item can be open at a time. Opening a new item closes the previously open one.',
      },
    },
  },
}

export const MultipleMode: Story = {
  name: 'Multiple Mode',
  render: () => (
    <div className="w-[400px]">
      <Collapsible type="multiple" defaultValue={['item-1', 'item-2']}>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Section One</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section one. Multiple sections can be open.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>Section Two</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section two. This is also open by default.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Section Three</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section three.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'In multiple mode, any number of items can be open simultaneously.',
      },
    },
  },
}

export const Bordered: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible variant="bordered" defaultValue={['item-1']}>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Account Settings</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              Manage your account settings and preferences here.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>Notification Preferences</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              Configure how and when you receive notifications.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Privacy & Security</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              Review and update your privacy and security settings.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}

export const WithDisabledItem: Story = {
  name: 'With Disabled Item',
  render: () => (
    <div className="w-[400px]">
      <Collapsible variant="bordered">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Available Section</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This section is available and can be expanded.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2" disabled>
          <CollapsibleTrigger>Disabled Section</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This content won't be visible because the item is disabled.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Another Available Section</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This section is also available.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}

export const WithoutChevron: Story = {
  name: 'Without Chevron Icon',
  render: () => (
    <div className="w-[400px]">
      <Collapsible variant="bordered">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger showChevron={false}>
            <span className="font-medium">Click to expand</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              This trigger doesn't show a chevron icon.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}

const ControlledExample = () => {
  const [value, setValue] = useState<string[]>(['item-1'])

  return (
    <div className="w-[400px]">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setValue(['item-1'])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open First
        </button>
        <button
          onClick={() => setValue(['item-2'])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open Second
        </button>
        <button
          onClick={() => setValue([])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Close All
        </button>
        <button
          onClick={() => setValue(['item-1', 'item-2', 'item-3'])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open All
        </button>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Open items: {value.length > 0 ? value.join(', ') : 'none'}
      </p>
      <Collapsible value={value} onValueChange={setValue} variant="bordered">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Section One</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">Content for section one.</p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>Section Two</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">Content for section two.</p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-3">
          <CollapsibleTrigger>Section Three</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">Content for section three.</p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story: 'Use the `value` and `onValueChange` props for controlled state management.',
      },
    },
  },
}

export const CustomContent: Story = {
  name: 'Custom Content',
  render: () => (
    <div className="w-[400px]">
      <Collapsible variant="bordered">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Online Users</span>
              <span className="ml-2 text-xs text-[#6B7280]">(24)</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>Jane Smith</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>Bob Johnson</span>
              </div>
            </div>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2">
          <CollapsibleTrigger>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span>Offline Users</span>
              <span className="ml-2 text-xs text-[#6B7280]">(12)</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">12 users are currently offline.</p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}

export const FAQ: Story = {
  name: 'FAQ Example',
  render: () => (
    <div className="w-[500px]">
      <h2 className="mb-4 text-lg font-semibold text-[#333333]">Frequently Asked Questions</h2>
      <Collapsible type="single" variant="bordered">
        <CollapsibleItem value="q1">
          <CollapsibleTrigger>
            <span className="font-medium text-[#333333]">How do I reset my password?</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              To reset your password, click on the "Forgot Password" link on the login page.
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="q2">
          <CollapsibleTrigger>
            <span className="font-medium text-[#333333]">Can I change my subscription plan?</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              Yes, you can upgrade or downgrade your subscription plan at any time from
              your account settings. Changes will be reflected in your next billing cycle.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="q3">
          <CollapsibleTrigger>
            <span className="font-medium text-[#333333]">How do I contact support?</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-[#6B7280]">
              You can reach our support team via email at support@example.com or through
              the live chat feature available in the bottom right corner of the dashboard.
            </p>
          </CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    </div>
  ),
}
