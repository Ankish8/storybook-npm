export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type FunctionTabType = "header" | "queryParams" | "body";

export type KnowledgeFileStatus = "training" | "trained" | "error";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface FunctionItem {
  id: string;
  name: string;
  isBuiltIn?: boolean;
}

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  status: KnowledgeFileStatus;
}

export interface CreateFunctionStep1Data {
  name: string;
  prompt: string;
}

export interface CreateFunctionStep2Data {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  body: string;
}

export interface CreateFunctionData
  extends CreateFunctionStep1Data,
    CreateFunctionStep2Data {}

export interface CreateFunctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateFunctionData) => void;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  /** Storybook/testing: start at a specific step (1 or 2) */
  initialStep?: 1 | 2;
  /** Storybook/testing: start on a specific tab when initialStep=2 */
  initialTab?: FunctionTabType;
  className?: string;
}

export interface IvrBotConfigData {
  botName: string;
  primaryRole: string;
  tone: string[];
  voice: string;
  language: string;
  systemPrompt: string;
  agentBusyPrompt: string;
  noExtensionPrompt: string;
  knowledgeBaseFiles: KnowledgeBaseFile[];
  functions: FunctionItem[];
  frustrationHandoverEnabled: boolean;
  escalationDepartment: string;
  silenceTimeout: number;
  callEndThreshold: number;
  interruptionHandling: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface IvrBotConfigProps {
  botTitle?: string;
  botType?: string;
  /** Optional "Last updated at HH:MM AM/PM" text shown in the page header */
  lastUpdatedAt?: string;
  initialData?: Partial<IvrBotConfigData>;
  onSaveAsDraft?: (data: IvrBotConfigData) => void;
  onPublish?: (data: IvrBotConfigData) => void;
  onSaveKnowledgeFiles?: (files: File[]) => void;
  /** Called for each file during upload with progress/error handlers. If omitted, uses fake progress. */
  onUploadKnowledgeFile?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSampleFileDownload?: () => void;
  onDownloadKnowledgeFile?: (fileId: string) => void;
  onDeleteKnowledgeFile?: (fileId: string) => void;
  onCreateFunction?: (data: CreateFunctionData) => void;
  /** Called when user deletes a custom function */
  onDeleteFunction?: (id: string) => void;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  onBack?: () => void;
  /** Called when the play icon is clicked on a voice option */
  onPlayVoice?: (voiceValue: string) => void;
  /** Called when the pause icon is clicked on a playing voice */
  onPauseVoice?: (voiceValue: string) => void;
  /** The voice value currently being played */
  playingVoice?: string;
  /** Override available role options for BotIdentityCard */
  roleOptions?: SelectOption[];
  /** Override available tone options for BotIdentityCard */
  toneOptions?: SelectOption[];
  /** Override available voice options for BotIdentityCard */
  voiceOptions?: SelectOption[];
  /** Override available language options for BotIdentityCard */
  languageOptions?: SelectOption[];
  /** Override session variable chips for BotBehaviorCard */
  sessionVariables?: string[];
  /** Override escalation department options for FrustrationHandoverCard */
  escalationDepartmentOptions?: SelectOption[];
  /** Override silence timeout bounds */
  silenceTimeoutMin?: number;
  silenceTimeoutMax?: number;
  /** Override call end threshold bounds */
  callEndThresholdMin?: number;
  callEndThresholdMax?: number;
  className?: string;
}

// ─── File Upload Modal ──────────────────────────────────────────────────────

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
}

export interface UploadProgressHandlers {
  onProgress: (progress: number) => void;
  onError: (message: string) => void;
}

export interface FileUploadModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSave"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called for each file to handle the actual upload. If not provided, uses fake progress (demo mode). */
  onUpload?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSave?: (files: File[]) => void;
  onCancel?: () => void;
  onSampleDownload?: () => void;
  sampleDownloadLabel?: string;
  showSampleDownload?: boolean;
  acceptedFormats?: string;
  formatDescription?: string;
  maxFileSizeMB?: number;
  multiple?: boolean;
  title?: string;
  uploadButtonLabel?: string;
  dropDescription?: string;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
}
