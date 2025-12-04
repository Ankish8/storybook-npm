import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Mail, ArrowRight, Plus, Search, Download, Trash2, Save, Check } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Buttons trigger actions or events. Use them for form submissions, dialogs, or operations.

## Import

\`\`\`tsx
import { Button } from "@/components/ui/button"
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Primary Color | \`#343E55\` |
| Border Radius | \`4px\` |
| Padding | \`10px 16px\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner',
    },
    loadingText: {
      control: 'text',
      description: 'Text shown during loading',
    },
    leftIcon: {
      control: 'boolean',
      description: 'Icon on the left side',
      mapping: {
        true: <Mail />,
        false: undefined,
      },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Icon on the right side',
      mapping: {
        true: <ArrowRight />,
        false: undefined,
      },
    },
    asChild: {
      control: false,
      description: 'Render as child element',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}

// Button kinds - all variants
export const ButtonKinds: Story = {
  name: 'Button kinds',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
}

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
    </div>
  ),
}

// States (loading)
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Loading</Button>
      <Button loading loadingText="Saving...">Save</Button>
      <Button loading variant="secondary">Secondary</Button>
      <Button loading variant="outline">Outline</Button>
    </div>
  ),
}

// Icons
export const Icons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={<Mail />}>Left icon</Button>
      <Button rightIcon={<ArrowRight />}>Right icon</Button>
      <Button leftIcon={<Download />} rightIcon={<ArrowRight />}>Both icons</Button>
      <Button size="icon" aria-label="Search">
        <Search />
      </Button>
    </div>
  ),
}

// Loading state
export const LoadingState: Story = {
  name: 'Loading state',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Default</Button>
      <Button loading loadingText="Please wait...">With text</Button>
      <Button loading variant="outline">Outline</Button>
    </div>
  ),
}

// Success state (positive)
export const SuccessState: Story = {
  name: 'Success state',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={<Check />} className="bg-green-600 hover:bg-green-700">
        Success
      </Button>
      <Button leftIcon={<Save />}>Save Changes</Button>
    </div>
  ),
}

// Destructive actions
export const DestructiveActions: Story = {
  name: 'Destructive actions',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="destructive">Delete</Button>
      <Button variant="destructive" leftIcon={<Trash2 />}>
        Delete Account
      </Button>
    </div>
  ),
}

// Adjacent buttons
export const AdjacentButtons: Story = {
  name: 'Adjacent buttons',
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  ),
}

// Usage
export const Usage: Story = {
  name: 'Usage',
  parameters: {
    docs: {
      description: {
        story: 'Guidelines for when to use each button variant.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="default">Save</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Default (Primary)</p>
          <p className="text-sm text-gray-600">Main actions like "Save", "Submit", "Create"</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="secondary">Filter</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Secondary</p>
          <p className="text-sm text-gray-600">Less prominent actions that complement the primary</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="outline">Edit</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Outline</p>
          <p className="text-sm text-gray-600">Alternative to secondary, works well on colored backgrounds</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="ghost">More</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Ghost</p>
          <p className="text-sm text-gray-600">Toolbar actions, icon buttons, less prominent actions</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="link">Learn more</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Link</p>
          <p className="text-sm text-gray-600">Navigation-like actions within content</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="destructive">Delete</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Destructive</p>
          <p className="text-sm text-gray-600">Dangerous or irreversible actions</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Button variant="dashed" leftIcon={<Plus />}>Add</Button>
        </div>
        <div>
          <p className="font-medium text-sm">Dashed</p>
          <p className="text-sm text-gray-600">Add/create actions, placeholder-style buttons</p>
        </div>
      </div>
    </div>
  ),
}

// Accessibility
export const Accessibility: Story = {
  name: 'Accessibility',
  parameters: {
    docs: {
      description: {
        story: 'Buttons are accessible by default. Follow these guidelines for best practices.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h4 className="font-medium text-sm mb-3">Keyboard navigation</h4>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <p><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Tab</code> to move focus to the button</p>
          <p><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Enter</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Space</code> to activate the button</p>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">Icon-only buttons</h4>
        <p className="text-sm text-gray-600 mb-3">Always provide an <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label</code> for icon-only buttons.</p>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="Search">
              <Search />
            </Button>
            <span className="text-xs text-green-600">aria-label="Search"</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Download">
              <Download />
            </Button>
            <span className="text-xs text-green-600">aria-label="Download"</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">Focus indicators</h4>
        <p className="text-sm text-gray-600 mb-3">Buttons have built-in focus rings. Tab to see the focus state:</p>
        <div className="flex gap-4">
          <Button>Focus me</Button>
          <Button variant="outline">Focus me</Button>
          <Button variant="ghost">Focus me</Button>
        </div>
      </div>
    </div>
  ),
}

// Do's and Don'ts
export const DosAndDonts: Story = {
  name: "Do's and Don'ts",
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Best practices for using the Button component.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {/* Text length example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-12 flex items-center justify-center min-h-[120px]">
            <Button>Get started</Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Use 1 or 2 words, no longer than 4 words, with fewer than 20 characters including spaces.</p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-12 flex items-center justify-center min-h-[120px]">
            <Button>Get started and enjoy discount!</Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't use long text or punctuation marks such as periods or exclamation points.</p>
        </div>
      </div>

      {/* Button pairing example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-12 flex items-center justify-center gap-3 min-h-[120px]">
            <Button variant="ghost">Cancel</Button>
            <Button>Get started</Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Use primary button as the main action, put the ghost or link variant as the secondary option.</p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-12 flex items-center justify-center gap-3 min-h-[120px]">
            <Button>Get started</Button>
            <Button variant="outline">Cancel</Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't use primary button next to outline or secondary buttons with similar visual weight.</p>
        </div>
      </div>
    </div>
  ),
}
