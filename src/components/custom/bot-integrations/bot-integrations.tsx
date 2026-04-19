import * as React from "react"
import { Blocks, Info, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import type { BotIntegrationsProps } from "./types"

/** Native `title` only when text is visually truncated (ellipsis / line clamp). */
function ConditionalOverflowTitle({
  className,
  fullText,
  lineClamp,
  children,
}: {
  className?: string
  fullText: string
  /** When true, detect vertical overflow (e.g. line-clamp-2); otherwise horizontal ellipsis. */
  lineClamp?: boolean
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const [showTitle, setShowTitle] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    if (lineClamp) {
      setShowTitle(el.scrollHeight > el.clientHeight + 1)
    } else {
      setShowTitle(el.scrollWidth > el.clientWidth + 1)
    }
  }, [lineClamp])

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(() => {
      measure()
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
    }
  }, [fullText, measure])

  return (
    <p
      ref={ref}
      className={className}
      title={showTitle ? fullText : undefined}
    >
      {children}
    </p>
  )
}

const BotIntegrations = React.forwardRef<HTMLDivElement, BotIntegrationsProps>(
  (
    {
      className,
      integrations,
      onAdd,
      descriptionRequirement: _descriptionRequirement = "optional",
      emptyStateTitle = "No integrations yet",
      emptyStateDescription = "Connect your bot to external apps so it can perform actions and sync data during conversations.",
      emptyStateIcon,
      infoTooltip,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("border-b border-solid border-semantic-border-layout pb-6", className)}
        {...props}
      >
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
              Integrations
            </h2>
            {infoTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 shrink-0 cursor-help text-semantic-text-muted" />
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Info className="size-3.5 shrink-0 text-semantic-text-muted" />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={disabled}
            className="w-full shrink-0 justify-center sm:w-auto"
            leftIcon={<Plus className="size-3.5" aria-hidden />}
          >
            Add integration
          </Button>
        </div>

        {/* Content */}
        {integrations.length === 0 ? (
          /* Compact empty state matching Figma */
          <div className="flex flex-col items-center gap-2.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui px-4 py-3">
            <div className="flex items-center justify-center rounded-full bg-semantic-bg-primary size-10">
              {emptyStateIcon || (
                <Blocks className="size-6 text-semantic-text-muted" />
              )}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="m-0 max-w-full text-sm text-semantic-text-primary sm:max-w-[310px]">
                {emptyStateTitle}
              </p>
              <p className="m-0 max-w-full text-xs text-semantic-text-muted sm:max-w-[310px]">
                {emptyStateDescription}
              </p>
            </div>
          </div>
        ) : (
          /* Integration List */
          <div className="flex flex-col divide-y divide-semantic-border-layout">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 basis-0 items-start gap-3 sm:items-center">
                  {/* Icon */}
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-semantic-info-surface-subtle p-1.5">
                    {integration.icon}
                  </div>

                  {/* Label + description — 90% on mobile/tablet; 80% on desktop (lg+) */}
                  <div className="flex min-w-0 max-w-[90%] flex-1 basis-0 flex-col gap-1 lg:max-w-[80%]">
                    <ConditionalOverflowTitle
                      className="m-0 truncate text-sm font-semibold text-semantic-text-primary"
                      fullText={integration.label}
                    >
                      {integration.label}
                    </ConditionalOverflowTitle>
                    {integration.description ? (
                      <ConditionalOverflowTitle
                        lineClamp
                        className="m-0 min-w-0 line-clamp-2 text-sm text-semantic-text-muted"
                        fullText={integration.description}
                      >
                        {integration.description}
                      </ConditionalOverflowTitle>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => integration.onEdit(integration.id)}
                    disabled={disabled}
                    className="text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
                    aria-label={`Edit ${integration.label}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => integration.onDelete(integration.id)}
                    disabled={disabled}
                    className="text-semantic-text-muted hover:bg-semantic-error-surface hover:text-semantic-error-primary"
                    aria-label={`Delete ${integration.label}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
BotIntegrations.displayName = "BotIntegrations"

export { BotIntegrations }
