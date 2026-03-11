export type BotType = "chatbot" | "voicebot";

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  conversationCount: number;
  lastPublishedBy?: string;
  lastPublishedDate?: string;
}

export interface BotCardProps {
  bot: Bot;
  /** Called when Edit action is selected */
  onEdit?: (botId: string) => void;
  /** Called when Publish action is selected */
  onPublish?: (botId: string) => void;
  /** Called when Delete action is selected */
  onDelete?: (botId: string) => void;
  className?: string;
}

export interface CreateBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { name: string; type: BotType }) => void;
  className?: string;
}

export interface BotListProps {
  bots?: Bot[];
  /** Called when the "Create new bot" card is clicked (modal opens) */
  onCreateBot?: () => void;
  /** Called when the Create Bot modal is submitted with the new bot data */
  onCreateBotSubmit?: (data: { name: string; type: BotType }) => void;
  onBotEdit?: (botId: string) => void;
  onBotPublish?: (botId: string) => void;
  onBotDelete?: (botId: string) => void;
  onSearch?: (query: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}
