import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { Button } from "./button";

const meta: Meta<typeof ConfirmationModal> = {
  title: "Components/ConfirmationModal",
  component: ConfirmationModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A confirmation modal for simple yes/no decisions that don't require additional user input.

\`\`\`bash
npx myoperator-ui add confirmation-modal
\`\`\`

## Import

\`\`\`tsx
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Description</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Modal Width</td>
      <td style="padding: 12px 16px;">Small</td>
      <td style="padding: 12px 16px;">Maximum width for modal</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">384px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Button Spacing</td>
      <td style="padding: 12px 16px;">—</td>
      <td style="padding: 12px 16px;">Gap between action buttons</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">8px</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Confirm Variant</td>
      <td style="padding: 12px 16px;">Default / Destructive</td>
      <td style="padding: 12px 16px;">Visual style of confirm button</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">Button variants</td>
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
      <td style="padding: 12px 16px;">Title</td>
      <td style="padding: 12px 16px;">Heading/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">Body/Small</td>
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
    open: {
      control: { type: "boolean" },
      description: "Controls the visibility of the modal",
    },
    title: {
      control: { type: "text" },
      description: "Title of the modal",
    },
    description: {
      control: { type: "text" },
      description: "Description text",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "destructive"],
      description: "Visual style of confirm button",
    },
    loading: {
      control: { type: "boolean" },
      description: "Shows loading state on confirm button",
    },
    confirmButtonText: {
      control: { type: "text" },
      description: "Custom text for confirm button",
    },
    cancelButtonText: {
      control: { type: "text" },
      description: "Custom text for cancel button",
    },
    onConfirm: { action: "confirmed" },
    onCancel: { action: "cancelled" },
    onOpenChange: { action: "openChanged" },
    trigger: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground - click the button to open the modal.
 * Use the controls to adjust title, description, variant, etc.
 */
export const Playground: Story = {
  render: (args) => (
    <ConfirmationModal
      trigger={<Button>Open Confirmation</Button>}
      title={args.title as string}
      description={args.description as string}
      variant={args.variant as "default" | "destructive"}
      confirmButtonText={args.confirmButtonText as string}
      cancelButtonText={args.cancelButtonText as string}
      loading={args.loading as boolean}
      onConfirm={() => console.log("Confirmed!")}
    />
  ),
  args: {
    title: "Disable Webhook",
    description: "Are you sure you want to Disable Webhook?",
    variant: "default",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    loading: false,
  },
};

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Disable Webhook</Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Disable Webhook"
          description="Are you sure you want to Disable Webhook?"
          onConfirm={() => {
            console.log("Confirmed!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  render: function DestructiveStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Archive Project
        </Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Archive Project"
          description="This project will be archived and moved to the archive folder."
          variant="destructive"
          confirmButtonText="Archive"
          onConfirm={() => {
            console.log("Archived!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const WithCustomButtonText: Story = {
  render: function CustomButtonTextStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Save Changes
        </Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Save Changes?"
          description="Do you want to save your changes before leaving?"
          confirmButtonText="Save"
          cancelButtonText="Don't Save"
          onConfirm={() => {
            console.log("Saved!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const LoadingState: Story = {
  render: function LoadingStateStory() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        console.log("Action completed!");
      }, 2000);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Perform Action</Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Confirm Action"
          description="This action will be processed."
          loading={loading}
          onConfirm={handleConfirm}
        />
      </>
    );
  },
};

export const WithTrigger: Story = {
  render: () => (
    <ConfirmationModal
      trigger={
        <Button variant="outline" size="sm">
          Enable Feature
        </Button>
      }
      title="Enable Feature"
      description="This will enable the experimental feature for your account."
      confirmButtonText="Enable"
      onConfirm={() => console.log("Feature enabled!")}
    />
  ),
};

export const SimpleConfirmation: Story = {
  render: function SimpleConfirmationStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Logout</Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Logout"
          description="Are you sure you want to logout?"
          confirmButtonText="Logout"
          onConfirm={() => {
            console.log("Logged out!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <ConfirmationModal
          trigger={<Button>Default</Button>}
          title="Default Confirmation"
          description="This uses the default (primary) button style."
          onConfirm={() => console.log("Confirmed!")}
        />
        <ConfirmationModal
          trigger={<Button variant="destructive">Destructive</Button>}
          title="Destructive Confirmation"
          description="This uses the destructive button style."
          variant="destructive"
          confirmButtonText="Delete"
          onConfirm={() => console.log("Deleted!")}
        />
        <ConfirmationModal
          trigger={<Button variant="outline">Custom Text</Button>}
          title="Custom Button Text"
          description="This has custom button labels."
          confirmButtonText="Proceed"
          cancelButtonText="Go Back"
          onConfirm={() => console.log("Proceeded!")}
        />
      </div>
    </div>
  ),
};

export const TitleOnly: Story = {
  render: function TitleOnlyStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Quick Confirm</Button>
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Continue with action?"
          onConfirm={() => {
            console.log("Confirmed!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

// Usage guidelines
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Guidelines for using confirmation modals effectively.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="w-40">
          <ConfirmationModal
            trigger={<Button>Default</Button>}
            title="Disable Webhook?"
            description="Are you sure?"
            onConfirm={() => console.log("Confirmed!")}
          />
        </div>
        <div>
          <p className="font-medium text-sm">Default Variant</p>
          <p className="text-sm text-gray-600">
            For non-destructive confirmations like enabling/disabling features
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-40">
          <ConfirmationModal
            trigger={<Button variant="destructive">Destructive</Button>}
            title="Delete Project?"
            variant="destructive"
            confirmButtonText="Delete"
            onConfirm={() => console.log("Deleted!")}
          />
        </div>
        <div>
          <p className="font-medium text-sm">Destructive Variant</p>
          <p className="text-sm text-gray-600">
            For irreversible actions like deletions or permanent changes
          </p>
        </div>
      </div>
    </div>
  ),
};

// Do's and Don'ts
export const DosAndDonts: Story = {
  name: "Do's and Don'ts",
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: "Best practices for confirmation modals.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {/* Clear language */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button>Delete User</Button>}
              title="Delete user account?"
              description="This action is permanent and cannot be undone."
              variant="destructive"
              confirmButtonText="Delete Account"
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Use clear, direct language that explains what will happen.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button>Proceed</Button>}
              title="Are you sure?"
              description="Do you want to continue?"
              confirmButtonText="Yes"
              onConfirm={() => console.log("Confirmed!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use vague language that leaves users unsure of consequences.
          </p>
        </div>
      </div>

      {/* Button variant matching */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button variant="destructive">Archive</Button>}
              title="Archive project?"
              variant="destructive"
              confirmButtonText="Archive"
              onConfirm={() => console.log("Archived!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Use destructive variant for irreversible or dangerous actions.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button>Delete</Button>}
              title="Delete this item?"
              variant="default"
              confirmButtonText="Delete"
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use default variant for destructive actions.
          </p>
        </div>
      </div>

      {/* Simple vs Complex */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button>Publish</Button>}
              title="Publish changes?"
              description="Your changes will be live to all users."
              onConfirm={() => console.log("Published!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Use for simple yes/no decisions with a single action.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <ConfirmationModal
              trigger={<Button>Delete</Button>}
              title="Delete with confirmation?"
              description="For deletions, require typing DELETE instead."
              confirmButtonText="I understand"
              onConfirm={() => console.log("Confirmed!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use for complex actions. Use DeleteConfirmationModal instead.
          </p>
        </div>
      </div>
    </div>
  ),
};
