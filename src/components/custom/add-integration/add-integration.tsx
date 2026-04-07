import * as React from "react"
import { Search, Plus, CheckCircle2, ArrowLeft, X, RotateCcw, AlertCircle, XCircle, AlertTriangle } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Spinner } from "../../ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog"
import { StepHeader } from "./step-header"
import { ToolkitCard } from "./toolkit-card"
import { ConnectedAccountCard } from "./connected-account-card"
import type {
  AddIntegrationProps,
  ComposioToolkit,
} from "./types"

const AddIntegration = React.forwardRef<HTMLDivElement, AddIntegrationProps>(
  (
    {
      className,
      open,
      onOpenChange,
      toolkits,
      connectedAccounts = [],
      step = "select-toolkit",
      totalSteps = 4,
      currentStepNumber = 1,
      connectionStatus = "idle",
      connectionErrorVariant = "platform",
      selectedToolkit = null,
      integrationName = "",
      searchQuery = "",
      isLoadingToolkits = false,
      isToolkitLoadError = false,
      integrationNameError,
      onClose,
      onNext,
      onBack,
      onToolkitSelect,
      onIntegrationNameChange,
      onSearchChange,
      onConnectNewAccount,
      onUseExistingAccount,
      onDeleteAccount,
      onRetryLoadToolkits,
      onRetryConnection,
      ...props
    },
    ref
  ) => {
    const filteredToolkits = React.useMemo(() => {
      if (!searchQuery) return toolkits
      const query = searchQuery.toLowerCase()
      return toolkits.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }, [toolkits, searchQuery])

    const isNextDisabled =
      !selectedToolkit || !integrationName.trim()

    const handleNext = () => {
      if (selectedToolkit && integrationName.trim() && onNext) {
        onNext({ integrationName: integrationName.trim(), selectedToolkit })
      }
    }

    const handleToolkitSelect = (toolkit: ComposioToolkit) => {
      onToolkitSelect?.(toolkit)
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          hideCloseButton
          className={cn(
            "w-[744px] max-w-none gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary p-0 shadow-sm",
            className
          )}
          {...props}
        >
          <DialogTitle className="sr-only">Add Integration</DialogTitle>

          {/* Step 1: Select Toolkit */}
          {step === "select-toolkit" && (
            <>
              <StepHeader
                title="Select Toolkit"
                subtitle={`Step ${currentStepNumber} of ${totalSteps}`}
                onClose={onClose}
              />
              <div className="flex flex-col gap-6 p-6">
                {/* Integration Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold tracking-wide text-semantic-text-primary">
                    Integration Name
                  </label>
                  <Input
                    placeholder="Enter integration name"
                    value={integrationName}
                    onChange={(e) => onIntegrationNameChange?.(e.target.value)}
                    className={cn(
                      integrationNameError &&
                        "border-semantic-error-primary focus-visible:ring-semantic-error-primary"
                    )}
                  />
                  {integrationNameError && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="size-3.5 shrink-0 text-semantic-error-primary" />
                      <p className="m-0 text-xs tracking-wide text-semantic-error-primary">
                        {integrationNameError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Choose a Tool to Connect */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold tracking-wide text-semantic-text-primary">
                      Choose a Tool to Connect
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-semantic-text-muted" />
                      <Input
                        placeholder="Search Integration"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Toolkit Grid */}
                  {isLoadingToolkits ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Spinner size="lg" />
                      <p className="m-0 mt-3 text-sm tracking-wide text-semantic-text-muted">
                        Loading...
                      </p>
                    </div>
                  ) : isToolkitLoadError ? (
                    <div className="flex flex-col items-center justify-center gap-5 rounded bg-semantic-bg-ui px-4 py-12">
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <p className="m-0 text-sm font-semibold tracking-wide text-semantic-text-secondary">
                          Unable to load toolkits.
                        </p>
                        <p className="m-0 max-w-[364px] text-sm tracking-wide text-semantic-text-muted">
                          There was a problem fetching the available integrations.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onRetryLoadToolkits}
                        className="flex h-10 items-center justify-center gap-2 rounded border border-semantic-border-layout bg-semantic-bg-primary px-6 text-sm font-semibold tracking-wide text-semantic-text-secondary transition-colors hover:bg-semantic-bg-hover"
                      >
                        <RotateCcw className="size-[18px]" />
                        Please Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="grid max-h-[324px] grid-cols-2 gap-3 overflow-y-auto">
                      {filteredToolkits.length === 0 ? (
                        <div className="col-span-2 py-12 text-center">
                          <p className="m-0 text-sm text-semantic-text-muted">
                            No integrations found
                          </p>
                        </div>
                      ) : (
                        filteredToolkits.map((toolkit) => (
                          <ToolkitCard
                            key={toolkit.slug}
                            toolkit={toolkit}
                            isSelected={selectedToolkit?.slug === toolkit.slug}
                            onClick={handleToolkitSelect}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <div className="flex items-center justify-end">
                  <Button
                    variant={isNextDisabled ? "secondary" : "primary"}
                    disabled={isNextDisabled}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Connect Account */}
          {step === "connect-account" && connectionStatus === "idle" && (
            <>
              <StepHeader
                title="Connect your Account"
                subtitle={`Step ${currentStepNumber} of ${totalSteps}`}
                showBack
                onBack={onBack}
                onClose={onClose}
              />
              <div className="flex flex-col items-center overflow-hidden p-8">
                <div className="flex w-full flex-col items-center gap-8">
                  {/* Toolkit Icon + Title */}
                  <div className="flex flex-col items-center gap-4">
                    {selectedToolkit && (
                      <div className="flex size-[58px] items-center justify-center rounded-full bg-semantic-bg-ui">
                        <img
                          src={selectedToolkit.logo}
                          alt={`${selectedToolkit.name} logo`}
                          className="size-10 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                        Connect {selectedToolkit?.name}
                      </h3>
                      <p className="m-0 max-w-[285px] text-sm tracking-wide text-semantic-text-muted">
                        Authorise your account to allow the bot to access your
                        data securely.
                      </p>
                    </div>
                  </div>

                  {/* Existing Connected Accounts */}
                  {connectedAccounts.length > 0 && (
                    <div className="flex w-full flex-col gap-6">
                      <div className="flex max-h-[180px] flex-col gap-2.5 overflow-y-auto">
                        <p className="m-0 text-sm font-semibold tracking-wide text-semantic-text-primary">
                          Existing connected accounts
                        </p>
                        <div className="flex flex-col gap-3">
                          {connectedAccounts.map((account) => (
                            <ConnectedAccountCard
                              key={account.id}
                              account={account}
                              onUse={onUseExistingAccount ?? (() => {})}
                              onDelete={onDeleteAccount ?? (() => {})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Connect a New Account */}
                  <button
                    type="button"
                    onClick={onConnectNewAccount}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded border border-semantic-border-layout bg-semantic-bg-primary text-sm font-semibold tracking-wide text-semantic-text-secondary transition-colors hover:bg-semantic-bg-hover"
                  >
                    <Plus className="size-[18px]" />
                    Connect a New Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Auth Loading (connecting) */}
          {step === "connect-account" && connectionStatus === "connecting" && (
            <>
              <div className="flex items-center justify-between p-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="size-6" />
                </button>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-8 shrink-0 items-center justify-center rounded text-semantic-text-primary hover:text-semantic-text-secondary hover:bg-semantic-bg-hover transition-colors"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex h-[292px] flex-col items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="xl" />
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                      Connect {selectedToolkit?.name}
                    </h3>
                    <p className="m-0 max-w-[285px] text-sm tracking-wide text-semantic-text-muted">
                      Authorise your account to allow the bot to access your data
                      securely.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Auth Error — Platform (inline on connect page) */}
          {step === "connect-account" &&
            connectionStatus === "error" &&
            connectionErrorVariant === "platform" && (
              <>
                <StepHeader
                  title="Connect your Account"
                  subtitle={`Step ${currentStepNumber} of ${totalSteps}`}
                  showBack
                  onBack={onBack}
                  onClose={onClose}
                />
                <div className="flex flex-col items-center overflow-hidden p-8">
                  <div className="flex w-full flex-col items-center gap-8">
                    {/* Toolkit Icon + Title */}
                    <div className="flex flex-col items-center gap-4">
                      {selectedToolkit && (
                        <div className="flex size-[58px] items-center justify-center rounded-full bg-semantic-bg-ui">
                          <img
                            src={selectedToolkit.logo}
                            alt={`${selectedToolkit.name} logo`}
                            className="size-10 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                          Connect {selectedToolkit?.name}
                        </h3>
                        <p className="m-0 max-w-[285px] text-sm tracking-wide text-semantic-text-muted">
                          Authorise your account to allow the bot to access your
                          data securely.
                        </p>
                      </div>
                    </div>

                    {/* Error Banner */}
                    <div className="flex w-full flex-col gap-6">
                      <div className="flex gap-4 rounded border border-semantic-error-border bg-semantic-error-surface p-4">
                        <XCircle className="size-6 shrink-0 text-semantic-error-text" />
                        <div className="flex flex-col gap-1.5">
                          <p className="m-0 text-sm font-semibold leading-5 tracking-wide text-semantic-error-text">
                            Connection Failed
                          </p>
                          <p className="m-0 text-xs text-semantic-error-text">
                            Unable to connect to {selectedToolkit?.name} right now.
                          </p>
                        </div>
                      </div>

                      {/* Retry Button — full-width dark */}
                      <button
                        type="button"
                        onClick={onRetryConnection}
                        className="flex h-10 w-full items-center justify-center rounded bg-semantic-primary-hover px-4 text-sm font-semibold tracking-wide text-semantic-text-inverted transition-colors hover:opacity-90"
                      >
                        Please Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          {/* Step 2: Auth Error — Redirect (standalone centered) */}
          {step === "connect-account" &&
            connectionStatus === "error" &&
            connectionErrorVariant === "redirect" && (
              <>
                <div className="flex items-center justify-between p-6">
                  <button
                    type="button"
                    onClick={onBack}
                    className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="size-6" />
                  </button>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
                      aria-label="Close"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
                <div className="flex h-[292px] flex-col items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-semantic-error-surface">
                      <AlertTriangle className="size-10 text-semantic-error-primary" />
                    </div>
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                          Connection Failed
                        </h3>
                        <p className="m-0 max-w-[285px] text-sm tracking-wide text-semantic-text-muted">
                          Unable to connect to {selectedToolkit?.name} right now.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onRetryConnection}
                        className="flex h-10 items-center justify-center rounded bg-semantic-primary-hover px-4 text-sm font-semibold tracking-wide text-semantic-text-inverted transition-colors hover:opacity-90"
                      >
                        Please Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          {/* Step 3: Success */}
          {step === "success" && (
            <>
              <div className="flex items-center justify-between p-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="size-6" />
                </button>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-8 shrink-0 items-center justify-center rounded text-semantic-text-primary hover:text-semantic-text-secondary hover:bg-semantic-bg-hover transition-colors"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex h-[292px] flex-col items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-semantic-success-surface">
                    <CheckCircle2 className="size-10 text-semantic-success-primary" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                      Successfully connected to
                    </h3>
                    <h3 className="m-0 text-lg font-semibold text-semantic-text-primary">
                      {selectedToolkit?.name}!
                    </h3>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    )
  }
)
AddIntegration.displayName = "AddIntegration"

export { AddIntegration }
