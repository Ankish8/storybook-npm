import * as React from "react";
import { Trash2, ChevronDown, X, Plus, Pencil, CircleAlert } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FormModal } from "../../ui/form-modal";
import { Textarea } from "../../ui/textarea";
import type {
  CreateFunctionModalProps,
  CreateFunctionData,
  CreateFunctionStep2Data,
  FunctionTabType,
  HttpMethod,
  KeyValuePair,
  VariableGroup,
  VariableItem,
  VariableFormData,
} from "./types";
import {
  HEADER_KEY_INVALID_MESSAGE,
  HEADER_KEY_REGEX,
  HEADER_MAX_ROWS,
  QUERY_PARAM_KEY_MAX,
  QUERY_PARAM_VALUE_MAX,
  clampKeyValueRows,
  getBodyJsonValidationError,
  getHeaderRowSubmitErrors,
  getQueryParamRowSubmitErrors,
  getUrlBlurValidationError,
  getUrlSubmitValidationError,
  HEADER_OR_QUERY_PAIR_REQUIRED_MESSAGE,
  hasAtLeastOneCompleteKeyValueRow,
  headerRowsHaveSubmitErrors,
  queryParamsHaveErrors,
  validateQueryParamKey,
  validateQueryParamValue,
  VARIABLE_DESCRIPTION_REQUIRED_MESSAGE,
} from "./create-function-validation";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

/** GET/DELETE are rendered without a request body; POST, PUT, and PATCH show the body editor. */
function methodSupportsRequestBody(m: HttpMethod): boolean {
  return m === "POST" || m === "PUT" || m === "PATCH";
}

function resolveStep2TabForMethod(tab: FunctionTabType, method: HttpMethod): FunctionTabType {
  if (tab === "body" && !methodSupportsRequestBody(method)) return "header";
  return tab;
}

const BODY_MAX = 4000;
const URL_MAX = 500;
const HEADER_KEY_MAX = 512;
const HEADER_VALUE_MAX = 2048;

const FUNCTION_NAME_REGEX = /^(?!_+$)(?=.*[a-zA-Z])[a-zA-Z][a-zA-Z0-9_]*$/;

/** Spaces → underscores so users can type natural phrases without invalid-name errors. */
function normalizeFunctionNameInput(value: string): string {
  return value.replace(/ /g, "_");
}
const VARIABLE_NAME_MAX = 30;
/** Aligned with Chat Bot and other product modules that cap free-text descriptions at 2000 characters. */
const VARIABLE_DESCRIPTION_MAX = 2000;
const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

/**
 * Resolves `maxLength` for variable modal fields.
 * - `undefined` (omitted): use `defaultMax`
 * - `null`: no limit (omit `maxLength` in the DOM)
 * - finite number ≥ 0: use that cap
 */
function resolveVariableFieldMaxLength(
  prop: number | null | undefined,
  defaultMax: number
): number | undefined {
  if (prop === null) return undefined;
  if (typeof prop === "number" && Number.isFinite(prop) && prop >= 0) {
    return Math.floor(prop);
  }
  return defaultMax;
}

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Variable trigger helpers ───────────────────────────────────────────────────

interface TriggerState {
  query: string;
  from: number;
  to: number;
}

/** Where to insert `{{name}}` after the user saves "Create new variable" */
type VarInsertContext =
  | { kind: "url"; from: number; to: number }
  | { kind: "body"; from: number; to: number }
  | { kind: "header"; rowId: string; from: number; to: number }
  | { kind: "query"; rowId: string; from: number; to: number };

function detectVarTrigger(value: string, cursor: number): TriggerState | null {
  const before = value.slice(0, cursor);
  const match = /\{\{([^}]*)$/.exec(before);
  if (!match) return null;
  return { query: match[1].toLowerCase(), from: match.index, to: cursor };
}

function insertVar(value: string, variable: string, from: number, to: number): string {
  return value.slice(0, from) + variable + value.slice(to);
}

function extractVarRefs(texts: string[]): string[] {
  const pattern = /\{\{[^}]+\}\}/g;
  const all = texts.flatMap((t) => t.match(pattern) ?? []);
  return Array.from(new Set(all));
}

/** True if a `{{…}}` token in the form matches this variable item (handles `{{name}}` vs `{{function.name}}` and legacy `item.name` with `function.` prefix). */
function placeholderMatchesVariableItem(placeholder: string, item: VariableItem): boolean {
  if (item.value && placeholder === item.value) return true;
  const asDisplayed = `{{${item.name}}}`;
  const asFunction = `{{function.${item.name}}}`;
  if (placeholder === asDisplayed || placeholder === asFunction) return true;

  const m = /^\{\{([^}]+)\}\}$/.exec(placeholder);
  if (!m) return false;
  const inner = m[1].trim();
  if (inner === item.name) return true;

  const bareName = item.name.startsWith("function.") ? item.name.slice("function.".length) : item.name;
  return inner === bareName || inner === `function.${bareName}`;
}

/** Aliases for the inner text of `{{…}}` (e.g. `function.foo` ↔ `foo`). */
function placeholderInnerAliases(inner: string): string[] {
  const trimmed = inner.trim();
  if (!trimmed) return [];
  const out = new Set<string>([trimmed]);
  const bare = trimmed.startsWith("function.") ? trimmed.slice("function.".length) : trimmed;
  out.add(bare);
  if (!trimmed.startsWith("function.")) {
    out.add(`function.${bare}`);
  }
  return Array.from(out);
}

/** Keys used to store Test API "required" for a function variable name from the form (bare id, no `{{}}`). */
function placeholderInnerAliasesForBareName(bareName: string): string[] {
  const trimmed = bareName.trim();
  if (!trimmed) return [];
  return placeholderInnerAliases(trimmed);
}

function buildFnVarRequiredMapFromGroups(groups?: VariableGroup[]): Record<string, boolean> {
  const seeded: Record<string, boolean> = {};
  for (const g of groups ?? []) {
    for (const item of g.items) {
      if (!item.required) continue;
      const n = item.name.trim();
      const bare = n.startsWith("function.") ? n.slice("function.".length) : n;
      for (const key of placeholderInnerAliasesForBareName(bare)) {
        seeded[key] = true;
      }
    }
  }
  return seeded;
}

/**
 * Whether a `{{…}}` placeholder is required for Test API.
 * `localFnVarRequired` merges Required from `variableGroups` (on open) plus Create/Edit variable saves
 * so validation works when the parent omits `variableGroups` or has not updated it yet after `onAddVariable`.
 */
function isPlaceholderRequiredInTest(
  placeholder: string,
  variableGroups?: VariableGroup[],
  localFnVarRequired?: Record<string, boolean>
): boolean {
  if (localFnVarRequired && Object.keys(localFnVarRequired).length > 0) {
    const m = /^\{\{([^}]+)\}\}$/.exec(placeholder.trim());
    if (m) {
      for (const alias of placeholderInnerAliases(m[1])) {
        if (Object.prototype.hasOwnProperty.call(localFnVarRequired, alias)) {
          return Boolean(localFnVarRequired[alias]);
        }
      }
    }
  }

  if (!variableGroups?.length) return false;
  for (const g of variableGroups) {
    for (const item of g.items) {
      if (placeholderMatchesVariableItem(placeholder, item)) {
        return Boolean(item.required);
      }
    }
  }
  return false;
}

/**
 * Rewrites `{{function.oldRaw}}` and `{{oldRaw}}` to the new name everywhere in a string.
 * Used when saving "Edit variable" so URL, body, headers, and query params stay in sync.
 */
function renameVariableRefsInString(
  text: string,
  oldRaw: string,
  newRaw: string
): string {
  const prev = oldRaw.trim();
  const next = newRaw.trim();
  if (!prev || prev === next) return text;
  const withFunction = text.split(`{{function.${prev}}}`).join(`{{function.${next}}}`);
  return withFunction.split(`{{${prev}}}`).join(`{{${next}}}`);
}

// ── Value segment parser — splits "text {{var}} text" into typed segments ─────

type ValueSegment =
  | { type: "text"; content: string }
  | { type: "var"; name: string; raw: string };

function parseValueSegments(value: string): ValueSegment[] {
  const segments: ValueSegment[] = [];
  const regex = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: value.slice(lastIndex, match.index) });
    }
    segments.push({ type: "var", name: match[1], raw: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < value.length) {
    segments.push({ type: "text", content: value.slice(lastIndex) });
  }
  return segments;
}

/** Mirror-div technique — returns { top, left } relative to the element's top-left corner. */
function getCaretPixelPos(
  el: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  const cs = window.getComputedStyle(el);
  const mirror = document.createElement("div");

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
  marker.textContent = "\u200b";
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

// Uses same visual classes as DropdownMenuContent + DropdownMenuItem.
// Position is cursor-anchored via getCaretPixelPos.
// No search bar — typing after {{ already filters via filterQuery.
function VarPopup({
  variables,
  variableGroups,
  filterQuery = "",
  onSelect,
  onAddVariable,
  onEditVariable,
  style,
}: {
  variables: string[];
  variableGroups?: VariableGroup[];
  filterQuery?: string;
  onSelect: (v: string) => void;
  onAddVariable?: () => void;
  onEditVariable?: (variable: string) => void;
  style?: React.CSSProperties;
}) {
  const hasGroups = variableGroups && variableGroups.length > 0;

  if (!hasGroups && variables.length === 0) return null;

  // Flat mode — variables are already pre-filtered by VariableInput
  if (!hasGroups) {
    return (
      <div
        role="listbox"
        style={style}
        className="absolute z-[9999] min-w-[14rem] max-w-sm rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary py-1 text-semantic-text-primary shadow-md"
      >
        {/* Add new variable */}
        {onAddVariable && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onAddVariable(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
          >
            <Plus className="size-3.5 shrink-0" />
            Add new variable
          </button>
        )}

        {/* Variable list */}
        <div className="max-h-48 overflow-y-auto p-1">
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(e) => { e.preventDefault(); onSelect(v); }}
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-semantic-bg-ui"
            >
              {v}
            </button>
          ))}
          {variables.length === 0 && (
            <p className="m-0 px-2 py-1.5 text-sm text-semantic-text-muted">No variables found</p>
          )}
        </div>
      </div>
    );
  }

  // Grouped mode — filter by the {{ trigger query
  const lowerQuery = filterQuery.toLowerCase();
  const filteredGroups = variableGroups.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery)
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div
      role="listbox"
      style={style}
      className="absolute z-[9999] min-w-[14rem] max-w-sm rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary py-1 text-semantic-text-primary shadow-md"
    >
      {/* Add new variable */}
      {onAddVariable && (
        <>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onAddVariable(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
          >
            <Plus className="size-3.5 shrink-0" />
            Add new variable
          </button>
          <div className="border-t border-solid border-semantic-border-layout" />
        </>
      )}

      {/* Grouped variable list */}
      <div className="max-h-48 overflow-y-auto p-1">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="m-0 px-2 pt-2 pb-1 text-sm font-medium text-semantic-text-muted">
              {group.label}
            </p>
            {group.items.map((item) => {
              const insertValue = item.value ?? `{{${item.name}}}`;
              return (
                <div key={item.name} className="flex items-center rounded-sm transition-colors hover:bg-semantic-bg-ui">
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(insertValue); }}
                    className="relative flex flex-1 min-w-0 cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none"
                  >
                    {`{{${item.name}}}`}
                  </button>
                  {item.editable && onEditVariable && (
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); onEditVariable(item.name); }}
                      className="shrink-0 p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="m-0 px-2 py-1.5 text-sm text-semantic-text-muted">No variables found</p>
        )}
      </div>
    </div>
  );
}

// ── VariableFormModal — create/edit a variable ───────────────────────────────

function VariableFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSave,
  variableNameMaxLimit,
  descriptionMaxLimit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: VariableItem;
  onSave: (data: VariableFormData) => void;
  variableNameMaxLimit?: number | null;
  descriptionMaxLimit?: number | null;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [required, setRequired] = React.useState(false);
  const [nameError, setNameError] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState("");
  const descriptionFieldId = React.useId();

  const nameMaxLen = resolveVariableFieldMaxLength(
    variableNameMaxLimit,
    VARIABLE_NAME_MAX
  );
  const descMaxLen = resolveVariableFieldMaxLength(
    descriptionMaxLimit,
    VARIABLE_DESCRIPTION_MAX
  );

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setDescription(initialData?.description ?? "");
      setRequired(initialData?.required ?? false);
      setNameError("");
      setDescriptionError("");
    }
  }, [open, initialData]);

  const validateName = (v: string) => {
    if (!v.trim()) return "";
    if (!VARIABLE_NAME_REGEX.test(v)) {
      return "Variable name should start with alphabet; Cannot have special characters except underscore (_)";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    setNameError(validateName(v));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(
        required
          ? "Value is required for this key"
          : "Variable name is required"
      );
      return;
    }
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }
    const descTrimmed = description.trim();
    if (!descTrimmed) {
      setDescriptionError(VARIABLE_DESCRIPTION_REQUIRED_MESSAGE);
      return;
    }
    if (descMaxLen != null && description.length > descMaxLen) {
      return;
    }
    setDescriptionError("");
    onSave({ name: name.trim(), description: descTrimmed, required });
  };

  const hasInvalidFormat = Boolean(name.trim() && validateName(name));
  const descriptionTooLong =
    descMaxLen != null && description.length > descMaxLen;
  const descriptionInvalid = Boolean(descriptionError) || descriptionTooLong;

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Create new variable" : "Edit variable"}
      saveButtonText={mode === "create" ? "Save" : "Save Changes"}
      disableSave={hasInvalidFormat || descriptionTooLong}
      onSave={handleSave}
      size="default"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-semantic-text-muted">
            Variable name{" "}
            <span className="text-semantic-error-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g., customer_name"
              maxLength={nameMaxLen}
              aria-invalid={Boolean(nameError)}
              className={cn(
                inputCls,
                "pr-16",
                nameError && "border-semantic-error-primary"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted pointer-events-none">
              {name.length}
              {nameMaxLen != null ? `/${nameMaxLen}` : ""}
            </span>
          </div>
          {nameError ? (
            <p className="m-0 flex items-start gap-1.5 text-sm text-semantic-error-primary">
              <CircleAlert className="size-4 shrink-0 mt-0.5" aria-hidden />
              <span>{nameError}</span>
            </p>
          ) : (
            <span className="text-sm text-semantic-text-muted">
              Variable name should start with alphabet; Cannot have special characters except
              underscore (_)
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={descriptionFieldId}
            className="text-sm font-medium text-semantic-text-muted"
          >
            Description{" "}
            <span className="text-semantic-error-primary">*</span>
          </label>
          <div className="relative">
            <textarea
              id={descriptionFieldId}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError("");
              }}
              placeholder="What this variable represents"
              rows={3}
              maxLength={descMaxLen}
              aria-invalid={descriptionInvalid}
              className={cn(
                textareaCls,
                "resize-y min-h-[90px] pb-10 pr-[4.5rem]",
                descriptionInvalid && "border-semantic-error-primary"
              )}
            />
            <span
              className={cn(
                "absolute bottom-3 right-4 text-sm pointer-events-none",
                descriptionInvalid
                  ? "text-semantic-error-primary"
                  : "text-semantic-text-muted"
              )}
              aria-live="polite"
            >
              {description.length}
              {descMaxLen != null ? `/${descMaxLen}` : ""}
            </span>
          </div>
          {descriptionError ? (
            <p className="m-0 flex items-start gap-1.5 text-sm text-semantic-error-primary">
              <CircleAlert className="size-4 shrink-0 mt-0.5" aria-hidden />
              <span>{descriptionError}</span>
            </p>
          ) : descriptionTooLong && descMaxLen != null ? (
            <p className="m-0 flex items-start gap-1.5 text-sm text-semantic-error-primary">
              <CircleAlert className="size-4 shrink-0 mt-0.5" aria-hidden />
              <span>
                Description cannot exceed {descMaxLen} characters
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-semantic-text-muted">Required</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="variable-required"
                checked={required}
                onChange={() => setRequired(true)}
                className="size-4 accent-semantic-primary"
              />
              <span className="text-base text-semantic-text-primary">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="variable-required"
                checked={!required}
                onChange={() => setRequired(false)}
                className="size-4 accent-semantic-primary"
              />
              <span className="text-base text-semantic-text-primary">No</span>
            </label>
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ── VariableInput — input with {{ autocomplete + badge display ──────────────

function VariableInput({
  value,
  onChange,
  sessionVariables,
  variableGroups,
  onAddVariable,
  onEditVariable,
  placeholder,
  maxLength,
  className,
  inputRef: externalInputRef,
  disabled,
  onBlur: onBlurProp,
  ...inputProps
}: {
  value: string;
  onChange: (v: string) => void;
  sessionVariables: string[];
  variableGroups?: VariableGroup[];
  onAddVariable?: (range: { from: number; to: number }) => void;
  onEditVariable?: (variable: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  [k: string]: unknown;
}) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? internalRef;
  const displayRef = React.useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = React.useState<TriggerState | null>(null);
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const filtered = trigger
    ? sessionVariables.filter((v) => v.toLowerCase().includes(trigger.query))
    : [];

  // Parse value into text + variable segments
  const segments = React.useMemo(() => parseValueSegments(value), [value]);
  const hasVariables = segments.some((s) => s.type === "var");
  const showDisplay = !isEditing && value.length > 0 && hasVariables;

  // Check overflow in display mode
  React.useEffect(() => {
    if (showDisplay && displayRef.current && !isExpanded) {
      const el = displayRef.current;
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    } else {
      setIsOverflowing(false);
    }
  }, [showDisplay, value, isExpanded]);

  const updatePopupPos = (el: HTMLInputElement, cursor: number) => {
    const caret = getCaretPixelPos(el, cursor);
    const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
    const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
    setPopupStyle({ top: caret.top + lineHeight, left });
  };

  const clearTrigger = () => {
    setTrigger(null);
    setPopupStyle(undefined);
  };

  const handleSelect = (variable: string) => {
    if (!trigger) return;
    onChange(insertVar(value, variable, trigger.from, trigger.to));
    clearTrigger();
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        const pos = trigger.from + variable.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });
  };

  return (
    <div className="relative w-full">
      {/* Input — always in DOM, hidden when display mode is active */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(className, showDisplay && "opacity-0 pointer-events-none")}
        onChange={(e) => {
          onChange(e.target.value);
          const cursor = e.target.selectionStart ?? e.target.value.length;
          const t = detectVarTrigger(e.target.value, cursor);
          setTrigger(t);
          if (t) updatePopupPos(e.target, cursor);
          else setPopupStyle(undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearTrigger();
        }}
        onFocus={() => setIsEditing(true)}
        onBlur={(e) => {
          clearTrigger();
          setIsEditing(false);
          setIsExpanded(false);
          onBlurProp?.(e);
        }}
        {...inputProps}
      />

      {/* Display mode — variable badges + text + overflow */}
      {showDisplay && (
        <div
          className={cn(
            "absolute cursor-text",
            !isExpanded && "inset-0 flex items-center",
            isExpanded && "inset-x-0 top-0 z-10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (!disabled) inputRef.current?.focus();
          }}
        >
          <div
            ref={displayRef}
            className={cn(
              "flex items-center gap-1 px-2",
              !isExpanded && "flex-1 min-w-0 overflow-hidden",
              isExpanded && "flex-wrap bg-semantic-bg-primary border border-solid border-semantic-border-input rounded py-1.5 shadow-sm"
            )}
          >
            {segments.map((seg, i) =>
              seg.type === "text" ? (
                <span key={i} className="text-sm text-semantic-text-primary whitespace-pre shrink-0">{seg.content}</span>
              ) : (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 shrink-0 rounded px-1.5 py-0.5 text-sm bg-semantic-info-surface text-semantic-text-primary"
                >
                  {seg.name}
                  {onEditVariable && (
                    <button
                      type="button"
                      aria-label={`Edit variable ${seg.name}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditVariable(seg.name);
                      }}
                      className="p-0.5 text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                    >
                      <Pencil className="size-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isOverflowing && !isExpanded && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="shrink-0 px-1 text-sm font-medium text-semantic-text-muted hover:text-semantic-text-primary"
            >
              ...
            </button>
          )}
        </div>
      )}

      {/* VarPopup */}
      <VarPopup
        variables={filtered}
        variableGroups={trigger ? variableGroups : undefined}
        filterQuery={trigger?.query ?? ""}
        onSelect={handleSelect}
        onAddVariable={
          onAddVariable && trigger
            ? () => onAddVariable({ from: trigger.from, to: trigger.to })
            : undefined
        }
        onEditVariable={onEditVariable}
        style={popupStyle}
      />
    </div>
  );
}

// ── Shared input/textarea styles ──────────────────────────────────────────────
const inputCls = cn(
  "w-full h-[42px] px-4 text-base rounded border border-solid",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

const textareaCls = cn(
  "w-full px-4 py-2.5 text-base rounded border border-solid resize-none",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

// ── KeyValueTable ─────────────────────────────────────────────────────────────
type RowErrors = { key?: string; value?: string };

function KeyValueTable({
  rows,
  onChange,
  label,
  getRowErrors,
  keyMaxLength,
  valueMaxLength,
  keyRegex,
  keyRegexError,
  sessionVariables = [],
  variableGroups,
  onAddVariable,
  onEditVariable,
  onKeyBlur,
  onValueBlur,
  disabled = false,
  maxRows,
  maxRowsItemLabel = "rows",
}: {
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
  label: string;
  getRowErrors?: (row: KeyValuePair) => RowErrors;
  keyMaxLength?: number;
  valueMaxLength?: number;
  keyRegex?: RegExp;
  keyRegexError?: string;
  sessionVariables?: string[];
  variableGroups?: VariableGroup[];
  onAddVariable?: (ctx: { rowId: string; from: number; to: number }) => void;
  onEditVariable?: (variable: string) => void;
  onKeyBlur?: (rowId: string) => void;
  onValueBlur?: (rowId: string) => void;
  disabled?: boolean;
  maxRows?: number;
  /** Noun for the row-limit tooltip, e.g. "headers" or "query parameters". */
  maxRowsItemLabel?: string;
}) {
  const atRowLimit = maxRows !== undefined && rows.length >= maxRows;

  const update = (id: string, patch: Partial<KeyValuePair>) => {
    // Replace spaces with hyphens in key values
    if (patch.key !== undefined) {
      patch = { ...patch, key: patch.key.replace(/ /g, "-") };
    }
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const add = () => {
    if (atRowLimit) return;
    onChange([...rows, { id: generateId(), key: "", value: "" }]);
  };

  const getErrors = (row: KeyValuePair): RowErrors => {
    if (getRowErrors) return getRowErrors(row);
    // Inline validation from keyRegex prop when no getRowErrors provided
    const errors: RowErrors = {};
    if (keyRegex && row.key.trim() && !keyRegex.test(row.key)) {
      errors.key = keyRegexError ?? "Invalid key format";
    }
    return errors;
  };

  // Reusable delete row action — same placement and styling as KeyValueRow / knowledge-base-card
  const deleteRowButtonClass =
    "text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors shrink-0";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-semantic-text-muted">{label}</span>
      <div className="border border-solid border-semantic-border-layout rounded">
        {/* Column headers — desktop only; grid tracks match data rows so Key | Value borders align */}
        <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_2.5rem] border-b border-solid border-semantic-border-layout rounded-t">
          <div className="min-w-0 px-3 py-2 text-sm font-semibold text-semantic-text-muted border-r border-solid border-semantic-border-layout">
            Key
          </div>
          <div className="min-w-0 px-3 py-2 text-sm font-semibold text-semantic-text-muted">
            Value
          </div>
          <div className="min-w-0" aria-hidden="true" />
        </div>

        {/* Filled rows — same grid template as header (1fr : 2fr : 2.5rem) */}
        {rows.map((row) => {
          const errors = getErrors(row);
          return (
            <div
              key={row.id}
              className="border-b border-solid border-semantic-border-layout last:border-b-0 flex min-h-0 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_2.5rem] items-stretch"
            >
              {/* Key column — border-r on column (not input) so it aligns with header */}
              <div className="flex flex-1 flex-col min-w-0 sm:flex-none sm:border-r sm:border-solid sm:border-semantic-border-layout">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-sm font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Key
                </span>
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => update(row.id, { key: e.target.value })}
                  onBlur={() => onKeyBlur?.(row.id)}
                  placeholder="Key"
                  maxLength={keyMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.key && "text-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.key)}
                />
              </div>

              {/* Value column — uses VariableInput for {{ autocomplete */}
              <div className="flex flex-[2] flex-col min-w-0 sm:flex-none">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-sm font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Value
                </span>
                <VariableInput
                  value={row.value}
                  onChange={(v) => update(row.id, { value: v })}
                  sessionVariables={sessionVariables}
                  variableGroups={variableGroups}
                  onAddVariable={
                    onAddVariable
                      ? (range) => onAddVariable({ rowId: row.id, ...range })
                      : undefined
                  }
                  onEditVariable={onEditVariable}
                  placeholder="Type {{ to add variables"
                  maxLength={valueMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.value && "text-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.value)}
                  onBlur={() => onValueBlur?.(row.id)}
                />
              </div>

              {/* Action column — fixed 2.5rem track matches header spacer */}
              <div className="flex w-10 shrink-0 items-center justify-center self-stretch border-l border-solid border-semantic-border-layout sm:w-auto sm:border-l-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(row.id)}
                  disabled={disabled}
                  className={cn("rounded-md", deleteRowButtonClass)}
                  aria-label="Delete row"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Add row — always visible */}
        <button
          type="button"
          onClick={add}
          disabled={disabled || atRowLimit}
          title={atRowLimit ? `Maximum ${maxRows} ${maxRowsItemLabel}` : undefined}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-muted hover:bg-semantic-bg-ui transition-colors",
            (disabled || atRowLimit) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="size-3.5 shrink-0" />
          <span>Add row</span>
        </button>
      </div>

      {/* Row errors — below the table (matches query/header validation UX) */}
      {(() => {
        const allErrors = rows
          .flatMap((row) => {
            const errs = getErrors(row);
            const msgs: string[] = [];
            if (errs.key) msgs.push(errs.key);
            if (errs.value) msgs.push(errs.value);
            return msgs;
          });
        if (allErrors.length === 0) return null;
        const unique = Array.from(new Set(allErrors));
        return (
          <div className="flex flex-col gap-0.5">
            {unique.map((msg) => (
              <p key={msg} className="m-0 text-sm text-semantic-error-primary">
                {msg}
              </p>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── Step 2 footer (Back + Submit) — single place for submit busy UX via Button.loading ──
function CreateFunctionModalStep2Footer({
  disabled,
  submitBusy,
  onBack,
  onSubmit,
}: {
  disabled?: boolean;
  submitBusy: boolean;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={Boolean(disabled) || submitBusy}
      >
        Back
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={() => void onSubmit()}
        disabled={Boolean(disabled)}
        loading={submitBusy}
      >
        Submit
      </Button>
    </>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export const CreateFunctionModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      onSubmit,
      onTestApi,
      initialData,
      isEditing = false,
      nameMaxLength = 30,
      promptMinLength = 100,
      promptMaxLength = 2000,
      initialStep = 1,
      initialTab = "header",
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      variableGroups,
      onAddVariable,
      onEditVariable,
      disabled = false,
      submitLoading = false,
      maxHeaderRows = HEADER_MAX_ROWS,
      maxQueryParamRows = HEADER_MAX_ROWS,
      requireHeaderOrQueryPair = false,
      className,
      variableNameMaxLimit,
      descriptionMaxLimit,
    }: CreateFunctionModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [step, setStep] = React.useState<1 | 2>(initialStep);

    const [name, setName] = React.useState(initialData?.name ?? "");
    const [prompt, setPrompt] = React.useState(initialData?.prompt ?? "");

    const [method, setMethod] = React.useState<HttpMethod>(initialData?.method ?? "GET");
    const [url, setUrl] = React.useState(initialData?.url ?? "");
    const [activeTab, setActiveTab] = React.useState<FunctionTabType>(() =>
      resolveStep2TabForMethod(initialTab, initialData?.method ?? "GET")
    );
    const [headers, setHeaders] = React.useState<KeyValuePair[]>(() =>
      clampKeyValueRows(initialData?.headers ?? [], maxHeaderRows)
    );
    const [queryParams, setQueryParams] = React.useState<KeyValuePair[]>(() =>
      clampKeyValueRows(initialData?.queryParams ?? [], maxQueryParamRows)
    );
    const [body, setBody] = React.useState(initialData?.body ?? "");
    const [apiResponse, setApiResponse] = React.useState("");
    const [isTesting, setIsTesting] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const submitBusy = Boolean(submitLoading) || isSubmitting;
    const [step2SubmitAttempted, setStep2SubmitAttempted] = React.useState(false);
    /**
     * Row IDs present when Submit was last clicked. Submit-time key/value errors apply only to
     * these rows so newly added rows after a failed submit stay clean until the next Submit.
     * Stored in state (not refs) so the snapshot always aligns with the same render as
     * `step2SubmitAttempted` after batched updates.
     */
    const [headerRowIdsAtLastSubmitAttempt, setHeaderRowIdsAtLastSubmitAttempt] = React.useState<
      string[]
    >([]);
    const [queryRowIdsAtLastSubmitAttempt, setQueryRowIdsAtLastSubmitAttempt] = React.useState<
      string[]
    >([]);
    const [queryParamFieldTouched, setQueryParamFieldTouched] = React.useState<
      Record<string, { key?: boolean; value?: boolean }>
    >({});
    const [headerFieldTouched, setHeaderFieldTouched] = React.useState<
      Record<string, { key?: boolean; value?: boolean }>
    >({});
    const [nameError, setNameError] = React.useState("");
    const [urlError, setUrlError] = React.useState("");
    const [bodyError, setBodyError] = React.useState("");
    /** Set on Step 2 Submit when headers and query params have no complete key/value row. */
    const [headerQueryPairError, setHeaderQueryPairError] = React.useState("");

    // Variable modal state
    const [varModalOpen, setVarModalOpen] = React.useState(false);
    const [varModalMode, setVarModalMode] = React.useState<"create" | "edit">("create");
    const [varModalInitialData, setVarModalInitialData] = React.useState<VariableItem | undefined>();
    /** Field + `{{…` range to replace with `{{name}}` after create saves */
    const [varInsertContext, setVarInsertContext] = React.useState<VarInsertContext | null>(null);

    /**
     * Required flags for function variables for Test API: seeded from `variableGroups` on open, then
     * updated when the user saves Create/Edit variable (covers missing/stale parent props).
     */
    const [localFnVarRequiredByBareName, setLocalFnVarRequiredByBareName] = React.useState<
      Record<string, boolean>
    >({});

    const openVariableCreateModal = React.useCallback(() => {
      setVarModalMode("create");
      setVarModalInitialData(undefined);
      setVarModalOpen(true);
    }, []);

    const handleVarModalOpenChange = React.useCallback((next: boolean) => {
      setVarModalOpen(next);
      if (!next) setVarInsertContext(null);
    }, []);

    const handleAddVariableFromHeader = React.useCallback(
      (ctx: { rowId: string; from: number; to: number }) => {
        setVarInsertContext({ kind: "header", ...ctx });
        openVariableCreateModal();
      },
      [openVariableCreateModal]
    );

    const handleAddVariableFromQuery = React.useCallback(
      (ctx: { rowId: string; from: number; to: number }) => {
        setVarInsertContext({ kind: "query", ...ctx });
        openVariableCreateModal();
      },
      [openVariableCreateModal]
    );

    const handleEditVariableClick = (variableName: string) => {
      setVarInsertContext(null);
      const rawName = variableName.startsWith("function.") ? variableName.slice(9) : variableName;
      const variable = variableGroups
        ?.flatMap((g) => g.items)
        .find((item) => item.name === rawName);
      setVarModalMode("edit");
      setVarModalInitialData(variable ?? { name: rawName, editable: true });
      setVarModalOpen(true);
    };

    const handleVariableSave = (data: VariableFormData) => {
      const trimmedName = data.name.trim();
      const insertToken = `{{function.${trimmedName}}}`;

      if (varModalMode === "create" && varInsertContext) {
        const ctx = varInsertContext;
        if (ctx.kind === "url") {
          setUrl((u) => insertVar(u, insertToken, ctx.from, ctx.to));
        } else if (ctx.kind === "body") {
          setBody((b) => insertVar(b, insertToken, ctx.from, ctx.to));
        } else if (ctx.kind === "header") {
          setHeaders((rows) =>
            rows.map((r) =>
              r.id === ctx.rowId
                ? { ...r, value: insertVar(r.value, insertToken, ctx.from, ctx.to) }
                : r
            )
          );
        } else if (ctx.kind === "query") {
          setQueryParams((rows) =>
            rows.map((r) =>
              r.id === ctx.rowId
                ? { ...r, value: insertVar(r.value, insertToken, ctx.from, ctx.to) }
                : r
            )
          );
        }
        setVarInsertContext(null);
      }

      const requiredFlag = Boolean(data.required);

      const applyRequiredToLocalMap = (bareName: string, required: boolean) => {
        setLocalFnVarRequiredByBareName((prev) => {
          const next = { ...prev };
          for (const key of placeholderInnerAliasesForBareName(bareName)) {
            next[key] = required;
          }
          return next;
        });
      };

      if (varModalMode === "create") {
        onAddVariable?.(data);
        applyRequiredToLocalMap(trimmedName, requiredFlag);
      } else {
        const prevRaw = (varModalInitialData?.name ?? "").trim();
        if (prevRaw && prevRaw !== trimmedName) {
          setUrl((u) => renameVariableRefsInString(u, prevRaw, trimmedName));
          setBody((b) => renameVariableRefsInString(b, prevRaw, trimmedName));
          setHeaders((rows) =>
            rows.map((r) => ({
              ...r,
              value: renameVariableRefsInString(r.value, prevRaw, trimmedName),
            }))
          );
          setQueryParams((rows) =>
            rows.map((r) => ({
              ...r,
              value: renameVariableRefsInString(r.value, prevRaw, trimmedName),
            }))
          );
          setTestVarValues((prev) => {
            const next: Record<string, string> = {};
            for (const [k, v] of Object.entries(prev)) {
              next[renameVariableRefsInString(k, prevRaw, trimmedName)] = v;
            }
            return next;
          });
          setLocalFnVarRequiredByBareName((prev) => {
            const next = { ...prev };
            for (const key of placeholderInnerAliasesForBareName(prevRaw)) {
              delete next[key];
            }
            for (const key of placeholderInnerAliasesForBareName(trimmedName)) {
              next[key] = requiredFlag;
            }
            return next;
          });
        } else {
          applyRequiredToLocalMap(trimmedName, requiredFlag);
        }
        onEditVariable?.(prevRaw, data);
      }
      setVarModalOpen(false);
    };

    // Variable trigger state for URL and body
    const urlInputRef = React.useRef<HTMLInputElement>(null);
    const bodyTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [urlTrigger, setUrlTrigger] = React.useState<TriggerState | null>(null);
    const [bodyTrigger, setBodyTrigger] = React.useState<TriggerState | null>(null);
    const [urlPopupStyle, setUrlPopupStyle] = React.useState<React.CSSProperties | undefined>();
    const [bodyPopupStyle, setBodyPopupStyle] = React.useState<React.CSSProperties | undefined>();

    const filteredUrlVars = urlTrigger
      ? sessionVariables.filter((v) => v.toLowerCase().includes(urlTrigger.query))
      : [];
    const filteredBodyVars = bodyTrigger
      ? sessionVariables.filter((v) => v.toLowerCase().includes(bodyTrigger.query))
      : [];

    const handleAddVariableFromUrl = React.useCallback(() => {
      if (urlTrigger) {
        setVarInsertContext({
          kind: "url",
          from: urlTrigger.from,
          to: urlTrigger.to,
        });
      }
      openVariableCreateModal();
    }, [urlTrigger, openVariableCreateModal]);

    const handleAddVariableFromBody = React.useCallback(() => {
      if (bodyTrigger) {
        setVarInsertContext({
          kind: "body",
          from: bodyTrigger.from,
          to: bodyTrigger.to,
        });
      }
      openVariableCreateModal();
    }, [bodyTrigger, openVariableCreateModal]);

    const computePopupStyle = (
      el: HTMLTextAreaElement | HTMLInputElement,
      cursor: number
    ): React.CSSProperties => {
      const caret = getCaretPixelPos(el, cursor);
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
      const left = Math.min(caret.left, Math.max(0, el.offsetWidth - 320));
      return { top: caret.top + lineHeight, left };
    };

    // Test variable values — filled by user before clicking Test API
    const [testVarValues, setTestVarValues] = React.useState<Record<string, string>>({});
    /** Set when user clicks Test API — drives inline errors for empty required variable values only (not Submit). */
    const [testApiRequiredAttempted, setTestApiRequiredAttempted] = React.useState(false);

    // Unique {{variable}} refs across url, optional body, headers, queryParams
    const testableVars = React.useMemo(() => {
      const texts = [
        url,
        ...(methodSupportsRequestBody(method) ? [body] : []),
        ...headers.map((h) => h.value),
        ...queryParams.map((q) => q.value),
      ];
      return extractVarRefs(texts);
    }, [url, body, method, headers, queryParams]);

    // Sync form state from initialData each time the modal opens
    React.useEffect(() => {
      if (open) {
        setStep(initialStep);
        setName(initialData?.name ?? "");
        setPrompt(initialData?.prompt ?? "");
        setMethod(initialData?.method ?? "GET");
        setUrl(initialData?.url ?? "");
        setActiveTab(resolveStep2TabForMethod(initialTab, initialData?.method ?? "GET"));
        setHeaders(clampKeyValueRows(initialData?.headers ?? [], maxHeaderRows));
        setQueryParams(clampKeyValueRows(initialData?.queryParams ?? [], maxQueryParamRows));
        setBody(initialData?.body ?? "");
        setApiResponse("");
        setStep2SubmitAttempted(false);
        setHeaderRowIdsAtLastSubmitAttempt([]);
        setQueryRowIdsAtLastSubmitAttempt([]);
        setQueryParamFieldTouched({});
        setHeaderFieldTouched({});
        setTestApiRequiredAttempted(false);
        setNameError("");
        setUrlError("");
        setBodyError("");
        setHeaderQueryPairError("");
        setUrlTrigger(null);
        setBodyTrigger(null);
        setUrlPopupStyle(undefined);
        setBodyPopupStyle(undefined);
        setTestVarValues({});
        setLocalFnVarRequiredByBareName(buildFnVarRequiredMapFromGroups(variableGroups));
        setVarInsertContext(null);
        setIsSubmitting(false);
      }
    // Re-run only when modal opens; intentionally exclude deep deps to avoid mid-session resets
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const reset = React.useCallback(() => {
      setStep(initialStep);
      setName(initialData?.name ?? "");
      setPrompt(initialData?.prompt ?? "");
      setMethod(initialData?.method ?? "GET");
      setUrl(initialData?.url ?? "");
      setActiveTab(resolveStep2TabForMethod(initialTab, initialData?.method ?? "GET"));
      setHeaders(clampKeyValueRows(initialData?.headers ?? [], maxHeaderRows));
      setQueryParams(clampKeyValueRows(initialData?.queryParams ?? [], maxQueryParamRows));
      setBody(initialData?.body ?? "");
      setApiResponse("");
      setStep2SubmitAttempted(false);
      setHeaderRowIdsAtLastSubmitAttempt([]);
      setQueryRowIdsAtLastSubmitAttempt([]);
      setQueryParamFieldTouched({});
      setHeaderFieldTouched({});
      setTestApiRequiredAttempted(false);
      setNameError("");
      setUrlError("");
      setBodyError("");
      setHeaderQueryPairError("");
      setUrlTrigger(null);
      setBodyTrigger(null);
      setUrlPopupStyle(undefined);
      setBodyPopupStyle(undefined);
      setTestVarValues({});
      setLocalFnVarRequiredByBareName(buildFnVarRequiredMapFromGroups(variableGroups));
      setVarInsertContext(null);
      setIsSubmitting(false);
    }, [
      initialData,
      initialStep,
      initialTab,
      variableGroups,
      maxHeaderRows,
      maxQueryParamRows,
    ]);

    const handleClose = React.useCallback(() => {
      reset();
      onOpenChange(false);
    }, [reset, onOpenChange]);

    React.useEffect(() => {
      setActiveTab((tab) =>
        !methodSupportsRequestBody(method) && tab === "body" ? "header" : tab
      );
    }, [method]);

    const validateName = (value: string) => {
      if (value.trim() && !FUNCTION_NAME_REGEX.test(value.trim())) {
        setNameError("Must start with a letter and contain only letters, numbers, and underscores");
      } else {
        setNameError("");
      }
    };

    const validateUrl = (value: string) => {
      setUrlError(getUrlBlurValidationError(value));
    };

    const validateBody = (value: string) => {
      setBodyError(getBodyJsonValidationError(value));
    };

    const handleNext = () => {
      if (disabled || (name.trim() && prompt.trim().length >= promptMinLength)) setStep(2);
    };

    const handleSubmit = async () => {
      if (step !== 2 || submitBusy) return;

      setHeaderRowIdsAtLastSubmitAttempt(headers.map((h) => h.id));
      setQueryRowIdsAtLastSubmitAttempt(queryParams.map((q) => q.id));
      setStep2SubmitAttempted(true);
      setHeaderQueryPairError("");

      const urlErr = getUrlSubmitValidationError(url);
      setUrlError(urlErr);

      let bodyErr = "";
      if (methodSupportsRequestBody(method)) {
        bodyErr = getBodyJsonValidationError(body);
        setBodyError(bodyErr);
      } else {
        setBodyError("");
      }

      if (queryParamsHaveErrors(queryParams)) return;
      if (urlErr || bodyErr) return;

      if (headerRowsHaveSubmitErrors(headers)) return;

      if (
        requireHeaderOrQueryPair &&
        !hasAtLeastOneCompleteKeyValueRow(headers, queryParams)
      ) {
        setHeaderQueryPairError(HEADER_OR_QUERY_PAIR_REQUIRED_MESSAGE);
        return;
      }

      const data: CreateFunctionData = {
        name: name.trim(),
        prompt: prompt.trim(),
        method,
        url: url.trim(),
        headers,
        queryParams,
        body: methodSupportsRequestBody(method) ? body : "",
      };

      setIsSubmitting(true);
      try {
        await Promise.resolve(onSubmit?.(data));
      } catch {
        return;
      } finally {
        setIsSubmitting(false);
      }
    };

    // Substitute {{variable}} references with user-provided test values before calling onTestApi
    const substituteVars = (text: string) =>
      text.replace(/\{\{[^}]+\}\}/g, (match) => testVarValues[match] ?? match);

    const handleTestApi = async () => {
      // Validate all test variable values are filled (always runs, regardless of onTestApi)
      const requiredTestVars = testableVars.filter((v) =>
        isPlaceholderRequiredInTest(v, variableGroups, localFnVarRequiredByBareName)
      );
      if (requiredTestVars.length > 0) {
        setTestApiRequiredAttempted(true);
        const hasEmpty = requiredTestVars.some((v) => !testVarValues[v]?.trim());
        if (hasEmpty) return;
      }

      if (!onTestApi) return;

      setIsTesting(true);
      try {
        const step2: CreateFunctionStep2Data = {
          method,
          url: substituteVars(url),
          headers: headers.map((h) => ({ ...h, value: substituteVars(h.value) })),
          queryParams: queryParams.map((q) => ({ ...q, value: substituteVars(q.value) })),
          body: methodSupportsRequestBody(method) ? substituteVars(body) : "",
        };
        const response = await onTestApi(step2, { ...testVarValues });
        setApiResponse(response);
      } finally {
        setIsTesting(false);
      }
    };

    // URL variable insertion
    const handleUrlVarSelect = (variable: string) => {
      if (!urlTrigger) return;
      setUrl(insertVar(url, variable, urlTrigger.from, urlTrigger.to));
      setUrlTrigger(null);
      setUrlPopupStyle(undefined);
      requestAnimationFrame(() => {
        const el = urlInputRef.current;
        if (el) {
          const pos = urlTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
        }
      });
    };

    // Body variable insertion
    const handleBodyVarSelect = (variable: string) => {
      if (!bodyTrigger) return;
      setBody(insertVar(body, variable, bodyTrigger.from, bodyTrigger.to));
      setBodyTrigger(null);
      setBodyPopupStyle(undefined);
      requestAnimationFrame(() => {
        const el = bodyTextareaRef.current;
        if (el) {
          const pos = bodyTrigger.from + variable.length;
          el.focus();
          el.setSelectionRange(pos, pos);
        }
      });
    };

    const isStep1Valid =
      name.trim().length > 0 &&
      FUNCTION_NAME_REGEX.test(name.trim()) &&
      prompt.trim().length >= promptMinLength;

    const tabLabels: Record<FunctionTabType, string> = {
      header: `Header (${headers.length})`,
      queryParams: `Query params (${queryParams.length})`,
      body: "Body",
    };

    const visibleTabs: FunctionTabType[] = methodSupportsRequestBody(method)
      ? ["header", "queryParams", "body"]
      : ["header", "queryParams"];

    return (
      <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="lg"
          hideCloseButton
          className={cn(
            "flex flex-col gap-0 p-0 w-[calc(100vw-2rem)] sm:w-full",
            "max-h-[calc(100vh-2rem)] overflow-hidden",
            className
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout shrink-0 sm:px-6">
            <DialogTitle className="text-base font-semibold text-semantic-text-primary">
              {isEditing ? "Edit Function" : "Create Function"}
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="rounded p-1.5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain px-4 py-5 sm:px-6">
            {/* ─ Step 1 ─ */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fn-name"
                    className="text-sm font-semibold text-semantic-text-primary"
                  >
                    Function Name{" "}
                    <span className="text-semantic-error-primary">*</span>
                  </label>
                  <div className={cn("relative")}>
                    <input
                      id="fn-name"
                      type="text"
                      value={name}
                      maxLength={nameMaxLength}
                      disabled={disabled}
                      onChange={(e) => {
                        const normalized = normalizeFunctionNameInput(
                          e.target.value
                        );
                        setName(normalized);
                        if (nameError) validateName(normalized);
                      }}
                      onBlur={(e) =>
                        validateName(normalizeFunctionNameInput(e.target.value))
                      }
                      placeholder="Enter name of the function"
                      className={cn(inputCls, "pr-16")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted pointer-events-none">
                      {name.length}/{nameMaxLength}
                    </span>
                  </div>
                  {nameError && (
                    <p className="m-0 text-sm text-semantic-error-primary">{nameError}</p>
                  )}
                </div>

                <Textarea
                  id="fn-prompt"
                  label="Prompt"
                  required
                  value={prompt}
                  maxLength={promptMaxLength}
                  showCount
                  disabled={disabled}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the description of the function"
                  rows={5}
                  labelClassName="font-semibold text-semantic-text-primary"
                  error={
                    prompt.length > 0 && prompt.trim().length < promptMinLength
                      ? `Minimum ${promptMinLength} characters required`
                      : undefined
                  }
                />
              </div>
            )}

            {/* ─ Step 2 ─ */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                {/* API URL — always a single combined row */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-semantic-text-muted tracking-[0.048px]">
                    API URL
                  </span>
                    <div
                    className={cn(
                      "flex h-[42px] rounded border border-solid overflow-visible bg-semantic-bg-primary",
                      "transition-shadow",
                      urlError
                        ? "border-semantic-error-primary focus-within:border-semantic-error-primary"
                        : "border-semantic-border-input focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                    )}
                  >
                    {/* Method selector */}
                    <div className="relative shrink-0 border-r border-solid border-semantic-border-layout">
                      <select
                        value={method}
                        disabled={disabled}
                        onChange={(e) => {
                          const next = e.target.value as HttpMethod;
                          setMethod(next);
                          if (!methodSupportsRequestBody(next)) {
                            setBodyError("");
                            setBodyTrigger(null);
                            setBodyPopupStyle(undefined);
                          }
                        }}
                        className={cn(
                          "h-full w-[80px] pl-3 pr-7 text-base text-semantic-text-primary bg-transparent outline-none cursor-pointer appearance-none sm:w-[100px]",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="HTTP method"
                      >
                        {HTTP_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-semantic-text-muted pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                    {/* URL input with {{ trigger */}
                    <div className="relative flex-1 min-w-0">
                      <input
                        ref={urlInputRef}
                        type="text"
                        value={url}
                        maxLength={URL_MAX}
                        disabled={disabled}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (urlError) validateUrl(e.target.value);
                          const cursor = e.target.selectionStart ?? e.target.value.length;
                          const t = detectVarTrigger(e.target.value, cursor);
                          setUrlTrigger(t);
                          if (t) setUrlPopupStyle(computePopupStyle(e.target, cursor));
                          else setUrlPopupStyle(undefined);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") { setUrlTrigger(null); setUrlPopupStyle(undefined); }
                        }}
                        onBlur={(e) => {
                          validateUrl(e.target.value);
                          setUrlTrigger(null);
                          setUrlPopupStyle(undefined);
                        }}
                        placeholder="Enter URL or Type {{ to add variables"
                        aria-invalid={Boolean(urlError)}
                        aria-describedby={urlError ? "fn-api-url-error" : undefined}
                        className={cn(
                          "h-full w-full px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
                      />
                      <VarPopup
                        variables={filteredUrlVars}
                        variableGroups={urlTrigger ? variableGroups : undefined}
                        filterQuery={urlTrigger?.query ?? ""}
                        onSelect={handleUrlVarSelect}
                        onAddVariable={onAddVariable ? handleAddVariableFromUrl : undefined}
                        onEditVariable={onEditVariable ? handleEditVariableClick : undefined}
                        style={urlPopupStyle}
                      />
                    </div>
                  </div>
                  {urlError && (
                    <p id="fn-api-url-error" className="m-0 text-sm text-semantic-error-primary">
                      {urlError}
                    </p>
                  )}
                </div>

                {/* Tabs — scrollable, no visible scrollbar */}
                <div className="flex flex-col gap-4">
                  <div
                    className={cn(
                      "flex border-b border-solid border-semantic-border-layout",
                      "overflow-x-auto",
                      "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    )}
                  >
                    {visibleTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0",
                          activeTab === tab
                            ? "text-semantic-text-secondary border-b-2 border-solid border-semantic-text-secondary -mb-px"
                            : "text-semantic-text-muted hover:text-semantic-text-primary"
                        )}
                      >
                        {tabLabels[tab]}
                      </button>
                    ))}
                  </div>
                  {headerQueryPairError && (
                    <p
                      id="fn-header-query-pair-error"
                      className="m-0 text-sm text-semantic-error-primary"
                    >
                      {headerQueryPairError}
                    </p>
                  )}

                  {activeTab === "header" && (
                    <KeyValueTable
                      rows={headers}
                      onChange={(rows) => setHeaders(clampKeyValueRows(rows, maxHeaderRows))}
                      label="Header"
                      maxRows={maxHeaderRows}
                      maxRowsItemLabel="headers"
                      keyMaxLength={HEADER_KEY_MAX}
                      valueMaxLength={HEADER_VALUE_MAX}
                      keyRegex={HEADER_KEY_REGEX}
                      keyRegexError={HEADER_KEY_INVALID_MESSAGE}
                      getRowErrors={(row) => {
                        const useSubmitRowErrors =
                          step2SubmitAttempted &&
                          headerRowIdsAtLastSubmitAttempt.includes(row.id);
                        if (useSubmitRowErrors) {
                          return getHeaderRowSubmitErrors(row);
                        }
                        const keyT = row.key.trim();
                        const valT = row.value.trim();
                        const touched = headerFieldTouched[row.id] ?? {};
                        if (!keyT && !valT) return {};
                        const errors: RowErrors = {};
                        if (touched.key) {
                          if (!keyT) errors.key = "Header key is required";
                          else if (!HEADER_KEY_REGEX.test(row.key)) {
                            errors.key = HEADER_KEY_INVALID_MESSAGE;
                          }
                        }
                        if (touched.value && !valT) {
                          errors.value = "Header value is required";
                        }
                        return errors;
                      }}
                      onKeyBlur={(rowId) =>
                        setHeaderFieldTouched((prev) => ({
                          ...prev,
                          [rowId]: { ...prev[rowId], key: true },
                        }))
                      }
                      onValueBlur={(rowId) =>
                        setHeaderFieldTouched((prev) => ({
                          ...prev,
                          [rowId]: { ...prev[rowId], value: true },
                        }))
                      }
                      sessionVariables={sessionVariables}
                      variableGroups={variableGroups}
                      onAddVariable={handleAddVariableFromHeader}
                      onEditVariable={handleEditVariableClick}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "queryParams" && (
                    <KeyValueTable
                      rows={queryParams}
                      onChange={(rows) => setQueryParams(clampKeyValueRows(rows, maxQueryParamRows))}
                      label="Query parameter"
                      maxRows={maxQueryParamRows}
                      maxRowsItemLabel="query parameters"
                      keyMaxLength={QUERY_PARAM_KEY_MAX}
                      valueMaxLength={QUERY_PARAM_VALUE_MAX}
                      getRowErrors={(row) => {
                        const useSubmitRowErrors =
                          step2SubmitAttempted &&
                          queryRowIdsAtLastSubmitAttempt.includes(row.id);
                        if (useSubmitRowErrors) {
                          return getQueryParamRowSubmitErrors(row);
                        }
                        const keyT = row.key.trim();
                        const valT = row.value.trim();
                        const touched = queryParamFieldTouched[row.id] ?? {};
                        // Before any Submit: ignore fully empty rows until blur/touched.
                        if (!keyT && !valT) return {};
                        const errors: RowErrors = {};
                        if (touched.key) {
                          const k = validateQueryParamKey(row.key);
                          if (k) errors.key = k;
                        }
                        if (touched.value) {
                          const v = validateQueryParamValue(row.value);
                          if (v) errors.value = v;
                        }
                        return errors;
                      }}
                      onKeyBlur={(rowId) =>
                        setQueryParamFieldTouched((prev) => ({
                          ...prev,
                          [rowId]: { ...prev[rowId], key: true },
                        }))
                      }
                      onValueBlur={(rowId) =>
                        setQueryParamFieldTouched((prev) => ({
                          ...prev,
                          [rowId]: { ...prev[rowId], value: true },
                        }))
                      }
                      sessionVariables={sessionVariables}
                      variableGroups={variableGroups}
                      onAddVariable={handleAddVariableFromQuery}
                      onEditVariable={handleEditVariableClick}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "body" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-semantic-text-muted">
                        Body
                      </span>
                      <div className={cn("relative")}>
                        <textarea
                          ref={bodyTextareaRef}
                          value={body}
                          maxLength={BODY_MAX}
                          disabled={disabled}
                          aria-invalid={Boolean(bodyError)}
                          aria-describedby={bodyError ? "fn-body-error" : undefined}
                          onChange={(e) => {
                            setBody(e.target.value);
                            if (bodyError) validateBody(e.target.value);
                            const cursor = e.target.selectionStart ?? e.target.value.length;
                            const t = detectVarTrigger(e.target.value, cursor);
                            setBodyTrigger(t);
                            if (t) setBodyPopupStyle(computePopupStyle(e.target, cursor));
                            else setBodyPopupStyle(undefined);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") { setBodyTrigger(null); setBodyPopupStyle(undefined); }
                          }}
                          onBlur={(e) => {
                            validateBody(e.target.value);
                            setBodyTrigger(null);
                            setBodyPopupStyle(undefined);
                          }}
                          placeholder="Enter request body (JSON). Type {{ to add variables"
                          rows={6}
                          className={cn(textareaCls, "pb-7")}
                        />
                        <span className="absolute bottom-2 right-3 text-sm text-semantic-text-muted pointer-events-none">
                          {body.length}/{BODY_MAX}
                        </span>
                        <VarPopup
                          variables={filteredBodyVars}
                          variableGroups={bodyTrigger ? variableGroups : undefined}
                          filterQuery={bodyTrigger?.query ?? ""}
                          onSelect={handleBodyVarSelect}
                          onAddVariable={onAddVariable ? handleAddVariableFromBody : undefined}
                          onEditVariable={onEditVariable ? handleEditVariableClick : undefined}
                          style={bodyPopupStyle}
                        />
                      </div>
                      {bodyError && (
                        <p id="fn-body-error" className="m-0 text-sm text-semantic-error-primary">
                          {bodyError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Test Your API */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-semantic-text-muted tracking-[0.048px]">
                      Test Your API
                    </span>
                    <div className="border-t border-solid border-semantic-border-layout" />
                  </div>

                  {/* Variable test values — shown when URL, body (if applicable), or params contain {{variables}} */}
                  {testableVars.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-semantic-text-muted">
                        Variable values for testing
                      </span>
                      {testableVars.map((variable, varIndex) => {
                        const mustFill = isPlaceholderRequiredInTest(
                          variable,
                          variableGroups,
                          localFnVarRequiredByBareName
                        );
                        const isEmpty =
                          mustFill &&
                          testApiRequiredAttempted &&
                          !testVarValues[variable]?.trim();
                        const testVarErrId = `fn-test-var-err-${varIndex}`;
                        return (
                        <div key={variable} className="flex flex-col gap-1">
                          <div className="flex items-start gap-3">
                            <span className="m-0 inline-flex shrink-0 items-center rounded-md bg-semantic-bg-ui px-2.5 py-1.5 text-sm font-mono text-semantic-text-secondary">
                              {variable}
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <input
                                type="text"
                                value={testVarValues[variable] ?? ""}
                                onChange={(e) =>
                                  setTestVarValues((prev) => ({
                                    ...prev,
                                    [variable]: e.target.value,
                                  }))
                                }
                                placeholder="Value"
                                className={cn(
                                  inputCls,
                                  "h-9 text-sm",
                                  isEmpty &&
                                    "border-semantic-error-primary focus:border-semantic-error-primary focus:shadow-none"
                                )}
                                aria-invalid={isEmpty}
                                aria-describedby={isEmpty ? testVarErrId : undefined}
                              />
                              {isEmpty && (
                                <p
                                  id={testVarErrId}
                                  className="m-0 flex items-center gap-1.5 text-xs text-semantic-error-primary"
                                >
                                  <span
                                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-semantic-error-primary text-[10px] font-bold leading-none text-semantic-text-inverted"
                                    aria-hidden
                                  >
                                    !
                                  </span>
                                  <span>Value is required for this key</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestApi}
                    disabled={isTesting || !url.trim()}
                    className="w-full h-[42px] rounded text-sm font-semibold text-semantic-text-secondary bg-semantic-primary-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-semantic-primary-surface/80 sm:w-auto sm:px-6 sm:self-end sm:ml-auto flex items-center justify-center"
                  >
                    {isTesting ? "Testing..." : "Test"}
                  </button>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-semantic-text-muted">
                      Response from API
                    </span>
                    <textarea
                      readOnly
                      value={apiResponse}
                      rows={4}
                      className="w-full px-3 py-2.5 text-base rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary resize-none outline-none"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-solid border-semantic-border-layout shrink-0 sm:px-6 sm:py-4">
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={!disabled && !isStep1Valid}
                >
                  Next
                </Button>
              </>
            ) : (
              <CreateFunctionModalStep2Footer
                disabled={disabled}
                submitBusy={submitBusy}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <VariableFormModal
        open={varModalOpen}
        onOpenChange={handleVarModalOpenChange}
        mode={varModalMode}
        initialData={varModalInitialData}
        onSave={handleVariableSave}
        variableNameMaxLimit={variableNameMaxLimit}
        descriptionMaxLimit={descriptionMaxLimit}
      />
      </>
    );
  }
);

CreateFunctionModal.displayName = "CreateFunctionModal";
