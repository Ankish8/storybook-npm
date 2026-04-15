import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotSettings } from "../bot-settings";
import { whatsappGroupedSections } from "../bot-settings.fixtures";
import type { MultiSelectOption } from "../../../ui/multi-select";

const sampleOptions: MultiSelectOption[] = [
  {
    value: "n1",
    label: "+91 9876543210",
    secondaryText: "Assigned to Bot Name 1",
  },
  { value: "n2", label: "+91 8765432109" },
  {
    value: "n3",
    label: "+91 7653443219",
    disabled: true,
    disabledTooltip: "This number is associated with another bot.",
  },
];

describe("BotSettings", () => {
  it("renders Settings title", () => {
    render(<BotSettings whatsappOptions={[]} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("always shows Connect WhatsApp and the multi-select (no accordion)", () => {
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={["n1"]}
        onWhatsappValueChange={() => {}}
      />
    );

    expect(screen.getByText("Connect WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });

  it("applies bottom border and padding on the root to separate the section", () => {
    const { container } = render(<BotSettings whatsappOptions={[]} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("border-b");
    expect(root).toHaveClass("border-solid");
    expect(root).toHaveClass("border-semantic-border-layout");
    expect(root).toHaveClass("pb-4");
  });

  it("ignores defaultOpen (section is always visible)", () => {
    render(
      <BotSettings
        defaultOpen={false}
        whatsappOptions={sampleOptions}
        whatsappValue={[]}
      />
    );
    expect(screen.getByText("Connect WhatsApp")).toBeInTheDocument();
  });

  it("renders selected numbers as tags in the multi-select", () => {
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={["n1", "n2"]}
        onWhatsappValueChange={() => {}}
      />
    );
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();
    expect(screen.getByText("+91 8765432109")).toBeInTheDocument();
  });

  it("calls onWhatsappValueChange when a tag remove control is used", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={["n1"]}
        onWhatsappValueChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Remove +91 9876543210"));
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("opens the multi-select list from the combobox", async () => {
    const user = userEvent.setup();
    render(
      <BotSettings whatsappOptions={sampleOptions} whatsappValue={[]} />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <BotSettings whatsappOptions={[]} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BotSettings ref={ref} whatsappOptions={[]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props on root element", () => {
    render(<BotSettings whatsappOptions={[]} data-testid="bot-settings-root" />);
    expect(screen.getByTestId("bot-settings-root")).toBeInTheDocument();
  });

  it("shows multi-select placeholder when no numbers selected", () => {
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={[]}
        onWhatsappValueChange={() => {}}
        whatsappPlaceholder="Pick numbers"
      />
    );
    expect(screen.getByText("Pick numbers")).toBeInTheDocument();
  });

  it("shows group section headers when using grouped options and separateSelectedWithDivider is false", async () => {
    const user = userEvent.setup();
    render(
      <BotSettings
        whatsappOptions={whatsappGroupedSections}
        whatsappValue={[]}
        onWhatsappValueChange={() => {}}
        whatsappSeparateSelectedWithDivider={false}
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("OPTION LABEL 1")).toBeInTheDocument();
    expect(screen.getByText("OPTION LABEL 2")).toBeInTheDocument();
  });

  it("passes whatsappId to the combobox", () => {
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={[]}
        whatsappId="connect-wa-field"
      />
    );
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "id",
      "connect-wa-field"
    );
  });

  it("disables the combobox when whatsappLoading is true", () => {
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={[]}
        whatsappLoading
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("hides dropdown search when whatsappSearchable is false", async () => {
    const user = userEvent.setup();
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={[]}
        whatsappSearchable={false}
        whatsappSearchPlaceholder="Search by number or status..."
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(
      screen.queryByPlaceholderText("Search by number or status...")
    ).not.toBeInTheDocument();
  });

  it("hides selection count footer when whatsappShowSelectionFooter is false", async () => {
    const user = userEvent.setup();
    render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={["n1"]}
        whatsappMaxSelections={5}
        whatsappShowSelectionFooter={false}
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByText(/\/\s*5\s+selected/)).not.toBeInTheDocument();
  });

  it("renders hidden inputs for whatsappName when values are selected", () => {
    const { container } = render(
      <BotSettings
        whatsappOptions={sampleOptions}
        whatsappValue={["n1", "n2"]}
        whatsappName="bot_whatsapp_numbers"
      />
    );
    const hidden = container.querySelectorAll(
      'input[type="hidden"][name="bot_whatsapp_numbers"]'
    );
    expect(hidden).toHaveLength(2);
    expect(hidden[0]).toHaveAttribute("value", "n1");
    expect(hidden[1]).toHaveAttribute("value", "n2");
  });
});
