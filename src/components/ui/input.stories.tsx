import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible input component for text entry with state variants.

## Import

\`\`\`tsx
import { Input } from "@/components/ui/input"
\`\`\`

## Usage

\`\`\`tsx
<Input placeholder="Enter your email" />
<Input state="error" placeholder="Invalid input" />
<Input state="success" placeholder="Valid input" />
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Border Color | \`#E9E9E9\` |
| Border Radius | \`4px\` |
| Height | \`40px\` |
| Padding | \`10px 16px\` |
| Focus Ring | \`#343E55\` |
| Error Color | \`#FF3B3B\` |
| Success Color | \`#00A651\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'error'],
      description: 'Visual state of the input',
      table: {
        type: { summary: '"default" | "error"' },
        defaultValue: { summary: 'default' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only state',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    placeholder: 'Enter your email',
    state: 'default',
    type: 'text',
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
}

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Default</p>
        <Input placeholder="Default state" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Error</p>
        <Input state="error" placeholder="Error state" />
      </div>
    </div>
  ),
}

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="With value" defaultValue="Disabled with value" disabled />
    </div>
  ),
}

// Input Types
export const InputTypes: Story = {
  name: 'Input types',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Text</p>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Email</p>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Password</p>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Number</p>
        <Input type="number" placeholder="0" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Search</p>
        <Input type="search" placeholder="Search..." />
      </div>
    </div>
  ),
}

// File Input
export const FileInput: Story = {
  name: 'File input',
  render: () => (
    <div className="w-80">
      <Input type="file" />
    </div>
  ),
}

// With Value
export const WithValue: Story = {
  name: 'With value',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input defaultValue="Default value" />
      <Input defaultValue="Error value" state="error" />
    </div>
  ),
}
