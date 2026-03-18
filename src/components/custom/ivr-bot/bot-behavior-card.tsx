import * as React from "react";
import { Plus, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tagVariants } from "../../ui/tag";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotBehaviorData {
  systemPrompt: string;
}

export interface BotBehaviorCardProps {
  /** Current form data */
  data: Partial<BotBehaviorData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<BotBehaviorData>) => void;
  /** Called when the system prompt textarea loses focus */
  onSystemPromptBlur?: (value: string) => void;
  /** Session variables shown as insertable chips */
  sessionVariables?: string[];
  /** Maximum character length for the system prompt textarea (default: 5000, per Figma) */
  maxLength?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className for the card */
  className?: string;
}

// ─── Default session variables ──────────────────────────────────────────────

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

// ─── Internal helpers ───────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
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
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

function StyledTextarea({
  placeholder,
  value,
  rows = 3,
  onChange,
  onBlur,
  disabled,
  className,
}: {
  placeholder?: string;
  value?: string;
  rows?: number;
  onChange?: (v: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full px-4 py-2.5 text-base rounded border resize-none",
        "border-semantic-border-input bg-semantic-bg-primary",
        "text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none hover:border-semantic-border-input-focus",
        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const BotBehaviorCard = React.forwardRef<HTMLDivElement, BotBehaviorCardProps>(
  (
    {
      data,
      onChange,
      onSystemPromptBlur,
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      maxLength = 5000,
      disabled,
      className,
    },
    ref
  ) => {
    const prompt = data.systemPrompt ?? "";
    const MAX = maxLength;
    const footerRef = React.useRef<HTMLDivElement>(null);
    /** Set on footer mousedown so blur does not trigger API when user clicked under the input (instruction/chips). */
    const footerClickInProgressRef = React.useRef(false);

    const insertVariable = (variable: string) => {
      onChange({ systemPrompt: prompt + variable });
    };

    const handleSystemPromptBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!onSystemPromptBlur) return;
      const relatedTarget = e.relatedTarget as Node | null;
      const footerEl = footerRef.current;
      if (footerClickInProgressRef.current) {
        footerClickInProgressRef.current = false;
        return;
      }
      if (footerEl && relatedTarget && footerEl.contains(relatedTarget)) {
        return;
      }
      onSystemPromptBlur(e.target.value);
    };

    const handleFooterMouseDown = () => {
      footerClickInProgressRef.current = true;
    };

    return (
      <div ref={ref} className={className}>
        <SectionCard title="How It Behaves">
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm text-semantic-text-muted">
              Define workflows, conditions and handover logic (System prompt)
            </p>
            <div className="relative">
              <StyledTextarea
                value={prompt}
                rows={6}
                onChange={(v) => {
                  if (v.length <= MAX) onChange({ systemPrompt: v });
                }}
                onBlur={handleSystemPromptBlur}
                placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
                disabled={disabled}
                className="pb-10 pr-[4.5rem]"
              />
              <span
                className="absolute bottom-3 right-4 text-sm text-semantic-text-muted pointer-events-none"
                aria-live="polite"
                aria-label={`${prompt.length} of ${MAX} characters`}
              >
                {prompt.length}/{MAX}
              </span>
            </div>
            <div
              ref={footerRef}
              className="flex flex-col gap-3"
              onMouseDown={handleFooterMouseDown}
            >
              <p className="m-0 flex items-center gap-1.5 text-sm text-semantic-text-muted">
                <Info className="size-4 shrink-0 text-semantic-text-muted" aria-hidden />
                Type {'{{'} to enable dropdown or use the below chips to input variables.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-semantic-text-secondary">
                  Session variables:
                </span>
                {sessionVariables.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    disabled={disabled}
                    className={cn(tagVariants(), "gap-1.5 cursor-pointer hover:opacity-80 transition-opacity", disabled && "opacity-50 cursor-not-allowed")}
                  >
                    <Plus className="size-3 shrink-0" />
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }
);
BotBehaviorCard.displayName = "BotBehaviorCard";

export { BotBehaviorCard };
