import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditVariableDialog } from "../edit-variable-dialog";

describe("EditVariableDialog", () => {
  it("shows Edit variable title in edit mode", () => {
    render(
      <EditVariableDialog
        open
        onOpenChange={vi.fn()}
        mode="edit"
        initialValues={{ name: "contact_name", description: "", required: false }}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: /edit variable/i })).toBeInTheDocument();
  });

  it("shows Add new variable title in add mode", () => {
    render(
      <EditVariableDialog
        open
        onOpenChange={vi.fn()}
        mode="add"
        onSave={vi.fn()}
      />
    );
    expect(
      screen.getByRole("heading", { name: /add new variable/i })
    ).toBeInTheDocument();
  });

  it("calls onSave with trimmed values when valid", () => {
    const onSave = vi.fn();
    render(
      <EditVariableDialog
        open
        onOpenChange={vi.fn()}
        mode="add"
        onSave={onSave}
      />
    );
    const nameInput = screen.getByLabelText(/variable name/i);
    fireEvent.change(nameInput, { target: { value: "contact_name" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(onSave).toHaveBeenCalledWith({
      name: "contact_name",
      description: "",
      required: false,
    });
  });

  it("shows error when name is empty on save", () => {
    const onSave = vi.fn();
    render(
      <EditVariableDialog
        open
        onOpenChange={vi.fn()}
        mode="add"
        onSave={onSave}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText(/variable name is required/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows submitError from parent", () => {
    render(
      <EditVariableDialog
        open
        onOpenChange={vi.fn()}
        mode="add"
        onSave={vi.fn()}
        submitError="A variable with this name already exists"
      />
    );
    expect(
      screen.getByText(/a variable with this name already exists/i)
    ).toBeInTheDocument();
  });
});
