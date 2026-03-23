import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariableSelector } from "../variable-selector";

const defaultSections = [
  {
    label: "Function variables",
    variables: [
      { id: "1", name: "Order_id" },
      { id: "2", name: "customer_name" },
      { id: "3", name: "product_id" },
    ],
  },
];

describe("VariableSelector", () => {
  it("renders nothing when open is false", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={false}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
      />
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders listbox with search and sections when open", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
      />
    );
    const listbox = screen.getByRole("listbox", { name: /select variable/i });
    expect(listbox).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Function variables")).toBeInTheDocument();
    expect(screen.getByText("Order_id")).toBeInTheDocument();
    expect(screen.getByText("customer_name")).toBeInTheDocument();
    expect(screen.getByText("product_id")).toBeInTheDocument();
  });

  it("renders + Add new variable when onAddNewVariable provided", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        onAddNewVariable={() => {}}
        addNewLabel="+ Add new variable"
      />
    );
    expect(screen.getByRole("button", { name: /add new variable/i })).toBeInTheDocument();
  });

  it("calls onSelectVariable when a variable option is clicked", () => {
    const onSelectVariable = vi.fn();
    const onOpenChange = vi.fn();
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        sections={defaultSections}
        onSelectVariable={onSelectVariable}
      />
    );
    fireEvent.click(screen.getByRole("option", { name: /Order_id/ }));
    expect(onSelectVariable).toHaveBeenCalledWith({ id: "1", name: "Order_id" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onEditVariable and closes when pencil is clicked", () => {
    const onEditVariable = vi.fn();
    const onOpenChange = vi.fn();
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        sections={defaultSections}
        onSelectVariable={vi.fn()}
        onEditVariable={onEditVariable}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /edit order_id/i }));
    expect(onEditVariable).toHaveBeenCalledWith({ id: "1", name: "Order_id" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies custom className to panel", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        className="custom-panel"
      />
    );
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("custom-panel");
  });

  it("has correct semantic token classes on panel", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
      />
    );
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("border-semantic-border-layout");
    expect(listbox).toHaveClass("bg-semantic-bg-primary");
    expect(listbox).toHaveClass("text-semantic-text-primary");
  });

  it("forwards ref to panel when open", () => {
    const anchorRef = { current: document.createElement("div") };
    const ref = vi.fn();
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        ref={ref}
      />
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("calls onAddNewVariable when Add new variable is clicked", () => {
    const onAddNewVariable = vi.fn();
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        onAddNewVariable={onAddNewVariable}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /add new variable/i }));
    expect(onAddNewVariable).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) before onAddNewVariable when Add new is clicked", () => {
    const order: string[] = [];
    const onOpenChange = vi.fn((open: boolean) => {
      if (open === false) order.push("close");
    });
    const onAddNewVariable = vi.fn(() => order.push("add"));
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        sections={defaultSections}
        onAddNewVariable={onAddNewVariable}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /add new variable/i }));
    expect(order).toEqual(["close", "add"]);
  });

  it("calls onSearchChange when search input changes", () => {
    const onSearchChange = vi.fn();
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        onSearchChange={onSearchChange}
      />
    );
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "order" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("order");
  });

  it("shows No variables found when search matches nothing", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
      />
    );
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "zzznomatch" },
    });
    expect(screen.getByText("No variables found")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const onOpenChange = vi.fn();
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        sections={defaultSections}
      />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("hides pencil when showEditIcon is false even if onEditVariable is set", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={defaultSections}
        onEditVariable={() => {}}
        showEditIcon={false}
      />
    );
    expect(
      screen.queryByRole("button", { name: /edit order_id/i })
    ).not.toBeInTheDocument();
  });

  it("shows No variables found when sections is empty", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <VariableSelector
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        sections={[]}
      />
    );
    expect(screen.getByText("No variables found")).toBeInTheDocument();
  });
});
