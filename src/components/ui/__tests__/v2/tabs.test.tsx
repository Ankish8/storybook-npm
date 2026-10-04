import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsCount,
} from "../../v2/tabs";

describe("Tabs", () => {
  const renderTabs = (props?: Record<string, unknown>) => {
    return render(
      <Tabs defaultValue="tab1" {...props}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
  };

  // Basic rendering
  it("renders all tab triggers", () => {
    renderTabs();
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("renders the active tab content", () => {
    renderTabs();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("does not render inactive tab content", () => {
    renderTabs();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  // Tab switching
  it("switches content when clicking a tab", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByText("Tab 2"));
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  // Controlled mode
  it("works in controlled mode", () => {
    const onValueChange = vi.fn();
    render(
      <Tabs value="tab2" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("calls onValueChange when tab is clicked in controlled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    await user.click(screen.getByText("Tab 2"));
    expect(onValueChange).toHaveBeenCalledWith("tab2");
  });

  // ARIA roles
  it("renders correct ARIA roles", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("sets aria-selected on active tab", () => {
    renderTabs();
    expect(screen.getByText("Tab 1").closest("[role='tab']")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Tab 2").closest("[role='tab']")).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  // TabsList styling
  it("renders TabsList with border styling", () => {
    renderTabs();
    const tabsList = screen.getByRole("tablist");
    expect(tabsList).toHaveClass("border-b");
    expect(tabsList).toHaveClass("border-semantic-border-layout");
  });

  it("applies fullWidth class to TabsList", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList fullWidth>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    const tabsList = screen.getByRole("tablist");
    expect(tabsList).toHaveClass("[&>*]:flex-1");
  });

  // TabsTrigger styling
  it("renders active trigger with correct data attribute", () => {
    renderTabs();
    const activeTab = screen.getByText("Tab 1").closest("[role='tab']");
    expect(activeTab).toHaveAttribute("data-state", "active");
  });

  it("renders inactive trigger with correct data attribute", () => {
    renderTabs();
    const inactiveTab = screen.getByText("Tab 2").closest("[role='tab']");
    expect(inactiveTab).toHaveAttribute("data-state", "inactive");
  });

  // Custom className
  it("applies custom className to TabsList", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tablist")).toHaveClass("custom-list");
  });

  it("applies custom className to TabsTrigger", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tab")).toHaveClass("custom-trigger");
  });

  it("applies custom className to TabsContent", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">
          Content
        </TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
  });

  // Disabled state
  it("prevents interaction on disabled triggers", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    await user.click(screen.getByText("Tab 2"));
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  // Keyboard navigation
  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByText("Tab 1"));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(
      screen.getByText("Tab 2").closest("[role='tab']")
    );
  });

  // Children content in triggers
  it("renders children inside triggers (e.g., badges)", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">
            Open <span data-testid="badge">10</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  // Ref forwarding
  it("forwards ref on TabsList", () => {
    const ref = { current: null };
    render(
      <Tabs defaultValue="tab1">
        <TabsList ref={ref}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref on TabsTrigger", () => {
    const ref = { current: null };
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" ref={ref}>
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards ref on TabsContent", () => {
    const ref = { current: null };
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" ref={ref}>
          Content
        </TabsContent>
      </Tabs>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("moves vertically and skips disabled tabs", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="first" orientation="vertical">
        <TabsList aria-label="Settings">
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second" disabled>
            Second
          </TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First panel</TabsContent>
        <TabsContent value="third">Third panel</TabsContent>
      </Tabs>
    );
    await user.click(screen.getByRole("tab", { name: "First" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Third" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Third panel");
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("waits for explicit activation in manual mode", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="first" activationMode="manual">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First panel</TabsContent>
        <TabsContent value="second">Second panel</TabsContent>
      </Tabs>
    );
    await user.click(screen.getByRole("tab", { name: "First" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });

  it("preserves native attributes on the optional count label", () => {
    render(
      <TabsCount
        aria-label="12 open conversations"
        title="Open count"
        className="custom-count"
      >
        12
      </TabsCount>
    );
    expect(screen.getByLabelText("12 open conversations")).toHaveTextContent(
      "12"
    );
    expect(screen.getByTitle("Open count")).toHaveClass("custom-count");
  });

  describe("variant", () => {
    // The default list class string as shipped before the pill variant existed. Pinned so the additive
    // variant can never alter what underline consumers (and v1 look-alike layouts) render.
    const UNDERLINE_LIST =
      "relative inline-flex items-center border-b border-solid border-semantic-border-layout w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0 after:pointer-events-none after:absolute after:left-0 after:bottom-[-1px] after:h-[2px] after:w-[var(--v2-tab-width,0px)] after:translate-x-[var(--v2-tab-x,0px)] after:bg-semantic-primary after:content-[''] after:opacity-0 data-[motion-indicator=true]:after:opacity-100 [&[data-motion-indicator=true]>[role=tab][data-state=active]]:border-transparent data-[orientation=vertical]:after:top-0 data-[orientation=vertical]:after:bottom-auto data-[orientation=vertical]:after:w-1 data-[orientation=vertical]:after:h-[var(--v2-tab-height,0px)] data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:translate-y-[var(--v2-tab-y,0px)] data-[orientation=vertical]:after:bg-semantic-border-accent";

    const renderList = (listProps?: React.ComponentProps<typeof TabsList>) =>
      render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="Status" {...listProps}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

    it("keeps the default markup identical when variant is omitted or underline", () => {
      // Radix numbers its ids per render; everything else must match byte for byte.
      const stable = (html: string) => html.replace(/radix-_r_\w+_/g, "radix");
      const omitted = stable(renderList().container.innerHTML);
      cleanup();
      const underline = stable(
        renderList({ variant: "underline" }).container.innerHTML
      );
      expect(underline).toBe(omitted);
      const list = screen.getByRole("tablist");
      expect(list.className).toBe(UNDERLINE_LIST);
      expect(list).not.toHaveAttribute("data-variant");
      const trigger = screen.getByRole("tab", { name: "Tab 1" });
      expect(trigger).toHaveClass(
        "py-4",
        "px-3",
        "border-b-2",
        "-mb-px",
        "data-[state=active]:border-semantic-primary"
      );
      expect(trigger).not.toHaveClass("h-8");
    });

    it("gates hover colour behind a hover-capable pointer so taps do not stick", () => {
      renderList();
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveClass(
        "[@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)]"
      );
      expect(screen.getByRole("tab", { name: "Tab 2" })).not.toHaveClass(
        "hover:text-[var(--v2-text-primary,#484848)]"
      );
    });

    it("renders the pill track, tabs and moving cursor", () => {
      renderList({ variant: "pill" });
      const list = screen.getByRole("tablist");
      expect(list).toHaveAttribute("data-variant", "pill");
      expect(list).toHaveClass(
        "p-1",
        "bg-semantic-bg-ui",
        "rounded-lg",
        "w-fit"
      );
      // No bottom rule: the pill track replaces the underline's divider.
      expect(list).not.toHaveClass("border-b");
      // The cursor is the list's ::after (no extra DOM): white, 1px layout border, faint shadow, behind the labels.
      expect(list).toHaveClass(
        "isolate",
        "after:bg-semantic-bg-primary",
        "after:border-semantic-border-layout",
        "after:shadow-xs",
        "after:rounded-md",
        "after:-z-10"
      );
      expect(list.children).toHaveLength(2);
      const trigger = screen.getByRole("tab", { name: "Tab 1" });
      expect(trigger).toHaveClass("h-8", "px-3", "rounded-md");
      expect(trigger).not.toHaveClass("py-4");
      expect(trigger).not.toHaveClass("border-b-2");
    });

    it("lets the pill list fill its container with fullWidth", () => {
      renderList({ variant: "pill", fullWidth: true });
      expect(screen.getByRole("tablist")).toHaveClass("w-full", "[&>*]:flex-1");
      expect(screen.getByRole("tablist")).not.toHaveClass("w-fit");
    });

    it("keeps selection, keyboard and disabled behaviour in the pill style", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="a">
          <TabsList variant="pill" aria-label="Pill">
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b" disabled>
              B
            </TabsTrigger>
            <TabsTrigger value="c">C</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="c">Panel C</TabsContent>
        </Tabs>
      );
      await user.click(screen.getByRole("tab", { name: "A" }));
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "C" })).toHaveFocus();
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel C");
      expect(screen.getByRole("tab", { name: "B" })).toBeDisabled();
    });

    it("scopes the variant to its own list when lists are nested", () => {
      render(
        <Tabs defaultValue="outer">
          <TabsList variant="pill" aria-label="Outer">
            <TabsTrigger value="outer">Outer</TabsTrigger>
          </TabsList>
          <TabsContent value="outer">
            <Tabs defaultValue="inner">
              <TabsList aria-label="Inner">
                <TabsTrigger value="inner">Inner</TabsTrigger>
              </TabsList>
            </Tabs>
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "Outer" })).toHaveClass("h-8");
      expect(screen.getByRole("tab", { name: "Inner" })).toHaveClass("py-4");
      expect(screen.getByRole("tab", { name: "Inner" })).not.toHaveClass("h-8");
    });
  });
});
