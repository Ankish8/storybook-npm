import type { Meta, StoryObj } from "@storybook/react";

import { SearchFilter, type SearchFilterOption } from "./search-filter";

const phoneOptions: SearchFilterOption[] = [
  { value: "3001-a", label: "+91 11 4000 3001" },
  { value: "3001-b", label: "+91 11 4000 3001" },
  { value: "3001-c", label: "+91 11 4000 3001" },
  { value: "3453", label: "+91 11 4000 3453" },
  { value: "5444", label: "+91 11 4000 5444" },
  { value: "5002", label: "+91 11 4000 5002" },
  { value: "6789", label: "+91 11 4000 6789" },
];

const authOptions: SearchFilterOption[] = [
  { value: "none", label: "None" },
  { value: "basic-auth", label: "Basic Auth" },
];

const meta: Meta<typeof SearchFilter> = {
  title: "Components/SearchFilter",
  component: SearchFilter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A searchable single-select input that opens a dropdown of matching options.
Use it where users need to search a list, select one value, and show that selection in the input.

\`\`\`bash
npx myoperator-ui add search-filter
\`\`\`

## Import

\`\`\`tsx
import { SearchFilter } from "@/components/ui/search-filter"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
  <thead>
    <tr style="background-color: var(--semantic-bg-ui); border-bottom: 2px solid var(--semantic-border-layout);">
      <th style="padding: 12px 16px; text-align: left;">Token</th>
      <th style="padding: 12px 16px; text-align: left;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left;">Usage</th>
      <th style="padding: 12px 16px; text-align: left;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Primary</td>
      <td style="padding: 12px 16px;"><code>--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Selected option checkmark</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background: var(--semantic-primary); border-radius: 6px;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid var(--semantic-border-layout);">
      <td style="padding: 12px 16px;">Layout Border</td>
      <td style="padding: 12px 16px;"><code>--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Panel and section dividers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background: var(--semantic-border-layout); border-radius: 6px;"></div></td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code>--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Option labels</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background: var(--semantic-text-primary); border-radius: 6px;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Width of the filter panel",
    },
    searchMode: {
      control: "select",
      options: ["text", "numeric"],
      description: "Search input behavior. Defaults to numeric.",
    },
    minSearchLength: {
      control: "number",
      description:
        "Minimum query length before internal option filtering runs. Below it, all options are shown.",
    },
    value: {
      control: "text",
      description: "Controlled selected option value",
    },
    disabled: {
      control: "boolean",
      description: "Disables the whole filter",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    options: phoneOptions,
  },
};

export const Small: Story = {
  args: {
    options: phoneOptions,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    options: phoneOptions,
    size: "lg",
  },
};

export const SelectedAuthOption: Story = {
  args: {
    options: authOptions,
    value: "basic-auth",
    searchMode: "text",
  },
};

export const EmptyResults: Story = {
  args: {
    options: phoneOptions,
    searchValue: "9999",
  },
};

export const TextSearch: Story = {
  args: {
    options: [...phoneOptions, { value: "sales", label: "Sales Team" }],
    searchMode: "text",
    searchPlaceholder: "Search text...",
  },
};

export const MinSearchLength: Story = {
  args: {
    options: [...phoneOptions, { value: "sales", label: "Sales Team" }],
    searchMode: "text",
    minSearchLength: 2,
    searchPlaceholder: "Type at least 2 characters...",
  },
};
