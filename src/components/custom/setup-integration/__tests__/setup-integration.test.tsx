import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SetupIntegration } from "../setup-integration"
import { ChatMessageBubble } from "../chat-message"
import { ChatInput } from "../chat-input"
import type { ChatMessage } from "../types"

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! How can I help you set up your integration?",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
]

/** Shared props — modal must be open */
const modalProps = { open: true, onOpenChange: vi.fn() }

describe("SetupIntegration", () => {
  // ─── Basic Rendering ──────────────────────────────────────────

  it("renders with title and subtitle", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Setup Integration"
        subtitle="Step 3 of 4"
      />
    )
    const titles = screen.getAllByText("Setup Integration")
    // One sr-only DialogTitle + one visible h2
    expect(titles.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText("Step 3 of 4")).toBeInTheDocument()
  })

  it("renders AI Assistant bar", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(screen.getByText("AI Assistant")).toBeInTheDocument()
  })

  it("renders chat messages", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(
      screen.getByText("Hello! How can I help you set up your integration?")
    ).toBeInTheDocument()
    expect(screen.getByText("Add Row")).toBeInTheDocument()
  })

  it("renders action button with label", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
      />
    )
    expect(
      screen.getByRole("button", { name: "Test Integration" })
    ).toBeInTheDocument()
  })

  it("renders input with placeholder", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        inputPlaceholder="Type something..."
      />
    )
    expect(
      screen.getByPlaceholderText("Type something...")
    ).toBeInTheDocument()
  })

  // ─── Modal behavior ──────────────────────────────────────────

  it("does not render when closed", () => {
    render(
      <SetupIntegration
        open={false}
        onOpenChange={vi.fn()}
        messages={sampleMessages}
      />
    )
    expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument()
  })

  it("renders dialog when open", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  // ─── Callbacks ──────────────────────────────────────────

  it("opens discard confirmation when close button is clicked", () => {
    const onClose = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    )
    fireEvent.click(screen.getByLabelText("Close"))
    expect(screen.getByText("Discard integration?")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Are you sure you want to close this? Unsaved progress will be lost."
      )
    ).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it("calls onClose when discard is confirmed via close button", () => {
    const onClose = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    )
    fireEvent.click(screen.getByLabelText("Close"))
    fireEvent.click(screen.getByRole("button", { name: "Discard" }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("does not call onClose when discard is cancelled", () => {
    const onClose = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    )
    fireEvent.click(screen.getByLabelText("Close"))
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it("opens discard confirmation when back button is clicked", () => {
    const onBack = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onBack={onBack}
      />
    )
    fireEvent.click(screen.getByLabelText("Go back"))
    expect(screen.getByText("Discard integration?")).toBeInTheDocument()
    expect(onBack).not.toHaveBeenCalled()
  })

  it("opens confirmation modal when Reset Chat is clicked", () => {
    const onResetChat = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    )
    fireEvent.click(screen.getByText("Reset Chat"))
    // Confirmation modal should appear
    expect(screen.getByText("Reset Chat?")).toBeInTheDocument()
    expect(
      screen.getByText(
        "This will clear your entire conversation. This cannot be undone."
      )
    ).toBeInTheDocument()
    // onResetChat should NOT have been called yet
    expect(onResetChat).not.toHaveBeenCalled()
  })

  it("calls onResetChat when confirmation modal is confirmed", () => {
    const onResetChat = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    )
    fireEvent.click(screen.getByText("Reset Chat"))
    // Click Confirm in the modal
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }))
    expect(onResetChat).toHaveBeenCalledOnce()
  })

  it("does not call onResetChat when confirmation is cancelled", () => {
    const onResetChat = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    )
    fireEvent.click(screen.getByText("Reset Chat"))
    // Click Cancel in the modal
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onResetChat).not.toHaveBeenCalled()
  })

  it("calls onAction when action button is clicked", () => {
    const onAction = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        onAction={onAction}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Test Integration" }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  // ─── Action button states ──────────────────────────────────────

  it("disables action button when isActionDisabled is true", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        isActionDisabled
      />
    )
    expect(
      screen.getByRole("button", { name: "Test Integration" })
    ).toBeDisabled()
  })

  it("disables action button when isActionLoading is true", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        isActionLoading
      />
    )
    expect(
      screen.getByRole("button", { name: /Test Integration/ })
    ).toBeDisabled()
  })

  // ─── Header variations ──────────────────────────────────────

  it("hides back button when onBack is not provided", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument()
  })

  it("hides close button when onClose is not provided", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument()
  })

  it("hides Reset Chat when onResetChat is not provided", () => {
    render(
      <SetupIntegration {...modalProps} messages={sampleMessages} />
    )
    expect(screen.queryByText("Reset Chat")).not.toBeInTheDocument()
  })

  // ─── Custom className ──────────────────────────────────────

  it("merges custom className", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        className="custom-class"
      />
    )
    const dialog = screen.getByRole("dialog")
    // className is merged onto the DialogContent element itself (the dialog role element)
    expect(dialog.classList.contains("custom-class")).toBe(true)
  })

  // ─── Editable integration name ──────────────────────────────────

  it("renders integration name with pencil icon when integrationName is provided", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={vi.fn()}
      />
    )
    expect(screen.getByText("Integration test 1")).toBeInTheDocument()
    expect(screen.getByLabelText("Edit integration name")).toBeInTheDocument()
  })

  it("enters edit mode when pencil icon is clicked", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText("Edit integration name"))
    expect(screen.getByLabelText("Integration name")).toBeInTheDocument()
    expect(screen.getByLabelText("Confirm name")).toBeInTheDocument()
  })

  it("calls onIntegrationNameChange when name is confirmed", () => {
    const onNameChange = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    )
    fireEvent.click(screen.getByLabelText("Edit integration name"))
    const input = screen.getByLabelText("Integration name")
    fireEvent.change(input, { target: { value: "New name" } })
    fireEvent.click(screen.getByLabelText("Confirm name"))
    expect(onNameChange).toHaveBeenCalledWith("New name")
  })

  it("confirms name edit on Enter key", () => {
    const onNameChange = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    )
    fireEvent.click(screen.getByLabelText("Edit integration name"))
    const input = screen.getByLabelText("Integration name")
    fireEvent.change(input, { target: { value: "Updated" } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onNameChange).toHaveBeenCalledWith("Updated")
  })

  it("cancels name edit on Escape key", () => {
    const onNameChange = vi.fn()
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    )
    fireEvent.click(screen.getByLabelText("Edit integration name"))
    const input = screen.getByLabelText("Integration name")
    fireEvent.change(input, { target: { value: "Discarded" } })
    fireEvent.keyDown(input, { key: "Escape" })
    expect(onNameChange).not.toHaveBeenCalled()
    // Should exit edit mode and show the original name
    expect(screen.getByText("Integration test 1")).toBeInTheDocument()
  })

  it("does not show pencil icon when onIntegrationNameChange is not provided", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
      />
    )
    expect(screen.getByText("Integration test 1")).toBeInTheDocument()
    expect(
      screen.queryByLabelText("Edit integration name")
    ).not.toBeInTheDocument()
  })
})

// ─── ChatMessageBubble ──────────────────────────────────────────

describe("ChatMessageBubble", () => {
  it("renders assistant message with info surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{ id: "1", role: "assistant", content: "Hello!" }}
      />
    )
    expect(screen.getByText("Hello!")).toBeInTheDocument()
    expect(
      container.querySelector(".bg-semantic-info-surface")
    ).toBeTruthy()
  })

  it("renders user message with gray surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{ id: "2", role: "user", content: "Add Row" }}
      />
    )
    expect(screen.getByText("Add Row")).toBeInTheDocument()
    expect(container.querySelector(".bg-semantic-bg-ui")).toBeTruthy()
  })

  it("renders status variant as muted text with avatar", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "3",
          role: "assistant",
          content: "Mapping tool.",
          variant: "status",
        }}
      />
    )
    expect(screen.getByText("Mapping tool.")).toBeInTheDocument()
    // Status text should be muted
    const statusText = screen.getByText("Mapping tool.")
    expect(statusText.classList.contains("text-semantic-text-muted")).toBe(true)
  })

  it("renders statusLabel above message bubble", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "5",
          role: "assistant",
          content: "Test content here",
          statusLabel: "Running test...",
        }}
      />
    )
    expect(screen.getByText("Running test...")).toBeInTheDocument()
    expect(screen.getByText("Test content here")).toBeInTheDocument()
  })

  it("renders success variant with green surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "4",
          role: "assistant",
          content: "Test passed!",
          variant: "success",
        }}
      />
    )
    expect(screen.getByText("Test passed!")).toBeInTheDocument()
    expect(
      container.querySelector(".bg-semantic-success-surface")
    ).toBeTruthy()
  })

  it("renders error variant with red error surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "5",
          role: "assistant",
          content: "Something went wrong processing your message. Please try again.",
          variant: "error",
        }}
      />
    )
    expect(
      screen.getByText(
        "Something went wrong processing your message. Please try again."
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(".bg-semantic-error-surface")
    ).toBeTruthy()
  })

  it("renders error variant with error text color", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "6",
          role: "assistant",
          content: "Error occurred",
          variant: "error",
        }}
      />
    )
    const text = screen.getByText("Error occurred")
    expect(text.classList.contains("text-semantic-error-text")).toBe(true)
  })

  it("renders error variant left-aligned like assistant messages", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "7",
          role: "assistant",
          content: "Error message",
          variant: "error",
        }}
      />
    )
    // Error messages use the same left-aligned layout as assistant messages (no justify-end)
    expect(container.querySelector(".justify-end")).toBeFalsy()
    expect(
      container.querySelector(".rounded-tl-none")
    ).toBeTruthy()
  })
})

// ─── ChatInput ──────────────────────────────────────────

describe("ChatInput", () => {
  it("renders with placeholder", () => {
    render(<ChatInput value="" placeholder="Type here..." />)
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument()
  })

  it("calls onValueChange when typing", () => {
    const onValueChange = vi.fn()
    render(
      <ChatInput value="" onValueChange={onValueChange} />
    )
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello" },
    })
    expect(onValueChange).toHaveBeenCalledWith("Hello")
  })

  it("calls onSend when Enter is pressed with non-empty value", () => {
    const onSend = vi.fn()
    render(<ChatInput value="Add Row" onSend={onSend} />)
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" })
    expect(onSend).toHaveBeenCalledWith("Add Row")
  })

  it("does not call onSend when Enter is pressed with empty value", () => {
    const onSend = vi.fn()
    render(<ChatInput value="" onSend={onSend} />)
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" })
    expect(onSend).not.toHaveBeenCalled()
  })

  it("calls onSend when send button is clicked", () => {
    const onSend = vi.fn()
    render(<ChatInput value="Test" onSend={onSend} />)
    fireEvent.click(screen.getByLabelText("Send message"))
    expect(onSend).toHaveBeenCalledWith("Test")
  })

  it("disables input when disabled prop is true", () => {
    render(<ChatInput value="" disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("disables send button when value is empty", () => {
    render(<ChatInput value="" />)
    expect(screen.getByLabelText("Send message")).toBeDisabled()
  })
})
