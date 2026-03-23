import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatComposer } from "../chat-composer";

describe("ChatComposer", () => {
  it("renders textarea with placeholder", () => {
    render(<ChatComposer />);
    expect(
      screen.getByPlaceholderText("Type a message")
    ).toBeInTheDocument();
  });

  it("renders textarea with custom placeholder", () => {
    render(<ChatComposer placeholder="Type '/' for canned message" />);
    expect(
      screen.getByPlaceholderText("Type '/' for canned message")
    ).toBeInTheDocument();
  });

  it("onChange fires when typing", async () => {
    const handleChange = vi.fn();
    render(<ChatComposer value="" onChange={handleChange} />);
    const textarea = screen.getByPlaceholderText("Type a message");
    await userEvent.type(textarea, "H");
    expect(handleChange).toHaveBeenCalledWith("H");
  });

  it("onSend fires when Send button is clicked", async () => {
    const handleSend = vi.fn();
    render(<ChatComposer onSend={handleSend} />);
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(handleSend).toHaveBeenCalledTimes(1);
  });

  it("shows reply preview when reply prop is provided", () => {
    render(
      <ChatComposer
        reply={{ sender: "John Doe", message: "Hello there!" }}
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("onDismissReply fires when X button is clicked", async () => {
    const handleDismiss = vi.fn();
    render(
      <ChatComposer
        reply={{ sender: "John", message: "Hi" }}
        onDismissReply={handleDismiss}
      />
    );
    // The dismiss button is the ghost icon-sm button with the X icon
    const buttons = screen.getAllByRole("button");
    // Find the dismiss button (not the Send button)
    const dismissButton = buttons.find(
      (btn) => !btn.textContent?.includes("Send")
    );
    expect(dismissButton).toBeTruthy();
    await userEvent.click(dismissButton!);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders attachment slot content", () => {
    render(
      <ChatComposer
        attachment={<div data-testid="attachment-preview">image.png</div>}
      />
    );
    expect(screen.getByTestId("attachment-preview")).toBeInTheDocument();
    expect(screen.getByText("image.png")).toBeInTheDocument();
  });

  it("renders left actions slot", () => {
    render(
      <ChatComposer
        leftActions={<button data-testid="attach-btn">Attach</button>}
      />
    );
    expect(screen.getByTestId("attach-btn")).toBeInTheDocument();
  });

  it("renders right actions slot", () => {
    render(
      <ChatComposer
        rightActions={<button data-testid="emoji-btn">Emoji</button>}
      />
    );
    expect(screen.getByTestId("emoji-btn")).toBeInTheDocument();
  });

  it("shows expired state with message and template button", () => {
    render(<ChatComposer expired />);
    expect(
      screen.getByText(
        "This chat has expired. Send a template to continue."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Template" })
    ).toBeInTheDocument();
    // Textarea should not be rendered in expired state
    expect(
      screen.queryByPlaceholderText("Type a message")
    ).not.toBeInTheDocument();
  });

  it("shows custom expired message", () => {
    render(
      <ChatComposer expired expiredMessage="Chat window closed." />
    );
    expect(screen.getByText("Chat window closed.")).toBeInTheDocument();
  });

  it("onTemplateClick fires in expired state", async () => {
    const handleTemplateClick = vi.fn();
    render(
      <ChatComposer expired onTemplateClick={handleTemplateClick} />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Select Template" })
    );
    expect(handleTemplateClick).toHaveBeenCalledTimes(1);
  });

  it("custom className is applied", () => {
    const { container } = render(
      <ChatComposer className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(<ChatComposer ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("data-testid spreads correctly", () => {
    render(<ChatComposer data-testid="composer" />);
    expect(screen.getByTestId("composer")).toBeInTheDocument();
  });

  it("send button shows custom label", () => {
    render(<ChatComposer sendLabel="Submit" />);
    expect(
      screen.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();
  });

  it("disabled state disables textarea and send button", () => {
    render(<ChatComposer disabled />);
    expect(screen.getByPlaceholderText("Type a message")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /send/i })
    ).toBeDisabled();
  });

  it("onKeyDown fires when key pressed in textarea", async () => {
    const handleKeyDown = vi.fn();
    render(<ChatComposer value="" onKeyDown={handleKeyDown} />);
    const textarea = screen.getByPlaceholderText("Type a message");
    await userEvent.type(textarea, "{enter}");
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleKeyDown.mock.calls[0][0].key).toBe("Enter");
  });

  /* ── Accessibility tests ── */

  it("textarea has default aria-label from placeholder", () => {
    render(<ChatComposer />);
    const textarea = screen.getByPlaceholderText("Type a message");
    expect(textarea).toHaveAttribute("aria-label", "Type a message");
  });

  it("textarea uses custom aria-label when provided", () => {
    render(<ChatComposer textareaAriaLabel="Compose message" />);
    const textarea = screen.getByPlaceholderText("Type a message");
    expect(textarea).toHaveAttribute("aria-label", "Compose message");
  });

  it("textarea has id when textareaId is provided", () => {
    render(<ChatComposer textareaId="msg-input" />);
    const textarea = screen.getByPlaceholderText("Type a message");
    expect(textarea).toHaveAttribute("id", "msg-input");
  });

  it("dismiss reply button has aria-label", () => {
    render(
      <ChatComposer
        reply={{ sender: "John", message: "Hi" }}
        onDismissReply={() => {}}
      />
    );
    const dismissButton = screen.getByRole("button", {
      name: "Dismiss reply",
    });
    expect(dismissButton).toBeInTheDocument();
    expect(dismissButton).toHaveAttribute("aria-label", "Dismiss reply");
  });

  it("expired state has role=status", () => {
    render(<ChatComposer expired />);
    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toBeInTheDocument();
  });

  it("root has aria-label", () => {
    render(<ChatComposer />);
    const region = screen.getByRole("region", {
      name: "Message composer",
    });
    expect(region).toBeInTheDocument();
  });

  it("send button has aria-haspopup when showSendDropdown is true", () => {
    render(<ChatComposer showSendDropdown />);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toHaveAttribute("aria-haspopup", "true");
  });

  it("onKeyDown receives arrow key events", async () => {
    const handleKeyDown = vi.fn();
    render(<ChatComposer value="" onKeyDown={handleKeyDown} />);
    const textarea = screen.getByPlaceholderText("Type a message");
    await userEvent.type(textarea, "{arrowdown}");
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleKeyDown.mock.calls[0][0].key).toBe("ArrowDown");
  });

  it("renders without onKeyDown prop", () => {
    // Should not throw when onKeyDown is not provided
    render(<ChatComposer value="" />);
    expect(screen.getByPlaceholderText("Type a message")).toBeInTheDocument();
  });
});
