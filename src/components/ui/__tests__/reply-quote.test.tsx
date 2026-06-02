import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReplyQuote } from "../reply-quote";
import { assertNoBootstrapMarginBleed } from "./utils/bootstrap-compat";

describe("ReplyQuote", () => {
  it("renders sender and message text", () => {
    render(<ReplyQuote sender="John Doe" message="Hello, how are you?" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReplyQuote
        sender="John"
        message="Test"
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild?.className).toMatch(
      /tw-bg-\[var\(--semantic-bg-ui/
    );
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<ReplyQuote ref={ref} sender="John" message="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("onClick handler fires", () => {
    const handleClick = vi.fn();
    render(
      <ReplyQuote
        sender="John"
        message="Test"
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText("John"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("data-testid spreads correctly", () => {
    render(
      <ReplyQuote
        sender="John"
        message="Test"
        data-testid="reply-quote"
      />
    );
    expect(screen.getByTestId("reply-quote")).toBeInTheDocument();
  });

  it("truncates long text inside a bounded quote", () => {
    const { container } = render(
      <ReplyQuote
        sender="A very long sender name that should be truncated"
        message="A very long message text that should also be truncated in the UI"
      />
    );
    expect(container.firstChild).toHaveClass("tw-max-w-full", "tw-min-w-0");
    expect(container.querySelector("p")).toHaveClass("tw-truncate");
    expect(screen.getByText(/A very long message text/)).toHaveClass(
      "tw-overflow-hidden",
      "tw-text-ellipsis",
      "tw-whitespace-nowrap"
    );
  });

  it("renders rich message content", () => {
    render(
      <ReplyQuote
        sender="John"
        message={<span data-testid="carousel-card-reply">Carousel card</span>}
      />
    );

    expect(screen.getByTestId("carousel-card-reply")).toBeInTheDocument();
  });

  it("all <p> elements have m-0 for Bootstrap compatibility", () => {
    const { container } = render(
      <ReplyQuote sender="John" message="Test" />
    );
    assertNoBootstrapMarginBleed(container);
  });

  // Accessibility tests

  it("has role=button when onClick is provided", () => {
    const { container } = render(
      <ReplyQuote sender="John" message="Test" onClick={() => {}} />
    );
    expect(container.firstChild).toHaveAttribute("role", "button");
  });

  it("is keyboard focusable when onClick is provided", () => {
    const { container } = render(
      <ReplyQuote sender="John" message="Test" onClick={() => {}} />
    );
    expect(container.firstChild).toHaveAttribute("tabindex", "0");
  });

  it("fires onClick on Enter key", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ReplyQuote sender="John" message="Test" onClick={handleClick} />
    );
    fireEvent.keyDown(container.firstChild!, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("fires onClick on Space key", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ReplyQuote sender="John" message="Test" onClick={handleClick} />
    );
    fireEvent.keyDown(container.firstChild!, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does NOT have role=button when onClick is not provided", () => {
    const { container } = render(
      <ReplyQuote sender="John" message="Test" />
    );
    expect(container.firstChild).not.toHaveAttribute("role");
  });

  it("has accessible aria-label", () => {
    const { container } = render(
      <ReplyQuote sender="John Doe" message="Hello there" />
    );
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Quoted reply from John Doe: Hello there"
    );
  });

  it("allows overriding aria-label", () => {
    const { container } = render(
      <ReplyQuote
        sender="John"
        message="Test"
        aria-label="Custom label"
      />
    );
    expect(container.firstChild).toHaveAttribute("aria-label", "Custom label");
  });

  it("does not fire onClick on unrelated keys", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ReplyQuote sender="John" message="Test" onClick={handleClick} />
    );
    fireEvent.keyDown(container.firstChild!, { key: "Tab" });
    fireEvent.keyDown(container.firstChild!, { key: "Escape" });
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("calls consumer onKeyDown alongside internal handler", () => {
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();
    const { container } = render(
      <ReplyQuote
        sender="John"
        message="Test"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
    fireEvent.keyDown(container.firstChild!, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
