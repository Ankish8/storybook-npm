import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { TextField } from "../../../ui/text-field";
import type { CallLogsSearchBarProps, CallLogsSearchBarSuggestion } from "./types";

/* ── Suggestion label with the matched substring bolded ── */

function HighlightedLabel({ label, query }: { label: string; query: string }) {
  const matchIndex = query ? label.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (matchIndex === -1) return <>{label}</>;

  return (
    <>
      {label.slice(0, matchIndex)}
      <span className="font-semibold">{label.slice(matchIndex, matchIndex + query.length)}</span>
      {label.slice(matchIndex + query.length)}
    </>
  );
}

/* ── Main component ── */

/**
 * CallLogsSearchBar is the Call Logs page header search — a text input with a
 * leading search icon and a clear button, plus a live-suggestions dropdown
 * that opens while the input is focused and non-empty. The matching substring
 * in each suggestion is bolded. Selecting a suggestion commits its label as
 * the input value, closes the dropdown, and blurs the input.
 *
 * @example
 * ```tsx
 * <CallLogsSearchBar
 *   value={query}
 *   onValueChange={setQuery}
 *   suggestions={matches.map((m) => ({ value: m.id, label: m.phoneNumber }))}
 *   onSelect={(s) => setQuery(s.label)}
 *   onClear={() => setQuery("")}
 * />
 * ```
 */
const CallLogsSearchBar = React.forwardRef<HTMLInputElement, CallLogsSearchBarProps>(
  (
    {
      value,
      onValueChange,
      suggestions = [],
      onSelect,
      onClear,
      placeholder = "Search caller, number, agents, departments...",
      wrapperClassName,
      className,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const isOpen = isFocused && value.length > 0 && suggestions.length > 0;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleSelect = (suggestion: CallLogsSearchBarSuggestion) => {
      onSelect?.(suggestion);
      setIsFocused(false);
      inputRef.current?.blur();
    };

    return (
      <div className={cn("relative w-full", className, wrapperClassName)}>
        <TextField
          ref={mergedRef}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsFocused(false);
              inputRef.current?.blur();
            }
            onKeyDown?.(event);
          }}
          leftIcon={<Search aria-hidden="true" />}
          clearable
          onClear={onClear}
          placeholder={placeholder}
          {...props}
        />

        {isOpen && (
          <div
            role="listbox"
            className="absolute inset-x-0 top-full z-[100] mt-1 max-h-60 overflow-y-auto rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1.5 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_-1px_rgba(10,13,18,0.1)]"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.value}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(suggestion)}
                className="flex w-full items-center rounded px-4 py-2.5 text-left text-base text-semantic-text-primary hover:bg-semantic-bg-ui"
              >
                <HighlightedLabel label={suggestion.label} query={value} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
CallLogsSearchBar.displayName = "CallLogsSearchBar";

export { CallLogsSearchBar };
