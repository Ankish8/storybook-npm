import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { SingleTabEnforcement } from "./single-tab-enforcement";

const meta: Meta<typeof SingleTabEnforcement> = {
  title: "Custom/Chat/Single Tab Enforcement",
  component: SingleTabEnforcement,
  args: {
    onUseHereClick: fn(),
  },
  argTypes: {
    title: {
      control: "text",
      description: "Header row copy.",
    },
    description: {
      control: "text",
      description: "Body row copy.",
    },
    actionLabel: {
      control: "text",
      description: "Footer primary button label.",
    },
    onUseHereClick: {
      description:
        "Invoked when the user confirms (inline button, or modal button when `openModalOnAction` is true).",
    },
    openModalOnAction: {
      control: "boolean",
      description:
        "If true, only a trigger button is shown; the notice opens in a standard Dialog (confirm runs `onUseHereClick`).",
    },
    onModalOpenChange: {
      description: "Fires when the confirmation modal opens or closes.",
    },
    className: {
      control: "text",
      description: "Merged onto the root card container.",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Notice card shown when the chat session is already active in another browser tab. Composes **Typography** (title + body) and **Button** (primary), with horizontal rules between header, body, and footer — same building blocks as \`chat-notification\` and \`clear-local-chat-data\`.

### Installation

\`\`\`bash
npx myoperator-ui add single-tab-enforcement
\`\`\`

### Import

\`\`\`tsx
import { SingleTabEnforcement } from "@/components/custom/single-tab-enforcement"
\`\`\`

### Tokens

Uses \`bg-semantic-bg-primary\`, \`border-semantic-border-layout\`, \`text-semantic-text-primary\`, \`text-semantic-text-muted\`, and primary \`Button\` (\`variant=\"default\"\` → \`bg-semantic-primary\` / \`text-semantic-text-inverted\`). With \`openModalOnAction\`, a single trigger opens a **Dialog** whose panel uses the **same three-section card layout** as the inline notice (dividers, typography, centered primary button).
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SingleTabEnforcement>;

export const Overview: Story = {};

export const NoticePage: Story = {
  name: "Notice card",
  parameters: {
    docs: {
      description: {
        story:
          "Default copy: session is active elsewhere; primary action **Use here** moves control to this tab (wire `onUseHereClick` in the host app).",
      },
    },
  },
};

export const CustomCopy: Story = {
  args: {
    title: "Already open elsewhere",
    description:
      "Close the other tab or choose to continue here to avoid losing messages.",
    actionLabel: "Continue here",
  },
};

export const ModalOnAction: Story = {
  name: "Confirm in modal",
  args: {
    openModalOnAction: true,
    onModalOpenChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A **single** trigger opens a **Dialog** styled like the notice card (second screenshot). `onUseHereClick` runs when the user confirms in the dialog.",
      },
    },
  },
};
