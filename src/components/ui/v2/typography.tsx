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
const mapTagName: { [key in Key]: keyof React.JSX.IntrinsicElements } = {
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
 * Maps kind-variant combinations to Tailwind typography classes.
 * Weights, leading and tracking follow Arc's heading/body conventions (500 headings,
 * 1.1 display leading, -0.03/-0.02em heading tracking, 1.3 title leading, 1.4 body
 * leading with -0.01em tracking); sizes keep the existing v2 scale.
 */
const mapClassName: { [key in Key]: string } = {
  "display-large": "text-[57px] leading-[1.1] font-medium tracking-[-0.03em]",
  "display-medium": "text-[45px] leading-[1.1] font-medium tracking-[-0.03em]",
  "display-small": "text-[36px] leading-[1.1] font-medium tracking-[-0.03em]",
  "headline-large": "text-[32px] leading-[1.1] font-medium tracking-[-0.03em]",
  "headline-medium": "text-[28px] leading-[1.1] font-medium tracking-[-0.02em]",
  "headline-small": "text-[24px] leading-[1.1] font-medium tracking-[-0.02em]",
  "title-large": "text-lg leading-[1.3] font-medium tracking-[-0.01em]",
  "title-medium": "text-base leading-[1.3] font-medium tracking-[-0.01em]",
  "title-small": "text-sm leading-[1.3] font-medium tracking-[-0.01em]",
  "label-large": "text-sm leading-[1.4] font-medium tracking-[-0.01em]",
  "label-medium": "text-xs leading-[1.4] font-medium tracking-[-0.01em]",
  "label-small": "text-[10px] leading-[1.4] font-medium tracking-[-0.01em]",
  "body-large": "text-base leading-[1.4] font-normal tracking-[-0.01em]",
  "body-medium": "text-sm leading-[1.4] font-normal tracking-[-0.01em]",
  "body-small": "text-xs leading-[1.4] font-normal tracking-[-0.01em]",
};

/**
 * Maps color variants to Tailwind text color classes
 */
const mapColorClassName: { [key in Color]: string } = {
  primary: "text-[var(--v2-text-primary,#484848)]",
  secondary: "text-[var(--v2-text-secondary,#5E5E5E)]",
  muted: "text-[var(--v2-text-muted,#707070)]",
  placeholder: "text-[var(--v2-text-placeholder,#707070)]",
  link: "text-semantic-text-link",
  inverted: "text-semantic-text-inverted",
  error: "text-semantic-error-primary",
  success: "text-semantic-success-primary",
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
  /** Text color; body defaults to secondary, other kinds to primary */
  color?: Color;
  /** Text alignment */
  align?: Align;
  /** Enable text truncation with ellipsis */
  truncate?: boolean;
  /** Override the default HTML tag */
  tag?: keyof React.JSX.IntrinsicElements;
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
const Typography = React.forwardRef(
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
    }: TypographyProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const key: Key = `${kind}-${variant}`;
    const Tag = (tag || mapTagName[key]) as React.ElementType;

    const classes = cn(
      "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)]", // Reset margin
      mapClassName[key],
      mapColorClassName[color ?? (kind === "body" ? "secondary" : "primary")],
      align && "block max-w-full",
      align && mapAlignClassName[align],
      truncate && "block max-w-full truncate",
      className
    );

    const tagName = tag || mapTagName[key];

    return (
      <Tag
        ref={ref}
        className={classes}
        htmlFor={tagName === "label" ? htmlFor : undefined}
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
