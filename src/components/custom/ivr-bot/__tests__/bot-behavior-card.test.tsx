import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows validation message when HowItBehavesErrorMessageValidation is enabled", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "" }}
        onChange={() => {}}
      />
    );

    const prompt = screen.getByRole("textbox");
    expect(screen.getByText("System prompt is required")).toBeInTheDocument();
    expect(prompt).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps validation message while typing when validation is enabled", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [data, setData] = React.useState({ systemPrompt: "" });

      return (
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      );
    }

    render(<Controlled />);

    const prompt = screen.getByRole("textbox");
    expect(screen.getByText("System prompt is required")).toBeInTheDocument();

    await user.type(prompt, "hello");
    expect(screen.getByText("System prompt is required")).toBeInTheDocument();
    expect(prompt).toHaveAttribute("aria-invalid", "true");
  });

  it("can disable required validation", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "" }}
        onChange={() => {}}
        HowItBehavesErrorMessageValidation={false}
      />
    );

    expect(
      screen.queryByText("System prompt is required")
    ).not.toBeInTheDocument();
  });

  it("uses a custom system prompt validation message", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "" }}
        onChange={() => {}}
        systemPromptValidation="Please add behavior instructions"
      />
    );

    expect(
      screen.getByText("Please add behavior instructions")
    ).toBeInTheDocument();
  });
});
