import type { Meta, StoryObj } from "@storybook/react";
import { useId, useState, type CSSProperties } from "react";
import { Skeleton } from "./skeleton";
import { Skeleton as V1 } from "../skeleton";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof Skeleton> = {
  title: "V2/Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12193",
    },
    layout: "centered",
    controls: { include: ["variant", "shape", "animation", "width", "height"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "skeleton",
          summary:
            "Loading placeholders for text, avatars and rectangular content.",
          changes: [
            [
              "Palette",
              "Semantic loading surfaces",
              "Same semantic loading surfaces",
            ],
            ["Namespace", "ui/skeleton", "ui/v2/skeleton"],
            [
              "Animation",
              "Pulse only",
              'Calm finite pulse by default; optional animation="shimmer" or "none". Animations pause offscreen and in hidden tabs.',
            ],
          ],
          tokens: [
            [
              "Default",
              "--semantic-bg-grey",
              "#E9EAEB",
              "var(--v2-semantic-bg-grey,var(--semantic-bg-grey))",
            ],
            [
              "Subtle",
              "--semantic-bg-ui",
              "#F5F5F5",
              "var(--v2-semantic-bg-ui,var(--semantic-bg-ui))",
            ],
            [
              "Shimmer highlight",
              "--semantic-bg-primary",
              "#FFFFFF",
              "color-mix(in srgb,var(--v2-semantic-bg-primary,var(--semantic-bg-primary)) 50%,transparent)",
            ],
          ],
          guidance:
            'Match shape, width and height to the content being loaded so the layout stays steady when it resolves. Skeleton blocks are decorative by default; set aria-busy on the content region and describe loading once in a status. Pulse and shimmer pause offscreen and in hidden tabs, settle after about twenty seconds, and show a static fill under reduced motion. animation="none" is always static. Native attributes, refs, styles and className remain available. Shimmer uses the existing tailwindcss-animate plugin in the consuming project.',
        }),
      },
    },
  },
  args: {
    variant: "default",
    shape: "line",
    animation: "pulse",
    width: 240,
    height: 16,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "subtle"] },
    shape: { control: "select", options: ["line", "circle", "rectangle"] },
    animation: { control: "select", options: ["pulse", "shimmer", "none"] },
    width: { control: { type: "number", min: 16, max: 600 } },
    height: { control: { type: "number", min: 8, max: 320 } },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  parameters: gallery(
    ["shape", "width", "height"],
    "A sample contact with matching placeholder and content footprints. Load contact reveals the details; Replay loading restores the placeholders. Palette and animation stay editable."
  ),
  render: (args) => <LoadingExample {...args} />,
};
export const Default: Story = {};
export const Circle: Story = {
  args: { shape: "circle", width: 48, height: 48 },
};
export const Rectangle: Story = {
  args: { shape: "rectangle", width: 240, height: 120 },
};
export const Subtle: Story = { args: { variant: "subtle" } };
export const Shimmer: Story = {
  args: { animation: "shimmer", width: 240, height: 16 },
};
export const CallerStyles: Story = {
  parameters: gallery(
    ["shape", "width", "height", "animation"],
    "Native styles set these placeholders to 65% width, 24px height and a paused 2.4s animation with a 120ms delay. The caller className rounds their corners."
  ),
  render: (args) => (
    <div className="w-[320px] max-w-full space-y-5">
      {(["pulse", "shimmer"] as const).map((animation) => (
        <section key={animation} className="space-y-2">
          <h3 className="m-0 text-sm font-medium capitalize">{animation}</h3>
          <Skeleton
            {...args}
            data-testid={animation}
            className="rounded-lg"
            animation={animation}
            shape="line"
            width={undefined}
            height={undefined}
            style={{
              width: "65%",
              height: 24,
              animationDelay: "120ms",
              animationDuration: "2.4s",
              animationPlayState: "paused",
              animationTimingFunction: "linear",
              animationIterationCount: 3,
              animationFillMode: "forwards",
            }}
          />
        </section>
      ))}
    </div>
  ),
};
export const Animations: Story = {
  parameters: gallery(
    ["variant", "animation"],
    "Pulse is the default. Shimmer sweeps a soft highlight across the placeholder; none is a static fill. Reduced motion shows the static fill for every option."
  ),
  render: (args) => (
    <div className="grid w-[640px] max-w-full gap-6 md:grid-cols-3">
      {(["pulse", "shimmer", "none"] as const).map((animation) => (
        <section
          key={animation}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-v2-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-sm font-medium capitalize">{animation}</h3>
          <div className="flex items-center gap-3">
            <Skeleton
              variant={args.variant}
              animation={animation}
              shape="circle"
              width={40}
              height={40}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton
                variant={args.variant}
                animation={animation}
                width="80%"
                height={14}
              />
              <Skeleton
                variant={args.variant}
                animation={animation}
                width="55%"
                height={12}
              />
            </div>
          </div>
          <Skeleton
            variant={args.variant}
            animation={animation}
            shape="rectangle"
            width="100%"
            height={72}
          />
        </section>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Default and subtle palette. Shape and dimensions apply to both."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {(["default", "subtle"] as const).map((variant) => (
        <section key={variant} className="space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize">{variant}</h3>
          <Skeleton {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllShapes: Story = {
  parameters: gallery(
    ["shape", "width", "height"],
    "Fixed reference dimensions demonstrate line, circle and rectangular content. Palette stays editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-8">
      {(["line", "circle", "rectangle"] as const).map((shape) => (
        <section key={shape} className="space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize">{shape}</h3>
          <Skeleton
            {...args}
            shape={shape}
            width={shape === "circle" ? 48 : 180}
            height={shape === "line" ? 16 : shape === "circle" ? 48 : 96}
          />
        </section>
      ))}
    </div>
  ),
};
function LoadingExample(args: Parameters<typeof Skeleton>[0]) {
  const [loading, setLoading] = useState(true);
  const [replay, setReplay] = useState(0);
  const headingId = useId();
  const stagger = (delay: string) =>
    ({ ...args.style, "--v2-skeleton-delay": delay }) as CSSProperties;
  return (
    <section className="w-[420px] max-w-full space-y-4 text-v2-semantic-text-primary">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={headingId} className="m-0 text-base font-medium">
          Contact details
        </h3>
        <span role="status" className="text-xs text-v2-semantic-text-muted">
          {loading ? "Loading contact" : "Contact loaded"}
        </span>
      </div>
      <article
        aria-labelledby={headingId}
        aria-busy={loading}
        className="rounded-xl border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-5"
      >
        <div
          key={loading ? replay : "content"}
          className={
            loading
              ? undefined
              : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:[animation-duration:180ms]"
          }
        >
          <div className="flex h-12 items-center gap-3">
            <div className="size-12 shrink-0">
              {loading ? (
                <Skeleton {...args} shape="circle" width={48} height={48} />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-full bg-v2-semantic-primary-surface text-sm font-medium text-v2-semantic-primary"
                >
                  PS
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex h-5 items-center">
                {loading ? (
                  <Skeleton
                    {...args}
                    style={stagger("90ms")}
                    shape="line"
                    width="58%"
                    height={16}
                  />
                ) : (
                  <h4 className="m-0 truncate text-sm font-medium leading-5">
                    Priya Shah
                  </h4>
                )}
              </div>
              <div className="flex h-4 items-center">
                {loading ? (
                  <Skeleton
                    {...args}
                    style={stagger("180ms")}
                    shape="line"
                    width="72%"
                    height={12}
                  />
                ) : (
                  <p className="m-0 truncate text-xs leading-4 text-v2-semantic-text-muted">
                    Customer success manager
                  </p>
                )}
              </div>
            </div>
          </div>
          <dl className="m-0 mt-5 grid gap-4 border-0 border-t border-solid border-v2-semantic-border-layout pt-4">
            {[
              ["Email", "priya.shah@example.com", "82%"],
              ["Team", "Customer success", "62%"],
            ].map(([label, value, width], index) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs font-normal leading-4 text-v2-semantic-text-muted">
                  {label}
                </dt>
                <dd className="m-0 mt-2 flex h-5 items-center text-sm leading-5">
                  {loading ? (
                    <Skeleton
                      {...args}
                      style={stagger(index === 0 ? "270ms" : "360ms")}
                      shape="line"
                      width={width}
                      height={16}
                    />
                  ) : (
                    <span className="truncate">{value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setLoading(false)}>Load contact</Button>
        <Button
          variant="outline"
          onClick={() => {
            setReplay((value) => value + 1);
            setLoading(true);
          }}
        >
          Replay loading
        </Button>
      </div>
      <p className="m-0 text-xs leading-5 text-v2-semantic-text-muted">
        Sample contact. Load contact reveals the details immediately.
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["shape", "width", "height"],
    "Fixed contact and text dimensions. Palette and animation apply to all placeholders. Load the sample contact or replay the loading state."
  ),
  render: (args) => <LoadingExample {...args} />,
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-6 md:grid-cols-2">
      {["v1", "v2"].map((version) => (
        <section
          key={version}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-v2-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-base font-medium">{version}</h3>
          <div className="max-w-full overflow-x-auto">
            {version === "v1" ? <V1 {...args} /> : <Skeleton {...args} />}
          </div>
        </section>
      ))}
    </div>
  ),
};
