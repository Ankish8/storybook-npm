import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LetUsDriveCard } from "./let-us-drive-card";

const meta: Meta<typeof LetUsDriveCard> = {
  title: "Custom/Plan & Payment/Plan & Pricing/LetUsDriveCard",
  component: LetUsDriveCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A managed service card displaying a service name, pricing, optional billing frequency badge, and a CTA button. Used in the "Let us drive — Full-service management" section of the pricing page.

Supports a "free/discount" state where the original price is shown with strikethrough and a green label (e.g., "FREE") replaces it.

## Installation

\`\`\`bash
npx myoperator-ui add let-us-drive-card
\`\`\`

## Import

\`\`\`tsx
import { LetUsDriveCard } from "@/components/custom/let-us-drive-card"
import type { LetUsDriveCardProps } from "@/components/custom/let-us-drive-card"
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
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Service title, price</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Description text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Period label, "Starts at", strikethrough price</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">"Show details" link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">"FREE" label text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #17B26A; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Billing badge background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-primary</code></td>
      <td style="padding: 12px 16px;">Billing badge text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
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
      <td style="padding: 12px 16px;">Service Title</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Price</td>
      <td style="padding: 12px 16px;">28px (text-[28px])</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Period</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">"Starts at" prefix</td>
      <td style="padding: 12px 16px;">12px (text-xs)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.048px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Billing Badge</td>
      <td style="padding: 12px 16px;">12px (text-xs)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.048px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Show details / CTA</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.014px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { LetUsDriveCard } from "@/components/custom/let-us-drive-card";

// Basic service card
<LetUsDriveCard
  title="Account Manager"
  price="15,000"
  period="/month"
  billingBadge="Annually"
  description="One expert who knows your business. And moves it forward."
  onShowDetails={() => openDetails("account-manager")}
  onCtaClick={() => contactSales("account-manager")}
/>

// With "Starts at" prefix
<LetUsDriveCard
  title="Managed Services"
  price="50,000"
  period="/month"
  billingBadge="Quarterly"
  startsAt
  description="End-to-end execution \u2014 built and run by experts."
  onShowDetails={() => openDetails("managed-services")}
  onCtaClick={() => contactSales("managed-services")}
/>

// Free/discount state
<LetUsDriveCard
  title="Dedicated Onboarding"
  price="20,000"
  period="/one-time fee"
  freeLabel="FREE"
  description="Cut adoption time. Start seeing ROI faster."
  onShowDetails={() => openDetails("onboarding")}
  onCtaClick={() => contactSales("onboarding")}
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

const singleCardDecorator = (Story: React.ComponentType) => (
  <div style={{ width: "340px" }}>
    <Story />
  </div>
);

// ─── Default: Account Manager ─────────────────────────────────────────────

export const Default: Story = {
  decorators: [singleCardDecorator],
  args: {
    title: "Account Manager",
    price: "15,000",
    period: "/per month",
    billingBadge: "Annually",
    description:
      "One expert who knows your business. And moves it forward.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
};

// ─── Dedicated Onboarding ─────────────────────────────────────────────────

export const DedicatedOnboarding: Story = {
  name: "Dedicated Onboarding",
  decorators: [singleCardDecorator],
  args: {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "/one-time fee",
    description: "Cut adoption time. Start seeing ROI faster.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
};

// ─── Managed Services (Starts at) ────────────────────────────────────────

export const ManagedServices: Story = {
  name: "Managed Services (Starts at)",
  decorators: [singleCardDecorator],
  args: {
    title: "Managed Services",
    price: "50,000",
    period: "/month",
    billingBadge: "Quarterly",
    startsAt: true,
    description: "End-to-end execution \u2014 built and run by experts.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
};

// ─── Free/Discount State ─────────────────────────────────────────────────

export const FreeState: Story = {
  name: "Free / Discount State",
  decorators: [singleCardDecorator],
  args: {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "/one-time fee",
    freeLabel: "FREE",
    description: "Cut adoption time. Start seeing ROI faster.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
};

// ─── Without Show Details ────────────────────────────────────────────────

export const WithoutShowDetails: Story = {
  name: "Without Show Details",
  decorators: [singleCardDecorator],
  args: {
    title: "Account Manager",
    price: "15,000",
    period: "/per month",
    billingBadge: "Annually",
    description:
      "One expert who knows your business. And moves it forward.",
    onCtaClick: () => {},
  },
};

// ─── All Cards (Full Section) ────────────────────────────────────────────

export const AllCards: Story = {
  name: "All Cards (Section Layout)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
        Let us drive — Full-service management
      </h2>
      <div className="flex gap-6 items-stretch" style={{ width: "1080px" }}>
        <LetUsDriveCard
          className="flex-1"
          title="Dedicated Onboarding"
          price="20,000"
          period="/one-time fee"
          description="Cut adoption time. Start seeing ROI faster."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
        <LetUsDriveCard
          className="flex-1"
          title="Account Manager"
          price="15,000"
          period="/per month"
          billingBadge="Annually"
          description="One expert who knows your business. And moves it forward."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
        <LetUsDriveCard
          className="flex-1"
          title="Managed Services"
          price="50,000"
          period="/month"
          billingBadge="Quarterly"
          startsAt
          description="End-to-end execution — built and run by experts."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
      </div>
    </div>
  ),
};

// ─── All Cards Free State ────────────────────────────────────────────────

export const AllCardsFreeState: Story = {
  name: "All Cards (Free State)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
        Let us drive — Full-service management
      </h2>
      <div className="flex gap-6 items-stretch" style={{ width: "1080px" }}>
        <LetUsDriveCard
          className="flex-1"
          title="Dedicated Onboarding"
          price="20,000"
          period="/one-time fee"
          freeLabel="FREE"
          description="Cut adoption time. Start seeing ROI faster."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
        <LetUsDriveCard
          className="flex-1"
          title="Account Manager"
          price="15,000"
          period="/per month"
          billingBadge="Annually"
          description="One expert who knows your business. And moves it forward."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
        <LetUsDriveCard
          className="flex-1"
          title="Managed Services"
          price="50,000"
          period="/month"
          billingBadge="Quarterly"
          startsAt
          description="End-to-end execution — built and run by experts."
          onShowDetails={() => {}}
          onCtaClick={() => {}}
        />
      </div>
    </div>
  ),
};
