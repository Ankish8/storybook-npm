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

export interface IvrBotConfigProps {
  botTitle?: string;
  botType?: string;
  /** Optional "Last updated at HH:MM AM/PM" text shown in the page header */
  lastUpdatedAt?: string;
  initialData?: Partial<IvrBotConfigData>;
  onSaveAsDraft?: (data: IvrBotConfigData) => void;
  onPublish?: (data: IvrBotConfigData) => void;
  onAddKnowledgeFile?: () => void;
  onSaveKnowledgeFiles?: (files: File[]) => void;
  onSampleFileDownload?: () => void;
  onDownloadKnowledgeFile?: (fileId: string) => void;
  onDeleteKnowledgeFile?: (fileId: string) => void;
  onCreateFunction?: (data: CreateFunctionData) => void;
  onTestApi?: (step2: CreateFunctionStep2Data) => Promise<string>;
  onBack?: () => void;
  className?: string;
}
