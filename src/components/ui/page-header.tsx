import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * PageHeader variants for layout styles.
 */
const pageHeaderVariants = cva(
  "flex items-center w-full bg-white",
  {
    variants: {},
    defaultVariants: {},
  }
)

/**
 * Page header component for displaying page titles with optional icons and actions.
 *
 * @example
 * ```tsx
 * // Simple header with icon
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 * />
 *
 * // Header with actions
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 *   actions={<Button>Add Webhook</Button>}
 * />
 *
 * // Header with back button
 * <PageHeader
 *   showBackButton
 *   onBackClick={() => navigate(-1)}
 *   title="Edit Webhook"
 *   description="Modify webhook settings"
 *   actions={<><Button variant="outline">Cancel</Button><Button>Save</Button></>}
 * />
 * ```
 */
export interface PageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderVariants> {
  /** Page title (required) */
  title: string
  /** Optional description/subtitle displayed below the title */
  description?: string
  /** Icon displayed on the left side (hidden when showBackButton is true) */
  icon?: React.ReactNode
  /** Shows back arrow button instead of icon */
  showBackButton?: boolean
  /** Callback when back button is clicked */
  onBackClick?: () => void
  /** Optional info icon displayed next to the title (e.g., tooltip trigger) */
  infoIcon?: React.ReactNode
  /** Action buttons/elements rendered on the right side */
  actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({
    className,
    title,
    description,
    icon,
    showBackButton = false,
    onBackClick,
    infoIcon,
    actions,
    ...props
  }, ref) => {
    // Determine what to show on the left: back button, icon, or nothing
    const renderLeftElement = () => {
      if (showBackButton) {
        return (
          <button
            type="button"
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#F3F4F6] transition-colors text-[#333333]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )
      }
      if (icon) {
        return (
          <div className="flex items-center justify-center w-10 h-10 [&_svg]:w-6 [&_svg]:h-6 text-[#6B7280]">
            {icon}
          </div>
        )
      }
      return null
    }

    const leftElement = renderLeftElement()

    return (
      <div
        ref={ref}
        className={cn(
          pageHeaderVariants(),
          "h-[76px] px-4 pt-4",
          className
        )}
        {...props}
      >
        {/* Left Section: Icon or Back Button */}
        {leftElement && (
          <div className="flex-shrink-0 mr-4">
            {leftElement}
          </div>
        )}

        {/* Content Section: Title + Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-[#333333] truncate">
              {title}
            </h1>
            {infoIcon && (
              <span className="flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4 text-[#6B7280]">
                {infoIcon}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-[#333333] font-normal mt-1 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Actions Section */}
        {actions && (
          <div className="flex-shrink-0 flex items-center gap-2 ml-4">
            {actions}
          </div>
        )}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader, pageHeaderVariants }
