import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateBotModal } from "../create-bot-modal";

describe("CreateBotModal", () => {
  it("renders nothing when closed", () => {
    render(<CreateBotModal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("Create AI bot")).not.toBeInTheDocument();
  });

  it("renders modal content when open", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(screen.getByText("Create AI bot")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter bot name")).toBeInTheDocument();
    expect(screen.getByText("Select Bot Type")).toBeInTheDocument();
    expect(screen.getByText("Chat bot")).toBeInTheDocument();
    expect(screen.getByText("Voice bot")).toBeInTheDocument();
  });

  it("shows both bot type options with descriptions", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(
      screen.getByText("Text-based routing for websites and WhatsApp.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conversational spoken interactions over phone.")
    ).toBeInTheDocument();
  });

  it("shows helper text warning", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(
      screen.getByText("This setting cannot be changed once selected.")
    ).toBeInTheDocument();
  });

  it("disables Create button when name is empty", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(screen.getByText("Create").closest("button")).toBeDisabled();
  });

  it("enables Create button when name is filled", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "My Bot" },
    });
    expect(screen.getByText("Create").closest("button")).not.toBeDisabled();
  });

  it("calls onSubmit with name and default chatbot type", () => {
    const handleSubmit = vi.fn();
    render(<CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "Lead Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Lead Bot",
      type: "chatbot",
    });
  });

  it("calls onSubmit with voicebot type when voicebot is selected", () => {
    const handleSubmit = vi.fn();
    render(<CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByText("Voice bot").closest("button")!);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "Voice Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Voice Bot",
      type: "voicebot",
    });
  });

  it("trims whitespace from bot name before submitting", () => {
    const handleSubmit = vi.fn();
    render(<CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "  My Bot  " },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "My Bot",
      type: "chatbot",
    });
  });

  it("calls onOpenChange(false) when Cancel is clicked", () => {
    const handleOpenChange = vi.fn();
    render(<CreateBotModal open onOpenChange={handleOpenChange} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets form after submitting", () => {
    const handleOpenChange = vi.fn();
    render(<CreateBotModal open onOpenChange={handleOpenChange} onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText("Enter bot name");
    fireEvent.change(input, { target: { value: "Test Bot" } });
    fireEvent.click(screen.getByText("Create"));
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("shows required asterisk on Name label", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
