import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon, PhoneCallIcon, SearchIcon, InboxIcon } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Button } from "./button";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A centered empty state component for displaying when there is no data to show. Supports an icon, title, description, and optional action buttons.

\`\`\`bash
npx myoperator-ui add empty-state
\`\`\`

## Import

\`\`\`tsx
import { EmptyState } from "@/components/ui/empty-state"
\`\`\`

## Usage

\`\`\`tsx
<EmptyState
  icon={<PhoneCallIcon className="size-10" />}
  title="Setup Calling API"
  description="Your environment is ready. Click the button below to generate your production API keys."
  actions={
    <>
      <Button>Generate Credentials</Button>
      <Button variant="outline">How to setup</Button>
    </>
  }
/>
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
      <td style="padding: 12px 16px;">Icon Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary-surface</code></td>
      <td style="padding: 12px 16px;">Icon circle background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EBECEE; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Heading text color</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #101828; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Subtitle / description text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Icon Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Icon color inside the circle</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #344054; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false },
    actions: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    title: "Setup Calling API",
    description:
      "Your environment is ready. Click the button below to generate your production API keys.",
  },
  render: (args) => (
    <EmptyState
      {...args}
      icon={<PhoneCallIcon className="size-10" />}
      actions={
        <>
          <Button>Generate Credentials</Button>
          <Button variant="outline">How to setup</Button>
        </>
      }
    />
  ),
};

export const WithIcon: Story = {
  name: "With Icon",
  render: () => (
    <EmptyState
      icon={<PhoneCallIcon className="size-10" />}
      title="Setup Calling API"
      description="Your environment is ready. Click the button below to generate your production API keys."
      actions={
        <>
          <Button>Generate Credentials</Button>
          <Button variant="outline">How to setup</Button>
        </>
      }
    />
  ),
};

export const NoButtons: Story = {
  name: "Without Action Buttons",
  render: () => (
    <EmptyState
      icon={<FileTextIcon className="size-10" />}
      title="No statement found"
      description="Your environment is ready. Click the button below to generate your production API keys and endpoints."
    />
  ),
};

export const NoIcon: Story = {
  name: "Without Icon",
  render: () => (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
      actions={<Button>Clear filters</Button>}
    />
  ),
};

export const SearchEmpty: Story = {
  name: "Search Empty State",
  render: () => (
    <EmptyState
      icon={<SearchIcon className="size-10" />}
      title="No results found"
      description="We couldn't find anything matching your search. Try different keywords."
      actions={<Button variant="outline">Clear search</Button>}
    />
  ),
};

export const InboxEmpty: Story = {
  name: "Inbox Empty State",
  render: () => (
    <EmptyState
      icon={<InboxIcon className="size-10" />}
      title="Your inbox is empty"
      description="When you receive messages they will appear here."
    />
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="flex flex-col gap-8 divide-y">
      <EmptyState
        icon={<PhoneCallIcon className="size-10" />}
        title="With Icon + Actions"
        description="Icon, title, description, and action buttons."
        actions={
          <>
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary</Button>
          </>
        }
      />
      <EmptyState
        icon={<FileTextIcon className="size-10" />}
        title="With Icon, No Actions"
        description="Icon, title, and description — no buttons."
      />
      <EmptyState
        title="No Icon"
        description="Title and description only, without an icon circle."
        actions={<Button>Take action</Button>}
      />
    </div>
  ),
};
