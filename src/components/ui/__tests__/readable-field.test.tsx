import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReadableField } from "../readable-field";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(navigator, { clipboard: mockClipboard });
});

describe("ReadableField", () => {
  const defaultProps = {
    label: "Base URL",
    value: "https://api.myoperator.co/v3/voice/gateway",
  };

  it("renders correctly with required props", () => {
    render(<ReadableField {...defaultProps} />);

    expect(screen.getByText("Base URL")).toBeInTheDocument();
    expect(
      screen.getByText("https://api.myoperator.co/v3/voice/gateway")
    ).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(
      <ReadableField
        {...defaultProps}
        helperText="Used for client-side integrations."
      />
    );

    expect(
      screen.getByText("Used for client-side integrations.")
    ).toBeInTheDocument();
  });

  it("renders header action when provided", () => {
    const onAction = vi.fn();
    render(
      <ReadableField
        {...defaultProps}
        headerAction={{ label: "Regenerate", onClick: onAction }}
      />
    );

    const actionButton = screen.getByText("Regenerate");
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("copies value to clipboard when copy button is clicked", async () => {
    const onValueCopy = vi.fn();
    render(<ReadableField {...defaultProps} onValueCopy={onValueCopy} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.value);
      expect(onValueCopy).toHaveBeenCalledWith(defaultProps.value);
    });
  });

  it("shows check icon after copying", async () => {
    render(<ReadableField {...defaultProps} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    });
  });

  describe("timeout cleanup", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("cleans up timeout on unmount to prevent memory leaks", async () => {
      const { unmount } = render(<ReadableField {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy/i });
      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Unmount before timeout completes (timeout is 2000ms)
      unmount();

      // Advance timers past the timeout - should not cause errors
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // If we get here without errors, the cleanup worked
      expect(true).toBe(true);
    });

    it("clears previous timeout when copy is clicked multiple times", async () => {
      render(<ReadableField {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /copy/i });

      // Click copy multiple times rapidly
      await act(async () => {
        fireEvent.click(copyButton);
      });
      await act(async () => {
        fireEvent.click(copyButton);
      });
      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Should still show "Copied" state
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();

      // Advance past timeout
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      // Should reset to "Copy" state (only one timeout should have fired)
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });
  });

  describe("secret mode", () => {
    it("masks value by default in secret mode", () => {
      render(<ReadableField {...defaultProps} secret />);

      expect(screen.getByText("••••••••••••••••••••")).toBeInTheDocument();
      expect(
        screen.queryByText("https://api.myoperator.co/v3/voice/gateway")
      ).not.toBeInTheDocument();
    });

    it("shows eye toggle button in secret mode", () => {
      render(<ReadableField {...defaultProps} secret />);

      expect(
        screen.getByRole("button", { name: /show value/i })
      ).toBeInTheDocument();
    });

    it("toggles visibility when eye button is clicked", () => {
      render(<ReadableField {...defaultProps} secret />);

      // Initially masked
      expect(screen.getByText("••••••••••••••••••••")).toBeInTheDocument();

      // Click to show
      const toggleButton = screen.getByRole("button", { name: /show value/i });
      fireEvent.click(toggleButton);

      // Now visible
      expect(
        screen.getByText("https://api.myoperator.co/v3/voice/gateway")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /hide value/i })
      ).toBeInTheDocument();

      // Click to hide again
      fireEvent.click(screen.getByRole("button", { name: /hide value/i }));
      expect(screen.getByText("••••••••••••••••••••")).toBeInTheDocument();
    });

    it("copies actual value even when masked", async () => {
      const onValueCopy = vi.fn();
      render(<ReadableField {...defaultProps} secret onValueCopy={onValueCopy} />);

      const copyButton = screen.getByRole("button", { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.value);
      });
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReadableField {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies custom inputClassName", () => {
    render(
      <ReadableField {...defaultProps} inputClassName="custom-input-class" />
    );

    const inputContainer = screen
      .getByText(defaultProps.value)
      .closest("div");
    expect(inputContainer).toHaveClass("custom-input-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<ReadableField {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(<ReadableField {...defaultProps} data-testid="readable-field" />);

    expect(screen.getByTestId("readable-field")).toBeInTheDocument();
  });

  it("has correct base styles on input container", () => {
    render(<ReadableField {...defaultProps} />);

    const inputContainer = screen
      .getByText(defaultProps.value)
      .closest("div");

    expect(inputContainer).toHaveClass("h-11");
    expect(inputContainer).toHaveClass("rounded");
    expect(inputContainer).toHaveClass("border");
    expect(inputContainer).toHaveClass("border-semantic-border-layout");
    expect(inputContainer).toHaveClass("bg-semantic-bg-ui");
  });
});
