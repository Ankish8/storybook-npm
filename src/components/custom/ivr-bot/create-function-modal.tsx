import * as React from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
const FUNCTION_NAME_MAX = 30;
const BODY_MAX = 4000;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function KeyValueTable({
  rows,
  onChange,
  label,
}: {
  rows: KeyValuePair[];
  onChange: (rows: KeyValuePair[]) => void;
  label: string;
}) {
  const handleKeyChange = (id: string, key: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, key } : r)));

  const handleValueChange = (id: string, value: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, value } : r)));

  const handleDelete = (id: string) =>
    onChange(rows.filter((r) => r.id !== id));

  const handleAdd = () =>
    onChange([...rows, { id: generateId(), key: "", value: "" }]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-semantic-text-muted">{label}</span>
      <div className="border border-semantic-border-layout rounded overflow-hidden">
        {/* Header row */}
        <div className="flex bg-semantic-bg-primary border-b border-semantic-border-layout">
          <div className="flex-1 px-3 py-2.5 text-sm font-semibold text-semantic-text-muted border-r border-semantic-border-layout">
            Key
          </div>
          <div className="flex-[2] px-3 py-2.5 text-sm font-semibold text-semantic-text-muted">
            Value
          </div>
          <div className="w-10" />
        </div>
        {/* Data rows */}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex border-b border-semantic-border-layout last:border-b-0"
          >
            <input
              type="text"
              value={row.key}
              onChange={(e) => handleKeyChange(row.id, e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2.5 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary border-r border-semantic-border-layout outline-none focus:bg-semantic-bg-hover"
            />
            <input
              type="text"
              value={row.value}
              onChange={(e) => handleValueChange(row.id, e.target.value)}
              placeholder="Type {{ to add variables"
              className="flex-[2] px-3 py-2.5 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none focus:bg-semantic-bg-hover"
            />
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="w-10 flex items-center justify-center text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors"
              aria-label="Delete row"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {/* Empty input row */}
        <div className="flex">
          <input
            type="text"
            placeholder="Key"
            readOnly
            onClick={handleAdd}
            className="flex-1 px-3 py-2.5 text-sm placeholder:text-semantic-text-muted bg-semantic-bg-primary border-r border-semantic-border-layout outline-none cursor-pointer"
          />
          <input
            type="text"
            placeholder="Type {{ to add variables"
            readOnly
            onClick={handleAdd}
            className="flex-[2] px-3 py-2.5 text-sm placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none cursor-pointer"
          />
          <div className="w-10" />
        </div>
      </div>
    </div>
  );
}

export const CreateFunctionModal = React.forwardRef<
  HTMLDivElement,
  CreateFunctionModalProps
>(({ open, onOpenChange, onSubmit, onTestApi, initialStep = 1, initialTab = "header", className }, ref) => {
  const [step, setStep] = React.useState<1 | 2>(initialStep);

  // Step 1 state
  const [name, setName] = React.useState("");
  const [prompt, setPrompt] = React.useState("");

  // Step 2 state
  const [method, setMethod] = React.useState<HttpMethod>("GET");
  const [url, setUrl] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<FunctionTabType>(initialTab);
  const [headers, setHeaders] = React.useState<KeyValuePair[]>([]);
  const [queryParams, setQueryParams] = React.useState<KeyValuePair[]>([]);
  const [body, setBody] = React.useState("");
  const [apiResponse, setApiResponse] = React.useState("");
  const [isTesting, setIsTesting] = React.useState(false);

  const reset = React.useCallback(() => {
    setStep(initialStep);
    setName("");
    setPrompt("");
    setMethod("GET");
    setUrl("");
    setActiveTab(initialTab);
    setHeaders([]);
    setQueryParams([]);
    setBody("");
    setApiResponse("");
  }, [initialStep, initialTab]);

  const handleClose = React.useCallback(() => {
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const handleNext = () => {
    if (name.trim() && prompt.trim()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = () => {
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
      const step2: CreateFunctionStep2Data = { method, url, headers, queryParams, body };
      const response = await onTestApi(step2);
      setApiResponse(response);
    } finally {
      setIsTesting(false);
    }
  };

  const isStep1Valid = name.trim().length > 0 && prompt.trim().length > 0;
  const tabCount = {
    header: headers.length,
    queryParams: queryParams.length,
    body: 0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={ref} size="lg" className={cn(className)}>
        <DialogHeader>
          <DialogTitle>Create Function</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            {/* Function Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fn-name"
                className="text-sm font-semibold text-semantic-text-primary"
              >
                Functions Name{" "}
                <span className="text-semantic-error-primary font-semibold">*</span>
              </label>
              <div className="relative">
                <input
                  id="fn-name"
                  type="text"
                  value={name}
                  maxLength={FUNCTION_NAME_MAX}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name of the function"
                  className={cn(
                    "w-full h-10 px-4 py-2.5 pr-16 text-sm rounded border",
                    "border-semantic-border-input bg-semantic-bg-primary",
                    "text-semantic-text-primary placeholder:text-semantic-text-muted",
                    "outline-none hover:border-semantic-border-input-focus",
                    "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs italic text-semantic-text-muted">
                  {name.length}/{FUNCTION_NAME_MAX}
                </span>
              </div>
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fn-prompt"
                className="text-sm font-semibold text-semantic-text-primary"
              >
                Prompt{" "}
                <span className="text-semantic-error-primary font-semibold">*</span>
              </label>
              <textarea
                id="fn-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the Description of the functions"
                rows={5}
                className={cn(
                  "w-full px-4 py-2.5 text-sm rounded border",
                  "border-semantic-border-input bg-semantic-bg-primary resize-none",
                  "text-semantic-text-primary placeholder:text-semantic-text-muted",
                  "outline-none hover:border-semantic-border-input-focus",
                  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={handleNext}
                disabled={!isStep1Valid}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* API URL */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-semantic-text-muted tracking-[0.048px]">API url</span>
              <div className="flex h-10 border border-semantic-border-input rounded overflow-hidden hover:border-semantic-border-input-focus focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] transition-shadow">
                {/* Method selector */}
                <div className="relative shrink-0">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as HttpMethod)}
                    className="h-full pl-4 pr-9 text-sm text-semantic-text-primary bg-semantic-bg-primary border-r border-semantic-border-input outline-none cursor-pointer appearance-none w-[104px]"
                    aria-label="HTTP method"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-semantic-text-muted pointer-events-none shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL or Type {{ to add variables"
                  className="flex-1 px-4 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-semantic-bg-primary outline-none"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-0 border-b border-semantic-border-layout">
                {(["header", "queryParams", "body"] as FunctionTabType[]).map(
                  (tab) => {
                    const labels: Record<FunctionTabType, string> = {
                      header: `Header(${tabCount.header})`,
                      queryParams: `Query parameter(${tabCount.queryParams})`,
                      body: "Body",
                    };
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-2.5 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap",
                          activeTab === tab
                            ? "text-semantic-text-secondary border-b-2 border-semantic-text-secondary -mb-px"
                            : "text-semantic-text-muted"
                        )}
                      >
                        {labels[tab]}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "header" && (
                <KeyValueTable
                  rows={headers}
                  onChange={setHeaders}
                  label="Header"
                />
              )}
              {activeTab === "queryParams" && (
                <KeyValueTable
                  rows={queryParams}
                  onChange={setQueryParams}
                  label="Query parameter"
                />
              )}
              {activeTab === "body" && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-semantic-text-muted">Body</span>
                  <div className="relative">
                    <textarea
                      value={body}
                      maxLength={BODY_MAX}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Enter request body (JSON, XML etc). Type {{ to add variables"
                      rows={6}
                      className={cn(
                        "w-full px-4 py-2.5 pb-7 text-sm rounded border resize-none",
                        "border-semantic-border-input bg-semantic-bg-primary",
                        "text-semantic-text-primary placeholder:text-semantic-text-muted",
                        "outline-none hover:border-semantic-border-input-focus",
                        "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                      )}
                    />
                    <span className="absolute bottom-2 right-3 text-xs italic text-semantic-text-muted">
                      {body.length}/{BODY_MAX}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Test Your API */}
            <div className="flex flex-col gap-6">
              {/* Label stacked above full-width divider */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
                  Test Your API
                </span>
                <div className="border-t border-semantic-border-layout w-full" />
              </div>
              {/* Test API button right-aligned */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={isTesting || !url.trim()}
                  className="h-10 px-6 rounded text-sm font-semibold text-semantic-text-secondary bg-semantic-primary-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-semantic-primary-surface/80"
                >
                  {isTesting ? "Testing..." : "Test API"}
                </button>
              </div>
              {/* Row 3: Response from API */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-semantic-text-muted">
                  Response from API
                </span>
                <textarea
                  readOnly
                  value={apiResponse}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded border border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary resize-none outline-none"
                  placeholder=""
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button variant="default" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

CreateFunctionModal.displayName = "CreateFunctionModal";
