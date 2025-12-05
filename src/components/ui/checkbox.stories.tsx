import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox, type CheckedState } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Checkboxes allow users to select one or more items from a set of options.

## Installation

\`\`\`bash
npx myoperator-ui add checkbox
\`\`\`

## Import

\`\`\`tsx
import { Checkbox } from "@myoperator/ui"
\`\`\`

---

## Usage

- Use checkboxes to:
  1. Select one or more options from a list
  2. Turn an item on or off in a desktop environment
- Use checkboxes independently from each other: selecting one checkbox shouldn't change the selection status of another checkbox in the list. The exception is when a checkbox is used to make a bulk selection.
- Ensure both label and input are clickable to select the checkbox field.
- Keep a positive tone of voice. For example: "Turn on notifications" instead of "Turn off notifications".
- Checkboxes should be listed according to a logical order.
- Place checkboxes vertically, using 16px spacing.
- Checkbox will always appear with a label.

---

## Accessibility

- Using an \`id\` is highly recommended for all instances to ensure proper label association.
- Always provide a visible \`label\` prop to ensure the checkbox's purpose is clear to all users.
- It is recommended to use \`separateLabel\` mode for better screen reader support as it provides clearer, more explicit label-input associations. When using this mode, the \`id\` prop is required for proper label association.
- Use \`ariaLabel\` prop when you need to provide a custom accessible name.
- Use \`ariaLabelledBy\` prop when the checkbox is described by external elements.
- Use \`indeterminate\` state for mixed selection states (e.g., when some but not all sub-items are selected).
- Use \`tabIndex\` prop for custom keyboard navigation order.
- Use \`autoFocus\` prop when the checkbox should receive initial focus for keyboard navigation.

---

## Design Tokens

| Token | Value |
|-------|-------|
| Primary Color | \`#343E55\` |
| Border Color | \`#E5E7EB\` |
| Hover Border | \`#9CA3AF\` |
| Text Color | \`#333333\` |
| Border Radius | \`4px\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the checkbox',
      table: {
        type: { summary: '"default" | "sm" | "lg"' },
        defaultValue: { summary: 'default' },
      },
    },
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'If true, controls the checked state of the checkbox',
      table: {
        type: { summary: 'boolean | "indeterminate"' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The initial checked state of the checkbox',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'The content displayed next to the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the label relative to the checkbox',
      table: {
        type: { summary: '"left" | "right"' },
        defaultValue: { summary: 'right' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'The label of the checkbox for accessibility',
      table: {
        type: { summary: 'string' },
      },
    },
    'aria-labelledby': {
      control: 'text',
      description: 'The ID of an element describing the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    autoFocus: {
      control: 'boolean',
      description: 'If true, the checkbox automatically receives focus',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    checkboxClassName: {
      control: 'text',
      description: 'Class name applied to the checkbox element',
      table: {
        type: { summary: 'string' },
      },
    },
    labelClassName: {
      control: 'text',
      description: 'Class name applied to the label element',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: 'text',
      description: 'The name of the checkbox, used for form submission',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    value: {
      control: 'text',
      description: 'The value submitted with the form when checked',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    id: {
      control: 'text',
      description: 'An HTML id attribute for the component',
      table: {
        type: { summary: 'string' },
      },
    },
    separateLabel: {
      control: 'boolean',
      description: 'If true, uses separate labels with htmlFor/id association instead of wrapping the input. If using this, the id prop is required for it to function correctly.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: 'Callback fired when the checkbox value changes',
      table: {
        type: { summary: '(checked: CheckedState) => void' },
      },
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

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

export const LabelLeft: Story = {
  args: {
    label: 'Remember me',
    labelPosition: 'left',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small checkbox',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large checkbox',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled checkbox',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Disabled checked',
  },
}

export const DisabledIndeterminate: Story = {
  args: {
    disabled: true,
    checked: 'indeterminate',
    label: 'Disabled indeterminate',
  },
}

const ControlledExample = () => {
  const [checked, setChecked] = useState<CheckedState>(false)
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        label="Controlled checkbox"
      />
      <p className="text-sm text-gray-600">
        Current state: {checked === 'indeterminate' ? 'INDETERMINATE' : checked ? 'CHECKED' : 'UNCHECKED'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setChecked(false)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Uncheck
        </button>
        <button
          onClick={() => setChecked(true)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Check
        </button>
        <button
          onClick={() => setChecked('indeterminate')}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Indeterminate
        </button>
      </div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

const SelectAllExample = () => {
  const [items, setItems] = useState([
    { id: 1, label: 'Item 1', checked: false },
    { id: 2, label: 'Item 2', checked: false },
    { id: 3, label: 'Item 3', checked: false },
  ])

  const allChecked = items.every(item => item.checked)
  const someChecked = items.some(item => item.checked)
  const selectAllState: CheckedState = allChecked ? true : someChecked ? 'indeterminate' : false

  const handleSelectAll = () => {
    const newChecked = !allChecked
    setItems(items.map(item => ({ ...item, checked: newChecked })))
  }

  const handleItemChange = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={selectAllState}
        onCheckedChange={handleSelectAll}
        label="Select all"
      />
      <div className="ml-6 flex flex-col gap-2">
        {items.map(item => (
          <Checkbox
            key={item.id}
            checked={item.checked}
            onCheckedChange={() => handleItemChange(item.id)}
            label={item.label}
          />
        ))}
      </div>
    </div>
  )
}

export const SelectAllPattern: Story = {
  name: 'Select All Pattern',
  render: () => <SelectAllExample />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the indeterminate state for "select all" functionality. The parent checkbox shows indeterminate when some (but not all) children are selected.',
      },
    },
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox size="sm" checked label="Small" />
      </div>
      <div className="flex items-center gap-4">
        <Checkbox size="default" checked label="Default" />
      </div>
      <div className="flex items-center gap-4">
        <Checkbox size="lg" checked label="Large" />
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled unchecked" />
      <Checkbox disabled checked label="Disabled checked" />
      <Checkbox disabled checked="indeterminate" label="Disabled indeterminate" />
    </div>
  ),
}

/**
 * Variants - States
 * Shows all checkbox states: regular, selected, indeterminate, and disabled variations.
 */
export const States: Story = {
  name: 'Variants: States',
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Checkbox label="Regular" />
      <Checkbox checked label="Selected" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled checked" />
      <Checkbox disabled checked="indeterminate" label="Disabled indeterminate" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Has 4 states: regular, hover, selected, and disabled.',
      },
    },
  },
}

/**
 * Separate Label Mode
 * Uses htmlFor/id association for better accessibility instead of wrapping the input.
 */
const SeparateLabelExample = () => {
  const [checked, setChecked] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 mb-2">
        Using <code className="bg-gray-100 px-1 rounded">separateLabel</code> mode with htmlFor/id association:
      </p>
      <Checkbox
        id="terms-checkbox"
        label="I agree to the Terms of Service"
        separateLabel
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
      />
      <p className="text-xs text-gray-500">
        Click the label text - it will toggle the checkbox via htmlFor association.
      </p>
    </div>
  )
}

export const SeparateLabelMode: Story = {
  name: 'Separate Label Mode',
  render: () => <SeparateLabelExample />,
  parameters: {
    docs: {
      description: {
        story: 'It is recommended to use `separateLabel` mode for better screen reader support as it provides clearer, more explicit label-input associations. When using this mode, the `id` prop is required for proper label association.',
      },
    },
  },
}

/**
 * Accessibility Props
 * Demonstrates ariaLabel and ariaLabelledBy usage.
 */
export const AccessibilityExample: Story = {
  name: 'Accessibility Props',
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-600 mb-2">Using aria-label prop:</p>
        <Checkbox aria-label="Subscribe to newsletter" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Using aria-labelledby prop:</p>
        <div className="flex items-center gap-2">
          <span id="notification-label" className="text-sm">Enable notifications</span>
          <Checkbox aria-labelledby="notification-label" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `aria-label` prop when you need to provide a custom accessible name. Use `aria-labelledby` prop when the checkbox is described by external elements.',
      },
    },
  },
}

/**
 * Custom Styling
 * Shows checkboxClassName and labelClassName usage.
 */
export const CustomStyling: Story = {
  name: 'Custom Styling',
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Custom checkbox border"
        checkboxClassName="border-purple-500"
        checked
      />
      <Checkbox
        label="Custom label styling"
        labelClassName="font-bold text-blue-600"
      />
      <Checkbox
        label="Both custom styles"
        checkboxClassName="rounded-full"
        labelClassName="italic text-green-600"
        checked
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `checkboxClassName` to style the checkbox element and `labelClassName` to style the label text.',
      },
    },
  },
}

/**
 * Form Integration
 * Shows name/value props usage.
 */
const FormExample = () => {
  const [formData, setFormData] = useState<Record<string, boolean>>({
    newsletter: false,
    updates: false,
    marketing: false,
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 mb-2">
        Checkboxes with name/value props for form metadata:
      </p>
      <Checkbox
        name="preferences"
        value="newsletter"
        label="Subscribe to newsletter"
        checked={formData.newsletter}
        onCheckedChange={(v) => setFormData(prev => ({ ...prev, newsletter: v === true }))}
      />
      <Checkbox
        name="preferences"
        value="updates"
        label="Receive product updates"
        checked={formData.updates}
        onCheckedChange={(v) => setFormData(prev => ({ ...prev, updates: v === true }))}
      />
      <Checkbox
        name="preferences"
        value="marketing"
        label="Allow marketing emails"
        checked={formData.marketing}
        onCheckedChange={(v) => setFormData(prev => ({ ...prev, marketing: v === true }))}
      />
      <pre className="mt-4 p-2 bg-gray-100 rounded text-xs">
        Form data: {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  )
}

export const FormIntegration: Story = {
  name: 'Form Integration',
  render: () => <FormExample />,
  parameters: {
    docs: {
      description: {
        story: 'The `name` and `value` props store form metadata on the element for custom form handling. Since this is a button-based checkbox, these are stored as data attributes rather than native form properties.',
      },
    },
  },
}

/**
 * Single Checkbox Use Case
 * Example: Accept terms of use.
 */
const SingleCheckboxExample = () => {
  const [accepted, setAccepted] = useState(true)
  return (
    <Checkbox
      id="terms"
      label="I agree to the Terms of Service and Privacy Policy."
      separateLabel
      checked={accepted}
      onCheckedChange={(v) => setAccepted(v === true)}
    />
  )
}

export const SingleCheckbox: Story = {
  name: 'Use Case: Single Checkbox',
  render: () => <SingleCheckboxExample />,
  parameters: {
    docs: {
      description: {
        story: 'Allows the user to choose a single option. For example: accept terms of use.',
      },
    },
  },
}

/**
 * Auto Focus
 * Demonstrates the autoFocus prop.
 */
export const AutoFocus: Story = {
  args: {
    label: 'This checkbox receives focus on mount',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `autoFocus` prop when the checkbox should receive initial focus for keyboard navigation.',
      },
    },
  },
}
