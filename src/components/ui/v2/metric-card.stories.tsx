import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCw } from "lucide-react";
import { MetricCard, type MetricCardProps } from "./metric-card";
import { cn } from "@/lib/utils";

const periods = [
  {
    label: "7 days",
    multiplier: 1,
    previousCalls: 1144,
    missed: 74,
    previousMissed: 91,
    points: [142, 171, 154, 196, 181, 221, 221],
  },
  {
    label: "30 days",
    multiplier: 4.15,
    previousCalls: 4869,
    missed: 336,
    previousMissed: 359,
    points: [162, 171, 184, 168, 196, 179, 204],
  },
  {
    label: "90 days",
    multiplier: 12.4,
    previousCalls: 14503,
    missed: 1180,
    previousMissed: 1094,
    points: [143, 155, 142, 172, 166, 184, 192],
  },
] as const;
const sampleOffsets = [0, 12, 25, 18] as const;

function SampleSparkline({
  points,
  label,
}: {
  points: readonly number[];
  label: string;
}) {
  const min = Math.min(...points);
  const range = Math.max(...points) - min || 1;
  const coordinates = points
    .map(
      (point, index) =>
        4 +
        (index / (points.length - 1)) * 232 +
        "," +
        (36 - ((point - min) / range) * 30)
    )
    .join(" ");
  return (
    <svg
      role="img"
      aria-label={label}
      focusable="false"
      viewBox="0 0 240 40"
      className="h-10 w-full text-semantic-primary"
    >
      <polyline
        points={coordinates}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MetricCardHero({ args }: { args: MetricCardProps }) {
  const [periodIndex, setPeriodIndex] = React.useState(0);
  const [sampleIndex, setSampleIndex] = React.useState(0);
  const period = periods[periodIndex];
  const offset = sampleOffsets[sampleIndex];
  const base =
    typeof args.value === "number" && Number.isFinite(args.value)
      ? Math.max(0, args.value)
      : 1286;
  const calls = Math.round(base * period.multiplier) + offset;
  const missed = Math.min(
    calls,
    Math.max(0, period.missed - Math.round(offset / 3))
  );
  const answerRate = calls > 0 ? ((calls - missed) / calls) * 100 : 0;
  const answered = answerRate.toFixed(1);
  const answerChange = (
    answerRate -
    ((period.previousCalls - period.previousMissed) / period.previousCalls) *
      100
  ).toFixed(1);
  const callChange = ((calls / period.previousCalls - 1) * 100).toFixed(1);
  const missedChange = ((missed / period.previousMissed - 1) * 100).toFixed(1);
  const comparison = "Compared with the previous " + period.label;

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]">
            Call performance
          </p>
          <p className="m-0 text-xs leading-5 text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            Local sample data · select a period or update the sample.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Sample period"
            className="flex rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1"
          >
            {periods.map((item, index) => (
              <button
                type="button"
                key={item.label}
                aria-pressed={periodIndex === index}
                className={cn(
                  "rounded-md border-0 bg-transparent px-2.5 py-1.5 text-xs font-medium text-[var(--v2-text-secondary,var(--semantic-text-secondary))] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-border-focus",
                  periodIndex === index &&
                    "bg-semantic-bg-ui text-[var(--v2-text-primary,var(--semantic-text-primary))]"
                )}
                onClick={() => setPeriodIndex(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setSampleIndex((current) => (current + 1) % sampleOffsets.length)
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary px-3 py-2 text-xs font-medium text-[var(--v2-text-secondary,var(--semantic-text-secondary))] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-border-focus"
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            Update sample
          </button>
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          {...args}
          value={typeof args.value === "string" ? args.value : calls}
          comparison={comparison}
          trend={{
            change:
              (calls >= period.previousCalls ? "+" : "") + callChange + "%",
            direction: calls >= period.previousCalls ? "up" : "down",
            tone: "neutral",
          }}
          graphic={
            <SampleSparkline
              points={period.points.map((point, index) =>
                index === period.points.length - 1 ? point + offset : point
              )}
              label="Sample inbound call volume over seven intervals"
            />
          }
        />
        <MetricCard
          variant={args.variant}
          size={args.size}
          animateValue={args.animateValue}
          label="Answer rate"
          value={answered}
          suffix="%"
          comparison={comparison}
          trend={{
            change:
              (Number(answerChange) >= 0 ? "+" : "") + answerChange + " pts",
            direction: Number(answerChange) >= 0 ? "up" : "down",
            tone: Number(answerChange) >= 0 ? "positive" : "negative",
          }}
        >
          Answered calls ÷ all inbound calls
        </MetricCard>
        <MetricCard
          variant={args.variant}
          size={args.size}
          animateValue={args.animateValue}
          label="Missed calls"
          value={missed}
          comparison={comparison}
          trend={{
            change:
              (missed >= period.previousMissed ? "+" : "") + missedChange + "%",
            direction: missed >= period.previousMissed ? "up" : "down",
            tone: missed >= period.previousMissed ? "negative" : "positive",
          }}
        >
          A lower count is better
        </MetricCard>
      </div>
      <p className="m-0 text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
        Sample {sampleIndex + 1} of {sampleOffsets.length} · values update
        locally. Connect your own data in a product screen.
      </p>
    </div>
  );
}

function BreakdownExample(args: MetricCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const detailsId = React.useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <MetricCard {...args}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((current) => !current)}
          className="rounded border-0 bg-transparent p-0 text-sm font-medium text-semantic-text-link underline-offset-4 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-border-focus"
        >
          {expanded ? "Hide breakdown" : "View breakdown"}
        </button>
      </MetricCard>
      <div id={detailsId} hidden={!expanded}>
        <p className="m-0 text-sm text-[var(--v2-text-secondary,var(--semantic-text-secondary))]">
          Sample breakdown: 892 answered by agents, 320 handled by call flows,
          74 missed.
        </p>
      </div>
    </div>
  );
}

const meta: Meta<typeof MetricCard> = {
  title: "V2/Components/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  args: {
    label: "Inbound calls",
    value: 1286,
    comparison: "Compared with the previous 7 days",
    trend: { change: "+12.4%", direction: "up", tone: "neutral" },
    variant: "default",
    size: "default",
    animateValue: true,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `A compact metric summary with a readable value, comparison, optional trend, and a small graphic or footer slot. This is a new v2 component; there is no v1 Metric Card to migrate.

\`\`\`bash
npx myoperator-ui add v2-metric-card
\`\`\`

\`\`\`tsx
import { MetricCard } from "@/components/ui/v2/metric-card";
\`\`\`

## Design Tokens

| Purpose | CSS variable | Preview |
| --- | --- | --- |
| Surface | --semantic-bg-primary | <span style="display:inline-block;width:18px;height:18px;background:var(--semantic-bg-primary);border:1px solid var(--semantic-border-layout)"></span> |
| Subtle surface | --semantic-bg-ui | <span style="display:inline-block;width:18px;height:18px;background:var(--semantic-bg-ui)"></span> |
| Border | --semantic-border-layout | <span style="display:inline-block;width:18px;height:18px;background:var(--semantic-border-layout)"></span> |
| Positive trend | --semantic-success-surface / --semantic-success-text | <span style="display:inline-block;width:18px;height:18px;background:var(--semantic-success-surface);border:1px solid var(--semantic-success-text)"></span> |
| Negative trend | --semantic-error-surface / --semantic-error-text | <span style="display:inline-block;width:18px;height:18px;background:var(--semantic-error-surface);border:1px solid var(--semantic-error-text)"></span> |

The card stays still on hover. Changed values settle for 180ms and stop immediately when reduced motion is enabled. Set animateValue={false} to keep updates still. Values are not announced automatically; opt into aria-live="polite" when the update is useful to announce. A directional change also contains screen reader text, so color is supplementary. Trend tone is neutral unless you choose positive or negative; a decrease can be a positive result.

The hero uses local sample call metrics. Period controls and Update sample do not query a backend. For layouts without metric semantics, use Card. Inspired by [Arc Metric card](https://uiarc.dev/components/metric-card), with card composition checked against [HeroUI](https://heroui.com/en/docs/react/components/card) and [shadcn/ui](https://ui.shadcn.com/docs/components/base/card).`,
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "number", min: 0, step: 1 } },
    suffix: { control: "text" },
    comparison: { control: "text" },
    trend: { control: "object" },
    graphic: { control: false },
    children: { control: false },
    variant: { control: "select", options: ["default", "subtle"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    animateValue: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: (args) => <MetricCardHero args={args} />,
  parameters: {
    controls: {
      include: ["label", "value", "variant", "size", "animateValue"],
    },
  },
};

export const Default: Story = {};
export const Subtle: Story = { args: { variant: "subtle" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <MetricCard {...args} variant="default" label="Default surface" />
      <MetricCard {...args} variant="subtle" label="Subtle surface" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="grid w-full max-w-4xl items-start gap-4 sm:grid-cols-3">
      <MetricCard {...args} size="sm" label="Small" />
      <MetricCard {...args} size="default" label="Default" />
      <MetricCard {...args} size="lg" label="Large" />
    </div>
  ),
};

export const LowerIsBetter: Story = {
  args: {
    label: "Missed calls",
    value: 74,
    trend: { change: "−18.7%", direction: "down", tone: "positive" },
  },
};

export const FormattedValues: Story = {
  render: (args) => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      <MetricCard {...args} label="Monthly revenue" value="₹24,500" />
      <MetricCard
        {...args}
        label="Average wait"
        value="2m 18s"
        trend={{ change: "−12s", direction: "down", tone: "positive" }}
      />
      <MetricCard
        {...args}
        label="Service uptime"
        value={99.9}
        suffix="%"
        trend={{ change: "0.0 pts", direction: "flat" }}
      />
    </div>
  ),
};

export const WithGraphic: Story = {
  args: {
    graphic: (
      <SampleSparkline
        points={periods[0].points}
        label="Sample inbound call volume over seven days"
      />
    ),
  },
};

export const WithAction: Story = {
  render: (args) => <BreakdownExample {...args} />,
};

export const Keyboard: Story = {
  render: (args) => <BreakdownExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Tab to View breakdown, then use Enter or Space. The card itself is a static group and never adds an extra tab stop.",
      },
    },
  },
};

export const NoMotion: Story = {
  args: { animateValue: false },
  render: (args) => <MetricCardHero args={args} />,
};

export const LongContent: Story = {
  args: {
    label: "Inbound conversations routed to the customer success team",
    value: "1,286 conversations",
    comparison:
      "Compared with the previous reporting period. Labels and supporting text wrap at narrow widths.",
    trend: { change: "+12.4%", direction: "up" },
  },
  render: (args) => <MetricCard {...args} className="w-full max-w-xs" />,
};
