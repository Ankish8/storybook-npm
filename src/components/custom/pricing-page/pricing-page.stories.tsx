import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { Hash, PhoneCall, Shield } from "lucide-react";
import { PricingPage } from "./pricing-page";
import type { PricingPlanAlertConfig } from "./types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import type { PricingCardProps } from "../pricing-card/types";
import type { PowerUpCardProps } from "../power-up-card/types";
import type { LetUsDriveCardProps } from "../let-us-drive-card/types";

// ─── Shared Data ──────────────────────────────────────────────────────────────

const defaultAddon = {
  text: "Add AI Agents @ ₹10,000/agent",
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

const teamCards: PricingCardProps[] = [
  {
    planName: "Compact",
    price: "2,500",
    period: "per month",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: [
      "WhatsApp Campaigns (up to 5K audience)",
      "Missed Call Tracking & Alerts",
      "Shared WhatsApp Inbox",
      "Daily SMS/Email Alerts",
      "Basic performance reports",
      "1 virtual number + channel line",
    ],
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
  {
    planName: "Sedan",
    price: "5,000",
    period: "per month",
    planDetails: "10 Users | 12 Month plan",
    description:
      "For growing businesses that need more users & unlimited IVR+ calling.",
    features: [
      { parts: [{ text: "Everything in " }, { text: "Compact", bold: true }] },
      "Scalable inbound & outbound calling",
      "IVR call handling + call recording",
      "Smart call routing + sticky agent logic",
      "Team & department setup",
      "Campaign reporting & summary insights",
      "Agent availability & shift controls",
      "Shopify integration",
      "Testing",
    ],
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
  {
    planName: "SUV",
    price: "15,000",
    period: "per month",
    planDetails: "10 Users | 12 Month plan",
    description:
      "For teams that also need performance analytics and integrations.",
    showPopularBadge: true,
    features: [
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
    ],
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: defaultAddon,
  },
];

// ─── Go-AI First Plan Cards ───────────────────────────────────────────────────

const aiCards: PricingCardProps[] = [
  {
    planName: "AIO",
    price: "10,000",
    planDetails: "10 Users",
    description:
      "For teams that want a self-learning AI system to run WhatsApp, Calls, and workflows end-to-end.",
    features: [
      "AI chatbot for WhatsApp conversations",
      "AI voicebot for inbound calls",
      "Self-learning AI agents that improve with every interaction",
      "AI-led workflows across chat + voice",
      "Smart routing & intelligent handoffs",
      "Real-time analytics on AI performance",
      "API integrations & webhooks",
    ],
    onCtaClick: fn(),
    onFeatureDetails: fn(),
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
    planDetails: "10 Users",
    description:
      "For large organisations that need AI at scale with custom deployment and governance.",
    features: [
      { text: "Everything in AIO", bold: true },
      "Custom AI setup & architecture",
      "Enterprise data controls & governance",
      "Custom integrations & workflows",
      "Dedicated account ownership & SLAs",
      "Custom pricing & usage models",
      "API integrations & webhooks",
    ],
    onCtaClick: fn(),
    onFeatureDetails: fn(),
  },
];

// ─── Power-up Cards ───────────────────────────────────────────────────────────

const powerUpCards: PowerUpCardProps[] = [
  {
    icon: <Shield className="size-6 text-semantic-text-primary" />,
    title: "Truecaller business",
    price: "Starts @ \u20B930,000/month",
    description:
      "Leverage the power of Truecaller Business to grow your reach and reputation.",
    onCtaClick: fn(),
  },
  {
    icon: <Hash className="size-6 text-semantic-text-muted" />,
    title: "1800 Toll-free",
    price: "Starts @ \u20B9500/month",
    description:
      "Strengthen your brand accessibility with a professional 1800 line.",
    onCtaClick: fn(),
  },
  {
    icon: <PhoneCall className="size-6 text-semantic-text-muted" />,
    title: "Auto-Dialer",
    price: "Starts @ \u20B9700/user/month",
    description:
      "Available for SUV & Enterprise plans as an add-on per user.",
    onCtaClick: fn(),
  },
];

// ─── Let Us Drive Cards ───────────────────────────────────────────────────────

const letUsDriveCards: LetUsDriveCardProps[] = [
  {
    title: "Dedicated Onboarding",
    price: "20,000",
    period: "one-time fee",
    description: "Cut adoption time. Start seeing ROI faster.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    title: "Account Manager",
    price: "15,000",
    period: "per month, billed annually",
    billingBadge: "Annually",
    description:
      "One expert who knows your business. And moves it forward.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    title: "Managed Services",
    price: "50,000",
    period: "per month, billed quarterly",
    startsAt: true,
    billingBadge: "Quarterly",
    description:
      "End-to-end execution \u2014 built and run by experts.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
];

const onboardingDetailsContent = {
  heading: "Includes:",
  items: [
    {
      title: "Start Your Channels:",
      description:
        "Get help setting up your Call and WhatsApp channels.",
    },
    {
      title: "Set Up Your Agent:",
      description:
        "We'll help you activate your first Chat or Voice Agent.",
    },
    {
      title: "Begin Training:",
      description:
        "10 hours of personalised training on the dashboard, agent setup, and campaign management.",
    },
  ],
};

const accountManagerDetailsContent = {
  heading: "Includes:",
  items: [
    {
      title: "Your Personal Manager:",
      description:
        "A single point of contact for all your strategy and tech questions.",
    },
    {
      title: "Proactive Monitoring:",
      description:
        "We monitor your system proactively to catch problems early.",
    },
    {
      title: "Hands-On Support:",
      description:
        "Guided troubleshooting for automation logic, agent actions, and linked platforms.",
    },
    {
      title: "Priority Escalation:",
      description:
        "Critical issues get top priority across calls, chats, and more.",
    },
  ],
};

const managedServicesDetailsContent = {
  heading: "Includes:",
  items: [
    {
      title: "Advanced Agents:",
      description:
        "Custom Chat & Voice agents for lead capture, support, and engagement.",
    },
    {
      title: "Custom Workflows:",
      description:
        "Automated WhatsApp campaigns, sales, follow-ups, reminders, and more.",
    },
    {
      title: "Seamless Integration:",
      description:
        "Connect easily with your existing business tools.",
    },
    {
      title: "Weekly Performance Calls:",
      description:
        "Stay aligned and on track through regular check-ins.",
    },
  ],
};

const letUsDriveCardsWithDetails: LetUsDriveCardProps[] = [
  {
    ...letUsDriveCards[0],
    detailsContent: onboardingDetailsContent,
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    ...letUsDriveCards[1],
    detailsContent: accountManagerDetailsContent,
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    ...letUsDriveCards[2],
    detailsContent: managedServicesDetailsContent,
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
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
Full pricing page layout that composes PricingCard, PowerUpCard, LetUsDriveCard, and PageHeader into a complete plan selection experience.

Displays pricing cards in a responsive grid (1 column on mobile, 2 from \`sm\`, up to 4 in one row from \`xl\` for four plans) with power-ups and let-us-drive sections below. Column count follows \`planCards.length\`; optional \`planCardColumnCount\` can reserve extra columns (rare).

Optional **\`planAlert\`** renders the design-system **Alert** above the plan grid (\`title\`, optional \`description\`). Set appearance with **\`variant\`** (same values as \`<Alert variant />\` — e.g. \`info\`, \`warning\`, \`error\`) or with **\`status\`** (\`success\` | \`warning\` | \`info\` | \`failed\`; \`failed\` → error). If both are set, **\`variant\` wins**. Pass **\`alertProps\`** for closable, \`onClose\`, \`icon\`, \`action\`, etc. Use **\`showPlanAlert={false}\`** to hide the banner while keeping \`planAlert\` defined.

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
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PricingPage } from "@/components/custom/pricing-page";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

<PricingPage
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
  planAlert={{
    status: "warning",
    title: "Custom Plan Active",
    description: "You're on an enterprise plan. Contact support to change seats.",
  }}
  planCards={teamCards}
  planCardCtaStates={[
    { disabled: true },
    { loading: false },
    { disabled: false },
  ]}
  powerUpCards={powerUps}
  letUsDriveCards={driveCards}
  onFeatureComparisonClick={() => window.open("/features")}
/>
\`\`\`

**Plan card CTA states** — Use \`planCardCtaStates\` to control loading/disabled for each pricing card button (index matches \`planCards\`). Overrides \`ctaLoading\`/\`ctaDisabled\` on individual card props when provided.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    planAlert: {
      description:
        "Banner above plan cards (shared Alert). Prefer `variant` to mirror Alert API, or `status` for semantic mapping; optional `alertProps` for closable/actions.",
      control: "object",
    },
    showPlanAlert: {
      description:
        "When false, hides the plan-area alert; keep `planAlert` for easy toggling.",
      control: "boolean",
    },
  },
  args: {
    onCtaClick: fn(),
    onFeatureComparisonClick: fn(),
    onFeatureDetails: fn(),
    onShowDetails: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

/** Example banner matching Figma (1119:2783) — info-style “Custom plan active” message. */
const exampleCustomPlanAlert: PricingPlanAlertConfig = {
  title: "Custom Plan Active",
  description:
    "You're currently on a tailored enterprise plan. To make changes or explore standard plans, please connect with your account manager.",
  variant: "info",
};

export const Default: Story = {
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: teamCards,
    planAlert: exampleCustomPlanAlert,
    powerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: letUsDriveCards,
  },
};

/** Canvas + copy aligned with Figma 1119:2783 and production “Lite” plan row (4-up on xl). */
export const FigmaSelectBusinessPlan: Story = {
  name: "Figma (1119:2783) – Select business plan",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/IRVvk2LxmE8c3XgGDo7wsK/MyO---Product-Design?node-id=1119-2783",
    },
  },
  decorators: [
    (Story) => (
      <div
        className="box-border min-h-screen w-full bg-semantic-bg-ui p-0"
        data-testid="story-pricing-canvas"
      >
        <Story />
      </div>
    ),
  ],
  args: {
    showCategoryToggle: false,
    showBillingToggle: false,
    headerActions: <NumberTypeSelect />,
    planAlert: {
      title: "Custom Plan Active",
      description:
        "You're currently on a tailored enterprise plan. To make changes or explore standard plans, please connect with your account manager.",
      variant: "info" as const,
    },
    planCards: [
      {
        planName: "Lite- 1C",
        price: "1,150",
        period: "per month",
        planDetails: "6 Users | 12 Month plan",
        features: [],
        onCtaClick: fn(),
        onFeatureDetails: fn(),
        addon: defaultAddon,
      },
      {
        planName: "Lite- 2C",
        price: "2,150",
        period: "per month",
        planDetails: "6 Users | 12 Month plan",
        features: [],
        onCtaClick: fn(),
        onFeatureDetails: fn(),
        addon: defaultAddon,
      },
      {
        planName: "Lite- 3C",
        price: "3,150",
        period: "per month",
        planDetails: "6 Users | 12 Month plan",
        features: [],
        onCtaClick: fn(),
        onFeatureDetails: fn(),
        addon: defaultAddon,
      },
      {
        planName: "Lite- 5C",
        price: "5,150",
        period: "per month",
        planDetails: "6 Users | 12 Month plan",
        showPopularBadge: true,
        badgeText: "Most Popular",
        features: [],
        onCtaClick: fn(),
        onFeatureDetails: fn(),
        addon: defaultAddon,
      },
    ],
    powerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: letUsDriveCards,
  },
};

// ─── Go-AI First Cards ───────────────────────────────────────────────────────

export const GoAIFirst: Story = {
  name: "Go-AI First",
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: aiCards,
    planAlert: exampleCustomPlanAlert,
    powerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: letUsDriveCards,
  },
};

/** All `planAlert.status` values: success, warning, info, failed. */
export const PlanAlertsAllStatuses: Story = {
  name: "Plan alerts (success, warning, info, failed)",
  render: () => (
    <div className="flex flex-col gap-16 bg-card p-6">
      <div>
        <p className="m-0 mb-2 text-sm font-medium text-semantic-text-secondary">
          success
        </p>
        <PricingPage
          className="min-h-0 rounded-lg border border-semantic-border-layout overflow-hidden"
          headerActions={<NumberTypeSelect />}
          planCards={teamCards}
          planAlert={{
            status: "success",
            title: "Payment updated",
            description: "Your plan will renew on the next billing date with the new card.",
          }}
        />
      </div>
      <div>
        <p className="m-0 mb-2 text-sm font-medium text-semantic-text-secondary">
          warning
        </p>
        <PricingPage
          className="min-h-0 rounded-lg border border-semantic-border-layout overflow-hidden"
          headerActions={<NumberTypeSelect />}
          planCards={teamCards}
          planAlert={{
            status: "warning",
            title: "Custom Plan Active",
            description:
              "You're currently on a tailored enterprise plan. Changes may require sales approval.",
          }}
        />
      </div>
      <div>
        <p className="m-0 mb-2 text-sm font-medium text-semantic-text-secondary">
          info
        </p>
        <PricingPage
          className="min-h-0 rounded-lg border border-semantic-border-layout overflow-hidden"
          headerActions={<NumberTypeSelect />}
          planCards={teamCards}
          planAlert={{
            status: "info",
            title: "Prices shown exclude taxes",
            description: "Taxes are calculated at checkout based on your billing address.",
          }}
        />
      </div>
      <div>
        <p className="m-0 mb-2 text-sm font-medium text-semantic-text-secondary">
          failed
        </p>
        <PricingPage
          className="min-h-0 rounded-lg border border-semantic-border-layout overflow-hidden"
          headerActions={<NumberTypeSelect />}
          planCards={teamCards}
          planAlert={{
            status: "failed",
            title: "Could not load plan pricing",
            description: "Refresh the page or try again in a few minutes.",
          }}
        />
      </div>
    </div>
  ),
};

// ─── Plans Only (No Power-ups / Drive) ────────────────────────────────────────

export const PlansOnly: Story = {
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: teamCards,
  },
};

/** Four team-style plans in one row — column count follows array length. */
export const FourPlansOneRow: Story = {
  name: "Four plans (single row)",
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: [
      ...teamCards,
      {
        planName: "Enterprise",
        price: "25,000",
        period: "per month",
        planDetails: "Unlimited users | Custom term",
        description:
          "For organisations that need custom limits, security, and dedicated support.",
        features: [
          {
            parts: [{ text: "Everything in " }, { text: "SUV", bold: true }],
          },
          "Dedicated success team",
          "Custom SLAs & security reviews",
          "Volume pricing & invoicing",
        ],
        onCtaClick: fn(),
        onFeatureDetails: fn(),
        addon: defaultAddon,
      },
    ],
  },
};

// ─── Without Header Actions ───────────────────────────────────────────────────

export const WithoutHeaderActions: Story = {
  args: {
    planCards: teamCards,
    powerUpCards,
    letUsDriveCards: letUsDriveCards,
  },
};

// ─── Plan Card CTAs: Loading & Disabled ───────────────────────────────────────

export const PlanCardCtaStates: Story = {
  name: "Plan Card CTAs: Loading & Disabled",
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: teamCards,
    planCardCtaStates: [
      { disabled: true },
      { loading: true },
      { disabled: false },
    ],
    powerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: letUsDriveCards,
  },
};

// ─── Full page with Let Us Drive details ─────────────────────────────────────

export const FullPageWithLetUsDriveDetails: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full pricing page with expandable details on the Let us drive cards. Each card manages its own expand/collapse independently.",
      },
    },
  },
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: teamCards,
    powerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: letUsDriveCardsWithDetails,
  },
};
