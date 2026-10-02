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
