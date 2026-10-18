import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "../../v2/checkbox";
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

  it("adds an invisible 5px hit ring (17px -> 27px) and a 0.88 press scale (100ms down, 580ms back)", () => {
    render(<Radio value="a" aria-label="A" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass(
      "relative",
      "before:absolute",
      "before:-inset-[5px]"
    );
    expect(radio).toHaveClass(
      "enabled:active:scale-[0.88]",
      "motion-reduce:enabled:active:scale-100"
    );
    expect(radio.className).toContain(
      "[transition-duration:160ms,160ms,160ms,580ms]"
    );
    expect(radio.className).toContain(
      "enabled:active:[transition-duration:160ms,160ms,160ms,100ms]"
    );
  });

  it("fills the 17px mark and grows a 7px dot from 40% on the snappy spring, with a faint dot while pressed", () => {
    render(<Radio value="a" aria-label="A" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass(
      "size-[17px]",
      "after:size-[7px]",
      "after:scale-[0.4]",
      "after:opacity-0",
      "checked:bg-v2-semantic-primary",
      "checked:after:opacity-100",
      "checked:after:scale-100",
      "[&:not(:checked):enabled:active]:after:opacity-[0.22]"
    );
    expect(radio.className).toContain("[--arc-snappy:linear(");
    expect(radio.className).toContain(
      "checked:after:[transition:opacity_160ms_"
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
      "p-3",
      "items-center",
      "rounded-lg",
      "border",
      "border-v2-semantic-border-layout"
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
      "has-[:checked:enabled:not([aria-invalid=true])]:border-v2-semantic-primary",
      "bg-v2-semantic-bg-primary",
      "has-[:disabled]:bg-v2-semantic-bg-ui",
      "[transition-duration:160ms]"
    );
    expect(card.className).toContain("[@media(hover:hover)]:hover:");
    expect(card.className).toContain("bg-v2-semantic-bg-ui");
    expect(card.className).toContain("bg-v2-semantic-bg-subtle");
  });

  it("draws the selected card with one highlight layer owned by the group", () => {
    const { container } = render(
      <RadioGroup aria-label="Plan" defaultValue="a">
        <Radio variant="card" value="a" label="A" />
        <Radio variant="card" value="b" label="B" />
      </RadioGroup>
    );
    const group = screen.getByRole("radiogroup");
    const highlight = group.querySelector('span[aria-hidden="true"]')!;
    expect(highlight).toHaveClass("absolute", "border-v2-semantic-primary");
    expect(highlight).toHaveStyle({ opacity: "1" });
    // the selected card hands its selected style to the highlight
    const cardA = screen.getByRole("radio", { name: "A" }).closest("label")!;
    expect(cardA.className).not.toContain(
      "has-[:checked:enabled:not([aria-invalid=true])]:border-v2-semantic-primary"
    );
    expect(container.querySelectorAll("[data-radio-card]")).toHaveLength(2);
  });

  it("updates a selected card's error border without moving or remounting the highlight", () => {
    const view = (invalid: boolean) => (
      <RadioGroup defaultValue="a">
        <Radio variant="card" value="a" label="A" invalid={invalid} />
        <Radio variant="card" value="b" label="B" />
      </RadioGroup>
    );
    const { rerender } = render(view(false));
    const highlight = screen
      .getByRole("radiogroup")
      .querySelector('span[aria-hidden="true"]')!;
    expect(highlight).toHaveAttribute("data-invalid", "false");
    rerender(view(true));
    expect(
      screen.getByRole("radiogroup").querySelector('span[aria-hidden="true"]')
    ).toBe(highlight);
    expect(highlight).toHaveAttribute("data-invalid", "true");
    expect(highlight).toHaveClass(
      "data-[invalid=true]:border-v2-semantic-error-primary"
    );
    rerender(view(false));
    expect(highlight).toHaveAttribute("data-invalid", "false");
  });

  it("does not draw a highlight for plain circle radios", () => {
    render(
      <RadioGroup aria-label="Plan" defaultValue="a">
        <Radio value="a" label="A" />
      </RadioGroup>
    );
    const highlight = screen
      .getByRole("radiogroup")
      .querySelector('span[aria-hidden="true"]')!;
    expect(highlight).toHaveStyle({ opacity: "0" });
  });

  it("disables a card through its radio", () => {
    render(<Radio variant="card" value="a" label="A" disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
  });
});
