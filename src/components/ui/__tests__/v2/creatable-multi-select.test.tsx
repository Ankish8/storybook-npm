import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CreatableMultiSelect,
  type CreatableMultiSelectOption,
} from "../../v2/creatable-multi-select";

function ControlledCreatableMultiSelect({
  initialValue = [] as string[],
  onValueChange,
  ...props
}: React.ComponentProps<typeof CreatableMultiSelect> & {
  initialValue?: string[];
}) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <CreatableMultiSelect
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

const OPTIONS = [
  { value: "Alpha", label: "Alpha" },
  { value: "Beta", label: "Beta" },
];

describe("CreatableMultiSelect", () => {
  it("selects a preset through keyboard activation of its option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ControlledCreatableMultiSelect
        options={OPTIONS}
        onValueChange={onValueChange}
        aria-label="Tones"
      />
    );
    await user.click(screen.getByRole("combobox", { name: "Tones" }));
    // Wait for the opening frame to focus the search input before tabbing to
    // the first option; otherwise that frame can steal focus during Enter.
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Tones" })).toHaveFocus()
    );
    await user.tab();
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(["Alpha"]);
    expect(
      screen.getByRole("button", { name: "Remove Alpha" })
    ).toBeInTheDocument();
  });

  it("disables an open field and preset options when disabled changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <CreatableMultiSelect
        options={OPTIONS}
        onValueChange={onValueChange}
        aria-label="Tones"
      />
    );
    await user.click(screen.getByRole("combobox", { name: "Tones" }));
    rerender(
      <CreatableMultiSelect
        options={OPTIONS}
        onValueChange={onValueChange}
        aria-label="Tones"
        disabled
      />
    );
    expect(screen.getByRole("combobox", { name: "Tones" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Alpha" })).toBeDisabled();
    await user.click(screen.getByRole("option", { name: "Alpha" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("links the host label and its own closed helper to the inner trigger", () => {
    render(
      <>
        <p id="tones-label">Tones</p>
        <CreatableMultiSelect
          options={OPTIONS}
          aria-labelledby="tones-label"
          helperText="Choose a tone"
        />
      </>
    );
    expect(
      screen.getByRole("combobox", { name: "Tones" })
    ).toHaveAccessibleDescription("Choose a tone");
  });

  it("renders with placeholder when no values", () => {
    render(<CreatableMultiSelect options={OPTIONS} placeholder="Pick items" />);
    expect(screen.getByText("Pick items")).toBeInTheDocument();
  });

  it("renders selected values as removable chips when closed", () => {
    render(
      <CreatableMultiSelect options={OPTIONS} value={["Alpha", "Beta"]} />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Alpha" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Beta" })
    ).toBeInTheDocument();
  });

  it("calls onValueChange when removing last item with Backspace on empty input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        value={["Alpha", "Beta"]}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenCalledWith(["Alpha"]);
  });

  it("renders without options (empty list)", () => {
    render(<CreatableMultiSelect placeholder="Pick items" />);
    expect(screen.getByText("Pick items")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CreatableMultiSelect options={OPTIONS} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<CreatableMultiSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders helper text when provided", () => {
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        helperText="Select at least one"
      />
    );
    expect(screen.getByText("Select at least one")).toBeInTheDocument();
  });

  it("shows max-selections when presets match and the Create row plus Enter affordance when typing a non-matching value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        placeholder="Pick items"
        createHintText="Type to create a custom tone"
        maxItems={5}
        maxLengthPerItem={20}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    await user.type(input, "angry");
    expect(
      screen.getByText("Type to create a custom tone")
    ).toBeInTheDocument();
    expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    expect(screen.getByText("Enter ↵")).toBeInTheDocument();
    expect(screen.getByText("Create “angry”")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(["angry"]);
  });

  it("keeps long preset option values when maxLength and sanitizeInput are set and hides them from the dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      { value: "Friendly", label: "Friendly" },
      {
        value: "Soft-spoken and comforting",
        label: "Soft-spoken and comforting",
      },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        maxLengthPerItem={20}
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: /Soft-spoken/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /Soft-spoken/i }));
    expect(onChange).toHaveBeenCalledWith(["Soft-spoken and comforting"]);
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: /Soft-spoken/i })
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("Soft-spoken and comforting")).toBeInTheDocument();
  });

  it("hides presets when a legacy truncated value is already selected", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      {
        value: "Soft-spoken and comforting",
        label: "Soft-spoken and comforting",
      },
    ];
    render(
      <CreatableMultiSelect
        options={options}
        value={["Soft-spoken and comf"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        maxLengthPerItem={20}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.queryByRole("option", { name: /Soft-spoken/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Soft-spoken and comforting")).toBeInTheDocument();
  });

  it("hides presets when a legacy sanitized value is already selected", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options = [
      { value: "Friendly", label: "Friendly" },
      { value: "Soft-spoken", label: "Soft-spoken" },
    ];
    render(
      <CreatableMultiSelect
        options={options}
        value={["Softspoken"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
      />
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.queryByRole("option", { name: /Soft-spoken/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Soft-spoken")).toBeInTheDocument();
  });

  it("shows preset again after removing a sanitized legacy selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const options: CreatableMultiSelectOption[] = [
      { value: "Soft-spoken", label: "Soft-spoken" },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        initialValue={["Softspoken"]}
        placeholder="Pick tones"
        sanitizeInput={sanitize}
        onValueChange={onChange}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Remove Soft-spoken" })
    );
    expect(onChange).toHaveBeenCalledWith([]);
    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Soft-spoken/i })
      ).toBeInTheDocument();
    });
  });

  it("keeps dropdown open while selecting and closes when maxItems is reached", async () => {
    const user = userEvent.setup();
    const options: CreatableMultiSelectOption[] = [
      { value: "Alpha", label: "Alpha" },
      { value: "Beta", label: "Beta" },
      { value: "Gamma", label: "Gamma" },
    ];
    render(
      <ControlledCreatableMultiSelect
        options={options}
        maxItems={2}
        placeholder="Pick items"
      />
    );
    await user.click(screen.getByRole("combobox", { expanded: false }));
    expect(
      screen.getByRole("combobox", { expanded: true })
    ).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: /Alpha/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { expanded: true })
      ).toBeInTheDocument();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: /Alpha/i })
      ).not.toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Beta/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("option", { name: /Beta/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { expanded: false })
      ).toBeInTheDocument();
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("keeps dropdown panel visible when all presets are selected but below maxItems", async () => {
    const user = userEvent.setup();
    render(
      <ControlledCreatableMultiSelect
        options={OPTIONS}
        maxItems={5}
        createHintText="Type to create a custom tone"
        placeholder="Pick items"
      />
    );
    await user.click(screen.getByRole("combobox", { expanded: false }));
    await user.click(screen.getByRole("option", { name: /Alpha/i }));
    await user.click(screen.getByRole("option", { name: /Beta/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { expanded: true })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Type to create a custom tone")
      ).toBeInTheDocument();
      expect(screen.getByText("Max selections allowed: 5")).toBeInTheDocument();
    });
  });

  it("sanitizes typed input and notifies invalid vs valid input", async () => {
    const user = userEvent.setup();
    const onInvalid = vi.fn();
    const onValid = vi.fn();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        placeholder="Pick items"
        sanitizeInput={sanitize}
        onInvalidCharacters={onInvalid}
        onValidInput={onValid}
        maxLengthPerItem={20}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox");
    await user.type(input, "a@");
    expect(onInvalid).toHaveBeenCalled();
    await user.type(input, "b");
    expect(onValid).toHaveBeenCalled();
  });

  it("keeps the cursor in place when normalizeInput rejects a second space", async () => {
    const user = userEvent.setup();
    const sanitize = (raw: string) => raw.replace(/[^A-Za-z ]/g, "");
    const normalize = (s: string) => s.replace(/ +/g, " ").replace(/^\s+/, "");
    render(
      <CreatableMultiSelect
        options={OPTIONS}
        placeholder="Pick items"
        sanitizeInput={sanitize}
        normalizeInput={normalize}
        maxLengthPerItem={20}
      />
    );
    await user.click(screen.getByRole("combobox"));
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(input, "Friendly tone");
    input.setSelectionRange(9, 9);
    await user.keyboard(" ");

    expect(input.value).toBe("Friendly tone");
    await waitFor(() => {
      expect(input.selectionStart).toBe(9);
      expect(input.selectionEnd).toBe(9);
    });
  });
});

describe("CreatableMultiSelect v2 refresh", () => {
  it("marks the open field so it keeps the focused look while the panel is open", async () => {
    const user = userEvent.setup();
    render(<CreatableMultiSelect options={OPTIONS} />);
    await user.click(screen.getByRole("combobox"));

    const field = screen.getByRole("combobox").parentElement?.parentElement;
    expect(field).toHaveAttribute("data-state", "open");
    expect(field?.className).toContain(
      "data-[state=open]:border-semantic-primary"
    );
  });

  it.each(["closed", "open"] as const)(
    "gives the chip remove control a 24px hit area and a visible neutral plate (%s field)",
    async (mode) => {
      const user = userEvent.setup();
      render(
        <CreatableMultiSelect options={OPTIONS} value={["Alpha", "Beta"]} />
      );
      if (mode === "open") await user.click(screen.getAllByRole("combobox")[0]);

      const remove = screen.getByRole("button", { name: "Remove Alpha" });
      // Arc's 22px circle with a 24px hit area from the invisible ::before.
      expect(remove).toHaveClass(
        "relative",
        "size-[22px]",
        "before:absolute",
        "before:-inset-px"
      );
      // bg-semantic-bg-ui and bg-semantic-bg-hover are #F5F5F5, the chip fill: invisible.
      expect(remove).toHaveClass(
        "[@media(hover:hover)]:hover:bg-semantic-bg-grey"
      );
      expect(remove.className).not.toContain("hover:bg-semantic-bg-hover");
      expect(remove.querySelector("svg")).toHaveClass("size-3.5");
    }
  );

  it("does not paint a hover plate on a disabled field", () => {
    render(
      <CreatableMultiSelect options={OPTIONS} value={["Alpha"]} disabled />
    );
    expect(
      screen.getByRole("button", { name: "Remove Alpha" }).className
    ).not.toContain("hover:bg-");
  });

  it("keeps the CSS-anchored panel growing from the top edge, 8px below the field (it cannot flip)", async () => {
    const user = userEvent.setup();
    render(<CreatableMultiSelect options={OPTIONS} createHintText="Hint" />);
    await user.click(screen.getByRole("combobox"));
    const panel = screen.getByText("Hint").closest(".absolute");
    expect(panel).toHaveClass(
      "origin-top",
      "mt-2",
      "motion-safe:slide-in-from-top-[6px]",
      "motion-safe:fade-in-0",
      "motion-safe:zoom-in-[0.97]",
      "motion-safe:[animation-duration:260ms]"
    );
  });

  it("sizes the shell, chips and suggestions like Arc's tag input", async () => {
    const user = userEvent.setup();
    render(<CreatableMultiSelect options={OPTIONS} value={["Alpha"]} />);
    const closed = screen.getByRole("combobox");
    // 7px padding around 28px chips makes one row exactly the 44px minimum.
    expect(closed).toHaveClass("min-h-11", "p-[7px]", "gap-2");
    const chip = screen.getByRole("button", { name: "Remove Alpha" })
      .parentElement as HTMLElement;
    expect(chip).toHaveClass(
      "min-h-7",
      "border",
      "pl-[9px]",
      "pr-1",
      "gap-[3px]",
      "font-normal",
      "[@starting-style]:scale-90",
      "[@starting-style]:blur-[4px]"
    );
    expect(chip.className).not.toContain("font-medium");

    await user.click(closed);
    const input = screen.getByRole("combobox", { name: "Enter or select" });
    expect(input).toHaveClass("min-h-7", "min-w-[80px]", "px-[5px]");
    // Suggestions follow Arc's chip group: 36px pills that dip to .97 on press.
    const preset = screen.getByRole("option", { name: /Beta/ });
    expect(preset).toHaveClass(
      "h-9",
      "px-[14px]",
      "font-medium",
      "border",
      "active:scale-[0.97]"
    );
  });
});

describe("CreatableMultiSelect polish", () => {
  const TONES = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "sarcastic", label: "Sarcastic", disabled: true },
  ];

  it("centres the placeholder and the summary in the field with a chip-height wrapper", () => {
    const { rerender } = render(
      <CreatableMultiSelect options={TONES} placeholder="Pick tones" />
    );
    const wrapper = screen.getByText("Pick tones").parentElement;
    expect(wrapper).toHaveClass("flex", "min-h-7", "items-center", "flex-1");

    rerender(
      <CreatableMultiSelect
        options={TONES}
        value={["friendly"]}
        triggerDisplay="summary"
      />
    );
    expect(screen.getByText("Friendly").parentElement).toHaveClass(
      "min-h-7",
      "items-center"
    );
  });

  it("keeps the placeholder visible in the open input until something is selected", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CreatableMultiSelect options={TONES} placeholder="Pick tones" />
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "placeholder",
      "Pick tones"
    );

    rerender(
      <CreatableMultiSelect
        options={TONES}
        placeholder="Pick tones"
        value={["friendly"]}
      />
    );
    expect(screen.getByRole("combobox")).not.toHaveAttribute("placeholder");
  });

  it("keeps the field white while hovered, pressed and open so chips never sit on their own colour", async () => {
    const user = userEvent.setup();
    render(<CreatableMultiSelect options={TONES} value={["friendly"]} />);
    const closed = screen.getByRole("combobox");
    expect(closed).not.toHaveClass(
      "[@media(hover:hover)]:hover:bg-semantic-bg-ui"
    );
    expect(closed).not.toHaveClass("active:bg-semantic-bg-ui");

    await user.click(closed);
    const open = screen
      .getAllByRole("combobox")[0]
      .closest("[data-state=open]");
    expect(open).toHaveClass("data-[state=open]:bg-semantic-bg-primary");
    expect(open).not.toHaveClass("data-[state=open]:bg-semantic-bg-ui");
  });

  it("fills chips white on a disabled (grey) field so they stay visible", () => {
    render(
      <CreatableMultiSelect options={TONES} value={["friendly"]} disabled />
    );
    const chip = screen.getByRole("button", { name: "Remove Friendly" })
      .parentElement as HTMLElement;
    expect(chip).toHaveClass("bg-semantic-bg-primary");
    expect(chip).not.toHaveClass("bg-semantic-bg-ui");
  });

  it("uses one 8px family of corners: suggestions, panel and Create row match the chips", async () => {
    const user = userEvent.setup();
    render(
      <CreatableMultiSelect
        options={TONES}
        value={["professional"]}
        createHintText="Hint"
      />
    );
    await user.click(screen.getAllByRole("combobox")[0]);
    await user.type(screen.getAllByRole("combobox")[0], "Zen");

    const chip = screen.getByRole("button", { name: "Remove Professional" });
    expect(chip.parentElement).toHaveClass("rounded-lg");
    // The remove plate nests inside the chip's 8px corner, so it is one step smaller.
    expect(chip).toHaveClass("rounded-md");
    expect(screen.getByText("Hint").closest(".absolute")).toHaveClass(
      "rounded-lg"
    );
    expect(screen.getByRole("option", { name: "Create “Zen”" })).toHaveClass(
      "rounded-lg"
    );
    expect(screen.queryByRole("option", { name: /Friendly/ })).toBeNull();
  });

  it("gives suggestions the same 8px corner as the chips", async () => {
    const user = userEvent.setup();
    render(<CreatableMultiSelect options={TONES} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: /Friendly/ })).toHaveClass(
      "rounded-lg"
    );
    expect(screen.getByRole("option", { name: /Friendly/ })).not.toHaveClass(
      "rounded"
    );
  });

  describe("typing a suggestion's name", () => {
    it.each(["Friendly", "friendly", "  FRIENDLY  "])(
      "selects the suggestion for %j instead of creating a look-alike",
      async (typed) => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
          <ControlledCreatableMultiSelect
            options={TONES}
            onValueChange={onValueChange}
          />
        );
        await user.click(screen.getByRole("combobox"));
        await user.type(screen.getByRole("combobox"), `${typed}{Enter}`);
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange).toHaveBeenCalledWith(["friendly"]);
      }
    );

    it("does not add a second chip when the suggestion is already selected", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledCreatableMultiSelect
          options={TONES}
          initialValue={["friendly"]}
          onValueChange={onValueChange}
        />
      );
      await user.click(screen.getAllByRole("combobox")[0]);
      await user.type(screen.getAllByRole("combobox")[0], "Friendly{Enter}");
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getAllByRole("button", { name: /Remove/ })).toHaveLength(1);
    });

    it("does not offer Create for a suggestion's name or stored value", async () => {
      const user = userEvent.setup();
      render(
        <CreatableMultiSelect
          options={[{ value: "tone_pro", label: "Professional" }]}
        />
      );
      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "tone_pro");
      expect(screen.queryByText(/Create/)).toBeNull();
    });

    it("cannot create a disabled option by typing its name", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledCreatableMultiSelect
          options={TONES}
          onValueChange={onValueChange}
        />
      );
      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "sarcastic{Enter}");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("still creates a genuinely new value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledCreatableMultiSelect
          options={TONES}
          onValueChange={onValueChange}
        />
      );
      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "Warm{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(["Warm"]);
    });
  });

  describe("character limit", () => {
    it("caps the draft and shows the counter, which flags when the limit is reached", async () => {
      const user = userEvent.setup();
      render(<CreatableMultiSelect maxLengthPerItem={5} aria-label="Tags" />);
      await user.click(screen.getByRole("combobox"));
      const input = screen.getByRole("combobox");

      await user.type(input, "abcd");
      expect(input).toHaveValue("abcd");
      expect(screen.getByText("4/5")).not.toHaveAttribute("data-at-limit");
      expect(screen.getByText("4/5")).not.toHaveClass(
        "text-semantic-error-text"
      );

      await user.type(input, "efgh");
      expect(input).toHaveValue("abcde");
      const counter = screen.getByText("5/5");
      expect(counter).toHaveAttribute("data-at-limit", "true");
      expect(counter).toHaveClass("text-semantic-error-text");
    });

    it("creates a value no longer than the limit", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledCreatableMultiSelect
          maxLengthPerItem={5}
          onValueChange={onValueChange}
          aria-label="Tags"
        />
      );
      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "abcdefghij{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(["abcde"]);
    });
  });
});
