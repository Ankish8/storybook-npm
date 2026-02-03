import type { Meta, StoryObj } from "@storybook/react";
import { EndpointDetails } from "./endpoint-details";

const meta: Meta<typeof EndpointDetails> = {
  title: "Custom/Webhook/EndpointDetails",
  component: EndpointDetails,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
EndpointDetails displays API endpoint credentials with copy functionality. Used for showing API keys, authentication tokens, and other sensitive credentials in a structured card layout.

Supports two variants:
- **calling** (default): Full version with 5 fields (Base URL, Company ID, Authentication, Secret Key, x-api-key) + revoke section
- **whatsapp**: Simplified version with 3 fields (Base URL, Company ID, Authentication), no revoke section, authentication is visible (not secret)

## Installation

This is a custom component (not available via CLI). Import directly from the package:

\`\`\`bash
npm install myoperator-ui
\`\`\`

## Import

\`\`\`tsx
import { EndpointDetails } from "myoperator-ui"
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
      <td style="padding: 12px 16px;">Card border, section dividers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Card title, section titles</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Descriptions, helper text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Revoke access button</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Card Title</td>
      <td style="padding: 12px 16px;">Title/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Section Title</td>
      <td style="padding: 12px 16px;">Title/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm tracking-[0.035px]</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Revoke Button</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm tracking-[0.035px]</code></td>
    </tr>
  </tbody>
</table>

## Usage

### Calling API (Default)

\`\`\`tsx
import { EndpointDetails } from "myoperator-ui"

function CallingApiSettings() {
  return (
    <EndpointDetails
      variant="calling"
      baseUrl="https://api.myoperator.co/v3/voice/gateway"
      companyId="12"
      authToken="sk_live_abc123xyz789"
      secretKey="whsec_def456uvw012"
      apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
      onRegenerate={(field) => console.log(\`Regenerating \${field}\`)}
      onRevokeAccess={() => console.log("Revoking access")}
    />
  )
}
\`\`\`

### WhatsApp API

\`\`\`tsx
import { EndpointDetails } from "myoperator-ui"

function WhatsAppApiSettings() {
  return (
    <EndpointDetails
      variant="whatsapp"
      title="WhatsApp API"
      baseUrl="https://api.myoperator.co/whatsapp"
      companyId="WA-12345"
      authToken="waba_live_token_abc123xyz"
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["calling", "whatsapp"],
      description: "Variant determines field layout and visibility",
    },
    title: {
      control: "text",
      description: "Card title",
    },
    baseUrl: {
      control: "text",
      description: "Base URL for the API endpoint",
    },
    companyId: {
      control: "text",
      description: "Company ID",
    },
    authToken: {
      control: "text",
      description: "Authentication token (secret in calling, visible in whatsapp)",
    },
    secretKey: {
      control: "text",
      description: "Secret key (only shown in calling variant)",
    },
    apiKey: {
      control: "text",
      description: "API key (only shown in calling variant)",
    },
    showRevokeSection: {
      control: "boolean",
      description: "Whether to show the revoke access section (calling variant only)",
    },
    revokeTitle: {
      control: "text",
      description: "Custom revoke section title",
    },
    revokeDescription: {
      control: "text",
      description: "Custom revoke section description",
    },
    onValueCopy: {
      action: "copied",
      description: "Callback when a field value is copied",
    },
    onRegenerate: {
      action: "regenerate",
      description: "Callback when regenerate is clicked (calling variant only)",
    },
    onRevokeAccess: {
      action: "revoke",
      description: "Callback when revoke access is clicked (calling variant only)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EndpointDetails>;

/**
 * Default endpoint details card for Calling API with all fields and revoke section.
 * This is the full version matching the Figma design.
 */
export const Default: Story = {
  args: {
    variant: "calling",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
};

/**
 * WhatsApp API variant with simplified layout.
 * Shows only 3 fields: Base URL, Company ID, and Authentication (visible, not secret).
 * No regenerate buttons or revoke section.
 */
export const WhatsApp: Story = {
  args: {
    variant: "whatsapp",
    title: "WhatsApp API",
    baseUrl: "https://api.myoperator.co/whatsapp",
    companyId: "WA-12345",
    authToken: "waba_live_token_abc123xyz789",
  },
};

/**
 * Calling API endpoint without the revoke section.
 * Useful when revoke functionality is not needed.
 */
export const CallingWithoutRevoke: Story = {
  args: {
    variant: "calling",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
    showRevokeSection: false,
  },
};

/**
 * Calling API with custom title.
 */
export const CustomTitle: Story = {
  args: {
    variant: "calling",
    title: "API Credentials",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
};

/**
 * Calling API with custom revoke section text.
 */
export const CustomRevokeText: Story = {
  args: {
    variant: "calling",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
    revokeTitle: "Delete All API Keys",
    revokeDescription:
      "This action cannot be undone. All active integrations will stop working immediately.",
  },
};

/**
 * Side by side comparison of both variants.
 */
export const VariantComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <EndpointDetails
        variant="calling"
        title="Calling API"
        baseUrl="https://api.myoperator.co/v3/voice/gateway"
        companyId="12"
        authToken="sk_live_51abc123xyz789def456ghi"
        secretKey="whsec_abc123xyz789def456ghi789jkl"
        apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
      />
      <EndpointDetails
        variant="whatsapp"
        title="WhatsApp API"
        baseUrl="https://api.myoperator.co/whatsapp"
        companyId="WA-12345"
        authToken="waba_live_token_abc123xyz789"
      />
    </div>
  ),
};

/**
 * Interactive example with all callbacks.
 * Click the buttons to see the actions logged.
 */
export const Interactive: Story = {
  args: {
    variant: "calling",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
  render: (args) => (
    <EndpointDetails
      {...args}
      onValueCopy={(field, value) => {
        console.log(`Copied ${field}: ${value}`);
      }}
      onRegenerate={(field) => {
        console.log(`Regenerate ${field}`);
      }}
      onRevokeAccess={() => {
        console.log("Revoke access clicked");
      }}
    />
  ),
};
