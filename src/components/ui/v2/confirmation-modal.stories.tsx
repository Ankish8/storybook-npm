import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import {
  ConfirmationModal,
  type ConfirmationModalProps,
} from "./confirmation-modal";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import {
  Dialog as DialogV1,
  DialogHeader as HeaderV1,
  DialogTitle as TitleV1,
  DialogDescription as DescriptionV1,
  DialogFooter as FooterV1,
} from "../dialog";
import { v2ComponentDocs } from "./story-docs";

type ConfirmArgs = ConfirmationModalProps & { triggerLabel: string };
const VARIANTS = ["default", "destructive"] as const;
function LiveConfirmation({
  args,
  updateArgs,
  onResult,
}: {
  args: ConfirmArgs;
  updateArgs: (next: Partial<ConfirmArgs>) => void;
  onResult?: (result: string) => void;
}) {
  const changeOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <ConfirmationModal
      {...args}
      trigger={<Button variant="outline">{args.triggerLabel}</Button>}
      onOpenChange={changeOpen}
      onCancel={() => {
        args.onCancel?.();
        onResult?.("Cancelled. No changes made.");
      }}
      onConfirm={() => {
        args.onConfirm?.();
        onResult?.("Confirmed in this preview.");
        changeOpen(false);
      }}
    />
  );
}
function InlineConfirmation({
  args,
  version = "v2",
  visualState,
}: {
  args: ConfirmArgs;
  version?: "v1" | "v2";
  visualState?: string;
}) {
  const Root = version === "v2" ? Dialog : DialogV1;
  const Header = version === "v2" ? DialogHeader : HeaderV1;
  const Title = version === "v2" ? DialogTitle : TitleV1;
  const Description = version === "v2" ? DialogDescription : DescriptionV1;
  const Footer = version === "v2" ? DialogFooter : FooterV1;
  const Action = version === "v2" ? Button : ButtonV1;
  const cancel = (
    <Action
      variant="outline"
      disabled={args.loading}
      onClick={() => args.onCancel?.()}
    >
      {args.cancelButtonText}
    </Action>
  );
  const confirm = (
    <Action
      variant={args.variant === "destructive" ? "destructive" : "default"}
      disabled={args.loading}
      loading={args.loading}
      onClick={() => args.onConfirm?.()}
      className={
        visualState === "Focus"
          ? "pseudo-focus-visible"
          : visualState === "Hover"
            ? "pseudo-hover"
            : undefined
      }
    >
      {args.confirmButtonText}
    </Action>
  );
  return (
    <Root open={false} modal={false}>
      <section
        data-presentation="inline"
        data-version={version}
        aria-label={String(args.title)}
        className={cn(
          version === "v1"
            ? "flex w-96 max-w-full flex-col overflow-hidden border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-[0_20px_24px_-4px_rgba(10,13,18,.08),0_8px_8px_-4px_rgba(10,13,18,.03),0_3px_3px_-1.5px_rgba(10,13,18,.04)]"
            : "flex w-96 max-w-full flex-col overflow-hidden border border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)] shadow-[0_20px_24px_-4px_rgba(10,13,18,.08),0_8px_8px_-4px_rgba(10,13,18,.03),0_3px_3px_-1.5px_rgba(10,13,18,.04)]",
          version === "v2"
            ? "gap-0 rounded-xl p-0 font-[family-name:var(--font-v2,Inter,sans-serif)]"
            : "gap-4 rounded-lg p-6"
        )}
      >
        {version === "v2" ? (
          <>
            <Header className="flex-row items-center gap-3 border-b border-solid border-semantic-border-layout p-4 text-left">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center",
                  args.variant === "destructive"
                    ? "text-semantic-error-primary"
                    : "text-semantic-info-primary"
                )}
              >
                {args.variant === "destructive" ? (
                  <TriangleAlert className="size-[18px]" />
                ) : (
                  <Info className="size-[18px]" />
                )}
              </span>
              <Title className="min-w-0 flex-1">{args.title}</Title>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => args.onOpenChange?.(false)}
                className="flex size-6 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-[var(--v2-text-muted,#707070)]"
              >
                <X className="size-3" />
              </button>
            </Header>
            <div className={args.description ? "px-4 py-3" : "sr-only"}>
              <Description
                className={
                  args.description
                    ? "text-sm text-[var(--v2-text-secondary,#5E5E5E)]"
                    : "sr-only"
                }
              >
                {args.description || "Confirmation dialog"}
              </Description>
            </div>
            <Footer className="gap-2 px-4 pb-4 pt-3 sm:space-x-0 [&>button]:flex-1">
              {cancel}
              {confirm}
            </Footer>
          </>
        ) : (
          <>
            <Header>
              <Title>{args.title}</Title>
              <Description className={args.description ? undefined : "sr-only"}>
                {args.description || "Confirmation dialog"}
              </Description>
            </Header>
            <Footer className="gap-2 sm:gap-0">
              {cancel}
              {confirm}
            </Footer>
          </>
        )}
      </section>
    </Root>
  );
}
const meta: Meta<ConfirmArgs> = {
  title: "V2/Components/ConfirmationModal",
  component: ConfirmationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "title",
        "description",
        "variant",
        "loading",
        "confirmButtonText",
        "cancelButtonText",
        "triggerLabel",
        "onOpenChange",
        "onConfirm",
        "onCancel",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-10148",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "confirmation-modal",
          exportName: "ConfirmationModal",
          summary:
            "A brief confirmation for a decision that needs an explicit answer.",
          changes: [
            [
              "Container",
              "384px, 8px corners, 24px outer padding",
              "384px, 12px corners, independently padded sections",
            ],
            [
              "Header",
              "Title and description grouped",
              "24px icon, 16px medium title, close; 16px padding / 12px gap",
            ],
            [
              "Message",
              "14px muted in header",
              "14px secondary in a separate 12px / 16px body",
            ],
            [
              "Actions",
              "Right aligned, compact gaps",
              "Equal-width medium buttons; 12px / 16px / 16px footer",
            ],
            [
              "Callbacks",
              "onConfirm / onCancel / onOpenChange",
              "Preserved; consumer closes after confirming",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Message", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Corners", "12px literal", "12px"],
            ["Width", "384px with viewport gutters", "384px"],
          ],
          guidance:
            "Keep the message brief and name the action on the confirm button. Use destructive for a risky action. onConfirm remains a callback: the consumer decides when to close. Loading disables confirm and cancel; the corner Close and Escape preserve existing dismissal behavior. Overview and Usage implement controlled dismissal and log the callbacks. Inline galleries create no portal over Docs and expose only the arguments their compositions use. This component has one recorded size.",
        }),
      },
    },
  },
  args: {
    open: false,
    title: "Pause notifications?",
    description: "You can enable notifications again at any time.",
    variant: "default",
    loading: false,
    confirmButtonText: "Pause notifications",
    cancelButtonText: "Keep enabled",
    triggerLabel: "Review action",
    onOpenChange: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    variant: { control: "inline-radio", options: VARIANTS },
    loading: { control: "boolean" },
    confirmButtonText: { control: "text" },
    cancelButtonText: { control: "text" },
    triggerLabel: {
      control: "text",
      table: { category: "Example composition" },
    },
    onOpenChange: { control: false },
    onConfirm: { control: false },
    onCancel: { control: false },
    trigger: { control: false },
    className: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ConfirmArgs>();
    return (
      <div className="p-8">
        <LiveConfirmation args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Archive this inbox?",
    description:
      "The inbox will stop receiving new conversations. You can restore it later.",
    confirmButtonText: "Archive inbox",
    cancelButtonText: "Keep inbox",
  },
};
export const Loading: Story = { args: { loading: true } };
export const WithoutDescription: Story = { args: { description: "" } };
export const LongContent: Story = {
  args: {
    title: "Pause notifications for the customer support inbox?",
    description:
      "Pausing notifications affects only this workspace. Conversations continue to arrive and remain available to your team. You can enable notifications from preferences whenever you are ready.",
  },
};
const INLINE = ["open", "triggerLabel", "onOpenChange"];
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE, "variant"],
      "Default and destructive are fixed. Title, description, button labels and loading remain editable in both inline samples. Neither sample portals a modal over Docs."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[808px] grid-cols-2 items-start gap-6">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {variant}
            </span>
            <InlineConfirmation args={{ ...args, variant }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE, "loading"],
      "Both variants across default, hover, focus and loading action states. Variant and loading are fixed in the matrix; copy and button labels remain editable."
    ),
    layout: "padded",
    controls: { exclude: [...INLINE, "variant", "loading"] },
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1760px] grid-cols-[88px_repeat(4,384px)] items-start gap-6">
        <div />
        {["Default", "Hover", "Focus", "Loading"].map((state) => (
          <span
            key={state}
            className="text-xs font-normal text-[var(--v2-text-muted,#707070)]"
          >
            {state}
          </span>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span className="pt-6 text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {variant}
            </span>
            {["Default", "Hover", "Focus", "Loading"].map((state) => (
              <InlineConfirmation
                key={state}
                args={{ ...args, variant, loading: state === "Loading" }}
                visualState={state}
              />
            ))}
          </React.Fragment>
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
      "Both versions and both variants: complete title/message/actions rather than a single button comparison. Each version uses its own Dialog and Button primitives; the presentations are contained and do not open portals."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[924px] grid-cols-[88px_384px_384px] items-start gap-6">
        <div />
        {["v1 · ui/confirmation-modal", "v2 · ui/v2/confirmation-modal"].map(
          (label) => (
            <span
              key={label}
              className="text-xs font-normal text-[var(--v2-text-muted,#707070)]"
            >
              {label}
            </span>
          )
        )}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span className="pt-6 text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {variant}
            </span>
            <InlineConfirmation args={{ ...args, variant }} version="v1" />
            <InlineConfirmation args={{ ...args, variant }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function NotificationExample({
  args,
  updateArgs,
}: {
  args: ConfirmArgs;
  updateArgs: (next: Partial<ConfirmArgs>) => void;
}) {
  const [enabled, setEnabled] = React.useState(true);
  const [result, setResult] = React.useState("No changes made.");
  return (
    <section className="flex w-[520px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Inbox notifications
        </p>
        <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
          Confirm before changing this workspace preference.
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
          Desktop notifications: {enabled ? "Enabled" : "Paused"}
        </span>
        <LiveConfirmation
          args={args}
          updateArgs={updateArgs}
          onResult={(result) => {
            setResult(result);
            if (result.startsWith("Confirmed")) {
              setEnabled(!enabled);
              updateArgs({
                title: enabled
                  ? "Enable notifications?"
                  : "Pause notifications?",
                description: enabled
                  ? "New message alerts will resume in this workspace."
                  : "You can enable notifications again at any time.",
                confirmButtonText: enabled
                  ? "Enable notifications"
                  : "Pause notifications",
                cancelButtonText: enabled ? "Keep paused" : "Keep enabled",
              });
            }
          }}
        />
      </div>
      <p
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        {result}
      </p>
    </section>
  );
}
export const Usage: Story = {
  args: { triggerLabel: "Change preference" },
  parameters: {
    docs: {
      description: {
        story:
          "A real controlled confirmation. Confirm toggles the local preference and closes; its next decision and labels update in Controls. Cancel leaves it unchanged. Copy, button labels, variant and loading Controls remain live. No external preference is changed.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ConfirmArgs>();
    return <NotificationExample args={args} updateArgs={updateArgs} />;
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  parameters: {
    // This render calls updateArgs, and Storybook restores mocks on every re-render by default, which would wipe the spy history mid-play.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Opens the confirmation from its trigger, then answers it with Keep enabled and Pause notifications, and dismisses it with the corner close button and an overlay click, checking the callback spies each time. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Review action" });
    const openModal = async () => {
      await userEvent.click(trigger);
      return body.findByRole("dialog", { name: "Pause notifications?" });
    };
    const modalClosed = () =>
      waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());

    await step("The trigger opens the question with its message", async () => {
      const dialog = await openModal();
      await expect(dialog).toHaveAccessibleDescription(
        "You can enable notifications again at any time."
      );
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("Keep enabled cancels without confirming", async () => {
      await userEvent.click(body.getByRole("button", { name: "Keep enabled" }));
      await modalClosed();
      await expect(args.onCancel).toHaveBeenCalledTimes(1);
      await expect(args.onConfirm).not.toHaveBeenCalled();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step("Pause notifications confirms and closes", async () => {
      await openModal();
      await userEvent.click(
        body.getByRole("button", { name: "Pause notifications" })
      );
      await modalClosed();
      await expect(args.onConfirm).toHaveBeenCalledTimes(1);
      await expect(args.onCancel).toHaveBeenCalledTimes(1);
    });

    await step(
      "The corner close button and the overlay dismiss it",
      async () => {
        await openModal();
        await userEvent.click(body.getByRole("button", { name: "Close" }));
        await modalClosed();
        const dialog = await openModal();
        const overlay = dialog.previousElementSibling as HTMLElement;
        await expect(overlay).toHaveAttribute("data-state", "open");
        await userEvent.click(overlay);
        await modalClosed();
        await expect(args.onConfirm).toHaveBeenCalledTimes(1);
        await expect(args.onOpenChange).toHaveBeenCalledTimes(8);
      }
    );
  },
};

export const KeyboardInteraction: Story = {
  name: "Keyboard interaction test",
  tags: ["!autodocs"],
  parameters: {
    // See Interaction: keep spy history across the args-driven re-renders.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Opens the confirmation with Enter, tabs once around its focus trap, then dismisses it with Escape and checks that focus returns to the trigger without confirming.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Review action" });
    const close = () => body.getByRole("button", { name: "Close" });
    const cancel = () => body.getByRole("button", { name: "Keep enabled" });
    const confirm = () =>
      body.getByRole("button", { name: "Pause notifications" });

    await step(
      "Enter on the trigger opens it and moves focus inside",
      async () => {
        trigger.focus();
        await userEvent.keyboard("{Enter}");
        await body.findByRole("dialog", { name: "Pause notifications?" });
        await expect(close()).toHaveFocus();
      }
    );

    await step(
      "Tab visits each control and wraps back to the start",
      async () => {
        await userEvent.tab();
        await expect(cancel()).toHaveFocus();
        await userEvent.tab();
        await expect(confirm()).toHaveFocus();
        await userEvent.tab();
        await expect(close()).toHaveFocus();
      }
    );

    await step(
      "Escape closes it, returns focus and confirms nothing",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(body.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
        await expect(args.onConfirm).not.toHaveBeenCalled();
        await waitFor(() => expect(trigger).toHaveFocus());
      }
    );
  },
};
