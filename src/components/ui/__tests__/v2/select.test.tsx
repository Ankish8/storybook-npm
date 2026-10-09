import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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
} from "../../v2/select";

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
    expect(trigger).toHaveClass("h-11");
    expect(trigger).toHaveClass("w-full");
    expect(trigger).toHaveClass("rounded-lg");
    expect(trigger).toHaveClass("px-3");
    expect(trigger).toHaveClass("py-2");
  });

  it("wraps long dropdown option text within the trigger width", async () => {
    const user = userEvent.setup();
    const longLabel = "sadjkhurterqruwqcebrcqweurbuqweqrgwqwerqwerqwerqwer";

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
    expect(trigger).toHaveClass("gap-3");
    expect(trigger).toHaveClass("[&>span]:min-w-0");
    expect(trigger).toHaveClass("[&>span]:truncate");

    await user.click(trigger);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("w-[var(--radix-select-trigger-width)]");
    expect(listbox).toHaveClass("max-w-[var(--radix-select-trigger-width)]");

    const viewport = document.querySelector("[data-select-viewport]");
    expect(viewport).toHaveClass("w-full");

    const selectedOption = screen.getByRole("option", { name: longLabel });
    const optionText = within(selectedOption).getByText(longLabel);
    const optionTextWrapper = optionText.parentElement;
    expect(selectedOption).toHaveClass("items-start");
    expect(optionTextWrapper).toHaveClass("min-w-0");
    expect(optionTextWrapper).toHaveClass("flex-1");
    expect(optionTextWrapper).toHaveClass("whitespace-normal");
    expect(optionTextWrapper).toHaveClass("break-words");
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
  describe("long option labels", () => {
    const LONG =
      "A very long option label that keeps going well past the trigger width";

    it("wraps option labels by default", async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">{LONG}</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByTestId("trigger"));
      const label = screen.getByText(LONG);
      const wrapper = label.closest("span[class]") as HTMLElement;

      expect(wrapper.className).toContain("whitespace-normal");
      expect(wrapper.className).toContain("break-words");
      expect(wrapper.className).not.toContain("truncate");
      expect(wrapper).not.toHaveAttribute("title");
    });

    it("truncates option labels when SelectContent sets truncateOptionText", async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent truncateOptionText>
            <SelectItem value="long">{LONG}</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByTestId("trigger"));
      const wrapper = screen
        .getByText(LONG)
        .closest("span[class]") as HTMLElement;

      expect(wrapper.className).toContain("truncate");
      expect(wrapper.className).not.toContain("whitespace-normal");
      expect(wrapper).toHaveAttribute("title", LONG);
    });

    it("lets an item override the content-level setting", async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent truncateOptionText>
            <SelectItem value="long" truncateOptionText={false}>
              {LONG}
            </SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByTestId("trigger"));
      const wrapper = screen
        .getByText(LONG)
        .closest("span[class]") as HTMLElement;

      expect(wrapper.className).toContain("whitespace-normal");
      expect(wrapper.className).not.toContain("truncate");
    });

    it.each([
      ["wrapped", false],
      ["truncated", true],
    ])(
      "reports the full, unclipped value to onValueChange when %s",
      async (_mode, truncate) => {
        const onValueChange = vi.fn();
        const user = userEvent.setup();
        const LONG_VALUE =
          "customer-support-escalation-queue-enterprise-apac-tier-3";

        render(
          <Select onValueChange={onValueChange}>
            <SelectTrigger data-testid="trigger">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent truncateOptionText={truncate}>
              <SelectItem value={LONG_VALUE}>{LONG}</SelectItem>
            </SelectContent>
          </Select>
        );

        await user.click(screen.getByTestId("trigger"));
        await user.click(screen.getByText(LONG));

        // Truncation is CSS-only: the persisted value and the rendered label
        // text are both complete regardless of how the row is displayed.
        expect(onValueChange).toHaveBeenCalledWith(LONG_VALUE);
        expect(screen.getByTestId("trigger")).toHaveTextContent(LONG);
      }
    );
  });
});

describe("Select v2 refresh", () => {
  it("keeps the trigger in its open look while the panel is open", async () => {
    const user = userEvent.setup();
    renderSelect();
    const trigger = screen.getByTestId("trigger");

    // Radix moves focus into the list, so the open look cannot rely on `focus:`.
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.className).toContain(
      "aria-expanded:border-semantic-primary"
    );
    expect(trigger.className).toContain("aria-expanded:shadow-none");
    // Must outrank the grey hover border (specificity 0,4,0 vs 0,3,0).
    expect(trigger.className).toContain(
      "enabled:aria-expanded:hover:border-semantic-primary"
    );

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not paint the open look on an error trigger", () => {
    renderSelect({ triggerProps: { state: "error" } });
    expect(screen.getByTestId("trigger").className).not.toContain(
      "aria-expanded:border-[var(--color-secondary-600"
    );
  });

  it("rotates the chevron 180 degrees on Arc's 580ms spring", () => {
    renderSelect();
    const chevron = screen.getByTestId("trigger").querySelector("svg");
    expect(chevron).toHaveClass(
      "[transition-duration:580ms]",
      "group-data-[state=open]/v2-select:rotate-180",
      "motion-reduce:transition-none"
    );
    // The sampled curve is Arc's `--ease-spring`, which settles with a hint of overshoot.
    expect(chevron?.getAttribute("class")).toContain(
      "[transition-timing-function:linear(0,0.0258,"
    );
    // Stroke weight is CSS so the markup stays identical to v1.
    expect(chevron).toHaveClass("[stroke-width:1.75]");
  });

  it("tints the field on hover, press and while open like Arc's muted surface", () => {
    renderSelect();
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveClass(
      "[@media(hover:hover)]:enabled:hover:bg-semantic-bg-ui",
      "enabled:active:bg-semantic-bg-ui",
      "aria-expanded:bg-semantic-bg-ui"
    );
    expect(trigger).toHaveClass("disabled:opacity-50");
  });

  it("fades and zooms the panel with motion-safe vars so the reset in animate-in cannot cancel them", async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByTestId("trigger"));
    const panel = screen.getByRole("listbox");
    // Arc: rises 6px and scales from .97 in 240ms; leaves 3px and .98 in 120ms.
    expect(panel).toHaveClass(
      "data-[state=open]:motion-safe:fade-in-0",
      "data-[state=open]:motion-safe:zoom-in-[0.97]",
      "data-[state=closed]:motion-safe:fade-out-0",
      "data-[state=closed]:motion-safe:zoom-out-[0.98]",
      "data-[side=bottom]:motion-safe:slide-in-from-top-[6px]",
      "data-[side=top]:motion-safe:slide-in-from-bottom-[6px]",
      "data-[side=bottom]:motion-safe:slide-out-to-top-[3px]",
      "data-[state=open]:motion-safe:[animation-duration:240ms]",
      "data-[state=closed]:motion-safe:[animation-duration:120ms]"
    );
    expect(panel).not.toHaveClass("data-[state=open]:fade-in-0");
    // A bare `data-[side=bottom]:slide-in-from-top-[6px]` ties with the open-state animate-in
    // on specificity and loses on order, so the slide would silently never run.
    expect(panel).not.toHaveClass("data-[side=bottom]:slide-in-from-top-[6px]");
  });

  it("opens 4px below the trigger with 6px panel padding and 2px list padding, like Arc", async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByTestId("trigger"));
    const panel = screen.getByRole("listbox");
    expect(panel).toHaveClass("p-1.5");
    expect(panel).toHaveClass(
      "shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)]"
    );
    expect(panel).toHaveAttribute("data-side", "bottom");
    expect(document.querySelector("[data-select-viewport]")).toHaveClass(
      "py-0.5"
    );
  });

  it("gives rows Arc's 36px minimum, 11px / 34px padding and no weight change on selection", async () => {
    const user = userEvent.setup();
    renderSelect({ selectProps: { defaultValue: "option2" } });
    await user.click(screen.getByTestId("trigger"));
    const option = screen.getByRole("option", { name: "Option 2" });
    expect(option).toHaveClass("min-h-9", "pl-[11px]", "pr-[34px]");
    expect(option).toHaveClass("[transition-duration:120ms]");
    expect(option.className).not.toContain("font-medium");
  });

  it("gives rows a 4px radius concentric with the 8px panel", async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByTestId("trigger"));
    const option = screen.getByRole("option", { name: "Option 1" });
    expect(option).toHaveClass("rounded-sm");
    expect(option).not.toHaveClass("rounded-md");
  });

  it("has no keyboard-only ring: Radix focuses hovered rows too, so focus-visible cannot tell them apart", async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByTestId("trigger"));
    expect(
      screen.getByRole("option", { name: "Option 1" }).className
    ).not.toContain("focus-visible:ring");
  });

  it("pops the selected check in after 40ms, with a reduced-motion fallback", async () => {
    const user = userEvent.setup();
    renderSelect({ selectProps: { defaultValue: "option2" } });
    await user.click(screen.getByTestId("trigger"));
    const check = screen
      .getByRole("option", { name: "Option 2" })
      .querySelector("svg");
    expect(check).not.toBeNull();
    const indicator = check?.parentElement;
    expect(indicator).toHaveClass(
      "[transition-delay:40ms]",
      "[transition-duration:240ms]",
      "[@starting-style]:scale-[0.6]",
      "[@starting-style]:opacity-0",
      "[@starting-style]:blur-[2px]",
      "motion-reduce:[@starting-style]:scale-100"
    );
    expect(check).not.toHaveClass("animate-in");
    expect(
      screen.getByRole("option", { name: "Option 1" }).querySelector("svg")
    ).toBeNull();
  });

  describe("value roll", () => {
    const animate = vi.fn(() => ({ onfinish: null, oncancel: null }));
    beforeEach(() => {
      animate.mockClear();
      Object.defineProperty(HTMLElement.prototype, "animate", {
        configurable: true,
        writable: true,
        value: animate,
      });
    });
    afterEach(() => {
      // jsdom has no Web Animations API; leave it that way for the other tests.
      delete (HTMLElement.prototype as { animate?: unknown }).animate;
    });

    it("does not animate the first fill from a default value", async () => {
      renderSelect({ selectProps: { defaultValue: "option2" } });
      expect(screen.getByTestId("trigger")).toHaveTextContent("Option 2");
      await Promise.resolve();
      expect(animate).not.toHaveBeenCalled();
    });

    it("rises the new value from below and drops the old one up when a later option is chosen", async () => {
      const user = userEvent.setup();
      renderSelect({ selectProps: { defaultValue: "option1" } });
      await user.click(screen.getByTestId("trigger"));
      await user.click(screen.getByRole("option", { name: "Option 3" }));

      await waitFor(() => expect(animate).toHaveBeenCalledTimes(2));
      const [enter, leave] = animate.mock.calls as unknown as [
        Keyframe[],
        KeyframeAnimationOptions,
      ][];
      expect(enter[0][0]).toMatchObject({
        opacity: 0,
        transform: "translateY(0.35em)",
        filter: "blur(4px)",
      });
      expect(enter[1]).toMatchObject({ duration: 240 });
      expect(leave[0][1]).toMatchObject({ transform: "translateY(-0.3em)" });
      expect(leave[1]).toMatchObject({ duration: 160 });
      // The leaving copy is decorative.
      expect(
        screen.getByTestId("trigger").querySelector("[data-value-roll-ghost]")
      ).toHaveAttribute("aria-hidden", "true");
    });
  });
});
