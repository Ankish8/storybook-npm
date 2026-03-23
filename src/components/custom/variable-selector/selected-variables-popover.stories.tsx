import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SelectedVariablesPopover } from "./selected-variables-popover";
import { parseValueToSegments } from "./types";

const meta: Meta<typeof SelectedVariablesPopover> = {
  title: "Custom/AI Bot/VariableSelector/SelectedVariablesPopover",
  component: SelectedVariablesPopover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Popover that lists all variables in the current value. Shown when the user clicks "\`...\`" in VariableValueInput; it **matches the value field width** and sits **directly under the field** (anchor = full input container). [Figma](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29392).
        `,
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    showEditIcon: { control: "boolean" },
    onOpenChange: { action: "onOpenChange" },
    onEditVariable: { action: "onEditVariable" },
  },
};
export default meta;
type Story = StoryObj<typeof SelectedVariablesPopover>;

const segmentsWithVariables = parseValueToSegments(
  "{{Order_id}} and {{customer_name}} then {{product_id}}"
);

export const Open: Story = {
  render: function OpenRender() {
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(true);
    return (
      <div className="flex w-[428px] flex-col gap-2">
        <div
          ref={anchorRef}
          className="flex h-10 w-full items-center rounded border border-semantic-border-input bg-semantic-bg-primary px-3 text-sm text-semantic-text-muted"
        >
          Value field (popover width matches this)
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start rounded border border-semantic-border-input px-2 py-1 text-xs text-semantic-text-secondary"
        >
          Re-open popover
        </button>
        <SelectedVariablesPopover
          open={open}
          onOpenChange={setOpen}
          anchorRef={anchorRef}
          segments={segmentsWithVariables}
          title="Variables"
          showEditIcon
          onEditVariable={() => {}}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function EmptyRender() {
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    return (
      <div className="flex flex-col gap-2">
        <button
          ref={anchorRef}
          type="button"
          className="rounded border border-semantic-border-input px-3 py-2 text-sm"
        >
          Open
        </button>
        <SelectedVariablesPopover
          open={true}
          onOpenChange={() => {}}
          anchorRef={anchorRef}
          segments={[]}
          title="Variables"
        />
      </div>
    );
  },
};
