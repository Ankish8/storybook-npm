import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotFollowUps } from "../bot-follow-ups";
import type { NudgeItem } from "../types";

const SAMPLE_NUDGES: NudgeItem[] = [
  {
    id: "1",
    name: "legacy-name-1",
    enabled: true,
    delayHours: 1,
    delayMinutes: 30,
    message: "Are you still there?",
  },
  {
    id: "2",
    name: "legacy-name-2",
    enabled: false,
    delayHours: 0,
    delayMinutes: 45,
    message: "Need any help?",
  },
];

/** Controlled wrapper so message edits persist (required for empty-message validation). */
function StatefulBotFollowUps({
  initialNudges,
  ...rest
}: Omit<React.ComponentProps<typeof BotFollowUps>, "nudges"> & {
  initialNudges: NudgeItem[];
}) {
  const [nudges, setNudges] = React.useState(initialNudges);
  return (
    <BotFollowUps
      {...rest}
      nudges={nudges}
      onMessageChange={(id, message) =>
        setNudges((prev) =>
          prev.map((n) => (n.id === id ? { ...n, message } : n))
        )
      }
    />
  );
}

describe("BotFollowUps", () => {
  it("renders default section title", () => {
    render(<BotFollowUps nudges={[]} />);
    expect(screen.getByText("Follow-ups")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<BotFollowUps nudges={[]} title="Custom title" />);
    expect(screen.getByText("Custom title")).toBeInTheDocument();
  });

  it("renders nudge items with default Followup labels", () => {
    render(<BotFollowUps nudges={SAMPLE_NUDGES} />);
    expect(screen.getByText("Followup 1")).toBeInTheDocument();
    expect(screen.getByText("Followup 2")).toBeInTheDocument();
  });

  it("getItemLabel overrides row labels", () => {
    render(
      <BotFollowUps
        nudges={SAMPLE_NUDGES}
        getItemLabel={(n) => n.name}
      />
    );
    expect(screen.getByText("legacy-name-1")).toBeInTheDocument();
  });

  it("toggle calls onToggle with id", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<BotFollowUps nudges={[SAMPLE_NUDGES[0]]} onToggle={onToggle} />);
    const toggle = screen.getByRole("switch", { name: /toggle followup 1/i });
    await user.click(toggle);
    expect(onToggle).toHaveBeenCalledWith("1", false);
  });

  it("hours field calls onDelayHoursChange when value changes", () => {
    const onDelayHoursChange = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayHoursChange={onDelayHoursChange}
      />
    );
    const input = screen.getByLabelText("Followup 1 delay hours");
    fireEvent.change(input, { target: { value: "2" } });
    expect(onDelayHoursChange).toHaveBeenCalled();
  });

  it("minutes field calls onDelayMinutesChange when value changes", () => {
    const onDelayMinutesChange = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayMinutesChange={onDelayMinutesChange}
      />
    );
    const input = screen.getByLabelText("Followup 1 delay minutes");
    fireEvent.change(input, { target: { value: "15" } });
    expect(onDelayMinutesChange).toHaveBeenCalled();
  });

  it("message textarea calls onMessageChange", async () => {
    const user = userEvent.setup();
    const onMessageChange = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onMessageChange={onMessageChange}
      />
    );
    const textarea = screen.getByLabelText("Followup 1 message");
    await user.clear(textarea);
    await user.type(textarea, "Hello");
    expect(onMessageChange).toHaveBeenCalled();
    const lastCall =
      onMessageChange.mock.calls[onMessageChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("1");
  });

  it("message textarea calls onMessageBlur", async () => {
    const user = userEvent.setup();
    const onMessageBlur = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onMessageBlur={onMessageBlur}
      />
    );
    const textarea = screen.getByLabelText("Followup 1 message");
    await user.click(textarea);
    await user.tab();
    expect(onMessageBlur).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ type: "blur" })
    );
  });

  it("shows message validation error when cleared and blurred", async () => {
    const user = userEvent.setup();
    render(<StatefulBotFollowUps initialNudges={[SAMPLE_NUDGES[0]]} />);
    const textarea = screen.getByLabelText("Followup 1 message");
    await user.clear(textarea);
    await user.tab();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("clears message validation error when user types non-empty text", async () => {
    const user = userEvent.setup();
    render(<StatefulBotFollowUps initialNudges={[SAMPLE_NUDGES[0]]} />);
    const textarea = screen.getByLabelText("Followup 1 message");
    await user.clear(textarea);
    await user.tab();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
    await user.type(textarea, "Hello");
    expect(screen.queryByText("Message is required")).not.toBeInTheDocument();
    expect(textarea).not.toHaveAttribute("aria-invalid", "true");
  });

  it("uses custom messageRequiredError copy", async () => {
    const user = userEvent.setup();
    render(
      <StatefulBotFollowUps
        initialNudges={[SAMPLE_NUDGES[0]]}
        messageRequiredError="Custom required"
      />
    );
    const textarea = screen.getByLabelText("Followup 1 message");
    await user.clear(textarea);
    await user.tab();
    expect(screen.getByText("Custom required")).toBeInTheDocument();
  });

  it("hours input calls onDelayHoursBlur", async () => {
    const user = userEvent.setup();
    const onDelayHoursBlur = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayHoursBlur={onDelayHoursBlur}
      />
    );
    const input = screen.getByLabelText("Followup 1 delay hours");
    await user.click(input);
    await user.tab();
    expect(onDelayHoursBlur).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ type: "blur" })
    );
  });

  it("focuses hours input when using the stepper so blur handlers run after leaving the field", async () => {
    const user = userEvent.setup();
    const onDelayHoursBlur = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayHoursBlur={onDelayHoursBlur}
      />
    );
    const input = screen.getByLabelText("Followup 1 delay hours");
    await user.click(
      screen.getByRole("button", { name: /increase followup 1 hours/i })
    );
    expect(input).toHaveFocus();
    await user.tab();
    expect(onDelayHoursBlur).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ type: "blur" })
    );
  });

  it("minutes input calls onDelayMinutesBlur", async () => {
    const user = userEvent.setup();
    const onDelayMinutesBlur = vi.fn();
    render(
      <BotFollowUps
        nudges={[SAMPLE_NUDGES[0]]}
        onDelayMinutesBlur={onDelayMinutesBlur}
      />
    );
    const input = screen.getByLabelText("Followup 1 delay minutes");
    await user.click(input);
    await user.tab();
    expect(onDelayMinutesBlur).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ type: "blur" })
    );
  });

  it("renders multiple nudges", () => {
    render(<BotFollowUps nudges={SAMPLE_NUDGES} />);
    expect(screen.getByText("Followup 1")).toBeInTheDocument();
    expect(screen.getByText("Followup 2")).toBeInTheDocument();
    expect(screen.getByText("Are you still there?")).toBeInTheDocument();
    expect(screen.getByText("Need any help?")).toBeInTheDocument();
  });

  it("renders empty state when nudges=[]", () => {
    render(<BotFollowUps nudges={[]} />);
    expect(screen.getByText("No follow-ups configured")).toBeInTheDocument();
  });

  it("custom className is applied", () => {
    const { container } = render(
      <BotFollowUps nudges={[]} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("ref forwarding works", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BotFollowUps nudges={[]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("data-testid spreads via ...props", () => {
    render(<BotFollowUps nudges={[]} data-testid="nudges-section" />);
    expect(screen.getByTestId("nudges-section")).toBeInTheDocument();
  });

  it("disabled state disables switch toggles", () => {
    render(<BotFollowUps nudges={[SAMPLE_NUDGES[0]]} disabled />);
    const toggle = screen.getByRole("switch", { name: /toggle followup 1/i });
    expect(toggle).toBeDisabled();
  });

  it("disabled state disables inputs and textareas", () => {
    render(<BotFollowUps nudges={[SAMPLE_NUDGES[0]]} disabled />);
    expect(screen.getByLabelText("Followup 1 delay hours")).toBeDisabled();
    expect(screen.getByLabelText("Followup 1 delay minutes")).toBeDisabled();
    const messageTextarea = screen.getByLabelText("Followup 1 message");
    expect(messageTextarea).toBeDisabled();
  });
});
