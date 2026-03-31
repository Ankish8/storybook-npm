/**
 * EditBotFlow — bot list + config view when Edit is clicked.
 */

export const description =
  "Edit bot flow: bot list and config view when Edit is clicked. Parent supplies config via renderConfig(bot, onBack).";

export const events = ["onBotDelete", "onCreateBotSubmit", "onSearch"] as const;

export const argTypes = {
  title: { control: "text", description: "Page title" },
  subtitle: { control: "text", description: "Page subtitle" },
  searchPlaceholder: { control: "text", description: "Search input placeholder" },
  createCardLabel: { control: "text", description: "Create new bot card label" },
  bots: { control: false, description: "Bots to show in the list" },
  typeLabels: { control: false, description: "Override type badge labels" },
  onBotDelete: { action: "onBotDelete", description: "When Delete is selected on a bot" },
  onCreateBotSubmit: { action: "onCreateBotSubmit", description: "When Create Bot modal is submitted" },
  onSearch: { action: "onSearch", description: "When search query changes" },
  renderConfig: { control: false, description: "(bot, onBack) => ReactNode — renders config view" },
  instructionText: { control: false, description: "Optional instruction above the list" },
  chatbotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal via BotList" },
  voicebotDisabled: { control: "boolean", description: "Forwarded to CreateBotModal via BotList" },
  chatbotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal via BotList" },
  voicebotDisabledTooltip: { control: "text", description: "Forwarded to CreateBotModal via BotList" },
  botNameMaxLength: { control: "number", description: "Forwarded to BotList / CreateBotModal — max length for bot name" },
} as const;

export const propsTable = `
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| bots | Bot[] | Yes | — | Bots to show in the list |
| title | string | No | "AI Bot" | Page title |
| subtitle | string | No | "Create & manage AI bots" | Page subtitle |
| searchPlaceholder | string | No | "Search bot..." | Search input placeholder |
| createCardLabel | string | No | "Create new bot" | Create card label |
| typeLabels | Partial<Record<BotType, string>> | No | — | Override type badge labels |
| onBotDelete | (botId: string) => void | No | — | When Delete is selected on a bot |
| onCreateBotSubmit | (data) => void | No | — | When Create Bot modal is submitted |
| onSearch | (query: string) => void | No | — | When search query changes |
| renderConfig | (bot: Bot, onBack: () => void) => ReactNode | Yes | — | Renders config view; call onBack() to return to list |
| instructionText | ReactNode | No | — | Optional instruction above the list |
| className | string | No | — | Root className for list wrapper |
| chatbotDisabled | boolean | No | false | CreateBotModal: disables Chat bot type |
| voicebotDisabled | boolean | No | false | CreateBotModal: disables Voice bot type |
| chatbotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Chat bot disabled |
| voicebotDisabledTooltip | string | No | — | CreateBotModal: tooltip when Voice bot disabled |
| botNameMaxLength | number | No | — | CreateBotModal: max length for bot name |
`;
