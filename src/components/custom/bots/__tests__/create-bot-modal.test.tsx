import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateBotModal } from "../create-bot-modal";
import { BOT_TYPE } from "../types";

describe("CreateBotModal", () => {
  it("renders nothing when closed", () => {
    render(<CreateBotModal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("Create AI Bot")).not.toBeInTheDocument();
  });

  it("renders modal content when open", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(screen.getByText("Create AI Bot")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter bot name")).toBeInTheDocument();
    expect(screen.getByText("Select Bot Type")).toBeInTheDocument();
    expect(screen.getByText("Chat Bot")).toBeInTheDocument();
    expect(screen.getByText("Voice Bot")).toBeInTheDocument();
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

  it("calls onSubmit with name and BOT_TYPE.CHAT when Chat bot is selected", () => {
    const handleSubmit = vi.fn();
    render(<CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "Lead Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Lead Bot",
      type: BOT_TYPE.CHAT,
    });
  });

  it("calls onSubmit with BOT_TYPE.VOICE when Voice bot is selected", () => {
    const handleSubmit = vi.fn();
    render(<CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByText("Voice Bot").closest("button")!);
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "Voice Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Voice Bot",
      type: BOT_TYPE.VOICE,
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
      type: BOT_TYPE.CHAT,
    });
  });

  it("calls onOpenChange(false) when Cancel is clicked", () => {
    const handleOpenChange = vi.fn();
    render(<CreateBotModal open onOpenChange={handleOpenChange} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps form values after submitting while modal stays open", () => {
    const handleOpenChange = vi.fn();
    render(<CreateBotModal open onOpenChange={handleOpenChange} onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText("Enter bot name");
    fireEvent.change(input, { target: { value: "Test Bot" } });
    fireEvent.click(screen.getByText("Create"));
    expect((input as HTMLInputElement).value).toBe("Test Bot");
    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it("shows required asterisk on Name label", () => {
    render(<CreateBotModal open onOpenChange={vi.fn()} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("sets maxLength on bot name input when botNameMaxLength is provided", () => {
    render(
      <CreateBotModal open onOpenChange={vi.fn()} botNameMaxLength={64} />
    );
    expect(screen.getByPlaceholderText("Enter bot name")).toHaveAttribute(
      "maxLength",
      "64"
    );
  });

  it("disables Create button when isLoading is true even with a name", () => {
    render(
      <CreateBotModal open onOpenChange={vi.fn()} isLoading />
    );
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "My Bot" },
    });
    expect(screen.getByText("Create").closest("button")).toBeDisabled();
  });

  it("does not call onSubmit when isLoading is true", () => {
    const handleSubmit = vi.fn();
    render(
      <CreateBotModal open onOpenChange={vi.fn()} onSubmit={handleSubmit} isLoading />
    );
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "My Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("disables Chat bot option when chatbotDisabled is true", () => {
    render(
      <CreateBotModal open onOpenChange={vi.fn()} chatbotDisabled />
    );
    expect(screen.getByText("Chat Bot").closest("button")).toBeDisabled();
    expect(screen.getByText("Voice Bot").closest("button")).not.toBeDisabled();
  });

  it("selects Voice bot when Chat bot is disabled", () => {
    render(
      <CreateBotModal open onOpenChange={vi.fn()} chatbotDisabled />
    );
    expect(screen.getByText("Voice Bot").closest("button")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("does not call onSubmit with Chat type when Chat bot is disabled", () => {
    const handleSubmit = vi.fn();
    render(
      <CreateBotModal
        open
        onOpenChange={vi.fn()}
        onSubmit={handleSubmit}
        chatbotDisabled
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "My Bot" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "My Bot",
      type: BOT_TYPE.VOICE,
    });
  });

  it("disables Create when both bot types are disabled", () => {
    render(
      <CreateBotModal
        open
        onOpenChange={vi.fn()}
        chatbotDisabled
        voicebotDisabled
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Enter bot name"), {
      target: { value: "My Bot" },
    });
    expect(screen.getByText("Create").closest("button")).toBeDisabled();
  });

  it("shows tooltip on hover when disabled option has tooltip text", async () => {
    const user = userEvent.setup();
    render(
      <CreateBotModal
        open
        onOpenChange={vi.fn()}
        chatbotDisabled
        chatbotDisabledTooltip="Chat bots are unavailable."
      />
    );
    const trigger = screen.getByText("Chat Bot").closest("span");
    expect(trigger).toBeTruthy();
    await user.hover(trigger!);
    await waitFor(
      () => {
        expect(screen.getByRole("tooltip")).toHaveTextContent(
          "Chat bots are unavailable."
        );
      },
      { timeout: 1500 }
    );
  });

});
