import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SetupIntegration } from "../setup-integration";
import { SetupIntegrationView } from "../setup-integration-view";
import { IntegrationHeader } from "../integration-header";
import { IntegrationChatMessages } from "../integration-chat-messages";
import { IntegrationChatEmptyHint } from "../integration-chat-empty-hint";
import { IntegrationChatEmptySecondary } from "../integration-chat-empty-secondary";
import { ChatMessageBubble } from "../chat-message";
import { ChatInput } from "../chat-input";
import type { ChatMessage } from "../types";

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
];

/** Shared props — modal must be open */
const modalProps = { open: true, onOpenChange: vi.fn() };

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
    );
    const titles = screen.getAllByText("Setup Integration");
    // One sr-only DialogTitle + one visible h2
    expect(titles.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Step 3 of 4")).toBeInTheDocument();
  });

  it("renders AI Assistant bar", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("renders chat messages", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(
      screen.getByText("Hello! How can I help you set up your integration?")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Row")).toBeInTheDocument();
  });

  it("renders action button with label", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
      />
    );
    expect(
      screen.getByRole("button", { name: "Test Integration" })
    ).toBeInTheDocument();
  });

  it("renders input with placeholder", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        inputPlaceholder="Type something..."
      />
    );
    expect(
      screen.getByPlaceholderText("Type something...")
    ).toBeInTheDocument();
  });

  // ─── Modal behavior ──────────────────────────────────────────

  it("does not render when closed", () => {
    render(
      <SetupIntegration
        open={false}
        onOpenChange={vi.fn()}
        messages={sampleMessages}
      />
    );
    expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument();
  });

  it("renders dialog when open", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // ─── Callbacks ──────────────────────────────────────────

  it("opens discard confirmation when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.getByText("Discard integration?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to close this? Unsaved progress will be lost."
      )
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when discard is confirmed via close button", () => {
    const onClose = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByLabelText("Close"));
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when discard is cancelled", () => {
    const onClose = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByLabelText("Close"));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("opens discard confirmation when back button is clicked", () => {
    const onBack = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onBack={onBack}
      />
    );
    fireEvent.click(screen.getByLabelText("Go back"));
    expect(screen.getByText("Discard integration?")).toBeInTheDocument();
    expect(onBack).not.toHaveBeenCalled();
  });

  it("opens confirmation modal when Reset Chat is clicked", () => {
    const onResetChat = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    );
    fireEvent.click(screen.getByText("Reset Chat"));
    // Confirmation modal should appear
    expect(screen.getByText("Reset Chat?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will clear your entire conversation. This cannot be undone."
      )
    ).toBeInTheDocument();
    // onResetChat should NOT have been called yet
    expect(onResetChat).not.toHaveBeenCalled();
  });

  it("calls onResetChat when confirmation modal is confirmed", () => {
    const onResetChat = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    );
    fireEvent.click(screen.getByText("Reset Chat"));
    // Click Confirm in the modal
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onResetChat).toHaveBeenCalledOnce();
  });

  it("does not call onResetChat when confirmation is cancelled", () => {
    const onResetChat = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        onResetChat={onResetChat}
      />
    );
    fireEvent.click(screen.getByText("Reset Chat"));
    // Click Cancel in the modal
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onResetChat).not.toHaveBeenCalled();
  });

  it("calls onAction when action button is clicked", () => {
    const onAction = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        onAction={onAction}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Test Integration" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  // ─── Action button states ──────────────────────────────────────

  it("disables action button when isActionDisabled is true", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        isActionDisabled
      />
    );
    expect(
      screen.getByRole("button", { name: "Test Integration" })
    ).toBeDisabled();
  });

  it("disables action button when isActionLoading is true", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        actionLabel="Test Integration"
        isActionLoading
      />
    );
    expect(
      screen.getByRole("button", { name: /Test Integration/ })
    ).toBeDisabled();
  });

  // ─── Header variations ──────────────────────────────────────

  it("hides back button when onBack is not provided", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument();
  });

  it("hides close button when onClose is not provided", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("hides Reset Chat when onResetChat is not provided", () => {
    render(<SetupIntegration {...modalProps} messages={sampleMessages} />);
    expect(screen.queryByText("Reset Chat")).not.toBeInTheDocument();
  });

  // ─── Custom className ──────────────────────────────────────

  it("merges custom className", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        className="custom-class"
      />
    );
    const dialog = screen.getByRole("dialog");
    // className is merged onto the DialogContent element itself (the dialog role element)
    expect(dialog.classList.contains("custom-class")).toBe(true);
  });

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
    );
    expect(screen.getByText("Integration test 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit integration name")).toBeInTheDocument();
  });

  it("enters edit mode when pencil icon is clicked", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    expect(screen.getByLabelText("Integration name")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm name")).toBeInTheDocument();
  });

  it("calls onIntegrationNameChange when name is confirmed", () => {
    const onNameChange = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    const input = screen.getByLabelText("Integration name");
    fireEvent.change(input, { target: { value: "New name" } });
    fireEvent.click(screen.getByLabelText("Confirm name"));
    expect(onNameChange).toHaveBeenCalledWith("New name");
  });

  it("confirms name edit on Enter key", () => {
    const onNameChange = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    const input = screen.getByLabelText("Integration name");
    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onNameChange).toHaveBeenCalledWith("Updated");
  });

  it("cancels name edit on Escape key", () => {
    const onNameChange = vi.fn();
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onIntegrationNameChange={onNameChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    const input = screen.getByLabelText("Integration name");
    fireEvent.change(input, { target: { value: "Discarded" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onNameChange).not.toHaveBeenCalled();
    // Should exit edit mode and show the original name
    expect(screen.getByText("Integration test 1")).toBeInTheDocument();
  });

  it("SetupIntegrationView renders panel without dialog role", () => {
    render(
      <SetupIntegrationView
        messages={sampleMessages}
        title="Setup Integration"
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("shows empty transcript with default copy when messages is empty", () => {
    render(<SetupIntegrationView messages={[]} title="Setup Integration" />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
    expect(
      screen.getByText("Describe your integration action below to get started.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Describe what your bot should do with this integration/)
    ).toBeInTheDocument();
  });

  it("hides empty secondary block when emptyChatSecondary is null", () => {
    render(
      <SetupIntegrationView
        messages={[]}
        title="Setup Integration"
        emptyChatSecondary={null}
      />
    );
    expect(
      screen.queryByText(
        /Describe what your bot should do with this integration/
      )
    ).not.toBeInTheDocument();
  });

  it("shows custom empty transcript copy when props are set", () => {
    render(
      <SetupIntegrationView
        messages={[]}
        title="Setup Integration"
        emptyChatTitle="Start here"
        emptyChatDescription="Tell the assistant what to do."
      />
    );
    expect(screen.getByText("Start here")).toBeInTheDocument();
    expect(
      screen.getByText("Tell the assistant what to do.")
    ).toBeInTheDocument();
  });

  it("does not show pencil icon when neither rename callback is provided", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
      />
    );
    expect(screen.getByText("Integration test 1")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Edit integration name")
    ).not.toBeInTheDocument();
  });

  it("shows confirm loading state on IntegrationHeader when isIntegrationNameLoading", () => {
    render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onConfirmIntegrationName={vi.fn()}
        isIntegrationNameLoading
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    expect(screen.getByLabelText("Integration name")).toHaveAttribute(
      "readonly"
    );
    expect(screen.getByLabelText("Confirm name")).toBeDisabled();
    expect(screen.getByLabelText("Confirm name")).toHaveAttribute(
      "aria-busy",
      "true"
    );
  });

  it("calls onConfirmIntegrationName when confirming with async callback", async () => {
    const onConfirm = vi.fn();
    const { rerender } = render(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Integration test 1"
        onConfirmIntegrationName={onConfirm}
        isIntegrationNameLoading={false}
      />
    );
    fireEvent.click(screen.getByLabelText("Edit integration name"));
    const input = screen.getByLabelText("Integration name");
    fireEvent.change(input, { target: { value: "Renamed" } });
    fireEvent.click(screen.getByLabelText("Confirm name"));
    expect(onConfirm).toHaveBeenCalledWith("Renamed");

    rerender(
      <SetupIntegration
        {...modalProps}
        messages={sampleMessages}
        title="Edit Integration"
        integrationName="Renamed"
        onConfirmIntegrationName={onConfirm}
        isIntegrationNameLoading={false}
      />
    );
    await vi.waitFor(() => {
      expect(
        screen.queryByLabelText("Integration name")
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("Renamed")).toBeInTheDocument();
  });
});

// ─── IntegrationChatMessages / IntegrationChatEmptyHint ─────────

describe("IntegrationChatMessages", () => {
  it("does not force a fixed min-height when empty so short viewports can shrink", () => {
    const { container } = render(<IntegrationChatMessages messages={[]} />);
    expect(container.firstChild).not.toHaveClass("min-h-[454px]");
  });

  it("keeps flex-1 min-h-0 on the messages area for consistent flex layout", () => {
    const { container } = render(<IntegrationChatMessages messages={[]} />);
    expect(container.firstChild).toHaveClass("min-h-0");
    expect(container.firstChild).toHaveClass("flex-1");
  });

  it("keeps default messages area classes when a custom className is provided", () => {
    const { container } = render(
      <IntegrationChatMessages
        messages={[]}
        messagesAreaClassName="basis-0 custom-messages-area"
      />
    );
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("min-h-0");
    expect(container.firstChild).toHaveClass("flex-1");
    expect(container.firstChild).toHaveClass("basis-0");
    expect(container.firstChild).toHaveClass("custom-messages-area");
  });
});

describe("IntegrationHeader", () => {
  it("renders an explicit solid bottom border for host apps without Tailwind preflight", () => {
    const { container } = render(<IntegrationHeader />);
    expect(container.firstChild).toHaveClass("border-b");
    expect(container.firstChild).toHaveClass("border-solid");
    expect(container.firstChild).toHaveClass("border-semantic-border-layout");
  });
});

describe("IntegrationChatEmptyHint", () => {
  it("renders EmptyState with title and description", () => {
    render(<IntegrationChatEmptyHint title="T" description="D" />);
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="empty-state"]')
    ).toBeInTheDocument();
  });
});

describe("IntegrationChatEmptySecondary", () => {
  it("renders note with icon and text", () => {
    const { container } = render(
      <IntegrationChatEmptySecondary>
        Secondary tip.
      </IntegrationChatEmptySecondary>
    );
    expect(screen.getByRole("note")).toHaveTextContent("Secondary tip.");
    expect(
      container.querySelector(".border-semantic-border-layout")
    ).toBeTruthy();
  });
});

// ─── ChatMessageBubble ──────────────────────────────────────────

describe("ChatMessageBubble", () => {
  it("renders assistant message with info surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{ id: "1", role: "assistant", content: "Hello!" }}
      />
    );
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(container.querySelector(".bg-semantic-info-surface")).toBeTruthy();
  });

  it("renders user message with gray surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{ id: "2", role: "user", content: "Add Row" }}
      />
    );
    expect(screen.getByText("Add Row")).toBeInTheDocument();
    expect(container.querySelector(".bg-semantic-bg-ui")).toBeTruthy();
  });

  it("renders assistant loading state with bouncing typing indicator and primary surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "asst-load",
          role: "assistant",
          content: "",
          isLoading: true,
        }}
      />
    );
    expect(
      screen.getByRole("status", { name: "Assistant is typing" })
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='chat-message-typing']")
    ).toBeTruthy();
    expect(
      container.querySelector(".bg-semantic-bg-ui")
    ).toBeTruthy();
    expect(container.querySelector(".bouncing-loader")).toBeTruthy();
    expect(
      container.querySelectorAll(".bouncing-loader__dot")
    ).toHaveLength(3);
  });

  it("renders user loading state right-aligned with bouncing typing indicator", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "user-load",
          role: "user",
          content: "",
          variant: "loading",
        }}
      />
    );
    expect(
      screen.getByRole("status", { name: "Sending message" })
    ).toBeInTheDocument();
    expect(container.querySelector(".justify-end")).toBeTruthy();
    expect(
      container.querySelector("[data-slot='chat-message-typing']")
    ).toBeTruthy();
  });

  it("renders status variant as muted text without a bubble", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "3",
          role: "assistant",
          content: "Mapping tool.",
          variant: "status",
        }}
      />
    );
    expect(screen.getByText("Mapping tool.")).toBeInTheDocument();
    const statusText = screen.getByText("Mapping tool.");
    expect(statusText.classList.contains("text-semantic-text-muted")).toBe(
      true
    );
  });

  it("renders assistant progress line only when statusLabel is set and content is empty", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "progress-1",
          role: "assistant",
          content: "   ",
          statusLabel: "Running test...",
        }}
      />
    );
    expect(screen.getByText("Running test...")).toBeInTheDocument();
    expect(container.querySelector(".rounded-lg")).toBeFalsy();
  });

  it("applies w-fit to assistant bubbles so width follows content", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{ id: "1", role: "assistant", content: "Short" }}
      />
    );
    const bubble = container.querySelector(".rounded-tl-none");
    expect(bubble?.classList.contains("w-fit")).toBe(true);
  });

  it("renders markdown (bold and italic) in assistant bubbles", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "md-asst",
          role: "assistant",
          content: "Use **bold** and _italic_.",
        }}
      />
    );
    const strong = screen.getByText("bold");
    expect(strong.tagName.toLowerCase()).toBe("strong");
    const em = screen.getByText("italic");
    expect(em.tagName.toLowerCase()).toBe("em");
  });

  it("renders markdown in user bubbles", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "md-user",
          role: "user",
          content: "Item:\n\n- one\n- two",
        }}
      />
    );
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("renders user-authored error variant with error surface and text", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "u-err",
          role: "user",
          content: "Invalid input",
          variant: "error",
        }}
      />
    );
    expect(screen.getByText("Invalid input")).toBeInTheDocument();
    expect(container.querySelector(".bg-semantic-error-surface")).toBeTruthy();
    expect(screen.getByText("Invalid input").parentElement).toHaveClass(
      "text-semantic-error-text"
    );
  });

  it("renders user-authored success variant with success surface and text", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "u-ok",
          role: "user",
          content: "Saved",
          variant: "success",
        }}
      />
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(
      container.querySelector(".bg-semantic-success-surface")
    ).toBeTruthy();
    expect(screen.getByText("Saved").parentElement).toHaveClass(
      "text-semantic-success-text"
    );
  });

  it("renders statusLabel above message bubble", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "status-label-1",
          role: "assistant",
          content: "Test content here",
          statusLabel: "Running test...",
        }}
      />
    );
    expect(screen.getByText("Running test...")).toBeInTheDocument();
    expect(screen.getByText("Test content here")).toBeInTheDocument();
  });

  it("renders success variant with green surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "asst-success-1",
          role: "assistant",
          content: "Test passed!",
          variant: "success",
        }}
      />
    );
    expect(screen.getByText("Test passed!")).toBeInTheDocument();
    expect(
      container.querySelector(".bg-semantic-success-surface")
    ).toBeTruthy();
  });

  it("renders error variant with red error surface", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "asst-err-1",
          role: "assistant",
          content:
            "Something went wrong processing your message. Please try again.",
          variant: "error",
        }}
      />
    );
    expect(
      screen.getByText(
        "Something went wrong processing your message. Please try again."
      )
    ).toBeInTheDocument();
    expect(container.querySelector(".bg-semantic-error-surface")).toBeTruthy();
  });

  it("renders error variant with error text color", () => {
    render(
      <ChatMessageBubble
        message={{
          id: "asst-err-color",
          role: "assistant",
          content: "Error occurred",
          variant: "error",
        }}
      />
    );
    const text = screen.getByText("Error occurred");
    expect(text.parentElement).toHaveClass("text-semantic-error-text");
  });

  it("renders error variant left-aligned like assistant messages", () => {
    const { container } = render(
      <ChatMessageBubble
        message={{
          id: "asst-err-align",
          role: "assistant",
          content: "Error message",
          variant: "error",
        }}
      />
    );
    // Error messages use the same left-aligned layout as assistant messages (no justify-end)
    expect(container.querySelector(".justify-end")).toBeFalsy();
    expect(container.querySelector(".rounded-tl-none")).toBeTruthy();
  });
});

// ─── ChatInput ──────────────────────────────────────────

describe("ChatInput", () => {
  it("renders with placeholder", () => {
    render(<ChatInput value="" placeholder="Type here..." />);
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });

  it("calls onValueChange when typing", () => {
    const onValueChange = vi.fn();
    render(<ChatInput value="" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello" },
    });
    expect(onValueChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onSend when Enter is pressed with non-empty value", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Add Row" onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("Add Row");
  });

  it("does not call onSend when Shift+Enter is pressed (new line)", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Line one" onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      shiftKey: true,
    });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send when onInputKeyDown prevents default on Enter", () => {
    const onSend = vi.fn();
    render(
      <ChatInput
        value="hello"
        onSend={onSend}
        onInputKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
        }}
      />
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not call onSend when Enter is pressed with empty value", () => {
    const onSend = vi.fn();
    render(<ChatInput value="" onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("calls onSend when send button is clicked", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Test" onSend={onSend} />);
    fireEvent.click(screen.getByLabelText("Send message"));
    expect(onSend).toHaveBeenCalledWith("Test");
  });

  it("disables input when disabled prop is true", () => {
    render(<ChatInput value="" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disables send button when value is empty", () => {
    render(<ChatInput value="" />);
    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });
});
