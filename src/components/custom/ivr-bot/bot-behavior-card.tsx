import * as React from "react";
import { Info, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tagVariants } from "../../ui/tag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { FormFieldLabel } from "./form-field-label";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotBehaviorData {
  systemPrompt: string;
}

/** Default hover text for the info icon next to "How It Behaves" */
export const defaultHowItBehavesTooltip =
  "Defines workflows, conditions, and handover logic using the system prompt. Use session variables to insert caller-specific context.";

export interface BotBehaviorCardProps {
  /** Current form data */
  data: Partial<BotBehaviorData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<BotBehaviorData>) => void;
  /**
   * Called when focus leaves the **entire** prompt section (textarea + session
   * variable chips). Clicking a chip does NOT trigger
   * this — only clicking outside the whole section does.
   *
   * Use this to persist the system prompt (e.g. fire an API call) once the
   * user is done editing, including any variables they just inserted.
   */
  onSystemPromptBlur?: (value: string) => void;
  /** Session variables shown as insertable chips and in the {{ autocomplete dropdown */
  sessionVariables?: string[];
  /** Maximum character length for the system prompt textarea (default: 5000, per Figma) */
  maxLength?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /**
   * Hover text on the info icon next to "How It Behaves".
   * When omitted, {@link defaultHowItBehavesTooltip} is used. Pass `""` to hide the icon.
   */
  howItBehavesTooltip?: string;
  /** Additional className for the card */
  className?: string;
}

// ─── Default session variables ──────────────────────────────────────────────

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

// ─── Variable trigger helpers ─────────────────────────────────────────────────

interface TriggerState {
  query: string;
  from: number;
  to: number;
}

function detectVarTrigger(value: string, cursor: number): TriggerState | null {
  const before = value.slice(0, cursor);
  const match = /\{\{([^}]*)$/.exec(before);
  if (!match) return null;
  return { query: match[1].toLowerCase(), from: match.index, to: cursor };
}

function insertVar(value: string, variable: string, from: number, to: number): string {
  return value.slice(0, from) + variable + value.slice(to);
}

/**
 * Mirror-div technique: create an invisible clone of the element with identical
 * styles, fill it with text up to the cursor, place a zero-width marker span at
 * the end, and read the marker's position to get pixel-exact cursor coordinates.
 * Returns { top, left } relative to the element's own top-left corner.
 */
function getCaretPixelPos(
  el: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  const cs = window.getComputedStyle(el);
  const mirror = document.createElement("div");

  // Copy every style property that affects text layout
  (
    [
      "boxSizing", "width", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant",
      "letterSpacing", "lineHeight", "textTransform", "wordSpacing", "tabSize",
    ] as (keyof CSSStyleDeclaration)[]
  ).forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mirror.style as any)[prop] = cs[prop];
  });

  // textarea wraps; input does not
  mirror.style.whiteSpace = el.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
  mirror.style.wordWrap = el.tagName === "TEXTAREA" ? "break-word" : "normal";
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.overflow = "hidden";
  mirror.style.top = "0";
  mirror.style.left = "0";
  mirror.style.width = el.offsetWidth + "px";

  document.body.appendChild(mirror);
  mirror.appendChild(document.createTextNode(el.value.substring(0, position)));

  const marker = document.createElement("span");
  marker.textContent = "\u200b"; // zero-width space
  mirror.appendChild(marker);

  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();
  document.body.removeChild(mirror);

  const scrollTop = el instanceof HTMLTextAreaElement ? el.scrollTop : 0;
  return {
    top: markerRect.top - mirrorRect.top - scrollTop,
    left: markerRect.left - mirrorRect.left,
  };
}

// Uses the same visual classes as DropdownMenuContent + DropdownMenuItem.
// Position is driven by cursor coordinates from getCaretPixelPos.
function VarPopup({
  variables,
  onSelect,
  style,
}: {
  variables: string[];
  onSelect: (v: string) => void;
  style?: React.CSSProperties;
}) {
  if (variables.length === 0) return null;
  return (
    <div
      role="listbox"
      style={style}
      className="absolute z-[9999] min-w-[8rem] max-w-xs overflow-hidden rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-md"
    >
      {variables.map((v) => (
        <button
          key={v}
          type="button"
          role="option"
          aria-selected={false}
          onMouseDown={(e) => {
            e.preventDefault(); // keep textarea focused so blur doesn't close popup first
            onSelect(v);
          }}
          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui"
        >
          {v}
        </button>
      ))}
    </div>
  );
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function SectionCard({
  title,
  titleTooltip,
  children,
  className,
}: {
  title: string;
  /** When set, shows an info icon beside the title (hover for tooltip). */
  titleTooltip?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout sm:px-6">
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
            {title}
          </h2>
          {titleTooltip ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                    aria-label={`${title}: more information`}
                  />
                </TooltipTrigger>
                <TooltipContent>{titleTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const BotBehaviorCard = React.forwardRef(
  (
    {
      data,
      onChange,
      onSystemPromptBlur,
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      maxLength = 5000,
      disabled,
      howItBehavesTooltip,
      className,
    }: BotBehaviorCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const prompt = data.systemPrompt ?? "";
    const MAX = maxLength;
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    /** Last known textarea selection — used when chips are clicked (textarea may blur before onClick). */
    const caretRef = React.useRef({ start: 0, end: 0 });
    /** Tracks whether the section has been focused at least once (prevents firing blur on initial render). */
    const hasFocusedRef = React.useRef(false);

    const [varTrigger, setVarTrigger] = React.useState<TriggerState | null>(null);
    const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();

    const filteredVars = varTrigger
      ? sessionVariables.filter((v) =>
          v.toLowerCase().includes(varTrigger.query)
        )
      : [];

    const resolvedHowItBehavesTooltip =
      howItBehavesTooltip === undefined
        ? defaultHowItBehavesTooltip
        : howItBehavesTooltip;

    /** Compute popup pixel position anchored to the cursor, clamped within the textarea. */
    const updatePopupPos = (el: HTMLTextAreaElement, cursor: number) => {
      const caret = getCaretPixelPos(el, cursor);
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
      const top = caret.top + lineHeight;
      // Clamp left so popup (max-w-xs = 320px) doesn't overflow the textarea width
      const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
      setPopupStyle({ top, left });
    };

    const clearTrigger = () => {
      setVarTrigger(null);
      setPopupStyle(undefined);
    };

    const syncCaretFromTextarea = (el: HTMLTextAreaElement) => {
      caretRef.current = {
        start: el.selectionStart,
        end: el.selectionEnd,
      };
    };

    /** Insert at current caret / selection (chips and keyboard); falls back to last synced caret if textarea blurred. */
    const insertVariable = (variable: string) => {
      const el = textareaRef.current;
      let start: number;
      let end: number;
      if (el && document.activeElement === el) {
        start = el.selectionStart;
        end = el.selectionEnd;
      } else {
        const len = prompt.length;
        start = Math.min(caretRef.current.start, len);
        end = Math.min(caretRef.current.end, len);
      }
      if (start > end) [start, end] = [end, start];
      const newVal = prompt.slice(0, start) + variable + prompt.slice(end);
      if (newVal.length > MAX) return;
      onChange({ systemPrompt: newVal });
      const newPos = start + variable.length;
      requestAnimationFrame(() => {
        if (el) {
          el.focus();
          el.setSelectionRange(newPos, newPos);
        }
        caretRef.current = { start: newPos, end: newPos };
      });
    };

    const handleVarSelect = (variable: string) => {
      if (!varTrigger) return;
      const newVal = insertVar(prompt, variable, varTrigger.from, varTrigger.to);
      if (newVal.length <= MAX) onChange({ systemPrompt: newVal });
      clearTrigger();
      // Restore focus and place cursor after inserted variable
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          const pos = varTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
          caretRef.current = { start: pos, end: pos };
        }
      });
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (v.length <= MAX) {
        onChange({ systemPrompt: v });
        syncCaretFromTextarea(e.target);
        const trigger = detectVarTrigger(v, e.target.selectionStart);
        setVarTrigger(trigger);
        if (trigger) updatePopupPos(e.target, e.target.selectionStart);
        else setPopupStyle(undefined);
      }
    };

    const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape" && varTrigger) {
        e.preventDefault();
        clearTrigger();
      }
    };

    /**
     * Fires when focus enters the prompt section (textarea or any chip button).
     * We track this so the section-level blur only fires after the user has
     * actually interacted with the section.
     */
    const handleSectionFocus = () => {
      hasFocusedRef.current = true;
    };

    /**
     * Fires when focus leaves any element inside the prompt section.
     * We check `relatedTarget` — if the new focus target is still inside
     * this section, we do nothing. Only when focus moves fully outside
     * do we fire `onSystemPromptBlur` with the current prompt value.
     */
    const handleSectionBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      clearTrigger();
      if (!onSystemPromptBlur || !hasFocusedRef.current) return;
      const section = sectionRef.current;
      const next = e.relatedTarget as Node | null;
      // Focus moved to another element inside this section — ignore
      if (section && next && section.contains(next)) return;
      onSystemPromptBlur(prompt);
    };

    return (
      <div ref={ref} className={className}>
        <SectionCard
          title="How It Behaves"
          titleTooltip={resolvedHowItBehavesTooltip || undefined}
        >
          {/* onBlur is on this wrapper so clicking chips / instruction text
              does NOT fire the callback — only clicking outside fires it. */}
          <div
            ref={sectionRef}
            className="flex flex-col gap-3"
            onFocus={handleSectionFocus}
            onBlur={handleSectionBlur}
          >
            <FormFieldLabel>
              Define workflows, conditions and handover logic (System prompt)
            </FormFieldLabel>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  rows={6}
                  onChange={handlePromptChange}
                  onSelect={(e) => syncCaretFromTextarea(e.currentTarget)}
                  onClick={(e) => syncCaretFromTextarea(e.currentTarget)}
                  onKeyUp={(e) => syncCaretFromTextarea(e.currentTarget)}
                  onBlur={(e) => syncCaretFromTextarea(e.currentTarget)}
                  onFocus={(e) => syncCaretFromTextarea(e.currentTarget)}
                  onKeyDown={handlePromptKeyDown}
                  placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
                  disabled={disabled}
                  className={cn(
                    "w-full px-4 py-2.5 text-base rounded border border-solid resize-none",
                    "border-semantic-border-input bg-semantic-bg-primary",
                    "text-semantic-text-primary placeholder:text-semantic-text-muted",
                    "outline-none hover:border-semantic-border-input-focus",
                    "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                />
                <VarPopup variables={filteredVars} onSelect={handleVarSelect} style={popupStyle} />
              </div>
              <span
                className="self-end text-sm text-semantic-text-muted"
                aria-live="polite"
                aria-label={`${prompt.length} of ${MAX} characters`}
              >
                {prompt.length}/{MAX}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-semantic-text-secondary">
                  Session variables:
                </span>
                {sessionVariables.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      if (disabled) return;
                      insertVariable(v);
                    }}
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
