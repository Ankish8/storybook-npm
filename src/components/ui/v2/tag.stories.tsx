import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Phone } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import { Tag, TagGroup, type TagProps } from "./tag";
import { Tag as TagV1 } from "../tag";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

const VARIANTS = [
  "default",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
  "destructive",
] as const;
const SIZES = ["sm", "default", "lg"] as const;
const removeAction = fn().mockName("onRemove");
const labelFor = (variant: string) =>
  variant[0].toUpperCase() + variant.slice(1);
type TagStoryArgs = TagProps & {
  withIcon?: boolean;
  removable?: boolean;
  maxVisible?: number;
  tags?: Array<{ label?: string; value: string }>;
};
const TAGS = [
  { label: "In call:", value: "Call begin, start dialing" },
  { label: "WhatsApp:", value: "Message delivered" },
  { value: "After call event" },
  { value: "Resolved" },
];
const TagSample = React.forwardRef<HTMLSpanElement, TagStoryArgs>(
  function TagSample(
    { withIcon, removable, maxVisible: _max, tags: _tags, ...args },
    ref
  ) {
    return (
      <Tag {...args} ref={ref} onRemove={removable ? args.onRemove : undefined}>
        {withIcon && <Phone className="size-3 shrink-0" />}
        {args.children}
      </Tag>
    );
  }
);
const meta: Meta<TagStoryArgs> = {
  title: "V2/Components/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "variant",
        "size",
        "children",
        "label",
        "withIcon",
        "removable",
        "removeDisabled",
        "removeAriaLabel",
        "onRemove",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-9132",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "tag",
          summary:
            "Tags label events and categories. Add a prefix, an icon, or a dismiss button. Passive tags stay out of the tab order.",
          changes: [
            [
              "Heights",
              "Content and padding determine the height",
              "sm 24 · default 28 · lg 32px minimum; long labels wrap",
            ],
            ["Radius", "4px", "8px"],
            [
              "Label",
              "Inherited font, bold prefix",
              "Timeless Sans (Inter fallback) 400 body and 500 prefix",
            ],
            [
              "Spacing",
              "Label and dismiss margins",
              "6px between label and content, dismiss circle 3px from the content",
            ],
            ["Borders", "None", "1px tinted border for every variant"],
            ["Accent", "Grey surface", "Teal surface and border"],
            [
              "Status text",
              "Bright action colors",
              "Darker success, warning and error text",
            ],
            [
              "Dismiss target",
              "12px icon is the whole target",
              "24px target around a 22px circle and 14px icon, pointer-aware hover plate and keyboard focus ring; a brief press response respects reduced motion",
            ],
            [
              "Dismissal and overflow",
              "onRemove, removeDisabled, TagGroup",
              "Same parent-controlled API; Backspace/Delete on the remove button and accurate boundary counts",
            ],
          ],
          tokens: [
            ["Default surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            [
              "Default border",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            ["Body text", "--semantic-text-secondary", "#343E55", "#343E55"],
            [
              "Accent surface",
              "--semantic-brand-surface",
              "#EAF8FA",
              "#EAF8FA",
            ],
            ["Accent border", "--semantic-border-accent", "#27ABB8", "#27ABB8"],
            ["Info surface", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Info border", "--semantic-info-border", "#A8C0EC", "#A8C0EC"],
            ["Info text", "--semantic-info-text", "#2F5398", "#2F5398"],
            ["Success text", "--semantic-success-text", "#067647", "#067647"],
            ["Warning text", "--semantic-warning-text", "#B54708", "#B54708"],
            ["Error text", "--semantic-error-text", "#B42318", "#B42318"],
            ["Dismiss hover plate", "--semantic-bg-inverted", "#000000 at 8%"],
            ["Dismiss focus ring", "--semantic-primary", "#343E55", "#343E55"],
            ["Font", "--font-v2", "Timeless Sans (Inter fallback) 400 / 600"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Use `label` for a prefix and children for the value. `onRemove` receives a click event for pointer and keyboard dismissal; the parent controls removal and can honor `event.defaultPrevented`. Set a specific `removeAriaLabel` when several tags are dismissible. After updating a list, its parent should focus the next remove button, the previous button, or a suitable list action. `TagGroup` defaults to two visible tags; zero or negative limits show only the overflow count, fractions round down, NaN uses the default, and Infinity shows every tag.",
        }),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    variant: "default",
    size: "default",
    children: "After call event",
    label: "",
    withIcon: false,
    removable: false,
    removeDisabled: false,
    removeAriaLabel: "Remove tag",
    onRemove: removeAction,
    maxVisible: 2,
    tags: TAGS,
  },
  render: (args) => <TagSample {...args} />,
  argTypes: {
    withIcon: {
      control: "boolean",
      description: "Include a phone icon in the example's content.",
      table: { category: "Example" },
    },
    removable: {
      control: "boolean",
      description: "Supply onRemove to show a dismiss button.",
      table: { category: "Example" },
    },
    maxVisible: {
      control: { type: "number", min: 0, max: 4, step: 1 },
      description: "Number of tags before the overflow counter.",
      table: { category: "TagGroup" },
    },
    tags: {
      control: "object",
      description: "TagGroup labels and values.",
      table: { category: "TagGroup" },
    },
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Category or status palette.",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Small 24px, default 28px, or large 32px minimum height.",
    },
    children: {
      control: "text",
      description: "Tag value; can include an icon.",
    },
    label: {
      control: "text",
      description: "Optional bold prefix before the value.",
    },
    removeDisabled: {
      control: "boolean",
      description: "Disable the dismiss button independently.",
    },
    removeAriaLabel: {
      control: "text",
      description: "Accessible label for the dismiss button.",
    },
    onRemove: {
      control: false,
      description:
        "Called when dismissed. Removing the tag is controlled by its parent.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    variant: "default",
    size: "default",
    label: "Event:",
    children: "Call started",
  },
};
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Accent: Story = {
  args: { variant: "accent", children: "Accent" },
};
export const Info: Story = { args: { variant: "info", children: "Info" } };
export const Success: Story = {
  args: { variant: "success", children: "Success" },
};
export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
};
export const Error: Story = { args: { variant: "error", children: "Error" } };
export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["variant"],
    "Compare palettes. Controls update content, size, prefix, icon and dismissal across every sample."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-2">
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            {labelFor(variant)}
          </span>
          <TagSample {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Compare heights. All remaining controls apply to every size."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-end gap-8">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-start gap-2">
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            {size} · {size === "sm" ? 24 : size === "lg" ? 32 : 28}px
          </span>
          <TagSample {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};
export const WithIcons: Story = {
  name: "With icons",
  args: { variant: "accent", children: "Voice call", withIcon: true },
};
export const WithLabel: Story = {
  name: "With a label",
  args: { label: "In call event:", children: "Call begin, start dialing" },
};
export const Removable: Story = {
  args: {
    variant: "accent",
    children: "Support",
    removable: true,
    removeAriaLabel: "Remove Support",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dismiss button calls onRemove (shown in Actions). Use Dismissible for a parent that removes and restores tags.",
      },
    },
  },
};
export const RemoveDisabled: Story = {
  name: "Disabled dismiss",
  args: {
    variant: "accent",
    children: "Support",
    removable: true,
    removeDisabled: true,
    removeAriaLabel: "Remove Support",
  },
};
function DismissibleTags(args: TagStoryArgs) {
  const initialTags = ["Support", "VIP", "Trial"];
  const [tags, setTags] = React.useState(initialTags);
  const [keepVip, setKeepVip] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const tagRefs = React.useRef(new Map<string, HTMLSpanElement>());
  const resetRef = React.useRef<HTMLButtonElement>(null);
  const focusAfterRemoval = React.useRef<string | null>(null);

  React.useLayoutEffect(() => {
    const target = focusAfterRemoval.current;
    focusAfterRemoval.current = null;
    if (!target) return;
    if (target === "reset") {
      resetRef.current?.focus();
    } else {
      tagRefs.current
        .get(target)
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus();
    }
  }, [tags]);

  return (
    <div className="flex w-[440px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div>
        <p className="m-0 text-base font-medium text-semantic-text-primary">
          Contact tags
        </p>
        <p className="m-0 mt-1 text-sm text-semantic-text-muted">
          Labels used to route this contact to the right team.
        </p>
      </div>
      <div
        className="flex min-h-8 flex-wrap items-center gap-2"
        aria-label="Contact tags"
      >
        {tags.length ? (
          tags.map((tag) => (
            <TagSample
              {...args}
              key={tag}
              ref={(node) => {
                if (node) tagRefs.current.set(tag, node);
                else tagRefs.current.delete(tag);
              }}
              removeAriaLabel={"Remove " + tag}
              onRemove={(event) => {
                args.onRemove?.(event);
                if (keepVip && tag === "VIP") event.preventDefault();
                if (event.defaultPrevented) {
                  setAnnouncement(tag + " kept. Removal was cancelled.");
                  return;
                }
                if (event.currentTarget === document.activeElement) {
                  const index = tags.indexOf(tag);
                  focusAfterRemoval.current =
                    tags[index + 1] ?? tags[index - 1] ?? "reset";
                }
                setTags((current) => current.filter((value) => value !== tag));
                setAnnouncement(
                  tag + " removed. " + (tags.length - 1) + " tags remaining."
                );
              }}
            >
              {tag}
            </TagSample>
          ))
        ) : (
          <span className="text-sm text-semantic-text-muted">
            No tags selected
          </span>
        )}
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-semantic-text-secondary">
          <input
            type="checkbox"
            checked={keepVip}
            onChange={(event) => setKeepVip(event.target.checked)}
            className="size-4 accent-semantic-primary"
          />
          Keep VIP
        </label>
        <p className="m-0 text-xs text-semantic-text-muted">
          Tab to ×, then press Enter, Space, Backspace or Delete. Keep VIP
          cancels its removal.
        </p>
        <p
          className="m-0 min-h-5 text-xs text-semantic-text-secondary"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement || tags.length + " tags attached"}
        </p>
      </div>
      <div className="flex border-t border-semantic-border-layout pt-4">
        <Button
          ref={resetRef}
          variant="outline"
          size="sm"
          onClick={() => {
            setTags(initialTags);
            setAnnouncement("All three tags restored.");
          }}
        >
          Reset tags
        </Button>
      </div>
    </div>
  );
}
export const Dismissible: Story = {
  args: { variant: "accent", removable: true },
  parameters: gallery(
    ["children", "removeAriaLabel"],
    "Remove and restore actual tags, cancel VIP removal, and keep keyboard focus within the list. Controls edit the palette, size, prefix, icon and dismiss behavior."
  ),
  render: (args) => <DismissibleTags {...args} />,
};
export const LongLabels: Story = {
  name: "Long and wrapped labels",
  args: {
    variant: "accent",
    removable: true,
    removeAriaLabel: "Remove follow-up event",
  },
  parameters: gallery(
    ["children", "label"],
    "Content stays readable inside a narrow container. The dismiss control stays available."
  ),
  render: (args) => (
    <div className="flex w-64 max-w-full flex-col items-start gap-4">
      <TagSample {...args} label="Follow-up:">
        Waiting for the customer to confirm the onboarding details
      </TagSample>
      <TagSample {...args} label="Event identifier:">
        customer_onboarding_confirmation_received_successfully
      </TagSample>
      <TagGroup
        tags={TAGS}
        maxVisible={1}
        variant={args.variant}
        size={args.size}
      />
    </div>
  ),
};
export const VariantsAndSizes: Story = {
  name: "Variants and sizes",
  args: { label: "Event:", children: "Started" },
  parameters: {
    ...gallery(
      ["variant", "size"],
      "Every palette at every height. Content, prefix, icon and dismissal remain editable."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-[110px_repeat(3,minmax(180px,1fr))] items-center gap-x-6 gap-y-5">
        <div />
        {["Small · 24px", "Default · 28px", "Large · 32px"].map((label) => (
          <div
            key={label}
            className="text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {label}
          </div>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {labelFor(variant)}
            </div>
            {SIZES.map((size) => (
              <div key={size}>
                <TagSample
                  {...args}
                  variant={variant}
                  size={size}
                  data-v2-component="tag"
                  data-variant={variant}
                  data-size={size}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  args: { children: "Tag" },
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["variant", "size"],
      "The same content, prefix and dismiss settings in both versions. Each row contains small, default and large tags."
    ),
    layout: "padded",
  },
  render: ({ withIcon, removable, maxVisible: _max, tags: _tags, ...args }) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-[110px_1fr_1fr] items-center gap-x-8 gap-y-4">
        <div />
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 (ui/tag)
        </div>
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 (ui/v2/tag)
        </div>
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {labelFor(variant)}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {SIZES.map((size) => (
                <TagV1
                  {...args}
                  key={size}
                  variant={variant}
                  size={size}
                  onRemove={removable ? args.onRemove : undefined}
                >
                  {withIcon && <Phone className="size-3 shrink-0" />}
                  {args.children}
                </TagV1>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {SIZES.map((size) => (
                <TagSample
                  {...args}
                  key={size}
                  variant={variant}
                  size={size}
                  withIcon={withIcon}
                  removable={removable}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const GroupWithOverflow: Story = {
  name: "Group with overflow",
  args: { variant: "accent", tags: TAGS, maxVisible: 2 },
  parameters: {
    controls: { include: ["variant", "size", "tags", "maxVisible"] },
    docs: {
      description: {
        story:
          "Edit TagGroup's tag list or maximum visible count to update the overflow indicator.",
      },
    },
  },
  render: (args) => (
    <div className="w-[560px] max-w-full">
      <TagGroup
        variant={args.variant}
        size={args.size}
        tags={args.tags ?? []}
        maxVisible={args.maxVisible}
      />
    </div>
  ),
};
export const Usage: Story = {
  parameters: gallery(
    ["children", "label", "removeAriaLabel"],
    "Controls update the group palette and every tag's size. Icon and dismissal settings apply to the individual category tags."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Conversation activity
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Events and labels attached to a conversation.
        </p>
      </div>
      <TagGroup
        variant={args.variant}
        size={args.size}
        tags={TAGS.slice(0, 3)}
        maxVisible={2}
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-semantic-border-layout pt-4">
        <TagSample
          {...args}
          variant="accent"
          label=""
          removeAriaLabel="Remove Support"
        >
          Support
        </TagSample>
        <TagSample
          {...args}
          variant="success"
          label=""
          removeAriaLabel="Remove Resolved"
        >
          Resolved
        </TagSample>
        <TagSample
          {...args}
          variant="info"
          label=""
          removeAriaLabel="Remove Follow-up"
        >
          Follow-up
        </TagSample>
      </div>
    </div>
  ),
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    variant: "accent",
    children: "Support",
    removable: true,
    removeAriaLabel: "Remove Support",
    onRemove: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Plays keyboard and pointer dismissal against the onRemove spy. The parent owns removal, so the tag stays rendered. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const dismiss = canvas.getByRole("button", { name: "Remove Support" });

    await step(
      "Tab focuses it; Enter, Space, Backspace and Delete dismiss",
      async () => {
        await userEvent.tab();
        await expect(dismiss).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        await userEvent.keyboard(" ");
        await userEvent.keyboard("{Backspace}{Delete}");
        await expect(args.onRemove).toHaveBeenCalledTimes(4);
      }
    );

    await step("A click calls onRemove with the click event", async () => {
      await userEvent.click(dismiss);
      await expect(args.onRemove).toHaveBeenCalledTimes(5);
      await expect(args.onRemove).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: "click" })
      );
    });

    await step("The tag stays until its parent removes it", async () => {
      await expect(canvas.getByText("Support")).toBeInTheDocument();
    });
  },
};
