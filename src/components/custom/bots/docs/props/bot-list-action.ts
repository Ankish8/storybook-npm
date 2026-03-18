/**
 * BotListAction — props documentation for docs section only.
 */

export const description = "Dropdown: Edit and Delete. Used inside BotCard.";

/** Event props for BotListAction (all callbacks this component exposes). */
export const events = ["onEdit", "onDelete"] as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onEdit | () => void | No | — | When Edit menu item is selected |
| onDelete | () => void | No | — | When Delete menu item is selected |
| trigger | ReactNode | No | Default icon button | Custom trigger |
| align | "start" \\| "center" \\| "end" | No | "end" | Menu alignment |
| className | string | No | — | Wrapper className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick) |
`;
