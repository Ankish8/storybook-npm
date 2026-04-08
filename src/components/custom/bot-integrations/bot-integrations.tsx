import * as React from "react"
import { Blocks, Info, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import type { BotIntegrationsProps } from "./types"

const BotIntegrations = React.forwardRef<HTMLDivElement, BotIntegrationsProps>(
  (
    {
      className,
      integrations,
      onAdd,
      onEdit,
      onDelete,
      onConfigure,
      emptyStateTitle = "No integrations yet",
      emptyStateDescription = "Connect your bot to external apps so it can perform actions and sync data during conversations.",
      emptyStateIcon,
      infoTooltip,
      disabled,
      configureLabel = "Configure",
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
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
          >
            <Plus className="size-3.5" />
            Integrations
          </Button>
        </div>

        {/* Content */}
        {integrations.length === 0 ? (
          /* Compact empty state matching Figma */
          <div className="flex flex-col items-center gap-2.5 rounded bg-[var(--color-neutral-50)] border border-solid border-[var(--color-neutral-100)] px-4 py-3">
            <div className="flex items-center justify-center rounded-full bg-semantic-bg-primary size-10">
              {emptyStateIcon || (
                <Blocks className="size-6 text-semantic-text-muted" />
              )}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="m-0 text-sm text-semantic-text-primary max-w-[310px]">
                {emptyStateTitle}
              </p>
              <p className="m-0 text-xs text-semantic-text-muted max-w-[310px]">
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
                className="flex items-center gap-4 py-4 first:pt-0"
              >
                {/* Left: icon + content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {integration.icon && (
                    <div className="shrink-0 rounded bg-[var(--semantic-info-surface-subtle)] p-1.5">
                      {integration.icon}
                    </div>
                  )}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-semantic-text-primary whitespace-nowrap">
                        {integration.name}
                      </span>
                      {integration.status && (
                        <Badge
                          variant={integration.statusVariant ?? "active"}
                          className="font-semibold"
                          size="sm"
                        >
                          {integration.status}
                        </Badge>
                      )}
                    </div>
                    {integration.subtitle && (
                      <span className="text-sm text-semantic-text-muted">
                        {integration.subtitle}
                      </span>
                    )}
                    {integration.description && (
                      <span className="text-sm text-semantic-text-muted truncate max-w-[270px]">
                        {integration.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                {(onConfigure || onEdit || onDelete) && (
                  <div className="flex items-center gap-3 shrink-0">
                    {onConfigure && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onConfigure(integration.id)}
                        disabled={disabled}
                      >
                        {configureLabel}
                      </Button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(integration.id)}
                        disabled={disabled}
                        className={cn(
                          "rounded p-1.5 text-semantic-text-muted transition-colors hover:bg-semantic-bg-hover hover:text-semantic-text-primary",
                          disabled && "cursor-not-allowed opacity-50"
                        )}
                        aria-label={`Edit ${integration.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(integration.id)}
                        disabled={disabled}
                        className={cn(
                          "rounded p-1.5 text-semantic-text-muted transition-colors hover:bg-semantic-error-surface hover:text-semantic-error-primary",
                          disabled && "cursor-not-allowed opacity-50"
                        )}
                        aria-label={`Delete ${integration.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                )}
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
