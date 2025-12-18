import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

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
