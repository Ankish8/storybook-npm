import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SelectField, type SelectOption } from './select-field'

const authOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api-key', label: 'API Key' },
  { value: 'oauth2', label: 'OAuth 2.0' },
]

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
]

const timezoneOptions: SelectOption[] = [
  { value: 'est', label: 'Eastern Standard Time (EST)', group: 'North America' },
  { value: 'cst', label: 'Central Standard Time (CST)', group: 'North America' },
  { value: 'mst', label: 'Mountain Standard Time (MST)', group: 'North America' },
  { value: 'pst', label: 'Pacific Standard Time (PST)', group: 'North America' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)', group: 'Europe' },
  { value: 'cet', label: 'Central European Time (CET)', group: 'Europe' },
  { value: 'eet', label: 'Eastern European Time (EET)', group: 'Europe' },
  { value: 'ist', label: 'India Standard Time (IST)', group: 'Asia' },
  { value: 'jst', label: 'Japan Standard Time (JST)', group: 'Asia' },
  { value: 'cst-china', label: 'China Standard Time (CST)', group: 'Asia' },
]

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive select field component with label, helper text, validation states, and more.

\`\`\`bash
npx myoperator-ui add select-field
\`\`\`

## Import

\`\`\`tsx
import { SelectField } from "@/components/ui/select-field"
\`\`\`

## Usage

\`\`\`tsx
<SelectField
  label="Authentication"
  placeholder="Select authentication method"
  options={[
    { value: 'none', label: 'None' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'bearer', label: 'Bearer Token' },
  ]}
  required
/>

{/* With groups */}
<SelectField
  label="Timezone"
  options={[
    { value: 'est', label: 'EST', group: 'North America' },
    { value: 'gmt', label: 'GMT', group: 'Europe' },
  ]}
/>

{/* Searchable */}
<SelectField
  label="Country"
  options={countries}
  searchable
  searchPlaceholder="Search countries..."
/>
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
      <td style="padding: 12px 16px;">Border Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Radius</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--radius</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">4px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">10px 16px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

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
      <td style="padding: 12px 16px;">Label</td>
      <td style="padding: 12px 16px;">Title/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Selected Value</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Placeholder</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Helper Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Search Input</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the select',
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
      description: 'Placeholder text when no value selected',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select',
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
    searchable: {
      control: 'boolean',
      description: 'Enable search/filter functionality',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Search input placeholder text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Search...' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    label: 'Authentication',
    placeholder: 'Select authentication method',
    required: true,
    helperText: 'Choose how you want to authenticate requests.',
    options: authOptions,
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <SelectField
        label="Default"
        placeholder="Select an option"
        options={authOptions}
      />
      <SelectField
        label="Disabled"
        placeholder="Select an option"
        options={authOptions}
        disabled
      />
      <SelectField
        label="Error"
        placeholder="Select an option"
        options={authOptions}
        error="This field is required"
      />
      <SelectField
        label="Loading"
        placeholder="Loading options..."
        options={authOptions}
        loading
      />
    </div>
  ),
}

// With Label
export const WithLabel: Story = {
  name: 'With label',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
      />
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        required
      />
      <SelectField
        label="Optional Field"
        placeholder="This is optional"
        options={authOptions}
        helperText="You can leave this empty"
      />
    </div>
  ),
}

// With Helper Text
export const WithHelperText: Story = {
  name: 'With helper text',
  render: () => (
    <div className="w-80">
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 5)}
        helperText="Select the country where you are located"
      />
    </div>
  ),
}

// Validation States
export const ValidationStates: Story = {
  name: 'Validation states',
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        error="Please select an authentication method"
      />
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 5)}
        defaultValue="us"
        helperText="Country selection confirmed"
      />
    </div>
  ),
}

// With Groups
export const WithGroups: Story = {
  name: 'With groups',
  render: () => (
    <div className="w-80">
      <SelectField
        label="Timezone"
        placeholder="Select your timezone"
        options={timezoneOptions}
        required
      />
    </div>
  ),
}

// Searchable
export const Searchable: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions}
        searchable
        searchPlaceholder="Search countries..."
        helperText="Type to filter options"
      />
    </div>
  ),
}

// Controlled Example
const ControlledExample = () => {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        value={value}
        onValueChange={setValue}
        options={authOptions}
        required
      />
      <p className="text-sm text-[#6B7280]">
        Selected value: {value || '(none)'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

// Loading State
export const LoadingState: Story = {
  name: 'Loading state',
  args: {
    label: 'Fetching Options',
    placeholder: 'Loading...',
    loading: true,
    options: [],
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}

// Form Example
export const FormExample: Story = {
  name: 'Form example',
  render: () => (
    <form className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        required
        name="auth"
      />
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 6)}
        required
        name="country"
      />
      <SelectField
        label="Timezone"
        placeholder="Select your timezone"
        options={timezoneOptions}
        name="timezone"
        helperText="Optional - we'll auto-detect if not selected"
      />
    </form>
  ),
}

// With TextField Example (from screenshot)
export const WebhookFormExample: Story = {
  name: 'Webhook form example',
  render: () => (
    <form className="flex flex-col gap-4 w-96">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#333333]">
          Webhook URL <span className="text-[#FF3B3B]">*</span>
        </label>
        <div className="flex h-10 w-full items-center rounded bg-white border border-[#E9E9E9] px-4">
          <span className="text-sm text-[#6B7280] mr-2">https://</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-0 outline-none text-sm text-[#333333] placeholder:text-[#9CA3AF]"
            placeholder="api.example.com/webhooks"
          />
        </div>
      </div>
      <SelectField
        label="Authentication"
        placeholder="None"
        options={authOptions}
        defaultValue="none"
      />
    </form>
  ),
}
