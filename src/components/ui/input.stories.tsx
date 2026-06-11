import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible input component for text entry with state variants.

\`\`\`bash
npx myoperator-ui add input
\`\`\`

## Import

\`\`\`tsx
import { Input } from "@/components/ui/input"
\`\`\`

## Usage

\`\`\`tsx
<Input placeholder="Enter your email" />
<Input state="error" placeholder="Invalid input" />
<Input state="success" placeholder="Valid input" />
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
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Radius</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--radius</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">4px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">10px 16px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
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
      <td style="padding: 12px 16px;">Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">A2A6B1</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A2A6B1; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">17B26A</td>
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
      <td style="padding: 12px 16px;">Input Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Placeholder</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "error"],
      description: "Visual state of the input",
      table: {
        type: { summary: '"default" | "error"' },
        defaultValue: { summary: "default" },
      },
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "Input type",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "text" },
      },
    },
    preventNumberExponent: {
      control: "boolean",
      description:
        'When `type="number"`, block scientific notation characters (`e`/`E`).',
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    readOnly: {
      control: "boolean",
      description: "Read-only state",
    },
    showCheckIcon: {
      control: "boolean",
      description: "Shows a check icon on the right when the input is focused",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    placeholder: "Enter your email",
    state: "default",
    type: "text",
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label
          htmlFor="input-state-default"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Default
        </label>
        <Input id="input-state-default" placeholder="Default state" />
      </div>
      <div>
        <label
          htmlFor="input-state-error"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Error
        </label>
        <Input id="input-state-error" state="error" placeholder="Error state" />
      </div>
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="Disabled input" disabled />
      <Input
        placeholder="With value"
        defaultValue="Disabled with value"
        disabled
      />
    </div>
  ),
};

// Input Types
export const InputTypes: Story = {
  name: "Input types",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label
          htmlFor="input-type-text"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Text
        </label>
        <Input id="input-type-text" type="text" placeholder="Enter text" />
      </div>
      <div>
        <label
          htmlFor="input-type-email"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Email
        </label>
        <Input
          id="input-type-email"
          type="email"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="input-type-password"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Password
        </label>
        <Input
          id="input-type-password"
          type="password"
          placeholder="Enter password"
        />
      </div>
      <div>
        <label
          htmlFor="input-type-number"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Number
        </label>
        <Input id="input-type-number" type="number" placeholder="0" />
      </div>
      <div>
        <label
          htmlFor="input-type-search"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Search
        </label>
        <Input id="input-type-search" type="search" placeholder="Search..." />
      </div>
    </div>
  ),
};

export const NumberExponentGuard: Story = {
  name: "Number exponent guard",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label
          htmlFor="input-number-exponent-blocked"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Default (blocks `e` / `E`)
        </label>
        <Input
          id="input-number-exponent-blocked"
          type="number"
          placeholder="Try typing 2e3"
        />
      </div>
      <div>
        <label
          htmlFor="input-number-exponent-allowed"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Opt-out (preventNumberExponent false)
        </label>
        <Input
          id="input-number-exponent-allowed"
          type="number"
          preventNumberExponent={false}
          placeholder="Allows exponent notation"
        />
      </div>
    </div>
  ),
};

// File Input
export const FileInput: Story = {
  name: "File input",
  render: () => (
    <div className="w-80">
      <Input type="file" />
    </div>
  ),
};

// With Value
export const WithValue: Story = {
  name: "With value",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input defaultValue="Default value" />
      <Input defaultValue="Error value" state="error" />
    </div>
  ),
};

// With Check Icon
export const WithCheckIcon: Story = {
  name: "With check icon",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label
          htmlFor="input-check-icon-focus"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Click to focus — check appears
        </label>
        <Input
          id="input-check-icon-focus"
          showCheckIcon
          placeholder="Enter amount"
        />
      </div>
      <div>
        <label
          htmlFor="input-check-icon-side-1000"
          className="mb-1.5 block text-sm font-semibold text-semantic-text-secondary"
        >
          Side-by-side (wallet top-up pattern)
        </label>
        <div className="flex gap-2">
          <Input
            id="input-check-icon-side-1000"
            showCheckIcon
            defaultValue="₹1,000"
            className="text-center"
          />
          <Input showCheckIcon defaultValue="₹5,000" className="text-center" />
        </div>
      </div>
    </div>
  ),
};
