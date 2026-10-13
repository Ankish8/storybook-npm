import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Activity, ArrowUpRight, Plus } from "lucide-react";
import { Scrollbar, type ScrollbarProps } from "./scrollbar";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = ScrollbarProps & { itemCount: number };
const updates = [
  {
    person: "Priya Sharma",
    initials: "PS",
    action: "resolved",
    subject: "Delivery follow-up",
    time: "2 min ago",
    detail: "The customer confirmed their order arrived.",
  },
  {
    person: "Arjun Mehta",
    initials: "AM",
    action: "assigned",
    subject: "Billing question",
    time: "8 min ago",
    detail: "Assigned to the accounts team for a refund check.",
  },
  {
    person: "Neha Kapoor",
    initials: "NK",
    action: "replied to",
    subject: "Plan upgrade",
    time: "14 min ago",
    detail: "Shared the plan comparison and the next steps.",
  },
  {
    person: "Rohan Shah",
    initials: "RS",
    action: "added a note to",
    subject: "Onboarding call",
    time: "22 min ago",
    detail: "The team will join a guided walkthrough tomorrow.",
  },
  {
    person: "Meera Rao",
    initials: "MR",
    action: "closed",
    subject: "Account access",
    time: "31 min ago",
    detail: "The customer signed in successfully after the reset.",
  },
  {
    person: "Kabir Singh",
    initials: "KS",
    action: "tagged",
    subject: "Product feedback",
    time: "45 min ago",
    detail: "Saved the feedback for the next product review.",
  },
];

function ActivityItems({
  orientation,
  itemCount,
  selected,
  onSelect,
}: {
  orientation?: "vertical" | "horizontal";
  itemCount: number;
  selected?: number;
  onSelect: (index: number) => void;
}) {
  const horizontal = orientation === "horizontal";
  return (
    <ol
      className={cn(
        "m-0 list-none p-3",
        horizontal ? "flex w-max gap-3" : "space-y-1"
      )}
    >
      {Array.from(
        { length: Math.max(1, Math.min(80, itemCount)) },
        (_, index) => {
          const update = updates[index % updates.length];
          return (
            <li
              key={index}
              className={horizontal ? "w-60 shrink-0" : "min-w-0"}
            >
              <button
                type="button"
                aria-pressed={selected === index}
                aria-label={`View activity ${index + 1}: ${update.subject}`}
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full gap-3 rounded-lg border border-solid p-3 text-left text-sm transition-colors [transition-duration:160ms] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-semantic-primary [@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-hover",
                  horizontal
                    ? "h-full flex-col border-semantic-border-layout"
                    : "items-start border-transparent",
                  selected === index &&
                    "border-semantic-border-layout bg-semantic-bg-ui"
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-semantic-primary-surface text-xs font-medium text-semantic-text-secondary"
                >
                  {update.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-5 text-semantic-text-primary">
                    <span className="font-medium">{update.person}</span>{" "}
                    {update.action}
                  </span>
                  <span className="mt-0.5 block font-medium leading-5 text-semantic-text-secondary">
                    {update.subject}
                  </span>
                  <span className="mt-1 block text-xs leading-4 text-semantic-text-muted">
                    {update.time}
                  </span>
                </span>
                {!horizontal && (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-3.5 shrink-0 text-semantic-text-muted"
                  />
                )}
              </button>
            </li>
          );
        }
      )}
    </ol>
  );
}

function ActivityFeed(args: Args & { height?: string }) {
  const [selected, setSelected] = useState<number>();
  const [added, setAdded] = useState(0);
  const count = Math.min(80, args.itemCount + added);
  const selectedUpdate =
    selected === undefined ? undefined : updates[selected % updates.length];
  return (
    <section className="w-[520px] max-w-full overflow-hidden rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-solid border-semantic-border-layout px-4 py-4">
        <div className="flex items-center gap-2.5">
          <Activity
            className="size-4 text-semantic-text-muted"
            aria-hidden="true"
          />
          <div>
            <h3 className="m-0 text-sm font-medium text-semantic-text-primary">
              Recent activity
            </h3>
            <p className="m-0 mt-0.5 text-xs text-semantic-text-muted">
              Support workspace · {count} updates
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={count >= 80}
          onClick={() => setAdded((value) => value + 3)}
        >
          <Plus className="size-3.5" aria-hidden="true" /> Add updates
        </Button>
      </header>
      <Scrollbar
        orientation={args.orientation}
        variant={args.variant}
        showControls={args.showControls}
        dir={args.dir}
        aria-label="Recent support activity"
        className={cn(
          args.orientation === "horizontal" ? "h-56" : "h-[320px]",
          args.height
        )}
      >
        <ActivityItems
          orientation={args.orientation}
          itemCount={count}
          selected={selected}
          onSelect={setSelected}
        />
      </Scrollbar>
      <footer className="min-h-16 border-t border-solid border-semantic-border-layout px-4 py-3">
        <p
          role="status"
          className="m-0 text-xs leading-5 text-semantic-text-muted"
        >
          {selectedUpdate
            ? selectedUpdate.detail
            : "Scroll to review earlier updates. Select an activity to see its details."}
        </p>
      </footer>
    </section>
  );
}

const meta: Meta<Args> = {
  title: "V2/Components/Scrollbar",
  component: Scrollbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["orientation", "variant", "showControls", "itemCount"],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "scrollbar",
          hasV1: false,
          summary:
            "A native scroll viewport with a draggable, keyboard-accessible rail and optional arrow controls.",
          changes: [
            [
              "Rail",
              "—",
              "Subtle: 11px overlay without controls, 16px with controls; dark: 16px solid rail",
            ],
            [
              "Thumb",
              "—",
              "5px pill, 7px on hover or drag, 28px minimum, proportional to the content",
            ],
            [
              "Keyboard",
              "—",
              "Visible on focus; arrow keys, Home, End, Page Up and Page Down operate the viewport and rail",
            ],
            [
              "Native scrolling",
              "—",
              "Wheel and touch remain native; horizontal wheel conversion respects cancellation, RTL and page chaining at the edges",
            ],
          ],
          tokens: [
            [
              "Thumb (30%, active 46%)",
              "--semantic-text-primary",
              "#181D27",
              "#181D27",
            ],
            ["Dark rail", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Keyboard focus", "--semantic-primary", "#343E55", "#343E55"],
          ],
          guidance:
            "Set a bounded height for vertical scrolling, or a bounded width with a wide child for horizontal scrolling. className, style, native attributes and the forwarded HTMLDivElement ref apply to the outer container; onScroll receives the viewport event. The subtle rail appears on fine-pointer hover, keyboard focus, scrolling and dragging, then fades after 900ms. Content that fits hides the subtle rail and removes its controls from the tab order. There is no v1 Scrollbar export to migrate.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2284-50242",
    },
  },
  args: {
    orientation: "vertical",
    variant: "subtle",
    showControls: true,
    itemCount: 12,
  },
  argTypes: {
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    variant: { control: "radio", options: ["dark", "subtle"] },
    showControls: { control: "boolean" },
    itemCount: {
      control: { type: "range", min: 1, max: 80, step: 1 },
      table: { category: "Example" },
    },
  },
  render: (args) => <ActivityFeed {...args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Dark: Story = { args: { variant: "dark" } };
export const Horizontal: Story = { args: { orientation: "horizontal" } };
export const WithoutControls: Story = { args: { showControls: false } };
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Two rail styles share the same native viewport and accessible controls."
  ),
  render: (args) => (
    <div className="grid w-[1080px] max-w-full gap-6 lg:grid-cols-2">
      {(["subtle", "dark"] as const).map((variant) => (
        <section key={variant} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize text-semantic-text-primary">
            {variant}
          </h3>
          <ActivityFeed {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    [],
    "Container height sets the viewport size; no separate size prop is needed."
  ),
  render: (args) => (
    <div className="grid w-[1080px] max-w-full gap-6 lg:grid-cols-2">
      <ActivityFeed {...args} height="h-48" />
      <ActivityFeed {...args} height="h-96" />
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["itemCount"],
    "The rail appears only for overflow. A single activity fits without scrolling."
  ),
  render: (args) => (
    <div className="grid w-[1080px] max-w-full gap-6 lg:grid-cols-2">
      {[12, 1].map((itemCount) => (
        <section key={itemCount} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium text-semantic-text-primary">
            {itemCount === 1 ? "Content fits" : "Content overflows"}
          </h3>
          <ActivityFeed {...args} itemCount={itemCount} />
        </section>
      ))}
    </div>
  ),
};
export const KeyboardScrolling: Story = {
  parameters: gallery(
    [],
    "Tab into the viewport or rail. Use Home, End, Page Up, Page Down or the arrow keys."
  ),
  render: (args) => (
    <div className="max-w-full space-y-3">
      <p className="m-0 text-xs text-semantic-text-muted">
        Focus the activity list, then press End to jump to the oldest update.
      </p>
      <ActivityFeed {...args} />
    </div>
  ),
};
export const RightToLeft: Story = {
  args: { orientation: "horizontal", dir: "rtl" },
};
export const Usage: Story = {
  parameters: gallery(
    [],
    "Select an update to inspect it. Add updates to see the thumb resize as the content grows."
  ),
};
