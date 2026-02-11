import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Globe,
  CreditCard,
  Wallet,
  Smartphone,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentOptionCard } from "./payment-option-card";
import { PaymentOptionCardModal } from "./payment-option-card-modal";
import type { PaymentOption } from "./types";

const defaultOptions: PaymentOption[] = [
  {
    id: "net-banking",
    icon: <Globe className="size-5 text-semantic-text-muted" />,
    title: "Net banking",
    description: "Pay securely through your bank",
  },
  {
    id: "debit-card",
    icon: <CreditCard className="size-5 text-semantic-text-muted" />,
    title: "Debit Card",
    description: "All major debit cards",
  },
  {
    id: "wallet",
    icon: <Wallet className="size-5 text-semantic-text-muted" />,
    title: "Wallet",
    description: "Paytm, PhonePe, Google Pay",
  },
  {
    id: "credit-card",
    icon: <CreditCard className="size-5 text-semantic-text-muted" />,
    title: "Credit Card",
    description: "Visa, Mastercard, Amex",
  },
  {
    id: "upi",
    icon: <Smartphone className="size-5 text-semantic-text-muted" />,
    title: "UPI",
    description: "Pay using UPI ID or QR",
  },
];

const meta: Meta<typeof PaymentOptionCard> = {
  title: "Custom/Plan & Payment/PaymentOptionCard",
  component: PaymentOptionCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A selectable payment method list with icons, titles, and descriptions. Users pick a payment method and click the CTA to proceed. Supports both controlled and uncontrolled selection modes.

Also includes a **PaymentOptionCardModal** variant that wraps the card in a Dialog overlay for modal usage.

## Installation

\`\`\`bash
npx myoperator-ui add payment-option-card
\`\`\`

## Import

\`\`\`tsx
import { PaymentOptionCard, PaymentOptionCardModal } from "@/components/custom/payment-option-card"
import type { PaymentOptionCardProps, PaymentOptionCardModalProps, PaymentOption } from "@/components/custom/payment-option-card"
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
      <td style="padding: 12px 16px;">Info 25</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-info-25</code></td>
      <td style="padding: 12px 16px;">Icon container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Title, option titles</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Subtitle, option descriptions</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Brand</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px;">Selected option border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Unselected option border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">CTA button background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">18px (text-lg)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Subtitle</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Option Title</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Option Description</td>
      <td style="padding: 12px 16px;">12px (text-xs)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.048px</td>
    </tr>
  </tbody>
</table>

## Usage

### Inline Card

\`\`\`tsx
import { PaymentOptionCard } from "@/components/custom/payment-option-card";
import { Globe, CreditCard, Smartphone } from "lucide-react";

<PaymentOptionCard
  options={[
    { id: "net-banking", icon: <Globe className="size-5" />, title: "Net banking", description: "Pay securely through your bank" },
    { id: "upi", icon: <Smartphone className="size-5" />, title: "UPI", description: "Pay using UPI ID or QR" },
  ]}
  defaultSelectedOptionId="net-banking"
  onOptionSelect={(id) => console.log("Selected:", id)}
  onCtaClick={() => console.log("Proceed")}
  onClose={() => console.log("Closed")}
/>
\`\`\`

### Modal Variant

\`\`\`tsx
import { PaymentOptionCardModal } from "@/components/custom/payment-option-card";
import { Globe, Smartphone } from "lucide-react";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Select Payment</Button>

<PaymentOptionCardModal
  open={open}
  onOpenChange={setOpen}
  options={[
    { id: "net-banking", icon: <Globe className="size-5" />, title: "Net banking", description: "Pay securely through your bank" },
    { id: "upi", icon: <Smartphone className="size-5" />, title: "UPI", description: "Pay using UPI ID or QR" },
  ]}
  onOptionSelect={(id) => console.log("Selected:", id)}
  onCtaClick={() => { handlePayment(); setOpen(false); }}
/>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "460px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: defaultOptions,
    defaultSelectedOptionId: "net-banking",
    onClose: () => {},
  },
};

export const NoSelection: Story = {
  name: "No Pre-selection",
  args: {
    options: defaultOptions,
    onClose: () => {},
  },
};

export const WithoutCloseButton: Story = {
  name: "Without Close Button",
  args: {
    options: defaultOptions,
    defaultSelectedOptionId: "upi",
  },
};

export const CustomTitle: Story = {
  name: "Custom Title & Subtitle",
  args: {
    title: "Choose payment type",
    subtitle: "All transactions are encrypted",
    options: defaultOptions,
    defaultSelectedOptionId: "credit-card",
    onClose: () => {},
  },
};

export const FewOptions: Story = {
  name: "Few Options",
  args: {
    options: [
      {
        id: "bank",
        icon: <Landmark className="size-5 text-semantic-text-muted" />,
        title: "Bank Transfer",
        description: "Direct bank-to-bank transfer",
      },
      {
        id: "upi",
        icon: <Smartphone className="size-5 text-semantic-text-muted" />,
        title: "UPI",
        description: "Pay using UPI ID or QR",
      },
    ],
    ctaText: "Pay Now",
    onClose: () => {},
  },
};

export const Loading: Story = {
  args: {
    options: defaultOptions,
    defaultSelectedOptionId: "net-banking",
    loading: true,
    onClose: () => {},
  },
};

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    defaultSelectedOptionId: "net-banking",
    disabled: true,
    onClose: () => {},
  },
};

export const CustomCTA: Story = {
  name: "Custom CTA Text",
  args: {
    options: defaultOptions,
    defaultSelectedOptionId: "wallet",
    ctaText: "Complete Payment",
    onClose: () => {},
  },
};

export const AutoPaySetupVariant: Story = {
  name: "Auto-Pay Setup",
  args: {
    title: "Select payment method",
    subtitle: "Preferred method with secure transactions",
    options: [
      {
        id: "net-banking",
        icon: <Globe className="size-5 text-semantic-text-muted" />,
        title: "Net banking",
        description: "Pay securely through your bank",
      },
      {
        id: "card-subscription",
        icon: <CreditCard className="size-5 text-semantic-text-muted" />,
        title: "Card based subscription",
        description: "Credit or Debit card payment",
      },
    ],
    defaultSelectedOptionId: "net-banking",
    ctaText: "Continue",
    onClose: () => {},
  },
};

// ─── Modal Variant Stories ──────────────────────────────────────────────

export const ModalVariant: Story = {
  name: "Modal",
  decorators: [
    (Story) => (
      <div style={{ width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState("net-banking");

    return (
      <>
        <Button onClick={() => setOpen(true)}>Select Payment Method</Button>
        <PaymentOptionCardModal
          open={open}
          onOpenChange={setOpen}
          options={defaultOptions}
          selectedOptionId={selected}
          onOptionSelect={setSelected}
          onCtaClick={() => setOpen(false)}
        />
      </>
    );
  },
};

export const ModalWithPreSelection: Story = {
  name: "Modal (Pre-selected)",
  decorators: [
    (Story) => (
      <div style={{ width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Payment Modal</Button>
        <PaymentOptionCardModal
          open={open}
          onOpenChange={setOpen}
          options={defaultOptions}
          defaultSelectedOptionId="upi"
          onCtaClick={() => setOpen(false)}
        />
      </>
    );
  },
};

export const ModalAutoPaySetup: Story = {
  name: "Modal (Auto-Pay Setup)",
  decorators: [
    (Story) => (
      <div style={{ width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Setup Auto-Pay</Button>
        <PaymentOptionCardModal
          open={open}
          onOpenChange={setOpen}
          title="Setup auto-pay method"
          subtitle="Choose how recurring payments are processed"
          options={[
            {
              id: "net-banking",
              icon: <Globe className="size-5 text-semantic-text-muted" />,
              title: "Net banking",
              description: "Pay securely through your bank",
            },
            {
              id: "card-subscription",
              icon: <CreditCard className="size-5 text-semantic-text-muted" />,
              title: "Card based subscription",
              description: "Credit or Debit card payment",
            },
          ]}
          defaultSelectedOptionId="net-banking"
          ctaText="Continue"
          onCtaClick={() => setOpen(false)}
        />
      </>
    );
  },
};

