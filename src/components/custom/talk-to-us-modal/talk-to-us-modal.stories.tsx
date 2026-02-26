import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TalkToUsModal } from "./talk-to-us-modal";
import { Headphones, Shield, Hash, PhoneCall } from "lucide-react";
import { PowerUpCard } from "../power-up-card";

const meta: Meta<typeof TalkToUsModal> = {
  title: "Custom/Plan & Payment/Plan & Pricing/TalkToUsModal",
  component: TalkToUsModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A modal dialog that prompts users to contact the sales/support team. Displays a centered icon, heading, description, and two action buttons. Typically triggered by the PowerUpCard's "Talk to us" button on the pricing page.

## Installation

\`\`\`bash
npx myoperator-ui add talk-to-us-modal
\`\`\`

## Import

\`\`\`tsx
import { TalkToUsModal } from "@/components/custom/talk-to-us-modal"
import type { TalkToUsModalProps } from "@/components/custom/talk-to-us-modal"
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
      <td style="padding: 12px 16px;">Primary Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary-surface</code></td>
      <td style="padding: 12px 16px;">Icon circle background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E8F5F6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Icon color, primary button</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Heading text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Description text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { useState } from "react";
import { TalkToUsModal } from "@/components/custom/talk-to-us-modal";
import { PowerUpCard } from "@/components/custom/power-up-card";

function PricingPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PowerUpCard
        title="Auto-Dialer"
        price="Starts @ ₹700/user/month"
        description="Available for SUV & Enterprise plans."
        onCtaClick={() => setOpen(true)}
      />
      <TalkToUsModal
        open={open}
        onOpenChange={setOpen}
        onPrimaryAction={() => window.open("mailto:support@myoperator.com")}
      />
    </>
  );
}
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default (Open) ──────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    open: true,
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  },
};

// ─── Custom Content ──────────────────────────────────────────────────────────

export const CustomContent: Story = {
  name: "Custom Content",
  args: {
    open: true,
    title: "Need Help Choosing?",
    description:
      "Our sales team can walk you through the plans and find the best fit for your team.",
    primaryActionLabel: "Chat with sales",
    secondaryActionLabel: "Go back",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  },
};

// ─── Custom Icon ─────────────────────────────────────────────────────────────

export const CustomIcon: Story = {
  name: "Custom Icon",
  args: {
    open: true,
    icon: (
      <div className="flex size-[60px] items-center justify-center rounded-full bg-semantic-info-surface">
        <Headphones className="size-7 text-semantic-info-primary" />
      </div>
    ),
    title: "Talk to Support",
    description: "Our support team is available 24/7 to help you.",
    primaryActionLabel: "Open support",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  },
};

// ─── With PowerUpCard Integration ────────────────────────────────────────────

export const WithPowerUpCard: Story = {
  name: "PowerUpCard Integration",
  parameters: { layout: "padded" },
  render: () => {
    const PowerUpCardDemo = () => {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ width: "348px" }}>
          <PowerUpCard
            icon={<Shield className="size-6 text-semantic-text-secondary" />}
            title="Truecaller business"
            price="Starts @ ₹30,000/month"
            description="Leverage the power of Truecaller Business to grow your reach and reputation."
            onCtaClick={() => setOpen(true)}
          />
          <TalkToUsModal
            open={open}
            onOpenChange={setOpen}
            onPrimaryAction={() => alert("Contacting support...")}
          />
        </div>
      );
    };
    return <PowerUpCardDemo />;
  },
};

// ─── Full Power-ups Section ──────────────────────────────────────────────────

export const PowerUpsSection: Story = {
  name: "Power-ups Section (Full Integration)",
  parameters: { layout: "padded" },
  render: () => {
    const FullSection = () => {
      const [open, setOpen] = useState(false);
      return (
        <div
          className="flex flex-col gap-4 rounded-lg bg-semantic-bg-ui px-6 py-10"
          style={{ width: "1091px" }}
        >
          <h2 className="m-0 text-lg font-semibold text-semantic-text-primary">
            Power-ups and charges
          </h2>
          <div className="flex gap-6">
            <PowerUpCard
              className="flex-1"
              icon={
                <Shield className="size-6 text-semantic-text-secondary" />
              }
              title="Truecaller business"
              price="Starts @ ₹30,000/month"
              description="Leverage the power of Truecaller Business to grow your reach and reputation."
              onCtaClick={() => setOpen(true)}
            />
            <PowerUpCard
              className="flex-1"
              icon={<Hash className="size-6 text-semantic-text-secondary" />}
              title="1800 Toll-free"
              price="Starts @ ₹500/month"
              description="Strengthen your brand accessibility with a professional 1800 line."
              onCtaClick={() => setOpen(true)}
            />
            <PowerUpCard
              className="flex-1"
              icon={
                <PhoneCall className="size-6 text-semantic-text-secondary" />
              }
              title="Auto-Dialer"
              price="Starts @ ₹700/user/month"
              description="Available for SUV & Enterprise plans as an add-on per user."
              onCtaClick={() => setOpen(true)}
            />
          </div>
          <TalkToUsModal
            open={open}
            onOpenChange={setOpen}
            onPrimaryAction={() => alert("Contacting support...")}
          />
        </div>
      );
    };
    return <FullSection />;
  },
};
