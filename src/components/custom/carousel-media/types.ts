import * as React from "react";

export interface CarouselCardButton {
  /** Icon type to display before the label */
  icon?: "reply" | "link";
  /** Button text */
  label: string;
  /** Click handler */
  onClick?: () => void;
}

export interface CarouselCard {
  /** Media URL for the card — image src, or video src when mediaType is "video" */
  url: string;
  /** Media type for the card. Defaults to "image" when omitted */
  mediaType?: "image" | "video";
  /** Poster image shown before a video plays. Only applies when mediaType is "video" */
  thumbnailUrl?: string;
  /** Card title text */
  title: string;
  /** Action buttons displayed below the title */
  buttons?: CarouselCardButton[];
}

export interface CarouselMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of cards to display */
  cards: CarouselCard[];
  /** Width of each card in pixels. Defaults to 260 */
  cardWidth?: number;
  /** Height of card images in pixels. Defaults to 200 */
  imageHeight?: number;
}
