import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BotBehaviorCard } from "../bot-behavior-card";

describe("BotBehaviorCard", () => {
  it("shows system prompt counter without whitespace (spaces-only is zero)", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: " ".repeat(23) }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("0/5000")).toBeInTheDocument();
  });

  it("counts only non-whitespace characters for the counter", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "   hello   " }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("5/5000")).toBeInTheDocument();
  });

  it("does not count gaps between letter groups toward the counter", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "ab     cd" }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("4/5000")).toBeInTheDocument();
  });
});
