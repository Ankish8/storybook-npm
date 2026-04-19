import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ClearLocalChatData } from "../clear-local-chat-data";
import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";

const defaultProps = {
  title: "Clear Local Chat Data",
  description: "This clears local data.",
  buttonText: "Clear Data",
  onClearDataClick: vi.fn(),
};

describe("ClearLocalChatData", () => {
  it("renders title, description, and button", () => {
    render(<ClearLocalChatData {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: "Clear Local Chat Data" })
    ).toBeInTheDocument();
    expect(screen.getByText("This clears local data.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear Data" })
    ).toBeInTheDocument();
  });

  it("calls onClearDataClick when the button is pressed", () => {
    const onClearDataClick = vi.fn();
    render(
      <ClearLocalChatData {...defaultProps} onClearDataClick={onClearDataClick} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear Data" }));
    expect(onClearDataClick).toHaveBeenCalledTimes(1);
  });

  it("uses destructive button styling", () => {
    render(<ClearLocalChatData {...defaultProps} />);
    const btn = screen.getByRole("button", { name: "Clear Data" });
    expect(btn.className).toContain("bg-semantic-error-primary");
  });

  it("uses Typography title and body styles", () => {
    const { container } = render(<ClearLocalChatData {...defaultProps} />);
    const title = screen.getByRole("heading", { name: "Clear Local Chat Data" });
    expect(title.className).toContain("text-lg");
    expect(title.className).toContain("font-semibold");
    const desc = container.querySelector("p");
    expect(desc?.className).toContain("text-semantic-text-muted");
  });

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ClearLocalChatData ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the root", () => {
    const { container } = render(
      <ClearLocalChatData {...defaultProps} className="my-panel" />
    );
    expect(container.firstChild).toHaveClass("my-panel");
  });

  it("keeps paragraph margins reset for Bootstrap hosts", () => {
    const { container } = render(<ClearLocalChatData {...defaultProps} />);
    assertNoBootstrapMarginBleed(container);
  });
});
