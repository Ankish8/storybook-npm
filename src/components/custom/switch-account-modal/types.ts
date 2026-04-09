import * as React from "react"

/**
 * A single integration affected by the account switch.
 * These are the integrations currently wired to the previously-active account.
 */
export interface AffectedIntegration {
  /** Stable identifier */
  id: string
  /** Display name (e.g., "Google Sheets – Sales Data") */
  name: string
  /**
   * Optional custom leading icon. If omitted, the modal renders a default
   * FileText icon. Pass a ReactNode if you need a toolkit-specific logo.
   */
  icon?: React.ReactNode
}

export interface SwitchAccountModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void
  /**
   * Identifier of the account the user is switching TO.
   * Rendered in the description copy: "You are switching to account {accountId}."
   */
  accountId: string
  /** Integrations that will be affected by the switch */
  affectedIntegrations: AffectedIntegration[]
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string
  /** Whether the confirm button is in a loading state */
  isConfirming?: boolean
  /** Callback when Cancel is clicked. The modal will close automatically after. */
  onCancel?: () => void
  /** Callback when Confirm is clicked. Parent is responsible for closing. */
  onConfirm?: () => void
}
