import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { ChevronsDown, Hash, Phone, PhoneCall, Shield } from "lucide-react";
import { Button } from "../../ui/button";
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

/** Mock “number type” control used by pricing page examples. */
const numberTypeControl = (
  <div className="flex items-center gap-2.5">
    <span className="whitespace-nowrap text-sm text-semantic-text-primary">
      Number Type:
    </span>
    <Button
      type="button"
      variant="outline"
      className="h-10 w-[9rem] justify-between gap-2 rounded border-semantic-border-layout px-4 py-1 text-sm font-semibold text-semantic-text-primary"
    >
      <span>Virtual</span>
      <ChevronsDown className="size-5 shrink-0 opacity-70" aria-hidden />
    </Button>
  </div>
);

const figmaCompactFeatures = [
  "WhatsApp Campaigns (up to 5K audience)",
  "Missed Call Tracking & Alerts",
  "Shared WhatsApp Inbox",
  "Daily SMS/Email Alerts",
  "Basic performance reports",
  "1 virtual number + channel line",
];

const figmaSedanFeatures: PricingCardProps["features"] = [
  { parts: [{ text: "Everything in " }, { text: "Compact", bold: true }] },
  "Scalable inbound & outbound calling",
  "IVR call handling + call recording",
  "Smart call routing + sticky agent logic",
  "Team & department setup",
  "Campaign reporting & summary insights",
  "Agent availability & shift controls",
  "Shopify integration",
];

const figmaSuvFeatures: PricingCardProps["features"] = [
  { parts: [{ text: "Everything in " }, { text: "Sedan", bold: true }] },
  "Advanced analytics & custom dashboards",
  "Audit logs & call governance tools",
  { parts: [{ text: "Premium " }, { text: "Support", bold: true }] },
];

const figmaPlanAddon = { text: "Add AI Agents @₹10,000/agent" };

const figmaBasePlanCards: PricingCardProps[] = [
  {
    planName: "Compact",
    price: "2,500",
    period: "per month",
    planDetails: "3 Users | 12 Month plan",
    description:
      "For small teams that need WhatsApp Business API & missed calls.",
    features: figmaCompactFeatures,
    ctaText: "Upgrade",
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: figmaPlanAddon,
  },
  {
    planName: "Sedan",
    price: "5,000",
    period: "per month",
    planDetails: "10 Users | 12 Month plan",
    description:
      "For growing businesses that need more users & unlimited IVR+ calling.",
    features: figmaSedanFeatures,
    ctaText: "Upgrade",
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: figmaPlanAddon,
  },
  {
    planName: "SUV",
    price: "9,000",
    period: "per month",
    planDetails: "20 Users | 12 Month plan",
    description: "For established teams with advanced use cases and scale.",
    features: figmaSuvFeatures,
    showPopularBadge: true,
    badgeText: "Most Popular",
    ctaText: "Downgrade",
    onCtaClick: fn(),
    onFeatureDetails: fn(),
    addon: figmaPlanAddon,
  },
];

const figmaEnterprisePlanCard: PricingCardProps = {
  planName: "Enterprise",
  price: "15,000",
  period: "per month",
  planDetails: "50 Users | 12 Month plan",
  description: "For large orgs with advanced needs.",
  features: [
    { parts: [{ text: "Everything in " }, { text: "SUV", bold: true }] },
    "Dedicated success manager",
    "Custom contracts & security reviews",
  ],
  ctaText: "Upgrade",
  onCtaClick: fn(),
  onFeatureDetails: fn(),
  addon: figmaPlanAddon,
};

const figmaPowerUpCards: PowerUpCardProps[] = [
  {
    icon: <Shield className="size-6 text-semantic-text-primary" />,
    title: "Truecaller business",
    price: "Starts @ ₹30,000/month",
    description:
      "Leverage the power of Truecaller Business to grow your reach and reputation.",
    onCtaClick: fn(),
  },
  {
    icon: <Hash className="size-6 text-semantic-text-primary" />,
    title: "1800 Toll-free",
    price: "Starts @ ₹500/month",
    description:
      "Strengthen your brand accessibility with a professional 1800 line.",
    onCtaClick: fn(),
  },
  {
    icon: <Phone className="size-6 text-semantic-text-primary" />,
    title: "Auto-Dialer",
    price: "Starts @ ₹700/user/month",
    description: "Available for SUV & Enterprise plans as an add-on per user.",
    onCtaClick: fn(),
  },
];

const figmaLetUsDriveCards: LetUsDriveCardProps[] = [
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
    period: "per month",
    billingBadge: "Annually",
    description: "One expert who knows your business. And moves it forward.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    title: "Managed Services",
    price: "50,000",
    period: "per month, billed quarterly",
    startsAt: true,
    billingBadge: "Quarterly",
    description: "End-to-end execution — built and run by experts.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
];

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
    description: "Available for SUV & Enterprise plans as an add-on per user.",
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
    description: "One expert who knows your business. And moves it forward.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
  {
    title: "Managed Services",
    price: "50,000",
    period: "per month, billed quarterly",
    startsAt: true,
    billingBadge: "Quarterly",
    description: "End-to-end execution \u2014 built and run by experts.",
    onShowDetails: fn(),
    onCtaClick: fn(),
  },
];

const onboardingDetailsContent = {
  heading: "Includes:",
  items: [
    {
      title: "Start Your Channels:",
      description: "Get help setting up your Call and WhatsApp channels.",
    },
    {
      title: "Set Up Your Agent:",
      description: "We'll help you activate your first Chat or Voice Agent.",
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
      description: "Connect easily with your existing business tools.",
    },
    {
      title: "Weekly Performance Calls:",
      description: "Stay aligned and on track through regular check-ins.",
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
  decorators: [
    (Story) => (
      <div
        className="box-border flex min-h-screen w-full min-w-0 flex-col bg-semantic-bg-ui px-4 py-4 sm:px-6 sm:py-6"
        data-testid="story-pricing-canvas"
      >
        {/*
          Mirror a typical app shell: a flex child next to a sidebar can overflow if min-w-0 is missing
          in the tree. In consumer apps with Tailwind `prefix: "tw-"` use the same idea with
          `tw-flex tw-min-w-0 tw-max-w-full tw-flex-1 tw-overflow-x-hidden` on the inner wrap.
        */}
        <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-x-hidden">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Full plan selection layout for choosing a business plan, optional add-ons, and managed services.

The default plan grid is responsive: one or two plans stay centered at the three-card width, and three or four plans sit in one row on wide screens.

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

<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;"><code>--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Main page and service sections</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;"><code>--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Power-ups band</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F3F5F6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;"><code>--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Headings and plan text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;"><code>--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Feature comparison link</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
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
    planCardsLayout: {
      description:
        "`default` (grid or horizontal scroll for 5+), `oneColumn` (stack), or `twoColumn` (2-col grid with wrap).",
      control: "select",
      options: ["default", "oneColumn", "twoColumn"],
    },
  },
  args: {
    onFeatureComparisonClick: fn(),
    onTabChange: fn(),
    onBillingPeriodChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

/** Example info banner for the plan area. */
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

export const OnePlan: Story = {
  name: "1 plan",
  args: {
    showCategoryToggle: false,
    showPlanAlert: true,
    showBillingToggle: false,
    headerActions: numberTypeControl,
    planAlert: {
      title: "Custom Plan Active",
      description:
        "You're currently on a tailored enterprise plan. To make changes or explore standard plans, please connect with your account manager.",
      variant: "info" as const,
    },
    planCards: figmaBasePlanCards.slice(0, 1),
    powerUpCards: figmaPowerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: figmaLetUsDriveCards,
  },
};

export const TwoPlans: Story = {
  name: "2 plans",
  args: {
    showCategoryToggle: false,
    showPlanAlert: true,
    showBillingToggle: false,
    headerActions: numberTypeControl,
    planAlert: {
      title: "Custom Plan Active",
      description:
        "You're currently on a tailored enterprise plan. To make changes or explore standard plans, please connect with your account manager.",
      variant: "info" as const,
    },
    planCards: figmaBasePlanCards.slice(0, 2),
    powerUpCards: figmaPowerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: figmaLetUsDriveCards,
  },
};

export const ThreePlans: Story = {
  name: "3 plans",
  args: {
    showCategoryToggle: false,
    showPlanAlert: true,
    showBillingToggle: false,
    headerActions: numberTypeControl,
    planAlert: {
      title: "Custom Plan Active",
      description:
        "You're currently on a tailored enterprise plan. To make changes or explore standard plans, please connect with your account manager.",
      variant: "info" as const,
    },
    planCards: figmaBasePlanCards,
    powerUpCards: figmaPowerUpCards,
    onFeatureComparisonClick: fn(),
    letUsDriveCards: figmaLetUsDriveCards,
  },
};

export const FourPlans: Story = {
  name: "4 plans",
  args: {
    ...ThreePlans.args,
    planCards: [...figmaBasePlanCards, figmaEnterprisePlanCard],
  },
};

export const PlanCardsOneColumnLayout: Story = {
  name: "One column layout",
  args: {
    ...ThreePlans.args,
    planCardsLayout: "oneColumn",
  },
};

export const PlanCardsTwoColumnLayout: Story = {
  name: "Two column layout",
  args: {
    ...ThreePlans.args,
    showPlanAlert: false,
    planCardsLayout: "twoColumn",
    planCards: [...figmaBasePlanCards, figmaEnterprisePlanCard],
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
  name: "Plan alerts",
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
            description:
              "Your plan will renew on the next billing date with the new card.",
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
            description:
              "Taxes are calculated at checkout based on your billing address.",
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
  name: "Plans only",
  args: {
    headerActions: <NumberTypeSelect />,
    planCards: teamCards,
  },
};

// ─── Without Header Actions ───────────────────────────────────────────────────

export const WithoutHeaderActions: Story = {
  name: "Without header actions",
  args: {
    planCards: teamCards,
    powerUpCards,
    letUsDriveCards: letUsDriveCards,
  },
};

// ─── CTA States ───────────────────────────────────────────────────────────────

export const PlanCardCtaStates: Story = {
  name: "CTA states",
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
  name: "Full page with service details",
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
