import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TextField } from './text-field'
import { Mail, Search, Eye, EyeOff, User, Lock, Globe, DollarSign } from 'lucide-react'

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive text field component with label, icons, validation states, and more.

\`\`\`bash
npx myoperator-ui add text-field
\`\`\`

## Import

\`\`\`tsx
import { TextField } from "@/components/ui/text-field"
\`\`\`

## Usage

\`\`\`tsx
<TextField label="Email" placeholder="Enter your email" required />
<TextField label="Username" error="Username is taken" />
<TextField label="Website" prefix="https://" suffix=".com" />
<TextField label="Bio" showCount maxLength={100} />

{/* Webhook URL example */}
<TextField
  label="Webhook URL"
  placeholder="https://api.example.com/webhooks"
  required
/>
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
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Shows red asterisk (*) next to label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
      table: {
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description: 'Error message - triggers error state with red styling',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    prefix: {
      control: 'text',
      description: 'Text prefix inside input (e.g., "https://")',
      table: {
        type: { summary: 'string' },
      },
    },
    suffix: {
      control: 'text',
      description: 'Text suffix inside input (e.g., ".com")',
      table: {
        type: { summary: 'string' },
      },
    },
    showCount: {
      control: 'boolean',
      description: 'Show character count (requires maxLength)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
      table: {
        type: { summary: 'number' },
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
    leftIcon: {
      control: 'boolean',
      description: 'Show left icon inside input',
      mapping: {
        true: <Search />,
        false: undefined,
      },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Show right icon inside input',
      mapping: {
        true: <Mail />,
        false: undefined,
      },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    helperText: 'We will never share your email.',
    type: 'text',
  },
  render: (args) => (
    <div className="w-80">
      <TextField {...args} />
    </div>
  ),
}

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <TextField label="Default" placeholder="Default state" />
      <TextField label="Disabled" placeholder="Disabled state" disabled />
      <TextField label="Error" placeholder="Error state" error="This field is required" />
      <TextField label="Loading" placeholder="Loading state" loading />
    </div>
  ),
}

// With Label
export const WithLabel: Story = {
  name: 'With label',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <TextField label="Full Name" placeholder="Enter your name" />
      <TextField label="Email Address" placeholder="Enter your email" required />
      <TextField label="Optional Field" placeholder="This field is optional" helperText="You can leave this empty" />
    </div>
  ),
}

// With Icons
export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <TextField label="Search" placeholder="Search..." leftIcon={<Search />} />
      <TextField label="Email" placeholder="Enter email" rightIcon={<Mail />} />
      <TextField
        label="Username"
        placeholder="Search users"
        leftIcon={<Search />}
        rightIcon={<User />}
      />
    </div>
  ),
}

// With Prefix/Suffix
export const WithPrefixSuffix: Story = {
  name: 'With prefix/suffix',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <TextField
        label="Website URL"
        prefix="https://"
        placeholder="example"
        suffix=".com"
        leftIcon={<Globe />}
      />
      <TextField
        label="Price"
        prefix="$"
        suffix="USD"
        placeholder="0.00"
        type="number"
        leftIcon={<DollarSign />}
      />
      <TextField label="Email" suffix="@company.com" placeholder="username" />
    </div>
  ),
}

// Character Count
export const CharacterCount: Story = {
  name: 'Character count',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <TextField
        label="Username"
        placeholder="Enter username"
        maxLength={20}
        showCount
        helperText="Maximum 20 characters"
      />
      <TextField
        label="Bio"
        placeholder="Tell us about yourself"
        maxLength={100}
        showCount
      />
    </div>
  ),
}

// Validation States
export const ValidationStates: Story = {
  name: 'Validation states',
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <TextField
        label="Email"
        placeholder="Enter email"
        error="Please enter a valid email address"
        defaultValue="invalid-email"
      />
      <TextField
        label="Username"
        placeholder="Enter username"
        defaultValue="valid_username"
        helperText="Username is valid"
      />
    </div>
  ),
}

// Controlled Example
const ControlledExample = () => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (newValue.length > 0 && newValue.length < 3) {
      setError('Must be at least 3 characters')
    } else {
      setError('')
    }
  }

  return (
    <div className="flex flex-col gap-4 w-80">
      <TextField
        label="Username"
        placeholder="Enter username"
        value={value}
        onChange={handleChange}
        error={error}
        required
        showCount
        maxLength={20}
      />
      <p className="text-sm text-[#6B7280]">Current value: {value || '(empty)'}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

// Password Field Example
const PasswordExample = () => {
  const [show, setShow] = useState(false)

  return (
    <div className="w-80">
      <TextField
        label="Password"
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        required
        leftIcon={<Lock />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="cursor-pointer hover:text-[#333333]"
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        }
        helperText="Must be at least 8 characters"
      />
    </div>
  )
}

export const Password: Story = {
  render: () => <PasswordExample />,
}

// Form Example
export const FormExample: Story = {
  name: 'Form example',
  render: () => (
    <form className="flex flex-col gap-4 w-80">
      <TextField
        label="Full Name"
        placeholder="John Doe"
        required
        leftIcon={<User />}
      />
      <TextField
        label="Email"
        type="email"
        placeholder="john@example.com"
        required
        leftIcon={<Mail />}
      />
      <TextField
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        leftIcon={<Lock />}
        helperText="Must be at least 8 characters"
      />
      <TextField
        label="Bio"
        placeholder="Tell us about yourself"
        showCount
        maxLength={150}
      />
    </form>
  ),
}

// Loading State
export const LoadingState: Story = {
  name: 'Loading state',
  args: {
    label: 'Verifying',
    placeholder: 'Checking availability...',
    loading: true,
    defaultValue: 'username123',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

// All Features Combined
export const AllFeatures: Story = {
  name: 'All features',
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <TextField
        label="Website"
        placeholder="mysite"
        prefix="https://"
        suffix=".com"
        leftIcon={<Globe />}
        helperText="Enter your website name"
        maxLength={30}
        showCount
        required
      />
    </div>
  ),
}

