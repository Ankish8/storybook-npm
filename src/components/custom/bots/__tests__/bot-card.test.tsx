import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("renders conversation count for chatbot", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("342 Conversations")).toBeInTheDocument();
  });

  it("renders the numbers mapped row instead of conversations for voicebot", () => {
    const { container } = render(<BotCard bot={voicebot} />);
    expect(screen.queryByText(/Conversations/)).not.toBeInTheDocument();
    expect(screen.getByText("Numbers mapped:")).toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement;
    const row = root.children[2] as HTMLElement;
    expect(row).toHaveClass("mb-3", "sm:mb-4", "shrink-0");
  });

  it("removes the numbers mapped section when showNumbersMapped is false", () => {
    render(
      <BotCard
        bot={voicebot}
        showNumbersMapped={false}
        onNumbersClick={vi.fn()}
      />
    );
    expect(screen.queryByText("Numbers mapped:")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mapped number/i })
    ).not.toBeInTheDocument();
    // rest of the card is unaffected
    expect(screen.getByText("Voice support bot")).toBeInTheDocument();
    expect(screen.getByText("Last Published")).toBeInTheDocument();
  });

  it("renders the numbers mapped section by default (showNumbersMapped defaults to true)", () => {
    render(<BotCard bot={voicebot} />);
    expect(screen.getByText("Numbers mapped:")).toBeInTheDocument();
  });

  it('renders "-" when voicebot has no numbers attached', () => {
    render(<BotCard bot={voicebot} numbersAttached={0} />);
    expect(screen.getByText("Numbers mapped:")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mapped number/i })
    ).not.toBeInTheDocument();
  });

  it("renders a spinner instead of the count while isFetchingNumbers is true", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={32}
        isFetchingNumbers
        onNumbersClick={vi.fn()}
      />
    );
    // row label stays; the count/pill is replaced by the loader
    expect(screen.getByText("Numbers mapped:")).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Loading numbers" })
    ).toBeInTheDocument();
    expect(screen.queryByText("32 numbers")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mapped number/i })
    ).not.toBeInTheDocument();
  });

  it("shows the count and no spinner when isFetchingNumbers is false (default)", () => {
    render(<BotCard bot={voicebot} numbersAttached={32} />);
    expect(screen.getByText("32 numbers")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("prefers the spinner over noNumberMessage while fetching a zero count", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={0}
        isFetchingNumbers
        noNumberMessage="No numbers mapped"
      />
    );
    expect(
      screen.getByRole("status", { name: "Loading numbers" })
    ).toBeInTheDocument();
    expect(screen.queryByText("No numbers mapped")).not.toBeInTheDocument();
  });

  it("renders noNumberMessage in place of the default dash when set", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={0}
        noNumberMessage="No numbers mapped"
      />
    );
    expect(screen.getByText("No numbers mapped")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("ignores noNumberMessage when numbers are attached", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={32}
        noNumberMessage="No numbers mapped"
      />
    );
    expect(screen.getByText("32 numbers")).toBeInTheDocument();
    expect(screen.queryByText("No numbers mapped")).not.toBeInTheDocument();
  });

  it("does not forward isFetchingNumbers or noNumberMessage to the DOM", () => {
    const { container } = render(
      <BotCard bot={voicebot} isFetchingNumbers noNumberMessage="none" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute("isfetchingnumbers")).toBe(false);
    expect(root.hasAttribute("nonumbermessage")).toBe(false);
  });

  it("renders a clickable numbers pill and calls onNumbersClick with id and count", async () => {
    const user = userEvent.setup();
    const onNumbersClick = vi.fn();
    const onEdit = vi.fn();
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={32}
        onEdit={onEdit}
        onNumbersClick={onNumbersClick}
      />
    );
    const pill = screen.getByRole("button", {
      name: "View 32 mapped numbers",
    });
    expect(pill).toHaveTextContent("32 numbers");
    await user.click(pill);
    expect(onNumbersClick).toHaveBeenCalledWith("bot-2", 32);
    // pill click must not bubble into the card's edit handler
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("uses singular label for a single mapped number", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={1}
        onNumbersClick={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: "View 1 mapped number" })
    ).toHaveTextContent("1 number");
  });

  it("uses the numbersAttached prop for the pill count and click payload", async () => {
    const user = userEvent.setup();
    const onNumbersClick = vi.fn();
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={7}
        onNumbersClick={onNumbersClick}
      />
    );
    const pill = screen.getByRole("button", { name: "View 7 mapped numbers" });
    expect(pill).toHaveTextContent("7 numbers");
    await user.click(pill);
    expect(onNumbersClick).toHaveBeenCalledWith("bot-2", 7);
  });

  it("does not forward numbersAttached to the DOM", () => {
    const { container } = render(
      <BotCard bot={voicebot} numbersAttached={7} />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute("numbersattached")).toBe(false);
  });

  it("renders the numbers pill non-interactive when onNumbersClick is omitted", () => {
    render(<BotCard bot={voicebot} numbersAttached={32} />);
    expect(screen.getByText("32 numbers")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mapped number/i })
    ).not.toBeInTheDocument();
  });

  it("renders the numbers pill non-interactive when the card is disabled", () => {
    render(
      <BotCard
        bot={voicebot}
        numbersAttached={32}
        botCardDisabled
        onNumbersClick={vi.fn()}
      />
    );
    expect(screen.getByText("32 numbers")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mapped number/i })
    ).not.toBeInTheDocument();
  });

  it("renders last published info", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.getByText("Last Published")).toBeInTheDocument();
    expect(screen.getByText(/Nandan Raikwar/)).toBeInTheDocument();
    expect(screen.getByText(/15 Jan, 2025/)).toBeInTheDocument();
  });

  it("renders fallback dash when no last published info", () => {
    const bot: Bot = {
      ...chatbot,
      lastPublishedBy: undefined,
      lastPublishedDate: undefined,
    };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows Unpublished changes when status is draft", () => {
    const bot: Bot = {
      ...voicebot,
      status: "draft",
      lastPublishedBy: undefined,
      lastPublishedDate: undefined,
    };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(screen.getByText("Last Published")).toBeInTheDocument();
  });

  it("shows last published info when status is published even with draft data", () => {
    const bot: Bot = {
      ...chatbot,
      status: "published",
      lastPublishedBy: "User",
      lastPublishedDate: "1 Jan, 2025",
    };
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
    expect(
      screen.getByText(/Nandan Raikwar \| 15 Jan, 2025/)
    ).toBeInTheDocument();
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

  it("hides the Partner Portal badge by default", () => {
    render(<BotCard bot={chatbot} />);
    expect(screen.queryByText("Partner Portal")).not.toBeInTheDocument();
  });

  it("shows the Partner Portal badge for chatbot when PartnerPortal is true", () => {
    render(<BotCard bot={chatbot} PartnerPortal />);
    expect(screen.getByText("Partner Portal")).toBeInTheDocument();
  });

  it("shows the Partner Portal badge for voicebot when PartnerPortal is true", () => {
    render(<BotCard bot={voicebot} PartnerPortal />);
    expect(screen.getByText("Partner Portal")).toBeInTheDocument();
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
    render(<BotCard bot={bot} typeLabels={{ chatbot: "Chat" }} />);
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
    await user.click(
      screen.getByRole("button", { name: "Edit Lead validation bot" })
    );
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

  it("mutes disabled cards and blocks edit interactions", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const { container } = render(
      <BotCard bot={chatbot} botCardDisabled onEdit={handleEdit} />
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.queryByRole("button", { name: "Edit Lead validation bot" })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("More options")).toBeDisabled();

    await user.click(root);
    expect(handleEdit).not.toHaveBeenCalled();
  });

  it("shows disabledTooltip only when the card is disabled", async () => {
    const user = userEvent.setup();
    const tooltip = "Disable the current chatbot first.";
    const { container, rerender } = render(
      <BotCard bot={chatbot} disabledTooltip={tooltip} />
    );

    await user.hover(container.firstElementChild as HTMLElement);
    expect(screen.queryByText(tooltip)).not.toBeInTheDocument();

    rerender(
      <BotCard bot={chatbot} botCardDisabled disabledTooltip={tooltip} />
    );
    await user.hover(container.firstElementChild as HTMLElement);

    await waitFor(() => {
      expect(screen.getAllByText(tooltip).length).toBeGreaterThan(0);
    });
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

  it("formats large conversation counts for chatbot", () => {
    const bot: Bot = { ...chatbot, conversationCount: 1000 };
    render(<BotCard bot={bot} />);
    expect(screen.getByText("1,000 Conversations")).toBeInTheDocument();
  });
});
