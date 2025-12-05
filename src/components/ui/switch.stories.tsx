import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A switch component for binary on/off states. Built on Radix UI Switch primitive for accessibility.

\`\`\`bash
npx myoperator-ui add switch
\`\`\`

## Import

\`\`\`tsx
import { Switch } from "@/components/ui/switch"
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the switch',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    label: {
      control: 'text',
      description: 'Optional label text',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the label',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
}

export const LabelLeft: Story = {
  args: {
    label: 'Dark mode',
    labelPosition: 'left',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
}

const ControlledExample = () => {
  const [checked, setChecked] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        label="Controlled switch"
      />
      <p className="text-sm text-gray-600">
        Current state: {checked ? 'ON' : 'OFF'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch size="sm" label="Small" />
      </div>
      <div className="flex items-center gap-4">
        <Switch size="default" label="Default" />
      </div>
      <div className="flex items-center gap-4">
        <Switch size="lg" label="Large" />
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch label="Unchecked" />
      </div>
      <div className="flex items-center gap-4">
        <Switch checked label="Checked" />
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled label="Disabled unchecked" />
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled checked label="Disabled checked" />
      </div>
    </div>
  ),
}
