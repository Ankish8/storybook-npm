import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { Send, Save, Trash2, Check } from "lucide-react";
import { SplitButton, type SplitButtonProps } from "./split-button";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "@/storybook/v2-preview";

type Args = SplitButtonProps & {
  showIcons: boolean;
  disableDraft: boolean;
  mainResult: string;
  draftLabel: string;
};
function Example({
  showIcons,
  disableDraft,
  mainResult,
  draftLabel,
  ...args
}: Args) {
  const [result, setResult] = React.useState("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  React.useEffect(() => () => clearTimeout(timer.current), []);
  function feedback(text: string) {
    setResult(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setResult(""), 1800);
  }
  return (
    <SplitButton
      {...args}
      label={result || args.label}
      icon={showIcons ? result ? <Check /> : <Send /> : undefined}
      onClick={(event) => {
        args.onClick?.(event);
        if (!event.defaultPrevented) feedback(mainResult);
      }}
      actions={[
        {
          id: "notify",
          label: "Publish and notify",
          icon: showIcons ? <Send /> : undefined,
          onSelect: () => feedback("Published and notified"),
        },
        {
          id: "draft",
          label: draftLabel,
          disabled: disableDraft,
          icon: showIcons ? <Save /> : undefined,
          onSelect: () => feedback("Draft saved"),
        },
        {
          id: "delete",
          label: "Delete draft",
          destructive: true,
          icon: showIcons ? <Trash2 /> : undefined,
          onSelect: () => feedback("Draft deleted"),
        },
      ]}
    />
  );
}
function ControlledExample(args: Args) {
  const [, updateArgs] = useArgs<Args>();
  return (
    <Example
      {...args}
      onOpenChange={(open) => {
        args.onOpenChange?.(open);
        updateArgs({ open });
      }}
    />
  );
}
const meta = {
  title: "V2/Components/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "variant",
        "size",
        "label",
        "disabled",
        "loading",
        "loadingText",
        "open",
        "menuLabel",
        "showIcons",
        "disableDraft",
        "mainResult",
        "draftLabel",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "split-button",
          exportName: "SplitButton",
          hasV1: false,
          summary:
            "A main action joined to a menu of related alternatives. Both halves use the existing v2 Button; menu behavior comes from v2 Dropdown Menu.",
          changes: [
            [
              "Compatibility",
              "No v1 equivalent",
              "Additive v2 component; existing Button and ButtonGroup remain unchanged",
            ],
            [
              "Styles",
              "—",
              "Primary and secondary; default and outline remain accepted aliases",
            ],
            ["Sizes", "—", "36px / 44px / 50px; 8px outer corners"],
            [
              "Menu",
              "—",
              "Keyboard navigation, Escape/focus return, disabled/destructive items and viewport collision handling",
            ],
          ],
          tokens: [
            ["Primary", "--semantic-primary", "343E55", "#343E55"],
            ["Menu surface", "--semantic-bg-primary", "FFFFFF", "#FFFFFF"],
            ["Neutral label", "--v2-text-secondary", "5E5E5E", "#5E5E5E"],
            ["Radius", "--radius", "8px"],
          ],
          guidance: `Use when one action is the default and two to five related alternatives belong beside it. Choosing a menu item runs that item's callback; it does not silently replace the main action. For selection use ButtonGroup, and for one async task with completion feedback use ActionButton.

The default type is button. Native attributes, className and ref apply to the main button; containerClassName styles the pair. Loading blocks both actions while retaining focus on the main action. An empty actions array renders only the main button. open/onOpenChange supports controlled menus; otherwise defaultOpen initializes the menu. Disabling or loading closes it. Set menuLabel when a translated accessible name is needed.

Label/icon changes use Button's existing subtle feedback and width animation. The chevron anchor does not scale, the menu opens from that anchor, and item content fades in with a short stagger. Reduced motion removes movement. This follows the [Arc Split Button](https://uiarc.dev/components/split-button) interaction pattern while retaining our color and radius.

All examples simulate actions locally; they do not publish, notify or delete real data. Customize changes the actual example, and menu visibility stays synchronized. CLI installation includes v2-button, v2-dropdown-menu and their dependencies.

\`\`\`tsx
<SplitButton label="Export" onClick={exportCSV} actions={[
  { id: "pdf", label: "Export PDF", onSelect: exportPDF },
  { id: "xlsx", label: "Export spreadsheet", onSelect: exportSpreadsheet },
]} />
\`\`\``,
        }).replace(
          "a new component from the v2 Figma library.",
          "a new, opt-in component inspired by Arc."
        ),
      },
    },
  },
  args: {
    label: "Publish",
    variant: "primary",
    size: "default",
    disabled: false,
    loading: false,
    loadingText: "Publishing",
    open: false,
    showIcons: true,
    disableDraft: false,
    mainResult: "Published",
    draftLabel: "Save as draft",
    actions: [],
    onClick: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    label: { control: "text" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    loadingText: { control: "text" },
    open: { control: "boolean" },
    menuLabel: {
      control: "text",
      description:
        "Accessible name for the menu trigger; defaults to the label plus more actions.",
    },
    showIcons: { control: "boolean", table: { category: "Example" } },
    disableDraft: { control: "boolean", table: { category: "Example" } },
    mainResult: {
      control: "text",
      table: { category: "Example" },
      description: "Temporary feedback after the main action.",
    },
    draftLabel: { control: "text", table: { category: "Example" } },
    actions: { control: false },
    icon: { control: false },
    onClick: { control: false },
    onOpenChange: { control: false },
  },
  render: ControlledExample,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const WithoutIcons: Story = { args: { showIcons: false } };
export const DisabledMenuItem: Story = { args: { disableDraft: true } };
export const LongLabels: Story = {
  args: {
    label: "Publish approved reply",
    draftLabel: "Save this reply as a draft for your team",
  },
};
export const AllVariants: Story = {
  parameters: {
    ...gallery(
      ["variant", "open", "menuLabel"],
      "Both styles respond independently. Labels, sizes and disabled/loading Controls apply to both."
    ),
    layout: "centered",
  },
  render: ({ open: _open, ...args }) => (
    <div className="flex max-w-full flex-wrap justify-center gap-8">
      {(["primary", "secondary"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <span className="text-sm capitalize text-[var(--v2-text-muted,#707070)]">
            {variant}
          </span>
          <Example {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: {
    ...gallery(
      ["size", "open", "menuLabel"],
      "Three text sizes. Every menu remains independently interactive."
    ),
    layout: "centered",
  },
  render: ({ open: _open, ...args }) => (
    <div className="flex max-w-full flex-wrap items-end justify-center gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <span className="text-sm text-[var(--v2-text-muted,#707070)]">
            {size} · {size === "sm" ? 36 : size === "lg" ? 50 : 44}px
          </span>
          <Example {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["disabled", "loading", "open", "menuLabel"],
      "Idle, disabled and loading states. All other Controls remain live."
    ),
    layout: "centered",
  },
  render: ({ open: _open, ...args }) => (
    <div className="flex max-w-full flex-wrap justify-center gap-8">
      {(["Idle", "Disabled", "Loading"] as const).map((state) => (
        <div key={state} className="flex flex-col items-center gap-3">
          <span className="text-sm text-[var(--v2-text-muted,#707070)]">
            {state}
          </span>
          <Example
            {...args}
            disabled={state === "Disabled"}
            loading={state === "Loading"}
          />
        </div>
      ))}
    </div>
  ),
};
export const Usage: Story = {
  args: { label: "Publish reply" },
  render: function UsageExample(args) {
    return (
      <section className="w-[440px] max-w-full space-y-5 rounded-xl border border-semantic-border-layout bg-semantic-bg-primary p-6">
        <div className="space-y-2">
          <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
            Ready for your team
          </h3>
          <p className="m-0 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
            Publish the reply now, or use the menu to save a draft.
          </p>
        </div>
        <ControlledExample {...args} />
      </section>
    );
  },
};
export const KeyboardInteraction: Story = {
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: "Publish more actions",
    });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByRole("menuitem", { name: "Publish and notify" })
    ).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(
      canvas.getByRole("button", { name: "Draft saved" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Draft saved more actions" })
    ).toHaveFocus();
  },
};
