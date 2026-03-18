/**
 * BotListHeader — props documentation for docs section only.
 */

export const description = "Page header with title and optional subtitle. Use variant \"withSearch\" to render a full-width row with an optional right slot (e.g. BotListSearch).";

/** Event props for BotListHeader (none; pass DOM events via ...props if needed). */
export const events: readonly string[] = [];

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | No | — | Page title |
| subtitle | string | No | — | Subtitle |
| variant | "default" \\| "withSearch" | No | "default" | Layout: default or withSearch (row with right slot) |
| rightContent | ReactNode | No | — | Right-side content when variant is "withSearch" |
| className | string | No | — | Root className |
| ...props | HTMLDivElement | — | — | Other div props (e.g. onClick, onKeyDown) |
`;
