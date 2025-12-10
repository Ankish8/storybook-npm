import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tag variants for event labels and categories.
 * Rounded rectangle tags with optional bold labels.
 */
const tagVariants = cva(
  "inline-flex items-center rounded text-sm",
  {
    variants: {
      variant: {
        default: "bg-[#F5F5F5] text-[#181D27]",
        primary: "bg-[#F5F5F5] text-[#181D27]",
        accent: "bg-[#EBECEE] text-[#343E55]",
        secondary: "bg-[#E9EAEB] text-[#414651]",
        success: "bg-[#ECFDF3] text-[#17B26A]",
        warning: "bg-[#FFFAEB] text-[#F79009]",
        error: "bg-[#FEF3F2] text-[#F04438]",
        destructive: "bg-[#FEF3F2] text-[#F04438]",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Bold label prefix displayed before the content */
  label?: string
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, label, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {label && (
          <span className="font-semibold mr-1">{label}</span>
        )}
        <span className="font-normal">{children}</span>
      </span>
    )
  }
)
Tag.displayName = "Tag"

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
  tags: Array<{ label?: string; value: string }>
  /** Maximum number of tags to show before overflow (default: 2) */
  maxVisible?: number
  /** Tag variant */
  variant?: TagProps['variant']
  /** Tag size */
  size?: TagProps['size']
  /** Additional className for the container */
  className?: string
}

const TagGroup = ({
  tags,
  maxVisible = 2,
  variant,
  size,
  className,
}: TagGroupProps) => {
  const visibleTags = tags.slice(0, maxVisible)
  const overflowCount = tags.length - maxVisible

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {visibleTags.map((tag, index) => {
        const isLastVisible = index === visibleTags.length - 1 && overflowCount > 0

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
          )
        }

        return (
          <Tag key={index} label={tag.label} variant={variant} size={size}>
            {tag.value}
          </Tag>
        )
      })}
    </div>
  )
}
TagGroup.displayName = "TagGroup"

export { Tag, TagGroup, tagVariants }
