import type { Meta, StoryObj } from "@storybook/react";
import { Landmark } from "lucide-react";
import { BankDetails } from "./bank-details";

const meta: Meta<typeof BankDetails> = {
  title: "Custom/Plan & Payment/BankDetails",
  component: BankDetails,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
BankDetails displays bank account information inside a collapsible accordion card. Each row shows a label-value pair, with optional copy-to-clipboard support for individual values.

## Installation

This is a custom component (not available via CLI). Import directly from the package:

\`\`\`bash
npm install myoperator-ui
\`\`\`

## Import

\`\`\`tsx
import { BankDetails } from "myoperator-ui"
import type { BankDetailsProps, BankDetailItem } from "myoperator-ui"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Accordion border, content divider</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E4E4E4; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Icon container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E8F1FC; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info 25</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-25</code></td>
      <td style="padding: 12px 16px;">Info card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info 200</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-200</code></td>
      <td style="padding: 12px 16px;">Info card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E8F1FC; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Title, values</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Subtitle, labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">Copy confirmation checkmark</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #067647; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Font Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Tracking</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.01px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Subtitle</td>
      <td style="padding: 12px 16px;">12px (text-xs)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.048px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Row label</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Row value</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { Landmark } from "lucide-react"

const bankItems = [
  { label: "Account holder's name", value: "MyOperator" },
  { label: "Account Number", value: "2223330026552601", copyable: true },
  { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
  { label: "Bank Name", value: "AXIS BANK" },
]

<BankDetails
  icon={<Landmark className="size-5 text-semantic-primary" />}
  items={bankItems}
  onCopy={(item) => console.log(\`Copied: \${item.value}\`)}
/>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    items: [
      { label: "Account holder's name", value: "MyOperator" },
      { label: "Account Number", value: "2223330026552601", copyable: true },
      { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
      { label: "Bank Name", value: "AXIS BANK" },
    ],
  },
};

export const WithoutIcon: Story = {
  name: "Without Icon",
  args: {
    items: [
      { label: "Account holder's name", value: "MyOperator" },
      { label: "Account Number", value: "2223330026552601", copyable: true },
      { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
      { label: "Bank Name", value: "AXIS BANK" },
    ],
  },
};

export const CustomTitleSubtitle: Story = {
  name: "Custom Title & Subtitle",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    title: "Wire Transfer",
    subtitle: "International SWIFT transfer",
    items: [
      { label: "Beneficiary Name", value: "ACME Corp" },
      { label: "Account Number", value: "GB29NWBK60161331926819", copyable: true },
      { label: "SWIFT Code", value: "NWBKGB2L", copyable: true },
      { label: "Bank Name", value: "NATWEST BANK" },
      { label: "Branch", value: "London Main" },
    ],
  },
};

export const NoCopyButtons: Story = {
  name: "No Copy Buttons",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    items: [
      { label: "Account holder's name", value: "MyOperator" },
      { label: "Account Number", value: "2223330026552601" },
      { label: "IFSC Code", value: "UTIB000RAZP" },
      { label: "Bank Name", value: "AXIS BANK" },
    ],
  },
};

export const AllCopyable: Story = {
  name: "All Copyable",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    items: [
      { label: "Account holder's name", value: "MyOperator", copyable: true },
      { label: "Account Number", value: "2223330026552601", copyable: true },
      { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
      { label: "Bank Name", value: "AXIS BANK", copyable: true },
    ],
  },
};

export const CollapsedByDefault: Story = {
  name: "Collapsed by Default",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    defaultOpen: false,
    items: [
      { label: "Account holder's name", value: "MyOperator" },
      { label: "Account Number", value: "2223330026552601", copyable: true },
      { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
      { label: "Bank Name", value: "AXIS BANK" },
    ],
  },
};

export const MinimalItems: Story = {
  name: "Minimal Items",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    items: [
      { label: "UPI ID", value: "myoperator@axis", copyable: true },
    ],
  },
};
