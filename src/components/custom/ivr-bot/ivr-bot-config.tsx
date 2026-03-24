import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { PageHeader } from "../../ui/page-header";
import { BotIdentityCard } from "./bot-identity-card";
import { BotBehaviorCard } from "./bot-behavior-card";
import { KnowledgeBaseCard } from "./knowledge-base-card";
import { FunctionsCard } from "./functions-card";
import { FrustrationHandoverCard } from "./frustration-handover-card";
import { AdvancedSettingsCard } from "./advanced-settings-card";
import { CreateFunctionModal } from "./create-function-modal";
import { FileUploadModal } from "../file-upload-modal";
import type {
  IvrBotConfigProps,
  IvrBotConfigData,
  CreateFunctionData,
} from "./types";
import { FallbackPromptsCard } from "./fallback-prompts-card";


// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA: IvrBotConfigData = {
  botName: "",
  primaryRole: "",
  tone: [],
  voice: "",
  language: "",
  systemPrompt: "",
  agentBusyPrompt: "",
  noExtensionPrompt: "",
  knowledgeBaseFiles: [],
  functions: [
    { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
    { id: "fn-2", name: "end_call()", isBuiltIn: true },
  ],
  frustrationHandoverEnabled: false,
  escalationDepartment: "",
  silenceTimeout: 15,
  callEndThreshold: 3,
  interruptionHandling: true,
};

// ─── Main IvrBotConfig ────────────────────────────────────────────────────────
export const IvrBotConfig = React.forwardRef(
  (
    {
      botTitle = "IVR bot",
      botType = "Voicebot",
      lastUpdatedAt,
      initialData,
      onSaveAsDraft,
      onPublish,
      onSaveKnowledgeFiles,
      onUploadKnowledgeFile,
      onSampleFileDownload,
      onDownloadKnowledgeFile,
      onDeleteKnowledgeFile,
      knowledgeDownloadDisabled,
      knowledgeDeleteDisabled,
      onCreateFunction,
      onEditFunction,
      onDeleteFunction,
      functionEditDisabled,
      functionDeleteDisabled,
      onTestApi,
      functionsInfoTooltip,
      knowledgeBaseInfoTooltip,
      functionPromptMinLength,
      functionPromptMaxLength,
      functionEditData,
      systemPromptMaxLength,
      onSystemPromptBlur,
      onAgentBusyPromptBlur,
      onNoExtensionFoundPromptBlur,
      onBack,
      onPlayVoice,
      onPauseVoice,
      playingVoice,
      disabled,
      roleOptions,
      toneOptions,
      voiceOptions,
      languageOptions,
      sessionVariables,
      escalationDepartmentOptions,
      silenceTimeoutMin,
      silenceTimeoutMax,
      callEndThresholdMin,
      callEndThresholdMax,
      className,
    }: IvrBotConfigProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [data, setData] = React.useState<IvrBotConfigData>({
      ...DEFAULT_DATA,
      ...initialData,
    });
    const [createFnOpen, setCreateFnOpen] = React.useState(false);
    const [editFnOpen, setEditFnOpen] = React.useState(false);
    const [uploadOpen, setUploadOpen] = React.useState(false);

    const update = (patch: Partial<IvrBotConfigData>) =>
      setData((prev) => ({ ...prev, ...patch }));

    const handleCreateFunction = (fnData: CreateFunctionData) => {
      const newFn = { id: `fn-${Date.now()}`, name: fnData.name };
      update({ functions: [...data.functions, newFn] });
      onCreateFunction?.(fnData);
    };

    const handleEditFunction = (id: string) => {
      onEditFunction?.(id);
      setEditFnOpen(true);
    };

    const handleEditFunctionSubmit = (fnData: CreateFunctionData) => {
      onCreateFunction?.(fnData);
      setEditFnOpen(false);
    };

    return (
      <div ref={ref} className={cn("flex flex-col min-h-screen bg-semantic-bg-primary", className)}>
        {/* Page header */}
        <PageHeader
          showBackButton
          onBackClick={onBack}
          title={botTitle}
          badge={
            <Badge variant="outline" className="text-xs font-normal">
              {botType}
            </Badge>
          }
          actions={
            <>
              {lastUpdatedAt && (
                <span className="hidden sm:inline text-sm text-semantic-text-muted mr-1">
                  Last updated at: {lastUpdatedAt}
                </span>
              )}
              <Button
                variant="outline"
                onClick={() => onSaveAsDraft?.(data)}
                disabled={disabled}
              >
                Save as Draft
              </Button>
              <Button
                variant="default"
                onClick={() => onPublish?.(data)}
                disabled={disabled}
              >
                Publish Bot
              </Button>
            </>
          }
        />

        {/* Body — two-column layout: left white, right gray panel */}
        <div className="flex flex-col lg:flex-row lg:flex-1 min-h-0">
          {/* Left column — white background */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[3] min-w-0 lg:max-w-[720px]">
            <BotIdentityCard
              data={data}
              onChange={update}
              onPlayVoice={onPlayVoice}
              onPauseVoice={onPauseVoice}
              playingVoice={playingVoice}
              roleOptions={roleOptions}
              toneOptions={toneOptions}
              voiceOptions={voiceOptions}
              languageOptions={languageOptions}
              disabled={disabled}
            />
            <BotBehaviorCard
              data={data}
              onChange={update}
              onSystemPromptBlur={onSystemPromptBlur}
              sessionVariables={sessionVariables}
              maxLength={systemPromptMaxLength}
              disabled={disabled}
            />
            <FallbackPromptsCard
              data={{
                agentBusyPrompt: data.agentBusyPrompt,
                noExtensionFoundPrompt: data.noExtensionPrompt,
              }}
              onChange={(patch) =>
                update({
                  ...(patch.agentBusyPrompt !== undefined && { agentBusyPrompt: patch.agentBusyPrompt }),
                  ...(patch.noExtensionFoundPrompt !== undefined && { noExtensionPrompt: patch.noExtensionFoundPrompt }),
                })
              }
              onAgentBusyPromptBlur={onAgentBusyPromptBlur}
              onNoExtensionFoundPromptBlur={onNoExtensionFoundPromptBlur}
              disabled={disabled}
            />
          </div>

          {/* Right column — gray panel extending full height */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[2] min-w-0 bg-semantic-bg-ui border-l border-solid border-semantic-border-layout">
            <KnowledgeBaseCard
              files={data.knowledgeBaseFiles}
              onAdd={() => setUploadOpen(true)}
              onDownload={onDownloadKnowledgeFile}
              onDelete={onDeleteKnowledgeFile ? (id) => {
                update({
                  knowledgeBaseFiles: data.knowledgeBaseFiles.filter(
                    (f) => f.id !== id
                  ),
                });
                onDeleteKnowledgeFile(id);
              } : undefined}
              infoTooltip={knowledgeBaseInfoTooltip}
              disabled={disabled}
              downloadDisabled={knowledgeDownloadDisabled}
              deleteDisabled={knowledgeDeleteDisabled}
            />
            <FunctionsCard
              functions={data.functions}
              onAddFunction={() => setCreateFnOpen(true)}
              onEditFunction={onEditFunction ? handleEditFunction : undefined}
              onDeleteFunction={onDeleteFunction ? (id) => {
                update({
                  functions: data.functions.filter((f) => f.id !== id),
                });
                onDeleteFunction(id);
              } : undefined}
              infoTooltip={functionsInfoTooltip}
              disabled={disabled}
              editDisabled={functionEditDisabled}
              deleteDisabled={functionDeleteDisabled}
            />
            <FrustrationHandoverCard
              data={data}
              onChange={update}
              departmentOptions={escalationDepartmentOptions}
              disabled={disabled}
            />
            <AdvancedSettingsCard
              data={data}
              onChange={update}
              silenceTimeoutMin={silenceTimeoutMin}
              silenceTimeoutMax={silenceTimeoutMax}
              callEndThresholdMin={callEndThresholdMin}
              callEndThresholdMax={callEndThresholdMax}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Create Function Modal */}
        <CreateFunctionModal
          open={createFnOpen}
          onOpenChange={setCreateFnOpen}
          onSubmit={handleCreateFunction}
          onTestApi={onTestApi}
          promptMinLength={functionPromptMinLength}
          promptMaxLength={functionPromptMaxLength}
          sessionVariables={sessionVariables}
        />

        {/* Edit Function Modal */}
        <CreateFunctionModal
          open={editFnOpen}
          onOpenChange={setEditFnOpen}
          onSubmit={handleEditFunctionSubmit}
          onTestApi={onTestApi}
          initialData={functionEditData}
          isEditing
          promptMinLength={functionPromptMinLength}
          promptMaxLength={functionPromptMaxLength}
          sessionVariables={sessionVariables}
          disabled={disabled}
        />

        {/* File Upload Modal */}
        <FileUploadModal
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onUpload={onUploadKnowledgeFile}
          onSampleDownload={onSampleFileDownload}
          onSave={onSaveKnowledgeFiles}
        />
      </div>
    );
  }
);

IvrBotConfig.displayName = "IvrBotConfig";
