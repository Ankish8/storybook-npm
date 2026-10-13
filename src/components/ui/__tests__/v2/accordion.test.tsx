import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../v2/accordion";

const TestAccordion = ({
  type = "multiple" as const,
  defaultValue = [] as string[],
  value,
  onValueChange,
  variant = "default" as const,
}: {
  type?: "single" | "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  variant?: "default" | "bordered";
}) => (
  <Accordion
    type={type}
    defaultValue={defaultValue}
    value={value}
    onValueChange={onValueChange}
    variant={variant}
  >
    <AccordionItem value="item-1">
      <AccordionTrigger>Trigger 1</AccordionTrigger>
      <AccordionContent>Content 1</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Trigger 2</AccordionTrigger>
      <AccordionContent>Content 2</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Trigger 3</AccordionTrigger>
      <AccordionContent>Content 3</AccordionContent>
    </AccordionItem>
  </Accordion>
);

describe("Accordion", () => {
  it("renders correctly", () => {
    render(<TestAccordion />);
    expect(screen.getByText("Trigger 1")).toBeInTheDocument();
    expect(screen.getByText("Trigger 2")).toBeInTheDocument();
    expect(screen.getByText("Trigger 3")).toBeInTheDocument();
  });

  it('renders with role="button" for triggers', () => {
    render(<TestAccordion />);
    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(3);
  });

  it("all items are closed by default", () => {
    render(<TestAccordion />);
    const triggers = screen.getAllByRole("button");
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("respects defaultValue prop", () => {
    render(<TestAccordion defaultValue={["item-1", "item-2"]} />);
    const triggers = screen.getAllByRole("button");
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[2]).toHaveAttribute("aria-expanded", "false");
  });

  it("opens item when trigger is clicked in multiple mode", () => {
    render(<TestAccordion type="multiple" />);
    const triggers = screen.getAllByRole("button");

    fireEvent.click(triggers[0]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(triggers[1]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("closes item when clicked again in multiple mode", () => {
    render(<TestAccordion type="multiple" defaultValue={["item-1"]} />);
    const triggers = screen.getAllByRole("button");

    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(triggers[0]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("only one item can be open in single mode", () => {
    render(<TestAccordion type="single" defaultValue={["item-1"]} />);
    const triggers = screen.getAllByRole("button");

    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(triggers[1]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "false");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("can close all items in single mode", () => {
    render(<TestAccordion type="single" defaultValue={["item-1"]} />);
    const triggers = screen.getAllByRole("button");

    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(triggers[0]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onValueChange when item is toggled", () => {
    const handleChange = vi.fn();
    render(<TestAccordion onValueChange={handleChange} />);
    const triggers = screen.getAllByRole("button");

    fireEvent.click(triggers[0]);
    expect(handleChange).toHaveBeenCalledWith(["item-1"]);
  });

  it("works in controlled mode", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <TestAccordion value={["item-1"]} onValueChange={handleChange} />
    );

    const triggers = screen.getAllByRole("button");
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(triggers[1]);
    expect(handleChange).toHaveBeenCalledWith(["item-1", "item-2"]);

    // Simulate parent updating value
    rerender(
      <TestAccordion
        value={["item-1", "item-2"]}
        onValueChange={handleChange}
      />
    );
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("applies custom className to root", () => {
    render(
      <Accordion className="custom-class" data-testid="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("accordion")).toHaveClass("custom-class");
  });

  it("applies bordered variant classes", () => {
    render(
      <Accordion variant="bordered" data-testid="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("accordion")).toHaveClass("border");
    expect(screen.getByTestId("accordion")).toHaveClass("rounded-lg");
  });

  it("sets data-state attribute on items", () => {
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1" data-testid="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" data-testid="item-2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("item-1")).toHaveAttribute("data-state", "open");
    expect(screen.getByTestId("item-2")).toHaveAttribute(
      "data-state",
      "closed"
    );
  });

  it("hides chevron when showChevron is false", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger showChevron={false}>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("shows chevron by default", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("forwards ref correctly for Accordion", () => {
    const ref = { current: null };
    render(
      <Accordion ref={ref}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref correctly for AccordionItem", () => {
    const ref = { current: null };
    render(
      <Accordion>
        <AccordionItem value="item-1" ref={ref}>
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref correctly for AccordionTrigger", () => {
    const ref = { current: null };
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger ref={ref}>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards ref correctly for AccordionContent", () => {
    const ref = { current: null };
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent ref={ref}>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("AccordionItem disabled", () => {
  it("does not toggle when item is disabled", () => {
    const handleChange = vi.fn();
    render(
      <Accordion onValueChange={handleChange}>
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies disabled attribute to trigger", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Accordion measured content", () => {
  it("retargets open height after nested content resizes and disconnects on unmount", () => {
    const callbacks: ResizeObserverCallback[] = [];
    const disconnect = vi.fn();
    const previousObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    } as unknown as typeof ResizeObserver;
    try {
      const { unmount } = render(
        <Accordion defaultValue={["resizing"]}>
          <AccordionItem value="resizing">
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent data-testid="resizing-content">
              Deferred content
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const content = screen.getByTestId("resizing-content");
      const inner = content.firstElementChild as HTMLDivElement;
      Object.defineProperty(inner, "scrollHeight", {
        configurable: true,
        value: 160,
      });
      act(() => callbacks[0]([], {} as ResizeObserver));
      expect(content).toHaveStyle({ height: "160px" });
      Object.defineProperty(inner, "scrollHeight", { value: 280 });
      act(() => callbacks[0]([], {} as ResizeObserver));
      expect(content).toHaveStyle({ height: "280px" });
      fireEvent.click(screen.getByRole("button", { name: "Details" }));
      expect(content).toHaveStyle({ height: "0px" });
      unmount();
      expect(disconnect).toHaveBeenCalledTimes(2);
    } finally {
      globalThis.ResizeObserver = previousObserver;
    }
  });
});

it("moves keyboard focus through enabled rows and links each panel", () => {
  render(
    <Accordion>
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>First</AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Unavailable</AccordionTrigger>
        <AccordionContent>Hidden</AccordionContent>
      </AccordionItem>
      <AccordionItem value="last">
        <AccordionTrigger>Last</AccordionTrigger>
        <AccordionContent>Final</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
  const first = screen.getByRole("button", { name: "One" });
  const last = screen.getByRole("button", { name: "Last" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowDown" });
  expect(last).toHaveFocus();
  fireEvent.keyDown(last, { key: "Home" });
  expect(first).toHaveFocus();
  fireEvent.keyDown(first, { key: "End" });
  expect(last).toHaveFocus();
  const panel = document.getElementById(first.getAttribute("aria-controls")!);
  expect(panel).toHaveAttribute("aria-labelledby", first.id);
  expect(panel).toHaveAttribute("inert");
  fireEvent.click(first);
  expect(panel).not.toHaveAttribute("inert");
});

it("respects a consumer cancelling a toggle", () => {
  render(
    <Accordion>
      <AccordionItem value="one">
        <AccordionTrigger onClick={(event) => event.preventDefault()}>
          Cancelled
        </AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
  fireEvent.click(screen.getByRole("button", { name: "Cancelled" }));
  expect(screen.getByRole("button", { name: "Cancelled" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});

describe("Accordion native API and hidden content", () => {
  it("defaults to multiple selection without requiring the type prop", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion onValueChange={onValueChange}>
        {["one", "two"].map((value) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{value}</AccordionTrigger>
            <AccordionContent>{value} details</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
    fireEvent.click(screen.getByRole("button", { name: "one" }));
    fireEvent.click(screen.getByRole("button", { name: "two" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["one", "two"]);
    expect(screen.getByRole("button", { name: "one" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("starts server-rendered closed content at zero height", () => {
    const markup = renderToStaticMarkup(
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <input aria-label="Contact name" defaultValue="Aditi" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const host = document.createElement("div");
    host.innerHTML = markup;
    const panel = host.querySelector('[role="region"]');
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveStyle({ height: "0px" });
  });

  it("preserves native IDs and updates their accessible relationships", () => {
    const Example = ({ suffix }: { suffix: string }) => (
      <Accordion defaultValue={["details"]}>
        <AccordionItem value="details">
          <AccordionTrigger id={"trigger-" + suffix}>Details</AccordionTrigger>
          <AccordionContent id={"panel-" + suffix}>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const { rerender } = render(<Example suffix="one" />);
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-controls",
      "panel-one"
    );
    expect(screen.getByRole("region", { name: "Details" })).toHaveAttribute(
      "aria-labelledby",
      "trigger-one"
    );
    rerender(<Example suffix="two" />);
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-controls",
      "panel-two"
    );
    expect(screen.getByRole("region", { name: "Details" })).toHaveAttribute(
      "aria-labelledby",
      "trigger-two"
    );
  });

  it("returns focus to the trigger on a controlled collapse and keeps field values", () => {
    const Example = ({ value, id }: { value: string[]; id: string }) => (
      <Accordion value={value}>
        <AccordionItem value="details">
          <AccordionTrigger id={id}>Details</AccordionTrigger>
          <AccordionContent data-testid="panel">
            <input aria-label="Contact name" defaultValue="Aditi" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const { rerender } = render(
      <Example value={["details"]} id="original-trigger" />
    );
    const field = screen.getByRole("textbox", { name: "Contact name" });
    fireEvent.change(field, { target: { value: "Updated contact" } });
    field.focus();
    rerender(<Example value={[]} id="updated-trigger" />);
    expect(screen.getByRole("button", { name: "Details" })).toHaveFocus();
    expect(screen.getByTestId("panel")).toHaveAttribute("inert");
    expect(screen.queryByRole("textbox", { name: "Contact name" })).toBeNull();
    rerender(<Example value={["details"]} id="updated-trigger" />);
    expect(screen.getByRole("textbox", { name: "Contact name" })).toHaveValue(
      "Updated contact"
    );
    expect(screen.getByTestId("panel")).not.toHaveAttribute("inert");
  });

  it("merges native styles without losing measured content height or refs", () => {
    const contentRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const onFocus = vi.fn();
    render(
      <Accordion data-native-root="retained">
        <AccordionItem value="details" data-native-item="retained">
          <AccordionTrigger
            ref={triggerRef}
            title="Open details"
            onFocus={onFocus}
          >
            Details
          </AccordionTrigger>
          <AccordionContent
            ref={contentRef}
            style={{ paddingTop: "12px" }}
            data-native-panel="retained"
          >
            Content
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(contentRef.current).toHaveStyle({
      height: "0px",
      paddingTop: "12px",
    });
    expect(contentRef.current).toHaveAttribute("data-native-panel", "retained");
    expect(triggerRef.current).toHaveAttribute("title", "Open details");
    triggerRef.current?.focus();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("never submits a surrounding form when the trigger toggles", () => {
    const submit = vi.fn((event) => event.preventDefault());
    const click = vi.fn();
    render(
      <form onSubmit={submit}>
        <Accordion>
          <AccordionItem value="details">
            <AccordionTrigger onClick={click}>Details</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(click).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("honors both item and native trigger disabled state", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion onValueChange={onValueChange}>
        <AccordionItem value="item-disabled" disabled>
          <AccordionTrigger disabled={false}>Disabled item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="trigger-disabled">
          <AccordionTrigger disabled>Disabled trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    for (const trigger of screen.getAllByRole("button")) {
      expect(trigger).toBeDisabled();
      fireEvent.click(trigger);
    }
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("Accordion keyboard boundaries", () => {
  it("wraps in both directions, skips nested accordions, and supports cancellation", () => {
    const cancelled = vi.fn((event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Home") event.preventDefault();
    });
    render(
      <Accordion defaultValue={["first"]}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>
            <Accordion>
              <AccordionItem value="nested">
                <AccordionTrigger>Nested</AccordionTrigger>
                <AccordionContent>Nested content</AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="last">
          <AccordionTrigger onKeyDown={cancelled}>Last</AccordionTrigger>
          <AccordionContent>Last content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: "ArrowDown" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: "ArrowUp" });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: "Home" });
    expect(last).toHaveFocus();
    expect(cancelled).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(last, { key: "ArrowDown", ctrlKey: true });
    expect(last).toHaveFocus();
    expect(screen.getByRole("button", { name: "Nested" })).not.toHaveFocus();
  });
});

it.each(["root", "trigger", "content"] as const)(
  "preserves cleanup-returning callback refs on %s",
  (target) => {
    const calls: string[] = [];
    const ref = (node: HTMLElement | null) => {
      calls.push(node ? "attach" : "null");
      if (node)
        return () => {
          calls.push("cleanup");
        };
    };
    const { unmount } = render(
      <Accordion
        defaultValue={["details"]}
        ref={target === "root" ? ref : undefined}
      >
        <AccordionItem value="details">
          <AccordionTrigger ref={target === "trigger" ? ref : undefined}>
            Details
          </AccordionTrigger>
          <AccordionContent ref={target === "content" ? ref : undefined}>
            Contact profile
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    unmount();
    expect(calls).toEqual(["attach", "cleanup"]);
  }
);
