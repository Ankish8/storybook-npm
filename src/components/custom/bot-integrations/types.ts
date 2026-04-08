import * as React from "react"

export interface IntegrationItem {
  id: string
  name: string
  /** Integration icon/logo element (e.g., an <img> or SVG of the service logo) */
  icon?: React.ReactNode
  /** Status text displayed as a badge (e.g., "Connected") */
  status?: string
  /** Badge variant for the status (default: "active") */
  statusVariant?: "active" | "default" | "destructive" | "disabled"
  /** Subtitle line (e.g., "Google Sheets • 1 tool configured") */
  subtitle?: string
  /** Description line, truncated to one line */
  description?: string
}

export interface BotIntegrationsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** List of integrations to display */
  integrations: IntegrationItem[]
  /** Called when user clicks the add integration button */
  onAdd?: () => void
  /** Called when user clicks the edit button on an integration */
  onEdit?: (id: string) => void
  /** Called when user clicks the delete button on an integration */
  onDelete?: (id: string) => void
  /** Called when user clicks the configure button on an integration */
  onConfigure?: (id: string) => void
  /** Title shown in the empty state */
  emptyStateTitle?: string
  /** Description shown in the empty state */
  emptyStateDescription?: string
  /** Custom icon for the empty state */
  emptyStateIcon?: React.ReactNode
  /** Hover text shown on the info icon next to the title */
  infoTooltip?: string
  /** Disables the add button and action buttons */
  disabled?: boolean
  /** Label for the configure button (default: "Configure") */
  configureLabel?: string
}
