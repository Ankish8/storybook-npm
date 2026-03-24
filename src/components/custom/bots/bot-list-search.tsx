import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { BotListSearchProps } from "./types";

export const BotListSearch = React.forwardRef(
  (
    {
      value,
      placeholder = "Search bot...",
      onSearch,
      defaultValue,
      className,
      ...props
    }: BotListSearchProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const displayValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternalValue(next);
      onSearch?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 h-9 sm:h-10 px-2.5 sm:px-3 border border-semantic-border-input rounded bg-semantic-bg-primary min-w-0 shrink-0",
          "hover:border-semantic-border-input-focus focus-within:border-semantic-border-input-focus",
          "focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] w-full max-w-full sm:max-w-[180px] md:max-w-[220px] sm:shrink-0",
          className
        )}
        {...props}
      >
        <Search className="size-[14px] text-semantic-text-muted shrink-0" />
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none w-full min-w-0"
          aria-label={placeholder}
        />
      </div>
    );
  }
);

BotListSearch.displayName = "BotListSearch";
