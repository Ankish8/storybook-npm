import type { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A composable select/dropdown component built on Radix UI primitives.

## Import

\`\`\`tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
\`\`\`

## Usage

\`\`\`tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Border Color | \`#E9E9E9\` |
| Border Radius | \`4px\` |
| Height | \`40px\` |
| Padding | \`10px 16px\` |
| Focus Ring | \`#2BBBC9\` |
| Error Color | \`#FF3B3B\` |
| Hover BG | \`#F3F4F6\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Overview - primary interactive example
export const Overview: Story = {
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
          <SelectItem value="api-key">API Key</SelectItem>
          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Default</p>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Error</p>
        <Select>
          <SelectTrigger state="error">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Disabled</p>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
}

// With Selected Value
export const WithSelectedValue: Story = {
  name: 'With selected value',
  render: () => (
    <div className="w-80">
      <Select defaultValue="bearer">
        <SelectTrigger>
          <SelectValue placeholder="Select authentication" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
          <SelectItem value="api-key">API Key</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// With Groups
export const WithGroups: Story = {
  name: 'With groups',
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="cst-china">China Standard Time (CST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

// With Disabled Items
export const WithDisabledItems: Story = {
  name: 'With disabled items',
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="basic">Basic - $9/mo</SelectItem>
          <SelectItem value="pro">Pro - $29/mo</SelectItem>
          <SelectItem value="enterprise" disabled>Enterprise (Contact Sales)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// Long List
export const LongList: Story = {
  name: 'Long list',
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="cn">China</SelectItem>
          <SelectItem value="in">India</SelectItem>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
          <SelectItem value="kr">South Korea</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="se">Sweden</SelectItem>
          <SelectItem value="no">Norway</SelectItem>
          <SelectItem value="fi">Finland</SelectItem>
          <SelectItem value="dk">Denmark</SelectItem>
          <SelectItem value="sg">Singapore</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// Authentication Example (from screenshot)
export const AuthenticationExample: Story = {
  name: 'Authentication example',
  render: () => (
    <div className="w-96">
      <p className="text-sm font-medium text-[#333333] mb-1.5">Authentication</p>
      <Select defaultValue="none">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
          <SelectItem value="api-key">API Key</SelectItem>
          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
