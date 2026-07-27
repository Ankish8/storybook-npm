/**
 * BotCard — props and argTypes for Storybook (single source of truth).
 */

export const description = "Single card for a bot: icon, type badge, name, conversation count, action menu.";

/** Event props for BotCard (all callbacks this component exposes). */
export const events = ["onEdit", "onDelete", "onNumbersClick"] as const;

/** Storybook argTypes — use in BotCard meta so Controls show all card props. */
export const argTypes = {
  bot: {
    control: false,
    description:
      'Bot data object. Optional `status: "draft" | "published"` — when "draft", shows "Unpublished changes" with red indicator in Last Published section. Voicebots also support `numbersAttached: number` — renders the "Numbers mapped" pill (or "-" when 0).',
  },
  typeLabels: { control: false, description: "Override type badge labels (e.g. Voicebot, Chatbot)" },
  onEdit: { action: "onEdit", description: "Called with bot id when Edit is selected (card click or menu)" },
  onDelete: { action: "onDelete", description: "Called with bot id when Delete is selected from menu" },
  onNumbersClick: {
    action: "onNumbersClick",
    description:
      "Voicebot only: called with (botId, numbersAttached) when the numbers pill is clicked. Pill is interactive only when bot.numbersAttached > 0 and this handler is set.",
  },
  className: { control: "text", description: "Root className for the card container" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| bot | Bot | Yes | — | Bot data |
| typeLabels | Partial<Record<BotType, string>> | No | — | Override type badge labels |
| onEdit | (botId: string) => void | No | — | When Edit is selected (card click or menu) |
| onDelete | (botId: string) => void | No | — | When Delete is selected from menu |
| onNumbersClick | (botId: string, numbersAttached: number) => void | No | — | Voicebot only: numbers pill click (only when bot.numbersAttached > 0) |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick, onKeyDown) |
`;
