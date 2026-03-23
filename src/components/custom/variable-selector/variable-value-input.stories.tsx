import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { VariableValueInput } from "./variable-value-input";

const defaultSections = [
  {
    label: "Function variables",
    variables: [
      { id: "1", name: "Order_id" },
      { id: "2", name: "customer_name" },
      { id: "3", name: "product_id" },
    ],
  },
];

const meta: Meta<typeof VariableValueInput> = {
  title: "Custom/AI Bot/VariableSelector/VariableValueInput",
  component: VariableValueInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Input that displays a value as text and variable chips in **one non-wrapping row** (Figma). Type \`{{\` to open the variable selector. Variable chips show as \`{{name}}\`. When more variables exist than \`maxVisibleChips\`, an ellipsis control (\`...\`) opens a popover with the rest.

- **One row**: \`flex-nowrap\` + truncated leading text; chips and \`...\` stay on the same line.
- **Overflow**: Default \`maxVisibleChips\` is \`1\` (Figma): first chip inline, then \`...\`; optional \`overflowButtonLabel\` adds text after \`...\`.
- **Figma**: [One line with overflow](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29089), [All variables popup](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29392).
        `,
      },
    },
  },
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    maxVisibleChips: { control: "number" },
    showEditIcon: { control: "boolean" },
    onChange: { action: "onChange" },
    onSelectVariable: { action: "onSelectVariable" },
    onEditVariableChip: { action: "onEditVariableChip" },
    onAddNewVariable: { action: "onAddNewVariable" },
    onEditVariable: { action: "onEditVariable" },
    maxLength: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof VariableValueInput>;

export const Empty: Story = {
  args: {
    value: "",
    onChange: () => {},
    placeholder: "Type {{ to add variables",
    variableSections: defaultSections,
  },
};

export const WithTextOnly: Story = {
  args: {
    value: "application/atom+xml",
    onChange: () => {},
    variableSections: defaultSections,
  },
};

export const WithOneVariable: Story = {
  args: {
    value: "application/atom+xml{{contact_name}}",
    onChange: () => {},
    variableSections: defaultSections,
    onEditVariableChip: () => {},
  },
};

export const WithOverflow: Story = {
  name: "With overflow (… +N more)",
  render: function WithOverflowRender() {
    const [value, setValue] = React.useState(
      "prefix {{Order_id}} {{customer_name}} {{product_id}} {{tracking_id}} suffix"
    );
    return (
      <div className="w-[428px]">
        <VariableValueInput
          value={value}
          onChange={setValue}
          placeholder="Type {{ to add variables"
          variableSections={defaultSections}
          maxVisibleChips={3}
          onEditVariableChip={() => {}}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With \`maxVisibleChips={3}\`: first three chips visible, then \`...\`. Click \`...\` to open the popover with hidden variables.",
      },
    },
  },
};
