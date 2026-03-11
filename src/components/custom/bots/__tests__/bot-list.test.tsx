import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BotList } from "../bot-list";
import type { Bot } from "../types";

const sampleBots: Bot[] = [
  {
    id: "bot-1",
    name: "Lead validation bot",
    type: "voicebot",
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "bot-2",
    name: "Excepteur sint occaecat cupidatat",
    type: "chatbot",
    conversationCount: 56,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
];

describe("BotList", () => {
  it("renders default title and subtitle", () => {
    render(<BotList />);
    expect(screen.getByText("AI Bot")).toBeInTheDocument();
    expect(screen.getByText("Create & manage AI bots")).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(<BotList title="My Bots" subtitle="Manage your bots" />);
    expect(screen.getByText("My Bots")).toBeInTheDocument();
    expect(screen.getByText("Manage your bots")).toBeInTheDocument();
  });

  it("renders 'Create new bot' card", () => {
    render(<BotList />);
    expect(screen.getByText("Create new bot")).toBeInTheDocument();
  });

  it("renders all provided bot cards", () => {
    render(<BotList bots={sampleBots} />);
    expect(screen.getByText("Lead validation bot")).toBeInTheDocument();
    expect(
      screen.getByText("Excepteur sint occaecat cupidatat")
    ).toBeInTheDocument();
  });

  it("renders no bot cards when bots array is empty", () => {
    render(<BotList bots={[]} />);
    expect(screen.getByText("Create new bot")).toBeInTheDocument();
    expect(screen.queryByText("Conversations")).not.toBeInTheDocument();
  });

  it("calls onCreateBot when create card is clicked", () => {
    const handleCreate = vi.fn();
    render(<BotList onCreateBot={handleCreate} />);
    fireEvent.click(screen.getByText("Create new bot").closest("button")!);
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch when typing in search input", () => {
    const handleSearch = vi.fn();
    render(<BotList onSearch={handleSearch} />);
    fireEvent.change(screen.getByPlaceholderText("Search bot..."), {
      target: { value: "lead" },
    });
    expect(handleSearch).toHaveBeenCalledWith("lead");
  });

  it("applies custom className", () => {
    const { container } = render(<BotList className="custom-list" />);
    expect(container.firstChild).toHaveClass("custom-list");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<BotList ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders three-dot menu triggers for each bot card", () => {
    render(<BotList bots={sampleBots} />);
    const menuButtons = screen.getAllByLabelText("More options");
    expect(menuButtons).toHaveLength(sampleBots.length);
  });
});
