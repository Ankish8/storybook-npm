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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { formFieldLabelClassName } from "./form-field-label";
import {
  BOT_IDENTITY_INVALID_CHARS_MESSAGE,
  botIdentityEffectiveValueLength,
  filterBotIdentityText,
  finalizeBotIdentityFieldValue,
  hadInvalidBotIdentityChars,
  normalizeFilteredBotIdentityTyping,
  sanitizeBotIdentityFieldTyping,
} from "./bot-identity-text";

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

/** Default hover text for the info icon next to "Bot Name & Identity" */
export const defaultBotNameIdentityTooltip =
  "The name the bot uses to introduce itself during calls. This is different from the bot's system name set at creation.";

/** Default hover text for the info icon next to "Primary Role" */
export const defaultPrimaryRoleTooltip =
  "Defines what the bot does. Choose from the list or type a custom role. Only one role can be active at a time.";

/** Default hover text for the info icon next to "Tone" */
export const defaultToneTooltip =
  "Sets how the bot communicates. You can pick up to 5 tones from the list or add your own.";

/** Default hover text for the info icon next to "How It Sounds" */
export const defaultHowItSoundsTooltip =
  "Select the voice profile the bot speaks in.";

/** Default hover text for the info icon next to "What Language It Speaks" */
export const defaultLanguageModeTooltip =
  "Sets the language mode for the bot's conversations.";

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
  /** Hover text on the info icon next to "Bot Name & Identity" (default: {@link defaultBotNameIdentityTooltip}) */
  botNameIdentityTooltip?: string;
  /** Hover text on the info icon next to "Primary Role" (default: {@link defaultPrimaryRoleTooltip}) */
  primaryRoleTooltip?: string;
  /** Hover text on the info icon next to "Tone" (default: {@link defaultToneTooltip}) */
  toneTooltip?: string;
  /** Hover text on the info icon next to "How It Sounds" (default: {@link defaultHowItSoundsTooltip}) */
  howItSoundsTooltip?: string;
  /** Hover text on the info icon next to "What Language It Speaks" (default: {@link defaultLanguageModeTooltip}) */
  languageModeTooltip?: string;
  /** Additional className for the card */
  className?: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function Field({
  label,
  required,
  helperText,
  errorText,
  characterCount,
  labelTooltip,
  children,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  /** Validation error; takes precedence over helperText in the helper row. */
  errorText?: string;
  /** e.g. { current: 0, max: 50 } to show "0/50" below right */
  characterCount?: { current: number; max: number };
  /** Info icon beside label; hover shows tooltip (same pattern as Functions card). */
  labelTooltip?: string;
  children: React.ReactNode;
}) {
  const labelBody = (
    <>
      {label}
      {required && (
        <span className="text-semantic-error-primary ml-0.5">*</span>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-1.5">
      {labelTooltip ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={formFieldLabelClassName}>{labelBody}</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                  aria-label={`${label}: more information`}
                />
              </TooltipTrigger>
              <TooltipContent>{labelTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <label className={formFieldLabelClassName}>{labelBody}</label>
      )}
      {children}
      {(errorText || helperText || characterCount) && (
        <div className="flex items-center justify-between gap-2">
          {errorText ? (
            <div className="flex items-center gap-1.5 text-xs text-semantic-error-primary min-w-0">
              <Info className="size-3.5 shrink-0" />
              <p className="m-0">{errorText}</p>
            </div>
          ) : helperText ? (
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
  onBlur,
  disabled,
  maxLength,
  invalid,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  maxLength?: number;
  invalid?: boolean;
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
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full h-[42px] px-4 text-base rounded border border-solid",
        "bg-semantic-bg-primary text-semantic-text-primary placeholder:text-semantic-text-muted",
        "outline-none",
        invalid
          ? "border-semantic-error-primary/50 hover:border-semantic-error-primary/60 focus:border-semantic-error-primary/70 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.12)]"
          : "border-semantic-border-input hover:border-semantic-border-input-focus focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
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
      botNameIdentityTooltip = defaultBotNameIdentityTooltip,
      primaryRoleTooltip = defaultPrimaryRoleTooltip,
      toneTooltip = defaultToneTooltip,
      howItSoundsTooltip = defaultHowItSoundsTooltip,
      languageModeTooltip = defaultLanguageModeTooltip,
      className,
    }: BotIdentityCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [botNameError, setBotNameError] = React.useState<string | null>(null);
    const [primaryRoleError, setPrimaryRoleError] = React.useState<
      string | null
    >(null);
    const [toneError, setToneError] = React.useState<string | null>(null);

    const handleBotNameChange = React.useCallback(
      (raw: string) => {
        const filtered = filterBotIdentityText(raw);
        if (hadInvalidBotIdentityChars(raw, filtered)) {
          setBotNameError(BOT_IDENTITY_INVALID_CHARS_MESSAGE);
        } else {
          setBotNameError(null);
        }
        onChange({
          botName: sanitizeBotIdentityFieldTyping(raw, BOT_NAME_MAX_LENGTH),
        });
      },
      [onChange]
    );

    const handleBotNameBlur = React.useCallback(() => {
      const cur = data.botName ?? "";
      const trimmed = cur.trim();
      if (trimmed !== cur) onChange({ botName: trimmed });
    }, [data.botName, onChange]);

    const primaryRoleDisplayLabel =
      roleOptions.find((o) => o.value === data.primaryRole)?.label ??
      (data.primaryRole ?? "");

    const handlePrimaryRoleValueChange = React.useCallback(
      (v: string) => {
        setPrimaryRoleError(null);
        const raw = v ?? "";
        const t = raw.trim();
        let out: string;
        if (roleOptions.some((o) => o.value === t)) {
          out = t;
        } else {
          out = finalizeBotIdentityFieldValue(raw);
          if (out.length > PRIMARY_ROLE_MAX_LENGTH) {
            out = out.slice(0, PRIMARY_ROLE_MAX_LENGTH);
          }
        }
        onChange({ primaryRole: out });
      },
      [onChange, roleOptions]
    );

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
              labelTooltip={botNameIdentityTooltip}
              errorText={botNameError ?? undefined}
              characterCount={{
                current: botIdentityEffectiveValueLength(data.botName ?? ""),
                max: BOT_NAME_MAX_LENGTH,
              }}
            >
              <StyledInput
                placeholder="e.g., Rhea from XYZ"
                value={data.botName}
                onChange={handleBotNameChange}
                onBlur={handleBotNameBlur}
                disabled={disabled}
                invalid={Boolean(botNameError)}
              />
            </Field>

            <Field
              label="Primary Role"
              labelTooltip={primaryRoleTooltip}
              errorText={primaryRoleError ?? undefined}
              characterCount={{
                current: botIdentityEffectiveValueLength(primaryRoleDisplayLabel),
                max: PRIMARY_ROLE_MAX_LENGTH,
              }}
            >
              <CreatableSelect
                value={data.primaryRole ?? ""}
                onValueChange={handlePrimaryRoleValueChange}
                options={roleOptions}
                placeholder="e.g., Customer Support Agent"
                creatableHint="Type to create a custom role"
                disabled={disabled}
                sanitizeInput={filterBotIdentityText}
                normalizeComboboxInput={(sanitized) =>
                  normalizeFilteredBotIdentityTyping(
                    sanitized,
                    PRIMARY_ROLE_MAX_LENGTH
                  )
                }
                onInvalidCharacters={() =>
                  setPrimaryRoleError(BOT_IDENTITY_INVALID_CHARS_MESSAGE)
                }
                onValidInput={() => setPrimaryRoleError(null)}
                state={primaryRoleError ? "error" : "default"}
              />
            </Field>

            <Field
              label="Tone"
              labelTooltip={toneTooltip}
              errorText={toneError ?? undefined}
            >
              <CreatableMultiSelect
                value={(Array.isArray(data.tone) ? data.tone : []).slice(0, TONE_MAX_ITEMS)}
                onValueChange={(v) => {
                  setToneError(null);
                  onChange({ tone: (v ?? []).slice(0, TONE_MAX_ITEMS) });
                }}
                options={toneOptions}
                placeholder="Enter or select tone"
                createHintText="Type to create a custom tone"
                disabled={disabled}
                maxItems={TONE_MAX_ITEMS}
                maxLengthPerItem={TONE_MAX_LENGTH_PER_ITEM}
                showPerItemCharacterCounter={false}
                sanitizeInput={filterBotIdentityText}
                onInvalidCharacters={() =>
                  setToneError(BOT_IDENTITY_INVALID_CHARS_MESSAGE)
                }
                onValidInput={() => setToneError(null)}
                state={toneError ? "error" : "default"}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="How It Sounds" labelTooltip={howItSoundsTooltip}>
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

              <Field
                label="What Language It Speaks"
                labelTooltip={languageModeTooltip}
              >
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
