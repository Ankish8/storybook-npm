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

  it("does not render channel pill when channel and agent name are empty", () => {
    const { container } = render(
      <ChatListItem
        {...defaultProps}
        channel=""
        agentName={undefined}
      />
    );
    const column = container.querySelector(".flex.flex-col.gap-2");
    expect(column?.children.length).toBe(2);
  });

  it("renders channel pill with agent only when channel is omitted", () => {
    const { channel: _c, ...rest } = defaultProps;
    render(<ChatListItem {...rest} agentName="Alex Smith" />);
    expect(screen.getByText("Alex Smith")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
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
    expect(pill?.parentElement).toHaveClass("text-semantic-error-text");
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
    expect(item).toHaveClass("bg-[var(--color-neutral-50)]");
    expect(item).toHaveClass("border-l-semantic-border-accent");
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

  /* ── Accessibility ── */

  it("has aria-selected when isSelected is true", () => {
    render(<ChatListItem {...defaultProps} isSelected />);
    const item = screen.getByRole("button");
    expect(item).toHaveAttribute("aria-selected", "true");
  });

  it("does not have aria-selected when isSelected is false", () => {
    render(<ChatListItem {...defaultProps} />);
    const item = screen.getByRole("button");
    expect(item).toHaveAttribute("aria-selected", "false");
  });

  it("has descriptive aria-label", () => {
    render(<ChatListItem {...defaultProps} />);
    const item = screen.getByRole("button");
    const label = item.getAttribute("aria-label");
    expect(label).toContain("Aditi Kumar");
    expect(label).toContain("Have a look at this document");
    expect(label).toContain("2:30 PM");
  });

  it("includes unread count and SLA in aria-label when present", () => {
    render(
      <ChatListItem {...defaultProps} unreadCount={5} slaTimer="2h" />
    );
    const item = screen.getByRole("button");
    const label = item.getAttribute("aria-label");
    expect(label).toContain("5 unread");
    expect(label).toContain("SLA: 2h");
  });

  it("unread badge has accessible label", () => {
    render(<ChatListItem {...defaultProps} unreadCount={3} />);
    const badge = screen.getByLabelText("3 unread messages");
    expect(badge).toBeInTheDocument();
  });

  it("SLA tag has accessible label", () => {
    render(<ChatListItem {...defaultProps} slaTimer="2h" />);
    const slaTag = screen.getByLabelText("SLA timer: 2h");
    expect(slaTag).toBeInTheDocument();
  });

  it("allows aria-label override via props", () => {
    render(
      <ChatListItem {...defaultProps} aria-label="Custom label" />
    );
    const item = screen.getByRole("button");
    expect(item).toHaveAttribute("aria-label", "Custom label");
  });

  it.each([
    ["queue", "Queued"],
    ["failed", "Failed"],
    ["received", "Received"],
  ] as const)("renders %s status with aria-label %s", (status, label) => {
    render(<ChatListItem {...defaultProps} messageStatus={status} />);
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it("renders message type icon for template messages", () => {
    const { container } = render(
      <ChatListItem {...defaultProps} messageType="template" />
    );
    const svg = container.querySelector("svg.lucide-layout-template");
    expect(svg).toBeTruthy();
  });
});
