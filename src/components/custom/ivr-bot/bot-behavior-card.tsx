import * as React from "react";
import { Info, Plus, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tagVariants } from "../../ui/tag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Textarea } from "../../ui/textarea";
import { SelectField } from "../../ui/select-field";
import { FormFieldLabel } from "./form-field-label";
import type { VariableGroup, VariableItem } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotBehaviorData {
  systemPrompt: string;
}

/** The text inserted into the prompt when a variable is picked. */
function getInsertValue(item: VariableItem): string {
  return item.value ?? `{{${item.name}}}`;
}

/** The braced label shown on the chip and in the pickers (e.g. `{{First_Name}}`). */
function getDisplayLabel(item: VariableItem): string {
  return item.value ?? `{{${item.name}}}`;
}

/** True when the variable's name or rendered label matches the search query. */
function variableMatches(item: VariableItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    item.name.toLowerCase().includes(q) ||
    getDisplayLabel(item).toLowerCase().includes(q)
  );
}

/** Default hover text for the info icon next to "How It Behaves" */
export const defaultHowItBehavesTooltip =
  "Defines workflows, conditions, and handover logic using the system prompt. Use session variables to insert caller-specific context.";

export const defaultSystemPromptRequiredMessage =
  "System prompt is required";

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
  /**
   * Legacy single-group input: session variables shown as insertable chips and
   * in the `{{` autocomplete. Each string is the full braced form (e.g.
   * `"{{Caller number}}"`). Ignored when {@link variableGroups} is provided.
   *
   * @deprecated Prefer {@link variableGroups} — it scales to multiple labelled
   * groups and renders one chip row per group automatically.
   */
  sessionVariables?: string[];
  /**
   * Variable groups driving the UI. Each group renders its own chip row
   * (with a per-group searchable "View all" dropdown), and all groups are
   * combined — grouped by `label` — in the `{{` variable picker.
   *
   * This is fully data-driven: pass the groups and the component renders the
   * chip rows and pickers automatically. When provided, it takes precedence
   * over {@link sessionVariables}.
   *
   * @example
   * variableGroups={[
   *   { label: "Session variables", items: [{ name: "Caller Contact Number" }] },
   *   { label: "Contact Variables", items: [{ name: "First_Name" }, { name: "Email" }] },
   * ]}
   */
  variableGroups?: VariableGroup[];
  /** Required validation message for the "How It Behaves" system prompt. */
  systemPromptValidation?: string;
  /**
   * When true, the system prompt shows an inline error while empty.
   * Defaults to true, matching Fallback Prompts required-field validation. Pass false to disable it.
   */
  HowItBehavesErrorMessageValidation?: boolean;
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

// ─── Default Session Variables ──────────────────────────────────────────────

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

/**
 * If the caret line falls outside the visible textarea viewport, adjust scrollTop.
 * Uses {@link getCaretPixelPos} (caret Y relative to visible area, negative = above fold).
 */
function scrollCaretIntoViewInTextarea(textarea: HTMLTextAreaElement, position: number) {
  const cs = window.getComputedStyle(textarea);
  const padTop = parseFloat(cs.paddingTop) || 0;
  const padBottom = parseFloat(cs.paddingBottom) || 0;
  const innerHeight = Math.max(0, textarea.clientHeight - padTop - padBottom);
  const lineHeight = parseFloat(cs.lineHeight) || 20;
  const top = getCaretPixelPos(textarea, position).top;
  let st = textarea.scrollTop;
  if (top < 0) {
    st += top - 8;
  } else if (innerHeight > 0 && top + lineHeight > innerHeight) {
    st += top + lineHeight - innerHeight + 8;
  }
  if (st !== textarea.scrollTop) {
    textarea.scrollTop = Math.max(0, st);
  }
}

/** Run after React commits a controlled textarea value so DOM scroll/selection is stable. */
function afterNextPaint(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

/**
 * Restore scroll after programmatic insert (React controlled updates often reset scrollTop),
 * then place the caret and ensure it stays visible inside the textarea.
 */
function focusTextareaAfterInsert(
  textarea: HTMLTextAreaElement,
  savedScrollTop: number,
  selectionStart: number,
  selectionEnd: number
) {
  textarea.focus({ preventScroll: true });
  textarea.scrollTop = savedScrollTop;
  textarea.setSelectionRange(selectionStart, selectionEnd);
  textarea.scrollTop = savedScrollTop;
  scrollCaretIntoViewInTextarea(textarea, selectionStart);
}

/**
 * Caret-anchored variable picker shown when the user types `{{`.
 *
 * Reuses SelectField's visual language (a search input with a `Search` icon
 * over grouped, labelled items) but is positioned at the cursor via
 * {@link getCaretPixelPos} — a real SelectField can't anchor at the caret
 * because it opens from its own trigger button.
 *
 * Filtering combines its own search box with the text typed after `{{`
 * (`triggerQuery`): the search box wins once the user types in it, otherwise
 * the `{{`-fragment filters. Items from every group are shown, grouped by
 * `label`.
 */
function VarPopup({
  groups,
  triggerQuery,
  onSelect,
  style,
}: {
  groups: VariableGroup[];
  triggerQuery: string;
  onSelect: (insertValue: string) => void;
  style?: React.CSSProperties;
}) {
  const [search, setSearch] = React.useState("");
  const query = (search.trim() ? search : triggerQuery).toLowerCase();

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => variableMatches(item, query)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div
      role="listbox"
      data-var-popup=""
      style={style}
      className="absolute z-[9999] flex max-h-72 min-w-[16rem] max-w-sm flex-col overflow-hidden rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-md"
    >
      {/* Search input — mirrors SelectField's searchable header */}
      <div className="flex items-center gap-2 border-b border-solid border-semantic-border-layout px-3">
        <Search className="size-4 shrink-0 text-semantic-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // Keep the textarea selection logic intact and let Escape close the popup
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Search variable…"
          aria-label="Search variables"
          className="h-10 w-full bg-transparent text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-placeholder"
        />
      </div>

      <div className="overflow-y-auto p-1">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="m-0 px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
              {group.label}
            </p>
            {group.items.map((item) => {
              const insertValue = getInsertValue(item);
              return (
                <button
                  key={`${group.label}:${item.name}`}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep textarea focused so blur doesn't close popup first
                    onSelect(insertValue);
                  }}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui"
                >
                  {getDisplayLabel(item)}
                </button>
              );
            })}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="m-0 px-2 py-6 text-center text-sm text-semantic-text-muted">
            No variables found
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * A single variable group's chip row: a label, the chips that fit on one line,
 * and a "View all" link (rendered only when chips overflow) that opens a
 * per-group searchable {@link SelectField}.
 *
 * The visible chip count is measured, not hard-coded: a hidden mirror row
 * lays out every chip with wrapping, and we count how many share the first
 * row's `offsetTop` — then trim until the "View all" link also fits. A
 * `ResizeObserver` recomputes on width changes.
 */
function VariableGroupRow({
  group,
  disabled,
  onInsert,
}: {
  group: VariableGroup;
  disabled?: boolean;
  onInsert: (insertValue: string) => void;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const viewAllMeasureRef = React.useRef<HTMLSpanElement>(null);
  const chipRefs = React.useRef<Array<HTMLSpanElement | null>>([]);

  const total = group.items.length;
  const [visibleCount, setVisibleCount] = React.useState(total);
  const [overflow, setOverflow] = React.useState(false);

  const recompute = React.useCallback(() => {
    const measure = measureRef.current;
    const chips = chipRefs.current
      .slice(0, total)
      .filter((el): el is HTMLSpanElement => el != null);
    if (!measure || chips.length === 0) {
      setVisibleCount(chips.length);
      setOverflow(false);
      return;
    }
    const rowTop = chips[0].offsetTop;
    const onFirstRow = chips.filter((c) => c.offsetTop <= rowTop + 1).length;
    if (onFirstRow === chips.length) {
      setVisibleCount(chips.length);
      setOverflow(false);
      return;
    }
    // Overflow: reserve room for the "View all" link after the last chip.
    const containerWidth = measure.clientWidth;
    const GAP = 8; // matches gap-2
    const viewAllWidth = viewAllMeasureRef.current?.offsetWidth ?? 48;
    let count = onFirstRow;
    while (count > 0) {
      const last = chips[count - 1];
      const rightEdge = last.offsetLeft + last.offsetWidth;
      if (rightEdge + GAP + viewAllWidth <= containerWidth) break;
      count--;
    }
    setVisibleCount(count);
    setOverflow(true);
  }, [total]);

  React.useLayoutEffect(() => {
    recompute();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [recompute, group.items]);

  const chipClass = cn(
    tagVariants(),
    "gap-1.5 cursor-pointer hover:opacity-80 transition-opacity",
    disabled && "opacity-50 cursor-not-allowed"
  );

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-wrap items-center gap-2"
    >
      {/* Hidden mirror row used only for measuring natural chip widths */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap items-center gap-2"
      >
        <span className="shrink-0 text-sm text-semantic-text-secondary">
          {group.label}:
        </span>
        {group.items.map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className={cn(tagVariants(), "gap-1.5")}
          >
            <Plus className="size-3 shrink-0" />
            {getDisplayLabel(item)}
          </span>
        ))}
        <span
          ref={viewAllMeasureRef}
          className="absolute text-sm font-medium"
        >
          View all
        </span>
      </div>

      {/* Visible row */}
      <span className="shrink-0 text-sm text-semantic-text-secondary">
        {group.label}:
      </span>
      {group.items.slice(0, visibleCount).map((item, i) => (
        <button
          key={`${item.name}-${i}`}
          type="button"
          onMouseDown={(e) => {
            if (disabled) return;
            e.preventDefault();
          }}
          onClick={() => {
            if (disabled) return;
            onInsert(getInsertValue(item));
          }}
          disabled={disabled}
          className={chipClass}
        >
          <Plus className="size-3 shrink-0" />
          {getDisplayLabel(item)}
        </button>
      ))}
      {overflow && (
        <SelectField
          value=""
          placeholder="View all"
          searchable
          searchPlaceholder="Search variable…"
          disabled={disabled}
          options={group.items.map((item) => ({
            value: getInsertValue(item),
            label: getDisplayLabel(item),
          }))}
          onSelect={(opt) => onInsert(opt.value)}
          wrapperClassName="inline-flex w-auto gap-0"
          triggerClassName={cn(
            "h-auto w-auto gap-1 border-0 bg-transparent p-0 text-sm font-medium text-semantic-text-link shadow-none",
            "hover:underline focus:border-0 focus:shadow-none",
            // The visible "View all" text is SelectField's placeholder; color it
            // like a link. Uses the explicit CSS-var form (not the `semantic-*`
            // token name) so the tw- prefixer transforms it correctly inside the
            // arbitrary variant + important modifier.
            "[&_[data-placeholder]]:!text-[var(--semantic-text-link)] [&>svg]:hidden"
          )}
          contentClassName="w-auto min-w-[280px] max-w-[320px]"
        />
      )}
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
                    className="size-3.5 text-semantic-text-muted shrink-0 cursor-pointer"
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
      variableGroups,
      systemPromptValidation = defaultSystemPromptRequiredMessage,
      HowItBehavesErrorMessageValidation = true,
      maxLength = 5000,
      disabled,
      howItBehavesTooltip,
      className,
    }: BotBehaviorCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const prompt = data.systemPrompt ?? "";
    /** Counter matches stored prompt length so spaces and newlines each count as one character. */
    const promptCharCount = prompt.length;
    const MAX = maxLength;
    const promptError = HowItBehavesErrorMessageValidation
      ? systemPromptValidation
      : undefined;
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    /** Last known textarea selection — used when chips are clicked (textarea may blur before onClick). */
    const caretRef = React.useRef({ start: 0, end: 0 });
    /** Tracks whether the section has been focused at least once (prevents firing blur on initial render). */
    const hasFocusedRef = React.useRef(false);

    const [varTrigger, setVarTrigger] = React.useState<TriggerState | null>(null);
    const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();

    /**
     * Normalized variable groups driving both the chip rows and the `{{`
     * picker. `variableGroups` wins; otherwise the legacy `sessionVariables`
     * strings collapse into a single "Session variables" group.
     */
    const resolvedGroups: VariableGroup[] = React.useMemo(() => {
      if (variableGroups && variableGroups.length > 0) return variableGroups;
      return [
        {
          label: "Session variables",
          items: sessionVariables.map((v) => ({
            name: v.replace(/^\{\{|\}\}$/g, ""),
            value: v,
          })),
        },
      ];
    }, [variableGroups, sessionVariables]);

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
      const savedScrollTop = el?.scrollTop ?? 0;
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
      afterNextPaint(() => {
        const t = textareaRef.current;
        if (t) {
          focusTextareaAfterInsert(t, savedScrollTop, newPos, newPos);
        }
        caretRef.current = { start: newPos, end: newPos };
      });
    };

    const handleVarSelect = (variable: string) => {
      if (!varTrigger) return;
      const el = textareaRef.current;
      const savedScrollTop = el?.scrollTop ?? 0;
      const from = varTrigger.from;
      const to = varTrigger.to;
      const newVal = insertVar(prompt, variable, from, to);
      if (newVal.length <= MAX) onChange({ systemPrompt: newVal });
      clearTrigger();
      const pos = from + variable.length;
      afterNextPaint(() => {
        const t = textareaRef.current;
        if (t) {
          focusTextareaAfterInsert(t, savedScrollTop, pos, pos);
        }
        caretRef.current = { start: pos, end: pos };
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
      const section = sectionRef.current;
      const next = e.relatedTarget as Element | null;
      // The `{{` picker's own search input / option buttons.
      const intoPopup = !!next?.closest?.("[data-var-popup]");
      // A portaled Radix dropdown — e.g. a group's "View all" SelectField.
      const intoPopper = !!next?.closest?.(
        "[data-radix-popper-content-wrapper]"
      );
      // Keep the `{{` picker open while the user interacts with it; otherwise close it.
      if (!intoPopup) clearTrigger();
      if (!onSystemPromptBlur || !hasFocusedRef.current) return;
      const intoSection = !!(section && next && section.contains(next));
      // Focus still inside the section, or moved into a dropdown the section
      // owns (the View all list) — not a real "left the section" blur.
      if (intoSection || intoPopper) return;
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
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={prompt}
                rows={6}
                resize="none"
                showCount
                maxLength={MAX}
                displayCharCount={promptCharCount}
                onChange={handlePromptChange}
                onSelect={(e) => syncCaretFromTextarea(e.currentTarget)}
                onClick={(e) => syncCaretFromTextarea(e.currentTarget)}
                onKeyUp={(e) => syncCaretFromTextarea(e.currentTarget)}
                onBlur={(e) => syncCaretFromTextarea(e.currentTarget)}
                onFocus={(e) => syncCaretFromTextarea(e.currentTarget)}
                onKeyDown={handlePromptKeyDown}
                placeholder="You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome. How can I assist you today?'"
                disabled={disabled}
                wrapperClassName="gap-0"
                className="placeholder:text-semantic-text-muted hover:border-semantic-border-input-focus"
                helperText="Type {{ to enable dropdown or use the below chips to input variables"
                error={promptError}
                errorIcon={Boolean(promptError)}
              />
              {varTrigger && (
                <VarPopup
                  groups={resolvedGroups}
                  triggerQuery={varTrigger.query}
                  onSelect={handleVarSelect}
                  style={popupStyle}
                />
              )}
            </div>
            {/* One chip row per variable group — data-driven from resolvedGroups */}
            <div className="flex flex-col gap-3">
              {resolvedGroups.map((group) => (
                <VariableGroupRow
                  key={group.label}
                  group={group}
                  disabled={disabled}
                  onInsert={insertVariable}
                />
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }
);
BotBehaviorCard.displayName = "BotBehaviorCard";

export { BotBehaviorCard };
