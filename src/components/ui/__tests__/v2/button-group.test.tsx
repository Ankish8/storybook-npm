import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
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

describe("ButtonGroup actions", () => {
  const actions = [
    { id: "share", label: "Share" },
    { id: "copy", label: "Duplicate" },
    { id: "archive", label: "Archive" },
  ];
  const menu = {
    label: "More actions",
    items: [
      { id: "pin", label: "Pin" },
      { id: "delete", label: "Delete", disabled: true, destructive: true },
    ],
  };
  it("runs actions without creating a persistent selection or submitting the enclosing form", async () => {
    const select = vi.fn(),
      submit = vi.fn();
    render(
      <form onSubmit={submit}>
        <ButtonGroup
          label="Document actions"
          items={[{ ...actions[0], onSelect: select }]}
        />
      </form>
    );
    const share = screen.getByRole("button", { name: "Share" });
    await userEvent.click(share);
    expect(select).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
    expect(share).not.toHaveAttribute("aria-pressed");
    expect(
      screen.getByRole("group", { name: "Document actions" })
    ).toHaveAttribute("data-mode", "actions");
  });
  it("supports arrows, wrap, Home, End and native keyboard activation", async () => {
    const select = vi.fn();
    render(
      <ButtonGroup
        items={actions.map((item) => ({ ...item, onSelect: select }))}
      />
    );
    act(() => screen.getByRole("button", { name: "Share" }).focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{End}{ArrowRight}");
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Archive" })).toHaveFocus();
    await userEvent.keyboard("{Home}{Enter} ");
    expect(select).toHaveBeenCalledTimes(2);
  });
  it("moves through vertical groups with up/down and leaves horizontal arrows alone", async () => {
    render(<ButtonGroup items={actions} orientation="vertical" />);
    act(() => screen.getByRole("button", { name: "Share" }).focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(screen.getByRole("button", { name: "Archive" })).toHaveFocus();
  });
  it("mirrors horizontal arrows in RTL", async () => {
    render(<ButtonGroup items={actions} style={{ direction: "rtl" }} />);
    act(() => screen.getByRole("button", { name: "Share" }).focus());
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Duplicate" })).toHaveFocus();
  });
  it("keeps an unavailable action discoverable while blocking mouse and keyboard activation", async () => {
    const select = vi.fn();
    render(
      <ButtonGroup
        items={[
          actions[0],
          { ...actions[1], disabled: true, onSelect: select },
        ]}
      />
    );
    const off = screen.getByRole("button", { name: "Duplicate" });
    expect(off).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(off);
    await userEvent.keyboard("{Enter} ");
    expect(select).not.toHaveBeenCalled();
    act(() => screen.getByRole("button", { name: "Share" }).focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(off).toHaveFocus();
  });
  it("preserves native links and blocks disabled links", () => {
    const { rerender } = render(
      <ButtonGroup items={[{ ...actions[0], href: "#example" }]} />
    );
    expect(screen.getByRole("link", { name: "Share" })).toHaveAttribute(
      "href",
      "#example"
    );
    rerender(
      <ButtonGroup disabled items={[{ ...actions[0], href: "#example" }]} />
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
  });
  it("opens its non-modal menu and returns focus on Escape", async () => {
    render(<ButtonGroup items={actions} menu={menu} />);
    const trigger = screen.getByRole("button", { name: "More actions" });
    act(() => trigger.focus());
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(screen.getByRole("menuitem", { name: "Pin" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Pin" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("runs only the selected menu action", async () => {
    const select = vi.fn(),
      main = vi.fn();
    render(
      <ButtonGroup
        items={[{ ...actions[0], onSelect: main }]}
        menu={{ ...menu, items: [{ ...menu.items[0], onSelect: select }] }}
      />
    );
    act(() => screen.getByRole("button", { name: "More actions" }).focus());
    await userEvent.keyboard("{Enter}{Enter}");
    expect(select).toHaveBeenCalledOnce();
    expect(main).not.toHaveBeenCalled();
  });
  it("closes an open menu when disabled and does not reopen when enabled", async () => {
    const { rerender } = render(<ButtonGroup items={actions} menu={menu} />);
    act(() => screen.getByRole("button", { name: "More actions" }).focus());
    await userEvent.keyboard("{Enter}");
    rerender(<ButtonGroup items={actions} menu={menu} disabled />);
    expect(screen.queryByRole("menu")).toBeNull();
    rerender(<ButtonGroup items={actions} menu={menu} />);
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("handles empty items and an empty menu", () => {
    render(
      <ButtonGroup items={[]} menu={{ label: "More actions", items: [] }} />
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("announces action feedback once and keeps only the current label as the accessible name", async () => {
    const { rerender } = render(
      <ButtonGroup
        items={[{ id: "copy", label: "Share", reserve: ["Share", "Copied"] }]}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    rerender(
      <ButtonGroup
        items={[{ id: "copy", label: "Copied", reserve: ["Share", "Copied"] }]}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Share" })).toBeNull();
  });
  it("does not announce unrelated label changes", () => {
    const { rerender } = render(<ButtonGroup items={actions} />);
    rerender(<ButtonGroup items={[{ ...actions[0], label: "Shared" }]} />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
  it("lets callers prevent group keyboard navigation", async () => {
    render(
      <ButtonGroup
        items={actions}
        onKeyDown={(event) => event.preventDefault()}
      />
    );
    act(() => screen.getByRole("button", { name: "Share" }).focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
  });
  it.each(["outline", "solid", "default", "primary", "toggle"] as const)(
    "renders the %s variant with the shared radius",
    (variant) => {
      render(<ButtonGroup items={actions} variant={variant} />);
      expect(screen.getByRole("group")).toHaveClass("rounded-lg");
      if (variant === "solid" || variant === "primary")
        expect(screen.getByRole("group")).toHaveClass("bg-semantic-primary");
    }
  );
  it.each([
    ["sm", "h-[34px]"],
    ["default", "h-[42px]"],
    ["md", "h-[42px]"],
    ["lg", "h-12"],
  ] as const)("supports %s size", (size, height) => {
    render(<ButtonGroup items={actions} size={size} />);
    expect(screen.getByRole("button", { name: "Share" })).toHaveClass(height);
  });
});

it("forwards the group ref and native attributes while merging custom classes", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <ButtonGroup
      ref={ref}
      items={items}
      className="custom-group"
      data-testid="group"
      aria-label="Toolbar"
    />
  );
  expect(ref.current).toBe(screen.getByTestId("group"));
  expect(screen.getByRole("group", { name: "Toolbar" })).toHaveClass(
    "custom-group",
    "rounded-lg"
  );
});
