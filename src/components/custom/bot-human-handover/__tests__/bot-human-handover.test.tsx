import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BotHumanHandover } from "../bot-human-handover";

describe("BotHumanHandover", () => {
  it("renders the Human Handover title", () => {
    render(<BotHumanHandover />);
    expect(screen.getByText("Human Handover")).toBeInTheDocument();
  });

  it("renders the default label text", () => {
    render(<BotHumanHandover />);
    expect(
      screen.getByText("Connect to a human if bot can not answer")
    ).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<BotHumanHandover label="Custom handover label" />);
    expect(screen.getByText("Custom handover label")).toBeInTheDocument();
    expect(
      screen.queryByText("Connect to a human if bot can not answer")
    ).not.toBeInTheDocument();
  });

  it("calls onToggle when the switch is clicked", () => {
    const onToggle = vi.fn();
    render(<BotHumanHandover onToggle={onToggle} />);
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders the edit button when onEdit is provided", () => {
    const onEdit = vi.fn();
    render(<BotHumanHandover onEdit={onEdit} />);
    const editButton = screen.getByLabelText("Edit handover settings");
    expect(editButton).toBeInTheDocument();
  });

  it("calls onEdit when the edit button is clicked", () => {
    const onEdit = vi.fn();
    render(<BotHumanHandover onEdit={onEdit} />);
    const editButton = screen.getByLabelText("Edit handover settings");
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("hides the edit button when onEdit is not provided", () => {
    render(<BotHumanHandover />);
    expect(
      screen.queryByLabelText("Edit handover settings")
    ).not.toBeInTheDocument();
  });

  it("hides the info tooltip trigger by default (infoTooltip omitted)", () => {
    render(<BotHumanHandover />);
    expect(
      screen.queryByLabelText("Human Handover: more information")
    ).not.toBeInTheDocument();
  });

  it("hides the info tooltip trigger when infoTooltip is an empty string", () => {
    render(<BotHumanHandover infoTooltip="" />);
    expect(
      screen.queryByLabelText("Human Handover: more information")
    ).not.toBeInTheDocument();
  });

  it("renders the info tooltip trigger only when a non-empty tooltip string is provided", () => {
    render(<BotHumanHandover infoTooltip="Custom tooltip message" />);
    expect(
      screen.getByLabelText("Human Handover: more information")
    ).toBeInTheDocument();
  });

  it("disables the switch when disabled is true", () => {
    render(<BotHumanHandover disabled />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeDisabled();
  });

  it("applies custom className to root element", () => {
    const { container } = render(
      <BotHumanHandover className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null };
    render(<BotHumanHandover ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto root element", () => {
    const { container } = render(
      <BotHumanHandover data-testid="handover-root" />
    );
    expect(container.firstChild).toHaveAttribute(
      "data-testid",
      "handover-root"
    );
  });
});
