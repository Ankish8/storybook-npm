import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BotFunctions } from "../bot-functions";
import type { FunctionItem } from "../types";

const SAMPLE_FUNCTIONS: FunctionItem[] = [
  { id: "fn-1", name: "check_order_status(order_id)" },
  { id: "fn-2", name: "get_weather(city)" },
  { id: "fn-3", name: "send_email(to, subject, body)" },
];

describe("BotFunctions", () => {
  it("renders the Functions title", () => {
    render(<BotFunctions functions={[]} />);
    const heading = screen.getByRole("heading", { name: "Functions" });
    expect(heading).toBeInTheDocument();
  });

  it("renders function items", () => {
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} />);
    expect(screen.getByText("check_order_status(order_id)")).toBeInTheDocument();
    expect(screen.getByText("get_weather(city)")).toBeInTheDocument();
    expect(screen.getByText("send_email(to, subject, body)")).toBeInTheDocument();
  });

  it("shows empty state when functions array is empty", () => {
    render(<BotFunctions functions={[]} />);
    expect(screen.getByText("No functions added yet.")).toBeInTheDocument();
  });

  it("does not show empty state when functions exist", () => {
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} />);
    expect(screen.queryByText("No functions added yet.")).not.toBeInTheDocument();
  });

  it("calls onAdd when + Functions button is clicked", () => {
    const onAdd = vi.fn();
    render(<BotFunctions functions={[]} onAdd={onAdd} />);
    const addButton = screen.getByRole("button", { name: /functions/i });
    fireEvent.click(addButton);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit with function id when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} onEdit={onEdit} />);
    const editButton = screen.getByLabelText("Edit check_order_status(order_id)");
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith("fn-1");
  });

  it("calls onDelete with function id when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} onDelete={onDelete} />);
    const deleteButton = screen.getByLabelText("Delete check_order_status(order_id)");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("fn-1");
  });

  it("does not render edit buttons when onEdit is not provided", () => {
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} />);
    expect(screen.queryByLabelText("Edit check_order_status(order_id)")).not.toBeInTheDocument();
  });

  it("does not render delete buttons when onDelete is not provided", () => {
    render(<BotFunctions functions={SAMPLE_FUNCTIONS} />);
    expect(screen.queryByLabelText("Delete check_order_status(order_id)")).not.toBeInTheDocument();
  });

  it("disables add button when disabled is true", () => {
    render(<BotFunctions functions={[]} disabled />);
    const addButton = screen.getByRole("button", { name: /functions/i });
    expect(addButton).toBeDisabled();
  });

  it("disables edit and delete buttons when disabled is true", () => {
    render(
      <BotFunctions
        functions={SAMPLE_FUNCTIONS}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        disabled
      />
    );
    const editButton = screen.getByLabelText("Edit check_order_status(order_id)");
    const deleteButton = screen.getByLabelText("Delete check_order_status(order_id)");
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it("applies custom className to root element", () => {
    const { container } = render(
      <BotFunctions functions={[]} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null };
    render(<BotFunctions functions={[]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto root element", () => {
    const { container } = render(
      <BotFunctions functions={[]} data-testid="bot-functions-root" />
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "bot-functions-root");
  });

  it("renders info tooltip trigger when infoTooltip is provided", () => {
    render(
      <BotFunctions
        functions={[]}
        infoTooltip="Functions extend the bot's capabilities"
      />
    );
    expect(screen.getByLabelText("Functions: more information")).toBeInTheDocument();
  });

  it("does not render tooltip trigger when infoTooltip is not provided", () => {
    render(<BotFunctions functions={[]} />);
    expect(screen.queryByLabelText("Functions: more information")).not.toBeInTheDocument();
  });
});
