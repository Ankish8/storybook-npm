import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import * as React from "react";
import {
  Archive,
  Check,
  Copy,
  Link,
  Minus,
  Plus,
  Pin,
  Trash2,
  LayoutGrid,
  List,
  Calendar,
  Save,
  Eye,
} from "lucide-react";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "@/storybook/v2-preview";

type DemoArgs = ButtonGroupProps & {
  firstLabel: string;
  showIcons: boolean;
  showMenu: boolean;
  disableSecond: boolean;
};
const controls = [
  "label",
  "variant",
  "size",
  "orientation",
  "firstLabel",
  "showIcons",
  "iconOnly",
  "showMenu",
  "disableSecond",
  "disabled",
  "collapseLabels",
];
function ActionsDemo({
  firstLabel,
  showIcons,
  showMenu,
  disableSecond,
  ...args
}: DemoArgs) {
  const [feedback, setFeedback] = React.useState("");
  const [confirmation, setConfirmation] = React.useState<string | null>(null);
  const copied = confirmation === firstLabel;
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <ButtonGroup
        {...args}
        items={[
          {
            id: "share",
            label: copied ? "Copied" : firstLabel,
            reserve: [firstLabel, "Copied"],
            icon: showIcons ? copied ? <Check /> : <Link /> : undefined,
            onSelect: () => {
              setConfirmation(copied ? null : firstLabel);
              setFeedback(
                copied ? "Ready to share again" : "Link copied in this demo"
              );
            },
          },
          {
            id: "duplicate",
            label: "Duplicate",
            icon: showIcons ? <Copy /> : undefined,
            disabled: disableSecond,
            onSelect: () => setFeedback("A duplicate was created in this demo"),
          },
          {
            id: "archive",
            label: "Archive",
            icon: showIcons ? <Archive /> : undefined,
            onSelect: () => setFeedback("Document archived in this demo"),
          },
        ]}
        menu={
          showMenu
            ? {
                label: "More actions",
                items: [
                  {
                    id: "pin",
                    label: "Pin to sidebar",
                    icon: <Pin />,
                    onSelect: () =>
                      setFeedback("Pinned to the sidebar in this demo"),
                  },
                  {
                    id: "final",
                    label: "Mark as final",
                    icon: <Check />,
                    onSelect: () =>
                      setFeedback("Document marked as final in this demo"),
                  },
                  {
                    id: "delete",
                    label: "Delete copy",
                    icon: <Trash2 />,
                    destructive: true,
                    disabled: true,
                  },
                ],
              }
            : undefined
        }
      />
      <p
        aria-live="polite"
        className="m-0 min-h-5 text-center text-sm font-normal text-[var(--v2-text-muted,#707070)]"
      >
        {feedback || "Try an action or move between buttons."}
      </p>
    </div>
  );
}
const meta: Meta<DemoArgs> = {
  title: "V2/Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { include: controls },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "button-group",
          hasV1: false,
          summary:
            "Related actions joined into one surface. A shared highlight follows pointer and keyboard focus; confirmations animate in place. This is a new v2 primitive, with no v1 replacement.",
          changes: [
            ["Surface", "—", "Outline or solid; 8px corners; quiet dividers"],
            ["Sizes", "—", "36 / 44 / 50px outer heights, matching Button"],
            [
              "Motion",
              "—",
              "Shared spring highlight, content-only press feedback, reserved-label crossfade",
            ],
            [
              "Compatibility",
              "—",
              "value/defaultValue/onValueChange and default/primary/toggle aliases remain supported",
            ],
          ],
          tokens: [
            ["Primary", "--semantic-primary", "#343E55", "#343E55"],
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Text", "--v2-text-primary", "#484848", "#484848"],
          ],
          guidance:
            "Use id-based items with onSelect for actions. Reserve alternate labels to keep confirmations the same width. Icon-only items keep accessible names; labels collapse when space is limited. Tab visits each action; arrow keys and Home/End move focus. Reduced motion removes spatial movement. Existing value-based items opt into selection compatibility mode. Use Split Button for one main action with alternatives, and Tabs for page navigation.",
        }),
      },
    },
  },
  args: {
    items: [],
    label: "Document actions",
    variant: "outline",
    size: "default",
    orientation: "horizontal",
    firstLabel: "Share",
    showIcons: true,
    showMenu: true,
    disableSecond: false,
    iconOnly: false,
    disabled: false,
    collapseLabels: true,
  },
  argTypes: {
    label: { control: "text", description: "Accessible name of this group." },
    variant: { control: "select", options: ["outline", "solid"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    firstLabel: {
      control: "text",
      description:
        "Resting label of the first action. Activate it to try confirmation feedback.",
    },
    showIcons: { control: "boolean" },
    showMenu: { control: "boolean" },
    disableSecond: {
      control: "boolean",
      description: "Keeps Duplicate discoverable but blocks its action.",
    },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    collapseLabels: { control: "boolean" },
    value: { control: false },
    onValueChange: { control: false },
  },
  render: (args) => <ActionsDemo {...args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Outline: Story = {};
export const Solid: Story = { args: { variant: "solid" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Vertical: Story = { args: { orientation: "vertical" } };
export const IconsOnly: Story = { args: { iconOnly: true } };
export const LabelsOnly: Story = {
  args: { showIcons: false, showMenu: false },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledItem: Story = { args: { disableSecond: true } };
export const WithoutMenu: Story = { args: { showMenu: false } };
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Outline and solid surfaces. Each example has independent action feedback."
  ),
  render: (args) => (
    <div className="grid w-[680px] max-w-full gap-8">
      {(["outline", "solid"] as const).map((variant) => (
        <section key={variant} className="min-w-0 space-y-4">
          <h3 className="m-0 text-center text-sm font-medium capitalize text-[var(--v2-text-secondary,#5E5E5E)]">
            {variant}
          </h3>
          <ActionsDemo {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "36px, 44px and 50px outer heights. Other properties apply to all three examples."
  ),
  render: (args) => (
    <div className="grid w-[680px] max-w-full gap-8">
      {(["sm", "default", "lg"] as const).map((size, index) => (
        <section key={size} className="min-w-0 space-y-4">
          <h3 className="m-0 text-center text-sm font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
            {["Small · 36px", "Default · 44px", "Large · 50px"][index]}
          </h3>
          <ActionsDemo {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled", "disableSecond"],
    "Try enabled actions; the unavailable action remains discoverable but does not run."
  ),
  render: (args) => (
    <div className="grid w-[680px] max-w-full gap-8">
      {["Enabled", "One unavailable action", "Disabled group"].map(
        (label, index) => (
          <section key={label} className="min-w-0 space-y-4">
            <h3 className="m-0 text-center text-sm font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {label}
            </h3>
            <ActionsDemo
              {...args}
              disabled={index === 2}
              disableSecond={index === 1}
            />
          </section>
        )
      )}
    </div>
  ),
};
export const Responsive: Story = {
  parameters: gallery(
    [],
    "A narrow container collapses icon labels. Turn off collapseLabels to compare horizontal scrolling."
  ),
  render: (args) => (
    <div className="w-[240px] max-w-full">
      <ActionsDemo {...args} />
    </div>
  ),
};
function ZoomDemo(args: DemoArgs) {
  const [zoom, setZoom] = React.useState(100);
  return (
    <div className="flex flex-col items-center gap-5">
      <ButtonGroup
        label={args.label}
        size={args.size}
        variant={args.variant}
        orientation={args.orientation}
        disabled={args.disabled}
        items={[
          {
            id: "out",
            label: "Zoom out",
            icon: <Minus />,
            iconOnly: true,
            disabled: zoom <= 50,
            onSelect: () => setZoom((n) => n - 10),
          },
          {
            id: "reset",
            label: `Zoom ${zoom}%, reset to 100%`,
            content: (
              <span className="inline-block min-w-12 text-center">{zoom}%</span>
            ),
            onSelect: () => setZoom(100),
          },
          {
            id: "in",
            label: "Zoom in",
            icon: <Plus />,
            iconOnly: true,
            disabled: zoom >= 200,
            onSelect: () => setZoom((n) => n + 10),
          },
        ]}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
        Use + / − to adjust; select the value to reset.
      </p>
    </div>
  );
}
export const ZoomControls: Story = {
  args: { label: "Zoom controls" },
  parameters: {
    controls: {
      include: ["label", "variant", "size", "orientation", "disabled"],
    },
  },
  render: (args) => <ZoomDemo {...args} />,
};
export const Usage: Story = {
  parameters: gallery(
    [],
    "A document toolbar with independent actions and a menu. Feedback is contained within this demo."
  ),
  render: (args) => (
    <section className="w-[640px] max-w-full rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-6">
      <div className="mb-6 space-y-2">
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Campaign proposal
        </h3>
        <p className="m-0 text-sm font-normal text-[var(--v2-text-muted,#707070)]">
          Keep related document actions together.
        </p>
      </div>
      <ActionsDemo {...args} />
    </section>
  ),
};
export const Links: Story = {
  parameters: {
    controls: {
      include: [
        "label",
        "variant",
        "size",
        "orientation",
        "disabled",
        "showIcons",
      ],
    },
  },
  render: function LinkActions(args) {
    const [saved, setSaved] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-5">
        <ButtonGroup
          label={args.label}
          variant={args.variant}
          size={args.size}
          orientation={args.orientation}
          disabled={args.disabled}
          items={[
            {
              id: "save",
              label: saved ? "Saved" : "Save example",
              reserve: ["Saved", "Save example"],
              icon: args.showIcons ? saved ? <Check /> : <Save /> : undefined,
              onSelect: () => setSaved(!saved),
            },
            {
              id: "preview",
              label: "Preview section",
              icon: args.showIcons ? <Eye /> : undefined,
              href: "#group-link-target",
            },
          ]}
        />
        <p
          id="group-link-target"
          className="m-0 text-sm text-[var(--v2-text-muted,#707070)]"
        >
          {saved
            ? "Changes saved in this demo."
            : "The link targets this preview section."}
        </p>
      </div>
    );
  },
};
const choices = [
  { value: "grid", label: "Grid", icon: <LayoutGrid /> },
  { value: "list", label: "List", icon: <List /> },
  { value: "calendar", label: "Calendar", icon: <Calendar /> },
];
export const SelectionCompatibility: Story = {
  args: { value: "grid", variant: "outline", onValueChange: fn() },
  argTypes: {
    value: { control: "select", options: ["grid", "list", "calendar"] },
  },
  parameters: {
    controls: {
      include: [
        "value",
        "variant",
        "size",
        "orientation",
        "iconOnly",
        "disabled",
      ],
    },
    docs: {
      description: {
        story:
          "Existing value-based items and onValueChange continue to work. This compatibility example keeps its selected state synchronized with Controls.",
      },
    },
  },
  render: function Selection(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="flex flex-col items-center gap-4">
        <ButtonGroup
          items={choices}
          value={args.value}
          variant={args.variant}
          size={args.size}
          orientation={args.orientation}
          iconOnly={args.iconOnly}
          disabled={args.disabled}
          label="Conversation view"
          onValueChange={(value) => {
            args.onValueChange?.(value);
            updateArgs({ value });
          }}
        />
        <p className="m-0 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
          Showing the {args.value} view
        </p>
      </div>
    );
  },
};
export const Primary: Story = {
  ...Solid,
  args: { ...Solid.args, variant: "primary" },
  parameters: {
    controls: { include: controls.filter((key) => key !== "variant") },
  },
};
export const Toggle: Story = {
  ...SelectionCompatibility,
  args: { ...SelectionCompatibility.args, variant: "toggle", iconOnly: true },
};
export const ToggleLabels: Story = {
  ...SelectionCompatibility,
  args: { ...SelectionCompatibility.args, variant: "toggle" },
};
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button", { name: "Share" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(
      canvas.getByRole("button", { name: "Duplicate" })
    ).toHaveFocus();
    await userEvent.keyboard("{Home}{Enter}");
    await expect(
      canvas.getByRole("button", { name: "Copied" })
    ).toBeInTheDocument();
    await userEvent.keyboard("{End}{Enter}");
    await expect(
      within(canvasElement.ownerDocument.body).getByRole("menu")
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("button", { name: "More actions" })
    ).toHaveFocus();
  },
};
