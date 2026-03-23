import type { Meta, StoryObj } from "@storybook/react";
import { VariableChip } from "./variable-chip";

const meta: Meta<typeof VariableChip> = {
  title: "Custom/AI Bot/VariableSelector/VariableChip",
  component: VariableChip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "text", description: "Variable name" },
    showEditIcon: { control: "boolean", description: "Show edit (pencil) icon" },
    onEdit: { action: "onEdit", description: "Called when edit is clicked" },
  },
};
export default meta;
type Story = StoryObj<typeof VariableChip>;

export const Default: Story = {
  args: { name: "Order_id" },
};

export const WithEditIcon: Story = {
  args: { name: "customer_name", showEditIcon: true, onEdit: () => {} },
};

export const WithoutEditIcon: Story = {
  args: { name: "product_id", showEditIcon: false },
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <VariableChip name="Order_id" onEdit={() => {}} />
      <VariableChip name="customer_name" showEditIcon={false} />
      <VariableChip name="contact_name" showEditIcon={true} onEdit={() => {}} />
    </div>
  ),
};
