/**
 * BotList — props and argTypes for Storybook (only props needed for typical use).
 */

export const description = "Container: header, search, grid (create card + bot cards), and Create Bot modal.";

/** Event props for BotList (callbacks this component exposes). */
export const events = [
  "onCreateBot",
  "onCreateBotSubmit",
  "onBotEdit",
  "onBotDelete",
  "onSearch",
] as const;

/** Storybook argTypes — only the props used for typical BotList usage. */
export const argTypes = {
  bots: {
    control: false,
    description:
      'Array of bot objects. Each bot may include optional `status: "draft" | "published"`. When `status === "draft"`, the card shows "Unpublished changes" in the Last Published section.',
  },
  title: { control: "text", description: "Page title" },
  subtitle: { control: "text", description: "Page subtitle" },
  onCreateBot: { action: "onCreateBot", description: "Called when the Create new bot card is clicked (modal opens)" },
  onCreateBotSubmit: { action: "onCreateBotSubmit", description: "Called with { name, type } when the Create Bot modal is submitted" },
  onBotEdit: { action: "onBotEdit", description: "Called with bot id when Edit is selected on a bot" },
  onBotDelete: { action: "onBotDelete", description: "Called with bot id when Delete is selected on a bot" },
  onSearch: { action: "onSearch", description: "Called with the current search query" },
  chatbotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal — disables Chat bot type" },
  voicebotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal — disables Voice bot type" },
  chatbotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal" },
  voicebotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| bots | Bot[] | No | [] | List of bots to display |
| title | string | No | "AI Bot" | Page title |
| subtitle | string | No | "Create & manage AI bots" | Page subtitle |
| onCreateBot | () => void | No | — | When Create new bot card is clicked |
| onCreateBotSubmit | (data: { name: string; type: BOT_TYPE }) => void | No | — | When Create Bot modal form is submitted |
| onBotEdit | (botId: string) => void | No | — | When Edit is selected on a bot (card click or menu) |
| onBotDelete | (botId: string) => void | No | — | When Delete is selected on a bot |
| onSearch | (query: string) => void | No | — | When search query changes |
| chatbotDisabled | boolean | No | false | CreateBotModal: disables Chat bot type |
| voicebotDisabled | boolean | No | false | CreateBotModal: disables Voice bot type |
| chatbotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Chat bot disabled |
| voicebotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Voice bot disabled |
`;
