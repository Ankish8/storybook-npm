import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "./tooltip";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { v2ComponentDocs } from "./story-docs";

const SIDES = ["top", "right", "bottom", "left"] as const;
const OFFSETS = [4, 10, 20] as const;
type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> &
  Pick<
    React.ComponentProps<typeof TooltipContent>,
    "side" | "align" | "sideOffset"
  > & {
    triggerLabel: string;
    tooltipText: string;
    title: string;
    rich: boolean;
    showArrow: boolean;
    step: number;
    onNext: () => void;
    onSkip: () => void;
  };

function tooltipCopy(args: TooltipStoryArgs) {
  return (
    <div className="flex max-w-full flex-col gap-1.5">
      {args.rich && (
        <p className="m-0 text-xs font-medium text-[var(--v2-text-primary,#484848)]">
          {args.title}
        </p>
      )}
      <p className="m-0 text-xs leading-4">{args.tooltipText}</p>
    </div>
  );
}

/** Inline visual samples never create a portal over Docs or share open state. */
function InlineTooltip({
  version = "v2",
  visualState,
  ...args
}: TooltipStoryArgs & { version?: "v1" | "v2"; visualState?: string }) {
  const Action = version === "v2" ? Button : ButtonV1;
  const bubble = (
    <div
      className={
        version === "v2"
          ? "relative max-w-xs whitespace-normal rounded-md bg-semantic-info-surface px-4 py-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal text-[var(--v2-text-secondary,#5E5E5E)] shadow-[0_1px_3px_0_rgba(10,13,18,0.1),0_1px_2px_-1px_rgba(10,13,18,0.1)]"
          : "relative max-w-xs whitespace-normal rounded-md bg-semantic-primary px-3 py-1.5 text-xs text-semantic-text-inverted shadow-md"
      }
      data-v2-component={version === "v2" ? "tooltip" : undefined}
      data-side={args.side}
      data-offset={args.sideOffset}
      data-presentation="inline"
    >
      {version === "v2" ? (
        tooltipCopy(args)
      ) : (
        <div className="flex flex-col gap-1.5">
          {args.rich && (
            <p className="m-0 text-xs font-semibold">{args.title}</p>
          )}
          <p className="m-0 text-xs leading-4">{args.tooltipText}</p>
        </div>
      )}
      {args.showArrow && (
        <svg
          aria-hidden="true"
          width="10"
          height="5"
          viewBox="0 0 10 5"
          className={cn(
            version === "v2"
              ? "fill-semantic-info-surface"
              : "fill-semantic-primary",
            args.side === "bottom"
              ? "absolute -top-[5px] rotate-180"
              : args.side === "right"
                ? "absolute -left-[7.5px] rotate-90"
                : args.side === "left"
                  ? "absolute -right-[7.5px] -rotate-90"
                  : "absolute -bottom-[5px]",
            (args.side === "left" || args.side === "right") &&
              (args.align === "start"
                ? "top-1.5"
                : args.align === "end"
                  ? "bottom-1.5"
                  : "top-1/2 -translate-y-1/2"),
            (args.side === "top" || args.side === "bottom") &&
              (args.align === "start"
                ? "left-4"
                : args.align === "end"
                  ? "right-4"
                  : "left-1/2 -translate-x-1/2")
          )}
        >
          <path d="M0 0h10L5 5Z" />
        </svg>
      )}
    </div>
  );
  return (
    <div
      className={cn(
        "flex max-w-full",
        args.side === "left" || args.side === "right"
          ? "items-center"
          : "flex-col items-center",
        args.side === "right" || args.side === "bottom"
          ? "flex-row-reverse"
          : undefined,
        args.side === "bottom" && "flex-col-reverse"
      )}
      style={{ gap: args.sideOffset }}
    >
      {visualState !== "Closed" && bubble}
      <Action
        variant="outline"
        size="sm"
        className={
          visualState === "Hover"
            ? "pseudo-hover"
            : visualState === "Keyboard focus"
              ? "pseudo-focus-visible"
              : undefined
        }
      >
        {args.triggerLabel}
      </Action>
    </div>
  );
}

const meta: Meta<TooltipStoryArgs> = {
  title: "V2/Components/Tooltip",
  component: Tooltip,
  subcomponents: { TooltipTrigger, TooltipContent, TooltipArrow } as Record<
    string,
    React.ComponentType<unknown>
  >,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "open",
        "delayDuration",
        "side",
        "align",
        "sideOffset",
        "triggerLabel",
        "tooltipText",
        "title",
        "rich",
        "showArrow",
        "onOpenChange",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12668",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "tooltip",
          exportName:
            "TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow",
          summary:
            "Short contextual help on hover or keyboard focus. Existing desktop, touch and controlled-open behavior stays available.",
          changes: [
            [
              "Surface",
              "Dark primary, inverted text",
              "Light blue info surface, secondary text",
            ],
            ["Padding", "6px / 12px", "6px / 16px"],
            [
              "Typography",
              "Inherited 12px",
              "Inter 12px regular; optional title 12px medium",
            ],
            ["Corners", "6px", "6px"],
            ["Maximum width", "320px", "320px"],
            [
              "Interaction",
              "Hover, keyboard focus, Escape and touch toggle",
              "Unchanged",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Text", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Font", "--font-v2", "Inter 400 / 500"],
            ["Corners", "6px literal", "6px"],
            [
              "Shadow",
              "Recorded tooltip shadow",
              "0 1px 3px rgba(10,13,18,.1), 0 1px 2px -1px rgba(10,13,18,.1)",
            ],
          ],
          guidance:
            "Use TooltipProvider around triggers. Keep ordinary tooltip content brief and non-interactive; label an icon-only trigger. The Figma card also demonstrates a tour callout. Usage composes that as a labelled non-modal dialog with explicit Next, Skip, outside-click and Escape dismissal. The tour controls are example state, not new component props. Inline galleries are visual samples without portals; Overview exercises the real positioning and interaction.",
        }),
      },
    },
  },
  args: {
    open: false,
    delayDuration: 0,
    side: "top",
    align: "center",
    sideOffset: 4,
    triggerLabel: "Hover or focus me",
    tooltipText: "View conversation details.",
    title: "Conversation details",
    rich: false,
    showArrow: true,
    step: 1,
    onOpenChange: fn(),
    onNext: fn(),
    onSkip: fn(),
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    return (
      <div className="flex max-w-full flex-col items-center gap-4 p-24">
        <Tooltip
          open={args.open}
          delayDuration={args.delayDuration}
          onOpenChange={(open) => {
            args.onOpenChange?.(open);
            updateArgs({ open });
          }}
        >
          <TooltipTrigger asChild>
            <Button variant="outline">{args.triggerLabel}</Button>
          </TooltipTrigger>
          <TooltipContent
            side={args.side}
            align={args.align}
            sideOffset={args.sideOffset}
            aria-label={(args.rich ? args.title + ". " : "") + args.tooltipText}
          >
            {tooltipCopy(args)}
            {args.showArrow && <TooltipArrow />}
          </TooltipContent>
        </Tooltip>
        <p
          className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
          role="status"
        >
          Tooltip is {args.open ? "open" : "closed"}
        </p>
      </div>
    );
  },
  argTypes: {
    open: {
      control: "boolean",
      description:
        "Live controlled open state; hover/focus/dismissal update Controls.",
      table: { category: "Tooltip" },
    },
    defaultOpen: {
      control: false,
      description:
        "Initial uncontrolled state; these stories use open for live updates.",
    },
    delayDuration: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description:
        "Delay before desktop hover opens the tooltip, in milliseconds.",
      table: { category: "Tooltip" },
    },
    onOpenChange: {
      control: false,
      description: "Called when the tooltip opens or dismisses.",
      table: { category: "Tooltip" },
    },
    side: {
      control: "select",
      options: SIDES,
      description: "Preferred side; collision handling may flip it.",
      table: { category: "TooltipContent" },
    },
    align: {
      control: "radio",
      options: ["start", "center", "end"],
      description: "Alignment along the trigger edge.",
      table: { category: "TooltipContent" },
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 40, step: 1 },
      description: "Distance from the trigger in pixels.",
      table: { category: "TooltipContent" },
    },
    triggerLabel: {
      control: "text",
      description: "Visible trigger label.",
      table: { category: "Example composition" },
    },
    tooltipText: {
      control: "text",
      description: "Contextual help text.",
      table: { category: "Example composition" },
    },
    title: {
      control: "text",
      description: "Optional heading in the rich or tour composition.",
      table: { category: "Example composition" },
    },
    rich: {
      control: "boolean",
      description: "Show the example title above the help text.",
      table: { category: "Example composition" },
    },
    showArrow: {
      control: "boolean",
      description: "Include TooltipArrow.",
      table: { category: "Example composition" },
    },
    step: {
      control: { type: "range", min: 1, max: 3, step: 1 },
      description: "Current local tour step.",
      table: { category: "Tour example" },
    },
    onNext: {
      control: false,
      description: "Tour Next/Done callback.",
      table: { category: "Tour example" },
    },
    onSkip: {
      control: false,
      description: "Tour Skip callback.",
      table: { category: "Tour example" },
    },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
export const Default: Story = {};
export const WithTitle: Story = { args: { rich: true } };
export const WithoutArrow: Story = { args: { showArrow: false } };
export const Bottom: Story = { args: { side: "bottom" } };
export const Left: Story = { args: { side: "left" } };
export const Right: Story = { args: { side: "right" } };
export const LongContent: Story = {
  args: {
    rich: true,
    tooltipText:
      "Use filters to narrow the inbox by assignee, unread status or conversation type. Long content wraps within the 320px maximum width.",
  },
};

const INLINE_CONTROLS = ["open", "delayDuration"];
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "rich"],
      "Compare plain help and a title/description composition. The title axis is fixed; text, trigger, side, alignment, offset and arrow controls remain live. Inline samples do not open overlays."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[720px] grid-cols-2 items-start gap-8">
        {[false, true].map((rich) => (
          <div key={String(rich)} className="flex flex-col items-center gap-4">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {rich ? "Title and description" : "Plain help"}
            </span>
            <InlineTooltip {...args} rich={rich} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const AllPositions: Story = {
  name: "Sides and offsets",
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "side", "sideOffset"],
      "The Figma positioning axes: four sides at 4px, 10px and 20px offsets. These are inline visual samples; alignment, text, title and arrow controls apply throughout. The matrix scrolls inside the preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1440px] grid-cols-[80px_repeat(4,minmax(300px,1fr))] items-center gap-x-8 gap-y-10">
        <div />
        {SIDES.map((side) => (
          <span
            key={side}
            className="text-xs font-normal text-[var(--v2-text-muted,#707070)]"
          >
            {side}
          </span>
        ))}
        {OFFSETS.map((sideOffset) => (
          <React.Fragment key={sideOffset}>
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {sideOffset}px
            </span>
            {SIDES.map((side) => (
              <InlineTooltip
                {...args}
                key={side}
                side={side}
                sideOffset={sideOffset}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS],
      "Closed, visible, hovered-trigger and keyboard-focus presentations. Tooltip content has the same surface in each visible state. Other composition controls apply to every sample; use Overview to test real hover, focus and Escape."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1100px] grid-cols-4 items-center gap-8">
        {["Closed", "Visible", "Hover", "Keyboard focus"].map((visualState) => (
          <div key={visualState} className="flex flex-col items-center gap-4">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {visualState}
            </span>
            <InlineTooltip {...args} visualState={visualState} />
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
      INLINE_CONTROLS,
      "The same trigger, copy, arrow, side, alignment and offset rendered with each version’s surface. Inline previews stay inside the comparison and create no portal."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[720px] grid-cols-2 items-start gap-8">
        {(["v1", "v2"] as const).map((version) => (
          <div key={version} className="flex flex-col items-center gap-4">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {version} · {version === "v1" ? "ui/tooltip" : "ui/v2/tooltip"}
            </span>
            <InlineTooltip {...args} version={version} />
          </div>
        ))}
      </div>
    </div>
  ),
};

function TourExample({
  args,
  updateArgs,
}: {
  args: TooltipStoryArgs;
  updateArgs: (next: Partial<TooltipStoryArgs>) => void;
}) {
  const titleId = React.useId();
  const [result, setResult] = React.useState("Tour not started.");
  const step = Math.max(1, Math.min(3, Math.round(args.step)));
  const setOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <div className="flex w-[520px] max-w-full flex-col items-center gap-6 rounded-xl border border-solid border-semantic-border-layout p-16 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1 text-center">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Inbox tour
        </p>
        <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
          A local three-step guide with working navigation.
        </p>
      </div>
      <Tooltip
        open={args.open}
        delayDuration={args.delayDuration}
        onOpenChange={(open) => {
          if (open) setOpen(true);
        }}
      >
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            leftIcon={<Info />}
            onClick={() => setOpen(!args.open)}
          >
            {args.triggerLabel}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={args.side}
          align={args.align}
          sideOffset={args.sideOffset}
          role="dialog"
          aria-label={args.title + " — step " + step}
          aria-labelledby={titleId}
          onEscapeKeyDown={() => setOpen(false)}
          onPointerDownOutside={() => setOpen(false)}
          className="w-[320px] max-w-[calc(100vw-2rem)]"
        >
          <div className="flex flex-col gap-1.5">
            <p
              id={titleId}
              className="m-0 text-xs font-medium text-[var(--v2-text-primary,#484848)]"
            >
              {args.title}
            </p>
            <p className="m-0 text-xs leading-4">{args.tooltipText}</p>
            <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
              Step {step} of 3
            </p>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                args.onSkip();
                setResult("Tour skipped.");
                setOpen(false);
              }}
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={() => {
                args.onNext();
                if (step < 3) {
                  updateArgs({ step: step + 1 });
                } else {
                  setResult("Tour complete.");
                  setOpen(false);
                }
              }}
            >
              {step < 3 ? "Next" : "Done"}
            </Button>
          </div>
          {args.showArrow && <TooltipArrow />}
        </TooltipContent>
      </Tooltip>
      <p
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        {result}
      </p>
    </div>
  );
}
export const Usage: Story = {
  args: {
    triggerLabel: "Start inbox tour",
    rich: true,
    title: "Find the conversations you need",
    tooltipText:
      "Use the inbox tabs and filters to focus on conversations that need your attention.",
    side: "bottom",
    sideOffset: 10,
  },
  parameters: {
    controls: {
      include: [
        "open",
        "delayDuration",
        "side",
        "align",
        "sideOffset",
        "triggerLabel",
        "title",
        "tooltipText",
        "showArrow",
        "step",
        "onNext",
        "onSkip",
        "onOpenChange",
      ],
    },
    docs: {
      description: {
        story:
          "The tour-style Figma composition: title, description, Skip and Next. Next advances the synchronized step Control; Done and Skip dismiss. Escape and clicking outside also dismiss. The labelled non-modal dialog stays open while its actions receive focus, and the accessible tooltip label avoids duplicate action buttons.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    return <TourExample args={args} updateArgs={updateArgs} />;
  },
};
