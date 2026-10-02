import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Typography } from "./typography";
import { Typography as V1 } from "../typography";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const kinds = ["display", "headline", "title", "label", "body"] as const;
const sizes = ["large", "medium", "small"] as const;
const colors = [
  "primary",
  "secondary",
  "muted",
  "placeholder",
  "link",
  "inverted",
  "error",
  "success",
] as const;
const meta: Meta<typeof Typography> = {
  title: "V2/Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "children",
        "kind",
        "variant",
        "color",
        "align",
        "truncate",
        "tag",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "typography",
          summary:
            "The v2 type hierarchy: display, headline, title, label and body styles.",
          changes: [
            ["Font", "Inherited font", "Inter"],
            ["Titles", "Semibold", "Medium"],
            ["Labels", "Semibold", "Semibold with recorded letter spacing"],
          ],
          tokens: [
            ["Font", "--font-v2", "Inter"],
            ["Primary", "--semantic-text-primary", "181D27", "#181D27"],
            ["Muted", "--semantic-text-muted", "717680", "#717680"],
          ],
          guidance:
            "Choose kind and variant for appearance, then choose tag for the correct document outline. Label htmlFor connects an input. Body text uses regular weight; title, label and headline weights follow the v2 hierarchy.",
        }),
      },
    },
  },
  args: {
    children: "Clear conversations start here",
    kind: "body",
    variant: "medium",
    color: "primary",
    align: "left",
    truncate: false,
  },
  argTypes: {
    children: { control: "text" },
    kind: { control: "select", options: kinds },
    variant: { control: "select", options: sizes },
    color: { control: "select", options: colors },
    align: { control: "inline-radio", options: ["left", "center", "right"] },
    truncate: { control: "boolean" },
    tag: {
      control: "select",
      options: ["span", "p", "h1", "h2", "h3", "h4", "label"],
    },
  },
  decorators: [
    (Story, context) => (
      <div
        className={
          context.args.color === "inverted"
            ? "max-w-full rounded-lg bg-semantic-primary p-6 text-semantic-text-inverted"
            : "max-w-full p-6"
        }
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Display: Story = { args: { kind: "display" } };
export const Headline: Story = { args: { kind: "headline" } };
export const Title: Story = { args: { kind: "title" } };
export const Label: Story = { args: { kind: "label" } };
export const Body: Story = { args: { kind: "body" } };
export const AllVariants: Story = {
  parameters: gallery(
    ["kind", "tag"],
    "Each kind has its default semantic tag. Text, size, color, alignment and truncation apply across the gallery."
  ),
  render: (args) => (
    <div className="w-[900px] max-w-full space-y-6">
      {kinds.map((kind) => (
        <section
          key={kind}
          className="min-w-0 space-y-2 border-b border-solid border-semantic-border-layout pb-5"
        >
          <p
            className={`m-0 text-xs ${args.color === "inverted" ? "text-semantic-text-inverted" : "text-semantic-text-muted"}`}
          >
            {kind}
          </p>
          <Typography {...args} kind={kind} tag={undefined} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["variant"],
    "Large, medium and small within the selected kind. All other controls apply to every sample."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {sizes.map((variant) => (
        <section key={variant} className="min-w-0 space-y-2">
          <p
            className={`m-0 text-xs ${args.color === "inverted" ? "text-semantic-text-inverted" : "text-semantic-text-muted"}`}
          >
            {variant}
          </p>
          <Typography {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllColors: Story = {
  parameters: gallery(
    ["color"],
    "Semantic text palette. Type kind, size, text and alignment remain editable."
  ),
  render: (args) => (
    <div className="max-w-full space-y-4">
      {colors.map((color) => (
        <section
          key={color}
          className={
            color === "inverted"
              ? "min-w-0 space-y-2 rounded-lg bg-semantic-primary p-3"
              : "min-w-0 space-y-2 p-3"
          }
        >
          <p
            className={`m-0 text-xs font-semibold capitalize ${color === "inverted" ? "text-semantic-text-inverted" : "text-semantic-text-muted"}`}
          >
            {color}
          </p>
          <Typography {...args} color={color} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  args: {
    truncate: true,
    children:
      "A deliberately long line demonstrating truncation when space is limited",
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] max-w-full">
        <Story />
      </div>
    ),
  ],
};
function PreviewArticle(args: Parameters<typeof Typography>[0]) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="w-[680px] max-w-full space-y-4">
      <Typography {...args} tag={args.tag || "h2"} />
      <Typography
        kind="body"
        variant="medium"
        color={args.color}
        align={args.align}
      >
        A clear heading introduces the topic. Supporting text supplies context
        and keeps the page easy to scan.
      </Typography>
      {expanded && (
        <Typography
          kind="body"
          variant="small"
          color={args.color === "inverted" ? "inverted" : "muted"}
        >
          Use the tag property to choose the document outline without changing
          the visual style.
        </Typography>
      )}
      <Button variant="outline" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide guidance" : "Read guidance"}
      </Button>
    </article>
  );
}
export const Usage: Story = { render: (args) => <PreviewArticle {...args} /> };
export const V1VsV2: Story = {
  name: "v1 vs v2",
  render: (args) => (
    <div className="grid w-[900px] max-w-full gap-6 md:grid-cols-2">
      {["v1", "v2"].map((version) => (
        <section
          key={version}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-base font-semibold">{version}</h3>
          {version === "v1" ? <V1 {...args} /> : <Typography {...args} />}
        </section>
      ))}
    </div>
  ),
};
