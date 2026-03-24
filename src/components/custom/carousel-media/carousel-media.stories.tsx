import type { Meta, StoryObj } from "@storybook/react";
import { CarouselMedia } from "./carousel-media";
import type { CarouselCard } from "./types";

const sampleCards: CarouselCard[] = [
  {
    url: "https://placehold.co/520x400/e2e8f0/475569?text=Summer+Sale",
    title: "Summer Collection - Up to 50% Off",
    buttons: [
      { icon: "reply", label: "Shop Now" },
      { icon: "link", label: "View Details" },
    ],
  },
  {
    url: "https://placehold.co/520x400/fce7f3/9d174d?text=New+Arrivals",
    title: "New Arrivals This Week",
    buttons: [
      { icon: "reply", label: "Browse" },
      { icon: "link", label: "Learn More" },
    ],
  },
  {
    url: "https://placehold.co/520x400/dbeafe/1e40af?text=Best+Sellers",
    title: "Best Sellers - Don't Miss Out",
    buttons: [
      { icon: "reply", label: "Order Now" },
      { icon: "link", label: "See All" },
    ],
  },
];

const meta: Meta<typeof CarouselMedia> = {
  title: "Custom/Chat/Carousel Media",
  component: CarouselMedia,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A horizontally scrollable card carousel for displaying multiple items such as WhatsApp carousel template cards. Each card shows an image, title, and optional action buttons. Navigation arrows appear based on scroll position.

### Installation

\`\`\`bash
npx myoperator-ui add carousel-media
\`\`\`

### Import

\`\`\`tsx
import { CarouselMedia } from "@/components/custom/carousel-media"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Card background | \`bg-white\` | Card surface | <span style="color:#ffffff;background:#000;padding:0 4px">\\u25a0</span> \`#FFFFFF\` |
| Title text | \`--semantic-text-primary\` | Card title | <span style="color:#181d27">\\u25a0</span> \`#181D27\` |
| Button text | \`--semantic-text-primary\` | Button labels | <span style="color:#181d27">\\u25a0</span> \`#181D27\` |
| Card border | \`--semantic-border-layout\` | Card outline | <span style="color:#e9eaeb">\\u25a0</span> \`#E9EAEB\` |
| Button hover | \`--semantic-bg-hover\` | Button hover bg | <span style="color:#f5f5f5">\\u25a0</span> \`#F5F5F5\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 466, background: "#f0f2f5", padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CarouselMedia>;

export const Overview: Story = {
  args: {
    cards: sampleCards,
  },
};

export const SingleCard: Story = {
  args: {
    cards: [sampleCards[0]],
  },
};

export const ManyCards: Story = {
  args: {
    cards: [
      ...sampleCards,
      {
        url: "https://placehold.co/520x400/d1fae5/065f46?text=Flash+Deal",
        title: "Flash Deal - 24 Hours Only",
        buttons: [
          { icon: "reply", label: "Grab It" },
          { icon: "link", label: "Terms" },
        ],
      },
      {
        url: "https://placehold.co/520x400/fef3c7/92400e?text=Clearance",
        title: "Clearance Sale - Everything Must Go",
        buttons: [
          { icon: "reply", label: "Shop Clearance" },
        ],
      },
      {
        url: "https://placehold.co/520x400/ede9fe/5b21b6?text=Premium",
        title: "Premium Membership Benefits",
        buttons: [
          { icon: "link", label: "Join Now" },
        ],
      },
    ],
  },
};

export const WithoutButtons: Story = {
  args: {
    cards: [
      {
        url: "https://placehold.co/520x400/e2e8f0/475569?text=Image+1",
        title: "A beautiful landscape photo",
      },
      {
        url: "https://placehold.co/520x400/fce7f3/9d174d?text=Image+2",
        title: "City skyline at sunset",
      },
      {
        url: "https://placehold.co/520x400/dbeafe/1e40af?text=Image+3",
        title: "Mountain range panorama",
      },
    ],
  },
};

export const CustomSize: Story = {
  args: {
    cards: sampleCards,
    cardWidth: 200,
    imageHeight: 150,
  },
};
