import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import { Breadcrumbs } from "../../v2/breadcrumbs";
const items = ["Home", "Workspace", "Settings", "Integrations", "Webhook"].map(
  (label) => ({ label, href: "/" + label.toLowerCase() })
);
describe("Breadcrumbs", () => {
  it("marks only the final page as current", () => {
    render(<Breadcrumbs items={items.slice(0, 3)} />);
    expect(screen.getByLabelText("Breadcrumb")).toHaveRole("navigation");
    expect(screen.getByText("Settings")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/home"
    );
  });
  it("selects hidden pages and closes even when navigation is prevented", async () => {
    const navigate = vi.fn((item: unknown, index: number) => ({ item, index }));
    render(
      <Breadcrumbs
        items={items}
        maxItems={3}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Show hidden pages" })
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(navigate).toHaveBeenCalledWith(items[2], 2);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    // A mouse pick leaves focus off the trigger so no keyboard ring is drawn around it
    expect(
      screen.getByRole("button", { name: "Show hidden pages" })
    ).not.toHaveFocus();
  });
  it("forwards a navigation callback for visible links", async () => {
    const navigate = vi.fn();
    render(
      <Breadcrumbs
        items={items.slice(0, 2)}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    await userEvent.click(screen.getByRole("link"));
    expect(navigate).toHaveBeenCalledWith(items[0], 0);
  });
  it("renders an empty navigation without crashing", () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("preserves native link destinations and a noninteractive current page", () => {
    render(<Breadcrumbs items={items.slice(0, 3)} />);
    expect(screen.getByRole("link", { name: "Workspace" })).toHaveAttribute(
      "href",
      "/workspace"
    );
    expect(
      screen.queryByRole("link", { name: "Settings" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Settings")).not.toHaveAttribute("tabindex");
  });
  it("preserves the default four-part collapse and original hidden indices", async () => {
    const navigate = vi.fn();
    render(
      <Breadcrumbs
        items={items}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    expect(screen.getByText("Integrations")).toBeInTheDocument();
    expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Show hidden pages" })
    );
    const workspace = screen.getByRole("menuitem", { name: "Workspace" });
    expect(workspace.tagName).toBe("A");
    expect(workspace).toHaveAttribute("href", "/workspace");
    await userEvent.click(workspace);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(items[1], 1);
  });
  it("supports callback-only hidden pages without changing their indices", async () => {
    const callbackItems = items.map(({ label }) => ({ label }));
    const navigate = vi.fn();
    render(
      <Breadcrumbs items={callbackItems} maxItems={3} onNavigate={navigate} />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Show hidden pages" })
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(navigate).toHaveBeenCalledWith(
      callbackItems[2],
      2,
      expect.anything()
    );
  });
  it("restores keyboard focus to overflow after Escape", async () => {
    render(<Breadcrumbs items={items} maxItems={3} />);
    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Show hidden pages" });
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Workspace" })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("selects a hidden destination with the keyboard and its original index", async () => {
    const navigate = vi.fn();
    render(
      <Breadcrumbs
        items={items}
        maxItems={3}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Workspace" })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}{Enter}");
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(items[2], 2);
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    );
  });
  it("forwards the nav ref, classes and landmark attributes", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Breadcrumbs
        ref={ref}
        items={items.slice(0, 2)}
        className="custom"
        aria-label="Project location"
        data-testid="path"
      />
    );
    expect(ref.current).toBe(screen.getByTestId("path"));
    expect(ref.current).toHaveClass("custom");
    expect(screen.getByRole("navigation", { name: "Project location" })).toBe(
      ref.current
    );
  });
  it("retains full accessible names when labels are truncated", () => {
    const longItems = [
      { label: "Very long workspace name", href: "/workspace" },
      { label: "Current configuration and billing settings" },
    ];
    render(<Breadcrumbs items={longItems} maxItemWidth={96} />);
    const ancestor = screen.getByRole("link", { name: longItems[0].label });
    expect(ancestor).toHaveAttribute("title", longItems[0].label);
    expect(within(ancestor).getByText(longItems[0].label)).toHaveStyle({
      maxWidth: "96px",
    });
    const current = document.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent(longItems[1].label);
    expect(current).toHaveAttribute("title", longItems[1].label);
  });
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "ignores invalid optional label width %s",
    (width) => {
      render(<Breadcrumbs items={items.slice(0, 2)} maxItemWidth={width} />);
      expect(screen.getByText("Workspace")).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("link")).not.toHaveAttribute("title");
    }
  );
  it("hides custom separators from assistive technology", () => {
    render(
      <Breadcrumbs
        items={items.slice(0, 3)}
        separator={<span data-testid="separator">/</span>}
      />
    );
    expect(screen.getAllByTestId("separator")).toHaveLength(2);
    screen
      .getAllByTestId("separator")
      .forEach((separator) =>
        expect(separator.parentElement).toHaveAttribute("aria-hidden", "true")
      );
  });
  it("supports RTL and preserves the destination order", async () => {
    render(<Breadcrumbs items={items} maxItems={3} dir="rtl" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("dir", "rtl");
    nav
      .querySelectorAll('li[aria-hidden="true"] svg')
      .forEach((separator) =>
        expect(separator).toHaveClass("rtl:-scale-x-100")
      );
    await userEvent.click(
      screen.getByRole("button", { name: "Show hidden pages" })
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent)
    ).toEqual(["Workspace", "Settings", "Integrations"]);
  });
  it("uses the default limit for NaN and allows an unlimited path", () => {
    const { rerender } = render(
      <Breadcrumbs items={items} maxItems={Number.NaN} />
    );
    expect(
      screen.getByRole("button", { name: "Show hidden pages" })
    ).toBeInTheDocument();
    rerender(<Breadcrumbs items={items} maxItems={Number.POSITIVE_INFINITY} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });
});
