import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Check, Mail, MessageSquare, Phone, UserRound, X } from "lucide-react";
import { Panel, type PanelProps } from "./panel";
import { Panel as PanelV1 } from "../panel";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Input } from "./input";
import { Input as InputV1 } from "../input";
import { gallery } from "../../../storybook/v2-preview";

type Args = Omit<PanelProps, "header" | "footer" | "children"> & {
  customHeader: boolean;
  showFooter: boolean;
  name: string;
  email: string;
  disabled: boolean;
  longContent: boolean;
  onSave: (name: string) => void;
};
function Demo({
  args,
  version = "v2",
  update,
  forceState,
}: {
  args: Args;
  version?: "v1" | "v2";
  update?: (next: Partial<Args>) => void;
  forceState?: "focus";
}) {
  const UI = version === "v1" ? PanelV1 : Panel;
  const Action = version === "v1" ? ButtonV1 : Button;
  const Field = version === "v1" ? InputV1 : Input;
  const id = React.useId();
  const [local, setLocal] = React.useState({
    open: args.open,
    name: args.name,
    email: args.email,
  });
  const [seed, setSeed] = React.useState({
    open: args.open,
    name: args.name,
    email: args.email,
  });
  const [saved, setSaved] = React.useState(false);
  if (
    seed.open !== args.open ||
    seed.name !== args.name ||
    seed.email !== args.email
  ) {
    setSeed({ open: args.open, name: args.name, email: args.email });
    setLocal({ open: args.open, name: args.name, email: args.email });
    setSaved(false);
  }
  const state = update
    ? { open: args.open, name: args.name, email: args.email }
    : local;
  const change = (next: Partial<Args>) => {
    if (update) update(next);
    else setLocal((p) => ({ ...p, ...next }));
    setSaved(false);
  };
  const close = () => {
    args.onClose?.();
    change({ open: false });
  };
  return (
    <section className="relative flex h-[520px] min-w-0 overflow-hidden rounded-xl border border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-secondary">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">
          <p className="m-0 text-sm font-medium text-semantic-text-primary">
            Contacts
          </p>
          <p className="m-0 mt-1 text-xs text-semantic-text-muted">
            Keep conversations and contact details together.
          </p>
          <Action
            type="button"
            size="sm"
            variant="outline"
            className="mt-4"
            aria-expanded={Boolean(state.open)}
            aria-controls={id + "-panel"}
            onClick={() => change({ open: !state.open })}
          >
            {state.open ? "Hide details" : "Open contact"}
          </Action>
          <div className="mt-5 space-y-3">
            {[
              {
                name: state.name || "Aditi Kumar",
                detail: "Interested in a product demo",
                selected: true,
              },
              {
                name: "Rohan Mehta",
                detail: "Follow up tomorrow",
                selected: false,
              },
              { name: "Priya Shah", detail: "Proposal sent", selected: false },
            ].map((contact, index) => (
              <div
                key={index}
                className="flex min-w-0 items-start gap-3 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-semantic-bg-ui text-semantic-text-muted">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 break-words text-sm font-medium text-semantic-text-primary">
                    {contact.name}
                  </p>
                  <p className="m-0 mt-1 break-words text-xs text-semantic-text-muted">
                    {contact.detail}
                  </p>
                  {contact.selected && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-semantic-success-text">
                      <Check className="size-3" aria-hidden="true" />
                      Selected contact
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UI
        id={id + "-panel"}
        open={state.open}
        title={args.title}
        size={args.size}
        onClose={close}
        aria-label={args["aria-label"] || args.title}
        className={
          version === "v1" ? "font-sans text-foreground" : args.className
        }
        header={
          args.customHeader ? (
            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-semantic-border-layout px-4">
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-base font-medium text-semantic-text-primary">
                  {args.title}
                </p>
                <p className="m-0 mt-1 text-xs text-semantic-text-muted">
                  Editable contact
                </p>
              </div>
              <Action
                size="icon"
                variant="ghost"
                type="button"
                aria-label="Close"
                onClick={close}
                className={
                  forceState === "focus" ? "pseudo-focus-visible" : undefined
                }
              >
                <X className="size-5" />
              </Action>
            </div>
          ) : undefined
        }
        footer={
          args.showFooter ? (
            <>
              <p
                role="status"
                className={
                  saved
                    ? "m-0 w-full text-xs text-semantic-success-text"
                    : "m-0 sr-only"
                }
              >
                {saved ? "Contact updated" : ""}
              </p>
              <Action
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={close}
              >
                Cancel
              </Action>
              <Action
                type="submit"
                form={id + "-form"}
                size="sm"
                className="flex-1"
                disabled={args.disabled || !state.name.trim()}
              >
                Save changes
              </Action>
            </>
          ) : undefined
        }
      >
        <form
          id={id + "-form"}
          className={
            version === "v1" ? "space-y-5 p-4" : "space-y-5 p-4 sm:p-6"
          }
          onSubmit={(event) => {
            event.preventDefault();
            if (args.disabled || !state.name.trim()) return;
            args.onSave(state.name);
            setSaved(true);
          }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-secondary">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="m-0 break-words text-sm font-medium text-semantic-text-primary">
                {state.name || "New contact"}
              </p>
              <p className="m-0 mt-1 text-xs text-semantic-text-muted">
                Sales prospect · Assigned to you
              </p>
            </div>
          </div>
          <h4
            className={
              version === "v1"
                ? "m-0 text-xs font-semibold uppercase tracking-wide text-semantic-text-secondary"
                : "m-0 text-xs font-medium uppercase tracking-wide text-semantic-text-primary"
            }
          >
            Basic information
          </h4>
          <div>
            <label
              htmlFor={id + "-name"}
              className="mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <Field
              id={id + "-name"}
              name="name"
              autoComplete="name"
              required
              value={state.name}
              disabled={args.disabled}
              onChange={(e) => change({ name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor={id + "-email"}
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <Field
              id={id + "-email"}
              name="email"
              type="email"
              autoComplete="email"
              value={state.email}
              disabled={args.disabled}
              onChange={(e) => change({ email: e.target.value })}
            />
          </div>
          <div className="space-y-3 border-t border-semantic-border-layout pt-4 text-sm">
            <p className="m-0 flex items-center gap-2 text-semantic-text-muted">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              +91 98765 43210
            </p>
            <p className="m-0 flex items-start gap-2 break-all text-semantic-text-muted">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {state.email || "No email added"}
            </p>
          </div>
          <div className="rounded-lg border border-semantic-border-layout bg-semantic-bg-subtle p-3">
            <p className="m-0 flex items-center gap-2 text-xs font-medium text-semantic-text-primary">
              <MessageSquare className="size-4" aria-hidden="true" />
              Latest conversation
            </p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-semantic-text-secondary">
              Asked about call routing for a team of 12. Send the product demo
              and follow up on Friday.
            </p>
            <p className="m-0 mt-2 text-xs text-semantic-text-muted">
              Today, 10:42 AM
            </p>
          </div>
          {args.longContent &&
            [
              {
                title: "Demo scheduled",
                detail: "Friday, 11:30 AM · Online meeting",
              },
              {
                title: "Follow-up reminder",
                detail: "Friday, 10:00 AM · Assigned to you",
              },
              {
                title: "Call completed",
                detail: "Today, 10:42 AM · 8 minutes",
              },
              {
                title: "Product guide sent",
                detail: "Yesterday, 4:15 PM · Email",
              },
              {
                title: "Owner updated",
                detail: "Monday, 9:30 AM · Sales team",
              },
              {
                title: "Contact created",
                detail: "Monday, 9:20 AM · Website enquiry",
              },
            ].map((activity) => (
              <div
                key={activity.title}
                className="border-t border-semantic-border-layout pt-3"
              >
                <p className="m-0 text-sm font-medium text-semantic-text-primary">
                  {activity.title}
                </p>
                <p className="m-0 mt-1 text-xs text-semantic-text-muted">
                  {activity.detail}
                </p>
              </div>
            ))}
        </form>
      </UI>
    </section>
  );
}
const controls = [
  "open",
  "title",
  "size",
  "onClose",
  "customHeader",
  "showFooter",
  "name",
  "email",
  "disabled",
  "longContent",
  "onSave",
];
const panelDocs = [
  "A collapsible contextual side panel with a header, independently scrollable body and optional footer.",
  "",
  "```bash",
  "npx myoperator-ui add v2-panel",
  "```",
  "",
  "```tsx",
  'import { Panel } from "@/components/ui/v2/panel";',
  "```",
  "",
  "## Migration from v1",
  "",
  "Change the import path to v2/panel. Panel and panelVariants exports, native aside attributes, the aside ref, size names, title, header, footer and onClose remain available. Panel still defaults to open; the parent owns open. Tab follows the page order. The initial focus moves into the panel, and closing returns focus to its opener while the panel still owns focus.",
  "",
  "| Aspect | v1 | v2 |",
  "| --- | --- | --- |",
  "| Widths | 280 / 320 / 400px | Same preferred widths, capped to the containing layout |",
  "| Header | 56px bar and ghost close | Responsive padding, wrapping title, bordered close; 44px touch target |",
  "| Motion | All properties, 300ms | Width and opacity, 240ms opening / 180ms closing; no transition with reduced motion |",
  "| Escape | Requests onClose | Requests onClose after native handlers; preventDefault cancels; nested panels and portals retain keyboard ownership |",
  "| Closed content | Collapsed width | Collapsed width, aria-hidden and inert controls; child state remains mounted |",
  "",
  "## Design Tokens",
  "",
  "| Purpose | CSS variable | Preview |",
  "| --- | --- | --- |",
  "| Surface | --semantic-bg-primary | <span style='display:inline-block;width:24px;height:16px;background:var(--semantic-bg-primary);border:1px solid var(--semantic-border-layout)'></span> |",
  "| Title | --semantic-text-primary | <span style='display:inline-block;width:24px;height:16px;background:var(--semantic-text-primary)'></span> |",
  "| Body and close icon | --semantic-text-secondary | <span style='display:inline-block;width:24px;height:16px;background:var(--semantic-text-secondary)'></span> |",
  "| Close surface | --semantic-bg-subtle | <span style='display:inline-block;width:24px;height:16px;background:var(--semantic-bg-subtle);border:1px solid var(--semantic-border-layout)'></span> |",
  "| Layout edge | --semantic-border-layout | <span style='display:inline-block;width:24px;height:16px;background:var(--semantic-border-layout)'></span> |",
  "",
  "## Usage",
  "",
  "Place Panel in a flex layout with a defined height. Header and footer stay visible while the body scrolls. Close and unhandled Escape request onClose; update open in that callback. A custom header replaces the default title and close button. The built-in close button uses type=button inside surrounding forms. Footer actions can submit a body form using its native form id, as shown in Overview.",
  "",
  "v2 installs unprefixed Tailwind classes. Build Tailwind without a prefix and define the semantic tokens. Native hidden, aria-hidden, inert, events, data attributes and styles continue to work.",
].join("\n");
const meta: Meta<Args> = {
  title: "V2/Components/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11892",
    },
    layout: "padded",
    controls: { include: controls },
    docs: {
      description: {
        component: panelDocs,
      },
    },
  },
  args: {
    open: true,
    title: "Contact Details",
    size: "default",
    customHeader: false,
    showFooter: true,
    name: "Aditi Kumar",
    email: "aditi@example.com",
    disabled: false,
    longContent: false,
    onClose: fn(),
    onSave: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    size: { control: "select", options: ["sm", "default", "lg"] },
    onClose: { control: false },
    customHeader: { control: "boolean", table: { category: "Example" } },
    showFooter: { control: "boolean", table: { category: "Example" } },
    name: { control: "text", table: { category: "Example" } },
    email: { control: "text", table: { category: "Example" } },
    disabled: { control: "boolean", table: { category: "Example" } },
    longContent: { control: "boolean", table: { category: "Example" } },
    onSave: { control: false, table: { category: "Example" } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <Demo args={args} update={update} />;
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const WithFooter: Story = {
  args: { showFooter: true, title: "Edit contact" },
};
export const WithCustomHeader: Story = { args: { customHeader: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Collapsed: Story = { args: { open: false } };
export const Scrollable: Story = {
  args: { longContent: true, showFooter: true },
};
export const Interactive: Story = {
  ...Overview,
  name: "Interactive open and close",
  parameters: {
    docs: {
      description: {
        story:
          "Close the panel, press Escape within it, or use Open contact. Each updates open Controls; close and reopen also demonstrate focus return. Tab can move between the workspace and panel.",
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
      <h3 className="m-0 mb-4 text-base font-medium text-semantic-text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const Sizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "All three preferred widths are shown; each is capped to its containing layout. Other controls seed each independent panel."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-[repeat(auto-fit,minmax(min(100%,660px),1fr))] gap-5">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Card key={size} title={size}>
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <Demo args={{ ...args, size }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  name: "All compositions",
  parameters: gallery(
    ["customHeader", "showFooter"],
    "Default, custom-header and footer compositions are fixed. Width, title, content, disabled and open controls seed every panel."
  ),
  render: (args) => (
    <div className="grid gap-5">
      {[
        { name: "Default header", customHeader: false, showFooter: false },
        { name: "Custom header", customHeader: true, showFooter: false },
        { name: "With footer", customHeader: false, showFooter: true },
      ].map((c) => (
        <Card key={c.name} title={c.name}>
          <Demo
            args={{
              ...args,
              customHeader: c.customHeader,
              showFooter: c.showFooter,
            }}
          />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["open", "disabled", "customHeader"],
    "Open, closed, disabled fields and focused close-button states are fixed. Width, title, field values, footer and long content controls remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1150px] grid-cols-2 gap-5">
        {[
          { name: "Open", open: true, disabled: false, customHeader: false },
          { name: "Closed", open: false, disabled: false, customHeader: false },
          {
            name: "Disabled fields",
            open: true,
            disabled: true,
            customHeader: false,
          },
          {
            name: "Focused close",
            open: true,
            disabled: false,
            customHeader: true,
          },
        ].map((c) => (
          <Card key={c.name} title={c.name}>
            <Demo
              args={{
                ...args,
                open: c.open,
                disabled: c.disabled,
                customHeader: c.customHeader,
              }}
              forceState={c.name === "Focused close" ? "focus" : undefined}
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
    ["size"],
    "All three width sizes are paired across versions. Slots, content and open controls seed each sample; v1 uses original Input and Button."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1150px] grid-cols-2 gap-5">
        {(["sm", "default", "lg"] as const).flatMap((size) =>
          (["v1", "v2"] as const).map((version) => (
            <Card key={size + version} title={version + " · " + size}>
              <Demo args={{ ...args, size }} version={version} />
            </Card>
          ))
        )}
      </div>
    </div>
  ),
};
export const Usage: Story = {
  args: { showFooter: true, longContent: true, title: "Edit contact" },
  parameters: {
    docs: {
      description: {
        story:
          "Edit name/email, save locally, scroll the body, close and reopen. Typing synchronizes Controls; Save produces visible local feedback without leaving the panel.",
      },
    },
  },
};
