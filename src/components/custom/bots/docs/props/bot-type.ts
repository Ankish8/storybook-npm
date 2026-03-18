/**
 * Bot type — shared type documentation.
 */

export const propsTable = `
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique id |
| name | string | Yes | Display name |
| type | "chatbot" \\| "voicebot" | Yes | Bot type |
| conversationCount | number | Yes | Conversation count |
| lastPublishedBy | string | No | Last published by |
| lastPublishedDate | string | No | Last published date |
| typeLabel | string | No | Override type badge label |
| status | "draft" \\| "published" | No | When "draft", card shows "Unpublished changes" in Last Published section |
`;
