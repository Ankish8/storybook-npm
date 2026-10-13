import type * as React from "react";
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
    ["default", "h-6", "w-[42px]"],
    ["sm", "h-5", "w-9"],
    ["lg", "h-7", "w-12"],
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
  it("adds an invisible 4px hit ring (42 x 24 -> 50 x 32 target) and does not scale the track on press", () => {
    render(<Switch aria-label="Notifications" />);
    const track = screen.getByRole("switch");
    expect(track).toHaveClass(
      "relative",
      "p-[3px]",
      "before:absolute",
      "before:-inset-1"
    );
    expect(track.className).not.toMatch(/active:scale/);
  });

  it("fades the fill layer in over 240ms instead of recolouring the track", () => {
    render(<Switch aria-label="Notifications" />);
    const track = screen.getByRole("switch");
    expect(track).toHaveClass(
      "after:opacity-0",
      "data-[state=checked]:after:opacity-100"
    );
    expect(track.className).toContain(
      "after:[transition:opacity_240ms_cubic-bezier(0.22,1,0.36,1)"
    );
  });

  it("glides the thumb on a spring and stretches it while the track is pressed (reduced motion skips the stretch)", () => {
    render(<Switch aria-label="Notifications" />);
    const thumb = screen.getByRole("switch").firstElementChild!;
    expect(thumb).toHaveClass(
      "h-[18px]",
      "w-[18px]",
      "data-[state=checked]:translate-x-[18px]"
    );
    expect(thumb.className).toContain(
      "[transition:transform_490ms_var(--arc-glide)"
    );
    expect(thumb.className).toContain(
      "motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:w-[23px]"
    );
    expect(thumb.className).toContain(
      "motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:translate-x-[13px]"
    );
    expect(thumb.className).toContain("motion-reduce:transition-none");
  });

  it("gates hover colour changes to devices that can hover", () => {
    render(<Switch aria-label="Notifications" />);
    const classes = screen.getByRole("switch").className.split(/\s+/);
    expect(
      classes.some((c) =>
        c.includes("[@media(hover:hover)_and_(pointer:fine)]:hover:")
      )
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

describe("Switch v2 keyboard, form and read-only compatibility", () => {
  it("toggles with Space and Enter and calls the callback once per activation", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Desktop alerts" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Desktop alerts" });
    await userEvent.tab();
    expect(control).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it("keeps controlled values owned by the caller", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Alerts"
      />
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    rerender(
      <Switch checked onCheckedChange={onCheckedChange} aria-label="Alerts" />
    );
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("lets a consumer prevent the default toggle", async () => {
    const onCheckedChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) =>
      event.preventDefault()
    );
    render(
      <Switch
        label="Alerts"
        onClick={onClick}
        onCheckedChange={onCheckedChange}
      />
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("keeps read-only focus and consumer handlers without changing state by label, Space or Enter", async () => {
    const onCheckedChange = vi.fn();
    const onClick = vi.fn();
    render(
      <Switch
        label="Managed alerts"
        defaultChecked
        readOnly
        onClick={onClick}
        onCheckedChange={onCheckedChange}
      />
    );
    const control = screen.getByRole("switch", { name: "Managed alerts" });
    expect(control).not.toBeDisabled();
    expect(control).toHaveAttribute("aria-readonly", "true");
    await userEvent.tab();
    expect(control).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{Enter}");
    await userEvent.click(screen.getByText("Managed alerts"));
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("submits checked default/value fields and read-only values, omitting off and disabled switches", async () => {
    const { container } = render(
      <form>
        <Switch name="desktop" value="enabled" defaultChecked label="Desktop" />
        <Switch name="sound" defaultChecked label="Sound" />
        <Switch name="off" label="Off" />
        <Switch name="disabled" defaultChecked disabled label="Disabled" />
        <Switch
          name="managed"
          value="locked"
          defaultChecked
          readOnly
          label="Managed"
        />
      </form>
    );
    const form = container.querySelector("form")!;
    expect([...new FormData(form).entries()]).toEqual([
      ["desktop", "enabled"],
      ["sound", "on"],
      ["managed", "locked"],
    ]);
    await userEvent.click(screen.getByRole("switch", { name: "Sound" }));
    expect(new FormData(form).has("sound")).toBe(false);
    await userEvent.click(screen.getByRole("switch", { name: "Off" }));
    expect(new FormData(form).get("off")).toBe("on");
  });

  it("preserves invalid values, explicit names and existing description references", () => {
    render(
      <>
        <p id="outside">External help</p>
        <Switch
          label="Alerts"
          description="Internal help"
          aria-label="Custom name"
          aria-describedby="outside"
          aria-invalid="grammar"
        />
      </>
    );
    const control = screen.getByRole("switch", { name: "Custom name" });
    expect(control).toHaveAttribute("aria-invalid", "grammar");
    expect(control).toHaveAccessibleDescription("External help Internal help");
  });

  it("renders a numeric description without losing its association", () => {
    render(<Switch label="Count" description={0} />);
    expect(screen.getByRole("switch")).toHaveAccessibleDescription("0");
  });
});
