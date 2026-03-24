import type { Meta, StoryObj } from "@storybook/react";
import { BotListHeader } from "./bot-list-header";
import { BotListSearch } from "./bot-list-search";
import {
  botListHeaderDescription,
  botListHeaderPropsTable,
} from "./docs/props";

const meta: Meta<typeof BotListHeader> = {
  title: "Custom/AI Bot/BotList/BotListHeader",
  component: BotListHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
${botListHeaderDescription}

### Installation

\`\`\`bash
npx myoperator-ui add bot-list
\`\`\`

### Import

\`\`\`tsx
import { BotListHeader, BotListSearch } from "@/components/custom/bots";
\`\`\`

### Design Tokens

| Token | Usage |
|-------|--------|
| \`text-semantic-text-primary\` | Title text |
| \`text-semantic-text-muted\` | Subtitle text |
| \`border-semantic-border-layout\` | Bottom border (withSearch variant) |

${botListHeaderPropsTable}
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Page title" },
    subtitle: { control: "text", description: "Optional subtitle" },
    variant: {
      control: "select",
      options: ["default", "withSearch"],
      description: "Layout: default (title + subtitle) or withSearch (row with right slot)",
    },
    rightContent: {
      description: "Right-side content when variant is withSearch (e.g. BotListSearch)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "AI Bot",
    subtitle: "Create & manage AI bots",
    variant: "default",
  },
};

export const WithSearch: Story = {
  args: {
    title: "AI Bot",
    subtitle: "Create & manage AI bots",
    variant: "withSearch",
  },
  render: (args) => (
    <BotListHeader
      {...args}
      rightContent={
        <BotListSearch
          placeholder="Search bot..."
          onSearch={() => {}}
        />
      }
    />
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "AI Bot",
    variant: "default",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <div>
        <p className="m-0 text-xs font-medium text-semantic-text-muted mb-2">Default</p>
        <BotListHeader
          title="AI Bot"
          subtitle="Create & manage AI bots"
          variant="default"
        />
      </div>
      <div>
        <p className="m-0 text-xs font-medium text-semantic-text-muted mb-2">With Search</p>
        <BotListHeader
          title="AI Bot"
          subtitle="Create & manage AI bots"
          variant="withSearch"
          rightContent={
            <BotListSearch placeholder="Search bot..." onSearch={() => {}} />
          }
        />
      </div>
    </div>
  ),
};
