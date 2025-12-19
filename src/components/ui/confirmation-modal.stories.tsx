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
        component: `
A simple confirmation modal for yes/no decisions. Unlike DeleteConfirmationModal,
this doesn't require text input - just a simple confirm or cancel action.

## Installation
\`\`\`bash
npx myoperator-ui add confirmation-modal
\`\`\`

## Features
- Simple yes/no confirmation
- Default and destructive button variants
- Loading state support
- Controlled and uncontrolled modes
- Customizable button text
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
      trigger={
        <Button>Open Confirmation</Button>
      }
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
