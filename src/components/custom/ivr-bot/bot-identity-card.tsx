import * as React from "react";
import { Info, PlayCircle, PauseCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { CreatableSelect } from "../../ui/creatable-select";
import { CreatableMultiSelect } from "../../ui/creatable-multi-select";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VoiceOption {
  value: string;
  label: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface ToneOption {
  value: string;
  label: string;
}

export interface BotIdentityData {
  botName: string;
  primaryRole: string;
  tone: string[];
  voice: string;
  language: string;
}

export interface BotIdentityCardProps {
  /** Current form data */
  data: Partial<BotIdentityData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<BotIdentityData>) => void;
  /** Available role options for the creatable select */
  roleOptions?: RoleOption[];
  /** Available tone preset options */
  toneOptions?: ToneOption[];
  /** Available voice options */
  voiceOptions?: VoiceOption[];
  /** Available language options */
  languageOptions?: LanguageOption[];
  /** Called when the play icon is clicked on a voice option. Receives the voice value. */
  onPlayVoice?: (voiceValue: string) => void;
  /** Called when the pause icon is clicked on a playing voice. */
  onPauseVoice?: (voiceValue: string) => void;
  /** The voice value currently being played. Controls play/pause icon state. */
  playingVoice?: string;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className for the card */
  className?: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function Field({
  label,
  required,
  helperText,
  characterCount,
  children,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  /** e.g. { current: 0, max: 50 } to show "0/50" below right */
  characterCount?: { current: number; max: number };
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
      {(helperText || characterCount) && (
        <div className="flex items-center justify-between gap-2">
          {helperText ? (
            <div className="flex items-center gap-1.5 text-xs text-semantic-text-muted min-w-0">
              <Info className="size-3.5 shrink-0" />
              <p className="m-0">{helperText}</p>
            </div>
          ) : (
            <span />
          )}
          {characterCount != null && (
            <span className="text-sm text-semantic-text-muted shrink-0">
              {characterCount.current}/{characterCount.max}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const BOT_NAME_MAX_LENGTH = 50;
const PRIMARY_ROLE_MAX_LENGTH = 50;
const TONE_MAX_ITEMS = 5;
const TONE_MAX_LENGTH_PER_ITEM = 20;

function StyledInput({
  placeholder,
  value,
  onChange,
  disabled,
  maxLength,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange?.(maxLength != null ? v.slice(0, maxLength) : v);
      }}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={cn(
        "w-full h-[42px] px-4 text-base rounded border border-solid",
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

// ─── Default options ─────────────────────────────────────────────────────────

const DEFAULT_ROLE_OPTIONS: RoleOption[] = [
  { value: "customer-support", label: "Customer Support Agent" },
  { value: "sales", label: "Sales Representative" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing Enquiry Agent" },
  { value: "receptionist", label: "Receptionist" },
  { value: "lead-qualification", label: "Lead Qualification Agent" },
  { value: "appointment", label: "Appointment Scheduler Agent" },
  { value: "feedback", label: "Feedback Gatherer Agent" },
  { value: "info", label: "Information Gatherer Agent" },
];

const DEFAULT_TONE_OPTIONS: ToneOption[] = [
  { value: "Professional and highly concise", label: "Professional and highly concise" },
  { value: "Friendly and conversational", label: "Friendly and conversational" },
  { value: "Calm and reassuring", label: "Calm and reassuring" },
  { value: "Polite and formal", label: "Polite and formal" },
  { value: "Cheerful and engaging", label: "Cheerful and engaging" },
  { value: "Neutral and informative", label: "Neutral and informative" },
  { value: "Respectful and minimal", label: "Respectful and minimal" },
  { value: "Crisp and transactional", label: "Crisp and transactional" },
  { value: "Energetic and upbeat", label: "Energetic and upbeat" },
  { value: "Soft-spoken and comforting", label: "Soft-spoken and comforting" },
  { value: "Direct and efficient", label: "Direct and efficient" },
];

const DEFAULT_VOICE_OPTIONS: VoiceOption[] = [
  { value: "rhea-female", label: "Rhea - Female" },
  { value: "arjun-male", label: "Arjun - Male" },
  { value: "priya-female", label: "Priya - Female" },
  { value: "vikram-male", label: "Vikram - Male" },
  { value: "ananya-female", label: "Ananya - Female" },
];

const DEFAULT_LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en-in", label: "English (India)" },
  { value: "en-us", label: "English (US)" },
  { value: "hi-in", label: "Hindi" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const BotIdentityCard = React.forwardRef(
  (
    {
      data,
      onChange,
      roleOptions = DEFAULT_ROLE_OPTIONS,
      toneOptions = DEFAULT_TONE_OPTIONS,
      voiceOptions = DEFAULT_VOICE_OPTIONS,
      languageOptions = DEFAULT_LANGUAGE_OPTIONS,
      onPlayVoice,
      onPauseVoice,
      playingVoice,
      disabled,
      className,
    }: BotIdentityCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            Who The Bot Is
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-5">
            <Field
              label="Bot Name & Identity"
              helperText="This is the name the bot will use to refer to itself during conversations."
              characterCount={{
                current: (data.botName ?? "").length,
                max: BOT_NAME_MAX_LENGTH,
              }}
            >
              <StyledInput
                placeholder="e.g., Rhea from CaratLane"
                value={data.botName}
                onChange={(v) => onChange({ botName: v })}
                disabled={disabled}
                maxLength={BOT_NAME_MAX_LENGTH}
              />
            </Field>

            <Field
              label="Primary Role"
              helperText="Defines what the bot does. Choose from the list or type a custom role."
              characterCount={{
                current: (data.primaryRole ?? "").length,
                max: PRIMARY_ROLE_MAX_LENGTH,
              }}
            >
              <CreatableSelect
                value={(data.primaryRole ?? "").slice(0, PRIMARY_ROLE_MAX_LENGTH)}
                onValueChange={(v) =>
                  onChange({ primaryRole: (v ?? "").slice(0, PRIMARY_ROLE_MAX_LENGTH) })
                }
                options={roleOptions}
                placeholder="e.g., Customer Support Agent"
                creatableHint="Type to create a custom role"
                disabled={disabled}
                maxLength={PRIMARY_ROLE_MAX_LENGTH}
              />
            </Field>

            <Field label="Tone">
              <CreatableMultiSelect
                value={(Array.isArray(data.tone) ? data.tone : []).slice(0, TONE_MAX_ITEMS)}
                onValueChange={(v) =>
                  onChange({ tone: (v ?? []).slice(0, TONE_MAX_ITEMS) })
                }
                options={toneOptions}
                placeholder="Enter or select tone"
                creatableHint='Press Enter to add "Conversational" ↵'
                disabled={disabled}
                maxItems={TONE_MAX_ITEMS}
                maxLengthPerItem={TONE_MAX_LENGTH_PER_ITEM}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="How It Sounds">
                <Select
                  value={data.voice || undefined}
                  onValueChange={(v) => {
                    onChange({ voice: v });
                    onPauseVoice?.(v);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice">
                      {data.voice && (
                        <span className="inline-flex items-center gap-2">
                          <PlayCircle className="size-5 shrink-0 text-semantic-text-muted" />
                          {voiceOptions.find((o) => o.value === data.voice)?.label ?? data.voice}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={
                              playingVoice === opt.value
                                ? `Pause ${opt.label}`
                                : `Play ${opt.label}`
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (playingVoice === opt.value) {
                                onPauseVoice?.(opt.value);
                              } else {
                                onPlayVoice?.(opt.value);
                              }
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center rounded-full hover:bg-semantic-bg-hover transition-colors"
                          >
                            {playingVoice === opt.value ? (
                              <PauseCircle className="size-5 shrink-0 text-semantic-primary" />
                            ) : (
                              <PlayCircle className="size-5 shrink-0 text-semantic-text-muted" />
                            )}
                          </button>
                          <span className="h-4 w-px bg-semantic-border-layout shrink-0" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="What Language It Speaks">
                <Select
                  value={data.language || undefined}
                  onValueChange={(v) => onChange({ language: v })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
BotIdentityCard.displayName = "BotIdentityCard";

export { BotIdentityCard };
