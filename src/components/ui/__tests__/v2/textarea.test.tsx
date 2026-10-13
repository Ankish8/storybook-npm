import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Textarea } from "../../v2/textarea";

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
    expect(
      screen.getByText("Invalid characters not allowed.")
    ).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-describedby", "ta-err-icon-error");
  });

  // 5. Shows helper text
  it("shows helper text", () => {
    render(<Textarea helperText="Maximum 500 characters" />);
    expect(screen.getByText("Maximum 500 characters")).toBeInTheDocument();
    expect(screen.getByText("Maximum 500 characters")).toHaveClass(
      "text-[var(--v2-text-muted,#707070)]"
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
    render(
      <Textarea
        showCount
        maxLength={10}
        value={longValue}
        onChange={() => {}}
      />
    );
    const countEl = screen.getByText("15/10");
    expect(countEl).toHaveClass("text-semantic-error-text");
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
    expect(countEl).toHaveClass("text-semantic-error-text");
  });

  // 8. All state variants render correct classes
  it.each([
    ["default", "border-semantic-border-input"],
    ["error", "border-semantic-error-primary"],
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
    ["default", "px-3", "py-3", "text-sm"],
    ["sm", "px-3", "py-2", "text-xs"],
    ["lg", "px-3", "py-3", "text-base"],
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
    expect(textarea).toHaveClass("disabled:bg-semantic-bg-ui");
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

  it("prevents consecutive spaces without moving the cursor to the end", async () => {
    const ControlledTextarea = () => {
      const [value, setValue] = React.useState("hello world again");

      return (
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
      );
    };

    render(<ControlledTextarea />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const setNativeValue = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    expect(setNativeValue).toBeDefined();

    setNativeValue?.call(textarea, "hello  world again");
    textarea.setSelectionRange(7, 7);
    fireEvent.change(textarea);

    expect(textarea).toHaveValue("hello world again");
    await waitFor(() => {
      expect(textarea.selectionStart).toBe(6);
      expect(textarea.selectionEnd).toBe(6);
    });
  });

  // 16. Resize prop applies correct class
  it.each([
    ["none", "resize-none"],
    ["vertical", "resize-y"],
    ["horizontal", "resize-x"],
    ["both", "resize"],
  ] as const)("resize=%s applies %s class", (resize, expectedClass) => {
    render(<Textarea resize={resize} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass(expectedClass);
  });

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
    const { container } = render(<Textarea wrapperClassName="my-wrapper" />);
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

describe("Textarea message reveal", () => {
  it("keeps the error id and describedby link and adds a polite live region", () => {
    render(<Textarea id="notes" error="Too short" />);
    const message = screen.getByText("Too short");
    expect(message).toHaveAttribute("id", "notes-error");
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "notes-error"
    );
  });

  it("keeps role=alert on the icon variant and does not add a second live region", () => {
    render(<Textarea id="notes" error="Invalid" errorIcon />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("id", "notes-error");
    expect(alert).not.toHaveAttribute("aria-live");
  });

  it("does not reveal helper text present on first render", () => {
    render(<Textarea helperText="Hint" />);
    expect(screen.getByText("Hint").parentElement!.className).not.toContain(
      "@starting-style"
    );
  });

  it("keeps a measured feedback frame across appearance, replacement and removal", () => {
    const { container, rerender } = render(<Textarea />);
    const frame = container.querySelector("[data-field-feedback]");
    rerender(<Textarea error="Required" />);
    expect(screen.getByText("Required").closest("[data-field-feedback]")).toBe(
      frame
    );
    rerender(<Textarea error="Please check this value" />);
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
    expect(
      screen
        .getByText("Please check this value")
        .closest("[data-field-feedback]")
    ).toBe(frame);
    rerender(<Textarea />);
    expect(container.querySelector("[data-field-feedback]")).toBe(frame);
    expect(
      screen.queryByText("Please check this value")
    ).not.toBeInTheDocument();
  });

  it("keeps the counter on the right of the message row", () => {
    render(<Textarea showCount maxLength={50} helperText="Hint" />);
    const row = screen.getByText("Hint").parentElement!;
    expect(row).toHaveClass("grid-cols-[minmax(0,1fr)_auto]");
    expect(screen.getByText("0/50")).toBeInTheDocument();
  });

  it("follows Arc: 110px minimum, 12px inset, 14px/1.4, border-only focus and a 8px label gap", () => {
    render(<Textarea label="Notes" data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass(
      "min-h-[110px]",
      "leading-[1.4]",
      "[transition-duration:160ms]",
      "disabled:opacity-60"
    );
    expect(textarea).toHaveClass(
      "[@media(hover:hover)_and_(pointer:fine)]:enabled:hover:border-semantic-primary"
    );
    expect(textarea.className).not.toContain("rgba(240,68,56");
    expect(screen.getByText("Notes")).toHaveClass("mb-2", "leading-[1.4]");
  });
});

describe("Textarea migration-safe enhancements", () => {
  it("preserves native defaults, caller styles, ref and form submission", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { container } = render(
      <form>
        <Textarea
          ref={ref}
          name="notes"
          defaultValue={"two  words\nnew\tline"}
          style={{ height: 140, overflowY: "scroll" }}
        />
      </form>
    );
    expect(ref.current).toHaveAttribute("rows", "4");
    expect(ref.current).toHaveClass("resize-none");
    expect(ref.current).toHaveStyle({ height: "140px", overflowY: "scroll" });
    expect(new FormData(container.querySelector("form")!).get("notes")).toBe(
      "two words\nnew\tline"
    );
  });

  it("keeps composition drafts intact and notifies the normalized commit once", async () => {
    const changes = vi.fn();
    const start = vi.fn();
    const end = vi.fn();
    render(
      <Textarea
        onChange={changes}
        onCompositionStart={start}
        onCompositionEnd={end}
      />
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.compositionStart(textarea);
    fireEvent.change(textarea, { target: { value: "日  本" } });
    expect(textarea).toHaveValue("日  本");
    expect(changes.mock.calls[0][0].target.value).toBe("日  本");
    fireEvent.compositionEnd(textarea);
    expect(textarea).toHaveValue("日 本");
    await waitFor(() => expect(changes).toHaveBeenCalledTimes(2));
    expect(changes.mock.calls[1][0].target.value).toBe("日 本");
    expect(start).toHaveBeenCalledTimes(1);
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("keeps controlled consumer state in sync with an IME commit without a following input event", async () => {
    const values: string[] = [];
    function Controlled() {
      const [value, setValue] = React.useState("");
      return (
        <>
          <Textarea
            value={value}
            onChange={(event) => {
              values.push(event.target.value);
              setValue(event.target.value);
            }}
          />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.compositionStart(textarea);
    fireEvent.change(textarea, { target: { value: "日  本" } });
    fireEvent.compositionEnd(textarea, { data: "日  本" });
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("日 本")
    );
    expect(values).toEqual(["日  本", "日 本"]);
    expect(textarea).toHaveValue("日 本");
    expect(textarea.selectionStart).toBe(3);
  });

  it("preserves a backward selection through space normalization", async () => {
    function Controlled() {
      const [value, setValue] = React.useState("hello world");
      return (
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
      );
    }
    render(<Controlled />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    )!.set!;
    setValue.call(textarea, "hello   world");
    textarea.setSelectionRange(5, 10, "backward");
    fireEvent.change(textarea);
    await waitFor(() => {
      expect(textarea.selectionStart).toBe(5);
      expect(textarea.selectionEnd).toBe(8);
      expect(textarea.selectionDirection).toBe("backward");
    });
  });

  it("bounds auto-resize, scrolls overflow and shrinks on controlled reset", () => {
    const scroll = vi
      .spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get")
      .mockReturnValue(300);
    const { rerender } = render(
      <Textarea
        autoResize
        minRows={2}
        maxRows={5}
        value="Long notes"
        onChange={() => {}}
        style={{
          lineHeight: "20px",
          padding: "10px",
          borderWidth: "1px",
          boxSizing: "border-box",
        }}
      />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      height: "122px",
      minHeight: "62px",
      maxHeight: "122px",
      overflowY: "auto",
    });
    scroll.mockReturnValue(20);
    rerender(
      <Textarea
        autoResize
        minRows={2}
        maxRows={5}
        value=""
        onChange={() => {}}
        style={{
          lineHeight: "20px",
          padding: "10px",
          borderWidth: "1px",
          boxSizing: "border-box",
        }}
      />
    );
    expect(textarea).toHaveStyle({ height: "62px", overflowY: "hidden" });
    scroll.mockRestore();
  });

  it("measures content-box rows and restores authored sizing when auto-resize is disabled", () => {
    const scroll = vi
      .spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get")
      .mockReturnValue(200);
    const style = {
      height: 140,
      lineHeight: "20px",
      padding: "10px",
      borderWidth: "1px",
      boxSizing: "content-box" as const,
      overflowY: "scroll" as const,
    };
    const { rerender } = render(
      <Textarea autoResize minRows={2} maxRows={4} style={style} />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      height: "80px",
      minHeight: "40px",
      maxHeight: "80px",
      overflowY: "auto",
    });
    rerender(<Textarea autoResize={false} resize="vertical" style={style} />);
    expect(textarea).toHaveStyle({ height: "140px", overflowY: "scroll" });
    expect(textarea).toHaveClass("resize-y");
    scroll.mockRestore();
  });
});
