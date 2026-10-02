import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import * as V2 from "./accordion";
import * as V1 from "../accordion";
import { Input } from "./input";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = React.ComponentProps<typeof V2.Accordion> & {
  label: string;
  content: string;
  showChevron: boolean;
  firstDisabled: boolean;
};
const sections = [
  {
    value: "basic",
    title: "Basic information",
    content: "Add the contact details your team needs.",
  },
  {
    value: "custom",
    title: "Custom fields",
    content: "Keep additional information with the contact.",
  },
  {
    value: "routing",
    title: "Routing preferences",
    content: "Choose how new conversations are assigned.",
  },
];
function Example({
  args,
  version = "v2",
  updateValue,
  forceState,
  form,
}: {
  args: Args;
  version?: "v1" | "v2";
  updateValue?: (value: string[]) => void;
  forceState?: "hover" | "focus";
  form?: React.ReactNode;
}) {
  const UI = version === "v1" ? V1 : V2;
  const [value, setValue] = React.useState(args.value || []);
  const [seed, setSeed] = React.useState(args.value);
  if (seed !== args.value) {
    setSeed(args.value);
    setValue(args.value || []);
  }
  return (
    <UI.Accordion
      variant={args.variant}
      type={args.type}
      value={updateValue ? args.value : value}
      className={version === "v1" ? "font-sans" : args.className}
      onValueChange={(next) => {
        args.onValueChange?.(next);
        if (updateValue) updateValue(next);
        else setValue(next);
      }}
    >
      {sections.map((section, index) => (
        <UI.AccordionItem
          key={section.value}
          value={section.value}
          disabled={index === 0 && args.firstDisabled}
        >
          <UI.AccordionTrigger
            showChevron={args.showChevron}
            className={
              index === 0 && forceState === "hover"
                ? "pseudo-hover"
                : index === 0 && forceState === "focus"
                  ? "pseudo-focus-visible"
                  : undefined
            }
          >
            {index === 0 ? args.label : section.title}
          </UI.AccordionTrigger>
          <UI.AccordionContent>
            <p className="m-0 text-sm text-semantic-text-secondary">
              {index === 0 ? args.content : section.content}
            </p>
            {index === 0 && form}
          </UI.AccordionContent>
        </UI.AccordionItem>
      ))}
    </UI.Accordion>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/Accordion",
  component: V2.Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "variant",
        "type",
        "value",
        "onValueChange",
        "label",
        "content",
        "showChevron",
        "firstDisabled",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "accordion",
          exportName:
            "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
          summary:
            "Expandable sections with single or multiple selection, disabled items and animated content.",
          changes: [
            ["Trigger", "Inherited semibold type", "Inter 16px medium title"],
            [
              "Spacing",
              "v1 spacing",
              "Recorded 16px horizontal / 10px vertical, 12px gap",
            ],
            [
              "Borders",
              "Existing bordered group",
              "8px radius and semantic layout border retained",
            ],
            [
              "Content",
              "Inherited 14px text",
              "14px body with 16px horizontal inset",
            ],
            [
              "Selection",
              "Controlled or uncontrolled string array",
              "Same type/value/defaultValue/onValueChange API",
            ],
          ],
          tokens: [
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Body", "--semantic-text-secondary", "#414651", "#414651"],
            ["Hover", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Font", "--font-v2", "Inter 16px / 500"],
          ],
          guidance:
            "Use single when only one section should remain open. value is an array even in single mode. Use defaultValue for initial uncontrolled sections, or value plus onValueChange for synchronized selection. The showChevron control configures AccordionTrigger; firstDisabled configures the first AccordionItem. Use native Enter/Space to toggle a focused trigger.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "default",
    type: "multiple",
    value: ["basic"],
    label: "Basic information",
    content: "Add the contact details your team needs.",
    showChevron: true,
    firstDisabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    variant: { control: "select", options: ["default", "bordered"] },
    type: { control: "select", options: ["single", "multiple"] },
    value: {
      control: "check",
      options: ["basic", "custom", "routing"],
      description: "Open item values. This is an array in both modes.",
    },
    defaultValue: {
      control: false,
      description: "Initial state only; use value for the live playground.",
    },
    onValueChange: { control: false },
    label: { control: "text", table: { category: "Example" } },
    content: { control: "text", table: { category: "Example" } },
    showChevron: {
      control: "boolean",
      table: { category: "AccordionTrigger" },
    },
    firstDisabled: { control: "boolean", table: { category: "AccordionItem" } },
  },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <div className="max-w-[640px]">
        <Example args={args} updateValue={(value) => update({ value })} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const SingleMode: Story = { args: { type: "single" } };
export const MultipleMode: Story = {
  args: { type: "multiple", value: ["basic", "custom"] },
};
export const Bordered: Story = { args: { variant: "bordered" } };
export const WithDisabledItem: Story = {
  args: { firstDisabled: true, value: [] },
};
export const WithoutChevron: Story = { args: { showChevron: false } };
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Clicking or pressing Enter/Space on a trigger updates the live value Control. Control edits update the sections.",
      },
    },
  },
};
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-4 text-base font-semibold text-semantic-text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Default and Bordered are fixed. Selection, mode, disabled, chevron and text controls apply to both independent samples."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-2 gap-4">
        {(["default", "bordered"] as const).map((variant) => (
          <Card key={variant} title={variant}>
            <Example args={{ ...args, variant }} />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const AllModes: Story = {
  parameters: gallery(
    ["type"],
    "Single and Multiple selection are fixed. Other controls remain live. Each example keeps its own open sections."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-2 gap-4">
        {(["single", "multiple"] as const).map((type) => (
          <Card key={type} title={type}>
            <Example args={{ ...args, type }} />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["value", "firstDisabled"],
    "Closed, Open, Hover, Focus and Disabled states are fixed on the first item. The remaining presentation and text controls remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-2 gap-4">
        {["Closed", "Open", "Hover", "Focus", "Disabled"].map((state) => (
          <Card key={state} title={state}>
            <Example
              args={{
                ...args,
                value: state === "Open" ? ["basic"] : [],
                firstDisabled: state === "Disabled",
              }}
              forceState={
                state === "Hover"
                  ? "hover"
                  : state === "Focus"
                    ? "focus"
                    : undefined
              }
            />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["variant", "type"],
    "Both variants and selection modes are compared in v1 and v2. Selection, text, chevron and disabled controls apply throughout."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-2 gap-4">
        {(["default", "bordered"] as const).flatMap((variant) =>
          (["single", "multiple"] as const).flatMap((type) =>
            (["v1", "v2"] as const).map((version) => (
              <Card
                key={version + variant + type}
                title={version + " · " + variant + " · " + type}
              >
                <Example args={{ ...args, variant, type }} version={version} />
              </Card>
            ))
          )
        )}
      </div>
    </div>
  ),
};
function ContactExample({
  args,
  update,
}: {
  args: Args;
  update: (value: string[]) => void;
}) {
  const id = React.useId();
  const [name, setName] = React.useState("Aditi Kumar");
  const [saved, setSaved] = React.useState(false);
  return (
    <section className="max-w-[720px] rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        Contact profile
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-semantic-text-muted">
        Expand a section and edit the local form. Open sections stay
        synchronized with Controls.
      </p>
      <Example
        args={args}
        updateValue={update}
        form={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
            className="mt-4 flex flex-wrap items-end gap-3"
          >
            <div className="min-w-[220px] flex-1">
              <label htmlFor={id} className="mb-2 block text-sm font-medium">
                Contact name
              </label>
              <Input
                id={id}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={args.firstDisabled || !name.trim()}
            >
              Save contact
            </Button>
            {saved && (
              <p className="m-0 w-full text-xs text-semantic-success-text">
                Saved locally: {name}
              </p>
            )}
          </form>
        }
      />
    </section>
  );
}
export const Usage: Story = {
  args: { variant: "bordered" },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <ContactExample args={args} update={(value) => update({ value })} />;
  },
};
export const CustomContent: Story = { ...Usage, name: "Custom content" };
export const FAQ: Story = {
  args: {
    label: "How do I update a contact?",
    content:
      "Open a contact profile, edit the required information and save your changes.",
    type: "single",
  },
};
