import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "../textarea";

describe("Textarea", () => {
  // 1. Renders correctly (basic render)
  it("renders correctly", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  // 2. Renders with label
  it("renders with label", () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    const label = screen.getByText("Description");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", textarea.id);
  });

  // 3. Renders with required indicator
  it("renders with required indicator", () => {
    render(<Textarea label="Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-semantic-error-primary");
  });

  // 4. Shows error state with error message
  it("shows error state with error message", () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("border-semantic-error-primary");
  });

  it("shows error with leading icon when errorIcon is true", () => {
    render(
      <Textarea
        error="Invalid characters not allowed."
        errorIcon
        id="ta-err-icon"
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Invalid characters not allowed.")).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-describedby", "ta-err-icon-error");
  });

  // 5. Shows helper text
  it("shows helper text", () => {
    render(<Textarea helperText="Maximum 500 characters" />);
    expect(screen.getByText("Maximum 500 characters")).toBeInTheDocument();
    expect(screen.getByText("Maximum 500 characters")).toHaveClass(
      "text-semantic-text-muted"
    );
  });

  // 6. Shows character count with maxLength and showCount
  it("shows character count with maxLength and showCount", () => {
    render(<Textarea showCount maxLength={100} defaultValue="hello" />);
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  it("uses displayCharCount for the counter when provided", () => {
    render(
      <Textarea
        showCount
        maxLength={100}
        value={"   hi   "}
        onChange={() => {}}
        displayCharCount={2}
      />
    );
    expect(screen.getByText("2/100")).toBeInTheDocument();
  });

  it("uses normalized length for the counter when displayCharCount is omitted", () => {
    render(
      <Textarea
        showCount
        maxLength={100}
        value={"   hi   "}
        onChange={() => {}}
      />
    );
    // Collapses duplicate spaces; leading/trailing single spaces still count.
    expect(screen.getByText(/^4\/100$/)).toBeInTheDocument();
  });

  it("counts single spaces between letters toward the counter", () => {
    render(
      <Textarea
        showCount
        maxLength={100}
        value={"a   b   c"}
        onChange={() => {}}
      />
    );
    expect(screen.getByText(/^5\/100$/)).toBeInTheDocument();
  });

  // 7b. enforceMaxLength=false omits native maxLength but keeps counter
  it("enforceMaxLength false does not set native maxLength", () => {
    render(
      <Textarea
        showCount
        maxLength={100}
        enforceMaxLength={false}
        defaultValue="hi"
        data-testid="ta"
      />
    );
    const textarea = screen.getByTestId("ta");
    expect(textarea).not.toHaveAttribute("maxLength");
    expect(screen.getByText("2/100")).toBeInTheDocument();
  });

  // 7. Character count shows error color when over maxLength
  it("character count shows error color when over maxLength", () => {
    // We use controlled value to set a value longer than maxLength
    // Note: maxLength on textarea prevents typing beyond, but we can set value programmatically
    const longValue = "a".repeat(15);
    render(<Textarea showCount maxLength={10} value={longValue} onChange={() => {}} />);
    const countEl = screen.getByText("15/10");
    expect(countEl).toHaveClass("text-semantic-error-primary");
  });

  it("character count reflects normalized length when padding spaces collapse", () => {
    const tenLettersPlusSpaces = "a".repeat(10) + " ".repeat(50);
    render(
      <Textarea
        showCount
        maxLength={10}
        value={tenLettersPlusSpaces}
        onChange={() => {}}
      />
    );
    const countEl = screen.getByText(/^11\/10$/);
    expect(countEl).toHaveClass("text-semantic-error-primary");
  });

  // 8. All state variants render correct classes
  it.each([
    [
      "default",
      "border-semantic-border-input",
    ],
    [
      "error",
      "border-semantic-error-primary",
    ],
  ] as const)(
    "renders %s state variant with correct classes",
    (state, expectedClass) => {
      render(<Textarea state={state} data-testid="textarea" />);
      const textarea = screen.getByTestId("textarea");
      expect(textarea).toHaveClass(expectedClass);
    }
  );

  // 9. All size variants render correct classes
  it.each([
    ["default", "px-4", "py-2.5", "text-base"],
    ["sm", "px-3", "py-2", "text-sm"],
  ] as const)(
    "renders %s size variant with correct classes",
    (size, pxClass, pyClass, textClass) => {
      render(<Textarea size={size} data-testid="textarea" />);
      const textarea = screen.getByTestId("textarea");
      expect(textarea).toHaveClass(pxClass);
      expect(textarea).toHaveClass(pyClass);
      expect(textarea).toHaveClass(textClass);
    }
  );

  // 10. Custom className is applied
  it("applies custom className", () => {
    render(<Textarea className="my-custom-class" data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass("my-custom-class");
  });

  // 11. Ref forwarding works
  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
  });

  // 12. Additional props spread (data-testid)
  it("spreads additional props", () => {
    render(<Textarea data-testid="my-textarea" />);
    expect(screen.getByTestId("my-textarea")).toBeInTheDocument();
  });

  // 13. Disabled state
  it("renders disabled state", () => {
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
    expect(textarea).toHaveClass("disabled:opacity-50");
  });

  // 14. Controlled value
  it("supports controlled value", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <Textarea value="initial" onChange={handleChange} />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("initial");

    fireEvent.change(textarea, { target: { value: "updated" } });
    expect(handleChange).toHaveBeenCalled();

    rerender(<Textarea value="updated" onChange={handleChange} />);
    expect(textarea).toHaveValue("updated");
  });

  // 15. Uncontrolled defaultValue
  it("supports uncontrolled defaultValue", () => {
    render(<Textarea defaultValue="default text" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("default text");
  });

  // 16. Resize prop applies correct class
  it.each([
    ["none", "resize-none"],
    ["vertical", "resize-y"],
    ["horizontal", "resize-x"],
    ["both", "resize"],
  ] as const)(
    "resize=%s applies %s class",
    (resize, expectedClass) => {
      render(<Textarea resize={resize} data-testid="textarea" />);
      const textarea = screen.getByTestId("textarea");
      expect(textarea).toHaveClass(expectedClass);
    }
  );

  // Default resize is "none"
  it("defaults to resize-none", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass("resize-none");
  });

  // 17. aria-invalid is set when error is present
  it("sets aria-invalid when error is present", () => {
    render(<Textarea error="Some error" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "false");
  });

  // 18. aria-describedby points to error or helper text
  it("aria-describedby points to error message element", () => {
    render(<Textarea error="Error message" id="test-ta" />);
    const textarea = screen.getByRole("textbox");
    const describedBy = textarea.getAttribute("aria-describedby");
    expect(describedBy).toBe("test-ta-error");
    const errorEl = screen.getByText("Error message");
    expect(errorEl).toHaveAttribute("id", "test-ta-error");
  });

  it("aria-describedby points to helper text element", () => {
    render(<Textarea helperText="Helper info" id="test-ta" />);
    const textarea = screen.getByRole("textbox");
    const describedBy = textarea.getAttribute("aria-describedby");
    expect(describedBy).toBe("test-ta-helper");
    const helperEl = screen.getByText("Helper info");
    expect(helperEl).toHaveAttribute("id", "test-ta-helper");
  });

  it("aria-describedby is not set when no error or helper text", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).not.toHaveAttribute("aria-describedby");
  });

  // 19. Custom wrapperClassName is applied
  it("applies custom wrapperClassName", () => {
    const { container } = render(
      <Textarea wrapperClassName="my-wrapper" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("my-wrapper");
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("flex-col");
  });

  // 20. Custom labelClassName is applied
  it("applies custom labelClassName", () => {
    render(<Textarea label="My Label" labelClassName="my-label-class" />);
    const label = screen.getByText("My Label");
    expect(label).toHaveClass("my-label-class");
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
  });
});
