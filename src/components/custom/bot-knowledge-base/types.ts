export type KnowledgeFileStatus = "training" | "ready" | "pending" | "failed";

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  status: KnowledgeFileStatus;
}

export interface BotKnowledgeBaseProps
  extends React.HTMLAttributes<HTMLDivElement> {
  files: KnowledgeBaseFile[];
  onAddFile?: () => void;
  onDownloadFile?: (id: string) => void;
  onDeleteFile?: (id: string) => void;
  infoTooltip?: string;
  disabled?: boolean;
}
