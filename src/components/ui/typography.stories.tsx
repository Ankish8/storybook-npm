import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";
import type { Kind, Variant, Color } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible typography component that maps semantic kind/variant combinations to the correct HTML tag and Tailwind classes.

\`\`\`bash
npx myoperator-ui add typography
\`\`\`

## Import

\`\`\`tsx
import { Typography } from "@/components/ui/typography"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    kind: {
      control: "select",
      options: ["display", "headline", "title", "label", "body"] satisfies Kind[],
      description: "Semantic text kind",
    },
    variant: {
      control: "select",
      options: ["large", "medium", "small"] satisfies Variant[],
      description: "Size variant within the kind",
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "muted",
        "placeholder",
        "link",
        "inverted",
        "error",
        "success",
      ] satisfies Color[],
      description: "Text color token",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Text alignment",
    },
    truncate: {
      control: "boolean",
      description: "Truncate overflowing text with ellipsis",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    kind: "body",
    variant: "medium",
  },
};

export const Display: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography kind="display" variant="large">Display Large</Typography>
      <Typography kind="display" variant="medium">Display Medium</Typography>
      <Typography kind="display" variant="small">Display Small</Typography>
    </div>
  ),
};

export const Headline: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography kind="headline" variant="large">Headline Large</Typography>
      <Typography kind="headline" variant="medium">Headline Medium</Typography>
      <Typography kind="headline" variant="small">Headline Small</Typography>
    </div>
  ),
};

export const Title: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography kind="title" variant="large">Title Large</Typography>
      <Typography kind="title" variant="medium">Title Medium</Typography>
      <Typography kind="title" variant="small">Title Small</Typography>
    </div>
  ),
};

export const Label: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography kind="label" variant="large">Label Large</Typography>
      <Typography kind="label" variant="medium">Label Medium</Typography>
      <Typography kind="label" variant="small">Label Small</Typography>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography kind="body" variant="large">Body Large — The quick brown fox</Typography>
      <Typography kind="body" variant="medium">Body Medium — The quick brown fox</Typography>
      <Typography kind="body" variant="small">Body Small — The quick brown fox</Typography>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Typography color="primary">Primary text</Typography>
      <Typography color="secondary">Secondary text</Typography>
      <Typography color="muted">Muted text</Typography>
      <Typography color="placeholder">Placeholder text</Typography>
      <Typography color="link">Link text</Typography>
      <Typography color="error">Error text</Typography>
      <Typography color="success">Success text</Typography>
      <div className="bg-semantic-primary p-2 rounded">
        <Typography color="inverted">Inverted text</Typography>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      {(["display", "headline", "title", "label", "body"] as Kind[]).map((kind) => (
        <div key={kind} className="flex flex-col gap-2">
          {(["large", "medium", "small"] as Variant[]).map((variant) => (
            <Typography key={variant} kind={kind} variant={variant}>
              {kind.charAt(0).toUpperCase() + kind.slice(1)} {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Typography>
          ))}
        </div>
      ))}
    </div>
  ),
};
