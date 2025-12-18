import type { Meta, StoryObj } from "@storybook/react";
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
        <p className="text-sm text-[#6B7280] mb-1.5">Default</p>
        <Input placeholder="Default state" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Error</p>
        <Input state="error" placeholder="Error state" />
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
        <p className="text-sm text-[#6B7280] mb-1.5">Text</p>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Email</p>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Password</p>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Number</p>
        <Input type="number" placeholder="0" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280] mb-1.5">Search</p>
        <Input type="search" placeholder="Search..." />
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
