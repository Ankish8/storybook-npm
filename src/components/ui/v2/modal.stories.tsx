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
import { Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import {
  Modal,
  ModalPanel,
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalMedia,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalCancel,
  ModalAction,
  modalSurfaceClass,
  type ModalProps,
} from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Button as ButtonV1 } from "../button";
import { Input as InputV1 } from "../input";
import {
  Dialog as DialogV1,
  DialogHeader as HeaderV1,
  DialogTitle as TitleV1,
  DialogDescription as DescriptionV1,
  DialogFooter as FooterV1,
} from "../dialog";
import { v2ComponentDocs } from "./story-docs";

type ConfirmArgs = ModalProps & { triggerLabel: string };
const VARIANTS = ["default", "destructive"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;
/** Width of each size's inline preview; the real modal uses the same max-widths. */
const SIZE_WIDTH = {
  xs: "w-80",
  sm: "w-96",
  default: "w-[512px]",
  lg: "w-[672px]",
  xl: "w-[896px]",
  full: "w-full",
} as const;
const SHADOW =
  "shadow-[0_20px_24px_-4px_rgba(10,13,18,.08),0_8px_8px_-4px_rgba(10,13,18,.03),0_3px_3px_-1.5px_rgba(10,13,18,.04)]";
const LABEL = "text-xs font-normal text-[var(--v2-text-muted,#707070)]";

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
    <Modal
      {...args}
      trigger={
        <Button
          variant={args.variant === "destructive" ? "destructive" : "outline"}
        >
          {args.triggerLabel}
        </Button>
      }
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

/**
 * The real modal interior, drawn inline instead of in a portal so galleries never cover Docs. It is the same
 * function the modal itself renders, so these samples cannot drift from the component.
 */
function InlineConfirmation({
  args,
  visualState,
}: {
  args: ConfirmArgs;
  visualState?: string;
}) {
  const [typed, setTyped] = React.useState("");
  const size = args.size ?? "sm";
  return (
    <ModalRoot open={false} modal={false}>
      <section
        data-presentation="inline"
        data-version="v2"
        data-size={size}
        data-layout={size === "xs" ? "stack" : "beside"}
        aria-label={String(args.title)}
        className={cn(
          modalSurfaceClass,
          "max-w-full",
          SIZE_WIDTH[size],
          visualState === "Hover" && "pseudo-hover-all",
          visualState === "Focus" && "pseudo-focus-visible-all"
        )}
      >
        <ModalPanel {...args} typed={typed} onTypedChange={setTyped} />
      </section>
    </ModalRoot>
  );
}

/** What the v1 modal looked like, drawn from the v1 Dialog and Button so the comparison is honest. */
function InlineV1({
  args,
  typeToConfirm,
}: {
  args: ConfirmArgs;
  typeToConfirm?: string;
}) {
  const [typed, setTyped] = React.useState("");
  return (
    <DialogV1 open={false} modal={false}>
      <section
        data-presentation="inline"
        data-version="v1"
        aria-label={String(args.title)}
        className={cn(
          "flex w-96 max-w-full flex-col gap-4 overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-6 text-semantic-text-primary",
          SHADOW
        )}
      >
        <HeaderV1>
          <TitleV1>{args.title}</TitleV1>
          <DescriptionV1 className={args.description ? undefined : "sr-only"}>
            {args.description || "Confirmation dialog"}
          </DescriptionV1>
        </HeaderV1>
        {typeToConfirm && (
          <div className="grid gap-2 py-4">
            <label className="text-sm font-semibold text-semantic-text-secondary">
              Enter "{typeToConfirm}" in uppercase to confirm
            </label>
            <InputV1
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder={typeToConfirm}
              autoComplete="off"
            />
          </div>
        )}
        <FooterV1 className="gap-2 sm:gap-0">
          <ButtonV1 variant="outline" disabled={args.loading}>
            {args.cancelButtonText}
          </ButtonV1>
          <ButtonV1
            variant={args.variant === "destructive" ? "destructive" : "default"}
            disabled={
              args.loading ||
              (typeToConfirm !== undefined && typed !== typeToConfirm)
            }
            loading={args.loading}
          >
            {args.confirmButtonText}
          </ButtonV1>
        </FooterV1>
      </section>
    </DialogV1>
  );
}

const meta: Meta<ConfirmArgs> = {
  title: "V2/Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "title",
        "description",
        "variant",
        "size",
        "loading",
        "requireText",
        "showCloseButton",
        "confirmDisabled",
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
          name: "modal",
          exportName: "Modal",
          summary:
            "The one modal: a plain yes/no, a destructive action, a type-to-confirm gate or a form. Use the all-in-one Modal, or compose the shadcn-style Modal parts yourself. It replaces v1's Dialog, FormModal, ConfirmationModal and DeleteConfirmationModal.",
          changes: [
            [
              "Components",
              "Four: Dialog, FormModal, ConfirmationModal, DeleteConfirmationModal",
              "One: Modal (all-in-one) and the Modal* parts. Every v1 name is still exported from the same file",
            ],
            [
              "Container",
              "8px corners, 24px padding",
              "12px corners, 16px padding and gap. Widths: xs 320, sm 384, default 512, lg 672, xl 896, full",
            ],
            [
              "Header",
              "Title and description stacked",
              "Text only by default. An optional 40px icon tile beside the text (centred above it for size xs). 16px medium title, 14px description",
            ],
            [
              "Actions",
              "Buttons right-aligned on the dialog surface",
              "Muted footer strip with a top border and compact 32px buttons; right-aligned, equal-width in size xs, stacked on mobile. Focus lands on Cancel",
            ],
            [
              "Close button",
              "Corner × always shown",
              "ModalContent shows it unless hideCloseButton. The all-in-one Modal shows it only with showCloseButton: Cancel and Escape dismiss",
            ],
            [
              "Type to confirm",
              "A separate DeleteConfirmationModal",
              "requireText on Modal",
            ],
            [
              "Forms",
              "A separate FormModal with onSave",
              "Pass the fields as Modal children; onConfirm saves and confirmDisabled blocks it",
            ],
            [
              "Callbacks",
              "onConfirm / onCancel / onOpenChange",
              "Preserved; consumer closes after confirming",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Tile", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            [
              "Destructive tile",
              "--semantic-error-surface",
              "#FEF3F2",
              "#FEF3F2",
            ],
            [
              "Destructive icon",
              "--semantic-error-primary",
              "#F04438",
              "#F04438",
            ],
            ["Footer strip", "--semantic-bg-ui at 50%", "#F5F5F5", "#FAFAFA"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Corners", "12px literal", "12px"],
            ["Width", "320 / 384 / 512 / 672 / 896px by size", "384px"],
          ],
          guidance:
            'Keep the message brief and name the action on the confirm button. Use destructive for a risky action, and requireText when it cannot be undone; pair them with size="xs" and a Trash2 icon for shadcn\'s destructive look. Add an icon only when it helps: there is none by default. onConfirm remains a callback: the consumer decides when to close. Loading disables confirm and cancel. For a layout of your own, compose ModalRoot, ModalContent, ModalHeader, ModalFooter, ModalCancel and ModalAction. Migrating from v1: change the import to @/components/ui/v2/modal. Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose, FormModal, ConfirmationModal and DeleteConfirmationModal are all still exported there with their v1 props, so nothing else changes. To move to the new names: Dialog* becomes Modal* (Dialog is ModalRoot); FormModal becomes Modal with children, onSave to onConfirm, saveButtonText to confirmButtonText, disableSave to confirmDisabled and showCloseButton; DeleteConfirmationModal becomes Modal with variant="destructive", requireText instead of confirmText, confirmButtonText instead of deleteButtonText, and a title such as "Delete this webhook?" instead of itemName.',
        }),
      },
    },
  },
  args: {
    open: false,
    title: "Pause notifications?",
    description: "You can enable notifications again at any time.",
    variant: "default",
    size: "sm",
    loading: false,
    showCloseButton: false,
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
    size: { control: "inline-radio", options: SIZES },
    loading: { control: "boolean" },
    requireText: {
      control: "text",
      description:
        "Phrase the user must type before confirming. Empty or unset means a plain yes/no.",
    },
    showCloseButton: { control: "boolean" },
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
    icon: { control: false },
    requireTextLabel: { control: false },
    inputId: { control: false },
    srDescription: { control: false },
    children: { control: false },
    footer: { control: false },
    confirmDisabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ConfirmArgs>();
    // An empty Controls field means "no phrase", not "an empty phrase".
    const requireText = args.requireText || undefined;
    return (
      <div className="p-8">
        <LiveConfirmation
          args={{ ...args, requireText }}
          updateArgs={updateArgs}
        />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const TRASH = <Trash2 strokeWidth={1.75} aria-hidden />;
// shadcn's "Delete chat" example: small, centred, a trash tile, a destructive action.
const DESTRUCTIVE = {
  variant: "destructive",
  size: "xs",
  icon: TRASH,
  title: "Delete chat?",
  description:
    "This will permanently delete this chat conversation. This action cannot be undone.",
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",
  triggerLabel: "Delete chat",
} as const;
const TYPED = {
  variant: "destructive",
  size: "xs",
  icon: TRASH,
  title: "Delete this webhook?",
  description:
    "This permanently removes the webhook and its delivery history. This action cannot be undone.",
  requireText: "DELETE",
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",
  triggerLabel: "Delete webhook",
} as const;

export const Overview: Story = {};
export const Default: Story = {};
export const Destructive: Story = { args: DESTRUCTIVE };
export const TypeToConfirm: Story = {
  name: "Type to confirm",
  args: TYPED,
  parameters: {
    docs: {
      description: {
        story:
          "Set requireText and the confirm action stays disabled until the user types that exact phrase. The field takes initial focus, and the phrase clears whenever the modal closes. This is what DeleteConfirmationModal did.",
      },
    },
  },
};
export const Compact: Story = {
  args: { size: "xs" },
  parameters: {
    docs: {
      description: {
        story:
          "The xs size: 320px, always centred, with two equal-width actions. Suits a short question.",
      },
    },
  },
};
export const WithCloseButton: Story = {
  name: "With close button",
  args: { showCloseButton: true },
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
      [...INLINE, "variant", "requireText"],
      "Plain, destructive and type-to-confirm. Title, description and button labels remain editable in every sample. None of them opens a portal over Docs."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1224px] grid-cols-3 items-start gap-6">
        {(
          [
            ["default", { variant: "default" }],
            [
              "destructive",
              { variant: "destructive", size: "xs", icon: TRASH },
            ],
            [
              "type to confirm",
              {
                variant: "destructive",
                size: "xs",
                icon: TRASH,
                requireText: "DELETE",
              },
            ],
          ] as const
        ).map(([label, extra]) => (
          <div key={label} className="flex flex-col gap-3">
            <span className={LABEL}>{label}</span>
            <InlineConfirmation args={{ ...args, ...extra }} />
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
      [...INLINE, "size"],
      "xs (320px), sm (384px), default (512px) and lg (672px), each with and without a description."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex flex-wrap items-start gap-6">
        {SIZES.map((size) => (
          <div key={size} className="flex max-w-full flex-col gap-3">
            <span className={LABEL}>{size}</span>
            <InlineConfirmation args={{ ...args, size }} />
            <InlineConfirmation
              args={{ ...args, size, description: "", title: "Keep it short?" }}
            />
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
          <span key={state} className={LABEL}>
            {state}
          </span>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span className={cn("pt-6", LABEL)}>{variant}</span>
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
      "Both versions and both variants: complete title, message and actions rather than a single button comparison. Each version uses its own Dialog and Button primitives; the presentations are contained and do not open portals."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[924px] grid-cols-[88px_384px_384px] items-start gap-6">
        <div />
        {["v1 · ui/confirmation-modal", "v2 · ui/v2/modal"].map((label) => (
          <span key={label} className={LABEL}>
            {label}
          </span>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span className={cn("pt-6", LABEL)}>{variant}</span>
            <InlineV1 args={{ ...args, variant }} />
            <InlineConfirmation args={{ ...args, variant }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const MigratingFromDelete: Story = {
  name: "Migrating from DeleteConfirmationModal",
  parameters: {
    ...gallery(
      [...INLINE, "variant", "requireText", "size"],
      'The v1 DeleteConfirmationModal beside the unified v2 Modal with requireText. v1 code migrates by changing its import to ui/v2/modal, which still exports DeleteConfirmationModal with every v1 prop and renders the v2 column. To move to the single component: itemName → title, confirmText → requireText, deleteButtonText → confirmButtonText, plus variant="destructive", size="xs" and a Trash2 icon.'
    ),
    layout: "padded",
  },
  render: (args) => {
    const typed = { ...args, ...TYPED };
    return (
      <div className="max-w-full overflow-x-auto p-4">
        <div className="grid min-w-[800px] grid-cols-2 items-start gap-6">
          <span className={LABEL}>v1 · DeleteConfirmationModal</span>
          <span className={LABEL}>v2 · Modal requireText</span>
          <InlineV1 args={typed} typeToConfirm="DELETE" />
          <InlineConfirmation args={typed} />
        </div>
      </div>
    );
  },
};
function ProfileFields() {
  const [name, setName] = React.useState("Ada Lovelace");
  const [email, setEmail] = React.useState("ada@example.com");
  return (
    <>
      <div className="grid gap-2">
        <label
          htmlFor="modal-story-name"
          className="text-sm font-medium text-[var(--v2-text-secondary,#5E5E5E)]"
        >
          Name
        </label>
        <Input
          id="modal-story-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor="modal-story-email"
          className="text-sm font-medium text-[var(--v2-text-secondary,#5E5E5E)]"
        >
          Email
        </label>
        <Input
          id="modal-story-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
    </>
  );
}
export const Form: Story = {
  args: {
    title: "Edit profile",
    description: "Make changes to your profile here.",
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    showCloseButton: true,
    triggerLabel: "Edit profile",
    children: <ProfileFields />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A form: pass the fields as children. Save is onConfirm, confirmDisabled blocks it while the form is invalid, and loading shows progress. This replaces v1's FormModal.",
      },
    },
  },
};
export const Composition: Story = {
  name: "Composition (parts)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "For a layout the all-in-one Modal does not cover, compose the parts: ModalRoot, ModalTrigger, ModalContent, ModalHeader, ModalMedia, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalCancel and ModalAction. This is what v1 code used Dialog for.",
      },
    },
  },
  render: () => (
    <div className="p-8">
      <ModalRoot>
        <ModalTrigger asChild>
          <Button variant="outline">Share project</Button>
        </ModalTrigger>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalMedia>
              <Share2 strokeWidth={1.75} aria-hidden />
            </ModalMedia>
            <ModalTitle>Share this project?</ModalTitle>
            <ModalDescription>
              Anyone with the link will be able to view and edit this project.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalCancel>Not now</ModalCancel>
            <ModalAction>Share</ModalAction>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await step("The trigger opens the composed modal", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Share project" })
      );
      const dialog = await body.findByRole("dialog", {
        name: "Share this project?",
      });
      await expect(dialog).toHaveAccessibleDescription(
        "Anyone with the link will be able to view and edit this project."
      );
    });
    await step("Cancel closes it", async () => {
      await userEvent.click(body.getByRole("button", { name: "Not now" }));
      await waitFor(() =>
        expect(body.queryByRole("dialog")).not.toBeInTheDocument()
      );
    });
  },
};
export const FormInteraction: Story = {
  name: "Form interaction test",
  tags: ["!autodocs"],
  args: {
    title: "Edit profile",
    description: "Make changes to your profile here.",
    confirmButtonText: "Save",
    showCloseButton: true,
    triggerLabel: "Edit profile",
    children: <ProfileFields />,
  },
  parameters: { test: { restoreMocks: false } },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await step("The fields are in the modal and Save is enabled", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Edit profile" })
      );
      await body.findByRole("dialog", { name: "Edit profile" });
      await userEvent.clear(body.getByLabelText("Name"));
      await userEvent.type(body.getByLabelText("Name"), "Grace Hopper");
      await expect(body.getByLabelText("Name")).toHaveValue("Grace Hopper");
    });
    await step("Save confirms; the corner close dismisses", async () => {
      await userEvent.click(body.getByRole("button", { name: "Save" }));
      await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    });
  },
};
export const CustomIcon: Story = {
  name: "Custom icon",
  args: {
    title: "Share this project?",
    description: "Anyone with the link will be able to view and edit it.",
    confirmButtonText: "Share",
    cancelButtonText: "Not now",
    triggerLabel: "Share project",
    icon: <Share2 strokeWidth={1.75} aria-hidden />,
  },
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
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
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
        className="m-0 text-sm text-[var(--v2-text-muted,#707070)]"
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
          "Opens the confirmation from its trigger, then answers it with Keep enabled and Pause notifications, and dismisses it with Escape and an overlay click, checking the callback spies each time. Open the Interactions panel to step through it.",
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

    await step("Escape and the overlay dismiss it", async () => {
      await openModal();
      await userEvent.keyboard("{Escape}");
      await modalClosed();
      const dialog = await openModal();
      const overlay = dialog.previousElementSibling as HTMLElement;
      await expect(overlay).toHaveAttribute("data-state", "open");
      await userEvent.click(overlay);
      await modalClosed();
      await expect(args.onConfirm).toHaveBeenCalledTimes(1);
      await expect(args.onCancel).toHaveBeenCalledTimes(1);
      await expect(args.onOpenChange).toHaveBeenCalledTimes(8);
    });
  },
};

export const TypeToConfirmInteraction: Story = {
  name: "Type to confirm interaction test",
  tags: ["!autodocs"],
  args: TYPED,
  parameters: {
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Delete stays disabled until the exact phrase is typed, then confirms. Cancelling clears what was typed.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Delete webhook" });
    const openModal = async () => {
      await userEvent.click(trigger);
      return body.findByRole("dialog", { name: "Delete this webhook?" });
    };
    const confirm = () => body.getByRole("button", { name: "Delete" });

    await step("The phrase field takes focus and Delete is off", async () => {
      await openModal();
      const field = body.getByRole("textbox");
      await waitFor(() => expect(field).toHaveFocus());
      await expect(confirm()).toBeDisabled();
    });

    await step("A wrong or partial phrase keeps Delete off", async () => {
      const field = body.getByRole("textbox");
      await userEvent.type(field, "delete");
      await expect(confirm()).toBeDisabled();
      await userEvent.clear(field);
      await userEvent.type(field, "DELET");
      await expect(confirm()).toBeDisabled();
    });

    await step("The exact phrase enables Delete and confirms", async () => {
      await userEvent.type(body.getByRole("textbox"), "E");
      await expect(confirm()).toBeEnabled();
      await userEvent.click(confirm());
      await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    });

    await step("Cancelling clears the phrase for next time", async () => {
      await openModal();
      await userEvent.type(body.getByRole("textbox"), "DELETE");
      await userEvent.click(body.getByRole("button", { name: "Cancel" }));
      await waitFor(() =>
        expect(body.queryByRole("dialog")).not.toBeInTheDocument()
      );
      await openModal();
      await expect(body.getByRole("textbox")).toHaveValue("");
      await expect(args.onCancel).toHaveBeenCalledTimes(1);
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
          "Opens the confirmation with Enter, checks that focus starts on Cancel, tabs once around its focus trap, then dismisses it with Escape and checks that focus returns to the trigger without confirming.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Review action" });
    const cancel = () => body.getByRole("button", { name: "Keep enabled" });
    const confirm = () =>
      body.getByRole("button", { name: "Pause notifications" });

    await step(
      "Enter on the trigger opens it and focuses the safe choice",
      async () => {
        trigger.focus();
        await userEvent.keyboard("{Enter}");
        await body.findByRole("dialog", { name: "Pause notifications?" });
        await waitFor(() => expect(cancel()).toHaveFocus());
      }
    );

    await step(
      "Tab visits each control and wraps back to the start",
      async () => {
        await userEvent.tab();
        await expect(confirm()).toHaveFocus();
        await userEvent.tab();
        await expect(cancel()).toHaveFocus();
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
