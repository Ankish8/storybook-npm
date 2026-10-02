import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { X } from "lucide-react";
import { Panel, type PanelProps } from "./panel";
import { Panel as PanelV1 } from "../panel";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Input } from "./input";
import { Input as InputV1 } from "../input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

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
    <section className="relative flex h-[430px] min-w-0 overflow-hidden rounded-lg border border-semantic-border-layout bg-semantic-bg-ui">
      <div className="min-w-0 flex-1 p-4">
        <p className="m-0 text-sm font-medium text-semantic-text-primary">
          Workspace
        </p>
        <p className="m-0 mt-2 text-xs text-semantic-text-muted">
          The panel keeps its existing place in the layout.
        </p>
        <Action
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => change({ open: !state.open })}
        >
          {state.open ? "Hide panel" : "Open panel"}
        </Action>
      </div>
      <UI
        open={state.open}
        title={args.title}
        size={args.size}
        onClose={close}
        aria-label={args["aria-label"] || args.title}
        className={version === "v1" ? "font-sans" : args.className}
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
              <Action
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={close}
              >
                Cancel
              </Action>
              <Action
                size="sm"
                className="flex-1"
                disabled={args.disabled || !state.name.trim()}
                onClick={() => {
                  args.onSave(state.name);
                  setSaved(true);
                }}
              >
                Save
              </Action>
            </>
          ) : undefined
        }
      >
        <div className="space-y-4 p-4">
          <h4 className="m-0 text-xs font-semibold uppercase tracking-wide text-semantic-text-secondary">
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
              value={state.email}
              disabled={args.disabled}
              onChange={(e) => change({ email: e.target.value })}
            />
          </div>
          <p className="m-0 text-xs text-semantic-text-muted">
            Changes are local to this example.
          </p>
          {saved && (
            <p className="m-0 text-xs text-semantic-success-text">
              Saved locally: {state.name}
            </p>
          )}
          {args.longContent &&
            Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="border-t border-semantic-border-layout pt-3"
              >
                <p className="m-0 text-sm font-medium text-semantic-text-primary">
                  Custom field {i + 1}
                </p>
                <p className="m-0 mt-1 text-xs text-semantic-text-muted">
                  Additional contact information
                </p>
              </div>
            ))}
        </div>
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
        component: v2ComponentDocs({
          name: "panel",
          exportName: "Panel",
          summary:
            "A collapsible side panel with a header, scrollable body and optional footer.",
          changes: [
            ["Typography", "Inherited Source Sans", "Inter;16px medium title"],
            ["Border", "1px divider", "1.2px layout border"],
            [
              "Overlay shadow",
              "Legacy shadow",
              "Recorded three-layer XL shadow",
            ],
            ["Widths", "280/320/400px", "Same width API"],
            [
              "Behavior",
              "Open, Close and Escape",
              "Preserved; examples synchronize open with Controls",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Widths", "size", "280px /320px /400px"],
          ],
          guidance:
            "Place Panel inside a flex layout with a defined height. Its body scrolls independently and the header/footer remain visible. Close and Escape notify onClose; the parent owns open. This story connects that callback to open Controls. Custom-header and footer controls compose existing slots.",
        }),
      },
    },
  },
  args: {
    open: true,
    title: "Contact Details",
    size: "default",
    customHeader: false,
    showFooter: false,
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
          "Close the panel, press Escape within it, or use the workspace button. Each updates open Controls and preserves the300ms transition.",
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
export const Sizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "All three widths are fixed. Other controls seed each independent panel; close/reopen and local fields remain interactive."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1500px] grid-cols-3 gap-5">
        {(["sm", "default", "lg"] as const).map((size) => (
          <Card key={size} title={size}>
            <Demo args={{ ...args, size }} />
          </Card>
        ))}
      </div>
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
