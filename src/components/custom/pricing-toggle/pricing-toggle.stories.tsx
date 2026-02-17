import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PricingToggle } from "./pricing-toggle";

const meta: Meta<typeof PricingToggle> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PricingToggle",
  component: PricingToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A plan type tab selector with an optional billing period toggle. The pill-shaped tabs switch between plan categories, and the billing toggle switches between monthly/yearly pricing.

Used on the Plan & Pricing page to let users choose between plan types (e.g. "Team-Led Plans" vs "Go-AI First") and billing frequency.

## Installation

\`\`\`bash
npx myoperator-ui add pricing-toggle
\`\`\`

## Import

\`\`\`tsx
import { PricingToggle } from "@/components/custom/pricing-toggle"
import type { PricingToggleProps, PricingToggleTab } from "@/components/custom/pricing-toggle"
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
      <td style="padding: 12px 16px;">BG UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Pill tab container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Brand</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px;">Active tab background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Inactive tab text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Active billing label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Inactive billing label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Active Tab</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Inactive Tab</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">Regular (400)</td>
      <td style="padding: 12px 16px;">0.5px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Billing Label</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.014px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PricingToggle } from "@/components/custom/pricing-toggle";

const [activeTab, setActiveTab] = useState("team");
const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

<PricingToggle
  tabs={[
    { label: "Team-Led Plans", value: "team" },
    { label: "Go-AI First", value: "ai" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showBillingToggle={activeTab === "team"}
  billingPeriod={billingPeriod}
  onBillingPeriodChange={setBillingPeriod}
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

// ─── Default (Interactive) ──────────────────────────────────────────────

export const Default: Story = {
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("team");
    const [billingPeriod, setBillingPeriod] = React.useState<
      "monthly" | "yearly"
    >("monthly");

    return (
      <PricingToggle
        tabs={[
          { label: "Team-Led Plans", value: "team" },
          { label: "Go-AI First", value: "ai" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle={activeTab === "team"}
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
      />
    );
  },
};

// ─── Team-Led Plans (Monthly) ───────────────────────────────────────────

export const TeamLedMonthly: Story = {
  name: "Team-Led Plans (Monthly)",
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("team");
    const [billingPeriod, setBillingPeriod] = React.useState<
      "monthly" | "yearly"
    >("monthly");

    return (
      <PricingToggle
        tabs={[
          { label: "Team-Led Plans", value: "team" },
          { label: "Go-AI First", value: "ai" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle={activeTab === "team"}
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
      />
    );
  },
};

// ─── Team-Led Plans (Yearly) ────────────────────────────────────────────

export const TeamLedYearly: Story = {
  name: "Team-Led Plans (Yearly)",
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("team");
    const [billingPeriod, setBillingPeriod] = React.useState<
      "monthly" | "yearly"
    >("yearly");

    return (
      <PricingToggle
        tabs={[
          { label: "Team-Led Plans", value: "team" },
          { label: "Go-AI First", value: "ai" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle={activeTab === "team"}
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
      />
    );
  },
};

// ─── Go-AI First (No Billing Toggle) ───────────────────────────────────

export const GoAIFirst: Story = {
  name: "Go-AI First (No Billing Toggle)",
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("ai");

    return (
      <PricingToggle
        tabs={[
          { label: "Team-Led Plans", value: "team" },
          { label: "Go-AI First", value: "ai" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle={false}
      />
    );
  },
};

// ─── Tabs Only ──────────────────────────────────────────────────────────

export const TabsOnly: Story = {
  name: "Tabs Only (No Billing Toggle)",
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("team");

    return (
      <PricingToggle
        tabs={[
          { label: "Team-Led Plans", value: "team" },
          { label: "Go-AI First", value: "ai" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle={false}
      />
    );
  },
};

// ─── Custom Labels ──────────────────────────────────────────────────────

export const CustomLabels: Story = {
  name: "Custom Billing Labels",
  render: function Render() {
    const [activeTab, setActiveTab] = React.useState("starter");
    const [billingPeriod, setBillingPeriod] = React.useState<
      "monthly" | "yearly"
    >("monthly");

    return (
      <PricingToggle
        tabs={[
          { label: "Starter", value: "starter" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise", value: "enterprise" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBillingToggle
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
        monthlyLabel="Pay Monthly"
        yearlyLabel="Pay Yearly (2 months free)"
      />
    );
  },
};
