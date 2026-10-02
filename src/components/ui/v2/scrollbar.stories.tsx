import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useArgs } from "storybook/preview-api";
import { Scrollbar, type ScrollbarProps } from "./scrollbar";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = ScrollbarProps & { itemCount: number };
function Items({
  orientation,
  itemCount,
  selected,
  onSelect,
}: {
  orientation?: "vertical" | "horizontal";
  itemCount: number;
  selected?: number;
  onSelect?: (n: number) => void;
}) {
  return (
    <div
      className={
        orientation === "horizontal" ? "flex w-max gap-3 p-4" : "space-y-2 p-4"
      }
    >
      {Array.from({ length: Math.max(1, Math.min(80, itemCount)) }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={selected === i}
          onClick={() => onSelect?.(i)}
          className={`flex rounded-lg border border-solid border-semantic-border-layout p-3 text-left text-sm hover:bg-semantic-bg-hover ${orientation === "horizontal" ? "w-40 shrink-0 flex-col gap-2" : "w-full items-center justify-between"}`}
        >
          <span>Contact {i + 1}</span>
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            Available
          </span>
        </button>
      ))}
    </div>
  );
}
function ScrollExample(args: Args) {
  const [selected, setSelected] = useState<number>();
  return (
    <section className="w-[460px] max-w-full space-y-3">
      <Scrollbar
        orientation={args.orientation}
        variant={args.variant}
        showControls={args.showControls}
        className={
          args.orientation === "horizontal"
            ? "h-40 rounded-lg border border-solid border-semantic-border-layout"
            : "h-72 rounded-lg border border-solid border-semantic-border-layout"
        }
      >
        <Items
          orientation={args.orientation}
          itemCount={args.itemCount}
          selected={selected}
          onSelect={setSelected}
        />
      </Scrollbar>
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
        {selected === undefined
          ? "Scroll or use the arrow controls, then select a contact."
          : `Selected contact ${selected + 1}`}
      </p>
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
            "A native scroll viewport with the v2 rail, draggable thumb and optional arrow controls.",
          changes: [
            ["Rail", "—", "16px wide/high"],
            ["Thumb", "—", "8px wide/high; 8px corners"],
            ["Arrow controls", "—", "32px along the scroll axis"],
            [
              "Variants",
              "—",
              "White subtle rail or grey rail with a 1px divider",
            ],
          ],
          tokens: [
            ["Thumb", "--semantic-text-placeholder", "#A2A6B1", "#A2A6B1"],
            ["Dark rail", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
          ],
          guidance:
            "Set a bounded height for vertical scrolling. The viewport keeps native wheel, touch and keyboard scrolling. Arrow controls stop at the boundaries; thumb length follows content and is clamped to the available track.",
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
  render: (args) => <ScrollExample {...args} />,
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
    "Two fixed rail styles; orientation, controls and content length apply to both."
  ),
  render: (args) => (
    <div className="grid w-[980px] max-w-full gap-6 lg:grid-cols-2">
      {(["dark", "subtle"] as const).map((variant) => (
        <section key={variant} className="min-w-0 space-y-3">
          <h3 className="m-0 text-base font-medium capitalize">{variant}</h3>
          <ScrollExample {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["itemCount"],
    "A long list and a list that fits. Orientation, variant and controls are editable."
  ),
  render: (args) => (
    <div className="grid w-[980px] max-w-full gap-6 lg:grid-cols-2">
      {[12, 1].map((itemCount) => (
        <section key={itemCount} className="space-y-3">
          <h3 className="m-0 text-base font-medium">
            {itemCount === 1 ? "Fits in the viewport" : "Scrollable content"}
          </h3>
          <ScrollExample {...args} itemCount={itemCount} />
        </section>
      ))}
    </div>
  ),
};
function Directory(args: Args & { onCountChange: (count: number) => void }) {
  const count = args.itemCount;
  return (
    <section className="w-[460px] max-w-full space-y-4">
      <div>
        <h3 className="m-0 text-base font-medium">Team directory</h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Loading more items updates the thumb size.
        </p>
      </div>
      <ScrollExample {...args} itemCount={count} />
      <Button
        variant="outline"
        onClick={() => args.onCountChange(Math.min(80, count + 5))}
        disabled={count >= 80}
      >
        Load five more
      </Button>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "A directory with working selection and load more. Loading items stays synchronized with itemCount Controls."
  ),
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <Directory
        {...args}
        onCountChange={(itemCount) => updateArgs({ itemCount })}
      />
    );
  },
};
