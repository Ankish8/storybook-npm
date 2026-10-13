import { useLayoutEffect, useRef, useState } from "react";
import { Tag } from "@/components/ui/v2/tag";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [filters, setFilters] = useState(["Support", "Unassigned", "Today"]);
  const [keepSupport, setKeepSupport] = useState(false);
  const [notice, setNotice] = useState("");
  const tagRefs = useRef(new Map<string, HTMLSpanElement>());
  const resetRef = useRef<HTMLButtonElement>(null);
  const focusAfterRemoval = useRef<string | null>(null);

  useLayoutEffect(() => {
    const target = focusAfterRemoval.current;
    focusAfterRemoval.current = null;
    if (!target) return;
    if (target === "reset") resetRef.current?.focus();
    else
      tagRefs.current
        .get(target)
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus();
  }, [filters]);
  return (
    <div className="grid max-w-sm gap-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Tag
            key={filter}
            ref={(node) => {
              if (node) tagRefs.current.set(filter, node);
              else tagRefs.current.delete(filter);
            }}
            onRemove={(event) => {
              if (keepSupport && filter === "Support") event.preventDefault();
              if (event.defaultPrevented) {
                setNotice(filter + " kept. Removal canceled.");
                return;
              }
              if (
                event.currentTarget ===
                event.currentTarget.ownerDocument.activeElement
              ) {
                const index = filters.indexOf(filter);
                focusAfterRemoval.current =
                  filters[index + 1] ?? filters[index - 1] ?? "reset";
              }
              setFilters((current) =>
                current.filter((value) => value !== filter)
              );
              setNotice(filter + " removed.");
            }}
            removeAriaLabel={`Remove ${filter} filter`}
          >
            {filter}
          </Tag>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-semantic-text-secondary">
        <input
          type="checkbox"
          checked={keepSupport}
          onChange={(event) => setKeepSupport(event.target.checked)}
        />
        Keep Support filter
      </label>
      <Button
        ref={resetRef}
        size="sm"
        variant="outline"
        onClick={() => {
          setFilters(["Support", "Unassigned", "Today"]);
          setNotice("All filters restored.");
        }}
      >
        Reset filters
      </Button>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {filters.length} filters active. {notice}
      </p>
    </div>
  );
}
