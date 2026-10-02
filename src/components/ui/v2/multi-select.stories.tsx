import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Check } from "lucide-react";
import {
  MultiSelect,
  flattenMultiSelectOptions,
  type MultiSelectProps,
  type MultiSelectOption,
  type MultiSelectOptionInput,
} from "./multi-select";
import { MultiSelect as MultiSelectV1 } from "../multi-select";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = MultiSelectProps & { width: number; showSummary: boolean };
const SKILLS: MultiSelectOption[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "design", label: "Product design" },
  { value: "research", label: "User research" },
];
const DETAILED: MultiSelectOption[] = [
  {
    value: "support",
    label: "Support",
    caption: "Assigned to the support team",
    group: "Teams",
  },
  {
    value: "sales",
    label: "Sales",
    caption: "Assigned to the sales team",
    group: "Teams",
  },
  {
    value: "marketing",
    label: "Marketing",
    caption: "Assigned to the marketing team",
    group: "Teams",
  },
  {
    value: "archive",
    label: "Archived line",
    caption: "This line is unavailable",
    group: "Other",
    isDisabled: true,
    overlayMsg: "Restore this line before assigning it.",
  },
  {
    value: "deleted",
    label: "Deleted line",
    caption: "This line was removed",
    group: "Other",
    isDeleted: true,
    isDisabled: true,
  },
];
const MANY: MultiSelectOption[] = Array.from({ length: 48 }, (_, i) => ({
  value: `agent-${i + 1}`,
  label: `Support agent ${i + 1}`,
}));
const COLUMNS = [
  { label: "Default", disabled: false, loading: false },
  {
    label: "Hover",
    disabled: false,
    loading: false,
    className: "pseudo-hover",
  },
  {
    label: "Focus",
    disabled: false,
    loading: false,
    className: "pseudo-focus",
  },
  { label: "Disabled", disabled: true, loading: false },
  {
    label: "Disabled + hover",
    disabled: true,
    loading: false,
    className: "pseudo-hover",
  },
  { label: "Loading", disabled: false, loading: true },
] as const;
function optionsFor(input: MultiSelectOptionInput): MultiSelectOption[] {
  if (!Array.isArray(input)) return [];
  const clean = input.filter((o) => o && typeof o === "object");
  try {
    return flattenMultiSelectOptions(clean as MultiSelectOptionInput).filter(
      (o) => typeof o.value === "string" && typeof o.label === "string"
    );
  } catch {
    return [];
  }
}
function valuesFor(value?: string[]) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}
function Example({
  width,
  showSummary,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const Component = version === "v1" ? MultiSelectV1 : MultiSelect;
  const options = optionsFor(props.options),
    value = valuesFor(props.value),
    query = props.searchQuery?.trim().toLowerCase();
  const filtered =
    props.searchable && props.searchQuery !== undefined && query
      ? options.filter(
          (o) =>
            value.includes(o.value) ||
            `${o.label} ${o.caption || o.secondaryText || ""} ${o.group || ""}`
              .toLowerCase()
              .includes(query)
        )
      : options;
  return (
    <div className="max-w-full" style={{ width }}>
      <Component
        {...props}
        value={value}
        options={filtered}
        summaryLabel={
          showSummary ? (count) => `${count} selected` : props.summaryLabel
        }
      />
    </div>
  );
}
function useLiveArgs(args: Args): Args {
  const [, updateArgs] = useArgs();
  return {
    ...args,
    onValueChange: (value) => {
      args.onValueChange?.(value);
      updateArgs({ value });
    },
    onSearchQueryChange: (searchQuery) => {
      args.onSearchQueryChange?.(searchQuery);
      updateArgs({ searchQuery });
    },
  };
}
function PreviewMulti({
  value = [],
  searchQuery = "",
  onValueChange,
  onSearchQueryChange,
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const [selected, setSelected] = React.useState(valuesFor(value)),
    [query, setQuery] = React.useState(searchQuery);
  return (
    <Example
      {...props}
      value={selected}
      searchQuery={query}
      onValueChange={(next) => {
        setSelected(next);
        onValueChange?.(next);
      }}
      onSearchQueryChange={(next) => {
        setQuery(next);
        onSearchQueryChange?.(next);
      }}
    />
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "label",
        "value",
        "placeholder",
        "helperText",
        "error",
        "state",
        "required",
        "disabled",
        "loading",
        "options",
        "searchable",
        "searchQuery",
        "searchPlaceholder",
        "closeOnEscape",
        "maxSelections",
        "showSelectionFooter",
        "selectAllLabel",
        "optionVariant",
        "separateSelectedWithDivider",
        "showClearAll",
        "showSeparatorBeforeChevron",
        "truncateOptionText",
        "loadingMore",
        "hasMore",
        "showSummary",
        "width",
        "onValueChange",
        "onSearchQueryChange",
        "onScrollEnd",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2118-22190",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "multi-select",
          summary:
            "A multi-select with chips, search, detailed/grouped rows, select-all, selection limits and a portal menu that works inside dialogs.",
          changes: [
            [
              "Trigger",
              "42px minimum / 4px radius",
              "40px minimum / 8px radius; grows when chips wrap",
            ],
            [
              "Typography",
              "Inherited font",
              "Inter 16px value; 14px medium label; 12px helper/error",
            ],
            [
              "Selected chips",
              "Small corners",
              "8px radius, 0.4px border and medium text",
            ],
            [
              "Hover / focus",
              "Default border / thin teal shadow",
              "#C0C3CA hover; #27ABB8 focus and soft 4px halo",
            ],
            ["Error", "Red border", "Red border with soft 4px halo"],
            [
              "Disabled / loading",
              "Reduced opacity",
              "Solid grey field and inactive chip controls",
            ],
            [
              "Behavior",
              "Detailed aliases, grouped sections, limits, paging and dialog portal",
              "Same current public props and behavior",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Label", "--v2-text-primary", "#484848", "#484848"],
            ["Helper", "--semantic-text-muted", "#717680", "#717680"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Error text", "--semantic-error-text", "#B42318", "#B42318"],
            [
              "Disabled / chip surface",
              "--semantic-bg-ui",
              "#F5F5F5",
              "#F5F5F5",
            ],
            ["Font", "--font-v2", "Inter 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Selection and search query synchronize with Controls. The example filters a controlled query upstream and retains selected options so chip labels remain available. optionVariant selects simple checks or detailed checkbox/caption rows. closeOnEscape defaults false in the component; enabling it adds Escape dismissal. showSummary is an example toggle that supplies summaryLabel. All examples keep requests and saves local.",
        }),
      },
    },
  },
  args: {
    label: "Skills",
    value: [],
    placeholder: "Select skills",
    helperText: "Choose the skills this team uses.",
    error: "",
    state: "default",
    required: false,
    disabled: false,
    loading: false,
    options: SKILLS,
    searchable: false,
    searchQuery: "",
    searchPlaceholder: "Search skills…",
    closeOnEscape: false,
    maxSelections: 4,
    showSelectionFooter: true,
    selectAllLabel: "",
    optionVariant: "simple",
    separateSelectedWithDivider: false,
    showClearAll: true,
    showSeparatorBeforeChevron: false,
    truncateOptionText: false,
    loadingMore: false,
    hasMore: false,
    showSummary: false,
    width: 420,
    onValueChange: fn(),
    onSearchQueryChange: fn(),
    onScrollEnd: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: {
      control: "object",
      description:
        "Live selected values; toggling/removing updates this Control.",
    },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    error: { control: "text" },
    state: { control: "select", options: ["default", "error"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    options: { control: "object" },
    searchable: { control: "boolean" },
    searchQuery: {
      control: "text",
      description:
        "Live controlled query; the example filters options upstream.",
    },
    searchPlaceholder: { control: "text" },
    closeOnEscape: { control: "boolean" },
    maxSelections: { control: { type: "number", min: 1, max: 12, step: 1 } },
    showSelectionFooter: { control: "boolean" },
    selectAllLabel: { control: "text" },
    optionVariant: { control: "select", options: ["simple", "detailed"] },
    separateSelectedWithDivider: { control: "boolean" },
    showClearAll: { control: "boolean" },
    showSeparatorBeforeChevron: { control: "boolean" },
    truncateOptionText: { control: "boolean" },
    loadingMore: { control: "boolean" },
    hasMore: { control: "boolean" },
    showSummary: { control: "boolean", table: { category: "Example" } },
    width: {
      control: { type: "number", min: 240, max: 700, step: 20 },
      table: { category: "Example" },
    },
    defaultValue: { control: false },
    summaryLabel: { control: false },
    menuContainer: { control: false },
    onValueChange: { control: false },
    onSearchQueryChange: { control: false },
    onScrollEnd: { control: false },
  },
  render: function Render(args) {
    return <Example {...useLiveArgs(args)} />;
  },
};
export default meta;
type Story = StoryObj<Args>;
export const Overview: Story = {};
export const Default: Story = {};
export const Error: Story = { args: { error: "Select at least one skill." } };
export const Disabled: Story = {
  args: { value: ["react", "typescript"], disabled: true },
};
export const Loading: Story = { args: { loading: true } };
export const WithTags: Story = {
  name: "Selected chips",
  args: { value: ["react", "typescript"] },
};
export const MaxSelections: Story = {
  name: "Selection limit",
  args: { maxSelections: 2 },
};
export const Searchable: Story = { args: { searchable: true } };
export const SelectAll: Story = {
  name: "Select all",
  args: { selectAllLabel: "All skills" },
};
export const Summary: Story = {
  args: {
    value: ["react", "typescript"],
    showSummary: true,
    selectAllLabel: "All skills",
  },
};
export const WithDisabledOptions: Story = {
  name: "Disabled options",
  args: {
    options: [
      ...SKILLS,
      {
        value: "enterprise",
        label: "Enterprise tools",
        disabled: true,
        disabledTooltip: "This option is unavailable on this plan.",
      },
    ],
  },
};
export const DetailedWhatsAppStyle: Story = {
  name: "Detailed rows",
  args: {
    label: "Lines",
    options: DETAILED,
    optionVariant: "detailed",
    searchable: true,
    searchPlaceholder: "Search lines…",
    showClearAll: false,
    showSeparatorBeforeChevron: true,
    separateSelectedWithDivider: true,
    value: ["support"],
  },
};
export const GroupedDetailed: Story = {
  name: "Grouped detailed rows",
  args: {
    ...DetailedWhatsAppStyle.args,
    separateSelectedWithDivider: false,
    value: [],
    options: [
      { label: "Teams", options: DETAILED.filter((o) => o.group === "Teams") },
      { label: "Other", options: DETAILED.filter((o) => o.group === "Other") },
    ],
  },
};
export const EmptyOptions: Story = {
  name: "Empty options",
  args: { options: [], searchable: true },
};
export const LongOptionLabels: Story = {
  name: "Long option labels",
  args: {
    width: 280,
    options: [
      {
        value: "support",
        label:
          "Customer support escalation queue for enterprise accounts in the APAC region",
      },
      {
        value: "sales",
        label: "Outbound sales and onboarding campaigns with a long team name",
      },
    ],
  },
};
export const LoadingMore: Story = {
  name: "Loading more",
  args: { loadingMore: true, hasMore: true },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state", "error"],
    "Rows fix default/error treatment. Other Controls apply to both fields; selection and queries remain independent."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {["default", "error"].map((state) => (
        <section key={state} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            {state === "error" ? "Error" : "Default"}
          </p>
          <PreviewMulti
            {...args}
            key={state + JSON.stringify(args.value) + args.searchQuery}
            state={state as "default" | "error"}
            error={state === "error" ? "Check this selection." : ""}
          />
        </section>
      ))}
    </div>
  ),
};
export const ValidationStates: Story = {
  ...AllVariants,
  name: "Validation states",
};
export const AllSizes: Story = {
  name: "Height and width",
  parameters: gallery(
    ["width"],
    "The single-line trigger is 40px high and grows when chips wrap. These examples fix container widths; other Controls apply."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {[420, 280].map((width) => (
        <section key={width} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            40px minimum · {width}px container
          </p>
          <PreviewMulti
            {...args}
            key={JSON.stringify(args.value) + args.searchQuery}
            width={width}
          />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "error", "disabled", "loading", "width"],
      "Rows fix treatment, columns fix interaction. Text, options and all other relevant Controls apply to every independent sample."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1420px] grid-cols-[100px_repeat(6,minmax(200px,1fr))] items-start gap-x-5 gap-y-6">
        <div />
        {COLUMNS.map((c) => (
          <p
            key={c.label}
            className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {c.label}
          </p>
        ))}
        {["default", "error"].map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {state}
            </p>
            {COLUMNS.map((c) => (
              <PreviewMulti
                {...args}
                key={c.label + JSON.stringify(args.value) + args.searchQuery}
                width={200}
                state={state as "default" | "error"}
                error={state === "error" ? "Check this selection." : ""}
                disabled={c.disabled}
                loading={c.loading}
                triggerClassName={"className" in c ? c.className : undefined}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["state", "error", "disabled", "loading", "width"],
      "Compare all visual states and both row treatments. Shared Controls apply to both versions; individual fields keep their own selections."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[870px] grid-cols-[110px_1fr_1fr] items-start gap-x-8 gap-y-6">
        <div />
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 · ui/multi-select
        </p>
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 · ui/v2/multi-select
        </p>
        {["default", "error", "disabled", "loading"].map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {state}
            </p>
            {(["v1", "v2"] as const).map((version) => (
              <PreviewMulti
                {...args}
                key={version + JSON.stringify(args.value) + args.searchQuery}
                version={version}
                width={340}
                state={state === "error" ? "error" : "default"}
                error={state === "error" ? "Check this selection." : ""}
                disabled={state === "disabled"}
                loading={state === "loading"}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function UsageForm(args: Args) {
  const live = args;
  const [invalid, setInvalid] = React.useState(false),
    [saved, setSaved] = React.useState<string | null>(null);
  const current = JSON.stringify(valuesFor(args.value));
  return (
    <form
      noValidate
      className="flex w-[480px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valuesFor(args.value).length) {
          setInvalid(true);
          return;
        }
        setInvalid(false);
        setSaved(current);
      }}
    >
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Team skills
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Choose skills for this local example.
        </p>
      </div>
      <Example
        {...live}
        error={invalid ? "Select at least one skill." : args.error}
        onValueChange={(value) => {
          setInvalid(false);
          setSaved(null);
          live.onValueChange?.(value);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-semantic-border-layout pt-4">
        <span
          role="status"
          className="text-xs text-[var(--v2-text-muted,#707070)]"
        >
          {saved === current ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes stay in this example"
          )}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={args.disabled || args.loading}
            onClick={() => {
              args.onValueChange?.([]);
              args.onSearchQueryChange?.("");
              setInvalid(false);
              setSaved(null);
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={args.disabled || args.loading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
export const Usage: Story = {
  args: { required: true, searchable: true, closeOnEscape: true },
  render: function Render(args) {
    return <UsageForm {...useLiveArgs(args)} />;
  },
};
export const Controlled: Story = { ...Usage, name: "Controlled form" };
export const FormExample: Story = { ...Usage, name: "Form example" };
function DialogExample(args: Args) {
  const live = args;
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        disabled={args.disabled || args.loading}
        onClick={() => setOpen(true)}
      >
        Open dialog
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign team skills</DialogTitle>
          <DialogDescription>
            Search and toggle options inside the dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 p-6">
          <Example {...live} />
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export const InsideDialog: Story = {
  name: "Inside a dialog",
  args: { searchable: true, closeOnEscape: true },
  render: function Render(args) {
    return <DialogExample {...useLiveArgs(args)} />;
  },
};
function PagingExample(args: Args) {
  const live = args;
  const options = optionsFor(args.options);
  const [count, setCount] = React.useState(12),
    [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const more = args.hasMore !== false && count < options.length;
  const load = () => {
    if (!more || pending) return;
    args.onScrollEnd?.();
    setPending(true);
    timer.current = setTimeout(() => {
      setCount((n) => Math.min(n + 12, options.length));
      setPending(false);
    }, 250);
  };
  return (
    <div className="max-w-full space-y-4">
      <Example
        {...live}
        options={options.slice(0, count)}
        hasMore={more}
        loadingMore={args.loadingMore || pending}
        onScrollEnd={load}
      />
      <div className="flex items-center justify-between gap-4">
        <p
          role="status"
          className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        >
          {Math.min(count, options.length)} of {options.length} options loaded
        </p>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending || !more || args.disabled || args.loading}
          onClick={load}
        >
          {pending ? "Loading…" : "Load next page"}
        </Button>
      </div>
      <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
        Scroll to the end of the popup or load a page here. Data stays local.
      </p>
    </div>
  );
}
export const InfiniteScroll: Story = {
  name: "Lazy loading",
  args: {
    label: "Agents",
    placeholder: "Select agents",
    options: MANY,
    searchable: true,
    searchPlaceholder: "Search agents…",
    hasMore: true,
  },
  render: function Render(args) {
    return <PagingExample {...useLiveArgs(args)} />;
  },
};
