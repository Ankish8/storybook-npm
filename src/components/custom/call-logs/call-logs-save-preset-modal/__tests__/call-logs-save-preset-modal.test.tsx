import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogsSavePresetModal } from "../call-logs-save-preset-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

function renderModal(overrides: Partial<ComponentProps<typeof CallLogsSavePresetModal>> = {}) {
  const onOpenChange = vi.fn();
  const onSave = vi.fn();
  const utils = render(
    <CallLogsSavePresetModal
      open={true}
      onOpenChange={onOpenChange}
      filterCount={4}
      onSave={onSave}
      {...overrides}
    />
  );
  return { ...utils, onOpenChange, onSave };
}

describe("CallLogsSavePresetModal", () => {
  it("renders the title and helper description", () => {
    renderModal();
    expect(screen.getByText("Save as New Preset")).toBeInTheDocument();
    expect(
      screen.getByText("You can find your saved view presets directly in the view tabs")
    ).toBeInTheDocument();
  });

  it("renders the filter count with correct pluralization", () => {
    const { rerender } = renderModal({ filterCount: 4 });
    expect(screen.getByText("Captures: 4 filters")).toBeInTheDocument();

    rerender(
      <CallLogsSavePresetModal
        open={true}
        onOpenChange={vi.fn()}
        filterCount={1}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByText("Captures: 1 filter")).toBeInTheDocument();
  });

  it("prefills the Name field with defaultName", () => {
    renderModal({ defaultName: "Incoming connected" });
    expect(screen.getByLabelText("Name")).toHaveValue("Incoming connected");
  });

  it("disables Save when the name is empty", () => {
    renderModal({ defaultName: "" });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSave with the trimmed name when Save is clicked", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultName: "  Incoming connected  " });

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith("Incoming connected");
  });

  it("updates the name as the user types and enables Save once non-empty", async () => {
    const user = userEvent.setup();
    const { onSave } = renderModal({ defaultName: "" });

    const input = screen.getByLabelText("Name");
    await user.type(input, "Missed calls");

    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith("Missed calls");
  });

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { onOpenChange } = renderModal({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets the name back to defaultName each time the modal reopens", () => {
    const { rerender } = renderModal({ open: false, defaultName: "Incoming connected" });

    rerender(
      <CallLogsSavePresetModal
        open={true}
        onOpenChange={vi.fn()}
        filterCount={4}
        defaultName="Incoming connected"
        onSave={vi.fn()}
      />
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Incoming connected");
  });

  it("disables Cancel and Save while loading", () => {
    renderModal({ loading: true, defaultName: "Incoming connected" });
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Save as New Preset")).not.toBeInTheDocument();
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    render(
      <CallLogsSavePresetModal
        open={true}
        onOpenChange={vi.fn()}
        filterCount={4}
        onSave={vi.fn()}
      />
    );
    assertNoBootstrapMarginBleed(screen.getByRole("dialog"));
  });

  it("triggers onOpenChange(false) when the dialog's close (X) button is clicked", () => {
    const { onOpenChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
