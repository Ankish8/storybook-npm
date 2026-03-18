/**
 * BotListSearch — props documentation for docs section only.
 */

export const description = "Search input used in the bot list header.";

/** Event props for BotListSearch (all callbacks this component exposes). */
export const events = ["onSearch"] as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | No | — | Controlled value |
| placeholder | string | No | "Search bot..." | Placeholder |
| onSearch | (query: string) => void | No | — | When search input value changes |
| defaultValue | string | No | — | Uncontrolled initial value |
| className | string | No | — | Wrapper className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick, onFocus) |
`;
