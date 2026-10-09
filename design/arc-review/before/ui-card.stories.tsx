import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { useState } from "react";
import { MessageSquare, Plus, TrendingUp } from "lucide-react";
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
  type UiCardProps,
} from "./ui-card";
import { Button } from "./button";
import { Tag } from "./tag";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = UiCardProps & {
  heading: string;
  description: string;
  showActions: boolean;
  workspace?: "" | "Support" | "Sales";
};
// Keep React's event/window graph out of Storybook's action serialization.
const notifyCardClick = (handler: UiCardProps["onClick"]) =>
  (handler as (() => void) | undefined)?.();
const cardProps = ({
  variant,
  selected,
  disabled,
  onClick,
  className,
}: Args) => ({
  variant,
  selected,
  disabled,
  onClick: onClick ? () => notifyCardClick(onClick) : undefined,
  className,
});
const variants = ["default", "template", "icon", "action", "metrics"] as const;
function Content(args: Args) {
  const [preview, setPreview] = useState(false);
  return (
    <UiCardContent>
      {args.variant === "icon" && (
        <MessageSquare className="mb-2 size-6 text-[var(--v2-text-secondary,#5E5E5E)]" />
      )}
      {args.variant === "action" && (
        <Plus className="mb-2 size-6 text-semantic-text-link" />
      )}
      <UiCardHeader>
        <UiCardTitle>{args.heading}</UiCardTitle>
      </UiCardHeader>
      <UiCardDescription>{args.description}</UiCardDescription>
      {args.variant === "template" && (
        <Tag variant="info" size="sm">
          Template
        </Tag>
      )}
      {args.variant === "metrics" && (
        <div className="flex items-end gap-3">
          <span className="text-[32px] font-medium text-[var(--v2-text-primary,#484848)]">
            128
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-semantic-success-text">
            <TrendingUp className="size-3" />
            12%
          </span>
        </div>
      )}
      {args.showActions && (
        <UiCardFooter>
          <Button
            size="sm"
            variant="outline"
            disabled={args.disabled}
            onClick={(event) => {
              event.stopPropagation();
              setPreview(!preview);
            }}
          >
            {preview ? "Close preview" : "Preview"}
          </Button>
          <p
            role="status"
            className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
          >
            {preview ? `Previewing ${args.heading}` : ""}
          </p>
        </UiCardFooter>
      )}
    </UiCardContent>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/UiCard",
  component: UiCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "heading",
        "description",
        "variant",
        "selected",
        "disabled",
        "showActions",
        "onClick",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "ui-card",
          exportName:
            "UiCard, UiCardHeader, UiCardTitle, UiCardDescription, UiCardContent, UiCardFooter",
          hasV1: false,
          summary:
            "Content cards for templates, actions, metrics and selectable options.",
          changes: [
            ["Container", "—", "16px padding; 12px corners; 1px border"],
            ["Default", "—", "Skeuomorphic shadow; white surface"],
            ["Hover", "—", "Light gradient and 0 2px 8px shadow"],
            ["Selected", "—", "Teal border, brand surface and 4px glow"],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            [
              "Selected surface",
              "--semantic-brand-surface",
              "#EAF8FA",
              "#EAF8FA",
            ],
            [
              "Selected border",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            ["Action border", "--semantic-info-border", "#A8C0EC", "#A8C0EC"],
          ],
          guidance:
            "Use content slots for your own data. Adding onClick gives the card keyboard activation; avoid nesting other interactive actions inside that card. Use a non-interactive card for cards with footer buttons.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2284-50241",
    },
  },
  args: {
    heading: "Customer support",
    description: "Keep your team and conversations connected.",
    variant: "default",
    selected: false,
    disabled: false,
    showActions: false,
    onClick: fn(),
  },
  argTypes: {
    heading: { control: "text", table: { category: "Example" } },
    description: { control: "text", table: { category: "Example" } },
    showActions: { control: "boolean", table: { category: "Example" } },
    variant: { control: "select", options: variants },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <UiCard
        {...cardProps(args)}
        className="max-w-full"
        onClick={
          args.showActions
            ? undefined
            : () => {
                notifyCardClick(args.onClick);
                updateArgs({ selected: !args.selected });
              }
        }
      >
        <Content {...args} />
      </UiCard>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Template: Story = { args: { variant: "template" } };
export const WithIcon: Story = { args: { variant: "icon" } };
export const Action: Story = {
  args: {
    variant: "action",
    heading: "Create new bot",
    description: "Start with a blank configuration.",
  },
};
export const Metrics: Story = {
  args: {
    variant: "metrics",
    heading: "Conversations",
    description: "Total conversations this week",
  },
};
export const Selected: Story = { args: { variant: "icon", selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Five fixed card presentations. Heading, description, selected, disabled and actions update all samples."
  ),
  render: (args) => (
    <div className="grid w-[1000px] max-w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {variants.map((variant) => (
        <section key={variant} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize text-[var(--v2-text-primary,#484848)]">
            {variant}
          </h3>
          <UiCard {...cardProps(args)} variant={variant} onClick={undefined}>
            <Content {...args} variant={variant} />
          </UiCard>
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["selected", "disabled", "showActions"],
    "Default, hover, selected and disabled. Content and card type stay editable."
  ),
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-5 sm:grid-cols-2">
      {["Default", "Hover", "Selected", "Disabled"].map((state) => (
        <section key={state} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
            {state}
          </h3>
          <UiCard
            {...cardProps(args)}
            selected={state === "Selected"}
            disabled={state === "Disabled"}
            className={state === "Hover" ? "pseudo-hover" : undefined}
          >
            <Content {...args} showActions={false} />
          </UiCard>
        </section>
      ))}
    </div>
  ),
};
function Workspace(
  args: Args & { onWorkspaceChange: (value: "Support" | "Sales") => void }
) {
  const selected = args.workspace || "";
  return (
    <section className="w-[680px] max-w-full space-y-4">
      <div>
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Choose a workspace
        </h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Activate a card with the mouse, Enter or Space.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["Support", "Sales"] as const).map((name) => (
          <UiCard
            {...cardProps(args)}
            key={name}
            variant="icon"
            selected={selected === name}
            aria-label={name}
            onClick={() => {
              notifyCardClick(args.onClick);
              args.onWorkspaceChange(name);
            }}
          >
            <Content
              {...args}
              heading={name}
              variant="icon"
              showActions={false}
            />
          </UiCard>
        ))}
      </div>
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
        {selected ? `Selected: ${selected}` : "Choose a workspace to continue"}
      </p>
    </section>
  );
}
export const Usage: Story = {
  args: { workspace: "" },
  argTypes: {
    workspace: {
      control: "select",
      options: ["", "Support", "Sales"],
      table: { category: "Example" },
    },
  },
  parameters: {
    ...gallery(
      [],
      "Two fixed workspace choices. Workspace selection stays synchronized with Controls; description and disabled apply to both cards."
    ),
    controls: { include: ["workspace", "description", "disabled", "onClick"] },
  },
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <Workspace
        {...args}
        onWorkspaceChange={(workspace) => updateArgs({ workspace })}
      />
    );
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    heading: "Customer support",
    variant: "default",
    selected: false,
    disabled: false,
    showActions: false,
  },
  parameters: {
    // Every activation updates Controls, which re-renders the story; keep the spy history through that.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Plays real clicks and Enter/Space activation. Each activation toggles the pressed state through Controls and the play ends where it started, so it can be replayed. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: /Customer support/ });
    const pressed = (value: "true" | "false") =>
      waitFor(() => expect(card).toHaveAttribute("aria-pressed", value));

    await step("An interactive card is reachable with Tab", async () => {
      await userEvent.tab();
      await expect(card).toHaveFocus();
      await expect(card).toHaveAttribute("aria-pressed", "false");
    });

    await step("Clicks press and release the card", async () => {
      await userEvent.click(card);
      await pressed("true");
      await userEvent.click(card);
      await pressed("false");
      await expect(args.onClick).toHaveBeenCalledTimes(2);
    });

    await step("Enter and Space toggle it; other keys do not", async () => {
      await userEvent.keyboard("a{Escape}");
      await expect(args.onClick).toHaveBeenCalledTimes(2);
      await userEvent.keyboard("{Enter}");
      await pressed("true");
      await userEvent.keyboard(" ");
      await pressed("false");
      await expect(args.onClick).toHaveBeenCalledTimes(4);
    });
  },
};

export const DisabledInteraction: Story = {
  name: "Disabled interaction test",
  tags: ["!autodocs"],
  args: {
    heading: "Customer support",
    variant: "default",
    selected: false,
    disabled: true,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled card is announced as disabled, leaves the tab order and ignores clicks, Enter and Space.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: /Customer support/ });

    await step("It is announced as disabled and skipped by Tab", async () => {
      await expect(card).toHaveAttribute("aria-disabled", "true");
      await expect(card).not.toHaveAttribute("tabindex");
      await userEvent.tab();
      await expect(card).not.toHaveFocus();
    });

    await step("Click, Enter and Space do nothing", async () => {
      await userEvent.click(card);
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(args.onClick).not.toHaveBeenCalled();
      await expect(card).toHaveAttribute("aria-pressed", "false");
    });
  },
};
