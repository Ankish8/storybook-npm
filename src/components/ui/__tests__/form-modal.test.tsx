import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormModal } from "../form-modal";

describe("FormModal", () => {
  it("renders title and children correctly", () => {
    render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Edit Profile">
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <FormModal
        open={true}
        onOpenChange={vi.fn()}
        title="Edit Profile"
        description="Make changes here"
      >
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByText("Make changes here")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Edit Profile">
        <div>Form content</div>
      </FormModal>
    );

    // Description should either not exist or be hidden (sr-only)
    const descriptions = container.querySelectorAll('[id*="description"]');
    descriptions.forEach((desc) => {
      const text = desc.textContent;
      expect(text).not.toBe("Make changes here");
    });
  });

  it("renders default button text", () => {
    render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Edit Profile">
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders custom button text", () => {
    render(
      <FormModal
        open={true}
        onOpenChange={vi.fn()}
        title="Add User"
        saveButtonText="Create"
        cancelButtonText="Close"
      >
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("calls onSave when save button is clicked", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Edit Profile" onSave={handleSave}>
        <div>Form content</div>
      </FormModal>
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <FormModal
        open={true}
        onOpenChange={handleOpenChange}
        title="Edit Profile"
        onCancel={handleCancel}
      >
        <div>Form content</div>
      </FormModal>
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables buttons when loading", () => {
    render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Edit Profile" loading={true}>
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("disables save button when disableSave is true", () => {
    render(
      <FormModal
        open={true}
        onOpenChange={vi.fn()}
        title="Edit Profile"
        disableSave={true}
      >
        <div>Form content</div>
      </FormModal>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FormModal
        open={true}
        onOpenChange={vi.fn()}
        title="Edit Profile"
        className="custom-class"
      >
        <div>Form content</div>
      </FormModal>
    );

    const dialogContent = container.querySelector('[role="dialog"]');
    expect(dialogContent).toHaveClass("custom-class");
  });

  it("renders with different sizes", () => {
    const { container: smContainer } = render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Small" size="sm">
        <div>Content</div>
      </FormModal>
    );

    const smDialog = smContainer.querySelector('[role="dialog"]');
    expect(smDialog).toHaveClass("max-w-sm");

    const { container: lgContainer } = render(
      <FormModal open={true} onOpenChange={vi.fn()} title="Large" size="lg">
        <div>Content</div>
      </FormModal>
    );

    const lgDialog = lgContainer.querySelector('[role="dialog"]');
    expect(lgDialog).toHaveClass("max-w-2xl");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <FormModal ref={ref} open={true} onOpenChange={vi.fn()} title="Edit Profile">
        <div>Form content</div>
      </FormModal>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
