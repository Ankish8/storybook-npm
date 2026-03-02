import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatListItem } from "../chat-list-item";

const defaultProps = {
  name: "Aditi Kumar",
  message: "Have a look at this document",
  timestamp: "2:30 PM",
  channel: "MY01",
};

describe("ChatListItem", () => {
  it("renders name, message, timestamp, and channel", () => {
    render(<ChatListItem {...defaultProps} />);
    expect(screen.getByText("Aditi Kumar")).toBeInTheDocument();
    expect(
      screen.getByText("Have a look at this document")
    ).toBeInTheDocument();
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    expect(screen.getByText("MY01")).toBeInTheDocument();
  });

  it("renders agent name in channel pill", () => {
    render(<ChatListItem {...defaultProps} agentName="Alex Smith" />);
    expect(screen.getByText("Alex Smith")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders unread count badge when unreadCount is set", () => {
    render(<ChatListItem {...defaultProps} unreadCount={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("caps unread count at 99+", () => {
    render(<ChatListItem {...defaultProps} unreadCount={150} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("renders SLA timer tag", () => {
    render(<ChatListItem {...defaultProps} slaTimer="2h" />);
    expect(screen.getByText("2h")).toBeInTheDocument();
  });

  it("renders deleted agent in error color", () => {
    render(
      <ChatListItem
        {...defaultProps}
        agentName="Deleted User"
        isAgentDeleted
      />
    );
    const pill = screen.getByText("Deleted User").closest("span");
    expect(pill?.parentElement).toHaveClass("text-[#b42318]");
  });

  it("does not show unread badge when messageStatus is set", () => {
    render(
      <ChatListItem
        {...defaultProps}
        messageStatus="sent"
        unreadCount={5}
      />
    );
    // messageStatus takes priority — unread badge should not render
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("applies selected styles when isSelected is true", () => {
    render(<ChatListItem {...defaultProps} isSelected />);
    const item = screen.getByRole("button");
    expect(item).toHaveClass("bg-[#f5f5f5]");
    expect(item).toHaveClass("border-l-[#27abb8]");
  });

  it("applies hover styles when not selected", () => {
    render(<ChatListItem {...defaultProps} />);
    const item = screen.getByRole("button");
    expect(item).toHaveClass("bg-white");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<ChatListItem {...defaultProps} onClick={handleClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter key", async () => {
    const handleClick = vi.fn();
    render(<ChatListItem {...defaultProps} onClick={handleClick} />);
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ChatListItem {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<ChatListItem {...defaultProps} className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("passes additional HTML attributes", () => {
    render(<ChatListItem {...defaultProps} data-testid="chat-item" />);
    expect(screen.getByTestId("chat-item")).toBeInTheDocument();
  });
});
