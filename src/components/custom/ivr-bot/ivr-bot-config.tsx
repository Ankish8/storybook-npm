import * as React from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Download,
  Trash2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { tagVariants } from "../../ui/tag";
import { Switch } from "../../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { CreateFunctionModal } from "./create-function-modal";
import type {
  IvrBotConfigProps,
  IvrBotConfigData,
  FunctionItem,
  KnowledgeBaseFile,
  CreateFunctionData,
} from "./types";

// ─── Section Card wrapper ────────────────────────────────────────────────────
function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
        <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
          {title}
        </h2>
        {action}
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  helperText,
  children,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
        {required && (
          <span className="text-semantic-error-primary ml-0.5">*</span>
        )}
      </label>
      {children}
      {helperText && (
        <div className="flex items-center gap-1.5 text-xs text-semantic-text-muted">
          <Info className="size-3.5 shrink-0" />
          <p className="m-0">{helperText}</p>
        </div>
      )}
    </div>
  );
}

// ─── Styled Input ─────────────────────────────────────────────────────────────
function StyledInput({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-10 px-4 text-sm rounded border",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        className
      )}
    />
  );
}

// ─── Styled Textarea ──────────────────────────────────────────────────────────
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
        "w-full px-4 py-2.5 text-sm rounded border resize-none",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        className
      )}
    />
  );
}

// ─── Primary Role options ─────────────────────────────────────────────────────
const PRIMARY_ROLE_OPTIONS = [
  { value: "customer-support", label: "Customer Support Agent" },
  { value: "sales", label: "Sales Representative" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing-support", label: "Billing Support" },
  { value: "appointment-scheduling", label: "Appointment Scheduling" },
  { value: "order-status", label: "Order Status & Tracking" },
  { value: "lead-qualification", label: "Lead Qualification" },
  { value: "general-inquiries", label: "General Inquiries" },
];

// ─── Tone Input ───────────────────────────────────────────────────────────────
const PRESET_TONES = [
  "Professional and highly concise",
  "Friendly and conversational",
  "Calm and reassuring",
  "Polite and formal",
  "Cheerful and engaging",
  "Neutral and informative",
  "Respectful and minimal",
  "Crisp and transactional",
  "Energetic and upbeat",
  "Soft-spoken and comforting",
  "Direct and efficient",
];

function ToneInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addTone = (tone: string) => {
    const trimmed = tone.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTone = (tone: string) => {
    onChange(value.filter((t) => t !== tone));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) addTone(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTone(value[value.length - 1]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue("");
    }
  };

  const availablePresets = PRESET_TONES.filter((t) => !value.includes(t));
  const canAddCustom =
    Boolean(inputValue.trim()) && !value.includes(inputValue.trim());

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        className={cn(
          "flex items-center gap-2 flex-wrap min-h-10 px-4 py-2 rounded border bg-semantic-bg-primary cursor-text transition-shadow",
          isOpen
            ? "border-semantic-border-focus shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
            : "border-semantic-border-input hover:border-semantic-border-input-focus"
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* Selected chips */}
        {value.map((tone) => (
          <span
            key={tone}
            className="inline-flex items-center gap-2 bg-semantic-info-surface px-2 py-1 rounded text-sm text-semantic-text-primary whitespace-nowrap"
          >
            {tone}
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeTone(tone);
              }}
              className="shrink-0 flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
              aria-label={`Remove ${tone}`}
            >
              <X className="size-2.5" />
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Enter or select tone" : ""}
          className="flex-1 min-w-[100px] text-sm bg-transparent outline-none text-semantic-text-primary placeholder:text-semantic-text-muted"
        />

        {/* Chevron — right when open, down when closed */}
        {isOpen ? (
          <ChevronRight className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
        ) : (
          <ChevronDown className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-semantic-bg-primary border border-semantic-border-layout rounded shadow-sm">
          {/* Preset option chips */}
          <div className="px-2.5 py-1.5 flex flex-wrap gap-1.5">
            {availablePresets.length > 0 ? (
              availablePresets.map((option) => (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTone(option);
                  }}
                  className="inline-flex items-center gap-2 bg-semantic-bg-ui px-2 py-1 rounded text-sm text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors whitespace-nowrap"
                >
                  <Plus className="size-2.5 shrink-0 text-semantic-text-muted" />
                  {option}
                </button>
              ))
            ) : (
              <p className="m-0 text-sm text-semantic-text-muted px-1 py-0.5">
                All preset tones selected
              </p>
            )}
          </div>

          {/* "Press enter to add" hint when typing a custom value */}
          {canAddCustom && (
            <div className="border-t border-semantic-border-layout px-4 py-3 text-center">
              <span className="text-sm font-semibold text-semantic-text-primary">
                Press enter to add &ldquo;{inputValue}&rdquo; ↵
              </span>
            </div>
          )}
        </div>
      )}

      {/* Helper text shown below when dropdown is closed */}
      {!isOpen && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <Info className="size-[18px] shrink-0 text-semantic-text-muted" />
          <p className="m-0 text-sm text-semantic-text-muted">
            Press Enter to add &ldquo;Conversational&rdquo; ↵
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Who The Bot Is ───────────────────────────────────────────────────────────
function WhoTheBotIs({
  data,
  onChange,
}: {
  data: Partial<IvrBotConfigData>;
  onChange: (patch: Partial<IvrBotConfigData>) => void;
}) {
  return (
    <SectionCard title="Who The Bot Is">
      <div className="flex flex-col gap-5">
        <Field
          label="Bot Name & Identity"
          helperText="This is the name the bot will use to refer to itself during conversations."
        >
          <StyledInput
            placeholder="e.g., Rhea from CaratLane"
            value={data.botName}
            onChange={(v) => onChange({ botName: v })}
          />
        </Field>

        <Field label="Primary Role">
          <Select
            value={data.primaryRole || undefined}
            onValueChange={(v) => onChange({ primaryRole: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., Customer Support Agent" />
            </SelectTrigger>
            <SelectContent>
              {PRIMARY_ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Tone">
          <ToneInput
            value={Array.isArray(data.tone) ? data.tone : []}
            onChange={(v) => onChange({ tone: v })}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="How It Sounds">
            <Select
              value={data.voice || undefined}
              onValueChange={(v) => onChange({ voice: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rhea - Female" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rhea-female">Rhea - Female</SelectItem>
                <SelectItem value="james-male">James - Male</SelectItem>
                <SelectItem value="aria-female">Aria - Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="What Language It Speaks">
            <Select
              value={data.language || undefined}
              onValueChange={(v) => onChange({ language: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-in">English (India)</SelectItem>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="hi-in">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── How It Behaves ───────────────────────────────────────────────────────────
const SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

function HowItBehaves({
  data,
  onChange,
}: {
  data: Partial<IvrBotConfigData>;
  onChange: (patch: Partial<IvrBotConfigData>) => void;
}) {
  const prompt = data.systemPrompt ?? "";
  const MAX = 25000;

  const insertVariable = (variable: string) => {
    onChange({ systemPrompt: prompt + variable });
  };

  return (
    <SectionCard title="How It Behaves">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-xs text-semantic-text-muted">
          Define workflows, conditions and handover logic (System prompt)
        </p>
        <div className="relative">
          <StyledTextarea
            value={prompt}
            rows={6}
            onChange={(v) => {
              if (v.length <= MAX) onChange({ systemPrompt: v });
            }}
            placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
            className="pb-8"
          />
          <span className="absolute bottom-2.5 right-3 text-xs text-semantic-text-muted">
            {prompt.length}/{MAX}
          </span>
        </div>
        <p className="m-0 text-xs text-semantic-text-muted">
          Type [[ to enable dropdown or use the below chips to input variables.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-semantic-text-secondary">
            Session variables:
          </span>
          {SESSION_VARIABLES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => insertVariable(v)}
              className={cn(tagVariants(), "gap-1.5 cursor-pointer hover:opacity-80 transition-opacity")}
            >
              <Plus className="size-3 shrink-0" />
              {v}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
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

// ─── File Upload Modal ────────────────────────────────────────────────────────
type UploadStatus = "uploading" | "error" | "done";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
}

function FileUploadModal({
  open,
  onOpenChange,
  onSampleDownload,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSampleDownload?: () => void;
  onSave?: (files: File[]) => void;
}) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const intervalsRef = React.useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const startProgress = React.useCallback((id: string) => {
    const interval = setInterval(() => {
      setItems((prev) => {
        let done = false;
        const updated = prev.map((item) => {
          if (item.id !== id || item.status !== "uploading") return item;
          const next = Math.min(item.progress + 15, 100);
          if (next === 100) done = true;
          return { ...item, progress: next, status: (next === 100 ? "done" : "uploading") as UploadStatus };
        });
        if (done) {
          clearInterval(interval);
          delete intervalsRef.current[id];
        }
        return updated;
      });
    }, 500);
    intervalsRef.current[id] = interval;
  }, []);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [
        ...prev,
        { id, file, progress: 0, status: "uploading" },
      ]);
      startProgress(id);
    });
  };

  const removeItem = (id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClose = () => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
    setItems([]);
    onOpenChange(false);
  };

  const handleSave = () => {
    onSave?.(items.filter((i) => i.status === "done").map((i) => i.file));
    handleClose();
  };

  const getTimeRemaining = (progress: number) => {
    const steps = Math.ceil((100 - progress) / 15);
    const secs = steps * 3;
    return secs > 60
      ? `${Math.ceil(secs / 60)} minutes remaining`
      : `${secs} seconds remaining`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="default"
        hideCloseButton
        className="mx-4 max-w-[660px] rounded-xl p-4 gap-0 sm:mx-auto sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary">
            File Upload
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-semantic-text-primary disabled:pointer-events-none"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 items-end w-full">
          {/* Download sample file */}
          <button
            type="button"
            onClick={onSampleDownload}
            className="flex items-center gap-1.5 text-sm font-semibold text-semantic-text-link hover:opacity-80 transition-opacity"
          >
            <Download className="size-3.5" />
            Download sample file
          </button>

          {/* Drop zone */}
          <div
            className="w-full border border-dashed border-semantic-border-layout bg-semantic-bg-ui rounded p-4"
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 px-4 rounded border border-semantic-border-layout bg-semantic-bg-primary text-sm font-semibold text-semantic-text-secondary shrink-0 hover:bg-semantic-bg-hover transition-colors w-full sm:w-auto"
              >
                Upload from device
              </button>
              <div className="flex flex-col gap-1">
                <p className="m-0 text-sm text-semantic-text-secondary tracking-[0.035px]">
                  or drag and drop file here
                </p>
                <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                  Max file size 100 MB (Supported Format: .docs, .pdf, .csv,
                  .xls, .xlxs, .txt)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".doc,.docx,.pdf,.csv,.xls,.xlsx,.txt"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Upload item list */}
          {items.length > 0 && (
            <div className="flex flex-col gap-2.5 w-full">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-semantic-bg-primary border border-semantic-border-layout rounded px-4 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="m-0 text-sm text-semantic-text-primary tracking-[0.035px] truncate">
                        {item.status === "uploading"
                          ? "Uploading..."
                          : item.file.name}
                      </p>
                      {item.status === "uploading" && (
                        <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                          {item.progress}%&nbsp;&bull;&nbsp;
                          {getTimeRemaining(item.progress)}
                        </p>
                      )}
                      {item.status === "error" && (
                        <p className="m-0 text-xs text-semantic-error-primary tracking-[0.048px]">
                          {item.errorMessage ??
                            "Something went wrong, Upload Failed."}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={
                        item.status === "uploading"
                          ? "Cancel upload"
                          : "Remove file"
                      }
                      className={cn(
                        "shrink-0 mt-0.5 transition-colors",
                        item.status === "uploading"
                          ? "text-semantic-error-primary"
                          : "text-semantic-text-muted hover:text-semantic-error-primary"
                      )}
                    >
                      {item.status === "uploading" ? (
                        <XCircle className="size-5" />
                      ) : (
                        <Trash2 className="size-5" />
                      )}
                    </button>
                  </div>
                  {item.status === "uploading" && (
                    <div className="h-2 bg-semantic-bg-ui rounded-full overflow-hidden">
                      <div
                        className="h-full bg-semantic-success-primary rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 mt-4 sm:mt-6 sm:flex-row sm:justify-end sm:gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
type BadgeVariant = "active" | "destructive";
const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> =
  {
    training: { label: "Training", variant: "active" },
    trained: { label: "Trained", variant: "active" },
    error: { label: "Error", variant: "destructive" },
  };

function KnowledgeBase({
  files,
  onSaveFiles,
  onSampleDownload,
  onDownload,
  onDelete,
}: {
  files: KnowledgeBaseFile[];
  onSaveFiles?: (uploadedFiles: File[]) => void;
  onSampleDownload?: () => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [uploadOpen, setUploadOpen] = React.useState(false);

  return (
    <>
    <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
        <div className="flex items-center gap-1.5">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            Knowledge Base
          </h2>
          <Info className="size-3.5 text-semantic-text-muted shrink-0" />
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors"
        >
          <Plus className="size-3.5" />
          Files
        </button>
      </div>
      {/* File list */}
      <div className="px-4 sm:px-6">
        {files.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-5">
            No files added yet. Click &ldquo;+ Files&rdquo; to upload.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-semantic-border-layout">
            {files.map((file) => {
              const status = STATUS_CONFIG[file.status] ?? STATUS_CONFIG.training;
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-semantic-text-primary truncate">
                      File {file.name}
                    </span>
                    <Badge
                      variant={status.variant}
                      size="sm"
                      className="px-3 font-normal shrink-0 whitespace-nowrap"
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => onDownload?.(file.id)}
                      className="p-2 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                      aria-label="Download file"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(file.id)}
                      className="p-2 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors"
                      aria-label="Delete file"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    <FileUploadModal
      open={uploadOpen}
      onOpenChange={setUploadOpen}
      onSampleDownload={onSampleDownload}
      onSave={onSaveFiles}
    />
    </>
  );
}

// ─── Functions ────────────────────────────────────────────────────────────────
function FunctionsSection({
  functions,
  onAddFunction,
}: {
  functions: FunctionItem[];
  onAddFunction?: () => void;
}) {
  return (
    <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
        <div className="flex items-center gap-1.5">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            Functions
          </h2>
          <Info className="size-3.5 text-semantic-text-muted shrink-0" />
        </div>
        <button
          type="button"
          onClick={onAddFunction}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors"
        >
          <Plus className="size-3.5" />
          Functions
        </button>
      </div>
      {/* Function list */}
      <div className="px-4 py-4 sm:px-6">
        {functions.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-2">
            No functions added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {functions.map((fn) => (
              <div
                key={fn.id}
                className="flex items-center justify-between px-4 py-3 rounded border border-semantic-border-layout bg-semantic-bg-primary"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Info className="size-4 text-semantic-text-muted shrink-0" />
                  <span className="text-sm text-semantic-text-primary truncate">
                    {fn.name}
                  </span>
                </div>
                {fn.isBuiltIn && (
                  <Badge size="sm" className="font-normal shrink-0 ml-3">
                    Built-in
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Frustration Handover (accordion) ────────────────────────────────────────
function FrustrationHandoverAccordion({
  data,
  onChange,
}: {
  data: Partial<IvrBotConfigData>;
  onChange: (patch: Partial<IvrBotConfigData>) => void;
}) {
  return (
    <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden">
      <Accordion type="single">
        <AccordionItem value="frustration">
          <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
            <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
              Frustration Handover
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-6 pt-0 pb-2">
              <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
                <span className="text-sm text-semantic-text-primary">
                  Enable frustration-based escalation
                </span>
                <Switch
                  checked={data.frustrationHandoverEnabled ?? false}
                  onCheckedChange={(v) =>
                    onChange({ frustrationHandoverEnabled: v })
                  }
                />
              </div>
              <div className="px-4 pb-2 sm:px-6">
                <Field label="Escalation Department">
                  <Select
                    value={data.escalationDepartment || undefined}
                    onValueChange={(v) => onChange({ escalationDepartment: v })}
                    disabled={!data.frustrationHandoverEnabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// ─── Advanced Settings (accordion) ───────────────────────────────────────────
function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = 999,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex w-full items-center gap-2.5 px-4 py-2.5 border border-semantic-border-layout bg-semantic-bg-primary rounded">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 text-sm text-semantic-text-primary bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="flex flex-col items-center shrink-0 gap-0.5">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
          aria-label="Increase"
        >
          <ChevronUp className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
          aria-label="Decrease"
        >
          <ChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
}

function AdvancedSettingsAccordion({
  data,
  onChange,
}: {
  data: Partial<IvrBotConfigData>;
  onChange: (patch: Partial<IvrBotConfigData>) => void;
}) {
  return (
    <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden">
      <Accordion type="single">
        <AccordionItem value="advanced">
          <AccordionTrigger className="px-4 py-4 border-b border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
            <span className="text-base font-semibold text-semantic-text-primary">
              Advanced Settings
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              {/* Number fields section */}
              <div className="px-4 pt-4 pb-4 flex flex-col gap-5 border-b border-semantic-border-layout sm:px-6 sm:pt-5 sm:pb-6">
                <Field label="Silence Timeout (seconds)">
                  <NumberSpinner
                    value={data.silenceTimeout ?? 15}
                    onChange={(v) => onChange({ silenceTimeout: v })}
                    min={1}
                    max={60}
                  />
                  <p className="m-0 text-xs text-semantic-text-muted">
                    Default: 15 seconds
                  </p>
                </Field>

                <Field label="Call End Threshold">
                  <NumberSpinner
                    value={data.callEndThreshold ?? 3}
                    onChange={(v) => onChange({ callEndThreshold: v })}
                    min={1}
                    max={10}
                  />
                  <p className="m-0 text-xs text-semantic-text-muted">
                    Drop call after n consecutive silences. Default: 3
                  </p>
                </Field>
              </div>

              {/* Interruption Handling — separated by divider */}
              <div className="px-4 py-4 flex items-center gap-3 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-semantic-text-primary">
                    Interruption Handling
                  </span>
                  <p className="m-0 text-xs text-semantic-text-muted">
                    Allow user to interrupt the bot mid-sentence
                  </p>
                </div>
                <Switch
                  checked={data.interruptionHandling ?? true}
                  onCheckedChange={(v) =>
                    onChange({ interruptionHandling: v })
                  }
                />
              </div>
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
      onSampleFileDownload,
      onDownloadKnowledgeFile,
      onDeleteKnowledgeFile,
      onCreateFunction,
      onTestApi,
      onBack,
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
      <div ref={ref} className={cn("flex flex-col min-h-screen bg-semantic-bg-ui", className)}>
        {/* Page header */}
        <header className="flex flex-col gap-3 px-4 py-4 bg-semantic-bg-primary border-b border-semantic-border-layout shrink-0 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 sm:h-[76px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h1 className="m-0 text-base font-semibold text-semantic-text-primary truncate">
              {botTitle}
            </h1>
            <Badge variant="outline" className="text-xs font-normal shrink-0">
              {botType}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdatedAt && (
              <span className="hidden sm:inline text-sm text-semantic-text-muted">
                Last updated at: {lastUpdatedAt}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => onSaveAsDraft?.(data)}
            >
              Save as Draft
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => onPublish?.(data)}
            >
              Publish Bot
            </Button>
          </div>
        </header>

        {/* Body — responsive layout: stacked on mobile, two-column on lg+ */}
        <div className="flex flex-col gap-6 px-4 py-4 max-w-[1220px] mx-auto w-full sm:px-6 sm:py-6 lg:flex-row lg:flex-1">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:flex-[3] min-w-0">
            <WhoTheBotIs data={data} onChange={update} />
            <HowItBehaves data={data} onChange={update} />
            <FallbackPromptsAccordion data={data} onChange={update} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 lg:flex-[2] min-w-0">
            <KnowledgeBase
              files={data.knowledgeBaseFiles}
              onSaveFiles={onSaveKnowledgeFiles}
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
            <FunctionsSection
              functions={data.functions}
              onAddFunction={() => setCreateFnOpen(true)}
            />
            <FrustrationHandoverAccordion data={data} onChange={update} />
            <AdvancedSettingsAccordion data={data} onChange={update} />
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
