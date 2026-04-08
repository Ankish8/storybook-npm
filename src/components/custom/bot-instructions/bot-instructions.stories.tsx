import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { BotInstructions } from "./bot-instructions";
import type { InstructionItem } from "./types";

const sampleInstructions: InstructionItem[] = [
  { id: "1", name: "Greeting message", enabled: true, charCount: 120 },
  { id: "2", name: "Closing response", enabled: false, charCount: 85 },
];

const manyInstructions: InstructionItem[] = [
  { id: "1", name: "Greeting message", enabled: true, charCount: 320 },
  { id: "2", name: "Closing response", enabled: true, charCount: 185 },
  { id: "3", name: "Error handling", enabled: false, charCount: 200 },
  { id: "4", name: "Escalation protocol", enabled: true, charCount: 450 },
  { id: "5", name: "Product FAQ", enabled: true, charCount: 445 },
];

const meta: Meta<typeof BotInstructions> = {
  title: "Custom/AI Bot/Bot Config/BotInstructions",
  component: BotInstructions,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Instructions section for bot configuration. Displays instruction items with toggles, character counter, and action buttons.

## Installation

\`\`\`bash
npx myoperator-ui add bot-instructions
\`\`\`

## Import

\`\`\`tsx
import { BotInstructions } from "@/components/custom/bot-instructions"
import type { InstructionItem } from "@/components/custom/bot-instructions"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Section title</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #333333; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Instruction names</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #535862; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Character count, used count</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Total character counter</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Section bottom divider</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E4E4E4; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { BotInstructions } from "@/components/custom/bot-instructions"
import type { InstructionItem } from "@/components/custom/bot-instructions"

const instructions: InstructionItem[] = [
  { id: "1", name: "Greeting message", enabled: true, charCount: 120 },
  { id: "2", name: "Closing response", enabled: false, charCount: 85 },
]

function BotConfigPage() {
  return (
    <BotInstructions
      instructions={instructions}
      usedCharacters={205}
      maxCharacters={5000}
      onAdd={() => console.log("Add instruction")}
      onToggle={(id, enabled) => console.log("Toggle", id, enabled)}
      onEdit={(id) => console.log("Edit", id)}
      onDelete={(id) => console.log("Delete", id)}
      infoTooltip="Add instructions to guide your bot's behavior"
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    instructions: {
      description: "List of instruction items to display",
    },
    maxCharacters: {
      control: "number",
      description: "Maximum allowed characters",
    },
    usedCharacters: {
      control: "number",
      description: "Total characters currently used",
    },
    infoTooltip: {
      control: "text",
      description: "Tooltip text for the info icon",
    },
    disabled: {
      control: "boolean",
      description: "Disables all interactive elements",
    },
    onAdd: { description: "Called when add button is clicked" },
    onToggle: {
      description: "Called when an instruction toggle is changed",
    },
    onEdit: { description: "Called when an instruction edit button is clicked" },
    onDelete: {
      description: "Called when an instruction delete button is clicked",
    },
  },
  args: {
    onAdd: fn(),
    onToggle: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BotInstructions>;

/**
 * Default view with two instructions and character counter.
 */
export const Default: Story = {
  args: {
    instructions: sampleInstructions,
    usedCharacters: 205,
    maxCharacters: 5000,
    infoTooltip: "Add instructions to guide your bot's behavior",
  },
};

/**
 * Empty state when no instructions have been added.
 */
export const Empty: Story = {
  args: {
    instructions: [],
    usedCharacters: 0,
    maxCharacters: 5000,
    infoTooltip: "Add instructions to guide your bot's behavior",
  },
};

/**
 * Multiple instructions with varying character counts and toggle states.
 */
export const WithMultipleInstructions: Story = {
  args: {
    instructions: manyInstructions,
    usedCharacters: 1600,
    maxCharacters: 5000,
    infoTooltip: "Instructions help define your bot's personality and behavior",
  },
};

/**
 * All interactive elements are disabled.
 */
export const Disabled: Story = {
  args: {
    instructions: sampleInstructions,
    usedCharacters: 205,
    maxCharacters: 5000,
    infoTooltip: "Add instructions to guide your bot's behavior",
    disabled: true,
  },
};
