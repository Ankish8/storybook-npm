import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotNudges } from "../bot-nudges";
import type { NudgeItem } from "../types";

const SAMPLE_NUDGES: NudgeItem[] = [
  {
    id: "1",
    name: "Nudge 1",
    enabled: true,
    delayValue: 15,
    delayUnit: "minutes",
    message: "Are you still there?",
  },
  {
    id: "2",
    name: "Nudge 2",
    enabled: false,
    delayValue: 30,
    delayUnit: "seconds",
    message: "Need any help?",
  },
];

describe("BotNudges", () => {
  it("renders 'Nudges' title", () => {
    render(<BotNudges nudges={[]} />);
    expect(screen.getByText("Nudges")).toBeInTheDocument();
  });

  it("renders nudge items with names", () => {
    render(<BotNudges nudges={SAMPLE_NUDGES} />);
    expect(screen.getByText("Nudge 1")).toBeInTheDocument();
    expect(screen.getByText("Nudge 2")).toBeInTheDocument();
  });

  it("toggle calls onToggle with id", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <BotNudges nudges={[SAMPLE_NUDGES[0]]} onToggle={onToggle} />
    );
    const toggle = screen.getByRole("switch", { name: /toggle nudge 1/i });
    await user.click(toggle);
    expect(onToggle).toHaveBeenCalledWith("1", false);
  });

  it("delay value input calls onDelayValueChange", async () => {
    const user = userEvent.setup();
    const onDelayValueChange = vi.fn();
    render(
      <BotNudges
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayValueChange={onDelayValueChange}
      />
    );
    const input = screen.getByLabelText("Nudge 1 delay value");
    await user.clear(input);
    await user.type(input, "30");
    expect(onDelayValueChange).toHaveBeenCalled();
    // Last call should have id "1"
    const lastCall =
      onDelayValueChange.mock.calls[
        onDelayValueChange.mock.calls.length - 1
      ];
    expect(lastCall[0]).toBe("1");
  });

  it("message textarea calls onMessageChange", async () => {
    const user = userEvent.setup();
    const onMessageChange = vi.fn();
    render(
      <BotNudges
        nudges={[SAMPLE_NUDGES[0]]}
        onMessageChange={onMessageChange}
      />
    );
    const textarea = screen.getByLabelText("Nudge 1 message");
    await user.clear(textarea);
    await user.type(textarea, "Hello");
    expect(onMessageChange).toHaveBeenCalled();
    const lastCall =
      onMessageChange.mock.calls[onMessageChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("1");
  });

  it("renders multiple nudges", () => {
    render(<BotNudges nudges={SAMPLE_NUDGES} />);
    expect(screen.getByText("Nudge 1")).toBeInTheDocument();
    expect(screen.getByText("Nudge 2")).toBeInTheDocument();
    expect(screen.getByText("Are you still there?")).toBeInTheDocument();
    expect(screen.getByText("Need any help?")).toBeInTheDocument();
  });

  it("renders empty state when nudges=[]", () => {
    render(<BotNudges nudges={[]} />);
    expect(screen.getByText("No nudges configured")).toBeInTheDocument();
  });

  it("custom className is applied", () => {
    const { container } = render(
      <BotNudges nudges={[]} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("ref forwarding works", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BotNudges nudges={[]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("data-testid spreads via ...props", () => {
    render(<BotNudges nudges={[]} data-testid="nudges-section" />);
    expect(screen.getByTestId("nudges-section")).toBeInTheDocument();
  });

  it("disabled state disables switch toggles", () => {
    render(<BotNudges nudges={[SAMPLE_NUDGES[0]]} disabled />);
    const toggle = screen.getByRole("switch", { name: /toggle nudge 1/i });
    expect(toggle).toBeDisabled();
  });

  it("disabled state disables inputs and textareas", () => {
    render(<BotNudges nudges={[SAMPLE_NUDGES[0]]} disabled />);
    const delayInput = screen.getByLabelText("Nudge 1 delay value");
    expect(delayInput).toBeDisabled();
    const messageTextarea = screen.getByLabelText("Nudge 1 message");
    expect(messageTextarea).toBeDisabled();
  });
});
