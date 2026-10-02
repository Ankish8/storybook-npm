import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { ArrowRight, Mail, Plus, Trash2 } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";

const FIGMA_V2_BUTTON_DESIGN_URL =
  "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-6438";

const VARIANTS = [
  "default",
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
  "success",
  "dashed",
] as const;

function buttonStoryProps(args: React.ComponentProps<typeof Button>) {
  // Action spies record arguments, so keep browser events out of the story log.
  const onClick = args.onClick as (() => void) | undefined;
  return { ...args, onClick: () => onClick?.() };
}

const tokenRow = (
  label: string,
  variable: string,
  value: string,
  swatch?: string
) => `
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">${label}</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${variable}</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">${value}</td>
      <td style="padding: 12px 16px;">${
        swatch
          ? `<div style="width: 32px; height: 32px; background: ${swatch}; border-radius: 6px; border: 1px solid #E9EAEB;"></div>`
          : "—"
      }</td>
    </tr>`;

const meta: Meta<typeof Button> = {
  title: "V2/Components/Button",
  component: Button,
  render: (args) => <Button {...buttonStoryProps(args)} />,
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "variant",
        "size",
        "children",
        "disabled",
        "loading",
        "loadingText",
        "leftIcon",
        "rightIcon",
        "onClick",
      ],
    },
    design: {
      type: "figma",
      url: FIGMA_V2_BUTTON_DESIGN_URL,
    },
    docs: {
      description: {
        component: `
Buttons trigger actions or events. **v2 design** — same props as the v1 Button, so moving a screen is an import-path change.

\`\`\`bash
npx myoperator-ui add v2-button
\`\`\`

## Import

\`\`\`tsx
import { Button } from "@/components/ui/v2/button"
\`\`\`

## Unprefixed Tailwind

v1 components ship with a \`tw-\` class prefix for Bootstrap hosts. **v2 does not** — it installs exactly as written, so your project must build Tailwind **without** a prefix and define the semantic colors (\`npx myoperator-ui init\` with an empty prefix does both). v1 is unaffected.

## What changes from v1

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">Aspect</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">v1</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">v2</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Heights</td><td style="padding: 12px 16px;">sm 32 · default 36 · lg 40</td><td style="padding: 12px 16px;">sm 32 · default 40 · lg 48</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Radius</td><td style="padding: 12px 16px;">4px</td><td style="padding: 12px 16px;">8px</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Label</td><td style="padding: 12px 16px;">Source Sans / inherited, 14 semibold</td><td style="padding: 12px 16px;">Inter 14/20; 500 neutral labels, 600 filled actions (12px sm)</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Solid variants</td><td style="padding: 12px 16px;">Flat fill</td><td style="padding: 12px 16px;">Skeuomorphic border + shadow, gradient when pressed</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Secondary</td><td style="padding: 12px 16px;">Grey surface</td><td style="padding: 12px 16px;">Light-blue surface</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Ghost / Link</td><td style="padding: 12px 16px;">Muted text / blue link</td><td style="padding: 12px 16px;">Blue text / dark text</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Focus ring</td><td style="padding: 12px 16px;">2px ring, 2px offset</td><td style="padding: 12px 16px;">1px outline, 3px offset</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Minimum width</td><td style="padding: 12px 16px;">64 / 80 / 96px</td><td style="padding: 12px 16px;">None (hugs content, per Figma)</td></tr>
  </tbody>
</table>

## Text hierarchy

Neutral labels use v2's softer gray palette. Headings use charcoal, body text uses medium gray and supporting text uses a lighter gray. These v2-only text colors follow the October 2 visual refinement; brand action backgrounds and v1 colors stay unchanged.

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 500;">Preview</th>
    </tr>
  </thead>
  <tbody>${[
    tokenRow("Primary", "--semantic-primary", "343E55", "#343E55"),
    tokenRow("Primary hover", "--semantic-primary-hover", "2F384D", "#2F384D"),
    tokenRow(
      "Pressed gradient start",
      "--color-primary-300",
      "777E8D",
      "#777E8D"
    ),
    tokenRow("Disabled", "--semantic-disabled-primary", "A2A6B1", "#A2A6B1"),
    tokenRow(
      "Secondary surface",
      "--semantic-info-surface",
      "ECF1FB",
      "#ECF1FB"
    ),
    tokenRow("Destructive", "--semantic-error-primary", "F04438", "#F04438"),
    tokenRow("Success", "--semantic-success-primary", "17B26A", "#17B26A"),
    tokenRow(
      "Skeuomorphic border",
      "--border-skeuomorphic",
      "rgba(255,255,255,0.12)",
      "#343E55"
    ),
    tokenRow("Font", "--font-v2", "Inter", undefined),
    tokenRow("Heading text", "--v2-text-primary", "484848", "#484848"),
    tokenRow(
      "Neutral action label",
      "--v2-text-secondary",
      "5E5E5E",
      "#5E5E5E"
    ),
    tokenRow("Supporting text", "--v2-text-muted", "707070", "#707070"),
    tokenRow("Radius", "--radius", "8px", undefined),
  ].join("")}
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    variant: "default",
    size: "default",
    children: "Button",
    disabled: false,
    loading: false,
    loadingText: "Saving...",
    leftIcon: false,
    rightIcon: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text", description: "Visible action label." },
    variant: {
      control: "select",
      options: VARIANTS,
      description: "The visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon", "icon-sm", "icon-lg"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    loading: {
      control: "boolean",
      description: "Shows a spinner, disables the button and sets aria-busy",
    },
    loadingText: {
      control: "text",
      description: "Text shown during loading",
    },
    leftIcon: {
      control: "boolean",
      description: "Icon on the left side",
      mapping: {
        true: <Mail />,
        false: undefined,
      },
    },
    rightIcon: {
      control: "boolean",
      description: "Icon on the right side",
      mapping: {
        true: <ArrowRight />,
        false: undefined,
      },
    },
    asChild: {
      control: false,
      description: "Render as child element",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
export const Default: Story = { args: { variant: "default" } };
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const Link: Story = { args: { variant: "link", children: "Link" } };
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};
export const Success: Story = {
  args: { variant: "success", children: "Confirm" },
};
export const Dashed: Story = {
  args: { variant: "dashed", children: "Add item" },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { loading: true, loadingText: "Saving..." },
};
export const WithIcons: Story = {
  name: "With icons",
  args: { children: "Send email", leftIcon: true, rightIcon: true },
};
export const IconOnly: Story = {
  name: "Icon only",
  args: { size: "icon", variant: "outline", "aria-label": "Add item" },
  parameters: gallery(
    ["children", "leftIcon", "rightIcon"],
    "An accessible icon button. Controls update its palette, size, disabled and loading states."
  ),
  render: (args) => (
    <Button
      {...buttonStoryProps(args)}
      leftIcon={undefined}
      rightIcon={undefined}
    >
      <Plus />
    </Button>
  ),
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["variant"],
    "Compare palettes. Label, size, icon, disabled and loading controls apply across all variants."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-2">
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            {variant[0].toUpperCase() + variant.slice(1)}
          </span>
          <Button {...buttonStoryProps(args)} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Text and icon buttons at each height. Label and icon controls apply to the text buttons; palette, disabled and loading controls apply to both rows."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col items-start gap-6">
      <div className="flex flex-wrap items-end gap-6">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-2">
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "sm" ? 32 : size === "lg" ? 48 : 40}px
            </span>
            <Button {...buttonStoryProps(args)} size={size} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-6">
        {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-2">
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "icon-sm" ? 32 : size === "icon-lg" ? 48 : 40}
              px
            </span>
            <Button
              {...buttonStoryProps(args)}
              size={size}
              leftIcon={undefined}
              rightIcon={undefined}
              aria-label={"Add item · " + size}
            >
              <Plus />
            </Button>
          </div>
        ))}
      </div>
    </div>
  ),
};
const STATE_COLUMNS = [
  { label: "Default", className: undefined, props: {} },
  { label: "Hover", className: "pseudo-hover", props: {} },
  { label: "Pressed", className: "pseudo-active", props: {} },
  { label: "Focus", className: "pseudo-focus-visible", props: {} },
  { label: "Disabled", className: undefined, props: { disabled: true } },
  { label: "Loading", className: undefined, props: { loading: true } },
] as const;
export const States: Story = {
  parameters: {
    ...gallery(
      ["variant", "disabled", "loading"],
      "Rows fix the palette and columns fix the visual state. Controls edit size, label, icons and loading text across the matrix."
    ),
    layout: "padded",
  },
  argTypes: { size: { options: ["sm", "default", "lg"] } },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1000px] grid-cols-[110px_repeat(6,minmax(120px,1fr))] items-center gap-x-4 gap-y-5">
        <div />
        {STATE_COLUMNS.map((column) => (
          <div
            key={column.label}
            className="text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {column.label}
          </div>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {variant}
            </div>
            {STATE_COLUMNS.map((column) => (
              <div key={column.label}>
                <Button
                  {...buttonStoryProps(args)}
                  variant={variant}
                  className={column.className}
                  {...column.props}
                />
              </div>
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
      ["variant", "size"],
      "The same props rendered by each version, at small, default and large sizes. Content, icon, disabled and loading controls apply to both columns."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-[110px_1fr_1fr] items-center gap-x-8 gap-y-4">
        <div />
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 (ui/button)
        </div>
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 (ui/v2/button)
        </div>
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {variant}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(["sm", "default", "lg"] as const).map((size) => (
                <ButtonV1
                  {...buttonStoryProps(args)}
                  key={size}
                  variant={variant}
                  size={size}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(["sm", "default", "lg"] as const).map((size) => (
                <Button
                  {...buttonStoryProps(args)}
                  key={size}
                  variant={variant}
                  size={size}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const Usage: Story = {
  parameters: gallery(
    ["variant", "children", "leftIcon", "rightIcon"],
    "Action labels and palettes belong to the example. Controls update size, disabled and loading states for the actions."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Delete workspace
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          This removes every bot, template and contact. It cannot be undone.
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button {...buttonStoryProps(args)} variant="outline">
          Cancel
        </Button>
        <Button
          {...buttonStoryProps(args)}
          variant="destructive"
          leftIcon={<Trash2 />}
        >
          Delete
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-semantic-border-layout pt-4">
        <Button {...buttonStoryProps(args)} variant="ghost">
          Learn more
        </Button>
        <Button {...buttonStoryProps(args)}>Save</Button>
      </div>
    </div>
  ),
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: { children: "Save changes" },
  parameters: {
    docs: {
      description: {
        story:
          "Plays a real click and keyboard activation against the action spy. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save changes" });

    await step("A click calls onClick", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("Enter and Space activate it from the keyboard", async () => {
      button.focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });
  },
};
