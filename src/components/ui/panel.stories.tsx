import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Panel } from "./panel";
import { TextField } from "./text-field";
import { Button } from "./button";

const meta: Meta<typeof Panel> = {
  title: "Components/Panel",
  component: Panel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A collapsible side panel layout with a header, scrollable body, and optional footer. Used for detail views, settings, and edit forms alongside a main content area.

\`\`\`bash
npx myoperator-ui add panel
\`\`\`

## Import

\`\`\`tsx
import { Panel } from "@/components/ui/panel"
\`\`\`

## Usage

\`\`\`tsx
<Panel open={isOpen} title="Contact Details" onClose={() => setIsOpen(false)}>
  <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
  <TextField label="Email" value="email@example.com" disabled size="sm" />
</Panel>
\`\`\`

## Accessibility

- The panel renders as an \`<aside>\` element, providing a proper **complementary** landmark for screen readers
- When a \`title\` is provided, it is automatically used as the \`aria-label\` (can be overridden via props)
- Pressing **Escape** closes the panel when \`onClose\` is provided
- The close button has an \`aria-label="Close"\` for screen reader users
- When \`open={false}\`, the panel is marked \`aria-hidden="true"\` so screen readers skip it entirely
- When the panel opens, focus is moved into the panel automatically

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
      <td style="padding: 12px 16px;">Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Panel background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Left border, header/footer dividers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Header title color</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the panel is open",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description: "Panel title displayed in the header",
    },
    onClose: {
      action: "onClose",
      description: "Callback when close button is clicked",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Width of the panel",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    footer: {
      control: false,
      description: "Optional footer content (e.g., action buttons)",
    },
    header: {
      control: false,
      description:
        "Custom header content — replaces the default title + close button",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 500 }} className="flex justify-end bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    open: true,
    title: "Contact Details",
    size: "default",
  },
  render: (args) => (
    <Panel {...args}>
      <div className="flex flex-col gap-4 p-4">
        <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
        <TextField
          label="Email"
          value="aditi.kumar@example.com"
          disabled
          size="sm"
        />
        <TextField
          label="Phone"
          value="+91 98765 43210"
          disabled
          size="sm"
        />
        <TextField
          label="Company"
          value="MyOperator"
          disabled
          size="sm"
        />
      </div>
    </Panel>
  ),
};

// WithFooter - panel with action buttons in footer
export const WithFooter: Story = {
  name: "With Footer",
  args: {
    open: true,
    title: "Edit Contact",
    size: "default",
  },
  render: (args) => (
    <Panel
      {...args}
      footer={
        <>
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Save</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <TextField label="Name" placeholder="Enter name" size="sm" />
        <TextField label="Email" placeholder="Enter email" size="sm" />
        <TextField label="Phone" placeholder="Enter phone" size="sm" />
      </div>
    </Panel>
  ),
};

// WithCustomHeader - uses header prop with custom content
export const WithCustomHeader: Story = {
  name: "With Custom Header",
  args: {
    open: true,
    size: "default",
  },
  render: (args) => (
    <Panel
      {...args}
      header={
        <div className="flex items-center gap-3 px-4 h-14 border-b border-semantic-border-layout shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="size-8 rounded-full bg-semantic-primary-surface flex items-center justify-center text-sm font-semibold text-semantic-text-primary">
              AK
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-semantic-text-primary">
                Aditi Kumar
              </span>
              <span className="text-xs text-semantic-text-muted">
                Online
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
        <TextField
          label="Email"
          value="aditi.kumar@example.com"
          disabled
          size="sm"
        />
      </div>
    </Panel>
  ),
};

// Sizes - shows sm, default, lg side by side
export const Sizes: Story = {
  name: "Sizes",
  decorators: [
    (Story) => (
      <div style={{ height: 500 }} className="flex justify-end gap-4 bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <Panel open title="Small (sm)" size="sm" onClose={() => {}}>
        <div className="flex flex-col gap-4 p-4">
          <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
          <TextField label="Email" value="email@example.com" disabled size="sm" />
        </div>
      </Panel>
      <Panel open title="Default" size="default" onClose={() => {}}>
        <div className="flex flex-col gap-4 p-4">
          <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
          <TextField label="Email" value="email@example.com" disabled size="sm" />
        </div>
      </Panel>
      <Panel open title="Large (lg)" size="lg" onClose={() => {}}>
        <div className="flex flex-col gap-4 p-4">
          <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
          <TextField label="Email" value="email@example.com" disabled size="sm" />
        </div>
      </Panel>
    </>
  ),
};

// Collapsed - open=false to show collapsed state
export const Collapsed: Story = {
  name: "Collapsed",
  args: {
    open: false,
    title: "Contact Details",
    size: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `open` is set to `false`, the panel collapses to zero width with a smooth transition. The content is hidden via `overflow-hidden`.",
      },
    },
  },
  render: (args) => (
    <Panel {...args}>
      <div className="flex flex-col gap-4 p-4">
        <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
        <TextField label="Email" value="email@example.com" disabled size="sm" />
      </div>
    </Panel>
  ),
};
