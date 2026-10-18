import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneInput } from "../../v2/phone-input";
import { Modal } from "../../v2/modal";

describe("PhoneInput", () => {
  it("activates the country chooser with the keyboard without submitting a form", async () => {
    const user = userEvent.setup();
    const onCountryClick = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PhoneInput onCountryClick={onCountryClick} />
      </form>
    );
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Select country (IN +91)" })
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onCountryClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("prevents country chooser activation when the phone field is disabled", async () => {
    const user = userEvent.setup();
    const onCountryClick = vi.fn();
    render(<PhoneInput disabled onCountryClick={onCountryClick} />);
    const country = screen.getByRole("button", {
      name: "Select country (IN +91)",
    });
    expect(country).toBeDisabled();
    await user.click(country);
    expect(onCountryClick).not.toHaveBeenCalled();
  });

  it("renders the default IN svg flag and code", () => {
    render(<PhoneInput />);
    const flag = screen.getByLabelText("IN");
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute("src", expect.stringContaining("in.svg"));
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("renders the svg flag for a custom countryIso and countryCode", () => {
    render(<PhoneInput countryIso="US" countryCode="+1" />);
    const flag = screen.getByLabelText("US");
    expect(flag).toHaveAttribute("src", expect.stringContaining("us.svg"));
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders a custom countryFlag node instead of the svg flag", () => {
    render(<PhoneInput countryFlag={<span>🇺🇸</span>} countryCode="+1" />);
    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
    expect(screen.queryByLabelText("IN")).not.toBeInTheDocument();
  });

  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("tel");
  });

  it("fires onChange handler", () => {
    const handleChange = vi.fn();
    render(<PhoneInput onChange={handleChange} data-testid="phone" />);
    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "9876543210" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("removes alphabetic and special characters before change handlers receive the value", () => {
    const changedValues: string[] = [];
    const handleChange = vi.fn((event) => {
      changedValues.push(event.currentTarget.value);
    });
    render(<PhoneInput onChange={handleChange} data-testid="phone" />);

    const input = screen.getByTestId("phone");
    fireEvent.change(input, {
      target: { value: "98abc76-54 3210" },
    });

    expect(input).toHaveValue("9876543210");
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(changedValues).toEqual(["9876543210"]);
  });

  it("limits sanitized phone numbers with phoneMaxNumber", () => {
    const changedValues: string[] = [];
    const handleChange = vi.fn((event) => {
      changedValues.push(event.currentTarget.value);
    });
    render(
      <PhoneInput
        phoneMaxNumber={5}
        onChange={handleChange}
        data-testid="phone"
      />
    );

    const input = screen.getByTestId("phone");
    fireEvent.change(input, {
      target: { value: "98abc76543210" },
    });

    expect(input).toHaveValue("98765");
    expect(input).toHaveAttribute("maxLength", "5");
    expect(changedValues).toEqual(["98765"]);
  });

  it("blocks non-digit key entry", () => {
    render(<PhoneInput data-testid="phone" />);

    const input = screen.getByTestId("phone");
    expect(fireEvent.keyDown(input, { key: "a" })).toBe(false);
    expect(fireEvent.keyDown(input, { key: "-" })).toBe(false);
    expect(fireEvent.keyDown(input, { key: "1" })).toBe(true);
    expect(fireEvent.keyDown(input, { key: "Backspace" })).toBe(true);
  });

  it("fires onCountryClick when clicking country area", () => {
    const handleCountryClick = vi.fn();
    render(<PhoneInput onCountryClick={handleCountryClick} />);
    fireEvent.click(screen.getByTestId("phone-input-country"));
    expect(handleCountryClick).toHaveBeenCalledTimes(1);
  });

  it("uses a solid grey surface when disabled", () => {
    render(<PhoneInput disabled data-testid="phone" />);
    const wrapper = screen
      .getByTestId("phone")
      .closest("div[class*='flex items-center border']");
    expect(wrapper).toHaveClass("bg-v2-semantic-bg-ui");
  });

  it("applies empty state classes", () => {
    render(<PhoneInput state="empty" data-testid="phone" />);
    const wrapper = screen
      .getByTestId("phone")
      .closest("div[class*='flex items-center border']");

    expect(wrapper).toHaveClass("border-v2-semantic-border-input");
    expect(screen.getByTestId("phone")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("applies error state classes", () => {
    render(<PhoneInput state="error" data-testid="phone" />);
    const wrapper = screen
      .getByTestId("phone")
      .closest("div[class*='flex items-center border']");

    expect(wrapper).toHaveClass("border-v2-semantic-error-primary");
    expect(screen.getByTestId("phone")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders validation message and connects it to the input", () => {
    render(
      <PhoneInput validation="Enter a valid phone number" data-testid="phone" />
    );

    const input = screen.getByTestId("phone");
    const validationMessage = screen.getByText("Enter a valid phone number");
    const wrapper = input.closest("div[class*='flex items-center border']");

    expect(wrapper).toHaveClass("border-v2-semantic-error-primary");
    expect(validationMessage).toHaveClass("m-0", "text-v2-semantic-error-text");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", validationMessage.id);
  });

  it("disables the input when disabled prop is set", () => {
    render(<PhoneInput disabled data-testid="phone" />);
    expect(screen.getByTestId("phone")).toBeDisabled();
  });

  it("applies wrapperClassName to the outer wrapper", () => {
    render(
      <PhoneInput wrapperClassName="custom-wrapper" data-testid="phone" />
    );
    // The immediate parent is the wrapper with flex items-center
    const outerWrapper = screen.getByTestId(
      "phone-input-country"
    ).parentElement;
    expect(outerWrapper).toHaveClass("custom-wrapper");
  });

  it("applies className to the input element", () => {
    render(<PhoneInput className="custom-input" data-testid="phone" />);
    expect(screen.getByTestId("phone")).toHaveClass("custom-input");
  });

  it("spreads data-testid to the input", () => {
    render(<PhoneInput data-testid="my-phone-input" />);
    const input = screen.getByTestId("my-phone-input");
    expect(input.tagName).toBe("INPUT");
  });

  it("hides chevron when showChevron is false", () => {
    const { container } = render(<PhoneInput showChevron={false} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });

  it("shows chevron by default", () => {
    const { container } = render(<PhoneInput />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<PhoneInput placeholder="Enter phone number" />);
    expect(
      screen.getByPlaceholderText("Enter phone number")
    ).toBeInTheDocument();
  });

  it("always sets type to tel", () => {
    render(<PhoneInput data-testid="phone" />);
    expect(screen.getByTestId("phone")).toHaveAttribute("type", "tel");
  });

  it("sets numeric input hints by default", () => {
    render(<PhoneInput data-testid="phone" />);
    const input = screen.getByTestId("phone");

    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("pattern", "[0-9]*");
  });

  it("renders with controlled value", () => {
    render(
      <PhoneInput value="9876543210" onChange={() => {}} data-testid="phone" />
    );
    expect(screen.getByTestId("phone")).toHaveValue("9876543210");
  });
});

describe("PhoneInput formatted paste", () => {
  it("sanitizes national digits before the browser character limit and calls the original change handler once", () => {
    const changes: string[] = [];
    const paste = vi.fn();
    render(
      <PhoneInput
        aria-label="Phone"
        phoneMaxNumber={10}
        onPaste={paste}
        onChange={(event) => changes.push(event.currentTarget.value)}
      />
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.paste(input, { clipboardData: { getData: () => "98765 43210" } });
    expect(input).toHaveValue("9876543210");
    expect(paste).toHaveBeenCalledOnce();
    expect(changes).toEqual(["9876543210"]);
    expect(input.selectionStart).toBe(10);
  });

  it("replaces only the selection and preserves the suffix when the digit limit is reached", () => {
    render(<PhoneInput defaultValue="1234567890" phoneMaxNumber={10} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    input.setSelectionRange(2, 5);
    fireEvent.paste(input, { clipboardData: { getData: () => "98 76" } });
    expect(input).toHaveValue("1298767890");
    expect(input.selectionStart).toBe(5);
  });

  it("works with controlled values and preserves input-event callbacks", () => {
    const inputEvent = vi.fn();
    function Controlled() {
      const [value, setValue] = React.useState("");
      return (
        <PhoneInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onInput={inputEvent}
        />
      );
    }
    render(<Controlled />);
    fireEvent.paste(screen.getByRole("textbox"), {
      clipboardData: { getData: () => "98-765" },
    });
    expect(screen.getByRole("textbox")).toHaveValue("98765");
    expect(inputEvent).toHaveBeenCalledOnce();
  });

  it("honors a consumer that cancels paste, readOnly and nonnumeric clipboard contents", () => {
    const { rerender } = render(
      <PhoneInput
        defaultValue="12"
        onPaste={(event) => event.preventDefault()}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.paste(input, { clipboardData: { getData: () => "345" } });
    expect(input).toHaveValue("12");
    rerender(<PhoneInput defaultValue="12" readOnly />);
    fireEvent.paste(input, { clipboardData: { getData: () => "345" } });
    expect(input).toHaveValue("12");
    rerender(<PhoneInput defaultValue="12" />);
    fireEvent.paste(input, { clipboardData: { getData: () => "hello" } });
    expect(input).toHaveValue("12");
  });

  it("applies the error border for a native aria-invalid value", () => {
    render(<PhoneInput aria-invalid="true" />);
    expect(screen.getByRole("textbox").parentElement).toHaveClass(
      "border-v2-semantic-error-primary"
    );
  });

  it("does not truncate an international calling code into the national value", () => {
    const change = vi.fn();
    render(
      <PhoneInput defaultValue="123" phoneMaxNumber={10} onChange={change} />
    );
    fireEvent.paste(screen.getByRole("textbox"), {
      clipboardData: { getData: () => "+91 98765 43210" },
    });
    expect(screen.getByRole("textbox")).toHaveValue("123");
    expect(change).not.toHaveBeenCalled();
  });

  it("runs a cancellable before-input transaction before mutating a pasted value", () => {
    const change = vi.fn();
    render(<PhoneInput defaultValue="12" onChange={change} />);
    const input = screen.getByRole("textbox");
    const beforeInput = vi.fn((event: Event) => event.preventDefault());
    input.addEventListener("textInput", beforeInput);
    fireEvent.paste(input, { clipboardData: { getData: () => "34 56" } });
    expect(beforeInput).toHaveBeenCalledOnce();
    expect((beforeInput.mock.calls[0][0] as InputEvent).data).toBe("3456");
    expect(input).toHaveValue("12");
    expect(change).not.toHaveBeenCalled();
  });

  it("respects forwarded-ref native beforeinput cancellation before React's compatibility event", () => {
    const change = vi.fn();
    const ref = React.createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} defaultValue="12" onChange={change} />);
    const reactGate = vi.fn();
    ref.current!.addEventListener("textInput", reactGate);
    ref.current!.addEventListener("beforeinput", (event) =>
      event.preventDefault()
    );
    fireEvent.paste(ref.current!, {
      clipboardData: { getData: () => "34 56" },
    });
    expect(ref.current).toHaveValue("12");
    expect(reactGate).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
  });
});

describe("PhoneInput opt-in country picker", () => {
  it("keeps v1 callback mode as the default and does not leak picker props into the input", async () => {
    const user = userEvent.setup();
    const callback = vi.fn();
    render(
      <PhoneInput onCountryClick={callback} preferredCountries={["GB"]} />
    );
    await user.click(screen.getByTestId("phone-input-country"));
    expect(callback).toHaveBeenCalledOnce();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute("countryselector");
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "preferredcountries"
    );
  });

  it("searches names, ISO codes and calling codes, then picks without changing national digits", async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    const onChange = vi.fn();
    render(
      <PhoneInput
        countrySelector
        defaultValue="9876543210"
        onCountryChange={onCountryChange}
        onChange={onChange}
        aria-label="Phone"
      />
    );
    await user.click(screen.getByTestId("phone-input-country"));
    const search = screen.getByRole("combobox", {
      name: "Country or calling code",
    });
    await waitFor(() => expect(search).toHaveFocus());
    await user.type(search, "+44");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.keyboard("{Enter}");
    expect(onCountryChange).toHaveBeenCalledWith({
      iso: "GB",
      name: "United Kingdom",
      dialCode: "+44",
    });
    const input = screen.getByRole("textbox", { name: "Phone" });
    expect(input).toHaveFocus();
    expect(input).toHaveValue("9876543210");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("phone-input-country")).toHaveTextContent("+44");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
  });

  it("keeps selection visible while keyboard navigation previews another country", async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    render(
      <PhoneInput
        countrySelector
        countryIso="IN"
        preferredCountries={[]}
        countries={[
          { iso: "IN", name: "India", dialCode: "+91" },
          { iso: "GB", name: "United Kingdom", dialCode: "+44" },
        ]}
        onCountryChange={onCountryChange}
      />
    );
    await user.click(screen.getByTestId("phone-input-country"));
    const search = screen.getByRole("combobox");
    await waitFor(() => expect(search).toHaveFocus());
    await user.keyboard("{End}");
    const selected = screen.getByRole("option", { name: "India +91" });
    const previewed = screen.getByRole("option", {
      name: "United Kingdom +44",
    });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).not.toHaveAttribute("data-active");
    expect(previewed).toHaveAttribute("data-active", "true");
    expect(previewed).toHaveAttribute("aria-selected", "false");
    expect(selected.querySelector("svg")).not.toHaveClass("invisible");
    expect(previewed.querySelector("svg")).toHaveClass("invisible");
    expect(onCountryChange).not.toHaveBeenCalled();
  });

  it("respects controlled countries and supports external updates", async () => {
    const user = userEvent.setup();
    const callback = vi.fn();
    const { rerender } = render(
      <PhoneInput countrySelector countryIso="IN" onCountryChange={callback} />
    );
    await user.click(screen.getByTestId("phone-input-country"));
    await user.type(screen.getByRole("combobox"), "US");
    await user.keyboard("{Enter}");
    expect(callback).toHaveBeenCalledWith({
      iso: "US",
      name: "United States",
      dialCode: "+1",
    });
    expect(screen.getByTestId("phone-input-country")).toHaveAccessibleName(
      "Select country (India +91)"
    );
    rerender(
      <PhoneInput countrySelector countryIso="US" onCountryChange={callback} />
    );
    expect(screen.getByTestId("phone-input-country")).toHaveAccessibleName(
      "Select country (United States +1)"
    );
  });

  it("supports arrows, Home/End, Tab and Escape with an associated active descendant", async () => {
    const user = userEvent.setup();
    render(
      <PhoneInput
        countrySelector
        aria-label="Phone"
        countries={[
          { iso: "IN", name: "India", dialCode: "+91" },
          { iso: "GB", name: "United Kingdom", dialCode: "+44" },
          { iso: "US", name: "United States", dialCode: "+1" },
        ]}
        preferredCountries={[]}
      />
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    const search = screen.getByRole("combobox");
    await waitFor(() => expect(search).toHaveFocus());
    await user.keyboard("{End}");
    expect(search.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "United States +1" }).id
    );
    await user.keyboard("{Home}{ArrowDown}");
    expect(search.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "United Kingdom +44" }).id
    );
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("phone-input-country")).toHaveFocus();
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
    await user.keyboard("{ArrowDown}{Tab}");
    expect(screen.getByRole("textbox", { name: "Phone" })).toHaveFocus();
  });

  it("handles restricted countries and empty results without choosing an unknown country", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <PhoneInput
        countrySelector
        countries={[{ iso: "IN", name: "India", dialCode: "+91" }]}
        onCountryChange={change}
      />
    );
    await user.click(screen.getByTestId("phone-input-country"));
    await user.type(screen.getByRole("combobox"), "unknown");
    expect(screen.getByText("No countries found.")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).not.toHaveAttribute(
      "aria-activedescendant"
    );
    await user.keyboard("{Enter}");
    expect(change).not.toHaveBeenCalled();
  });

  it("locks the new picker for readOnly/disabled while preserving the legacy readOnly callback", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { rerender } = render(
      <PhoneInput countrySelector readOnly onCountryClick={click} />
    );
    expect(screen.getByTestId("phone-input-country")).toBeDisabled();
    rerender(<PhoneInput readOnly onCountryClick={click} />);
    await user.click(screen.getByTestId("phone-input-country"));
    expect(click).toHaveBeenCalledOnce();
    rerender(<PhoneInput countrySelector disabled />);
    expect(screen.getByTestId("phone-input-country")).toBeDisabled();
  });

  it("closes on outside pointer input without stealing focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <PhoneInput countrySelector />
        <button type="button">Outside</button>
      </>
    );
    await user.click(screen.getByTestId("phone-input-country"));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
  });

  it("closes only the country list on Escape inside a dialog", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Modal
        open
        onOpenChange={change}
        title="Edit phone"
        description="Contact details"
      >
        <PhoneInput countrySelector />
      </Modal>
    );
    await user.click(screen.getByTestId("phone-input-country"));
    await user.type(screen.getByRole("combobox"), "India");
    await user.keyboard("{Escape}");
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input-country")).toHaveFocus();
  });
});

describe("PhoneInput message reveal and country focus", () => {
  it("keeps the validation id, describedby link and adds a polite live region", () => {
    render(<PhoneInput id="phone" validation="Enter a valid number" />);
    const message = screen.getByText("Enter a valid number");
    expect(message).toHaveAttribute("id", "phone-validation");
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("phone-validation")
    );
  });

  it("does not reveal a validation message present on first render", () => {
    render(<PhoneInput validation="Bad" />);
    expect(screen.getByText("Bad").parentElement!.className).not.toContain(
      "@starting-style"
    );
  });

  it("keeps a measured feedback frame across appearance, replacement and removal", () => {
    const { container, rerender } = render(<PhoneInput />);
    const frame = container.querySelector("[data-field-feedback]");
    rerender(<PhoneInput validation="Bad" />);
    expect(screen.getByText("Bad").closest("[data-field-feedback]")).toBe(
      frame
    );
    rerender(<PhoneInput validation="Please check this value" />);
    expect(screen.queryByText("Bad")).not.toBeInTheDocument();
    expect(
      screen
        .getByText("Please check this value")
        .closest("[data-field-feedback]")
    ).toBe(frame);
    rerender(<PhoneInput />);
    expect(container.querySelector("[data-field-feedback]")).toBe(frame);
    expect(
      screen.queryByText("Please check this value")
    ).not.toBeInTheDocument();
  });

  it("gives the country button a visible focus-visible ring", () => {
    render(<PhoneInput onCountryClick={() => {}} />);
    const button = screen.getByTestId("phone-input-country");
    expect(button).toHaveClass(
      "focus-visible:outline",
      "focus-visible:[outline-width:2px]",
      "focus-visible:-outline-offset-4",
      "focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
      "rounded-[10px]"
    );
  });

  it("insets the country trigger 3px and fills it on hover like Arc's phone input", () => {
    render(<PhoneInput onCountryClick={() => {}} />);
    const trigger = screen.getByTestId("phone-input-country");
    expect(trigger).toHaveClass("my-[3px]", "ml-[3px]", "rounded-[10px]");
    expect(trigger.className).toContain("hover:bg-v2-semantic-bg-ui");
  });
});

describe("PhoneInput country-list scrolling", async () => {
  const countries = [
    { iso: "AU", name: "Australia", dialCode: "+61" },
    { iso: "IN", name: "India", dialCode: "+91" },
    { iso: "GB", name: "United Kingdom", dialCode: "+44" },
    { iso: "US", name: "United States", dialCode: "+1" },
  ];

  function mediaFor(fine: boolean) {
    return vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches:
            fine &&
            (query === "(hover: hover)" ||
              query === "(hover: hover) and (pointer: fine)"),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList
    );
  }

  it("does not request scrolling when a pointer changes the active country", async () => {
    const media = mediaFor(true);
    const reveal = vi.spyOn(Element.prototype, "scrollIntoView");
    const { unmount } = render(
      <PhoneInput
        countrySelector
        countries={countries}
        preferredCountries={[]}
      />
    );
    try {
      fireEvent.click(screen.getByTestId("phone-input-country"));
      await screen.findByRole("listbox");
      reveal.mockClear();
      fireEvent.mouseMove(
        screen.getByRole("option", { name: "Australia +61" }),
        {
          clientX: 50,
          clientY: 80,
        }
      );
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-activedescendant",
        screen.getByRole("option", { name: "Australia +61" }).id
      );
      expect(reveal).not.toHaveBeenCalled();
    } finally {
      unmount();
      reveal.mockRestore();
      media.mockRestore();
    }
  });

  it("ignores scroll-driven pointer re-hit until the pointer deliberately moves", async () => {
    const media = mediaFor(true);
    const { unmount } = render(
      <PhoneInput
        countrySelector
        countries={countries}
        preferredCountries={[]}
      />
    );
    try {
      fireEvent.click(screen.getByTestId("phone-input-country"));
      await screen.findByRole("listbox");
      const australia = screen.getByRole("option", { name: "Australia +61" });
      const uk = screen.getByRole("option", { name: "United Kingdom +44" });
      const search = screen.getByRole("combobox");
      fireEvent.mouseMove(australia, { clientX: 50, clientY: 80 });
      fireEvent.wheel(screen.getByRole("listbox").parentElement!, {
        deltaY: 120,
      });
      fireEvent.mouseMove(uk, { clientX: 51, clientY: 80 });
      expect(search).toHaveAttribute("aria-activedescendant", australia.id);
      await new Promise((resolve) => setTimeout(resolve, 170));
      fireEvent.mouseMove(uk, { clientX: 51, clientY: 80 });
      expect(search).toHaveAttribute("aria-activedescendant", australia.id);
      fireEvent.mouseMove(uk, { clientX: 52, clientY: 80 });
      expect(search).toHaveAttribute("aria-activedescendant", uk.id);
    } finally {
      unmount();
      media.mockRestore();
    }
  });

  it("reveals keyboard destinations and a repeated Home after manual scrolling", async () => {
    const media = mediaFor(true);
    const { unmount } = render(
      <PhoneInput
        countrySelector
        countries={countries}
        preferredCountries={[]}
      />
    );
    try {
      fireEvent.click(screen.getByTestId("phone-input-country"));
      await screen.findByRole("listbox");
      const list = screen.getByRole("listbox");
      const viewport = list.parentElement!;
      Object.defineProperty(viewport, "clientHeight", { value: 80 });
      Object.defineProperty(list, "offsetTop", { value: 4 });
      screen.getAllByRole("option").forEach((row, index) => {
        Object.defineProperty(row, "offsetTop", { value: index * 36 });
        Object.defineProperty(row, "offsetHeight", { value: 36 });
      });
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "End" });
      expect(viewport.scrollTop).toBe(68);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-activedescendant",
        screen.getByRole("option", { name: "United States +1" }).id
      );
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "Home" });
      expect(viewport.scrollTop).toBe(4);
      viewport.scrollTop = 120;
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "Home" });
      expect(viewport.scrollTop).toBe(4);
    } finally {
      unmount();
      media.mockRestore();
    }
  });

  it("ignores compatibility mouse hover on coarse pointers while retaining country clicks", async () => {
    const media = mediaFor(false);
    const onCountryChange = vi.fn();
    const { unmount } = render(
      <PhoneInput
        countrySelector
        countries={countries}
        preferredCountries={[]}
        onCountryChange={onCountryChange}
        defaultValue="9876543210"
      />
    );
    try {
      fireEvent.click(screen.getByTestId("phone-input-country"));
      await screen.findByRole("listbox");
      const search = screen.getByRole("combobox");
      const selected = search.getAttribute("aria-activedescendant");
      const us = screen.getByRole("option", { name: "United States +1" });
      fireEvent.mouseMove(us, { clientX: 50, clientY: 80 });
      expect(search).toHaveAttribute("aria-activedescendant", selected);
      fireEvent.click(us);
      expect(onCountryChange).toHaveBeenCalledOnce();
      expect(onCountryChange).toHaveBeenCalledWith(countries[3]);
      expect(screen.getByRole("textbox")).toHaveValue("9876543210");
    } finally {
      unmount();
      media.mockRestore();
    }
  });
});
