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

\`\`\`tsx
import { EndpointDetails } from "myoperator-ui"

function ApiSettingsPage() {
  const handleRegenerate = (field: "authToken" | "secretKey") => {
    console.log(\`Regenerating \${field}\`)
    // Call API to regenerate the token
  }

  const handleRevokeAccess = () => {
    console.log("Revoking API access")
    // Show confirmation modal, then revoke
  }

  return (
    <EndpointDetails
      baseUrl="https://api.myoperator.co/v3/voice/gateway"
      companyId="12"
      authToken="sk_live_abc123xyz789"
      secretKey="whsec_def456uvw012"
      apiKey="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
      onRegenerate={handleRegenerate}
      onRevokeAccess={handleRevokeAccess}
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
      description: "Authentication token (secret)",
    },
    secretKey: {
      control: "text",
      description: "Secret key (secret)",
    },
    apiKey: {
      control: "text",
      description: "API key (visible)",
    },
    showRevokeSection: {
      control: "boolean",
      description: "Whether to show the revoke access section",
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
      description: "Callback when regenerate is clicked",
    },
    onRevokeAccess: {
      action: "revoke",
      description: "Callback when revoke access is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EndpointDetails>;

/**
 * Default endpoint details card with all fields and revoke section.
 * This matches the exact Figma design.
 */
export const Default: Story = {
  args: {
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
};

/**
 * Endpoint details without the revoke section.
 * Useful when revoke functionality is not needed.
 */
export const WithoutRevokeSection: Story = {
  args: {
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
    showRevokeSection: false,
  },
};

/**
 * Endpoint details with custom title.
 */
export const CustomTitle: Story = {
  args: {
    title: "API Credentials",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "sk_live_51abc123xyz789def456ghi",
    secretKey: "whsec_abc123xyz789def456ghi789jkl",
    apiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
};

/**
 * Endpoint details with custom revoke section text.
 */
export const CustomRevokeText: Story = {
  args: {
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
 * WhatsApp API endpoint details example.
 */
export const WhatsAppEndpoint: Story = {
  args: {
    title: "WhatsApp API Credentials",
    baseUrl: "https://api.myoperator.co/v3/whatsapp/messages",
    companyId: "WA-12345",
    authToken: "waba_live_token_abc123xyz",
    secretKey: "waba_secret_def456uvw",
    apiKey: "whatsapp_api_key_789ghi012jkl",
  },
};

/**
 * Calling API endpoint details example.
 */
export const CallingEndpoint: Story = {
  args: {
    title: "Calling API Credentials",
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    companyId: "12",
    authToken: "voice_live_token_abc123",
    secretKey: "voice_secret_def456",
    apiKey: "voice_api_key_789ghi",
  },
};

/**
 * Interactive example with all callbacks.
 * Click the buttons to see the actions logged.
 */
export const Interactive: Story = {
  args: {
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
        alert(`Copied ${field} to clipboard!`);
      }}
      onRegenerate={(field) => {
        console.log(`Regenerate ${field}`);
        alert(`Regenerating ${field}...`);
      }}
      onRevokeAccess={() => {
        console.log("Revoke access clicked");
        alert("Are you sure you want to revoke access?");
      }}
    />
  ),
};
