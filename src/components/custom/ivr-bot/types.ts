import type { UploadProgressHandlers } from "../file-upload-modal";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type FunctionTabType = "header" | "queryParams" | "body";

export const BOT_KNOWLEDGE_STATUS = {
  PENDING: "pending",
  READY: "ready",
  PROCESSING: "processing",
  FAILED: "failed",
} as const;

export type KnowledgeFileStatus = typeof BOT_KNOWLEDGE_STATUS[keyof typeof BOT_KNOWLEDGE_STATUS];

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

/** A single variable shown in the {{ autocomplete popup */
export interface VariableItem {
  /** Display name (e.g., "Order_id") */
  name: string;
  /** Value inserted into the input. Defaults to `{{name}}` if omitted */
  value?: string;
  /** When true, an edit icon is shown next to this variable */
  editable?: boolean;
  /** Description of what this variable represents */
  description?: string;
  /** Whether this variable is required */
  required?: boolean;
}

/** Data shape for creating or editing a variable */
export interface VariableFormData {
  name: string;
  description?: string;
  required?: boolean;
}

/** A labelled group of variables in the autocomplete popup */
export interface VariableGroup {
  /** Group header text (e.g., "Function variables", "Session variables") */
  label: string;
  /** Variables in this group */
  items: VariableItem[];
}

export interface FunctionItem {
  id: string;
  name: string;
  isBuiltIn?: boolean;
  /** Hover text shown on the info icon for this function */
  tooltip?: string;
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
  /** Pre-fills all fields — use when opening the modal to edit an existing function */
  initialData?: Partial<CreateFunctionData>;
  /** When true, changes the modal title to "Edit Function" */
  isEditing?: boolean;
  /** Minimum character length for the prompt field (default: 100) */
  promptMinLength?: number;
  /** Maximum character length for the prompt field (default: 1000) */
  promptMaxLength?: number;
  /** Storybook/testing: start at a specific step (1 or 2) */
  initialStep?: 1 | 2;
  /** Storybook/testing: start on a specific tab when initialStep=2 */
  initialTab?: FunctionTabType;
  /** Session variables available for {{ autocomplete in URL, body, header values, and query param values */
  sessionVariables?: string[];
  /** Grouped variables shown in the {{ autocomplete popup (overrides flat list display when provided) */
  variableGroups?: VariableGroup[];
  /** Called when user saves a new variable from the autocomplete popup */
  onAddVariable?: (data: VariableFormData) => void;
  /** Called when user edits a variable from the autocomplete popup */
  onEditVariable?: (originalName: string, data: VariableFormData) => void;
  /** When true, all form fields are disabled (view mode) but Next is enabled so user can browse steps */
  disabled?: boolean;
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
  /** When true, disables all fields in all card components (view mode) */
  disabled?: boolean;
  /** Optional "Last updated at HH:MM AM/PM" text shown in the page header */
  lastUpdatedAt?: string;
  initialData?: Partial<IvrBotConfigData>;
  onSaveAsDraft?: (data: IvrBotConfigData) => void;
  onPublish?: (data: IvrBotConfigData) => void;
  onSaveKnowledgeFiles?: (files: File[]) => void;
  /** Called for each file during upload with progress/error handlers. If omitted, uses fake progress. */
  onUploadKnowledgeFile?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSampleFileDownload?: () => void;
  /** Called when user downloads a knowledge file. When omitted, download button is hidden. */
  onDownloadKnowledgeFile?: (fileId: string) => void;
  /** Called when user deletes a knowledge file. When omitted, delete button is hidden. */
  onDeleteKnowledgeFile?: (fileId: string) => void;
  /** Independently disables the knowledge file download button */
  knowledgeDownloadDisabled?: boolean;
  /** Independently disables the knowledge file delete button */
  knowledgeDeleteDisabled?: boolean;
  onCreateFunction?: (data: CreateFunctionData) => void;
  /** Called when user edits a custom function. When omitted, edit button is hidden. */
  onEditFunction?: (id: string) => void;
  /** Called when user deletes a custom function. When omitted, delete button is hidden. */
  onDeleteFunction?: (id: string) => void;
  /** Independently disables the function edit button */
  functionEditDisabled?: boolean;
  /** Independently disables the function delete button */
  functionDeleteDisabled?: boolean;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  /** Hover text for the info icon in the Functions card header */
  functionsInfoTooltip?: string;
  /** Hover text for the info icon in the Knowledge Base card header */
  knowledgeBaseInfoTooltip?: string;
  /** Minimum character length for the function prompt (default: 100) */
  functionPromptMinLength?: number;
  /** Maximum character length for the function prompt (default: 1000) */
  functionPromptMaxLength?: number;
  /**
   * Pre-filled data shown when the edit function modal opens.
   * Pass when your app fetches full function data after onEditFunction fires.
   */
  functionEditData?: Partial<CreateFunctionData>;
  /** Max character length for the "How It Behaves" system prompt (default: 5000, per Figma) */
  systemPromptMaxLength?: number;
  /**
   * Called when focus leaves the **entire** "How It Behaves" section
   * (textarea + session variable chips). Clicking a chip does NOT trigger
   * this — only clicking outside the whole section does.
   * Use this to persist the system prompt via an API call.
   */
  onSystemPromptBlur?: (value: string) => void;
  /** Called when the Agent Busy Prompt textarea loses focus */
  onAgentBusyPromptBlur?: (value: string) => void;
  /** Called when the No Extension Found textarea loses focus */
  onNoExtensionFoundPromptBlur?: (value: string) => void;
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

// ─── File Upload Modal (re-exported from shared module) ─────────────────────

export type {
  UploadStatus,
  UploadItem,
  UploadProgressHandlers,
  FileUploadModalProps,
} from "../file-upload-modal";
