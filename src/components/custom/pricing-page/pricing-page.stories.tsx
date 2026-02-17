import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Bot, Phone, Hash, PhoneCall } from "lucide-react";
import { PricingPage } from "./pricing-page";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import {
  CompactCarIcon,
  SedanCarIcon,
  SuvCarIcon,
} from "../pricing-card/plan-icons";
import type { PricingCardProps } from "../pricing-card/types";
import type { PowerUpCardProps } from "../power-up-card/types";
import type { LetUsDriveCardProps } from "../let-us-drive-card/types";

// ─── Shared Data ──────────────────────────────────────────────────────────────

const tabs = [
  { label: "Team-Led Plans", value: "team" },
  { label: "Go-AI First", value: "ai" },
];

const defaultAddon = {
  icon: <Bot className="size-5 text-semantic-text-muted" />,
  text: "Add AI Agents @ \u20B910,000/agent",
};

const NumberTypeSelect = () => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-semantic-text-primary font-medium whitespace-nowrap">
      Number type:
    </span>
    <Select defaultValue="virtual">
      <SelectTrigger className="h-9 w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="virtual">Virtual</SelectItem>
        <SelectItem value="mobile">Mobile</SelectItem>
        <SelectItem value="tollfree">Toll-free</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// ─── Team-Led Plan Cards ──────────────────────────────────────────────────────

const teamMonthlyCards: PricingCardProps[] = [
  {
    planName: "Compact",
    price: "2,5000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need a WhatsApp-first plan with missed call automation",
    headerBgColor: "#d7eae9",
    planIcon: (
      <CompactCarIcon className="size-[30px] text-semantic-text-primary" />
    ),
    features: [
      "WhatsApp Campaigns (up to 5K audience)",
      "Missed Call Tracking & Alerts",
      "Shared WhatsApp Inbox",
      "Daily SMS/Email Alerts",
      "Basic performance reports",
      "1 virtual number + channel line",
    ],
    isCurrentPlan: true,
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
  {
    planName: "Sedan",
    price: "5,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For growing businesses that need scalable calling, WhatsApp campaigns, and smarter team routing.",
    headerBgColor: "#f4f0ec",
    planIcon: (
      <SedanCarIcon className="size-[30px] text-semantic-text-primary" />
    ),
    features: [
      "Everything in Compact",
      "Scalable inbound & outbound calling",
      "IVR call handling + call recording",
      "Smart call routing + sticky agent logic",
      "Team & department setup",
      "Campaign reporting & summary insights",
      "Agent availability & shift controls",
      "Shopify integration",
    ],
    ctaText: "Upgrade plan",
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
  {
    planName: "SUV",
    price: "15,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For teams that need everything in Sedan plus advanced IVR, analytics, and deep integrations.",
    headerBgColor: "#dbe2fe",
    planIcon: (
      <SuvCarIcon className="size-[30px] text-semantic-text-primary" />
    ),
    features: [
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
    ],
    showPopularBadge: true,
    ctaText: "Upgrade plan",
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    addon: defaultAddon,
  },
];

const teamYearlyCards: PricingCardProps[] = teamMonthlyCards.map((card) => ({
  ...card,
  isCurrentPlan: false,
  ctaText: "Select plan",
  onCtaClick: () => {},
}));

// ─── Go-AI First Plan Cards ───────────────────────────────────────────────────

const aiCards: PricingCardProps[] = [
  {
    planName: "AIO",
    price: "10,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end.",
    headerBgColor: "#d7eae9",
    features: [
      "AI chatbot for WhatsApp conversations",
      "AI voicebot for inbound calls",
      "Self-learning AI agents that improve with every interaction",
      "AI-led workflows across chat + voice",
      "Smart routing & intelligent handoffs",
      "Real-time analytics on AI performance",
      "API integrations & webhooks",
    ],
    onCtaClick: () => {},
    onFeatureDetails: () => {},
    usageDetails: [
      { label: "Usage", value: "Includes 2,000 AI conversations/month" },
      { label: "Extra usage", value: "\u20B98 per additional conversation" },
      { label: "Users", value: "1 user included" },
      { label: "Additional users", value: "\u20B92000/user/month" },
    ],
  },
  {
    planName: "Enterprise AI",
    price: "55,000",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For large organisations that need AI at scale with custom deployment and governance.",
    headerBgColor: "#dbe2fe",
    features: [
      { text: "Everything in AIO", bold: true },
      "Custom AI setup & architecture",
      "Enterprise data controls & governance",
      "Custom integrations & workflows",
      "Dedicated account ownership & SLAs",
      "Custom pricing & usage models",
      "API integrations & webhooks",
    ],
    onCtaClick: () => {},
    onFeatureDetails: () => {},
  },
];

// ─── Power-up Cards ───────────────────────────────────────────────────────────

const powerUpCards: PowerUpCardProps[] = [
  {
    icon: <Phone className="size-6 text-semantic-text-muted" />,
    title: "Truecaller business",
    price: "Starts @ \u20B930,000/month",
    description:
      "Leverage the power of Truecaller Business to grow your reach and reputation.",
    onCtaClick: () => {},
  },
  {
    icon: <Hash className="size-6 text-semantic-text-muted" />,
    title: "1800 Toll-free",
    price: "Starts @ \u20B9500/month",
    description:
      "Strengthen your brand accessibility with a professional 1800 line.",
    onCtaClick: () => {},
  },
  {
    icon: <PhoneCall className="size-6 text-semantic-text-muted" />,
    title: "Auto-Dialer",
    price: "Starts @ \u20B9700/user/month",
    description:
      "Available for SUV & Enterprise plans as an add-on per user.",
    onCtaClick: () => {},
  },
];

// ─── Let Us Drive Cards ───────────────────────────────────────────────────────

const letUsDriveMonthly: LetUsDriveCardProps[] = [
  {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "/one-time fee",
    description: "Cut adoption time. Start seeing ROI faster.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
  {
    title: "Account Manager",
    price: "15,000",
    period: "/per month",
    billingBadge: "Annually",
    description:
      "One expert who knows your business. And moves it forward.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
  {
    title: "Managed Services",
    price: "50,000",
    period: "/month",
    startsAt: true,
    billingBadge: "Quarterly",
    description:
      "End-to-end execution \u2014 built and run by experts.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
];

const letUsDriveYearly: LetUsDriveCardProps[] = [
  {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "/one-time fee",
    freeLabel: "FREE",
    description: "Cut adoption time. Start seeing ROI faster.",
    onShowDetails: () => {},
    onCtaClick: () => {},
  },
  letUsDriveMonthly[1],
  letUsDriveMonthly[2],
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PricingPage> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PricingPage",
  component: PricingPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Full pricing page layout that composes PricingToggle, PricingCard, PowerUpCard, LetUsDriveCard, and PageHeader into a complete plan selection experience.

Supports three states:
- **Team-Led Plans + Monthly** — 3 pricing cards with current-plan state
- **Team-Led Plans + Yearly** — 3 pricing cards with yearly pricing; onboarding shows FREE
- **Go-AI First** — 2 wider AI plan cards with usage details

## Installation

\`\`\`bash
npx myoperator-ui add pricing-page
\`\`\`

## Import

\`\`\`tsx
import { PricingPage } from "@/components/custom/pricing-page"
import type { PricingPageProps } from "@/components/custom/pricing-page"
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
      <td style="padding: 12px 16px;">Background Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Header, let-us-drive section background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Power-ups section background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F3F5F6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Section headings</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Feature comparison link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Header bottom border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Brand</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px;">Active tab pill</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PricingPage } from "@/components/custom/pricing-page";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const [activeTab, setActiveTab] = useState("team");
const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

<PricingPage
  tabs={[
    { label: "Team-Led Plans", value: "team" },
    { label: "Go-AI First", value: "ai" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showBillingToggle={activeTab === "team"}
  billingPeriod={billing}
  onBillingPeriodChange={setBilling}
  headerActions={
    <Select defaultValue="virtual">
      <SelectTrigger className="h-9 w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="virtual">Virtual</SelectItem>
        <SelectItem value="mobile">Mobile</SelectItem>
      </SelectContent>
    </Select>
  }
  planCards={activeTab === "team" ? teamCards : aiCards}
  powerUpCards={powerUps}
  letUsDriveCards={driveCards}
  onFeatureComparisonClick={() => window.open("/features")}
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

// ─── Interactive (Default) ────────────────────────────────────────────────────

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = React.useState("team");
  const [billing, setBilling] = React.useState<"monthly" | "yearly">(
    "monthly"
  );

  const isTeam = activeTab === "team";
  const isYearly = billing === "yearly";

  const planCards = isTeam
    ? isYearly
      ? teamYearlyCards
      : teamMonthlyCards
    : aiCards;

  const driveCards = isTeam && isYearly ? letUsDriveYearly : letUsDriveMonthly;

  return (
    <PricingPage
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showBillingToggle={isTeam}
      billingPeriod={billing}
      onBillingPeriodChange={setBilling}
      headerActions={<NumberTypeSelect />}
      planCards={planCards}
      powerUpCards={powerUpCards}
      onFeatureComparisonClick={() => {}}
      letUsDriveCards={driveCards}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveDemo />,
};

// ─── Team-Led Monthly ─────────────────────────────────────────────────────────

export const TeamLedMonthly: Story = {
  name: "Team-Led Plans (Monthly)",
  args: {
    tabs,
    activeTab: "team",
    showBillingToggle: true,
    billingPeriod: "monthly",
    headerActions: <NumberTypeSelect />,
    planCards: teamMonthlyCards,
    powerUpCards,
    onFeatureComparisonClick: () => {},
    letUsDriveCards: letUsDriveMonthly,
  },
};

// ─── Team-Led Yearly ──────────────────────────────────────────────────────────

export const TeamLedYearly: Story = {
  name: "Team-Led Plans (Yearly)",
  args: {
    tabs,
    activeTab: "team",
    showBillingToggle: true,
    billingPeriod: "yearly",
    headerActions: <NumberTypeSelect />,
    planCards: teamYearlyCards,
    powerUpCards,
    onFeatureComparisonClick: () => {},
    letUsDriveCards: letUsDriveYearly,
  },
};

// ─── Go-AI First ──────────────────────────────────────────────────────────────

export const GoAIFirst: Story = {
  name: "Go-AI First",
  args: {
    tabs,
    activeTab: "ai",
    showBillingToggle: false,
    headerActions: <NumberTypeSelect />,
    planCards: aiCards,
    powerUpCards,
    onFeatureComparisonClick: () => {},
    letUsDriveCards: letUsDriveMonthly,
  },
};

// ─── Plans Only (No Power-ups / Drive) ────────────────────────────────────────

export const PlansOnly: Story = {
  name: "Plans Only",
  args: {
    tabs,
    activeTab: "team",
    showBillingToggle: true,
    billingPeriod: "monthly",
    headerActions: <NumberTypeSelect />,
    planCards: teamMonthlyCards,
  },
};

// ─── Without Header Actions ───────────────────────────────────────────────────

export const WithoutHeaderActions: Story = {
  name: "Without Header Actions",
  args: {
    tabs,
    activeTab: "team",
    showBillingToggle: true,
    billingPeriod: "monthly",
    planCards: teamMonthlyCards,
    powerUpCards,
    letUsDriveCards: letUsDriveMonthly,
  },
};

// ─── Single Tab (No Toggle) ──────────────────────────────────────────────────

export const SingleTab: Story = {
  name: "Single Tab",
  args: {
    tabs: [{ label: "All Plans", value: "all" }],
    activeTab: "all",
    showBillingToggle: true,
    billingPeriod: "monthly",
    headerActions: <NumberTypeSelect />,
    planCards: teamMonthlyCards,
    powerUpCards,
    letUsDriveCards: letUsDriveMonthly,
  },
};
