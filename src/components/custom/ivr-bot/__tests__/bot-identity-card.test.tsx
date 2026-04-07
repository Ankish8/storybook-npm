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
});
