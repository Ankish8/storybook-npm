import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatBubble } from "../chat-bubble";

describe("ChatBubble", () => {
  it("renders children text in sender variant", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Hello from agent
      </ChatBubble>
    );
    expect(screen.getByText("Hello from agent")).toBeInTheDocument();
  });

  it("renders children text in receiver variant", () => {
    render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Hello from customer
      </ChatBubble>
    );
    expect(screen.getByText("Hello from customer")).toBeInTheDocument();
  });

  it("sender variant has info surface background class", () => {
    const { container } = render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    const bubble = container.querySelector(".bg-semantic-info-surface");
    expect(bubble).toBeInTheDocument();
  });

  it("receiver variant has white background", () => {
    const { container } = render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Test
      </ChatBubble>
    );
    const bubble = container.querySelector(".bg-white");
    expect(bubble).toBeInTheDocument();
  });

  it("shows sender name when provided", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" senderName="Alex Smith">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Alex Smith")).toBeInTheDocument();
  });

  it("shows delivery status for sender variant", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("hides delivery status for receiver variant", () => {
    render(
      <ChatBubble variant="receiver" timestamp="2:16 PM" status="sent">
        Test
      </ChatBubble>
    );
    expect(screen.queryByText("Sent")).not.toBeInTheDocument();
  });

  it("shows timestamp", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("2:15 PM")).toBeInTheDocument();
  });

  it("renders reply quote when reply prop is provided", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        reply={{ sender: "John", message: "Original message" }}
      >
        Reply text
      </ChatBubble>
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Original message")).toBeInTheDocument();
  });

  it("renders media slot content", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        media={<div data-testid="media-content">Media here</div>}
      >
        Caption text
      </ChatBubble>
    );
    expect(screen.getByTestId("media-content")).toBeInTheDocument();
    expect(screen.getByText("Caption text")).toBeInTheDocument();
  });

  it("custom className is applied", () => {
    const { container } = render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        className="custom-class"
      >
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" ref={ref}>
        Test
      </ChatBubble>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        data-testid="chat-bubble"
      >
        Test
      </ChatBubble>
    );
    expect(screen.getByTestId("chat-bubble")).toBeInTheDocument();
  });

  it("failed status shows error styling", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="failed">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Failed to send")).toBeInTheDocument();
    const failedText = screen.getByText("Failed to send");
    expect(failedText).toHaveClass("text-semantic-error-primary");
  });

  it("shows delivered status with correct text", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="delivered">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("shows read status with correct text", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="read">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("sender variant aligns to the right", () => {
    const { container } = render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("justify-end");
  });

  it("receiver variant aligns to the left", () => {
    const { container } = render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("justify-start");
  });
});
