import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../../v2/switch";

describe("Switch v2", () => {
  it("renders correctly", () => {
    render(<Switch data-testid="switch" />);
    expect(screen.getByTestId("switch")).toBeInTheDocument();
  });

  it('renders with role="switch"', () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders unchecked by default", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("renders checked state correctly", () => {
    render(<Switch checked />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it.each([
    ["default", "h-5", "w-9"],
    ["sm", "h-[18px]", "w-8"],
    ["lg", "h-6", "w-11"],
  ] as const)("renders %s size", (size, heightClass, widthClass) => {
    render(<Switch size={size} data-testid="switch" />);
    const element = screen.getByTestId("switch");
    expect(element).toHaveClass(heightClass);
    expect(element).toHaveClass(widthClass);
  });

  it("applies custom className", () => {
    render(<Switch className="custom-class" data-testid="switch" />);
    expect(screen.getByTestId("switch")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("calls onCheckedChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Switch onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles state in uncontrolled mode", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "checked");
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("respects defaultChecked prop", () => {
    render(<Switch defaultChecked />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it("does not toggle when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch disabled onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies disabled state", () => {
    render(<Switch disabled data-testid="switch" />);
    const switchEl = screen.getByTestId("switch");
    expect(switchEl).toBeDisabled();
  });

  it("renders with label on the right by default", () => {
    render(<Switch label="Enable feature" />);
    expect(screen.getByText("Enable feature")).toBeInTheDocument();
  });

  it("renders with label on the left when specified", () => {
    render(<Switch label="Enable feature" labelPosition="left" />);
    expect(screen.getByText("Enable feature")).toBeInTheDocument();
  });

  it("spreads additional props", () => {
    render(<Switch data-testid="switch" aria-label="test label" />);
    expect(screen.getByTestId("switch")).toHaveAttribute(
      "aria-label",
      "test label"
    );
  });
});

describe("Switch v2 hit area, press and description", () => {
  it("adds an invisible 4px hit ring (36 x 20 -> 44 x 28 target) and a 0.96 press scale on the track", () => {
    render(<Switch aria-label="Notifications" />);
    const track = screen.getByRole("switch");
    expect(track).toHaveClass(
      "relative",
      "before:absolute",
      "before:-inset-[6px]"
    );
    expect(track).toHaveClass(
      "enabled:active:scale-[0.96]",
      "motion-reduce:enabled:active:scale-100"
    );
    expect(track.className).toContain(
      "[transition-duration:240ms,240ms,240ms,200ms]"
    );
    expect(track.className).toContain(
      "enabled:active:[transition-duration:240ms,240ms,240ms,80ms]"
    );
  });

  it("does not stretch the thumb on press (rejected in V2-MOTION.md)", () => {
    render(<Switch aria-label="Notifications" />);
    const thumb = screen.getByRole("switch").firstElementChild!;
    expect(thumb.className).not.toMatch(/active:/);
    expect(thumb.className).not.toMatch(/(^|\s)(scale-x-|group-active)/);
  });

  it("gates hover colour changes to devices that can hover", () => {
    render(<Switch aria-label="Notifications" />);
    const classes = screen.getByRole("switch").className.split(/\s+/);
    expect(
      classes.some((c) => c.includes("[@media(hover:hover)]:hover:"))
    ).toBe(true);
    expect(classes.some((c) => /(^|:)enabled:hover:/.test(c))).toBe(false);
  });

  it("links an optional description with aria-describedby and keeps the label as the name", () => {
    render(
      <Switch label="Desktop alerts" description="Banner for new chats" />
    );
    const track = screen.getByRole("switch", { name: "Desktop alerts" });
    expect(track).toHaveAccessibleDescription("Banner for new chats");
    expect(screen.getByText("Banner for new chats").id).toBe(
      track.id + "-description"
    );
  });

  it("toggles from the label text of a described switch", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Alerts"
        description="On"
        onCheckedChange={onCheckedChange}
      />
    );
    await userEvent.click(screen.getByText("Alerts"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("keeps the described switch disabled state", () => {
    render(<Switch label="Alerts" description="On" disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("renders no id or aria-describedby without a description (default markup unchanged)", () => {
    render(<Switch label="Plain" />);
    const track = screen.getByRole("switch");
    expect(track).not.toHaveAttribute("id");
    expect(track).not.toHaveAttribute("aria-describedby");
  });

  it("falls back to a generated id when an empty id is passed together with a description", () => {
    render(<Switch id="" label="A" description="B" />);
    const control = screen.getByRole("switch");
    expect(control.id).not.toBe("");
    expect(control).toHaveAccessibleDescription("B");
  });
});
