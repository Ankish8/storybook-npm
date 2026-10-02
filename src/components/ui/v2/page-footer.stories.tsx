import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PageFooter, type PageFooterProps } from "./page-footer";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = PageFooterProps & {
  disabled: boolean;
  primaryLabel: string;
  secondaryLabel: string;
};
function Actions(args: Args & { onSave?: () => void; onCancel?: () => void }) {
  return (
    <>
      <Button
        variant="outline"
        disabled={args.disabled}
        onClick={args.onCancel}
      >
        {args.secondaryLabel}
      </Button>
      <Button disabled={args.disabled} onClick={args.onSave}>
        {args.primaryLabel}
      </Button>
    </>
  );
}
function FooterExample(args: Args) {
  const [status, setStatus] = useState("");
  return (
    <div className="w-[760px] max-w-full space-y-3">
      <PageFooter
        layout={args.layout}
        description={args.description}
        actions={
          <Actions
            {...args}
            onSave={() => setStatus("Changes saved in this example.")}
            onCancel={() => setStatus("Changes discarded.")}
          />
        }
      />
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {status || "Choose an action to see its result."}
      </p>
    </div>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/PageFooter",
  component: PageFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "description",
        "layout",
        "disabled",
        "primaryLabel",
        "secondaryLabel",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "page-footer",
          hasV1: false,
          summary:
            "Page actions with supporting text in desktop and mobile layouts.",
          changes: [
            ["Desktop", "—", "10px /16px padding;12px gap"],
            ["Mobile", "—", "16px padding;12px vertical gap"],
            ["Divider", "—", "1px top border;white surface"],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            [
              "Supporting text",
              "--semantic-text-secondary",
              "#343E55",
              "#343E55",
            ],
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
          ],
          guidance:
            "Supply actions as a slot. Each action owns its disabled, loading and event behavior. Use the mobile layout for stacked supporting text and full-width actions.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2188-7792",
    },
  },
  args: {
    description: "Configure and manage your webhook integrations",
    layout: "desktop",
    disabled: false,
    primaryLabel: "Save changes",
    secondaryLabel: "Cancel",
  },
  argTypes: {
    description: { control: "text" },
    layout: { control: "inline-radio", options: ["desktop", "mobile"] },
    disabled: { control: "boolean", table: { category: "Example actions" } },
    primaryLabel: { control: "text", table: { category: "Example actions" } },
    secondaryLabel: { control: "text", table: { category: "Example actions" } },
  },
  render: (args) => <FooterExample {...args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Desktop: Story = { args: { layout: "desktop" } };
export const Mobile: Story = {
  args: { layout: "mobile" },
  decorators: [
    (Story) => (
      <div className="w-[360px] max-w-full">
        <Story />
      </div>
    ),
  ],
};
export const Disabled: Story = { args: { disabled: true } };
export const AllVariants: Story = {
  parameters: gallery(
    ["layout"],
    "Desktop and mobile layouts. Supporting text and action controls affect both examples."
  ),
  render: (args) => (
    <div className="w-[820px] max-w-full space-y-6">
      {(["desktop", "mobile"] as const).map((layout) => (
        <section
          key={layout}
          className={
            layout === "mobile"
              ? "w-[360px] max-w-full space-y-3"
              : "max-w-full space-y-3"
          }
        >
          <h3 className="m-0 text-base font-semibold capitalize">{layout}</h3>
          <FooterExample {...args} layout={layout} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled"],
    "Enabled and disabled actions. Other Controls affect each footer."
  ),
  render: (args) => (
    <div className="w-[820px] max-w-full space-y-6">
      {[false, true].map((disabled) => (
        <section key={String(disabled)} className="space-y-3">
          <h3 className="m-0 text-base font-semibold">
            {disabled ? "Disabled" : "Enabled"}
          </h3>
          <FooterExample {...args} disabled={disabled} />
        </section>
      ))}
    </div>
  ),
};
function Editor(args: Args) {
  const [draft, setDraft] = useState(
    "Notify my team when a conversation arrives."
  );
  const [saved, setSaved] = useState(draft);
  const [status, setStatus] = useState("");
  return (
    <section className="w-[720px] max-w-full overflow-hidden rounded-lg border border-solid border-semantic-border-layout">
      <div className="space-y-4 p-5">
        <h3 className="m-0 text-base font-semibold">Notification settings</h3>
        <Textarea
          label="Message"
          value={draft}
          disabled={args.disabled}
          onChange={(event) => {
            setDraft(event.target.value);
            setStatus("");
          }}
        />
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          {status ||
            (draft === saved ? "No unsaved changes" : "Unsaved changes")}
        </p>
      </div>
      <PageFooter
        layout={args.layout}
        description={args.description}
        actions={
          <Actions
            {...args}
            onSave={() => {
              setSaved(draft);
              setStatus("Saved in this example.");
            }}
            onCancel={() => {
              setDraft(saved);
              setStatus("Draft reset.");
            }}
          />
        }
      />
    </section>
  );
}
export const Usage: Story = { render: (args) => <Editor {...args} /> };
