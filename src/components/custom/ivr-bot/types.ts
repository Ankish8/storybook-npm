import type { UploadProgressHandlers } from "../file-upload-modal";
import type { AdvancedSettingsNumericBounds } from "./advanced-settings-bounds";
import type {
  AdvancedSettingsData,
  AdvancedSettingsNumericFieldBlurDetail,
} from "./advanced-settings-card";

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
  /** Required for API-backed function variables (trimmed). */
  description: string;
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

/**
 * Test values for "Test Your API": keys are full placeholders as in the form
 * (e.g. `"{{Caller number}}"`), values are the strings the user entered.
 */
export type CreateFunctionTestValues = Record<string, string>;

export interface CreateFunctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateFunctionData) => void;
  onTestApi?: (
    step2: CreateFunctionStep2Data,
    testValues?: CreateFunctionTestValues
  ) => Promise<string>;
  /** Pre-fills all fields — use when opening the modal to edit an existing function */
  initialData?: Partial<CreateFunctionData>;
  /** When true, changes the modal title to "Edit Function" */
  isEditing?: boolean;
  /** Maximum character length for the function name (default: 30) */
  nameMaxLength?: number;
  /** Minimum character length for the prompt field (default: 100) */
  promptMinLength?: number;
  /** Maximum character length for the prompt field (default: 2000) */
  promptMaxLength?: number;
  /** Storybook/testing: start at a specific step (1 or 2) */
  initialStep?: 1 | 2;
  /** Storybook/testing: start on a specific tab when initialStep=2 */
  initialTab?: FunctionTabType;
  /** Session variables available for {{ autocomplete in URL, body, header values, and query param values */
  sessionVariables?: string[];
  /**
   * Grouped variables for the {{ autocomplete popup (overrides flat list display when provided).
   * Items with `required: true` are validated when the user clicks Test API (inline errors under each empty field).
   */
  variableGroups?: VariableGroup[];
  /**
   * Called when user saves a new variable from the autocomplete popup.
   * The modal replaces the open `{{…` fragment in the focused field with `{{name}}`.
   * When using `variableGroups`, merge the new item into the matching group in your state
   * so it appears in the dropdown on the next open.
   */
  onAddVariable?: (data: VariableFormData) => void;
  /**
   * Called when the user saves "Edit variable". The modal already renames
   * `{{function.name}}` / `{{name}}` across URL, body, headers, query params, and test values.
   * Update your `variableGroups` (and persist to your backend) using `originalName` → `data.name`.
   */
  onEditVariable?: (originalName: string, data: VariableFormData) => void;
  /** When true, all form fields are disabled (view mode) but Next is enabled so user can browse steps */
  disabled?: boolean;
  /**
   * Maximum header rows; the Add row control is disabled at this count.
   * Defaults to 20 when omitted.
   */
  maxHeaderRows?: number;
  /**
   * Maximum query parameter rows; the Add row control is disabled at this count.
   * Defaults to 20 when omitted.
   */
  maxQueryParamRows?: number;
  /**
   * When true (default), Step 2 Submit requires at least one header or query row with both key and value filled.
   * Set to false to allow saving with only a URL (empty headers and query params).
   */
  requireHeaderOrQueryPair?: boolean;
  className?: string;
  /**
   * Max length for the variable name in the Create/Edit variable modal.
   * Omit for default (30). Pass `null` for no limit.
   */
  variableNameMaxLimit?: number | null;
  /**
   * Max length for the variable description in the Create/Edit variable modal.
   * Omit for default (2000). Pass `null` for no limit.
   */
  descriptionMaxLimit?: number | null;
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
  /** Undefined when the field was cleared; validate before save/publish. */
  silenceTimeout?: number;
  /** Undefined when the field was cleared; validate before save/publish. */
  callEndThreshold?: number;
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
  onTestApi?: (
    step2: CreateFunctionStep2Data,
    testValues?: CreateFunctionTestValues
  ) => Promise<string>;
  /** Hover text for the info icon in the Functions card header */
  functionsInfoTooltip?: string;
  /**
   * Override Knowledge Base header info tooltip.
   * When omitted, the card uses its built-in default copy. Pass `""` to show a non-interactive icon only.
   */
  knowledgeBaseInfoTooltip?: string;
  /** Passed to BotIdentityCard — hover text on the info icon next to Bot Name & Identity */
  botNameIdentityTooltip?: string;
  /** Passed to BotIdentityCard — hover text on the info icon next to Primary Role */
  primaryRoleTooltip?: string;
  /** Passed to BotIdentityCard — hover text on the info icon next to Tone */
  toneTooltip?: string;
  /** Passed to BotIdentityCard — hover text on the info icon next to How It Sounds */
  howItSoundsTooltip?: string;
  /** Passed to BotIdentityCard — hover text on the info icon next to What Language It Speaks */
  languageModeTooltip?: string;
  /** Minimum character length for the function prompt (default: 100) */
  functionPromptMinLength?: number;
  /** Maximum character length for the function name in Create/Edit Function (default: 30) */
  functionNameMaxLength?: number;
  /** Maximum character length for the function prompt (default: 2000) */
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
  /**
   * Function-scoped variables for Create / Edit Function modal (`{{` autocomplete; `required` applies to Test API validation only).
   * Pass the same groups your app persists; items with `required: true` block Test API until test values are filled for placeholders used in the request.
   */
  functionVariableGroups?: VariableGroup[];
  /** When set with `functionVariableGroups`, called after the user saves a new variable from the modal. */
  onAddFunctionVariable?: (data: VariableFormData) => void;
  /** When set with `functionVariableGroups`, called after the user saves an edited variable. */
  onEditFunctionVariable?: (originalName: string, data: VariableFormData) => void;
  /** Override escalation department options for FrustrationHandoverCard */
  escalationDepartmentOptions?: SelectOption[];
  /**
   * Shorthand min/max for Advanced Settings numeric fields. Individual
   * `silenceTimeoutMin` / `silenceTimeoutMax` / `callEndThresholdMin` / `callEndThresholdMax`
   * override corresponding entries when set.
   */
  advancedSettingsNumericBounds?: Partial<AdvancedSettingsNumericBounds>;
  /** Override silence timeout min (after `advancedSettingsNumericBounds`) */
  silenceTimeoutMin?: number;
  /** Override silence timeout max (after `advancedSettingsNumericBounds`) */
  silenceTimeoutMax?: number;
  /** Override call end threshold min (after `advancedSettingsNumericBounds`) */
  callEndThresholdMin?: number;
  /** Override call end threshold max (after `advancedSettingsNumericBounds`) */
  callEndThresholdMax?: number;
  /**
   * Fires when any Advanced Settings field changes (numeric commit, stepper, interruption toggle).
   */
  onAdvancedSettingsChange?: (patch: Partial<AdvancedSettingsData>) => void;
  /** Fires when silence timeout blurs after validation (see `AdvancedSettingsNumericFieldBlurDetail`). */
  onSilenceTimeoutBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Fires when call end threshold blurs after validation. */
  onCallEndThresholdBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Passed to Advanced Settings — hover text on the info icon next to Silence Wait Duration */
  silenceWaitDurationTooltip?: string;
  /** Passed to Advanced Settings — hover text on the info icon next to Maximum Silence Retries */
  maximumSilenceRetriesTooltip?: string;
  /** Passed to Advanced Settings — muted helper line under the Maximum Silence Retries input */
  maximumSilenceRetriesHelpText?: string;
  /** Passed to Advanced Settings — muted helper line under Interruption Handling */
  interruptionHandlingHelpText?: string;
  className?: string;
}

export type { AdvancedSettingsNumericBounds } from "./advanced-settings-bounds";
export type { AdvancedSettingsNumericFieldBlurDetail } from "./advanced-settings-card";

// ─── File Upload Modal (re-exported from shared module) ─────────────────────

export type {
  UploadStatus,
  UploadItem,
  UploadProgressHandlers,
  FileUploadModalProps,
} from "../file-upload-modal";
