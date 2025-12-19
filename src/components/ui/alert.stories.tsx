import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Button } from "./button";
import { Bell, Rocket, Shield } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "success",
        "error",
        "destructive",
        "warning",
        "info",
      ],
      description: "Visual style variant for the alert",
    },
    closable: {
      control: "boolean",
      description: "Show close button",
    },
    showIcon: {
      control: "boolean",
      description: "Show default icon based on variant",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling.
        </AlertDescription>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <AlertTitle>Webhook Successfully created!</AlertTitle>
        <AlertDescription>
          Please enable it from list of webhooks.
        </AlertDescription>
      </>
    ),
    closable: true,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: (
      <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Maximum 10 rows allowed.</AlertDescription>
      </>
    ),
    closable: true,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: (
      <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your session will expire in 5 minutes.
        </AlertDescription>
      </>
    ),
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: (
      <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          A new version is available. Please refresh the page.
        </AlertDescription>
      </>
    ),
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <AlertTitle>Destructive Action</AlertTitle>
        <AlertDescription>
          This action cannot be undone. Please proceed with caution.
        </AlertDescription>
      </>
    ),
  },
};

export const WithCustomIcon: Story = {
  args: {
    variant: "info",
    icon: <Rocket className="size-5" />,
    children: (
      <>
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          Check out the new dashboard analytics!
        </AlertDescription>
      </>
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    variant: "success",
    children: (
      <>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Operation completed without an icon.
        </AlertDescription>
      </>
    ),
  },
};

export const Closable: Story = {
  args: {
    variant: "info",
    closable: true,
    children: (
      <>
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>
          Click the X button to dismiss this alert.
        </AlertDescription>
      </>
    ),
  },
};

export const WithSingleAction: Story = {
  args: {
    variant: "error",
    action: <Button size="sm">Retry</Button>,
    children: (
      <>
        <AlertTitle>Upload Failed</AlertTitle>
        <AlertDescription>
          Failed to upload file. Please try again.
        </AlertDescription>
      </>
    ),
  },
};

export const WithTwoActions: Story = {
  args: {
    variant: "warning",
    action: <Button size="sm">Save</Button>,
    secondaryAction: (
      <Button variant="ghost" size="sm">
        Discard
      </Button>
    ),
    children: (
      <>
        <AlertTitle>Unsaved Changes</AlertTitle>
        <AlertDescription>
          You have unsaved changes that will be lost if you leave.
        </AlertDescription>
      </>
    ),
  },
};

// Controlled visibility demo
const ControlledDemo = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(!open)}>
        {open ? "Hide Alert" : "Show Alert"}
      </Button>
      <Alert
        variant="success"
        open={open}
        onClose={() => setOpen(false)}
        closable
      >
        <AlertTitle>Controlled Alert</AlertTitle>
        <AlertDescription>
          This alert's visibility is controlled by external state.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const ControlledVisibility: Story = {
  render: () => <ControlledDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Default alert styling.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review before continuing.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Here is some helpful information.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>This action is irreversible.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert
        variant="warning"
        closable
        action={<Button size="sm">Update Now</Button>}
        secondaryAction={
          <Button variant="ghost" size="sm">
            Remind Later
          </Button>
        }
      >
        <AlertTitle>System Update Required</AlertTitle>
        <AlertDescription>
          A critical security update is available. We recommend updating
          immediately to protect your account and data.
        </AlertDescription>
      </Alert>

      <Alert variant="success" icon={<Shield className="size-5" />} closable>
        <AlertTitle>Security Check Complete</AlertTitle>
        <AlertDescription>
          Your account security settings have been verified. All systems are
          secure.
        </AlertDescription>
      </Alert>

      <Alert
        variant="info"
        icon={<Bell className="size-5" />}
        action={
          <Button size="sm" variant="outline">
            Enable
          </Button>
        }
      >
        <AlertTitle>Enable Notifications</AlertTitle>
        <AlertDescription>
          Stay updated with real-time alerts for important account activities.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const ScreenshotReference: Story = {
  name: "Screenshot Reference",
  render: () => (
    <div className="space-y-4">
      <Alert variant="error" closable>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Maximum 10 rows allowed.</AlertDescription>
      </Alert>
      <Alert variant="success" closable>
        <AlertTitle>Webhook Successfully created!</AlertTitle>
        <AlertDescription>
          Please enable it from list of webhooks.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
