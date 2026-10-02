import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva(
  "inline-flex items-center gap-1.5 box-border rounded-lg border-[0.4px] border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-normal leading-5",
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
        default: "h-6 px-2",
        sm: "h-5 px-1.5 text-xs leading-4",
        lg: "h-[30px] px-3",
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
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {label && (
          <span
            className={cn(
              "font-medium",
              size === "sm" ? "tracking-[0.06px]" : "tracking-[0.014px]"
            )}
          >
            {label}
          </span>
        )}
        <span className="font-normal inline-flex items-center gap-1">
          {children}
        </span>
        {onRemove && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center shrink-0 bg-transparent border-none p-0 cursor-pointer",
              removeDisabled && "cursor-not-allowed opacity-50"
            )}
            onClick={onRemove}
            disabled={removeDisabled}
            aria-label={removeAriaLabel ?? "Remove"}
          >
            <X className="size-3" />
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
