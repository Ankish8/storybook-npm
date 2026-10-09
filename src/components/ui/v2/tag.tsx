import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Arc's remove press: a quick dip to .96 (120ms on the standard curve) and a
 * spring release over 580ms. The sampled curve is Arc's own `--ease-spring`.
 * Wrapped in `cn(...)` so the CLI prefixer transforms the literal.
 */
const removePressClassName = cn(
  "[transition-property:transform] [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] active:[transition-duration:120ms] active:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
);

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva(
  "inline-flex items-center gap-1.5 box-border rounded-lg border border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-normal leading-[1.4] tracking-[-0.01em]",
  {
    variants: {
      variant: {
        default:
          "border-semantic-border-layout bg-semantic-bg-ui text-[var(--v2-text-secondary,#5E5E5E)]",
        primary:
          "border-semantic-border-layout bg-semantic-bg-ui text-[var(--v2-text-secondary,#5E5E5E)]",
        accent:
          "border-semantic-border-accent bg-semantic-brand-surface text-[var(--v2-text-secondary,#5E5E5E)]",
        secondary:
          "border-semantic-border-layout bg-semantic-bg-ui text-[var(--v2-text-secondary,#5E5E5E)]",
        success:
          "border-[var(--color-success-200)] bg-semantic-success-surface text-semantic-success-text",
        warning:
          "border-[var(--color-warning-200)] bg-semantic-warning-surface text-semantic-warning-text",
        error:
          "border-[var(--color-error-200)] bg-semantic-error-surface text-semantic-error-text",
        destructive:
          "border-[var(--color-error-200)] bg-semantic-error-surface text-semantic-error-text",
        info: "border-semantic-info-border bg-semantic-info-surface text-semantic-info-text",
      },
      size: {
        // Arc's tag is 28px with 9px side padding; sm and lg step 4px either side of it.
        default: "h-7 px-[9px]",
        sm: "h-6 px-2 text-xs",
        lg: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Tag component for displaying event labels and categories.
 *
 * @example
 * ```tsx
 * <Tag>After Call Event</Tag>
 * <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
 * ```
 */
export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Bold label prefix displayed before the content */
  label?: string;
  /** When provided, renders a dismiss (×) button that calls this handler */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disables the dismiss button independently */
  removeDisabled?: boolean;
  /** Custom aria-label for the dismiss button (default: "Remove") */
  removeAriaLabel?: string;
}

const Tag = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      label,
      onRemove,
      removeDisabled,
      removeAriaLabel,
      children,
      ...props
    }: TagProps,
    ref: React.Ref<HTMLSpanElement>
  ) => {
    return (
      <span
        className={cn(
          tagVariants({ variant, size }),
          // Arc keeps 4px between the dismiss circle and the edge of the tag.
          onRemove && "pr-1",
          className
        )}
        ref={ref}
        {...props}
      >
        {label && <span className="font-medium">{label}</span>}
        <span className="font-normal inline-flex items-center gap-1">
          {children}
        </span>
        {onRemove && (
          <button
            type="button"
            className={cn(
              // Arc: a 22px circle (3px from the label, 4px from the tag edge) around a 14px icon. The 24px
              // button adds a 1px hit margin on each side that the -ml-1 / -mr-px margins give back, so the
              // layout footprint is the 22px plate. Both visuals are pseudo-elements (no extra DOM, so v1 markup
              // parity holds). ::before is the hover plate, parked behind the icon with isolate + -z-10. The focus
              // ring is a separate ::after because opacity on the plate would fade it too.
              "relative isolate -ml-1 -mr-px inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-transparent border-none p-0 cursor-pointer focus-visible:outline-none",
              "before:pointer-events-none before:absolute before:inset-px before:-z-10 before:rounded-full before:bg-[var(--color-black)] before:opacity-0 before:transition-opacity before:[transition-duration:160ms] before:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] before:content-[''] enabled:[@media(hover:hover)]:hover:before:opacity-[0.08] focus-visible:before:opacity-[0.08]",
              "after:pointer-events-none after:absolute after:inset-px after:rounded-full after:content-[''] focus-visible:after:outline focus-visible:after:[outline-width:1px] focus-visible:after:outline-offset-1 focus-visible:after:outline-semantic-primary",
              removePressClassName,
              removeDisabled && "cursor-not-allowed opacity-50 active:scale-100"
            )}
            onClick={onRemove}
            disabled={removeDisabled}
            aria-label={removeAriaLabel ?? "Remove"}
          >
            <X className="size-3.5 [stroke-width:1.75]" />
          </button>
        )}
      </span>
    );
  }
);
Tag.displayName = "Tag";

/**
 * TagGroup component for displaying multiple tags with overflow indicator.
 *
 * @example
 * ```tsx
 * <TagGroup
 *   tags={[
 *     { label: "In Call Event:", value: "Call Begin, Start Dialing" },
 *     { label: "Whatsapp Event:", value: "message.Delivered" },
 *     { value: "After Call Event" },
 *   ]}
 *   maxVisible={2}
 * />
 * ```
 */
export interface TagGroupProps {
  /** Array of tags to display */
  tags: Array<{ label?: string; value: string }>;
  /** Maximum number of tags to show before overflow (default: 2) */
  maxVisible?: number;
  /** Tag variant */
  variant?: TagProps["variant"];
  /** Tag size */
  size?: TagProps["size"];
  /** Additional className for the container */
  className?: string;
}

const TagGroup = ({
  tags,
  maxVisible = 2,
  variant,
  size,
  className,
}: TagGroupProps) => {
  const visibleTags = tags.slice(0, maxVisible);
  const overflowCount = tags.length - maxVisible;

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {visibleTags.map((tag, index) => {
        const isLastVisible =
          index === visibleTags.length - 1 && overflowCount > 0;

        if (isLastVisible) {
          return (
            <div key={index} className="flex items-center gap-2">
              <Tag label={tag.label} variant={variant} size={size}>
                {tag.value}
              </Tag>
              <Tag variant={variant} size={size}>
                +{overflowCount} more
              </Tag>
            </div>
          );
        }

        return (
          <Tag key={index} label={tag.label} variant={variant} size={size}>
            {tag.value}
          </Tag>
        );
      })}
    </div>
  );
};
TagGroup.displayName = "TagGroup";

export { Tag, TagGroup, tagVariants };
