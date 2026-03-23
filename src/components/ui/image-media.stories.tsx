import type { Meta, StoryObj } from "@storybook/react";
import { ImageMedia } from "./image-media";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";

const PORTRAIT_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop";

const meta: Meta<typeof ImageMedia> = {
  title: "Components/Image Media",
  component: ImageMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
An image display component designed for chat messages. Shows an image with rounded top corners, object-cover fit, and a configurable max height constraint.

\`\`\`bash
npx myoperator-ui add image-media
\`\`\`

## Import

\`\`\`tsx
import { ImageMedia } from "@/components/ui/image-media"
\`\`\`

## Design Tokens

This component uses minimal styling with no semantic color tokens. It relies on layout utilities (\`relative\`, \`w-full\`, \`rounded-t\`, \`object-cover\`) and an inline \`maxHeight\` style.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    maxHeight: {
      control: "text",
      description: "Maximum height of the image. Defaults to 280px",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[380px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImageMedia>;

export const Overview: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Mountain landscape",
  },
};

export const Landscape: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Landscape photo",
  },
};

export const Portrait: Story = {
  args: {
    src: PORTRAIT_IMAGE,
    alt: "Portrait photo",
    maxHeight: 400,
  },
};

export const CustomMaxHeight: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Small preview",
    maxHeight: 150,
  },
};
