import * as React from "react"
import { ArrowLeft, X, Pencil, Check } from "lucide-react"
import { cn } from "../../../lib/utils"
import { IntegrationSteps } from "./integration-steps"

export interface IntegrationHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Main heading (e.g. "Setup Integration") */
  title?: string
  /** Step line shown under the title (e.g. "Step 3 of 4") */
  subtitle?: React.ReactNode
  /** When set, shows "Title - {name}" with optional inline edit */
  integrationName?: string
  onIntegrationNameChange?: (name: string) => void
  /** Invoked when the back control is activated */
  onBack?: () => void
  /** Invoked when the close control is activated */
  onClose?: () => void
  /** Optional icon for the back action (defaults to ArrowLeft) */
  backIcon?: React.ReactNode
  /** Optional icon for the close action (defaults to X) */
  closeIcon?: React.ReactNode
}

const IntegrationHeader = React.forwardRef<HTMLDivElement, IntegrationHeaderProps>(
  (
    {
      className,
      title = "Setup Integration",
      subtitle,
      integrationName,
      onIntegrationNameChange,
      onBack,
      onClose,
      backIcon,
      closeIcon,
      ...props
    },
    ref
  ) => {
    const [isEditingName, setIsEditingName] = React.useState(false)
    const [editNameDraft, setEditNameDraft] = React.useState("")

    const handleEditName = () => {
      setEditNameDraft(integrationName ?? "")
      setIsEditingName(true)
    }

    const handleConfirmName = () => {
      const trimmed = editNameDraft.trim()
      if (trimmed && trimmed !== integrationName) {
        onIntegrationNameChange?.(trimmed)
      }
      setIsEditingName(false)
    }

    const handleEditNameKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleConfirmName()
      } else if (e.key === "Escape") {
        setIsEditingName(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 items-start gap-2.5 border-b border-semantic-border-layout p-4 sm:items-center sm:p-6",
          className
        )}
        {...props}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
            aria-label="Go back"
          >
            {backIcon ?? <ArrowLeft className="size-5 shrink-0 sm:size-6" />}
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {integrationName !== undefined ? (
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
              <h2 className="m-0 shrink-0 text-base font-semibold text-semantic-text-primary sm:text-lg">
                {title} -
              </h2>
              {isEditingName ? (
                <>
                  <input
                    type="text"
                    value={editNameDraft}
                    onChange={(e) => setEditNameDraft(e.target.value)}
                    onKeyDown={handleEditNameKeyDown}
                    autoFocus
                    className="m-0 h-8 min-w-0 max-w-full flex-1 rounded border border-semantic-border-focus bg-semantic-bg-primary px-2 text-base font-semibold text-semantic-text-primary outline-none sm:max-w-md sm:text-lg"
                    aria-label="Integration name"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmName}
                    className="shrink-0 text-semantic-text-secondary hover:text-semantic-text-primary transition-colors"
                    aria-label="Confirm name"
                  >
                    <Check className="size-5" />
                  </button>
                </>
              ) : (
                <>
                  <span className="min-w-0 max-w-full break-words text-base font-semibold text-semantic-text-primary sm:text-lg">
                    {integrationName}
                  </span>
                  {onIntegrationNameChange && (
                    <button
                      type="button"
                      onClick={handleEditName}
                      className="shrink-0 text-semantic-text-muted hover:text-semantic-text-secondary transition-colors"
                      aria-label="Edit integration name"
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <h2 className="m-0 min-w-0 break-words text-base font-semibold text-semantic-text-primary sm:text-lg">
              {title}
            </h2>
          )}
          {subtitle !== undefined && subtitle !== null && (
            <IntegrationSteps>{subtitle}</IntegrationSteps>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded text-semantic-text-primary hover:text-semantic-text-secondary hover:bg-semantic-bg-hover transition-colors"
            aria-label="Close"
          >
            {closeIcon ?? <X className="size-4" />}
          </button>
        )}
      </div>
    )
  }
)
IntegrationHeader.displayName = "IntegrationHeader"

export { IntegrationHeader }
