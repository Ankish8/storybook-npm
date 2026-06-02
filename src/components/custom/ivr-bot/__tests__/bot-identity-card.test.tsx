import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotIdentityCard } from "../bot-identity-card";
import { BOT_IDENTITY_INVALID_CHARS_MESSAGE } from "../bot-identity-text";

describe("BotIdentityCard", () => {
  it("renders Who The Agent Is heading", () => {
    render(<BotIdentityCard data={{}} onChange={() => {}} />);
    expect(screen.getByText("Who The Agent Is")).toBeInTheDocument();
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

  it("can disable all identity error-message validation", () => {
    render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
        botNameErrorMessageValidation={false}
        primaryRoleErrorMessageValidation={false}
        toneErrorMessageValidation={false}
      />
    );

    expect(screen.queryByText("Agent name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Primary role is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Tone is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Voice is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Language is required")).not.toBeInTheDocument();
  });

  it("shows default identity validation messages when enabled", () => {
    render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Agent name is required")).toBeInTheDocument();
    expect(screen.getByText("Primary role is required")).toBeInTheDocument();
    expect(screen.getByText("Tone is required")).toBeInTheDocument();
  });

  it("shows all enabled error-message validation messages at the same time", () => {
    const { rerender } = render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
        botNameValidation="Agent name is required"
        primaryRoleValidation="Primary role is required"
        toneValidation="Tone is required"
      />
    );

    expect(screen.getByText("Agent name is required")).toBeInTheDocument();
    expect(screen.getByText("Primary role is required")).toBeInTheDocument();
    expect(screen.getByText("Tone is required")).toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "", tone: [], voice: "", language: "" }}
        onChange={() => {}}
        botNameValidation="Agent name is required"
        primaryRoleValidation="Primary role is required"
        toneValidation="Tone is required"
      />
    );

    expect(screen.getByText("Primary role is required")).toBeInTheDocument();
    expect(screen.getByText("Tone is required")).toBeInTheDocument();

    rerender(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "support", tone: [], voice: "", language: "" }}
        onChange={() => {}}
        botNameValidation="Agent name is required"
        primaryRoleValidation="Primary role is required"
        toneValidation="Tone is required"
      />
    );

    expect(screen.getByText("Tone is required")).toBeInTheDocument();

    expect(screen.queryByText("Voice is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Language is required")).not.toBeInTheDocument();
  });

  it("updates bot name error-message validation in real time while typing", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [data, setData] = React.useState({ botName: "" });
      return (
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
          botNameValidation="Agent name is required"
        />
      );
    }

    render(<Controlled />);
    const input = screen.getByPlaceholderText("e.g., Rhea from XYZ");

    expect(
      screen.getByText("Agent name is required")
    ).toBeInTheDocument();
    await user.type(input, "R");
    expect(
      screen.queryByText("Agent name is required")
    ).not.toBeInTheDocument();
  });

  it("updates primary role error-message validation while typing a custom role", async () => {
    const user = userEvent.setup();

    render(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "", tone: ["Friendly"] }}
        onChange={() => {}}
        primaryRoleValidation="Primary role is required"
      />
    );

    expect(
      screen.getByText("Primary role is required")
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Customer Support Agent/i }));
    const roleInput = screen
      .getAllByRole("combobox")
      .find((element) => element.tagName === "INPUT");
    expect(roleInput).toBeTruthy();
    await user.type(roleInput as HTMLElement, "S");
    expect(
      screen.queryByText("Primary role is required")
    ).not.toBeInTheDocument();
  });

  it("updates tone error-message validation while typing a custom tone", async () => {
    const user = userEvent.setup();

    render(
      <BotIdentityCard
        data={{ botName: "Rhea", primaryRole: "customer-support", tone: [] }}
        onChange={() => {}}
        toneValidation="Tone is required"
      />
    );

    expect(screen.getByText("Tone is required")).toBeInTheDocument();
    await user.click(screen.getByText("Enter or select tone"));
    const toneInput = screen
      .getAllByRole("combobox")
      .find((element) => element.tagName === "INPUT");
    expect(toneInput).toBeTruthy();
    await user.type(toneInput as HTMLElement, "C");
    expect(
      screen.queryByText("Tone is required")
    ).not.toBeInTheDocument();
  });

  it("uses field validation props as required messages", () => {
    render(
      <BotIdentityCard
        data={{ botName: "", primaryRole: "support", tone: ["Friendly"] }}
        onChange={() => {}}
        botNameValidation="Bot name failed validation"
      />
    );

    expect(screen.getByText("Bot name failed validation")).toBeInTheDocument();
    expect(screen.queryByText("Agent name is required")).not.toBeInTheDocument();
  });

  it("can disable primary role error-message validation", () => {
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
        primaryRoleErrorMessageValidation={false}
        primaryRoleValidation="Primary role is required"
      />
    );

    expect(screen.queryByText("Primary role is required")).not.toBeInTheDocument();
  });
});
