import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Bot } from "lucide-react";
import { PricingCard } from "./pricing-card";
import { CompactCarIcon, SedanCarIcon, SuvCarIcon } from "./plan-icons";

const compactFeatures = [
  "WhatsApp Campaigns (up to 5K audience)",
  "Missed Call Tracking & Alerts",
  "Shared WhatsApp Inbox",
  "Daily SMS/Email Alerts",
  "Basic performance reports",
  "1 virtual number + channel line",
];

const sedanFeatures = [
  "Everything in Compact",
  "Scalable inbound & outbound calling",
  "IVR call handling + call recording",
  "Smart call routing + sticky agent logic",
  "Team & department setup",
  "Campaign reporting & summary insights",
  "Agent availability & shift controls",
  "Shopify integration",
];

const suvFeatures = [
  "Everything in Sedan",
  "Advanced IVR (multi-level, time & location-based)",
  "CRM integrations (Zoho, Freshsales, Pipedrive, etc.)",
  "Real-time dashboards & operational analytics",
  "Multi-line management + concurrent call handling",
  "Webhooks, API access & automation triggers",
  "Power dialer + call tagging",
  "BI reports & data insights",
  "Audit logs & call governance tools",
  "Premium support",
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
  text: "Add AI Agents @ \u20B910,000/agent",
};

const meta: Meta<typeof PricingCard> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PricingCard",
  component: PricingCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A pricing tier card displaying plan name, pricing, features checklist, and a CTA button. Supports multiple visual states: selectable plan, current plan (outlined button), and a "Most Popular" badge variant.

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
      <td style="padding: 12px 16px;">Plan name, price, INCLUDES header</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Description, feature text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Period label (/Month)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Feature details link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">CTA button background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Feature checkmark icons</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Card border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info 25</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-info-25</code></td>
      <td style="padding: 12px 16px;">Addon footer background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">20px (text-xl)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Price</td>
      <td style="padding: 12px 16px;">36px (text-4xl)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Period / Details</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.035px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">INCLUDES Header</td>
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
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Badge</td>
      <td style="padding: 12px 16px;">12px (text-xs)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.48px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PricingCard } from "@/components/custom/pricing-card";
import { Bot } from "lucide-react";

// Selectable plan
<PricingCard
  planName="Compact"
  price="2,5000"
  planDetails="3 Users | 12 Month plan"
  description="For small teams that need a WhatsApp-first plan"
  headerBgColor="#d7eae9"
  features={["WhatsApp Campaigns", "Missed Call Tracking"]}
  onCtaClick={() => handleSelectPlan("compact")}
  onFeatureDetails={() => openFeatureModal("compact")}
  addon={{
    icon: <Bot className="size-5 text-semantic-text-muted" />,
    text: "Add AI Agents @ \u20B910,000/agent",
  }}
/>

// Current plan
<PricingCard
  planName="Compact"
  price="2,5000"
  isCurrentPlan
  headerBgColor="#d7eae9"
  features={["WhatsApp Campaigns"]}
/>

// Most popular plan
<PricingCard
  planName="SUV"
  price="15,000"
  showPopularBadge
  headerBgColor="#dbe2fe"
  ctaText="Upgrade plan"
  features={["Everything in Sedan", "Advanced IVR"]}
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

// ─── Default: Selectable Plan ────────────────────────────────────────────

const singleCardDecorator = (Story: React.ComponentType) => (
  <div style={{ width: "340px" }}>
    <Story />
  </div>
);

export const Default: Story = {
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,5000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need a WhatsApp-first plan with missed call automation",
    headerBgColor: "#d7eae9",
    planIcon: <CompactCarIcon className="size-[30px] text-semantic-text-primary" />,
    features: compactFeatures,
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
};

// ─── Current Plan ────────────────────────────────────────────────────────

export const CurrentPlan: Story = {
  name: "Current Plan",
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,5000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need a WhatsApp-first plan with missed call automation",
    headerBgColor: "#d7eae9",
    planIcon: <CompactCarIcon className="size-[30px] text-semantic-text-primary" />,
    features: compactFeatures,
    isCurrentPlan: true,
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
};

// ─── Sedan: Upgrade Plan ─────────────────────────────────────────────────

export const Sedan: Story = {
  name: "Sedan (Upgrade)",
  decorators: [singleCardDecorator],
  args: {
    planName: "Sedan",
    price: "5,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For growing businesses that need scalable calling, WhatsApp campaigns, and smarter team routing.",
    headerBgColor: "#f4f0ec",
    planIcon: <SedanCarIcon className="size-[30px] text-semantic-text-primary" />,
    features: sedanFeatures,
    ctaText: "Upgrade plan",
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
};

// ─── SUV: Most Popular ───────────────────────────────────────────────────

export const MostPopular: Story = {
  name: "SUV (Most Popular)",
  decorators: [singleCardDecorator],
  args: {
    planName: "SUV",
    price: "15,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For teams that need everything in Sedan plus advanced IVR, analytics, and deep integrations.",
    headerBgColor: "#dbe2fe",
    planIcon: <SuvCarIcon className="size-[30px] text-semantic-text-primary" />,
    features: suvFeatures,
    showPopularBadge: true,
    ctaText: "Upgrade plan",
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
};

// ─── AIO ─────────────────────────────────────────────────────────────────

export const AIO: Story = {
  name: "AIO",
  decorators: [singleCardDecorator],
  args: {
    planName: "AIO",
    price: "10,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end.",
    headerBgColor: "#dbe8fe",
    features: aioFeatures,
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    usageDetails: aioUsageDetails,
  },
};

// ─── Enterprise AI ──────────────────────────────────────────────────────

export const EnterpriseAI: Story = {
  name: "Enterprise AI",
  decorators: [singleCardDecorator],
  args: {
    planName: "Enterprise AI",
    price: "55,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For large organisations that need AI at scale with custom deployment and governance.",
    headerBgColor: "#e0dffe",
    features: enterpriseFeatures,
    onCtaClick: () => {},
    onFeatureDetails: () => {},
  },
};

// ─── Traditional Plans (Compact, Sedan, SUV) ────────────────────────────

export const TraditionalPlans: Story = {
  name: "Traditional Plans",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-6 items-start" style={{ width: "1080px" }}>
      <PricingCard
        className="flex-1"
        planName="Compact"
        price="2,5000"
        planDetails="3 Users | 12 Month plan"
        description="For small teams that need a WhatsApp-first plan with missed call automation"
        headerBgColor="#d7eae9"
        planIcon={<CompactCarIcon className="size-[30px] text-semantic-text-primary" />}
        features={compactFeatures}
        isCurrentPlan
        onFeatureDetails={() => {}}
        addon={defaultAddon}
      />
      <PricingCard
        className="flex-1"
        planName="Sedan"
        price="5,000"
        planDetails="3 Users | 12 Month plan"
        description="For growing businesses that need scalable calling, WhatsApp campaigns, and smarter team routing."
        headerBgColor="#f4f0ec"
        planIcon={<SedanCarIcon className="size-[30px] text-semantic-text-primary" />}
        features={sedanFeatures}
        ctaText="Upgrade plan"
        onCtaClick={() => {}}
        onFeatureDetails={() => {}}
        addon={defaultAddon}
      />
      <PricingCard
        className="flex-1"
        planName="SUV"
        price="15,000"
        planDetails="3 Users | 12 Month plan"
        description="For teams that need everything in Sedan plus advanced IVR, analytics, and deep integrations."
        headerBgColor="#dbe2fe"
        planIcon={<SuvCarIcon className="size-[30px] text-semantic-text-primary" />}
        features={suvFeatures}
        showPopularBadge
        ctaText="Upgrade plan"
        onCtaClick={() => {}}
        onFeatureDetails={() => {}}
        addon={defaultAddon}
      />
    </div>
  ),
};

// ─── AI Plans (AIO, Enterprise AI) ──────────────────────────────────────

export const AIPlans: Story = {
  name: "AI Plans",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-6 items-start" style={{ width: "720px" }}>
      <PricingCard
        className="flex-1"
        planName="AIO"
        price="10,000"
        planDetails="3 Users | 12 Month plan"
        description="For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end."
        headerBgColor="#dbe8fe"
        features={aioFeatures}
        onCtaClick={() => {}}
        onFeatureDetails={() => {}}
        usageDetails={aioUsageDetails}
      />
      <PricingCard
        className="flex-1"
        planName="Enterprise AI"
        price="55,000"
        planDetails="3 Users | 12 Month plan"
        description="For large organisations that need AI at scale with custom deployment and governance."
        headerBgColor="#e0dffe"
        features={enterpriseFeatures}
        onCtaClick={() => {}}
        onFeatureDetails={() => {}}
      />
    </div>
  ),
};

// ─── Without Features ────────────────────────────────────────────────────

export const WithoutFeatures: Story = {
  name: "Without Features",
  decorators: [singleCardDecorator],
  args: {
    planName: "Compact",
    price: "2,5000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need a WhatsApp-first plan with missed call automation",
    headerBgColor: "#d7eae9",
    features: [],
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
};

// ─── Without Addon ───────────────────────────────────────────────────────

export const WithoutAddon: Story = {
  name: "Without Addon",
  decorators: [singleCardDecorator],
  args: {
    planName: "Sedan",
    price: "5,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For growing businesses that need scalable calling, WhatsApp campaigns, and smarter team routing.",
    headerBgColor: "#f4f0ec",
    features: sedanFeatures,
    ctaText: "Upgrade plan",
    onCtaClick: () => {},
    onFeatureDetails: () => {},
  },
};

// ─── Minimal ─────────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: "Minimal (Name + Price only)",
  decorators: [singleCardDecorator],
  args: {
    planName: "Basic",
    price: "999",
    onCtaClick: () => {},
  },
};
