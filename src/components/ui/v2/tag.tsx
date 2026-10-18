import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Only the dismiss button moves on press. Keep these literal classes in cn()
 * so the CLI can prefix them, including the reduced-motion overrides.
 */
const removePressClassName = cn(
  "transition-transform duration-200 ease-out enabled:active:duration-100 enabled:active:scale-[0.96] motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:enabled:active:duration-0 motion-reduce:enabled:active:scale-100"
);

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva(
  "inline-flex min-w-0 max-w-full items-center gap-1.5 box-border rounded-lg border border-solid whitespace-normal text-start font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-normal leading-[1.4] tracking-[-0.01em]",
  {
    variants: {
      variant: {
        default:
          "border-v2-semantic-border-layout bg-v2-semantic-bg-ui text-v2-semantic-text-secondary",
        primary:
          "border-v2-semantic-border-layout bg-v2-semantic-bg-ui text-v2-semantic-text-secondary",
        accent:
          "border-v2-semantic-border-accent bg-v2-semantic-brand-surface text-v2-semantic-text-secondary",
        secondary:
          "border-v2-semantic-border-layout bg-v2-semantic-bg-ui text-v2-semantic-text-secondary",
        success:
          "border-v2-semantic-success-border bg-v2-semantic-success-surface text-v2-semantic-success-text",
        warning:
          "border-v2-semantic-warning-border bg-v2-semantic-warning-surface text-v2-semantic-warning-text",
        error:
          "border-v2-semantic-error-border bg-v2-semantic-error-surface text-v2-semantic-error-text",
        destructive:
          "border-v2-semantic-error-border bg-v2-semantic-error-surface text-v2-semantic-error-text",
        info: "border-v2-semantic-info-border bg-v2-semantic-info-surface text-v2-semantic-info-text",
      },
      size: {
        // Preserve the single-line sizes; wrapped labels can grow vertically.
        default: "min-h-7 px-[9px]",
        sm: "min-h-6 px-2 text-xs",
        lg: "min-h-8 px-3",
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
      onKeyDown,
      children,
      ...props
    }: TagProps,
    ref: React.Ref<HTMLSpanElement>
  ) => {
    const removeRef = React.useRef<HTMLButtonElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.target !== removeRef.current ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        (event.key !== "Backspace" && event.key !== "Delete")
      ) {
        return;
      }

      event.preventDefault();
      // Use the real button's click so onRemove keeps its v1 mouse-event contract.
      removeRef.current?.click();
    };

    return (
      <span
        className={cn(
          tagVariants({ variant, size }),
          // Keep room for the dismiss target at the trailing edge.
          onRemove && "pr-1",
          className
        )}
        ref={ref}
        {...props}
        onKeyDown={handleKeyDown}
      >
        {label && (
          <span className="min-w-0 max-w-[40%] shrink-0 py-0.5 font-medium [overflow-wrap:anywhere]">
            {label}
          </span>
        )}
        <span className="min-w-0 py-0.5 font-normal inline-flex flex-wrap items-center gap-1 [overflow-wrap:anywhere]">
          {children}
        </span>
        {onRemove && (
          <button
            type="button"
            ref={removeRef}
            className={cn(
              // Keep the 24px target and 22px plate. Separate pseudo-elements
              // let the keyboard ring stay opaque while the hover plate fades.
              "relative isolate -ml-1 -mr-px -my-px inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-transparent border-none p-0 cursor-pointer focus-visible:outline-none",
              "before:pointer-events-none before:absolute before:inset-px before:-z-10 before:rounded-full before:bg-v2-semantic-bg-inverted before:opacity-0 before:transition-opacity before:duration-150 before:content-[''] enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-[0.08] focus-visible:before:opacity-[0.08] motion-reduce:before:transition-none motion-reduce:before:duration-0",
              "after:pointer-events-none after:absolute after:inset-px after:rounded-full after:content-[''] focus-visible:after:outline focus-visible:after:[outline-width:2px] focus-visible:after:outline-offset-1 focus-visible:after:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
              removePressClassName,
              removeDisabled && "cursor-not-allowed opacity-50 active:scale-100"
            )}
            onClick={onRemove}
            disabled={removeDisabled}
            aria-label={removeAriaLabel ?? "Remove"}
          >
            <X className="size-3.5 [stroke-width:1.75]" aria-hidden="true" />
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
  /** Visible tag limit (default: 2). Fractions round down; negative limits show only the count. */
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
  const limit = Number.isNaN(maxVisible)
    ? 2
    : Math.max(0, Math.floor(maxVisible));
  const visibleTags = tags.slice(0, limit);
  const overflowCount = tags.length - visibleTags.length;

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-col items-start gap-2",
        className
      )}
    >
      {visibleTags.length === 0 && overflowCount > 0 && (
        <Tag variant={variant} size={size}>
          +{overflowCount} more
        </Tag>
      )}
      {visibleTags.map((tag, index) => {
        const isLastVisible =
          index === visibleTags.length - 1 && overflowCount > 0;

        if (isLastVisible) {
          return (
            <div
              key={index}
              className="flex min-w-0 max-w-full flex-wrap items-center gap-2"
            >
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
