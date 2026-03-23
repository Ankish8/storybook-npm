import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../ui/button";
import { EditVariableDialog } from "./edit-variable-dialog";

const meta: Meta<typeof EditVariableDialog> = {
  title: "Custom/AI Bot/VariableSelector/EditVariableDialog",
  component: EditVariableDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof EditVariableDialog>;

function DialogHarness(
  props: Omit<
    React.ComponentProps<typeof EditVariableDialog>,
    "open" | "onOpenChange"
  >
) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <EditVariableDialog
        {...props}
        open={open}
        onOpenChange={setOpen}
        onSave={(v) => {
          props.onSave?.(v);
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Add: Story = {
  render: () => <DialogHarness mode="add" onSave={() => {}} />,
};

export const Edit: Story = {
  render: () => (
    <DialogHarness
      mode="edit"
      initialValues={{
        name: "contact_name",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu.",
        required: true,
      }}
      onSave={() => {}}
    />
  ),
};
