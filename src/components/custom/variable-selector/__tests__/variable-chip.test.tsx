import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariableChip } from "../variable-chip";

describe("VariableChip", () => {
  it("renders variable token like Figma {{name}}", () => {
    render(<VariableChip name="Order_id" />);
    expect(screen.getByText("{{Order_id}}")).toBeInTheDocument();
  });

  it("does not show edit button when showEditIcon is false", () => {
    render(<VariableChip name="Order_id" showEditIcon={false} />);
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
  });

  it("shows edit button and calls onEdit when clicked", () => {
    const onEdit = vi.fn();
    render(<VariableChip name="Order_id" showEditIcon onEdit={onEdit} />);
    const btn = screen.getByRole("button", { name: /edit order_id/i });
    fireEvent.click(btn);
    expect(onEdit).toHaveBeenCalledWith("Order_id");
  });

  it("applies custom className", () => {
    const { container } = render(<VariableChip name="x" className="custom-chip" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass("custom-chip");
  });

  it("has semantic token classes", () => {
    const { container } = render(<VariableChip name="x" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass("bg-semantic-bg-ui");
    expect(chip).toHaveClass("text-semantic-text-secondary");
  });
});
