import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

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
});
