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
  panels,
}: {
  args: Args;
  version?: "v1" | "v2";
  updateValue?: (value: string[]) => void;
  forceState?: "hover" | "focus";
  panels?: Record<string, React.ReactNode>;
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
          <h4 className="m-0">
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
          </h4>
          <UI.AccordionContent>
            <p
              className={
                version === "v1"
                  ? "m-0 text-sm text-semantic-text-secondary"
                  : "m-0 text-sm text-[var(--v2-text-secondary,var(--semantic-text-secondary))]"
              }
            >
              {index === 0 ? args.content : section.content}
            </p>
            {panels?.[section.value]}
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
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-9830",
    },
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
            [
              "Trigger",
              "Inherited semibold type",
              "Inter 14px medium title, 50px minimum height",
            ],
            [
              "Spacing",
              "v1 spacing",
              "Plain list: edge-to-edge, 8px vertical, 20px gap, a hairline between rows. Bordered frame keeps a 16px inset",
            ],
            [
              "Borders",
              "Existing bordered group",
              "8px radius and semantic layout border retained",
            ],
            [
              "Content",
              "Inherited 14px text",
              "14px body, 32px right and 20px bottom padding; a short height transition and quiet 3px settling motion",
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
            ["Hover", "--semantic-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Font", "--font-v2", "Inter 14px / 500"],
          ],
          guidance:
            "Use single when only one section should remain open. value is an array even in single mode. Use defaultValue for initial uncontrolled sections, or value plus onValueChange for synchronized selection. The showChevron control configures AccordionTrigger; firstDisabled configures the first AccordionItem. Use native Enter/Space to toggle a focused trigger; Arrow Up/Down and Home/End move between enabled rows. Closed content stays mounted and inert, so form values are preserved. Reduced motion snaps all transitions. The root has no size or orientation prop.",
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
export const Overview: Story = {
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <ContactExample args={args} update={update} />;
  },
};
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
      <h3 className="m-0 mb-4 text-base font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]">
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
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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
  update: (patch: Partial<Args>) => void;
}) {
  const id = React.useId();
  const [name, setName] = React.useState("Aditi Kumar");
  const [email, setEmail] = React.useState("aditi@example.com");
  const [company, setCompany] = React.useState("Northstar Studio");
  const [stage, setStage] = React.useState("Customer");
  const [owner, setOwner] = React.useState("Support team");
  const [notify, setNotify] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const labelClass =
    "mb-2 block text-xs font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]";
  const selectClass =
    "min-h-10 w-full min-w-0 rounded-md border border-semantic-border-input bg-semantic-bg-primary px-3 text-sm text-[var(--v2-text-secondary,var(--semantic-text-secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary";

  return (
    <section
      aria-label="Contact profile"
      className="w-full max-w-[680px] rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]">
            Contact profile
          </h3>
          <p className="m-0 mt-1 text-xs leading-relaxed text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            Keep contact details, custom fields and routing in one place.
          </p>
        </div>
        <div
          role="group"
          aria-label="Open sections"
          className="flex flex-wrap gap-1"
        >
          <Button
            type="button"
            size="sm"
            variant={args.type === "single" ? "secondary" : "ghost"}
            aria-pressed={args.type === "single"}
            onClick={() =>
              update({ type: "single", value: args.value?.slice(0, 1) })
            }
          >
            One at a time
          </Button>
          <Button
            type="button"
            size="sm"
            variant={args.type === "multiple" ? "secondary" : "ghost"}
            aria-pressed={args.type === "multiple"}
            onClick={() => update({ type: "multiple" })}
          >
            Multiple
          </Button>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <Example
          args={args}
          updateValue={(value) => update({ value })}
          panels={{
            basic: (
              <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor={id + "-name"} className={labelClass}>
                    Contact name
                  </label>
                  <Input
                    id={id + "-name"}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setSaved(false);
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor={id + "-email"} className={labelClass}>
                    Email address
                  </label>
                  <Input
                    id={id + "-email"}
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setSaved(false);
                    }}
                  />
                </div>
              </div>
            ),
            custom: (
              <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor={id + "-company"} className={labelClass}>
                    Company
                  </label>
                  <Input
                    id={id + "-company"}
                    value={company}
                    onChange={(event) => {
                      setCompany(event.target.value);
                      setSaved(false);
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor={id + "-stage"} className={labelClass}>
                    Lifecycle stage
                  </label>
                  <select
                    id={id + "-stage"}
                    className={selectClass}
                    value={stage}
                    onChange={(event) => {
                      setStage(event.target.value);
                      setSaved(false);
                    }}
                  >
                    <option>New lead</option>
                    <option>Active lead</option>
                    <option>Customer</option>
                  </select>
                </div>
              </div>
            ),
            routing: (
              <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor={id + "-owner"} className={labelClass}>
                    Assign conversations to
                  </label>
                  <select
                    id={id + "-owner"}
                    className={selectClass}
                    value={owner}
                    onChange={(event) => {
                      setOwner(event.target.value);
                      setSaved(false);
                    }}
                  >
                    <option>Support team</option>
                    <option>Sales team</option>
                    <option>Account owner</option>
                  </select>
                </div>
                <label
                  htmlFor={id + "-notify"}
                  className="flex items-center gap-2 text-sm text-[var(--v2-text-secondary,var(--semantic-text-secondary))]"
                >
                  <input
                    id={id + "-notify"}
                    type="checkbox"
                    checked={notify}
                    className="size-4 shrink-0 accent-semantic-primary"
                    onChange={(event) => {
                      setNotify(event.target.checked);
                      setSaved(false);
                    }}
                  />
                  Notify the assigned team
                </label>
              </div>
            ),
          }}
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p
            role="status"
            aria-live="polite"
            className="m-0 text-xs text-semantic-success-text"
          >
            {saved ? "Saved locally: " + name : ""}
          </p>
          <Button type="submit" size="sm" disabled={!name.trim()}>
            Save contact
          </Button>
        </div>
      </form>
    </section>
  );
}
export const Usage: Story = {
  args: { variant: "bordered" },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <ContactExample args={args} update={update} />;
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

export const Uncontrolled: Story = {
  parameters: gallery(
    ["value"],
    "An uncontrolled accordion starts with Basic information open. Each toggle updates its own state; onValueChange still reports the selection."
  ),
  render: (args) => (
    <div className="max-w-[640px]">
      <V2.Accordion
        variant={args.variant}
        type={args.type}
        defaultValue={["basic"]}
        onValueChange={args.onValueChange}
      >
        {sections.map((section, index) => (
          <V2.AccordionItem
            key={section.value}
            value={section.value}
            disabled={index === 0 && args.firstDisabled}
          >
            <h3 className="m-0">
              <V2.AccordionTrigger showChevron={args.showChevron}>
                {index === 0 ? args.label : section.title}
              </V2.AccordionTrigger>
            </h3>
            <V2.AccordionContent>
              <p className="m-0">
                {index === 0 ? args.content : section.content}
              </p>
            </V2.AccordionContent>
          </V2.AccordionItem>
        ))}
      </V2.Accordion>
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  parameters: gallery(
    ["value", "firstDisabled"],
    "Arrow Up/Down, Home and End move through enabled triggers. Enter and Space toggle. The middle section is disabled and skipped."
  ),
  render: (args) => (
    <div className="max-w-[640px]">
      <p className="m-0 mb-4 text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
        Tab to a section, use Arrow Up/Down or Home/End to move, then Enter or
        Space to expand.
      </p>
      <V2.Accordion variant={args.variant} type={args.type}>
        {sections.map((section, index) => (
          <V2.AccordionItem
            key={section.value}
            value={section.value}
            disabled={index === 1}
          >
            <h3 className="m-0">
              <V2.AccordionTrigger showChevron={args.showChevron}>
                {section.title}
              </V2.AccordionTrigger>
            </h3>
            <V2.AccordionContent>
              <p className="m-0">{section.content}</p>
            </V2.AccordionContent>
          </V2.AccordionItem>
        ))}
      </V2.Accordion>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    label:
      "Can I keep longer contact details and routing preferences together on a small screen?",
    content:
      "Yes. Section headings wrap without pushing the chevron outside the row, and long content stays inside the panel. CustomerReference_2026_Account_123456789012345678901234567890 can wrap when there is no convenient space.",
    value: ["basic"],
  },
};
