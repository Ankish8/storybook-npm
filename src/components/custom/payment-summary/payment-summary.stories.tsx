import type { Meta, StoryObj } from "@storybook/react";
import { PaymentSummary } from "./payment-summary";

const meta: Meta<typeof PaymentSummary> = {
  title: "Custom/Plan & Payment/PaymentSummary",
  component: PaymentSummary,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
PaymentSummary displays a detailed bill breakdown card with a header, line items, subtotal, a nested breakdown card (for GST/prepaid deduction), and a footer total. Values can be color-coded (default, success, error) and labels can optionally show a hint sub-text or info tooltip.

## Installation

\`\`\`bash
npx myoperator-ui add payment-summary
\`\`\`

## Import

\`\`\`tsx
import { PaymentSummary } from "@/components/custom/payment-summary"
import type {
  PaymentSummaryItem,
  PaymentSummaryHeaderInfo,
  PaymentSummaryBreakdownCard,
  BreakdownCardItem,
} from "@/components/custom/payment-summary"
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
      <td style="padding: 12px 16px;">Container border, dividers, breakdown card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E4E4E4; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Breakdown card background (light blue tint)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Header title, bold labels, default values</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Header wallet label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #414651; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Line item labels, muted breakdown rows</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Hint text below label (e.g. remaining prepaid)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #0D6EFD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">Prepaid deduction rows, zero-balance total</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #067647; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Amount due when balance is owed</td>
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
      <td style="padding: 12px 16px;">Header title</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Header wallet value</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Line item label / value</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Subtotal label / value</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Breakdown card rows</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Footer total value</td>
      <td style="padding: 12px 16px;">18px (text-lg)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Hint text</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.06px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
<PaymentSummary
  title="Detailed Bill Breakdown"
  headerInfo={{
    label: "Prepaid Wallet Amount:",
    value: "₹2,178.75",
    valueColor: "success",
  }}
  items={[
    { label: "Business Account Number (BAN)", value: "6LMVPG" },
    { label: "Pending Rental", value: "₹0.00" },
    { label: "Current Usage", value: "₹2,500.00" },
    { label: "Outstanding Usage", value: "₹0.00" },
    { label: "Misc Charges", value: "₹0.00" },
  ]}
  subtotal={{ label: "Total Charges", value: "₹2,500.00" }}
  breakdownCard={{
    topItems: [
      { label: "Gross Charges", value: "₹2,500.00" },
      {
        label: "(-) Prepaid Deduction",
        value: "₹2,178.75",
        labelColor: "success",
        valueColor: "success",
      },
    ],
    bottomItems: [
      { label: "Amount Due Without GST", value: "₹321.25" },
      {
        label: "(+) Applicable GST 18%",
        value: "₹57.83",
        labelColor: "muted",
        valueColor: "muted",
      },
    ],
  }}
  summaryItems={[
    {
      label: "Total amount due",
      value: "₹379.08",
      bold: true,
      valueSize: "lg",
      valueColor: "error",
    },
  ]}
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

const detailedBillItems = [
  { label: "Business Account Number (BAN)", value: "6LMVPG" },
  { label: "Pending Rental", value: "₹0.00" },
  { label: "Current Usage", value: "₹2,500.00" },
  { label: "Outstanding Usage", value: "₹0.00" },
  { label: "Misc Charges", value: "₹0.00" },
];

/**
 * V1 — Amount Due: prepaid wallet is less than total charges.
 * After the prepaid deduction there is still an outstanding balance shown in red.
 */
export const Default: Story = {
  args: {
    title: "Detailed Bill Breakdown",
    headerInfo: {
      label: "Prepaid Wallet Amount:",
      value: "₹2,178.75",
      valueColor: "success",
    },
    items: detailedBillItems,
    subtotal: { label: "Total Charges", value: "₹2,500.00" },
    breakdownCard: {
      topItems: [
        { label: "Gross Charges", value: "₹2,500.00" },
        {
          label: "(-) Prepaid Deduction",
          value: "₹2,178.75",
          labelColor: "success",
          valueColor: "success",
        },
      ],
      bottomItems: [
        { label: "Amount Due Without GST", value: "₹321.25" },
        {
          label: "(+) Applicable GST 18%",
          value: "₹57.83",
          labelColor: "muted",
          valueColor: "muted",
        },
      ],
    },
    summaryItems: [
      {
        label: "Total amount due",
        value: "₹379.08",
        bold: true,
        valueSize: "lg",
        valueColor: "error",
      },
    ],
  },
};

/**
 * V2 — Zero Balance: prepaid wallet exactly covers the total charges.
 * Amount due is ₹0.00 shown in green.
 */
export const ZeroBalance: Story = {
  name: "Zero Balance",
  args: {
    title: "Detailed Bill Breakdown",
    headerInfo: {
      label: "Prepaid Wallet Amount:",
      value: "₹2,500.00",
      valueColor: "success",
    },
    items: detailedBillItems,
    subtotal: { label: "Total Charges", value: "₹2,500.00" },
    breakdownCard: {
      topItems: [
        { label: "Gross Charges", value: "₹2,500.00" },
        {
          label: "(-) Prepaid Deduction",
          value: "₹2,500.00",
          labelColor: "success",
          valueColor: "success",
        },
      ],
      bottomItems: [
        { label: "Amount Due Without GST", value: "₹0.00" },
        {
          label: "(+) Applicable GST 0%",
          value: "₹0.00",
          labelColor: "muted",
          valueColor: "muted",
        },
      ],
    },
    summaryItems: [
      {
        label: "Total amount due",
        value: "₹0.00",
        bold: true,
        valueSize: "lg",
        valueColor: "success",
      },
    ],
  },
};

/**
 * V3 — Credit Remaining: prepaid wallet exceeds total charges.
 * Amount due is ₹0.00 (green) with a hint showing the remaining prepaid balance.
 */
export const CreditRemaining: Story = {
  name: "Credit Remaining",
  args: {
    title: "Detailed Bill Breakdown",
    headerInfo: {
      label: "Prepaid Wallet Amount:",
      value: "₹7,092.25",
      valueColor: "success",
    },
    items: detailedBillItems,
    subtotal: { label: "Total Charges", value: "₹2,500.00" },
    breakdownCard: {
      topItems: [
        { label: "Gross Charges", value: "₹2,500.00" },
        {
          label: "(-) Prepaid Deduction",
          value: "₹2,500.00",
          labelColor: "success",
          valueColor: "success",
        },
      ],
      bottomItems: [
        { label: "Amount Due Without GST", value: "₹0.00" },
        {
          label: "(+) Applicable GST 0%",
          value: "₹0.00",
          labelColor: "muted",
          valueColor: "muted",
        },
      ],
    },
    summaryItems: [
      {
        label: "Total amount due",
        value: "₹0.00",
        bold: true,
        valueSize: "lg",
        valueColor: "success",
        hint: "+Remaining prepaid amount: ₹4,592.25",
      },
    ],
  },
};
