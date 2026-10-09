import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
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
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
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
          <h3 className="m-0 text-base font-medium capitalize text-[var(--v2-text-primary,#484848)]">
            {layout}
          </h3>
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
          <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
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
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Notification settings
        </h3>
        <Textarea
          label="Message"
          value={draft}
          disabled={args.disabled}
          onChange={(event) => {
            setDraft(event.target.value);
            setStatus("");
          }}
        />
        <p
          role="status"
          className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        >
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

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    description: "Configure and manage your webhook integrations",
    layout: "desktop",
    disabled: false,
    primaryLabel: "Save changes",
    secondaryLabel: "Cancel",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Activates both footer actions with the mouse and the keyboard and checks the result each one reports. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cancel = canvas.getByRole("button", { name: "Cancel" });
    const save = canvas.getByRole("button", { name: "Save changes" });
    const status = canvas.getByRole("status");

    await step("Shows the supporting text and both actions", async () => {
      await expect(
        canvas.getByText("Configure and manage your webhook integrations")
      ).toBeVisible();
      await expect(status).toHaveTextContent(
        "Choose an action to see its result."
      );
    });

    await step("Each click reports its own result", async () => {
      await userEvent.click(save);
      await expect(status).toHaveTextContent("Changes saved in this example.");
      await userEvent.click(cancel);
      await expect(status).toHaveTextContent("Changes discarded.");
    });

    await step("Tab order, Enter and Space follow the layout", async () => {
      cancel.focus();
      await userEvent.tab();
      await expect(save).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await expect(status).toHaveTextContent("Changes saved in this example.");
      await userEvent.tab({ shift: true });
      await expect(cancel).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(status).toHaveTextContent("Changes discarded.");
    });
  },
};
