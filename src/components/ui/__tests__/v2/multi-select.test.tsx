import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as React from "react";
import type { Placement } from "@floating-ui/react-dom";
import {
  render,
  screen,
  within,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MultiSelect,
  flattenMultiSelectOptions,
  type MultiSelectOption,
} from "../../v2/multi-select";
import { ModalRoot, ModalContent, ModalTitle } from "../../v2/modal";

// jsdom has no layout, so floating-ui never flips. Let a test force the placement
// the hook reports; everything else passes straight through to the real hook.
const forced = vi.hoisted(() => ({ placement: null as string | null }));
vi.mock("@floating-ui/react-dom", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@floating-ui/react-dom")>();
  return {
    ...actual,
    useFloating: (options: Parameters<typeof actual.useFloating>[0]) => {
      const result = actual.useFloating(options);
      return forced.placement
        ? { ...result, placement: forced.placement as Placement }
        : result;
    },
  };
});

const defaultOptions: MultiSelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("MultiSelect", () => {
  it.each(["disabled", "loading"] as const)(
    "prevents nested chip and clear controls from changing a %s field",
    (state) => {
      const onValueChange = vi.fn();
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1"]}
          onValueChange={onValueChange}
          {...{ [state]: true }}
        />
      );
      const remove = screen.getByLabelText("Remove Option 1");
      const clear = screen.getByRole("button", { name: "Clear all" });
      expect(remove).toHaveAttribute("tabindex", "-1");
      expect(clear).toHaveAttribute("aria-disabled", "true");
      fireEvent.keyDown(remove, { key: "Enter" });
      fireEvent.keyDown(clear, { key: "Enter" });
      expect(onValueChange).not.toHaveBeenCalled();
    }
  );
  // Basic rendering
  it("renders correctly", () => {
    render(<MultiSelect options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(
      <MultiSelect options={defaultOptions} placeholder="Select options" />
    );
    expect(screen.getByText("Select options")).toBeInTheDocument();
  });

  // Label tests
  it("renders label when provided", () => {
    render(<MultiSelect label="Test Label" options={defaultOptions} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders required indicator when required", () => {
    render(
      <MultiSelect label="Test Label" options={defaultOptions} required />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-v2-semantic-error-primary");
  });

  // Helper text tests
  it("renders helper text when provided", () => {
    render(<MultiSelect options={defaultOptions} helperText="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
    expect(screen.getByText("Helper text")).toHaveClass(
      "text-[var(--v2-text-muted,#707070)]"
    );
  });

  // Error message tests
  it("shows error message when error prop is set", () => {
    render(<MultiSelect options={defaultOptions} error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.getByText("Required field")).toHaveClass(
      "text-v2-semantic-error-text"
    );
  });

  it("error message takes precedence over helper text", () => {
    render(
      <MultiSelect options={defaultOptions} helperText="Helper" error="Error" />
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("applies error state styling when error is set", () => {
    render(<MultiSelect options={defaultOptions} error="Error" />);
    expect(screen.getByRole("combobox")).toHaveClass(
      "border-v2-semantic-error-primary"
    );
  });

  // Dropdown interaction
  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows options when opened", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  // Selection tests
  it("selects option on click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 1"));

    // Tag should appear - there will be 2 elements (tag + option in dropdown)
    const option1Elements = screen.getAllByText("Option 1");
    expect(option1Elements.length).toBeGreaterThan(0);
    // Check that the remove button exists (which means a tag was created)
    expect(screen.getByLabelText("Remove Option 1")).toBeInTheDocument();
  });

  it("allows multiple selections", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 1"));
    await user.click(screen.getByText("Option 2"));

    // Both tags should appear
    const option1Tags = screen.getAllByText("Option 1");
    const option2Tags = screen.getAllByText("Option 2");
    expect(option1Tags.length).toBeGreaterThan(0);
    expect(option2Tags.length).toBeGreaterThan(0);
  });

  it("wraps long selected option text before the check icon", async () => {
    const user = userEvent.setup();
    const longLabel =
      "AngularAngularAngularAngularAngularAngularAngularAngularAngular";

    render(
      <MultiSelect
        options={[
          { value: "react", label: "React" },
          { value: "angular", label: longLabel },
          { value: "svelte", label: "Svelte" },
        ]}
        defaultValue={["angular"]}
      />
    );

    await user.click(screen.getByRole("combobox"));

    const selectedOption = screen.getByRole("option", { name: longLabel });
    const optionText = within(selectedOption).getByText(longLabel);
    expect(selectedOption).toHaveClass("min-w-0");
    expect(optionText).toHaveClass("min-w-0");
    expect(optionText).toHaveClass("flex-1");
    expect(optionText).toHaveClass("whitespace-normal");
    expect(optionText).toHaveClass("break-words");
    expect(optionText).not.toHaveClass("truncate");
  });

  it("deselects option on second click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} defaultValue={["option1"]} />);

    await user.click(screen.getByRole("combobox"));
    // Find the option in the dropdown and click it
    const optionInDropdown = screen.getByRole("option", { name: "Option 1" });
    await user.click(optionInDropdown);

    // Tag should be removed, but placeholder should appear since all are deselected
    expect(screen.queryByLabelText("Remove Option 1")).not.toBeInTheDocument();
  });

  // Default value
  it("shows default values as tags", () => {
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={["option1", "option2"]}
      />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  // Remove tag
  it("removes tag when X is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={["option1", "option2"]}
      />
    );

    await user.click(screen.getByLabelText("Remove Option 1"));

    expect(screen.queryByLabelText("Remove Option 1")).not.toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("hides clear all when showClearAll is false", () => {
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={["option1", "option2"]}
        showClearAll={false}
      />
    );
    expect(screen.queryByLabelText("Clear all")).not.toBeInTheDocument();
  });

  // Clear all
  it("clears all selections when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={["option1", "option2"]}
      />
    );

    await user.click(screen.getByLabelText("Clear all"));

    expect(screen.queryByLabelText("Remove Option 1")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Remove Option 2")).not.toBeInTheDocument();
  });

  // Controlled mode
  it("works in controlled mode", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MultiSelect
        options={defaultOptions}
        value={["option1"]}
        onValueChange={handleValueChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 2"));

    expect(handleValueChange).toHaveBeenCalledWith(["option1", "option2"]);
  });

  // Max selections
  it("enforces max selections", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={defaultOptions}
        maxSelections={2}
        defaultValue={["option1", "option2"]}
      />
    );

    await user.click(screen.getByRole("combobox"));
    const option3 = screen.getByRole("option", { name: "Option 3" });

    // Option 3 should be disabled (has opacity-50 class)
    expect(option3).toHaveClass("opacity-50");
  });

  it("shows selection count when maxSelections is set", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={defaultOptions}
        maxSelections={3}
        defaultValue={["option1"]}
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("1 / 3 selected")).toBeInTheDocument();
  });

  // Searchable
  it("shows search input when searchable", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("filters options when searching", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Search..."), "Option 1");

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Option 2" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Option 3" })
    ).not.toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Search..."), "xyz");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  // Controlled search (server-side filtering, e.g. paired with onScrollEnd
  // pagination — client-side filtering would only search the loaded page).
  it("controlled search: calls onSearchQueryChange instead of managing its own state", async () => {
    const user = userEvent.setup();
    const onSearchQueryChange = vi.fn();
    render(
      <MultiSelect
        options={defaultOptions}
        searchable
        searchQuery=""
        onSearchQueryChange={onSearchQueryChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(onSearchQueryChange).toHaveBeenCalledWith("abc");
    // Controlled: the input only reflects the `searchQuery` prop, which the
    // parent didn't feed back here, so it doesn't update itself from typing.
    expect(input).toHaveValue("");
  });

  it("controlled search: does not filter options client-side, even when searchQuery matches nothing", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={defaultOptions}
        searchable
        searchQuery="no-match-in-any-label"
        onSearchQueryChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("combobox"));

    // The parent owns filtering server-side; the component must not also
    // filter `options`, or it would show a false "No results found" against
    // options the parent already filtered for this query.
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("uncontrolled search still filters client-side when searchQuery is omitted", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} searchable />);

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "Option 1");

    // Uncontrolled: the component owns its own search state, so the input
    // reflects what was typed and options are filtered internally.
    expect(input).toHaveValue("Option 1");
    expect(
      screen.queryByRole("option", { name: "Option 2" })
    ).not.toBeInTheDocument();
  });

  // Disabled state
  it("is disabled when disabled prop is set", () => {
    render(<MultiSelect options={defaultOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} disabled />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // Loading state
  it("is disabled when loading", () => {
    render(<MultiSelect options={defaultOptions} loading />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} loading />
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  // Disabled options
  it("renders disabled options", async () => {
    const optionsWithDisabled: MultiSelectOption[] = [
      { value: "enabled", label: "Enabled" },
      { value: "disabled", label: "Disabled", disabled: true },
    ];
    const user = userEvent.setup();

    render(<MultiSelect options={optionsWithDisabled} />);

    await user.click(screen.getByRole("combobox"));
    const disabledOption = screen.getByRole("option", { name: "Disabled" });
    expect(disabledOption).toHaveClass("opacity-50");
  });

  // Custom classNames
  it("applies custom wrapperClassName", () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} wrapperClassName="custom-wrapper" />
    );
    expect(container.firstChild).toHaveClass("custom-wrapper");
  });

  it("applies custom triggerClassName", () => {
    render(
      <MultiSelect options={defaultOptions} triggerClassName="custom-trigger" />
    );
    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
  });

  // Accessibility
  it("has combobox role", () => {
    render(<MultiSelect options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has proper aria-expanded state", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-invalid when error is present", () => {
    render(<MultiSelect options={defaultOptions} error="Error" />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  // Keyboard / dismiss behavior
  it("closes dropdown on Escape when closeOnEscape is true", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} closeOnEscape />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not close on Escape by default (outside click only)", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("flattens grouped sections and maps caption / isDisabled / overlayMsg", () => {
    const flat = flattenMultiSelectOptions([
      {
        label: "Group A",
        options: [
          {
            value: "1",
            label: "One",
            caption: "Assigned to Bot X",
            isDisabled: true,
            overlayMsg: "This number is associated with another bot.",
          },
        ],
      },
    ]);
    expect(flat).toHaveLength(1);
    expect(flat[0].group).toBe("Group A");
    expect(flat[0].secondaryText).toBe("Assigned to Bot X");
    expect(flat[0].disabled).toBe(true);
    expect(flat[0].disabledTooltip).toBe(
      "This number is associated with another bot."
    );
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MultiSelect options={defaultOptions} />
        <button type="button">outside-target</button>
      </div>
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "outside-target" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("portals the menu to document.body, not into a transformed dialog ancestor", async () => {
    const user = userEvent.setup();
    render(
      <div role="dialog" data-testid="dialog-content">
        <MultiSelect options={defaultOptions} />
      </div>
    );

    await user.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(listbox.parentElement).toBe(document.body);
  });

  it("stops wheel events at the menu so a dialog scroll lock cannot cancel them", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);

    await user.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");

    const onDocumentWheel = vi.fn();
    document.addEventListener("wheel", onDocumentWheel);
    listbox.dispatchEvent(
      new WheelEvent("wheel", { bubbles: true, cancelable: true })
    );
    document.removeEventListener("wheel", onDocumentWheel);

    expect(onDocumentWheel).not.toHaveBeenCalled();
  });

  it("portals to a caller-supplied container when menuContainer is set", async () => {
    const user = userEvent.setup();
    const host = document.createElement("div");
    host.setAttribute("data-testid", "custom-host");
    document.body.appendChild(host);

    render(
      <div role="dialog">
        <MultiSelect options={defaultOptions} menuContainer={host} />
      </div>
    );

    await user.click(screen.getByRole("combobox"));
    expect(host).toContainElement(screen.getByRole("listbox"));
    host.remove();
  });

  it("truncates long option labels when truncateOptionText is set", async () => {
    const user = userEvent.setup();
    const longLabel = "A".repeat(200);
    render(
      <MultiSelect
        options={[{ value: "long", label: longLabel }]}
        truncateOptionText
      />
    );

    await user.click(screen.getByRole("combobox"));
    const text = screen.getByTitle(longLabel);
    expect(text).toHaveClass("truncate");
  });

  it("wraps long option labels by default", async () => {
    const user = userEvent.setup();
    const longLabel = "B".repeat(200);
    render(<MultiSelect options={[{ value: "long", label: longLabel }]} />);

    await user.click(screen.getByRole("combobox"));
    const option = screen.getByRole("option");
    expect(option.querySelector("span.break-words")).not.toBeNull();
  });

  it("detailed rows truncate by default but honour truncateOptionText={false}", async () => {
    const user = userEvent.setup();
    const longLabel = "C".repeat(200);
    const { rerender } = render(
      <MultiSelect
        options={[{ value: "long", label: longLabel }]}
        optionVariant="detailed"
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByTitle(longLabel)).toHaveClass("truncate");

    rerender(
      <MultiSelect
        options={[{ value: "long", label: longLabel }]}
        optionVariant="detailed"
        truncateOptionText={false}
      />
    );
    expect(screen.getByTitle(longLabel)).toHaveClass("break-words");
  });

  it("truncates selected chips in the trigger", async () => {
    const longLabel = "D".repeat(200);
    render(
      <MultiSelect
        options={[{ value: "long", label: longLabel }]}
        defaultValue={["long"]}
      />
    );

    expect(screen.getByTitle(longLabel)).toHaveClass("truncate");
  });

  // Inside a Radix ModalRoot the focus trap must not steal focus from the
  // body-portaled search input (regression: typing did nothing).
  it("keeps the search input typable inside a Dialog", async () => {
    const user = userEvent.setup();
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalTitle>Assign</ModalTitle>
          <MultiSelect
            options={defaultOptions}
            searchable
            placeholder="Select"
          />
        </ModalContent>
      </ModalRoot>
    );

    await user.click(screen.getByRole("combobox"));
    const search = await screen.findByPlaceholderText("Search...");
    search.focus();
    await user.type(search, "Option 2");

    expect(search).toHaveValue("Option 2");
    expect(document.activeElement).toBe(search);
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  // Radix FocusScope also restores focus from its document `focusout` handler,
  // which fires on the element inside the dialog and so never passes through
  // the menu. jsdom leaves `relatedTarget` null on a plain focus() call, so the
  // browser's event is reconstructed here.
  it("survives the ModalRoot focus trap's focusout handler", async () => {
    const user = userEvent.setup();
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalTitle>Assign</ModalTitle>
          <MultiSelect
            options={defaultOptions}
            searchable
            placeholder="Select"
          />
        </ModalContent>
      </ModalRoot>
    );

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const search = await screen.findByPlaceholderText("Search...");
    search.focus();

    trigger.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        composed: true,
        relatedTarget: search,
      })
    );

    expect(document.activeElement).toBe(search);
  });

  // Infinite scroll / server-side pagination
  describe("infinite scroll", () => {
    // jsdom reports 0 for every layout box, so the list geometry is stubbed on
    // the prototype BEFORE render — the component measures the list in an
    // effect that runs on open, so stubbing a node afterwards would be too
    // late and the no-scrollbar fallback would already have fired.
    const POST_FETCH_MEASURE_DELAY_MS = 50;

    const stubGeometry = (scrollHeight: number, clientHeight: number) => {
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(
        scrollHeight
      );
      vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(
        clientHeight
      );
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const openList = async (ui: React.ReactElement) => {
      const user = userEvent.setup();
      render(ui);
      await user.click(screen.getByRole("combobox"));
      const list = document.querySelector<HTMLDivElement>(
        "[role='listbox'] .overflow-auto"
      )!;
      return { list, user };
    };

    /**
     * The handler coalesces scroll bursts into one `requestAnimationFrame`, so
     * the measurement lands a frame after the event — flush it.
     */
    const scrollTo = async (list: HTMLDivElement, top: number) => {
      Object.defineProperty(list, "scrollTop", {
        configurable: true,
        value: top,
      });
      fireEvent.scroll(list);
      // Let the queued frame run.
      await act(async () => {
        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(null))
        );
      });
    };

    /** Flush the post-fetch re-measure timer (50ms). */
    const flushRemeasure = async () => {
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, POST_FETCH_MEASURE_DELAY_MS + 20)
        );
      });
    };

    it("calls onScrollEnd once when scrolled within 48px of the bottom", async () => {
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { list } = await openList(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );

      await scrollTo(list, 400); // 1000 - 400 - 240 = 360px left
      expect(onScrollEnd).not.toHaveBeenCalled();

      await scrollTo(list, 730); // 30px left — inside the threshold
      expect(onScrollEnd).toHaveBeenCalledTimes(1);
    });

    it("latches so trackpad inertia cannot fire repeat requests", async () => {
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { list } = await openList(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );

      await scrollTo(list, 730);
      // Momentum keeps emitting scroll events at/near the boundary.
      await scrollTo(list, 745);
      await scrollTo(list, 755);
      await scrollTo(list, 760);
      expect(onScrollEnd).toHaveBeenCalledTimes(1);
    });

    it("re-arms only after the user scrolls away from the bottom", async () => {
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { list } = await openList(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );

      await scrollTo(list, 760);
      expect(onScrollEnd).toHaveBeenCalledTimes(1);

      await scrollTo(list, 200); // away from the boundary — latch clears
      await scrollTo(list, 760);
      expect(onScrollEnd).toHaveBeenCalledTimes(2);
    });

    it("does not call onScrollEnd when hasMore is false", async () => {
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { list } = await openList(
        <MultiSelect options={defaultOptions} onScrollEnd={onScrollEnd} />
      );

      await scrollTo(list, 760);
      expect(onScrollEnd).not.toHaveBeenCalled();
    });

    it("does not call onScrollEnd while loadingMore is true", async () => {
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { list } = await openList(
        <MultiSelect
          options={defaultOptions}
          hasMore
          loadingMore
          onScrollEnd={onScrollEnd}
        />
      );

      await scrollTo(list, 760);
      expect(onScrollEnd).not.toHaveBeenCalled();
    });

    it("renders the loading row at the bottom of the list when loadingMore", async () => {
      stubGeometry(1000, 240);
      await openList(
        <MultiSelect options={defaultOptions} hasMore loadingMore />
      );

      expect(screen.getByRole("status")).toHaveTextContent("Loading more...");
      // Existing options stay visible while the next page loads.
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("shows the loading row instead of the empty state on a first page fetch", async () => {
      stubGeometry(1000, 240);
      await openList(<MultiSelect options={[]} hasMore loadingMore />);

      expect(screen.queryByText("No results found")).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("requests the next page when the first page is too short to scroll", async () => {
      // Content fits the viewport, so no scroll event will ever fire — without
      // the fallback, pagination would stall on page 1 forever.
      stubGeometry(120, 240);
      const onScrollEnd = vi.fn();
      await openList(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );
      await flushRemeasure();

      expect(onScrollEnd).toHaveBeenCalledTimes(1);
    });

    it("re-arms after a page lands and pushes the bottom out of reach", async () => {
      // The regression: a fast flick latches at the bottom, the page arrives
      // and grows the list — which emits no scroll event — so the latch has to
      // be cleared by the post-fetch re-measure or pagination stalls forever.
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { rerender } = render(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );

      await act(async () => {
        fireEvent.click(screen.getByRole("combobox"));
      });
      const list = document.querySelector<HTMLDivElement>(
        "[role='listbox'] .overflow-auto"
      )!;

      await scrollTo(list, 760); // flick to the bottom — latches
      expect(onScrollEnd).toHaveBeenCalledTimes(1);

      // Page in flight, then it lands and the list grows by 400px while
      // `scrollTop` stays at 760 — no scroll event is emitted.
      rerender(
        <MultiSelect
          options={defaultOptions}
          hasMore
          loadingMore
          onScrollEnd={onScrollEnd}
        />
      );
      stubGeometry(1400, 240);
      rerender(
        <MultiSelect
          options={[...defaultOptions, { value: "option4", label: "Option 4" }]}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );
      await flushRemeasure();

      // Latch cleared without any user scroll — the next flick paginates.
      expect(onScrollEnd).toHaveBeenCalledTimes(1);
      await scrollTo(list, 1160);
      expect(onScrollEnd).toHaveBeenCalledTimes(2);
    });

    it("chains the next page when a landed page leaves the user at the bottom", async () => {
      // Short page: the list is still pinned to the bottom after the fetch, so
      // the re-measure must keep the chain going rather than clear the latch.
      stubGeometry(1000, 240);
      const onScrollEnd = vi.fn();
      const { rerender } = render(
        <MultiSelect
          options={defaultOptions}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("combobox"));
      });
      const list = document.querySelector<HTMLDivElement>(
        "[role='listbox'] .overflow-auto"
      )!;

      await scrollTo(list, 760);
      expect(onScrollEnd).toHaveBeenCalledTimes(1);

      rerender(
        <MultiSelect
          options={defaultOptions}
          hasMore
          loadingMore
          onScrollEnd={onScrollEnd}
        />
      );
      // Page adds only 20px — still inside the threshold.
      stubGeometry(1020, 240);
      rerender(
        <MultiSelect
          options={[...defaultOptions, { value: "option4", label: "Option 4" }]}
          hasMore
          onScrollEnd={onScrollEnd}
        />
      );
      await flushRemeasure();

      expect(onScrollEnd).toHaveBeenCalledTimes(2);
    });
  });
});

describe("MultiSelect v2 refresh", () => {
  beforeEach(() => {
    forced.placement = null;
  });

  it("keeps the trigger in its open look while the panel is open", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} searchable />);
    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.className).toContain(
      "aria-expanded:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]"
    );
    expect(trigger.className).toContain("aria-expanded:shadow-none");
    expect(trigger.className).toContain(
      "enabled:aria-expanded:hover:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]"
    );

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not paint the open look on an error trigger", () => {
    render(<MultiSelect options={defaultOptions} error="Required" />);
    expect(screen.getByRole("combobox").className).not.toContain(
      "aria-expanded:border-[var(--color-secondary-600"
    );
  });

  it("grows the panel from the top-left and slides down when it opens below", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);
    await user.click(screen.getByRole("combobox"));
    const panel = screen.getByRole("listbox");

    expect(panel).toHaveAttribute("data-side", "bottom");
    expect(panel).toHaveAttribute("data-align", "start");
    expect(panel.style.transformOrigin).toBe("top left");
    expect(panel).toHaveClass("data-[side=bottom]:slide-in-from-top-[6px]");
    expect(panel).not.toHaveClass("origin-top-left");
    // fade/zoom must be motion-safe too: a bare `fade-in-0` is overridden by the
    // motion-safe `animate-in` reset (--tw-enter-* back to initial) and does nothing.
    expect(panel).toHaveClass(
      "motion-safe:animate-in",
      "motion-safe:fade-in-0",
      "motion-safe:zoom-in-[0.97]",
      "motion-safe:[animation-duration:260ms]"
    );
    expect(panel).not.toHaveClass("fade-in-0");
    expect(panel).not.toHaveClass("zoom-in-[0.97]");
    // Arc's floating shadow.
    expect(panel).toHaveClass(
      "shadow-[var(--v2-shadow-popover,0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045))]"
    );
  });

  it.each([
    ["top-start", "top", "start", "bottom left"],
    ["top-end", "top", "end", "bottom right"],
    ["bottom-end", "bottom", "end", "top right"],
  ])(
    "derives the panel origin from the placement actually used (%s)",
    async (placement, side, align, origin) => {
      forced.placement = placement;
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} />);
      await user.click(screen.getByRole("combobox"));
      const panel = screen.getByRole("listbox");

      expect(panel).toHaveAttribute("data-side", side);
      expect(panel).toHaveAttribute("data-align", align);
      expect(panel.style.transformOrigin).toBe(origin);
      // The slide class for each side is present; the data attribute selects it.
      expect(panel).toHaveClass("data-[side=top]:slide-in-from-bottom-[6px]");
    }
  );

  it("gives option rows a 4px radius and a keyboard-only ring", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} />);
    await user.click(screen.getByRole("combobox"));
    const option = screen.getByRole("option", { name: "Option 1" });
    // Rows are real Tab stops, so focus-visible (ring) is distinct from hover (fill).
    expect(option).toHaveClass(
      "rounded-sm",
      "focus-visible:ring-1",
      "focus-visible:ring-inset",
      "focus-visible:ring-[var(--v2-semantic-border-focus,var(--semantic-primary))]"
    );
    expect(option).toHaveClass("hover:bg-v2-semantic-bg-ui");
  });

  it("draws the selected check left to right, with a reduced-motion fade", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} defaultValue={["option2"]} />);
    await user.click(screen.getByRole("combobox"));
    const check = screen
      .getByRole("option", { name: "Option 2" })
      .querySelector("svg");
    const path = check?.querySelector("path");
    expect(path).toHaveAttribute("d", "M4 12.5 9 17.5 20 6.5");
    expect(path).toHaveClass(
      "[stroke-dasharray:1]",
      "[@starting-style]:[stroke-dashoffset:1]",
      "motion-reduce:[@starting-style]:[stroke-dashoffset:0]"
    );
    expect(path?.getAttribute("class")).toContain("stroke-dashoffset_240ms");
    expect(
      screen.getByRole("option", { name: "Option 1" }).querySelector("svg")
    ).toBeNull();
  });

  it("gives the chip remove control a 24px hit area and a neutral hover plate, keeping its label", () => {
    render(
      <MultiSelect options={defaultOptions} value={["option1", "option2"]} />
    );
    const remove = screen.getByLabelText("Remove Option 1");
    // 16px plate (12px icon) + `before:-inset-1` = 24px hit area, layout cancelled by -m-0.5.
    expect(remove).toHaveClass(
      "relative",
      "-m-0.5",
      "p-0.5",
      "before:absolute",
      "before:-inset-1"
    );
    // One step darker than the chip fill (bg-ui would vanish), gated for touch, never red.
    expect(remove).toHaveClass(
      "[@media(hover:hover)]:hover:bg-v2-semantic-bg-grey"
    );
    expect(remove.className).not.toContain("error");
    expect(remove.querySelector("svg")).toHaveClass("size-3");
  });

  it("gives Clear all a 24px neutral hover plate, not a red hover", () => {
    render(<MultiSelect options={defaultOptions} value={["option1"]} />);
    const clear = screen.getByRole("button", { name: "Clear all" });
    // Arc: a 22px plate around a 14px icon that pops in from .6 and dips to .96 on press.
    expect(clear).toHaveClass(
      "size-[22px]",
      "[@media(hover:hover)]:hover:bg-v2-semantic-bg-ui",
      "active:scale-[0.96]",
      "[@starting-style]:scale-[0.6]",
      "[@starting-style]:blur-[2px]"
    );
    expect(clear.className).not.toContain("error");
    // The icon inherits the span colour so hover can darken it.
    expect(clear.querySelector("svg")).toHaveClass("size-3.5");
    expect(clear.querySelector("svg")?.getAttribute("class")).not.toContain(
      "text-["
    );
  });

  it("does not paint hover plates on chips of a disabled field", () => {
    render(
      <MultiSelect options={defaultOptions} value={["option1"]} disabled />
    );
    expect(screen.getByLabelText("Remove Option 1").className).not.toContain(
      "hover:bg-"
    );
    expect(
      screen.getByRole("button", { name: "Clear all" }).className
    ).not.toContain("hover:bg-");
  });

  it("only animates a newly added chip: existing chip nodes survive a re-render", async () => {
    function Controlled() {
      const [value, setValue] = React.useState(["option1"]);
      return (
        <>
          <MultiSelect
            options={defaultOptions}
            value={value}
            onValueChange={setValue}
          />
          <button
            type="button"
            onClick={() => setValue(["option1", "option2"])}
          >
            add
          </button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    const first = screen.getByLabelText("Remove Option 1")
      .parentElement as HTMLElement;
    // Arc: a new chip grows in from .9 through a 4px blur (a transition from @starting-style).
    expect(first).toHaveClass(
      "[@starting-style]:scale-90",
      "[@starting-style]:blur-[4px]",
      "[@starting-style]:opacity-0",
      "motion-reduce:[@starting-style]:scale-100"
    );

    await user.click(screen.getByRole("button", { name: "add" }));
    // Same DOM node: React kept it mounted, so its CSS animation does not restart.
    expect(screen.getByLabelText("Remove Option 1").parentElement).toBe(first);
    expect(screen.getByLabelText("Remove Option 2")).toBeInTheDocument();
  });

  it("sizes the trigger, chips and rows like Arc's multi-select", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={defaultOptions} value={["option1"]} />);
    const trigger = screen.getByRole("combobox");
    // 44px minimum, 5px / 11px / 12px padding, 8px gap, muted tint on hover / press / open.
    expect(trigger).toHaveClass(
      "min-h-11",
      "py-[5px]",
      "pl-3",
      "pr-[11px]",
      "gap-2",
      "[@media(hover:hover)]:enabled:hover:bg-v2-semantic-bg-ui",
      "aria-expanded:bg-v2-semantic-bg-ui",
      "disabled:opacity-50"
    );
    // The chip: 12px regular text, 4px / 8px padding, 1px inset border, 9rem cap; it whitens while the field is hot.
    const chip = screen.getByLabelText("Remove Option 1")
      .parentElement as HTMLElement;
    expect(chip).toHaveClass(
      "text-xs",
      "font-normal",
      "px-2",
      "py-1",
      "max-w-[9rem]",
      "ring-1",
      "ring-inset",
      "group-aria-expanded/ms:bg-v2-semantic-bg-primary"
    );
    expect(chip.parentElement).toHaveClass("gap-x-[5px]", "min-h-[26px]");

    await user.click(trigger);
    const row = screen.getByRole("option", { name: "Option 1" });
    // 38px rows, 11px padding, and a distinct selection without changing weight.
    expect(row).toHaveClass(
      "min-h-[38px]",
      "px-[11px]",
      "[transition-duration:80ms]",
      "bg-v2-semantic-info-surface",
      "hover:bg-v2-semantic-primary-surface"
    );
    expect(row.className).not.toContain("font-medium");
  });
});

// An earlier suite restores every mock, which empties the shared matchMedia stub that
// Tooltip reads; put a desktop-like one back (hover-capable, fine pointer).
const installMatchMedia = (reducedMotion = false) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      query === "(hover: hover)" ||
      query === "(pointer: fine)" ||
      (reducedMotion && query === "(prefers-reduced-motion: reduce)"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as unknown as typeof window.matchMedia;
};

const fiveOptions: MultiSelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
  { value: "d", label: "Date" },
  { value: "e", label: "Elderberry" },
];

describe("MultiSelect keyboard", () => {
  beforeEach(() => {
    installMatchMedia();
    forced.placement = null;
  });
  const openWithArrow = async (
    user: ReturnType<typeof userEvent.setup>,
    key = "{ArrowDown}"
  ) => {
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard(key);
    await screen.findByRole("listbox");
    return trigger;
  };

  it("opens with ArrowDown and lands on the first row", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
  });

  it("lands on the first picked row when there is one", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect label="Fruit" options={fiveOptions} defaultValue={["d"]} />
    );
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Date" })).toHaveFocus()
    );
  });

  it("opens with ArrowUp and lands on the last row", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await openWithArrow(user, "{ArrowUp}");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Elderberry" })).toHaveFocus()
    );
  });

  it("opens with Enter and with Space, and either one closes it again", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    const trigger = await openWithArrow(user, "{Enter}");
    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
    await user.keyboard(" ");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("moves between rows with the arrows, wraps, and skips disabled rows", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Banana" })).toHaveFocus();
    // Cherry is disabled: the next stop is Date.
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Date" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { name: "Banana" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("option", { name: "Elderberry" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { name: "Elderberry" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus();
  });

  it("makes rows roving stops, not Tab stops", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect label="Fruit" options={fiveOptions} selectAllLabel="All" />
    );
    await user.click(screen.getByRole("combobox"));
    for (const option of screen.getAllByRole("option")) {
      expect(option).toHaveAttribute("tabindex", "-1");
    }
  });

  it("toggles the focused row with Enter and with Space, keeping focus on it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        onValueChange={onValueChange}
      />
    );
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
    expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus();
  });

  it("toggles a detailed row from the keyboard too", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        label="Fruit"
        optionVariant="detailed"
        options={fiveOptions}
        onValueChange={onValueChange}
      />
    );
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: /Apple/ })).toHaveFocus()
    );
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
  });

  it("jumps to the row whose label starts with what is typed", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("e");
    expect(screen.getByRole("option", { name: "Elderberry" })).toHaveFocus();
    await user.keyboard("{Home}");
    // Disabled Cherry is not a match; the next "d" is Date.
    await user.keyboard("d");
    expect(screen.getByRole("option", { name: "Date" })).toHaveFocus();
  });

  it("moves from the rows into the search field and sends typing there", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} searchable />);
    await openWithArrow(user);
    const search = screen.getByPlaceholderText("Search...");
    await waitFor(() => expect(search).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(search).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    // Typing on a row goes to the search field instead.
    await user.keyboard("ban");
    expect(search).toHaveFocus();
    expect(search).toHaveValue("ban");
  });

  it("Escape inside the list closes it and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    const trigger = await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("clears the search when Escape closes the list", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} searchable />);
    await openWithArrow(user);
    await user.keyboard("ban");
    await user.keyboard("{Escape}");
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("");
  });

  it("keeps Escape from reaching a surrounding dialog's listener", async () => {
    const user = userEvent.setup();
    const outer = vi.fn();
    document.addEventListener("keydown", outer, true);
    try {
      render(<MultiSelect label="Fruit" options={fiveOptions} />);
      await openWithArrow(user);
      await waitFor(() =>
        expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
      );
      outer.mockClear();
      await user.keyboard("{Escape}");
      expect(outer).not.toHaveBeenCalled();
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    } finally {
      document.removeEventListener("keydown", outer, true);
    }
  });

  it("closes on Tab and puts focus back on the trigger, so the browser's own Tab moves on from there", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    const trigger = await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    // user-event picks Tab's destination from the element that fired it, so fire the
    // key directly and look at where focus is when the handler is done.
    const notPrevented = fireEvent.keyDown(
      screen.getByRole("option", { name: "Apple" }),
      { key: "Tab" }
    );
    expect(notPrevented).toBe(true);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("drops the last pick with Backspace or Delete on the trigger", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
        onValueChange={onValueChange}
      />
    );
    screen.getByRole("combobox").focus();
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
    await user.keyboard("{Delete}");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("ignores every key on a disabled field", async () => {
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a"]}
        onValueChange={onValueChange}
        disabled
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Backspace" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("hands focus back to a row that a re-sort moved", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        separateSelectedWithDivider
      />
    );
    await openWithArrow(user);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("option", { name: "Date" })).toHaveFocus();
    // Picking Date moves it above the divider; focus must stay on it.
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Date" })).toHaveFocus();
  });
});

describe("MultiSelect semantics", () => {
  beforeEach(() => installMatchMedia());
  it("labels the list with the field label, or the placeholder without one", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <MultiSelect label="Fruit" options={fiveOptions} />
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toHaveAccessibleName("Fruit");
    unmount();
    render(<MultiSelect placeholder="Pick fruit" options={fiveOptions} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toHaveAccessibleName("Pick fruit");
  });

  it("keeps chips out of the accessibility tree and reads the picks as the trigger's text", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "d"]}
      />
    );
    const trigger = screen.getByRole("combobox");
    // Nothing reachable inside the trigger: no nested buttons for assistive tech.
    expect(within(trigger).queryAllByRole("button")).toHaveLength(0);
    expect(trigger.querySelector("[aria-hidden='true']")).toHaveTextContent(
      "Apple"
    );
    // The picks are the trigger's own text, the way a select's value is.
    expect(trigger).toHaveTextContent("Selected: Apple, Date");
  });

  it("describes the field by its helper or error only, exactly as v1 did", () => {
    const { rerender } = render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a"]}
        helperText="Pick some"
      />
    );
    const trigger = () => screen.getByRole("combobox");
    expect(trigger()).toHaveAccessibleDescription("Pick some");
    rerender(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a"]}
        error="Required"
      />
    );
    expect(trigger()).toHaveAccessibleDescription("Required");
    rerender(
      <MultiSelect label="Fruit" options={fiveOptions} defaultValue={["a"]} />
    );
    expect(trigger()).not.toHaveAttribute("aria-describedby");
    expect(trigger()).not.toHaveAttribute("aria-labelledby");
  });

  it("places Clear all beside the trigger, as a real button", () => {
    render(
      <MultiSelect options={fiveOptions} label="Fruit" defaultValue={["a"]} />
    );
    const clear = screen.getByRole("button", { name: "Clear all" });
    expect(clear.tagName).toBe("BUTTON");
    expect(clear.closest("[role='combobox']")).toBeNull();
    expect(screen.getByRole("combobox").contains(clear)).toBe(false);
    // It sits clear of a 16px chevron: 36px from the edge, 45px with the separator.
    expect(clear).toHaveClass("right-9");
  });

  it("moves Clear all past the separator when there is one", () => {
    render(
      <MultiSelect
        options={fiveOptions}
        defaultValue={["a"]}
        showSeparatorBeforeChevron
      />
    );
    expect(screen.getByRole("button", { name: "Clear all" })).toHaveClass(
      "right-[45px]"
    );
  });

  it("announces what a pick, a removal and a clear did", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelect label="Fruit" options={fiveOptions} />
    );
    const live = () =>
      container.querySelector("[aria-live='polite']") as HTMLElement;
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(live()).toHaveTextContent("Apple selected. 1 selected.");
    await user.click(screen.getByRole("option", { name: "Banana" }));
    expect(live()).toHaveTextContent("Banana selected. 2 selected.");
    await user.click(screen.getByLabelText("Remove Apple"));
    expect(live()).toHaveTextContent("Apple removed. 1 selected.");
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(live()).toHaveTextContent("Selection cleared.");
  });

  it("keeps the picks aligned with their chips when a picked value has no option yet", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        value={["missing", "b"]}
      />
    );
    expect(screen.getByLabelText("Remove Banana")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Remove missing/)).not.toBeInTheDocument();
  });

  it("opens and closes the helper row without leaving a gap while it is empty", () => {
    const { container, rerender } = render(
      <MultiSelect label="Fruit" options={fiveOptions} />
    );
    const row = () =>
      container.querySelector("[data-field-feedback]") as HTMLElement;
    expect(row()).toHaveClass("-mt-2", "grid-rows-[0fr]");
    rerender(
      <MultiSelect label="Fruit" options={fiveOptions} error="Required" />
    );
    expect(row()).toHaveClass("grid-rows-[1fr]");
    expect(row()).not.toHaveClass("-mt-2");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    rerender(<MultiSelect label="Fruit" options={fiveOptions} />);
    // The text goes at once, so nothing stale is read or found; the row eases shut.
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
    expect(row()).toHaveClass("-mt-2", "grid-rows-[0fr]");
  });
});

describe("MultiSelect maxVisible", () => {
  beforeEach(() => installMatchMedia());
  const four = ["a", "b", "d", "e"];

  it("shows the first chips and counts the rest", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={four}
        maxVisible={2}
      />
    );
    expect(screen.getByLabelText("Remove Apple")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Banana")).toBeInTheDocument();
    expect(screen.queryByLabelText("Remove Date")).not.toBeInTheDocument();
    expect(document.querySelector("[data-overflow-count]")).toHaveTextContent(
      "+2"
    );
  });

  it("stays on one line: no wrapping, chips shrink instead", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={four}
        maxVisible={2}
      />
    );
    const chip = screen.getByLabelText("Remove Apple")
      .parentElement as HTMLElement;
    expect(chip).toHaveClass("shrink");
    expect(chip.parentElement).toHaveClass("flex-nowrap", "overflow-hidden");
    expect(chip.parentElement).not.toHaveClass("flex-wrap");
    expect(document.querySelector("[data-overflow-count]")).toHaveClass(
      "shrink-0",
      "tabular-nums"
    );
  });

  it("shows no count when everything fits, and wraps without the prop", () => {
    const { rerender } = render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
        maxVisible={2}
      />
    );
    expect(document.querySelector("[data-overflow-count]")).toBeNull();
    rerender(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
      />
    );
    const chip = screen.getByLabelText("Remove Apple")
      .parentElement as HTMLElement;
    expect(chip.parentElement).toHaveClass("flex-wrap");
    expect(document.querySelector("[data-overflow-count]")).toBeNull();
  });

  it("pulls the next chip in when a visible one is removed, and lowers the count", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={four}
        maxVisible={2}
      />
    );
    await user.click(screen.getByLabelText("Remove Apple"));
    expect(screen.queryByLabelText("Remove Apple")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Remove Date")).toBeInTheDocument();
    expect(document.querySelector("[data-overflow-count]")).toHaveTextContent(
      "+1"
    );
  });

  it("names the hidden picks in the sr-only list too", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={four}
        maxVisible={2}
      />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Selected: Apple, Banana, Date, Elderberry"
    );
  });

  it("lets summaryLabel win over the chip limit", () => {
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={four}
        maxVisible={2}
        summaryLabel={(count) => `${count} picked`}
      />
    );
    expect(screen.getByText("4 picked")).toBeInTheDocument();
    expect(document.querySelector("[data-overflow-count]")).toBeNull();
  });
});

describe("MultiSelect exit motion", () => {
  interface FakeAnimation {
    cancel: ReturnType<typeof vi.fn>;
    onfinish: null | (() => void);
    oncancel: null | (() => void);
    keyframes: Keyframe[];
  }
  const animations: FakeAnimation[] = [];
  const realAnimate = Element.prototype.animate;
  const realMatchMedia = window.matchMedia;

  const installAnimate = () => {
    Element.prototype.animate = function (keyframes: unknown) {
      const animation: FakeAnimation = {
        cancel: vi.fn(),
        onfinish: null,
        oncancel: null,
        keyframes: keyframes as Keyframe[],
      };
      animations.push(animation);
      return animation as unknown as Animation;
    } as unknown as typeof Element.prototype.animate;
  };

  beforeEach(() => {
    installMatchMedia();
    forced.placement = null;
    animations.length = 0;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 80,
      height: 26,
      top: 0,
      left: 0,
      right: 80,
      bottom: 26,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  });
  afterEach(() => {
    Element.prototype.animate = realAnimate;
    window.matchMedia = realMatchMedia;
    vi.restoreAllMocks();
    // A copy left by a failed assertion must not leak into the next test.
    document.querySelectorAll("[inert]").forEach((node) => node.remove());
  });

  it("holds a hollow copy of a removed chip while it closes, then lets go", async () => {
    installAnimate();
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
      />
    );
    await user.click(screen.getByLabelText("Remove Apple"));
    // The real chip is gone at once; only the aria-hidden copy lingers.
    expect(screen.queryByLabelText("Remove Apple")).not.toBeInTheDocument();
    const ghost = document.querySelector("[data-chip-ghost]") as HTMLElement;
    expect(ghost).toHaveAttribute("aria-hidden", "true");
    expect(ghost).toHaveTextContent("Apple");
    expect(ghost.style.width).toBe("80px");
    expect(animations).toHaveLength(1);
    const [from, to] = animations[0].keyframes as Record<string, string>[];
    expect(from).toMatchObject({ width: "80px", opacity: 1 });
    expect(to).toMatchObject({ width: "0px", opacity: 0 });
    // It sits where the chip was: before Banana.
    expect(ghost.nextElementSibling).toBe(
      screen.getByLabelText("Remove Banana").parentElement
    );

    act(() => animations[0].onfinish?.());
    expect(document.querySelector("[data-chip-ghost]")).toBeNull();
  });

  it("holds the placeholder back until the last chips have closed", async () => {
    installAnimate();
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        placeholder="Pick fruit"
        defaultValue={["a"]}
      />
    );
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.queryByText("Pick fruit")).not.toBeInTheDocument();
    act(() => animations[0].onfinish?.());
    expect(screen.getByText("Pick fruit")).toBeInTheDocument();
  });

  it("gives no copy to a chip that was never on screen or under reduced motion", async () => {
    installAnimate();
    installMatchMedia(true);
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
      />
    );
    await user.click(screen.getByLabelText("Remove Apple"));
    expect(document.querySelector("[data-chip-ghost]")).toBeNull();
  });

  it("does not hold a copy of a chip that jsdom could not measure", async () => {
    installAnimate();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 0,
    } as DOMRect);
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Fruit"
        options={fiveOptions}
        defaultValue={["a", "b"]}
      />
    );
    await user.click(screen.getByLabelText("Remove Apple"));
    expect(document.querySelector("[data-chip-ghost]")).toBeNull();
  });

  it("leaves a fading, inert copy of the list behind when it closes", async () => {
    installAnimate();
    const user = userEvent.setup();
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await user.click(screen.getByRole("combobox"));
    // floating-ui may have flipped the panel; the copy drifts back toward the trigger.
    const side = screen.getByRole("listbox").getAttribute("data-side");
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const copy = document.querySelector("[inert]") as HTMLElement;
    expect(copy).not.toBeNull();
    expect(copy).toHaveAttribute("aria-hidden", "true");
    expect(copy).not.toHaveAttribute("role");
    expect(copy.querySelectorAll("[id]")).toHaveLength(0);
    expect(copy.style.pointerEvents).toBe("none");
    // Its own entry animation is switched off, so it does not fade in while leaving.
    expect(copy.style.getPropertyValue("animation")).toBe("none");
    expect(copy.style.getPropertyPriority("animation")).toBe("important");
    const [from, to] = animations.at(-1)!.keyframes as Record<string, string>[];
    expect(from).toMatchObject({ opacity: 1 });
    expect(to).toMatchObject({ opacity: 0 });
    expect(to.transform).toContain(
      side === "top" ? "translateY(4px)" : "translateY(-4px)"
    );

    act(() => animations.at(-1)!.onfinish?.());
    expect(document.querySelector("[inert]")).toBeNull();
  });

  it("leaves no copy without the Web Animations API or with reduced motion", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <MultiSelect label="Fruit" options={fiveOptions} />
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("combobox"));
    expect(document.querySelector("[inert]")).toBeNull();
    unmount();

    installAnimate();
    installMatchMedia(true);
    render(<MultiSelect label="Fruit" options={fiveOptions} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("combobox"));
    expect(document.querySelector("[inert]")).toBeNull();
  });
});

describe("MultiSelect in a dialog", () => {
  beforeEach(() => installMatchMedia());
  it("closes the list on Escape without closing the dialog", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ModalRoot open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Pick</ModalTitle>
          <MultiSelect label="Fruit" options={fiveOptions} />
        </ModalContent>
      </ModalRoot>
    );
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    );
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });
});
