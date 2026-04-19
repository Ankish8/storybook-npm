import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ChatNotification } from "../chat-notification";
import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";

describe("ChatNotification", () => {
  it("renders message and action", () => {
    render(
      <ChatNotification
        type="warning"
        message="Notifications are blocked."
        actionText="Enable"
      />
    );
    expect(screen.getByText("Notifications are blocked.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enable" })).toBeInTheDocument();
  });

  it("calls onActionClick when the link is pressed", () => {
    const onActionClick = vi.fn();
    render(
      <ChatNotification
        type="warning"
        message="Hello"
        actionText="Go"
        onActionClick={onActionClick}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it("uses warning Alert surface classes", () => {
    const { container } = render(
      <ChatNotification type="warning" message="Warn" actionText="Ok" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-semantic-warning-surface");
  });

  it("uses error Alert surface classes", () => {
    const { container } = render(
      <ChatNotification type="error" message="Err" actionText="Fix" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-semantic-error-surface");
  });

  it("uses Typography body text for the message", () => {
    const { container } = render(
      <ChatNotification type="warning" message="Hello" actionText="Go" />
    );
    const typo = container.querySelector(".text-semantic-text-primary");
    expect(typo).toBeTruthy();
    expect(typo?.textContent).toContain("Hello");
  });

  it("uses error Typography color when type is error", () => {
    const { container } = render(
      <ChatNotification type="error" message="Low balance" actionText="Recharge" />
    );
    const typo = container.querySelector(".text-semantic-error-primary");
    expect(typo).toBeTruthy();
    expect(typo?.textContent).toContain("Low balance");
  });

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ChatNotification ref={ref} type="warning" message="x" actionText="y" />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the root", () => {
    const { container } = render(
      <ChatNotification
        className="my-nudge"
        type="warning"
        message="m"
        actionText="a"
      />
    );
    expect(container.firstChild).toHaveClass("my-nudge");
  });

  it("keeps paragraph margins reset for Bootstrap hosts", () => {
    const { container } = render(
      <ChatNotification type="warning" message="m" actionText="a" />
    );
    assertNoBootstrapMarginBleed(container);
  });
});
