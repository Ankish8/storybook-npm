import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitButton } from "../../v2/split-button";

const actions = [
  { id: "draft", label: "Save draft" },
  { id: "delete", label: "Delete draft", destructive: true },
];
describe("SplitButton", () => {
  it("runs the main action without opening the menu or submitting its form", async () => {
    const run = vi.fn();
    const submit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={submit}>
        <SplitButton label="Publish" onClick={run} actions={actions} />
      </form>
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(run).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("opens alternatives without running the main action, and a mouse pick leaves focus off the trigger", async () => {
    const run = vi.fn();
    const select = vi.fn();
    render(
      <SplitButton
        label="Publish"
        onClick={run}
        actions={[{ label: "Save draft", onSelect: select }]}
      />
    );
    const trigger = screen.getByRole("button", {
      name: "Publish more actions",
    });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitem", { name: "Save draft" }));
    expect(select).toHaveBeenCalledTimes(1);
    expect(run).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    // Returning focus after a click would draw the keyboard ring around the trigger
    expect(trigger).not.toHaveFocus();
  });
  it("draws no focus ring on the pair", () => {
    render(<SplitButton label="Publish" actions={[{ label: "Save draft" }]} />);
    const group = screen.getByRole("group", { name: "Publish" });
    expect(group.className).not.toContain("focus-visible");
  });
  it("returns focus to the trigger after a keyboard pick", async () => {
    const select = vi.fn();
    render(
      <SplitButton
        label="Publish"
        actions={[{ label: "Save draft", onSelect: select }]}
      />
    );
    const trigger = screen.getByRole("button", {
      name: "Publish more actions",
    });
    trigger.focus();
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
    expect(select).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it("supports keyboard opening, skipped disabled items, wraparound and Escape", async () => {
    render(
      <SplitButton
        label="Publish"
        actions={[
          { label: "First" },
          { label: "Unavailable", disabled: true },
          { label: "Last" },
        ]}
      />
    );
    const trigger = screen.getByRole("button", {
      name: "Publish more actions",
    });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Last" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it.each(["{Enter}", " "])("runs the main action via %s", async (key) => {
    const run = vi.fn();
    render(<SplitButton label="Run" onClick={run} actions={actions} />);
    screen.getByRole("button", { name: "Run" }).focus();
    await userEvent.keyboard(key);
    expect(run).toHaveBeenCalledTimes(1);
  });
  it.each([
    { disabled: true },
    { loading: true },
    { "aria-disabled": true as const },
  ])("blocks both halves with %j", async (state) => {
    const run = vi.fn();
    render(
      <SplitButton label="Run" onClick={run} actions={actions} {...state} />
    );
    const trigger = screen.getByRole("button", { name: "Run more actions" });
    expect(trigger).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Run" }));
    await userEvent.click(trigger);
    expect(run).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("keeps focus while loading, uses loadingText and renders the shared spinner", () => {
    const view = render(<SplitButton label="Publish" actions={actions} />);
    const main = screen.getByRole("button", { name: "Publish" });
    main.focus();
    view.rerender(
      <SplitButton
        label="Publish"
        actions={actions}
        loading
        loadingText="Publishing"
      />
    );
    expect(main).toHaveFocus();
    expect(main).not.toBeDisabled();
    expect(main).toHaveAttribute("aria-busy", "true");
    expect(main.querySelector("svg.animate-spin")).not.toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Publishing");
  });
  it("closes an uncontrolled menu when disabled and does not reopen it on re-enable", async () => {
    const view = render(<SplitButton label="Publish" actions={actions} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Publish more actions" })
    );
    expect(screen.getByRole("menu")).toBeVisible();
    view.rerender(<SplitButton label="Publish" actions={actions} disabled />);
    expect(screen.queryByRole("menu")).toBeNull();
    view.rerender(<SplitButton label="Publish" actions={actions} />);
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("supports controlled visibility and requests closure when it becomes busy", async () => {
    const change = vi.fn();
    const view = render(
      <SplitButton
        label="Publish"
        actions={actions}
        open={false}
        onOpenChange={change}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Publish more actions" })
    );
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).toBeNull();
    view.rerender(
      <SplitButton
        label="Publish"
        actions={actions}
        open
        onOpenChange={change}
      />
    );
    expect(screen.getByRole("menu")).toBeVisible();
    view.rerender(
      <SplitButton
        label="Publish"
        actions={actions}
        open
        loading
        onOpenChange={change}
      />
    );
    expect(screen.queryByRole("menu")).toBeNull();
    expect(change).toHaveBeenLastCalledWith(false);
  });
  it("marks destructive items and preserves preventDefault selection behavior", async () => {
    const select = vi.fn((e: Event) => e.preventDefault());
    render(
      <SplitButton
        label="Run"
        actions={[{ label: "Delete", destructive: true, onSelect: select }]}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Run more actions" })
    );
    const item = screen.getByRole("menuitem", { name: "Delete" });
    expect(item).toHaveAttribute("data-destructive");
    await userEvent.click(item);
    expect(select).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeVisible();
  });
  it("renders a regular button for no alternatives and removes the menu when actions are emptied", async () => {
    const view = render(<SplitButton label="Run" actions={[]} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button")).not.toHaveClass("rounded-e-none");
    view.rerender(<SplitButton label="Run" actions={actions} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Run more actions" })
    );
    view.rerender(<SplitButton label="Run" actions={[]} />);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
  it.each([
    ["sm", "h-9", "w-8"],
    ["default", "h-11", "w-[38px]"],
    ["lg", "h-[50px]", "w-[42px]"],
  ] as const)(
    "keeps %s heights and trigger width aligned inside one bordered pill",
    (size, height, width) => {
      render(<SplitButton label="Run" actions={actions} size={size} />);
      const [main, trigger] = screen.getAllByRole("button");
      // The pill owns the border and the 8px radius; segments sit inside it.
      expect(screen.getByRole("group")).toHaveClass(
        "rounded-lg",
        "border",
        "border-semantic-primary"
      );
      expect(main).toHaveClass(height, "rounded-e-none", "border-0");
      expect(trigger).toHaveClass(
        height,
        width,
        "rounded-s-none",
        "border-0",
        "active:scale-100"
      );
    }
  );
  it.each([
    ["default", "primary"],
    ["outline", "secondary"],
  ] as const)("aliases %s to %s", (alias, canonical) => {
    const view = render(
      <SplitButton label="Run" actions={actions} variant={alias} />
    );
    const classes = screen.getAllByRole("button").map((el) => el.className);
    view.rerender(
      <SplitButton label="Run" actions={actions} variant={canonical} />
    );
    expect(screen.getAllByRole("button").map((el) => el.className)).toEqual(
      classes
    );
  });
  it("forwards native attributes/ref and supports translated trigger names and live label updates", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const view = render(
      <SplitButton
        ref={ref}
        label="Publish"
        menuLabel="More options"
        actions={actions}
        name="action"
        value="publish"
        className="h-14"
        containerClassName="w-full"
      />
    );
    expect(ref.current).toHaveAttribute("name", "action");
    expect(ref.current).toHaveAttribute("value", "publish");
    expect(ref.current).toHaveClass("h-14");
    expect(screen.getByRole("group")).toHaveClass("w-full");
    expect(
      screen.getByRole("button", { name: "More options" })
    ).toBeInTheDocument();
    view.rerender(<SplitButton label="Published" actions={actions} />);
    expect(screen.getByRole("status")).toHaveTextContent("Published");
    expect(
      screen.getByRole("button", { name: "Published more actions" })
    ).toBeInTheDocument();
  });
});
