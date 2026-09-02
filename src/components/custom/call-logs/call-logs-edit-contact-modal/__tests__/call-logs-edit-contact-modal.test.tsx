import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsEditContactModal } from "../call-logs-edit-contact-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsEditContactModal>> = {}) {
  const onOpenChange = vi.fn();
  const onSave = vi.fn();
  const utils = render(
    <CallLogsEditContactModal
      open={true}
      onOpenChange={onOpenChange}
      onSave={onSave}
      {...overrides}
    />
  );
  return { ...utils, onOpenChange, onSave };
}

describe("CallLogsEditContactModal", () => {
  it("renders the title", () => {
    renderModal();
    expect(screen.getByText("Edit Contact")).toBeInTheDocument();
  });

  it("prefills Name, Phone Number, and Email from default props", () => {
    renderModal({
      defaultName: "Khushboo Rawat",
      defaultPhoneNumber: "68484 44444",
      defaultEmail: "khushboo123@gmail.com",
    });
    expect(screen.getByLabelText("Name")).toHaveValue("Khushboo Rawat");
    expect(screen.getByDisplayValue("68484 44444")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("khushboo123@gmail.com");
  });

  it("shows the country code next to the phone field", () => {
    renderModal();
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("disables Save when the phone number is empty", () => {
    renderModal({ defaultPhoneNumber: "" });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSave with the trimmed values when Save is clicked", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({
      defaultName: "  Khushboo Rawat  ",
      defaultPhoneNumber: "  68484 44444  ",
      defaultEmail: "  khushboo123@gmail.com  ",
    });

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith({
      name: "Khushboo Rawat",
      phoneNumber: "68484 44444",
      email: "khushboo123@gmail.com",
    });
  });

  it("updates fields as the user types and enables Save once phone number is non-empty", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultPhoneNumber: "" });

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    const phoneField = document.querySelector('input[type="tel"]') as HTMLInputElement;
    await user.type(phoneField, "9998887776");

    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith({ name: "", phoneNumber: "9998887776", email: "" });
  });

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onOpenChange } = renderModal({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets fields back to defaults each time the modal reopens", () => {
    const { rerender } = renderModal({ open: false, defaultName: "Khushboo Rawat" });

    rerender(
      <CallLogsEditContactModal
        open={true}
        onOpenChange={vi.fn()}
        defaultName="Khushboo Rawat"
        onSave={vi.fn()}
      />
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Khushboo Rawat");
  });

  it("disables Cancel and Save while loading", () => {
    renderModal({ loading: true, defaultPhoneNumber: "68484 44444" });
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Edit Contact")).not.toBeInTheDocument();
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
