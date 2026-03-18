import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditBotFlow } from "../edit-bot-flow";
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
    name: "Test Chatbot",
    type: "chatbot",
    conversationCount: 56,
    lastPublishedBy: "User",
    lastPublishedDate: "1 Jan, 2025",
  },
];

describe("EditBotFlow", () => {
  it("renders bot list with title and subtitle", () => {
    render(
      <EditBotFlow
        bots={sampleBots}
        renderConfig={() => null}
      />
    );
    expect(screen.getByText("AI Bot")).toBeInTheDocument();
    expect(screen.getByText("Create & manage AI bots")).toBeInTheDocument();
  });

  it("renders all provided bots", () => {
    render(
      <EditBotFlow
        bots={sampleBots}
        renderConfig={() => null}
      />
    );
    expect(screen.getByText("Lead validation bot")).toBeInTheDocument();
    expect(screen.getByText("Test Chatbot")).toBeInTheDocument();
  });

  it("renders instructionText when provided", () => {
    render(
      <EditBotFlow
        bots={sampleBots}
        renderConfig={() => null}
        instructionText={<p>Click Edit to open config.</p>}
      />
    );
    expect(screen.getByText("Click Edit to open config.")).toBeInTheDocument();
  });

});
