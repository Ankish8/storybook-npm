import type { Meta, StoryObj } from "@storybook/react";
import { Phone } from "lucide-react";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Avatar component for displaying user identity via image or initials. Supports soft and filled variants, five sizes, and optional status indicator dots for online presence.

\`\`\`bash
npx myoperator-ui add avatar
\`\`\`

## Import

\`\`\`tsx
import { Avatar, getInitials } from "@myoperator/ui"
\`\`\`

## Usage

\`\`\`tsx
{/* Basic — auto-generates initials from name */}
<Avatar name="Ankish Sachdeva" />

{/* Filled variant with status */}
<Avatar name="John Doe" variant="filled" size="lg" status="online" />

{/* With image */}
<Avatar src="/photo.jpg" alt="Profile" status="online" />

{/* Custom initials */}
<Avatar initials="AS" size="xs" />
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
      <td style="padding: 12px 16px;">Soft Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-grey</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Soft Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Filled Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">343E55</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Filled Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-inverted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">FFFFFF</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Online Status</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-success-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">17B26A</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #17B26A; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Busy Status</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Away Status</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-warning-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F79009</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F79009; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Offline Status</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-grey</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Avatar Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Font Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">xs</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">24px (size-6)</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">10px / SemiBold (600)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-[10px] font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">sm</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">32px (size-8)</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / SemiBold (600)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">md</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px (size-10)</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold (600)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">lg</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">48px (size-12)</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold (600)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">xl</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">64px (size-16)</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">18px / SemiBold (600)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-lg font-semibold</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name used to auto-generate initials and aria-label",
    },
    src: {
      control: "text",
      description: "Image URL — renders an <img> instead of initials",
    },
    alt: {
      control: "text",
      description: "Alt text for the image (defaults to name)",
    },
    initials: {
      control: "text",
      description: 'Override auto-generated initials (e.g., "AS")',
    },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "busy", "away"],
      description: "Status indicator dot shown at bottom-right",
    },
    variant: {
      control: "select",
      options: ["soft", "filled"],
      description: "The visual style of the avatar",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "The size of the avatar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview
export const Overview: Story = {
  args: {
    name: "Ankish Sachdeva",
    variant: "soft",
    size: "md",
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar name="Ankish Sachdeva" size={size} />
          <p className="m-0 text-xs text-semantic-text-muted">{size}</p>
        </div>
      ))}
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["soft", "filled"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Avatar name="Ankish Sachdeva" variant={variant} size="lg" />
          <p className="m-0 text-xs text-semantic-text-muted">{variant}</p>
        </div>
      ))}
    </div>
  ),
};

// With Status
export const WithStatus: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["soft", "filled"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <p className="m-0 text-sm font-medium text-semantic-text-primary capitalize">
            {variant}
          </p>
          <div className="flex items-center gap-6">
            {(["online", "offline", "busy", "away"] as const).map((status) => (
              <div key={status} className="flex flex-col items-center gap-2">
                <Avatar
                  name="Ankish Sachdeva"
                  variant={variant}
                  size="lg"
                  status={status}
                />
                <p className="m-0 text-xs text-semantic-text-muted">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// With Image
export const WithImage: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            alt="User avatar"
            size={size}
            status="online"
          />
          <p className="m-0 text-xs text-semantic-text-muted">{size}</p>
        </div>
      ))}
    </div>
  ),
};

// With Custom Initials
export const WithCustomInitials: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar initials="AS" size="lg" variant="soft" />
        <p className="m-0 text-xs text-semantic-text-muted">
          initials=&quot;AS&quot;
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar initials="JD" size="lg" variant="filled" />
        <p className="m-0 text-xs text-semantic-text-muted">
          initials=&quot;JD&quot;
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar initials="MO" size="lg" variant="soft" status="online" />
        <p className="m-0 text-xs text-semantic-text-muted">
          initials + status
        </p>
      </div>
    </div>
  ),
};

// Composition Example — Contact List
const contacts = [
  {
    name: "Ankish Sachdeva",
    phone: "+91 98765 43210",
    status: "online" as const,
  },
  {
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    status: "busy" as const,
  },
  {
    name: "Rahul Gupta",
    phone: "+91 76543 21098",
    status: "away" as const,
  },
  {
    name: "Sneha Patel",
    phone: "+91 65432 10987",
    status: "offline" as const,
  },
  {
    name: "Amit Kumar",
    phone: "+91 54321 09876",
    status: "online" as const,
  },
];

export const CompositionExample: Story = {
  name: "Use Case: Contact List",
  render: () => (
    <div className="w-[320px] rounded-lg border border-semantic-border-layout bg-background">
      <div className="border-b border-semantic-border-layout px-4 py-3">
        <p className="m-0 text-sm font-semibold text-semantic-text-primary">
          Team Members
        </p>
      </div>
      <div className="flex flex-col">
        {contacts.map((contact, index) => (
          <div
            key={contact.name}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-semantic-bg-hover transition-colors cursor-pointer",
              index < contacts.length - 1 &&
                "border-b border-semantic-border-layout"
            )}
          >
            <Avatar
              name={contact.name}
              variant="filled"
              size="sm"
              status={contact.status}
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="m-0 text-sm font-medium text-semantic-text-primary truncate">
                {contact.name}
              </p>
              <div className="flex items-center gap-1.5">
                <Phone className="size-3 text-semantic-text-muted shrink-0" />
                <p className="m-0 text-xs text-semantic-text-muted truncate">
                  {contact.phone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Helper — cn is used in CompositionExample
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
