import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsBlockContactModal } from "../call-logs-block-contact-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsBlockContactModal>> = {}) {
  const onOpenChange = vi.fn();
  const onBlock = vi.fn();
  const utils = render(
    <CallLogsBlockContactModal
      open={true}
      onOpenChange={onOpenChange}
      phoneNumber="68484 44444"
      onBlock={onBlock}
      {...overrides}
    />
  );
  return { ...utils, onOpenChange, onBlock };
}

describe("CallLogsBlockContactModal", () => {
  it("renders the title", () => {
    renderModal();
    expect(screen.getByText("Block Contact")).toBeInTheDocument();
  });

  it("renders the number to block as read-only", () => {
    renderModal({ phoneNumber: "68484 44444" });
    const phoneField = document.querySelector('input[type="tel"]') as HTMLInputElement;
    expect(phoneField).toHaveValue("68484 44444");
    expect(phoneField).toBeDisabled();
  });

  it("prefills the optional Name field from defaultName", () => {
    renderModal({ defaultName: "Khushboo Rawat" });
    expect(screen.getByLabelText("Name (optional)")).toHaveValue("Khushboo Rawat");
  });

  it("renders the reason textarea with a 0/160 counter by default", () => {
    renderModal();
    expect(screen.getByPlaceholderText("Type reason here")).toBeInTheDocument();
    expect(screen.getByText("0/160")).toBeInTheDocument();
  });

  it("respects a custom reasonMaxLength", () => {
    renderModal({ reasonMaxLength: 500 });
    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("disables Block & Close when the reason is empty", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Block & Close" })).toBeDisabled();
  });

  it("calls onBlock with the trimmed name and reason when Block & Close is clicked", async () => {
    const user = userEvent.setup();
    const { onBlock } = renderModal({ defaultName: "  Khushboo Rawat  " });

    await user.type(screen.getByPlaceholderText("Type reason here"), "Repeated spam calls");
    await user.click(screen.getByRole("button", { name: "Block & Close" }));

    expect(onBlock).toHaveBeenCalledWith({ name: "Khushboo Rawat", reason: "Repeated spam calls" });
  });

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onOpenChange } = renderModal({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets the reason back to empty each time the modal reopens", async () => {
    const user = userEvent.setup();
    const { rerender } = renderModal({ open: true });

    await user.type(screen.getByPlaceholderText("Type reason here"), "Draft reason");
    rerender(
      <CallLogsBlockContactModal
        open={false}
        onOpenChange={vi.fn()}
        phoneNumber="68484 44444"
        onBlock={vi.fn()}
      />
    );
    rerender(
      <CallLogsBlockContactModal
        open={true}
        onOpenChange={vi.fn()}
        phoneNumber="68484 44444"
        onBlock={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("Type reason here")).toHaveValue("");
  });

  it("disables Cancel and Block & Close while loading", async () => {
    const user = userEvent.setup();
    const { rerender } = renderModal();
    await user.type(screen.getByPlaceholderText("Type reason here"), "Spam");
    rerender(
      <CallLogsBlockContactModal
        open={true}
        onOpenChange={vi.fn()}
        phoneNumber="68484 44444"
        onBlock={vi.fn()}
        loading
      />
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /block/i })).toBeDisabled();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Block Contact")).not.toBeInTheDocument();
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
