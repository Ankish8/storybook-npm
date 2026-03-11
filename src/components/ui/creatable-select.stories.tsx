import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CreatableSelect } from "./creatable-select"

const SAMPLE_OPTIONS = [
  { value: "customer-support", label: "Customer Support Agent" },
  { value: "sales", label: "Sales Representative" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing Enquiry Agent" },
  { value: "receptionist", label: "Receptionist" },
]

const meta: Meta<typeof CreatableSelect> = {
  title: "Components/CreatableSelect",
  component: CreatableSelect,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 350, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 24 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `A dropdown select that allows typing to filter existing options or create custom values by pressing Enter.

**Install**
\`\`\`bash
npx myoperator-ui add creatable-select
\`\`\`

**Import**
\`\`\`tsx
import { CreatableSelect } from "@/components/ui/creatable-select"
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value={value}
          onValueChange={setValue}
          options={SAMPLE_OPTIONS}
          placeholder="Select or create a role"
          creatableHint="Type to create a custom role"
        />
        <p className="m-0 mt-2 text-xs text-semantic-text-muted">
          Selected: {value || "(none)"}
        </p>
      </div>
    )
  },
}

export const WithPreselectedValue: Story = {
  render: function Render() {
    const [value, setValue] = useState("sales")
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value={value}
          onValueChange={setValue}
          options={SAMPLE_OPTIONS}
          placeholder="Select or create a role"
        />
      </div>
    )
  },
}

export const ErrorState: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value={value}
          onValueChange={setValue}
          options={SAMPLE_OPTIONS}
          state="error"
          placeholder="Select a role"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value="customer-support"
          options={SAMPLE_OPTIONS}
          disabled
          placeholder="Select a role"
        />
      </div>
    )
  },
}

export const WithDisabledOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    const options = [
      ...SAMPLE_OPTIONS,
      { value: "manager", label: "Manager (unavailable)", disabled: true },
    ]
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value={value}
          onValueChange={setValue}
          options={options}
          placeholder="Select a role"
        />
      </div>
    )
  },
}

export const EmptyOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[300px]">
        <CreatableSelect
          value={value}
          onValueChange={setValue}
          options={[]}
          placeholder="Type to create"
          creatableHint="No preset options — type anything"
        />
        <p className="m-0 mt-2 text-xs text-semantic-text-muted">
          Selected: {value || "(none)"}
        </p>
      </div>
    )
  },
}
