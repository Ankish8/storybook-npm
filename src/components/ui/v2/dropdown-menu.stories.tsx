import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import {
  Check,
  ChevronRight,
  Copy,
  Edit,
  MoreVertical,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gallery } from "../../../storybook/v2-preview";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { v2ComponentDocs } from "./story-docs";

type ExampleMode = "actions" | "checkbox" | "radio" | "submenu" | "link";
type MenuArgs = React.ComponentProps<typeof DropdownMenu> &
  Pick<
    React.ComponentProps<typeof DropdownMenuContent>,
    "side" | "align" | "sideOffset"
  > & {
    triggerLabel: string;
    groupLabel: string;
    itemLabel: string;
    description: string;
    suffix: string;
    showIcon: boolean;
    showShortcut: boolean;
    disabled: boolean;
    destructive: boolean;
    iconTrigger: boolean;
    mode: ExampleMode;
    checked: boolean;
    value: string;
    onSelect: (selection: { type: string; label: string }) => void;
    onCheckedChange: (checked: boolean | "indeterminate") => void;
    onValueChange: (value: string) => void;
  };

function MenuExample({
  args,
  updateArgs,
  onResult,
}: {
  args: MenuArgs;
  updateArgs: (next: Partial<MenuArgs>) => void;
  onResult?: (result: string) => void;
}) {
  const changeOpen = (open: boolean) => {
    args.onOpenChange?.(open);
    updateArgs({ open });
  };
  const select = (event: Event, label: string) => {
    args.onSelect({ type: event.type, label });
    onResult?.(label);
  };
  return (
    <DropdownMenu open={args.open} modal={args.modal} onOpenChange={changeOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={args.iconTrigger ? "icon" : "default"}
          aria-label={args.triggerLabel}
        >
          {args.iconTrigger ? (
            <MoreVertical aria-hidden="true" />
          ) : (
            args.triggerLabel
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={args.side}
        align={args.align}
        sideOffset={args.sideOffset}
        className="w-72"
      >
        <DropdownMenuLabel>{args.groupLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {args.mode === "checkbox" ? (
          <>
            <DropdownMenuCheckboxItem
              checked={args.checked}
              disabled={args.disabled}
              description={args.description || undefined}
              suffix={args.suffix || undefined}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) => {
                args.onCheckedChange(checked);
                updateArgs({ checked: checked === true });
                onResult?.(
                  checked ? "Notifications enabled" : "Notifications disabled"
                );
              }}
            >
              {args.itemLabel}
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem
              onSelect={(event) => select(event, "Preferences saved")}
            >
              Done
            </DropdownMenuItem>
          </>
        ) : args.mode === "radio" ? (
          <DropdownMenuRadioGroup
            value={args.value}
            onValueChange={(value) => {
              args.onValueChange(value);
              updateArgs({ value });
              onResult?.("Sort order: " + value);
            }}
          >
            <DropdownMenuRadioItem
              value="newest"
              disabled={args.disabled}
              description={args.description || undefined}
              suffix={args.suffix || undefined}
              onSelect={(event) => event.preventDefault()}
            >
              {args.itemLabel}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="oldest"
              onSelect={(event) => event.preventDefault()}
            >
              Oldest first
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="unread"
              onSelect={(event) => event.preventDefault()}
            >
              Unread first
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        ) : args.mode === "submenu" ? (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={args.disabled}>
                {args.showIcon && <Copy className="h-4 w-4" />}
                {args.itemLabel}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                <DropdownMenuItem
                  onSelect={(event) => select(event, "Link copied")}
                >
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => select(event, "Email draft opened")}
                >
                  Email draft
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onSelect={(event) => select(event, "Conversation archived")}
            >
              Archive conversation
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              disabled={args.disabled}
              description={args.description || undefined}
              suffix={args.suffix || undefined}
              asChild={args.mode === "link"}
              className={
                args.destructive
                  ? "text-semantic-error-text focus:text-semantic-error-text"
                  : undefined
              }
              onSelect={(event) => select(event, args.itemLabel)}
            >
              {args.mode === "link" ? (
                <a href="#conversation-details">{args.itemLabel}</a>
              ) : (
                <>
                  {args.showIcon && <Edit className="h-4 w-4" />}
                  {args.itemLabel}
                  {args.showShortcut && (
                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                  )}
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => select(event, "Conversation duplicated")}
            >
              {args.showIcon && <Copy className="h-4 w-4" />}Duplicate
              {args.showShortcut && (
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-semantic-error-text focus:text-semantic-error-text"
              onSelect={(event) => select(event, "Conversation archived")}
            >
              {args.showIcon && <Trash className="h-4 w-4" />}Archive
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta: Meta<MenuArgs> = {
  title: "V2/Components/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      exclude: ["mode", "checked", "value", "onCheckedChange", "onValueChange"],
      include: [
        "open",
        "modal",
        "side",
        "align",
        "sideOffset",
        "triggerLabel",
        "groupLabel",
        "itemLabel",
        "description",
        "suffix",
        "showIcon",
        "showShortcut",
        "disabled",
        "destructive",
        "iconTrigger",
        "mode",
        "checked",
        "value",
        "onOpenChange",
        "onSelect",
        "onCheckedChange",
        "onValueChange",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-7148",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "dropdown-menu",
          exportName:
            "DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem",
          summary:
            "Keyboard-accessible action menus with independent choices, single choices and nested actions.",
          changes: [
            [
              "Items",
              "Compact 14px rows",
              "48px minimum, 16px Inter, 10px / 6px padding",
            ],
            ["Selection", "Dark checkmark", "Teal checkmark"],
            ["Container", "6px corners", "8px corners"],
            [
              "Descriptions / suffixes",
              "Wrapped labels and trailing content",
              "Preserved; 12px muted supporting text",
            ],
            [
              "Composition",
              "Radix asChild props",
              "Preserved, including decorated anchors and buttons",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Hover", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Supporting text", "--semantic-text-muted", "#717680", "#717680"],
            [
              "Selected check",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            ["Destructive", "--semantic-error-text", "#B42318", "#B42318"],
            ["Disabled", "--semantic-disabled-primary", "#A2A6B1", "#A2A6B1"],
          ],
          guidance:
            "Overview controls the real Root and Content, and labels custom item/trigger arguments as composition. Use checkboxes for independent choices and a radio group for a single choice. The selection stories keep menus open with onSelect.preventDefault; Escape returns focus. asChild accepts one real anchor or button and keeps its props/ref. Galleries are contained inline visual presentations without portal or focus scopes. There is one item size; no artificial size API is introduced.",
        }),
      },
    },
  },
  args: {
    open: false,
    modal: true,
    side: "bottom",
    align: "start",
    sideOffset: 4,
    triggerLabel: "Conversation actions",
    groupLabel: "Conversation",
    itemLabel: "Edit conversation",
    description: "",
    suffix: "",
    showIcon: true,
    showShortcut: false,
    disabled: false,
    destructive: false,
    iconTrigger: false,
    mode: "actions",
    checked: false,
    value: "newest",
    onOpenChange: fn(),
    onSelect: fn(),
    onCheckedChange: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "DropdownMenu" } },
    modal: { control: "boolean", table: { category: "DropdownMenu" } },
    onOpenChange: { control: false, table: { category: "DropdownMenu" } },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      table: { category: "DropdownMenuContent" },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      table: { category: "DropdownMenuContent" },
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 40 },
      table: { category: "DropdownMenuContent" },
    },
    triggerLabel: {
      control: "text",
      table: { category: "Example composition" },
    },
    groupLabel: { control: "text", table: { category: "Example composition" } },
    itemLabel: { control: "text", table: { category: "Example composition" } },
    description: { control: "text", table: { category: "Item composition" } },
    suffix: { control: "text", table: { category: "Item composition" } },
    showIcon: { control: "boolean", table: { category: "Item composition" } },
    showShortcut: {
      control: "boolean",
      table: { category: "Item composition" },
    },
    disabled: { control: "boolean", table: { category: "Item composition" } },
    destructive: {
      control: "boolean",
      table: { category: "Item composition" },
    },
    iconTrigger: {
      control: "boolean",
      table: { category: "Example composition" },
    },
    mode: {
      control: "select",
      options: ["actions", "checkbox", "radio", "submenu", "link"],
      table: { category: "Example composition" },
    },
    checked: { control: "boolean", table: { category: "Checkbox item" } },
    value: {
      control: "select",
      options: ["newest", "oldest", "unread"],
      table: { category: "Radio group" },
    },
    onSelect: { control: false, table: { category: "DropdownMenuItem" } },
    onCheckedChange: { control: false, table: { category: "Checkbox item" } },
    onValueChange: { control: false, table: { category: "Radio group" } },
    children: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<MenuArgs>();
    return (
      <div className="flex min-h-48 items-start justify-center p-12">
        <MenuExample args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const IconTrigger: Story = { args: { iconTrigger: true, align: "end" } };
export const WithShortcuts: Story = { args: { showShortcut: true } };
export const DisabledItems: Story = { args: { disabled: true } };
export const WithDescriptionAndSuffix: Story = {
  args: {
    description: "Change the conversation name and assignee.",
    suffix: "⌘E",
    showIcon: false,
  },
};
export const Destructive: Story = {
  args: { destructive: true, itemLabel: "Delete conversation" },
};
export const AsChildLink: Story = {
  name: "asChild link",
  args: {
    mode: "link",
    itemLabel: "Conversation details",
    description: "A real anchor, with its URL and decoration preserved.",
  },
  parameters: {
    controls: { exclude: ["showIcon", "showShortcut", "checked", "value"] },
  },
};
export const Checkboxes: Story = {
  args: {
    mode: "checkbox",
    groupLabel: "Inbox preferences",
    itemLabel: "Desktop notifications",
    description: "Notify me about new messages.",
  },
  parameters: {
    controls: {
      exclude: ["mode", "showIcon", "showShortcut", "destructive", "value"],
    },
  },
};
export const RadioGroups: Story = {
  args: {
    mode: "radio",
    groupLabel: "Sort conversations",
    itemLabel: "Newest first",
  },
  parameters: {
    controls: {
      exclude: ["mode", "showIcon", "showShortcut", "destructive", "checked"],
    },
  },
};
export const Submenus: Story = {
  args: { mode: "submenu", itemLabel: "Share conversation" },
  parameters: {
    controls: {
      exclude: [
        "mode",
        "description",
        "suffix",
        "showShortcut",
        "destructive",
        "checked",
        "value",
      ],
    },
  },
};

/** Inline visual rows; native buttons are independent of Radix portal state. */
function InlineMenu({
  args,
  version = "v2",
  state,
}: {
  args: MenuArgs;
  version?: "v1" | "v2";
  state?: string;
}) {
  const [checked, setChecked] = React.useState(args.checked);
  React.useEffect(() => setChecked(args.checked), [args.checked]);
  const row = cn(
    "relative flex w-full min-w-0 items-center gap-2 border-0 bg-transparent text-left outline-none",
    version === "v2"
      ? "min-h-12 rounded-none px-1.5 py-2.5 text-base font-normal"
      : "rounded-sm px-2 py-2 text-sm text-semantic-text-secondary"
  );
  return (
    <div
      data-presentation="inline"
      data-version={version}
      className={cn(
        "w-72 max-w-full border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-md",
        version === "v2"
          ? "rounded-lg font-[family-name:var(--font-v2,Inter,sans-serif)]"
          : "rounded-md"
      )}
    >
      <div className="px-2 py-1.5 text-sm font-semibold text-semantic-text-secondary">
        {args.groupLabel}
      </div>
      <div className="-mx-1 my-1 h-px bg-semantic-border-layout" />
      <button
        className={cn(
          row,
          args.destructive && "text-semantic-error-text",
          state === "Focus" && "bg-semantic-bg-ui",
          "hover:bg-semantic-bg-ui disabled:text-semantic-disabled-primary"
        )}
        disabled={state === "Disabled" || args.disabled}
        onClick={() => args.onSelect({ type: "select", label: args.itemLabel })}
      >
        {args.showIcon && <Edit className="h-4 w-4 shrink-0" />}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="whitespace-normal break-words">
            {args.itemLabel}
          </span>
          {args.description && (
            <span className="text-xs text-semantic-text-muted">
              {args.description}
            </span>
          )}
        </span>
        {args.suffix && (
          <span className="shrink-0 text-xs text-semantic-text-muted">
            {args.suffix}
          </span>
        )}
        {args.showShortcut && (
          <span className="inline-flex h-5 items-center rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary px-1 text-xs text-semantic-text-muted">
            ⌘E
          </span>
        )}
      </button>
      <button
        className={cn(
          row,
          "pl-8 hover:bg-semantic-bg-ui disabled:text-semantic-disabled-primary"
        )}
        disabled={args.disabled}
        aria-pressed={checked}
        onClick={() => {
          setChecked(!checked);
          args.onCheckedChange(!checked);
        }}
      >
        {checked && (
          <Check
            className={cn(
              "absolute left-2 h-4 w-4",
              version === "v2"
                ? "text-semantic-border-accent"
                : "text-semantic-text-primary"
            )}
          />
        )}
        Desktop notifications
      </button>
      <button
        className={cn(row, "hover:bg-semantic-bg-ui")}
        onClick={() =>
          args.onSelect({ type: "select", label: "Share conversation" })
        }
      >
        Share conversation
        <ChevronRight className="ml-auto h-4 w-4" />
      </button>
      <div className="-mx-1 my-1 h-px bg-semantic-border-layout" />
      <button
        className={cn(row, "text-semantic-error-text hover:bg-semantic-bg-ui")}
        onClick={() => args.onSelect({ type: "select", label: "Archive" })}
      >
        {args.showIcon && <Trash className="h-4 w-4" />}Archive
      </button>
    </div>
  );
}
const INLINE = [
  "open",
  "modal",
  "side",
  "align",
  "sideOffset",
  "triggerLabel",
  "iconTrigger",
  "mode",
  "value",
  "onOpenChange",
  "onValueChange",
];
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      [...INLINE, "description", "suffix", "showShortcut", "destructive"],
      "Plain, descriptive and destructive item compositions are fixed. Other item controls affect each inline menu. These bounded presentations create no Radix portal; use the individual stories for keyboard interaction."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[940px] grid-cols-3 items-start gap-6">
        {[
          {
            label: "Plain actions",
            description: "",
            suffix: "",
            showShortcut: true,
            destructive: false,
          },
          {
            label: "Supporting text",
            description: "Manage the conversation and its assignee.",
            suffix: "⌘E",
            showShortcut: false,
            destructive: false,
          },
          {
            label: "Destructive action",
            description: "This action cannot be undone.",
            suffix: "",
            showShortcut: false,
            destructive: true,
          },
        ].map(({ label, ...fixed }) => (
          <div key={label} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {label}
            </span>
            <InlineMenu args={{ ...args, ...fixed }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      [...INLINE, "disabled"],
      "Default, focused and disabled rows use the same recorded size. Disabled is fixed; text, icons, shortcuts and checked Controls remain live. Checkbox samples are independent."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[940px] grid-cols-3 items-start gap-6">
        {["Default", "Focus", "Disabled"].map((state) => (
          <div key={state} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {state}
            </span>
            <InlineMenu
              args={{ ...args, disabled: state === "Disabled" }}
              state={state}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  args: {
    checked: true,
    description: "Edit the name and assignee.",
    showShortcut: true,
  },
  parameters: {
    ...gallery(
      INLINE,
      "The same complete menu composition in both versions: label, divider, action, selection, submenu and destructive item. Widths are equal, and the row size, check color, type and container corners reflect each version."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[640px] grid-cols-2 items-start gap-8">
        {(["v1", "v2"] as const).map((version) => (
          <div key={version} className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-semantic-text-muted">
              {version} ·{" "}
              {version === "v1" ? "ui/dropdown-menu" : "ui/v2/dropdown-menu"}
            </span>
            <InlineMenu args={args} version={version} />
          </div>
        ))}
      </div>
    </div>
  ),
};

function WorkspaceActions({
  args,
  updateArgs,
}: {
  args: MenuArgs;
  updateArgs: (next: Partial<MenuArgs>) => void;
}) {
  const [result, setResult] = React.useState("No action selected.");
  return (
    <section className="flex w-[560px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-base font-semibold text-semantic-text-primary">
            Customer support inbox
          </p>
          <p className="m-0 text-xs text-semantic-text-muted">
            Choose an action, preference or sort order. This example changes
            local state.
          </p>
        </div>
        <MenuExample args={args} updateArgs={updateArgs} onResult={setResult} />
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-semantic-text-muted">Notifications</dt>
        <dd className="m-0 text-semantic-text-primary">
          {args.checked ? "Enabled" : "Disabled"}
        </dd>
        <dt className="text-semantic-text-muted">Sort order</dt>
        <dd className="m-0 text-semantic-text-primary">{args.value}</dd>
      </dl>
      <p
        id="conversation-details"
        className="m-0 text-xs text-semantic-text-muted"
        role="status"
      >
        {result}
      </p>
    </section>
  );
}
export const Usage: Story = {
  args: {
    mode: "checkbox",
    itemLabel: "Desktop notifications",
    triggerLabel: "Inbox actions",
    groupLabel: "Inbox",
    iconTrigger: true,
    align: "end",
  },
  parameters: {
    controls: {
      exclude: [
        "destructive",
        "showIcon",
        "showShortcut",
        "description",
        "suffix",
      ],
    },
    docs: {
      description: {
        story:
          "A real action menu in an inbox card. Actions update local status; choose checkbox or radio mode to change preferences and see their Controls synchronize. The link mode uses a real local anchor. No network action is performed.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<MenuArgs>();
    return <WorkspaceActions args={args} updateArgs={updateArgs} />;
  },
};
