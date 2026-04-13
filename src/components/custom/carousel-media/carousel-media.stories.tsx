import type { Meta, StoryObj } from "@storybook/react";
import { CarouselMedia } from "./carousel-media";
import type { CarouselCard } from "./types";

// Real photographic samples from Lorem Picsum (deterministic via seed).
// Seeds are chosen so the returned image visually matches the card theme.
const sampleCards: CarouselCard[] = [
  {
    url: "https://picsum.photos/seed/summer-sale/520/400",
    mediaType: "image",
    title: "Summer Collection - Up to 50% Off",
    buttons: [
      { icon: "reply", label: "Shop Now" },
      { icon: "link", label: "View Details" },
    ],
  },
  {
    url: "https://picsum.photos/seed/new-arrivals/520/400",
    mediaType: "image",
    title: "New Arrivals This Week",
    buttons: [
      { icon: "reply", label: "Browse" },
      { icon: "link", label: "Learn More" },
    ],
  },
  {
    url: "https://picsum.photos/seed/best-sellers/520/400",
    mediaType: "image",
    title: "Best Sellers - Don't Miss Out",
    buttons: [
      { icon: "reply", label: "Order Now" },
      { icon: "link", label: "See All" },
    ],
  },
];

// Google's official sample videos bucket — Creative Commons licensed,
// canonical test set used across the industry. Each .mp4 has a matching
// .jpg poster under /images/.
const sampleVideoCards: CarouselCard[] = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    mediaType: "video",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny — Product Demo",
    buttons: [
      { icon: "reply", label: "Watch More" },
      { icon: "link", label: "Shop Now" },
    ],
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    mediaType: "video",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Elephants Dream — New Arrival",
    buttons: [
      { icon: "reply", label: "Browse" },
      { icon: "link", label: "Details" },
    ],
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    mediaType: "video",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    title: "Sintel — Featured Story",
    buttons: [
      { icon: "link", label: "Watch Now" },
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
A horizontally scrollable card carousel for displaying multiple items such as WhatsApp carousel template cards. Each card shows an image or video, a title, and optional action buttons. Video cards show a centered play button and play inline on click. Navigation arrows appear based on scroll position.

### Media types

Each card can be an image (default) or a video. Set \`mediaType: "video"\` and provide an optional \`thumbnailUrl\` for the poster frame:

\`\`\`tsx
const cards = [
  { url: "/img.jpg", mediaType: "image", title: "Product" },
  { url: "/clip.mp4", mediaType: "video", thumbnailUrl: "/poster.jpg", title: "Demo" },
]
\`\`\`

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
        url: "https://picsum.photos/seed/flash-deal/520/400",
        mediaType: "image",
        title: "Flash Deal - 24 Hours Only",
        buttons: [
          { icon: "reply", label: "Grab It" },
          { icon: "link", label: "Terms" },
        ],
      },
      {
        url: "https://picsum.photos/seed/clearance/520/400",
        mediaType: "image",
        title: "Clearance Sale - Everything Must Go",
        buttons: [
          { icon: "reply", label: "Shop Clearance" },
        ],
      },
      {
        url: "https://picsum.photos/seed/premium/520/400",
        mediaType: "image",
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
        url: "https://picsum.photos/seed/landscape/520/400",
        mediaType: "image",
        title: "A beautiful landscape photo",
      },
      {
        url: "https://picsum.photos/seed/city-sunset/520/400",
        mediaType: "image",
        title: "City skyline at sunset",
      },
      {
        url: "https://picsum.photos/seed/mountains/520/400",
        mediaType: "image",
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

export const WithVideo: Story = {
  args: {
    cards: sampleVideoCards,
  },
};

export const MixedMedia: Story = {
  args: {
    cards: [
      sampleCards[0],
      sampleVideoCards[0],
      sampleCards[1],
      sampleVideoCards[1],
      sampleCards[2],
    ],
  },
};
