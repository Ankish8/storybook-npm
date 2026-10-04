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

  it("pops digits in: transparent 14.4px text when empty, colour and size transition over 180ms", () => {
    render(<OtpInput />);
    const slot = screen.getByLabelText("Digit 1 of 4");
    expect(slot).toHaveClass(
      "data-[filled=false]:text-transparent",
      "data-[filled=false]:text-[14.4px]",
      "motion-reduce:data-[filled=false]:text-base",
      "caret-[var(--v2-text-secondary,#5E5E5E)]"
    );
    expect(slot.className).toContain(
      "[transition-property:border-color,box-shadow,background-color,color,font-size]"
    );
    expect(slot.className).toContain(
      "[transition-duration:150ms,150ms,150ms,180ms,180ms]"
    );
  });

  it("keeps the Figma sizes and gap", () => {
    render(<OtpInput />);
    const slot = screen.getByLabelText("Digit 1 of 4");
    expect(slot).toHaveClass("h-[60px]", "w-[54px]");
    expect(slot.parentElement).toHaveClass("gap-6");
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
