import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A multi-line text input with label, error state, helper text, character counter, and resize control.

\`\`\`bash
npx myoperator-ui add textarea
\`\`\`

## Import

\`\`\`tsx
import { Textarea } from "@/components/ui/textarea"
\`\`\`

## Usage

\`\`\`tsx
<Textarea label="Description" placeholder="Enter description" />
<Textarea label="Notes" error="Too short" showCount maxLength={500} />
<Textarea label="JSON" rows={8} resize="vertical" />
<Textarea label="Message" required placeholder="Write your message..." />
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
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">D5D7DA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #D5D7DA; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input-focus</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">FFFFFF</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Placeholder</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-placeholder</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">A4A7AE</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #A4A7AE; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label</td>
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
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Size of the textarea — `default` or `sm` (compact)",
      table: {
        type: { summary: '"default" | "sm"' },
        defaultValue: { summary: "default" },
      },
    },
    state: {
      control: "select",
      options: ["default", "error"],
      description: "Visual state variant",
      table: {
        type: { summary: '"default" | "error"' },
        defaultValue: { summary: "default" },
      },
    },
    label: {
      control: "text",
      description: "Label text displayed above the textarea",
      table: {
        type: { summary: "string" },
      },
    },
    required: {
      control: "boolean",
      description: "Shows red asterisk (*) next to label",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Textarea placeholder text",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the textarea",
      table: {
        type: { summary: "string" },
      },
    },
    error: {
      control: "text",
      description: "Error message — triggers error state with red styling",
      table: {
        type: { summary: "string" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    showCount: {
      control: "boolean",
      description: "Show character count (requires maxLength)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description: "Maximum character length",
      table: {
        type: { summary: "number" },
      },
    },
    rows: {
      control: "number",
      description: "Number of visible text rows",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "4" },
      },
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      description: "Controls CSS resize behavior",
      table: {
        type: { summary: '"none" | "vertical" | "horizontal" | "both"' },
        defaultValue: { summary: "none" },
      },
    },
    wrapperClassName: {
      control: "text",
      description: "Additional class for the wrapper container",
      table: {
        type: { summary: "string" },
      },
    },
    labelClassName: {
      control: "text",
      description: "Additional class for the label",
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default - primary interactive example
export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    helperText: "Provide a brief description.",
    rows: 4,
  },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
};

// With Label
export const WithLabel: Story = {
  name: "With label",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea label="Full Name" placeholder="Enter your name" />
      <Textarea label="Notes" placeholder="Add any notes..." />
    </div>
  ),
};

// With Error
export const WithError: Story = {
  name: "With error",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Description"
        placeholder="Enter description"
        error="Description is required"
      />
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself"
        error="Bio must be at least 20 characters"
        defaultValue="Too short"
      />
    </div>
  ),
};

// With Helper Text
export const WithHelperText: Story = {
  name: "With helper text",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Feedback"
        placeholder="Share your feedback..."
        helperText="Your feedback helps us improve."
      />
      <Textarea
        label="Address"
        placeholder="Enter your full address"
        helperText="Include city, state, and zip code."
      />
    </div>
  ),
};

// With Character Count
export const WithCharacterCount: Story = {
  name: "With character count",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself"
        showCount
        maxLength={200}
        helperText="Maximum 200 characters"
      />
      <Textarea
        label="Summary"
        placeholder="Write a brief summary"
        showCount
        maxLength={100}
      />
    </div>
  ),
};

// Small Size
export const SmallSize: Story = {
  name: "Small size",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        size="sm"
        label="Quick Note"
        placeholder="Enter a quick note..."
      />
      <Textarea
        size="sm"
        label="Comment"
        placeholder="Add a comment..."
        showCount
        maxLength={150}
      />
    </div>
  ),
};

// Resizable
export const Resizable: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Resizable Textarea"
        placeholder="Drag the bottom-right corner to resize..."
        resize="vertical"
        helperText="This textarea can be resized vertically."
      />
    </div>
  ),
};

// Required
export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Message"
        placeholder="Write your message..."
        required
      />
      <Textarea
        label="Reason"
        placeholder="Provide a reason..."
        required
        helperText="This field is mandatory."
      />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea
        label="Disabled Empty"
        placeholder="Cannot type here..."
        disabled
      />
      <Textarea
        label="Disabled with Value"
        defaultValue="This content cannot be edited."
        disabled
      />
    </div>
  ),
};

// All States - side-by-side default vs error
export const AllStates: Story = {
  name: "All states",
  render: () => (
    <div className="flex gap-6">
      <div className="w-72">
        <p className="m-0 text-sm font-semibold text-semantic-text-muted mb-2 uppercase tracking-wider">
          Default
        </p>
        <Textarea
          label="Description"
          placeholder="Enter description..."
          helperText="Optional helper text"
        />
      </div>
      <div className="w-72">
        <p className="m-0 text-sm font-semibold text-semantic-text-muted mb-2 uppercase tracking-wider">
          Error
        </p>
        <Textarea
          label="Description"
          placeholder="Enter description..."
          error="This field is required"
          defaultValue="Invalid input"
        />
      </div>
    </div>
  ),
};

// All Sizes - side-by-side default vs sm
export const AllSizes: Story = {
  name: "All sizes",
  render: () => (
    <div className="flex gap-6">
      <div className="w-72">
        <p className="m-0 text-sm font-semibold text-semantic-text-muted mb-2 uppercase tracking-wider">
          Default
        </p>
        <Textarea
          label="Description"
          placeholder="Default size textarea..."
        />
      </div>
      <div className="w-72">
        <p className="m-0 text-sm font-semibold text-semantic-text-muted mb-2 uppercase tracking-wider">
          Small
        </p>
        <Textarea
          size="sm"
          label="Description"
          placeholder="Small size textarea..."
        />
      </div>
    </div>
  ),
};
