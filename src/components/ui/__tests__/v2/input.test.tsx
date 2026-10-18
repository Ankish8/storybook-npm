import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../v2/input";

describe("Input (v2)", () => {
  it("renders correctly", () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies default state classes", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-v2-semantic-border-input");
  });

  it.each([
    ["default", "border-v2-semantic-border-input"],
    ["error", "border-v2-semantic-error-primary"],
  ] as const)("renders %s state", (state, expectedClass) => {
    render(<Input state={state} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass(expectedClass);
  });

  it("keeps error border when className overrides default border colors", () => {
    render(
      <Input
        state="error"
        className="border-v2-semantic-border-layout focus:border-v2-semantic-border-layout focus:shadow-none"
        data-testid="input"
      />
    );
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-v2-semantic-error-primary");
    // Focus adds no border change or glow of its own
    expect(input.className).not.toContain(
      "focus:border-v2-semantic-error-primary"
    );
    expect(input.className).not.toContain("rgba(240,68,56");
  });

  it("applies base styling classes", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("h-11");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("rounded-lg");
    expect(input).toHaveClass("px-3");
    expect(input).toHaveClass("py-0");
    // Arc field: 14px / 1.4 with -0.01em tracking, 160ms standard-curve border transition, no ring
    expect(input).toHaveClass("leading-[1.4]", "tracking-[-0.01em]");
    expect(input).toHaveClass(
      "transition-[border-color,background-color]",
      "[transition-duration:160ms]",
      "disabled:opacity-50"
    );
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  it("has disabled styling classes", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("disabled:cursor-not-allowed");
    expect(input).toHaveClass("disabled:bg-v2-semantic-bg-ui");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("handles change events", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "test" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the cursor in place when a second consecutive space is rejected", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState("Rhea from XYZ");
      return (
        <Input
          data-testid="input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByTestId("input") as HTMLInputElement;

    await user.click(input);
    input.setSelectionRange(5, 5);
    await user.keyboard(" ");

    expect(input).toHaveValue("Rhea from XYZ");
    await waitFor(() => {
      expect(input.selectionStart).toBe(5);
      expect(input.selectionEnd).toBe(5);
    });
  });

  it("renders with defaultValue", () => {
    render(<Input defaultValue="initial value" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveValue("initial value");
  });

  it("renders with controlled value", () => {
    render(
      <Input value="controlled value" onChange={() => {}} data-testid="input" />
    );
    expect(screen.getByTestId("input")).toHaveValue("controlled value");
  });

  it("renders with type attribute", () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
  });

  it("renders password type", () => {
    render(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
  });

  it("renders file type", () => {
    render(<Input type="file" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "file");
  });

  it("spreads additional props", () => {
    render(
      <Input data-testid="input" aria-label="test input" autoComplete="email" />
    );
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-label", "test input");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("handles maxLength", () => {
    render(<Input maxLength={10} data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("maxlength", "10");
  });

  it("handles readOnly", () => {
    render(<Input readOnly defaultValue="read only" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("readonly");
  });

  it("handles required", () => {
    render(<Input required data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("required");
  });

  it("can be accessed by role", () => {
    render(<Input placeholder="Test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("hides native number spinners by default", () => {
    render(<Input type="number" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toMatch(/inner-spin-button/);
  });

  it("prevents exponent keys for number inputs by default", () => {
    const handleKeyDown = vi.fn();
    render(
      <Input type="number" onKeyDown={handleKeyDown} data-testid="input" />
    );

    expect(fireEvent.keyDown(screen.getByTestId("input"), { key: "e" })).toBe(
      false
    );
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("prevents pasted exponent notation for number inputs by default", () => {
    const handlePaste = vi.fn();
    render(<Input type="number" onPaste={handlePaste} data-testid="input" />);

    expect(
      fireEvent.paste(screen.getByTestId("input"), {
        clipboardData: { getData: () => "2e22" },
      })
    ).toBe(false);
    expect(handlePaste).toHaveBeenCalledTimes(1);
  });

  it("ignores change events containing exponent notation for number inputs", () => {
    const handleChange = vi.fn();
    render(<Input type="number" onChange={handleChange} data-testid="input" />);

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "2e22" },
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("allows exponent notation when preventNumberExponent is false", () => {
    const handleChange = vi.fn();
    render(
      <Input
        type="number"
        preventNumberExponent={false}
        onChange={handleChange}
        data-testid="input"
      />
    );

    expect(fireEvent.keyDown(screen.getByTestId("input"), { key: "e" })).toBe(
      true
    );
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "2e22" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows native number spinners when hideNumberSpinners is false", () => {
    render(
      <Input type="number" hideNumberSpinners={false} data-testid="input" />
    );
    const input = screen.getByTestId("input");
    expect(input.className).not.toMatch(/inner-spin-button/);
  });
  it("answers hover with the border only on fine, hover-capable pointers", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain(
      "[@media(hover:hover)_and_(pointer:fine)]:enabled:hover:border-[var(--v2-semantic-border-primary,var(--semantic-primary))]"
    );
    // The un-gated utility would leave the border dark after a tap on touch
    expect(input.className).not.toMatch(/(^|\s)enabled:hover:/);
  });

  it("shows the error border for aria-invalid without a state prop", () => {
    render(<Input aria-invalid="true" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass(
      "aria-[invalid=true]:border-v2-semantic-error-primary"
    );
    // Hovering an invalid field must not swap the red for the neutral hover colour
    expect(input.className).toContain(
      "[@media(hover:hover)_and_(pointer:fine)]:aria-[invalid=true]:enabled:hover:border-v2-semantic-error-primary"
    );
  });

  describe("check icon", () => {
    it("is not announced and does not take pointer events", () => {
      render(<Input showCheckIcon data-testid="input" />);
      const icon = document.querySelector("[data-check-icon]");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveClass("pointer-events-none");
    });

    it("stays hidden until the field is focused, then eases back out on blur", async () => {
      const user = userEvent.setup();
      render(<Input showCheckIcon data-testid="input" />);
      const icon = document.querySelector("[data-check-icon]") as Element;
      expect(icon).not.toHaveAttribute("data-visible");
      expect(icon).toHaveClass("opacity-0", "scale-[0.8]");

      await user.click(screen.getByTestId("input"));
      expect(icon).toHaveAttribute("data-visible");
      expect(icon).toHaveClass("opacity-100", "scale-100");

      await user.tab();
      expect(icon).not.toHaveAttribute("data-visible");
      expect(icon).toHaveClass("opacity-0");
    });

    it("keeps only the opacity change under reduced motion", () => {
      render(<Input showCheckIcon data-testid="input" />);
      const icon = document.querySelector("[data-check-icon]") as Element;
      expect(icon).toHaveClass(
        "motion-reduce:[transition-property:opacity]",
        "motion-reduce:scale-100",
        "motion-reduce:blur-0"
      );
    });

    it("adds no wrapper or icon without showCheckIcon", () => {
      render(<Input data-testid="input" />);
      expect(document.querySelector("[data-check-icon]")).toBeNull();
      expect(screen.getByTestId("input").parentElement).toBe(
        document.body.firstElementChild
      );
    });
  });
});
