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

// ── Shared input/textarea styles ──────────────────────────────────────────────
const inputCls = cn(
  "w-full h-[42px] px-4 text-base rounded border",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
);

const textareaCls = cn(
  "w-full px-4 py-2.5 text-base rounded border resize-none",
  "border-semantic-border-input bg-semantic-bg-primary",
  "text-semantic-text-primary placeholder:text-semantic-text-muted",
  "outline-none hover:border-semantic-border-input-focus",
  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
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
}: {
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
  label: string;
  getRowErrors?: (row: KeyValuePair) => RowErrors;
  keyMaxLength?: number;
  valueMaxLength?: number;
  keyRegex?: RegExp;
  keyRegexError?: string;
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
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover",
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

              {/* Value column */}
              <div className="flex-[2] flex flex-col min-w-0">
                <span className="sm:hidden px-3 pt-2.5 pb-0.5 text-[10px] font-semibold text-semantic-text-muted uppercase tracking-wide">
                  Value
                </span>
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => update(row.id, { value: e.target.value })}
                  placeholder="Type {{ to add variables"
                  maxLength={valueMaxLength}
                  className={cn(
                    "w-full px-3 py-2.5 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover",
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
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors"
        >
          <Plus className="size-3.5 shrink-0" />
          <span>Add row</span>
        </button>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export const CreateFunctionModal = React.forwardRef<
  HTMLDivElement,
  CreateFunctionModalProps
>(
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
      className,
    },
    ref
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
      if (name.trim() && prompt.trim().length >= promptMinLength) setStep(2);
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

    const handleTestApi = async () => {
      if (!onTestApi) return;
      setIsTesting(true);
      try {
        const step2: CreateFunctionStep2Data = {
          method,
          url,
          headers,
          queryParams,
          body,
        };
        const response = await onTestApi(step2);
        setApiResponse(response);
      } finally {
        setIsTesting(false);
      }
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
                      "flex h-[42px] rounded border border-semantic-border-input overflow-hidden bg-semantic-bg-primary",
                      "hover:border-semantic-border-input-focus",
                      "focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
                      "transition-shadow"
                    )}
                  >
                    {/* Method selector */}
                    <div className="relative shrink-0 border-r border-semantic-border-layout">
                      <select
                        value={method}
                        onChange={(e) =>
                          setMethod(e.target.value as HttpMethod)
                        }
                        className="h-full w-[80px] pl-3 pr-7 text-base text-semantic-text-primary bg-transparent outline-none cursor-pointer appearance-none sm:w-[100px]"
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
                    {/* URL input */}
                    <input
                      type="text"
                      value={url}
                      maxLength={URL_MAX}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (urlError) validateUrl(e.target.value);
                      }}
                      onBlur={(e) => validateUrl(e.target.value)}
                      placeholder="Enter URL or Type {{ to add variables"
                      className="flex-1 min-w-0 px-3 text-base text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none"
                    />
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
                    />
                  )}
                  {activeTab === "body" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-semantic-text-muted">
                        Body
                      </span>
                      <div className={cn("relative")}>
                        <textarea
                          value={body}
                          maxLength={BODY_MAX}
                          onChange={(e) => {
                            setBody(e.target.value);
                            if (bodyError) validateBody(e.target.value);
                          }}
                          onBlur={(e) => validateBody(e.target.value)}
                          placeholder="Enter request body (JSON). Type {{ to add variables"
                          rows={6}
                          className={cn(textareaCls, "pb-7")}
                        />
                        <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted pointer-events-none">
                          {body.length}/{BODY_MAX}
                        </span>
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
                  disabled={!isStep1Valid}
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
                  disabled={!isStep2Valid}
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
