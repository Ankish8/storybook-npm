import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster, toast, ToastAction } from "./toast";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Toast notifications display brief, auto-dismissing messages to inform users about actions or system events.

\`\`\`bash
npx myoperator-ui add toast
\`\`\`

## Import

\`\`\`tsx
import { Toaster, toast, ToastAction } from "@/components/ui/toast"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Variant</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Background</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Border</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Text Color</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Default</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">FFFFFF</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">E9EAEB</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">181D27</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border: 1px solid #E9EAEB; border-radius: 4px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Success</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">ECFDF3</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">17B26A/20</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">067647</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #ECFDF3; border: 1px solid #17B26A33; border-radius: 4px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">FEF3F2</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">F04438/20</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">B42318</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FEF3F2; border: 1px solid #F0443833; border-radius: 4px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Warning</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">FFFAEB</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">F79009/20</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">B54708</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFAEB; border: 1px solid #F7900933; border-radius: 4px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">EBF5FF</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">4275D6/20</code></td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">1849A9</code></td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EBF5FF; border: 1px solid #4275D633; border-radius: 4px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Radius</td>
      <td style="padding: 12px 16px;" colspan="3"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--radius</code></td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;" colspan="3"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">16px</code></td>
      <td style="padding: 12px 16px;">—</td>
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
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm opacity-90</code></td>
    </tr>
  </tbody>
</table>
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Document the toast() function options
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "400px", padding: "20px" }}>
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component for triggering toasts
const ToastTriggers = () => (
  <div className="tw-flex tw-flex-wrap tw-gap-3">
    <Button onClick={() => toast({ title: "Event has been created" })}>
      Default Toast
    </Button>
    <Button
      variant="success"
      onClick={() =>
        toast.success({
          title: "Success!",
          description: "Your changes have been saved successfully.",
        })
      }
    >
      Success Toast
    </Button>
    <Button
      variant="destructive"
      onClick={() =>
        toast.error({
          title: "Error",
          description: "Something went wrong. Please try again.",
        })
      }
    >
      Error Toast
    </Button>
    <Button
      variant="outline"
      onClick={() =>
        toast.warning({
          title: "Warning",
          description: "This action cannot be undone.",
        })
      }
    >
      Warning Toast
    </Button>
    <Button
      variant="ghost"
      onClick={() =>
        toast.info({
          title: "Info",
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
};

export const AllVariants: Story = {
  render: () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-semibold">
        Click buttons to show toasts:
      </h3>
      <ToastTriggers />
    </div>
  ),
};

// Interactive playground with controls
const PlaygroundComponent = ({
  variant,
  title,
  description,
}: {
  variant: "default" | "success" | "error" | "warning" | "info";
  title: string;
  description: string;
}) => {
  const handleClick = () => {
    const toastOptions = {
      title,
      description: description || undefined,
    };

    switch (variant) {
      case "success":
        toast.success(toastOptions);
        break;
      case "error":
        toast.error(toastOptions);
        break;
      case "warning":
        toast.warning(toastOptions);
        break;
      case "info":
        toast.info(toastOptions);
        break;
      default:
        toast(toastOptions);
    }
  };

  return (
    <div className="tw-space-y-4">
      <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-space-y-2">
        <p className="tw-text-sm tw-text-gray-600">
          <strong>Variant:</strong> {variant}
        </p>
        <p className="tw-text-sm tw-text-gray-600">
          <strong>Title:</strong> {title}
        </p>
        {description && (
          <p className="tw-text-sm tw-text-gray-600">
            <strong>Description:</strong> {description}
          </p>
        )}
      </div>
      <Button onClick={handleClick}>Show Toast</Button>
    </div>
  );
};

export const Playground: Story = {
  render: (args) => <PlaygroundComponent {...args} />,
  args: {
    variant: "success",
    title: "Toast Title",
    description: "This is the toast description",
    showIcon: true,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
      description: "The visual style variant of the toast",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "default" },
      },
    },
    title: {
      control: "text",
      description: "The main title text of the toast",
      table: {
        type: { summary: "string" },
      },
    },
    description: {
      control: "text",
      description: "Optional description text below the title",
      table: {
        type: { summary: "string" },
      },
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the variant icon",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast({
          title: "Event deleted",
          description: "The event has been removed from your calendar.",
          action: (
            <ToastAction
              altText="Undo"
              onClick={() => toast.success({ title: "Action undone!" })}
            >
              Undo
            </ToastAction>
          ),
        })
      }
    >
      Show Toast with Action
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="tw-flex tw-gap-3">
      <Button
        onClick={() =>
          toast.success({
            title: "Webhook created",
            description:
              "Your webhook endpoint is now active and listening for events.",
          })
        }
      >
        With Description
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ title: "Simple message without description" })}
      >
        Without Description
      </Button>
    </div>
  ),
};

export const DismissToasts: Story = {
  render: () => {
    return (
      <div className="tw-flex tw-gap-3">
        <Button
          onClick={() => {
            toast({
              title: "Dismissable toast",
              description: "This toast can be dismissed programmatically.",
            });
          }}
        >
          Show Toast
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss All
        </Button>
      </div>
    );
  },
};

export const MultipleToasts: Story = {
  render: () => (
    <Button
      onClick={() => {
        toast.success({ title: "First notification" });
        setTimeout(() => toast.info({ title: "Second notification" }), 300);
        setTimeout(() => toast.warning({ title: "Third notification" }), 600);
        setTimeout(() => toast.error({ title: "Fourth notification" }), 900);
      }}
    >
      Show Multiple Toasts
    </Button>
  ),
};

export const SuccessVariant: Story = {
  render: () => (
    <Button
      variant="success"
      onClick={() =>
        toast.success({
          title: "Payment successful",
          description: "Your payment of $49.99 has been processed.",
        })
      }
    >
      Show Success Toast
    </Button>
  ),
};

export const ErrorVariant: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() =>
        toast.error({
          title: "Connection failed",
          description:
            "Unable to connect to the server. Please check your network.",
        })
      }
    >
      Show Error Toast
    </Button>
  ),
};

export const WarningVariant: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.warning({
          title: "Storage almost full",
          description: "You've used 90% of your storage quota.",
        })
      }
    >
      Show Warning Toast
    </Button>
  ),
};

export const InfoVariant: Story = {
  render: () => (
    <Button
      variant="ghost"
      onClick={() =>
        toast.info({
          title: "New feature available",
          description: "Check out the new dashboard analytics!",
        })
      }
    >
      Show Info Toast
    </Button>
  ),
};

// Show all variants at once for comparison
export const VariantComparison: Story = {
  render: () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-semibold tw-mb-4">
        Compare all variants side by side:
      </h3>
      <Button
        onClick={() => {
          toast({ title: "Default", description: "This is a default toast" });
          setTimeout(
            () =>
              toast.success({
                title: "Success",
                description: "This is a success toast",
              }),
            100
          );
          setTimeout(
            () =>
              toast.error({
                title: "Error",
                description: "This is an error toast",
              }),
            200
          );
          setTimeout(
            () =>
              toast.warning({
                title: "Warning",
                description: "This is a warning toast",
              }),
            300
          );
          setTimeout(
            () =>
              toast.info({
                title: "Info",
                description: "This is an info toast",
              }),
            400
          );
        }}
      >
        Show All Variants
      </Button>
    </div>
  ),
};

// Stacking behavior demo
export const StackingBehavior: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div className="tw-space-y-4">
        <p className="tw-text-sm tw-text-gray-600">
          Toasts stack up to 5 at a time. Older toasts are dismissed as new
          ones arrive.
        </p>
        <Button
          onClick={() => {
            setCount((c) => c + 1);
            toast({ title: `Toast #${count + 1}`, description: "New notification" });
          }}
        >
          Add Toast (Count: {count})
        </Button>
        <Button variant="outline" onClick={() => setCount(0)}>
          Reset Counter
        </Button>
      </div>
    );
  },
};

// Usage guidelines
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Guidelines for when and how to use each toast variant.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Button variant="default" onClick={() => toast({ title: "Event created", description: "Your event has been created." })}>
            Default Toast
          </Button>
        </div>
        <div>
          <p className="font-medium text-sm">Default</p>
          <p className="text-sm text-gray-600">
            Neutral notifications like confirmations or general info
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Button variant="default" onClick={() => toast.success({ title: "Success!", description: "Your changes were saved." })}>
            Success Toast
          </Button>
        </div>
        <div>
          <p className="font-medium text-sm">Success</p>
          <p className="text-sm text-gray-600">
            Positive outcomes, completed actions, or confirmations
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Button variant="default" onClick={() => toast.error({ title: "Error", description: "Something went wrong." })}>
            Error Toast
          </Button>
        </div>
        <div>
          <p className="font-medium text-sm">Error</p>
          <p className="text-sm text-gray-600">
            Failed operations, errors, or validation failures
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Button variant="default" onClick={() => toast.warning({ title: "Warning", description: "This action cannot be undone." })}>
            Warning Toast
          </Button>
        </div>
        <div>
          <p className="font-medium text-sm">Warning</p>
          <p className="text-sm text-gray-600">
            Important notices, cautions, or potentially risky actions
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Button variant="default" onClick={() => toast.info({ title: "Info", description: "Here's some helpful information." })}>
            Info Toast
          </Button>
        </div>
        <div>
          <p className="font-medium text-sm">Info</p>
          <p className="text-sm text-gray-600">
            Informational messages or helpful tips
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
        story: "Best practices for using toast notifications.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {/* Message length example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast({ title: "File uploaded", description: "Your document was uploaded successfully." })}>
              Show Good Example
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Keep messages concise and actionable with a clear title and optional description.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast({ title: "Your file called important-document-final-v3-updated-2024.pdf that was selected from your documents folder in the system has been uploaded and is now processing in the background." })}>
              Show Bad Example
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use overly long messages that won't fit on screen or overwhelm users.
          </p>
        </div>
      </div>

      {/* Variant usage */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast.error({ title: "Failed to save", description: "Please check your connection and try again." })}>
              Use Appropriate Variant
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Choose the variant that matches the message type: success, error, warning, or info.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast.error({ title: "File was saved" })}>
              Use Wrong Variant
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't use inappropriate variants that confuse the user about the message status.
          </p>
        </div>
      </div>

      {/* Auto-dismiss */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast.success({ title: "Changes saved" })}>
              Let It Auto-Dismiss
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Allow toasts to auto-dismiss for positive feedback. Add actions only when users need to respond.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-[#F5F6F8] rounded-lg p-8 flex items-center justify-center min-h-[100px]">
            <Button onClick={() => toast({ title: "This important notification requires your immediate attention and cannot be dismissed!" })}>
              Force User Interaction
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Don't make users manually dismiss non-critical notifications or use toasts for blocking messages.
          </p>
        </div>
      </div>
    </div>
  ),
};
