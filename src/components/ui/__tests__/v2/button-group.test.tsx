import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonGroup } from "../../v2/button-group";
const items = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];
describe("ButtonGroup", () => {
  it("keeps a single uncontrolled selection", async () => {
    render(<ButtonGroup items={items} defaultValue="a" />);
    await userEvent.click(screen.getByRole("button", { name: "Beta" }));
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
  it("requests controlled selection without replacing the parent's value", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ButtonGroup items={items} value="a" onValueChange={onValueChange} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    rerender(<ButtonGroup items={items} value="b" />);
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
  it("disables individual items and the whole group", async () => {
    const onValueChange = vi.fn();
    render(
      <ButtonGroup
        items={[items[0], { ...items[1], disabled: true }]}
        disabled
        onValueChange={onValueChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Alpha" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Beta" })).toBeDisabled();
  });
  it("keeps icon-only actions accessible", () => {
    render(<ButtonGroup items={items} iconOnly />);
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "title",
      "Alpha"
    );
  });
});
