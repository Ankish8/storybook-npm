import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import { FormModal, type FormModalProps } from "./form-modal";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button as ButtonV1 } from "../button";
import { Input as InputV1 } from "../input";
import { Checkbox as CheckboxV1 } from "../checkbox";
import {
  Select as SelectV1,
  SelectContent as SelectContentV1,
  SelectItem as SelectItemV1,
  SelectTrigger as SelectTriggerV1,
  SelectValue as SelectValueV1,
} from "../select";
import {
  Dialog as DialogV1,
  DialogHeader as HeaderV1,
  DialogTitle as TitleV1,
  DialogDescription as DescriptionV1,
  DialogFooter as FooterV1,
} from "../dialog";
import { v2ComponentDocs } from "./story-docs";

type FormArgs = FormModalProps & {
  triggerLabel: string;
  nameValue: string;
  emailValue: string;
  department: string;
  notifications: boolean;
  fieldLayout: "stacked" | "two-column";
};
const WIDTHS = { sm: 384, default: 512, lg: 672, xl: 896, full: 1000 };
const COMPOSITION = [
  "triggerLabel",
  "nameValue",
  "emailValue",
  "department",
  "notifications",
  "fieldLayout",
];
function ProfileFields({
  args,
  updateArgs,
  version = "v2",
}: {
  args: FormArgs;
  updateArgs: (next: Partial<FormArgs>) => void;
  version?: "v1" | "v2";
}) {
  const id = React.useId();
  const Field = version === "v2" ? Input : InputV1;
  const Toggle = version === "v2" ? Checkbox : CheckboxV1;
  const Choice = version === "v2" ? Select : SelectV1;
  const Trigger = version === "v2" ? SelectTrigger : SelectTriggerV1;
  const Value = version === "v2" ? SelectValue : SelectValueV1;
  const Content = version === "v2" ? SelectContent : SelectContentV1;
  const Item = version === "v2" ? SelectItem : SelectItemV1;
  return (
    <div
      className={cn(
        "grid gap-4",
        args.fieldLayout === "two-column" && "sm:grid-cols-2"
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <label
          htmlFor={`${id}-name`}
          className="text-sm font-semibold text-semantic-text-secondary"
        >
          Name
        </label>
        <Field
          id={`${id}-name`}
          autoComplete="off"
          value={args.nameValue}
          onChange={(e) => updateArgs({ nameValue: e.target.value })}
          placeholder="Enter a name"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <label
          htmlFor={`${id}-email`}
          className="text-sm font-semibold text-semantic-text-secondary"
        >
          Email
        </label>
        <Field
          id={`${id}-email`}
          type="email"
          autoComplete="off"
          value={args.emailValue}
          onChange={(e) => updateArgs({ emailValue: e.target.value })}
          placeholder="name@example.com"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <label
          htmlFor={`${id}-department`}
          className="text-sm font-semibold text-semantic-text-secondary"
        >
          Department
        </label>
        <Choice
          value={args.department}
          onValueChange={(department) => updateArgs({ department })}
        >
          <Trigger id={`${id}-department`}>
            <Value placeholder="Choose a department" />
          </Trigger>
          <Content>
            <Item value="support">Customer support</Item>
            <Item value="sales">Sales</Item>
            <Item value="operations">Operations</Item>
          </Content>
        </Choice>
      </div>
      <div
        className={cn(
          "flex items-center",
          args.fieldLayout === "two-column" && "sm:self-end sm:pb-2"
        )}
      >
        <Toggle
          id={`${id}-notifications`}
          label="Email notifications"
          checked={args.notifications}
          onCheckedChange={(checked) =>
            updateArgs({ notifications: checked === true })
          }
        />
      </div>
    </div>
  );
}
function LiveForm({
  args,
  updateArgs,
  onSave,
  onCancel,
  validate = false,
}: {
  args: FormArgs;
  updateArgs: (next: Partial<FormArgs>) => void;
  onSave?: () => void;
  onCancel?: () => void;
  validate?: boolean;
}) {
  const trigger = React.useRef<HTMLButtonElement>(null);
  const wasOpen = React.useRef(args.open);
  React.useEffect(() => {
    const restoreFocus = wasOpen.current && !args.open;
    wasOpen.current = args.open;
    if (!restoreFocus) return;
    const frame = requestAnimationFrame(() => trigger.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [args.open]);
  const invalid =
    validate &&
    (!args.nameValue.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.emailValue));
  const changeOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <>
      <Button ref={trigger} variant="outline" onClick={() => changeOpen(true)}>
        {args.triggerLabel}
      </Button>
      <FormModal
        {...args}
        disableSave={args.disableSave || invalid}
        onOpenChange={changeOpen}
        onSave={() => {
          args.onSave?.();
          onSave?.();
          changeOpen(false);
        }}
        onCancel={() => {
          args.onCancel?.();
          onCancel?.();
        }}
      >
        <ProfileFields args={args} updateArgs={updateArgs} />
        {invalid && (
          <p className="m-0 text-xs text-semantic-error-text" role="status">
            Enter a name and a valid email before saving.
          </p>
        )}
      </FormModal>
    </>
  );
}
const meta: Meta<FormArgs> = {
  title: "V2/Components/FormModal",
  component: FormModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "size",
        "title",
        "description",
        "loading",
        "disableSave",
        "saveButtonText",
        "cancelButtonText",
        ...COMPOSITION,
        "onOpenChange",
        "onSave",
        "onCancel",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "form-modal",
          exportName: "FormModal",
          summary:
            "A composed Dialog for editing fields with consistent header, body and action spacing.",
          changes: [
            [
              "Container",
              "8px corners and 24px outer padding",
              "12px corners and section padding; 384 / 512 / 672 / 896px widths",
            ],
            [
              "Header",
              "18px semibold title",
              "16px medium title, 12px description, 24px padding and reserved close space",
            ],
            [
              "Body",
              "16px vertical gap within outer padding",
              "24px padding and 16px field gap",
            ],
            [
              "Footer",
              "Legacy buttons and responsive spacing",
              "Medium v2 buttons, 8px gap, 0 / 24 / 24px padding",
            ],
            [
              "Callbacks",
              "Consumer saves; Cancel requests close",
              "Preserved; loading and disableSave keep their existing behavior",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Description", "--semantic-text-muted", "#717680", "#717680"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Field label", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Corners", "12px literal", "12px"],
          ],
          guidance:
            "Use controlled open state and pass form fields as children. onSave remains a callback: the consumer validates, saves and closes. Cancel invokes onCancel and requests close. Loading disables both actions; disableSave affects only Save. The name, email, department, notifications and fieldLayout Controls below describe the example's composed fields, not new FormModal props. Typing, selecting and toggling update Controls. Inline galleries use each version's real primitives and stay closed so Docs never opens a portal. Usage saves a local profile and restores saved fields on Cancel.",
        }),
      },
    },
  },
  args: {
    children: null,
    open: false,
    size: "sm",
    title: "Edit profile",
    description: "Update your workspace profile and notification preferences.",
    loading: false,
    disableSave: false,
    saveButtonText: "Save changes",
    cancelButtonText: "Cancel",
    triggerLabel: "Edit profile",
    nameValue: "Alex Morgan",
    emailValue: "alex@example.com",
    department: "support",
    notifications: true,
    fieldLayout: "stacked",
    onOpenChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    size: { control: "select", options: ["sm", "default", "lg", "xl", "full"] },
    title: { control: "text" },
    description: { control: "text" },
    loading: { control: "boolean" },
    disableSave: { control: "boolean" },
    saveButtonText: { control: "text" },
    cancelButtonText: { control: "text" },
    triggerLabel: {
      control: "text",
      table: { category: "Example composition" },
    },
    nameValue: { control: "text", table: { category: "Example composition" } },
    emailValue: { control: "text", table: { category: "Example composition" } },
    department: {
      control: "select",
      options: ["support", "sales", "operations"],
      table: { category: "Example composition" },
    },
    notifications: {
      control: "boolean",
      table: { category: "Example composition" },
    },
    fieldLayout: {
      control: "radio",
      options: ["stacked", "two-column"],
      table: { category: "Example composition" },
    },
    onOpenChange: { control: false },
    onSave: { control: false },
    onCancel: { control: false },
    children: { control: false },
    className: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<FormArgs>();
    return (
      <div className="p-8">
        <LiveForm args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Default: Story = { args: { size: "default" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const Full: Story = { args: { size: "full" } };
export const WithoutDescription: Story = { args: { description: "" } };
export const CustomButtons: Story = {
  args: {
    title: "Create a profile",
    saveButtonText: "Create profile",
    cancelButtonText: "Keep draft",
    triggerLabel: "Create profile",
  },
};
export const Loading: Story = { args: { loading: true } };
export const SaveDisabled: Story = { args: { disableSave: true } };
export const MultipleFieldTypes: Story = {
  args: { size: "default", fieldLayout: "two-column" },
};
export const LongContent: Story = {
  args: {
    title:
      "Update the shared customer support profile and workspace preferences",
    description:
      "These preferences affect how workspace notifications are delivered. You can review the details before saving and change them again whenever your team's responsibilities change.",
  },
};
function InlineForm({
  args,
  version = "v2",
}: {
  args: FormArgs;
  version?: "v1" | "v2";
}) {
  const [fields, setFields] = React.useState(args);
  React.useEffect(() => setFields(args), [args]);
  const Root = version === "v2" ? Dialog : DialogV1;
  const Header = version === "v2" ? DialogHeader : HeaderV1;
  const Title = version === "v2" ? DialogTitle : TitleV1;
  const Description = version === "v2" ? DialogDescription : DescriptionV1;
  const Footer = version === "v2" ? DialogFooter : FooterV1;
  const Action = version === "v2" ? Button : ButtonV1;
  return (
    <Root open={false} modal={false}>
      <section
        data-presentation="inline"
        data-version={version}
        aria-label={String(args.title)}
        style={{ width: WIDTHS[args.size || "sm"] }}
        className={cn(
          "relative flex max-w-full flex-col border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-[0_20px_24px_-4px_rgba(10,13,18,.08),0_8px_8px_-4px_rgba(10,13,18,.03),0_3px_3px_-1.5px_rgba(10,13,18,.04)]",
          version === "v2"
            ? "gap-0 rounded-xl border-[1.2px] p-0 font-[family-name:var(--font-v2,Inter,sans-serif)]"
            : "gap-4 rounded-lg p-6"
        )}
      >
        <Header className={version === "v2" ? "pr-16" : undefined}>
          <Title>{args.title}</Title>
          {args.description && <Description>{args.description}</Description>}
        </Header>
        <button
          type="button"
          aria-label="Close preview"
          onClick={() => args.onOpenChange(false)}
          className={cn(
            "absolute flex size-6 items-center justify-center rounded border-0 bg-transparent text-semantic-text-muted",
            version === "v2" ? "right-6 top-6" : "right-4 top-4"
          )}
        >
          <X className={version === "v2" ? "size-3" : "size-4"} />
        </button>
        <div
          className={version === "v2" ? "grid gap-4 p-6" : "grid gap-4 py-4"}
        >
          <ProfileFields
            args={fields}
            updateArgs={(next) => setFields((prev) => ({ ...prev, ...next }))}
            version={version}
          />
        </div>
        <Footer className={version === "v1" ? "gap-2 sm:gap-0" : undefined}>
          <Action
            variant="outline"
            disabled={args.loading}
            onClick={() => args.onCancel?.()}
          >
            {args.cancelButtonText}
          </Action>
          <Action
            disabled={args.disableSave || args.loading}
            loading={args.loading}
            onClick={() => args.onSave?.()}
          >
            {args.saveButtonText}
          </Action>
        </Footer>
      </section>
    </Root>
  );
}
const INLINE = ["open", "triggerLabel", "onOpenChange"];
export const AllSizes: Story = {
  name: "All sizes",
  parameters: {
    ...gallery(
      [...INLINE, "size"],
      "All five size axes are fixed. Title, description, fields, layout, loading and action Controls remain live. Full is a contained 1000px width reference; open its individual story for actual viewport filling."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex min-w-[3632px] items-start gap-6">
        {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
          <div key={size} className="flex shrink-0 flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {size} ·{" "}
              {size === "full" ? "viewport reference" : `${WIDTHS[size]}px`}
            </span>
            <InlineForm args={{ ...args, size }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE, "loading", "disableSave"],
      "Ready, Save disabled and Loading states are fixed; copy, size and fields remain editable. Field edits are independent. Loading preserves field editing and the existing Close/Escape behavior."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex items-start gap-6">
        {[
          { label: "Ready", loading: false, disableSave: false },
          { label: "Save disabled", loading: false, disableSave: true },
          { label: "Loading", loading: true, disableSave: false },
        ].map(({ label, ...state }) => (
          <div key={label} className="flex shrink-0 flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {label}
            </span>
            <InlineForm args={{ ...args, ...state }} />
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
      "Complete forms rendered with each version's Dialog, Input, Select, Checkbox and Button primitives. Size, copy, fields, layout and action Controls affect both; fields can also be edited independently."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex items-start gap-6">
        {(["v1", "v2"] as const).map((version) => (
          <div key={version} className="flex shrink-0 flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {version} ·{" "}
              {version === "v1" ? "ui/form-modal" : "ui/v2/form-modal"}
            </span>
            <InlineForm args={args} version={version} />
          </div>
        ))}
      </div>
    </div>
  ),
};
function ProfileExample({
  args,
  updateArgs,
}: {
  args: FormArgs;
  updateArgs: (next: Partial<FormArgs>) => void;
}) {
  const [saved, setSaved] = React.useState({
    nameValue: args.nameValue,
    emailValue: args.emailValue,
    department: args.department,
    notifications: args.notifications,
  });
  const [status, setStatus] = React.useState(
    "No unsaved changes have been saved."
  );
  return (
    <section className="flex w-[560px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Workspace profile
        </p>
        <p className="m-0 text-xs text-semantic-text-muted">
          Edit, validate and save this local profile.
        </p>
      </div>
      <dl className="m-0 grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-semantic-text-muted">Name</dt>
        <dd className="m-0 break-words">{saved.nameValue}</dd>
        <dt className="text-semantic-text-muted">Email</dt>
        <dd className="m-0 break-words">{saved.emailValue}</dd>
        <dt className="text-semantic-text-muted">Department</dt>
        <dd className="m-0 capitalize">{saved.department}</dd>
        <dt className="text-semantic-text-muted">Notifications</dt>
        <dd className="m-0">{saved.notifications ? "Enabled" : "Paused"}</dd>
      </dl>
      <div>
        <LiveForm
          args={args}
          updateArgs={updateArgs}
          validate
          onSave={() => {
            setSaved({
              nameValue: args.nameValue,
              emailValue: args.emailValue,
              department: args.department,
              notifications: args.notifications,
            });
            setStatus("Profile saved in this preview.");
          }}
          onCancel={() => {
            updateArgs(saved);
            setStatus("Cancelled. Saved profile restored.");
          }}
        />
      </div>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {status}
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Edit the real fields. Save requires a name and valid email, updates the card and closes. Cancel restores the saved profile in both the fields and Controls. Size, copy, disabled and loading Controls remain live; no external profile is changed.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<FormArgs>();
    return <ProfileExample args={args} updateArgs={updateArgs} />;
  },
};
