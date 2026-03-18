/**
 * BotListCreateCard — props documentation for docs section only.
 */

export const description = "Card button that opens the Create Bot flow (e.g. opens modal).";

/** Event props for BotListCreateCard (all callbacks this component exposes). */
export const events = ["onClick"] as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | No | "Create new bot" | Button label |
| onClick | () => void | No | — | When card/button is clicked |
| className | string | No | — | Button className |
| ...props | ButtonHTMLAttributes | — | — | Other button props (e.g. onFocus, onKeyDown) |
`;
