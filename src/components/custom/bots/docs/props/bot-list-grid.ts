/**
 * BotListGrid — props documentation for docs section only.
 */

export const description = "Responsive grid wrapper for create card and bot cards.";

/** Event props for BotListGrid (none; pass DOM events via ...props if needed). */
export const events: readonly string[] = [];

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | — | Grid content |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick, onKeyDown) |
`;
