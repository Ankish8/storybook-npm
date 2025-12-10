import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MultiSelect, type MultiSelectOption } from './multi-select'

const skillOptions: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
]

const roleOptions: MultiSelectOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'moderator', label: 'Moderator' },
]

const countryOptions: MultiSelectOption[] = [
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

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A multi-select component with tags, search, and validation states.

\`\`\`bash
npx myoperator-ui add multi-select
\`\`\`

## Import

\`\`\`tsx
import { MultiSelect } from "@/components/ui/multi-select"
\`\`\`

## Usage

\`\`\`tsx
<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  onValueChange={(values) => console.log(values)}
/>

{/* With max selections */}
<MultiSelect
  label="Top 3 Skills"
  options={skills}
  maxSelections={3}
/>

{/* Searchable */}
<MultiSelect
  label="Countries"
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
      <td style="padding: 12px 16px;">Min Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">8px 16px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Tag Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F5F5F5</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
    },
    required: {
      control: 'boolean',
      description: 'Shows red asterisk (*) next to label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no values selected',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select',
    },
    error: {
      control: 'text',
      description: 'Error message - triggers error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search/filter functionality',
    },
    maxSelections: {
      control: 'number',
      description: 'Maximum selections allowed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    label: 'Skills',
    placeholder: 'Select your skills',
    required: true,
    helperText: 'Select all that apply',
    options: skillOptions,
  },
  render: (args) => (
    <div className="w-80">
      <MultiSelect {...args} />
    </div>
  ),
}

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <MultiSelect
        label="Default"
        placeholder="Select options"
        options={roleOptions}
      />
      <MultiSelect
        label="With Selection"
        placeholder="Select options"
        options={roleOptions}
        defaultValue={['admin', 'editor']}
      />
      <MultiSelect
        label="Disabled"
        placeholder="Select options"
        options={roleOptions}
        disabled
      />
      <MultiSelect
        label="Error"
        placeholder="Select options"
        options={roleOptions}
        error="Please select at least one role"
      />
      <MultiSelect
        label="Loading"
        placeholder="Loading..."
        options={roleOptions}
        loading
      />
    </div>
  ),
}

// With Tags
export const WithTags: Story = {
  name: 'With tags',
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Selected Skills"
        placeholder="Select skills"
        options={skillOptions}
        defaultValue={['react', 'typescript', 'nextjs']}
        helperText="Click X to remove a tag"
      />
    </div>
  ),
}

// Max Selections
export const MaxSelections: Story = {
  name: 'Max selections',
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Top 3 Skills"
        placeholder="Select up to 3 skills"
        options={skillOptions}
        maxSelections={3}
        helperText="You can select up to 3 skills"
      />
    </div>
  ),
}

// Searchable
export const Searchable: Story = {
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Countries"
        placeholder="Select countries"
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
  const [values, setValues] = useState<string[]>(['react'])

  return (
    <div className="flex flex-col gap-4 w-80">
      <MultiSelect
        label="Skills"
        placeholder="Select skills"
        value={values}
        onValueChange={setValues}
        options={skillOptions}
        required
      />
      <p className="text-sm text-[#6B7280]">
        Selected: {values.length > 0 ? values.join(', ') : '(none)'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

// Validation States
export const ValidationStates: Story = {
  name: 'Validation states',
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <MultiSelect
        label="Required Field"
        placeholder="Select at least one"
        options={roleOptions}
        error="This field is required"
        required
      />
      <MultiSelect
        label="Valid Selection"
        placeholder="Select roles"
        options={roleOptions}
        defaultValue={['admin']}
        helperText="Selection saved successfully"
      />
    </div>
  ),
}

// Form Example
export const FormExample: Story = {
  name: 'Form example',
  render: () => (
    <form className="flex flex-col gap-4 w-80">
      <MultiSelect
        label="Technical Skills"
        placeholder="Select your skills"
        options={skillOptions}
        required
        name="skills"
        maxSelections={5}
        searchable
        helperText="Select up to 5 skills"
      />
      <MultiSelect
        label="Preferred Countries"
        placeholder="Select countries"
        options={countryOptions}
        name="countries"
        searchable
        searchPlaceholder="Search..."
      />
      <MultiSelect
        label="Roles"
        placeholder="Select roles"
        options={roleOptions}
        name="roles"
        required
      />
    </form>
  ),
}

// With Disabled Options
export const WithDisabledOptions: Story = {
  name: 'With disabled options',
  render: () => {
    const optionsWithDisabled: MultiSelectOption[] = [
      { value: 'free', label: 'Free Tier' },
      { value: 'basic', label: 'Basic Plan' },
      { value: 'pro', label: 'Pro Plan' },
      { value: 'enterprise', label: 'Enterprise (Contact Sales)', disabled: true },
    ]

    return (
      <div className="w-80">
        <MultiSelect
          label="Select Plans"
          placeholder="Choose available plans"
          options={optionsWithDisabled}
          helperText="Some options may not be available"
        />
      </div>
    )
  },
}
