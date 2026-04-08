import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BotInstructions } from "../bot-instructions";
import type { InstructionItem } from "../types";

const mockInstructions: InstructionItem[] = [
  { id: "1", name: "Greeting message", enabled: true, charCount: 120 },
  { id: "2", name: "Closing response", enabled: false, charCount: 85 },
  { id: "3", name: "Error handling", enabled: true, charCount: 200 },
];

describe("BotInstructions", () => {
  it("renders title 'Instructions'", () => {
    render(<BotInstructions instructions={mockInstructions} />);
    const allMatches = screen.getAllByText("Instructions");
    // Title span + button text both contain "Instructions"
    expect(allMatches.length).toBeGreaterThanOrEqual(1);
    // The title should be a span with the correct styling
    const title = allMatches.find(
      (el) => el.tagName === "SPAN" && el.className.includes("font-semibold")
    );
    expect(title).toBeDefined();
  });

  it("shows character counter with correct values", () => {
    render(
      <BotInstructions
        instructions={mockInstructions}
        usedCharacters={1600}
        maxCharacters={5000}
      />
    );
    expect(screen.getByText("(1600")).toBeInTheDocument();
    expect(screen.getByText("/5000 characters)")).toBeInTheDocument();
  });

  it("uses default maxCharacters of 5000", () => {
    render(
      <BotInstructions instructions={mockInstructions} usedCharacters={800} />
    );
    expect(screen.getByText("/5000 characters)")).toBeInTheDocument();
  });

  it("renders instruction items with names", () => {
    render(<BotInstructions instructions={mockInstructions} />);
    expect(screen.getByText("Greeting message")).toBeInTheDocument();
    expect(screen.getByText("Closing response")).toBeInTheDocument();
    expect(screen.getByText("Error handling")).toBeInTheDocument();
  });

  it("renders character used per instruction item", () => {
    render(<BotInstructions instructions={mockInstructions} />);
    expect(screen.getByText("(120 character used)")).toBeInTheDocument();
    expect(screen.getByText("(85 character used)")).toBeInTheDocument();
    expect(screen.getByText("(200 character used)")).toBeInTheDocument();
  });

  it("toggle switch calls onToggle with id and new value", () => {
    const onToggle = vi.fn();
    render(
      <BotInstructions
        instructions={mockInstructions}
        onToggle={onToggle}
      />
    );
    // Click the toggle for "Closing response" (currently disabled)
    const toggle = screen.getByLabelText("Toggle Closing response");
    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledWith("2", true);
  });

  it("edit button calls onEdit with id", () => {
    const onEdit = vi.fn();
    render(
      <BotInstructions instructions={mockInstructions} onEdit={onEdit} />
    );
    const editButton = screen.getByLabelText("Edit Greeting message");
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith("1");
  });

  it("delete button calls onDelete with id", () => {
    const onDelete = vi.fn();
    render(
      <BotInstructions instructions={mockInstructions} onDelete={onDelete} />
    );
    const deleteButton = screen.getByLabelText("Delete Greeting message");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("renders empty state when instructions is empty", () => {
    render(<BotInstructions instructions={[]} />);
    expect(
      screen.getByText(/No instructions added yet/)
    ).toBeInTheDocument();
  });

  it("renders add button", () => {
    const onAdd = vi.fn();
    render(
      <BotInstructions instructions={mockInstructions} onAdd={onAdd} />
    );
    const addButton = screen.getByRole("button", { name: /Instructions/i });
    fireEvent.click(addButton);
    expect(onAdd).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BotInstructions
        instructions={mockInstructions}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref to root element", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <BotInstructions ref={ref} instructions={mockInstructions} />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(
      <BotInstructions
        instructions={mockInstructions}
        data-testid="bot-instructions"
      />
    );
    expect(screen.getByTestId("bot-instructions")).toBeInTheDocument();
  });

  it("disables all interactive elements when disabled is true", () => {
    render(
      <BotInstructions instructions={mockInstructions} disabled />
    );
    // Add button should be disabled
    const addButton = screen.getByRole("button", { name: /Instructions/i });
    expect(addButton).toBeDisabled();

    // Edit buttons should be disabled
    const editButton = screen.getByLabelText("Edit Greeting message");
    expect(editButton).toBeDisabled();

    // Delete buttons should be disabled
    const deleteButton = screen.getByLabelText("Delete Greeting message");
    expect(deleteButton).toBeDisabled();
  });

  it("renders info tooltip when infoTooltip is provided", () => {
    const { container } = render(
      <BotInstructions
        instructions={mockInstructions}
        infoTooltip="Helpful tooltip text"
      />
    );
    // The Info icon (SVG) should be present inside the tooltip trigger
    const infoIcon = container.querySelector(".lucide-info");
    expect(infoIcon).toBeInTheDocument();
  });

  it("does not render info icon when infoTooltip is not provided", () => {
    const { container } = render(
      <BotInstructions instructions={mockInstructions} />
    );
    const infoIcon = container.querySelector(".lucide-info");
    expect(infoIcon).not.toBeInTheDocument();
  });
});
