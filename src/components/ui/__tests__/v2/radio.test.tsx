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
