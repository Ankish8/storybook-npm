import * as React from "react";
import { cn } from "../../../lib/utils";
import { VariableChip } from "./variable-chip";
import { VariableSelector } from "./variable-selector";
import { SelectedVariablesPopover } from "./selected-variables-popover";
import {
  parseValueToSegments,
  removeLastVariableOrChar,
  type ValueSegment,
  type VariableValueInputProps,
  type VariableSelectorItem,
} from "./types";

/** Figma: show one variable chip inline, then "…" for the rest in a single row. */
const DEFAULT_MAX_VISIBLE_CHIPS = 1;

/** True when `value` ends with an incomplete variable token (`{{` … no closing `}}` yet). */
function hasIncompleteVariableTrigger(value: string): boolean {
  return /\{\{[^}]*$/.test(value);
}

/**
 * Splits segments into visible (first maxVisible variable chips + text) and overflow variable names.
 */
function splitSegmentsForOverflow(
  segments: ValueSegment[],
  maxVisible: number
): { visible: ValueSegment[]; overflowNames: string[] } {
  const visible: ValueSegment[] = [];
  const overflowNames: string[] = [];
  let variableCount = 0;
  for (const seg of segments) {
    if (seg.type === "text") {
      visible.push(seg);
    } else {
      if (variableCount < maxVisible) {
        visible.push(seg);
        variableCount++;
      } else {
        overflowNames.push(seg.name);
      }
    }
  }
  return { visible, overflowNames };
}

export const VariableValueInput = React.forwardRef<
  HTMLDivElement,
  VariableValueInputProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Type {{ to add variables",
      variableSections = [],
      maxVisibleChips = DEFAULT_MAX_VISIBLE_CHIPS,
      overflowButtonLabel = () => "",
      showEditIcon = true,
      onSelectVariable,
      onEditVariableChip,
      onAddNewVariable,
      onEditVariable,
      maxLength,
      onBlur,
      containerRef: containerRefProp,
      className,
    },
    ref
  ) => {
    const internalContainerRef = React.useRef<HTMLDivElement>(null);
    const overflowButtonRef = React.useRef<HTMLButtonElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = containerRefProp ?? internalContainerRef;

    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const [pendingInput, setPendingInput] = React.useState("");
    const [selectorOpen, setSelectorOpen] = React.useState(false);
    const [overflowPopoverOpen, setOverflowPopoverOpen] = React.useState(false);

    const valueRef = React.useRef(value);
    React.useEffect(() => {
      valueRef.current = value;
    }, [value]);

    const segments = React.useMemo(() => parseValueToSegments(value), [value]);
    const { visible, overflowNames } = React.useMemo(
      () => splitSegmentsForOverflow(segments, maxVisibleChips),
      [segments, maxVisibleChips]
    );

    /** Keeps the caret next to content; placeholder needs room when the field is empty. */
    const inputSizeAttr = React.useMemo(() => {
      if (pendingInput.length > 0) {
        return Math.min(Math.max(pendingInput.length + 1, 2), 120);
      }
      if (visible.length === 0) {
        return Math.min(Math.max(placeholder.length, 2), 48);
      }
      return 2;
    }, [pendingInput.length, visible.length, placeholder]);

    const overflowRawLabel =
      overflowNames.length > 0
        ? overflowButtonLabel(overflowNames.length)
        : "";
    const overflowExtraLabel = overflowRawLabel.trim();

    React.useEffect(() => {
      setPendingInput("");
    }, [value]);

    const handleSelectVariable = React.useCallback(
      (item: VariableSelectorItem) => {
        let base = valueRef.current;
        const incomplete = base.match(/\{\{[^}]*$/);
        if (incomplete && incomplete.index !== undefined) {
          base = base.slice(0, incomplete.index);
        }
        const newValue = base + `{{${item.name}}}`;
        onChange(newValue);
        setPendingInput("");
        setSelectorOpen(false);
        onSelectVariable?.(item);
      },
      [onChange, onSelectVariable]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      const merged = valueRef.current + next;
      if (maxLength !== undefined && merged.length > maxLength) {
        return;
      }
      setPendingInput(next);
      onChange(merged);
      setSelectorOpen(hasIncompleteVariableTrigger(merged));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;
      if (pendingInput.length > 0) return;
      e.preventDefault();
      const next = removeLastVariableOrChar(valueRef.current);
      if (next !== valueRef.current) {
        onChange(next);
        setSelectorOpen(hasIncompleteVariableTrigger(next));
      }
    };

    const handleOpenSelectorChange = React.useCallback((next: boolean) => {
      setSelectorOpen(next);
    }, []);

    const handleAddNewFromSelector = React.useCallback(() => {
      setSelectorOpen(false);
      onAddNewVariable?.();
    }, [onAddNewVariable]);

    const handleEditFromSelector = React.useCallback(
      (item: VariableSelectorItem) => {
        setSelectorOpen(false);
        onEditVariable?.(item);
      },
      [onEditVariable]
    );

    /**
     * Focus the real `<input>` when the user clicks anywhere on the field (text, chips, trailing
     * spacer). Uses **capture** so nested content cannot swallow the event before we run; skips
     * real `<button>`s (overflow …, chip pencil).
     */
    const handleFieldPointerDownCapture = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest("button")) return;
        if (target.closest("input")) return;
        if ("button" in e && typeof e.button === "number" && e.button !== 0) return;
        e.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
      },
      []
    );

    return (
      <div
        ref={setRootRef}
        onPointerDownCapture={handleFieldPointerDownCapture}
        onMouseDownCapture={handleFieldPointerDownCapture}
        className={cn(
          "flex h-10 min-h-10 w-full min-w-0 cursor-text items-center gap-1.5 overflow-hidden rounded border border-semantic-border-input bg-semantic-bg-primary px-3 text-sm text-semantic-text-primary focus-within:border-semantic-border-input-focus focus-within:outline-none focus-within:ring-1 focus-within:ring-semantic-border-input-focus",
          className
        )}
        data-state={undefined}
      >
        <div
          ref={containerRef}
          className="flex min-h-0 min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden"
        >
          {visible.map((seg, i) =>
            seg.type === "text" ? (
              seg.value && seg.value.trim() ? (
                <span
                  key={`t-${i}`}
                  className="min-w-0 shrink truncate"
                >
                  {seg.value}
                </span>
              ) : null
            ) : (
              <VariableChip
                key={`v-${i}-${seg.name}`}
                name={seg.name}
                showEditIcon={showEditIcon}
                onEdit={onEditVariableChip}
              />
            )
          )}
          {overflowNames.length > 0 && (
            <>
              <button
                ref={overflowButtonRef}
                type="button"
                aria-label={
                  overflowExtraLabel
                    ? overflowRawLabel
                    : `${overflowNames.length} more variable${overflowNames.length === 1 ? "" : "s"} — show all`
                }
                onClick={() => setOverflowPopoverOpen(true)}
                className="flex shrink-0 cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-sm text-semantic-text-secondary hover:bg-semantic-bg-ui hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-input-focus focus-visible:ring-offset-1"
              >
                <span className="font-normal uppercase tracking-[0.056px]">
                  ...
                </span>
                {overflowExtraLabel ? (
                  <span>{overflowRawLabel}</span>
                ) : null}
              </button>
              <SelectedVariablesPopover
                open={overflowPopoverOpen}
                onOpenChange={setOverflowPopoverOpen}
                anchorRef={rootRef}
                segments={segments}
                showEditIcon={showEditIcon}
                onEditVariable={onEditVariableChip}
              />
            </>
          )}
          <input
            ref={inputRef}
            type="text"
            size={inputSizeAttr}
            value={pendingInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={onBlur}
            maxLength={
              maxLength === undefined
                ? undefined
                : Math.max(0, maxLength - value.length)
            }
            placeholder={visible.length === 0 && !pendingInput ? placeholder : ""}
            className="min-w-[2ch] max-w-full shrink-0 cursor-text border-0 bg-transparent p-0 text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-muted"
            aria-label={placeholder}
          />
          {/* Absorb extra row width after the caret so text + input stay left-aligned. */}
          <span
            className="min-h-px min-w-0 flex-1 self-stretch"
            aria-hidden
          />
        </div>

        <VariableSelector
          open={selectorOpen}
          onOpenChange={handleOpenSelectorChange}
          anchorRef={containerRef}
          sections={variableSections}
          showEditIcon={showEditIcon}
          onSelectVariable={handleSelectVariable}
          onAddNewVariable={
            onAddNewVariable ? handleAddNewFromSelector : undefined
          }
          onEditVariable={
            onEditVariable ? handleEditFromSelector : undefined
          }
        />
      </div>
    );
  }
);
VariableValueInput.displayName = "VariableValueInput";
