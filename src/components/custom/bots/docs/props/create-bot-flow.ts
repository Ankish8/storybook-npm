/**
 * CreateBotFlow — create card + Create Bot modal (no header).
 */

export const description =
  "Create bot flow: \"Create new bot\" card and Create Bot modal. No header (title/subtitle/search). Use for the create-bot experience without the list header.";

export const events = ["onSubmit"] as const;

export const argTypes = {
  createCardLabel: { control: "text", description: "Create new bot card label" },
  onSubmit: { action: "onSubmit", description: "When Create Bot modal is submitted with { name, type }" },
  chatbotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal" },
  voicebotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal" },
  chatbotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal" },
  voicebotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal" },
  botNameMaxLength: { control: "number", description: "Forwarded to CreateBotModal — max length for bot name" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| createCardLabel | string | No | "Create new bot" | Create card label |
| onSubmit | (data: { name: string; type: BOT_TYPE }) => void | No | — | When Create Bot modal is submitted |
| chatbotDisabled | boolean | No | false | CreateBotModal: disables Chat bot type |
| voicebotDisabled | boolean | No | false | CreateBotModal: disables Voice bot type |
| chatbotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Chat bot disabled |
| voicebotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Voice bot disabled |
| botNameMaxLength | number | No | — | CreateBotModal: max length for bot name |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props |
`;
