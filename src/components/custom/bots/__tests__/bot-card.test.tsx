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

  it("does not render conversation count but keeps spacing row", () => {
    const { container } = render(<BotCard bot={chatbot} />);
    expect(screen.queryByText(/Conversations/)).not.toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement;
    const spacer = root.children[2] as HTMLElement;
    expect(spacer).toHaveClass("h-4", "sm:h-5", "mb-3", "sm:mb-4", "shrink-0");
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

  it("shows Unpublished changes when status is draft", () => {
    const bot: Bot = { ...voicebot, status: "draft", lastPublishedBy: undefined, lastPublishedDate: undefined };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(screen.getByText("Last Published")).toBeInTheDocument();
  });

  it("shows last published info when status is published even with draft data", () => {
    const bot: Bot = { ...chatbot, status: "published", lastPublishedBy: "User", lastPublishedDate: "1 Jan, 2025" };
    render(<BotCard bot={bot} />);
    expect(screen.getByText(/User \| 1 Jan, 2025/)).toBeInTheDocument();
    expect(screen.queryByText("Unpublished changes")).not.toBeInTheDocument();
  });

  it("shows both last published line and Unpublished changes when status is draft with last published info", () => {
    const bot: Bot = {
      ...voicebot,
      status: "draft",
      lastPublishedBy: "Nandan Raikwar",
      lastPublishedDate: "15 Jan, 2025",
    };
    render(<BotCard bot={bot} />);
    expect(screen.getByText(/Nandan Raikwar \| 15 Jan, 2025/)).toBeInTheDocument();
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
  });

  it("shows 'Chatbot' badge for chatbot type", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("Chatbot")).toBeInTheDocument();
  });

  it("shows 'Voicebot' badge for voicebot type", () => {
    render(<BotCard bot={voicebot} />);
    expect(screen.getByText("Voicebot")).toBeInTheDocument();
  });

  it("uses typeLabels prop to override badge text", () => {
    render(
      <BotCard
        bot={chatbot}
        typeLabels={{ chatbot: "Chat", voicebot: "Voice" }}
      />
    );
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("uses bot.typeLabel when set (overrides typeLabels)", () => {
    const bot: Bot = { ...chatbot, typeLabel: "Custom Bot" };
    render(
      <BotCard bot={bot} typeLabels={{ chatbot: "Chat" }} />
    );
    expect(screen.getByText("Custom Bot")).toBeInTheDocument();
  });

  it("renders the three-dot menu trigger button", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByLabelText("More options")).toBeInTheDocument();
  });

  it("opens dropdown and shows only Edit when onDelete is not provided", async () => {
    const user = userEvent.setup();
    render(<BotCard bot={chatbot} />);
    await user.click(screen.getByLabelText("More options"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("shows Delete when onDelete is provided", async () => {
    const user = userEvent.setup();
    render(<BotCard bot={chatbot} onDelete={vi.fn()} />);
    await user.click(screen.getByLabelText("More options"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit with bot id when card is clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(<BotCard bot={chatbot} onEdit={handleEdit} />);
    await user.click(screen.getByRole("button", { name: "Edit Lead validation bot" }));
    expect(handleEdit).toHaveBeenCalledWith("bot-1");
  });

  it("calls onEdit with bot id when Edit menu item is clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(<BotCard bot={chatbot} onEdit={handleEdit} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Edit"));
    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith("bot-1");
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

  it("does not surface conversation count for large values", () => {
    const bot: Bot = { ...chatbot, conversationCount: 1000 };
    render(<BotCard bot={bot} />);
    expect(screen.queryByText(/1,000/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Conversations/)).not.toBeInTheDocument();
  });
});
