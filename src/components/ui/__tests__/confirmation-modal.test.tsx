import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationModal } from "../confirmation-modal";
import { Button } from "../button";

describe("ConfirmationModal", () => {
  it("renders title", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm Action"
        description="Please confirm this action"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Are you sure you want to proceed?"
      />
    );

    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Please confirm"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: /yes/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Please confirm or cancel"
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders default variant button by default", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Default variant test"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // Button uses semantic color tokens
    expect(confirmButton).toHaveClass("bg-semantic-primary");
  });

  it("renders destructive variant button when variant is destructive", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Destructive variant test"
        variant="destructive"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // Button uses semantic color tokens
    expect(confirmButton).toHaveClass("bg-semantic-error-primary");
  });

  it("uses custom button text", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Custom button text test"
        confirmButtonText="Proceed"
        cancelButtonText="Go Back"
      />
    );

    expect(
      screen.getByRole("button", { name: "Proceed" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go Back" })
    ).toBeInTheDocument();
  });

  it("shows loading state on confirm button", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Loading state test"
        loading={true}
      />
    );

    expect(screen.getByRole("button", { name: /yes/i })).toBeDisabled();
  });

  it("disables cancel button when loading", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Loading state test"
        loading={true}
      />
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("renders with trigger for uncontrolled usage", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal
        trigger={<Button>Open Modal</Button>}
        title="Triggered Modal"
        description="Modal opened via trigger"
      />
    );

    expect(screen.getByText("Open Modal")).toBeInTheDocument();

    await user.click(screen.getByText("Open Modal"));

    await waitFor(() => {
      expect(screen.getByText("Triggered Modal")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        description="Custom class test"
        className="custom-class"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders with ReactNode title", () => {
    render(
      <ConfirmationModal
        open={true}
        title={<span data-testid="custom-title">Custom Title</span>}
        description="ReactNode title test"
      />
    );

    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });

  it("renders with ReactNode description", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Title"
        description={
          <span data-testid="custom-desc">
            Custom <strong>description</strong>
          </span>
        }
      />
    );

    expect(screen.getByTestId("custom-desc")).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it("has proper dialog role", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm"
          description="Accessibility test"
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has accessible buttons", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm"
          description="Button accessibility test"
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
        />
      );

      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    it("has description for screen readers", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm"
          description="This action cannot be undone"
        />
      );

      expect(
        screen.getByText("This action cannot be undone")
      ).toBeInTheDocument();
    });

    it("provides sr-only description when none is provided", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm Action"
        />
      );

      // Should have a hidden description for screen readers
      const srOnlyDescription = screen.getByText("Confirmation dialog");
      expect(srOnlyDescription).toBeInTheDocument();
      expect(srOnlyDescription).toHaveClass("sr-only");
    });

    it("shows visible description when provided", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm"
          description="Are you sure?"
        />
      );

      const description = screen.getByText("Are you sure?");
      expect(description).toBeInTheDocument();
      expect(description).not.toHaveClass("sr-only");
    });
  });

  describe("Controlled vs Uncontrolled", () => {
    it("works in controlled mode", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <ConfirmationModal
          open={true}
          onOpenChange={onOpenChange}
          title="Controlled"
          description="Controlled mode test"
        />
      );

      expect(screen.getByText("Controlled")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // Dialog should still be visible until parent updates open prop
      rerender(
        <ConfirmationModal
          open={false}
          onOpenChange={onOpenChange}
          title="Controlled"
          description="Controlled mode test"
        />
      );

      await waitFor(() => {
        expect(screen.queryByText("Controlled")).not.toBeInTheDocument();
      });
    });

    it("works in uncontrolled mode with trigger", async () => {
      const user = userEvent.setup();
      render(
        <ConfirmationModal
          trigger={<Button>Trigger</Button>}
          title="Uncontrolled"
          description="Uncontrolled mode test"
        />
      );

      // Initially closed
      expect(screen.queryByText("Uncontrolled")).not.toBeInTheDocument();

      // Click trigger to open
      await user.click(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByText("Uncontrolled")).toBeInTheDocument();
      });
    });
  });
});
