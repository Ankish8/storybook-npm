import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotBehaviorCard, type BotBehaviorData } from "../bot-behavior-card";

/** Controlled harness exposing the latest prompt value for assertions. */
function Controlled({
  initial = "",
  ...props
}: {
  initial?: string;
} & Omit<React.ComponentProps<typeof BotBehaviorCard>, "data" | "onChange">) {
  const [data, setData] = React.useState<Partial<BotBehaviorData>>({
    systemPrompt: initial,
  });
  return (
    <BotBehaviorCard
      data={data}
      onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
      {...props}
    />
  );
}

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

  // ─── Variable groups ──────────────────────────────────────────────────────

  const GROUPS = [
    {
      label: "Session variables",
      items: [{ name: "Caller Contact Number" }, { name: "Caller City" }],
    },
    {
      label: "Contact Variables",
      items: [{ name: "First_Name" }, { name: "Email" }],
    },
  ];

  it("renders one chip row per variable group", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "hi" }}
        onChange={() => {}}
        variableGroups={GROUPS}
      />
    );

    // Label appears in both the visible row and the hidden mirror row.
    expect(screen.getAllByText("Session variables:").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact Variables:").length).toBeGreaterThan(0);
    // Chips render as buttons (the mirror-row copies are aria-hidden spans).
    expect(
      screen.getByRole("button", { name: "{{Caller Contact Number}}" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "{{First_Name}}" })
    ).toBeInTheDocument();
  });

  it("inserts {{name}} at the caret when a variable chip is clicked", async () => {
    const user = userEvent.setup();
    render(<Controlled initial="Greet " variableGroups={GROUPS} />);

    const prompt = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.click(prompt); // caret to end
    await user.click(
      screen.getByRole("button", { name: "{{First_Name}}" })
    );

    expect(prompt.value).toContain("{{First_Name}}");
  });

  it("falls back to a single Session variables group for sessionVariables", () => {
    render(
      <BotBehaviorCard
        data={{ systemPrompt: "hi" }}
        onChange={() => {}}
        sessionVariables={["{{Caller number}}", "{{Time}}"]}
      />
    );

    expect(screen.getAllByText("Session variables:").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "{{Caller number}}" })
    ).toBeInTheDocument();
  });

  it("opens a grouped, searchable picker when the user types {{", async () => {
    const user = userEvent.setup();
    render(<Controlled variableGroups={GROUPS} />);

    const prompt = screen.getByRole("textbox");
    await user.click(prompt);
    await user.type(prompt, "{{{{");

    const popup = screen.getByRole("listbox");
    expect(
      within(popup).getByLabelText("Search variables")
    ).toBeInTheDocument();
    // Variables from every group are present, grouped by label.
    expect(within(popup).getByText("Session variables")).toBeInTheDocument();
    expect(within(popup).getByText("Contact Variables")).toBeInTheDocument();
    expect(
      within(popup).getByRole("option", { name: "{{Email}}" })
    ).toBeInTheDocument();
  });

  it("filters the {{ picker via its search box and inserts the chosen variable", async () => {
    const user = userEvent.setup();
    render(<Controlled variableGroups={GROUPS} />);

    const prompt = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.click(prompt);
    await user.type(prompt, "{{{{");

    const popup = screen.getByRole("listbox");
    await user.type(within(popup).getByLabelText("Search variables"), "email");

    expect(
      within(popup).getByRole("option", { name: "{{Email}}" })
    ).toBeInTheDocument();
    expect(
      within(popup).queryByRole("option", { name: "{{First_Name}}" })
    ).not.toBeInTheDocument();

    await user.click(within(popup).getByRole("option", { name: "{{Email}}" }));
    expect(prompt.value).toContain("{{Email}}");
  });
});
