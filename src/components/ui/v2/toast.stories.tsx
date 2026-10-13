import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Info as InfoIcon,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import { Button } from "./button";
import { Input } from "./input";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  Toaster,
  toast,
  toastVariants,
} from "./toast";
import {
  toastVariants as toastVariantsV1,
  ToastTitle as TitleV1,
  ToastDescription as DescriptionV1,
} from "../toast";
import { v2ComponentDocs } from "./story-docs";
const VARIANTS = [
  "default",
  "success",
  "error",
  "warning",
  "info",
  "destructive",
] as const;
const ICONS = {
  default: null,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: InfoIcon,
  destructive: XCircle,
};
// v2 draws the status inside a round chip, so it uses glyphs without their own circle.
const ICONS_V2 = {
  default: null,
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: InfoIcon,
  destructive: X,
};
type ToastArgs = React.ComponentProps<typeof Toast> & {
  titleCopy: string;
  description: string;
  triggerLabel: string;
  showIcon: boolean;
  showClose: boolean;
  showAction: boolean;
  actionLabel: string;
  actionAltText: string;
  actionDisabled: boolean;
  swipeDirection: "right" | "left" | "up" | "down";
  swipeThreshold: number;
  position: "bottom-right" | "top-right";
  onAction: () => void;
  workspaceName: string;
  stack: boolean;
  expanded: boolean;
  visibleToasts: number;
};
function ToastBody({
  args,
  inline = false,
  version = "v2",
}: {
  args: ToastArgs;
  inline?: boolean;
  version?: "v1" | "v2";
}) {
  const variant = args.variant ?? "default";
  const Icon = ICONS[variant];
  const Title = version === "v2" ? ToastTitle : TitleV1;
  const Description = version === "v2" ? ToastDescription : DescriptionV1;
  const close =
    args.showClose &&
    (inline ? (
      <button
        type="button"
        aria-label="Dismiss preview"
        onClick={() => args.onOpenChange?.(false)}
        className={
          version === "v1"
            ? "inline-flex size-6 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 text-semantic-text-muted"
            : "-mr-0.5 -mt-px inline-flex size-8 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 text-semantic-text-muted"
        }
      >
        <X className={version === "v1" ? "size-3" : "size-4"} />
      </button>
    ) : (
      <ToastClose
        aria-label="Dismiss notification"
        className="static right-auto top-auto -mr-0.5 -mt-px"
      />
    ));
  const action =
    args.showAction &&
    (inline ? (
      <button
        type="button"
        disabled={args.actionDisabled}
        onClick={() => args.onAction?.()}
        aria-label={args.actionAltText}
        className={cn(
          version === "v1"
            ? "inline-flex h-8 shrink-0 items-center justify-center border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 text-xs font-semibold text-semantic-text-secondary hover:bg-semantic-bg-ui disabled:pointer-events-none disabled:opacity-50"
            : "inline-flex h-8 shrink-0 items-center justify-center border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 text-xs font-medium text-semantic-text-secondary hover:bg-semantic-bg-ui disabled:pointer-events-none disabled:opacity-50",
          version === "v2"
            ? "rounded-lg tracking-[0.06px] shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)]"
            : "rounded-md px-3"
        )}
      >
        {args.actionLabel}
      </button>
    ) : (
      <ToastAction
        altText={args.actionAltText}
        disabled={args.actionDisabled}
        onClick={() => args.onAction?.()}
      >
        {args.actionLabel}
      </ToastAction>
    ));
  if (version === "v1")
    return (
      <>
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {args.showIcon && Icon && <Icon className="mt-0.5 size-5 shrink-0" />}
          <div className="grid min-w-0 gap-1">
            <Title>{args.titleCopy}</Title>
            {args.description && <Description>{args.description}</Description>}
          </div>
        </div>
        {action}
        {close}
      </>
    );
  const IconV2 = ICONS_V2[variant];
  return (
    <div className="flex w-full items-start gap-3 py-3.5 pl-4 pr-3.5">
      {args.showIcon && IconV2 && (
        <span
          className={cn(
            "grid size-[30px] shrink-0 place-items-center rounded-full border border-solid",
            variant === "success" &&
              "border-semantic-success-border/40 bg-semantic-success-surface text-semantic-success-primary",
            (variant === "error" || variant === "destructive") &&
              "border-semantic-error-border/40 bg-semantic-error-surface text-semantic-error-primary",
            variant === "warning" &&
              "border-semantic-warning-border/40 bg-semantic-warning-surface text-semantic-warning-primary",
            variant === "info" &&
              "border-semantic-info-border/40 bg-semantic-info-surface text-semantic-info-primary"
          )}
        >
          <IconV2 className="size-4" strokeWidth={2.25} aria-hidden />
        </span>
      )}
      <div className="grid min-w-0 flex-1 gap-0.5 pt-[5px]">
        <Title>{args.titleCopy}</Title>
        {args.description && <Description>{args.description}</Description>}
        {action && <div className="mt-2 flex">{action}</div>}
      </div>
      {close}
    </div>
  );
}
function LiveToast({
  args,
  updateArgs,
}: {
  args: ToastArgs;
  updateArgs: (next: Partial<ToastArgs>) => void;
}) {
  const changeOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <ToastProvider
      duration={args.duration}
      swipeDirection={args.swipeDirection}
      swipeThreshold={args.swipeThreshold}
    >
      <div className="flex flex-col items-start gap-3">
        <Button variant="outline" onClick={() => changeOpen(true)}>
          {args.triggerLabel}
        </Button>
        <p className="m-0 text-xs text-semantic-text-muted" role="status">
          {args.open ? "Notification open" : "Notification closed"}
        </p>
      </div>
      <Toast
        variant={args.variant}
        duration={args.duration}
        type={args.type}
        open={args.open}
        onOpenChange={changeOpen}
        className="w-[28rem] max-w-full p-0"
      >
        <ToastBody args={args} />
      </Toast>
      <ToastViewport
        className={cn(
          "right-0 w-[480px] max-w-full",
          args.position === "top-right" &&
            "bottom-auto right-0 top-0 sm:bottom-auto sm:right-0 sm:top-0"
        )}
      />
    </ToastProvider>
  );
}
/** An actual store-driven hero, also usable in docs with a contained viewport. */
function StackHero({
  args,
  updateArgs,
}: {
  args: ToastArgs;
  updateArgs: (next: Partial<ToastArgs>) => void;
}) {
  const [result, setResult] = React.useState(
    "Queue a few notifications, then hover or focus the stack."
  );
  React.useEffect(() => () => toast.dismiss(), []);
  function notify(
    title = args.titleCopy,
    variant = args.variant,
    description = args.description
  ) {
    toast({
      title,
      description,
      variant,
      duration: args.duration,
      onOpenChange: args.onOpenChange,
      action: args.showAction ? (
        <ToastAction
          altText={args.actionAltText}
          disabled={args.actionDisabled}
          onClick={() => {
            args.onAction();
            setResult("Action completed: " + title);
          }}
        >
          {args.actionLabel}
        </ToastAction>
      ) : undefined,
    });
    setResult("Notification queued: " + title);
  }
  return (
    <section className="relative grid w-[640px] max-w-full gap-6 rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-subtle p-5">
      <div className="grid max-w-sm gap-4">
        <div className="grid gap-1">
          <p className="m-0 text-sm font-medium text-semantic-text-primary">
            Workspace notifications
          </p>
          <p className="m-0 text-sm text-semantic-text-secondary">
            Updates from your team collect here. Expand the stack to review
            them.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => notify()}>{args.triggerLabel}</Button>
          <Button
            variant="outline"
            onClick={() => {
              notify(
                "Workspace synced",
                "success",
                "Your changes are available to the team."
              );
              notify(
                "New conversation assigned",
                "info",
                "Riya assigned a conversation to you."
              );
              notify(
                "Webhook needs attention",
                "error",
                "The latest delivery failed. Retry when ready."
              );
            }}
          >
            Queue 3 notifications
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              toast.dismiss();
              setResult("Notifications dismissed.");
            }}
          >
            Dismiss all
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-semantic-text-secondary">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={args.stack}
              onChange={(event) => updateArgs({ stack: event.target.checked })}
            />
            Layered stack
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={args.expanded}
              disabled={!args.stack}
              onChange={(event) =>
                updateArgs({ expanded: event.target.checked })
              }
            />
            Keep expanded
          </label>
        </div>
        <p className="m-0 text-xs text-semantic-text-muted" role="status">
          {result}
        </p>
      </div>
      <Toaster
        stack={args.stack}
        expanded={args.expanded}
        visibleToasts={args.visibleToasts}
        onExpandedChange={(expanded) => updateArgs({ expanded })}
        providerProps={{
          swipeDirection: args.swipeDirection,
          swipeThreshold: args.swipeThreshold,
        }}
        viewportProps={{
          className: cn(
            "relative order-last bottom-auto left-auto right-auto top-auto m-0 w-full max-h-[none] max-w-[384px] justify-self-end p-4 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-[384px]",
            args.position === "top-right" && "order-first"
          ),
        }}
      />
    </section>
  );
}

const meta: Meta<ToastArgs> = {
  title: "V2/Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "stack",
        "expanded",
        "visibleToasts",
        "variant",
        "duration",
        "titleCopy",
        "description",
        "triggerLabel",
        "showAction",
        "actionLabel",
        "actionAltText",
        "actionDisabled",
        "swipeDirection",
        "swipeThreshold",
        "position",
        "onOpenChange",
        "onAction",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12618",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "toast",
          exportName: "Toaster, toast, Toast, ToastAction",
          summary:
            "Neutral notifications with status icons, an action and labelled dismiss. The optional stack shares the existing toast() store and fans out on hover, focus or an explicit touch/keyboard control.",
          changes: [
            [
              "Structure",
              "One compact row",
              "30px status chip, title and description column, 32px dismiss, action under the copy",
            ],
            [
              "Container",
              "5px corners, flat status borders",
              "416px, 8px corners, neutral surface and border, subtle floating shadow",
            ],
            [
              "Typography",
              "14px semibold title",
              "14px medium title, 14px description",
            ],
            [
              "Status",
              "Default, success, error, warning, info",
              "Same neutral card across variants; status is conveyed by the icon; destructive aliases error",
            ],
            [
              "Interaction",
              "Provider, duration, action, swipe, store helpers",
              "Preserved Radix controls; optional layered stack, pause/resume and focus handoff",
            ],
          ],
          tokens: [
            [
              "All toast surfaces",
              "--semantic-bg-primary",
              "#FFFFFF",
              "#FFFFFF",
            ],
            [
              "Neutral border",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            [
              "Description / action",
              "--semantic-text-secondary",
              "#343E55",
              "#343E55",
            ],
            ["Dismiss", "--semantic-text-muted", "#717680", "#717680"],
            [
              "Success icon",
              "--semantic-success-primary",
              "#17B26A",
              "#17B26A",
            ],
            [
              "Error / destructive icon",
              "--semantic-error-primary",
              "#F04438",
              "#F04438",
            ],
            [
              "Warning icon",
              "--semantic-warning-primary",
              "#F79009",
              "#F79009",
            ],
            ["Info icon", "--semantic-info-primary", "#3B6ACB", "#3B6ACB"],
          ],
          guidance:
            "Mount one Toaster per application and call the existing toast(), toast.success/error/warning/info or useToast(). Enable stacking with <Toaster stack />. Five queued items and the 2000ms default store removal delay are unchanged. All open items fan out when expanded; visibleToasts only limits collapsed layers. Hover and focus expand automatically, and the count button supports touch/keyboard expansion. Stack timers preserve remaining time while expanded, focused, hovered, dragged or the page is hidden. Root duration inherits Radix's 5000ms default, right swipe and 50px threshold; duration: Infinity keeps a toast open. A duration of 0 on a toast inherits the provider, while a provider duration of 0 is persistent. Native action, close, swipe and Escape preventDefault remain effective. All variants use neutral copy/surfaces with status in the icon. Overview is a live queued stack; Primitive playground isolates the controlled Root contract.",
        }),
      },
    },
  },
  args: {
    stack: true,
    expanded: false,
    visibleToasts: 3,
    open: false,
    variant: "success",
    duration: 8000,
    titleCopy: "Changes saved",
    description: "Your workspace settings are up to date.",
    triggerLabel: "Show notification",
    showIcon: true,
    showClose: true,
    showAction: true,
    actionLabel: "View",
    actionAltText: "View the saved workspace settings",
    actionDisabled: false,
    swipeDirection: "right",
    swipeThreshold: 50,
    position: "bottom-right",
    workspaceName: "Customer support",
    onOpenChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    stack: { control: "boolean", table: { category: "Toaster presentation" } },
    expanded: {
      control: "boolean",
      table: { category: "Toaster presentation" },
      description: "Keep expanded; hover and focus also fan out the stack.",
    },
    visibleToasts: {
      control: { type: "number", min: 1, max: 5, step: 1 },
      table: { category: "Toaster presentation" },
    },
    open: { control: "boolean", table: { category: "Toast" } },
    variant: {
      control: "select",
      options: VARIANTS,
      table: { category: "Toast" },
    },
    duration: {
      control: { type: "number", min: 500, max: 30000, step: 500 },
      table: { category: "Toast" },
    },
    onOpenChange: { control: false, table: { category: "Toast" } },
    titleCopy: { control: "text", table: { category: "Example composition" } },
    description: {
      control: "text",
      table: { category: "Example composition" },
    },
    triggerLabel: {
      control: "text",
      table: { category: "Example composition" },
    },
    showIcon: {
      control: "boolean",
      table: { category: "Example composition" },
    },
    showClose: {
      control: "boolean",
      table: { category: "Example composition" },
    },
    showAction: {
      control: "boolean",
      table: { category: "Example composition" },
    },
    actionLabel: { control: "text", table: { category: "Action composition" } },
    actionAltText: {
      control: "text",
      table: { category: "Action composition" },
    },
    actionDisabled: {
      control: "boolean",
      table: { category: "Action composition" },
    },
    onAction: { control: false, table: { category: "Action composition" } },
    swipeDirection: {
      control: "select",
      options: ["right", "left", "up", "down"],
      table: { category: "ToastProvider" },
    },
    swipeThreshold: {
      control: { type: "number", min: 0, max: 200 },
      table: { category: "ToastProvider" },
    },
    position: {
      control: "inline-radio",
      options: ["bottom-right", "top-right"],
      table: { category: "ToastViewport composition" },
    },
    workspaceName: { control: "text", table: { category: "Usage form" } },
    children: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ToastArgs>();
    return (
      <div className="min-h-72 font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <StackHero args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const InteractiveStack: Story = {
  name: "Interactive stack",
  args: { stack: true },
};
export const PrimitivePlayground: Story = {
  name: "Primitive playground",
  parameters: {
    controls: {
      include: [
        "open",
        "variant",
        "duration",
        "titleCopy",
        "description",
        "triggerLabel",
        "showIcon",
        "showClose",
        "showAction",
        "actionLabel",
        "actionAltText",
        "actionDisabled",
        "swipeDirection",
        "swipeThreshold",
        "position",
      ],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ToastArgs>();
    return <LiveToast args={args} updateArgs={updateArgs} />;
  },
};
export const Default: Story = {
  args: { variant: "default", titleCopy: "Workspace updated" },
  parameters: { controls: { exclude: ["showIcon"] } },
};
export const Success: Story = { args: { variant: "success" } };
export const Error: Story = {
  args: {
    variant: "error",
    titleCopy: "Changes could not be saved",
    description: "Check your connection and try again.",
    actionLabel: "Retry",
    actionAltText: "Retry saving the workspace settings",
  },
};
export const Warning: Story = {
  args: {
    variant: "warning",
    titleCopy: "Connection is unstable",
    description: "Some messages may take longer to appear.",
  },
};
export const Info: Story = {
  args: {
    variant: "info",
    titleCopy: "New inbox filters",
    description: "Filter by assignee or unread conversations.",
  },
};
export const Destructive: Story = {
  args: {
    variant: "destructive",
    titleCopy: "Webhook removed",
    description: "New events will no longer be delivered.",
  },
};
export const WithoutAction: Story = { args: { showAction: false } };
export const WithoutDescription: Story = { args: { description: "" } };
export const DisabledAction: Story = { args: { actionDisabled: true } };
export const LongContent: Story = {
  args: {
    titleCopy: "The shared customer support workspace has been updated",
    description:
      "Changes to the workspace name and notification settings are available to everyone on your team. This longer description wraps inside the recorded width.",
  },
};
function InlineToast({
  args,
  version = "v2",
  state,
}: {
  args: ToastArgs;
  version?: "v1" | "v2";
  state?: string;
}) {
  const variant = args.variant ?? "default";
  return (
    <section
      data-presentation="inline"
      data-version={version}
      data-v2-toast-variant={variant}
      className={cn(
        version === "v2"
          ? toastVariants({ variant })
          : toastVariantsV1({
              variant: variant === "destructive" ? "error" : variant,
            }),
        version === "v2" ? "w-[28rem] max-w-full p-0" : "w-[384px] max-w-full",
        state === "Focus" && "[&_button]:pseudo-focus-visible"
      )}
    >
      <ToastBody args={args} inline version={version} />
    </section>
  );
}
const INLINE = [
  "stack",
  "expanded",
  "visibleToasts",
  "open",
  "duration",
  "triggerLabel",
  "swipeDirection",
  "swipeThreshold",
  "position",
  "onOpenChange",
];
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE, "variant"],
      "All six treatments are fixed, including destructive's error alias. Copy, icon, close and action Controls apply to every inline card. Samples have no Radix viewport and never cover Docs."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1392px] grid-cols-3 items-start gap-6">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-semantic-text-muted">
              {variant}
            </span>
            <InlineToast args={{ ...args, variant }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE, "actionDisabled"],
      "Visible and disabled-action states use the recorded composition. The dismissed state has no mounted toast content. State is fixed; semantic variant, copy and action/close composition Controls apply to the visible samples. Overview tests real dismissal and timing."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1224px] grid-cols-3 items-start gap-6">
        {["Visible", "Disabled action", "Dismissed"].map((state) => (
          <div key={state} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-semantic-text-muted">
              {state}
            </span>
            {state === "Dismissed" ? (
              <div className="flex min-h-[116px] w-[26rem] max-w-full items-center justify-center rounded-lg border border-dashed border-semantic-border-layout p-4">
                <p className="m-0 text-xs text-semantic-text-muted">
                  Notification closed · content unmounted
                </p>
              </div>
            ) : (
              <InlineToast
                args={{ ...args, actionDisabled: state === "Disabled action" }}
                state={state}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      [...INLINE, "variant"],
      "Every status in both versions, with complete title, description, icon, close and action. The destructive row compares v1 error with v2's new destructive alias. The v1 cards retain their status surfaces; every v2 card shares a neutral surface and border, with status in its icon."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[956px] grid-cols-[88px_384px_416px] items-start gap-6">
        <div />
        {["v1 · ui/toast", "v2 · ui/v2/toast"].map((label) => (
          <span
            key={label}
            className="text-xs font-normal text-semantic-text-muted"
          >
            {label}
          </span>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span className="pt-5 text-xs font-normal text-semantic-text-muted">
              {variant}
            </span>
            <InlineToast args={{ ...args, variant }} version="v1" />
            <InlineToast args={{ ...args, variant }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function WorkspaceForm({
  args,
  updateArgs,
}: {
  args: ToastArgs;
  updateArgs: (next: Partial<ToastArgs>) => void;
}) {
  const id = React.useId();
  const [saved, setSaved] = React.useState(args.workspaceName);
  const [result, setResult] = React.useState("No changes saved yet.");
  React.useEffect(() => () => toast.dismiss(), []);
  return (
    <section className="flex w-[560px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-base font-medium text-semantic-text-primary">
          Workspace settings
        </p>
        <p className="m-0 text-xs text-semantic-text-muted">
          Save a local edit and use the notification action to undo it.
        </p>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const previous = saved;
          setSaved(args.workspaceName);
          setResult("Saved: " + args.workspaceName);
          toast({
            variant: args.variant,
            title: args.titleCopy,
            description: args.description,
            duration: args.duration,
            action: args.showAction ? (
              <ToastAction
                altText={args.actionAltText}
                disabled={args.actionDisabled}
                onClick={() => {
                  args.onAction();
                  setSaved(previous);
                  updateArgs({ workspaceName: previous });
                  setResult("Previous workspace name restored.");
                }}
              >
                {args.actionLabel}
              </ToastAction>
            ) : undefined,
          });
        }}
      >
        <label
          htmlFor={id}
          className="text-sm font-medium text-semantic-text-secondary"
        >
          Workspace name
        </label>
        <Input
          id={id}
          value={args.workspaceName}
          required
          onChange={(event) =>
            updateArgs({ workspaceName: event.target.value })
          }
        />
        <div className="flex gap-2">
          <Button type="submit">{args.triggerLabel}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.dismiss()}
          >
            Dismiss notifications
          </Button>
        </div>
      </form>
      <p className="m-0 text-sm text-semantic-text-secondary">
        Saved name: {saved}
      </p>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {result}
      </p>
      <Toaster stack={args.stack} />
    </section>
  );
}
export const Usage: Story = {
  args: {
    triggerLabel: "Save workspace",
    actionLabel: "Undo",
    actionAltText: "Undo the saved workspace name",
    titleCopy: "Workspace name saved",
  },
  parameters: {
    controls: {
      include: [
        "variant",
        "duration",
        "titleCopy",
        "description",
        "triggerLabel",
        "showAction",
        "actionLabel",
        "actionAltText",
        "actionDisabled",
        "workspaceName",
        "stack",
        "onAction",
      ],
    },
    docs: {
      description: {
        story:
          "The shipped toast() store and Toaster, in a working form. Typing synchronizes workspaceName Controls. Save updates the local card and emits a real notification; Undo restores the previous name and its Control. Root open and viewport/provider composition Controls are hidden here because store notifications use their own lifecycle.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ToastArgs>();
    return <WorkspaceForm args={args} updateArgs={updateArgs} />;
  },
};
