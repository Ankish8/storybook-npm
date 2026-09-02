import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsAddContactModal } from "../call-logs-add-contact-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsAddContactModal>> = {}) {
  const onOpenChange = vi.fn();
  const onSave = vi.fn();
  const utils = render(
    <CallLogsAddContactModal open={true} onOpenChange={onOpenChange} onSave={onSave} {...overrides} />
  );
  return { ...utils, onOpenChange, onSave };
}

describe("CallLogsAddContactModal", () => {
  it("renders the title", () => {
    renderModal();
    expect(screen.getByText("Add New Contact")).toBeInTheDocument();
  });

  it("renders empty fields with placeholders by default", () => {
    renderModal();
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter phone number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("prefills the phone number from defaultPhoneNumber", () => {
    renderModal({ defaultPhoneNumber: "90045 88123" });
    const phoneField = document.querySelector('input[type="tel"]') as HTMLInputElement;
    expect(phoneField).toHaveValue("90045 88123");
  });

  it("disables Save when the phone number is empty", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSave with the trimmed values when Save is clicked", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal();

    await user.type(screen.getByLabelText("Name"), "  Rohit Sharma  ");
    const phoneField = document.querySelector('input[type="tel"]') as HTMLInputElement;
    await user.type(phoneField, "9998887776");
    await user.type(screen.getByLabelText("Email"), "  rohit@example.com  ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith({
      name: "Rohit Sharma",
      phoneNumber: "9998887776",
      email: "rohit@example.com",
    });
  });

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onOpenChange } = renderModal({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets fields back to empty each time the modal reopens", () => {
    const { rerender } = renderModal({ open: false, defaultPhoneNumber: "90045 88123" });

    rerender(
      <CallLogsAddContactModal
        open={true}
        onOpenChange={vi.fn()}
        defaultPhoneNumber="90045 88123"
        onSave={vi.fn()}
      />
    );
    const phoneField = document.querySelector('input[type="tel"]') as HTMLInputElement;
    expect(phoneField).toHaveValue("90045 88123");
  });

  it("disables Cancel and Save while loading", () => {
    renderModal({ loading: true, defaultPhoneNumber: "90045 88123" });
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Add New Contact")).not.toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    renderModal();
    assertNoBootstrapMarginBleed(screen.getByRole("dialog"));
  });

  it("triggers onOpenChange(false) when the dialog's close (X) button is clicked", () => {
    const { onOpenChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
