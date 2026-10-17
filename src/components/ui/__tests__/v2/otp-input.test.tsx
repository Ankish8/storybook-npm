import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput } from "../../v2/otp-input";
describe("OtpInput", () => {
  it("accepts digits and advances focus in a controlled parent", async () => {
    function Example() {
      const [value, setValue] = useState("");
      return <OtpInput value={value} onValueChange={setValue} />;
    }
    render(<Example />);
    await userEvent.type(screen.getByLabelText("Digit 1 of 4"), "12");
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveValue("1");
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveValue("2");
    expect(screen.getByLabelText("Digit 3 of 4")).toHaveFocus();
  });
  it("pastes a numeric code and fires completion", () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} name="code" />);
    fireEvent.paste(screen.getByLabelText("Digit 1 of 4"), {
      clipboardData: { getData: () => "a12-345" },
    });
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(screen.getByLabelText("Digit 4 of 4")).toHaveValue("4");
    expect(document.querySelector('input[name="code"]')).toHaveValue("1234");
  });
  it("deletes backwards and supports arrow navigation", async () => {
    render(<OtpInput defaultValue="123" />);
    const third = screen.getByLabelText("Digit 3 of 4");
    third.focus();
    await userEvent.keyboard("{Backspace}");
    expect(third).toHaveValue("");
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(screen.getByLabelText("Digit 4 of 4")).toHaveFocus();
  });
  it("honors controlled values and error feedback", () => {
    const { rerender } = render(
      <OtpInput value="12" error helperText="Expired" />
    );
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveAccessibleDescription(
      "Expired"
    );
    rerender(<OtpInput length={6} value="987654" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getByLabelText("Digit 6 of 6")).toHaveValue("4");
  });
  it("blocks disabled input", async () => {
    const onValueChange = vi.fn();
    render(<OtpInput disabled onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText("Digit 1 of 4"), "1");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen
        .getAllByRole("textbox")
        .every((input) => input.hasAttribute("disabled"))
    ).toBe(true);
  });
});

describe("OtpInput feedback", () => {
  it("marks each slot with data-filled", () => {
    render(<OtpInput defaultValue="12" />);
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveAttribute(
      "data-filled",
      "true"
    );
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveAttribute(
      "data-filled",
      "true"
    );
    expect(screen.getByLabelText("Digit 3 of 4")).toHaveAttribute(
      "data-filled",
      "false"
    );
  });

  it("flips data-filled as digits are typed and deleted", async () => {
    render(<OtpInput />);
    const first = screen.getByLabelText("Digit 1 of 4");
    await userEvent.type(first, "7");
    expect(first).toHaveAttribute("data-filled", "true");
    await userEvent.keyboard("{ArrowLeft}{Backspace}");
    expect(first).toHaveAttribute("data-filled", "false");
  });

  it("keeps glyph size stable while empty-slot colour transitions and the caret stays visible", () => {
    render(<OtpInput />);
    const slot = screen.getByLabelText("Digit 1 of 4");
    expect(slot).toHaveClass(
      "data-[filled=false]:text-transparent",
      "text-base",
      "caret-semantic-primary",
      "focus:border-semantic-primary"
    );
    expect(slot.className).toContain(
      "[transition-property:border-color,background-color,color]"
    );
    expect(slot.className).toContain("[transition-duration:160ms,160ms,180ms]");
  });

  it("keeps desktop cell sizes while making mobile gaps smaller", () => {
    render(<OtpInput />);
    const slot = screen.getByLabelText("Digit 1 of 4");
    expect(slot).toHaveClass(
      "h-[60px]",
      "w-[54px]",
      "box-border",
      "px-0",
      "min-w-0"
    );
    expect(slot.parentElement).toHaveClass("gap-2", "sm:gap-6");
  });

  it("shakes the slot row (300ms, motion-safe only) when error turns on after mount", () => {
    const { rerender } = render(<OtpInput value="12" />);
    const row = screen.getByLabelText("Digit 1 of 4").parentElement!;
    expect(row.className).not.toContain("v2-otp-shake");
    rerender(<OtpInput value="12" error />);
    expect(screen.getByLabelText("Digit 1 of 4").parentElement).toHaveClass(
      "motion-safe:animate-[v2-otp-shake_300ms_ease-in-out]"
    );
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveClass(
      "border-semantic-error-primary"
    );
  });

  it("does not shake an error that is already showing on first render, and stops when it clears", () => {
    const { rerender } = render(<OtpInput value="12" error />);
    expect(
      screen.getByLabelText("Digit 1 of 4").parentElement!.className
    ).not.toContain("v2-otp-shake");
    rerender(<OtpInput value="12" error={false} />);
    rerender(<OtpInput value="12" error />);
    expect(
      screen.getByLabelText("Digit 1 of 4").parentElement!.className
    ).toContain("v2-otp-shake");
    rerender(<OtpInput value="12" error={false} />);
    expect(
      screen.getByLabelText("Digit 1 of 4").parentElement!.className
    ).not.toContain("v2-otp-shake");
  });
});

it("preserves leading zeroes, paste, native name and selection navigation in six-digit cells", () => {
  const onComplete = vi.fn();
  const { container } = render(
    <OtpInput length={6} name="verification" onComplete={onComplete} />
  );
  const first = screen.getByLabelText("Digit 1 of 6");
  fireEvent.paste(first, { clipboardData: { getData: () => "012345" } });
  expect(onComplete).toHaveBeenCalledWith("012345");
  expect(first).toHaveValue("0");
  expect(container.querySelector('input[name="verification"]')).toHaveValue(
    "012345"
  );
  fireEvent.keyDown(screen.getByLabelText("Digit 6 of 6"), { key: "Home" });
  expect(first).toHaveFocus();
  expect((first as HTMLInputElement).selectionStart).toBe(0);
  expect((first as HTMLInputElement).selectionEnd).toBe(1);
  fireEvent.keyDown(first, { key: "Delete" });
  expect(container.querySelector('input[name="verification"]')).toHaveValue(
    "12345"
  );
});
