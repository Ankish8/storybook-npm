import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { Button } from "./button";

const meta: Meta<typeof DeleteConfirmationModal> = {
  title: "Components/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A confirmation modal that requires the user to type a specific text (default: "DELETE") to confirm deletion.
This provides an extra layer of protection against accidental deletions.

## Installation
\`\`\`bash
npx myoperator-ui add delete-confirmation-modal
\`\`\`

## Features
- Requires exact text match to enable delete button
- Case-sensitive confirmation (must match exactly)
- Loading state support
- Customizable confirmation text
- Controlled and uncontrolled modes
- Resets input when closed
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls the visibility of the modal",
    },
    itemName: {
      control: "text",
      description: "Name of the item being deleted",
    },
    confirmText: {
      control: "text",
      description: "Text that must be typed to confirm",
    },
    loading: {
      control: "boolean",
      description: "Shows loading state on delete button",
    },
    deleteButtonText: {
      control: "text",
      description: "Custom text for delete button",
    },
    cancelButtonText: {
      control: "text",
      description: "Custom text for cancel button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground - click the button to open the modal.
 * Use the controls to adjust itemName, confirmText, loading, etc.
 */
export const Playground: Story = {
  render: (args) => (
    <DeleteConfirmationModal
      trigger={
        <Button variant="destructive">Delete Webhook</Button>
      }
      itemName={args.itemName as string}
      confirmText={args.confirmText as string}
      deleteButtonText={args.deleteButtonText as string}
      cancelButtonText={args.cancelButtonText as string}
      loading={args.loading as boolean}
      description={args.description as string}
      onConfirm={() => console.log("Deleted!")}
    />
  ),
  args: {
    itemName: "webhook",
    confirmText: "DELETE",
    deleteButtonText: "Delete",
    cancelButtonText: "Cancel",
    loading: false,
    description: "",
  },
};

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Webhook
        </Button>
        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          itemName="webhook"
          onConfirm={() => {
            console.log("Deleted!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const WithDescription: Story = {
  render: function WithDescriptionStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete User
        </Button>
        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          itemName="user account"
          description="This action cannot be undone. All associated data including files, settings, and history will be permanently removed."
          onConfirm={() => {
            console.log("User deleted!");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const CustomConfirmText: Story = {
  render: function CustomConfirmTextStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Project
        </Button>
        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          itemName="project"
          confirmText="REMOVE PROJECT"
          deleteButtonText="Remove Project"
          onConfirm={() => {
            console.log("Project removed!");
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
        console.log("Deleted successfully!");
      }, 2000);
    };

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete with Loading
        </Button>
        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          itemName="record"
          loading={loading}
          onConfirm={handleConfirm}
        />
      </>
    );
  },
};

export const WithTrigger: Story = {
  render: () => (
    <DeleteConfirmationModal
      trigger={
        <Button variant="destructive" size="sm">
          Delete Item
        </Button>
      }
      itemName="item"
      onConfirm={() => console.log("Deleted!")}
    />
  ),
};

export const CustomTitle: Story = {
  render: function CustomTitleStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Remove Integration
        </Button>
        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          title="Remove Slack Integration?"
          description="This will disconnect your workspace from Slack and remove all notification settings."
          deleteButtonText="Remove Integration"
          onConfirm={() => {
            console.log("Integration removed!");
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
        <DeleteConfirmationModal
          trigger={<Button variant="destructive">Default</Button>}
          itemName="item"
          onConfirm={() => console.log("Deleted!")}
        />
        <DeleteConfirmationModal
          trigger={<Button variant="outline">Custom Text</Button>}
          itemName="record"
          confirmText="CONFIRM"
          deleteButtonText="Confirm Delete"
          cancelButtonText="Go Back"
          onConfirm={() => console.log("Deleted!")}
        />
        <DeleteConfirmationModal
          trigger={<Button variant="ghost">With Description</Button>}
          itemName="file"
          description="This file will be permanently deleted from your storage."
          onConfirm={() => console.log("Deleted!")}
        />
      </div>
    </div>
  ),
};
