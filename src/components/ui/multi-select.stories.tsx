import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import * as React from "react";
import { useState } from "react";
import { MultiSelect, type MultiSelectOption } from "./multi-select";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const skillOptions: MultiSelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
];

const roleOptions: MultiSelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "moderator", label: "Moderator" },
];

const countryOptions: MultiSelectOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A multi-select component with tags, search, and validation states.

\`\`\`bash
npx myoperator-ui add multi-select
\`\`\`

## Import

\`\`\`tsx
import { MultiSelect } from "@/components/ui/multi-select"
\`\`\`

## Usage

\`\`\`tsx
<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  onValueChange={fn()}
/>

{/* With max selections */}
<MultiSelect
  label="Top 3 Skills"
  options={skills}
  maxSelections={3}
/>

{/* Searchable */}
<MultiSelect
  label="Countries"
  options={countries}
  searchable
  searchPlaceholder="Search countries..."
/>
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-input</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Radius</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--radius</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">4px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Min Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">8px 16px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Tag Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F5F5F5</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label</td>
      <td style="padding: 12px 16px;">Title/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Trigger Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Tag</td>
      <td style="padding: 12px 16px;">Label/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Option Text</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Helper/Error Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Footer</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the select",
    },
    required: {
      control: "boolean",
      description: "Shows red asterisk (*) next to label",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no values selected",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the select",
    },
    error: {
      control: "text",
      description: "Error message - triggers error state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    loading: {
      control: "boolean",
      description: "Loading state with spinner",
    },
    searchable: {
      control: "boolean",
      description: "Enable search/filter functionality",
    },
    maxSelections: {
      control: "number",
      description: "Maximum selections allowed",
    },
    hasMore: {
      control: "boolean",
      description: "Whether the server has more pages to load",
    },
    loadingMore: {
      control: "boolean",
      description: "Whether a page fetch is in flight (renders a loading row)",
    },
    onScrollEnd: {
      action: "scrollEnd",
      description: "Fired once when the list is scrolled near its bottom",
    },
    searchQuery: {
      control: "text",
      description:
        "Controlled search value. Pair with onSearchQueryChange for server-side search (e.g. with onScrollEnd pagination) so filtering runs over the full dataset, not just the loaded page.",
    },
    onSearchQueryChange: {
      action: "searchQueryChange",
      description: "Fired on every search input change. Required to pair with searchQuery.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    label: "Skills",
    placeholder: "Select your skills",
    required: true,
    helperText: "Select all that apply",
    options: skillOptions,
  },
  render: (args) => (
    <div className="w-80">
      <MultiSelect {...args} />
    </div>
  ),
};

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <MultiSelect
        label="Default"
        placeholder="Select options"
        options={roleOptions}
      />
      <MultiSelect
        label="With Selection"
        placeholder="Select options"
        options={roleOptions}
        defaultValue={["admin", "editor"]}
      />
      <MultiSelect
        label="Disabled"
        placeholder="Select options"
        options={roleOptions}
        disabled
      />
      <MultiSelect
        label="Error"
        placeholder="Select options"
        options={roleOptions}
        error="Please select at least one role"
      />
      <MultiSelect
        label="Loading"
        placeholder="Loading..."
        options={roleOptions}
        loading
      />
    </div>
  ),
};

// With Tags
export const WithTags: Story = {
  name: "With tags",
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Selected Skills"
        placeholder="Select skills"
        options={skillOptions}
        defaultValue={["react", "typescript", "nextjs"]}
        helperText="Click X to remove a tag"
      />
    </div>
  ),
};

// Max Selections
export const MaxSelections: Story = {
  name: "Max selections",
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Top 3 Skills"
        placeholder="Select up to 3 skills"
        options={skillOptions}
        maxSelections={3}
        helperText="You can select up to 3 skills"
      />
    </div>
  ),
};

// Searchable
export const Searchable: Story = {
  render: () => (
    <div className="w-80">
      <MultiSelect
        label="Countries"
        placeholder="Select countries"
        options={countryOptions}
        searchable
        searchPlaceholder="Search countries..."
        helperText="Type to filter options"
      />
    </div>
  ),
};

// Controlled Example
const ControlledExample = () => {
  const [values, setValues] = useState<string[]>(["react"]);

  return (
    <div className="flex flex-col gap-4 w-80">
      <MultiSelect
        label="Skills"
        placeholder="Select skills"
        value={values}
        onValueChange={setValues}
        options={skillOptions}
        required
      />
      <p className="text-sm text-[#6B7280]">
        Selected: {values.length > 0 ? values.join(", ") : "(none)"}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Validation States
export const ValidationStates: Story = {
  name: "Validation states",
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <MultiSelect
        label="Required Field"
        placeholder="Select at least one"
        options={roleOptions}
        error="This field is required"
        required
      />
      <MultiSelect
        label="Valid Selection"
        placeholder="Select roles"
        options={roleOptions}
        defaultValue={["admin"]}
        helperText="Selection saved successfully"
      />
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  name: "Form example",
  render: () => (
    <form className="flex flex-col gap-4 w-80">
      <MultiSelect
        label="Technical Skills"
        placeholder="Select your skills"
        options={skillOptions}
        required
        name="skills"
        maxSelections={5}
        searchable
        helperText="Select up to 5 skills"
      />
      <MultiSelect
        label="Preferred Countries"
        placeholder="Select countries"
        options={countryOptions}
        name="countries"
        searchable
        searchPlaceholder="Search..."
      />
      <MultiSelect
        label="Roles"
        placeholder="Select roles"
        options={roleOptions}
        name="roles"
        required
      />
    </form>
  ),
};

// With Disabled Options
export const WithDisabledOptions: Story = {
  name: "With disabled options",
  render: () => {
    const optionsWithDisabled: MultiSelectOption[] = [
      { value: "free", label: "Free Tier" },
      { value: "basic", label: "Basic Plan" },
      { value: "pro", label: "Pro Plan" },
      {
        value: "enterprise",
        label: "Enterprise (Contact Sales)",
        disabled: true,
      },
    ];

    return (
      <div className="w-80">
        <MultiSelect
          label="Select Plans"
          placeholder="Choose available plans"
          options={optionsWithDisabled}
          helperText="Some options may not be available"
        />
      </div>
    );
  },
};

const whatsappStyleOptions: MultiSelectOption[] = [
  {
    value: "w1",
    label: "+91 9876543210",
    secondaryText: "Assigned to Bot Name 1",
  },
  { value: "w2", label: "+91 6543120931" },
  {
    value: "w3",
    label: "+91 7653443219",
    disabled: true,
    disabledTooltip: "This number is associated with another bot.",
  },
];

/** Checkbox rows + secondary text + divider + Figma-style trigger (see BotSettings). */
export const DetailedWhatsAppStyle: Story = {
  name: "Detailed (WhatsApp / Figma)",
  render: () => (
    <div className="w-[420px]">
      <MultiSelect
        label="Connect WhatsApp"
        placeholder="Select numbers"
        options={whatsappStyleOptions}
        defaultValue={["w1"]}
        optionVariant="detailed"
        separateSelectedWithDivider
        searchable
        showClearAll={false}
        showSeparatorBeforeChevron
        triggerClassName="min-h-[46px] px-2.5 py-2"
      />
    </div>
  ),
};

const groupedDetailed: MultiSelectOption[] = [
  {
    value: "a1",
    group: "OPTION LABEL 1",
    label: "+91 9876543210",
    secondaryText: "Assigned to Bot Name 1",
  },
  {
    value: "a2",
    group: "OPTION LABEL 1",
    label: "+91 6543120931",
  },
  {
    value: "b1",
    group: "OPTION LABEL 2",
    label: "+91 7653443219",
    secondaryText: "Assigned to Bot Name 2",
  },
];

export const GroupedDetailed: Story = {
  name: "Grouped (detailed)",
  render: () => (
    <div className="w-[420px]">
      <MultiSelect
        placeholder="Select numbers"
        options={groupedDetailed}
        optionVariant="detailed"
        searchable
        showClearAll={false}
        showSeparatorBeforeChevron
      />
    </div>
  ),
};

/**
 * Inside a Radix Dialog the menu still portals to `document.body` (a dialog is a
 * transformed, scrollable ancestor and would clip a `position: fixed` menu). The
 * component neutralises what the dialog would otherwise do to an outside
 * element: wheel/touchmove are kept from the scroll lock, `pointer-events: auto`
 * restores clicks, and `focusin` / `focusout` are stopped so the focus trap
 * cannot pull focus off the search input mid-keystroke.
 */
export const InsideDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string[]>([]);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign skills</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <MultiSelect
              label="Skills"
              placeholder="Select skills"
              options={skillOptions}
              value={value}
              onValueChange={setValue}
              searchable
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  },
};

const longLabelOptions: MultiSelectOption[] = [
  {
    value: "long-1",
    label:
      "Customer support escalation queue for enterprise accounts in the APAC region — tier 3",
  },
  {
    value: "long-2",
    label:
      "Outbound campaign / unstructured value pulled straight from the CRM with no length cap",
  },
  { value: "short", label: "Sales" },
];

/**
 * Selected chips in the trigger always truncate, so the control never breaks its
 * layout. The dropdown shows the full label wrapped by default; set
 * `truncateOptionText` to clip option rows to one line instead.
 */
export const LongOptionLabels: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <MultiSelect
        label="Wrapped (default)"
        placeholder="Select"
        options={longLabelOptions}
      />
      <MultiSelect
        label="Truncated"
        placeholder="Select"
        options={longLabelOptions}
        truncateOptionText
      />
      <MultiSelect
        label="Selected chips"
        placeholder="Select"
        options={longLabelOptions}
        defaultValue={["long-1", "short"]}
      />
    </div>
  ),
};

// Infinite scroll / server-side pagination
const PAGE_SIZE = 20;
const TOTAL_AGENTS = 137;

const ALL_AGENTS: MultiSelectOption[] = Array.from(
  { length: TOTAL_AGENTS },
  (_, i) => ({
    value: `agent-${i + 1}`,
    label: `Agent ${i + 1}`,
    secondaryText: `Ext. ${1000 + i}`,
  })
);

/**
 * Stand-in for a paginated, server-side-filtered API — resolves after a
 * short delay. Filtering runs over the *full* dataset here, not client-side
 * over whatever page happens to already be loaded — matching how a real
 * search endpoint behaves, and why `searchQuery`/`onSearchQueryChange` are
 * wired up as controlled below instead of leaving MultiSelect to filter.
 */
const fetchAgentPage = (page: number, query: string) =>
  new Promise<{ items: MultiSelectOption[]; hasMore: boolean; total: number }>(
    (resolve) => {
      setTimeout(() => {
        const trimmed = query.trim().toLowerCase();
        const matches = trimmed
          ? ALL_AGENTS.filter((a) => a.label.toLowerCase().includes(trimmed))
          : ALL_AGENTS;
        const start = page * PAGE_SIZE;
        const items = matches.slice(start, start + PAGE_SIZE);
        resolve({
          items,
          hasMore: start + items.length < matches.length,
          total: matches.length,
        });
      }, 700);
    }
  );

const InfiniteScrollExample = ({
  optionVariant = "detailed",
  searchable = false,
  label = "Agent",
}: {
  optionVariant?: "simple" | "detailed";
  searchable?: boolean;
  label?: string;
}) => {
  const [options, setOptions] = React.useState<MultiSelectOption[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [total, setTotal] = React.useState(TOTAL_AGENTS);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadPage = React.useCallback(
    async (next: number, query: string, replace: boolean) => {
      setLoadingMore(true);
      const result = await fetchAgentPage(next, query);
      setOptions((prev) =>
        replace ? result.items : [...prev, ...result.items]
      );
      setHasMore(result.hasMore);
      setTotal(result.total);
      setPage(next + 1);
      setLoadingMore(false);
    },
    []
  );

  // Refetches page 0 against the *server* whenever the query changes — the
  // whole point of controlled search — instead of MultiSelect filtering
  // whatever page is already loaded client-side.
  React.useEffect(() => {
    void loadPage(0, searchQuery, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="w-full max-w-[320px]">
      <MultiSelect
        label={label}
        placeholder="Select agents"
        optionVariant={optionVariant}
        searchable={searchable}
        searchPlaceholder="Search..."
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        options={options}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onScrollEnd={() => {
          if (!loadingMore && hasMore) void loadPage(page, searchQuery, false);
        }}
        helperText={`${options.length} of ${total} loaded`}
      />
    </div>
  );
};

export const InfiniteScroll: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <InfiniteScrollExample
        optionVariant="simple"
        searchable
        label="Simple + search"
      />
      <InfiniteScrollExample
        optionVariant="detailed"
        label="Detailed rows"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Server-side pagination in both option styles. `onScrollEnd` fires once when the list is scrolled within 48px of the bottom, `loadingMore` renders the spinner row, and `hasMore` stops the requests at the last page. The callback is latched, so trackpad momentum cannot fan one flick out into several requests — and re-measures after each page lands, so a page that grows the list well past the old scroll height (with no `scroll` event to trigger a re-check) still unlatches instead of stalling. Left: `optionVariant=\"simple\"` with `searchable`, wired to `searchQuery`/`onSearchQueryChange` — every keystroke re-fetches page 0 from the *full* dataset server-side, not a client-side filter over whatever pages happen to already be loaded (which would falsely show \"No results found\" for matches sitting on pages 3+). Right: `optionVariant=\"detailed\"` — checkbox plus primary and secondary text.",
      },
    },
  },
};
