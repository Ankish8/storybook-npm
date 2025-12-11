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

\`\`\`bash
npx myoperator-ui add select
\`\`\`

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
      <td style="padding: 12px 16px;">Text Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Hover BG</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F5F5F5</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Trigger Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Item Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Group Label</td>
      <td style="padding: 12px 16px;">Label/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs font-medium</code></td>
    </tr>
  </tbody>
</table>
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
