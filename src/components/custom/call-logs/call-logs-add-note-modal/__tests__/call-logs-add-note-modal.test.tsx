import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsAddNoteModal } from "../call-logs-add-note-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsAddNoteModal>> = {}) {
  const onOpenChange = vi.fn();
  const onSave = vi.fn();
  const utils = render(
    <CallLogsAddNoteModal
      open={true}
      onOpenChange={onOpenChange}
      onSave={onSave}
      {...overrides}
    />
  );
  return { ...utils, onOpenChange, onSave };
}

describe("CallLogsAddNoteModal", () => {
  it("renders the title and placeholder", () => {
    renderModal();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Add notes with key info, summary about the call for future context..."
      )
    ).toBeInTheDocument();
  });

  it("renders the helper text and character counter", () => {
    renderModal();
    expect(screen.getByText('Press "Enter" to save.')).toBeInTheDocument();
    expect(screen.getByText("0/100")).toBeInTheDocument();
  });

  it("respects a custom maxLength in the counter", () => {
    renderModal({ maxLength: 500 });
    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("prefills the textarea with defaultValue", () => {
    renderModal({ defaultValue: "Customer called back" });
    expect(screen.getByRole("textbox")).toHaveValue("Customer called back");
  });

  it("disables Save Note when the note is empty", () => {
    renderModal({ defaultValue: "" });
    expect(screen.getByRole("button", { name: "Save Note" })).toBeDisabled();
  });

  it("calls onSave with the trimmed note when Save Note is clicked", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultValue: "  Customer called back  " });

    await user.click(screen.getByRole("button", { name: "Save Note" }));
    expect(onSave).toHaveBeenCalledWith("Customer called back");
  });

  it("updates the counter as the user types and enables Save Note once non-empty", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultValue: "" });

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Called back");

    expect(screen.getByText("11/100")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Note" })).not.toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Save Note" }));
    expect(onSave).toHaveBeenCalledWith("Called back");
  });

  it("saves when Enter is pressed in the textarea, without inserting a newline", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultValue: "" });

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Called back{Enter}");

    expect(onSave).toHaveBeenCalledWith("Called back");
  });

  it("does not save on Shift+Enter (allows multi-line notes)", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultValue: "" });

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line one{Shift>}{Enter}{/Shift}");

    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onOpenChange } = renderModal({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets the note back to defaultValue each time the modal reopens", () => {
    const { rerender } = renderModal({ open: false, defaultValue: "Customer called back" });

    rerender(
      <CallLogsAddNoteModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValue="Customer called back"
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole("textbox")).toHaveValue("Customer called back");
  });

  it("disables Cancel and Save Note while loading", () => {
    renderModal({ loading: true, defaultValue: "Customer called back" });
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /save note/i })).toBeDisabled();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByPlaceholderText(/Add notes with key info/)).not.toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    render(<CallLogsAddNoteModal open={true} onOpenChange={vi.fn()} onSave={vi.fn()} />);
    assertNoBootstrapMarginBleed(screen.getByRole("dialog"));
  });

  it("triggers onOpenChange(false) when the dialog's close (X) button is clicked", () => {
    const { onOpenChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
