import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { ImageMedia, type ImageMediaProps } from "./image-media";
import { ImageMedia as ImageV1 } from "../image-media";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="#ECF1FB"/><rect x="184" y="68" width="272" height="264" rx="18" fill="white"/><path d="M224 118h192M224 154h160M224 190h192M224 226h128" stroke="#B7C6DB" stroke-width="12" stroke-linecap="round"/><circle cx="395" cy="282" r="28" fill="#27ABB8"/><path d="m381 282 10 10 18-20" fill="none" stroke="white" stroke-width="6"/></svg>'
  );
const warmPicture = picture.replace(
  encodeURIComponent("#ECF1FB"),
  encodeURIComponent("#FDF5E8")
);
type Args = Omit<ImageMediaProps, "onClick"> & {
  onClick?: () => void;
  expanded: boolean;
};
function imageProps(args: Args) {
  const { expanded, onClick, ...props } = args;
  void [expanded];
  return { ...props, onClick: onClick ? () => onClick() : undefined };
}
const meta: Meta<Args> = {
  title: "V2/Components/ImageMedia",
  component: ImageMedia,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: ["src", "alt", "maxHeight", "onClick"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "image-media",
          summary:
            "An image inside a message, with native alt text and a configurable maximum height.",
          changes: [
            [
              "Image behavior",
              "Full width with object-cover and height cap",
              "Preserved",
            ],
            [
              "Corners",
              "4px top corners",
              "Preserved; parent message owns remaining corners",
            ],
            [
              "API",
              "src, alt, numeric or CSS maxHeight, native root props",
              "Preserved",
            ],
          ],
          tokens: [
            ["Top corners", "rounded-t", "4px"],
            ["Maximum height", "maxHeight", "280px default"],
            ["Image fit", "object-fit", "cover"],
          ],
          guidance:
            "ImageMedia does not load a lightbox or own retry behavior. Usage wraps it in a native button to show a local enlarged view. The embedded illustration avoids external image requests.",
        }),
      },
    },
  },
  args: {
    src: picture,
    alt: "Illustrated delivery receipt",
    maxHeight: "280px",
    onClick: fn(),
    expanded: false,
  },
  argTypes: {
    src: {
      control: {
        type: "select",
        labels: { [picture]: "Cool receipt", [warmPicture]: "Warm receipt" },
      },
      options: [picture, warmPicture],
      description:
        "Embedded demonstration images. In application code, src accepts any image URL.",
      table: { defaultValue: { summary: "Embedded receipt illustration" } },
    },
    alt: { control: "text" },
    maxHeight: {
      control: "text",
      description: "A number (pixels) or CSS length such as 160px or 40vh.",
    },
    onClick: { control: false },
    expanded: { control: "boolean", table: { category: "Example" } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="max-w-md overflow-hidden rounded-lg border border-semantic-border-layout">
      <ImageMedia {...imageProps(args)} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Compact: Story = { args: { maxHeight: "140px" } };
export const Tall: Story = { args: { maxHeight: "400px" } };
export const CssHeight: Story = { args: { maxHeight: "35vh" } };
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-3 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllHeights: Story = {
  name: "All height caps",
  parameters: gallery(
    ["maxHeight"],
    "Height caps are fixed at 140px, 280px and 35vh. Source and alt text Controls apply to every image."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4 md:grid-cols-3">
      {[140, 280, "35vh"].map((maxHeight) => (
        <Card key={maxHeight} title={String(maxHeight)}>
          <ImageMedia {...imageProps(args)} maxHeight={maxHeight} />
        </Card>
      ))}
    </div>
  ),
};
export const ContentStates: Story = {
  name: "Content states",
  parameters: gallery(
    ["alt"],
    "Native alt-text examples are fixed. Source and maximum-height Controls remain editable; these are not simulated loading or error states."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4 md:grid-cols-2">
      <Card title="Meaningful image">
        <ImageMedia
          {...imageProps(args)}
          alt="Delivery receipt with a confirmation mark"
        />
      </Card>
      <Card title="Decorative image">
        <ImageMedia {...imageProps(args)} alt="" />
      </Card>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "Both versions receive the same source, alt text, maximum height and native click handler."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-2 gap-4">
        <Card title="v1">
          <ImageV1 {...imageProps(args)} />
        </Card>
        <Card title="v2">
          <ImageMedia {...imageProps(args)} />
        </Card>
      </div>
    </div>
  ),
};
export const Usage: Story = {
  parameters: {
    controls: { include: ["src", "alt", "maxHeight", "expanded"] },
  },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <section className="max-w-xl rounded-lg border border-semantic-border-layout p-4">
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Image in a message
        </h3>
        <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
          Click the preview to enlarge it. This state is local to the example.
        </p>
        <button
          type="button"
          aria-label="Enlarge attachment"
          className="block max-w-sm overflow-hidden rounded-lg border border-semantic-border-layout p-0 text-left focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary"
          onClick={() => update({ expanded: true })}
        >
          <ImageMedia
            src={args.src}
            alt={args.alt}
            maxHeight={args.maxHeight}
          />
        </button>
        <p className="m-0 mt-3 text-sm">Your delivery receipt is attached.</p>
        {args.expanded && (
          <div className="mt-4 rounded-lg border border-semantic-border-layout p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="m-0 text-sm font-medium">Enlarged attachment</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => update({ expanded: false })}
              >
                Close preview
              </Button>
            </div>
            <ImageMedia
              src={args.src}
              alt={args.alt}
              maxHeight={args.maxHeight}
            />
          </div>
        )}
      </section>
    );
  },
};
