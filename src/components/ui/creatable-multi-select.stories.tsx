import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CreatableMultiSelect } from "./creatable-multi-select"

const TONE_OPTIONS = [
  { value: "Professional and highly concise", label: "Professional and highly concise" },
  { value: "Friendly and conversational", label: "Friendly and conversational" },
  { value: "Calm and reassuring", label: "Calm and reassuring" },
  { value: "Polite and formal", label: "Polite and formal" },
  { value: "Cheerful and engaging", label: "Cheerful and engaging" },
  { value: "Neutral and informative", label: "Neutral and informative" },
  { value: "Respectful and minimal", label: "Respectful and minimal" },
  { value: "Crisp and transactional", label: "Crisp and transactional" },
  { value: "Energetic and upbeat", label: "Energetic and upbeat" },
  { value: "Soft-spoken and comforting", label: "Soft-spoken and comforting" },
  { value: "Direct and efficient", label: "Direct and efficient" },
]

const meta: Meta<typeof CreatableMultiSelect> = {
  title: "Components/CreatableMultiSelect",
  component: CreatableMultiSelect,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 400, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 24 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `A multi-select that matches Primary Role styling: closed field shows comma-separated selections; open field uses the same teal focus ring and a panel with hint text, Enter, max-selections copy, and preset \`+\` pills. Creating custom values by typing uses Enter (or the Enter helper in the panel). Use \`createHintText\` and \`maxItems\` so the open panel shows guidance when typed text matches no preset. Use \`showPerItemCharacterCounter={false}\` when you do not want length under the field (e.g. Figma bot Tone).

**Install**
\`\`\`bash
npx myoperator-ui add creatable-multi-select
\`\`\`

**Import**
\`\`\`tsx
import { CreatableMultiSelect } from "@/components/ui/creatable-multi-select"
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
    const [value, setValue] = useState<string[]>([])
    return (
      <div className="w-[500px]">
        <CreatableMultiSelect
          value={value}
          onValueChange={setValue}
          options={TONE_OPTIONS}
          placeholder="Enter or select tone"
          createHintText="Type to create a custom tone"
          maxItems={5}
          maxLengthPerItem={20}
          helperText="Shown when the dropdown is closed (optional)."
        />
      </div>
    )
  },
}

export const WithPreselectedValues: Story = {
  render: function Render() {
    const [value, setValue] = useState(["Conversational", "Calm and reassuring"])
    return (
      <div className="w-[500px]">
        <CreatableMultiSelect
          value={value}
          onValueChange={setValue}
          options={TONE_OPTIONS}
          placeholder="Enter or select tone"
        />
      </div>
    )
  },
}

export const ErrorState: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([])
    return (
      <div className="w-[500px]">
        <CreatableMultiSelect
          value={value}
          onValueChange={setValue}
          options={TONE_OPTIONS}
          state="error"
          placeholder="Select at least one tone"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-[500px]">
        <CreatableMultiSelect
          value={["Professional and highly concise"]}
          options={TONE_OPTIONS}
          disabled
          placeholder="Enter or select tone"
        />
      </div>
    )
  },
}

export const EmptyOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([])
    return (
      <div className="w-[500px]">
        <CreatableMultiSelect
          value={value}
          onValueChange={setValue}
          options={[]}
          placeholder="Type to create tags"
        />
      </div>
    )
  },
}
