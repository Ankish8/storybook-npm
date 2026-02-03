import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CopyableField } from "../copyable-field";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(navigator, { clipboard: mockClipboard });
});

describe("CopyableField", () => {
  const defaultProps = {
    label: "Base URL",
    value: "https://api.myoperator.co/v3/voice/gateway",
  };

  it("renders correctly with required props", () => {
    render(<CopyableField {...defaultProps} />);

    expect(screen.getByText("Base URL")).toBeInTheDocument();
    expect(
      screen.getByText("https://api.myoperator.co/v3/voice/gateway")
    ).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(
      <CopyableField
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
      <CopyableField
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
    render(<CopyableField {...defaultProps} onValueCopy={onValueCopy} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.value);
      expect(onValueCopy).toHaveBeenCalledWith(defaultProps.value);
    });
  });

  it("shows check icon after copying", async () => {
    render(<CopyableField {...defaultProps} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    });
  });

  describe("secret mode", () => {
    it("masks value by default in secret mode", () => {
      render(<CopyableField {...defaultProps} secret />);

      expect(screen.getByText("••••••••••••••••••••")).toBeInTheDocument();
      expect(
        screen.queryByText("https://api.myoperator.co/v3/voice/gateway")
      ).not.toBeInTheDocument();
    });

    it("shows eye toggle button in secret mode", () => {
      render(<CopyableField {...defaultProps} secret />);

      expect(
        screen.getByRole("button", { name: /show value/i })
      ).toBeInTheDocument();
    });

    it("toggles visibility when eye button is clicked", () => {
      render(<CopyableField {...defaultProps} secret />);

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
      render(<CopyableField {...defaultProps} secret onValueCopy={onValueCopy} />);

      const copyButton = screen.getByRole("button", { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.value);
      });
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <CopyableField {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies custom inputClassName", () => {
    render(
      <CopyableField {...defaultProps} inputClassName="custom-input-class" />
    );

    const inputContainer = screen
      .getByText(defaultProps.value)
      .closest("div");
    expect(inputContainer).toHaveClass("custom-input-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<CopyableField {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props to root element", () => {
    render(<CopyableField {...defaultProps} data-testid="copyable-field" />);

    expect(screen.getByTestId("copyable-field")).toBeInTheDocument();
  });

  it("has correct base styles on input container", () => {
    render(<CopyableField {...defaultProps} />);

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
