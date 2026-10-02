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
import { Info, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  dialogContentVariants,
  type DialogContentProps,
} from "./dialog";
import {
  Dialog as DialogV1,
  DialogHeader as DialogHeaderV1,
  DialogFooter as DialogFooterV1,
  DialogTitle as DialogTitleV1,
  DialogDescription as DialogDescriptionV1,
  DialogClose as DialogCloseV1,
  dialogContentVariants as dialogContentVariantsV1,
} from "../dialog";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Input } from "./input";
import { v2ComponentDocs } from "./story-docs";

const SIZES = ["sm", "default", "lg", "xl", "full"] as const;
const SIZE_LABELS = {
  sm: "Small · 384px",
  default: "Default · 512px",
  lg: "Large · 672px",
  xl: "Extra large · 896px",
  full: "Full · viewport with 16px gutters",
} as const;

type DialogStoryArgs = React.ComponentProps<typeof Dialog> &
  Pick<DialogContentProps, "size" | "hideCloseButton"> & {
    triggerLabel: string;
    title: string;
    description: string;
    body: string;
    actionLabel: string;
    cancelLabel: string;
    leadingIcon: boolean;
    busy: boolean;
    onAction: () => void;
    name: string;
    email: string;
  };

function dialogSections(args: DialogStoryArgs, version: "v1" | "v2" = "v2") {
  const Header = version === "v2" ? DialogHeader : DialogHeaderV1;
  const Title = version === "v2" ? DialogTitle : DialogTitleV1;
  const Description =
    version === "v2" ? DialogDescription : DialogDescriptionV1;
  const Footer = version === "v2" ? DialogFooter : DialogFooterV1;
  const Close = version === "v2" ? DialogClose : DialogCloseV1;
  const Action = version === "v2" ? Button : ButtonV1;
  return (
    <>
      <Header
        className="flex-row items-start gap-4 space-y-0"
        data-dialog-section="header"
      >
        {args.leadingIcon && (
          <Info
            aria-hidden="true"
            className={
              version === "v1"
                ? "size-6 shrink-0 text-semantic-text-secondary"
                : "size-6 shrink-0 text-[var(--v2-text-secondary,#5E5E5E)]"
            }
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Title>{args.title}</Title>
          <Description className={args.description ? undefined : "sr-only"}>
            {args.description || "Dialog content"}
          </Description>
        </div>
        {!args.hideCloseButton && (
          <span aria-hidden="true" className="size-6 shrink-0" />
        )}
      </Header>
      <div
        className={
          version === "v2"
            ? "flex flex-col gap-4 p-6"
            : "flex flex-col gap-4 py-4"
        }
        data-dialog-section="body"
      >
        <p
          className={
            version === "v1"
              ? "m-0 text-sm leading-5 text-semantic-text-secondary"
              : "m-0 text-sm leading-5 text-[var(--v2-text-secondary,#5E5E5E)]"
          }
        >
          {args.body}
        </p>
        <div className="rounded-lg border border-solid border-semantic-border-layout p-4">
          <p
            className={
              version === "v1"
                ? "m-0 text-sm font-semibold text-semantic-text-primary"
                : "m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]"
            }
          >
            Conversation settings
          </p>
          <p
            className={
              version === "v1"
                ? "m-0 mt-1 text-xs leading-4 text-semantic-text-muted"
                : "m-0 mt-1 text-xs leading-4 text-[var(--v2-text-muted,#707070)]"
            }
          >
            Changes apply to future conversations in this workspace.
          </p>
        </div>
      </div>
      <Footer data-dialog-section="footer">
        <Close asChild>
          <Action variant="outline" size="default">
            {args.cancelLabel}
          </Action>
        </Close>
        <Close asChild>
          <Action
            size="default"
            loading={args.busy}
            loadingText="Saving…"
            onClick={() => args.onAction?.()}
          >
            {args.actionLabel}
          </Action>
        </Close>
      </Footer>
    </>
  );
}

function LiveDialog(args: DialogStoryArgs) {
  return (
    <div className="flex max-w-full flex-col items-start gap-3">
      <Dialog
        open={args.open}
        onOpenChange={args.onOpenChange}
        modal={args.modal}
      >
        <DialogTrigger asChild>
          <Button variant="outline">{args.triggerLabel}</Button>
        </DialogTrigger>
        <DialogContent
          size={args.size}
          hideCloseButton={args.hideCloseButton}
          data-v2-component="dialog"
          data-size={args.size}
        >
          {dialogSections(args)}
        </DialogContent>
      </Dialog>
      <p
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        Dialog is {args.open ? "open" : "closed"}
      </p>
    </div>
  );
}

/**
 * Presentation only: uses the real content variants and section primitives.
 * It creates no portal, overlay or focus scope, so Docs can show several views.
 * Open a live example to check dismissal, keyboard focus and viewport sizing.
 */
function InlineDialog({
  version = "v2",
  ...args
}: DialogStoryArgs & { version?: "v1" | "v2" }) {
  const Root = version === "v2" ? Dialog : DialogV1;
  const Close = version === "v2" ? DialogClose : DialogCloseV1;
  const variants =
    version === "v2" ? dialogContentVariants : dialogContentVariantsV1;
  return (
    <Root open={false} modal={false} onOpenChange={args.onOpenChange}>
      <section
        aria-label={version + " " + args.size + " dialog preview"}
        className={cn(
          variants({ size: args.size }),
          version === "v1" && "text-foreground",
          "relative left-auto top-auto z-auto m-0 h-auto w-full max-h-none max-w-full translate-x-0 translate-y-0 animate-none overflow-visible duration-0"
        )}
        data-v2-component={version === "v2" ? "dialog" : undefined}
        data-version={version}
        data-size={args.size}
        data-presentation="inline"
      >
        {dialogSections(args, version)}
        {!args.hideCloseButton && (
          <Close
            aria-label="Close preview"
            className={
              version === "v2"
                ? "absolute right-6 top-6 flex size-6 items-center justify-center rounded-md text-[var(--v2-text-muted,#707070)] transition-colors hover:bg-semantic-bg-ui hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
                : "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            }
          >
            <X
              aria-hidden="true"
              className={version === "v2" ? "size-3" : "size-4"}
            />
          </Close>
        )}
      </section>
    </Root>
  );
}

const meta: Meta<DialogStoryArgs> = {
  title: "V2/Components/Dialog",
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
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "modal",
        "size",
        "hideCloseButton",
        "triggerLabel",
        "title",
        "description",
        "body",
        "actionLabel",
        "cancelLabel",
        "leadingIcon",
        "busy",
        "onOpenChange",
        "onAction",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11664",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "dialog",
          summary:
            "A composable modal for a focused task. Existing Radix open, dismissal, focus and accessibility behavior is preserved.",
          exportName:
            "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose",
          changes: [
            ["Radius and border", "8px / 1px", "12px / 1.2px"],
            ["Title", "18px semibold", "Inter 16px medium"],
            ["Description", "14px regular", "Inter 12px regular"],
            [
              "Sections",
              "24px outer padding, 16px gaps",
              "24px header with a divider; 24px body; footer padding 0 / 24 / 24px",
            ],
            ["Close control", "16px icon", "12px icon in a 24px control"],
            [
              "Widths",
              "384 / 512 / 672 / 896px and full",
              "Same size API; 16px minimum viewport gutters",
            ],
            [
              "Behavior",
              "Portals, focus trapping, Escape, outside click and focus return",
              "Unchanged",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Body", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Description", "--semantic-text-muted", "#717680", "#717680"],
            ["Font", "--font-v2", "Inter"],
            ["Corners", "12px literal", "12px"],
            ["Section padding", "24px literal", "24px"],
            [
              "Overlay shadow",
              "Recorded v2 shadow",
              "20px / 24px + 8px / 8px + 3px / 3px layers",
            ],
          ],
          guidance:
            'Use `DialogTitle` for the accessible name. Add `DialogDescription` for context; the component provides a hidden fallback when one is absent. `DialogHeader` and `DialogFooter` own their padding; give the content between them `className="flex flex-col gap-4 p-6"`. Use `DialogClose asChild` for dismissal actions. Hiding the corner close button keeps Escape and outside-click dismissal available. Overview and individual stories synchronize `open` with Controls. Inline galleries intentionally omit portals and focus scopes; use a live example to test keyboard behavior.',
        }),
      },
    },
  },
  args: {
    open: false,
    modal: true,
    size: "default",
    hideCloseButton: false,
    triggerLabel: "Open dialog",
    title: "Update conversation settings",
    description: "Review the change before continuing.",
    body: "Use a dialog when a short task needs your attention before you return to the page.",
    actionLabel: "Continue",
    cancelLabel: "Cancel",
    leadingIcon: false,
    busy: false,
    name: "Alex Morgan",
    email: "alex@example.com",
    onOpenChange: fn(),
    onAction: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DialogStoryArgs>();
    return (
      <LiveDialog
        {...args}
        onOpenChange={(open) => {
          args.onOpenChange?.(open);
          updateArgs({ open });
        }}
      />
    );
  },
  argTypes: {
    open: {
      control: "boolean",
      description:
        "Controlled open state. Opening or closing the dialog also updates Controls.",
      table: { category: "Dialog" },
    },
    defaultOpen: {
      control: false,
      description:
        "Initial uncontrolled state. These playgrounds use open for live synchronization.",
      table: { category: "Dialog" },
    },
    modal: {
      control: "boolean",
      description: "Trap focus and block background interaction when true.",
      table: { category: "Dialog" },
    },
    onOpenChange: {
      control: false,
      description: "Called on trigger, close, Escape and outside dismissal.",
      table: { category: "Dialog" },
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Small 384px, default 512px, large 672px, XL 896px or full.",
      table: { category: "DialogContent" },
    },
    hideCloseButton: {
      control: "boolean",
      description:
        "Hide the corner close button; other dismissal stays available.",
      table: { category: "DialogContent" },
    },
    triggerLabel: {
      control: "text",
      description: "Text of the button that opens the example.",
      table: { category: "Example composition" },
    },
    title: {
      control: "text",
      description: "Accessible dialog title.",
      table: { category: "Example composition" },
    },
    description: {
      control: "text",
      description:
        "Context beneath the title; a hidden fallback is used if empty.",
      table: { category: "Example composition" },
    },
    body: {
      control: "text",
      description: "Main text inside the example body.",
      table: { category: "Example composition" },
    },
    actionLabel: {
      control: "text",
      description: "Primary footer action.",
      table: { category: "Example composition" },
    },
    cancelLabel: {
      control: "text",
      description: "Dismissal action in the footer.",
      table: { category: "Example composition" },
    },
    leadingIcon: {
      control: "boolean",
      description: "Add an informational icon to the example header.",
      table: { category: "Example composition" },
    },
    busy: {
      control: "boolean",
      description: "Show the primary action loading and disabled.",
      table: { category: "Example composition" },
    },
    onAction: {
      control: false,
      description: "Example callback for the primary action.",
      table: { category: "Example composition" },
    },
    name: {
      control: "text",
      description: "Live profile name in the Usage form.",
      table: { category: "Usage form" },
    },
    email: {
      control: "text",
      description: "Live email in the Usage form.",
      table: { category: "Usage form" },
    },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const Full: Story = { args: { size: "full" } };
export const WithIcon: Story = {
  name: "With an icon",
  args: { leadingIcon: true },
};
export const HideCloseButton: Story = {
  name: "Without the corner close button",
  args: { hideCloseButton: true },
};
export const LoadingAction: Story = {
  name: "Loading action",
  args: { busy: true },
};

const INLINE_CONTROLS = ["open", "modal", "triggerLabel"];

export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "size", "leadingIcon", "hideCloseButton"],
      "Dialog has no color variant prop. These inline compositions fix small size, header icon and corner-close visibility. Text and loading controls apply to every sample. The previews create no overlay; footer actions emit callbacks."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-1 pb-8">
      <div className="grid min-w-[1200px] grid-cols-3 items-start gap-6">
        {[
          { label: "Default", leadingIcon: false, hideCloseButton: false },
          { label: "With an icon", leadingIcon: true, hideCloseButton: false },
          {
            label: "Without corner close",
            leadingIcon: false,
            hideCloseButton: true,
          },
        ].map((variant) => (
          <div key={variant.label} className="flex min-w-0 flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {variant.label}
            </span>
            <InlineDialog
              {...args}
              size="sm"
              leadingIcon={variant.leadingIcon}
              hideCloseButton={variant.hideCloseButton}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All sizes",
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "size"],
      "Inline cards show the four recorded widths. The full sample is 896px here; its live story fills the viewport with 16px gutters. Other controls update each card. The wide row scrolls inside this preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-1 pb-8">
      <div className="grid w-max grid-cols-[384px_512px_672px_896px_896px] items-start gap-6">
        {SIZES.map((size) => (
          <div key={size} className="flex min-w-0 flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {SIZE_LABELS[size]}
            </span>
            <InlineDialog {...args} size={size} />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "size", "busy", "hideCloseButton"],
      "Inline open, loading-action and corner-close states use fixed small size. Editable text and the icon control apply throughout. Dialog dismissal has no hover/focus color state; keyboard behavior is available in the live stories."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-1 pb-8">
      <div className="grid min-w-[1200px] grid-cols-3 items-start gap-6">
        {[
          { label: "Open", busy: false, hideCloseButton: false },
          { label: "Saving", busy: true, hideCloseButton: false },
          { label: "Corner close hidden", busy: false, hideCloseButton: true },
        ].map((state) => (
          <div key={state.label} className="flex min-w-0 flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {state.label}
            </span>
            <InlineDialog
              {...args}
              size="sm"
              busy={state.busy}
              hideCloseButton={state.hideCloseButton}
            />
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
      [...INLINE_CONTROLS, "size"],
      "Every size receives the same text, icon, close and loading controls in both versions. Cards are capped to comparison columns; All sizes and the individual live stories demonstrate actual widths. The comparison scrolls inside its own preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-1 pb-8">
      <div className="grid min-w-[960px] grid-cols-[144px_384px_384px] items-start gap-x-6 gap-y-6">
        <div />
        <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
          v1 · ui/dialog
        </span>
        <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
          v2 · ui/v2/dialog
        </span>
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <span className="pt-6 text-xs font-normal text-[var(--v2-text-secondary,#5E5E5E)]">
              {SIZE_LABELS[size]}
            </span>
            <InlineDialog {...args} version="v1" size={size} />
            <InlineDialog {...args} size={size} />
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};

function ProfileExample({
  args,
  updateArgs,
}: {
  args: DialogStoryArgs;
  updateArgs: (next: Partial<DialogStoryArgs>) => void;
}) {
  const generatedId = React.useId();
  const [savedProfile, setSavedProfile] = React.useState({
    name: args.name,
    email: args.email,
  });
  const [saved, setSaved] = React.useState(false);
  const onOpenChange = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <div className="w-[420px] max-w-full rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Workspace profile
      </p>
      <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
        Edit the local example and save to update this card.
      </p>
      <dl className="m-0 my-6 grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 text-sm">
        <dt className="font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
          Name
        </dt>
        <dd className="m-0 break-words text-[var(--v2-text-secondary,#5E5E5E)]">
          {savedProfile.name}
        </dd>
        <dt className="font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
          Email
        </dt>
        <dd className="m-0 break-words text-[var(--v2-text-secondary,#5E5E5E)]">
          {savedProfile.email}
        </dd>
      </dl>
      <Dialog open={args.open} modal={args.modal} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" leftIcon={<Pencil />}>
            {args.triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent size={args.size} hideCloseButton={args.hideCloseButton}>
          <DialogHeader className="flex-row items-start gap-4">
            {args.leadingIcon && (
              <Info
                aria-hidden="true"
                className="size-6 shrink-0 text-[var(--v2-text-secondary,#5E5E5E)]"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DialogTitle>{args.title}</DialogTitle>
              <DialogDescription>
                {args.description || "Edit your profile."}
              </DialogDescription>
            </div>
            {!args.hideCloseButton && (
              <span aria-hidden="true" className="size-6 shrink-0" />
            )}
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              args.onAction();
              setSavedProfile({ name: args.name, email: args.email });
              setSaved(true);
              onOpenChange(false);
            }}
          >
            <div className="flex flex-col gap-4 p-6" data-dialog-section="body">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={generatedId + "name"}
                  className="text-sm font-medium leading-5 text-[var(--v2-text-secondary,#5E5E5E)]"
                >
                  Name
                </label>
                <Input
                  id={generatedId + "name"}
                  value={args.name}
                  placeholder="Enter your name"
                  required
                  onChange={(event) => updateArgs({ name: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={generatedId + "email"}
                  className="text-sm font-medium leading-5 text-[var(--v2-text-secondary,#5E5E5E)]"
                >
                  Email
                </label>
                <Input
                  id={generatedId + "email"}
                  type="email"
                  value={args.email}
                  placeholder="you@example.com"
                  required
                  onChange={(event) =>
                    updateArgs({ email: event.target.value })
                  }
                />
                <p className="m-0 text-xs leading-4 text-[var(--v2-text-muted,#707070)]">
                  This example saves only in the preview.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateArgs({ ...savedProfile });
                  onOpenChange(false);
                }}
              >
                {args.cancelLabel}
              </Button>
              <Button type="submit" loading={args.busy} loadingText="Saving…">
                {args.actionLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p
        className="m-0 mt-4 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        {saved ? "Profile updated in this preview." : "No changes saved yet."}
      </p>
    </div>
  );
}

export const Usage: Story = {
  args: {
    triggerLabel: "Edit profile",
    title: "Edit profile",
    description: "Keep your workspace details up to date.",
    actionLabel: "Save changes",
  },
  parameters: {
    controls: {
      include: [
        "open",
        "modal",
        "size",
        "hideCloseButton",
        "triggerLabel",
        "title",
        "description",
        "actionLabel",
        "cancelLabel",
        "leadingIcon",
        "busy",
        "name",
        "email",
        "onOpenChange",
        "onAction",
      ],
    },
    docs: {
      description: {
        story:
          "A working local profile form. Typing updates name/email in Controls and changing Controls updates the fields. Save updates the profile card and closes the dialog; Cancel restores the saved values. Size, modal, corner-close, icon, copy and loading controls remain live.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DialogStoryArgs>();
    return <ProfileExample args={args} updateArgs={updateArgs} />;
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
          "Opens the dialog from its trigger, then dismisses it with Continue, Cancel, the corner close button and an overlay click, checking the open-change and action spies each time. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    const openDialog = async () => {
      await userEvent.click(trigger);
      return body.findByRole("dialog", {
        name: "Update conversation settings",
      });
    };
    const dialogClosed = () =>
      waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());

    await step("The trigger opens a labelled, described dialog", async () => {
      const dialog = await openDialog();
      await expect(dialog).toHaveAccessibleDescription(
        "Review the change before continuing."
      );
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step("Continue runs the action and closes the dialog", async () => {
      await userEvent.click(body.getByRole("button", { name: "Continue" }));
      await expect(args.onAction).toHaveBeenCalledTimes(1);
      await dialogClosed();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step(
      "Cancel and the corner close button skip the action",
      async () => {
        await openDialog();
        await userEvent.click(body.getByRole("button", { name: "Cancel" }));
        await dialogClosed();
        await openDialog();
        await userEvent.click(body.getByRole("button", { name: "Close" }));
        await dialogClosed();
        await expect(args.onAction).toHaveBeenCalledTimes(1);
      }
    );

    await step("Clicking the overlay dismisses the dialog", async () => {
      const dialog = await openDialog();
      const overlay = dialog.previousElementSibling as HTMLElement;
      await expect(overlay).toHaveAttribute("data-state", "open");
      await userEvent.click(overlay);
      await dialogClosed();
      await expect(args.onOpenChange).toHaveBeenCalledTimes(8);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });
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
          "Opens the dialog with Enter, tabs around its focus trap in both directions, then dismisses it with Escape and checks that focus returns to the trigger.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    const cancel = () => body.getByRole("button", { name: "Cancel" });
    const proceed = () => body.getByRole("button", { name: "Continue" });
    const close = () => body.getByRole("button", { name: "Close" });

    await step(
      "Enter on the trigger opens it and moves focus inside",
      async () => {
        trigger.focus();
        await userEvent.keyboard("{Enter}");
        await body.findByRole("dialog", {
          name: "Update conversation settings",
        });
        await expect(cancel()).toHaveFocus();
      }
    );

    await step("Tab and Shift+Tab loop within the dialog", async () => {
      await userEvent.tab();
      await expect(proceed()).toHaveFocus();
      await userEvent.tab();
      await expect(close()).toHaveFocus();
      await userEvent.tab();
      await expect(cancel()).toHaveFocus();
      await userEvent.tab({ shift: true });
      await expect(close()).toHaveFocus();
    });

    await step(
      "Escape closes it and returns focus to the trigger",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(body.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
        await waitFor(() => expect(trigger).toHaveFocus());
      }
    );
  },
};
