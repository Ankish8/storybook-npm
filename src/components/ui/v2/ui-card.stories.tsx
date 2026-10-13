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
import { useId, useState } from "react";
import { Check, MessageSquare, Plus, TrendingUp } from "lucide-react";
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
        <MessageSquare
          aria-hidden="true"
          className="mb-2 size-6 text-semantic-text-secondary"
        />
      )}
      {args.variant === "action" && (
        <Plus
          aria-hidden="true"
          className="mb-2 size-6 text-semantic-text-link"
        />
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
          <span className="text-[32px] font-medium text-semantic-text-primary">
            128
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-semantic-success-text">
            <TrendingUp aria-hidden="true" className="size-3" />
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
          <p role="status" className="m-0 text-xs text-semantic-text-muted">
            {preview ? `Previewing ${args.heading}` : ""}
          </p>
        </UiCardFooter>
      )}
    </UiCardContent>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/Card",
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
        component: `Card groups related content with optional selection or footer actions. The published exports remain \`UiCard\`, \`UiCardHeader\`, \`UiCardTitle\`, \`UiCardDescription\`, \`UiCardContent\` and \`UiCardFooter\`.

\`\`\`bash
npx myoperator-ui add v2-ui-card
\`\`\`

\`\`\`tsx
import { UiCard, UiCardHeader, UiCardTitle, UiCardDescription, UiCardContent, UiCardFooter } from "@/components/ui/v2/ui-card";
\`\`\`

This is an existing v2 component with no v1 counterpart. Its defaults stay \`variant="default"\`, \`selected={false}\` and \`disabled={false}\`. Default, template and legacy metrics cards are 300px wide; icon and action cards are 200px wide. Override width with \`className\`; there is no size prop. v2 uses unprefixed Tailwind classes.

The surface keeps 20px padding, 12px corners and a 1px border. Interactive cards use a subtle border change on fine-pointer hover, a selected surface and visible keyboard focus. They never lift, scale or gain a hover shadow. Reduced motion removes the color transition.

Use \`onClick\` for a single card action; Enter and Space activate it from the card itself. A card with \`role="button"\` should not contain other interactive controls. For cards containing buttons, links or inputs, omit the root \`onClick\` and compose those controls in the content or footer. Legacy nested controls keep their own click and keyboard actions without activating the card. Host \`onKeyDown\` cancellation is respected. Disabled interactive cards ignore activation and leave the tab order.

The \`metrics\` variant remains supported. For dedicated statistics, trends and chart compositions, use the separate MetricCard component.

### Design Tokens

| Purpose | CSS variable | Preview |
| --- | --- | --- |
| Surface | \`--semantic-bg-primary\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-bg-primary);border:1px solid var(--semantic-border-layout);border-radius:4px"></span> |
| Border | \`--semantic-border-layout\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-border-layout);border-radius:4px"></span> |
| Hover border | \`--semantic-border-secondary\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-border-secondary);border-radius:4px"></span> |
| Selected surface | \`--semantic-brand-surface\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-brand-surface);border-radius:4px"></span> |
| Selected border | \`--semantic-border-accent\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-border-accent);border-radius:4px"></span> |
| Keyboard focus | \`--semantic-border-focus\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-border-focus);border-radius:4px"></span> |
| Title | \`--semantic-text-primary\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-text-primary);border-radius:4px"></span> |
| Description | \`--semantic-text-secondary\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-text-secondary);border-radius:4px"></span> |
| Disabled text | \`--semantic-text-muted\` | <span style="display:inline-block;width:24px;height:24px;background:var(--semantic-text-muted);border-radius:4px"></span> |`,
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
          args.showActions || !args.onClick
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
function RoutingCard() {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const titleId = useId();
  return (
    <UiCard className="w-full" role="article" aria-labelledby={titleId}>
      <UiCardContent>
        <UiCardHeader>
          <UiCardTitle id={titleId}>Conversation routing</UiCardTitle>
        </UiCardHeader>
        <UiCardDescription>
          Keep new conversations in the right inbox.
        </UiCardDescription>
        <div id={detailsId} hidden={!expanded}>
          <dl className="m-0 mt-2 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-semantic-border-layout pt-3 text-xs">
            <dt className="text-semantic-text-muted">Support</dt>
            <dd className="m-0 text-semantic-text-primary">General inbox</dd>
            <dt className="text-semantic-text-muted">Sales</dt>
            <dd className="m-0 text-semantic-text-primary">Sales inbox</dd>
          </dl>
        </div>
      </UiCardContent>
      <UiCardFooter>
        <Button
          size="sm"
          variant="outline"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Hide routing" : "Show routing"}
        </Button>
      </UiCardFooter>
    </UiCard>
  );
}

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Select a workspace card with a click, Enter or Space. The content card beside it keeps its own footer button, which reveals the routing details.",
      },
    },
  },
  render: function OverviewRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="grid w-[640px] max-w-full items-start gap-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <UiCard
            {...cardProps(args)}
            className="w-full"
            onClick={
              args.showActions || !args.onClick
                ? undefined
                : () => {
                    notifyCardClick(args.onClick);
                    updateArgs({ selected: !args.selected });
                  }
            }
          >
            <Content {...args} />
            {!args.showActions && (
              <div className="mt-5 flex items-center gap-2 text-xs text-semantic-text-muted">
                <Check
                  aria-hidden="true"
                  className={args.selected ? "size-3.5" : "size-3.5 opacity-0"}
                />
                <span>
                  {args.selected ? "Selected workspace" : "Select workspace"}
                </span>
              </div>
            )}
          </UiCard>
          <p role="status" className="m-0 text-xs text-semantic-text-muted">
            {args.selected
              ? `${args.heading} selected`
              : "Choose a workspace to continue"}
          </p>
        </div>
        <RoutingCard />
      </div>
    );
  },
};
export const Template: Story = { args: { variant: "template" } };
export const WithIcon: Story = { args: { variant: "icon" } };
export const Action: Story = {
  args: {
    variant: "action",
    heading: "Blank configuration",
    description: "Select an empty starting point.",
  },
};
export const Metrics: Story = {
  name: "Legacy metrics variant",
  parameters: {
    docs: {
      description: {
        story:
          "The existing metrics variant remains compatible. Use MetricCard for dedicated statistics and trend compositions.",
      },
    },
  },
  args: {
    variant: "metrics",
    heading: "Conversations",
    description: "Total conversations this week",
    onClick: undefined,
  },
};
export const Selected: Story = { args: { variant: "icon", selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ContentCard: Story = {
  parameters: gallery(
    [
      "variant",
      "heading",
      "description",
      "selected",
      "disabled",
      "showActions",
      "onClick",
    ],
    "A passive card with a real footer action. Show routing reveals the local routing details; Hide routing closes them."
  ),
  render: () => (
    <div className="w-[300px] max-w-full">
      <RoutingCard />
    </div>
  ),
};
export const CustomWidths: Story = {
  parameters: gallery(
    ["variant", "selected", "showActions", "onClick"],
    "Card has no size prop. These content cards use className to set narrow, default and container widths."
  ),
  render: (args) => (
    <div className="flex w-[680px] max-w-full flex-wrap items-start gap-4">
      {(["w-[200px]", "w-[300px]", "w-full"] as const).map((width) => (
        <UiCard
          {...cardProps(args)}
          key={width}
          variant="default"
          className={width}
          selected={false}
          onClick={undefined}
        >
          <Content {...args} variant="default" showActions={false} />
        </UiCard>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Five fixed card presentations. Heading, description, selected, disabled and actions update all samples."
  ),
  render: (args) => (
    <div className="grid w-[1000px] max-w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {variants.map((variant) => (
        <section key={variant} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize text-semantic-text-primary">
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
    "Default, selected and disabled interactive cards, plus a passive content card. Hover changes only an enabled, unselected interactive card's border."
  ),
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-5 sm:grid-cols-2">
      {["Default", "Selected", "Disabled", "Passive"].map((state) => (
        <section key={state} className="min-w-0 space-y-3">
          <h3 className="m-0 text-sm font-medium text-semantic-text-primary">
            {state}
          </h3>
          <UiCard
            {...cardProps(args)}
            selected={state === "Selected"}
            disabled={state === "Disabled"}
            onClick={state === "Passive" ? undefined : cardProps(args).onClick}
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
        <h3 className="m-0 text-base font-medium text-semantic-text-primary">
          Choose a workspace
        </h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
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
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
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
