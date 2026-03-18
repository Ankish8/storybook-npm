/**
 * CreateBotFlow — create card + Create Bot modal (no header).
 */

export const description =
  "Create bot flow: \"Create new bot\" card and Create Bot modal. No header (title/subtitle/search). Use for the create-bot experience without the list header.";

export const events = ["onSubmit"] as const;

export const argTypes = {
  createCardLabel: { control: "text", description: "Create new bot card label" },
  onSubmit: { action: "onSubmit", description: "When Create Bot modal is submitted with { name, type }" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| createCardLabel | string | No | "Create new bot" | Create card label |
| onSubmit | (data: { name: string; type: BOT_TYPE }) => void | No | — | When Create Bot modal is submitted |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props |
`;
