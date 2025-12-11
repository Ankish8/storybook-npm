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

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label (default)</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label (sm)</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label (lg)</td>
      <td style="padding: 12px 16px;">Body/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base</code></td>
    </tr>
  </tbody>
</table>
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
