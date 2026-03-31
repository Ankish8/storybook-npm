import type * as React from "react";

export const BOT_TYPE = {
  CHAT: 1,
  VOICE: 2,
} as const;

export type BOT_TYPE = (typeof BOT_TYPE)[keyof typeof BOT_TYPE];

export type BotType = "chatbot" | "voicebot";

export type BotStatus = "draft" | "published";

/**
 * Single bot shape for both Chatbot and Voicebot.
 * Use the same BotCard for both; set type to "chatbot" or "voicebot" and pass all data via this prop.
 */
export interface Bot {
  id: string;
  name: string;
  /** "chatbot" | "voicebot" — determines icon and default badge label; all other data is from this object */
  type: BotType;
  conversationCount: number;
  lastPublishedBy?: string;
  lastPublishedDate?: string;
  /** Optional custom label for the type badge (overrides typeLabels and default "Chatbot"/"Voicebot") */
  typeLabel?: string;
  /** When "draft", card shows "Unpublished changes" with red indicator in the Last Published section */
  status?: BotStatus;
}

export interface BotCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Single bot object: pass chatbot or voicebot data here; card renders based on bot.type and bot fields */
  bot: Bot;
  /** Override labels for bot types (e.g. { chatbot: "Chat", voicebot: "Voice" }). Ignored if bot.typeLabel is set. */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when Edit action is selected */
  onEdit?: (botId: string) => void;
  /** Called when Delete action is selected */
  onDelete?: (botId: string) => void;
}

export interface CreateBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with name and BOT_TYPE (CHAT = 1, VOICE = 2) when user submits */
  onSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Shows loading spinner on Create button and disables it (e.g. while API call is in flight) */
  isLoading?: boolean;
  /** When true, Chat bot type cannot be selected */
  chatbotDisabled?: boolean;
  /** When true, Voice bot type cannot be selected */
  voicebotDisabled?: boolean;
  /**
   * Shown on hover/focus when Chat bot is disabled. Tooltip is not rendered when omitted or empty.
   */
  chatbotDisabledTooltip?: string;
  /**
   * Shown on hover/focus when Voice bot is disabled. Tooltip is not rendered when omitted or empty.
   */
  voicebotDisabledTooltip?: string;
  /**
   * Maximum length for the bot name field (sets `maxLength` on the input). Omit for no browser limit.
   */
  botNameMaxLength?: number;
  className?: string;
}

export interface BotListHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Page title */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Layout variant: default (title + subtitle only) or withSearch (row with optional right slot) */
  variant?: "default" | "withSearch";
  /** Right-side content when variant is "withSearch" (e.g. BotListSearch) */
  rightContent?: React.ReactNode;
}

export interface BotListSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled value (use with onSearch) */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Called when the search value changes */
  onSearch?: (query: string) => void;
  /** Uncontrolled: default value */
  defaultValue?: string;
}

export interface BotListCreateCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label for the create card (e.g. "Create new bot") */
  label?: string;
}

export interface BotListGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Props forwarded to CreateBotModal for bot-type gating (optional). */
export type CreateBotModalTypeOptionsProps = Pick<
  CreateBotModalProps,
  | "chatbotDisabled"
  | "voicebotDisabled"
  | "chatbotDisabledTooltip"
  | "voicebotDisabledTooltip"
  | "botNameMaxLength"
>;

/** Props for CreateBotFlow: create card + Create Bot modal (no header). */
export interface CreateBotFlowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSubmit">,
    CreateBotModalTypeOptionsProps {
  /** Create new bot card label */
  createCardLabel?: string;
  /** Called when Create Bot modal is submitted with { name, type } */
  onSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
}

/** Props for EditBotFlow: bot list + config view when Edit is clicked. */
export interface EditBotFlowProps extends CreateBotModalTypeOptionsProps {
  /** Bots to show in the list (e.g. first 2 for demo) */
  bots: Bot[];
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Create new bot card label */
  createCardLabel?: string;
  /** Override type badge labels */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when Delete is selected on a bot */
  onBotDelete?: (botId: string) => void;
  /** Called when Create Bot modal is submitted */
  onCreateBotSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Renders the config view for the given bot; call onBack() to return to list */
  renderConfig: (bot: Bot, onBack: () => void) => React.ReactNode;
  /** Optional instruction text above the list (e.g. "Click the ⋮ menu...") */
  instructionText?: React.ReactNode;
  /** Root className for the list wrapper */
  className?: string;
}

export interface BotListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children">,
    CreateBotModalTypeOptionsProps {
  /** List of bots to display */
  bots?: Bot[];
  /** Override type badge labels for all cards (e.g. { chatbot: "Chat", voicebot: "Voice" }). Per-bot bot.typeLabel still wins. */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when the "Create new bot" card is clicked (modal opens) */
  onCreateBot?: () => void;
  /** Called when the Create Bot modal is submitted with the new bot data (type is BOT_TYPE: CHAT = 1, VOICE = 2) */
  onCreateBotSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  /** Called when user selects Edit on a bot (card click or menu) */
  onBotEdit?: (botId: string) => void;
  /** Called when user selects Delete on a bot */
  onBotDelete?: (botId: string) => void;
  /** Called when the search query changes */
  onSearch?: (query: string) => void;
  /** Page title (default: "AI Bot") */
  title?: string;
  /** Page subtitle (default: "Create & manage AI bots") */
  subtitle?: string;
  /** Placeholder for the search input (default: "Search bot...") */
  searchPlaceholder?: string;
  /** Label for the create-new-bot card (default: "Create new bot") */
  createCardLabel?: string;
}
