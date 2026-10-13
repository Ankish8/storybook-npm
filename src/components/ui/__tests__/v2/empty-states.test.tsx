import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyStates, type EmptyStatesValue } from "../../v2/empty-states";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

const preference = vi.hoisted(() => ({ reduce: false }));
const originalMatchMedia = window.matchMedia;
vi.spyOn(window, "matchMedia").mockImplementation((query) => {
  if (query !== "(prefers-reduced-motion: reduce)")
    return originalMatchMedia(query);
  return {
    get matches() {
      return preference.reduce;
    },
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => true,
  };
});

beforeEach(() => {
  preference.reduce = false;
});

describe("EmptyStates", () => {
  it("starts on No results with one accessible panel and shared artwork", () => {
    const { container } = render(<EmptyStates />);
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "No results" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByText("No results found")).toBeVisible();
    expect(
      container.querySelector('[data-slot="empty-state-illustration"]')
    ).toHaveAttribute("data-illustration", "no-results");
  });

  it("omits recovery buttons until the consumer wires a handler", () => {
    render(<EmptyStates />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it.each([
    ["no-results", "No results", "No results found", "Clear filters"],
    ["offline", "Offline", "You're offline", "Reconnect"],
    ["caught-up", "Caught up", "You're all caught up", "Refresh"],
    ["not-found", "Not found", "Page not found", "Go back"],
  ] as const)(
    "provides the %s view and its correctly wired recovery action",
    async (value, label, title, action) => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const { container } = render(
        <EmptyStates defaultValue={value} onAction={onAction} />
      );
      expect(screen.getByRole("tab", { name: label })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText(title)).toBeVisible();
      expect(
        container.querySelector('[data-slot="empty-state-illustration"]')
      ).toHaveAttribute("data-illustration", value);
      await user.click(screen.getByRole("button", { name: action }));
      expect(onAction).toHaveBeenCalledOnce();
      expect(onAction.mock.calls[0][0]).toBe(value);
      expect(onAction.mock.calls[0][1].type).toBe("click");
    }
  );

  it("changes an uncontrolled selection and reports the selected value once", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<EmptyStates onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Offline" }));
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Offline");
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("offline");
    await user.click(screen.getByRole("tab", { name: "Offline" }));
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it("keeps controlled selection until the consumer supplies the requested value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <EmptyStates value="no-results" onValueChange={onValueChange} />
    );
    await user.click(screen.getByRole("tab", { name: "Offline" }));
    expect(onValueChange).toHaveBeenCalledWith("offline");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("No results");
    rerender(<EmptyStates value="offline" onValueChange={onValueChange} />);
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Offline");
  });

  it("links the selected tab and panel with the existing Tabs IDs", async () => {
    const user = userEvent.setup();
    render(<EmptyStates />);
    for (const label of ["No results", "Offline", "Caught up", "Not found"]) {
      const tab = screen.getByRole("tab", { name: label });
      await user.click(tab);
      const panel = screen.getByRole("tabpanel");
      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }
  });

  it("uses Arrow keys, Home and End with automatic activation and retained tab focus", async () => {
    const user = userEvent.setup();
    render(<EmptyStates />);
    await user.click(screen.getByRole("tab", { name: "No results" }));
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Offline")
    );
    expect(screen.getByRole("tab", { name: "Offline" })).toHaveFocus();
    await user.keyboard("{End}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Not found")
    );
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("No results")
    );
    await user.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Not found")
    );
    await user.keyboard("{Home}");
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: "No results" })).toHaveFocus()
    );
  });

  it("inherits RTL arrow navigation", async () => {
    const user = userEvent.setup();
    render(<EmptyStates dir="rtl" />);
    await user.click(screen.getByRole("tab", { name: "No results" }));
    await user.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Offline")
    );
    expect(screen.getByRole("tab", { name: "Offline" })).toHaveFocus();
  });

  it("never performs a recovery just because a tab was selected", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<EmptyStates onAction={onAction} />);
    await user.click(screen.getByRole("tab", { name: "Offline" }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("forwards native attributes, custom classes, style, handlers and the root div ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <EmptyStates
        ref={ref}
        data-testid="block"
        aria-label="Workspace views"
        title="Empty workspace views"
        className="custom-block"
        style={{ maxWidth: "480px" }}
        onClick={onClick}
      />
    );
    const block = screen.getByTestId("block");
    expect(ref.current).toBe(block);
    expect(block.tagName).toBe("DIV");
    expect(block).toHaveAttribute("aria-label", "Workspace views");
    expect(block).toHaveAttribute("title", "Empty workspace views");
    expect(block).toHaveClass("custom-block");
    expect(block).toHaveStyle({ maxWidth: "480px" });
    fireEvent.click(block);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports callback refs and detaches them on unmount", () => {
    const ref = vi.fn();
    const { unmount } = render(<EmptyStates ref={ref} />);
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it("gives the rail a caller supplied accessible name", () => {
    render(<EmptyStates tabListLabel="Choose a support view" />);
    expect(
      screen.getByRole("tablist", { name: "Choose a support view" })
    ).toBeVisible();
  });

  it("uses the shared small and default illustration sizing", () => {
    const { container, rerender } = render(<EmptyStates size="sm" />);
    expect(
      container.querySelector('[data-slot="empty-state-illustration"]')
    ).toHaveClass("w-56");
    rerender(<EmptyStates size="default" />);
    expect(
      container.querySelector('[data-slot="empty-state-illustration"]')
    ).toHaveClass("w-72");
  });

  it("renders custom content slots and gives custom icons precedence over artwork", async () => {
    const { container } = render(
      <EmptyStates
        states={{
          "no-results": {
            title: <strong>Nothing in this queue</strong>,
            description: <em>Change your queue filter.</em>,
            icon: <span data-testid="custom-icon">Queue</span>,
          },
        }}
      />
    );
    expect(screen.getByText("Nothing in this queue").tagName).toBe("STRONG");
    expect(screen.getByText("Change your queue filter.").tagName).toBe("EM");
    await waitFor(() =>
      expect(screen.getByTestId("custom-icon")).toBeVisible()
    );
    expect(
      container.querySelector('[data-slot="empty-state-illustration"]')
    ).not.toBeInTheDocument();
  });

  it("allows explicit null slots to suppress description and the default action", () => {
    render(
      <EmptyStates
        onAction={vi.fn()}
        states={{ "no-results": { description: null, actions: null } }}
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("tabpanel").querySelectorAll("p")).toHaveLength(1);
  });

  it("runs a custom action instead of the preset handler", async () => {
    const user = userEvent.setup();
    const customAction = vi.fn();
    const onAction = vi.fn();
    render(
      <EmptyStates
        onAction={onAction}
        states={{
          "no-results": {
            actions: (
              <button type="button" onClick={customAction}>
                Search archive
              </button>
            ),
          },
        }}
      />
    );
    await user.click(screen.getByRole("button", { name: "Search archive" }));
    expect(customAction).toHaveBeenCalledOnce();
    expect(onAction).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Clear filters" })
    ).not.toBeInTheDocument();
  });

  it("passes the click event so consumers can prevent its default without a hidden mutation", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onAction = vi.fn(
      (_value, event: React.MouseEvent<HTMLButtonElement>) => {
        expect(event.currentTarget).toBe(
          screen.getByRole("button", { name: "Clear filters" })
        );
        event.preventDefault();
      }
    );
    render(
      <form onSubmit={onSubmit}>
        <EmptyStates onAction={onAction} />
      </form>
    );
    const action = screen.getByRole("button", { name: "Clear filters" });
    expect(action).toHaveAttribute("type", "button");
    await user.click(action);
    expect(onAction.mock.calls[0][1].defaultPrevented).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("No results");
    expect(action).toHaveFocus();
  });

  it("keeps the recovery button focused when the app updates copy", async () => {
    const user = userEvent.setup();
    function Example() {
      const [recovered, setRecovered] = React.useState(false);
      return (
        <EmptyStates
          onAction={() => setRecovered(true)}
          states={{
            "no-results": {
              title: recovered
                ? "Three contacts found"
                : "No matching contacts",
            },
          }}
        />
      );
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Three contacts found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toHaveFocus();
  });

  it("restores a hidden panel's focus to the new tab after controlled selection changes", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const { rerender } = render(
      <EmptyStates value="no-results" onAction={onAction} />
    );
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    rerender(<EmptyStates value="offline" onAction={onAction} />);
    expect(screen.getByRole("tab", { name: "Offline" })).toHaveFocus();
  });

  it("does not move focus from an external control on controlled selection changes", async () => {
    const user = userEvent.setup();
    function Example({ value }: { value: EmptyStatesValue }) {
      return (
        <>
          <button type="button">Other control</button>
          <EmptyStates value={value} onAction={vi.fn()} />
        </>
      );
    }
    const { rerender } = render(<Example value="no-results" />);
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.click(screen.getByRole("button", { name: "Other control" }));
    rerender(<Example value="offline" />);
    expect(screen.getByRole("button", { name: "Other control" })).toHaveFocus();
  });

  it("composes native focus and blur capture handlers", async () => {
    const user = userEvent.setup();
    const onFocusCapture = vi.fn();
    const onBlurCapture = vi.fn();
    render(
      <>
        <EmptyStates
          onFocusCapture={onFocusCapture}
          onBlurCapture={onBlurCapture}
        />
        <button type="button">Outside</button>
      </>
    );
    await user.click(screen.getByRole("tab", { name: "Offline" }));
    expect(onFocusCapture).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onBlurCapture).toHaveBeenCalled();
  });

  it("keeps panel IDs distinct across multiple blocks", () => {
    render(
      <>
        <EmptyStates aria-label="First" />
        <EmptyStates aria-label="Second" />
      </>
    );
    const panels = screen.getAllByRole("tabpanel");
    expect(panels[0].id).not.toBe(panels[1].id);
    panels.forEach((panel) => {
      const labelledBy = panel.getAttribute("aria-labelledby");
      expect(
        within(panel.parentElement!).getByRole("tab", { selected: true }).id
      ).toBe(labelledBy);
    });
  });

  it("keeps artwork decorative and renders it immediately for reduced motion", () => {
    preference.reduce = true;
    const { container } = render(<EmptyStates />);
    const illustration = container.querySelector(
      '[data-slot="empty-state-illustration"]'
    );
    expect(illustration).toHaveAttribute("aria-hidden", "true");
    expect(illustration).toHaveAttribute("focusable", "false");
    expect(illustration).not.toHaveStyle({ opacity: "0" });
    expect(illustration).not.toHaveStyle({ transform: "translateY(6px)" });
  });

  it("resets every paragraph margin for Bootstrap hosts", () => {
    const { container } = render(<EmptyStates />);
    assertNoBootstrapMarginBleed(container);
  });
});

it("preserves cleanup-returning callback refs", () => {
  const calls: string[] = [];
  const ref = (node: HTMLDivElement | null) => {
    calls.push(node ? "attach" : "null");
    if (node)
      return () => {
        calls.push("cleanup");
      };
  };
  const { unmount } = render(<EmptyStates ref={ref} />);
  unmount();
  expect(calls).toEqual(["attach", "cleanup"]);
});
