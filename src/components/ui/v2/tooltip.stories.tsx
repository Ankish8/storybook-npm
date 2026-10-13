import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Archive, Info, Pin } from "lucide-react";
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
import {
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "./modal";
import { v2ComponentDocs } from "./story-docs";

const SIDES = ["top", "right", "bottom", "left"] as const;
const OFFSETS = [4, 10, 20] as const;
type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> &
  Pick<
    React.ComponentProps<typeof TooltipContent>,
    "side" | "align" | "sideOffset" | "variant"
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
        <p className="m-0 text-xs font-medium leading-5">{args.title}</p>
      )}
      <p className="m-0 text-xs leading-5">{args.tooltipText}</p>
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
      className={cn(
        version === "v2"
          ? "relative max-w-[15rem] whitespace-normal break-words rounded-md border border-solid px-3 py-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-5 shadow-md"
          : "relative max-w-xs whitespace-normal rounded-md bg-semantic-primary px-3 py-1.5 text-xs text-semantic-text-inverted shadow-md",
        version === "v2" &&
          (args.variant === "light"
            ? "border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary [--tooltip-arrow-fill:var(--semantic-bg-primary)]"
            : "border-semantic-bg-secondary bg-semantic-bg-secondary text-semantic-text-inverted [--tooltip-arrow-fill:var(--semantic-bg-secondary)]")
      )}
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
              ? "fill-[var(--tooltip-arrow-fill)]"
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
        "variant",
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
            "Brief contextual help on hover, keyboard focus or touch. Keeps the v1 primitive composition, Radix controls and native trigger events.",
          changes: [
            [
              "Surface",
              "Dark primary, inverted text",
              "Neutral near-black, inverted text; optional light surface",
            ],
            ["Padding", "6px / 12px", "8px / 12px inside a 1px edge"],
            [
              "Typography",
              "Inherited 12px",
              "12px regular, 20px line height; optional medium title",
            ],
            ["Corners", "6px", "6px"],
            ["Maximum width", "320px", "240px"],
            [
              "Offset and delay",
              "4px / 700ms",
              "Same defaults; Provider and individual delay overrides remain available",
            ],
            [
              "Interaction",
              "Hover, keyboard focus, Escape and touch toggle",
              "Same entry points; touch callbacks and native link/form actions are retained",
            ],
          ],
          tokens: [
            ["Dark surface", "--semantic-bg-secondary", "#0C0F12", "#0C0F12"],
            ["Dark text", "--semantic-text-inverted", "#FFFFFF", "#FFFFFF"],
            ["Light surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Light text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Light border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Font", "--font-v2", "Inherited v2 font, 400 / 500"],
            ["Corners", "6px literal", "6px"],
            ["Shadow", "--shadow-md", "Theme-provided floating shadow"],
          ],
          guidance:
            "Use TooltipProvider around triggers. Label icon-only buttons and keep help brief. Overview opts into a 250ms delay and has working pin/archive actions; the component default remains 700ms. TooltipContent adds variant=light for dark contexts, while className remains available. When a custom class changes the bubble color, give TooltipArrow a matching fill class or set --tooltip-arrow-fill on TooltipContent. Ordinary tooltips contain supporting text; use a popover for new interactive help. Usage retains the existing labelled tour composition with Next, Skip and dismissal controls. Reduced motion removes scale, travel and animation without requiring global v2 keyframes.",
        }),
      },
    },
  },
  args: {
    open: false,
    delayDuration: 250,
    side: "top",
    align: "center",
    sideOffset: 4,
    triggerLabel: "Hover or focus me",
    tooltipText: "View conversation details.",
    title: "Conversation details",
    rich: false,
    showArrow: true,
    variant: "default",
    step: 1,
    onOpenChange: fn(),
    onNext: fn(),
    onSkip: fn(),
  },
  decorators: [
    (Story, context) => (
      <TooltipProvider delayDuration={context.args.delayDuration}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    return (
      <div className="flex max-w-full flex-col items-center gap-4 p-10">
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
            variant={args.variant}
            aria-label={(args.rich ? args.title + ". " : "") + args.tooltipText}
          >
            {tooltipCopy(args)}
            {args.showArrow && <TooltipArrow />}
          </TooltipContent>
        </Tooltip>
        <p className="m-0 text-xs text-semantic-text-muted" role="status">
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
    variant: {
      control: "radio",
      options: ["default", "light"],
      description: "Neutral dark help, or a light surface for a dark context.",
      table: { category: "TooltipContent" },
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

export const Overview: Story = {
  args: {
    triggerLabel: "Assignment help",
    tooltipText: "Choose one teammate to own this conversation.",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    const [pinned, setPinned] = React.useState(false);
    const [archived, setArchived] = React.useState(false);
    const [result, setResult] = React.useState("No changes yet.");
    return (
      <section
        aria-label="Conversation controls"
        className="w-[400px] max-w-full rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-5 text-semantic-text-primary"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="m-0 text-sm font-medium">Priya Sharma</p>
            <p className="m-0 mt-1 text-xs text-semantic-text-muted">
              Delivery update · assigned to you
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-semantic-bg-ui px-2 py-1 text-xs text-semantic-text-secondary">
            {archived ? "Archived" : "Open"}
          </span>
        </div>
        <p className="m-0 my-5 text-sm leading-5 text-semantic-text-secondary">
          Could you share the updated delivery date for my order?
        </p>
        <div
          aria-label="Conversation actions"
          className="flex items-center gap-2 border-t border-solid border-semantic-border-layout pt-3"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={pinned ? "Unpin conversation" : "Pin conversation"}
                aria-pressed={pinned}
                onClick={() => {
                  setPinned(!pinned);
                  setResult(
                    pinned ? "Conversation unpinned." : "Conversation pinned."
                  );
                }}
              >
                <Pin aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              variant={args.variant}
              side={args.side}
              sideOffset={args.sideOffset}
            >
              {pinned ? "Unpin conversation" : "Pin conversation"}
              {args.showArrow && <TooltipArrow />}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={
                  archived ? "Restore conversation" : "Archive conversation"
                }
                onClick={() => {
                  setArchived(!archived);
                  setResult(
                    archived
                      ? "Conversation restored."
                      : "Conversation archived."
                  );
                }}
              >
                <Archive aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              variant={args.variant}
              side={args.side}
              sideOffset={args.sideOffset}
            >
              {archived ? "Restore conversation" : "Archive conversation"}
              {args.showArrow && <TooltipArrow />}
            </TooltipContent>
          </Tooltip>
          <Tooltip
            open={args.open}
            delayDuration={args.delayDuration}
            onOpenChange={(open) => {
              args.onOpenChange?.(open);
              updateArgs({ open });
            }}
          >
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={args.triggerLabel}
              >
                <Info aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              variant={args.variant}
              side={args.side}
              align={args.align}
              sideOffset={args.sideOffset}
              aria-label={
                (args.rich ? args.title + ". " : "") + args.tooltipText
              }
            >
              {tooltipCopy(args)}
              {args.showArrow && <TooltipArrow />}
            </TooltipContent>
          </Tooltip>
          <span className="ml-auto text-xs text-semantic-text-muted">
            3 actions
          </span>
        </div>
        <p role="status" className="m-0 mt-3 text-xs text-semantic-text-muted">
          {result}
        </p>
      </section>
    );
  },
};
export const Default: Story = {};
export const Light: Story = { args: { variant: "light" } };
export const WithTitle: Story = { args: { rich: true } };
export const WithoutArrow: Story = { args: { showArrow: false } };
export const Bottom: Story = { args: { side: "bottom" } };
export const Left: Story = { args: { side: "left" } };
export const Right: Story = { args: { side: "right" } };
export const LongContent: Story = {
  args: {
    rich: true,
    tooltipText:
      "Use filters to narrow the inbox by assignee, unread status or conversation type. Long content wraps within the 240px maximum width.",
  },
};

const INLINE_CONTROLS = ["open", "delayDuration"];
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE_CONTROLS, "variant"],
      "Compare neutral dark help and the optional light surface. Text, title, trigger, side, alignment, offset and arrow controls remain live. Inline samples do not open overlays."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[720px] grid-cols-2 items-start gap-8">
        {(["default", "light"] as const).map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-4">
            <span className="text-xs font-normal text-semantic-text-muted">
              {variant === "light" ? "Light" : "Default"}
            </span>
            <InlineTooltip {...args} variant={variant} />
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
            className="text-xs font-normal text-semantic-text-muted"
          >
            {side}
          </span>
        ))}
        {OFFSETS.map((sideOffset) => (
          <React.Fragment key={sideOffset}>
            <span className="text-xs font-normal text-semantic-text-muted">
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
            <span className="text-xs font-normal text-semantic-text-muted">
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
            <span className="text-xs font-normal text-semantic-text-muted">
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
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [result, setResult] = React.useState("Tour not started.");
  const step = Math.max(1, Math.min(3, Math.round(args.step)));
  const setOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  return (
    <div className="flex w-[520px] max-w-full flex-col items-center gap-6 rounded-xl border border-solid border-semantic-border-layout p-16 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1 text-center">
        <p className="m-0 text-base font-medium text-semantic-text-primary">
          Inbox tour
        </p>
        <p className="m-0 text-xs text-semantic-text-muted">
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
            ref={triggerRef}
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
          variant={args.variant}
          role="dialog"
          aria-label={args.title + " — step " + step}
          aria-labelledby={titleId}
          onEscapeKeyDown={() => setOpen(false)}
          onPointerDownOutside={(event) => {
            if (
              triggerRef.current?.contains(
                event.detail.originalEvent.target as Node
              )
            )
              event.preventDefault();
            else setOpen(false);
          }}
          className="w-[320px] max-w-[calc(100vw-2rem)]"
        >
          <div className="flex flex-col gap-1.5">
            <p id={titleId} className="m-0 text-xs font-medium">
              {args.title}
            </p>
            <p className="m-0 text-xs leading-4">{args.tooltipText}</p>
            <p className="m-0 text-xs text-semantic-text-muted">
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
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
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
        "variant",
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

export const Keyboard: Story = {
  args: {
    triggerLabel: "Keyboard help",
    tooltipText:
      "Tab opens this help immediately. Escape closes it and keeps focus on the button.",
  },
};

export const Touch: Story = {
  args: {
    triggerLabel: "Tap for help",
    tooltipText: "Tap again, tap outside or press Escape to dismiss this help.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "On a device with no hover, tapping toggles the help. The same trigger still receives keyboard focus and keeps native click behavior.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    return (
      <div className="flex max-w-full flex-wrap items-center justify-center gap-4 p-4">
        <Tooltip
          open={args.open}
          onOpenChange={(open) => {
            args.onOpenChange?.(open);
            updateArgs({ open });
          }}
        >
          <TooltipTrigger asChild>
            <Button type="button" variant="outline">
              {args.triggerLabel}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            variant={args.variant}
            side={args.side}
            sideOffset={args.sideOffset}
          >
            {args.tooltipText}
            {args.showArrow && <TooltipArrow />}
          </TooltipContent>
        </Tooltip>
        <Button type="button" variant="ghost">
          Outside action
        </Button>
        <p
          role="status"
          className="m-0 w-full text-center text-xs text-semantic-text-muted"
        >
          Tooltip is {args.open ? "open" : "closed"}
        </p>
      </div>
    );
  },
};

export const NativeEvents: Story = {
  parameters: { controls: { include: ["variant", "showArrow"] } },
  render: function Render(args) {
    const [submits, setSubmits] = React.useState(0);
    const [changes, setChanges] = React.useState<boolean[]>([]);
    const [cancelled, setCancelled] = React.useState(false);
    return (
      <div className="flex max-w-full flex-col items-center gap-4 p-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmits((count) => count + 1);
          }}
        >
          <Tooltip
            onOpenChange={(next) =>
              setChanges((previous) => [...previous, next])
            }
          >
            <TooltipTrigger asChild>
              <Button type="submit" variant="outline">
                Submit local form
              </Button>
            </TooltipTrigger>
            <TooltipContent variant={args.variant}>
              The form still receives its submit event.
              {args.showArrow && <TooltipArrow />}
            </TooltipContent>
          </Tooltip>
        </form>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="text-sm text-semantic-text-link underline"
              href="#assignment"
            >
              Assignment link
            </a>
          </TooltipTrigger>
          <TooltipContent variant={args.variant}>
            The link keeps its native destination.
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              onClick={(event) => {
                event.preventDefault();
                setCancelled(true);
              }}
            >
              Cancel tooltip click
            </Button>
          </TooltipTrigger>
          <TooltipContent variant={args.variant}>
            A cancelled click does not toggle touch help.
          </TooltipContent>
        </Tooltip>
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          Submits: {submits}; changes:{" "}
          {changes.map((open) => (open ? "open" : "closed")).join(", ") ||
            "none"}
          ; cancelled: {cancelled ? "yes" : "no"}
        </p>
      </div>
    );
  },
};

export const InDialog: Story = {
  args: {
    triggerLabel: "Assignment help",
    tooltipText:
      "Assignment keeps one teammate responsible for the conversation.",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();
    return (
      <ModalRoot>
        <ModalTrigger asChild>
          <Button type="button" variant="outline">
            Open assignment dialog
          </Button>
        </ModalTrigger>
        <ModalContent size="sm">
          <ModalTitle>Assign conversation</ModalTitle>
          <ModalDescription>
            Press Escape while help is open to dismiss the tooltip. Press it
            again to close the dialog.
          </ModalDescription>
          <Button type="button" variant="outline">
            Keep dialog open
          </Button>
          <Tooltip
            open={args.open}
            delayDuration={args.delayDuration}
            onOpenChange={(open) => {
              args.onOpenChange?.(open);
              updateArgs({ open });
            }}
          >
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                leftIcon={<Info aria-hidden />}
              >
                {args.triggerLabel}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              variant={args.variant}
              side={args.side}
              sideOffset={args.sideOffset}
            >
              {args.tooltipText}
              {args.showArrow && <TooltipArrow />}
            </TooltipContent>
          </Tooltip>
        </ModalContent>
      </ModalRoot>
    );
  },
};
