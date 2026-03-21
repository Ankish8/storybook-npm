/**
 * CreateBotModal — props and argTypes for Storybook (single source of truth).
 */

export const description = "Modal to create a new bot: name input and bot type (Chat / Voice) selection.";

/** Event props for CreateBotModal (all callbacks this component exposes). */
export const events = ["onOpenChange", "onSubmit"] as const;

/** Storybook argTypes — use in CreateBotModal meta so Controls show only modal props. */
export const argTypes = {
  open: { control: "boolean", description: "Open state" },
  onOpenChange: { action: "onOpenChange", description: "When open state changes (e.g. close button, overlay click)" },
  onSubmit: { action: "onSubmit", description: "When Create button is clicked and form is submitted with { name, type }" },
  isLoading: { control: "boolean", description: "Shows loading spinner on Create button and disables it" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| open | boolean | Yes | — | Open state |
| onOpenChange | (open: boolean) => void | Yes | — | When open state changes (e.g. close button, overlay click) |
| onSubmit | (data: { name: string; type: BOT_TYPE }) => void | No | — | When Create button is clicked and form is submitted |
| isLoading | boolean | No | false | Shows loading spinner on Create button and disables it |
| className | string | No | — | Content className |
`;
