import type { Meta, StoryObj } from "@storybook/react";
import { PaymentSummary } from "./payment-summary";

const meta: Meta<typeof PaymentSummary> = {
  title: "Custom/PaymentSummary",
  component: PaymentSummary,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
PaymentSummary displays a card with line-item rows and an optional totals section separated by a divider. Values can be color-coded (default, success, error) and labels can optionally show info tooltips.

## Installation

This is a custom component (not available via CLI). Import directly from the package:

\`\`\`bash
npm install myoperator-ui
\`\`\`

## Import

\`\`\`tsx
import { PaymentSummary } from "myoperator-ui"
import type { PaymentSummaryItem } from "myoperator-ui"
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
      <td style="padding: 12px 16px;">Container border, divider</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E4E4E4; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Default values, bold labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Line item labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">Positive values (green)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #067647; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Negative values (red)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #B42318; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Line item label</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Line item value</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Bold label</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Large value</td>
      <td style="padding: 12px 16px;">18px (text-lg)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
const items = [
  { label: "Business Account Number (BAN)", value: "6LMVPG" },
  { label: "Pending Rental", value: "₹0.00" },
  { label: "Current Usage Charges", value: "₹163.98" },
  { label: "Prepaid Wallet Amount", value: "₹78,682.92", valueColor: "success" },
];

const summaryItems = [
  {
    label: "Total amount due",
    value: "-₹78,518.94",
    valueColor: "error",
    valueSize: "lg",
    bold: true,
    tooltip: "Sum of all charges minus prepaid balance",
  },
  {
    label: "Credit limit",
    value: "₹10,000.00",
    tooltip: "Maximum credit available",
  },
];

<PaymentSummary items={items} summaryItems={summaryItems} />
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
    items: [
      { label: "Business Account Number (BAN)", value: "6LMVPG" },
      { label: "Pending Rental", value: "₹0.00" },
      { label: "Current Usage Charges", value: "₹163.98" },
      { label: "Outstanding Usage", value: "₹0.00" },
      {
        label: "Prepaid Wallet Amount",
        value: "₹78,682.92",
        valueColor: "success",
      },
      { label: "Other Miscellaneous Charges", value: "₹0.00" },
      { label: "Applicable Taxes", value: "₹0.00" },
    ],
    summaryItems: [
      {
        label: "Total amount due",
        value: "-₹78,518.94",
        valueColor: "error",
        valueSize: "lg",
        bold: true,
        tooltip: "Sum of all charges minus prepaid wallet balance",
      },
      {
        label: "Credit limit",
        value: "₹10,000.00",
        tooltip: "Maximum credit available on your account",
      },
    ],
  },
};

export const LineItemsOnly: Story = {
  name: "Line Items Only",
  args: {
    items: [
      { label: "Pending Rental", value: "₹500.00" },
      { label: "Current Usage Charges", value: "₹1,200.00" },
      { label: "Applicable Taxes", value: "₹216.00" },
    ],
  },
};

export const WithSuccessValues: Story = {
  name: "With Success Values",
  args: {
    items: [
      { label: "Amount Paid", value: "₹5,000.00", valueColor: "success" },
      { label: "Cashback Applied", value: "₹250.00", valueColor: "success" },
      { label: "Balance Remaining", value: "₹4,750.00", valueColor: "success" },
    ],
  },
};

export const WithErrorValues: Story = {
  name: "With Error Values",
  args: {
    items: [
      { label: "Outstanding Balance", value: "-₹12,000.00", valueColor: "error" },
      { label: "Late Fee", value: "₹500.00", valueColor: "error" },
    ],
    summaryItems: [
      {
        label: "Total overdue",
        value: "-₹12,500.00",
        valueColor: "error",
        valueSize: "lg",
        bold: true,
        tooltip: "Payment is overdue",
      },
    ],
  },
};

export const WithTooltips: Story = {
  name: "With Tooltips",
  args: {
    items: [
      { label: "Base Charge", value: "₹999.00", tooltip: "Monthly subscription fee" },
      { label: "Usage Charge", value: "₹350.00", tooltip: "Based on API calls this month" },
      { label: "Discount", value: "-₹100.00", valueColor: "success", tooltip: "Annual plan discount" },
    ],
    summaryItems: [
      {
        label: "Net payable",
        value: "₹1,249.00",
        bold: true,
        valueSize: "lg",
        tooltip: "Final amount after discounts",
      },
    ],
  },
};

export const SummaryOnly: Story = {
  name: "Summary Only",
  args: {
    items: [],
    summaryItems: [
      {
        label: "Total amount due",
        value: "₹0.00",
        bold: true,
        valueSize: "lg",
      },
      {
        label: "Credit limit",
        value: "₹25,000.00",
        tooltip: "Your approved credit limit",
      },
    ],
  },
};
