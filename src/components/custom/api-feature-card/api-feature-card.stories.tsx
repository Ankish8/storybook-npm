import type { Meta, StoryObj } from "@storybook/react";
import { ApiFeatureCard } from "./api-feature-card";
import { Phone, MessageCircle, Webhook, Settings } from "lucide-react";

const meta: Meta<typeof ApiFeatureCard> = {
  title: "Custom/Webhook/ApiFeatureCard",
  component: ApiFeatureCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
ApiFeatureCard displays an API feature with icon, title, description, action button, and a list of key capabilities. Used to showcase available API integrations and their features.

## Installation

\`\`\`bash
npx myoperator-ui add api-feature-card
\`\`\`

## Import

\`\`\`tsx
import { ApiFeatureCard } from "@/components/custom/api-feature-card"
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
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Card border, section divider</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Card background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Icon container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECF1FB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-primary</code></td>
      <td style="padding: 12px 16px;">Icon color, capability dots</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #4275D6; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Title, capability labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Description text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Neutral 50</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-neutral-50</code></td>
      <td style="padding: 12px 16px;">Capabilities section background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FAFAFA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Neutral 400</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-neutral-400</code></td>
      <td style="padding: 12px 16px;">Capabilities section label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A4A7AE; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title</td>
      <td style="padding: 12px 16px;">Title/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Section Label</td>
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold uppercase</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Capability Item</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
  </tbody>
</table>

## Usage

### Calling API Example

\`\`\`tsx
import { ApiFeatureCard } from "@/components/custom/api-feature-card"
import { Phone } from "lucide-react"

<ApiFeatureCard
  icon={<Phone />}
  title="Calling API"
  description="Manage real-time call flow, recordings, and intelligent routing for your voice infrastructure."
  capabilities={[
    { id: "1", label: "Real-time Call Control" },
    { id: "2", label: "Live Call Events (Webhooks)" },
    { id: "3", label: "IVR & Smart Routing" },
  ]}
  onAction={() => console.log("Manage clicked")}
/>
\`\`\`

### WhatsApp API Example

\`\`\`tsx
import { ApiFeatureCard } from "@/components/custom/api-feature-card"
import { MessageCircle } from "lucide-react"

<ApiFeatureCard
  icon={<MessageCircle />}
  title="WhatsApp API"
  description="Automated templates and session management for global engagement and customer support"
  capabilities={[
    { id: "1", label: "24-Hour Session Windows" },
    { id: "2", label: "Message Templates" },
    { id: "3", label: "Automated Replies" },
  ]}
  onAction={() => console.log("Manage clicked")}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description: "Icon component to display",
    },
    title: {
      control: "text",
      description: "Card title",
    },
    description: {
      control: "text",
      description: "Card description",
    },
    capabilities: {
      control: "object",
      description: "List of key capabilities",
    },
    actionLabel: {
      control: "text",
      description: "Text for the action button",
    },
    capabilitiesLabel: {
      control: "text",
      description: "Label for the capabilities section",
    },
    onAction: {
      action: "action clicked",
      description: "Callback when action button is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ApiFeatureCard>;

/**
 * Calling API card - exact example from Figma design.
 * Copy this code to implement the Calling API feature card.
 */
export const CallingApi: Story = {
  args: {
    icon: <Phone />,
    title: "Calling API",
    description:
      "Manage real-time call flow, recordings, and intelligent routing for your voice infrastructure.",
    capabilities: [
      { id: "1", label: "Real-time Call Control" },
      { id: "2", label: "Live Call Events (Webhooks)" },
      { id: "3", label: "IVR & Smart Routing" },
    ],
  },
};

/**
 * WhatsApp API card - exact example from Figma design.
 * Copy this code to implement the WhatsApp API feature card.
 */
export const WhatsAppApi: Story = {
  args: {
    icon: <MessageCircle />,
    title: "WhatsApp API",
    description:
      "Automated templates and session management for global engagement and customer support",
    capabilities: [
      { id: "1", label: "24-Hour Session Windows" },
      { id: "2", label: "Message Templates" },
      { id: "3", label: "Automated Replies" },
    ],
  },
};

/**
 * Webhook API card for event-driven integrations.
 */
export const WebhookApi: Story = {
  args: {
    icon: <Webhook />,
    title: "Webhook Events",
    description:
      "Subscribe to real-time events and integrate with your systems automatically.",
    capabilities: [
      { id: "1", label: "Event Subscriptions" },
      { id: "2", label: "Custom Payloads" },
      { id: "3", label: "Retry Logic" },
    ],
    actionLabel: "Configure",
  },
};

/**
 * Card without capabilities section.
 */
export const WithoutCapabilities: Story = {
  args: {
    icon: <Settings />,
    title: "API Settings",
    description: "Configure your API keys, rate limits, and authentication settings.",
    capabilities: [],
    actionLabel: "Settings",
  },
};

/**
 * Card with custom action icon.
 */
export const WithActionIcon: Story = {
  args: {
    icon: <Phone />,
    title: "Calling API",
    description:
      "Manage real-time call flow, recordings, and intelligent routing for your voice infrastructure.",
    capabilities: [
      { id: "1", label: "Real-time Call Control" },
      { id: "2", label: "Live Call Events (Webhooks)" },
    ],
    actionIcon: <Settings className="h-4 w-4" />,
    actionLabel: "Configure",
  },
};

/**
 * Card with custom capabilities label.
 */
export const CustomCapabilitiesLabel: Story = {
  args: {
    icon: <Phone />,
    title: "Calling API",
    description:
      "Manage real-time call flow, recordings, and intelligent routing for your voice infrastructure.",
    capabilities: [
      { id: "1", label: "Real-time Call Control" },
      { id: "2", label: "Live Call Events (Webhooks)" },
      { id: "3", label: "IVR & Smart Routing" },
    ],
    capabilitiesLabel: "Main Features",
  },
};

/**
 * Both API cards together - matches the Figma design layout.
 * Shows Calling API and WhatsApp API stacked vertically.
 */
export const BothApiCards: Story = {
  render: () => (
    <div className="space-y-4">
      <ApiFeatureCard
        icon={<Phone />}
        title="Calling API"
        description="Manage real-time call flow, recordings, and intelligent routing for your voice infrastructure."
        capabilities={[
          { id: "1", label: "Real-time Call Control" },
          { id: "2", label: "Live Call Events (Webhooks)" },
          { id: "3", label: "IVR & Smart Routing" },
        ]}
        onAction={() => console.log("Calling API clicked")}
      />
      <ApiFeatureCard
        icon={<MessageCircle />}
        title="WhatsApp API"
        description="Automated templates and session management for global engagement and customer support"
        capabilities={[
          { id: "1", label: "24-Hour Session Windows" },
          { id: "2", label: "Message Templates" },
          { id: "3", label: "Automated Replies" },
        ]}
        onAction={() => console.log("WhatsApp API clicked")}
      />
    </div>
  ),
};

/**
 * Card with many capabilities showing wrap behavior.
 */
export const ManyCapabilities: Story = {
  args: {
    icon: <Phone />,
    title: "Full-Featured API",
    description: "Comprehensive API with all available features and capabilities.",
    capabilities: [
      { id: "1", label: "Real-time Call Control" },
      { id: "2", label: "Live Call Events (Webhooks)" },
      { id: "3", label: "IVR & Smart Routing" },
      { id: "4", label: "Call Recording" },
      { id: "5", label: "Call Analytics" },
      { id: "6", label: "Conference Calling" },
      { id: "7", label: "Call Transfer" },
      { id: "8", label: "Voicemail" },
    ],
  },
};
