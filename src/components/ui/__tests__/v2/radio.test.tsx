import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "../../v2/radio";
describe("Radio", () => {
  it("connects the label and description to a native input", () => {
    render(<Radio label="Daily" description="Send every day" value="daily" />);
    const radio = screen.getByRole("radio", { name: "Daily" });
    expect(radio).toHaveAccessibleDescription("Send every day");
    expect(radio).toHaveAttribute("type", "radio");
  });
  it("changes a controlled selection only through the parent", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup value="a" onValueChange={onValueChange} aria-label="Cadence">
        <Radio value="a" label="Weekly" />
        <Radio value="b" label="Monthly" />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole("radio", { name: "Monthly" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked();
  });
  it("keeps an uncontrolled group mutually exclusive", async () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="Email" />
        <Radio value="b" label="Phone" />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole("radio", { name: "Phone" }));
    expect(screen.getByRole("radio", { name: "Phone" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Email" })).not.toBeChecked();
  });
  it("keeps separate groups independent", async () => {
    render(
      <>
        <RadioGroup>
          <Radio value="a" label="One" />
          <Radio value="b" label="Two" />
        </RadioGroup>
        <RadioGroup>
          <Radio value="a" label="Three" />
          <Radio value="b" label="Four" />
        </RadioGroup>
      </>
    );
    await userEvent.click(screen.getByRole("radio", { name: "One" }));
    await userEvent.click(screen.getByRole("radio", { name: "Three" }));
    expect(screen.getByRole("radio", { name: "One" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Three" })).toBeChecked();
  });
  it("does not change a disabled group", async () => {
    const change = vi.fn();
    render(
      <RadioGroup disabled onValueChange={change}>
        <Radio value="a" label="Unavailable" />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole("radio"));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("radio")).toBeDisabled();
  });
});

describe("Radio controls and selectable cards", () => {
  it("renders identical markup when variant is omitted or set to default", () => {
    const props = {
      label: "Daily",
      description: "Every day",
      value: "daily",
      id: "r1",
      name: "g",
    } as const;
    const first = render(<Radio {...props} />);
    const html = first.container.innerHTML;
    first.unmount();
    const second = render(<Radio {...props} variant="default" />);
    expect(second.container.innerHTML).toBe(html);
    expect(html).not.toContain("aria-labelledby");
  });

  it("adds an invisible 4px hit ring (16px -> 24px) and a 0.96 press scale", () => {
    render(<Radio value="a" aria-label="A" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass(
      "relative",
      "before:absolute",
      "before:-inset-[5px]"
    );
    expect(radio).toHaveClass(
      "enabled:active:scale-[0.96]",
      "motion-reduce:enabled:active:scale-100"
    );
  });

  it("sizes the dot with background-size: 0, 6px selected, 8px pressed", () => {
    render(<Radio value="a" aria-label="A" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass(
      "bg-[length:0px_0px]",
      "checked:bg-[length:6px_6px]",
      "checked:enabled:active:bg-[length:8px_8px]"
    );
    expect(radio.className).toContain(
      "enabled:active:[transition-duration:240ms,100ms,240ms,240ms,80ms]"
    );
  });

  it("gates hover styling to devices that can hover", () => {
    render(<Radio value="a" aria-label="A" />);
    const classes = screen.getByRole("radio").className.split(/\s+/);
    expect(
      classes.some((c) => c.includes("[@media(hover:hover)]:hover:"))
    ).toBe(true);
    expect(classes.some((c) => /(^|:)enabled:hover:/.test(c))).toBe(false);
  });

  it("makes the whole card the label and keeps the name free of the description", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" onValueChange={onValueChange}>
        <Radio
          variant="card"
          value="starter"
          label="Starter"
          description="Up to 3 agents"
        />
        <Radio
          variant="card"
          value="team"
          label="Team"
          description="Unlimited agents"
        />
      </RadioGroup>
    );
    const starter = screen.getByRole("radio", { name: "Starter" });
    expect(starter).toHaveAccessibleDescription("Up to 3 agents");
    const card = starter.closest("label")!;
    expect(card).toHaveClass(
      "p-4",
      "rounded-lg",
      "border",
      "border-semantic-border-layout"
    );
    await userEvent.click(screen.getByText("Unlimited agents"));
    expect(onValueChange).toHaveBeenCalledWith("team");
    expect(screen.getByRole("radio", { name: "Team" })).toBeChecked();
  });

  it("styles the selected, hover, focus and disabled card with explicit token classes", () => {
    render(
      <RadioGroup aria-label="Plan">
        <Radio variant="card" value="a" label="A" />
      </RadioGroup>
    );
    const card = screen.getByRole("radio").closest("label")!;
    expect(card).toHaveClass(
      "has-[:checked]:border-semantic-primary",
      "has-[:checked]:bg-semantic-primary-surface",
      "has-[:disabled]:bg-semantic-bg-ui",
      "[transition-duration:150ms]"
    );
    expect(card.className).toContain("[@media(hover:hover)]:hover:");
    expect(card.className).toContain("border-[var(--color-primary-100)]");
    expect(card.className).not.toMatch(/\/\d+/);
  });

  it("disables a card through its radio", () => {
    render(<Radio variant="card" value="a" label="A" disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
  });
});
