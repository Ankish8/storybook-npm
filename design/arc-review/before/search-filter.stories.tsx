import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { gallery } from "../../../storybook/v2-preview";
import {
  SearchFilter,
  type SearchFilterProps,
  type SearchFilterOption,
} from "./search-filter";
import { SearchFilter as SearchFilterV1 } from "../search-filter";
import { v2ComponentDocs } from "./story-docs";

const PHONE_OPTIONS: SearchFilterOption[] = [
  { value: "support", label: "+91 11 4000 3001" },
  { value: "sales", label: "+91 11 4000 3453" },
  { value: "operations", label: "+91 11 4000 5444" },
  { value: "billing", label: "+91 11 4000 5002" },
  { value: "archived", label: "+91 11 4000 6789", disabled: true },
];
const TEXT_OPTIONS: SearchFilterOption[] = [
  { value: "support", label: "Customer support" },
  { value: "sales", label: "Sales team" },
  { value: "operations", label: "Operations" },
  { value: "billing", label: "Billing" },
  { value: "archived", label: "Archived team", disabled: true },
];
function LiveFilter({
  args,
  updateArgs,
  version = "v2",
}: {
  args: SearchFilterProps;
  updateArgs: (next: Partial<SearchFilterProps>) => void;
  version?: "v1" | "v2";
}) {
  const selectionEvent = React.useRef(false);
  const Component = version === "v2" ? SearchFilter : SearchFilterV1;
  return (
    <Component
      {...args}
      inputProps={{ ...args.inputProps, "aria-label": "Search options" }}
      onValueChange={(value) => {
        selectionEvent.current = true;
        args.onValueChange?.(value);
        updateArgs({ value });
      }}
      onOptionSelect={(option) => args.onOptionSelect?.(option)}
      onSearchChange={(searchValue) => {
        args.onSearchChange?.(searchValue);
        const selection = selectionEvent.current;
        selectionEvent.current = false;
        updateArgs(selection ? { searchValue } : { searchValue, value: "" });
      }}
    />
  );
}
const meta: Meta<SearchFilterProps> = {
  title: "V2/Components/SearchFilter",
  component: SearchFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "size",
        "options",
        "value",
        "searchValue",
        "searchMode",
        "minSearchLength",
        "searchPlaceholder",
        "emptyMessage",
        "disabled",
        "searchDisabled",
        "onValueChange",
        "onOptionSelect",
        "onSearchChange",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "search-filter",
          exportName: "SearchFilter",
          summary:
            "A searchable single-select field for phone numbers or text lists, composed with the v2 Input and dropdown row styling.",
          changes: [
            [
              "Field",
              "42px legacy input / 4px corners",
              "40px v2 Input, 8px corners, 16px Inter",
            ],
            [
              "Surface",
              "4px corners and legacy list rows",
              "8px surface and 48px rows with 10 / 6px padding",
            ],
            [
              "Rows",
              "14px labels / whole-row disabled opacity",
              "16px labels, explicit disabled text, teal selected check",
            ],
            ["Widths", "320 / 360 / 420px", "Preserved"],
            [
              "Behavior",
              "Numeric/text search, exact option selection, clear and close",
              "Preserved, including cancellation of pending focus on selection",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Selected label", "--v2-text-primary", "#484848", "#484848"],
            ["Choice labels", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            [
              "Selected check",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            ["Hover", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            [
              "Disabled label",
              "--semantic-disabled-primary",
              "#A2A6B1",
              "#A2A6B1",
            ],
            ["Supporting text", "--semantic-text-muted", "#717680", "#717680"],
          ],
          guidance:
            "Provide unique option values and readable labels. Numeric mode strips non-digits and highlights matching phone digits; text mode trims and lowercases the query. value and searchValue are separate controlled values: value marks the selection, while searchValue owns the visible query. Typing clears the selection in this consumer; selecting updates both Controls and closes. Clear resets both and opens the list. minSearchLength delays filtering; below it all options remain visible. The current API supports clicking options, Tab/Enter and Escape; no new arrow-key navigation was introduced. Each gallery sample is independent and uses real list behavior. Usage filters a local conversation queue.",
        }),
      },
    },
  },
  args: {
    size: "default",
    options: PHONE_OPTIONS,
    value: "",
    searchValue: "",
    searchMode: "numeric",
    minSearchLength: 0,
    searchPlaceholder: "Search phone number…",
    emptyMessage: "No matching options",
    disabled: false,
    searchDisabled: false,
    onValueChange: fn(),
    onOptionSelect: fn(),
    onSearchChange: fn(),
  },
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
    options: { control: "object" },
    value: { control: "text" },
    searchValue: { control: "text" },
    searchMode: { control: "radio", options: ["numeric", "text"] },
    minSearchLength: { control: { type: "number", min: 0, step: 1 } },
    searchPlaceholder: { control: "text" },
    emptyMessage: { control: "text" },
    disabled: { control: "boolean" },
    searchDisabled: { control: "boolean" },
    onValueChange: { control: false },
    onOptionSelect: { control: false },
    onSearchChange: { control: false },
    defaultValue: { control: false },
    defaultSearchValue: { control: false },
    inputProps: { control: false },
    className: { control: false },
    listClassName: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SearchFilterProps>();
    return (
      <div className="w-[460px] max-w-full p-5">
        <LiveFilter args={args} updateArgs={updateArgs} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const TextSearch: Story = {
  args: {
    options: TEXT_OPTIONS,
    searchMode: "text",
    searchPlaceholder: "Search teams…",
  },
};
export const Selected: Story = { args: { value: "sales" } };
export const EmptyResults: Story = { args: { searchValue: "9999" } };
export const MinSearchLength: Story = {
  args: {
    options: TEXT_OPTIONS,
    searchMode: "text",
    minSearchLength: 2,
    searchPlaceholder: "Type two characters to filter…",
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const SearchDisabled: Story = { args: { searchDisabled: true } };
export const LongLabels: Story = {
  args: {
    searchMode: "text",
    options: [
      {
        value: "global",
        label:
          "Global customer support operations and after-hours response team",
      },
      {
        value: "regional",
        label: "Regional customer success and account management",
      },
    ],
    searchPlaceholder: "Search departments…",
  },
};
function PreviewFilter({
  args,
  version = "v2",
}: {
  args: SearchFilterProps;
  version?: "v1" | "v2";
}) {
  const [state, setState] = React.useState(args);
  React.useEffect(() => setState(args), [args]);
  return (
    <LiveFilter
      args={state}
      updateArgs={(next) => setState((prev) => ({ ...prev, ...next }))}
      version={version}
    />
  );
}
export const AllSizes: Story = {
  name: "All sizes",
  parameters: {
    ...gallery(
      ["size"],
      "Small, default and large widths are fixed. Query, selection, options, search mode and disabled Controls remain live. Open each actual dropdown to inspect its rows; gallery queries are independent."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1148px] grid-cols-[320px_360px_420px] items-start gap-6">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {size} ·{" "}
              {size === "sm" ? "320" : size === "default" ? "360" : "420"}px
            </span>
            <PreviewFilter args={{ ...args, size }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const SearchModes: Story = {
  parameters: {
    ...gallery(
      ["searchMode"],
      "Numeric and text search modes are fixed; all other exposed Controls apply to both. The same editable option list is used in both samples to make their different query normalization visible."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[748px] grid-cols-2 gap-6">
        {(["numeric", "text"] as const).map((searchMode) => (
          <div key={searchMode} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {searchMode}
            </span>
            <PreviewFilter args={{ ...args, searchMode }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["disabled", "searchDisabled", "value", "searchValue"],
      "Ready, selected, no results, disabled and search disabled states are fixed. Options, mode, width, placeholder and empty message Controls remain live. Query filtering is inspected by opening an enabled sample."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[1192px] grid-cols-3 gap-6">
        {[
          {
            label: "Ready",
            value: "",
            searchValue: "",
            disabled: false,
            searchDisabled: false,
          },
          {
            label: "Selected",
            value: args.options[1]?.value || "",
            searchValue: "",
            disabled: false,
            searchDisabled: false,
          },
          {
            label: "No results",
            value: "",
            searchValue:
              args.searchMode === "numeric" ? "999999999" : "unmatched-query",
            disabled: false,
            searchDisabled: false,
          },
          {
            label: "Disabled",
            value: "",
            searchValue: "",
            disabled: true,
            searchDisabled: false,
          },
          {
            label: "Search disabled",
            value: "",
            searchValue: "",
            disabled: false,
            searchDisabled: true,
          },
        ].map(({ label, ...state }) => (
          <div key={label} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {label}
            </span>
            <PreviewFilter args={{ ...args, ...state }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      [],
      "Both versions render their complete real input and option list. All Controls apply to both. Open a field to inspect row height, selection and query highlighting. Queries remain independent; Docs does not auto-open a portal."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="grid min-w-[748px] grid-cols-2 items-start gap-6">
        {(["v1", "v2"] as const).map((version) => (
          <div key={version} className="flex flex-col gap-3">
            <span className="text-xs font-normal text-[var(--v2-text-muted,#707070)]">
              {version} ·{" "}
              {version === "v1" ? "ui/search-filter" : "ui/v2/search-filter"}
            </span>
            <PreviewFilter args={args} version={version} />
          </div>
        ))}
      </div>
    </div>
  ),
};
const QUEUE = [
  {
    name: "Alex Morgan",
    team: "support",
    preview: "Requested an update on a support ticket",
  },
  {
    name: "Sam Rivera",
    team: "sales",
    preview: "Asked about the workspace plan",
  },
  {
    name: "Casey Lee",
    team: "support",
    preview: "Shared a screenshot of an issue",
  },
  {
    name: "Jordan Patel",
    team: "operations",
    preview: "Confirmed the delivery schedule",
  },
];
function QueueExample({
  args,
  updateArgs,
}: {
  args: SearchFilterProps;
  updateArgs: (next: Partial<SearchFilterProps>) => void;
}) {
  const filtered = args.value
    ? QUEUE.filter((row) => row.team === args.value)
    : QUEUE;
  const label = args.options.find(
    (option) => option.value === args.value
  )?.label;
  return (
    <section className="flex w-[560px] max-w-full flex-col gap-5 rounded-xl border border-solid border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Conversation queue
        </p>
        <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
          Select a team to filter this local example.
        </p>
      </div>
      <LiveFilter args={args} updateArgs={updateArgs} />
      <p
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        {label ? `Showing ${label}` : "Showing all teams"} · {filtered.length}{" "}
        conversations
      </p>
      <ul className="m-0 list-none divide-y divide-semantic-border-layout p-0">
        {filtered.map((row) => (
          <li
            key={row.name}
            className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-[var(--v2-text-primary,#484848)]">
              {row.name}
            </span>
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {row.preview}
            </span>
          </li>
        ))}
      </ul>
      {!filtered.length && (
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          No conversations for this team.
        </p>
      )}
    </section>
  );
}
export const Usage: Story = {
  args: {
    options: TEXT_OPTIONS,
    searchMode: "text",
    searchPlaceholder: "Filter by team…",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search and select a team to filter the local queue. The selected value and query synchronize with Controls. Clear resets the queue and reopens the list. Width, options, threshold, disabled state and copy Controls remain live.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SearchFilterProps>();
    return <QueueExample args={args} updateArgs={updateArgs} />;
  },
};
