import * as React from "react";
import { createPortal } from "react-dom";
import { Search, Plus, Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { VariableSelectorProps, VariableSelectorItem, VariableSelectorSection } from "./types";

const POPOVER_OFFSET = 4;
const POPOVER_WIDTH = 427;
const MAX_HEIGHT = 248;

function filterSectionsBySearch(
  sections: VariableSelectorSection[],
  search: string
): VariableSelectorSection[] {
  const q = search.trim().toLowerCase();
  if (!q) return sections;
  return sections
    .map((section) => ({
      ...section,
      variables: section.variables.filter((v) =>
        v.name.toLowerCase().includes(q)
      ),
    }))
    .filter((s) => s.variables.length > 0);
}

export const VariableSelector = React.forwardRef<
  HTMLDivElement,
  VariableSelectorProps
>(
  (
    {
      open,
      onOpenChange,
      anchorRef,
      sections,
      searchPlaceholder = "Search",
      addNewLabel = "Add new variable",
      showEditIcon = true,
      onSelectVariable,
      onAddNewVariable,
      onEditVariable,
      onSearchChange,
      className,
    },
    _ref
  ) => {
    const [search, setSearch] = React.useState("");
    const panelRef = React.useRef<HTMLDivElement>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof _ref === "function") _ref(node);
        else if (_ref) (_ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [_ref]
    );

    const filteredSections = React.useMemo(
      () => filterSectionsBySearch(sections, search),
      [sections, search]
    );

    const [position, setPosition] = React.useState({ top: 0, left: 0 });

    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (!open) {
        setSearch("");
        return;
      }
      const tick = requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(tick);
    }, [open]);

    React.useEffect(() => {
      if (!open || !anchorRef.current) return;
      const el = anchorRef.current;
      const updatePosition = () => {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: rect.bottom + POPOVER_OFFSET,
          left: rect.left,
        });
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }, [open, anchorRef]);

    React.useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onOpenChange(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    React.useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          panelRef.current?.contains(target) ||
          anchorRef.current?.contains(target)
        )
          return;
        onOpenChange(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onOpenChange, anchorRef]);

    const handleSelect = (item: VariableSelectorItem) => {
      onSelectVariable?.(item);
      onOpenChange(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      onSearchChange?.(value);
    };

    if (!open) return null;

    const content = (
      <div
        ref={setRefs}
        role="listbox"
        aria-label="Select variable"
        className={cn(
          "fixed z-[10000] flex flex-col overflow-hidden rounded border border-semantic-border-layout bg-semantic-bg-primary p-4 text-semantic-text-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          width: POPOVER_WIDTH,
          maxHeight: MAX_HEIGHT,
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3.5">
            {/* Search: Figma h-[38px], icon on right, placeholder #999 14px */}
            <div className="flex h-[38px] items-center rounded border border-semantic-border-layout bg-semantic-bg-primary px-2 py-1">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="m-0 min-w-0 flex-1 border-0 bg-transparent text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-muted"
                aria-label={searchPlaceholder}
              />
              <Search className="h-3 w-3 shrink-0 text-semantic-text-muted" aria-hidden />
            </div>

            {onAddNewVariable && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onAddNewVariable();
                }}
                className="flex w-full cursor-pointer items-center gap-1.5 text-left font-semibold text-sm text-semantic-text-secondary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-input-focus focus-visible:ring-offset-2"
                aria-label={addNewLabel}
              >
                <Plus className="h-3.5 w-3.5 shrink-0 text-semantic-text-secondary" aria-hidden />
                <span>{addNewLabel}</span>
              </button>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
            {filteredSections.length === 0 ? (
              <p className="m-0 py-2 text-sm text-semantic-text-muted">
                No variables found
              </p>
            ) : (
              filteredSections.map((section, sectionIndex) => (
                <div
                  key={`${section.label}-${sectionIndex}`}
                  className="flex flex-col"
                >
                  {sectionIndex > 0 && (
                    <div className="my-0 border-t border-semantic-border-layout" aria-hidden />
                  )}
                  <p className="m-0 py-2.5 text-sm text-semantic-text-muted">
                    {section.label}
                  </p>
                  <ul className="m-0 list-none p-0">
                    {section.variables.map((item) => (
                      <li key={item.id} className="m-0">
                        {/* Sibling buttons — never nest <button> inside <button> (invalid HTML; breaks pencil clicks). */}
                        <div className="flex h-[37px] w-full items-center gap-1 py-2.5">
                          <button
                            type="button"
                            role="option"
                            onClick={() => handleSelect(item)}
                            className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm text-semantic-text-primary hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui focus:outline-none"
                          >
                            {item.name}
                          </button>
                          {showEditIcon && onEditVariable && (
                            <button
                              type="button"
                              aria-label={`Edit ${item.name}`}
                              onClick={() => {
                                onEditVariable(item);
                                onOpenChange(false);
                              }}
                              className="shrink-0 cursor-pointer rounded p-0.5 text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-input-focus focus-visible:ring-offset-1"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

    return createPortal(content, document.body);
  }
);
VariableSelector.displayName = "VariableSelector";
