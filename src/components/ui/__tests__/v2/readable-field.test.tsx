import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReadableField } from "../../v2/readable-field";

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

  it("renders disabled header action without calling onClick", () => {
    const onAction = vi.fn();
    render(
      <ReadableField
        {...defaultProps}
        headerAction={{
          label: "Regenerate",
          onClick: onAction,
          disabled: true,
        }}
      />
    );

    const actionButton = screen.getByText("Regenerate").closest("button")!;
    expect(actionButton).toBeDisabled();

    fireEvent.click(actionButton);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("renders disabledTooltip text when header action is disabled", () => {
    render(
      <ReadableField
        {...defaultProps}
        headerAction={{
          label: "Regenerate",
          onClick: vi.fn(),
          disabled: true,
          disabledTooltip: "You are not allowed to regenerate this token",
        }}
      />
    );

    expect(
      screen.getByText("You are not allowed to regenerate this token")
    ).toBeInTheDocument();
  });

  it("does not render tooltip when header action is not disabled", () => {
    render(
      <ReadableField
        {...defaultProps}
        headerAction={{
          label: "Regenerate",
          onClick: vi.fn(),
          disabledTooltip: "You are not allowed to regenerate this token",
        }}
      />
    );

    expect(
      screen.queryByText("You are not allowed to regenerate this token")
    ).not.toBeInTheDocument();
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
      expect(
        screen.getByRole("button", { name: /copied/i })
      ).toBeInTheDocument();
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
      expect(
        screen.getByRole("button", { name: /copied/i })
      ).toBeInTheDocument();

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
      render(
        <ReadableField {...defaultProps} secret onValueCopy={onValueCopy} />
      );

      const copyButton = screen.getByRole("button", { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          defaultProps.value
        );
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

    const inputContainer = screen.getByText(defaultProps.value).closest("div");
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

    const inputContainer = screen.getByText(defaultProps.value).closest("div");

    expect(inputContainer).toHaveClass("h-11");
    expect(inputContainer).toHaveClass("rounded-lg");
    expect(inputContainer).toHaveClass("border");
    expect(inputContainer).toHaveClass("border-semantic-border-layout");
    expect(inputContainer).toHaveClass("bg-semantic-bg-primary");
    expect(inputContainer?.className).not.toContain("hover:");
    expect(screen.getByText(defaultProps.value)).toHaveClass(
      "font-normal",
      "text-[var(--v2-text-muted,#707070)]"
    );
  });
});

describe("ReadableField copy feedback", () => {
  const props = { label: "Base URL", value: "https://api.example.com/v3" };

  it("stacks the Copy, Check and failure icons in one fixed 18px button and cross-fades them", () => {
    render(<ReadableField {...props} />);
    const button = screen.getByRole("button", { name: "Copy to clipboard" });
    expect(button).toHaveClass("relative", "size-[18px]");
    const icons = Array.from(button.querySelectorAll("svg"));
    expect(icons).toHaveLength(3);
    const [copy, check, fail] = icons;
    expect(copy).toHaveClass("opacity-100", "scale-100");
    expect(check).toHaveClass("opacity-0", "scale-[0.8]");
    expect(fail).toHaveClass("opacity-0", "scale-[0.8]");
    for (const icon of icons) {
      expect(icon).toHaveClass(
        "absolute",
        "inset-0",
        "size-[18px]",
        "[transition-duration:180ms]"
      );
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("always renders an empty polite status region and says Copied while copied", async () => {
    render(<ReadableField {...props} />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("sr-only");
    expect(status).toBeEmptyDOMElement();
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await waitFor(() => expect(status).toHaveTextContent("Copied"));
    const [copy, check] = Array.from(
      screen.getByRole("button", { name: "Copied" }).querySelectorAll("svg")
    );
    expect(copy).toHaveClass("opacity-0");
    expect(check).toHaveClass("opacity-100", "scale-100");
  });

  it("does not duplicate visible text: the value and label are still found once", async () => {
    render(<ReadableField {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Copied")
    );
    expect(screen.getAllByText(props.value)).toHaveLength(1);
    expect(screen.getAllByText("Base URL")).toHaveLength(1);
  });

  it("makes the value select-all with a single click", () => {
    render(<ReadableField {...props} />);
    expect(screen.getByText(props.value)).toHaveClass("select-all");
  });

  it("holds the copied state for 2000ms, then returns to Copy", async () => {
    vi.useFakeTimers();
    try {
      render(<ReadableField {...props} />);
      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "Copy to clipboard" })
        );
      });
      expect(
        screen.getByRole("button", { name: "Copied" })
      ).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1999);
      });
      expect(
        screen.getByRole("button", { name: "Copied" })
      ).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(
        screen.getByRole("button", { name: "Copy to clipboard" })
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows a brief failed state, selects the value for Cmd+C and does not report a copy", async () => {
    vi.useFakeTimers();
    try {
      mockClipboard.writeText.mockRejectedValueOnce(new Error("denied"));
      const onValueCopy = vi.fn();
      render(<ReadableField {...props} onValueCopy={onValueCopy} />);
      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "Copy to clipboard" })
        );
      });
      const button = screen.getByRole("button", { name: "Copy failed" });
      expect(button).toHaveClass("text-semantic-error-primary");
      expect(screen.getByRole("status")).toHaveTextContent("Copy failed");
      expect(window.getSelection()?.toString()).toBe(props.value);
      expect(onValueCopy).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(
        screen.getByRole("button", { name: "Copy to clipboard" })
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not select a masked secret when the copy fails", async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error("denied"));
    window.getSelection()?.removeAllRanges();
    render(<ReadableField {...props} secret />);
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Copy failed")
    );
    expect(window.getSelection()?.toString()).toBe("");
  });

  it("keeps onValueCopy and a throwing callback does not undo the copied state", async () => {
    const onValueCopy = vi.fn(() => {
      throw new Error("consumer bug");
    });
    render(<ReadableField {...props} onValueCopy={onValueCopy} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
    );
    expect(onValueCopy).toHaveBeenCalledWith(props.value);
  });
});

describe("ReadableField header row alignment", () => {
  const props = { label: "Integration key", value: "example_key_123" };

  it("centres the label and the action on one row, with the same line height", () => {
    render(
      <ReadableField
        {...props}
        headerAction={{ label: "Regenerate", onClick: () => {} }}
      />
    );
    const row = screen.getByText("Integration key").parentElement;
    expect(row).toHaveClass("items-center");
    expect(row).not.toHaveClass("items-start");
    expect(screen.getByRole("button", { name: "Regenerate" })).toHaveClass(
      "leading-[1.4]"
    );
  });

  it("does not let the disabled action's tooltip wrapper add a line box that pushes it down", () => {
    render(
      <ReadableField
        {...props}
        headerAction={{
          label: "Regenerate",
          disabled: true,
          disabledTooltip: "Not available on this plan",
        }}
      />
    );
    const action = screen.getByRole("button", { name: "Regenerate" });
    expect(action).toHaveClass("leading-[1.4]");
    expect(action.parentElement).toHaveClass("inline-flex");
  });
});
