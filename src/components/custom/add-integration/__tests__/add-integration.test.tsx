import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AddIntegration } from "../add-integration"
import type {
  ComposioToolkit,
  ComposioConnectedAccount,
} from "../types"

const mockToolkits: ComposioToolkit[] = [
  {
    id: "tk_1",
    slug: "googlesheets",
    name: "Google Sheets",
    logo: "https://example.com/sheets.png",
    description: "Read and write data to Google Sheets spreadsheets",
  },
  {
    id: "tk_2",
    slug: "slack",
    name: "Slack",
    logo: "https://example.com/slack.png",
    description: "Send messages and notifications to Slack channels",
  },
  {
    id: "tk_3",
    slug: "hubspot",
    name: "HubSpot",
    logo: "https://example.com/hubspot.png",
    description: "Manage contacts, deals, and CRM data",
  },
]

const mockAccounts: ComposioConnectedAccount[] = [
  {
    id: "acc_89xv2m9",
    label: "acc_89xv2m9",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 12, 2026",
    isActive: true,
  },
  {
    id: "acc_34pq7n1",
    label: "acc_34pq7n1",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 10, 2026",
  },
]

// Accounts where none is marked active
const mockAccountsNoActive: ComposioConnectedAccount[] = [
  {
    id: "acc_89xv2m9",
    label: "acc_89xv2m9",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 12, 2026",
  },
  {
    id: "acc_34pq7n1",
    label: "acc_34pq7n1",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 10, 2026",
  },
]

/** Shared props for all tests — modal must be open */
const modalProps = { open: true, onOpenChange: vi.fn() }

describe("AddIntegration", () => {
  // ─── Step 1: Select Toolkit ──────────────────────────────────────────

  describe("Step 1: Select Toolkit", () => {
    it("renders Step 1 with title 'Select Toolkit'", () => {
      render(<AddIntegration {...modalProps} toolkits={mockToolkits} step="select-toolkit" />)
      expect(screen.getByText("Select Toolkit")).toBeInTheDocument()
    })

    it("renders integration name input", () => {
      render(<AddIntegration {...modalProps} toolkits={mockToolkits} step="select-toolkit" />)
      expect(
        screen.getByPlaceholderText("Enter integration name")
      ).toBeInTheDocument()
    })

    it("renders search input", () => {
      render(<AddIntegration {...modalProps} toolkits={mockToolkits} step="select-toolkit" />)
      expect(
        screen.getByPlaceholderText("Search integrations")
      ).toBeInTheDocument()
    })

    it("renders toolkit cards from props", () => {
      render(<AddIntegration {...modalProps} toolkits={mockToolkits} step="select-toolkit" />)
      expect(screen.getByText("Google Sheets")).toBeInTheDocument()
      expect(screen.getByText("Slack")).toBeInTheDocument()
      expect(screen.getByText("HubSpot")).toBeInTheDocument()
    })

    it("selected toolkit gets aria-pressed='true'", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          selectedToolkit={mockToolkits[0]}
        />
      )
      const selectedButton = screen.getByText("Google Sheets").closest("button")
      expect(selectedButton).toHaveAttribute("aria-pressed", "true")

      const unselectedButton = screen.getByText("Slack").closest("button")
      expect(unselectedButton).toHaveAttribute("aria-pressed", "false")
    })

    it("onToolkitSelect fires when card clicked", () => {
      const onToolkitSelect = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          onToolkitSelect={onToolkitSelect}
        />
      )
      fireEvent.click(screen.getByText("Google Sheets").closest("button")!)
      expect(onToolkitSelect).toHaveBeenCalledTimes(1)
      expect(onToolkitSelect).toHaveBeenCalledWith(mockToolkits[0])
    })

    it("onIntegrationNameChange fires when name changes", () => {
      const onIntegrationNameChange = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          onIntegrationNameChange={onIntegrationNameChange}
        />
      )
      fireEvent.change(
        screen.getByPlaceholderText("Enter integration name"),
        { target: { value: "My Integration" } }
      )
      expect(onIntegrationNameChange).toHaveBeenCalledWith("My Integration")
    })

    it("onSearchChange fires when search changes", () => {
      const onSearchChange = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          onSearchChange={onSearchChange}
        />
      )
      fireEvent.change(
        screen.getByPlaceholderText("Search integrations"),
        { target: { value: "slack" } }
      )
      expect(onSearchChange).toHaveBeenCalledWith("slack")
    })

    it("Next button is disabled when no toolkit selected or no name", () => {
      render(<AddIntegration {...modalProps} toolkits={mockToolkits} step="select-toolkit" />)
      const nextButton = screen.getByRole("button", { name: "Next" })
      expect(nextButton).toBeDisabled()
    })

    it("Next button is enabled when only toolkit selected (no name)", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          selectedToolkit={mockToolkits[0]}
          integrationName=""
        />
      )
      const nextButton = screen.getByRole("button", { name: "Next" })
      expect(nextButton).not.toBeDisabled()
    })

    it("Next button is enabled when only name provided (no toolkit)", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          integrationName="My Integration"
        />
      )
      const nextButton = screen.getByRole("button", { name: "Next" })
      expect(nextButton).not.toBeDisabled()
    })

    it("Next button enabled and fires onNext when both selected", () => {
      const onNext = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          selectedToolkit={mockToolkits[0]}
          integrationName="My Integration"
          onNext={onNext}
        />
      )
      const nextButton = screen.getByRole("button", { name: "Next" })
      expect(nextButton).not.toBeDisabled()

      fireEvent.click(nextButton)
      expect(onNext).toHaveBeenCalledTimes(1)
      expect(onNext).toHaveBeenCalledWith({
        integrationName: "My Integration",
        selectedToolkit: mockToolkits[0],
      })
    })

    it("filters toolkits by search query", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          searchQuery="slack"
        />
      )
      expect(screen.getByText("Slack")).toBeInTheDocument()
      expect(screen.queryByText("Google Sheets")).not.toBeInTheDocument()
      expect(screen.queryByText("HubSpot")).not.toBeInTheDocument()
    })

    it("shows 'No integrations found' when search yields no results", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          searchQuery="nonexistent"
        />
      )
      expect(screen.getByText("No integrations found")).toBeInTheDocument()
    })

    it("shows 'Loading...' text when toolkits are loading", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={[]}
          step="select-toolkit"
          isLoadingToolkits
        />
      )
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("shows error state when toolkit loading fails", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={[]}
          step="select-toolkit"
          isToolkitLoadError
        />
      )
      expect(screen.getByText("Unable to load toolkits.")).toBeInTheDocument()
      expect(
        screen.getByText(
          "There was a problem fetching the available integrations."
        )
      ).toBeInTheDocument()
      expect(screen.getByText("Please Try Again")).toBeInTheDocument()
    })

    it("onRetryLoadToolkits fires when retry button clicked", () => {
      const onRetryLoadToolkits = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={[]}
          step="select-toolkit"
          isToolkitLoadError
          onRetryLoadToolkits={onRetryLoadToolkits}
        />
      )
      fireEvent.click(screen.getByText("Please Try Again").closest("button")!)
      expect(onRetryLoadToolkits).toHaveBeenCalledTimes(1)
    })

    it("shows integration name error message", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          integrationName="Lead score"
          integrationNameError={`"Integration test 1" already exists. Please enter a unique name.`}
        />
      )
      expect(
        screen.getByText(
          `"Integration test 1" already exists. Please enter a unique name.`
        )
      ).toBeInTheDocument()
    })

    it("integration name input has error border when error is set", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          integrationName="Lead score"
          integrationNameError="Name already exists"
        />
      )
      const input = screen.getByPlaceholderText("Enter integration name")
      expect(input).toHaveClass("border-semantic-error-primary")
    })
  })

  // ─── Step 2: Connect Account (idle, no existing accounts) ────────────

  describe("Step 2: Connect Account (idle, no existing accounts)", () => {
    it("renders 'Connect your Account' title with back arrow", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          onBack={vi.fn()}
        />
      )
      expect(screen.getByText("Connect your Account")).toBeInTheDocument()
      expect(screen.getByLabelText("Go back")).toBeInTheDocument()
    })

    it("shows toolkit icon and name", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(screen.getByText("Connect Google Sheets")).toBeInTheDocument()
      expect(
        screen.getByAltText("Google Sheets logo")
      ).toBeInTheDocument()
    })

    it("shows '+ Connect a New Account' button", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(
        screen.getByText("Connect a New Account")
      ).toBeInTheDocument()
    })

    it("onConnectNewAccount fires on click", () => {
      const onConnectNewAccount = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          onConnectNewAccount={onConnectNewAccount}
        />
      )
      fireEvent.click(
        screen.getByText("Connect a New Account").closest("button")!
      )
      expect(onConnectNewAccount).toHaveBeenCalledTimes(1)
    })

    it("onBack fires when back arrow clicked", () => {
      const onBack = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          onBack={onBack}
        />
      )
      fireEvent.click(screen.getByLabelText("Go back"))
      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  // ─── Step 2: Connect Account (idle, with existing accounts) ──────────

  describe("Step 2: Connect Account (idle, with existing accounts)", () => {
    it("renders existing accounts list", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
        />
      )
      expect(
        screen.getByText("Existing Connected Accounts")
      ).toBeInTheDocument()
      expect(screen.getByText("acc_89xv2m9")).toBeInTheDocument()
      expect(screen.getByText("acc_34pq7n1")).toBeInTheDocument()
    })

    it("shows 'Active' badge for the active account", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
        />
      )
      // Only one "Active" badge should appear (first account is active)
      const activeBadges = screen.getAllByText("Active")
      expect(activeBadges).toHaveLength(1)
    })

    it("does NOT render a delete button for any account", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
        />
      )
      expect(
        screen.queryByLabelText(/Delete account/i)
      ).not.toBeInTheDocument()
    })

    it("shows 'Continue' on the active account and 'Switch' on inactive ones", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
        />
      )
      const continueButtons = screen.getAllByRole("button", {
        name: "Continue",
      })
      const switchButtons = screen.getAllByRole("button", { name: "Switch" })
      expect(continueButtons).toHaveLength(1)
      expect(switchButtons).toHaveLength(1)
    })

    it("shows 'Continue' on ALL accounts when none is marked active", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccountsNoActive}
        />
      )
      const continueButtons = screen.getAllByRole("button", {
        name: "Continue",
      })
      expect(continueButtons).toHaveLength(2)
      expect(
        screen.queryByRole("button", { name: "Switch" })
      ).not.toBeInTheDocument()
    })

    it("active and inactive account cards share the same neutral border (Active badge is the sole indicator)", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
        />
      )
      const activeCard = screen
        .getByText("acc_89xv2m9")
        .closest("div.border-semantic-border-layout")
      const inactiveCard = screen
        .getByText("acc_34pq7n1")
        .closest("div.border-semantic-border-layout")
      expect(activeCard).toBeInTheDocument()
      expect(inactiveCard).toBeInTheDocument()
      // Neither card should have a success-colored border
      expect(
        document.querySelector("div.border-semantic-success-border")
      ).not.toBeInTheDocument()
    })

    it("onContinueAccount fires with the active account when Continue is clicked", () => {
      const onContinueAccount = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
          onContinueAccount={onContinueAccount}
        />
      )
      fireEvent.click(screen.getByRole("button", { name: "Continue" }))
      expect(onContinueAccount).toHaveBeenCalledWith(mockAccounts[0])
    })

    it("onSwitchAccount fires with the inactive account when Switch is clicked", () => {
      const onSwitchAccount = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
          onSwitchAccount={onSwitchAccount}
        />
      )
      fireEvent.click(screen.getByRole("button", { name: "Switch" }))
      expect(onSwitchAccount).toHaveBeenCalledWith(mockAccounts[1])
    })

    it("onContinueAccount fires for sole account when none is active", () => {
      const onContinueAccount = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={[mockAccountsNoActive[0]]}
          onContinueAccount={onContinueAccount}
        />
      )
      fireEvent.click(screen.getByRole("button", { name: "Continue" }))
      expect(onContinueAccount).toHaveBeenCalledWith(mockAccountsNoActive[0])
    })

    it("renders Expired badge and Reconnect for accountStatus expired", () => {
      const accounts: ComposioConnectedAccount[] = [
        {
          id: "a1",
          label: "expired_acc",
          createdBy: "User",
          createdAt: "Jan 1, 2026",
          accountStatus: "expired",
        },
      ]
      const onReconnectAccount = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={accounts}
          onReconnectAccount={onReconnectAccount}
        />
      )
      expect(screen.getByText("Expired")).toBeInTheDocument()
      fireEvent.click(screen.getByRole("button", { name: "Reconnect" }))
      expect(onReconnectAccount).toHaveBeenCalledWith(accounts[0])
    })

    it("renders Initialized badge and spinner for accountStatus initialized", () => {
      const accounts: ComposioConnectedAccount[] = [
        {
          id: "a1",
          label: "init_acc",
          createdBy: "User",
          createdAt: "Jan 1, 2026",
          accountStatus: "initialized",
        },
      ]
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={accounts}
        />
      )
      expect(screen.getByText("Initialized")).toBeInTheDocument()
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("hides Connect a New Account when showConnectNewAccountButton is false", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={mockAccounts}
          showConnectNewAccountButton={false}
        />
      )
      expect(
        screen.queryByRole("button", { name: "Connect a New Account" })
      ).not.toBeInTheDocument()
    })

    it("hides account action column when showAccountAction is false", () => {
      const accounts: ComposioConnectedAccount[] = [
        {
          id: "a1",
          label: "no_action",
          createdBy: "User",
          createdAt: "Jan 1, 2026",
          isActive: true,
          showAccountAction: false,
        },
      ]
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="idle"
          selectedToolkit={mockToolkits[0]}
          connectedAccounts={accounts}
        />
      )
      expect(
        screen.queryByRole("button", { name: "Continue" })
      ).not.toBeInTheDocument()
    })
  })

  // ─── Step 2: Connecting state ────────────────────────────────────────

  describe("Step 2: Connecting state", () => {
    it("shows spinner when connectionStatus='connecting'", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="connecting"
          selectedToolkit={mockToolkits[1]}
        />
      )
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("shows toolkit name", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="connecting"
          selectedToolkit={mockToolkits[1]}
        />
      )
      expect(screen.getByText("Connect Slack")).toBeInTheDocument()
    })
  })

  // ─── Step 2: Auth Error — Platform ───────────────────────────────────

  describe("Step 2: Auth Error — Platform", () => {
    it("shows Connection Failed error banner", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="platform"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(screen.getByText("Connection Failed")).toBeInTheDocument()
      expect(
        screen.getByText("Unable to connect to Google Sheets right now.")
      ).toBeInTheDocument()
    })

    it("shows StepHeader with 'Connect your Account'", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="platform"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(screen.getByText("Connect your Account")).toBeInTheDocument()
    })

    it("shows toolkit icon and name", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="platform"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(screen.getByText("Connect Google Sheets")).toBeInTheDocument()
      expect(screen.getByAltText("Google Sheets logo")).toBeInTheDocument()
    })

    it("onRetryConnection fires when retry button clicked", () => {
      const onRetryConnection = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="platform"
          selectedToolkit={mockToolkits[0]}
          onRetryConnection={onRetryConnection}
        />
      )
      fireEvent.click(screen.getByText("Please Try Again").closest("button")!)
      expect(onRetryConnection).toHaveBeenCalledTimes(1)
    })
  })

  // ─── Step 2: Auth Error — Redirect ─────────────────────────────────

  describe("Step 2: Auth Error — Redirect", () => {
    it("shows Connection Failed with warning triangle", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="redirect"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(screen.getByText("Connection Failed")).toBeInTheDocument()
      expect(
        screen.getByText("Unable to connect to Google Sheets right now.")
      ).toBeInTheDocument()
      // Warning icon in error-surface circle
      const dialog = screen.getByRole("dialog")
      const errorCircle = dialog.querySelector(
        ".bg-semantic-error-surface"
      )
      expect(errorCircle).toBeInTheDocument()
    })

    it("does not show StepHeader (standalone layout)", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="redirect"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(
        screen.queryByText("Connect your Account")
      ).not.toBeInTheDocument()
    })

    it("onRetryConnection fires when retry button clicked", () => {
      const onRetryConnection = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="connect-account"
          connectionStatus="error"
          connectionErrorVariant="redirect"
          selectedToolkit={mockToolkits[0]}
          onRetryConnection={onRetryConnection}
        />
      )
      fireEvent.click(screen.getByText("Please Try Again").closest("button")!)
      expect(onRetryConnection).toHaveBeenCalledTimes(1)
    })
  })

  // ─── Step 2: Auth Error — Inline ─────────────────────────────────────

  describe("Step 2: Auth Error — Inline", () => {
    const inlineErrorProps = {
      ...modalProps,
      toolkits: mockToolkits,
      step: "connect-account" as const,
      connectionStatus: "error" as const,
      connectionErrorVariant: "inline" as const,
      selectedToolkit: mockToolkits[0],
      connectedAccounts: mockAccounts,
    }

    it("keeps StepHeader with 'Connect your Account'", () => {
      render(<AddIntegration {...inlineErrorProps} />)
      expect(screen.getByText("Connect your Account")).toBeInTheDocument()
    })

    it("still renders the existing accounts list", () => {
      render(<AddIntegration {...inlineErrorProps} />)
      expect(
        screen.getByText("Existing Connected Accounts")
      ).toBeInTheDocument()
      expect(screen.getByText("acc_89xv2m9")).toBeInTheDocument()
      expect(screen.getByText("acc_34pq7n1")).toBeInTheDocument()
    })

    it("shows the Connection Failed error banner", () => {
      render(<AddIntegration {...inlineErrorProps} />)
      expect(screen.getByText("Connection Failed")).toBeInTheDocument()
      expect(
        screen.getByText("Unable to connect to Google Sheets right now.")
      ).toBeInTheDocument()
    })

    it("shows a 'Retry Connection' button (not 'Please Try Again')", () => {
      render(<AddIntegration {...inlineErrorProps} />)
      expect(
        screen.getByRole("button", { name: /Retry Connection/i })
      ).toBeInTheDocument()
    })

    it("does NOT show the '+ Connect a New Account' button", () => {
      render(<AddIntegration {...inlineErrorProps} />)
      expect(
        screen.queryByText("Connect a New Account")
      ).not.toBeInTheDocument()
    })

    it("onRetryConnection fires when Retry Connection is clicked", () => {
      const onRetryConnection = vi.fn()
      render(
        <AddIntegration
          {...inlineErrorProps}
          onRetryConnection={onRetryConnection}
        />
      )
      fireEvent.click(
        screen.getByRole("button", { name: /Retry Connection/i })
      )
      expect(onRetryConnection).toHaveBeenCalledTimes(1)
    })
  })

  // ─── Step 3: Success ─────────────────────────────────────────────────

  describe("Step 3: Success", () => {
    it("shows success checkmark", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="success"
          selectedToolkit={mockToolkits[0]}
        />
      )
      // CheckCircle2 renders an svg inside a success-surface circle
      const dialog = screen.getByRole("dialog")
      const successCircle = dialog.querySelector(
        ".bg-semantic-success-surface"
      )
      expect(successCircle).toBeInTheDocument()
    })

    it("shows 'Successfully connected to [toolkit name]!'", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="success"
          selectedToolkit={mockToolkits[0]}
        />
      )
      expect(
        screen.getByText("Successfully connected to")
      ).toBeInTheDocument()
      expect(screen.getByText("Google Sheets!")).toBeInTheDocument()
    })

    it("onClose fires on X click", () => {
      const onClose = vi.fn()
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="success"
          selectedToolkit={mockToolkits[0]}
          onClose={onClose}
        />
      )
      fireEvent.click(screen.getByLabelText("Close"))
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  // ─── General ─────────────────────────────────────────────────────────

  describe("General", () => {
    it("custom className is applied to dialog content", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          className="custom-test-class"
        />
      )
      expect(screen.getByRole("dialog")).toHaveClass("custom-test-class")
    })

    it("additional props spread (data-testid)", () => {
      render(
        <AddIntegration
          {...modalProps}
          toolkits={mockToolkits}
          step="select-toolkit"
          data-testid="integration-wizard"
        />
      )
      expect(screen.getByTestId("integration-wizard")).toBeInTheDocument()
    })

    it("does not render when closed", () => {
      render(
        <AddIntegration
          open={false}
          onOpenChange={vi.fn()}
          toolkits={mockToolkits}
          step="select-toolkit"
        />
      )
      expect(screen.queryByText("Select Toolkit")).not.toBeInTheDocument()
    })
  })
})
