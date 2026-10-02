import * as React from "react";
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
import * as V2 from "./tabs";
import * as V1 from "../tabs";
import { Badge as BadgeV1 } from "../badge";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type ExampleArgs = Omit<React.ComponentProps<typeof V2.Tabs>, "children"> & {
  value: string;
  fullWidth: boolean;
  showCounts: boolean;
  count: number;
  disabled: boolean;
  secondDisabled: boolean;
  panelTitle: string;
};
const OPTIONS = [
  { value: "open", label: "Open" },
  { value: "assigned", label: "Assigned" },
  { value: "resolved", label: "Resolved" },
];

function TabsExample({
  args,
  version = "v2",
  onValueChange,
  forceState,
}: {
  args: ExampleArgs;
  version?: "v1" | "v2";
  onValueChange?: (value: string) => void;
  forceState?: "hover" | "focus";
}) {
  const UI = version === "v1" ? V1 : V2;
  const [selected, setSelected] = React.useState(args.value);
  const [seed, setSeed] = React.useState(args.value);
  if (seed !== args.value) {
    setSeed(args.value);
    setSelected(args.value);
  }
  const value = onValueChange ? args.value : selected;
  return (
    <UI.Tabs
      value={value}
      orientation={args.orientation}
      activationMode={args.activationMode}
      dir={args.dir}
      className={`${version === "v1" ? "font-sans " : ""}${args.orientation === "vertical" ? "flex min-w-0 gap-5" : "min-w-0"}`}
      onValueChange={(next) => {
        args.onValueChange?.(next);
        if (onValueChange) onValueChange(next);
        else setSelected(next);
      }}
    >
      <UI.TabsList
        fullWidth={args.fullWidth}
        aria-label="Conversation status"
        className={
          args.orientation === "vertical" ? "w-[200px] shrink-0" : undefined
        }
      >
        {OPTIONS.map((option, index) => (
          <UI.TabsTrigger
            key={option.value}
            value={option.value}
            disabled={args.disabled || (index === 1 && args.secondDisabled)}
            className={
              forceState === "hover"
                ? "pseudo-hover"
                : forceState === "focus"
                  ? "pseudo-focus-visible"
                  : undefined
            }
          >
            {option.label}
            {args.showCounts &&
              (version === "v2" ? (
                <V2.TabsCount>
                  {Math.max(0, args.count - index * 2)}
                </V2.TabsCount>
              ) : (
                <BadgeV1 size="sm" variant="default">
                  {Math.max(0, args.count - index * 2)}
                </BadgeV1>
              ))}
          </UI.TabsTrigger>
        ))}
      </UI.TabsList>
      {OPTIONS.map((option) => (
        <UI.TabsContent
          key={option.value}
          value={option.value}
          className="min-w-0 flex-1 rounded-lg border border-semantic-border-layout p-4"
        >
          <h3
            className={
              version === "v1"
                ? "m-0 text-base font-semibold text-semantic-text-primary"
                : "m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]"
            }
          >
            {args.panelTitle} · {option.label}
          </h3>
          <p
            className={
              version === "v1"
                ? "m-0 mt-2 text-sm text-semantic-text-secondary"
                : "m-0 mt-2 text-sm text-[var(--v2-text-secondary,#5E5E5E)]"
            }
          >
            {option.value === "open"
              ? "Conversations waiting for a reply."
              : option.value === "assigned"
                ? "Conversations assigned to a teammate."
                : "Conversations already resolved."}
          </p>
          <p
            className={
              version === "v1"
                ? "m-0 mt-4 text-xs text-semantic-text-muted"
                : "m-0 mt-4 text-xs text-[var(--v2-text-muted,#707070)]"
            }
          >
            Use arrow keys to move between tabs.{" "}
            {args.activationMode === "manual"
              ? "Press Enter or Space to activate a focused tab."
              : "The focused tab activates automatically."}
          </p>
        </UI.TabsContent>
      ))}
    </UI.Tabs>
  );
}

const meta: Meta<ExampleArgs> = {
  title: "V2/Components/Tabs",
  component: V2.Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "value",
        "orientation",
        "activationMode",
        "dir",
        "fullWidth",
        "showCounts",
        "count",
        "disabled",
        "secondDisabled",
        "panelTitle",
        "onValueChange",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12601",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "tabs",
          exportName: "Tabs, TabsList, TabsTrigger, TabsContent, TabsCount",
          summary:
            "Accessible horizontal and vertical tabs with synchronized selection, optional counts and full-width layouts.",
          changes: [
            [
              "Typography",
              "Inherited medium text",
              "Inter 14/20 medium labels; color and indicator show selection; 0.014px spacing",
            ],
            [
              "Horizontal tab",
              "Compact padding",
              "16px vertical / 12px horizontal, 2px active underline",
            ],
            [
              "Vertical tab",
              "Horizontal underline styling",
              "16px / 24px padding, 4px teal left indicator and grey active surface",
            ],
            [
              "Count",
              "Compose a Badge",
              "Optional TabsCount: 18px circle with a subtle 0.4px border",
            ],
            [
              "Keyboard and selection",
              "Radix Tabs",
              "Same controlled / uncontrolled API and keyboard behavior",
            ],
          ],
          tokens: [
            ["Active underline", "--semantic-primary", "#343E55", "#343E55"],
            [
              "Active vertical indicator",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            [
              "Active vertical surface",
              "--semantic-bg-ui",
              "#F5F5F5",
              "#F5F5F5",
            ],
            [
              "Count surface",
              "--semantic-disabled-secondary",
              "#EBECEE",
              "#EBECEE",
            ],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Font", "--font-v2", "Inter 14 / 500 selected and inactive"],
            ["Selected label", "--v2-text-primary", "#484848", "#484848"],
            ["Inactive label", "--v2-text-muted", "#707070", "#707070"],
            ["Panel body / count", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
          ],
          guidance:
            "Match each trigger value to its content. Set orientation on Tabs; vertical styles then follow automatically. Use activationMode=manual when focusing a tab should not load its panel immediately. fullWidth belongs to TabsList. Disabled and count controls below configure the composed example, not the Tabs root API.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-w-0 max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    value: "open",
    orientation: "horizontal",
    activationMode: "automatic",
    dir: "ltr",
    fullWidth: false,
    showCounts: false,
    count: 12,
    disabled: false,
    secondDisabled: false,
    panelTitle: "Inbox",
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: ["open", "assigned", "resolved"],
      description:
        "Live selected tab. Clicking and keyboard navigation update this control.",
    },
    defaultValue: {
      control: false,
      description:
        "Initial uncontrolled selection. These playgrounds use the live value argument.",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
    activationMode: {
      control: "select",
      options: ["automatic", "manual"],
      table: { defaultValue: { summary: "automatic" } },
    },
    dir: { control: "select", options: ["ltr", "rtl"] },
    fullWidth: {
      control: "boolean",
      table: { category: "TabsList" },
      description:
        "Distribute triggers equally across the available list width.",
    },
    showCounts: { control: "boolean", table: { category: "Example" } },
    count: {
      control: { type: "number", min: 0, max: 99 },
      table: { category: "Example" },
      description:
        "Seed count for the first tab. Other tabs display progressively smaller counts.",
    },
    disabled: {
      control: "boolean",
      table: { category: "TabsTrigger" },
      description: "Disable every trigger in the example.",
    },
    secondDisabled: {
      control: "boolean",
      table: { category: "TabsTrigger" },
      description: "Disable only the Assigned tab to check keyboard skipping.",
    },
    panelTitle: {
      control: "text",
      table: { category: "Example" },
      description: "Title shown inside the active panel.",
    },
    onValueChange: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ExampleArgs>();
    return (
      <TabsExample
        args={args}
        onValueChange={(value) => updateArgs({ value })}
      />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Horizontal: Story = { args: { orientation: "horizontal" } };
export const Vertical: Story = { args: { orientation: "vertical" } };
export const WithDisabledTab: Story = { args: { secondDisabled: true } };
export const FullWidthWithBadges: Story = {
  name: "Full width with counts",
  args: { fullWidth: true, showCounts: true },
};
export const AutoWidth: Story = { args: { fullWidth: false } };
export const Controlled: Story = { args: { value: "assigned" } };
export const WithCounts: Story = { args: { showCounts: true } };
export const ManualActivation: Story = { args: { activationMode: "manual" } };

function GalleryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-4 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["orientation"],
    "Each card fixes its orientation. Selection, activation mode, direction, counts, disabled and full-width controls apply to both. Selections stay independent."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1050px] grid-cols-2 gap-5">
        {(["horizontal", "vertical"] as const).map((orientation) => (
          <GalleryCard
            key={orientation}
            title={
              orientation === "horizontal"
                ? "Horizontal · 2px underline"
                : "Vertical · 4px side indicator"
            }
          >
            <TabsExample args={{ ...args, orientation }} />
          </GalleryCard>
        ))}
      </div>
    </div>
  ),
};
export const AllLayouts: Story = {
  name: "All layouts",
  parameters: gallery(
    ["fullWidth"],
    "Auto width and full width are the fixed axes. All other displayed controls apply to both examples."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-1 gap-5 md:grid-cols-2">
      {[false, true].map((fullWidth) => (
        <GalleryCard
          key={String(fullWidth)}
          title={fullWidth ? "Full width" : "Auto width"}
        >
          <TabsExample args={{ ...args, fullWidth }} />
        </GalleryCard>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["value", "disabled", "secondDisabled"],
    "Default, hover, focus, active and disabled states are fixed in each card. Orientation, layout, counts and panel content remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1050px] grid-cols-2 gap-5">
        {(
          [
            {
              title: "Default",
              value: "resolved",
              disabled: false,
              forceState: undefined,
            },
            {
              title: "Hover",
              value: "resolved",
              disabled: false,
              forceState: "hover",
            },
            {
              title: "Focus",
              value: "resolved",
              disabled: false,
              forceState: "focus",
            },
            {
              title: "Active",
              value: "open",
              disabled: false,
              forceState: undefined,
            },
            {
              title: "Disabled",
              value: "open",
              disabled: true,
              forceState: undefined,
            },
          ] as const
        ).map((state) => (
          <GalleryCard key={state.title} title={state.title}>
            <TabsExample
              args={{
                ...args,
                value: state.value,
                disabled: state.disabled,
                secondDisabled: false,
              }}
              forceState={state.forceState}
            />
          </GalleryCard>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["orientation", "fullWidth"],
    "Both orientations and list layouts are compared in v1 and v2. Selection, counts and disabled controls apply to every sample. v1 uses its existing Badge for counts; v2 uses TabsCount."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1100px] grid-cols-2 gap-5">
        {(["horizontal", "vertical"] as const).flatMap((orientation) =>
          [false, true].flatMap((fullWidth) =>
            (["v1", "v2"] as const).map((version) => (
              <GalleryCard
                key={version + orientation + fullWidth}
                title={
                  version +
                  " · " +
                  orientation +
                  (fullWidth ? " · full width" : " · auto width")
                }
              >
                <TabsExample
                  args={{ ...args, orientation, fullWidth }}
                  version={version}
                />
              </GalleryCard>
            ))
          )
        )}
      </div>
    </div>
  ),
};

function InboxExample({
  args,
  updateValue,
}: {
  args: ExampleArgs;
  updateValue: (value: string) => void;
}) {
  const [items, setItems] = React.useState([
    { id: 1, title: "Product question", status: "open" },
    { id: 2, title: "Billing enquiry", status: "open" },
    { id: 3, title: "Delivery update", status: "assigned" },
    { id: 4, title: "Account setup", status: "resolved" },
  ]);
  const visible = items.filter((item) => item.status === args.value);
  return (
    <div className="max-w-[800px] rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {args.panelTitle}
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
        A local inbox example. Resolve an open item to move it into the Resolved
        tab.
      </p>
      <V2.Tabs
        value={args.value}
        orientation={args.orientation}
        activationMode={args.activationMode}
        dir={args.dir}
        className={args.orientation === "vertical" ? "flex gap-4" : undefined}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateValue(value);
        }}
      >
        <V2.TabsList
          fullWidth={args.fullWidth}
          aria-label="Inbox status"
          className={
            args.orientation === "vertical" ? "w-[180px] shrink-0" : undefined
          }
        >
          {OPTIONS.map((option, index) => (
            <V2.TabsTrigger
              key={option.value}
              value={option.value}
              disabled={args.disabled || (index === 1 && args.secondDisabled)}
            >
              {option.label}
              {args.showCounts && (
                <V2.TabsCount>
                  {items.filter((item) => item.status === option.value).length}
                </V2.TabsCount>
              )}
            </V2.TabsTrigger>
          ))}
        </V2.TabsList>
        {OPTIONS.map((option) => (
          <V2.TabsContent
            key={option.value}
            value={option.value}
            className="min-w-0 flex-1"
          >
            {args.value === option.value && (
              <div className="flex flex-col gap-2">
                {visible.length === 0 ? (
                  <p className="m-0 p-4 text-sm text-[var(--v2-text-muted,#707070)]">
                    No conversations in this tab.
                  </p>
                ) : (
                  visible.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-semantic-bg-ui p-4"
                    >
                      <span className="text-sm text-[var(--v2-text-primary,#484848)]">
                        {item.title}
                      </span>
                      {item.status !== "resolved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={args.disabled}
                          onClick={() =>
                            setItems((previous) =>
                              previous.map((current) =>
                                current.id === item.id
                                  ? { ...current, status: "resolved" }
                                  : current
                              )
                            )
                          }
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </V2.TabsContent>
        ))}
      </V2.Tabs>
    </div>
  );
}
export const Usage: Story = {
  args: { showCounts: true },
  parameters: gallery(
    ["count"],
    "Counts are computed from local inbox state. Tab selection stays synchronized with Controls. Orientation, activation mode, full width, count visibility and disabled settings apply to the example."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs<ExampleArgs>();
    return (
      <InboxExample
        args={args}
        updateValue={(value) => updateArgs({ value })}
      />
    );
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: { secondDisabled: true },
  parameters: {
    // The meta render writes the selection back through useArgs; every one of those re-renders would
    // otherwise restore the action spy and wipe its call history mid-play.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Tabs into the list, walks it with Arrow, Home and End, then clicks a tab and tries the disabled one. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const open = canvas.getByRole("tab", { name: "Open" });
    const assigned = canvas.getByRole("tab", { name: "Assigned" });
    const resolved = canvas.getByRole("tab", { name: "Resolved" });

    await step("Tab enters the list on the selected tab only", async () => {
      await userEvent.tab();
      await expect(open).toHaveFocus();
      await expect(open).toHaveAttribute("aria-selected", "true");
      await expect(resolved).toHaveAttribute("tabindex", "-1");
    });

    await step(
      "Arrow keys move focus, select, and skip the disabled tab",
      async () => {
        await userEvent.keyboard("{ArrowRight}");
        await waitFor(() => expect(resolved).toHaveFocus());
        await waitFor(() =>
          expect(resolved).toHaveAttribute("aria-selected", "true")
        );
        await userEvent.keyboard("{ArrowRight}");
        await waitFor(() => expect(open).toHaveFocus());
        await userEvent.keyboard("{ArrowLeft}");
        await waitFor(() => expect(resolved).toHaveFocus());
        await expect(args.onValueChange).toHaveBeenLastCalledWith("resolved");
      }
    );

    await step("Home and End jump to the first and last tab", async () => {
      await userEvent.keyboard("{Home}");
      await waitFor(() => expect(open).toHaveFocus());
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(resolved).toHaveFocus());
      await expect(resolved).toHaveAttribute("aria-selected", "true");
    });

    await step("A click selects a tab and shows its panel", async () => {
      await userEvent.click(open);
      await waitFor(() =>
        expect(open).toHaveAttribute("aria-selected", "true")
      );
      await expect(args.onValueChange).toHaveBeenLastCalledWith("open");
      await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
        "Inbox · Open"
      );
    });

    await step("A disabled tab cannot be selected", async () => {
      await expect(assigned).toBeDisabled();
      await userEvent.click(assigned, { pointerEventsCheck: 0 });
      await expect(assigned).toHaveAttribute("aria-selected", "false");
      await expect(args.onValueChange).not.toHaveBeenCalledWith("assigned");
      await expect(open).toHaveAttribute("aria-selected", "true");
    });
  },
};
