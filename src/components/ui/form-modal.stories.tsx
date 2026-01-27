import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormModal } from "./form-modal";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof FormModal> = {
  title: "Components/FormModal",
  component: FormModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A reusable modal component for forms with consistent layout and spacing.

## Installation
\`\`\`bash
npx myoperator-ui add form-modal
\`\`\`

## Features
- Consistent form layout and spacing
- Built-in Save/Cancel buttons with loading states
- Customizable button text
- Support for all dialog sizes
- Optional description text

## Usage
\`\`\`tsx
<FormModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Profile"
  description="Make changes to your profile"
  onSave={handleSave}
  loading={loading}
>
  <div className="grid gap-2">
    <label htmlFor="name" className="text-sm font-medium">Name</label>
    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
  </div>
</FormModal>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls modal visibility",
    },
    title: {
      control: "text",
      description: "Modal title",
    },
    description: {
      control: "text",
      description: "Optional modal description",
    },
    saveButtonText: {
      control: "text",
      description: "Text for save button",
    },
    cancelButtonText: {
      control: "text",
      description: "Text for cancel button",
    },
    loading: {
      control: "boolean",
      description: "Loading state for save button",
    },
    disableSave: {
      control: "boolean",
      description: "Disable the save button",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl", "full"],
      description: "Size of the modal",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormModal>;

/**
 * Basic form modal with text inputs.
 * Click the button to open the modal.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("Pedro Duarte");
    const [email, setEmail] = useState("pedro@example.com");
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 1000);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit Profile</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Edit Profile"
          description="Make changes to your profile here. Click save when you're done."
          onSave={handleSave}
          loading={loading}
        >
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-semantic-text-secondary">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-semantic-text-secondary">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal without description text.
 */
export const WithoutDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");

    return (
      <>
        <Button onClick={() => setOpen(true)}>Add User</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Add New User"
          onSave={() => setOpen(false)}
          saveButtonText="Create"
        >
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium text-semantic-text-secondary">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal with custom button text and loading state.
 */
export const CustomButtons: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 2000);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Create Project</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Create New Project"
          description="Enter the project details below."
          onSave={handleCreate}
          loading={loading}
          saveButtonText="Create Project"
          cancelButtonText="Discard"
        >
          <div className="grid gap-2">
            <label htmlFor="project-name" className="text-sm font-medium text-semantic-text-secondary">
              Project Name
            </label>
            <Input id="project-name" placeholder="My Awesome Project" />
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal with select dropdown.
 */
export const WithSelect: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("");

    return (
      <>
        <Button onClick={() => setOpen(true)}>Assign Role</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Assign User Role"
          description="Select a role for the user."
          onSave={() => setOpen(false)}
          saveButtonText="Assign"
        >
          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm font-medium text-semantic-text-secondary">
              Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal with multiple field types (text, number, checkbox).
 */
export const MultipleFieldTypes: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("100");
    const [notify, setNotify] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Set Alert</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Configure Alert"
          description="Set your notification preferences."
          onSave={() => setOpen(false)}
        >
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium text-semantic-text-secondary">
              Threshold Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted">
                $
              </span>
              <Input
                id="amount"
                type="number"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="notify"
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked as boolean)}
            />
            <label htmlFor="notify" className="text-sm font-medium text-semantic-text-secondary">
              Send email notifications
            </label>
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal with disabled save button based on validation.
 */
export const WithValidation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const isValidEmail = email.includes("@") && email.includes(".");

    return (
      <>
        <Button onClick={() => setOpen(true)}>Enter Email</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Email Required"
          description="Please enter a valid email address."
          onSave={() => setOpen(false)}
          disableSave={!isValidEmail}
        >
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-semantic-text-secondary">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              state={email && !isValidEmail ? "error" : "default"}
            />
            {email && !isValidEmail && (
              <p className="text-xs text-semantic-error-primary">
                Please enter a valid email address
              </p>
            )}
          </div>
        </FormModal>
      </>
    );
  },
};

/**
 * Form modal in different sizes.
 */
export const Sizes: Story = {
  render: () => {
    const [openSm, setOpenSm] = useState(false);
    const [openLg, setOpenLg] = useState(false);

    return (
      <div className="flex gap-2">
        <Button onClick={() => setOpenSm(true)} size="sm">
          Small
        </Button>
        <Button onClick={() => setOpenLg(true)} size="sm">
          Large
        </Button>

        <FormModal
          open={openSm}
          onOpenChange={setOpenSm}
          title="Small Form"
          size="sm"
          onSave={() => setOpenSm(false)}
        >
          <div className="grid gap-2">
            <label htmlFor="small-input" className="text-sm font-medium text-semantic-text-secondary">
              Input
            </label>
            <Input id="small-input" placeholder="Small modal" />
          </div>
        </FormModal>

        <FormModal
          open={openLg}
          onOpenChange={setOpenLg}
          title="Large Form"
          size="lg"
          onSave={() => setOpenLg(false)}
        >
          <div className="grid gap-2">
            <label htmlFor="large-input" className="text-sm font-medium text-semantic-text-secondary">
              Input
            </label>
            <Input id="large-input" placeholder="Large modal" />
          </div>
        </FormModal>
      </div>
    );
  },
};

/**
 * Form modal with complex layout (two columns).
 */
export const ComplexLayout: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit Address</Button>
        <FormModal
          open={open}
          onOpenChange={setOpen}
          title="Edit Address"
          description="Update your shipping address."
          onSave={() => setOpen(false)}
          size="lg"
        >
          <div className="grid gap-2">
            <label htmlFor="street" className="text-sm font-medium text-semantic-text-secondary">
              Street Address
            </label>
            <Input id="street" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="city" className="text-sm font-medium text-semantic-text-secondary">
                City
              </label>
              <Input id="city" placeholder="New York" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="zip" className="text-sm font-medium text-semantic-text-secondary">
                ZIP Code
              </label>
              <Input id="zip" placeholder="10001" />
            </div>
          </div>
        </FormModal>
      </>
    );
  },
};
