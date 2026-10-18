import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { ArrowRight, Mail, Plus, Trash2 } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";

const FIGMA_V2_BUTTON_DESIGN_URL =
  "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-6438";

const LEGACY_VARIANTS = [
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

const VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "success",
  "dashed",
  "link",
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
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Heights</td><td style="padding: 12px 16px;">sm 32 · default 36 · lg 40</td><td style="padding: 12px 16px;">sm 32 · default 40 · lg 44</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Radius</td><td style="padding: 12px 16px;">4px</td><td style="padding: 12px 16px;">8px</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Label</td><td style="padding: 12px 16px;">Source Sans / inherited, 14 semibold</td><td style="padding: 12px 16px;">Timeless Sans (Inter fallback) 14px / 1.4; 500 on every variant</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Solid variants</td><td style="padding: 12px 16px;">Flat fill</td><td style="padding: 12px 16px;">Flat primary fill; 91% opacity on hover, 84% while pressed</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Secondary</td><td style="padding: 12px 16px;">Grey surface</td><td style="padding: 12px 16px;">Filled neutral surface, distinct from the white bordered Outline</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Ghost / Link</td><td style="padding: 12px 16px;">Muted text / blue link</td><td style="padding: 12px 16px;">Ghost: muted text with a subtle hover fill. Link: blue, underlined and borderless</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Focus ring</td><td style="padding: 12px 16px;">2px ring, 2px offset</td><td style="padding: 12px 16px;">1px outline, 3px offset</td></tr>
    <tr style="border-bottom: 1px solid #E9EAEB;"><td style="padding: 12px 16px;">Minimum width</td><td style="padding: 12px 16px;">64 / 80 / 96px</td><td style="padding: 12px 16px;">None (hugs content)</td></tr>
  </tbody>
</table>

## Text hierarchy

Labels use medium weight (500) at 14px. Secondary actions use a neutral foreground; Ghost uses muted neutral text. Link is blue and underlined, with no surface or border. Supporting example text keeps the softer v2 hierarchy. Button states follow the October 7 Arc comparison; primary stays 343E55 and the radius stays 8px.

## v1 compatibility

Preview and examples show the same eight styles: Primary, Secondary, Outline, Ghost, Destructive, Success, Dashed and Link. Existing calls keep working:

| Existing variant | v2 style |
| --- | --- |
| Omitted / default / primary | Primary |
| secondary | Filled neutral surface |
| outline | White bordered surface |
| ghost / link / destructive | Matching canonical style |
| success / dashed | Filled green / dashed outline |

All six size names, icons, loadingText and asChild remain supported. Changing the import to v2 opts into its visual styling and 32/40/44px heights; it does not require rewriting variant props. The v1 component itself is unchanged.

## Interactions

Press feedback uses a quick compression, a gentle spring return and a subtle ripple from the activation point. Keyboard activation starts the ripple in the center. Reduced motion disables the ripple, including when the preference changes during activation. Wide actions compress less than compact ones. Primary hover and press use opacity instead of a gradient; neutral actions gain a quiet surface tint. Labels rise through a short soft blur while their width springs to fit. Links and popup triggers stay stationary. Hover applies only to hover-capable fine pointers. The reference is [Arc Button](https://uiarc.dev/components/button).

Loading keeps the original width and displays a centered spinner. Set \`loadingText\` to opt into an inline spinner with an explicit status label. Loading sets native \`disabled\`, \`aria-busy\` and \`aria-disabled\`, matching v1 and preventing repeat activation. Busy native buttons are skipped in the Tab order. Disabled actions use 52% opacity. Reduced motion removes scale, movement and blur; short fades remain. We retain a visible keyboard focus outline, unlike the reference.

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
    tokenRow("Surface", "--v2-button-surface", "white", "#ffffff"),
    tokenRow(
      "Hover / pressed surface",
      "--v2-button-surface-muted",
      "oklch(0.978 0 0)",
      "oklch(0.978 0 0)"
    ),
    tokenRow(
      "Border",
      "--v2-button-border",
      "oklch(0.935 0 0)",
      "oklch(0.935 0 0)"
    ),
    tokenRow(
      "Foreground",
      "--v2-button-foreground",
      "oklch(0.15 0 0)",
      "oklch(0.15 0 0)"
    ),
    tokenRow(
      "Ghost",
      "--v2-button-secondary",
      "oklch(0.46 0 0)",
      "oklch(0.46 0 0)"
    ),
    tokenRow(
      "Destructive",
      "--v2-button-danger",
      "oklch(0.54 0.21 25)",
      "oklch(0.54 0.21 25)"
    ),
    tokenRow("Success", "--semantic-success-text", "067647", "#067647"),
    tokenRow("Hover shadow", "--v2-button-shadow", "rgba(0,0,0,0.035)"),
    tokenRow("Font", "--font-v2", "Timeless Sans (Inter fallback)", undefined),
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
    variant: "primary",
    size: "default",
    children: "Button",
    disabled: false,
    loading: false,
    loadingText: "",
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
      options: ["sm", "default", "lg"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    loading: {
      control: "boolean",
      description:
        "Shows a spinner and natively disables the button, matching v1",
    },
    loadingText: {
      control: "text",
      description:
        "Optional inline loading label. Leave empty for the centered spinner.",
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
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Success: Story = {
  args: { variant: "success", children: "Success" },
};
export const Dashed: Story = {
  args: { variant: "dashed", children: "Dashed" },
};
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const Link: Story = {
  args: { variant: "link", children: "Learn more" },
};
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete", leftIcon: true },
  argTypes: { leftIcon: { mapping: { true: <Trash2 />, false: undefined } } },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { loading: true, children: "Upload file" },
};
export const WithIcons: Story = {
  name: "With icons",
  args: { children: "Send email", leftIcon: true, rightIcon: true },
};
export const IconOnly: Story = {
  name: "Icon only",
  args: { size: "icon", variant: "secondary", "aria-label": "Add item" },
  parameters: {
    ...gallery(
      ["children", "leftIcon", "rightIcon", "loadingText"],
      "A centered, square icon button. Switch between 32, 40 and 44px, then try its loading and disabled states."
    ),
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["icon-sm", "icon", "icon-lg"],
      control: {
        type: "select",
        labels: {
          "icon-sm": "Small · 32px",
          icon: "Default · 40px",
          "icon-lg": "Large · 44px",
        },
      },
    },
  },
  render: (args) => (
    <Button
      {...buttonStoryProps(args)}
      size={
        args.size === "sm"
          ? "icon-sm"
          : args.size === "lg"
            ? "icon-lg"
            : args.size?.startsWith("icon")
              ? args.size
              : "icon"
      }
      leftIcon={undefined}
      rightIcon={undefined}
    >
      <Plus />
    </Button>
  ),
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      ["variant"],
      "Eight distinct styles match the examples: Primary, Secondary, Outline, Ghost, Destructive, Success, Dashed and Link. Default remains an alias of Primary."
    ),
    layout: "centered",
  },
  render: (args) => (
    <div className="mx-auto grid w-full max-w-[520px] grid-cols-2 items-start gap-x-6 gap-y-7 sm:grid-cols-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
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
  parameters: {
    ...gallery(
      ["size"],
      "Text and icon buttons at each height. Label and icon controls apply to the text buttons; palette, disabled and loading controls apply to both rows."
    ),
    layout: "centered",
  },
  render: (args) => (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-7">
      <div className="grid w-full grid-cols-3 items-end gap-6">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div
            key={size}
            className="flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "sm" ? 32 : size === "lg" ? 44 : 40}px
            </span>
            <Button {...buttonStoryProps(args)} size={size} />
          </div>
        ))}
      </div>
      <div className="grid w-full grid-cols-3 items-end gap-6">
        {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
          <div
            key={size}
            className="flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "icon-sm" ? 32 : size === "icon-lg" ? 44 : 40}
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
  name: "v1 compatibility",
  parameters: {
    ...gallery(
      ["variant", "size"],
      "All nine v1 names still work. Default maps to Primary; Secondary has a neutral fill, Outline a white bordered surface, and Success a filled green surface. Content, icon, disabled and loading controls apply to both versions."
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
        {LEGACY_VARIANTS.map((variant) => (
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
    <div className="flex w-[420px] max-w-full flex-col gap-6 rounded-lg border border-v2-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-v2-semantic-border-layout pt-4">
        <Button {...buttonStoryProps(args)} variant="ghost">
          Learn more
        </Button>
        <Button {...buttonStoryProps(args)}>Save</Button>
      </div>
    </div>
  ),
};

function SaveFlowRender() {
  const [args, updateArgs] = useArgs<React.ComponentProps<typeof Button>>();
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!args.loading) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, [args.loading]);

  function save() {
    if (timer.current || args.loading || args.disabled) return;
    buttonStoryProps(args).onClick();
    clearTimeout(timer.current);
    updateArgs({ loading: true });
    timer.current = setTimeout(() => {
      timer.current = undefined;
      updateArgs({ loading: false, children: "Saved" });
    }, 1100);
  }

  return (
    <div className="flex w-[400px] max-w-full flex-col items-start gap-5 rounded-lg border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Save a draft
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
          Try a click, Enter or Space. The action is disabled while it saves.
        </p>
      </div>
      <div className="flex max-w-full flex-wrap items-center gap-3">
        <Button {...buttonStoryProps(args)} onClick={save} />
        <Button
          variant="ghost"
          size="sm"
          disabled={args.loading || args.disabled}
          onClick={() =>
            updateArgs({ loading: false, children: "Save changes" })
          }
        >
          Reset
        </Button>
      </div>
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
        {args.loading
          ? "Saving your draft…"
          : args.children === "Saved"
            ? "Draft saved. Reset to try again."
            : "Preview changes and Controls stay synchronized."}
      </p>
    </div>
  );
}

export const SaveFlow: Story = {
  name: "Save flow",
  args: { children: "Save changes", loadingText: "" },
  parameters: {
    ...gallery(
      [],
      "Click Save changes to try the label transition, width spring and loading feedback. Label, loading, palette, size and icon controls stay live. Reset repeats the flow."
    ),
    layout: "centered",
  },
  render: SaveFlowRender,
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
