import * as React from "react";
import { Trash2, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import type {
  CreateFunctionModalProps,
  CreateFunctionData,
  CreateFunctionStep2Data,
  FunctionTabType,
  HttpMethod,
  KeyValuePair,
} from "./types";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const METHODS_WITH_BODY: HttpMethod[] = ["POST", "PUT", "PATCH"];
const FUNCTION_NAME_MAX = 100;
const BODY_MAX = 4000;
const URL_MAX = 500;
const HEADER_KEY_MAX = 512;
const HEADER_VALUE_MAX = 2048;

const FUNCTION_NAME_REGEX = /^(?!_+$)(?=.*[a-zA-Z])[a-zA-Z][a-zA-Z0-9_]*$/;
const URL_REGEX = /^https?:\/\//;
const HEADER_KEY_REGEX = /^[!#$%&'*+\-.^_`|~0-9a-zA-Z]+$/;
// Query parameter validation (aligned with apiIntegrationSchema.queryParams)
const QUERY_PARAM_KEY_MAX = 512;
const QUERY_PARAM_VALUE_MAX = 2048;
const QUERY_PARAM_KEY_PATTERN = /^[a-zA-Z0-9_.\-~]+$/;

const DEFAULT_SESSION_VARIABLES = [
  "{{Caller number}}",
  "{{Time}}",
  "{{Contact Details}}",
];

function validateQueryParamKey(key: string): string | undefined {
  if (!key.trim()) return "Query param key is required";
  if (key.length > QUERY_PARAM_KEY_MAX) return "key cannot exceed 512 characters.";
  if (!QUERY_PARAM_KEY_PATTERN.test(key)) return "Invalid query parameter key.";
  return undefined;
}

function validateQueryParamValue(value: string): string | undefined {
  if (!value.trim()) return "Query param value is required";
  if (value.length > QUERY_PARAM_VALUE_MAX) return "value cannot exceed 2048 characters.";
  return undefined;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Variable trigger helpers ───────────────────────────────────────────────────

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

function extractVarRefs(texts: string[]): string[] {
  const pattern = /\{\{[^}]+\}\}/g;
  const all = texts.flatMap((t) => t.match(pattern) ?? []);
  return Array.from(new Set(all));
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
      className="absolute z-[9999] min-w-[8rem] max-w-xs overflow-hidden rounded-md border border-semantic-border-layout bg-semantic-bg-primary p-1 text-semantic-text-primary shadow-md"
    >
      {variables.map((v) => (
        <button
          key={v}
          type="button"
          role="option"
          onMouseDown={(e) => {
            e.preventDefault(); // keep input focused so blur doesn't close popup first
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

// ── VariableInput — input with {{ autocomplete ─────────────────────────────────

function VariableInput({
  value,
  onChange,
  sessionVariables,
  placeholder,
  maxLength,
  className,
  inputRef: externalInputRef,
  ...inputProps
}: {
  value: string;
  onChange: (v: string) => void;
  sessionVariables: string[];
  placeholder?: string;
  maxLength?: number;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  [k: string]: unknown;
}) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? internalRef;
  const [trigger, setTrigger] = React.useState<TriggerState | null>(null);
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties | undefined>();

  const filtered = trigger
    ? sessionVariables.filter((v) => v.toLowerCase().includes(trigger.query))
    : [];

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
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
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
        onBlur={() => clearTrigger()}
        {...inputProps}
      />
      <VarPopup variables={filtered} onSelect={handleSelect} style={popupStyle} />
    </div>
  );
}

// ── Shared input/textarea styles ──────────────────────────────────────────────
const inputCls = cn(
  "w-full h-[42px] px-4 text-base rounded border",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

const textareaCls = cn(
  "w-full px-4 py-2.5 text-base rounded border resize-none",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
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
  disabled = false,
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
  disabled?: boolean;
}) {
  const update = (id: string, patch: Partial<KeyValuePair>) => {
    // Replace spaces with hyphens in key values
    if (patch.key !== undefined) {
      patch = { ...patch, key: patch.key.replace(/ /g, "-") };
    }
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const add = () =>
    onChange([...rows, { id: generateId(), key: "", value: "" }]);

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
      <span className="text-xs text-semantic-text-muted">{label}</span>
      <div className="border border-semantic-border-layout rounded overflow-hidden">
        {/* Column headers — desktop only; border-r on Key cell defines column boundary */}
        <div className="hidden sm:flex bg-semantic-bg-ui border-b border-semantic-border-layout">
          <div className="flex-1 min-w-0 px-3 py-2 text-xs font-semibold text-semantic-text-muted border-r border-semantic-border-layout">
            Key
          </div>
          <div className="flex-[2] min-w-0 px-3 py-2 text-xs font-semibold text-semantic-text-muted">
            Value
          </div>
          <div className="w-10 shrink-0" aria-hidden="true" />
        </div>

        {/* Filled rows — same flex ratio (flex-1 / flex-2 / w-10) so middle border aligns with header */}
        {rows.map((row) => {
          const errors = getErrors(row);
          return (
            <div
              key={row.id}
              className="border-b border-semantic-border-layout last:border-b-0 flex items-center min-h-0"
            >
              {/* Key column — border-r on column (not input) so it aligns with header */}
              <div className="flex-1 flex flex-col min-w-0 sm:border-r sm:border-semantic-border-layout">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-[10px] font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Key
                </span>
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => update(row.id, { key: e.target.value })}
                  placeholder="Key"
                  maxLength={keyMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.key && "border-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.key)}
                  aria-describedby={errors.key ? `err-key-${row.id}` : undefined}
                />
                {errors.key && (
                  <p id={`err-key-${row.id}`} className="m-0 px-3 pt-0.5 text-xs text-semantic-error-primary">
                    {errors.key}
                  </p>
                )}
              </div>

              {/* Value column — uses VariableInput for {{ autocomplete */}
              <div className="flex-[2] flex flex-col min-w-0">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-[10px] font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Value
                </span>
                <VariableInput
                  value={row.value}
                  onChange={(v) => update(row.id, { value: v })}
                  sessionVariables={sessionVariables}
                  placeholder="Type {{ to add variables"
                  maxLength={valueMaxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    errors.value && "border-semantic-error-primary"
                  )}
                  aria-invalid={Boolean(errors.value)}
                  aria-describedby={errors.value ? `err-value-${row.id}` : undefined}
                />
                {errors.value && (
                  <p id={`err-value-${row.id}`} className="m-0 px-3 pt-0.5 text-xs text-semantic-error-primary">
                    {errors.value}
                  </p>
                )}
              </div>

              {/* Action column — delete aligned with row (same as KeyValueRow / knowledge-base-card) */}
              <div className="w-10 sm:w-10 flex items-center justify-center shrink-0 self-stretch border-l border-semantic-border-layout sm:border-l-0">
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
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="size-3.5 shrink-0" />
          <span>Add row</span>
        </button>
      </div>
    </div>
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
      promptMinLength = 100,
      promptMaxLength = 1000,
      initialStep = 1,
      initialTab = "header",
      sessionVariables = DEFAULT_SESSION_VARIABLES,
      disabled = false,
      className,
    }: CreateFunctionModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [step, setStep] = React.useState<1 | 2>(initialStep);

    const [name, setName] = React.useState(initialData?.name ?? "");
    const [prompt, setPrompt] = React.useState(initialData?.prompt ?? "");

    const [method, setMethod] = React.useState<HttpMethod>(initialData?.method ?? "GET");
    const [url, setUrl] = React.useState(initialData?.url ?? "");
    const [activeTab, setActiveTab] =
      React.useState<FunctionTabType>(initialTab);
    const [headers, setHeaders] = React.useState<KeyValuePair[]>(initialData?.headers ?? []);
    const [queryParams, setQueryParams] = React.useState<KeyValuePair[]>(initialData?.queryParams ?? []);
    const [body, setBody] = React.useState(initialData?.body ?? "");
    const [apiResponse, setApiResponse] = React.useState("");
    const [isTesting, setIsTesting] = React.useState(false);
    const [step2SubmitAttempted, setStep2SubmitAttempted] = React.useState(false);
    const [nameError, setNameError] = React.useState("");
    const [urlError, setUrlError] = React.useState("");
    const [bodyError, setBodyError] = React.useState("");

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

    // Unique {{variable}} refs found across url, body, headers, queryParams
    const testableVars = React.useMemo(
      () =>
        extractVarRefs([
          url,
          body,
          ...headers.map((h) => h.value),
          ...queryParams.map((q) => q.value),
        ]),
      [url, body, headers, queryParams]
    );

    // Sync form state from initialData each time the modal opens
    React.useEffect(() => {
      if (open) {
        setStep(initialStep);
        setName(initialData?.name ?? "");
        setPrompt(initialData?.prompt ?? "");
        setMethod(initialData?.method ?? "GET");
        setUrl(initialData?.url ?? "");
        setActiveTab(initialTab);
        setHeaders(initialData?.headers ?? []);
        setQueryParams(initialData?.queryParams ?? []);
        setBody(initialData?.body ?? "");
        setApiResponse("");
        setStep2SubmitAttempted(false);
        setNameError("");
        setUrlError("");
        setBodyError("");
        setUrlTrigger(null);
        setBodyTrigger(null);
        setUrlPopupStyle(undefined);
        setBodyPopupStyle(undefined);
        setTestVarValues({});
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
      setActiveTab(initialTab);
      setHeaders(initialData?.headers ?? []);
      setQueryParams(initialData?.queryParams ?? []);
      setBody(initialData?.body ?? "");
      setApiResponse("");
      setStep2SubmitAttempted(false);
      setNameError("");
      setUrlError("");
      setBodyError("");
      setUrlTrigger(null);
      setBodyTrigger(null);
      setUrlPopupStyle(undefined);
      setBodyPopupStyle(undefined);
      setTestVarValues({});
    }, [initialData, initialStep, initialTab]);

    const handleClose = React.useCallback(() => {
      reset();
      onOpenChange(false);
    }, [reset, onOpenChange]);

    const supportsBody = METHODS_WITH_BODY.includes(method);

    // When switching to a method without body, reset to header tab if body was active
    React.useEffect(() => {
      if (!supportsBody && activeTab === "body") {
        setActiveTab("header");
      }
    }, [supportsBody, activeTab]);

    const validateName = (value: string) => {
      if (value.trim() && !FUNCTION_NAME_REGEX.test(value.trim())) {
        setNameError("Must start with a letter and contain only letters, numbers, and underscores");
      } else {
        setNameError("");
      }
    };

    const validateUrl = (value: string) => {
      if (value.trim() && !URL_REGEX.test(value.trim())) {
        setUrlError("URL must start with http:// or https://");
      } else {
        setUrlError("");
      }
    };

    const validateBody = (value: string) => {
      if (value.trim()) {
        try {
          JSON.parse(value.trim());
          setBodyError("");
        } catch {
          setBodyError("Body must be valid JSON");
        }
      } else {
        setBodyError("");
      }
    };

    const handleNext = () => {
      if (disabled || (name.trim() && prompt.trim().length >= promptMinLength)) setStep(2);
    };

    const queryParamsHaveErrors = (rows: KeyValuePair[]): boolean =>
      rows.some((row) => {
        const hasInput = row.key.trim() !== "" || row.value.trim() !== "";
        if (!hasInput) return false;
        return (
          validateQueryParamKey(row.key) !== undefined ||
          validateQueryParamValue(row.value) !== undefined
        );
      });

    const handleSubmit = () => {
      if (step === 2) {
        setStep2SubmitAttempted(true);
        if (queryParamsHaveErrors(queryParams)) return;
      }
      const data: CreateFunctionData = {
        name: name.trim(),
        prompt: prompt.trim(),
        method,
        url: url.trim(),
        headers,
        queryParams,
        body,
      };
      onSubmit?.(data);
      handleClose();
    };

    // Substitute {{variable}} references with user-provided test values before calling onTestApi
    const substituteVars = (text: string) =>
      text.replace(/\{\{[^}]+\}\}/g, (match) => testVarValues[match] ?? match);

    const handleTestApi = async () => {
      if (!onTestApi) return;
      setIsTesting(true);
      try {
        const step2: CreateFunctionStep2Data = {
          method,
          url: substituteVars(url),
          headers: headers.map((h) => ({ ...h, value: substituteVars(h.value) })),
          queryParams: queryParams.map((q) => ({ ...q, value: substituteVars(q.value) })),
          body: substituteVars(body),
        };
        const response = await onTestApi(step2);
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

    const headersHaveKeyErrors = headers.some(
      (row) => row.key.trim() && HEADER_KEY_REGEX && !HEADER_KEY_REGEX.test(row.key)
    );

    const isStep1Valid =
      name.trim().length > 0 &&
      FUNCTION_NAME_REGEX.test(name.trim()) &&
      prompt.trim().length >= promptMinLength;

    const isStep2Valid =
      !urlError && !bodyError && !headersHaveKeyErrors && !queryParamsHaveErrors(queryParams);

    const tabLabels: Record<FunctionTabType, string> = {
      header: `Header (${headers.length})`,
      queryParams: `Query params (${queryParams.length})`,
      body: "Body",
    };

    const visibleTabs: FunctionTabType[] = supportsBody
      ? ["header", "queryParams", "body"]
      : ["header", "queryParams"];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="lg"
          hideCloseButton
          className={cn(
            "flex flex-col gap-0 p-0 w-[calc(100vw-2rem)] sm:w-full",
            "max-h-[calc(100svh-2rem)] overflow-hidden",
            className
          )}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout shrink-0 sm:px-6">
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
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 sm:px-6">
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
                      maxLength={FUNCTION_NAME_MAX}
                      disabled={disabled}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) validateName(e.target.value);
                      }}
                      onBlur={(e) => validateName(e.target.value)}
                      placeholder="Enter name of the function"
                      className={cn(inputCls, "pr-16")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs italic text-semantic-text-muted pointer-events-none">
                      {name.length}/{FUNCTION_NAME_MAX}
                    </span>
                  </div>
                  {nameError && (
                    <p className="m-0 text-xs text-semantic-error-primary">{nameError}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fn-prompt"
                    className="text-sm font-semibold text-semantic-text-primary"
                  >
                    Prompt{" "}
                    <span className="text-semantic-error-primary">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="fn-prompt"
                      value={prompt}
                      maxLength={promptMaxLength}
                      disabled={disabled}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter the description of the function"
                      rows={5}
                      className={cn(textareaCls, "pb-7")}
                    />
                    <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted pointer-events-none">
                      {prompt.length}/{promptMaxLength}
                    </span>
                  </div>
                  {prompt.length > 0 && prompt.trim().length < promptMinLength && (
                    <p className="m-0 text-xs text-semantic-error-primary">
                      Minimum {promptMinLength} characters required
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ─ Step 2 ─ */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                {/* API URL — always a single combined row */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
                    API URL
                  </span>
                  <div
                    className={cn(
                      "flex h-[42px] rounded border border-semantic-border-input overflow-visible bg-semantic-bg-primary",
                      "hover:border-semantic-border-input-focus",
                      "focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
                      "transition-shadow"
                    )}
                  >
                    {/* Method selector */}
                    <div className="relative shrink-0 border-r border-semantic-border-layout">
                      <select
                        value={method}
                        disabled={disabled}
                        onChange={(e) =>
                          setMethod(e.target.value as HttpMethod)
                        }
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
                        className={cn(
                          "h-full w-full px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
                      />
                      <VarPopup variables={filteredUrlVars} onSelect={handleUrlVarSelect} style={urlPopupStyle} />
                    </div>
                  </div>
                  {urlError && (
                    <p className="m-0 text-xs text-semantic-error-primary">{urlError}</p>
                  )}
                </div>

                {/* Tabs — scrollable, no visible scrollbar */}
                <div className="flex flex-col gap-4">
                  <div
                    className={cn(
                      "flex border-b border-semantic-border-layout",
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
                            ? "text-semantic-text-secondary border-b-2 border-semantic-text-secondary -mb-px"
                            : "text-semantic-text-muted hover:text-semantic-text-primary"
                        )}
                      >
                        {tabLabels[tab]}
                      </button>
                    ))}
                  </div>

                  {activeTab === "header" && (
                    <KeyValueTable
                      rows={headers}
                      onChange={setHeaders}
                      label="Header"
                      keyMaxLength={HEADER_KEY_MAX}
                      valueMaxLength={HEADER_VALUE_MAX}
                      keyRegex={HEADER_KEY_REGEX}
                      keyRegexError="Invalid header key. Use only alphanumeric and !#$%&'*+-.^_`|~ characters."
                      sessionVariables={sessionVariables}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "queryParams" && (
                    <KeyValueTable
                      rows={queryParams}
                      onChange={setQueryParams}
                      label="Query parameter"
                      keyMaxLength={QUERY_PARAM_KEY_MAX}
                      valueMaxLength={QUERY_PARAM_VALUE_MAX}
                      getRowErrors={(row) => {
                        const hasInput = row.key.trim() !== "" || row.value.trim() !== "";
                        if (!hasInput && !step2SubmitAttempted) return {};
                        return {
                          key: validateQueryParamKey(row.key),
                          value: validateQueryParamValue(row.value),
                        };
                      }}
                      sessionVariables={sessionVariables}
                      disabled={disabled}
                    />
                  )}
                  {activeTab === "body" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-semantic-text-muted">
                        Body
                      </span>
                      <div className={cn("relative")}>
                        <textarea
                          ref={bodyTextareaRef}
                          value={body}
                          maxLength={BODY_MAX}
                          disabled={disabled}
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
                        <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted pointer-events-none">
                          {body.length}/{BODY_MAX}
                        </span>
                        <VarPopup variables={filteredBodyVars} onSelect={handleBodyVarSelect} style={bodyPopupStyle} />
                      </div>
                      {bodyError && (
                        <p className="m-0 text-xs text-semantic-error-primary">{bodyError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Test Your API */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-semantic-text-muted tracking-[0.048px]">
                      Test Your API
                    </span>
                    <div className="border-t border-semantic-border-layout" />
                  </div>

                  {/* Variable test values — shown when URL/body/params contain {{variables}} */}
                  {testableVars.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-semantic-text-muted">
                        Variable values for testing
                      </span>
                      {testableVars.map((variable) => (
                        <div key={variable} className="flex items-center gap-3">
                          <span className="text-xs text-semantic-text-muted font-mono shrink-0 min-w-[120px]">
                            {variable}
                          </span>
                          <input
                            type="text"
                            value={testVarValues[variable] ?? ""}
                            onChange={(e) =>
                              setTestVarValues((prev) => ({
                                ...prev,
                                [variable]: e.target.value,
                              }))
                            }
                            placeholder="Enter test value"
                            className={cn(inputCls, "flex-1 h-9 text-sm")}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestApi}
                    disabled={isTesting || !url.trim()}
                    className="w-full h-[42px] rounded text-sm font-semibold text-semantic-text-secondary bg-semantic-primary-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-semantic-primary-surface/80 sm:w-auto sm:px-6 sm:self-end sm:ml-auto flex items-center justify-center"
                  >
                    {isTesting ? "Testing..." : "Test API"}
                  </button>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-semantic-text-muted">
                      Response from API
                    </span>
                    <textarea
                      readOnly
                      value={apiResponse}
                      rows={4}
                      className="w-full px-3 py-2.5 text-base rounded border border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary resize-none outline-none"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-semantic-border-layout shrink-0 sm:px-6 sm:py-4">
            {step === 1 ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={handleNext}
                  disabled={!disabled && !isStep1Valid}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={handleSubmit}
                  disabled={!isStep2Valid || disabled}
                >
                  Submit
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateFunctionModal.displayName = "CreateFunctionModal";
