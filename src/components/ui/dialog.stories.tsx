import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  subcomponents: {
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
  } as Record<string, React.ComponentType<unknown>>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A modal dialog component built on Radix UI Dialog.

## Installation
\`\`\`bash
npx myoperator-ui add dialog
\`\`\`

## Features
- Accessible modal dialog with focus management
- Multiple size variants (sm, default, lg, xl, full)
- Controlled and uncontrolled modes
- Animated open/close transitions
- Optional close button

## Usage
\`\`\`tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent size="default">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Dialog (Root) props
    open: {
      control: { type: "boolean" },
      description: "Controlled open state of the dialog",
      table: { category: "Dialog" },
    },
    defaultOpen: {
      control: { type: "boolean" },
      description: "Default open state for uncontrolled usage",
      table: { category: "Dialog" },
    },
    modal: {
      control: { type: "boolean" },
      description:
        "Whether the dialog is modal (blocks interaction with rest of page)",
      table: { category: "Dialog", defaultValue: { summary: "true" } },
    },
    onOpenChange: {
      action: "openChanged",
      description: "Callback when open state changes",
      table: { category: "Dialog" },
    },
    // DialogContent props (documented for reference)
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl", "full"],
      description: "Size of the dialog content",
      table: {
        category: "DialogContent",
        defaultValue: { summary: "default" },
      },
    },
    hideCloseButton: {
      control: { type: "boolean" },
      description: "Hide the X close button in the top-right corner",
      table: { category: "DialogContent", defaultValue: { summary: "false" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground - click the button to open the dialog.
 * Use the controls to adjust size and hideCloseButton.
 */
export const Playground: Story = {
  render: (args) => {
    const size =
      (args as { size?: "sm" | "default" | "lg" | "xl" | "full" }).size ||
      "default";
    const hideCloseButton =
      (args as { hideCloseButton?: boolean }).hideCloseButton || false;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent size={size} hideCloseButton={hideCloseButton}>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is the dialog description. Adjust the controls to see
              different configurations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Dialog content goes here.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  args: {
    size: "default",
    hideCloseButton: false,
  } as unknown as typeof Dialog.arguments,
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl", "full"],
      description: "Size of the dialog",
      table: { category: "DialogContent" },
    },
    hideCloseButton: {
      control: { type: "boolean" },
      description: "Hide the close button",
      table: { category: "DialogContent" },
    },
  },
};

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog. It provides context for the
            user about what action they are about to take.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Dialog content goes here.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Small
          </Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>
              This is a small dialog (max-w-sm).
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Default
          </Button>
        </DialogTrigger>
        <DialogContent size="default">
          <DialogHeader>
            <DialogTitle>Default Dialog</DialogTitle>
            <DialogDescription>
              This is the default size dialog (max-w-lg).
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Large
          </Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              This is a large dialog (max-w-2xl).
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            XL
          </Button>
        </DialogTrigger>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Extra Large Dialog</DialogTitle>
            <DialogDescription>
              This is an extra large dialog (max-w-4xl).
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const HideCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
          <DialogDescription>
            This dialog doesn't have a close button in the corner. You must use
            the action buttons below.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Dialog is {open ? "open" : "closed"}
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Controlled Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog's state is controlled externally.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
