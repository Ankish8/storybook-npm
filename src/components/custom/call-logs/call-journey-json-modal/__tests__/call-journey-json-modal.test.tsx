import type { ComponentProps } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CallJourneyJsonModal } from "../call-journey-json-modal";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(navigator, { clipboard: mockClipboard });
});

const SAMPLE_JSON = JSON.stringify({ status: "success", code: 200 }, null, 2);

function renderModal(overrides: Partial<ComponentProps<typeof CallJourneyJsonModal>> = {}) {
  const onOpenChange = vi.fn();
  const utils = render(
    <CallJourneyJsonModal open={true} onOpenChange={onOpenChange} json={SAMPLE_JSON} {...overrides} />
  );
  return { ...utils, onOpenChange };
}

describe("CallJourneyJsonModal", () => {
  it("renders the default title and the JSON payload", () => {
    renderModal();
    expect(screen.getByText("JSON")).toBeInTheDocument();
    // getByText normalizes whitespace, which collapses multi-line JSON to one
    // line — compare the <pre>'s raw textContent instead to preserve formatting.
    // The dialog is portaled to document.body, not the render container.
    expect(document.querySelector("pre")?.textContent).toBe(SAMPLE_JSON);
  });

  it("renders a custom title when provided", () => {
    renderModal({ title: "Call Journey Log" });
    expect(screen.getByText("Call Journey Log")).toBeInTheDocument();
    expect(screen.queryByText("JSON")).not.toBeInTheDocument();
  });

  it("copies the JSON to clipboard and calls onCopy when the copy button is clicked", async () => {
    const onCopy = vi.fn();
    renderModal({ onCopy });

    fireEvent.click(screen.getByRole("button", { name: "Copy JSON" }));

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(SAMPLE_JSON);
      expect(onCopy).toHaveBeenCalledWith(SAMPLE_JSON);
    });
  });

  it("shows a 'Copied' state after copying, then reverts", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Copy JSON" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copy JSON" })).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it("does not throw when clipboard access is denied", async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error("denied"));
    renderModal();

    expect(() => fireEvent.click(screen.getByRole("button", { name: "Copy JSON" }))).not.toThrow();
    await waitFor(() => expect(mockClipboard.writeText).toHaveBeenCalled());
  });

  it("calls onOpenChange(false) when the close (X) button is clicked", () => {
    const { onOpenChange } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(document.querySelector("pre")).not.toBeInTheDocument();
  });

  it("applies custom className to the dialog content", () => {
    renderModal({ className: "custom-class" });
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("has no Bootstrap margin bleed on <p> elements", () => {
    renderModal();
    assertNoBootstrapMarginBleed(screen.getByRole("dialog"));
  });
});
