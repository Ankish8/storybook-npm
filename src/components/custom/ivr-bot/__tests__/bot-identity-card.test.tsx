import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotIdentityCard } from "../bot-identity-card";
import { BOT_IDENTITY_INVALID_CHARS_MESSAGE } from "../bot-identity-text";

describe("BotIdentityCard", () => {
  it("renders Who The Bot Is heading", () => {
    render(<BotIdentityCard data={{}} onChange={() => {}} />);
    expect(screen.getByText("Who The Bot Is")).toBeInTheDocument();
  });

  it("strips invalid bot name characters and shows validation message", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [data, setData] = React.useState({ botName: "" });
      return (
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByPlaceholderText("e.g., Rhea from XYZ");
    await user.type(input, "A@1");
    expect(input).toHaveValue("A");
    expect(screen.getByText(BOT_IDENTITY_INVALID_CHARS_MESSAGE)).toBeInTheDocument();
  });

  it("collapses multiple spaces in bot name and does not count trailing spaces in counter", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [data, setData] = React.useState({ botName: "" });
      return (
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByPlaceholderText("e.g., Rhea from XYZ");
    await user.type(input, "Rhea   ");
    expect(input).toHaveValue("Rhea ");
    expect(screen.getByText("4/50")).toBeInTheDocument();
  });

  it("trims bot name on blur", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [data, setData] = React.useState({ botName: "Rhea " });
      return (
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByPlaceholderText("e.g., Rhea from XYZ");
    await user.click(input);
    await user.tab();
    expect(input).toHaveValue("Rhea");
  });

  it("shows built-in validation one field at a time in mandatory field order", () => {
    const { rerender } = render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Bot name is required")).toBeInTheDocument();
    expect(screen.queryByText("Primary role is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Tone is required")).not.toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Primary role is required")).toBeInTheDocument();
    expect(screen.queryByText("Tone is required")).not.toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "support", tone: [], voice: "", language: "" }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Tone is required")).toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{
          botName: "Rhea",
          primaryRole: "support",
          tone: ["Friendly"],
          voice: "",
          language: "",
        }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Voice is required")).toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{
          botName: "Rhea",
          primaryRole: "support",
          tone: ["Friendly"],
          voice: "rhea-female",
          language: "",
        }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Language is required")).toBeInTheDocument();
  });

  it("updates bot name min-length validation in real time while typing", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [data, setData] = React.useState({ botName: "" });
      return (
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
          botNameMinLength={3}
          botNameMinLengthMessage="Bot name must be at least 3 characters"
        />
      );
    }

    render(<Controlled />);
    const input = screen.getByPlaceholderText("e.g., Rhea from XYZ");

    expect(
      screen.getByText("Bot name must be at least 3 characters")
    ).toBeInTheDocument();
    await user.type(input, "Rh");
    expect(
      screen.getByText("Bot name must be at least 3 characters")
    ).toBeInTheDocument();
    await user.type(input, "e");
    expect(
      screen.queryByText("Bot name must be at least 3 characters")
    ).not.toBeInTheDocument();
  });

  it("updates primary role min-length validation while typing a custom role", async () => {
    const user = userEvent.setup();

    render(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "", tone: ["Friendly"] }}
        onChange={() => {}}
        primaryRoleMinLength={3}
        primaryRoleMinLengthMessage="Primary role must be at least 3 characters"
      />
    );

    expect(
      screen.getByText("Primary role must be at least 3 characters")
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Customer Support Agent/i }));
    const roleInput = screen
      .getAllByRole("combobox")
      .find((element) => element.tagName === "INPUT");
    expect(roleInput).toBeTruthy();
    await user.type(roleInput as HTMLElement, "Sa");
    expect(
      screen.getByText("Primary role must be at least 3 characters")
    ).toBeInTheDocument();
    await user.type(roleInput as HTMLElement, "l");
    expect(
      screen.queryByText("Primary role must be at least 3 characters")
    ).not.toBeInTheDocument();
  });

  it("updates tone min-length validation while typing a custom tone", async () => {
    const user = userEvent.setup();

    render(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "customer-support", tone: [] }}
        onChange={() => {}}
        toneMinLength={4}
        toneMinLengthMessage="Tone must be at least 4 characters"
      />
    );

    expect(screen.getByText("Tone must be at least 4 characters")).toBeInTheDocument();
    await user.click(screen.getByText("Enter or select tone"));
    const toneInput = screen
      .getAllByRole("combobox")
      .find((element) => element.tagName === "INPUT");
    expect(toneInput).toBeTruthy();
    await user.type(toneInput as HTMLElement, "Cal");
    expect(screen.getByText("Tone must be at least 4 characters")).toBeInTheDocument();
    await user.type(toneInput as HTMLElement, "m");
    expect(
      screen.queryByText("Tone must be at least 4 characters")
    ).not.toBeInTheDocument();
  });

  it("uses external validation before built-in min-length validation", () => {
    render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "support", tone: ["Friendly"] }}
        onChange={() => {}}
        botNameValidation="Bot name failed server validation"
      />
    );

    expect(screen.getByText("Bot name failed server validation")).toBeInTheDocument();
    expect(screen.queryByText("Bot name is required")).not.toBeInTheDocument();
  });

  it("can mark primary role, voice, and language as optional for built-in validation", () => {
    render(
      <BotIdentityCard
        data={{
          botName: "Rhea",
          primaryRole: "",
          tone: ["Friendly"],
          voice: "",
          language: "",
        }}
        onChange={() => {}}
        primaryRoleOptional
        voiceOptional
        languageOptional
      />
    );

    expect(screen.queryByText("Primary role is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Voice is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Language is required")).not.toBeInTheDocument();
  });
});
