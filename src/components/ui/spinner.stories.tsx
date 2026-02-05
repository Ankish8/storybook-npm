import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A loading spinner component with customizable size and color variants. Uses a custom SVG circle with a visible track and animated arc.

\`\`\`bash
npx myoperator-ui add spinner
\`\`\`

## Import

\`\`\`tsx
import { Spinner } from "@/components/ui/spinner"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Default Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Primary brand color for default spinner</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Secondary Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Subdued spinner for secondary actions</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Muted Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Low-emphasis spinner for background tasks</td>
    </tr>
  </tbody>
</table>

## Sizes

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Dimensions</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Stroke Width</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">sm</td>
      <td style="padding: 12px 16px; font-family: monospace;">16px (size-4)</td>
      <td style="padding: 12px 16px; font-family: monospace;">3</td>
      <td style="padding: 12px 16px;">Inline with text, buttons</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">default</td>
      <td style="padding: 12px 16px; font-family: monospace;">24px (size-6)</td>
      <td style="padding: 12px 16px; font-family: monospace;">3</td>
      <td style="padding: 12px 16px;">Standard loading indicator</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">lg</td>
      <td style="padding: 12px 16px; font-family: monospace;">32px (size-8)</td>
      <td style="padding: 12px 16px; font-family: monospace;">2.5</td>
      <td style="padding: 12px 16px;">Section loading</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">xl</td>
      <td style="padding: 12px 16px; font-family: monospace;">48px (size-12)</td>
      <td style="padding: 12px 16px; font-family: monospace;">2</td>
      <td style="padding: 12px 16px;">Full-page loading</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "muted", "inverted", "current"],
      description: "The color variant of the spinner",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl"],
      description: "The size of the spinner",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for the spinner",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    size: "default",
    variant: "default",
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-semantic-text-muted">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="default" />
        <span className="text-xs text-semantic-text-muted">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-semantic-text-muted">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-semantic-text-muted">xl</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="default" />
        <span className="text-xs text-semantic-text-muted">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="secondary" />
        <span className="text-xs text-semantic-text-muted">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="muted" />
        <span className="text-xs text-semantic-text-muted">muted</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded bg-semantic-text-primary p-3">
        <Spinner variant="inverted" />
        <span className="text-xs text-white">inverted</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-semantic-success-primary">
        <Spinner variant="current" />
        <span className="text-xs text-semantic-text-muted">current</span>
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  name: "Inline with Text",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm text-semantic-text-primary">Loading...</span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner size="default" variant="secondary" />
        <span className="text-semantic-text-primary">
          Fetching data...
        </span>
      </div>
    </div>
  ),
};

export const InButton: Story = {
  name: "In Button",
  render: () => (
    <div className="flex gap-4">
      <button className="inline-flex items-center gap-2 rounded bg-semantic-primary px-4 py-2 text-sm font-medium text-white">
        <Spinner size="sm" variant="inverted" />
        Saving...
      </button>
      <button className="inline-flex items-center gap-2 rounded border border-semantic-border-layout bg-white px-4 py-2 text-sm font-medium text-semantic-text-primary">
        <Spinner size="sm" variant="current" />
        Loading...
      </button>
    </div>
  ),
};

export const CenteredLoading: Story = {
  name: "Centered Loading",
  render: () => (
    <div className="flex h-48 w-80 items-center justify-center rounded border border-semantic-border-layout">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-semantic-text-muted">
          Loading content...
        </span>
      </div>
    </div>
  ),
};
