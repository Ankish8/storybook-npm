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
  /** Image URL for the card */
  url: string;
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
