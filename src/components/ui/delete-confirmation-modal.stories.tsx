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
        component: `A confirmation modal that requires users to type confirmation text to prevent accidental deletions.

\`\`\`bash
npx myoperator-ui add delete-confirmation-modal
\`\`\`

## Import

\`\`\`tsx
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
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
      <td style="padding: 12px 16px;">Input Field</td>
      <td style="padding: 12px 16px;">Default</td>
      <td style="padding: 12px 16px;">Confirmation text input</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">Full width</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Button Variant</td>
      <td style="padding: 12px 16px;">Destructive</td>
      <td style="padding: 12px 16px;">Delete button style</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">Destructive variant</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Default Confirm Text</td>
      <td style="padding: 12px 16px;">—</td>
      <td style="padding: 12px 16px;">Required text to type</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">DELETE (case-sensitive)</td>
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
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm text-muted-foreground</code></td>
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

// Usage guidelines
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Guidelines for using delete confirmation modals effectively.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="w-40">
          <DeleteConfirmationModal
            trigger={<Button variant="destructive">Delete Account</Button>}
            itemName="account"
            description="This action is permanent."
            onConfirm={() => console.log("Deleted!")}
          />
        </div>
        <div>
          <p className="font-medium text-sm">High-Impact Deletion</p>
          <p className="text-sm text-gray-600">
            Use for important deletions like user accounts, projects, or large datasets
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-40">
          <DeleteConfirmationModal
            trigger={<Button variant="destructive">Delete File</Button>}
            itemName="file"
            onConfirm={() => console.log("Deleted!")}
          />
        </div>
        <div>
          <p className="font-medium text-sm">Standard Deletion</p>
          <p className="text-sm text-gray-600">
            Use for regular deletions of items, records, or documents
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
        story: "Best practices for delete confirmation modals.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {/* Clear consequences */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Delete User</Button>}
              itemName="user account"
              description="All associated data, files, and settings will be permanently removed. This cannot be undone."
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Clearly explain the consequences of deletion with detailed description.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Delete</Button>}
              itemName="item"
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't delete without explanation or with vague wording.
          </p>
        </div>
      </div>

      {/* Meaningful confirmation text */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Remove Integration</Button>}
              title="Remove Slack Integration?"
              confirmText="REMOVE INTEGRATION"
              deleteButtonText="Remove Integration"
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Use custom confirmation text that matches the action being deleted.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Delete</Button>}
              itemName="anything"
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't always use generic "DELETE" - tailor it to the specific action.
          </p>
        </div>
      </div>

      {/* Irreversible data */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Delete Permanently</Button>}
              itemName="data"
              description="This permanent deletion cannot be recovered from backups."
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Use for truly irreversible actions. Include clear warnings.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <DeleteConfirmationModal
              trigger={<Button variant="destructive">Remove</Button>}
              itemName="item"
              description="You can restore this from trash later."
              onConfirm={() => console.log("Deleted!")}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use delete confirmation for soft deletes or reversible actions.
          </p>
        </div>
      </div>
    </div>
  ),
};
