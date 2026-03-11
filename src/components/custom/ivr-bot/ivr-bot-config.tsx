import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { PageHeader } from "../../ui/page-header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { BotIdentityCard } from "./bot-identity-card";
import { BotBehaviorCard } from "./bot-behavior-card";
import { KnowledgeBaseCard } from "./knowledge-base-card";
import { FunctionsCard } from "./functions-card";
import { FrustrationHandoverCard } from "./frustration-handover-card";
import { AdvancedSettingsCard } from "./advanced-settings-card";
import { CreateFunctionModal } from "./create-function-modal";
import type {
  IvrBotConfigProps,
  IvrBotConfigData,
  CreateFunctionData,
} from "./types";

// ─── Styled Textarea (still used by FallbackPromptsAccordion) ───────────────
function StyledTextarea({
  placeholder,
  value,
  rows = 3,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  rows?: number;
  onChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full px-4 py-2.5 text-base rounded border resize-none",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        className
      )}
    />
  );
}

// ─── Field wrapper (still used by FallbackPromptsAccordion) ─────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Fallback Prompts (accordion) ────────────────────────────────────────────
function FallbackPromptsAccordion({
  data,
  onChange,
}: {
  data: Partial<IvrBotConfigData>;
  onChange: (patch: Partial<IvrBotConfigData>) => void;
}) {
  return (
    <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden">
      <Accordion type="single">
        <AccordionItem value="fallback">
          <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
            <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
              Fallback Prompts
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 pt-4 pb-2 flex flex-col gap-6 sm:px-6 sm:pt-6">
              <Field label="Agent Busy Prompt">
                <StyledTextarea
                  value={data.agentBusyPrompt ?? ""}
                  onChange={(v) => onChange({ agentBusyPrompt: v })}
                  placeholder="Executives are busy at the moment, we will connect you soon."
                />
              </Field>
              <Field label="No Extension Found">
                <StyledTextarea
                  value={data.noExtensionPrompt ?? ""}
                  onChange={(v) => onChange({ noExtensionPrompt: v })}
                  placeholder="Sorry, the requested extension is currently unavailable. Let me help you directly."
                />
              </Field>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

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
export const IvrBotConfig = React.forwardRef<HTMLDivElement, IvrBotConfigProps>(
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
      onCreateFunction,
      onDeleteFunction,
      onTestApi,
      onBack,
      onPlayVoice,
      onPauseVoice,
      playingVoice,
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
    },
    ref
  ) => {
    const [data, setData] = React.useState<IvrBotConfigData>({
      ...DEFAULT_DATA,
      ...initialData,
    });
    const [createFnOpen, setCreateFnOpen] = React.useState(false);

    const update = (patch: Partial<IvrBotConfigData>) =>
      setData((prev) => ({ ...prev, ...patch }));

    const handleCreateFunction = (fnData: CreateFunctionData) => {
      const newFn = { id: `fn-${Date.now()}`, name: fnData.name };
      update({ functions: [...data.functions, newFn] });
      onCreateFunction?.(fnData);
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
              >
                Save as Draft
              </Button>
              <Button
                variant="default"
                onClick={() => onPublish?.(data)}
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
            />
            <BotBehaviorCard
              data={data}
              onChange={update}
              sessionVariables={sessionVariables}
            />
            <FallbackPromptsAccordion data={data} onChange={update} />
          </div>

          {/* Right column — gray panel extending full height */}
          <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-[2] min-w-0 bg-semantic-bg-ui border-l border-semantic-border-layout">
            <KnowledgeBaseCard
              files={data.knowledgeBaseFiles}
              onSaveFiles={onSaveKnowledgeFiles}
              onUploadFile={onUploadKnowledgeFile}
              onSampleDownload={onSampleFileDownload}
              onDownload={onDownloadKnowledgeFile}
              onDelete={(id) => {
                update({
                  knowledgeBaseFiles: data.knowledgeBaseFiles.filter(
                    (f) => f.id !== id
                  ),
                });
                onDeleteKnowledgeFile?.(id);
              }}
            />
            <FunctionsCard
              functions={data.functions}
              onAddFunction={() => setCreateFnOpen(true)}
              onDeleteFunction={(id) => {
                update({
                  functions: data.functions.filter((f) => f.id !== id),
                });
                onDeleteFunction?.(id);
              }}
            />
            <FrustrationHandoverCard
              data={data}
              onChange={update}
              departmentOptions={escalationDepartmentOptions}
            />
            <AdvancedSettingsCard
              data={data}
              onChange={update}
              silenceTimeoutMin={silenceTimeoutMin}
              silenceTimeoutMax={silenceTimeoutMax}
              callEndThresholdMin={callEndThresholdMin}
              callEndThresholdMax={callEndThresholdMax}
            />
          </div>
        </div>

        {/* Create Function Modal */}
        <CreateFunctionModal
          open={createFnOpen}
          onOpenChange={setCreateFnOpen}
          onSubmit={handleCreateFunction}
          onTestApi={onTestApi}
        />
      </div>
    );
  }
);

IvrBotConfig.displayName = "IvrBotConfig";
