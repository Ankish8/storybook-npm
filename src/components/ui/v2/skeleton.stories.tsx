import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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
    controls: { include: ["variant", "shape", "width", "height"] },
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
          ],
          tokens: [
            ["Default", "--semantic-bg-grey", "E9EAEB", "#E9EAEB"],
            ["Subtle", "--semantic-bg-ui", "F5F5F5", "#F5F5F5"],
          ],
          guidance:
            "Match shape, width and height to the content being loaded. Skeletons are hidden from screen readers; describe loading once on the parent region. Pulse animation respects reduced motion.",
        }),
      },
    },
  },
  args: { variant: "default", shape: "line", width: 240, height: 16 },
  argTypes: {
    variant: { control: "select", options: ["default", "subtle"] },
    shape: { control: "select", options: ["line", "circle", "rectangle"] },
    width: { control: { type: "number", min: 16, max: 600 } },
    height: { control: { type: "number", min: 8, max: 320 } },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Circle: Story = {
  args: { shape: "circle", width: 48, height: 48 },
};
export const Rectangle: Story = {
  args: { shape: "rectangle", width: 240, height: 120 },
};
export const Subtle: Story = { args: { variant: "subtle" } };
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
  return (
    <section className="w-[360px] max-w-full space-y-4">
      <h3 className="m-0 text-base font-medium">Account summary</h3>
      <div
        aria-busy={loading}
        className="flex items-center gap-4 rounded-lg border border-solid border-semantic-border-layout p-5"
      >
        {loading ? (
          <>
            <span className="sr-only">Loading account</span>
            <Skeleton {...args} shape="circle" width={48} height={48} />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton {...args} shape="line" width="80%" height={16} />
              <Skeleton {...args} shape="line" width="60%" height={12} />
            </div>
          </>
        ) : (
          <div>
            <h4 className="m-0 text-sm font-medium">Example account</h4>
            <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
              Your profile is ready.
            </p>
          </div>
        )}
      </div>
      <Button variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Show loaded content" : "Reload profile"}
      </Button>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["shape", "width", "height"],
    "Fixed avatar and text dimensions. Palette applies to all placeholders. Toggle between loading and content."
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
          className="min-w-0 space-y-3 rounded-lg border border-solid border-semantic-border-layout p-5"
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
