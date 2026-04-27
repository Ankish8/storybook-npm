import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { Bot } from "lucide-react";
import { PricingCard } from "./pricing-card";

const compactFeatures = [
  "WhatsApp Campaigns (up to 5K audience)",
  "Missed Call Tracking & Alerts",
  "Shared WhatsApp Inbox",
  "Daily SMS/Email Alerts",
  "Basic performance reports",
  "1 virtual number + channel line",
];

const sedanFeatures = [
  { parts: [{ text: "Everything in " }, { text: "Compact", bold: true }] },
  "Scalable inbound & outbound calling",
  "IVR call handling + call recording",
  "Smart call routing + sticky agent logic",
  "Team & department setup",
  "Campaign reporting & summary insights",
  "Agent availability & shift controls",
  "Shopify integration",
  "Testing",
];

const suvFeatures = [
  { parts: [{ text: "Everything in " }, { text: "Sedan", bold: true }] },
  "Advanced IVR (multi-level, time & location-based)",
  "CRM integrations (Zoho, Freshsales, Pipedrive, etc.)",
  "Real-time dashboards & operational analytics",
  "Multi-line management + concurrent call handling",
  "Webhooks, API access & automation triggers",
  "Power dialer + call tagging",
  "BI reports & data insights",
  "Audit logs & call governance tools",
  { parts: [{ text: "Premium " }, { text: "Support", bold: true }] },
];

const aioFeatures = [
  "AI chatbot for WhatsApp conversations",
  "AI voicebot for inbound calls",
  "Self-learning AI agents that improve with every interaction",
  "AI-led workflows across chat + voice",
  "Smart routing & intelligent handoffs",
  "Real-time analytics on AI performance",
  "API integrations & webhooks",
];

const enterpriseFeatures: (string | { text: string; bold?: boolean })[] = [
  { text: "Everything in AIO", bold: true },
  "Custom AI setup & architecture",
  "Enterprise data controls & governance",
  "Custom integrations & workflows",
  "Dedicated account ownership & SLAs",
  "Custom pricing & usage models",
  "API integrations & webhooks",
];

const aioUsageDetails = [
  { label: "Usage", value: "Includes 2,000 AI conversations/month" },
  { label: "Extra usage", value: "₹8 per additional conversation" },
  { label: "Users", value: "1 user included" },
  { label: "Additional users", value: "₹2000/user/month" },
];

const defaultAddon = {
  icon: <Bot className="size-5 text-semantic-text-muted" />,
  text: "Add AI Agents @₹10,000/agent",
};

const meta: Meta<typeof PricingCard> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PricingCard",
  component: PricingCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A pricing tier card displaying plan name, pricing, features checklist, and a CTA button. Supports multiple visual states: selectable plan, current plan (outlined disabled button), and a "Most Popular" badge variant (full-width blue banner with blue border + shadow).

Used in the Plan & Pricing page to display plan options like Compact, Sedan, and SUV.

## Installation

\`\`\`bash
npx myoperator-ui add pricing-card
\`\`\`

## Import

\`\`\`tsx
import { PricingCard } from "@/components/custom/pricing-card"
import type { PricingCardProps, PricingCardAddon } from "@/components/custom/pricing-card"
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
      <td style="padding: 12px 16px;">Plan name, price</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Description, features, Includes header, plan details</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Period label (per month, billed yearly)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Check feature details link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Popular CTA button, addon text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Card border, features separator, addon separator</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Popular Banner</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">#4275D6</code></td>
      <td style="padding: 12px 16px;">Popular badge bar background, popular card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Plan Name</td>
      <td style="padding: 12px 16px;">24px (text-2xl)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Price</td>
      <td style="padding: 12px 16px;">36px (text-4xl)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Rupee Symbol</td>
      <td style="padding: 12px 16px;">36px (text-4xl)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Period / Plan Details</td>
      <td style="padding: 12px 16px;">14px / 16px</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Includes: Header</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.014px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Feature Text</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PricingCard } from "@/components/custom/pricing-card";

// Selectable plan
<PricingCard
  planName="Compact"
  price="2,500"
  planDetails="10 Users"
  description="For small teams that need WhatsApp Business API & missed calls."
  features={["WhatsApp Campaigns", "Missed Call Tracking"]}
  onCtaClick={() => handleSelectPlan("compact")}
  onFeatureDetails={() => openFeatureModal("compact")}
  addon={{ text: "Add AI Agents @₹10,000/agent" }}
/>

// Current plan
<PricingCard
  planName="Compact"
  price="2,500"
  planDetails="10 Users"
  isCurrentPlan
  features={["WhatsApp Campaigns"]}
/>

// Most popular plan (full-width blue banner + blue border)
<PricingCard
  planName="Sedan"
  price="5,000"
  planDetails="10 Users"
  showPopularBadge
  features={["Everything in Compact", "Scalable calling"]}
  addon={{ text: "Add AI Agents @₹10,000/agent" }}
/>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onCtaClick: fn(),
    onFeatureDetails: fn(),
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["default", "featured"],
      description:
        "Card layout treatment. `featured` uses a two-pane summary + actions arrangement.",
      table: {
        type: { summary: '"default" | "featured"' },
        defaultValue: { summary: "default" },
      },
    },
    infoText: {
      control: "text",
      description:
        "Informational text shown below the CTA button (e.g., package change effective date).",
    },
    ctaLoading: {
      control: "boolean",
      description: "Show loading spinner on CTA button and make it non-interactive.",
    },
    ctaDisabled: {
      control: "boolean",
      description: "Disable the CTA button (e.g. current plan or pending action).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default: Selectable Plan ────────────────────────────────────────────

const singleCardDecorator = (Story: React.ComponentType) => (
  <div style={{ width: "347px" }}>
    <Story />
  </div>
);

export const Default: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,500",
    planDetails: "10 Users",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: compactFeatures,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

export const FeaturedLayout: Story = {
  name: "Featured layout",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ width: "760px" }}>
      <PricingCard
        planName="Compact"
        price="2,500"
        period="per month"
        planDetails="3 Users | 12 Month plan"
        description="For small teams that need WhatsApp Business API & missed calls."
        features={compactFeatures}
        layout="featured"
        onCtaClick={fn()}
        onFeatureDetails={fn()}
        addon={defaultAddon}
      />
    </div>
  ),
};

// ─── Current Plan ────────────────────────────────────────────────────────

export const CurrentPlan: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,500",
    planDetails: "10 Users",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: compactFeatures,
    isCurrentPlan: true,
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── CTA Loading ────────────────────────────────────────────────────────

export const CtaLoading: Story = {
  name: "CTA Loading",
  decorators: [singleCardDecorator],
  args: {
    planName: "SUV",
    price: "15,000",
    planDetails: "10 Users",
    description:
      "For teams that also need performance analytics and integrations.",
    features: suvFeatures.slice(0, 4),
    ctaLoading: true,
    showPopularBadge: true,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── CTA Disabled ───────────────────────────────────────────────────────

export const CtaDisabled: Story = {
  name: "CTA Disabled",
  decorators: [singleCardDecorator],
  args: {
    planName: "SUV",
    price: "15,000",
    planDetails: "10 Users",
    description:
      "For teams that also need performance analytics and integrations.",
    features: suvFeatures.slice(0, 4),
    ctaDisabled: true,
    showPopularBadge: true,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── With Info Text ─────────────────────────────────────────────────────

export const WithInfoText: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,500",
    planDetails: "10 Users",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: compactFeatures,
    isCurrentPlan: true,
    onFeatureDetails: fn(),
    addon: defaultAddon,
    infoText: "Your package change will be effective from 23-03-2026",
  },
};

// ─── Sedan: Most Popular ─────────────────────────────────────────────────

export const MostPopular: Story = {
  name: "SUV (Most Popular)",
  decorators: [singleCardDecorator],
  args: {
    planName: "SUV",
    price: "15,000",
    planDetails: "10 Users",
    description:
      "For teams that also need performance analytics and integrations.",
    features: suvFeatures,
    showPopularBadge: true,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── SUV ────────────────────────────────────────────────────────────────

export const SUV: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "SUV",
    price: "15,000",
    planDetails: "10 Users",
    description:
      "For teams that also need performance analytics and integrations.",
    features: suvFeatures,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── AIO ─────────────────────────────────────────────────────────────────

export const AIO: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "AIO",
    price: "10,000",
    planDetails: "10 Users",
    description:
      "For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end.",
    features: aioFeatures,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    usageDetails: aioUsageDetails,
  },
};

// ─── Enterprise AI ──────────────────────────────────────────────────────

export const EnterpriseAI: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Enterprise AI",
    price: "55,000",
    planDetails: "10 Users",
    description:
      "For large organisations that need AI at scale with custom deployment and governance.",
    features: enterpriseFeatures,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
  },
};

// ─── Traditional Plans (Compact, Sedan, SUV) ────────────────────────────

export const TraditionalPlans: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-8 items-start" style={{ width: "1080px" }}>
      <PricingCard
        className="flex-1"
        planName="Compact"
        price="2,500"
        planDetails="10 Users"
        description="For small teams that need WhatsApp Business API & missed calls."
        features={compactFeatures}
        isCurrentPlan
        onFeatureDetails={fn()}
        addon={defaultAddon}
      />
      <PricingCard
        className="flex-1"
        planName="Sedan"
        price="5,000"
        planDetails="10 Users"
        description="For growing businesses that need more users & unlimited IVR+ calling."
        features={sedanFeatures}
        onCtaClick={fn()}
        onFeatureDetails={fn()}
        addon={defaultAddon}
      />
      <PricingCard
        className="flex-1"
        planName="SUV"
        price="15,000"
        planDetails="10 Users"
        description="For teams that also need performance analytics and integrations."
        features={suvFeatures}
        showPopularBadge
        onCtaClick={fn()}
        onFeatureDetails={fn()}
        addon={defaultAddon}
      />
    </div>
  ),
};

// ─── AI Plans (AIO, Enterprise AI) ──────────────────────────────────────

export const AIPlans: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-8 items-start" style={{ width: "720px" }}>
      <PricingCard
        className="flex-1"
        planName="AIO"
        price="10,000"
        planDetails="10 Users"
        description="For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end."
        features={aioFeatures}
        onCtaClick={fn()}
        onFeatureDetails={fn()}
        usageDetails={aioUsageDetails}
      />
      <PricingCard
        className="flex-1"
        planName="Enterprise AI"
        price="55,000"
        planDetails="10 Users"
        description="For large organisations that need AI at scale with custom deployment and governance."
        features={enterpriseFeatures}
        onCtaClick={fn()}
        onFeatureDetails={fn()}
      />
    </div>
  ),
};

// ─── Without Features ────────────────────────────────────────────────────

export const WithoutFeatures: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,500",
    planDetails: "10 Users",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: [],
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
};

// ─── Without Addon ───────────────────────────────────────────────────────

export const WithoutAddon: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Sedan",
    price: "5,000",
    planDetails: "10 Users",
    description:
      "For growing businesses that need more users & unlimited IVR+ calling.",
    features: sedanFeatures,
    showPopularBadge: true,
    onCtaClick: fn(),
    onFeatureDetails: fn(),
  },
};

// ─── Minimal ─────────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: "Minimal (Name + Price only)",
  decorators: [singleCardDecorator],
  args: {
    planName: "Basic",
    price: "999",
    onCtaClick: fn(),
  },
};
