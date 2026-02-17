import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Shield, Hash, PhoneCall, ExternalLink } from "lucide-react";
import { PowerUpCard } from "./power-up-card";

const meta: Meta<typeof PowerUpCard> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PowerUpCard",
  component: PowerUpCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A power-up/add-on card displaying an icon, title, pricing, description, and a CTA button. Used in the "Power-ups and charges" section of the Plan & Pricing page.

## Installation

\`\`\`bash
npx myoperator-ui add power-up-card
\`\`\`

## Import

\`\`\`tsx
import { PowerUpCard } from "@/components/custom/power-up-card"
import type { PowerUpCardProps } from "@/components/custom/power-up-card"
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
      <td style="padding: 12px 16px;">Card Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--card</code></td>
      <td style="padding: 12px 16px;">Card surface</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Title, price text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Description text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info 25</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-info-25</code></td>
      <td style="padding: 12px 16px;">Icon container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Title</td>
      <td style="padding: 12px 16px;">16px (text-base)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">\u2014</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Price</td>
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
      <td style="padding: 12px 16px;">CTA Button</td>
      <td style="padding: 12px 16px;">14px (text-sm)</td>
      <td style="padding: 12px 16px;">SemiBold (600)</td>
      <td style="padding: 12px 16px;">0.01px</td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { PowerUpCard } from "@/components/custom/power-up-card";
import { Shield, Hash, PhoneCall } from "lucide-react";

<PowerUpCard
  icon={<Shield className="size-6 text-semantic-text-secondary" />}
  title="Truecaller business"
  price="Starts @ \u20B930,000/month"
  description="Leverage the power of Truecaller Business to grow your reach and reputation."
  onCtaClick={() => handleTalkToUs("truecaller")}
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
  <div style={{ width: "348px" }}>
    <Story />
  </div>
);

// ─── Default ────────────────────────────────────────────────────────────

export const Default: Story = {
  decorators: [singleCardDecorator],
  args: {
    icon: <Shield className="size-6 text-semantic-text-secondary" />,
    title: "Truecaller business",
    price: "Starts @ \u20B930,000/month",
    description:
      "Leverage the power of Truecaller Business to grow your reach and reputation.",
    onCtaClick: () => {},
  },
};

// ─── 1800 Toll-free ─────────────────────────────────────────────────────

export const TollFree: Story = {
  name: "1800 Toll-free",
  decorators: [singleCardDecorator],
  args: {
    icon: <Hash className="size-6 text-semantic-text-secondary" />,
    title: "1800 Toll-free",
    price: "Starts @ \u20B9500/month",
    description:
      "Strengthen your brand accessibility with a professional 1800 line.",
    onCtaClick: () => {},
  },
};

// ─── Auto-Dialer ────────────────────────────────────────────────────────

export const AutoDialer: Story = {
  name: "Auto-Dialer",
  decorators: [singleCardDecorator],
  args: {
    icon: <PhoneCall className="size-6 text-semantic-text-secondary" />,
    title: "Auto-Dialer",
    price: "Starts @ \u20B9700/user/month",
    description:
      "Available for SUV & Enterprise plans as an add-on per user.",
    onCtaClick: () => {},
  },
};

// ─── Without Icon ───────────────────────────────────────────────────────

export const WithoutIcon: Story = {
  name: "Without Icon",
  decorators: [singleCardDecorator],
  args: {
    title: "Custom Integration",
    price: "Starts @ \u20B95,000/month",
    description: "Build a custom integration tailored to your business needs.",
    onCtaClick: () => {},
  },
};

// ─── Custom CTA ─────────────────────────────────────────────────────────

export const CustomCTA: Story = {
  name: "Custom CTA Label",
  decorators: [singleCardDecorator],
  args: {
    icon: <Shield className="size-6 text-semantic-text-secondary" />,
    title: "Truecaller business",
    price: "Starts @ \u20B930,000/month",
    description:
      "Leverage the power of Truecaller Business to grow your reach and reputation.",
    ctaLabel: "Contact sales",
    onCtaClick: () => {},
  },
};

// ─── Power-ups Section (Figma layout) ───────────────────────────────────

export const PowerUpsSection: Story = {
  name: "Power-ups Section",
  parameters: { layout: "padded" },
  render: () => (
    <div
      className="flex flex-col gap-4 bg-semantic-bg-ui rounded-lg px-6 py-10"
      style={{ width: "1091px" }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
          Power-ups and charges
        </h2>
        <button className="flex items-center gap-1 text-sm font-semibold text-semantic-text-link hover:underline bg-transparent border-none cursor-pointer p-0">
          See full feature comparison
          <ExternalLink className="size-3.5" />
        </button>
      </div>

      {/* Cards grid */}
      <div className="flex gap-6">
        <PowerUpCard
          className="flex-1"
          icon={<Shield className="size-6 text-semantic-text-secondary" />}
          title="Truecaller business"
          price="Starts @ ₹30,000/month"
          description="Leverage the power of Truecaller Business to grow your reach and reputation."
          onCtaClick={() => {}}
        />
        <PowerUpCard
          className="flex-1"
          icon={<Hash className="size-6 text-semantic-text-secondary" />}
          title="1800 Toll-free"
          price="Starts @ ₹500/month"
          description="Strengthen your brand accessibility with a professional 1800 line."
          onCtaClick={() => {}}
        />
        <PowerUpCard
          className="flex-1"
          icon={<PhoneCall className="size-6 text-semantic-text-secondary" />}
          title="Auto-Dialer"
          price="Starts @ ₹700/user/month"
          description="Available for SUV & Enterprise plans as an add-on per user."
          onCtaClick={() => {}}
        />
      </div>
    </div>
  ),
};
