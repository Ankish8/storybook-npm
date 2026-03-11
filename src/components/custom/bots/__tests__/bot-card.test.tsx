import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotCard } from "../bot-card";
import type { Bot } from "../types";

const chatbot: Bot = {
  id: "bot-1",
  name: "Lead validation bot",
  type: "chatbot",
  conversationCount: 342,
  lastPublishedBy: "Nandan Raikwar",
  lastPublishedDate: "15 Jan, 2025",
};

const voicebot: Bot = {
  id: "bot-2",
  name: "Voice support bot",
  type: "voicebot",
  conversationCount: 56,
  lastPublishedBy: "Admin",
  lastPublishedDate: "10 Feb, 2025",
};

describe("BotCard", () => {
  it("renders bot name", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("Lead validation bot")).toBeInTheDocument();
  });

  it("renders conversation count", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("342 Conversations")).toBeInTheDocument();
  });

  it("renders last published info", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("Last Published")).toBeInTheDocument();
    expect(screen.getByText(/Nandan Raikwar/)).toBeInTheDocument();
    expect(screen.getByText(/15 Jan, 2025/)).toBeInTheDocument();
  });

  it("renders fallback dash when no last published info", () => {
    const bot: Bot = { ...chatbot, lastPublishedBy: undefined, lastPublishedDate: undefined };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows 'Chatbot' badge for chatbot type", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("Chatbot")).toBeInTheDocument();
  });

  it("shows 'Voicebot' badge for voicebot type", () => {
    render(<BotCard bot={voicebot} />);
    expect(screen.getByText("Voicebot")).toBeInTheDocument();
  });

  it("renders the three-dot menu trigger button", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByLabelText("More options")).toBeInTheDocument();
  });

  it("opens dropdown and shows Edit, Publish, Delete actions", async () => {
    const user = userEvent.setup();
    render(<BotCard bot={chatbot} />);
    await user.click(screen.getByLabelText("More options"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit with bot id when Edit is clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(<BotCard bot={chatbot} onEdit={handleEdit} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Edit"));
    expect(handleEdit).toHaveBeenCalledWith("bot-1");
  });

  it("calls onPublish with bot id when Publish is clicked", async () => {
    const user = userEvent.setup();
    const handlePublish = vi.fn();
    render(<BotCard bot={chatbot} onPublish={handlePublish} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Publish"));
    expect(handlePublish).toHaveBeenCalledWith("bot-1");
  });

  it("calls onDelete with bot id when Delete is clicked", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<BotCard bot={chatbot} onDelete={handleDelete} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledWith("bot-1");
  });

  it("does not throw when action callbacks are not provided", () => {
    render(<BotCard bot={chatbot} />);
    expect(() =>
      fireEvent.click(screen.getByLabelText("More options"))
    ).not.toThrow();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BotCard bot={chatbot} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<BotCard bot={chatbot} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("formats conversation count with locale separator", () => {
    const bot: Bot = { ...chatbot, conversationCount: 1000 };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("1,000 Conversations")).toBeInTheDocument();
  });
});
