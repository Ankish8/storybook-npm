import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A placeholder loading component with pulse animation for content loading states. Compose multiple skeletons to match your content layout.

\`\`\`bash
npx myoperator-ui add skeleton
\`\`\`

## Import

\`\`\`tsx
import { Skeleton } from "@/components/ui/skeleton"
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
      <td style="padding: 12px 16px;">Default Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-grey</code></td>
      <td style="padding: 12px 16px;">Standard skeleton background</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Subtle Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Low-contrast skeleton for lighter backgrounds</td>
    </tr>
  </tbody>
</table>

## Shapes

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Shape</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Default Dimensions</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Border Radius</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">line</td>
      <td style="padding: 12px 16px; font-family: monospace;">h-4 w-full</td>
      <td style="padding: 12px 16px; font-family: monospace;">rounded (4px)</td>
      <td style="padding: 12px 16px;">Text line placeholder</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">circle</td>
      <td style="padding: 12px 16px; font-family: monospace;">Set via width/height</td>
      <td style="padding: 12px 16px; font-family: monospace;">rounded-full</td>
      <td style="padding: 12px 16px;">Avatar placeholder</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">rectangle</td>
      <td style="padding: 12px 16px; font-family: monospace;">Set via width/height</td>
      <td style="padding: 12px 16px; font-family: monospace;">rounded (4px)</td>
      <td style="padding: 12px 16px;">Image, card, or block placeholder</td>
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
      options: ["default", "subtle"],
      description: "The visual style of the skeleton",
    },
    shape: {
      control: "select",
      options: ["line", "circle", "rectangle"],
      description: "The shape of the skeleton",
    },
    width: {
      control: "text",
      description: "Width (number for px, string for CSS value)",
    },
    height: {
      control: "text",
      description: "Height (number for px, string for CSS value)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    shape: "line",
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllShapes: Story = {
  name: "All Shapes",
  render: () => (
    <div className="flex items-start gap-8">
      <div className="flex flex-col items-center gap-2">
        <div style={{ width: 200 }}>
          <Skeleton shape="line" />
        </div>
        <span className="text-xs text-semantic-text-muted">line</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="circle" width={48} height={48} />
        <span className="text-xs text-semantic-text-muted">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="rectangle" width={120} height={80} />
        <span className="text-xs text-semantic-text-muted">rectangle</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: 300 }}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-semantic-text-muted">
          default
        </span>
        <Skeleton variant="default" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-semantic-text-muted">
          subtle
        </span>
        <Skeleton variant="subtle" />
      </div>
    </div>
  ),
};

export const TextBlock: Story = {
  name: "Text Block",
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: 300 }}>
      <Skeleton shape="line" />
      <Skeleton shape="line" />
      <Skeleton shape="line" width="80%" />
    </div>
  ),
};

export const CardSkeleton: Story = {
  name: "Card Skeleton",
  render: () => (
    <div
      className="flex flex-col gap-4 rounded border border-semantic-border-layout p-4"
      style={{ width: 320 }}
    >
      <Skeleton shape="rectangle" width="100%" height={160} />
      <div className="flex flex-col gap-2">
        <Skeleton shape="line" width="60%" />
        <Skeleton shape="line" />
        <Skeleton shape="line" width="80%" />
      </div>
    </div>
  ),
};

export const UserProfileSkeleton: Story = {
  name: "User Profile Skeleton",
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton shape="circle" width={48} height={48} />
      <div className="flex flex-col gap-2">
        <Skeleton shape="line" width={140} height={16} />
        <Skeleton shape="line" width={100} height={12} />
      </div>
    </div>
  ),
};

export const TableRowSkeleton: Story = {
  name: "Table Row Skeleton",
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: 500 }}>
      {[1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <Skeleton shape="circle" width={32} height={32} />
          <Skeleton shape="line" width="30%" height={14} />
          <Skeleton shape="line" width="20%" height={14} />
          <Skeleton shape="line" width="15%" height={14} />
        </div>
      ))}
    </div>
  ),
};
