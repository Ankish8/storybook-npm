import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./toast";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Position of the toast container",
    },
    closeButton: {
      control: "boolean",
      description: "Show close button on toasts",
    },
    duration: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
      description: "Duration before auto-dismiss (ms)",
    },
    richColors: {
      control: "boolean",
      description: "Use rich variant colors",
    },
    expand: {
      control: "boolean",
      description: "Expand toasts on hover",
    },
    visibleToasts: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum visible toasts",
    },
  },
  decorators: [
    (Story, context) => (
      <div style={{ minHeight: "400px", padding: "20px" }}>
        <Story />
        <Toaster {...context.args} />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component for triggering toasts
const ToastTriggers = () => (
  <div className="tw-flex tw-flex-wrap tw-gap-3">
    <Button onClick={() => toast("Event has been created")}>
      Default Toast
    </Button>
    <Button
      variant="success"
      onClick={() =>
        toast.success("Success!", {
          description: "Your changes have been saved successfully.",
        })
      }
    >
      Success Toast
    </Button>
    <Button
      variant="destructive"
      onClick={() =>
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        })
      }
    >
      Error Toast
    </Button>
    <Button
      variant="outline"
      onClick={() =>
        toast.warning("Warning", {
          description: "This action cannot be undone.",
        })
      }
    >
      Warning Toast
    </Button>
    <Button
      variant="ghost"
      onClick={() =>
        toast.info("Info", {
          description: "Here's some helpful information.",
        })
      }
    >
      Info Toast
    </Button>
  </div>
);

export const Default: Story = {
  render: () => <ToastTriggers />,
  args: {
    position: "bottom-right",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-semibold">Click buttons to show toasts:</h3>
      <ToastTriggers />
    </div>
  ),
  args: {
    position: "bottom-right",
    richColors: true,
  },
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Event deleted", {
          description: "The event has been removed from your calendar.",
          action: {
            label: "Undo",
            onClick: () => toast.success("Action undone!"),
          },
        })
      }
    >
      Show Toast with Action
    </Button>
  ),
  args: {
    position: "bottom-right",
  },
};

export const WithDescription: Story = {
  render: () => (
    <div className="tw-flex tw-gap-3">
      <Button
        onClick={() =>
          toast.success("Webhook created", {
            description: "Your webhook endpoint is now active and listening for events.",
          })
        }
      >
        With Description
      </Button>
      <Button
        variant="outline"
        onClick={() => toast("Simple message without description")}
      >
        Without Description
      </Button>
    </div>
  ),
  args: {
    position: "bottom-right",
  },
};

export const PromiseToast: Story = {
  render: () => (
    <Button
      onClick={() => {
        const promise = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(promise, {
          loading: "Saving changes...",
          success: "Changes saved successfully!",
          error: "Failed to save changes",
        });
      }}
    >
      Show Promise Toast
    </Button>
  ),
  args: {
    position: "bottom-right",
  },
};

export const CustomDuration: Story = {
  render: () => (
    <div className="tw-flex tw-gap-3">
      <Button
        onClick={() =>
          toast("Quick toast (2s)", {
            duration: 2000,
          })
        }
      >
        2 Seconds
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Long toast (10s)", {
            duration: 10000,
          })
        }
      >
        10 Seconds
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast("Persistent toast", {
            duration: Infinity,
            description: "This toast won't auto-dismiss. Click the X to close.",
          })
        }
      >
        Persistent
      </Button>
    </div>
  ),
  args: {
    position: "bottom-right",
  },
};

export const Positions: Story = {
  render: () => (
    <div className="tw-grid tw-grid-cols-3 tw-gap-3">
      <Button size="sm" onClick={() => toast("Top Left", { position: "top-left" })}>
        Top Left
      </Button>
      <Button size="sm" onClick={() => toast("Top Center", { position: "top-center" })}>
        Top Center
      </Button>
      <Button size="sm" onClick={() => toast("Top Right", { position: "top-right" })}>
        Top Right
      </Button>
      <Button size="sm" onClick={() => toast("Bottom Left", { position: "bottom-left" })}>
        Bottom Left
      </Button>
      <Button size="sm" onClick={() => toast("Bottom Center", { position: "bottom-center" })}>
        Bottom Center
      </Button>
      <Button size="sm" onClick={() => toast("Bottom Right", { position: "bottom-right" })}>
        Bottom Right
      </Button>
    </div>
  ),
  args: {
    position: "bottom-right",
  },
};

export const DismissToasts: Story = {
  render: () => {
    let toastId: string | number;
    return (
      <div className="tw-flex tw-gap-3">
        <Button
          onClick={() => {
            toastId = toast("Dismissable toast", {
              duration: Infinity,
              description: "This toast can be dismissed programmatically.",
            });
          }}
        >
          Show Toast
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss(toastId)}>
          Dismiss Last
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss All
        </Button>
      </div>
    );
  },
  args: {
    position: "bottom-right",
  },
};

export const MultipleToasts: Story = {
  render: () => (
    <Button
      onClick={() => {
        toast.success("First notification");
        setTimeout(() => toast.info("Second notification"), 300);
        setTimeout(() => toast.warning("Third notification"), 600);
        setTimeout(() => toast.error("Fourth notification"), 900);
      }}
    >
      Show Multiple Toasts
    </Button>
  ),
  args: {
    position: "bottom-right",
    visibleToasts: 4,
  },
};

export const TopRight: Story = {
  render: () => <ToastTriggers />,
  args: {
    position: "top-right",
  },
};

export const TopCenter: Story = {
  render: () => <ToastTriggers />,
  args: {
    position: "top-center",
  },
};
