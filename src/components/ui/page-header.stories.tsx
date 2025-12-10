import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './page-header'
import { Button } from './button'
import { Webhook, Settings, Users, FileText, Plus, Trash2, Info } from 'lucide-react'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Page header component for displaying titles with icons and actions.

\`\`\`bash
npx myoperator-ui add page-header
\`\`\`

## Import

\`\`\`tsx
import { PageHeader } from "@/components/ui/page-header"
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
      <td style="padding: 12px 16px;">Font Family</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--font-family</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">Source Sans Pro</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">76px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title Size</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px, semibold (600)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px, regular (400)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">FFFFFF</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title (required)',
    },
    description: {
      control: 'text',
      description: 'Optional description below title',
    },
    showBackButton: {
      control: 'boolean',
      description: 'Show back arrow instead of icon',
    },
    icon: {
      control: false,
      description: 'Icon displayed on the left side',
    },
    infoIcon: {
      control: false,
      description: 'Info icon displayed next to title',
    },
    actions: {
      control: false,
      description: 'Action buttons on the right side',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4 min-h-[200px]">
        <div className="bg-white rounded-lg shadow">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    icon: <Webhook />,
    title: 'Webhooks',
    description: 'Configure and manage your webhook integrations',
  },
}

// Header with Actions
export const HeaderWithActions: Story = {
  name: 'Header with Actions',
  args: {
    icon: <Webhook />,
    title: 'Webhooks',
    description: 'Configure and manage your webhook integrations',
    infoIcon: <Info className="cursor-pointer" />,
    actions: (
      <Button leftIcon={<Plus />}>Add Webhook</Button>
    ),
  },
}

// Header with Back Button
export const HeaderWithBackButton: Story = {
  name: 'Header with Back Button',
  args: {
    showBackButton: true,
    onBackClick: () => alert('Back clicked!'),
    title: 'Add New Webhook',
    description: 'Configure your webhook endpoint and authentication. All webhooks use POST method with HTTPS protocol only.',
    actions: (
      <>
        <Button variant="ghost">Cancel</Button>
        <Button>Save Webhook</Button>
      </>
    ),
  },
}

// Multiple Actions (4 buttons)
export const MultipleActions: Story = {
  name: 'Multiple Actions (4 buttons)',
  args: {
    icon: <Users />,
    title: 'Team Members',
    description: 'Manage team access and permissions',
    actions: (
      <>
        <Button variant="ghost" size="icon" aria-label="Delete">
          <Trash2 />
        </Button>
        <Button variant="outline">Export</Button>
        <Button variant="outline">Import</Button>
        <Button leftIcon={<Plus />}>Add Member</Button>
      </>
    ),
  },
}

// Long Title (truncation test)
export const LongTitle: Story = {
  name: 'Long Title (Truncation)',
  args: {
    icon: <FileText />,
    title: 'This is a very long page title that should be truncated when it exceeds the available space',
    description: 'This description is also quite long and should truncate properly when the container width is limited',
    actions: <Button>Action</Button>,
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow max-w-[600px]">
          <Story />
        </div>
      </div>
    ),
  ],
}

// All Variations Showcase - hidden from sidebar, shown in docs
export const AllVariations: Story = {
  name: 'All Variations',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col divide-y">
      <div className="bg-white">
        <PageHeader
          icon={<Webhook />}
          title="Simple Header"
          description="Icon + Title + Description"
        />
      </div>
      <div className="bg-white">
        <PageHeader
          icon={<Settings />}
          title="Header with Actions"
          description="Icon + Title + Description + Actions"
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </>
          }
        />
      </div>
      <div className="bg-white">
        <PageHeader
          showBackButton
          onBackClick={() => {}}
          title="Header with Back Button"
          description="Back Button + Title + Description + Actions"
          actions={
            <>
              <Button variant="ghost">Discard</Button>
              <Button>Save Changes</Button>
            </>
          }
        />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Story />
        </div>
      </div>
    ),
  ],
}

// Usage guide - hidden from sidebar, shown in docs
export const Usage: Story = {
  name: 'Usage',
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Guidelines for when to use each PageHeader variation.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-3xl p-4">
      <div className="flex items-start gap-4">
        <div className="w-96">
          <PageHeader
            icon={<Webhook />}
            title="Section Header"
            description="Use for sections"
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Simple Header</p>
          <p className="text-sm text-gray-600">For section headers or read-only views without actions</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-96">
          <PageHeader
            icon={<Settings />}
            title="List Page"
            description="With primary action"
            actions={<Button leftIcon={<Plus />}>Add New</Button>}
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Header with Actions</p>
          <p className="text-sm text-gray-600">For list pages with create/add actions</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-96">
          <PageHeader
            showBackButton
            title="Edit Item"
            description="Form page"
            actions={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </>
            }
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Header with Back Button</p>
          <p className="text-sm text-gray-600">For detail/edit pages with navigation and form actions</p>
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4">
        <Story />
      </div>
    ),
  ],
}

// Do's and Don'ts - hidden from sidebar, shown in docs
export const DosAndDonts: Story = {
  name: "Do's and Don'ts",
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Best practices for using the PageHeader component.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      {/* Button pairing example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <PageHeader
              title="Edit Webhook"
              showBackButton
              actions={
                <>
                  <Button variant="ghost">Cancel</Button>
                  <Button>Save</Button>
                </>
              }
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Use ghost/outline for secondary actions, primary for main action on the right.</p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <PageHeader
              title="Edit Webhook"
              showBackButton
              actions={
                <>
                  <Button>Save</Button>
                  <Button>Cancel</Button>
                </>
              }
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't use multiple primary buttons or put secondary action after primary.</p>
        </div>
      </div>

      {/* Title length example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <PageHeader
              icon={<Webhook />}
              title="Webhooks"
              description="Configure your integrations"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Keep titles short (2-4 words) and descriptions concise.</p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <PageHeader
              icon={<Webhook />}
              title="All Your Webhook Integrations and Settings"
              description="This is where you can configure all of your webhook integrations, manage endpoints, and view detailed logs"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't use long titles or descriptions that may truncate or wrap.</p>
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4">
        <Story />
      </div>
    ),
  ],
}

// Accessibility - hidden from sidebar, shown in docs
export const Accessibility: Story = {
  name: 'Accessibility',
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'PageHeader uses semantic HTML with h1 for the title and proper ARIA labels for buttons.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h4 className="font-medium text-sm mb-3">Keyboard navigation</h4>
        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
          <p><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Tab</code> to move focus between back button and actions</p>
          <p><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Enter</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Space</code> to activate buttons</p>
        </div>
        <div className="bg-white rounded-lg shadow">
          <PageHeader
            showBackButton
            onBackClick={() => alert('Back')}
            title="Accessible Header"
            description="Try tabbing through this header"
            actions={
              <>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </>
            }
          />
        </div>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">Semantic structure</h4>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Title uses <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;h1&gt;</code> for proper document outline</li>
          <li>Back button has <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label="Go back"</code></li>
          <li>Icon-only action buttons should include <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label</code></li>
        </ul>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-4">
        <Story />
      </div>
    ),
  ],
}
