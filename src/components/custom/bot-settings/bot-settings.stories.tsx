import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { BotSettings } from "./bot-settings";
import {
  demoWhatsappOptions,
  whatsappGroupedSections,
} from "./bot-settings.fixtures";

const meta: Meta<typeof BotSettings> = {
  title: "Custom/AI Bot/Bot Config/BotSettings",
  component: BotSettings,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `**Settings** card (**Connect WhatsApp** + **Human Handover**): matches [Figma — Settings](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42915-85126). Rounded bordered container, header row with chevron, multi-select (tags, checkbox rows, secondary status, searchable list), then a divider and \`BotHumanHandover\` (title + description left, switch right). Pass \`humanHandover={false}\` to hide the handover block.

**Story variants**

| Story | What it shows |
| --- | --- |
| **Default** | Figma-aligned card: Connect WhatsApp + Human Handover; search, max selections, required + inline validation (no helper line under the field). |
| **Selected + divider + rest** | \`whatsappSeparateSelectedWithDivider\`: selected numbers first, divider, then remaining options. [Figma 19381-44751](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-44751) |
| **Secondary status labels** | “Assigned to …” via \`caption\` (base row type) or \`secondaryText\` on \`MultiSelectOption\`. [Figma 19381-45181](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-45181) |
| **Disabled number + tooltip** | Unavailable row + hover tooltip. [Figma 19381-45604](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-45604) |
| **Grouped categories** | Group headers: pass \`MultiSelectGroupedSection[]\` as \`whatsappOptions\` and set \`whatsappSeparateSelectedWithDivider={false}\`. [Figma 42590-146154](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42590-146154) |
| **Search + max selections** | Search + \`whatsappMaxSelections\`. |
| **Validation error** | Required + error message. |

**Install**
\`\`\`bash
npx myoperator-ui add bot-settings
\`\`\`

**Import**
\`\`\`tsx
import { BotSettings } from "@/components/custom/bot-settings"
\`\`\`

### WhatsApp field props

All WhatsApp multi-select behaviour uses the \`whatsapp*\` prefix. The underlying \`MultiSelect\` always uses \`optionVariant="detailed"\` (checkbox rows). Additional passthroughs: \`whatsappLoading\`, \`whatsappId\`, \`whatsappName\` (form submission), \`whatsappCloseOnEscape\`, \`whatsappWrapperClassName\`, \`whatsappTriggerClassName\`, \`whatsappShowClearAll\`, \`whatsappShowSeparatorBeforeChevron\`.

**Design:** [Figma — Settings (Phase 1)](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42915-85126)`,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onWhatsappValueChange: fn(),
  },
  argTypes: {
    whatsappOptions: { control: false, description: "Flat or grouped options for the multi-select." },
    whatsappValue: { control: false },
    onWhatsappValueChange: { action: "whatsapp changed" },
    defaultWhatsappValue: { control: false },
    whatsappPlaceholder: { control: "text" },
    whatsappSearchable: { control: "boolean" },
    whatsappSearchPlaceholder: { control: "text" },
    whatsappMaxSelections: { control: "number" },
    whatsappError: { control: "text" },
    whatsappHelperText: { control: "text" },
    whatsappRequired: { control: "boolean" },
    whatsappSeparateSelectedWithDivider: { control: "boolean" },
    whatsappLoading: { control: "boolean" },
    whatsappId: { control: "text" },
    whatsappName: { control: "text" },
    whatsappCloseOnEscape: { control: "boolean" },
    whatsappWrapperClassName: { control: "text" },
    whatsappTriggerClassName: { control: "text" },
    whatsappShowClearAll: { control: "boolean" },
    whatsappShowSeparatorBeforeChevron: { control: "boolean" },
    humanHandover: { control: false, description: "false to hide; else props for BotHumanHandover." },
    infoTooltip: { control: "text" },
    defaultOpen: {
      control: "boolean",
      description: "Deprecated — ignored; section is always visible.",
    },
    disabled: { control: "boolean" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Phase 1 Settings frame: card, WhatsApp field, handover toggle — no `whatsappHelperText` under the field (see other stories for helper text). */
export const Default: Story = {
  render: function Render(args) {
    const [values, setValues] = useState<string[]>(["wa-1", "wa-2", "wa-3"]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [handoverEnabled, setHandoverEnabled] = useState(true);

    return (
      <div className="w-full max-w-[520px] space-y-4">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={(next) => {
            setValues(next);
            args.onWhatsappValueChange?.(next);
            if (next.length === 0) {
              setError("Select at least one WhatsApp number.");
            } else {
              setError(undefined);
            }
          }}
          whatsappError={error}
          whatsappRequired
          whatsappMaxSelections={5}
          whatsappSearchable
          whatsappSearchPlaceholder="Search by number or status…"
          whatsappPlaceholder="Select WhatsApp numbers"
          humanHandover={{
            enabled: handoverEnabled,
            onToggle: setHandoverEnabled,
          }}
        />
        <p className="text-xs text-semantic-text-muted">
          Selected values: {values.length ? values.join(", ") : "(none)"}
        </p>
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          disabled
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={["wa-1"]}
          onWhatsappValueChange={fn()}
        />
      </div>
    );
  },
};

/** Selected block first, then divider, then remaining options ([Figma 19381-44751](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-44751)). */
export const SelectedDividerRest: Story = {
  name: "Selected + divider + rest",
  render: function Render() {
    const [values, setValues] = useState<string[]>(["wa-1", "wa-2", "wa-3"]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
          whatsappSeparateSelectedWithDivider
        />
      </div>
    );
  },
};

/** Secondary “Assigned to …” text on the right ([Figma 19381-45181](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-45181)). */
export const SecondaryStatusLabels: Story = {
  name: "Secondary status labels",
  render: function Render() {
    const [values, setValues] = useState<string[]>(["wa-1"]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
        />
      </div>
    );
  },
};

/** Disabled row + hover tooltip ([Figma 19381-45604](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=19381-45604)). */
export const DisabledNumberTooltip: Story = {
  name: "Disabled number + tooltip",
  render: function Render() {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
          whatsappHelperText="Hover the greyed-out number to see the tooltip."
        />
      </div>
    );
  },
};

/** Group headers (`MultiSelectGroupedSection[]`) ([Figma 42590-146154](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42590-146154)). */
export const GroupedCategories: Story = {
  name: "Grouped categories",
  render: function Render() {
    const [values, setValues] = useState<string[]>(["g1", "g2", "g3", "g4"]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={whatsappGroupedSections}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
          whatsappSeparateSelectedWithDivider={false}
        />
      </div>
    );
  },
};

export const SearchAndMax: Story = {
  name: "Search + max selections",
  render: function Render() {
    const [values, setValues] = useState<string[]>(["wa-4"]);
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={values}
          onWhatsappValueChange={setValues}
          whatsappSearchable
          whatsappMaxSelections={4}
          whatsappHelperText="Try searching; at most four numbers allowed."
        />
      </div>
    );
  },
};

export const ValidationError: Story = {
  name: "Validation error",
  render: function Render() {
    return (
      <div className="w-full max-w-[520px]">
        <BotSettings
          whatsappOptions={demoWhatsappOptions}
          whatsappValue={[]}
          onWhatsappValueChange={fn()}
          whatsappRequired
          whatsappError="Select at least one WhatsApp number to continue."
        />
      </div>
    );
  },
};
