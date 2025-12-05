import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { KeyValueInput } from "./key-value-input"
import type { KeyValuePair } from "./types"

const meta: Meta<typeof KeyValueInput> = {
  title: "Custom/Key Value Input",
  component: KeyValueInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A specialized component for managing key-value pairs such as HTTP headers, query parameters, or environment variables.

\`\`\`bash
npx myoperator-ui add key-value-input
\`\`\`

## Import

\`\`\`tsx
import { KeyValueInput } from "@/components/custom/key-value-input"
import type { KeyValuePair } from "@/components/custom/key-value-input"
\`\`\`

## Overview

KeyValueInput is a specialized component for managing key-value pairs such as HTTP headers, query parameters, or environment variables.

### Features

- **Dynamic add/remove rows** - Add up to 10 items (configurable)
- **Duplicate key validation** - Case-insensitive detection
- **Required key validation** - Shows error for empty keys
- **Maximum items limit** - Disabled button with tooltip when at limit
- **Controlled and uncontrolled modes** - Flexible state management

## Usage

\`\`\`tsx
// Uncontrolled
<KeyValueInput
  title="HTTP Headers"
  description="Add custom headers for the webhook request"
/>

// Controlled
const [headers, setHeaders] = useState<KeyValuePair[]>([])
<KeyValueInput
  title="HTTP Headers"
  value={headers}
  onChange={setHeaders}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed at the top",
    },
    description: {
      control: "text",
      description: "Description displayed below the title",
    },
    addButtonText: {
      control: "text",
      description: "Text for the add button",
    },
    maxItems: {
      control: "number",
      description: "Maximum number of items allowed",
    },
    keyPlaceholder: {
      control: "text",
      description: "Placeholder for key input",
    },
    valuePlaceholder: {
      control: "text",
      description: "Placeholder for value input",
    },
    keyLabel: {
      control: "text",
      description: "Label for key column header",
    },
    valueLabel: {
      control: "text",
      description: "Label for value column header",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Default uncontrolled example
export const Default: Story = {
  args: {
    title: "Headers",
    description:
      "Additional HTTP headers to send with webhook requests. Key is required, value is optional.",
    addButtonText: "Add Header",
    maxItems: 10,
    keyPlaceholder: "Content-Type",
    valuePlaceholder: "application/json",
  },
}

// With default values
export const WithDefaultValues: Story = {
  name: "With Default Values",
  args: {
    title: "Headers",
    description:
      "Additional HTTP headers to send with webhook requests. Key is required, value is optional.",
    defaultValue: [
      { id: "1", key: "Content-Type", value: "application/json" },
      { id: "2", key: "Authorization", value: "Bearer token" },
    ],
  },
}

// Controlled example
const ControlledExample = () => {
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: "1", key: "Content-Type", value: "application/json" },
  ])

  return (
    <div className="space-y-4">
      <KeyValueInput
        title="Headers"
        description="Additional HTTP headers to send with webhook requests. Key is required, value is optional."
        value={headers}
        onChange={setHeaders}
      />
      <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
        <p className="text-xs text-[#6B7280] mb-2 font-medium">
          Current State:
        </p>
        <pre className="text-xs text-[#333333] overflow-auto">
          {JSON.stringify(headers, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

// At max limit
export const AtMaxLimit: Story = {
  name: "At Maximum Limit",
  args: {
    title: "Headers",
    description: "Maximum 3 headers allowed (for demo)",
    maxItems: 3,
    defaultValue: [
      { id: "1", key: "Content-Type", value: "application/json" },
      { id: "2", key: "Authorization", value: "Bearer token" },
      { id: "3", key: "Accept", value: "application/json" },
    ],
  },
}

// With validation errors
const ValidationExample = () => {
  const [pairs, setPairs] = useState<KeyValuePair[]>([
    { id: "1", key: "Content-Type", value: "application/json" },
    { id: "2", key: "content-type", value: "text/html" }, // Duplicate (case-insensitive)
    { id: "3", key: "", value: "some value" }, // Empty key
  ])

  return (
    <KeyValueInput
      title="Headers"
      description="Shows validation for duplicate and empty keys"
      value={pairs}
      onChange={setPairs}
    />
  )
}

export const WithValidation: Story = {
  name: "With Validation Errors",
  render: () => <ValidationExample />,
}

// Query Parameters use case
export const QueryParameters: Story = {
  name: "Query Parameters",
  args: {
    title: "Query Parameters",
    description:
      "Query parameters to append to the webhook URL. Key is required, value is optional.",
    addButtonText: "Add Parameters",
    keyPlaceholder: "page",
    valuePlaceholder: "1",
    defaultValue: [
      { id: "1", key: "page", value: "1" },
      { id: "2", key: "limit", value: "10" },
    ],
  },
}

// Empty state
export const EmptyState: Story = {
  name: "Empty State",
  args: {
    title: "Headers",
    description:
      "Additional HTTP headers to send with webhook requests. Key is required, value is optional.",
    defaultValue: [],
  },
}

// Real world usage example
const RealWorldExample = () => {
  const [headers, setHeaders] = useState<KeyValuePair[]>([])
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([])

  return (
    <div className="space-y-8">
      <KeyValueInput
        title="Headers"
        description="Additional HTTP headers to send with webhook requests. Key is required, value is optional."
        value={headers}
        onChange={setHeaders}
        keyPlaceholder="Content-Type"
        valuePlaceholder="application/json"
      />
      <KeyValueInput
        title="Query Parameters"
        description="Query parameters to append to the webhook URL. Key is required, value is optional."
        addButtonText="+ Add Parameters"
        value={queryParams}
        onChange={setQueryParams}
        keyPlaceholder="page"
        valuePlaceholder="1"
      />
    </div>
  )
}

export const RealWorldUsage: Story = {
  name: "Real World Usage",
  render: () => <RealWorldExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Example showing multiple KeyValueInput components used together in a webhook configuration form.",
      },
    },
  },
}
