import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { PhoneInput } from "./phone-input";

const meta: Meta<typeof PhoneInput> = {
  title: "Components/Phone Input",
  component: PhoneInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A phone number input with a country code prefix area (flag emoji + dial code + optional chevron). The prefix and input are visually unified in a single bordered container with a subtle vertical divider.

\`\`\`bash
npx myoperator-ui add phone-input
\`\`\`

## Import

\`\`\`tsx
import { PhoneInput } from "@/components/ui/phone-input"
\`\`\`

## Usage

\`\`\`tsx
<PhoneInput placeholder="Enter phone number" />
<PhoneInput countryFlag="🇺🇸" countryCode="+1" />
<PhoneInput onCountryClick={() => openCountryPicker()} />
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-focus</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Secondary Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">535862</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #535862; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Muted Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Enter phone number",
    onCountryClick: fn(),
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Overview: Story = {
  args: {
    countryFlag: "🇮🇳",
    countryCode: "+91",
    placeholder: "Enter phone number",
    showChevron: true,
  },
};

export const WithCountrySelector: Story = {
  args: {
    countryFlag: "🇮🇳",
    countryCode: "+91",
    placeholder: "Enter phone number",
    onCountryClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the phone input with an `onCountryClick` handler. Click the country area to trigger the callback (logged in Actions tab).",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "9876543210",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state applies reduced opacity to the entire component and prevents interaction.",
      },
    },
  },
};

export const USNumber: Story = {
  args: {
    countryFlag: "🇺🇸",
    countryCode: "+1",
    placeholder: "Enter phone number",
  },
  parameters: {
    docs: {
      description: {
        story: "Phone input configured for US country code.",
      },
    },
  },
};

export const NoChevron: Story = {
  args: {
    showChevron: false,
    placeholder: "Enter phone number",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `showChevron` is `false`, the dropdown indicator is hidden. Useful when the country code is fixed and not selectable.",
      },
    },
  },
};

export const InForm: Story = {
  render: (args) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Form submitted!");
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-semantic-text-primary">
          Phone Number
        </label>
        <PhoneInput id="phone" {...args} />
        <p className="m-0 text-xs text-semantic-text-muted">
          We will send a verification code to this number.
        </p>
      </div>
    </form>
  ),
  args: {
    placeholder: "Enter your phone number",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Phone input used inside a form with a label and helper text.",
      },
    },
  },
};
