import { describe, it, expect, vi } from "vitest";
import { createRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "../../v2/checkbox";

describe("Checkbox error and invalid", () => {
  it("renders the message, marks the box invalid and links them", () => {
    render(<Checkbox label="I agree" error="You must accept the terms" />);
    const box = screen.getByRole("checkbox", { name: "I agree" });
    const message = screen.getByText("You must accept the terms");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAttribute("aria-describedby", message.id);
    expect(message.id).toBeTruthy();
  });

  it("keeps the description linked as well as the error", () => {
    render(
      <Checkbox label="I agree" description="Required" error="Not accepted" />
    );
    const box = screen.getByRole("checkbox", { name: "I agree" });
    const ids = box.getAttribute("aria-describedby")?.split(" ");
    expect(ids).toEqual([
      screen.getByText("Required").id,
      screen.getByText("Not accepted").id,
    ]);
  });

  it("marks the box invalid without a message", () => {
    render(<Checkbox label="I agree" invalid />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("styles an invalid box with the error colour", () => {
    render(<Checkbox label="I agree" invalid />);
    expect(screen.getByRole("checkbox").className).toContain(
      "enabled:aria-[invalid=true]:data-[state=unchecked]:border-semantic-error-primary"
    );
  });

  it("changes no markup when there is no error", () => {
    const { container: plain } = render(<Checkbox label="Plain" id="a" />);
    const { container: withEmptyError } = render(
      <Checkbox label="Plain" id="a" error={undefined} invalid={false} />
    );
    expect(withEmptyError.innerHTML).toBe(plain.innerHTML);
    expect(screen.queryAllByRole("checkbox")[0]).not.toHaveAttribute(
      "aria-invalid"
    );
  });

  it.each(["default", "card"] as const)(
    "keeps an uncontrolled %s control, state and focus while its error changes",
    async (variant) => {
      const onCheckedChange = vi.fn();
      const view = (error?: string) => (
        <Checkbox
          variant={variant}
          label="Accept terms"
          error={error}
          onCheckedChange={onCheckedChange}
        />
      );
      const { rerender } = render(view());
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      checkbox.focus();
      rerender(view("Please review the terms"));
      expect(screen.getByRole("checkbox")).toBe(checkbox);
      expect(checkbox).toBeChecked();
      expect(checkbox).toHaveFocus();
      expect(checkbox).toHaveAccessibleDescription("Please review the terms");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      rerender(view());
      expect(screen.getByRole("checkbox")).toBe(checkbox);
      expect(checkbox).toBeChecked();
      expect(checkbox).toHaveFocus();
      expect(checkbox).not.toHaveAttribute("aria-invalid");
      expect(checkbox).not.toHaveAttribute("aria-describedby");
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    }
  );

  it("keeps a controlled error toggle keyboard-operable without dropping focus or the checked state", async () => {
    function Required() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label="Accept terms"
          checked={checked}
          onCheckedChange={(next) => setChecked(next === true)}
          error={checked ? undefined : "Required"}
        />
      );
    }
    render(<Required />);
    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveFocus();
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
    await userEvent.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveFocus();
    expect(checkbox).toHaveAccessibleDescription("Required");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("retains a persistent error while toggling either checked state", async () => {
    render(<Checkbox label="Accept terms" error="Still requires review" />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAccessibleDescription("Still requires review");
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAccessibleDescription("Still requires review");
  });
});

describe("Checkbox card variant", () => {
  it("makes the whole option the label and names the box from the label text only", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        variant="card"
        label="Email"
        description="Weekly digest"
        onCheckedChange={onCheckedChange}
      />
    );
    const box = screen.getByRole("checkbox", { name: "Email" });
    expect(box).toHaveAccessibleDescription("Weekly digest");
    await user.click(screen.getByText("Weekly digest"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("draws a white bordered card with a separate disabled surface", () => {
    render(<Checkbox variant="card" label="Email" defaultChecked disabled />);
    const card = screen.getByText("Email").closest("label") as HTMLElement;
    expect(card).toHaveAttribute("data-checkbox-card");
    expect(card).toHaveClass(
      "rounded-lg",
      "border",
      "p-3",
      "has-[[data-state=checked]:enabled:not([aria-invalid=true])]:border-semantic-primary",
      "bg-semantic-bg-primary",
      "has-[:disabled]:border-semantic-disabled-border",
      "has-[:disabled]:cursor-not-allowed"
    );
  });

  it("shows an error below the card", () => {
    render(<Checkbox variant="card" label="Email" error="Pick one" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Pick one").id
    );
  });
});

describe("CheckboxGroup", () => {
  it("is a named group of checkboxes with a shared value list", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Notify me by"
        description="Pick any"
        defaultValue={["email"]}
        onValueChange={onValueChange}
      >
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
      </CheckboxGroup>
    );
    const group = screen.getByRole("group", { name: "Notify me by" });
    expect(group).toHaveAccessibleDescription("Pick any");
    expect(screen.getByRole("checkbox", { name: "Email" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "SMS" })).not.toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "SMS" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);
    await user.click(screen.getByRole("checkbox", { name: "Email" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["sms"]);
    expect(screen.getByRole("checkbox", { name: "Email" })).not.toBeChecked();
  });

  it("changes a controlled selection only through the parent", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup value={["a"]} onValueChange={onValueChange}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>
    );
    await user.click(screen.getByRole("checkbox", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeChecked();
  });

  it("shares its name, disabled state and error with every option", () => {
    render(
      <CheckboxGroup name="channels" disabled error="Choose at least one">
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>
    );
    for (const name of ["A", "B"]) {
      const box = screen.getByRole("checkbox", { name });
      expect(box).toBeDisabled();
      expect(box).toHaveAttribute("aria-invalid", "true");
    }
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Choose at least one");
  });

  it("lays options out horizontally when asked", () => {
    render(
      <CheckboxGroup orientation="horizontal">
        <Checkbox value="a" label="A" />
      </CheckboxGroup>
    );
    expect(
      screen
        .getByRole("group")
        .querySelector("[data-slot=checkbox-group-items]")
    ).toHaveClass("flex-wrap", "items-center");
  });

  it("leaves a checkbox without a value, or with its own checked, to itself", async () => {
    const user = userEvent.setup();
    render(
      <CheckboxGroup defaultValue={[]}>
        <Checkbox label="Solo" />
        <Checkbox value="x" checked label="Pinned" />
      </CheckboxGroup>
    );
    await user.click(screen.getByRole("checkbox", { name: "Solo" }));
    expect(screen.getByRole("checkbox", { name: "Solo" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Pinned" })).toBeChecked();
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup onValueChange={onValueChange}>
        <Checkbox value="a" label="A" />
      </CheckboxGroup>
    );
    await user.tab();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });
});

describe("Checkbox anatomy (Content, Control, Indicator, Description, Error)", () => {
  const Anatomy = (props: React.ComponentProps<typeof Checkbox>) => (
    <Checkbox {...props}>
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        Accept terms
      </Checkbox.Content>
      <Checkbox.Description>You can change this later</Checkbox.Description>
    </Checkbox>
  );

  it("toggles from the label text and reports the change", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Anatomy onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByText("Accept terms"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" })
    ).toBeChecked();
  });

  it("lines the description up with the label, not the box", () => {
    render(<Anatomy size="lg" />);
    expect(screen.getByText("You can change this later")).toHaveClass(
      "pl-[var(--choice-indent,0px)]"
    );
    expect(document.querySelector("[data-slot=checkbox]")).toHaveClass(
      "[--choice-indent:38px]"
    );
  });

  it("links the description to the control", async () => {
    render(<Anatomy />);
    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).toHaveAccessibleDescription("You can change this later")
    );
  });

  it("supports controlled state, defaultChecked and indeterminate", () => {
    const { rerender } = render(<Anatomy checked={false} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(<Anatomy checked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
    rerender(<Anatomy checked="indeterminate" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed"
    );
    rerender(<Anatomy defaultChecked key="d" />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("passes name, value and required to the control", () => {
    render(<Anatomy name="terms" value="yes" required />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("value", "yes");
    expect(box).toBeRequired();
  });

  it("disables the control and dims the label", () => {
    render(<Anatomy disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByText("Accept terms").closest("label")).toHaveClass(
      "opacity-50",
      "cursor-not-allowed"
    );
  });

  it("marks the control invalid and links an Error part", async () => {
    render(
      <Checkbox invalid>
        <Checkbox.Content>
          <Checkbox.Control />
          Accept terms
        </Checkbox.Content>
        <Checkbox.Error>You must accept</Checkbox.Error>
      </Checkbox>
    );
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    await waitFor(() =>
      expect(box).toHaveAccessibleDescription("You must accept")
    );
  });

  it("draws the default indicator when the control has no children", () => {
    render(
      <Checkbox defaultChecked>
        <Checkbox.Content>
          <Checkbox.Control />
          Terms
        </Checkbox.Content>
      </Checkbox>
    );
    expect(
      screen.getByRole("checkbox").querySelector("svg path")
    ).toBeInTheDocument();
  });

  it("lets a custom indicator replace the mark", () => {
    render(
      <Checkbox defaultChecked>
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator>
              <span data-testid="heart">♥</span>
            </Checkbox.Indicator>
          </Checkbox.Control>
          Heart
        </Checkbox.Content>
      </Checkbox>
    );
    expect(screen.getByTestId("heart")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox").querySelector("svg")
    ).not.toBeInTheDocument();
  });

  it("puts className, style and data attributes on the root and the rest on the control", () => {
    const onFocus = vi.fn();
    render(
      <Checkbox
        className="custom-root"
        style={{ margin: 3 }}
        data-testid="root"
        aria-label="Custom name"
        onFocus={onFocus}
      >
        <Checkbox.Content>
          <Checkbox.Control />
        </Checkbox.Content>
      </Checkbox>
    );
    const root = screen.getByTestId("root");
    expect(root).toHaveClass("custom-root");
    expect(root).toHaveStyle({ margin: "3px" });
    expect(root).toHaveAttribute("data-slot", "checkbox");
    const box = screen.getByRole("checkbox", { name: "Custom name" });
    expect(root).toContainElement(box);
    box.focus();
    expect(onFocus).toHaveBeenCalled();
  });

  it("forwards its ref to the control button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Checkbox ref={ref}>
        <Checkbox.Content>
          <Checkbox.Control />
          Terms
        </Checkbox.Content>
      </Checkbox>
    );
    expect(ref.current).toBe(screen.getByRole("checkbox"));
  });

  it("names an unlabelled control, as the props form does", async () => {
    render(
      <Checkbox>
        <Checkbox.Content>
          <Checkbox.Control />
        </Checkbox.Content>
      </Checkbox>
    );
    expect(
      await screen.findByRole("checkbox", { name: "Checkbox" })
    ).toBeTruthy();
  });

  it("works inside a CheckboxGroup", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup onValueChange={onValueChange}>
        <Checkbox value="a">
          <Checkbox.Content>
            <Checkbox.Control />
            Alpha
          </Checkbox.Content>
        </Checkbox>
      </CheckboxGroup>
    );
    await user.click(screen.getByText("Alpha"));
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
    expect(screen.getByRole("checkbox", { name: "Alpha" })).toBeChecked();
  });

  it("exposes the parts as named statics", () => {
    expect(Checkbox.Content).toBeDefined();
    expect(Checkbox.Control).toBeDefined();
    expect(Checkbox.Indicator).toBeDefined();
    expect(Checkbox.Description).toBe(Radio.Description);
    expect(Checkbox.Error).toBe(Radio.Error);
  });
});

describe("RadioGroup label, description and error", () => {
  it("names and describes the group and links its error", () => {
    render(
      <RadioGroup
        label="Plan"
        description="Billed monthly"
        error="Pick a plan"
        name="plan"
      >
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    const ids = group.getAttribute("aria-describedby")?.split(" ");
    expect(ids).toEqual([
      screen.getByText("Billed monthly").id,
      screen.getByText("Pick a plan").id,
    ]);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("changes no markup without a label, description or error", () => {
    const { container: plain } = render(
      <RadioGroup name="same">
        <Radio value="a" label="A" id="a" />
      </RadioGroup>
    );
    const html = plain.innerHTML.replace(
      /(radix-)?(?:[:«]r?[0-9a-z]+[:»]|_r_[0-9a-z]+_)/g,
      "ID"
    );
    expect(html).not.toContain("choice-group");
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute(
      "aria-labelledby"
    );
  });

  it("keeps selection and arrow keys working with the frame", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Plan"
        name="plan"
        defaultValue="a"
        onValueChange={onValueChange}
      >
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    await user.tab();
    expect(screen.getByRole("radio", { name: "A" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("b");
  });

  it("marks one radio invalid on its own", () => {
    render(
      <RadioGroup name="solo">
        <Radio value="a" label="A" invalid />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByRole("radio", { name: "B" })).not.toHaveAttribute(
      "aria-invalid"
    );
  });
});

describe("Radio anatomy (Content, Control, Description, Error)", () => {
  function Plans(props: { onValueChange?: (value: string) => void }) {
    const [value, setValue] = useState("team");
    return (
      <RadioGroup
        name="plan"
        label="Plan"
        value={value}
        onValueChange={(next) => {
          setValue(next);
          props.onValueChange?.(next);
        }}
      >
        <Radio value="starter">
          <Radio.Content>
            <Radio.Control />
            Starter
          </Radio.Content>
          <Radio.Description>Up to 3 agents</Radio.Description>
        </Radio>
        <Radio value="team">
          <Radio.Content>
            <Radio.Control />
            Team
          </Radio.Content>
        </Radio>
      </RadioGroup>
    );
  }

  it("selects through the label text and stays mutually exclusive", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    expect(screen.getByRole("radio", { name: "Team" })).toBeChecked();
    await user.click(screen.getByText("Starter"));
    expect(onValueChange).toHaveBeenCalledWith("starter");
    expect(screen.getByRole("radio", { name: "Starter" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Team" })).not.toBeChecked();
  });

  it("links the description to the control", async () => {
    render(<Plans />);
    await waitFor(() =>
      expect(
        screen.getByRole("radio", { name: "Starter" })
      ).toHaveAccessibleDescription("Up to 3 agents")
    );
  });

  it("supports arrow keys across composed options", async () => {
    const user = userEvent.setup();
    render(<Plans />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Team" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Starter" })).toBeChecked();
  });

  it("takes disabled and invalid from the group", () => {
    render(
      <RadioGroup name="plan" disabled error="Pick one">
        <Radio value="a">
          <Radio.Content>
            <Radio.Control />A
          </Radio.Content>
        </Radio>
      </RadioGroup>
    );
    const radio = screen.getByRole("radio", { name: "A" });
    expect(radio).toBeDisabled();
    expect(radio).toHaveAttribute("aria-invalid", "true");
  });

  it("links an Error part and marks the control invalid", async () => {
    render(
      <Radio value="x" name="solo" invalid>
        <Radio.Content>
          <Radio.Control />
          Option
        </Radio.Content>
        <Radio.Error>Not available</Radio.Error>
      </Radio>
    );
    const radio = screen.getByRole("radio", { name: "Option" });
    expect(radio).toHaveAttribute("aria-invalid", "true");
    await waitFor(() =>
      expect(radio).toHaveAccessibleDescription("Not available")
    );
  });

  it("forwards its ref to the input and puts the rest of the props on it", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Radio value="x" name="solo" ref={ref} className="root" data-testid="r">
        <Radio.Content>
          <Radio.Control />
          Option
        </Radio.Content>
      </Radio>
    );
    expect(ref.current).toBe(screen.getByRole("radio"));
    expect(screen.getByTestId("r")).toHaveClass("root");
    expect(screen.getByTestId("r")).toHaveAttribute("data-slot", "radio");
  });

  it("has no Indicator part: the dot is drawn by the input itself", () => {
    expect("Indicator" in Radio).toBe(false);
  });
});

describe("Choice validation stability", () => {
  it("inherits disabled and invalid for group children with their own checked state", async () => {
    const change = vi.fn();
    render(
      <CheckboxGroup disabled error="Unavailable">
        <Checkbox checked onCheckedChange={change} label="Controlled" />
        <Checkbox
          defaultChecked
          onCheckedChange={change}
          label="Uncontrolled"
        />
      </CheckboxGroup>
    );
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    }
    expect(change).not.toHaveBeenCalled();
  });

  it.each(["default", "card"] as const)(
    "retains the same %s radio and keyboard focus when a group error is added or removed",
    async (variant) => {
      const change = vi.fn();
      const view = (error?: string) => (
        <RadioGroup defaultValue="a" onValueChange={change} error={error}>
          <Radio value="a" variant={variant} label="A" />
          <Radio value="b" variant={variant} label="B" />
        </RadioGroup>
      );
      const { rerender } = render(view());
      const radio = screen.getByRole("radio", { name: "B" });
      await userEvent.click(radio);
      radio.focus();
      rerender(view("Review this choice"));
      expect(screen.getByRole("radio", { name: "B" })).toBe(radio);
      expect(radio).toBeChecked();
      expect(radio).toHaveFocus();
      expect(radio).toHaveAttribute("aria-invalid", "true");
      rerender(view());
      expect(screen.getByRole("radio", { name: "B" })).toBe(radio);
      expect(radio).toBeChecked();
      expect(radio).toHaveFocus();
      expect(radio).not.toHaveAttribute("aria-invalid");
      expect(change).toHaveBeenCalledTimes(1);
    }
  );
});
