import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import {
  DeleteConfirmationModal,
  type DeleteConfirmationModalProps,
} from "./delete-confirmation-modal";
import { Button } from "./button";
import { Input } from "./input";
import { Button as ButtonV1 } from "../button";
import { Input as InputV1 } from "../input";
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

type DeleteArgs = DeleteConfirmationModalProps & {
  triggerLabel: string;
  previewValue: string;
};
function LiveDelete({
  args,
  updateArgs,
  onResult,
}: {
  args: DeleteArgs;
  updateArgs: (next: Partial<DeleteArgs>) => void;
  onResult?: (result: string) => void;
}) {
  const changeOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <DeleteConfirmationModal
      {...args}
      trigger={
        <Button variant="outline" leftIcon={<Trash2 />}>
          {args.triggerLabel}
        </Button>
      }
      onOpenChange={changeOpen}
      onCancel={() => {
        args.onCancel?.();
        onResult?.("Cancelled. The item is still available.");
      }}
      onConfirm={() => {
        args.onConfirm?.();
        onResult?.("Deleted from this local preview.");
        changeOpen(false);
      }}
    />
  );
}
function InlineDelete({
  args,
  version = "v2",
  value,
}: {
  args: DeleteArgs;
  version?: "v1" | "v2";
  value?: string;
}) {
  const Root = version === "v2" ? Dialog : DialogV1;
  const Header = version === "v2" ? DialogHeader : HeaderV1;
  const Title = version === "v2" ? DialogTitle : TitleV1;
  const Description = version === "v2" ? DialogDescription : DescriptionV1;
  const Footer = version === "v2" ? DialogFooter : FooterV1;
  const Action = version === "v2" ? Button : ButtonV1;
  const Field = version === "v2" ? Input : InputV1;
  const id = React.useId();
  const initial = value ?? args.previewValue;
  const [text, setText] = React.useState(initial);
  React.useEffect(() => setText(initial), [initial]);
  const title =
    args.title || `Are you sure you want to delete this ${args.itemName}?`;
  const titleCopy = (
    <>
      <Title>{title}</Title>
      <Description className={args.description ? undefined : "sr-only"}>
        {args.description ||
          "Delete confirmation dialog - this action cannot be undone"}
      </Description>
    </>
  );
  return (
    <Root open={false} modal={false}>
      <section
        aria-label={String(title)}
        data-presentation="inline"
        data-version={version}
        className={cn(
          "flex w-96 max-w-full flex-col overflow-hidden border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-[0_20px_24px_-4px_rgba(10,13,18,.08),0_8px_8px_-4px_rgba(10,13,18,.03),0_3px_3px_-1.5px_rgba(10,13,18,.04)]",
          version === "v2"
            ? "gap-0 rounded-xl p-0 font-[family-name:var(--font-v2,Inter,sans-serif)]"
            : "gap-4 rounded-lg p-6"
        )}
      >
        {version === "v2" ? (
          <Header className="flex-row items-center gap-4 border-b border-solid border-semantic-border-layout p-6 text-left">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-semantic-error-surface text-semantic-error-primary">
              <Trash2 className="size-[18px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {titleCopy}
            </div>
            <button
              aria-label="Close preview"
              type="button"
              className="flex size-6 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-semantic-text-muted"
              onClick={() => args.onOpenChange?.(false)}
            >
              <X className="size-3" />
            </button>
          </Header>
        ) : (
          <Header>{titleCopy}</Header>
        )}
        <div
          className={
            version === "v2"
              ? "flex flex-col gap-1 px-6 py-0"
              : "grid gap-2 py-4"
          }
        >
          <label
            htmlFor={id}
            className={
              version === "v2"
                ? "text-sm font-semibold text-semantic-text-secondary"
                : "text-sm text-semantic-text-muted"
            }
          >
            Enter "{args.confirmText}" in uppercase to confirm
          </label>
          <Field
            id={id}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={args.confirmText}
            autoComplete="off"
          />
        </div>
        <Footer
          className={
            version === "v2" ? "gap-2 px-4 pb-4 sm:space-x-0" : "gap-2 sm:gap-0"
          }
        >
          <Action
            variant="outline"
            disabled={args.loading}
            onClick={() => args.onCancel?.()}
          >
            {args.cancelButtonText}
          </Action>
          <Action
            variant="destructive"
            disabled={text !== args.confirmText || args.loading}
            loading={args.loading}
            onClick={() => args.onConfirm?.()}
          >
            {args.deleteButtonText}
          </Action>
        </Footer>
      </section>
    </Root>
  );
}
const meta: Meta<DeleteArgs> = {
  title: "V2/Components/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "itemName",
        "title",
        "description",
        "confirmText",
        "loading",
        "deleteButtonText",
        "cancelButtonText",
        "triggerLabel",
        "onOpenChange",
        "onConfirm",
        "onCancel",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11626",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "delete-confirmation-modal",
          exportName: "DeleteConfirmationModal",
          summary:
            "A destructive confirmation that requires an exact typed phrase before enabling its action.",
          changes: [
            [
              "Container",
              "384px, 8px corners, 24px outer padding",
              "384px, 12px corners, separate section padding",
            ],
            [
              "Header",
              "Title and description",
              "32px destructive icon box, 16px medium title, 12px description, close",
            ],
            [
              "Body",
              "14px label / legacy input",
              "14px semibold label / v2 input; recorded 0px / 24px padding",
            ],
            [
              "Footer",
              "Legacy outline / destructive buttons",
              "Medium v2 buttons, right aligned; 0px / 16px / 16px",
            ],
            [
              "Verification",
              "Exact matching, reset on close",
              "Preserved; each field keeps a unique generated ID",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Description", "--semantic-text-muted", "#717680", "#717680"],
            ["Icon surface", "--semantic-error-surface", "#FEF3F2", "#FEF3F2"],
            ["Icon", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Label", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Corners", "12px literal", "12px"],
          ],
          guidance:
            "Use a clear item name and a short uppercase confirmText. The verification field is internal component state, so no fake value Control is exposed in Overview: type in the real dialog. Changing confirmText revalidates the current field, and closing clears it. onConfirm remains a callback; the consumer completes the action and closes. Loading disables both action buttons while preserving the existing field and Close/Escape behavior. Galleries are contained presentations with independently editable fields; their previewValue control is explicitly a presentation argument, not a new component prop.",
        }),
      },
    },
  },
  args: {
    open: false,
    itemName: "webhook",
    title: "",
    description:
      "This removes the webhook from the workspace. This action cannot be undone.",
    confirmText: "DELETE",
    loading: false,
    deleteButtonText: "Delete webhook",
    cancelButtonText: "Cancel",
    triggerLabel: "Delete webhook",
    previewValue: "",
    onOpenChange: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    itemName: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    confirmText: { control: "text" },
    loading: { control: "boolean" },
    deleteButtonText: { control: "text" },
    cancelButtonText: { control: "text" },
    triggerLabel: {
      control: "text",
      table: { category: "Example composition" },
    },
    previewValue: {
      control: "text",
      description:
        "Initial/live value only for inline presentation inputs; the shipped modal keeps its own field state.",
      table: { category: "Inline presentation" },
    },
    onOpenChange: { control: false },
    onConfirm: { control: false },
    onCancel: { control: false },
    trigger: { control: false },
    className: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DeleteArgs>();
    return (
      <div className="p-8">
        <LiveDelete args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const CustomTitle: Story = { args: { title: "Remove this webhook?" } };
export const CustomConfirmText: Story = {
  args: { confirmText: "REMOVE", deleteButtonText: "Remove webhook" },
};
export const Loading: Story = { args: { loading: true } };
export const WithoutDescription: Story = { args: { description: "" } };
export const LongContent: Story = {
  args: {
    itemName: "shared customer support notification webhook",
    description:
      "The webhook currently delivers events to your external support workflow. Removing it stops all future deliveries. Previously delivered events remain in the external system.",
  },
};
const INLINE = ["open", "triggerLabel", "onOpenChange"];
export const AllVariants: Story = {
  name: "Compositions",
  parameters: {
    ...gallery(
      [...INLINE, "title", "description"],
      "Default title, a custom title and no description are fixed. Item name, expected phrase, button labels and loading Controls remain live. Inputs are independent; the actual verification interaction is exercised in Overview."
    ),
    layout: "padded",
    controls: {
      include: [
        "itemName",
        "confirmText",
        "loading",
        "deleteButtonText",
        "cancelButtonText",
        "previewValue",
        "onConfirm",
        "onCancel",
      ],
      exclude: [...INLINE, "title", "description"],
    },
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1224px] grid-cols-3 items-start gap-6">
        {[
          { label: "Default title", title: "", description: args.description },
          {
            label: "Custom title",
            title: "Remove this webhook?",
            description: args.description,
          },
          { label: "No description", title: args.title, description: "" },
        ].map(({ label, ...fixed }) => (
          <div key={label} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {label}
            </span>
            <InlineDelete args={{ ...args, ...fixed }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE, "loading", "previewValue"],
      "Empty, partial, matching and loading verification states are fixed. Phrase, title, description, item and button Controls remain live. Fields can be edited independently; matching is exact and case-sensitive."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1640px] grid-cols-4 items-start gap-6">
        {[
          { label: "Empty", value: "", loading: false },
          {
            label: "Partial",
            value: args.confirmText?.slice(0, -1) || "",
            loading: false,
          },
          { label: "Exact match", value: args.confirmText, loading: false },
          { label: "Loading", value: args.confirmText, loading: true },
        ].map(({ label, value, loading }) => (
          <div key={label} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {label}
            </span>
            <InlineDelete args={{ ...args, loading }} value={value} />
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
      INLINE,
      "Complete composed confirmation in both versions using each version's Dialog, Input and Button primitives. Item/copy/phrase/labels/loading remain live; previewValue sets both field samples, which can then be edited independently."
    ),
    layout: "padded",
    controls: {
      include: [
        "itemName",
        "title",
        "description",
        "confirmText",
        "loading",
        "deleteButtonText",
        "cancelButtonText",
        "previewValue",
        "onConfirm",
        "onCancel",
      ],
      exclude: INLINE,
    },
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[808px] grid-cols-2 items-start gap-6">
        {(["v1", "v2"] as const).map((version) => (
          <div key={version} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {version} ·{" "}
              {version === "v1"
                ? "ui/delete-confirmation-modal"
                : "ui/v2/delete-confirmation-modal"}
            </span>
            <InlineDelete args={args} version={version} />
          </div>
        ))}
      </div>
    </div>
  ),
};
function WebhookExample({
  args,
  updateArgs,
}: {
  args: DeleteArgs;
  updateArgs: (next: Partial<DeleteArgs>) => void;
}) {
  const [exists, setExists] = React.useState(true);
  const [result, setResult] = React.useState("Webhook is active.");
  return (
    <section className="flex w-[560px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Customer support webhook
        </p>
        <p className="m-0 text-xs text-semantic-text-muted">
          A local example of a typed destructive confirmation.
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-semantic-text-primary">
          {exists
            ? "Workspace event notifications"
            : "Webhook removed from the preview"}
        </span>
        {exists ? (
          <LiveDelete
            args={args}
            updateArgs={updateArgs}
            onResult={(result) => {
              setResult(result);
              if (result.startsWith("Deleted")) setExists(false);
            }}
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setExists(true);
              setResult("Webhook restored in this preview.");
            }}
          >
            Restore example
          </Button>
        )}
      </div>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {result}
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Type the exact confirmText to remove this synthetic webhook. Confirm closes and updates the card; cancel keeps it available. Restore creates the local example again. Changing expected phrase, copy or loading Controls affects the real modal. No webhook outside Storybook is touched.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DeleteArgs>();
    return <WebhookExample args={args} updateArgs={updateArgs} />;
  },
};
