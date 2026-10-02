import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Bell } from "lucide-react";
import { Alert, AlertTitle, AlertDescription, type AlertProps } from "./alert";
import {
  Alert as AlertV1,
  AlertTitle as AlertTitleV1,
  AlertDescription as AlertDescriptionV1,
} from "../alert";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Input } from "./input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = Omit<
  AlertProps,
  "children" | "icon" | "action" | "secondaryAction"
> & {
  title: string;
  description: string;
  customIcon: "variant" | "bell" | "none";
  showAction: boolean;
  showSecondaryAction: boolean;
  actionLabel: string;
  secondaryLabel: string;
  actionDisabled: boolean;
  onAction: () => void;
  onSecondaryAction: () => void;
};
const variants = [
  "default",
  "success",
  "error",
  "warning",
  "info",
  "destructive",
] as const;
const presentations = ["inline", "header", "overlay"] as const;
function AlertExample({
  args,
  version = "v2",
  updateOpen,
  forceFocus = false,
}: {
  args: Args;
  version?: "v1" | "v2";
  updateOpen?: (open: boolean) => void;
  forceFocus?: boolean;
}) {
  const [open, setOpen] = React.useState(args.open ?? true);
  const [seed, setSeed] = React.useState(args.open);
  if (seed !== args.open) {
    setSeed(args.open);
    setOpen(args.open ?? true);
  }
  const visible = updateOpen ? args.open : open;
  const UI = version === "v1" ? AlertV1 : Alert;
  const ActionButton = version === "v1" ? ButtonV1 : Button;
  const Title = version === "v1" ? AlertTitleV1 : AlertTitle;
  const Description = version === "v1" ? AlertDescriptionV1 : AlertDescription;
  const icon =
    args.customIcon === "none" ? null : args.customIcon === "bell" ? (
      <Bell className="size-5" />
    ) : undefined;
  return (
    <div className={version === "v1" ? "font-sans" : undefined}>
      <UI
        variant={args.variant}
        showIcon={args.showIcon}
        closable={args.closable}
        defaultOpen={args.defaultOpen}
        {...(version === "v2" ? { presentation: args.presentation } : {})}
        open={visible}
        icon={icon}
        onClose={() => {
          args.onClose?.();
          if (updateOpen) updateOpen(false);
          else setOpen(false);
        }}
        className={args.className}
        action={
          args.showAction ? (
            <ActionButton
              className={forceFocus ? "pseudo-focus-visible" : undefined}
              size="sm"
              disabled={args.actionDisabled}
              onClick={() => args.onAction()}
            >
              {args.actionLabel}
            </ActionButton>
          ) : undefined
        }
        secondaryAction={
          args.showSecondaryAction ? (
            <ActionButton
              className={forceFocus ? "pseudo-focus-visible" : undefined}
              size="sm"
              variant="outline"
              disabled={args.actionDisabled}
              onClick={() => args.onSecondaryAction()}
            >
              {args.secondaryLabel}
            </ActionButton>
          ) : undefined
        }
      >
        <Title>{args.title}</Title>
        {args.description && <Description>{args.description}</Description>}
      </UI>
      {!visible && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-semantic-border-layout p-4">
          <p className="m-0 text-sm text-semantic-text-muted">
            Alert dismissed.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (updateOpen) updateOpen(true);
              else setOpen(true);
            }}
          >
            Show alert
          </Button>
        </div>
      )}
    </div>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "variant",
        "presentation",
        "open",
        "showIcon",
        "closable",
        "title",
        "description",
        "customIcon",
        "showAction",
        "showSecondaryAction",
        "actionLabel",
        "secondaryLabel",
        "actionDisabled",
        "onClose",
        "onAction",
        "onSecondaryAction",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "alert",
          exportName: "Alert, AlertTitle, AlertDescription",
          summary:
            "Status feedback with controlled or local dismissal, optional actions, and inline, header and overlay presentations.",
          changes: [
            [
              "Typography",
              "Inherited semibold title / 14px body",
              "Inter 16px medium title / 12px normal body",
            ],
            [
              "Surface and border",
              "v1 status palette and 4px radius",
              "v2 status 200 border, 8px radius",
            ],
            [
              "Presentations",
              "Inline banner",
              "Inline plus Header and 384px Overlay",
            ],
            [
              "Header",
              "Custom composition",
              "16px padding, 12px gap, 1.2px bottom border",
            ],
            [
              "Overlay",
              "Custom composition",
              "XL shadow; 16px header/body padding, 0.4px header divider",
            ],
            [
              "Visibility and actions",
              "Controlled/uncontrolled",
              "Existing open/defaultOpen/onClose/action API retained",
            ],
          ],
          tokens: [
            ["Text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Success border", "--color-success-200", "#ABEFC6", "#ABEFC6"],
            ["Error border", "--color-error-200", "#FECDCA", "#FECDCA"],
            ["Warning border", "--color-warning-200", "#FEDF89", "#FEDF89"],
            ["Info border", "--color-info-200", "#A8C0EC", "#A8C0EC"],
            [
              "Default border",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
          ],
          guidance:
            "Use inline for feedback inside a section, header for a full-width notice, and overlay for a compact card. Overlay places direct AlertTitle children (including fragments) in its header and other content in its body. Closable controlled alerts need onClose to update open. The Example controls compose title, description, icons and action buttons; they are not extra Alert props.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "default",
    presentation: "inline",
    open: true,
    showIcon: true,
    closable: false,
    title: "Changes saved",
    description: "Your updates are ready to use.",
    customIcon: "variant",
    showAction: false,
    showSecondaryAction: false,
    actionLabel: "Continue",
    secondaryLabel: "Cancel",
    actionDisabled: false,
    onClose: fn(),
    onAction: fn(),
    onSecondaryAction: fn(),
  },
  argTypes: {
    variant: { control: "select", options: variants },
    presentation: { control: "select", options: presentations },
    open: { control: "boolean" },
    showIcon: { control: "boolean" },
    closable: { control: "boolean" },
    defaultOpen: {
      control: false,
      description: "Initial visibility only. Use open for the live playground.",
    },
    title: {
      control: "text",
      description: "Composed AlertTitle text.",
      table: { category: "Example" },
    },
    description: { control: "text", table: { category: "Example" } },
    customIcon: {
      control: "select",
      options: ["variant", "bell", "none"],
      table: { category: "Example" },
    },
    showAction: { control: "boolean", table: { category: "Example" } },
    showSecondaryAction: { control: "boolean", table: { category: "Example" } },
    actionLabel: { control: "text", table: { category: "Example" } },
    secondaryLabel: { control: "text", table: { category: "Example" } },
    actionDisabled: { control: "boolean", table: { category: "Example" } },
    onClose: { control: false },
    onAction: { control: false, table: { category: "Example" } },
    onSecondaryAction: { control: false, table: { category: "Example" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return (
      <AlertExample args={args} updateOpen={(open) => updateArgs({ open })} />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const Success: Story = {
  args: {
    variant: "success",
    title: "Campaign published",
    description: "Your campaign is now active.",
  },
};
export const Error: Story = {
  args: {
    variant: "error",
    title: "Unable to connect",
    description: "Check the connection and try again.",
  },
};
export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Credits running low",
    description: "Add credits to keep your campaigns running.",
  },
};
export const Info: Story = {
  args: {
    variant: "info",
    title: "Scheduled maintenance",
    description: "Service will resume after the maintenance window.",
  },
};
export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Campaign deleted",
    description: "This campaign is no longer available.",
  },
};
export const Header: Story = {
  args: { presentation: "header", variant: "success", closable: true },
};
export const Overlay: Story = {
  args: {
    presentation: "overlay",
    closable: true,
    showAction: true,
    showSecondaryAction: true,
  },
};
export const WithCustomIcon: Story = {
  args: { customIcon: "bell", title: "New activity" },
};
export const WithoutIcon: Story = { args: { showIcon: false } };
export const Closable: Story = { args: { closable: true } };
export const WithSingleAction: Story = { args: { showAction: true } };
export const WithTwoActions: Story = {
  args: { showAction: true, showSecondaryAction: true },
};
export const ControlledVisibility: Story = {
  args: { closable: true },
  parameters: {
    docs: {
      description: {
        story: "Close updates the live open Control. Show alert restores it.",
      },
    },
  },
};
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-4 text-base font-semibold text-semantic-text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "All six colors are fixed. Presentation, icon, content, visibility and action controls apply throughout. Each alert dismisses independently."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-2 gap-4">
        {variants.map((variant) => (
          <Card key={variant} title={variant}>
            <AlertExample args={{ ...args, variant }} />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const AllPresentations: Story = {
  parameters: gallery(
    ["presentation"],
    "Inline, Header and Overlay are fixed. All color, content and action controls remain live."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-5">
      {presentations.map((presentation) => (
        <Card key={presentation} title={presentation}>
          <AlertExample args={{ ...args, presentation }} />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  args: { closable: true, showAction: true },
  parameters: gallery(
    ["open", "actionDisabled"],
    "Visible, focused actions, disabled actions and dismissed states are fixed. Other content and presentation controls remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-2 gap-4">
        {["Visible", "Focus", "Disabled actions", "Dismissed"].map((state) => (
          <Card key={state} title={state}>
            <AlertExample
              args={{
                ...args,
                open: state !== "Dismissed",
                actionDisabled: state === "Disabled actions",
              }}
              forceFocus={state === "Focus"}
            />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["variant", "presentation"],
    "All v1 colors are compared against v2 inline. Header/Overlay are additive v2 presentations, shown separately. Content, visibility and action controls apply to all pairs."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-2 gap-4">
        {variants.flatMap((variant) =>
          (["v1", "v2"] as const).map((version) => (
            <Card key={variant + version} title={version + " · " + variant}>
              <AlertExample
                args={{ ...args, variant, presentation: "inline" }}
                version={version}
              />
            </Card>
          ))
        )}
      </div>
    </div>
  ),
};
function SettingsExample({
  args,
  showResult,
  updateOpen,
}: {
  args: Args;
  showResult: () => void;
  updateOpen: (open: boolean) => void;
}) {
  const [name, setName] = React.useState("Support inbox");
  const [saved, setSaved] = React.useState(false);
  return (
    <section className="max-w-[760px] rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        Inbox settings
      </h3>
      <p className="m-0 mt-1 mb-5 text-xs text-semantic-text-muted">
        Save a name to display local feedback. Dismissal stays synchronized with
        Controls.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
          showResult();
        }}
        className="mb-5 flex flex-wrap items-end gap-3"
      >
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="alert-inbox-name"
            className="mb-2 block text-sm font-medium"
          >
            Inbox name
          </label>
          <Input
            id="alert-inbox-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={args.actionDisabled || !name.trim()}
        >
          Save changes
        </Button>
      </form>
      {saved && (
        <p className="m-0 mb-3 text-xs text-semantic-text-muted">
          Saved locally: {name}
        </p>
      )}
      <AlertExample args={args} updateOpen={updateOpen} />
    </section>
  );
}
export const Usage: Story = {
  args: {
    variant: "success",
    closable: true,
    title: "Settings saved",
    description: "The inbox name has been updated.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit the local inbox name and save. The current alert controls style the result; closing and reopening update open.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return (
      <SettingsExample
        args={args}
        showResult={() => updateArgs({ open: true })}
        updateOpen={(open) => updateArgs({ open })}
      />
    );
  },
};
export const ComplexExample: Story = {
  args: {
    variant: "warning",
    closable: true,
    showAction: true,
    showSecondaryAction: true,
    title: "Review campaign settings",
    description:
      "Some recipients are missing a valid phone number. Update the recipient list before publishing.",
    actionLabel: "Review recipients",
    secondaryLabel: "Later",
  },
};
export const ScreenshotReference: Story = {
  args: {
    variant: "success",
    presentation: "header",
    title: "Your changes have been saved",
    description: "The latest settings are ready to use.",
    closable: true,
  },
};
