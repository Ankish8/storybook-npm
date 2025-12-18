import * as React from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type Kind = "display" | "headline" | "title" | "label" | "body";
export type Variant = "large" | "medium" | "small";
export type Color =
  | "primary"
  | "secondary"
  | "muted"
  | "placeholder"
  | "link"
  | "inverted"
  | "error"
  | "success";
export type Align = "left" | "center" | "right";

type Key = `${Kind}-${Variant}`;

// =============================================================================
// MAPPINGS
// =============================================================================

/**
 * Maps kind-variant combinations to semantic HTML tags
 */
const mapTagName: { [key in Key]: keyof JSX.IntrinsicElements } = {
  "display-large": "h4",
  "display-medium": "h4",
  "display-small": "h4",
  "headline-large": "h1",
  "headline-medium": "h2",
  "headline-small": "h3",
  "title-large": "h5",
  "title-medium": "h5",
  "title-small": "h5",
  "label-large": "label",
  "label-medium": "label",
  "label-small": "label",
  "body-large": "span",
  "body-medium": "span",
  "body-small": "span",
};

/**
 * Maps kind-variant combinations to Tailwind typography classes
 */
const mapClassName: { [key in Key]: string } = {
  "display-large": "text-[57px] leading-[64px] font-normal",
  "display-medium": "text-[45px] leading-[52px] font-normal",
  "display-small": "text-[36px] leading-[44px] font-normal",
  "headline-large": "text-[32px] leading-[40px] font-semibold",
  "headline-medium": "text-[28px] leading-[36px] font-semibold",
  "headline-small": "text-[24px] leading-[32px] font-semibold",
  "title-large": "text-lg leading-[22px] font-semibold",
  "title-medium": "text-base leading-5 font-semibold",
  "title-small": "text-sm leading-[18px] font-semibold",
  "label-large": "text-sm leading-5 font-semibold",
  "label-medium": "text-xs leading-4 font-semibold",
  "label-small": "text-[10px] leading-[14px] font-semibold",
  "body-large": "text-base leading-5 font-normal",
  "body-medium": "text-sm leading-[18px] font-normal",
  "body-small": "text-xs leading-4 font-normal",
};

/**
 * Maps color variants to Tailwind text color classes
 */
const mapColorClassName: { [key in Color]: string } = {
  primary: "text-[#181D27]",
  secondary: "text-[#343E55]",
  muted: "text-[#717680]",
  placeholder: "text-[#A2A6B1]",
  link: "text-[#4275D6]",
  inverted: "text-white",
  error: "text-[#F04438]",
  success: "text-[#17B26A]",
};

/**
 * Maps alignment to Tailwind text alignment classes
 */
const mapAlignClassName: { [key in Align]: string } = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Typography component props
 */
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Text content */
  children: React.ReactNode;
  /** Typography kind - determines base styling and semantic tag */
  kind?: Kind;
  /** Size variant */
  variant?: Variant;
  /** Text color */
  color?: Color;
  /** Text alignment */
  align?: Align;
  /** Enable text truncation with ellipsis */
  truncate?: boolean;
  /** Override the default HTML tag */
  tag?: keyof JSX.IntrinsicElements;
  /** For label elements - associates with form input */
  htmlFor?: string;
}

/**
 * A semantic typography component for consistent text styling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Typography kind="headline" variant="large">Page Title</Typography>
 *
 * // With color
 * <Typography kind="body" color="muted">Helper text</Typography>
 *
 * // Form label
 * <Typography kind="label" variant="medium" htmlFor="email">Email</Typography>
 *
 * // Truncated text
 * <Typography truncate>Very long text that will be truncated...</Typography>
 * ```
 */
const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      children,
      kind = "body",
      variant = "medium",
      color,
      align,
      truncate = false,
      className,
      tag,
      htmlFor,
      ...props
    },
    ref
  ) => {
    const key: Key = `${kind}-${variant}`;
    const Tag = tag || mapTagName[key];

    const classes = cn(
      "m-0", // Reset margin
      mapClassName[key],
      color && mapColorClassName[color],
      align && mapAlignClassName[align],
      truncate && "truncate",
      className
    );

    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        htmlFor={Tag === "label" ? htmlFor : undefined}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Typography.displayName = "Typography";

export {
  Typography,
  mapTagName,
  mapClassName,
  mapColorClassName,
  mapAlignClassName,
};
