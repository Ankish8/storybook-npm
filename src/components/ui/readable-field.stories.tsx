import type { Meta, StoryObj } from "@storybook/react";
import { ReadableField } from "./readable-field";

const meta: Meta<typeof ReadableField> = {
  title: "Components/ReadableField",
  component: ReadableField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
ReadableField displays a read-only value with copy-to-clipboard functionality. Supports secret mode for sensitive data like API keys, passwords, and authentication tokens.

## Installation

\`\`\`bash
npx myoperator-ui add readable-field
\`\`\`

## Import

\`\`\`tsx
import { ReadableField } from "@/components/ui/readable-field"
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
      <td style="padding: 12px 16px;">Background UI</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Input container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Input container border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Label, helper text, icons</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Primary 950</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--color-primary-950</code></td>
      <td style="padding: 12px 16px;">Value text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px;">Copy success icon</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #17B26A; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Label</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm tracking-[0.035px]</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Value</td>
      <td style="padding: 12px 16px;">Body/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base tracking-[0.08px]</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Header Action</td>
      <td style="padding: 12px 16px;">Title/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold tracking-[0.014px]</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Helper Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm tracking-[0.035px]</code></td>
    </tr>
  </tbody>
</table>

## Usage

### Simple Readable Field

\`\`\`tsx
<ReadableField
  label="Base URL"
  value="https://api.myoperator.co/v3/voice/gateway"
/>
\`\`\`

### Secret Field with Regenerate Action

\`\`\`tsx
<ReadableField
  label="Authentication"
  value="sk_live_abc123xyz789"
  secret
  helperText="Used for client-side integrations."
  headerAction={{
    label: "Regenerate",
    onClick: () => handleRegenerate(),
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the field",
    },
    value: {
      control: "text",
      description: "Value to display and copy",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the field",
    },
    secret: {
      control: "boolean",
      description: "When true, masks the value with dots and shows eye toggle",
    },
    headerAction: {
      control: false,
      description: "Header action (e.g., Regenerate link)",
    },
    onValueCopy: {
      action: "copied",
      description: "Callback when value is copied",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReadableField>;

/**
 * Simple readable field for displaying URLs or IDs.
 * Click the copy icon to copy the value to clipboard.
 */
export const BaseUrl: Story = {
  args: {
    label: "Base URL",
    value: "https://api.myoperator.co/v3/voice/gateway",
  },
};

/**
 * Readable field for short values like IDs.
 */
export const CompanyId: Story = {
  args: {
    label: "Company ID",
    value: "12",
  },
};

/**
 * Secret field with masked value, eye toggle, and regenerate action.
 * Used for authentication tokens and API keys.
 */
export const Authentication: Story = {
  args: {
    label: "Authentication",
    value: "sk_live_51abc123xyz789def456ghi",
    secret: true,
    helperText: "Used for client-side integrations.",
    headerAction: {
      label: "Regenerate",
      onClick: () => console.log("Regenerate authentication"),
    },
  },
};

/**
 * Secret key field with security warning helper text.
 */
export const SecretKey: Story = {
  args: {
    label: "Secret Key",
    value: "whsec_abc123xyz789def456ghi789jkl",
    secret: true,
    helperText: "Never share this key or expose it in client-side code.",
    headerAction: {
      label: "Regenerate",
      onClick: () => console.log("Regenerate secret key"),
    },
  },
};

/**
 * API key field showing full value (not secret).
 */
export const ApiKey: Story = {
  args: {
    label: "x-api-key",
    value: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
  },
};

/**
 * Field with helper text but no secret mode.
 */
export const WithHelperText: Story = {
  args: {
    label: "Webhook URL",
    value: "https://hooks.myoperator.co/webhook/abc123",
    helperText: "Use this URL in your external service configuration.",
  },
};

/**
 * Field with only header action (no secret mode).
 */
export const WithHeaderAction: Story = {
  args: {
    label: "Access Token",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    headerAction: {
      label: "Refresh",
      onClick: () => console.log("Refresh token"),
    },
  },
};

/**
 * Complete endpoint details layout showing all field variants.
 * This matches the Figma design for API credential management.
 */
export const EndpointDetailsLayout: Story = {
  render: () => (
    <div className="space-y-6 max-w-[550px]">
      <ReadableField
        label="Base URL"
        value="https://api.myoperator.co/v3/voice/gateway"
      />
      <ReadableField label="Company ID" value="12" />
      <ReadableField
        label="Authentication"
        value="sk_live_51abc123xyz789def456ghi"
        secret
        helperText="Used for client-side integrations."
        headerAction={{
          label: "Regenerate",
          onClick: () => console.log("Regenerate"),
        }}
      />
      <ReadableField
        label="Secret Key"
        value="whsec_abc123xyz789def456ghi789jkl"
        secret
        helperText="Never share this key or expose it in client-side code."
        headerAction={{
          label: "Regenerate",
          onClick: () => console.log("Regenerate"),
        }}
      />
      <ReadableField
        label="x-api-key"
        value="tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO"
      />
    </div>
  ),
};

/**
 * Two-column layout for endpoint details.
 */
export const TwoColumnLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <ReadableField
        label="Base URL"
        value="https://api.myoperator.co/v3/voice/gateway"
      />
      <ReadableField label="Company ID" value="12" />
      <ReadableField
        label="Authentication"
        value="sk_live_51abc123xyz789def456ghi"
        secret
        helperText="Used for client-side integrations."
        headerAction={{
          label: "Regenerate",
          onClick: () => console.log("Regenerate"),
        }}
      />
      <ReadableField
        label="Secret Key"
        value="whsec_abc123xyz789def456ghi789jkl"
        secret
        helperText="Never share this key or expose it in client-side code."
        headerAction={{
          label: "Regenerate",
          onClick: () => console.log("Regenerate"),
        }}
      />
    </div>
  ),
};
