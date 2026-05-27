import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

// Helper to render a basic select
const renderSelect = (
  props: {
    triggerProps?: React.ComponentProps<typeof SelectTrigger>;
    selectProps?: React.ComponentProps<typeof Select>;
    placeholder?: string;
  } = {}
) => {
  return render(
    <Select {...props.selectProps}>
      <SelectTrigger data-testid="trigger" {...props.triggerProps}>
        <SelectValue placeholder={props.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  );
};

describe("Select", () => {
  // Basic rendering
  it("renders trigger correctly", () => {
    renderSelect();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    renderSelect({ placeholder: "Choose an option" });
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  // Interaction tests
  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows options when opened", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("selects option on click", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Option 2"));

    // After selection, the value should be displayed
    expect(screen.getByTestId("trigger")).toHaveTextContent("Option 2");
  });

  it("closes dropdown after selection", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Option 1"));

    // Listbox should no longer be visible
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // State variants
  it("applies default state styling", () => {
    renderSelect();
    expect(screen.getByTestId("trigger")).toHaveClass(
      "border-semantic-border-input"
    );
  });

  it("applies error state styling", () => {
    renderSelect({ triggerProps: { state: "error" } });
    expect(screen.getByTestId("trigger")).toHaveClass(
      "border-semantic-error-primary"
    );
  });

  // Disabled state
  it("is disabled when select is disabled", () => {
    renderSelect({ selectProps: { disabled: true } });
    expect(screen.getByTestId("trigger")).toBeDisabled();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    renderSelect({ selectProps: { disabled: true } });

    await user.click(screen.getByTestId("trigger"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // Default value
  it("shows default value when provided", () => {
    render(
      <Select defaultValue="option2">
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId("trigger")).toHaveTextContent("Option 2");
  });

  // Controlled mode
  it("works in controlled mode", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Select value="option1" onValueChange={handleValueChange}>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Option 2"));

    expect(handleValueChange).toHaveBeenCalledWith("option2");
  });

  // Groups
  it("renders groups with labels", async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group A</SelectLabel>
            <SelectItem value="a1">A1</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Group B</SelectLabel>
            <SelectItem value="b1">B1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
  });

  // Separator
  it("renders separator", async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectSeparator data-testid="separator" />
          <SelectItem value="b">B</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  // Disabled items
  it("renders disabled items", async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="disabled" disabled>
            Disabled
          </SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByTestId("trigger"));
    const disabledItem = screen.getByText("Disabled");
    expect(disabledItem.closest("[data-disabled]")).toBeInTheDocument();
  });

  // Custom className
  it("applies custom className to trigger", () => {
    renderSelect({ triggerProps: { className: "custom-class" } });
    expect(screen.getByTestId("trigger")).toHaveClass("custom-class");
  });

  // Base styling classes
  it("applies base styling classes to trigger", () => {
    renderSelect();
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveClass("h-[42px]");
    expect(trigger).toHaveClass("w-full");
    expect(trigger).toHaveClass("rounded");
    expect(trigger).toHaveClass("px-4");
    expect(trigger).toHaveClass("py-2");
  });

  it("truncates long selected option text before the checkmark", async () => {
    const user = userEvent.setup();
    const longLabel =
      "sadjkhurterqruwqcebrcqweurbuqweqrgwqwerqwerqwerqwer";

    render(
      <Select defaultValue="long">
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="long">{longLabel}</SelectItem>
          <SelectItem value="short">Short tag</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveClass("gap-2");
    expect(trigger).toHaveClass("[&>span]:min-w-0");
    expect(trigger).toHaveClass("[&>span]:truncate");

    await user.click(trigger);
    const selectedOption = screen.getByRole("option", { name: longLabel });
    const optionText = within(selectedOption).getByText(longLabel);
    expect(optionText).toHaveClass("min-w-0");
    expect(optionText).toHaveClass("flex-1");
    expect(optionText).toHaveClass("truncate");
  });

  // Keyboard navigation
  it("opens with keyboard (Enter)", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByTestId("trigger").focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens with keyboard (Space)", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByTestId("trigger").focus();
    await user.keyboard(" ");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  // Accessibility
  it("has combobox role on trigger", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has proper aria-expanded state", async () => {
    const user = userEvent.setup();
    renderSelect();

    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  describe("onViewportScrollEnd", () => {
    // Force feature detection to take the modern `scrollend` path. jsdom
    // doesn't ship `onscrollend`, so without this stub the component falls
    // through to the debounced `scroll` fallback.
    beforeEach(() => {
      Object.defineProperty(window, "onscrollend", {
        configurable: true,
        value: null,
        writable: true,
      });
    });

    afterEach(() => {
      // @ts-expect-error — cleanup of test-only property
      delete window.onscrollend;
    });

    it("fires when the viewport scrolls to its bottom", async () => {
      const onViewportScrollEnd = vi.fn();
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent onViewportScrollEnd={onViewportScrollEnd}>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByTestId("trigger"));
      const viewport = document.querySelector(
        "[data-select-viewport]"
      ) as HTMLDivElement | null;
      expect(viewport).toBeTruthy();

      Object.defineProperty(viewport, "scrollHeight", {
        configurable: true,
        value: 400,
      });
      Object.defineProperty(viewport, "clientHeight", {
        configurable: true,
        value: 200,
      });
      viewport!.scrollTop = 190;

      viewport!.dispatchEvent(new Event("scrollend", { bubbles: true }));
      expect(onViewportScrollEnd).toHaveBeenCalledTimes(1);
    });

    it("does not fire when scrollend happens mid-list", async () => {
      const onViewportScrollEnd = vi.fn();
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent onViewportScrollEnd={onViewportScrollEnd}>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByTestId("trigger"));
      const viewport = document.querySelector(
        "[data-select-viewport]"
      ) as HTMLDivElement | null;
      expect(viewport).toBeTruthy();

      Object.defineProperty(viewport, "scrollHeight", {
        configurable: true,
        value: 400,
      });
      Object.defineProperty(viewport, "clientHeight", {
        configurable: true,
        value: 200,
      });
      viewport!.scrollTop = 50;

      viewport!.dispatchEvent(new Event("scrollend", { bubbles: true }));
      expect(onViewportScrollEnd).not.toHaveBeenCalled();
    });
  });
});
