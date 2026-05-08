import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BotBehaviorCard } from "../bot-behavior-card";

describe("BotBehaviorCard", () => {
  it("counts spaces toward the system prompt counter", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: " ".repeat(23) }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("23/5000")).toBeInTheDocument();
  });

  it("counts all characters including leading and trailing spaces", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "   hello   " }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("11/5000")).toBeInTheDocument();
  });

  it("counts every space between letter groups toward the counter", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "ab     cd" }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("9/5000")).toBeInTheDocument();
  });
});
