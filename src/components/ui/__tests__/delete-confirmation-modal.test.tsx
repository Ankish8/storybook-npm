import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteConfirmationModal } from "../delete-confirmation-modal";
import { Button } from "../button";

describe("DeleteConfirmationModal", () => {
  it("renders with default title when itemName is provided", () => {
    render(<DeleteConfirmationModal open={true} itemName="webhook" />);

    expect(
      screen.getByText("Are you sure you want to delete this webhook?")
    ).toBeInTheDocument();
  });

  it("renders with custom title when provided", () => {
    render(<DeleteConfirmationModal open={true} title="Custom Title" />);

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        description="This action cannot be undone."
      />
    );

    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
  });

  it("has delete button disabled by default", () => {
    render(<DeleteConfirmationModal open={true} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("enables delete button when correct text is entered", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal open={true} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "DELETE");

    expect(screen.getByRole("button", { name: /delete/i })).toBeEnabled();
  });

  it("keeps delete button disabled with incorrect text", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal open={true} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "delete"); // lowercase

    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("keeps delete button disabled with partial text", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal open={true} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "DEL");

    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("calls onConfirm when delete button is clicked with correct text", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DeleteConfirmationModal open={true} onConfirm={onConfirm} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "DELETE");
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DeleteConfirmationModal
        open={true}
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uses custom confirmText", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal open={true} confirmText="CONFIRM" />);

    expect(
      screen.getByText(/Enter "CONFIRM" in uppercase to confirm/i)
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    await user.type(input, "CONFIRM");

    expect(screen.getByRole("button", { name: /delete/i })).toBeEnabled();
  });

  it("uses custom button text", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        deleteButtonText="Remove"
        cancelButtonText="Go Back"
      />
    );

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
  });

  it("shows loading state on delete button", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmationModal open={true} loading={true} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "DELETE");

    // Delete button should be disabled even with correct text when loading
    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("disables cancel button when loading", () => {
    render(<DeleteConfirmationModal open={true} loading={true} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("resets input when modal closes", async () => {
    const { rerender } = render(<DeleteConfirmationModal open={true} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "DELETE" } });
    expect(input).toHaveValue("DELETE");

    // Close the modal
    rerender(<DeleteConfirmationModal open={false} />);

    // Reopen the modal
    rerender(<DeleteConfirmationModal open={true} />);

    // Input should be reset
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });

  it("renders with trigger for uncontrolled usage", async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmationModal
        trigger={<Button>Delete Item</Button>}
        itemName="item"
      />
    );

    expect(screen.getByText("Delete Item")).toBeInTheDocument();

    await user.click(screen.getByText("Delete Item"));

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this item?")
      ).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(<DeleteConfirmationModal open={true} className="custom-class" />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it("has proper dialog role", () => {
      render(<DeleteConfirmationModal open={true} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("input has label association", () => {
      render(<DeleteConfirmationModal open={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "delete-confirmation-input");
    });

    it("autofocuses the input", () => {
      render(<DeleteConfirmationModal open={true} />);

      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("provides sr-only description when none is provided", () => {
      render(<DeleteConfirmationModal open={true} itemName="webhook" />);

      // Should have a hidden description for screen readers
      const srOnlyDescription = screen.getByText(
        "Delete confirmation dialog - this action cannot be undone"
      );
      expect(srOnlyDescription).toBeInTheDocument();
      expect(srOnlyDescription).toHaveClass("sr-only");
    });

    it("shows visible description when provided", () => {
      render(
        <DeleteConfirmationModal
          open={true}
          description="This will permanently remove the item."
        />
      );

      const description = screen.getByText(
        "This will permanently remove the item."
      );
      expect(description).toBeInTheDocument();
      expect(description).not.toHaveClass("sr-only");
    });
  });
});
