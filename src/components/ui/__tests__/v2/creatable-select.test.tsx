import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatableSelect } from "../../v2/creatable-select";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("CreatableSelect", () => {
  it("names the closed trigger and the open draft from the host label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <p id="role-label">Primary role</p>
        <CreatableSelect
          options={OPTIONS}
          aria-labelledby="role-label"
          aria-describedby="role-hint"
        />
        <p id="role-hint">Choose or create</p>
      </>
    );
    const trigger = screen.getByRole("button", { name: "Primary role" });
    expect(trigger).toHaveAccessibleDescription("Choose or create");
    await user.click(trigger);
    expect(
      screen.getByRole("combobox", { name: "Primary role" })
    ).toHaveAccessibleDescription("Choose or create");
  });

  it("disables an already open draft and options when disabled changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <CreatableSelect options={OPTIONS} onValueChange={onValueChange} />
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "Custom");
    rerender(
      <CreatableSelect
        options={OPTIONS}
        onValueChange={onValueChange}
        disabled
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("option", { name: /Create/ })).toBeDisabled();
    await user.click(screen.getByRole("option", { name: /Create/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders with placeholder text in closed state", () => {
    render(<CreatableSelect options={OPTIONS} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("shows selected value label in closed state", () => {
    render(<CreatableSelect options={OPTIONS} value="a" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("opens dropdown on click and shows options", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} placeholder="Pick one" />);
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls onValueChange when an option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    await user.click(screen.getByText("Alpha"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders without options (empty list)", () => {
    render(<CreatableSelect placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CreatableSelect options={OPTIONS} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("is disabled when disabled prop is set", () => {
    render(
      <CreatableSelect options={OPTIONS} disabled placeholder="Pick one" />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<CreatableSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sanitizes combobox input and notifies invalid vs valid input", async () => {
    const user = userEvent.setup();
    const onInvalid = vi.fn();
    const onValid = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        sanitizeInput={sanitize}
        onInvalidCharacters={onInvalid}
        onValidInput={onValid}
        maxLength={20}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    const input = screen.getByRole("combobox");
    await user.type(input, "x@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "y");
    expect(onValid).toHaveBeenCalled();
  });

  it("applies normalizeComboboxInput after sanitize without affecting invalid detection", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const normalize = (s: string) => s.replace(/ +/g, " ").replace(/^\s+/, "");
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        sanitizeInput={sanitize}
        normalizeComboboxInput={normalize}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(input, "a  b");
    expect(input.value).toBe("a b");
  });

  it("keeps the cursor in place when normalizeComboboxInput rejects a second space", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const normalize = (s: string) => s.replace(/ +/g, " ").replace(/^\s+/, "");
    render(
      <CreatableSelect
        options={OPTIONS}
        placeholder="Pick one"
        sanitizeInput={sanitize}
        normalizeComboboxInput={normalize}
      />
    );
    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(input, "Rhea from XYZ");
    input.setSelectionRange(5, 5);
    await user.keyboard(" ");

    expect(input.value).toBe("Rhea from XYZ");
    await waitFor(() => {
      expect(input.selectionStart).toBe(5);
      expect(input.selectionEnd).toBe(5);
    });
  });
});

describe("CreatableSelect v2 refresh", () => {
  it("marks the open field so it keeps the focused look while the panel is open", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));

    const field = screen.getByRole("combobox").parentElement as HTMLElement;
    expect(field).toHaveAttribute("data-state", "open");
    expect(field.className).toContain(
      "data-[state=open]:border-[var(--color-secondary-600,#27ABB8)]"
    );
    expect(field.className).toContain(
      "data-[state=open]:shadow-[0_0_4px_0_rgba(39,171,184,0.4)]"
    );
    expect(field.className).toContain(
      "data-[state=open]:hover:border-[var(--color-secondary-600,#27ABB8)]"
    );
  });

  it("keeps the CSS-anchored panel growing from the top-left (it cannot flip)", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    const panel = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(panel).toHaveClass(
      "origin-top-left",
      "motion-safe:slide-in-from-top-1",
      "motion-safe:fade-in-0",
      "motion-safe:zoom-in-[0.98]"
    );
  });

  it("gives option rows a 4px radius and pops the selected check in", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} value="b" />);
    await user.click(screen.getByRole("button"));
    const alpha = screen.getByRole("option", { name: "Alpha" });
    const beta = screen.getByRole("option", { name: "Beta" });
    expect(alpha).toHaveClass("rounded-sm");
    expect(alpha).not.toHaveClass("rounded-md");
    expect(beta.querySelector("svg")).toHaveClass(
      "motion-safe:animate-in",
      "motion-safe:zoom-in-[0.85]",
      "motion-safe:[animation-duration:180ms]"
    );
  });

  it("rings a row only when the arrow keys moved the highlight, not the mouse", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    // The open field focuses its input in a rAF; focus it explicitly so keys land.
    await user.click(screen.getByRole("combobox"));
    const alpha = screen.getByRole("option", { name: "Alpha" });
    const beta = screen.getByRole("option", { name: "Beta" });

    // Mouse hover highlights with the fill only.
    await user.hover(alpha);
    expect(alpha).toHaveClass("bg-semantic-bg-ui");
    expect(alpha).not.toHaveClass("ring-1");

    // Arrow keys move the highlight and earn the ring.
    await user.keyboard("{ArrowDown}");
    expect(beta).toHaveClass("bg-semantic-bg-ui", "ring-1", "ring-inset");
    expect(beta).toHaveClass("ring-semantic-border-accent");

    // The mouse taking over removes it again (a stationary pointer fires no new enter).
    await user.unhover(alpha);
    await user.hover(alpha);
    expect(alpha).toHaveClass("bg-semantic-bg-ui");
    expect(alpha).not.toHaveClass("ring-1");
  });

  it("rings the Create row when it is highlighted by keyboard", async () => {
    const user = userEvent.setup();
    render(<CreatableSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "Gamma");
    await user.keyboard("{ArrowDown}");
    const create = screen.getByRole("option", { name: /Create/ });
    expect(create).toHaveClass("rounded-sm", "ring-1", "ring-inset");
  });
});
