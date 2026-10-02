import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Check } from "lucide-react";
import {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from "./select-field";
import { SelectField as SelectFieldV1 } from "../select-field";
import { Button } from "./button";
import { Input } from "./input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = SelectFieldProps & { width: number };
const AUTH: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
const GROUPED: SelectOption[] = [
  { value: "support", label: "Support agents", group: "People" },
  { value: "managers", label: "Managers", group: "People" },
  { value: "all-teams", label: "All teams", group: "Groups" },
  { value: "sales", label: "Sales team", group: "Groups" },
  { value: "archive", label: "Archived team", group: "Groups", disabled: true },
];
const MANY: SelectOption[] = Array.from({ length: 48 }, (_, i) => ({
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
function validOptions(options: SelectOption[]) {
  return Array.isArray(options)
    ? options.filter(
        (o) =>
          o &&
          typeof o.value === "string" &&
          o.value.length > 0 &&
          typeof o.label === "string"
      )
    : [];
}
function Example({
  width,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const Component = version === "v1" ? SelectFieldV1 : SelectField;
  const options = validOptions(props.options);
  const query = props.searchValue?.trim().toLowerCase();
  const filtered =
    props.searchable && props.searchValue !== undefined && query
      ? options.filter(
          (o) =>
            o.label.toLowerCase().includes(query) || o.value === props.value
        )
      : options;
  return (
    <div className="max-w-full" style={{ width }}>
      <Component {...props} options={filtered} />
    </div>
  );
}
function PreviewField({
  value = "",
  searchValue = "",
  onValueChange,
  onSearchChange,
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [selected, setSelected] = React.useState(value);
  const [query, setQuery] = React.useState(searchValue);
  return (
    <Example
      {...args}
      value={selected}
      searchValue={query}
      onValueChange={(next) => {
        setSelected(next);
        onValueChange?.(next);
      }}
      onSearchChange={(next) => {
        setQuery(next);
        onSearchChange?.(next);
      }}
    />
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
    onSearchChange: (searchValue) => {
      args.onSearchChange?.(searchValue);
      updateArgs({ searchValue });
    },
  };
}
const meta: Meta<Args> = {
  title: "V2/Components/SelectField",
  component: SelectField,
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
        "required",
        "disabled",
        "loading",
        "options",
        "searchable",
        "searchValue",
        "searchPlaceholder",
        "separateGroups",
        "truncateOptionText",
        "emptyMessage",
        "loadingMore",
        "hasMore",
        "width",
        "onValueChange",
        "onSelect",
        "onSearchChange",
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
          name: "select-field",
          summary:
            "A complete labelled select with live search, grouping, validation, action items and viewport pagination.",
          changes: [
            ["Trigger", "42px / 4px", "40px / 8px"],
            [
              "Typography",
              "Inherited font",
              "Inter 16px value; 14px semibold label; 12px supporting text",
            ],
            ["Hover", "Default border", "#C0C3CA enabled border"],
            ["Focus", "Thin teal shadow", "#27ABB8 border and soft 4px halo"],
            ["Error", "Red border", "Red border and soft 4px halo"],
            [
              "Disabled / loading",
              "Reduced opacity",
              "Solid grey field without opacity loss",
            ],
            [
              "Behavior",
              "Search, groups, onSelect, interceptValue, pagination",
              "Same current props and behavior",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Label", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Helper", "--semantic-text-muted", "#717680", "#717680"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Error text", "--semantic-error-text", "#B42318", "#B42318"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Font", "--font-v2", "Inter 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Overview controls both selection and search. The example filters the supplied options upstream because a controlled searchValue deliberately skips the component's internal filter. Keep selected options available while searching. interceptValue can reject action-item commits while onSelect still opens a dialog. loading disables the trigger; loadingMore is a footer for an already-open list.",
        }),
      },
    },
  },
  args: {
    label: "Authentication",
    value: "",
    placeholder: "Select a method",
    helperText: "Choose how this webhook authenticates.",
    error: "",
    required: false,
    disabled: false,
    loading: false,
    options: AUTH,
    searchable: false,
    searchValue: "",
    searchPlaceholder: "Search methods…",
    separateGroups: false,
    truncateOptionText: false,
    emptyMessage: "No options available",
    loadingMore: false,
    hasMore: true,
    width: 420,
    onValueChange: fn(),
    onSelect: fn(),
    onSearchChange: fn(),
    onScrollEnd: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: {
      control: "text",
      description: "Live selected value; selection updates this Control.",
    },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    error: { control: "text" },
    required: {
      control: "boolean",
      description: "Displays the required label marker.",
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    options: { control: "object" },
    searchable: { control: "boolean" },
    searchValue: {
      control: "text",
      description:
        "Live controlled query. This example filters options upstream and synchronizes typing.",
    },
    searchPlaceholder: { control: "text" },
    separateGroups: { control: "boolean" },
    truncateOptionText: { control: "boolean" },
    emptyMessage: { control: "text" },
    loadingMore: { control: "boolean" },
    hasMore: { control: "boolean" },
    width: {
      control: { type: "number", min: 240, max: 700, step: 20 },
      description: "Container width in this example.",
      table: { category: "Example" },
    },
    defaultValue: { control: false },
    interceptValue: { control: false },
    onValueChange: { control: false },
    onSelect: { control: false },
    onSearchChange: { control: false },
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
export const WithLabel: Story = {
  name: "With required label",
  args: { required: true },
};
export const WithHelperText: Story = {
  name: "With helper text",
  args: { helperText: "You can change this later." },
};
export const Error: Story = {
  args: { error: "Choose an authentication method." },
};
export const Disabled: Story = { args: { disabled: true, value: "bearer" } };
export const LoadingState: Story = {
  name: "Loading",
  args: { loading: true, placeholder: "Fetching methods…", options: [] },
};
export const WithGroups: Story = {
  name: "With groups",
  args: { label: "Routing", options: GROUPED, placeholder: "Select a group" },
};
export const Searchable: Story = { args: { searchable: true } };
export const SearchableWithGroups: Story = {
  name: "Searchable groups",
  args: {
    ...WithGroups.args,
    searchable: true,
    searchPlaceholder: "Search teams…",
  },
};
export const SearchableWithGroupsSeparator: Story = {
  name: "Searchable separated groups",
  args: { ...SearchableWithGroups.args, separateGroups: true },
};
export const EmptyState: Story = {
  name: "Empty options",
  args: { options: [], emptyMessage: "No teams yet. Add a team to begin." },
};
export const LongOption: Story = {
  name: "Long option labels",
  args: {
    width: 280,
    options: [
      {
        value: "support",
        label:
          "Customer support team handling product questions and account requests",
      },
      {
        value: "sales",
        label:
          "Sales team handling enterprise plans and new customer onboarding",
      },
    ],
    label: "Team",
    placeholder: "Select a team",
  },
};
export const LoadingMore: Story = {
  name: "Loading more",
  args: { loadingMore: true, searchable: true },
};
export const EndOfList: Story = {
  name: "End of list",
  args: { hasMore: false, searchable: true },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["error"],
    "Rows fix default and error treatments. Every other control applies to both fields; search and selection remain independent."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {["", "Check this selection."].map((error) => (
        <section key={error} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            {error ? "Error" : "Default"}
          </p>
          <PreviewField
            {...args}
            key={error + String(args.value) + String(args.searchValue)}
            error={error}
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
    "SelectField has one 40px trigger height. These examples fix 420px and 280px containers; other Controls apply to both."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {[420, 280].map((width) => (
        <section key={width} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            40px height · {width}px container
          </p>
          <PreviewField
            {...args}
            key={String(args.value) + String(args.searchValue)}
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
      ["error", "disabled", "loading", "width"],
      "Rows fix treatment; columns fix interaction state. Text, required, value, options and search Controls apply across a contained grid."
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
            className="m-0 text-xs font-semibold text-semantic-text-muted"
          >
            {c.label}
          </p>
        ))}
        {["", "Check this selection."].map((error) => (
          <React.Fragment key={error}>
            <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
              {error ? "Error" : "Default"}
            </p>
            {COLUMNS.map((c) => (
              <PreviewField
                {...args}
                key={c.label + String(args.value) + String(args.searchValue)}
                error={error}
                disabled={c.disabled}
                loading={c.loading}
                width={200}
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
      ["error", "disabled", "loading", "width"],
      "Both versions share text/options/value Controls. Rows compare all public visual states; search and selection remain independent."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[870px] grid-cols-[110px_1fr_1fr] items-start gap-x-8 gap-y-6">
        <div />
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v1 · ui/select-field
        </p>
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v2 · ui/v2/select-field
        </p>
        {[
          { label: "Default", error: "", disabled: false, loading: false },
          {
            label: "Error",
            error: "Check this selection.",
            disabled: false,
            loading: false,
          },
          { label: "Disabled", error: "", disabled: true, loading: false },
          { label: "Loading", error: "", disabled: false, loading: true },
        ].map((row) => (
          <React.Fragment key={row.label}>
            <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
              {row.label}
            </p>
            {(["v1", "v2"] as const).map((version) => (
              <PreviewField
                {...args}
                key={version + String(args.value) + String(args.searchValue)}
                version={version}
                width={340}
                error={row.error}
                disabled={row.disabled}
                loading={row.loading}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function UsageForm(args: Args) {
  const [invalid, setInvalid] = React.useState(false),
    [saved, setSaved] = React.useState<string | null>(null);
  return (
    <form
      noValidate
      className="flex w-[480px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!args.value) {
          setInvalid(true);
          return;
        }
        setInvalid(false);
        setSaved(args.value);
      }}
    >
      <div>
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Webhook authentication
        </p>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Choose a method for this local example.
        </p>
      </div>
      <Example
        {...args}
        error={invalid ? "Choose an authentication method." : args.error}
        onValueChange={(value) => {
          setInvalid(false);
          setSaved(null);
          args.onValueChange?.(value);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-semantic-border-layout pt-4">
        <span role="status" className="text-xs text-semantic-text-muted">
          {saved && saved === args.value ? (
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
              args.onValueChange?.("");
              args.onSearchChange?.("");
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
  args: { required: true, searchable: true },
  render: function Render(args) {
    return <UsageForm {...useLiveArgs(args)} />;
  },
};
export const FormExample: Story = { ...Usage, name: "Form example" };
export const WebhookFormExample: Story = { ...Usage, name: "Webhook form" };
export const Controlled: Story = { ...Usage, name: "Controlled form" };
function SelectionDetails(args: Args) {
  const live = args;
  const [last, setLast] = React.useState<SelectOption | null>(null);
  return (
    <div className="max-w-full space-y-4">
      <Example
        {...live}
        onSelect={(option) => {
          args.onSelect?.(option);
          setLast(option);
        }}
      />
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {last
          ? `Selected ${last.label} · ${last.value}`
          : "Select an option to inspect the full option object."}
      </p>
    </div>
  );
}
export const OnSelect: Story = {
  name: "onSelect callback",
  render: function Render(args) {
    return <SelectionDetails {...useLiveArgs(args)} />;
  },
};
function ActionItem(args: Args) {
  const live = args;
  const [open, setOpen] = React.useState(false),
    [name, setName] = React.useState("");
  const [created, setCreated] = React.useState<SelectOption | null>(null);
  const nameId = React.useId();
  const options = [
    ...validOptions(args.options),
    ...(created ? [created] : []),
    { value: "__create", label: "Add custom method…" },
  ];
  return (
    <div className="max-w-full space-y-3">
      <Example
        {...live}
        options={options}
        interceptValue={(value) => value !== "__create"}
        onSelect={(option) => {
          args.onSelect?.(option);
          if (option.value === "__create") setOpen(true);
        }}
      />
      <p className="m-0 text-xs text-semantic-text-muted">
        The action opens a dialog while preserving the previous selection.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Add a method</DialogTitle>
            <DialogDescription>
              Create a local option in this example.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const option = { value: "custom-method", label: name.trim() };
              setCreated(option);
              live.onValueChange?.(option.value);
              setOpen(false);
              setName("");
            }}
          >
            <div className="space-y-1.5">
              <label
                htmlFor={nameId}
                className="text-sm font-semibold text-semantic-text-secondary"
              >
                Method name
              </label>
              <Input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example authentication"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!name.trim()}>
                Create method
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export const InterceptValue: Story = {
  name: "Action items",
  args: { value: "basic" },
  parameters: gallery(
    ["options"],
    "The example appends a custom action option. Other controls apply; interceptValue preserves the selection until the dialog creates a method."
  ),
  render: function Render(args) {
    return <ActionItem {...useLiveArgs(args)} />;
  },
};
function PaginationExample(args: Args) {
  const live = args;
  const [count, setCount] = React.useState(12),
    [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const options = validOptions(args.options),
    hasMore = args.hasMore !== false && count < options.length;
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const load = () => {
    if (pending || !hasMore) return;
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
        onScrollEnd={load}
        loadingMore={args.loadingMore || pending}
        hasMore={hasMore}
      />
      <div className="flex items-center justify-between gap-4">
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          {Math.min(count, options.length)} of {options.length} options loaded
        </p>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending || !hasMore || args.disabled || args.loading}
          onClick={load}
        >
          {pending ? "Loading…" : "Load next page"}
        </Button>
      </div>
      <p className="m-0 text-xs text-semantic-text-muted">
        Scroll to the end of the popup or load a page here. Data stays local.
      </p>
    </div>
  );
}
export const LazyLoad: Story = {
  name: "Lazy loading",
  args: {
    label: "Agent",
    placeholder: "Select an agent",
    options: MANY,
    searchable: false,
  },
  render: function Render(args) {
    return <PaginationExample {...useLiveArgs(args)} />;
  },
};
function ServerSearch(args: Args) {
  const live = args;
  return (
    <div className="max-w-full space-y-4">
      <Example {...live} />
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {args.searchValue
          ? `Local filtered results for “${args.searchValue}”`
          : "Type a query in the open popup."}
      </p>
      <p className="m-0 text-xs text-semantic-text-muted">
        This controlled-search example uses a local mock dataset; no network
        request is made.
      </p>
    </div>
  );
}
export const ServerSideSearch: Story = {
  name: "Controlled search",
  args: {
    label: "Agent",
    placeholder: "Select an agent",
    options: MANY,
    searchable: true,
    searchPlaceholder: "Search agents…",
  },
  render: function Render(args) {
    return <ServerSearch {...useLiveArgs(args)} />;
  },
};
