import type * as React from "react";

export enum BOT_TYPE {
  CHAT = 1,
  VOICE = 2,
}

export type BotType = "chatbot" | "voicebot";

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
}

export interface BotCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Single bot object: pass chatbot or voicebot data here; card renders based on bot.type and bot fields */
  bot: Bot;
  /** Override labels for bot types (e.g. { chatbot: "Chat", voicebot: "Voice" }). Ignored if bot.typeLabel is set. */
  typeLabels?: Partial<Record<BotType, string>>;
  /** Called when Edit action is selected */
  onEdit?: (botId: string) => void;
  /** Called when Publish action is selected */
  onPublish?: (botId: string) => void;
  /** Called when Delete action is selected */
  onDelete?: (botId: string) => void;
}

export interface CreateBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with name and BOT_TYPE (CHAT = 1, VOICE = 2) when user submits */
  onSubmit?: (data: { name: string; type: BOT_TYPE }) => void;
  className?: string;
}

export interface BotListHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Page title */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
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

export interface BotListActionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Called when Edit is selected */
  onEdit?: () => void;
  /** Called when Delete is selected */
  onDelete?: () => void;
  /** Custom trigger element; defaults to three-dot icon button */
  trigger?: React.ReactNode;
  /** Content alignment relative to trigger */
  align?: "start" | "center" | "end";
}

export interface BotListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
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
  /** Called when user selects Publish on a bot (menu; optional) */
  onBotPublish?: (botId: string) => void;
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
