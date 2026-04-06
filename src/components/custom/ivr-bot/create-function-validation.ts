import type { KeyValuePair } from "./types";

/** HTTP(S) URL prefix check — used for Create Function API URL field. */
export const URL_REGEX = /^https?:\/\//;

export const HEADER_KEY_REGEX = /^[!#$%&'*+\-.^_`|~0-9a-zA-Z]+$/;

/**
 * Default max rows for headers and query params on CreateFunctionModal when the parent
 * omits `maxHeaderRows` / `maxQueryParamRows`.
 */
export const HEADER_MAX_ROWS = 20;

/** Clamp key/value rows to a maximum length (used for headers and query params). */
export function clampKeyValueRows(rows: KeyValuePair[], maxRows: number): KeyValuePair[] {
  const max =
    typeof maxRows === "number" && Number.isFinite(maxRows) && maxRows >= 1
      ? Math.floor(maxRows)
      : HEADER_MAX_ROWS;
  if (rows.length <= max) return rows;
  return rows.slice(0, max);
}

/** Single message for invalid header keys (KeyValueTable + submit validation). */
export const HEADER_KEY_INVALID_MESSAGE =
  "Invalid header key. Use only alphanumeric and !#$%&'*+-.^_`|~ characters.";

// Query parameter validation (aligned with apiIntegrationSchema.queryParams)
export const QUERY_PARAM_KEY_MAX = 512;
export const QUERY_PARAM_VALUE_MAX = 2048;
export const QUERY_PARAM_KEY_PATTERN = /^[a-zA-Z0-9_.\-~]+$/;

export function validateQueryParamKey(key: string): string | undefined {
  if (!key.trim()) return "Query param key is required";
  if (key.length > QUERY_PARAM_KEY_MAX) return "key cannot exceed 512 characters.";
  if (!QUERY_PARAM_KEY_PATTERN.test(key)) return "Invalid query parameter key.";
  return undefined;
}

export function validateQueryParamValue(value: string): string | undefined {
  if (!value.trim()) return "Query param value is required";
  if (value.length > QUERY_PARAM_VALUE_MAX) return "value cannot exceed 2048 characters.";
  return undefined;
}

/**
 * Submit-time errors for a single query row (shown below the table after submit attempt).
 * Every row must have a non-empty key and value (including rows added via "Add row").
 */
export function getQueryParamRowSubmitErrors(row: KeyValuePair): HeaderRowFieldErrors {
  const errors: HeaderRowFieldErrors = {};
  const keyErr = validateQueryParamKey(row.key);
  const valErr = validateQueryParamValue(row.value);
  if (keyErr) errors.key = keyErr;
  if (valErr) errors.value = valErr;
  return errors;
}

export function queryParamsHaveErrors(rows: KeyValuePair[]): boolean {
  return rows.some((row) => {
    const e = getQueryParamRowSubmitErrors(row);
    return Boolean(e.key || e.value);
  });
}

/** Create/Edit function variable modal — description is required by the product API. */
export const VARIABLE_DESCRIPTION_REQUIRED_MESSAGE = "Description is required";

export const URL_REQUIRED_MESSAGE = "API URL is required";
export const URL_FORMAT_MESSAGE =
  "Invalid API endpoint. Please enter a valid URL.";

/** On save: URL is required and must match URL_REGEX (http/https). */
export function getUrlSubmitValidationError(value: string): string {
  const t = value.trim();
  if (!t) return URL_REQUIRED_MESSAGE;
  if (!URL_REGEX.test(t)) return URL_FORMAT_MESSAGE;
  return "";
}

/** On blur while typing: empty clears; non-empty must match URL_REGEX. */
export function getUrlBlurValidationError(value: string): string {
  if (value.trim() && !URL_REGEX.test(value.trim())) return URL_FORMAT_MESSAGE;
  return "";
}

export const BODY_JSON_ERROR_MESSAGE = "Body must be valid JSON";

/** Empty body is valid; non-empty must parse as JSON. */
export function getBodyJsonValidationError(value: string): string {
  if (!value.trim()) return "";
  try {
    JSON.parse(value.trim());
    return "";
  } catch {
    return BODY_JSON_ERROR_MESSAGE;
  }
}

export type HeaderRowFieldErrors = { key?: string; value?: string };

/**
 * Submit-time header row errors (shown after submit attempt).
 * Every row must have a non-empty key and value (including rows added via "Add row");
 * key must match HEADER_KEY_REGEX when non-empty.
 */
export function getHeaderRowSubmitErrors(row: KeyValuePair): HeaderRowFieldErrors {
  const keyT = row.key.trim();
  const valT = row.value.trim();
  const errors: HeaderRowFieldErrors = {};
  if (!keyT) errors.key = "Header key is required";
  else if (!HEADER_KEY_REGEX.test(row.key)) {
    errors.key = HEADER_KEY_INVALID_MESSAGE;
  }
  if (!valT) errors.value = "Header value is required";
  return errors;
}

export function headerRowsHaveSubmitErrors(rows: KeyValuePair[]): boolean {
  return rows.some((row) => {
    const e = getHeaderRowSubmitErrors(row);
    return Boolean(e.key || e.value);
  });
}

/** Shown under API tabs on Submit when URL/body row checks pass but no pair is complete. */
export const HEADER_OR_QUERY_PAIR_REQUIRED_MESSAGE =
  "Add at least one header or query parameter with both a key and a value.";

/** True if some header or query row has non-empty key and value (trimmed). */
export function hasAtLeastOneCompleteKeyValueRow(
  headers: KeyValuePair[],
  queryParams: KeyValuePair[]
): boolean {
  const rowComplete = (row: KeyValuePair) =>
    Boolean(row.key.trim() && row.value.trim());
  return headers.some(rowComplete) || queryParams.some(rowComplete);
}
