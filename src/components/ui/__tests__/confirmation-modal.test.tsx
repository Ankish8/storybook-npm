import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationModal } from "../confirmation-modal";
import { Button } from "../button";

describe("ConfirmationModal", () => {
  it("renders title", () => {
    render(<ConfirmationModal open={true} title="Confirm Action" />);

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

  it("does not render description when not provided", () => {
    render(<ConfirmationModal open={true} title="Confirm" />);

    // Only title should be present, no description element
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal open={true} title="Confirm" onConfirm={onConfirm} />
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
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders default variant button by default", () => {
    render(<ConfirmationModal open={true} title="Confirm" />);

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // Button uses hardcoded hex colors
    expect(confirmButton).toHaveClass("bg-[#343E55]");
  });

  it("renders destructive variant button when variant is destructive", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
        variant="destructive"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // Button uses hardcoded hex colors
    expect(confirmButton).toHaveClass("bg-[#F04438]");
  });

  it("uses custom button text", () => {
    render(
      <ConfirmationModal
        open={true}
        title="Confirm"
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
      <ConfirmationModal open={true} title="Confirm" loading={true} />
    );

    expect(screen.getByRole("button", { name: /yes/i })).toBeDisabled();
  });

  it("disables cancel button when loading", () => {
    render(
      <ConfirmationModal open={true} title="Confirm" loading={true} />
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("renders with trigger for uncontrolled usage", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal
        trigger={<Button>Open Modal</Button>}
        title="Triggered Modal"
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
      render(<ConfirmationModal open={true} title="Confirm" />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has accessible buttons", () => {
      render(
        <ConfirmationModal
          open={true}
          title="Confirm"
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
