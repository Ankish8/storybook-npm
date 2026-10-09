import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../v2/checkbox";

describe("Checkbox v2", () => {
  it("renders correctly", () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
  });

  it('renders with role="checkbox"', () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders unchecked by default", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("renders checked state correctly", () => {
    render(<Checkbox checked data-testid="checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it("renders indeterminate state correctly", () => {
    render(<Checkbox checked="indeterminate" data-testid="checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "indeterminate");
  });

  it.each([
    ["default", "h-[18px]", "w-[18px]"],
    ["sm", "h-4", "w-4"],
    ["lg", "h-6", "w-6"],
  ] as const)("renders %s size", (size, heightClass, widthClass) => {
    render(<Checkbox size={size} data-testid="checkbox" />);
    const element = screen.getByTestId("checkbox");
    expect(element).toHaveClass(heightClass);
    expect(element).toHaveClass(widthClass);
  });

  it("applies custom className", () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("calls onCheckedChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles state in uncontrolled mode", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("data-state", "unchecked");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  it("respects defaultChecked prop", () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it("does not toggle when disabled", () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies disabled state", () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("renders with label on the right by default", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders with label on the left when specified", () => {
    render(<Checkbox label="Accept terms" labelPosition="left" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("clicking from indeterminate goes to checked", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked="indeterminate" onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("clicking from checked goes to unchecked", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("spreads additional props", () => {
    render(<Checkbox data-testid="checkbox" aria-label="test label" />);
    expect(screen.getByTestId("checkbox")).toHaveAttribute(
      "aria-label",
      "test label"
    );
  });

  it("renders check icon when checked", () => {
    const { container } = render(<Checkbox checked />);
    // Check icon should be present (lucide-react Check component renders an svg)
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders minus icon when indeterminate", () => {
    const { container } = render(<Checkbox checked="indeterminate" />);
    // Minus icon should be present
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders no visible icon when unchecked (the mark stays mounted, undrawn, so a change can reverse)", () => {
    const { container } = render(<Checkbox />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    for (const path of svg.querySelectorAll("path")) {
      expect(path).toHaveClass("opacity-[0]", "[stroke-dashoffset:1]");
    }
  });

  describe("id prop", () => {
    it("applies id prop to checkbox element", () => {
      render(<Checkbox id="my-checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "my-checkbox");
    });
  });

  describe("Custom className props", () => {
    it("applies checkboxClassName to checkbox element", () => {
      render(
        <Checkbox
          checkboxClassName="custom-checkbox-class"
          data-testid="checkbox"
        />
      );
      const checkbox = screen.getByTestId("checkbox");
      expect(checkbox).toHaveClass("custom-checkbox-class");
    });

    it("applies labelClassName to label text", () => {
      render(
        <Checkbox label="Test Label" labelClassName="custom-label-class" />
      );
      const labelText = screen.getByText("Test Label");
      expect(labelText).toHaveClass("custom-label-class");
    });

    it("applies both className and checkboxClassName", () => {
      render(
        <Checkbox
          className="class-a"
          checkboxClassName="class-b"
          data-testid="checkbox"
        />
      );
      const checkbox = screen.getByTestId("checkbox");
      expect(checkbox).toHaveClass("class-a");
      expect(checkbox).toHaveClass("class-b");
    });
  });

  describe("separateLabel prop", () => {
    it("renders with htmlFor/id association when separateLabel is true", () => {
      render(
        <Checkbox id="terms-checkbox" label="Accept terms" separateLabel />
      );
      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Accept terms");

      expect(checkbox).toHaveAttribute("id", "terms-checkbox");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", "terms-checkbox");
    });

    it("renders wrapping label when separateLabel is false", () => {
      render(<Checkbox label="Accept terms" />);
      const label = screen.getByText("Accept terms");

      // In default mode, label text is in a span, not a label with htmlFor
      expect(label.tagName).toBe("SPAN");
    });

    it("falls back to wrapping label when separateLabel is true but id is missing", () => {
      render(<Checkbox label="Accept terms" separateLabel />);
      const label = screen.getByText("Accept terms");

      // Without id, falls back to wrapping span
      expect(label.tagName).toBe("SPAN");
    });

    it("clicking separate label toggles checkbox", () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="clickable-label"
          label="Click me"
          separateLabel
          onCheckedChange={handleChange}
        />
      );

      const label = screen.getByText("Click me");
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("applies labelClassName in separateLabel mode", () => {
      render(
        <Checkbox
          id="styled-label"
          label="Styled Label"
          separateLabel
          labelClassName="my-label-style"
        />
      );
      const label = screen.getByText("Styled Label");
      expect(label).toHaveClass("my-label-style");
    });

    it("handles labelPosition in separateLabel mode", () => {
      const { container } = render(
        <Checkbox
          id="left-label"
          label="Left Label"
          labelPosition="left"
          separateLabel
        />
      );

      // Check that label comes before checkbox in the DOM
      const wrapper = container.firstChild;
      expect(wrapper?.firstChild?.textContent).toBe("Left Label");
    });
  });
});

describe("Checkbox v2 tactile feedback and description", () => {
  it("draws the check with a stroke-dashoffset transition on the snappy spring, in a force-mounted indicator", () => {
    render(<Checkbox checked aria-label="Select" />);
    const box = screen.getByRole("checkbox");
    const tick = box.querySelector("svg")!;
    expect(tick).toHaveAttribute("viewBox", "0 0 18 18");
    const check = tick.querySelector('path[d="M4.25 9.25 L7.25 12.25 L13.75 5.75"]')!;
    const checkClass = check.getAttribute("class")!;
    expect(checkClass).toContain("[stroke-dasharray:1]");
    expect(checkClass).toContain("[stroke-dashoffset:1]");
    expect(checkClass).toContain(
      "[transition:stroke-dashoffset_350ms_var(--arc-snappy),opacity_160ms_cubic-bezier(0.22,1,0.36,1)]"
    );
    expect(checkClass).toContain("[[data-state=checked]_&]:[stroke-dashoffset:0]");
    expect(checkClass).toContain("motion-reduce:[transition:opacity_120ms_ease-out]");
    expect(box).toHaveAttribute("data-state", "checked");
  });

  it("keeps the mark mounted when unchecked so a change can reverse", () => {
    render(<Checkbox aria-label="Select" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("data-state", "unchecked");
    expect(box.querySelectorAll("svg path")).toHaveLength(2);
  });

  it("draws the minus with the same normalized path length", () => {
    render(<Checkbox checked="indeterminate" aria-label="Select all" />);
    const dash = screen
      .getByRole("checkbox")
      .querySelector('path[d="M4.75 9 L9 9 L13.25 9"]')!;
    expect(dash).toHaveAttribute("pathLength", "1");
    const dashClass = dash.getAttribute("class")!;
    expect(dashClass).toContain("[stroke-dasharray:1]");
    expect(dashClass).toContain(
      "[[data-state=indeterminate]_&]:[stroke-dashoffset:0]"
    );
  });

  it("keeps the shell stationary on selection and supports an uncontrolled mixed mark", () => {
    render(<Checkbox defaultChecked="indeterminate" aria-label="Select" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("data-state", "indeterminate");
    expect(box).toHaveAttribute("aria-checked", "mixed");
    expect(box.className).not.toContain(
      "data-[state=checked]:motion-safe:zoom"
    );
  });

  it("fills on a layer that grows from 60% (snappy spring) instead of recolouring the shell", () => {
    render(<Checkbox aria-label="Select" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveClass(
      "after:absolute",
      "after:opacity-0",
      "after:scale-[0.6]",
      "data-[state=checked]:after:opacity-100",
      "data-[state=checked]:after:scale-100"
    );
    expect(box.className).toContain("[--arc-snappy:linear(");
    expect(box.className).toContain(
      "data-[state=checked]:after:[transition:opacity_120ms_"
    );
  });

  it("grows the hit ring to a 44px target on coarse pointers, per size", () => {
    const { rerender } = render(<Checkbox aria-label="Select" />);
    expect(screen.getByRole("checkbox")).toHaveClass(
      "[@media(pointer:coarse)]:before:-inset-[14px]"
    );
    rerender(<Checkbox aria-label="Select" size="sm" />);
    expect(screen.getByRole("checkbox")).toHaveClass(
      "[@media(pointer:coarse)]:before:-inset-[15px]"
    );
    rerender(<Checkbox aria-label="Select" size="lg" />);
    expect(screen.getByRole("checkbox")).toHaveClass(
      "[@media(pointer:coarse)]:before:-inset-[11px]"
    );
  });

  describe("accessible name fallback", () => {
    it("names an unlabelled checkbox 'Checkbox'", () => {
      render(<Checkbox />);
      expect(
        screen.getByRole("checkbox", { name: "Checkbox" })
      ).toBeInTheDocument();
    });

    it("leaves a checkbox named by its own label, aria-label or aria-labelledby alone", () => {
      const { rerender } = render(<Checkbox label="Accept terms" />);
      expect(screen.getByRole("checkbox")).toHaveAccessibleName("Accept terms");
      rerender(<Checkbox aria-label="Select row" />);
      expect(screen.getByRole("checkbox")).toHaveAccessibleName("Select row");
      rerender(
        <>
          <span id="n">Named elsewhere</span>
          <Checkbox aria-labelledby="n" />
        </>
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleName(
        "Named elsewhere"
      );
    });

    it("does not override an outside <label htmlFor> or a wrapping <label>", () => {
      const { rerender } = render(
        <>
          <label htmlFor="c1">Outside label</label>
          <Checkbox id="c1" />
        </>
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleName(
        "Outside label"
      );
      rerender(
        <label>
          Wrapping label
          <Checkbox />
        </label>
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleName(
        "Wrapping label"
      );
    });

    it("still forwards the ref", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Checkbox ref={ref} aria-label="x" />);
      expect(ref.current).toBe(screen.getByRole("checkbox"));
    });
  });

  it("adds an invisible 6px hit ring (box 18px -> 28px target) and a 0.95 press scale (120ms down, 580ms back)", () => {
    render(<Checkbox aria-label="Select" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveClass(
      "relative",
      "before:absolute",
      "before:-inset-[6px]"
    );
    expect(box).toHaveClass(
      "enabled:active:scale-[0.95]",
      "motion-reduce:enabled:active:scale-100"
    );
    expect(box.className).toContain("[transition-duration:160ms,160ms,580ms]");
    expect(box.className).toContain(
      "enabled:active:[transition-duration:160ms,160ms,120ms]"
    );
  });

  it("gates hover styling to devices that can hover", () => {
    render(<Checkbox aria-label="Select" />);
    const classes = screen.getByRole("checkbox").className.split(/\s+/);
    expect(
      classes.some((c) => c.includes("[@media(hover:hover)]:hover:"))
    ).toBe(true);
    expect(classes.some((c) => /(^|:)enabled:hover:/.test(c))).toBe(false);
  });

  it("links an optional description with aria-describedby and keeps the label as the name", () => {
    render(
      <Checkbox label="Marketing emails" description="Twice a month at most" />
    );
    const box = screen.getByRole("checkbox", { name: "Marketing emails" });
    expect(box).toHaveAccessibleDescription("Twice a month at most");
    const description = screen.getByText("Twice a month at most");
    expect(description.id).toBe(box.id + "-description");
    expect(description).toHaveClass("text-xs", "leading-[1.4]", "mt-0.5");
  });

  it("merges the description id into an existing aria-describedby", () => {
    render(
      <>
        <span id="extra">Extra</span>
        <Checkbox label="A" description="B" aria-describedby="extra" />
      </>
    );
    const box = screen.getByRole("checkbox");
    expect(box.getAttribute("aria-describedby")).toMatch(
      /^extra .+-description$/
    );
  });

  it("toggles from the label text of a described checkbox", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Updates"
        description="Weekly"
        onCheckedChange={onCheckedChange}
      />
    );
    await userEvent.click(screen.getByText("Updates"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("places a described label on the left when asked", () => {
    const { container } = render(
      <Checkbox label="L" description="D" labelPosition="left" />
    );
    const row = container.firstElementChild!;
    expect(row.firstElementChild).toContainElement(screen.getByText("L"));
  });

  it("renders no id or aria-describedby without a description (default markup unchanged)", () => {
    render(<Checkbox label="Plain" />);
    const box = screen.getByRole("checkbox");
    expect(box).not.toHaveAttribute("id");
    expect(box).not.toHaveAttribute("aria-describedby");
  });

  it("falls back to a generated id when an empty id is passed together with a description", () => {
    render(<Checkbox id="" label="A" description="B" />);
    const control = screen.getByRole("checkbox");
    expect(control.id).not.toBe("");
    expect(control).toHaveAccessibleDescription("B");
  });
});
