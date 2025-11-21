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
