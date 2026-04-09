import * as React from "react"

/** Represents a toolkit/app from Composio API */
export interface ComposioToolkit {
  /** Unique identifier from the API */
  id: string
  /** Unique slug (e.g., "googlesheets", "slack") */
  slug: string
  /** Display name (e.g., "Google Sheets") */
  name: string
  /** Logo image URL from Composio */
  logo: string
  /** Short description of the toolkit */
  description: string
}

/** Represents a connected account from Composio API */
export interface ComposioConnectedAccount {
  /** Account identifier (e.g., "acc_89xv2m9") */
  id: string
  /** Display label for the account */
  label: string
  /** Name of the user who created the connection */
  createdBy: string
  /** Formatted creation date (e.g., "Jan 12, 2026") */
  createdAt: string
  /**
   * Whether this account is the currently active one for the toolkit on the current bot.
   * Business rule: at most one account per toolkit/bot should be active at a time.
   * When true, the card shows a green "Active" badge, a success border, and a "Continue" action.
   * When false and another account is active, the card shows a "Switch" action instead.
   */
  isActive?: boolean
}

/** Connection status during the auth flow */
export type ConnectionStatus = "idle" | "connecting" | "success" | "error"

/**
 * Visual variant for auth connection errors.
 * - "platform": inline banner on the connect page with a full-width dark retry button (legacy)
 * - "redirect": standalone centered error screen (legacy, for OAuth redirect failures)
 * - "inline": preserves the full connect-account layout (toolkit header + accounts list) and
 *   renders an error banner + light-bordered "Retry Connection" button below the accounts list
 */
export type ConnectionErrorVariant = "platform" | "redirect" | "inline"

/** Wizard step identifiers */
export type AddIntegrationStep =
  | "select-toolkit"
  | "connect-account"
  | "success"

export interface AddIntegrationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void
  /** List of available toolkits fetched from Composio */
  toolkits: ComposioToolkit[]
  /** Existing connected accounts for the selected toolkit */
  connectedAccounts?: ComposioConnectedAccount[]
  /** Current wizard step */
  step?: AddIntegrationStep
  /** Total number of steps to display (e.g., 4 for new, 3 for existing) */
  totalSteps?: number
  /** Current step number for display */
  currentStepNumber?: number
  /** Auth connection status */
  connectionStatus?: ConnectionStatus
  /** Visual variant for connection errors. See ConnectionErrorVariant for details. */
  connectionErrorVariant?: ConnectionErrorVariant
  /** Currently selected toolkit */
  selectedToolkit?: ComposioToolkit | null
  /** Integration name input value */
  integrationName?: string
  /** Search query for filtering toolkits */
  searchQuery?: string
  /** Whether toolkits are loading */
  isLoadingToolkits?: boolean
  /** Whether toolkit loading failed */
  isToolkitLoadError?: boolean
  /** Error message for integration name (e.g., "Name already exists") */
  integrationNameError?: string
  /** Callback when close (X) is clicked */
  onClose?: () => void
  /** Callback when Next is clicked on Step 1. selectedToolkit is null if user only typed a custom name. */
  onNext?: (data: {
    integrationName: string
    selectedToolkit: ComposioToolkit | null
  }) => void
  /** Callback when Back arrow is clicked */
  onBack?: () => void
  /** Callback when a toolkit card is selected */
  onToolkitSelect?: (toolkit: ComposioToolkit) => void
  /** Callback when integration name changes */
  onIntegrationNameChange?: (name: string) => void
  /** Callback when search input changes */
  onSearchChange?: (search: string) => void
  /** Callback when "+ Connect a New Account" is clicked */
  onConnectNewAccount?: () => void
  /**
   * Callback when "Continue" is clicked on an account row.
   * Fires for the currently-active account, or for the sole account when none is active yet.
   */
  onContinueAccount?: (account: ComposioConnectedAccount) => void
  /**
   * Callback when "Switch" is clicked on an inactive account while another account is active.
   * Consumers should open a confirmation dialog (see SwitchAccountModal) before performing the switch.
   */
  onSwitchAccount?: (account: ComposioConnectedAccount) => void
  /** Callback when "Please Try Again" is clicked after toolkit load failure */
  onRetryLoadToolkits?: () => void
  /** Callback when "Please Try Again" / "Retry Connection" is clicked after auth connection failure */
  onRetryConnection?: () => void
}

/** Props for the internal ToolkitCard sub-component */
export interface ToolkitCardProps {
  toolkit: ComposioToolkit
  isSelected: boolean
  onClick: (toolkit: ComposioToolkit) => void
}

/** Props for the internal ConnectedAccountCard sub-component */
export interface ConnectedAccountCardProps {
  account: ComposioConnectedAccount
  /**
   * Label for the action button on the card.
   * Parent component decides: "Continue" when the card is the active one OR no other account is active;
   * "Switch" when the card is not active and another account IS active.
   */
  actionLabel: "Continue" | "Switch"
  /** Fires when the action button is clicked. Parent routes this to onContinueAccount or onSwitchAccount. */
  onAction: (account: ComposioConnectedAccount) => void
}

/** Props for the internal StepHeader sub-component */
export interface StepHeaderProps {
  title: string
  subtitle: string
  showBack?: boolean
  onBack?: () => void
  onClose?: () => void
}
