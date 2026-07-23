import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { SelectField, type SelectOption } from "./select-field";
import { FormModal } from "./form-modal";
import { Input } from "./input";

const authOptions: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];

const countryOptions: SelectOption[] = [
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

const timezoneOptions: SelectOption[] = [
  {
    value: "est",
    label: "Eastern Standard Time (EST)",
    group: "North America",
  },
  {
    value: "cst",
    label: "Central Standard Time (CST)",
    group: "North America",
  },
  {
    value: "mst",
    label: "Mountain Standard Time (MST)",
    group: "North America",
  },
  {
    value: "pst",
    label: "Pacific Standard Time (PST)",
    group: "North America",
  },
  { value: "gmt", label: "Greenwich Mean Time (GMT)", group: "Europe" },
  { value: "cet", label: "Central European Time (CET)", group: "Europe" },
  { value: "eet", label: "Eastern European Time (EET)", group: "Europe" },
  { value: "ist", label: "India Standard Time (IST)", group: "Asia" },
  { value: "jst", label: "Japan Standard Time (JST)", group: "Asia" },
  { value: "cst-china", label: "China Standard Time (CST)", group: "Asia" },
];

const meta: Meta<typeof SelectField> = {
  title: "Components/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A comprehensive select field component with label, helper text, validation states, and more.

\`\`\`bash
npx myoperator-ui add select-field
\`\`\`

## Import

\`\`\`tsx
import { SelectField } from "@/components/ui/select-field"
\`\`\`

## Usage

\`\`\`tsx
<SelectField
  label="Authentication"
  placeholder="Select authentication method"
  options={[
    { value: 'none', label: 'None' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'bearer', label: 'Bearer Token' },
  ]}
  required
/>

{/* With groups */}
<SelectField
  label="Timezone"
  options={[
    { value: 'est', label: 'EST', group: 'North America' },
    { value: 'gmt', label: 'GMT', group: 'Europe' },
  ]}
/>

{/* Searchable */}
<SelectField
  label="Country"
  options={countries}
  searchable
  searchPlaceholder="Search countries..."
/>

{/* Lazy-load on scroll — for paginated datasets (e.g. 1k–10k+ items) */}
<SelectField
  label="Template"
  options={items}
  onScrollEnd={loadNextPage}
  loadingMore={isFetchingPage}
  hasMore={hasMorePages}
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
      <td style="padding: 12px 16px;">Height</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">40px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Padding</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">—</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">10px 16px</td>
      <td style="padding: 12px 16px;">—</td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-brand</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">2BBCCA</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Label Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">535862</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #535862; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">F04438</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
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
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold text-semantic-text-secondary</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Selected Value</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Placeholder</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Helper Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">12px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-xs</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Search Input</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
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
    onSelect: fn(),
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the select",
      table: {
        type: { summary: "string" },
      },
    },
    required: {
      control: "boolean",
      description: "Shows red asterisk (*) next to label",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no value selected",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the select",
      table: {
        type: { summary: "string" },
      },
    },
    error: {
      control: "text",
      description: "Error message - triggers error state with red styling",
      table: {
        type: { summary: "string" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "Loading state with spinner",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    searchable: {
      control: "boolean",
      description: "Enable search/filter functionality",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Search..." },
      },
    },
    interceptValue: {
      control: false,
      description:
        "Intercept a value change before it commits. Return false to prevent onValueChange from firing (only onSelect fires). Useful for action items like 'Add custom…' that open a modal.",
      table: {
        type: { summary: "(value: string) => boolean" },
      },
    },
    onScrollEnd: {
      control: false,
      description:
        "Fires when the user scrolls to the bottom of the open dropdown. Forwarded to SelectContent's onViewportScrollEnd (debounced by the native scrollend event). Use to load the next page of options. Not forwarded when hasMore is false.",
      table: {
        type: { summary: "() => void" },
      },
    },
    loadingMore: {
      control: "boolean",
      description:
        "When true, renders a 'Loading more…' row at the bottom of the options list. Set while your API call is in flight.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    hasMore: {
      control: "boolean",
      description:
        "When false, prevents onScrollEnd from firing further and renders an 'End of list' footer row. Default behavior is to keep firing.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    searchValue: {
      control: false,
      description:
        "Controlled search value. When provided, the internal search state is bypassed and the client-side label filter is skipped — the consumer is trusted to filter options upstream (e.g. server-side). Pair with onSearchChange. Leave undefined for the default uncontrolled, client-side filtering behavior.",
      table: {
        type: { summary: "string" },
      },
    },
    onSearchChange: {
      control: false,
      description:
        "Fires on every keystroke in the search input. Also fires with an empty string when the dropdown closes (so consumers can reset their query state). Required when searchValue is provided.",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview - primary interactive example
export const Overview: Story = {
  args: {
    label: "Authentication",
    placeholder: "Select authentication method",
    required: true,
    helperText: "Choose how you want to authenticate requests.",
    options: authOptions,
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
};

// States - all state variants
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <SelectField
        label="Default"
        placeholder="Select an option"
        options={authOptions}
      />
      <SelectField
        label="Disabled"
        placeholder="Select an option"
        options={authOptions}
        disabled
      />
      <SelectField
        label="Error"
        placeholder="Select an option"
        options={authOptions}
        error="This field is required"
      />
      <SelectField
        label="Loading"
        placeholder="Loading options..."
        options={authOptions}
        loading
      />
    </div>
  ),
};

// With Label
export const WithLabel: Story = {
  name: "With label",
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
      />
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        required
      />
      <SelectField
        label="Optional Field"
        placeholder="This is optional"
        options={authOptions}
        helperText="You can leave this empty"
      />
    </div>
  ),
};

// With Helper Text
export const WithHelperText: Story = {
  name: "With helper text",
  render: () => (
    <div className="w-80">
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 5)}
        helperText="Select the country where you are located"
      />
    </div>
  ),
};

// Validation States
export const ValidationStates: Story = {
  name: "Validation states",
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        error="Please select an authentication method"
      />
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 5)}
        defaultValue="us"
        helperText="Country selection confirmed"
      />
    </div>
  ),
};

// With Groups
export const WithGroups: Story = {
  name: "With groups",
  render: () => (
    <div className="w-80">
      <SelectField
        label="Timezone"
        placeholder="Select your timezone"
        options={timezoneOptions}
        required
      />
    </div>
  ),
};

// Searchable
export const Searchable: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions}
        searchable
        searchPlaceholder="Search countries..."
        helperText="Type to filter options"
      />
    </div>
  ),
};

// Searchable with Groups — inline search + grouped options (e.g., Bots & Agents)
const assigneeOptions: SelectOption[] = [
  { value: "unassigned", label: "Unassigned" },
  { value: "ivr-voice-bot", label: "IVR voice bot", group: "Bots" },
  { value: "whatsapp-bot", label: "WhatsApp bot", group: "Bots" },
  { value: "support-bot", label: "Support bot", group: "Bots" },
  { value: "alex-smith", label: "Alex Smith", group: "Agents" },
  { value: "priya-sharma", label: "Priya Sharma", group: "Agents" },
  { value: "rahul-kumar", label: "Rahul Kumar", group: "Agents" },
  { value: "neha-gupta", label: "Neha Gupta", group: "Agents" },
];

export const SearchableWithGroups: Story = {
  name: "Searchable with groups",
  render: () => (
    <div className="w-80">
      <SelectField
        label="Assign to"
        placeholder="Select assignee"
        options={assigneeOptions}
        searchable
        searchPlaceholder="Search..."
        helperText="Search across bots and agents"
      />
    </div>
  ),
};

// Searchable with groups + separator — grouped options divided by a top
// border, uppercase group labels (Figma "routing" dropdown style). The list is
// long enough to demonstrate that the dropdown caps its height (max-h-96 ≈
// 384px) and scrolls while the separators/labels stay in place.
const routingOptions: SelectOption[] = [
  { value: "all", label: "All Routing" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: `callflow-${i + 1}`,
    label: `Callflow ${i + 1}`,
    group: "Callflow",
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    value: `agent-${i + 1}`,
    label: `AI Agent ${i + 1}`,
    group: "AI Agents",
  })),
];

export const SearchableWithGroupsSeparator: Story = {
  name: "Searchable with groups With Separator",
  render: () => (
    // Responsive width — fills the parent up to a max, instead of a fixed 320px.
    <div className="w-80">
      <SelectField
        label="Routing"
        placeholder="Select Routing"
        options={routingOptions}
        searchable
        searchPlaceholder="Search..."
        separateGroups
        helperText="Groups are divided by a separator"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Same searchable, grouped behaviour as **Searchable with groups**, but with `separateGroups` enabled — each group is divided by a top border and its label is shown in uppercase with letter-spacing, matching the Figma routing dropdown. When the option list is long, the dropdown caps its height (`max-h-96` ≈ 384px) and scrolls, preserving the dividers and uppercase group labels.",
      },
    },
  },
};

// Controlled Example
const ControlledExample = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        value={value}
        onValueChange={setValue}
        options={authOptions}
        required
      />
      <p className="text-sm text-[#6B7280]">
        Selected value: {value || "(none)"}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// onSelect Example
const OnSelectExample = () => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );

  return (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Country"
        placeholder="Select a country"
        options={countryOptions}
        onSelect={(option) => setSelectedOption(option)}
      />
      {selectedOption && (
        <div className="rounded border border-semantic-border-layout bg-semantic-bg-ui p-3 text-xs font-mono">
          <p className="font-semibold text-semantic-text-primary mb-1">
            onSelect payload:
          </p>
          <pre className="text-semantic-text-secondary">
            {JSON.stringify(selectedOption, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const OnSelect: Story = {
  name: "onSelect callback",
  render: () => <OnSelectExample />,
};

// Action items example — "Add custom date" opens a modal without adding
// dynamic options.  The trigger shows the action item's own label and
// re-clicking the same item re-opens the modal.
const InterceptValueExample = () => {
  const [value, setValue] = useState("this-month");
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedRange, setAppliedRange] = useState("");

  const options: SelectOption[] = [
    { value: "last-week", label: "Last Week" },
    { value: "7d", label: "Last 7 days" },
    { value: "this-month", label: "This month" },
    { value: "last-month", label: "Last month" },
    { value: "this-quarter", label: "This quarter" },
    { value: "custom", label: "Add custom date" },
  ];

  return (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Date range"
        value={value}
        onValueChange={setValue}
        onSelect={(option) => {
          if (option.value === "custom") {
            setModalOpen(true);
          }
        }}
        options={options}
      />

      {appliedRange && (
        <p className="text-xs text-semantic-text-muted">
          Applied range: {appliedRange}
        </p>
      )}

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Select custom date"
        saveButtonText="Apply"
        disableSave={!startDate || !endDate}
        onSave={() => {
          setAppliedRange(`${startDate} – ${endDate}`);
          setModalOpen(false);
          setStartDate("");
          setEndDate("");
        }}
        onCancel={() => {
          setStartDate("");
          setEndDate("");
        }}
      >
        <div className="grid gap-1.5">
          <label className="text-xs font-normal text-semantic-text-muted">
            Start
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-normal text-semantic-text-muted">
            End
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </FormModal>
    </div>
  );
};

// Action items — single field modal example
const InterceptValueSingleExample = () => {
  const [value, setValue] = useState("500");
  const [modalOpen, setModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [appliedAmount, setAppliedAmount] = useState("");

  const options: SelectOption[] = [
    { value: "500", label: "500" },
    { value: "1000", label: "1,000" },
    { value: "5000", label: "5,000" },
    { value: "custom", label: "Enter custom amount" },
  ];

  return (
    <div className="flex flex-col gap-4 w-80">
      <SelectField
        label="Recharge amount"
        value={value}
        onValueChange={setValue}
        onSelect={(option) => {
          if (option.value === "custom") {
            setModalOpen(true);
          }
        }}
        options={options}
      />

      {appliedAmount && (
        <p className="text-xs text-semantic-text-muted">
          Custom amount: ₹{appliedAmount}
        </p>
      )}

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Enter custom amount"
        saveButtonText="Confirm"
        disableSave={!customAmount}
        onSave={() => {
          setAppliedAmount(customAmount);
          setModalOpen(false);
          setCustomAmount("");
        }}
        onCancel={() => setCustomAmount("")}
      >
        <div className="grid gap-1.5">
          <label className="text-xs font-normal text-semantic-text-muted">
            Amount
          </label>
          <Input
            type="number"
            placeholder="e.g. 2500"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
        </div>
      </FormModal>
    </div>
  );
};

export const InterceptValue: Story = {
  name: "Action items",
  parameters: {
    docs: {
      description: {
        story:
          "Options like **Add custom date** act as action items — selecting them opens a modal instead of changing a static filter. The trigger updates to show the action item's label, and re-clicking the same action item re-triggers `onSelect` so the modal can re-open.\n\nUse `interceptValue` to **prevent** the value from committing (trigger keeps showing the previous selection while the modal is open).",
      },
      source: {
        code: `const [value, setValue] = useState("this-month");
const [modalOpen, setModalOpen] = useState(false);

const options = [
  { value: "last-week", label: "Last Week" },
  { value: "7d", label: "Last 7 days" },
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "this-quarter", label: "This quarter" },
  // Action item — triggers modal, trigger shows its label
  { value: "custom", label: "Add custom date" },
];

<SelectField
  label="Date range"
  value={value}
  onValueChange={setValue}
  onSelect={(option) => {
    if (option.value === "custom") setModalOpen(true);
  }}
  options={options}
/>

<FormModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  title="Select custom date"
  saveButtonText="Apply"
  onSave={() => {
    // Value stays "custom" — trigger keeps showing "Add custom date"
    // Use the dates via API call, URL params, etc.
    setModalOpen(false);
  }}
>
  <Input type="date" ... />
  <Input type="date" ... />
</FormModal>`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex gap-8">
      <InterceptValueExample />
      <InterceptValueSingleExample />
    </div>
  ),
};

// Loading State
export const LoadingState: Story = {
  name: "Loading state",
  args: {
    label: "Fetching Options",
    placeholder: "Loading...",
    loading: true,
    options: [],
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
};

// Lazy-load (infinite scroll) — paginated dataset
const PAGE_SIZE = 25;
const TOTAL = 250;
const generatePage = (page: number): SelectOption[] =>
  Array.from({ length: PAGE_SIZE }, (_, i) => {
    const idx = page * PAGE_SIZE + i + 1;
    return { value: `tpl-${idx}`, label: `Template ${idx}` };
  });

const LazyLoadExample = () => {
  // Pre-populate page 0 so the dropdown has rows to scroll past before triggering onScrollEnd.
  const [items, setItems] = useState<SelectOption[]>(() => generatePage(0));
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const page = useRef(1);

  const loadNext = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 600));
    const next = generatePage(page.current);
    setItems((prev) => [...prev, ...next]);
    page.current += 1;
    if (page.current * PAGE_SIZE >= TOTAL) setHasMore(false);
    setLoadingMore(false);
  };

  return (
    <div className="w-80">
      <SelectField
        label="Template"
        placeholder="Select a template"
        options={items}
        onScrollEnd={loadNext}
        loadingMore={loadingMore}
        hasMore={hasMore}
        helperText={`Loaded ${items.length} of ${TOTAL}`}
      />
    </div>
  );
};

export const LazyLoad: Story = {
  name: "Lazy-load (infinite scroll)",
  render: () => <LazyLoadExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Scroll to the bottom of the open dropdown to load more options. `onScrollEnd` fires on the native `scrollend` event (naturally throttled). Set `loadingMore` while the API call is in flight to show the spinner row. Set `hasMore={false}` once exhausted to stop further calls and render an end-of-list footer.",
      },
    },
  },
};

const ServerSideSearchExample = () => {
  // Simulates a paginated server: each "fetch" returns 20 of TOTAL items,
  // filtered against the consumer-owned `searchQuery`.
  const PAGE = 20;
  const ALL_TEMPLATES = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        value: `tpl-${i + 1}`,
        label: `Template ${i + 1}`,
      })),
    []
  );

  const filterTemplates = useCallback(
    (query: string) =>
      ALL_TEMPLATES.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
      ),
    [ALL_TEMPLATES]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<SelectOption[]>(() =>
    filterTemplates("").slice(0, PAGE)
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    () => filterTemplates("").length > PAGE
  );
  const pageRef = useRef(1);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    pageRef.current = 0;
    setLoadingMore(true);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      const filtered = filterTemplates(query);
      const slice = filtered.slice(0, PAGE);
      setItems(slice);
      setHasMore(filtered.length > PAGE);
      pageRef.current = 1;
      setLoadingMore(false);
    }, 300);
  };

  useEffect(
    () => () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    },
    []
  );

  const loadNext = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 400));
    const filtered = filterTemplates(searchQuery);
    const nextSlice = filtered.slice(
      pageRef.current * PAGE,
      (pageRef.current + 1) * PAGE
    );
    setItems((prev) => [...prev, ...nextSlice]);
    pageRef.current += 1;
    if (pageRef.current * PAGE >= filtered.length) setHasMore(false);
    setLoadingMore(false);
  };

  return (
    <div className="w-80">
      <SelectField
        label="Template"
        placeholder="Select a template"
        searchable
        searchPlaceholder="Search templates..."
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        options={items}
        onScrollEnd={loadNext}
        loadingMore={loadingMore}
        hasMore={hasMore}
        helperText={
          searchQuery
            ? `Matching "${searchQuery}" — ${items.length} loaded`
            : `Loaded ${items.length}`
        }
      />
    </div>
  );
};

export const ServerSideSearch: Story = {
  name: "Server-side search + lazy load",
  render: () => <ServerSideSearchExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Pair `searchValue` + `onSearchChange` with `onScrollEnd` to drive a paginated dropdown from a remote API. The library's internal client-side `option.label` filter is **disabled** in controlled mode — consumers are trusted to have filtered options upstream. Typing in the search input fires `onSearchChange` on every keystroke (debounce in your handler if needed), and reaching the bottom of the open dropdown fires `onScrollEnd` so you can fetch the next page.",
      },
    },
  },
};

// Form Example
export const FormExample: Story = {
  name: "Form example",
  render: () => (
    <form className="flex flex-col gap-4 w-80">
      <SelectField
        label="Authentication"
        placeholder="Select authentication method"
        options={authOptions}
        required
        name="auth"
      />
      <SelectField
        label="Country"
        placeholder="Select your country"
        options={countryOptions.slice(0, 6)}
        required
        name="country"
      />
      <SelectField
        label="Timezone"
        placeholder="Select your timezone"
        options={timezoneOptions}
        name="timezone"
        helperText="Optional - we'll auto-detect if not selected"
      />
    </form>
  ),
};

// With TextField Example (from screenshot)
export const WebhookFormExample: Story = {
  name: "Webhook form example",
  render: () => (
    <form className="flex flex-col gap-4 w-96">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="webhook-url"
          className="text-sm font-semibold text-semantic-text-secondary"
        >
          Webhook URL <span className="text-semantic-error-primary">*</span>
        </label>
        <div className="flex h-10 w-full items-center rounded bg-white border border-[#E9E9E9] px-4">
          <span className="text-sm text-[#6B7280] mr-2">https://</span>
          <input
            id="webhook-url"
            type="text"
            className="flex-1 bg-transparent border-0 outline-none text-sm text-[#333333] placeholder:text-[#9CA3AF]"
            placeholder="api.example.com/webhooks"
          />
        </div>
      </div>
      <SelectField
        label="Authentication"
        placeholder="None"
        options={authOptions}
        defaultValue="none"
      />
    </form>
  ),
};
