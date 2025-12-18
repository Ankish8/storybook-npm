import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
An expandable/collapsible section component with single or multiple mode support.

\`\`\`bash
npx myoperator-ui add accordion
\`\`\`

## Import

\`\`\`tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@myoperator/ui"
\`\`\`

## Usage

\`\`\`tsx
<Accordion type="multiple" defaultValue={['item-1']}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Content here...</AccordionContent>
  </AccordionItem>
</Accordion>
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
      <td style="padding: 12px 16px;">Hover Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-subtle</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">FAFAFA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FAFAFA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Icon Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">343E55</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;">Trigger Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">Inherited</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Content</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">Inherited</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description:
        "Whether only one item can be open (single) or multiple items can be open at once",
    },
    variant: {
      control: "select",
      options: ["default", "bordered"],
      description: "Visual style variant",
    },
    defaultValue: {
      control: "object",
      description: "Default open items (array of item values)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is myOperator UI?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              myOperator UI is a collection of beautifully designed, accessible
              React components built with Tailwind CSS.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I install it?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              You can install components using the CLI: npx myoperator-ui add
              button
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it customizable?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              Yes! All components are fully customizable using Tailwind CSS
              classes and CSS variables.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const SingleMode: Story = {
  name: "Single Mode",
  render: () => (
    <div className="w-[400px]">
      <Accordion type="single" defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section One</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section one. Only one section can be open
              at a time.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section Two</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section two. Opening this will close
              section one.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section Three</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section three.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "In single mode, only one item can be open at a time. Opening a new item closes the previously open one.",
      },
    },
  },
};

export const MultipleMode: Story = {
  name: "Multiple Mode",
  render: () => (
    <div className="w-[400px]">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section One</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section one. Multiple sections can be
              open.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section Two</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section two. This is also open by default.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section Three</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This is the content for section three.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "In multiple mode, any number of items can be open simultaneously.",
      },
    },
  },
};

export const Bordered: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion variant="bordered" defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Account Settings</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              Manage your account settings and preferences here.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Notification Preferences</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              Configure how and when you receive notifications.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Privacy & Security</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              Review and update your privacy and security settings.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  name: "With Disabled Item",
  render: () => (
    <div className="w-[400px]">
      <Accordion variant="bordered">
        <AccordionItem value="item-1">
          <AccordionTrigger>Available Section</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This section is available and can be expanded.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Disabled Section</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This content won't be visible because the item is disabled.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Another Available Section</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This section is also available.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithoutChevron: Story = {
  name: "Without Chevron Icon",
  render: () => (
    <div className="w-[400px]">
      <Accordion variant="bordered">
        <AccordionItem value="item-1">
          <AccordionTrigger showChevron={false}>
            <span className="font-medium">Click to expand</span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              This trigger doesn't show a chevron icon.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

const ControlledExample = () => {
  const [value, setValue] = useState<string[]>(["item-1"]);

  return (
    <div className="w-[400px]">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setValue(["item-1"])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open First
        </button>
        <button
          onClick={() => setValue(["item-2"])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open Second
        </button>
        <button
          onClick={() => setValue([])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Close All
        </button>
        <button
          onClick={() => setValue(["item-1", "item-2", "item-3"])}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Open All
        </button>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Open items: {value.length > 0 ? value.join(", ") : "none"}
      </p>
      <Accordion value={value} onValueChange={setValue} variant="bordered">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section One</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">Content for section one.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section Two</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">Content for section two.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section Three</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">Content for section three.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Use the `value` and `onValueChange` props for controlled state management.",
      },
    },
  },
};

export const CustomContent: Story = {
  name: "Custom Content",
  render: () => (
    <div className="w-[400px]">
      <Accordion variant="bordered">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Online Users</span>
              <span className="ml-2 text-xs text-[#6B7280]">(24)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>Jane Smith</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-6 w-6 rounded-full bg-gray-200" />
                <span>Bob Johnson</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span>Offline Users</span>
              <span className="ml-2 text-xs text-[#6B7280]">(12)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              12 users are currently offline.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const FAQ: Story = {
  name: "FAQ Example",
  render: () => (
    <div className="w-[500px]">
      <h2 className="mb-4 text-lg font-semibold text-[#333333]">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" variant="bordered">
        <AccordionItem value="q1">
          <AccordionTrigger>
            <span className="font-medium text-[#333333]">
              How do I reset my password?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              To reset your password, click on the "Forgot Password" link on the
              login page. Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>
            <span className="font-medium text-[#333333]">
              Can I change my subscription plan?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              Yes, you can upgrade or downgrade your subscription plan at any
              time from your account settings. Changes will be reflected in your
              next billing cycle.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>
            <span className="font-medium text-[#333333]">
              How do I contact support?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[#6B7280]">
              You can reach our support team via email at support@example.com or
              through the live chat feature available in the bottom right corner
              of the dashboard.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
