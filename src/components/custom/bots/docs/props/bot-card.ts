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
      'Bot data object. Optional `status: "draft" | "published"` — when "draft", shows "Unpublished changes" with red indicator in Last Published section.',
  },
  typeLabels: { control: false, description: "Override type badge labels (e.g. Voicebot, Chatbot)" },
  showNumbersMapped: {
    control: "boolean",
    description:
      'Voicebot only: when false, the "Numbers mapped" section is removed from the card. Defaults to true.',
  },
  numbersAttached: {
    control: "number",
    description:
      "Voicebot only: count of phone numbers mapped to this bot. Defaults to 0, which renders noNumberMessage.",
  },
  isFetchingNumbers: {
    control: "boolean",
    description:
      'Voicebot only: while true, the "Numbers mapped" row shows a small spinner instead of the count. Defaults to false.',
  },
  noNumberMessage: {
    control: "text",
    description:
      'Voicebot only: text shown in place of the count when no numbers are mapped. Defaults to "-".',
  },
  DisableDelete: {
    control: "boolean",
    description:
      "When true, only the Delete menu item is disabled; the rest of the card stays interactive. Defaults to false.",
  },
  TooltipDelete: {
    control: "text",
    description:
      "Shown on hover of the Delete menu item only when DisableDelete is true. Tooltip is not rendered when omitted or empty.",
  },
  onEdit: { action: "onEdit", description: "Called with bot id when Edit is selected (card click or menu)" },
  onDelete: { action: "onDelete", description: "Called with bot id when Delete is selected from menu" },
  onNumbersClick: {
    action: "onNumbersClick",
    description:
      "Voicebot only: called with (botId, numbersAttached) when the numbers pill is clicked. Pill is interactive only when numbersAttached > 0 and this handler is set.",
  },
  className: { control: "text", description: "Root className for the card container" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| bot | Bot | Yes | — | Bot data |
| typeLabels | Partial<Record<BotType, string>> | No | — | Override type badge labels |
| showNumbersMapped | boolean | No | true | Voicebot only: set false to remove the "Numbers mapped" section |
| numbersAttached | number | No | 0 | Voicebot only: mapped-number count (noNumberMessage when 0) |
| isFetchingNumbers | boolean | No | false | Voicebot only: show a sm Spinner in place of the count |
| noNumberMessage | string | No | "-" | Voicebot only: text shown when no numbers are mapped |
| DisableDelete | boolean | No | false | Disables only the Delete menu item; rest of the card stays interactive |
| TooltipDelete | string | No | — | Hover tooltip on the disabled Delete item (only when DisableDelete is true) |
| onEdit | (botId: string) => void | No | — | When Edit is selected (card click or menu) |
| onDelete | (botId: string) => void | No | — | When Delete is selected from menu |
| onNumbersClick | (botId: string, numbersAttached: number) => void | No | — | Voicebot only: numbers pill click (only when numbersAttached > 0) |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick, onKeyDown) |
`;
